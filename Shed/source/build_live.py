#!/usr/bin/env python3
"""
Build script for The Garden Shed Office (KCS Pip Shed).

Assembles the final, self-contained index.html by reading template.html
(the full page markup/CSS/JS with asset placeholders) and substituting each
placeholder with the base64-encoded contents of the matching file in ../art/,
per art/manifest.json.

Usage:
    cd source && python3 build_live.py
Output:
    ../garden-shed-office-live.html (in the repo root alongside source/ and art/)

This script, template.html, and the files under art/ were reconstructed on
2026-09-08 by decomposing the then-currently-deployed index.html (which is
self-contained and therefore contained everything needed to reverse this
split) after the original editable source was lost to a sandbox reset. See
core/Working/AI Outputs/Garden_Shed_Office_Overview.md for the full history.
"""
import base64
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ART_DIR = os.path.join(HERE, "..", "art")
TEMPLATE_PATH = os.path.join(HERE, "template.html")
MANIFEST_PATH = os.path.join(ART_DIR, "manifest.json")
OUTPUT_PATH = os.path.join(HERE, "..", "index.html")


def main():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    for name, info in manifest.items():
        placeholder = "__ASSET_" + name.upper().replace("-", "_") + "__"
        art_path = os.path.join(ART_DIR, info["file"])
        with open(art_path, "rb") as img:
            b64 = base64.b64encode(img.read()).decode("ascii")
        data_uri = f"data:{info['mime']};base64,{b64}"
        if placeholder not in html:
            raise SystemExit(f"Placeholder {placeholder} not found in template.html")
        html = html.replace(placeholder, data_uri)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Wrote {OUTPUT_PATH} ({len(html):,} chars)")


if __name__ == "__main__":
    main()
