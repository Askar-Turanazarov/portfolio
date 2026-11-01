/**
 * The street in walking order: flagships first, then the other projects from new to old, the earliest at the far
 * end. Mirrors `STREET` in registry.js (which pulls in three.js and the builders, so server components read the
 * order from here instead).
 */
export const streetOrder = [
  "domus-estate",
  "flightdelay",
  "skydental-rag",
  "octane-forge",
  "marginflow-crm",
  "ustoz-ai",
  "corecraft-pc",
  "domus-furniture-3d",
  "hr-simulator",
  "sitego",
  "orbit-landing",
  "cv-forge",
  "ai-support-agent",
  "postcraft",
  "tutorhook",
  "askar-bank",
  "wings-of-history",
  "fintrack",
  "traveltracker",
  "magic-8-ball",
  "galactic-vault",
  "first-clicker",
] as const;
