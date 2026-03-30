

## Move FAQ Inside Calculator Card & Update Icon Text

### Overview
Move the entire FAQ section (search + accordion) from below the calculator into the Calculator card, placed after the result block. Replace the `HelpCircle` icon in the header with a text-based "Q&A" button/link.

### Changes

**1. `src/components/Calculator.tsx`**
- Move the FAQ data array (`faqItems`), search state, and accordion rendering **into** the Calculator component, placed inside `CardContent` after the tabs
- Add the FAQ section with search input + accordion after the tab content, inside the card
- Replace the `HelpCircle` icon button in the header with a small text button saying **"Q&A"** (styled as muted text, hover to primary) that scrolls down to the FAQ within the card
- Remove `HelpCircle` import, add `Search` icon import and accordion imports

**2. `src/pages/Index.tsx`**
- Remove the entire FAQ section (the `#faq` div, search state, faqItems array, accordion imports, Search import)
- Simplify to just rendering `<Calculator />`

### Technical detail
- The FAQ anchor (`id="faq"`) moves inside the card
- The "Q&A" header button uses the same smooth-scroll behavior
- FAQ section gets a top border/margin separator from the tab content

