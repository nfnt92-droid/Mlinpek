import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { Eyebrow } from "@/components/ui/Editorial";
import { JobApplicationForm } from "@/components/shared/JobApplicationForm";
import { SITE } from "@/content/site";

export const metadata = pageMeta(
  "/zaposljavanje/",
  "Zapošljavanje",
  "Prijava za posao u Mlinpeku — popunite obrazac za prijavu kandidata direktno na web stranici.",
);

export default function ZaposljavanjePage() {
  const jobs = SITE.careers;
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
        lede={<p>Popunite prijavu za radno mjesto direktno ovdje — ista pitanja kao u našem obrascu za prijavu kandidata.</p>}
      />

      <Section tone="paper" id="prijava" labelledBy="prijava-title" className="!pt-0">
        <div className="grid gap-16 border-t border-charcoal/15 pt-16 md:grid-cols-12 md:gap-8 md:pt-20">
          <div className="md:col-span-7 md:col-start-6">
            <h2 id="prijava-title" className="subtitle">{jobs.formTitle}</h2>
            <p className="mt-3 text-sm text-charcoal/55">Polja označena kao neobavezna možete preskočiti.</p>
            <div className="mt-12">
              <JobApplicationForm />
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-1 md:row-start-1">
            <div className="md:sticky md:top-28">
              <Eyebrow>Radije na papiru?</Eyebrow>
              <p className="mt-6 max-w-[34ch] leading-relaxed text-charcoal/70">
                Isti obrazac možete preuzeti, ispuniti na računaru ili rukom i dostaviti nam ga.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href={jobs.formDocx}
                  download
                  className="inline-flex min-h-12 items-center gap-3 border border-charcoal/30 px-6 text-[12px] uppercase tracking-[0.2em] transition-colors hover:border-charcoal"
                >
                  Preuzmi (Word) <span aria-hidden="true">↓</span>
                </a>
                <a
                  href={jobs.formPdf}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-12 items-center gap-3 border border-charcoal/30 px-6 text-[12px] uppercase tracking-[0.2em] transition-colors hover:border-charcoal"
                >
                  PDF za ispis <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="mt-10 max-w-[34ch] text-sm leading-relaxed text-charcoal/65">
                Prijava poslana putem weba stiže upravi i pravnoj službi (
                <a href="mailto:pravna.sluzba@mlinpek.ba" className="underline decoration-wheat-deep underline-offset-4">pravna.sluzba@mlinpek.ba</a>).
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-charcoal/55">
                Podatke iz prijave obrađujemo isključivo u svrhu selekcije i zapošljavanja, u skladu sa Zakonom o zaštiti ličnih podataka.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
