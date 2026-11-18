import type { Metadata } from "next";
import { Moved } from "@/components/shared/Moved";
import { FLOURS } from "@/content/flours";

/** Individual flour pages were merged into /proizvodi/ — kept as forwarding stubs so old links work. */
export const dynamicParams = false;
export function generateStaticParams() {
  return FLOURS.map((f) => ({ slug: f.slug }));
}
export const metadata: Metadata = { title: "Stranica je premještena", robots: { index: false, follow: true } };

export default function Page() {
  return <Moved to="/proizvodi/#brasno" />;
}
