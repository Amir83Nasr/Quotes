#!/bin/bash
# Ensure every file ends with exactly one newline.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

fixed=0
for file in "$@"; do
  if [ -s "$file" ] && [ "$(tail -c 1 "$file" | wc -l)" -eq 0 ]; then
    echo "" >> "$file"
    ((fixed++))
  fi
done

if [ "$fixed" -gt 0 ]; then
  echo "  ✔ eof-newline: fixed $fixed file(s)"
fi
