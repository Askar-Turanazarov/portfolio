import type { CaseContent } from "./types";

export const fintrack: CaseContent = {
  slug: "fintrack",
  title: {
    en: "Where did the month go? One page, in columns.",
    ru: "Куда ушёл месяц? Одна страница, в колонках.",
    uz: "Oy qayerga ketdi? Bitta sahifa, ustunlarda.",
  },
  problem: {
    en: "Bank apps show transactions but don't answer the simple question of how much is left after the recurring payments.",
    ru: "Банковские приложения показывают операции, но не отвечают на простой вопрос: сколько остаётся после регулярных платежей.",
    uz: "Bank ilovalari operatsiyalarni ko‘rsatadi, lekin oddiy savolga javob bermaydi: doimiy to‘lovlardan keyin qancha qoladi.",
  },
  note: {
    en: "A study project. The interface is in Russian, and the API on the free tier may take a moment to answer first.",
    ru: "Учебный проект. Интерфейс на русском, а API на бесплатном тарифе может ответить не сразу.",
    uz: "O‘quv loyihasi. Interfeys rus tilida, bepul tarifdagi API esa darhol javob bermasligi mumkin.",
  },
  cover: {
    src: "/projects/fintrack/recurring.webp",
    alt: { en: "The dashboard for October 2026 with test data: income, expenses and balance, a donut by category, bars by source and three recurring payments.", ru: "Дашборд за октябрь 2026 с тестовыми данными: доход, расход и баланс, кольцо по категориям, столбцы по источникам и три постоянных платежа.", uz: "Test ma’lumotli 2026 yil oktabr dashboardi: daromad, xarajat va balans, kategoriyalar halqasi, manbalar ustunlari va uchta doimiy to‘lov." },
    caption: { en: "A local run with test data. The bar axis shows tiyin instead of sums, a display bug that's still there.", ru: "Локальный запуск с тестовыми данными. Ось столбцов показывает тийины вместо сумов, это ошибка отображения, она пока не исправлена.", uz: "Test ma’lumotli lokal ishga tushirish. Ustunlar o‘qi so‘m o‘rniga tiyinni ko‘rsatadi, bu ko‘rinish xatosi hali tuzatilmagan." },
  },
  built: [
    {
      name: { en: "Incomes and sources", ru: "Доходы и источники", uz: "Daromadlar va manbalar" },
      text: {
        en: "Each income can point to a source such as a salary or freelance work, and the dashboard splits the month by source.",
        ru: "Доход можно привязать к источнику: зарплате или фрилансу, а дашборд разбивает месяц по источникам.",
        uz: "Daromadni manbaga bog‘lash mumkin: oylik yoki frilans, dashboard esa oyni manbalar bo‘yicha ajratadi.",
      },
    },
    {
      name: { en: "Expenses and categories", ru: "Расходы и категории", uz: "Xarajatlar va kategoriyalar" },
      text: {
        en: "Fifteen system categories come with the database, and a user adds their own. The list filters by dates and category.",
        ru: "Пятнадцать системных категорий идут вместе с базой, пользователь добавляет свои. Список фильтруется по датам и категории.",
        uz: "O‘n beshta tizim kategoriyasi baza bilan birga keladi, foydalanuvchi o‘zinikini qo‘shadi. Ro‘yxat sana va kategoriya bo‘yicha filtrlanadi.",
      },
    },
    {
      name: { en: "Recurring payments", ru: "Регулярные платежи", uz: "Doimiy to‘lovlar" },
      text: {
        en: "A monthly or yearly mark on an expense. The dashboard adds up the monthly ones. Nothing is created automatically: it's a mark, not a scheduler.",
        ru: "Отметка на расходе: ежемесячный или ежегодный. Дашборд складывает ежемесячные. Сами записи не создаются: это отметка, а не планировщик.",
        uz: "Xarajatdagi belgi: oylik yoki yillik. Dashboard oylik to‘lovlarni qo‘shadi. Yozuvlar o‘zi yaratilmaydi: bu rejalashtiruvchi emas, belgi.",
      },
    },
    {
      name: { en: "The database and protection", ru: "База и защита", uz: "Baza va himoya" },
      text: {
        en: "Turso (libSQL) in production and a local SQLite file in development, through one client. Passwords go through bcrypt, with Helmet, a CORS origin and a limit of 10 auth requests a minute.",
        ru: "Turso (libSQL) в продакшене и локальный файл SQLite в разработке через один клиент. Пароли через bcrypt, плюс Helmet, CORS с одним адресом и лимит 10 запросов авторизации в минуту.",
        uz: "Prodakshnda Turso (libSQL), ishlab chiqishda lokal SQLite fayli, bitta mijoz orqali. Parollar bcrypt orqali, yana Helmet, bitta manzilli CORS va daqiqasiga 10 ta avtorizatsiya so‘rovi chegarasi.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Deleting a category", ru: "Удаление категории", uz: "Kategoriyani o‘chirish" },
      text: {
        en: "Deleting a category must not break past records. The API refuses with 403 for a system category and 409 for one that expenses still use.",
        ru: "Удаление категории не должно ломать прошлые записи. API отвечает 403 на системную категорию и 409 на ту, что ещё используется в расходах.",
        uz: "Kategoriyani o‘chirish o‘tgan yozuvlarni buzmasligi kerak. API tizim kategoriyasiga 403, xarajatlarda ishlatilayotganiga esa 409 javob qaytaradi.",
      },
    },
    {
      title: { en: "Money as integers", ru: "Деньги целыми числами", uz: "Pul butun sonlarda" },
      text: {
        en: "Amounts are stored as whole minor units, with a database check that they are above zero, so no sum picks up floating-point noise.",
        ru: "Суммы хранятся целыми в минимальных единицах, а база проверяет, что они больше нуля, поэтому в итогах не накапливается ошибка дробных чисел.",
        uz: "Summalar eng kichik birliklarda butun son sifatida saqlanadi, baza ularning noldan kattaligini tekshiradi, shuning uchun yig‘indilarda kasr xatosi to‘planmaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Backend modules", ru: "Модулей бэкенда", uz: "Backend modullari" }, value: "6" },
    { label: { en: "Endpoints", ru: "Конечных точек", uz: "Endpointlar" }, value: "25" },
    { label: { en: "System categories", ru: "Системных категорий", uz: "Tizim kategoriyalari" }, value: "15" },
  ],
  metricsSource: {
    en: "Counted in backend/src/modules and backend/src/db. The 403 and 409 answers were checked on a local run.",
    ru: "Посчитано по backend/src/modules и backend/src/db. Ответы 403 и 409 проверены на локальном запуске.",
    uz: "backend/src/modules va backend/src/db bo‘yicha sanalgan. 403 va 409 javoblari lokal ishga tushirishda tekshirilgan.",
  },
  stack: [
    {
      tech: "React 18, TypeScript, Vite, Tailwind CSS, Recharts",
      why: { en: "A client app where charts are the main screen.", ru: "Клиентское приложение, где графики и есть главный экран.", uz: "Grafiklar asosiy ekran bo‘lgan mijoz ilovasi." },
    },
    {
      tech: "Express, TypeScript, Zod",
      why: { en: "One folder per module, with validation at the route.", ru: "По папке на модуль и проверка данных на маршруте.", uz: "Har bir modulga bitta papka va marshrutda tekshiruv." },
    },
    {
      tech: "Turso, libSQL",
      why: { en: "The same SQL against a local file and a hosted database, which suits a serverless API.", ru: "Один и тот же SQL для локального файла и облачной базы, что подходит бессерверному API.", uz: "Lokal fayl va bulutli baza uchun bitta SQL, bu serverless API’ga mos keladi." },
    },
  ],
  gallery: [
    {
      src: "/projects/fintrack/expenses.webp",
      alt: { en: "The expenses page with filters by dates and category and a table of test records.", ru: "Страница расходов с фильтрами по датам и категории и таблицей тестовых записей.", uz: "Sana va kategoriya filtrlari hamda test yozuvlari jadvali bilan xarajatlar sahifasi." },
      caption: { en: "Expenses, on a local run with test data.", ru: "Расходы на локальном запуске с тестовыми данными.", uz: "Lokal ishga tushirishdagi test ma’lumotli xarajatlar." },
    },
  ],
};
