"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, activeChapterAt } from "@/config/chapters";
import { CTA_FROM, MASTER_DURATION, progressToTime, timeToProgress } from "@/config/heroTimeline";
import { effectiveDpr, syncCanvasSize } from "@/lib/canvas";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { drawHeroFrame } from "./drawHeroFrame";
import { useFrameSource } from "./useFrameSource";
import { ChapterRail } from "./ChapterRail";
import { SourceStatus } from "./SourceStatus";
import { StaticHero } from "./StaticHero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // iOS/Android URL-bar show/hide must not re-measure and jump the pin.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const FADE = 0.024; // max fraction of hero progress used for each headline fade (short: no lingering half-states)

/**
 * Pinned, scroll-scrubbed cinematic hero (600vh).
 *
 *  scroll → ScrollTrigger(scrub) → state.progress (smoothed)
 *         → rAF loop → canvas (frame sequence, or the development scene)
 *                    → headline opacity/offset (direct style writes, no React renders)
 *
 * Native scrolling throughout: no wheel interception, no scroll hijacking.
 */
export function CinematicHero() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <StaticHero />;
  return <ScrubbedHero />;
}

function ScrubbedHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const scrimDeepRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const state = useRef({
    progress: 0,
    dirty: true,
    visible: true,
    mustPaint: true,
    reserve: 0,
    banded: false,
    size: { width: 0, height: 0, dpr: 1 },
  });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const { source, ui } = useFrameSource();

  // ── scroll → progress ────────────────────────────────────────────────────
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      // The stage is held by CSS `position: sticky` (see markup), not a GSAP pin: the browser
      // composites it on the scroll thread, so it cannot lag a frame behind the page and shake
      // (seen on Windows Chrome/Edge with smooth wheel scrolling). Same range: top top → bottom bottom.

      gsap.to(state.current, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          state.current.dirty = true;
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          // a short catch-up gives filmic inertia without feeling detached
          scrub: 0.7,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // ── canvas sizing (DPR aware) ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const measure = () => {
      const r = canvas.getBoundingClientRect();
      const size = { width: r.width, height: r.height, dpr: effectiveDpr(r.width) };
      state.current.size = size;
      if (syncCanvasSize(canvas, size)) state.current.mustPaint = true;
      // headline block height → the art-directed phone band stops above it
      const tops = headlineRefs.current.filter(Boolean).map((el) => el!.getBoundingClientRect().top);
      state.current.reserve = tops.length ? Math.max(0, r.bottom - Math.min(...tops)) : 0;
      state.current.banded = false; // full-bleed everywhere — scrims always on
      state.current.dirty = true;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    headlineRefs.current.forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  // ── pause the loop when the hero is off-screen ───────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      state.current.visible = e.isIntersecting;
      state.current.dirty = true;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── headline choreography from progress ──────────────────────────────────
  const updateOverlay = useCallback((p: number) => {
    CHAPTERS.forEach((ch, i) => {
      const el = headlineRefs.current[i];
      if (!el) return;
      const f = Math.min(FADE, (ch.end - ch.start) / 3);
      const fadeIn = i === 0 ? 1 : clamp01((p - ch.start) / f);
      const fadeOut = i === CHAPTERS.length - 1 ? 0 : clamp01((p - (ch.end - f)) / f);
      const o = fadeIn * (1 - fadeOut);
      const y = (1 - fadeIn) * 28 - fadeOut * 22;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.visibility = o < 0.005 ? "hidden" : "visible";
    });
    // CTA: only once the loaf is stable (cloud gone), then held with the final frame
    if (ctaRef.current) {
      const t = progressToTime(p);
      const c = clamp01((t - CTA_FROM) / 0.6);
      ctaRef.current.style.opacity = c.toFixed(3);
      ctaRef.current.style.transform = `translate3d(0, ${((1 - c) * 10).toFixed(1)}px, 0)`;
      ctaRef.current.style.visibility = c < 0.02 ? "hidden" : "visible";
    }
    const idx = activeChapterAt(p);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
    if (cueRef.current) cueRef.current.style.opacity = String(1 - clamp01(p / 0.03));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    sectionRef.current?.setAttribute("data-progress", p.toFixed(3));
  }, []);

  // ── render loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // alpha: the poster behind the canvas shows until the first frame is decoded
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastRevision = -1;
    let lastDrawn = -2;
    let lastLuma = -2;
    let shown = false;
    let shownT = 0; // master time of the frame currently on the canvas (poster = 0)
    let lastP = -1;
    const t0 = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const s = state.current;
      if (!s.visible) return;
      const src = source.current;
      const p = s.progress;

      // procedural scene breathes (ambient motion); sequence redraws only on change
      const ambient = src.mode === "procedural";
      const changed = s.dirty || src.revision !== lastRevision || p !== lastP;
      if (!ambient && !changed) return;

      const drawn = drawHeroFrame({
        ctx,
        width: s.size.width,
        height: s.size.height,
        dpr: s.size.dpr,
        progress: p,
        time: (now - t0) / 1000,
        source: src,
        reserve: s.reserve,
        mustPaint: s.mustPaint,
      });
      if (drawn.painted) s.mustPaint = false;

      // Headlines/CTA follow the picture actually on screen. If a fast jump outruns the
      // network, the previous frame is held — and so is its headline, so text and image
      // never disagree; both move on together once the right frames arrive.
      let overlayP = p;
      if (src.mode === "sequence") {
        if (drawn.shownT >= 0) shownT = drawn.shownT;
        const dur = src.manifest?.durationSec ?? MASTER_DURATION;
        // the picture lags the scroll (frames still downloading) → text waits for it
        if (Math.abs(shownT - drawn.t) > 0.35) overlayP = timeToProgress((shownT / dur) * MASTER_DURATION);
      }
      if (overlayP !== lastP) {
        updateOverlay(overlayP);
        lastP = overlayP;
      }

      // legibility: deepen the local scrim only when the headline zone is bright
      if (drawn.luma !== lastLuma) {
        lastLuma = drawn.luma;
        const L = drawn.luma < 0 ? 60 : drawn.luma;
        const base = s.banded ? 0 : 0.5 + 0.5 * clamp01((L - 30) / 90);
        const deep = s.banded ? 0 : clamp01((L - 85) / 60) * 0.85;
        if (scrimRef.current) scrimRef.current.style.opacity = base.toFixed(3);
        if (scrimDeepRef.current) scrimDeepRef.current.style.opacity = deep.toFixed(3);
      }

      if (drawn.painted && !shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
      if (src.mode === "sequence" && src.loader && drawn.index !== lastDrawn) {
        src.loader.prioritize(drawn.index);
        canvas.dataset.frame = String(drawn.index + 1);
        lastDrawn = drawn.index;
      }
      if (src.mode === "sequence") canvas.dataset.time = drawn.t.toFixed(2);
      s.dirty = false;
      lastRevision = src.revision;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [source, updateOverlay]);

  const scrollToChapter = useCallback((i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    const ch = CHAPTERS[i];
    const target = i === 0 ? top : top + distance * (ch.start + Math.min(0.03, (ch.end - ch.start) * 0.3));
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="prica"
      aria-label="Od zrna do kruha — priča u pet poglavlja"
      className="relative h-[600vh] bg-[#1b1a16]"
      data-progress="0"
    >
      <div
        ref={stageRef}
        className="hero-stage sticky top-0 h-lvh w-full overflow-hidden bg-[#1b1a16] bg-cover bg-[position:60%_50%] bg-[image:var(--poster)] [@media(max-aspect-ratio:7/10)]:bg-[image:var(--poster-m)] [@media(max-aspect-ratio:7/10)]:bg-[position:var(--poster-m-x)_50%]"
        style={
          {
            "--poster": ui.mode === "procedural" ? "none" : "url(/sequence/poster.webp)",
            // portrait: the first frame of the phone cut (full-bleed, like the canvas), so the
            // opening picture is there even before (or without) the frame sequence
            "--poster-m": ui.mode === "procedural" ? "none" : "url(/sequence/poster-mobile.webp)",
            "--poster-m-x": "50%",
            "--poster-framed": ui.mode === "procedural" ? "none" : "url(/sequence/poster-framed.webp)",
            "--poster-soft": ui.mode === "procedural" ? "none" : "url(/sequence/poster-soft.webp)",
          } as React.CSSProperties
        }
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-700"
          data-mode={ui.mode}
        />

        {/* legibility scrims — bottom-left, where the headlines live; opacity follows frame luminance */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_75%_at_0%_100%,rgba(18,17,14,0.86)_0%,rgba(18,17,14,0.45)_40%,transparent_66%)]"
        />
        <div
          ref={scrimDeepRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(48%_46%_at_14%_80%,rgba(14,13,11,0.78)_0%,rgba(14,13,11,0.42)_55%,transparent_100%)]"
        />
        {/* portrait phones/tablets: the headline block spans the lower half, full width */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,rgba(18,17,14,0.82)_0%,rgba(18,17,14,0.5)_30%,rgba(18,17,14,0)_58%)] [@media(max-aspect-ratio:1/1)]:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(18,17,14,0.55)] to-transparent"
        />

        {/* Headlines — real headings in DOM order for assistive tech */}
        <div className="hero-copy pointer-events-none absolute inset-x-0 px-6 sm:px-10 lg:px-16">
          <div className="relative mx-auto max-w-[1440px] min-[1800px]:max-w-none">
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.id}
                ref={(el) => {
                  headlineRefs.current[i] = el;
                }}
                className="absolute bottom-0 left-0 w-[min(100%,46rem)] will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
              >
                <p className="eyebrow mb-5 text-wheat">
                  <span className="tabular-nums">0{ch.index}</span>
                  <span className="mx-3 inline-block h-px w-8 translate-y-[-0.3em] bg-wheat/60 align-middle" />
                  {ch.label}
                </p>
                {i === 0 ? (
                  <h1 className="display max-w-[13ch] text-ivory">{ch.headline}</h1>
                ) : (
                  <h2 className="display max-w-[13ch] text-ivory">{ch.headline}</h2>
                )}
                <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ivory/70 sm:text-base">{ch.lede}</p>
                {i === CHAPTERS.length - 1 && (
                  <a
                    ref={ctaRef}
                    href="#proizvodi"
                    onClick={goToProducts}
                    className="group pointer-events-auto mt-8 inline-flex items-center gap-4 border-b border-wheat/50 pb-2 text-[12px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:border-wheat hover:text-wheat"
                    style={{ opacity: 0, visibility: "hidden" }}
                  >
                    Istražite naše proizvode
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <ChapterRail active={active} onSelect={scrollToChapter} />

        {/* scroll progress hairline */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ivory/10">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-wheat/70" />
        </div>

        <div
          ref={cueRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-6 hidden items-center sm:flex gap-3 text-[11px] uppercase tracking-[0.28em] text-ivory/55 sm:right-10 lg:right-16"
        >
          <span>Pomaknite prema dolje</span>
          <span className="scroll-cue-line block h-10 w-px bg-ivory/30" />
        </div>

        <SourceStatus mode={ui.mode} failure={ui.failure} progress={ui.progress} />
      </div>
    </section>
  );
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function goToProducts(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("proizvodi");
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", "#proizvodi");
}
