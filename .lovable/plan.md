

## Fix Mobile Layout for Form Fields

The current layout uses a horizontal `flex` row with `w-2/5` for inputs, which is too narrow on mobile — especially for fields with a period selector. Values get clipped and are unreadable.

### Solution

Switch to a **stacked layout on mobile** (label on top, input below) and keep the horizontal layout on desktop.

### Changes — `src/components/Calculator.tsx`

1. **`EuroInput`**: Change wrapper from `flex items-center gap-4` to stacked on mobile, horizontal on `sm:` and up. Change input container from `w-2/5` to full width on mobile.

2. **`EuroInputWithPeriod`**: Same stacking approach. The input + period selector row stays horizontal but gets full width on mobile.

3. **`PercentInput`**: Same pattern — stack on mobile, inline on desktop.

4. **Subtotal row**: Check if the yellow subtotal bar needs adjustment (likely fine as-is).

Specifically, for each input component:
- Wrapper: `flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4`
- Input container: remove `w-2/5 shrink-0`, add `w-full sm:w-2/5 sm:shrink-0`

