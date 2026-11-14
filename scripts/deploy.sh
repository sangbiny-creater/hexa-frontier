#!/usr/bin/env bash
# 빌드해서 gh-pages 브랜치로 올린다 (GitHub Pages). 실행: npm run deploy
set -euo pipefail
cd "$(dirname "$0")/.."
npm test
npm run build
touch dist/.nojekyll
REMOTE=$(git remote get-url origin)
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
cd "$TMP"
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "deploy $(date '+%Y-%m-%d %H:%M')"
git -c http.postBuffer=524288000 push -q -f "$REMOTE" gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "배포 완료: https://sangbiny-creater.github.io/hexa-frontier/"
