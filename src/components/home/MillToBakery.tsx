import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";

const FEATURES: { id: string; label: string; title: string; text: string; photo: PhotoId; href: string; cta: string }[] = [
  {
    id: "mlin",
    label: "Naš mlin",
    title: "Brašno koje sami meljemo.",
    text: "Zrno prolazi kontrolirano mljevenje i provjere prije nego što postane brašno — isto ono koje koriste naši pekari.",
    photo: "deco-flour-bowl",
    href: "/o-nama/#mlin",
    cta: "O našem mlinu",
  },
  {
    id: "proizvodnja",
    label: "Pekarska proizvodnja",
    title: "Zanat, svakoga jutra.",
    text: "Tijesto dobiva vrijeme koje mu treba, a kruh iz peći odlazi ravno u naše pekare i do partnera.",
    photo: "prod-hall-mlinpek",
    href: "/o-nama/#proizvodnja",
    cta: "O proizvodnji",
  },
];

/** 03 — two editorial features, mirrored: large photograph, a short paragraph beside it. */
export function MillToBakery() {
  return (
    <section aria-labelledby="mlin-pekara-title" className="bg-ivory text-charcoal">
      <div className="wrap section">
        <Eyebrow>Od zrna do kruha</Eyebrow>
        <h2 id="mlin-pekara-title" className="title mt-8 max-w-[16ch]" data-lines>
          Od našeg mlina do vaše pekare.
        </h2>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {FEATURES.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={f.id} aria-labelledby={`f-${f.id}`} className="grid gap-8 md:grid-cols-12 md:items-end md:gap-8">
                <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
                  <Photo id={f.photo} ratio="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" reveal parallax />
                </div>
                <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`} data-reveal-group>
                  <p className="label text-wheat-deep" data-reveal>{f.label}</p>
                  <h3 id={`f-${f.id}`} className="subtitle mt-5" data-reveal>{f.title}</h3>
                  <p className="mt-5 leading-relaxed text-charcoal/70" data-reveal>{f.text}</p>
                  <div className="mt-8" data-reveal>
                    <ArrowLink href={f.href}>{f.cta}</ArrowLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
