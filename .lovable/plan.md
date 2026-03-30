

## Make "Wijzigingen doorgeven" match "Resultaat" styling with values

### Changes — `src/components/Calculator.tsx` → `generatePDF()`

**1. Match font size** — Change title font size from `12` to `13` (same as "Resultaat" on line 100)

**2. Add values next to bullet items** — Use the same column layout as Resultaat:
- "Uw parttimepercentage" → show `parttime%` value at `amountX`, right-aligned
- "Pensioengevend inkomen per jaar (op fulltime basis)" → show `euro(pensioengevend)` at `amountX`, right-aligned
- Same font styling: label in normal white, value in bold white

**3. Adjust box height** — Increase `boxH` slightly to accommodate the values comfortably

**4. Match line spacing** — Use `y += 7` between bullet lines (same as Resultaat rows)

Single file change: `src/components/Calculator.tsx`, lines 123–157

