import { FramedCompositor, drawStageImage, featherStage } from "@/lib/canvas";
import { renderProceduralScene } from "@/lib/scene/proceduralScene";
import { frameForTime } from "@/lib/sequence/timeline";
import { MASTER_DURATION, focalAt, progressToTime } from "@/config/heroTimeline";
import { toSceneProgress } from "@/config/chapters";
import type { FrameSource } from "./useFrameSource";

const CHARCOAL = "#1b1a16";

/**
 * A missing exact frame may be stood in for by a loaded neighbour this close (in frames).
 * Farther away it could belong to another scene, so the previous picture is kept instead.
 */
const MAX_SUBSTITUTE = 6;

/**
 * Desktop/landscape stages get the wider "framed" composition (see DESKTOP_FRAMING);
 * phones and portrait tablets keep their own full-bleed cut.
 */
const FRAMED_MIN_WIDTH = 1024;
const compositors = new WeakMap<HTMLCanvasElement, FramedCompositor>();
function compositorFor(canvas: HTMLCanvasElement): FramedCompositor {
  let c = compositors.get(canvas);
  if (!c) compositors.set(canvas, (c = new FramedCompositor()));
  return c;
}

export interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  progress: number;
  time: number;
  source: FrameSource;
  /** CSS px at the bottom of a tall phone stage reserved for the headline block */
  reserve: number;
  /** canvas was just resized/cleared — anything is better than nothing */
  mustPaint: boolean;
}

export interface DrawResult {
  /** frame index the loader should prioritise (-1 = n/a) */
  index: number;
  /** master time in seconds (sequence mode) */
  t: number;
  /** true when new pixels were put on the canvas */
  painted: boolean;
  /** true when the right frame isn't loaded yet and the previous picture was kept */
  held: boolean;
  /** headline-zone luminance 0–255 of what is on screen (-1 unknown) */
  luma: number;
  /** time (manifest seconds) of the frame actually on the canvas; -1 = unchanged / none */
  shownT: number;
}

/**
 * Hero progress → master time (heroTimeline) → bracketing frames, blended by the
 * sub-frame fraction so scrubbing stays fluid with every 2nd/4th frame shipped.
 */
export function drawHeroFrame(a: DrawArgs): DrawResult {
  const { ctx, width, height, dpr, progress, time, source } = a;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  if (source.mode === "sequence" && source.loader && source.variant) {
    const v = source.variant;
    const dur = source.manifest?.durationSec;
    // manifests without durationSec (generic builds) fall back to a linear mapping
    const masterT = progressToTime(progress);
    const t = dur ? (masterT / MASTER_DURATION) * dur : progress;
    const pick = frameForTime(v, dur ?? 1, t);
    const f = focalAt(masterT);
    const mobileFrames = source.variantKey === "mobile";
    const focal = mobileFrames ? { x: 0.5, y: f.my } : { x: f.x, y: f.y };
    const luma = v.textLuma ? v.textLuma[pick.i0] + ((v.textLuma[pick.i1] ?? 0) - v.textLuma[pick.i0]) * pick.frac : -1;

    const exact0 = source.loader.get(pick.i0);
    const baseIndex = exact0 ? pick.i0 : source.loader.nearestIndex(pick.i0, a.mustPaint ? Infinity : MAX_SUBSTITUTE);
    const base = baseIndex >= 0 ? source.loader.get(baseIndex) : undefined;
    if (!base) {
      if (a.mustPaint) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = CHARCOAL;
        ctx.fillRect(0, 0, W, H);
      }
      return { index: pick.i0, t, painted: false, held: true, luma, shownT: -1 };
    }
    const shownT = exact0
      ? t
      : (v.frameTimes?.[baseIndex] ?? (baseIndex / Math.max(1, v.frameCount - 1)) * (dur ?? 1));

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = CHARCOAL;
    ctx.fillRect(0, 0, W, H);

    const next = source.loader.get(pick.i1);
    const blend = exact0 && next && pick.i1 !== pick.i0 && pick.frac > 0.04 ? next : undefined;
    if (!mobileFrames && width >= FRAMED_MIN_WIDTH && width >= height) {
      compositorFor(ctx.canvas).draw(ctx, base, blend, pick.frac, focal, CHARCOAL);
    } else {
      const reserve = a.reserve * (W / Math.max(1, width));
      drawStageImage(ctx, base, W, H, focal, 1, reserve);
      if (blend) drawStageImage(ctx, blend, W, H, focal, pick.frac, reserve);
      featherStage(ctx, W, H, CHARCOAL, reserve);
    }
    return { index: pick.frac > 0.5 ? pick.i1 : pick.i0, t, painted: true, held: !exact0, luma, shownT };
  }

  if (source.mode === "procedural") {
    renderProceduralScene(ctx, { width, height, dpr, progress: toSceneProgress(progress), time });
    return { index: -1, t: 0, painted: true, held: false, luma: -1, shownT: -1 };
  }

  // "checking": transparent → the poster behind the canvas stays visible (no flash)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  return { index: -1, t: 0, painted: false, held: false, luma: -1, shownT: -1 };
}
