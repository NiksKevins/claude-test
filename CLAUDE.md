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

This is a Next.js 16 (App Router) weather app with TypeScript, Tailwind CSS v4, and shadcn/ui (Radix/Nova preset).

Key structural choices:
- `app/page.tsx` is a thin server component that renders `components/WeatherApp.tsx`, a `'use client'` root that owns all interactive state.
- `app/api/location/route.ts` — Route Handler that reads Vercel geo headers (`x-vercel-ip-latitude` etc.) for IP-based location fallback. Returns `{ location: null }` when running locally.
- `app/globals.css` defines a `.glass-card` utility (backdrop-blur glassmorphism) used by all weather cards.
- `tsconfig.json` — path alias `@/*` maps to the project root.
- shadcn/ui components live in `components/ui/`; they use `@base-ui/react` under the hood (not Radix UI directly — this is a Next.js 16 shadcn change).

**Data flow:** `useLocation` → coordinates → `useWeather` (calls Open-Meteo) → processed data → individual display components.

**Location priority chain:** saved localStorage → IP geolocation (`/api/location`) → default city (Riga). GPS is always opt-in via "Use my current location" button.

**Weather codes:** WMO codes from Open-Meteo are mapped to Lucide icon names and background gradients in `lib/weather-codes.ts`.

**Lint rule to be aware of:** Next.js 16 enforces `react-hooks/set-state-in-effect` — avoid calling `setState` synchronously inside `useEffect`. Use lazy `useState` initialisers for reading localStorage, and `useTransition` for async state updates triggered by effects.

## Next.js Version Warning

This project uses Next.js 16, which may have breaking changes relative to training data. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for the authoritative API reference and heed any deprecation notices.
