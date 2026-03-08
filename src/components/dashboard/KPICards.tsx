"use client"

import { AnimatedCounter } from "@/components/shared/AnimatedCounter"
import { MiniSparkline } from "@/components/shared/MiniSparkline"
import {
  Banknote,
  Eye,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { KPIData } from "@/types/app"

const kpiConfig = [
  {
    key: "spend",
    icon: Banknote,
    glowClass: "kpi-icon-blue",
    accentColor: "#3b82f6",
    sparkData: [4200, 4800, 5100, 4600, 5300, 5800, 6100],
  },
  {
    key: "impressions",
    icon: Eye,
    glowClass: "kpi-icon-cyan",
    accentColor: "#06b6d4",
    sparkData: [120, 135, 128, 142, 155, 148, 162],
  },
  {
    key: "clicks",
    icon: MousePointerClick,
    glowClass: "kpi-icon-emerald",
    accentColor: "#10b981",
    sparkData: [3200, 3400, 3100, 3600, 3800, 4100, 4300],
  },
  {
    key: "conversions",
    icon: ShoppingCart,
    glowClass: "kpi-icon-amber",
    accentColor: "#f59e0b",
    sparkData: [78, 82, 91, 85, 95, 88, 102],
  },
]

interface KPICardsProps {
  data: KPIData[]
  loading?: boolean
}

function getFormatter(format: string): (value: number) => string {
  switch (format) {
    case "currency":
      return formatCurrency
    case "percent":
      return formatPercent
    case "number":
    default:
      return formatNumber
  }
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3" />
  if (trend === "down") return <TrendingDown className="h-3 w-3" />
  return <Minus className="h-3 w-3" />
}

export function KPICards({ data, loading }: KPICardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-5 opacity-0 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center justify-between">
              <div className="skeleton-loader h-4 w-20" />
              <div className="skeleton-loader h-8 w-8 rounded-lg" />
            </div>
            <div className="mt-4 skeleton-loader h-8 w-28" />
            <div className="mt-3 flex items-center justify-between">
              <div className="skeleton-loader h-3 w-16" />
              <div className="skeleton-loader h-7 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((config, i) => {
        const kpi = data[i]
        if (!kpi) return null

        const Icon = config.icon
        const formatter = getFormatter(kpi.format)
        const isPositiveTrend = kpi.format === "currency" && kpi.label.includes("CPC")
          ? kpi.trend === "down"
          : kpi.trend === "up"

        return (
          <div
            key={config.key}
            className="glass-card group rounded-xl p-5 opacity-0 animate-slide-up cursor-default"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                {kpi.label}
              </span>
              <div
                className={`kpi-icon-container ${config.glowClass} flex h-9 w-9 items-center justify-center rounded-lg`}
                style={{ backgroundColor: `${config.accentColor}15` }}
              >
                <Icon
                  className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: config.accentColor }}
                />
              </div>
            </div>

            {/* Value */}
            <div className="mt-3">
              <AnimatedCounter
                value={kpi.value}
                formatter={formatter}
                className="text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" } as React.CSSProperties}
              />
            </div>

            {/* Trend + Sparkline */}
            <div className="mt-3 flex items-center justify-between">
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isPositiveTrend
                    ? "bg-emerald-500/10 text-emerald-400"
                    : kpi.trend === "flat"
                    ? "bg-slate-500/10 text-slate-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <TrendIcon trend={kpi.trend} />
                <span>{Math.abs(kpi.changePercent).toFixed(1)}%</span>
              </div>
              <MiniSparkline
                data={config.sparkData}
                color={isPositiveTrend ? "#10b981" : kpi.trend === "flat" ? "#64748b" : "#ef4444"}
                width={72}
                height={24}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
