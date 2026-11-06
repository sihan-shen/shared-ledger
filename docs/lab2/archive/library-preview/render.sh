#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/opt/google/chrome/chrome}"
PROFILE="${PROFILE:-/tmp/dsh-chrome-profile}"
mkdir -p "$PROFILE"
render() {
  local file="$1" w="$2" h="$3" scale="$4" out="$5"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --no-first-run \
    --user-data-dir="$PROFILE" --hide-scrollbars \
    --force-device-scale-factor="$scale" --window-size="$w,$h" \
    --screenshot="$DIR/$out" "file://$DIR/$file" 2>&1 | tail -1
}
render material3-mobile.html 390 844 2 material3-mobile.png
render sds-mobile.html 390 844 2 sds-mobile.png
render material3-admin.html 1440 900 1.5 material3-admin.png
render sds-admin.html 1440 900 1.5 sds-admin.png
echo "done: $DIR"
