

## Fix font size of paragraph text in "Wijzigingen doorgeven"

### Change — `src/components/Calculator.tsx`, line 138

Change `doc.setFontSize(9)` to `doc.setFontSize(10)` so the paragraph text ("Na inloggen op mijn apothekerspensioen...") matches all other text in the PDF.

Also adjust the line spacing on line 152 from `y += 5` to `y += 6` to accommodate the slightly larger text.

Single file, two-line change.

