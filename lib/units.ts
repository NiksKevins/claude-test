import type { TemperatureUnit, WindSpeedUnit } from '@/types/weather'

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const temp = unit === 'fahrenheit' ? celsiusToFahrenheit(value) : Math.round(value)
  return `${temp}°`
}

export function formatTemperatureWithUnit(value: number, unit: TemperatureUnit): string {
  const temp = unit === 'fahrenheit' ? celsiusToFahrenheit(value) : Math.round(value)
  return `${temp}°${unit === 'fahrenheit' ? 'F' : 'C'}`
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371)
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') return `${kmhToMph(kmh)} mph`
  return `${Math.round(kmh)} km/h`
}

export function formatWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(degrees / 22.5) % 16]
}

export function getUvLabel(uv: number): string {
  if (uv < 3) return 'Low'
  if (uv < 6) return 'Moderate'
  if (uv < 8) return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
}
