import Link from "next/link";
import { NAV, SITE } from "@/content/site";
import { B2B_PATHWAYS } from "@/content/inquiries";
import { Logo } from "@/components/ui/Logo";
import { MillIllustration } from "@/components/ui/Illustrations";
import { CATALOG_PDF } from "@/content/catalogSpecs";

/**
 * Colophon: brand, pages, contacts (head office + legal department), business partners;
 * the company's registration data runs along the bottom line with the copyright.
 * One 12-column row on desktop, two columns for the short lists on phones.
 */
export function SiteFooter() {
  const c = SITE.contact;
  const r = SITE.registry;
  const year = new Date().getFullYear();
  const head = "label text-[11px] text-wheat/80";
  const link = "transition-colors hover:text-wheat";
  const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

  return (
    <footer className="relative overflow-hidden bg-ink text-ivory" aria-labelledby="footer-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <MillIllustration className="w-[max(100%,900px)] max-w-[1600px] shrink-0 text-wheat opacity-[0.06]" />
      </div>
      <div className="wrap relative pb-10 pt-20 md:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 text-sm lg:grid-cols-12 lg:gap-x-8">
          {/* brand */}
          <div className="col-span-2 lg:col-span-4">
            <h2 id="footer-title" className="sr-only">Mlinpek</h2>
            <Logo className="w-[170px] md:w-[200px]" />
            <p className="mt-7 font-display text-2xl italic text-ivory/85">Od zrna do kruha.</p>
            <p className="mt-2 max-w-[32ch] leading-relaxed text-ivory/55">Mlin, pekarska proizvodnja i pekare — jedna priča od 1957.</p>
            {SITE.social.length > 0 && (
              <ul className="mt-7 flex gap-3" aria-label="Društvene mreže">
                {SITE.social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Mlinpek na mreži ${s.label}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:border-wheat hover:text-wheat"
                    >
                      <SocialIcon name={s.label} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* pages */}
          <nav aria-labelledby="f-stranice" className="lg:col-span-2">
            <h3 id="f-stranice" className={head}>Stranice</h3>
            <ul className="mt-5 space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`text-ivory/75 ${link}`}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* business partners */}
          <nav aria-labelledby="f-partneri" className="lg:col-span-3">
            <h3 id="f-partneri" className={head}>Poslovni partneri</h3>
            <ul className="mt-5 space-y-3">
              {B2B_PATHWAYS.map((p) => (
                <li key={p.value}>
                  <Link href={`/kontakt/?vrsta=${p.value}#upit`} className={`text-ivory/75 ${link}`}>{p.label}</Link>
                </li>
              ))}
              <li>
                <a href={CATALOG_PDF} target="_blank" rel="noopener" className={`text-ivory/75 ${link}`}>Katalog proizvoda (PDF)</a>
              </li>
            </ul>
          </nav>

          {/* contacts */}
          <section aria-labelledby="f-kontakt" className="col-span-2 lg:col-span-3">
            <h3 id="f-kontakt" className={head}>Kontakt</h3>
            <address className="mt-5 space-y-1.5 not-italic leading-relaxed text-ivory/75">
              {c.address && <p>{c.address}</p>}
              {c.phone && <p><a href={tel(c.phone)} className={link}>{c.phone}</a></p>}
              {c.email && <p><a href={`mailto:${c.email}`} className={`break-all ${link}`}>{c.email}</a></p>}
              {c.hours && <p className="text-ivory/45">{c.hours}</p>}
            </address>
            {SITE.departments.map((d) => (
              <div key={d.label} className="mt-6 border-t border-ivory/10 pt-5 leading-relaxed">
                <p className="text-ivory/50">{d.label}</p>
                <div className="mt-1.5 space-y-1.5 text-ivory/75">
                  {d.phone && <p><a href={tel(d.phone)} className={link}>{d.phone}</a></p>}
                  {d.email && <p><a href={`mailto:${d.email}`} className={`break-all ${link}`}>{d.email}</a></p>}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* bottom line: copyright + company data + credit */}
        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-[12px] leading-relaxed text-ivory/45 md:mt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="space-y-1">
            <p className="text-ivory/60">© {year} {SITE.legalName ?? SITE.brand}</p>
            <p className="tabular">
              ID {r.idNumber} <span aria-hidden="true">·</span> PDV {r.vatNumber} <span aria-hidden="true">·</span> Broj rješenja {r.decisionNumber}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SITE.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ivory">{l.label}</Link>
            ))}
            <p>
              Designed by{" "}
              <a href="https://www.clickhouse.ba" target="_blank" rel="noopener" className="text-ivory/70 underline decoration-wheat/50 underline-offset-4 transition-colors hover:text-wheat">
                Click House
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: "Instagram" | "Facebook" }) {
  return name === "Instagram" ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" />
    </svg>
  );
}
