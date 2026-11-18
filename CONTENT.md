# Sadržaj, podaci tvrtke i integracije

Sav sadržaj koji ovisi o činjenicama o tvrtki nalazi se u `src/content/`. Ništa od toga nije izmišljeno: prazno polje se na stranici jednostavno ne prikazuje, a primjeri su vidljivo označeni.

| Datoteka | Što sadrži | Trenutno stanje |
|---|---|---|
| `site.ts` → `SITE` | naziv, pravni naziv, URL, kontakt, društvene mreže, pravni dokumenti | privremeni naziv **OD ZRNA DO KRUHA**; kontakt prazan (`null`) |
| `site.ts` → `MILL_FACTS`, `BAKERY_FACTS` | provjereni proizvodni podaci (kapacitet, oprema, godine rada) | prazno → blok se ne prikazuje |
| `site.ts` → `CERTIFICATIONS` | certifikati, laboratorijska ispitivanja, nagrade | prazno → blok se ne prikazuje |
| `site.ts` → `MILESTONES`, `EQUIPMENT` | povijest tvrtke, popis opreme | prazno → prikazan je označen okvir "u pripremi" |
| `flours.ts` | katalog brašna (T-400, T-500, T-850, integralno) | **primjeri** (`example: true`), označeni na stranici |
| `bakery.ts` | kategorije i proizvodi pekare | **primjeri** (`example: true`), označeni na stranici |
| `locations.ts` | pekare: adresa, radno vrijeme, koordinate | prazno → prikazan je označen primjer strukture, bez karte i bez izmišljenih adresa |
| `inquiries.ts` | vrste upita u kontakt obrascu | opći upit, proizvodi, pekare, veleprodaja brašna, distribucija, poslovna suradnja, zapošljavanje |
| `photos.ts` | sve fotografske pozicije s opisom kadra | vidi `PHOTOS.md` |

Kad unesete stvarne podatke za proizvod, maknite `example: true` — oznaka "Primjer" nestaje sama.

## Struktura stranice (pojednostavljena)

Pet stranica: **Naslovnica**, **O nama** (priča, mlin, proizvodnja, kvaliteta), **Proizvodi** (brašna + pekarski proizvodi), **Naše pekare**, **Kontakt** (opći i poslovni upiti u jednom obrascu).

Spojene stare adrese trajno se preusmjeravaju (301, `netlify.toml`), a na drugim hostovima preusmjeravaju ih male stranice na istim adresama:
`/nas-mlin/` → `/o-nama/#mlin` · `/pekarska-proizvodnja/` → `/o-nama/#proizvodnja` · `/brasna/` i `/brasna/*` → `/proizvodi/#brasno` · `/pekarski-proizvodi/` → `/proizvodi/#pekarski` · `/suradnja/` → `/kontakt/#upit` (parametri poput `?vrsta=brasno` se zadržavaju).

## Lokacije pekara

Upišite svaku pekaru u `locations.ts` (naziv, adresa, grad, radno vrijeme, po želji `lat`/`lng`). Popis na stranici "Naše pekare" i na naslovnici puni se automatski, a poveznica "Upute" otvara Google Maps za tu adresu. Interaktivna karta namjerno nije uključena dok adrese nisu potvrđene.

## schema.org i SEO

- Naslovi, opisi, Open Graph, `sitemap.xml` i `robots.txt` generiraju se za sve stranice. Za produkciju postavite `NEXT_PUBLIC_SITE_URL` (npr. u postavkama Netlify okruženja) da kanonski URL-ovi i sitemap pokazuju pravu domenu.
- `Organization` strukturirani podaci objavljuju se **tek** kad u `site.ts` postavite `verified: true` i upišete `legalName`. Recenzije, ocjene i lokacije nisu označene shemom.

## Obrasci (kontakt i prijava za posao)

- **Na Cloudflare Pages:** obrasci se šalju funkciji `functions/api/forma.ts`, koja ih prosljeđuje e-mailom (Resend). Postavke i varijable: vidi `CLOUDFLARE.md`.
- **Na Netlifyju:** obrasci idu u Netlify Forms (`public/__forms.html`).
- **Lokalno ili bez postavki:** obrazac radi u **demo načinu** i to jasno javlja — ništa se ne šalje i ništa se ne glumi.
- Zaštita od spama: skriveno polje (honeypot). Za veći promet uključite Cloudflare Turnstile.

## Pravni dokumenti

Pravila privatnosti i kolačića nisu napisana — dodajte stranice i upišite ih u `SITE.legal`; pojavit će se u podnožju. Stranica trenutno ne koristi kolačiće ni analitiku.
