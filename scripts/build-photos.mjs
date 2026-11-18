#!/usr/bin/env node
/**
 * photo-sources/<slot-id>.(jpg|jpeg|png|webp|tif|tiff) →
 *   public/photos/<id>/<width>.webp   (640, 960, 1280, 1920, 2560 — never upscaled)
 *   src/content/photos.generated.json (sizes, blur preview, credit)
 *
 *   npm run photos
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcDir = path.join(root, "photo-sources");
const outDir = path.join(root, "public", "photos");
const genPath = path.join(root, "src", "content", "photos.generated.json");
const WIDTHS = [640, 960, 1280, 1920]; // 1920 is the largest any layout requests

const registry = fs.readFileSync(path.join(root, "src", "content", "photos.ts"), "utf8");
const known = new Set([...registry.matchAll(/^\s+"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]));
const credits = fs.existsSync(path.join(srcDir, "credits.json"))
  ? JSON.parse(fs.readFileSync(path.join(srcDir, "credits.json"), "utf8"))
  : {};

const out = {};
const files = fs.existsSync(srcDir) ? fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)) : [];
for (const file of files) {
  const id = file.replace(/\.[^.]+$/, "");
  if (!known.has(id)) {
    console.warn(`skip ${file}: no slot "${id}" in src/content/photos.ts`);
    continue;
  }
  const input = sharp(path.join(srcDir, file)).rotate();
  const meta = await input.metadata();
  const w0 = meta.width ?? 0;
  const dir = path.join(outDir, id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const widths = WIDTHS.filter((w) => w <= w0);
  if (!widths.length || (w0 > widths.at(-1) * 1.15 && w0 < 1920 && !WIDTHS.includes(w0))) widths.push(w0); // keep native resolution below the 1920 cap
  for (const w of widths) {
    await sharp(path.join(srcDir, file)).rotate().resize({ width: w }).webp({ quality: 78, effort: 5 }).toFile(path.join(dir, `${w}.webp`));
  }
  const top = await sharp(path.join(dir, `${widths.at(-1)}.webp`)).metadata();
  const blurBuf = await sharp(path.join(srcDir, file)).rotate().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  out[id] = {
    w: top.width, h: top.height, widths,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    ...(credits[id] ?? {}),
  };
  console.log(`${id}: ${widths.join(", ")}`);
}
fs.writeFileSync(genPath, JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length} photos processed, ${known.size - Object.keys(out).length} slots still use placeholders`);
