

## Two changes in PDF — `src/components/Calculator.tsx`

### 1. Make bullet labels bold (lines 166, 172)
- Line 166: Change `doc.setFont("helvetica", "normal")` before "Uw parttimepercentage" to `"bold"`
- Line 171: Change `doc.setFont("helvetica", "normal")` before "Pensioengevend inkomen..." to `"bold"`

### 2. Remove separator line above Resultaat (lines 100–103)
Delete lines 100–103 (the separator `doc.line(...)` and spacing) and reduce `y += 5` on line 98 to just `y += 10` to maintain reasonable spacing.

Single file, ~6 lines changed.

