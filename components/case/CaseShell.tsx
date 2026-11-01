import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type L10n, type Locale } from "@/lib/i18n";
import { onColor } from "@/lib/color";
import type { Project } from "@/lib/schema";
import type { CaseContent, CaseImage } from "@/content/cases/types";
import { CaseToc } from "./CaseToc";

const labels = {
  problem: { en: "The problem", ru: "Проблема", uz: "Muammo" },
  audience: { en: "Who it is for", ru: "Для кого", uz: "Kim uchun" },
  block: { en: "How it works", ru: "Как это работает", uz: "Qanday ishlaydi" },
  built: { en: "What I built", ru: "Что построено", uz: "Nima qurildi" },
  arch: { en: "How it is put together", ru: "Как это устроено", uz: "Qanday tuzilgan" },
  hard: { en: "The hard parts", ru: "Сложные места", uz: "Qiyin joylar" },
  stack: { en: "The stack, and why", ru: "Стек и почему", uz: "Stek va nima uchun" },
  metrics: { en: "Measured", ru: "Что измерено", uz: "O‘lchangan" },
  gallery: { en: "In use", ru: "В работе", uz: "Ishda" },
  back: { en: "Back to the street", ru: "Назад на улицу", uz: "Ko‘chaga qaytish" },
  next: { en: "Next project", ru: "Следующий проект", uz: "Keyingi loyiha" },
  prev: { en: "Previous project", ru: "Предыдущий проект", uz: "Oldingi loyiha" },
  contents: { en: "On this page", ru: "На этой странице", uz: "Shu sahifada" },
  featured: { en: "Flagship", ru: "Флагман", uz: "Flagman" },
  openSite: { en: "Open the {name} site", ru: "Открыть сайт {name}", uz: "{name} saytini ochish" },
  openCode: { en: "Open the code", ru: "Открыть код", uz: "Kodni ochish" },
} satisfies Record<string, L10n>;

const STACK_SHOWN = 6;

function Figure({ image, locale }: { image: CaseImage; locale: Locale }) {
  return (
    <figure className="frame">
      <Image src={image.src} alt={pick(image.alt, locale)} width={1440} height={900} sizes="(max-width: 1200px) 100vw, 1000px" />
      <figcaption>{pick(image.caption, locale)}</figcaption>
    </figure>
  );
}

type Neighbour = { slug: string; name: string; title: L10n; cover: CaseImage; accent: string };

