#!/usr/bin/env node
/**
 * Syncs Foundations/, "Knowledge Curation System/", and Standards/ (wholesale, every
 * .md file) from this repo into the Garden Shed's File Cabinet, so the shed's copies stay
 * current with the real Core documents instead of the old manually-seeded, point-in-time
 * ones.
 *
 * Runs as a GitHub Action on every push to main that touches those folders (see
 * .github/workflows/shed-doc-sync.yml). Writes directly to shed_items via the Supabase
 * REST API using the service-role key (bypasses RLS -- this is a trusted CI job, not a
 * "user" of the shed, so it does not go through the passphrase-gated RPCs).
 *
 * Each synced row is tagged source='synced' and location='cabinet', with `folder` set to
 * the top-level Core folder it came from (e.g. "Foundations") -- these are the same
 * folder names the shed's CABINET_FOLDERS list uses, so they show up as their own File
 * Cabinet folders automatically. `source_path` (the file's path relative to the repo
 * root) is the stable key used to upsert on repeat runs and to detect files that were
 * removed or renamed since the last sync.
 *
 * Required environment variables (set as GitHub Actions secrets, not committed):
 *   SUPABASE_URL              -- not actually secret, but kept as a secret/var either way
 *   SUPABASE_SERVICE_ROLE_KEY -- secret. Grants full read/write, bypassing RLS. Add this
 *                                 in the askpip/core repo's Settings -> Secrets and
 *                                 variables -> Actions. Never commit it, never hand it to
 *                                 an AI session.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

// Repo-root-relative folders to sync wholesale, and the File Cabinet folder each maps to.
// Keep this in sync with CABINET_FOLDERS in Shed/source/template.html.
const SYNC_FOLDERS = [
  { repoPath: "Foundations", cabinetFolder: "Foundations" },
  { repoPath: "Knowledge Curation System", cabinetFolder: "Knowledge Curation System" },
  { repoPath: "Standards", cabinetFolder: "Standards" },
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

function titleFromMarkdown(text, fallbackName) {
  const headingMatch = text.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();
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
  // 1. Gather the current set of files to sync.
  const currentFiles = [];
  for (const { repoPath, cabinetFolder } of SYNC_FOLDERS) {
    const absDir = join(REPO_ROOT, repoPath);
    const files = await walkMarkdownFiles(absDir);
    for (const absPath of files) {
      const sourcePath = relative(REPO_ROOT, absPath).split("\\").join("/");
      const content = await readFile(absPath, "utf8");
      currentFiles.push({
        sourcePath,
        cabinetFolder,
        title: titleFromMarkdown(content, absPath.split(/[\\/]/).pop()),
        body: content,
      });
    }
  }
  console.log(`Found ${currentFiles.length} markdown files across ${SYNC_FOLDERS.length} synced folders.`);

  // 2. Upsert each one (on_conflict=source_path -- see the shed_items_source_path_uq
  //    partial unique index).
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
          folder: f.cabinetFolder,
          source_path: f.sourcePath,
          updated_at: new Date().toISOString(),
        },
      ]),
    });
  }
  console.log(`Upserted ${currentFiles.length} synced documents.`);

  // 3. Remove synced rows whose source file no longer exists (deleted/renamed in Core).
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
