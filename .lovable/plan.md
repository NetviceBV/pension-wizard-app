

## Disclaimer toevoegen aan de tool en PDF

### Disclaimertekst

> Deze rekentool is bedoeld als hulpmiddel om uw pensioengevend inkomen, pensioengrondslag en premie te berekenen. Vul deze tool daarom zo goed mogelijk in. Hoewel wij deze tool met veel zorg hebben ingericht, kunt u hieraan geen rechten ontlenen. U kunt alleen rechten ontlenen aan het geldende pensioenreglement. SPOA aanvaardt geen verantwoordelijkheid of aansprakelijkheid voor de werking, uitkomsten of gevolgen van het gebruik van deze tool.
>
> Op het gebruik van deze website is Nederlands recht toepasselijk.

### Aanpak — `src/components/Calculator.tsx`

**1. In de UI — onder de berekeningsresultaten**

Een subtiele maar duidelijke disclaimer toevoegen onderaan de Card, na de FAQ-sectie (rond regel 882). Vormgeving: klein lettertype (`text-xs`), gedempte kleur (`text-muted-foreground`), lichte bovenrand als scheiding. Altijd zichtbaar, niet wegklikbaar.

```tsx
<div className="mt-6 pt-4 border-t text-xs text-muted-foreground space-y-2">
  <p>Deze rekentool is bedoeld als hulpmiddel om uw pensioengevend inkomen, pensioengrondslag en premie te berekenen. ...</p>
  <p>Op het gebruik van deze website is Nederlands recht toepasselijk.</p>
</div>
```

**2. In de PDF — boven de tijdstempel-footer**

De huidige footer (regel 163-171) toont alleen een tijdstempel. De volledige disclaimertekst wordt erboven geplaatst in klein grijs lettertype (8pt), met automatische regelafbreking via `doc.splitTextToSize()`. De tijdstempel blijft onderaan staan.

### Samenvatting

- Twee locaties: UI (onder FAQ) en PDF (boven footer)
- Subtiel maar altijd zichtbaar — geen toggle of collapse
- Eén bestand, ~15 regels toegevoegd

