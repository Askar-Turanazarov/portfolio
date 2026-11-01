import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { defaultLocale, hasLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Version 2 of the site: the first design, kept whole under /[lang]/v2.
 * Its fonts and chrome live here so the home route can have its own.
 */
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains", display: "swap" });

type Params = Promise<{ lang: string }>;

function resolveLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  return {
    alternates: {
      canonical: `/${locale}/v2`,
      languages: { en: "/en/v2", ru: "/ru/v2", uz: "/uz/v2", "x-default": "/en/v2" },
    },
    // Nested openGraph objects replace the parent's whole, the file-based image included.
    openGraph: { url: `/${locale}/v2`, images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [`/${locale}/opengraph-image`] },
  };
}

export default async function V2Layout({ children, params }: { children: ReactNode; params: Params }) {
  const locale = resolveLocale((await params).lang);
  const dict = await getDictionary(locale);
  return (
    <div
      data-design="v2"
      className={`${inter.variable} ${manrope.variable} ${jetbrains.variable} flex min-h-dvh flex-col bg-bg font-sans text-fg`}
    >
      <Header dict={dict} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} />
    </div>
  );
}
