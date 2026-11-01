import type { CaseContent } from "./types";

export const aiSupportAgent: CaseContent = {
  slug: "ai-support-agent",
  title: {
    en: "Works without a key. Add one, and the same chat runs on a real model.",
    ru: "Работает без ключа. Добавьте ключ, и тот же чат пойдёт на настоящей модели.",
    uz: "Kalitsiz ishlaydi. Kalit qo‘shsangiz, o‘sha chat haqiqiy modelda ishlaydi.",
  },
  problem: {
    en: "Most support demos ask for an API key before they show anything, so a visitor never gets as far as the chat.",
    ru: "Большинство демо поддержки просят ключ, прежде чем что-то покажут, и посетитель так и не доходит до чата.",
    uz: "Ko‘p qo‘llab-quvvatlash demolari biror narsa ko‘rsatishdan oldin kalit so‘raydi, tashrifchi esa chatgacha yetib bormaydi.",
  },
  note: {
    en: "A study project. The live demo runs in mock mode, with no key.",
    ru: "Учебный проект. Живое демо работает в режиме сценариев, без ключа.",
    uz: "O‘quv loyihasi. Jonli demo ssenariy rejimida, kalitsiz ishlaydi.",
  },
  cover: {
    src: "/projects/ai-support-agent/chat-light.webp",
    alt: { en: "The support chat in the light theme: a password question and the agent's reply.", ru: "Чат поддержки в светлой теме: вопрос о пароле и ответ агента.", uz: "Yorug‘ mavzudagi chat: parol haqida savol va agent javobi." },
    caption: { en: "The chat.", ru: "Чат.", uz: "Chat." },
  },
  built: [
    {
      name: { en: "44 scenarios, no key", ru: "44 сценария без ключа", uz: "Kalitsiz 44 ssenariy" },
      text: {
        en: "Accounts, billing, technical issues and team access, in Russian and Uzbek, matched by keywords. A Gemini or Anthropic key switches the same chat to a live model.",
        ru: "Аккаунты, оплата, технические проблемы и доступ команды на русском и узбекском, подбор по ключевым словам. Ключ Gemini или Anthropic переводит тот же чат на настоящую модель.",
        uz: "Hisoblar, to‘lov, texnik muammolar va jamoa kirishi rus va o‘zbek tillarida, kalit so‘zlar bo‘yicha. Gemini yoki Anthropic kaliti o‘sha chatni haqiqiy modelga o‘tkazadi.",
      },
    },
    {
      name: { en: "FAQ and suggestions", ru: "FAQ и подсказки", uz: "FAQ va takliflar" },
      text: {
        en: "A modal lists every scenario by category, and a tap sends the question. In mock mode, related questions appear as chips after a reply.",
        ru: "В окне все сценарии по категориям, нажатие отправляет вопрос. В режиме сценариев после ответа появляются связанные вопросы.",
        uz: "Oynada barcha ssenariylar toifalar bo‘yicha, bosish savolni yuboradi. Ssenariy rejimida javobdan keyin bog‘liq savollar chiqadi.",
      },
    },
    {
      name: { en: "A robot made of CSS", ru: "Робот из CSS", uz: "CSS’dan robot" },
      text: {
        en: "The head is layered SVG with CSS 3D transforms. It follows the cursor through perspective, rotateX and rotateY, with no WebGL.",
        ru: "Голова это слои SVG с трансформациями CSS 3D. Она следит за курсором через perspective, rotateX и rotateY, без WebGL.",
        uz: "Bosh CSS 3D o‘zgarishli SVG qatlamlaridan iborat. U kursorni perspective, rotateX va rotateY orqali kuzatadi, WebGL’siz.",
      },
    },
    {
      name: { en: "Edge cases", ru: "Крайние случаи", uz: "Chekka holatlar" },
      text: {
        en: "aria-live regions, keyboard input, an offline banner, retry after an error and a 2,000-character limit on the server.",
        ru: "Области aria-live, ввод с клавиатуры, плашка офлайна, повтор после ошибки и лимит 2000 символов на сервере.",
        uz: "aria-live hududlari, klaviatura kiritishi, oflayn banner, xatodan keyin qayta urinish va serverda 2000 belgi cheklovi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "A prompt outside git", ru: "Промпт вне git", uz: "Git’dan tashqaridagi prompt" },
      text: {
        en: "Persona and topic limits live in a local git-ignored file, read on every message. Editing it changes behaviour without a restart, and a real clinic's details never reach the repository.",
        ru: "Персона и ограничения лежат в локальном файле вне git и читаются на каждое сообщение. Правка меняет поведение без перезапуска, а данные реальной клиники не попадают в репозиторий.",
        uz: "Persona va cheklovlar git’ga kirmaydigan mahalliy faylda turadi va har bir xabarda o‘qiladi. Tahrir xatti-harakatni qayta ishga tushirmasdan o‘zgartiradi, klinika ma’lumotlari esa repozitoriyga tushmaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Scenarios", ru: "Сценария", uz: "Ssenariylar" }, value: "44" },
    { label: { en: "Languages", ru: "Языка", uz: "Tillar" }, value: "2" },
    { label: { en: "Reply timeout", ru: "Таймаут ответа", uz: "Javob taymauti" }, value: "15 s" },
  ],
  metricsSource: {
    en: "scenarios.ts and routes/chat.ts in the repository.",
    ru: "scenarios.ts и routes/chat.ts в репозитории.",
    uz: "Repozitoriydagi scenarios.ts va routes/chat.ts.",
  },
  stack: [
    {
      tech: "React 18, Vite, TypeScript, Tailwind CSS, Zustand",
      why: { en: "A single-page chat with its own design system.", ru: "Одностраничный чат со своей системой оформления.", uz: "O‘z dizayn tizimiga ega bir sahifali chat." },
    },
    {
      tech: "Express, Server-Sent Events",
      why: { en: "The server only talks one way during a reply, and SSE is enough for that.", ru: "Во время ответа сервер говорит в одну сторону, и SSE для этого хватает.", uz: "Javob paytida server bir tomonga gapiradi, SSE bunga yetadi." },
    },
    {
      tech: "react-markdown, rehype-sanitize",
      why: { en: "Replies come as Markdown, and a reply from a model shouldn't be trusted as HTML.", ru: "Ответы приходят в Markdown, а ответу модели нельзя доверять как HTML.", uz: "Javoblar Markdown’da keladi, model javobiga HTML sifatida ishonib bo‘lmaydi." },
    },
  ],
  gallery: [
    {
      src: "/projects/ai-support-agent/chat-dark.webp",
      alt: { en: "The same chat in the dark theme, with a navy background.", ru: "Тот же чат в тёмной теме, тёмно-синий фон.", uz: "O‘sha chat qorong‘i mavzuda, to‘q ko‘k fon." },
      caption: { en: "The dark theme.", ru: "Тёмная тема.", uz: "Qorong‘i mavzu." },
    },
  ],
};
