# India's Best AI Tools — Astro Site

Static site for indiasbestaitools.com. Built with Astro + Tailwind, deployed to Netlify.

## Deploy to Netlify (drag-and-drop method, no GitHub needed)

### Step 1 — Build the site locally
```bash
npm install
npm run build
```
This creates a `dist/` folder with all your static files.

### Step 2 — Drag-and-drop to Netlify
1. Go to https://app.netlify.com/drop
2. Drag the entire `dist/` folder onto the drop zone
3. Netlify auto-deploys to a random subdomain (e.g., `random-name.netlify.app`)
4. Site is live in ~30 seconds

### Step 3 — Connect your domain
1. In Netlify dashboard → Site settings → Domain management → Add custom domain
2. Enter: `www.indiasbestaitools.com`
3. Netlify will tell you to point your nameservers (you've already done this)
4. Wait for DNS to propagate (1-24 hours)
5. Netlify auto-issues a free SSL certificate

## Deploy via GitHub (recommended once you're comfortable)

1. Create a GitHub repo, push this folder
2. In Netlify → Add new site → Import from Git → connect repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Every git push auto-deploys

## Adding new pages

Each page is a `.astro` file in `src/pages/`. Use the existing pages as templates.
URL structure mirrors folder structure:
- `src/pages/tools/chatgpt-india.astro` → `/tools/chatgpt-india/`
- `src/pages/vs/chatgpt-vs-claude-india.astro` → `/vs/chatgpt-vs-claude-india/`
- `src/pages/for/freelancers.astro` → `/for/freelancers/`

## Folder structure
```
src/
├── components/     Header, Footer
├── layouts/        BaseLayout, ArticleLayout
├── pages/          Each .astro becomes a page
│   ├── for/
│   ├── tools/
│   ├── vs/
│   └── guides/
└── styles/         Global CSS

public/             Static files (robots.txt, favicon, og images)
```

## SEO setup checklist (after first deploy)

1. Add Google Search Console verification — verify domain
2. Submit sitemap: `https://www.indiasbestaitools.com/sitemap-index.xml`
3. Add Google Analytics 4 — uncomment the GA4 block in `BaseLayout.astro`, replace `G-XXXXXXX` with your ID
4. Apply to affiliate programs:
   - Impact.com (Anthropic, OpenAI, Notion, Canva)
   - PartnerStack (Jasper, ClickUp)
   - Cuelinks (India-specific)

## Adding affiliate links

In page content, replace placeholder URLs like `https://claude.ai` with your actual affiliate tracking URLs once approved.

## Domain & DNS

Already configured to point to Netlify nameservers via GoDaddy.
