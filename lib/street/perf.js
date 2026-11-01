// Performance policy of the street: which GPU we are on, the ladder of quality levels, a GPU timer where the
// browser offers one, and a governor that steps the level down when frames run long. It never steps up: spare
// capacity is left unused, because on a laptop spending it is what turns the fans on. Nothing here touches the scene
// itself; scene.js applies the chosen level.

/**
 * The quality ladder. One entry per level, every knob the scene reads:
 *  dpr      – cap on the device pixel ratio
 *  msaa     – samples of the post-processing target (0 = render straight to the canvas when no effect is needed)
 *  shadow   – shadow map size; soft – PCFSoft (9 taps) instead of PCF
 *  bloom    – 'none' | 'evening' (only when the preset asks for it) | 'half'; always at half resolution
 *  clouds   – number of cloud sprites
 *  cull     – buildings further than this along the street are not drawn
 *  aniso    – texture anisotropy
 *  alive    – the world keeps moving for a while after the last action (clouds, wind, traffic)
 */
export const QUALITY = {
  low: { dpr: 1.0, msaa: 0, shadow: 1024, soft: false, bloom: 'none', clouds: 5, cull: 110, aniso: 4, tex: 0.5, glass: 'none', alive: false },
  mid: { dpr: 1.25, msaa: 2, shadow: 2048, soft: false, bloom: 'evening', clouds: 7, cull: 130, aniso: 4, tex: 0.5, glass: 'half', alive: true },
  high: { dpr: 1.5, msaa: 4, shadow: 2048, soft: true, bloom: 'half', clouds: 11, cull: 150, aniso: 8, tex: 1, glass: 'full', alive: true }
};
export const LEVELS = ['low', 'mid', 'high'];
export const isLevel = (q) => LEVELS.includes(q);

/**
 * Which kind of GPU the WebGL context landed on. Chrome reports the adapter in RENDERER
 * (`ANGLE (Intel, Intel(R) UHD Graphics …)`, `ANGLE (NVIDIA, NVIDIA GeForce RTX 4050 …)`); Firefox and Safari
 * give shorter strings or a generic one, hence 'unknown'.
 */
export function detectGPU(gl) {
  let renderer = '', vendor = '';
  try {
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '');
    vendor = String(gl.getParameter(dbg ? dbg.UNMASKED_VENDOR_WEBGL : gl.VENDOR) || '');
  } catch { /* a context that refuses to say */ }
  const s = `${vendor} ${renderer}`;
  let kind = 'unknown';
  if (/swiftshader|llvmpipe|softpipe|software|mesa offscreen/i.test(s)) kind = 'software';
  else if (/nvidia|geforce|rtx|gtx|quadro|radeon (rx|pro|vii)|rx \d{3,4}|arc a\d|arc b\d/i.test(s)) kind = 'discrete';
  else if (/intel|uhd|iris|hd graphics|apple|adreno|mali|powervr|xclipse|radeon\(tm\) graphics|radeon graphics|vega \d/i.test(s)) kind = 'integrated';
  return { renderer, vendor, kind };
}

/** The level to start on for a kind of GPU; 'poster' means the scene should not run at all. */
export function startLevel(kind) {
  if (kind === 'software') return 'poster';
  if (kind === 'discrete') return 'high';
  return 'mid';
}

/**
 * The high-performance adapter the system has, through WebGPU, for the HUD only: when WebGL runs on the
 * integrated chip while this names a discrete card, the browser (not the page) chose the slower one.
 */
export async function adapterInfo() {
  try {
    const gpu = navigator.gpu;
    if (!gpu) return null;
    const a = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!a) return null;
    const info = a.info || (a.requestAdapterInfo ? await a.requestAdapterInfo() : null);
    if (!info) return null;
    return [info.vendor, info.architecture, info.device, info.description].filter(Boolean).join(' · ');
  } catch { return null; }
}

