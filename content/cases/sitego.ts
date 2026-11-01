import type { CaseContent } from "./types";

export const sitego: CaseContent = {
  slug: "sitego",
  kind: {
    en: "Site builder",
    ru: "Конструктор сайтов",
    uz: "Sayt konstruktori",
  },
  title: {
    en: "A no-code CMS: block editor, twelve templates and export to HTML.",
    ru: "No-code CMS: блочный редактор, двенадцать шаблонов и экспорт в HTML.",
    uz: "No-code CMS: blokli muharrir, o‘n ikki shablon va HTMLga eksport.",
  },
  hook: {
    en: "Twelve sites that don't look related, and a ZIP that looks the same as the live one.",
    ru: "Двенадцать сайтов, не похожих друг на друга, и ZIP, который выглядит точно как живой сайт.",
    uz: "Bir-biriga o‘xshamaydigan o‘n ikkita sayt va jonli saytdek ko‘rinadigan ZIP.",
  },
  problem: {
    en: "A small business wants a site it can edit and doesn't want a server forever. Most builders offer one or the other.",
    ru: "Малому бизнесу нужен сайт, который можно править, но без вечного сервера. Многие конструкторы дают что-то одно.",
    uz: "Kichik biznesga tahrirlanadigan sayt kerak, lekin doimiy serversiz. Ko‘p konstruktorlar faqat bittasini beradi.",
  },
  note: {
    en: "A study project. The businesses in the templates are invented, and the public deployment is read-only.",
    ru: "Учебный проект. Компании в шаблонах вымышленные, публичный сайт работает только на чтение.",
    uz: "O‘quv loyihasi. Shablonlardagi kompaniyalar to‘qima, ommaviy sayt faqat o‘qish uchun ishlaydi.",
  },
  cover: {
    src: "/projects/sitego/cover.webp",
    alt: { en: "The SiteGo home page.", ru: "Главная страница SiteGo.", uz: "SiteGo bosh sahifasi." },
    caption: { en: "The builder's own site.", ru: "Собственный сайт конструктора.", uz: "Konstruktorning o‘z sayti." },
  },
  built: [
    {
      name: { en: "Block editor", ru: "Редактор блоков", uz: "Blok muharriri" },
      text: {
        en: "Blocks are dragged on the preview itself, inserted between one another, duplicated and hidden. Colours, sizes, padding and alignment change per block without CSS.",
        ru: "Блоки перетаскиваются прямо на предпросмотре, вставляются между другими, дублируются и скрываются. Цвета, размеры, отступы и выравнивание меняются у каждого блока без CSS.",
        uz: "Bloklar to‘g‘ridan-to‘g‘ri oldindan ko‘rishda suriladi, orasiga qo‘shiladi, nusxalanadi va yashiriladi. Ranglar, o‘lchamlar, chekinish va tekislash har bir blokda CSS’siz o‘zgaradi.",
      },
    },
    {
      name: { en: "Three languages, three trees", ru: "Три языка, три дерева", uz: "Uch til, uch daraxt" },
      text: {
        en: "Every page and article keeps three independent block trees. The structure stays in sync and only the text differs.",
        ru: "Каждая страница и статья хранят три независимых дерева блоков. Структура синхронна, различается только текст.",
        uz: "Har bir sahifa va maqola uchta mustaqil blok daraxtini saqlaydi. Tuzilma sinxron, faqat matn farq qiladi.",
      },
    },
    {
      name: { en: "ZIP export", ru: "Экспорт в ZIP", uz: "ZIP eksport" },
      text: {
        en: "A /{locale}/... tree and an assets folder, ready for any static host and needing no backend.",
        ru: "Дерево /{locale}/... и папка assets: подходит для любого статического хостинга, бэкенд не нужен.",
        uz: "/{locale}/... daraxti va assets papkasi: har qanday statik xostingga mos, backend kerak emas.",
      },
    },
    {
      name: { en: "Security", ru: "Безопасность", uz: "Xavfsizlik" },
      text: {
        en: "Editor HTML is sanitized on save, on the live site and in the export. The media library rejects SVG on purpose, because it can carry a script. There is no Content-Security-Policy yet, and the README says so.",
        ru: "HTML из редактора очищается при сохранении, и на сайте, и в экспорте. Медиатека намеренно не принимает SVG: он может нести скрипт. Content-Security-Policy пока нет, README об этом говорит прямо.",
        uz: "Muharrir HTML’i saqlashda tozalanadi, saytda ham, eksportda ham. Media kutubxona SVG’ni ataylab qabul qilmaydi: u skript olib yurishi mumkin. Content-Security-Policy hali yo‘q, README buni ochiq aytadi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "One block, two renderers", ru: "Один блок, два рендера", uz: "Bitta blok, ikki render" },
      text: {
        en: "A block is described once. The React component and the HTML generator share class strings, so a React component never has to fit into a string renderer.",
        ru: "Блок описан один раз. React-компонент и HTML-генератор используют общие строки классов, поэтому компонент не нужно втискивать в строковый рендер.",
        uz: "Blok bir marta tasvirlanadi. React komponenti va HTML generatori umumiy klass satrlaridan foydalanadi, shuning uchun komponentni satrli renderga sig‘dirish shart emas.",
      },
    },
    {
      title: { en: "Why the templates don't blur together", ru: "Почему шаблоны не слипаются", uz: "Nega shablonlar bir-biriga o‘xshab qolmaydi" },
      text: {
        en: "The skin and block stylesheets sit outside @layer on purpose, so they beat both Tailwind utilities and HeroUI. One library style in layers cannot override a niche skin.",
        ru: "Стили оформления и блоков намеренно лежат вне @layer, поэтому перебивают и утилиты Tailwind, и HeroUI. Стиль библиотеки в слоях не может перекрыть нишевое оформление.",
        uz: "Bezak va blok uslublari ataylab @layer’dan tashqarida, shuning uchun Tailwind utilitalari va HeroUI’dan ustun turadi. Qatlamlardagi kutubxona uslubi maxsus bezakni bosib o‘tolmaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Block types", ru: "Типов блоков", uz: "Blok turlari" }, value: "14" },
    { label: { en: "Palettes", ru: "Палитр", uz: "Palitralar" }, value: "12" },
    { label: { en: "Visual styles", ru: "Стилей", uz: "Uslublar" }, value: "12" },
    { label: { en: "Site templates", ru: "Шаблонов сайтов", uz: "Sayt shablonlari" }, value: "12" },
    { label: { en: "Content languages", ru: "Языка контента", uz: "Kontent tillari" }, value: "3" },
  ],
  metricsSource: {
    en: "BLOCK_TYPES in src/blocks/types.ts, the template registry and the README.",
    ru: "BLOCK_TYPES в src/blocks/types.ts, реестр шаблонов и README.",
    uz: "src/blocks/types.ts’dagi BLOCK_TYPES, shablonlar reyestri va README.",
  },
  stack: [
    {
      tech: "Next.js 16, React 19",
      why: {
        en: "The portal, the admin and the built site in one application.",
        ru: "Портал, админка и собранный сайт в одном приложении.",
        uz: "Portal, admin va yig‘ilgan sayt bitta ilovada.",
      },
    },
    {
      tech: "HeroUI v3 (@heroui/styles)",
      why: {
        en: "Taken as CSS only: a class name fits a string renderer, a React component doesn't.",
        ru: "Взят только как CSS: имя класса помещается в строковый рендер, а React-компонент нет.",
        uz: "Faqat CSS sifatida olingan: klass nomi satrli renderga sig‘adi, React komponenti esa yo‘q.",
      },
    },
    {
      tech: "Prisma 7, SQLite",
      why: {
        en: "One file is enough for a single-admin CMS.",
        ru: "Для CMS с одним администратором хватает одного файла.",
        uz: "Bitta administratorli CMS uchun bitta fayl yetarli.",
      },
    },
    {
      tech: "TipTap, dnd-kit, archiver",
      why: {
        en: "Limited rich text, dragging, and the ZIP.",
        ru: "Ограниченный rich text, перетаскивание и ZIP.",
        uz: "Cheklangan rich text, surish va ZIP.",
      },
    },
  ],
};
