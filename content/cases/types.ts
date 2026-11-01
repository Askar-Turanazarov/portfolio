import type { L10n } from "@/lib/i18n";

export type CaseImage = { src: string; alt: L10n; caption: L10n };

/** One long-form project page. A section with no data is not rendered. */
export type CaseContent = {
  slug: string;
  /** What kind of thing this is, in two words: the label above the project's name. */
  kind: L10n;
  /** One plain sentence under the name: what the product is and does. */
  title: L10n;
  /** The specific angle of this project; opens its own block further down the page. */
  hook: L10n;
  problem: L10n;
  audience?: L10n;
  /** One honest line next to the status: study project, invented company and so on. */
  note?: L10n;
  cover: CaseImage;
  built?: { name: L10n; text: L10n }[];
  /** Layers from the visitor down to storage. */
  arch?: { alt: L10n; layers: { label: L10n; nodes: string[] }[] };
  hard?: { title: L10n; text: L10n }[];
  /** The experiments behind a model, in order, with what each one decided. */
  journey?: {
    lead: L10n;
    rows: { when: L10n; what: L10n; result: L10n; decision: L10n; final?: boolean }[];
    note: L10n;
  };
  stack?: { tech: string; why: L10n }[];
  metrics?: { label: L10n; value: string; note?: L10n }[];
  /** Where the figures come from and when they were taken. */
  metricsSource?: L10n;
  gallery?: CaseImage[];
  /** Extra links, for example a model or a second demo. */
  links?: { label: L10n; href: string }[];
};
