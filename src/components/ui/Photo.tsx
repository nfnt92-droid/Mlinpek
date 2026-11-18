import { PHOTOS, PROCESSED, type PhotoId, type Tone } from "@/content/photos";

const TONE: Record<Tone, { bg: string; fg: string; line: string }> = {
  ink: { bg: "bg-[#211f1a]", fg: "text-ivory/55", line: "border-ivory/15" },
  steel: { bg: "bg-[#262928]", fg: "text-ivory/55", line: "border-ivory/15" },
  oven: { bg: "bg-[#33251a]", fg: "text-ivory/60", line: "border-ivory/15" },
  crust: { bg: "bg-[#5e3e24]", fg: "text-ivory/65", line: "border-ivory/20" },
  wheat: { bg: "bg-[#b9955f]", fg: "text-ink/65", line: "border-ink/15" },
  linen: { bg: "bg-[#ddd1bd]", fg: "text-ink/55", line: "border-ink/12" },
  flour: { bg: "bg-[#ece5d8]", fg: "text-ink/55", line: "border-ink/12" },
};

interface Props {
  id: PhotoId;
  /** aspect utility, e.g. "aspect-[4/5]"; omit with `fill` */
  ratio?: string;
  /** fill the positioned parent instead of using an aspect ratio */
  fill?: boolean;
  /** responsive sizes attribute, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** adds a parallax-ready inner layer (handled by MotionRoot) */
  parallax?: boolean;
  /** clip-path reveal on scroll (handled by MotionRoot) */
  reveal?: boolean;
  alt?: string;
  /** where the placeholder/credit label sits — "top" when text is overlaid at the bottom */
  labelAt?: "bottom" | "top";
}

/**
 * Every photograph on the site goes through here.
 *  – processed photo available → responsive WebP <img> with blur preview, never upscaled
 *  – not yet available → labelled placeholder with the shot brief (no remote URLs, nothing can break)
 * Temporary/stock imagery is labelled with its credit, so it is never mistaken for the company's own.
 */
export function Photo({ id, ratio, fill, sizes = "100vw", priority, className = "", parallax, reveal, alt, labelAt = "bottom" }: Props) {
  const slot = PHOTOS[id] as (typeof PHOTOS)[PhotoId] & { alt?: string; focal?: [number, number]; focalMobile?: [number, number] };
  const done = PROCESSED[id];
  const box = fill ? "absolute inset-0" : `relative ${ratio ?? "aspect-[4/5]"}`;
  const focal = slot.focal ? `${slot.focal[0]}% ${slot.focal[1]}%` : "50% 50%";
  const focalMobile = slot.focalMobile ? `${slot.focalMobile[0]}% ${slot.focalMobile[1]}%` : focal;
  const motion = {
    ...(reveal ? { "data-reveal-image": "" } : {}),
    ...(parallax ? { "data-parallax": "" } : {}),
  };

  if (done) {
    const srcSet = done.widths.map((w) => `/photos/${id}/${w}.webp ${w}w`).join(", ");
    const largest = done.widths[done.widths.length - 1];
    return (
      <figure className={`${box} overflow-hidden bg-linen ${className}`} {...motion}>
        <div className={`absolute ${parallax ? "-inset-y-[8%] inset-x-0" : "inset-0"}`} data-photo-inner>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/photos/${id}/${done.widths.includes(1280) ? 1280 : largest}.webp`}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt ?? slot.alt ?? slot.brief}
            width={done.w}
            height={done.h}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="h-full w-full object-cover [object-position:var(--fpm)] sm:[object-position:var(--fp)]"
            style={{ ["--fp" as string]: focal, ["--fpm" as string]: focalMobile, backgroundImage: done.blur ? `url(${done.blur})` : undefined, backgroundSize: "cover" }}
          />
        </div>
        {done.temporary && (
          <figcaption className={`pointer-events-none absolute ${labelAt === "top" ? "right-3 top-20" : "bottom-3 left-3"} max-w-[calc(100%-1.5rem)] truncate bg-ink/45 px-2 py-1 text-[10px] tracking-wide text-ivory/75 backdrop-blur-sm`}>
            Privremena fotografija{done.credit ? ` · ${done.credit}` : ""}
          </figcaption>
        )}
      </figure>
    );
  }

  const t = TONE[slot.tone];
  return (
    <figure
      className={`@container ${box} overflow-hidden ${t.bg} ${className}`}
      role="img"
      aria-label={`Fotografija u pripremi: ${slot.brief}`}
      {...motion}
    >
      <div className={`absolute ${parallax ? "-inset-y-[8%] inset-x-0" : "inset-0"} ${t.bg}`} data-photo-inner>
        <div aria-hidden="true" className="grain absolute inset-0 opacity-25 mix-blend-overlay" />
      </div>
      {/* crop marks */}
      <span aria-hidden="true" className={`absolute left-4 top-4 h-4 w-4 border-l border-t ${t.line}`} />
      <span aria-hidden="true" className={`absolute right-4 top-4 h-4 w-4 border-r border-t ${t.line}`} />
      <span aria-hidden="true" className={`absolute bottom-4 left-4 h-4 w-4 border-b border-l ${t.line}`} />
      <span aria-hidden="true" className={`absolute bottom-4 right-4 h-4 w-4 border-b border-r ${t.line}`} />
      <figcaption
        aria-hidden="true"
        className={`absolute max-w-[34ch] text-[11px] leading-relaxed ${t.fg} ${
          labelAt === "top" ? "right-6 top-24 text-right sm:right-10 lg:right-16" : "inset-x-6 bottom-6 @max-[14rem]:inset-x-3 @max-[14rem]:bottom-3"
        }`}
      >
        <span className="label block text-[9.5px] @max-[14rem]:text-[8px]">Fotografija u pripremi</span>
        {/* small slots show only the label — the brief would not fit legibly */}
        <span className="mt-1 block @max-[14rem]:hidden">{slot.brief}</span>
      </figcaption>
    </figure>
  );
}
