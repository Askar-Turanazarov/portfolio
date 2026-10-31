import { lang } from "next/root-params";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const value = await lang();
  const locale = value && hasLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <Container className="flex flex-col items-start gap-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">{dict.notFound.title}</h1>
      <p className="max-w-md text-fg-muted">{dict.notFound.lead}</p>
      <ButtonLink href={`/${locale}`} variant="secondary">
        {dict.notFound.back}
      </ButtonLink>
    </Container>
  );
}
