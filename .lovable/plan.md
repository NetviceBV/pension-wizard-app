

## Always Show ResultBlock in DGA and Zelfstandig

Currently, DGA and Zelfstandig tabs wrap `ResultBlock` in `{hasInput && ...}`, hiding it until the user types something. Loondienst already shows it always (per the previous change).

### Changes in `src/components/Calculator.tsx`

1. **DGA form (~line 358):** Remove `{hasInput && (` wrapper — render `<ResultBlock .../>` unconditionally.
2. **Zelfstandig form (~line 400):** Same — remove `{hasInput && (` wrapper.
3. Remove the unused `hasInput` variable from both forms.

