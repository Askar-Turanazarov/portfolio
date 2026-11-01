import type { CaseContent } from "./types";

export const galacticVault: CaseContent = {
  slug: "galactic-vault",
  kind: {
    en: "Store concept",
    ru: "Концепт магазина",
    uz: "Do‘kon konsepti",
  },
  title: {
    en: "A concept store for rare artifacts of the universe, in one HTML file.",
    ru: "Концепт-магазин редких артефактов вселенной в одном HTML-файле.",
    uz: "Bitta HTML fayldagi koinot noyob artefaktlari konsept-do‘koni.",
  },
  hook: {
    en: "A shop with teleport delivery, in a single HTML file.",
    ru: "Магазин с телепорт-доставкой в одном HTML-файле.",
    uz: "Teleport yetkazib berishli do‘kon bitta HTML faylda.",
  },
  problem: {
    en: "It solves no real problem. I wanted to see how much of a shop fits into a page with no build step.",
    ru: "Настоящей проблемы он не решает. Хотелось понять, сколько магазина помещается в страницу без сборки.",
    uz: "U haqiqiy muammoni hal qilmaydi. Yig‘ishsiz sahifaga do‘konning qanchasi sig‘ishini bilmoqchi edim.",
  },
  note: {
    en: "A concept with a fictional company and goods. The interface is in Russian.",
    ru: "Концепт с вымышленной компанией и товарами. Интерфейс на русском.",
    uz: "Xayoliy kompaniya va tovarlar bilan konsept. Interfeys rus tilida.",
  },
  cover: {
    src: "/projects/galactic-vault/catalog.webp",
    alt: { en: "The dark catalog: three cards with a glowing sword, a violet crystal and a green pyramid, with prices in galactic credits.", ru: "Тёмный каталог: три карточки со светящимся мечом, фиолетовым кристаллом и зелёной пирамидой, цены в галактических кредитах.", uz: "To‘q katalog: nurli qilich, binafsha kristall va yashil piramidali uchta karta, narxlar galaktik kreditlarda." },
    caption: { en: "The catalog on the live site. Its pictures are drawn in SVG in the same file.", ru: "Каталог на живом сайте. Картинки товаров нарисованы в SVG в том же файле.", uz: "Jonli saytdagi katalog. Tovar rasmlari o‘sha faylda SVG’da chizilgan." },
  },
  built: [
    {
      name: { en: "Catalog and cart", ru: "Каталог и корзина", uz: "Katalog va savat" },
      text: {
        en: "Seventeen lots with filters by category, a detail window with their made-up risks, a cart and a checkout form.",
        ru: "Семнадцать лотов с фильтрами по категориям, окно с подробностями и выдуманными рисками, корзина и форма заказа.",
        uz: "Kategoriya filtrlari bilan o‘n yetti lot, tafsilotlar va xayoliy xavflar oynasi, savat va buyurtma formasi.",
      },
    },
    {
      name: { en: "The keeper's panel", ru: "Панель Смотрителя", uz: "Nazoratchi paneli" },
      text: {
        en: "A small admin in the same page: add, edit, hide and delete lots.",
        ru: "Маленькая админка на той же странице: добавить, изменить, скрыть и удалить лот.",
        uz: "O‘sha sahifadagi kichik admin: lot qo‘shish, tahrirlash, yashirish va o‘chirish.",
      },
    },
    {
      name: { en: "One file", ru: "Один файл", uz: "Bitta fayl" },
      text: {
        en: "index.html, about 1,800 lines, with Tailwind and Alpine.js from a CDN. Open the file and the shop works.",
        ru: "index.html, около 1800 строк, Tailwind и Alpine.js с CDN. Открываете файл, и магазин работает.",
        uz: "index.html, taxminan 1800 qator, CDN’dan Tailwind va Alpine.js. Faylni ochasiz va do‘kon ishlaydi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Where memory ends", ru: "Где кончается память", uz: "Xotira qayerda tugaydi" },
      text: {
        en: "Without a backend the catalog and the keeper's edits live in localStorage, so nobody else sees them. An order only gets a random number after two seconds and is saved nowhere. That taught me early where a browser's memory ends.",
        ru: "Без бэкенда каталог и правки Смотрителя живут в localStorage, и другой посетитель их не увидит. Заказ через две секунды получает случайный номер и нигде не сохраняется. Это рано показало мне, где кончается память браузера.",
        uz: "Backend bo‘lmagani uchun katalog va Nazoratchi tahrirlari localStorage’da turadi, boshqa tashrif buyuruvchi ularni ko‘rmaydi. Buyurtma ikki soniyadan keyin tasodifiy raqam oladi va hech qayerda saqlanmaydi. Bu menga brauzer xotirasi qayerda tugashini erta ko‘rsatdi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Files of code", ru: "Файл кода", uz: "Kod fayli" }, value: "1" },
    { label: { en: "Sectors", ru: "Секторов", uz: "Sektorlar" }, value: "5" },
    { label: { en: "Lots in the catalog", ru: "Лотов в каталоге", uz: "Katalogdagi lotlar" }, value: "17" },
  ],
  metricsSource: {
    en: "Counted in index.html in the repository.",
    ru: "Посчитано по index.html в репозитории.",
    uz: "Repozitoriydagi index.html bo‘yicha sanalgan.",
  },
  stack: [
    {
      tech: "HTML, Tailwind CSS (CDN), Alpine.js (CDN)",
      why: { en: "State and reactivity with no build step, which was the point of the experiment.", ru: "Состояние и реактивность без сборки: в этом и был смысл опыта.", uz: "Yig‘ishsiz holat va reaktivlik: tajribaning mazmuni shunda edi." },
    },
  ],
  gallery: [
    {
      src: "/projects/galactic-vault/hero.webp",
      alt: { en: "The first screen: a large heading in a neon gradient and two buttons.", ru: "Первый экран: большой заголовок с неоновым градиентом и две кнопки.", uz: "Birinchi ekran: neon gradientli katta sarlavha va ikkita tugma." },
      caption: { en: "The first screen.", ru: "Первый экран.", uz: "Birinchi ekran." },
    },
  ],
};
