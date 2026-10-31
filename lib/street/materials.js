// Materials of the street. PBR sets from Poly Haven (CC0): colour + normal + roughness, 1k WebP, loaded next to
// the page; procedural canvas textures for what must be ours alone: majolica tiles, signs, the plane tree's bark
// and leaves, lawn, clouds, the lit interiors behind glass, window grids of the distant blocks.
import * as THREE from 'three';

export const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);
let basePath = 'tex/';
export function setTexturePath(p) { basePath = p; }

const texCache = new Map();
let anisoCap = 8;
/** Cap on texture anisotropy, set from the quality level before the scene is built. */
export function setAnisotropy(n) { anisoCap = n; }
function tex(name, { srgb = false, aniso = 8 } = {}) {
  const key = basePath + name;
  if (texCache.has(key)) return texCache.get(key);
  const t = loader.load(basePath + name + '.webp');
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = Math.min(aniso, anisoCap);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, t);
  return t;
}

/** A PBR material from a Poly Haven set; `extra` overrides (color tint, roughness multiplier …). */
export function pbr(name, extra = {}) {
  return new THREE.MeshStandardMaterial({
    map: tex(name + '-col', { srgb: true }),
    normalMap: tex(name + '-nrm'),
    roughnessMap: tex(name + '-rgh'),
    roughness: 1,
    metalness: 0,
    ...extra
  });
}

export function canvasTexture(w, h, draw, { srgb = true, repeat = false, aniso = 8 } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = Math.min(aniso, anisoCap);
  return t;
}

const lcg = (seed) => { let s = seed || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// ---------- majolica: an eight-point star lattice in two blues and bone white ----------
export function majolicaTexture() {
  return canvasTexture(512, 512, (g, S) => {
    g.fillStyle = '#1d3f7a';
    g.fillRect(0, 0, S, S);
    const n = 4, cell = S / n;
    const star = (cx, cy, r, color) => {
      g.fillStyle = color;
      g.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.62 : r;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.closePath(); g.fill();
    };
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const cx = (i + 0.5) * cell, cy = (j + 0.5) * cell;
      star(cx, cy, cell * 0.46, '#e6dfcf');
      star(cx, cy, cell * 0.38, '#2b8fa6');
      star(cx, cy, cell * 0.2, '#e6dfcf');
      star(cx, cy, cell * 0.12, '#1d3f7a');
      g.fillStyle = '#e6dfcf';
      g.fillRect(cx + cell / 2 - cell * 0.035, cy + cell / 2 - cell * 0.12, cell * 0.07, cell * 0.24);
      g.fillRect(cx + cell / 2 - cell * 0.12, cy + cell / 2 - cell * 0.035, cell * 0.24, cell * 0.07);
    }
    g.strokeStyle = 'rgba(255,255,255,0.16)';
    g.lineWidth = 2;
    for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * cell, 0); g.lineTo(i * cell, S); g.stroke(); g.beginPath(); g.moveTo(0, i * cell); g.lineTo(S, i * cell); g.stroke(); }
  }, { repeat: true });
}

// ---------- signs: the project's name in the site's sans, in the project's accent ----------
export function signTexture(text, sub, accent, { w = 2048, h = 384 } = {}) {
  return canvasTexture(w, h, (g) => {
    g.clearRect(0, 0, w, h);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = accent;
    let size = sub ? h * 0.5 : h * 0.6;
    const setFont = () => { g.font = `600 ${size}px "Golos Text", "Segoe UI", system-ui, sans-serif`; g.letterSpacing = `${size * 0.1}px`; };
    setFont();
    while (size > h * 0.2 && g.measureText(text).width > w * 0.94) { size *= 0.95; setFont(); }   // long names shrink to fit
    g.fillText(text, w / 2, sub ? h * 0.4 : h / 2);
    if (sub) {
      g.fillStyle = '#efe6da';
      g.font = `500 ${h * 0.17}px "Golos Text", "Segoe UI", system-ui, sans-serif`;
      g.letterSpacing = `${h * 0.05}px`;
      g.fillText(sub, w / 2, h * 0.8);
    }
  });
}

