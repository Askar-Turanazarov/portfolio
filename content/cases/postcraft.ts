import type { CaseContent } from "./types";

export const postcraft: CaseContent = {
  slug: "postcraft",
  title: {
    en: "One topic, eight platforms, and a separate rule set for each.",
    ru: "Одна тема, восемь площадок и свои правила для каждой.",
    uz: "Bitta mavzu, sakkizta platforma va har biri uchun alohida qoida.",
  },
  problem: {
    en: "A post written for Instagram reads wrong on LinkedIn, and rewriting it for each network eats the day of a small business owner.",
    ru: "Пост для Instagram странно читается в LinkedIn, а переписывать его под каждую сеть для владельца малого бизнеса значит потерять день.",
    uz: "Instagram uchun yozilgan post LinkedIn’da g‘alati o‘qiladi, har bir tarmoq uchun qayta yozish esa kichik biznes egasining kunini oladi.",
  },
  note: {
    en: "A study project. The live site has no API keys, so you can walk through the form but not generate. To generate, run it locally with your own key. That's also why there is no sample post here.",
    ru: "Учебный проект. На живом сайте нет ключей API: форму можно пройти, но генерация не запустится. Для генерации запустите проект локально со своим ключом. Поэтому здесь и нет примера поста.",
    uz: "O‘quv loyihasi. Jonli saytda API kalitlari yo‘q: formani ko‘rish mumkin, lekin generatsiya ishga tushmaydi. Generatsiya uchun loyihani o‘z kalitingiz bilan lokal ishga tushiring. Shuning uchun bu yerda post namunasi ham yo‘q.",
  },
  cover: {
    src: "/projects/postcraft/hero-light.webp",
    alt: { en: "The PostCraft home screen with a glass panel over a soft background.", ru: "Главный экран PostCraft: стеклянная панель на мягком фоне.", uz: "PostCraft bosh ekrani: yumshoq fon ustidagi shisha panel." },
    caption: { en: "The home screen on the live site.", ru: "Главный экран на живом сайте.", uz: "Jonli saytdagi bosh ekran." },
  },
  built: [
    {
      name: { en: "Variants", ru: "Варианты", uz: "Variantlar" },
      text: {
        en: "One request gives up to four variants as they stream in. Each can be regenerated, copied or downloaded alone, or all of them taken as a ZIP.",
        ru: "Один запрос даёт до четырёх вариантов прямо в потоке. Каждый можно перегенерировать, скопировать или скачать отдельно, а все сразу забрать в ZIP.",
        uz: "Bitta so‘rov oqimning o‘zida to‘rttagacha variant beradi. Har birini alohida qayta yaratish, nusxalash yoki yuklab olish, hammasini esa ZIP’da olish mumkin.",
      },
    },
    {
      name: { en: "Four providers", ru: "Четыре провайдера", uz: "To‘rtta provayder" },
      text: {
        en: "Claude, ChatGPT, Gemini and Groq sit behind one interface. The form shows only the providers that have a key.",
        ru: "Claude, ChatGPT, Gemini и Groq стоят за одним интерфейсом. Форма показывает только провайдеров, для которых есть ключ.",
        uz: "Claude, ChatGPT, Gemini va Groq bitta interfeys ortida turadi. Forma faqat kaliti bor provayderlarni ko‘rsatadi.",
      },
    },
    {
      name: { en: "Liquid glass", ru: "Жидкое стекло", uz: "Suyuq shisha" },
      text: {
        en: "The panels bend what's behind them with SVG displacement filters over backdrop-filter, in a light and a dark theme.",
        ru: "Панели преломляют то, что за ними, через фильтры SVG displacement и backdrop-filter, в светлой и тёмной теме.",
        uz: "Panellar orqasidagi narsani SVG displacement filtrlari va backdrop-filter orqali sindiradi, yorug‘ va qorong‘i mavzuda.",
      },
    },
    {
      name: { en: "Local history", ru: "Локальная история", uz: "Lokal tarix" },
      text: {
        en: "Every generation stays in the browser's localStorage, labelled with its platform, tone and provider. There are no accounts and no database.",
        ru: "Каждая генерация остаётся в localStorage браузера, с подписью площадки, тона и провайдера. Аккаунтов и базы нет.",
        uz: "Har bir generatsiya brauzerning localStorage’ida qoladi, platforma, ohang va provayder yozuvi bilan. Akkaunt va baza yo‘q.",
      },
    },
  ],
  hard: [
    {
      title: { en: "The post language", ru: "Язык поста", uz: "Post tili" },
      text: {
        en: "The post language is separate from the interface language: it follows the interface until you pick another, and defers to the topic if you clearly wrote in something else.",
        ru: "Язык поста отделён от языка интерфейса: он следует за интерфейсом, пока вы не выберете другой, и уступает языку темы, если она явно написана на другом.",
        uz: "Post tili interfeys tilidan alohida: boshqasini tanlamaguningizcha interfeysga ergashadi, mavzu boshqa tilda yozilgan bo‘lsa, o‘sha tilga o‘tadi.",
      },
    },
    {
      title: { en: "Retrying a stream", ru: "Повтор потока", uz: "Oqimni qayta urinish" },
      text: {
        en: "A failed request is retried up to three attempts, but only until the first chunk arrives. After that a retry would print the text twice, so the error goes to the screen instead. Gemini also falls back through a chain of three models.",
        ru: "Упавший запрос повторяется до трёх попыток, но только пока не пришёл первый кусок. После этого повтор напечатал бы текст дважды, поэтому на экран идёт ошибка. У Gemini ещё есть цепочка из трёх моделей.",
        uz: "Muvaffaqiyatsiz so‘rov uch urinishgacha takrorlanadi, lekin faqat birinchi bo‘lak kelguncha. Undan keyin takrorlash matnni ikki marta chiqargan bo‘lardi, shuning uchun ekranga xato chiqadi. Gemini’da yana uchta modeldan iborat zanjir bor.",
      },
    },
    {
      title: { en: "Parsing an unfinished answer", ru: "Разбор незаконченного ответа", uz: "Tugallanmagan javobni tahlil qilish" },
      text: {
        en: "The model writes plain text with markers such as @@TITLE@@ and @@VARIANT@@. The parser runs on every chunk, so the cards fill field by field while the answer is still incomplete.",
        ru: "Модель пишет простой текст с маркерами вроде @@TITLE@@ и @@VARIANT@@. Разбор идёт на каждом куске, поэтому карточки заполняются по полям, пока ответ ещё не закончен.",
        uz: "Model @@TITLE@@ va @@VARIANT@@ kabi markerli oddiy matn yozadi. Tahlil har bir bo‘lakda ishlaydi, shuning uchun kartalar javob tugamasdan maydonma-maydon to‘ladi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Providers", ru: "Провайдера", uz: "Provayderlar" }, value: "4" },
    { label: { en: "Platforms", ru: "Площадок", uz: "Platformalar" }, value: "8" },
    { label: { en: "Tones", ru: "Тонов", uz: "Ohanglar" }, value: "5" },
    { label: { en: "Interface languages", ru: "Языка интерфейса", uz: "Interfeys tillari" }, value: "3" },
  ],
  metricsSource: {
    en: "lib/prompt.ts and app/api/generate/route.ts in the repository. The fifth tone is your own description.",
    ru: "lib/prompt.ts и app/api/generate/route.ts в репозитории. Пятый тон это ваше собственное описание.",
    uz: "Repozitoriydagi lib/prompt.ts va app/api/generate/route.ts. Beshinchi ohang bu o‘zingizning tavsifingiz.",
  },
  stack: [
    {
      tech: "Next.js 16, React 19, TypeScript, Tailwind CSS v4",
      why: { en: "One route streams the reply, and the keys stay on the server.", ru: "Один маршрут отдаёт ответ потоком, а ключи остаются на сервере.", uz: "Bitta marshrut javobni oqimda beradi, kalitlar esa serverda qoladi." },
    },
    {
      tech: "@anthropic-ai/sdk, openai, Gemini REST",
      why: { en: "Groq goes through the OpenAI SDK thanks to its compatible API, and Gemini needs no SDK.", ru: "Groq идёт через SDK OpenAI благодаря совместимому API, а Gemini обходится без SDK.", uz: "Groq mos API tufayli OpenAI SDK orqali ishlaydi, Gemini esa SDK’siz ishlaydi." },
    },
    {
      tech: "jszip",
      why: { en: "The ZIP is assembled in the browser, with no server work.", ru: "ZIP собирается в браузере, без работы сервера.", uz: "ZIP brauzerda yig‘iladi, server ishisiz." },
    },
  ],
  gallery: [
    {
      src: "/projects/postcraft/form-light.webp",
      alt: { en: "The form with a topic filled in and LinkedIn selected, in the light theme.", ru: "Форма с заполненной темой и выбранным LinkedIn, светлая тема.", uz: "Mavzu to‘ldirilgan va LinkedIn tanlangan forma, yorug‘ mavzu." },
      caption: { en: "The form, light theme.", ru: "Форма, светлая тема.", uz: "Forma, yorug‘ mavzu." },
    },
    {
      src: "/projects/postcraft/form-dark.webp",
      alt: { en: "The same form in the dark theme.", ru: "Та же форма в тёмной теме.", uz: "O‘sha forma qorong‘i mavzuda." },
      caption: { en: "The form, dark theme.", ru: "Форма, тёмная тема.", uz: "Forma, qorong‘i mavzu." },
    },
  ],
};
