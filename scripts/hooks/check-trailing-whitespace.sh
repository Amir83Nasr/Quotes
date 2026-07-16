#!/bin/bash
# Remove trailing whitespace from staged files.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

# Skip binary files that choke sed
text_files=()
for f in "$@"; do
  if [[ "$(file -b --mime-type "$f")" == text/* ]]; then
    text_files+=("$f")
  fi
done

if [ ${#text_files[@]} -eq 0 ]; then
  exit 0
fi

# Strip trailing whitespace, keeping trailing newlines intact
sed -i '' -E 's/[[:space:]]+$//' "${text_files[@]}"

# Report what was fixed
echo "  ✔ trailing-whitespace: cleaned ${#text_files[@]} file(s)"
