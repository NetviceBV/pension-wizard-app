

## Pensioengevend Salaris Calculator

### Overview
A standalone, embeddable calculator app with 3 groups (Apotheker in loondienst, DGA, Zelfstandig apotheker). No backend, browser-only. Works as standalone page and can be embedded via iframe.

### Groups & Fields

**Group 1: Apotheker in loondienst**
- Bruto maandinkomen (€)
- Eindejaarsuitkering conform CAO 5% (auto-calculated from bruto maandinkomen × 12 × 5%)
- Vaste bonus (indien onderdeel loonafspraak) (€)
- Vaste waarnemingstoeslag (€)
- Vaste management/bereikbaarheidsvergoeding (€)
- → Subtotaal 1 = sum of above
- Vakantiegeld 8% (auto = subtotaal1 × 8%)
- → Subtotaal 2 = subtotaal1 + vakantiegeld
- Parttimepercentage (%)
- → Pensioengevend inkomen = min(subtotaal2 / parttimepercentage × 100, 113738) — herleid naar fulltime
- → Franchise 2026 = 19172 (fixed)
- → Pensioengrondslag = (pensioengevend inkomen - franchise) × parttimepercentage / 100
- → Premie 2026 = pensioengrondslag × 30.7%

**Group 2: Apotheker DGA**
- Fiscaal vastgestelde bruto loon (€)
- Structurele eindejaarsuitkering (€)
- Vaste waarnemingstoeslag (€)
- Vaste management/bereikbaarheidsvergoeding (€)
- → Subtotaal 1
- Vakantiegeld (indien onderdeel loonafspraak) (€)
- → Subtotaal 2
- Parttimepercentage (%)
- → Same calculation logic as Group 1

**Group 3: Zelfstandig apotheker**
- Winst uit onderneming van drie jaar geleden (€)
- Parttimepercentage (%)
- → Pensioengevend inkomen = min(winst / parttimepercentage × 100, 113738)
- → Same franchise/grondslag/premie calculation

### Calculation Logic
1. Compute fulltime income from inputs
2. Cap at max 113,738
3. Pensioengrondslag = (fulltime income - 19,172) × parttimepercentage / 100
4. If grondslag < 0, set to 0
5. Premie = grondslag × 0.307

### Technical Plan

**Files to create/modify:**

1. **`src/pages/Index.tsx`** — Main calculator page with:
   - Group selector (3 tabs or radio buttons)
   - Dynamic form per group
   - Auto-calculation when all fields filled
   - Info/explanation panel per group (collapsible)
   - Results display (pensioengevend inkomen, franchise, grondslag, premie)

2. **`src/pages/Embed.tsx`** — Minimal version without page chrome, for iframe embedding

3. **`src/App.tsx`** — Add `/embed` route

4. **`src/components/Calculator.tsx`** — Core calculator component used by both pages

### UI Design
- Clean card-based layout
- Tabs for group selection (using shadcn Tabs)
- Euro-formatted input fields
- Yellow/gold accent for info sections (matching Excel styling)
- Collapsible info panels with the "wat telt mee/niet mee" explanations
- Results section appears when all required fields are filled
- Fully responsive

### Embedding
- `/embed` route renders just the calculator without extra page wrapper
- Users can embed via `<iframe src="https://domain/embed" />` 

