/**
 * Mlinpek wordmark (vectorised from the supplied logo). Gold by default; ivory for very dark grounds.
 * Served as a static SVG file so the ~64 KB of path data is cached once, not inlined on every page.
 * Intrinsic ratio 1792 × 1413.
 */
export function Logo({
  tone = "gold",
  className = "",
  priority = false,
}: {
  tone?: "gold" | "ivory";
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tone === "ivory" ? "/brand/mlinpek-logo-ivory.svg" : "/brand/mlinpek-logo.svg"}
      alt="Mlinpek 1957"
      width={1792}
      height={1413}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={`block h-auto ${className}`}
    />
  );
}
