-- AskPIP — Bush Rose V1 Supabase schema
--
-- Implements the persistence layer for the Minimum Information Model defined
-- in the approved Bush Rose V1 MVP Architecture, §6:
--   §6.1 Bush Rose Profile     -> public.bush_rose_profiles
--   §6.3 Pruning Session        -> public.observations (one row per observation
--                                  recorded during a guided journey)
--   §6.4 Follow-Up              -> public.follow_ups
--
-- and the PKR (PIP Knowledge Record) table that will eventually hold KIT's
-- published, Founder-approved knowledge (PKR_Standard.md). The `pkr` table is
-- included now, empty and locked down, so the RLS boundary that enforces the
-- KIT Charter's "no self-approval" rule exists from day one — the app's
-- anon/authenticated roles get read access to published records only, and
-- have no INSERT/UPDATE/DELETE policy at all. Only the service_role key
-- (never shipped to the client) can write to it.
--
-- This file is idempotent (safe to re-run) — run it once in the Supabase
-- project's SQL Editor: Dashboard -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Gardener-owned data (client/session data — never KCS knowledge, per
-- LIL_Standard.md "Boundary With Gardener-Supplied Data")
-- ---------------------------------------------------------------------------

create table if not exists public.bush_rose_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  variety text not null default '',
  variety_source text not null default '',
  location text not null default '',
  -- How `location` was gathered, and what could actually be derived from
  -- it. Added to support Pip stating the gardener's current season without
  -- asking for it directly (Architecture §6.1/§6.4) — see src/lib/location.ts.
  -- location_method distinguishes a GPS-based entry (latitude/longitude
  -- set) from a manually-typed one (location_city/location_region/
  -- location_country set); hemisphere is derived once, at save time, from
  -- whichever method was used, and left null rather than guessed when it
  -- can't be determined confidently (an unrecognized manual country, or
  -- one that straddles the equator).
  location_method text check (location_method in ('geolocation', 'manual')),
  location_city text,
  location_region text,
  location_country text,
  latitude double precision,
  longitude double precision,
  hemisphere text check (hemisphere in ('northern', 'southern')),
  -- Free-text planting context ("about 3 years ago", "not sure") — Architecture
  -- §6.1's "planting context" profile field, added to support the recently
  -- planted Suitability Gate (PKR-SGT-000002). Nullable/blank is a valid answer
  -- (gardener skipped or doesn't know) and is the gate's "unknown" case.
  planted_when text,
  personal_meaning text,
  -- A record of what the pre-journey safety checklist actually looked like
  -- when the gardener continued past it (Journey.tsx's 'safety' phase). This
  -- is NOT a gate — continuing no longer requires every item checked, since
  -- no cutting decision has been made at that point in the journey (that
  -- happens later, per observation, in the 'decide' phase). It exists so
  -- there's an honest record that the checklist — including the tool
  -- condition, protective gear and safe-access items — was actually shown to
  -- the gardener and what they said about each one, even if they chose to
  -- proceed with something left unchecked. jsonb array of {label, checked}.
  safety_checklist jsonb,
  safety_acknowledged_at timestamptz,
  -- Storage paths, not URLs — the plant-photos bucket below is private, so a
  -- display URL is always fetched fresh as a time-limited signed URL (see
  -- src/lib/photos.ts) rather than stored. Set from NewPlant.tsx's onboarding
  -- questionnaire (optional, skippable) and reused as this plant's cover
  -- photo everywhere it's shown (Library.tsx, this plant's own hero card).
  --
  -- Deliberately NOT read by Journey.tsx's 'photos' phase — see
  -- journey_overview_photo_path/journey_close_up_photo_paths below for why.
  overview_photo_path text,
  -- Free text for anything on a nursery label worth keeping beyond the
  -- variety name itself (a plant code, breeder, care notes) — its own
  -- question in NewPlant.tsx ("Is there a nursery label?"), separate from
  -- `variety`, since a label often carries more than just the name.
  variety_label_note text,
  -- A photo of the nursery tag/label itself, offered alongside
  -- variety_label_note above as an alternative (or companion) to typing it
  -- out. Purely a reference photo; nothing reads it back to auto-fill any
  -- other field.
  variety_label_photo_path text,
  -- Journey.tsx's 'photos' phase requires these before an observation
  -- session — always captured fresh for that journey, never pre-filled from
  -- overview_photo_path above. A pruning journey can start years after a
  -- plant was added (that's the whole point of the recently-planted
  -- suitability gate), so the plant may look nothing like its onboarding
  -- cover photo by then; Pip needs a genuinely current photo to help assess
  -- it, not a stale one the gate would otherwise let a gardener click past
  -- without ever taking.
  journey_overview_photo_path text,
  -- An array, not a single slot: the phase's prompt asks for "a few
  -- close-ups of where stems cross or look uncertain," which one fixed slot
  -- couldn't actually deliver (a second close-up just overwrote the first,
  -- with nowhere to add more). One row per upload, via
  -- src/lib/photos.ts's journeyCloseUpPhotoPath.
  journey_close_up_photo_paths text[] not null default '{}',
  journey_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Idempotent adds for databases created before these columns existed.
