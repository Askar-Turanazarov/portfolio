import { stats } from "@/content/projects";
import type { CaseContent } from "./types";

export const firstSteps: CaseContent = {
  slug: "first-steps",
  kind: {
    en: "First projects",
    ru: "Первые проекты",
    uz: "Birinchi loyihalar",
  },
  title: {
    en: "The first two things I built: a clicker and a magic 8 ball.",
    ru: "Первые две вещи, которые я собрал: кликер и шар судьбы.",
    uz: "Men yig‘gan birinchi ikki narsa: kliker va taqdir shari.",
  },
  hook: {
    en: "Where it started. Both of these still work, so go ahead and click.",
    ru: "С чего всё началось. Обе вещи до сих пор работают, можно нажимать.",
    uz: "Hammasi shundan boshlangan. Ikkalasi hali ham ishlaydi, bosib ko‘ring.",
  },
  cover: {
    src: "/projects/first-steps/clicker.webp",
    alt: {
      en: "The Space Clicker: a star energy counter and a button to collect it.",
      ru: "Космический кликер: счётчик энергии звёзд и кнопка, которая её собирает.",
      uz: "Kosmik kliker: yulduz energiyasi hisoblagichi va uni yig‘adigan tugma.",
    },
    caption: {
      en: "The clicker, the first of the two.",
      ru: "Кликер, первый из двух.",
      uz: "Kliker, ikkalasidan birinchisi.",
    },
  },
  problem: {
    en: "A clicker and a Magic 8 Ball: the first two things I built. Small, unpolished, and they did what I wanted, which was enough to keep going.",
    ru: "Кликер и шар судьбы: первые две вещи, которые я собрал. Маленькие и не отполированные, но они делали то, что я хотел, и этого хватило, чтобы продолжить.",
    uz: "Kliker va taqdir shari: men yig‘gan birinchi ikki narsa. Kichik va silliqlanmagan, lekin xohlaganimni qilardi, davom etishga shu yetarli bo‘ldi.",
  },
  built: [
    {
      name: { en: "July 2026", ru: "Июль 2026", uz: "2026-yil iyul" },
      text: {
        en: "The clicker: one HTML file with a session timer and a table of records.",
        ru: "Кликер: один HTML-файл с таймером сессии и таблицей рекордов.",
        uz: "Kliker: sessiya taymeri va rekordlar jadvali bor bitta HTML fayl.",
      },
    },
    {
      name: { en: "August 2026", ru: "Август 2026", uz: "2026-yil avgust" },
      text: {
        en: "The ball: a question, a shake and one of fifteen answers.",
        ru: "Шар: вопрос, встряхивание и один из пятнадцати ответов.",
        uz: "Shar: savol, silkitish va o‘n beshta javobdan biri.",
      },
    },
    {
      name: { en: "October 2026", ru: "Октябрь 2026", uz: "2026-yil oktabr" },
      text: {
        en: "Domus Estate and FlightDelay, the two projects at the front of this site.",
        ru: "Domus Estate и FlightDelay, два проекта в начале этого сайта.",
        uz: "Domus Estate va FlightDelay, bu saytning boshidagi ikki loyiha.",
      },
    },
  ],
  metrics: [
    {
      label: { en: "Projects on this site, these two included", ru: "Проектов на этом сайте, включая эти два", uz: "Bu saytdagi loyihalar, shu ikkalasi bilan" },
      value: String(stats.projects),
    },
  ],
  links: [
    { label: { en: "Clicker, live", ru: "Кликер, живая версия", uz: "Kliker, jonli versiya" }, href: "https://askar-turanazarov.github.io/my-first-clickerapp/" },
    { label: { en: "Ball, live", ru: "Шар, живая версия", uz: "Shar, jonli versiya" }, href: "https://askar-turanazarov.github.io/Magic-8Ball/" },
    { label: { en: "Ball, repository", ru: "Шар, репозиторий", uz: "Shar, repozitoriy" }, href: "https://github.com/Askar-Turanazarov/Magic-8Ball" },
  ],
};
