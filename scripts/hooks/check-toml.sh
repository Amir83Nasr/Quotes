#!/bin/bash
# Validate TOML syntax of staged .toml files.
# Called by Lefthook — receives file paths as arguments.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

# Check if tomlq (from yq) or toml-cli is available
if command -v tomlq &>/dev/null; then
  for file in "$@"; do
    if ! tomlq . "$file" > /dev/null 2>&1; then
      echo "  ✗ invalid TOML: $file"
      exit 1
    fi
  done
elif command -v python3 &>/dev/null; then
  for file in "$@"; do
    if ! python3 -c "import tomllib; tomllib.load(open('$file', 'rb'))" 2>/dev/null && \
       ! python3 -c "import tomli; tomli.load(open('$file', 'rb'))" 2>/dev/null; then
      echo "  ✗ invalid TOML: $file"
      exit 1
    fi
  done
else
  echo "  ⚠ toml check skipped: no tomlq or python3 with tomllib/tomli available"
fi
