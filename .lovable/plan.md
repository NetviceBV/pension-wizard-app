

## Update "Wijzigingen doorgeven" text paragraph in PDF

### Changes — `src/components/Calculator.tsx`, lines 131–163

**Replace** the current link and instruction lines (lines 151–163) with a descriptive paragraph after the title:

1. After the title "Wijzigingen doorgeven" (line 135), add a text paragraph:
   - "Na inloggen op " (normal) + "mijn apothekerspensioen" (clickable link to `https://mijn.apothekerspensioen.nl/`, underlined) + " kunt u via de tegel Pensioengevend inkomen en" (normal, wraps to next line) + "parttimepercentage de onderstaande gegevens invullen." (normal)
2. Then show the two bullet items with values (parttimepercentage + pensioengevend inkomen) as they are now
3. **Remove** lines 151–163 (the old link + "Klik vervolgens..." text)
4. **Adjust `boxH`** to accommodate the new paragraph layout

The paragraph will be rendered at font size 9, white, using `doc.text()` for normal parts and `doc.textWithLink()` for the clickable "mijn apothekerspensioen" portion, all on the same or consecutive lines.

Single file change: `src/components/Calculator.tsx`