alter table public.bush_rose_profiles add column if not exists planted_when text;
alter table public.bush_rose_profiles add column if not exists location_method text check (location_method in ('geolocation', 'manual'));
alter table public.bush_rose_profiles add column if not exists location_city text;
alter table public.bush_rose_profiles add column if not exists location_region text;
alter table public.bush_rose_profiles add column if not exists location_country text;
alter table public.bush_rose_profiles add column if not exists latitude double precision;
alter table public.bush_rose_profiles add column if not exists longitude double precision;
alter table public.bush_rose_profiles add column if not exists hemisphere text check (hemisphere in ('northern', 'southern'));
alter table public.bush_rose_profiles add column if not exists safety_checklist jsonb;
alter table public.bush_rose_profiles add column if not exists safety_acknowledged_at timestamptz;
alter table public.bush_rose_profiles add column if not exists overview_photo_path text;
alter table public.bush_rose_profiles add column if not exists variety_label_note text;
alter table public.bush_rose_profiles add column if not exists variety_label_photo_path text;
alter table public.bush_rose_profiles add column if not exists journey_overview_photo_path text;

-- journey_close_up_photo_paths went through two prior shapes on a database
-- that predates it: close_up_photo_path (single slot, shared with the
-- profile's overview photo before that split existed), then
-- journey_close_up_photo_path (single slot, but scoped to the journey after
-- the split). Each step below is a no-op once it's already happened, and
-- preserves whatever was already uploaded rather than dropping it.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bush_rose_profiles' and column_name = 'close_up_photo_path'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bush_rose_profiles' and column_name = 'journey_close_up_photo_path'
  ) then
    alter table public.bush_rose_profiles rename column close_up_photo_path to journey_close_up_photo_path;
  end if;
end $$;

alter table public.bush_rose_profiles add column if not exists journey_close_up_photo_paths text[] not null default '{}';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'bush_rose_profiles' and column_name = 'journey_close_up_photo_path'
  ) then
    update public.bush_rose_profiles
    set journey_close_up_photo_paths = array[journey_close_up_photo_path]
    where journey_close_up_photo_path is not null
      and journey_close_up_photo_paths = '{}';

    alter table public.bush_rose_profiles drop column journey_close_up_photo_path;
  end if;
end $$;

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.bush_rose_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null,
  pip_proposal text not null,
  comparison_note text not null,
  outcome text not null check (outcome in ('confirmed', 'corrected', 'unresolved')),
  correction text,
  choice text check (choice in ('cut', 'leave', 'decide-later', 'get-help')),
  created_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.bush_rose_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists observations_profile_id_idx on public.observations (profile_id);
create index if not exists follow_ups_profile_id_idx on public.follow_ups (profile_id);

-- ---------------------------------------------------------------------------
-- Storage: gardener-uploaded rose photos (bush_rose_profiles.overview_photo_path
-- / journey_overview_photo_path / journey_close_up_photo_paths above
-- reference paths in this bucket — see src/lib/photos.ts for the
-- upload/signed-URL helpers, PhotoUpload.tsx for the single-slot take/upload
-- UI used by the first two, and JourneyCloseUps.tsx for the gallery UI used
-- by the third).
--
-- Private bucket, not public: every read goes through a signed URL rather
-- than a plain public one. "overview" and "journey-overview" are one fixed
-- path per plant (re-uploading overwrites rather than accumulating
-- orphans); "journey-close-up/<photo_id>" accumulates, one object per
-- upload, since journey_close_up_photo_paths is a gallery. The policies
-- below use storage's own foldername() helper to check that the first path
-- segment is the requesting user's own auth.uid() — the standard Supabase
-- "each user gets their own folder" pattern — so this holds regardless of
-- how many segments follow it.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', false)
on conflict (id) do nothing;

