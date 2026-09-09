# The Garden Shed Office — Overview & Deployment Notes

> **⚠ Superseded — historical record only (9 September 2026).** This note predates the Shed's migration into Core as `Shed/` (8 September 2026) and is now stale on several specific points: it describes the Shed as living in a separate `askpip/KCS-PIP-Garden-Shed` repository deployed from a local `shed-deploy` checkout (both retired by that migration); it says the build source (`build_live.py`, `data_uris.json`) exists only in an AI working session and "not in this repository" (now fully recovered and committed under `Shed/source/` and `Shed/art/`); and it describes a single shared passphrase (superseded by two named passphrases with per-item attribution). It also predates the to-do list, automatic document sync from Core, and the settings menu added in that same migration. **`Shed/README.md` is the current source of truth** for what the Shed is and how it's built and deployed. This note is kept for historical record of the tool's original build history, not as current documentation — a fact `Shed/README.md` already points back to under its "What's next" section.

## Document Metadata

**Document Title:** The Garden Shed Office — Overview & Deployment Notes
**Document Type:** Draft Reference Note (not a controlled Standard or Charter)
**Status:** Draft — for Founder Review
**Prepared By:** Claude, at Shaphan's request
**Date:** 7 September 2026
**Version:** 0.1
**Purpose:** To record what the "KCS Pip Shed" (Garden Shed Office) is, why it exists, how it is built and deployed, and how it relates to Core — so Core stays the single place that describes everything in the AskPIP ecosystem, even the pieces built and iterated entirely outside this repository.
**Source Material Reviewed:** N/A — this note is itself the primary record of the tool's build history; written from the working session(s) that built it.
**Note:** This tool sits outside the Knowledge Curation System's governed Charter/Standard process — it is an internal operational tool, not KCS knowledge. It is documented here purely so Core remains a complete map of what exists. A Founder should decide its permanent home in the repository (see "Suggested Next Steps" below) and add a CHANGELOG entry if it is adopted as-is.

---

## 1. What It Is

The Garden Shed Office is a small, self-contained, passphrase-gated internal web app — a "digital office" for the Founder and team, styled as a cosy garden shed. It is not gardener-facing and has no connection to the Ask Pip product experience; it exists purely for internal notices, reference documents, a shared calendar, and quick day-to-day team coordination.

It presents as a single illustrated scene (a desktop wide-shot and a separate mobile portrait crop of the same shed interior) with clickable hotspots:

- **Notice Board** — short-lived notices anyone can pin from the desk.
- **Calendar** — a shared month-view calendar; click a day to add, edit or delete an event.
- **Bookshelf** — foundational reading (mirrors select Core documents — see §4).
- **File Cabinet** — longer-lived reference documents, organised into folders.
- **Info** — built-in help docs explaining how to use the shed itself.
- **Notepad** (the open notebook on the desk) — where new notices/documents are created, then filed to either the Notice Board or the File Cabinet.
- **Recycle Bin** — soft-delete holding area; anything deleted from the Notice Board or File Cabinet lands here first and can be restored or purged permanently.

Everything a Founder or team member adds, edits or deletes writes straight to the backend and is visible to everyone else immediately — there's no publish step and no per-user accounts. Access is controlled by a single shared passphrase (currently `gardenshed2026`), asked for fresh on every visit and never stored in the browser.

---

## 2. Why It's Separate From the Main App

The shed is deliberately decoupled from `App/` — its own small Vercel project, its own GitHub repository, no shared build pipeline, no shared audience. The reasoning, at the time it was set up: it needed to exist and be iterable quickly for internal use, without needing to touch (or risk) the gardener-facing product's codebase, deploy pipeline, or release cadence. It follows the same hosting pattern as the main app (Vercel, auto-deploy on push to `main`) but as a fully independent project.

---

## 3. How It's Built

The entire shed is **one self-contained HTML file** — all CSS and JavaScript inline, all artwork embedded as base64 data URIs. There is no framework, no `npm install`, no build step on the hosting side; Vercel just serves the file as static output.

That file is generated, not hand-written directly: a Python build script (`build_live.py`) assembles it from an HTML/CSS/JS template plus a `data_uris.json` file holding the base64-encoded artwork (scene backgrounds, panel backgrounds, lock-screen art, favicon). Both currently live only in the AI working session that has been building the shed — **not in this repository** — since the shed's source has never been committed anywhere except the built output. This is worth a Founder decision (see §6).

