// The street along the lots: pavement, kerb, the aryk (the narrow water channel along the pavement, as in
// Tashkent), the road, the far pavement and the lawn the viewer walks on; lamps, benches, bike racks, planters,
// bollards, parked cars; plane trees in the gaps between buildings, on the lawn and in the yards behind; a soft
// backdrop of blocks in the haze. Facades are at z = 0 facing +z (the road); x runs along the street.
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { plane, box, at, rotY, rotX, mesh, merged, rng, mergeGeometries } from './geo.js';
import { pbr, concrete, darkMetal, grassTexture, windowsTextures } from './materials.js';
import { createChinors, shrub, shrubMaterial } from './vegetation.js';
import { car } from './props.js';

export const Z = { facade: 0, walkEnd: 4.6, aryk: [3.5, 4.0], kerb: 4.6, roadEnd: 12.4, farWalkEnd: 16.4 };
const KERB_TREE_Z = 2.35;   // trees stand on the pavement, just before the aryk

/**
 * lots: [{ x, w, entranceX, trees: [{x, z, k, seed}] }] with x the lot centre and everything in street coordinates.
 * length: the built length of the street (centred on 0); the backdrop extends further.
 */
export function createStreet({ reflector = false, lots = [], length = 160 } = {}) {
  const g = new THREE.Group();
  g.name = 'street';
  const L = length;
  const lights = [], emissives = [];
  const r = rng(17);
  const xMin = lots.length ? Math.min(...lots.map(l => l.x - l.w / 2)) : -10;
  const xMax = lots.length ? Math.max(...lots.map(l => l.x + l.w / 2)) : 10;

  // ---------- ground: the plots behind the pavement and the yards behind the buildings ----------
  const dust = new THREE.MeshStandardMaterial({ color: '#a39b8c', roughness: 1 });
  g.add(mesh(at(rotX(plane(L + 80, 70, 4), -Math.PI / 2), 0, -0.02, -35), dust, { cast: false }));

  // ---------- pavement (pavers), kerb, channel, road, far pavement, lawn ----------
  const pavers = pbr('pavers', { color: '#d9d4c8' });
  const asphalt = pbr('asphalt', { color: '#b7b4ad' });
  const curbMat = concrete('#b9b3a4', 0.8);
  const chanMat = concrete('#8c8a82', 0.75);
  const [a0, a1] = Z.aryk;
  g.add(mesh(at(rotX(plane(L, a0 - Z.facade, 2.4), -Math.PI / 2), 0, 0, (Z.facade + a0) / 2), pavers, { cast: false }));
  g.add(mesh(at(rotX(plane(L, Z.kerb - a1, 2.4), -Math.PI / 2), 0, 0, (a1 + Z.kerb) / 2), pavers, { cast: false }));
  g.add(mesh(at(box(L, 0.14, 0.3, 2, 'fkt'), 0, -0.14, Z.kerb + 0.15), curbMat));
  g.add(mesh(at(rotX(plane(L + 40, Z.roadEnd - Z.kerb, 4), -Math.PI / 2), 0, -0.14, (Z.kerb + Z.roadEnd) / 2), asphalt, { cast: false }));
  g.add(mesh(at(box(L, 0.14, 0.3, 2, 'fkt'), 0, -0.14, Z.roadEnd + 0.15), curbMat));
  g.add(mesh(at(rotX(plane(L, Z.farWalkEnd - Z.roadEnd, 2.4), -Math.PI / 2), 0, 0, (Z.roadEnd + Z.farWalkEnd) / 2), pavers, { cast: false }));
  g.add(mesh(at(box(L, 0.1, 0.22, 2, 'fkt'), 0, -0.02, Z.farWalkEnd + 0.11), curbMat));
  const lawn = new THREE.MeshStandardMaterial({ map: grassTexture(), roughness: 1 });
  g.add(mesh(at(rotX(plane(L + 80, 60, 3), -Math.PI / 2), 0, 0.02, Z.farWalkEnd + 30.2), lawn, { cast: false }));
  g.add(mesh(at(rotX(plane(L, 1.8, 2), -Math.PI / 2), 0, 0.03, Z.farWalkEnd + 2.4), concrete('#b8ad98', 1), { cast: false }));
  // road markings: a dashed centre line
  const dashes = [];
  for (let x = -L / 2; x < L / 2; x += 6) dashes.push(at(rotX(new THREE.PlaneGeometry(3, 0.12), -Math.PI / 2), x, -0.135, (Z.kerb + Z.roadEnd) / 2));
  g.add(merged(dashes, new THREE.MeshStandardMaterial({ color: '#d8d2c2', roughness: 0.9 }), { cast: false }));

  // ---------- the aryk: channel walls, bottom, bridges at the entrances, water ----------
  const depth = 0.32, w = a1 - a0;
  const nearWall = plane(L, depth, 2); nearWall.translate(0, -depth / 2, a0);
  const farWall = plane(L, depth, 2); farWall.rotateY(Math.PI); farWall.translate(0, -depth / 2, a1);
  const bottom = rotX(plane(L, w, 2), -Math.PI / 2); bottom.translate(0, -depth, (a0 + a1) / 2);
  g.add(merged([nearWall, farWall, bottom], chanMat, { cast: false }));
  const bridges = [];
  for (const lot of lots) bridges.push(at(box(2.0, 0.05, w + 0.2, 1, 'fklrt'), lot.entranceX, -0.02, (a0 + a1) / 2));
  for (let i = 0; i < lots.length - 1; i++) bridges.push(at(box(1.4, 0.05, w + 0.2, 1, 'fklrt'), (lots[i].x + lots[i].w / 2 + lots[i + 1].x - lots[i + 1].w / 2) / 2, -0.02, (a0 + a1) / 2));
  if (bridges.length) g.add(merged(bridges, concrete('#aaa497', 0.8)));
  const waterY = -0.1;
  if (reflector) {
    const water = new Reflector(new THREE.PlaneGeometry(L, w - 0.04), { textureWidth: 1024, textureHeight: 256, color: 0x6c7f86, clipBias: 0.003 });
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, waterY, (a0 + a1) / 2);
    g.add(water);
    g.userData.reflector = water;
  } else {
    const waterMat = new THREE.MeshPhysicalMaterial({ color: '#4d6b70', roughness: 0.06, metalness: 0.1, envMapIntensity: 1.6 });
    g.add(mesh(at(rotX(plane(L, w - 0.04, 2), -Math.PI / 2), 0, waterY, (a0 + a1) / 2), waterMat, { cast: false }));
  }

  // ---------- street furniture, merged by material ----------
  const metal = darkMetal('#2a2a2e');
  const wood = pbr('wood', { color: '#c9a77c' });
  const corten = new THREE.MeshStandardMaterial({ color: '#8a4a2a', roughness: 0.85, metalness: 0.25 });
  const lampGlow = new THREE.MeshStandardMaterial({ color: '#fff1d6', emissive: '#ffd9a0', emissiveIntensity: 0, roughness: 0.6 });
  emissives.push({ mat: lampGlow, night: 4.5, day: 0 });
  const bollardGlow = new THREE.MeshStandardMaterial({ color: '#f3e7cf', emissive: '#ffd6a0', emissiveIntensity: 0, roughness: 0.5 });
  emissives.push({ mat: bollardGlow, night: 3, day: 0 });
  const metalG = [], glowG = [], woodG = [], cortenG = [], shrubs = [], hoopG = [];

  const lampAt = (x, z, dir, spot) => {
    metalG.push(at(new THREE.CylinderGeometry(0.06, 0.09, 4.6, 10), x, 2.3, z), at(new THREE.CylinderGeometry(0.16, 0.18, 0.08, 12), x, 0.04, z),
      at(new THREE.BoxGeometry(0.07, 0.07, 1.6), x, 4.55, z + dir * 0.8), at(new THREE.BoxGeometry(0.42, 0.07, 0.9), x, 4.52, z + dir * 1.6));
    glowG.push(at(new THREE.BoxGeometry(0.34, 0.015, 0.8), x, 4.48, z + dir * 1.6));
    if (!spot) return;
    const s = new THREE.SpotLight('#ffd3a0', 0, 15, 0.8, 0.6, 1.2);
    s.position.set(x, 4.4, z + dir * 1.6);
    s.target.position.set(x, 0, z + dir * 2.0);
    s.castShadow = false;
    g.add(s, s.target);
    lights.push({ light: s, night: 90, day: 0 });
  };
  const benchAt = (x, z) => {
    for (let i = 0; i < 4; i++) woodG.push(at(box(1.9, 0.045, 0.1, 1.2, 'fklrt'), x, 0.42, z - 0.21 + i * 0.14));
    for (let i = 0; i < 3; i++) woodG.push(at(rotX(box(1.9, 0.045, 0.1, 1.2, 'fklrtd'), -1.25), x, 0.6 + i * 0.13, z + 0.3 + i * 0.045));
    for (const dx of [-0.8, 0.8]) metalG.push(at(new THREE.BoxGeometry(0.05, 0.42, 0.6), x + dx, 0.21, z), at(rotX(new THREE.BoxGeometry(0.05, 0.5, 0.05), -1.25), x + dx, 0.62, z + 0.33));
  };
  const rackAt = (x, z) => { for (let i = 0; i < 3; i++) hoopG.push(at(rotY(new THREE.TorusGeometry(0.38, 0.03, 8, 20, Math.PI), Math.PI / 2), x + i * 0.9, 0.45, z)); };
  const planterAt = (x, z, w2 = 1.2) => {
    cortenG.push(at(box(w2, 0.55, 0.6, 2, 'fklrt'), x, 0, z));
    shrubs.push(shrub(x, 0.5, z, w2 * 0.5, 0.55, 0.34, Math.round(x * 13 + z * 7) & 0xffff, 40));
  };
  const bollardsAt = (xs, z) => { for (const bx of xs) { metalG.push(at(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 10), bx, 0.4, z)); glowG.push(at(new THREE.CylinderGeometry(0.075, 0.075, 0.08, 10), bx, 0.78, z)); } };

  // lamps every 13 m, alternating sides; the near-side ones carry a real light
  let li = 0;
  for (let x = -L / 2 + 6.5; x < L / 2; x += 13, li++) {
    if (li % 2 === 0) lampAt(x, Z.kerb - 0.45, -1, true); else lampAt(x, Z.roadEnd + 0.45, 1, false);
  }
  // per lot: bollards by the entrance and a different set of furniture each
  lots.forEach((lot, i) => {
    const e = lot.entranceX;
    bollardsAt([e - 1.4, e + 1.4], 2.9);
    switch (i % 3) {
      case 0: benchAt(e + 3.6, 1.0); planterAt(e + 2.0, 0.55); planterAt(e + 5.2, 0.55); break;
      case 1: rackAt(e - 4.2, 2.2); planterAt(e + 2.4, 0.55, 1.6); break;
      default: planterAt(e - 2.4, 0.55); planterAt(e + 2.4, 0.55); benchAt(e - 4.6, 1.0);
    }
  });
  // the gaps between lots: a paved passage with a hedge across it, a chinor behind, a parked car at the kerb
  const trees = [];
  const gapPavers = [];
  const carsG = new THREE.Group();
  for (let i = 0; i < lots.length - 1; i++) {
    const gx0 = lots[i].x + lots[i].w / 2, gx1 = lots[i + 1].x - lots[i + 1].w / 2, gx = (gx0 + gx1) / 2, gw = gx1 - gx0;
    gapPavers.push(at(rotX(plane(gw, 4, 2.4), -Math.PI / 2), gx, 0.005, -2));
    for (let x = gx0 + 0.6; x < gx1 - 0.4; x += 0.9) shrubs.push(shrub(x, 0.0, -4.0 + (r() - 0.5) * 0.3, 0.6 + r() * 0.2, 0.9 + r() * 0.3, 0.5, Math.round(x * 31) & 0xffff, 30));
    trees.push({ x: gx + (r() - 0.5) * 1.5, z: -7 - r() * 3, k: 1.0 + r() * 0.2, seed: 20 + i });
    trees.push({ x: gx, z: KERB_TREE_Z, k: 0.9 + r() * 0.15, seed: 2 + i });
    if (i % 2 === 0) { const c = car(i % 4 === 0 ? '#e9e5dc' : '#3a3d44'); c.position.set(gx + 3.5, -0.14, Z.kerb + 1.35); c.rotation.y = i % 4 === 0 ? 0 : Math.PI; carsG.add(c); }
  }
  // one more car at each end
  const cEnd = car('#b8b5ae'); cEnd.position.set(xMin - 5, -0.14, Z.kerb + 1.35); carsG.add(cEnd);
  g.add(carsG);
  if (gapPavers.length) g.add(merged(gapPavers, pavers, { cast: false }));
  // trees along the near kerb at the ends, on the lawn behind the viewer, and in the yards behind the buildings
  trees.push({ x: xMin - 6, z: KERB_TREE_Z, k: 1.05, seed: 8 }, { x: xMax + 6, z: KERB_TREE_Z, k: 1.0, seed: 9 });
  for (let x = -L / 2 + 8; x < L / 2 - 4; x += 11 + r() * 4) trees.push({ x, z: Z.farWalkEnd + 6.5 + r() * 2, k: 1.0 + r() * 0.25, seed: Math.round(x * 3) & 0xff });
  for (let x = xMin + 4; x < xMax; x += 12 + r() * 6) trees.push({ x, z: -21 - r() * 4, k: 1.15 + r() * 0.2, seed: Math.round(x * 5) & 0xff });
  for (const lot of lots) for (const t of lot.trees || []) trees.push({ ...t, x: lot.x + t.x });
  // a loose hedge along the lawn path
  for (let x = -L / 2 + 4; x < L / 2 - 4; x += 1.6 + r() * 0.8) shrubs.push(shrub(x, 0.02, Z.farWalkEnd + 4.0 + (r() - 0.5) * 0.4, 0.7 + r() * 0.3, 0.7 + r() * 0.4, 0.6, Math.round(x * 31) & 0xffff, 30));

  g.add(merged(metalG, metal));
  g.add(merged(glowG, lampGlow, { cast: false }));
  if (woodG.length) g.add(merged(woodG, wood));
  if (cortenG.length) g.add(merged(cortenG, corten));
  if (hoopG.length) g.add(merged(hoopG, darkMetal('#4a4a50')));
  g.add(mesh(mergeGeometries(shrubs), shrubMaterial()));
  for (const s of shrubs) s.dispose();
  // bollard tops glow with the lamps (same material family, separate so the day value differs)
  g.add(createChinors(trees));
  const soil = new THREE.MeshStandardMaterial({ color: '#4a3d30', roughness: 1 });
  const pits = [], grates = [];
  for (const t of trees) {
    if (Math.abs(t.z - KERB_TREE_Z) > 0.01) continue;
    pits.push(at(rotX(new THREE.PlaneGeometry(1.5, 1.5), -Math.PI / 2), t.x, 0.004, t.z));
    grates.push(at(rotX(new THREE.RingGeometry(0.32, 0.72, 24), -Math.PI / 2), t.x, 0.008, t.z));
  }
  if (pits.length) { g.add(merged(pits, soil, { cast: false })); g.add(merged(grates, darkMetal('#3a3a3e'), { cast: false })); }

  // ---------- the blocks behind and the street continuing at both ends ----------
  g.add(createBackdrop(emissives, L, xMin, xMax));

  return { group: g, lights, emissives, xMin, xMax };
}

