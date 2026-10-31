/**
 * The street in walking order, oldest project first. Mirrors `STREET` in registry.js (which
 * pulls in three.js and the builders, so server components read the order from here instead).
 */
export const streetOrder = [
  "first-clicker",
  "traveltracker",
  "fintrack",
  "wings-of-history",
  "magic-8-ball",
  "askar-bank",
  "tutorhook",
  "postcraft",
  "ai-support-agent",
  "cv-forge",
  "orbit-landing",
  "sitego",
  "hr-simulator",
  "corecraft-pc",
  "skydental-rag",
  "octane-forge",
  "domus-furniture-3d",
  "marginflow-crm",
  "ustoz-ai",
  "domus-estate",
] as const;
