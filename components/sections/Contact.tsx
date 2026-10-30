import { FileDown, Mail } from "lucide-react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/dictionary";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { GitHubIcon, LinkedInIcon, TelegramIcon } from "@/components/ui/icons";

type Item = { label: string; value: string; href: string; icon: ReactNode };

export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const items: Item[] = [
    { label: c.email, value: site.email, href: `mailto:${site.email}`, icon: <Mail className="size-5" aria-hidden /> },
    { label: c.github, value: site.githubHandle, href: site.github, icon: <GitHubIcon className="size-5" /> },
  ];
  if (site.telegram) items.push({ label: c.telegram, value: site.telegram.replace(/^https?:\/\/(t\.me\/)?/, "@"), href: site.telegram, icon: <TelegramIcon className="size-5" /> });
  if (site.linkedin) items.push({ label: c.linkedin, value: "LinkedIn", href: site.linkedin, icon: <LinkedInIcon className="size-5" /> });
  if (site.cvUrl) items.push({ label: c.cv, value: "PDF", href: site.cvUrl, icon: <FileDown className="size-5" aria-hidden /> });

  return (
    <Section id="contact" eyebrow={c.eyebrow} title={c.title} lead={c.lead} className="border-t border-border bg-bg-muted/40">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const external = /^https?:/.test(item.href);
          return (
            <Reveal as="li" key={item.label} delay={i * 60}>
              <a
                href={item.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full items-center gap-4 rounded-xl border border-border bg-bg-elevated p-5 shadow-card transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card-hover"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-soft text-fg">{item.icon}</span>
                <span className="min-w-0">
                  <span className="block truncate font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">{item.label}</span>
                  <span className="block truncate text-sm font-medium text-fg group-hover:text-accent">{item.value}</span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
