"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Price list and rules from backend/src/services/knowledgeBase.ts and qualification.ts in the project. */
const services = {
  landing: { price: 23_800_000, weeks: 3, title: { en: "Sales landing page", ru: "Продающий лендинг", uz: "Sotuv lendingi" }, time: { en: "3–4 weeks", ru: "3–4 недели", uz: "3–4 hafta" } },
  corporate: { price: 59_500_000, weeks: 6, title: { en: "Corporate site", ru: "Корпоративный сайт", uz: "Korporativ sayt" }, time: { en: "6–10 weeks", ru: "6–10 недель", uz: "6–10 hafta" } },
  ecommerce: { price: 95_200_000, weeks: 10, title: { en: "Online store", ru: "Интернет-магазин", uz: "Internet-do‘kon" }, time: { en: "10–16 weeks", ru: "10–16 недель", uz: "10–16 hafta" } },
  webapp: { price: 154_700_000, weeks: 12, title: { en: "Web service and account area", ru: "Веб-сервис и личный кабинет", uz: "Veb-servis va shaxsiy kabinet" }, time: { en: "from 3 months", ru: "от 3 месяцев", uz: "3 oydan" } },
  redesign: { price: 29_750_000, weeks: 3, title: { en: "Redesign and speed-up", ru: "Редизайн и ускорение", uz: "Redizayn va tezlashtirish" }, time: { en: "3–5 weeks", ru: "3–5 недель", uz: "3–5 hafta" } },
} satisfies Record<string, { price: number; weeks: number; title: L10n; time: L10n }>;
type ServiceId = keyof typeof services;

const budgetMax: Record<string, number | null> = { lt25: 25e6, "25_60": 60e6, "60_150": 150e6, gt150: Infinity, unknown: null };
const deadlineWeeks: Record<string, number> = { urgent: 2, month: 4, quarter: 13, flexible: Infinity };
const goalToService: Record<string, ServiceId> = { leads: "landing", sales: "ecommerce", expertise: "corporate", automation: "webapp" };
const budgetPoints = { ok: 2, close: 1, unknown: 1, low: -1 };

const steps: { id: Answer; q: L10n; options: { v: string; l: L10n }[] }[] = [
  {
    id: "type",
    q: { en: "What needs building?", ru: "Что нужно сделать?", uz: "Nima qilish kerak?" },
    options: [
      { v: "landing", l: services.landing.title },
      { v: "corporate", l: services.corporate.title },
      { v: "ecommerce", l: services.ecommerce.title },
      { v: "webapp", l: services.webapp.title },
      { v: "unsure", l: { en: "Not decided yet", ru: "Пока не определился", uz: "Hali aniq emas" } },
    ],
  },
  {
    id: "state",
    q: { en: "What exists already?", ru: "Что уже есть?", uz: "Nima bor?" },
    options: [
      { v: "scratch", l: { en: "Nothing, from scratch", ru: "Ничего, с нуля", uz: "Hech narsa, noldan" } },
      { v: "brand", l: { en: "Logo and brand book", ru: "Логотип и брендбук", uz: "Logotip va brendbuk" } },
      { v: "old_site", l: { en: "An old site", ru: "Старый сайт", uz: "Eski sayt" } },
      { v: "figma", l: { en: "Figma mockups", ru: "Макеты в Figma", uz: "Figma maketlari" } },
    ],
  },
  {
    id: "deadline",
    q: { en: "When?", ru: "Когда?", uz: "Qachon?" },
    options: [
      { v: "urgent", l: { en: "Urgently", ru: "Срочно", uz: "Shoshilinch" } },
      { v: "month", l: { en: "Within a month", ru: "В течение месяца", uz: "Bir oy ichida" } },
      { v: "quarter", l: { en: "In 2–3 months", ru: "Через 2–3 месяца", uz: "2–3 oydan keyin" } },
      { v: "flexible", l: { en: "Not critical", ru: "Не критично", uz: "Muhim emas" } },
    ],
  },
  {
    id: "budget",
    q: { en: "Budget, million UZS", ru: "Бюджет, млн сум", uz: "Byudjet, mln so‘m" },
    options: [
      { v: "lt25", l: { en: "up to 25", ru: "до 25", uz: "25 gacha" } },
      { v: "25_60", l: { en: "25–60", ru: "25–60", uz: "25–60" } },
      { v: "60_150", l: { en: "60–150", ru: "60–150", uz: "60–150" } },
      { v: "gt150", l: { en: "over 150", ru: "более 150", uz: "150 dan ortiq" } },
      { v: "unknown", l: { en: "Need a guide", ru: "Нужен ориентир", uz: "Mo‘ljal kerak" } },
    ],
  },
  {
    id: "goal",
    q: { en: "Main goal?", ru: "Главная цель?", uz: "Asosiy maqsad?" },
    options: [
      { v: "leads", l: { en: "Collect enquiries", ru: "Собирать заявки", uz: "So‘rovlar yig‘ish" } },
      { v: "sales", l: { en: "Sell online", ru: "Продавать онлайн", uz: "Onlayn sotish" } },
      { v: "expertise", l: { en: "Show expertise", ru: "Показать экспертизу", uz: "Tajribani ko‘rsatish" } },
      { v: "automation", l: { en: "Automate processes", ru: "Автоматизировать процессы", uz: "Jarayonlarni avtomatlashtirish" } },
    ],
  },
];

