"use client";

import { CHAPTERS } from "@/config/chapters";
import { SceneStill } from "@/components/ui/SceneStill";
import { timeToProgress } from "@/config/heroTimeline";

/** Representative moment of each chapter, in master seconds → hero progress. */
const STILL_AT: Record<string, number> = {
  zrno: timeToProgress(1.2),
  mlin: timeToProgress(11.5),
  brasno: timeToProgress(16.8),
  tijesto: timeToProgress(19.2),
  kruh: timeToProgress(27.5),
};

/**
 * prefers-reduced-motion: the same five-chapter story as calm, stacked stills.
 * No pinning, no scrubbing, no ambient motion.
 */
export function StaticHero() {
  return (
    <section id="prica" aria-label="Od zrna do kruha — priča u pet poglavlja" className="bg-[#1b1a16]">
      {CHAPTERS.map((ch, i) => (
        <article key={ch.id} className="relative h-[88svh] min-h-[520px] overflow-hidden">
          <SceneStill at={STILL_AT[ch.id] ?? (ch.start + ch.end) / 2} className="absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgba(20,20,17,0.85)_0%,rgba(20,20,17,0.3)_45%,transparent_65%)]"
          />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-[1440px]">
              <p className="eyebrow mb-5 text-wheat">
                <span className="tabular-nums">0{ch.index}</span>
                <span className="mx-3 inline-block h-px w-8 translate-y-[-0.3em] bg-wheat/60 align-middle" />
                {ch.label}
              </p>
              {i === 0 ? (
                <h1 className="display max-w-[16ch] text-ivory">{ch.headline}</h1>
              ) : (
                <h2 className="display max-w-[16ch] text-ivory">{ch.headline}</h2>
              )}
              <p className="mt-5 max-w-[34ch] leading-relaxed text-ivory/70">{ch.lede}</p>
              {i === CHAPTERS.length - 1 && (
                <a
                  href="#proizvodi"
                  className="mt-8 inline-flex items-center gap-4 border-b border-wheat/50 pb-2 text-[12px] font-medium uppercase tracking-[0.24em] text-ivory hover:border-wheat hover:text-wheat"
                >
                  Istražite naše proizvode <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
