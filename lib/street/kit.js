// The building kit: a small grammar of facade parts that every building on the street is assembled from, and an
// accumulator that merges everything drawn with one material into one mesh, so a detailed building costs a dozen
// draw calls instead of a hundred.
//
// Conventions: a building's facade is the plane z = 0 facing +z (the street); x runs along the street with the
// building centred on 0; depth goes to -z; y is up with the pavement at 0. All sizes are metres.
import * as THREE from 'three';
import { plane, box, at, rotY, rotX, rotZ, mesh, projectUV, mergeGeometries, rng } from './geo.js';
import { pbr, concrete, darkMetal, glass, majolicaTexture, signTexture } from './materials.js';
import { interiorTexture, stripeTexture } from './interiors.js';
import { shrub, shrubMaterial } from './vegetation.js';

// ---------------------------------------------------------------------------------------------------------------
// the accumulator
// ---------------------------------------------------------------------------------------------------------------
export function createKit({ slug, name, accent, seed = 1 }) {
  const buckets = new Map();      // material -> { geos, cast, receive }
  const objects = [];             // ready-made objects (cars, lights) added as they are
  const shrubs = [];              // shrub geometries, merged into one mesh at build()
  const matCache = new Map();
  const k = {
    slug, name, accent, rnd: rng(seed),
    emissives: [], lights: [], facadeMats: [],
    /** Add a positioned geometry drawn with `mat`. */
    add(geo, mat, { cast = true, receive = true } = {}) {
      const key = mat;
      let b = buckets.get(key);
      if (!b) { b = { geos: [], cast, receive }; buckets.set(key, b); }
      b.geos.push(geo);
      b.cast = b.cast || cast;
      return geo;
    },
    object(o) { objects.push(o); return o; },
    shrub(x, y, z, rx, ry, rz, seed, n = 40) { shrubs.push(shrub(x, y, z, rx, ry, rz, seed, n)); },
    /** Register a material whose emissiveIntensity follows the time of day. */
    glow(mat, day, night) { k.emissives.push({ mat, day, night }); return mat; },
    light(l, day, night) { k.lights.push({ light: l, day, night }); objects.push(l); if (l.target) objects.push(l.target); return l; },
    /** Cached per-building materials (so one brick colour is one material, one draw call). */
    mat(kind, color, extra = {}) {
      const key = kind + '|' + color + '|' + JSON.stringify(extra);
      if (matCache.has(key)) return matCache.get(key);
      let m;
      switch (kind) {
        case 'brick': case 'plaster': case 'wood': case 'pavers': case 'metal': case 'shutter': case 'asphalt':
          m = pbr(kind, { color, ...extra });
          if (kind === 'plaster') m.normalScale = new THREE.Vector2(1.4, 1.4);
          if (kind === 'brick' || kind === 'plaster') k.facadeMats.push(m);
          break;
        case 'concrete': m = concrete(color, extra.roughness ?? 0.85); break;
        case 'metalFlat': m = darkMetal(color); break;
        case 'glass': m = glass(color); break;
        case 'flat': m = new THREE.MeshStandardMaterial({ color, roughness: extra.roughness ?? 0.8, metalness: extra.metalness ?? 0 }); break;
        case 'majolica': m = new THREE.MeshStandardMaterial({ map: majolicaTexture(), roughness: 0.3, metalness: 0 }); break;
        default: throw new Error('unknown material kind ' + kind);
      }
      matCache.set(key, m);
      return m;
    },
    /** A lit interior plane material (map + emissive map, bright in the evening). */
    interior(kind, seed = 1, { day = 0.12, night = 1.1 } = {}) {
      const t = interiorTexture(kind, accent, seed);
      const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: day, roughness: 1 });
      return k.glow(m, day, night);
    },
    /** Warm light source material (lamps, LED strips, pendants). */
    lamp(color = '#ffd9a8', day = 0, night = 3) {
      return k.glow(new THREE.MeshStandardMaterial({ color: '#f6e9d3', emissive: color, emissiveIntensity: day, roughness: 0.5 }), day, night);
    },
    /** Finish: one mesh per material, shrubs merged, hit box for picking, label anchor. */
    build({ w, d, h, labelY = h + 1.2, hitX = 0, trees = [] }) {
      const g = new THREE.Group();
      g.name = slug;
      for (const [mat, b] of buckets) {
        const geo = b.geos.length === 1 ? b.geos[0] : mergeGeometries(b.geos);
        if (b.geos.length > 1) for (const p of b.geos) p.dispose();
        g.add(mesh(geo, mat, { cast: b.cast, receive: b.receive }));
      }
      if (shrubs.length) { g.add(mesh(mergeGeometries(shrubs), shrubMaterial())); for (const s of shrubs) s.dispose(); }
      for (const o of objects) g.add(o);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.set(hitX, h / 2, -d / 2);
      hit.name = 'hit';
      hit.userData.slug = slug;
      g.add(hit);
      return { group: g, hit, emissives: k.emissives, lights: k.lights, facadeMats: k.facadeMats, slug, name, accent, w, d, h, hitX, trees, label: new THREE.Vector3(hitX, labelY, 0) };
    }
  };
  return k;
}

