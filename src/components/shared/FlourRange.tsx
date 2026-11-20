"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { ProductQuickView } from "@/components/ui/Lightbox";
import { FLOUR_ITEMS, FLOUR_LEAD } from "@/content/bakery";

/** the 25 kg lead pack first, then tip 550 in 1, 2 and 5 kg */
const ITEMS = [FLOUR_LEAD, ...FLOUR_ITEMS];
const typeOf = (name: string) => name.match(/tip\s*(\d+)/i)?.[1];

/** The mill's flour in its new packaging: four packs, each opens the quick view. */
export function FlourRange() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <li key={`${it.name}-${it.weight}`} data-reveal>
            <article className="group">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Brzi pregled: ${it.name}, ${it.weight}`}
                className="relative block w-full cursor-zoom-in overflow-hidden"
              >
                <span className="block transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]">
                  <Photo id={it.photos[0]} ratio="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 flex h-9 items-center bg-ink/55 px-3 text-[11px] uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-opacity group-hover:opacity-100 md:opacity-0"
                >
                  Brzi pregled
                </span>
              </button>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[1.6rem] leading-tight">Tip {typeOf(it.name)}</h3>
                <span className="tabular font-display text-[1.6rem] text-wheat-deep">{it.weight}</span>
              </div>
              <p className="mt-1 text-sm text-charcoal/60">{it === FLOUR_LEAD ? "Premium · pšenično bijelo brašno" : "Pšenično bijelo brašno"}</p>
            </article>
          </li>
        ))}
      </ul>
      {open !== null && <ProductQuickView items={ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
