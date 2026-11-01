"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Row = { name: L10n; amount: number; recurring?: boolean };
type Month = { id: string; name: L10n; incomes: Row[]; expenses: Row[] };

const salary: L10n = { en: "Salary", ru: "Зарплата", uz: "Oylik" };
const freelance: L10n = { en: "Freelance", ru: "Фриланс", uz: "Frilans" };
const rent: L10n = { en: "Rent", ru: "Аренда", uz: "Ijara" };
const groceries: L10n = { en: "Groceries", ru: "Продукты", uz: "Oziq-ovqat" };
const utilities: L10n = { en: "Utilities", ru: "Коммуналка", uz: "Kommunal" };
const transport: L10n = { en: "Transport", ru: "Транспорт", uz: "Transport" };
const cafes: L10n = { en: "Cafes", ru: "Кафе и рестораны", uz: "Kafe va restoranlar" };
const subs: L10n = { en: "Subscriptions", ru: "Подписки", uz: "Obunalar" };
const travel: L10n = { en: "Travel", ru: "Путешествия", uz: "Sayohatlar" };

/** Example data, the same October as on the frames above. */
const months: Month[] = [
  {
    id: "oct",
    name: { en: "October", ru: "Октябрь", uz: "Oktabr" },
    incomes: [
      { name: salary, amount: 9000000 },
      { name: freelance, amount: 1500000 },
    ],
    expenses: [
      { name: rent, amount: 3500000, recurring: true },
      { name: groceries, amount: 1850000 },
      { name: cafes, amount: 640000 },
      { name: utilities, amount: 420000, recurring: true },
      { name: transport, amount: 380000 },
      { name: subs, amount: 150000, recurring: true },
    ],
  },
  {
    id: "sep",
    name: { en: "September", ru: "Сентябрь", uz: "Sentabr" },
    incomes: [{ name: salary, amount: 9000000 }],
    expenses: [
      { name: rent, amount: 3500000, recurring: true },
      { name: travel, amount: 2200000 },
      { name: groceries, amount: 1620000 },
      { name: utilities, amount: 510000, recurring: true },
      { name: cafes, amount: 410000 },
      { name: transport, amount: 300000 },
      { name: subs, amount: 150000, recurring: true },
    ],
  },
];

const t = {
  heading: { en: "The month", ru: "Месяц", uz: "Oy" },
  intro: {
    en: "The same sums the dashboard gets from its summary endpoints, set as a ledger.",
    ru: "Те же суммы, что дашборд получает от конечных точек сводки, набранные ведомостью.",
    uz: "Dashboard svodka endpointlaridan oladigan o‘sha summalar, vedomost ko‘rinishida.",
  },
  sample: { en: "Example, not real money.", ru: "Пример, не настоящие деньги.", uz: "Namuna, haqiqiy pul emas." },
  incomes: { en: "Income", ru: "Доходы", uz: "Daromadlar" },
  expenses: { en: "Expenses", ru: "Расходы", uz: "Xarajatlar" },
  balance: { en: "Balance", ru: "Баланс", uz: "Balans" },
  recurring: { en: "of which recurring", ru: "из них регулярные", uz: "shundan doimiy" },
  mark: { en: "recurring", ru: "регулярный", uz: "doimiy" },
  sum: { en: "UZS", ru: "сум", uz: "so‘m" },
  chart: { en: "Share of expenses by category", ru: "Доли расходов по категориям", uz: "Xarajatlarning kategoriyalar bo‘yicha ulushi" },
} satisfies Record<string, L10n>;

const money = (n: number) => n.toLocaleString("en-US").replace(/,/g, " ");
const total = (rows: Row[]) => rows.reduce((s, r) => s + r.amount, 0);

function Donut({ rows, label }: { rows: Row[]; label: string }) {
  const sum = total(rows);
  const r = 40;
  const len = 2 * Math.PI * r;
  return (
    <svg className="ft-donut" viewBox="0 0 100 100" role="img" aria-label={label}>
      {rows.map((row, i) => {
        const part = (row.amount / sum) * len;
        const at = (total(rows.slice(0, i)) / sum) * len;
        return <circle key={i} cx="50" cy="50" r={r} fill="none" strokeWidth="16" stroke="var(--ink)" strokeOpacity={1 - (i / rows.length) * 0.82} strokeDasharray={`${Math.max(part - 0.8, 0)} ${len}`} strokeDashoffset={-at} transform="rotate(-90 50 50)" />;
      })}
    </svg>
  );
}

export default function MonthLedger({ locale }: { locale: Locale }) {
  const [id, setId] = useState(months[0].id);
  const month = months.find((m) => m.id === id) ?? months[0];
  const inc = total(month.incomes);
  const exp = total(month.expenses);
  const rec = total(month.expenses.filter((r) => r.recurring));

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <noscript>
          <style>{".ft-switch { display: none; }"}</style>
        </noscript>
        <div className="ft-switch">
          {months.map((m) => (
            <button key={m.id} type="button" aria-pressed={id === m.id} onClick={() => setId(m.id)}>
              {pick(m.name, locale)} 2026
            </button>
          ))}
        </div>
        <div className="ft-sheet" key={month.id}>
          <div className="ft-cols">
            <table>
              <caption>
                {pick(month.name, locale)} 2026, {pick(t.sum, locale)}
              </caption>
              <tbody>
                <tr className="ft-head">
                  <th scope="rowgroup" colSpan={2}>
                    {pick(t.incomes, locale)}
                  </th>
                </tr>
                {month.incomes.map((r) => (
                  <tr key={r.name.en}>
                    <th scope="row">{pick(r.name, locale)}</th>
                    <td>+{money(r.amount)}</td>
                  </tr>
                ))}
                <tr className="ft-head">
                  <th scope="rowgroup" colSpan={2}>
                    {pick(t.expenses, locale)}
                  </th>
                </tr>
                {month.expenses.map((r) => (
                  <tr key={r.name.en}>
                    <th scope="row">
                      {pick(r.name, locale)}
                      {r.recurring && <small> ↻ {pick(t.mark, locale)}</small>}
                    </th>
                    <td>−{money(r.amount)}</td>
                  </tr>
                ))}
                <tr className="ft-sub">
                  <th scope="row">{pick(t.recurring, locale)}</th>
                  <td>−{money(rec)}</td>
                </tr>
                <tr className="ft-total">
                  <th scope="row">{pick(t.balance, locale)}</th>
                  <td>{money(inc - exp)}</td>
                </tr>
              </tbody>
            </table>
            <Donut rows={month.expenses} label={pick(t.chart, locale)} />
          </div>
        </div>
        <p className="block-note">{pick(t.sample, locale)}</p>
      </div>
    </section>
  );
}
