import { Skeleton } from '@/components/ui/skeleton'

export function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Current weather skeleton */}
      <div className="flex flex-col items-center gap-4 pt-4 pb-6">
        <Skeleton className="h-5 w-40 bg-white/10 rounded-full" />
        <Skeleton className="h-4 w-32 bg-white/10 rounded-full" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="h-20 w-20 bg-white/10 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-32 bg-white/10 rounded-xl" />
            <Skeleton className="h-4 w-24 bg-white/10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-4 w-36 bg-white/10 rounded-full" />
      </div>

      {/* Hourly skeleton */}
      <div className="glass-card rounded-2xl p-4">
        <Skeleton className="h-3 w-28 bg-white/10 rounded-full mb-4" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
              <Skeleton className="h-3 w-10 bg-white/10 rounded-full" />
              <Skeleton className="h-6 w-6 bg-white/10 rounded-lg" />
              <Skeleton className="h-4 w-8 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-16 bg-white/10 rounded-full" />
            <Skeleton className="h-6 w-12 bg-white/10 rounded-full" />
            <Skeleton className="h-3 w-20 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>

      {/* Daily skeleton */}
      <div className="glass-card rounded-2xl p-4">
        <Skeleton className="h-3 w-24 bg-white/10 rounded-full mb-4" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-10 bg-white/10 rounded-full" />
              <Skeleton className="h-5 w-5 bg-white/10 rounded-md" />
              <Skeleton className="flex-1 h-2 bg-white/10 rounded-full" />
              <Skeleton className="h-4 w-14 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
