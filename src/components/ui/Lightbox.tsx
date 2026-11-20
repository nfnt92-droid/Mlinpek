"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS, PROCESSED, type PhotoId } from "@/content/photos";
import { categoryById, type BakeryItem } from "@/content/bakery";
import { CATALOG_PDF, CATALOG_SPECS } from "@/content/catalogSpecs";

/**
 * Product quick view: a centred window (bottom sheet on phones) with a larger photo and
 * the product details — category, weight, availability, ingredients, extra photos and an
 * inquiry link. ←/→ (or swipe on the photo) move between products of the current filter;
 * Esc, ✕ or a click outside closes it. Focus is trapped while open and returned afterwards.
 */
export function ProductQuickView({ items, index, onClose, onIndex }: { items: BakeryItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [photo, setPhoto] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // "spec": the product's KARAKTERISTIKE sheet from the printed catalogue instead of the photo
  const [view, setView] = useState<"photo" | "spec">("photo");
  const n = items.length;
  const it = items[index];
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      html.style.overflow = prev;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    setPhoto(0);
    setView("photo");
    dialog.current?.querySelector("[data-scroll]")?.scrollTo(0, 0);
  }, [index]);
  useEffect(() => setLoaded(false), [index, photo, view]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = [...dialog.current.querySelectorAll<HTMLElement>("button, a[href], summary")];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1]?.focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0]?.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!it) return null;
  const id: PhotoId = it.photos[photo] ?? it.photos[0];
  const p = PROCESSED[id];
  const slot = PHOTOS[id] as { alt?: string };
  const cat = categoryById(it.category) ?? (it.category === "brasno" ? { label: "Brašno" } : undefined);
  const src = (pid: PhotoId, max = 1280) => {
    const pp = PROCESSED[pid];
    if (!pp) return "";
    const w = [...pp.widths].reverse().find((x) => x <= max) ?? pp.widths[0];
    return `/photos/${pid}/${w}.webp`;
  };
  const spec = CATALOG_SPECS[it.name];
  const showSpec = view === "spec" && !!spec;
  const prevItem = items[(index - 1 + n) % n];
  const nextItem = items[(index + 1) % n];
  // same product in another pack size → name the size instead of repeating the name
  const navLabel = (x: BakeryItem) => {
    if (x.name === it.name && x.weight) return x.weight;
    const type = x.category === "brasno" ? x.name.match(/tip\s*\d+/i)?.[0] : undefined; // flour: "Tip 550, 2 kg"
    return type && x.weight ? `${type[0].toUpperCase()}${type.slice(1)}, ${x.weight}` : x.name;
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/70 backdrop-blur-[2px] animate-[fadein_.2s_ease] sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className="relative flex max-h-[92svh] w-full flex-col overflow-hidden bg-paper text-charcoal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:max-h-[88vh] sm:w-[min(1100px,100%)] md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Zatvori brzi pregled"
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center bg-paper/90 text-charcoal transition-colors hover:bg-paper md:bg-transparent"
        >
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>

        {/* photo */}
        <div
          className="relative shrink-0 bg-linen"
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const t0 = touch.current;
            touch.current = null;
            if (!t0) return;
            const dx = e.changedTouches[0].clientX - t0.x;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.changedTouches[0].clientY - t0.y)) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className={`relative w-full md:aspect-auto ${showSpec ? "aspect-square" : "aspect-[4/3]"} md:h-full md:min-h-[min(560px,80vh)]`}>
            {showSpec ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`spec-${spec.slug}`}
                src={`/katalog/${spec.slug}-1200.webp`}
                srcSet={`/katalog/${spec.slug}-640.webp 640w, /katalog/${spec.slug}-1200.webp 1200w`}
                sizes="(min-width: 768px) 640px, 100vw"
                alt={`${it.name} — karakteristike iz kataloga proizvoda: sastojci, dimenzije, pakiranje i rok trajanja`}
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 h-full w-full bg-[#efe7d9] object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                draggable={false}
              />
            ) : p && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={id}
                src={src(id)}
                srcSet={p.widths.map((w) => `/photos/${id}/${w}.webp ${w}w`).join(", ")}
                sizes="(min-width: 768px) 640px, 100vw"
                alt={slot.alt ?? it.name}
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                style={{ objectPosition: "50% 50%" }}
                draggable={false}
              />
            )}
            {p && !loaded && !showSpec && (
              <span aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: `url(${p.blur})`, backgroundSize: "cover" }} />
            )}
          </div>
          {n > 1 && !showSpec && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-2 md:hidden">
              <button type="button" onClick={() => go(-1)} aria-label={`Prethodni proizvod: ${prevItem.name}`} className="pointer-events-auto flex h-11 w-11 items-center justify-center bg-paper/90 text-lg">
                ←
              </button>
              <button type="button" onClick={() => go(1)} aria-label={`Sljedeći proizvod: ${nextItem.name}`} className="pointer-events-auto flex h-11 w-11 items-center justify-center bg-paper/90 text-lg">
                →
              </button>
            </div>
          )}
        </div>

        {/* details */}
        <div data-scroll className="flex min-h-0 flex-col overflow-y-auto">
          <div className="flex-1 px-6 pb-6 pt-7 sm:px-8 md:pt-12">
            {cat && <p className="label text-wheat-deep">{cat.label}</p>}
            <h2 id="qv-title" className="mt-3 pr-8 font-display text-[2rem] leading-[1.05] sm:text-[2.4rem]">
              {it.name}
            </h2>

            {spec && (
              <div className="mt-6 inline-flex border border-charcoal/20 text-[11px] uppercase tracking-[0.18em]" role="group" aria-label="Prikaz">
                {(["photo", "spec"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={`min-h-10 px-4 transition-colors ${view === v ? "bg-charcoal text-ivory" : "text-charcoal/70 hover:bg-linen"}`}
                  >
                    {v === "photo" ? "Fotografija" : "Karakteristike"}
                  </button>
                ))}
              </div>
            )}

            {(it.weight || it.availability?.length) && (
              <dl className={`mt-6 grid gap-px border-y border-charcoal/12 bg-charcoal/12 text-sm ${it.weight && it.availability?.length ? "grid-cols-2" : "grid-cols-1"}`}>
                {it.weight && (
                  <div className="bg-paper py-3 pr-3">
                    <dt className="label text-[10.5px] text-charcoal/50">Gramaža</dt>
                    <dd className="tabular mt-1 text-charcoal/85">{it.weight}</dd>
                  </div>
                )}
                {it.availability?.length ? (
                  <div className="bg-paper py-3 pl-3">
                    <dt className="label text-[10.5px] text-charcoal/50">Dostupno</dt>
                    <dd className="mt-1 text-charcoal/85">{it.availability.join(" · ")}</dd>
                  </div>
                ) : null}
              </dl>
            )}

            <div className="mt-6">
              <p className="label text-[10.5px] text-charcoal/50">{it.ingredients || !it.description ? "Sastav" : "Opis"}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-charcoal/75">
                {it.ingredients ?? it.description ?? "Podaci o sastavu dostupni su na upit."}
              </p>
            </div>

            {it.photos.length > 1 && !showSpec && (
              <div className="mt-6 flex gap-2" role="group" aria-label="Fotografije proizvoda">
                {it.photos.map((pid, i) => (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={`Fotografija ${i + 1}`}
                    aria-pressed={i === photo}
                    className={`h-16 w-20 overflow-hidden border-2 transition-colors ${i === photo ? "border-charcoal" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src(pid, 640)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {spec && (
              <p className="mt-6 text-[13px] leading-relaxed text-charcoal/55">
                Dimenzije, pakiranje, paletizacija i rok trajanja — u kartici „Karakteristike” i u{" "}
                <a href={`${CATALOG_PDF}#page=${spec.page}`} target="_blank" rel="noopener" className="underline decoration-wheat-deep underline-offset-4 hover:text-charcoal">
                  katalogu proizvoda (PDF), str. {spec.page}
                </a>
                .
              </p>
            )}

            <div className="mt-8">
              <Link
                href={`/kontakt/?vrsta=${it.category === "brasno" ? "brasno" : "proizvodi"}&proizvod=${encodeURIComponent(it.weight ? `${it.name}, ${it.weight}` : it.name)}#upit`}
                onClick={onClose}
                className="inline-flex min-h-12 items-center gap-3 bg-charcoal px-6 text-[12px] font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ink"
              >
                Upit za ovaj proizvod <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {n > 1 && (
            <div className="hidden border-t border-charcoal/12 md:grid md:grid-cols-2">
              <button type="button" onClick={() => go(-1)} className="group flex flex-col items-start gap-1 px-8 py-4 text-left transition-colors hover:bg-linen/60">
                <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/45">← Prethodni</span>
                <span className="line-clamp-1 text-sm text-charcoal/80">{navLabel(prevItem)}</span>
              </button>
              <button type="button" onClick={() => go(1)} className="group flex flex-col items-end gap-1 border-l border-charcoal/12 px-8 py-4 text-right transition-colors hover:bg-linen/60">
                <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/45">Sljedeći →</span>
                <span className="line-clamp-1 text-sm text-charcoal/80">{navLabel(nextItem)}</span>
              </button>
            </div>
          )}
          <p className="sr-only" aria-live="polite">{`${index + 1} od ${n}: ${it.name}`}</p>
        </div>
      </div>
    </div>
  );
}
