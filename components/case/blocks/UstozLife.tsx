"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Phase = { status: "active" | "past_due" | "expired"; access: L10n; event: L10n };

const fullAccess: L10n = { en: "Plus, in full", ru: "Plus, полностью", uz: "Plus, to‘liq" };

/** Rules from src/lib/billing/scheduler.ts, subscription.ts and tests/billing-cycle.test.ts. Day 0 is the last paid day. */
const phases: { from: number; to: number; phase: Phase }[] = [
  {
    from: -4,
    to: -3,
    phase: {
      status: "active",
      access: fullAccess,
      event: {
        en: "A reminder says when and how much the card will be charged.",
        ru: "Напоминание: когда и сколько спишется с карты.",
        uz: "Eslatma: kartadan qachon va qancha yechiladi.",
      },
    },
  },
  {
    from: -2,
    to: -1,
    phase: {
      status: "past_due",
      access: fullAccess,
      event: {
        en: "First try from 48 hours before the end. Declined: past_due and one notice.",
        ru: "Первая попытка за 48 часов до конца. Отказ: past_due и одно уведомление.",
        uz: "Birinchi urinish tugashidan 48 soat oldin. Rad etildi: past_due va bitta xabar.",
      },
    },
  },
  {
    from: 0,
    to: 0,
    phase: {
      status: "past_due",
      access: fullAccess,
      event: {
        en: "Second try on the last day, at least 20 hours after the first.",
        ru: "Вторая попытка в последний день, минимум через 20 часов после первой.",
        uz: "Ikkinchi urinish oxirgi kuni, birinchisidan kamida 20 soat keyin.",
      },
    },
  },
  {
    from: 1,
    to: 2,
    phase: {
      status: "past_due",
      access: fullAccess,
      event: {
        en: "Grace period: access stays, one try a day.",
        ru: "Грейс-период: доступ остаётся, одна попытка в день.",
        uz: "Imtiyozli davr: kirish saqlanadi, kuniga bitta urinish.",
      },
    },
  },
  {
    from: 3,
    to: 3,
    phase: {
      status: "expired",
      access: { en: "Free", ru: "Free", uz: "Free" },
      event: {
        en: "Three days after the end the account returns to Free, with a notice.",
        ru: "Через три дня после конца аккаунт возвращается на Free, с уведомлением.",
        uz: "Tugaganidan uch kun keyin hisob Free’ga qaytadi, xabar bilan.",
      },
    },
  },
];

const renewed: Phase = {
  status: "active",
  access: fullAccess,
  event: {
    en: "The charge goes through. The new period counts from the old end, and a fiscal receipt is issued.",
    ru: "Списание прошло. Новый период считается от старого конца, выдан фискальный чек.",
    uz: "To‘lov o‘tdi. Yangi davr eski tugash sanasidan hisoblanadi, fiskal chek beriladi.",
  },
};

const t = {
  heading: { en: "The life of a subscription", ru: "Жизнь подписки", uz: "Obuna hayoti" },
  intro: {
    en: "Plus for a month, and the saved card is declined. Move the day.",
    ru: "Plus на месяц, и сохранённую карту отклоняют. Передвиньте день.",
    uz: "Bir oylik Plus, saqlangan karta esa rad etiladi. Kunni suring.",
  },
  day: { en: "Day from the end of the period", ru: "День от конца периода", uz: "Davr tugashidan kun" },
  card: { en: "The card works again", ru: "Карта снова работает", uz: "Karta yana ishlayapti" },
  status: { en: "Status", ru: "Статус", uz: "Holat" },
  access: { en: "Access", ru: "Доступ", uz: "Kirish" },
  days: { en: "Days", ru: "Дни", uz: "Kunlar" },
  what: { en: "What happens", ru: "Что происходит", uz: "Nima bo‘ladi" },
  source: {
    en: "A replay of the rules in the billing code, not a live account. Admins can change the grace length and reminder timing.",
    ru: "Воспроизведение правил из кода биллинга, а не живой аккаунт. Длину грейса и сроки напоминаний админ может менять.",
    uz: "Billing kodi qoidalarining takrori, jonli hisob emas. Imtiyoz muddati va eslatma vaqtini admin o‘zgartirishi mumkin.",
  },
  trial: {
    en: "A trial is different: 7 days of Pro with no card, then straight to Free, with no grace.",
    ru: "С триалом иначе: 7 дней Pro без карты, затем сразу Free, без грейса.",
    uz: "Sinov davri boshqacha: kartasiz 7 kunlik Pro, keyin imtiyozsiz darhol Free.",
  },
  receipt: { en: "The receipt", ru: "Чек", uz: "Chek" },
  testMark: {
    en: "Test receipt, not sent to the tax office",
    ru: "Тестовый чек, в налоговую не отправлен",
    uz: "Test chek, soliq idorasiga yuborilmagan",
  },
} satisfies Record<string, L10n>;

const receipt: [string, string][] = [
  ["Ustoz AI Plus, 1", "49,000 UZS"],
  ["MXIK", "10305008003000000"],
  ["Package code", "1545643"],
  ["Total", "49,000 UZS"],
  ["Incl. VAT 12%", "5,250 UZS"],
  ["Provider", "mock-ofd"],
  ["Terminal", "TEST0000000001"],
];

const signed = (d: number) => (d > 0 ? `+${d}` : String(d));
const range = (from: number, to: number) => (from === to ? signed(from) : `${signed(from)}…${signed(to)}`);

/** SSR shows day +1 and a table of every phase, so all of it reads without JS. */
export default function UstozLife({ locale }: { locale: Locale }) {
  const [day, setDay] = useState(1);
  const [paid, setPaid] = useState(false);

  const scheduled = phases.find((p) => day >= p.from && day <= p.to)!.phase;
  // A working card only helps once a try is due and before the grace period ends.
  const shown = paid && day >= -2 && day < 3 ? renewed : scheduled;

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="uz-life">
          <div className="uz-panel" data-status={shown.status}>
            <label htmlFor="uz-day">
              {pick(t.day, locale)}: <b>{signed(day)}</b>
            </label>
            <input
              id="uz-day"
              className="uz-range"
              type="range"
              min={-4}
              max={3}
              value={day}
              aria-valuetext={signed(day)}
              onChange={(e) => setDay(Number(e.target.value))}
            />
            <label className="uz-toggle">
              <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} /> {pick(t.card, locale)}
            </label>
            <div aria-live="polite">
              <p className="uz-status">
                <code>{shown.status}</code>
              </p>
              <p>
                {pick(t.access, locale)}: <b>{pick(shown.access, locale)}</b>
              </p>
              <p>{pick(shown.event, locale)}</p>
            </div>
          </div>
          <figure className="uz-receipt">
            <figcaption>{pick(t.testMark, locale)}</figcaption>
            <p className="uz-seller">
              Ustoz AI MChJ (test)
              <br />
              TIN 300000000
            </p>
            <dl>
              {receipt.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </div>
        <table className="measures uz-table">
          <thead>
            <tr>
              <th scope="col">{pick(t.days, locale)}</th>
              <th scope="col">{pick(t.status, locale)}</th>
              <th scope="col">{pick(t.what, locale)}</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((p) => (
              <tr key={p.from} data-on={day >= p.from && day <= p.to}>
                <th scope="row" className="val">
                  {range(p.from, p.to)}
                </th>
                <td>
                  <code>{p.phase.status}</code>
                </td>
                <td>{pick(p.phase.event, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="block-note">
          {pick(t.source, locale)} {pick(t.trial, locale)}
        </p>
      </div>
    </section>
  );
}
