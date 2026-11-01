"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Captured from POST /api/chat on skydental-rag.vercel.app, 1 November 2026. Values are not edited. */
const yes = {
  question: "Сколько стоит имплантация зуба?",
  gloss: { en: "How much is a dental implant?", ru: "", uz: "Tish implanti qancha turadi?" },
  search: "hybrid, 330 ms",
  chunks: [
    "[1] Прайс-лист · Имплантация одного зуба  vec .7641  fts .3  rrf .03552",
    "[2] Прайс-лист · Коронка на имплант       vec .7258  fts .1  rrf .03355",
    "[3] Услуги · Имплантация зубов            vec .7562  fts .9  rrf .03352",
  ],
  gate: "best 0.7641 ≥ threshold 0.63",
  model: "gemini-3.5-flash-lite ok, 1142 ms, 1479 → 129 tokens",
  kind: "kb",
  answer: "Имплантация одного зуба стоит от 6 500 000 сум… [1]",
};
const no = {
  question: "Какой курс доллара сегодня?",
  gloss: { en: "What is the dollar rate today?", ru: "", uz: "Bugun dollar kursi qancha?" },
  search: "hybrid, 253 ms",
  chunks: [
    "[–] Прайс-лист                 vec .6016  fts –   rrf .01739",
    "[–] FAQ                        vec .5857  fts –   rrf .01713",
    "[–] Прайс-лист · Как узнать…   vec .5790  fts –   rrf .01687",
  ],
  gate: "best 0.6016 < threshold 0.63",
  model: "gemini-3.5-flash-lite ok, 756 ms, 1067 → 64 tokens",
  kind: "offtopic",
  answer: "…курс валют не отслеживаю.",
};

const t = {
  heading: { en: "How I found the answer", ru: "Как я нашёл ответ", uz: "Javobni qanday topdim" },
  intro: {
    en: "Two real questions, sent to the live chat. Every answer in the product opens the same panel.",
    ru: "Два настоящих вопроса к живому чату. Такая же панель открывается у каждого ответа в продукте.",
    uz: "Jonli chatga berilgan ikkita haqiqiy savol. Mahsulotdagi har bir javobda xuddi shu panel ochiladi.",
  },
  inBase: { en: "In the base", ru: "Есть в базе", uz: "Bazada bor" },
  outside: { en: "Outside the base", ru: "Нет в базе", uz: "Bazada yo‘q" },
  stepQuestion: { en: "Question", ru: "Вопрос", uz: "Savol" },
  stepSearch: { en: "Vectors and text, top 20 each, merged by RRF", ru: "Векторы и текст, по 20 лучших, слияние RRF", uz: "Vektor va matn, 20 tadan eng yaxshisi, RRF birlashmasi" },
  stepChunks: { en: "Best fragments", ru: "Лучшие фрагменты", uz: "Eng yaxshi bo‘laklar" },
  stepGate: { en: "Threshold", ru: "Порог", uz: "Chegara" },
  stepModel: { en: "Model", ru: "Модель", uz: "Model" },
  stepAnswer: { en: "Answer", ru: "Ответ", uz: "Javob" },
  passed: { en: "Fragments go into the prompt.", ru: "Фрагменты идут в промпт.", uz: "Bo‘laklar promptga kiradi." },
  blocked: { en: "No fragment reaches the prompt, so there is no price to invent.", ru: "В промпт не попадает ни один фрагмент, значит, и цену выдумать не из чего.", uz: "Promptga birorta bo‘lak kirmaydi, demak, narx to‘qishga asos yo‘q." },
  captured: {
    en: "Captured from the live site on 1 November 2026. The production threshold is 0.63; the 0.6 in the README is the default.",
    ru: "Снято с живого сайта 1 ноября 2026. Порог на продакшене 0,63; значение 0,6 в README это значение по умолчанию.",
    uz: "2026-yil 1-noyabrda jonli saytdan olingan. Produksiyadagi chegara 0,63; README’dagi 0,6 standart qiymat.",
  },
} satisfies Record<string, L10n>;

const rows = ["question", "search", "chunks", "gate", "model", "answer"] as const;

/** Both traces are server-rendered; the script only dims the rows away from the reading line. */
export default function SkyTrace({ locale }: { locale: Locale }) {
  const [on, setOn] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 899px)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const label = (r: (typeof rows)[number]) =>
    pick({ question: t.stepQuestion, search: t.stepSearch, chunks: t.stepChunks, gate: t.stepGate, model: t.stepModel, answer: t.stepAnswer }[r], locale);

  const cell = (d: typeof yes, r: (typeof rows)[number], open: boolean) => {
    if (r === "question") {
      const gloss = pick(d.gloss, locale);
      return (
        <>
          <p className="sk-q">{d.question}</p>
          {locale !== "ru" && <p className="sk-gloss">{gloss}</p>}
        </>
      );
    }
    if (r === "chunks") {
      return (
        <pre>
          <code>{d.chunks.join("\n")}</code>
        </pre>
      );
    }
    if (r === "gate") {
      return (
        <>
          <code className={open ? "sk-pass" : "sk-stop"}>{d.gate}</code>
          <p>{pick(open ? t.passed : t.blocked, locale)}</p>
        </>
      );
    }
    if (r === "answer") {
      return (
        <>
          <code>kind: {d.kind}</code>
          <p className="sk-q">{d.answer}</p>
        </>
      );
    }
    return <code>{d[r]}</code>;
  };

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="sk-trace" data-tracking={on !== null}>
          <div className="sk-row sk-head" aria-hidden="true">
            <span />
            <b>{pick(t.inBase, locale)}</b>
            <b>{pick(t.outside, locale)}</b>
          </div>
          {rows.map((r, i) => (
            <div
              className="sk-row"
              key={r}
              data-i={i}
              data-on={on === i}
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              <h3>{label(r)}</h3>
              <div data-col={pick(t.inBase, locale)}>{cell(yes, r, true)}</div>
              <div data-col={pick(t.outside, locale)}>{cell(no, r, false)}</div>
            </div>
          ))}
        </div>
        <p className="block-note">{pick(t.captured, locale)}</p>
      </div>
    </section>
  );
}
