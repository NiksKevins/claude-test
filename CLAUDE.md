# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Architecture

This is a Next.js 16 (App Router) project with TypeScript and Tailwind CSS v4.

- `app/layout.tsx` — Root layout: sets HTML structure, loads Geist fonts, applies Tailwind base classes
- `app/page.tsx` — Home route (`/`), a Server Component
- `app/globals.css` — Global styles and Tailwind imports; defines CSS variables for light/dark theming
- `public/` — Static assets served at the root path
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript config; path alias `@/*` maps to the project root

Styling uses Tailwind CSS v4 via PostCSS (`postcss.config.mjs`). Dark mode is handled through `prefers-color-scheme` CSS variables rather than a Tailwind dark-mode class strategy.

## Next.js Version Warning

This project uses Next.js 16, which may have breaking changes relative to training data. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for the authoritative API reference and heed any deprecation notices.
