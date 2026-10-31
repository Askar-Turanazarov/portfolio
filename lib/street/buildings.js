// The six flagship buildings, each assembled from the kit. Every one has its own trade and its own face, but they
// share the street's grammar: facade at z = 0 facing the road, plinth, a lit interior behind every pane, a sign in
// the project's colour, a planted roof. Sizes in metres; the pavement is y = 0.
import * as THREE from 'three';
import { box, at, rotX, rotY, rotZ, plane, projectUV } from './geo.js';
import { toolWallTexture } from './materials.js';
import { car } from './props.js';
import * as K from './kit.js';

/** Registry of the flagships in street order (oldest first), with footprint widths for the lot planner. */
export const FLAGSHIPS = [
  { slug: 'corecraft-pc', name: 'CoreCraft PC', accent: '#06b6d4', w: 14, make: createCoreCraft },
  { slug: 'skydental-rag', name: 'SkyDental RAG', accent: '#0ea5e9', w: 15, make: createSkyDental },
  { slug: 'octane-forge', name: 'Octane Forge', accent: '#ef5a2a', w: 16, make: createOctaneForge },
  { slug: 'marginflow-crm', name: 'MarginFlow CRM', accent: '#10b981', w: 14, make: createMarginFlow },
  { slug: 'ustoz-ai', name: 'Ustoz AI', accent: '#7c3aed', w: 18, make: createUstoz },
  { slug: 'domus-estate', name: 'Domus Estate', accent: '#c2703e', w: 18, make: createDomus }
];

const GRAPHITE = '#26262a';

