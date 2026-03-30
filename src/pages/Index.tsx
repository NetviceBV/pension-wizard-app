import { useState } from "react";
import Calculator from "@/components/Calculator";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Search } from "lucide-react";

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

const Index = () => {
  const [search, setSearch] = useState("");

  const filtered = faqItems.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4">

      <Calculator />

      <div id="faq" className="w-full max-w-2xl mt-12 mb-8">
        <h2 className="text-xl font-semibold mb-4">Veelgestelde vragen</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek een vraag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">Geen resultaten gevonden.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Index;