function createBackdrop(emissives, L, xMin, xMax) {
  const g = new THREE.Group();
  g.name = 'backdrop';
  const FH = 3.2;
  const r = rng(5);
  const specs = [];
  // the next block behind, a row of volumes in the haze
  for (let x = -L / 2 - 10; x < L / 2 + 10; x += 20 + r() * 6) specs.push([x, -58 - r() * 8, 14 + r() * 8, 12 + r() * 6, 3 + Math.floor(r() * 3)]);
  // the same street further along, lower houses beyond the last lot either side
  for (let x = xMin - 16; x > -L / 2 - 20; x -= 16 + r() * 4) specs.push([x, -8 - r() * 2, 12 + r() * 4, 12, 2 + Math.floor(r() * 2)]);
  for (let x = xMax + 16; x < L / 2 + 20; x += 16 + r() * 4) specs.push([x, -8 - r() * 2, 12 + r() * 4, 12, 2 + Math.floor(r() * 2)]);
  const tones = ['#dbd1c0', '#d0c3b2', '#c9bdae'];
  const mats = tones.map((tone, i) => {
    const { map, emissiveMap } = windowsTextures(i + 1, tone);
    const m = new THREE.MeshStandardMaterial({ map, emissiveMap, emissive: '#ffe2b8', emissiveIntensity: 0, roughness: 0.9 });
    emissives.push({ mat: m, night: 0.95, day: 0 });
    return m;
  });
  const walls = tones.map(() => []), roofs = [];
  specs.forEach(([x, z, w, d, floors], i) => {
    const h = floors * FH + 0.6;
    walls[i % 3].push(at(box(w, h, d, FH * 4, 'fklr'), x, 0, z));
    roofs.push(at(box(w + 0.3, 0.3, d + 0.3, 2, 'fklrt'), x, h, z));
  });
  walls.forEach((ws, i) => { if (ws.length) g.add(merged(ws, mats[i])); });
  g.add(merged(roofs, new THREE.MeshStandardMaterial({ color: '#6b665f', roughness: 1 })));
  return g;
}
