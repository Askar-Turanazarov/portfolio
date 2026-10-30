import type { Dictionary } from "@/lib/dictionary";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { GitHubIcon } from "@/components/ui/icons";

export function Footer({ dict }: { dict: Dictionary }) {
  const year = site.journey.to.slice(0, 4);
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-display font-semibold text-fg">{site.name}</p>
          <p>
            © {year}. {dict.footer.rights}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <p className="max-w-md sm:text-right">{dict.footer.built}</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${site.email}`} className="transition hover:text-fg">
              {site.email}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-fg"
            >
              <GitHubIcon className="size-4" />
              {site.githubHandle}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
