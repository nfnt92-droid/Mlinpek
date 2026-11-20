import Link from "next/link";
import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import { CareersSection } from "@/components/shared/CareersSection";
import { FormDownloads } from "@/components/shared/FormDownloads";

export const metadata = pageMeta(
  "/zaposljavanje/",
  "Zapošljavanje",
  "Zapošljavanje u Mlinpeku — zanimanja od mlina do pekare i online prijava za posao.",
);

const cta =
  "inline-flex min-h-14 items-center gap-4 bg-charcoal px-8 text-[12px] font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink";

export default function ZaposljavanjePage() {
  return (
    <main id="sadrzaj">
      <PageHero
        tone="paper"
        label="Zapošljavanje"
        title={
          <>
            Radite <span className="italic text-wheat-deep">s nama.</span>
          </>
        }
        lede={<p>Od mlina do pulta — tražimo ljude koji vole dobar kruh i dobro odrađen posao. Prijavu popunite na webu za nekoliko minuta.</p>}
      />

      <Section tone="paper" labelledBy="prijava-title" className="!pt-0">
        <div className="grid gap-12 border-t border-charcoal/15 pt-16 md:grid-cols-12 md:items-center md:gap-8 md:pt-20">
          <div className="relative aspect-[4/3] md:col-span-7 md:aspect-[3/2]">
            <Photo id="people-handshake-office" fill sizes="(min-width: 768px) 58vw, 100vw" />
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Eyebrow>Prijava</Eyebrow>
            <h2 id="prijava-title" className="subtitle mt-6" data-reveal>
              Prvi korak je <span className="italic text-wheat-deep">jedan obrazac.</span>
            </h2>
            <ol className="mt-8 space-y-5 text-charcoal/75">
              {[
                ["01", "Popunite prijavu za posao direktno na webu — ista pitanja kao u našem obrascu za prijavu kandidata."],
                ["02", "Prijava stiže upravi i pravnoj službi Mlinpeka."],
              ].map(([n, t]) => (
                <li key={n} className="flex gap-4 border-t border-charcoal/12 pt-4">
                  <span className="tabular text-[12px] text-wheat-deep">{n}</span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <Link href="/zaposljavanje/prijava/" className={cta}>
                Popunite prijavu <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CareersSection id="zanimanja" />

      <Section tone="ivory" labelledBy="papir-title">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-5">
            <Eyebrow>Radije na papiru?</Eyebrow>
            <h2 id="papir-title" className="subtitle mt-6" data-reveal>
              Obrazac za ispis.
            </h2>
            <p className="measure mt-6 leading-relaxed text-charcoal/70">
              Isti obrazac možete preuzeti, ispuniti na računaru ili rukom i dostaviti nam ga.
            </p>
            <div className="mt-8">
              <FormDownloads />
            </div>
            <p className="mt-10 max-w-[40ch] text-sm leading-relaxed text-charcoal/55">
              Podatke iz prijave obrađujemo isključivo u svrhu selekcije i zapošljavanja, u skladu sa Zakonom o zaštiti ličnih podataka.
            </p>
          </div>
          <div className="relative aspect-[4/3] md:col-span-6 md:col-start-7 md:aspect-[3/2]">
            <Photo id="people-interview" fill sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </Section>
    </main>
  );
}
