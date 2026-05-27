De gebruiker wil dat de FAQ-vraag "Wat doe ik als ik nog geen 3 jaar zelfstandig ben?" (categorie: zelfstandig) in de Zelfstandig-tab als 5e vraag verschijnt.

**Huidige situatie:**
Het item staat op regel 301, helemaal aan het einde van de `faqItems` array. Voor de Zelfstandig-tab komt het daardoor pas na alle algemene vragen en de andere gedeelde vragen, op positie 13 van 14.

**Gewenste situatie:**
Het item moet de 5e vraag zijn voor de Zelfstandig-tab. De eerste 4 zichtbare vragen voor Zelfstandig zijn:
1. "Waarom moet ik als deelnemer..." (algemeen)
2. "Waarom vul ik een fulltime..." (algemeen)
3. "Hoe houdt SPOA rekening met mijn parttimepercentage..." (algemeen)
4. "Hoe houdt SPOA rekening met tussentijds starten of stoppen?" (algemeen)

**Wijziging:**
Verplaats het `faqItems` array-element "Wat doe ik als ik nog geen 3 jaar zelfstandig ben?" van regel 301 naar direct na regel 291 (na item 4).

**Technische details:**
In `src/components/Calculator.tsx`, regels 287-303:
- Verwijder het item van de huidige positie (regel 301)
- Voeg het in na regel 291

Dit is een enkele bestandswijziging in de array-volgorde.