// A small diagnostic overlay for ?debug=1: which GPU the context runs on (and which one the system has),
// the quality level and why it changed, frame times, draw calls. Plain DOM, polled twice a second.
import { adapterInfo, LEVELS } from './perf.js';

export function createHud(container, handle) {
  const el = document.createElement('pre');
  el.className = 'hud';
  el.style.cssText = 'position:absolute;left:8px;top:8px;margin:0;padding:8px 10px;z-index:5;font:11px/1.45 ui-monospace,Menlo,Consolas,monospace;color:#fff;background:rgba(20,18,16,.78);border-radius:4px;pointer-events:auto;white-space:pre;max-width:min(92%,560px);overflow:hidden;';
  const sel = document.createElement('select');
  sel.style.cssText = 'margin-top:6px;font:inherit;color:#fff;background:#333;border:1px solid #666;border-radius:3px;';
  for (const l of LEVELS) { const o = document.createElement('option'); o.value = l; o.textContent = `quality: ${l}`; sel.appendChild(o); }
  sel.addEventListener('change', () => handle.setQuality(sel.value));
  sel.addEventListener('pointerdown', e => e.stopPropagation());
  const text = document.createTextNode('');
  el.appendChild(text); el.appendChild(document.createTextNode('\n')); el.appendChild(sel);
  container.appendChild(el);
  let adapter = '…';
  adapterInfo().then(a => { adapter = a || 'n/a'; });
  const f1 = v => (v === null || v === undefined ? '–' : v.toFixed(1));
  function tick() {
    const s = handle.stats();
    if (sel.value !== s.level) sel.value = s.level;
    text.nodeValue = [
      `webgl  ${s.renderer || 'unknown'}  [${s.kind}]`,
      `system ${adapter}`,
      `level  ${s.level}   buffer ${s.buffer[0]}×${s.buffer[1]} (css ${s.size[0]}×${s.size[1]}, dpr ${s.pixelRatio.toFixed(2)})`,
      `frame  gpu ${f1(s.gpu)} ms (avg ${f1(s.gpuAvg)})   js ${f1(s.cpu)} ms   render call ${f1(s.median)} / p95 ${f1(s.p95)} ms   ${s.fps.toFixed(0)} fps`,
      `draw   ${s.calls} calls   ${(s.triangles / 1000).toFixed(0)}k tris   ${s.textures} tex   ${s.geometries} geo   ${s.programs} prog`,
      `view   x ${s.x.toFixed(1)} m   az ${s.az.toFixed(0)}°  el ${s.el.toFixed(0)}°   walk ${s.walk.toFixed(2)}`,
      ...(s.log.length ? ['', ...s.log] : [])
    ].join('\n');
  }
  tick();
  const iv = setInterval(tick, 500);
  return { dispose() { clearInterval(iv); el.remove(); } };
}
