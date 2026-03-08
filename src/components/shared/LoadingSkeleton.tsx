import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "chart" | "page"
  className?: string
}

export function LoadingSkeleton({ variant = "card", className }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={cn("space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-6", className)}>
        <Skeleton className="h-4 w-24 bg-slate-800" />
        <Skeleton className="h-8 w-32 bg-slate-800" />
        <Skeleton className="h-3 w-20 bg-slate-800" />
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-2", className)}>
        <Skeleton className="h-10 w-full bg-slate-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-slate-800" />
        ))}
      </div>
    )
  }

  if (variant === "chart") {
    return (
      <div className={cn("rounded-xl border border-slate-800 bg-slate-900 p-6", className)}>
        <Skeleton className="mb-4 h-4 w-32 bg-slate-800" />
        <Skeleton className="h-64 w-full bg-slate-800" />
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
      <LoadingSkeleton variant="chart" />
      <LoadingSkeleton variant="table" />
    </div>
  )
}
