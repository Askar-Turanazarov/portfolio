import type { CaseContent } from "./types";

export const domusEstate: CaseContent = {
  slug: "domus-estate",
  kind: {
    en: "Sales platform",
    ru: "Платформа продаж",
    uz: "Savdo platformasi",
  },
  title: {
    en: "Selling apartments in a new building: 3D tour, booking, payments, AI consultant.",
    ru: "Продажа квартир в новостройке: 3D-тур, бронь, оплата и ИИ-консультант.",
    uz: "Yangi uyda kvartira sotuvi: 3D sayohat, bron, to‘lov, AI maslahatchi.",
  },
  hook: {
    en: "One apartment cannot be sold twice, whichever door the buyer comes through.",
    ru: "Одну квартиру нельзя продать дважды, через какую бы дверь ни пришёл покупатель.",
    uz: "Xaridor qaysi yo‘ldan kelmasin, bitta kvartirani ikki marta sotib bo‘lmaydi.",
  },
  problem: {
    en: "A developer sells through a site, a Telegram bot, managers and now AI agents. If each channel keeps its own rules, two people end up with the same apartment.",
    ru: "Застройщик продаёт через сайт, Telegram-бота, менеджеров, а теперь и AI-агентов. Если у каждого канала свои правила, одна квартира достаётся двоим.",
    uz: "Quruvchi sayt, Telegram-bot, menejerlar va endi AI-agentlar orqali sotadi. Har bir kanalning o‘z qoidasi bo‘lsa, bitta kvartira ikki kishiga tushib qoladi.",
  },
  note: {
    en: "A study project: the developer and the Chinor Park complex are invented.",
    ru: "Учебный проект: застройщик и комплекс Chinor Park вымышлены.",
    uz: "O‘quv loyihasi: quruvchi va Chinor Park majmuasi to‘qima.",
  },
  cover: {
    src: "/projects/domus-estate/cover.webp",
    alt: {
      en: "The Domus Estate home page with the Chinor Park residential complex.",
      ru: "Главная страница Domus Estate с жилым комплексом Chinor Park.",
      uz: "Chinor Park turar-joy majmuasi bilan Domus Estate bosh sahifasi.",
    },
    caption: {
      en: "The live site. Buyers walk the complex in 3D, down to a single apartment.",
      ru: "Живой сайт. Покупатель проходит комплекс в 3D вплоть до одной квартиры.",
      uz: "Jonli sayt. Xaridor majmuani 3D’da bitta kvartiragacha ko‘rib chiqadi.",
    },
  },
  built: [
    {
      name: { en: "Storefront in 3D", ru: "Витрина в 3D", uz: "3D vitrina" },
      text: {
        en: "Three.js walk through the complex and Canvas 2D for the plans, with no build step.",
        ru: "Прогулка по комплексу на Three.js и планы на Canvas 2D, без шага сборки.",
        uz: "Majmua bo‘ylab Three.js sayri va Canvas 2D rejalari, yig‘ish bosqichisiz.",
      },
    },
    {
      name: { en: "Booking and payment", ru: "Бронь и оплата", uz: "Bron va to‘lov" },
      text: {
        en: "A 15-minute hold, then a 72-hour booking with a deposit paid through Stripe. The head changes these values in the admin panel.",
        ru: "Удержание на 15 минут, затем бронь на 72 часа с депозитом через Stripe. Значения меняет руководитель в админке.",
        uz: "15 daqiqa ushlab turish, keyin Stripe orqali depozit bilan 72 soatlik bron. Qiymatlarni rahbar admin panelda o‘zgartiradi.",
      },
    },
    {
      name: { en: "AI consultant", ru: "AI-консультант", uz: "AI-maslahatchi" },
      text: {
        en: "A router sends each message to one of five agents. They use the core's own tools, and every change needs the client's confirmation.",
        ru: "Роутер отправляет сообщение одному из пяти агентов. Они работают инструментами самого ядра, и любое изменение требует подтверждения клиента.",
        uz: "Router har bir xabarni beshta agentdan biriga yuboradi. Ular yadroning o‘z vositalari bilan ishlaydi, har qanday o‘zgarish mijoz tasdig‘ini talab qiladi.",
      },
    },
    {
      name: { en: "Telegram", ru: "Telegram", uz: "Telegram" },
      text: {
        en: "A bot with streaming answers, a mini app, and staff notifications with a PDF that a manager takes with one tap.",
        ru: "Бот с потоковыми ответами, мини-апп и уведомления сотрудникам с PDF, которые менеджер забирает одним нажатием.",
        uz: "Oqimli javobli bot, mini-ilova va xodimlarga PDF bilan bildirishnoma, menejer uni bir bosishda oladi.",
      },
    },
    {
      name: { en: "Staff tools", ru: "Инструменты сотрудников", uz: "Xodimlar vositalari" },
      text: {
        en: "An admin panel with manager and head roles, a live sales dashboard, and a test-only time shift to show deadlines without waiting.",
        ru: "Админка с ролями менеджера и руководителя, живой дашборд продаж и тестовый сдвиг времени, чтобы показать сроки без ожидания.",
        uz: "Menejer va rahbar rollari bilan admin panel, jonli savdo dashbordi va muddatlarni kutmasdan ko‘rsatish uchun test vaqt siljishi.",
      },
    },
    {
      name: { en: "MCP server", ru: "MCP-сервер", uz: "MCP-server" },
      text: {
        en: "Connects Claude Desktop in two roles, client and head, through the same core as everything else.",
        ru: "Подключает Claude Desktop в двух ролях, клиента и руководителя, через то же ядро, что и всё остальное.",
        uz: "Claude Desktop’ni mijoz va rahbar rollarida, qolgan hamma narsa kabi shu yadro orqali ulaydi.",
      },
    },
  ],
  arch: {
    alt: {
      en: "Six entry points call one core, which uses the database, queues and models.",
      ru: "Шесть входов вызывают одно ядро, а оно обращается к базе, очередям и моделям.",
      uz: "Oltita kirish bitta yadroni chaqiradi, u esa baza, navbat va modellarga murojaat qiladi.",
    },
    layers: [
      {
        label: { en: "Doors", ru: "Входы", uz: "Kirishlar" },
        nodes: ["Site", "Mini app", "grammY bot", "AI agents", "Admin", "MCP"],
      },
      { label: { en: "Rules", ru: "Правила", uz: "Qoidalar" }, nodes: ["server/core"] },
      {
        label: { en: "Delivery", ru: "Доставка", uz: "Yetkazish" },
        nodes: ["Outbox → Telegram", "QStash", "Stripe"],
      },
      {
        label: { en: "Storage and models", ru: "Данные и модели", uz: "Ma’lumot va modellar" },
        nodes: ["Neon / PGlite", "pgvector", "Vercel Blob", "Gemini", "Claude"],
      },
    ],
  },
  hard: [
    {
      title: { en: "One core for every door", ru: "Одно ядро на все входы", uz: "Barcha kirishlar uchun bitta yadro" },
      text: {
        en: "I put holds, bookings, deadlines, payments and refunds in one core. Every door calls it, including the MCP server, so no channel can go around the rules.",
        ru: "Удержания, брони, сроки, оплаты и возвраты я вынес в одно ядро. Его вызывают все входы, включая MCP-сервер, поэтому обойти правила не может ни один канал.",
        uz: "Band qilish, bron, muddat, to‘lov va qaytarishni bitta yadroga jamladim. Barcha kirishlar, jumladan MCP-server ham, shu yadroni chaqiradi, shuning uchun hech bir kanal qoidani chetlab o‘tolmaydi.",
      },
    },
    {
      title: { en: "When a model is unavailable", ru: "Когда модель недоступна", uz: "Model ishlamaganda" },
      text: {
        en: "Gemini is the main model and Claude the fallback. With no Gemini key the chat answers from scripted flows, so a demo never goes silent.",
        ru: "Gemini основная модель, Claude запасная. Без ключа Gemini чат отвечает по сценариям, так что демо не замолкает.",
        uz: "Gemini asosiy model, Claude zaxira. Gemini kaliti bo‘lmasa, chat ssenariy bo‘yicha javob beradi, demo jim qolmaydi.",
      },
    },
  ],
  stack: [
    {
      tech: "Express, plain ES modules",
      why: {
        en: "No build step: the server and the front end run as written.",
        ru: "Нет шага сборки: сервер и фронтенд работают так, как написаны.",
        uz: "Yig‘ish bosqichi yo‘q: server va frontend yozilganidek ishlaydi.",
      },
    },
    {
      tech: "Neon, PGlite",
      why: {
        en: "The same Postgres in production and, in-process, locally and in tests.",
        ru: "Один и тот же Postgres: в продакшене и встроенный локально и в тестах.",
        uz: "Bir xil Postgres: produksiyada va lokal hamda testlarda jarayon ichida.",
      },
    },
    {
      tech: "QStash",
      why: {
        en: "Background jobs on serverless hosting, where a process cannot stay running.",
        ru: "Фоновые задачи на бессерверном хостинге, где процесс не может работать постоянно.",
        uz: "Jarayon doimiy ishlay olmaydigan serversiz xostingda fon vazifalari.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "Telegram webhook answer, p95", ru: "Ответ вебхуку Telegram, p95", uz: "Telegram vebhukiga javob, p95" },
      value: "17 ms",
      note: { en: "Target under 500 ms. Local.", ru: "Цель до 500 мс. Локально.", uz: "Maqsad 500 ms gacha. Lokal." },
    },
    {
      label: { en: "Core API, p95, local", ru: "API ядра, p95, локально", uz: "Yadro API, p95, lokal" },
      value: "23–39 ms",
      note: { en: "Target under 300 ms. Met.", ru: "Цель до 300 мс. Выполнена.", uz: "Maqsad 300 ms gacha. Bajarildi." },
    },
    {
      label: { en: "Core API, p95, production", ru: "API ядра, p95, продакшен", uz: "Yadro API, p95, produksiya" },
      value: "383–843 ms",
      note: {
        en: "Target missed. Measured from Tashkent to Frankfurt; TCP connect alone took 0.15–0.26 s.",
        ru: "Цель не выполнена. Замер из Ташкента во Франкфурт; одно TCP-соединение занимало 0,15–0,26 с.",
        uz: "Maqsadga erishilmadi. Toshkentdan Frankfurtgacha o‘lchangan; TCP ulanishning o‘zi 0,15–0,26 s oldi.",
      },
    },
    {
      label: { en: "Full chat answer, median, production", ru: "Полный ответ чата, медиана, продакшен", uz: "Chatning to‘liq javobi, mediana, produksiya" },
      value: "1.48 s",
      note: {
        en: "Target under 8 s. p95 6.44 s, 20 questions, no errors.",
        ru: "Цель до 8 с. p95 6,44 с, 20 вопросов, без ошибок.",
        uz: "Maqsad 8 s gacha. p95 6,44 s, 20 savol, xatosiz.",
      },
    },
  ],
  metricsSource: {
    en: "From docs/perf.md in the repository, runs of 28 October 2026.",
    ru: "Из docs/perf.md в репозитории, прогоны 28 октября 2026.",
    uz: "Repozitoriydagi docs/perf.md dan, 2026-yil 28-oktabr o‘lchovlari.",
  },
};
