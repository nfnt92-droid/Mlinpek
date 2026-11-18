import Link from "next/link";
import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";

/** The catalogue's categories (Mlinpek product catalogue) — the full range lives on /proizvodi/. */
const ITEMS: { name: string; line: string; photo: PhotoId; href: string }[] = [
  { name: "Brašno", line: "Iz našeg mlina.", photo: "flour-550-1kg", href: "/proizvodi/#brasno" },
  { name: "Kruhovi", line: "Svakoga dana.", photo: "p-polubijeli-kruh", href: "/proizvodi/?kategorija=kruh#pekarski" },
  { name: "Premium kruhovi", line: "Kiselo tijesto i sjemenke.", photo: "p-mlinpek-mix", href: "/proizvodi/?kategorija=premium#pekarski" },
  { name: "Peciva", line: "Za jutro i za usput.", photo: "p-kajzerica", href: "/proizvodi/?kategorija=peciva#pekarski" },
  { name: "Slatka peciva", line: "Kroasani, krofne, muffini.", photo: "p-premium-kroasan-cokolada-sa-maslacem", href: "/proizvodi/?kategorija=slatko#pekarski" },
  { name: "Pite", line: "Zvrk po domaću.", photo: "p-zvrk-sa-sirom", href: "/proizvodi/?kategorija=pite#pekarski" },
];

/** 04 — a calm six-image gallery; the middle column sits lower for an editorial rhythm. */
export function ProductsGallery() {
  return (
    <section id="proizvodi" aria-labelledby="proizvodi-title" className="bg-paper text-charcoal">
      <div className="wrap section">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Proizvodi</Eyebrow>
            <h2 id="proizvodi-title" className="title mt-8" data-lines>
              Okusi koji nas povezuju.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-charcoal/55 md:col-span-4 md:col-start-9 md:pb-3" data-reveal>
            Kruh, peciva i pite iz Mlinpekove pekare — izbor iz našeg kataloga proizvoda.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <li key={it.name} className={i % 3 === 1 ? "lg:translate-y-16" : ""} data-reveal>
              <Link href={it.href} className="group block">
                <span className="block overflow-hidden">
                  <span className="block transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.035]">
                    <Photo id={it.photo} ratio="aspect-[4/3] sm:aspect-[4/5]" sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
                  </span>
                </span>
                <span className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="font-display text-[1.75rem] leading-none transition-colors group-hover:text-wheat-deep">{it.name}</span>
                  <span className="text-sm text-charcoal/55">{it.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 lg:mt-28" data-reveal>
          <ArrowLink href="/proizvodi/">Svi proizvodi</ArrowLink>
        </div>
      </div>
    </section>
  );
}
