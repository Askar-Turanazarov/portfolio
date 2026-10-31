import type { Metadata } from "next";
import { Golos_Text, Literata } from "next/font/google";
import type { ReactNode } from "react";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Masthead } from "@/components/street/Masthead";

/**
 * The street design on /[lang]: Literata for the voice (a reading serif with optical sizes,
 * made for long text on screens) and Golos Text for everything that is a label or a number.
 */
const literata = Literata({
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});
const golos = Golos_Text({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-golos", display: "swap" });

type Params = Promise<{ lang: string }>;

function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  return {
    title: { absolute: dict.street.meta.title },
    description: dict.street.meta.description,
    openGraph: { title: dict.street.meta.title, description: dict.street.meta.description },
    twitter: { title: dict.street.meta.title, description: dict.street.meta.description },
  };
}

export default async function StreetLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  return (
    <div className={`street ${literata.variable} ${golos.variable}`}>
      <Masthead dict={dict} locale={locale} />
      {children}
    </div>
  );
}
