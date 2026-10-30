import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./i18n";

const dictionaries = {
  en: () => import("@/content/i18n/en").then((m) => m.default),
  ru: () => import("@/content/i18n/ru").then((m) => m.default),
  uz: () => import("@/content/i18n/uz").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

/** Current locale from the `[lang]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!value || !hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const l = locale ?? (await getLocale());
  return dictionaries[l]();
}
