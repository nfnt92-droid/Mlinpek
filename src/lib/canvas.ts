/**
 * Device-pixel-ratio aware canvas helpers.
 */

export interface CanvasSize {
  /** CSS pixels */
  width: number;
  height: number;
  /** Backing-store scale actually applied */
  dpr: number;
}

/** DPR is capped: 2 on desktop, 1.5 on small screens — beyond that costs fill-rate for no visible gain. */
export function effectiveDpr(cssWidth: number): number {
  const raw = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const cap = cssWidth < 820 ? 1.5 : 2;
  return Math.min(raw, cap);
}

/** Sizes the backing store to the element's CSS box. Returns true if it changed. */
export function syncCanvasSize(canvas: HTMLCanvasElement, size: CanvasSize): boolean {
  const w = Math.round(size.width * size.dpr);
  const h = Math.round(size.height * size.dpr);
  if (canvas.width === w && canvas.height === h) return false;
  canvas.width = w;
  canvas.height = h;
  return true;
}

/**
 * Draws a source with "object-fit: cover" semantics, keeping a normalized
 * focal point in view when cropping (so the subject survives portrait crops).
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource & { width: number; height: number },
  dw: number,
  dh: number,
  focal = { x: 0.5, y: 0.5 },
  dx = 0,
  dy = 0,
): void {
  const sw = src.width;
  const sh = src.height;
  const scale = Math.max(dw / sw, dh / sh);
  const cw = dw / scale; // visible source width
  const ch = dh / scale;
  const sx = clamp(focal.x * sw - cw / 2, 0, sw - cw);
  const sy = clamp(focal.y * sh - ch / 2, 0, sh - ch);
  ctx.drawImage(src, sx, sy, cw, ch, dx, dy, dw, dh);
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface StageRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** true when the image sits in a band and the rest of the stage is charcoal */
  band: boolean;
}

/**
 * Where the film sits on the stage. Landscape/near-square: full bleed.
 * Tall phone screens: a 3:4 band at the top, art-directed so the subject stays whole,
 * ending where the headline block begins (`reserve` = its height in canvas px, measured
 * from the DOM). On short phones the band gets shorter and the 3:4 frame is cropped
 * vertically around the scene's focal point instead of running under the text.
 */
export function stageRect(W: number, H: number, _reserve = 0): StageRect {
  // Full-bleed on every aspect ratio. (Portrait phones used to get a framed band above the
  // headlines; the client asked for the film to fill the whole screen on phones and tablets.)
  return { x: 0, y: 0, w: W, h: H, band: false };
}

/** Draw a frame into the stage rect. `alpha` for sub-frame blends. */
export function drawStageImage(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number },
  W: number,
  H: number,
  focal?: { x: number; y: number },
  alpha = 1,
  reserve = 0,
): void {
  const r = stageRect(W, H, reserve);
  ctx.globalAlpha = alpha;
  drawCover(ctx, img, r.w, r.h, focal, r.x, r.y);
  ctx.globalAlpha = 1;
}

/** Feather a banded stage into the charcoal ground (no-op when full bleed). */
export function featherStage(ctx: CanvasRenderingContext2D, W: number, H: number, bg: string, reserve = 0): void {
  const r = stageRect(W, H, reserve);
  if (!r.band) return;
  ctx.fillStyle = bg;
  ctx.fillRect(0, r.y + r.h - 1, W, H - (r.y + r.h) + 1);
  if (r.y > 0) ctx.fillRect(0, 0, W, r.y + 1);
  const f0 = r.y + r.h * 0.62;
  const fadeBottom = ctx.createLinearGradient(0, f0, 0, r.y + r.h);
  fadeBottom.addColorStop(0, "rgba(27,26,22,0)");
  fadeBottom.addColorStop(0.55, "rgba(27,26,22,0.55)");
  fadeBottom.addColorStop(1, bg);
  ctx.fillStyle = fadeBottom;
  ctx.fillRect(0, f0, W, r.y + r.h - f0 + 1);
  const fadeTop = ctx.createLinearGradient(0, r.y, 0, r.y + r.h * 0.12);
  fadeTop.addColorStop(0, bg);
  fadeTop.addColorStop(1, "rgba(27,26,22,0)");
  ctx.fillStyle = fadeTop;
  ctx.fillRect(0, r.y, W, r.h * 0.12);
}

// ── desktop framing: the film sits ~16% smaller than "cover", its edges dissolving into a
// soft, slightly dimmed enlargement of the same frame — wider camera distance without bars.
// The footage itself is already tightly cropped (1916×1080 clips → 1760×990 master to drop the
// watermark), so this is the widest honest framing: nothing outside the frame is invented,
// the surround is only defocused picture.

