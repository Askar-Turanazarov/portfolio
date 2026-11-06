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
    en: "A dispatcher needs the risk before departure, when only the schedule, route, carrier, traffic and the weather forecast are known, not after the plane is already late.",
    ru: "Диспетчеру нужен риск до вылета, когда известны только расписание, маршрут, перевозчик, загрузка и прогноз погоды, а не когда самолёт уже опаздывает.",
    uz: "Dispetcherga xavf uchishdan oldin kerak: o‘sha paytda faqat jadval, yo‘nalish, aviakompaniya, yuklama va ob-havo prognozi ma’lum bo‘ladi.",
  },
  note: {
    en: "My diploma model and a newer one that also knows the weather; the demo switches between them. The free demo may need up to a minute to wake and load.",
    ru: "Моя дипломная модель и более новая, которая учитывает погоду; в демо между ними можно переключаться. Бесплатному демо может понадобиться до минуты, чтобы проснуться и загрузиться.",
    uz: "Diplom modelim va ob-havoni ham hisobga oladigan yangiroq model; demoda ular orasida almashish mumkin. Bepul demoga uyg‘onish va yuklanish uchun bir daqiqagacha kerak bo‘lishi mumkin.",
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
      en: "The forecast of the diploma model. The probability is compared with the share of delays in the data, 18.9%.",
      ru: "Прогноз дипломной модели. Вероятность сравнивается с долей задержек в данных, 18,9%.",
      uz: "Diplom modelining prognozi. Ehtimol ma’lumotlardagi kechikish ulushi, ya’ni 18,9% bilan solishtiriladi.",
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
      name: { en: "Weather and a choice of model", ru: "Погода и выбор модели", uz: "Ob-havo va model tanlash" },
      text: {
        en: "The default model also takes wind, visibility, precipitation and hazards at both airports and returns a calibrated probability. The sidebar switches to the diploma model.",
        ru: "Модель по умолчанию учитывает ещё ветер, видимость, осадки и опасные явления в обоих аэропортах и выдаёт откалиброванную вероятность. В боковой панели можно переключиться на дипломную модель.",
        uz: "Sukut bo‘yicha model ikkala aeroportdagi shamol, ko‘rinish, yog‘ingarchilik va xavfli hodisalarni ham hisobga oladi va kalibrlangan ehtimol beradi. Yon panelda diplom modeliga o‘tish mumkin.",
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
    {
      title: { en: "New dates are harder", ru: "Новые даты сложнее", uz: "Yangi sanalar qiyinroq" },
      text: {
        en: "0.786 is measured on random flights from dates the model had already seen. On June to December it falls to 0.63: in part the model memorises bad days. More data barely helped (0.659 on 73 hidden days). Hourly weather at both airports lifted it to 0.699; the demo's light version scores 0.698 at 40 MB.",
        ru: "0,786 измерено на случайных рейсах тех дат, которые модель уже видела. На июне — декабре качество падает до 0,63: отчасти модель запоминает плохие дни. Больше данных почти не помогло (0,659 на 73 скрытых днях). Почасовая погода в обоих аэропортах подняла его до 0,699; облегчённая версия в демо даёт 0,698 при 40 МБ.",
        uz: "0,786 model allaqachon ko‘rgan sanalardagi tasodifiy reyslarda o‘lchangan. Iyun — dekabrda sifat 0,63 gacha tushadi: model qisman yomon kunlarni yodlab oladi. Ko‘proq ma’lumot deyarli yordam bermadi (73 ta yashirin kunda 0,659). Ikkala aeroportdagi soatlik ob-havo uni 0,699 gacha ko‘tardi; demodagi yengil versiya 40 MB da 0,698 beradi.",
      },
    },
  ],
  journey: {
    lead: {
      en: "The final script trains in about 11 minutes, but its settings came out of a series of experiments. This is what the saved notebooks and reports show.",
      ru: "Финальный скрипт обучается примерно за 11 минут, но его настройки появились по итогам серии экспериментов. Вот что показывают сохранившиеся тетрадки и отчёты.",
      uz: "Yakuniy skript taxminan 11 daqiqada o‘qitiladi, ammo uning sozlamalari bir qator tajribalar natijasida paydo bo‘lgan. Saqlangan daftarlar va hisobotlar shuni ko‘rsatadi.",
    },
    rows: [
      {
        when: { en: "18 Jan", ru: "18.01", uz: "18.01" },
        what: {
          en: "CatBoost with and without PCA, 1 million rows",
          ru: "CatBoost с PCA и без него, 1 млн строк",
          uz: "PCA bilan va usiz CatBoost, 1 mln qator",
        },
        result: { en: "AUC 0.714 and 0.776", ru: "AUC 0,714 и 0,776", uz: "AUC 0,714 va 0,776" },
        decision: { en: "Dropped PCA", ru: "Отказ от PCA", uz: "PCA dan voz kechildi" },
      },
      {
        when: { en: "18 Jan", ru: "18.01", uz: "18.01" },
        what: {
          en: "Target “more than 45 minutes late”, 1.1 million rows",
          ru: "Цель «опоздание больше 45 минут», 1,1 млн строк",
          uz: "Maqsad “45 daqiqadan ko‘p kechikish”, 1,1 mln qator",
        },
        result: { en: "AUC 0.784, precision 0.21", ru: "AUC 0,784, точность 0,21", uz: "AUC 0,784, aniqlik 0,21" },
        decision: { en: "Back to 15 minutes", ru: "Возврат к 15 минутам", uz: "15 daqiqaga qaytildi" },
      },
      {
        when: { en: "19 Jan", ru: "19.01", uz: "19.01" },
        what: {
          en: "Aircraft history features (tail_reliability, TAIL_NUMBER), 2.1 million rows",
          ru: "Признаки истории борта (tail_reliability, TAIL_NUMBER), 2,1 млн строк",
          uz: "Bort tarixi belgilari (tail_reliability, TAIL_NUMBER), 2,1 mln qator",
        },
        result: { en: "AUC 0.712, 14 minutes", ru: "AUC 0,712, 14 минут", uz: "AUC 0,712, 14 daqiqa" },
        decision: { en: "Rejected", ru: "Отказ", uz: "Rad etildi" },
      },
      {
        when: { en: "19 Jan", ru: "19.01", uz: "19.01" },
        what: {
          en: "An ensemble of CatBoost and LightGBM",
          ru: "Ансамбль CatBoost и LightGBM",
          uz: "CatBoost va LightGBM ansambli",
        },
        result: { en: "AUC 0.776, 12.5 minutes", ru: "AUC 0,776, 12,5 минуты", uz: "AUC 0,776, 12,5 daqiqa" },
        decision: { en: "Rejected: worse than CatBoost alone", ru: "Отказ: хуже одного CatBoost", uz: "Rad etildi: yolg‘iz CatBoost dan yomonroq" },
      },
      {
        when: { en: "19 Jan", ru: "19.01", uz: "19.01" },
        what: {
          en: "CatBoost alone, scale_pos_weight 3.9",
          ru: "Один CatBoost, scale_pos_weight 3,9",
          uz: "Yolg‘iz CatBoost, scale_pos_weight 3,9",
        },
        result: { en: "AUC 0.7859", ru: "AUC 0,7859", uz: "AUC 0,7859" },
        decision: { en: "Close, kept tuning", ru: "Близко, подбор продолжен", uz: "Yaqin, tanlash davom etdi" },
      },
      {
        when: { en: "19–20 Jan", ru: "19–20.01", uz: "19–20.01" },
        what: {
          en: "CatBoost alone, scale_pos_weight 4.2",
          ru: "Один CatBoost, scale_pos_weight 4,2",
          uz: "Yolg‘iz CatBoost, scale_pos_weight 4,2",
        },
        result: { en: "AUC 0.7860, 10 min 37 s", ru: "AUC 0,7860, 10 мин 37 с", uz: "AUC 0,7860, 10 daq 37 s" },
        decision: { en: "The final model", ru: "Финальная модель", uz: "Yakuniy model" },
        final: true,
      },
      {
        when: { en: "After", ru: "Затем", uz: "Keyin" },
        what: {
          en: "A threshold sweep from 0.20 to 0.50",
          ru: "Перебор порога от 0,20 до 0,50",
          uz: "0,20 dan 0,50 gacha chegarani saralash",
        },
        result: { en: "0.37: recall 0.818, precision 0.306", ru: "0,37: полнота 0,818, точность 0,306", uz: "0,37: to‘liqlik 0,818, aniqlik 0,306" },
        decision: { en: "Threshold 0.37", ru: "Выбран порог 0,37", uz: "0,37 chegara tanlandi" },
      },
      {
        when: { en: "October", ru: "Октябрь", uz: "Oktabr" },
        what: {
          en: "Six compact configurations for free hosting",
          ru: "6 компактных конфигураций для бесплатного хостинга",
          uz: "Bepul xosting uchun 6 ta ixcham konfiguratsiya",
        },
        result: { en: "AUC 0.779, 114 MB", ru: "AUC 0,779, 114 МБ", uz: "AUC 0,779, 114 MB" },
        decision: { en: "Configuration E in the demo", ru: "Конфигурация E в демо", uz: "Demoda E konfiguratsiyasi" },
      },
      {
        when: { en: "November", ru: "Ноябрь", uz: "Noyabr" },
        what: {
          en: "Whole 2015 with and without weather, checked on 73 hidden days",
          ru: "Весь 2015 год с погодой и без, проверка на 73 скрытых днях",
          uz: "Butun 2015-yil ob-havo bilan va usiz, 73 ta yashirin kunda tekshiruv",
        },
        result: { en: "AUC 0.659 → 0.699", ru: "AUC 0,659 → 0,699", uz: "AUC 0,659 → 0,699" },
        decision: {
          en: "Light version (0.698, 40 MB) is the demo default",
          ru: "Облегчённая версия (0,698, 40 МБ) по умолчанию в демо",
          uz: "Yengil versiya (0,698, 40 MB) demoda sukut bo‘yicha",
        },
      },
    ],
    note: {
      en: "Alongside these runs I tuned the CatBoost hyperparameters and tried other seed values, checking the metrics each time. The diploma report notes that Lossguide trees overfitted on 2 million rows and more, while symmetric trees generalised better. I did not keep the logs of those runs, so there are no exact figures for them here.",
      ru: "Параллельно с этими прогонами я подбирал гиперпараметры CatBoost и пробовал другие значения seed, каждый раз проверяя показатели. В отчёте к диплому отмечено, что деревья Lossguide переобучались на 2 млн строк и больше, а симметричные обобщали лучше. Логи этих прогонов я не сохранил, поэтому точных цифр по ним здесь нет.",
      uz: "Bu sinovlar bilan birga CatBoost giperparametrlarini tanladim va boshqa seed qiymatlarini sinab ko‘rdim, har safar ko‘rsatkichlarni tekshirdim. Diplom hisobotida Lossguide daraxtlari 2 mln va undan ko‘p qatorda qayta o‘qitilgani, simmetrik daraxtlar esa yaxshiroq umumlashtirgani qayd etilgan. Bu sinovlar loglarini saqlamaganman, shuning uchun ular bo‘yicha aniq raqamlar bu yerda yo‘q.",
    },
  },
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
        en: "The first step is my own FlightFeatureEngineer transformer, the second is CatBoost. Traffic statistics are computed in fit, on the training split only, which closes off leakage from the test set. The whole pipeline is saved as one file, so the app builds features with the same code as training and the two cannot drift apart. Each model in the demo is one such file.",
        ru: "Первый шаг это мой трансформер FlightFeatureEngineer, второй это CatBoost. Статистика загрузки считается в fit только на обучающей части, что закрывает утечку из тестовой. Весь конвейер сохраняется одним файлом, поэтому приложение строит признаки тем же кодом, что и обучение, и разойтись с ним не может. Каждая модель в демо это один такой файл.",
        uz: "Birinchi qadam mening FlightFeatureEngineer transformerim, ikkinchisi CatBoost. Yuklama statistikasi fit ichida faqat o‘quv qismida hisoblanadi, bu test qismidan sizib chiqishni yopadi. Butun konveyer bitta faylda saqlanadi, shuning uchun ilova belgilarni o‘qitishdagi kod bilan quradi va undan farq qila olmaydi. Demodagi har bir model shunday bitta fayl.",
      },
    },
    {
      tech: "Streamlit, Hugging Face Hub",
      why: {
        en: "A free public demo, with the models stored apart from the code. A model is loaded the first time someone picks it and then stays in memory for every visitor, so only the first switch waits a few seconds; both demo models together take about 0.85 GB.",
        ru: "Бесплатное публичное демо, а модели хранятся отдельно от кода. Модель загружается, когда её впервые выбирают, и дальше остаётся в памяти для всех посетителей, поэтому несколько секунд ждёт только первое переключение; обе модели демо вместе занимают около 0,85 ГБ.",
        uz: "Bepul ochiq demo, modellar esa koddan alohida saqlanadi. Model birinchi marta tanlanganda yuklanadi va keyin barcha tashrif buyuruvchilar uchun xotirada qoladi, shuning uchun faqat birinchi almashtirish bir necha soniya kutadi; ikkala demo modeli birga taxminan 0,85 GB egallaydi.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "ROC-AUC, full model", ru: "ROC-AUC, полная модель", uz: "ROC-AUC, to‘liq model" },
      value: "0.786",
      note: {
        en: "Random flights from dates the model had seen. Compact model in the demo: 0.779.",
        ru: "Случайные рейсы тех дат, которые модель видела. Компактная модель в демо: 0,779.",
        uz: "Model ko‘rgan sanalardagi tasodifiy reyslar. Demodagi ixcham model: 0,779.",
      },
    },
    {
      label: { en: "ROC-AUC on unseen days, weather model", ru: "ROC-AUC на невиданных днях, модель с погодой", uz: "Ko‘rilmagan kunlarda ROC-AUC, ob-havo modeli" },
      value: "0.698",
      note: {
        en: "73 whole days left out of training, 1.1 million flights. The diploma models score 0.63–0.64 on new dates.",
        ru: "73 целых дня, исключённых из обучения, 1,1 млн рейсов. Дипломные модели на новых датах дают 0,63–0,64.",
        uz: "O‘qitishdan chiqarilgan 73 ta butun kun, 1,1 mln reys. Diplom modellari yangi sanalarda 0,63–0,64 beradi.",
      },
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
        en: "20% of the flights. The model never saw these in training. The split is random and keeps the share of delays the same in both parts.",
        ru: "20% рейсов. При обучении модель их не видела. Разбиение случайное и сохраняет долю задержек одинаковой в обеих частях.",
        uz: "Reyslarning 20%. O‘qitishda model ularni ko‘rmagan. Bo‘linish tasodifiy va ikkala qismda kechikish ulushini bir xil saqlaydi.",
      },
    },
    {
      label: { en: "Training", ru: "Обучение", uz: "O‘qitish" },
      value: "≈ 11 min",
      note: {
        en: "One run of the final script on an RTX 4050, after the experiments above.",
        ru: "Один запуск финального скрипта на RTX 4050, уже после экспериментов выше.",
        uz: "Yuqoridagi tajribalardan keyin RTX 4050 da yakuniy skriptning bitta ishga tushirilishi.",
      },
    },
  ],
  metricsSource: {
    en: "Model figures are from reports/metrics in the repository (the weather model: weather_model_results.txt), flight counts and delay shares are counted from the source flights.csv. The threshold table is for the full model.",
    ru: "Показатели модели из reports/metrics в репозитории (модель с погодой: weather_model_results.txt), число рейсов и доли задержек посчитаны по исходному flights.csv. Таблица порогов относится к полной модели.",
    uz: "Model ko‘rsatkichlari repozitoriydagi reports/metrics dan (ob-havo modeli: weather_model_results.txt), reyslar soni va kechikish ulushlari asl flights.csv bo‘yicha hisoblangan. Chegaralar jadvali to‘liq modelga tegishli.",
  },
};
