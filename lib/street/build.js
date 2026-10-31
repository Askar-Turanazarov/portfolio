// The scene's off-thread build step. The foliage (≈ 9 000 leaf cards, ≈ 170 ms) and the two leaf atlases (≈ 100 ms
// of pixel work) are built in a worker while the main thread finishes the buildings and starts linking shaders;
// where workers or OffscreenCanvas are missing, or the worker fails, the same code runs on the main thread.
import { buildFoliage as buildHere, unpackGeometry } from './foliage.js';

/** The result with real geometries: { bark, leaves, shrubs: BufferGeometry, chinorAtlas, shrubAtlas, ms, where }. */
function unpack(res, where) {
  return { bark: unpackGeometry(res.bark), leaves: unpackGeometry(res.leaves), shrubs: unpackGeometry(res.shrubs), chinorAtlas: res.chinorAtlas, shrubAtlas: res.shrubAtlas, ms: res.ms, where };
}

export function buildFoliage(payload) {
  return new Promise((resolve) => {
    const here = () => resolve(unpack(buildHere(payload), 'main'));
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') { here(); return; }
    let worker;
    try {
      worker = new Worker(new URL('./foliage.worker.js', import.meta.url), { type: 'module' });
    } catch {
      here();
      return;
    }
    let done = false;
    const finish = (fn) => { if (done) return; done = true; clearTimeout(guard); worker.terminate(); fn(); };
    const guard = setTimeout(() => finish(here), 20000);
    worker.onerror = () => finish(here);
    worker.onmessageerror = () => finish(here);
    worker.onmessage = (e) => finish(() => resolve(unpack(e.data, 'worker')));
    worker.postMessage(payload);
  });
}
