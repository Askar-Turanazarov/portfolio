// The scene: renderer, sun and sky, time-of-day presets with a smooth blend, a walking camera that strolls along
// the far pavement past the buildings (drag to look around, hover a building to name it, click to travel to it),
// post-processing by tier, shadows that follow the walk, a paused loop when hidden.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { createGlass } from './glass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createSky } from './sky.js';
import { createStreet, Z } from './street.js';
import { STREET } from './registry.js';
import { manager, cloudTexture, drawTextures, nextSlice, setTexturePath, setAnisotropy, setTextureScale } from './materials.js';
import { QUALITY, isLevel, detectGPU, startLevel, createGovernor, createGpuTimer } from './perf.js';
import { createHud } from './hud.js';
import { buildFoliage } from './build.js';
import { setAtlases } from './vegetation.js';

export const TIMES = {
  day: {
    sky: { top: '#6590c9', mid: '#a9c6e6', horizon: '#e4e9e6', ground: '#a09886' },
    sun: { color: '#fff0d2', intensity: 4.2, elev: 44, azim: -36, glow: 0.0 },
    hemi: { sky: '#bcd4f5', ground: '#a89474', intensity: 0.55 },
    fog: { color: '#dfe6ea', near: 40, far: 200 },
    exposure: 0.95, env: 0.45, bloom: 0.08, cloud: '#ffffff'
  },
  evening: {
    sky: { top: '#3b4578', mid: '#a07a80', horizon: '#e6a877', ground: '#3a322f' },
    sun: { color: '#ffa052', intensity: 2.2, elev: 7, azim: 70, glow: 1.0 },
    hemi: { sky: '#7d7498', ground: '#4b3f36', intensity: 0.32 },
    fog: { color: '#c89a8b', near: 40, far: 185 },
    exposure: 1.0, env: 0.45, bloom: 0.38, cloud: '#f2b08a'
  }
};
const TWEEN = 0.9;
const GAP = 6;                 // metres between lots
const SHADOW_W = 124;          // width of the shadow frustum along the street
const GPU_BUDGET_MS = 10;      // what a frame may cost on the GPU (60 % of a 60 fps frame, 30 % of a 30 fps one)
// The field of view is set across the width, like a phone's 0.5× camera (≈ 108°); 100° keeps that sense of
// space without the fish-eye stretch at the edges. The vertical angle follows the aspect ratio, clamped so a
// narrow stage neither looks through a slit nor turns into sky and pavement (the hero stage is nearly square).
const HFOV = 100;
const EYE = 3.0;               // eye height in metres: a little above the pavement — shop fronts, signs and first floors in frame
const vfovFor = (hfov, aspect) => THREE.MathUtils.clamp(2 * Math.atan(Math.tan(toRad(hfov) / 2) / aspect) * 180 / Math.PI, 55, 72);
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, k) => a + (b - a) * k;
const toRad = d => d * Math.PI / 180;
function sunDir(s) { const e = toRad(s.elev), a = toRad(s.azim); return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)); }

/** Lay the buildings along the street in order, centred on 0. Returns [{ spec, x }]. */
export function planLots(specs = STREET, gap = GAP) {
  const total = specs.reduce((s, b) => s + b.w, 0) + gap * (specs.length - 1);
  let x = -total / 2;
  return specs.map(spec => { const lot = { spec, x: x + spec.w / 2 }; x += spec.w + gap; return lot; });
}