type Answer = "type" | "state" | "deadline" | "budget" | "goal";

function qualify(a: Record<Answer, string>) {
  const inferred = a.type === "unsure";
  const id: ServiceId = !inferred
    ? (a.type as ServiceId)
    : a.state === "old_site" && (a.goal === "leads" || a.goal === "expertise")
      ? "redesign"
      : goalToService[a.goal];
  const s = services[id];
  const max = budgetMax[a.budget];
  const budgetFit = max == null ? "unknown" : s.price <= max ? "ok" : max >= s.price * 0.9 ? "close" : "low";
  const deadlineFit = s.weeks <= deadlineWeeks[a.deadline] ? "ok" : "tight";
  const alternative =
    budgetFit === "low" && max != null
      ? (["corporate", "landing"] as const).find((x) => x !== id && services[x].price <= max)
      : undefined;
  const points = [
    budgetPoints[budgetFit],
    a.deadline === "urgent" || a.deadline === "month" ? 2 : a.deadline === "quarter" ? 1 : 0,
    inferred ? 0 : 1,
    a.state !== "scratch" ? 1 : 0,
  ];
  const score = points.reduce((x, y) => x + y, 0);
  const temperature = score >= 4 ? "hot" : score >= 2 ? "warm" : "cold";
  return { s, inferred, budgetFit, deadlineFit, alternative, points, score, temperature } as const;
}

const num = (n: number) => n.toLocaleString("ru-RU").replace(/\s/g, " ");

const t = {
  heading: { en: "Who decides what", ru: "Кто что решает", uz: "Kim nimani hal qiladi" },
  intro: {
    en: "These are the site's five quiz questions, shortened. The left column runs here in your browser on the same price list and rules as the site's backend.",
    ru: "Это пять вопросов квиза с сайта, в сокращении. Левая колонка считается прямо в браузере по тому же прайсу и правилам, что и бэкенд сайта.",
    uz: "Bu saytdagi kvizning besh savoli, qisqartirilgan. Chap ustun shu brauzerda sayt backendi bilan bir xil narxnoma va qoidalar bo‘yicha hisoblanadi.",
  },
  code: { en: "Code", ru: "Код", uz: "Kod" },
  ai: { en: "AI", ru: "AI", uz: "AI" },
  format: { en: "format", ru: "формат", uz: "format" },
  price: { en: "price from, UZS", ru: "цена от, сум", uz: "narx, so‘mdan" },
  time: { en: "timing", ru: "срок", uz: "muddat" },
  budget: { en: "budget", ru: "бюджет", uz: "byudjet" },
  deadline: { en: "deadline", ru: "срок клиента", uz: "mijoz muddati" },
  alt: { en: "alternative", ru: "альтернатива", uz: "muqobil" },
  score: { en: "score", ru: "баллы", uz: "ball" },
  label: { en: "label", ru: "метка", uz: "belgi" },
  inferred: { en: "picked from the answers", ru: "подобран по ответам", uz: "javoblardan tanlandi" },
  aiGets: {
    en: "Receives the finished calculation and may not change the format, the price or the timing.",
    ru: "Получает готовый расчёт и не может менять формат, цену и сроки.",
    uz: "Tayyor hisobni oladi va format, narx hamda muddatni o‘zgartira olmaydi.",
  },
  aiWrites: {
    en: "Writes two paragraphs of 80–130 words: why this format fits and what's included, then the budget, timing and next steps.",
    ru: "Пишет два абзаца на 80–130 слов: почему формат подходит и что в него входит, затем бюджет, сроки и что дальше.",
    uz: "80–130 so‘zli ikki xatboshi yozadi: format nega mos va nima kiradi, keyin byudjet, muddat va keyingi qadam.",
  },
  aiLead: {
    en: "When a lead comes in, writes a summary for the manager.",
    ru: "Когда приходит заявка, пишет сводку для менеджера.",
    uz: "So‘rov kelganda menejer uchun qisqacha bayon yozadi.",
  },
  aiNone: {
    en: "With no model available, a scripted text fills the same place, and the numbers stay the same.",
    ru: "Если модель недоступна, на то же место встаёт сценарный текст, а цифры не меняются.",
    uz: "Model bo‘lmasa, o‘sha joyga ssenariy matni qo‘yiladi, raqamlar esa o‘zgarmaydi.",
  },
  note: {
    en: "The calculation was ported from qualification.ts for this page. Answer labels are shortened, and the AI implementation service, which the quiz doesn't suggest, is left out.",
    ru: "Расчёт перенесён на страницу из qualification.ts. Подписи ответов сокращены, услуга внедрения ИИ, которую квиз не предлагает, не включена.",
    uz: "Hisob bu sahifaga qualification.ts’dan ko‘chirilgan. Javob yozuvlari qisqartirilgan, kviz taklif qilmaydigan AI joriy etish xizmati kiritilmagan.",
  },
  noscript: {
    en: "Without JavaScript the calculation stays on this one example.",
    ru: "Без JavaScript расчёт остаётся на этом примере.",
    uz: "JavaScript’siz hisob shu misolda qoladi.",
  },
} satisfies Record<string, L10n>;

