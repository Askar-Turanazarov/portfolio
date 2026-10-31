import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { StreetStage } from "./StreetStage";

/** First screen: four text elements on the left, the street on the right. The name lives in the masthead. */
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const h = dict.street.hero;
  const taglines = Object.fromEntries(projects.map((p) => [p.slug, pick(p.tagline, locale)]));
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
        taglines={taglines}
        posterDay={h.posterDay}
        posterEvening={h.posterEvening}
        stageLabel={h.stage}
        caption={h.caption}
        captionScene={h.captionScene}
      />
    </section>
  );
}
