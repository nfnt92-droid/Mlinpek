import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { PhotoBand } from "@/components/ui/PhotoBand";
import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { LocationDirectory } from "@/components/shared/LocationDirectory";
import { Photo } from "@/components/ui/Photo";
import { LOCATIONS, townsSentence } from "@/content/locations";

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
        photo="store-mlinpek-2"
      />
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
