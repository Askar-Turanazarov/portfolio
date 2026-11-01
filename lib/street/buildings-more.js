// The other buildings along the street: from the stall of the very first clicker to the furniture workshop and the
// FlightDelay control tower. Each is assembled from the same kit as the flagships and follows the same grammar (facade at
// z = 0 facing the road, plinth, lit interiors, a sign in the project's colour), but every trade gets its own face:
// a museum with an aeroplane on the roof, a round pavilion with a black sphere, a bank behind a colonnade...
import * as THREE from 'three';
import { box, at, rotX, rotY, rotZ } from './geo.js';
import { canvasTexture } from './materials.js';
import * as K from './kit.js';

const GRAPHITE = '#26262a';

// ---------------------------------------------------------------------------------------------------------------
// small helpers shared by several buildings
// ---------------------------------------------------------------------------------------------------------------
/** A wall lantern: a warm sphere on a short bracket and a point light under it. */
function lantern(k, x, y, z = 0.25, { night = 2.8, reach = 6 } = {}) {
  k.add(at(new THREE.BoxGeometry(0.06, 0.06, z + 0.1), x, y + 0.12, z / 2), k.mat('metalFlat', GRAPHITE), { cast: false });
  k.add(at(new THREE.SphereGeometry(0.15, 14, 10), x, y, z), k.lamp('#ffd9a8', 0, night), { cast: false });
  const pl = new THREE.PointLight('#ffd9a8', 0, reach, 1.6);
  pl.position.set(x, y - 0.1, z + 0.2);
  k.light(pl, 0, 4);
}

/** A string of bulbs between (x0, y0) and (x1, y1), sagging a little. */
function bulbs(k, x0, x1, y, z, n, { sag = 0.3, night = 3.0 } = {}) {
  const m = k.lamp('#ffe2b0', 0, night);
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    k.add(at(new THREE.SphereGeometry(0.055, 8, 6), x0 + (x1 - x0) * t, y - Math.sin(t * Math.PI) * sag, z), m, { cast: false });
  }
  k.add(at(new THREE.BoxGeometry(x1 - x0, 0.012, 0.012), (x0 + x1) / 2, y + 0.04, z), k.mat('metalFlat', GRAPHITE), { cast: false });
}

/** A cork notice board with pinned notes, for the tutors' kiosk. */
function noticeTexture(accent, seed = 1) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return canvasTexture(768, 480, (g, w, h) => {
    g.fillStyle = '#b98a5c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${60 + r() * 60 | 0},${30 + r() * 40 | 0},${10 + r() * 20 | 0},${0.08 + r() * 0.12})`; g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); }
    const papers = ['#fbf7ee', '#fff1a8', '#ffffff', '#fde2ec', '#eaf4ff', '#fbf7ee', '#fff1a8', '#ffffff'];
    for (let i = 0; i < 9; i++) {
      const pw = 120 + r() * 60, ph = 120 + r() * 70, x = 30 + (i % 3) * 240 + r() * 40, y = 30 + Math.floor(i / 3) * 140 + r() * 30;
      g.save(); g.translate(x + pw / 2, y + ph / 2); g.rotate((r() - 0.5) * 0.18);
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(-pw / 2 + 4, -ph / 2 + 6, pw, ph);
      g.fillStyle = papers[i % papers.length]; g.fillRect(-pw / 2, -ph / 2, pw, ph);
      g.fillStyle = i % 4 === 0 ? accent : '#2a2a2e'; g.fillRect(-pw / 2 + 14, -ph / 2 + 18, pw * 0.6, 9);
      g.fillStyle = 'rgba(40,40,45,0.55)'; for (let l = 0; l < 4; l++) g.fillRect(-pw / 2 + 14, -ph / 2 + 40 + l * 16, pw * (0.5 + r() * 0.35), 5);
      g.fillStyle = accent; g.beginPath(); g.arc(0, -ph / 2 + 8, 7, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    g.strokeStyle = '#5a3d22'; g.lineWidth = 18; g.strokeRect(9, 9, w - 18, h - 18);
  });
}

// ---------------------------------------------------------------------------------------------------------------
// 1. Clicker — the first project: a timber stall with a counter, a yellow awning, a string of bulbs, a fin sign
// ---------------------------------------------------------------------------------------------------------------
export function createClicker(spec) {
  const k = K.createKit({ ...spec, seed: 101 });
  const W = 5, D = 5, H = 3.7, PAR = 0.25, yTop = H + PAR;
  const plaster = k.mat('plaster', '#f3e6c9'), wood = k.mat('wood', '#a9733f'), graphite = k.mat('metalFlat', GRAPHITE);
  K.plinth(k, k.mat('concrete', '#7a7066', { roughness: 0.85 }), W, D, { h: 0.22 });
  const counter = { x0: -1.9, x1: 1.4, y0: 1.05, y1: 2.9 };
  K.facade(k, plaster, -W / 2, W / 2, 0, H, [counter], { tile: 3 });
  K.shell(k, plaster, W, D, 0, H, { tile: 3 });
  K.shopfront(k, counter, { interior: k.interior('arcade', 3, { day: 0.55, night: 1.5 }), interiorZ: -1.3, base: 0, frame: wood });
  k.add(at(box(counter.x1 - counter.x0 + 0.5, 0.1, 0.6, 1.2, 'fklrtd'), (counter.x0 + counter.x1) / 2, counter.y0 - 0.1, 0.1), wood);   // the counter top
  for (const x of [-W / 2 + 0.15, W / 2 - 0.15]) k.add(at(box(0.3, H, 0.3, 1.2, 'fklr'), x, 0, 0.0), wood);                           // timber corner posts
  K.awning(k, { x0: counter.x0 - 0.3, x1: counter.x1 + 0.3, y: counter.y1 + 0.2, depth: 1.3, drop: 0.5, colors: [spec.accent, '#fbf4e0'] });
  bulbs(k, -W / 2 + 0.3, W / 2 - 0.3, H + 0.02, 0.5, 9, { sag: 0.2 });
  K.sign(k, 'CLICKER', '', { cx: -0.3, cy: H - 0.3, z: 0.08, w: 2.6, h: 0.5, night: 2.4 });
  K.finSign(k, 'CLICKER', { x: W / 2 + 0.22, y0: 1.3, y1: H - 0.1, z: 0.1, w: 0.7 });
  k.add(at(box(W + 0.3, 0.12, D + 0.3, 2, 'fklrtd'), 0, H, -D / 2 + 0.1), graphite);                                                   // thin roof edge
  K.roof(k, { w: W, d: D, y: H + 0.12, parapet: 0, planters: [[-1.0, -3.6, 1.6]], gravel: '#5a5751' });
  k.add(at(new THREE.BoxGeometry(0.45, 0.35, 0.45), 1.5, H + 0.3, -3.5), graphite);
  K.plate(k, counter.x1 + 0.55, 1.7);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 2. TravelTracker — a travel agency: a green plaster shopfront with the world map inside, a globe on the roof
// ---------------------------------------------------------------------------------------------------------------
export function createTravelTracker(spec) {
  const k = K.createKit({ ...spec, seed: 103 });
  const W = 9, D = 9, H1 = 4.2, H2 = 3.1, PAR = 0.5, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const plaster = k.mat('plaster', '#dfe6d2'), frame = k.mat('flat', '#1f5a3a', { roughness: 0.45, metalness: 0.4 });
  K.plinth(k, k.mat('concrete', '#6f7a6a', { roughness: 0.85 }), W, D);
  const shop = { x0: -3.9, x1: 1.0, y0: 0.5, y1: 3.5 }, door = { x0: 1.8, x1: 3.6, y0: 0, y1: 3.1 };
  K.facade(k, plaster, -W / 2, W / 2, 0, H1, [shop, door], { tile: 3 });
  K.shell(k, plaster, W, D, 0, H1, { tile: 3 });
  K.shopfront(k, shop, { interior: k.interior('map', 5, { day: 0.5, night: 1.4 }), interiorZ: -1.8, base: 0.5, frame });
  K.glassDoor(k, door, { interior: k.interior('map', 6, { day: 0.4, night: 1.2 }), interiorZ: -2.4, frame, floorMat: k.mat('flat', '#7a6f60', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 0.4, x1: door.x1 + 0.4, y: door.y1 + 0.35, depth: 1.5, topColor: '#1f5a3a', rods: false });
  K.sign(k, 'TRAVELTRACKER', 'SAYOHATLAR  ·  XARITA', { cx: -1.4, cy: H1 - 0.35, z: 0.08, w: 5.2, h: 0.62, night: 2.4 });
  k.add(at(new THREE.BoxGeometry(5.6, 0.04, 0.06), -1.4, H1 - 0.02, 0.08), k.lamp(spec.accent, 0.3, 2.4), { cast: false });
  const wins = K.punched(k, [-2.8, 0, 2.8], 1.5, yUp + 0.8, yUp + 2.5, { depth: 0.3, interior: k.interior('flat', 7), glassMat: k.mat('glass', '#9fb3b0'), sillMat: k.mat('concrete', '#cfd4c6', { roughness: 0.7 }) });
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, wins, { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-2.6, -1.0, 2.6]], gravel: '#5a5751' });
  // the globe: a blue sphere on a pedestal with a brass meridian, glowing faintly in the evening
  const gx = 2.2, gz = -2.6, gy = yRoof + 0.9;
  k.add(at(new THREE.CylinderGeometry(0.35, 0.5, 0.9, 16), gx, yRoof + 0.45, gz), k.mat('flat', '#3a3a40', { roughness: 0.5, metalness: 0.5 }));
  const globeMat = k.glow(new THREE.MeshStandardMaterial({ color: '#2f6ea8', emissive: '#4f8fd0', emissiveIntensity: 0, roughness: 0.45 }), 0, 0.35);
  k.add(at(new THREE.SphereGeometry(1.05, 28, 20), gx, gy + 1.15, gz), globeMat);
  const brass = k.mat('flat', '#c9a24a', { roughness: 0.35, metalness: 0.8 });
  k.add(at(rotZ(new THREE.TorusGeometry(1.14, 0.035, 8, 48), 0.4), gx, gy + 1.15, gz), brass, { cast: false });
  k.add(at(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 8), gx, gy + 1.15, gz), brass, { cast: false });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.4, 2.0);
  return k.build({ w: W, d: D, h: yTop + 2.8 });
}

