import { cn } from "@/lib/utils"
import { CAMPAIGN_STATUS, EFFECTIVE_STATUS, LEARNING_PHASE } from "@/lib/constants"

interface StatusBadgeProps {
  status: string
  type?: "campaign" | "effective" | "learning"
  className?: string
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
  PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  CAMPAIGN_PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ADSET_PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  IN_PROCESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  WITH_ISSUES: "bg-red-500/10 text-red-400 border-red-500/20",
  LEARNING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SUCCESS: "bg-green-500/10 text-green-400 border-green-500/20",
  FAIL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

function getLabel(status: string, type: string): string {
  if (type === "learning") {
    return LEARNING_PHASE[status as keyof typeof LEARNING_PHASE] || status
  }
  if (type === "effective") {
    return EFFECTIVE_STATUS[status as keyof typeof EFFECTIVE_STATUS] || status
  }
  return CAMPAIGN_STATUS[status as keyof typeof CAMPAIGN_STATUS] || status
}

export function StatusBadge({ status, type = "campaign", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20",
        className
      )}
    >
      {getLabel(status, type)}
    </span>
  )
}