// ---------- a lit office behind a ribbon window: warm wall, desks, two lamps ----------
export function officeTexture(seed = 1) {
  return canvasTexture(1024, 256, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f1dcc0'); grad.addColorStop(1, '#c79a6e');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(70,45,30,0.55)';
    for (let i = 0; i < 6; i++) { const x = 40 + i * 165 + (seed * 37 % 50); g.fillRect(x, h * 0.62, 110, 10); g.fillRect(x + 50, h * 0.66, 8, h * 0.3); }
    g.fillStyle = 'rgba(60,40,30,0.35)';
    for (let i = 0; i < 5; i++) g.fillRect(90 + i * 190, h * 0.2, 70, 70);
    g.fillStyle = '#fff6e3';
    for (let i = 0; i < 4; i++) g.fillRect(120 + i * 240, h * 0.08, 90, 6);
    g.fillStyle = '#5f7a3a';
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(300 + i * 280, h * 0.52, 22, 0, Math.PI * 2); g.fill(); }
  });
}

// ---------- a tool wall for the workshop ----------
export function toolWallTexture() {
  return canvasTexture(1024, 512, (g, w, h) => {
    g.fillStyle = '#3b3a38'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 2;
    for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    const cols = ['#c9c2b4', '#e0862e', '#9a9a9a', '#d9d2c4', '#7c7369'];
    const r = lcg(7);
    for (let i = 0; i < 46; i++) {
      g.fillStyle = cols[Math.floor(r() * cols.length)];
      const x = 40 + r() * (w - 80), y = 40 + r() * (h - 120), ww = 6 + r() * 14, hh = 40 + r() * 120;
      g.fillRect(x, y, ww, hh);
    }
  });
}

// ---------- plane tree (chinor): softly mottled bark, palmate leaves ----------
export function chinorBarkTexture() {
  return canvasTexture(512, 1024, (g, w, h) => {
    g.fillStyle = '#9b9681'; g.fillRect(0, 0, w, h);
    const r = lcg(11);
    // every patch is drawn four times so the texture wraps on both axes
    const patch = (color, n, rx, ry, alpha) => {
      g.globalAlpha = alpha; g.fillStyle = color;
      for (let i = 0; i < n; i++) {
        const x = r() * w, y = r() * h, a = rx * (0.5 + r()), b = ry * (0.5 + r()), rot = r() * 0.5 - 0.25;
        const dx = x < w / 2 ? w : -w, dy = y < h / 2 ? h : -h;
        for (const [ox, oy] of [[0, 0], [dx, 0], [0, dy], [dx, dy]]) { g.beginPath(); g.ellipse(x + ox, y + oy, a, b, rot, 0, Math.PI * 2); g.fill(); }
      }
      g.globalAlpha = 1;
    };
    patch('#7d785f', 90, 20, 44, 0.7);
    patch('#bdb79c', 110, 18, 40, 0.7);
    patch('#a8a38a', 80, 26, 56, 0.6);
    patch('#d3cdb2', 40, 10, 24, 0.7);
    patch('#6a6650', 40, 8, 26, 0.6);
    g.globalAlpha = 0.1;
    for (let i = 0; i < 2600; i++) { g.fillStyle = r() < 0.5 ? '#000' : '#fff'; g.fillRect(r() * w, r() * h, 1, 6 + r() * 22); }
    g.globalAlpha = 1;
  }, { repeat: true });
}

// ---------- leaf atlases: 2×2 tiles of leaf clusters, colour painted everywhere, mips with coverage boost ----------
/**
 * Builds a leaf atlas as a DataTexture rather than a canvas texture, for two reasons. Colour is painted under the
 * transparent pixels too (every leaf is first stamped enlarged, then at its real size), so bilinear filtering at the
 * cut-out edge never mixes in black and the alphaTest edge has no dark fringe. And the mip chain is built here with
 * a coverage boost on the smaller levels, so a crown keeps its density in the distance instead of thinning out.
 * `tiles` paints each of the four tiles through `stamp(x, y, size, rot, tone)` in tile pixels; tiles 0–1 are read
 * as the dense inner clusters, 2–3 as the sparser clusters of the crown's edge.
 */
