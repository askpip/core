-- AskPIP — Bush Rose V1 Supabase schema
--
-- Implements the persistence layer for the Minimum Information Model defined
-- in the approved Bush Rose V1 MVP Architecture, §6:
--   §6.1 Bush Rose Profile     -> public.bush_rose_profiles
--   §6.3 Pruning Session        -> public.observations (one row per observation
--                                  recorded during a guided journey)
--   §6.4 Follow-Up              -> public.follow_ups
--
-- and (historically) the placeholder PKR table, now replaced by the Live
-- Intelligence Library, public.lil_pkr (see the LIL section below). The `pkr` table was
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
  outcome text not null check (outcome in ('confirmed', 'corrected', 'unresolved', 'none-remaining')),
  correction text,
  choice text check (choice in ('cut', 'leave', 'decide-later', 'get-help')),
  created_at timestamptz not null default now()
);

-- 29 Sep 2026: 'none-remaining' is Journey.tsx's per-observation "no more of
-- these" marker (the gardener answered no to "Can you see any more …?"), used
-- to resume a journey when an observation had several instances.
alter table public.observations drop constraint if exists observations_outcome_check;
alter table public.observations add constraint observations_outcome_check
  check (outcome in ('confirmed', 'corrected', 'unresolved', 'none-remaining'));

-- 29 Sep 2026: the gardener's stated rose type (PKR-SGT-000003), asked once in
-- Add a plant (or at the first journey). Only hybrid-tea, floribunda and
-- grandiflora pass; the rest are journal-only. Null = not asked yet.
alter table public.bush_rose_profiles add column if not exists rose_type text
  check (rose_type in ('hybrid-tea', 'floribunda', 'grandiflora', 'excluded', 'bush-only', 'unknown'));

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
-- Founder-approved knowledge: the Live Intelligence Library (LIL).
-- Replaced the empty placeholder table public.pkr on 1 October 2026. The full
-- LIL schema (table public.lil_pkr, public.lil_publish_log, RLS and the
-- KIT-only function public.lil_publish_from_git) is kept in one place:
--   Knowledge Curation System/Live Intelligence Library/tools/lil_schema.sql
-- Applied as migration "lil_create". See AI/Skills/KIT_LIL_Publication_Skill.md.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.bush_rose_profiles enable row level security;
alter table public.observations enable row level security;
alter table public.follow_ups enable row level security;
alter table public.plant_photo_log enable row level security;

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

-- (The old pkr_select_published policy went with public.pkr; the LIL's
-- read-Published-only policy is in lil_schema.sql.)

