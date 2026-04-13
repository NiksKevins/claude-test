'use client'

import { useState, useCallback } from 'react'
import type { TemperatureUnit, WindSpeedUnit } from '@/types/weather'

const TEMP_UNIT_KEY = 'weather-app-temp-unit'
const WIND_UNIT_KEY = 'weather-app-wind-unit'

function readStorage<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return (localStorage.getItem(key) as T) ?? fallback } catch { return fallback }
}

export function useUnits() {
  const [tempUnit, setTempUnitState] = useState<TemperatureUnit>(
    () => readStorage<TemperatureUnit>(TEMP_UNIT_KEY, 'celsius')
  )
  const [windUnit, setWindUnitState] = useState<WindSpeedUnit>(
    () => readStorage<WindSpeedUnit>(WIND_UNIT_KEY, 'kmh')
  )

  const setTempUnit = useCallback((unit: TemperatureUnit) => {
    setTempUnitState(unit)
    try { localStorage.setItem(TEMP_UNIT_KEY, unit) } catch { /* ignore */ }
  }, [])

  const setWindUnit = useCallback((unit: WindSpeedUnit) => {
    setWindUnitState(unit)
    try { localStorage.setItem(WIND_UNIT_KEY, unit) } catch { /* ignore */ }
  }, [])

  const toggleTempUnit = useCallback(() => {
    setTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius')
  }, [tempUnit, setTempUnit])

  return { tempUnit, windUnit, setTempUnit, setWindUnit, toggleTempUnit }
}
