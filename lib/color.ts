/** sRGB hex → OKLCH, pure math (Björn Ottosson's matrices), no dependencies. */
export function oklch(hex: string): { L: number; C: number; H: number } {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = lin((n >> 16) & 255);
  const g = lin((n >> 8) & 255);
  const b = lin(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(a, bb), H: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

/** The text colour readable on a solid fill: whichever of black and white has more contrast (always at least 4.5:1). */
export function onColor(hex: string): "#000" | "#fff" {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const Y = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return 1.05 / (Y + 0.05) > (Y + 0.05) / 0.05 ? "#fff" : "#000";
}

/**
 * The colour field a project spread stands on: its accent's hue at paper lightness by day
 * and at charcoal lightness by evening. Hue tells the projects apart, lightness stays calm.
 */
export function fieldFor(hex: string): { light: string; dark: string } {
  const { C, H } = oklch(hex);
  const h = H.toFixed(0);
  return {
    light: `oklch(0.955 ${Math.min(0.02, C * 0.35).toFixed(3)} ${h})`,
    dark: `oklch(0.30 ${Math.min(0.05, Math.max(0.03, C * 0.4)).toFixed(3)} ${h})`,
  };
}
