import type { Location, Coordinates } from '@/types/location'

export const DEFAULT_LOCATION: Location = {
  latitude: 56.9496,
  longitude: 24.1052,
  name: 'Riga',
  country: 'Latvia',
  admin1: undefined,
  timezone: 'Europe/Riga',
}

export const STORAGE_KEY = 'weather-app-last-location'

export function saveLocation(location: Location): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export function loadSavedLocation(): Location | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (isValidLocation(parsed)) return parsed
    return null
  } catch {
    return null
  }
}

function isValidLocation(val: unknown): val is Location {
  if (!val || typeof val !== 'object') return false
  const obj = val as Record<string, unknown>
  return (
    typeof obj.latitude === 'number' &&
    typeof obj.longitude === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.country === 'string' &&
    typeof obj.timezone === 'string'
  )
}

export function coordinatesToLocation(
  coords: Coordinates,
  fallback: Partial<Location> = {}
): Location {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    name: fallback.name ?? 'Your Location',
    country: fallback.country ?? '',
    admin1: fallback.admin1,
    timezone: fallback.timezone ?? 'auto',
  }
}

export function formatLocationName(location: Location): string {
  const parts = [location.name]
  if (location.admin1) parts.push(location.admin1)
  if (location.country) parts.push(location.country)
  return parts.join(', ')
}