// ---------------------------------------------------------------------------------------------------------------
// CoreCraft PC — a dark shopfront full of glowing towers, a warm brick upper floor, a vertical sign fin at the corner
// ---------------------------------------------------------------------------------------------------------------
export function createCoreCraft(spec) {
  const k = K.createKit({ ...spec, seed: 11 });
  const W = 14, D = 12, H1 = 4.6, BAND = 0.8, H2 = 3.3, PAR = 0.5;
  const yUp = H1 + BAND, yRoof = yUp + H2, yTop = yRoof + PAR;
  const cladding = k.mat('metal', '#3a3d42', { metalness: 0.6, roughness: 0.55 });
  const brick = k.mat('brick', '#cdbfae');
  const brickDark = k.mat('brick', '#8f7466');
  const graphite = k.mat('metalFlat', GRAPHITE);

  K.plinth(k, k.mat('concrete', '#55534f', { roughness: 0.8 }), W, D);
  // ground floor: dark metal cladding with the shopfront and the door cut out
  const shop = { x0: -6.0, x1: 1.6, y0: 0.45, y1: 4.0 }, door = { x0: 2.4, x1: 4.6, y0: 0, y1: 3.4 };
  K.facade(k, cladding, -W / 2, W / 2, 0, H1, [shop, door], { tile: 2 });
  K.shell(k, cladding, W, D, 0, H1, { tile: 2 });
  K.shopfront(k, shop, { interior: k.interior('pc', 2, { day: 0.5, night: 1.5 }), interiorZ: -1.8, base: 0.45 });
  K.glassDoor(k, door, { interior: k.interior('pc', 3, { day: 0.4, night: 1.3 }), interiorZ: -2.4, floorMat: k.mat('flat', '#1d2026', { roughness: 0.4 }) });
  // a thin cyan line along the top of the shopfront, lit in the evening
  const cyan = k.lamp(spec.accent, 0.4, 2.8);
  k.add(at(new THREE.BoxGeometry(shop.x1 - shop.x0 + 0.2, 0.04, 0.05), (shop.x0 + shop.x1) / 2, shop.y1 + 0.12, 0.03), cyan, { cast: false });
  K.canopy(k, { x0: door.x0 - 0.5, x1: door.x1 + 0.5, y: door.y1 + 0.35, depth: 1.8, topColor: '#2b2b2e' });
  // sign band and the name
  K.signBand(k, { x0: -W / 2 - 0.2, x1: W / 2 + 0.2, y: H1, h: BAND, color: '#1d1f24' });
  K.sign(k, 'CORECRAFT', 'PC MARKET  ·  TOSHKENT', { cx: -2.4, cy: H1 + BAND / 2, z: 0.33, w: 6.2, h: 0.72 });
  K.ledStrip(k, -W / 2, W / 2, H1 + 0.01, 0.28);
  // upper floor: brick with four punched windows and soldier lintels, a dark pilaster band at the corners
  const wins = K.punched(k, [-5.0, -2.2, 0.6, 3.4], 1.7, yUp + 0.75, yUp + 2.6, { depth: 0.3, interior: k.interior('open', 4), glassMat: k.mat('glass', '#8fb0b8') });
  K.facade(k, brick, -W / 2, W / 2, yUp, yRoof, wins, { tile: 1.5 });
  K.shell(k, brick, W, D, yUp, yRoof, { tile: 1.5 });
  K.lintels(k, brickDark, wins);
  K.pilasters(k, brickDark, [-W / 2 + 0.3, 5.9], yUp, yRoof, { w: 0.6 });
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1);
  K.roof(k, { w: W, d: D, y: yRoof, parapet: PAR, wallMat: brick, planters: [[-4.5, -0.9, 3.2], [1.5, -0.9, 2.4]] });
  K.tower(k, brick, { x: 4.6, z: -9.5, y: yRoof, h: 2.6, w: 2.8, d: 3.0 });
  K.vent(k, -4.5, -9, yRoof);
  // the fin sign at the right corner
  K.finSign(k, 'CORECRAFT', { x: W / 2 + 0.25, y0: 2.2, y1: yRoof - 0.4, z: 0.1, w: 0.9 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.45, 2.1);
  k.add(at(new THREE.BoxGeometry(0.5, 0.4, 0.5), 2.0, yRoof + 0.2, -7), graphite);   // a roof box for the aircon
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// SkyDental — white plaster with a rounded corner, turquoise ribbon windows, a winged canopy, letters on the wall
// ---------------------------------------------------------------------------------------------------------------
export function createSkyDental(spec) {
  const k = K.createKit({ ...spec, seed: 23 });
  const W = 15, D = 13, H1 = 4.3, H2 = 3.3, PAR = 0.6, R = 2.6;
  const yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const white = k.mat('plaster', '#f1ece2');
  const frame = k.mat('flat', '#1f6f8b', { roughness: 0.4, metalness: 0.5 });
  const glassMat = k.mat('glass', '#a9c9cf');

  K.plinth(k, k.mat('concrete', '#9aa3a4', { roughness: 0.8 }), W, D, { h: 0.3 });
  // openings on the flat part of the front (the rounded corner is to the right of xFlat)
  const xFlat = W / 2 - R;
  const ribbon0 = { x0: -6.2, x1: 1.4, y0: 0.9, y1: 3.5 }, door = { x0: 2.3, x1: 4.3, y0: 0, y1: 3.1 };
  const ribbon1 = { x0: -6.2, x1: 3.9, y0: yUp + 0.8, y1: yUp + 2.5 };
  K.facade(k, white, -W / 2, xFlat, 0, yTop, [ribbon0, door, ribbon1], { tile: 3 });
  // the rest of the shell as one ribbon wall: the rounded corner, right side, back, left side
  K.ribbon(k, white, [...K.arc(xFlat, -R, R, Math.PI / 2, 0, 10), [W / 2, -D], [-W / 2, -D], [-W / 2, 0]], 0, yTop, { tile: 3 });
  // a turquoise band running round the corner at the floor line
  K.ribbon(k, frame, [...K.arc(xFlat, -R, R + 0.03, Math.PI / 2, 0, 10), [W / 2 + 0.03, -D]], yUp - 0.15, yUp + 0.1, { tile: 3 });
  k.add(at(new THREE.BoxGeometry(xFlat + W / 2, 0.25, 0.06), (-W / 2 + xFlat) / 2, yUp - 0.025, 0.03), frame);
  K.window(k, ribbon0, { depth: 0.3, step: 1.9, frame, glassMat, interior: k.interior('clinic', 5, { day: 0.5, night: 1.0 }), interiorZ: -1.4, sill: false });
  K.window(k, ribbon1, { depth: 0.3, step: 1.9, frame, glassMat, interior: k.interior('open', 6, { day: 0.15, night: 1.5 }), interiorZ: -1.0, sillMat: k.mat('concrete', '#dfe3e2', { roughness: 0.6 }) });
  K.glassDoor(k, door, { interior: k.interior('clinic', 7, { day: 0.5, night: 1.2 }), interiorZ: -2.4, frame, floorMat: k.mat('flat', '#c3ccce', { roughness: 0.4 }) });
  K.canopy(k, { x0: door.x0 - 0.9, x1: door.x1 + 0.9, y: door.y1 + 0.45, depth: 2.4, topColor: '#e9eef0', rods: true });
  K.sign(k, 'SKYDENTAL', 'STOMATOLOGIYA  ·  RAG', { cx: -2.4, cy: 3.9, z: 0.1, w: 5.0, h: 0.6 });
  // a cross of light by the door
  const lamp = k.lamp(spec.accent, 0.3, 3.0);
  k.add(at(new THREE.BoxGeometry(0.08, 0.7, 0.05), door.x1 + 0.7, 2.3, 0.04), lamp, { cast: false });
  k.add(at(new THREE.BoxGeometry(0.7, 0.08, 0.05), door.x1 + 0.7, 2.3, 0.04), lamp, { cast: false });
  K.ledStrip(k, -W / 2 + 0.3, xFlat - 0.3, yRoof - 0.02, 0.1, { night: 2.4 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-4.6, -1.0, 3.6], [0.8, -1.0, 3.0], [-5.5, -11.5, 2.8]], pergola: { x0: 1.5, x1: 5.5, z0: -11.5, z1: -8.5 }, gravel: '#8a8f8d' });
  // the inner face of the parapet follows the rounded corner too
  const innerR = R - 0.3;
  K.ribbon(k, k.mat('flat', '#d9d6cd', { roughness: 1 }), [[-W / 2 + 0.3, -0.3], [xFlat, -0.3], ...K.arc(xFlat, -R, innerR, Math.PI / 2, 0, 8), [W / 2 - 0.3, -D + 0.3], [-W / 2 + 0.3, -D + 0.3], [-W / 2 + 0.3, -0.3]].reverse(), yRoof, yTop);
  K.tower(k, white, { x: -5.3, z: -10.4, y: yRoof, h: 2.4, w: 3.0, d: 3.2 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x0 - 0.4, 2.1);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// Octane Forge — the auto atelier: brick workshop with two roll-up doors, a dark sign band, a plastered upper floor
// with a deep ribbon window and an open loggia behind louvres, a planted roof, a majolica portal under a canopy
// ---------------------------------------------------------------------------------------------------------------
export function createOctaneForge(spec) {
  const k = K.createKit({ ...spec, seed: 7 });
  const W = 16, D = 14, H1 = 4.9, BAND = 0.9, H2 = 3.4, PAR = 0.5;
  const yBand = H1, yUp = H1 + BAND, yRoof = yUp + H2, yTop = yRoof + PAR;
  const brick = k.mat('brick', '#e6d6c8'), brickDark = k.mat('brick', '#a98678');
  const plaster = k.mat('plaster', '#e8dcc8'), wood = k.mat('wood', '#d8b483');
  const shutter = k.mat('shutter', '#7b8088', { metalness: 0.45 });
  const graphite = k.mat('metalFlat', GRAPHITE), dark = k.mat('flat', '#2d2b29', { roughness: 0.7 });

  K.plinth(k, k.mat('concrete', '#6f6a62', { roughness: 0.85 }), W, D);
  const openA = { x0: -6.2, x1: -2.6, y0: 0, y1: 3.9 }, openB = { x0: -1.8, x1: 1.8, y0: 0, y1: 3.9 }, openE = { x0: 4.0, x1: 7.2, y0: 0, y1: 3.0 };
  K.facade(k, brick, -W / 2, W / 2, 0, H1, [openA, openB, openE], { tile: 1.5 });
  K.shell(k, brick, W, D, 0, H1, { tile: 1.5 });
  for (const o of [openA, openB, openE]) K.reveals(k, dark, o, 0.4);
  K.lintels(k, brickDark, [openA, openB]);
  K.pilasters(k, brickDark, [-W / 2 + 0.3, (openA.x1 + openB.x0) / 2, (openB.x1 + openE.x0) / 2, W / 2 - 0.3], 0, H1);
  // door B closed (roll-up shutter), door A rolled up with the workshop open behind
  const shB = plane(openB.x1 - openB.x0, openB.y1, 3); shB.translate(0, openB.y1 / 2, -0.3);
  k.add(projectUV(shB, 'x', 3), shutter);
  k.add(at(rotZ(new THREE.CylinderGeometry(0.28, 0.28, openA.x1 - openA.x0 - 0.1, 16), Math.PI / 2), (openA.x0 + openA.x1) / 2, openA.y1 - 0.3, -0.45), graphite);
  for (const o of [openA, openB]) for (const x of [o.x0 + 0.06, o.x1 - 0.06]) k.add(at(new THREE.BoxGeometry(0.1, o.y1, 0.1), x, o.y1 / 2, -0.32), graphite);
  // the workshop
  k.add(at(rotX(new THREE.PlaneGeometry(W - 6, D - 0.2), -Math.PI / 2), -5, 0.012, -D / 2), k.mat('concrete', '#7d7a74', { roughness: 0.55 }), { cast: false });
  k.add(at(new THREE.PlaneGeometry(W - 6, H1), -5, H1 / 2, -D + 0.25), new THREE.MeshStandardMaterial({ map: toolWallTexture(), roughness: 0.9 }), { cast: false });
  const innerPlaster = k.mat('flat', '#cfc6b6', { roughness: 1 });
  k.add(at(rotY(new THREE.PlaneGeometry(D - 0.4, H1), -Math.PI / 2), 2.2, H1 / 2, -D / 2), innerPlaster, { cast: false });
  k.add(at(rotY(new THREE.PlaneGeometry(D - 0.4, H1), Math.PI / 2), -W / 2 + 0.25, H1 / 2, -D / 2), innerPlaster, { cast: false });
  k.add(at(rotX(new THREE.PlaneGeometry(W - 6, D - 0.2), Math.PI / 2), -5, H1 - 0.05, -D / 2), dark, { cast: false });
  const liftMat = k.mat('flat', '#c9ccd1', { roughness: 0.5, metalness: 0.6 });
  for (const dx of [-1.35, 1.35]) k.add(at(new THREE.BoxGeometry(0.3, 2.9, 0.3), -4.4 + dx, 1.45, -5.6), liftMat);
  for (const dz of [-0.9, 0.9]) k.add(at(new THREE.BoxGeometry(3.0, 0.12, 0.16), -4.4, 1.28, -5.6 + dz), liftMat);
  const lifted = car('#8c1f25'); lifted.position.set(-4.4, 1.34, -5.6); k.object(lifted);
  k.add(at(box(1.3, 1.05, 0.6, 2, 'fklrt'), -7.1, 0, -2.4), k.mat('flat', spec.accent, { roughness: 0.4, metalness: 0.3 }));
  const tyre = k.mat('flat', '#151515', { roughness: 0.9 });
  for (let i = 0; i < 4; i++) k.add(at(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 18), -1.0, 0.11 + i * 0.23, -9.5), tyre);
  const shopLamp = k.glow(new THREE.MeshStandardMaterial({ color: '#fff4e0', emissive: '#ffe2b8', emissiveIntensity: 0.6, roughness: 0.5 }), 0.6, 5);
  k.add(at(new THREE.BoxGeometry(1.8, 0.05, 0.5), -4.4, 3.7, -5.6), shopLamp, { cast: false });
  k.add(at(new THREE.BoxGeometry(1.8, 0.05, 0.5), -4.4, 3.7, -10.5), shopLamp, { cast: false });
  const pl = new THREE.PointLight('#ffd9ad', 0, 16, 1.4); pl.position.set(-4.4, 3.5, -6.5); k.light(pl, 6, 70);
  // sign band
  K.signBand(k, { x0: -W / 2 - 0.2, x1: W / 2 + 0.2, y: yBand, h: BAND });
  K.sign(k, 'OCTANE FORGE', 'AVTOATELYE  ·  TOSHKENT', { cx: -1.2, cy: yBand + BAND / 2, z: 0.33, w: 6.9, h: 0.8 });
  K.ledStrip(k, -W / 2, W / 2, yBand + 0.01, 0.28);
  K.ledStrip(k, -W / 2 + 0.1, W / 2 - 0.1, yRoof - 0.02, 0.1);
  // upper floor
  const win = { x0: -7.2, x1: 2.0, y0: yUp + 0.7, y1: yUp + 2.5 }, log = { x0: 2.5, x1: 7.4, y0: yUp, y1: yRoof };
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, [win, log], { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  K.window(k, win, { depth: 0.5, step: 1.84, interior: k.interior('office', 3), interiorZ: -1.0, revealMat: innerPlaster, glassMat: k.mat('glass', '#9fb3b0') });
  K.loggia(k, { ...log, depth: 1.7, posts: false, railing: false, woodMat: k.mat('wood', '#c9a579') });
  k.add(at(box(1.6, 0.42, 0.5, 1.2, 'fklrt'), log.x0 + 1.2, yUp + 0.02, -1.7 + 0.4), k.mat('wood', '#c9a579'));   // a bench in the loggia
  K.louvres(k, wood, log.x0, log.x1, yUp, yRoof);
  // roof
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-6, -0.9, 2.4], [-2.5, -0.9, 2.4], [1, -0.9, 2.4], [4.5, -0.9, 2.4]], pergola: { x0: 3.5, x1: 7.3, z0: -13, z1: -10 } });
  K.cornice(k, graphite, W, D, yTop - 0.02);
  K.tower(k, plaster, { x: -6.5, z: -12.4, y: yRoof, h: PAR + 2.3, w: 2.8, d: 3.0 });
  K.vent(k, -1.5, -12, yRoof);
  // entrance
  K.portal(k, openE);
  K.glassDoor(k, openE, { interior: k.interior('lobby', 9, { day: 0.2, night: 1.3 }), interiorZ: -2.2 });
  K.canopy(k, { x0: openE.x0 - 0.6, x1: openE.x1 + 0.6, y: openE.y1 + 0.5, depth: 2.2 });
  K.plate(k, openE.x1 + 0.73, 2.2);
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// MarginFlow CRM — three floors of timber and glass: a curtain wall between timber fins, floor slabs expressed,
// open-plan offices lit inside, a green roof with a pergola
// ---------------------------------------------------------------------------------------------------------------
export function createMarginFlow(spec) {
  const k = K.createKit({ ...spec, seed: 31 });
  const W = 14, D = 14, H0 = 4.2, FH = 3.4, SLAB = 0.45, PAR = 0.6;
  const levels = [0, H0, H0 + SLAB + FH, H0 + 2 * SLAB + 2 * FH];       // floor lines
  const yRoof = levels[3] + SLAB, yTop = yRoof + PAR;
  const timber = k.mat('wood', '#b98a5c');
  const slabMat = k.mat('concrete', '#ddd5c6', { roughness: 0.7 });
  const side = k.mat('plaster', '#d9d0c0');
  const glassMat = k.mat('glass', '#8fb0ab');
  const frameMat = k.mat('metalFlat', '#2b2d31');

  K.plinth(k, k.mat('concrete', '#6b665f', { roughness: 0.85 }), W, D, { h: 0.25 });
  K.shell(k, side, W, D, 0, yRoof, { tile: 3 });
  // the floors: for each level a glass band between fins with a lit interior behind and a slab above
  const fins = [-6.84, -4.0, -1.2, 1.6, 4.4, 6.84];
  const kinds = ['lobby', 'open', 'open'];
  for (let f = 0; f < 3; f++) {
    const y0 = levels[f] + (f === 0 ? 0 : 0), y1 = (f === 2 ? levels[3] : levels[f + 1]);
    const interior = k.interior(kinds[f], 40 + f, { day: f === 0 ? 0.35 : 0.15, night: f === 0 ? 1.3 : 1.05 });
    // glass sheet across the whole width, set 0.35 m back
    k.add(at(new THREE.PlaneGeometry(W - 0.4, y1 - y0 - 0.1), 0, (y0 + y1) / 2, -0.35), glassMat, { cast: false });
    // interior room: back wall picture 1.6 m in, floor and ceiling planes to give depth
    k.add(at(new THREE.PlaneGeometry(W - 0.4, y1 - y0 + 0.3), 0, (y0 + y1) / 2, -1.9), interior, { cast: false });
    k.add(at(rotX(new THREE.PlaneGeometry(W - 0.4, 1.6), -Math.PI / 2), 0, y0 + 0.02, -1.15), k.mat('flat', f === 0 ? '#8a7b68' : '#6f6a62', { roughness: 0.5 }), { cast: false });
    k.add(at(rotX(new THREE.PlaneGeometry(W - 0.4, 1.6), Math.PI / 2), 0, y1 - 0.02, -1.15), k.mat('flat', '#f0ebe2', { roughness: 1 }), { cast: false });
    // transoms and mullions of the curtain wall
    for (const x of fins) k.add(at(new THREE.BoxGeometry(0.06, y1 - y0, 0.1), x, (y0 + y1) / 2, -0.33), frameMat);
    k.add(at(new THREE.BoxGeometry(W - 0.4, 0.06, 0.1), 0, y0 + (y1 - y0) * 0.72, -0.33), frameMat);
    // the slab above the floor, standing proud with a planted edge on the upper ones
    K.slab(k, slabMat, W + 0.3, SLAB, D + 0.15, y1 + SLAB, { z: -D / 2 + 0.15, faces: 'fklrtd', tile: 3 });
  }
  // timber fins in front of the glass, full height, and the top beam
  for (const x of fins) k.add(at(box(0.32, yRoof, 0.5, 1.2, 'fklr'), x, 0, 0.0), timber);
  k.add(at(box(W + 0.3, 0.3, 0.5, 1.2, 'fklrtd'), 0, yRoof - 0.3, 0.0), timber);
  // the door is a part of the ground-floor glass: frame + pulls, a short canopy of timber slats
  const door = { x0: -0.3, x1: 1.4, y0: 0, y1: 2.9 };
  k.add(at(new THREE.BoxGeometry(door.x1 - door.x0 + 0.1, 0.1, 0.08), (door.x0 + door.x1) / 2, door.y1, -0.3), frameMat);
  k.add(at(new THREE.BoxGeometry(1.2, 0.05, 0.12), (door.x0 + door.x1) / 2, 1.02, -0.28), frameMat);
  const slats = k.mat('wood', '#c9a579');
  for (let z = 0.2; z < 2.0; z += 0.3) k.add(at(box(3.4, 0.08, 0.14, 1.2, 'fklrtd'), 0.7, door.y1 + 0.5, z), slats);
  k.add(at(box(0.1, 0.12, 2.0, 1.2, 'fklrt'), -0.95, door.y1 + 0.52, 1.0), slats);
  k.add(at(box(0.1, 0.12, 2.0, 1.2, 'fklrt'), 2.35, door.y1 + 0.52, 1.0), slats);
  // the name: on the ground floor slab, with a small green line
  K.sign(k, 'MARGINFLOW', 'CRM  ·  MCP  ·  TOSHKENT', { cx: -3.0, cy: levels[1] + SLAB / 2 + 0.02, z: 0.26, w: 5.4, h: 0.62, night: 2.4 });
  k.add(at(new THREE.BoxGeometry(5.8, 0.04, 0.05), -3.0, levels[1] + 0.06, 0.26), k.lamp(spec.accent, 0.3, 2.6), { cast: false });
  K.ledStrip(k, -W / 2, W / 2, levels[1] + SLAB - 0.02, 0.2);
  // roof garden
  K.roof(k, { w: W, d: D, y: yRoof, parapet: PAR, wallMat: side, planters: [[-4.5, -1.1, 3.6], [0.5, -1.1, 3.6], [5.0, -1.1, 2.4], [-5.3, -12.4, 3.0]], pergola: { x0: 1.5, x1: 5.5, z0: -12.5, z1: -9.5 }, gravel: '#6f7a66' });
  K.tower(k, side, { x: -5.0, z: -10.0, y: yRoof, h: 2.6, w: 3.0, d: 3.2 });
  // shrubs hanging over the upper slabs
  for (let x = -5.5; x <= 5.5; x += 2.2) { k.shrub(x, levels[2] + SLAB + 0.02, 0.0, 0.5, 0.45, 0.4, Math.round(x * 17 + 3), 22); k.shrub(x + 1.1, levels[3] + SLAB + 0.02, 0.0, 0.45, 0.4, 0.4, Math.round(x * 19 + 5), 20); }
  return k.build({ w: W, d: D, h: yTop });
}

