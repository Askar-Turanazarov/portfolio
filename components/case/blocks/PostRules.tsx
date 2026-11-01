"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Platform = { id: string; name: string; tags: [number, number]; rule: L10n; length: L10n };

/** Every rule restates NETWORK_GUIDE in lib/prompt.ts; the prompt itself is in Russian. */
const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    tags: [8, 15],
    rule: {
      en: "Short paragraphs, emoji where they fit, lively visual language.",
      ru: "Короткие абзацы, эмодзи по делу, живой визуальный язык.",
      uz: "Qisqa xatboshilar, o‘rinli emoji, jonli vizual til.",
    },
    length: { en: "up to ~1,500 characters", ru: "до ~1500 символов", uz: "~1500 belgigacha" },
  },
  {
    id: "telegram",
    name: "Telegram",
    tags: [2, 5],
    rule: {
      en: "A bit more developed and to the point, moderate emoji. Hashtags are for channel navigation rather than algorithms, and are optional.",
      ru: "Чуть более развёрнуто и по существу, эмодзи умеренно. Хэштеги скорее для навигации по каналу, чем для алгоритмов, и не обязательны.",
      uz: "Biroz kengroq va mazmunli, emoji me’yorida. Xeshteglar algoritmlardan ko‘ra kanal bo‘ylab harakat uchun, majburiy emas.",
    },
    length: { en: "free", ru: "свободная", uz: "erkin" },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    tags: [3, 5],
    rule: {
      en: "Businesslike but alive, one or two emoji at most, short blocks of meaning separated by line breaks. Hashtags are professional.",
      ru: "Деловой, но живой стиль, максимум 1–2 эмодзи, короткие смысловые блоки с переносами строк. Хэштеги профессиональные.",
      uz: "Ishchan, lekin jonli uslub, ko‘pi bilan 1–2 emoji, qator bilan ajratilgan qisqa ma’noli bloklar. Xeshteglar professional.",
    },
    length: { en: "not set", ru: "не задана", uz: "belgilanmagan" },
  },
  {
    id: "youtube",
    name: "YouTube",
    tags: [3, 6],
    rule: {
      en: "A video description: a catchy title, then key moments and what the viewer gains. The call to action is subscribe, like or watch to the end.",
      ru: "Описание к видео: цепляющее название, затем ключевые моменты и польза ролика. Призыв: подписаться, поставить лайк, посмотреть до конца.",
      uz: "Video tavsifi: qiziqarli nom, keyin asosiy lahzalar va rolik foydasi. Chaqiriq: obuna bo‘lish, layk bosish, oxirigacha ko‘rish.",
    },
    length: { en: "title up to 100 characters", ru: "название до 100 символов", uz: "nom 100 belgigacha" },
  },
  {
    id: "threads",
    name: "Threads",
    tags: [0, 3],
    rule: {
      en: "Conversational and brief, like a passing thought. Minimal emoji.",
      ru: "Разговорный, лаконичный тон, как живой пост-мысль. Минимум эмодзи.",
      uz: "So‘zlashuv ohangida va ixcham, jonli post-fikr kabi. Emoji minimal.",
    },
    length: { en: "short", ru: "короткий текст", uz: "qisqa matn" },
  },
  {
    id: "x",
    name: "X",
    tags: [1, 2],
    rule: {
      en: "As compressed as possible, no filler. The title field still gets a short hook, so the parser has all four fields.",
      ru: "Максимально сжато, без воды. Поле заголовка всё равно заполняется коротким хуком.",
      uz: "Imkon qadar siqiq, ortiqcha so‘zsiz. Sarlavha maydoni baribir qisqa ilgak bilan to‘ldiriladi.",
    },
    length: { en: "~280 characters for the whole post", ru: "~280 символов на весь пост", uz: "butun post uchun ~280 belgi" },
  },
  {
    id: "facebook",
    name: "Facebook",
    tags: [3, 8],
    rule: {
      en: "Friendly, with moderate emoji.",
      ru: "Дружелюбная подача, эмодзи умеренно.",
      uz: "Do‘stona uslub, emoji me’yorida.",
    },
    length: { en: "a little longer than Instagram", ru: "чуть длиннее, чем в Instagram", uz: "Instagram’dan biroz uzunroq" },
  },
  {
    id: "tiktok",
    name: "TikTok",
    tags: [3, 6],
    rule: {
      en: "A video caption: energetic and conversational, with a strong hook in the first line. Hashtags feel like trends.",
      ru: "Подпись к видео: энергичный разговорный стиль, сильный хук в первой строке. Хэштеги трендовые по духу.",
      uz: "Video izohi: g‘ayratli so‘zlashuv uslubi, birinchi qatorda kuchli ilgak. Xeshteglar trend ruhida.",
    },
    length: { en: "very short", ru: "очень короткий текст", uz: "juda qisqa matn" },
  },
];

