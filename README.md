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
