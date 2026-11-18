"use client";

import { useEffect, useRef, useState } from "react";
import { FrameSequenceLoader } from "@/lib/sequence/FrameSequenceLoader";
import { loadManifest, pickVariant } from "@/lib/sequence/manifest";
import type { LoadProgress, SequenceManifest, SequenceVariant, VariantKey } from "@/lib/sequence/types";

export type SourceMode = "checking" | "sequence" | "procedural";

export interface FrameSource {
  mode: SourceMode;
  loader: FrameSequenceLoader | null;
  variant: SequenceVariant | null;
  variantKey: VariantKey | null;
  manifest: SequenceManifest | null;
  /** Set when the real sequence was expected but failed. */
  failure: string | null;
  firstFrameReady: boolean;
  /** Incremented whenever new pixels become available (forces a redraw). */
  revision: number;
}

/**
 * Resolves what the hero draws:
 *   manifest "ready" + frames load → "sequence"
 *   manifest missing / "missing"   → "procedural" (development scene)
 *   frames fail                     → "procedural" + `failure` reason
 *
 * Returns a ref (read every animation frame, no re-renders) and a small
 * piece of React state for UI that genuinely needs to re-render.
 */
export function useFrameSource(enabled = true) {
  const ref = useRef<FrameSource>({
    mode: "checking",
    loader: null,
    variant: null,
    variantKey: null,
    manifest: null,
    failure: null,
    firstFrameReady: false,
    revision: 0,
  });
  const [ui, setUi] = useState<{ mode: SourceMode; failure: string | null; progress: LoadProgress | null }>({
    mode: "checking",
    failure: null,
    progress: null,
  });

  useEffect(() => {
    if (!enabled) return;
    const ac = new AbortController();
    const src = ref.current;
    let lastUiUpdate = 0;

    const toProcedural = (failure: string | null) => {
      src.mode = "procedural";
      src.failure = failure;
      src.loader?.destroy();
      src.loader = null;
      src.revision++;
      setUi({ mode: "procedural", failure, progress: null });
    };

    loadManifest(ac.signal).then((manifest) => {
      if (ac.signal.aborted) return;
      if (!manifest) return toProcedural(null);

      const start = (key: VariantKey, variant: SequenceVariant) => {
        src.manifest = manifest;
        src.variant = variant;
        src.variantKey = key;
        src.mode = "sequence";
        src.firstFrameReady = false;

        const loader = new FrameSequenceLoader(variant, {
          initialCount: key === "mobile" ? 8 : 16,
          concurrency: key === "mobile" ? 4 : 6,
          // decoded-memory ceiling: ~230 MB desktop, ~46 MB mobile
          bitmapBudget: key === "mobile" ? 24 : 40,
          onFirstFrame: () => {
            src.firstFrameReady = true;
            src.revision++;
          },
          onProgress: (progress) => {
            src.revision++;
            const now = performance.now();
            // throttle React updates to ~6/s — the canvas reads the ref directly
            if (now - lastUiUpdate > 160 || progress.loaded + progress.failed === progress.total) {
              lastUiUpdate = now;
              setUi({ mode: "sequence", failure: null, progress });
            }
          },
          onFatal: (reason) => {
            if (ac.signal.aborted) return;
            // the phone variant failing must not cost the film — try the full one first
            if (key === "mobile") {
              console.warn("[sequence] mobile variant failed, using desktop frames:", reason);
              src.loader = null;
              return start("desktop", manifest.desktop);
            }
            console.warn("[sequence] falling back to development scene:", reason);
            toProcedural(reason);
          },
        });
        src.loader = loader;
        src.revision++;
        setUi({ mode: "sequence", failure: null, progress: loader.progress });
        loader.start();
      };

      const { key, variant } = pickVariant(manifest);
      start(key, variant);
    });

    return () => {
      ac.abort();
      src.loader?.destroy();
      src.loader = null;
    };
  }, [enabled]);

  return { source: ref, ui };
}
