"use client";

import { useState } from "react";
import { pick, type Locale } from "@/lib/i18n";

/** reports/metrics/recall085_results.txt, full model, 408 907 test flights. */
const sweep = [
  { t: 0.2, recall: 0.967, precision: 0.22 },
  { t: 0.25, recall: 0.933, precision: 0.24 },
  { t: 0.3, recall: 0.891, precision: 0.265 },
  { t: 0.35, recall: 0.84, precision: 0.293 },
  { t: 0.37, recall: 0.818, precision: 0.306 },
  { t: 0.4, recall: 0.783, precision: 0.325 },
  { t: 0.45, recall: 0.723, precision: 0.359 },
  { t: 0.5, recall: 0.66, precision: 0.396 },
];
const chosen = 4;

const t = {
  heading: { en: "Move the threshold", ru: "Подвиньте порог", uz: "Chegarani suring" },
  caught: { en: "caught", ru: "поймано", uz: "aniqlandi" },
  right: { en: "right", ru: "верно", uz: "to‘g‘ri" },
  threshold: { en: "Decision threshold", ru: "Порог решения", uz: "Qaror chegarasi" },
  recall: { en: "Delays caught (recall)", ru: "Пойманные задержки (recall)", uz: "Aniqlangan kechikishlar (recall)" },
  precision: { en: "Correct alarms (precision)", ru: "Верные тревоги (precision)", uz: "To‘g‘ri signallar (precision)" },
  mine: { en: "my choice", ru: "мой выбор", uz: "mening tanlovim" },
  why: {
    en: "I fixed 0.37 because a missed delay costs an airline more than a false alarm. The default 0.50 catches only 66% of delays.",
    ru: "Я закрепил 0,37, потому что пропущенная задержка обходится авиакомпании дороже ложной тревоги. Стандартный порог 0,50 ловит только 66% задержек.",
    uz: "0,37 ni tanladim, chunki o‘tkazib yuborilgan kechikish aviakompaniyaga yolg‘on signaldan qimmatroq tushadi. Standart 0,50 kechikishlarning faqat 66% ini aniqlaydi.",
  },
};

const plain = (locale: Locale, recall: number, precision: number) =>
  ({
    en: `Of 100 real delays we catch ${recall}. Of 100 alarms, ${precision} are right.`,
    ru: `Из 100 реальных задержек поймаем ${recall}. Из 100 тревог верны ${precision}.`,
    uz: `100 ta haqiqiy kechikishdan ${recall} tasini aniqlaymiz. 100 ta signaldan ${precision} tasi to‘g‘ri.`,
  })[locale];

export default function FlightThreshold({ locale }: { locale: Locale }) {
  const [i, setI] = useState(chosen);
  const row = sweep[i];
  const num = (v: number, digits = 2) => v.toLocaleString(locale === "en" ? "en-US" : "ru-RU", { minimumFractionDigits: digits, maximumFractionDigits: digits });

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <div className="fd-panel">
          <div className="fd-control">
            <label htmlFor="fd-threshold">
              {pick(t.threshold, locale)}: <b>{num(row.t)}</b>
              {i === chosen && <span className="fd-mine"> {pick(t.mine, locale)}</span>}
            </label>
            <input
              id="fd-threshold"
              type="range"
              min={0}
              max={sweep.length - 1}
              step={1}
              value={i}
              aria-valuetext={num(row.t)}
              onChange={(e) => setI(Number(e.target.value))}
            />
            <p className="fd-plain" aria-live="polite">
              {plain(locale, Math.round(row.recall * 100), Math.round(row.precision * 100))}
            </p>
          </div>
          <div className="fd-bars" aria-hidden="true">
            <div className="fd-bar recall">
              <i style={{ transform: `scaleY(${row.recall})` }} />
              <b>{Math.round(row.recall * 100)} {pick(t.caught, locale)}</b>
            </div>
            <div className="fd-bar precision">
              <i style={{ transform: `scaleY(${row.precision})` }} />
              <b>{Math.round(row.precision * 100)} {pick(t.right, locale)}</b>
            </div>
          </div>
        </div>
        <div className="fd-scroll">
          <table className="fd-table">
            <thead>
              <tr>
                <th scope="col">{pick(t.threshold, locale)}</th>
                <th scope="col">{pick(t.recall, locale)}</th>
                <th scope="col">{pick(t.precision, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {sweep.map((s, n) => (
                <tr key={s.t} data-chosen={n === chosen} data-on={n === i}>
                  <th scope="row">
                    {num(s.t)}
                    {n === chosen && <span className="fd-mine"> {pick(t.mine, locale)}</span>}
                  </th>
                  <td>{num(s.recall, 3)}</td>
                  <td>{num(s.precision, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="block-note">{pick(t.why, locale)}</p>
      </div>
    </section>
  );
}
