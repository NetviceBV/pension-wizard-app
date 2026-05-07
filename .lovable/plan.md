## Wijziging FAQ-contactblok

In `src/components/Calculator.tsx` staan twee inleidende teksten boven het contactformulier in de laatste FAQ ("Mijn vraag staat niet in de Q&A..."):

1. Regel 302 (FAQ-antwoord): "Geef uw vraag door via het invulveld. Wij zullen uw vraag dan voor u beantwoorden."
2. Regel 235 (binnen `ContactForm`): "Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met u op."

### Aanpak

- **Regel 235** (in `ContactForm`): vervangen door de nieuwe tekst inclusief klikbaar telefoonnummer:
  > Vul onderstaand contactformulier in en we nemen contact met je op. Je kan ook bellen (maandag tot en met vrijdag tussen 09.00 en 17.00 uur): [030-207 7076](tel:+31302077076).
  
  Het telefoonnummer wordt een `<a href="tel:+31302077076">`-link, gestyled in de SPOA primary kleur met underline.

- **Regel 302** (FAQ-antwoord): de losse zin "Geef uw vraag door via het invulveld..." verwijderen, zodat alleen `<ContactForm />` overblijft (die nu zelf de juiste introtekst toont). Dit voorkomt dubbele inleidingen.

Geen andere bestanden of logica wijzigen.