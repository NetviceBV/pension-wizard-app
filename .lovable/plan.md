

## Merge web card layout into PDF blue box

### Goal
Put all the content from the web card (image-26) into the blue box in the PDF (image-27), including the secondary attributes (Franchise, Pensioengrondslag, Uw premie) which are currently only in the "Resultaat" section above.

### Changes — `src/components/Calculator.tsx`, lines 98–167

**Remove** lines 98–123 (the entire "Resultaat" heading and its 4 rows).

**Replace** lines 125–167 (blue box) with an expanded blue box containing all attributes:

1. Keep blue rounded rect but increase `boxH` from 72 to ~110 to fit extra rows
2. **Title**: "Wijzigingen doorgeven" — bold, white, size 13
3. **Helper text**: white, normal, size 10 — with underlined link (same as current)
4. **Primary attributes** (bold, white, with bullet):
   - Pensioengevend inkomen per jaar (op fulltime basis) + value
   - Uw parttimepercentage + value
5. **Thin white separator line** inside the box
6. **Secondary attributes** (normal weight, white, with bullet):
   - Franchise 2026
   - Pensioengrondslag (×parttime%)
   - Uw premie in 2026 (30,7%)

All text white on SPOA blue background. Single file, ~70 lines replaced with ~55 lines.

