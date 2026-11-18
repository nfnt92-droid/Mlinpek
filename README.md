# Mlinpek — web stranica

Cinematic scroll-driven site for Mlinpek, a vertically integrated mill + bakery.
Next.js 16 (static export) · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger.

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev:lan      # test on a phone: http://<IP računala>:3000 (same Wi-Fi)
npm run build        # static site → out/
```

**Deploy to Cloudflare Pages:** see `CLOUDFLARE.md` (build `npm run build` → `out`, forms via the
Pages Function `functions/api/forma.ts` + Resend, redirects in `public/_redirects`, headers in `public/_headers`).
Netlify also works (`netlify.toml`, Netlify Forms).

## Status

| Part | State |
|---|---|
| Scroll framework (pin, scrub, reverse, chapters, rail) | Done |
| Image-sequence engine (progressive load, DPR canvas, frame blending, mobile variant, fallback) | Done, tested with the real sequence |
| Hero visuals | Real frame sequence from the three Kling clips, two dissolve transitions (see `ASSETS.md` for remaining discontinuities) |
| Homepage | Hero + four sections: story, mill → bakery, products, bakeries & contact; 1160px content container |
| Pages | Simplified to five: Naslovnica, O nama, Proizvodi, Naše pekare, Kontakt (+ 404). Merged routes 301-redirect (netlify.toml) |
| Photography | Temporary Pexels photos (credits in `PHOTO-CREDITS.md`) — replace with the company's own photos via `npm run photos` |
| Logo | `public/brand/mlinpek-logo*.svg`, traced from a 447px JPEG — swap in the designer's original vector when available |
| Company facts, locations, contacts | **Placeholders** — nothing invented |

## Structure

```
src/
  app/                    layout (fonts, lang="hr"), page, globals.css (brand tokens)
  config/chapters.ts      the five chapters: copy + scroll ranges
  config/content.ts       section copy, placeholder facts & locations
  components/hero/
    CinematicHero.tsx     400vh section, ScrollTrigger pin + scrub, rAF render loop, headline choreography
    useFrameSource.ts     manifest → sequence loader, or procedural fallback
    drawHeroFrame.ts      draws the active source to the canvas
    StaticHero.tsx        prefers-reduced-motion version
    ChapterRail.tsx, SourceStatus.tsx
  components/sections/    header, intro, feature, products, bakeries, partnership form, footer
  components/ui/          EditorialFrame (photo placeholder), SceneStill, Reveal
  lib/sequence/           manifest schema + FrameSequenceLoader
  lib/scene/              procedural development scene (fallback)
src/config/heroTimeline.ts  scroll ↔ video time ↔ headline timing (single source of truth)
scripts/
  build-hero-from-clips.mjs  the three clips → master with transitions → web frames + manifest  (npm run hero:build)
  build-sequence.mjs      video / frames → web frames + manifest (ffmpeg)
  make-test-sequence.mjs  numbered test sequence for verifying the engine
```

## Docs

- `CONTENT.md` — where company facts live, what is a placeholder, form/backend integration, SEO
- `PHOTOS.md` — the shot list (39 slots) and how to replace placeholders with photographs
- `ASSETS.md` — the cinematic hero sequence

## Placeholders to replace

- Hero clips — see `ASSETS.md` (watermark-free exports and optional bridge shots)
- `EditorialFrame` usages — each caption names the intended photograph
- `src/config/content.ts` — facts ("Podatak u pripremi"), product range, bakery locations, contact data
- Logo files in `public/brand/` (original vector from the designer)
