import { z } from "zod";

/** Filter tags shown in the project grid. Labels live in the dictionaries. */
export const tags = [
  "ai",
  "rag",
  "telegram",
  "3d",
  "payments",
  "admin",
  "mcp",
  "cms",
  "ecommerce",
  "saas",
  "fintech",
  "maps",
  "fun",
] as const;
export type Tag = (typeof tags)[number];

export const statuses = ["live", "live-cold", "code", "archived"] as const;
export type Status = (typeof statuses)[number];

const L10nSchema = z.object({ en: z.string().min(1), ru: z.string().min(1), uz: z.string().min(1) });

export const ProjectSchema = z.object({
  /** URL slug and folder name under public/projects/. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Product name as shown on the site. */
  name: z.string().min(1),
  /** GitHub repository name. */
  repo: z.string().min(1),
  tagline: L10nSchema,
  problem: L10nSchema,
  solution: L10nSchema,
  /** Which real business this applies to. */
  forBusiness: L10nSchema,
  tags: z.array(z.enum(tags)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  links: z.object({
    live: z.url().optional(),
    repo: z.url(),
  }),
  status: z.enum(statuses),
  /** One accent colour taken from the project's own design. Used only for small details. */
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  featured: z.boolean().default(false),
  /** Shown in the grid. Early experiments stay only in the timeline. */
  inGrid: z.boolean().default(true),
  /** Shown as a point on the journey timeline. */
  milestone: z.boolean().default(false),
  period: z.object({
    from: z.string().regex(/^\d{4}-\d{2}$/),
    to: z.string().regex(/^\d{4}-\d{2}$/),
  }),
  /** Hard parts and decisions, 2–4 bullets. Shown on featured cards. */
  highlights: z.array(L10nSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectInput = z.input<typeof ProjectSchema>;
