// The growing plane tree (chinor). Everything is built once and final: growth is only a uniform, so scrolling
// costs one float per frame. Every ring of a branch knows its time window and the ring before it, and collapses onto
// that ring until its window comes. Leaves work the same way around their own centre.
import * as THREE from 'three';
import { detectGPU, startLevel } from '@/lib/street/perf.js';

const HEIGHT = 11;                                      // the trunk; the crown reaches about 20 m
const LEAVES = { low: 7000, mid: 16000, high: 30000, ultra: 30000 };
const lerp = (a, b, k) => a + (b - a) * k;
// the shaders work in display colours, so hex values go in unconverted
const display = (hex) => new THREE.Color().setStyle(hex, THREE.LinearSRGBColorSpace);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// seeded, so the tree and its poster are the same tree on every visit
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** Times for the branches: where in the scroll each project starts to grow, oldest first. */
export const branchTime = (i, n) => 0.2 + (0.66 * i) / Math.max(1, n);
export const BRANCH_DUR = 0.14;

function build(branches, leafCount) {
  const R = rng(20260701);
  const pos = [], prev = [], time = [], nor = [], idx = [];
  const anchors = [];                                    // where leaves go: { p, t, color }
  const tips = [];
  const up = new THREE.Vector3(0, 1, 0), a = new THREE.Vector3(), b = new THREE.Vector3(), T = new THREE.Vector3();
  const SIDES = 8;

  function tube(pts, r0, r1, t0, t1) {
    const base = pos.length / 3, n = pts.length - 1;
    pts.forEach((p, i) => {
      T.copy(pts[Math.min(n, i + 1)]).sub(pts[Math.max(0, i - 1)]).normalize();
      a.copy(Math.abs(T.y) > 0.95 ? b.set(1, 0, 0) : up).cross(T).normalize();
      b.copy(T).cross(a);
      const r = lerp(r0, r1, Math.pow(i / n, 0.8));
      const from = pts[Math.max(0, i - 1)];
      const w0 = i === 0 ? t0 - 0.001 : lerp(t0, t1, (i - 1) / n), w1 = i === 0 ? t0 : lerp(t0, t1, i / n);
      for (let s = 0; s < SIDES; s++) {
        const ang = (s / SIDES) * Math.PI * 2, c = Math.cos(ang), d = Math.sin(ang);
        const nx = a.x * c + b.x * d, ny = a.y * c + b.y * d, nz = a.z * c + b.z * d;
        pos.push(p.x + nx * r, p.y + ny * r, p.z + nz * r);
        nor.push(nx, ny, nz);
        prev.push(from.x, from.y, from.z);
        time.push(w0, w1);
      }
      if (i < n) for (let s = 0; s < SIDES; s++) {
        const k = base + i * SIDES, s1 = (s + 1) % SIDES;
        idx.push(k + s, k + s + SIDES, k + s1, k + s1, k + s + SIDES, k + s1 + SIDES);
      }
    });
  }

  function limb(start, dir, len, r, level, t0, dur, color) {
    const steps = level === 0 ? 7 : level === 1 ? 5 : 3;
    const pts = [start.clone()], d = dir.clone(), p = start.clone();
    for (let i = 0; i < steps; i++) {
      d.x += (R() - 0.5) * 0.35; d.z += (R() - 0.5) * 0.35; d.y += (R() - 0.35) * 0.18;
      d.normalize();
      p.addScaledVector(d, len / steps);
      pts.push(p.clone());
    }
    tube(pts, r, r * 0.42, t0, t0 + dur);
    if (level < 3) {
      const kids = level === 0 ? 4 : 3;
      for (let k = 0; k < kids; k++) {
        const f = 0.4 + (0.6 * (k + R() * 0.7)) / kids, at = Math.min(steps, Math.round(f * steps));
        const out = new THREE.Vector3(R() - 0.5, R() * 0.75 - 0.05, R() - 0.5).normalize().addScaledVector(d, 0.55).normalize();
        limb(pts[at], out, len * (0.42 + R() * 0.16), r * 0.5, level + 1, t0 + dur * (at / steps), dur * 0.7, color);
      }
    }
    if (level >= 2) anchors.push({ p: pts[steps], d: len, t: t0 + dur, color });
    if (level === 3) anchors.push({ p: pts[steps - 1], d: len, t: t0 + dur * 0.8, color });
    return pts[steps];
  }

  // the trunk: thick, a little bent, the pale patchy column a chinor is known for
  const trunk = [];
  for (let i = 0; i <= 24; i++) trunk.push(new THREE.Vector3(Math.sin(i * 0.25) * 0.16, (i / 24) * HEIGHT, Math.cos(i * 0.185) * 0.14 - 0.14));
  tube(trunk, 0.66, 0.26, 0.015, 0.7);          // always ahead of the limbs, so none of them starts in the air

  // one big limb per project, in order up the trunk and round it by the golden angle
  const n = branches.length;
  branches.forEach((br, i) => {
    const f = n > 1 ? i / (n - 1) : 0.5;
    const at = trunk[Math.round(lerp(6, 24, f))];
    const ang = i * 2.39996;
    const dir = new THREE.Vector3(Math.cos(ang), lerp(0.3, 1.5, f * f), Math.sin(ang)).normalize();
    const t0 = branchTime(i, n);
    const len = lerp(8.4, 5.2, f) * (0.9 + R() * 0.2);
    const tip = limb(at, dir, len, lerp(0.27, 0.15, f), 0, t0, BRANCH_DUR, display(br.leaf));
    tips.push({ pos: tip, t: t0 + BRANCH_DUR });
  });

  const bark = new THREE.BufferGeometry();
  bark.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  bark.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  bark.setAttribute('aPrev', new THREE.Float32BufferAttribute(prev, 3));
  bark.setAttribute('aTime', new THREE.Float32BufferAttribute(time, 2));
  bark.setIndex(idx);

  // leaves: a quad each, facing anywhere, in clouds around the twig ends
  const per = Math.max(2, Math.floor(leafCount / Math.max(1, anchors.length)));
  const L = anchors.length * per;
  const lp = new Float32Array(L * 12), lc = new Float32Array(L * 12), lu = new Float32Array(L * 8), lk = new Float32Array(L * 12), lt = new Float32Array(L * 8), li = new Uint32Array(L * 6);
  const u = new THREE.Vector3(), v = new THREE.Vector3(), c = new THREE.Vector3();
  const col = new THREE.Color();
  let q = 0;
  for (const an of anchors) for (let j = 0; j < per; j++, q++) {
    const spread = 0.75 + an.d * 0.28;
    c.set(R() - 0.5, (R() - 0.42) * 0.8, R() - 0.5).multiplyScalar(2 * spread).add(an.p);
    u.set(R() - 0.5, R() - 0.5, R() - 0.5).normalize();
    v.set(R() - 0.5, R() - 0.5, R() - 0.5).cross(u).normalize();
    const size = 0.2 + R() * 0.14, shade = 0.74 + R() * 0.38;
    const t = an.t - 0.05 + R() * 0.08;
    col.copy(an.color).multiplyScalar(shade);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([x, y], w) => {
      const o = q * 4 + w;
      lp.set([c.x + (u.x * x + v.x * y) * size, c.y + (u.y * x + v.y * y) * size, c.z + (u.z * x + v.z * y) * size], o * 3);
      lk.set([c.x, c.y, c.z], o * 3);
      lc.set([col.r, col.g, col.b], o * 3);
      lu.set([(x + 1) / 2, (y + 1) / 2], o * 2);
      lt.set([t, R() * 6.28], o * 2);
    });
    li.set([q * 4, q * 4 + 1, q * 4 + 2, q * 4, q * 4 + 2, q * 4 + 3], q * 6);
  }
  const leaves = new THREE.BufferGeometry();
  leaves.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  leaves.setAttribute('aCentre', new THREE.BufferAttribute(lk, 3));
  leaves.setAttribute('aColor', new THREE.BufferAttribute(lc, 3));
  leaves.setAttribute('uv', new THREE.BufferAttribute(lu, 2));
  leaves.setAttribute('aTime', new THREE.BufferAttribute(lt, 2));
  leaves.setIndex(new THREE.BufferAttribute(li, 1));
  return { bark, leaves, tips };
}

