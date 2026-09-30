#!/usr/bin/env python3
"""
KIT's Live Intelligence Library (LIL) build tool.

Usage (from the repository root):

    python3 "Knowledge Curation System/Live Intelligence Library/tools/build_lil.py" build
        Validates every record in records/, then writes:
          - lil_bundle.json              (committed: every record, read by the database's
                                          lil_publish_from_git(<commit SHA>) function)
          - lil_manifest.json            (committed: what the LIL should contain)
          - App/src/data/lil-snapshot.json (committed: the app's offline copy)
          - build/publish.sql            (not committed: fallback if the database can't reach GitHub)
          - build/verify.sql             (not committed: run it after publishing)
        Exits non-zero, publishing nothing, if any record fails validation.

    python3 ".../build_lil.py" verify <verify-result.json>
        Compares the rows returned by build/verify.sql (saved as a JSON array)
        with lil_manifest.json. Prints every mismatch; exits non-zero if any.

Standard library only, so any AI session or person can run it.
See AI/Skills/KIT_LIL_Publication_Skill.md for the full procedure.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

LIL = Path(__file__).resolve().parents[1]
REPO = LIL.parents[1]
RECORDS = LIL / "records"
BUILD = LIL / "build"
MANIFEST = LIL / "lil_manifest.json"
BUNDLE = LIL / "lil_bundle.json"
SNAPSHOT = REPO / "App" / "src" / "data" / "lil-snapshot.json"

TYPE_BY_CODE = {
    "OBS": "observation", "DEC": "decision_logic", "SGT": "suitability_gate", "SRC": "source",
    "DEF": "definition", "CGD": "care_guidance", "CMP": "comparison_image",
}
STATUSES = {"Published", "Suspended", "Retired"}
CONFIDENCE = {"Very High", "High", "Moderate", "Low", "Very Low", "Approved default"}
ID_RE = re.compile(r"^PKR-([A-Z]{3})-(\d{6})$")
VER_RE = re.compile(r"^\d+\.\d+$")


# --- Postgres jsonb text form, so hashes can be compared inside the database ---
def _pg_str(s):
    out = ['"']
    for ch in s:
        o = ord(ch)
        if ch == '"': out.append('\\"')
        elif ch == "\\": out.append("\\\\")
        elif ch == "\n": out.append("\\n")
        elif ch == "\r": out.append("\\r")
        elif ch == "\t": out.append("\\t")
        elif ch == "\b": out.append("\\b")
        elif ch == "\f": out.append("\\f")
        elif o < 0x20: out.append("\\u%04x" % o)
        else: out.append(ch)
    out.append('"')
    return "".join(out)


def pg_jsonb_text(v):
    """Reproduces PostgreSQL's jsonb::text output (keys ordered by byte length, then bytes)."""
    if v is None: return "null"
    if v is True: return "true"
    if v is False: return "false"
    if isinstance(v, (int, float)): return json.dumps(v)
    if isinstance(v, str): return _pg_str(v)
    if isinstance(v, list): return "[" + ", ".join(pg_jsonb_text(x) for x in v) + "]"
    if isinstance(v, dict):
        keys = sorted(v.keys(), key=lambda k: (len(k.encode()), k.encode()))
        return "{" + ", ".join(_pg_str(k) + ": " + pg_jsonb_text(v[k]) for k in keys) + "}"
    raise TypeError(type(v))


def record_hash(r):
    """Same value as build/verify.sql computes in the database."""
    text = pg_jsonb_text(r["common"]) + "|" + pg_jsonb_text(r["content"])
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def drop_nulls(v):
    """jsonb keeps nulls, but undefined values from JS exports should not appear at all."""
    if isinstance(v, dict): return {k: drop_nulls(x) for k, x in v.items()}
    if isinstance(v, list): return [drop_nulls(x) for x in v]
    return v


# --- Validation ---
def iter_confidences(v, path=""):
    if isinstance(v, dict):
        for k, x in v.items():
            if k == "confidence" and isinstance(x, str): yield path + "." + k, x
            else: yield from iter_confidences(x, path + "." + k)
    elif isinstance(v, list):
        for i, x in enumerate(v): yield from iter_confidences(x, f"{path}[{i}]")


