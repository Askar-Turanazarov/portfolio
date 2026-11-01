"use client";

import { useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

type Phase = "login" | "refreshed" | "replayed";
type Move = "refresh" | "replay";

/** Status lines as the backend answered on a local run; the token values are left out. */
const answers: Record<Phase, { status: string; body: string; bad?: boolean }> = {
  login: { status: "200 OK", body: '{ "user": { … }, "tokens": { "access_token": "…", "refresh_token": "…", "expires_in": 900 } }' },
  refreshed: { status: "200 OK", body: '{ "access_token": "…", "refresh_token": "…", "expires_in": 900 }' },
  replayed: {
    status: "401 Unauthorized",
    body: '{ "error": { "code": "INVALID_REFRESH_TOKEN", "message": "Refresh token not found or already revoked" } }',
    bad: true,
  },
};

const endpoints: { group: string; routes: string[] }[] = [
  { group: "/auth", routes: ["POST /register", "POST /login", "POST /refresh", "POST /logout"] },
  { group: "/reference", routes: ["GET /countries", "GET /cities"] },
  { group: "/visited-countries", routes: ["GET /", "POST /", "DELETE /:id"] },
  { group: "/visited-cities", routes: ["GET /", "POST /", "PATCH /:id", "DELETE /:id"] },
  { group: "/dashboard", routes: ["GET /stats"] },
  { group: "/admin", routes: ["GET /users"] },
  { group: "/users", routes: ["DELETE /me"] },
  { group: "/health", routes: ["GET /"] },
];

const t = {
  heading: { en: "Token rotation", ru: "Ротация токенов", uz: "Tokenlar rotatsiyasi" },
  intro: {
    en: "Refresh once, then try the old token again. The answers below came from the real backend on a local run.",
    ru: "Обновите токен, затем попробуйте старый ещё раз. Ответы ниже дал настоящий бэкенд на локальном запуске.",
    uz: "Tokenni yangilang, keyin eskisini yana sinab ko‘ring. Quyidagi javoblarni lokal ishga tushirishda haqiqiy backend bergan.",
  },
  client: { en: "Browser", ru: "Браузер", uz: "Brauzer" },
  server: { en: "API", ru: "API", uz: "API" },
  old: { en: "first refresh token", ru: "первый refresh-токен", uz: "birinchi refresh-token" },
  fresh: { en: "second refresh token", ru: "второй refresh-токен", uz: "ikkinchi refresh-token" },
  active: { en: "active", ru: "действует", uz: "amalda" },
  revoked: { en: "revoked", ru: "отозван", uz: "bekor qilingan" },
  absent: { en: "not issued yet", ru: "ещё не выдан", uz: "hali berilmagan" },
  refresh: { en: "Refresh", ru: "Обновить", uz: "Yangilash" },
  replay: { en: "Repeat the old token", ru: "Повторить старый токен", uz: "Eski tokenni takrorlash" },
  reset: { en: "From the start", ru: "С начала", uz: "Boshidan" },
  note: {
    en: "The database keeps a SHA-256 of each refresh token, not the token. What this doesn't do: a replayed token gets a 401, but the user's other tokens stay valid, so reuse isn't detected as theft. And the frontend keeps tokens in localStorage.",
    ru: "В базе лежит SHA-256 от каждого refresh-токена, а не сам токен. Чего здесь нет: повтор получает 401, но остальные токены пользователя продолжают работать, то есть повторное использование не считается кражей. И фронтенд хранит токены в localStorage.",
    uz: "Bazada refresh-tokenning o‘zi emas, uning SHA-256 qiymati saqlanadi. Bu yerda nima yo‘q: takroriy so‘rov 401 oladi, lekin foydalanuvchining boshqa tokenlari ishlashda davom etadi, ya’ni qayta ishlatish o‘g‘irlik deb hisoblanmaydi. Frontend esa tokenlarni localStorage’da saqlaydi.",
  },
  apiHeading: { en: "The API", ru: "API", uz: "API" },
  apiIntro: {
    en: "All 17 endpoints, under /api/v1. Countries, cities and the dashboard answer only to a signed-in user.",
    ru: "Все 17 конечных точек, под /api/v1. Страны, города и дашборд отвечают только вошедшему пользователю.",
    uz: "Barcha 17 ta endpoint, /api/v1 ostida. Mamlakatlar, shaharlar va dashboard faqat tizimga kirgan foydalanuvchiga javob beradi.",
  },
  apiGroup: { en: "Prefix", ru: "Префикс", uz: "Prefiks" },
  apiRoutes: { en: "Routes", ru: "Маршруты", uz: "Marshrutlar" },
} satisfies Record<string, L10n>;

const steps: { title: L10n; code: string }[] = [
  {
    title: {
      en: "Login gives an access token for 15 minutes and a refresh token for 7 days.",
      ru: "Вход выдаёт access-токен на 15 минут и refresh-токен на 7 дней.",
      uz: "Kirish 15 daqiqalik access-token va 7 kunlik refresh-token beradi.",
    },
    code: answers.login.status,
  },
  {
    title: {
      en: "POST /auth/refresh gives a new pair and revokes the refresh token it was sent.",
      ru: "POST /auth/refresh выдаёт новую пару и отзывает присланный refresh-токен.",
      uz: "POST /auth/refresh yangi juftlik beradi va yuborilgan refresh-tokenni bekor qiladi.",
    },
    code: answers.refreshed.status,
  },
  {
    title: {
      en: "The old token, sent again, is refused.",
      ru: "Старый токен, присланный повторно, получает отказ.",
      uz: "Qayta yuborilgan eski token rad etiladi.",
    },
    code: "401 INVALID_REFRESH_TOKEN",
  },
];

const order: Phase[] = ["login", "refreshed", "replayed"];

export default function TokenRotation({ locale }: { locale: Locale }) {
  const [phase, setPhase] = useState<Phase>("login");
  const [move, setMove] = useState<Move | null>(null);

  const land = (m: Move) => setPhase(m === "refresh" ? "refreshed" : "replayed");

  const go = (m: Move) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) land(m);
    else setMove(m);
  };

  const answer = answers[phase];
  const oldState = phase === "login" ? t.active : t.revoked;
  const newState = phase === "login" ? t.absent : t.active;

  return (
    <>
      <section className="g case-sec">
        <div className="in">
          <h2>{pick(t.heading, locale)}</h2>
          <p>{pick(t.intro, locale)}</p>
          <noscript>
            <style>{".tt-live { display: none; }"}</style>
          </noscript>
          <div className="tt-live">
            <div className="tt-route" aria-hidden="true">
              <span>{pick(t.client, locale)}</span>
              <i>
                {move && (
                  <b
                    className="tt-dot"
                    data-bad={move === "replay" ? "" : undefined}
                    onAnimationEnd={() => {
                      land(move);
                      setMove(null);
                    }}
                  />
                )}
              </i>
              <span>{pick(t.server, locale)}</span>
            </div>
            <dl className="tt-tokens">
              <div data-off={phase === "login" ? undefined : ""}>
                <dt>{pick(t.old, locale)}</dt>
                <dd>{pick(oldState, locale)}</dd>
              </div>
              <div data-off={phase === "login" ? "" : undefined}>
                <dt>{pick(t.fresh, locale)}</dt>
                <dd>{pick(newState, locale)}</dd>
              </div>
            </dl>
            <pre className="tt-answer" data-bad={answer.bad ? "" : undefined} aria-live="polite" tabIndex={0}>
              <code>
                {answer.status}
                {"\n"}
                {answer.body}
              </code>
            </pre>
            <div className="tt-controls">
              <button type="button" disabled={phase !== "login" || !!move} onClick={() => go("refresh")}>
                {pick(t.refresh, locale)}
              </button>
              <button type="button" disabled={phase === "login" || !!move} onClick={() => go("replay")}>
                {pick(t.replay, locale)}
              </button>
              <button type="button" disabled={phase === "login" || !!move} onClick={() => setPhase("login")}>
                {pick(t.reset, locale)}
              </button>
            </div>
          </div>
          <ol className="tt-steps">
            {steps.map((s, i) => (
              <li key={order[i]} data-now={order[i] === phase ? "" : undefined}>
                {pick(s.title, locale)} <code>{s.code}</code>
              </li>
            ))}
          </ol>
          <p className="block-note">{pick(t.note, locale)}</p>
        </div>
      </section>
      <section className="g case-sec">
        <div className="in">
          <h2>{pick(t.apiHeading, locale)}</h2>
          <p>{pick(t.apiIntro, locale)}</p>
          <div className="tt-api" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">{pick(t.apiGroup, locale)}</th>
                  <th scope="col">{pick(t.apiRoutes, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((e) => (
                  <tr key={e.group}>
                    <th scope="row">{e.group}</th>
                    <td>{e.routes.join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
