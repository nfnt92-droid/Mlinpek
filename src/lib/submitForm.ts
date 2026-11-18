/**
 * Where form submissions go. Chosen at build time (next.config.ts):
 *  - "cloudflare": POST JSON to the Pages Function /api/forma (functions/api/forma.ts), which e-mails it
 *  - "netlify":    POST to Netlify Forms (definitions in public/__forms.html)
 *  - "demo":       nothing is sent; the form says so plainly
 */
export type FormBackend = "cloudflare" | "netlify" | "demo";

const v = process.env.NEXT_PUBLIC_FORM_BACKEND;
export const FORM_BACKEND: FormBackend = v === "cloudflare" ? "cloudflare" : v === "netlify" ? "netlify" : "demo";

export async function submitForm(form: string, data: Record<string, string>): Promise<void> {
  let res: Response;
  if (FORM_BACKEND === "cloudflare") {
    res = await fetch("/api/forma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, data }),
    });
  } else if (FORM_BACKEND === "netlify") {
    res = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": form, ...data }).toString(),
    });
  } else {
    throw new Error("demo");
  }
  if (!res.ok) throw new Error(String(res.status));
}
