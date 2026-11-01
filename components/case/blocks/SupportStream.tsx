"use client";

import { useEffect, useRef, useState } from "react";
import { pick, type L10n, type Locale } from "@/lib/i18n";

/** TOKEN_CHUNK_DELAY_MS in backend/src/routes/chat.ts. */
const TOKEN_MS = 25;

/** RU and UZ are replies from the live demo; EN is a translation, since the bank has no English. */
const question: L10n = {
  en: "How do I reset my password?",
  ru: "Как сбросить пароль?",
  uz: "Parolni unutdim, kira olmayapman",
};
const answer: L10n = {
  en: "To reset your password, click “Forgot password?” on the sign-in page and enter the email linked to your account. We'll send you a reset link. The link is valid for 30 minutes.",
  ru: "Чтобы сбросить пароль, нажмите «Забыли пароль?» на странице входа и укажите email, привязанный к аккаунту — мы вышлем ссылку для сброса. Ссылка действует 30 минут.",
  uz: "Parolni tiklash uchun kirish sahifasida \"Parolni unutdingizmi?\" tugmasini bosing va hisobingizga bog‘langan email manzilni kiriting — sizga tiklash havolasi yuboriladi. Havola 30 daqiqa amal qiladi.",
};
const timeoutText: L10n = {
  en: "Timed out waiting for a reply. Please try again.",
  ru: "Превышено время ожидания ответа. Попробуйте снова.",
  uz: "Javob kutish vaqti tugadi. Qaytadan urinib ko‘ring.",
};

const t = {
  heading: { en: "A reply in pieces", ru: "Ответ по кусочкам", uz: "Bo‘laklab javob" },
  intro: {
    en: "Left, what the visitor sees. Right, what comes over the wire: typing, then token after token, then done.",
    ru: "Слева то, что видит посетитель. Справа то, что идёт по сети: typing, затем токен за токеном, затем done.",
    uz: "Chapda tashrifchi ko‘radigan narsa. O‘ngda tarmoqdan keladigan narsa: typing, keyin token ketidan token, keyin done.",
  },
  replay: { en: "Replay", ru: "Повторить", uz: "Takrorlash" },
  chat: { en: "Chat", ru: "Чат", uz: "Chat" },
  feed: { en: "Event stream", ru: "Лента событий", uz: "Hodisalar oqimi" },
  branch: { en: "If the reply takes over 15 seconds", ru: "Если ответ занимает больше 15 секунд", uz: "Javob 15 soniyadan oshsa" },
  branchNote: {
    en: "The stream ends with error instead of done, and the chat offers a retry.",
    ru: "Поток заканчивается событием error вместо done, а чат предлагает повторить.",
    uz: "Oqim done o‘rniga error bilan tugaydi, chat esa qayta urinishni taklif qiladi.",
  },
  note: {
    en: "The stream is real SSE, and the pace here is the server's: 25 ms per piece. The server gets the finished reply first, then splits it into words and spaces, with a real model too. So this is delivery, not the model thinking aloud. The done line is shortened.",
    ru: "Поток это настоящий SSE, темп здесь серверный: 25 мс на кусочек. Сервер сначала получает готовый ответ, затем режет его на слова и пробелы, и с настоящей моделью тоже. Так что это доставка, а не модель, думающая вслух. Строка done сокращена.",
    uz: "Oqim haqiqiy SSE, bu yerdagi sur’at serverniki: har bo‘lakka 25 ms. Server avval tayyor javobni oladi, keyin uni so‘z va bo‘shliqlarga bo‘ladi, haqiqiy model bilan ham. Demak, bu yetkazish, model ovoz chiqarib o‘ylashi emas. done qatori qisqartirilgan.",
  },
  noteEn: {
    en: "The question and answer are translated: the scenario bank is in Russian and Uzbek.",
    ru: "",
    uz: "",
  },
} satisfies Record<string, L10n>;

const chunk = (s: string) => s.split(/(\s+)/).filter(Boolean);

/** SSR, reduced motion and no JS all show the finished state. */
export default function SupportStream({ locale }: { locale: Locale }) {
  const tokens = chunk(pick(answer, locale));
  const [shown, setShown] = useState(tokens.length);
  const [run, setRun] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const feed = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let at = -1;
    const stop = () => window.clearInterval(timer);
    const io = new IntersectionObserver(
      ([e]) => {
        stop();
        if (!e.isIntersecting) return;
        if (at < 0) {
          at = 0;
          setShown(0);
        }
        timer = window.setInterval(() => {
          at += 1;
          setShown(at);
          if (at >= tokens.length) stop();
        }, TOKEN_MS);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [run, tokens.length]);

  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  const done = shown >= tokens.length;

  return (
    <section className="g case-sec">
      <div className="in">
        <h2>{pick(t.heading, locale)}</h2>
        <p>{pick(t.intro, locale)}</p>
        <div className="sa-stage" ref={root}>
          <div className="sa-chat" role="group" aria-label={pick(t.chat, locale)}>
            <p className="sa-q">{pick(question, locale)}</p>
            <p className="sa-a">
              {tokens.slice(0, shown).join("")}
              {done ? null : <span className="sa-caret" aria-hidden="true" />}
            </p>
            <button type="button" onClick={() => setRun((r) => r + 1)}>
              {pick(t.replay, locale)}
            </button>
          </div>
          <ol className="sa-feed" ref={feed} aria-label={pick(t.feed, locale)} tabIndex={0}>
            <li>
              <b>typing</b> {"{}"}
            </li>
            {tokens.slice(0, shown).map((x, i) => (
              <li key={i}>
                <b>token</b> {JSON.stringify({ text: x })}
              </li>
            ))}
            {done ? (
              <li data-end="done">
                <b>done</b> {'{"messageId":"…","sessionId":"…","suggestions":[…]}'}
              </li>
            ) : null}
          </ol>
        </div>
        <h3 className="sa-h3">{pick(t.branch, locale)}</h3>
        <ol className="sa-feed sa-static">
          <li>
            <b>typing</b> {"{}"}
          </li>
          <li>
            <b>error</b> {JSON.stringify({ message: pick(timeoutText, locale) })}
          </li>
        </ol>
        <p className="block-note">
          {pick(t.branchNote, locale)} {pick(t.note, locale)} {locale === "en" ? t.noteEn.en : null}
        </p>
      </div>
    </section>
  );
}