def load_records():
    recs, errors = [], []
    for f in sorted(RECORDS.glob("PKR-*/v*.json")):
        try:
            r = json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            errors.append(f"{f}: not valid JSON ({e})"); continue
        r["_file"] = str(f.relative_to(REPO))
        recs.append(r)
    return recs, errors


def validate(recs):
    errors = []
    by_id = {}
    for r in recs:
        where = r["_file"]
        for k in ("schema", "pkr_id", "version", "pkr_type", "status", "title", "common", "content", "provenance"):
            if k not in r: errors.append(f"{where}: missing '{k}'")
        if errors and errors[-1].startswith(where): continue
        if r["schema"] != "pip-lil-record/1": errors.append(f"{where}: unknown schema {r['schema']}")
        m = ID_RE.match(r["pkr_id"])
        if not m: errors.append(f"{where}: bad PKR ID {r['pkr_id']}"); continue
        if TYPE_BY_CODE.get(m.group(1)) != r["pkr_type"]:
            errors.append(f"{where}: type '{r['pkr_type']}' does not match ID code {m.group(1)}")
        if not VER_RE.match(r["version"]): errors.append(f"{where}: bad version {r['version']}")
        if Path(r["_file"]).name != f"v{r['version']}.json": errors.append(f"{where}: file name must be v{r['version']}.json")
        if Path(r["_file"]).parent.name != r["pkr_id"]: errors.append(f"{where}: folder must be {r['pkr_id']}")
        if r["status"] not in STATUSES: errors.append(f"{where}: status must be one of {sorted(STATUSES)} (Drafts never enter the LIL)")
        if not r["title"]: errors.append(f"{where}: empty title")
        c = r["common"]
        for k in ("applies_to", "supporting_sources", "founder_approval_date", "related_pkrs", "evidence_confidence"):
            if k not in c: errors.append(f"{where}: common.{k} missing")
        if r["status"] == "Published" and not c.get("founder_approval_date"):
            errors.append(f"{where}: a Published record needs common.founder_approval_date")
        for p, lvl in iter_confidences(r["content"]):
            if lvl not in CONFIDENCE: errors.append(f"{where}: {p} has unknown confidence '{lvl}'")
        # PKR Standard §5.1: Not Sure never reaches Cut.
        if r["pkr_type"] == "decision_logic":
            for ch in r["content"].get("not_sure_choices") or []:
                if ch.get("choice") == "cut": errors.append(f"{where}: not_sure_choices must never include 'cut' (PKR Standard §5.1)")
        by_id.setdefault(r["pkr_id"], []).append(r)
    published = {}
    for pid, lst in by_id.items():
        pub = [r for r in lst if r["status"] == "Published"]
        if len(pub) > 1: errors.append(f"{pid}: more than one Published version ({[r['version'] for r in pub]})")
        if pub: published[pid] = pub[0]
    for r in recs:
        if r["status"] != "Published": continue
        for s in r["common"].get("supporting_sources", []):
            if s not in published: errors.append(f"{r['_file']}: supporting source {s} is not a Published record")
        for rel in r["common"].get("related_pkrs", []):
            if rel.get("pkr_id") not in by_id: errors.append(f"{r['_file']}: related PKR {rel.get('pkr_id')} does not exist")
    return errors, published


def sql_literal_json(v):
    text = json.dumps(v, ensure_ascii=False)
    tag = "$lil$"
    assert tag not in text
    return f"{tag}{text}{tag}::jsonb"


def sql_text(s):
    return "NULL" if s is None else "'" + str(s).replace("'", "''") + "'"


