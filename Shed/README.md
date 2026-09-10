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

## Mobile pen/to-do/board hotspots and desktop board hotspot, corrected again (2026-09-09)

Direct on-device feedback after the notebook-text art swap above: on the
Founder's actual phone, the pen hotspot had drifted onto the lamp base,
and the To-Do List and Notice Board hotspots were touching each other. On
desktop, the Notice Board hotspot sat left of where it should visually
centre. All four were off despite passing this session's own earlier
verification passes at a reference viewport — a reminder that a fine
pixel-level calibration needs re-confirming against the *real* device
report, not just a headless-browser rendering at the same nominal size.

Re-derived all four from scratch against clean (hotspot-hidden)
screenshots of the actual rebuilt page, overlaying a labelled coordinate
grid at 5–10px increments and marking candidate positions with a test
circle matching the real 36px hotspot diameter before committing to a
value — the same fine-grid method used earlier in the session, just
applied more carefully this round:

- **`HOTSPOTS.mobile.deskpad`** (pen): `cx:9.2, cy:74.2` → `cx:3.8,
  cy:76.4` — moved further down the pen's shaft, away from the lamp base
  the previous value sat too close to.
- **`HOTSPOTS.mobile.todo`**: `cx:57.0, cy:41.3` → `cx:57.7, cy:40.6`,
  and **`HOTSPOTS.mobile.board`**: `cx:59.3, cy:46.6` → `cx:58.2, cy:47.4`
  — nudged apart (todo up within its note, board down within its note)
  to open a real gap between the two 36px hotspot circles, which
  previously had only about 9px of clearance between them; both stayed
  centred on their own note.
- **`HOTSPOTS.desktop.board`**: `cx:56, cy:25` → `cx:58, cy:25` — nudged
  right so it centres over the pinned note beneath it.

All four re-verified visually against the freshly rebuilt `index.html`
(not the pre-change marker overlay alone) before shipping.

## File Cabinet folders show a pending-notice count badge (2026-09-09)

