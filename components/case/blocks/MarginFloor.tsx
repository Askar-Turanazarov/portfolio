"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Desks, zones and people from prisma/seed.ts. The arrival minutes are mine, for this demo: the seed has none. */
const columns = [500, 640, 780, 920, 1060];
const deskRows = [130, 290, 510, 670];
const zones: { name: L10n; y: number; h: number }[] = [
  { name: { en: "Meeting room", ru: "Переговорная", uz: "Majlis xonasi" }, y: 20, h: 280 },
  { name: { en: "Lounge", ru: "Лаунж", uz: "Dam olish" }, y: 300, h: 220 },
  { name: { en: "Kitchen", ru: "Кухня", uz: "Oshxona" }, y: 520, h: 260 },
];
const people: { desk: string; name: string; job: string; at: number }[] = [
  { desk: "01", name: "Olivia Bennett", job: "Office Manager", at: 8 * 60 + 41 },
  { desk: "02", name: "Daniel Brooks", job: "Account Manager", at: 8 * 60 + 48 },
  { desk: "03", name: "Sofia Ramirez", job: "Project Manager", at: 8 * 60 + 52 },
  { desk: "06", name: "Alex Carter", job: "Frontend Developer", at: 8 * 60 + 55 },
  { desk: "07", name: "Mia Lopez", job: "UI/UX Designer", at: 8 * 60 + 57 },
  { desk: "08", name: "Ethan Park", job: "Backend Developer", at: 8 * 60 + 58 },
  { desk: "09", name: "Chloe Nguyen", job: "Graphic Designer", at: 9 * 60 + 1 },
  { desk: "11", name: "Ryan Mitchell", job: "Full-stack Developer", at: 9 * 60 + 3 },
  { desk: "12", name: "Ava Thompson", job: "QA Engineer", at: 9 * 60 + 4 },
  { desk: "13", name: "Noah Kim", job: "DevOps Engineer", at: 9 * 60 + 5 },
  { desk: "16", name: "Emma Wilson", job: "Content Manager", at: 9 * 60 + 9 },
  { desk: "17", name: "Liam Patel", job: "Mobile Developer", at: 9 * 60 + 14 },
  { desk: "18", name: "Zoe Harris", job: "SEO Specialist", at: 9 * 60 + 25 },
];
const LATE_FROM = 9 * 60 + 6; // Late from 09:06:00: the last on-time second is 09:05:59.
const WORK_START = 9 * 60; // lateMinutes counts from the start of the day, not from the end of the grace period.
const START = 8 * 60 + 40;
const END = 9 * 60 + 30;

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const t = {
  heading: { en: "A morning on the floor plan", ru: "Утро на плане офиса", uz: "Ofis rejasida bir tong" },
  time: { en: "Office time", ru: "Время в офисе", uz: "Ofis vaqti" },
  alt: {
    en: "A floor plan with 20 desks and three zones. Desks fill as people arrive; anyone after 09:05:59 is marked late.",
    ru: "План офиса с 20 столами и тремя зонами. Столы заполняются по мере прихода; пришедшие после 09:05:59 отмечены как опоздавшие.",
    uz: "20 ta stol va uchta zonali ofis rejasi. Xodimlar kelishi bilan stollar to‘ladi; 09:05:59 dan keyin kelganlar kechikkan deb belgilanadi.",
  },
  inOffice: { en: "In", ru: "На месте", uz: "Joyida" },
  late: { en: "Late", ru: "Опоздал", uz: "Kechikdi" },
  notYet: { en: "Not in yet", ru: "Ещё нет", uz: "Hali yo‘q" },
  free: { en: "Free desk", ru: "Свободный стол", uz: "Bo‘sh stol" },
  who: { en: "Who", ru: "Кто", uz: "Kim" },
  arrived: { en: "Arrived", ru: "Пришёл", uz: "Keldi" },
  status: { en: "Status", ru: "Статус", uz: "Holat" },
  note: {
    en: "Desks, zones and people are the project's demo data. Arrival times here are set by me for the illustration. In the app they come from the check-in button.",
    ru: "Столы, зоны и люди это демо-данные проекта. Время прихода задал я для иллюстрации. В приложении его даёт кнопка «Я на месте».",
    uz: "Stollar, zonalar va odamlar loyihaning demo ma’lumotlari. Kelish vaqtini tasvir uchun men belgiladim. Ilovada u «Men shu yerdaman» tugmasidan olinadi.",
  },
  mcp: { en: "The same question, from an AI agent", ru: "Тот же вопрос от AI-агента", uz: "AI-agentdan xuddi shu savol" },
  mcpNote: {
    en: "The MCP tool late_today has the shape of the real response; the values follow the slider.",
    ru: "Инструмент MCP late_today: форма настоящего ответа, значения идут за ползунком.",
    uz: "MCP vositasi late_today: haqiqiy javob shakli, qiymatlar slayderga ergashadi.",
  },
} satisfies Record<string, L10n>;

