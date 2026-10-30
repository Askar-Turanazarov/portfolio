import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20 sm:py-28", className)}>
      <Container>
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h2>
          {lead && <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">{lead}</p>}
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
