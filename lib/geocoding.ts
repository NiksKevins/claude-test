import type { GeocodingResult, Location } from '@/types/location'

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1'

export interface GeocodingResponse {
  results?: GeocodingResult[]
  generationtime_ms: number
}

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return []

  const url = new URL(`${BASE_URL}/search`)
  url.searchParams.set('name', query.trim())
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString(), {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }

  const data: GeocodingResponse = await response.json()
  return data.results ?? []
}

export function geocodingResultToLocation(result: GeocodingResult): Location {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    timezone: result.timezone,
  }
}

export function formatLocationLabel(result: GeocodingResult): string {
  const parts = [result.name]
  if (result.admin1) parts.push(result.admin1)
  parts.push(result.country)
  return parts.join(', ')
}
