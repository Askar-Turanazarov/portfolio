import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/content/site";
import { caseOrder } from "@/content/cases";

/** One entry per locale for the home page, version 2 of the design, the growth page and every project page, each with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = (suffix: string, priority: (l: string) => number): MetadataRoute.Sitemap => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${suffix}`]));
    return locales.map((locale) => ({
      url: `${site.url}/${locale}${suffix}`,
      changeFrequency: "monthly",
      priority: priority(locale),
      alternates: { languages: { ...languages, "x-default": `${site.url}/en${suffix}` } },
    }));
  };
  return [...entries("", (l) => (l === "en" ? 1 : 0.9)), ...entries("/v2", () => 0.5), ...entries("/growth", () => 0.6), ...caseOrder.flatMap((slug) => entries(`/projects/${slug}`, () => 0.7))];
}
