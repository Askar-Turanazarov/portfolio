import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * The street's own fonts; both cover Latin and Cyrillic, which the RU title needs. Fetched once per
 * build from Google Fonts; if that fails the image falls back to the font bundled with next/og.
 */
async function loadFont(family: string, weight: number): Promise<ArrayBuffer | undefined> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(" ", "+")}:wght@${weight}&subset=cyrillic`,
      // An old UA makes Google return a single TTF or WOFF (which next/og can read) instead of woff2 slices.
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+\.(?:ttf|woff))\)/)?.[1];
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
  const [serif, sans, street] = await Promise.all([
    loadFont("Literata", 500),
    loadFont("Golos Text", 500),
    readFile(join(process.cwd(), "public/street/og-evening.jpg")),
  ]);
  const fonts = [
    ...(serif ? [{ name: "Literata", data: serif, weight: 500 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "Golos Text", data: sans, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", color: "#f4efe8" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered to a PNG by next/og */}
        <img src={`data:image/jpeg;base64,${street.toString("base64")}`} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(to right, rgba(29,24,32,0.94), rgba(29,24,32,0.82) 50%, rgba(29,24,32,0) 76%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: 720,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 0 56px 64px",
          }}
        >
          <div style={{ display: "flex", fontFamily: sans ? "Golos Text" : "sans-serif", fontSize: 30 }}>{site.name}</div>
          <div style={{ display: "flex", fontFamily: serif ? "Literata" : "serif", fontSize: 58, lineHeight: 1.12, letterSpacing: -0.5 }}>
            {dict.street.hero.say}
          </div>
          <div style={{ display: "flex", fontFamily: sans ? "Golos Text" : "sans-serif", fontSize: 24, color: "#cfc6bb" }}>
            {dict.street.hero.place}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
