import type { CaseContent } from "./types";

export const marginflowCrm: CaseContent = {
  slug: "marginflow-crm",
  kind: {
    en: "CRM",
    ru: "CRM",
    uz: "CRM",
  },
  title: {
    en: "Office CRM for a web studio: roles, clients on a map, requests, office plan and check-in.",
    ru: "Офисная CRM для веб-студии: роли, клиенты на карте, заявки, план офиса и чек-ин.",
    uz: "Veb-studiya uchun ofis CRM: rollar, xaritadagi mijozlar, so‘rovlar, ofis rejasi va check-in.",
  },
  hook: {
    en: "Who is in, who is late, who is free to take the next job, on one floor plan.",
    ru: "Кто на месте, кто опоздал и кто свободен для следующей заявки: всё на одном плане офиса.",
    uz: "Kim joyida, kim kechikdi, keyingi ishni kim olishi mumkin: hammasi bitta ofis rejasida.",
  },
  problem: {
    en: "A manager of a small field team collects this from chats and calls, then still has no record of it at the end of the month.",
    ru: "Руководитель небольшой команды собирает это из чатов и звонков, а к концу месяца всё равно не имеет записи.",
    uz: "Kichik jamoa rahbari buni chat va qo‘ng‘iroqlardan yig‘adi, oy oxirida esa baribir yozuv qolmaydi.",
  },
  note: {
    en: "A study project with fictional people and companies. The live site opens on its sign-in page.",
    ru: "Учебный проект с вымышленными людьми и компаниями. Живой сайт открывается со страницы входа.",
    uz: "To‘qima odamlar va kompaniyalar bilan o‘quv loyihasi. Jonli sayt kirish sahifasidan ochiladi.",
  },
  cover: {
    src: "/projects/marginflow-crm/cover.webp",
    alt: {
      en: "The MarginFlow office plan: 20 desks, three zones and staff moving around the room.",
      ru: "План офиса MarginFlow: 20 столов, три зоны и сотрудники, которые ходят по комнате.",
      uz: "MarginFlow ofis rejasi: 20 ta stol, uchta zona va xonada yurgan xodimlar.",
    },
    caption: {
      en: "The office plan with the demo simulation on. Shot from a local run with the project's demo data.",
      ru: "План офиса с включённой демо-симуляцией. Снято с локального запуска на демо-данных проекта.",
      uz: "Demo simulyatsiya yoqilgan ofis rejasi. Loyihaning demo ma’lumotlari bilan lokal ishga tushirishdan olingan.",
    },
  },
  gallery: [
    {
      src: "/projects/marginflow-crm/requests.webp",
      alt: {
        en: "The requests list with assignee and status selectors; one overdue row is highlighted in red.",
        ru: "Список заявок с выбором исполнителя и статуса; одна просроченная строка выделена красным.",
        uz: "Ijrochi va holat tanlagichlari bilan so‘rovlar ro‘yxati; muddati o‘tgan bitta qator qizil bilan ajratilgan.",
      },
      caption: {
        en: "Requests: assign and move them from the list itself.",
        ru: "Заявки: назначение и смена статуса прямо в списке.",
        uz: "So‘rovlar: biriktirish va holatni o‘zgartirish ro‘yxatning o‘zida.",
      },
    },
    {
      src: "/projects/marginflow-crm/map.webp",
      alt: {
        en: "A city map of the Palo Alto area with the office and open requests as markers.",
        ru: "Карта района Пало-Альто с офисом и открытыми заявками в виде меток.",
        uz: "Palo Alto hududi xaritasi, ofis va ochiq so‘rovlar belgilar bilan.",
      },
      caption: {
        en: "City map with the office and open requests, on Leaflet and OpenStreetMap.",
        ru: "Карта города с офисом и открытыми заявками на Leaflet и OpenStreetMap.",
        uz: "Leaflet va OpenStreetMap’da ofis va ochiq so‘rovlar bilan shahar xaritasi.",
      },
    },
    {
      src: "/projects/marginflow-crm/dashboard.webp",
      alt: {
        en: "The dashboard: counters for in office, out, not arrived and late, a live plan and an event feed.",
        ru: "Дашборд: счётчики «в офисе», «вне офиса», «не пришли» и «опоздали», живой план и лента событий.",
        uz: "Boshqaruv paneli: ofisda, tashqarida, kelmagan va kechikkanlar hisoblagichlari, jonli reja va voqealar lentasi.",
      },
      caption: {
        en: "The dashboard an administrator opens first.",
        ru: "Дашборд, который администратор открывает первым.",
        uz: "Administrator birinchi ochadigan boshqaruv paneli.",
      },
    },
  ],
  built: [
    {
      name: { en: "Requests", ru: "Заявки", uz: "So‘rovlar" },
      text: {
        en: "New, Assigned, In progress, Done. Assign an employee right in the list; overdue requests stand out.",
        ru: "Новая, назначена, в работе, готова. Исполнитель назначается прямо в списке, просроченные заметны сразу.",
        uz: "Yangi, biriktirilgan, jarayonda, tayyor. Ijrochi to‘g‘ridan-to‘g‘ri ro‘yxatda biriktiriladi, muddati o‘tganlari darhol ko‘rinadi.",
      },
    },
    {
      name: { en: "Office plan", ru: "План офиса", uz: "Ofis rejasi" },
      text: {
        en: "The admin uploads a plan image, adds and drags desks with PC numbers, assigns people and draws zones.",
        ru: "Админ загружает чертёж, добавляет и перетаскивает столы с номерами ПК, назначает людей и рисует зоны.",
        uz: "Admin chizmani yuklaydi, kompyuter raqamli stollarni qo‘shadi va suradi, odamlarni biriktiradi va zonalarni chizadi.",
      },
    },
    {
      name: { en: "Check-in and exits", ru: "Приход и выходы", uz: "Kelish va chiqishlar" },
      text: {
        en: "I'm here and End of work buttons, plus an exit with a reason: lunch, client visit linked to a request, meeting.",
        ru: "Кнопки «Я на месте» и «Конец работы», а также выход с причиной: обед, выезд к клиенту с привязкой к заявке, встреча.",
        uz: "«Men shu yerdaman» va «Ish tugadi» tugmalari, hamda sabab bilan chiqish: tushlik, so‘rovga bog‘langan mijozga borish, uchrashuv.",
      },
    },
    {
      name: { en: "City map", ru: "Карта города", uz: "Shahar xaritasi" },
      text: {
        en: "The office, requests and staff out of the office on Leaflet and OpenStreetMap. The movement on it is a simulation for the demo.",
        ru: "Офис, заявки и сотрудники вне офиса на Leaflet и OpenStreetMap. Движение на ней это симуляция для демо.",
        uz: "Leaflet va OpenStreetMap’da ofis, so‘rovlar va ofisdan tashqaridagi xodimlar. Undagi harakat demo uchun simulyatsiya.",
      },
    },
    {
      name: { en: "Reports", ru: "Отчёты", uz: "Hisobotlar" },
      text: {
        en: "An attendance Excel file for any period, with Summary and By day sheets.",
        ru: "Excel-файл посещаемости за период, листы Summary и By day.",
        uz: "Istalgan davr uchun davomat Excel fayli, Summary va By day varaqlari.",
      },
    },
    {
      name: { en: "Three roles", ru: "Три роли", uz: "Uch rol" },
      text: {
        en: "Admin, manager and employee, with bcrypt-hashed passwords and three interface languages.",
        ru: "Админ, менеджер и сотрудник, пароли только в виде хешей bcrypt и три языка интерфейса.",
        uz: "Admin, menejer va xodim, parollar faqat bcrypt xeshi ko‘rinishida va uchta interfeys tili.",
      },
    },
  ],
  hard: [
    {
      title: { en: "Shares, not pixels", ru: "Доли, а не пиксели", uz: "Piksel emas, ulush" },
      text: {
        en: "Desks and zones are stored as shares of the image rather than pixels, so the plan stays correct at any screen size and with any uploaded floor picture.",
        ru: "Столы и зоны хранятся в долях картинки, а не в пикселях, поэтому план верен на любом экране и с любым загруженным чертежом.",
        uz: "Stol va zonalar piksel emas, rasmning ulushlarida saqlanadi, shuning uchun reja har qanday ekranda va yuklangan chizmada to‘g‘ri turadi.",
      },
    },
    {
      title: { en: "An agent with a manager's rights", ru: "Агент с правами менеджера", uz: "Menejer huquqli agent" },
      text: {
        en: "The MCP server can read attendance and has one write action: assigning a request. It will not take a request from its assignee unless that is switched on.",
        ru: "MCP-сервер читает посещаемость и умеет одно изменение: назначить заявку. Забрать заявку у исполнителя он не может, пока это не включено отдельно.",
        uz: "MCP-server davomatni o‘qiydi va bitta o‘zgartirishni biladi: so‘rovni biriktirish. Alohida yoqilmaguncha so‘rovni ijrochidan ololmaydi.",
      },
    },
  ],
  stack: [
    {
      tech: "Leaflet, OpenStreetMap",
      why: {
        en: "Free maps, with no registration or API keys.",
        ru: "Бесплатные карты без регистрации и ключей API.",
        uz: "Ro‘yxatdan o‘tish va API kalitsiz bepul xaritalar.",
      },
    },
    {
      tech: "embedded-postgres",
      why: {
        en: "A local Postgres from npm: nothing else to install, Docker is optional.",
        ru: "Локальный Postgres из npm: ничего больше ставить не нужно, Docker по желанию.",
        uz: "npm’dan lokal Postgres: boshqa hech narsa o‘rnatish shart emas, Docker ixtiyoriy.",
      },
    },
    {
      tech: "Auth.js, Zod, Prisma",
      why: {
        en: "Roles and input are checked on the server, with one typed schema.",
        ru: "Роли и ввод проверяются на сервере, схема одна и типизирована.",
        uz: "Rollar va kiritish serverda tekshiriladi, sxema bitta va tiplashtirilgan.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "Desks and zones", ru: "Столы и зоны", uz: "Stollar va zonalar" },
      value: "20, 3",
      note: { en: "13 desks taken.", ru: "13 столов заняты.", uz: "13 ta stol band." },
    },
    {
      label: { en: "Sign-in", ru: "Вход", uz: "Kirish" },
      value: "5 / 15 min",
      note: { en: "Attempts allowed per window.", ru: "Попыток за окно.", uz: "Bir oynadagi urinishlar." },
    },
  ],
  metricsSource: {
    en: "Demo data from prisma/seed.ts.",
    ru: "Демо-данные из prisma/seed.ts.",
    uz: "prisma/seed.ts dagi demo ma’lumotlar.",
  },
};
