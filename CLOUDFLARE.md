# Objava na Cloudflare

Projekt radi i kao **Cloudflare Worker** (novi zadani način u Cloudflareu) i kao **Cloudflare Pages**.

## 1a. Worker (Workers & Pages → Create → Import a repository)

| Postavka | Vrijednost |
|---|---|
| Repozitorij / branch | Mlinpek / **`mlinpek-web`** |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Postavke Workera su u `wrangler.jsonc` (gotova stranica iz `out`, `/api/forma` ide u `worker/index.ts`). Ime Workera u Cloudflareu mora biti **mlinpek** (ili promijenite `"name"` u `wrangler.jsonc`). Varijable za obrasce (korak 2) idu pod **Settings → Variables and Secrets** Workera.

## 1b. Pages (alternativa)

Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → GitHub → repozitorij **Mlinpek**.

| Postavka | Vrijednost |
|---|---|
| Production branch | `mlinpek-web` |
| Framework preset | `None` (ili Next.js (Static HTML Export)) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(prazno)* |

Node verzija je zadana datotekom `.node-version` (22). Ništa drugo nije potrebno za build.

## 2. Obrasci (kontakt i prijava za posao)

Obrasci šalju podatke Cloudflare funkciji `functions/api/forma.ts`, koja ih prosljeđuje na e-mail preko servisa **Resend** (besplatno do 3.000 e-mailova mjesečno).

1. Napravite račun na resend.com, dodajte i potvrdite domenu (npr. `mlinpek.ba`) i napravite API ključ.
2. Cloudflare → Pages projekt → **Settings → Variables and Secrets** (Production) dodajte:

| Naziv | Primjer | Napomena |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | tip **Secret** |
| `FORM_FROM` | `Mlinpek web <web@mlinpek.ba>` | adresa na potvrđenoj domeni |
| `FORM_TO` | `mlinpek@bih.net.ba` | primatelj upita; više adresa odvojite zarezom |
| `FORM_TO_JOBS` | `druga.adresa@mlinpek.ba` | **druga** adresa za prijave za posao (kad bude poznata). Prva je ugrađena u kod: `rusmir.alibegovic@mlinpek.ba`. Dok `FORM_TO_JOBS` nije postavljen, druga adresa je `pravna.sluzba@mlinpek.ba`. |

3. **Retry deployment** (ili novi push) da se varijable primijene. Pošaljite probni upit i probnu prijavu.

Dok varijable nisu postavljene, obrazac javlja da slanje trenutno nije uspjelo — ništa se ne gubi tiho i ništa se ne glumi. Lokalno (`npm run dev`) obrasci rade u demo načinu.

Odgovor na e-mail upita ide izravno pošiljatelju (reply-to = e-mail iz obrasca).

## 3. Domena i adresa stranice

Pages projekt → **Custom domains** → dodajte domenu. Zatim u **Variables** dodajte `NEXT_PUBLIC_SITE_URL` = `https://www.vasa-domena.ba` i ponovno objavite — kanonski URL-ovi, sitemap i Open Graph tada pokazuju pravu domenu.

## Što je specifično za Cloudflare

- `public/_redirects` — trajna (301) preusmjeravanja starih adresa (`/nas-mlin/`, `/brasna/…`, `/suradnja/` …).
- `public/_headers` — dugo keširanje kadrova hero animacije, fotografija i Next statičkih datoteka.
- `functions/api/forma.ts` — slanje obrazaca.
- Build sam prepoznaje Cloudflare (`CF_PAGES`) i uključuje slanje obrazaca; `netlify.toml` ostaje za slučaj objave na Netlifyju i Cloudflare ga ignorira.
