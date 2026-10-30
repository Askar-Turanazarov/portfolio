import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { featuredProjects } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { FeaturedCase } from "@/components/project/FeaturedCase";

export function FeaturedProjects({ dict, locale, covers }: { dict: Dictionary; locale: Locale; covers: Record<string, boolean> }) {
  return (
    <Section id="projects" eyebrow={dict.featured.eyebrow} title={dict.featured.title} lead={dict.featured.lead}>
      <div className="space-y-20 sm:space-y-28">
        {featuredProjects.map((p, i) => (
          <FeaturedCase key={p.slug} project={p} index={i} locale={locale} hasCover={covers[p.slug] ?? false} dict={dict} />
        ))}
      </div>
    </Section>
  );
}
