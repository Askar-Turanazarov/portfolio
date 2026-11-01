"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** The sectors and coordinateMap objects from index.html. Names and terms are translated; the numbers aren't changed. */
const sectors = [
  { id: "Sol", x: 70, y: 80, rate: 1500, name: { en: "Solar System (Sol)", ru: "Солнечная Система (Sol)", uz: "Quyosh tizimi (Sol)" }, time: { en: "Instant", ru: "Мгновенно", uz: "Bir zumda" }, risk: { en: "Low (0.01%)", ru: "Низкий (0.01%)", uz: "Past (0.01%)" } },
  { id: "Centauri", x: 110, y: 50, rate: 3500, name: { en: "Alpha Centauri", ru: "Система Альфа Центавра", uz: "Alfa Sentavr tizimi" }, time: { en: "3 s", ru: "3 сек", uz: "3 son" }, risk: { en: "Minimal (0.05%)", ru: "Минимальный (0.05%)", uz: "Minimal (0.05%)" } },
  { id: "Orion", x: 190, y: 40, rate: 12000, name: { en: "Orion Arm", ru: "Рукав Ориона (Orion-Arm)", uz: "Orion yengi" }, time: { en: "15 s", ru: "15 сек", uz: "15 son" }, risk: { en: "Medium (0.4%)", ru: "Средний (0.4%)", uz: "O‘rtacha (0.4%)" } },
  { id: "Sagittarius", x: 240, y: 70, rate: 45000, name: { en: "Central Core (Sagittarius A*)", ru: "Центральное Ядро (Стрелец А*)", uz: "Markaziy yadro (Sagittarius A*)" }, time: { en: "3 min", ru: "3 мин", uz: "3 daq" }, risk: { en: "High (2.5%)", ru: "Высокий (2.5%)", uz: "Yuqori (2.5%)" } },
  { id: "Zeta", x: 260, y: 110, rate: 150000, name: { en: "Uncharted Sector Zeta-9", ru: "Неизведанный Сектор Зета-9", uz: "Noma’lum Zeta-9 sektori" }, time: { en: "12 min", ru: "12 мин", uz: "12 daq" }, risk: { en: "Extreme (8.7%)", ru: "Экстремальный (8.7%)", uz: "Ekstremal (8.7%)" } },
] satisfies { id: string; x: number; y: number; rate: number; name: L10n; time: L10n; risk: L10n }[];

const base = { x: 150, y: 120 };
/** A few fixed stars; the project's own map has four. */
const stars = [[30, 30], [80, 110], [210, 130], [290, 40], [18, 96], [132, 22], [172, 92], [272, 14]];

const t = {
  heading: { en: "The coordinate grid", ru: "Координатная сетка", uz: "Koordinata to‘ri" },
  intro: {
    en: "The store's “quantum bridge”. Pick a sector: the cost is its rate times the mass, here the calculator's default of 1.5 kg.",
    ru: "«Квантовый мост» магазина. Выберите сектор: стоимость это его ставка, умноженная на массу, здесь 1,5 кг по умолчанию, как в калькуляторе.",
    uz: "Do‘konning «kvant ko‘prigi». Sektorni tanlang: narx uning stavkasi massaga ko‘paytmasi, bu yerda kalkulyatordagidek standart 1,5 kg.",
  },
  sector: { en: "Sector", ru: "Сектор", uz: "Sektor" },
  time: { en: "Time", ru: "Время", uz: "Vaqt" },
  risk: { en: "Distortion risk", ru: "Риск искажения", uz: "Buzilish xavfi" },
  rate: { en: "Rate per kg, ¤", ru: "Ставка за кг, ¤", uz: "Kg uchun stavka, ¤" },
  cost: { en: "1.5 kg,", ru: "1,5 кг,", uz: "1,5 kg," },
  credits: { en: "galactic credits", ru: "галактических кредитов", uz: "galaktik kredit" },
  map: { en: "Map of five sectors around the SAFE-PRIMUS base", ru: "Карта пяти секторов вокруг базы SAFE-PRIMUS", uz: "SAFE-PRIMUS bazasi atrofidagi besh sektor xaritasi" },
  note: {
    en: "Rates, times and risks are copied from index.html, and the map uses its coordinates. All of it, the credits included, is invented for the shop.",
    ru: "Ставки, время и риск скопированы из index.html, а карта использует его координаты. Всё это, включая кредиты, придумано для магазина.",
    uz: "Stavkalar, vaqt va xavf index.html’dan ko‘chirilgan, xarita esa uning koordinatalaridan foydalanadi. Bularning hammasi, kreditlar ham, do‘kon uchun o‘ylab topilgan.",
  },
} satisfies Record<string, L10n>;

const fmt = (n: number) => n.toLocaleString("en-US").replace(/,/g, " ");

export default function SectorGrid({ locale }: { locale: Locale }) {
  const [id, setId] = useState("Sol");
  const [run, setRun] = useState(0);
  const now = sectors.find((s) => s.id === id) ?? sectors[0];

  const choose = (next: string) => {
    setId(next);
    setRun((r) => r + 1);
  };

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="gv-space">
          <svg viewBox="0 0 300 150" role="img" aria-label={pick(t.map, locale)}>
            {stars.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.8" fill="#fff" opacity="0.45" />
            ))}
            <path d="M 50,20 L 150,120 L 260,110 M 70,80 L 190,40 L 240,70 L 150,120" stroke="rgba(255,255,255,.1)" strokeWidth="1" fill="none" />
            <line x1={base.x} y1={base.y} x2={now.x} y2={now.y} stroke="#00f0ff" strokeWidth="1.2" />
            <circle cx={base.x} cy={base.y} r="5" fill="#00ff66" />
            <text x={base.x} y={base.y + 16} fill="#00ff66" fontSize="7" fontFamily="monospace" textAnchor="middle">
              SAFE-PRIMUS
            </text>
            {sectors.map((s) => (
              <g key={s.id} className="gv-node" onClick={() => choose(s.id)}>
                <circle cx={s.x} cy={s.y} r="12" fill="transparent" />
                <circle cx={s.x} cy={s.y} r="4" fill={s.id === id ? "#00f0ff" : "#64748b"} />
                <text x={s.x} y={s.y - 8} fill={s.id === id ? "#00f0ff" : "#94a3b8"} fontSize="7" fontFamily="monospace" textAnchor="middle">
                  {s.id}
                </text>
              </g>
            ))}
            {run > 0 && (
              <circle key={run} className="gv-dot" cx={base.x} cy={base.y} r="2.5" fill="#fff" style={{ "--dx": `${now.x - base.x}px`, "--dy": `${now.y - base.y}px` } as React.CSSProperties} />
            )}
          </svg>
          <p aria-live="polite">
            {pick(t.cost, locale)} {pick(now.name, locale)}: <b>{fmt(Math.round(now.rate * 1.5))} ¤</b> {pick(t.credits, locale)}
          </p>
        </div>
        <div className="gv-table" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">{pick(t.sector, locale)}</th>
                <th scope="col">{pick(t.time, locale)}</th>
                <th scope="col">{pick(t.risk, locale)}</th>
                <th scope="col">{pick(t.rate, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => (
                <tr key={s.id} data-now={s.id === id ? "" : undefined}>
                  <th scope="row">
                    <button type="button" aria-pressed={s.id === id} onClick={() => choose(s.id)}>
                      {pick(s.name, locale)}
                    </button>
                  </th>
                  <td>{pick(s.time, locale)}</td>
                  <td>{pick(s.risk, locale)}</td>
                  <td>{fmt(s.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
