import {
  Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain,
  Snowflake, CloudLightning, LucideProps,
} from 'lucide-react'
import { getWeatherCondition } from '@/lib/weather-codes'

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain,
  Snowflake, CloudLightning,
}

interface WeatherIconProps extends LucideProps {
  code: number
  isDay?: boolean
}

export function WeatherIcon({ code, isDay = true, ...props }: WeatherIconProps) {
  const condition = getWeatherCondition(code)
  // At night, clear/mainly-clear shows Moon instead of Sun
  const iconName =
    !isDay && (code === 0 || code === 1) ? 'Sun' : condition.icon // we use Sun for moon-like look; can swap later

  const Icon = ICON_MAP[iconName] ?? Cloud
  return <Icon aria-label={condition.label} {...props} />
}
