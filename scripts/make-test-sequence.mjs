#!/usr/bin/env node
/**
 * Generates a synthetic, numbered TEST clip and runs it through build-sequence.mjs,
 * so the real frame-sequence engine can be verified before footage exists.
 *
 *   npm run sequence:test     → frames + manifest "ready" (numbered test card)
 *   npm run sequence:reset    → back to the development scene
 *
 * Never deploy the test sequence.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tmp = path.join(root, "source-footage");
fs.mkdirSync(tmp, { recursive: true });
const clip = path.join(tmp, "_test-sequence.mp4");

// 10 s @ 24 fps: warm gradient sweep + big frame counter
execFileSync(
  "ffmpeg",
  [
    "-hide_banner", "-loglevel", "error", "-y",
    "-f", "lavfi", "-i", "gradients=s=1920x1080:c0=0x292923:c1=0xCDA66C:c2=0xF3EBDD:n=3:speed=0.02:d=10:r=24",
    "-vf",
    "drawtext=text='TEST %{frame_num}':start_number=1:fontcolor=0x1b1a16:fontsize=180:x=(w-tw)/2:y=(h-th)/2:box=1:boxcolor=0xF3EBDD@0.6:boxborderw=40",
    "-pix_fmt", "yuv420p", clip,
  ],
  { stdio: "inherit" },
);
execFileSync("node", [path.join(root, "scripts", "build-sequence.mjs"), clip], { stdio: "inherit" });
