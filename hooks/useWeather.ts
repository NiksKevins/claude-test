'use client'

import { useState, useEffect, useTransition } from 'react'
import type { ProcessedWeather } from '@/types/weather'
import type { Location } from '@/types/location'
import { fetchWeather } from '@/lib/weather'

interface WeatherState {
  data: ProcessedWeather | null
  error: string | null
}

export function useWeather(location: Location | null) {
  const [state, setState] = useState<WeatherState>({ data: null, error: null })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!location) return

    let cancelled = false

    startTransition(async () => {
      try {
        const data = await fetchWeather({ latitude: location.latitude, longitude: location.longitude })
        if (!cancelled) setState({ data, error: null })
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load weather data.'
          setState({ data: null, error: message })
        }
      }
    })

    return () => { cancelled = true }
  }, [location?.latitude, location?.longitude]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data: state.data, loading: isPending, error: state.error }
}
