// The whole street in walking order: flagships first, then the rest from new to old, the earliest at the far end.
// Widths are footprints along the street for the lot planner.
import { FLAGSHIPS, createCoreCraft, createSkyDental, createOctaneForge, createMarginFlow, createUstoz, createDomus } from './buildings.js';
import {
  createClicker, createTravelTracker, createFinTrack, createWings, createMagic8, createBank, createTutorHook, createPostCraft,
  createSupportAgent, createCVForge, createOrbit, createSiteGo, createHRSim, createFurniture, createFlightDelay, createGalacticVault
} from './buildings-more.js';

export { FLAGSHIPS };

export const STREET = [
  { slug: 'domus-estate', name: 'Domus Estate', accent: '#c2703e', w: 18, make: createDomus },
  { slug: 'flightdelay', name: 'FlightDelay', accent: '#ff6b6b', w: 12, make: createFlightDelay },
  { slug: 'skydental-rag', name: 'SkyDental RAG', accent: '#0ea5e9', w: 15, make: createSkyDental },
  { slug: 'octane-forge', name: 'Octane Forge', accent: '#ef5a2a', w: 16, make: createOctaneForge },
  { slug: 'marginflow-crm', name: 'MarginFlow CRM', accent: '#10b981', w: 14, make: createMarginFlow },
  { slug: 'ustoz-ai', name: 'Ustoz AI', accent: '#7c3aed', w: 18, make: createUstoz },
  { slug: 'corecraft-pc', name: 'CoreCraft PC', accent: '#06b6d4', w: 14, make: createCoreCraft },
  { slug: 'domus-furniture-3d', name: 'Domus Furniture Planner 3D', accent: '#a16207', w: 12, make: createFurniture },
  { slug: 'hr-simulator', name: 'HR-Simulator', accent: '#e11d48', w: 8, make: createHRSim },
  { slug: 'sitego', name: 'SiteGo', accent: '#6366f1', w: 10, make: createSiteGo },
  { slug: 'orbit-landing', name: 'Orbit', accent: '#3b82f6', w: 10, make: createOrbit },
  { slug: 'cv-forge', name: 'CV Forge', accent: '#0d9488', w: 7, make: createCVForge },
  { slug: 'ai-support-agent', name: 'AI Support Agent', accent: '#0a84ff', w: 12, make: createSupportAgent },
  { slug: 'postcraft', name: 'PostCraft', accent: '#a855f7', w: 6, make: createPostCraft },
  { slug: 'tutorhook', name: 'TutorHook', accent: '#ec4899', w: 6, make: createTutorHook },
  { slug: 'askar-bank', name: 'Askar Bank', accent: '#7f3fbf', w: 14, make: createBank },
  { slug: 'wings-of-history', name: 'Wings of History', accent: '#38bdf8', w: 16, make: createWings },
  { slug: 'fintrack', name: 'FinTrack', accent: '#635bff', w: 8, make: createFinTrack },
  { slug: 'traveltracker', name: 'TravelTracker', accent: '#22c55e', w: 9, make: createTravelTracker },
  { slug: 'magic-8-ball', name: 'Magic 8 Ball', accent: '#4c1d95', w: 7, make: createMagic8 },
  { slug: 'galactic-vault', name: 'Galactic Vault', accent: '#00f0ff', w: 7, make: createGalacticVault },
  { slug: 'first-clicker', name: 'Clicker', accent: '#eab308', w: 5, make: createClicker }
];
