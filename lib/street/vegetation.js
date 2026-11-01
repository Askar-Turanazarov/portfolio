// Vegetation materials and the on-thread entry points. The geometry (crowns of leaf cards, shrubs) and the leaf
// atlases are built by foliage.js — in a worker when the scene boots (build.js), on this thread for the shrubs the
// building kit plants while it builds. The leaf materials start with a 2×2 stand-in of the same kind as the atlas
// (DataTexture, own mips, sRGB), so swapping the atlas in later keeps the compiled program.
import * as THREE from 'three';
import { chinorBarkTexture, anisotropyCap } from './materials.js';
import { shrubGeometry, LEAF_GROUND, SHRUB_GROUND } from './foliage.js';

let _leaf = null, _shrub = null, _bark = null;
const windT = { value: 0 };

/** Moves the wind in every crown; the shader does the rest, so the geometry is never touched. */
export function setWind(t) { windT.value = t; }

/**
 * The material of leaf cards. Double-sided, but the back face is lit with the same normal as the front: the normal
 * is the crown's (set per vertex in cardCloud), not the card's, so a card seen from behind is as bright as one seen
 * from the front and a crown never splits into lit and dark panels when the sun moves to the other side.
 * Between fade[0] and fade[1] metres from the camera the alpha goes to zero, so the cut-out dissolves leaf by
 * leaf before a card could be clipped by the near plane or hang across the sky in front of the eye.
 */
function foliageMaterial(map, roughness, fade, sway) {
  const m = new THREE.MeshStandardMaterial({ map, alphaTest: 0.4, side: THREE.DoubleSide, roughness, vertexColors: true });
  const [f0, f1] = fade;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uWindT = windT;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vNearFade;\nuniform float uWindT;')
      // two slow waves running through the crown; the higher a leaf, the more it moves
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float wPhase = position.x * 0.35 + position.z * 0.27;
        float wAmp = ${sway.toFixed(3)} * min(1.0, position.y / 5.0);
        transformed.x += wAmp * (sin(uWindT * 1.1 + wPhase) + 0.5 * sin(uWindT * 2.3 + wPhase * 1.7 + position.y));
        transformed.z += wAmp * 0.6 * sin(uWindT * 0.9 + wPhase * 1.3 + position.y * 0.6);`)
      .replace('#include <project_vertex>', `#include <project_vertex>\nvNearFade = smoothstep(${f0.toFixed(2)}, ${f1.toFixed(2)}, length(mvPosition.xyz));`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vNearFade;')
      .replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('normal *= faceDirection;', ''))
      .replace('#include <alphatest_fragment>', 'diffuseColor.a *= vNearFade;\n#include <alphatest_fragment>');
  };
  m.customProgramCacheKey = () => `foliage${f0}-${f1}-${sway}`;
  return m;
}

/** A DataTexture with its own mip chain from atlas data { base, mips, W } (see foliage.js). */
export function atlasTexture({ base, mips, W }) {
  const t = new THREE.DataTexture(base, W, W);
  t.mipmaps = mips;
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, anisotropyCap());
  t.needsUpdate = true;
  return t;
}
function placeholderAtlas(hex) {
  const n = parseInt(hex.slice(1), 16), px = [n >> 16, (n >> 8) & 255, n & 255, 255];
  const base = new Uint8Array([...px, ...px, ...px, ...px]);
  return atlasTexture({ base, mips: [{ data: base, width: 2, height: 2 }, { data: new Uint8Array(px), width: 1, height: 1 }], W: 2 });
}

export function leafMaterial() {
  if (!_leaf) _leaf = foliageMaterial(placeholderAtlas(LEAF_GROUND), 0.85, [1.5, 3.5], 0.09);
  return _leaf;
}
export function shrubMaterial() {
  if (!_shrub) _shrub = foliageMaterial(placeholderAtlas(SHRUB_GROUND), 0.9, [0.7, 1.8], 0.05);
  return _shrub;
}
export function barkMaterial() {
  if (!_bark) { const t = chinorBarkTexture(); t.repeat.set(1, 2); _bark = new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, color: '#d2cdbe' }); }
  return _bark;
}

/** Put the built atlases into the leaf materials (the stand-ins go). */
export function setAtlases({ chinorAtlas, shrubAtlas }) {
  for (const [m, data] of [[leafMaterial(), chinorAtlas], [shrubMaterial(), shrubAtlas]]) {
    const old = m.map;
    m.map = atlasTexture(data);
    old?.dispose();
  }
}

/** A shrub's geometry, built on this thread (the kit plants a few per building as it builds). */
export function shrub(x, y, z, rx, ry, rz, seed, n = 20) {
  return shrubGeometry({ x, y, z, rx, ry, rz, seed, n });
}
