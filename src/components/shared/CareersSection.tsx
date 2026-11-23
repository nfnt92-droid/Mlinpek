import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";
import { FormDownloads } from "./FormDownloads";

/**
 * Careers block: one photograph per kind of work (client, 23. 11. 2026: real photos instead of icons;
 * temporary Pexels photos until Mlinpek's own). The roles show the kinds of work — not job openings.
 */
type RoleId = "prodavac" | "pekar" | "tehnolog" | "laborant" | "mlinar" | "vozac";
export const ROLES: { id: RoleId; label: string; text: string }[] = [
  { id: "prodavac", label: "Prodavač / prodavačica", text: "Za pultom naših pekara, s kupcima od ranog jutra." },
  { id: "pekar", label: "Pekar", text: "Tijesto, oblikovanje i peć u našoj pekarskoj proizvodnji." },
  { id: "tehnolog", label: "Tehnolog", text: "Recepture, procesi i ujednačena kvaliteta proizvoda." },
  { id: "laborant", label: "Laborant", text: "Kontrola zrna, brašna i gotovih proizvoda." },
  { id: "mlinar", label: "Mlinar", text: "Prijem i čišćenje zrna, mljevenje i pakiranje brašna." },
  { id: "vozac", label: "Vozač", text: "Dostava do naših pekara i poslovnih partnera." },
];

export function CareersSection({ id = "zaposljavanje", compact = false }: { id?: string; compact?: boolean }) {
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

        <ul className={`grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 ${compact ? "mt-12" : "mt-16 md:mt-20"}`}>
          {ROLES.map((r) => (
            <li key={r.id} data-reveal>
              <Photo id={`job-${r.id}` as PhotoId} ratio="aspect-[4/3]" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              <p className="mt-5 font-display text-[1.5rem] leading-tight">{r.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/60">{r.text}</p>
            </li>
          ))}
        </ul>

        {!compact && (
          <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center md:mt-16" data-reveal>
            <Link
              href="/zaposljavanje/prijava/"
              className="inline-flex min-h-14 items-center gap-4 bg-wheat px-8 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ivory"
            >
              Popunite prijavu online <span aria-hidden="true">→</span>
            </Link>
            <FormDownloads tone="dark" word={false} />
          </div>
        )}
      </div>
    </section>
  );
}