// ---------------------------------------------------------------------------------------------------------------
// walls
// ---------------------------------------------------------------------------------------------------------------
/** The front wall (facing +z) from x0 to x1, y0 to y1, minus rectangular openings {x0,x1,y0,y1}. UVs projected in x/y. */
export function facade(k, mat, x0, x1, y0, y1, openings = [], { z = 0, tile = 1.5 } = {}) {
  const pieces = [];
  const piece = (a, b, c, d) => { if (b - a < 0.01 || d - c < 0.01) return; const p = plane(b - a, d - c); p.translate((a + b) / 2, (c + d) / 2, z); pieces.push(p); };
  // split the wall into vertical strips at every opening edge; in each strip the openings stack in y
  const xs = [x0, x1];
  for (const o of openings) { if (o.x0 > x0 && o.x0 < x1) xs.push(o.x0); if (o.x1 > x0 && o.x1 < x1) xs.push(o.x1); }
  xs.sort((a, b) => a - b);
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1];
    if (b - a < 0.005) continue;
    const mid = (a + b) / 2;
    const inStrip = openings.filter(o => o.x0 <= mid && o.x1 >= mid).sort((p, q) => p.y0 - q.y0);
    let cy = y0;
    for (const o of inStrip) { piece(a, b, cy, Math.max(cy, Math.min(y1, o.y0))); cy = Math.max(cy, Math.min(y1, o.y1)); }
    piece(a, b, cy, y1);
  }
  if (!pieces.length) return;
  k.add(projectUV(mergeGeometries(pieces), 'x', tile), mat);
  for (const p of pieces) p.dispose();
}

/** Left, right and back walls of a box w × d from y0 to y1. */
export function shell(k, mat, w, d, y0, y1, { tile = 1.5, back = true } = {}) {
  const hgt = y1 - y0;
  const l = plane(d, hgt); l.rotateY(-Math.PI / 2); l.translate(-w / 2, y0 + hgt / 2, -d / 2);
  const r = plane(d, hgt); r.rotateY(Math.PI / 2); r.translate(w / 2, y0 + hgt / 2, -d / 2);
  k.add(projectUV(mergeGeometries([l, r]), 'z', tile), mat);
  if (back) { const b = plane(w, hgt); b.rotateY(Math.PI); b.translate(0, y0 + hgt / 2, -d); k.add(projectUV(b, 'x', tile), mat); }
}

/**
 * A wall following a polyline in the ground plane (for rounded corners and set-backs). Points are [x, z] walked
 * with the building on the LEFT, so the outward normal is on the right of the direction of travel. UVs follow the
 * length of the wall, so a brick course runs round the corner unbroken.
 */
export function ribbon(k, mat, pts, y0, y1, { tile = 1.5, closed = false } = {}) {
  const P = closed ? [...pts, pts[0]] : pts;
  const n = P.length, pos = [], uv = [], nor = [], idx = [];
  let s = 0;
  for (let i = 0; i < n; i++) {
    const [x, z] = P[i];
    const prev = P[Math.max(0, i - 1)], next = P[Math.min(n - 1, i + 1)];
    if (i > 0) s += Math.hypot(x - prev[0], z - prev[1]);
    const dx = next[0] - prev[0], dz = next[1] - prev[1], len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len, nz = dx / len;
    pos.push(x, y0, z, x, y1, z);
    nor.push(nx, 0, nz, nx, 0, nz);
    uv.push(s / tile, y0 / tile, s / tile, y1 / tile);
    if (i < n - 1) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  k.add(g, mat);
}

/** Points of a quarter circle from angle a0 to a1 (radians) around (cx, cz). */
export function arc(cx, cz, r, a0, a1, steps = 8) {
  const out = [];
  for (let i = 0; i <= steps; i++) { const a = a0 + (a1 - a0) * i / steps; out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]); }
  return out;
}

