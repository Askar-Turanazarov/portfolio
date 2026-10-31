// The scene: renderer, sun and sky, time-of-day presets with a smooth blend, a walking camera that strolls along
// the far pavement past the buildings (drag to look around, hover a building to name it, click to open it),
// post-processing by tier, shadows that follow the walk, a paused loop when hidden.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createSky } from './sky.js';
import { createStreet, Z } from './street.js';
import { FLAGSHIPS } from './buildings.js';
import { manager, cloudTexture, setTexturePath } from './materials.js';

export const TIMES = {
  day: {
    sky: { top: '#6590c9', mid: '#a9c6e6', horizon: '#e4e9e6', ground: '#a09886' },
    sun: { color: '#fff0d2', intensity: 4.2, elev: 44, azim: -36, glow: 0.0 },
    hemi: { sky: '#bcd4f5', ground: '#a89474', intensity: 0.55 },
    fog: { color: '#dfe6ea', near: 45, far: 230 },
    exposure: 0.95, env: 0.45, bloom: 0.08, cloud: '#ffffff'
  },
  evening: {
    sky: { top: '#3b4578', mid: '#a07a80', horizon: '#e6a877', ground: '#3a322f' },
    sun: { color: '#ffa052', intensity: 2.2, elev: 7, azim: 70, glow: 1.0 },
    hemi: { sky: '#7d7498', ground: '#4b3f36', intensity: 0.32 },
    fog: { color: '#c89a8b', near: 45, far: 210 },
    exposure: 1.0, env: 0.45, bloom: 0.38, cloud: '#f2b08a'
  }
};
const TWEEN = 0.9;
const GAP = 7;                 // metres between lots
const SHADOW_W = 124;          // width of the shadow frustum along the street
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, k) => a + (b - a) * k;
const toRad = d => d * Math.PI / 180;
function sunDir(s) { const e = toRad(s.elev), a = toRad(s.azim); return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)); }

/** Lay the flagships along the street in order, centred on 0. Returns [{ spec, x }]. */
export function planLots(specs = FLAGSHIPS, gap = GAP) {
  const total = specs.reduce((s, b) => s + b.w, 0) + gap * (specs.length - 1);
  let x = -total / 2;
  return specs.map(spec => { const lot = { spec, x: x + spec.w / 2 }; x += spec.w + gap; return lot; });
}

