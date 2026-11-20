"use client";

import { useState } from "react";
import { SITE } from "@/content/site";

/**
 * Paper version of the job application form: download the PDF, print it straight away, or
 * download the Word file. Printing loads the PDF into a hidden frame and opens the print
 * dialog; where the browser can't print an embedded PDF (some mobile browsers) it opens the
 * PDF in a new tab instead, where it can be printed from the viewer.
 */
export function FormDownloads({ tone = "light", word = true }: { tone?: "light" | "dark"; word?: boolean }) {
  const { formPdf, formDocx } = SITE.careers;
  const [busy, setBusy] = useState(false);
  const btn =
    tone === "dark"
      ? "inline-flex min-h-12 items-center gap-3 border border-ivory/30 px-6 text-[12px] uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:border-ivory"
      : "inline-flex min-h-12 items-center gap-3 border border-charcoal/30 px-6 text-[12px] uppercase tracking-[0.2em] transition-colors hover:border-charcoal";

  const print = () => {
    const fallback = () => window.open(formPdf, "_blank", "noopener");
    // phones/tablets and Safari don't print a PDF inside a frame reliably → open the viewer instead
    const touch = window.matchMedia("(hover: none)").matches;
    const safari = /^((?!chrome|chromium|crios|fxios|android|edg).)*safari/i.test(navigator.userAgent);
    if (touch || safari) return fallback();
    setBusy(true);
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0";
    frame.src = formPdf;
    const done = () => setTimeout(() => frame.remove(), 60_000);
    const timer = setTimeout(() => {
      setBusy(false);
      fallback();
      done();
    }, 8000);
    frame.onload = () => {
      clearTimeout(timer);
      setTimeout(() => {
        try {
          frame.contentWindow?.focus();
          frame.contentWindow?.print();
        } catch {
          fallback();
        }
        setBusy(false);
        done();
      }, 400);
    };
    document.body.appendChild(frame);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <a href={formPdf} download="Mlinpek-obrazac-za-prijavu-kandidata-2026.pdf" className={btn}>
        Preuzmi PDF <span aria-hidden="true">↓</span>
      </a>
      <button type="button" onClick={print} disabled={busy} className={`${btn} disabled:opacity-60`}>
        {busy ? "Pripremam ispis…" : "Ispiši PDF"} <span aria-hidden="true">⎙</span>
      </button>
      {word && (
        <a href={formDocx} download="Mlinpek-obrazac-za-prijavu-kandidata-2026.docx" className={btn}>
          Preuzmi Word <span aria-hidden="true">↓</span>
        </a>
      )}
    </div>
  );
}
