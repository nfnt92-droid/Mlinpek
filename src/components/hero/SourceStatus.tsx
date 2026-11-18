"use client";

import type { LoadProgress } from "@/lib/sequence/types";
import type { SourceMode } from "./useFrameSource";

/**
 * Honest status for reviewers:
 *  – while frames stream in: a thin load meter (top edge)
 *  – development scene active: a clearly-worded badge (bottom-left corner)
 * Remove the badge only once the final sequence is live (it disappears on its own).
 */
export function SourceStatus({
  mode,
  failure,
  progress,
}: {
  mode: SourceMode;
  failure: string | null;
  progress: LoadProgress | null;
}) {
  const pct = progress ? (progress.loaded / Math.max(1, progress.total)) * 100 : 0;
  const loading = mode === "sequence" && progress && progress.loaded + progress.failed < progress.total;

  return (
    <>
      {mode === "sequence" && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-[2px] transition-opacity duration-700 ${loading ? "opacity-100" : "opacity-0"}`}
        >
          <div className="h-full bg-wheat/60 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
      )}

      {mode === "procedural" && (
        <div
          role="note"
          className="absolute left-6 top-[5.25rem] max-w-[calc(100%-3rem)] border border-wheat/35 bg-[#1b1a16]/70 px-3 py-2 text-[10.5px] uppercase leading-snug tracking-[0.2em] text-wheat backdrop-blur-sm sm:left-10 lg:left-16"
        >
          {failure ? "Sekvenca nije učitana · razvojni prikaz" : "Razvojni prikaz · privremena scena"}
          <span className="block normal-case tracking-normal text-ivory/50">
            Konačna fotografska sekvenca još nije isporučena.
          </span>
        </div>
      )}
    </>
  );
}
