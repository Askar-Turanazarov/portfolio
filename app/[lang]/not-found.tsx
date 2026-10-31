import { lang } from "next/root-params";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { streetFonts } from "@/components/street/fonts";
import { Masthead } from "@/components/street/Masthead";

export default async function NotFound() {
  const value = await lang();
  const locale = value && hasLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div className={`street ${streetFonts}`}>
      <Masthead dict={dict} locale={locale} anchorBase={`/${locale}`} />
      <main className="g lost">
        <div className="in">
          <p className="code">404</p>
          <h1>{dict.notFound.title}</h1>
          <p className="lead">{dict.notFound.lead}</p>
          <a href={`/${locale}`}>{dict.notFound.back}</a>
        </div>
      </main>
    </div>
  );
}
