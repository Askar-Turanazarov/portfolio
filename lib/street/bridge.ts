import type { SceneHandle } from "./scene";

/**
 * One place where the live scene handle is kept, so the strip, the board and the hero can talk
 * to it without React state: the server-rendered markup stays static and a client component
 * wires events to whatever scene is currently mounted (or to nothing, in poster mode).
 */
let handle: SceneHandle | null = null;

export function setScene(next: SceneHandle | null): void {
  handle = next;
}

export function getScene(): SceneHandle | null {
  return handle;
}
