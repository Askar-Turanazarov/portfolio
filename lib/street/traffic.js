// A few cars driving past. They are the only moving objects at street level, so they stay cheap: no real shadow (the
// sun's shadow map is static and would keep a ghost of them), a soft contact patch under each one instead.
import * as THREE from 'three';
import { car } from './props.js';
import { canvasTexture } from './materials.js';

const RANGE = 95;   // cars loop within this distance of the camera; at the ends they are behind the frame
const BEAM_L = 11, BEAM_W = 6.2, BEAM_NIGHT = 0.18;

/** The pool of both headlights on the road, seen from above: two soft cones from the nose, fading with distance. */
function drawBeams(g, w, h) {
  const smooth = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const img = g.createImageData(w, h);
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const d = (px / (w - 1)) * BEAM_L, z = (py / (h - 1) - 0.5) * BEAM_W, spread = 0.18 + d * 0.2;
    let a = 0;
    for (const lamp of [-0.6, 0.6]) a += 1 - smooth(spread * 0.45, spread, Math.abs(z - lamp));
    a = Math.min(1, a) * smooth(0, 0.8, d) * (1 - smooth(BEAM_L * 0.25, BEAM_L, d));
    const i = (py * w + px) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
    img.data[i + 3] = a * 255;
  }
  g.putImageData(img, 0, 0);
}

export function createTraffic({ laneForward, laneBack, y = 0 }) {
  const group = new THREE.Group();
  group.name = 'traffic';
  const patch = canvasTexture(128, 64, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.scale(1, h / w);
    const r = g.createRadialGradient(0, 0, w * 0.2, 0, 0, w / 2);
    r.addColorStop(0, 'rgba(0,0,0,1)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.beginPath(); g.arc(0, 0, w / 2, 0, Math.PI * 2); g.fill();
    g.restore();
  }, { scalable: false });
  const patchMat = new THREE.MeshBasicMaterial({ map: patch, color: '#000000', transparent: true, opacity: 0.45, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const patchGeo = new THREE.PlaneGeometry(5.4, 2.6).rotateX(-Math.PI / 2);
  const headMat = new THREE.MeshStandardMaterial({ color: '#d9d6cc', emissive: '#fff0c8', emissiveIntensity: 0, roughness: 0.3 });
  const tailMat = new THREE.MeshStandardMaterial({ color: '#6e1712', emissive: '#ff2a18', emissiveIntensity: 0, roughness: 0.4 });
  const lampGeo = new THREE.BoxGeometry(0.06, 0.13, 0.34);
  // A real light per lamp would cost every lit material on the street; the pool is one flat quad per car. No fog:
  // with additive blending it would add the fog's colour. It only exists while the lamps are on.
  const beamMat = new THREE.MeshBasicMaterial({ map: canvasTexture(256, 128, drawBeams, { scalable: false, srgb: false }), color: '#ffe6bd', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, visible: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  const beamGeo = new THREE.PlaneGeometry(BEAM_L, BEAM_W).rotateX(-Math.PI / 2);
  const beamLevel = { set emissiveIntensity(v) { beamMat.opacity = v; beamMat.visible = v > 0.005; } };

  const cars = [
    { paint: '#2f5d8a', v: 8.5, dir: 1, x: -60 },
    { paint: '#d8d4ca', v: 7.2, dir: 1, x: 25 },
    { paint: '#8c2f2a', v: 7.8, dir: -1, x: 60 },
    { paint: '#3a3d44', v: 9, dir: -1, x: -15 }
  ].map((c) => {
    const o = car(c.paint);
    o.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    const shade = new THREE.Mesh(patchGeo, patchMat);
    shade.position.y = 0.03; shade.renderOrder = 1;
    o.add(shade);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(1.95 + BEAM_L / 2, 0.035, 0); beam.renderOrder = 2;
    o.add(beam);
    for (const z of [-0.6, 0.6]) {
      const head = new THREE.Mesh(lampGeo, headMat); head.position.set(2.17, 0.66, z); o.add(head);
      const tail = new THREE.Mesh(lampGeo, tailMat); tail.position.set(-2.17, 0.68, z); o.add(tail);
    }
    o.position.set(c.x, y, c.dir > 0 ? laneForward : laneBack);
    o.rotation.y = c.dir > 0 ? 0 : Math.PI;
    group.add(o);
    return { ...c, o };
  });

  function step(dt, camX) {
    for (const c of cars) {
      let x = c.o.position.x + c.v * c.dir * dt - camX;
      if (Math.abs(x) > RANGE) x = ((x + RANGE) % (2 * RANGE) + 2 * RANGE) % (2 * RANGE) - RANGE;   // also after a long jump of the camera
      c.o.position.x = x + camX;
    }
  }
  return { group, step, movers: cars.map((c) => c.o), emissives: [{ mat: headMat, day: 0, night: 5 }, { mat: tailMat, day: 0.15, night: 3 }, { mat: beamLevel, day: 0, night: BEAM_NIGHT }] };
}
