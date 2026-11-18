import Link from "next/link";
import type { ReactNode } from "react";

/** "02 ——— Label" — the numbering system carried over from the hero chapters. */
export function Eyebrow({
  index,
  children,
  tone = "dark",
  className = "",
}: {
  index?: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const c = tone === "light" ? "text-wheat" : "text-wheat-deep";
  const l = tone === "light" ? "bg-wheat/60" : "bg-wheat-deep/50";
  return (
    <p className={`label ${c} ${className}`} data-reveal>
      {index && (
        <>
          <span className="tabular">{index}</span>
          <span aria-hidden="true" className={`mx-3 inline-block h-px w-8 translate-y-[-0.3em] align-middle ${l}`} />
        </>
      )}
      {children}
    </p>
  );
}

/** Underlined text CTA with arrow — the same voice as the hero's final CTA. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const c =
    tone === "light"
      ? "text-ivory border-wheat/50 hover:text-wheat hover:border-wheat"
      : "text-charcoal border-wheat-deep/60 hover:text-wheat-deep hover:border-wheat-deep";
  const external = href.startsWith("http");
  const cls = `group inline-flex items-center gap-4 border-b pb-2 text-[12px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${c} ${className}`;
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Marks illustrative content so it is never mistaken for verified company information. */
export function ExampleNote({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  const c = tone === "light" ? "border-wheat/40 text-wheat" : "border-wheat-deep/40 text-wheat-deep";
  return (
    <p role="note" className={`inline-block border px-3 py-1.5 text-[11.5px] sm:text-[11px] uppercase leading-snug tracking-[0.18em] ${c} ${className}`}>
      {children}
    </p>
  );
}

/** Simple ledger of verified facts. Renders nothing when there are none. */
export function FactsLedger({
  facts,
  tone = "dark",
  className = "",
}: {
  facts: { value: string; label: string }[];
  tone?: "dark" | "light";
  className?: string;
}) {
  if (!facts.length) return null;
  const line = tone === "light" ? "border-ivory/15" : "border-charcoal/15";
  const cols = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"][Math.min(4, facts.length) - 1];
  return (
    <dl className={`grid grid-cols-2 gap-x-8 border-t ${cols} ${line} ${className}`}>
      {facts.map((f) => (
        <div key={f.label} className={`border-b py-6 ${line}`} data-reveal>
          <dt className="sr-only">{f.label}</dt>
          <dd>
            <span className="font-display block text-[clamp(2.4rem,4vw,3.6rem)] leading-none">{f.value}</span>
            <span className="label mt-3 block opacity-60">{f.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
