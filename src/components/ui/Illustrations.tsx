/** Decorative drawings. Colour comes from the page (currentColor). */

type SvgProps = { className?: string; title?: string };

function svgA11y(title?: string) {
  return title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
}

/**
 * The mill — the client's own line drawing from the new flour packaging (public/brand/mlin-crtez.png,
 * an alpha mask). Painted with currentColor through a CSS mask, so each page sets its colour.
 */
export function MillIllustration({ className = "", title }: SvgProps) {
  const mask = "url(/brand/mlin-crtez.png)";
  return (
    <div
      {...svgA11y(title)}
      className={className}
      style={{
        aspectRatio: "1730 / 683",
        backgroundColor: "currentColor",
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
