/**
 * Company-level facts. EVERYTHING here is editable and nothing may be invented.
 * A field left `null` (or an empty array) is simply not rendered — no placeholder
 * values ever reach the public page except where a component labels them as such.
 */

export const SITE = {
  brand: "Mlinpek",
  brandIsTemporary: false,
  /** legal company name (Općinski sud u Travniku, rješenje 051-0-Reg-25-000117) */
  legalName: "Prehrambena industrija „MLINPEK” d.d. Bugojno" as string | null,
  /** used for canonical URLs, sitemap and Open Graph — set SITE_URL at build time */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? process.env.CF_PAGES_URL ?? process.env.URL ?? "http://localhost:3000",
  description:
    "Mlinpek d.d. Bugojno — mlin, pekarska proizvodnja i pekare od 1957. godine. Od zrna do kruha.",
  /** head office (client's "Podaci o poslovnicama", row Uprava) */
  contact: {
    email: "mlinpek@bih.net.ba" as string | null,
    phone: "+387 30 252 002" as string | null,
    /** street, postcode, city */
    address: "Gornjevakufska 35, 70230 Bugojno" as string | null,
    /** separate inbox for wholesale, if any */
    salesEmail: null as string | null,
    hours: "Pon – pet 08:00 – 16:00" as string | null,
  },
  /** other departments with their own line (same source) */
  departments: [
    { label: "Pravna služba", phone: "+387 61 100 935", email: "pravna.sluzba@mlinpek.ba", hours: "Pon – pet 08:00 – 16:00" },
  ] as { label: string; phone?: string; email?: string; hours?: string }[],
  /** official registration numbers (client's "ID, PDV, Rješenje" document) — only these three are published */
  registry: {
    idNumber: "4236113090004",
    vatNumber: "236113090004",
    decisionNumber: "051-0-Reg-25-000117",
  },
  /** downloadable job application form (client-supplied) */
  careers: {
    formDocx: "/dokumenti/mlinpek-obrazac-za-prijavu-kandidata-2026.docx",
    formPdf: "/dokumenti/mlinpek-obrazac-za-prijavu-kandidata-2026.pdf",
    formTitle: "Obrazac za prijavu kandidata 2026. godine",
  },
  /** Official profiles only — shown as icon buttons in the footer once filled, e.g.
   *  { label: "Instagram", href: "https://www.instagram.com/…/" }, { label: "Facebook", href: "https://www.facebook.com/…/" } */
  social: [] as { label: "Instagram" | "Facebook"; href: string }[],
  legal: [
    // add real documents when available, e.g. { label: "Pravila privatnosti", href: "/privatnost/" }
  ] as { label: string; href: string }[],
  /**
   * Set to true only once name, address and contact data above are verified —
   * enables schema.org Organization markup.
   */
  verified: true,
};

export interface NavItem {
  href: string;
  label: string;
  /** shorter label for the desktop bar */
  short?: string;
}

export const NAV: NavItem[] = [
  { href: "/", label: "Naslovnica" },
  { href: "/o-nama/", label: "O nama" },
  { href: "/proizvodi/", label: "Proizvodi" },
  { href: "/nase-pekare/", label: "Naše pekare" },
  { href: "/zaposljavanje/", label: "Zapošljavanje" },
  { href: "/kontakt/", label: "Kontakt" },
];

/**
 * Routes consolidated in the simplified site → where they now live.
 * Used by netlify.toml (301) and by the fallback pages kept at the old paths.
 */
export const MOVED: Record<string, string> = {
  "/nas-mlin/": "/o-nama/#mlin",
  "/pekarska-proizvodnja/": "/o-nama/#proizvodnja",
  "/brasna/": "/proizvodi/#brasno",
  "/pekarski-proizvodi/": "/proizvodi/#pekarski",
  "/suradnja/": "/kontakt/#upit",
};

/**
 * Verified production facts for the mill (capacity, range, equipment, years).
 * EMPTY = the facts ledger is not rendered at all. Example of a verified entry:
 *   { value: "…", label: "tona pšenice dnevno" }
 */
export const MILL_FACTS: { value: string; label: string }[] = [];

/** Verified facts for the bakery production. Empty = not rendered. */
export const BAKERY_FACTS: { value: string; label: string }[] = [];

/**
 * Genuine certifications, lab programmes, awards. Empty = the block is not rendered.
 * Never add ISO/HACCP/IFS or awards without the client's documentation.
 */
export const CERTIFICATIONS: { name: string; detail?: string; year?: string }[] = [];

/** Company milestones for "O nama". Empty = a labelled outline is shown instead. */
export const MILESTONES: { year: string; title: string; text?: string }[] = [
  // from the client's "Tekst za rubriku O NAMA"
  { year: "1957.", title: "Početak priče", text: "Osnivanje mlinske i pekarske industrije u Bugojnu." },
  { year: "1990-e", title: "Privredni stub regije", text: "Razvoj proizvodnih, prodajnih i skladišnih kapaciteta." },
  { year: "2007.", title: "Privatizacija", text: "Transformacija i stabilna, snažna vlasnička struktura." },
  { year: "2021.", title: "Investicijski ciklus", text: "Modernizacija pogona, automatizacija i novi proizvodni kapaciteti." },
];

/** Mill equipment list for "Naš mlin". Empty = a labelled outline is shown instead. */
export const EQUIPMENT: { name: string; detail?: string }[] = [];
