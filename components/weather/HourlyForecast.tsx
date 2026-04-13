'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '@/lib/units'
import type { ProcessedHour, TemperatureUnit } from '@/types/weather'

interface HourlyForecastProps {
  hours: ProcessedHour[]
  tempUnit: TemperatureUnit
  timezone: string
}

export function HourlyForecast({ hours, tempUnit, timezone }: HourlyForecastProps) {
  const tz = timezone !== 'auto' ? timezone : undefined

  return (
    <div className="glass-card rounded-2xl p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
        Hourly Forecast
      </h2>
      <ScrollArea className="w-full">
        <div className="flex gap-1 pb-2">
          {hours.map((hour, i) => {
            const isNow = i === 0
            const timeLabel = hour.time.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
              timeZone: tz,
            })

            return (
              <div
                key={hour.time.toISOString()}
                className={`
                  flex flex-col items-center gap-2 px-3 py-3 rounded-xl min-w-[72px] transition-colors
                  ${isNow ? 'bg-white/20' : 'hover:bg-white/10'}
                `}
              >
                <span className={`text-xs font-medium ${isNow ? 'text-white' : 'text-white/60'}`}>
                  {isNow ? 'Now' : timeLabel}
                </span>
                <WeatherIcon
                  code={hour.weatherCode}
                  isDay={hour.isDay}
                  className="h-6 w-6 text-white/80"
                  strokeWidth={1.5}
                />
                {hour.precipitationProbability > 20 && (
                  <span className="text-sky-300 text-xs font-medium">
                    {hour.precipitationProbability}%
                  </span>
                )}
                <span className={`text-sm font-semibold ${isNow ? 'text-white' : 'text-white/90'}`}>
                  {formatTemperature(hour.temperature, tempUnit)}
                </span>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0" />
      </ScrollArea>
    </div>
  )
}
