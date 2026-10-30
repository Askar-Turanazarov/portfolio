/**
 * Site-wide facts.
 *
 * The public URL and every contact come from the environment, so the repository never
 * hard-codes them and the decision "what to publish" is made at deploy time. A missing
 * variable simply hides the corresponding contact card.
 */

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Own domain first, then the production domain Vercel injects at build time, then localhost. */
function resolveUrl(): string {
  const explicit = optional(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = optional(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Accepts "@name", "name" or a full t.me URL. */
function telegramUrl(value: string | undefined): string | undefined {
  const v = optional(value);
  if (!v) return undefined;
  if (/^https?:\/\//.test(v)) return v;
  return `https://t.me/${v.replace(/^@/, "")}`;
}

export const site = {
  name: "Askar Turanazarov",
  shortName: "Askar",
  monogram: "AT",
  /** Canonical origin for metadata, Open Graph, sitemap and robots. */
  url: resolveUrl(),
  github: "https://github.com/Askar-Turanazarov",
  githubHandle: "Askar-Turanazarov",
  email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  telegram: telegramUrl(process.env.NEXT_PUBLIC_CONTACT_TELEGRAM),
  linkedin: optional(process.env.NEXT_PUBLIC_CONTACT_LINKEDIN),
  cvUrl: optional(process.env.NEXT_PUBLIC_CV_URL),
  location: "Tashkent, Uzbekistan",
  /** Course period that produced the projects. */
  journey: { from: "2026-07", to: "2026-10" },
};
