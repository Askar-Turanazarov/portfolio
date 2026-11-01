// Liquid glass for the card over the street. Nothing is rendered twice: after the frame is finished, the part of it
// under the card is copied to a texture and one quad, the size of the card, draws it back bent and blurred. With the
// card closed this costs nothing at all.
import * as THREE from 'three';

const MARGIN = 56;      // CSS px copied around the card, so the bent edge has something to look at
const RADIUS = 22;      // the card's corner, the same as its CSS

const frag = /* glsl */`
  precision highp float;
  uniform sampler2D uFrame;
  uniform vec2 uOrigin, uCopy, uCentre, uHalf;
  uniform float uPr, uBlur, uTintA, uRim, uFade, uRadius, uK;
  uniform vec3 uTint;
  uniform int uTaps;
  vec3 sampleAt(vec2 frag) { return texture2D(uFrame, (frag - uOrigin) / uCopy).rgb; }
  void main() {
    vec2 p = gl_FragCoord.xy - uCentre;
    float R = uRadius * uPr, L = 40. * uPr;                         // corner; width of the lens along the edge
    vec2 qr = abs(p) - uHalf + R;
    float d = length(max(qr, 0.)) + min(max(qr.x, qr.y), 0.) - R;   // signed distance to the rounded edge, inside < 0
    float depth = -d;
    vec2 ql = max(abs(p) - uHalf + L, 0.);                          // the outward normal; it rounds the inner corners too
    vec2 n = length(ql) > 0. ? normalize(ql) * sign(p) : vec2(0.);
    float lens = pow(clamp(1. - depth / L, 0., 1.), 2.);
    vec2 bend = -n * lens * 38. * uPr;
    vec3 c = vec3(0.);
    // a golden-angle spiral of taps; through the lens red and blue bend a little differently, and as blurred as the rest
    for (int i = 0; i < uTaps; i++) {
      float f = float(i) + .5, r = sqrt(f / float(uTaps)) * uBlur * uPr, a = f * 2.39996;
      vec2 o = gl_FragCoord.xy + vec2(cos(a), sin(a)) * r;
      vec3 t = sampleAt(o + bend);
      if (uRim > 0.) { t.r = sampleAt(o + bend * .94).r; t.b = sampleAt(o + bend * 1.08).b; }
      c += t;
    }
    c /= float(uTaps);
    float l = dot(c, vec3(.299, .587, .114));
    c = mix(vec3(l), c, 1.45);
    l = dot(c, vec3(.299, .587, .114));
    // only as much tint as the text needs: light ink needs at most .38 under it by evening, dark ink at least .72 by day
    float tl = dot(uTint, vec3(.299, .587, .114));
    float need = mix(clamp((.72 - l) / max(tl - l, .001), 0., 1.), clamp((l - .38) / max(l - tl, .001), 0., 1.), uK);
    c = mix(c, uTint, max(uTintA, need));
    // the edge catches the light from the top left; a soft arc lies under the upper rim
    float side = .5 + .5 * dot(normalize(p / uHalf + 1e-4), vec2(-.7071, .7071));
    float rim = smoothstep(1.2 * uPr, 0., abs(d + .6 * uPr)) * mix(.25, .8, side);
    float arc = exp(-pow((depth - 9. * uPr) / (6. * uPr), 2.)) * max(n.y, 0.) * .14;
    gl_FragColor = vec4(c + rim * .55 + arc, smoothstep(.75, -.75, d) * uFade);
  }`;

export function createGlass(renderer) {
  const u = {
    uFrame: { value: null }, uOrigin: { value: new THREE.Vector2() }, uCopy: { value: new THREE.Vector2(1, 1) },
    uCentre: { value: new THREE.Vector2() }, uHalf: { value: new THREE.Vector2(1, 1) },
    uClip: { value: new THREE.Vector4() }, uPr: { value: 1 }, uBlur: { value: 7 }, uTaps: { value: 13 },
    uTintA: { value: 0.22 }, uRim: { value: 1 }, uFade: { value: 0 }, uRadius: { value: RADIUS }, uK: { value: 0 }, uTint: { value: new THREE.Color() },
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
    u.uTaps.value = m === 'half' ? 5 : 13;
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
      // clear white by day, a cool graphite by evening
      u.uTint.value.setRGB(1 + (0.16 - 1) * k, 1 + (0.18 - 1) * k, 1 + (0.22 - 1) * k, THREE.LinearSRGBColorSpace);
      u.uTintA.value = 0.22 + (0.12 - 0.22) * k;
      u.uK.value = k;
    },
    get active() { return !!rect; },
    get fading() { return !!rect && u.uFade.value < 1; },
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
