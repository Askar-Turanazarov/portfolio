import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { site } from "@/content/site";

/** Home: the street design lands here step by step; version 2 stays under /[lang]/v2. */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold">{site.name}</h1>
      <p className="mt-4 text-fg-muted">{dict.meta.description}</p>
      <p className="mt-8">
        <a className="underline" href={`/${lang}/v2`}>
          {dict.nav.v2}
        </a>
      </p>
    </main>
  );
}
