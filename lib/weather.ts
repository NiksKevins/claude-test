import type { WeatherResponse, ProcessedWeather, ProcessedHour, ProcessedDay } from '@/types/weather'
import type { Coordinates } from '@/types/location'

const BASE_URL = 'https://api.open-meteo.com/v1'

export async function fetchWeather(coords: Coordinates): Promise<ProcessedWeather> {
  const url = new URL(`${BASE_URL}/forecast`)

  url.searchParams.set('latitude', coords.latitude.toString())
  url.searchParams.set('longitude', coords.longitude.toString())
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('wind_speed_unit', 'kmh')
  url.searchParams.set('forecast_days', '8')

  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
      'uv_index',
    ].join(',')
  )

  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(',')
  )

  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'uv_index_max',
    ].join(',')
  )

  const response = await fetch(url.toString(), {
    next: { revalidate: 900 }, // cache 15 min on server
  })

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data: WeatherResponse = await response.json()
  return processWeatherResponse(data)
}

/**
 * Open-Meteo returns local-time ISO strings (e.g. "2024-04-13T14:00") when timezone=auto.
 * To compare times we convert to real UTC ms: parse as-if-UTC then subtract the location's offset.
 */
function localISOtoUTCms(iso: string, utcOffsetSeconds: number): number {
  return Date.parse(iso + ':00Z') - utcOffsetSeconds * 1000
}

function processWeatherResponse(data: WeatherResponse): ProcessedWeather {
  const { current, hourly, daily, timezone, utc_offset_seconds } = data

  const nowUTC = localISOtoUTCms(current.time, utc_offset_seconds)
  // Floor to the current hour so the slot we're inside (e.g. 22:00 when it's 22:35) is included
  const nowHourUTC = Math.floor(nowUTC / 3_600_000) * 3_600_000
  const cutoffUTC = nowHourUTC + 24 * 60 * 60 * 1000

  const processedHourly: ProcessedHour[] = hourly.time
    .map((t, i) => ({
      time: t, // raw local-time ISO string — formatted in the UI without timezone conversion
      temperature: hourly.temperature_2m[i],
      apparentTemperature: hourly.apparent_temperature[i],
      precipitationProbability: hourly.precipitation_probability[i] ?? 0,
      weatherCode: hourly.weather_code[i],
      windSpeed: hourly.wind_speed_10m[i],
      uvIndex: hourly.uv_index[i] ?? 0,
      isDay: hourly.is_day[i] === 1,
    }))
    .filter((h) => {
      const utcMs = localISOtoUTCms(h.time, utc_offset_seconds)
      return utcMs >= nowHourUTC && utcMs <= cutoffUTC
    })

  const processedDaily: ProcessedDay[] = daily.time.map((t, i) => ({
    date: new Date(t + 'T00:00:00Z'),
    weatherCode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    // Open-Meteo returns local-time strings when timezone=auto — store as-is, no UTC conversion
    sunrise: daily.sunrise[i],
    sunset: daily.sunset[i],
    precipitationSum: daily.precipitation_sum[i],
    precipitationProbabilityMax: daily.precipitation_probability_max[i] ?? 0,
    windSpeedMax: daily.wind_speed_10m_max[i],
    uvIndexMax: daily.uv_index_max[i] ?? 0,
  }))

  return {
    current: {
      time: new Date(current.time + ':00Z'),
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      cloudCover: current.cloud_cover,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      isDay: current.is_day === 1,
      uvIndex: current.uv_index,
    },
    hourly: processedHourly,
    daily: processedDaily,
    timezone,
    utcOffsetSeconds: utc_offset_seconds,
  }
}
