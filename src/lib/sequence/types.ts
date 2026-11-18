/**
 * Frame-sequence manifest schema.
 * Lives at /public/sequence/manifest.json — see ASSETS.md for the full guide.
 */

export interface SequenceVariant {
  /** Total number of frames in this variant. */
  frameCount: number;
  /**
   * Path pattern relative to /public. `{index}` is replaced with the
   * zero-padded frame number (1-based), e.g. "sequence/desktop/frame_{index}.webp".
   */
  pattern: string;
  /** Zero-padding width for {index}. Default 4 → frame_0001. */
  pad?: number;
  /** Intrinsic pixel size of every frame (all frames must match). */
  width: number;
  height: number;
  /** Per-variant crop focal point (mobile frames are already subject-tracked → centre). */
  focal?: { x: number; y: number };
  /**
   * Master-clip time (s) of every frame, ascending. Lets sampling be non-uniform
   * (denser where scroll is slow). Absent → frames are evenly spread over durationSec.
   */
  frameTimes?: number[];
  /** Mean luminance (0–255) of the headline zone per frame — drives the adaptive scrim. */
  textLuma?: number[];
}

export interface SequenceManifest {
  /**
   * "ready"   → final frames are present, the engine plays them.
   * "missing" → no frames yet; the hero renders the procedural development scene.
   */
  status: "ready" | "missing";
  /** Human note shown in dev tools / ASSETS.md. Not rendered on the page. */
  note?: string;
  /** Cache-busting token appended to frame URLs (frames are served immutable). */
  version?: string;
  /** Length of the master clip in seconds (scroll ↔ time mapping lives in heroTimeline.ts). */
  durationSec?: number;
  /** Normalized focal point (0–1) kept in frame when the canvas crops ("cover"). */
  focal?: { x: number; y: number };
  desktop: SequenceVariant;
  /** Optional lighter variant (fewer frames, smaller, portrait-friendly). */
  mobile?: SequenceVariant;
}

export type VariantKey = "desktop" | "mobile";

export interface LoadProgress {
  loaded: number;
  failed: number;
  total: number;
}
