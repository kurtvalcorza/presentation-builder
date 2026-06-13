#!/usr/bin/env bash
# render_check.sh DECK.pptx VIEWABLE_DIR — render per-slide JPGs for visual QA.
# Needs LibreOffice (soffice) + poppler (pdftoppm). Uses a FRESH dir each run (soffice locks dirs).
set -e
DECK="$1"; OUT="${2:-render_$(date +%s)}"; mkdir -p "$OUT"
soffice --headless --convert-to pdf --outdir "$OUT" "$DECK" >/dev/null 2>&1
STEM="$(basename "${DECK%.pptx}")"
pdftoppm -jpeg -r 70 "$OUT/$STEM.pdf" "$OUT/$STEM" >/dev/null 2>&1
echo "Rendered slides to $OUT/  (inspect every slide for overflow, overlap, legibility)"