/** Inner reveals of an opening, `depth` metres deep from the wall plane z. */
export function reveals(k, mat, o, depth, z = 0) {
  const w = o.x1 - o.x0, h = o.y1 - o.y0, cx = (o.x0 + o.x1) / 2, cy = (o.y0 + o.y1) / 2, zc = z - depth / 2;
  k.add(at(rotY(new THREE.PlaneGeometry(depth, h), Math.PI / 2), o.x0, cy, zc), mat, { cast: false });
  k.add(at(rotY(new THREE.PlaneGeometry(depth, h), -Math.PI / 2), o.x1, cy, zc), mat, { cast: false });
  k.add(at(rotX(new THREE.PlaneGeometry(w, depth), Math.PI / 2), cx, o.y1, zc), mat, { cast: false });
  if (o.y0 > 0.01) k.add(at(rotX(new THREE.PlaneGeometry(w, depth), -Math.PI / 2), cx, o.y0, zc), mat, { cast: false });
}

/** A slab (floor plate, roof, plinth): a box w × d, thickness t, top at y. */
export function slab(k, mat, w, t, d, y, { x = 0, z = -d / 2, faces = 'fklrt', tile = 2 } = {}) {
  k.add(at(box(w, t, d, tile, faces), x, y - t, z), mat);
}

// ---------------------------------------------------------------------------------------------------------------
// openings
// ---------------------------------------------------------------------------------------------------------------
/**
 * A glazed window set `depth` into the wall: frame + mullions, glass, reveals, a lit interior plane behind, a sill.
 * o = {x0,x1,y0,y1}; mullions every `step` metres; interior is a material from k.interior().
 */
export function window(k, o, { depth = 0.35, step = 1.6, transom = null, frame, glassMat, interior, interiorZ = -0.9, revealMat, sill = true, sillMat, z = 0 } = {}) {
  const w = o.x1 - o.x0, h = o.y1 - o.y0, cx = (o.x0 + o.x1) / 2, cy = (o.y0 + o.y1) / 2;
  const fz = z - depth, fm = frame || k.mat('metalFlat', '#26262a');
  k.add(at(new THREE.BoxGeometry(w, 0.08, 0.16), cx, o.y0 + 0.04, fz), fm);
  k.add(at(new THREE.BoxGeometry(w, 0.08, 0.16), cx, o.y1 - 0.04, fz), fm);
  k.add(at(new THREE.BoxGeometry(0.08, h, 0.16), o.x0 + 0.04, cy, fz), fm);
  k.add(at(new THREE.BoxGeometry(0.08, h, 0.16), o.x1 - 0.04, cy, fz), fm);
  for (let x = o.x0 + step; x < o.x1 - 0.3; x += step) k.add(at(new THREE.BoxGeometry(0.06, h, 0.14), x, cy, fz), fm);
  if (transom) k.add(at(new THREE.BoxGeometry(w, 0.06, 0.14), cx, transom, fz), fm);
  k.add(at(new THREE.PlaneGeometry(w - 0.1, h - 0.1), cx, cy, fz - 0.02), glassMat || k.mat('glass', '#9fb3b0'), { cast: false });
  if (depth > 0.05) reveals(k, revealMat || k.mat('flat', '#cfc6b6', { roughness: 1 }), o, depth, z);
  if (interior) k.add(at(new THREE.PlaneGeometry(w + 0.4, h + 0.2), cx, cy, z + interiorZ), interior, { cast: false });
  if (sill) k.add(at(box(w + 0.3, 0.08, 0.3, 2, 'flrtd'), cx, o.y0 - 0.08, z + 0.02), sillMat || k.mat('concrete', '#cfc8ba', { roughness: 0.75 }));
}

