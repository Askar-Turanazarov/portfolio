import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import "../street.css";
import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { site } from "@/content/site";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

type Params = Promise<{ lang: string }>;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

const ogLocale: Record<Locale, string> = { en: "en_US", ru: "ru_RU", uz: "uz_UZ" };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ru: "/ru", uz: "/uz", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
  };
}

/** Only the document shell and the theme provider; each design brings its own fonts and chrome. */
export default async function RootLayout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveLocale((await params).lang);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
