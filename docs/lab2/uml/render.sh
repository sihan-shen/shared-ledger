#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE="$(cd "$DIR/../../.." && pwd)"
PLANTUML_CACHE="${PLANTUML_CACHE:-$WORKSPACE/.cache/plantuml}"
JAVA="${JAVA:-$PLANTUML_CACHE/root/usr/lib/jvm/java-27-openjdk/bin/java}"
JAR="${PLANTUML_JAR:-$PLANTUML_CACHE/root/usr/share/java/plantuml/plantuml.jar}"

if [ ! -x "$JAVA" ] && ! command -v "$JAVA" >/dev/null 2>&1; then
  echo "找不到 Java：$JAVA" >&2
  echo "请安装 jre-openjdk-headless，或设置 JAVA=java" >&2
  exit 1
fi
if [ ! -f "$JAR" ]; then
  echo "找不到 PlantUML jar：$JAR" >&2
  echo "请安装 plantuml，或设置 PLANTUML_JAR=/path/to/plantuml.jar" >&2
  exit 1
fi

cd "$DIR"
for f in *.puml; do
  echo "== $f"
  "$JAVA" -Djava.awt.headless=true -jar "$JAR" -charset UTF-8 -tpng "$f"
done
echo "done: $DIR"
