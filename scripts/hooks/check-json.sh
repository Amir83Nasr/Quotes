#!/bin/bash
# Validate JSON syntax of staged files.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

errors=0
for file in "$@"; do
  if ! python3 -c "import json, sys; json.load(open(sys.argv[1]))" "$file" 2>/dev/null; then
    echo "  ✗ invalid JSON: $file"
    ((errors++))
  fi
done

if [ "$errors" -gt 0 ]; then
  exit 1
fi