-- ---------------------------------------------------------------------------
-- Membership: member_profiles (added 22 September 2026)
--
-- Why. The app has one sign-in method today (email one-time code). Two
-- things are added here at once, deliberately, so the schema doesn't need a
-- second retrofit later: (1) an optional password a gardener can set right
-- after their first successful code sign-in, so return visits can skip the
-- email round-trip (see AuthGate.tsx); (2) a place for a membership tier
-- (free/paid) to live, ready for a future Stripe integration, even though
-- nothing charges money yet.
--
-- Distinct from bush_rose_profiles (that table is about a gardener's roses;
-- this one is about the gardener's account). One row per auth.users row,
-- created automatically by the trigger below.
--
-- Security note: membership_tier and stripe_customer_id are NOT
-- client-writable — there is no insert/update/delete policy on this table
-- for anon/authenticated at all, only the select_own policy below. A
-- gardener's own client can never grant itself paid access by editing its
-- own row, the way it could if this lived in auth.users' user_metadata,
-- which the client can edit via updateUser(). The only writers are the
-- trigger below (new row, defaults to 'free') and mark_password_set()
-- (has_password only) — later, a service-role Stripe webhook becomes the
-- only writer of membership_tier/stripe_customer_id, never the app's own
-- anon/authenticated client.
-- ---------------------------------------------------------------------------

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  membership_tier text not null default 'free' check (membership_tier in ('free', 'paid')),
  stripe_customer_id text,
  -- Whether this gardener has set a password via AuthGate.tsx's post-code
  -- "set a password" step. Deliberately NOT derived from
  -- auth.users.encrypted_password — current Supabase/GoTrue sets that
  -- column to an unusable placeholder hash even for OTP-only accounts, so
  -- its presence doesn't mean a real, usable password was ever set (checked
  -- directly against this project's own auth.users before writing this).
  -- This flag is the only source of truth, and only mark_password_set()
  -- below is allowed to set it true.
  has_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_profiles enable row level security;

create policy "member_profiles_select_own" on public.member_profiles
  for select using (auth.uid() = user_id);

-- Deliberately no insert/update/delete policy for anon/authenticated — see
-- the security note above. Row creation and every write happen only through
-- the trigger and function below (SECURITY DEFINER), or later a
-- service-role webhook.

create or replace function public.handle_new_member_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Supabase grants EXECUTE on every new public-schema function to anon,
-- authenticated and service_role automatically at creation time (a
-- project-level default privilege) — "revoke ... from public" alone does
-- NOT undo that (confirmed against this project with
-- has_function_privilege() after first applying this migration without the
-- lines below, and by the security advisor). Revoke the specific role
-- grants directly instead.
revoke execute on function public.handle_new_member_profile() from anon, authenticated;

drop trigger if exists on_auth_user_created_member_profile on auth.users;
create trigger on_auth_user_created_member_profile
  after insert on auth.users
  for each row execute function public.handle_new_member_profile();

-- Backfill for accounts created before this migration existed.
insert into public.member_profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Lets a signed-in gardener record that they just set a password (see
-- AuthGate.tsx), without granting the client any general write access to
-- this table. auth.uid() is taken from the caller's own session, so a
-- gardener can only ever mark their own row, and only this one column.
create or replace function public.mark_password_set()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.member_profiles
  set has_password = true, updated_at = now()
  where user_id = auth.uid();
end;
$$;

revoke execute on function public.mark_password_set() from anon;
grant execute on function public.mark_password_set() to authenticated;

-- ---------------------------------------------------------------------------
-- question_interest (1 October 2026, app trial): one row each time a gardener
-- taps a "Questions gardeners ask" chip that Pip can't answer yet. Founders read
-- the counts (as database owner) to decide which research to approve next:
--   select question_key, count(*) from public.question_interest group by 1 order by 2 desc;
-- Applied to Supabase as migration question_interest.
-- ---------------------------------------------------------------------------
create table if not exists public.question_interest (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  question_key text not null check (char_length(question_key) between 1 and 64),
  created_at timestamptz not null default now()
);
alter table public.question_interest enable row level security;
create policy "question_interest insert own" on public.question_interest
  for insert to authenticated with check (user_id = auth.uid());
create policy "question_interest read own" on public.question_interest
  for select to authenticated using (user_id = auth.uid());
create index if not exists question_interest_key_idx on public.question_interest (question_key);

-- ---------------------------------------------------------------------------
-- Beta invites (3 October 2026): the askpip.garden invite form, the Garden
-- Shed's "Beta requests" tool, the invitation email and the app's invite gate.
-- Applied to Supabase as migration beta_invites.
--
-- Pattern, as for the Shed's own tables: RLS on with no policies and all table
-- privileges revoked, so nothing reads or writes these tables directly. The
-- website calls the two site_* functions with the public key; they can add a
-- request and nothing else. The Shed calls the shed_* functions with a Founder's
-- passphrase. Supabase Auth calls hook_beta_invite_only.
-- ---------------------------------------------------------------------------

create table if not exists public.beta_invite_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  country text not null check (char_length(country) between 1 and 60),
  roses text[] not null check (cardinality(roses) between 1 and 5),
  phone text not null check (phone in ('iPhone', 'Android', 'Computer')),
  note text check (note is null or char_length(note) <= 2000),
  accepted_beta_terms boolean not null check (accepted_beta_terms),
  -- True when the country and roses are ones the beta covers. Worked out here, never taken from the visitor.
  in_beta_scope boolean not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  decided_by text,
  decided_at timestamptz,
  invited_at timestamptz,
  invite_error text,
  -- The Founders who have opened this request in the Shed. A request is "unopened" for a Founder not listed.
  opened_by text[] not null default '{}'
);
create unique index if not exists beta_invite_requests_email_key on public.beta_invite_requests (email);
alter table public.beta_invite_requests enable row level security;
revoke all on public.beta_invite_requests from anon, authenticated, public;

