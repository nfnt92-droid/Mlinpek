import type { SequenceVariant } from "./types";

export interface FramePick {
  /** frame index at or before t */
  i0: number;
  /** next frame index (== i0 at the end) */
  i1: number;
  /** 0–1 position between i0 and i1, for sub-frame blending */
  frac: number;
}

/** Master time → bracketing frames. Uses per-frame times when present (binary search). */
export function frameForTime(variant: SequenceVariant, durationSec: number, t: number): FramePick {
  const n = variant.frameCount;
  const times = variant.frameTimes;
  if (times && times.length === n) {
    if (t <= times[0]) return { i0: 0, i1: 0, frac: 0 };
    if (t >= times[n - 1]) return { i0: n - 1, i1: n - 1, frac: 0 };
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (times[mid] <= t) lo = mid;
      else hi = mid;
    }
    return { i0: lo, i1: hi, frac: (t - times[lo]) / (times[hi] - times[lo]) };
  }
  const x = Math.min(1, Math.max(0, t / durationSec)) * (n - 1);
  const i0 = Math.floor(x);
  return { i0, i1: Math.min(n - 1, i0 + 1), frac: x - i0 };
}