/**
 * GPU frame timer on EXT_disjoint_timer_query_webgl2 (desktop Chrome and Firefox). One query in flight per
 * frame; results come back a few frames later. Returns null when the extension is missing.
 */
export function createGpuTimer(gl) {
  const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if (!ext || !gl.createQuery) return null;
  const pending = [];
  let active = null, last = 0;
  return {
    begin() {
      if (active || pending.length > 4) return;
      active = gl.createQuery();
      gl.beginQuery(ext.TIME_ELAPSED_EXT, active);
    },
    end() {
      if (!active) return;
      gl.endQuery(ext.TIME_ELAPSED_EXT);
      pending.push(active); active = null;
    },
    /** Milliseconds of the most recent finished frame, or null when none is ready yet. */
    poll() {
      let got = null;
      while (pending.length) {
        const q = pending[0];
        const disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
        if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
        pending.shift();
        if (!disjoint) got = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6;
        gl.deleteQuery(q);
      }
      if (got !== null) last = got;
      return got;
    },
    get last() { return last; },
    dispose() { for (const q of pending) gl.deleteQuery(q); if (active) gl.deleteQuery(active); }
  };
}

/** Exponential moving average with a time constant in seconds. */
function ema(tau) {
  let v = null;
  return { push(x, dt) { v = v === null ? x : v + (x - v) * (1 - Math.exp(-dt / tau)); return v; }, get value() { return v; }, reset() { v = null; } };
}

/**
 * The governor: watches GPU time (when a timer exists) and the interval between rendered frames, and asks the
 * scene to step the quality level down when the budget is blown for a while. `budget(level, fpsTarget)` — the
 * milliseconds a frame may take on the GPU.
 */
export function createGovernor({ start, min = 'low', onChange }) {
  let level = start;
  const floor = LEVELS.indexOf(min);
  const gpuAvg = ema(1.5), gapAvg = ema(1.5);
  let over = 0, lastChange = 0, t = 0;   // lastChange = 0: the first three seconds (uploads, compiles, shadow bake) are a warm-up
  const log = [];
  function change(dir, why) {
    const i = LEVELS.indexOf(level) + dir;
    if (i < floor) return false;
    level = LEVELS[i];
    lastChange = t; over = 0; gpuAvg.reset(); gapAvg.reset();
    log.push(`${(t).toFixed(0)}s ↓ ${level}: ${why}`);
    if (log.length > 6) log.shift();
    onChange?.(level, why);
    return true;
  }
  return {
    get level() { return level; },
    get log() { return log; },
    get gpuMs() { return gpuAvg.value; },
    get gapMs() { return gapAvg.value; },
    /**
     * Called once per rendered frame. gpuMs: GPU time of a recent frame or null; gapMs: time since the previous
     * rendered frame; wantMs: the interval the limiter aimed for; budgetMs: what the GPU may take per frame.
     */
    frame(dt, { gpuMs, gapMs, wantMs, budgetMs }) {
      t += dt;
      if (gpuMs !== null && gpuMs !== undefined) gpuAvg.push(gpuMs, dt);
      gapAvg.push(gapMs, dt);
      if (t - lastChange < 3) return;
      const g = gpuAvg.value, gap = gapAvg.value;
      // over budget: the GPU takes longer than allowed, or frames arrive much later than asked for
      const slowGpu = g !== null && g > budgetMs;
      const slowGap = gap !== null && gap > wantMs * 1.45 && (g === null || g > budgetMs * 0.6);
      if (slowGpu || slowGap) over += dt; else over = 0;
      if (over > 2) change(-1, slowGpu ? `gpu ${g.toFixed(1)} ms > ${budgetMs} ms` : `frames every ${gap.toFixed(0)} ms, wanted ${wantMs.toFixed(0)}`);
    },
    /** Hard override (URL parameter, HUD). */
    set(q) { if (isLevel(q) && q !== level) { level = q; lastChange = t; onChange?.(q, 'set'); } }
  };
}
