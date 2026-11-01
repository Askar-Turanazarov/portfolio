"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** Presets from src/config/modes.ts. Replies from the project's scripted demo recruiter, src/llm/mock.ts. */
const modes = [
  {
    from: 0,
    to: 24,
    min: 1,
    timer: 0,
    interrupts: false,
    name: { en: "Warm-up", ru: "Разминка", uz: "Razminka" },
    tag: { en: "Helps and encourages", ru: "Помогает и подбадривает", uz: "Yordam beradi va dalda qiladi" },
  },
  {
    from: 25,
    to: 49,
    min: 2,
    timer: 0,
    interrupts: false,
    name: { en: "Regular call", ru: "Обычный созвон", uz: "Oddiy qo‘ng‘iroq" },
    tag: { en: "Like most recruiters", ru: "Как большинство HR", uz: "Ko‘pchilik HR kabi" },
  },
  {
    from: 50,
    to: 79,
    min: 3,
    timer: 45,
    interrupts: false,
    name: { en: "Real assessment", ru: "Реальная оценка", uz: "Haqiqiy baholash" },
    tag: { en: "Strict, looks for weak spots", ru: "Строгий, ищет слабости", uz: "Qattiq, zaif joyni qidiradi" },
  },
  {
    from: 80,
    to: 100,
    min: 3,
    timer: 25,
    interrupts: true,
    name: { en: "Hardcore", ru: "Хардкор", uz: "Xardkor" },
    tag: { en: "Pushes and provokes", ru: "Давит и провоцирует", uz: "Bosim o‘tkazadi va qo‘zg‘atadi" },
  },
] satisfies { from: number; to: number; min: number; timer: number; interrupts: boolean; name: L10n; tag: L10n }[];

const answer: L10n = {
  en: "We rewrote the service there and it got better",
  ru: "Мы там переписали сервис и стало лучше",
  uz: "U yerda servisni qayta yozdik va yaxshi bo‘ldi",
};
const detail: L10n = { en: "rewrote service got better", ru: "переписали сервис стало лучше", uz: "qayta yozdik servisni yaxshi bo‘ldi" };

const probes: ((d: string) => L10n)[] = [
  (d) => ({
    en: `You said “${d}”. What exactly did you do yourself, and not the team?`,
    ru: `Вы сказали «${d}» — раскройте, что конкретно делали именно вы, а не команда?`,
    uz: `Siz «${d}» dedingiz. Jamoa emas, aynan siz nima qildingiz?`,
  }),
  (d) => ({
    en: `I'll latch onto “${d}”. What was the measurable result and how did you calculate it?`,
    ru: `Зацеплюсь за «${d}». Какой был измеримый результат и как вы его считали?`,
    uz: `«${d}» ga e’tibor qarataman. O‘lchanadigan natija qanday edi va uni qanday hisobladingiz?`,
  }),
  (d) => ({
    en: `About “${d}”: what went wrong? Nothing goes completely smoothly.`,
    ru: `Про «${d}» — а что пошло не так? Совсем гладко не бывает.`,
    uz: `«${d}» haqida: nima noto‘g‘ri ketdi? Butunlay silliq bo‘lmaydi.`,
  }),
];
const nextTopic: L10n = {
  en: "All right, moving on. Tell me about a time you disagreed with your manager's decision.",
  ru: "Хорошо, идём дальше. Расскажите про ситуацию, где вы не согласились с решением руководителя.",
  uz: "Yaxshi, davom etamiz. Rahbaringiz qaroriga rozi bo‘lmagan holatni aytib bering.",
};

