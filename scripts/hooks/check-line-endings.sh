#!/bin/bash
# Normalise text files to LF line endings.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

fixed=0
for file in "$@"; do
  # Only proces text files (skip binaries)
  if [ -f "$file" ] && file "$file" | grep -q "text" 2>/dev/null; then
    # Strip CR characters
    if grep -q $'\r' "$file" 2>/dev/null; then
      sed -i '' 's/\r$//' "$file"
      ((fixed++))
    fi
  fi
done

if [ "$fixed" -gt 0 ]; then
  echo "  ✔ line-endings: normalized $fixed file(s) to LF"
fi
