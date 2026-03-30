

## Redesign Resultaat Card to "Wijzigingen doorgeven"

### Current State (lines 454–481)
The `ResultBlock` component shows a card with title "Resultaat" and four rows: Pensioengevend inkomen, Franchise 2026, Pensioengrondslag, and Uw premie (with a separator line above premie).

### New Design

**Title**: "Wijzigingen doorgeven" (replaces "Resultaat")

**Helper text**: Paragraph with clickable link — "Na inloggen op [mijn apothekerspensioen](https://mijn.apothekerspensioen.nl/) kunt u via de tegel Pensioengevend inkomen en parttimepercentage de onderstaande gegevens invullen."

**Primary attributes** (bold, prominent):
1. **Pensioengevend inkomen per jaar (op fulltime basis)** — bold label + value
2. **Uw parttimepercentage** — bold label + value

**Spacing/separator** after the two primary attributes

**Secondary attributes** (same style as current Pensioengrondslag — normal weight, no extra spacing between them, no separator lines):
- Franchise 2026
- Pensioengrondslag (×parttime%)
- Uw premie in 2026 (30,7%) — same style as Pensioengrondslag, no border-top

### Changes — `src/components/Calculator.tsx`

**Lines 454–481** — Replace the `ResultBlock` return JSX:
- Change title from "Resultaat" to "Wijzigingen doorgeven"
- Add paragraph with `<a>` link to mijn.apothekerspensioen.nl
- Render Pensioengevend inkomen and Parttimepercentage as bold `Row` components
- Add spacing (`mt-3 pt-3 border-t`) separator
- Render Franchise, Pensioengrondslag, and Uw premie as normal (non-bold) `Row` components without extra dividers

**Props**: Add `parttime` value display (already available as prop). The parttimepercentage row will show `{parttime}%` as value.

Single file change, ~30 lines replaced.

