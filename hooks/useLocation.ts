'use client'

import { useState, useCallback } from 'react'
import type { Location, LocationSource } from '@/types/location'
import { DEFAULT_LOCATION, saveLocation, loadSavedLocation } from '@/lib/location'
import { searchLocations, geocodingResultToLocation } from '@/lib/geocoding'

interface LocationState {
  location: Location | null
  source: LocationSource | null
  loading: boolean
  error: string | null
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    source: null,
    loading: false,
    error: null,
  })

  const setLocation = useCallback((location: Location, source: LocationSource) => {
    setState({ location, source, loading: false, error: null })
    if (source !== 'default') {
      saveLocation(location)
    }
  }, [])

  /** Try browser GPS → IP fallback → saved location → default */
  const initializeLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))

    // 1. Try saved location first so app feels fast
    const saved = loadSavedLocation()
    if (saved) {
      setState({ location: saved, source: 'saved', loading: false, error: null })
    }

    // 2. Try IP geolocation from server (fast, no permission needed)
    try {
      const res = await fetch('/api/location')
      if (res.ok) {
        const data = await res.json()
        if (data.location) {
          // Reverse-geocode the IP coordinates to get a city name
          const { latitude, longitude } = data.location
          const results = await searchLocations(`${latitude},${longitude}`).catch(() => [])
          if (results.length > 0) {
            const ipLocation = { ...geocodingResultToLocation(results[0]), latitude, longitude }
            setState({ location: ipLocation, source: 'ip', loading: false, error: null })
            saveLocation(ipLocation)
          } else {
            setState({ location: data.location, source: 'ip', loading: false, error: null })
            saveLocation(data.location)
          }
          return
        }
      }
    } catch {
      // IP fallback failed, continue
    }

    // 3. Fall back to saved or default
    if (!saved) {
      setState({ location: DEFAULT_LOCATION, source: 'default', loading: false, error: null })
    }
  }, [])

  /** Explicitly request precise GPS location */
  const requestGpsLocation = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser.' }))
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        // Reverse geocode to get a city name
        try {
          const results = await searchLocations(`${latitude},${longitude}`)
          if (results.length > 0) {
            const gpsLocation = { ...geocodingResultToLocation(results[0]), latitude, longitude }
            setLocation(gpsLocation, 'gps')
          } else {
            setLocation(
              { latitude, longitude, name: 'Your Location', country: '', timezone: 'auto' },
              'gps'
            )
          }
        } catch {
          setLocation(
            { latitude, longitude, name: 'Your Location', country: '', timezone: 'auto' },
            'gps'
          )
        }
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Please enable it in your browser settings.',
          2: 'Unable to determine your location.',
          3: 'Location request timed out.',
        }
        setState((s) => ({
          ...s,
          loading: false,
          error: messages[err.code] ?? 'Unable to get your location.',
        }))
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }, [setLocation])

  return {
    ...state,
    setLocation,
    initializeLocation,
    requestGpsLocation,
  }
}
