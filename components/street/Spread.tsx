import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";
import { fieldFor } from "@/lib/color";
import { caseHref, num, periodLabel } from "@/lib/street/format";

type Props = {
  dict: Dictionary;
  locale: Locale;
  project: Project;
  /** Position among the flagships (for the "01" numbering). */
  index: number;
  /** Figure number among spreads that have a screenshot; undefined when there is none. */
  figure?: number;
  side: "odd" | "even";
  hasCover: boolean;
};

const statusClass: Record<Project["status"], string> = { live: "live", "live-cold": "cold", code: "code", archived: "code" };

/**
 * One flagship on its own colour field. With a screenshot: figure on one side, text on the other,
 * sides alternating. Without one (code-only projects) the text stands alone; no placeholder plate.
 */
export function Spread({ dict, locale, project: p, index, figure, side, hasCover }: Props) {
  const t = dict.street.spread;
  const field = fieldFor(p.accent);
  const style = { "--field-light": field.light, "--field-dark": field.dark } as CSSProperties;
  const caption = p.caption ? pick(p.caption, locale) : `${p.name}: ${t.screen}.`;
  const live = p.links.live;
  const status = t.status[p.status];

  return (
    <section className={`g spread ${hasCover ? side : "solo"}`} id={`spread-${p.slug}`} style={style} aria-labelledby={`h-${p.slug}`}>
      {hasCover && (
        <figure>
          <Image
            src={`/projects/${p.slug}/cover.webp`}
            width={1440}
            height={900}
            alt={`${p.name}: ${t.screen}`}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 62vw"
            loading="lazy"
          />
          <figcaption>
            {t.figure} {figure}. {caption}
          </figcaption>
        </figure>
      )}
      <div className="txt">
        <h2 id={`h-${p.slug}`}>
          <small>{num(index)}</small>
          <Link href={caseHref(locale, p.slug)}>{p.name}</Link>
        </h2>
        <p className="m">{periodLabel(p.period, dict.street.months, locale)}</p>
        <p>
          <b>{t.problem}</b> {pick(p.problem, locale)}
        </p>
        <p>
          <b>{t.solution}</b> {pick(p.solution, locale)}
        </p>
        <p>
          <b>{t.forBusiness}</b> {pick(p.forBusiness, locale)}.
        </p>
        <p className="stack">{p.stack.join(", ")}.</p>
        <ul className="lk">
          <li>
            {live ? (
              <>
                <a href={live} target="_blank" rel="noopener noreferrer">
                  {t.open}
                </a>{" "}
                <span className={statusClass[p.status]}>{status}</span>
              </>
            ) : (
              <span className={statusClass[p.status]}>{status}</span>
            )}
          </li>
          <li>
            <a href={p.links.repo} target="_blank" rel="noopener noreferrer">
              {t.code}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
