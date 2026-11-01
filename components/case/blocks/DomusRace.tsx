"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

const doors: L10n[] = [
  { en: "Site", ru: "Сайт", uz: "Sayt" },
  { en: "Mini app", ru: "Мини-апп", uz: "Mini-ilova" },
  { en: "Bot", ru: "Бот", uz: "Bot" },
  { en: "AI agents", ru: "AI-агенты", uz: "AI-agentlar" },
  { en: "Admin", ru: "Админка", uz: "Admin panel" },
  { en: "MCP", ru: "MCP", uz: "MCP" },
];

const t = {
  heading: { en: "Two requests, one apartment", ru: "Две заявки на одну квартиру", uz: "Bitta kvartiraga ikki so‘rov" },
  alt: {
    en: "Six entry points connect to one core. Requests from the site and the bot reach the core at once: the site's gets the apartment, the bot's is refused.",
    ru: "Шесть входов соединены с одним ядром. Заявки с сайта и из бота приходят в ядро одновременно: заявка с сайта получает квартиру, заявка из бота получает отказ.",
    uz: "Oltita kirish bitta yadroga ulangan. Sayt va botdan so‘rovlar yadroga bir vaqtda keladi: saytniki kvartirani oladi, botnikiga rad javobi beriladi.",
  },
  core: { en: "One core", ru: "Одно ядро", uz: "Bitta yadro" },
  apartment: { en: "Apartment", ru: "Квартира", uz: "Kvartira" },
  held: { en: "Held 15 min", ru: "Удержана на 15 мин", uz: "15 daqiqa ushlangan" },
  refused: { en: "Bot: refused", ru: "Бот: отказ", uz: "Bot: rad etildi" },
  steps: [
    {
      title: { en: "Two buyers, the same second", ru: "Два покупателя, одна секунда", uz: "Ikki xaridor, bir soniya" },
      text: {
        en: "One buyer presses the button on the site, another in the Telegram bot. Neither door decides anything on its own: both call the core.",
        ru: "Один покупатель нажимает кнопку на сайте, другой в Telegram-боте. Ни один вход ничего не решает сам: оба вызывают ядро.",
        uz: "Bir xaridor saytda, boshqasi Telegram-botda tugmani bosadi. Hech bir kirish o‘zi hal qilmaydi: ikkalasi ham yadroni chaqiradi.",
      },
    },
    {
      title: { en: "One gets the hold", ru: "Один получает удержание", uz: "Bittasi ushlab turishni oladi" },
      text: {
        en: "The first request holds the apartment for 15 minutes while the buyer pays. The second is refused, and the bot says so.",
        ru: "Первая заявка удерживает квартиру на 15 минут, пока покупатель платит. Вторая получает отказ, и бот об этом сообщает.",
        uz: "Birinchi so‘rov xaridor to‘lagunicha kvartirani 15 daqiqa ushlab turadi. Ikkinchisi rad etiladi va bot bu haqda aytadi.",
      },
    },
    {
      title: { en: "Then the clock decides", ru: "Дальше решает срок", uz: "Keyin muddat hal qiladi" },
      text: {
        en: "A paid deposit of 10,000,000 sum turns the hold into a 72-hour booking. If nobody pays, the core frees the apartment by itself.",
        ru: "Оплаченный депозит 10 000 000 сум превращает удержание в бронь на 72 часа. Если никто не платит, ядро само освобождает квартиру.",
        uz: "To‘langan 10 000 000 so‘m depozit ushlab turishni 72 soatlik bronga aylantiradi. Hech kim to‘lamasa, yadro kvartirani o‘zi bo‘shatadi.",
      },
    },
  ],
  clock: [
    { en: "15 min", ru: "15 мин", uz: "15 daq" },
    { en: "72 hours", ru: "72 часа", uz: "72 soat" },
    { en: "Free", ru: "Свободна", uz: "Bo‘sh" },
  ],
  clockNote: [
    { en: "hold", ru: "удержание", uz: "ushlash" },
    { en: "booking with a deposit", ru: "бронь с депозитом", uz: "depozitli bron" },
    { en: "by deadline", ru: "по сроку", uz: "muddat bo‘yicha" },
  ],
  note: {
    en: "This diagram explains the behaviour. The race itself is tested by npm run test:neon, with parallel bookings on a real Neon database.",
    ru: "Схема поясняет поведение. Саму гонку проверяет npm run test:neon: параллельные брони на настоящей базе Neon.",
    uz: "Sxema xatti-harakatni tushuntiradi. Poygani esa npm run test:neon tekshiradi: haqiqiy Neon bazasida parallel bronlar.",
  },
} satisfies Record<string, L10n | L10n[] | { title: L10n; text: L10n }[]>;

