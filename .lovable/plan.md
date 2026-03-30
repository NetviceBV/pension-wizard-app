

## Improve "Resultaat — In loondienst" subtitle styling

### Problem
The subtitle "Resultaat — In loondienst" sits as plain small text under the title, looking disconnected and "lost" on the page.

### Solution
Make it a subtle pill/badge-style element — a rounded rectangle with the SPOA blue background and white text, positioned just below the title. This gives it visual weight and ties it to the header area, similar to a tag or category label.

### Changes — `src/components/Calculator.tsx`, lines 54–57

Replace the plain text subtitle with:
1. Draw a rounded rectangle (SPOA blue `rgb(76, 180, 212)`) behind the text
2. Render "Resultaat — {tabLabel}" in white, bold, font size 10 inside the pill
3. Position it at y=28, with ~4px padding around the text
4. Use `doc.roundedRect()` for the pill shape, measure text width with `doc.getTextWidth()` to size it dynamically

Single file, ~8 lines replacing 2 lines.

