# The Garden Shed Office (KCS Pip Shed)

Internal, passphrase-gated notices/docs/calendar workspace for the AskPIP
team — research approvals, commission discussion, event planning, and
easy access to company documents. Styled as an illustrated garden shed
interior with clickable hotspots. Not gardener-facing; unrelated to the
Ask Pip product experience in `App/`.

## Migration note (2026-09-08)

This folder is the shed's new home inside `core`, replacing the standalone
`askpip/KCS-PIP-Garden-Shed` repo and the local `shed-deploy` checkout. The
reasoning: the shed is an integral part of the KCS/PIP project, not a
separate product, and Core should be the one place — and one git history —
that has everything, the same way `App/` already lives here as its own
Vercel-deployed subfolder.

**While this migration was in progress, the editable source (the original
`build_live.py`, `data_uris.json`, and raw `.jpg` art) turned out to have
been lost** — it only ever lived in an AI working-session sandbox, which
got recycled before being committed anywhere, exactly the risk an earlier
draft of this project's overview note had flagged. It was fully recovered
by decomposing the still-live, self-contained `index.html` (verified
byte-for-byte identical on rebuild — see `source/build_live.py`) back into
separate art files and a template. Nothing was lost from the live site;
what was lost was only ever the *editable* form of it, and only until now.
That's the whole point of this move: once this is committed to `core`,
that failure mode can't happen again.

The lock-screen art (`art/lock-desktop.jpg`, `art/lock-mobile.jpg`) turned
out to be higher-resolution/differently-processed versions of the main
scene art rather than reused copies of `scene-desktop.jpg`/`scene-mobile.jpg`
— that's simply what the live page already contained; it wasn't a design
decision made during recovery.

Original higher-quality source generations (the calendar and wicker-bin
art edits, the base shed illustration, etc.) also still exist in the
OpenArt account's generation history if any piece ever needs to be
regenerated or edited again from a clean original rather than from the
extracted-from-HTML copies in `art/`.

## Folder layout

- **`index.html`** — the built, deployable file. This is what gets served
  to `shed.askpip.garden`; all CSS/JS inline, all art embedded as base64.
  Generated, not hand-edited.
- **`source/build_live.py`** — assembles `index.html` from
  `source/template.html` + the files in `art/`, per `art/manifest.json`.
- **`source/template.html`** — the full page markup/CSS/JS, with an
  `__ASSET_<NAME>__` placeholder wherever a piece of art is embedded.
- **`art/`** — the raw artwork (`.jpg`/`.png`) plus `manifest.json`, which
  maps each placeholder name to its file and MIME type.

## Building

```bash
cd source
python3 build_live.py
```

Writes `../index.html`. Run this after editing `template.html` or
swapping any file in `art/`, then commit both the source change and the
regenerated `index.html` together.

## Deployment

**Live at `https://shed.askpip.garden`, hosted the same way `App/` is** —
a Vercel project (`kcs-pip-garden-shed`) connected to the `askpip/core`
GitHub repo, with its **Root Directory set to `Shed`**, auto-deploying on
push to `main`. No build command (Framework Preset "Other"); Vercel just
serves `index.html` as static output. Migrated 2026-09-08 — the project's
Git connection was repointed from the old standalone `KCS-PIP-Garden-Shed`
repo to `askpip/core`, and a deploy from this folder was confirmed `Ready`
and verified live before the old repo was left for retirement (see below).

Both this project and `App/`'s already have Vercel's "skip deployments
when there are no changes to the root directory" enabled by default, so a
push touching only `Shed/` won't rebuild `App/` and vice versa — no extra
`ignoreBuildStep` config needed.

**Retiring the old repo/checkout**: the standalone `askpip/KCS-PIP-Garden-Shed`
GitHub repo and the local `C:\AskPIP\shed-deploy` checkout were made
redundant by this migration. The local checkout has been removed
(2026-09-08). Archiving (not deleting) the GitHub repo itself is the one
remaining cleanup step, still open — that one needs to be done by hand by
someone signed into GitHub as `askpip` (Settings → General → Archive this
repository).

## Backend

Same Supabase project as `App/` (`lapscltduzkbldfwcemq`), fully separate
tables: `shed_items`, `shed_events`, `shed_config`, plus `shed_users`
(added 2026-09-08, see below). RLS is enabled with no policies — nothing
reachable directly. All reads/writes go through `SECURITY DEFINER` RPCs
(`shed_list_items`, `shed_add_item`, `shed_update_item`, `shed_delete_item`,
`shed_restore_item`, `shed_purge_items`, and the calendar equivalents
`shed_list_events`/`add`/`update`/`delete_event`), gated by
`shed_check_passphrase(p)`.