const W = 640;
const H = 420;
const rowY = (i: number) => 30 + i * 72;

/** SSR renders the last step, so without JS or observers the full outcome is on screen. */
export default function DomusRace({ locale }: { locale: Locale }) {
  const [step, setStep] = useState(2);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const motionless = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 899px)").matches;
    if (motionless || narrow) return;
    // The band in the middle of the screen decides which step is current.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const siteY = rowY(0);
  const botY = rowY(2);
  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <div className="dm-race">
          <figure className="dm-fig">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={pick(t.alt, locale)}>
              {doors.map((d, i) => (
                <g key={d.en}>
                  <path className="wire" d={`M112 ${rowY(i)} C 180 ${rowY(i)}, 180 210, 250 210`} />
                  <g className="n">
                    <rect x="4" y={rowY(i) - 18} width="108" height="36" rx="6" />
                    <text x="58" y={rowY(i) + 5} textAnchor="middle">
                      {pick(d, locale)}
                    </text>
                  </g>
                </g>
              ))}
              <path className="wire" d="M370 210 H 470" />
              <path className={`req won ${step >= 0 ? "on" : ""}`} pathLength={1} d={`M112 ${siteY} C 180 ${siteY}, 180 210, 250 210`} />
              <path className={`req lost ${step >= 0 ? "on" : ""} ${step >= 1 ? "refused" : ""}`} pathLength={1} d={`M112 ${botY} C 180 ${botY}, 180 210, 250 210`} />
              <path className={`req won ${step >= 1 ? "on" : ""}`} pathLength={1} d="M370 210 H 470" />
              <g className="core">
                <rect x="250" y="176" width="120" height="68" rx="8" />
                <text x="310" y="215" textAnchor="middle">
                  {pick(t.core, locale)}
                </text>
              </g>
              <g className="n">
                <rect x="470" y="176" width="166" height="68" rx="8" />
                <text x="553" y="205" textAnchor="middle">
                  {pick(t.apartment, locale)}
                </text>
                <text className="verdict ac" x="553" y="228" textAnchor="middle" opacity={step >= 1 ? 1 : 0}>
                  {pick(t.held, locale)}
                </text>
              </g>
              <text className="verdict garnet" x="310" y="290" textAnchor="middle" opacity={step >= 1 ? 1 : 0}>
                {pick(t.refused, locale)}
              </text>
            </svg>
            <ol className="dm-clock" style={{ opacity: step >= 2 ? 1 : 0.25 }}>
              {t.clock.map((c, i) => (
                <li key={c.en}>
                  <b>{pick(c, locale)}</b>
                  {pick(t.clockNote[i], locale)}
                </li>
              ))}
            </ol>
          </figure>
          <div className="dm-steps">
            {t.steps.map((s, i) => (
              <article
                key={s.title.en}
                data-i={i}
                data-on={step === i}
                ref={(el) => {
                  steps.current[i] = el;
                }}
              >
                <h3>{pick(s.title, locale)}</h3>
                <p>{pick(s.text, locale)}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
