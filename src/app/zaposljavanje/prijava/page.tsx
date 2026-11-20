import Link from "next/link";
import { pageMeta } from "@/components/shared/PageParts";
import { JobApplicationForm } from "@/components/shared/JobApplicationForm";
import { SITE } from "@/content/site";
import { FormDownloads } from "@/components/shared/FormDownloads";

export const metadata = pageMeta(
  "/zaposljavanje/prijava/",
  "Prijava za posao",
  "Obrazac za prijavu kandidata Mlinpek d.d. — popunite i pošaljite prijavu za posao direktno na web stranici.",
);

/**
 * The job application form on its own, quiet page: one centred column, nothing else to read
 * around it (client request 20. 11. 2026). Context, roles and the paper form live on /zaposljavanje/.
 */
export default function PrijavaPage() {
  const jobs = SITE.careers;
  return (
    <main id="sadrzaj" className="bg-paper text-charcoal">
      <div className="mx-auto w-full max-w-[760px] px-5 pb-28 pt-36 sm:px-8 md:pt-48">
        <Link href="/zaposljavanje/" className="text-[12px] uppercase tracking-[0.2em] text-charcoal/55 transition-colors hover:text-charcoal">
          <span aria-hidden="true">←</span> Zapošljavanje
        </Link>

        <header className="mt-10 border-b border-charcoal/15 pb-10">
          <p className="label text-wheat-deep">Prijava za posao</p>
          <h1 className="mt-5 font-display text-[2.4rem] leading-[1.05] sm:text-[3.2rem]">{jobs.formTitle}</h1>
          <p className="mt-5 max-w-[56ch] leading-relaxed text-charcoal/70">
            Ista pitanja kao u našem obrascu za prijavu kandidata. Polja označena kao neobavezna možete preskočiti. Prijava stiže
            upravi i pravnoj službi.
          </p>
        </header>

        <div className="mt-12">
          <JobApplicationForm />
        </div>

        <footer className="mt-16 space-y-3 border-t border-charcoal/15 pt-8 text-sm leading-relaxed text-charcoal/55">
          <p>Radije na papiru? Preuzmite ili ispišite isti obrazac:</p>
          <div className="pb-4 pt-2">
            <FormDownloads />
          </div>
          <p>Podatke iz prijave obrađujemo isključivo u svrhu selekcije i zapošljavanja, u skladu sa Zakonom o zaštiti ličnih podataka.</p>
        </footer>
      </div>
    </main>
  );
}
