# Weather App

A production-ready weather app built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui. Powered entirely by free, open APIs — no API keys required.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How location detection works

On every visit the app runs this priority chain:

1. **Saved location** — if you previously searched or used GPS, the choice is persisted in `localStorage` and restored immediately so the UI loads fast.
2. **IP geolocation** — the client fetches `/api/location`, a Next.js Route Handler that reads Vercel's injected geo headers (`x-vercel-ip-latitude`, `x-vercel-ip-longitude`, etc.) and returns an approximate position. The coordinates are then reverse-geocoded via Open-Meteo Geocoding to get a city name.
3. **Default city** — if both of the above fail (e.g. running locally where Vercel headers are absent), the app falls back to **Riga, Latvia**. Change `DEFAULT_LOCATION` in `lib/location.ts` to use a different city.
4. **Precise GPS** — users can click **"Use my current location"** at any time to trigger `navigator.geolocation`. This is always opt-in; the app never requests GPS automatically on page load.

## How the IP fallback works on Vercel

Vercel's Edge Network automatically adds geo-enriched headers to every incoming request:

| Header | Content |
|---|---|
| `x-vercel-ip-latitude` | Decimal latitude of the client IP |
| `x-vercel-ip-longitude` | Decimal longitude |
| `x-vercel-ip-city` | City name (URL-encoded) |
| `x-vercel-ip-country` | ISO 3166-1 alpha-2 country code |
| `x-vercel-ip-country-region` | Region / state code |
| `x-vercel-ip-timezone` | IANA timezone string |

The Route Handler at `app/api/location/route.ts` reads these headers and returns them as JSON. No third-party geolocation service or API key is needed. Locally the headers are absent, so the route returns `{ location: null }` and the app falls back to the default city.

## APIs used

| API | Purpose | Docs |
|---|---|---|
| **Open-Meteo Forecast** | Current conditions, hourly & 7-day forecast | https://open-meteo.com/en/docs |
| **Open-Meteo Geocoding** | City search autocomplete & reverse geocoding | https://open-meteo.com/en/docs/geocoding-api |

Both APIs are free, require no authentication, and have generous rate limits.

## Architecture

```
app/
  page.tsx                  # Thin server component — renders WeatherApp
  layout.tsx                # Root layout: fonts, Toaster
  api/location/route.ts     # IP geolocation Route Handler (Vercel headers)
  globals.css               # Tailwind + glassmorphism utility class

components/
  WeatherApp.tsx            # Root client component; wires hooks to UI
  search/
    LocationSearch.tsx      # Debounced search input with keyboard nav
  weather/
    CurrentWeather.tsx      # Big temperature display, location, time
    HourlyForecast.tsx      # Horizontally scrollable 24h strip
    DailyForecast.tsx       # 7-day list with temperature range bar
    WeatherMetrics.tsx      # Humidity, wind, UV, sunrise/sunset cards
    WeatherIcon.tsx         # Maps WMO weather codes to Lucide icons
    WeatherSkeleton.tsx     # Loading skeleton layout

hooks/
  useLocation.ts            # Location state machine (GPS / IP / saved / default)
  useWeather.ts             # Fetches weather for the active location
  useSearch.ts              # Debounced geocoding search state
  useUnits.ts               # C/F and km/h/mph toggle, persisted in localStorage

lib/
  weather.ts                # Open-Meteo forecast fetch + response normalisation
  geocoding.ts              # Open-Meteo geocoding fetch helpers
  weather-codes.ts          # WMO code to label, icon name, background gradient
  units.ts                  # Temperature and wind speed conversion utilities
  location.ts               # Location normalisation, localStorage persistence

types/
  weather.ts                # WeatherResponse, ProcessedWeather, ProcessedDay, etc.
  location.ts               # Location, GeocodingResult, Coordinates, LocationSource
```

## Deploying to Vercel

Push to GitHub and import the repository in the Vercel dashboard. No environment variables are required — everything uses public APIs. The IP geolocation fallback works automatically on Vercel without any additional configuration.
