import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type L10n, type Locale } from "@/lib/i18n";
import { fieldFor } from "@/lib/color";
import type { Project } from "@/lib/schema";
import type { CaseContent, CaseImage } from "@/content/cases/types";

const labels = {
  problem: { en: "The problem", ru: "Проблема", uz: "Muammo" },
  audience: { en: "Who it is for", ru: "Для кого", uz: "Kim uchun" },
  built: { en: "What I built", ru: "Что построено", uz: "Nima qurildi" },
  arch: { en: "How it is put together", ru: "Как это устроено", uz: "Qanday tuzilgan" },
  hard: { en: "The hard parts", ru: "Сложные места", uz: "Qiyin joylar" },
  stack: { en: "The stack, and why", ru: "Стек и почему", uz: "Stek va nima uchun" },
  metrics: { en: "Measured", ru: "Что измерено", uz: "O‘lchangan" },
  gallery: { en: "In use", ru: "В работе", uz: "Ishda" },
  back: { en: "Back to the street", ru: "Назад на улицу", uz: "Ko‘chaga qaytish" },
  next: { en: "Next", ru: "Дальше", uz: "Keyingisi" },
  prev: { en: "Previous", ru: "Назад", uz: "Oldingisi" },
} satisfies Record<string, L10n>;

const statusClass: Record<Project["status"], string> = { live: "live", "live-cold": "cold", code: "code", archived: "code" };

function Figure({ image, locale, priority }: { image: CaseImage; locale: Locale; priority?: boolean }) {
  return (
    <figure className="frame">
      <Image src={image.src} alt={pick(image.alt, locale)} width={1440} height={900} priority={priority} sizes="(max-width: 1200px) 100vw, 1200px" />
      <figcaption>{pick(image.caption, locale)}</figcaption>
    </figure>
  );
}

type Neighbour = { slug: string; name: string };

/** The frame shared by every project page. The project's own block goes in `children`. */
export function CaseShell({
  dict,
  locale,
  project: p,
  content: c,
  prev,
  next,
  backHref,
  children,
}: {
  dict: Dictionary;
  locale: Locale;
  project: Project;
  content: CaseContent;
  prev: Neighbour;
  next: Neighbour;
  backHref: string;
  children?: ReactNode;
}) {
  const t = dict.street.spread;
  const field = fieldFor(p.accent);
  const style = { "--ac": p.accent, "--field-light": field.light, "--field-dark": field.dark } as CSSProperties;

  return (
    <main className="case" data-slug={p.slug} style={style}>
      <header className="g case-head">
        <div className="in">
          <p className="case-name">{p.name}</p>
          <h1>{pick(c.title, locale)}</h1>
          <ul className="case-links">
            {p.links.live && (
              <li>
                <a href={p.links.live} target="_blank" rel="noopener noreferrer">
                  {t.open}
                </a>
              </li>
            )}
            <li>
              <a href={p.links.repo} target="_blank" rel="noopener noreferrer">
                {t.code}
              </a>
            </li>
            {c.links?.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {pick(l.label, locale)}
                </a>
              </li>
            ))}
            <li className={statusClass[p.status]}>{t.status[p.status]}</li>
          </ul>
          {c.note && <p className="case-note">{pick(c.note, locale)}</p>}
        </div>
      </header>

      {c.cover && (
        <div className="g">
          <div className="in">
            <Figure image={c.cover} locale={locale} priority />
          </div>
        </div>
      )}

      <section className="g case-sec case-intro">
        <div className="in cols">
          <div>
            <h2>{pick(labels.problem, locale)}</h2>
            <p>{pick(c.problem, locale)}</p>
          </div>
          {c.audience && (
            <div>
              <h2>{pick(labels.audience, locale)}</h2>
              <p>{pick(c.audience, locale)}</p>
            </div>
          )}
        </div>
      </section>

      {children}

      {c.built && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.built, locale)}</h2>
            <dl className="ledger">
              {c.built.map((b) => (
                <div key={b.name.en}>
                  <dt>{pick(b.name, locale)}</dt>
                  <dd>{pick(b.text, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {c.gallery && c.gallery.length > 0 && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.gallery, locale)}</h2>
            <div className="gallery">
              {c.gallery.map((g) => (
                <Figure key={g.src} image={g} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {c.arch && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.arch, locale)}</h2>
            <ol className="layers" aria-label={pick(c.arch.alt, locale)}>
              {c.arch.layers.map((l) => (
                <li key={l.label.en}>
                  <span className="layer-name">{pick(l.label, locale)}</span>
                  <ul>
                    {l.nodes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {c.hard && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.hard, locale)}</h2>
            <div className="hard">
              {c.hard.map((h) => (
                <article key={h.title.en}>
                  <h3>{pick(h.title, locale)}</h3>
                  <p>{pick(h.text, locale)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.stack && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.stack, locale)}</h2>
            <dl className="ledger narrow">
              {c.stack.map((s) => (
                <div key={s.tech}>
                  <dt>{s.tech}</dt>
                  <dd>{pick(s.why, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {c.metrics && (
        <section className="g case-sec">
          <div className="in">
            <h2>{pick(labels.metrics, locale)}</h2>
            <table className="measures">
              <tbody>
                {c.metrics.map((m) => (
                  <tr key={m.label.en}>
                    <th scope="row">{pick(m.label, locale)}</th>
                    <td className="val">{m.value}</td>
                    <td>{m.note ? pick(m.note, locale) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {c.metricsSource && <p className="source">{pick(c.metricsSource, locale)}</p>}
          </div>
        </section>
      )}

      <nav className="g case-doors" aria-label={pick(labels.next, locale)}>
        <div className="in">
          <a href={`/${locale}/projects/${prev.slug}`} rel="prev">
            <span>{pick(labels.prev, locale)}</span> {prev.name}
          </a>
          <a href={backHref}>{pick(labels.back, locale)}</a>
          <a href={`/${locale}/projects/${next.slug}`} rel="next">
            <span>{pick(labels.next, locale)}</span> {next.name}
          </a>
        </div>
      </nav>
    </main>
  );
}
