/**
 * Fluentra icon generator
 * Requires: npm install canvas
 * Run: node scripts/generate-icon.js
 *
 * Generates:
 *   assets/icon.png          — 1024×1024
 *   assets/adaptive-icon.png — 1024×1024 (no rounding, Android crops)
 *   assets/favicon.png       — 32×32
 */

const { createCanvas } = require('canvas');
const fs               = require('fs');
const path             = require('path');

const PURPLE = '#5B4EFF';
const WHITE  = '#FFFFFF';

function drawIcon(canvas, { rounded = true } = {}) {
  const size = canvas.width;
  const ctx  = canvas.getContext('2d');

  // Background
  if (rounded) {
    const r = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = PURPLE;
    ctx.fill();
  } else {
    ctx.fillStyle = PURPLE;
    ctx.fillRect(0, 0, size, size);
  }

  // Three wave / arc lines
  ctx.strokeStyle = WHITE;
  ctx.lineCap     = 'round';
  ctx.lineWidth   = size * 0.07;

  const cx    = size / 2;
  const midY  = size / 2;
  const gap   = size * 0.16;
  const amp   = size * 0.1;
  const waveW = size * 0.52;

  for (let i = -1; i <= 1; i++) {
    const y = midY + i * gap;
    ctx.beginPath();
    ctx.moveTo(cx - waveW / 2, y);
    ctx.bezierCurveTo(
      cx - waveW / 6, y - amp * (i === 0 ? 1 : 0.6),
      cx + waveW / 6, y + amp * (i === 0 ? 1 : 0.6),
      cx + waveW / 2, y
    );
    ctx.stroke();
  }
}

function save(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '..', 'assets', filename), buf);
  console.log(`✓ assets/${filename} (${canvas.width}×${canvas.height})`);
}

// 1024×1024 app icon (rounded for iOS)
const icon = createCanvas(1024, 1024);
drawIcon(icon, { rounded: true });
save(icon, 'icon.png');

// 1024×1024 adaptive icon (no rounding — Android masks it)
const adaptive = createCanvas(1024, 1024);
drawIcon(adaptive, { rounded: false });
save(adaptive, 'adaptive-icon.png');

// 32×32 favicon
const fav = createCanvas(32, 32);
drawIcon(fav, { rounded: true });
save(fav, 'favicon.png');

console.log('\nDone! Run `npx expo start` to see the new icons.');
