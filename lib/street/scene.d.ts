/** Types for scene.js, the plain-JS street scene (shared with the preview tooling). */
export type TimeName = "day" | "evening";
export type Tier = "mid" | "high";

export type SceneBuilding = { slug: string; name: string; accent: string; x: number; w: number; h: number };
export type LabelPoint = { x: number; y: number; visible: boolean };

export type SceneOptions = {
  tier?: Tier;
  time?: TimeName;
  /** No walking: used for posters and screenshots. */
  still?: boolean;
  /** Where the PBR textures live, with a trailing slash. */
  texturePath?: string;
  onHover?: ((slug: string | null, point: LabelPoint | null, building: SceneBuilding | null) => void) | null;
  onPick?: ((slug: string, building: SceneBuilding) => void) | null;
};

export type SceneStats = {
  calls: number;
  triangles: number;
  frames: number;
  median: number;
  p95: number;
  max: number;
  pixelRatio: number;
  size: [number, number];
  x: number;
};

export type SceneHandle = {
  ready: Promise<void>;
  buildings: SceneBuilding[];
  setTime(name: TimeName, instant?: boolean): void;
  getTime(): TimeName;
  flyTo(slug: string): void;
  highlight(slug: string | null): void;
  setView(view: { x?: number; phase?: number; az?: number; height?: number }): void;
  pause(paused: boolean): void;
  stats(): SceneStats;
  dispose(): void;
};

export const TIMES: Record<TimeName, unknown>;
export function createScene(container: HTMLElement, options?: SceneOptions): SceneHandle;
