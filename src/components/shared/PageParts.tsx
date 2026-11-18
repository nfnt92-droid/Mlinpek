import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";
import { SITE } from "@/content/site";

type Tone = "paper" | "ivory" | "linen" | "ink" | "steel" | "oven";
const BG: Record<Tone, string> = {
  paper: "bg-paper text-charcoal",
  ivory: "bg-ivory text-charcoal",
  linen: "bg-linen text-charcoal",
  ink: "bg-ink text-ivory",
  steel: "bg-steel text-ivory",
  oven: "bg-oven text-ivory",
};
export const isDark = (t: Tone) => t === "ink" || t === "steel" || t === "oven";

/** Opening spread of every inner page: label, h1, large title line, lede, monumental photograph. */
export function PageHero({
  tone,
  label,
  title,
  lede,
  photo,
  children,
}: {
  tone: Tone;
  label: string;
  title: ReactNode;
  lede: ReactNode;
  photo?: PhotoId;
  children?: ReactNode;
}) {
  const dark = isDark(tone);
  return (
    <header className={BG[tone]}>
      <div className="wrap pb-14 pt-36 md:pb-20 md:pt-48">
        <Eyebrow tone={dark ? "light" : "dark"}>
          <Link href="/" className="hit opacity-60 transition-opacity hover:opacity-100">
            Naslovnica
          </Link>
          <span aria-hidden="true" className="mx-3 opacity-40">/</span>
          <span aria-current="page">{label}</span>
        </Eyebrow>
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end md:gap-8">
          <h1 className="title md:col-span-7" data-lines>
            {title}
          </h1>
          <div className={`lede measure md:col-span-4 md:col-start-9 ${dark ? "text-ivory/70" : "text-charcoal/70"}`} data-reveal>
            {lede}
          </div>
        </div>
        {children}
      </div>
      {photo && (
        <div className="wrap pb-4">
          <Photo id={photo} ratio="aspect-[4/3] md:aspect-[16/9]" parallax priority sizes="(min-width: 1260px) 1160px, 100vw" />
        </div>
      )}
    </header>
  );
}

/** Standard page section with tone + generous rhythm. */
export function Section({
  tone,
  children,
  className = "",
  labelledBy,
  id,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${BG[tone]} ${className}`}>
      <div className="wrap section">{children}</div>
    </section>
  );
}

/** Shared page metadata (title, description, canonical, Open Graph). */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} — ${SITE.brand}`, description, url: path, type: "website", locale: "hr_HR", siteName: SITE.brand },
  };
}
