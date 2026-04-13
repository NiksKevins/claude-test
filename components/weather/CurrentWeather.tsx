'use client'

import { MapPin, Navigation } from 'lucide-react'
import { WeatherIcon } from './WeatherIcon'
import { getWeatherCondition } from '@/lib/weather-codes'
import { formatTemperature, formatTemperatureWithUnit } from '@/lib/units'
import type { ProcessedWeather } from '@/types/weather'
import type { Location, LocationSource } from '@/types/location'
import type { TemperatureUnit } from '@/types/weather'
import { formatLocationName } from '@/lib/location'

interface CurrentWeatherProps {
  weather: ProcessedWeather
  location: Location
  locationSource: LocationSource | null
  tempUnit: TemperatureUnit
  onUseMyLocation: () => void
}

const SOURCE_LABEL: Record<LocationSource, string | null> = {
  gps: 'GPS',
  ip: 'Approximate',
  search: null,
  saved: null,
  default: 'Default location',
}

export function CurrentWeather({
  weather,
  location,
  locationSource,
  tempUnit,
  onUseMyLocation,
}: CurrentWeatherProps) {
  const { current } = weather
  const condition = getWeatherCondition(current.weatherCode)

  // Format current time in the location's timezone
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: location.timezone !== 'auto' ? location.timezone : undefined,
  })
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: location.timezone !== 'auto' ? location.timezone : undefined,
  })

  const sourceLabel = locationSource ? SOURCE_LABEL[locationSource] : null

  return (
    <div className="flex flex-col items-center text-center gap-2 pt-2 pb-6">
      {/* Location */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-white/90">
          <MapPin className="h-4 w-4" />
          <span className="text-lg font-semibold tracking-tight">
            {formatLocationName(location)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-white/50 text-sm">{dateStr} · {timeStr}</p>
          {sourceLabel && (
            <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
              {sourceLabel}
            </span>
          )}
        </div>
        {locationSource !== 'gps' && (
          <button
            type="button"
            onClick={onUseMyLocation}
            className="flex items-center gap-1.5 text-xs text-sky-300/80 hover:text-sky-200 transition-colors mt-0.5"
            aria-label="Use precise GPS location"
          >
            <Navigation className="h-3 w-3" />
            Use my current location
          </button>
        )}
      </div>

      {/* Big temperature + icon */}
      <div className="flex items-center gap-4 mt-4">
        <WeatherIcon
          code={current.weatherCode}
          isDay={current.isDay}
          className="h-20 w-20 text-white/90 drop-shadow-lg"
          strokeWidth={1.25}
        />
        <div className="text-right">
          <div
            className="text-8xl font-thin tracking-tighter text-white leading-none tabular-nums"
            aria-label={`${Math.round(current.temperature)} degrees ${tempUnit}`}
          >
            {formatTemperature(current.temperature, tempUnit)}
          </div>
          <div className="text-white/60 text-base mt-1">{condition.label}</div>
        </div>
      </div>

      {/* Feels like */}
      <p className="text-white/50 text-sm mt-1">
        Feels like {formatTemperatureWithUnit(current.apparentTemperature, tempUnit)}
      </p>
    </div>
  )
}
