#!/bin/bash
# Validate YAML syntax of staged files.
# Called by Lefthook — receives file paths as arguments.
# Uses python3 with PyYAML if available; skips gracefully if not.
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

# Check if PyYAML is available
if ! python3 -c "import yaml" 2>/dev/null; then
  echo "  ⚠ yaml check skipped: python3 PyYAML not available"
  exit 0
fi

errors=0
for file in "$@"; do
  if ! python3 -c "import yaml, sys; yaml.safe_load(open(sys.argv[1]))" "$file"; then
    echo "  ✗ invalid YAML: $file"
    ((errors++))
  fi
done

if [ "$errors" -gt 0 ]; then
  exit 1
fi
