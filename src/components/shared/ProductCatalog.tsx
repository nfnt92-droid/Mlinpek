"use client";

import { useEffect, useState } from "react";
import { BAKERY_CATEGORIES, BAKERY_ITEMS, categoryById } from "@/content/bakery";
import { Photo } from "@/components/ui/Photo";
import { ProductQuickView } from "@/components/ui/Lightbox";

/**
 * Filterable bakery catalogue: weight, availability, ingredients under "Sastav"; photos open a quick-view window. The filter is mirrored in ?kategorija= so homepage
 * category links land pre-filtered and the state survives sharing/back navigation.
 */
export function ProductCatalog() {
  const [cat, setCat] = useState<string>("sve");
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("kategorija");
    if (k && categoryById(k)) setCat(k);
  }, []);

  const choose = (id: string) => {
    setCat(id);
    const url = new URL(window.location.href);
    if (id === "sve") url.searchParams.delete("kategorija");
    else url.searchParams.set("kategorija", id);
    window.history.replaceState(null, "", url);
  };

  const items = cat === "sve" ? BAKERY_ITEMS : BAKERY_ITEMS.filter((i) => i.category === cat);
  const filters = [{ id: "sve", label: "Sve" }, ...BAKERY_CATEGORIES];

  return (
    <div>
      <div role="group" aria-label="Filtriraj po kategoriji" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] md:mx-0 md:flex-wrap md:px-0">
        {filters.map((f) => {
          const on = cat === f.id;
          const count = f.id === "sve" ? BAKERY_ITEMS.length : BAKERY_ITEMS.filter((i) => i.category === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => choose(f.id)}
              className={`min-h-11 shrink-0 border px-5 py-3 text-[12px] uppercase tracking-[0.2em] transition-colors ${
                on ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 text-charcoal/65 hover:border-charcoal/50 hover:text-charcoal"
              }`}
            >
              {f.label} <span className="tabular opacity-50">{count}</span>
            </button>
          );
        })}
      </div>

      {cat !== "sve" && (
        <p className="subtitle mt-12 max-w-[30ch] text-charcoal/80" aria-live="polite">
          {categoryById(cat)?.line}
        </p>
      )}

      <ul key={cat} className="mt-12 grid animate-[fadein_.5s_ease] gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => {
          const c = categoryById(it.category)!;
          return (
            <li key={it.name}>
              <article className="group">
                <button
                  type="button"
                  onClick={() => setOpen(items.indexOf(it))}
                  className="relative block w-full cursor-zoom-in overflow-hidden text-left"
                  aria-label={`Brzi pregled: ${it.name}`}
                >
                  <span className="block transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]">
                    <Photo id={it.photos[0]} ratio="aspect-[4/3]" sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 flex h-9 items-center gap-2 bg-ink/55 px-3 text-[11px] uppercase tracking-[0.18em] text-ivory opacity-90 backdrop-blur-sm transition-opacity group-hover:opacity-100 md:opacity-0"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5M7 5v4M5 7h4" /></svg>
                    Brzi pregled
                  </span>
                </button>
                <p className="label mt-4 text-wheat-deep">{c.label}</p>
                <h3 className="mt-2 font-display text-[1.6rem] leading-tight">{it.name}</h3>
                {(it.weight || it.availability?.length) && (
                  <p className="mt-2 text-sm text-charcoal/60">
                    {it.weight && <span className="tabular">{it.weight}</span>}
                    {it.weight && it.availability?.length ? " · " : ""}
                    {it.availability?.join(" · ")}
                  </p>
                )}
                {it.ingredients && (
                  <details className="group/sastav mt-3 text-sm">
                    <summary className="hit relative inline-flex cursor-pointer list-none items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-charcoal/60 transition-colors hover:text-charcoal [&::-webkit-details-marker]:hidden">
                      Sastav
                      <span aria-hidden="true" className="transition-transform group-open/sastav:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-charcoal/70">{it.ingredients}</p>
                  </details>
                )}
              </article>
            </li>
          );
        })}
      </ul>
      {open !== null && open >= 0 && <ProductQuickView items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
