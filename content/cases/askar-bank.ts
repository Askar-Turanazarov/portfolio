import type { CaseContent } from "./types";

export const askarBank: CaseContent = {
  slug: "askar-bank",
  title: {
    en: "A mobile bank demo with no real money, and one algorithm you can walk through by hand.",
    ru: "Демо мобильного банка без настоящих денег и один алгоритм, который можно пройти вручную.",
    uz: "Haqiqiy pulsiz mobil bank demosi va qo‘lda bosib o‘tish mumkin bo‘lgan bitta algoritm.",
  },
  problem: {
    en: "I wanted to see how far a payment app's feel could go in a browser: swipes between cards, quick amounts, a success screen.",
    ru: "Хотел проверить, насколько близко браузер подходит к ощущению платёжного приложения: свайпы карт, быстрые суммы, экран успеха.",
    uz: "Brauzer to‘lov ilovasi hissiyotiga qanchalik yaqinlashishini sinamoqchi edim: kartalarni surish, tezkor summalar, muvaffaqiyat ekrani.",
  },
  note: {
    en: "A demo: there are no real payments, and everything is kept in the browser's localStorage. Please don't enter real card details.",
    ru: "Демо: настоящих платежей нет, всё хранится в localStorage браузера. Пожалуйста, не вводите данные настоящей карты.",
    uz: "Demo: haqiqiy to‘lovlar yo‘q, hammasi brauzerning localStorage’ida saqlanadi. Iltimos, haqiqiy karta ma’lumotlarini kiritmang.",
  },
  built: [
    {
      name: { en: "Payment form", ru: "Форма оплаты", uz: "To‘lov formasi" },
      text: {
        en: "Pick a service and a card, then type an amount or tap a quick one. The form checks that the card has enough, waits through a 1.5-second imitation of a network call, and ends on a drawn check mark with confetti.",
        ru: "Выбираете услугу и карту, вводите сумму или нажимаете быструю. Форма проверяет, хватает ли средств, ждёт 1,5 секунды имитации запроса и заканчивает рисующейся галочкой с конфетти.",
        uz: "Xizmat va kartani tanlaysiz, summani kiritasiz yoki tezkorini bosasiz. Forma mablag‘ yetarliligini tekshiradi, 1,5 soniyalik so‘rov taqlidini kutadi va chiziladigan belgi hamda konfetti bilan tugaydi.",
      },
    },
    {
      name: { en: "Card carousel", ru: "Карусель карт", uz: "Kartalar karuseli" },
      text: {
        en: "Cards swipe in a 3D carousel on Framer Motion, and a rotating React Three Fiber card sits behind the home screen.",
        ru: "Карты листаются в 3D-карусели на Framer Motion, а за главным экраном вращается карта на React Three Fiber.",
        uz: "Kartalar Framer Motion’dagi 3D karuselda suriladi, bosh ekran ortida esa React Three Fiber’dagi karta aylanadi.",
      },
    },
    {
      name: { en: "History", ru: "История", uz: "Tarix" },
      text: {
        en: "A full log of operations with a filter by type, with dates and sums formatted for the chosen language.",
        ru: "Полный журнал операций с фильтром по типу, даты и суммы отформатированы под выбранный язык.",
        uz: "Tur bo‘yicha filtrli to‘liq operatsiyalar jurnali, sana va summalar tanlangan tilga moslangan.",
      },
    },
  ],
  hard: [
    {
      title: { en: "A check before any request", ru: "Проверка до запроса", uz: "So‘rovdan oldingi tekshiruv" },
      text: {
        en: "A card number can be checked before any network call. The Luhn digit catches a single mistyped digit right in the form.",
        ru: "Номер карты можно проверить до любого запроса в сеть. Контрольная цифра Луна ловит одну опечатку прямо в форме.",
        uz: "Karta raqamini tarmoqqa so‘rovsiz tekshirish mumkin. Lun nazorat raqami bitta xato raqamni shu formaning o‘zida aniqlaydi.",
      },
    },
  ],
  metrics: [
    { label: { en: "Languages", ru: "Языка", uz: "Tillar" }, value: "3" },
    { label: { en: "Digits checked", ru: "Цифр в проверке", uz: "Tekshiriladigan raqamlar" }, value: "16" },
    { label: { en: "Imitated processing", ru: "Имитация обработки", uz: "Ishlov berish taqlidi" }, value: "1.5 s" },
  ],
  metricsSource: {
    en: "src/utils/cardUtils.ts and src/pages/PaymentFlowPage.tsx in the repository.",
    ru: "src/utils/cardUtils.ts и src/pages/PaymentFlowPage.tsx в репозитории.",
    uz: "Repozitoriydagi src/utils/cardUtils.ts va src/pages/PaymentFlowPage.tsx.",
  },
  stack: [
    {
      tech: "React 18, Vite, TypeScript, Tailwind CSS",
      why: { en: "A mobile-first client app with no server.", ru: "Клиентское приложение mobile-first без сервера.", uz: "Serversiz, mobile-first mijoz ilovasi." },
    },
    {
      tech: "Zustand with persist",
      why: { en: "Cards, balances and history survive a reload through localStorage alone.", ru: "Карты, балансы и история переживают перезагрузку только за счёт localStorage.", uz: "Kartalar, balanslar va tarix qayta yuklashdan faqat localStorage hisobiga saqlanadi." },
    },
    {
      tech: "Framer Motion, React Three Fiber, drei",
      why: { en: "The feel of the app was the point of the project, and the 3D scene loads lazily.", ru: "Ощущение от приложения и было целью проекта, а 3D-сцена грузится лениво.", uz: "Ilova hissiyoti loyihaning maqsadi edi, 3D sahna esa kechiktirib yuklanadi." },
    },
  ],
  gallery: [
    {
      src: "/projects/askar-bank/form.webp",
      alt: { en: "The payment form for a phone top-up, with quick amounts and two cards to choose from.", ru: "Форма оплаты связи с быстрыми суммами и выбором из двух карт.", uz: "Tezkor summalar va ikkita karta tanlovi bilan aloqa to‘lovi formasi." },
      caption: { en: "The payment form.", ru: "Форма оплаты.", uz: "To‘lov formasi." },
    },
    {
      src: "/projects/askar-bank/success.webp",
      alt: { en: "The success screen: a check mark in a circle with confetti and the words Payment successful.", ru: "Экран успеха: галочка в круге с конфетти и надпись об успешной оплате.", uz: "Muvaffaqiyat ekrani: doiradagi belgi, konfetti va to‘lov muvaffaqiyatli degan yozuv." },
      caption: { en: "The success screen.", ru: "Экран успеха.", uz: "Muvaffaqiyat ekrani." },
    },
  ],
};
