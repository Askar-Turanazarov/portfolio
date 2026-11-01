import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultLocale, hasLocale, locales, pick } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { projects } from "@/content/projects";
import { streetOrder } from "@/lib/street/order";
import { caseHref } from "@/lib/street/format";
import { GrowthStage } from "@/components/growth/GrowthStage";

type Params = Promise<{ lang: string }>;

/** The crown turns with the months: fresh green in July, deep in September, the first gold in October. */
const LEAF: Record<string, string> = { "2026-07": "#8fc04e", "2026-08": "#6fa63f", "2026-09": "#4f8a35", "2026-10": "#b8a038", "2026-11": "#d08f2c" };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : defaultLocale);
  return {
    title: dict.street.growth.title,
    description: dict.street.growth.lede,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/growth`])) },
  };
}

/** How the work grew: every limb of the tree is a project, in the order it was started. Without JS this is a plain list over a poster. */
export default async function GrowthPage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.street.growth;

  // new → old is the street's order, so reversing it keeps projects of one month in the order they were made
  const walk: string[] = [...streetOrder].reverse();
  const rows = projects
    .map((p) => ({ p, at: walk.indexOf(p.slug) }))
    .sort((a, b) => a.p.period.from.localeCompare(b.p.period.from) || a.at - b.at)
    .map(({ p }) => p);
  const months = [...new Set(rows.map((p) => p.period.from))];
  const branches = rows.map((p) => ({ slug: p.slug, name: p.name, href: caseHref(lang, p.slug), leaf: LEAF[p.period.from] ?? LEAF["2026-09"] }));

  return (
    <main className="growth">
      <GrowthStage branches={branches} alt={t.alt} />
      <div className="gr-text">
        <header className="gr-panel gr-first">
          <h1>{t.title}</h1>
          <p>{t.lede}</p>
          <p className="gr-hint">{t.hint}</p>
        </header>
        {months.map((m) => {
          const list = rows.filter((p) => p.period.from === m);
          const [year, month] = m.split("-");
          return (
            <section key={m} className="gr-panel" aria-labelledby={`m-${m}`}>
              <h2 id={`m-${m}`}>
                {dict.street.months[Number(month) - 1]} {year}
                <span>{list.length}</span>
              </h2>
              <ol>
                {list.map((p) => (
                  <li key={p.slug}>
                    <Link href={caseHref(lang, p.slug)}>{p.name}</Link>
                    <p>{pick(p.tagline, lang)}</p>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
        <footer className="gr-panel">
          <h2>{t.endTitle}</h2>
          <p>{t.end}</p>
          <p>
            <Link href={`/${lang}`}>{t.back}</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
