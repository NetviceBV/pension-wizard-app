

## Use ResultBlock in Loondienst (match DGA/Zelfstandig style)

Replace the four `Subtotaal` lines at the bottom of `LoondienstForm` with the same `ResultBlock` component used in DGA and Zelfstandig forms. Show it always (not conditionally with `hasInput`).

### Change in `src/components/Calculator.tsx`

In `LoondienstForm`, replace the 4 `Subtotaal` lines (pensioengevend, franchise, grondslag, premie) with:

```tsx
<ResultBlock
  pensioengevend={pensioengevend}
  grondslag={grondslag}
  premie={premie}
  parttime={parttimeVal}
/>
```

Remove the `hasInput` conditional — always show the result block.

