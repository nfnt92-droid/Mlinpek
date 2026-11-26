import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import { LOCATIONS, townsSentence } from "@/content/locations";

/** 05 — one inviting photograph, two clear paths: find a bakery, or start a business inquiry. */
export function BakeriesContact() {
  const n = LOCATIONS.length;
  return (
    <section aria-labelledby="pekare-title" className="bg-ivory text-charcoal">
      <div className="wrap section grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        <div className="md:col-span-7">
          <Photo id="store-counter-mlinpek" ratio="aspect-[4/3] md:aspect-[5/4]" sizes="(min-width: 768px) 58vw, 100vw" reveal />
        </div>
        <div className="md:col-span-4 md:col-start-9" data-reveal-group>
          <Eyebrow>Naše pekare</Eyebrow>
          <h2 id="pekare-title" className="title mt-8" data-lines>
            Blizu vas. <span className="italic text-wheat-deep">Svakoga dana.</span>
          </h2>
          <p className="mt-8 leading-relaxed text-charcoal/70" data-reveal>
            Kruh iz naše proizvodnje ne putuje daleko — u našim pekarama dočekuje vas od ranog jutra.
            {n === 0 ? " Popis pekara s adresama objavit ćemo uskoro." : ` Naše poslovnice: ${townsSentence()}.`}
          </p>
          <div className="mt-10 flex flex-col items-start gap-6" data-reveal>
            <ArrowLink href="/nase-pekare/">Pronađite našu pekaru</ArrowLink>
            <ArrowLink href="/kontakt/#upit">Poslovni upit</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
