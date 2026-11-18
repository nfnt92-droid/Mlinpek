"use client";

import { useEffect, useRef } from "react";
import { drawStageImage, effectiveDpr, featherStage, syncCanvasSize } from "@/lib/canvas";
import { renderProceduralScene } from "@/lib/scene/proceduralScene";
import { frameUrl, loadManifest, pickVariant } from "@/lib/sequence/manifest";
import { frameForTime } from "@/lib/sequence/timeline";
import { MASTER_DURATION, progressToTime } from "@/config/heroTimeline";
import { toSceneProgress } from "@/config/chapters";

/**
 * A single still from the hero story at hero progress `at` (0–1).
 * Uses the matching frame of the real sequence when it exists,
 * otherwise renders the development scene once (no animation loop).
 * Used by the reduced-motion hero.
 */
export function SceneStill({ at, className = "" }: { at: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let img: HTMLImageElement | null = null;
    let focal: { x: number; y: number } | undefined;
    let cancelled = false;

    const draw = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const size = { width: r.width, height: r.height, dpr: effectiveDpr(r.width) };
      syncCanvasSize(canvas, size);
      if (img) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#1b1a16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStageImage(ctx, img, canvas.width, canvas.height, focal);
        featherStage(ctx, canvas.width, canvas.height, "#1b1a16");
      } else {
        renderProceduralScene(ctx, { ...size, progress: toSceneProgress(at), time: 0 });
      }
    };

    draw();
    loadManifest().then((m) => {
      if (!m || cancelled) return;
      const { variant } = pickVariant(m);
      focal = variant.focal ?? m.focal;
      const dur = m.durationSec;
      const t = dur ? (progressToTime(at) / MASTER_DURATION) * dur : at;
      const { i0 } = frameForTime(variant, dur ?? 1, t);
      const el = new Image();
      el.src = frameUrl(variant, i0);
      el.decode()
        .then(() => {
          if (cancelled) return;
          img = el;
          draw();
        })
        .catch(() => {
          /* keep the development still */
        });
    });

    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [at]);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
