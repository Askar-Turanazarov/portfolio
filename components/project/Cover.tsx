import Image from "next/image";
import type { Project } from "@/lib/schema";
import { monogram } from "@/lib/projects";

/** Screenshot when available, otherwise a calm tile in the project's accent. */
export function Cover({ project, hasCover, sizes, priority }: { project: Project; hasCover: boolean; sizes: string; priority?: boolean }) {
  if (hasCover) {
    return (
      <Image
        src={`/projects/${project.slug}/cover.webp`}
        alt={`${project.name} screenshot`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{ background: `linear-gradient(135deg, ${project.accent}22 0%, ${project.accent}55 100%)` }}
      aria-hidden
    >
      <span className="font-display text-5xl font-bold tracking-tight" style={{ color: project.accent }}>
        {monogram(project.name)}
      </span>
    </div>
  );
}
