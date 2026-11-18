"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Fallback for routes merged in the simplified site. On Netlify these paths are
 * 301-redirected (netlify.toml) and this page is never served; on any other static
 * host it forwards immediately (query string kept, e.g. ?vrsta=) and offers a link.
 */
export function Moved({ to }: { to: string }) {
  useEffect(() => {
    const [path, hash] = to.split("#");
    window.location.replace(path + window.location.search + (hash ? `#${hash}` : ""));
  }, [to]);
  return (
    <main id="sadrzaj" className="bg-paper text-charcoal">
      {/* no-JS fallback; JS (above) runs first and keeps the query string */}
      <meta httpEquiv="refresh" content={`2;url=${to}`} />
      <div className="wrap section pt-40">
        <p className="lede measure">
          Ova stranica je premještena.{" "}
          <Link href={to} className="underline decoration-wheat-deep/60 underline-offset-4">
            Nastavite ovdje
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
