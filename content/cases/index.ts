import type { CaseContent } from "./types";
import { domusEstate } from "./domus-estate";
import { flightdelay } from "./flightdelay";
import { skydentalRag } from "./skydental-rag";
import { octaneForge } from "./octane-forge";
import { marginflowCrm } from "./marginflow-crm";
import { ustozAi } from "./ustoz-ai";
import { corecraftPc } from "./corecraft-pc";
import { domusFurniture3d } from "./domus-furniture-3d";
import { sitego } from "./sitego";
import { hrSimulator } from "./hr-simulator";
import { orbitLanding } from "./orbit-landing";
import { cvForge } from "./cv-forge";
import { aiSupportAgent } from "./ai-support-agent";
import { postcraft } from "./postcraft";
import { tutorhook } from "./tutorhook";
import { askarBank } from "./askar-bank";
import { traveltracker } from "./traveltracker";
import { fintrack } from "./fintrack";
import { wingsOfHistory } from "./wings-of-history";
import { galacticVault } from "./galactic-vault";
import { firstSteps } from "./first-steps";

/** Reading order of the project pages; also the order of the prev/next links. */
const all: CaseContent[] = [domusEstate, flightdelay, skydentalRag, octaneForge, marginflowCrm, ustozAi, corecraftPc, domusFurniture3d, sitego, hrSimulator, orbitLanding, cvForge, aiSupportAgent, postcraft, tutorhook, askarBank, traveltracker, fintrack, wingsOfHistory, galacticVault, firstSteps];

export const caseOrder = all.map((c) => c.slug);
export const cases: Record<string, CaseContent> = Object.fromEntries(all.map((c) => [c.slug, c]));