const TAG_SCALE = 15;

const t = {
  heading: { en: "Eight platforms", ru: "Восемь площадок", uz: "Sakkizta platforma" },
  intro: {
    en: "The bars show how many hashtags the prompt asks for on each network, from none to fifteen. Pick one to read the rest of its rule.",
    ru: "Полосы показывают, сколько хэштегов промпт просит для каждой сети, от нуля до пятнадцати. Выберите сеть, чтобы прочитать остальное правило.",
    uz: "Chiziqlar prompt har bir tarmoq uchun nechta xeshteg so‘rashini ko‘rsatadi, noldan o‘n beshgacha. Qoidaning qolganini o‘qish uchun tarmoqni tanlang.",
  },
  style: { en: "Style", ru: "Стиль", uz: "Uslub" },
  length: { en: "Length", ru: "Длина", uz: "Uzunlik" },
  hashtags: { en: "Hashtags", ru: "Хэштеги", uz: "Xeshteglar" },
  note: {
    en: "These are the rules the prompt gives the model, not measurements of what it writes. The prompt is in Russian, and the English and Uzbek here are my translations.",
    ru: "Это правила, которые промпт даёт модели, а не замеры того, что она пишет.",
    uz: "Bu prompt modelga beradigan qoidalar, model yozgan narsaning o‘lchovi emas. Prompt ruscha, bu yerdagi o‘zbekcha matn mening tarjimam.",
  },
  langHeading: { en: "Which language the post comes out in", ru: "На каком языке выйдет пост", uz: "Post qaysi tilda chiqadi" },
  langNote: {
    en: "The first step is the only one left to the model: the prompt tells it to judge by the topic's own text, not by brand names or stray foreign words.",
    ru: "Первый шаг единственный оставлен модели: промпт просит судить по самому тексту темы, а не по брендам и отдельным иноязычным словам.",
    uz: "Birinchi qadam modelga qoldirilgan yagona qadam: prompt mavzuning o‘z matniga qarab baholashni so‘raydi, brendlar va alohida chet so‘zlarga qarab emas.",
  },
} satisfies Record<string, L10n>;

const steps: L10n[] = [
  {
    en: "The topic is clearly written in another language: the post follows the topic.",
    ru: "Тема явно написана на другом языке: пост идёт на языке темы.",
    uz: "Mavzu aniq boshqa tilda yozilgan: post mavzu tilida bo‘ladi.",
  },
  {
    en: "Otherwise, the language picked for the post.",
    ru: "Иначе язык, выбранный для поста.",
    uz: "Aks holda, post uchun tanlangan til.",
  },
  {
    en: "Nothing picked: the interface language, and it keeps following the interface.",
    ru: "Ничего не выбрано: язык интерфейса, и он продолжает за ним следовать.",
    uz: "Hech narsa tanlanmagan: interfeys tili, va u interfeysga ergashishda davom etadi.",
  },
];

export default function PostRules({ locale }: { locale: Locale }) {
  const [active, setActive] = useState("instagram");
  const range = ([a, b]: [number, number]) => `${a}–${b}`;

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <noscript>
          <style>{`.pc-panel[hidden]{display:block}.pc-list button{cursor:default}`}</style>
        </noscript>
        <div className="pc-stage">
          <ul className="pc-list">
            {platforms.map((p) => (
              <li key={p.id}>
                <button type="button" aria-pressed={active === p.id} onClick={() => setActive(p.id)}>
                  <span>{p.name}</span>
                  <span className="pc-track" aria-hidden="true">
                    <i
                      style={{
                        left: `${(p.tags[0] / TAG_SCALE) * 100}%`,
                        width: `${((p.tags[1] - p.tags[0]) / TAG_SCALE) * 100}%`,
                      }}
                    />
                  </span>
                  <span className="pc-num">{range(p.tags)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="pc-panels" aria-live="polite">
            {platforms.map((p) => (
              <div className="pc-panel" key={p.id} hidden={active !== p.id}>
                <h3>{p.name}</h3>
                <dl>
                  <dt>{pick(t.style, locale)}</dt>
                  <dd>{pick(p.rule, locale)}</dd>
                  <dt>{pick(t.length, locale)}</dt>
                  <dd>{pick(p.length, locale)}</dd>
                  <dt>{pick(t.hashtags, locale)}</dt>
                  <dd>{range(p.tags)}</dd>
                </dl>
              </div>
            ))}
          </div>
        </div>
        <p className="block-note">{pick(t.note, locale)}</p>
        <h3 className="pc-h3">{pick(t.langHeading, locale)}</h3>
        <ol className="pc-steps">
          {steps.map((s, i) => (
            <li key={i}>{pick(s, locale)}</li>
          ))}
        </ol>
        <p className="block-note">{pick(t.langNote, locale)}</p>
      </div>
    </section>
  );
}
