import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Info, Calculator as CalcIcon } from "lucide-react";

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
          label="Pensioengevend inkomen per jaar"
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
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          €
        </span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          className="pl-7"
          value={disabled ? value : value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? "0"}
        />
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
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          className="pr-7"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="100"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
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

export default function Calculator() {
  const [tab, setTab] = useState("loondienst");

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          Pensioengevend Salaris Calculator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bereken uw pensioengevend inkomen, pensioengrondslag en premie voor
          2026.
        </p>
      </CardHeader>
      <CardContent>
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
  const [parttime, setParttime] = useState("100");

  const brutoVal = parseNum(bruto);
  const eindejaarsVal = parseNum(eindejaars);
  const bonusVal = parseNum(bonus);
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const parttimeVal = parseNum(parttime) || 100;

  // All inputs are monthly → convert to yearly where needed
  // bruto is monthly, eindejaars is yearly, rest are monthly
  const subtotaal1 =
    brutoVal * 12 + eindejaars + bonusVal * 12 + waarnemingVal * 12 + managementVal * 12;

  const vakantiegeld = subtotaal1 * 0.08;
  const subtotaal2 = subtotaal1 + vakantiegeld;

  // Herleid naar fulltime
  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;

  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

  const hasInput = brutoVal > 0;

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
        onChange={setBruto}
      />

      <Subtotaal
        label="Eindejaarsuitkering conform CAO (5%)"
        value={eindejaars}
      />

      <EuroInput
        id="ld-bonus"
        label="Vaste bonus (indien onderdeel loonafspraak) — per maand"
        value={bonus}
        onChange={setBonus}
        placeholder="0"
      />
      <EuroInput
        id="ld-waarneming"
        label="Vaste waarnemingstoeslag — per maand"
        value={waarneming}
        onChange={setWaarneming}
        placeholder="0"
      />
      <EuroInput
        id="ld-management"
        label="Vaste management- of bereikbaarheidsvergoeding — per maand"
        value={management}
        onChange={setManagement}
        placeholder="0"
      />

      <Subtotaal label="Subtotaal (per jaar)" value={subtotaal1} />

      <Subtotaal label="Vakantiegeld (8%)" value={vakantiegeld} />

      <Subtotaal label="Subtotaal inclusief vakantiegeld" value={subtotaal2} />

      <PercentInput
        id="ld-parttime"
        label="Uw parttimepercentage"
        value={parttime}
        onChange={setParttime}
      />

      {hasInput && (
        <ResultBlock
          pensioengevend={pensioengevend}
          grondslag={grondslag}
          premie={premie}
          parttime={parttimeVal}
        />
      )}
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

  const brutoVal = parseNum(bruto);
  const eindejaarsVal = parseNum(eindejaars);
  const waarnemingVal = parseNum(waarneming);
  const managementVal = parseNum(management);
  const vakantiegeldVal = parseNum(vakantiegeld);
  const parttimeVal = parseNum(parttime) || 100;

  const subtotaal1 = brutoVal + eindejaarsVal + waarnemingVal + managementVal;
  const subtotaal2 = subtotaal1 + vakantiegeldVal;

  const fulltimeIncome = parttimeVal > 0 ? subtotaal2 / (parttimeVal / 100) : subtotaal2;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

  const hasInput = brutoVal > 0;

  return (
    <div className="space-y-4">
      <InfoDGA />

      <EuroInput
        id="dga-bruto"
        label="Fiscaal vastgestelde bruto loon (per jaar)"
        value={bruto}
        onChange={setBruto}
      />
      <EuroInput
        id="dga-eindejaars"
        label="Structurele eindejaarsuitkering (per jaar)"
        value={eindejaars}
        onChange={setEindejaars}
      />
      <EuroInput
        id="dga-waarneming"
        label="Vaste waarnemingstoeslag (per jaar)"
        value={waarneming}
        onChange={setWaarneming}
      />
      <EuroInput
        id="dga-management"
        label="Vaste management- of bereikbaarheidsvergoeding (per jaar)"
        value={management}
        onChange={setManagement}
      />

      <Subtotaal label="Subtotaal" value={subtotaal1} />

      <EuroInput
        id="dga-vakantiegeld"
        label="Vakantiegeld (indien onderdeel loonafspraak, per jaar)"
        value={vakantiegeld}
        onChange={setVakantiegeld}
      />

      <Subtotaal label="Subtotaal inclusief vakantiegeld" value={subtotaal2} />

      <PercentInput
        id="dga-parttime"
        label="Uw parttimepercentage"
        value={parttime}
        onChange={setParttime}
      />

      {hasInput && (
        <ResultBlock
          pensioengevend={pensioengevend}
          grondslag={grondslag}
          premie={premie}
          parttime={parttimeVal}
        />
      )}
    </div>
  );
}

/* ───── ZELFSTANDIG FORM ───── */
function ZelfstandigForm() {
  const [winst, setWinst] = useState("");
  const [parttime, setParttime] = useState("100");

  const winstVal = parseNum(winst);
  const parttimeVal = parseNum(parttime) || 100;

  const fulltimeIncome = parttimeVal > 0 ? winstVal / (parttimeVal / 100) : winstVal;
  const { pensioengevend, grondslag, premie } = calcResult(fulltimeIncome, parttimeVal);

  const hasInput = winstVal > 0;

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

      {hasInput && (
        <ResultBlock
          pensioengevend={pensioengevend}
          grondslag={grondslag}
          premie={premie}
          parttime={parttimeVal}
        />
      )}
    </div>
  );
}
