import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { stats } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/icons";

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const h = dict.hero;
  const items = [
    { value: stats.projects, label: h.stats.projects },
    { value: stats.liveDemos, label: h.stats.liveDemos },
    { value: stats.languages, label: h.stats.languages },
    { value: stats.months, label: h.stats.months },
  ];

  return (
    <section className="dot-grid relative overflow-hidden border-b border-border">
      <Container className="relative py-24 sm:py-32 lg:py-40">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{h.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl">
          {h.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">{h.subtitle}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}#projects`} size="lg">
            {h.ctaProjects}
            <ArrowDown className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href={site.github} variant="secondary" size="lg">
            <GitHubIcon className="size-4" />
            {h.ctaGithub}
          </ButtonLink>
          <ButtonLink href={`/${locale}#contact`} variant="ghost" size="lg">
            {h.ctaContact}
            <ArrowUpRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
          {items.map((s) => (
            <div key={s.label}>
              <dt className="order-last mt-1 text-sm text-fg-muted">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
