import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";
import { formatPeriod } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";
import { GitHubIcon } from "@/components/ui/icons";
import { Cover } from "./Cover";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({
  project,
  locale,
  hasCover,
  common,
  gridLabels,
}: {
  project: Project;
  locale: Locale;
  hasCover: boolean;
  common: Dictionary["common"];
  gridLabels: Dictionary["grid"];
}) {
  const primary = project.links.live ?? project.links.repo;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <a href={primary} target="_blank" rel="noopener noreferrer" className="relative block aspect-[16/10] overflow-hidden bg-bg-muted">
        <Cover project={project} hasCover={hasCover} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
        <span className="absolute left-3 top-3">
          <StatusBadge status={project.status} labels={common.status} />
        </span>
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-fg">{project.name}</h3>
          <span className="shrink-0 font-mono text-[11px] text-fg-subtle">{formatPeriod(project.period, common.months)}</span>
        </div>
        <p className="text-sm leading-relaxed text-fg-muted">{pick(project.tagline, locale)}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.tags.slice(0, 4).map((t) => (
            <li key={t}>
              <Badge tone="muted">{common.tags[t]}</Badge>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 border-t border-border pt-3 text-sm font-medium">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fg transition hover:text-accent"
            >
              {gridLabels.live}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          )}
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-fg-muted transition hover:text-fg"
          >
            <GitHubIcon className="size-3.5" />
            {gridLabels.code}
          </a>
          <span
            aria-hidden
            className="ml-auto size-2 rounded-full opacity-70 transition group-hover:opacity-100"
            style={{ background: project.accent }}
          />
        </div>
      </div>
    </article>
  );
}
