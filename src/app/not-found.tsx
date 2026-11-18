import Link from "next/link";

export default function NotFound() {
  return (
    <main id="sadrzaj" className="flex min-h-[80svh] items-end bg-paper text-charcoal">
      <div className="wrap pb-24 pt-40">
        <p className="label text-wheat-deep">404</p>
        <h1 className="mega mt-8">
          Ovdje nema <span className="italic text-wheat-deep">kruha.</span>
        </h1>
        <p className="lede mt-8 max-w-[40ch] text-charcoal/70">Stranica koju tražite ne postoji ili je premještena.</p>
        <Link href="/" className="mt-10 inline-flex items-center gap-4 border-b border-wheat-deep/60 pb-2 text-[12px] font-medium uppercase tracking-[0.24em]">
          Na naslovnicu <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
