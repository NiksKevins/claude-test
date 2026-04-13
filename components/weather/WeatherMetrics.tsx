'use client'

import { Droplets, Wind, Gauge, Sunrise, Sunset, Umbrella, Cloud } from 'lucide-react'
import type { ProcessedWeather, ProcessedDay } from '@/types/weather'
import type { WindSpeedUnit } from '@/types/weather'
import { formatWindSpeed, formatWindDirection, getUvLabel } from '@/lib/units'

interface WeatherMetricsProps {
  weather: ProcessedWeather
  today: ProcessedDay
  windUnit: WindSpeedUnit
}

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
}

function MetricCard({ label, value, sub, icon }: MetricCardProps) {
  return (
    <div className="glass-card p-4 rounded-2xl flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-2 text-white/50">
        <span className="text-white/40">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-white font-semibold text-xl leading-none">{value}</div>
      {sub && <div className="text-white/50 text-xs">{sub}</div>}
    </div>
  )
}

/** Format "2024-04-13T06:15" → "6:15 AM". No timezone conversion needed — the API string is already local time. */
function formatLocalISOTime(iso: string): string {
  const timePart = iso.slice(11, 16) // "06:15"
  const [h, m] = timePart.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function WeatherMetrics({ weather, today, windUnit }: WeatherMetricsProps) {
  const { current } = weather

  const sunriseStr = formatLocalISOTime(today.sunrise)
  const sunsetStr = formatLocalISOTime(today.sunset)

  const metrics = [
    {
      label: 'Humidity',
      value: `${current.humidity}%`,
      sub: current.humidity > 70 ? 'High' : current.humidity < 30 ? 'Low' : 'Comfortable',
      icon: <Droplets className="h-4 w-4" />,
    },
    {
      label: 'Wind',
      value: formatWindSpeed(current.windSpeed, windUnit),
      sub: `${formatWindDirection(current.windDirection)} direction`,
      icon: <Wind className="h-4 w-4" />,
    },
    {
      label: 'Precipitation',
      value: `${today.precipitationProbabilityMax}%`,
      sub: today.precipitationSum > 0 ? `${today.precipitationSum.toFixed(1)} mm today` : 'No rain expected',
      icon: <Umbrella className="h-4 w-4" />,
    },
    {
      label: 'Cloud Cover',
      value: `${current.cloudCover}%`,
      sub: current.cloudCover < 20 ? 'Clear' : current.cloudCover < 60 ? 'Partly cloudy' : 'Overcast',
      icon: <Cloud className="h-4 w-4" />,
    },
    {
      label: 'UV Index',
      value: current.uvIndex.toFixed(0),
      sub: getUvLabel(current.uvIndex),
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      label: 'Sunrise',
      value: sunriseStr,
      sub: 'Local time',
      icon: <Sunrise className="h-4 w-4" />,
    },
    {
      label: 'Sunset',
      value: sunsetStr,
      sub: 'Local time',
      icon: <Sunset className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  )
}
