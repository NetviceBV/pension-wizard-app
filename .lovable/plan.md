

## Move FAQ Link Inside Calculator Card Header

### What changes
**File:** `src/components/Calculator.tsx`

1. Add a `HelpCircle` icon (from `lucide-react`) as a small button in the `CardHeader`, positioned to the right of the title using flex layout
2. The icon scrolls smoothly to the `#faq` section when clicked
3. Add a tooltip or `title` attribute: "Veelgestelde vragen"

**File:** `src/pages/Index.tsx`

4. Remove the standalone "Veelgestelde vragen ↓" link from the top of the page (the `<div className="w-full max-w-2xl mb-4 flex justify-end">` block)

### Technical detail
- CardHeader layout: wrap title area and icon in a flex row with `justify-between items-start`
- Icon: `<HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer shrink-0" />` wrapped in an `<a>` or `<button>` with `onClick` smooth-scroll to `#faq`
- Works well on mobile since it's a small icon that doesn't take extra vertical space

