import type { L10n } from "@/lib/i18n";
import type { ModuleId } from "@/lib/schema";

export type Module = { id: ModuleId; name: L10n; long: L10n };

/** The ten modules every product is assembled from, in board order («Сборка»). */
export const modules: Module[] = [
  {
    id: "web",
    name: { en: "Site", ru: "Сайт", uz: "Sayt" },
    long: { en: "A site or web app", ru: "Сайт или веб-приложение", uz: "Sayt yoki veb-ilova" },
  },
  {
    id: "bot",
    name: { en: "Telegram bot", ru: "Telegram-бот", uz: "Telegram bot" },
    long: { en: "A Telegram bot", ru: "Telegram-бот", uz: "Telegram bot" },
  },
  {
    id: "miniapp",
    name: { en: "Mini App", ru: "Mini App", uz: "Mini App" },
    long: { en: "A Telegram Mini App", ru: "Telegram Mini App", uz: "Telegram Mini App" },
  },
  {
    id: "admin",
    name: { en: "Admin panel", ru: "Админка", uz: "Admin panel" },
    long: { en: "An admin panel with roles", ru: "Админ-панель и роли", uz: "Admin panel va rollar" },
  },
  {
    id: "ai",
    name: { en: "AI assistant", ru: "ИИ-ассистент", uz: "AI yordamchi" },
    long: {
      en: "An AI assistant with a model fallback chain",
      ru: "ИИ-ассистент с цепочкой фолбэка моделей",
      uz: "Modellar zaxira zanjiri bilan AI yordamchi",
    },
  },
  {
    id: "rag",
    name: { en: "RAG", ru: "RAG", uz: "RAG" },
    long: {
      en: "RAG over a knowledge base with a source trace",
      ru: "RAG по базе знаний с трейсом источников",
      uz: "Manbalar izi bilan bilimlar bazasi bo‘yicha RAG",
    },
  },
  {
    id: "pay",
    name: { en: "Payments", ru: "Оплата", uz: "To‘lov" },
    long: {
      en: "Payments and subscriptions: UzCard / HUMO, Click, Payme, Stripe, invoices in UZS",
      ru: "Оплата и подписки: UzCard / HUMO, Click, Payme, Stripe, счета в сумах",
      uz: "To‘lov va obunalar: UzCard / HUMO, Click, Payme, Stripe, so‘mdagi hisoblar",
    },
  },
  {
    id: "threed",
    name: { en: "3D", ru: "3D", uz: "3D" },
    long: {
      en: "3D in the browser: Three.js / React Three Fiber",
      ru: "3D в браузере: Three.js / React Three Fiber",
      uz: "Brauzerda 3D: Three.js / React Three Fiber",
    },
  },
  {
    id: "i18n",
    name: { en: "Three languages", ru: "Три языка", uz: "Uch til" },
    long: { en: "Interface in RU / UZ / EN", ru: "Интерфейс на RU / UZ / EN", uz: "RU / UZ / EN interfeys" },
  },
  {
    id: "mcp",
    name: { en: "MCP", ru: "MCP", uz: "MCP" },
    long: {
      en: "An MCP server for Claude Desktop",
      ru: "MCP-сервер для Claude Desktop",
      uz: "Claude Desktop uchun MCP server",
    },
  },
];

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<ModuleId, Module>;
