/**
 * Hero master timeline — the single source of truth that ties scroll position,
 * video time and headlines together.
 *
 * Master (built by scripts/build-hero-from-clips.mjs), 28.875 s:
 *
 *   0.00 –  9.04   01-zrno   ear (≈0–2.5) → grains release (≈2.5–6) → grains fall on a pile
 *   9.04 – 10.04   dissolve  grain stream → grain stream into the mill (lateral drift)
 *  10.04 – 14.90   02-mlin   grains enter the roller mill, flour starts to pour
 *  14.90 – 18.08   02-mlin   mill leaves frame; flour pours onto a mound
 *  18.08 – 18.83   dissolve  flour mound → dough (graphic match, flour bloom)
 *  18.83 – 20.10   03-kruh   hands kneading  ← only ~1.3 s in the source: scroll is slowed here
 *  20.10 – 24.40   03-kruh   dough rests, flour cloud, loaf forms inside it
 *  24.40 – 28.88   03-kruh   loaf revealed, steam settles — then held (CTA appears)
 *
 * If the clips are re-exported or re-timed, update MASTER_DURATION, SPEED, CHAPTER_TIMES
 * and SCENE_FOCAL.
 */

export const MASTER_DURATION = 28.875;

/** Fraction of hero scroll spent on the opening frame and on the final held frame. */
const HOLD_START = 0.03;
/** Short final hold: the loaf + CTA land, then the page continues right away (client, 23. 11. 2026). */
const HOLD_END = 0.025;

/** Relative scroll cost per second of video. >1 = the visitor scrolls further for that stretch. */
const SPEED: [from: number, to: number, weight: number][] = [
  [0, 2.5, 1.35], // let the single ear breathe
  [2.5, 10.6, 1],
  [10.6, 12.8, 1.45], // dwell: grains streaming through the rollers
  [12.8, 15.6, 1],
  [15.6, 17.6, 1.35], // dwell: flour settling on the mound
  [17.6, 18.83, 1],
  [18.83, 20.1, 2.6], // kneading hands (the source take is only ~1.3 s)
  [20.1, 24.4, 1],
  [24.4, 26.2, 1.3], // dwell: the loaf emerges from the flour cloud
  [26.2, MASTER_DURATION, 0.75], // steam settles — keep it short so the page flows on
];

const totalWeight = SPEED.reduce((a, [f, t, w]) => a + (t - f) * w, 0);
const span = 1 - HOLD_START - HOLD_END;

/** Scroll progress (0–1) → master time (s). Monotonic: reversing scroll reverses time exactly. */
export function progressToTime(p: number): number {
  if (p <= HOLD_START) return 0;
  if (p >= 1 - HOLD_END) return MASTER_DURATION;
  let budget = ((p - HOLD_START) / span) * totalWeight;
  for (const [f, t, w] of SPEED) {
    const cost = (t - f) * w;
    if (budget <= cost) return f + budget / w;
    budget -= cost;
  }
  return MASTER_DURATION;
}

/** Master time (s) → scroll progress (0–1). Inverse of progressToTime. */
export function timeToProgress(time: number): number {
  if (time <= 0) return HOLD_START;
  if (time >= MASTER_DURATION) return 1 - HOLD_END;
  let acc = 0;
  for (const [f, t, w] of SPEED) {
    if (time <= t) {
      acc += (time - f) * w;
      break;
    }
    acc += (t - f) * w;
  }
  return HOLD_START + (acc / totalWeight) * span;
}

/**
 * When each headline is on screen, in master seconds — set from the actual frames:
 * MLIN only once the mill is in shot, TIJESTO only after the mill and the mound are gone.
 * Gaps between chapters are intentional (picture only, no headline, during transitions).
 */
export const CHAPTER_TIMES: Record<string, [number, number]> = {
  zrno: [0, 8.85], // ear, release, fall — out before the mill ghosts in (9.3)
  mlin: [9.9, 14.6], // in once the mill is fully resolved (dissolve ends 10.04)
  brasno: [14.95, 18.2], // mill has left frame; out before the dough appears
  tijesto: [19.0, 22.6], // hands fully opaque; out as the flour cloud rises
  kruh: [24.4, MASTER_DURATION], // in once the loaf is legible inside the cloud
};

/** The loaf is stable (cloud gone, only steam) — the CTA may appear from here. */
export const CTA_FROM = 27.2;

/**
 * Scene-specific focal points, used when the frame is cropped by the viewport
 * (ultrawide crops top/bottom, 4:3 crops the sides, short phones crop the 3:4 band).
 * [master second, desktop x, desktop y, mobile y] — fractions of the frame.
 * Desktop x leans right so the subject keeps clear of the left-hand headline column.
 */
const SCENE_FOCAL: [t: number, x: number, y: number, my: number][] = [
  [0, 0.7, 0.42, 0.45], // ear: keep the tip
  [6.0, 0.66, 0.55, 0.5], // falling grains, pile on the floor
  [9.04, 0.66, 0.55, 0.5],
  [10.04, 0.74, 0.52, 0.5], // roller mill
  [14.6, 0.66, 0.6, 0.6], // flour stream → mound
  [18.08, 0.66, 0.62, 0.6],
  [19.0, 0.7, 0.6, 0.62], // dough under the hands
  [24.4, 0.7, 0.64, 0.62], // loaf on the board
  [MASTER_DURATION, 0.7, 0.64, 0.62],
];

const smooth = (u: number) => u * u * (3 - 2 * u);

export function focalAt(time: number): { x: number; y: number; my: number } {
  const k = SCENE_FOCAL;
  if (time <= k[0][0]) return { x: k[0][1], y: k[0][2], my: k[0][3] };
  for (let i = 1; i < k.length; i++) {
    if (time <= k[i][0]) {
      const [t0, x0, y0, m0] = k[i - 1];
      const [t1, x1, y1, m1] = k[i];
      const u = smooth((time - t0) / (t1 - t0));
      return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u, my: m0 + (m1 - m0) * u };
    }
  }
  const l = k[k.length - 1];
  return { x: l[1], y: l[2], my: l[3] };
}
