import type { CSSProperties } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";
import { modules } from "@/content/modules";
import { caseHref, periodLabel } from "@/lib/street/format";

/**
 * «Сборка»: ten modules × every product. The recipe line above the board is filled by
 * Interactions when a row is hovered; the board itself is a plain table, readable without JS.
 */
export function Assembly({ dict, locale, rows }: { dict: Dictionary; locale: Locale; rows: Project[] }) {
  const t = dict.street.index;
  const counts = Object.fromEntries(modules.map((m) => [m.id, rows.filter((p) => p.modules.includes(m.id)).length]));
  return (
    <section className="g index" id="index" aria-labelledby="h-index">
      <div className="in">
        <h2 id="h-index">{t.title}</h2>
        <p className="lede2">{t.lede}</p>
        <div className="recipe" id="recipe" aria-live="polite" data-all={t.all}>
          <span className="who">{t.all}</span>
          {modules.map((m) => (
            <span className="chip" key={m.id} data-mod={m.id} title={pick(m.long, locale)}>
              {pick(m.name, locale)}
            </span>
          ))}
        </div>
        <ol className="legend">
          {modules.map((m, i) => (
            <li key={m.id}>
              {i + 1} {pick(m.name, locale)}
            </li>
          ))}
        </ol>
        <table className="board" id="board">
          <thead>
            <tr>
              <th scope="col">{t.project}</th>
              <th scope="col">{t.when}</th>
              {modules.map((m) => (
                <th scope="col" className="mod" key={m.id} data-mod={m.id} title={pick(m.long, locale)}>
                  {pick(m.name, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.slug}
                id={`row-${p.slug}`}
                data-slug={p.slug}
                data-street-slug={p.slug}
                data-name={p.name}
                data-accent={p.accent}
                data-modules={p.modules.join(" ")}
                style={{ "--acc": p.accent } as CSSProperties}
              >
                <th scope="row">
                  <Link href={caseHref(locale, p.slug)}>{p.name}</Link>
                </th>
                <td className="m">{periodLabel(p.period, dict.street.months, locale)}</td>
                {modules.map((m, i) =>
                  p.modules.includes(m.id) ? (
                    <td className="c" key={m.id} data-mod={m.id} data-i={i + 1} title={`${p.name}: ${pick(m.long, locale)}`}>
                      <i />
                    </td>
                  ) : (
                    <td className="c" key={m.id}>
                      <i />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{t.total}</th>
              <td />
              {modules.map((m) => (
                <td key={m.id}>{counts[m.id]}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
