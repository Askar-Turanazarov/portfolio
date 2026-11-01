import type { CaseContent } from "./types";

export const flightdelay: CaseContent = {
  slug: "flightdelay",
  kind: {
    en: "Data Science & ML service",
    ru: "Data Science и ML-сервис",
    uz: "Data Science va ML xizmat",
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
      en: "The forecast. The probability is compared with the share of delays in the data, 18.9%.",
      ru: "Прогноз. Вероятность сравнивается с долей задержек в данных, 18,9%.",
      uz: "Prognoz. Ehtimol ma’lumotlardagi kechikish ulushi, ya’ni 18,9% bilan solishtiriladi.",
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
        en: "Whether a flight runs late depends on combinations: hour, airport, route, carrier and traffic act together, and not in a straight line. Gradient boosting suits such complex non-linear, multi-dimensional dependencies: each new tree corrects the errors of the ones before it. CatBoost also takes categories with thousands of values directly (about 4,200 routes alone) and builds their combinations itself. These combinations carry real signal: when my experiments with the compact model forbade them, AUC fell from 0.786 to 0.733–0.751.",
        ru: "Опоздает ли рейс, зависит от сочетаний: час, аэропорт, маршрут, перевозчик и загрузка действуют вместе и не по прямой. Градиентный бустинг подходит для таких сложных нелинейных многомерных зависимостей: каждое новое дерево исправляет ошибки предыдущих. CatBoost к тому же принимает категории с тысячами значений напрямую (одних маршрутов около 4200) и сам строит их сочетания. В этих сочетаниях есть настоящий сигнал: когда в экспериментах с компактной моделью я их запрещал, AUC падал с 0,786 до 0,733–0,751.",
        uz: "Reys kechikishi birikmalarga bog‘liq: soat, aeroport, yo‘nalish, aviakompaniya va yuklama birgalikda va to‘g‘ri chiziq bo‘yicha emas, ta’sir qiladi. Gradient boosting shunday murakkab nochiziqli ko‘p o‘lchovli bog‘liqliklarga mos keladi: har bir yangi daraxt oldingilarining xatolarini tuzatadi. CatBoost minglab qiymatli kategoriyalarni ham bevosita qabul qiladi (faqat yo‘nalishlar 4200 ga yaqin) va ularning birikmalarini o‘zi quradi. Bu birikmalarda haqiqiy signal bor: ixcham model tajribalarida ularni taqiqlaganimda AUC 0,786 dan 0,733–0,751 gacha tushdi.",
      },
    },
    {
      tech: "scikit-learn Pipeline",
      why: {
        en: "The first step is my own FlightFeatureEngineer transformer, the second is CatBoost. Traffic statistics are computed in fit, on the training split only, which closes off leakage from the test set. The whole pipeline is saved as one file, so the app builds features with the same code as training and the two cannot drift apart. Switching to the compact model means swapping that file.",
        ru: "Первый шаг это мой трансформер FlightFeatureEngineer, второй это CatBoost. Статистика загрузки считается в fit только на обучающей части, что закрывает утечку из тестовой. Весь конвейер сохраняется одним файлом, поэтому приложение строит признаки тем же кодом, что и обучение, и разойтись с ним не может. Перейти на компактную модель значит заменить этот файл.",
        uz: "Birinchi qadam mening FlightFeatureEngineer transformerim, ikkinchisi CatBoost. Yuklama statistikasi fit ichida faqat o‘quv qismida hisoblanadi, bu test qismidan sizib chiqishni yopadi. Butun konveyer bitta faylda saqlanadi, shuning uchun ilova belgilarni o‘qitishdagi kod bilan quradi va undan farq qila olmaydi. Ixcham modelga o‘tish shu faylni almashtirishdir.",
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
      label: { en: "All flights used", ru: "Всего рейсов в работе", uz: "Ishlatilgan barcha reyslar" },
      value: "2 044 533",
      note: {
        en: "The first 2.1 million rows of 5.8 million US flights of 2015 (January to mid-May), without cancelled and diverted flights.",
        ru: "Первые 2,1 млн строк из 5,8 млн рейсов США за 2015 год (январь — середина мая), без отменённых и перенаправленных.",
        uz: "2015-yilgi AQShning 5,8 mln reysidan dastlabki 2,1 mln qator (yanvar — may o‘rtasi), bekor qilingan va yo‘nalishi o‘zgartirilganlarsiz.",
      },
    },
    {
      label: { en: "Delays in the data", ru: "Доля задержек в данных", uz: "Ma’lumotlardagi kechikish ulushi" },
      value: "18.9%",
      note: {
        en: "A statistic of the data itself, not a decision of the model: arrival more than 15 minutes late. Across all of 2015: 17.9%.",
        ru: "Статистика самих данных, а не решение модели: прибытие с опозданием больше 15 минут. За весь 2015 год: 17,9%.",
        uz: "Modelning qarori emas, ma’lumotlarning o‘z statistikasi: 15 daqiqadan ko‘p kechikib kelish. Butun 2015-yil bo‘yicha: 17,9%.",
      },
    },
    {
      label: { en: "Training set", ru: "Обучающая выборка", uz: "O‘quv to‘plami" },
      value: "1 635 626",
      note: { en: "80% of the flights. The model learned on these.", ru: "80% рейсов. На них модель училась.", uz: "Reyslarning 80%. Model ularda o‘qigan." },
    },
    {
      label: { en: "Test set", ru: "Тестовая выборка", uz: "Test to‘plami" },
      value: "408 907",
      note: {
        en: "20% of the flights. The model never saw these in training. The split keeps the share of delays the same in both parts.",
        ru: "20% рейсов. При обучении модель их не видела. Разбиение сохраняет долю задержек одинаковой в обеих частях.",
        uz: "Reyslarning 20%. O‘qitishda model ularni ko‘rmagan. Bo‘linish ikkala qismda kechikish ulushini bir xil saqlaydi.",
      },
    },
    {
      label: { en: "Training", ru: "Обучение", uz: "O‘qitish" },
      value: "≈ 11 min",
      note: { en: "On an RTX 4050.", ru: "На RTX 4050.", uz: "RTX 4050 da." },
    },
  ],
  metricsSource: {
    en: "Model figures are from reports/metrics in the repository, flight counts and delay shares are counted from the source flights.csv. The threshold table is for the full model.",
    ru: "Показатели модели из reports/metrics в репозитории, число рейсов и доли задержек посчитаны по исходному flights.csv. Таблица порогов относится к полной модели.",
    uz: "Model ko‘rsatkichlari repozitoriydagi reports/metrics dan, reyslar soni va kechikish ulushlari asl flights.csv bo‘yicha hisoblangan. Chegaralar jadvali to‘liq modelga tegishli.",
  },
};
