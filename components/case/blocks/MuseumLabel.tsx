"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Field = { column: string; label: L10n; value: string };
type Exhibit = { id: string; kind: L10n; name: string; fields: Field[] };

const dimensions: L10n = { en: "Dimensions", ru: "Габариты", uz: "O‘lchamlar" };
const weight: L10n = { en: "Weight", ru: "Масса", uz: "Massa" };
const flight: L10n = { en: "First flight", ru: "Первый полёт", uz: "Birinchi parvoz" };
const maker: L10n = { en: "Manufacturer", ru: "Производитель", uz: "Ishlab chiqaruvchi" };
const founded: L10n = { en: "Founded", ru: "Год основания", uz: "Tashkil etilgan yil" };

/** Rows of the public exhibits table on the live site, values as they are stored. */
const exhibits: Exhibit[] = [
  {
    id: "an22",
    kind: { en: "Plane", ru: "Самолёт", uz: "Samolyot" },
    name: "Антонов Ан-22 \"Антей\"",
    fields: [
      { column: "dimensions", label: dimensions, value: "Длина: 57,31 м Размах крыла: 64,40 м" },
      { column: "weight", label: weight, value: "255 000 кг" },
      { column: "first_flight", label: flight, value: "27 февраля 1965 года" },
      { column: "manufacturer", label: maker, value: "ТАПОиЧ, Ташкент" },
    ],
  },
  {
    id: "il76",
    kind: { en: "Plane", ru: "Самолёт", uz: "Samolyot" },
    name: "Ильюшин Ил-76",
    fields: [
      { column: "dimensions", label: dimensions, value: "Длина 46.5 м, размах крыла 50.5 м" },
      { column: "weight", label: weight, value: "190 тонн" },
      { column: "first_flight", label: flight, value: "1971" },
      { column: "manufacturer", label: maker, value: "ТАПОиЧ, Ташкент" },
    ],
  },
  {
    id: "mi8",
    kind: { en: "Helicopter", ru: "Вертолёт", uz: "Vertolyot" },
    name: "Вертолёт \"Ми-8\"",
    fields: [
      { column: "dimensions", label: dimensions, value: "Длина 18.2 м, диаметр несущего винта 21.3 м" },
      { column: "weight", label: weight, value: "7.2 т" },
      { column: "first_flight", label: flight, value: "1961" },
      { column: "manufacturer", label: maker, value: "КВЗ / ОКБ Миля" },
    ],
  },
  {
    id: "tapoich",
    kind: { en: "Aircraft plant", ru: "Авиазавод", uz: "Aviazavod" },
    name: "Ташкентское авиационное производственное объединение им Чкалова",
    fields: [
      { column: "first_flight", label: founded, value: "1932" },
      { column: "manufacturer", label: maker, value: "ТАПОиЧ" },
    ],
  },
];

const t = {
  heading: { en: "The exhibit label", ru: "Этикетка экспоната", uz: "Eksponat yorlig‘i" },
  intro: {
    en: "Four of the eight rows in the exhibits table. Beside each line is the column it comes from, and an admin changes it in a form, without a new build.",
    ru: "Четыре из восьми строк таблицы exhibits. Рядом с каждой подписью колонка, из которой она взята: администратор меняет её в форме, без новой сборки.",
    uz: "exhibits jadvalidagi sakkiz qatordan to‘rttasi. Har bir yozuv yonida u olingan ustun: administrator uni yangi yig‘ishsiz formada o‘zgartiradi.",
  },
  note: {
    en: "The values are shown as stored, in Russian, because that's the language of the site. The plant's founding year sits in first_flight, a column reused when plants were added. I left out the photos: they are hotlinked from other sites, and I haven't checked their rights.",
    ru: "Значения показаны как в базе, по-русски: это язык сайта. Год основания завода лежит в first_flight, колонку использовали повторно, когда добавили заводы. Фотографий здесь нет: они подгружаются с чужих сайтов, а права на них я не проверял.",
    uz: "Qiymatlar bazadagidek, ruscha ko‘rsatilgan: bu saytning tili. Zavodning tashkil etilgan yili first_flight’da turadi, zavodlar qo‘shilganda ustun qayta ishlatilgan. Suratlar yo‘q: ular boshqa saytlardan yuklanadi, huquqlarini esa tekshirmaganman.",
  },
} satisfies Record<string, L10n>;

function Label({ item, locale }: { item: Exhibit; locale: Locale }) {
  return (
    <article className="wh-label">
      <p className="wh-kind">{pick(item.kind, locale)}</p>
      <h3 lang="ru">{item.name}</h3>
      <dl>
        {item.fields.map((f) => (
          <div key={f.column}>
            <dt>{pick(f.label, locale)}</dt>
            <dd lang="ru">{f.value}</dd>
            <dd className="wh-col">
              <code>{f.column}</code>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function MuseumLabel({ locale }: { locale: Locale }) {
  const [id, setId] = useState(exhibits[0].id);
  const item = exhibits.find((e) => e.id === id) ?? exhibits[0];

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <noscript>
          <style>{".wh-switch { display: none; }"}</style>
        </noscript>
        <div className="wh-switch">
          {exhibits.map((e) => (
            <button key={e.id} type="button" aria-pressed={id === e.id} onClick={() => setId(e.id)} lang="ru">
              {e.id === "tapoich" ? "ТАПОиЧ" : e.name.replace(/^(Антонов|Ильюшин|Вертолёт) /, "").replace(/ ".*$/, "").replace(/"/g, "")}
            </button>
          ))}
        </div>
        <div className="wh-fade" key={item.id}>
          <Label item={item} locale={locale} />
        </div>
        <noscript>
          {exhibits
            .filter((e) => e.id !== exhibits[0].id)
            .map((e) => (
              <Label key={e.id} item={e} locale={locale} />
            ))}
        </noscript>
        <p className="block-note">{pick(t.note, locale)}</p>
      </div>
    </section>
  );
}
