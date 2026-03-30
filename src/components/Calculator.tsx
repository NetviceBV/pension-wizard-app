import { useState, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown, Info, Calculator as CalcIcon, Search, HelpCircle } from "lucide-react";

const faqItems = [
  { q: "Waarom vul ik een voltijdssalaris in, terwijl ik parttime werk?", a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
  { q: "Hoe houdt SPOA rekening met mijn parttimepercentage als ik een fulltime inkomen moet invullen?", a: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident." },
  { q: "Hoe houdt SPOA rekening met tussentijds starten of stoppen?", a: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur." },
  { q: "Wat vul ik in bij onbetaald verlof?", a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." },
  { q: "Wat vul ik in bij gedeeltelijk betaald verlof?", a: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt." },
  { q: "Wat als ik zowel loondienst als dga of zelfstandig ben?", a: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat." },
  { q: "Wat vul ik in als ik zowel dga als zelfstandig ben?", a: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores." },
  { q: "Wat vul ik in als ik arbeidsongeschikt ben?", a: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus." },
  { q: "Wat doe ik als ik gedeeltelijk arbeidsongeschikt ben?", a: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae." },
  { q: "Waarom moet ik een jaarsalaris op basis van een volledig jaar opgeven als ik tussentijds ben gestart of gestopt?", a: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat." },
  { q: "Wat doe ik als ik wijzigingen uit het verleden wil doorgeven?", a: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa." },
  { q: "Waarom moet ik als deelnemer zelf wijzigingen in mijn PGI of PT% doorgeven?", a: "Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae." },
  { q: "Wat doe ik als in mijn werkgever heb gemachtigd voor het doorgeven van het PGI en PT%?", a: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
  { q: "Mijn vraag staat niet in de q en a, wat kan ik doen?", a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nunc egestas nisi." },
];

const MAX_PENSIOENGEVEND = 113738;
const FRANCHISE_2026 = 19172;
const PREMIE_PERCENTAGE = 0.307;

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
            <li>Onkostenvergoedingen (ook niet als ze bruto worden uitgekeerd)</li>
            <li>Vergoedingen in natura (auto, telefoon, huisvesting)</li>
            <li>Resultaatafhankelijke beloningen die niet structureel zijn</li>
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
            <li>Incidentele of resultaatafhankelijke bonussen</li>
            <li>Onkostenvergoedingen</li>
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
}: {
  pensioengevend: number;
  grondslag: number;
  premie: number;
  parttime: number;
}) {
  return (
    <div className="mt-6 space-y-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <CalcIcon className="h-5 w-5 text-primary" />
        Resultaat
      </h3>
      <div className="grid gap-2 text-sm">
        <Row
          label="Pensioengevend inkomen per jaar (op fulltime basis)"
          value={euro(pensioengevend)}
          hint={pensioengevend >= MAX_PENSIOENGEVEND ? `(max. ${euro(MAX_PENSIOENGEVEND)})` : undefined}
        />
        <Row label="Franchise 2026" value={euro(FRANCHISE_2026)} />
        <Row
          label={`Pensioengrondslag (×${parttime}%)`}
          value={euro(grondslag)}
        />
        <div className="border-t pt-2">
          <Row
            label="Uw premie in 2026 (30,7%)"
            value={euro(premie)}
            bold
          />
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
function calcResult(fulltimeIncome: number, parttimePct: number) {
  const pensioengevend = Math.min(fulltimeIncome, MAX_PENSIOENGEVEND);
  const grondslagFull = Math.max(pensioengevend - FRANCHISE_2026, 0);
  const grondslag = grondslagFull * (parttimePct / 100);
  const premie = grondslag * PREMIE_PERCENTAGE;
  return { pensioengevend, grondslag, premie };
}

/* ═══════════════════════════════════════════
   MAIN CALCULATOR COMPONENT
   ═══════════════════════════════════════════ */

export default function Calculator({ embedded = false }: { embedded?: boolean }) {
  const [tab, setTab] = useState("loondienst");
  const [faqSearch, setFaqSearch] = useState("");

  const filteredFaq = faqItems.filter((item) =>
    item.q.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const tabs = (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-6 grid w-full grid-cols-3">
        <TabsTrigger value="loondienst" className="text-xs sm:text-sm">
          In loondienst
        </TabsTrigger>
        <TabsTrigger value="dga" className="text-xs sm:text-sm">
          DGA
        </TabsTrigger>
        <TabsTrigger value="zelfstandig" className="text-xs sm:text-sm">
          Zelfstandig
        </TabsTrigger>
      </TabsList>

      <TabsContent value="loondienst">
        <LoondienstForm />
      </TabsContent>
      <TabsContent value="dga">
        <DGAForm />
      </TabsContent>
      <TabsContent value="zelfstandig">
        <ZelfstandigForm />
      </TabsContent>
    </Tabs>
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

  if (embedded) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        {tabs}
        {faqSection}
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Pensioengevend Inkomen Tool
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1.5">
              Bereken uw pensioengevend inkomen, pensioengrondslag en premie voor
              2026.
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
        {tabs}
        {faqSection}
      </CardContent>
    </Card>
  );
}

/* ───── LOONDIENST FORM ───── */
function LoondienstForm() {
  const [bruto, setBruto] = useState("");
  const [eindejaars, setEindejaars] = useState("");
  const [bonus, setBonus] = useState("");
  const [waarneming, setWaarneming] = useState("");
  const [management, setManagement] = useState("");
  const [vakantiegeld, setVakantiegeld] = useState("");
  const [parttime, setParttime] = useState("100");

  const [eindejaarsperiod, setEindejaarsperiod] = useState("jaar");
  const [bonusPeriod, setBonusPeriod] = useState("jaar");
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
    eindejaarsManual.current = false;
    vakantiegeldManual.current = false;
    setEindejaars(autoVal(b * 12 * 0.05, eindejaarsperiod));
    setVakantiegeld(autoVal(b * 12 * 0.08, vakantiegeldPeriod));
  };

  const handleEindejaarsPeriodChange = (p: string) => {
    setEindejaarsperiod(p);
    if (!eindejaarsManual.current) {
      const b = parseNum(bruto);
      setEindejaars(autoVal(b * 12 * 0.05, p));
    }
  };

  const handleVakantiegeldPeriodChange = (p: string) => {
    setVakantiegeldPeriod(p);
    if (!vakantiegeldManual.current) {
      const b = parseNum(bruto);
      setVakantiegeld(autoVal(b * 12 * 0.08, p));
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
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const vakantiegeldVal = parseNum(vakantiegeld);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const m = (period: string) => (period === "maand" ? 12 : 1);

  const subtotaal1 =
    brutoVal * 12 +
    eindejaarsVal * m(eindejaarsperiod) +
    bonusVal * m(bonusPeriod) +
    waarnemingVal * m(waarnemingPeriod) +
    managementVal * m(managementPeriod);

  const subtotaal2 = subtotaal1 + vakantiegeldVal * m(vakantiegeldPeriod);

  // Herleid naar fulltime
  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;

  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

  return (
    <div className="space-y-4">
      <InfoLoondienst />

      <p className="text-xs text-muted-foreground italic">
        Houd uw loonstrookje bij de hand
      </p>

      <EuroInput
        id="ld-bruto"
        label="Bruto maandinkomen"
        value={bruto}
        onChange={handleBrutoChange}
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
        label="Vaste bonus (indien onderdeel loonafspraak)"
        value={bonus}
        onChange={setBonus}
        period={bonusPeriod}
        onPeriodChange={setBonusPeriod}
        placeholder="0"
      />
      <EuroInputWithPeriod
        id="ld-waarneming"
        label="Vaste waarnemingstoeslag"
        value={waarneming}
        onChange={setWaarneming}
        period={waarnemingPeriod}
        onPeriodChange={setWaarnemingPeriod}
        placeholder="0"
      />
      <EuroInputWithPeriod
        id="ld-management"
        label="Vaste management- of bereikbaarheidsvergoeding"
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
      />
    </div>
  );
}

/* ───── DGA FORM ───── */
function DGAForm() {
  const [bruto, setBruto] = useState("");
  const [eindejaars, setEindejaars] = useState("");
  const [waarneming, setWaarneming] = useState("");
  const [management, setManagement] = useState("");
  const [vakantiegeld, setVakantiegeld] = useState("");
  const [parttime, setParttime] = useState("100");

  const [brutoPeriod, setBrutoPeriod] = useState("jaar");
  const [eindejaarsPeriod, setEindejaarsPeriod] = useState("jaar");
  const [waarnemingPeriod, setWaarnemingPeriod] = useState("jaar");
  const [managementPeriod, setManagementPeriod] = useState("jaar");
  const [vakantiegeldPeriod, setVakantiegeldPeriod] = useState("jaar");

  const brutoVal = parseNum(bruto);
  const eindejaarsVal = parseNum(eindejaars);
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const vakantiegeldVal = parseNum(vakantiegeld);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const m = (period: string) => (period === "maand" ? 12 : 1);

  const subtotaal1 =
    brutoVal * m(brutoPeriod) +
    eindejaarsVal * m(eindejaarsPeriod) +
    waarnemingVal * m(waarnemingPeriod) +
    managementVal * m(managementPeriod);
  const subtotaal2 = subtotaal1 + vakantiegeldVal * m(vakantiegeldPeriod);

  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

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
        id="dga-waarneming"
        label="Vaste waarnemingstoeslag"
        value={waarneming}
        onChange={setWaarneming}
        period={waarnemingPeriod}
        onPeriodChange={setWaarnemingPeriod}
      />
      <EuroInputWithPeriod
        id="dga-management"
        label="Vaste management- of bereikbaarheidsvergoeding"
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
      />
    </div>
  );
}

/* ───── ZELFSTANDIG FORM ───── */
function ZelfstandigForm() {
  const [winst, setWinst] = useState("");
  const [parttime, setParttime] = useState("100");

  const winstVal = parseNum(winst);
  const parttimeVal = Math.min(Math.max(parseNum(parttime) || 100, 1), 100);

  const fulltimeIncome = parttimeVal > 0 ? winstVal / (parttimeVal / 100) : winstVal;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

  return (
    <div className="space-y-4">
      <InfoZelfstandig />

      <EuroInput
        id="za-winst"
        label="Winst uit onderneming van drie jaar geleden, vóór toepassing van de oudedagsreserve en de ondernemersaftrek"
        value={winst}
        onChange={setWinst}
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
      />
    </div>
  );
}
