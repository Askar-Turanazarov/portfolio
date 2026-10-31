import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { site } from "@/content/site";
import { streetFonts } from "@/components/street/fonts";
import { Masthead } from "@/components/street/Masthead";

type Params = Promise<{ lang: string }>;

const ogLocale: Record<Locale, string> = { en: "en_US", ru: "ru_RU", uz: "uz_UZ" };

function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

/** The browser chrome takes the colour of the street's sky, sampled from the posters. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#749ec9" },
    { media: "(prefers-color-scheme: dark)", color: "#343e7d" },
  ],
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  const image = `/${locale}/opengraph-image`;
  return {
    title: { absolute: dict.street.meta.title },
    description: dict.street.meta.description,
    // Nested openGraph and twitter objects replace the parent's whole, the file-based image included.
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.street.meta.title,
      description: dict.street.meta.description,
      url: `/${locale}`,
      locale: ogLocale[locale],
      images: [{ url: image, width: 1200, height: 630, alt: dict.street.hero.posterEvening }],
    },
    twitter: { card: "summary_large_image", title: dict.street.meta.title, description: dict.street.meta.description, images: [image] },
  };
}

export default async function StreetLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  return (
    <div className={`street ${streetFonts}`}>
      <Masthead dict={dict} locale={locale} />
      {children}
    </div>
  );
}
