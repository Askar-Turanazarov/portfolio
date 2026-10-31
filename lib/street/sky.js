// The sky: a gradient dome (zenith → mid → horizon, ground below) with a soft sun glow, and the same dome
// rendered once into a PMREM environment so glass, paint and water reflect a sky of the right colour.
import * as THREE from 'three';

const vert = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const frag = /* glsl */`
uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 ground;
uniform vec3 sunDir; uniform vec3 sunColor; uniform float glow;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col;
  if (h < 0.0) col = mix(horizon, ground, smoothstep(0.0, 0.12, -h));
  else {
    col = mix(horizon, mid, smoothstep(0.0, 0.22, h));
    col = mix(col, top, smoothstep(0.18, 0.75, h));
  }
  float s = max(dot(d, sunDir), 0.0);
  col += sunColor * glow * (0.35 * pow(s, 8.0) + 1.2 * pow(s, 90.0));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function createSky(renderer) {
  const uniforms = {
    top: { value: new THREE.Color('#86a9d6') }, mid: { value: new THREE.Color('#cfe0f0') },
    horizon: { value: new THREE.Color('#eef1ec') }, ground: { value: new THREE.Color('#9c9484') },
    sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunColor: { value: new THREE.Color('#ffa15a') }, glow: { value: 0 }
  };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, side: THREE.BackSide, depthWrite: false, fog: false });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 16), mat);
  dome.renderOrder = -10;
  dome.frustumCulled = false;
  // environment: the same dome in a scene of its own
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 24, 12), mat));
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  let envTex = null;

  function set(colors, sunDir, sunColor, glow) {
    uniforms.top.value.set(colors.top); uniforms.mid.value.set(colors.mid);
    uniforms.horizon.value.set(colors.horizon); uniforms.ground.value.set(colors.ground);
    uniforms.sunDir.value.copy(sunDir); uniforms.sunColor.value.set(sunColor); uniforms.glow.value = glow;
  }
  /** Colours as THREE.Color instances (for the lerp). */
  function setColors(top, mid, horizon, ground, sunDir, sunColor, glow) {
    uniforms.top.value.copy(top); uniforms.mid.value.copy(mid); uniforms.horizon.value.copy(horizon); uniforms.ground.value.copy(ground);
    uniforms.sunDir.value.copy(sunDir); uniforms.sunColor.value.copy(sunColor); uniforms.glow.value = glow;
  }
  /** Render the current sky into an environment map (call after set/setColors). */
  function bakeEnvironment() {
    const old = envTex;
    const glow = uniforms.glow.value;
    uniforms.glow.value = Math.min(glow, 0.4);     // keep the sun disc from blowing out reflections
    envTex = pmrem.fromScene(envScene, 0.04).texture;
    uniforms.glow.value = glow;
    if (old) old.dispose();
    return envTex;
  }
  function dispose() { mat.dispose(); dome.geometry.dispose(); pmrem.dispose(); envTex?.dispose(); }
  return { dome, set, setColors, bakeEnvironment, dispose, uniforms };
}
