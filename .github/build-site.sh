#!/usr/bin/env bash
# Assemble le dossier publié sur oasisforest.be : uniquement les fichiers du site.
# Tout ce qui n'est pas listé ici (CLAUDE.md, SPEC-cms.md, README.md, AGENTS.md, .claude/,
# docs-internes/, .github/, notes du CMS…) reste dans le dépôt mais n'est PAS publié.
# Un nouveau fichier ou dossier public doit être ajouté à cette liste.
set -euo pipefail
OUT="${1:-_site}"
rm -rf "$OUT" && mkdir -p "$OUT"
cp ./*.html CNAME robots.txt sitemap.xml .nojekyll "$OUT"/
cp favicon.svg favicon-16x16.png favicon-32x32.png apple-touch-icon.png "logo uof.svg" logo-uof-blanc.png "$OUT"/
cp -R assets data img "$OUT"/
mkdir -p "$OUT/admin"
cp admin/index.html admin/config.yml "$OUT/admin"/