function leafAtlas(tileSize, tiles, leafPath) {
  const S = tileSize, W = S * 2;
  const cc = document.createElement('canvas'), mc = document.createElement('canvas');
  cc.width = cc.height = mc.width = mc.height = W;
  const gc = cc.getContext('2d'), gm = mc.getContext('2d');
  const stamps = [];
  const stampTo = (g, x, y, size, rot, tone, k) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.fillStyle = tone; leafPath(g, size); g.fill(); g.restore();
  };
  tiles.forEach((paint, i) => {
    const ox = (i & 1) * S, oy = (i >> 1) * S;
    const list = [];
    paint((x, y, size, rot, tone) => list.push([ox + x, oy + y, size, rot, tone]), S, lcg(i * 7 + 3));
    stamps.push(list);
  });
  // ground colour, then the enlarged underpaint, then the leaves themselves; the mask gets only the leaves
  gc.fillStyle = '#6e8a3a'; gc.fillRect(0, 0, W, W);
  for (const list of stamps) for (const [x, y, size, rot, tone] of list) stampTo(gc, x, y, size, rot, tone, 1.9);
  for (const list of stamps) for (const [x, y, size, rot, tone] of list) { stampTo(gc, x, y, size, rot, tone, 1); stampTo(gm, x, y, size, rot, tone, 1); }
  const col = gc.getImageData(0, 0, W, W).data, msk = gm.getImageData(0, 0, W, W).data;
  const base = new Uint8Array(W * W * 4);
  for (let i = 0; i < W * W; i++) { base[i * 4] = col[i * 4]; base[i * 4 + 1] = col[i * 4 + 1]; base[i * 4 + 2] = col[i * 4 + 2]; base[i * 4 + 3] = msk[i * 4 + 3]; }
  // the mip chain: alpha-weighted colour, alpha boosted from level 2 on so the far crowns stay as dense as the near
  const mips = [{ data: base, width: W, height: W }];
  let prev = base, w = W, level = 0;
  while (w > 1) {
    const hw = w >> 1, out = new Uint8Array(hw * hw * 4), boost = Math.min(1.7, 1 + Math.max(0, level - 1) * 0.18);
    level++;
    for (let y = 0; y < hw; y++) for (let x = 0; x < hw; x++) {
      let r = 0, g = 0, b = 0, a = 0, sr = 0, sg = 0, sb = 0;
      for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
        const p = ((y * 2 + dy) * w + x * 2 + dx) * 4, pa = prev[p + 3];
        r += prev[p] * pa; g += prev[p + 1] * pa; b += prev[p + 2] * pa; a += pa;
        sr += prev[p]; sg += prev[p + 1]; sb += prev[p + 2];
      }
      const o = (y * hw + x) * 4;
      if (a > 0) { out[o] = r / a; out[o + 1] = g / a; out[o + 2] = b / a; } else { out[o] = sr / 4; out[o + 1] = sg / 4; out[o + 2] = sb / 4; }
      out[o + 3] = Math.min(255, (a / 4) * boost);
    }
    mips.push({ data: out, width: hw, height: hw });
    prev = out; w = hw;
  }
  const t = new THREE.DataTexture(base, W, W);
  t.mipmaps = mips;
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, anisoCap);
  t.needsUpdate = true;
  return t;
}

// a five-lobed plane-tree leaf, `size` the radius to the lobe tips
function chinorLeafPath(g, size) {
  g.beginPath(); g.moveTo(0, 0);
  for (let k = -2; k <= 2; k++) {
    const a = -Math.PI / 2 + k * 0.52;
    g.lineTo(Math.cos(a - 0.26) * size * 0.45, Math.sin(a - 0.26) * size * 0.45);
    g.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    g.lineTo(Math.cos(a + 0.26) * size * 0.45, Math.sin(a + 0.26) * size * 0.45);
  }
  g.closePath();
}
function ellipseLeafPath(g, size) { g.beginPath(); g.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2); }
/** '#rrggbb' scaled by k (k < 1 darkens). */
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0');
  return '#' + c(n >> 16) + c((n >> 8) & 255) + c(n & 255);
}

/**
 * Plane-tree leaf clusters: a card of 1.6–2.4 m shows a bunch of 18–25 cm leaves around a few twigs, with gaps
 * of sky between them — no plane of the card is ever filled, so none can read as a panel.
 */
