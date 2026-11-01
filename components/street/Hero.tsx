import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import { projects } from "@/content/projects";
import { streetOrder } from "@/lib/street/order";
import { caseHref } from "@/lib/street/format";
import { site } from "@/content/site";
import { StreetStage } from "./StreetStage";

/** First screen: four text elements on the left, the street on the right. The name lives in the masthead. */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const h = dict.street.hero;
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const cards = streetOrder.flatMap((slug) => {
    const p = bySlug.get(slug);
    return p ? [{ slug, name: p.name, tagline: pick(p.tagline, locale), accent: p.accent, href: caseHref(locale, slug), live: p.links.live }] : [];
  });
  return (
    <section className="g hero" id="hero">
      <div className="text">
        <p className="place">{h.place}</p>
        <h1 className="say">{h.say}</h1>
        <p className="lede">{h.lede}</p>
        <ul className="links">
          <li>
            <a href="#flagships">{h.flagships}</a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          {site.email && (
            <li>
              <a href={`mailto:${site.email}`}>{dict.street.nav.write}</a>
            </li>
          )}
        </ul>
      </div>
      <StreetStage
        cards={cards}
        nav={h.nav}
        posterDay={h.posterDay}
        posterEvening={h.posterEvening}
        stageLabel={h.stage}
        caption={h.caption}
        captionScene={h.captionScene}
      />
    </section>
  );
}
