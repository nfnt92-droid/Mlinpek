#!/usr/bin/env node
/**
 * Builds the hero frame sequence from the three supplied clips, in fixed order:
 *
 *   source-footage/01-zrno.mp4   wheat ear → falling grains
 *   source-footage/02-mlin.mp4   industrial mill → flour
 *   source-footage/03-kruh.mp4   kneading → finished bread
 *
 *   npm run hero:build
 *
 * Pipeline
 *   1. Each clip is framed to 1760×990 (16:9). The crop also removes the
 *      "KlingAI 4.0" watermark (bottom-right, below y=1000 in the 1916×1080 source).
 *   2. Two 1-second transitions, both eased cross-dissolves — never cuts, never black:
 *        A→B  grains → mill: complementary 70 px lateral drift so the two grain streams
 *             travel toward each other, + a slight dust lift
 *        B→C  flour mound → dough: a graphic match (mound apex and dough sit at the same
 *             spot in frame), + a soft exposure bloom of the airborne flour
 *   3. Master (28.875 s, 693 frames @24 fps; clip C's first frame held 0.75 s under the dissolve) → source-footage/hero-master.mp4
 *   4. Web frames:
 *        desktop  every 2nd frame (every frame while kneading) → 1600×900 WebP
 *        mobile   every 4th frame (every 2nd while kneading)   → 742×990 (3:4, native) WebP, crop that FOLLOWS the
 *                                    subject (keyframed focal X below)
 *   5. public/sequence/manifest.json (status "ready", durationSec for headline sync)
 *
 * The timings here must agree with src/config/heroTimeline.ts.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = (f) => path.join(root, "source-footage", f);
const CLIPS = ["01-zrno.mp4", "02-mlin.mp4", "03-kruh.mp4"].map(src);
for (const c of CLIPS) if (!fs.existsSync(c)) throw new Error(`Missing clip: ${c}`);

const FPS = 24;
const CLIP_FRAMES = 241; // each supplied clip
const XF = 24; // transition length in frames (1 s)
const OFF1 = (CLIP_FRAMES - XF) / FPS; // 9.041667
const OFF2 = OFF1 + (CLIP_FRAMES - XF) / FPS; // 18.083333
// Clip C's kneading lasts only ~30 frames. Its first frame is held (cloned) under the
// B→C dissolve so the hands are fully visible once the dissolve completes.
const C_HOLD = 0.75; // s
const DURATION = OFF2 + C_HOLD + CLIP_FRAMES / FPS; // 28.875
const MASTER_FRAMES = Math.round(DURATION * FPS); // 693
// master-frame window that is sampled densely (kneading)
const DENSE = [Math.round((OFF2 + C_HOLD - 0.25) * FPS), Math.round((OFF2 + C_HOLD + 32 / FPS) * FPS)];

const W = 1760, H = 990; // framing crop (drops watermark)
const BASE_X = 78; // centred crop inside 1916
const DRIFT = 70; // px, A→B lateral drift

const QUALITY_D = Number(process.env.QUALITY ?? 66);
const QUALITY_M = Number(process.env.QUALITY_MOBILE ?? 62);
const master = src("hero-master.mp4");
const preview = src("hero-preview.mp4");

const ease = (u) => `(${u})*(${u})*(3-2*(${u}))`;
const clip01 = (e) => `min(max(${e},0),1)`;

function ff(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

// ── 1–3: master ─────────────────────────────────────────────────────────────
const uA = clip01(`(t-${OFF1})/1`); // A's own clock: drift during its last second
const uB = clip01(`t/1`); // B's own clock: settle during its first second
const xA = `${BASE_X}-${DRIFT}*${ease(uA)}`; // A content slides right
const xB = `${BASE_X}+${DRIFT}*(1-${ease(uB)})`; // B content arrives from the left
const fadeExpr = `A*(1-${ease("1-P")})+B*${ease("1-P")}`;
const bloom = `0.028*sin(PI*${clip01(`(t-${OFF1})/1`)})+0.055*sin(PI*${clip01(`(t-${OFF2})/1`)})`;

const graph = [
  `[0:v]crop=${W}:${H}:x='${xA}':y=0,setsar=1,format=yuv420p,settb=AVTB[a]`,
  `[1:v]crop=${W}:${H}:x='${xB}':y=0,setsar=1,format=yuv420p,settb=AVTB[b]`,
  `[2:v]crop=${W}:${H}:${BASE_X}:0,setsar=1,tpad=start_duration=${C_HOLD}:start_mode=clone,format=yuv420p,settb=AVTB[c]`,
  `[a][b]xfade=transition=custom:duration=1:offset=${OFF1.toFixed(6)}:expr='${fadeExpr}'[ab]`,
  `[ab][c]xfade=transition=custom:duration=1:offset=${OFF2.toFixed(6)}:expr='${fadeExpr}'[abc]`,
  `[abc]eq=brightness='${bloom}':eval=frame,format=yuv420p[out]`,
].join(";");

console.log(`Master: ${MASTER_FRAMES} frames, ${DURATION.toFixed(3)} s`);
// SKIP_MASTER=1 re-cuts web frames from an existing master (e.g. after changing FOCAL)
if (!(process.env.SKIP_MASTER && fs.existsSync(master))) ff([
  ...CLIPS.flatMap((c) => ["-i", c]),
  "-filter_complex", graph, "-map", "[out]",
  "-c:v", "libx264", "-crf", "10", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", String(FPS),
  master,
]);

// review copy for humans
if (!(process.env.SKIP_MASTER && fs.existsSync(preview))) ff(["-i", master, "-vf", "scale=960:-2", "-c:v", "libx264", "-crf", "24", "-preset", "veryfast", "-pix_fmt", "yuv420p", preview]);

// ── 4: web frames ───────────────────────────────────────────────────────────
const outDir = path.join(root, "public", "sequence");

/** Returns [frameCount, masterSecondsPerFrame[]]. Dense sampling inside DENSE. */
function frames(variant, every, denseEvery, vf, quality) {
  const sel = `select='not(mod(n\\,${every}))+between(n\\,${DENSE[0]}\\,${DENSE[1]})*not(mod(n\\,${denseEvery}))'`;
  const picked = [];
  for (let n = 0; n < MASTER_FRAMES; n++) {
    if (n % every === 0 || (n >= DENSE[0] && n <= DENSE[1] && n % denseEvery === 0)) picked.push(n);
  }
  const dir = path.join(outDir, variant);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  ff([
    "-i", master,
    "-vf", `${sel},${vf}`,
    "-vsync", "vfr",
    "-c:v", "libwebp", "-quality", String(quality), "-compression_level", "6", "-preset", "photo",
    path.join(dir, "frame_%04d.webp"),
  ]);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".webp"));
  const bytes = files.reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
  console.log(`${variant}: ${files.length} frames, ${(bytes / 1e6).toFixed(1)} MB (avg ${(bytes / files.length / 1e3).toFixed(0)} KB)`);
  if (files.length !== picked.length) throw new Error(`${variant}: expected ${picked.length} frames, got ${files.length}`);
  return [files.length, picked.map((n) => Number((n / FPS).toFixed(4)))];
}

