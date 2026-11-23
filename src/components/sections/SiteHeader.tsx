"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/content/site";
import { Logo } from "@/components/ui/Logo";

/**
 * Fixed header with the Mlinpek logo. Transparent over the hero film (ivory nav) and at the
 * top of light pages; becomes a solid paper bar as soon as the page scrolls, so it never
 * overlaps text or photographs (the old blend-mode header did, especially on phones).
 * Desktop ≥1024px: the five-item bar. Below: "Izbornik" opens a full-screen menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // "film": transparent over the dark hero · "top": transparent at the top of a light page · "solid": paper bar
  const [mode, setMode] = useState<"film" | "top" | "solid">(pathname === "/" ? "film" : "top");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // close on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (pathname === "/") {
        const hero = document.getElementById("prica");
        const end = hero ? hero.offsetTop + hero.offsetHeight - 80 : 0;
        setMode(y < end ? "film" : "solid");
      } else {
        setMode(y > 24 ? "solid" : "top");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const light = mode === "film"; // ivory text over the film
  const bar =
    mode === "solid"
      ? "bg-paper/95 shadow-[0_1px_0_rgba(41,41,35,0.08)] backdrop-blur-md"
      : "bg-transparent";
  const text = light ? "text-ivory" : "text-charcoal";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${bar}`}>
        <div className={`wrap flex items-center justify-between gap-4 transition-[padding] duration-500 ${mode === "solid" ? "py-2.5" : "py-4 md:py-5"}`}>
          <Link href="/" className="-my-1 block shrink-0" aria-label={`${SITE.brand} — naslovnica`}>
            <Logo
              tone={light ? "gold" : "deep"}
              className={`transition-[width] duration-500 ${
                mode === "solid" ? "w-[88px] md:w-[108px]" : light ? "w-[118px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:w-[164px]" : "w-[108px] md:w-[148px]"
              }`}
              priority
            />
          </Link>
          <nav aria-label="Glavna navigacija">
            <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 xl:tracking-[0.22em] ${text} ${
                      isActive(item.href)
                        ? `underline underline-offset-[8px] ${light ? "decoration-ivory/50" : "decoration-wheat-deep"}`
                        : `${light ? "opacity-75" : "opacity-70"} hover:opacity-100`
                    }`}
                  >
                    {item.short ?? item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`-my-2 -mr-3 flex min-h-11 items-center gap-3 px-3 text-[12px] uppercase tracking-[0.22em] lg:hidden ${text}`}
            >
              <span className="max-[359px]:sr-only">Izbornik</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
                <span className="block h-px w-full bg-current" />
                <span className="block h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </nav>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} isActive={isActive} />
    </>
  );
}

function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (h: string) => boolean }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = [...panelRef.current.querySelectorAll<HTMLElement>("a, button")];
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="site-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Izbornik"
      hidden={!open}
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink text-ivory"
    >
      <div className="wrap flex min-h-full flex-col py-4">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} aria-label={`${SITE.brand} — naslovnica`}>
            <Logo className="w-[104px]" />
          </Link>
          <button type="button" onClick={onClose} className="-mr-3 flex min-h-11 items-center gap-3 px-3 text-[12px] uppercase tracking-[0.22em]">
            Zatvori
            <span aria-hidden="true" className="relative block h-4 w-4">
              <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-ivory" />
              <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-ivory" />
            </span>
          </button>
        </div>
        <nav aria-label="Izbornik" className="mt-14 flex-1">
          <ol className="border-t border-ivory/12">
            {NAV.map((item, i) => (
              <li key={item.href} className="border-b border-ivory/12">
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group flex items-baseline gap-5 py-4"
                >
                  <span className="label tabular w-6 text-wheat/80">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`font-display text-[clamp(1.9rem,7vw,3rem)] leading-none transition-colors group-hover:text-wheat ${
                      isActive(item.href) ? "text-wheat" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <p className="mt-10 font-display text-2xl italic text-ivory/50">Od zrna do kruha.</p>
      </div>
    </div>
  );
}
