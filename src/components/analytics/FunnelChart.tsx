"use client"

import { formatNumber, formatPercent } from "@/lib/formatting"
import type { FunnelStep } from "@/lib/mock-analytics"

interface FunnelChartProps {
  data: FunnelStep[]
  loading?: boolean
}

export function FunnelChart({ data, loading }: FunnelChartProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="skeleton-loader h-5 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-14 rounded-lg" style={{ width: `${100 - i * 12}%` }} />
          ))}
        </div>
      </div>
    )
  }

  const maxValue = data[0]?.value || 1

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Dönüşüm Hunisi
      </h3>
      <p className="text-[11px] text-slate-600 mb-6">Gösterimden satın almaya kadar kullanıcı yolculuğu</p>

      <div className="space-y-3">
        {data.map((step, i) => {
          const widthPercent = Math.max((step.value / maxValue) * 100, 8)
          const prevStep = i > 0 ? data[i - 1] : null

          return (
            <div key={step.label} className="group">
              {/* Dropoff indicator */}
              {i > 0 && prevStep && (
                <div className="flex items-center gap-2 mb-1.5 ml-2">
                  <div className="h-4 w-px bg-slate-800" />
                  <span className="text-[10px] text-red-400/70 font-medium">
                    ↓ %{step.dropoff} kayıp ({formatNumber(prevStep.value - step.value)})
                  </span>
                </div>
              )}

              <div className="relative">
                {/* Bar */}
                <div
                  className="relative h-14 rounded-lg overflow-hidden transition-all duration-500 group-hover:shadow-lg"
                  style={{ width: `${widthPercent}%`, minWidth: "180px" }}
                >
                  {/* Background gradient */}
                  <div
                    className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity"
                    style={{ backgroundColor: step.color }}
                  />
                  {/* Border */}
                  <div
                    className="absolute inset-0 rounded-lg border transition-colors"
                    style={{ borderColor: `${step.color}30` }}
                  />

                  {/* Content */}
                  <div className="relative h-full flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: step.color }} />
                      <div>
                        <p className="text-xs font-medium text-white">{step.label}</p>
                        <p className="text-[10px] text-slate-500">{formatPercent(step.percent)} toplam</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatNumber(step.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      {data.length > 1 && (
        <div className="mt-6 pt-4 border-t border-[rgba(148,163,184,0.06)] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Genel Dönüşüm Oranı</span>
          <span className="text-sm font-bold text-emerald-400">
            {formatPercent((data[data.length - 1].value / data[0].value) * 100)}
          </span>
        </div>
      )}
    </div>
  )
}