// ---------------------------------------------------------------------------------------------------------------
// 3. FinTrack — a modest two-floor brick house: a dark door with a plaque, a lantern, two tall windows
// ---------------------------------------------------------------------------------------------------------------
export function createFinTrack(spec) {
  const k = K.createKit({ ...spec, seed: 107 });
  const W = 8, D = 9, H1 = 3.9, H2 = 3.2, PAR = 0.5, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const brick = k.mat('brick', '#b7a08d'), brickDark = k.mat('brick', '#7d665b'), stone = k.mat('concrete', '#d9d4ca', { roughness: 0.7 });
  K.plinth(k, k.mat('concrete', '#5e5a55', { roughness: 0.85 }), W, D);
  const door = { x0: 1.6, x1: 3.0, y0: 0, y1: 2.9 };
  const wins = K.punched(k, [-2.5, -0.3], 1.5, 0.9, 3.3, { depth: 0.3, interior: k.interior('office', 8, { day: 0.35, night: 1.4 }), glassMat: k.mat('glass', '#9fb3b0'), sillMat: stone });
  K.facade(k, brick, -W / 2, W / 2, 0, H1, [...wins, door], { tile: 1.5 });
  K.shell(k, brick, W, D, 0, H1, { tile: 1.5 });
  K.lintels(k, brickDark, [...wins, door]);
  // a dark timber door in a stone surround
  k.add(at(box(door.x1 - door.x0 + 0.5, door.y1 + 0.25, 0.14, 1.5, 'fklrt'), (door.x0 + door.x1) / 2, 0, 0.0), stone);
  K.reveals(k, k.mat('flat', '#2d2b29', { roughness: 0.7 }), door, 0.3);
  k.add(at(new THREE.PlaneGeometry(door.x1 - door.x0 - 0.1, door.y1 - 0.1), (door.x0 + door.x1) / 2, door.y1 / 2, -0.28), k.mat('flat', '#2b2f45', { roughness: 0.55 }), { cast: false });
  k.add(at(new THREE.BoxGeometry(0.05, 0.9, 0.06), (door.x0 + door.x1) / 2 + 0.35, 1.1, -0.22), k.mat('flat', '#c9a24a', { roughness: 0.35, metalness: 0.8 }), { cast: false });
  K.plate(k, door.x1 + 0.6, 1.9);
  lantern(k, door.x0 - 0.6, 2.6);
  K.sign(k, 'FINTRACK', '', { cx: -1.4, cy: yUp + 0.32, z: 0.08, w: 3.2, h: 0.5, night: 2.2 });
  const wins2 = K.punched(k, [-2.5, 0, 2.5], 1.4, yUp + 0.8, yUp + 2.5, { depth: 0.3, interior: k.interior('flat', 9), glassMat: k.mat('glass', '#9fb3b0'), sillMat: stone });
  K.facade(k, brick, -W / 2, W / 2, yUp, yRoof, wins2, { tile: 1.5 });
  K.shell(k, brick, W, D, yUp, yRoof, { tile: 1.5 });
  K.lintels(k, brickDark, wins2);
  k.add(at(box(W + 0.1, 0.16, 0.12, 1.5, 'flrtd'), 0, yUp - 0.08, 0.02), brickDark);   // a string course at the floor line
  K.roof(k, { w: W, d: D, y: yRoof, parapet: PAR, wallMat: brick, planters: [[-1.5, -1.0, 2.6]] });
  K.vent(k, 2.4, -6.5, yRoof, { r: 0.25, h: 1.1 });
  K.downpipe(k, W / 2 - 0.25, yRoof);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 4. Wings of History — the aviation museum: a tall concrete hall with a glazed front and an aeroplane on the roof
// ---------------------------------------------------------------------------------------------------------------
export function createWings(spec) {
  const k = K.createKit({ ...spec, seed: 109 });
  const W = 16, D = 14, H = 7.4, PAR = 0.45, yRoof = H, yPar = H + PAR;
  const panel = k.mat('concrete', '#d4d1c9', { roughness: 0.8 }), dark = k.mat('concrete', '#8e8f8c', { roughness: 0.8 });
  const frame = k.mat('metalFlat', '#2f3338'), glassMat = k.mat('glass', '#a9c2cc');
  K.plinth(k, k.mat('concrete', '#5a5c5a', { roughness: 0.85 }), W, D, { h: 0.35 });
  const door = { x0: -1.4, x1: 1.4, y0: 0, y1: 3.4 };
  const gl = { x0: -7.0, x1: -1.8, y0: 0.6, y1: 6.4 }, gr = { x0: 1.8, x1: 7.0, y0: 0.6, y1: 6.4 }, gm = { x0: -1.4, x1: 1.4, y0: 3.9, y1: 6.4 };
  K.facade(k, panel, -W / 2, W / 2, 0, yPar, [door, gl, gr, gm], { tile: 3 });
  K.shell(k, panel, W, D, 0, yPar, { tile: 3 });
  // horizontal joints between concrete panels
  for (const y of [2.6, 5.0]) k.add(at(new THREE.BoxGeometry(W, 0.05, 0.03), 0, y, 0.015), dark, { cast: false });
  const museum = k.interior('museum', 10, { day: 0.45, night: 1.3 });
  for (const o of [gl, gr]) K.window(k, o, { depth: 0.35, step: 2.0, transom: 3.5, frame, glassMat, interior: museum, interiorZ: -2.6, sill: false });
  K.window(k, gm, { depth: 0.35, step: 99, frame, glassMat, interior: museum, interiorZ: -2.6, sill: false });
  K.glassDoor(k, door, { interior: k.interior('museum', 11, { day: 0.45, night: 1.2 }), interiorZ: -3.0, frame, floorMat: k.mat('flat', '#a39d92', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 1.2, x1: door.x1 + 1.2, y: door.y1 + 0.3, depth: 2.6, topColor: '#2f3338' });
  K.sign(k, 'WINGS OF HISTORY', 'AVIATSIYA MUZEYI  ·  TOSHKENT', { cx: -4.4, cy: 6.9, z: 0.06, w: 5.4, h: 0.62, night: 2.4 });
  K.ledStrip(k, -W / 2 + 0.3, W / 2 - 0.3, yPar - 0.06, 0.08, { night: 2.2 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yPar, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, gravel: '#6a6c68' });
  // the aeroplane: a light-metal fuselage along the street on two pylons, wings, tail, two engines, accent cheat-line
  const metal = k.mat('flat', '#dde1e6', { roughness: 0.3, metalness: 0.75 }), accentMat = k.mat('flat', spec.accent, { roughness: 0.4, metalness: 0.3 });
  const px = -0.5, pz = -7.0, yF = yRoof + 2.5;   // fuselage axis
  for (const dx of [-2.2, 2.4]) k.add(at(box(0.32, yF - 0.5 - yRoof, 0.5, 1, 'fklr'), px + dx, yRoof, pz), k.mat('flat', '#3a3d42', { roughness: 0.5, metalness: 0.6 }));
  k.add(at(rotZ(new THREE.CylinderGeometry(0.58, 0.58, 8.6, 20), Math.PI / 2), px, yF, pz), metal);
  k.add(at(rotZ(new THREE.ConeGeometry(0.58, 1.8, 20), -Math.PI / 2), px + 4.3 + 0.9, yF, pz), metal);
  k.add(at(rotZ(new THREE.ConeGeometry(0.58, 2.6, 20), Math.PI / 2), px - 4.3 - 1.3, yF + 0.08, pz), metal);
  k.add(at(rotZ(new THREE.TorusGeometry(0.6, 0.035, 8, 40), Math.PI / 2), px + 2.0, yF, pz), accentMat, { cast: false });
  k.add(at(rotZ(new THREE.TorusGeometry(0.6, 0.035, 8, 40), Math.PI / 2), px - 2.8, yF, pz), accentMat, { cast: false });
  k.add(at(box(1.9, 0.16, 11.5, 1, 'fklrtd'), px + 0.4, yF - 0.45, pz), metal);                          // wings, spanning across the street direction
  k.add(at(box(1.3, 0.1, 4.6, 1, 'fklrtd'), px - 4.6, yF + 0.1, pz), metal);                            // tail plane
  k.add(at(box(1.6, 2.0, 0.12, 1, 'fklrt'), px - 4.8, yF + 0.3, pz), accentMat);                         // fin in the project's colour
  for (const dz of [-2.8, 2.8]) k.add(at(rotZ(new THREE.CylinderGeometry(0.34, 0.3, 1.5, 16), Math.PI / 2), px + 0.9, yF - 0.95, pz + dz), k.mat('flat', '#9aa0a8', { roughness: 0.35, metalness: 0.8 }));
  // a floodlight on the roof washing the aeroplane in the evening
  const spot = new THREE.SpotLight('#ffe6c4', 0, 14, 0.7, 0.5, 1.2);
  spot.position.set(px + 5, yRoof + 0.4, pz + 4.5); spot.target.position.set(px, yF, pz);
  k.light(spot, 0, 45);
  k.add(at(new THREE.BoxGeometry(0.4, 0.3, 0.3), px + 5, yRoof + 0.2, pz + 4.5), k.mat('metalFlat', GRAPHITE));
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.6, 2.0);
  return k.build({ w: W, d: D, h: yF + 2.4, labelY: yF + 3.2 });
}

// ---------------------------------------------------------------------------------------------------------------
// 5. Magic 8 Ball — a round pavilion in lavender plaster, a glass door, and the black ball itself on the roof
// ---------------------------------------------------------------------------------------------------------------
export function createMagic8(spec) {
  const k = K.createKit({ ...spec, seed: 113 });
  const W = 6, D = 6, H = 3.6, R = Math.hypot(1.5, 3.0), CZ = -3.0;
  const plaster = k.mat('plaster', '#d9d0e6'), graphite = k.mat('metalFlat', GRAPHITE);
  const door = { x0: -0.9, x1: 0.9, y0: 0, y1: 2.6 };
  K.facade(k, plaster, -1.5, 1.5, 0, H, [door], { tile: 3 });
  const a0 = Math.atan2(0 - CZ, 1.5), a1 = Math.atan2(0 - CZ, -1.5) - Math.PI * 2;
  K.ribbon(k, plaster, K.arc(0, CZ, R, a0, a1, 30), 0, H, { tile: 3 });
  K.ribbon(k, k.mat('concrete', '#5b5466', { roughness: 0.85 }), K.arc(0, CZ, R + 0.06, a0, a1, 30), 0, 0.25, { tile: 3 });
  k.add(at(box(3.12, 0.25, 0.12, 2, 'fklr'), 0, 0, 0.0), k.mat('concrete', '#5b5466', { roughness: 0.85 }));
  K.glassDoor(k, door, { interior: k.interior('lobby', 12, { day: 0.35, night: 1.3 }), interiorZ: -2.0 });
  // two small round windows either side of the door
  const port = k.interior('flat', 13, { day: 0.2, night: 1.2 });
  for (const x of [-2.9, 2.9]) {
    const a = Math.atan2(0 - CZ, x) ;
    const wx = Math.cos(a) * (R + 0.05), wz = CZ + Math.sin(a) * (R + 0.05);
    const ring = rotY(new THREE.TorusGeometry(0.42, 0.06, 8, 32), Math.PI / 2 - a); ring.translate(wx, 2.1, wz); k.add(ring, graphite, { cast: false });
    const disc = rotY(new THREE.CircleGeometry(0.4, 24), Math.PI / 2 - a); disc.translate(wx, 2.1, wz); k.add(disc, port, { cast: false });
  }
  // the roof disc, a pedestal, and the ball with its white window and the figure 8
  k.add(at(new THREE.CylinderGeometry(R + 0.25, R + 0.25, 0.26, 40), 0, H + 0.13, CZ), graphite);
  k.add(at(new THREE.CylinderGeometry(0.5, 0.7, 0.5, 20), 0, H + 0.26 + 0.25, CZ), k.mat('flat', '#3a3340', { roughness: 0.5, metalness: 0.4 }));
  const ball = new THREE.MeshPhysicalMaterial({ color: '#0e0b14', roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.1 });
  const by = H + 0.26 + 0.5 + 1.6;
  k.add(at(new THREE.SphereGeometry(1.6, 40, 28), 0, by, CZ), ball);
  // the white window is a cap of a slightly bigger sphere, so it hugs the ball; the figure sits on a plane just in front
  k.add(at(rotX(new THREE.SphereGeometry(1.615, 32, 12, 0, Math.PI * 2, 0, 0.46), Math.PI / 2), 0, by, CZ), k.mat('flat', '#f6f3ee', { roughness: 0.6 }), { cast: false });
  K.sign(k, '8', '', { cx: 0, cy: by, z: CZ + 1.635, w: 0.7, h: 0.7, night: 0, color: '#16121e' });
  const halo = k.lamp(spec.accent, 0.1, 2.6);
  k.add(at(rotX(new THREE.TorusGeometry(1.0, 0.04, 8, 48), Math.PI / 2), 0, H + 0.3, CZ), halo, { cast: false });
  K.sign(k, 'MAGIC 8 BALL', '', { cx: 0, cy: H - 0.4, z: 0.08, w: 2.6, h: 0.42, night: 2.2 });
  lantern(k, -1.3, 2.5);
  lantern(k, 1.3, 2.5);
  return k.build({ w: W + 1, d: D + 1, h: by + 1.7, labelY: by + 2.4 });
}

// ---------------------------------------------------------------------------------------------------------------
// 6. Askar Bank — a colonnade of square stone columns with an entablature, a heavy timber door, a banking hall
// ---------------------------------------------------------------------------------------------------------------
export function createBank(spec) {
  const k = K.createKit({ ...spec, seed: 127 });
  const W = 14, D = 12, H1 = 5.2, ENT = 0.9, H2 = 3.3, FRZ = 0.6, PAR = 0.5;
  const yEnt = H1, yUp = H1 + ENT, yRoof = yUp + H2, yFrz = yRoof + FRZ, yTop = yFrz + PAR;
  const stone = k.mat('plaster', '#e3dac8'), stoneDark = k.mat('concrete', '#b8ad98', { roughness: 0.75 });
  const wood = k.mat('wood', '#5c3b22'), brass = k.mat('flat', '#c9a24a', { roughness: 0.35, metalness: 0.8 });
  // steps up to the podium
  for (const [y, d] of [[0.15, 3.9], [0.3, 3.3], [0.45, 2.7]]) K.slab(k, stoneDark, W + 0.6, 0.15, d, y, { z: d / 2 });
  K.plinth(k, stoneDark, W, D, { h: 0.45 });
  const door = { x0: -1.5, x1: 1.5, y0: 0.45, y1: 4.0 };
  const wins = K.punched(k, [-5.0, 5.0], 2.0, 1.3, 4.3, { depth: 0.3, interior: k.interior('hall', 14, { day: 0.4, night: 1.3 }), interiorZ: -1.6, frame: k.mat('metalFlat', '#3a2f22'), glassMat: k.mat('glass', '#a8b4ad'), sillMat: stoneDark });
  const wins2 = K.punched(k, [-5.0, -2.5, 0, 2.5, 5.0], 1.4, yUp + 0.8, yUp + 2.5, { depth: 0.3, interior: k.interior('office', 16), glassMat: k.mat('glass', '#9fb3b0'), sillMat: stoneDark });
  K.facade(k, stone, -W / 2, W / 2, 0, yTop, [door, ...wins, ...wins2], { tile: 3 });
  K.shell(k, stone, W, D, 0, yTop, { tile: 3 });
  // the door: a stone surround, two dark timber leaves with brass pulls, a lit fanlight above
  k.add(at(box(door.x1 - door.x0 + 0.9, door.y1 - door.y0 + 0.5, 0.18, 1.5, 'fklrt'), 0, door.y0, 0.0), stoneDark);
  K.reveals(k, k.mat('flat', '#2d2b29', { roughness: 0.7 }), door, 0.4);
  for (const s of [-1, 1]) k.add(at(box(1.42, 3.0, 0.1, 1.2, 'fklr'), s * 0.74, door.y0, -0.32), wood);
  for (const s of [-1, 1]) k.add(at(new THREE.BoxGeometry(0.06, 0.8, 0.06), s * 0.3, door.y0 + 1.3, -0.24), brass, { cast: false });
  k.add(at(new THREE.PlaneGeometry(2.9, 0.5), 0, door.y0 + 3.3, -0.36), k.interior('hall', 15, { day: 0.3, night: 1.3 }), { cast: false });
  // the colonnade and the entablature standing 1.6 m in front of the facade
  const xs = [-6.0, -3.6, -1.2, 1.2, 3.6, 6.0];
  K.columns(k, stone, xs, 0.45, yEnt, { r: 0.32, z: 1.6, square: true, capital: true });
  k.add(at(box(W + 0.6, ENT, 2.5, 3, 'fklrtd'), 0, yEnt, 0.95), stone);
  k.add(at(box(W + 0.8, 0.14, 2.7, 3, 'fklrtd'), 0, yEnt + ENT, 0.95), stoneDark);
  K.sign(k, 'ASKAR BANK', '', { cx: 0, cy: yEnt + ENT / 2, z: 2.22, w: 5.2, h: 0.62, night: 2.4, color: '#c9a24a' });
  K.ledStrip(k, -W / 2 + 0.6, W / 2 - 0.6, yEnt - 0.03, 1.9, { night: 2.0 });
  for (const x of [-2.4, 2.4]) lantern(k, x, 3.4, 0.3, { night: 2.6 });
  // a majolica frieze above the upper storey, then the parapet
  k.add(at(box(W + 0.2, FRZ, D + 0.2, 1.0, 'fklr'), 0, yRoof, -D / 2), k.mat('majolica', '#'));
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop, { over: 0.4 });
  K.roof(k, { w: W, d: D, y: yFrz, parapet: 0, gravel: '#6a665f' });
  k.add(at(box(W - 0.3, PAR, 0.2, 2, 'fklrt'), 0, yFrz, -0.2), stone);   // the parapet behind the frieze
  K.tower(k, stone, { x: 4.5, z: -9.5, y: yFrz, h: 2.2, w: 2.8, d: 3.0 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 7. TutorHook — a tutors' kiosk: a cork notice board full of pinned offers under a pink awning
// ---------------------------------------------------------------------------------------------------------------
export function createTutorHook(spec) {
  const k = K.createKit({ ...spec, seed: 131 });
  const W = 6, D = 6, H = 3.8, PAR = 0.35, yTop = H + PAR;
  const plaster = k.mat('plaster', '#f4e4ea'), wood = k.mat('wood', '#a9733f');
  K.plinth(k, k.mat('concrete', '#7a6a70', { roughness: 0.85 }), W, D);
  const door = { x0: 1.1, x1: 2.5, y0: 0, y1: 2.7 };
  K.facade(k, plaster, -W / 2, W / 2, 0, yTop, [door], { tile: 3 });
  K.shell(k, plaster, W, D, 0, yTop, { tile: 3 });
  K.glassDoor(k, door, { interior: k.interior('meeting', 17, { day: 0.4, night: 1.3 }), interiorZ: -2.0 });
  // the notice board: a timber frame and the cork with pinned notes
  const bx0 = -2.6, bx1 = 0.4, by0 = 1.0, by1 = 2.8;
  k.add(at(box(bx1 - bx0 + 0.2, by1 - by0 + 0.2, 0.08, 1.2, 'fklrt'), (bx0 + bx1) / 2, by0 - 0.1, 0.0), wood);
  const board = new THREE.MeshStandardMaterial({ map: noticeTexture(spec.accent, 19), roughness: 0.9 });
  k.add(at(new THREE.PlaneGeometry(bx1 - bx0, by1 - by0), (bx0 + bx1) / 2, (by0 + by1) / 2, 0.085), board, { cast: false });
  K.awning(k, { x0: bx0 - 0.3, x1: bx1 + 0.3, y: by1 + 0.3, depth: 1.2, drop: 0.45, colors: [spec.accent, '#fbeef3'] });
  K.sign(k, 'TUTORHOOK', 'REPETITORLAR', { cx: -1.1, cy: H - 0.35, z: 0.08, w: 3.6, h: 0.56, night: 2.2 });
  lantern(k, door.x1 + 0.5, 2.5);
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.25 });
  K.roof(k, { w: W, d: D, y: H, parapet: 0, planters: [[-1.6, -1.0, 2.0]], gravel: '#5a5751' });
  K.plate(k, door.x0 - 0.4, 1.9);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 8. PostCraft — a dark metal media kiosk: screens on the facade showing posts, a violet line, white letters
// ---------------------------------------------------------------------------------------------------------------
export function createPostCraft(spec) {
  const k = K.createKit({ ...spec, seed: 137 });
  const W = 6, D = 7, H = 4.2, PAR = 0.3, yTop = H + PAR;
  const cladding = k.mat('metal', '#2a2733', { metalness: 0.65, roughness: 0.5 }), graphite = k.mat('metalFlat', GRAPHITE);
  K.plinth(k, k.mat('concrete', '#3a3740', { roughness: 0.8 }), W, D);
  const shop = { x0: -2.6, x1: 0.6, y0: 0.5, y1: 3.4 }, door = { x0: 1.2, x1: 2.6, y0: 0, y1: 3.0 };
  K.facade(k, cladding, -W / 2, W / 2, 0, yTop, [shop, door], { tile: 2 });
  K.shell(k, cladding, W, D, 0, yTop, { tile: 2 });
  K.shopfront(k, shop, { interior: k.interior('screens', 20, { day: 0.6, night: 1.6 }), interiorZ: -1.6, base: 0.5 });
  K.glassDoor(k, door, { interior: k.interior('screens', 21, { day: 0.5, night: 1.4 }), interiorZ: -2.2, floorMat: k.mat('flat', '#1b1a22', { roughness: 0.4 }) });
  // three screens on the wall above the shopfront, lit all day
  const screens = [k.glow(new THREE.MeshStandardMaterial({ color: '#f4eefc', emissive: spec.accent, emissiveIntensity: 0.6, roughness: 0.5 }), 0.6, 1.6),
    k.glow(new THREE.MeshStandardMaterial({ color: '#f4eefc', emissive: '#f4eefc', emissiveIntensity: 0.5, roughness: 0.5 }), 0.5, 1.2),
    k.glow(new THREE.MeshStandardMaterial({ color: '#f4eefc', emissive: '#6d3fd9', emissiveIntensity: 0.6, roughness: 0.5 }), 0.6, 1.5)];
  for (let i = 0; i < 3; i++) {
    const x = -2.3 + i * 1.15, y = 3.72, h = i === 1 ? 0.6 : 0.45, w = 1.0;
    k.add(at(box(w + 0.12, h + 0.12, 0.1, 1, 'fklrt'), x, y - h / 2 - 0.06, 0.0), graphite);
    k.add(at(new THREE.PlaneGeometry(w, h), x, y, 0.105), screens[i], { cast: false });
  }
  k.add(at(new THREE.BoxGeometry(W - 0.4, 0.04, 0.05), 0, H - 0.08, 0.04), k.lamp(spec.accent, 0.5, 3.0), { cast: false });
  K.sign(k, 'POSTCRAFT', '', { cx: 1.75, cy: 3.72, z: 0.06, w: 2.0, h: 0.46, night: 2.4, color: '#f4eefc' });
  K.cornice(k, graphite, W, D, yTop - 0.02, { over: 0.25 });
  K.roof(k, { w: W, d: D, y: H, parapet: 0, gravel: '#3f3c44' });
  k.add(at(new THREE.BoxGeometry(0.5, 0.4, 0.5), -1.6, H + 0.2, -4.5), graphite);
  K.plate(k, door.x1 + 0.4, 1.9);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 9. AI Support Agent — a cool grey office block, three floors of windows all lit after dark, a blue canopy
// ---------------------------------------------------------------------------------------------------------------
export function createSupportAgent(spec) {
  const k = K.createKit({ ...spec, seed: 139 });
  const W = 12, D = 11, H1 = 4.0, FH = 3.1, PAR = 0.5, yUp = H1, yRoof = yUp + 2 * FH, yTop = yRoof + PAR;
  const plaster = k.mat('plaster', '#dde2e8'), frame = k.mat('metalFlat', '#2a3140'), glassMat = k.mat('glass', '#a4bccb');
  K.plinth(k, k.mat('concrete', '#5a6068', { roughness: 0.85 }), W, D);
  const door = { x0: 2.6, x1: 4.6, y0: 0, y1: 3.2 }, win0 = { x0: -5.0, x1: 1.6, y0: 0.7, y1: 3.3 };
  K.facade(k, plaster, -W / 2, W / 2, 0, H1, [door, win0], { tile: 3 });
  K.shell(k, plaster, W, D, 0, H1, { tile: 3 });
  K.window(k, win0, { depth: 0.3, step: 1.65, frame, glassMat, interior: k.interior('office', 22, { day: 0.4, night: 1.5 }), interiorZ: -1.4, sill: false });
  K.glassDoor(k, door, { interior: k.interior('lobby', 23, { day: 0.4, night: 1.3 }), interiorZ: -2.4, frame, floorMat: k.mat('flat', '#9aa3ad', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 0.6, x1: door.x1 + 0.6, y: door.y1 + 0.4, depth: 2.0, topColor: '#2a3140' });
  K.sign(k, 'AI SUPPORT', '24 / 7  ·  3 TIL', { cx: -1.7, cy: H1 + 0.3, z: 0.08, w: 4.6, h: 0.62, night: 2.4 });
  k.add(at(new THREE.BoxGeometry(5.0, 0.04, 0.06), -1.7, H1 - 0.12, 0.08), k.lamp(spec.accent, 0.3, 2.6), { cast: false });
  const openings = [];
  const office = k.interior('open', 24, { day: 0.3, night: 1.6 });
  for (let f = 0; f < 2; f++) {
    const y0 = yUp + f * FH;
    openings.push(...K.punched(k, [-4.3, -1.45, 1.45, 4.3], 2.0, y0 + 0.85, y0 + 2.65, { depth: 0.3, frame, glassMat, interior: office, interiorZ: -1.1, sillMat: k.mat('concrete', '#c9cfd6', { roughness: 0.7 }) }));
  }
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, openings, { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  k.add(at(box(W + 0.1, 0.12, 0.1, 3, 'flrtd'), 0, yUp + FH - 0.06, 0.02), k.mat('concrete', '#c9cfd6', { roughness: 0.7 }));
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.4 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-3.5, -1.0, 3.0], [2.5, -1.0, 3.0]], gravel: '#5e6166' });
  K.tower(k, plaster, { x: 3.8, z: -8.6, y: yRoof, h: 2.4, w: 2.8, d: 3.0 });
  K.vent(k, -3.5, -8.5, yRoof);
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.45, 2.0);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 10. CV Forge — a timber pavilion: one big window with the framed form inside, a teal door, a deep roof overhang
// ---------------------------------------------------------------------------------------------------------------
export function createCVForge(spec) {
  const k = K.createKit({ ...spec, seed: 149 });
  const W = 7, D = 8, H = 3.9, OV = 0.7, yTop = H + 0.4;
  const wood = k.mat('wood', '#b98a5a'), woodDark = k.mat('wood', '#7d5a38'), teal = k.mat('flat', spec.accent, { roughness: 0.5 });
  K.plinth(k, k.mat('concrete', '#6a665f', { roughness: 0.85 }), W, D);
  const win = { x0: -2.9, x1: 0.5, y0: 0.7, y1: 3.1 }, door = { x0: 1.3, x1: 2.6, y0: 0, y1: 2.8 };
  K.facade(k, wood, -W / 2, W / 2, 0, H, [win, door], { tile: 1.5 });
  K.shell(k, wood, W, D, 0, H, { tile: 1.5 });
  K.window(k, win, { depth: 0.25, step: 1.7, frame: woodDark, glassMat: k.mat('glass', '#a8c0b8'), interior: k.interior('form', 25, { day: 0.45, night: 1.35 }), interiorZ: -1.5, sillMat: woodDark });
  // a solid door painted in the project's colour, with a small window
  K.reveals(k, woodDark, door, 0.25);
  k.add(at(box(door.x1 - door.x0 - 0.06, door.y1 - 0.04, 0.06, 1.2, 'fklrt'), (door.x0 + door.x1) / 2, 0.02, -0.2), teal);
  k.add(at(new THREE.PlaneGeometry(0.6, 0.6), (door.x0 + door.x1) / 2, 1.9, -0.16), k.interior('form', 26, { day: 0.3, night: 1.2 }), { cast: false });
  k.add(at(new THREE.BoxGeometry(0.05, 0.5, 0.06), door.x1 - 0.35, 1.1, -0.14), k.mat('metalFlat', GRAPHITE), { cast: false });
  K.sign(k, 'CV FORGE', 'REZYUME  ·  PDF', { cx: -1.2, cy: H - 0.35, z: 0.06, w: 3.4, h: 0.56, night: 2.2 });
  // the overhanging roof on exposed rafters
  for (let x = -W / 2 + 0.3; x <= W / 2 - 0.2; x += 0.9) k.add(at(box(0.12, 0.2, D + OV + 0.3, 1.2, 'fklrtd'), x, H, -D / 2 + OV / 2 + 0.15), woodDark);
  k.add(at(box(W + 0.6, 0.12, D + OV + 0.5, 2, 'fklrtd'), 0, H + 0.2, -D / 2 + OV / 2 + 0.25), k.mat('metalFlat', '#3a3a3e'));
  k.add(at(box(W + 0.6, 0.08, 0.1, 2, 'fklrt'), 0, H + 0.32, OV + 0.2), teal, { cast: false });   // a teal edge on the roof
  k.add(at(rotX(new THREE.PlaneGeometry(W + 0.5, OV + 0.4), Math.PI / 2), 0, H - 0.01, OV / 2 + 0.1), k.glow(new THREE.MeshStandardMaterial({ color: '#f1e6d6', emissive: '#ffd9ae', emissiveIntensity: 0, roughness: 0.7 }), 0, 1.4), { cast: false });
  K.roof(k, { w: W, d: D, y: H + 0.32, parapet: 0, gravel: '#4a4846' });
  lantern(k, door.x1 + 0.5, 2.4);
  k.add(at(box(0.9, 0.5, 0.6, 2, 'fklrt'), -3.0, 0, 0.5), k.mat('flat', '#8a4a2a', { roughness: 0.85, metalness: 0.25 }));
  k.shrub(-3.0, 0.48, 0.5, 0.45, 0.6, 0.35, 29, 30);
  K.plate(k, door.x0 - 0.4, 1.9);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 11. Orbit — a web studio: cool white plaster, a glazed ground floor, a mast with two glowing rings on the roof
// ---------------------------------------------------------------------------------------------------------------
export function createOrbit(spec) {
  const k = K.createKit({ ...spec, seed: 151 });
  const W = 10, D = 10, H1 = 4.2, H2 = 3.2, PAR = 0.5, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const plaster = k.mat('plaster', '#e9eaef'), frame = k.mat('metalFlat', '#23283a'), glassMat = k.mat('glass', '#a6bdd3');
  K.plinth(k, k.mat('concrete', '#596170', { roughness: 0.85 }), W, D);
  const shop = { x0: -4.3, x1: 1.3, y0: 0.5, y1: 3.5 }, door = { x0: 2.0, x1: 3.8, y0: 0, y1: 3.1 };
  K.facade(k, plaster, -W / 2, W / 2, 0, H1, [shop, door], { tile: 3 });
  K.shell(k, plaster, W, D, 0, H1, { tile: 3 });
  K.shopfront(k, shop, { interior: k.interior('open', 27, { day: 0.45, night: 1.4 }), interiorZ: -1.8, base: 0.5, frame });
  K.glassDoor(k, door, { interior: k.interior('lobby', 28, { day: 0.4, night: 1.3 }), interiorZ: -2.4, frame, floorMat: k.mat('flat', '#8c94a3', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 0.5, x1: door.x1 + 0.5, y: door.y1 + 0.35, depth: 1.8, topColor: '#23283a' });
  K.sign(k, 'ORBIT', 'WEB STUDIO', { cx: -1.5, cy: H1 - 0.3, z: 0.08, w: 3.0, h: 0.6, night: 2.4 });
  const rib = { x0: -4.3, x1: 3.8, y0: yUp + 0.8, y1: yUp + 2.5 };
  K.window(k, rib, { depth: 0.3, step: 1.6, frame, glassMat, interior: k.interior('office', 29, { day: 0.2, night: 1.5 }), interiorZ: -1.1, sillMat: k.mat('concrete', '#d3d6dd', { roughness: 0.7 }) });
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, [rib], { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.4 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-2.8, -1.0, 2.8]], gravel: '#5c5f66' });
  // the mast with two tilted rings, lit blue after dark
  const mx = 2.0, mz = -4.5, my = yRoof;
  k.add(at(new THREE.CylinderGeometry(0.07, 0.12, 4.6, 12), mx, my + 2.3, mz), k.mat('flat', '#3a3d46', { roughness: 0.45, metalness: 0.7 }));
  const ring = k.lamp(spec.accent, 0.25, 2.8);
  k.add(at(rotZ(rotX(new THREE.TorusGeometry(1.35, 0.045, 8, 56), 0.35), 0.5), mx, my + 3.4, mz), ring, { cast: false });
  k.add(at(rotZ(rotX(new THREE.TorusGeometry(0.9, 0.045, 8, 48), 1.2), -0.4), mx, my + 3.4, mz), ring, { cast: false });
  k.add(at(new THREE.SphereGeometry(0.22, 16, 12), mx, my + 3.4, mz), k.lamp('#ffffff', 0.3, 2.2), { cast: false });
  const pl = new THREE.PointLight(spec.accent, 0, 9, 1.5); pl.position.set(mx, my + 3.4, mz); k.light(pl, 0, 8);
  K.tower(k, plaster, { x: -3.0, z: -8.0, y: yRoof, h: 2.2, w: 2.6, d: 2.8 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.4, 2.0);
  return k.build({ w: W, d: D, h: my + 4.9, labelY: my + 5.6 });
}

// ---------------------------------------------------------------------------------------------------------------
// 12. SiteGo — the site builder: terracotta brick, two windows of posters, pilasters and soldier lintels
// ---------------------------------------------------------------------------------------------------------------
export function createSiteGo(spec) {
  const k = K.createKit({ ...spec, seed: 157 });
  const W = 10, D = 10, H1 = 4.2, H2 = 3.2, PAR = 0.5, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const brick = k.mat('brick', '#c69079'), brickDark = k.mat('brick', '#7f5547'), stone = k.mat('concrete', '#dcd3c4', { roughness: 0.7 });
  K.plinth(k, k.mat('concrete', '#5e554f', { roughness: 0.85 }), W, D);
  const winA = { x0: -4.2, x1: -1.6, y0: 0.6, y1: 3.4 }, winB = { x0: -0.9, x1: 1.7, y0: 0.6, y1: 3.4 }, door = { x0: 2.5, x1: 4.0, y0: 0, y1: 3.0 };
  K.facade(k, brick, -W / 2, W / 2, 0, H1, [winA, winB, door], { tile: 1.5 });
  K.shell(k, brick, W, D, 0, H1, { tile: 1.5 });
  const posters = k.interior('posters', 30, { day: 0.5, night: 1.4 });
  for (const o of [winA, winB]) K.window(k, o, { depth: 0.3, step: 1.3, interior: posters, interiorZ: -1.5, sillMat: stone, glassMat: k.mat('glass', '#aebfb8') });
  K.glassDoor(k, door, { interior: k.interior('posters', 31, { day: 0.4, night: 1.2 }), interiorZ: -2.2 });
  K.lintels(k, brickDark, [winA, winB, door]);
  K.pilasters(k, brickDark, [-W / 2 + 0.3, W / 2 - 0.3], 0, yRoof, { w: 0.6 });
  K.canopy(k, { x0: door.x0 - 0.4, x1: door.x1 + 0.4, y: door.y1 + 0.35, depth: 1.5, topColor: '#2b2b2e', rods: false });
  K.sign(k, 'SITEGO', 'SAYT KONSTRUKTORI', { cx: -1.3, cy: H1 + 0.32, z: 0.08, w: 3.6, h: 0.62, night: 2.4 });
  k.add(at(new THREE.BoxGeometry(4.0, 0.04, 0.06), -1.3, H1 - 0.1, 0.08), k.lamp(spec.accent, 0.3, 2.6), { cast: false });
  const wins2 = K.punched(k, [-3.0, 0, 3.0], 1.5, yUp + 0.85, yUp + 2.6, { depth: 0.3, interior: k.interior('flat', 32), glassMat: k.mat('glass', '#9fb3b0'), sillMat: stone });
  K.facade(k, brick, -W / 2, W / 2, yUp, yRoof, wins2, { tile: 1.5 });
  K.shell(k, brick, W, D, yUp, yRoof, { tile: 1.5 });
  K.lintels(k, brickDark, wins2);
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.4 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: PAR, wallMat: brick, planters: [[-2.5, -1.0, 3.0], [2.0, -1.0, 2.4]] });
  K.vent(k, 3.0, -7.5, yRoof);
  K.downpipe(k, W / 2 - 0.25, yRoof);
  K.plate(k, door.x1 + 0.4, 2.0);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 13. HR-Simulator — a narrow two-floor house: a meeting room in the window, a small balcony, a red canopy edge
