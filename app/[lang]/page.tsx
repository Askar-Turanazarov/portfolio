import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { coverMap } from "@/lib/covers";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Capabilities } from "@/components/sections/Capabilities";
import { AllProjects } from "@/components/sections/AllProjects";
import { StackSection } from "@/components/sections/StackSection";
import { Process } from "@/components/sections/Process";
import { Timeline } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const covers = coverMap();

  return (
    <>
      <Hero dict={dict} locale={lang} />
      <FeaturedProjects dict={dict} locale={lang} covers={covers} />
      <Capabilities dict={dict} />
      <AllProjects dict={dict} locale={lang} covers={covers} />
      <StackSection dict={dict} />
      <Process dict={dict} />
      <Timeline dict={dict} locale={lang} />
      <About dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
