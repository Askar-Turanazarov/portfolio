import type { NextConfig } from "next";

/**
 * Content Security Policy: everything the site loads comes from its own origin. Next.js puts small inline scripts
 * into prerendered HTML, so scripts keep 'unsafe-inline' (a nonce would make every page render per request).
 * Preview deployments also allow the Vercel toolbar. Dev mode gets no policy (it needs eval and a websocket).
 */
const preview = process.env.VERCEL_ENV === "preview";
const vercelLive = (...extra: string[]) => (preview ? ["https://vercel.live", ...extra] : []);
const csp = [
  ["default-src", "'self'"],
  ["script-src", "'self'", "'unsafe-inline'", ...vercelLive()],
  ["style-src", "'self'", "'unsafe-inline'", ...vercelLive()],
  ["img-src", "'self'", "data:", "blob:", ...vercelLive("https://vercel.com")],
  ["font-src", "'self'", "data:", ...vercelLive("https://assets.vercel.com")],
  ["connect-src", "'self'", ...vercelLive("wss://ws-us3.pusher.com")],
  ["media-src", "'self'"],
  ["worker-src", "'self'", "blob:"],
  ["frame-src", ...(preview ? ["https://vercel.live"] : ["'none'"])],
  ["manifest-src", "'self'"],
  ["object-src", "'none'"],
  ["base-uri", "'self'"],
  ["form-action", "'self'"],
  ["frame-ancestors", "'none'"],
  ["report-uri", "/api/csp-report"],
  ["report-to", "csp"],
]
  .map((d) => d.join(" "))
  .join("; ");

/**
 * The policy runs in report-only mode first: browsers block nothing and send what they would have blocked to
 * /api/csp-report (Vercel runtime logs). Once the logs stay clean, the header becomes Content-Security-Policy.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ...(process.env.NODE_ENV === "production"
    ? [
        { key: "Content-Security-Policy-Report-Only", value: csp },
        { key: "Reporting-Endpoints", value: 'csp="/api/csp-report"' },
      ]
    : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return ["first-clicker", "magic-8-ball"].map((slug) => ({
      source: `/:lang/projects/${slug}`,
      destination: "/:lang/projects/first-steps",
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
