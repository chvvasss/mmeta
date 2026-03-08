"use client"

import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { AccountSummary } from "@/lib/mock-data"

interface AccountSummaryBarProps {
  data: AccountSummary | undefined
  loading?: boolean
}

export function AccountSummaryBar({ data, loading }: AccountSummaryBarProps) {
  if (loading || !data) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-1 opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="skeleton-loader h-3 w-14 mb-1" />
            <div className="skeleton-loader h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  const metrics = [
    { label: "Harcama", value: formatCurrency(data.totalSpend), color: "text-white" },
    { label: "Gösterim", value: formatNumber(data.totalImpressions), color: "text-slate-300" },
    { label: "Tıklama", value: formatNumber(data.totalClicks), color: "text-slate-300" },
    { label: "CPC", value: formatCurrency(data.avgCpc), color: "text-slate-300" },
    { label: "CTR", value: formatPercent(data.avgCtr), color: "text-slate-300" },
    { label: "ROAS", value: `${data.roas.toFixed(1)}x`, color: data.roas >= 4 ? "text-emerald-400" : "text-amber-400" },
    { label: "Aktif", value: `${data.activeCampaigns}/${data.totalCampaigns}`, color: "text-emerald-400" },
  ]

  return (
    <div
      className="flex gap-6 overflow-x-auto pb-1 opacity-0 animate-fade-in scrollbar-hide"
      style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
    >
      {metrics.map((m, i) => (
        <div key={m.label} className="flex-shrink-0" style={{ animationDelay: `${i * 40}ms` }}>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{m.label}</p>
          <p className={`text-sm font-semibold tabular-nums ${m.color}`}>{m.value}</p>
        </div>
      ))}
    </div>
  )
}
