import { useState, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown, Info, Calculator as CalcIcon, Search, HelpCircle, Send, Download, Briefcase, Building2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import spoaLogo from "@/assets/spoa.png";

/* ───── PDF Download Button ───── */
function DownloadButton({
  tabLabel,
  inputs,
  pensioengevend,
  grondslag,
  premie,
  parttime,
  selectedYear,
  params,
}: {
  tabLabel: string;
  inputs: { label: string; value: string }[];
  pensioengevend: number;
  grondslag: number;
  premie: number;
  parttime: number;
  selectedYear: number;
  params: { maxPensioengevend: number; franchise: number; premiePercentage: number };
}) {
  const hasData = pensioengevend > 0 || grondslag > 0 || premie > 0;

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header (white background)
    // Add SPOA logo top-right
    try {
      doc.addImage(spoaLogo, "PNG", pageWidth - 55, 8, 46, 6.5);
    } catch (_) { /* logo load failed, continue without */ }

    doc.setTextColor(76, 180, 212);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Bereken uw pensioengevend inkomen", 20, 18);
    const badgeText = `Resultaat ${selectedYear} — ${tabLabel}`;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const badgeWidth = doc.getTextWidth(badgeText) + 10;
    const badgeH = 8;
    const badgeY = 24;
    doc.setFillColor(76, 180, 212);
    doc.roundedRect(20, badgeY, badgeWidth, badgeH, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, 25, badgeY + 5.5);

    y = 45;

    // Input section
    doc.setTextColor(76, 180, 212);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Ingevoerde gegevens", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const amountX = 145;
    const unitX = 148;

    const filledInputs = inputs.filter((i) => i.value && i.value !== "€ 0,00" && i.value !== "0");
    filledInputs.forEach((input) => {
      doc.setFont("helvetica", "normal");
      doc.text(input.label, 20, y);
      doc.setFont("helvetica", "bold");
      // Split amount and unit (e.g. "€ 1.234,00 per maand" → amount + unit)
      const perMatch = input.value.match(/^(.+?)\s+(per\s+.+)$/);
      if (perMatch) {
        doc.text(perMatch[1], amountX, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.text(perMatch[2], unitX, y);
      } else {
        doc.text(input.value, amountX, y, { align: "right" });
      }
      y += 7;
    });

    y += 10;

    // Wijzigingen doorgeven section (blue box with all results)
    const boxX = 20;
    const boxW = pageWidth - 40;
    const boxH = 110;
    doc.setFillColor(76, 180, 212);
    doc.roundedRect(boxX, y, boxW, boxH, 3, 3, "F");

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("Wijzigingen doorgeven", boxX + 8, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    const prefixText = "Na inloggen op ";
    doc.text(prefixText, boxX + 8, y);
    const prefixW = doc.getTextWidth(prefixText);
    const linkLabel = "mijn apothekerspensioen";
    doc.textWithLink(linkLabel, boxX + 8 + prefixW, y, { url: "https://mijn.apothekerspensioen.nl/" });
    const linkW = doc.getTextWidth(linkLabel);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(boxX + 8 + prefixW, y + 0.8, boxX + 8 + prefixW + linkW, y + 0.8);
    const suffixText = " kunt u via de tegel Pensioengevend inkomen en";
    doc.text(suffixText, boxX + 8 + prefixW + linkW, y);
    y += 6;
    doc.text("parttimepercentage de onderstaande dik gedrukte gegevens invullen.", boxX + 8, y);

    // Primary attributes (bold)
    y += 9;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("•  Pensioengevend inkomen per jaar (op fulltime basis)", boxX + 8, y);
    doc.text(euro(pensioengevend), amountX, y, { align: "right" });

    y += 7;
    doc.text("•  Uw parttimepercentage", boxX + 8, y);
    doc.text(`${parttime}%`, amountX, y, { align: "right" });

    // Separator line
    y += 5;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(boxX + 8, y, boxX + boxW - 8, y);

    // Secondary attributes (normal)
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`•  Franchise ${selectedYear}`, boxX + 8, y);
    doc.text(euro(params.franchise), amountX, y, { align: "right" });

    y += 7;
    doc.text(`•  Pensioengrondslag (×${parttime}%)`, boxX + 8, y);
    doc.text(euro(grondslag), amountX, y, { align: "right" });

    y += 7;
    const premieLabel = `${(params.premiePercentage * 100).toFixed(1).replace(".", ",")}%`;
    doc.text(`•  Uw premie in ${selectedYear} (${premieLabel})`, boxX + 8, y);
    doc.text(euro(premie), amountX, y, { align: "right" });

    // Disclaimer
    const disclaimerText = "Deze rekentool is bedoeld als hulpmiddel om uw pensioengevend inkomen, pensioengrondslag en premie te berekenen. Vul deze tool daarom zo goed mogelijk in. Hoewel wij deze tool met veel zorg hebben ingericht, kunt u hieraan geen rechten ontlenen. U kunt alleen rechten ontlenen aan het geldende pensioenreglement. SPOA aanvaardt geen verantwoordelijkheid of aansprakelijkheid voor de werking, uitkomsten of gevolgen van het gebruik van deze tool.\n\nOp het gebruik van deze website is Nederlands recht toepasselijk.";
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    const disclaimerLines = doc.splitTextToSize(disclaimerText, 175);
    const pageHeight = doc.internal.pageSize.getHeight();
    const disclaimerY = pageHeight - 15 - (disclaimerLines.length * 3.5) - 5;
    doc.text(disclaimerLines, 20, disclaimerY);

    // Footer
    const now = new Date();
    const today = now.toLocaleDateString("nl-NL", { day: "2-digit", month: "long", year: "numeric" });
    const time = now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
    doc.text(`Gegenereerd op ${today} om ${time}`, 20, pageHeight - 12);

    doc.save(`PGI-Resultaat-${tabLabel.replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={!hasData}
      className="w-full mt-4 text-white font-semibold"
      style={{ backgroundColor: "rgb(76, 180, 212)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(60, 160, 192)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(76, 180, 212)")}
    >
      <Download className="h-4 w-4" />
      Download hier uw resultaat
    </Button>
  );
}

/* ───── Contact Form ───── */
function ContactForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);

  const hasAny = email.trim() || phone.trim() || question.trim();
  const emailInvalid = email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async () => {
    if (!hasAny || emailInvalid) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { email: email.trim(), phone: phone.trim(), question: question.trim() },
      });
      if (error) throw error;
      toast.success("Uw vraag is verzonden!");
      setEmail("");
      setPhone("");
      setQuestion("");
    } catch (err: any) {
      console.error(err);
      toast.error("Er ging iets mis bij het verzenden. Probeer het later opnieuw.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <p className="text-sm text-muted-foreground">
        Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met u op.
      </p>
      <div className="space-y-2">
        <div>
          <Label htmlFor="contact-email" className="text-sm mb-1.5 block">E-mailadres</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="uw@email.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailInvalid && (
            <p className="text-xs text-destructive mt-1">Vul een geldig e-mailadres in</p>
          )}
        </div>
        <div>
          <Label htmlFor="contact-phone" className="text-sm mb-1.5 block">Telefoonnummer</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="06-12345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contact-question" className="text-sm mb-1.5 block">Uw vraag</Label>
          <Textarea
            id="contact-question"
            placeholder="Stel hier uw vraag..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!hasAny || !!emailInvalid || sending}
        className="w-full sm:w-auto text-white hover:opacity-90"
        style={{ backgroundColor: 'rgb(76, 180, 212)' }}
      >
        <Send className="h-4 w-4" />
        {sending ? "Verzenden..." : "Verstuur"}
      </Button>
    </div>
  );
}

type FaqCategory = "algemeen" | "loondienst" | "dga" | "zelfstandig";

const faqItems: { q: string; a: string | React.ReactNode; categories: FaqCategory[] }[] = [
  { q: "Waarom moet ik als deelnemer zelf wijzigingen in mijn pensioengevend inkomen of parttimepercentage doorgeven?", a: "U bent zelf verantwoordelijk voor het aanleveren van juiste en tijdige gegevens. Dat is een kenmerk van een beroepspensioenfonds. Het fonds gebruikt deze informatie voor premieheffing en pensioenopbouw en kan uitgaan van eerdere of maximale waarden als gegevens ontbreken.", categories: ["algemeen"] },
  { q: "Waarom vul ik een fulltime inkomen in, terwijl ik parttime werk?", a: "Het fonds rekent met een fulltime pensioengevend inkomen om de pensioenopbouw uniform vast te stellen. Het parttimepercentage wordt daarna apart toegepast, zodat de uiteindelijke opbouw correct aansluit bij uw feitelijke arbeidsduur.", categories: ["algemeen"] },
  { q: "Hoe houdt SPOA rekening met mijn parttimepercentage als ik een fulltime inkomen moet invullen?", a: "Het fonds rekent met een fulltime pensioengevend inkomen om de pensioenopbouw uniform vast te stellen. De pensioengrondslag wordt berekend door het fulltime inkomen (en de franchise) te corrigeren met het parttimepercentage. Hiermee wordt de pensioenopbouw proportioneel afgestemd op uw parttimepercentage.", categories: ["algemeen"] },
  { q: "Hoe houdt SPOA rekening met tussentijds starten of stoppen?", a: "De premie en pensioenopbouw worden naar rato berekend over de maanden waarin u deelnemer bent. Start of einde gedurende een maand wordt administratief verwerkt per eerste dag van de daaropvolgende maand. U geeft uw pensioengevend inkomen, parttimepercentage en de juiste datum van starten of stoppen door via Mijn Apothekerspensioen.", categories: ["algemeen"] },
  { q: "Wat vul ik in bij onbetaald verlof?", a: "Tijdens onbetaald verlof vindt geen pensioenopbouw plaats. U geeft daarom geen pensioengevend inkomen op voor deze periode. De risicodekkingen lopen tijdelijk door.", categories: ["loondienst"] },
  { q: "Wat vul ik in bij gedeeltelijk betaald verlof?", a: "U vult het daadwerkelijk ontvangen pensioengevend inkomen in. De pensioenopbouw wordt gebaseerd op het feitelijk verdiende inkomen, rekening houdend met uw parttimepercentage.", categories: ["loondienst"] },
  { q: "Wat vul ik in als ik zowel in loondienst als DGA of zelfstandig ben?", a: "U kunt de tool gebruiken om voor beide rollen het pensioengevend inkomen apart te berekenen. U geeft vervolgens het totaal aan pensioengevend inkomen uit beide rollen op. Kijk daarvoor bij Wat valt wel en wat valt niet onder pensioengevend inkomen bij beide rollen. U geeft uw samengestelde pensioengevend inkomen en parttimepercentage door via Mijn Apothekerspensioen.", categories: ["dga", "zelfstandig"] },
  { q: "Wat vul ik in als ik zowel DGA als zelfstandig ben?", a: "U kunt de tool gebruiken om voor beide rollen het pensioengevend inkomen apart te berekenen. U geeft vervolgens het totaal aan pensioengevend inkomen uit beide rollen op. Kijk daarvoor bij Wat valt wel en wat valt niet onder pensioengevend inkomen bij beide rollen. U geeft uw samengestelde pensioengevend inkomen en parttimepercentage door via Mijn Apothekerspensioen.", categories: ["dga", "zelfstandig"] },
  { q: "Wat vul ik in als ik arbeidsongeschikt ben?", a: "U geeft het pensioengevend inkomen op dat gold vóór de eerste ziektedag. De verdere pensioenopbouw kan (gedeeltelijk) premievrij worden voortgezet op basis van de mate van arbeidsongeschiktheid. Om in aanmerking te komen voor premievrijstelling is het van belang dat u arbeidsongeschiktheid meldt aan het pensioenfonds via Mijn Apothekerspensioen.", categories: ["algemeen"] },
  { q: "Wat doe ik als ik gedeeltelijk arbeidsongeschikt ben?", a: "U geeft uw actuele situatie door aan SPOA, inclusief de mate van arbeidsongeschiktheid. Het fonds past de pensioenopbouw gedeeltelijk premievrij aan volgens de vastgestelde staffel. Om in aanmerking te komen voor gedeeltelijke vrijstelling is het van belang dat u gedeeltelijke arbeidsongeschiktheid meldt aan het pensioenfonds via Mijn Apothekerspensioen.", categories: ["algemeen"] },
  { q: "Waarom moet ik een jaarinkomen op basis van een volledig jaar opgeven als ik tussentijds ben gestart of gestopt?", a: "Het fonds werkt met jaarbedragen om een consistente pensioengrondslag te bepalen. De feitelijke pensioenopbouw wordt vervolgens automatisch naar rato van de deelnameperiode berekend.", categories: ["algemeen"] },
  { q: "Wat doe ik als ik wijzigingen uit het verleden wil doorgeven?", a: "Wijzigingen uit het nabije verleden (vanaf 1 januari 2025) kunt u doorgeven door het juiste pensioengevend inkomen en parttimepercentage voor de juiste periode te vermelden bij SPOA via Mijn Apothekerspensioen.\n\nU kunt wijzigingen uit een verder verleden (voor 1 januari 2025) ook doorgeven aan SPOA. Het fonds beoordeelt of en in hoeverre deze met terugwerkende kracht worden verwerkt, afhankelijk van de situatie en eventueel onderliggende bewijsstukken.", categories: ["algemeen"] },
  { q: "Wat doe ik als ik mijn werkgever heb gemachtigd voor het doorgeven van het pensioengevend inkomen en parttimepercentage?", a: "Uw werkgever kan de gegevens aanleveren, maar u blijft verantwoordelijk voor de juistheid. Controleer daarom periodiek of de aangeleverde gegevens correct zijn verwerkt.", categories: ["loondienst"] },
  { q: "Wat doe ik als ik nog geen 3 jaar zelfstandig ben?", a: "Als u nog geen 3 jaar zelfstandig bent, kunt u nog geen gebruikmaken van het inkomen van 3 jaar geleden.\n\nIn dat geval geeft u een schatting van uw pensioengevend inkomen voor het lopende jaar door. Deze schatting baseert u op uw verwachte winst uit onderneming, omgerekend naar een fulltime jaarinkomen.\n\nZodra uw definitieve inkomensgegevens beschikbaar zijn, kan SPOA uw pensioengevend inkomen en premie achteraf corrigeren.", categories: ["zelfstandig"] },
  { q: "Mijn vraag staat niet in de Q&A, wat kan ik doen?", a: <><p className="mb-4 text-sm text-muted-foreground">Geef uw vraag door via het invulveld. Wij zullen uw vraag dan voor u beantwoorden.</p><ContactForm /></>, categories: ["algemeen"] },
];

const YEAR_PARAMS: Record<number, { maxPensioengevend: number; franchise: number; premiePercentage: number }> = {
  2026: { maxPensioengevend: 113738, franchise: 19172, premiePercentage: 0.307 },
  2025: { maxPensioengevend: 0, franchise: 0, premiePercentage: 0 }, // placeholder — waarden later aanleveren
  2024: { maxPensioengevend: 0, franchise: 0, premiePercentage: 0 }, // placeholder — waarden later aanleveren
};
const AVAILABLE_YEARS = Object.keys(YEAR_PARAMS).map(Number).sort((a, b) => b - a);
const DEFAULT_YEAR = 2026;

function euro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function parseNum(val: string): number {
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

interface FieldDef {
  key: string;
  label: string;
  auto?: boolean;
  placeholder?: string;
}

/* ───── Info panels ───── */

const InfoLoondienst = () => (
  <Collapsible>
    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md bg-accent/60 px-4 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent">
      <Info className="h-4 w-4 shrink-0 text-primary" />
      <span>Wat telt wel en niet mee?</span>
      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="mt-2 space-y-3 rounded-md border bg-card p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">
          Alle onderdelen van het pensioengevend inkomen staan op uw loonstrook.
          Maar niet alles telt mee.
        </p>
        <div>
          <p className="mb-1 font-semibold text-destructive">Wat niet meetelt:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Incidentele bonussen of gratificaties</li>
            <li>Overwerkvergoedingen of onregelmatigheidstoeslagen</li>
            <li>Reis- en onkostenvergoedingen (ook niet als ze bruto worden uitgekeerd)</li>
            <li>Vergoedingen in natura (auto, telefoon, huisvesting)</li>
            <li>Nabetalingen of correcties over eerdere jaren</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-semibold text-foreground">Parttime</p>
          <p>
            Parttime werken verlaagt niet het pensioengevend inkomen; dit wordt
            altijd herleid naar fulltime. Wel betaalt u minder premie, omdat de
            premie wordt berekend over het parttime salaris. De pensioenopbouw
            blijft daarmee evenredig en eerlijk.
          </p>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

const InfoDGA = () => (
  <Collapsible>
    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md bg-accent/60 px-4 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent">
      <Info className="h-4 w-4 shrink-0 text-primary" />
      <span>Wat telt wel en niet mee?</span>
      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="mt-2 space-y-3 rounded-md border bg-card p-4 text-sm text-muted-foreground">
        <p className="text-foreground">
          Voor een DGA geldt als basis het gebruikelijk loon zoals bedoeld in de
          Wet op de loonbelasting. Dat loon moet daadwerkelijk als brutoloon zijn
          uitbetaald via de loonadministratie en zijn aangegeven bij de
          Belastingdienst.
        </p>
        <div>
          <p className="mb-1 font-semibold text-foreground">Wat telt mee:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Het gebruikelijk loon (of hoger feitelijk loon)</li>
            <li>Vakantiegeld (indien onderdeel van de loonafspraak)</li>
            <li>Structurele eindejaarsuitkering</li>
            <li>Vaste structurele toeslagen (management, bereikbaarheid)</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-semibold text-destructive">Wat telt niet mee:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Dividend of winstuitkeringen</li>
            <li>Reis- en onkostenvergoedingen</li>
            <li>Correcties of nabetalingen over eerdere jaren</li>
            <li>Inkomen dat niet via de loonadministratie loopt</li>
          </ul>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

const InfoZelfstandig = () => (
  <Collapsible>
    <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md bg-accent/60 px-4 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent">
      <Info className="h-4 w-4 shrink-0 text-primary" />
      <span>Wat telt wel en niet mee?</span>
      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div className="mt-2 space-y-3 rounded-md border bg-card p-4 text-sm text-muted-foreground">
        <div>
          <p className="mb-1 font-semibold text-foreground">Wat telt mee:</p>
          <p>
            De fiscaal vastgestelde winst uit onderneming voor zover deze
            betrekking heeft op werkzaamheden als openbaar apotheker en
            structureel is.
          </p>
        </div>
        <div>
          <p className="mb-1 font-semibold text-destructive">Wat telt niet mee:</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Inkomsten buiten het apothekersberoep</li>
            <li>Incidentele baten of boekwinsten</li>
            <li>Vermogensinkomsten</li>
            <li>Privé-onttrekkingen</li>
            <li>Fiscale correcties die geen structureel inkomen vormen</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-semibold text-foreground">Parttimegraad voorbeeld:</p>
          <p>
            U heeft 1.225 uur in jaar t-3 gewerkt. Uw parttimegraad bedraagt
            1.225 / 1.750 = 70%.
          </p>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
);

/* ───── Result block ───── */

function ResultBlock({
  pensioengevend,
  grondslag,
  premie,
  parttime,
  selectedYear,
  params,
}: {
  pensioengevend: number;
  grondslag: number;
  premie: number;
  parttime: number;
  selectedYear: number;
  params: { maxPensioengevend: number; franchise: number; premiePercentage: number };
}) {
  return (
    <div className="mt-6 space-y-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <CalcIcon className="h-5 w-5 text-primary" />
        Wijzigingen doorgeven
      </h3>
      <p className="text-sm text-muted-foreground">
        Na inloggen op{" "}
        <a
          href="https://mijn.apothekerspensioen.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          mijn apothekerspensioen
        </a>{" "}
        kunt u via de tegel Pensioengevend inkomen en parttimepercentage de onderstaande dik gedrukte gegevens invullen.
      </p>
      <div className="grid gap-2 text-sm">
        <Row
          label="Pensioengevend inkomen per jaar (op fulltime basis)"
          value={euro(pensioengevend)}
          hint={pensioengevend >= params.maxPensioengevend ? `(max. ${euro(params.maxPensioengevend)})` : undefined}
          bold
        />
        <Row label="Uw parttimepercentage" value={`${parttime}%`} bold />
        <div className="mt-3 pt-3 border-t">
          <div className="grid gap-2">
            <Row label={`Franchise ${selectedYear}`} value={euro(params.franchise)} />
            <Row
              label={`Pensioengrondslag (×${parttime}%)`}
              value={euro(grondslag)}
            />
            <Row label={`Uw premie in ${selectedYear} (${(params.premiePercentage * 100).toFixed(1).replace(".", ",")}%)`} value={euro(premie)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  hint,
  bold,
}: {
  label: string;
  value: string;
  hint?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={bold ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <div className="text-right">
        <span className={bold ? "text-lg font-bold text-primary" : "font-medium text-foreground"}>
          {value}
        </span>
        {hint && <span className="ml-1 text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

/* ───── Euro input ───── */

function EuroInput({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <Label htmlFor={id} className="text-sm flex-1 min-w-0">
        {label}
      </Label>
      <div className="relative w-full sm:w-2/5 sm:shrink-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          €
        </span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          className="pl-7"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? "0"}
        />
      </div>
    </div>
  );
}

/* ───── Euro input with period selector ───── */

function EuroInputWithPeriod({
  id,
  label,
  value,
  onChange,
  period,
  onPeriodChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  period: string;
  onPeriodChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <Label htmlFor={id} className="text-sm flex-1 min-w-0">
        {label}
      </Label>
      <div className="flex w-full sm:w-2/5 sm:shrink-0 gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
          <Input
            id={id}
            type="text"
            inputMode="decimal"
            className="pl-7"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "0"}
          />
        </div>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[100px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maand">Per maand</SelectItem>
            <SelectItem value="jaar">Per jaar</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PercentInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const numVal = parseNum(value);
  const isInvalid = value !== "" && (numVal <= 0 || numVal > 100);

  return (
    <div className="space-y-1">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor={id} className="text-sm flex-1 min-w-0">
          {label}
        </Label>
        <div className="relative w-full sm:w-2/5 sm:shrink-0">
          <Input
            id={id}
            type="text"
            inputMode="decimal"
            className={`pr-7 ${isInvalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </div>
      {isInvalid && (
        <p className="text-xs text-destructive text-right">
          Vul een percentage in tussen 1 en 100
        </p>
      )}
    </div>
  );
}

/* ───── Subtotal display ───── */
function Subtotaal({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted px-4 py-2 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{euro(value)}</span>
    </div>
  );
}

/* ───── Calculation helper ───── */
function calcResult(fulltimeIncome: number, parttimePct: number, params: { maxPensioengevend: number; franchise: number; premiePercentage: number }) {
  const pensioengevend = Math.min(fulltimeIncome, params.maxPensioengevend);
  const grondslagFull = Math.max(pensioengevend - params.franchise, 0);
  const grondslag = grondslagFull * (parttimePct / 100);
  const premie = grondslag * params.premiePercentage;
  return { pensioengevend, grondslag, premie };
}

/* ═══════════════════════════════════════════
   MAIN CALCULATOR COMPONENT
   ═══════════════════════════════════════════ */

export default function Calculator({ embedded = false }: { embedded?: boolean }) {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tab, setTab] = useState("loondienst");
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);

  const params = YEAR_PARAMS[selectedYear];

  const filteredFaq = faqItems
    .filter((item) => item.categories.includes("algemeen") || item.categories.includes(tab as FaqCategory))
    .filter((item) => item.q.toLowerCase().includes(faqSearch.toLowerCase()));

  const categoryLabel = tab === "loondienst" ? "In loondienst" : tab === "dga" ? "DGA" : "Zelfstandig";

  const activeForm = (
    <div>
      {tab === "loondienst" && <LoondienstForm selectedYear={selectedYear} params={params} />}
      {tab === "dga" && <DGAForm selectedYear={selectedYear} params={params} />}
      {tab === "zelfstandig" && <ZelfstandigForm selectedYear={selectedYear} params={params} />}
    </div>
  );

  const faqSection = (
    <div id="faq" className="mt-8 p-6 rounded-lg bg-muted/50 border">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5" />
        Veelgestelde vragen
      </h3>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek een vraag..."
          value={faqSearch}
          onChange={(e) => setFaqSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {filteredFaq.length === 0 ? (
        <p className="text-muted-foreground text-sm">Geen resultaten gevonden.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );

  const categories = [
    {
      id: "loondienst",
      label: "In Loondienst",
      description: "U bent in dienst bij een apotheek of organisatie en ontvangt maandelijks een salaris.",
      icon: Briefcase,
    },
    {
      id: "dga",
      label: "DGA",
      description: "U bent directeur-grootaandeelhouder van een BV waarin u als apotheker werkzaam bent.",
      icon: Building2,
    },
    {
      id: "zelfstandig",
      label: "Zelfstandig",
      description: "U bent zelfstandig gevestigd apotheker en uw inkomen komt uit winst uit onderneming.",
      icon: User,
    },
  ];

  if (showIntro) {
    const introContent = (
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <img src={spoaLogo} alt="SPOA logo" className="mx-auto h-10 mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Bereken uw pensioengevend inkomen</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Met deze tool kunt u uw pensioengevend inkomen en parttimepercentage berekenen.
            Na inloggen op Mijn Apothekerspensioen kunt u deze gegevens direct invullen via de tegel
            'Pensioengevend inkomen en parttimepercentage'. Kies hieronder uw situatie om te starten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center transition-all cursor-pointer hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/40"
                }`}
                style={isSelected ? { borderColor: "rgb(76, 180, 212)" } : undefined}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isSelected ? "rgb(76, 180, 212)" : undefined,
                    color: isSelected ? "white" : undefined,
                  }}
                >
                  <Icon className={`h-6 w-6 ${!isSelected ? "text-muted-foreground" : ""}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            disabled={!selectedCategory}
            onClick={() => {
              if (selectedCategory) {
                setTab(selectedCategory);
                setShowIntro(false);
              }
            }}
            className="px-8 text-white hover:opacity-90"
            style={{ backgroundColor: "rgb(76, 180, 212)" }}
          >
            Start berekening
          </Button>
        </div>
      </div>
    );

    if (embedded) {
      return <div className="mx-auto w-full max-w-2xl">{introContent}</div>;
    }

    return (
      <Card className="mx-auto w-full max-w-2xl shadow-lg">
        <CardContent className="p-8">{introContent}</CardContent>
      </Card>
    );
  }

   if (embedded) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative flex items-center justify-center mb-4">
          <span
            className="absolute left-0 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            onClick={() => setShowIntro(true)}
          >
            ← Terug
          </span>
          <img src={spoaLogo} alt="SPOA logo" className="h-8 cursor-pointer" onClick={() => setShowIntro(true)} />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: "rgb(76, 180, 212)" }}
          >
            {categoryLabel}
          </span>
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[90px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_YEARS.map((y) => (
                <SelectItem key={y} value={String(y)} disabled={YEAR_PARAMS[y].maxPensioengevend === 0}>
                  {y}{YEAR_PARAMS[y].maxPensioengevend === 0 ? " (soon)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {activeForm}
        {faqSection}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative flex items-center justify-center mb-4">
        <span
          className="absolute left-0 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          onClick={() => setShowIntro(true)}
        >
          ← Terug
        </span>
        <img src={spoaLogo} alt="SPOA logo" className="h-8 cursor-pointer" onClick={() => setShowIntro(true)} />
      </div>
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: "rgb(76, 180, 212)" }}
                >
                  {categoryLabel}
                </span>
                <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                  <SelectTrigger className="w-[90px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)} disabled={YEAR_PARAMS[y].maxPensioengevend === 0}>
                        {y}{YEAR_PARAMS[y].maxPensioengevend === 0 ? " (soon)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardTitle className="text-xl font-bold text-foreground">
                Bereken uw pensioengevend inkomen
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5">
                Bereken uw pensioengevend inkomen, pensioengrondslag en premie voor{" "}
                {selectedYear}.
              </p>
            </div>
            <button
              type="button"
              title="Veelgestelde vragen"
              onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
              className="shrink-0 mt-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-sm transition-colors cursor-pointer"
            >
              Q&A
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {activeForm}
          {faqSection}
          <div className="mt-6 pt-4 border-t text-xs text-muted-foreground space-y-2">
            <p>Deze rekentool is bedoeld als hulpmiddel om uw pensioengevend inkomen, pensioengrondslag en premie te berekenen. Vul deze tool daarom zo goed mogelijk in. Hoewel wij deze tool met veel zorg hebben ingericht, kunt u hieraan geen rechten ontlenen. U kunt alleen rechten ontlenen aan het geldende pensioenreglement. SPOA aanvaardt geen verantwoordelijkheid of aansprakelijkheid voor de werking, uitkomsten of gevolgen van het gebruik van deze tool.</p>
            <p>Op het gebruik van deze website is Nederlands recht toepasselijk.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ───── LOONDIENST FORM ───── */
type YearParams = { maxPensioengevend: number; franchise: number; premiePercentage: number };

function LoondienstForm({ selectedYear, params }: { selectedYear: number; params: YearParams }) {
  const [bruto, setBruto] = useState("");
  const [eindejaars, setEindejaars] = useState("");
  const [bonus, setBonus] = useState("");
  const [resultaat, setResultaat] = useState("");
  const [waarneming, setWaarneming] = useState("");
  const [management, setManagement] = useState("");
  const [vakantiegeld, setVakantiegeld] = useState("");
  const [parttime, setParttime] = useState("100");
  const [brutoPeriod, setBrutoPeriod] = useState("maand");

  const [eindejaarsperiod, setEindejaarsperiod] = useState("jaar");
  const [bonusPeriod, setBonusPeriod] = useState("jaar");
  const [resultaatPeriod, setResultaatPeriod] = useState("jaar");
  const [waarnemingPeriod, setWaarnemingPeriod] = useState("maand");
  const [managementPeriod, setManagementPeriod] = useState("maand");
  const [vakantiegeldPeriod, setVakantiegeldPeriod] = useState("jaar");

  const eindejaarsManual = useRef(false);
  const vakantiegeldManual = useRef(false);

  const autoVal = (yearAmount: number, period: string) => {
    const val = period === "maand" ? yearAmount / 12 : yearAmount;
    return val === 0 ? "" : val.toFixed(2).replace(".", ",");
  };

  const handleBrutoChange = (val: string) => {
    setBruto(val);
    const b = parseNum(val);
    const brutoYear = b * m(brutoPeriod);
    eindejaarsManual.current = false;
    vakantiegeldManual.current = false;
    setEindejaars(autoVal(brutoYear * 0.05, eindejaarsperiod));
    setVakantiegeld(autoVal(brutoYear * 0.08, vakantiegeldPeriod));
  };

  const handleBrutoPeriodChange = (p: string) => {
    setBrutoPeriod(p);
    const b = parseNum(bruto);
    const brutoYear = b * (p === "maand" ? 12 : 1);
    if (!eindejaarsManual.current) {
      setEindejaars(autoVal(brutoYear * 0.05, eindejaarsperiod));
    }
    if (!vakantiegeldManual.current) {
      setVakantiegeld(autoVal(brutoYear * 0.08, vakantiegeldPeriod));
    }
  };

  const handleEindejaarsPeriodChange = (p: string) => {
    setEindejaarsperiod(p);
    if (!eindejaarsManual.current) {
      const b = parseNum(bruto);
      const brutoYear = b * m(brutoPeriod);
      setEindejaars(autoVal(brutoYear * 0.05, p));
    }
  };

  const handleVakantiegeldPeriodChange = (p: string) => {
    setVakantiegeldPeriod(p);
    if (!vakantiegeldManual.current) {
      const b = parseNum(bruto);
      const brutoYear = b * m(brutoPeriod);
      setVakantiegeld(autoVal(brutoYear * 0.08, p));
    }
  };

  const handleEindejaarsChange = (val: string) => {
    eindejaarsManual.current = true;
    setEindejaars(val);
  };

  const handleVakantiegeldChange = (val: string) => {
    vakantiegeldManual.current = true;
    setVakantiegeld(val);
  };

  const brutoVal = parseNum(bruto);
  const eindejaarsVal = parseNum(eindejaars);
  const bonusVal = parseNum(bonus);
  const resultaatVal = parseNum(resultaat);
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const vakantiegeldVal = parseNum(vakantiegeld);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const m = (period: string) => (period === "maand" ? 12 : 1);

  const subtotaal1 =
    brutoVal * m(brutoPeriod) +
    eindejaarsVal * m(eindejaarsperiod) +
    bonusVal * m(bonusPeriod) +
    resultaatVal * m(resultaatPeriod) +
    waarnemingVal * m(waarnemingPeriod) +
    managementVal * m(managementPeriod);

  const subtotaal2 = subtotaal1 + vakantiegeldVal * m(vakantiegeldPeriod);

  // Herleid naar fulltime
  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;

  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal, params);

  return (
    <div className="space-y-4">
      <InfoLoondienst />

      <p className="text-xs text-muted-foreground italic">
        Houd uw loonstrookje bij de hand
      </p>

      <EuroInputWithPeriod
        id="ld-bruto"
        label={brutoPeriod === "maand" ? "Bruto maandinkomen" : "Bruto jaarinkomen"}
        value={bruto}
        onChange={handleBrutoChange}
        period={brutoPeriod}
        onPeriodChange={handleBrutoPeriodChange}
      />

      <EuroInputWithPeriod
        id="ld-eindejaars"
        label="Uw eindejaarsuitkering conform CAO (5%)"
        value={eindejaars}
        onChange={handleEindejaarsChange}
        period={eindejaarsperiod}
        onPeriodChange={handleEindejaarsPeriodChange}
      />

      <EuroInputWithPeriod
        id="ld-bonus"
        label="Bonus (indien onderdeel loonafspraak)"
        value={bonus}
        onChange={setBonus}
        period={bonusPeriod}
        onPeriodChange={setBonusPeriod}
        placeholder="0"
      />
      <EuroInputWithPeriod
        id="ld-resultaat"
        label="Resultaatafhankelijke beloning"
        value={resultaat}
        onChange={setResultaat}
        period={resultaatPeriod}
        onPeriodChange={setResultaatPeriod}
        placeholder="0"
      />
      <EuroInputWithPeriod
        id="ld-waarneming"
        label="Waarnemingstoeslag"
        value={waarneming}
        onChange={setWaarneming}
        period={waarnemingPeriod}
        onPeriodChange={setWaarnemingPeriod}
        placeholder="0"
      />
      <EuroInputWithPeriod
        id="ld-management"
        label="Management- of bereikbaarheidsvergoeding"
        value={management}
        onChange={setManagement}
        period={managementPeriod}
        onPeriodChange={setManagementPeriod}
        placeholder="0"
      />

      <Subtotaal label="Subtotaal (per jaar)" value={subtotaal1} />

      <EuroInputWithPeriod
        id="ld-vakantiegeld"
        label="Uw vakantiegeld (8%)"
        value={vakantiegeld}
        onChange={handleVakantiegeldChange}
        period={vakantiegeldPeriod}
        onPeriodChange={handleVakantiegeldPeriodChange}
      />

      <Subtotaal label="Totaal inclusief vakantiegeld" value={subtotaal2} />

      <PercentInput
        id="ld-parttime"
        label="Uw parttimepercentage"
        value={parttime}
        onChange={setParttime}
      />

      <ResultBlock
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
      <DownloadButton
        tabLabel="In loondienst"
        inputs={[
          { label: brutoPeriod === "maand" ? "Bruto maandinkomen" : "Bruto jaarinkomen", value: `${euro(brutoVal)} per ${brutoPeriod}` },
          { label: "Eindejaarsuitkering", value: `${euro(eindejaarsVal)} per ${eindejaarsperiod}` },
          { label: "Bonus", value: `${euro(bonusVal)} per ${bonusPeriod}` },
          { label: "Resultaatafhankelijke beloning", value: `${euro(resultaatVal)} per ${resultaatPeriod}` },
          { label: "Waarnemingstoeslag", value: `${euro(waarnemingVal)} per ${waarnemingPeriod}` },
          { label: "Managementvergoeding", value: `${euro(managementVal)} per ${managementPeriod}` },
          { label: "Vakantiegeld", value: `${euro(vakantiegeldVal)} per ${vakantiegeldPeriod}` },
          { label: "Parttimepercentage", value: `${parttimeVal}%` },
        ]}
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
    </div>
  );
}

/* ───── DGA FORM ───── */
function DGAForm({ selectedYear, params }: { selectedYear: number; params: YearParams }) {
  const [bruto, setBruto] = useState("");
  const [eindejaars, setEindejaars] = useState("");
  const [resultaat, setResultaat] = useState("");
  const [waarneming, setWaarneming] = useState("");
  const [management, setManagement] = useState("");
  const [vakantiegeld, setVakantiegeld] = useState("");
  const [parttime, setParttime] = useState("100");

  const [brutoPeriod, setBrutoPeriod] = useState("jaar");
  const [eindejaarsPeriod, setEindejaarsPeriod] = useState("jaar");
  const [resultaatPeriod, setResultaatPeriod] = useState("jaar");
  const [waarnemingPeriod, setWaarnemingPeriod] = useState("jaar");
  const [managementPeriod, setManagementPeriod] = useState("jaar");
  const [vakantiegeldPeriod, setVakantiegeldPeriod] = useState("jaar");

  const brutoVal = parseNum(bruto);
  const eindejaarsVal = parseNum(eindejaars);
  const resultaatVal = parseNum(resultaat);
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const vakantiegeldVal = parseNum(vakantiegeld);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const m = (period: string) => (period === "maand" ? 12 : 1);

  const subtotaal1 =
    brutoVal * m(brutoPeriod) +
    eindejaarsVal * m(eindejaarsPeriod) +
    resultaatVal * m(resultaatPeriod) +
    waarnemingVal * m(waarnemingPeriod) +
    managementVal * m(managementPeriod);
  const subtotaal2 = subtotaal1 + vakantiegeldVal * m(vakantiegeldPeriod);

  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal, params);

  return (
    <div className="space-y-4">
      <InfoDGA />

      <EuroInputWithPeriod
        id="dga-bruto"
        label="Fiscaal vastgestelde bruto loon"
        value={bruto}
        onChange={setBruto}
        period={brutoPeriod}
        onPeriodChange={setBrutoPeriod}
      />
      <EuroInputWithPeriod
        id="dga-eindejaars"
        label="Structurele eindejaarsuitkering"
        value={eindejaars}
        onChange={setEindejaars}
        period={eindejaarsPeriod}
        onPeriodChange={setEindejaarsPeriod}
      />
      <EuroInputWithPeriod
        id="dga-resultaat"
        label="Resultaatafhankelijke beloning"
        value={resultaat}
        onChange={setResultaat}
        period={resultaatPeriod}
        onPeriodChange={setResultaatPeriod}
      />
      <EuroInputWithPeriod
        id="dga-waarneming"
        label="Waarnemingstoeslag"
        value={waarneming}
        onChange={setWaarneming}
        period={waarnemingPeriod}
        onPeriodChange={setWaarnemingPeriod}
      />
      <EuroInputWithPeriod
        id="dga-management"
        label="Management- of bereikbaarheidsvergoeding"
        value={management}
        onChange={setManagement}
        period={managementPeriod}
        onPeriodChange={setManagementPeriod}
      />

      <Subtotaal label="Subtotaal (per jaar)" value={subtotaal1} />

      <EuroInputWithPeriod
        id="dga-vakantiegeld"
        label="Vakantiegeld (indien onderdeel loonafspraak)"
        value={vakantiegeld}
        onChange={setVakantiegeld}
        period={vakantiegeldPeriod}
        onPeriodChange={setVakantiegeldPeriod}
      />

      <Subtotaal label="Totaal inclusief vakantiegeld" value={subtotaal2} />

      <PercentInput
        id="dga-parttime"
        label="Uw parttimepercentage"
        value={parttime}
        onChange={setParttime}
      />

      <ResultBlock
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
      <DownloadButton
        tabLabel="DGA"
        inputs={[
          { label: "Bruto loon", value: `${euro(brutoVal)} per ${brutoPeriod}` },
          { label: "Eindejaarsuitkering", value: `${euro(eindejaarsVal)} per ${eindejaarsPeriod}` },
          { label: "Resultaatafhankelijke beloning", value: `${euro(resultaatVal)} per ${resultaatPeriod}` },
          { label: "Waarnemingstoeslag", value: `${euro(waarnemingVal)} per ${waarnemingPeriod}` },
          { label: "Managementvergoeding", value: `${euro(managementVal)} per ${managementPeriod}` },
          { label: "Vakantiegeld", value: `${euro(vakantiegeldVal)} per ${vakantiegeldPeriod}` },
          { label: "Parttimepercentage", value: `${parttimeVal}%` },
        ]}
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
    </div>
  );
}

/* ───── ZELFSTANDIG FORM ───── */
function ZelfstandigForm({ selectedYear, params }: { selectedYear: number; params: YearParams }) {
  const [winst, setWinst] = useState("");
  const [resultaat, setResultaat] = useState("");
  const [parttime, setParttime] = useState("100");

  const winstVal = parseNum(winst);
  const resultaatVal = parseNum(resultaat);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const totaalInkomen = winstVal + resultaatVal;
  const fulltimeIncome = parttimeVal > 0 ? totaalInkomen / (parttimeVal / 100) : totaalInkomen;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal, params);

  return (
    <div className="space-y-4">
      <InfoZelfstandig />

      <EuroInput
        id="za-winst"
        label="Winst uit onderneming van drie jaar geleden, vóór toepassing van de oudedagsreserve en de ondernemersaftrek"
        value={winst}
        onChange={setWinst}
      />

      <EuroInput
        id="za-resultaat"
        label="Resultaatafhankelijke beloning"
        value={resultaat}
        onChange={setResultaat}
      />

      <PercentInput
        id="za-parttime"
        label="Uw parttimepercentage"
        value={parttime}
        onChange={setParttime}
      />

      <ResultBlock
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
      <DownloadButton
        tabLabel="Zelfstandig"
        inputs={[
          { label: "Winst uit onderneming", value: euro(winstVal) },
          { label: "Resultaatafhankelijke beloning", value: euro(resultaatVal) },
          { label: "Parttimepercentage", value: `${parttimeVal}%` },
        ]}
        pensioengevend={pensioengevend}
        grondslag={grondslag}
        premie={premie}
        parttime={parttimeVal}
        selectedYear={selectedYear}
        params={params}
      />
    </div>
  );
}
