// Build-time OG image generation. Renders branded SVG cards for the homepage,
// each tool review, each comparison, and each profession page, then converts
// to PNG via sharp. Output: public/og/<slug>.png and public/og-default.png.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const outDir = path.join(root, 'public', 'og');
await fs.mkdir(outDir, { recursive: true });

const W = 1200;
const H = 630;

// Brand palette
const ink = '#1B1B3A';
const cream = '#FFF7ED';
const pink = '#FF3D7F';
const yellow = '#FFD93D';
const orange = '#FF7A1A';
const lilac = '#B377FF';
const mint = '#00D4A0';
const blue = '#3B6EFF';

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (!line) { line = w; continue; }
    if (line.length + 1 + w.length <= maxChars) line += ' ' + w;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

function ogSvg({ kicker, title, accent = pink }) {
  const lines = wrap(title, 22).slice(0, 4);
  const startY = lines.length === 1 ? 360 : lines.length === 2 ? 310 : lines.length === 3 ? 260 : 220;
  const lineHeight = 78;
  const tspans = lines
    .map((l, i) => `<tspan x="80" y="${startY + i * lineHeight}">${escapeXml(l)}</tspan>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cream}"/>
      <stop offset="100%" stop-color="#FFE9D2"/>
    </linearGradient>
    <radialGradient id="rose" cx="15%" cy="20%" r="50%">
      <stop offset="0%" stop-color="${pink}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${pink}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lilac" cx="85%" cy="80%" r="55%">
      <stop offset="0%" stop-color="${lilac}" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="${lilac}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lime" cx="65%" cy="20%" r="40%">
      <stop offset="0%" stop-color="#a3e635" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#a3e635" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#rose)"/>
  <rect width="${W}" height="${H}" fill="url(#lilac)"/>
  <rect width="${W}" height="${H}" fill="url(#lime)"/>

  <!-- ink frame -->
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="32" fill="none" stroke="${ink}" stroke-width="6"/>
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" rx="22" fill="none" stroke="${ink}" stroke-width="2" stroke-opacity="0.18"/>

  <!-- kicker pill -->
  <g transform="translate(80, 88) rotate(-1.5)">
    <rect x="0" y="0" width="${Math.max(180, kicker.length * 13 + 36)}" height="44" rx="22" fill="${ink}"/>
    <text x="22" y="29" fill="${cream}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="16" letter-spacing="2">${escapeXml(kicker.toUpperCase())}</text>
  </g>

  <!-- title -->
  <text fill="${ink}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="72" letter-spacing="-2.4">
    ${tspans}
  </text>

  <!-- accent stripe -->
  <rect x="80" y="${H - 130}" width="120" height="8" rx="4" fill="${accent}"/>

  <!-- brand mark + URL -->
  <g transform="translate(80, ${H - 100})">
    <text x="0" y="34" fill="${ink}" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="28" letter-spacing="-0.8">India's Best AI Tools</text>
    <text x="0" y="62" fill="${ink}" fill-opacity="0.65" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="18">indiasbestaitools.com · Independent INR-first reviews</text>
  </g>

  <!-- decorative star cluster -->
  <g transform="translate(${W - 200}, 110)" opacity="0.85">
    <path d="M 30 0 L 36 24 L 60 30 L 36 36 L 30 60 L 24 36 L 0 30 L 24 24 Z" fill="${yellow}" stroke="${ink}" stroke-width="3"/>
  </g>
  <g transform="translate(${W - 110}, 200)" opacity="0.85">
    <path d="M 18 0 L 22 14 L 36 18 L 22 22 L 18 36 L 14 22 L 0 18 L 14 14 Z" fill="${pink}" stroke="${ink}" stroke-width="2"/>
  </g>
  <g transform="translate(${W - 240}, 230)" opacity="0.85">
    <circle cx="20" cy="20" r="20" fill="${mint}" stroke="${ink}" stroke-width="3"/>
  </g>
  <g transform="translate(${W - 130}, 310)" opacity="0.85">
    <rect x="0" y="0" width="40" height="40" rx="10" fill="${blue}" stroke="${ink}" stroke-width="3" transform="rotate(-12 20 20)"/>
  </g>
</svg>`;
}

async function renderOg(outPath, opts) {
  const svg = ogSvg(opts);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath);
}

