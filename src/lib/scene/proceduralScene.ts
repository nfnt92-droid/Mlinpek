/**
 * ───────────────────────────────────────────────────────────────────────────
 *  DEVELOPMENT FALLBACK SCENE — NOT FINAL ARTWORK
 * ───────────────────────────────────────────────────────────────────────────
 * A procedural canvas stand-in for the final photographic frame sequence.
 *
 * It exists so the scroll framework, pacing, chapter timing and lighting arc can
 * be reviewed before footage exists. It is deliberately one continuous world:
 * a single camera tilts down from the ear, through the rollers, into the flour
 * beam and onto the bench — and every object state is a pure function of
 * scroll progress `p`, so scrolling backwards reverses it exactly.
 *
 * `time` only drives ambient life (sway, drifting dust, steam) and is frozen
 * under prefers-reduced-motion.
 *
 * Known gaps vs. the brief (supplied by final footage, not faked here):
 *   – no photographic texture; no human hands in the kneading chapter.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { clamp } from "../canvas";

// ── math helpers ───────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const ease = (p: number, a: number, b: number) => smooth(range(p, a, b));
const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: () => number) => {
  const u = Math.max(1e-6, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * r());
};

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const rgba = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/** Piecewise interpolation through [p, value] keys with smootherstep per segment. */
function keyed(p: number, keys: [number, number][]): number {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, v1] = keys[i];
    const [p0, v0] = keys[i - 1];
    if (p <= p1) return lerp(v0, v1, smoother((p - p0) / (p1 - p0)));
  }
  return keys[keys.length - 1][1];
}
function keyedColor(p: number, keys: [number, RGB][]): RGB {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const t = smooth((p - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
      return mix(keys[i - 1][1], keys[i][1], t);
    }
  }
  return keys[keys.length - 1][1];
}

// ── palette (brand + grade) ────────────────────────────────────────────────
const C = {
  charcoal: hex("#292923"),
  deep: hex("#141411"),
  steel: hex("#1a1c1d"),
  wheat: hex("#CDA66C"),
  wheatHi: hex("#EBCB8E"),
  wheatLo: hex("#7A5526"),
  ivory: hex("#F3EBDD"),
  flourShade: hex("#B9AE9C"),
  dough: hex("#EADCC2"),
  doughShade: hex("#B7A385"),
  crustTop: hex("#9A5520"),
  crustMid: hex("#B9772F"),
  crustDark: hex("#4A2510"),
  crumb: hex("#E6C287"),
  amber: hex("#D08236"),
  ovenBg: hex("#2B1C11"),
  wood: hex("#3A2A1C"),
  woodHi: hex("#5A412A"),
};

// ── world layout (one continuous vertical world, 1600 wide) ────────────────
const CX = 800;
const EAR_BASE_Y = 780;
const EAR_TIP_Y = 250;
const ROLLER_Y = 1180;
const ROLLER_R = 150;
const NIP_Y = ROLLER_Y;
const SURFACE_Y = 1900;

// ── pre-generated deterministic geometry ───────────────────────────────────
interface Kernel {
  t: number; // 0 bottom … 1 top along the spike
  side: -1 | 1;
  size: number;
  detach: number; // p at which it leaves the ear
  outward: number;
  jitter: number;
  spin: number;
  awn: number;
}
interface Particle {
  x: number;
  phase: number;
  speed: number;
  size: number;
  sway: number;
  bright: number;
}
interface StreamKernel {
  phase: number;
  x: number;
  rot: number;
  spin: number;
  size: number;
}

const rnd = mulberry32(20261110);

const KERNELS: Kernel[] = (() => {
  const out: Kernel[] = [];
  const rows = 12;
  for (let i = 0; i < rows; i++) {
    for (const side of [-1, 1] as const) {
      const t = (i + (side === 1 ? 0.5 : 0)) / rows;
      const taper = Math.sin(Math.PI * (0.18 + t * 0.78));
      out.push({
        t,
        side,
        size: 0.62 + taper * 0.42,
        // top kernels go first, cascading down
        detach: 0.165 + (1 - t) * 0.07 + rnd() * 0.035,
        outward: 60 + rnd() * 140,
        jitter: (rnd() - 0.5) * 2,
        spin: (rnd() - 0.5) * 6,
        awn: 120 + rnd() * 120 * (0.4 + t),
      });
    }
  }
  return out;
})();

const STREAM: StreamKernel[] = Array.from({ length: 150 }, () => ({
  phase: rnd(),
  x: gauss(rnd) * 26,
  rot: rnd() * TAU,
  spin: (rnd() - 0.5) * 14,
  size: 0.7 + rnd() * 0.4,
}));

const FLOUR: Particle[] = Array.from({ length: 1500 }, () => ({
  x: gauss(rnd),
  phase: rnd(),
  speed: 0.75 + rnd() * 0.6,
  size: 0.5 + Math.pow(rnd(), 3) * 2.6,
  sway: rnd() * TAU,
  bright: 0.45 + rnd() * 0.55,
}));

