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

function processWeatherResponse(data: WeatherResponse): ProcessedWeather {
  const { current, hourly, daily, timezone, utc_offset_seconds } = data

  // Only keep the next 24 hours of hourly data starting from now
  const nowTime = new Date(current.time + 'Z').getTime()
  const cutoff = nowTime + 24 * 60 * 60 * 1000

  const processedHourly: ProcessedHour[] = hourly.time
    .map((t, i) => {
      const time = new Date(t + ':00Z')
      return {
        time,
        temperature: hourly.temperature_2m[i],
        apparentTemperature: hourly.apparent_temperature[i],
        precipitationProbability: hourly.precipitation_probability[i] ?? 0,
        weatherCode: hourly.weather_code[i],
        windSpeed: hourly.wind_speed_10m[i],
        uvIndex: hourly.uv_index[i] ?? 0,
        isDay: hourly.is_day[i] === 1,
      } satisfies ProcessedHour
    })
    .filter((h) => h.time.getTime() >= nowTime && h.time.getTime() <= cutoff)

  const processedDaily: ProcessedDay[] = daily.time.map((t, i) => ({
    date: new Date(t + 'T00:00:00Z'),
    weatherCode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    sunrise: new Date(daily.sunrise[i] + ':00Z'),
    sunset: new Date(daily.sunset[i] + ':00Z'),
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
