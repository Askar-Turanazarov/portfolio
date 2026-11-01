"use client";

import Image from "next/image";
import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Frames shot from /demo/<key>/en on the live site, in the order of the project's template registry. */
const templates = [
  { key: "corporate", name: "Orient Consult", kind: { en: "Corporate", ru: "Корпоративный", uz: "Korporativ" } },
  { key: "agency", name: "Tartib", kind: { en: "Agency", ru: "Агентство", uz: "Agentlik" } },
  { key: "shop", name: "Anor", kind: { en: "Store", ru: "Магазин", uz: "Do‘kon" } },
  { key: "cafe", name: "Zerno", kind: { en: "Cafe", ru: "Кафе", uz: "Kafe" } },
  { key: "blog", name: "On Foot in Tashkent", kind: { en: "Blog", ru: "Блог", uz: "Blog" } },
  { key: "clinic", name: "Sog'lom Oila", kind: { en: "Clinic", ru: "Клиника", uz: "Klinika" } },
  { key: "education", name: "Kod Maktabi", kind: { en: "Courses", ru: "Курсы", uz: "Kurslar" } },
  { key: "construction", name: "Bunyod Remont", kind: { en: "Renovation", ru: "Ремонт", uz: "Ta’mirlash" } },
  { key: "law", name: "Adolat Partners", kind: { en: "Law", ru: "Юристы", uz: "Huquq" } },
  { key: "beauty", name: "Nafis", kind: { en: "Beauty", ru: "Салон", uz: "Salon" } },
  { key: "fitness", name: "Temir", kind: { en: "Fitness", ru: "Фитнес", uz: "Fitnes" } },
  { key: "travel", name: "Yo'l Bor", kind: { en: "Travel", ru: "Туры", uz: "Sayohat" } },
] satisfies { key: string; name: string; kind: L10n }[];

const src = (key: string) => `/projects/sitego/tpl-${key}.webp`;

const t = {
  heading: { en: "Twelve from one set of blocks", ru: "Двенадцать из одного набора блоков", uz: "Bitta bloklar to‘plamidan o‘n ikkita" },
  intro: {
    en: "Fourteen block types, twelve palettes, twelve visual styles. Each template has its own invented business and content. The frames are the live demos, each at the top of its first page.",
    ru: "Четырнадцать типов блоков, двенадцать палитр, двенадцать стилей. У каждого шаблона свой вымышленный бизнес и своё содержание. Кадры это живые демо, верх первой страницы.",
    uz: "O‘n to‘rt blok turi, o‘n ikki palitra, o‘n ikki uslub. Har bir shablonning o‘z to‘qima biznesi va mazmuni bor. Kadrlar jonli demolar, birinchi sahifaning yuqori qismi.",
  },
  group: { en: "Templates", ru: "Шаблоны", uz: "Shablonlar" },
  frame: { en: "Template", ru: "Шаблон", uz: "Shablon" },
  codeNote: {
    en: "From src/blocks/classes.ts: the React component and the HTML generator import the same class strings.",
    ru: "Из src/blocks/classes.ts: React-компонент и HTML-генератор импортируют одни и те же строки классов.",
    uz: "src/blocks/classes.ts’dan: React komponenti va HTML generatori bir xil klass satrlarini import qiladi.",
  },
} satisfies Record<string, L10n>;

/** Without JS the noscript sheet lists all twelve frames. */
export default function SiteTwelve({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const [warm, setWarm] = useState<number[]>([0, 1]);
  const current = templates[active];

  const heat = (i: number) => {
    const next = (i + 1) % templates.length;
    setWarm((w) => [...new Set([...w, i, next])]);
  };

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="sg-pick" role="group" aria-label={pick(t.group, locale)}>
          {templates.map((x, i) => (
            <button
              type="button"
              key={x.key}
              aria-pressed={active === i}
              onPointerEnter={() => heat(i)}
              onFocus={() => heat(i)}
              onClick={() => {
                heat(i);
                setActive(i);
              }}
            >
              {pick(x.kind, locale)}
            </button>
          ))}
        </div>
        <figure className="sg-frame">
          <div className="sg-stage">
            {templates.map((x, i) =>
              warm.includes(i) ? (
                <Image
                  key={x.key}
                  src={src(x.key)}
                  alt={active === i ? `${pick(t.frame, locale)}: ${x.name}` : ""}
                  width={1280}
                  height={800}
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  data-on={active === i}
                  priority={i === 0}
                />
              ) : null,
            )}
          </div>
          <figcaption>
            {current.name} · {pick(current.kind, locale)}
          </figcaption>
        </figure>
        <noscript>
          <ul className="sg-sheet">
            {templates.map((x) => (
              <li key={x.key}>
                <Image src={src(x.key)} alt={x.name} width={320} height={200} />
              </li>
            ))}
          </ul>
        </noscript>
        <pre className="sg-code">
          <code>{`export const CX = {
  section: "sb-section py-16 md:py-24",
  container: "sb-container mx-auto max-w-6xl px-6",
  ...
}`}</code>
        </pre>
        <p className="block-note">{pick(t.codeNote, locale)}</p>
      </div>
    </section>
  );
}
