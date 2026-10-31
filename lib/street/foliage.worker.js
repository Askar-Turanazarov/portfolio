// Worker: builds the street's foliage geometry and leaf atlases off the main thread, then exits (build.js
// terminates it after the single reply). See foliage.js for the work itself.
import { buildFoliage, buffersOf } from './foliage.js';

self.onmessage = (e) => {
  const result = buildFoliage(e.data);
  self.postMessage(result, buffersOf(result));
};
