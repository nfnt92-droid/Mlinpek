import { preload } from "react-dom";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { StorySection } from "@/components/home/StorySection";
import { MillToBakery } from "@/components/home/MillToBakery";
import { ProductsGallery } from "@/components/home/ProductsGallery";
import { BakeriesContact } from "@/components/home/BakeriesContact";
import { PhotoBand } from "@/components/ui/PhotoBand";

export default function Home() {
  // hero assets: manifest + poster as early as possible (homepage only)
  preload("/sequence/manifest.json", { as: "fetch", crossOrigin: "anonymous" });
  preload("/sequence/poster.webp", { as: "image", fetchPriority: "high", media: "(min-aspect-ratio: 7/10) and (max-width: 1023px), (min-aspect-ratio: 7/10) and (max-aspect-ratio: 1/1)" });
  preload("/sequence/poster-framed.webp", { as: "image", fetchPriority: "high", media: "(min-width: 1024px) and (min-aspect-ratio: 1/1)" });
  preload("/sequence/poster-mobile.webp", { as: "image", fetchPriority: "high", media: "(max-aspect-ratio: 7/10)" });

  return (
    <main>
      {/* 01 — approved cinematic hero, unchanged */}
      <CinematicHero />
      <div id="sadrzaj">
        {/* 02 — story · 03 — mill to bakery · 04 — products · 05 — bakeries & contact */}
        <StorySection />
        <PhotoBand id="deco-loaf" />
        <MillToBakery />
        <ProductsGallery />
        <PhotoBand id="deco-basket-light" align="left">
          Kruh koji okuplja.
        </PhotoBand>
        <BakeriesContact />
      </div>
    </main>
  );
}
