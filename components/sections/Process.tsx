import type { Dictionary } from "@/lib/dictionary";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Process({ dict }: { dict: Dictionary }) {
  const p = dict.process;
  return (
    <Section id="process" eyebrow={p.eyebrow} title={p.title} lead={p.lead}>
      <ol className="grid gap-4 md:grid-cols-5">
        {p.steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 60} className="relative rounded-xl border border-border bg-bg-elevated p-5 shadow-card">
            <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-display text-base font-semibold tracking-tight text-fg">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{step.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
