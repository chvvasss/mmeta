"use client"

import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { RegionData } from "@/lib/mock-analytics"

interface RegionChartProps {
  data: RegionData[]
  loading?: boolean
}

export function RegionChart({ data, loading }: RegionChartProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="skeleton-loader h-5 w-32 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-10 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const maxSpend = Math.max(...data.map(d => d.spend))
  const totalSpend = data.reduce((s, d) => s + d.spend, 0)

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Bölgesel Dağılım
      </h3>
      <p className="text-[11px] text-slate-600 mb-5">Şehir bazında reklam performansı</p>

      <div className="space-y-2">
        {data.map((region, i) => {
          const percent = (region.spend / totalSpend) * 100
          const barWidth = (region.spend / maxSpend) * 100

          return (
            <div key={region.code} className="group">
              <div className="flex items-center gap-3 py-1.5">
                {/* Region code badge */}
                <div className="h-7 w-9 rounded-md flex items-center justify-center text-[9px] font-bold bg-blue-500/10 text-blue-400 flex-shrink-0">
                  {region.code}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-white">{region.region}</span>
                    <span className="text-[10px] text-slate-500 tabular-nums">{formatCurrency(region.spend)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-100 opacity-80"
                      style={{
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, #3b82f6, #06b6d4)`,
                      }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600">CTR</p>
                    <p className="text-[11px] font-semibold text-white tabular-nums">{formatPercent(region.ctr)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600">Dönüşüm</p>
                    <p className="text-[11px] font-semibold text-white tabular-nums">{region.conversions}</p>
                  </div>
                  <div className="text-right w-10">
                    <p className="text-[9px] text-slate-600">Pay</p>
                    <p className="text-[11px] font-semibold text-slate-400 tabular-nums">%{percent.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