create table if not exists public.site_followers (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null unique check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  source text not null check (source in ('follow-progress', 'invite-form'))
);
alter table public.site_followers enable row level security;
revoke all on public.site_followers from anon, authenticated, public;

-- Text made safe to place inside an HTML email.
create or replace function public.beta_html(t text) returns text
language sql immutable
set search_path to 'public'
as $$ select replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'); $$;
revoke execute on function public.beta_html(text) from anon, authenticated, public;

-- Sends one email through Resend, with the key held in Vault (the Shed's own notice email works the same
-- way). Emails are sent only while shed_config has beta_emails = 'on'. Returns null when sent, otherwise why not.
create or replace function public.beta_send_email(p_from text, p_to text, p_reply_to text, p_subject text, p_html text)
returns text
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  api_key text;
  resp http_response;
  payload jsonb;
begin
  if coalesce((select value from public.shed_config where key = 'beta_emails'), 'off') <> 'on' then
    return 'emails are switched off';
  end if;
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key';
  if api_key is null then
    return 'no email key';
  end if;
  payload := jsonb_build_object('from', p_from, 'to', jsonb_build_array(p_to), 'subject', p_subject, 'html', p_html);
  if p_reply_to is not null then
    payload := payload || jsonb_build_object('reply_to', p_reply_to);
  end if;
  select * into resp from http((
    'POST', 'https://api.resend.com/emails',
    array[http_header('Authorization', 'Bearer ' || api_key), http_header('Content-Type', 'application/json')],
    'application/json', payload::text
  )::http_request);
  if resp.status is null or resp.status not between 200 and 299 then
    return 'email service answered ' || coalesce(resp.status::text, 'nothing');
  end if;
  return null;
exception when others then
  return 'email failed: ' || sqlerrm;
end;
$$;
revoke execute on function public.beta_send_email(text, text, text, text, text) from anon, authenticated, public;

-- The website's "Request an invite" form. p_trap is a field hidden from people; a filled one is a robot,
-- which is told "ok" and ignored. One row per email address: a second request updates the first while it
-- is still pending, and changes nothing once it has been decided.
create or replace function public.site_request_invite(
  p_name text, p_email text, p_country text, p_roses text[], p_phone text,
  p_note text default null, p_accepted boolean default false, p_trap text default null
) returns jsonb
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_note text := nullif(btrim(coalesce(p_note, '')), '');
  v_roses text[];
  v_scope boolean;
  v_existing public.beta_invite_requests;
  v_new boolean := false;
  v_ignored text;
