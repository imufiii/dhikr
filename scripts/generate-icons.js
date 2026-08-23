const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const SIZE = 1024;
const CX = 512, CY = 512;
const RING_R = 290;
const BEAD_R = 30;
const MARKER_R = 42;
const N_BEADS = 11;

function toRad(deg) { return deg * Math.PI / 180; }

// Compute bead positions (clockwise from top)
const beads = [];
for (let i = 0; i < N_BEADS; i++) {
  const angle = toRad(-90 + (360 / N_BEADS) * i);
  beads.push({
    x: CX + RING_R * Math.cos(angle),
    y: CY + RING_R * Math.sin(angle),
    isMarker: i === 0,
  });
}

// Build connecting string path
const stringParts = beads.map((b, i) => {
  const next = beads[(i + 1) % N_BEADS];
  return `M ${b.x.toFixed(1)} ${b.y.toFixed(1)} L ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
});

// Tassel: hangs below the ring
const tasselTopX = CX;
const tasselTopY = CY + RING_R + BEAD_R;
const tasselMidY = tasselTopY + 55;
const tasselBotY = tasselMidY + 90;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="bead" cx="38%" cy="32%" r="65%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#F5E07A"/>
      <stop offset="50%"  stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#7A5C0F"/>
    </radialGradient>
    <radialGradient id="marker" cx="38%" cy="32%" r="65%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#FFFBE0"/>
      <stop offset="45%"  stop-color="#E2C050"/>
      <stop offset="100%" stop-color="#6B4E0A"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" fill="#111827"/>

  <!-- String -->
  <g stroke="#C9A84C" stroke-width="5" stroke-linecap="round" opacity="0.7">
    ${stringParts.map(d => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <!-- Tassel string -->
  <line x1="${tasselTopX}" y1="${tasselTopY}" x2="${CX}" y2="${tasselMidY}" stroke="#C9A84C" stroke-width="5" opacity="0.7"/>

  <!-- Tassel strands -->
  <g stroke="#C9A84C" stroke-width="4" stroke-linecap="round" opacity="0.6">
    <line x1="${CX}" y1="${tasselMidY}" x2="${CX - 22}" y2="${tasselBotY}"/>
    <line x1="${CX}" y1="${tasselMidY}" x2="${CX - 8}"  y2="${tasselBotY + 10}"/>
    <line x1="${CX}" y1="${tasselMidY}" x2="${CX + 8}"  y2="${tasselBotY + 10}"/>
    <line x1="${CX}" y1="${tasselMidY}" x2="${CX + 22}" y2="${tasselBotY}"/>
  </g>

  <!-- Tassel knot -->
  <ellipse cx="${CX}" cy="${tasselMidY}" rx="14" ry="10" fill="#C9A84C" opacity="0.9"/>

  <!-- Regular beads -->
  ${beads.filter(b => !b.isMarker).map(b =>
    `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${BEAD_R}" fill="url(#bead)" filter="url(#glow)"/>`
  ).join('\n  ')}

  <!-- Marker bead (larger, brighter, at top) -->
  ${beads.filter(b => b.isMarker).map(b =>
    `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${MARKER_R}" fill="url(#marker)" filter="url(#glow)"/>`
  ).join('\n  ')}
</svg>`;

const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath = path.join(assetsDir, 'icon.svg');
fs.writeFileSync(svgPath, svg);
console.log('SVG written');

// Render icon.png (1024x1024)
execSync(`rsvg-convert -w 1024 -h 1024 "${svgPath}" -o "${path.join(assetsDir, 'icon.png')}"`);
console.log('icon.png done');

// Render splash-icon.png (same image, 1024x1024)
execSync(`rsvg-convert -w 1024 -h 1024 "${svgPath}" -o "${path.join(assetsDir, 'splash-icon.png')}"`);
console.log('splash-icon.png done');

// Android foreground (no background — transparent)
const svgTransparent = svg.replace('<rect width="1024" height="1024" fill="#111827"/>', '');
const svgTPath = path.join(assetsDir, 'icon-transparent.svg');
fs.writeFileSync(svgTPath, svgTransparent);
execSync(`rsvg-convert -w 1024 -h 1024 "${svgTPath}" -o "${path.join(assetsDir, 'android-icon-foreground.png')}"`);
console.log('android-icon-foreground.png done');

console.log('\nAll icons generated successfully.');
