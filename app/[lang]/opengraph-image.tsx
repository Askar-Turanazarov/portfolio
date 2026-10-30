import { ImageResponse } from "next/og";
import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { site } from "@/content/site";
import { stats } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Manrope covers Latin and Cyrillic, which the RU title needs. Fetched once per build
 * from Google Fonts; if that fails the image falls back to the font bundled with next/og.
 */
async function loadFont(): Promise<ArrayBuffer | undefined> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Manrope:wght@700&subset=cyrillic",
      // An old UA makes Google return a single TTF instead of woff2 slices.
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) return undefined;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return undefined;
  }
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);
  const font = await loadFont();

  const facts = [
    [stats.projects, dict.hero.stats.projects],
    [stats.liveDemos, dict.hero.stats.liveDemos],
    [stats.languages, dict.hero.stats.languages],
  ] as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#1d1a17",
          backgroundImage: "radial-gradient(circle at 1px 1px, #3a342e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "#f7f4ef",
          fontFamily: font ? "Manrope" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#f7f4ef",
              color: "#1d1a17",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {site.monogram}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{site.name}</div>
            <div style={{ display: "flex", fontSize: 22, color: "#b5aca2" }}>{dict.hero.eyebrow}</div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1, maxWidth: 1000 }}>
          {dict.hero.title}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 56 }}>
            {facts.map(([value, label]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#e8873a" }}>{value}</div>
                <div style={{ display: "flex", fontSize: 20, color: "#b5aca2" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#b5aca2" }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Manrope", data: font, weight: 700, style: "normal" }] : undefined,
    },
  );
}
