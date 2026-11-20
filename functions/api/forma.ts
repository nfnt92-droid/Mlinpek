/**
 * Cloudflare Pages Function — POST /api/forma
 *
 * Receives the site's forms ("kontakt" inquiry, "prijava-posao" job application) as JSON
 * { form, data } and e-mails them through Resend (https://resend.com).
 *
 * Settings (Cloudflare → Pages project → Settings → Variables and Secrets):
 *   RESEND_API_KEY  (secret)  API key from Resend
 *   FORM_FROM                 verified sender, e.g. "Mlinpek web <web@mlinpek.ba>"
 *   FORM_TO                   recipient(s), comma separated, e.g. "mlinpek@bih.net.ba"
 *   FORM_TO_JOBS   (optional) the SECOND recipient(s) of job applications, comma separated. Until it
 *                             is set, the legal department's address from the client's documents is used
 *                             (JOBS_SECOND_DEFAULT). The first recipient is fixed: JOBS_ALWAYS.
 *
 * Without RESEND_API_KEY / FORM_TO it answers 503 and the form shows an honest error.
 */

interface Env {
  RESEND_API_KEY?: string;
  FORM_FROM?: string;
  FORM_TO?: string;
  FORM_TO_JOBS?: string;
}

const FORMS = new Set(["kontakt", "prijava-posao"]);
/** job applications always go to this address (client, 20. 11. 2026) … */
const JOBS_ALWAYS = ["rusmir.alibegovic@mlinpek.ba"];
/** … and to a second one: FORM_TO_JOBS once known, until then the legal department */
const JOBS_SECOND_DEFAULT = "pravna.sluzba@mlinpek.ba";
const list = (v?: string) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const MAX_BODY = 40_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LABELS: Record<string, string> = {
  vrsta: "Vrsta upita", ime: "Ime i prezime", tvrtka: "Tvrtka", email: "E-mail", telefon: "Telefon", poruka: "Poruka",
  radno_mjesto: "Radno mjesto", datum_prijave: "Datum prijave", ime_prezime: "Ime i prezime", datum_rodjenja: "Datum rođenja",
  adresa: "Adresa", grad: "Grad / Općina", vozacka_dozvola: "Vozačka dozvola", kategorija_vozacke: "Kategorija",
  strucna_sprema: "Stručna sprema", skola: "Škola / fakultet", zvanje: "Zvanje / smjer", godina_zavrsetka: "Godina završetka",
  poslodavac1_naziv: "1. poslodavac", poslodavac1_pozicija: "1. pozicija", poslodavac1_period: "1. period", poslodavac1_zadaci: "1. zadaci",
  poslodavac2_naziv: "2. poslodavac", poslodavac2_pozicija: "2. pozicija", poslodavac2_period: "2. period", poslodavac2_zadaci: "2. zadaci",
  strani_jezici: "Strani jezici", rad_na_racunaru: "Rad na računaru", kursevi: "Kursevi i certifikati", pocetak: "Početak rada",
  ocekivana_plata: "Očekivana neto plata (KM)", izvor: "Saznao/la za oglas", izvor_ostalo: "Ostalo", doprinos_pozicija: "Pozicija za doprinos",
  zasto: "Zašto je pravi kandidat", smjene: "Rad u smjenama", osudjivan: "Osuđivan/a", osudjivan_osnov: "Osnov", saglasnost: "Izjava i saglasnost",
  mjesto: "Mjesto",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false });

  let payload: { form?: unknown; data?: unknown };
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false });
  }
  const form = typeof payload.form === "string" ? payload.form : "";
  if (!FORMS.has(form) || !payload.data || typeof payload.data !== "object") return json(400, { ok: false });

  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload.data as Record<string, unknown>)) {
    if (typeof v === "string" && k.length < 40) data[k] = v.slice(0, 5000).trim();
  }
  // honeypots (both forms) — pretend success, send nothing
  if (data["bot-field"] || data.bot_field) return json(200, { ok: true });

  const isJob = form === "prijava-posao";
  const to = isJob
    ? [...new Set([...JOBS_ALWAYS, ...list(env.FORM_TO_JOBS || JOBS_SECOND_DEFAULT)].map((a) => a.toLowerCase()))]
    : list(env.FORM_TO);
  if (!env.RESEND_API_KEY || !env.FORM_FROM || to.length === 0) return json(503, { ok: false, error: "not_configured" });

  const who = data.ime_prezime || data.ime || "nepoznato";
  const subject = isJob
    ? `Prijava za posao: ${data.radno_mjesto || "—"} — ${who}`
    : `Upit s web stranice (${data.vrsta || "opći upit"}) — ${who}`;
  const lines = Object.entries(data)
    .filter(([k, v]) => v && k !== "bot-field" && k !== "bot_field")
    .map(([k, v]) => `${LABELS[k] ?? k}:\n${v}\n`);
  const text = `${subject}\n${"—".repeat(40)}\n\n${lines.join("\n")}\n—\nPoslano s web stranice Mlinpek.`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.FORM_FROM,
      to,
      subject: subject.slice(0, 200),
      text,
      ...(data.email && EMAIL.test(data.email) ? { reply_to: data.email } : {}),
    }),
  });
  if (!res.ok) return json(502, { ok: false, error: "send_failed" });
  return json(200, { ok: true });
}

export async function onRequest(): Promise<Response> {
  return json(405, { ok: false });
}
