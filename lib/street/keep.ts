import type { SceneHandle, SceneOptions } from "./scene";

export type SceneHandlers = {
  onHover: NonNullable<SceneOptions["onHover"]>;
  onQuality: NonNullable<SceneOptions["onQuality"]>;
  onCurrent: NonNullable<SceneOptions["onCurrent"]>;
  onDepart: () => void;
  onArrive: NonNullable<SceneOptions["onArrive"]>;
};

/** How long a parked scene holds the video memory before it is let go. */
const PARK_MS = 5 * 60 * 1000;
const KEY = "street:at";

/**
 * One scene per tab, outside React. Leaving the home page parks it (paused, drawing nothing); coming back puts the
 * same canvas on the page, so the view, the building and the card are what they were and nothing has to load again.
 */
export const keep = {
  sc: null as SceneHandle | null,
  host: null as HTMLDivElement | null,
  handlers: null as SceneHandlers | null,
  timer: 0 as number | ReturnType<typeof setTimeout>,
  /** Between leaving and the first frame back: the card must not replay its flight out of the sign. */
  returning: false,

  park() {
    const sc = this.sc;
    if (!sc) return;
    sc.pause(true);
    this.returning = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      sc.dispose();
      this.host?.remove();
      this.sc = this.host = null;
      this.returning = false;
    }, PARK_MS);
  },

  /** Survives a full reload of the tab. */
  remember() {
    const at = this.sc?.current();
    if (!at?.slug) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(at));
    } catch {
      /* private mode: a reload starts from the first building */
    }
  },

  recall(): { slug: string | null; open: boolean } | null {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    } catch {
      return null;
    }
  },
};
