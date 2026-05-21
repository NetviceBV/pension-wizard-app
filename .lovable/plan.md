## Aanpassing
Het e-mailadres waar het contactformulier naartoe stuurt wordt gewijzigd van `henk-jan@prikkl.nl` naar `klantenservice@prikkl.nl`.

## Details
- Bestand: `supabase/functions/send-contact-email/index.ts` (regel 57)
- Wijziging: `to: [{ email: 'henk-jan@prikkl.nl', type: 'to' }]` wordt `to: [{ email: 'klantenservice@prikkl.nl', type: 'to' }]`
- Na de wijziging moet de edge function opnieuw worden geimplementeerd.

## Technisch
De `from_email` is al `klantenservice@prikkl.nl`. Alleen het `to`-adres (ontvanger) verandert.