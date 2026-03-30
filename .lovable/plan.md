

## Align Amounts and Units in PDF + Move Result Amounts Under Input Amounts

### What you want
The PDF currently right-aligns values (amount + unit as one string) to the page edge. You want:
1. **Amounts and units in separate columns** — amounts right-aligned at a fixed X position, units left-aligned after that (so all "per maand" / "per jaar" text starts at the same X)
2. **Result amounts aligned under the input amounts** — same X position for the amount column in both sections

### Changes — `src/components/Calculator.tsx` → `generatePDF()`

**1. Define a fixed amount column X position** (e.g. `const amountX = 145;` and `const unitX = 148;`)

**2. Split input values into amount + unit** before rendering:
- Parse each `input.value` to separate the euro amount from the unit (e.g. `"€ 1.234,00 per maand"` → amount `"€ 1.234,00"` + unit `"per maand"`)
- Render amount right-aligned at `amountX`, unit normal-aligned at `unitX`
- For values without a unit (like `"85%"`), just render at `amountX` right-aligned

**3. Apply the same amountX to results section:**
- Results values (`euro(pensioengevend)`, etc.) right-aligned at `amountX` instead of `pageWidth - 20`
- Premie highlight amount also at `amountX`

This creates two clean columns: labels on the left, amounts aligned in the middle-right, units after.

