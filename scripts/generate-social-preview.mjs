import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';

// Use the supplied runtime's Sharp package without adding project dependencies.
const sharp = createRequire(import.meta.url)(process.argv[2] || 'sharp');
const tokens = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const token = (name) => {
    const match = tokens.match(new RegExp(`--${name}:\\s*([^;]+);`));
    if (!match) throw new Error(`Missing design token: ${name}`);
    return match[1].trim();
};
const illustration = await readFile(new URL('../design/assets/hero-pots.svg', import.meta.url), 'utf8');
const size = (name) => Number.parseFloat(token(name)) * 16;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${token('color-cream')}"/>
  <g font-family="Georgia, serif" fill="${token('color-ink')}">
    <text x="64" y="100" font-size="${size('text-2xl')}" font-weight="bold">klei<tspan fill="${token('color-clay')}">.</tspan></text>
    <text x="64" y="255" font-size="${size('text-3xl')}" font-weight="bold">Get your hands</text>
    <text x="64" y="345" font-size="${size('text-3xl')}" font-style="italic" fill="${token('color-clay')}">dirty.</text>
  </g>
  <g font-family="Arial, sans-serif" fill="${token('color-ink-muted')}" font-size="${size('text-xl')}">
    <text x="64" y="445">Pottery workshops for beginners</text>
    <text x="64" y="485">and seasoned makers in Mechelen.</text>
  </g>
  <svg x="700" y="95" width="440" height="440" viewBox="0 0 560 560">${illustration.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(new URL('../public/social-preview.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const favicon = await readFile(new URL('../public/favicon.svg', import.meta.url));
await sharp(favicon).resize(32, 32).png().toFile(new URL('../public/favicon.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
