import type { CaseContent } from "./types";

export const cvForge: CaseContent = {
  slug: "cv-forge",
  kind: {
    en: "CV builder",
    ru: "Конструктор резюме",
    uz: "Rezyume konstruktori",
  },
  title: {
    en: "A CV builder with AI wording, templates and PDF export.",
    ru: "Конструктор резюме с ИИ-формулировками, шаблонами и экспортом в PDF.",
    uz: "AI matnlar, shablonlar va PDF eksport bilan rezyume konstruktori.",
  },
  hook: {
    en: "One CV, forty-eight sheets. One of them is a boarding pass.",
    ru: "Одно резюме, сорок восемь листов. Один из них посадочный талон.",
    uz: "Bitta rezyume, qirq sakkizta varaq. Ulardan biri bort taloni.",
  },
  cover: {
    src: "/projects/cv-forge/cover.webp",
    alt: {
      en: "The CV Forge start page with three sample resumes.",
      ru: "Стартовая страница CV Forge с тремя образцами резюме.",
      uz: "Uchta namunaviy rezyume bilan CV Forge bosh sahifasi.",
    },
    caption: {
      en: "The start page. The people on the sample resumes are invented.",
      ru: "Стартовая страница. Люди на образцах резюме вымышленные.",
      uz: "Bosh sahifa. Namunaviy rezyumelardagi odamlar to‘qima.",
    },
  },
  problem: {
    en: "Most résumé builders offer a handful of near-identical layouts, so the document looks like everybody else's before anyone reads it.",
    ru: "Большинство конструкторов предлагают несколько почти одинаковых макетов, и документ выглядит как у всех ещё до чтения.",
    uz: "Ko‘p konstruktorlar bir-biriga o‘xshash bir nechta maket beradi, shuning uchun hujjat o‘qilmasdan oldinoq hammanikiga o‘xshab ko‘rinadi.",
  },
  note: {
    en: "A study project. The candidate on the sheets is invented.",
    ru: "Учебный проект. Кандидат на листах вымышленный.",
    uz: "O‘quv loyihasi. Varaqlardagi nomzod to‘qima.",
  },
  built: [
    {
      name: { en: "From the sheet to a PDF", ru: "От листа к PDF", uz: "Varaqdan PDF’ga" },
      text: {
        en: "The server opens the same template in headless Chrome and saves it as a PDF: puppeteer-core and @sparticuz/chromium on Vercel, regular puppeteer locally. The file is the sheet you saw.",
        ru: "Сервер открывает тот же шаблон в headless Chrome и сохраняет в PDF: на Vercel puppeteer-core и @sparticuz/chromium, локально обычный puppeteer. В файле тот самый лист, что на экране.",
        uz: "Server o‘sha shablonni headless Chrome’da ochadi va PDF’ga saqlaydi: Vercel’da puppeteer-core va @sparticuz/chromium, lokalda oddiy puppeteer. Faylda ekrandagi o‘sha varaq bo‘ladi.",
      },
    },
    {
      name: { en: "AI wording", ru: "Формулировки от AI", uz: "AI ifodalari" },
      text: {
        en: "From the form data, the AI drafts the summary and strengths. The Express server proxies Gemini and Claude and keeps the keys away from the browser.",
        ru: "По данным формы AI формулирует описание и сильные стороны. Сервер на Express проксирует Gemini и Claude, ключи не попадают в браузер.",
        uz: "Forma ma’lumotlaridan AI tavsif va kuchli tomonlarni ifodalaydi. Express server Gemini va Claude’ni proksilaydi, kalitlar brauzerga tushmaydi.",
      },
    },
    {
      name: { en: "Telegram", ru: "Telegram", uz: "Telegram" },
      text: {
        en: "A button sends the PDF and a text version to the chat with the bot. After the first send, the device remembers a signed chat token.",
        ru: "Кнопка присылает в чат с ботом PDF и текстовую версию. После первой отправки устройство запоминает подписанный токен чата.",
        uz: "Tugma bot bilan chatga PDF va matn versiyasini yuboradi. Birinchi yuborishdan keyin qurilma imzolangan chat tokenini eslab qoladi.",
      },
    },
    {
      name: { en: "Privacy", ru: "Приватность", uz: "Maxfiylik" },
      text: {
        en: "Résumés are stored only in the browser's localStorage. For the Telegram handoff a copy stays in Redis for no more than 15 minutes.",
        ru: "Резюме хранятся только в localStorage браузера. Для передачи в Telegram копия лежит в Redis не дольше 15 минут.",
        uz: "Rezyumelar faqat brauzerning localStorage’ida saqlanadi. Telegram’ga uzatish uchun nusxa Redis’da 15 daqiqadan ko‘p turmaydi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "The slow first PDF", ru: "Медленный первый PDF", uz: "Sekin birinchi PDF" },
      text: {
        en: "After idle time the first PDF on Vercel is slow, so the client warms the browser up as soon as the preview opens.",
        ru: "После простоя первый PDF на Vercel медленный, поэтому клиент заранее прогревает браузер при открытии превью.",
        uz: "Bo‘sh turgandan keyin Vercel’dagi birinchi PDF sekin bo‘ladi, shuning uchun mijoz ko‘rish oynasi ochilishi bilan brauzerni oldindan qizdiradi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Templates", ru: "Шаблона", uz: "Shablonlar" }, value: "48" },
    { label: { en: "Languages", ru: "Языка", uz: "Tillar" }, value: "3" },
    { label: { en: "Longest stay in Redis", ru: "Максимум в Redis", uz: "Redis’da eng ko‘pi" }, value: "15 min" },
  ],
  metricsSource: {
    en: "templateRegistry.ts, the locales folder and LINK_TTL_SECONDS in the repository.",
    ru: "templateRegistry.ts, папка locales и LINK_TTL_SECONDS в репозитории.",
    uz: "Repozitoriydagi templateRegistry.ts, locales papkasi va LINK_TTL_SECONDS.",
  },
  stack: [
    {
      tech: "React 18, Vite, TypeScript, Zustand",
      why: { en: "A client-side app: the résumé lives in the store and in localStorage.", ru: "Клиентское приложение: резюме живёт в хранилище и localStorage.", uz: "Mijoz ilovasi: rezyume store va localStorage’da turadi." },
    },
    {
      tech: "Express",
      why: { en: "One serverless function on Vercel for the AI proxy, the PDF and the bot.", ru: "Одна бессерверная функция на Vercel для AI-прокси, PDF и бота.", uz: "AI proksi, PDF va bot uchun Vercel’da bitta serverless funksiya." },
    },
    {
      tech: "puppeteer-core, @sparticuz/chromium",
      why: { en: "A real browser gives a PDF that matches the screen.", ru: "Настоящий браузер даёт PDF, совпадающий с экраном.", uz: "Haqiqiy brauzer ekranga mos PDF beradi." },
    },
  ],
};
