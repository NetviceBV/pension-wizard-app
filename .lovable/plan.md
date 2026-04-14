

## FAQ antwoorden en vragen bijwerken

### Wat verandert

Alle Lorem ipsum-antwoorden in de `faqItems` array in `src/components/Calculator.tsx` (regels 287-301) worden vervangen door de definitieve antwoorden. Daarnaast:

- Sommige vraagteksten worden aangepast aan de exacte formulering uit de aangeleverde lijst
- Twee nieuwe vragen worden toegevoegd:
  - **Q11**: "Waarom moet ik een jaarinkomen op basis van een volledig jaar opgeven als ik tussentijds ben gestart of gestopt?" (categorie: algemeen)
  - **Q14**: "Wat doe ik als ik nog geen 3 jaar zelfstandig ben?" (categorie: zelfstandig)
- Vraag 15 ("Mijn vraag staat niet in de Q&A") behoudt het ContactForm als antwoord, maar krijgt als inleidende tekst: "Geef uw vraag door via het invulveld. Wij zullen uw vraag dan voor u beantwoorden."

### Technisch

Eén bestand: `src/components/Calculator.tsx`, regels 287-301. De volledige `faqItems` array wordt herschreven met:
- 15 vragen (was 13) met definitieve antwoorden
- Correcte vraagteksten conform de aangeleverde lijst
- Bestaande categorie-indeling blijft behouden, Q14 krijgt categorie `zelfstandig`

