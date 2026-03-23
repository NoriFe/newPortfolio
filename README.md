![cover](https://github.com/NoriFe/newPortfolio/blob/main/src/images/start.png)


# I`m looking for opportunities to become a Junior Full-Stack Developer


My new portfolio 2023.

## Tools

- HTML + CSS(tailwind framework) + JS
- GitHub API
- CSS Grid
- Flex

## Deploy On Cloudflare Pages

Use these settings so Tailwind CSS is built correctly in production.

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: project root (leave empty unless Cloudflare asks)

### Why This Is Needed

The file `src/index.css` contains Tailwind directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`).
These must be processed by Parcel/PostCSS during build. If Cloudflare serves `src` directly, styles will not be applied.

### Local Check Before Deploy

Run:

```bash
npm install
npm run build
```

Then confirm generated files exist in `dist/` (HTML, CSS, JS, images).

## AI Chat On Cloudflare Worker (Wrangler)

This project uses a single Worker for both static assets and chat API route.

- Worker entry: `worker.js`
- Config: `wrangler.toml`
- API route: `/api/chat`

### Required Secret

Add the Groq key with Wrangler CLI:

```bash
npx wrangler secret put GROQ_API_KEY
```

Important: the command expects the variable name, not the key value.
Wrangler will prompt you to paste the secret value after running the command.

### Deploy With Wrangler

```bash
npm run build
npx wrangler deploy
```

The Worker serves files from `dist/` via the `ASSETS` binding and handles `/api/chat` in `worker.js`.

### Safety Controls Included

- Message length validation
- Topic restriction (answers only about Norbert's profile)
- Prompt injection keyword blocking
- Basic per-IP rate limiting
- Strict system prompt to avoid inventing facts
