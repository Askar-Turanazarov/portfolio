import type { CaseContent } from "./types";

export const domusFurniture3d: CaseContent = {
  slug: "domus-furniture-3d",
  title: {
    en: "Will the wardrobe fit? Drag it and find out, down to the centimetre.",
    ru: "Влезет ли шкаф? Перетащите и узнаете, с точностью до сантиметра.",
    uz: "Shkaf sig‘adimi? Suring va santimetrigacha bilib oling.",
  },
  problem: {
    en: "Custom furniture gets ordered from a sketch and measured when it's too late: the door won't open, the passage is too narrow.",
    ru: "Мебель на заказ часто заказывают по наброску, а проблему видят, когда поздно: дверца не открывается, проход слишком узкий.",
    uz: "Buyurtma mebel ko‘pincha chizma bo‘yicha olinadi, muammo esa kech ko‘rinadi: eshik ochilmaydi, yo‘lak juda tor.",
  },
  note: {
    en: "A study project. Prices in the catalog are test values. The planner later grew into Domus Estate.",
    ru: "Учебный проект. Цены в каталоге тестовые. Позже планировщик вырос в Domus Estate.",
    uz: "O‘quv loyihasi. Katalogdagi narxlar test qiymatlari. Keyinroq rejalashtiruvchi Domus Estate’ga aylandi.",
  },
  cover: {
    src: "/projects/domus-furniture-3d/planner.webp",
    alt: {
      en: "The 2D plan of a furnished bedroom with a grid, a door swing and a side panel of notes.",
      ru: "2D-план обставленной спальни: сетка, дуга двери и колонка заметок.",
      uz: "Jihozlangan yotoqxonaning 2D rejasi: to‘r, eshik yoyi va izohlar ustuni.",
    },
    caption: { en: "The plan.", ru: "План.", uz: "Reja." },
  },
  built: [
    {
      name: { en: "Plan", ru: "План", uz: "Reja" },
      text: {
        en: "Canvas 2D with a 10/50 cm grid, 5 cm snapping, a ruler, undo, multi-select and zoom from 50 to 800%. Distances to walls and neighbours update as you drag.",
        ru: "Canvas 2D с сеткой 10/50 см, привязкой 5 см, линейкой, отменой, выделением нескольких предметов и масштабом 50–800%. Расстояния до стен и соседей меняются при перетаскивании.",
        uz: "10/50 sm to‘rli Canvas 2D, 5 sm bog‘lanish, chizg‘ich, bekor qilish, bir nechta tanlash va 50–800% masshtab. Devor va qo‘shnilargacha masofa surish paytida o‘zgaradi.",
      },
    },
    {
      name: { en: "Checks", ru: "Проверки", uz: "Tekshiruvlar" },
      text: {
        en: "An item turns red when it crosses a wall or plinth, overlaps another, breaks the 3 cm gap or blocks a door swing. Opening zones report the shortfall in centimetres, and passages under 60 cm get a warning.",
        ru: "Предмет краснеет, если заходит на стену или плинтус, пересекает другой, нарушает зазор 3 см или мешает двери. Зоны открывания называют нехватку в сантиметрах, а проходы уже 60 см получают предупреждение.",
        uz: "Buyum devor yoki plintusga kirsa, boshqasi bilan kesishsa, 3 sm oraliqni buzsa yoki eshikka xalaqit bersa, qizaradi. Ochilish zonalari yetishmovchilikni santimetrda aytadi, 60 sm dan tor yo‘laklar ogohlantirish oladi.",
      },
    },
    {
      name: { en: "3D", ru: "3D", uz: "3D" },
      text: {
        en: "Three.js: an overview, a first-person walk with collisions, doors and drawers that open and stop when they hit something, day, sunset and night light.",
        ru: "Three.js: обзор, прогулка от первого лица со столкновениями, дверцы и ящики, которые открываются и останавливаются при касании, свет дня, заката и ночи.",
        uz: "Three.js: umumiy ko‘rinish, to‘qnashuvli birinchi shaxs sayri, tegib to‘xtaydigan eshik va tortmalar, kunduz, shom va tun yorug‘ligi.",
      },
    },
    {
      name: { en: "Projects and templates", ru: "Проекты и шаблоны", uz: "Loyihalar va shablonlar" },
      text: {
        en: "A project is a whole apartment. Templates follow typical Tashkent housing, from khrushchevka series to new builds. An order carries an A4 drawing and a specification.",
        ru: "Проект это целая квартира. Шаблоны повторяют типовое жильё Ташкента, от серий хрущёвок до новостроек. Заказ уходит с чертежом A4 и спецификацией.",
        uz: "Loyiha butun xonadon. Shablonlar Toshkentning tipik uylarini takrorlaydi, xrushchyovka seriyalaridan yangi uylargacha. Buyurtma A4 chizma va spetsifikatsiya bilan ketadi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Collisions on three axes", ru: "Столкновения по трём осям", uz: "Uch o‘qli to‘qnashuvlar" },
      text: {
        en: "Collisions work on three axes: a shelf above a desk is fine, a wardrobe under a ceiling duct is checked against its underside.",
        ru: "Столкновения считаются по трём осям: полка над столом допустима, а шкаф под коробом проверяется по его нижней грани.",
        uz: "To‘qnashuv uch o‘q bo‘yicha hisoblanadi: stol ustidagi javon mumkin, shift quvuri ostidagi shkaf esa uning pastki yuzasi bo‘yicha tekshiriladi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Items in the catalog", ru: "Предметов в каталоге", uz: "Katalogdagi buyumlar" }, value: "55" },
    { label: { en: "Snap step", ru: "Шаг привязки", uz: "Bog‘lanish qadami" }, value: "5 cm" },
    { label: { en: "Minimum gap", ru: "Минимальный зазор", uz: "Eng kichik oraliq" }, value: "3 cm" },
    { label: { en: "Passage from", ru: "Проход от", uz: "Yo‘lak kamida" }, value: "60 cm" },
  ],
  metricsSource: {
    en: "From catalog.json and the README in the repository.",
    ru: "Из catalog.json и README репозитория.",
    uz: "Repozitoriydagi catalog.json va README’dan.",
  },
  stack: [
    {
      tech: "Vanilla JS (ES modules), Canvas 2D",
      why: {
        en: "No build step: the planner is plain modules served as files.",
        ru: "Без сборки: планировщик это обычные модули, отдаваемые файлами.",
        uz: "Yig‘ishsiz: rejalashtiruvchi fayl sifatida beriladigan oddiy modullar.",
      },
    },
    {
      tech: "Three.js",
      why: {
        en: "The room, the walk and the building showcase.",
        ru: "Комната, прогулка и витрина новостройки.",
        uz: "Xona, sayr va yangi uy ko‘rgazmasi.",
      },
    },
    {
      tech: "Express, Neon, Vercel Blob",
      why: {
        en: "A small API for orders, plus storage for texture sets fetched on demand.",
        ru: "Небольшой API для заказов и хранилище текстур, скачиваемых по запросу.",
        uz: "Buyurtmalar uchun kichik API va so‘rov bo‘yicha yuklanadigan teksturalar ombori.",
      },
    },
  ],
  gallery: [
    {
      src: "/projects/domus-furniture-3d/scene.webp",
      alt: {
        en: "The furnished bedroom in the 3D overview with the near walls cut away.",
        ru: "Обставленная спальня в 3D: ближние стены срезаны.",
        uz: "Jihozlangan yotoqxona 3D’da: yaqin devorlar kesilgan.",
      },
      caption: { en: "The same room in 3D.", ru: "Та же комната в 3D.", uz: "O‘sha xona 3D’da." },
    },
    {
      src: "/projects/domus-furniture-3d/walk.webp",
      alt: {
        en: "Walk mode: the room seen from a person's height.",
        ru: "Режим Walk: комната с высоты человека.",
        uz: "Walk rejimi: xona odam bo‘yi balandligidan.",
      },
      caption: { en: "Walk mode.", ru: "Режим Walk.", uz: "Walk rejimi." },
    },
    {
      src: "/projects/domus-furniture-3d/building.webp",
      alt: {
        en: "A 12-storey demo building in 3D with a floor scheme and apartment filters.",
        ru: "Демо-дом на 12 этажей в 3D со схемой этажей и фильтрами квартир.",
        uz: "12 qavatli demo uy 3D’da, qavat sxemasi va xonadon filtrlari bilan.",
      },
      caption: { en: "The new-building showcase.", ru: "Витрина новостройки.", uz: "Yangi uy ko‘rgazmasi." },
    },
  ],
};