/** A five-lobed palm of a leaf, drawn once as an alpha mask. */
function leafTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.translate(32, 36);
  for (const a of [-1.5, -0.8, 0, 0.8, 1.5]) {
    g.save(); g.rotate(a);
    g.beginPath(); g.moveTo(-5, 4); g.quadraticCurveTo(-11, -13, 0, a === 0 ? -34 : -27); g.quadraticCurveTo(11, -13, 5, 4); g.fill();
    g.restore();
  }
  g.fillRect(-1.5, 0, 3, 26);
  const t = new THREE.CanvasTexture(c);
  t.generateMipmaps = true;
  return t;
}

const LIGHT = /* glsl */`
  uniform vec3 uSun, uSunColor, uSkyTop, uGroundLight;
`;

export function createGrowth(el, { branches, labels, level: forced, initial = 0, still = false }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const gl = renderer.getContext();
  const gpu = detectGPU(gl);
  const start = startLevel(gpu.kind);
  const level = forced || (start === 'poster' ? 'low' : start);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, level === 'low' ? 1 : level === 'mid' ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;   // the shaders below work in display colours
  el.append(renderer.domElement);
  const cv = renderer.domElement;

  const { bark, leaves, tips } = build(branches, LEAVES[level]);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.05, 900);

  const shared = {
    uGrow: { value: initial }, uTime: { value: 0 },
    uSun: { value: new THREE.Vector3() }, uSunColor: { value: new THREE.Color() },
    uSkyTop: { value: new THREE.Color() }, uSkyLow: { value: new THREE.Color() }, uGroundLight: { value: new THREE.Color() },
  };

  const barkMat = new THREE.ShaderMaterial({
    uniforms: shared,
    vertexShader: /* glsl */`
      attribute vec3 aPrev; attribute vec2 aTime;
      uniform float uGrow;
      varying vec3 vN, vP; varying float vG;
      void main() {
        float g = clamp((uGrow - aTime.x) / max(1e-4, aTime.y - aTime.x), 0., 1.);
        vec3 p = mix(aPrev, position, g * g * (3. - 2. * g));
        vN = normal; vP = position; vG = g;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
      }`,
    fragmentShader: LIGHT + /* glsl */`
      varying vec3 vN, vP; varying float vG;
      float n(vec3 p) { return fract(sin(dot(floor(p), vec3(12.9, 78.2, 37.7))) * 43758.5); }
      float patches(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(n(i), n(i + vec3(1,0,0)), f.x), mix(n(i + vec3(0,1,0)), n(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(n(i + vec3(0,0,1)), n(i + vec3(1,0,1)), f.x), mix(n(i + vec3(0,1,1)), n(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      void main() {
        vec3 N = normalize(vN);
        // peeling plane-tree bark: olive-brown over pale cream patches
        float s = patches(vP * vec3(3.2, 1.1, 3.2)) * .65 + patches(vP * vec3(8., 3., 8.)) * .35;
        vec3 base = mix(vec3(.36, .31, .23), vec3(.70, .66, .52), smoothstep(.46, .6, s));
        float sun = max(0., dot(N, uSun));
        vec3 amb = mix(uGroundLight, uSkyTop, N.y * .5 + .5);
        gl_FragColor = vec4(base * (amb * .75 + uSunColor * sun * .85), 1.);
      }`,
  });
  scene.add(new THREE.Mesh(bark, barkMat));

  const tex = leafTexture();
  const leafMat = new THREE.ShaderMaterial({
    uniforms: { ...shared, uMask: { value: tex } },
    side: THREE.DoubleSide,
    vertexShader: /* glsl */`
      attribute vec3 aCentre, aColor; attribute vec2 aTime;
      uniform float uGrow, uTime;
      varying vec2 vUv; varying vec3 vC; varying float vH;
      void main() {
        float g = smoothstep(aTime.x, aTime.x + .05, uGrow);
        vec3 p = aCentre + (position - aCentre) * g;
        p += vec3(sin(uTime * 1.3 + aTime.y), cos(uTime * 1.7 + aTime.y) * .6, sin(uTime + aTime.y * 2.)) * .025;
        vUv = uv; vC = aColor; vH = aCentre.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(g < .001 ? vec3(0., -99., 0.) : p, 1.);
      }`,
    fragmentShader: LIGHT + /* glsl */`
      uniform sampler2D uMask;
      varying vec2 vUv; varying vec3 vC; varying float vH;
      void main() {
        if (texture2D(uMask, vUv).r < .5) discard;
        float crown = smoothstep(8., 20., vH);            // the top of the crown catches the sun, the inside is shaded
        vec3 light = mix(uSkyTop * .55 + uGroundLight * .2, uSkyTop * .5 + uSunColor * .75, crown);
        gl_FragColor = vec4(vC * light * 1.2, 1.);
      }`,
  });
  const leafMesh = new THREE.Mesh(leaves, leafMat);
  leafMesh.frustumCulled = false;
  scene.add(leafMesh);

  // sky, ground melting into the horizon, the seed in its mound
  const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 24, 12), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: shared,
    vertexShader: `varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uSkyTop, uSkyLow, uSun, uSunColor; varying vec3 vD;
      void main() {
        vec3 d = normalize(vD);
        vec3 c = mix(uSkyLow, uSkyTop, pow(smoothstep(-.02, .55, d.y), .7));
        c += uSunColor * (pow(max(0., dot(d, uSun)), 220.) * .9 + pow(max(0., dot(d, uSun)), 9.) * .16);
        gl_FragColor = vec4(c, 1.);
      }`,
  }));
  scene.add(sky);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(420, 48).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    uniforms: shared,
    vertexShader: `varying vec3 vW; void main() { vW = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uSkyLow, uSunColor, uSkyTop; varying vec3 vW;
      float h(vec2 p) { return fract(sin(dot(p, vec2(12.9, 78.2))) * 43758.5); }
      float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      void main() {
        float d = length(vW.xz);
        float grain = n(vW.xz * 7.) * .06 + n(vW.xz * .9) * .09;
        vec3 soil = vec3(.36, .28, .2), grass = vec3(.36, .46, .22);
        vec3 c = mix(soil, grass, smoothstep(.9, 5.5, d + grain * 8.)) + grain - .06;
        c *= uSkyTop * .5 + uSunColor * .62;
        c *= mix(.55, 1., smoothstep(.5, 15., d));         // the crown's shade under the tree
        gl_FragColor = vec4(mix(c, uSkyLow, smoothstep(40., 260., d)), 1.);
      }`,
  }));
  scene.add(ground);
  const seed = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10).scale(0.8, 1, 0.8), new THREE.MeshBasicMaterial({ color: '#6a4a2c' }));
  seed.position.set(0, 0.06, -0.14);
  scene.add(seed);

  // morning → noon → evening over the four months
  const STOPS = [
    { top: '#83aedb', low: '#f6dcc7', sun: '#ffd9ae', gl: '#8f8370', az: -0.9, el: 0.28 },
    { top: '#4d90d6', low: '#d4e6f2', sun: '#fff4dc', gl: '#94907a', az: 0.1, el: 0.95 },
    { top: '#3d4688', low: '#f4a772', sun: '#ffb377', gl: '#6c5a58', az: 1.15, el: 0.2 },
  ];
  const stopCols = STOPS.map(s => ({ ...s, top: display(s.top), low: display(s.low), sun: display(s.sun), gl: display(s.gl) }));
  function light(p) {
    const f = p * 2, i = Math.min(1, Math.floor(f)), k = smooth(0, 1, f - i), A = stopCols[i], B = stopCols[i + 1];
    shared.uSkyTop.value.copy(A.top).lerp(B.top, k);
    shared.uSkyLow.value.copy(A.low).lerp(B.low, k);
    shared.uSunColor.value.copy(A.sun).lerp(B.sun, k);
    shared.uGroundLight.value.copy(A.gl).lerp(B.gl, k);
    const az = lerp(A.az, B.az, k), e = lerp(A.el, B.el, k);
    shared.uSun.value.set(Math.sin(az) * Math.cos(e), Math.sin(e), -Math.cos(az) * Math.cos(e)).normalize();
  }

  let w = 1, h = 1;
  const resize = () => {
    w = el.clientWidth || 1; h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // the text stands on the left, so on a wide stage the tree stands right of centre
    if (w > 900) camera.setViewOffset(w, h, -w * 0.18, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    dirty = true;
  };
  let dirty = true;
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  // the camera starts in the grass next to the seed and backs away as the crown spreads
  function placeCamera(p) {
    const k = smooth(0, 0.65, p), portrait = w < h ? 1.45 : 1;
    const r = lerp(1.3, 33 * portrait, Math.pow(k, 0.8)), az = 0.5 + p * 1.45;
    const y = lerp(0.42, 8.5, k), ty = lerp(0.14, 9.8, smooth(0, 0.8, p));
    camera.position.set(Math.sin(az) * r, y, Math.cos(az) * r - 0.14);
    camera.lookAt(0, ty, -0.14);
  }

  const v = new THREE.Vector3();
  function placeLabels(p) {
    labels?.forEach((node, i) => {
      if (!node || !tips[i]) return;
      const age = p - tips[i].t;
      const on = age > -0.02 && age < 0.08 && w > 900;
      node.style.opacity = on ? '1' : '0';
      node.style.pointerEvents = on ? 'auto' : 'none';
      if (!on) return;
      v.copy(tips[i].pos).project(camera);
      node.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(0)}px, ${((1 - v.y) / 2 * h).toFixed(0)}px) translate(-50%, -100%)`;
    });
  }

  let target = initial, cur = initial, paused = false, raf = 0, last = performance.now(), lastDraw = 0, resolve;
  const ready = new Promise(res => (resolve = res));
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (paused) { last = t; return; }
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    const moving = Math.abs(target - cur) > 2e-4;
    if (!moving && !dirty && t - lastDraw < (still ? 1e9 : 33)) return;
    cur = moving ? cur + (target - cur) * (1 - Math.pow(0.003, dt)) : target;
    shared.uGrow.value = cur;
    shared.uTime.value = t / 1000;
    seed.visible = cur < 0.06;
    light(cur);
    placeCamera(cur);
    sky.position.copy(camera.position);
    renderer.render(scene, camera);
    placeLabels(cur);
    dirty = false; lastDraw = t;
    resolve?.(); resolve = null;
  }
  resize();
  raf = requestAnimationFrame(frame);

  return {
    level, gpu, ready,
    setProgress(p) { target = p; },
    pause(x) { paused = x; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect();
      bark.dispose(); leaves.dispose(); barkMat.dispose(); leafMat.dispose(); tex.dispose();
      sky.geometry.dispose(); sky.material.dispose(); ground.geometry.dispose(); ground.material.dispose();
      seed.geometry.dispose(); seed.material.dispose();
      renderer.dispose(); cv.remove();
    },
  };
}
