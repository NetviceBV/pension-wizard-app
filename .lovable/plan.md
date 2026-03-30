

## Add FAQ Section with Search, Accordion, and Navigation Links

### Overview
Add a Q&A section below the calculator with a search/filter input, smooth-scroll navigation from the top, and all 14 questions in an Accordion. Answers use lorem ipsum placeholder text.

### Changes

**`src/pages/Index.tsx`**

1. **Top navigation**: Add a "Veelgestelde vragen" link that smooth-scrolls to `#faq`

2. **FAQ section** (below `<Calculator />`):
   - Heading: "Veelgestelde vragen"
   - **Search input**: A text field (using existing `Input` component) with a search icon, placeholder "Zoek een vraag...". Filters the visible accordion items in real-time by matching the query against question text (case-insensitive)
   - **Accordion**: `type="single" collapsible`, showing only questions that match the search query. If search is empty, all questions are shown
   - "Geen resultaten" message when no questions match
   - Same max-width as calculator for visual consistency

3. **Questions** (no numbering, from uploaded DOCX):
   - Waarom vul ik een voltijdssalaris in, terwijl ik parttime werk?
   - Hoe houdt SPOA rekening met mijn parttimepercentage als ik een fulltime inkomen moet invullen?
   - Hoe houdt SPOA rekening met tussentijds starten of stoppen?
   - Wat vul ik in bij onbetaald verlof?
   - Wat vul ik in bij gedeeltelijk betaald verlof?
   - Wat als ik zowel loondienst als dga of zelfstandig ben?
   - Wat vul ik in als ik zowel dga als zelfstandig ben?
   - Wat vul ik in als ik arbeidsongeschikt ben?
   - Wat doe ik als ik gedeeltelijk arbeidsongeschikt ben?
   - Waarom moet ik een jaarsalaris op basis van een volledig jaar opgeven als ik tussentijds ben gestart of gestopt?
   - Wat doe ik als ik wijzigingen uit het verleden wil doorgeven?
   - Waarom moet ik als deelnemer zelf wijzigingen in mijn PGI of PT% doorgeven?
   - Wat doe ik als in mijn werkgever heb gemachtigd voor het doorgeven van het PGI en PT%?
   - Mijn vraag staat niet in de q en a, wat kan ik doen?

4. All answers: lorem ipsum placeholder text

### Technical details
- Search state via `useState<string>("")`
- Filter: `questions.filter(q => q.question.toLowerCase().includes(search.toLowerCase()))`
- Uses existing `Input`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` components
- `Search` icon from lucide-react

