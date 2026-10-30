import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import { pick, type Locale } from "@/lib/i18n";
import { milestones } from "@/content/projects";
import { formatMonth } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Timeline({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const j = dict.journey;
  return (
    <Section id="journey" eyebrow={j.eyebrow} title={j.title} lead={j.lead} className="bg-bg-muted/40">
      <ol className="relative ml-2 border-l border-border pl-8 sm:ml-4">
        {milestones.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 40} className="relative pb-10 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[41px] top-1.5 grid size-4 place-items-center rounded-full border-2 border-bg"
              style={{ background: p.accent }}
            />
            <p className="font-mono text-xs uppercase tracking-wide text-fg-subtle">{formatMonth(p.period.from, dict.common.months)}</p>
            <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-fg">
              <a
                href={p.links.live ?? p.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-accent"
              >
                {p.name}
                <ArrowUpRight className="size-4 text-fg-subtle" aria-hidden />
              </a>
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-fg-muted">{pick(p.tagline, locale)}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