/** A row of identical punched windows: centres xs, width ww, from y0 to y1. */
export function punched(k, xs, ww, y0, y1, opts = {}) {
  const list = [];
  for (const x of xs) { const o = { x0: x - ww / 2, x1: x + ww / 2, y0, y1 }; list.push(o); window(k, o, { step: 99, ...opts }); }
  return list;
}

/** Timber shutters either side of an opening, slightly open. */
export function shutters(k, mat, o, { z = 0.09, leaf = 0.45 } = {}) {
  const h = o.y1 - o.y0 - 0.1, cy = (o.y0 + o.y1) / 2;
  k.add(at(rotY(box(leaf, h, 0.05, 1.2, 'fklr'), -0.35), o.x0 - leaf / 2 + 0.05, cy - h / 2, z), mat);
  k.add(at(rotY(box(leaf, h, 0.05, 1.2, 'fklr'), 0.35), o.x1 + leaf / 2 - 0.05, cy - h / 2, z), mat);
}

/** A glass door (or shopfront) with a graphite frame and a lit interior room behind it. */
export function glassDoor(k, o, { depth = 0.3, interior, interiorZ = -2.2, floorMat, pulls = true, frame, z = 0 } = {}) {
  const w = o.x1 - o.x0, h = o.y1 - o.y0, cx = (o.x0 + o.x1) / 2, fz = z - depth, fm = frame || k.mat('metalFlat', '#26262a');
  k.add(at(new THREE.BoxGeometry(w, 0.08, 0.1), cx, o.y1 - 0.04, fz), fm);
  for (const x of [o.x0 + 0.04, cx, o.x1 - 0.04]) k.add(at(new THREE.BoxGeometry(0.08, h, 0.1), x, o.y0 + h / 2, fz), fm);
  k.add(at(new THREE.BoxGeometry(w, 0.06, 0.1), cx, o.y0 + h * 0.72, fz), fm);
  if (pulls) k.add(at(new THREE.BoxGeometry(Math.min(2.3, w - 0.3), 0.05, 0.12), cx, o.y0 + 1.02, fz + 0.04), fm);
  k.add(at(new THREE.PlaneGeometry(w - 0.1, h - 0.1), cx, o.y0 + h / 2, fz - 0.01), k.mat('glass', '#aebfb8'), { cast: false });
  if (interior) {
    k.add(at(new THREE.PlaneGeometry(w + 1.6, h + 0.4), cx, o.y0 + h / 2, z + interiorZ), interior, { cast: false });
    k.add(at(rotX(new THREE.PlaneGeometry(w + 1.6, -interiorZ), -Math.PI / 2), cx, o.y0 + 0.01, z + interiorZ / 2), floorMat || k.mat('flat', '#7c6f60', { roughness: 0.4 }), { cast: false });
  }
  reveals(k, k.mat('flat', '#2d2b29', { roughness: 0.7 }), o, depth, z);
}

/** A big shop window: a glass plane flush with a thin frame, dark base, lit display inside. */
export function shopfront(k, o, { interior, interiorZ = -1.6, base = 0.4, frame, z = 0 } = {}) {
  const w = o.x1 - o.x0, h = o.y1 - o.y0, cx = (o.x0 + o.x1) / 2, fm = frame || k.mat('metalFlat', '#26262a');
  k.add(at(new THREE.BoxGeometry(w + 0.16, 0.1, 0.14), cx, o.y1 - 0.05, z - 0.07), fm);
  k.add(at(new THREE.BoxGeometry(0.1, h, 0.14), o.x0 + 0.05, o.y0 + h / 2, z - 0.07), fm);
  k.add(at(new THREE.BoxGeometry(0.1, h, 0.14), o.x1 - 0.05, o.y0 + h / 2, z - 0.07), fm);
  for (let x = o.x0 + 2.4; x < o.x1 - 0.8; x += 2.4) k.add(at(new THREE.BoxGeometry(0.05, h, 0.1), x, o.y0 + h / 2, z - 0.07), fm);
  k.add(at(new THREE.PlaneGeometry(w - 0.1, h - 0.1), cx, o.y0 + h / 2, z - 0.1), k.mat('glass', '#9fb3b0'), { cast: false });
  if (base > 0) k.add(at(box(w + 0.16, base, 0.3, 2, 'flrt'), cx, o.y0 - base, z - 0.3), fm);
  if (interior) {
    k.add(at(new THREE.PlaneGeometry(w + 0.6, h + 0.5), cx, o.y0 + h / 2 + 0.1, z + interiorZ), interior, { cast: false });
    k.add(at(rotX(new THREE.PlaneGeometry(w + 0.6, -interiorZ), -Math.PI / 2), cx, o.y0 - 0.02, z + interiorZ / 2), k.mat('flat', '#3a3a3e', { roughness: 0.4 }), { cast: false });
  }
}