export function chinorLeafTexture() {
  const tones = ['#86a040', '#6f8d35', '#9db04c', '#5f7f2e', '#a9b85a', '#78963c', '#8fa94a', '#67863a'];
  const cluster = (count, spread) => (stamp, S, r) => {
    const twigs = 3 + Math.floor(r() * 3), arms = [];
    for (let i = 0; i < twigs; i++) arms.push([(i / twigs + r() * 0.4) * Math.PI * 2, S * (0.25 + r() * 0.2)]);
    for (let i = 0; i < count; i++) {
      const [a0, len] = arms[i % arms.length];
      const t = 0.12 + r() * 0.88, a = a0 + (r() - 0.5) * spread;
      const x = S / 2 + Math.cos(a) * len * t, y = S / 2 + Math.sin(a) * len * t;
      // leaves deep in the cluster are darker: the bunch reads as a volume, not as a sheet of confetti
      stamp(x, y, S * (0.052 + r() * 0.026), a + Math.PI / 2 + (r() - 0.5) * 1.8, shade(tones[Math.floor(r() * tones.length)], 0.72 + 0.28 * t));
    }
  };
  return leafAtlas(512, [cluster(118, 0.9), cluster(104, 1.1), cluster(50, 0.8), cluster(42, 1.0)], chinorLeafPath);
}

/** Small rounded leaves for shrubs (box, privet): dense tiles for the body, sparse ones for the outline. */
export function shrubLeafTexture() {
  const tones = ['#4f7030', '#5d8038', '#6c9040', '#43622a', '#7aa048', '#587a34'];
  const cluster = (count, radius) => (stamp, S, r) => {
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * S * radius;
      stamp(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, S * (0.03 + r() * 0.02), r() * Math.PI, shade(tones[Math.floor(r() * tones.length)], 0.75 + 0.25 * d / (S * radius)));
    }
  };
  return leafAtlas(256, [cluster(260, 0.44), cluster(240, 0.42), cluster(110, 0.44), cluster(90, 0.4)], ellipseLeafPath);
}

// ---------- lawn: dense blades in several greens, wraps on both axes ----------
export function grassTexture() {
  return canvasTexture(512, 512, (g, S) => {
    g.fillStyle = '#6a8438'; g.fillRect(0, 0, S, S);
    const r = lcg(21);
    const tones = ['#5f7d33', '#7a9440', '#6a8a3a', '#86a04a', '#56712d', '#93a855', '#4e6a2a'];
    for (let i = 0; i < 11000; i++) {
      g.fillStyle = tones[Math.floor(r() * tones.length)];
      const x = r() * S, y = r() * S, l = 3 + r() * 8;
      g.fillRect(x, y, 1.3, l);
      if (y + l > S) g.fillRect(x, y - S, 1.3, l);
    }
    g.globalAlpha = 0.1;
    for (let i = 0; i < 60; i++) {
      g.fillStyle = r() < 0.5 ? '#2f4a18' : '#b7c46a';
      const x = r() * S, y = r() * S, a = 30 + r() * 70, b = 20 + r() * 40, rot = r() * 3;
      const dx = x < S / 2 ? S : -S, dy = y < S / 2 ? S : -S;
      for (const [ox, oy] of [[0, 0], [dx, 0], [0, dy], [dx, dy]]) { g.beginPath(); g.ellipse(x + ox, y + oy, a, b, rot, 0, Math.PI * 2); g.fill(); }
    }
    g.globalAlpha = 1;
  }, { repeat: true });
}

// ---------- yards: packed earth with gravel and the odd tuft of grass, wraps on both axes ----------
export function yardTexture() {
  return canvasTexture(512, 512, (g, S) => {
    g.fillStyle = '#a89f8e'; g.fillRect(0, 0, S, S);
    const r = lcg(33);
    const wrap = (x, y, draw) => { const dx = x < S / 2 ? S : -S, dy = y < S / 2 ? S : -S; for (const [ox, oy] of [[0, 0], [dx, 0], [0, dy], [dx, dy]]) draw(x + ox, y + oy); };
    const ellipse = (px, py, a, b, rot) => { g.beginPath(); g.ellipse(px, py, a, b, rot, 0, Math.PI * 2); g.fill(); };
    g.globalAlpha = 0.35;
    for (let i = 0; i < 70; i++) {
      g.fillStyle = r() < 0.5 ? '#978d7a' : '#b5ac9a';
      const a = 30 + r() * 80, b = 20 + r() * 50, rot = r() * 3;
      wrap(r() * S, r() * S, (px, py) => ellipse(px, py, a, b, rot));
    }
    g.globalAlpha = 1;
    const stones = ['#8f887b', '#b9b2a4', '#7c7568', '#c4bdae', '#a39a8a'];
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = stones[Math.floor(r() * stones.length)];
      const a = 1 + r() * 2.2, b = 0.8 + r() * 1.6, rot = r() * 3;
      wrap(r() * S, r() * S, (px, py) => ellipse(px, py, a, b, rot));
    }
    const tufts = ['#6d7f3c', '#5c7032', '#7f8f48'];
    g.lineCap = 'round'; g.lineWidth = 1.4;
    for (let i = 0; i < 220; i++) {
      g.strokeStyle = tufts[Math.floor(r() * tufts.length)];
      const blades = Array.from({ length: 5 }, () => [-Math.PI / 2 + (r() - 0.5) * 1.6, 4 + r() * 7]);
      wrap(r() * S, r() * S, (px, py) => { for (const [a, l] of blades) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); g.stroke(); } });
    }
  }, { repeat: true });
}