def build():
    recs, errors = load_records()
    recs = [drop_nulls(r) for r in recs]
    v_errors, published = validate(recs)
    errors += v_errors
    if errors:
        print("LIL BUILD FAILED — nothing written:")
        for e in errors: print("  -", e)
        sys.exit(1)

    rows = []
    for r in sorted(recs, key=lambda x: (x["pkr_id"], [int(p) for p in x["version"].split(".")])):
        rows.append({"pkr_id": r["pkr_id"], "version": r["version"], "pkr_type": r["pkr_type"], "status": r["status"],
                     "title": r["title"], "sha256": record_hash(r)})
    MANIFEST.write_text(json.dumps({"schema": "pip-lil-manifest/1", "record_count": len(rows),
                                    "published_count": len(published), "records": rows}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    bundle = [{k: r[k] for k in ("pkr_id", "version", "pkr_type", "status", "title", "common", "content", "provenance")}
              for r in sorted(recs, key=lambda x: (x["pkr_id"], [int(p) for p in x["version"].split(".")]))]
    BUNDLE.write_text(json.dumps({"schema": "pip-lil-bundle/1", "records": bundle}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    snap = [{k: r[k] for k in ("pkr_id", "version", "pkr_type", "title", "common", "content")}
            for r in sorted(published.values(), key=lambda x: x["pkr_id"])]
    SNAPSHOT.write_text(json.dumps({"schema": "pip-lil-snapshot/1", "records": snap}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    BUILD.mkdir(exist_ok=True)
    lines = ["-- Generated by build_lil.py. Run as one transaction against the LIL database.",
             "-- Published versions are immutable: an existing (pkr_id, version) is never overwritten.",
             "begin;"]
    for r in recs:
        if r["status"] != "Published":
            lines.append(f"update public.lil_pkr set status = {sql_text(r['status'])} where pkr_id = {sql_text(r['pkr_id'])} and version = {sql_text(r['version'])};")
    for pid, r in sorted(published.items()):
        lines.append(f"update public.lil_pkr set status = 'Retired' where pkr_id = {sql_text(pid)} and status = 'Published' and version <> {sql_text(r['version'])};")
    for r in recs:
        prov = r["provenance"]
        lines.append(
            "insert into public.lil_pkr (pkr_id, version, pkr_type, status, title, common, content, provenance, source_commit, published_by) values ("
            f"{sql_text(r['pkr_id'])}, {sql_text(r['version'])}, {sql_text(r['pkr_type'])}, {sql_text(r['status'])}, {sql_text(r['title'])}, "
            f"{sql_literal_json(r['common'])}, {sql_literal_json(r['content'])}, {sql_literal_json(prov)}, 'manual-sql', {sql_text(prov.get('published_to_lil_by', 'KIT'))}) "
            "on conflict (pkr_id, version) do nothing;")
    lines.append("commit;")
    (BUILD / "publish.sql").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (BUILD / "verify.sql").write_text(
        "-- Run after publish.sql; save the result rows as a JSON array and pass it to: build_lil.py verify <file>\n"
        "select pkr_id, version, pkr_type, status, title,\n"
        "       encode(sha256(convert_to(common::text || '|' || content::text, 'UTF8')), 'hex') as sha256\n"
        "from public.lil_pkr order by pkr_id, version;\n", encoding="utf-8")
    print(f"LIL build OK: {len(rows)} records ({len(published)} Published).")
    print(f"  bundle:   {BUNDLE.relative_to(REPO)} ({BUNDLE.stat().st_size} bytes)")
    print(f"  manifest: {MANIFEST.relative_to(REPO)}")
    print(f"  snapshot: {SNAPSHOT.relative_to(REPO)}")
    print(f"  SQL:      {(BUILD / 'publish.sql').relative_to(REPO)} ({(BUILD / 'publish.sql').stat().st_size} bytes), then {(BUILD / 'verify.sql').relative_to(REPO)}")


def verify(path):
    manifest = {(r["pkr_id"], r["version"]): r for r in json.loads(MANIFEST.read_text(encoding="utf-8"))["records"]}
    rows = json.loads(Path(path).read_text(encoding="utf-8"))
    if isinstance(rows, dict) and "result" in rows: rows = rows["result"]
    db = {(r["pkr_id"], r["version"]): r for r in rows}
    problems = []
    for key, m in manifest.items():
        d = db.get(key)
        if not d: problems.append(f"{key}: in manifest, missing from database"); continue
        for f in ("pkr_type", "status", "title", "sha256"):
            if d[f] != m[f]: problems.append(f"{key}: {f} differs (database {d[f]!r} vs repository {m[f]!r})")
    for key in db:
        if key not in manifest: problems.append(f"{key}: in database, not in repository manifest")
    if problems:
        print(f"LIL VERIFY FAILED: {len(problems)} problem(s)")
        for p in problems: print("  -", p)
        sys.exit(1)
    print(f"LIL verify OK: database matches the repository manifest exactly ({len(manifest)} records).")


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "build": build()
    elif len(sys.argv) == 3 and sys.argv[1] == "verify": verify(sys.argv[2])
    else:
        print(__doc__); sys.exit(2)
