import type { CaseContent } from "./types";

export const tutorhook: CaseContent = {
  slug: "tutorhook",
  title: {
    en: "One HTML file, one serverless function, three materials to choose from.",
    ru: "Один HTML-файл, одна бессерверная функция и три материала на выбор.",
    uz: "Bitta HTML fayl, bitta serverless funksiya va tanlash uchun uchta material.",
  },
  problem: {
    en: "A tutor knows the subject but not how to sell a course in a Telegram post or an OLX listing.",
    ru: "Репетитор знает свой предмет, но не умеет продать курс постом в Telegram или объявлением на OLX.",
    uz: "Repetitor o‘z fanini biladi, lekin kursni Telegram posti yoki OLX e’loni bilan sotishni bilmaydi.",
  },
  note: {
    en: "A study project.",
    ru: "Учебный проект.",
    uz: "O‘quv loyihasi.",
  },
  cover: {
    src: "/projects/tutorhook/theme-glass.webp",
    alt: { en: "TutorHook in the glass theme: frosted panels over a purple and teal gradient.", ru: "TutorHook в стеклянной теме: матовые панели на сине-фиолетовом градиенте.", uz: "TutorHook shisha mavzuda: binafsha-moviy gradient ustida xira panellar." },
    caption: { en: "The glass theme on the live site.", ru: "Стеклянная тема на живом сайте.", uz: "Jonli saytdagi shisha mavzu." },
  },
  built: [
    {
      name: { en: "From a form to a post", ru: "Из формы в пост", uz: "Formadan postga" },
      text: {
        en: "A few details about the course become a post that follows PAS/AIDA: the pain of this audience, the method, then the call to action. One request gives one to three separate texts, not alternate headlines.",
        ru: "Несколько данных о курсе превращаются в пост по модели PAS/AIDA: боль этой аудитории, метод, затем призыв. Один запрос даёт от одного до трёх отдельных текстов, а не варианты заголовка.",
        uz: "Kurs haqidagi bir nechta ma’lumot PAS/AIDA modeli bo‘yicha postga aylanadi: shu auditoriya muammosi, usul, keyin chaqiriq. Bitta so‘rov sarlavha variantlarini emas, bittadan uchtagacha alohida matn beradi.",
      },
    },
    {
      name: { en: "Five providers", ru: "Пять провайдеров", uz: "Beshta provayder" },
      text: {
        en: "Claude, OpenAI, Gemini, Groq and OpenRouter are tried in order, among those with a key. Each attempt is capped at 15 seconds, and the visitor doesn't see the switch.",
        ru: "Claude, OpenAI, Gemini, Groq и OpenRouter пробуются по очереди, среди тех, у кого есть ключ. Каждая попытка ограничена 15 секундами, а посетитель переключения не видит.",
        uz: "Claude, OpenAI, Gemini, Groq va OpenRouter kaliti borlari orasida navbat bilan sinab ko‘riladi. Har bir urinish 15 soniya bilan cheklangan, tashrifchi esa almashishni ko‘rmaydi.",
      },
    },
    {
      name: { en: "Files and history", ru: "Файлы и история", uz: "Fayllar va tarix" },
      text: {
        en: "One variant downloads as .txt, all of them as a ZIP assembled in the browser. Recent generations stay in localStorage and can be reopened.",
        ru: "Один вариант скачивается как .txt, все сразу как ZIP, собранный в браузере. Последние генерации лежат в localStorage, их можно открыть снова.",
        uz: "Bitta variant .txt sifatida, hammasi brauzerda yig‘ilgan ZIP sifatida yuklanadi. Oxirgi generatsiyalar localStorage’da turadi, ularni qayta ochish mumkin.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Written in the language, not translated", ru: "Написано на языке, а не переведено", uz: "Tarjima emas, shu tilda yozilgan" },
      text: {
        en: "The whole prompt, system instruction included, is rewritten for the chosen language. So the post is written in Uzbek rather than translated into it afterwards.",
        ru: "Весь промпт, включая системную инструкцию, переписан под выбранный язык. Поэтому пост пишется по-узбекски, а не переводится потом.",
        uz: "Butun prompt, tizim ko‘rsatmasi bilan birga, tanlangan tilga moslab yozilgan. Shuning uchun post keyin tarjima qilinmaydi, balki o‘zbekcha yoziladi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Providers", ru: "Провайдеров", uz: "Provayderlar" }, value: "5" },
    { label: { en: "Variants per request", ru: "Вариантов за запрос", uz: "So‘rovdagi variantlar" }, value: "1–3" },
    { label: { en: "Themes", ru: "Темы", uz: "Mavzular" }, value: "3" },
    { label: { en: "Languages", ru: "Языка", uz: "Tillar" }, value: "3" },
    { label: { en: "Limit per attempt", ru: "Лимит на попытку", uz: "Urinish chegarasi" }, value: "15 s" },
  ],
  metricsSource: {
    en: "api/generate.js and assets/app.js in the repository. The README puts generation at 2–4 seconds per variant on the default models; I didn't measure this.",
    ru: "api/generate.js и assets/app.js в репозитории. README называет 2–4 секунды на вариант на моделях по умолчанию; отдельно я это не замерял.",
    uz: "Repozitoriydagi api/generate.js va assets/app.js. README standart modellarda variantga 2–4 soniya deydi; buni alohida o‘lchamaganman.",
  },
  stack: [
    {
      tech: "Static index.html, Tailwind CDN, Alpine.js",
      why: { en: "A form and a card don't need a build step.", ru: "Форме и карточке не нужна сборка.", uz: "Forma va kartaga yig‘ish bosqichi kerak emas." },
    },
    {
      tech: "One Vercel serverless function",
      why: { en: "It holds the keys and the fallback order, and nothing else needs a server.", ru: "Она хранит ключи и порядок фолбэка, а остальному сервер не нужен.", uz: "U kalitlar va fallback tartibini saqlaydi, qolganiga server kerak emas." },
    },
  ],
  gallery: [
    {
      src: "/projects/tutorhook/theme-skeuo.webp",
      alt: { en: "The app in the skeuomorphic theme: paper panels with stitched borders on a dark brown background.", ru: "Приложение в скевоморфной теме: бумажные панели со строчкой по краю на тёмно-коричневом фоне.", uz: "Ilova skevomorf mavzuda: to‘q jigarrang fonda chetlari tikilgan qog‘oz panellar." },
      caption: { en: "Skeuomorphism.", ru: "Скевоморфизм.", uz: "Skevomorfizm." },
    },
    {
      src: "/projects/tutorhook/theme-neu.webp",
      alt: { en: "The app in the clay theme: pastel lavender panels with soft, rounded volume.", ru: "Приложение в клеймоморфной теме: пастельные лавандовые панели с мягким округлым объёмом.", uz: "Ilova kley mavzuda: yumshoq yumaloq hajmli pastel nilufar panellar." },
      caption: { en: "Claymorphism.", ru: "Клеймоморфизм.", uz: "Kleymorfizm." },
    },
  ],
};