const MOTES: Particle[] = Array.from({ length: 260 }, () => ({
  x: rnd(),
  phase: rnd(),
  speed: 0.2 + rnd() * 0.6,
  size: 0.6 + rnd() * 1.8,
  sway: rnd() * TAU,
  bright: 0.3 + rnd() * 0.7,
}));

const SPECKS = Array.from({ length: 260 }, () => ({ a: rnd(), r: rnd(), s: 0.6 + rnd() * 1.6, o: rnd() }));

// ── blob morph: every body (mound → dough → loaf) is 96 points around a centre ─
const N = 96;
type Pt = [number, number];

/** Mound of flour: a soft gaussian heap sitting on the surface. */
function moundShape(h: number, w: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU; // 0 = right, PI/2 = down
    const x = Math.cos(a);
    const top = Math.sin(a) < 0;
    const px = CX + x * w;
    const heap = Math.exp(-(x * x) * 3.2);
    const py = top ? SURFACE_Y - h * heap + 2 : SURFACE_Y + 4;
    pts.push([px, py]);
  }
  return pts;
}

/** Superellipse resting on the surface (dough ball / loaf). */
function restingShape(rx: number, ry: number, squareness: number, lift = 0): Pt[] {
  const pts: Pt[] = [];
  const cy = SURFACE_Y - ry + lift;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const e = 2 / squareness;
    let x = Math.sign(c) * Math.pow(Math.abs(c), e) * rx;
    let y = Math.sign(s) * Math.pow(Math.abs(s), e) * ry;
    if (y > 0) y *= 0.82; // weight settles: flatter underside
    pts.push([CX + x, Math.min(cy + y, SURFACE_Y + 3)]);
  }
  return pts;
}

function morph(a: Pt[], b: Pt[], t: number): Pt[] {
  return a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
}

function tracePath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  // smooth closed curve through midpoints
  const m = (i: number): Pt => {
    const a = pts[(i + N) % N];
    const b = pts[(i + 1) % N];
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  };
  const s = m(-1);
  ctx.moveTo(s[0], s[1]);
  for (let i = 0; i < N; i++) {
    const e = m(i);
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]);
  }
  ctx.closePath();
}

// ── grain tile (generated once per page) ───────────────────────────────────
let grainTile: HTMLCanvasElement | null = null;
function getGrain(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const g = document.createElement("canvas");
  g.width = g.height = 192;
  const gx = g.getContext("2d")!;
  const img = gx.createImageData(192, 192);
  const r = mulberry32(7);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (r() * 255) | 0;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  gx.putImageData(img, 0, 0);
  grainTile = g;
  return g;
}

// ── camera ─────────────────────────────────────────────────────────────────
function camera(p: number) {
  return {
    x: CX,
    y: keyed(p, [
      [0, 515],
      [0.16, 505],
      [0.3, 960],
      [0.38, 1130],
      [0.5, 1540],
      [0.6, 1745],
      [0.8, 1800],
      [1, 1790],
    ]),
    zoom: keyed(p, [
      [0, 1.0],
      [0.16, 1.1],
      [0.3, 0.9],
      [0.38, 0.98],
      [0.5, 1.0],
      [0.6, 1.12],
      [0.8, 1.26],
      [1, 1.34],
    ]),
  };
}

let DPR = 1;

// ── public API ─────────────────────────────────────────────────────────────
export interface SceneFrame {
  /** CSS pixel size of the canvas box */
  width: number;
  height: number;
  dpr: number;
  /** 0–1 hero scroll progress */
  progress: number;
  /** seconds, for ambient motion only */
  time: number;
}

