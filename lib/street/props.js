// Small props shared by the street and the buildings: a car built from a side profile.
import * as THREE from 'three';
import { at, rotX, mesh, mergeGeometries } from './geo.js';

// from the tail (-x, short boot) to the nose (+x, long bonnet)
const bodyProfile = [[-2.15, 0.30], [-2.15, 0.62], [-2.05, 0.86], [-1.45, 0.92], [-1.05, 1.28], [-0.35, 1.34], [0.55, 1.26], [0.95, 0.88], [1.45, 0.86], [2.05, 0.80], [2.15, 0.62], [2.15, 0.30]];
const cabinProfile = [[-1.42, 0.93], [-1.05, 1.27], [-0.35, 1.33], [0.52, 1.25], [0.92, 0.9]];

function extrude(points, depth) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (const p of points.slice(1)) s.lineTo(p[0], p[1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** A sedan 4.3 m long along x, wheels on y = 0, nose towards +x. */
export function car(paint, { metallic = true } = {}) {
  const grp = new THREE.Group();
  const paintMat = new THREE.MeshPhysicalMaterial({ color: paint, roughness: 0.3, metalness: metallic ? 0.5 : 0.1, clearcoat: 1, clearcoatRoughness: 0.08 });
  grp.add(mesh(extrude(bodyProfile, 1.7), paintMat));
  const glassMat = new THREE.MeshStandardMaterial({ color: '#1b2026', roughness: 0.12, metalness: 0.6 });
  grp.add(mesh(extrude(cabinProfile, 1.8), glassMat, { cast: false }));
  const tyre = new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.9 });
  const wheels = [];
  for (const [wx, wz] of [[-1.35, -0.78], [1.35, -0.78], [-1.35, 0.78], [1.35, 0.78]]) wheels.push(at(rotX(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 20), Math.PI / 2), wx, 0.34, wz));
  grp.add(mesh(mergeGeometries(wheels), tyre));
  const rims = new THREE.MeshStandardMaterial({ color: '#b9bcc2', roughness: 0.35, metalness: 0.8 });
  const rimG = [];
  for (const [wx, wz] of [[-1.35, -0.9], [1.35, -0.9], [-1.35, 0.9], [1.35, 0.9]]) rimG.push(at(rotX(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16), Math.PI / 2), wx, 0.34, wz));
  grp.add(mesh(mergeGeometries(rimG), rims, { cast: false }));
  return grp;
}
