// Lit interiors seen through shopfronts and windows, one drawing per kind of business, plus the small canvas
// textures the building kit needs (awning stripes, a glazed curtain wall). Everything here is procedural.
import { canvasTexture } from './materials.js';

const lcg = (seed) => { let s = seed || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

/**
 * kind: 'office' (desks, lamps, plants) · 'open' (open-plan office, long tables, screens) · 'lobby' (reception
 * desk, a round lamp, a plant) · 'clinic' (white reception, chairs, the clinic's name on the wall) · 'pc' (dark
 * shop, glowing PC towers in the accent colour) · 'books' (floor-to-ceiling shelves) · 'showroom' (furniture
 * pieces under a row of pendants) · 'flat' (a living room: sofa, shelves, a floor lamp) · 'posters' (print shop) ·
 * 'meeting' (a meeting room) · 'map' (travel agency) · 'screens' (media kiosk) · 'arcade' (the first stall) · 'hall'
 * (banking hall) · 'museum' (aviation hall) · 'form' (CV bureau).
 */
export function interiorTexture(kind, accent = '#e8862a', seed = 1, w = 1024, h = 384) {
  const r = lcg(seed * 131 + 17);
  return canvasTexture(w, h, (g) => {
    const wallGrad = (top, bottom) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(1, bottom); return gr; };
    const floor = (color, y = 0.78) => { g.fillStyle = color; g.fillRect(0, h * y, w, h * (1 - y)); };
    const lampRow = (n, y, color = '#fff6e3') => { g.fillStyle = color; for (let i = 0; i < n; i++) g.fillRect(w * (i + 0.5) / n - 45, y, 90, 6); };
    const plant = (x, y, s) => {
      g.fillStyle = '#5f7a3a';
      for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x + (r() - 0.5) * s, y - r() * s * 0.8, s * 0.35, s * 0.22, r() * 3, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#8a4a2a'; g.fillRect(x - s * 0.25, y, s * 0.5, s * 0.45);
    };
    switch (kind) {
      case 'open': {
        g.fillStyle = wallGrad('#efe4d2', '#cdb79a'); g.fillRect(0, 0, w, h);
        floor('#7a6a58', 0.8);
        g.fillStyle = 'rgba(40,30,25,0.5)';
        for (let i = 0; i < 3; i++) { const x = 60 + i * 330; g.fillRect(x, h * 0.6, 260, 9); for (let j = 0; j < 3; j++) g.fillRect(x + 20 + j * 90, h * 0.62, 6, h * 0.2); }
        g.fillStyle = '#dfe8ec';
        for (let i = 0; i < 9; i++) { const x = 70 + Math.floor(i / 3) * 330 + (i % 3) * 86; g.fillRect(x, h * 0.48, 48, 34); }
        g.fillStyle = accent; g.fillRect(w * 0.42, h * 0.12, w * 0.16, h * 0.22);
        g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillRect(w * 0.44, h * 0.16, w * 0.12, 6); g.fillRect(w * 0.44, h * 0.2, w * 0.08, 6);
        lampRow(5, h * 0.06);
        plant(w * 0.93, h * 0.72, 60);
        break;
      }
      case 'lobby': {
        g.fillStyle = wallGrad('#f4e9d8', '#d8c3a6'); g.fillRect(0, 0, w, h);
        floor('#8b7c6a', 0.8);
        g.fillStyle = '#5a4536'; g.fillRect(w * 0.3, h * 0.55, w * 0.4, h * 0.25);
        g.fillStyle = '#e9dcc6'; g.fillRect(w * 0.3, h * 0.55, w * 0.4, 8);
        g.fillStyle = '#fff2da'; g.beginPath(); g.arc(w * 0.5, h * 0.22, 46, 0, Math.PI * 2); g.fill();
        g.fillStyle = accent; g.fillRect(w * 0.08, h * 0.2, w * 0.14, h * 0.3);
        plant(w * 0.86, h * 0.74, 70);
        break;
      }
      case 'clinic': {
        g.fillStyle = wallGrad('#fbfcfc', '#dfe8ea'); g.fillRect(0, 0, w, h);
        floor('#b9c6c8', 0.8);
        g.fillStyle = '#ffffff'; g.fillRect(w * 0.33, h * 0.55, w * 0.34, h * 0.25);
        g.fillStyle = accent; g.fillRect(w * 0.33, h * 0.55, w * 0.34, 10);
        g.fillStyle = '#cfdadc'; for (let i = 0; i < 4; i++) g.fillRect(w * 0.06 + i * 70, h * 0.6, 48, 50);
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(w * 0.5, h * 0.2, 90, 28, 0, 0, Math.PI * 2); g.fill();
        plant(w * 0.9, h * 0.74, 60);
        break;
      }
      case 'pc': {
        g.fillStyle = '#121418'; g.fillRect(0, 0, w, h);
        floor('#1d2026', 0.82);
        for (let i = 0; i < 6; i++) {
          const x = 60 + i * 160, y = h * 0.3, ww = 70, hh = h * 0.5;
          g.fillStyle = '#23262c'; g.fillRect(x, y, ww, hh);
          g.fillStyle = accent; g.globalAlpha = 0.9; g.fillRect(x + 6, y + 8, ww - 12, hh - 16); g.globalAlpha = 1;
          g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(x + 12, y + 16, ww - 24, 5); g.fillRect(x + 12, y + hh * 0.5, ww - 24, 4);
        }
        g.fillStyle = '#2a2e35'; g.fillRect(w * 0.1, h * 0.12, w * 0.8, h * 0.12);
        g.fillStyle = accent; g.globalAlpha = 0.6; g.fillRect(w * 0.1, h * 0.22, w * 0.8, 3); g.globalAlpha = 1;
        break;
      }
      case 'books': {
        g.fillStyle = '#efe2cc'; g.fillRect(0, 0, w, h);
        floor('#8a7458', 0.86);
        const cols = ['#b8452f', '#2d5d8c', '#d8a35a', '#3f7a52', '#eadfcc', '#6a4b8a', '#c56b3a', '#24323f'];
        for (let row = 0; row < 5; row++) {
          const y0 = h * 0.08 + row * h * 0.155;
          g.fillStyle = '#9a7752'; g.fillRect(0, y0 + h * 0.13, w, 7);
          let x = 10;
          while (x < w - 10) {
            const bw = 10 + r() * 18, bh = h * 0.08 + r() * h * 0.045;
            g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(x, y0 + h * 0.13 - bh, bw, bh);
            x += bw + 2 + (r() < 0.08 ? 24 : 0);
          }
        }
        g.fillStyle = accent; g.fillRect(w * 0.44, h * 0.55, w * 0.12, h * 0.31);
        g.fillStyle = '#fff6e3'; g.fillRect(w * 0.47, h * 0.58, w * 0.06, 5);
        break;
      }
      case 'showroom': {
        g.fillStyle = wallGrad('#f0e6d6', '#d3c2a8'); g.fillRect(0, 0, w, h);
        floor('#9f8a6e', 0.8);
        g.fillStyle = '#5a4030'; g.fillRect(w * 0.08, h * 0.6, w * 0.24, h * 0.2); g.fillRect(w * 0.1, h * 0.5, w * 0.2, h * 0.1);
        g.fillStyle = '#c7a06e'; g.fillRect(w * 0.42, h * 0.62, w * 0.2, h * 0.04); g.fillRect(w * 0.44, h * 0.66, 8, h * 0.14); g.fillRect(w * 0.6, h * 0.66, 8, h * 0.14);
        g.fillStyle = accent; g.fillRect(w * 0.72, h * 0.5, w * 0.18, h * 0.3);
        g.fillStyle = '#fff2da'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(w * (i + 0.5) / 6, h * 0.14, 16, 0, Math.PI * 2); g.fill(); }
        break;
      }
      case 'yard': {
        // the view down a passage into a courtyard: evening sky, a chinor crown, a lit wall with a door, pavers
        g.fillStyle = wallGrad('#d9c6b0', '#f0ddc0'); g.fillRect(0, 0, w, h);
        g.fillStyle = '#4f6b3c'; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(w * 0.5 + (r() - 0.5) * w * 0.7, h * 0.22 + (r() - 0.5) * h * 0.3, 90 + r() * 70, 50 + r() * 40, r() * 3, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#6b4a35'; g.fillRect(w * 0.47, h * 0.3, 22, h * 0.5);
        g.fillStyle = '#e6d6bf'; g.fillRect(0, h * 0.5, w, h * 0.3);
        g.fillStyle = '#3d3128'; g.fillRect(w * 0.72, h * 0.52, w * 0.07, h * 0.28);
        g.fillStyle = '#ffe2b0'; g.beginPath(); g.arc(w * 0.755, h * 0.46, 10, 0, Math.PI * 2); g.fill();
        floor('#a89a82', 0.8);
        g.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 0; i < 12; i++) g.fillRect(0, h * 0.8 + i * h * 0.017, w, 2);
        plant(w * 0.12, h * 0.78, 70);
        break;
      }
      case 'flat': {
        g.fillStyle = wallGrad('#f3e7d6', '#d6bf9f'); g.fillRect(0, 0, w, h);
        floor('#8c6f52', 0.8);
        g.fillStyle = '#6c5a7a'; g.fillRect(w * 0.12, h * 0.56, w * 0.3, h * 0.24); g.fillRect(w * 0.12, h * 0.46, w * 0.3, h * 0.1);
        g.fillStyle = '#9a7752'; for (let i = 0; i < 4; i++) g.fillRect(w * 0.6, h * (0.15 + i * 0.16), w * 0.26, 6);
        g.fillStyle = '#fff1d8'; g.beginPath(); g.arc(w * 0.52, h * 0.5, 22, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#4a4a4a'; g.fillRect(w * 0.515, h * 0.55, 6, h * 0.25);
        g.fillStyle = accent; g.fillRect(w * 0.62, h * 0.5, w * 0.08, h * 0.08);
        break;
      }
      case 'posters': {
        // a print shop / design bureau: a wall of posters in the accent and a few flat colours, a long table
        g.fillStyle = wallGrad('#f4efe6', '#d9d1c2'); g.fillRect(0, 0, w, h);
        floor('#8f8577', 0.8);
        const cols = [accent, '#1f2328', '#e8d9b8', '#c4532f', '#2f6ea8', '#f2efe8'];
        for (let i = 0; i < 6; i++) {
          const x = 40 + i * 165, y = h * 0.1 + (i % 2) * 22, pw = 120, ph = h * 0.42;
          g.fillStyle = '#ffffff'; g.fillRect(x - 6, y - 6, pw + 12, ph + 12);
          g.fillStyle = cols[i % cols.length]; g.fillRect(x, y, pw, ph);
          g.fillStyle = i % 3 === 0 ? '#ffffff' : '#1f2328'; g.globalAlpha = 0.75; g.fillRect(x + 14, y + ph - 40, pw - 28, 6); g.fillRect(x + 14, y + ph - 26, pw * 0.5, 5); g.globalAlpha = 1;
        }
        g.fillStyle = '#d8c9ad'; g.fillRect(w * 0.15, h * 0.66, w * 0.7, 9);
        g.fillStyle = '#5a4a3a'; for (const x of [w * 0.18, w * 0.5, w * 0.8]) g.fillRect(x, h * 0.68, 7, h * 0.12);
        lampRow(4, h * 0.05);
        break;
      }
      case 'meeting': {
        // a meeting room: an oval table with chairs, a wall screen, one plant
        g.fillStyle = wallGrad('#f6efe4', '#d6c8b4'); g.fillRect(0, 0, w, h);
        floor('#6f6356', 0.8);
        g.fillStyle = '#2c2f34'; g.fillRect(w * 0.58, h * 0.14, w * 0.3, h * 0.34);
        g.fillStyle = accent; g.globalAlpha = 0.8; g.fillRect(w * 0.6, h * 0.17, w * 0.26, h * 0.28); g.globalAlpha = 1;
        g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(w * 0.63, h * 0.22, w * 0.14, 6); g.fillRect(w * 0.63, h * 0.27, w * 0.2, 5); g.fillRect(w * 0.63, h * 0.32, w * 0.1, 5);
        g.fillStyle = '#7a5a3e'; g.beginPath(); g.ellipse(w * 0.36, h * 0.66, w * 0.2, h * 0.07, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#3a3a40'; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.fillRect(w * 0.36 + Math.cos(a) * w * 0.24 - 14, h * 0.6 + Math.sin(a) * h * 0.1, 28, 34); }
        lampRow(3, h * 0.06);
        plant(w * 0.93, h * 0.74, 60);
        break;
      }
      case 'map': {
        // a travel agency: a big world map on the back wall, a counter, a globe
        g.fillStyle = wallGrad('#f3ede2', '#d8d0c0'); g.fillRect(0, 0, w, h);
        floor('#86786a', 0.8);
        g.fillStyle = '#17202b'; g.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.5);
        g.fillStyle = '#4d7a9a'; g.globalAlpha = 0.9;
        for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(w * (0.12 + r() * 0.76), h * (0.12 + r() * 0.42), 20 + r() * 70, 12 + r() * 34, r() * 3, 0, Math.PI * 2); g.fill(); }
        g.globalAlpha = 1;
        g.fillStyle = accent; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(w * (0.14 + r() * 0.72), h * (0.14 + r() * 0.38), 6, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#e9dcc6'; g.fillRect(w * 0.3, h * 0.6, w * 0.4, h * 0.2);
        g.fillStyle = accent; g.fillRect(w * 0.3, h * 0.6, w * 0.4, 8);
        g.fillStyle = '#2f6ea8'; g.beginPath(); g.arc(w * 0.85, h * 0.6, 28, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#3f8a4a'; g.beginPath(); g.ellipse(w * 0.85, h * 0.58, 14, 9, 0.6, 0, Math.PI * 2); g.fill();
        lampRow(4, h * 0.04);
        break;
      }
      case 'screens': {
        // a media kiosk: a dark room with a wall of screens showing posts in the accent and white
        g.fillStyle = '#15171c'; g.fillRect(0, 0, w, h);
        floor('#23262c', 0.84);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
          const x = 70 + i * 230, y = h * 0.1 + j * h * 0.36, sw = 190, sh = h * 0.3;
          g.fillStyle = '#0c0d10'; g.fillRect(x - 6, y - 6, sw + 12, sh + 12);
          g.fillStyle = (i + j) % 3 === 0 ? accent : '#1f2a36'; g.fillRect(x, y, sw, sh);
          g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(x + 16, y + 18, sw * 0.5, 7); g.fillRect(x + 16, y + 34, sw * 0.7, 6); g.fillRect(x + 16, y + 48, sw * 0.4, 6);
          g.fillStyle = accent; g.globalAlpha = 0.9; g.fillRect(x + 16, y + sh - 26, 50, 12); g.globalAlpha = 1;
        }
        break;
      }
      case 'arcade': {
        // the first project's stall: a glowing arcade cabinet, a shelf of prizes, bulbs along the ceiling
        g.fillStyle = wallGrad('#3b2f2a', '#241c19'); g.fillRect(0, 0, w, h);
        floor('#3a2d26', 0.84);
        g.fillStyle = '#1b1b22'; g.fillRect(w * 0.36, h * 0.2, w * 0.2, h * 0.64);
        g.fillStyle = accent; g.fillRect(w * 0.385, h * 0.26, w * 0.15, h * 0.26);
        g.fillStyle = '#ffffff'; g.globalAlpha = 0.85; g.fillRect(w * 0.42, h * 0.33, w * 0.08, 8); g.fillRect(w * 0.44, h * 0.4, w * 0.04, 6); g.globalAlpha = 1;
        g.fillStyle = '#d9534f'; g.beginPath(); g.arc(w * 0.44, h * 0.6, 9, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#4f9bd9'; g.beginPath(); g.arc(w * 0.48, h * 0.6, 9, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#8a6a3a'; g.fillRect(w * 0.62, h * 0.4, w * 0.3, 7); g.fillRect(w * 0.62, h * 0.6, w * 0.3, 7);
        const toys = ['#e7c43a', '#d9534f', '#4f9bd9', '#6cc070', '#f28cb3'];
        for (let i = 0; i < 10; i++) { g.fillStyle = toys[i % toys.length]; g.beginPath(); g.arc(w * (0.64 + (i % 5) * 0.06), h * (i < 5 ? 0.35 : 0.55), 13, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#fff1c2'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(w * (i + 0.5) / 9, h * 0.06, 7, 0, Math.PI * 2); g.fill(); }
        break;
      }
      case 'hall': {
        // a banking hall: stone wall, a row of counters with brass lamps, a wide carpet in the accent colour
        g.fillStyle = wallGrad('#efe6d6', '#cdbfa6'); g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(80,60,40,0.12)'; for (let i = 0; i < 7; i++) g.fillRect(i * (w / 7), 0, 4, h);
        floor('#9b8e7c', 0.8);
        g.fillStyle = accent; g.globalAlpha = 0.5; g.fillRect(w * 0.1, h * 0.8, w * 0.8, h * 0.2); g.globalAlpha = 1;
        g.fillStyle = '#5a4030'; g.fillRect(w * 0.12, h * 0.56, w * 0.76, h * 0.24);
        g.fillStyle = '#e9dcc6'; g.fillRect(w * 0.12, h * 0.56, w * 0.76, 10);
        g.fillStyle = '#c9a24a'; for (let i = 0; i < 4; i++) { const x = w * (0.2 + i * 0.2); g.fillRect(x - 2, h * 0.42, 4, h * 0.14); g.fillRect(x - 22, h * 0.4, 44, 12); }
        g.fillStyle = '#fff2da'; for (let i = 0; i < 4; i++) g.fillRect(w * (0.2 + i * 0.2) - 16, h * 0.52, 32, 4);
        g.fillStyle = '#2c3440'; g.fillRect(w * 0.44, h * 0.1, w * 0.12, h * 0.26);
        break;
      }
      case 'museum': {
        // an aviation museum hall: a hung aircraft silhouette, display cases, a high dark ceiling
        g.fillStyle = wallGrad('#e9e4da', '#c9c3b7'); g.fillRect(0, 0, w, h);
        floor('#a39d92', 0.82);
        g.fillStyle = '#5b6168'; g.fillRect(w * 0.3, h * 0.22, w * 0.4, 14); g.fillRect(w * 0.48, h * 0.1, 26, h * 0.3); g.fillRect(w * 0.68, h * 0.12, 8, h * 0.12);
        g.fillStyle = accent; g.fillRect(w * 0.3, h * 0.22, w * 0.08, 14);
        g.fillStyle = 'rgba(255,255,255,0.65)'; for (let i = 0; i < 4; i++) g.fillRect(w * (0.08 + i * 0.24), h * 0.5, w * 0.12, h * 0.32);
        g.fillStyle = '#3d4248'; for (let i = 0; i < 4; i++) g.fillRect(w * (0.08 + i * 0.24), h * 0.5, w * 0.12, 6);
        g.fillStyle = '#9aa3ab'; for (let i = 0; i < 4; i++) g.fillRect(w * (0.11 + i * 0.24), h * 0.58, w * 0.06, h * 0.1);
        lampRow(6, h * 0.04, '#fff9ee');
        break;
      }
      case 'form': {
        // a CV bureau: a desk with a lamp, a big framed form on the wall with lines in the accent colour
        g.fillStyle = wallGrad('#f6f1e7', '#dad1c0'); g.fillRect(0, 0, w, h);
        floor('#7d7064', 0.8);
        g.fillStyle = '#ffffff'; g.fillRect(w * 0.2, h * 0.08, w * 0.6, h * 0.5);
        g.fillStyle = accent; g.fillRect(w * 0.24, h * 0.13, w * 0.18, h * 0.16);
        g.fillStyle = '#2a2c30'; g.fillRect(w * 0.46, h * 0.14, w * 0.3, 8); g.fillRect(w * 0.46, h * 0.2, w * 0.2, 6);
        g.fillStyle = 'rgba(40,40,45,0.5)'; for (let i = 0; i < 5; i++) g.fillRect(w * 0.24, h * (0.34 + i * 0.045), w * (0.3 + (i % 2) * 0.2), 5);
        g.fillStyle = '#6b4a35'; g.fillRect(w * 0.3, h * 0.66, w * 0.4, 8); g.fillRect(w * 0.33, h * 0.68, 7, h * 0.12); g.fillRect(w * 0.66, h * 0.68, 7, h * 0.12);
        g.fillStyle = '#fff1d8'; g.beginPath(); g.arc(w * 0.62, h * 0.6, 12, 0, Math.PI * 2); g.fill();
        plant(w * 0.1, h * 0.76, 56);
        break;
      }
      default: {
        g.fillStyle = wallGrad('#f1dcc0', '#c79a6e'); g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(70,45,30,0.55)';
        for (let i = 0; i < 6; i++) { const x = 40 + i * 165 + (seed * 37 % 50); g.fillRect(x, h * 0.62, 110, 10); g.fillRect(x + 50, h * 0.66, 8, h * 0.3); }
        g.fillStyle = 'rgba(60,40,30,0.35)'; for (let i = 0; i < 5; i++) g.fillRect(90 + i * 190, h * 0.2, 70, 70);
        lampRow(4, h * 0.08);
        g.fillStyle = '#5f7a3a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(300 + i * 280, h * 0.52, 22, 0, Math.PI * 2); g.fill(); }
      }
    }
  });
}

/** Striped canvas for awnings: two colours, stripes along u. */
export function stripeTexture(a, b, stripes = 8) {
  return canvasTexture(512, 64, (g, w, h) => {
    for (let i = 0; i < stripes; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(i * w / stripes, 0, w / stripes + 1, h); }
  }, { repeat: true });
}

/** A glazed curtain wall seen from outside: floor lines, panes with sky in the upper part, some lit in the evening. */
export function curtainTextures(seed, floors, tint = '#6c7f86') {
  const draw = (emissive) => (g, w, h) => {
    const r = lcg(seed * 571 + 9);
    g.fillStyle = emissive ? '#000000' : tint; g.fillRect(0, 0, w, h);
    const cols = 8, fh = h / floors;
    for (let f = 0; f < floors; f++) for (let i = 0; i < cols; i++) {
      const lit = r() < 0.55;
      const x = i * w / cols + 4, y = f * fh + 6, ww = w / cols - 8, hh = fh - 12;
      if (emissive) { if (lit) { g.fillStyle = r() < 0.6 ? '#ffd9a6' : '#e6eef5'; g.globalAlpha = 0.9; g.fillRect(x, y, ww, hh); g.globalAlpha = 1; } continue; }
      g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x, y, ww, hh * 0.4);
      g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(x, y + hh * 0.4, ww, hh * 0.6);
    }
    if (!emissive) { g.fillStyle = 'rgba(0,0,0,0.5)'; for (let f = 0; f <= floors; f++) g.fillRect(0, f * fh - 3, w, 6); }
  };
  return { map: canvasTexture(1024, 128 * floors, draw(false)), emissiveMap: canvasTexture(1024, 128 * floors, draw(true)) };
}
