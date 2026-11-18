#!/usr/bin/env node
/**
 * Turns one continuous master clip (or an image folder) into the hero frame sequence.
 *
 *   npm run sequence:build -- source-footage/master.mov
 *   npm run sequence:build -- source-footage/frames/          (folder of numbered PNG/JPG/TIFF)
 *
 * Options (env vars):
 *   DESKTOP_FRAMES=240   frames for desktop (1920 wide)
 *   MOBILE_FRAMES=120    frames for mobile (900×1600 portrait crop)
 *   QUALITY=72           WebP quality (0–100)
 *   FOCAL_X=0.5          horizontal centre of the portrait crop (0–1)
 *
 * Requires ffmpeg on PATH. Writes:
 *   public/sequence/desktop/frame_0001.webp …
 *   public/sequence/mobile/frame_0001.webp …
 *   public/sequence/manifest.json  (status: "ready")
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const input = process.argv[2];
if (!input) {
  console.error("Usage: npm run sequence:build -- <video file | folder of frames>");
  process.exit(1);
}

const DESKTOP_FRAMES = Number(process.env.DESKTOP_FRAMES ?? 240);
const MOBILE_FRAMES = Number(process.env.MOBILE_FRAMES ?? 120);
const QUALITY = Number(process.env.QUALITY ?? 72);
const FOCAL_X = Number(process.env.FOCAL_X ?? 0.5);

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "public", "sequence");

function ff(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

function probeFrameCount(src) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-count_packets",
    "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", src,
  ]).toString().trim();
  return Number(out);
}

const isDir = fs.statSync(input).isDirectory();
let src = input;
let inputArgs = ["-i", src];
let sourceFrames;

if (isDir) {
  const files = fs.readdirSync(input).filter((f) => /\.(png|jpe?g|tiff?|webp|exr)$/i.test(f)).sort();
  if (!files.length) throw new Error("No image frames found in " + input);
  const list = path.join(outDir, ".concat.txt");
  fs.writeFileSync(list, files.map((f) => `file '${path.resolve(input, f)}'\nduration 0.04`).join("\n"));
  inputArgs = ["-f", "concat", "-safe", "0", "-i", list];
  sourceFrames = files.length;
} else {
  sourceFrames = probeFrameCount(src);
}
console.log(`Source: ${sourceFrames} frames`);

function render(variant, count, vf) {
  const dir = path.join(outDir, variant);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  // pick `count` evenly spaced frames across the whole clip
  const step = sourceFrames / count;
  const select = `select='lt(mod(n\\,${step.toFixed(6)})\\,1)'`;
  ff([
    ...inputArgs,
    "-vf", `${select},${vf}`,
    "-vsync", "vfr",
    "-frames:v", String(count),
    "-c:v", "libwebp", "-quality", String(QUALITY), "-compression_level", "5",
    path.join(dir, "frame_%04d.webp"),
  ]);
  const written = fs.readdirSync(dir).filter((f) => f.endsWith(".webp")).length;
  const bytes = fs.readdirSync(dir).reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
  console.log(`${variant}: ${written} frames, ${(bytes / 1e6).toFixed(1)} MB`);
  return written;
}

const desktopCount = render("desktop", DESKTOP_FRAMES, "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080");
const mobileCount = render(
  "mobile",
  MOBILE_FRAMES,
  `scale=-2:1600,crop=900:1600:(in_w-900)*${FOCAL_X}:0`,
);

const manifest = {
  status: "ready",
  note: `Built from ${path.basename(input)} on ${new Date().toISOString().slice(0, 10)}`,
  focal: { x: FOCAL_X, y: 0.5 },
  desktop: { frameCount: desktopCount, pattern: "sequence/desktop/frame_{index}.webp", pad: 4, width: 1920, height: 1080 },
  mobile: { frameCount: mobileCount, pattern: "sequence/mobile/frame_{index}.webp", pad: 4, width: 900, height: 1600 },
};
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
fs.rmSync(path.join(outDir, ".concat.txt"), { force: true });
console.log("manifest.json → status: ready");