function Door({ n, locale, label, rel }: { n: Neighbour; locale: Locale; label: string; rel: string }) {
  return (
    <Link className="cs-door" href={`/${locale}/projects/${n.slug}`} rel={rel}>
      <div className="cs-door-pic">
        <Image src={n.cover.src} alt="" fill sizes="(max-width: 560px) 100vw, 50vw" />
      </div>
      <small>{label}</small>
      <b>{n.name}</b>
      <span>{pick(n.title, locale)}</span>
    </Link>
  );
}

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
  const style = { "--ac": p.accent, "--ac-on": onColor(p.accent), "--glow": `url(/projects/${p.slug}/glow.webp)` } as CSSProperties;
  const target = p.links.live ?? p.links.repo;
  const host = new URL(target).host;
  const figures = c.metrics?.slice(0, 3) ?? [];
  const rest = c.metrics?.slice(3) ?? [];
  const toc = [
    { id: "problem", label: pick(labels.problem, locale) },
    children ? { id: "block", label: pick(labels.block, locale) } : null,
    c.built ? { id: "built", label: pick(labels.built, locale) } : null,
    c.gallery?.length ? { id: "gallery", label: pick(labels.gallery, locale) } : null,
    c.arch ? { id: "arch", label: pick(labels.arch, locale) } : null,
    c.hard ? { id: "hard", label: pick(labels.hard, locale) } : null,
    c.stack ? { id: "stack", label: pick(labels.stack, locale) } : null,
    rest.length ? { id: "measured", label: pick(labels.metrics, locale) } : null,
  ].filter((i) => i !== null);

  return (
    <main className="case" data-slug={p.slug} style={style}>
      <section className="g cs-hero">
        <div className="in">
          <div className="cs-lead">
            <p className="cs-kind">
              {pick(c.kind, locale)}
              {p.featured ? ` · ${pick(labels.featured, locale)}` : ""}
            </p>
            <h1>{p.name}</h1>
            <p className="cs-sum">{pick(c.title, locale)}</p>
            <a className="cs-go" href={target} target="_blank" rel="noopener noreferrer">
              {p.links.live ? pick(labels.openSite, locale).replace("{name}", p.name) : pick(labels.openCode, locale)} ↗
            </a>
            <p className="cs-where">
              <b>{host}</b> · {t.status[p.status]}
              {c.note && (
                <>
                  <br />
                  {pick(c.note, locale)}
                </>
              )}
            </p>
            <ul className="cs-links">
              {p.links.live && (
                <li>
                  <a href={p.links.repo} target="_blank" rel="noopener noreferrer">
                    {t.code} ↗
                  </a>
                </li>
              )}
              {c.links?.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {pick(l.label, locale)} ↗
                  </a>
                </li>
              ))}
            </ul>
            <ul className="cs-stack">
              {p.stack.slice(0, STACK_SHOWN).map((s) => (
                <li key={s}>{s}</li>
              ))}
              {p.stack.length > STACK_SHOWN && <li>+{p.stack.length - STACK_SHOWN}</li>}
            </ul>
          </div>
          <figure className="cs-shot">
            <a className="cs-browser" href={target} target="_blank" rel="noopener noreferrer">
              <div className="cs-chrome" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{host}</span>
              </div>
              <div className="cs-view">
                <Image src={c.cover.src} alt={pick(c.cover.alt, locale)} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
              </div>
            </a>
            <figcaption>{pick(c.cover.caption, locale)}</figcaption>
          </figure>
        </div>
      </section>

      {figures.length > 0 && (
        <section className="g cs-figures" aria-label={pick(labels.metrics, locale)}>
          <div className="in">
            <dl>
              {figures.map((m) => (
                <div key={m.label.en}>
                  <dt>{pick(m.label, locale)}</dt>
                  <dd>{m.value}</dd>
                  {m.note && <small>{pick(m.note, locale)}</small>}
                </div>
              ))}
            </dl>
            {c.metricsSource && rest.length === 0 && <p className="source">{pick(c.metricsSource, locale)}</p>}
          </div>
        </section>
      )}

      <div className="g cs-body">
        <div className="in">
          <CaseToc items={toc} label={pick(labels.contents, locale)} />
          <div className="cs-main">
            <section className="g case-sec case-intro" id="problem">
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

            {children && (
              <div id="block">
                <p className="cs-hook">{pick(c.hook, locale)}</p>
                {children}
              </div>
            )}

            {c.built && (
              <section className="g case-sec" id="built">
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
              <section className="g case-sec" id="gallery">
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
              <section className="g case-sec" id="arch">
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
              <section className="g case-sec" id="hard">
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
              <section className="g case-sec" id="stack">
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

            {rest.length > 0 && (
              <section className="g case-sec" id="measured">
                <div className="in">
                  <h2>{pick(labels.metrics, locale)}</h2>
                  <table className="measures">
                    <tbody>
                      {rest.map((m) => (
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
          </div>
        </div>
      </div>

      <nav className="g cs-near" aria-label={pick(labels.next, locale)}>
        <div className="in">
          <Door n={prev} locale={locale} label={pick(labels.prev, locale)} rel="prev" />
          <Door n={next} locale={locale} label={pick(labels.next, locale)} rel="next" />
          <p className="cs-home">
            <Link href={backHref}>{pick(labels.back, locale)}</Link>
          </p>
        </div>
      </nav>
    </main>
  );
}
