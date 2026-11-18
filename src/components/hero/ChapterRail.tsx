"use client";

import { CHAPTERS } from "@/config/chapters";

/** Chapter index on the right edge. Buttons jump to a chapter via native smooth scroll. */
export function ChapterRail({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <nav
      aria-label="Poglavlja priče"
      className="absolute right-6 top-1/2 hidden -translate-y-1/2 sm:right-10 md:block lg:right-16"
    >
      <ol className="flex flex-col gap-4">
        {CHAPTERS.map((ch, i) => {
          const on = i === active;
          return (
            <li key={ch.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={on ? "step" : undefined}
                className="group flex items-center justify-end gap-3 py-1 text-[11px] uppercase tracking-[0.26em] focus-visible:outline-none"
              >
                <span
                  className={`transition-colors duration-500 ${
                    on ? "text-ivory" : "text-ivory/35 group-hover:text-ivory/70 group-focus-visible:text-ivory/80"
                  }`}
                >
                  {ch.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-500 ${on ? "w-10 bg-wheat" : "w-4 bg-ivory/30"}`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
