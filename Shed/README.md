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

**Target: `https://shed.askpip.garden`, hosted the same way `App/` is** —
a Vercel project connected to the `askpip/core` GitHub repo, with its
**Root Directory set to `Shed`**, auto-deploying on push to `main`. No
build command needed (Framework Preset "Other"); Vercel just serves
`index.html` as static output, same as it does today from the separate
`KCS-PIP-Garden-Shed` repo.

**This repointing is a manual step in the Vercel dashboard that hasn't
happened yet** — an AI session has no login there. Until it's done, the
live site is still served from the old separate repo/checkout, and this
folder is the prepared, committed replacement waiting to be switched over.
See the migration steps in `Working/AI Outputs/Garden_Shed_Office_Overview.md`
(or ask the AI session that set this up) for the exact dashboard steps:
repoint the existing shed Vercel project's Git repository to `askpip/core`
with Root Directory `Shed`, confirm a deploy succeeds, then retire the old
`KCS-PIP-Garden-Shed` repo and the local `shed-deploy` checkout.

## Backend

Same Supabase project as `App/` (`lapscltduzkbldfwcemq`), fully separate
tables: `shed_items`, `shed_events`, `shed_config`. RLS is enabled with no
policies — nothing reachable directly. All reads/writes go through
`SECURITY DEFINER` RPCs (`shed_list_items`, `shed_add_item`,
`shed_update_item`, `shed_delete_item`, `shed_restore_item`,
`shed_purge_items`, and the calendar equivalents `shed_list_events`/
`add`/`update`/`delete_event`), gated by `shed_check_passphrase(p)` against
a hash in `shed_config`.

This is currently a **shared-passphrase model, not per-user auth** —
deliberately lightweight for a small internal tool so far. As the shed
takes on research approvals and commission discussions, which need
accountability (who approved/decided what), moving to real per-person
identity (Supabase Auth, same as `App/` already uses) is planned as a
follow-up phase, along with making the Bookshelf/File Cabinet documents
live-sync from the real Core documents instead of the current manually
seeded, point-in-time copies.

The passphrase is still the original default (`gardenshed2026`) — worth
rotating once the team using the shed is settled; can be done directly in
Supabase, no redeploy required.

## What's built so far

- Recycle Bin: soft-delete with restore + permanent purge, select-all UI
- File Cabinet folders
- Desk creation flow (Notepad → Pin to Notice Board / File in Cabinet)
- Full working Calendar: month-grid UI, add/edit/delete events, event
  chips on the month grid
- "Saved [date]" tracking on user-created notices/docs
- All 7 hotspots (Notice Board, Calendar, Bookshelf, File Cabinet, Info,
  Notepad, Recycle Bin), calibrated separately for desktop and mobile

## What's next

Tracked in `Working/AI Outputs/Garden_Shed_Office_Overview.md` for now —
repoint Vercel (above), then live doc-sync from Core and real per-user
identity, in that order.