// ---------------------------------------------------------------------------------------------------------------
// Ustoz AI — a learning house: shelves of books behind floor-to-ceiling glass under striped awnings, timber
// shutters upstairs, and a walled courtyard with a chinor at the side
// ---------------------------------------------------------------------------------------------------------------
export function createUstoz(spec) {
  const k = K.createKit({ ...spec, seed: 47 });
  const W = 12, D = 12, H1 = 4.4, H2 = 3.3, PAR = 0.55, CY = 6;  // CY: courtyard width to the right
  const yUp = H1, yRoof = yUp + H2, yTop = yRoof + PAR;
  const brick = k.mat('brick', '#d9c6b0'), plaster = k.mat('plaster', '#ece0cc');
  const wood = k.mat('wood', '#b0865a'), woodLight = k.mat('wood', '#d8b483');
  const stripes = [spec.accent, '#f3ead8'];

  K.plinth(k, k.mat('concrete', '#7a7066', { roughness: 0.85 }), W, D);
  const winA = { x0: -5.2, x1: -1.4, y0: 0.35, y1: 3.9 }, winB = { x0: -0.6, x1: 3.2, y0: 0.35, y1: 3.9 }, door = { x0: 3.9, x1: 5.3, y0: 0, y1: 3.0 };
  K.facade(k, brick, -W / 2, W / 2, 0, H1, [winA, winB, door], { tile: 1.5 });
  K.shell(k, brick, W, D, 0, H1, { tile: 1.5, back: true });
  const books = k.interior('books', 8, { day: 0.4, night: 1.35 });
  for (const o of [winA, winB]) {
    K.window(k, o, { depth: 0.25, step: 1.3, transom: 3.0, interior: books, interiorZ: -1.3, sill: false, glassMat: k.mat('glass', '#b6c4b4') });
    K.awning(k, { x0: o.x0 - 0.2, x1: o.x1 + 0.2, y: o.y1 + 0.15, depth: 1.5, drop: 0.6, colors: stripes });
  }
  K.glassDoor(k, door, { interior: k.interior('lobby', 10, { day: 0.3, night: 1.3 }), interiorZ: -2.0 });
  K.canopy(k, { x0: door.x0 - 0.4, x1: door.x1 + 0.4, y: door.y1 + 0.4, depth: 1.6, topColor: '#3a3026', edge: true, rods: false });
  // the sign sits below the first-floor sills (they stand 0.17 proud of the plaster) and above the awnings
  K.sign(k, 'USTOZ AI', 'O‘QUV MARKAZI  ·  TOSHKENT', { cx: -1.0, cy: H1 + 0.3, z: 0.1, w: 5.0, h: 0.64, night: 2.4 });
  k.add(at(new THREE.BoxGeometry(5.6, 0.04, 0.06), -1.0, H1 - 0.1, 0.1), k.lamp(spec.accent, 0.3, 2.6), { cast: false });
  // upper floor: plaster, four punched windows with timber shutters
  const wins = K.punched(k, [-4.5, -1.5, 1.5, 4.5], 1.45, yUp + 0.75, yUp + 2.55, { depth: 0.3, interior: k.interior('flat', 12), glassMat: k.mat('glass', '#9fb3b0'), sillMat: k.mat('concrete', '#d9d2c4', { roughness: 0.7 }) });
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, wins, { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  for (const o of wins) K.shutters(k, wood, o);
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.4 });
  K.cornice(k, k.mat('metalFlat', GRAPHITE), W, D, yTop - 0.02, { over: 0.35 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-3.6, -1.0, 3.0], [2.4, -1.0, 3.0]], gravel: '#5a5751' });
  K.tower(k, plaster, { x: 4.0, z: -9.6, y: yRoof, h: 2.4, w: 2.8, d: 3.0 });
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, door.x1 + 0.4, 2.0);
  // the courtyard: a brick wall with a timber gate, pavers, a bench, a planter, and a chinor (placed by the street)
  const cx0 = W / 2, cx1 = W / 2 + CY;
  const gate = { x0: cx0 + 2.0, x1: cx0 + 3.6, y0: 0, y1: 1.5 };
  K.facade(k, brick, cx0, cx1, 0, 1.5, [gate], { tile: 1.5 });
  const wallBack = plane(CY, 1.5); wallBack.rotateY(Math.PI); wallBack.translate((cx0 + cx1) / 2, 0.75, -0.3);
  k.add(projectUV(wallBack, 'x', 1.5), brick);
  k.add(at(box(CY + 0.1, 0.1, 0.42, 2, 'fklrtd'), (cx0 + cx1) / 2, 1.5, -0.15), k.mat('concrete', '#d9d2c4', { roughness: 0.7 }));
  const sideWall = plane(D, 1.5); sideWall.rotateY(Math.PI / 2); sideWall.translate(cx1, 0.75, -D / 2);
  k.add(projectUV(sideWall, 'z', 1.5), brick);
  const sideWallIn = plane(D, 1.5); sideWallIn.rotateY(-Math.PI / 2); sideWallIn.translate(cx1 - 0.02, 0.75, -D / 2);
  k.add(projectUV(sideWallIn, 'z', 1.5), brick);
  const yardBack = plane(CY, 1.5); yardBack.rotateY(Math.PI); yardBack.translate((cx0 + cx1) / 2, 0.75, -D);
  k.add(projectUV(yardBack, 'x', 1.5), brick);
  const yardBackIn = plane(CY, 1.5); yardBackIn.translate((cx0 + cx1) / 2, 0.75, -D + 0.02);
  k.add(projectUV(yardBackIn, 'x', 1.5), brick);
  k.add(at(box(CY + 0.1, 0.1, 0.42, 2, 'fklrtd'), (cx0 + cx1) / 2, 1.5, -D + 0.15), k.mat('concrete', '#d9d2c4', { roughness: 0.7 }));
  k.add(at(box(0.42, 0.1, D, 2, 'fklrtd'), cx1 - 0.01, 1.5, -D / 2), k.mat('concrete', '#d9d2c4', { roughness: 0.7 }));
  for (const x of [gate.x0 - 0.12, gate.x1 + 0.12]) k.add(at(box(0.24, 1.9, 0.3, 1.2, 'fklrt'), x, 0, -0.15), wood);
  const leaf = rotY(box(0.75, 1.4, 0.05, 1.2, 'fklr'), -0.9); leaf.translate(gate.x0 + 0.42, 0.05, -0.2); k.add(leaf, woodLight);
  k.add(at(rotX(plane(CY - 0.4, D - 0.5, 2.4), -Math.PI / 2), (cx0 + cx1) / 2, 0.01, -D / 2 - 0.1), k.mat('pavers', '#cfc8ba'), { cast: false });
  // a bench against the house wall, a planter, a pendant string of lights across the yard
  for (let i = 0; i < 3; i++) k.add(at(box(1.8, 0.045, 0.1, 1.2, 'fklrt'), cx0 + 1.4, 0.42, -4.0 + i * 0.14), woodLight);
  for (const dz of [-0.7, 0.7]) k.add(at(new THREE.BoxGeometry(0.05, 0.42, 0.5), cx0 + 1.4 + dz, 0.21, -3.85), k.mat('metalFlat', GRAPHITE));
  k.add(at(box(1.0, 0.5, 0.6, 2, 'fklrt'), cx1 - 0.9, 0, -1.2), k.mat('flat', '#8a4a2a', { roughness: 0.85, metalness: 0.25 }));
  k.shrub(cx1 - 0.9, 0.48, -1.2, 0.5, 0.6, 0.35, 61, 30);
  const bulbs = k.lamp('#ffd9a8', 0, 3.2);
  for (let i = 0; i < 7; i++) k.add(at(new THREE.SphereGeometry(0.06, 8, 6), cx0 + 0.6 + i * 0.8, 3.1 - Math.sin(i / 6 * Math.PI) * 0.35, -2.5), bulbs, { cast: false });
  const yardLight = new THREE.PointLight('#ffd9a8', 0, 9, 1.5); yardLight.position.set(cx0 + 3, 3.0, -3.0); k.light(yardLight, 0, 10);
  // the house's side door into the yard
  k.add(at(rotY(new THREE.PlaneGeometry(1.0, 2.2), Math.PI / 2), cx0 + 0.02, 1.1, -5.5), k.mat('flat', '#3d3128', { roughness: 0.7 }), { cast: false });
  return k.build({ w: W + CY, d: D, h: yTop, hitX: CY / 2, trees: [{ x: cx0 + 3.4, z: -7.0, k: 0.95, seed: 57 }] });
}

