import type { CaseContent } from "./types";

export const octaneForge: CaseContent = {
  slug: "octane-forge",
  kind: {
    en: "Business automation",
    ru: "Автоматизация бизнеса",
    uz: "Biznes avtomatlashtiruvi",
  },
  title: {
    en: "Booking for a car tuning atelier: site, calendar, Telegram bot, mini app and owner dashboard.",
    ru: "Запись в автоателье: сайт, календарь, Telegram-бот, мини-приложение и дашборд владельца.",
    uz: "Avto-atelyega yozilish: sayt, kalendar, Telegram bot, mini-ilova va egasi uchun dashboard.",
  },
  hook: {
    en: "The AI can fail halfway through a booking. The customer won't notice.",
    ru: "AI может упасть посреди записи. Клиент этого не заметит.",
    uz: "AI bron o‘rtasida ishdan chiqishi mumkin. Mijoz buni sezmaydi.",
  },
  problem: {
    en: "A tuning shop loses customers on the phone and in the Telegram chats: slots live in someone's head, and evenings go unanswered.",
    ru: "Тюнинг-ателье теряет клиентов в звонках и переписках: слоты живут в чьей-то голове, а вечером отвечать некому.",
    uz: "Tyuning ustaxonasi mijozlarni qo‘ng‘iroq va yozishmalarda yo‘qotadi: bo‘sh vaqtlar kimningdir xotirasida, kechqurun esa javob beradigan odam yo‘q.",
  },
  note: {
    en: "A study project: the Octane Forge atelier is invented.",
    ru: "Учебный проект: ателье Octane Forge вымышлено.",
    uz: "O‘quv loyihasi: Octane Forge ustaxonasi to‘qima.",
  },
  cover: {
    src: "/projects/octane-forge/cover.webp",
    alt: {
      en: "The Octane Forge landing page.",
      ru: "Лендинг Octane Forge.",
      uz: "Octane Forge lendingi.",
    },
    caption: {
      en: "The landing page, with a tachometer you can rev with a tap.",
      ru: "Лендинг с тахометром, который можно раскрутить нажатием.",
      uz: "Bosib aylantirish mumkin bo‘lgan taxometrli lending.",
    },
  },
  built: [
    {
      name: { en: "Online booking", ru: "Онлайн-запись", uz: "Onlayn yozilish" },
      text: {
        en: "Service, day, time, specialist, contacts. The calendar shows only real free slots.",
        ru: "Услуга, день, время, мастер, контакты. Календарь показывает только настоящие свободные слоты.",
        uz: "Xizmat, kun, vaqt, usta, kontaktlar. Taqvim faqat haqiqiy bo‘sh vaqtlarni ko‘rsatadi.",
      },
    },
    {
      name: { en: "Telegram", ru: "Telegram", uz: "Telegram" },
      text: {
        en: "The same flow on inline buttons, cancellation under My bookings, instant notices to the owner and a Mini App with the full calendar.",
        ru: "Тот же путь на инлайн-кнопках, отмена в «Моих записях», мгновенные уведомления владельцу и мини-апп с полным календарём.",
        uz: "Inline tugmalarda xuddi shu yo‘l, «Yozuvlarim»da bekor qilish, egasiga tezkor xabarlar va to‘liq taqvimli mini-ilova.",
      },
    },
    {
      name: { en: "Owner's panel", ru: "Панель владельца", uz: "Egasi paneli" },
      text: {
        en: "KPIs, daily revenue, team utilisation and peak hours; specialists, working hours, days off, services and prices.",
        ru: "KPI, выручка по дням, загрузка команды и пиковые часы; мастера, графики, выходные, услуги и цены.",
        uz: "KPI, kunlik tushum, jamoa bandligi va eng band soatlar; ustalar, ish vaqti, dam olish kunlari, xizmatlar va narxlar.",
      },
    },
    {
      name: { en: "Two assistants", ru: "Два ассистента", uz: "Ikki yordamchi" },
      text: {
        en: "An advisor on the site and in the bot answers, quotes prices and books. An analyst in the panel answers about revenue from live data.",
        ru: "Консультант на сайте и в боте отвечает, называет цены и записывает. Аналитик в панели отвечает о выручке по живым данным.",
        uz: "Sayt va botdagi maslahatchi javob beradi, narx aytadi va yozib qo‘yadi. Paneldagi tahlilchi tushum haqida jonli ma’lumot bo‘yicha javob beradi.",
      },
    },
    {
      name: { en: "Sum first", ru: "Сначала сумы", uz: "Avval so‘m" },
      text: {
        en: "Prices in Uzbek sum with an approximate USD amount under each, on all three languages.",
        ru: "Цены в сумах с примерной суммой в USD под каждой, на всех трёх языках.",
        uz: "Narxlar so‘mda, har birining ostida taxminiy USD summasi, uchala tilda.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Handing over what is done", ru: "Передать сделанное", uz: "Bajarilganni uzatish" },
      text: {
        en: "When a model dies mid-task, the next one receives the actions already done. That is what stops a booking from being created twice.",
        ru: "Когда модель падает на середине, следующая получает уже сделанные действия. Именно это не даёт создать бронь дважды.",
        uz: "Model ish o‘rtasida to‘xtasa, keyingisi bajarilgan amallarni oladi. Aynan shu bron ikki marta yaratilishiga yo‘l qo‘ymaydi.",
      },
    },
    {
      title: { en: "One bot, no running process", ru: "Бот без постоянного процесса", uz: "Doimiy jarayonsiz bot" },
      text: {
        en: "The site, API, Mini App, bot webhook and daily reminders all run on Vercel, on free tiers, next to the Neon database in Frankfurt.",
        ru: "Сайт, API, мини-апп, вебхук бота и ежедневные напоминания работают на Vercel, на бесплатных тарифах, рядом с базой Neon во Франкфурте.",
        uz: "Sayt, API, mini-ilova, bot vebhuki va kunlik eslatmalar Vercel’da, bepul tariflarda, Frankfurtdagi Neon bazasi yonida ishlaydi.",
      },
    },
  ],
  stack: [
    {
      tech: "AI_CHAIN",
      why: {
        en: "The order of models is one environment variable, provider:model, with Gemini, OpenAI and Claude adapters.",
        ru: "Порядок моделей задаётся одной переменной окружения, provider:model, с адаптерами Gemini, OpenAI и Claude.",
        uz: "Modellar tartibi bitta muhit o‘zgaruvchisida, provider:model, Gemini, OpenAI va Claude adapterlari bilan.",
      },
    },
    {
      tech: "grammY",
      why: {
        en: "Works by webhook on serverless hosting, with the same booking logic as the site.",
        ru: "Работает через вебхук на бессерверном хостинге, с той же логикой записи, что и сайт.",
        uz: "Serversiz xostingda vebhuk orqali, sayt bilan bir xil yozilish mantig‘i bilan ishlaydi.",
      },
    },
    {
      tech: "Next.js, Prisma, Neon",
      why: {
        en: "One codebase for the site, API and panel, with a typed schema over Postgres.",
        ru: "Один код для сайта, API и панели, с типизированной схемой поверх Postgres.",
        uz: "Sayt, API va panel uchun bitta kod, Postgres ustida tiplashtirilgan sxema bilan.",
      },
    },
  ],
};
