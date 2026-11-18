"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One motion system for the whole site (outside the hero), driven by data attributes
 * so pages stay server components:
 *
 *   data-reveal          fade + 24px rise, once; siblings inside one [data-reveal-group] stagger
 *   data-lines           heading: words rise from a mask, once
 *   data-reveal-image    photograph: clip-path wipe upward + settle from 1.06 scale, once
 *   data-parallax        photograph: inner layer drifts ±6% while in view (scrubbed)
 *
 * Only transform/opacity/clip-path are animated → no layout shift. Nothing is hidden
 * before JS runs, and prefers-reduced-motion skips everything.
 * The hero's own ScrollTriggers live in their own gsap.context and are never touched.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const root = document.getElementById("site-content");
    if (!root) return;

    const ctx = gsap.context(() => {
      // word masks
      root.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
        if (!el.dataset.split) {
          splitWords(el);
          el.dataset.split = "1";
        }
        const words = el.querySelectorAll<HTMLElement>("[data-word]");
        gsap.from(words, {
          yPercent: 105,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.035,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      // fades — grouped siblings stagger together
      const done = new Set<Element>();
      root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((g) => {
        const items = [...g.querySelectorAll<HTMLElement>("[data-reveal]")].filter((i) => !done.has(i));
        items.forEach((i) => done.add(i));
        if (!items.length) return;
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: g, start: "top 82%", once: true },
        });
      });
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (done.has(el)) return;
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // image wipes
      root.querySelectorAll<HTMLElement>("[data-reveal-image]").forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-photo-inner]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.fromTo(el, { clipPath: "inset(18% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.out" });
        if (inner && !el.hasAttribute("data-parallax")) {
          tl.from(inner, { scale: 1.06, duration: 1.6, ease: "power3.out" }, 0);
        }
      });

      // parallax
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const inner = el.querySelector<HTMLElement>("[data-photo-inner]");
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    }, root);

    // positions depend on fonts and the hero's pin spacer
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}

/** Wraps each word of a text-only element in a mask; keeps the text readable to AT. */
function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? "").split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            continue;
          }
          const mask = document.createElement("span");
          mask.style.display = "inline-block";
          mask.style.overflow = "hidden";
          mask.style.verticalAlign = "top";
          mask.style.paddingBottom = "0.12em";
          mask.style.marginBottom = "-0.12em";
          const w = document.createElement("span");
          w.dataset.word = "";
          w.style.display = "inline-block";
          w.textContent = part;
          mask.appendChild(w);
          frag.appendChild(mask);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== "BR") {
        walk(child);
      }
    }
  };
  walk(el);
}
