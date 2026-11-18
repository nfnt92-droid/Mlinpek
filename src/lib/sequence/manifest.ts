import type { SequenceManifest, SequenceVariant, VariantKey } from "./types";

export const MANIFEST_URL = "/sequence/manifest.json";

/** Fetches and validates the manifest. Returns null when frames are not available. */
export async function loadManifest(signal?: AbortSignal): Promise<SequenceManifest | null> {
  try {
    const res = await fetch(MANIFEST_URL, { signal, cache: "no-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as SequenceManifest;
    if (data.status !== "ready") return null;
    VERSION = data.version ?? "";
    if (!isValidVariant(data.desktop)) {
      console.warn("[sequence] manifest.desktop is invalid — using development scene.");
      return null;
    }
    if (data.mobile && !isValidVariant(data.mobile)) {
      console.warn("[sequence] manifest.mobile is invalid — ignoring mobile variant.");
      data.mobile = undefined;
    }
    return data;
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("[sequence] manifest could not be loaded — using development scene.", err);
    }
    return null;
  }
}

function isValidVariant(v: SequenceVariant | undefined): v is SequenceVariant {
  return (
    !!v &&
    Number.isInteger(v.frameCount) &&
    v.frameCount > 1 &&
    typeof v.pattern === "string" &&
    v.pattern.includes("{index}") &&
    v.width > 0 &&
    v.height > 0
  );
}

/**
 * Chooses the lighter mobile variant on small/portrait screens, data-saver,
 * or slow connections. Desktop otherwise.
 */
export function pickVariant(manifest: SequenceManifest): { key: VariantKey; variant: SequenceVariant } {
  if (!manifest.mobile) return { key: "desktop", variant: manifest.desktop };

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const small = window.matchMedia("(max-width: 820px)").matches;
  const saveData = nav.connection?.saveData === true;
  const slow = /(^|-)2g$|3g/.test(nav.connection?.effectiveType ?? "");

  return small || saveData || slow
    ? { key: "mobile", variant: manifest.mobile }
    : { key: "desktop", variant: manifest.desktop };
}

let VERSION = "";

export function frameUrl(variant: SequenceVariant, index: number): string {
  const n = String(index + 1).padStart(variant.pad ?? 4, "0");
  const path = variant.pattern.replace("{index}", n);
  const url = path.startsWith("/") ? path : `/${path}`;
  return VERSION ? `${url}?v=${VERSION}` : url;
}
