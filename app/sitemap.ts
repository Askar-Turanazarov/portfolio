import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/content/site";

/** One entry per locale with hreflang alternates. Case pages will be added here from the registry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`]));
  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: { ...languages, "x-default": `${site.url}/en` } },
  }));
}
