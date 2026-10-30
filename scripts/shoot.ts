/**
 * Takes a 1440×900 screenshot of every project that has a live URL and saves it
 * as public/projects/<slug>/cover.webp.
 *
 *   npm run shoot              # all live projects
 *   npm run shoot -- domus-estate skydental-rag   # only these slugs
 *
 * Demos on free tiers may need a cold start, so timeouts are generous.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { projects } from "../content/projects";

const WIDTH = 1440;
const HEIGHT = 900;
const QUALITY = 82;

const hideNoise = `
  [class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i],
  nextjs-portal, #__next-build-watcher, [data-nextjs-toast] { display: none !important; }
  *, *::before, *::after { animation-play-state: paused !important; caret-color: transparent !important; }
`;

async function main() {
  const only = new Set(process.argv.slice(2));
  const targets = projects.filter((p) => p.links.live && (only.size === 0 || only.has(p.slug)));

  if (targets.length === 0) {
    console.error("No projects matched.");
    process.exitCode = 1;
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    colorScheme: "light",
    locale: "en-US",
    reducedMotion: "reduce",
  });

  let failed = 0;
  for (const p of targets) {
    const url = p.links.live!;
    const page = await context.newPage();
    const started = Date.now();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
      // Give 3D scenes and lazy sections a moment to settle.
      await page.waitForTimeout(3_000);
      await page.addStyleTag({ content: hideNoise }).catch(() => {});
      await page.mouse.move(WIDTH - 10, HEIGHT - 10);

      const png = await page.screenshot({ type: "png", fullPage: false });
      const dir = path.join(process.cwd(), "public", "projects", p.slug);
      await mkdir(dir, { recursive: true });
      await sharp(png).webp({ quality: QUALITY }).toFile(path.join(dir, "cover.webp"));

      console.log(`✓ ${p.slug.padEnd(22)} ${url}  (${((Date.now() - started) / 1000).toFixed(1)}s)`);
    } catch (error) {
      failed += 1;
      console.error(`✗ ${p.slug.padEnd(22)} ${url}\n  ${(error as Error).message.split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n${targets.length - failed}/${targets.length} covers written to public/projects/`);
  if (failed) process.exitCode = 1;
}

main();
