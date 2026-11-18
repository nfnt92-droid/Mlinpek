import type { NextConfig } from "next";

/**
 * Static export → deploys to Cloudflare Pages, Netlify or any static host with no server runtime.
 * The frame sequence lives in /public/sequence and is served as plain files.
 * Forms: Cloudflare Pages (CF_PAGES) → Pages Function /api/forma; Netlify (NETLIFY) → Netlify Forms.
 */
const formBackend =
  process.env.NEXT_PUBLIC_FORM_BACKEND ?? (process.env.CF_PAGES ? "cloudflare" : process.env.NETLIFY ? "netlify" : "");
const nextConfig: NextConfig = {
  output: "export",
  env: { NEXT_PUBLIC_FORM_BACKEND: formBackend },
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  agentRules: false,
  // `npm run dev:lan` → open the site on a phone via the computer's local IP.
  // Next 16 blocks dev scripts from other origins unless they are listed here.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "172.17.*.*", "172.18.*.*", "172.19.*.*", "172.20.*.*", "*.local"],
};

export default nextConfig;
