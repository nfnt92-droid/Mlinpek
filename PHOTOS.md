# Fotografije — popis kadrova i zamjena

Sve pozicije trenutno prikazuju **privremene fotografije s Pexelsa** (popis autora i licenci: `PHOTO-CREDITS.md`), jasno označene na stranici. Ovaj dokument je popis kadrova koje tvrtka treba snimiti da ih zamijeni vlastitima.

## Kako zamijeniti

1. Spremi original u `photo-sources/` pod imenom pozicije, npr. `photo-sources/mill-hall.jpg` (JPG, PNG, WebP ili TIFF; najmanje 2560 px po dužoj strani za velike kadrove).
2. Za privremene (stock/licencirane) fotografije dodaj zapis u `photo-sources/credits.json`:
   ```json
   { "mill-hall": { "credit": "Foto: Ime Prezime / Unsplash", "temporary": true } }
   ```
   Takve fotografije na stranici dobivaju oznaku *Privremena fotografija · izvor*, pa se ne mogu zamijeniti za fotografije tvrtke.
3. Pokreni `npm run photos` → nastaju WebP verzije 640–2560 px u `public/photos/<id>/` i mutni pregled za učitavanje.
4. `npm run build`. Raspored se ne mijenja; fokus kadra (focal) podešava se u `src/content/photos.ts`.

Originali se ne spremaju u git (samo optimizirane verzije).

## Popis pozicija (39)

### Homepage / manifest

| Datoteka | Kadar |
|---|---|
| `manifest-grain.jpg` | Zrno pšenice na dlanu, bočno jutarnje svjetlo |
| `manifest-field.jpg` | Rub pšeničnog polja pred žetvu, nisko sunce |

### Mill

| Datoteka | Kadar |
|---|---|
| `mill-hall.jpg` | Hala mlina: niz valjčanih stolica, pogled duž hale |
| `mill-silos.jpg` | Silosi za žitarice, rano jutro, s ljudskom figurom za mjerilo |
| `mill-rollers.jpg` | Detalj: valjci u radu, zrno ulazi u mlin |
| `mill-sifting.jpg` | Prosijavanje: brašno na situ, makro |
| `mill-intake.jpg` | Prijem zrna: kamion na istovaru, zrno u prijemnom košu |
| `mill-cleaning.jpg` | Čišćenje zrna: separator ili aspirator u radu |
| `mill-lab.jpg` | Laboratorij mlina: uzorak brašna i mjerni uređaj |
| `mill-packing.jpg` | Pakiranje brašna: linija za vreće |
| `mill-worker.jpg` | Portret: mlinar uz upravljačku ploču |

### Flour products (packshots on ivory)

| Datoteka | Kadar |
|---|---|
| `flour-t400.jpg` | Packshot: vreća/pakiranje brašna T-400 na svijetloj podlozi |
| `flour-t500.jpg` | Packshot: pakiranje brašna T-500, brašno u zdjeli |
| `flour-t850.jpg` | Packshot: pakiranje brašna T-850, tamnija nijansa brašna |
| `flour-integralno.jpg` | Packshot: integralno brašno, vidljive mekinje |
| `flour-bulk.jpg` | Vreće brašna od 25 kg složene na paleti |

### Bakery production

| Datoteka | Kadar |
|---|---|
| `prod-hall.jpg` | Pekarska proizvodnja: linija za oblikovanje, šira hala |
| `prod-mixing.jpg` | Zamjes: tijesto u spiralnom mikseru |
| `prod-shaping.jpg` | Oblikovanje: ruke pekara nad tijestom |
| `prod-proofing.jpg` | Fermentacija: kolica s košaricama tijesta |
| `prod-oven.jpg` | Pečenje: kruh izlazi iz peći |
| `prod-cooling.jpg` | Hlađenje: police s kruhom, kontra svjetlo |
| `prod-dispatch.jpg` | Otprema: gajbe s pekarskim proizvodima spremne za dostavu |

### Bakery products

| Datoteka | Kadar |
|---|---|
| `bake-kruh.jpg` | Kruh: tri štruce na drvenoj dasci, toplo svjetlo |
| `bake-peciva.jpg` | Peciva: pladanj jutarnjih peciva, pogled odozgo |
| `bake-lisnata.jpg` | Lisnata tijesta: slojevi u presjeku, makro |
| `bake-slani.jpg` | Slani program: pite i slana peciva na pultu |
| `bake-slatki.jpg` | Slatki program: kolači i slatka peciva, mekano svjetlo |
| `bake-crumb.jpg` | Presjek kruha: sredina, makro |

### Retail bakeries

| Datoteka | Kadar |
|---|---|
| `store-interior.jpg` | Interijer pekare: pult s kruhom, jutarnja gužva |
| `store-exterior.jpg` | Izlog pekare u zoru, toplo svjetlo iznutra |
| `store-hands.jpg` | Prodavačica pakira kruh kupcu, detalj ruku |

### Quality

| Datoteka | Kadar |
|---|---|
| `quality-grain.jpg` | Makro: zrna pšenice, plitka dubinska oštrina |
| `quality-sample.jpg` | Uzorak brašna u laboratorijskoj posudi |
| `quality-crust.jpg` | Makro: korica kruha, tekstura |

### B2b

| Datoteka | Kadar |
|---|---|
| `b2b-warehouse.jpg` | Skladište: palete brašna, viličar u pokretu |
| `b2b-handshake.jpg` | Poslovni sastanak u proizvodnji, prirodno svjetlo (bez poziranja) |

### About

| Datoteka | Kadar |
|---|---|
| `about-people.jpg` | Grupni portret zaposlenika u pogonu |
| `about-detail.jpg` | Ruke pekara posute brašnom, detalj |

## Smjernice za snimanje

- Isto svjetlo kao u heroju: topli bočni izvor, tamna pozadina u industrijskim kadrovima, svijetla lanena podloga za packshotove.
- Proizvodi snimljeni na svijetloj podlozi s puno prostora oko predmeta (stranica ih reže na 4:5 i 3:4).
- Ljudi u radu, ne pozirani portreti; bez vidljivih tuđih logotipa.
- Industrijski kadrovi: ostaviti prazan prostor lijevo ili dolje lijevo za naslov.
