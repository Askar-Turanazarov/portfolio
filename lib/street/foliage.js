// Foliage geometry and leaf atlases: pure math and 2D drawing, no DOM. Runs in a worker when the scene boots
// (foliage.worker.js through build.js) and on the main thread for the few shrubs the building kit plants while
// it builds. A crown is 60–90 cards of 1.6–2.4 m, each showing a cluster of small leaves from a 2×2 atlas (dense
// tiles inside, sparse tiles on the shell). Card normals are the crown's own (radial, blended towards up) and a
// per-vertex brightness darkens the inside and the underside, so a crown is lit as one soft volume.
import * as THREE from 'three';
import { rng, mergeGeometries } from './geo.js';

const _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _n = new THREE.Vector3(), _e = new THREE.Euler();
const UP = new THREE.Vector3(0, 1, 0), FWD = new THREE.Vector3(0, 0, 1);
const lcg = (seed) => { let s = seed || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

// ---------------------------------------------------------------------------------------------------------------
// cards
// ---------------------------------------------------------------------------------------------------------------
/**
 * `n` leaf cards inside the ellipsoid (centre C, radii R), biased towards its shell. Normals and brightness are
 * taken relative to `shadeC`/`shadeR` (the whole crown), so clusters at bough tips shade as part of one crown.
 * Cards on the shell read the sparse tiles of the atlas (2–3), the inner ones the dense tiles (0–1).
 */
export function cardCloud(C, R, n, s0, s1, r, shadeC = C, shadeR = R, bias = 0.5) {
  const cards = [];
  for (let i = 0; i < n; i++) {
    const s = s0 + r() * (s1 - s0);
    const cg = new THREE.PlaneGeometry(s, s);
    _v.set(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
    if (_v.lengthSq() < 1e-4) _v.set(0, 1, 0);
    _v.normalize();
    const rr = bias + (1 - bias) * Math.cbrt(r());
    const px = C.x + _v.x * R.x * rr, py = C.y + _v.y * R.y * rr, pz = C.z + _v.z * R.z * rr;
    cg.applyQuaternion(_q.setFromUnitVectors(FWD, _v));
    _e.set((r() - 0.5) * 1.0, (r() - 0.5) * 1.0, r() * Math.PI * 2);
    cg.applyQuaternion(_q.setFromEuler(_e));
    cg.translate(px, py, pz);
    // which tile of the 2×2 atlas this card shows, and a random mirror so repeats are not read
    const tile = rr > 0.88 ? 2 + (r() < 0.5 ? 1 : 0) : (r() < 0.5 ? 1 : 0), tx = tile & 1, ty = tile >> 1, flip = r() < 0.5;
    const uv = cg.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, ((flip ? 1 - uv.getX(k) : uv.getX(k)) + tx) * 0.5, (uv.getY(k) + ty) * 0.5);
    const pos = cg.attributes.position, nor = cg.attributes.normal;
    const col = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) {
      _n.set((pos.getX(k) - shadeC.x) / shadeR.x, (pos.getY(k) - shadeC.y) / shadeR.y, (pos.getZ(k) - shadeC.z) / shadeR.z);
      const d = Math.min(1.2, _n.length());
      _n.normalize();
      _n.y += 0.65; _n.normalize();            // ≈ 0.6 radial + 0.4 up: lit like a rounded canopy, never like a flat card
      nor.setXYZ(k, _n.x, _n.y, _n.z);
      const hgt = (pos.getY(k) - shadeC.y) / shadeR.y;
      const b = Math.min(1.0, Math.max(0.68, 0.72 + 0.18 * d + 0.1 * hgt));
      col[k * 3] = b; col[k * 3 + 1] = b; col[k * 3 + 2] = b;
    }
    cg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    cards.push(cg);
  }
  const g = mergeGeometries(cards);
  for (const c of cards) c.dispose();
  return g;
}

/** A low shrub standing on y, footprint rx × rz, height ry: { x, y, z, rx, ry, rz, seed, n }. */
export function shrubGeometry({ x, y, z, rx, ry, rz, seed, n = 20 }) {
  const r = rng(seed);
  const C = new THREE.Vector3(x, y + ry * 0.45, z), R = new THREE.Vector3(rx * 0.8, ry * 0.5, rz * 0.8);
  return cardCloud(C, R, n, rx * 0.9, rx * 1.3, r, new THREE.Vector3(x, y + ry * 0.2, z), new THREE.Vector3(rx, ry, rz), 0.4);
}

// ---------------------------------------------------------------------------------------------------------------
// plane trees
// ---------------------------------------------------------------------------------------------------------------
function bough(parts, from, dir, len, r0, r1) {
  const g = new THREE.CylinderGeometry(r1, r0, len, 9, 1, true);
  g.translate(0, len / 2, 0);
  g.applyQuaternion(_q.setFromUnitVectors(UP, dir));
  g.translate(from.x, from.y, from.z);
  parts.push(g);
  return from.clone().add(dir.clone().multiplyScalar(len));
}
const dirOf = (tilt, az) => new THREE.Vector3(Math.sin(tilt) * Math.cos(az), Math.cos(tilt), Math.sin(tilt) * Math.sin(az));

