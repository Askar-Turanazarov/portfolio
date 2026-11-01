import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { projects } from "@/content/projects";
import { coverMap } from "@/lib/covers";
import { streetOrder } from "@/lib/street/order";
import { Hero } from "@/components/street/Hero";
import { Flagships } from "@/components/street/Flagships";
import { Spread } from "@/components/street/Spread";
import { Assembly } from "@/components/street/Assembly";
import { Colophon } from "@/components/street/Colophon";
import { Interactions } from "@/components/street/Interactions";

/**
 * Home: the street. Hero with the live scene, the flagships as a table of contents and as
 * spreads in the light of their own screens, the «Assembly» board of all projects, the colophon.
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const covers = coverMap();
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const ordered = streetOrder.map((s) => bySlug.get(s)).filter((p) => p !== undefined);
  const flagships = ordered.filter((p) => p.featured);
  // Figures are numbered among the spreads that have one, so a text-only spread does not leave a gap.
  let figure = 0;
  const spreads = flagships.map((p, i) => {
    const has = covers[p.slug] === true;
    return { p, i, has, figure: has ? ++figure : undefined, side: (i % 2 === 0 ? "odd" : "even") as "odd" | "even" };
  });

  return (
    <main>
      <Hero dict={dict} locale={lang} />
      <Flagships dict={dict} locale={lang} flagships={flagships} />
      <div className="spreads">
      <div className="depth-sky" aria-hidden="true">
        <i className="far" />
        <i className="mid" />
        <i className="near" />
      </div>
      {spreads.map(({ p, i, has, figure, side }) => (
        <Spread key={p.slug} dict={dict} locale={lang} project={p} index={i} figure={figure} side={side} hasCover={has} />
      ))}
      </div>
      <Assembly dict={dict} locale={lang} rows={ordered} />
      <Colophon dict={dict} />
      <Interactions />
    </main>
  );
}
