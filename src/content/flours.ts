import type { PhotoId } from "./photos";

/**
 * Flour catalogue. ALL ENTRIES ARE ILLUSTRATIVE EXAMPLES (`example: true`) until the
 * client confirms the actual range. Example records are labelled on every page that
 * shows them. Specifications stay empty until supplied — never estimate values.
 */
export interface Flour {
  slug: string;
  name: string;
  /** e.g. "T-500" — type designation as printed on the packaging */
  type: string;
  category: "pšenično" | "integralno" | "ostalo";
  summary: string;
  description: string;
  uses: string[];
  /** packaging formats offered, e.g. "1 kg", "25 kg vreća" — empty until confirmed */
  packaging: string[];
  /** lab/spec sheet values supplied by the mill */
  specs: { label: string; value: string }[];
  photo: PhotoId;
  example: boolean;
}

export const FLOURS: Flour[] = [
  {
    slug: "psenicno-brasno-t-400",
    name: "Pšenično brašno",
    type: "T-400",
    category: "pšenično",
    summary: "Najsvjetlije, najfinije mljeveno brašno.",
    description:
      "Glatko i bijelo, za tijesta koja traže finu strukturu i ravnomjernu boju — od dizanih kolača do finih peciva.",
    uses: ["Fina peciva", "Kolači i biskviti", "Dizana slatka tijesta"],
    packaging: [],
    specs: [],
    photo: "flour-t400",
    example: true,
  },
  {
    slug: "psenicno-brasno-t-500",
    name: "Pšenično brašno",
    type: "T-500",
    category: "pšenično",
    summary: "Svestrano bijelo brašno za svakodnevno pečenje.",
    description:
      "Pouzdan oslonac kuhinje i pekare: dobro se ponaša u kruhu, pecivu i tjestenini, i podnosi različite načine rada s tijestom.",
    uses: ["Bijeli kruh", "Peciva", "Tjestenina", "Pizza"],
    packaging: [],
    specs: [],
    photo: "flour-t500",
    example: true,
  },
  {
    slug: "psenicno-brasno-t-850",
    name: "Pšenično brašno",
    type: "T-850",
    category: "pšenično",
    summary: "Polubijelo brašno punijeg okusa.",
    description:
      "Više dijelova zrna znači toplije boje i izraženiji okus — za kruh koji ima karakter, a i dalje lijepo raste.",
    uses: ["Polubijeli kruh", "Seoski kruh", "Kruh s kiselim tijestom"],
    packaging: [],
    specs: [],
    photo: "flour-t850",
    example: true,
  },
  {
    slug: "integralno-psenicno-brasno",
    name: "Integralno pšenično brašno",
    type: "Integralno",
    category: "integralno",
    summary: "Cijelo zrno, sa svim njegovim dijelovima.",
    description:
      "Mljeveno od cijelog zrna, s mekinjama i klicom. Gušće tijesto, bogatiji okus i struktura koja se osjeti u svakom zalogaju.",
    uses: ["Integralni kruh", "Peciva od cijelog zrna", "Domaće pečenje"],
    packaging: [],
    specs: [],
    photo: "flour-integralno",
    example: true,
  },
];

export const flourBySlug = (slug: string) => FLOURS.find((f) => f.slug === slug);
