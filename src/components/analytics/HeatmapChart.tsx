"use client"

import { useState } from "react"
import { formatNumber, formatCurrency, formatPercent } from "@/lib/formatting"
import type { HeatmapCell } from "@/lib/mock-analytics"

interface HeatmapChartProps {
  data: HeatmapCell[]
  metric: string
  loading?: boolean
  onMetricChange?: (metric: "clicks" | "conversions" | "spend" | "ctr") => void
}

const METRIC_OPTIONS = [
  { key: "clicks", label: "Tıklama" },
  { key: "conversions", label: "Dönüşüm" },
  { key: "spend", label: "Harcama" },
  { key: "ctr", label: "CTR" },
] as const

const DAY_LABELS = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]

function getHeatColor(normalizedValue: number): string {
  if (normalizedValue < 0.15) return "rgba(59, 130, 246, 0.08)"
  if (normalizedValue < 0.3) return "rgba(59, 130, 246, 0.15)"
  if (normalizedValue < 0.45) return "rgba(59, 130, 246, 0.25)"
  if (normalizedValue < 0.6) return "rgba(59, 130, 246, 0.38)"
  if (normalizedValue < 0.75) return "rgba(59, 130, 246, 0.52)"
  if (normalizedValue < 0.9) return "rgba(59, 130, 246, 0.68)"
  return "rgba(59, 130, 246, 0.85)"
}

function formatValue(value: number, metric: string): string {
  switch (metric) {
    case "spend": return formatCurrency(value)
    case "ctr": return formatPercent(value)
    default: return formatNumber(value)
  }
}

export function HeatmapChart({ data, metric, loading, onMetricChange }: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null)

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="skeleton-loader h-5 w-48 mb-6" />
        <div className="skeleton-loader h-64 rounded-lg" />
      </div>
    )
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const hourLabels = hours.filter(h => h % 3 === 0).map(h => `${h.toString().padStart(2, "0")}:00`)

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Performans Isı Haritası
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">Gün × Saat bazında performans dağılımı</p>
        </div>
        <div className="flex items-center gap-1">
          {METRIC_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onMetricChange?.(opt.key)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                metric === opt.key
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Hour labels */}
          <div className="grid grid-cols-[50px_repeat(24,1fr)] gap-[2px] mb-1">
            <div />
            {hours.map((h) => (
              <div key={h} className="text-center">
                {h % 3 === 0 && (
                  <span className="text-[9px] text-slate-600">{h.toString().padStart(2, "0")}</span>
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAY_LABELS.map((day, dayIdx) => (
            <div key={day} className="grid grid-cols-[50px_repeat(24,1fr)] gap-[2px] mb-[2px]">
              <div className="flex items-center">
                <span className="text-[10px] text-slate-500 font-medium">{day}</span>
              </div>
              {hours.map((hour) => {
                const cell = data.find(c => c.day === dayIdx && c.hour === hour)
                if (!cell) return <div key={hour} />

                const isHovered = hoveredCell?.day === cell.day && hoveredCell?.hour === cell.hour

                return (
                  <div
                    key={hour}
                    className="relative aspect-[1.8] rounded-[3px] cursor-pointer transition-all duration-150"
                    style={{
                      backgroundColor: getHeatColor(cell.normalizedValue),
                      transform: isHovered ? "scale(1.3)" : "scale(1)",
                      zIndex: isHovered ? 10 : 1,
                      boxShadow: isHovered ? "0 0 12px rgba(59, 130, 246, 0.3)" : "none",
                    }}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-4 flex items-center gap-4 text-[11px]">
          <span className="text-slate-500">
            {hoveredCell.dayLabel}, {hoveredCell.hourLabel}
          </span>
          <span className="text-white font-semibold">
            {formatValue(hoveredCell.value, metric)}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-slate-600">Düşük</span>
            <div className="flex gap-[2px]">
              {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((v) => (
                <div key={v} className="h-3 w-5 rounded-[2px]" style={{ backgroundColor: getHeatColor(v) }} />
              ))}
            </div>
            <span className="text-[10px] text-slate-600">Yüksek</span>
          </div>
        </div>
      )}
    </div>
  )
}
