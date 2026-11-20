import type { MetadataRoute } from "next";
import { NAV, SITE } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...NAV.map((n) => n.href), "/zaposljavanje/", "/zaposljavanje/prijava/"];
  return paths.map((href) => ({ url: new URL(href, SITE.url).toString(), changeFrequency: "monthly", priority: href === "/" ? 1 : 0.7 }));
}
