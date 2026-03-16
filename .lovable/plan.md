

## Auto-calculate Eindejaarsuitkering & Vakantiegeld from Bruto Maandinkomen

**File:** `src/components/Calculator.tsx` — `LoondienstForm` component

### Logic

- When `bruto` changes, auto-fill:
  - **Eindejaarsuitkering** = `bruto * 12 * 0.05` (adjusted for selected period)
  - **Vakantiegeld** = `bruto * 12 * 0.08` (adjusted for selected period)
- When **period** changes on either field, recalculate the displayed value for the new period (not a manual override)
- Only **direct text input** in the field sets a `manualRef` flag, stopping auto-updates
- When `bruto` changes, reset manual flags so auto-calculation resumes

### Implementation

1. Add two `useRef<boolean>` flags: `eindejaarsManual`, `vakantiegeldManual`
2. Create helper: `autoVal(yearAmount, period)` → returns `period === "maand" ? yearAmount / 12 : yearAmount`, formatted to 2 decimals
3. On `bruto` change: reset both manual flags, set eindejaars and vakantiegeld values via `autoVal`
4. On period change for eindejaars/vakantiegeld: if not manual, recalculate with `autoVal`
5. On direct text input for eindejaars/vakantiegeld: set corresponding manual flag to `true`

