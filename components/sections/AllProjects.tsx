import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { gridProjects } from "@/content/projects";
import { tagsInUse } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { ProjectsGrid } from "./ProjectsGrid";

export function AllProjects({ dict, locale, covers }: { dict: Dictionary; locale: Locale; covers: Record<string, boolean> }) {
  return (
    <Section id="all-projects" eyebrow={dict.grid.eyebrow} title={dict.grid.title} lead={dict.grid.lead}>
      <ProjectsGrid
        projects={gridProjects}
        tags={tagsInUse(gridProjects)}
        covers={covers}
        locale={locale}
        grid={dict.grid}
        common={dict.common}
      />
    </Section>
  );
}
