"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Fixed test numbers. There is deliberately no input, so nobody is invited to type a real card. */
const presets = [
  { id: "ok", number: "4242424242424242", name: { en: "Test number", ru: "Тестовый номер", uz: "Test raqami" } },
  { id: "typo", number: "4242425242424242", name: { en: "One wrong digit", ru: "Одна неверная цифра", uz: "Bitta noto‘g‘ri raqam" } },
] satisfies { id: string; number: string; name: L10n }[];

type Cell = { digit: number; doubled: boolean; value: number };

/** The same walk as validateLuhn in src/utils/cardUtils.ts: right to left, doubling every second digit. */
function walk(number: string): Cell[] {
  return [...number]
    .map(Number)
    .reverse()
    .map((digit, i) => {
      const doubled = i % 2 === 1;
      const value = doubled ? (digit * 2 > 9 ? digit * 2 - 9 : digit * 2) : digit;
      return { digit, doubled, value };
    });
}

const t = {
  phoneCaption: {
    en: "The live site at 390×844: swiping cards, then paying for a phone top-up with a quick amount. The balance and the payment exist only in the browser.",
    ru: "Живой сайт в размере 390×844: свайп карт, затем оплата связи быстрой суммой. Баланс и платёж существуют только в браузере.",
    uz: "Jonli sayt 390×844 o‘lchamda: kartalarni surish, keyin tezkor summa bilan aloqa to‘lovi. Balans va to‘lov faqat brauzerda mavjud.",
  },
  heading: { en: "Luhn, digit by digit", ru: "Луна по цифрам", uz: "Lun raqamma-raqam" },
  intro: {
    en: "Going from the right, every second digit is doubled, and 9 is taken off anything above 9. The total must divide by 10.",
    ru: "Справа налево каждая вторая цифра удваивается, а из результата больше 9 вычитается 9. Сумма должна делиться на 10.",
    uz: "O‘ngdan chapga har ikkinchi raqam ikki baravar qilinadi, 9 dan katta natijadan 9 ayriladi. Yig‘indi 10 ga bo‘linishi kerak.",
  },
  step: { en: "Next digit", ru: "Следующая цифра", uz: "Keyingi raqam" },
  run: { en: "Run", ru: "Запустить", uz: "Ishga tushirish" },
  reset: { en: "From the start", ru: "С начала", uz: "Boshidan" },
  sum: { en: "Sum", ru: "Сумма", uz: "Yig‘indi" },
  pass: { en: "divides by 10: the form accepts it", ru: "делится на 10: форма принимает", uz: "10 ga bo‘linadi: forma qabul qiladi" },
  fail: { en: "doesn't divide by 10: the form shows an error", ru: "не делится на 10: форма показывает ошибку", uz: "10 ga bo‘linmaydi: forma xato ko‘rsatadi" },
  note: {
    en: "This catches typos, not fraud: a number can pass and still belong to no card. 4242… is a widely published test number, and the block has no input on purpose.",
    ru: "Это ловит опечатки, а не мошенничество: номер может пройти и всё равно не принадлежать ни одной карте. 4242… это широко известный тестовый номер, а поля ввода здесь нет намеренно.",
    uz: "Bu firibgarlikni emas, xatolarni ushlaydi: raqam tekshiruvdan o‘tib ham hech qanday kartaga tegishli bo‘lmasligi mumkin. 4242… keng tarqalgan test raqami, bu yerda kiritish maydoni ataylab yo‘q.",
  },
} satisfies Record<string, L10n>;

export default function LuhnWalk({ locale }: { locale: Locale }) {
  const [preset, setPreset] = useState<string>("ok");
  const [seen, setSeen] = useState(16);
  const [running, setRunning] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  const number = presets.find((p) => p.id === preset)?.number ?? presets[0].number;
  const cells = walk(number);
  const total = cells.slice(0, seen).reduce((s, c) => s + c.value, 0);
  const finished = seen >= cells.length;
  const passes = total % 10 === 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeen((n) => {
        if (n + 1 >= 16) setRunning(false);
        return Math.min(n + 1, 16);
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.controls = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(16);
      return;
    }
    setSeen(0);
    setRunning(true);
  };

  const choose = (id: string) => {
    setRunning(false);
    setPreset(id);
    setSeen(16);
  };

  // Cells come from the right, and are drawn in the number's own order.
  const drawn = cells.map((c, i) => ({ ...c, order: i })).reverse();

  return (
    <>
      <section className="g case-sec">
        <div className="in ab-phone-row">
          <div className="ab-phone">
            <video ref={video} src="/projects/askar-bank/flow.mp4" poster="/projects/askar-bank/home.webp" width={390} height={844} muted loop playsInline controls preload="metadata" />
          </div>
          <p className="block-note">{pick(t.phoneCaption, locale)}</p>
        </div>
      </section>
      <section className="g case-sec">
        <div className="in">
          <h2>{pick(t.heading, locale)}</h2>
          <p>{pick(t.intro, locale)}</p>
          <div className="ab-controls">
            {presets.map((p) => (
              <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => choose(p.id)}>
                {pick(p.name, locale)}
              </button>
            ))}
          </div>
          <ol className="ab-digits" aria-label={number}>
            {drawn.map((c) => (
              <li key={c.order} data-now={c.order === seen - 1 && !finished ? "" : undefined} data-gap={c.order % 4 === 0 && c.order > 0 ? "" : undefined}>
                <b>{c.digit}</b>
                <small>{c.doubled ? "×2" : " "}</small>
                <span>{c.order < seen ? c.value : " "}</span>
              </li>
            ))}
          </ol>
          <p className="ab-sum" aria-live="polite">
            {pick(t.sum, locale)}: <b>{total}</b>
            {finished ? ` — ${pick(passes ? t.pass : t.fail, locale)}` : ""}
          </p>
          <div className="ab-controls">
            <button type="button" onClick={start}>
              {pick(t.run, locale)}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSeen((n) => (n >= 16 ? 1 : n + 1));
              }}
            >
              {pick(t.step, locale)}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSeen(0);
              }}
            >
              {pick(t.reset, locale)}
            </button>
          </div>
          <p className="block-note">{pick(t.note, locale)}</p>
        </div>
      </section>
    </>
  );
}
