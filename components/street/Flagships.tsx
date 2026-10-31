import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";
import { num, periodLabel } from "@/lib/street/format";

/** Table of contents for the six flagships: number, name, month, one line of essence. Hover names a building on the street. */
export function Flagships({ dict, locale, flagships }: { dict: Dictionary; locale: Locale; flagships: Project[] }) {
  const t = dict.street.flagships;
  return (
    <section className="g strip" id="flagships" aria-labelledby="h-flags">
      <ol className="in">
        <h2 id="h-flags">{t.title}</h2>
        {flagships.map((p, i) => (
          <li className="row" key={p.slug} data-street-slug={p.slug}>
            <span className="n">{num(i)}</span>
            <span className="t">
              <a href={`#spread-${p.slug}`}>{p.name}</a>
            </span>
            <span className="m">{periodLabel(p.period, dict.street.months, locale)}</span>
            <span className="e">{p.essence ? pick(p.essence, locale) : pick(p.tagline, locale)}</span>
            <button type="button" className="st" data-street-fly={p.slug}>
              {t.show}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