// ---------------------------------------------------------------------------------------------------------------
// Domus Estate — four floors: a majolica portal and showroom windows below, ayvans with timber columns stacked
// on the right, punched windows with shutters on the left, a passage into the courtyard, a roof garden
// ---------------------------------------------------------------------------------------------------------------
export function createDomus(spec) {
  const k = K.createKit({ ...spec, seed: 71 });
  const W = 18, D = 16, H1 = 4.6, FH = 3.2, PAR = 0.6;
  const yUp = H1, yRoof = yUp + 3 * FH, yTop = yRoof + PAR;
  const base = k.mat('brick', '#d8b996');
  const plaster = k.mat('plaster', '#e9d9c0');
  const wood = k.mat('wood', '#a97b52'), woodLight = k.mat('wood', '#cfa877');
  const graphite = k.mat('metalFlat', GRAPHITE);

  K.plinth(k, k.mat('concrete', '#6f655a', { roughness: 0.85 }), W, D, { h: 0.35 });
  // ground floor: showroom windows, portal, the passage
  const showA = { x0: -8.2, x1: -5.4, y0: 0.6, y1: 3.6 }, showB = { x0: -4.8, x1: -2.0, y0: 0.6, y1: 3.6 };
  const portal = { x0: -1.2, x1: 1.6, y0: 0, y1: 3.4 }, passage = { x0: 5.0, x1: 8.0, y0: 0, y1: 3.7 };
  K.facade(k, base, -W / 2, W / 2, 0, H1, [showA, showB, portal, passage], { tile: 1.5 });
  K.shell(k, base, W, D, 0, H1, { tile: 1.5 });
  const showroom = k.interior('showroom', 14, { day: 0.4, night: 1.35 });
  for (const o of [showA, showB]) K.window(k, o, { depth: 0.3, step: 1.5, interior: showroom, interiorZ: -1.4, sillMat: k.mat('concrete', '#cdbfa8', { roughness: 0.7 }), glassMat: k.mat('glass', '#aebfb8') });
  K.portal(k, portal);
  K.glassDoor(k, portal, { interior: k.interior('lobby', 15, { day: 0.25, night: 1.3 }), interiorZ: -2.4 });
  K.canopy(k, { x0: portal.x0 - 0.7, x1: portal.x1 + 0.7, y: portal.y1 + 0.55, depth: 2.2 });
  // the passage: majolica lining, pavers, a lit view of the courtyard at the far end
  K.portal(k, passage, { jamb: 0.3 });
  K.reveals(k, k.mat('majolica', '#'), passage, 1.2);
  K.reveals(k, k.mat('flat', '#d8cbb5', { roughness: 1 }), passage, D - 1.6, -1.2);
  k.add(at(rotX(plane(passage.x1 - passage.x0, D, 2.4), -Math.PI / 2), (passage.x0 + passage.x1) / 2, 0.012, -D / 2), k.mat('pavers', '#cfc8ba'), { cast: false });
  const yard = k.interior('yard', 16, { day: 0.7, night: 0.55 });
  k.add(at(new THREE.PlaneGeometry(passage.x1 - passage.x0 + 1.0, passage.y1 + 0.4), (passage.x0 + passage.x1) / 2, passage.y1 / 2, -D + 0.4), yard, { cast: false });
  const passLamp = k.lamp('#ffd9a8', 0.2, 3.0);
  for (const z of [-3, -8, -13]) k.add(at(new THREE.BoxGeometry(0.8, 0.05, 0.12), (passage.x0 + passage.x1) / 2, passage.y1 - 0.08, z), passLamp, { cast: false });
  const pl = new THREE.PointLight('#ffd9a8', 0, 10, 1.4); pl.position.set((passage.x0 + passage.x1) / 2, 3.2, -6); k.light(pl, 2, 18);
  // below the first-floor sills (y 5.32) and above the led strip at the storey line
  K.sign(k, 'DOMUS ESTATE', 'JK  ·  3D  ·  AI-YORDAMCHI', { cx: -2.0, cy: H1 + 0.4, z: 0.1, w: 6.0, h: 0.6, night: 2.4 });
  K.ledStrip(k, -W / 2, W / 2, H1 + 0.08, 0.06, { night: 2.0 });
  // upper floors: plaster, punched windows with shutters on the left half, ayvans on the right half
  const openings = [];
  const left = k.interior('flat', 17);
  for (let f = 0; f < 3; f++) {
    const y0 = yUp + f * FH;
    const wins = K.punched(k, [-6.8, -3.6, -0.6], 1.45, y0 + 0.8, y0 + 2.6, { depth: 0.3, interior: left, glassMat: k.mat('glass', '#9fb3b0'), sillMat: k.mat('concrete', '#d4c6ae', { roughness: 0.7 }) });
    openings.push(...wins);
    for (const o of wins) K.shutters(k, wood, o);
    const log = { x0: 1.4, x1: 8.4, y0, y1: y0 + FH };
    openings.push(log);
    K.loggia(k, { ...log, depth: 2.0, posts: true, railing: true, woodMat: woodLight, wallMat: k.mat('flat', '#efe3cf', { roughness: 1 }) });
    // floor edge of the ayvan, a band in timber
    k.add(at(box(log.x1 - log.x0 + 0.2, 0.3, 0.3, 1.2, 'fklrtd'), (log.x0 + log.x1) / 2, y0 - 0.2, 0.0), woodLight);
  }
  K.facade(k, plaster, -W / 2, W / 2, yUp, yTop, openings, { tile: 3 });
  K.shell(k, plaster, W, D, yUp, yTop, { tile: 3 });
  K.ledStrip(k, -W / 2 + 0.2, W / 2 - 0.2, yRoof - 0.02, 0.1, { night: 2.4 });
  K.cornice(k, graphite, W, D, yTop - 0.02, { over: 0.4 });
  K.roof(k, { w: W, d: D, y: yRoof, parapet: 0, planters: [[-6.5, -1.0, 3.0], [-2.5, -1.0, 3.0], [1.5, -1.0, 3.0], [5.5, -1.0, 3.0], [-7.0, -14.5, 3.0]], pergola: { x0: 2.5, x1: 7.5, z0: -14.5, z1: -11 }, gravel: '#5b5751' });
  K.tower(k, plaster, { x: -6.3, z: -12.0, y: yRoof, h: 2.6, w: 3.0, d: 3.4 });
  K.vent(k, -1.5, -13, yRoof);
  K.downpipe(k, -W / 2 + 0.25, yRoof);
  K.plate(k, portal.x1 + 0.75, 2.2);
  return k.build({ w: W, d: D, h: yTop });
}
