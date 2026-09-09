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
As of 2026-09-08, File Cabinet documents sync wholesale and automatically
from Core. **As of 2026-09-09, the synced scope covers the whole
documentation surface of the repo** — every `.md` file, recursively, under
`Foundations/`, `Knowledge Curation System/`, `MVP/`, `Standards/`,
`Working/`, `AI/`, and `Graphics/` — up from the original three folders.
`App/` (application source code) and `Spike/` (AI experiment scripts) are
deliberately excluded; neither is something anyone reviews or approves in
the shed.

**As of 2026-09-09, each synced item's `folder` holds its full relative
directory path, not just its top-level folder name** — e.g.
`"Knowledge Curation System/Mother Information Library/ARCs"`, not just
`"Knowledge Curation System"`. This is what lets the File Cabinet present
the same nested structure Core itself has (see "Nested File Cabinet"
below); no schema change was needed for this, since `folder` was already a
free-text column.

- **`.github/workflows/shed-doc-sync.yml`** (repo root — GitHub only reads
  workflow files from there) — runs on every push to `main` that touches
  any of the seven synced folders (or the sync script/workflow itself),
  plus a manual `workflow_dispatch` trigger for an on-demand re-run.
- **`Shed/github/scripts/shed-doc-sync.mjs`** — the sync script it runs.
  For each `.md` file: title is the first `# Heading`, or the filename if
  there isn't one; body is the raw file content. Upserts into `shed_items`
  as `location='cabinet'`, `source='synced'`, `folder=<full relative
  directory path>`, keyed on the `source_path` column (the file's
  repo-relative path, including filename — see the
  `shed_items_source_path_uq` migration) so re-runs update in place rather
  than duplicating, and a moved file (new `source_path`) re-files itself
  under its new folder rather than leaving a stale duplicate behind. Also
  deletes any previously-synced row whose file no longer exists in Core,
  so removed/renamed docs disappear from the shed too.
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
  UI change.
- Writes go straight to `shed_items` via the Supabase REST API with the
  service-role key (bypasses RLS) — this is a trusted CI job, not a shed
  "user", so it doesn't go through the passphrase-gated RPCs at all.
- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are set as repo secrets in
  `askpip/core` (Settings → Secrets and variables → Actions) — done.
- Images/binary files are deliberately not synced yet — documents first,
  per an explicit Founder phasing decision (2026-09-09); real image
  support is a follow-up phase.

## To-Do List (added 2026-09-08)

An 8th hotspot, positioned on the corkboard just above the Notice Board pin
(a torn-paper "notice" prop in the same scene art — no new art needed, just
a new hotspot coordinate over it).

- **Data**: `shed_todos` (current state: `text`, `status`, `sort_order`,
  `created_by`/`created_at`, `updated_by`/`updated_at`) plus
  `shed_todo_status_log`, an append-only log of every status change
  (`todo_id`, `status`, `set_by`, `set_at`) — the shed shows this as an
  expandable "History" per task, not just the latest change.
- **Status**: four states — Received, In Progress, Blocked, Completed — set
  via a dropdown on each task. Changing it calls `shed_set_todo_status`,
  which stamps `updated_by`/`updated_at` and appends a new history row.
