import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"

interface MetricBadgeProps {
  value: number
  previousValue: number
  format?: "currency" | "number" | "percent"
  className?: string
}

export function MetricBadge({
  value,
  previousValue,
  format = "number",
  className,
}: MetricBadgeProps) {
  const change =
    previousValue === 0
      ? value > 0
        ? 100
        : 0
      : ((value - previousValue) / previousValue) * 100

  const isPositive = change > 0
  const isNeutral = change === 0

  function formatValue(val: number): string {
    switch (format) {
      case "currency":
        return formatCurrency(val)
      case "percent":
        return formatPercent(val)
      default:
        return formatNumber(val)
    }
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-2xl font-bold text-white">{formatValue(value)}</span>
      <span
        className={cn(
          "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
          isNeutral
            ? "bg-slate-700 text-slate-400"
            : isPositive
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
        )}
      >
        {isNeutral ? (
          <Minus className="h-3 w-3" />
        ) : isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {Math.abs(change).toFixed(1)}%
      </span>
    </div>
  )
}
