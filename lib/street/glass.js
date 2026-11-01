// Liquid glass for the card over the street. Nothing is rendered twice: after the frame is finished, the part of it
// under the card is copied to a texture and one quad, the size of the card, draws it back bent and blurred. With the
// card closed this costs nothing at all.
import * as THREE from 'three';

const MARGIN = 28;      // CSS px copied around the card, so the bent edge has something to look at

const frag = /* glsl */`
  precision highp float;
  uniform sampler2D uFrame;
  uniform vec2 uOrigin, uCopy, uCentre, uHalf;
  uniform float uPr, uBlur, uTintA, uRim, uFade;
  uniform vec3 uTint;
  uniform int uTaps;
  vec3 sampleAt(vec2 frag) { return texture2D(uFrame, (frag - uOrigin) / uCopy).rgb; }
  void main() {
    vec2 p = gl_FragCoord.xy - uCentre, q = abs(p) - uHalf;
    float depth = -max(q.x, q.y);                                   // distance in from the edge
    vec2 n = q.x > q.y ? vec2(sign(p.x), 0.) : vec2(0., sign(p.y));
    float lens = pow(clamp(1. - depth / (22. * uPr), 0., 1.), 2.);
    vec2 bend = -n * lens * 16. * uPr;
    vec3 c = vec3(0.);
    // a golden-angle spiral of taps
    for (int i = 0; i < uTaps; i++) {
      float f = float(i) + .5, r = sqrt(f / float(uTaps)) * uBlur * uPr, a = f * 2.39996;
      c += sampleAt(gl_FragCoord.xy + bend + vec2(cos(a), sin(a)) * r);
    }
    c /= float(uTaps);
    if (uRim > 0.) {                                                // the edge splits the light a little
      vec3 s = vec3(sampleAt(gl_FragCoord.xy + bend * 1.14).r, c.g, sampleAt(gl_FragCoord.xy + bend * .86).b);
      c = mix(c, s, lens * uRim);
    }
    float l = dot(c, vec3(.299, .587, .114));
    c = mix(vec3(l), c, 1.3);
    c = mix(c, uTint, uTintA);
    // a highlight along the top and left edges
    float glint = smoothstep(2.5 * uPr, 0., depth) * (.34 + .3 * clamp((p.y / uHalf.y - p.x / uHalf.x) * .5, -1., 1.));
    gl_FragColor = vec4(c + glint, uFade);
  }`;

export function createGlass(renderer) {
  const u = {
    uFrame: { value: null }, uOrigin: { value: new THREE.Vector2() }, uCopy: { value: new THREE.Vector2(1, 1) },
    uCentre: { value: new THREE.Vector2() }, uHalf: { value: new THREE.Vector2(1, 1) },
    uClip: { value: new THREE.Vector4() }, uPr: { value: 1 }, uBlur: { value: 14 }, uTaps: { value: 13 },
    uTintA: { value: 0.5 }, uRim: { value: 1 }, uFade: { value: 0 }, uTint: { value: new THREE.Color() },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: u, fragmentShader: frag, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    vertexShader: `uniform vec4 uClip; void main() { gl_Position = vec4(uClip.xy + position.xy * uClip.zw, 0., 1.); }`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const scene = new THREE.Scene(); scene.add(quad);
  const camera = new THREE.Camera();
  const size = new THREE.Vector2(), at = new THREE.Vector2();
  let tex = null, rect = null, mode = 'none';

  function setMode(m) {
    mode = m;
    u.uTaps.value = m === 'half' ? 5 : m === 'more' ? 21 : 13;
    u.uBlur.value = m === 'more' ? 20 : 14;
    u.uRim.value = m === 'half' ? 0 : 1;
  }
  return {
    setMode,
    /** The card's box in CSS px from the canvas' top left, or null. False when this level leaves the glass to CSS. */
    setRect(next) {
      if (!next || mode === 'none') { rect = null; u.uFade.value = 0; return false; }
      rect = next;
      return true;
    },
    setTint(k) {
      // paper by day, charcoal by evening, the same as the page's --glass
      u.uTint.value.setRGB(0.97 + (0.2 - 0.97) * k, 0.96 + (0.19 - 0.96) * k, 0.94 + (0.18 - 0.94) * k, THREE.LinearSRGBColorSpace);
      u.uTintA.value = 0.5 + 0.1 * k;
    },
    get active() { return !!rect; },
    /** Call right after the frame reached the canvas. */
    draw(dt) {
      if (!rect) return;
      const pr = renderer.getPixelRatio();
      renderer.getDrawingBufferSize(size);
      const x0 = rect.x * pr, y0 = size.y - (rect.y + rect.h) * pr, w = rect.w * pr, h = rect.h * pr, m = MARGIN * pr;
      const cx = Math.max(0, Math.floor(x0 - m)), cy = Math.max(0, Math.floor(y0 - m));
      const cw = Math.min(size.x - cx, Math.ceil(w + 2 * m)), ch = Math.min(size.y - cy, Math.ceil(h + 2 * m));
      if (cw < 2 || ch < 2) return;
      if (!tex || tex.image.width !== cw || tex.image.height !== ch) {
        tex?.dispose();
        tex = new THREE.FramebufferTexture(cw, ch);
        tex.minFilter = tex.magFilter = THREE.LinearFilter;
        u.uFrame.value = tex;
      }
      renderer.copyFramebufferToTexture(tex, at.set(cx, cy));
      u.uOrigin.value.set(cx, cy);
      u.uCopy.value.set(cw, ch);
      u.uCentre.value.set(x0 + w / 2, y0 + h / 2);
      u.uHalf.value.set(w / 2, h / 2);
      u.uClip.value.set(((x0 + w / 2) / size.x) * 2 - 1, ((y0 + h / 2) / size.y) * 2 - 1, w / size.x, h / size.y);
      u.uPr.value = pr;
      u.uFade.value = Math.min(1, u.uFade.value + dt / 0.2);
      const auto = renderer.autoClear;
      renderer.autoClear = false;
      renderer.render(scene, camera);
      renderer.autoClear = auto;
    },
    dispose() { tex?.dispose(); material.dispose(); quad.geometry.dispose(); },
  };
}