begin
  if coalesce(p_trap, '') <> '' then
    return jsonb_build_object('ok', true, 'in_beta_scope', true);
  end if;
  if v_name = '' or char_length(v_name) > 120 then return jsonb_build_object('ok', false, 'reason', 'name'); end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(v_email) > 254 then return jsonb_build_object('ok', false, 'reason', 'email'); end if;
  if p_country is null or p_country not in ('New Zealand', 'Australia', 'United Kingdom', 'United States', 'Canada', 'Somewhere else') then
    return jsonb_build_object('ok', false, 'reason', 'country');
  end if;
  select array_agg(distinct r) into v_roses from unnest(coalesce(p_roses, '{}')) r
    where r in ('Hybrid Tea', 'Floribunda', 'Grandiflora', 'Other roses', 'I''m not sure');
  if v_roses is null then return jsonb_build_object('ok', false, 'reason', 'roses'); end if;
  if p_phone is null or p_phone not in ('iPhone', 'Android', 'Computer') then return jsonb_build_object('ok', false, 'reason', 'phone'); end if;
  if v_note is not null and char_length(v_note) > 2000 then v_note := left(v_note, 2000); end if;
  if not coalesce(p_accepted, false) then return jsonb_build_object('ok', false, 'reason', 'accept'); end if;

  -- The beta covers five countries and three rose types. "I'm not sure" is let through for the Founders to judge.
  v_scope := p_country <> 'Somewhere else'
    and v_roses && array['Hybrid Tea', 'Floribunda', 'Grandiflora', 'I''m not sure'];

  -- A plain guard against a flood of robot requests.
  if (select count(*) from public.beta_invite_requests where created_at > now() - interval '1 hour') >= 60 then
    return jsonb_build_object('ok', false, 'reason', 'busy');
  end if;

  select * into v_existing from public.beta_invite_requests where email = v_email;
  if not found then
    insert into public.beta_invite_requests (name, email, country, roses, phone, note, accepted_beta_terms, in_beta_scope)
    values (v_name, v_email, p_country, v_roses, p_phone, v_note, true, v_scope);
    v_new := true;
  elsif v_existing.status = 'pending' then
    update public.beta_invite_requests
      set name = v_name, country = p_country, roses = v_roses, phone = p_phone, note = v_note,
          in_beta_scope = v_scope, updated_at = now(), opened_by = '{}'
      where id = v_existing.id;
  end if;

  if v_new then
    v_ignored := public.beta_send_email(
      'Ask Pip Shed <shed@contact.askpip.garden>', 'founders@askpip.garden', v_email,
      'New beta request: ' || v_name || ', ' || p_country,
      '<p><strong>' || public.beta_html(v_name) || '</strong> has asked to join the Ask Pip beta.</p>'
      || '<ul><li>Email: ' || public.beta_html(v_email) || '</li>'
      || '<li>Country: ' || public.beta_html(p_country) || '</li>'
      || '<li>Roses: ' || public.beta_html(array_to_string(v_roses, ', ')) || '</li>'
      || '<li>Phone: ' || public.beta_html(p_phone) || '</li>'
      || '<li>Note: ' || public.beta_html(coalesce(v_note, 'None')) || '</li></ul>'
      || '<p>Approve or decline it in the Garden Shed: <a href="https://shed.askpip.garden">shed.askpip.garden</a></p>'
    );
  end if;
  return jsonb_build_object('ok', true, 'in_beta_scope', v_scope);
end;
$$;
revoke execute on function public.site_request_invite(text, text, text, text[], text, text, boolean, text) from public;
grant execute on function public.site_request_invite(text, text, text, text[], text, text, boolean, text) to anon, authenticated;

-- The website's "Follow progress" form.
create or replace function public.site_follow(p_email text, p_source text default 'follow-progress', p_trap text default null)
returns jsonb
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  if coalesce(p_trap, '') <> '' then return jsonb_build_object('ok', true); end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(v_email) > 254 then return jsonb_build_object('ok', false, 'reason', 'email'); end if;
  if p_source is null or p_source not in ('follow-progress', 'invite-form') then return jsonb_build_object('ok', false, 'reason', 'source'); end if;
  if (select count(*) from public.site_followers where created_at > now() - interval '1 hour') >= 120 then
    return jsonb_build_object('ok', false, 'reason', 'busy');
  end if;
  insert into public.site_followers (email, source) values (v_email, p_source) on conflict (email) do nothing;
  return jsonb_build_object('ok', true);
end;
$$;
revoke execute on function public.site_follow(text, text, text) from public;
grant execute on function public.site_follow(text, text, text) to anon, authenticated;

-- The Shed's "Beta requests" tool: every request, newest first, with whether this Founder has opened it.
create or replace function public.shed_list_invite_requests(p text)
returns table (
  id uuid, created_at timestamptz, updated_at timestamptz, name text, email text, country text, roses text[],
  phone text, note text, in_beta_scope boolean, status text, decided_by text, decided_at timestamptz,
  invited_at timestamptz, invite_error text, is_unopened boolean
)
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  return query
    select r.id, r.created_at, r.updated_at, r.name, r.email, r.country, r.roses, r.phone, r.note, r.in_beta_scope,
           r.status, r.decided_by, r.decided_at, r.invited_at, r.invite_error, not (who = any (r.opened_by))
    from public.beta_invite_requests r
    order by r.created_at desc;
end;
$$;

