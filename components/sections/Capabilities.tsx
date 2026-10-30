import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionary";
import { getProject } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Capabilities({ dict }: { dict: Dictionary }) {
  const c = dict.capabilities;
  return (
    <Section id="capabilities" eyebrow={c.eyebrow} title={c.title} lead={c.lead} className="bg-bg-muted/40">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.items.map((item, i) => {
          const refs = item.projects.map(getProject).filter((p): p is NonNullable<typeof p> => Boolean(p));
          return (
            <Reveal as="li" key={item.title} delay={(i % 4) * 60} className="flex h-full flex-col rounded-xl border border-border bg-bg-elevated p-5 shadow-card">
              <span className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-base font-semibold tracking-tight text-fg">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{item.desc}</p>
              <div className="mt-4 border-t border-border pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">{c.builtIn}</p>
                <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
                  {refs.map((p) => (
                    <li key={p.slug}>
                      <a
                        href={p.links.live ?? p.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-fg transition hover:text-accent"
                      >
                        <span aria-hidden className="mr-1 inline-block size-1.5 rounded-full" style={{ background: p.accent }} />
                        {p.name}
                        <ArrowUpRight className="size-3" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
