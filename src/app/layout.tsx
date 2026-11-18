import type { Metadata, Viewport } from "next";
import "@fontsource-variable/eb-garamond";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "@fontsource-variable/inter-tight";
import "./globals.css";
import { SITE } from "@/content/site";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { MotionRoot } from "@/components/ui/MotionRoot";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — mlin, pekarska proizvodnja i pekare`,
    template: `%s — ${SITE.brand}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: SITE.brand,
    title: `${SITE.brand} — mlin, pekarska proizvodnja i pekare`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1b1a16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body id="top">
        <a
          href="#sadrzaj"
          className="sr-only z-[70] bg-wheat px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Preskoči na sadržaj
        </a>
        <SiteHeader />
        <div id="site-content">{children}</div>
        <SiteFooter />
        <MotionRoot />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
