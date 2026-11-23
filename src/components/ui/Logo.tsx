/**
 * Mlinpek wordmark (vectorised from the client's new logo, 23. 11. 2026). Gold by default (dark grounds); deep gold for light paper grounds; ivory for very dark grounds.
 * Served as a static SVG file so the ~64 KB of path data is cached once, not inlined on every page.
 * Intrinsic ratio 737 × 536.
 */
export function Logo({
  tone = "gold",
  className = "",
  priority = false,
}: {
  tone?: "gold" | "deep" | "ivory";
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/mlinpek-logo${tone === "gold" ? "" : `-${tone}`}.svg`}
      alt="Mlinpek"
      width={737}
      height={536}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={`block h-auto ${className}`}
    />
  );
}
