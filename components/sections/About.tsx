import type { Dictionary } from "@/lib/dictionary";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;
  return (
    <Section id="about" eyebrow={a.eyebrow} title={a.title}>
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="space-y-5 text-base leading-relaxed text-fg-muted lg:col-span-7">
          {a.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="rounded-xl border border-dashed border-border-strong bg-bg-muted/50 p-5 text-sm leading-relaxed text-fg-muted">
            {a.note}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
