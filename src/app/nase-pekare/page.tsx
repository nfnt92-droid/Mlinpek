import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { PhotoBand } from "@/components/ui/PhotoBand";
import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { LocationDirectory } from "@/components/shared/LocationDirectory";
import { Photo } from "@/components/ui/Photo";
import { LOCATIONS, townsSentence } from "@/content/locations";
import { BAKERY_CATEGORIES, BAKERY_ITEMS } from "@/content/bakery";
import type { PhotoId } from "@/content/photos";

/** one product photo per category (the first in the client's list) + how many products it holds */
const SHOWCASE = BAKERY_CATEGORIES.map((c) => {
  const items = BAKERY_ITEMS.filter((i) => i.category === c.id);
  return { ...c, count: items.length, photo: items[0]?.photos[0] as PhotoId | undefined };
}).filter((c) => c.count > 0 && c.photo);

const plural = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? "proizvod" : "proizvoda");

export const metadata = pageMeta(
  "/nase-pekare/",
  "Naše pekare",
  "Mlinpek poslovnice u Bugojnu, Donjem i Gornjem Vakufu, Travniku i Novom Travniku — adrese, telefoni i radno vrijeme.",
);

export default function PekarePage() {
  return (
    <main id="sadrzaj">
      <PageHero
        tone="paper"
        label="Naše pekare"
        title={
          <>
            Blizu vas. <span className="italic text-wheat-deep">Svakoga dana.</span>
          </>
        }
        lede={<p>Kruh iz naše proizvodnje ne putuje daleko. U našim pekarama dočekuje vas od ranog jutra.</p>}
        photo="store-exterior-mlinpek"
      />
      {/* the shops as the showcase of everything Mlinpek makes */}
      <Section tone="paper" labelledBy="izlog-title" className="!pt-0">
        <div className="grid gap-10 border-t border-charcoal/15 pt-16 md:grid-cols-12 md:gap-8 md:pt-24">
          <div className="md:col-span-5">
            <Eyebrow>Naše pekare</Eyebrow>
            <h2 id="izlog-title" className="subtitle mt-6 max-w-[18ch]" data-reveal>
              Mjesto gdje predstavljamo <span className="italic text-wheat-deep">sve što proizvodimo.</span>
            </h2>
          </div>
          <div className="measure space-y-5 leading-relaxed text-charcoal/75 md:col-span-6 md:col-start-7" data-reveal>
            <p className="lede text-charcoal/80">
              Naše pekare su izlog cijele priče: brašna iz našeg mlina, kruha i peciva iz naše proizvodnje i ljudi koji vas
              dočekuju od ranog jutra.
            </p>
            <p>
              Na policama i u vitrinama naći ćete svakodnevni kruh i bagete, premium kruhove s kiselim tijestom i sjemenkama,
              kajzerice i kifle, slana i slatka peciva, krofne, muffine i pite — sve iz naše pekarske proizvodnje.
            </p>
            <p>
              {LOCATIONS.length} poslovnica radi od ponedjeljka do subote od 07:00 do 20:00, a nedjeljom od 07:00 do 13:00.
            </p>
          </div>
        </div>

        {/* shop photographs */}
        <ul className="mt-16 grid grid-cols-2 gap-2 sm:gap-3 md:mt-24 md:grid-cols-12">
          {(
            [
              ["store-counter-mlinpek", "col-span-2 aspect-[4/3] md:col-span-6 md:aspect-[3/2]"],
              ["store-cafe-mlinpek", "col-span-2 aspect-[4/3] md:col-span-6 md:aspect-[3/2]"],
            ] as [PhotoId, string][]
          ).map(([id, cls]) => (
            <li key={id} className={`relative ${cls}`}>
              <Photo id={id} fill sizes="(min-width: 768px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </Section>

      {/* what you find in the shop — one tile per product family, each opens the catalogue filtered */}
      <Section tone="ivory" labelledBy="ponuda-title">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>U vitrini</Eyebrow>
            <h2 id="ponuda-title" className="title mt-8" data-lines>
              Što vas čeka u pekari.
            </h2>
          </div>
          <p className="measure leading-relaxed text-charcoal/70 md:col-span-4 md:col-start-9" data-reveal>
            {BAKERY_ITEMS.length} proizvoda u {SHOWCASE.length} skupina. Odaberite skupinu i pogledajte cijelu ponudu sa sastavom i
            gramažom.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:mt-20 lg:grid-cols-4">
          {SHOWCASE.map((c) => (
            <li key={c.id} data-reveal>
              <a href={`/proizvodi/?kategorija=${c.id}#pekarski`} className="group block">
                <span className="block overflow-hidden">
                  <span className="block transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]">
                    <Photo id={c.photo!} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" />
                  </span>
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="font-display text-[1.35rem] leading-tight group-hover:text-wheat-deep sm:text-[1.6rem]">{c.label}</span>
                  <span className="tabular shrink-0 text-[12px] text-charcoal/50">
                    {c.count} {plural(c.count)}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-charcoal/60">{c.line}</span>
              </a>
            </li>
          ))}
          <li data-reveal className="flex">
            <a href="/proizvodi/#brasno" className="group flex w-full flex-col justify-between bg-charcoal p-6 text-ivory transition-colors hover:bg-ink">
              <span className="label text-wheat">Iz našeg mlina</span>
              <span>
                <span className="block font-display text-[1.6rem] leading-tight">Brašno</span>
                <span className="mt-2 block text-sm text-ivory/65">Pogledajte i naša brašna: tip 500 u vreći od 25 kg i tip 550 u pakiranjima od 1, 2 i 5 kg.</span>
                <span className="mt-6 inline-block text-[12px] uppercase tracking-[0.2em] text-wheat">Pogledajte →</span>
              </span>
            </a>
          </li>
        </ul>
      </Section>

      <Section tone="paper" labelledBy="lokacije-title">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Eyebrow>Lokacije</Eyebrow>
            <h2 id="lokacije-title" className="subtitle mt-6" data-reveal>
              Pronađite našu pekaru.
            </h2>
            {LOCATIONS.length > 0 && (
              <p className="mt-6 max-w-[30ch] leading-relaxed text-charcoal/65" data-reveal>
                {LOCATIONS.length} poslovnica: {townsSentence()}.
              </p>
            )}
          </div>
          <div className="md:col-span-7 md:col-start-6" data-reveal>
            <LocationDirectory tone="light" />
          </div>
        </div>
      </Section>
      <PhotoBand id="deco-basket" align="left">
        Svratite po svoj kruh.
      </PhotoBand>

      <Section tone="ivory" labelledBy="narudzbe-title">
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-6">
            <Photo id="sandwich-2" ratio="aspect-[4/3]" sizes="(min-width: 768px) 50vw, 100vw" reveal />
          </div>
          <div className="md:col-span-5 md:col-start-8" data-reveal-group>
            <h2 id="narudzbe-title" className="subtitle" data-reveal>
              Veće narudžbe za proslave, urede i događaje?
            </h2>
            <p className="mt-6 leading-relaxed text-charcoal/70" data-reveal>Javite nam se unaprijed i pripremit ćemo sve što trebate.</p>
            <div className="mt-8" data-reveal>
              <ArrowLink href="/kontakt/?vrsta=pekare#upit">Pošaljite upit</ArrowLink>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
