export type GrowthBranch = { slug: string; leaf: string };

export type GrowthHandle = {
  level: string;
  gpu: { kind: string };
  ready: Promise<void>;
  setProgress(p: number): void;
  pause(paused: boolean): void;
  dispose(): void;
};

export function createGrowth(
  el: HTMLElement,
  options: { branches: GrowthBranch[]; labels?: (HTMLElement | null)[]; level?: string; initial?: number; still?: boolean },
): GrowthHandle;
