import type { ReactNode } from "react";
import { Photo } from "@/components/ui/Photo";
import type { PhotoId } from "@/content/photos";

/**
 * A full-bleed photographic pause between text sections — breaks the rhythm of the page.
 * Cinematic letterbox on wide screens, a taller crop on phones (each photo has its own
 * mobile focal point). The image drifts gently with scroll (MotionRoot, off for reduced motion).
 * Optional short line sits in the photo's quiet side; on phones it moves to the bottom over a scrim.
 */
export function PhotoBand({
  id,
  children,
  align = "left",
  ratio = "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]",
}: {
  id: PhotoId;
  children?: ReactNode;
  /** which side of the photo is calm enough for the line */
  align?: "left" | "right";
  ratio?: string;
}) {
  return (
    <div className={`relative ${ratio} max-h-[88svh] w-full overflow-hidden bg-ink`}>
        <Photo id={id} fill parallax sizes="100vw" />
        {children && (
          <>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent sm:via-transparent ${
                align === "left" ? "sm:bg-gradient-to-r" : "sm:bg-gradient-to-l"
              } sm:from-ink/65`}
            />
            <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:flex sm:items-center">
              <div className={`wrap w-full pb-10 sm:pb-0 ${align === "right" ? "sm:flex sm:justify-end" : ""}`}>
                <p className="max-w-[16ch] font-display text-[2.1rem] leading-[1.05] text-ivory sm:text-[2.6rem] lg:text-[3.4rem]" data-lines>
                  {children}
                </p>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
