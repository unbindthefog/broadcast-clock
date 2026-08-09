#!/usr/bin/env bash
# Bundles index.html + style.css + clock.js into a single self-contained
# embed.html (inline <style>/<script>, no external requests) suitable for
# <iframe srcdoc="..."> embedding in other projects.
#
# embed.html is a generated build artifact (see .gitignore) — it is not
# committed here. Run this script fresh whenever you need an up-to-date
# copy to hand off to another project.
set -euo pipefail
cd "$(dirname "$0")"

python3 - <<'PY'
import re

with open("index.html", encoding="utf-8") as f:
    html = f.read()
with open("style.css", encoding="utf-8") as f:
    css = f.read()
with open("clock.js", encoding="utf-8") as f:
    js = f.read()

html = html.replace(
    '<link rel="stylesheet" href="style.css">',
    f"<style>\n{css}\n</style>",
)
html = html.replace(
    '<script src="clock.js"></script>',
    f"<script>\n{js}\n</script>",
)

with open("embed.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Wrote embed.html")
PY
