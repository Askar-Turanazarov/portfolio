import type { CaseContent } from "./types";

export const hrSimulator: CaseContent = {
  slug: "hr-simulator",
  kind: {
    en: "AI trainer",
    ru: "AI-тренажёр",
    uz: "AI trenajyor",
  },
  title: {
    en: "An interview trainer that asks follow-ups and ends with an honest breakdown.",
    ru: "Тренажёр собеседований: задаёт уточняющие вопросы и заканчивает честным разбором.",
    uz: "Aniqlashtiruvchi savollar beradigan va halol tahlil bilan yakunlaydigan suhbat trenajyori.",
  },
  hook: {
    en: "An interviewer that can't change the subject until it has got to the bottom of your answer.",
    ru: "Рекрутёр, который не может сменить тему, пока не докопается до сути вашего ответа.",
    uz: "Javobingiz tagiga yetmaguncha mavzuni o‘zgartira olmaydigan rekruter.",
  },
  problem: {
    en: "Interview practice with a chatbot is too polite: it accepts \"we did\" and moves on. A real recruiter asks what you did yourself.",
    ru: "Тренировка с чат-ботом слишком вежлива: он принимает «мы сделали» и идёт дальше. Настоящий рекрутёр спросит, что сделали лично вы.",
    uz: "Chat-bot bilan mashq juda muloyim: u «biz qildik» javobini qabul qilib, davom etadi. Haqiqiy rekruter shaxsan siz nima qilganingizni so‘raydi.",
  },
  note: {
    en: "A study project. The frames below come from the demo mode, without a key, and its report is scripted.",
    ru: "Учебный проект. Кадры ниже сняты в демо-режиме без ключа, разбор в нём сценарный.",
    uz: "O‘quv loyihasi. Quyidagi kadrlar kalitsiz demo rejimida olingan, undagi tahlil ssenariy bo‘yicha.",
  },
  cover: {
    src: "/projects/hr-simulator/cover.webp",
    alt: { en: "The HR Simulator session setup.", ru: "Настройка встречи в HR Simulator.", uz: "HR Simulator’da suhbatni sozlash." },
    caption: { en: "Session setup.", ru: "Настройка встречи.", uz: "Suhbatni sozlash." },
  },
  built: [
    {
      name: { en: "The breakdown", ru: "Разбор", uz: "Tahlil" },
      text: {
        en: "A six-criterion rubric with verbatim quotes, a total, a verdict, the level the answers matched, recommendations and a rewritten version of the weakest answer. Exports to JSON and Markdown.",
        ru: "Рубрика из шести критериев с цитатами, итог, вердикт, уровень, которому соответствовали ответы, рекомендации и переписанный слабейший ответ. Экспорт в JSON и Markdown.",
        uz: "Iqtiboslar bilan olti mezonli rubrika, yakun, xulosa, javoblar mos kelgan daraja, tavsiyalar va eng zaif javobning qayta yozilgani. JSON va Markdown’ga eksport.",
      },
    },
    {
      name: { en: "Meeting phases", ru: "Фазы встречи", uz: "Suhbat bosqichlari" },
      text: {
        en: "Small talk, about yourself, main block, digging into the weakest spot, your questions, wrap-up. A dossier accumulates claimed facts and checks each new answer against them.",
        ru: "Знакомство, о себе, основной блок, копание в слабом месте, ваши вопросы, финал. Досье копит заявленные факты и сверяет с ними каждый новый ответ.",
        uz: "Tanishuv, o‘zingiz haqida, asosiy blok, zaif joyni kovlash, savollaringiz, yakun. Dosye aytilgan faktlarni to‘playdi va har bir yangi javobni ular bilan solishtiradi.",
      },
    },
    {
      name: { en: "Mentor and progress", ru: "Наставник и прогресс", uz: "Murabbiy va progress" },
      text: {
        en: "Breakdowns of tricky questions, self-pitch practice, a rapid drill and offline cheat sheets. History shows the score trend and what keeps sinking round after round.",
        ru: "Разбор каверзных вопросов, тренировка самопрезентации, быстрый драйв и офлайн-шпаргалки. История показывает динамику и то, что раз за разом тянет вниз.",
        uz: "Qiyin savollar tahlili, o‘zini taqdim etish mashqi, tezkor mashq va oflayn shpargalkalar. Tarix ball dinamikasini va qayta-qayta tushirayotgan narsani ko‘rsatadi.",
      },
    },
    {
      name: { en: "Key in the browser, demo without one", ru: "Ключ в браузере, демо без ключа", uz: "Kalit brauzerda, kalitsiz demo" },
      text: {
        en: "There is no server. The Gemini key stays in localStorage and goes only to Google's API. The demo mode runs the whole path offline, and the tests run on it too.",
        ru: "Сервера нет. Ключ Gemini лежит в localStorage и уходит только в API Google. Демо-режим проходит весь путь офлайн, на нём же работают тесты.",
        uz: "Server yo‘q. Gemini kaliti localStorage’da turadi va faqat Google API’siga boradi. Demo rejim butun yo‘lni oflayn o‘tadi, testlar ham unda ishlaydi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "The score isn't the model's", ru: "Итог не от модели", uz: "Yakun modeldan emas" },
      text: {
        en: "The score comes from the rubric weights in code rather than from the model, so the total always agrees with the criteria.",
        ru: "Итог считает код по весам рубрики, а не модель, поэтому он всегда согласуется с критериями.",
        uz: "Yakuniy ballni model emas, kod rubrika vaznlari bo‘yicha hisoblaydi, shuning uchun u mezonlarga doim mos keladi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Modes", ru: "Режима", uz: "Rejimlar" }, value: "4" },
    { label: { en: "Minimum follow-ups", ru: "Минимум уточнений", uz: "Eng kam aniqlashtirish" }, value: "1 / 2 / 3 / 3" },
    { label: { en: "Profession presets", ru: "Профессий", uz: "Kasblar" }, value: "15" },
    { label: { en: "Rubric criteria", ru: "Критериев", uz: "Mezonlar" }, value: "6" },
    { label: { en: "Languages", ru: "Языка", uz: "Tillar" }, value: "3" },
  ],
  metricsSource: {
    en: "src/config/modes.ts, src/config/rubric.ts and the README.",
    ru: "src/config/modes.ts, src/config/rubric.ts и README.",
    uz: "src/config/modes.ts, src/config/rubric.ts va README.",
  },
  stack: [
    {
      tech: "React, Vite, TypeScript",
      why: {
        en: "Fully client-side: the app needs no backend.",
        ru: "Всё на клиенте: бэкенд не нужен.",
        uz: "Hammasi mijozda: backend kerak emas.",
      },
    },
    {
      tech: "Gemini",
      why: {
        en: "The app fetches the available models for the key and picks a suitable one.",
        ru: "Приложение получает доступные для ключа модели и выбирает подходящую.",
        uz: "Ilova kalit uchun mavjud modellarni oladi va mosini tanlaydi.",
      },
    },
  ],
  gallery: [
    {
      src: "/projects/hr-simulator/interview.webp",
      alt: {
        en: "The interview: phases on top, the chat with follow-ups marked, a 44 second timer, hidden recruiter notes.",
        ru: "Собеседование: фазы сверху, переписка с отмеченными уточнениями, таймер 44 с, скрытые заметки рекрутёра.",
        uz: "Suhbat: tepada bosqichlar, belgilangan aniqlashtirishlar, 44 s taymer, yashirin rekruter yozuvlari.",
      },
      caption: {
        en: "Real assessment in the demo mode.",
        ru: "Реальная оценка в демо-режиме.",
        uz: "Demo rejimida haqiqiy baholash.",
      },
    },
    {
      src: "/projects/hr-simulator/report.webp",
      alt: {
        en: "The final breakdown of a demo session.",
        ru: "Итоговый разбор демо-встречи.",
        uz: "Demo suhbatning yakuniy tahlili.",
      },
      caption: { en: "The breakdown.", ru: "Разбор.", uz: "Tahlil." },
    },
  ],
};
