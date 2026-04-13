import type { WeatherCondition } from '@/types/weather'

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODES: Record<number, WeatherCondition> = {
  0:  { label: 'Clear Sky',          icon: 'Sun',            description: 'Clear sky' },
  1:  { label: 'Mainly Clear',       icon: 'Sun',            description: 'Mainly clear' },
  2:  { label: 'Partly Cloudy',      icon: 'CloudSun',       description: 'Partly cloudy' },
  3:  { label: 'Overcast',           icon: 'Cloud',          description: 'Overcast' },
  45: { label: 'Foggy',              icon: 'CloudFog',       description: 'Fog' },
  48: { label: 'Icy Fog',            icon: 'CloudFog',       description: 'Depositing rime fog' },
  51: { label: 'Light Drizzle',      icon: 'CloudDrizzle',   description: 'Light drizzle' },
  53: { label: 'Drizzle',            icon: 'CloudDrizzle',   description: 'Moderate drizzle' },
  55: { label: 'Heavy Drizzle',      icon: 'CloudDrizzle',   description: 'Dense drizzle' },
  56: { label: 'Freezing Drizzle',   icon: 'CloudDrizzle',   description: 'Light freezing drizzle' },
  57: { label: 'Heavy Frz Drizzle',  icon: 'CloudDrizzle',   description: 'Dense freezing drizzle' },
  61: { label: 'Light Rain',         icon: 'CloudRain',      description: 'Slight rain' },
  63: { label: 'Rain',               icon: 'CloudRain',      description: 'Moderate rain' },
  65: { label: 'Heavy Rain',         icon: 'CloudRain',      description: 'Heavy rain' },
  66: { label: 'Freezing Rain',      icon: 'CloudRain',      description: 'Light freezing rain' },
  67: { label: 'Heavy Frz Rain',     icon: 'CloudRain',      description: 'Heavy freezing rain' },
  71: { label: 'Light Snow',         icon: 'Snowflake',      description: 'Slight snowfall' },
  73: { label: 'Snow',               icon: 'Snowflake',      description: 'Moderate snowfall' },
  75: { label: 'Heavy Snow',         icon: 'Snowflake',      description: 'Heavy snowfall' },
  77: { label: 'Snow Grains',        icon: 'Snowflake',      description: 'Snow grains' },
  80: { label: 'Light Showers',      icon: 'CloudRain',      description: 'Slight rain showers' },
  81: { label: 'Showers',            icon: 'CloudRain',      description: 'Moderate rain showers' },
  82: { label: 'Heavy Showers',      icon: 'CloudRain',      description: 'Violent rain showers' },
  85: { label: 'Snow Showers',       icon: 'Snowflake',      description: 'Slight snow showers' },
  86: { label: 'Heavy Snow Showers', icon: 'Snowflake',      description: 'Heavy snow showers' },
  95: { label: 'Thunderstorm',       icon: 'CloudLightning', description: 'Thunderstorm' },
  96: { label: 'Thunderstorm',       icon: 'CloudLightning', description: 'Thunderstorm with slight hail' },
  99: { label: 'Thunderstorm',       icon: 'CloudLightning', description: 'Thunderstorm with heavy hail' },
}

const FALLBACK: WeatherCondition = { label: 'Unknown', icon: 'Cloud', description: 'Unknown conditions' }

export function getWeatherCondition(code: number): WeatherCondition {
  return WEATHER_CODES[code] ?? FALLBACK
}

export function getWeatherGradient(code: number, isDay: boolean): string {
  if (!isDay) {
    if (code <= 1) return 'from-slate-900 via-slate-800 to-indigo-950'
    if (code <= 3) return 'from-slate-900 via-slate-700 to-slate-800'
    return 'from-slate-900 via-slate-800 to-slate-900'
  }

  if (code === 0 || code === 1) return 'from-sky-400 via-blue-500 to-indigo-600'
  if (code === 2) return 'from-sky-300 via-blue-400 to-slate-500'
  if (code === 3) return 'from-slate-400 via-slate-500 to-slate-600'
  if (code === 45 || code === 48) return 'from-slate-300 via-slate-400 to-slate-500'
  if (code >= 51 && code <= 67) return 'from-slate-400 via-slate-500 to-blue-700'
  if (code >= 71 && code <= 77) return 'from-slate-200 via-blue-200 to-slate-400'
  if (code >= 80 && code <= 82) return 'from-slate-500 via-slate-600 to-blue-700'
  if (code >= 85 && code <= 86) return 'from-slate-200 via-slate-300 to-blue-300'
  if (code >= 95) return 'from-slate-700 via-slate-800 to-indigo-900'

  return 'from-sky-400 via-blue-500 to-indigo-600'
}
