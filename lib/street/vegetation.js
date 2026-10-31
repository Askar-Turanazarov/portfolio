// Vegetation: plane trees (chinor) and shrubs built from leaf cards. Card normals point away from the crown
// centre and a per-vertex brightness darkens the inside and the underside, so a crown is lit as one soft volume
// instead of a heap of flat squares.
import * as THREE from 'three';
import { mesh, rng, mergeGeometries } from './geo.js';
import { chinorBarkTexture, chinorLeafTexture, shrubLeafTexture } from './materials.js';

let _leaf = null, _shrub = null, _bark = null;
export function leafMaterial() {
  if (!_leaf) _leaf = new THREE.MeshStandardMaterial({ map: chinorLeafTexture(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85, vertexColors: true });
  return _leaf;
}
export function shrubMaterial() {
  if (!_shrub) _shrub = new THREE.MeshStandardMaterial({ map: shrubLeafTexture(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.9, vertexColors: true });
  return _shrub;
}
function barkMaterial() {
  if (!_bark) { const t = chinorBarkTexture(); t.repeat.set(1, 2); _bark = new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, color: '#d2cdbe' }); }
  return _bark;
}

const _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _n = new THREE.Vector3(), _e = new THREE.Euler();
const UP = new THREE.Vector3(0, 1, 0), FWD = new THREE.Vector3(0, 0, 1);

/**
 * `n` leaf cards inside the ellipsoid (centre C, radii R), biased towards its shell. Normals and brightness are
 * taken relative to `shadeC`/`shadeR` (the whole crown), so clusters at bough tips shade as part of one crown.
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
    const pos = cg.attributes.position, nor = cg.attributes.normal;
    const col = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) {
      _n.set((pos.getX(k) - shadeC.x) / shadeR.x, (pos.getY(k) - shadeC.y) / shadeR.y + 0.35, (pos.getZ(k) - shadeC.z) / shadeR.z);
      const d = Math.min(1.3, _n.length());
      _n.normalize();
      nor.setXYZ(k, _n.x, _n.y, _n.z);
      const hgt = (pos.getY(k) - shadeC.y) / shadeR.y;
      const b = 0.6 + 0.3 * d + 0.18 * hgt;
      col[k * 3] = b; col[k * 3 + 1] = b; col[k * 3 + 2] = b;
    }
    cg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    cards.push(cg);
  }
  const g = mergeGeometries(cards);
  for (const c of cards) c.dispose();
  return g;
}

/** A low shrub standing on y, footprint rx × rz, height ry. Returns a geometry for shrubMaterial(). */
export function shrub(x, y, z, rx, ry, rz, seed, n = 44) {
  const r = rng(seed);
  const C = new THREE.Vector3(x, y + ry * 0.45, z), R = new THREE.Vector3(rx, ry * 0.6, rz);
  return cardCloud(C, R, n, rx * 0.5, rx * 0.85, r, new THREE.Vector3(x, y + ry * 0.2, z), new THREE.Vector3(rx, ry, rz), 0.4);
}

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
 * All trees of the list are baked into two meshes (bark, leaves), whatever their number.
 */
export function createChinors(list) {
  const group = new THREE.Group();
  group.name = 'chinors';
  const barkMat = barkMaterial(), leafMat = leafMaterial();
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
      clusters.push({ C: tip.clone().addScaledVector(d2, -len2 * 0.25), R: new THREE.Vector3(2.0, 1.5, 2.0), n: 46 });
      clusters.push({ C: tip3.clone().addScaledVector(d3, -len3 * 0.2), R: new THREE.Vector3(1.3, 1.0, 1.3), n: 20 });
    }
    const bark = mergeGeometries(parts);
    for (const p of parts) p.dispose();

    const centre = new THREE.Vector3(top.x, H + 2.3, top.z), CR = new THREE.Vector3(3.9, 2.6, 3.9);
    const geos = [cardCloud(centre, new THREE.Vector3(3.3, 2.1, 3.3), 150, 0.8, 1.3, r, centre, CR, 0.5)];
    for (const c of clusters) geos.push(cardCloud(c.C, c.R, c.n, 0.7, 1.2, r, centre, CR, 0.4));
    const leaves = mergeGeometries(geos);
    for (const gg of geos) gg.dispose();

    // bake the tree's placement into both geometries
    M.compose(P.set(t.x, t.y || 0, t.z), Q.setFromAxisAngle(UP, r() * Math.PI * 2), S.setScalar(t.k || 1));
    bark.applyMatrix4(M); leaves.applyMatrix4(M);
    barks.push(bark); crowns.push(leaves);
  }
  if (barks.length) {
    group.add(mesh(mergeGeometries(barks), barkMat), mesh(mergeGeometries(crowns), leafMat));
    for (const g of barks) g.dispose();
    for (const g of crowns) g.dispose();
  }
  return group;
}
