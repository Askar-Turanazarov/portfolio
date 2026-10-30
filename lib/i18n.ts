export const locales = ["en", "ru", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "Oʻzbekcha",
};

/** Short, localized string: every piece of content exists in all three languages. */
export type L10n = Record<Locale, string>;

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Picks the text for a locale, falling back to English. */
export function pick(text: L10n, locale: Locale): string {
  return text[locale] || text.en;
}
