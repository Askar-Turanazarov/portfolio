import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getProject } from "@/content/projects";
import { caseOrder, cases } from "@/content/cases";
import { getDictionary } from "@/lib/dictionary";
import { hasLocale, locales, pick, type Locale } from "@/lib/i18n";
import { CaseShell } from "@/components/case/CaseShell";
import { Masthead } from "@/components/street/Masthead";

type Params = Promise<{ lang: string; slug: string }>;

/** Each page's own block is a separate chunk, so a page ships only what it uses. */
const blocks: Record<string, ComponentType<{ locale: Locale }>> = {
  "domus-estate": dynamic(() => import("@/components/case/blocks/DomusRace")),
  flightdelay: dynamic(() => import("@/components/case/blocks/FlightThreshold")),
  "skydental-rag": dynamic(() => import("@/components/case/blocks/SkyTrace")),
  "octane-forge": dynamic(() => import("@/components/case/blocks/OctaneRelay")),
  "marginflow-crm": dynamic(() => import("@/components/case/blocks/MarginFloor")),
  "ustoz-ai": dynamic(() => import("@/components/case/blocks/UstozLife")),
  "corecraft-pc": dynamic(() => import("@/components/case/blocks/CoreBreak")),
  "domus-furniture-3d": dynamic(() => import("@/components/case/blocks/FitPlan")),
  sitego: dynamic(() => import("@/components/case/blocks/SiteTwelve")),
  "hr-simulator": dynamic(() => import("@/components/case/blocks/HrDial")),
  "orbit-landing": dynamic(() => import("@/components/case/blocks/OrbitSplit")),
  "cv-forge": dynamic(() => import("@/components/case/blocks/CvWall")),
  "ai-support-agent": dynamic(() => import("@/components/case/blocks/SupportStream")),
  postcraft: dynamic(() => import("@/components/case/blocks/PostRules")),
  tutorhook: dynamic(() => import("@/components/case/blocks/ThreeMaterials")),
  "askar-bank": dynamic(() => import("@/components/case/blocks/LuhnWalk")),
  traveltracker: dynamic(() => import("@/components/case/blocks/TokenRotation")),
  fintrack: dynamic(() => import("@/components/case/blocks/MonthLedger")),
  "wings-of-history": dynamic(() => import("@/components/case/blocks/MuseumLabel")),
  "galactic-vault": dynamic(() => import("@/components/case/blocks/SectorGrid")),
  "first-steps": dynamic(() => import("@/components/case/blocks/FirstToys")),
};

export function generateStaticParams() {
  return locales.flatMap((lang) => caseOrder.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = cases[slug];
  const p = getProject(slug);
  if (!hasLocale(lang) || !c || !p) return {};
  return {
    title: `${p.name}: ${pick(c.title, lang)}`,
    description: pick(c.problem, lang),
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/projects/${slug}`]),
      ),
    },
  };
}

export default async function CasePage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const content = cases[slug];
  const project = getProject(slug);
  if (!hasLocale(lang) || !content || !project) notFound();

  const dict = await getDictionary(lang);
  const at = caseOrder.indexOf(slug);
  const neighbour = (i: number) => {
    const s = caseOrder[(i + caseOrder.length) % caseOrder.length];
    return { slug: s, name: getProject(s)?.name ?? s };
  };
  const Block = blocks[slug];
  const anchor = project.featured ? `spread-${slug}` : `row-${slug}`;

  return (
    <>
      <Masthead
        dict={dict}
        locale={lang}
        anchorBase={`/${lang}`}
        langPath={`/projects/${slug}`}
      />
      <CaseShell
        dict={dict}
        locale={lang}
        project={project}
        content={content}
        prev={neighbour(at - 1)}
        next={neighbour(at + 1)}
        backHref={`/${lang}#${anchor}`}
      >
        {Block && <Block locale={lang} />}
      </CaseShell>
    </>
  );
}