// ---------- clouds: soft puffs with a flatter base, alpha only ----------
export function cloudTexture(seed = 1) {
  return canvasTexture(512, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    const r = lcg(seed * 131 + 7);
    const puffs = 12 + Math.floor(r() * 8);
    for (let i = 0; i < puffs; i++) {
      const cx = w * 0.18 + r() * w * 0.64, cy = h * 0.5 + (r() - 0.5) * h * 0.3, rad = h * (0.12 + r() * 0.2);
      const grad = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)'); grad.addColorStop(0.55, 'rgba(255,255,255,0.5)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad; g.beginPath(); g.arc(cx, cy, rad, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = 'destination-out';
    const fade = g.createLinearGradient(0, h * 0.6, 0, h);
    fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = fade; g.fillRect(0, 0, w, h);
    const side = g.createLinearGradient(0, 0, w, 0);
    side.addColorStop(0, 'rgba(0,0,0,1)'); side.addColorStop(0.15, 'rgba(0,0,0,0)'); side.addColorStop(0.85, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = side; g.fillRect(0, 0, w, h);
    // seal the edge: whatever the puffs did, alpha is zero along the whole border, so the sprite's rectangle
    // can never read as a panel against the sky
    g.globalCompositeOperation = 'destination-in';
    const seal = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    seal.addColorStop(0, 'rgba(0,0,0,1)'); seal.addColorStop(0.62, 'rgba(0,0,0,1)'); seal.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = seal;
    g.save(); g.scale(1, h / w); g.fillRect(0, 0, w, w); g.restore();
  });
}

// ---------- window grid for the distant blocks: 4 floors × 6 bays per tile; map + emissive map share the seed ----------
export function windowsTextures(seed, wall) {
  const draw = (emissive) => (g, w, h) => {
    const r = lcg(seed * 977 + 3);
    g.fillStyle = emissive ? '#000000' : wall; g.fillRect(0, 0, w, h);
    const cols = 6, rows = 4, cw = w / cols, ch = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const lit = r() < 0.38, warm = r() < 0.7;
      const x = i * cw + cw * 0.3, y = j * ch + ch * 0.25, ww = cw * 0.4, hh = ch * 0.52;
      if (emissive) { if (lit) { g.fillStyle = warm ? '#ffd39a' : '#d9e6f2'; g.fillRect(x, y, ww, hh); } continue; }
      g.fillStyle = '#5c6670'; g.fillRect(x, y, ww, hh);
      g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(x, y, ww, hh * 0.45);       // sky reflected in the upper pane
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x - cw * 0.02, y + hh, ww + cw * 0.04, ch * 0.05);   // sill shadow
    }
    if (!emissive) { g.fillStyle = 'rgba(0,0,0,0.08)'; for (let j = 0; j < rows; j++) g.fillRect(0, j * ch, w, 2); }
  };
  return { map: canvasTexture(768, 512, draw(false), { repeat: true }), emissiveMap: canvasTexture(768, 512, draw(true), { repeat: true }) };
}

/** Concrete-ish flat material (kerbs, channel walls, workshop floor). */
export function concrete(color = '#9a968c', roughness = 0.92) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
}

export function darkMetal(color = '#2b2a2c') {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.7 });
}

/** Glass with a lit interior plane behind it is built in the building; this is the pane itself. */
export function glass(tint = '#9fb3b0') {
  return new THREE.MeshPhysicalMaterial({
    color: tint, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.42,
    envMapIntensity: 1.2, reflectivity: 0.6, depthWrite: false
  });
}