export function createScene(container, { tier = 'mid', time = 'day', still = false, texturePath = 'tex/', onHover = null, onPick = null } = {}) {
  setTexturePath(texturePath);
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, tier === 'high' ? 2 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.info.autoReset = false;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#e6ebee', 70, 260);
  const camera = new THREE.PerspectiveCamera(44, 1, 0.5, 600);

  // ---------- sky, sun, hemisphere, clouds ----------
  const sky = createSky(renderer);
  scene.add(sky.dome);
  const sun = new THREE.DirectionalLight('#ffffff', 3);
  sun.castShadow = true;
  const shadowRes = tier === 'high' ? 4096 : 2048;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  Object.assign(sun.shadow.camera, { left: -SHADOW_W / 2, right: SHADOW_W / 2, top: 40, bottom: -22, near: 5, far: 200 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.05;
  sun.shadow.radius = 2;
  sun.target.position.set(0, 3, 0);
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#cfe2ff', '#b39d7c', 0.8);
  scene.add(hemi);
  const cloudMats = [];
  const clouds = new THREE.Group();
  const cr = (() => { let s = 3; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 11; i++) {
    const m = new THREE.SpriteMaterial({ map: cloudTexture(i + 1), transparent: true, depthWrite: false, fog: false, opacity: 0.8 });
    cloudMats.push(m);
    const sp = new THREE.Sprite(m);
    const az = (-1.4 + (i / 10) * 2.8) + (cr() - 0.5) * 0.2, dist = 280 + cr() * 100, hgt = 42 + cr() * 55;
    sp.position.set(Math.sin(az) * dist, hgt, -Math.cos(az) * dist);
    const sw = 110 + cr() * 90;
    sp.scale.set(sw, sw * 0.5, 1);
    clouds.add(sp);
  }
  scene.add(clouds);

  // ---------- the buildings on their lots, and the street between them ----------
  const lots = planLots();
  const buildings = [];
  for (const lot of lots) {
    const b = lot.spec.make(lot.spec);
    b.group.position.x = lot.x;
    b.x = lot.x;
    b.hit.userData.building = b;
    scene.add(b.group);
    buildings.push(b);
  }
  const street = createStreet({
    tier,
    length: Math.max(160, (lots[lots.length - 1].x - lots[0].x) + 60),
    lots: buildings.map(b => ({ x: b.x, w: b.w, entranceX: b.x + b.hitX, trees: b.trees }))
  });
  scene.add(street.group);
  const emissives = [...street.emissives, ...buildings.flatMap(b => b.emissives)];
  const lights = [...street.lights, ...buildings.flatMap(b => b.lights)];
  const hits = buildings.map(b => b.hit);

  // ---------- time of day ----------
  const C = { top: new THREE.Color(), mid: new THREE.Color(), hor: new THREE.Color(), gnd: new THREE.Color(), sun: new THREE.Color() };
  const tmp = { a: new THREE.Color(), b: new THREE.Color() };
  const mixColor = (out, a, b, k) => out.copy(tmp.a.set(a)).lerp(tmp.b.set(b), k);
  let k = time === 'evening' ? 1 : 0, kFrom = k, kTo = k, tweenT = 1;
  let envDay = null, envEve = null;
  const sunV = new THREE.Vector3();
  function placeSun() {
    sun.position.copy(sunV).multiplyScalar(90).add(sun.target.position);
  }
  function applyK(k) {
    const d = TIMES.day, e = TIMES.evening;
    mixColor(C.top, d.sky.top, e.sky.top, k); mixColor(C.mid, d.sky.mid, e.sky.mid, k);
    mixColor(C.hor, d.sky.horizon, e.sky.horizon, k); mixColor(C.gnd, d.sky.ground, e.sky.ground, k);
    mixColor(C.sun, d.sun.color, e.sun.color, k);
    sunV.copy(sunDir(d.sun)).lerp(sunDir(e.sun), k).normalize();
    sky.setColors(C.top, C.mid, C.hor, C.gnd, sunV, C.sun, lerp(d.sun.glow, e.sun.glow, k));
    sun.color.copy(C.sun);
    sun.intensity = lerp(d.sun.intensity, e.sun.intensity, k);
    placeSun();
    mixColor(hemi.color, d.hemi.sky, e.hemi.sky, k); mixColor(hemi.groundColor, d.hemi.ground, e.hemi.ground, k);
    hemi.intensity = lerp(d.hemi.intensity, e.hemi.intensity, k);
    mixColor(scene.fog.color, d.fog.color, e.fog.color, k);
    scene.fog.near = lerp(d.fog.near, e.fog.near, k); scene.fog.far = lerp(d.fog.far, e.fog.far, k);
    renderer.toneMappingExposure = lerp(d.exposure, e.exposure, k);
    scene.environmentIntensity = lerp(d.env, e.env, k);
    for (const m of emissives) m.mat.emissiveIntensity = lerp(m.day, m.night, k);
    for (const l of lights) l.light.intensity = lerp(l.day, l.night, k);
    for (const m of cloudMats) mixColor(m.color, d.cloud, e.cloud, k);
    if (bloom) bloom.strength = lerp(d.bloom, e.bloom, k);
    if (envDay && envEve) scene.environment = k < 0.5 ? envDay : envEve;
    shadowsDirty = true;
  }
  function bakeEnvironments() {
    applyK(0); envDay = sky.bakeEnvironment();
    applyK(1); envEve = sky.bakeEnvironment();
    applyK(k);
  }

  // ---------- post-processing ----------
  let composer = null, bloom = null, gtao = null;
  function setupPost(w, h) {
    const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    if (tier === 'high') {
      gtao = new GTAOPass(scene, camera, w, h);
      gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1, thickness: 1, scale: 1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
      gtao.blendIntensity = 0.9;
      gtao.output = GTAOPass.OUTPUT.Default;
      composer.addPass(gtao);
    }
    bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.1, 0.5, 1.0);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // ---------- the walk: along the far pavement, eye at 3.3 m, a slow stroll that turns round at the ends ----------
  const xMin = lots[0].x - lots[0].spec.w / 2 - 4, xMax = lots[lots.length - 1].x + lots[lots.length - 1].spec.w / 2 + 4;
  const xMid = (xMin + xMax) / 2, A = (xMax - xMin) / 2;
  const cam = { z: Z.farWalkEnd + 5.2, h: 4.0, lookY: 5.0, speed: 1.6, lead: 7, phase: 0.9, x: 0, dir: 1, userAz: 0, userAzT: 0, userEl: 0, userElT: 0 };
  cam.x = xMid - A * Math.cos(cam.phase);
  let focus = null;              // { building, x, until }
  let lastTouch = -1e9, dragging = false, px = 0, py = 0, downT = 0, moved = 0;
  const cv = renderer.domElement;
  const pointer = new THREE.Vector2(), hoverPx = { x: 0, y: 0 };
  let hoverDirty = false, hovered = null;
  cv.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; downT = now(); moved = 0; lastTouch = now(); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    hoverPx.x = e.clientX - r.left; hoverPx.y = e.clientY - r.top;
    hoverDirty = true;
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    cam.userAzT = THREE.MathUtils.clamp(cam.userAzT + dx * 0.0035, -0.7, 0.7);
    cam.userElT = THREE.MathUtils.clamp(cam.userElT + dy * 0.003, -0.35, 0.5);
    lastTouch = now();
    if (moved > 6) focus = null;
  });
  const up = e => {
    if (!dragging) return;
    dragging = false; lastTouch = now();
    if (moved < 6 && now() - downT < 0.4) { const b = pick(); if (b) { focusOn(b); onPick?.(b.slug, b); } }
    if (e?.pointerId !== undefined) try { cv.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', () => { hoverDirty = true; pointer.set(9, 9); });
  function now() { return performance.now() / 1000; }

  const ray = new THREE.Raycaster();
  function pick() {
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(hits, false)[0];
    return hit ? hit.object.userData.building : null;
  }
  function setHover(b) {
    if (hovered === b) return;
    if (hovered) for (const m of hovered.facadeMats) m.emissiveIntensity = 0;
    hovered = b;
    if (b) for (const m of b.facadeMats) { m.emissive.set(b.accent); m.emissiveIntensity = 0.1; }
    cv.style.cursor = b ? 'pointer' : '';
    if (!b) onHover?.(null, null, null);
  }
  const labelV = new THREE.Vector3();
  function labelPoint(b) {
    labelV.copy(b.label); labelV.x += b.x;
    labelV.project(camera);
    return { x: (labelV.x + 1) / 2 * w, y: (1 - labelV.y) / 2 * h, visible: labelV.z < 1 };
  }
  function focusOn(b) {
    const side = b.x >= cam.x ? -1 : 1;     // stop before the building, on the side we come from
    focus = { building: b, x: b.x + b.hitX + side * Math.min(9, b.w * 0.5), until: now() + 9 };
    cam.dir = -side;
    lastTouch = now();
  }
  function resumeFrom(x) {
    const c = THREE.MathUtils.clamp((xMid - x) / A, -1, 1);
    let ph = Math.acos(c);                   // in [0, π]: moving +x
    if (cam.dir < 0) ph = Math.PI * 2 - ph;
    cam.phase = ph;
  }
  const look = new THREE.Vector3(), fwd = new THREE.Vector3();
  function placeCamera(dt) {
    const idle = !dragging && now() - lastTouch > 4;
    if (idle) { cam.userAzT *= Math.pow(0.5, dt / 2.5); cam.userElT *= Math.pow(0.5, dt / 2.5); }
    const f = 1 - Math.pow(0.001, dt);
    cam.userAz += (cam.userAzT - cam.userAz) * f;
    cam.userEl += (cam.userElT - cam.userEl) * f;
    let lookX;
    if (focus) {
      const g = 1 - Math.pow(0.02, dt);
      cam.x += (focus.x - cam.x) * g;
      lookX = focus.building.x + focus.building.hitX;
      if (now() > focus.until && idle) { resumeFrom(cam.x); focus = null; }
    } else {
      if (!still && idle) cam.phase += dt * cam.speed / A;
      if (!still && !idle) cam.phase += dt * cam.speed / A * 0.25;
      const target = xMid - A * Math.cos(cam.phase);
      const v = Math.sin(cam.phase);          // velocity sign and magnitude (0..1)
      cam.dir = v >= 0 ? 1 : -1;
      cam.x += (target - cam.x) * (1 - Math.pow(0.02, dt));
      lookX = cam.x + cam.lead * v;
    }
    camera.position.set(cam.x, cam.h + cam.userEl * 0.3, cam.z);
    look.set(lookX, cam.lookY, 0).sub(camera.position);
    const yaw = Math.atan2(look.x, -look.z) + cam.userAz;
    const horiz = Math.hypot(look.x, look.z);
    const pitch = Math.atan2(look.y, horiz) - cam.userEl;
    fwd.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(fwd.add(camera.position));
    sky.dome.position.x = cam.x;
    clouds.position.x = cam.x * 0.6;
    // shadows follow the walk in steps of whole texels
    const texel = SHADOW_W / shadowRes, step = texel * Math.round(12 / texel);
    const snap = Math.round(cam.x / step) * step;
    if (snap !== sun.target.position.x) { sun.target.position.x = snap; placeSun(); shadowsDirty = true; }
  }

  // ---------- size, loop ----------
  let w = 1, h = 1, shadowsDirty = true, paused = false, visible = true, onScreen = true, raf = 0;
  const frameTimes = [];
  let lastT = now();
  function resize() {
    const r = container.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (composer) { composer.setSize(w, h); gtao?.setSize(w, h); bloom?.setSize(w, h); } else setupPost(w, h);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  const io = new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }, { threshold: 0.01 });
  io.observe(container);
  const onVis = () => { visible = document.visibilityState !== 'hidden'; };
  document.addEventListener('visibilitychange', onVis);

  function frame() {
    raf = requestAnimationFrame(frame);
    const t = now(), dt = Math.min(0.05, t - lastT); lastT = t;
    if (paused || !visible || !onScreen) return;
    if (tweenT < 1) {
      tweenT = Math.min(1, tweenT + dt / TWEEN);
      k = lerp(kFrom, kTo, easeInOut(tweenT));
      applyK(k);
    }
    placeCamera(dt);
    if (hoverDirty && !dragging) { hoverDirty = false; setHover(pointer.x > 2 ? null : pick()); }
    if (hovered) { const p = labelPoint(hovered); onHover?.(hovered.slug, p, hovered); }
    if (street.group.userData.reflector) street.group.userData.reflector.visible = true;
    if (shadowsDirty) { renderer.shadowMap.needsUpdate = true; shadowsDirty = false; }
    renderer.info.reset();
    const t0 = performance.now();
    composer.render();
    frameTimes.push(performance.now() - t0);
    if (frameTimes.length > 240) frameTimes.shift();
  }

  // ---------- boot ----------
  bakeEnvironments();
  applyK(k);
  placeCamera(0);
  const ready = new Promise(res => { manager.onLoad = () => { shadowsDirty = true; res(); }; });
  setTimeout(() => { shadowsDirty = true; }, 1500);
  raf = requestAnimationFrame(frame);

  return {
    renderer, scene, camera, ready,
    buildings: buildings.map(b => ({ slug: b.slug, name: b.name, accent: b.accent, x: b.x + b.hitX, w: b.w, h: b.h })),
    setTime(name, instant = false) {
      kTo = name === 'evening' ? 1 : 0;
      if (instant) { k = kFrom = kTo; tweenT = 1; applyK(k); return; }
      kFrom = k; tweenT = 0;
    },
    getTime: () => (kTo === 1 ? 'evening' : 'day'),
    /** Walk to a building and look at it for a while. */
    flyTo(slug) { const b = buildings.find(b => b.slug === slug); if (b) focusOn(b); },
    /** Highlight a building from outside (e.g. hovering its name in a list). */
    highlight(slug) { setHover(slug ? buildings.find(b => b.slug === slug) || null : null); },
    setView({ x, phase, az, height } = {}) {
      if (x !== undefined) { cam.x = x; resumeFrom(x); focus = null; }
      if (phase !== undefined) cam.phase = phase;
      if (az !== undefined) { cam.userAzT = cam.userAz = az; lastTouch = now(); }
      if (height !== undefined) cam.h = height;
    },
    pause(p) { paused = p; },
    stats() {
      const ft = [...frameTimes].sort((a, b) => a - b);
      const p = q => ft.length ? ft[Math.min(ft.length - 1, Math.floor(q * ft.length))] : 0;
      const info = renderer.info;
      return { calls: info.render.calls, triangles: info.render.triangles, frames: ft.length, median: p(0.5), p95: p(0.95), max: ft[ft.length - 1] || 0, pixelRatio: renderer.getPixelRatio(), size: [w, h], x: cam.x };
    },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => { o.geometry?.dispose?.(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { if (!m) return; for (const key of Object.keys(m)) if (m[key]?.isTexture) m[key].dispose(); m.dispose(); }); });
      sky.dispose(); envDay?.dispose(); envEve?.dispose(); composer?.dispose?.(); renderer.dispose(); renderer.forceContextLoss(); cv.remove();
    }
  };
}