drop policy if exists "plant_photos_insert_own" on storage.objects;
create policy "plant_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "plant_photos_select_own" on storage.objects;
create policy "plant_photos_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "plant_photos_update_own" on storage.objects;
create policy "plant_photos_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "plant_photos_delete_own" on storage.objects;
create policy "plant_photos_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'plant-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Progress-photo log: an open-ended growth record, distinct in purpose from
-- overview_photo_path/journey_overview_photo_path/
-- journey_close_up_photo_paths above (a lifetime growth timeline shown on
-- the plant's own page, vs. a single journey's decision-support photos) even
-- though this one is also a gallery. A gardener can add any number of
-- these at any time (see src/components/ProgressPhotos.tsx), not only
-- during a guided pruning journey — added specifically so a first-year rose
-- that isn't ready to prune yet, and so may never reach Journey.tsx's
-- 'photos' phase, still lets its gardener build up a photo record of how
-- it's growing. Objects live in the same plant-photos bucket, under
-- "<user_id>/<profile_id>/progress/<photo_id>" (see src/lib/photos.ts's
-- progressPhotoPath) — nested under "progress/" so they never collide with
-- the "overview"/"journey-overview"/"journey-close-up" paths even though
-- they all share the same first two path segments, and the existing bucket
-- RLS policies above (which only check the first segment) already cover
-- them with no changes needed.
-- ---------------------------------------------------------------------------

create table if not exists public.plant_photo_log (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.bush_rose_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists plant_photo_log_profile_id_idx on public.plant_photo_log (profile_id);

-- ---------------------------------------------------------------------------
-- Founder-approved knowledge (KCS output — PKR_Standard.md). Empty for now;
-- KIT will publish into this table once the LIL is actually populated.
-- ---------------------------------------------------------------------------

create table if not exists public.pkr (
  id uuid primary key default gen_random_uuid(),
  pkr_type text not null check (
    pkr_type in ('observation', 'comparison_image', 'decision_logic', 'suitability_gate', 'source', 'definition')
  ),
  content jsonb not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.bush_rose_profiles enable row level security;
alter table public.observations enable row level security;
alter table public.follow_ups enable row level security;
alter table public.plant_photo_log enable row level security;
alter table public.pkr enable row level security;

-- Gardeners can only ever see and touch their own rows.

create policy "profiles_select_own" on public.bush_rose_profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.bush_rose_profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.bush_rose_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_own" on public.bush_rose_profiles
  for delete using (auth.uid() = user_id);

create policy "observations_select_own" on public.observations
  for select using (auth.uid() = user_id);
create policy "observations_insert_own" on public.observations
  for insert with check (auth.uid() = user_id);
create policy "observations_update_own" on public.observations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "observations_delete_own" on public.observations
  for delete using (auth.uid() = user_id);

create policy "follow_ups_select_own" on public.follow_ups
  for select using (auth.uid() = user_id);
create policy "follow_ups_insert_own" on public.follow_ups
  for insert with check (auth.uid() = user_id);
create policy "follow_ups_update_own" on public.follow_ups
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "follow_ups_delete_own" on public.follow_ups
  for delete using (auth.uid() = user_id);

create policy "plant_photo_log_select_own" on public.plant_photo_log
  for select using (auth.uid() = user_id);
create policy "plant_photo_log_insert_own" on public.plant_photo_log
  for insert with check (auth.uid() = user_id);
create policy "plant_photo_log_update_own" on public.plant_photo_log
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plant_photo_log_delete_own" on public.plant_photo_log
  for delete using (auth.uid() = user_id);

-- PKR: readable only when published. Deliberately no insert/update/delete
-- policy for anon/authenticated — this is the database-level enforcement of
-- KIT's "no self-approval" boundary. Writes happen only via the service_role
-- key, from a Founder-controlled process, never from the app itself.

create policy "pkr_select_published" on public.pkr
  for select using (published = true);