-- The number on the tool: requests this Founder has not opened yet.
create or replace function public.shed_count_unopened_invite_requests(p text)
returns integer
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  return (select count(*)::integer from public.beta_invite_requests r where not (who = any (r.opened_by)));
end;
$$;

create or replace function public.shed_open_invite_request(p text, request_id uuid)
returns void
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  update public.beta_invite_requests r set opened_by = array_append(r.opened_by, who)
    where r.id = request_id and not (who = any (r.opened_by));
end;
$$;

-- The invitation email. Used when a request is approved, and again by "Send the invitation again".
-- 3 October 2026 (migration beta_invitation_logo): Pip's picture added at the top, at a Founder's request.
create or replace function public.beta_send_invitation(request_id uuid)
returns text
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  r public.beta_invite_requests;
  problem text;
begin
  select * into r from public.beta_invite_requests where id = request_id;
  if not found then return 'request not found'; end if;
  problem := public.beta_send_email(
    'Ask Pip <founders@contact.askpip.garden>', r.email, 'founders@askpip.garden',
    'Your invitation to Ask Pip',
    '<p style="margin:0 0 16px"><img src="https://app.askpip.garden/icons/icon-192.png" width="88" height="88" alt="Pip" style="display:block;border-radius:18px"></p>'
    || '<p>Hello ' || public.beta_html(r.name) || ',</p>'
    || '<p>Thank you for asking to join the Ask Pip beta. We would like to offer you a place.</p>'
    || '<p><strong>Open Ask Pip:</strong> <a href="https://app.askpip.garden">https://app.askpip.garden</a></p>'
    || '<p>Sign in with this email address. Pip will send you a code each time, so there is no password to remember unless you choose to set one.</p>'
    || '<p><strong>To keep Pip on your phone:</strong> open the link in Chrome on Android, or in Safari on iPhone, then choose "Add to home screen" from Pip''s menu.</p>'
    || '<p>Ask Pip is a free beta. Its guidance has not been reviewed by a horticultural expert, and you decide what to do with your own plants. After a session, Pip offers a short feedback form. We read everything you send.</p>'
    || '<p>You can also reply to this email. One of us will read it.</p>'
    || '<p>The Founders, Ask Pip</p>'
  );
  update public.beta_invite_requests
    set invited_at = case when problem is null then now() else invited_at end, invite_error = problem
    where id = request_id;
  return problem;
end;
$$;
revoke execute on function public.beta_send_invitation(uuid) from anon, authenticated, public;

-- Approve, decline, or put a request back to pending. Approving sends the invitation; the answer says
-- whether it went ("emailed") and, if not, why ("email_problem"), so the Shed can say so plainly.
create or replace function public.shed_decide_invite_request(p text, request_id uuid, decision text)
returns jsonb
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  who text;
  problem text;
  was text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  if decision not in ('approved', 'declined', 'pending') then raise exception 'invalid decision'; end if;
  select status into was from public.beta_invite_requests where id = request_id;
  if was is null then raise exception 'request not found'; end if;

  update public.beta_invite_requests r
    set status = decision,
        decided_by = case when decision = 'pending' then null else who end,
        decided_at = case when decision = 'pending' then null else now() end,
        updated_at = now(),
        opened_by = case when who = any (r.opened_by) then r.opened_by else array_append(r.opened_by, who) end
    where r.id = request_id;

  if decision = 'approved' and was <> 'approved' then
    problem := public.beta_send_invitation(request_id);
    return jsonb_build_object('status', decision, 'emailed', problem is null, 'email_problem', problem);
  end if;
  return jsonb_build_object('status', decision, 'emailed', false, 'email_problem', null);
end;
$$;

create or replace function public.shed_resend_invitation(p text, request_id uuid)
returns jsonb
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare
  who text;
  problem text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  if not exists (select 1 from public.beta_invite_requests where id = request_id and status = 'approved') then
    raise exception 'only an approved request can be invited';
  end if;
  problem := public.beta_send_invitation(request_id);
  return jsonb_build_object('emailed', problem is null, 'email_problem', problem);
end;
$$;