/** The entrance portal in majolica: two jambs and a head round an opening, standing proud of the wall. */
export function portal(k, o, { jamb = 0.38, z = 0, mat } = {}) {
  const m = mat || k.mat('majolica', '#');
  const h = o.y1 - o.y0;
  k.add(at(box(jamb, h + jamb, 0.1, 1.0, 'fklrt'), o.x0 - jamb / 2, o.y0, z + 0.05), m);
  k.add(at(box(jamb, h + jamb, 0.1, 1.0, 'fklrt'), o.x1 + jamb / 2, o.y0, z + 0.05), m);
  k.add(at(box(o.x1 - o.x0, jamb, 0.1, 1.0, 'fklrtd'), (o.x0 + o.x1) / 2, o.y1, z + 0.05), m);
}

// ---------------------------------------------------------------------------------------------------------------
// things on the facade
// ---------------------------------------------------------------------------------------------------------------
/** A thin winged canopy over an entrance with a warm lit underside and an accent edge, hung on two rods. */
export function canopy(k, { x0, x1, y, depth = 2.2, z = 0, edge = true, rods = true, topColor = '#2b2b2e' }) {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  k.add(at(box(w, 0.14, depth, 2, 'fklrt'), cx, y, z + depth / 2), k.mat('flat', topColor, { roughness: 0.4, metalness: 0.6 }));
  const under = k.glow(new THREE.MeshStandardMaterial({ color: '#f1e6d6', emissive: '#ffd9ae', emissiveIntensity: 0, roughness: 0.7 }), 0, 1.6);
  k.add(at(rotX(new THREE.PlaneGeometry(w - 0.02, depth - 0.02), Math.PI / 2), cx, y - 0.001, z + depth / 2), under, { cast: false });
  if (edge) k.add(at(new THREE.BoxGeometry(w, 0.14, 0.06), cx, y + 0.07, z + depth + 0.02), k.mat('flat', k.accent, { roughness: 0.4 }));
  if (rods) for (const rx of [x0 - 0.2, x1 + 0.2]) k.add(at(rotX(new THREE.CylinderGeometry(0.02, 0.02, depth * 1.15, 8), -0.6), rx, y + depth * 0.4, z + depth / 2 - 0.1), k.mat('metalFlat', '#26262a'), { cast: false });
}

/** A striped fabric awning over a shop window. */
export function awning(k, { x0, x1, y, depth = 1.6, drop = 0.7, z = 0, colors }) {
  const w = x1 - x0, cx = (x0 + x1) / 2;
  const tex = stripeTexture(colors[0], colors[1], Math.max(4, Math.round(w * 1.6)));
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide });
  const slope = rotX(new THREE.PlaneGeometry(w, Math.hypot(depth, drop)), -Math.PI / 2 + Math.atan2(drop, depth));
  k.add(at(slope, cx, y - drop / 2, z + depth / 2), m);
  const valance = new THREE.PlaneGeometry(w, 0.3); valance.translate(cx, y - drop - 0.15, z + depth);
  k.add(valance, m, { cast: false });
  for (const x of [x0 + 0.1, x1 - 0.1]) k.add(at(rotX(new THREE.CylinderGeometry(0.02, 0.02, Math.hypot(depth, drop), 6), -Math.PI / 2 + Math.atan2(drop, depth)), x, y - drop / 2, z + depth / 2), k.mat('metalFlat', '#26262a'), { cast: false });
}

/** A dark band standing proud of the wall, carrying the sign. */
export function signBand(k, { x0, x1, y, h = 0.9, z = 0, proud = 0.32, color = '#232326' }) {
  k.add(at(box(x1 - x0, h, proud, 2, 'fklrtd'), (x0 + x1) / 2, y, z + proud / 2), k.mat('flat', color, { roughness: 0.55, metalness: 0.5 }));
}