const t = {
  heading: { en: "Toughness", ru: "Жёсткость", uz: "Qattiqlik" },
  intro: {
    en: "A slider from 0 to 100 with four anchors. It can be moved mid-interview, and the recruiter adjusts from the next reply.",
    ru: "Ползунок от 0 до 100 с четырьмя опорами. Его можно двигать во время встречи, рекрутёр подстроится со следующей реплики.",
    uz: "0 dan 100 gacha to‘rt tayanchli slayder. Uni suhbat paytida surish mumkin, rekruter keyingi javobdan moslashadi.",
  },
  label: { en: "Toughness", ru: "Жёсткость", uz: "Qattiqlik" },
  min: { en: "Follow-ups before a new topic", ru: "Уточнений до новой темы", uz: "Yangi mavzugacha aniqlashtirishlar" },
  timer: { en: "Time to think", ru: "Время на обдумывание", uz: "O‘ylash vaqti" },
  noTimer: { en: "none", ru: "нет", uz: "yo‘q" },
  sec: { en: "s", ru: "с", uz: "s" },
  interrupts: { en: "Interrupts", ru: "Перебивает", uz: "Gapni bo‘ladi" },
  yes: { en: "yes", ru: "да", uz: "ha" },
  no: { en: "no", ru: "нет", uz: "yo‘q" },
  you: { en: "Candidate", ru: "Кандидат", uz: "Nomzod" },
  hr: { en: "Recruiter", ru: "Рекрутёр", uz: "Rekruter" },
  locked: {
    en: "mustFollowUp = true: a new topic is forbidden",
    ru: "mustFollowUp = true: новая тема запрещена",
    uz: "mustFollowUp = true: yangi mavzu taqiqlangan",
  },
  free: { en: "mustFollowUp = false", ru: "mustFollowUp = false", uz: "mustFollowUp = false" },
  note: {
    en: "These lines are real templates from the demo mode, which works without a key and speaks Russian; EN and UZ here are translated. The demo picks a template by a hash of the answer, while here they go in order. With a key, Gemini writes the replies, and the same rule holds it to the topic. A concrete answer can close the topic early, after at least one follow-up.",
    ru: "Реплики это настоящие шаблоны демо-режима, который работает без ключа. Демо выбирает шаблон по хешу ответа, здесь они идут по порядку. С ключом реплики пишет Gemini, а к теме его держит то же правило. Конкретный ответ может закрыть тему раньше, но не раньше одного уточнения.",
    uz: "Bu iboralar kalitsiz ishlaydigan demo rejimning haqiqiy shablonlari, u ruscha gapiradi, bu yerda tarjima qilingan. Demo shablonni javob xeshi bo‘yicha tanlaydi, bu yerda ular tartib bilan keladi. Kalit bilan javoblarni Gemini yozadi, uni mavzuda o‘sha qoida ushlab turadi. Aniq javob mavzuni kamida bitta aniqlashtirishdan keyin oldinroq yopishi mumkin.",
  },
  analysisTitle: { en: "Every answer makes two calls", ru: "Каждый ответ это два вызова", uz: "Har bir javob ikki chaqiruv" },
  analysis: {
    en: "1. buildAnalystPrompt: silent analysis with structured output. Facts, vague spots, contradictions, red flags, 2 or 3 follow-ups.\n2. buildInterviewerPrompt: the reply, which must build on a concrete detail from the last answer.",
    ru: "1. buildAnalystPrompt: молчаливый анализ со структурированным выводом. Факты, размытые места, противоречия, красные флаги, 2–3 уточнения.\n2. buildInterviewerPrompt: реплика, которая обязана расти из конкретной детали последнего ответа.",
    uz: "1. buildAnalystPrompt: tuzilgan chiqishli jim tahlil. Faktlar, noaniq joylar, ziddiyatlar, qizil bayroqlar, 2–3 aniqlashtirish.\n2. buildInterviewerPrompt: oxirgi javobning aniq detalidan o‘sishi shart bo‘lgan javob.",
  },
} satisfies Record<string, L10n>;

/** SSR starts at 65, Real assessment; the noscript table holds all four modes. */
export default function HrDial({ locale }: { locale: Locale }) {
  const [value, setValue] = useState(65);
  const mode = modes.find((m) => value >= m.from && value <= m.to) ?? modes[2];
  const d = pick(detail, locale);

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="hr-dial">
          <label htmlFor="hr-range">
            {pick(t.label, locale)}: <output>{value}</output> · <b>{pick(mode.name, locale)}</b> · {pick(mode.tag, locale)}
          </label>
          <input
            id="hr-range"
            type="range"
            min={0}
            max={100}
            value={value}
            list="hr-anchors"
            onChange={(e) => setValue(Number(e.target.value))}
          />
          <datalist id="hr-anchors">
            <option value={15} />
            <option value={40} />
            <option value={65} />
            <option value={90} />
          </datalist>
          <dl className="hr-facts">
            <div>
              <dt>{pick(t.min, locale)}</dt>
              <dd>{mode.min}</dd>
            </div>
            <div>
              <dt>{pick(t.timer, locale)}</dt>
              <dd>{mode.timer ? `${mode.timer} ${pick(t.sec, locale)}` : pick(t.noTimer, locale)}</dd>
            </div>
            <div>
              <dt>{pick(t.interrupts, locale)}</dt>
              <dd>{pick(mode.interrupts ? t.yes : t.no, locale)}</dd>
            </div>
          </dl>
        </div>
        <ol className="hr-chat" key={mode.min}>
          <li data-who="you">
            <small>{pick(t.you, locale)}</small>
            {pick(answer, locale)}
          </li>
          {probes.slice(0, mode.min).map((probe, i) => (
            <li data-who="hr" key={i}>
              <small>{pick(t.hr, locale)}</small>
              {pick(probe(d), locale)}
              <code>{pick(t.locked, locale)}</code>
            </li>
          ))}
          <li data-who="hr">
            <small>{pick(t.hr, locale)}</small>
            {pick(nextTopic, locale)}
            <code>{pick(t.free, locale)}</code>
          </li>
        </ol>
        <noscript>
          <table className="measures">
            <tbody>
              {modes.map((m) => (
                <tr key={m.from}>
                  <th scope="row">
                    {pick(m.name, locale)} ({m.from}–{m.to})
                  </th>
                  <td className="val">{m.min}</td>
                  <td>{pick(m.tag, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </noscript>
        <p className="block-note">{pick(t.note, locale)}</p>
        <h3 className="hr-h3">{pick(t.analysisTitle, locale)}</h3>
        <pre className="hr-mech">{pick(t.analysis, locale)}</pre>
      </div>
    </section>
  );
}