/**
 * Plane trees: a leaning, flaring trunk, three or four boughs in two bending segments with a side twig each.
 * All trees of the list ({ x, z, k, seed, y? }) are baked into two geometries: { bark, leaves }.
 */
export function chinorGeometries(list) {
  const barks = [], crowns = [];
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3();
  for (const t of list) {
    const r = rng(t.seed * 977 + 5);
    const H = 5.4 + r() * 1.4;
    const parts = [];
    const lean = (r() - 0.5) * 0.6, leanDir = r() * Math.PI * 2;
    const trunk = new THREE.CylinderGeometry(0.24, 0.4, H, 14, 6, true);
    const tp = trunk.attributes.position;
    for (let i = 0; i < tp.count; i++) {
      const f = Math.pow((tp.getY(i) + H / 2) / H, 2);
      tp.setX(i, tp.getX(i) + Math.cos(leanDir) * lean * f);
      tp.setZ(i, tp.getZ(i) + Math.sin(leanDir) * lean * f);
    }
    trunk.translate(0, H / 2, 0);
    trunk.computeVertexNormals();
    parts.push(trunk);
    const flare = new THREE.CylinderGeometry(0.4, 0.58, 0.5, 14, 1, true); flare.translate(0, 0.25, 0); parts.push(flare);
    const top = new THREE.Vector3(Math.cos(leanDir) * lean, H - 0.15, Math.sin(leanDir) * lean);
    const knuckle = new THREE.SphereGeometry(0.3, 10, 8); knuckle.translate(top.x, top.y, top.z); parts.push(knuckle);

    const boughs = 3 + Math.floor(r() * 2);
    const clusters = [];
    for (let i = 0; i < boughs; i++) {
      const az = (i / boughs + (r() - 0.5) * 0.25) * Math.PI * 2, tilt = 0.55 + r() * 0.4;
      const len1 = 1.5 + r() * 0.8, len2 = 1.5 + r() * 1.0, len3 = 1.0 + r() * 0.8;
      const elbow = bough(parts, top, dirOf(tilt, az), len1, 0.2, 0.13);
      const kn = new THREE.SphereGeometry(0.135, 8, 6); kn.translate(elbow.x, elbow.y, elbow.z); parts.push(kn);
      const d2 = dirOf(tilt * 0.5, az + (r() - 0.5) * 0.6);
      const tip = bough(parts, elbow, d2, len2, 0.13, 0.05);
      const d3 = dirOf(1.0 + r() * 0.3, az + (r() > 0.5 ? 1 : -1) * (0.7 + r() * 0.5));
      const tip3 = bough(parts, elbow, d3, len3, 0.08, 0.03);
      clusters.push({ C: tip.clone().addScaledVector(d2, -len2 * 0.25), R: new THREE.Vector3(1.6, 1.2, 1.6), n: 12, s: [1.3, 1.9] });
      clusters.push({ C: tip3.clone().addScaledVector(d3, -len3 * 0.2), R: new THREE.Vector3(1.0, 0.8, 1.0), n: 5, s: [1.0, 1.5] });
    }
    const bark = mergeGeometries(parts);
    for (const p of parts) p.dispose();

    // the crown: a main cloud of large cards plus a cluster at every bough tip and twig; card centres stay inside
    // the placement ellipsoid, so with 1.6–2.4 m cards the crown's underside ends at ≥ 4.5 m — a pruned city tree
    const centre = new THREE.Vector3(top.x, H + 2.6, top.z), CR = new THREE.Vector3(3.6, 2.4, 3.6);
    const geos = [cardCloud(centre, new THREE.Vector3(3.0, 1.9, 3.0), 46, 1.6, 2.4, r, centre, CR, 0.5)];
    for (const c of clusters) geos.push(cardCloud(c.C, c.R, c.n, c.s[0], c.s[1], r, centre, CR, 0.4));
    const leaves = mergeGeometries(geos);
    for (const gg of geos) gg.dispose();

    // bake the tree's placement into both geometries
    M.compose(P.set(t.x, t.y || 0, t.z), Q.setFromAxisAngle(UP, r() * Math.PI * 2), S.setScalar(t.k || 1));
    bark.applyMatrix4(M); leaves.applyMatrix4(M);
    barks.push(bark); crowns.push(leaves);
  }
  const out = { bark: mergeGeometries(barks), leaves: mergeGeometries(crowns) };
  for (const g of barks) g.dispose();
  for (const g of crowns) g.dispose();
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// leaf atlases: 2×2 tiles of leaf clusters, colour painted everywhere, mips with a coverage boost
// ---------------------------------------------------------------------------------------------------------------
const makeCanvas = (w, h) => {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
};

/**
 * Builds a leaf atlas as raw RGBA levels ({ base, mips, W }) for a DataTexture rather than a canvas texture, for
 * two reasons. Colour is painted under the transparent pixels too (every leaf is first stamped enlarged, then at
 * its real size), so bilinear filtering at the cut-out edge never mixes in black and the alphaTest edge has no dark
 * fringe. And the mip chain is built here with a coverage boost on the smaller levels, so a crown keeps its
 * density in the distance instead of thinning out. `tiles` paints each of the four tiles through
 * `stamp(x, y, size, rot, tone)` in tile pixels; tiles 0–1 are read as the dense inner clusters, 2–3 as the sparser
 * clusters of the crown's edge.
 */
export function leafAtlas(tileSize, tiles, leafPath, ground) {
  const S = tileSize, W = S * 2;
  const gc = makeCanvas(W, W).getContext('2d'), gm = makeCanvas(W, W).getContext('2d');
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
  gc.fillStyle = ground; gc.fillRect(0, 0, W, W);
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
  return { base, mips, W };
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

/** The ground colours of the two atlases (also the colour of the placeholders the materials start with). */
export const LEAF_GROUND = '#6e8a3a', SHRUB_GROUND = '#4f7030';

/**
 * Plane-tree leaf clusters: a card of 1.6–2.4 m shows a bunch of 18–25 cm leaves around a few twigs, with gaps
 * of sky between them — no plane of the card is ever filled, so none can read as a panel.
 */
export function chinorLeafAtlas() {
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
  return leafAtlas(512, [cluster(118, 0.9), cluster(104, 1.1), cluster(50, 0.8), cluster(42, 1.0)], chinorLeafPath, LEAF_GROUND);
}

/** Small rounded leaves for shrubs (box, privet): dense tiles for the body, sparse ones for the outline. */
export function shrubLeafAtlas() {
  const tones = ['#4f7030', '#5d8038', '#6c9040', '#43622a', '#7aa048', '#587a34'];
  const cluster = (count, radius) => (stamp, S, r) => {
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * S * radius;
      stamp(S / 2 + Math.cos(a) * d, S / 2 + Math.sin(a) * d, S * (0.03 + r() * 0.02), r() * Math.PI, shade(tones[Math.floor(r() * tones.length)], 0.75 + 0.25 * d / (S * radius)));
    }
  };
  return leafAtlas(256, [cluster(260, 0.44), cluster(240, 0.42), cluster(110, 0.44), cluster(90, 0.4)], ellipseLeafPath, SHRUB_GROUND);
}

// ---------------------------------------------------------------------------------------------------------------
// the whole job, and its wire format
// ---------------------------------------------------------------------------------------------------------------
/** A geometry as plain typed arrays (what a worker can transfer). */
export function packGeometry(g) {
  const out = { index: g.index ? g.index.array : null, attributes: {} };
  for (const name of Object.keys(g.attributes)) out.attributes[name] = { array: g.attributes[name].array, itemSize: g.attributes[name].itemSize };
  return out;
}
export function unpackGeometry(p) {
  const g = new THREE.BufferGeometry();
  if (p.index) g.setIndex(new THREE.BufferAttribute(p.index, 1));
  for (const [name, a] of Object.entries(p.attributes)) g.setAttribute(name, new THREE.BufferAttribute(a.array, a.itemSize));
  return g;
}
/** Every distinct ArrayBuffer in a packed result, for postMessage's transfer list. */
export function buffersOf(result) {
  const set = new Set();
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (ArrayBuffer.isView(v)) { set.add(v.buffer); return; }
    for (const x of Object.values(v)) walk(x);
  };
  walk(result);
  return [...set];
}

/**
 * Build everything the street's planting needs: { trees: [{ x, z, k, seed }], shrubs: [{ x, y, z, rx, ry, rz, seed, n }] }
 * → { bark, leaves, shrubs } as packed geometries and the two atlases { chinorAtlas, shrubAtlas }.
 */
export function buildFoliage({ trees, shrubs }) {
  const t0 = performance.now();
  const { bark, leaves } = chinorGeometries(trees);
  const shrubGeos = shrubs.map(shrubGeometry);
  const shrubAll = mergeGeometries(shrubGeos);
  for (const g of shrubGeos) g.dispose();
  const tGeo = performance.now() - t0;
  const chinorAtlas = chinorLeafAtlas(), shrubAtlas = shrubLeafAtlas();
  const out = { bark: packGeometry(bark), leaves: packGeometry(leaves), shrubs: packGeometry(shrubAll), chinorAtlas, shrubAtlas, ms: { geometry: tGeo, atlases: performance.now() - t0 - tGeo } };
  bark.dispose(); leaves.dispose(); shrubAll.dispose();
  return out;
}
