#!/usr/bin/env node
/**
 * Syncs the whole documentation surface of this repo -- Foundations/, "Knowledge Curation
 * System/", MVP/, Standards/, Working/, AI/, and Graphics/ (wholesale, every .md file,
 * recursively) -- into the Garden Shed's File Cabinet, so the shed's copies stay current
 * with the real Core documents instead of the old manually-seeded, point-in-time ones.
 *
 * As of 9 September 2026 the sync preserves each file's full subfolder path (not just its
 * top-level folder), so the shed's File Cabinet can present the same nested structure Core
 * itself has -- "Knowledge Curation System/Mother Information Library/ARCs" is its own
 * folder in the cabinet, not flattened into "Knowledge Curation System". Binary files
 * (images etc.) are deliberately not synced yet -- documents first, per the Founder's
 * explicit phasing decision; App/ (application source code), Spike/, and repo/tooling
 * folders (.git, node_modules) are deliberately excluded, since they aren't documents
 * anyone reviews or approves.
 *
 * Runs as a GitHub Action on every push to main that touches those folders (see
 * .github/workflows/shed-doc-sync.yml). Writes directly to shed_items via the Supabase
 * REST API using the service-role key (bypasses RLS -- this is a trusted CI job, not a
 * "user" of the shed, so it does not go through the passphrase-gated RPCs).
 *
 * Each synced row is tagged source='synced' and location='cabinet', with `folder` set to
 * the file's full directory path relative to the repo root (e.g. "MVP/Architecture", or
 * just "Standards" for a file directly inside that folder) -- the shed's cabinet browser
 * (source/template.html) builds its nested folder tree straight from these paths, splitting
 * on "/", rather than needing a separate top-level-folder field. `source_path` (the file's
 * full path, including filename, relative to the repo root) is the stable key used to
 * upsert on repeat runs and to detect files that were removed or renamed since the last
 * sync.
 *
 * Required environment variables (set as GitHub Actions secrets, not committed):
 *   SUPABASE_URL              -- not actually secret, but kept as a secret/var either way
 *   SUPABASE_SERVICE_ROLE_KEY -- secret. Grants full read/write, bypassing RLS. Add this
 *                                 in the askpip/core repo's Settings -> Secrets and
 *                                 variables -> Actions. Never commit it, never hand it to
 *                                 an AI session.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

// Repo-root-relative folders to sync wholesale, recursively, every .md file. Keep this in
// sync with the "documents first" scope the Founder chose 9 September 2026: every real
// documentation folder in Core, excluding App/ (application source code) and Spike/ (AI
// experiment scripts) -- neither is something anyone reviews or approves in the shed.
const SYNC_FOLDERS = [
  "Foundations",
  "Knowledge Curation System",
  "MVP",
  "Standards",
  "Working",
  "AI",
  "Graphics",
];

const REPO_ROOT = process.cwd();

async function walkMarkdownFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

// A handful of document templates in this repo reuse the exact same first heading across
// every instance of that document type, so "the first # heading" isn't always a real title:
// the Founder Review Dossier Standard (FRDS §5.3) requires a dossier's ORIGINAL first heading
// to be preserved verbatim even once it's approved, and the older FRD template always used
// this literal status banner as that heading, with the document's actual subject living only
// in its metadata table instead; every "Approved Research Compilation" (ARC) opens with this
// same fixed template title for the same reason. When the first heading is one of these known
// generic ones, fall back to the metadata table's own title field before giving up and using
// the filename. (Caught 9 September 2026, reported directly: three Founder Review Dossiers and
// all three ARCs were showing this boilerplate text as their title in the shed's File Cabinet
// instead of their real subject.)
const GENERIC_HEADINGS = new Set([
  "DRAFT — NOT APPROVED — FOR FOUNDER REVIEW ONLY",
  "PIP Mother Information Library — Approved Research Compilation",
]);
const METADATA_TITLE_FIELDS = ["Document Title", "ARC Title"];

function titleFromMarkdown(text, fallbackName) {
  const headingMatch = text.match(/^#\s+(.+)$/m);
  let heading = headingMatch ? headingMatch[1].trim() : null;

  if (heading && GENERIC_HEADINGS.has(heading)) {
    for (const field of METADATA_TITLE_FIELDS) {
      const tableMatch = text.match(
        new RegExp(`^\\|\\s*${field}\\s*\\|\\s*(.+?)\\s*\\|\\s*$`, "m")
      );
      if (tableMatch) return tableMatch[1].replace(/\*\*/g, "").trim();
    }
    heading = null;
  }

  if (heading) return heading;
  return fallbackName.replace(/\.md$/i, "").replace(/[-_]+/g, " ").trim();
}

async function supabaseRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase ${options.method || "GET"} ${path} -> ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  // 1. Gather the current set of files to sync, across every configured folder.
  const currentFiles = [];
  for (const repoPath of SYNC_FOLDERS) {
    const absDir = join(REPO_ROOT, repoPath);
    const files = await walkMarkdownFiles(absDir);
    for (const absPath of files) {
      const sourcePath = relative(REPO_ROOT, absPath).split("\\").join("/");
      const folderPath = relative(REPO_ROOT, dirname(absPath)).split("\\").join("/");
      const content = await readFile(absPath, "utf8");
      currentFiles.push({
        sourcePath,
        folderPath,
        title: titleFromMarkdown(content, absPath.split(/[\\/]/).pop()),
        body: content,
      });
    }
  }
  console.log(`Found ${currentFiles.length} markdown files across ${SYNC_FOLDERS.length} synced folders.`);

  // 2. Upsert each one (on_conflict=source_path -- see the shed_items_source_path_uq
  //    unique constraint).
  for (const f of currentFiles) {
    await supabaseRequest("shed_items?on_conflict=source_path", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify([
        {
          location: "cabinet",
          source: "synced",
          title: f.title,
          body: f.body,
          folder: f.folderPath,
          source_path: f.sourcePath,
          updated_at: new Date().toISOString(),
        },
      ]),
    });
  }
  console.log(`Upserted ${currentFiles.length} synced documents.`);

  // 3. Remove synced rows whose source file no longer exists (deleted/renamed/moved in
  //    Core). A moved file gets a new source_path, so its old row is stale here and its
  //    new path is a fresh insert above -- this correctly re-files it under its new folder
  //    rather than leaving a duplicate in the old one.
  const existing = await supabaseRequest(
    "shed_items?source=eq.synced&select=id,source_path"
  );
  const currentPaths = new Set(currentFiles.map((f) => f.sourcePath));
  const stale = (existing || []).filter((row) => !currentPaths.has(row.source_path));
  for (const row of stale) {
    await supabaseRequest(`shed_items?id=eq.${row.id}`, { method: "DELETE" });
  }
  if (stale.length) {
    console.log(`Removed ${stale.length} synced documents no longer present in Core.`);
  }

  console.log("Shed doc sync complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