// ---------------------------------------------------------------------------------------------------------------
export function createHRSim(spec) {
  const k = K.createKit({ ...spec, seed: 163 });
  const W = 8, D = 9, H1 = 4.0, H2 = 3.3, PAR = 0.5, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const plaster = k.mat('plaster', '#ece5da'), wood = k.mat('wood', '#8f6a48');
  K.plinth(k, k.mat('concrete', '#6a625c', { roughness: 0.85 }), W, D);
  const win = { x0: -3.2, x1: 0.4, y0: 0.6, y1: 3.3 }, door = { x0: 1.3, x1: 2.9, y0: 0, y1: 3.0 };
  K.facade(k, plaster, -W / 2, W / 2, 0, H1, [win, door], { tile: 3 });
  K.shell(k, plaster, W, D, 0, H1, { tile: 3 });
  K.window(k, win, { depth: 0.3, step: 1.25, transom: 2.6, interior: k.interior('meeting', 33, { day: 0.45, night: 1.35 }), interiorZ: -1.5, sillMat: k.mat('concrete', '#d6cfc3', { roughness: 0.7 }), glassMat: k.mat('glass', '#aebfb8') });
  K.glassDoor(k, door, { interior: k.interior('lobby', 34, { day: 0.35, night: 1.3 }), interiorZ: -2.0 });
  K.canopy(k, { x0: door.x0 - 0.4, x1: door.x1 + 0.4, y: door.y1 + 0.35, depth: 1.5, topColor: '#2b2b2e', rods: false });
  K.sign(k, 'HR-SIMULATOR', 'INTERVYU TRENAJYORI', { cx: -1.6, cy: H1 - 0.32, z: 0.08, w: 4.0, h: 0.6, night: 2.4 });
  const win2 = { x0: -3.2, x1: -1.0, y0: yUp + 0.8, y1: yUp + 2.6 }, bal = { x0: 0.4, x1: 3.6, y0: yUp, y1: yUp + H2 };
  K.window(k, win2, { depth: 0.3, step: 1.1, interior: k.interior('office', 35), glassMat: k.mat('glass', '#9fb3b0'), sillMat: k.mat('concrete', '#d6cfc3', { roughness: 0.7 }) });
  K.loggia(k, { ...bal, depth: 1.4, posts: false, railing: true, door: true, lamp: true, planter: true, woodMat: wood, wallMat: k.mat('flat', '#efe6d8', { roughness: 1 }) });
  k.add(at(box(bal.x1 - bal.x0 + 0.2, 0.25, 0.25, 1.2, 'fklrtd'), (bal.x0 + bal.x1) / 2, bal.y0 - 0.2, 0.0), k.mat('concrete', '#d6cfc3', { roughness: 0.7 }));
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, [win2, bal], { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.2 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-2.0, -1.0, 2.6]], gravel: '#5a5751' });
  K.vent(k, 2.4, -6.8, yRoof, { r: 0.25, h: 1.1 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.4, 2.0);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// 14. Domus Furniture Planner — the workshop the Domus engine grew from: brick, timber gates with one leaf open,
// a showroom window, a clerestory under the roof, planks stacked by the gate
// ---------------------------------------------------------------------------------------------------------------
export function createFurniture(spec) {
  const k = K.createKit({ ...spec, seed: 167 });
  const W = 12, D = 12, H1 = 4.4, H2 = 1.7, PAR = 0.3, yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const brick = k.mat('brick', '#d8c2a4'), brickDark = k.mat('brick', '#9a7a62'), wood = k.mat('wood', '#a97b52'), woodLight = k.mat('wood', '#cfa877');
  K.plinth(k, k.mat('concrete', '#6f655a', { roughness: 0.85 }), W, D);
  const gate = { x0: -5.0, x1: -1.4, y0: 0, y1: 3.6 }, win = { x0: -0.4, x1: 3.6, y0: 0.6, y1: 3.4 }, door = { x0: 4.3, x1: 5.4, y0: 0, y1: 2.8 };
  K.facade(k, brick, -W / 2, W / 2, 0, H1, [gate, win, door], { tile: 1.5 });
  K.shell(k, brick, W, D, 0, yUp + 0.68, { tile: 1.5 });
  K.lintels(k, brickDark, [gate, win, door]);
  // the gates: a deep reveal, a lit workshop behind, one leaf shut and one swung open
  K.reveals(k, k.mat('flat', '#cdbfa8', { roughness: 1 }), gate, 0.5);
  k.add(at(new THREE.PlaneGeometry(gate.x1 - gate.x0 + 1.4, gate.y1 + 0.4), (gate.x0 + gate.x1) / 2, gate.y1 / 2, -2.6), k.interior('showroom', 36, { day: 0.5, night: 1.4 }), { cast: false });
  k.add(at(rotX(new THREE.PlaneGeometry(gate.x1 - gate.x0 + 1.4, 2.6), -Math.PI / 2), (gate.x0 + gate.x1) / 2, 0.01, -1.3), k.mat('flat', '#6a5d4e', { roughness: 0.5 }), { cast: false });
  k.add(at(box(1.78, gate.y1 - 0.05, 0.08, 1.2, 'fklrt'), gate.x1 - 0.9, 0.02, -0.46), wood);                     // the shut leaf
  const open = rotY(box(1.78, gate.y1 - 0.05, 0.08, 1.2, 'fklrt'), -1.15); open.translate(gate.x0 + 0.04, 0.02, -0.42); k.add(open, wood);   // the open leaf
  for (const x of [gate.x1 - 0.9]) for (const y of [0.9, 2.7]) k.add(at(new THREE.BoxGeometry(1.6, 0.08, 0.04), x, y, -0.4), woodLight, { cast: false });
  K.window(k, win, { depth: 0.3, step: 1.35, interior: k.interior('showroom', 37, { day: 0.45, night: 1.35 }), interiorZ: -1.5, sillMat: k.mat('concrete', '#cdbfa8', { roughness: 0.7 }), glassMat: k.mat('glass', '#aebfb8') });
  K.glassDoor(k, door, { interior: k.interior('lobby', 38, { day: 0.3, night: 1.2 }), interiorZ: -2.0, pulls: false });
  K.signBand(k, { x0: -W / 2 - 0.1, x1: W / 2 + 0.1, y: H1 - 0.02, h: 0.7, color: '#2b2520', proud: 0.26 });
  K.sign(k, 'DOMUS FURNITURE', 'MEBEL  ·  3D PLANNER', { cx: -1.0, cy: H1 + 0.33, z: 0.27, w: 6.4, h: 0.62, night: 2.4 });
  // the clerestory: a strip of small panes under the roof, lit from the workshop
  const cler = { x0: -5.4, x1: 5.4, y0: yUp + 0.75, y1: yUp + 1.5 };
  K.window(k, cler, { depth: 0.25, step: 1.08, interior: k.interior('open', 39, { day: 0.25, night: 1.4 }), interiorZ: -0.8, sill: false, glassMat: k.mat('glass', '#a8c0b8') });
  K.facade(k, brick, -W / 2, W / 2, yUp + 0.68, yTop, [cler], { tile: 1.5 });
  K.shell(k, brick, W, D, yUp + 0.68, yTop, { tile: 1.5 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.35 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, gravel: '#5a5751' });
  k.add(at(new THREE.CylinderGeometry(0.4, 0.4, 2.2, 14), 3.5, yRoof + 1.1, -8.0), k.mat('flat', '#7a7672', { roughness: 0.6, metalness: 0.5 }));   // a stack
  K.vent(k, -3.5, -9.0, yRoof);
  // planks and a saw-horse by the gate
  for (let i = 0; i < 5; i++) k.add(at(box(2.2, 0.06, 0.24, 1.2, 'fklrt'), 0.9 + (i % 2) * 0.05, 0.3 + i * 0.065, 0.55 + (i % 2) * 0.03), woodLight);
  for (const dx of [-0.8, 0.8]) k.add(at(box(0.08, 0.3, 0.6, 1.2, 'fklrt'), 0.9 + dx, 0, 0.55), wood);
  lantern(k, gate.x1 + 0.6, 3.2, 0.3, { night: 2.6 });
  K.downpipe(k, W / 2 - 0.25, yRoof);
  K.plate(k, door.x0 - 0.35, 1.9);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// FlightDelay — the data science desk at an airfield: a low terminal, a glass control cab on a shaft, a beacon
// ---------------------------------------------------------------------------------------------------------------
export function createFlightDelay(spec) {
  const k = K.createKit({ ...spec, seed: 211 });
  const W = 12, D = 10, H1 = 4.4, PAR = 0.4, yTop = H1 + PAR;
  const panel = k.mat('plaster', '#e4e8e8'), frame = k.mat('metalFlat', '#20302f');
  K.plinth(k, k.mat('concrete', '#566160', { roughness: 0.85 }), W, D);
  const shop = { x0: -5.2, x1: 1.8, y0: 0.5, y1: 3.6 }, door = { x0: 2.6, x1: 4.6, y0: 0, y1: 3.1 };
  K.facade(k, panel, -W / 2, W / 2, 0, yTop, [shop, door], { tile: 3 });
  K.shell(k, panel, W, D, 0, yTop, { tile: 3 });
  K.shopfront(k, shop, { interior: k.interior('office', 41, { day: 0.45, night: 1.4 }), interiorZ: -1.8, base: 0.5, frame });
  K.glassDoor(k, door, { interior: k.interior('lobby', 42, { day: 0.4, night: 1.3 }), interiorZ: -2.4, frame, floorMat: k.mat('flat', '#7f8c8b', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 0.5, x1: door.x1 + 0.5, y: door.y1 + 0.35, depth: 1.8, topColor: '#20302f' });
  K.sign(k, 'FLIGHTDELAY', 'DATA SCIENCE', { cx: -1.7, cy: H1 - 0.25, z: 0.08, w: 4.2, h: 0.6, night: 2.4 });
  K.cornice(k, k.mat('metalFlat', '#26262a'), W, D, yTop - 0.02, { over: 0.3 });
  K.roof(k, { w: W, d: D, y: H1, parapet: 0, planters: [[-3.4, -1.0, 2.6]], gravel: '#5c5f66' });
  // the shaft, the cab with its dark glass, the deck and the beacon
  const tx = 3.2, tz = -5.0, shaftH = 7.2, cabY = H1 + shaftH;
  k.add(at(new THREE.CylinderGeometry(0.85, 1.05, shaftH, 20), tx, H1 + shaftH / 2, tz), panel);
  k.add(at(new THREE.CylinderGeometry(2.2, 1.15, 0.5, 20), tx, cabY + 0.25, tz), frame);
  k.add(at(new THREE.CylinderGeometry(2.25, 1.95, 2.0, 20), tx, cabY + 1.5, tz), k.mat('glass', '#35605f'), { cast: false });
  k.add(at(new THREE.CylinderGeometry(2.45, 2.45, 0.22, 20), tx, cabY + 2.6, tz), frame);
  k.add(at(new THREE.CylinderGeometry(0.05, 0.08, 2.0, 8), tx, cabY + 3.7, tz), frame);
  k.add(at(new THREE.SphereGeometry(0.17, 14, 10), tx, cabY + 4.75, tz), k.lamp(spec.accent, 0.4, 3.2), { cast: false });
  const pl = new THREE.PointLight(spec.accent, 0, 10, 1.5); pl.position.set(tx, cabY + 1.5, tz); k.light(pl, 0, 8);
  K.plate(k, door.x1 + 0.4, 2.0);
  return k.build({ w: W, d: D, h: cabY + 5, labelY: cabY + 5.6 });
}

// ---------------------------------------------------------------------------------------------------------------
// Galactic Vault — a small dark strongroom: a round vault door and a thin line of cyan light
// ---------------------------------------------------------------------------------------------------------------
export function createGalacticVault(spec) {
  const k = K.createKit({ ...spec, seed: 223 });
  const W = 7, D = 8, H = 5.6, PAR = 0.3;
  const clad = k.mat('metal', '#23262f', { metalness: 0.6, roughness: 0.55 }), steel = k.mat('flat', '#7b8391', { roughness: 0.35, metalness: 0.85 });
  K.plinth(k, k.mat('concrete', '#3f434c', { roughness: 0.85 }), W, D);
  K.facade(k, clad, -W / 2, W / 2, 0, H + PAR, [], { tile: 2 });
  K.shell(k, clad, W, D, 0, H + PAR, { tile: 2 });
  K.sign(k, 'GALACTIC VAULT', '', { cx: 0, cy: H - 0.55, z: 0.08, w: 4.8, h: 0.5, night: 2.8 });
  K.ledStrip(k, -W / 2 + 0.1, W / 2 - 0.1, H - 0.05, 0.06, { night: 3 });
  // the vault door on the wall: ring, disc, hub and bars
  const cy = 2.2;
  k.add(at(new THREE.TorusGeometry(1.5, 0.14, 12, 48), 0, cy, 0.1), steel);
  k.add(at(rotX(new THREE.CylinderGeometry(1.4, 1.4, 0.12, 40), Math.PI / 2), 0, cy, 0.08), k.mat('flat', '#4a505c', { roughness: 0.4, metalness: 0.8 }));
  k.add(at(rotX(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 24), Math.PI / 2), 0, cy, 0.2), steel);
  for (let i = 0; i < 3; i++) k.add(at(rotZ(new THREE.BoxGeometry(1.5, 0.08, 0.08), i * Math.PI / 3), 0, cy, 0.32), steel);
  k.add(at(new THREE.TorusGeometry(1.68, 0.025, 8, 56), 0, cy, 0.06), k.lamp(spec.accent, 0.5, 3), { cast: false });
  K.roof(k, { w: W, d: D, y: H, parapet: PAR, wallMat: clad, planters: [], gravel: '#3f434c' });
  return k.build({ w: W, d: D, h: H + PAR, labelY: H + 1 });
}
