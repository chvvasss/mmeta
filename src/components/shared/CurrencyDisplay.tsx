import { cn } from "@/lib/utils"
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatting"

interface CurrencyDisplayProps {
  amount: number
  compact?: boolean
  className?: string
}

export function CurrencyDisplay({ amount, compact = false, className }: CurrencyDisplayProps) {
  return (
    <span className={cn("font-medium tabular-nums", className)}>
      {compact ? formatCurrencyCompact(amount) : formatCurrency(amount)}
    </span>
  )
}
