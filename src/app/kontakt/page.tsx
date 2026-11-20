import { PageHero, Section, pageMeta } from "@/components/shared/PageParts";
import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { InquiryForm } from "@/components/shared/InquiryForm";
import { ALL_TYPES } from "@/content/inquiries";
import { CareersSection } from "@/components/shared/CareersSection";
import { PhotoBand } from "@/components/ui/PhotoBand";

export const metadata = pageMeta(
  "/kontakt/",
  "Kontakt",
  "Pišite nam — pitanja o proizvodima i pekarama, veleprodaja brašna, distribucija i poslovna suradnja.",
);

export default function KontaktPage() {
  return (
    <main id="sadrzaj">
      <PageHero
        tone="paper"
        label="Kontakt"
        title={
          <>
            Razgovarajmo. <span className="italic text-wheat-deep">Rado ćemo odgovoriti.</span>
          </>
        }
        lede={<p>Pitanje o proizvodima ili pekarama, veleprodaja brašna ili dugoročna suradnja — pišite nam i javit ćemo vam se.</p>}
      />

      <Section tone="paper" id="upit" labelledBy="obrazac-title" className="!pt-0">
        <div className="grid scroll-mt-24 gap-16 border-t border-charcoal/15 pt-16 md:grid-cols-12 md:gap-8 md:pt-20">
          {/* phones: the form comes first; all company details live in the footer below */}
          <div className="order-2 md:order-none md:col-span-4">
            <Eyebrow>Pišite nam</Eyebrow>
            <p className="mt-6 max-w-[32ch] leading-relaxed text-charcoal/65">
              Odaberite vrstu upita i proslijedit ćemo ga pravoj osobi. Adrese, telefoni i podaci o društvu nalaze se u podnožju stranice.
            </p>
            <div className="mt-12 border-t border-charcoal/15 pt-8">
              <p className="label text-wheat-deep">Tražite posao?</p>
              <div className="mt-5">
                <ArrowLink href="#zaposljavanje">Zapošljavanje</ArrowLink>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <h2 id="obrazac-title" className="subtitle">Pošaljite poruku</h2>
            <div className="mt-10">
              <InquiryForm name="kontakt" types={ALL_TYPES} companyRequired={false} tone="light" readQuery />
            </div>
          </div>
        </div>
      </Section>

      <PhotoBand id="people-handshake-deal" align="left">
        Dogovorimo suradnju.
      </PhotoBand>

      <CareersSection />
    </main>
  );
}
