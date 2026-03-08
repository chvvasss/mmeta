"use client"

import { useState } from "react"
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { BreakdownRow } from "@/lib/mock-analytics"

interface BreakdownTableProps {
  data: BreakdownRow[]
  loading?: boolean
  highlightMetric?: string
}

type SortKey = "label" | "spend" | "impressions" | "clicks" | "cpc" | "ctr" | "conversions" | "cpa" | "roas" | "sharePercent"

export function BreakdownTable({ data, loading, highlightMetric }: BreakdownTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  })

  const maxSpend = Math.max(...data.map(d => d.spend))

  if (loading) {
    return (
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-12 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[1fr_90px_90px_80px_70px_60px_70px_70px_60px_60px] items-center gap-1 px-4 py-2.5 border-b border-[rgba(148,163,184,0.06)] text-[10px] font-medium text-slate-600 uppercase tracking-wider">
        <SortCol label="Kırılım" sortKey="label" currentKey={sortKey} dir={sortDir} onSort={toggleSort} />
        <SortCol label="Harcama" sortKey="spend" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="Gösterim" sortKey="impressions" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="Tıklama" sortKey="clicks" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="CPC" sortKey="cpc" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="CTR" sortKey="ctr" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="Dönüşüm" sortKey="conversions" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="CPA" sortKey="cpa" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="ROAS" sortKey="roas" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
        <SortCol label="Pay" sortKey="sharePercent" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
      </div>

      {/* Rows */}
      {sorted.map((row) => (
        <div
          key={row.key}
          className="table-row-hover grid grid-cols-1 lg:grid-cols-[1fr_90px_90px_80px_70px_60px_70px_70px_60px_60px] items-center gap-1 px-4 py-3 border-b border-[rgba(148,163,184,0.06)]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-medium text-white">{row.label}</span>
            {/* Mini bar */}
            <div className="hidden xl:flex flex-1 max-w-[100px]">
              <div className="h-1.5 rounded-full bg-slate-800/50 w-full">
                <div
                  className="h-full rounded-full bg-blue-500/40 transition-all"
                  style={{ width: `${(row.spend / maxSpend) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-semibold text-white">{formatCurrency(row.spend)}</div>
          <div className="text-right text-xs text-slate-300">{formatNumber(row.impressions)}</div>
          <div className="text-right text-xs text-slate-300">{formatNumber(row.clicks)}</div>
          <div className={`text-right text-xs font-semibold ${highlightMetric === "cpc" ? "text-blue-400" : "text-white"}`}>
            {formatCurrency(row.cpc)}
          </div>
          <div className={`text-right text-xs font-semibold ${highlightMetric === "ctr" ? "text-blue-400" : "text-white"}`}>
            {formatPercent(row.ctr)}
          </div>
          <div className="text-right text-xs font-semibold text-emerald-400">{formatNumber(row.conversions)}</div>
          <div className="text-right text-xs text-slate-300">{formatCurrency(row.cpa)}</div>
          <div className={`text-right text-xs font-semibold ${row.roas >= 4 ? "text-emerald-400" : row.roas >= 2 ? "text-amber-400" : "text-red-400"}`}>
            {row.roas.toFixed(2)}x
          </div>
          <div className="text-right text-xs text-slate-500">%{row.sharePercent}</div>
        </div>
      ))}
    </div>
  )
}

function SortCol({ label, sortKey, currentKey, dir, onSort, className = "" }: {
  label: string; sortKey: SortKey; currentKey: SortKey; dir: "asc" | "desc"; onSort: (k: SortKey) => void; className?: string
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 hover:text-slate-300 transition-colors ${className} ${currentKey === sortKey ? "text-blue-400" : ""}`}
    >
      {label}
      <ArrowUpDown className="h-2.5 w-2.5" />
    </button>
  )
}
