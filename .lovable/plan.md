

## Add PDF Download Button Below Result

### Overview
Add a red "Download hier uw resultaat" button below each `ResultBlock`. Clicking it generates a PDF in the browser using **jsPDF** that mirrors the card's look and feel — showing the tab name, input values, and calculated results.

### Changes

**1. Install `jspdf`** — lightweight client-side PDF generation library

**2. `src/components/Calculator.tsx`**

- Create a `DownloadButton` component that receives the current tab label, all computed values (pensioengevend, grondslag, premie, parttime), and the input field labels/values for that tab
- Style: full-width red button (`bg-red-600 hover:bg-red-700 text-white w-full`) placed directly after `ResultBlock` in each form (LoondienstForm, DGAForm, ZelfstandigForm)
- On click: generate a PDF using jsPDF with:
  - Header: "Pensioengevend Inkomen Tool — Resultaat"
  - Subtitle: tab name (e.g. "In loondienst")
  - Section listing all filled-in fields with their values
  - Result section matching the ResultBlock layout (pensioengevend inkomen, franchise, pensioengrondslag, premie)
  - Styled with the app's primary blue color for headings, clean table-like rows
  - Footer with generation date
- Each form passes its specific field data to the download function

### Technical detail
- jsPDF is ~280KB and runs entirely client-side — no server needed
- The PDF uses `euro()` formatter for consistent number formatting
- Each form component constructs an array of `{ label, value }` entries for its inputs and passes them along with the result values to the PDF generator
- The button is disabled when no input has been entered (all values are 0)

