import type { InquiryType } from "@/components/shared/InquiryForm";

export const B2B_PATHWAYS: (InquiryType & { title: string; text: string })[] = [
  {
    value: "brasno",
    label: "Veleprodaja brašna",
    title: "Brašno za vašu proizvodnju",
    text: "Za pekare, proizvođače i prehrambenu industriju — brašna iz našeg mlina u pakiranjima za profesionalnu upotrebu.",
  },
  {
    value: "pekarski",
    label: "Distribucija pekarskih proizvoda",
    title: "Pekarski proizvodi za vaše kupce",
    text: "Za trgovine, hotele, restorane i distributere — kruh i peciva iz naše proizvodnje, prema dogovorenom rasporedu.",
  },
  {
    value: "suradnja",
    label: "Poslovna suradnja",
    title: "Drugi oblici suradnje",
    text: "Imate ideju za zajednički proizvod ili drugačiji oblik suradnje? Razgovarajmo o tome što vam treba.",
  },
];

export const CONTACT_TYPES: InquiryType[] = [
  { value: "opcenito", label: "Opći upit" },
  { value: "proizvodi", label: "Pitanje o proizvodima" },
  { value: "pekare", label: "Naše pekare" },
  { value: "posao", label: "Zapošljavanje" },
  { value: "suradnja", label: "Poslovna suradnja" },
];

/** The single contact form (B2B merged in): general first, then the business pathways. */
export const ALL_TYPES: InquiryType[] = [
  { value: "opcenito", label: "Opći upit" },
  { value: "proizvodi", label: "Pitanje o proizvodima" },
  { value: "pekare", label: "Naše pekare i narudžbe" },
  ...B2B_PATHWAYS.map(({ value, label }) => ({ value, label })),
  { value: "posao", label: "Zapošljavanje" },
];
