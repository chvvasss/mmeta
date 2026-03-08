"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { SpendChartData } from "@/types/app"

type MetricKey = "spend" | "impressions" | "clicks" | "cpc" | "ctr" | "conversions" | "revenue"

interface MetricConfig {
  key: MetricKey
  label: string
  color: string
  formatter: (v: number) => string
  yAxisFormatter: (v: number) => string
}

const METRICS: MetricConfig[] = [
  {
    key: "spend",
    label: "Harcama",
    color: "#3b82f6",
    formatter: formatCurrency,
    yAxisFormatter: (v: number) => `₺${(v / 1000).toFixed(0)}k`,
  },
  {
    key: "impressions",
    label: "Gösterim",
    color: "#06b6d4",
    formatter: formatNumber,
    yAxisFormatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
  },
  {
    key: "clicks",
    label: "Tıklama",
    color: "#10b981",
    formatter: formatNumber,
    yAxisFormatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
  },
  {
    key: "conversions",
    label: "Dönüşüm",
    color: "#f59e0b",
    formatter: formatNumber,
    yAxisFormatter: (v: number) => String(Math.round(v)),
  },
  {
    key: "cpc",
    label: "CPC",
    color: "#8b5cf6",
    formatter: formatCurrency,
    yAxisFormatter: (v: number) => `₺${v.toFixed(2)}`,
  },
  {
    key: "ctr",
    label: "CTR",
    color: "#ec4899",
    formatter: (v: number) => formatPercent(v),
    yAxisFormatter: (v: number) => `${v.toFixed(1)}%`,
  },
]

interface SpendChartProps {
  data: SpendChartData[]
  loading?: boolean
}

function ChartTooltip({
  active,
  payload,
  label,
  activeMetrics,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string }>
  label?: string
  activeMetrics: MetricConfig[]
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148, 163, 184, 0.12)" }}>
      <p className="mb-2 text-xs font-medium text-slate-400">{label}</p>
      {payload.map((entry) => {
        const metric = activeMetrics.find((m) => m.key === entry.dataKey)
        if (!metric) return null
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-slate-400">{metric.label}:</span>
            <span className="text-xs font-semibold text-white">{metric.formatter(entry.value)}</span>
          </div>
        )
      })}
    </div>
  )
}

export function SpendChart({ data, loading }: SpendChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(["spend", "clicks"])

  const toggleMetric = (key: MetricKey) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev
        return prev.filter((m) => m !== key)
      }
      if (prev.length >= 3) return prev
      return [...prev, key]
    })
  }

  const activeMetrics = METRICS.filter((m) => selectedMetrics.includes(m.key))

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between">
          <div className="skeleton-loader h-5 w-32" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-7 w-16 rounded-full" />
            ))}
          </div>
        </div>
        <div className="mt-6 skeleton-loader h-72 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="glass-card chart-glow rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Performans Trendi
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((metric) => {
            const isActive = selectedMetrics.includes(metric.key)
            if (data.length > 0 && data[0][metric.key] === undefined) return null
            return (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-slate-800/40 text-slate-500 hover:text-slate-300"
                }`}
                style={isActive ? { backgroundColor: `${metric.color}20`, color: metric.color } : {}}
              >
                <div
                  className="h-1.5 w-1.5 rounded-full transition-opacity"
                  style={{ backgroundColor: metric.color, opacity: isActive ? 1 : 0.3 }}
                />
                {metric.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 relative z-10">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              {activeMetrics.map((metric) => (
                <linearGradient key={metric.key} id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={8} />
            <YAxis
              yAxisId="left"
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={activeMetrics[0]?.yAxisFormatter || String}
              width={55}
            />
            {activeMetrics.length > 1 && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={activeMetrics[1]?.yAxisFormatter || String}
                width={55}
              />
            )}
            <Tooltip
              content={<ChartTooltip activeMetrics={activeMetrics} />}
              cursor={{ stroke: "rgba(148, 163, 184, 0.1)", strokeWidth: 1 }}
            />
            {activeMetrics.map((metric, idx) => (
              <Area
                key={metric.key}
                yAxisId={idx === 0 ? "left" : activeMetrics.length > 1 ? "right" : "left"}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
                fill={`url(#gradient-${metric.key})`}
                dot={false}
                activeDot={{ r: 4, fill: metric.color, stroke: "#0c1220", strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
