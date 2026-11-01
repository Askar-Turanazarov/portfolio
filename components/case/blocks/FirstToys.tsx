"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** The clicker's own storage keys. Kept in memory too, for browsers that refuse localStorage. */
const COUNT = "space_clicker_count";
const BOARD = "space_clicker_leaderboard";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const read = (key: string, empty: string) => {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return v;
  } catch {}
  return memory.get(key) ?? empty;
};
const write = (key: string, value: string | null) => {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
  listeners.forEach((fn) => fn());
};

type Row = { clicks: number; duration: string; cps: string; timestamp: number };

const parseBoard = (raw: string): Row[] => {
  try {
    const rows = JSON.parse(raw);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};

const achievements: [number, L10n][] = [
  [10, { en: "🚀 First spark!", ru: "🚀 Первая искра!", uz: "🚀 Birinchi uchqun!" }],
  [50, { en: "✨ Cosmic vacuum cleaner", ru: "✨ Космический пылесос", uz: "✨ Kosmik changyutgich" }],
  [100, { en: "🌟 Birth of a supernova", ru: "🌟 Рождение Сверхновой", uz: "🌟 O‘ta yangi yulduz tug‘ilishi" }],
  [500, { en: "🌀 Lord of black holes", ru: "🌀 Повелитель Чёрных Дыр", uz: "🌀 Qora tuynuklar hukmdori" }],
  [1000, { en: "👑 God of the universe!", ru: "👑 Бог Вселенной!", uz: "👑 Koinot xudosi!" }],
];

const answers: L10n[] = [
  { en: "Yes", ru: "Да", uz: "Ha" },
  { en: "Definitely yes", ru: "Однозначно да", uz: "Albatta ha" },
  { en: "You can be sure", ru: "Можешь быть уверен", uz: "Ishonchingiz komil bo‘lsin" },
  { en: "Most likely yes", ru: "Вероятнее всего — да", uz: "Katta ehtimol bilan ha" },
  { en: "The signs say yes", ru: "Знаки говорят — да", uz: "Belgilar ha demoqda" },
  { en: "Ask later", ru: "Спроси позже", uz: "Keyinroq so‘rang" },
  { en: "Not clear yet", ru: "Пока не ясно", uz: "Hozircha noaniq" },
  { en: "Concentrate and ask again", ru: "Сосредоточься и спроси снова", uz: "Diqqat qiling va yana so‘rang" },
  { en: "Better not to answer now", ru: "Лучше не отвечать сейчас", uz: "Hozir javob bermagan ma’qul" },
  { en: "Cannot be predicted", ru: "Нельзя предсказать", uz: "Oldindan aytib bo‘lmaydi" },
  { en: "No", ru: "Нет", uz: "Yo‘q" },
  { en: "Very doubtful", ru: "Весьма сомнительно", uz: "Juda shubhali" },
  { en: "Don't count on it", ru: "Не рассчитывай на это", uz: "Bunga umid qilmang" },
  { en: "My answer is no", ru: "Мой ответ — нет", uz: "Javobim yo‘q" },
  { en: "Outlook not great", ru: "Перспективы так себе", uz: "Istiqbol unchalik emas" },
];

const t = {
  clicker: { en: "Space Clicker", ru: "Космический Кликер", uz: "Kosmik kliker" },
  ball: { en: "Ball of Fate", ru: "Шар судьбы", uz: "Taqdir shari" },
  click: { en: "Click", ru: "Клик", uz: "Bosish" },
  total: { en: "total clicks", ru: "всего кликов", uz: "jami bosishlar" },
  idle: { en: "Starts with a click", ru: "Запуск с кликом", uz: "Bosish bilan boshlanadi" },
  recording: { en: "Recording...", ru: "Идет запись...", uz: "Yozilmoqda..." },
  saved: { en: "Session recorded", ru: "Сессия записана", uz: "Sessiya yozildi" },
  short: { en: "ℹ️ Session too short", ru: "ℹ️ Слишком короткая сессия", uz: "ℹ️ Sessiya juda qisqa" },
  empty: { en: "No records yet. Start clicking!", ru: "Рекордов пока нет. Начни кликать!", uz: "Hozircha rekordlar yo‘q. Bosishni boshlang!" },
  clicks: { en: "Clicks", ru: "Клики", uz: "Bosishlar" },
  time: { en: "Time, s", ru: "Время, с", uz: "Vaqt, son" },
  cps: { en: "Per s", ru: "В сек", uz: "Soniyada" },
  reset: { en: "Reset everything", ru: "Сбросить всё", uz: "Hammasini tozalash" },
  question: { en: "Your question", ru: "Ваш вопрос", uz: "Savolingiz" },
  shake: { en: "Shake", ru: "Встряхнуть", uz: "Silkitish" },
  history: { en: "History", ru: "История", uz: "Tarix" },
  note: {
    en: "The rules are copied from the two projects: a session ends after two seconds without a click, and only sessions of five clicks or more reach the table of five. In the original the ball is a 3D model embedded from Sketchfab; here it is a CSS sphere. The English and Uzbek wording is a translation. Records stay in your browser.",
    ru: "Правила скопированы из двух проектов: сессия заканчивается через две секунды без клика, а в таблицу из пяти строк попадают сессии от пяти кликов. В оригинале шар это 3D-модель, встроенная со Sketchfab, здесь CSS-сфера. Английские и узбекские надписи это перевод. Рекорды остаются в вашем браузере.",
    uz: "Qoidalar ikki loyihadan ko‘chirilgan: sessiya bosishsiz ikki soniyadan keyin tugaydi, besh qatorli jadvalga esa kamida besh bosishli sessiyalar tushadi. Asl nusxada shar Sketchfab’dan joylangan 3D model, bu yerda CSS sfera. Inglizcha va o‘zbekcha yozuvlar tarjima. Rekordlar brauzeringizda qoladi.",
  },
} satisfies Record<string, L10n>;

function Clicker({ locale }: { locale: Locale }) {
  const count = Number(useSyncExternalStore(subscribe, () => read(COUNT, "0"), () => "0")) || 0;
  const board = parseBoard(useSyncExternalStore(subscribe, () => read(BOARD, "[]"), () => "[]"));
  const [status, setStatus] = useState<"idle" | "recording" | "saved">("idle");
  const [live, setLive] = useState({ clicks: 0, seconds: 0 });
  const [toast, setToast] = useState<L10n | null>(null);
  const session = useRef({ start: 0, clicks: 0, idle: 0, tick: 0, toast: 0 });

  useEffect(() => {
    const s = session.current;
    return () => {
      clearTimeout(s.idle);
      clearTimeout(s.toast);
      clearInterval(s.tick);
    };
  }, []);

  const show = (message: L10n) => {
    setToast(message);
    clearTimeout(session.current.toast);
    session.current.toast = window.setTimeout(() => setToast(null), 2500);
  };

  const end = () => {
    const s = session.current;
    clearInterval(s.tick);
    const duration = Math.max(0.1, (performance.now() - s.start) / 1000);
    if (s.clicks >= 5) {
      const row: Row = { clicks: s.clicks, duration: duration.toFixed(1), cps: (s.clicks / duration).toFixed(1), timestamp: Date.now() };
      const next = [...parseBoard(read(BOARD, "[]")), row]
        .sort((a, b) => b.clicks - a.clicks || Number(b.cps) - Number(a.cps))
        .slice(0, 5);
      write(BOARD, JSON.stringify(next));
    } else {
      show(t.short);
    }
    s.clicks = 0;
    s.start = 0;
    setStatus("saved");
  };

  const click = () => {
    const s = session.current;
    if (!s.start) {
      s.start = performance.now();
      setStatus("recording");
      s.tick = window.setInterval(() => {
        setLive({ clicks: s.clicks, seconds: (performance.now() - s.start) / 1000 });
      }, 100);
    }
    s.clicks += 1;
    setLive({ clicks: s.clicks, seconds: (performance.now() - s.start) / 1000 });
    clearTimeout(s.idle);
    s.idle = window.setTimeout(end, 2000);
    const total = Number(read(COUNT, "0")) + 1 || 1;
    write(COUNT, String(total));
    const reached = achievements.find(([n]) => n === total);
    if (reached) show(reached[1]);
  };

  const reset = () => {
    const s = session.current;
    clearTimeout(s.idle);
    clearInterval(s.tick);
    s.clicks = 0;
    s.start = 0;
    write(COUNT, null);
    write(BOARD, null);
    setStatus("idle");
    setLive({ clicks: 0, seconds: 0 });
    setToast(null);
  };

  return (
    <div className="fs-card fs-clicker">
      <h2>{pick(t.clicker, locale)}</h2>
      <p className="fs-count">
        <b>{count}</b> {pick(t.total, locale)}
      </p>
      <button type="button" className="fs-big" onClick={click}>
        {pick(t.click, locale)}
      </button>
      <p className="fs-status" aria-live="polite">
        <span data-on={status === "recording" ? "" : undefined} />
        {pick(t[status], locale)}
        {status === "recording" && ` · ${live.clicks} · ${live.seconds.toFixed(1)}`}
      </p>
      <p className="fs-toast" role="status">{toast && pick(toast, locale)}</p>
      {board.length === 0 ? (
        <p className="fs-empty">{pick(t.empty, locale)}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">{pick(t.clicks, locale)}</th>
              <th scope="col">{pick(t.time, locale)}</th>
              <th scope="col">{pick(t.cps, locale)}</th>
            </tr>
          </thead>
          <tbody>
            {board.map((r) => (
              <tr key={r.timestamp}>
                <td>{r.clicks}</td>
                <td>{r.duration}</td>
                <td>{r.cps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button type="button" className="fs-reset" onClick={reset}>
        {pick(t.reset, locale)}
      </button>
    </div>
  );
}

const T_SHAKE = 600;

function Ball({ locale }: { locale: Locale }) {
  const [question, setQuestion] = useState("");
  const [shaking, setShaking] = useState(false);
  const [missing, setMissing] = useState(false);
  const [answer, setAnswer] = useState<L10n | null>(null);
  const [history, setHistory] = useState<{ id: number; time: string; question: string; answer: L10n }[]>([]);
  const timers = useRef({ shake: 0, missing: 0 });

  useEffect(() => {
    const s = timers.current;
    return () => {
      clearTimeout(s.shake);
      clearTimeout(s.missing);
    };
  }, []);

  const ask = () => {
    const q = question.trim();
    if (!q) {
      setMissing(true);
      clearTimeout(timers.current.missing);
      timers.current.missing = window.setTimeout(() => setMissing(false), 500);
      return;
    }
    const finish = () => {
      const next = answers[Math.floor(Math.random() * answers.length)];
      const now = new Date();
      setAnswer(next);
      setShaking(false);
      setHistory((h) => [{ id: now.getTime(), time: now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }), question: q, answer: next }, ...h]);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setAnswer(null);
    setShaking(true);
    timers.current.shake = window.setTimeout(finish, T_SHAKE);
  };

  return (
    <div className="fs-card fs-ballcard">
      <h2>{pick(t.ball, locale)}</h2>
      <div className="fs-ball" data-shake={shaking ? "" : undefined}>
        <div aria-live="polite">{answer ? pick(answer, locale) : "8"}</div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!shaking) ask();
        }}
      >
        <label htmlFor="fs-q">{pick(t.question, locale)}</label>
        <input id="fs-q" value={question} maxLength={120} data-missing={missing ? "" : undefined} onChange={(e) => setQuestion(e.target.value)} />
        <button type="submit" className="fs-big" disabled={shaking}>
          {pick(t.shake, locale)}
        </button>
      </form>
      {history.length > 0 && (
        <div className="fs-history">
          <h3>{pick(t.history, locale)}</h3>
          <ul>
            {history.map((h) => (
              <li key={h.id}>
                <span>{h.time}</span> {h.question} <b>{pick(h.answer, locale)}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function FirstToys({ locale }: { locale: Locale }) {
  return (
    <section className="g case-sec">
      <div className="in">
        <noscript>
          <style>{".fs-toys, .fs-note { display: none; }"}</style>
          <div className="fs-still">
            <a href="https://askar-turanazarov.github.io/my-first-clickerapp/">
              <Image src="/projects/first-steps/clicker.webp" alt={pick(t.clicker, locale)} width={1440} height={900} sizes="(max-width: 700px) 100vw, 50vw" />
              {pick(t.clicker, locale)}
            </a>
            <a href="https://askar-turanazarov.github.io/Magic-8Ball/">
              <Image src="/projects/first-steps/ball.webp" alt={pick(t.ball, locale)} width={840} height={525} sizes="(max-width: 700px) 100vw, 50vw" />
              {pick(t.ball, locale)}
            </a>
          </div>
        </noscript>
        <div className="fs-toys">
          <Clicker locale={locale} />
          <Ball locale={locale} />
        </div>
        <p className="block-note fs-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
