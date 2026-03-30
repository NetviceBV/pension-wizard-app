

## Make the Q&A Section More Visually Prominent

### Changes — `src/components/Calculator.tsx`

**1. Q&A section wrapper** (line ~438): Add a colored background, rounded corners, and padding to make it stand out from the rest of the card:
- Change `className` from `"mt-8 pt-8 border-t"` to `"mt-8 p-6 rounded-lg bg-muted/50 border"`

**2. Heading** (line ~439): Make it larger with an icon:
- Add a `HelpCircle` icon next to the heading text
- Increase size: `text-xl font-bold`

**3. Q&A header button** (line ~490): Make the "Q&A" link more button-like:
- Add a subtle background pill style: `px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-sm transition-colors`

These changes give the FAQ a distinct visual zone (tinted background + border + rounded box) and make the navigation button more noticeable as a clickable element.

