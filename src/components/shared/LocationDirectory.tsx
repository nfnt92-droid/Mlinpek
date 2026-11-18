import { LOCATIONS, directionsUrl } from "@/content/locations";

/**
 * Bakery locations. With verified data: shops grouped by town (address, phone,
 * directions; shared opening hours stated once). Without: a designed preview that shows the structure, explicitly
 * labelled — no invented addresses, no map pins.
 */
export function LocationDirectory({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const line = dark ? "border-ivory/15" : "border-charcoal/15";
  const muted = dark ? "text-ivory/55" : "text-charcoal/55";

  if (!LOCATIONS.length) {
    return (
      <div>
        <p role="note" className={`label ${dark ? "text-wheat" : "text-wheat-deep"}`}>
          Popis pekara uskoro
        </p>
        <p className={`mt-4 max-w-[40ch] leading-relaxed ${dark ? "text-ivory/70" : "text-charcoal/70"}`}>
          Adrese i radno vrijeme naših pekara objavit ćemo čim budu potvrđeni. Ovako će izgledati svaka lokacija:
        </p>
        <div aria-hidden="true" className={`mt-8 border-t ${line}`}>
          {["Naziv pekare", "Naziv pekare", "Naziv pekare"].map((n, i) => (
            <div key={i} className={`grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-b py-6 ${line} ${i ? "opacity-40" : ""}`}>
              <span className={`label tabular ${dark ? "text-wheat" : "text-wheat-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block font-display text-2xl">{n}</span>
                <span className={`mt-1 block text-sm italic ${muted}`}>Ulica i broj · Grad</span>
              </span>
              <span className={`text-sm italic ${muted}`}>Radno vrijeme</span>
            </div>
          ))}
        </div>
        <p className={`mt-4 text-[11px] uppercase tracking-[0.18em] ${muted}`}>Primjer prikaza · nije stvarna lokacija</p>
      </div>
    );
  }

  // group by town, keeping the order of the data file
  const towns = [...new Set(LOCATIONS.map((l) => l.city))];
  const sameHours = LOCATIONS.every((l) => JSON.stringify(l.hours) === JSON.stringify(LOCATIONS[0].hours));
  return (
    <div>
      {sameHours && LOCATIONS[0].hours.length > 0 && (
        <p className={`text-sm ${muted}`}>
          <span className={`label mr-3 ${dark ? "text-wheat" : "text-wheat-deep"}`}>Radno vrijeme</span>
          {LOCATIONS[0].hours.map((h) => `${h.days} ${h.time}`).join(" · ")}
        </p>
      )}
      <div className="mt-10 space-y-12">
        {towns.map((town) => (
          <section key={town} aria-labelledby={`grad-${slug(town)}`}>
            <h3 id={`grad-${slug(town)}`} className={`label border-b pb-3 ${line} ${dark ? "text-wheat" : "text-wheat-deep"}`}>
              {town}
            </h3>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {LOCATIONS.filter((l) => l.city === town).map((l) => (
                <li key={l.id} className={`border-b py-6 ${line}`}>
                  <p className="font-display text-[1.75rem] leading-tight">{l.name}</p>
                  <address className={`mt-1 not-italic text-sm ${muted}`}>
                    {l.postcode ? `${l.postcode} ` : ""}
                    {l.city}
                  </address>
                  {!sameHours && l.hours.length > 0 && (
                    <p className={`mt-3 text-sm ${muted}`}>{l.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    {l.phone && (
                      <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="hit relative tabular underline decoration-wheat/50 underline-offset-4 hover:text-wheat-deep">
                        {l.phone}
                      </a>
                    )}
                    <a
                      href={directionsUrl(l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hit relative inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] hover:text-wheat-deep"
                    >
                      Upute <span aria-hidden="true">↗</span>
                      <span className="sr-only"> do poslovnice {l.name}, {l.city} (otvara Google Maps)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