- **Layout**: active (non-completed) tasks are one draggable, reorderable
  list; Completed tasks move to a separate, non-draggable section below so
  the active list stays short. Reordering is pointer-events based (not
  HTML5 drag-and-drop, which doesn't fire on touch) so it works the same on
  desktop and mobile; a drop calls `shed_reorder_todos` with the new active
  order.
- **RPCs**: `shed_list_todos`, `shed_add_todo`, `shed_set_todo_status`,
  `shed_reorder_todos`, `shed_delete_todo` — all passphrase-gated the same
  way as every other shed RPC.

## Settings menu (added 2026-09-08)

A small ⚙ button next to the "Signed in as ..." badge, opening a popover
with two actions:

- **Change Passphrase**: current passphrase + new (twice, min 8 chars).
  Calls `shed_change_passphrase(current_p, new_p)`, which re-resolves the
  *current* passphrase server-side (never trusts the client's in-memory
  identity) before updating that user's `passphrase_hash`. On success the
  client immediately swaps `window.SHED_PASSPHRASE` to the new value so the
  rest of the session keeps working without forcing a re-login.
- **Log Out**: confirms, then reloads the page. Nothing is persisted
  client-side (same as the passphrase itself), so a reload is a full,
  clean log-out back to the lock screen.

## Nested File Cabinet (added 2026-09-09)

The File Cabinet now mirrors Core's own folder structure — the same
subfolder layers Core has, not a flat list of top-level folders. This
follows directly from the document-sync change above: since each synced
item's `folder` is now a full relative path, the cabinet builds a tree by
splitting that path on `/` and drilling down one level at a time, via two
small helpers in `source/template.html`:

- **`cabinetChildFolders(items, parentPath)`** — the distinct immediate
  subfolder names under a given path (or the top level, when `parentPath`
  is empty).
- **`cabinetItemsAt(items, path)`** — the items filed directly at exactly
  that path (not in a deeper subfolder).

`CABINET_FOLDERS` (the top-level entries and their icons) was extended
from three folders to seven: Foundations, Knowledge Curation System,
Standards, MVP, Working, AI, Graphics — matching the sync scope. Opening
the cabinet, or drilling into any folder, now renders via
`renderCabinetLevel(path, onBack)`: it shows a subfolder grid when a level
has child folders, falls straight through to the item list when it
doesn't, or shows both (subfolder grid above, "Filed directly in this
folder" item list below) when a level has both documents and subfolders
of its own. The same two helpers back the document-link picker used when
composing a notice (see "Notice/approval workflow" below), so browsing to
pick a document to link works exactly like browsing the cabinet itself.

## Desk windowing (rebuilt 2026-09-09)

"Send to desk" no longer opens a single full-screen overlay. The desk is
now a **staggered stack of windows**, unlimited in number, each either
**minimized** (a small card: title, snippet, an Expand button, and a
close ✕) or **expanded** (a full panel: title, a down-arrow to
re-minimize, and the full view/edit UI). Both states share one stack —
minimized cards and expanded panels alike — so several things can be open
and switched between at once, including more than one expanded panel side
by side.

- **State**: `stageEl._deskWindows` is an ordered array, back-to-front,
  replacing the old single-item `_deskState`/`_deskNote`. Each entry is
  `{item, state: 'card'|'panel', el}`.
- **Layout**: `layoutDeskWindows(stageEl)` positions every window with a
  small `right`/`bottom` pixel offset per rank-from-front
  (`DESK_STAGGER_STEP = 26px`) and a matching `z-index`, so windows behind
  the front one stay staggered just enough for their titles to stay
  visible without full overlap.
- **Bringing to front**: clicking any window (card or panel) calls
  `bringDeskWindowToFront(stageEl, win)`, which moves it to the end of
  `_deskWindows` and re-runs the layout — the classic "click to raise"
  behaviour, working the same whether the window is minimized or
  expanded.
- **Minimize vs. close**: the down-arrow on an expanded panel calls
  `closeDeskWindow`'s minimize path — it drops the window back to a card
  on the desk, nothing is removed. The ✕ only appears on a **minimized**
  card, and only there does it fully remove the window from the desk
  (conceptually "back in the file cabinet" — the underlying document is
  untouched either way, since the desk is just a view).
- **Notice → document links**: a notice window created with a linked
  document (see below) shows a "View linked document" button in its panel
  body. Clicking it calls `addToDesk` for that document (fetching the
  freshest copy first), opening or raising it as its own window on the
  same stack — so approving a notice and reviewing the document it's
  about can sit side by side.

## Notice/approval workflow (added 2026-09-09, extended same day)

Notices pinned to the Notice Board can now optionally require approval
and link to a specific document — the mechanism the Founder (or anyone
with an AI session working from the shed's data) uses to track document
approvals without that approval automatically rewriting anything in Core.

- **Schema** (migration `shed_notice_approval_fields`, extended same day
  by `shed_notice_review_request` — both additive only, no existing
  column or RPC signature touched): `shed_items` gained `linked_item_id`
  (bigint, FK to `shed_items.id`, `ON DELETE SET NULL`),
  `requires_approval` (bool), `approved` (bool), `approved_by` (text),
  `approved_at` (timestamptz), `notes` (text), and — from the second
  migration — `review_requested` (bool), `review_requested_by` (text),
  `review_requested_at` (timestamptz). A notice is in one of three states
  at any time: not yet decided, approved, or review requested (the
  reviewer has concerns, changes, or a disagreement to raise) — approving
  clears any pending review request, and requesting review clears any
  existing approval, so the two states never stand together.
- **RPCs** (migrations `shed_notice_rpcs` and `shed_notice_review_request`,
  kept separate from the existing `shed_add_item`/`shed_update_item` so
  nothing already calling those is affected):
  - `shed_add_notice(p, ttl, bdy, req_approval default false, linked_id
    default null, fld default null)` — creates a notice-board item, same
    passphrase-gated pattern as every other write RPC.
  - `shed_set_notice_approval(p, item_id, is_approved, note_text default
    null)` — sets `approved`, stamps `approved_by` (resolved server-side
    from the passphrase, same as everywhere else identity is attributed)
    and `approved_at`, clears any `review_requested` state, and updates
    `notes` when given.
  - `shed_request_notice_review(p, item_id, note_text default null)` —
    the alternative action to approving: stamps `review_requested_by`/
    `review_requested_at`, clears any existing approval, and updates
    `notes` with what's being raised.
- **A notice's title is a fixed label, its subtitle is read live off the
  linked document.** The convention (not enforced by schema, just how
  notices of this kind are composed): title is always "Founder Approval
  Required"; the linked document's own title is rendered as a subtitle
  directly under it — computed on the fly from `linked_item_id` via
  `findItemById`, so it always matches that document's current title
  rather than a stale copy — followed by a "Created ..." line
  (`shed_items.created_at`, not previously surfaced in the UI before this
  feature) and the notice's own body text under a "Things to be aware of"
  heading. The minimized card shows "Re: &lt;document title&gt;" in place
  of a body snippet, since every such card would otherwise show the same
  generic title.
- **Composing a notice**: the Notepad's create-form gained a "This notice
  requires approval" checkbox and, once checked, a "Link a document…" row
  that opens the same folder-drilldown picker the File Cabinet uses
  (`openDocumentPicker`, built on `cabinetChildFolders`/`cabinetItemsAt`).
  Pinning the notice calls `shed_add_notice` instead of `shed_add_item`.
- **Approving or requesting review**: an expanded notice panel with
  `requiresApproval` shows an approval checkbox (its label switches
  between "Not yet approved.", "✓ Approved by ... on ...", and "⚑ Review
  requested by ... on ..." — `renderDeskPanelBody`'s `updateApprovalMeta`),
  a notes textarea, and two buttons: **Save** (persists the notes
  alongside the checkbox's current state, via `shed_set_notice_approval`)
  and **Request Review** (submits the notes as a review request via
  `shed_request_notice_review`, regardless of the checkbox).
  `updateApprovalMeta` gives each of the three states its own colour
  (grey/pending, green/approved, terracotta/review-requested) and briefly
  flashes the line after every successful Save or Request Review, added
  2026-09-09 after a report that Request Review appeared to "do nothing"
  — a direct database check confirmed the RPC had worked correctly all
  along (the row really was flagged for review); the only problem was
  that the only visible change had been one line of small grey text, easy
  to miss when the checkbox itself didn't change. This is purely a
  feedback fix, not a backend change.
- **Deliberately scoped as a shed-side record only** — approving or
  requesting review on a notice does **not** write anything back to the
  Core document or to git. The Founder chose this explicitly: the shed's
  approval/review-request fields are the record of the decision, and
  updating the actual Core document (adding an Archival & Approval Record
  banner, striking through its Status field, etc.) stays a separate,
  deliberate step — the same banner pattern already used throughout
  Core's Founder Review Dossiers.
- **Retrievable by an AI session**: this was an explicit hard requirement
  — any AI session working in this repo (via the Supabase MCP tools, or a
  direct `shed_items` query) can read `requires_approval`, `approved`,
  `approved_by`, `approved_at`, `review_requested`, `review_requested_by`,
  `review_requested_at`, `linked_item_id`, and `notes` directly off
  `shed_items` to check or report on approval status, without needing the
  shed's UI.

## Notice/approval workflow, phase 2 (added 2026-09-09)

Four follow-up pieces, all requested together after the first
approval-required notice (for `Foundations/Founding_Principles.md`) went
live, to make pending approvals harder to miss and expanded desk windows
easier to read side by side.

- **Notice Board hotspot badge**: a small red count badge now sits on the
  Notice Board hotspot itself (both mobile and desktop scenes) whenever
  one or more notices are pending (`requires_approval` true, `approved`
  false) — `updateBoardBadge()` recomputes and shows/hides it after
  every fetch, and after any action that can change a notice's pending
  state (approving, requesting review, pinning a new notice, moving a
  notice to or from the Recycle Bin).
- **Auto-created to-do on every approval-required notice** (migration
  `shed_notice_auto_todo_trigger`, plus a follow-up
  `shed_notice_auto_todo_trigger_grants` migration tightening its
  grants): an `AFTER INSERT` trigger on `shed_items`,
  `shed_items_notice_todo_trg` → `shed_notice_requires_approval_todo()`,
  fires whenever a row is inserted with `requires_approval = true` and
  inserts a matching `shed_todos` row ("Review & approve: <linked
  document's title, or the notice's own title if unlinked> (see Notice
  Board)") plus its opening `shed_todo_status_log` entry — the same
  manual step done by hand for the first notice, now automatic for every
  notice created afterwards, including ones created directly via SQL
  rather than through `shed_add_notice`. The trigger function is
  `SECURITY DEFINER` (needs write access to `shed_todos`/
  `shed_todo_status_log` regardless of who or what inserted the notice)
  but its direct-execute grants were revoked from `public`/`anon`/
  `authenticated` — Postgres already refuses to invoke a trigger function
  outside a real trigger context, so this only removes it from showing up
  as an anon-callable RPC in the security advisors, without changing what
  it can actually be made to do.
- **Document-side pending-notice indicator**: the reverse direction of
  the existing "View linked document" button on a notice. A new
  `pendingNoticesFor(documentId)` helper finds any not-yet-approved
  notice linked to a given document, and two places surface it: a "⚑
  Pending" badge next to a document's title in any list view (Notice
  Board/File Cabinet/Bookshelf row) that has one, and, inside a
  document's own expanded desk panel, a "⚑ N approval notice(s) pending"
  button that opens the first one on the desk — so finding the notice for
  a document you're already looking at doesn't require going back to the
  Notice Board first.
- **Full-screen expand and cross-panel cycle buttons**: every expanded
  (panel-state) desk window's titlebar now has two extra buttons next to
  the existing minimize (↓) button, grouped in a `.dw-titlebtns` wrapper:
  an expand-to-full-screen toggle (⤢, `win.maximized`, applying the
  `.desk-window.panel.maximized` CSS rule which sizes the panel to ~96%
  of the screen) for easier reading of long documents, and — shown only
  when another panel is already open — a cycle button (⇄) that jumps
  focus to the next open panel in stacking order, so switching between
  several expanded docs/notices doesn't require minimizing one first.
  Minimizing a maximized panel resets `maximized` back to `false`, so a
  re-expand always starts at the normal windowed size.
- **Reserved "peek strip" so a card is never fully hidden behind an
  expanded panel** (fixed 2026-09-09, right after the maximize/cycle
  buttons shipped): expanding — or worse, maximizing — a document used
  to genuinely make any other, still-minimized (card-state) window
  unreachable. A card sits only 16–68px from the desk's true bottom-right
  corner, and even the *non*-maximized panel size (`min(680px, 86%)`)
  already extends far enough to cover that whole area, so the card ended
  up entirely behind it with no visible sliver left to click — confirmed
  with a headless-browser reproduction of the exact reported case (a
  maximized document with its notice still closed) before this fix, and
  again after, in both desktop and mobile widths. `layoutDeskWindows`
  now checks whether any card-state window is currently on the desk; if
  so, it reserves a strip along the right edge (`min(270px, 28%)` of the
  stage) and pushes every *expanded* window's right edge — panel or
  maximized alike — left of it, shrinking its width to fit rather than
  letting the CSS-fixed width push it off-stage. Cards keep their normal
  small stagger, now guaranteed to land inside that permanently-free
  strip instead of underneath the panel — exactly the "closed doc keeps
  a visible corner out the side, click it to bring it forward in its
  closed form" behaviour the Founder asked for. The reservation only
  engages when a card actually exists (a lone expanded document still
  gets the full width) and is skipped entirely below the shed's own
  700px mobile/desktop breakpoint, where there isn't width to spare and
  a maximized panel already fills virtually the whole screen regardless
  — there, a card still shows on top via its higher z-index, just
  without a dedicated non-overlapping strip. This also surfaced (and
  fixed) a second, pre-existing gap: the plain card→panel "Expand"
  button never called `layoutDeskWindows` at all, so a freshly-expanded
  window wouldn't have picked up the new reservation regardless.

## List views show title + Send to Desktop only (changed 2026-09-09)

Per the Founder's direction, a list appearing in the Notice Board, File
Cabinet or Bookshelf (`buildItemListEl` in `source/template.html`) now
shows only an item's title and a "Send to Desktop" button — no inline
preview, no expand-in-place, and no Edit/Delete there. Viewing, editing
and deleting all happen only once an item is open on the desk (in a
`renderDeskPanelBody` panel) — that is the one and only place an item can
be edited. This replaced the previous behaviour, where clicking a list
item expanded an inline preview (with its own Edit/Delete) directly in
the Notice Board/File Cabinet/Bookshelf overlay. The document-link picker
used when composing a notice, and the Recycle Bin, are unaffected — the
Founder's direction was specific to these three locations.

## Desk scene art update — lit lamp, pen, raised cup (2026-09-09)

`art/scene-desktop.jpg` was regenerated (via OpenArt, edited from the
prior version rather than created fresh, to keep everything else in the
illustration identical) to add three details to the desk: the brass lamp
is now lit, with a warm glow and a soft pool of light cast onto the desk
and the notebook's near edge; a fountain pen now lies on the desk between
the lamp and the notebook; and the coffee cup was moved up and back
slightly so its top portion crosses the line where the desk's front
surface meets the rest of the room, reading as closer to the viewer for a
more three-dimensional look. Same 1376×768 dimensions as before, so no
other layout changes were needed.

The **`deskpad` hotspot** (the Notepad icon, ✎ — already pen-themed, which
is why it was the natural one to move) was recalibrated in `HOTSPOTS.
desktop` in `source/template.html`, from `cx:50, cy:85` to `cx:26.3,
cy:85.9`, so it now sits directly on the new pen's barrel rather than at
its old generic desk position. Found precisely by cropping the source art
with a coordinate grid overlaid, then confirming the exact point visually
against the pen before committing to the change. This was a **desktop-only**
change — `art/scene-mobile.jpg` and `HOTSPOTS.mobile`'s `deskpad` entry
(`cx:50, cy:72`) are unchanged, and would need the same treatment
separately if the mobile scene gets the same edit later.

Note on the source art file itself: `art/scene-desktop.jpg` shows a
different byte size/hash on disk than the file originally generated by
OpenArt (confirmed harmless — re-staging and inspecting it found
identical 1376×768 dimensions and visually identical content, just a
different JPEG re-encoding pass, evidently applied somewhere in the file
transfer round-trip to the device). This doesn't affect what's actually
served — `index.html` is what `shed.askpip.garden` serves, and it was
built from, and verified against, the original correct file before any
of that happened.

## Mobile desk scene art brought in line with desktop (2026-09-09)

`art/scene-mobile.jpg` was updated with the same treatment as
`scene-desktop.jpg` above (lit lamp, pen, raised cup), and — separately —
the corkboard in this new mobile art now carries the same two notes as
the desktop scene, where the mobile version previously showed different
placeholder notes. Same 896×1200 dimensions as before, so no other
layout changes were needed.

Three `HOTSPOTS.mobile` entries were recalibrated to match the new art,
each located the same way as the desktop pen hotspot (a coordinate grid
overlaid on the source art, then a marker rendered and checked against
the real built page before committing — not eyeballed):

- **`todo`** (To-Do List, ✅): `cx:58, cy:34` → `cx:55.6, cy:38.8`, now
  sitting on the top (smaller, square) corkboard note.
- **`board`** (Notice Board, 📌): `cx:58, cy:44` → `cx:57.5, cy:45.7`,
  now sitting on the second (larger, torn spiral-notebook-style) note
  directly below it.
- **`deskpad`** (Notepad, ✎): `cx:50, cy:72` → `cx:21.2, cy:81.2`, now
  sitting on the new pen, matching what was already done for the desktop
  scene.

Verified by rendering the actual built `index.html` at a real mobile
viewport (390×844) with the lock screen hidden and markers placed at
each hotspot's exact `cx`/`cy` against the real `.scene-bg` element's
rendered rect (not just against the raw source art) — accounting for
whatever letterboxing/cropping the mobile stage applies — before
shipping.

## Mobile badge text + hotspot fine-tuning, and a hotspot-calibration bug fix (2026-09-09)

Three small requests, plus one real bug found while doing them:

- **"Signed in as {name}" badge** now just shows the bare name. On
  mobile the full "Signed in as ..." text was wide enough to collide
  with Pip's speech bubble on the opposite side of the header — and
  since being on this page at all already implies you're signed in,
  the "Signed in as" prefix was redundant. `updateActiveUserBadge()`
  in `template.html` now sets `el.textContent = name` directly.
- **Three mobile hotspots nudged** by a physical amount the Founder
  judged by eye on their own phone: `deskpad` (pen) 5mm left, `rug`
  (Info/feet) 10mm right, `calendar` 5mm up. Converted using the CSS
  reference-pixel definition (1mm = 96/25.4px ≈ 3.7795px) against the
  mobile stage's own box (390×844 at the reference viewport used for
  verification) — `cx`/`cy` are percentages of that box, so a move of
  N mm is `N*3.7795/390*100` percentage points horizontally or
  `N*3.7795/844*100` vertically.
- **Bug found and fixed**: the previous entry below ("Mobile desk scene
  art brought in line with desktop") calibrated `todo`, `board`, and
  `deskpad` by picking a pixel on the raw `scene-mobile.jpg` file and
  using its percentage of the *source image* (896×1200) directly as
  the hotspot's `cx`/`cy` — i.e. percentage of the *stage*. Those are
  not the same thing on mobile: `#stageMobile .scene-bg` is
  deliberately zoomed relative to the stage (`width:125%; left:-12.5%`,
  vertically centered) so a phone screen shows a bit more of the
  bookshelf. A raw source-image percentage only equals the correct
  stage percentage where that zoom transform happens to cancel out
  (near the middle of the frame) — which is why `calendar` and `rug`
  (calibrated earlier, independently, against the rendered page) were
  unaffected, but `todo`, `board`, and `deskpad` were each off by
  several percentage points once actually checked against the built
  page rather than the source file. `deskpad` in particular had drifted
  onto the empty desk below the pen rather than the pen itself.

  Fixed by converting through the `scene-bg` box explicitly instead of
  assuming a 1:1 mapping: on a 390×844 stage the box renders at
  `x:-48.75 y:95.5546875 w:487.5 h:652.890625`, so a source pixel
  `(px,py)` on the 896×1200 art maps to stage percentage
  `((boxX + px/896*boxW)/390*100, (boxY + py/1200*boxH)/844*100)`. This
  ratio holds at any stage size since the box's own offsets are
  percentages of the stage. A comment with this formula is now next to
  `HOTSPOTS` in `template.html` so this doesn't get re-broken.

  Corrected + nudged values:
  - `todo`: `cx:55.6, cy:38.8` → `cx:57.0, cy:41.3` (calibration fix
    only, no nudge requested)
  - `board`: `cx:57.5, cy:45.7` → `cx:59.3, cy:46.6` (calibration fix
    only, no nudge requested)
  - `deskpad`: `cx:21.2, cy:81.2` → `cx:9.2, cy:74.2` (calibration fix
    + 5mm left)
  - `rug`: `cx:50, cy:59` → `cx:59.7, cy:59` (10mm right; baseline was
    already correct)
  - `calendar`: `cx:78, cy:48` → `cx:78, cy:45.8` (5mm up; baseline was
    already correct)

  Verified for real this time: loaded the actual built `index.html` in
  a headless browser at the mobile reference viewport, hid the lock
  screen, hid the hotspot layer to get a clean shot of the art alone,
  and cropped tightly around each target (pen, both corkboard notes,
  the rug, the calendar) with a fine pixel grid to read off its true
  on-screen bounds — then confirmed each hotspot's computed position
  lands inside those bounds against the real render, not the source
  file.

## Desk notebook given aesthetic text; a device-sync gotcha caught (2026-09-09)

`art/scene-desktop.jpg` and `art/scene-mobile.jpg` were swapped for two
new versions with the same dimensions and content, except the open
notebook now reads "Growing Understanding, Cultivating Confidence." in
handwriting — a purely cosmetic addition confirmed by diffing old vs.
new pixel-by-pixel: outside the notebook's text area, differences were
only the same harmless whole-image JPEG re-encoding noise already
documented above, not any change in layout. No hotspot recalibration
was needed as a result (confirmed empirically against the real
rendered page, not assumed).

**New gotcha found while committing the art**: after the first
`device_commit_files` call for `scene-mobile.jpg`, the file's on-device
byte size changed to a new, plausible-looking value — indistinguishable
at a glance from the harmless re-encoding pattern documented under the
desk-scene-art update above. This time it wasn't harmless: staging the
file back down and comparing it pixel-for-pixel against what was meant
to be uploaded showed the device still had the *old* artwork (no
notebook text at all), not the new one — the write had silently not
taken, despite the tool reporting success and a byte count that looked
like ordinary re-encoding drift. A second `device_commit_files` (with
`force: true`) followed by staging the result back down and diffing it
against the intended source confirmed a pixel-perfect match the second
time. Lesson: a changed-but-plausible byte size on a re-committed
binary/image file is not, on its own, evidence the write actually
happened — for an image, staging the on-device copy back down and
diffing its actual pixels (not just comparing byte counts) is the only
reliable check, the same way a text file's exact byte count is checked
after every commit.

## What's built so far

- Recycle Bin: soft-delete with restore + permanent purge, select-all UI
- File Cabinet folders
- Desk creation flow (Notepad → Pin to Notice Board / File in Cabinet)
- Full working Calendar: month-grid UI, add/edit/delete events, event
  chips on the month grid
- To-Do List: draggable/reorderable, 4-state status with full history,
  Active/Completed sections
- Settings menu: change own passphrase, log out
- "Saved [date]" tracking on user-created notices/docs
- All 8 hotspots (Notice Board, To-Do List, Calendar, Bookshelf, File
  Cabinet, Info, Notepad, Recycle Bin), calibrated separately for desktop
  and mobile
- Named-passphrase identity + attribution (Shaphan/Karla)
- Automatic document sync from Core, covering the full documentation
  surface (Foundations, Knowledge Curation System, MVP, Standards,
  Working, AI, Graphics), with full nested subfolder structure preserved
- Nested File Cabinet mirroring Core's own folder structure
- Multi-window, staggered, click-to-front desk — unlimited windows, each
  minimized (card) or expanded (panel), sharing one stack
- Notice/approval workflow: notices can require approval and link to a
  document, or have review requested instead (concerns/changes/
  disagreements, with notes); approval/review state is recorded in the
  shed and retrievable by an AI session, without writing back to the Core
  document itself; a matching to-do task is created automatically
  whenever such a notice is created; the Notice Board hotspot carries a
  live pending-count badge; a linked document shows its own pending-
  notice indicator; and approving/requesting review gives unmistakable
  colour + flash feedback
- List views (Notice Board, File Cabinet, Bookshelf) show only a title
  and a "Send to Desktop" button — no inline preview, no edit-in-place;
  viewing and editing happen only in a desk window
- Expanded desk windows can be toggled full-screen for easier reading,
  and cycled between when more than one is open at once

## What's next

Background/history in `Working/AI Outputs/Garden_Shed_Office_Overview.md`
(now superseded by this README — see the note at the top of that file).

Open items:
- Archive the old `askpip/KCS-PIP-Garden-Shed` GitHub repo (see "Retiring
  the old repo/checkout" above).
- Real image/binary support in the document sync and File Cabinet — the
  2026-09-09 sync expansion is documents-only by explicit Founder
  decision; images were deliberately deferred to a follow-up phase.
- The notice/approval workflow does not write back to the Core document
  or git — updating a Core document's own Archival & Approval Record
  banner once a shed approval is granted is still a separate, manual
  step. Worth a Founder decision if this project wants that automated
  later.
