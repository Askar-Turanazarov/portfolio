# Askar Turanazarov — Portfolio

Personal portfolio: case studies of the products I have built, live demos, the hard
parts behind each one and the stack I keep coming back to. Three interface languages
(EN / RU / UZ), light and dark themes, one typed registry as the single source of truth.

- GitHub: https://github.com/Askar-Turanazarov

## Stack

| Layer      | Choice                                         | Why                                                              |
| ---------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Cache Components)      | the same stack as most of my projects; static pages, partial prerender |
| Language   | TypeScript                                     | the project registry is validated with Zod and typed end to end  |
| Styling    | Tailwind CSS v4                                | design tokens as CSS variables, one neutral palette, one accent  |
| i18n       | native `app/[lang]` routing                    | three locales and a handful of routes do not need a library      |
| Theme      | next-themes                                    | class strategy, no flash, respects the system setting            |
| Content    | `content/projects.ts` + `content/i18n/*`       | every project in one file, every string in three languages       |
| Covers     | Playwright + sharp                             | screenshots of live demos taken under identical conditions       |
| Hosting    | Vercel                                         | middleware redirect, image optimisation, generated OG images     |

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: contacts and site URL
npm run dev                  # http://localhost:3000 → redirects to your language
```

Scripts:

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | development server                                                  |
| `npm run build`     | production build (also type-checks)                                 |
| `npm run start`     | serve the production build                                          |
| `npm run lint`      | ESLint                                                              |
| `npm run typecheck` | `tsc --noEmit`                                                      |
| `npm run format`    | Prettier                                                            |
| `npm run shoot`     | re-shoot project covers from the live demos (`-- slug` for a subset) |

## Configuration

Everything deployment-specific is read from the environment; see [`.env.example`](.env.example).
All variables are optional — an unset contact is simply not rendered.

| Variable                       | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | canonical origin once a custom domain is attached; otherwise the build uses `VERCEL_PROJECT_PRODUCTION_URL` |
| `NEXT_PUBLIC_CONTACT_EMAIL`    | e-mail shown in Contact and the footer                               |
| `NEXT_PUBLIC_CONTACT_TELEGRAM` | `@name`, `name` or a full `https://t.me/…` URL                       |
| `NEXT_PUBLIC_CONTACT_LINKEDIN` | LinkedIn profile URL                                                 |
| `NEXT_PUBLIC_CV_URL`           | public URL of a CV (PDF)                                             |

## Project structure

```
app/
  [lang]/               layout, home page, not-found, catch-all 404, Open Graph image
  icon0.svg, icon1.png, apple-icon.png, robots.ts, sitemap.ts
components/
  layout/               Header, Footer, ThemeToggle, LocaleSwitcher
  project/              FeaturedCase, ProjectCard, DeviceFrame, Cover, StatusBadge
  sections/             Hero, FeaturedProjects, Capabilities, AllProjects, Stack, Process, Timeline, About, Contact
  ui/                   Container, Section, Badge, Button, Reveal, icons
content/
  projects.ts           the registry: 20 projects, every text in EN / RU / UZ
  site.ts               name, links, contacts (from env)
  i18n/                 dictionaries; `en.ts` defines the shape, RU and UZ must match it
lib/                    schema (Zod), i18n helpers, dictionary loader, cover lookup
public/projects/<slug>/cover.webp
scripts/shoot.ts        cover screenshots
proxy.ts                redirects `/` to the visitor's language
```

### Adding a project

1. Add an entry to `content/projects.ts` — the Zod schema in `lib/schema.ts` validates it at import time.
2. If it has a live URL, run `npm run shoot -- <slug>` to create `public/projects/<slug>/cover.webp`.
   Projects without a cover get a generated tile with their monogram and accent colour.
3. Set `featured: true` for a full case study on the home page, or leave it in the filterable grid.

## Deploying to Vercel

1. Push the repository to GitHub.
2. In Vercel: **Add New Project → Import** the repository. Next.js is detected automatically;
   keep the default build settings and Node.js 22.x.
3. Add the environment variables you want to publish (see above) for Production.
4. Deploy. The language redirect, `/sitemap.xml`, `/robots.txt` and `/<lang>/opengraph-image`
   work out of the box.
5. Custom domain (optional): add it under **Domains**, then set `NEXT_PUBLIC_SITE_URL` and redeploy.

## License

(c) 2026 Askar Turanazarov, all rights reserved. The code, design and materials are published
for viewing only; see [LICENSE](./LICENSE).
