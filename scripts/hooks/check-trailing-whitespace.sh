#!/bin/bash
# Remove trailing whitespace from staged files.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

# Strip trailing whitespace, keeping trailing newlines intact
sed -i '' -E 's/[[:space:]]+$//' "$@"

# Report what was fixed
echo "  ✔ trailing-whitespace: cleaned $# file(s)"
