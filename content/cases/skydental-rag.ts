import type { CaseContent } from "./types";

export const skydentalRag: CaseContent = {
  slug: "skydental-rag",
  kind: {
    en: "AI assistant",
    ru: "AI-ассистент",
    uz: "AI yordamchi",
  },
  title: {
    en: "A dental clinic assistant that answers only from the knowledge base and shows how it found the answer.",
    ru: "Ассистент стоматологии отвечает только по базе знаний и показывает, как нашёл ответ.",
    uz: "Faqat bilimlar bazasidan javob beradigan va javobni qanday topganini ko‘rsatadigan stomatologiya yordamchisi.",
  },
  hook: {
    en: "A clinic chat that shows where every answer came from, and says so when it doesn't know.",
    ru: "Чат клиники, который показывает, откуда взят каждый ответ, и честно говорит, когда не знает.",
    uz: "Har bir javob qayerdan olinganini ko‘rsatadigan va bilmasa, ochiq aytadigan klinika chati.",
  },
  problem: {
    en: "In medicine an invented answer is worse than none. A patient asks about a price or a procedure, and a generic model replies confidently without knowing this clinic at all.",
    ru: "В медицине выдуманный ответ хуже, чем никакого. Пациент спрашивает о цене или процедуре, а обычная модель уверенно отвечает, ничего не зная об этой клинике.",
    uz: "Tibbiyotda to‘qib chiqarilgan javob javobsizlikdan yomonroq. Bemor narx yoki muolaja haqida so‘raydi, oddiy model esa bu klinikani bilmasa ham ishonch bilan javob beradi.",
  },
  note: {
    en: "A course project about RAG. The clinic and its prices are examples.",
    ru: "Учебный проект про RAG. Клиника и её цены приведены как пример.",
    uz: "RAG haqidagi o‘quv loyihasi. Klinika va narxlari namuna sifatida berilgan.",
  },
  cover: {
    src: "/projects/skydental-rag/cover.webp",
    alt: {
      en: "The SkyDental landing page with the chat assistant.",
      ru: "Лендинг SkyDental с чат-ассистентом.",
      uz: "Chat-yordamchili SkyDental lendingi.",
    },
    caption: {
      en: "The clinic's site in Russian and Uzbek, with the assistant in one panel.",
      ru: "Сайт клиники на русском и узбекском, ассистент в отдельной панели.",
      uz: "Klinika sayti rus va o‘zbek tillarida, yordamchi alohida panelda.",
    },
  },
  built: [
    {
      name: { en: "Student mode", ru: "Режим студента", uz: "Talaba rejimi" },
      text: {
        en: "One button asks the same model without the knowledge base and puts the two answers one under the other. Without RAG it usually makes up prices.",
        ru: "Одна кнопка задаёт тот же вопрос той же модели без базы и ставит ответы друг под другом. Без RAG модель обычно выдумывает цены.",
        uz: "Bitta tugma o‘sha savolni o‘sha modelga bazasiz beradi va javoblarni ketma-ket qo‘yadi. RAG’siz model odatda narxni to‘qiydi.",
      },
    },
    {
      name: { en: "A base in Google Drive", ru: "База в Google Drive", uz: "Google Drive’dagi baza" },
      text: {
        en: "The clinic edits Word and Excel files. One section or table row becomes one chunk, and only chunks whose hash changed are embedded again: fix a price, recalculate one vector.",
        ru: "Клиника правит файлы Word и Excel. Раздел или строка таблицы становится одним чанком, и заново считаются только чанки с новым хешем: поправили цену, пересчитали один вектор.",
        uz: "Klinika Word va Excel fayllarini tahrir qiladi. Bo‘lim yoki jadval qatori bitta chunk bo‘ladi, faqat xeshi o‘zgargan chunklar qayta hisoblanadi: narx tuzatilsa, bitta vektor yangilanadi.",
      },
    },
    {
      name: { en: "Admin panel", ru: "Админка", uz: "Admin panel" },
      text: {
        en: "Dialogs with their full traces, knowledge gaps grouped by word stems, a base editor with versions, model status and a retrieval sandbox.",
        ru: "Диалоги с полными трейсами, пробелы знаний, сгруппированные по основам слов, редактор базы с версиями, статус моделей и песочница поиска.",
        uz: "To‘liq treysli dialoglar, so‘z o‘zaklari bo‘yicha guruhlangan bilim bo‘shliqlari, versiyali baza muharriri, modellar holati va qidiruv sinov maydoni.",
      },
    },
    {
      name: { en: "Fallback chain", ru: "Цепочка моделей", uz: "Modellar zanjiri" },
      text: {
        en: "Gemini by default, light models only. OpenAI, OpenRouter, Groq, DeepSeek, Anthropic and Ollama each need one environment variable.",
        ru: "По умолчанию Gemini, только лёгкие модели. OpenAI, OpenRouter, Groq, DeepSeek, Anthropic и Ollama подключаются одной переменной окружения каждая.",
        uz: "Standart holatda Gemini, faqat yengil modellar. OpenAI, OpenRouter, Groq, DeepSeek, Anthropic va Ollama har biri bitta muhit o‘zgaruvchisi bilan ulanadi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "The threshold is measured", ru: "Порог измеряется", uz: "Chegara o‘lchanadi" },
      text: {
        en: "Picking the refusal threshold is a measurement, not a guess. The eval sweeps every value from 0 to 1 on 35 questions, including ones deliberately outside the base.",
        ru: "Порог отказа подбирается замером, а не на глаз. Оценка проходит все значения от 0 до 1 на 35 вопросах, включая намеренно не из базы.",
        uz: "Rad etish chegarasi taxmin bilan emas, o‘lchov bilan tanlanadi. Baholash 0 dan 1 gacha barcha qiymatlarni 35 savolda sinaydi, ular orasida ataylab bazadan tashqaridagilari ham bor.",
      },
    },
    {
      title: { en: "Two languages, one search", ru: "Два языка, один поиск", uz: "Ikki til, bitta qidiruv" },
      text: {
        en: "Vector and full-text results have different scales, so RRF adds up ranks rather than scores. One SQL query covers both languages, and a question in Uzbek can find a Russian fragment.",
        ru: "У векторного и полнотекстового поиска разные шкалы, поэтому RRF складывает ранги, а не оценки. Один SQL-запрос покрывает оба языка, и вопрос на узбекском может найти русский фрагмент.",
        uz: "Vektor va to‘liq matnli qidiruv shkalalari har xil, shuning uchun RRF baholarni emas, o‘rinlarni qo‘shadi. Bitta SQL so‘rov ikki tilni qamrab oladi, o‘zbekcha savol ruscha bo‘lakni topa oladi.",
      },
    },
    {
      title: { en: "The base is data, not orders", ru: "База это данные, а не команды", uz: "Baza buyruq emas, ma’lumot" },
      text: {
        en: "Fragments, history and the question are wrapped in tags and treated as data. Clinic facts may come only from numbered fragments, and symptoms get a referral to a doctor, not a diagnosis.",
        ru: "Фрагменты, история и вопрос обёрнуты в теги и считаются данными. Факты о клинике берутся только из пронумерованных фрагментов, а на симптомы бот направляет к врачу, а не ставит диагноз.",
        uz: "Bo‘laklar, tarix va savol teglarga o‘ralgan va ma’lumot hisoblanadi. Klinika faktlari faqat raqamlangan bo‘laklardan olinadi, simptomlarda bot tashxis qo‘ymay, shifokorga yo‘naltiradi.",
      },
    },
  ],
  stack: [
    {
      tech: "Postgres + pgvector",
      why: {
        en: "Vector and keyword search in one query, with no separate search service.",
        ru: "Векторный и ключевой поиск одним запросом, без отдельного поискового сервиса.",
        uz: "Vektor va kalit so‘z qidiruvi bitta so‘rovda, alohida qidiruv xizmatisiz.",
      },
    },
    {
      tech: "Neon, PGlite",
      why: {
        en: "The full stack runs locally with no Docker, cloud or keys.",
        ru: "Весь стек запускается локально без Docker, облака и ключей.",
        uz: "To‘liq stek Docker, bulut va kalitsiz lokal ishlaydi.",
      },
    },
    {
      tech: "Hono, SSE",
      why: {
        en: "One Vercel function, and the search result reaches the chat before the first word of the answer.",
        ru: "Одна функция Vercel, а результат поиска приходит в чат раньше первого слова ответа.",
        uz: "Bitta Vercel funksiyasi, qidiruv natijasi chatga javobning birinchi so‘zidan oldin keladi.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "Golden questions", ru: "Контрольных вопросов", uz: "Nazorat savollari" },
      value: "35",
      note: {
        en: "Russian, Uzbek, across languages, follow-ups, outside the base. The quality report has not been run on Gemini yet, so I publish no hit@k here.",
        ru: "Русские, узбекские, межъязыковые, уточняющие и вне базы. Отчёт о качестве на Gemini ещё не запускался, поэтому hit@k здесь не публикую.",
        uz: "Ruscha, o‘zbekcha, tillararo, aniqlashtiruvchi va bazadan tashqari. Gemini’da sifat hisoboti hali ishga tushirilmagan, shuning uchun hit@k bu yerda yo‘q.",
      },
    },
    {
      label: { en: "Text contrast", ru: "Контраст текста", uz: "Matn kontrasti" },
      value: "17.4:1",
      note: {
        en: "Secondary text and accent 5.9:1, calculated from the actual colours.",
        ru: "Второстепенный текст и акцент 5,9:1, рассчитано по настоящим цветам.",
        uz: "Ikkilamchi matn va aksent 5,9:1, haqiqiy ranglardan hisoblangan.",
      },
    },
  ],
};
