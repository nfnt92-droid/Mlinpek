import type { PhotoId } from "./photos";

/**
 * Bakery assortment (Mlinpek). Names, weights and availability come from the client's product
 * photo files (17. 11. 2026: "Naziv, gramaža, Svježe / DZ"); ingredient lists from the
 * "Katalog proizvoda" (Mlinpek d.d., 2022) where the product is in it. No prices.
 * DZ = duboko zamrznuto (frozen line). Photos open full-screen in the catalogue (lightbox).
 */

export interface BakeryCategory {
  id: string;
  label: string;
  line: string;
}

export interface BakeryItem {
  name: string;
  category: BakeryCategory["id"];
  /** net weight / pack as given by the client */
  weight?: string;
  /** first photo is the card image; all open in the lightbox */
  photos: PhotoId[];
  /** "Svježe" and/or "Duboko zamrznuto" */
  availability?: string[];
  /** full ingredient list as printed in the catalogue */
  ingredients?: string;
  /** short description, shown in the quick view instead of ingredients (e.g. flour) */
  description?: string;
}

export const BAKERY_CATEGORIES: BakeryCategory[] = [
  { id: "kruh", label: "Kruhovi", line: "Svakodnevni kruh i bagete od našeg brašna." },
  { id: "premium", label: "Premium kruhovi", line: "Kiselo tijesto, sjemenke i integralno brašno." },
  { id: "peciva", label: "Peciva", line: "Kajzerice, kifle i peciva za svaki dan." },
  { id: "slano", label: "Slana peciva", line: "Lisnato i punjeno — za užinu i usput." },
  { id: "slatko", label: "Slatka peciva i slastice", line: "Kroasani, krofne, lisnato i muffini." },
  { id: "pite", label: "Pite", line: "Zvrk po domaću i pita od jabuka." },
  { id: "kesice", label: "Pite u kesici", line: "Smrznute pite u kesici od 880 g." },
];