A small red count badge — matching the one already on the Notice Board
hotspot — now also appears on any File Cabinet folder card that contains
one or more documents with a pending (unapproved) notice linked to them,
anywhere in that folder's subtree. `cabinetPendingCountUnder(path)` sums
`pendingNoticesFor(item.id).length` (the same predicate `buildItemListEl`
already uses for a document's own "⚑ Pending" row badge) across every
item whose `folder` is at or nested under the given path, and
`folderBadgeHtml(count)` renders it as a small circular badge, absolutely
positioned over the folder icon's top-right corner. Wired into both
`renderFolders()` (top-level folder grid) and `renderCabinetLevel()`
(nested subfolder grid), so a pending notice several folders deep is
still visible from the top of the File Cabinet, not just once you've
drilled down to it. With the shed's first real notice still pending
(linked to `Foundations/Founding_Principles.md`), the Foundations folder
now shows a badge reading "1," confirmed via a functional test with fake
data before shipping.

## "Send to Desktop" buttons renamed to "Desktop" (2026-09-09)

The one button used throughout the Notice Board, File Cabinet and
Bookshelf list views (`buildItemListEl`'s `sendBtn`, see "List views show
title + Send to Desktop only" above) now reads just "Desktop" instead of
"Send to Desktop" — shorter, and the button already only ever appears
next to an item's title in a context where "send this to the desk" is
the only thing it could mean.

## Desk windowing rebuilt again — browser-tab style, replacing the staggered stack (2026-09-09)

The staggered card/panel stack (see "Desk windowing" and the "peek strip"
fix above) turned out to still have the exact problem it was built to
prevent: on a real phone, with the desk window open, the Founder still
couldn't reach any other item — there simply isn't width on a mobile
screen for a reserved peek-strip plus an expanded window at the same
time, and the mobile-breakpoint fallback (no reservation at all, cards on
top by z-index only) never actually gave a clickable sliver to tap. Per
the Founder's own suggested redesign, the entire layered/staggered
approach has been replaced with a **browser-tab-style windowing model**
that has no layering to get wrong in the first place: every open item
always has its own reachable tab, full stop.

- **One shared frame per stage, not one element per open item.** Each
  stage now creates a single `.desk-window` frame element up front
  (`stageEl._deskFrame`), fixed at the desk's bottom-right corner
  (`right:16px; bottom:16px; width:min(680px,86%);
  height:min(560px,80%)`, or ~96%/~92% via `.desk-window.maximized`).
  `stageEl._deskWindows` is now a plain ordered array of `{item, bodyEl}`
  (back-to-front; the last entry is always the active tab) rather than
  the old array of separate DOM windows — there is nothing left to
  stagger, layer, or reserve space around, so `layoutDeskWindows`,
  `DESK_STAGGER_STEP`, `DESK_CARD_WIDTH`, and the whole 700px-breakpoint
  peek-strip reservation logic were all deleted outright rather than
  adjusted.
- **Zero open items**: the frame is hidden (`display:none`) and empty.
  **Exactly one**: a plain titlebar (`.dw-titlebar-single`) shows the
  item's title plus a maximize toggle and a close ✕, no tab strip.
  **Two or more**: the titlebar becomes a scrollable tab strip
  (`.dw-tabs`), one `.dw-tab` per open item (its own title and its own
  small ✕), a maximize toggle at the end. Both the single-item titlebar
  and the tabbed header share the same `buildMaximizeBtn()`, so maximize
  behaves identically regardless of how many items are open. Every
  item's body element is kept alive in the DOM the whole time it's open
  (`display:none` when its tab isn't active, not removed/re-rendered) so
  switching tabs never re-fetches or re-renders anything.
- **Opening an item** (`addToDesk`) that's already open just raises its
  existing tab to active (`bringDeskWindowToFront`) instead of opening a
  duplicate — unchanged behaviour from before, still shared by all five
  existing call sites (the "Review: &lt;document&gt;" link, the pending-notice
  button, a list row's "Desktop" send button, Pin to Notice Board, and
  File in Cabinet), none of which needed to change since `addToDesk`'s
  open-or-focus contract stayed the same.
- **Closing a tab** (its own ✕, or the single titlebar's ✕ when only one
  item is open) removes just that item; the frame itself hides only once
  the last tab closes. **Maximize** is now a per-stage flag
  (`stageEl._deskMaximized`), not per-window, since there's only ever one
  frame to maximize.
- **Hover (desktop) / touch (mobile) on a tab shows its full title** —
  the Founder's specific ask, since a tab strip necessarily truncates
  long titles to fit. A single shared tooltip element
  (`.shed-tab-tooltip`) is appended once, directly to `document.body`,
  and repositioned via `getBoundingClientRect()` math on `mouseenter`
  (desktop) or `touchstart` (mobile, auto-hiding itself after 1.8s so it
  doesn't linger after the finger lifts) — **not** a tooltip nested
  inside the tab itself. The first version tried exactly that (a
  `position:absolute` tooltip inside `.dw-tab` → `.dw-tabs` →
  `.dw-header` → `.desk-window`) and it was silently invisible on screen
  despite `getComputedStyle` correctly reporting `opacity:1;
  visibility:visible` — caught by an actual screenshot, not just a
  computed-style check. Root cause: `.desk-window{overflow:hidden}` and
  `.dw-tabs{overflow-x:auto}` (which per spec forces `overflow-y` to
  compute as `auto` too) were both clipping it regardless of its own
  styles being correct. Switching to a single `position:fixed` element
  on `document.body` sidesteps all ancestor clipping entirely and was
  re-verified as visible and correctly positioned before shipping.
- **The old cycle button (⇄) is gone** — tabs are the replacement for it,
  per the Founder's request, so switching between open items is now a
  tab click (or a hover/touch to preview the title first) rather than a
  separate cycle action. **The old "Expand" button on a minimized card is
  also gone** — there's no minimized-card state left to expand from;
  every open item is simply a tab, always at its full windowed (or
  maximized) size.
- Verified end-to-end with a from-scratch Playwright harness driving the
  real production UI (unlock, hotspot clicks, folder navigation, sending
  items to the desk, tab switching, hover and touch tooltips, maximize/
  restore, closing individual tabs and the last one) against the real
  rebuilt `index.html`, at both a desktop (1600×900) and a real mobile
  (390×844, touch-enabled) viewport — not just the desktop path.

## Three more Founder Approval notices created (2026-09-09)

The Notice Board's first "Founder Approval Required" notice (linked to
`Foundations/Founding_Principles.md`) was joined by three more, one each
for the other three Foundation documents the Project Backlog had flagged
as still genuinely unapproved: `AskPIP_Vision_Statement.md` (v2.1, Founder
Review), `Gardener_Experience_Charter.md` (v3.0 Founder Draft, migrated
from Drive, mentions the still-unmigrated companion "User Experience
Charter" draft), and `Pip_Character_Profile.md` (a Discussion Draft whose
own Status field says approving it here wouldn't itself establish a
brand standard). Each notice's body was written from that document's own
Metadata block rather than reused boilerplate, so it explains what
approving that specific document would (and wouldn't) mean. Inserted
directly into `shed_items` (linking each to its synced document's real
`id`) rather than through `shed_add_notice`, since that RPC needs a real
passphrase this session doesn't have — the auto-todo trigger (see
"Notice/approval workflow, phase 2" above) fires on any insert regardless
of path, confirmed by checking that all three matching `shed_todos` rows
were created automatically. The Notice Board badge now reads 4.

## To-Do List hotspot gets a pending-count badge (2026-09-09)

The same small red badge already on the Notice Board hotspot now also
appears on the To-Do List hotspot, showing how many tasks aren't yet
ticked off in any way — Received, In Progress and Blocked all count;
only Completed clears it. `updateTodoBadge(todos)` mirrors
`updateBoardBadge()`'s logic exactly, but to-do tasks aren't part of
`CONTENT`/`shed_list_items` the way notices are (they're a separate
table, only ever fetched when the To-Do List panel itself is opened), so
a lightweight `fetchTodoBadgeCount(pass)` fetches just for the badge at
unlock time (alongside the existing item fetch, via `Promise.all`) and
the panel's own `loadTodos()` keeps it current afterward — every add,
status change, delete and reorder there already re-fetches and now also
calls `updateTodoBadge()`, so no separate hook was needed for those.

## Info guide notes brought up to date, plus two new ones (2026-09-09)

The Info panel's seven guide notes (`shed_items` rows, `location='rug'`)
hadn't been touched since well before the named-passphrase migration, the
notice/approval workflow, the To-Do List, or the desk's move to browser
tabs — several were flatly wrong (still describing "a shared passphrase"
and "click an item to expand it," and the room's own area count was
seven, missing the To-Do List hotspot entirely). Updated in place, via
direct `shed_items` writes (same non-RPC reasoning as the notices above):

- **"How to Use This Shed"** — area count corrected to eight (adds the
  To-Do List), each area's badge behaviour noted, "expand" language
  replaced with "click Desktop to open it on the desk" plus a short
  explanation of tabs/hover-tooltip/maximize, and the passphrase
  description corrected to "your own passphrase" (naming the Settings
  gear for changing it) rather than a single shared one.
- **"Filing a Document"** — the stale "a small note appears on the desk
  with an Expand option" replaced with the real Desktop-button-and-tabs
  flow; added a line on the "This notice requires approval" checkbox and
  document-linking, pointing at the new note below.
- **"Getting Started"** — now mentions the To-Do List and the
  Notice Board's pending-decision badge, and corrects the same stale
  passphrase wording as above.
- **New: "Notices That Need Approval"** (`sort_order:21`, right after
  "Filing a Document") — the notice/approval workflow had no guide
  coverage at all until now: composing one, the three-state approval
  model and its colour coding, and where its two pending-count badges
  show up.
- **New: "The To-Do List"** (`sort_order:23`, between "Using the
  Calendar" and "Using the Recycle Bin") — likewise previously
  undocumented despite existing since 2026-09-08: adding/reordering/
  deleting tasks, the four statuses and their history, and the new
  badge.

"Using the Calendar" and "Using the Recycle Bin" were re-read and found
still accurate — left untouched.

## Desk window default size shrunk, corner-anchored (2026-09-09)

Direct feedback right after the tab redesign shipped: even the new
tabbed desk window was still opening far too large by default —
`min(680px, 86%)` wide by `min(560px, 80%)` tall — which on a phone
covered the Notice Board hotspot entirely, so a second notice couldn't
be opened while a document was already open, the exact "can't reach
anything else" problem the tab redesign was meant to solve in the first
place, just moved one level up. Per the Founder's preferred option
(offered alongside two others), the resting size is now small and fixed
— `min(340px, 82%)` wide, `min(400px, 55%)` tall, "phone-card-sized" —
still corner-anchored bottom-right; only **Maximize** now reaches the
old large size, and Restore returns to this new small default.

Verified against the exact reported scenario: at a real 390×844 mobile
viewport, with a document already open on the desk, the Notice Board
hotspot's bounding box no longer overlaps the desk window's at all (a
real Playwright pointer click on the hotspot — not a scripted DOM
`.click()` bypass — now lands and opens the board panel normally). At
that size the To-Do List, Calendar, Bookshelf and Notepad/pen hotspots
also stay clear; the Info and Recycle Bin hotspots (both low on the
scene, where the window is anchored) can still end up covered — accepted
as a reasonable trade-off since reaching the Notice Board while
something is open was the specific, stated problem. Tab switching, the
hover/touch title tooltip, and maximize/restore were all re-verified
working correctly at the new smaller size before shipping.

## Three bugs from this round's own changes, found and fixed immediately (2026-09-09)

Direct feedback right after the round above shipped, all three real:

- **The four Founder Approval notices (and their auto-created To-Do tasks)
  showed "Added by Claude" / "Received by Claude."** They'd been inserted
  directly into `shed_items` rather than through `shed_add_notice` (see
  above), and `created_by`/`updated_by` were set to the literal string
  `"Claude"` — matching what an earlier session had already done for the
  first notice, but never actually a valid identity in the shed's
  named-passphrase model (Shaphan/Karla only). The auto-todo trigger
  (`shed_notice_requires_approval_todo`) copies a notice's `created_by`
  straight through to its generated to-do and status-log rows
  (`actor := coalesce(new.created_by, 'Shed')`), which is what carried
  "Claude" into the To-Do List display too. Fixed by updating all four
  notices, their four generated to-do rows, and their four status-log
  entries directly in Supabase, from `'Claude'` to `'Shed'` — the
  trigger's own built-in fallback label for exactly this case, so it now
  reads "Added by Shed" throughout. `Founding_Principles`' notice kept
  its real `updated_by:"Shaphan"` untouched (a real action taken through
  the shed's own UI, not part of this fix). No code changed — this was a
  data-only correction; a notice or to-do created normally, through the
  shed's own UI, has always stamped the real signed-in name and was never
  affected.
- **A tab's hover/touch title tooltip could get stuck on screen after its
  desk window closed.** The shared tooltip element (`.shed-tab-tooltip`,
  see "Desk windowing rebuilt again" above) is only ever hidden by a
  `mouseleave` on the tab it's attached to, or a touch auto-hide timer —
  neither fires when the tab itself is removed from the DOM by closing
  it (or the whole window) while the pointer is still sitting over where
  the tab was, since nothing actually moved away. Fixed by calling
  `hideTabTooltip()` unconditionally at the very start of
  `renderDeskChrome()`, which runs on every tab-strip change (opening,
  closing, switching tabs, maximize/restore) — so any tooltip left over
  from a tab that's about to disappear or move is always cleared before
  the rebuild, not just when the pointer happens to leave naturally.
  Reproduced the exact reported case (hover a tab, close it without
  moving the mouse away first) before and after the fix.
- **The mobile pen (`deskpad`) hotspot was still not on the pen**, despite
  being "fixed" and visually verified earlier the same day. Re-checked
  properly this time with a fine pixel grid laid directly over a fresh
  screenshot of the actual rendered page (not the source art, and not
  reasoning from a crop that turned out to be misleading) at several real
  phone widths (360/375/390/414/428px) — the previous value (`cx:3.8`)
  put the hotspot's left edge off-screen at every one of them (roughly
  10% of the 36px circle clipped), and, worse, its visible remainder
  landed on bare desk wood below-left of the pen, not on the pen at all.
  Moved to `cx:16.7, cy:73.5`, centred on the pen's wooden grip/barrel —
  the thickest, safest part of it, well clear of both the lamp base above
  and the desk edge below — and confirmed fully on-screen and correctly
  placed at all five widths tested, not just one reference viewport.

## Login flakiness fixed — autofill confusion + lock-screen reset guard (2026-09-09)

Direct report: "different auto fills keep trying to enter my passphrase,
and sometimes the inside view opens then it jumps back to the outside
login... it usually takes me three attempts to log in."

**Diagnosis.** The shed has two real, named passphrases (Shaphan's and
Karla's) that can both end up saved by a browser's password manager
against the same URL. The lock forms' passphrase inputs had
`autocomplete="off"` — a value modern browsers largely ignore for
password fields specifically — and no username field of any kind for the
browser to key its saved credentials against, so autofill had nothing to
disambiguate which saved value belonged where and could offer or insert
the wrong one. For the second symptom ("jumps back to the outside
login"), `showLock()` is only ever called once, at page init, and nothing
else in the JS removes the `unlocked` class — the most plausible
mechanism is a native (non-JS-intercepted) form submission slipping past
`preventDefault()`, plausibly via autofill's own auto-submit behaviour.
Since neither lock form has an `action` attribute, a native submission
falls back to a same-page GET reload, which — since the shed deliberately
persists nothing — resets the whole page back to the lock screen.

**Fix**, a bundle of standard, well-documented hardening rather than one
silver-bullet change (the exact autofill/auto-submit interaction can't be
reproduced in a headless test environment, so this targets the most
likely and best-supported causes):

- Both lock forms (`lockFormMobile`, `lockFormDesktop`) now include a
  hidden `autocomplete="username"` anchor field (value `"shed"`, visually
  hidden, `tabindex="-1"`, `aria-hidden="true"`) immediately before the
  passphrase input, giving the browser a stable field to key saved
  credentials against.
- The passphrase inputs themselves changed from `autocomplete="off"` to
  `autocomplete="new-password"` — the standards-documented way to
  actively suppress autofill/save-password prompts, and a value browsers
  do respect, unlike `off`. This also matches the app's own stated design
  (nothing is ever persisted, so there's nothing to "remember").
- The change-passphrase modal's three fields got the semantically correct
  values too: `current-password` for the current-passphrase field,
  `new-password` for the new and confirm fields (previously all three
  were `off`).
- Added an `unlockInFlight` module-level guard in `tryUnlock()`: a second
  call while one is already in flight is ignored outright, so an autofill
  auto-submit racing a manual submit (or a fast double-tap) can no longer
  interleave two unlock attempts.
- Added `e.stopPropagation()` alongside the existing `e.preventDefault()`
  in both lock forms' submit handlers, as defense-in-depth against a
  submission slipping through to native handling.

**Verified via Playwright**: the hidden username field doesn't interfere
with reading the real passphrase value; an incorrect passphrase still
shows the error state and does not unlock; a correct passphrase still
unlocks normally; and firing two submit events back-to-back against the
same form now results in exactly one `shed_identify_user` call and a
clean unlock, where before the guard both would have gone through. What
could *not* be verified directly is the real browser/password-manager
autofill behaviour itself — this environment has no way to reproduce a
real saved-credential conflict or an autofill auto-submit the way a
phone browser does, so if the "jumps back" symptom persists, the next
useful piece of information would be which browser/device it happens on.

## Review requests: a way back out, and their own To-Do item (2026-09-09)

Direct report: no way existed to remove a review request from a notice
once made (the `Founding_Principles` notice, set into "Review requested"
via the shed's own UI, had no path back other than approving it outright)
— plus a request that a review being requested should show up as its own
To-Do List item when it's saved, not just as a status line on the notice.

**Removing a review request.** `shed_set_notice_approval` already clears
`review_requested` as a side effect of approving, but there was no
complementary way to simply withdraw a review request without approving
— "actually, never mind" had nowhere to go. Added a new RPC,
`shed_clear_notice_review(p, item_id)`, that resets `review_requested`,
`review_requested_by` and `review_requested_at` back to their neutral
values while leaving `approved`/`approved_by`/`approved_at` and `notes`
untouched — so the notice returns to plain "Not yet approved." On the
notice panel, the "Request Review" button now doubles as the way back
out: whenever a notice's review is currently pending it reads **"Cancel
Review Request"** instead and calls the new RPC; the hint text below it
and the approval-status line above both update to match. Approving
directly (checking "Approved") still also clears any pending review
request, exactly as before — this only adds the missing direct path.

**Review requests now create a To-Do item.** A new database trigger,
`shed_notice_review_requested_todo_trigger` (fires `AFTER UPDATE` on
`shed_items`, mirroring the existing `shed_notice_requires_approval_todo`
trigger that fires on a notice's initial `INSERT`), creates a matching
`shed_todos`/`shed_todo_status_log` row every time a notice's
`review_requested` genuinely transitions to `true` — so "Request Review"
now surfaces on the To-Do List the same way a brand-new approval-required
notice already does, and counts toward its pending-count badge. The
trigger only fires on that specific `false`/`null` → `true` transition
(guarded with `old.review_requested is distinct from new.review_requested`
in its `WHEN` clause), so an unrelated save on a notice already in the
review-requested state — saving edited notes, for instance — does not
spam a duplicate To-Do entry, and cancelling a review request does not
create one either (only asking for review does).

**Verified directly in Supabase** (trigger behaviour: a genuine
false→true transition creates exactly one To-Do row correctly naming the
linked document; an unrelated save while already `true` creates none; a
true→false transition creates none) and **via Playwright against the
real production UI** (a notice already in "Review requested" opens
showing "Cancel Review Request"; clicking it calls the new RPC and the
notice correctly returns to "Not yet approved." with the button flipping
back to "Request Review"; requesting review again correctly flips it back
to "Cancel Review Request"; and approving directly still clears a pending
review request and updates the button, exactly as before). Test data
created during verification was cleaned up afterward — nothing test-only
was left in the live database.

## To-Do List: a genuine "New" stage before "Received," plus an attribution fix (2026-09-09)

Direct report: every to-do — whether typed in manually or auto-created by
a trigger — showed up already saying "Received by \<name\>" the instant
it existed, which reads as if that person had already seen and
acknowledged it. It hadn't been seen by anyone; it had just been created.
On top of that, several to-dos and notices created earlier the same day
(commissioned directly by the Founder, but inserted straight into the
database because the shed's own passphrase-gated RPC path wasn't
available to this session) were attributed to "Shed" rather than to the
Founder who actually asked for them.

**A true "New" stage.** `shed_todos.status` gains a fifth value, `new`,
ahead of the existing `received` / `in_progress` / `blocked` /
`completed`, and it's now the column's actual default (previously
`received` was). Every path that creates a to-do — the manual
`shed_add_todo` RPC, and both auto-todo triggers (a notice needing
approval; a review being requested) — now inserts it as `new` instead of
`received`. On the To-Do List panel, a `new` task shows only its "Added
by \<name\> on \<date\>" line; the second line ("Received by...", "In
Progress by...", etc.) is deliberately suppressed while status is `new`,
since there's nothing genuine to report yet, and reappears the moment a
real person picks an actual status from the dropdown next to the task —
which now lists **New** as its first, already-selected option. A `new`
row also gets its own dashed, muted-gray left-border color on the card,
visually distinct from "received"'s solid tan, so an untouched task
doesn't read as just another flavor of an already-acknowledged one.

**Attribution fix.** The four "Review & approve" to-do tasks and the
notices/todos created earlier the same day that were stamped "Shed"
(itself an earlier same-day fix, from "Claude") are, on reflection,
attributed to the wrong party: the Founder directly asked for these to
be created, so they should read "Added by Shaphan," not a generic system
identity. Corrected in the database: `shed_items` 174/578/579/580 and
`shed_todos` 6/8/9/10 now show `created_by = "Shaphan"` (and
`updated_by` too, wherever no real subsequent action by an actual person
had happened yet). Three of the four to-dos (8, 9, 10 — the ones nobody
had genuinely touched) also had their status corrected from the old
false "Received" default back to the new, honest "New," along with their
history log's very first entry. The fourth (6, `Founding_Principles`)
already carries a real subsequent history — the Founder genuinely set it
to Blocked and back to Received through the shed's own UI — so only its
`created_by` needed fixing; its real status history was left untouched.

**Verified via Playwright**: a freshly auto-created task shows only
"Added by..." with no false second line and defaults to "New" in its
dropdown; a task with genuine prior history (created differently, then
actually received by a named person) still shows both lines correctly;
manually selecting "Received" on a "New" task immediately produces a
correct, honest "Received by \<name\>" line; and a brand-new manually
added task also starts as "New" with no second line. Data corrections
were verified directly in Supabase — zero rows anywhere still reference
"Shed."

## Per-person notice progress: "where is each of us at with this" (2026-09-09)

> **Superseded the same day** — see "Notice status merged with its to-do:
> one shared status, not two" below. Kept here as the historical record of
> what was actually built and verified first; none of `shed_item_progress`,
> `shed_get_item_progress` or `shed_set_item_progress` exist any more.

Requested directly: with two named users reviewing the same notices, there
was no way for either of them to see where the other personally stood
with one — only the shared approve/review-request decision, which says
nothing about whether it's even been opened yet. Asked for design input
first (per-person vs. one shared status; which stages) rather than
guessing — the Founder chose **per-person** tracking with three stages:
**Not Started → Reading → Discussing**.

**New table and RPCs.** `shed_item_progress` holds one row per
(item, named user), defaulting implicitly to `not_started` for anyone
with no row yet — so adding a third named user later needs no data
migration. `shed_get_item_progress(p, item_id)` returns every named
user's current stage for an item (a `LEFT JOIN` against `shed_users`, so
a user who's never touched it still comes back as `not_started` rather
than being silently missing). `shed_set_item_progress(p, item_id, stage)`
sets progress for **the calling user only** — resolved from the
passphrase, never taken as a parameter — so nobody can set another
person's progress on their behalf, even by tampering with the request.
Both are gated the same way as every other shed table: row-level
security is on with zero policies, so direct table access is blocked
entirely and everything must go through these `SECURITY DEFINER` RPCs.

**On the notice panel**, a new "Progress" section sits above the existing
Approved/Notes/Request-Review controls — deliberately styled lighter and
quieter, since it's informational, not itself a decision. Each named
user gets their own row: the signed-in user's own row is a dropdown they
can change directly; the other person's row is plain, read-only text.
Changing your own stage saves immediately via `shed_set_item_progress`,
with no effect on the notice's actual approval state — the two systems
are independent by design. The section loads asynchronously right when
a notice panel opens and shows a brief "Loading progress…" placeholder
in the meantime.

**Verified directly against the database first** (a bug caught this
way: the RPC's `item_id` parameter name collided with
`shed_item_progress.item_id` inside its `ON CONFLICT` clause — a real
"column reference is ambiguous" error on the very first test call, fixed
by renaming the parameter to `p_item_id` and re-tested clean; the upsert
path was also confirmed to update in place rather than duplicate rows,
and an invalid stage value is correctly rejected) using a temporary test
user created and fully deleted afterward — confirmed zero real or
leftover test rows in the table once done. Then **verified via Playwright
against the real production UI**: both named users' rows render in
alphabetical order; the non-active user's row is genuinely read-only
(no `<select>` present) while the active user's is a working dropdown
pre-set to their actual stored stage; changing it calls the RPC with the
correct parameters; the section is entirely absent on a non-notice
document; and it coexists correctly alongside the existing Approved
checkbox and Cancel Review Request controls on the same notice panel.

## Notice status merged with its to-do: one shared status, not two (2026-09-09)

Founder feedback, the same day the per-person progress tracker above
shipped: a notice and the to-do task it spawns are "the same task," so
they should carry **one** status, in the **same** categories the To-Do
List already uses — New, Received, In Progress, Blocked, Completed —
changeable from either place and instantly reflected in both, rather than
two separate trackers that could say different things. Confirmed directly
before building (this reverses the per-person design chosen only hours
earlier): replace the per-person rows with a single shared status, yes.

**One row, not two copies kept in sync.** Rather than duplicating a status
value on both `shed_items` and `shed_todos` and writing triggers to keep
them matching (real risk of drift or update loops), a notice now simply
**points at** its to-do: `shed_items.todo_id` (new column, nullable,
`references shed_todos(id) on delete set null`) names the one to-do row
that *is* the notice's status. There is only ever one place the status
lives — `shed_todos.status` — so the two views can't disagree by
construction. The notice panel's Status dropdown and the To-Do List's own
status dropdown call the exact same RPC (`shed_set_todo_status`) on the
exact same row; nothing new was needed to make a change in one place show
up in the other.

**Trigger changes, so every notice ends up linked.** The trigger that
creates a to-do when a notice is marked "requires approval"
(`shed_notice_requires_approval_todo`) now also sets `todo_id` on the
notice right after inserting its to-do. The review-request trigger
(`shed_notice_review_requested_todo`) used to create a *second* to-do
every time review was requested — now, if the notice already has a linked
to-do (the normal case going forward), it **reuses that same to-do**,
resetting its status back to New and logging the change, instead of
spawning a duplicate. It only falls back to creating (and linking) a new
one for a notice that somehow has no link yet. The four existing real
notices (`Founder Approval Required` ×4, ids 174/578/579/580) were
backfilled to point at the to-dos already created for them, matched
unambiguously by their linked document's title and identical creation
timestamp, and verified before moving on.

**On the notice panel**, the per-person "Progress" section is now a single
"Status" control in the same spot — a dropdown (open to anyone, exactly
like a To-Do List row, not restricted to the signed-in user) plus a small
"set by \<name\>" meta line. A notice with no linked to-do yet (none in
practice now, but handled defensively) shows "No linked to-do yet."
instead of a dropdown.

**On the Notice Board list**, a notice's status now shows as a small
read-only chip right in the list row (e.g. "In Progress"), fetched once
via the existing `shed_list_todos` RPC when the board panel opens and
matched to each notice by its `todo_id` — no new RPC needed for this. This
was the specific, original ask: "the progress status in each notice needs
to be visible on the notice board view... not down at the bottom of each
notice." The list stays otherwise exactly as minimal as before (title +
Desktop button, no edit-in-place) — the status chip is a glance, not a
control; changing it still requires opening the notice or its to-do.

**Removed:** `shed_item_progress` (table), `shed_get_item_progress` and
`shed_set_item_progress` (RPCs) — none of them ever shipped to production
before being superseded, so no client-facing migration was needed.
`shed_get_all_notice_progress`, drafted mid-session for the original
per-notice board-list ask before this redesign, was likewise dropped
without ever being wired into the UI.

**Verified directly against the database first**, using a temporary test
user created and fully deleted afterward: a newly created requires-
approval notice links to its to-do automatically; requesting review on it
reuses that same to-do (confirmed no duplicate to-do row is created) and
resets its status to New; setting the to-do's status directly is visible
on the notice's `todo_id` immediately, since it's the same row. Then
**verified via Playwright** against a freshly rebuilt copy of the real
production page (stubbing only the Supabase client, not the app logic):
the Notice Board list shows the correct status chip for a linked notice
and shows nothing (no crash) for one with no link; opening a notice shows
its Status dropdown pre-set to the correct value with the right "set by"
name; changing it calls `shed_set_todo_status` with the correct `todo_id`
and new status; and a notice with no linked to-do shows "No linked to-do
yet." cleanly instead of erroring.

## File Cabinet titles fixed for six documents showing boilerplate text instead of their real title (2026-09-09)

Reported directly, from a screenshot of the File Cabinet's "Founder Review
Dossiers" folder: three rows all read the same generic
"DRAFT — NOT APPROVED — FOR FOUNDER REVIEW ONLY" instead of their actual
titles. Root cause was in `shed-doc-sync.mjs`'s `titleFromMarkdown()`,
which simply takes a document's first `# ` heading as its title — correct
for most of the repo, but wrong for two specific document templates that
repeat the exact same first heading across every instance of that type:
(1) `FRD-BUSHROSE-DEADWOOD-01.md`, `-DORMANCY-01.md` and `-DORMANCY-02.md`
(an older Founder Review Dossier template) preserve their original
submission's first heading verbatim even once approved, per FRDS §5.3 —
and for that template, the first heading was always this status banner,
with the document's real subject living only in a `| Document Title | ... |`
metadata-table row instead. (2) All three ARCs
(`ARC-BUSHROSE-DEADWOOD-01.md`, `-DORMANCY-01.md`,
`-RECENTPLANT-01.md`) open with the same fixed template heading,
"PIP Mother Information Library — Approved Research Compilation," with
their real subject in an `| ARC Title | ... |` row instead — so all three
ARCs had this exact same problem too, one folder over, not just the
three originally reported. `titleFromMarkdown()` now checks the matched
heading against these two known generic strings and, only when it
matches one, falls back to the metadata table's title field before
finally falling back to the filename (unaffected documents — everything
else in the repo — behave exactly as before). Verified the new logic
against all seven real affected files' actual content before shipping,
confirming each now extracts its correct, distinct title. The nine
already-synced rows (six FRD copies across both `Working/Founder Review/`
and the archived KCS location, three ARCs) were corrected directly in the
database immediately rather than waiting for the next sync run; the code
fix ensures any future sync (or a currently-correct document that later
adopts one of these templates) gets the right title the first time. See
CHANGELOG.

## Same-series revisions collapse into one expandable row in the File Cabinet (2026-09-09)

Follow-up to the title fix above, asked directly once the titles were
readable: the "Recently Planted Bush Roses" dossier has four Founder-
approved revisions (`FRD-BUSHROSE-RECENTPLANT-01` through `-04`) — each
one a real, separate, never-editable document per FRDS §5.3 (a governed
dossier can't be changed after submission, so a later round of research
becomes a whole new document rather than an edit) — and with the File
Cabinet mirroring Core's real folders, all four show up twice each
(`Working/Founder Review/` and the archived KCS copy), eight rows in one
folder for what's really one evolving answer. Asked how to present this
before picking an approach, rather than guessing; the Founder chose
grouping the series into one expandable row.

**Detection is deliberately conservative and title-based, not filename-
based.** A document's title ending in the literal suffix `" (Revision N)"`
(which these four dossiers already carry, self-declared, in their own
first heading) marks it as part of a series; `groupIntoSeries` groups
same-base-title items together only when at least one carries that
marker — two unrelated documents that merely happen to share an identical
title (checked directly: two Source PKRs both named the same thing exist
elsewhere in the cabinet) are correctly left ungrouped, and nothing that
merely ends in a number (the many individually-numbered Source/Definition
PKRs) is at risk of being swept into a false "series." This is a pure
list-*rendering* change in `buildItemListEl` — recomputed fresh every
render from the same items array, no new field, no database or Core
change of any kind, and every revision is still fully reachable, each
with its own working "Desktop" button, once the group is expanded.

Verified via Playwright against a freshly built copy of the real page,
with a deliberate false-positive case included (two same-titled, unmarked
items) alongside the real four-part series and an unrelated single
document: the series collapsed into one row labelled "4 revisions"; the
false-positive pair and the standalone document both rendered normally,
ungrouped; expanding the series showed the four members in the correct
order, labelled "Original," "Revision 2," "Revision 3," "Revision 4."

## A to-do can't be marked Completed while its notice is unresolved; the To-Do List opens as a desk tab (2026-09-10)

Karla logged into the shed for the first time and worked through her queue: approving three of the four Foundation documents (Founding Principles, Vision Statement, Character Profile) and, on the fourth (the Gardener Experience Charter), opening a review-request notice instead — asking for a specific wording addition to the document's closing "The Measure of Success" section rather than approving as-is — plus five standalone notices suggesting general shed improvements. Asked to summarize all of this for the Founder, a direct look at the underlying data (not just the notice titles) turned up a real bug: two of Karla's own to-dos were sitting at status **Completed** despite the linked notice never actually being approved — the Charter's original "Founder Approval Required" notice (`approved = false`), and her own separate review-request notice on the same document (`review_requested = true`, her note reading "This is awaiting reply"). Nothing in the code had actually locked either notice against further changes (there was no such guard anywhere), but the status merge shipped the day before (see "Notice status merged with its to-do" above) meant the Notice Board's status chip and the To-Do List both now showed "Completed" on something nobody had actually finished — exactly the ambiguity Karla's own separate suggestion below ("no way of knowing if I've approved something") flagged independently, from the other direction.

**The fix, asked for directly, has three parts:**

1. **Server-side blocker.** `shed_set_todo_status` now checks, only when `new_status = 'completed'`: does any `shed_items` row reference this `todo_id`, and if so, is `approved = false` or `review_requested = true`? If so, it raises an exception instead of completing the update — `"This task's notice has not been approved yet (or still has an open review request). Approve the notice -- or resolve the review request -- before marking it Completed."` Plain to-dos with no linked notice (added manually, or any future to-do that isn't tied to a notice) are never affected — the check only runs when a `shed_items.todo_id` reference actually exists. This is the authoritative check: both RPC call sites below rely on it as the real source of truth, not just their own client-side guard.
2. **Client-side guard, both places a to-do's status is set.** The notice's own desk-panel Status dropdown (`renderStatusRow` in `renderDeskPanelBody`) and the To-Do List's own per-row status select (`buildRow` in the new `renderTodoListBody`, see below) both now disable the "Completed" `<option>` outright when the linked notice is unapproved or has an open review request, with a `title` tooltip explaining why — so the obvious case never reaches the server error at all. The notice panel's version refreshes live: a new `refreshStatusRow()` helper is called from `applyApprovalRow` (the shared handler behind Approve/Request Review/Cancel Review), so approving a notice immediately re-enables "Completed" in the same window, without needing to close and reopen it.
3. **Existing bad data corrected.** The two already-stuck to-dos (id 9, linked to the Charter's original approval notice; id 20, linked to Karla's review-request notice) were reset from `completed` back to `in_progress` directly in the database, with a matching `shed_todo_status_log` entry — an honest reflection of "still open," not a guess at what their final status should be once the Founder actually resolves each one.

**Verified against the database first**, using the established temporary-test-user pattern (a throwaway `shed_users` row, a throwaway notice created via `shed_add_notice`, its auto-created to-do): confirmed `shed_set_todo_status(..., 'completed')` is rejected while the notice is unapproved, succeeds once `shed_set_notice_approval` approves it, and is rejected again after `shed_request_notice_review` flips it back to an open review request — covering both halves of the `approved = false or review_requested = true` condition, not just one. All test rows (the to-do, its status-log entry, the notice, and the test user) were deleted afterward and confirmed gone with a zero-row count check. Then verified via Playwright against a freshly built copy of the real page (stubbed Supabase client/RPCs): the Completed option's disabled state matches a linked notice's real approval state, a plain manually-added to-do's Completed option is never disabled, and approving a notice live-updates the open notice panel's own status select without a reload.

### The To-Do List now opens as its own tab on the desk, and a to-do can link straight to its notice

Two more pieces, asked for in the same request. First: a to-do linked to a notice (`shed_items.todo_id`) now shows a small **"View Notice"** link in its row (`.todo-open-notice`), next to History/Delete — clicking it calls the same `addToDesk` every other "open on the desk" action already uses, so the notice opens as a tab right alongside whatever's already open. Second, and what makes that link actually useful rather than opening a notice invisibly behind a modal: the To-Do List itself no longer opens as a standalone modal panel (`openPanel`). It now opens the same way a document or notice does — as a tab in the shared desk-window frame — via a new `openTodoDesk(stageEl)` that sends a fixed pseudo-item (`{id: "__todo_list__", title: "To-Do List", kind: "todo-list"}`) through `addToDesk`, exactly like any real item; `addToDesk`'s existing dedup logic (keyed on `item.id`) means a second click on the To-Do List hotspot just brings the same tab forward rather than opening a duplicate. `renderDeskPanelBody` branches on `item.kind === "todo-list"` at the top and hands off to a new `renderTodoListBody(stageEl, win, containerEl)` — the entire previous `openPanel` `key === "todo"` branch (load/render/drag-reorder/add-task, ~250 lines), moved essentially unchanged except that its container is now a desk window's body element instead of a modal's panel body. The practical effect: clicking "View Notice" from a to-do row opens the notice as a second tab while the To-Do List stays open as the first — nothing closes out from under you, addressing the same friction as Karla's own suggestion about staying within whichever tool you're using (see below) for this specific case.

Verified via Playwright: opening the To-Do List no longer creates a `.overlay` modal at all; it renders inside the shared `.desk-window` frame with a normal single-tab titlebar reading "To-Do List"; a row with a linked notice shows the View Notice button and a row without one (a plain manually-added task) doesn't; clicking it opens a second tab, brings it to the front, and leaves "To-Do List" still present and clickable in the tab strip.

### Karla's inputs, for the record

Summarized directly for the Founder rather than acted on unilaterally, since these are another named user's inputs the Founder needs to decide on: **approved** — Founding Principles, Vision Statement, Pip Character Profile. **Review requested, not approved** — Gardener Experience Charter, asking for a wording addition to "The Measure of Success" ("Pip succeeds when plant health is apparent," or similar). **Five standalone site suggestions** (no linked document, so nothing to approve — feature requests): notice-to-document/notice deep links from the To-Do List (built above); staying inside whichever tool (To-Do List/Notice Board/Bookshelf) after opening and closing the wrong item, instead of dropping back to the main shed view; an "approved" indicator plus distinct notice titles on the Notice Board, since all of them currently read "Founder Approval Required" and she had no way to tell which one she'd just approved — the same root confusion the Completed-status bug above surfaced independently; letting the "New Notice" composer minimize so she can check another open document while drafting; and changing the on-screen text cursor from white to black for visibility while editing. See `Working/Project_Backlog.md`'s Pending Founder Decisions and Resolved sections for the tracked record.

## A test-data mistake, a stale-list fix it exposed, and five direct follow-up requests (2026-09-10)

Right after the completion-blocker work above shipped, the Founder reported seeing roughly 20 duplicate "TEST notice for blocker" notices and to-dos on the live shed — alarming, and rightly so. What actually happened: the one throwaway test notice created via `shed_add_notice` to verify the new blocker had, it turned out, been executed 22 times against the live database — almost certainly a network retry on this session's connection to Supabase resending an already-successful, non-idempotent call without any visible sign it had happened. The first cleanup pass only deleted the single ID that had been noted down, missing the other 21; a full-table count query (`select count(*) from shed_items where created_by = '__TestBlocker__'`, not a check against one remembered ID) found and removed all of them, confirmed clean with a fresh zero-count check. Recorded here plainly rather than glossed over.

That incident also surfaced a real, separate bug: a shed tab that had been open for a while kept showing the deleted test rows even after they were gone from the database, because `CONTENT` (the client's in-memory copy of every document/notice) is only ever fetched once, at unlock — nothing re-fetches it afterward. Fixed directly: `openPanel`'s list branch (Notice Board/File Cabinet/Bookshelf) now calls `fetchAllItems` every time one of these panels opens, showing a brief "Loading…" state and falling back to whatever was already held if the refetch itself fails; the To-Do List's own `loadTodos()` now runs `fetchAllItems` in parallel with its `shed_list_todos` fetch too, so the "View Notice" link and the Completed-disabling check (both of which read a linked notice's current `approved`/`reviewRequested` state) are never more than one open away from current. Verified via Playwright: simulating an external change between two opens of the same panel (an "approval" landing between them, as if another session had made it) shows up correctly on the second open without a page reload.

Five more direct requests, all addressed in the same pass:

1. **The To-Do List opens maximized.** `openTodoDesk` now checks whether it's about to open a genuinely new tab (versus just bringing an already-open one to the front) and, only in the fresh-open case, sets `stageEl._deskMaximized = true` before re-rendering the chrome — so the full list is readable immediately, without overriding a size the user might have deliberately restored to in the meantime.
2. **"(see Notice Board)" dropped from to-do text.** Now that a to-do links straight to its notice (see above), the pointer phrase is redundant. Removed from both `shed_notice_requires_approval_todo()` and `shed_notice_review_requested_todo()`, and stripped from the ten existing real to-do rows with a one-off idempotent `regexp_replace` update (safe to re-run; a row already without the suffix is simply left alone).
3. **A notice's row now shows its linked document's title.** Every requires-approval notice not tied to a standalone suggestion carries the same generic title, "Founder Approval Required" — fine once opened (the panel already shows the linked document as a subtitle inside), but indistinguishable from every other one in the closed Notice Board list, which is exactly what made "which one did I just approve?" a real problem. `buildItemRow` now appends the linked document's own title (via `findItemById`) when one exists, so a row reads e.g. "Founder Approval Required — AskPIP Founding Principles" without opening it.
4. **Status vs. decision, spelled out in both places.** The open notice panel's Status dropdown is the linked to-do's own shared workflow status — it was never meant to say anything about whether the notice itself has been approved, but the two are named similarly enough ("Status") that exactly this conflation produced the Completed-status bug above. A caption now sits directly under the Status label: *"This is the linked to-do task's status, not this notice's own approval decision (see Approved below)."* Separately, the Notice Board list row gains a second badge — `.item-row-decision`, reading **✓ Approved** (moss green), **⚑ Review Requested** (terracotta) or **Not Yet Approved** (neutral) — using the same colour language as the open panel's `.approval-meta` states, so a notice's real decision is visible without opening it, not just its to-do's workflow stage. Directly closes the gap in Karla's own suggestion about not being able to tell what she'd already approved.
5. **Custom black cursor.** The default light OS cursor was hard to see against the shed's art. `body` now carries `cursor: url(<black arrow SVG>) 2 1, auto` and every clickable element (`a, button, select, label, .hotspot, .btn, [onclick], [role="button"]`) carries `cursor: url(<black pointing-hand SVG>) 11 2, pointer`, each a small inline data-URI SVG (~300–400 bytes) with a thin white outline so it stays legible over both the light desk-window cards and the darker background art; a `:disabled` state gets the arrow with `not-allowed`. Placed last in the stylesheet with `!important`, so it wins regardless of any other `cursor` declaration elsewhere in the file without needing to audit each one individually. Custom cursor rendering (exact size, hotspot alignment) can vary a little by OS/browser — worth a glance on the actual device this was asked from.

Verified via Playwright throughout: the maximize check only fires on a genuinely fresh open; the notice row's title and decision badge render correctly and update after a refetch; the status caption text is present; both `body` and a representative clickable element resolve `cursor` to the new custom SVG data URI. See `CHANGELOG.md` and `Working/Project_Backlog.md` for the tracked record.

## The pointing-hand cursor, redrawn (2026-09-10)

Direct feedback on the cursor shipped above: "The hand is no longer a pointing hand but a rectangle and small protrusion. it almost looks like its giving the finger." Looking back at what actually shipped, the criticism was fair — the first hand was just two plain rectangles, each individually stroked white (a short finger rect stacked on a wider palm rect), with no attempt at a recognizable hand shape. It was written from the code alone and never actually rendered and looked at before going into `template.html`.

This time, before touching `template.html` at all: designed a six-shape hand (an angled thumb via `rotate(-18 ...)`, a palm base, three progressively-offset rounded rects standing in for folded second/third/fourth fingers, and a tall extended index finger), then wrapped the whole group in an SVG `<filter>` — `feMorphology` (`operator="dilate"`, `radius="1.1"`) against `SourceAlpha` to get a dilated silhouette, `feFlood` + `feComposite` (`operator="in"`) to turn that into a solid white shape clipped to the dilated outline, then `feMerge` to lay the white outline behind the original black shapes. This produces one continuous white halo around the *whole* hand, rather than the seam lines that stroking each of the six overlapping rectangles individually would leave where they meet. Built a small standalone preview (the hand on both the shed's light `#efe9dc` card background and its darker `#2b2118` art background) and rendered it with a headless-browser screenshot, actually looked at with the Read tool, before it went anywhere near production code — confirmed as a clean, legible, recognizable pointing hand on both backgrounds.

Only then was the old rule in `template.html` (the `a, button, select, ...` cursor declaration) edited: the new SVG's base64 replaced the old one, and the click hotspot moved from `11 2` to `9 2` to sit on the new fingertip (the old hand's fingertip was a plain vertical rect starting further right). The plain black-arrow cursor on `body` was untouched — only the hand was reported as a problem. Rebuilt, and the built `index.html`'s embedded cursor rule was decoded straight back out of the shipped file and re-diffed against the intended SVG source, byte for byte, as a final check before sending it to the device. See `CHANGELOG.md` for the tracked record.

## What's built so far

- Recycle Bin: soft-delete with restore + permanent purge, select-all UI
- File Cabinet folders
- Desk creation flow (Notepad → Pin to Notice Board / File in Cabinet)
- Full working Calendar: month-grid UI, add/edit/delete events, event
  chips on the month grid
- To-Do List: draggable/reorderable, 5-state status with full history,
  Active/Completed sections, and a hotspot badge showing how many tasks
  aren't yet ticked off
- Settings menu: change own passphrase, log out
- "Saved [date]" tracking on user-created notices/docs
- All 8 hotspots (Notice Board, To-Do List, Calendar, Bookshelf, File
  Cabinet, Info, Notepad, Recycle Bin), calibrated separately for desktop
  and mobile
- Named-passphrase identity + attribution (Shaphan/Karla)
- Automatic document sync from Core, covering the full documentation
  surface (Foundations, Knowledge Curation System, MVP, Standards,
  Working, AI, Graphics), with full nested subfolder structure preserved
- Nested File Cabinet mirroring Core's own folder structure, with a
  pending-notice count badge on any folder whose subtree has one
- Browser-tab-style desk windowing — one shared frame per stage, small
  and corner-anchored by default so hotspots (the Notice Board above
  all) stay reachable while it's open; a plain titlebar with one item
  open, a tab strip once two or more are open, each tab with its own
  close ✕ and a hover/touch tooltip showing its full title; a maximize
  toggle for the old larger reading size; every open item always
  reachable by its own tab, with no layering or hidden-behind-another-
  window state possible
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
  and a "Desktop" button — no inline preview, no edit-in-place; viewing
  and editing happen only in a desk window
- A requires-approval notice and the to-do task it spawns share one
  status (New/Received/In Progress/Blocked/Completed, via
  `shed_items.todo_id`) — changing it from either the notice's own Status
  control or the To-Do List updates the same row, and the Notice Board
  list shows each notice's current status as a small glance chip

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
