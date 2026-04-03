

## Categorie-specifieke Q&A voor Loondienst, DGA en Zelfstandig

### Huidige situatie
Er is één globale `faqItems`-lijst met 14 vragen die voor alle tabs wordt getoond. De FAQ-sectie filtert alleen op zoektekst, niet op categorie.

### Voorgestelde verdeling

De huidige vragen worden verdeeld over drie categorieën, plus een "algemeen" set die bij alle tabs zichtbaar is. Logische verdeling:

**Algemeen (alle tabs)**
- Waarom vul ik een voltijdssalaris in, terwijl ik parttime werk?
- Hoe houdt SPOA rekening met mijn parttimepercentage als ik een fulltime inkomen moet invullen?
- Hoe houdt SPOA rekening met tussentijds starten of stoppen?
- Waarom moet ik een jaarsalaris op basis van een volledig jaar opgeven als ik tussentijds ben gestart of gestopt?
- Wat vul ik in bij arbeidsongeschiktheid? (beide vragen)
- Wat doe ik als ik wijzigingen uit het verleden wil doorgeven?
- Waarom moet ik als deelnemer zelf wijzigingen in mijn PGI of PT% doorgeven?
- Mijn vraag staat niet in de Q&A, wat kan ik doen? (contactformulier)

**Loondienst-specifiek**
- Wat vul ik in bij onbetaald verlof?
- Wat vul ik in bij gedeeltelijk betaald verlof?
- Wat doe ik als in mijn werkgever heb gemachtigd voor het doorgeven van het PGI en PT%?

**DGA-specifiek**
- Wat als ik zowel loondienst als dga of zelfstandig ben?
- Wat vul ik in als ik zowel dga als zelfstandig ben?

**Zelfstandig-specifiek**
- Wat als ik zowel loondienst als dga of zelfstandig ben?
- Wat vul ik in als ik zowel dga als zelfstandig ben?

### Technische aanpak — `src/components/Calculator.tsx`

1. **Datastructuur**: Voeg een `categories` veld toe aan elk FAQ-item:
   ```ts
   type FaqCategory = "algemeen" | "loondienst" | "dga" | "zelfstandig";
   const faqItems: { q: string; a: string | React.ReactNode; categories: FaqCategory[] }[]
   ```

2. **Filtering**: Pas `filteredFaq` aan om zowel op zoektekst als op de actieve tab te filteren. Items met categorie `"algemeen"` worden altijd getoond:
   ```ts
   const filteredFaq = faqItems
     .filter(item => item.categories.includes("algemeen") || item.categories.includes(tab as FaqCategory))
     .filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()));
   ```

3. **Geen UI-wijzigingen verder** — de FAQ-sectie blijft er hetzelfde uitzien, alleen de inhoud wisselt per tab.

Eén bestand, ~20 regels gewijzigd.

