/**
 * Retail bakery locations. ONLY verified data belongs here.
 * While the list is empty the site shows a designed preview (no fake pins, no
 * invented addresses). A map is rendered only for locations with coordinates.
 */
export interface BakeryLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  postcode?: string;
  /** e.g. [{ days: "Pon – Sub", time: "06:00 – 20:00" }] */
  hours: { days: string; time: string }[];
  phone?: string;
  /** ID broj of the business unit (kept for reference, not displayed) */
  idNumber?: string;
  /** [lat, lng] — enables "Upute" link and map */
  coordinates?: [number, number];
}

/** Same hours in every shop (client's "Podaci o poslovnicama"). */
const HOURS = [{ days: "Pon – sub", time: "07:00 – 20:00" }, { days: "Nedjelja", time: "07:00 – 13:00" }];

/** Mlinpek shops — client's "Mlinpek – Podaci o poslovnicama" (sheet Prodavnice), grouped by town. */
export const LOCATIONS: BakeryLocation[] = [
  { id: "bugojno-sultan-ahmedova", name: "Sultan Ahmedova bb", address: "Sultan Ahmedova bb", city: "Bugojno", phone: "+387 63 330 431", idNumber: "4236113090098", hours: HOURS },
  { id: "bugojno-kulina-bana", name: "Kulina Bana 9", address: "Kulina Bana 9", city: "Bugojno", phone: "+387 61 130 688", idNumber: "4236113090128", hours: HOURS },
  { id: "donji-vakuf", name: "14 Septembar bb", address: "14 Septembar bb", city: "Donji Vakuf", phone: "+387 63 579 448", idNumber: "4236113090063", hours: HOURS },
  { id: "gornji-vakuf", name: "Branka Mikulića 4", address: "Branka Mikulića 4", city: "Gornji Vakuf", phone: "+387 61 130 084", idNumber: "4236113090136", hours: HOURS },
  { id: "travnik-bosanska-147", name: "Bosanska 147", address: "Bosanska 147", city: "Travnik", phone: "+387 63 581 030", idNumber: "4236113090071", hours: HOURS },
  { id: "travnik-bosanska-27", name: "Bosanska 27", address: "Bosanska 27", city: "Travnik", phone: "+387 63 330 387", idNumber: "4236113090080", hours: HOURS },
  { id: "novi-travnik-kralja-tvrtka", name: "Kralja Tvrtka 9", address: "Kralja Tvrtka 9", city: "Novi Travnik", phone: "+387 63 810 973", idNumber: "4236113090101", hours: HOURS },
  { id: "novi-travnik-hanumina", name: "Hanumina bb", address: "Hanumina bb", city: "Novi Travnik", phone: "+387 61 130 605", idNumber: "4236113090110", hours: HOURS },
];

export const directionsUrl = (l: BakeryLocation) =>
  l.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${l.coordinates[0]},${l.coordinates[1]}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${l.address}, ${l.city}`)}`;

/** "Bugojno, Donji Vakuf, … i Novi Travnik" */
export const townsSentence = () => {
  const t = [...new Set(LOCATIONS.map((l) => l.city))];
  return t.length > 1 ? `${t.slice(0, -1).join(", ")} i ${t.at(-1)}` : (t[0] ?? "");
};
