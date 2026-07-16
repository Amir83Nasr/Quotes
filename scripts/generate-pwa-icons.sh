#!/usr/bin/env bash
# ── Generate PWA Icons from logo.svg ────────────────────────────────────
# Run this script after updating public/logo.svg to regenerate all PWA icon
# assets at every required size.
#
# Usage:
#   bash scripts/generate-pwa-icons.sh
#
# Requires ImageMagick (convert) — install via:
#   brew install imagemagick   # macOS
#   apt install imagemagick   # Debian/Ubuntu
# ─────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ICONS_DIR="${ROOT_DIR}/public/icons"
SOURCE_SVG="${ROOT_DIR}/public/logo.svg"

echo "  → Generating PWA icons from ${SOURCE_SVG}..."

# PWA-required sizes
for size in 192 512; do
  convert -background none -resize "${size}x${size}" \
    -colorspace sRGB -define png:color-type=6 \
    "$SOURCE_SVG" "${ICONS_DIR}/icon-${size}x${size}.png"
  echo "  ✓ icon-${size}x${size}.png"
done

# Maskable variants (same source — maskable area check is design-level)
for size in 192 512; do
  cp "${ICONS_DIR}/icon-${size}x${size}.png" \
     "${ICONS_DIR}/icon-${size}x${size}-maskable.png"
  echo "  ✓ icon-${size}x${size}-maskable.png"
done

# Apple touch icon (180×180)
convert -background none -resize 180x180 \
  -colorspace sRGB -define png:color-type=6 \
  "$SOURCE_SVG" "${ICONS_DIR}/icon-180x180.png"
echo "  ✓ icon-180x180.png"

# Favicon (multires ICO)
convert -background none -resize 48x48 \
  -colorspace sRGB \
  "$SOURCE_SVG" "${ROOT_DIR}/public/favicon.ico"
echo "  ✓ favicon.ico"

echo ""
echo "  All icons generated in public/icons/"
