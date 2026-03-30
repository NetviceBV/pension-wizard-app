import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, question } = await req.json();

    // Validate: at least one field must be filled
    const hasEmail = typeof email === 'string' && email.trim().length > 0;
    const hasPhone = typeof phone === 'string' && phone.trim().length > 0;
    const hasQuestion = typeof question === 'string' && question.trim().length > 0;

    if (!hasEmail && !hasPhone && !hasQuestion) {
      return new Response(
        JSON.stringify({ error: 'Vul minimaal één veld in.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Validate email format if provided
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Ongeldig e-mailadres.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const apiKey = Deno.env.get('MANDRILL_API_KEY_PRK');
    if (!apiKey) {
      console.error('MANDRILL_API_KEY_PRK not configured');
      throw new Error('Email service not configured');
    }

    // Build simple HTML body
    const lines: string[] = [];
    if (hasEmail) lines.push(`<p><strong>E-mail:</strong> ${email.trim()}</p>`);
    if (hasPhone) lines.push(`<p><strong>Telefoon:</strong> ${phone.trim()}</p>`);
    if (hasQuestion) lines.push(`<p><strong>Vraag:</strong> ${question.trim()}</p>`);

    const html = `<h2>Nieuwe vraag via PGI Tool</h2>${lines.join('')}`;

    const mandrillRequest = {
      key: apiKey,
      message: {
        html,
        subject: 'Nieuwe vraag via PGI Tool',
        from_email: 'klantenservice@prikkl.nl',
        from_name: 'PGI Tool',
        to: [{ email: 'henk-jan@prikkl.nl', type: 'to' }],
        subaccount: 'PRK',
      },
    };

    console.log('Sending contact email via Mandrill...');

    const response = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mandrillRequest),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Mandrill API error:', responseData);
      throw new Error(`Mandrill API error: ${response.status}`);
    }

    console.log('Contact email sent successfully:', responseData);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in send-contact-email:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