const accents = { pink, blue, mint, lilac, orange, yellow };

const pages = [
  { file: 'og-default.png',                        kicker: 'INR-first AI reviews',  title: "India's Best AI Tools, Honest Reviews with INR Pricing", accent: pink },
  { file: 'og/home.png',                           kicker: 'Homepage',              title: "Find the right AI tool, at the price you'll actually pay in India", accent: pink },
  // Tool reviews
  { file: 'og/chatgpt-india.png',    kicker: 'Tool review', title: 'ChatGPT in India 2026, INR pricing, payment, what works',  accent: mint },
  { file: 'og/claude-india.png',     kicker: 'Tool review', title: 'Claude in India 2026, full review, payment, INR price',     accent: orange },
  { file: 'og/gemini-india.png',     kicker: 'Tool review', title: 'Gemini in India 2026, INR pricing, free tier, Workspace',   accent: blue },
  { file: 'og/notion-india.png',     kicker: 'Tool review', title: 'Notion AI in India 2026, INR pricing, GST, what it replaces', accent: ink },
  { file: 'og/canva-india.png',      kicker: 'Tool review', title: 'Canva in India 2026, INR pricing, GST, Magic Studio guide', accent: mint },
  { file: 'og/perplexity-india.png', kicker: 'Tool review', title: 'Perplexity in India 2026, free tier, research workflow',    accent: blue },
  { file: 'og/copilot-india.png',    kicker: 'Tool review', title: 'GitHub Copilot in India 2026, INR price, GST, Indian devs', accent: ink },
  { file: 'og/midjourney-india.png', kicker: 'Tool review', title: 'Midjourney in India 2026, INR pricing, payment workflow',   accent: pink },
  // Comparisons
  { file: 'og/chatgpt-vs-claude-india.png',  kicker: 'Comparison', title: 'ChatGPT vs Claude in India, which one for Indians?',  accent: lilac },
  { file: 'og/chatgpt-vs-gemini-india.png',  kicker: 'Comparison', title: 'ChatGPT vs Gemini in India, which to pay for?',       accent: lilac },
  { file: 'og/notion-vs-claude-india.png',   kicker: 'Comparison', title: 'Notion AI vs Claude in India, different jobs',         accent: lilac },
  // Profession pages
  { file: 'og/freelancers.png', kicker: 'For freelancers', title: 'Best AI tools for Indian freelancers in 2026',     accent: pink },
  { file: 'og/creators.png',    kicker: 'For creators',    title: 'Best AI tools for Indian creators and YouTubers',   accent: orange },
  { file: 'og/teachers.png',    kicker: 'For teachers',    title: 'Best AI tools for Indian teachers in 2026',         accent: yellow },
  { file: 'og/engineers.png',   kicker: 'For engineers',   title: 'Best AI tools for Indian software engineers',       accent: blue },
  { file: 'og/cas.png',         kicker: 'For CAs',         title: 'Best AI tools for Chartered Accountants in India',  accent: mint },
  { file: 'og/doctors.png',     kicker: 'For doctors',     title: 'Best AI tools for Indian doctors and clinicians',   accent: pink },
  // Other
  { file: 'og/pricing-in-inr.png',    kicker: 'INR pricing',  title: 'Every AI tool, real cost in rupees including GST', accent: yellow },
  { file: 'og/pay-for-ai-tools-india.png',  kicker: 'How to pay',   title: '5 ways to actually pay for AI tools from India',   accent: orange },
  { file: 'og/about.png',             kicker: 'About',        title: "How India's Best AI Tools stays independent",      accent: pink },
  { file: 'og/methodology.png',       kicker: 'Methodology',  title: 'How every review is tested, scored, and updated',  accent: blue },
];

for (const p of pages) {
  const outPath = path.join(root, 'public', p.file);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await renderOg(outPath, p);
  console.log('OG', p.file);
}
console.log(`\nGenerated ${pages.length} OG images.`);
