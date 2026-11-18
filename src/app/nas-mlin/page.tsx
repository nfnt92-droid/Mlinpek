import type { Metadata } from "next";
import { Moved } from "@/components/shared/Moved";
import { MOVED } from "@/content/site";

export const metadata: Metadata = { title: "Stranica je premještena", robots: { index: false, follow: true } };

export default function Page() {
  return <Moved to={MOVED["/nas-mlin/"]} />;
}
