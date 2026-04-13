export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kmh' | 'mph'

export interface CurrentWeatherData {
  time: string
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  precipitation: number
  weather_code: number
  cloud_cover: number
  wind_speed_10m: number
  wind_direction_10m: number
  is_day: number
  uv_index: number
}

export interface HourlyWeatherData {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  uv_index: number[]
  is_day: number[]
}

export interface DailyWeatherData {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  uv_index_max: number[]
}

export interface WeatherResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: Record<string, string>
  current: CurrentWeatherData
  hourly_units: Record<string, string>
  hourly: HourlyWeatherData
  daily_units: Record<string, string>
  daily: DailyWeatherData
}

export interface ProcessedHour {
  /** ISO local-time string from Open-Meteo, e.g. "2024-04-13T14:00" — already in location's timezone */
  time: string
  temperature: number
  apparentTemperature: number
  precipitationProbability: number
  weatherCode: number
  windSpeed: number
  uvIndex: number
  isDay: boolean
}

export interface ProcessedDay {
  date: Date
  weatherCode: number
  tempMax: number
  tempMin: number
  /** ISO local-time string from Open-Meteo, e.g. "2024-04-13T06:15" — already in location's timezone */
  sunrise: string
  /** ISO local-time string from Open-Meteo, e.g. "2024-04-13T20:45" — already in location's timezone */
  sunset: string
  precipitationSum: number
  precipitationProbabilityMax: number
  windSpeedMax: number
  uvIndexMax: number
}

export interface ProcessedWeather {
  current: {
    time: Date
    temperature: number
    apparentTemperature: number
    humidity: number
    precipitation: number
    weatherCode: number
    cloudCover: number
    windSpeed: number
    windDirection: number
    isDay: boolean
    uvIndex: number
  }
  hourly: ProcessedHour[]
  daily: ProcessedDay[]
  timezone: string
  utcOffsetSeconds: number
}

export interface WeatherCondition {
  label: string
  icon: string // lucide icon name
  description: string
}
