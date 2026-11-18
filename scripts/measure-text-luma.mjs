#!/usr/bin/env node
/**
 * Measures the mean luminance of the headline zone (bottom-left of the frame) for
 * every desktop frame and stores it in manifest.desktop.textLuma (0–255).
 * The hero uses it to deepen the local text scrim only on bright frames.
 *
 *   node scripts/measure-text-luma.mjs      (also run by hero:build)
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(root, "public", "sequence", "manifest.json");
const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const v = m.desktop;
const pattern = path.join(root, "public", v.pattern.replace("{index}", `%0${v.pad ?? 4}d`));

// headline zone in frame fractions: x 0–42 %, y 55–97 %
const raw = execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error",
  "-i", pattern,
  "-vf", "crop=iw*0.42:ih*0.42:0:ih*0.55,scale=1:1:flags=area,format=gray",
  "-f", "rawvideo", "-",
], { maxBuffer: 1 << 20 });

if (raw.length !== v.frameCount) throw new Error(`expected ${v.frameCount} values, got ${raw.length}`);
v.textLuma = [...raw];
fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2) + "\n");
const sorted = [...raw].sort((a, b) => a - b);
console.log(`textLuma: min ${sorted[0]}, median ${sorted[sorted.length >> 1]}, max ${sorted[sorted.length - 1]}`);
