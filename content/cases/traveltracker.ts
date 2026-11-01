import type { CaseContent } from "./types";

export const traveltracker: CaseContent = {
  slug: "traveltracker",
  title: {
    en: "A travel diary with a world map on top and token rotation underneath.",
    ru: "Дневник путешествий: сверху карта мира, снизу ротация токенов.",
    uz: "Sayohat kundaligi: tepada dunyo xaritasi, ostida tokenlar rotatsiyasi.",
  },
  problem: {
    en: "Trips stay scattered across photos and memory. I wanted one place for countries, cities, dates and notes.",
    ru: "Поездки разбросаны по фото и памяти. Хотелось одно место для стран, городов, дат и заметок.",
    uz: "Sayohatlar suratlar va xotirada tarqalib ketadi. Mamlakat, shahar, sana va eslatmalar uchun bitta joy kerak edi.",
  },
  note: {
    en: "A study project. The interface is in Russian.",
    ru: "Учебный проект. Интерфейс на русском.",
    uz: "O‘quv loyihasi. Interfeys rus tilida.",
  },
  cover: {
    src: "/projects/traveltracker/demo-stats.webp",
    alt: { en: "A dark landing section: counters for countries and cities, a world map with marked countries and yellow city dots, and bars by region and year.", ru: "Тёмная секция лендинга: счётчики стран и городов, карта мира с отмеченными странами и жёлтыми точками городов, полосы по регионам и годам.", uz: "Lendingning to‘q bo‘limi: mamlakat va shahar hisoblagichlari, belgilangan mamlakatlar va sariq shahar nuqtalari bilan dunyo xaritasi, mintaqa va yillar bo‘yicha ko‘rsatkichlar." },
    caption: { en: "The live landing page. Its numbers are random on purpose, and the page says so.", ru: "Лендинг на живом сайте. Цифры здесь намеренно случайные, и страница об этом говорит.", uz: "Jonli saytdagi lending. Raqamlar ataylab tasodifiy, sahifa buni aytadi." },
  },
  built: [
    {
      name: { en: "Countries and cities", ru: "Страны и города", uz: "Mamlakatlar va shaharlar" },
      text: {
        en: "A signed-in user marks countries and cities from a seeded reference of 193 countries and 200 cities, with dates and notes on each city.",
        ru: "Вошедший пользователь отмечает страны и города из справочника на 193 страны и 200 городов, у города есть даты и заметки.",
        uz: "Tizimga kirgan foydalanuvchi 193 mamlakat va 200 shahardan iborat ma’lumotnomadan mamlakat va shaharlarni belgilaydi, shaharda sana va eslatmalar bor.",
      },
    },
    {
      name: { en: "Dashboard", ru: "Дашборд", uz: "Dashboard" },
      text: {
        en: "Counters, a split by region, the latest cities and a Passport tab, all from one stats endpoint.",
        ru: "Счётчики, разбивка по регионам, последние города и вкладка «Паспорт», всё из одной конечной точки статистики.",
        uz: "Hisoblagichlar, mintaqalar kesimi, oxirgi shaharlar va «Pasport» yorlig‘i, hammasi bitta statistika endpointidan.",
      },
    },
    {
      name: { en: "The map", ru: "Карта", uz: "Xarita" },
      text: {
        en: "Leaflet draws visited countries and city markers in the cabinet. There's no frame of it here: the basemap provider now asks for an API key and shows that across the tiles, so the provider has to be replaced.",
        ru: "В кабинете Leaflet рисует посещённые страны и маркеры городов. Кадра этой карты здесь нет: поставщик подложки теперь требует API-ключ и пишет об этом прямо на тайлах, так что его нужно заменить.",
        uz: "Kabinetda Leaflet tashrif buyurilgan mamlakatlar va shahar belgilarini chizadi. Bu xarita kadri bu yerda yo‘q: fon provayderi endi API kalit talab qiladi va buni tayllar ustida yozadi, shuning uchun uni almashtirish kerak.",
      },
    },
  ],
  hard: [
    {
      title: { en: "A stolen token", ru: "Украденный токен", uz: "O‘g‘irlangan token" },
      text: {
        en: "A stolen refresh token shouldn't work forever, so each refresh issues a new one and retires the old.",
        ru: "Украденный refresh-токен не должен работать вечно, поэтому каждое обновление выдаёт новый и отзывает старый.",
        uz: "O‘g‘irlangan refresh-token abadiy ishlamasligi kerak, shuning uchun har bir yangilash yangisini berib, eskisini bekor qiladi.",
      },
    },
    {
      title: { en: "Deleting without leftovers", ru: "Удаление без остатков", uz: "Qoldiqsiz o‘chirish" },
      text: {
        en: "Removing a country removes its visited cities too, and the response reports how many in cascaded_cities_deleted. Deleting an account goes through onDelete: Cascade in Prisma.",
        ru: "Удаление страны удаляет и посещённые города в ней, а ответ сообщает их число в cascaded_cities_deleted. Удаление аккаунта идёт через onDelete: Cascade в Prisma.",
        uz: "Mamlakatni o‘chirish undagi tashrif buyurilgan shaharlarni ham o‘chiradi, javob ularning sonini cascaded_cities_deleted’da bildiradi. Akkauntni o‘chirish Prisma’dagi onDelete: Cascade orqali ishlaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Endpoints", ru: "Конечных точек", uz: "Endpointlar" }, value: "17" },
    { label: { en: "Access token", ru: "Access-токен", uz: "Access-token" }, value: "15 min" },
    { label: { en: "Refresh token", ru: "Refresh-токен", uz: "Refresh-token" }, value: "7 d" },
    { label: { en: "Seeded countries", ru: "Стран в справочнике", uz: "Ma’lumotnomadagi mamlakatlar" }, value: "193" },
    { label: { en: "Seeded cities", ru: "Городов в справочнике", uz: "Ma’lumotnomadagi shaharlar" }, value: "200" },
  ],
  metricsSource: {
    en: "Counted in backend/src/routes and the seed; the token lifetimes were checked on a local run.",
    ru: "Посчитано по backend/src/routes и сиду; сроки жизни токенов проверены на локальном запуске.",
    uz: "backend/src/routes va seed bo‘yicha sanalgan; tokenlar muddati lokal ishga tushirishda tekshirilgan.",
  },
  stack: [
    {
      tech: "React 18, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query",
      why: { en: "A client app behind a login, where the server owns the data and the client caches it.", ru: "Клиентское приложение за входом: данными владеет сервер, клиент их кэширует.", uz: "Kirish ortidagi mijoz ilovasi: ma’lumot serverniki, mijoz uni keshlaydi." },
    },
    {
      tech: "Leaflet",
      why: { en: "A map library that does the job without a paid SDK.", ru: "Картографическая библиотека, которой хватает без платного SDK.", uz: "Pullik SDK’siz yetarli bo‘lgan xarita kutubxonasi." },
    },
    {
      tech: "Express, Prisma, PostgreSQL",
      why: { en: "Typed queries and declared cascades over relational data: users, countries, cities.", ru: "Типизированные запросы и объявленные каскады поверх реляционных данных: пользователи, страны, города.", uz: "Relyatsion ma’lumotlar ustida tiplangan so‘rovlar va e’lon qilingan kaskadlar: foydalanuvchilar, mamlakatlar, shaharlar." },
    },
    {
      tech: "JWT, bcrypt, Zod, Pino",
      why: { en: "Tokens, password hashes, input validation and structured logs with a request id.", ru: "Токены, хэши паролей, проверка входных данных и структурные логи с идентификатором запроса.", uz: "Tokenlar, parol xeshlari, kiruvchi ma’lumotlarni tekshirish va so‘rov identifikatorli tuzilgan loglar." },
    },
  ],
  gallery: [
    {
      src: "/projects/traveltracker/dashboard.webp",
      alt: { en: "The dashboard with test data: rings for 8 countries, 8 cities and 4.10% of the planet, a split by region and the latest cities.", ru: "Дашборд с тестовыми данными: кольца 8 стран, 8 городов и 4,10% планеты, разбивка по регионам и последние города.", uz: "Test ma’lumotli dashboard: 8 mamlakat, 8 shahar va sayyoraning 4,10% halqalari, mintaqalar kesimi va oxirgi shaharlar." },
      caption: { en: "The dashboard, on a local run with test data.", ru: "Дашборд на локальном запуске с тестовыми данными.", uz: "Lokal ishga tushirishdagi test ma’lumotli dashboard." },
    },
    {
      src: "/projects/traveltracker/landing.webp",
      alt: { en: "The landing page: the heading over a faint outline of the world map, with a blue button.", ru: "Лендинг: заголовок поверх бледного контура карты мира и синяя кнопка.", uz: "Lending: dunyo xaritasining xira konturi ustidagi sarlavha va ko‘k tugma." },
      caption: { en: "The landing page on the live site.", ru: "Лендинг на живом сайте.", uz: "Jonli saytdagi lending." },
    },
  ],
};
