import type { CaseContent } from "./types";

export const orbitLanding: CaseContent = {
  slug: "orbit-landing",
  kind: {
    en: "AI landing page",
    ru: "Лендинг с AI",
    uz: "AI lending",
  },
  title: {
    en: "A web studio landing page with an AI quiz, lead qualification and Telegram notifications.",
    ru: "Лендинг веб-студии с ИИ-квизом, квалификацией заявок и уведомлениями в Telegram.",
    uz: "AI viktorina, lidlarni saralash va Telegram bildirishnomalari bilan veb-studiya lendingi.",
  },
  hook: {
    en: "The code calculates the price. The AI explains it.",
    ru: "Цену считает код. Объясняет её AI.",
    uz: "Narxni kod hisoblaydi. Uni AI tushuntiradi.",
  },
  problem: {
    en: "A studio's visitor wants a rough price and timeline right now, and the studio wants to know which enquiries are worth a call.",
    ru: "Посетитель студии хочет примерную цену и срок сразу, а студии нужно понять, какие заявки стоят звонка.",
    uz: "Studiya tashrifchisi taxminiy narx va muddatni hozir bilmoqchi, studiyaga esa qaysi so‘rovga qo‘ng‘iroq qilish kerakligi muhim.",
  },
  note: {
    en: "A study project: the studio, its numbers and its clients are invented. The quiz and admin frames come from a local run without API keys, so their text is the scripted fallback, and the lead is a test one.",
    ru: "Учебный проект: студия, её цифры и клиенты вымышлены. Кадры квиза и админки сняты при локальном запуске без ключей API, поэтому текст в них сценарный, а заявка тестовая.",
    uz: "O‘quv loyihasi: studiya, uning raqamlari va mijozlari to‘qima. Kviz va admin kadrlari API kalitlarisiz lokal ishga tushirishda olingan, shuning uchun matn ssenariy bo‘yicha, so‘rov esa test uchun.",
  },
  cover: {
    src: "/projects/orbit-landing/cover.webp",
    alt: { en: "The ORBIT landing page over a 3D space background.", ru: "Лендинг ORBIT на фоне 3D-космоса.", uz: "ORBIT lendingi 3D kosmos fonida." },
    caption: { en: "The landing page.", ru: "Лендинг.", uz: "Lending." },
  },
  built: [
    {
      name: { en: "Model chain", ru: "Цепочка моделей", uz: "Modellar zanjiri" },
      text: {
        en: "Gemini, then Claude, then scripted answers. On a rate limit or an error the chain doesn't wait or retry: the entry goes on cooldown and the next one answers.",
        ru: "Gemini, затем Claude, затем сценарные ответы. При лимите или ошибке цепочка не ждёт и не повторяет запрос: звено уходит на паузу, отвечает следующее.",
        uz: "Gemini, keyin Claude, keyin ssenariy javoblar. Limit yoki xatoda zanjir kutmaydi va qayta urinmaydi: bo‘g‘in pauzaga ketadi, keyingisi javob beradi.",
      },
    },
    {
      name: { en: "Telegram", ru: "Telegram", uz: "Telegram" },
      text: {
        en: "A lead arrives with its label, the quiz answers and a \"take lead\" button. Long polling locally, a webhook on Vercel.",
        ru: "Заявка приходит с меткой, ответами квиза и кнопкой «взять в работу». Локально long polling, на Vercel вебхук.",
        uz: "So‘rov belgi, kviz javoblari va «ishga olish» tugmasi bilan keladi. Lokalda long polling, Vercel’da webhook.",
      },
    },
    {
      name: { en: "Admin panel", ru: "Админка", uz: "Admin panel" },
      text: {
        en: "A password-protected /superadmin: statistics, filters, the qualification and next step for each lead, dialog history, CSV export.",
        ru: "/superadmin по паролю: статистика, фильтры, квалификация и следующий шаг по каждой заявке, история диалога, экспорт CSV.",
        uz: "Parolli /superadmin: statistika, filtrlar, har bir so‘rov bo‘yicha malaka va keyingi qadam, dialog tarixi, CSV eksport.",
      },
    },
    {
      name: { en: "Anti-spam", ru: "Антиспам", uz: "Antispam" },
      text: {
        en: "A honeypot field, a minimum fill time and rate limiting.",
        ru: "Поле-ловушка, минимальное время заполнения и ограничение частоты запросов.",
        uz: "Tuzoq maydon, eng kam to‘ldirish vaqti va so‘rovlar chastotasini cheklash.",
      },
    },
  ],
  hard: [
    {
      title: { en: "A model shouldn't invent a price", ru: "Модель не должна сочинять цену", uz: "Model narxni to‘qimasligi kerak" },
      text: {
        en: "A model should not invent a price. Format, budget fit and timing come from the price list in code, and the model gets only the explanation to write.",
        ru: "Модель не должна сочинять цену. Формат, бюджет и сроки считаются в коде по прайсу, а модели остаётся только объяснить.",
        uz: "Model narxni to‘qimasligi kerak. Format, byudjet va muddat kodda narxnoma bo‘yicha hisoblanadi, modelga faqat tushuntirish qoladi.",
      },
    },
    {
      title: { en: "three.js doesn't reach phones", ru: "three.js не доходит до телефонов", uz: "three.js telefonlarga yetib bormaydi" },
      text: {
        en: "The 3D background is one WebGL canvas in a separate chunk. In a check with phone emulation the page requested neither the three nor the scene chunk, while the desktop requested both.",
        ru: "3D-фон это один холст WebGL в отдельном чанке. При проверке с эмуляцией телефона страница не запросила ни чанк three, ни чанк сцены, а на компьютере запросила оба.",
        uz: "3D fon alohida chankdagi bitta WebGL kanvas. Telefon emulyatsiyasi bilan tekshiruvda sahifa three va sahna chanklarini so‘ramadi, kompyuterda esa ikkalasini so‘radi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Quiz questions", ru: "Вопросов квиза", uz: "Kviz savollari" }, value: "5" },
    { label: { en: "Links in the chain", ru: "Звена цепочки", uz: "Zanjir bo‘g‘inlari" }, value: "3" },
    { label: { en: "Lead labels", ru: "Метки заявки", uz: "So‘rov belgilari" }, value: "3" },
  ],
  metricsSource: {
    en: "The README and qualification.ts in the repository.",
    ru: "README и qualification.ts в репозитории.",
    uz: "Repozitoriydagi README va qualification.ts.",
  },
  stack: [
    {
      tech: "React, Vite, TypeScript, Tailwind CSS",
      why: { en: "A fast static front end for one landing page.", ru: "Быстрый статический фронтенд для одного лендинга.", uz: "Bitta lending uchun tez statik frontend." },
    },
    {
      tech: "three.js, React Three Fiber",
      why: { en: "The background, loaded only where it won't hurt.", ru: "Фон, который загружается только там, где не навредит.", uz: "Faqat zarar qilmaydigan joyda yuklanadigan fon." },
    },
    {
      tech: "Express, Upstash Redis",
      why: { en: "Vercel functions have no disk, so leads and sessions live in Redis. Locally they go to JSON files.", ru: "У функций Vercel нет диска, поэтому заявки и сессии лежат в Redis. Локально это JSON-файлы.", uz: "Vercel funksiyalarida disk yo‘q, shuning uchun so‘rov va sessiyalar Redis’da. Lokalda JSON fayllar." },
    },
    {
      tech: "Gemini, Claude",
      why: { en: "Two providers, so that one limit doesn't stop the assistant.", ru: "Два провайдера, чтобы один лимит не останавливал помощника.", uz: "Bitta limit yordamchini to‘xtatmasligi uchun ikki provayder." },
    },
  ],
  gallery: [
    {
      src: "/projects/orbit-landing/result.webp",
      alt: { en: "The assistant's result card: format, price from and timing, then the explanation and a contact form.", ru: "Карточка итога в помощнике: формат, цена от и срок, затем объяснение и форма контакта.", uz: "Yordamchidagi natija kartasi: format, narx va muddat, keyin izoh va aloqa formasi." },
      caption: { en: "The quiz result.", ru: "Итог квиза.", uz: "Kviz natijasi." },
    },
    {
      src: "/projects/orbit-landing/lead.webp",
      alt: { en: "A test lead in the admin panel: hot label, budget and deadline fit, next step and quiz answers.", ru: "Тестовая заявка в админке: метка «горячая», бюджет и срок, следующий шаг и ответы квиза.", uz: "Admin paneldagi test so‘rovi: «issiq» belgisi, byudjet va muddat, keyingi qadam va kviz javoblari." },
      caption: { en: "The same answers, as the manager sees them.", ru: "Те же ответы глазами менеджера.", uz: "O‘sha javoblar menejer ko‘zi bilan." },
    },
    {
      src: "/projects/orbit-landing/phone.webp",
      alt: { en: "The landing page on a phone, with a CSS gradient instead of the 3D background.", ru: "Лендинг на телефоне: градиент вместо 3D-фона.", uz: "Telefondagi lending: 3D fon o‘rniga gradient." },
      caption: { en: "On a phone, without three.js.", ru: "На телефоне, без three.js.", uz: "Telefonda, three.js’siz." },
    },
  ],
};
