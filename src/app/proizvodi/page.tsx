import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { PhotoBand } from "@/components/ui/PhotoBand";
import { FlourRange } from "@/components/shared/FlourRange";
import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import { ProductCatalog } from "@/components/shared/ProductCatalog";

export const metadata = pageMeta(
  "/proizvodi/",
  "Proizvodi",
  "Brašna iz našeg mlina te kruh, peciva i slastice iz naše pekarske proizvodnje.",
);

export default function ProizvodiPage() {
  return (
    <main id="sadrzaj">
      <PageHero
        tone="paper"
        label="Proizvodi"
        title={
          <>
            Okusi koji <span className="italic text-wheat-deep">nas povezuju.</span>
          </>
        }
        lede={
          <p>
            Brašno iz našeg mlina i sve što od njega nastaje u našoj pekarskoj proizvodnji.
          </p>
        }
      />

      <Section tone="ivory" id="brasno" labelledBy="brasno-title">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Iz našeg mlina</Eyebrow>
            <h2 id="brasno-title" className="title mt-8" data-lines>
              Brašno.
            </h2>
          </div>
          <p className="measure leading-relaxed text-charcoal/70 md:col-span-4 md:col-start-9" data-reveal>
            Pšenično bijelo brašno tip 550 iz našeg mlina — u novom pakiranju od 1, 2 i 5 kg.
          </p>
        </div>
        {/* campaign banner — shown whole (it carries its own lettering) */}
        <div className="mt-16 md:mt-20" data-reveal>
          <Photo id="flour-banner-550" ratio="aspect-[2560/1048]" sizes="(min-width: 1240px) 1160px, 100vw" />
        </div>
        <div className="mt-14 md:mt-20">
          <FlourRange />
        </div>
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-charcoal/15 pt-10 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <p className="measure text-charcoal/70">Za pekare i proizvođače: brašna u profesionalnim pakiranjima, specifikacije na upit.</p>
          <ArrowLink href="/kontakt/?vrsta=brasno#upit">Upit za veleprodaju</ArrowLink>
        </div>
      </Section>

      <PhotoBand id="deco-assortment" />

      <Section tone="paper" id="pekarski" labelledBy="pekarski-title">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Iz naše pekare</Eyebrow>
            <h2 id="pekarski-title" className="title mt-8" data-lines>
              Kruh, peciva, slastice i pite.
            </h2>
          </div>
          <p className="measure leading-relaxed text-charcoal/70 md:col-span-4 md:col-start-9" data-reveal>
            Pečeno u našoj proizvodnji, svakoga dana dostupno u našim pekarama.
          </p>
        </div>
        <div className="mt-14 md:mt-20">
          <ProductCatalog />
        </div>
        <div className="mt-16 flex flex-col items-start gap-6 border-t border-charcoal/15 pt-10 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <p className="measure text-charcoal/70">Za trgovine, hotele i restorane: dostava pekarskih proizvoda prema dogovoru.</p>
          <ArrowLink href="/kontakt/?vrsta=pekarski#upit">Upit za distribuciju</ArrowLink>
        </div>
      </Section>

      <PhotoBand id="sandwich-1" align="left">
        Za sendviče, užinu i stol.
      </PhotoBand>
    </main>
  );
}
