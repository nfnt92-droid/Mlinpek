"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { flourBySlug } from "@/content/flours";
import { FORM_BACKEND, submitForm } from "@/lib/submitForm";

/**
 * Validated inquiry form.
 *
 * Delivery: src/lib/submitForm — on Cloudflare Pages the Pages Function functions/api/forma.ts
 * e-mails each inquiry; on Netlify it goes to Netlify Forms. Without a backend the form runs in
 * DEMO MODE and says so — nothing is faked.
 */


export interface InquiryType {
  value: string;
  label: string;
}

interface Props {
  /** Netlify form name; must match public/__forms.html */
  name: "b2b-upit" | "kontakt";
  types: InquiryType[];
  /** company name required (B2B) or optional (general contact) */
  companyRequired?: boolean;
  tone?: "dark" | "light";
  /** pick up ?vrsta= and ?proizvod= from the URL (links from the flour catalogue) */
  readQuery?: boolean;
  /** externally selected type (e.g. pathway buttons above the form) */
  selectedType?: string;
}

type Values = { tvrtka: string; ime: string; email: string; telefon: string; vrsta: string; poruka: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function InquiryForm({ name, types, companyRequired = true, tone = "dark", readQuery, selectedType }: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState<Values>({ tvrtka: "", ime: "", email: "", telefon: "", vrsta: "", poruka: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "demo" | "error">("idle");

  useEffect(() => {
    if (selectedType) setV((s) => ({ ...s, vrsta: selectedType }));
  }, [selectedType]);

  useEffect(() => {
    if (!readQuery) return;
    const q = new URLSearchParams(window.location.search);
    const vrsta = q.get("vrsta");
    const proizvod = q.get("proizvod");
    setV((s) => {
      const next = { ...s };
      if (vrsta && types.some((t) => t.value === vrsta)) next.vrsta = vrsta;
      const f = proizvod ? flourBySlug(proizvod) : undefined;
      if (f && !s.poruka) next.poruka = `Zanima nas: ${f.name} ${f.type}.\n\n`;
      else if (proizvod && !s.poruka) next.poruka = `Zanima me proizvod: ${proizvod.slice(0, 80)}.\n\n`;
      return next;
    });
  }, [readQuery, types]);

  const validate = (x: Values): Errors => {
    const e: Errors = {};
    if (companyRequired && !x.tvrtka.trim()) e.tvrtka = "Upišite naziv tvrtke.";
    if (!x.ime.trim()) e.ime = "Upišite ime i prezime.";
    if (!x.email.trim()) e.email = "Upišite e-mail adresu.";
    else if (!EMAIL.test(x.email.trim())) e.email = "E-mail adresa nije ispravna.";
    if (x.telefon && !/^[+()\d\s/-]{6,}$/.test(x.telefon)) e.telefon = "Broj telefona nije ispravan.";
    if (!x.vrsta) e.vrsta = "Odaberite vrstu upita.";
    if (x.poruka.trim().length < 10) e.poruka = "Napišite nekoliko riječi o svom upitu.";
    return e;
  };

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const nv = { ...v, [k]: e.target.value };
    setV(nv);
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validate(nv)[k] }));
  };
  const blur = (k: keyof Values) => () => {
    if (v[k]) setErrors((er) => ({ ...er, [k]: validate(v)[k] }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const er = validate(v);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (FORM_BACKEND === "demo") {
      setStatus("demo");
      return;
    }
    setStatus("sending");
    try {
      await submitForm(name, { ...v, "bot-field": "" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const dark = tone === "dark";
  const field = `w-full border-0 border-b bg-transparent px-0 py-3 focus:outline-none focus:ring-0 ${
    dark ? "border-ivory/25 text-ivory placeholder:text-ivory/35 focus:border-wheat" : "border-charcoal/25 text-charcoal placeholder:text-charcoal/35 focus:border-wheat-deep"
  }`;
  const label = `label mb-1 block text-[11.5px] sm:text-[11px] ${dark ? "text-ivory/55" : "text-charcoal/55"}`;
  const err = "mt-2 text-[13px] text-[#e7a477]";
  const errLight = "mt-2 text-[13px] text-[#9b3d12]";

  if (status === "sent") {
    return (
      <div role="status" className={`border-t pt-10 ${dark ? "border-wheat/50" : "border-wheat-deep/50"}`}>
        <p className="font-display text-4xl">Hvala na upitu.</p>
        <p className={`mt-4 ${dark ? "text-ivory/70" : "text-charcoal/70"}`}>Upit je zaprimljen. Javit ćemo vam se u najkraćem mogućem roku.</p>
      </div>
    );
  }

  const F = (k: keyof Values, lbl: string, opts: { type?: string; required?: boolean; auto?: string; span?: boolean } = {}) => {
    const id = `${uid}-${k}`;
    return (
      <div className={opts.span ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className={label}>
          {lbl}
          {!opts.required && <span className="normal-case tracking-normal"> (neobavezno)</span>}
        </label>
        <input
          id={id}
          name={k}
          type={opts.type ?? "text"}
          autoComplete={opts.auto}
          value={v[k]}
          onChange={set(k)}
          onBlur={blur(k)}
          aria-invalid={Boolean(errors[k])}
          aria-describedby={errors[k] ? `${id}-err` : undefined}
          aria-required={opts.required}
          className={field}
        />
        {errors[k] && (
          <p id={`${id}-err`} className={dark ? err : errLight}>
            {errors[k]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form ref={formRef} name={name} noValidate onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
      {companyRequired ? (
        <>
          {F("tvrtka", "Naziv tvrtke", { required: true, auto: "organization" })}
          {F("ime", "Kontakt osoba", { required: true, auto: "name" })}
        </>
      ) : (
        <>
          {F("ime", "Ime i prezime", { required: true, auto: "name" })}
          {F("tvrtka", "Tvrtka", { auto: "organization" })}
        </>
      )}
      {F("email", "E-mail", { type: "email", required: true, auto: "email" })}
      {F("telefon", "Telefon", { type: "tel", auto: "tel" })}

      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-vrsta`} className={label}>Vrsta upita</label>
        <select
          id={`${uid}-vrsta`}
          name="vrsta"
          value={v.vrsta}
          onChange={set("vrsta")}
          aria-invalid={Boolean(errors.vrsta)}
          aria-describedby={errors.vrsta ? `${uid}-vrsta-err` : undefined}
          aria-required
          className={`${field} appearance-none`}
        >
          <option value="" disabled className={dark ? "bg-steel" : "bg-paper"}>Odaberite…</option>
          {types.map((t) => (
            <option key={t.value} value={t.value} className={dark ? "bg-steel" : "bg-paper"}>{t.label}</option>
          ))}
        </select>
        {errors.vrsta && <p id={`${uid}-vrsta-err`} className={dark ? err : errLight}>{errors.vrsta}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-poruka`} className={label}>Poruka</label>
        <textarea
          id={`${uid}-poruka`}
          name="poruka"
          rows={5}
          value={v.poruka}
          onChange={set("poruka")}
          onBlur={blur("poruka")}
          aria-invalid={Boolean(errors.poruka)}
          aria-describedby={errors.poruka ? `${uid}-poruka-err` : undefined}
          aria-required
          className={`${field} resize-none`}
        />
        {errors.poruka && <p id={`${uid}-poruka-err`} className={dark ? err : errLight}>{errors.poruka}</p>}
      </div>

      <div className="flex flex-col items-start gap-6 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className={`group inline-flex items-center gap-4 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.24em] transition-colors disabled:opacity-60 ${
            dark ? "bg-wheat text-ink hover:bg-ivory" : "bg-charcoal text-ivory hover:bg-ink"
          }`}
        >
          {status === "sending" ? "Slanje…" : "Pošaljite upit"}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </button>
        <div aria-live="polite" className="text-sm">
          {status === "error" && (
            <p className={dark ? "text-[#e7a477]" : "text-[#9b3d12]"}>Slanje trenutno nije uspjelo. Pokušajte ponovno za nekoliko minuta.</p>
          )}
          {status === "demo" && (
            <p role="status" className={`max-w-[52ch] border px-4 py-3 ${dark ? "border-wheat/40 text-ivory/80" : "border-wheat-deep/40 text-charcoal/80"}`}>
              <strong className="font-medium">Demo način — upit nije poslan.</strong> Obrazac je ispravno popunjen, ali
              slanje još nije povezano. Uključuje se na produkcijskom poslužitelju (vidi CONTENT.md).
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
