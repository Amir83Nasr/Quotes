#!/bin/bash
# Reject files that look like they contain private keys or credentials.
# Called by Lefthook — receives file paths as arguments.
# Skips the scripts/hooks/ directory (our own scripts match the patterns).
set -euo pipefail

if [ $# -eq 0 ]; then
  exit 0
fi

# Patterns that indicate private keys
patterns=(
  'BEGIN\s+(RSA|DSA|EC|OPENSSH|PGP)\s+PRIVATE\s+KEY'
  'BEGIN\s+PRIVATE\s+KEY'
  'PRIVATE KEY BLOCK'
  'AKIA[0-9A-Z]{16}'           # AWS access key ID (potential)
)

found=0
for file in "$@"; do
  # Skip our own hook scripts
  if [[ "$file" == *scripts/hooks/* ]]; then
    continue
  fi
  for pat in "${patterns[@]}"; do
    if grep -qE "$pat" "$file" 2>/dev/null; then
      echo "  ✗ possible private key/credential in: $file"
      ((found++))
      break
    fi
  done
done

if [ "$found" -gt 0 ]; then
  echo "  ✗ Remove secrets before committing."
  exit 1
fi
