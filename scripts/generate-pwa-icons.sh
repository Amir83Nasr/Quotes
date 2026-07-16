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
SOURCE_SVG="${ROOT_DIR}/public/icons/pwa-icon.svg"

echo "  → Generating PWA icons from logo.svg..."

# Rebuild the colored source SVG from the original logo
cat > "$SOURCE_SVG" <<- 'SVGEOF'
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#0a0a0a" x="0" y="0" width="1024" height="1024" rx="512" ry="512"/>
  <g fill="#ffffff">
    <path d="M559.49,528.69c-4.1-.89-10.09-8.49-9.11-13.15l.72-238.71,6.22-7.69,234.6-.7c6.01-.56,10.02,5.15,10.38,10.49,0,108.41,6.67,224.39-13.93,318.66-29.59,94.51-122.03,152.92-219.17,157.86-11.48.58-17.68-.33-18.85-13.12-1.79-19.65-1.79-59.81.01-79.43.56-5.93,1.52-10.74,7.61-13.26,9.04-3.74,23.69-5.22,34.13-9,52.19-18.94,76.42-56.83,79.36-111.94h-112,.03Z"/>
    <path d="M228.36,528.69c-3.51-.75-8.03-6.5-7.68-10.41l.65-242.88,6.26-6.26,234.53-.65c5.54,0,8,3.63,9.75,8.33-.9,74.37,3.45,150.59.72,224.79-4.77,129.86-59.21,216.06-189.54,245.94-13.26,3.03-31.67,7.28-44.97,7.89-9.43.43-15.76.58-17.42-10.38l.83-89.73c2.37-7.83,18.66-7.99,25.93-10.18,60.12-18.06,91.21-51.37,92.91-116.48h-112Z"/>
  </g>
</svg>
SVGEOF

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
