# Hero frame sequence — how it is built and how to replace it

## Current state (10. 11. 2026)

The hero plays a real frame sequence built from the three supplied Kling AI clips, **always in this order**:

| # | File in `source-footage/` | Original upload | Content |
|---|---|---|---|
| 1 | `01-zrno.mp4` | `kling_20261110_VIDEO_A_photorea_4481_0.mp4` | wheat ear → grains release → grains fall on a pile |
| 2 | `02-mlin.mp4` | `kling_20261110_VIDEO_Ultra_phot_4505_0.mp4` | grains into a roller mill → flour pours onto a mound |
| 3 | `03-kruh.mp4` | `kling_20261110_VIDEO_Create_an__4616_0.mp4` | hands knead dough → flour cloud → finished loaf, steam |

Each source: 1916×1080, 24 fps, 241 frames (10.04 s). Nothing is ever played backwards in the forward direction.

Master: **28.875 s / 693 frames** → shipped as
- desktop: 366 × 1600×900 WebP (≈ 20 MB) — every 2nd frame, every frame while kneading
- mobile: 184 × 600×800 WebP (≈ 6 MB) — every 4th frame, every 2nd while kneading; 3:4 crop that follows the subject
- `poster.webp` (first frame, shown before JS runs)

The procedural canvas scene is now only a failure fallback.

## Transitions — what was done and what is still not seamless

Boundary frames were inspected before deciding. All three clips share the same top-left warm light shaft and dark background, which makes dissolves read as one film.

**A → B (falling grains → mill), 1 s eased dissolve at 9.04–10.04 s**
A ends on a grain stream at ≈60 % of frame width; B opens on a grain stream at ≈82 %. During the dissolve A drifts 70 px right and B settles from 70 px left, so the streams meet; a slight dust lift (+2.8 % exposure) covers the hand-off.
*Remaining discontinuity:* the mill's frame and rollers ghost in for ~0.4 s over the grain pile. It is a dissolve, not a match. **A 2–3 s bridge shot of grains falling into a hopper/funnel from above (same light) would make this seamless.**

**B → C (flour mound → dough), 1 s eased dissolve at 18.08–19.08 s**
The mound apex and the dough sit at almost the same spot in frame — a genuine graphic match — with a soft flour bloom (+5.5 % exposure). Clip C's first frame is held for 0.75 s under the dissolve.
*Remaining discontinuity:* the baker's forearms fade in over the mound (half-transparent hands for ~0.3 s). **A bridge shot of flour being tipped from a scoop onto the bench, or hands cupping the mound, would remove it.**

**Source limitation — kneading:** clip C shows active kneading for only ~1.3 s (frames 0–30) before the hands lift. The scroll is slowed 2.6× over that stretch and it is sampled at full frame rate, but a longer kneading take (3–4 s) would serve chapter 04 better.

**Watermark:** every source has a "KlingAI 4.0" mark bottom-right. The 1760×990 framing crop (8 %) removes it. If your Kling plan allows watermark-free downloads, replace the files in `source-footage/` with those and rebuild.

## Headline timing (src/config/heroTimeline.ts)

Headlines are tied to master seconds, chosen from the actual frames:

| Chapter | On screen | Picture |
|---|---|---|
| 01 ZRNO | 0 – 8.85 s | ear, grains release and fall |
| — | 8.85 – 9.9 | dissolve, no headline |
| 02 MLIN | 9.9 – 14.6 | mill fully resolved, grains through the rollers |
| 03 BRAŠNO | 14.95 – 18.2 | mill has left frame, flour onto the mound |
| — | 18.2 – 19.0 | dissolve, no headline |
| 04 TIJESTO | 19.0 – 22.6 | kneading hands (fully opaque), resting dough |
| — | 22.6 – 24.4 | flour cloud |
| 05 KRUH | 24.4 – end | loaf legible; CTA "Istražite naše proizvode" from 27.2 s (cloud gone); final frame held for the last 17 % of the scroll |

Scroll → time is not linear (`SPEED`): the ear (1.35×), the rollers (1.45×), the settling flour (1.35×), the kneading (2.6×) and the emerging loaf (1.3×) each get a short dwell, so every chapter has a natural visual hold while scrolling never stops. The hero is 600vh.

Headlines and the CTA follow the frame actually on screen: if a fast jump outruns the network, the previous frame and its headline are held together until the right frames arrive (never a frame of another scene, never a black frame).

**Scene focal points** (`SCENE_FOCAL`) keep the subject whole when the viewport crops the 16:9 frame — ultrawide crops top/bottom (loaf and dough kept), 4:3 crops the sides (subject pushed right, clear of the headline column), short phones crop the 3:4 band.

**Text legibility:** `scripts/measure-text-luma.mjs` stores the luminance of the headline zone for every desktop frame (`manifest.desktop.textLuma`); the bottom-left scrim deepens only on bright frames (flour, dough, loaf) and stays light over the dark opening.

## Rebuilding

```bash
# requires ffmpeg; clips must be in source-footage/ with the names above
npm run hero:build                 # master + preview + desktop/mobile frames + manifest
SKIP_MASTER=1 npm run hero:build   # only re-cut web frames (e.g. after changing mobile FOCAL)
QUALITY=72 QUALITY_MOBILE=66 npm run hero:build   # higher quality, larger files
```

Outputs `source-footage/hero-master.mp4` (1760×990, review/edit master), `source-footage/hero-preview.mp4` (960 px review copy), `public/sequence/*`. Each build stamps `manifest.version`, which is appended to frame URLs, so frames can be cached as immutable on Netlify.

**Replacing a clip** (e.g. watermark-free or a better take): overwrite the file with the same name and rebuild. If its length or timing changes, update `CLIP_FRAMES`/`C_HOLD` in `scripts/build-hero-from-clips.mjs` and the times in `src/config/heroTimeline.ts`.

**Adding a bridge shot**: insert it as a fourth input in `build-hero-from-clips.mjs` between the two clips it bridges (same 1916×1080 / 24 fps), add an `xfade` for it, extend `MASTER_DURATION` and shift the chapter times.

## How the engine behaves

- **Loading:** poster first (preloaded), then the first 16 frames (8 on mobile), then coarse-to-fine (every 32nd, 16th, 8th … frame); frames around the current scroll position jump the queue.
- **Memory:** frames are kept as compressed `<img>` elements; only a sliding window around the playhead (40 desktop / 24 mobile) is promoted to GPU-ready `ImageBitmap`. Decoded memory stays ≈ 230 MB desktop / ≈ 46 MB mobile instead of ≈ 2.1 GB / 350 MB if every frame were held decoded.
- **Scrubbing:** progress → master time → the two bracketing frames, blended by the sub-frame fraction. A missing frame may be replaced only by a loaded neighbour ≤ 6 frames away; otherwise the current picture is held.
- **Variants:** mobile set on screens ≤ 820 px, Data Saver or 2G/3G. On tall phones the film sits as a 3:4 band at the top; its height is computed from the measured headline block so text never covers the subject. Tablets and desktop are full bleed. On screens ≥ 1800 px the header and hero headlines align to the viewport edge instead of a centred 1440 px column.
- **Failure:** if frame 1 or > 25 % of frames fail, the hero falls back to the procedural scene and says so.
- **Reduced motion:** no pin or scrub — five stills from the real sequence, CTA under the last one.

## Why frames and not `<video>`

Scrubbing `video.currentTime` seeks to keyframes, stutters backwards and is unreliable on iOS. Frames give exact, reversible positions; total weight (≈ 20 MB desktop / 6 MB mobile, loaded progressively) is comparable to a high-quality 28 s video.