export const BAKERY_ITEMS: BakeryItem[] = [
  { name: "Bijeli kruh", category: "kruh", weight: "500 g", photos: ["p-bijeli-kruh"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Polubijeli kruh", category: "kruh", weight: "400 g", photos: ["p-polubijeli-kruh"], availability: ["Svježe"], ingredients: "Pšenično brašno, integralno pšenično brašno, tvar za tretiranje brašna, kvasac, sol, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Polubijeli rezani kruh", category: "kruh", weight: "600 g", photos: ["p-polubijeli-rezani-kruh"], availability: ["Svježe"], ingredients: "Pšenično brašno, integralno pšenično brašno, tvar za tretiranje brašna, kvasac, sol, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Bakin kruh", category: "kruh", weight: "500 g", photos: ["p-bakin-kruh"], availability: ["Svježe"], ingredients: "Pšenično brašno, integralno pšenično brašno, prekrupa soje, sjemenke lana, prekrupa raži, pšenične mekinje, enzimi, tvar za tretiranje brašna, kvasac, sol, kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Ražev kruh", category: "kruh", weight: "500 g", photos: ["p-razev-kruh", "p-razev-kruh-2"], availability: ["Svježe"], ingredients: "Pšenično brašno, raženo brašno, tvar za tretiranje brašna, kvasac, sol, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Kukuruzni kruh", category: "kruh", weight: "500 g", photos: ["p-kukuruzni-kruh"], availability: ["Svježe"] },
  { name: "Miješani kruh sa sjemenkama bundeve", category: "kruh", weight: "500 g", photos: ["p-mijesani-kruh-sa-sjemenkama-bundeve"], availability: ["Svježe"] },
  { name: "Vital kruh", category: "kruh", weight: "500 g", photos: ["p-vital-kruh"], availability: ["Svježe"], ingredients: "Raženo brašno, pšenično integralno brašno, poboljšivač, kvasac, sjemenke suncokreta, voda." },
  { name: "Bijeli tost", category: "kruh", weight: "450 g", photos: ["p-bijeli-tost"], availability: ["Svježe"] },
  { name: "Bijeli baguette", category: "kruh", weight: "250 g", photos: ["p-bijeli-baguette", "p-bijeli-baguette-2"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, sol, suhi kvasac, kiselo tijesto od sušene durum pšenice, tvar za tretiranje brašna. Proizvod sadrži gluten." },
  { name: "Kukuruzni baguette", category: "kruh", weight: "250 g", photos: ["p-kukuruzni-baguette", "p-kukuruzni-baguette-2"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, kukuruzna krupica, kiselo tijesto, sol, tvar za tretiranje brašna, pšenični gluten, šećer, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Tamni baguette", category: "kruh", weight: "250 g", photos: ["p-tamni-baguette", "p-tamni-baguette-2"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, raženo brašno, kukuruzna krupica, kiselo tijesto, sol, tvar za tretiranje brašna, šećer, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Mlinpek mix", category: "premium", weight: "400 g", photos: ["p-mlinpek-mix", "p-mlinpek-mix-2"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, mješavina sjemenki, pšenično kiselo tijesto kvasac i voda. Proizvod sadrži Gluten i mješavinu sjemenki." },
  { name: "Heljdin kruh", category: "premium", weight: "400 g", photos: ["p-heljdin-kruh"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ekstrudirana heljda, tvar za tretiranje brašna, pšenično kiselo tijesto, sol, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Integralni kruh", category: "premium", photos: ["p-integralni-kruh"], ingredients: "Pšenično brašno, integralno pšenično brašno, tekuće kiselo tijesto, sol, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Royal kruh", category: "premium", photos: ["p-royal-kruh"], ingredients: "Pšenično brašno, integralno pšenično brašno, tekuće kiselo tijesto, sol, kvasac, i voda. Proizvod sadrži gluten." },
  { name: "Domaći kruh", category: "premium", photos: ["p-domaci-kruh"], ingredients: "Pšenično brašno, integralno pšenično brašno, tekuće kiselo tijesto, sol, kvasac, i voda. Proizvod sadrži gluten." },
  { name: "Kajzerica", category: "peciva", weight: "6 × 60 g", photos: ["p-kajzerica"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, kiselo tijesto, sol, margarin, sredstvo za tretiranje brašna, šećer, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Kajzerica sa sjemenkama", category: "peciva", weight: "4 × 60 g", photos: ["p-kajzerica-sa-sjemenkama"], availability: ["Svježe"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, šećer, ulje, mješavina sjemenki, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Integralna kajzerica", category: "peciva", weight: "6 × 60 g", photos: ["p-integralna-kajzerica"], availability: ["Svježe"], ingredients: "Pšenično brašno, integralno pšenično brašno, raženo brašno, tvar za tretiranje brašna, kvasac, sol, šećer, ulje, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Chia kajzerica", category: "peciva", weight: "60 g", photos: ["p-chia-kajzerica"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, mješavina za izradu peciva sa sjemenkama “chia”, sjemenke bundeve, kiselo tijesto, sol, tvar za tretiranje brašna, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Slana kifla", category: "peciva", weight: "70 g", photos: ["p-slana-kifla"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, tekuće kiselo tijesto, kvasac, ulje, mlijeko u prahu, sol, šećer, sredstvo za tretiranje brašna i voda. Proizvod sadrži gluten." },
  { name: "Integralna kifla", category: "peciva", weight: "70 g", photos: ["p-integralna-kifla"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, miješavina sjemenki, tekuće kiselo tijesto, kvasac, ulje, sol, šećer, sredstvo za tretiranje brašna i voda. Proizvod sadrži gluten." },
  { name: "Kifla kopriva", category: "peciva", weight: "50 g", photos: ["p-kifla-kopriva"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ekstrudirana kukuruzna krupica, suhi list koprive, mješavina sjemenki, sol, sredstvo za tretiranje brašna, kvasac i voda. Proizvod sadrži Gluten." },
  { name: "Kukuruzna kiflica", category: "peciva", photos: ["p-kukuruzna-kiflica"], ingredients: "Pšenično brašno, ekstrudirana kukuruzna krupica, margarin, sol, sredstvo za tretiranje brašna, šećer, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Pletenica", category: "peciva", weight: "130 g", photos: ["p-pletenica"], availability: ["Svježe"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, šećer, ulje, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Zvijezda", category: "peciva", weight: "400 g (7 kom)", photos: ["p-zvijezda"], availability: ["Svježe"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, šećer, ulje, tekuće kiselo tijesto, voda, sjemenke sezama. Proizvod sadrži gluten." },
  { name: "Ciabatta", category: "peciva", weight: "250 g", photos: ["p-ciabatta"], availability: ["Svježe"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, ulje, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Lepina", category: "peciva", weight: "200 g", photos: ["p-lepina"], availability: ["Svježe"] },
  { name: "Hamburger pecivo", category: "peciva", weight: "250 g", photos: ["p-hamburger-pecivo"] },
  { name: "Bavarsko pecivo", category: "peciva", weight: "130 g", photos: ["p-bavarsko-pecivo"], ingredients: "Pšenično brašno, kiselo tijesto, sol, kvasac, šećer, ulje, tvar za tretiranje brašna, sjemenke sezama lužina i voda. Proizvod sadrži gluten." },
  { name: "Gladijator pecivo", category: "peciva", weight: "130 g", photos: ["p-gladijator"], ingredients: "Pšenično brašno, raženo brašno, obrađeni ječam, obrađena heljda, obrađeni kukuruz, kiselo tijesto, sol, kvasac, tvar za tretiranje brašna, sjemenke lana, kvasac i voda. Proizvod sadrži gluten, soju, jaja u prahu, obrano mlijeko u prahu." },
  { name: "Domaća kiflica sa sirom", category: "slano", weight: "30 g", photos: ["p-domaca-kiflica-sa-sirom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, tvar za tretiranje brašna, kvasac, sol, šećer, ulje, tekuće kiselo tijesto, voda. Proizvod sadrži gluten." },
  { name: "Kifla sir i šunka", category: "slano", weight: "80 g", photos: ["p-kifla-sir-i-sunka"], availability: ["Duboko zamrznuto"] },
  { name: "Kukuruzno lisnato sa sirom", category: "slano", weight: "80 g", photos: ["p-kukuruzno-lisnato-sa-sirom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, kukuruzni mix (ekstrudirana kukuruzna krupica), nadjev od sira, margarin, sol, sredstvo za tretiranje brašna, kvasac i šećer. Proizvod sadrži gluten i proizvode od mlijeka." },
  { name: "Lisnato sa hrenovkom", category: "slano", weight: "100 g", photos: ["p-lisnato-sa-hrenovkom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, margarin, pileća hrenovka, sol, sredstvo za tretiranje brašna, šećer, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Pizza", category: "slano", weight: "150 g", photos: ["p-pizza"], availability: ["Duboko zamrznuto"] },
  { name: "Kroasan kakao", category: "slatko", weight: "80 g", photos: ["p-kroasan-kakao"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, kakao nadjev, margarin, sol, sredstvo za tretiranje brašna i šećer. Proizvod sadrži gluten i proizvode od mlijeka." },
  { name: "Premium kroasan čokolada sa maslacem", category: "slatko", weight: "80 g", photos: ["p-premium-kroasan-cokolada-sa-maslacem"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, maslac, šećer, sol, kvasac i voda. Punjenje čokolada. Proizvod sadrži gluten i mliječne proizvode." },
  { name: "Premium kroasan vanilija sa maslacem", category: "slatko", weight: "80 g", photos: ["p-premium-kroasan-vanilija-sa-maslacem"], availability: ["Duboko zamrznuto"] },
  { name: "Lisnato chia-jogurt-borovnica", category: "slatko", weight: "90 g", photos: ["p-lisnato-chia-jogurt-borovnica"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, mješavina za izradu peciva sa sjemenkama “chia”, nadjev (mješavina sira, jogurta, šećera i vode) margarin, jaja, sol, sredstvo za tretiranje brašna, mlijeko u prahu, kvasac i voda. Proizvod sadrži gluten i proizvode od mlijeka." },
  { name: "Lisnato kakao-vanilija-malina", category: "slatko", weight: "90 g", photos: ["p-lisnato-kakao-vanilija-malina"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, nadjev (punilo vanilije i maline), kakao nadjev, margarin, sol, sredstvo za tretiranje brašna, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Lisnato višnja", category: "slatko", weight: "80 g", photos: ["p-lisnato-visnja"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, nadjev (punilo višnja) margarin, jaja, sol, sredstvo za tretiranje brašna, kvasac i voda. Proizvod sadrži gluten." },
  { name: "Lisnato jabuka-cimet", category: "slatko", weight: "80 g", photos: ["p-lisnato-jabuka-cimet"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, nadjev (svježa jabuka ribana u vlastitom soku, šećer, voda i cimet), margarin, sredstvo za tretiranje brašna, kvasac, sol i voda. Proizvod sadrži gluten." },
  { name: "Puž mak", category: "slatko", weight: "100 g", photos: ["p-puz-mak"], availability: ["Duboko zamrznuto"] },
  { name: "Krofna čokolada", category: "slatko", weight: "80 g", photos: ["p-krofna-cokolada"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, smjesa za krafne, palmino ulje, margarin, jaja, kvasac, voda i punjenje čokolada. Proizvod sadrži gluten, prerađevine mlijeka i jaja." },
  { name: "Krofna marmelada", category: "slatko", weight: "80 g", photos: ["p-krofna-marmelada"], availability: ["Svježe", "Duboko zamrznuto"], ingredients: "Pšenično brašno, smjesa za krafne, palmino ulje, margarin, kvasac, voda i punjenje marmelada. Proizvod sadrži gluten, prerađevine mlijeka i jaja." },
  { name: "Krofna bijeli preljev", category: "slatko", weight: "80 g", photos: ["p-krofna-bijeli-preljev"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, smjesa za krafne, palmino ulju, margarin, jaja, kvasac i voda. Glazura od čokolade i nadjev čokolada. Proizvod sadrži gluten, prerađevine mlijeka i jaja." },
  { name: "Krofna tamni preljev", category: "slatko", weight: "80 g", photos: ["p-krofna-tamni-preljev"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, smjesa za krafne, palmino ulju, margarin, jaja, kvasac i voda. Glazura od čokolade i punjenje marmelada. Proizvod sadrži gluten, prerađevine mlijeka i jaja." },
  { name: "Donuts bijela čokolada", category: "slatko", weight: "50 g", photos: ["p-donuts-bijela-cokolada"], availability: ["Duboko zamrznuto"] },
  { name: "Donuts tamna čokolada", category: "slatko", weight: "50 g", photos: ["p-donuts-tamna-cokolada"], availability: ["Duboko zamrznuto"] },
  { name: "Čokoladni muffin", category: "slatko", weight: "90 g", photos: ["p-cokoladni-muffin", "p-cokoladni-muffin-2"], availability: ["Duboko zamrznuto"], ingredients: "Smjesa za proizvodnju tamnih biskvita, suncokretovo ulje, jaja, voda i krupni dekorativni šećer. Proizvod sadrži gluten, mlijeko i jaja." },
  { name: "Zlatni muffin", category: "slatko", weight: "90 g", photos: ["p-zlatni-muffin"], availability: ["Duboko zamrznuto"], ingredients: "Smjesa za proizvodnju svijetlih biskvita, suncokretovo ulje, jaja, voda i kockice čokolade. Proizvod sadrži gluten mlijeko i jaja." },
  { name: "Zvrk sa sirom", category: "pite", weight: "150 g", photos: ["p-zvrk-sa-sirom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, sol, voda, nadjev (kravlji puno masni sir, jaja i suncokretovo ulje). Proizvod sadrži gluten." },
  { name: "Zvrk sa mesom", category: "pite", weight: "150 g", photos: ["p-zvrk-sa-mesom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ulje suncokreta, sol, voda, nadjev (mljeveno juneće meso, luk, papar). Proizvod sadrži gluten." },
  { name: "Zvrk sa krompirom", category: "pite", weight: "150 g", photos: ["p-zvrk-sa-krompirom"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ulje suncokreta, sol, voda, nadjev (krompir, voda, začini, sol, biber). Proizvod sadrži gluten." },
  { name: "Zvrk sa zeljem", category: "pite", weight: "150 g", photos: ["p-zvrk-sa-zeljem"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ulje suncokreta, sol, voda, nadjev (puno masni sir, špinat, jaja, suncokretovo ulje). Proizvod sadrži gluten." },
  { name: "Pita od jabuka", category: "pite", weight: "150 g", photos: ["p-pita-od-jabuka"], availability: ["Duboko zamrznuto"], ingredients: "Pšenično brašno, ulje suncokreta, sol, voda, nadjev (svježa ribana jabuka u vlastitom soku, šećer i cimet). Proizvod sadrži gluten ." },
  { name: "Burek", category: "kesice", weight: "880 g", photos: ["p-burek"] },
  { name: "Sirnica", category: "kesice", weight: "880 g", photos: ["p-sirnica"] },
  { name: "Zeljanica", category: "kesice", weight: "880 g", photos: ["p-zeljanica"] },
  { name: "Krompiruša", category: "kesice", weight: "880 g", photos: ["p-krompirusa"] },
  { name: "Piletina", category: "kesice", weight: "880 g", photos: ["p-piletina"] },
];

/** Flour from the mill — new packaging (client photos, 18. 11. 2026). */
const FLOUR_550 = "Pšenično bijelo brašno tip 550 iz našeg mlina u Bugojnu, u novom pakiranju — ista kvaliteta.";
export const FLOUR_ITEMS: BakeryItem[] = [
  { name: "Brašno pšenično bijelo tip 550", category: "brasno", weight: "1 kg", photos: ["flour-550-1kg"], description: FLOUR_550 },
  { name: "Brašno pšenično bijelo tip 550", category: "brasno", weight: "2 kg", photos: ["flour-550-2kg"], description: FLOUR_550 },
  { name: "Brašno pšenično bijelo tip 550", category: "brasno", weight: "5 kg", photos: ["flour-550-5kg"], description: FLOUR_550 },
];

/**
 * Lead flour product (client brief 18. 11. 2026: "lider proizvod u kategoriji brašna, 25 kg").
 * Facts from the client's poster "PREMIUM PLAKAT 25 kg": type 500, 25 kg, new packaging, "bogato proteinima".
 */
export const FLOUR_LEAD: BakeryItem = {
  name: "Brašno pšenično bijelo tip 500",
  category: "brasno",
  weight: "25 kg",
  photos: ["flour-500-25kg-pack", "flour-500-25kg"],
  description:
    "Naše brašno tip 500 u vreći od 25 kg, bogato proteinima — u novoj, čvršćoj ambalaži, za još bolje rezultate u svakoj pekarskoj i kulinarskoj priči.",
};

export const categoryById = (id: string) => BAKERY_CATEGORIES.find((c) => c.id === id);
