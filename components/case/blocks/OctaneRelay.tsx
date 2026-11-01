"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

const t = {
  heading: { en: "Changing models on the move", ru: "Смена модели на ходу", uz: "Yurishda modelni almashtirish" },
  replay: { en: "Replay", ru: "Повторить", uz: "Qaytarish" },
  scenario: {
    en: "A replay of the logic in src/lib/ai/router.ts, not a live request.",
    ru: "Воспроизведение логики из src/lib/ai/router.ts, а не живой запрос.",
    uz: "src/lib/ai/router.ts mantig‘ining takrori, jonli so‘rov emas.",
  },
  modelA: { en: "Model 1", ru: "Модель 1", uz: "1-model" },
  modelB: { en: "Model 2", ru: "Модель 2", uz: "2-model" },
  answer: { en: "What happens on an error", ru: "Что происходит при ошибке", uz: "Xatoda nima bo‘ladi" },
  pause: { en: "Reaction", ru: "Реакция", uz: "Javob" },
  code: { en: "Response", ru: "Ответ", uz: "Javob kodi" },
} satisfies Record<string, L10n>;

const steps: { tool: string; text: L10n; by: "a" | "b"; state?: L10n }[] = [
  {
    tool: "get_services",
    by: "a",
    text: { en: "Finds the service", ru: "Подбирает услугу", uz: "Xizmatni topadi" },
  },
  {
    tool: "get_available_slots",
    by: "a",
    text: { en: "Checks the slot", ru: "Проверяет слот", uz: "Vaqtni tekshiradi" },
    state: { en: "429: model 1 is paused", ru: "429: модель 1 на паузе", uz: "429: 1-model pauzada" },
  },
  {
    tool: "create_booking",
    by: "b",
    text: { en: "Books, once", ru: "Записывает один раз", uz: "Bir marta yozib qo‘yadi" },
    state: { en: "Model 2 received both results above", ru: "Модель 2 получила оба результата выше", uz: "2-model yuqoridagi ikkala natijani oldi" },
  },
];

const reactions: { code: string; what: L10n }[] = [
  {
    code: "429, 5xx, timeout, network",
    what: {
      en: "Pause from 15 s, doubling up to 10 min; straight to the next model",
      ru: "Пауза от 15 с, удваивается до 10 мин; сразу к следующей модели",
      uz: "15 s dan boshlab pauza, 10 daqiqagacha ikki baravar oshadi; darhol keyingi modelga",
    },
  },
  {
    code: "400, 404, 422",
    what: { en: "Pause for 10 min", ru: "Пауза на 10 мин", uz: "10 daqiqaga pauza" },
  },
  {
    code: "401, 403",
    what: {
      en: "All of the provider's models off until restart",
      ru: "Все модели провайдера отключены до перезапуска",
      uz: "Provayderning barcha modellari qayta ishga tushirishgacha o‘chiriladi",
    },
  },
];

/** Needle angle for each step of the run: climbing, dropped by the 429, back up on model 2. */
const needle = [-60, 20, 60];
const STEP_MS = 1300;

/** SSR shows the finished run, so the outcome is there without JS or with reduced motion. */
export default function OctaneRelay({ locale }: { locale: Locale }) {
  const [at, setAt] = useState(2);
  const [drop, setDrop] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAt(2);
      setDrop(false);
      return;
    }
    setAt(0);
    setDrop(false);
    timers.current.push(
      window.setTimeout(() => setAt(1), STEP_MS),
      window.setTimeout(() => setDrop(true), STEP_MS * 1.6),
      window.setTimeout(() => {
        setDrop(false);
        setAt(2);
      }, STEP_MS * 2.4),
    );
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.5 },
    );
    if (root.current) io.observe(root.current);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach(clearTimeout);
    };
  }, []);

  const angle = drop ? -90 : needle[at];
  const ticks = Array.from({ length: 13 }, (_, i) => -90 + i * 15);

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <div className="oc-relay" ref={root}>
          <div className="oc-dial">
            <svg viewBox="0 0 240 150" aria-hidden="true">
              {ticks.map((a, i) => (
                <line key={a} x1="120" y1={i % 2 ? 26 : 20} x2="120" y2="36" transform={`rotate(${a} 120 130)`} data-red={a > 60} />
              ))}
              <g className="oc-needle" style={{ transform: `rotate(${angle}deg)` }}>
                <line x1="120" y1="130" x2="120" y2="42" />
              </g>
              <circle cx="120" cy="130" r="7" />
            </svg>
            <p className="oc-who" aria-live="polite">
              {pick(steps[at].by === "a" ? t.modelA : t.modelB, locale)}
              {drop && " · 429"}
            </p>
          </div>
          <ol className="oc-steps">
            {steps.map((s, i) => (
              <li key={s.tool} data-state={i < at ? "done" : i === at ? "now" : "next"}>
                <b>{pick(s.text, locale)}</b> <code>{s.tool}</code>
                {s.state && <p>{pick(s.state, locale)}</p>}
              </li>
            ))}
          </ol>
        </div>
        <p className="block-note">
          {pick(t.scenario, locale)}{" "}
          <button type="button" className="oc-replay" onClick={run}>
            {pick(t.replay, locale)}
          </button>
        </p>
        <h3 className="oc-table-h">{pick(t.answer, locale)}</h3>
        <table className="measures">
          <thead className="oc-thead">
            <tr>
              <th scope="col">{pick(t.code, locale)}</th>
              <th scope="col">{pick(t.pause, locale)}</th>
            </tr>
          </thead>
          <tbody>
            {reactions.map((r) => (
              <tr key={r.code}>
                <th scope="row" className="val">
                  {r.code}
                </th>
                <td>{pick(r.what, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
