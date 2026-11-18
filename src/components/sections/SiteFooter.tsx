import Link from "next/link";
import { NAV, SITE } from "@/content/site";
import { B2B_PATHWAYS } from "@/content/inquiries";
import { Logo } from "@/components/ui/Logo";

/**
 * Colophon with all company details: head office, legal department, business partners,
 * registration data (client documents), the pages, careers link and copyright.
 */
export function SiteFooter() {
  const c = SITE.contact;
  const r = SITE.registry;
  const year = new Date().getFullYear();
  const head = "label text-[11px] text-wheat/80";
  const link = "transition-colors hover:text-wheat";

  return (
    <footer className="bg-ink text-ivory" aria-labelledby="footer-title">
      <div className="wrap pb-10 pt-24 md:pt-32">
        {/* brand + pages */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 id="footer-title" className="sr-only">Mlinpek</h2>
            <Logo className="w-[190px] md:w-[230px]" />
            <p className="mt-8 font-display text-2xl italic text-ivory/80">Od zrna do kruha.</p>
            <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-ivory/55">Mlin, pekarska proizvodnja i pekare — jedna priča.</p>
          </div>
          <nav aria-label="Podnožje" className="md:col-span-3 md:col-start-7">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`block py-2 text-ivory/75 ${link}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/zaposljavanje/" className={`block py-2 text-ivory/75 ${link}`}>
                  Zapošljavanje
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* contacts, partners, company data */}
        <div className="mt-20 grid gap-12 border-t border-ivory/10 pt-14 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <section aria-labelledby="f-uprava">
            <h3 id="f-uprava" className={head}>Uprava</h3>
            <address className="mt-5 space-y-2 not-italic leading-relaxed text-ivory/75">
              {c.address && <p>{c.address}</p>}
              {c.phone && (
                <p>
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={link}>{c.phone}</a>
                </p>
              )}
              {c.email && (
                <p>
                  <a href={`mailto:${c.email}`} className={`break-all ${link}`}>{c.email}</a>
                </p>
              )}
              {c.hours && <p className="text-ivory/50">{c.hours}</p>}
            </address>
          </section>

          {SITE.departments.map((d) => (
            <section key={d.label} aria-labelledby={`f-${d.label}`}>
              <h3 id={`f-${d.label}`} className={head}>{d.label}</h3>
              <div className="mt-5 space-y-2 leading-relaxed text-ivory/75">
                {d.phone && (
                  <p>
                    <a href={`tel:${d.phone.replace(/\s/g, "")}`} className={link}>{d.phone}</a>
                  </p>
                )}
                {d.email && (
                  <p>
                    <a href={`mailto:${d.email}`} className={`break-all ${link}`}>{d.email}</a>
                  </p>
                )}
                {d.hours && <p className="text-ivory/50">{d.hours}</p>}
              </div>
            </section>
          ))}

          <section aria-labelledby="f-partneri">
            <h3 id="f-partneri" className={head}>Poslovni partneri</h3>
            <ul className="mt-5 space-y-4">
              {B2B_PATHWAYS.map((p) => (
                <li key={p.value}>
                  <Link href={`/kontakt/?vrsta=${p.value}#upit`} className={`text-ivory/85 ${link}`}>
                    {p.label}
                  </Link>
                  <p className="mt-1 max-w-[34ch] text-[13px] leading-relaxed text-ivory/45">{p.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="f-drustvo">
            <h3 id="f-drustvo" className={head}>Podaci o društvu</h3>
            <p className="mt-5 leading-relaxed text-ivory/75">{SITE.legalName}</p>
            <dl className="mt-4 space-y-2">
              {[
                ["ID broj", r.idNumber],
                ["PDV broj", r.vatNumber],
                ["Broj rješenja", r.decisionNumber],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap justify-between gap-x-4 border-b border-ivory/10 pb-2">
                  <dt className="text-ivory/45">{k}</dt>
                  <dd className="tabular text-ivory/80">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-[12px] text-ivory/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.legalName ?? SITE.brand}
          </p>
          {SITE.legal.length > 0 && (
            <ul className="flex flex-wrap gap-6">
              {SITE.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ivory">{l.label}</Link>
                </li>
              ))}
            </ul>
          )}
          <p>Dio fotografija: privremene, Pexels</p>
        </div>
      </div>
    </footer>
  );
}
