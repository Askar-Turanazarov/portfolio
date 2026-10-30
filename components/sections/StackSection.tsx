import type { Dictionary } from "@/lib/dictionary";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function StackSection({ dict }: { dict: Dictionary }) {
  const s = dict.stack;
  return (
    <Section id="stack" eyebrow={s.eyebrow} title={s.title} lead={s.lead} className="bg-bg-muted/40">
      <Reveal className="overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-card">
        <div className="hidden grid-cols-[160px_1fr_1.6fr] gap-6 border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle md:grid">
          <span>{s.columns.layer}</span>
          <span>{s.columns.tech}</span>
          <span>{s.columns.why}</span>
        </div>
        <ul className="divide-y divide-border">
          {s.rows.map((row) => (
            <li key={row.layer} className="grid gap-2 px-6 py-5 md:grid-cols-[160px_1fr_1.6fr] md:gap-6">
              <span className="font-mono text-xs uppercase tracking-wide text-accent md:pt-0.5">{row.layer}</span>
              <span className="font-medium text-fg">{row.tech}</span>
              <span className="text-sm leading-relaxed text-fg-muted">{row.why}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
