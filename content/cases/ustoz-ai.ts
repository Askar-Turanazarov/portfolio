import type { CaseContent } from "./types";

export const ustozAi: CaseContent = {
  slug: "ustoz-ai",
  title: {
    en: "The hard part of a subscription isn't the chat. It's the day the card fails.",
    ru: "Самое сложное в подписке не чат, а день, когда карта не прошла.",
    uz: "Obunaning eng qiyin joyi chat emas, karta o‘tmay qolgan kun.",
  },
  problem: {
    en: "Learning English with a tutor costs more than many in Uzbekistan can pay, and foreign services don't take local cards or speak Uzbek.",
    ru: "Занятия с репетитором английского по карману не всем, а зарубежные сервисы не принимают местные карты и не говорят по-узбекски.",
    uz: "Ingliz tili repetitori hammaga ham to‘g‘ri kelmaydi, xorijiy xizmatlar esa mahalliy kartani qabul qilmaydi va o‘zbekcha gapirmaydi.",
  },
  note: {
    en: "A study project. Payments are emulated or in test mode, and no real money moves.",
    ru: "Учебный проект. Платежи эмулированы или в тестовом режиме, настоящие деньги не двигаются.",
    uz: "O‘quv loyihasi. To‘lovlar emulyatsiya qilingan yoki test rejimida, haqiqiy pul harakatlanmaydi.",
  },
  cover: {
    src: "/projects/ustoz-ai/cover.webp",
    alt: { en: "The Ustoz AI landing page.", ru: "Лендинг Ustoz AI.", uz: "Ustoz AI lendingi." },
    caption: { en: "The landing page.", ru: "Лендинг.", uz: "Lending." },
  },
  gallery: [
    {
      src: "/projects/ustoz-ai/plans.webp",
      alt: {
        en: "Free, Plus and Pro plans with a billing period switch of 1, 3 and 12 months.",
        ru: "Тарифы Free, Plus и Pro с переключателем периода на 1, 3 и 12 месяцев.",
        uz: "Free, Plus va Pro tariflari, 1, 3 va 12 oylik davr tanlagichi bilan.",
      },
      caption: {
        en: "Plans in sum: 1, 3 and 12 months, with 10% and 25% off.",
        ru: "Тарифы в сумах: 1, 3 и 12 месяцев, скидка 10% и 25%.",
        uz: "So‘mdagi tariflar: 1, 3 va 12 oy, 10% va 25% chegirma.",
      },
    },
    {
      src: "/projects/ustoz-ai/receipt.webp",
      alt: {
        en: "A printable fiscal receipt with a QR code, marked as a test receipt.",
        ru: "Печатный фискальный чек с QR-кодом и пометкой о тестовом чеке.",
        uz: "QR-kodli bosma fiskal chek, test chek deb belgilangan.",
      },
      caption: {
        en: "The receipt as the product shows it.",
        ru: "Чек, каким его показывает продукт.",
        uz: "Mahsulot ko‘rsatadigan chek.",
      },
    },
    {
      src: "/projects/ustoz-ai/admin.webp",
      alt: {
        en: "The admin subscriptions page: a past_due subscription with buttons that move the period end.",
        ru: "Подписки в админке: подписка past_due и кнопки, которые сдвигают конец периода.",
        uz: "Admindagi obunalar: past_due obuna va davr tugashini suradigan tugmalar.",
      },
      caption: {
        en: "Admin: in 2 days, in 2 min, a minute ago. The whole cycle can be tried right away.",
        ru: "Админка: через 2 дня, через 2 минуты, минуту назад. Весь цикл можно проверить сразу.",
        uz: "Admin: 2 kundan keyin, 2 daqiqadan keyin, bir daqiqa oldin. Butun siklni darhol sinash mumkin.",
      },
    },
    {
      src: "/projects/ustoz-ai/pronunciation.webp",
      alt: {
        en: "The pronunciation coach with a phrase, listen buttons and a record button.",
        ru: "Тренер произношения: фраза, кнопки прослушивания и запись.",
        uz: "Talaffuz murabbiyi: ibora, tinglash tugmalari va yozib olish.",
      },
      caption: { en: "Pronunciation coach.", ru: "Тренер произношения.", uz: "Talaffuz murabbiyi." },
    },
  ],
  built: [
    {
      name: { en: "The tutor", ru: "Репетитор", uz: "Repetitor" },
      text: {
        en: "Chat with mistake review, A1–C2 topics, lessons, vocabulary, quizzes and a personal plan.",
        ru: "Чат с разбором ошибок, темы A1–C2, уроки, словарь, квизы и личный план.",
        uz: "Xatolar tahlili bilan chat, A1–C2 mavzular, darslar, lug‘at, testlar va shaxsiy reja.",
      },
    },
    {
      name: { en: "Plans", ru: "Тарифы", uz: "Tariflar" },
      text: {
        en: "Free, Plus and Pro. An upgrade pays only the difference for the days left; a downgrade waits for the period end.",
        ru: "Free, Plus и Pro. При повышении оплачивается только разница за оставшиеся дни, понижение ждёт конца периода.",
        uz: "Free, Plus va Pro. Oshirishda faqat qolgan kunlar farqi to‘lanadi, pasaytirish davr oxirini kutadi.",
      },
    },
    {
      name: { en: "Three ways to pay", ru: "Три способа оплаты", uz: "Uch to‘lov usuli" },
      text: {
        en: "A full Uzcard and HUMO emulator, the Click SHOP API with signatures, and Stripe in test mode.",
        ru: "Полный эмулятор Uzcard и HUMO, Click SHOP API с подписями и Stripe в тестовом режиме.",
        uz: "To‘liq Uzcard va HUMO emulyatori, imzoli Click SHOP API va test rejimidagi Stripe.",
      },
    },
    {
      name: { en: "Telegram and email", ru: "Telegram и почта", uz: "Telegram va pochta" },
      text: {
        en: "Billing notices arrive in the app, by email and in a linked Telegram; every message is kept in an admin outbox.",
        ru: "Уведомления о биллинге приходят в приложение, на почту и в привязанный Telegram; каждое сообщение хранится в админке.",
        uz: "Billing xabarlari ilovaga, pochtaga va ulangan Telegram’ga keladi; har bir xabar adminkada saqlanadi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Bugs that surface weeks later", ru: "Ошибки, которые всплывают через недели", uz: "Haftalar o‘tib chiqadigan xatolar" },
      text: {
        en: "Billing bugs appear weeks later, so I test the whole cycle day by day and added buttons in the admin panel that shift time.",
        ru: "Ошибки биллинга всплывают через недели, поэтому весь цикл проверяется тестами по дням, а в админке есть кнопки сдвига времени.",
        uz: "Billing xatolari haftalar o‘tib chiqadi, shuning uchun butun sikl kunma-kun test qilinadi, adminkada esa vaqtni suradigan tugmalar bor.",
      },
    },
    {
      title: { en: "A daily cron, exact access", ru: "Cron раз в день, доступ точно в срок", uz: "Kunlik cron, aniq vaqtda kirish" },
      text: {
        en: "On Vercel the job runs once a day at 05:00 UTC. Access still switches exactly on time, because every request checks the subscription.",
        ru: "На Vercel задача идёт раз в день в 05:00 UTC. Доступ всё равно переключается точно в срок, потому что подписку проверяет каждый запрос.",
        uz: "Vercel’da vazifa kuniga bir marta 05:00 UTC da ishlaydi. Kirish baribir aynan vaqtida o‘zgaradi, chunki har bir so‘rov obunani tekshiradi.",
      },
    },
  ],
  stack: [
    {
      tech: "Vercel Cron",
      why: {
        en: "No process to keep running. Every step is idempotent, so a repeated pass does no harm.",
        ru: "Не нужен постоянный процесс. Каждый шаг идемпотентен, поэтому повторный проход не вредит.",
        uz: "Doimiy jarayon kerak emas. Har bir qadam idempotent, shuning uchun takroriy o‘tish zarar qilmaydi.",
      },
    },
    {
      tech: "mock-ofd, click-ofd",
      why: {
        en: "Every payment in Uzbekistan needs a registered receipt. The provider is one setting: test receipts now, the OFD with a live merchant.",
        ru: "В Узбекистане каждому платежу нужен зарегистрированный чек. Провайдер это одна настройка: сейчас тестовые чеки, с живым мерчантом ОФД.",
        uz: "O‘zbekistonda har bir to‘lovga ro‘yxatdan o‘tgan chek kerak. Provayder bitta sozlama: hozir test cheklar, jonli merchant bilan OFD.",
      },
    },
    {
      tech: "Next.js, Prisma, Vitest",
      why: {
        en: "SQLite locally and Neon Postgres in production; tests use a separate database.",
        ru: "Локально SQLite, на продакшене Neon Postgres; тесты работают с отдельной базой.",
        uz: "Lokal SQLite, produksiyada Neon Postgres; testlar alohida bazada ishlaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Plus, a month", ru: "Plus, месяц", uz: "Plus, oy" }, value: "49 000 UZS" },
    { label: { en: "Pro, a month", ru: "Pro, месяц", uz: "Pro, oy" }, value: "89 000 UZS" },
    { label: { en: "Trial, grace", ru: "Триал, грейс", uz: "Sinov, imtiyoz" }, value: "7, 3" },
  ],
  metricsSource: {
    en: "Default settings from the README, in days for trial and grace.",
    ru: "Настройки по умолчанию из README, триал и грейс в днях.",
    uz: "README’dagi standart sozlamalar, sinov va imtiyoz kunlarda.",
  },
};
