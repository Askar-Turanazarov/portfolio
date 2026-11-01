import type { CaseContent } from "./types";

export const corecraftPc: CaseContent = {
  slug: "corecraft-pc",
  title: {
    en: "Try to build a PC that doesn't fit. The checker will tell you why.",
    ru: "Попробуйте собрать компьютер, который не соберётся. Конструктор объяснит, почему.",
    uz: "Yig‘ilmaydigan kompyuter yig‘ib ko‘ring. Konstruktor sababini aytadi.",
  },
  problem: {
    en: "Parts from a catalogue can each be fine and still not work together: wrong socket, a card longer than the case, a weak power supply.",
    ru: "Каждая деталь из каталога может быть хорошей, а вместе они не заработают: другой сокет, видеокарта длиннее корпуса, слабый блок питания.",
    uz: "Katalogdagi har bir detal yaxshi bo‘lishi mumkin, lekin birga ishlamaydi: boshqa soket, korpusdan uzun videokarta, kuchsiz quvvat bloki.",
  },
  note: {
    en: "A study project. The live site takes no real payments: without a provider token, Telegram payments run in sandbox mode.",
    ru: "Учебный проект. Настоящих платежей на сайте нет: без токена провайдера оплата через Telegram работает в режиме песочницы.",
    uz: "O‘quv loyihasi. Saytda haqiqiy to‘lov yo‘q: provayder tokenisiz Telegram orqali to‘lov sinov rejimida ishlaydi.",
  },
  cover: {
    src: "/projects/corecraft-pc/cover.webp",
    alt: { en: "The CoreCraft PC home page.", ru: "Главная страница CoreCraft PC.", uz: "CoreCraft PC bosh sahifasi." },
    caption: { en: "The store.", ru: "Магазин.", uz: "Do‘kon." },
  },
  built: [
    {
      name: { en: "PC builder", ru: "Конструктор", uz: "Konstruktor" },
      text: {
        en: "Parts are picked slot by slot, and every change runs the compatibility rules at once. The same pure functions work in the browser and on the server.",
        ru: "Детали выбираются по слотам, и каждая замена сразу запускает правила совместимости. Одни и те же чистые функции работают в браузере и на сервере.",
        uz: "Detallar uyacha bo‘yicha tanlanadi, har bir almashtirish moslik qoidalarini darhol ishga tushiradi. Bir xil sof funksiyalar brauzerda ham, serverda ham ishlaydi.",
      },
    },
    {
      name: { en: "3D view", ru: "3D-вид", uz: "3D ko‘rinish" },
      text: {
        en: "The machine takes shape as parts are added, and the finished build can be rotated.",
        ru: "Машина собирается по мере добавления деталей, готовую сборку можно вращать.",
        uz: "Kompyuter detal qo‘shilgan sari shakllanadi, tayyor yig‘mani aylantirish mumkin.",
      },
    },
    {
      name: { en: "Telegram invoices in sum", ru: "Счета в сумах через Telegram", uz: "Telegram orqali so‘mdagi hisoblar" },
      text: {
        en: "Payment goes through Bot API invoices in UZS. With no provider token the site simulates the payment, so it needs neither a bot nor public HTTPS in development.",
        ru: "Оплата идёт через счета Bot API в UZS. Без токена провайдера сайт имитирует платёж, поэтому при разработке не нужны ни бот, ни публичный HTTPS.",
        uz: "To‘lov UZS’dagi Bot API hisoblari orqali o‘tadi. Provayder tokeni bo‘lmasa, sayt to‘lovni taqlid qiladi, shuning uchun ishlab chiqishda bot ham, ochiq HTTPS ham kerak emas.",
      },
    },
    {
      name: { en: "Hidden admin", ru: "Скрытая админка", uz: "Yashirin admin" },
      text: {
        en: "It opens only at a secret path set in the environment. Prices and the FPS coefficients of each game are edited there.",
        ru: "Открывается только по секретному пути из окружения. Там правятся цены и коэффициенты FPS каждой игры.",
        uz: "Faqat muhitda berilgan maxfiy manzil orqali ochiladi. Narxlar va har bir o‘yinning FPS koeffitsiyentlari shu yerda tahrirlanadi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Being honest about FPS", ru: "Честность про FPS", uz: "FPS haqida halollik" },
      text: {
        en: "FPS numbers are a model, not a benchmark, and the page says so. The coefficients are editable, so a wrong estimate can be fixed without touching code.",
        ru: "Цифры FPS это модель, а не бенчмарк, и на странице так и написано. Коэффициенты правятся, поэтому неверную оценку можно исправить без кода.",
        uz: "FPS raqamlari benchmark emas, model, sahifada ham shunday yozilgan. Koeffitsiyentlar tahrirlanadi, shuning uchun noto‘g‘ri bahoni kodsiz tuzatish mumkin.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "Games in the FPS model", ru: "Игр в модели FPS", uz: "FPS modelidagi o‘yinlar" },
      value: "50",
    },
    {
      label: { en: "Components in the seed", ru: "Компонентов в сиде", uz: "Seed’dagi komponentlar" },
      value: "195",
    },
    {
      label: { en: "Compatibility rules", ru: "Правил совместимости", uz: "Moslik qoidalari" },
      value: "16",
      note: { en: "11 errors, 5 warnings", ru: "11 ошибок, 5 предупреждений", uz: "11 xato, 5 ogohlantirish" },
    },
  ],
  metricsSource: {
    en: "Counted from prisma/seed and src/lib/compat in the repository.",
    ru: "Посчитано по prisma/seed и src/lib/compat в репозитории.",
    uz: "Repozitoriydagi prisma/seed va src/lib/compat bo‘yicha sanalgan.",
  },
  stack: [
    {
      tech: "Next.js 16, React 19",
      why: {
        en: "The store, the builder and the admin live in one application.",
        ru: "Магазин, конструктор и админка живут в одном приложении.",
        uz: "Do‘kon, konstruktor va admin bitta ilovada.",
      },
    },
    {
      tech: "Prisma 7, PostgreSQL (Neon)",
      why: {
        en: "Catalog, games and coefficients are data, not code.",
        ru: "Каталог, игры и коэффициенты это данные, а не код.",
        uz: "Katalog, o‘yinlar va koeffitsiyentlar kod emas, ma’lumot.",
      },
    },
    {
      tech: "react-three-fiber",
      why: {
        en: "The 3D view of the build as React components.",
        ru: "3D-вид сборки как компоненты React.",
        uz: "Yig‘maning 3D ko‘rinishi React komponentlari sifatida.",
      },
    },
    {
      tech: "next-intl, Auth.js v5, Tailwind CSS 4",
      why: {
        en: "Three languages, sign-in and styling.",
        ru: "Три языка, вход и стили.",
        uz: "Uch til, kirish va uslublar.",
      },
    },
  ],
  gallery: [
    {
      src: "/projects/corecraft-pc/builder.webp",
      alt: {
        en: "The empty PC builder: eight slots and a wireframe model of the case.",
        ru: "Пустой конструктор: восемь слотов и каркасная модель корпуса.",
        uz: "Bo‘sh konstruktor: sakkiz uyacha va korpusning karkas modeli.",
      },
      caption: {
        en: "The builder before the first part.",
        ru: "Конструктор до первой детали.",
        uz: "Birinchi detalgacha konstruktor.",
      },
    },
    {
      src: "/projects/corecraft-pc/fps.webp",
      alt: {
        en: "The FPS calculator: a list of games with estimated FPS, 1% low and the bottleneck.",
        ru: "Калькулятор FPS: список игр с оценкой FPS, 1% low и узким местом.",
        uz: "FPS kalkulyatori: o‘yinlar ro‘yxati, FPS bahosi, 1% low va tor joy.",
      },
      caption: {
        en: "The FPS calculator warns that it is an estimate.",
        ru: "Калькулятор FPS сам предупреждает, что это оценка.",
        uz: "FPS kalkulyatori baho ekanini o‘zi ogohlantiradi.",
      },
    },
    {
      src: "/projects/corecraft-pc/catalog.webp",
      alt: { en: "The product catalog.", ru: "Каталог товаров.", uz: "Mahsulotlar katalogi." },
      caption: { en: "The catalog.", ru: "Каталог.", uz: "Katalog." },
    },
  ],
};