/** Sign letters: a transparent canvas with the name (and a small line under it) in the accent colour, lit at night. */
export function sign(k, text, sub, { cx, cy, z, w, h = 0.8, night = 2.6, color }) {
  const t = signTexture(text, sub, color || k.accent);
  const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: 0, alphaTest: 0.35, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  k.glow(m, 0, night);
  k.add(at(new THREE.PlaneGeometry(w, h), cx, cy, z), m, { cast: false, receive: false });
}

/** A vertical sign fin at a corner, letters running down. */
export function finSign(k, text, { x, y0, y1, z = 0.2, w = 0.9, color }) {
  const fin = k.mat('flat', '#232326', { roughness: 0.55, metalness: 0.5 });
  k.add(at(box(0.12, y1 - y0, w, 2, 'fklrtd'), x, y0, z + w / 2), fin);
  const t = signTexture(text, '', color || k.accent, { w: 1536, h: 256 });
  const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: 0, transparent: true, roughness: 0.6, depthWrite: false });
  k.glow(m, 0, 2.6);
  const len = (y1 - y0) - 0.3;
  for (const side of [-1, 1]) {
    const p = new THREE.PlaneGeometry(len, w * 0.7);
    p.rotateZ(-Math.PI / 2); p.rotateY(side * Math.PI / 2);
    p.translate(x + side * 0.07, (y0 + y1) / 2, z + w / 2);
    k.add(p, m, { cast: false });
  }
}

/** A warm LED strip (under a cornice, along a band). */
export function ledStrip(k, x0, x1, y, z, { night = 3.2 } = {}) {
  const m = k.lamp('#ffd3a0', 0, night);
  k.add(at(new THREE.BoxGeometry(x1 - x0, 0.025, 0.05), (x0 + x1) / 2, y, z), m, { cast: false });
}

/** Brick pilasters: vertical strips standing 2 cm proud, at xs. */
export function pilasters(k, mat, xs, y0, y1, { w = 0.6, z = 0.02 } = {}) {
  for (const x of xs) k.add(at(box(w, y1 - y0, 0.1, 1.5, 'flrt'), x, y0, z), mat);
}

/** Soldier-course lintels over openings. */
export function lintels(k, mat, openings, { z = 0 } = {}) {
  for (const o of openings) k.add(at(box(o.x1 - o.x0 + 0.5, 0.42, 0.07, 1.5, 'flrtd'), (o.x0 + o.x1) / 2, o.y1 + 0.02, z), mat);
}

/** A projecting cornice/parapet cap around the roof. */
export function cornice(k, mat, w, d, y, { over = 0.25, t = 0.14 } = {}) {
  k.add(at(box(w + over * 2, t, d + over, 2, 'fklrtd'), 0, y - t, -d / 2 + over / 2), mat);
}

/** Timber louvres (vertical slats) in front of an opening. */
export function louvres(k, mat, x0, x1, y0, y1, { z = 0.16, step = 0.34 } = {}) {
  for (let x = x0 + 0.1; x < x1 - 0.05; x += step) k.add(at(box(0.07, y1 - y0 - 0.16, 0.22, 1.2, 'fklrt'), x, y0 + 0.08, z), mat);
  k.add(at(box(x1 - x0 + 0.1, 0.08, 0.28, 1.2, 'fklrtd'), (x0 + x1) / 2, y0 + 0.02, z), mat);
  k.add(at(box(x1 - x0 + 0.1, 0.08, 0.28, 1.2, 'fklrtd'), (x0 + x1) / 2, y1 - 0.1, z), mat);
}

/** Round or square columns at xs from y0 to y1 (ayvan posts, a colonnade). */
export function columns(k, mat, xs, y0, y1, { r = 0.16, z = 0, square = false, capital = true } = {}) {
  for (const x of xs) {
    k.add(square ? at(box(r * 2, y1 - y0, r * 2, 1.2, 'fklr'), x, y0, z) : at(new THREE.CylinderGeometry(r, r * 1.08, y1 - y0, 12), x, (y0 + y1) / 2, z), mat);
    if (capital) k.add(at(box(r * 3, 0.12, r * 3, 1.2, 'fklrd'), x, y1 - 0.12, z), mat);
  }
}

