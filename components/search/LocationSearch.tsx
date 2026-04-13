'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { Search, X, Loader2, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/hooks/useSearch'
import type { GeocodingResult } from '@/types/location'
import { geocodingResultToLocation } from '@/lib/geocoding'
import type { Location } from '@/types/location'
import { cn } from '@/lib/utils'

interface LocationSearchProps {
  onSelect: (location: Location) => void
  className?: string
}

export function LocationSearch({ onSelect, className }: LocationSearchProps) {
  const { query, setQuery, results, loading, isOpen, setIsOpen, clearSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const activeIndexRef = useRef(-1)

  // Reset active index when results change
  useEffect(() => {
    activeIndexRef.current = -1
  }, [results])

  function handleSelect(result: GeocodingResult) {
    onSelect(geocodingResultToLocation(result))
    clearSearch()
    inputRef.current?.blur()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndexRef.current = Math.min(activeIndexRef.current + 1, results.length - 1)
      const item = listRef.current?.children[activeIndexRef.current] as HTMLElement
      item?.focus()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function handleItemKeyDown(e: KeyboardEvent<HTMLLIElement>, result: GeocodingResult, index: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(result)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = listRef.current?.children[index + 1] as HTMLElement
      if (next) { activeIndexRef.current = index + 1; next.focus() }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) {
        inputRef.current?.focus()
        activeIndexRef.current = -1
      } else {
        const prev = listRef.current?.children[index - 1] as HTMLElement
        if (prev) { activeIndexRef.current = index - 1; prev.focus() }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search city or location…"
          aria-label="Search for a location"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          className="pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl h-11 transition-all"
        />
        {(loading || query) && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-50 top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl"
        >
          {results.map((result, i) => (
            <li
              key={result.id}
              role="option"
              aria-selected={false}
              tabIndex={0}
              onClick={() => handleSelect(result)}
              onKeyDown={(e) => handleItemKeyDown(e, result, i)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer text-sm text-white/90 hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors"
            >
              <MapPin className="h-4 w-4 text-white/40 shrink-0" />
              <div className="min-w-0">
                <div className="font-medium truncate">{result.name}</div>
                <div className="text-white/50 text-xs truncate">
                  {[result.admin1, result.country].filter(Boolean).join(', ')}
                </div>
              </div>
              <span className="ml-auto text-xs text-white/30 shrink-0 font-mono">
                {result.country_code}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
