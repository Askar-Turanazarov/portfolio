import type { CaseContent } from "./types";

export const flightdelay: CaseContent = {
  slug: "flightdelay",
  kind: {
    en: "ML service",
    ru: "ML-сервис",
    uz: "ML xizmat",
  },
  title: {
    en: "Pre-departure delay risk for a flight, with the reasons and the cost.",
    ru: "Риск задержки рейса до вылета, с причинами и стоимостью.",
    uz: "Uchishdan oldin reys kechikishi xavfi, sabablari va narxi bilan.",
  },
  hook: {
    en: "Catching more delays costs more false alarms. I let you pick the trade.",
    ru: "Поймать больше задержек значит получить больше ложных тревог. Выбор здесь за вами.",
    uz: "Ko‘proq kechikishni aniqlash ko‘proq yolg‘on signal beradi. Tanlov sizda.",
  },
  problem: {
    en: "A dispatcher needs the risk before departure, when only the schedule, route, carrier and traffic are known, not after the plane is already late.",
    ru: "Диспетчеру нужен риск до вылета, когда известны только расписание, маршрут, перевозчик и загрузка, а не когда самолёт уже опаздывает.",
    uz: "Dispetcherga xavf uchishdan oldin kerak: o‘sha paytda faqat jadval, yo‘nalish, aviakompaniya va yuklama ma’lum bo‘ladi.",
  },
  note: {
    en: "My diploma model. The free demo may need up to a minute to wake and load.",
    ru: "Моя дипломная модель. Бесплатному демо может понадобиться до минуты, чтобы проснуться и загрузиться.",
    uz: "Diplom modelim. Bepul demoga uyg‘onish va yuklanish uchun bir daqiqagacha kerak bo‘lishi mumkin.",
  },
  links: [
    { label: { en: "Model on Hugging Face", ru: "Модель на Hugging Face", uz: "Hugging Face’dagi model" }, href: "https://huggingface.co/AskarT/flight-delay-catboost" },
    { label: { en: "Space", ru: "Space", uz: "Space" }, href: "https://huggingface.co/spaces/AskarT/flight-delay-risk" },
  ],
  cover: {
    src: "/projects/flightdelay/prediction.webp",
    alt: {
      en: "The FlightDelay service showing a delay probability for a chosen flight.",
      ru: "Сервис FlightDelay показывает вероятность задержки для выбранного рейса.",
      uz: "FlightDelay xizmati tanlangan reys uchun kechikish ehtimolini ko‘rsatmoqda.",
    },
    caption: {
      en: "The forecast. The probability is compared with the average delay rate of 18.9%.",
      ru: "Прогноз. Вероятность сравнивается со средней долей задержек, 18,9%.",
      uz: "Prognoz. Ehtimol o‘rtacha kechikish ulushi, ya’ni 18,9% bilan solishtiriladi.",
    },
  },
  built: [
    {
      name: { en: "Forecast", ru: "Прогноз", uz: "Prognoz" },
      text: {
        en: "A CatBoost classifier gives the probability of arriving more than 15 minutes late.",
        ru: "Классификатор CatBoost выдаёт вероятность прибытия с опозданием больше 15 минут.",
        uz: "CatBoost klassifikatori 15 daqiqadan ko‘p kechikib kelish ehtimolini beradi.",
      },
    },
    {
      name: { en: "Explanation", ru: "Объяснение", uz: "Tushuntirish" },
      text: {
        en: "SHAP values show the seven factors that pushed this particular flight towards or away from a delay.",
        ru: "Значения SHAP показывают семь факторов, которые приблизили или отдалили задержку именно этого рейса.",
        uz: "SHAP qiymatlari aynan shu reys kechikishini yaqinlashtirgan yoki uzoqlashtirgan yettita omilni ko‘rsatadi.",
      },
    },
    {
      name: { en: "Economics", ru: "Экономика", uz: "Iqtisod" },
      text: {
        en: "Expected loss is the probability times the cost of the event. My assumptions: 110 USD per delay minute, 62.50 USD per passenger-hour (FAA), and a 2.2× knock-on factor.",
        ru: "Ожидаемый убыток это вероятность, умноженная на стоимость события. Мои допущения: 110 USD за минуту задержки, 62,50 USD за пассажиро-час (FAA) и множитель цепной реакции 2,2.",
        uz: "Kutilayotgan zarar ehtimolning hodisa narxiga ko‘paytmasidir. Farazlarim: kechikish daqiqasiga 110 USD, yo‘lovchi-soatiga 62,50 USD (FAA) va zanjir ta’siri koeffitsiyenti 2,2.",
      },
    },
    {
      name: { en: "Three languages", ru: "Три языка", uz: "Uch til" },
      text: {
        en: "The app opens in the browser's language: English, Russian or Uzbek.",
        ru: "Приложение открывается на языке браузера: английском, русском или узбекском.",
        uz: "Ilova brauzer tilida ochiladi: ingliz, rus yoki o‘zbek.",
      },
    },
  ],
  gallery: [
    {
      src: "/projects/flightdelay/shap.webp",
      alt: {
        en: "SHAP factors and the economics of one flight.",
        ru: "Факторы SHAP и экономика одного рейса.",
        uz: "Bitta reysning SHAP omillari va iqtisodi.",
      },
      caption: {
        en: "Why this flight: factors and expected loss.",
        ru: "Почему этот рейс: факторы и ожидаемый убыток.",
        uz: "Nega aynan shu reys: omillar va kutilayotgan zarar.",
      },
    },
    {
      src: "/projects/flightdelay/evidence.webp",
      alt: {
        en: "Model evidence: the metrics and curves of the test set.",
        ru: "Доказательства модели: метрики и кривые на тестовой выборке.",
        uz: "Model dalillari: test to‘plamidagi metrikalar va egri chiziqlar.",
      },
      caption: {
        en: "The evidence page, inside the app.",
        ru: "Страница с доказательствами, прямо в приложении.",
        uz: "Dalillar sahifasi, ilovaning o‘zida.",
      },
    },
  ],
  hard: [
    {
      title: { en: "No peeking at the future", ru: "Без подглядывания в будущее", uz: "Kelajakka qaramaslik" },
      text: {
        en: "Only columns known before departure go in. Actual departure and arrival times, taxi times, tail numbers and delay causes are excluded, and traffic statistics are learned on the training split only.",
        ru: "В модель идут только столбцы, известные до вылета. Фактическое время вылета и прилёта, руление, бортовые номера и причины задержек исключены, а статистика загрузки считается только на обучающей части.",
        uz: "Modelga faqat uchishdan oldin ma’lum ustunlar kiradi. Haqiqiy uchish va qo‘nish vaqti, taksi vaqti, bort raqami va kechikish sababi chiqarilgan, yuklama statistikasi faqat o‘quv qismida hisoblanadi.",
      },
    },
    {
      title: { en: "Fitting into free hosting", ru: "Вместиться в бесплатный хостинг", uz: "Bepul xostingga sig‘ish" },
      text: {
        en: "The first model weighed 433 MB and needed 1.5 GB of RAM, too much for free hosting. Six configurations later it is 114 MB and 0.6 GB, with AUC going from 0.786 to 0.779.",
        ru: "Первая модель весила 433 МБ и требовала 1,5 ГБ памяти: на бесплатном хостинге ей не место. После шести конфигураций стало 114 МБ и 0,6 ГБ, AUC снизился с 0,786 до 0,779.",
        uz: "Birinchi model 433 MB edi va 1,5 GB xotira talab qilardi, bepul xostingga sig‘masdi. Olti konfiguratsiyadan keyin 114 MB va 0,6 GB bo‘ldi, AUC 0,786 dan 0,779 ga tushdi.",
      },
    },
  ],
  stack: [
    {
      tech: "CatBoost",
      why: {
        en: "Airports, routes and carriers are categories with thousands of values, which it handles natively.",
        ru: "Аэропорты, маршруты и перевозчики это категории с тысячами значений, а он работает с ними напрямую.",
        uz: "Aeroport, yo‘nalish va aviakompaniyalar minglab qiymatli kategoriyalar, u ular bilan bevosita ishlaydi.",
      },
    },
    {
      tech: "scikit-learn Pipeline",
      why: {
        en: "The same feature code runs at training and at inference.",
        ru: "Один и тот же код признаков работает и при обучении, и при прогнозе.",
        uz: "Bir xil belgilar kodi o‘qitishda ham, prognozda ham ishlaydi.",
      },
    },
    {
      tech: "Streamlit, Hugging Face Hub",
      why: {
        en: "A free public demo, with the model stored apart from the code.",
        ru: "Бесплатное публичное демо, а модель хранится отдельно от кода.",
        uz: "Bepul ochiq demo, model esa koddan alohida saqlanadi.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "ROC-AUC, full model", ru: "ROC-AUC, полная модель", uz: "ROC-AUC, to‘liq model" },
      value: "0.786",
      note: { en: "Compact model in the demo: 0.779.", ru: "Компактная модель в демо: 0,779.", uz: "Demodagi ixcham model: 0,779." },
    },
    {
      label: { en: "Test set", ru: "Тестовая выборка", uz: "Test to‘plami" },
      value: "408 907",
      note: {
        en: "20% of the first 2.1 million of 5.8 million US flights of 2015.",
        ru: "20% от первых 2,1 млн из 5,8 млн рейсов США за 2015 год.",
        uz: "2015-yilgi AQShning 5,8 mln reysidan dastlabki 2,1 mln ning 20%.",
      },
    },
    {
      label: { en: "Delayed flights", ru: "Доля задержек", uz: "Kechikkan reyslar" },
      value: "18.9%",
      note: { en: "Arrival more than 15 minutes late.", ru: "Прибытие с опозданием больше 15 минут.", uz: "15 daqiqadan ko‘p kechikib kelish." },
    },
    {
      label: { en: "Training", ru: "Обучение", uz: "O‘qitish" },
      value: "≈ 11 min",
      note: { en: "On an RTX 4050.", ru: "На RTX 4050.", uz: "RTX 4050 da." },
    },
  ],
  metricsSource: {
    en: "From reports/metrics in the repository. The threshold table is for the full model.",
    ru: "Из reports/metrics в репозитории. Таблица порогов относится к полной модели.",
    uz: "Repozitoriydagi reports/metrics dan. Chegaralar jadvali to‘liq modelga tegishli.",
  },
};