export const DESKTOP_FRAMING = {
  /** fraction of the "cover" scale the sharp frame is drawn at */
  scale: 0.84,
  /** feather width as a fraction of the drawn frame, per axis */
  featherX: 0.1,
  featherY: 0.14,
  /** dim applied to the defocused surround so the eye stays on the frame */
  surroundDim: 0.24,
} as const;

export interface FrameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where the sharp frame goes: centred on an axis it fits, focal-cropped (like cover) where it overflows. */
export function framedRect(W: number, H: number, sw: number, sh: number, focal: { x: number; y: number }, k: number): FrameRect {
  const s = Math.max(W / sw, H / sh) * k;
  const w = sw * s;
  const h = sh * s;
  const x = w <= W ? (W - w) / 2 : clamp(W / 2 - focal.x * w, W - w, 0);
  const y = h <= H ? (H - h) / 2 : clamp(H / 2 - focal.y * h, H - h, 0);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

type Img = CanvasImageSource & { width: number; height: number };

/** Reusable offscreen buffers for the framed composite (one per hero canvas). */
export class FramedCompositor {
  private fg = document.createElement("canvas");
  private mask = document.createElement("canvas");
  private soft = document.createElement("canvas");
  private maskKey = "";
  private blurOk: boolean;

  constructor() {
    this.soft.width = 192;
    this.soft.height = 108;
    const t = this.soft.getContext("2d")!;
    this.blurOk = "filter" in t;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    base: Img,
    next: Img | undefined,
    frac: number,
    focal: { x: number; y: number },
    bg: string,
  ): void {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const F = DESKTOP_FRAMING;
    const r = framedRect(W, H, base.width, base.height, focal, F.scale);

    // 1 — defocused surround: the frame shrunk to 192 px wide (soft blur for free), drawn at cover
    const sc = this.soft.getContext("2d")!;
    sc.globalAlpha = 1;
    if (this.blurOk) sc.filter = "blur(3px)";
    sc.drawImage(base, 0, 0, this.soft.width, this.soft.height);
    if (next) {
      sc.globalAlpha = frac;
      sc.drawImage(next, 0, 0, this.soft.width, this.soft.height);
      sc.globalAlpha = 1;
    }
    if (this.blurOk) sc.filter = "none";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    drawCover(ctx, this.soft, W, H, focal);
    ctx.fillStyle = withAlpha(bg, F.surroundDim);
    ctx.fillRect(0, 0, W, H);

    // 2 — sharp frame, feathered on the axes where it does not reach the stage edge
    if (this.fg.width !== W || this.fg.height !== H) {
      this.fg.width = this.mask.width = W;
      this.fg.height = this.mask.height = H;
      this.maskKey = "";
    }
    this.buildMask(r, W, H);
    const fc = this.fg.getContext("2d")!;
    fc.globalCompositeOperation = "source-over";
    fc.clearRect(0, 0, W, H);
    fc.imageSmoothingEnabled = true;
    fc.imageSmoothingQuality = "high";
    fc.drawImage(base, r.x, r.y, r.w, r.h);
    if (next) {
      fc.globalAlpha = frac;
      fc.drawImage(next, r.x, r.y, r.w, r.h);
      fc.globalAlpha = 1;
    }
    fc.globalCompositeOperation = "destination-in";
    fc.drawImage(this.mask, 0, 0);
    fc.globalCompositeOperation = "source-over";
    ctx.drawImage(this.fg, 0, 0);
  }

  private buildMask(r: FrameRect, W: number, H: number) {
    const key = `${r.x},${r.y},${r.w},${r.h},${W},${H}`;
    if (key === this.maskKey) return;
    this.maskKey = key;
    const m = this.mask.getContext("2d")!;
    m.globalCompositeOperation = "source-over";
    m.clearRect(0, 0, W, H);
    m.fillStyle = r.w < W ? ramp(m, r.x, 0, r.x + r.w, 0, DESKTOP_FRAMING.featherX) : "#fff";
    m.fillRect(0, 0, W, H);
    if (r.h < H) {
      m.globalCompositeOperation = "destination-in";
      m.fillStyle = ramp(m, 0, r.y, 0, r.y + r.h, DESKTOP_FRAMING.featherY);
      m.fillRect(0, 0, W, H);
      m.globalCompositeOperation = "source-over";
    }
  }
}

/** 0 → 1 → 1 → 0 alpha ramp along a line, smoothstep-shaped feather of width f at each end. */
function ramp(m: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, f: number): CanvasGradient {
  const g = m.createLinearGradient(x0, y0, x1, y1);
  const steps = [0, 0.25, 0.5, 0.75, 1];
  for (const t of steps) g.addColorStop(t * f, `rgba(255,255,255,${(t * t * (3 - 2 * t)).toFixed(3)})`);
  for (const t of steps) g.addColorStop(1 - t * f, `rgba(255,255,255,${(t * t * (3 - 2 * t)).toFixed(3)})`);
  return g;
}

function withAlpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
