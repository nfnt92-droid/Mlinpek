"use client";

import { createContext, useContext, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FORM_BACKEND, submitForm } from "@/lib/submitForm";

/**
 * Online version of the client's "Obrazac za prijavu kandidata 2026. godine" — same sections,
 * same questions, same order. Submits via src/lib/submitForm (Cloudflare Pages Function or
 * Netlify Forms); without a configured backend it runs in DEMO mode and says so. The handwritten
 * signature of the paper form is replaced by the explicit consent checkbox + place and date.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SPREMA = ["NK", "KV", "SSS", "VŠS", "VSS", "Master / Magistar"];
const IZVORI = ["Portal za zapošljavanje", "Društvene mreže", "Preporuka", "Web stranica", "Ostalo"];

type Errors = Record<string, string>;

const field =
  "w-full border-0 border-b border-charcoal/25 bg-transparent px-0 py-3 text-charcoal placeholder:text-charcoal/35 focus:border-wheat-deep focus:outline-none focus:ring-0";
const labelCls = "label mb-1 block text-[11.5px] text-charcoal/60 sm:text-[11px]";
const errCls = "mt-2 text-[13px] text-[#9b3d12]";

/** shared by the field helpers below (defined at module level so inputs never remount) */
const Ctx = createContext<{ errors: Errors; id: (n: string) => string }>({ errors: {}, id: (n) => n });


const today = () => new Date().toISOString().slice(0, 10);

function Err({ n }: { n: string }) {
  const { errors, id } = useContext(Ctx);
  return errors[n] ? <p id={`${id(n)}-err`} className={errCls}>{errors[n]}</p> : null;
}
function useAria() {
  const { errors, id } = useContext(Ctx);
  return (n: string, required?: boolean) => ({
    "aria-invalid": Boolean(errors[n]) || undefined,
    "aria-describedby": errors[n] ? `${id(n)}-err` : undefined,
    "aria-required": required || undefined,
  });
}

function Text({
    n,
    label,
    required,
    type = "text",
    auto,
    span,
    hint,
    defaultValue,
    inputMode,
  }: {
    n: string;
    label: string;
    required?: boolean;
    type?: string;
    auto?: string;
    span?: boolean;
    hint?: string;
    defaultValue?: string;
    inputMode?: "numeric" | "tel" | "email" | "text";
  }) {
  const { id } = useContext(Ctx);
  const aria = useAria();
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label htmlFor={id(n)} className={labelCls}>
        {label}
        {!required && <span className="normal-case tracking-normal"> (neobavezno)</span>}
      </label>
      <input id={id(n)} name={n} type={type} autoComplete={auto} defaultValue={defaultValue} inputMode={inputMode} className={field} {...aria(n, required)} />
      {hint && <p className="mt-2 text-[13px] text-charcoal/50">{hint}</p>}
      <Err n={n} />
    </div>
  );
}

function Area({ n, label, required, rows = 3, hint }: { n: string; label: string; required?: boolean; rows?: number; hint?: string }) {
  const { id } = useContext(Ctx);
  const aria = useAria();
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id(n)} className={labelCls}>
        {label}
        {!required && <span className="normal-case tracking-normal"> (neobavezno)</span>}
      </label>
      {hint && <p className="mb-1 text-[13px] text-charcoal/50">{hint}</p>}
      <textarea id={id(n)} name={n} rows={rows} className={`${field} resize-y`} {...aria(n, required)} />
      <Err n={n} />
    </div>
  );
}

function Choice({
    n,
    legend,
    options,
    multiple,
    required,
    onPick,
    span = true,
  }: {
    n: string;
    legend: string;
    options: string[];
    multiple?: boolean;
    required?: boolean;
    onPick?: (value: string, checked: boolean) => void;
    span?: boolean;
  }) {
  const { id } = useContext(Ctx);
  const aria = useAria();
  return (
    <fieldset className={span ? "sm:col-span-2" : ""} {...aria(n, required)}>
      <legend className={labelCls}>
        {legend}
        {!required && <span className="normal-case tracking-normal"> (neobavezno)</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="relative cursor-pointer">
            <input
              type={multiple ? "checkbox" : "radio"}
              name={n}
              value={o}
              onChange={(e) => onPick?.(o, e.target.checked)}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="flex min-h-11 items-center border border-charcoal/20 px-4 text-sm text-charcoal/75 transition-colors peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wheat-deep hover:border-charcoal/50">
              {o}
            </span>
          </label>
        ))}
      </div>
      <Err n={n} />
    </fieldset>
  );
}

function Block({ no, title, note, children }: { no: string; title: string; note?: string; children: ReactNode }) {
  const { id } = useContext(Ctx);
  return (
    <section className="border-t border-charcoal/15 pt-10" aria-labelledby={id(`s${no}`)}>
      <h3 id={id(`s${no}`)} className="flex items-baseline gap-4 font-display text-[1.75rem] leading-tight">
        <span className="label tabular text-wheat-deep">{no.padStart(2, "0")}</span>
        {title}
      </h3>
      {note && <p className="mt-2 text-sm text-charcoal/55">{note}</p>}
      <div className="mt-8 grid gap-8 sm:grid-cols-2">{children}</div>
    </section>
  );
}


