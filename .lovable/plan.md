

## Contact Form in Last FAQ Item + Mandrill Email via Supabase Edge Function

### Overview
Replace the last FAQ answer ("Mijn vraag staat niet in de q en a, wat kan ik doen?") with a small contact form. On submit, send the data via a Supabase Edge Function that calls the Mandrill API.

### Prerequisites
- Enable **Lovable Cloud** (Supabase) on this project to support Edge Functions and secrets
- Store the Mandrill API key as a runtime secret (`MANDRILL_API_KEY_PRK`)

### Changes

**1. `src/components/Calculator.tsx`** — Contact form in last FAQ item

- Import `Textarea`, `Button`, `toast` and add a `ContactForm` component
- Replace the last `faqItems` entry's static answer with the `<ContactForm />` component
- Form fields: Email (optional, validated), Telefoonnummer (optional), Vraag (optional textarea)
- Submit button disabled until at least one field has a value
- On submit: call `supabase.functions.invoke('send-contact-email')` with the form data
- Show success/error toast

**2. `src/integrations/supabase/client.ts`** — Supabase client setup

- Create the Supabase client file (standard Lovable pattern) so the Calculator can invoke Edge Functions

**3. `supabase/functions/send-contact-email/index.ts`** — Edge Function

Based on the Mandrill pattern from the other project, simplified:
- No auth required (`verify_jwt = false`) — this is a public contact form
- Input validation with Zod: email (optional but valid if provided), phone (optional), question (optional), at least one required
- Read `MANDRILL_API_KEY_PRK` from env
- Build simple HTML email listing all filled fields
- Send via `https://mandrillapp.com/api/1.0/messages/send.json`
- To: `henk-jan@prikkl.nl`, From: `klantenservice@prikkl.nl`
- Subaccount: `PRK`
- Subject: "Nieuwe vraag via PGI Tool"

**4. `supabase/config.toml`** — Register the Edge Function with `verify_jwt = false`

### Technical details

- The `faqItems` array's last entry will have its `a` property changed from a string to a React node (the contact form component)
- The `AccordionContent` already accepts `ReactNode` children, so this works seamlessly
- Email validation: basic regex or `type="email"` + pattern check before submit
- Rate limiting: basic client-side disable-on-submit to prevent spam; server-side rate limiting can be added later
- The Mandrill API key will be stored as a Supabase secret via the secrets tool

