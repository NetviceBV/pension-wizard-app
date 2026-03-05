

## Embed Route: Remove Card Wrapper

Good idea. For an embedded version (inside an iframe), the Card wrapper with its shadow, border, and extra padding is unnecessary and wastes space. The calculator content should blend seamlessly into the host page.

### Approach

Pass an `embedded` prop to the `Calculator` component:

1. **`Calculator.tsx`**: Add an `embedded?: boolean` prop. When `true`, render just a plain `<div>` instead of `<Card>`, skip the `<CardHeader>` (title/description), and render the tabs content directly without `<CardContent>` wrapper padding.

2. **`Embed.tsx`**: Pass `embedded={true}` to `<Calculator />`.

3. **`Index.tsx`**: No changes (keeps the Card as-is).

### What changes visually on `/embed`
- No card border, shadow, or rounded corners
- No "Pensioengevend Salaris Calculator" title/description header
- Content renders flush, fitting naturally inside an iframe

