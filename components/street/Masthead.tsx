import type { Dictionary } from "@/lib/dictionary";
import { locales, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { DesignSwitch } from "@/components/layout/DesignSwitch";
import { ThemeSwitch } from "./ThemeSwitch";

/** `anchorBase` points the section links at the home page from a page that does not have those sections; `langPath` keeps the current page when switching language. */
export function Masthead({ dict, locale, anchorBase = "", langPath = "" }: { dict: Dictionary; locale: Locale; anchorBase?: string; langPath?: string }) {
  const t = dict.street.nav;
  return (
    <header className="g mast">
      <div className="in">
        <a className="name" href={`/${locale}`}>
          {site.name}
        </a>
        <nav aria-label={t.sections}>
          <a className="hide-xs" href={`${anchorBase}#flagships`}>{t.flagships}</a>
          <a className="hide-xs" href={`${anchorBase}#index`}>{t.index}</a>
          <a className="hide-sm hide-md" href={`/${locale}/growth`}>{t.growth}</a>
          <a className="hide-sm hide-md" href={site.github} target="_blank" rel="noopener noreferrer">
            {t.github}
          </a>
          {site.email && (
            <a className="hide-sm hide-md" href={`mailto:${site.email}`}>
              {t.write}
            </a>
          )}
          <ul className="langs hide-sm" aria-label={t.languages}>
            {locales.map((l) => (
              <li key={l}>
                <a href={`/${l}${langPath}`} hrefLang={l} aria-current={l === locale ? "true" : undefined}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <ThemeSwitch toEvening={t.toEvening} toDay={t.toDay} toEveningLabel={t.toEveningLabel} toDayLabel={t.toDayLabel} />
          <DesignSwitch to="v2" href={`/${locale}/v2`} className="alt hide-sm">
            {dict.nav.v2}
          </DesignSwitch>
        </nav>
      </div>
    </header>
  );
}
