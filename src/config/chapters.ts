import { CHAPTER_TIMES, timeToProgress } from "./heroTimeline";

/**
 * The five hero chapters. `start`/`end` are fractions of hero scroll (0–1), derived
 * from the seconds in heroTimeline.ts so headlines follow what is actually on screen.
 * Gaps between chapters are allowed (picture only during transitions).
 */
export interface Chapter {
  id: string;
  index: number;
  label: string;
  headline: string;
  lede: string;
  start: number;
  end: number;
}

type ChapterCopy = Omit<Chapter, "start" | "end">;

const COPY: ChapterCopy[] = [
  {
    id: "zrno",
    index: 1,
    label: "Zrno",
    headline: "Sve počinje jednim zrnom.",
    lede: "Odabrana pšenica, ubrana u pravo vrijeme.",
  },
  {
    id: "mlin",
    index: 2,
    label: "Mlin",
    headline: "Preciznost u svakom mljevenju.",
    lede: "Zrno putuje kroz valjke koji rade s mjerom i strpljenjem.",
  },
  {
    id: "brasno",
    index: 3,
    label: "Brašno",
    headline: "Temelj svakog dobrog kruha.",
    lede: "Fino, ujednačeno, spremno za ruke pekara.",
  },
  {
    id: "tijesto",
    index: 4,
    label: "Tijesto",
    headline: "Znanje koje se prenosi generacijama.",
    lede: "Voda, sol, vrijeme — i ruke koje znaju.",
  },
  {
    id: "kruh",
    index: 5,
    label: "Kruh",
    headline: "Od našeg mlina do vašeg stola.",
    lede: "Topao, svjež, svaki dan.",
  },
];

export const CHAPTERS: Chapter[] = COPY.map((c, i) => {
  const [t0, t1] = CHAPTER_TIMES[c.id];
  return {
    ...c,
    start: i === 0 ? 0 : timeToProgress(t0),
    end: i === COPY.length - 1 ? 1 : timeToProgress(t1),
  };
});

/** Index of the chapter whose window has most recently opened at progress p. */
export function activeChapterAt(p: number): number {
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) if (p >= CHAPTERS[i].start - 0.002) idx = i;
  return idx;
}

/**
 * Maps hero progress onto the procedural development scene, whose own chapters are
 * equal fifths — keeps the fallback in step with the real timeline.
 */
export function toSceneProgress(p: number): number {
  const i = activeChapterAt(p);
  const c = CHAPTERS[i];
  const next = CHAPTERS[i + 1]?.start ?? 1;
  const local = Math.min(1, Math.max(0, (p - c.start) / Math.max(1e-6, next - c.start)));
  return (i + local) / CHAPTERS.length;
}

export const BRAND = "OD ZRNA DO KRUHA";
