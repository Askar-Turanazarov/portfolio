import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { GitHubIcon } from "@/components/ui/icons";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const nav = [
    { href: "#projects", label: dict.nav.projects },
    { href: "#capabilities", label: dict.nav.capabilities },
    { href: "#stack", label: dict.nav.stack },
    { href: "#process", label: dict.nav.process },
    { href: "#journey", label: dict.nav.journey },
    { href: "#contact", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={site.name}>
          <span className="grid size-9 place-items-center rounded-md bg-fg font-display text-sm font-bold tracking-tight text-bg">
            {site.monogram}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-fg sm:block">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="rounded-md px-3 py-2 text-sm text-fg-muted transition hover:bg-bg-muted hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={dict.nav.github}
            title={dict.nav.github}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition hover:border-border-strong hover:text-fg"
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle label={dict.common.themeToggle} />
          <LocaleSwitcher current={locale} />
        </div>
      </Container>
    </header>
  );
}