export function renderProceduralScene(ctx: CanvasRenderingContext2D, f: SceneFrame): void {
  const { width: W, height: H, dpr } = f;
  const p = clamp(f.progress, 0, 1);
  const t = f.time;

  DPR = dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;

  // ── 1. background grade (screen space) ───────────────────────────────────
  const bg = keyedColor(p, [
    [0, hex("#1b1a16")],
    [0.2, hex("#171816")],
    [0.38, C.steel],
    [0.55, hex("#121210")],
    [0.75, hex("#1f1913")],
    [1, C.ovenBg],
  ]);
  ctx.fillStyle = rgba(bg);
  ctx.fillRect(0, 0, W, H);

  // ── world transform ──────────────────────────────────────────────────────
  const cam = camera(p);
  const portrait = W / H < 1;
  // keep ≥ 780 world units visible across on portrait screens
  const base = Math.min(H / 1000, W / 780);
  const s = base * cam.zoom;
  // on wide screens the subject sits right of centre, leaving the text column clear
  const anchorX = portrait ? W * 0.5 : W * lerp(0.6, 0.62, clamp((W / H - 1.3) / 0.6, 0, 1));
  const anchorY = portrait ? H * 0.36 : H * 0.5;
  const toWorld = () => ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * (anchorX - cam.x * s), dpr * (anchorY - cam.y * s));
  const toScreen = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const wx = (x: number) => anchorX + (x - cam.x) * s; // world → screen
  const wy = (y: number) => anchorY + (y - cam.y) * s;

  // ── 2. motivated light (screen space, positioned from world) ────────────
  // ch1 — warm key from upper left, behind the ear
  const keyA = 1 - ease(p, 0.2, 0.32);
  if (keyA > 0.01) {
    radial(ctx, wx(CX - 160), wy(380), 620 * s, rgba(hex("#6b5333"), 0.55 * keyA), rgba(bg, 0));
  }
  // ch2 — cool practical over the rollers + warm spill
  const millA = ease(p, 0.2, 0.3) * (1 - ease(p, 0.44, 0.52));
  if (millA > 0.01) {
    radial(ctx, wx(CX), wy(ROLLER_Y - 330), 760 * s, rgba(hex("#3e4446"), 0.6 * millA), rgba(bg, 0));
    radial(ctx, wx(CX + 420), wy(ROLLER_Y + 160), 520 * s, rgba(hex("#5a3f22"), 0.35 * millA), rgba(bg, 0));
  }
  // ch5 — oven glow behind the loaf
  const ovenA = ease(p, 0.74, 0.96);
  if (ovenA > 0.01) {
    radial(ctx, wx(CX + 60), wy(SURFACE_Y - 200), 900 * s, rgba(C.amber, 0.42 * ovenA), rgba(bg, 0));
    radial(ctx, wx(CX + 60), wy(SURFACE_Y - 120), 380 * s, rgba(hex("#f0a24f"), 0.22 * ovenA), rgba(bg, 0));
  }

  // ── 3. mill structure (behind everything else in that zone) ──────────────
  if (millA > 0.01) drawMillBackdrop(ctx, toWorld, millA, p);

  // ── 4. side light beam (ch3–ch4) ─────────────────────────────────────────
  const beamA = ease(p, 0.36, 0.48) * (1 - ease(p, 0.74, 0.86));
  // beam axis in world space: from upper-left towards the bench
  const bx0 = CX - 900, by0 = 1180, bx1 = CX + 500, by1 = SURFACE_Y + 120;
  const bdx = bx1 - bx0, bdy = by1 - by0;
  const blen = Math.hypot(bdx, bdy);
  const beamAt = (x: number, y: number) => {
    // distance from axis → soft falloff
    const d = Math.abs((x - bx0) * bdy - (y - by0) * bdx) / blen;
    return Math.exp(-(d * d) / (2 * 120 * 120));
  };
  if (beamA > 0.01) {
    toWorld();
    ctx.save();
    ctx.translate(bx0, by0);
    ctx.rotate(Math.atan2(bdy, bdx));
    const g = ctx.createLinearGradient(0, -320, 0, 320);
    g.addColorStop(0, "rgba(243,235,221,0)");
    g.addColorStop(0.5, `rgba(243,228,200,${0.13 * beamA})`);
    g.addColorStop(1, "rgba(243,235,221,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, -320, blen * 1.4, 640);
    ctx.restore();
  }

  // ── 5. work surface (ch3 onward) ─────────────────────────────────────────
  const surfA = ease(p, 0.42, 0.52);
  if (surfA > 0.01) drawSurface(ctx, toWorld, p, surfA, beamA, ovenA);

  // ── 6. ear of wheat (ch1) ────────────────────────────────────────────────
  toWorld();
  const earA = 1 - ease(p, 0.24, 0.32);
  if (earA > 0.01) drawEar(ctx, p, t, earA);

  // ── 7. rollers + kernel stream (ch2) ─────────────────────────────────────
  if (millA > 0.01) {
    drawStream(ctx, p, t, millA);
    drawRollers(ctx, p, millA);
  }

  // ── 8. kernels in flight from the ear (ch1→ch2) ──────────────────────────
  if (p > 0.15 && p < 0.42) drawFlyingKernels(ctx, p, t);

  // ── 9. falling flour (ch2 end → ch3) ─────────────────────────────────────
  const flourA = ease(p, 0.32, 0.4) * (1 - ease(p, 0.58, 0.66));
  if (flourA > 0.01) drawFlour(ctx, p, t, flourA, beamAt, beamA);

  // ── 10. body: mound → dough → loaf ───────────────────────────────────────
  if (p > 0.44) drawBody(ctx, p, t, beamA, ovenA);

  // ── 11. airborne motes in the beam / kneading puffs ──────────────────────
  if (beamA > 0.01) drawMotes(ctx, cam, s, p, t, beamA, beamAt);

  // ── 12. steam (ch5) ──────────────────────────────────────────────────────
  const steamA = ease(p, 0.9, 0.99);
  if (steamA > 0.01) drawSteam(ctx, t, steamA);

  // ── 13. vignette + grain (screen space) ──────────────────────────────────
  toScreen();
  const vg = ctx.createRadialGradient(W * 0.55, H * 0.5, Math.min(W, H) * 0.25, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(5,5,4,0.78)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  const grain = getGrain();
  ctx.globalAlpha = 0.055;
  ctx.globalCompositeOperation = "overlay";
  const pat = ctx.createPattern(grain, "repeat");
  if (pat) {
    const ox = ((t * 997) % 192) | 0;
    const oy = ((t * 613) % 192) | 0;
    ctx.translate(-ox, -oy);
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W + 192, H + 192);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

// ── drawing parts ──────────────────────────────────────────────────────────

function radial(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c0: string, c1: string) {
  ctx.save();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

/** Spine of the ear: a gently bowed curve; sway is ambient only. */
function spine(t: number, sway: number): Pt {
  const y = lerp(EAR_BASE_Y, EAR_TIP_Y, t);
  const x = CX + Math.sin(t * Math.PI * 0.9) * 26 + t * t * (34 + sway);
  return [x, y];
}

function kernelPose(k: Kernel, sway: number) {
  const [x, y] = spine(k.t, sway);
  const len = 46 * k.size;
  const ang = -Math.PI / 2 + k.side * (0.42 - k.t * 0.12);
  return {
    x: x + Math.cos(ang) * 9 * k.side * 0.6 + k.side * 10,
    y: y - 6,
    rot: ang + Math.PI / 2,
    len,
    wid: 21 * k.size,
  };
}

function drawKernel(ctx: CanvasRenderingContext2D, x: number, y: number, rot: number, len: number, wid: number, light: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(-wid * 0.35, -len * 0.25, wid * 0.1, 0, 0, len * 0.75);
  g.addColorStop(0, rgba(mix(C.wheatHi, C.ivory, 0.25 * light)));
  g.addColorStop(0.45, rgba(C.wheat));
  g.addColorStop(1, rgba(C.wheatLo));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, wid / 2, len / 2, 0, 0, TAU);
  ctx.fill();
  // crease
  ctx.strokeStyle = `rgba(90,60,25,${0.45 * alpha})`;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(wid * 0.05, -len * 0.38);
  ctx.quadraticCurveTo(wid * 0.16, 0, wid * 0.05, len * 0.38);
  ctx.stroke();
  // rim light (key from upper-left)
  ctx.strokeStyle = `rgba(255,228,175,${0.55 * light * alpha})`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(0, 0, wid / 2 - 0.6, len / 2 - 0.6, 0, Math.PI * 0.95, Math.PI * 1.55);
  ctx.stroke();
  ctx.restore();
}

function drawEar(ctx: CanvasRenderingContext2D, p: number, t: number, alpha: number) {
  const sway = Math.sin(t * 0.7) * 5 + Math.sin(t * 1.9) * 1.5;
  const stemA = alpha * (1 - ease(p, 0.2, 0.28));

  // stem
  ctx.save();
  ctx.globalAlpha = stemA;
  ctx.lineCap = "round";
  const sg = ctx.createLinearGradient(CX - 20, 0, CX + 20, 0);
  sg.addColorStop(0, rgba(C.wheatHi));
  sg.addColorStop(1, rgba(C.wheatLo));
  ctx.strokeStyle = sg;
  ctx.lineWidth = 7;
  ctx.beginPath();
  const [bx, by] = spine(0, sway);
  ctx.moveTo(bx - 4, 1500);
  ctx.quadraticCurveTo(bx - 10, 1100, bx, by + 10);
  ctx.stroke();
  // rachis through the ear
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const [x, y] = spine(i / 20, sway);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // awns — fine bristles catching the light
  for (const k of KERNELS) {
    const a = range(p, k.detach - 0.02, k.detach + 0.03);
    const aa = alpha * (1 - a) * 0.9;
    if (aa <= 0.01) continue;
    const pose = kernelPose(k, sway);
    const dir = pose.rot - Math.PI / 2;
    const tipX = pose.x + Math.cos(dir) * pose.len * 0.5;
    const tipY = pose.y + Math.sin(dir) * pose.len * 0.5;
    const ex = tipX + Math.cos(dir - k.side * 0.12) * k.awn;
    const ey = tipY + Math.sin(dir - k.side * 0.12) * k.awn;
    const g = ctx.createLinearGradient(tipX, tipY, ex, ey);
    g.addColorStop(0, `rgba(226,192,132,${0.75 * aa})`);
    g.addColorStop(1, "rgba(226,192,132,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(lerp(tipX, ex, 0.5) + k.side * 8, lerp(tipY, ey, 0.5), ex, ey);
    ctx.stroke();
  }

  // kernels still attached
  for (const k of KERNELS) {
    if (p >= k.detach) continue;
    const pose = kernelPose(k, sway);
    drawKernel(ctx, pose.x, pose.y, pose.rot, pose.len, pose.wid, 1, alpha);
  }
}

function drawFlyingKernels(ctx: CanvasRenderingContext2D, p: number, t: number) {
  const sway = Math.sin(t * 0.7) * 5 + Math.sin(t * 1.9) * 1.5;
  for (const k of KERNELS) {
    if (p < k.detach) continue;
    const u = smooth(range(p, k.detach, k.detach + 0.12));
    const pose = kernelPose(k, sway);
    // cubic path: outward drift → falls towards the roller nip
    const p0: Pt = [pose.x, pose.y];
    const p1: Pt = [pose.x + k.side * k.outward, pose.y - 40];
    const p2: Pt = [CX + k.jitter * 90, NIP_Y - 420];
    const p3: Pt = [CX + k.jitter * 6, NIP_Y - 20];
    const mt = 1 - u;
    const x = mt * mt * mt * p0[0] + 3 * mt * mt * u * p1[0] + 3 * mt * u * u * p2[0] + u * u * u * p3[0];
    const y = mt * mt * mt * p0[1] + 3 * mt * mt * u * p1[1] + 3 * mt * u * u * p2[1] + u * u * u * p3[1];
    const a = 1 - range(u, 0.88, 1);
    if (a <= 0.01) continue;
    drawKernel(ctx, x, y, pose.rot + u * k.spin, pose.len, pose.wid, 1 - u * 0.6, a);
  }
}

function drawMillBackdrop(ctx: CanvasRenderingContext2D, toWorld: () => void, a: number, p: number) {
  toWorld();
  ctx.save();
  ctx.globalAlpha = a;
  // steel columns and a gantry receding into haze
  const cols = [-620, -470, 470, 620];
  for (const cx of cols) {
    const depth = Math.abs(cx) > 500 ? 0.55 : 0.8;
    const g = ctx.createLinearGradient(CX + cx - 26, 0, CX + cx + 26, 0);
    g.addColorStop(0, `rgba(20,22,23,${depth})`);
    g.addColorStop(0.35, `rgba(70,74,74,${0.5 * depth})`);
    g.addColorStop(1, `rgba(12,13,13,${depth})`);
    ctx.fillStyle = g;
    ctx.fillRect(CX + cx - 26, 640, 52, 1100);
  }
  // horizontal beam
  ctx.fillStyle = "rgba(38,41,42,0.85)";
  ctx.fillRect(CX - 700, 860, 1400, 22);
  ctx.fillStyle = "rgba(120,118,108,0.18)";
  ctx.fillRect(CX - 700, 860, 1400, 2);
  // hopper above the rollers
  ctx.beginPath();
  ctx.moveTo(CX - 250, 820);
  ctx.lineTo(CX + 250, 820);
  ctx.lineTo(CX + 70, ROLLER_Y - 120);
  ctx.lineTo(CX - 70, ROLLER_Y - 120);
  ctx.closePath();
  const hg = ctx.createLinearGradient(CX - 250, 0, CX + 250, 0);
  hg.addColorStop(0, "rgba(64,67,67,0.95)");
  hg.addColorStop(0.45, "rgba(36,38,39,0.95)");
  hg.addColorStop(1, "rgba(18,19,19,0.95)");
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.strokeStyle = "rgba(200,190,170,0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // rivets
  ctx.fillStyle = "rgba(170,160,140,0.25)";
  for (let i = 0; i < 9; i++) {
    const u = i / 8;
    ctx.beginPath();
    ctx.arc(lerp(CX - 240, CX + 240, u), 836, 2.4, 0, TAU);
    ctx.fill();
  }
  // housing behind rollers
  ctx.fillStyle = "rgba(16,17,17,0.9)";
  ctx.fillRect(CX - 360, ROLLER_Y - 175, 720, 350);
  ctx.strokeStyle = "rgba(205,166,108,0.10)";
  ctx.strokeRect(CX - 360, ROLLER_Y - 175, 720, 350);
  // slow haze sweep
  const hz = ctx.createLinearGradient(0, 700, 0, 1500);
  hz.addColorStop(0, "rgba(160,150,130,0)");
  hz.addColorStop(0.5, `rgba(160,150,130,${0.05 + 0.04 * Math.sin(p * 30)})`);
  hz.addColorStop(1, "rgba(160,150,130,0)");
  ctx.fillStyle = hz;
  ctx.fillRect(CX - 800, 700, 1600, 800);
  ctx.restore();
}

function drawStream(ctx: CanvasRenderingContext2D, p: number, t: number, millA: number) {
  // a continuous pour of grain from the hopper into the nip
  const density = ease(p, 0.25, 0.33) * (1 - ease(p, 0.4, 0.47));
  if (density <= 0.01) return;
  const flow = p * 9 + t * 0.05;
  const top = ROLLER_Y - 135;
  const len = 120;
  for (let i = 0; i < STREAM.length; i++) {
    if (i / STREAM.length > density) continue;
    const k = STREAM[i];
    const u = (flow * 1.4 + k.phase) % 1;
    const y = top + u * len;
    const x = CX + k.x * (1 - u * 0.85);
    drawKernel(ctx, x, y, k.rot + u * k.spin, 30 * k.size, 14 * k.size, 0.55, millA * (1 - range(u, 0.8, 1)));
  }
}

function drawRollers(ctx: CanvasRenderingContext2D, p: number, a: number) {
  const rot = p * 40; // scrubbed rotation — reverses with scroll
  for (const side of [-1, 1]) {
    const x = CX + side * (ROLLER_R + 3);
    const y = ROLLER_Y;
    ctx.save();
    ctx.globalAlpha = a;
    // body
    const g = ctx.createRadialGradient(x - 50, y - 60, 10, x, y, ROLLER_R);
    g.addColorStop(0, "rgba(150,148,140,1)");
    g.addColorStop(0.35, "rgba(78,80,79,1)");
    g.addColorStop(0.85, "rgba(32,33,33,1)");
    g.addColorStop(1, "rgba(14,15,15,1)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, ROLLER_R, 0, TAU);
    ctx.fill();
    // fluting on the rim
    ctx.strokeStyle = "rgba(10,10,10,0.55)";
    ctx.lineWidth = 2;
    const flutes = 48;
    for (let i = 0; i < flutes; i++) {
      const ang = (i / flutes) * TAU + rot * -side;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * (ROLLER_R - 10), y + Math.sin(ang) * (ROLLER_R - 10));
      ctx.lineTo(x + Math.cos(ang) * ROLLER_R, y + Math.sin(ang) * ROLLER_R);
      ctx.stroke();
    }
    // machined face rings
    ctx.strokeStyle = "rgba(200,195,180,0.12)";
    ctx.lineWidth = 1;
    for (const r of [ROLLER_R * 0.72, ROLLER_R * 0.5, ROLLER_R * 0.18]) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
    }
    // hub with a turning marker (motion is readable even when scrubbing slowly)
    ctx.fillStyle = "rgba(24,25,25,1)";
    ctx.beginPath();
    ctx.arc(x, y, ROLLER_R * 0.16, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(205,166,108,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const ang = rot * -side;
    ctx.moveTo(x + Math.cos(ang) * ROLLER_R * 0.22, y + Math.sin(ang) * ROLLER_R * 0.22);
    ctx.lineTo(x + Math.cos(ang) * ROLLER_R * 0.48, y + Math.sin(ang) * ROLLER_R * 0.48);
    ctx.stroke();
    // specular rim from the overhead practical
    ctx.strokeStyle = "rgba(255,240,215,0.28)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, ROLLER_R - 2, Math.PI * 1.15, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFlour(
  ctx: CanvasRenderingContext2D,
  p: number,
  t: number,
  a: number,
  beamAt: (x: number, y: number) => number,
  beamA: number,
) {
  const flow = p * 6 + t * 0.035;
  const y0 = NIP_Y + 20;
  const y1 = SURFACE_Y;
  const span = y1 - y0;
  const moundH = 150 * ease(p, 0.44, 0.62);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const q of FLOUR) {
    const u = (flow * q.speed + q.phase) % 1;
    const y = y0 + u * span;
    const spread = 6 + u * 130;
    const x = CX + q.x * spread + Math.sin(q.sway + y * 0.012 + t * 0.6) * (4 + u * 14);
    // land on the mound
    const surfaceHere = SURFACE_Y - moundH * Math.exp(-Math.pow((x - CX) / 210, 2) * 3.2);
    if (y > surfaceHere) continue;
    const lit = 0.12 + beamA * beamAt(x, y) * 1.2;
    const al = a * q.bright * Math.min(1, lit) * (0.35 + 0.65 * (1 - u * 0.4));
    if (al < 0.02) continue;
    ctx.fillStyle = `rgba(246,236,218,${al})`;
    ctx.fillRect(x, y, q.size, q.size * (1 + u * 1.8)); // slight motion streak
  }
  ctx.restore();
}

function drawSurface(
  ctx: CanvasRenderingContext2D,
  toWorld: () => void,
  p: number,
  a: number,
  beamA: number,
  ovenA: number,
) {
  toWorld();
  ctx.save();
  ctx.globalAlpha = a;
  const woodT = ease(p, 0.58, 0.72);
  const top = mix(hex("#1c1b18"), C.woodHi, woodT);
  const bottom = mix(hex("#0c0c0b"), C.wood, woodT * 0.8);
  const g = ctx.createLinearGradient(0, SURFACE_Y, 0, SURFACE_Y + 520);
  g.addColorStop(0, rgba(top));
  g.addColorStop(1, rgba(bottom));
  ctx.fillStyle = g;
  ctx.fillRect(CX - 1400, SURFACE_Y, 2800, 700);
  // wood grain
  if (woodT > 0.01) {
    ctx.strokeStyle = `rgba(20,12,6,${0.35 * woodT})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
      const y = SURFACE_Y + 14 + i * i * 1.6;
      ctx.beginPath();
      ctx.moveTo(CX - 1400, y);
      for (let x = -1400; x <= 1400; x += 200) {
        ctx.lineTo(CX + x, y + Math.sin(x * 0.004 + i) * 3);
      }
      ctx.stroke();
    }
  }
  // front edge highlight: beam, then oven
  ctx.fillStyle = `rgba(243,230,205,${0.16 * beamA + 0.2 * ovenA})`;
  ctx.fillRect(CX - 1400, SURFACE_Y, 2800, 2);
  // scattered flour on the bench
  const dust = ease(p, 0.5, 0.64);
  for (const sp of SPECKS) {
    const x = CX + (sp.a - 0.5) * 1100;
    const y = SURFACE_Y + 4 + sp.r * sp.r * 90;
    ctx.fillStyle = `rgba(243,235,221,${0.35 * dust * sp.o})`;
    ctx.fillRect(x, y, sp.s * 1.6, sp.s * 0.7);
  }
  ctx.restore();
}

function drawBody(ctx: CanvasRenderingContext2D, p: number, t: number, beamA: number, ovenA: number) {
  // shape keys
  const mH = 150 * ease(p, 0.44, 0.62);
  const mound = moundShape(mH, 215);
  const ball = restingShape(205, 112, 2.2);
  const loaf = restingShape(282, 124, 2.6);

  const toDough = ease(p, 0.6, 0.68);
  const toLoaf = smoother(range(p, 0.8, 0.9));
  let pts = morph(morph(mound, ball, toDough), loaf, toLoaf);

  // kneading: three press-and-fold cycles between 0.66 and 0.8
  const kneadEnv = ease(p, 0.65, 0.68) * (1 - ease(p, 0.78, 0.81));
  const kp = range(p, 0.66, 0.8) * 3;
  const press = Math.max(0, Math.sin(kp * Math.PI)) * kneadEnv;
  const fold = Math.sin(kp * TAU) * kneadEnv;
  if (kneadEnv > 0.001) {
    pts = pts.map(([x, y]) => {
      const nx = (x - CX) / 210;
      const above = y < SURFACE_Y - 2;
      const lift = SURFACE_Y - y;
      // squash down & spread out under the heel of the hand
      let X = CX + (x - CX) * (1 + 0.18 * press) + fold * 18 * (lift / 120);
      let Y = SURFACE_Y - lift * (1 - 0.26 * press);
      // two palm indentations, alternating left/right
      if (above) {
        const side = Math.floor(kp) % 2 === 0 ? -1 : 1;
        const dent = Math.exp(-Math.pow(nx - side * 0.35, 2) * 9) * 26 * press;
        Y += dent;
      }
      return [X, Y] as Pt;
    });
  }

  // rise in the oven
  const rise = ease(p, 0.84, 0.95);
  if (rise > 0) pts = pts.map(([x, y]) => [x, SURFACE_Y - (SURFACE_Y - y) * (1 + 0.14 * rise)] as Pt);

  // bounds for gradients
  let minY = Infinity, minX = Infinity, maxX = -Infinity;
  for (const [x, y] of pts) {
    if (y < minY) minY = y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  const h = SURFACE_Y - minY;
  if (h < 2) return;

  // contact shadow
  ctx.save();
  const sh = ctx.createRadialGradient(CX, SURFACE_Y + 4, 10, CX, SURFACE_Y + 4, (maxX - minX) * 0.62);
  sh.addColorStop(0, "rgba(0,0,0,0.55)");
  sh.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.ellipse(CX, SURFACE_Y + 6, (maxX - minX) * 0.62, 26, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // material: flour → dough → crust
  const bake = ease(p, 0.84, 0.97);
  const lightTop = mix(mix(C.ivory, C.dough, toDough), mix(C.crustMid, hex("#c98a40"), 0.3), bake);
  const mid = mix(mix(hex("#ddd2c0"), hex("#ddcbab"), toDough), C.crustTop, bake);
  const shade = mix(mix(C.flourShade, C.doughShade, toDough), C.crustDark, bake);

  tracePath(ctx, pts);
  const g = ctx.createLinearGradient(minX, minY, maxX * 0.3 + CX * 0.7, SURFACE_Y);
  g.addColorStop(0, rgba(lightTop));
  g.addColorStop(0.55, rgba(mid));
  g.addColorStop(1, rgba(shade));
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  ctx.clip();
  // form shading: darker underside / far side
  const fs = ctx.createLinearGradient(0, minY, 0, SURFACE_Y);
  fs.addColorStop(0, "rgba(0,0,0,0)");
  fs.addColorStop(0.7, "rgba(0,0,0,0.08)");
  fs.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = fs;
  ctx.fillRect(minX - 10, minY - 10, maxX - minX + 20, h + 20);

  // key light: side beam (ch3–4) from the left, oven (ch5) from behind-right
  const beamKey = ctx.createLinearGradient(minX, 0, maxX, 0);
  beamKey.addColorStop(0, `rgba(255,246,228,${0.32 * beamA})`);
  beamKey.addColorStop(0.5, "rgba(255,246,228,0)");
  ctx.fillStyle = beamKey;
  ctx.fillRect(minX - 10, minY - 10, maxX - minX + 20, h + 20);

  if (ovenA > 0.01) {
    const rim = ctx.createRadialGradient(maxX - 40, minY + 20, 10, maxX - 40, minY + 20, h * 2.2);
    rim.addColorStop(0, `rgba(255,190,110,${0.38 * ovenA})`);
    rim.addColorStop(1, "rgba(255,190,110,0)");
    ctx.fillStyle = rim;
    ctx.fillRect(minX - 10, minY - 10, maxX - minX + 20, h + 20);
  }

  // satin highlight on dough
  const satin = toDough * (1 - bake);
  if (satin > 0.01) {
    const hl = ctx.createRadialGradient(CX - 60, minY + h * 0.28, 4, CX - 60, minY + h * 0.28, 120);
    hl.addColorStop(0, `rgba(255,252,244,${0.42 * satin})`);
    hl.addColorStop(1, "rgba(255,252,244,0)");
    ctx.fillStyle = hl;
    ctx.fillRect(minX, minY, maxX - minX, h);
  }

  // flour texture: grainy mound early, dusted crust late
  const dustA = (1 - toDough) * 0.9 + bake * 0.65;
  if (dustA > 0.02) {
    for (const sp of SPECKS) {
      const x = lerp(minX, maxX, sp.a);
      const y = minY + sp.r * sp.r * h * (bake > 0.3 ? 0.55 : 1);
      ctx.fillStyle = `rgba(250,246,238,${dustA * 0.55 * sp.o})`;
      ctx.fillRect(x, y, sp.s, sp.s);
    }
  }

  // scoring — the "ear" opens as the loaf bakes
  const score = ease(p, 0.86, 0.97);
  if (score > 0.01) {
    const sx0 = CX - 200, sx1 = CX + 175;
    // upper silhouette, sorted by x, linearly interpolated → smooth top line
    const midY = (minY + SURFACE_Y) / 2;
    const upperEdge = pts.filter(([, py]) => py < midY).sort((a, b) => a[0] - b[0]);
    const topAt = (x: number) => {
      if (!upperEdge.length) return minY;
      if (x <= upperEdge[0][0]) return upperEdge[0][1];
      for (let i = 1; i < upperEdge.length; i++) {
        const [x1, y1] = upperEdge[i];
        const [x0, y0] = upperEdge[i - 1];
        if (x <= x1) return lerp(y0, y1, (x - x0) / Math.max(1e-6, x1 - x0));
      }
      return upperEdge[upperEdge.length - 1][1];
    };
    const steps = 22;
    const upper: Pt[] = [];
    const lower: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = lerp(sx0, sx1, u);
      const y = topAt(x) + 30 + (u - 0.5) * 14 + Math.sin(u * Math.PI) * 4;
      const open = Math.sin(u * Math.PI) * 15 * score;
      upper.push([x, y - open * 0.35]);
      lower.push([x, y + open]);
    }
    ctx.beginPath();
    upper.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    for (let i = lower.length - 1; i >= 0; i--) ctx.lineTo(lower[i][0], lower[i][1]);
    ctx.closePath();
    const cg = ctx.createLinearGradient(0, minY, 0, minY + 70);
    cg.addColorStop(0, rgba(hex("#f0d29a")));
    cg.addColorStop(1, rgba(C.crumb));
    ctx.fillStyle = cg;
    ctx.fill();
    // the lip catches the light; underside in shadow
    ctx.strokeStyle = `rgba(60,28,10,${0.75 * score})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    lower.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,220,160,${0.5 * score})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    upper.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }
  ctx.restore();

  // kneading puffs of flour at each press
  if (press > 0.05) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const r = mulberry32(Math.floor(kp) + 3);
    for (let i = 0; i < 70; i++) {
      const ang = -Math.PI * (0.1 + r() * 0.8);
      const dist = (40 + r() * 140) * press;
      const x = CX + Math.cos(ang) * (230 + dist) * (r() < 0.5 ? -1 : 1) * 0.6;
      const y = minY + 40 + Math.sin(ang) * dist * 0.6 + Math.sin(t + i) * 2;
      ctx.fillStyle = `rgba(246,238,222,${0.4 * press * r()})`;
      ctx.fillRect(x, y, 1.6, 1.6);
    }
    ctx.restore();
  }
}

function drawMotes(
  ctx: CanvasRenderingContext2D,
  cam: { x: number; y: number },
  s: number,
  p: number,
  t: number,
  beamA: number,
  beamAt: (x: number, y: number) => number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const vw = 1600 / s;
  for (const m of MOTES) {
    const x = cam.x - vw / 2 + m.x * vw + Math.sin(t * 0.3 + m.sway) * 20;
    const y = cam.y - 520 + ((m.phase + p * 2 * m.speed + t * 0.01 * m.speed) % 1) * 1040;
    const lit = beamAt(x, y) * beamA * m.bright;
    if (lit < 0.03) continue;
    ctx.fillStyle = `rgba(250,240,220,${lit * 0.7})`;
    ctx.beginPath();
    ctx.arc(x, y, m.size, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawSteam(ctx: CanvasRenderingContext2D, t: number, a: number) {
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    const x0 = CX - 180 + i * 72;
    const y0 = SURFACE_Y - 170;
    const g = ctx.createLinearGradient(0, y0, 0, y0 - 320);
    g.addColorStop(0, `rgba(255,240,220,${0.075 * a})`);
    g.addColorStop(1, "rgba(255,240,220,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 14 + (i % 3) * 6;
    ctx.filter = "blur(6px)";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for (let k = 1; k <= 8; k++) {
      const yy = y0 - k * 40;
      const xx = x0 + Math.sin(t * 0.8 + i * 1.7 + k * 0.7) * (8 + k * 5);
      ctx.lineTo(xx, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}
