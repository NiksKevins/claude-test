import { NextRequest } from 'next/server'
import type { Location } from '@/types/location'

/**
 * IP geolocation fallback using Vercel's request geo headers.
 * On Vercel, the x-vercel-ip-latitude / x-vercel-ip-longitude headers are
 * injected automatically. Locally they will be absent, so we return null.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const lat = request.headers.get('x-vercel-ip-latitude')
  const lon = request.headers.get('x-vercel-ip-longitude')
  const city = request.headers.get('x-vercel-ip-city')
  const country = request.headers.get('x-vercel-ip-country')
  const region = request.headers.get('x-vercel-ip-country-region')
  const timezone = request.headers.get('x-vercel-ip-timezone')

  if (!lat || !lon) {
    return Response.json({ location: null }, { status: 200 })
  }

  const location: Location = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    name: city ? decodeURIComponent(city) : 'Your City',
    country: country ?? '',
    admin1: region ?? undefined,
    timezone: timezone ?? 'auto',
  }

  return Response.json({ location }, { status: 200 })
}
