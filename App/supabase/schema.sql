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
  personal_meaning text,
  journey_complete boolean not null default false,
  created_at timestamptz not null default now()
);

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

-- PKR: readable only when published. Deliberately no insert/update/delete
-- policy for anon/authenticated — this is the database-level enforcement of
-- KIT's "no self-approval" boundary. Writes happen only via the service_role
-- key, from a Founder-controlled process, never from the app itself.

create policy "pkr_select_published" on public.pkr
  for select using (published = true);
