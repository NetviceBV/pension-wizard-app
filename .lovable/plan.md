## Doel
Nieuwe veelgestelde vraag toevoegen aan de Q&A-sectie, zichtbaar onder het tabblad **Loondienst**.

## Te wijzigen
Bestand: `src/components/Calculator.tsx`

## Wijziging
In de array `faqItems` (regel ~287) een nieuw item toevoegen met:
- **Vraag:** Wat moet ik doen bij een tussentijdse loonstijging?
- **Antwoord:** Bereken pgi en pt% voor periode 1. Vul deze gegevens in Mijn Apothekerspensioen, inclusief de start van de periode. Doe daarna hetzelfde voor periode 2 en geef in Mijn Apothekerspensioen ook aan wanneer periode 2 van start gaat.\n\nHeb je dit al eerder gedaan? Vul dan alleen de nieuwe gegevens in voor periode 2.
- **Categorie:** `["loondienst"]`

Het antwoord plaatst het nieuwe item boven "Mijn vraag staat niet in de Q&A, wat kan ik doen?", zodat de contactoptie altijd als laatste item verschijnt.

**NB:** De tekst "Mijn Apthkerespensioen" uit de gebruikersinput wordt gecorrigeerd naar "Mijn Apothekerspensioen".