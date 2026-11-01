import type { ReactNode } from "react";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { streetFonts } from "@/components/street/fonts";
import { Masthead } from "@/components/street/Masthead";

/** The street's chrome, with the section links pointing back at the home page. */
export default async function GrowthLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);
  return (
    <div className={`street ${streetFonts}`}>
      <Masthead dict={dict} locale={locale} anchorBase={`/${locale}`} langPath="/growth" />
      {children}
    </div>
  );
}
