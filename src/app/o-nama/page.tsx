import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { PhotoBand } from "@/components/ui/PhotoBand";
import { ArrowLink, Eyebrow, FactsLedger } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";
import { MillIllustration } from "@/components/ui/Illustrations";
import { BAKERY_FACTS, CERTIFICATIONS, MILESTONES, MILL_FACTS } from "@/content/site";

export const metadata = pageMeta(
  "/o-nama/",
  "O nama",
  "Mlinpek d.d. Bugojno — od zrna do kruha, s ljubavlju, znanjem i tradicijom kvalitete od 1957. godine.",
);

/** One chapter: a large photograph and a short text beside it. Facts render only when verified. */
function Chapter({
  id,
  label,
  title,
  photo,
  flip,
  facts = [],
  children,
}: {
  id: string;
  label: string;
  title: string;
  photo: PhotoId;
  flip?: boolean;
  facts?: { value: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
        <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
          <Photo id={photo} ratio="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" reveal parallax />
        </div>
        <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`} data-reveal-group>
          <p className="label text-wheat-deep" data-reveal>{label}</p>
          <h2 id={`${id}-title`} className="subtitle mt-5" data-reveal>{title}</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-charcoal/70" data-reveal>{children}</div>
        </div>
      </div>
      <FactsLedger facts={facts} className="mt-14" />
    </section>
  );
}

export default function ONamaPage() {
  return (
    <main id="sadrzaj">
      <PageHero
        tone="paper"
        label="O nama"
        title={
          <>
            Sve počinje <span className="italic text-wheat-deep">jednim zrnom.</span>
          </>
        }
        lede={<p>Mlin, pekarska proizvodnja i pekare dio su iste cjeline. Kada je cijeli put u jednim rukama, kvaliteta se ne prepušta slučaju.</p>}
        photo="prod-hall-mlinpek"
      />

      {/* Story — the client's text "Tekst za rubriku O NAMA" (typographic fixes only) */}
      <Section tone="paper" labelledBy="prica-title" className="!pt-0">
        <div className="grid gap-8 border-t border-charcoal/15 pt-16 md:grid-cols-12 md:gap-8 md:pt-24">
          <div className="md:col-span-4">
            <Eyebrow>Mlinpek d.d. Bugojno</Eyebrow>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 id="prica-title" className="subtitle max-w-[26ch]" data-reveal>
              Od zrna do kruha – ljubavlju, znanjem i tradicijom kvalitete od 1957. godine
            </h2>
            <div className="measure mt-8 space-y-5 leading-relaxed text-charcoal/75" data-reveal>
              <p className="lede text-charcoal/80">
                Priča kompanije Mlinpek d.d. Bugojno započela je davne 1957. godine, s jasnom vizijom stvaranja vrhunskih žitnih i
                pekarskih proizvoda koji će biti temelj svakodnevne trpeze.
              </p>
              <p>
                Tokom skoro sedam decenija postojanja, naša mlinska i pekarska industrija prošla je kroz različite faze rasta, mijenjajući
                organizacijske oblike, ali nikada ne odstupajući od onoga što nas čini prepoznatljivima – beskompromisne kvalitete i
                predanosti poslu.
              </p>
              <p>
                Još tokom devedesetih godina prošlog stoljeća, Mlinpek je izrastao u jedan od ključnih privrednih stubova u regiji.
                Razvijajući proizvodne, prodajne i skladišne kapacitete, kompanija se pozicionirala kao jedan od najznačajnijih
                privrednih subjekata u Bosni i Hercegovini i tadašnjoj Jugoslaviji.
              </p>
            </div>

            <h3 className="mt-16 font-display text-[1.9rem] leading-tight md:mt-20" data-reveal>
              Nova era razvoja i modernizacije
            </h3>
            <div className="measure mt-6 space-y-5 leading-relaxed text-charcoal/75" data-reveal>
              <p>
                Nakon procesa privatizacije započetog 2007. godine, kompanija je prošla kroz period transformacije koji je rezultirao
                stabilnom i snažnom vlasničkom strukturom.
              </p>
              <p>
                Od 2021. godine otvoreno je najdinamičnije investicijsko poglavlje u poslijeratnoj historiji kompanije. Pokrenuli smo
                sveobuhvatan investicijski ciklus, usmjeren na potpunu modernizaciju pogona, automatizaciju procesa, izgradnju novih
                proizvodnih kapaciteta i nabavku najsavremenije tehnologije.
              </p>
              <p>
                Danas je Mlinpek d.d. Bugojno mnogo više od klasične prehrambene industrije. Mi smo mjesto gdje se susreću skoro sedam
                decenija dugo iskustvo, vrhunska tehnologija i energija naših zaposlenika. Svjesni odgovornosti koju nosi proizvodnja
                brašna i pekarskih proizvoda – kao početka svakog kvalitetnog obroka – s maksimalnom profesionalnošću pratimo svaki
                korak, čuvajući tradiciju bosanskohercegovačkog mlinarstva i donoseći inovacije po mjeri savremenog kupca.
              </p>
            </div>
          </div>
        </div>

        {MILESTONES.length > 0 && (
          <ol className="mt-20 grid gap-px border-y border-charcoal/15 bg-charcoal/15 sm:grid-cols-2 lg:grid-cols-4 md:mt-28" aria-label="Kroz godine">
            {MILESTONES.map((m) => (
              <li key={m.year} className="bg-paper py-8 sm:px-6 sm:first:pl-0 lg:py-10" data-reveal>
                <p className="font-display text-[2.6rem] leading-none text-wheat-deep tabular">{m.year}</p>
                <p className="mt-4 font-display text-xl">{m.title}</p>
                {m.text && <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-charcoal/60">{m.text}</p>}
              </li>
            ))}
          </ol>
        )}

        <figure className="mx-auto mt-20 max-w-[34ch] text-center md:mt-28" data-reveal>
          <blockquote className="font-display text-[1.9rem] leading-snug md:text-[2.4rem]">
            Na kraju svakog radnog dana, naša misija ostaje ista kao i prvog dana: <span className="italic text-wheat-deep">od zrna do kruha</span> – s ljubavlju, znanjem i tradicijom.
          </blockquote>
        </figure>
      </Section>

      <Section tone="ivory" labelledBy="mlin-title">
        <div className="space-y-24 md:space-y-36">
          <Chapter id="mlin" label="Naš mlin" title="Brašno koje sami meljemo." photo="mill-painting" facts={MILL_FACTS}>
            <p>
              Zrno se prije mljevenja čisti i provjerava, a mljevenje se vodi kontrolirano, serija za serijom. Tako nastaje brašno
              ujednačene kvalitete — isto ono koje koriste naši pekari.
            </p>
          </Chapter>
          <Chapter id="proizvodnja" label="Pekarska proizvodnja" title="Zanat, svakoga jutra." photo="prod-line-mlinpek" flip facts={BAKERY_FACTS}>
            <p>
              Naši pekari spajaju provjerene recepture s pažnjom za svaki detalj. Tijesto dobiva vrijeme koje mu treba, a kruh iz peći
              odlazi ravno u naše pekare i do partnera.
            </p>
          </Chapter>
        </div>

        {/* the plant, first-hand — the client's own photographs */}
        <div className="mt-24 md:mt-36" aria-labelledby="pogon-title" role="region">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="label text-wheat-deep">Naš pogon</p>
              <h2 id="pogon-title" className="subtitle mt-5" data-reveal>
                Iz prve ruke: <span className="italic text-wheat-deep">gdje nastaje naš kruh.</span>
              </h2>
            </div>
            <p className="measure leading-relaxed text-charcoal/70 md:col-span-4 md:col-start-9" data-reveal>
              Miješalice, linije za oblikovanje tijesta i peći u našoj pekarskoj proizvodnji — i ljudi koji s njima rade
              svakoga dana.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:mt-16 md:grid-cols-12">
            {(
              [
                ["prod-hall-2", "col-span-2 aspect-[4/3] md:col-span-8 md:aspect-[16/10]"],
                ["prod-racks", "aspect-[4/5] md:col-span-4 md:aspect-[4/5]"],
                ["prod-rolls", "aspect-[4/5] md:col-span-4 md:aspect-square"],
                ["prod-fortuna-line", "aspect-[4/5] md:col-span-4 md:aspect-square"],
                ["prod-dough", "aspect-[4/5] md:col-span-4 md:aspect-square"],
                ["prod-donuts", "aspect-[4/5] md:col-span-5 md:aspect-[4/5]"],
                ["prod-kornfeil", "col-span-2 aspect-[4/3] md:col-span-7 md:aspect-[28/25]"],
              ] as [PhotoId, string][]
            ).map(([id, cls]) => (
              <li key={id} className={`relative ${cls}`}>
                <Photo id={id} fill sizes="(min-width: 768px) 60vw, 50vw" />
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="mt-16 flex justify-center overflow-hidden md:mt-24">
            <MillIllustration className="w-[max(100%,760px)] max-w-[1100px] shrink-0 text-wheat-deep opacity-50" />
          </div>
        </div>
      </Section>

      <PhotoBand id="prod-hall-3" align="left">
        Nova tehnologija. Ista posvećenost.
      </PhotoBand>

      <Section tone="paper" id="kvaliteta" labelledBy="kvaliteta-title">
        <div className="grid gap-12 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-6">
            <Eyebrow>Kvaliteta</Eyebrow>
            <h2 id="kvaliteta-title" className="title mt-8" data-lines>
              Kvaliteta nije završni korak. <span className="italic text-wheat-deep">Ona prati svaki.</span>
            </h2>
            <p className="lede measure mt-8 text-charcoal/70" data-reveal>
              Od odabira zrna do trenutka kad kruh stigne na policu, pratimo isti standard: ujednačeno brašno, provjerene recepture i
              svježinu bez kompromisa.
            </p>
            {CERTIFICATIONS.length > 0 && (
              <ul className="mt-10 border-t border-charcoal/15">
                {CERTIFICATIONS.map((c) => (
                  <li key={c.name} className="flex justify-between gap-6 border-b border-charcoal/15 py-4">
                    <span className="font-display text-xl">{c.name}</span>
                    <span className="text-sm text-charcoal/55">{[c.detail, c.year].filter(Boolean).join(" · ")}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10" data-reveal>
              <ArrowLink href="/proizvodi/">Naši proizvodi</ArrowLink>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Photo id="prod-rolls-2" ratio="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" reveal />
          </div>
        </div>
      </Section>
    </main>
  );
}
