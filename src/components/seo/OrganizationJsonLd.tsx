import { SITE } from "@/content/site";

/**
 * schema.org Organization — emitted ONLY when SITE.verified is true and the
 * legal name is known. Nothing unverified is ever published as structured data.
 */
export function OrganizationJsonLd() {
  if (!SITE.verified || !SITE.legalName) return null;
  const c = SITE.contact;
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    ...(c.email ? { email: c.email } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.address ? { address: c.address } : {}),
    ...(SITE.social.length ? { sameAs: SITE.social.map((s) => s.href) } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