/** SSR renders the end of the morning, and the table below carries the same facts without JS. */
export default function MarginFloor({ locale }: { locale: Locale }) {
  const [now, setNow] = useState(END);
  const [hover, setHover] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || played.current) return;
        played.current = true;
        io.disconnect();
        const started = performance.now();
        const tick = (ts: number) => {
          const k = Math.min(1, (ts - started) / 3000);
          setNow(Math.round(START + (END - START) * k));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    if (root.current) io.observe(root.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const stateOf = (at: number) => (at > now ? "out" : at >= LATE_FROM ? "late" : "in");
  const label = (s: string) => pick(s === "late" ? t.late : s === "in" ? t.inOffice : t.notYet, locale);
  const late = people.filter((p) => p.at >= LATE_FROM && p.at <= now);
  const shown = people.find((p) => p.desk === hover);

  return (
    <section className="g case-sec">
      <div className="in" ref={root}>
        <h2>{pick(t.heading, locale)}</h2>
        <label className="mf-time" htmlFor="mf-time">
          {pick(t.time, locale)}: <b>{hhmm(now)}</b>
        </label>
        <input
          id="mf-time"
          className="mf-range"
          type="range"
          min={START}
          max={END}
          value={now}
          aria-valuetext={hhmm(now)}
          onChange={(e) => {
            played.current = true;
            setNow(Number(e.target.value));
          }}
        />
        <div className="mf-floor">
          <svg viewBox="0 0 1200 800" role="img" aria-label={pick(t.alt, locale)}>
            <rect className="mf-wall" x="1" y="1" width="1198" height="798" rx="12" />
            {zones.map((z) => (
              <g key={z.name.en}>
                <rect className="mf-zone" x="20" y={z.y} width="360" height={z.h} rx="8" />
                <text className="mf-zone-t" x="44" y={z.y + 44}>
                  {pick(z.name, locale)}
                </text>
              </g>
            ))}
            {deskRows.flatMap((y, r) =>
              columns.map((x, c) => {
                const code = String(r * columns.length + c + 1).padStart(2, "0");
                const person = people.find((p) => p.desk === code);
                const state = person ? stateOf(person.at) : "free";
                return (
                  <g
                    key={code}
                    className="mf-desk"
                    data-state={state}
                    tabIndex={person ? 0 : undefined}
                    onPointerEnter={() => setHover(code)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(code)}
                    onBlur={() => setHover(null)}
                  >
                    <rect x={x - 54} y={y - 44} width="108" height="88" rx="8" />
                    <text x={x} y={y + 9} textAnchor="middle">
                      {state === "late" ? "!" : ""}
                      {code}
                    </text>
                  </g>
                );
              }),
            )}
          </svg>
          <p className="mf-card" aria-live="polite">
            {shown
              ? `${shown.name}, ${shown.job}: ${label(stateOf(shown.at))}${shown.at <= now ? `, ${hhmm(shown.at)}` : ""}`
              : `${pick(t.inOffice, locale)}: ${people.filter((p) => stateOf(p.at) === "in").length} · ${pick(t.late, locale)}: ${late.length} · ${pick(t.notYet, locale)}: ${people.filter((p) => stateOf(p.at) === "out").length} · ${pick(t.free, locale)}: 7`}
          </p>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
        <h3 className="mf-h3">{pick(t.mcp, locale)}</h3>
        <pre className="mf-json">
          <code>{`late_today → ${JSON.stringify({ late: late.map((p) => ({ name: p.name, checkIn: hhmm(p.at), lateMinutes: p.at - WORK_START })) }, null, 2)}`}</code>
        </pre>
        <p className="block-note">{pick(t.mcpNote, locale)}</p>
        <details className="mf-details">
          <summary>
            {pick(t.who, locale)} · {pick(t.arrived, locale)} · {pick(t.status, locale)}
          </summary>
          <table className="measures">
            <tbody>
              {people.map((p) => (
                <tr key={p.desk}>
                  <th scope="row">
                    {p.desk} {p.name}
                  </th>
                  <td className="val">{hhmm(p.at)}</td>
                  <td>{label(p.at >= LATE_FROM ? "late" : "in")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </section>
  );
}