/**
 * An ayvan: an open loggia from x0 to x1 between floors y0 and y1, `depth` deep, with a timber floor and ceiling,
 * plaster back and side walls, a door with a warm room behind, a railing, posts, a pendant lamp and a planter.
 */
export function loggia(k, { x0, x1, y0, y1, depth = 1.8, posts = true, railing = true, door = true, lamp = true, planter = true, woodMat, wallMat, z = 0 }) {
  const w = x1 - x0, cx = (x0 + x1) / 2, h = y1 - y0;
  const wood = woodMat || k.mat('wood', '#c9a579');
  const wall = wallMat || k.mat('flat', '#e3d7c3', { roughness: 1 });
  k.add(at(rotX(plane(w, depth, 1.2), -Math.PI / 2), cx, y0 + 0.02, z - depth / 2), wood, { cast: false });
  k.add(at(rotX(plane(w, depth, 1.2), Math.PI / 2), cx, y1 - 0.04, z - depth / 2), wood, { cast: false });
  const back = plane(w, h); back.translate(cx, y0 + h / 2, z - depth);
  const sl = plane(depth, h); sl.rotateY(Math.PI / 2); sl.translate(x0, y0 + h / 2, z - depth / 2);
  const sr = plane(depth, h); sr.rotateY(-Math.PI / 2); sr.translate(x1, y0 + h / 2, z - depth / 2);
  k.add(mergeGeometries([back, sl, sr]), wall, { cast: false });
  if (door) {
    const dm = k.interior('flat', Math.round(x0 * 7 + y0 * 3), { day: 0.1, night: 0.9 });
    const dx = x0 + Math.min(1.1, w * 0.3);
    k.add(at(new THREE.PlaneGeometry(0.92, 2.15), dx, y0 + 1.08, z - depth + 0.03), dm, { cast: false });
    const fm = k.mat('metalFlat', '#26262a');
    k.add(at(new THREE.BoxGeometry(1.1, 0.08, 0.1), dx, y0 + 2.2, z - depth + 0.06), fm, { cast: false });
    for (const x of [dx - 0.5, dx + 0.5]) k.add(at(new THREE.BoxGeometry(0.08, 2.25, 0.1), x, y0 + 1.12, z - depth + 0.06), fm, { cast: false });
  }
  if (posts) {
    const xs = [x0 + 0.2, x1 - 0.2];
    for (let x = x0 + 0.2 + 2.4; x < x1 - 1.2; x += 2.4) xs.push(x);
    columns(k, wood, xs, y0, y1, { r: 0.13, z: z - 0.22, square: true, capital: true });
  }
  if (railing) {
    const rm = k.mat('metalFlat', '#26262a');
    k.add(at(box(w - 0.3, 0.06, 0.08, 1.2, 'fklrtd'), cx, y0 + 1.02, z - 0.22), wood);
    for (let x = x0 + 0.35; x < x1 - 0.3; x += 0.16) k.add(at(new THREE.BoxGeometry(0.02, 0.98, 0.02), x, y0 + 0.53, z - 0.22), rm, { cast: false });
  }
  if (lamp) {
    const pm = k.lamp('#ffd9a8', 0, 2.6);
    k.add(at(new THREE.SphereGeometry(0.16, 14, 10), cx + 0.3, y1 - 0.85, z - depth / 2), pm, { cast: false });
    k.add(at(new THREE.CylinderGeometry(0.01, 0.01, 0.7, 6), cx + 0.3, y1 - 0.4, z - depth / 2), k.mat('metalFlat', '#26262a'), { cast: false });
    const pl = new THREE.PointLight('#ffd9a8', 0, 6.5, 1.6);
    pl.position.set(cx + 0.3, y1 - 0.95, z - depth / 2);
    k.light(pl, 0, 5);
  }
  if (planter) {
    k.add(at(box(0.8, 0.5, 0.6, 2, 'fklrt'), x1 - 0.65, y0 + 0.02, z - depth + 0.45), k.mat('flat', '#8a4a2a', { roughness: 0.85, metalness: 0.25 }));
    k.shrub(x1 - 0.65, y0 + 0.48, z - depth + 0.45, 0.4, 0.65, 0.3, Math.round(x1 * 11 + y0 * 5), 32);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// roofs
// ---------------------------------------------------------------------------------------------------------------
/** Flat roof: gravel surface, parapet cap, optional corten planters with shrubs and a pergola. */
export function roof(k, { w, d, y, parapet = 0.5, planters = [], pergola = null, gravel = '#56534e', wallMat }) {
  k.add(at(rotX(new THREE.PlaneGeometry(w - 0.3, d - 0.3), -Math.PI / 2), 0, y, -d / 2), k.mat('flat', gravel, { roughness: 1 }), { cast: false });
  if (parapet > 0) {
    const pm = wallMat || k.mat('plaster', '#e8dcc8');
    facade(k, pm, -w / 2, w / 2, y, y + parapet, [], { tile: 3 });
    shell(k, pm, w, d, y, y + parapet, { tile: 3 });
    // inner face of the parapet so it reads as a wall from above
    const inner = plane(w - 0.3, parapet); inner.rotateY(Math.PI); inner.translate(0, y + parapet / 2, -0.15);
    k.add(inner, k.mat('flat', '#cfc6b6', { roughness: 1 }), { cast: false });
    cornice(k, k.mat('metalFlat', '#26262a'), w, d, y + parapet + 0.04);
  }
  const corten = k.mat('flat', '#8a4a2a', { roughness: 0.85, metalness: 0.25 });
  for (const [px, pz, pw] of planters) {
    k.add(at(box(pw, 0.6, 0.9, 2, 'fklrt'), px, y, pz), corten);
    const n = Math.max(1, Math.round(pw / 1.2));
    for (let i = 0; i < n; i++) k.shrub(px - pw / 2 + pw * (i + 0.5) / n, y + 0.55, pz, 0.55, 0.7, 0.4, Math.round(px * 13 + pz * 7 + i * 31), 30);
  }
  if (pergola) {
    const { x0, x1, z0, z1 } = pergola, pw = k.mat('wood', '#d8b483');
    for (const [px, pz] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) k.add(at(box(0.16, 2.6, 0.16, 1.2, 'fklr'), px, y, pz), pw);
    for (let z = z0 + 0.2; z <= z1 - 0.1; z += 0.42) k.add(at(box(x1 - x0 + 0.6, 0.06, 0.14, 1.2, 'fklrtd'), (x0 + x1) / 2, y + 2.6, z), pw);
    for (const px of [x0, x1]) k.add(at(box(0.12, 0.2, z1 - z0 + 0.4, 1.2, 'fklrt'), px, y + 2.42, (z0 + z1) / 2), pw);
  }
}

/** A stair/lift tower rising above the roof, with a slot window and a cap. */
export function tower(k, mat, { x, z, w = 2.8, d = 3.0, y, h = 2.8 }) {
  k.add(at(box(w, h, d, 3, 'fklrt'), x, y, z), mat);
  k.add(at(new THREE.BoxGeometry(0.5, h * 0.6, 0.06), x, y + h * 0.5, z + d / 2 + 0.03), k.mat('flat', '#2a3036', { roughness: 0.2, metalness: 0.5 }), { cast: false });
  k.add(at(box(w + 0.2, 0.1, d + 0.2, 2, 'fklrt'), x, y + h, z), k.mat('metalFlat', '#26262a'));
}

/** Roof-top vent / tank. */
export function vent(k, x, z, y, { r = 0.3, h = 1.4 } = {}) {
  k.add(at(new THREE.CylinderGeometry(r, r, h, 14), x, y + h / 2, z), k.mat('flat', '#8e8e8a', { roughness: 0.6, metalness: 0.5 }));
}

/** A plinth course along the bottom of the walls. */
export function plinth(k, mat, w, d, { h = 0.28 } = {}) {
  k.add(at(box(w + 0.12, h, d + 0.06, 2, 'fklr'), 0, 0, -d / 2), mat);
}

/** A downpipe at x. */
export function downpipe(k, x, h, { z = 0.12 } = {}) {
  k.add(at(new THREE.CylinderGeometry(0.05, 0.05, h, 10), x, h / 2, z), k.mat('metalFlat', '#26262a'));
}

/** A small name plate by the door. */
export function plate(k, x, y, { z = 0.02 } = {}) {
  k.add(at(new THREE.BoxGeometry(0.3, 0.4, 0.03), x, y, z), k.mat('flat', '#efe7d6', { roughness: 0.4 }), { cast: false });
}

export { rotZ };
