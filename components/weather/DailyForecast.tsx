'use client'

import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '@/lib/units'
import { getWeatherCondition } from '@/lib/weather-codes'
import type { ProcessedDay, TemperatureUnit } from '@/types/weather'

interface DailyForecastProps {
  days: ProcessedDay[]
  tempUnit: TemperatureUnit
  timezone: string
}

export function DailyForecast({ days, tempUnit, timezone }: DailyForecastProps) {
  const tz = timezone !== 'auto' ? timezone : undefined

  // Find the global temp range for the bar scaling
  const allMin = Math.min(...days.map((d) => d.tempMin))
  const allMax = Math.max(...days.map((d) => d.tempMax))
  const range = allMax - allMin || 1

  return (
    <div className="glass-card rounded-2xl p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
        7-Day Forecast
      </h2>
      <div className="flex flex-col divide-y divide-white/10">
        {days.map((day, i) => {
          const isToday = i === 0
          const dayLabel = isToday
            ? 'Today'
            : day.date.toLocaleDateString('en-US', {
                weekday: 'short',
                timeZone: tz,
              })
          const condition = getWeatherCondition(day.weatherCode)

          const barLeft = ((day.tempMin - allMin) / range) * 100
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100

          return (
            <div
              key={day.date.toISOString()}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              {/* Day label */}
              <span className={`text-sm w-12 shrink-0 ${isToday ? 'text-white font-medium' : 'text-white/70'}`}>
                {dayLabel}
              </span>

              {/* Icon + condition */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <WeatherIcon
                  code={day.weatherCode}
                  isDay
                  className="h-5 w-5 text-white/70 shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-xs text-white/50 truncate">{condition.label}</span>
              </div>

              {/* Precipitation */}
              <div className="w-10 shrink-0 text-right">
                {day.precipitationProbabilityMax > 20 && (
                  <span className="text-xs text-sky-300">
                    {day.precipitationProbabilityMax}%
                  </span>
                )}
              </div>

              {/* Temp range bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-sm text-white/50 w-8 text-right shrink-0">
                  {formatTemperature(day.tempMin, tempUnit)}
                </span>
                <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400 opacity-80"
                    style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-sm text-white font-medium w-8 shrink-0">
                  {formatTemperature(day.tempMax, tempUnit)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
