

## Fix Calculation and Label for Loondienst

### Current issue
- `vakantiegeldVal` is added directly without `× 12` — but it's a monthly input, so it should be multiplied by 12
- The `brutoVal` is already multiplied by 12 — correct
- The vakantiegeld label says "Uw vakantiegeld (8%)" but should indicate it's a monthly amount

### Changes in `src/components/Calculator.tsx`

1. **Line 387**: Change `subtotaal2 = subtotaal1 + vakantiegeldVal` → `subtotaal2 = subtotaal1 + vakantiegeldVal * 12`

2. **Line 444**: Change label from `"Uw vakantiegeld (8%)"` → `"Uw vakantiegeld (8%) — per maand"`

