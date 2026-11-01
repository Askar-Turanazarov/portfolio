"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Theme = "glass" | "skeuo" | "clay";

/** The "Sewing Classes" entry of DEMO_EXAMPLES in assets/i18n.js, as written there. */
const post = {
  niche: { en: "Sewing Classes", ru: "Курсы кройки и шитья", uz: "Tikuvchilik kurslari" },
  hook: {
    en: "Tired of clothes that almost fit but never quite feel right?",
    ru: "Покупаете одежду, которая почти подходит, но не сидит идеально?",
    uz: "Deyarli mos keladigan, lekin hech qachon o'zingizga aynan yarashmaydigan kiyimlardan charchadingizmi?",
  },
  teaser: {
    en: "In six sessions you'll take measurements, draft a basic pattern, and sew your first piece by hand.",
    ru: "За шесть занятий вы снимете мерки, построите базовую выкройку и сошьёте первую вещь своими руками.",
    uz: "Olti darsda o'lchov olishni, oddiy lekalo tuzishni va o'z qo'lingiz bilan birinchi buyumni tikishni o'rganasiz.",
  },
  tags: {
    en: "#Sewing #MakeYourOwn #NewHobby",
    ru: "#КройкаИШитьё #ШьюСама #Хобби",
    uz: "#Tikuvchilik #OzimTikaman #YangiHobbi",
  },
} satisfies Record<string, L10n>;

const themes: { id: Theme; name: L10n; css: string[] }[] = [
  {
    id: "glass",
    name: { en: "Glass", ru: "Стекло", uz: "Shisha" },
    css: [
      "background: rgba(255,255,255,.32);",
      "backdrop-filter: blur(36px) saturate(185%);",
      "border: 1.5px solid transparent;",
      "box-shadow: 0 26px 46px -14px rgba(75,63,176,.5), inset 0 1px 0 rgba(255,255,255,.45);",
    ],
  },
  {
    id: "skeuo",
    name: { en: "Skeuomorphism", ru: "Скевоморфизм", uz: "Skevomorfizm" },
    css: [
      "background: #FBF6EA;",
      "background-image: url(feTurbulence noise), radial-gradient(…);",
      "border: 2px solid #C9B896;",
      "::before { border: 1px dashed rgba(139,111,71,.35); inset: 8px; }",
    ],
  },
  {
    id: "clay",
    name: { en: "Claymorphism", ru: "Клеймоморфизм", uz: "Kleymorfizm" },
    css: [
      "background: #F1EEFC;",
      "background-image: linear-gradient(145deg, rgba(255,255,255,.7), rgba(255,255,255,0) 50%);",
      "border-radius: 28px;",
      "box-shadow: 8px 8px 0 0 rgba(140,127,232,.22), 0 22px 40px -14px rgba(76,63,176,.4);",
    ],
  },
];

const t = {
  heading: { en: "Three materials", ru: "Три материала", uz: "Uchta material" },
  intro: {
    en: "One post card with the project's real CSS. The buttons change one attribute, and the card and its backdrop follow.",
    ru: "Одна карточка поста с настоящим CSS проекта. Кнопки меняют один атрибут, а за ним идут карточка и её фон.",
    uz: "Loyihaning haqiqiy CSS’i bilan bitta post kartasi. Tugmalar bitta atributni o‘zgartiradi, karta va uning foni unga ergashadi.",
  },
  note: {
    en: "The values are copied from assets/styles.css and scoped to this block. The 520 ms transition is also the project's. The aurora behind the glass theme is left out, and the post is one of the project's demo examples, not a generated one.",
    ru: "Значения скопированы из assets/styles.css и ограничены этим блоком. Переход 520 мс тоже из проекта. Аврора за стеклянной темой не перенесена, а пост это один из демо-примеров проекта, а не сгенерированный.",
    uz: "Qiymatlar assets/styles.css’dan ko‘chirilgan va shu blok bilan cheklangan. 520 ms o‘tish ham loyihadan. Shisha mavzu ortidagi avrora ko‘chirilmagan, post esa generatsiya qilingan emas, loyihaning demo namunalaridan biri.",
  },
} satisfies Record<string, L10n>;

function Stage({ theme, locale }: { theme: (typeof themes)[number]; locale: Locale }) {
  return (
    <div className="th-stage" data-th={theme.id}>
      <article className="th-card">
        <div className="th-channel">
          <span className="th-avatar" aria-hidden="true">
            {pick(post.niche, locale).charAt(0)}
          </span>
          <span className="th-niche">{pick(post.niche, locale)}</span>
        </div>
        <p className="th-hook">{pick(post.hook, locale)}</p>
        <p className="th-body">{pick(post.teaser, locale)}</p>
        <p className="th-tags">{pick(post.tags, locale)}</p>
      </article>
    </div>
  );
}

function Css({ theme }: { theme: (typeof themes)[number] }) {
  return (
    <pre className="th-css" tabIndex={0}>
      <code>{theme.css.join("\n")}</code>
    </pre>
  );
}

export default function ThreeMaterials({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Theme>("glass");
  const theme = themes.find((x) => x.id === active) ?? themes[0];

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="th-switch">
          {themes.map((x) => (
            <button key={x.id} type="button" aria-pressed={active === x.id} onClick={() => setActive(x.id)}>
              {pick(x.name, locale)}
            </button>
          ))}
        </div>
        <div className="th-row">
          <Stage theme={theme} locale={locale} />
          <Css theme={theme} />
        </div>
        <noscript>
          {themes
            .filter((x) => x.id !== "glass")
            .map((x) => (
              <div className="th-row" key={x.id}>
                <Stage theme={x} locale={locale} />
                <Css theme={x} />
              </div>
            ))}
        </noscript>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
