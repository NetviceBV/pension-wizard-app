

## Add "Wijzigingen doorgeven" Paragraph to PDF

### Overview
Add a new highlighted section after the results in the PDF with the title "Wijzigingen doorgeven", listing two attributes and a clickable link.

### Changes — `src/components/Calculator.tsx` → `generatePDF()`

After the results loop (line ~121), before the footer:

1. **Draw highlighted block** — full-width rounded rectangle with SPOA blue background (`rgb(76, 180, 212)`)
2. **Title** — "Wijzigingen doorgeven" in white bold
3. **Two bullet lines** in white:
   - "Uw parttimepercentage"
   - "Pensioengevend inkomen per jaar (op fulltime basis)"
4. **Spacing + clickable link** — `doc.textWithLink()` in white/underlined: "Klik hier om in te loggen op het apothekers platform." on one line, then "Klik vervolgens op de tegel Pensioengevend inkomen en parttime percentage." as regular text below
5. The link URL will point to the apothekers platform (will use a placeholder URL that can be updated)

Single file change: `src/components/Calculator.tsx`

