import Link from "next/link";
import { RoleIllustration, type RoleId } from "@/components/ui/Illustrations";
import { SITE } from "@/content/site";

/**
 * Careers block (client brief 18. 11. 2026: "zaseban odjeljak sa ilustracijama prodavača, tehnologa,
 * laboranta i sl."). The roles show the kinds of work in the company — they are not job openings.
 */
export const ROLES: { id: RoleId; label: string; text: string }[] = [
  { id: "prodavac", label: "Prodavač / prodavačica", text: "Za pultom naših pekara, s kupcima od ranog jutra." },
  { id: "pekar", label: "Pekar", text: "Tijesto, oblikovanje i peć u našoj pekarskoj proizvodnji." },
  { id: "tehnolog", label: "Tehnolog", text: "Recepture, procesi i ujednačena kvaliteta proizvoda." },
  { id: "laborant", label: "Laborant", text: "Kontrola zrna, brašna i gotovih proizvoda." },
  { id: "mlinar", label: "Mlinar", text: "Prijem i čišćenje zrna, mljevenje i pakiranje brašna." },
  { id: "vozac", label: "Vozač", text: "Dostava do naših pekara i poslovnih partnera." },
];

export function CareersSection({ id = "zaposljavanje", compact = false }: { id?: string; compact?: boolean }) {
  const jobs = SITE.careers;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 bg-ink text-ivory">
      <div className="wrap section">
        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <p className="label text-wheat">Zapošljavanje</p>
            <h2 id={`${id}-title`} className="title mt-8 text-ivory" data-lines>
              Pridružite se <span className="italic text-wheat">našem timu.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9" data-reveal>
            <p className="measure leading-relaxed text-ivory/70">
              Od mlina do pulta — u Mlinpeku rade ljudi mnogih zanimanja. Prijavu za posao popunite direktno na webu; stiže
              upravi i pravnoj službi.
            </p>
          </div>
        </div>

        <ul className={`grid grid-cols-2 gap-px bg-ivory/10 sm:grid-cols-3 ${compact ? "mt-12" : "mt-16 md:mt-20"} lg:grid-cols-6`}>
          {ROLES.map((r) => (
            <li key={r.id} className="flex flex-col bg-ink p-5 sm:p-6" data-reveal>
              <RoleIllustration role={r.id} className="h-24 w-24 text-wheat sm:h-28 sm:w-28" />
              <p className="mt-5 font-display text-[1.25rem] leading-tight">{r.label}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ivory/55">{r.text}</p>
            </li>
          ))}
        </ul>

        {!compact && (
          <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center md:mt-16" data-reveal>
            <Link
              href="/zaposljavanje/"
              className="inline-flex min-h-14 items-center gap-4 bg-wheat px-8 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ivory"
            >
              Popunite prijavu online <span aria-hidden="true">→</span>
            </Link>
            <a
              href={jobs.formPdf}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-14 items-center gap-3 border border-ivory/30 px-6 text-[12px] uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:border-ivory"
            >
              Obrazac za ispis (PDF) <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
