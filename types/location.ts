export interface Coordinates {
  latitude: number
  longitude: number
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  feature_code: string
  country_code: string
  admin1_id?: number
  admin2_id?: number
  admin3_id?: number
  admin4_id?: number
  timezone: string
  population?: number
  postcodes?: string[]
  country_id?: number
  country: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
}

export interface Location {
  latitude: number
  longitude: number
  name: string
  country: string
  admin1?: string
  timezone: string
}

export type LocationSource = 'gps' | 'ip' | 'search' | 'saved' | 'default'
