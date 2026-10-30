import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { projects } from "@/content/projects";

export function coverPath(slug: string): string {
  return `/projects/${slug}/cover.webp`;
}

/** True when `public/projects/<slug>/cover.webp` exists. Server only. */
export function hasCover(slug: string): boolean {
  return existsSync(path.join(process.cwd(), "public", "projects", slug, "cover.webp"));
}

/** Cover availability for every project, computed once per render on the server. */
export function coverMap(): Record<string, boolean> {
  return Object.fromEntries(projects.map((p) => [p.slug, hasCover(p.slug)]));
}
