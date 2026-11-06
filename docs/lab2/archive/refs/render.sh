#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/opt/google/chrome/chrome}"
PROFILE="${PROFILE:-/tmp/dsh-chrome-profile}"
mkdir -p "$PROFILE"

render() {
  local file="$1" width="$2" height="$3" scale="$4" out="$5" query="${6:-}"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --no-first-run \
    --user-data-dir="$PROFILE" --hide-scrollbars \
    --force-device-scale-factor="$scale" --window-size="$width,$height" \
    --screenshot="$DIR/$out" "file://$DIR/$file$query" 2>&1 | tail -1
}

render mobile-login.html 390 844 2 mobile-login.png
render mobile-ledgers.html 390 844 2 mobile-ledgers.png
render mobile-home.html 390 844 2 mobile-home.png
render mobile-entry.html 390 844 2 mobile-entry.png
render mobile-income.html 390 844 2 mobile-income.png
render mobile-transactions.html 390 844 2 mobile-transactions.png
render mobile-settlement.html 390 844 2 mobile-settlement.png
render mobile-review.html 390 844 2 mobile-review.png
render mobile-review.html 360 844 2 mobile-review-360.png
render mobile-review.html 768 900 1.5 mobile-review-768.png

render admin-review.html 1440 900 1.5 admin-review.png
render admin-screens.html 1440 900 1.5 admin-members.png '?screen=members'
render admin-screens.html 1440 900 1.5 admin-correction.png '?screen=correction'
render admin-screens.html 1440 900 1.5 admin-budget.png '?screen=budget'
render admin-screens.html 1440 900 1.5 admin-logs.png '?screen=logs'
render admin-screens.html 1440 900 1.5 admin-settings.png '?screen=settings'
render admin-screens.html 1440 900 1.5 admin-maintainer.png '?screen=maintainer'

dot -Tpng -Gdpi=150 "$DIR/architecture.dot" -o "$DIR/architecture.png"
echo "done: $DIR"
