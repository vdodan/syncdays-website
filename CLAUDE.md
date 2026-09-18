# SyncDays Website — Marketing & Landing Site

## What This Is

Marketing website for the SyncDays app (syncdays.com). Showcases features, pricing tiers, changelog, roadmap, and contact form. Separate project from the main SyncDays app.

## Tech Stack

- **Next.js 16** (App Router) / React 19 / TypeScript 5
- **Tailwind CSS 4** + PostCSS
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vercel Analytics** for usage tracking
- **Deploy:** Vercel (auto-deploy on push)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home / landing page
│   ├── pricing/page.tsx     # Pricing tiers
│   ├── features/page.tsx    # Feature showcase
│   ├── changelog/page.tsx   # Version history
│   ├── roadmap/page.tsx     # Planned features
│   ├── contact/page.tsx     # Contact form
│   ├── privacy/page.tsx     # Privacy policy
│   └── terms/page.tsx       # Terms of service
├── components/
│   ├── Header.tsx           # Navigation
│   ├── Footer.tsx           # Footer
│   ├── Button.tsx, Card.tsx, Section.tsx, Container.tsx, Badge.tsx
│   └── index.ts             # Component exports
└── data/
    ├── changelog.ts         # Version history data
    └── roadmap.ts           # Roadmap items

remotion/                    # Remotion video generation (promotional content)
```

## Running Locally

```bash
npm install
npm run dev    # http://localhost:3000
```

No environment variables needed.

## Key Files to Update

| When... | Update... |
|---------|-----------|
| New app version ships | `src/data/changelog.ts` |
| Roadmap changes | `src/data/roadmap.ts` |
| Pricing changes | `src/app/pricing/page.tsx` |
| New feature to showcase | `src/app/features/page.tsx` |

## Relationship to Main App

- **Main app:** `/syncdays/` — React + Vite + Supabase (the actual product)
- **This site:** `/syncdays-website/` — Next.js marketing site
- Both deploy to Vercel under the `syncdays.com` domain