-- The app's invite gate. Supabase Auth runs this before it creates a NEW account (Authentication > Hooks >
-- "Before User Created", switched on by a Founder in the dashboard). Only an address with an approved request
-- may be created. Accounts that already exist are not affected: the hook does not run when they sign in.
create or replace function public.hook_beta_invite_only(event jsonb)
returns jsonb
language plpgsql security definer
set search_path to 'public'
as $$
declare
  v_email text := lower(btrim(coalesce(event -> 'user' ->> 'email', '')));
begin
  if exists (select 1 from public.beta_invite_requests where email = v_email and status = 'approved') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'This email address isn''t on the Ask Pip beta list yet. You can request an invite at askpip.garden.'
  ));
end;
$$;
grant execute on function public.hook_beta_invite_only(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_beta_invite_only(jsonb) from anon, authenticated, public;

-- ---------------------------------------------------------------------------
-- Beta feedback (3 October 2026): the app's feedback form and the Garden Shed's
-- "Beta feedback" tool. Applied to Supabase as migration beta_feedback.
-- Questions and answers approved by a Founder in chat, 3 October 2026
-- (Working/AI Outputs/Ask_Pip_Feedback_Form_Wording.md).
--
-- Same pattern as beta invites: RLS on with no policies and all table privileges
-- revoked. A signed-in gardener calls app_send_feedback, which can add a row
-- and nothing else. The Shed calls the shed_* functions with a Founder's
-- passphrase. No email is sent: the count on the Shed tool is the notice.
--
-- Two shapes of row. After a session (kind 'pruning' or 'growing-season'):
-- went is required, the other answers are optional. From the menu (kind
-- 'general'): topic and comment are required. The stored values are short keys;
-- the words the gardener saw are in App/src/data/feedbackForm.ts.
-- ---------------------------------------------------------------------------

create table if not exists public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Deleting an account deletes its feedback with it (the row holds the email address).
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Taken from the account, never from what the app sends.
  email text not null,
  kind text not null check (kind in ('pruning', 'growing-season', 'general')),
  rose_type text check (rose_type is null or rose_type in ('hybrid-tea', 'floribunda', 'grandiflora')),
  went text check (went is null or went in ('well', 'mixed', 'badly')),
  clear text check (clear is null or clear in ('clear', 'partly', 'unsure')),
  followed text check (followed is null or followed in ('most', 'some', 'no', 'nothing-suggested')),
  obstacles text[] not null default '{}'
    check (obstacles <@ array['match', 'photo', 'wording', 'app', 'too-long', 'none']::text[]),
  confidence text check (confidence is null or confidence in ('more', 'same', 'less')),
  topic text check (topic is null or topic in ('wrong', 'idea', 'liked')),
  comment text check (comment is null or char_length(comment) between 1 and 1000),
  may_contact boolean,
  -- The Founders who have opened this feedback in the Shed. It is "unopened" for a Founder not listed.
  opened_by text[] not null default '{}',
  constraint beta_feedback_shape check (
    (kind = 'general' and topic is not null and comment is not null and went is null)
    or (kind <> 'general' and went is not null and topic is null)
  )
);
create index if not exists beta_feedback_created_idx on public.beta_feedback (created_at desc);
create index if not exists beta_feedback_user_idx on public.beta_feedback (user_id, created_at desc);
alter table public.beta_feedback enable row level security;
revoke all on public.beta_feedback from anon, authenticated, public;

-- The app's feedback form. Only a signed-in gardener can call it. Answers {ok:true}, or {ok:false, reason}.
-- At most 20 a day from one account, so a stuck button or a script cannot fill the Shed.
create or replace function public.app_send_feedback(
  p_kind text,
  p_rose_type text default null,
  p_went text default null,
  p_clear text default null,
  p_followed text default null,
  p_obstacles text[] default '{}',
  p_confidence text default null,
  p_topic text default null,
  p_comment text default null,
  p_may_contact boolean default null
)
returns jsonb
language plpgsql security definer
set search_path to 'public'
as $$
declare
  v_user uuid := auth.uid();
  v_email text;
  v_comment text := nullif(btrim(coalesce(p_comment, '')), '');
  v_obstacles text[] := coalesce(p_obstacles, '{}');