// Portrait crop follows the subject. [master seconds, focal X as fraction of the 1760 frame]
const FOCAL = [
  [0, 0.69], [5.8, 0.7], [8.3, 0.62], [9.04, 0.62],
  [10.04, 0.76], [13.2, 0.73], [16.5, 0.62],
  [18.08, 0.62], [19.08, 0.65], [20.3, 0.65], [22.2, 0.64], [26.2, 0.64], [28.88, 0.63],
];
const CW = Math.round((H * 3) / 4); // 742 px, 3:4 portrait window at native resolution (full-screen on phones and tablets)
function focalExpr() {
  // piecewise-linear in t, nested if()
  let e = String(FOCAL[FOCAL.length - 1][1]);
  for (let i = FOCAL.length - 2; i >= 0; i--) {
    const [t0, v0] = FOCAL[i];
    const [t1, v1] = FOCAL[i + 1];
    e = `if(lt(t,${t1}),${v0}+(${v1 - v0})*(t-${t0})/${t1 - t0},${e})`;
  }
  return `min(max((${e})*${W}-${CW / 2},0),${W - CW})`;
}

const [desktop, desktopTimes] = frames("desktop", 2, 1, "scale=1600:900:flags=lanczos", QUALITY_D);
const [mobile, mobileTimes] = frames("mobile", 4, 2, `crop=${CW}:${H}:x='${focalExpr()}':y=0,scale=${CW}:${H}:flags=lanczos`, QUALITY_M);

// ── 5: manifest ─────────────────────────────────────────────────────────────
const manifest = {
  status: "ready",
  note: `Built ${new Date().toISOString().slice(0, 10)} from 01-zrno, 02-mlin, 03-kruh (fixed order). Master ${DURATION.toFixed(3)} s.`,
  version: Date.now().toString(36),
  durationSec: Number(DURATION.toFixed(4)),
  focal: { x: 0.6, y: 0.5 },
  desktop: {
    frameCount: desktop, pattern: "sequence/desktop/frame_{index}.webp", pad: 4, width: 1600, height: 900,
    frameTimes: desktopTimes,
  },
  mobile: {
    frameCount: mobile, pattern: "sequence/mobile/frame_{index}.webp", pad: 4, width: CW, height: H,
    focal: { x: 0.5, y: 0.5 },
    frameTimes: mobileTimes,
  },
};
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// poster = first desktop frame, used before JS runs (no flash)
fs.copyFileSync(path.join(outDir, "desktop", "frame_0001.webp"), path.join(outDir, "poster.webp"));
console.log("manifest.json → ready; poster.webp written");

// headline-zone luminance per desktop frame (drives the adaptive text scrim)
execFileSync("node", [path.join(root, "scripts", "measure-text-luma.mjs")], { stdio: "inherit" });