export function createScene(container, { quality = null, time = 'day', still = false, texturePath = 'tex/', onHover = null, onPick = null, onQuality = null, onCurrent = null, onDepart = null, onArrive = null, debug = false, govern = true, hfov = HFOV, eye = EYE } = {}) {
  setTexturePath(texturePath);
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  // Which GPU did the browser give us? The quality level follows from that, not from CPU cores or RAM: on a
  // laptop with two GPUs the context often lands on the integrated one whatever the system settings say.
  const gpu = detectGPU(renderer.getContext());
  let level = isLevel(quality) ? quality : startLevel(gpu.kind);
  if (level === 'poster') level = 'low';
  let Q = QUALITY[level];
  setAnisotropy(Q.aniso); setTextureScale(Q.tex);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q.dpr));
  const glass = createGlass(renderer);
  glass.setMode(Q.glass);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.info.autoReset = false;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#e6ebee', 70, 260);
  const camera = new THREE.PerspectiveCamera(vfovFor(hfov, 16 / 9), 1, 0.15, 600);

  // ---------- sky, sun, hemisphere, clouds ----------
  const sky = createSky(renderer);
  scene.add(sky.dome);
  const sun = new THREE.DirectionalLight('#ffffff', 3);
  sun.castShadow = true;
  let shadowRes = Q.shadow;
  sun.shadow.mapSize.set(shadowRes, shadowRes);
  renderer.shadowMap.type = Q.soft ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
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
    sp.visible = i < Q.clouds;
    clouds.add(sp);
  }
  scene.add(clouds);

  // ---------- the buildings on their lots, and the street between them ----------
  // the loading manager may finish before boot (cached files), so listen from the start
  let texturesResolve;
  const texturesLoaded = new Promise(res => { texturesResolve = res; });
  manager.onLoad = () => texturesResolve();

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
    reflector: Q.reflector,
    length: Math.max(160, (lots[lots.length - 1].x - lots[0].x) + 60),
    lots: buildings.map(b => ({ x: b.x, w: b.w, entranceX: b.x + b.hitX, trees: b.trees }))
  });
  scene.add(street.group);
  // the planting and the leaf atlases come from a worker; the meshes stand in the scene meanwhile
  const foliageBuilt = buildFoliage({ trees: street.foliage.trees, shrubs: street.foliage.shrubs }).then(res => {
    for (const [m, geo] of [[street.foliage.bark, res.bark], [street.foliage.leaves, res.leaves], [street.foliage.shrubMesh, res.shrubs]]) { const old = m.geometry; m.geometry = geo; old.dispose(); }
    setAtlases(res);
    shadowsDirty = true; dirty = true;
    return res;
  });
  const emissives = [...street.emissives, ...buildings.flatMap(b => b.emissives)];
  const hits = buildings.map(b => b.hit);

  // ---------- lamps: a fixed pool of lights ----------
  // Every lamp of the street and the buildings is kept as a spec; a pool of 4 spot and 6 point lights takes the
  // specs nearest to the camera. The number of lights in the shaders never changes — a change recompiles every
  // program, which was the 4 s stall of the first frame (culling hid buildings and their lamps between compile
  // and render) and the hitches along the walk — and a fragment pays for 10 lights instead of 25.
  scene.updateMatrixWorld(true);
  const lamps = [...street.lights, ...buildings.flatMap(b => b.lights)].map(({ light, day, night }) => {
    const pos = light.getWorldPosition(new THREE.Vector3());
    const target = light.isSpotLight ? light.target.getWorldPosition(new THREE.Vector3()) : null;
    light.removeFromParent(); light.target?.removeFromParent();
    return { type: light.isSpotLight ? 'spot' : 'point', pos, target, color: light.color.clone(), distance: light.distance, decay: light.decay, angle: light.angle, penumbra: light.penumbra, day, night };
  });
  const pool = { spot: [], point: [] };
  for (let i = 0; i < 4; i++) { const l = new THREE.SpotLight('#ffffff', 0, 10, 0.8, 0.5, 1.5); scene.add(l, l.target); pool.spot.push(l); }
  for (let i = 0; i < 6; i++) { const l = new THREE.PointLight('#ffffff', 0, 10, 1.5); scene.add(l); pool.point.push(l); }
  let lampX = 0, lampK = -1;
  function assignLamps(x, k, force = false) {
    if (!force && Math.abs(x - lampX) < 0.5 && k === lampK) return;
    lampX = x; lampK = k;
    for (const type of ['spot', 'point']) {
      const near = lamps.filter(l => l.type === type).sort((a, b) => Math.abs(a.pos.x - x) - Math.abs(b.pos.x - x));
      pool[type].forEach((light, i) => {
        const sp = near[i];
        if (!sp) { light.intensity = 0; return; }
        light.position.copy(sp.pos); light.color.copy(sp.color); light.distance = sp.distance; light.decay = sp.decay;
        if (sp.target) { light.target.position.copy(sp.target); light.angle = sp.angle; light.penumbra = sp.penumbra; }
        light.intensity = lerp(sp.day, sp.night, k);
      });
    }
    dirty = true;
  }

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
    assignLamps(lampX, k, true);
    for (const m of cloudMats) mixColor(m.color, d.cloud, e.cloud, k);
    if (bloom) { bloom.strength = lerp(d.bloom, e.bloom, k); bloom.enabled = Q.bloom !== 'evening' || bloom.strength >= 0.2; }
    if (envDay && envEve) scene.environment = k < 0.5 ? envDay : envEve;
    shadowsDirty = true;
  }
  function bakeEnvironments() {
    applyK(0); envDay = sky.bakeEnvironment();
    applyK(1); envEve = sky.bakeEnvironment();
    applyK(k);
  }

  // ---------- post-processing ----------
  // low: straight to the canvas (tone mapping and sRGB in the material shaders, no extra target); the other
  // levels render into a HalfFloat target with MSAA, then GTAO (ultra), bloom and the output pass.
  let composer = null, bloom = null, gtao = null;
  const bloomSize = (w, h) => (Q.bloom === 'full' ? [w, h] : [Math.ceil(w / 2), Math.ceil(h / 2)]);
  function setupPost(w, h) {
    composer?.dispose(); gtao?.dispose?.(); bloom?.dispose?.(); gtao = null; bloom = null; composer = null;
    if (!Q.gtao && Q.bloom === 'none' && Q.msaa === 0) return;
    const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: Q.msaa });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    if (Q.gtao) {
      gtao = new GTAOPass(scene, camera, w, h);
      gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1, thickness: 1, scale: 1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
      gtao.blendIntensity = 0.9;
      gtao.output = GTAOPass.OUTPUT.Default;
      composer.addPass(gtao);
    }
    if (Q.bloom !== 'none') {
      const [bw, bh] = bloomSize(w, h);
      bloom = new UnrealBloomPass(new THREE.Vector2(bw, bh), 0.1, 0.5, 1.0);
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());
    applyK(k);
  }

  // ---------- the walk: along the lawn path behind the far pavement, a slow stroll that turns round at the ends ----------
  const xMin = lots[0].x - lots[0].spec.w / 2 - 4, xMax = lots[lots.length - 1].x + lots[lots.length - 1].spec.w / 2 + 4;
  const xMid = (xMin + xMax) / 2, A = (xMax - xMin) / 2;
  const cam = { z: Z.farWalkEnd + 5.2, h: eye, lookY: eye + 2.4, speed: 2.0, lead: 7, phase: 0, x: 0, dir: 1, lookX: 0, userAz: 0, userAzT: 0, userEl: 0, userElT: 0 };
  // the walk starts at the first building of the street, the first flagship
  cam.phase = Math.acos(THREE.MathUtils.clamp((xMid - (lots[0].x - 3)) / A, -1, 1));
  cam.x = xMid - A * Math.cos(cam.phase);
  cam.lookX = cam.x;
  let focus = null;              // { building, x, until }; until is Infinity while its card is open
  let travel = null;             // { b, from, to, t, dur, lift, mode: 'walk' | 'fly' | 'fade', dir, look0, jumped }
  let holdDir = 0, currentSlug = null, arrived = null;
  let stop = null;               // { b, x }: the last building arrived at; the camera halts before it, nearer to its neighbour
  let lastTouch = -1e9, dragging = false, px = 0, py = 0, downT = 0, moved = 0;
  // the drag "grabs the world": the point under the pointer stays under it, so a pixel of drag turns the view by
  // exactly its angle; the last 80 ms of motion carry on as inertia after release
  const AZ_MAX = toRad(60), EL_UP = toRad(50), EL_DOWN = toRad(35);
  let velAz = 0, velEl = 0, spinAz = 0, spinEl = 0, lastMoveT = 0, walkK = 1;
  const cv = renderer.domElement;
  const pointer = new THREE.Vector2(), hoverPx = { x: 0, y: 0 };
  let hoverDirty = false, hovered = null;
  const cursor = () => { cv.style.cursor = dragging ? 'grabbing' : hovered ? 'pointer' : 'grab'; };
  cursor();
  cv.addEventListener('pointerdown', e => {
    dragging = true; px = e.clientX; py = e.clientY; downT = now(); moved = 0; lastTouch = now();
    velAz = velEl = spinAz = spinEl = 0; lastMoveT = now();
    cv.setPointerCapture(e.pointerId); cursor();
  });
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    hoverPx.x = e.clientX - r.left; hoverPx.y = e.clientY - r.top;
    hoverDirty = true;
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    const vfov = toRad(camera.fov), hfovNow = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const dAz = -dx * hfovNow / w, dEl = -dy * vfov / h;          // drag right → the world follows → look left
    cam.userAzT = THREE.MathUtils.clamp(cam.userAzT + dAz, -AZ_MAX, AZ_MAX);
    cam.userElT = THREE.MathUtils.clamp(cam.userElT + dEl, -EL_UP, EL_DOWN);
    const t = now(), dt = Math.max(1e-3, t - lastMoveT), k = Math.min(1, dt / 0.08);
    velAz += (dAz / dt - velAz) * k; velEl += (dEl / dt - velEl) * k;
    lastMoveT = t; lastTouch = t;
    if (moved > 6 && focus && focus.until !== Infinity) focus = null;
  });
  const up = e => {
    if (!dragging) return;
    dragging = false; lastTouch = now();
    // inertia only out of a live gesture; a pointer held still before release just stops
    if (now() - lastMoveT < 0.1) { const cap = toRad(150); spinAz = THREE.MathUtils.clamp(velAz, -cap, cap); spinEl = THREE.MathUtils.clamp(velEl, -cap, cap); }
    if (moved < 6 && now() - downT < 0.4) { const b = pick(); if (b) { goTo(b); onPick?.(b.slug, b); } }
    if (e?.pointerId !== undefined) try { cv.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    cursor();
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
    dirty = true;
    cursor();
    if (!b) onHover?.(null, null, null);
  }
  const labelV = new THREE.Vector3();
  function labelPoint(b) {
    labelV.copy(b.label); labelV.x += b.x;
    labelV.project(camera);
    return { x: (labelV.x + 1) / 2 * w, y: (1 - labelV.y) / 2 * h, visible: labelV.z < 1 };
  }
  /**
   * Travel to a building and stay there until release(). Near ones are walked to. Further ones depend on the
   * device: a real flight on the levels that can draw the street rushing by, otherwise the camera sets off, the
   * picture fades, the camera moves across and the walk ends in front of the building.
   */
  function goTo(b) {
    const side = b.x >= cam.x ? -1 : 1;     // stop before the building, on the side we come from
    const to = b.x + b.hitX + side * Math.min(9, b.w * 0.5), dist = Math.abs(to - cam.x);
    const mode = dist <= 45 ? 'walk' : (level === 'high' || level === 'ultra') ? 'fly' : 'fade';
    const dur = mode === 'walk' ? 0.9 + dist / 22 : mode === 'fly' ? THREE.MathUtils.clamp(1.4 + dist / 70, 1.6, 3.2) : 1.3;
    cv.style.opacity = '';
    travel = { b, from: cam.x, to, t: 0, dur, lift: mode === 'fly' ? Math.min(15, dist * 0.12) : 0, mode, dir: to >= cam.x ? 1 : -1, look0: cam.lookX, jumped: false };
    focus = null; holdDir = 0;
    cam.dir = travel.dir;
    cam.userAzT = 0; cam.userElT = 0; spinAz = spinEl = 0;   // the view eases back onto the building
    lastTouch = now();
    onDepart?.(b.slug, b);
  }
  function release() {
    if (travel) { cv.style.opacity = ''; travel = null; resumeFrom(cam.x); }
    if (focus) { resumeFrom(cam.x); focus = null; }
    lastTouch = now();
  }
  const smooth = t => { const x = THREE.MathUtils.clamp(t, 0, 1); return x * x * (3 - 2 * x); };
  function moveAlong(dt) {
    const T = travel;
    T.t = Math.min(1, T.t + dt / T.dur);
    const e = T.t, s = smooth(e);
    if (T.mode === 'fade') {
      // 6 m of real walk at each end; the jump across happens while the picture is gone
      if (e < 0.5) cam.x = T.from + T.dir * 6 * smooth(e / 0.45);
      else { if (!T.jumped) { T.jumped = true; shadowsDirty = true; } cam.x = T.to - T.dir * 6 * (1 - smooth((e - 0.55) / 0.45)); }
      const o = e < 0.5 ? 1 - smooth((e - 0.15) / 0.3) : smooth((e - 0.55) / 0.3);
      cv.style.opacity = o.toFixed(3);
    } else {
      cam.x = lerp(T.from, T.to, s);
    }
    const bx = T.b.x + T.b.hitX, ahead = cam.x + T.dir * 14;
    const lookX = lerp(lerp(T.look0, ahead, smooth(e / 0.25)), bx, smooth((e - 0.55) / 0.45));
    if (e >= 1) {
      cv.style.opacity = '';
      focus = { building: T.b, x: T.to, until: Infinity };
      stop = { b: T.b, x: T.to };
      travel = null;
      arrived = T.b;
    }
    return lookX;
  }
  const standingAt = () => (stop && Math.abs(cam.x - stop.x) < 12 ? stop.b : nearest(cam.x));
  function nearest(x) {
    let best = buildings[0];
    for (const b of buildings) if (Math.abs(b.x - x) < Math.abs(best.x - x)) best = b;
    return best;
  }
  function resumeFrom(x) {
    const c = THREE.MathUtils.clamp((xMid - x) / A, -1, 1);
    let ph = Math.acos(c);                   // in [0, π]: moving +x
    if (cam.dir < 0) ph = Math.PI * 2 - ph;
    cam.phase = ph;
  }
  const look = new THREE.Vector3(), fwd = new THREE.Vector3();
  function placeCamera(dt) {
    // the walk stands still while the pointer holds the world and eases back in 1.5 s after it lets go;
    // the user's turn of the head stays as it is — nothing swings the view back on its own
    const idle = !dragging && now() - lastTouch > 1.5;
    walkK += ((idle ? 1 : 0) - walkK) * (1 - Math.pow(idle ? 0.05 : 0.0005, dt));   // stops in ~0.4 s, resumes in ~1.5 s
    if (!dragging && (spinAz || spinEl)) {
      cam.userAzT = THREE.MathUtils.clamp(cam.userAzT + spinAz * dt, -AZ_MAX, AZ_MAX);
      cam.userElT = THREE.MathUtils.clamp(cam.userElT + spinEl * dt, -EL_UP, EL_DOWN);
      const decay = Math.pow(0.5, dt / 0.35);
      spinAz *= decay; spinEl *= decay;
      if (Math.abs(spinAz) < 1e-3 && Math.abs(spinEl) < 1e-3) spinAz = spinEl = 0;
    }
    const f = 1 - Math.pow(dragging ? 1e-6 : 0.001, dt);
    cam.userAz += (cam.userAzT - cam.userAz) * f;
    cam.userEl += (cam.userElT - cam.userEl) * f;
    let lookX;
    if (travel) {
      lookX = moveAlong(dt);
    } else if (holdDir) {
      cam.x = THREE.MathUtils.clamp(cam.x + holdDir * 11 * dt, xMin, xMax);
      cam.dir = holdDir; resumeFrom(cam.x);
      lastTouch = now();
      lookX = cam.x + holdDir * cam.lead;
    } else if (focus) {
      const g = 1 - Math.pow(0.02, dt);
      cam.x += (focus.x - cam.x) * g;
      lookX = focus.building.x + focus.building.hitX;
      if (now() > focus.until && idle) { resumeFrom(cam.x); focus = null; }
    } else {
      if (!still) cam.phase += dt * cam.speed / A * walkK;
      const target = xMid - A * Math.cos(cam.phase);
      const v = Math.sin(cam.phase);          // velocity sign and magnitude (0..1)
      cam.dir = v >= 0 ? 1 : -1;
      cam.x += (target - cam.x) * (1 - Math.pow(0.02, dt));
      lookX = cam.x + cam.lead * v;
    }
    // a travel sets the look itself; everything else eases into it, so leaving a building does not jerk the view
    cam.lookX = travel || arrived ? lookX : cam.lookX + (lookX - cam.lookX) * (1 - Math.pow(0.02, dt));
    const lift = travel ? travel.lift * Math.sin(Math.PI * smooth(travel.t)) : 0;
    camera.position.set(cam.x, cam.h + lift + cam.userEl * 0.3, cam.z);
    look.set(cam.lookX, cam.lookY, 0).sub(camera.position);
    const yaw = Math.atan2(look.x, -look.z) + cam.userAz;
    const horiz = Math.hypot(look.x, look.z);
    const pitch = Math.atan2(look.y, horiz) - cam.userEl;
    fwd.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(fwd.add(camera.position));
    sky.dome.position.x = cam.x;
    const here = focus ? focus.building : travel ? travel.b : standingAt();
    if (here.slug !== currentSlug) { currentSlug = here.slug; onCurrent?.(here.slug, here); }
    clouds.position.x = cam.x * 0.6;
    assignLamps(cam.x, k);
    // shadows follow the walk in steps of whole texels
    const texel = SHADOW_W / shadowRes, step = texel * Math.round(12 / texel);
    const snap = Math.round(cam.x / step) * step;
    if (snap !== sun.target.position.x) { sun.target.position.x = snap; placeSun(); shadowsDirty = true; }
  }

  // ---------- size, loop, governor ----------
  let w = 1, h = 1, shadowsDirty = false, paused = false, visible = true, onScreen = true, raf = 0, pointerOver = false;
  const frameTimes = [], cpuTimes = [];
  let lastT = now(), lastRender = -1e9, rendered = 0, fps = 0, fpsT = now(), fpsN = 0, lastPick = -1e9;
  const prevPos = new THREE.Vector3(), prevQ = new THREE.Quaternion();
  let dirty = true;                         // something to draw in still mode
  let postBuilt = false;
  // the governor does not judge while shaders compile and textures upload: after boot, after the textures
  // arrive (every material recompiles with its maps) and after a level change
  let warmUntil = now() + 3;
  function resize() {
    const r = container.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = vfovFor(hfov, w / h); camera.updateProjectionMatrix();
    if (!postBuilt) { setupPost(w, h); postBuilt = true; } else { composer?.setSize(w, h); gtao?.setSize(w, h); if (bloom) bloom.setSize(...bloomSize(w, h)); }
    dirty = true;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  const io = new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }, { threshold: 0.01 });
  io.observe(container);
  const onVis = () => { visible = document.visibilityState !== 'hidden'; };
  document.addEventListener('visibilitychange', onVis);
  cv.addEventListener('pointerenter', () => { pointerOver = true; });
  cv.addEventListener('pointerleave', () => { pointerOver = false; });

  /** Switch to another quality level while running: pixel ratio, shadows, clouds, post chain. */
  function applyLevel(name) {
    const prev = Q;
    level = name; Q = QUALITY[name];
    glass.setMode(Q.glass);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, Q.dpr));
    if (Q.shadow !== shadowRes) {
      shadowRes = Q.shadow;
      sun.shadow.map?.dispose(); sun.shadow.map = null;
      sun.shadow.mapSize.set(shadowRes, shadowRes);
    }
    if (Q.soft !== prev.soft) {
      renderer.shadowMap.type = Q.soft ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
      scene.traverse(o => { const ms = Array.isArray(o.material) ? o.material : [o.material]; for (const m of ms) if (m) m.needsUpdate = true; });
    }
    clouds.children.forEach((sp, i) => { sp.visible = i < Q.clouds; });
    street.group.userData.reflector.visible = Q.reflector;
    street.group.userData.water.visible = !Q.reflector;
    const newPrograms = Q.soft !== prev.soft || Q.gtao !== prev.gtao || Q.msaa !== prev.msaa || Q.bloom !== prev.bloom;
    if (Q.gtao !== prev.gtao || Q.msaa !== prev.msaa || Q.bloom !== prev.bloom) setupPost(w, h);
    resize();
    shadowsDirty = true; dirty = true; warmUntil = now() + 2;
    if (newPrograms) relinkPrograms();
    onQuality?.(level, gpu);
  }

  // ---------- programs and textures without stalls ----------
  /**
   * Compile and link every program the scene and the post chain need, and resolve when they are all ready.
   * With KHR_parallel_shader_compile the GPU process links in the background and the page stays responsive;
   * the first frame then finds every program ready. The scene is compiled against the target it will render
   * into (the composer's HalfFloat target or the canvas): tone mapping and output colour space are part of the
   * program, so compiling against the wrong one would only add a second, unused set.
   */
  const bootLog = {};
  async function linkPrograms() {
    try {
      renderer.setRenderTarget(composer ? composer.renderTarget1 : null);
      const tc0 = performance.now();
      await renderer.compileAsync(scene, camera);
      bootLog.link = performance.now() - tc0;
      renderer.setRenderTarget(null);
      if (composer) {
        const mats = [];
        for (const p of composer.passes) {
          for (const key of ['material', 'compositeMaterial', 'materialCopy', 'materialHighPassFilter', 'blendMaterial', 'copyMaterial', 'depthRenderMaterial', 'normalMaterial', 'gtaoMaterial', 'pdMaterial']) if (p[key]?.isMaterial) mats.push(p[key]);
          if (p.separableBlurMaterials) mats.push(...p.separableBlurMaterials);
        }
        const tmp = new THREE.Scene(), quad = new THREE.PlaneGeometry(1, 1);
        for (const m of mats) tmp.add(new THREE.Mesh(quad, m));
        await renderer.compileAsync(tmp, camera);
        quad.dispose();
      }
    } catch (e) {
      renderer.setRenderTarget(null);
      if (debug) console.warn('street: shader precompile failed', e);
    }
  }
  /** Upload every texture that has its image to the GPU, ≤ 8 ms per slice, so no single frame carries them all. */
  async function uploadTextures() {
    const set = new Set();
    scene.traverse(o => {
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        if (!m) continue;
        for (const key of Object.keys(m)) { const t = m[key]; if (t?.isTexture && t.image && !t.isRenderTargetTexture && !t.isCubeTexture) set.add(t); }
      }
    });
    const list = [...set];
    let i = 0;
    while (i < list.length) {
      const t0 = performance.now();
      while (i < list.length && performance.now() - t0 < 8) renderer.initTexture(list[i++]);
      if (i < list.length) await nextSlice();
    }
    return list.length;
  }
  /** After a level change that needs new programs: hold rendering (the last frame stays) until they are linked. */
  function relinkPrograms() {
    if (!booted) return;
    booted = false;
    linkPrograms().then(() => { booted = true; shadowsDirty = true; dirty = true; warmUntil = now() + 2; });
  }
  const gov = createGovernor({ start: level, onChange: applyLevel });
  const timer = createGpuTimer(renderer.getContext());

  function frame() {
    raf = requestAnimationFrame(frame);
    const t = now();
    if (paused || !visible || !onScreen || !booted) { lastT = t; return; }
    // rate: 60 fps while the viewer interacts or the light changes, 30 fps for the idle stroll; in still mode
    // only when something changed
    const interactive = glass.active || dragging || pointerOver || tweenT < 1 || !!focus || !!travel || !!holdDir || t - lastTouch < 1.5;
    const want = interactive ? 1 / 60 : 1 / 30;
    if (t - lastRender < want - 0.002) return;
    const dt = Math.min(0.05, t - lastT); lastT = t;
    const c0 = performance.now();
    if (tweenT < 1) {
      tweenT = Math.min(1, tweenT + dt / TWEEN);
      k = lerp(kFrom, kTo, easeInOut(tweenT));
      applyK(k);
      dirty = true;
    }
    placeCamera(dt);
    if (!camera.position.equals(prevPos) || !camera.quaternion.equals(prevQ)) { dirty = true; prevPos.copy(camera.position); prevQ.copy(camera.quaternion); }
    for (const b of buildings) b.group.visible = Math.abs(b.x - cam.x) < Q.cull;
    if (hoverDirty && !dragging && t - lastPick > 1 / 30) { hoverDirty = false; lastPick = t; setHover(pointer.x > 2 ? null : pick()); }
    if (arrived) { camera.updateMatrixWorld(); const b = arrived; arrived = null; onArrive?.(b.slug, labelPoint(b), b); }
    if (hovered) { const p = labelPoint(hovered); onHover?.(hovered.slug, p, hovered); }
    if (still && !dirty && !shadowsDirty) return;
    if (shadowsDirty) { renderer.shadowMap.needsUpdate = true; shadowsDirty = false; }
    renderer.info.reset();
    const gpuMs = timer?.poll() ?? null;
    timer?.begin();
    const t0 = performance.now();
    if (composer) composer.render(); else renderer.render(scene, camera);
    if (glass.active) { glass.setTint(k); glass.draw(dt); }
    timer?.end();
    const gap = lastRender > 0 ? (t - lastRender) * 1000 : want * 1000;
    lastRender = t; dirty = false; rendered++;
    if (rendered === 1) firstFrame();
    frameTimes.push(performance.now() - t0);
    if (frameTimes.length > 240) frameTimes.shift();
    cpuTimes.push(performance.now() - c0);
    if (cpuTimes.length > 120) cpuTimes.shift();
    fpsN++; if (t - fpsT >= 1) { fps = fpsN / (t - fpsT); fpsN = 0; fpsT = t; }
    if (govern && !still && t > warmUntil) gov.frame(dt, { gpuMs, gapMs: gap, wantMs: want * 1000, budgetMs: GPU_BUDGET_MS });
  }

  // ---------- static matrices ----------
  // Nothing in the street moves except the camera, the sun and its target, the pooled lamps, the sky dome and the
  // clouds: everything else keeps the matrix it was built with instead of recomposing it every frame.
  scene.updateMatrixWorld(true);
  const movers = new Set([camera, sun, sun.target, sky.dome, clouds, ...pool.spot, ...pool.spot.map(l => l.target), ...pool.point]);
  scene.traverse(o => { if (!movers.has(o) && o !== scene) o.matrixAutoUpdate = false; });

  // ---------- boot ----------
  // The first frame used to link every shader program synchronously (18 programs ≈ 4.4 s of a frozen page on an
  // integrated GPU) and to upload every texture at once. Now the programs link in parallel and the textures go
  // up a few per frame while the poster is still showing; the loop renders only once both are done, and `ready`
  // resolves after the first rendered frame, so the poster can cross-fade into a drawn canvas.
  bakeEnvironments();
  applyK(k);
  placeCamera(0);
  let booted = false, firstFrame = () => {};
  const firstFrameDrawn = new Promise(res => { firstFrame = res; });
  const ready = (async () => {
    const t0 = performance.now();
    await nextSlice();                                                           // the build's task ends and the poster paints before the link starts
    // programs link while the canvases are drawn and uploaded in slices and the worker plants the trees
    const [, , fol] = await Promise.all([linkPrograms(), drawTextures().then(n => { bootLog.canvases = n; return uploadTextures(); }), foliageBuilt]);
    await Promise.race([texturesLoaded, new Promise(res => setTimeout(res, 8000))]);
    const n = await uploadTextures();                                            // the files that arrived meanwhile
    booted = true; shadowsDirty = true; dirty = true; warmUntil = now() + 2;
    await firstFrameDrawn;
    gov.log.push(`boot: link ${bootLog.link?.toFixed(0)} ms, ${renderer.info.programs?.length} programs, ${bootLog.canvases} canvases, ${n} textures, foliage ${fol.ms.geometry.toFixed(0)}+${fol.ms.atlases.toFixed(0)} ms in ${fol.where}, first render ${frameTimes[0]?.toFixed(0)} ms, first frame at ${(performance.now() - t0).toFixed(0)} ms`);
  })();
  raf = requestAnimationFrame(frame);

  const handle = {
    renderer, scene, camera,
    /** Resolves after the first frame has been drawn: programs linked, textures uploaded, one render done. */
    ready,
    /** The GPU the context runs on; the current quality level (it may change while running). */
    gpu, get level() { return level; },
    /** The card's box from the canvas' top left, or null. False when this level leaves the glass to CSS. */
    setGlass(rect) { dirty = true; return glass.setRect(rect); },
    setQuality(q) { if (isLevel(q) && q !== level) { gov.set(q); } },
    buildings: buildings.map(b => ({ slug: b.slug, name: b.name, accent: b.accent, x: b.x + b.hitX, w: b.w, h: b.h })),
    setTime(name, instant = false) {
      kTo = name === 'evening' ? 1 : 0;
      if (instant) { k = kFrom = kTo; tweenT = 1; applyK(k); return; }
      kFrom = k; tweenT = 0;
    },
    getTime: () => (kTo === 1 ? 'evening' : 'day'),
    /** Travel to a building and stay until release(). */
    flyTo(slug) { const b = buildings.find(b => b.slug === slug); if (b) goTo(b); },
    /** Travel to the next (+1) or previous (-1) building, from where the camera is now. */
    step(dir) {
      const here = focus || travel ? buildings.findIndex(b => b.slug === currentSlug) : buildings.indexOf(standingAt());
      const n = buildings.length;
      goTo(buildings[(here + dir + n) % n]);
    },
    /** Walk along the street while a key is held: -1, +1, or 0 to stop. */
    hold(dir) {
      if (dir && (focus || travel)) release();
      holdDir = dir;
      lastTouch = now();
    },
    /** Leave the building and carry on with the stroll. */
    release,
    /** Highlight a building from outside (e.g. hovering its name in a list). */
    highlight(slug) { setHover(slug ? buildings.find(b => b.slug === slug) || null : null); },
    setView({ x, phase, az, height } = {}) {
      if (x !== undefined) { cam.x = cam.lookX = x; resumeFrom(x); focus = null; }
      if (phase !== undefined) cam.phase = phase;
      if (az !== undefined) { cam.userAzT = cam.userAz = az; lastTouch = now(); }
      if (height !== undefined) cam.h = height;
      dirty = true;
    },
    pause(p) { paused = p; },
    stats() {
      const ft = [...frameTimes].sort((a, b) => a - b);
      const p = q => ft.length ? ft[Math.min(ft.length - 1, Math.floor(q * ft.length))] : 0;
      const info = renderer.info;
      const cpu = cpuTimes.length ? cpuTimes.reduce((a, b) => a + b, 0) / cpuTimes.length : 0;
      return {
        calls: info.render.calls, triangles: info.render.triangles, textures: info.memory.textures, geometries: info.memory.geometries, programs: info.programs?.length || 0,
        frames: ft.length, median: p(0.5), p95: p(0.95), max: ft[ft.length - 1] || 0, cpu, gpu: timer ? timer.last : null, gpuAvg: gov.gpuMs, fps, rendered,
        pixelRatio: renderer.getPixelRatio(), size: [w, h], buffer: [Math.round(w * renderer.getPixelRatio()), Math.round(h * renderer.getPixelRatio())], x: cam.x,
        az: cam.userAz * 180 / Math.PI, el: cam.userEl * 180 / Math.PI, walk: walkK,
        level, tex: Q.tex, renderer: gpu.renderer, kind: gpu.kind, log: gov.log
      };
    },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      scene.traverse(o => { o.geometry?.dispose?.(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { if (!m) return; for (const key of Object.keys(m)) if (m[key]?.isTexture) m[key].dispose(); m.dispose(); }); });
      sky.dispose(); envDay?.dispose(); envEve?.dispose(); composer?.dispose?.(); glass.dispose(); timer?.dispose(); hud?.dispose(); renderer.dispose(); renderer.forceContextLoss(); cv.remove();
    }
  };
  const hud = debug ? createHud(container, handle) : null;
  if (debug) window.__street = handle;   // for the measurement scripts
  return handle;
}
