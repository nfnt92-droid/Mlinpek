var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// functions/api/forma.ts
var FORMS = /* @__PURE__ */ new Set(["kontakt", "prijava-posao"]);
var MAX_BODY = 4e4;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var LABELS = {
  vrsta: "Vrsta upita",
  ime: "Ime i prezime",
  tvrtka: "Tvrtka",
  email: "E-mail",
  telefon: "Telefon",
  poruka: "Poruka",
  radno_mjesto: "Radno mjesto",
  datum_prijave: "Datum prijave",
  ime_prezime: "Ime i prezime",
  datum_rodjenja: "Datum ro\u0111enja",
  adresa: "Adresa",
  grad: "Grad / Op\u0107ina",
  vozacka_dozvola: "Voza\u010Dka dozvola",
  kategorija_vozacke: "Kategorija",
  strucna_sprema: "Stru\u010Dna sprema",
  skola: "\u0160kola / fakultet",
  zvanje: "Zvanje / smjer",
  godina_zavrsetka: "Godina zavr\u0161etka",
  poslodavac1_naziv: "1. poslodavac",
  poslodavac1_pozicija: "1. pozicija",
  poslodavac1_period: "1. period",
  poslodavac1_zadaci: "1. zadaci",
  poslodavac2_naziv: "2. poslodavac",
  poslodavac2_pozicija: "2. pozicija",
  poslodavac2_period: "2. period",
  poslodavac2_zadaci: "2. zadaci",
  strani_jezici: "Strani jezici",
  rad_na_racunaru: "Rad na ra\u010Dunaru",
  kursevi: "Kursevi i certifikati",
  pocetak: "Po\u010Detak rada",
  ocekivana_plata: "O\u010Dekivana neto plata (KM)",
  izvor: "Saznao/la za oglas",
  izvor_ostalo: "Ostalo",
  doprinos_pozicija: "Pozicija za doprinos",
  zasto: "Za\u0161to je pravi kandidat",
  smjene: "Rad u smjenama",
  osudjivan: "Osu\u0111ivan/a",
  osudjivan_osnov: "Osnov",
  saglasnost: "Izjava i saglasnost",
  mjesto: "Mjesto"
};
var json = /* @__PURE__ */ __name((status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8" } }), "json");
async function onRequestPost({ request, env }) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false });
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false });
  }
  const form = typeof payload.form === "string" ? payload.form : "";
  if (!FORMS.has(form) || !payload.data || typeof payload.data !== "object") return json(400, { ok: false });
  const data = {};
  for (const [k, v] of Object.entries(payload.data)) {
    if (typeof v === "string" && k.length < 40) data[k] = v.slice(0, 5e3).trim();
  }
  if (data["bot-field"] || data.bot_field) return json(200, { ok: true });
  const isJob = form === "prijava-posao";
  const to = (isJob && env.FORM_TO_JOBS ? env.FORM_TO_JOBS : env.FORM_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!env.RESEND_API_KEY || !env.FORM_FROM || to.length === 0) return json(503, { ok: false, error: "not_configured" });
  const who = data.ime_prezime || data.ime || "nepoznato";
  const subject = isJob ? `Prijava za posao: ${data.radno_mjesto || "\u2014"} \u2014 ${who}` : `Upit s web stranice (${data.vrsta || "op\u0107i upit"}) \u2014 ${who}`;
  const lines = Object.entries(data).filter(([k, v]) => v && k !== "bot-field" && k !== "bot_field").map(([k, v]) => `${LABELS[k] ?? k}:
${v}
`);
  const text = `${subject}
${"\u2014".repeat(40)}

${lines.join("\n")}
\u2014
Poslano s web stranice Mlinpek.`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.FORM_FROM,
      to,
      subject: subject.slice(0, 200),
      text,
      ...data.email && EMAIL.test(data.email) ? { reply_to: data.email } : {}
    })
  });
  if (!res.ok) return json(502, { ok: false, error: "send_failed" });
  return json(200, { ok: true });
}
__name(onRequestPost, "onRequestPost");

// worker/index.ts
var worker_default = {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/forma") {
      if (request.method !== "POST") return new Response(JSON.stringify({ ok: false }), { status: 405, headers: { "Content-Type": "application/json" } });
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  }
};

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-6szeGi/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../.npm/_npx/c943b712072b77c4/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-6szeGi/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