**Identity model (as of 2026-09-08): two named passphrases, not a single
shared one and not full per-user auth.** `shed_users` holds a
`(name, passphrase_hash)` row per person — currently Shaphan and Karla,
the only two people using the shed. `shed_check_passphrase(p)` now checks
against `shed_users` (any match unlocks, same as before), and a new RPC,
`shed_identify_user(p)`, resolves a passphrase to its owner's name. The
client calls this once at unlock and keeps the name in memory for the
session (never persisted, same as the passphrase itself) to show a
"Signed in as ..." badge and to label notices/docs/events with who
created/last saved them (`created_by`/`updated_by` columns on `shed_items`
and `shed_events`, stamped server-side from the resolved name — never
trusted from client input). This was an explicit choice over real Supabase
Auth: permissions stay flat (anyone can do anything; identity is for
attribution only), so the extra weight of real accounts wasn't worth it
for two people. Worth revisiting if the team using the shed grows.

To change either passphrase, update the matching row's `passphrase_hash`
in `shed_users` directly in Supabase (`extensions.crypt('newpass',
extensions.gen_salt('bf'))`) — no redeploy required, same as the old
single passphrase.

## Document sync from Core

The old Bookshelf content is still a manually seeded, point-in-time copy.
As of 2026-09-08, File Cabinet documents are different: `Foundations/`,
`Knowledge Curation System/`, and `Standards/` (every `.md` file, whole
folders, recursively) sync wholesale into three new File Cabinet folders
of the same names, kept current automatically. **Live and verified**: the
first successful run synced all 18 markdown files across the three
folders (1 in Foundations, 15 in Knowledge Curation System, 2 in
Standards).

- **`.github/workflows/shed-doc-sync.yml`** (repo root — GitHub only reads
  workflow files from there) — runs on every push to `main` that touches
  those three folders (or the sync script/workflow itself), plus a manual
  `workflow_dispatch` trigger for an on-demand re-run.
- **`Shed/github/scripts/shed-doc-sync.mjs`** — the sync script it runs.
  For each `.md` file: title is the first `# Heading`, or the filename if
  there isn't one; body is the raw file content. Upserts into `shed_items`
  as `location='cabinet'`, `source='synced'`, `folder=<top-level folder
  name>`, keyed on a new `source_path` column (the file's repo-relative
  path — see the `shed_items_source_path_uq` migration) so re-runs update
  in place rather than duplicating. Also deletes any previously-synced row
  whose file no longer exists in Core, so removed/renamed docs disappear
  from the shed too.
- The `source_path` uniqueness is enforced with a plain (non-partial)
  `UNIQUE` constraint — the first version of this migration used a partial
  index (`WHERE source_path IS NOT NULL`), which PostgREST's
  `on_conflict=source_path` upsert can't target, and the first live run
  failed with `42P10` until this was corrected. A plain `UNIQUE` constraint
  on a nullable column still allows unlimited `NULL`s, so ordinary
  user-created items (no `source_path`) are unaffected.
- Synced items are **not user-editable** in the shed (same as `'seed'`
  content) — the existing `editable = item.source === "user"` check
  already excludes anything that isn't `source='user'`, so this needed no
  UI change, just the new folders in `CABINET_FOLDERS`
  (`source/template.html`).
- Writes go straight to `shed_items` via the Supabase REST API with the
  service-role key (bypasses RLS) — this is a trusted CI job, not a shed
  "user", so it doesn't go through the passphrase-gated RPCs at all.
- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are set as repo secrets in
  `askpip/core` (Settings → Secrets and variables → Actions) — done.

## What's built so far

- Recycle Bin: soft-delete with restore + permanent purge, select-all UI
- File Cabinet folders
- Desk creation flow (Notepad → Pin to Notice Board / File in Cabinet)
- Full working Calendar: month-grid UI, add/edit/delete events, event
  chips on the month grid
- "Saved [date]" tracking on user-created notices/docs
- All 7 hotspots (Notice Board, Calendar, Bookshelf, File Cabinet, Info,
  Notepad, Recycle Bin), calibrated separately for desktop and mobile
- Named-passphrase identity + attribution (Shaphan/Karla)
- Automatic document sync from Core (Foundations, Knowledge Curation
  System, Standards)

## What's next

Background/history in `Working/AI Outputs/Garden_Shed_Office_Overview.md`.
Only remaining open item: archive the old `askpip/KCS-PIP-Garden-Shed`
GitHub repo (see "Retiring the old repo/checkout" above).
