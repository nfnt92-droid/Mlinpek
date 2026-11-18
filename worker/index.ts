/**
 * Cloudflare Workers entry (Workers + static assets). The built site in ./out is served as
 * static assets (incl. public/_redirects and public/_headers); only /api/* reaches this code
 * (`run_worker_first` in wrangler.jsonc). The form handler is shared with the Pages Function.
 */
import { onRequestPost } from "../functions/api/forma";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  FORM_FROM?: string;
  FORM_TO?: string;
  FORM_TO_JOBS?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/forma") {
      if (request.method !== "POST") return new Response(JSON.stringify({ ok: false }), { status: 405, headers: { "Content-Type": "application/json" } });
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