export function JobApplicationForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "demo" | "error">("idle");
  const [vozacka, setVozacka] = useState("");
  const [osudjivan, setOsudjivan] = useState("");
  const [izvorOstalo, setIzvorOstalo] = useState(false);
  const aria = (n: string, required?: boolean) => ({
    "aria-invalid": Boolean(errors[n]) || undefined,
    "aria-describedby": errors[n] ? `${uid}-${n}-err` : undefined,
    "aria-required": required || undefined,
  });


  function collect(form: HTMLFormElement) {
    const fd = new FormData(form);
    const data: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v !== "string") continue;
      data[k] = data[k] ? `${data[k]}, ${v}` : v; // checkbox groups → one readable field
    }
    return data;
  }

  function validate(d: Record<string, string>): Errors {
    const e: Errors = {};
    const req = (k: string, msg: string) => {
      if (!d[k]?.trim()) e[k] = msg;
    };
    req("radno_mjesto", "Upišite naziv radnog mjesta.");
    req("ime_prezime", "Upišite ime i prezime.");
    req("datum_rodjenja", "Upišite datum rođenja.");
    req("adresa", "Upišite adresu stanovanja.");
    req("grad", "Upišite grad ili općinu.");
    req("telefon", "Upišite broj telefona.");
    if (d.telefon && !/^[+()\d\s/-]{6,}$/.test(d.telefon)) e.telefon = "Broj telefona nije ispravan.";
    req("email", "Upišite e-mail adresu.");
    if (d.email && !EMAIL.test(d.email.trim())) e.email = "E-mail adresa nije ispravna.";
    req("vozacka_dozvola", "Označite imate li vozačku dozvolu.");
    req("strucna_sprema", "Označite stepen stručne spreme.");
    req("skola", "Upišite naziv završene škole ili fakulteta.");
    if (d.godina_zavrsetka && !/^(19|20)\d{2}$/.test(d.godina_zavrsetka.trim())) e.godina_zavrsetka = "Upišite godinu (npr. 2015).";
    req("pocetak", "Upišite kada najranije možete početi.");
    req("zasto", "Napišite ukratko zašto ste pravi kandidat.");
    req("smjene", "Označite možete li raditi u smjenama.");
    req("osudjivan", "Označite odgovor.");
    if (d.osudjivan === "Da") req("osudjivan_osnov", "Navedite po kojem osnovu.");
    req("mjesto", "Upišite mjesto.");
    if (d.saglasnost !== "Da") e.saglasnost = "Za slanje prijave potrebna je vaša izjava i saglasnost.";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const d = collect(form);
    if (d.bot_field) return;
    const er = validate(d);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (FORM_BACKEND === "demo") {
      setStatus("demo");
      return;
    }
    setStatus("sending");
    try {
      await submitForm("prijava-posao", d);
      setStatus("sent");
      formRef.current?.scrollIntoView({ block: "start" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t border-wheat-deep/50 pt-10">
        <p className="font-display text-4xl">Hvala na prijavi.</p>
        <p className="mt-4 max-w-[48ch] text-charcoal/70">
          Vaša prijava je zaprimljena. Kontaktirat ćemo vas ako vaš profil odgovara potrebama selekcije.
        </p>
      </div>
    );
  }

  const ctx = { errors, id: (n: string) => `${uid}-${n}` };

  return (
    <Ctx.Provider value={ctx}>
    <form ref={formRef} name="prijava-posao" noValidate onSubmit={onSubmit} className="space-y-14 scroll-mt-28">
      <p className="hidden" aria-hidden="true">
        <label>
          Ne popunjavajte: <input name="bot_field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <Text n="radno_mjesto" label="Naziv radnog mjesta" required />
        <Text n="datum_prijave" label="Datum prijave" type="date" required defaultValue={today()} />
      </div>

      <Block no="1" title="Lični podaci">
        <Text n="ime_prezime" label="Ime i prezime" required auto="name" />
        <Text n="datum_rodjenja" label="Datum rođenja" type="date" required auto="bday" />
        <Text n="adresa" label="Adresa stanovanja" required auto="street-address" />
        <Text n="grad" label="Grad / Općina" required auto="address-level2" />
        <Text n="telefon" label="Broj telefona" type="tel" required auto="tel" inputMode="tel" />
        <Text n="email" label="E-mail adresa" type="email" required auto="email" inputMode="email" />
        <Choice n="vozacka_dozvola" legend="Vozačka dozvola" options={["Ne", "Da"]} required span={false} onPick={(v) => setVozacka(v)} />
        {vozacka === "Da" ? <Text n="kategorija_vozacke" label="Kategorija vozačke dozvole" hint="Npr. B, C, CE" /> : <div className="hidden sm:block" />}
      </Block>

      <Block no="2" title="Obrazovanje i kvalifikacije">
        <Choice n="strucna_sprema" legend="Stepen stručne spreme" options={SPREMA} required />
        <Text n="skola" label="Naziv završene škole / fakulteta" required span />
        <Text n="zvanje" label="Zvanje / Smjer" />
        <Text n="godina_zavrsetka" label="Godina završetka" inputMode="numeric" />
      </Block>

      <Block no="3" title="Radno iskustvo" note="Posljednja dva poslodavca, počevši od najnovijeg. Ako nemate radnog iskustva, ostavite prazno.">
        {[1, 2].map((i) => (
          <div key={i} className="grid gap-8 sm:col-span-2 sm:grid-cols-2">
            <p className="label text-charcoal/45 sm:col-span-2">{i}. poslodavac</p>
            <Text n={`poslodavac${i}_naziv`} label="Poslodavac (naziv firme)" span />
            <Text n={`poslodavac${i}_pozicija`} label="Radno mjesto / pozicija" />
            <Text n={`poslodavac${i}_period`} label="Period (od – do)" hint="Npr. 03/2019 – 08/2024" />
            <Area n={`poslodavac${i}_zadaci`} label="Glavni radni zadaci i odgovornosti" />
          </div>
        ))}
      </Block>

      <Block no="4" title="Dodatne vještine i znanja">
        <Area n="strani_jezici" label="Poznavanje stranih jezika" hint="Navedite jezik i nivo – osnovni, srednji, napredni." rows={2} />
        <Area n="rad_na_racunaru" label="Rad na računaru" hint="Navedite programe koje poznajete, npr. MS Office, specijalizovani softveri." rows={2} />
        <Area n="kursevi" label="Dodatni kursevi, certifikati ili stručne obuke" rows={2} />
      </Block>

      <Block no="5" title="Dodatne informacije">
        <Text n="pocetak" label="Kada najranije možete početi s radom?" required />
        <Text n="ocekivana_plata" label="Očekivana neto plata (KM)" inputMode="numeric" />
        <Choice
          n="izvor"
          legend="Kako ste saznali za oglas?"
          options={IZVORI}
          multiple
          onPick={(v, checked) => v === "Ostalo" && setIzvorOstalo(checked)}
        />
        {izvorOstalo && <Text n="izvor_ostalo" label="Ostalo — gdje?" span />}
        <Text n="doprinos_pozicija" label="Na kojoj poziciji smatrate da biste mogli najviše doprinijeti kompaniji Mlinpek?" span />
        <Area n="zasto" label="Zašto smatrate da ste baš Vi pravi kandidat za ovu poziciju?" hint="Ukratko, u 2–3 rečenice." required rows={4} />
        <Choice n="smjene" legend="Da li možete raditi u smjenama?" options={["Da", "Ne"]} required span={false} />
        <Choice n="osudjivan" legend="Da li ste osuđivani po bilo kojem osnovu?" options={["Ne", "Da"]} required span={false} onPick={(v) => setOsudjivan(v)} />
        {osudjivan === "Da" && <Text n="osudjivan_osnov" label="Ako jeste, navedite po kojem osnovu" required span />}
      </Block>

      <Block no="6" title="Izjava o tačnosti podataka i saglasnost">
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer gap-4 text-charcoal/80">
            <input
              type="checkbox"
              name="saglasnost"
              value="Da"
              className="mt-1 h-5 w-5 shrink-0 accent-[#8a6a2c]"
              {...aria("saglasnost", true)}
            />
            <span className="leading-relaxed">
              Izjavljujem da su svi gore navedeni podaci tačni i potpuni. Saglasan/na sam da poslodavac navedene lične podatke obrađuje i
              čuva isključivo u svrhu procesa selekcije i zapošljavanja, u skladu sa važećim Zakonom o zaštiti ličnih podataka.
            </span>
          </label>
          <Err n="saglasnost" />
        </div>
        <Text n="mjesto" label="Mjesto" required auto="address-level2" />
        <div>
          <p className={labelCls}>Datum</p>
          <p className="border-b border-charcoal/10 py-3 text-charcoal/60">Datum prijave (gore)</p>
        </div>
      </Block>

      <div className="flex flex-col items-start gap-6 border-t border-charcoal/15 pt-10">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center gap-4 bg-charcoal px-8 py-4 text-[12px] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status === "sending" ? "Slanje…" : "Pošaljite prijavu"}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </button>
        <div aria-live="polite" className="text-sm">
          {Object.keys(errors).length > 0 && status !== "demo" && (
            <p className="text-[#9b3d12]">Provjerite označena polja ({Object.keys(errors).length}).</p>
          )}
          {status === "error" && <p className="text-[#9b3d12]">Slanje trenutno nije uspjelo. Pokušajte ponovno za nekoliko minuta.</p>}
          {status === "demo" && (
            <p role="status" className="max-w-[52ch] border border-wheat-deep/40 px-4 py-3 text-charcoal/80">
              <strong className="font-medium">Demo način — prijava nije poslana.</strong> Obrazac je ispravno popunjen, ali slanje se
              uključuje tek na objavljenoj stranici.
            </p>
          )}
        </div>
      </div>
    </form>
    </Ctx.Provider>
  );
}
