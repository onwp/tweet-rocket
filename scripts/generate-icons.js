#!/usr/bin/env node
/**
 * generate-icons.js
 * 
 * Generates rocket-themed PNG icons for the Tweet Rocket Chrome extension.
 * Pure Node.js -- no external dependencies.
 * 
 * Produces: icon16.png, icon48.png, icon128.png
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ICONS_DIR = path.join(__dirname, '..', 'extension', 'icons');

// Brand colors
const DARK_BG = { r: 5, g: 5, b: 5 };
const BLUE    = { r: 29, g: 155, b: 240 };
const FLAME1  = { r: 255, g: 120, b: 30 };
const FLAME2  = { r: 255, g: 200, b: 50 };

// ── PNG helpers ──

function crc32(buf) {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([length, typeBytes, data, crcBuf]);
}

function buildPNG(width, height, pixels) {
  const rawBuf = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawBuf[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const px = pixels[y * width + x];
      rawBuf[offset++] = px.r;
      rawBuf[offset++] = px.g;
      rawBuf[offset++] = px.b;
      rawBuf[offset++] = px.a;
    }
  }
  const compressed = zlib.deflateSync(rawBuf, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// ── Drawing primitives ──

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(c1, c2, t) {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  };
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ── Rocket rendering ──

function renderRocketIcon(size) {
  const pixels = new Array(size * size);
  const scale = size / 128;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / scale;
      const ny = y / scale;

      let r = DARK_BG.r, g = DARK_BG.g, b = DARK_BG.b, a = 255;

      // Subtle radial gradient on background
      const bgDist = dist(nx, ny, 64, 64) / 90;
      const bgBright = clamp(1.0 - bgDist * 0.3, 0, 1);
      r = Math.round(DARK_BG.r + 15 * bgBright);
      g = Math.round(DARK_BG.g + 15 * bgBright);
      b = Math.round(DARK_BG.b + 15 * bgBright);

      // Rocket body coordinates (tilted 45 degrees)
      const angle = -Math.PI / 4;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = nx - 64;
      const dy = ny - 64;
      const lx = dx * cos - dy * sin;
      const ly = dx * sin + dy * cos;

      const bodyW = 16;
      const bodyH = 42;
      const bodyDist = (lx / bodyW) ** 2 + (ly / bodyH) ** 2;

      const noseStart = -30;
      const noseEnd = -50;
      let inRocket = false;

      if (ly >= noseStart && bodyDist <= 1.0) {
        inRocket = true;
      } else if (ly < noseStart && ly > noseEnd) {
        const noseFrac = (noseStart - ly) / (noseStart - noseEnd);
        const noseWidth = bodyW * (1 - noseFrac * 0.9);
        if (Math.abs(lx) < noseWidth) {
          inRocket = true;
        }
      }

      if (inRocket) {
        const bodyFrac = clamp((ly + 50) / 92, 0, 1);
        const bodyColor = lerpColor(
          { r: 15, g: 130, b: 220 },
          BLUE,
          bodyFrac
        );
        const centerGlow = Math.exp(-(lx * lx) / 40);
        r = Math.round(bodyColor.r + (255 - bodyColor.r) * centerGlow * 0.3);
        g = Math.round(bodyColor.g + (255 - bodyColor.g) * centerGlow * 0.3);
        b = Math.round(bodyColor.b + (255 - bodyColor.b) * centerGlow * 0.3);
      }

      // Nose tip (white/bright)
      if (ly > noseEnd - 5 && ly < noseStart) {
        const noseFrac = (noseStart - ly) / (noseStart - noseEnd);
        const noseWidth = bodyW * (1 - noseFrac * 0.9);
        if (Math.abs(lx) < noseWidth && noseFrac > 0.7) {
          const tipGlow = (noseFrac - 0.7) / 0.3;
          r = lerp(r, 255, tipGlow * 0.7);
          g = lerp(g, 255, tipGlow * 0.7);
          b = lerp(b, 255, tipGlow * 0.7);
        }
      }

      // Window (porthole)
      const windowCy = -10;
      const windowCx = 0;
      const windowR = 7;
      const windowDist = dist(lx, ly, windowCx, windowCy);
      if (windowDist < windowR && inRocket) {
        if (windowDist < windowR - 2) {
          const wd = windowDist / (windowR - 2);
          r = lerp(10, 30, wd);
          g = lerp(20, 50, wd);
          b = lerp(40, 80, wd);
        } else {
          r = 220; g = 230; b = 240;
        }
      }

      // Fins
      const finSize = 14;
      const finStartY = 20;
      if (ly > finStartY && ly < finStartY + finSize * 2) {
        const finFrac = (ly - finStartY) / (finSize * 2);
        const finExtend = finSize * finFrac;
        if (lx < -bodyW * 0.7 && lx > -bodyW * 0.7 - finExtend) {
          const finColor = lerpColor(BLUE, { r: 12, g: 100, b: 180 }, finFrac);
          r = finColor.r; g = finColor.g; b = finColor.b;
        }
        if (lx > bodyW * 0.7 && lx < bodyW * 0.7 + finExtend) {
          const finColor = lerpColor(BLUE, { r: 12, g: 100, b: 180 }, finFrac);
          r = finColor.r; g = finColor.g; b = finColor.b;
        }
      }

      // Exhaust flame
      const flameStart = bodyH - 2;
      const flameEnd = bodyH + 25;
      if (ly > flameStart && ly < flameEnd) {
        const flameFrac = (ly - flameStart) / (flameEnd - flameStart);
        const flameWidth = bodyW * (1 - flameFrac * 0.7) * 0.8;
        const waveOffset = Math.sin(flameFrac * Math.PI * 3 + lx * 0.2) * 2 * flameFrac;
        if (Math.abs(lx + waveOffset) < flameWidth) {
          const innerFrac = 1 - Math.abs(lx + waveOffset) / flameWidth;
          let flameColor;
          if (innerFrac > 0.5) {
            flameColor = lerpColor(FLAME1, FLAME2, (innerFrac - 0.5) * 2);
          } else {
            flameColor = lerpColor({ r: 200, g: 50, b: 10 }, FLAME1, innerFrac * 2);
          }
          const fadeAlpha = 1 - flameFrac;
          r = lerp(r, flameColor.r, fadeAlpha);
          g = lerp(g, flameColor.g, fadeAlpha);
          b = lerp(b, flameColor.b, fadeAlpha);
        }
      }

      // Rounded square mask
      const margin = 4;
      const rr = 18;
      const inRect = nx >= margin && nx <= 128 - margin && ny >= margin && ny <= 128 - margin;
      if (inRect) {
        let cornerDist = 0;
        if (nx < margin + rr && ny < margin + rr) {
          cornerDist = dist(nx, ny, margin + rr, margin + rr) - rr;
        } else if (nx > 128 - margin - rr && ny < margin + rr) {
          cornerDist = dist(nx, ny, 128 - margin - rr, margin + rr) - rr;
        } else if (nx < margin + rr && ny > 128 - margin - rr) {
          cornerDist = dist(nx, ny, margin + rr, 128 - margin - rr) - rr;
        } else if (nx > 128 - margin - rr && ny > 128 - margin - rr) {
          cornerDist = dist(nx, ny, 128 - margin - rr, 128 - margin - rr) - rr;
        }
        if (cornerDist > 0) {
          a = Math.round(255 * clamp(1 - cornerDist / 2, 0, 1));
        } else {
          a = 255;
        }
      } else {
        a = 0;
      }

      pixels[y * size + x] = {
        r: clamp(r, 0, 255),
        g: clamp(g, 0, 255),
        b: clamp(b, 0, 255),
        a: clamp(a, 0, 255)
      };
    }
  }

  return pixels;
}

// ── Main ──

function main() {
  const sizes = [16, 48, 128];

  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  for (const size of sizes) {
    console.log(`Generating icon${size}.png ...`);
    const pixels = renderRocketIcon(size);
    const png = buildPNG(size, size, pixels);
    const outPath = path.join(ICONS_DIR, `icon${size}.png`);
    fs.writeFileSync(outPath, png);
    console.log(`  -> ${outPath} (${png.length} bytes)`);
  }

  console.log('\nDone! All icons generated.');
}

main();
