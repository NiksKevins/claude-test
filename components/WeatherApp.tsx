'use client'

import { useEffect } from 'react'
import { AlertCircle, Thermometer } from 'lucide-react'
import { toast } from 'sonner'
import { useLocation } from '@/hooks/useLocation'
import { useWeather } from '@/hooks/useWeather'
import { useUnits } from '@/hooks/useUnits'
import { LocationSearch } from '@/components/search/LocationSearch'
import { CurrentWeather } from '@/components/weather/CurrentWeather'
import { HourlyForecast } from '@/components/weather/HourlyForecast'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { WeatherMetrics } from '@/components/weather/WeatherMetrics'
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton'
import { getWeatherGradient } from '@/lib/weather-codes'
import type { Location } from '@/types/location'

export function WeatherApp() {
  const {
    location,
    source,
    loading: locationLoading,
    error: locationError,
    setLocation,
    initializeLocation,
    requestGpsLocation,
  } = useLocation()

  const { data: weather, loading: weatherLoading, error: weatherError } = useWeather(location)
  const { tempUnit, windUnit, toggleTempUnit } = useUnits()

  // Initialize location on mount
  useEffect(() => {
    initializeLocation()
  }, [initializeLocation])

  // Surface errors as toasts
  useEffect(() => {
    if (locationError) toast.error(locationError)
  }, [locationError])

  useEffect(() => {
    if (weatherError) toast.error(weatherError)
  }, [weatherError])

  function handleSelectLocation(loc: Location) {
    setLocation(loc, 'search')
  }

  const isLoading = locationLoading || (weatherLoading && !weather)
  const gradient =
    weather
      ? getWeatherGradient(weather.current.weatherCode, weather.current.isDay)
      : 'from-sky-400 via-blue-500 to-indigo-600'

  const today = weather?.daily[0]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000`}
    >
      {/* Ambient blur circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">

        {/* Header: search + unit toggle */}
        <header className="flex items-center gap-3">
          <LocationSearch
            onSelect={handleSelectLocation}
            className="flex-1"
          />
          <button
            type="button"
            onClick={toggleTempUnit}
            aria-label={`Switch to ${tempUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
            className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors font-semibold text-sm"
          >
            {tempUnit === 'celsius' ? '°C' : '°F'}
          </button>
        </header>

        {/* Main content */}
        {isLoading ? (
          <WeatherSkeleton />
        ) : weatherError && !weather ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-3 glass-card rounded-2xl p-12 text-center"
          >
            <AlertCircle className="h-10 w-10 text-red-300/80" />
            <p className="text-white/80 font-medium">Failed to load weather data</p>
            <p className="text-white/50 text-sm">{weatherError}</p>
            <button
              type="button"
              onClick={() => location && setLocation(location, source ?? 'default')}
              className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        ) : weather && location ? (
          <>
            <CurrentWeather
              weather={weather}
              location={location}
              locationSource={source}
              tempUnit={tempUnit}
              onUseMyLocation={requestGpsLocation}
            />

            <HourlyForecast
              hours={weather.hourly}
              tempUnit={tempUnit}
            />

            {today && (
              <WeatherMetrics
                weather={weather}
                today={today}
                windUnit={windUnit}
              />
            )}

            <DailyForecast
              days={weather.daily}
              tempUnit={tempUnit}
              timezone={location.timezone}
            />
          </>
        ) : (
          /* No location yet — shouldn't normally be visible */
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Thermometer className="h-10 w-10 text-white/40" />
            <p className="text-white/60">Detecting your location…</p>
          </div>
        )}
      </div>
    </div>
  )
}
