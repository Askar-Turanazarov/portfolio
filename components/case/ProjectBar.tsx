import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { locales, pick, type L10n, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { ThemeSwitch } from "@/components/street/ThemeSwitch";

const back: L10n = { en: "To the street", ru: "На улицу", uz: "Ko‘chaga" };

/** The bar of a project page: the way back first, then where this page stands among the others. */
export function ProjectBar({
  dict,
  locale,
  slug,
  at,
  total,
  prev,
  next,
}: {
  dict: Dictionary;
  locale: Locale;
  slug: string;
  at: number;
  total: number;
  prev: { slug: string; name: string };
  next: { slug: string; name: string };
}) {
  const t = dict.street.nav;
  return (
    <header className="g pbar">
      <div className="in">
        <Link className="pbar-back" href={`/${locale}`}>
          <span aria-hidden="true">←</span> {pick(back, locale)}
        </Link>
        <Link className="pbar-name" href={`/${locale}`}>
          {site.name}
          <small>{dict.common.portfolioSite}</small>
        </Link>
        <div className="pbar-side">
          <span className="pbar-at">
            {at} / {total}
          </span>
          <nav className="pbar-near" aria-label={t.sections}>
            <Link href={`/${locale}/projects/${prev.slug}`} rel="prev">
              ‹ {prev.name}
            </Link>
            <Link href={`/${locale}/projects/${next.slug}`} rel="next">
              {next.name} ›
            </Link>
          </nav>
          <ul className="langs" aria-label={t.languages}>
            {locales.map((l) => (
              <li key={l}>
                <a href={`/${l}/projects/${slug}`} hrefLang={l} aria-current={l === locale ? "true" : undefined}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <ThemeSwitch toEvening={t.toEvening} toDay={t.toDay} toEveningLabel={t.toEveningLabel} toDayLabel={t.toDayLabel} />
        </div>
      </div>
    </header>
  );
}
