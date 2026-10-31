// Geometry helpers: planes and boxes whose UVs are in metres (so one texture tile covers `tile` metres on
// every face, whatever the size of the piece), plus a few small conveniences.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export { mergeGeometries };

export function scaleUV(g, sx, sy, ox = 0, oy = 0) {
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx + ox, uv.getY(i) * sy + oy);
  return g;
}

/** A plane w × h facing +Z, UVs in metres: one tile = `tile` m. */
export function plane(w, h, tile = 2, ox = 0, oy = 0) {
  return scaleUV(new THREE.PlaneGeometry(w, h), w / tile, h / tile, ox, oy);
}

/**
 * Recompute UVs from the geometry's (already placed) positions so that neighbouring pieces of one wall share
 * brick courses: u from the axis along the wall ('x' or 'z'), v from y. tile = metres per texture tile.
 */
export function projectUV(g, axis, tile = 2) {
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const u = axis === 'x' ? pos.getX(i) : pos.getZ(i);
    uv.setXY(i, u / tile, pos.getY(i) / tile);
  }
  return g;
}

/**
 * A box w × h × d with its bottom at y = 0, centred on x/z, UVs in metres on every face.
 * `faces`: which faces to build (default all). Skipping hidden faces saves triangles.
 */
export function box(w, h, d, tile = 2, faces = 'fklrt') {
  // faces: f front (+z), k back, l left, r right, t top, d bottom
  const parts = [];
  const add = (g, rx, ry, x, y, z) => { if (rx) g.rotateX(rx); if (ry) g.rotateY(ry); g.translate(x, y, z); parts.push(g); };
  if (faces.includes('f')) add(plane(w, h, tile), 0, 0, 0, h / 2, d / 2);
  if (faces.includes('k')) add(plane(w, h, tile), 0, Math.PI, 0, h / 2, -d / 2);
  if (faces.includes('r')) add(plane(d, h, tile), 0, Math.PI / 2, w / 2, h / 2, 0);
  if (faces.includes('l')) add(plane(d, h, tile), 0, -Math.PI / 2, -w / 2, h / 2, 0);
  if (faces.includes('t')) add(plane(w, d, tile), -Math.PI / 2, 0, 0, h, 0);
  if (faces.includes('d')) add(plane(w, d, tile), Math.PI / 2, 0, 0, 0, 0);
  const g = mergeGeometries(parts);
  for (const p of parts) p.dispose();
  return g;
}

/** Translate a geometry in place and return it (for chaining in merges). */
export function at(g, x, y, z) { g.translate(x, y, z); return g; }
export function rotY(g, a) { g.rotateY(a); return g; }
export function rotX(g, a) { g.rotateX(a); return g; }
export function rotZ(g, a) { g.rotateZ(a); return g; }

export function mesh(geometry, material, { cast = true, receive = true, name = '' } = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = cast;
  m.receiveShadow = receive;
  if (name) m.name = name;
  return m;
}

/** Merge several geometries that share one material into one mesh. */
export function merged(geos, material, opts) {
  const g = mergeGeometries(geos);
  for (const p of geos) p.dispose();
  return mesh(g, material, opts);
}

/** Deterministic random in [0, 1). */
export function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
