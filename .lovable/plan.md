

## Horizontal Label-Input Layout

Change the `EuroInput`, `PercentInput`, and `Subtotaal` components from vertical stacking (label above input) to horizontal alignment (label left, input right).

### Changes in `src/components/Calculator.tsx`:

1. **`EuroInput`** (line 241): Change `space-y-1.5` to a flex row layout with label taking ~60% width and input ~40%
2. **`PercentInput`** (line 276): Same horizontal layout
3. **`Subtotaal`** (already horizontal — no change needed)

Layout pattern:
```text
┌─────────────────────────────┬──────────────┐
│ Label text                  │  € [input]   │
└─────────────────────────────┴──────────────┘
```

Use `flex items-center gap-4` with label getting `flex-1` or `w-3/5` and input getting `w-2/5` or similar proportions. On small screens, keep horizontal but allow label to wrap.

