import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/schema";
import { formatPeriod, hostOf } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Cover } from "./Cover";
import { DeviceFrame } from "./DeviceFrame";
import { StatusBadge } from "./StatusBadge";

export function FeaturedCase({
  project,
  index,
  locale,
  hasCover,
  dict,
}: {
  project: Project;
  index: number;
  locale: Locale;
  hasCover: boolean;
  dict: Dictionary;
}) {
  const flip = index % 2 === 1;
  const t = dict.featured;

  return (
    <Reveal as="article" className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={cn("min-w-0 lg:col-span-7", flip && "lg:order-last")}>
        <a href={project.links.live ?? project.links.repo} target="_blank" rel="noopener noreferrer" className="block">
          <DeviceFrame url={project.links.live ? hostOf(project.links.live) : `github.com/…/${project.repo}`}>
            <Cover project={project} hasCover={hasCover} sizes="(min-width: 1024px) 58vw, 100vw" priority={index === 0} />
          </DeviceFrame>
        </a>
      </div>

      <div className="min-w-0 lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
          <StatusBadge status={project.status} labels={dict.common.status} />
          <span className="font-mono text-xs text-fg-subtle">{formatPeriod(project.period, dict.common.months)}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{project.name}</h3>
        <p className="mt-2 text-base leading-relaxed text-fg-muted">{pick(project.tagline, locale)}</p>

        <dl className="mt-6 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t.problem}</dt>
            <dd className="mt-1 text-fg">{pick(project.problem, locale)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t.solution}</dt>
            <dd className="mt-1 text-fg-muted">{pick(project.solution, locale)}</dd>
          </div>
          {project.highlights.length > 0 && (
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t.highlights}</dt>
              <dd className="mt-1">
                <ul className="space-y-1.5 text-fg-muted">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: project.accent }} />
                      <span>{pick(h, locale)}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t.forBusiness}</dt>
            <dd className="mt-1 text-fg-muted">{pick(project.forBusiness, locale)}</dd>
          </div>
        </dl>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge tone="muted">{s}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.live && (
            <ButtonLink href={project.links.live} variant="primary">
              {t.live}
              <ArrowUpRight className="size-4" aria-hidden />
            </ButtonLink>
          )}
          <ButtonLink href={project.links.repo} variant="secondary">
            <GitHubIcon className="size-4" />
            {t.code}
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}
