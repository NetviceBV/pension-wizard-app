

## PDF & ResultBlock Updates

### Changes — `src/components/Calculator.tsx`

**1. Un-highlight "Uw premie in 2026"**
In `ResultBlock`, remove the `border-t pt-2` wrapper `<div>` around the premie row so it renders as a normal row (no bold, no highlight).

**2. Add highlighted "Wat u moet invullen" section**
In `ResultBlock`, add a new section after "Resultaat" heading and before the existing rows. This section:
- Has a highlighted background (e.g. `bg-primary/10 rounded-md p-3 border border-primary/20`)
- Heading: **"Wat u moet invullen"**
- Two rows: "Parttimepercentage" → `{parttime}%` and "Pensioengevend inkomen per jaar (fulltime basis)" → `euro(pensioengevend)`

**3. Fix Bruto maandinkomen in PDF**
In the `DownloadButton` inputs for `LoondienstForm` (line ~889), change:
- `euro(brutoVal * 12)` → `euro(brutoVal)` so it shows the monthly value the user entered

### Technical detail
- The "Wat u moet invullen" block sits between the "Resultaat" heading and the existing result rows, visually distinguished with a tinted background
- The premie row becomes a regular `<Row>` without `bold` prop or wrapper div
- `ResultBlock` already receives `pensioengevend` and `parttime` props, so no interface changes needed