The interior artwork was produced with OpenArt (Seedream 4.5 for full regenerations, Edit Image mode for precise "change one thing, keep everything else identical" edits), then composited and cropped for both a wide desktop layout and a taller mobile portrait crop, with every clickable hotspot's position hand-calibrated against the final art.

---

## 4. Data & Backend

The shed's dynamic content (notices, filed documents, calendar events, and the shared passphrase check) is stored in **the same Supabase project the main App uses** (`lapscltduzkbldfwcemq`), but in its own cleanly separated tables — `shed_items`, `shed_events` and `shed_config` — with no overlap with the app's own tables (`bush_rose_profiles`, `observations`, `follow_ups`, `plant_photo_log`, `pkr`). Worth knowing: this means the shed shares the App's Supabase project (and therefore its usage quota and project-level settings), even though the data itself is fully isolated.

Access uses its own model, unrelated to the App's user auth: every table has row-level security enabled with **no policies**, so nothing is reachable directly. All reads and writes go through `SECURITY DEFINER` Postgres functions (`shed_list_items`, `shed_add_item`, `shed_update_item`, `shed_delete_item`, `shed_restore_item`, `shed_purge_items`, and the calendar equivalents `shed_list_events`/`shed_add_event`/`shed_update_event`/`shed_delete_event`), each gated by a `shed_check_passphrase(p)` check against a bcrypt-style hash stored in `shed_config`. This is a deliberately lightweight model — a shared passphrase, not per-user identity — appropriate for a small internal tool, not the pattern the gardener-facing app should follow.

Some content on the Bookshelf and in the File Cabinet is seeded from, and mirrors, real Core documents (the PIP AI Constitution, Loading Guide and Operations Manual; the KIT and ROC Charters and Operations Manuals; the AskPIP Vision Statement; Marie's Story; the PIP System Terminology Context) so the team has an easy in-context way to read them. **The shed is a read/reference copy, not a synced one** — if a source document changes in Core, the shed's copy does not update automatically; someone would need to re-seed it.

---

## 5. Where It Lives & How to Deploy Changes

- **Live URL:** `https://shed.askpip.garden`
- **GitHub repository:** `askpip/KCS-PIP-Garden-Shed` (private)
- **Hosting:** Vercel, auto-deploying on every push to `main` — no build command, serves `index.html` directly
- **Local deploy folder (Shaphan's machine):** `C:\AskPIP\shed-deploy` — a separate git checkout containing only `index.html` and a `DEPLOY_GUIDE.md`, not part of the `core` repo

A new deploy is only needed when the *page itself* changes (new layout, new hotspots, new artwork) — adding or editing a notice, calendar event, or document happens straight through Supabase and needs no deploy. When a page change is needed: rebuild `index.html` from the AI working session, drop it into `C:\AskPIP\shed-deploy`, then:

```bash
git add index.html
git commit -m "..."
git push
```

---

## 6. Suggested Next Steps (for Shaphan)

This note is a draft, written to capture the shed's history and current shape before it's lost to session context. A few open questions worth a Founder decision, not resolved by this note:

1. **Where should this note live permanently?** As a new "Tools" or "Internal Systems" folder at the top level, folded into `Working/`, or somewhere else — Core's existing structure doesn't have an obvious home for an internal tool that isn't KCS knowledge, app source, or Founder documentation in the MIL sense.
2. **Should the shed's actual source (`build_live.py` + `data_uris.json` + the HTML/CSS/JS template) be committed somewhere** — either in `KCS-PIP-Garden-Shed` itself or referenced from Core — so it isn't only reproducible from AI session history? Right now, if that working session were lost, the only recoverable artifact is the built `index.html` itself.
3. **Should `README.md`'s "Repository Contents" list or `CHANGELOG.md` mention the shed's existence**, given Core is meant to be the authoritative map of the AskPIP ecosystem?
4. **The shared passphrase** (`gardenshed2026`) is still the original default — worth rotating once the team using the shed is settled, which can be done directly in Supabase with no redeploy required.

---

## End of Document
