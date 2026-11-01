import type { CaseContent } from "./types";

export const wingsOfHistory: CaseContent = {
  slug: "wings-of-history",
  title: {
    en: "A museum site whose labels are edited in a database, not in code.",
    ru: "Сайт музея, подписи которого редактируются в базе, а не в коде.",
    uz: "Yozuvlari kodda emas, bazada tahrirlanadigan muzey sayti.",
  },
  problem: {
    en: "A museum changes its exhibits more often than it has a developer on hand.",
    ru: "Музей меняет экспозицию чаще, чем под рукой есть разработчик.",
    uz: "Muzey ekspozitsiyasi dasturchi qo‘l ostida bo‘lishidan ko‘ra tezroq o‘zgaradi.",
  },
  note: {
    en: "A study project: a virtual museum of aviation in Tashkent, not a real institution. The site is in Russian.",
    ru: "Учебный проект: виртуальный музей авиации Ташкента, а не настоящее учреждение. Сайт на русском.",
    uz: "O‘quv loyihasi: Toshkent aviatsiyasining virtual muzeyi, haqiqiy muassasa emas. Sayt rus tilida.",
  },
  cover: {
    src: "/projects/wings-of-history/home.webp",
    alt: { en: "The museum's home page: the title over a dark photo of a transport plane at dusk, with a green button.", ru: "Главная страница музея: заголовок поверх тёмного снимка транспортного самолёта в сумерках и зелёная кнопка.", uz: "Muzeyning bosh sahifasi: shomdagi transport samolyotining to‘q surati ustidagi sarlavha va yashil tugma." },
    caption: { en: "The live site.", ru: "Живой сайт.", uz: "Jonli sayt." },
  },
  built: [
    {
      name: { en: "The collection", ru: "Коллекция", uz: "Kolleksiya" },
      text: {
        en: "Cards for planes, a helicopter and aircraft plants of the region, with a filter by type. Tashkent's own production runs through it: the An-22 and Il-76 were built here.",
        ru: "Карточки самолётов, вертолёта и авиазаводов региона с фильтром по типу. Через коллекцию проходит собственное производство Ташкента: здесь строили Ан-22 и Ил-76.",
        uz: "Samolyotlar, vertolyot va mintaqa aviazavodlari kartalari, tur bo‘yicha filtr bilan. Kolleksiyadan Toshkentning o‘z ishlab chiqarishi o‘tadi: An-22 va Il-76 shu yerda qurilgan.",
      },
    },
    {
      name: { en: "Content in tables", ru: "Контент в таблицах", uz: "Kontent jadvallarda" },
      text: {
        en: "Exhibits, the hero block in hero_settings and the text of other pages in pages_content. Even how many characters a card shows is a value in the database: card_text_limit.",
        ru: "Экспонаты, главный экран в hero_settings и тексты других страниц в pages_content. Даже число символов на карточке это значение в базе: card_text_limit.",
        uz: "Eksponatlar, hero_settings’dagi bosh ekran va pages_content’dagi boshqa sahifalar matni. Hatto kartadagi belgilar soni ham bazadagi qiymat: card_text_limit.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Started in Lovable", ru: "Начат в Lovable", uz: "Lovable’da boshlangan" },
      text: {
        en: "I started it in Lovable on TanStack Start and Supabase. The content lives in tables, so pages stay editable without a new build.",
        ru: "Проект начат в Lovable на TanStack Start и Supabase. Контент лежит в таблицах, поэтому страницы правятся без новой сборки.",
        uz: "Loyiha Lovable’da TanStack Start va Supabase asosida boshlangan. Kontent jadvallarda turadi, shuning uchun sahifalar yangi yig‘ishsiz tahrirlanadi.",
      },
    },
    {
      title: { en: "Public reads, private writes", ru: "Читать всем, писать через сервер", uz: "O‘qish hammaga, yozish server orqali" },
      text: {
        en: "The first migration let anyone write to the exhibits table. The second one, the same day, dropped those policies: now the public key only reads, and changes go through server functions behind an admin session.",
        ru: "Первая миграция разрешала запись в таблицу экспонатов всем. Вторая, в тот же день, сняла эти политики: теперь публичный ключ только читает, а изменения идут через серверные функции за сессией администратора.",
        uz: "Birinchi migratsiya eksponatlar jadvaliga hammaga yozishga ruxsat bergan. Ikkinchisi, o‘sha kuniyoq, bu siyosatlarni olib tashladi: endi ochiq kalit faqat o‘qiydi, o‘zgarishlar esa administrator sessiyasi ortidagi server funksiyalari orqali o‘tadi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Rows in exhibits", ru: "Строк в exhibits", uz: "exhibits qatorlari" }, value: "8" },
    { label: { en: "Planes", ru: "Самолётов", uz: "Samolyotlar" }, value: "5" },
    { label: { en: "Helicopters", ru: "Вертолётов", uz: "Vertolyotlar" }, value: "1" },
    { label: { en: "Plants", ru: "Заводов", uz: "Zavodlar" }, value: "2" },
  ],
  metricsSource: {
    en: "The public response of the live site on November 1, 2026.",
    ru: "Публичный ответ живого сайта на 1 ноября 2026 года.",
    uz: "Jonli saytning 2026 yil 1 noyabrdagi ochiq javobi.",
  },
  stack: [
    {
      tech: "TanStack Start, React 19, Tailwind CSS 4",
      why: { en: "What Lovable generated, with server functions for the admin side.", ru: "То, что сгенерировал Lovable, с серверными функциями для админки.", uz: "Lovable yaratgan narsa, admin qismi uchun server funksiyalari bilan." },
    },
    {
      tech: "Supabase",
      why: { en: "Postgres with row-level security, so the browser can read directly and nothing else.", ru: "Postgres с RLS: браузер читает напрямую и больше ничего не может.", uz: "RLS’li Postgres: brauzer to‘g‘ridan-to‘g‘ri o‘qiydi va boshqa hech narsa qila olmaydi." },
    },
  ],
};