begin
  if v_user is null then
    return jsonb_build_object('ok', false, 'reason', 'not-signed-in');
  end if;
  select lower(u.email) into v_email from auth.users u where u.id = v_user;
  if v_email is null then
    return jsonb_build_object('ok', false, 'reason', 'not-signed-in');
  end if;

  if p_kind is null or p_kind not in ('pruning', 'growing-season', 'general') then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;
  if v_comment is not null and char_length(v_comment) > 1000 then
    return jsonb_build_object('ok', false, 'reason', 'too-long');
  end if;
  if p_kind = 'general' then
    if p_topic is null or p_topic not in ('wrong', 'idea', 'liked') or v_comment is null then
      return jsonb_build_object('ok', false, 'reason', 'invalid');
    end if;
  else
    if p_went is null or p_went not in ('well', 'mixed', 'badly')
       or (p_clear is not null and p_clear not in ('clear', 'partly', 'unsure'))
       or (p_followed is not null and p_followed not in ('most', 'some', 'no', 'nothing-suggested'))
       or (p_confidence is not null and p_confidence not in ('more', 'same', 'less'))
       or not (v_obstacles <@ array['match', 'photo', 'wording', 'app', 'too-long', 'none']::text[])
       or cardinality(v_obstacles) > 6 then
      return jsonb_build_object('ok', false, 'reason', 'invalid');
    end if;
  end if;

  if (select count(*) from public.beta_feedback f
      where f.user_id = v_user and f.created_at > now() - interval '24 hours') >= 20 then
    return jsonb_build_object('ok', false, 'reason', 'too-many');
  end if;

  insert into public.beta_feedback
    (user_id, email, kind, rose_type, went, clear, followed, obstacles, confidence, topic, comment, may_contact)
  values (
    v_user,
    v_email,
    p_kind,
    case when p_kind <> 'general' and p_rose_type in ('hybrid-tea', 'floribunda', 'grandiflora') then p_rose_type end,
    case when p_kind <> 'general' then p_went end,
    case when p_kind <> 'general' then p_clear end,
    case when p_kind <> 'general' then p_followed end,
    case when p_kind <> 'general' then (select coalesce(array_agg(distinct o), '{}') from unnest(v_obstacles) o) else '{}' end,
    case when p_kind <> 'general' then p_confidence end,
    case when p_kind = 'general' then p_topic end,
    v_comment,
    p_may_contact
  );
  return jsonb_build_object('ok', true);
end;
$$;
revoke execute on function public.app_send_feedback(text, text, text, text, text, text[], text, text, text, boolean) from public, anon;
grant execute on function public.app_send_feedback(text, text, text, text, text, text[], text, text, text, boolean) to authenticated;

-- The Shed's "Beta feedback" tool: every piece of feedback, newest first, with whether this Founder has opened it.
create or replace function public.shed_list_beta_feedback(p text)
returns table (
  id uuid, created_at timestamptz, email text, kind text, rose_type text, went text, clear text, followed text,
  obstacles text[], confidence text, topic text, comment text, may_contact boolean, is_unopened boolean
)
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  return query
    select f.id, f.created_at, f.email, f.kind, f.rose_type, f.went, f.clear, f.followed, f.obstacles, f.confidence,
           f.topic, f.comment, f.may_contact, not (who = any (f.opened_by))
    from public.beta_feedback f
    order by f.created_at desc;
end;
$$;

-- The number on the tool: feedback this Founder has not opened yet.
create or replace function public.shed_count_unopened_beta_feedback(p text)
returns integer
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  return (select count(*)::integer from public.beta_feedback f where not (who = any (f.opened_by)));
end;
$$;

create or replace function public.shed_open_beta_feedback(p text, feedback_id uuid)
returns void
language plpgsql security definer
set search_path to 'public', 'extensions'
as $$
declare who text;
begin
  who := public.shed_resolve_user(p);
  if who is null then raise exception 'invalid passphrase'; end if;
  update public.beta_feedback f set opened_by = array_append(f.opened_by, who)
    where f.id = feedback_id and not (who = any (f.opened_by));
end;
$$;
