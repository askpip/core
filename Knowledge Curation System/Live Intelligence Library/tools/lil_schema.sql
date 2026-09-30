-- Live Intelligence Library (LIL) — database schema.
-- Applied to Supabase project lapscltduzkbldfwcemq on 1 October 2026 as migration "lil_create".
-- Also mirrored in App/supabase/schema.sql. See AI/Skills/KIT_LIL_Publication_Skill.md.
--
-- Design:
--   * One row per PKR version. (pkr_id, version) is permanent: a published version is never
--     overwritten (LIL Standard, Information Integrity; PKR Standard §6).
--   * At most one Published version per PKR. Superseded versions stay as 'Retired'.
--   * The app (anon/authenticated) may read Published rows only, and write nothing.
--   * Only KIT publishes, through lil_publish_from_git(<commit SHA>), which reads
--     Knowledge Curation System/Live Intelligence Library/lil_bundle.json at that exact
--     commit of github.com/askpip/core, so every publish is tied to reviewed, committed records.

-- The earlier placeholder table, created empty and never used.
drop table if exists public.pkr;

create table if not exists public.lil_pkr (
  pkr_id        text not null check (pkr_id ~ '^PKR-[A-Z]{3}-[0-9]{6}$'),
  version       text not null check (version ~ '^[0-9]+\.[0-9]+$'),
  pkr_type      text not null check (pkr_type in ('observation', 'comparison_image', 'decision_logic',
                                                  'suitability_gate', 'source', 'definition', 'care_guidance')),
  status        text not null check (status in ('Published', 'Suspended', 'Retired')),
  title         text not null,
  common        jsonb not null,
  content       jsonb not null,
  provenance    jsonb not null,
  source_commit text not null,
  published_at  timestamptz not null default now(),
  published_by  text not null default 'KIT',
  primary key (pkr_id, version)
);

create unique index if not exists lil_pkr_one_published
  on public.lil_pkr (pkr_id) where status = 'Published';
create index if not exists lil_pkr_type_published
  on public.lil_pkr (pkr_type) where status = 'Published';

create table if not exists public.lil_publish_log (
  id            bigint generated always as identity primary key,
  source_commit text not null,
  published_by  text not null,
  published_at  timestamptz not null default now(),
  result        jsonb not null
);

alter table public.lil_pkr enable row level security;
alter table public.lil_publish_log enable row level security;

drop policy if exists "LIL: read Published records" on public.lil_pkr;
create policy "LIL: read Published records" on public.lil_pkr
  for select to anon, authenticated using (status = 'Published');
-- No insert/update/delete policies: the app can never write to the LIL.

create or replace function public.lil_publish_from_git(p_commit text, p_published_by text default 'KIT')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url      text;
  v_resp     record;
  v_bundle   jsonb;
  v_rec      jsonb;
  v_existing record;
  v_n        int;
  v_inserted int := 0;
  v_unchanged int := 0;
  v_retired  int := 0;
  v_result   jsonb;
begin
  if p_commit !~ '^[0-9a-f]{40}$' then
    raise exception 'p_commit must be a full 40-character git commit SHA';
  end if;
  v_url := 'https://raw.githubusercontent.com/askpip/core/' || p_commit
        || '/Knowledge%20Curation%20System/Live%20Intelligence%20Library/lil_bundle.json';
  select * into v_resp from public.http_get(v_url);
  if v_resp.status <> 200 then
    raise exception 'Could not fetch the LIL bundle at % (HTTP %)', p_commit, v_resp.status;
  end if;
  v_bundle := v_resp.content::jsonb;
  if v_bundle->>'schema' is distinct from 'pip-lil-bundle/1' then
    raise exception 'Unexpected bundle schema: %', v_bundle->>'schema';
  end if;

  -- 1. Insert versions not yet in the LIL (as Retired first, so the one-Published rule holds mid-way).
  for v_rec in select * from jsonb_array_elements(v_bundle->'records') loop
    if v_rec->>'status' not in ('Published', 'Suspended', 'Retired') then
      raise exception 'Record % v% has status %; only Published, Suspended or Retired may enter the LIL',
        v_rec->>'pkr_id', v_rec->>'version', v_rec->>'status';
    end if;
    select common, content into v_existing from public.lil_pkr
      where pkr_id = v_rec->>'pkr_id' and version = v_rec->>'version';
    if found then
      if v_existing.common <> v_rec->'common' or v_existing.content <> v_rec->'content' then
        raise exception 'Record % v% already exists with different content. Published versions are immutable: issue a new version instead.',
          v_rec->>'pkr_id', v_rec->>'version';
      end if;
      v_unchanged := v_unchanged + 1;
    else
      insert into public.lil_pkr (pkr_id, version, pkr_type, status, title, common, content, provenance, source_commit, published_by)
      values (v_rec->>'pkr_id', v_rec->>'version', v_rec->>'pkr_type', 'Retired', v_rec->>'title',
              v_rec->'common', v_rec->'content', v_rec->'provenance', p_commit, p_published_by);
      v_inserted := v_inserted + 1;
    end if;
  end loop;

  -- 2. Apply each record's status. Publishing a version retires any other Published version of that PKR.
  for v_rec in select * from jsonb_array_elements(v_bundle->'records') loop
    if v_rec->>'status' = 'Published' then
      update public.lil_pkr set status = 'Retired'
        where pkr_id = v_rec->>'pkr_id' and status = 'Published' and version <> v_rec->>'version';
      get diagnostics v_n = row_count;
      v_retired := v_retired + v_n;
    end if;
    update public.lil_pkr set status = v_rec->>'status'
      where pkr_id = v_rec->>'pkr_id' and version = v_rec->>'version';
  end loop;

  v_result := jsonb_build_object(
    'bundle_records', jsonb_array_length(v_bundle->'records'),
    'inserted', v_inserted, 'already_present', v_unchanged, 'retired', v_retired,
    'published_now', (select count(*) from public.lil_pkr where status = 'Published'));
  insert into public.lil_publish_log (source_commit, published_by, result) values (p_commit, p_published_by, v_result);
  return v_result;
end;
$$;

revoke all on function public.lil_publish_from_git(text, text) from public, anon, authenticated;
