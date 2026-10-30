"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import type { Project, Tag } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/project/ProjectCard";

export function ProjectsGrid({
  projects,
  tags,
  covers,
  locale,
  grid,
  common,
}: {
  projects: Project[];
  tags: Tag[];
  covers: Record<string, boolean>;
  locale: Locale;
  grid: Dictionary["grid"];
  common: Dictionary["common"];
}) {
  const [active, setActive] = useState<Tag | null>(null);
  const visible = useMemo(() => (active ? projects.filter((p) => p.tags.includes(active)) : projects), [active, projects]);

  const chip = (selected: boolean) =>
    cn(
      "rounded-full border px-3 py-1 font-mono text-xs transition",
      selected
        ? "border-fg bg-fg text-bg"
        : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg",
    );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={grid.eyebrow}>
        <button type="button" className={chip(active === null)} onClick={() => setActive(null)} aria-pressed={active === null}>
          {grid.all}
        </button>
        {tags.map((t) => (
          <button key={t} type="button" className={chip(active === t)} onClick={() => setActive(t)} aria-pressed={active === t}>
            {common.tags[t]}
          </button>
        ))}
        <span className="ml-auto font-mono text-xs text-fg-subtle">
          {grid.showing} {visible.length} {grid.of} {projects.length}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-fg-muted">{grid.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} locale={locale} hasCover={covers[p.slug] ?? false} common={common} gridLabels={grid} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