const fits: Record<string, L10n> = {
  ok: { en: "fits", ru: "укладывается", uz: "mos" },
  close: { en: "just below the start price", ru: "чуть ниже стартовой цены", uz: "boshlang‘ich narxdan sal past" },
  low: { en: "well below the start price", ru: "заметно ниже стартовой цены", uz: "boshlang‘ich narxdan ancha past" },
  unknown: { en: "not named", ru: "не назван", uz: "aytilmagan" },
  tight: { en: "shorter than usual", ru: "короче обычного", uz: "odatdagidan qisqa" },
};
const temps: Record<string, L10n> = {
  hot: { en: "hot", ru: "горячая", uz: "issiq" },
  warm: { en: "warm", ru: "тёплая", uz: "iliq" },
  cold: { en: "cold", ru: "холодная", uz: "sovuq" },
};

/** SSR shows one complete example, so the page reads the same before hydration. */
export default function OrbitSplit({ locale }: { locale: Locale }) {
  const [answers, setAnswers] = useState<Record<Answer, string>>({
    type: "landing",
    state: "figma",
    deadline: "month",
    budget: "25_60",
    goal: "leads",
  });
  const r = qualify(answers);
  const sum = r.points.map((p, i) => (i === 0 ? String(p) : p < 0 ? `− ${-p}` : `+ ${p}`)).join(" ");

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="or-quiz">
          {steps.map((s) => (
            <label key={s.id}>
              <span>{pick(s.q, locale)}</span>
              <select value={answers[s.id]} onChange={(e) => setAnswers({ ...answers, [s.id]: e.target.value })}>
                {s.options.map((o) => (
                  <option key={o.v} value={o.v}>
                    {pick(o.l, locale)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <noscript>
          <p className="block-note">{pick(t.noscript, locale)}</p>
        </noscript>
        <div className="or-split">
          <div className="or-code">
            <h3>{pick(t.code, locale)}</h3>
            <dl>
              <dt>{pick(t.format, locale)}</dt>
              <dd>
                {pick(r.s.title, locale)}
                {r.inferred ? ` (${pick(t.inferred, locale)})` : ""}
              </dd>
              <dt>{pick(t.price, locale)}</dt>
              <dd>{num(r.s.price)}</dd>
              <dt>{pick(t.time, locale)}</dt>
              <dd>{pick(r.s.time, locale)}</dd>
              <dt>{pick(t.budget, locale)}</dt>
              <dd>{pick(fits[r.budgetFit], locale)}</dd>
              <dt>{pick(t.deadline, locale)}</dt>
              <dd>{pick(fits[r.deadlineFit], locale)}</dd>
              {r.alternative ? (
                <>
                  <dt>{pick(t.alt, locale)}</dt>
                  <dd>
                    {pick(services[r.alternative].title, locale)}, {num(services[r.alternative].price)}
                  </dd>
                </>
              ) : null}
              <dt>{pick(t.score, locale)}</dt>
              <dd>
                {sum} = {r.score}
              </dd>
              <dt>{pick(t.label, locale)}</dt>
              <dd>
                <b className="or-temp">{pick(temps[r.temperature], locale)}</b>
              </dd>
            </dl>
          </div>
          <div className="or-ai">
            <h3>{pick(t.ai, locale)}</h3>
            <p>{pick(t.aiGets, locale)}</p>
            <p>{pick(t.aiWrites, locale)}</p>
            <p>{pick(t.aiLead, locale)}</p>
            <p>{pick(t.aiNone, locale)}</p>
          </div>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
