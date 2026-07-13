#!/bin/bash
# Block commit if unresolved merge conflict markers are present.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

found=0
for file in "$@"; do
  if grep -qE '^<<<<<<< |^=======$|^>>>>>>> ' "$file" 2>/dev/null; then
    echo "  ✗ merge conflict markers found in: $file"
    ((found++))
  fi
done

if [ "$found" -gt 0 ]; then
  echo "  ✗ Resolve conflicts before committing."
  exit 1
fi
