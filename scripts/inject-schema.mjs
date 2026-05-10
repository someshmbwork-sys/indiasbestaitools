// Reads each .astro article page, extracts the existing inline FAQ HTML,
// and injects a `faqs` const + reviewedItem/rating const into the frontmatter
// so ArticleLayout can emit FAQPage / Review JSON-LD.
//
// Idempotent: skips files that already have a `const faqs` const.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const targets = [
  'src/pages/tools/canva-india.astro',
  'src/pages/tools/chatgpt-india.astro',
  'src/pages/tools/claude-india.astro',
  'src/pages/tools/copilot-india.astro',
  'src/pages/tools/gemini-india.astro',
  'src/pages/tools/midjourney-india.astro',
  'src/pages/tools/notion-india.astro',
  'src/pages/tools/perplexity-india.astro',
  'src/pages/vs/chatgpt-vs-claude-india.astro',
  'src/pages/vs/chatgpt-vs-gemini-india.astro',
  'src/pages/vs/notion-vs-claude-india.astro',
  'src/pages/about.astro',
  'src/pages/methodology.astro',
];

// Per-tool review metadata (Round 15 baseline; can be refined later)
const reviewMeta = {
  'canva-india':      { name: 'Canva',          url: 'https://www.canva.com',          priceInr: '590',   rating: 4.5 },
  'chatgpt-india':    { name: 'ChatGPT',        url: 'https://chat.openai.com',        priceInr: '1994',  rating: 4.4 },
  'claude-india':     { name: 'Claude',         url: 'https://claude.ai',              priceInr: '2005',  rating: 4.6 },
  'copilot-india':    { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', priceInr: '997', rating: 4.4 },
  'gemini-india':     { name: 'Gemini',         url: 'https://gemini.google.com',      priceInr: '1994',  rating: 4.4 },
  'midjourney-india': { name: 'Midjourney',     url: 'https://www.midjourney.com',     priceInr: '997',   rating: 4.5 },
  'notion-india':     { name: 'Notion AI',      url: 'https://www.notion.so',          priceInr: '997',   rating: 4.2 },
  'perplexity-india': { name: 'Perplexity',     url: 'https://www.perplexity.ai',      priceInr: '1994',  rating: 4.5 },
};

function escapeAttr(s) {
  return String(s).replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function stripTags(s) {
  return s
    .replace(/<a [^>]*>/g, '')
    .replace(/<\/a>/g, '')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<em>/g, '')
    .replace(/<\/em>/g, '')
    .replace(/<code>/g, '')
    .replace(/<\/code>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract <div class="faq-item"><h3>...</h3><p>...</p></div> blocks
function extractFaqs(content) {
  const re = /<div class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g;
  const out = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    out.push({ question: stripTags(m[1]), answer: stripTags(m[2]) });
  }
  return out;
}

let updated = 0, skipped = 0, failed = 0;
for (const rel of targets) {
  const file = path.join(root, rel);
  let src;
  try {
    src = await fs.readFile(file, 'utf-8');
  } catch (e) {
    console.warn('SKIP (missing)', rel);
    failed++;
    continue;
  }

  if (src.includes('const faqs')) {
    skipped++;
    console.log('SKIP (already has faqs)', rel);
    continue;
  }

  const faqs = extractFaqs(src);
  const slug = path.basename(rel, '.astro');
  const meta = reviewMeta[slug];

  // Build the frontmatter additions
  const lines = [];
  if (faqs.length) {
    lines.push('const faqs = [');
    for (const f of faqs) {
      lines.push(`  { question: \`${escapeAttr(f.question)}\`, answer: \`${escapeAttr(f.answer)}\` },`);
    }
    lines.push('];');
  }
  if (meta) {
    lines.push(`const reviewedItem = { name: '${meta.name}', url: '${meta.url}', priceInr: '${meta.priceInr}', categoryLabel: 'SaaS' };`);
    lines.push(`const rating = { value: ${meta.rating}, best: 5 };`);
  }
  const insertion = lines.length ? '\n' + lines.join('\n') + '\n' : '';

  if (!insertion) {
    skipped++;
    console.log('SKIP (no faqs, no meta)', rel);
    continue;
  }

  // Insert before the closing --- of frontmatter
  const fmEnd = src.indexOf('---', 4); // find second ---
  if (fmEnd === -1) {
    console.warn('SKIP (no frontmatter)', rel);
    failed++;
    continue;
  }
  const newSrc = src.slice(0, fmEnd) + insertion + src.slice(fmEnd);

  // Add the new props to the ArticleLayout opening tag
  const propsToAdd = [];
  if (faqs.length) propsToAdd.push('  faqs={faqs}');
  if (meta) {
    propsToAdd.push('  reviewedItem={reviewedItem}');
    propsToAdd.push('  rating={rating}');
  }

  const out = newSrc.replace(
    /<ArticleLayout([\s\S]*?)>/m,
    (match, attrs) => `<ArticleLayout${attrs}\n${propsToAdd.join('\n')}\n>`
  );

  await fs.writeFile(file, out);
  updated++;
  console.log(`OK ${rel}  (${faqs.length} faqs${meta ? ', +reviewedItem' : ''})`);
}

console.log(`\nUpdated ${updated}, skipped ${skipped}, failed ${failed}`);
