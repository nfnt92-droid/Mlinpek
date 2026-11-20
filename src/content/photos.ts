/**
 * Photo registry — every photographic slot on the site, with its shot brief.
 *
 * A slot shows a real photograph as soon as `scripts/build-photos.mjs` has processed a
 * source file named `<id>.(jpg|jpeg|png|webp|tif)` from `photo-sources/` (see PHOTOS.md).
 * Until then it renders a clearly labelled placeholder that doubles as a shot list.
 * No remote URLs are used anywhere, so nothing can break.
 */

import generated from "./photos.generated.json";

export type Tone = "ink" | "steel" | "oven" | "wheat" | "flour" | "linen" | "crust";

export interface PhotoSlot {
  /** what to photograph — shown in the placeholder and used as default alt text */
  brief: string;
  /** alt text once a real photograph is in place (falls back to brief) */
  alt?: string;
  /** placeholder material tone */
  tone: Tone;
  /** object-position focal point in % */
  focal?: [number, number];
  /** focal point on phones (< 640px), where crops are usually taller */
  focalMobile?: [number, number];
}

export const PHOTOS = {
  // ── homepage / manifest
  "manifest-grain": { brief: "Zrno pšenice na dlanu, bočno jutarnje svjetlo", alt: "Ruke drže zrele klasove pšenice u polju, toplo popodnevno svjetlo", tone: "wheat", focal: [50, 55] },

  // ── mill

  // ── flour products (packshots on ivory)
  "flour-t400": { brief: "Packshot: vreća/pakiranje brašna T-400 na svijetloj podlozi", alt: "Makro: fino bijelo brašno", tone: "flour" },
  "flour-t500": { brief: "Packshot: pakiranje brašna T-500, brašno u zdjeli", alt: "Zdjela bijelog brašna na tamnoj podlozi", tone: "flour" },
  "flour-t850": { brief: "Packshot: pakiranje brašna T-850, tamnija nijansa brašna", alt: "Hrpa brašna na drvenoj dasci, uz zrna i klasove", tone: "linen" },
  "flour-integralno": { brief: "Packshot: integralno brašno, vidljive mekinje", alt: "Integralno brašno u staklenci sa žlicom, pogled odozgo", tone: "wheat" },

  // ── bakery production

  // ── bakery products

  // ── individual bakery products (catalogue)

  // ── retail bakeries

  // ── quality
  "quality-crust": { brief: "Makro: korica kruha, tekstura", alt: "Makro: zlatna korica kruha", tone: "crust" },

  // ── b2b

  // ── about
  // ── Mlinpek products: client's own photography (17. 11. 2026); a few from the 2022 catalogue
  "p-integralni-kruh": { brief: "Proizvod: Integralni kruh", alt: "Narezani integralni kruh", tone: "crust", focal: [50, 55] },
  "p-royal-kruh": { brief: "Proizvod: Royal kruh", alt: "Dvije štruce Royal kruha sa sjemenkama suncokreta, uz zdjelu brašna", tone: "crust", focal: [62, 45] },
  "p-domaci-kruh": { brief: "Proizvod: Domaći kruh", alt: "Domaći kruh na papiru za pečenje", tone: "crust", focal: [55, 55] },
  "p-kukuruzna-kiflica": { brief: "Proizvod: Kukuruzna kiflica", alt: "Kukuruzne kiflice s makom na drvenoj dasci", tone: "crust", focal: [52, 50] },
  "p-gladijator": { brief: "Proizvod: Gladijator pecivo", alt: "Gladijator pecivo posuto sjemenkama na drvenoj dasci", tone: "crust", focal: [45, 55] },
  "p-bijeli-kruh": { brief: "Proizvod: Bijeli kruh", alt: "Bijeli kruh — Mlinpek", tone: "crust" },
  "p-polubijeli-kruh": { brief: "Proizvod: Polubijeli kruh", alt: "Polubijeli kruh — Mlinpek", tone: "crust" },
  "p-polubijeli-rezani-kruh": { brief: "Proizvod: Polubijeli rezani kruh", alt: "Polubijeli rezani kruh — Mlinpek", tone: "crust" },
  "p-bakin-kruh": { brief: "Proizvod: Bakin kruh", alt: "Bakin kruh — Mlinpek", tone: "crust" },
  "p-razev-kruh": { brief: "Proizvod: Ražev kruh", alt: "Ražev kruh — Mlinpek", tone: "crust" },
  "p-razev-kruh-2": { brief: "Proizvod: Ražev kruh", alt: "Ražev kruh — Mlinpek, fotografija 2", tone: "crust" },
  "p-kukuruzni-kruh": { brief: "Proizvod: Kukuruzni kruh", alt: "Kukuruzni kruh — Mlinpek", tone: "crust" },
  "p-mijesani-kruh-sa-sjemenkama-bundeve": { brief: "Proizvod: Miješani kruh sa sjemenkama bundeve", alt: "Miješani kruh sa sjemenkama bundeve — Mlinpek", tone: "crust" },
  "p-vital-kruh": { brief: "Proizvod: Vital kruh", alt: "Vital kruh — Mlinpek", tone: "crust" },
  "p-bijeli-tost": { brief: "Proizvod: Bijeli tost", alt: "Bijeli tost — Mlinpek", tone: "crust" },
  "p-bijeli-baguette": { brief: "Proizvod: Bijeli baguette", alt: "Bijeli baguette — Mlinpek", tone: "crust" },
  "p-bijeli-baguette-2": { brief: "Proizvod: Bijeli baguette", alt: "Bijeli baguette — Mlinpek, fotografija 2", tone: "crust" },
  "p-kukuruzni-baguette": { brief: "Proizvod: Kukuruzni baguette", alt: "Kukuruzni baguette — Mlinpek", tone: "crust" },
  "p-kukuruzni-baguette-2": { brief: "Proizvod: Kukuruzni baguette", alt: "Kukuruzni baguette — Mlinpek, fotografija 2", tone: "crust" },
  "p-tamni-baguette": { brief: "Proizvod: Tamni baguette", alt: "Tamni baguette — Mlinpek", tone: "crust" },
  "p-tamni-baguette-2": { brief: "Proizvod: Tamni baguette", alt: "Tamni baguette — Mlinpek, fotografija 2", tone: "crust" },
  "p-mlinpek-mix": { brief: "Proizvod: Mlinpek mix", alt: "Mlinpek mix — Mlinpek", tone: "crust" },
  "p-mlinpek-mix-2": { brief: "Proizvod: Mlinpek mix", alt: "Mlinpek mix — Mlinpek, fotografija 2", tone: "crust" },
  "p-heljdin-kruh": { brief: "Proizvod: Heljdin kruh", alt: "Heljdin kruh — Mlinpek", tone: "crust" },
  "p-kajzerica": { brief: "Proizvod: Kajzerica", alt: "Kajzerica — Mlinpek", tone: "crust" },
  "p-kajzerica-sa-sjemenkama": { brief: "Proizvod: Kajzerica sa sjemenkama", alt: "Kajzerica sa sjemenkama — Mlinpek", tone: "crust" },
  "p-integralna-kajzerica": { brief: "Proizvod: Integralna kajzerica", alt: "Integralna kajzerica — Mlinpek", tone: "crust" },
  "p-chia-kajzerica": { brief: "Proizvod: Chia kajzerica", alt: "Chia kajzerica — Mlinpek", tone: "crust" },
  "p-slana-kifla": { brief: "Proizvod: Slana kifla", alt: "Slana kifla — Mlinpek", tone: "crust" },
  "p-integralna-kifla": { brief: "Proizvod: Integralna kifla", alt: "Integralna kifla — Mlinpek", tone: "crust" },
  "p-kifla-kopriva": { brief: "Proizvod: Kifla kopriva", alt: "Kifla kopriva — Mlinpek", tone: "crust" },
  "p-pletenica": { brief: "Proizvod: Pletenica", alt: "Pletenica — Mlinpek", tone: "crust" },
  "p-zvijezda": { brief: "Proizvod: Zvijezda", alt: "Zvijezda — Mlinpek", tone: "crust" },
  "p-ciabatta": { brief: "Proizvod: Ciabatta", alt: "Ciabatta — Mlinpek", tone: "crust" },
  "p-lepina": { brief: "Proizvod: Lepina", alt: "Lepina — Mlinpek", tone: "crust" },
  "p-hamburger-pecivo": { brief: "Proizvod: Hamburger pecivo", alt: "Hamburger pecivo — Mlinpek", tone: "crust" },
  "p-bavarsko-pecivo": { brief: "Proizvod: Bavarsko pecivo", alt: "Bavarsko pecivo — Mlinpek", tone: "crust" },
  "p-domaca-kiflica-sa-sirom": { brief: "Proizvod: Domaća kiflica sa sirom", alt: "Domaća kiflica sa sirom — Mlinpek", tone: "crust" },
  "p-kifla-sir-i-sunka": { brief: "Proizvod: Kifla sir i šunka", alt: "Kifla sir i šunka — Mlinpek", tone: "crust" },
  "p-kukuruzno-lisnato-sa-sirom": { brief: "Proizvod: Kukuruzno lisnato sa sirom", alt: "Kukuruzno lisnato sa sirom — Mlinpek", tone: "crust" },
  "p-lisnato-sa-hrenovkom": { brief: "Proizvod: Lisnato sa hrenovkom", alt: "Lisnato sa hrenovkom — Mlinpek", tone: "crust" },
  "p-pizza": { brief: "Proizvod: Pizza", alt: "Pizza — Mlinpek", tone: "crust" },
  "p-kroasan-kakao": { brief: "Proizvod: Kroasan kakao", alt: "Kroasan kakao — Mlinpek", tone: "crust" },
  "p-premium-kroasan-cokolada-sa-maslacem": { brief: "Proizvod: Premium kroasan čokolada sa maslacem", alt: "Premium kroasan čokolada sa maslacem — Mlinpek", tone: "crust" },
  "p-premium-kroasan-vanilija-sa-maslacem": { brief: "Proizvod: Premium kroasan vanilija sa maslacem", alt: "Premium kroasan vanilija sa maslacem — Mlinpek", tone: "crust" },
  "p-lisnato-chia-jogurt-borovnica": { brief: "Proizvod: Lisnato chia-jogurt-borovnica", alt: "Lisnato chia-jogurt-borovnica — Mlinpek", tone: "crust" },
  "p-lisnato-kakao-vanilija-malina": { brief: "Proizvod: Lisnato kakao-vanilija-malina", alt: "Lisnato kakao-vanilija-malina — Mlinpek", tone: "crust" },
  "p-lisnato-visnja": { brief: "Proizvod: Lisnato višnja", alt: "Lisnato višnja — Mlinpek", tone: "crust" },
  "p-lisnato-jabuka-cimet": { brief: "Proizvod: Lisnato jabuka-cimet", alt: "Lisnato jabuka-cimet — Mlinpek", tone: "crust" },
  "p-puz-mak": { brief: "Proizvod: Puž mak", alt: "Puž mak — Mlinpek", tone: "crust" },
  "p-krofna-cokolada": { brief: "Proizvod: Krofna čokolada", alt: "Krofna čokolada — Mlinpek", tone: "crust" },
  "p-krofna-marmelada": { brief: "Proizvod: Krofna marmelada", alt: "Krofna marmelada — Mlinpek", tone: "crust" },
  "p-krofna-bijeli-preljev": { brief: "Proizvod: Krofna bijeli preljev", alt: "Krofna bijeli preljev — Mlinpek", tone: "crust" },
  "p-krofna-tamni-preljev": { brief: "Proizvod: Krofna tamni preljev", alt: "Krofna tamni preljev — Mlinpek", tone: "crust" },
  "p-donuts-bijela-cokolada": { brief: "Proizvod: Donuts bijela čokolada", alt: "Donuts bijela čokolada — Mlinpek", tone: "crust" },
  "p-donuts-tamna-cokolada": { brief: "Proizvod: Donuts tamna čokolada", alt: "Donuts tamna čokolada — Mlinpek", tone: "crust" },
  "p-cokoladni-muffin": { brief: "Proizvod: Čokoladni muffin", alt: "Čokoladni muffin — Mlinpek", tone: "crust" },
  "p-cokoladni-muffin-2": { brief: "Proizvod: Čokoladni muffin", alt: "Čokoladni muffin — Mlinpek, fotografija 2", tone: "crust" },
  "p-zlatni-muffin": { brief: "Proizvod: Zlatni muffin", alt: "Zlatni muffin — Mlinpek", tone: "crust" },
  "p-zvrk-sa-sirom": { brief: "Proizvod: Zvrk sa sirom", alt: "Zvrk sa sirom — Mlinpek", tone: "crust" },
  "p-zvrk-sa-mesom": { brief: "Proizvod: Zvrk sa mesom", alt: "Zvrk sa mesom — Mlinpek", tone: "crust" },
  "p-zvrk-sa-krompirom": { brief: "Proizvod: Zvrk sa krompirom", alt: "Zvrk sa krompirom — Mlinpek", tone: "crust" },
  "p-zvrk-sa-zeljem": { brief: "Proizvod: Zvrk sa zeljem", alt: "Zvrk sa zeljem — Mlinpek", tone: "crust" },
  "p-pita-od-jabuka": { brief: "Proizvod: Pita od jabuka", alt: "Pita od jabuka — Mlinpek", tone: "crust" },
  "p-burek": { brief: "Proizvod: Burek", alt: "Burek — Mlinpek", tone: "crust" },
  "p-sirnica": { brief: "Proizvod: Sirnica", alt: "Sirnica — Mlinpek", tone: "crust" },
  "p-zeljanica": { brief: "Proizvod: Zeljanica", alt: "Zeljanica — Mlinpek", tone: "crust" },
  "p-krompirusa": { brief: "Proizvod: Krompiruša", alt: "Krompiruša — Mlinpek", tone: "crust" },
  "p-piletina": { brief: "Proizvod: Piletina", alt: "Piletina — Mlinpek", tone: "crust" },
  "store-mlinpek-1": { brief: "Unutrašnjost Mlinpek pekare: vitrina s kruhom i pecivima, drveni pult s logom", alt: "Unutrašnjost Mlinpek pekare: vitrina s kruhom i pecivima, drveni pult s logom", tone: "crust", focal: [50, 50] },
  "store-mlinpek-2": { brief: "Mlinpek pekara: pult s logom i police s kruhom", alt: "Mlinpek pekara: pult s logom i police s kruhom", tone: "crust", focal: [50, 50] },
  "prod-line-mlinpek": { brief: "Proizvodna linija u Mlinpekovom pogonu, transportna traka", alt: "Proizvodna linija u Mlinpekovom pogonu, transportna traka", tone: "crust", focal: [50, 50] },
  "prod-hall-mlinpek": { brief: "Proizvodna hala Mlinpeka s pekarskim strojevima", alt: "Proizvodna hala Mlinpeka s pekarskim strojevima", tone: "crust", focal: [50, 50] },
  "sandwich-1": { brief: "Sendvič u svježem pecivu sa šunkom i zelenom salatom", alt: "Sendvič u svježem pecivu sa šunkom i zelenom salatom", tone: "crust", focal: [50, 50] },
  "sandwich-2": { brief: "Sendvič u pecivu sa šunkom, sirom i salatom", alt: "Sendvič u pecivu sa šunkom, sirom i salatom", tone: "crust", focal: [50, 50] },

  // ── people / business (temporary Pexels, 20. 11. 2026)
  "people-handshake-office": { brief: "Rukovanje — dobrodošlica novom kolegi", alt: "Dvije osobe se rukuju preko stola u svijetlom uredu", tone: "linen", focal: [50, 45] },
  "people-handshake-deal": { brief: "Poslovno rukovanje, dogovor", alt: "Poslovno rukovanje iznad stola s dokumentima", tone: "linen", focal: [55, 50] },
  "people-interview": { brief: "Razgovor za posao", alt: "Kandidatkinja se smiješi tijekom razgovora za posao u uredu", tone: "linen", focal: [42, 45] },

  // ── client folder "Mlinpek" (18. 11. 2026): 25 kg flour poster, mill painting, production, shops
  "flour-500-25kg": { brief: "Plakat: Brašno pšenično bijelo tip 500, 25 kg — nova ambalaža", alt: "Mlinpek plakat: Novo ruho. Ista vrhunska kvaliteta. Brašno pšenično bijelo tip 500, vreća od 25 kg", tone: "flour", focal: [50, 50] },
  "mill-painting": { brief: "Slika Mlinpekova mlina sa silosima (umjetnička slika)", alt: "Umjetnička slika Mlinpekova mlina u Bugojnu: visoki silosi s natpisom Mlinpek, okruženi zelenilom", tone: "linen", focal: [50, 50] },
  "prod-tanks": { brief: "Proizvodnja: spremnici", alt: "Spremnici od nehrđajućeg čelika u Mlinpekovu pogonu", tone: "crust", focal: [50, 50] },
  "prod-hall-2": { brief: "Proizvodna hala s miješalicama", alt: "Proizvodna hala Mlinpeka s miješalicama za tijesto", tone: "crust", focal: [50, 50] },
  "prod-hall-3": { brief: "Proizvodna linija i hala", alt: "Mlinpekova proizvodna hala: linija za oblikovanje tijesta", tone: "crust", focal: [50, 50] },
  "prod-ovens": { brief: "Hala s pećima i kolicima", alt: "Pekarska hala s kolicima za pečenje i pećima", tone: "crust", focal: [50, 50] },
  "prod-racks": { brief: "Kolica i peći", alt: "Kolica s limovima ispred peći u Mlinpekovoj pekarskoj proizvodnji", tone: "crust", focal: [50, 50] },
  "prod-kornfeil": { brief: "Linija za tijesto", alt: "Automatizirana linija za obradu tijesta u Mlinpekovu pogonu", tone: "crust", focal: [50, 50] },
  "prod-fortuna": { brief: "Stroj za oblikovanje peciva", alt: "Upravljačka ploča stroja za oblikovanje peciva", tone: "crust", focal: [50, 50] },
  "prod-fortuna-line": { brief: "Linija za peciva", alt: "Linija za oblikovanje peciva u Mlinpekovoj proizvodnji", tone: "crust", focal: [50, 50] },
  "prod-rolls": { brief: "Pečene kajzerice", alt: "Tek pečene kajzerice na limu", tone: "crust", focal: [50, 50] },
  "prod-rolls-2": { brief: "Kajzerice izbliza", alt: "Zlatne kajzerice iz peći, izbliza", tone: "crust", focal: [50, 50] },
  "prod-dough": { brief: "Oblikovano tijesto za baguette", alt: "Oblikovano tijesto za baguette na polici prije pečenja", tone: "flour", focal: [50, 50] },
  "prod-donuts": { brief: "Krofne", alt: "Krofne s preljevima i mrvicama u Mlinpekovoj pekari", tone: "crust", focal: [50, 50] },
  "store-mlinpek-3": { brief: "Mlinpek pekara: vitrina i pult", alt: "Mlinpek pekara: vitrine s kruhom i pecivima, pult s logom", tone: "crust", focal: [50, 50] },
  "store-mlinpek-4": { brief: "Mlinpek pekara: dugi pult", alt: "Mlinpek pekara: dugi pult s vitrinama i policama za kruh", tone: "crust", focal: [50, 50] },
  "store-mlinpek-5": { brief: "Mlinpek pekara: pult i sjedenje", alt: "Mlinpek pekara: pult s logom, vitrine i mjesto za sjedenje", tone: "crust", focal: [50, 50] },

  // ── flour (client, 18. 11. 2026): new packaging T-550 + campaign banner + decorative bowl
  "flour-550-1kg": { brief: "Brašno pšenično bijelo tip 550, 1 kg", alt: "Mlinpek brašno pšenično bijelo tip 550, pakiranje 1 kg, na kuhinjskom stolu", tone: "flour", focal: [50, 50] },
  "flour-550-2kg": { brief: "Brašno pšenično bijelo tip 550, 2 kg", alt: "Mlinpek brašno pšenično bijelo tip 550, pakiranje 2 kg, na kuhinjskom stolu", tone: "flour", focal: [50, 50] },
  "flour-550-5kg": { brief: "Brašno pšenično bijelo tip 550, 5 kg", alt: "Mlinpek brašno pšenično bijelo tip 550, pakiranje 5 kg s ručkom, na kuhinjskom stolu", tone: "flour", focal: [50, 55] },
  "flour-banner-550": { brief: "Kampanja: Novo ruho. Ista vrhunska kvaliteta.", alt: "Mlinpek Bugojno — Novo ruho. Ista vrhunska kvaliteta. Brašno tip 550 u pakiranjima od 1, 2 i 5 kg, u žitnom polju", tone: "flour", focal: [50, 50] },
  "deco-flour-bowl": { brief: "Drvena zdjela brašna, klasje i zrno", alt: "Drvena zdjela puna brašna, klasje pšenice i zrna na drvenom stolu", tone: "flour", focal: [50, 50] },

  // ── decorative bands (supplied by Mlinpek, not stock) — mood images, not company facilities
  "deco-loaf": { brief: "Narezani kruh na lanenoj krpi, klasje i zdjela brašna", alt: "Hrskavi okrugli kruh i narezane kriške na lanenoj krpi, uz klasje i drvenu zdjelu brašna", tone: "crust", focal: [42, 55], focalMobile: [48, 55] },
  "deco-assortment": { brief: "Asortiman: kruh, bageta, peciva, kroasani, odozgo", alt: "Raznovrsna peciva odozgo: okrugli kruh, bageta, kroasani, puž s grožđicama i peciva sa sjemenkama", tone: "crust", focal: [50, 50], focalMobile: [58, 50] },
  "deco-basket-light": { brief: "Kruhovi u pletenoj košari, svjetlo kroz prozor", alt: "Tri okrugla kruha u pletenoj košari na lanenoj krpi, klasje i zrno na drvenom stolu, svjetlo kroz prozor", tone: "oven", focal: [62, 55], focalMobile: [70, 58] },
  "deco-basket": { brief: "Košara s kruhom, kroasanima i pecivima", alt: "Pletena košara s okruglim kruhom, kroasanima i pecivima, uz zdjelu brašna i klasje", tone: "crust", focal: [62, 50], focalMobile: [66, 50] },
  "deco-croissants": { brief: "Kroasani, pletenice i kruh sa sjemenkama u košari", alt: "Sjajni kroasani, lisnate pletenice i kruh sa sjemenkama u pletenoj košari", tone: "crust", focal: [50, 50], focalMobile: [42, 55] },
} satisfies Record<string, PhotoSlot>;

export type PhotoId = keyof typeof PHOTOS;

export interface ProcessedPhoto {
  /** intrinsic size of the largest rendition */
  w: number;
  h: number;
  /** available widths — files at /photos/<id>/<width>.webp */
  widths: number[];
  /** tiny blurred preview as data URI */
  blur?: string;
  credit?: string;
  /** true for licensed temporary/stock imagery — labelled on the page */
  temporary?: boolean;
}

export const PROCESSED = generated as Record<string, ProcessedPhoto>;
