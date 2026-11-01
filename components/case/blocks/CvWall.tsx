"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { pick, type L10n, type Locale } from "@/lib/i18n";
import { sheets } from "@/content/cases/cv-forge-sheets";

const start = sheets.findIndex((s) => s.id === "boarding-pass");
const full = (id: string) => `/projects/cv-forge/sheets/${id}.webp`;

const cats: Record<string, L10n> = {
  popular: { en: "Everyday", ru: "На каждый день", uz: "Har kunlik" },
  unusual: { en: "Bold", ru: "Смелые", uz: "Dadil" },
  concept: { en: "The CV as another object", ru: "Резюме как другой предмет", uz: "Rezyume boshqa buyum sifatida" },
};

const t = {
  heading: { en: "48 sheets", ru: "48 листов", uz: "48 varaq" },
  intro: {
    en: "One fictional candidate, the project's own sample data, in every template. Pick a sheet and move with the arrow keys.",
    ru: "Один вымышленный кандидат, образец из самого проекта, во всех шаблонах. Выберите лист, стрелки листают.",
    uz: "Bitta to‘qima nomzod, loyihaning o‘z namunasi, barcha shablonlarda. Varaqni tanlang, o‘qlar bilan varaqlang.",
  },
  group: { en: "Templates", ru: "Шаблоны", uz: "Shablonlar" },
  note: {
    en: "Top of the first A4 page, shot from the site's own print route, the one its PDF export renders.",
    ru: "Верх первой страницы A4, снято с печатного маршрута сайта, того же, что рендерит PDF.",
    uz: "Birinchi A4 sahifaning yuqori qismi, saytning PDF chizadigan o‘sha bosma yo‘nalishidan olingan.",
  },
} satisfies Record<string, L10n>;

/** Thumbnails are plain links to the full frames, so the wall works without JS. */
export default function CvWall({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(start);
  const current = sheets[active];

  const go = (i: number) => {
    const next = (i + sheets.length) % sheets.length;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !still) {
      document.startViewTransition(() => flushSync(() => setActive(next)));
    } else {
      setActive(next);
    }
  };

  const onPick = (e: MouseEvent, i: number) => {
    e.preventDefault();
    go(i);
  };

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="cv-wall">
          <ul
            className="cv-sheet"
            aria-label={pick(t.group, locale)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = active + (e.key === "ArrowRight" ? 1 : -1);
              go(i);
              const links = e.currentTarget.querySelectorAll("a");
              links[(i + links.length) % links.length]?.focus();
            }}
          >
            {sheets.map((s, i) => (
              <li key={s.id}>
                <a
                  href={full(s.id)}
                  aria-current={i === active ? "true" : undefined}
                  title={pick(s.name, locale)}
                  onClick={(e) => onPick(e, i)}
                >
                  <Image
                    src={`/projects/cv-forge/sheets/${s.id}-t.webp`}
                    alt={pick(s.name, locale)}
                    width={240}
                    height={339}
                    unoptimized
                    loading="lazy"
                    style={i === active ? { viewTransitionName: "cv-picked" } : undefined}
                  />
                </a>
              </li>
            ))}
          </ul>
          <figure className="cv-large">
            <Image
              key={current.id}
              src={full(current.id)}
              alt={pick(current.name, locale)}
              width={794}
              height={1123}
              unoptimized
              style={{ viewTransitionName: "cv-large" }}
            />
            <figcaption>
              {active + 1} / {sheets.length} · {pick(current.name, locale)} · {pick(cats[current.cat], locale)}
            </figcaption>
          </figure>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
