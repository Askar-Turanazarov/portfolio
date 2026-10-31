/** Types for scene.js, the plain-JS street scene (shared with the preview tooling). */
export type TimeName = "day" | "evening";
export type Quality = "low" | "mid" | "high" | "ultra";
export type GpuKind = "integrated" | "discrete" | "software" | "unknown";
export type GpuInfo = { renderer: string; vendor: string; kind: GpuKind };

export type SceneBuilding = { slug: string; name: string; accent: string; x: number; w: number; h: number };
export type LabelPoint = { x: number; y: number; visible: boolean };

export type SceneOptions = {
  /** Force a quality level; by default it follows the GPU the context lands on. */
  quality?: Quality | null;
  time?: TimeName;
  /** No walking: used for posters and screenshots. */
  still?: boolean;
  /** Where the PBR textures live, with a trailing slash. */
  texturePath?: string;
  onHover?: ((slug: string | null, point: LabelPoint | null, building: SceneBuilding | null) => void) | null;
  onPick?: ((slug: string, building: SceneBuilding) => void) | null;
  /** The governor changed the quality level. */
  onQuality?: ((level: Quality, gpu: GpuInfo) => void) | null;
  /** Mount the diagnostic overlay (renderer, level, frame times, draw calls). */
  debug?: boolean;
};

export type SceneStats = {
  calls: number;
  triangles: number;
  textures: number;
  geometries: number;
  programs: number;
  frames: number;
  /** JS time of composer.render (ms): median, p95, max over the last 240 frames. */
  median: number;
  p95: number;
  max: number;
  /** Average main-thread time per rendered frame (ms). */
  cpu: number;
  /** GPU time of the last measured frame (ms), null without a timer extension; smoothed average. */
  gpu: number | null;
  gpuAvg: number | null;
  fps: number;
  rendered: number;
  pixelRatio: number;
  size: [number, number];
  buffer: [number, number];
  x: number;
  level: Quality;
  renderer: string;
  kind: GpuKind;
  log: string[];
};

export type SceneHandle = {
  ready: Promise<void>;
  gpu: GpuInfo;
  readonly level: Quality;
  setQuality(level: Quality): void;
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
