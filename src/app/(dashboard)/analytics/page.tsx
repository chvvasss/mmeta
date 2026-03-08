"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  Layers,
  GitCompare,
  ChevronRight,
  Flame,
  Target,
  Activity,
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { usePerformanceTrend, useFunnel, useHeatmap, useBreakdown, useRegionBreakdown } from "@/hooks/use-analytics"
import { FunnelChart } from "@/components/analytics/FunnelChart"
import { HeatmapChart } from "@/components/analytics/HeatmapChart"
import { RegionChart } from "@/components/analytics/RegionChart"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"

type TrendMetric = "spend" | "clicks" | "conversions" | "roas"

const TREND_METRICS = [
  { key: "spend" as const, label: "Harcama", color: "#3b82f6", format: (v: number) => `₺${(v / 1000).toFixed(1)}k` },
  { key: "clicks" as const, label: "Tıklama", color: "#10b981", format: (v: number) => `${(v / 1000).toFixed(1)}k` },
  { key: "conversions" as const, label: "Dönüşüm", color: "#f59e0b", format: (v: number) => String(Math.round(v)) },
  { key: "roas" as const, label: "ROAS", color: "#8b5cf6", format: (v: number) => `${v.toFixed(1)}x` },
]

export default function AnalyticsPage() {
  const [trendMetric, setTrendMetric] = useState<TrendMetric>("spend")
  const [heatmapMetric, setHeatmapMetric] = useState<"clicks" | "conversions" | "spend" | "ctr">("clicks")

  const { data: trendData, isLoading: trendLoading } = usePerformanceTrend(30)
  const { data: funnelData, isLoading: funnelLoading } = useFunnel()
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap(heatmapMetric)
  const { data: placementData, isLoading: placementLoading } = useBreakdown("placement")
  const { data: regionData, isLoading: regionLoading } = useRegionBreakdown()

  const currentMetricConfig = TREND_METRICS.find(m => m.key === trendMetric) || TREND_METRICS[0]

  // Transform trend data to include roas field for chart
  const chartTrendData = useMemo(() => {
    if (!trendData) return []
    return trendData.map(d => ({
      ...d,
      roas: d.spend > 0 ? Math.round(((d.revenue || 0) / d.spend) * 100) / 100 : 0,
    }))
  }, [trendData])

  const summaryStats = trendData ? {
    totalSpend: trendData.reduce((s, d) => s + d.spend, 0),
    totalClicks: trendData.reduce((s, d) => s + d.clicks, 0),
    totalConversions: trendData.reduce((s, d) => s + (d.conversions || 0), 0),
    avgCtr: trendData.reduce((s, d) => s + d.ctr, 0) / trendData.length,
    avgRoas: (() => {
      const totalRev = trendData.reduce((s, d) => s + (d.revenue || 0), 0)
      const totalSpd = trendData.reduce((s, d) => s + d.spend, 0)
      return totalSpd > 0 ? totalRev / totalSpd : 0
    })(),
  } : null

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-cyan" style={{ top: "5%", right: "15%", width: "300px", height: "300px", opacity: 0.15 }} />
      <div className="orb orb-purple" style={{ bottom: "20%", left: "5%", width: "220px", height: "220px", opacity: 0.1 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Detaylı performans analizleri ve kırılım raporları</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/analytics/breakdown"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-[rgba(148,163,184,0.08)] transition-all"
          >
            <Layers className="h-3.5 w-3.5" />
            Kırılım Analizi
            <ChevronRight className="h-3 w-3" />
          </Link>
          <Link
            href="/analytics/compare"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-[rgba(148,163,184,0.08)] transition-all"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Karşılaştır
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Summary stat cards */}
      {summaryStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          {[
            { label: "30 Gün Harcama", value: formatCurrency(summaryStats.totalSpend), icon: Activity, color: "#3b82f6" },
            { label: "Toplam Tıklama", value: formatNumber(summaryStats.totalClicks), icon: Target, color: "#10b981" },
            { label: "Dönüşümler", value: formatNumber(summaryStats.totalConversions), icon: Flame, color: "#f59e0b" },
            { label: "Ort. CTR", value: formatPercent(summaryStats.avgCtr), icon: TrendingUp, color: "#06b6d4" },
            { label: "Ort. ROAS", value: `${summaryStats.avgRoas.toFixed(2)}x`, icon: BarChart3, color: "#8b5cf6" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 group hover:border-[rgba(148,163,184,0.12)] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 30-day trend chart */}
      <div className="glass-card chart-glow rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              30 Günlük Performans Trendi
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Günlük metrik değişimleri</p>
          </div>
          <div className="flex items-center gap-1">
            {TREND_METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setTrendMetric(m.key)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  trendMetric === m.key
                    ? "text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={trendMetric === m.key ? { backgroundColor: `${m.color}20`, color: m.color } : {}}
              >
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color, opacity: trendMetric === m.key ? 1 : 0.3 }} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {trendLoading ? (
          <div className="skeleton-loader h-72 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentMetricConfig.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={currentMetricConfig.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={currentMetricConfig.format}
                width={55}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const value = payload[0].value as number
                  const formatter = trendMetric === "spend" ? formatCurrency
                    : trendMetric === "roas" ? (v: number) => `${v.toFixed(2)}x`
                    : formatNumber
                  return (
                    <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                      <p className="text-xs text-slate-400 mb-1">{label}</p>
                      <p className="text-sm font-bold" style={{ color: currentMetricConfig.color }}>
                        {formatter(value)}
                      </p>
                    </div>
                  )
                }}
                cursor={{ stroke: "rgba(148, 163, 184, 0.1)" }}
              />
              <Area
                type="monotone"
                dataKey={trendMetric}
                stroke={currentMetricConfig.color}
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={false}
                activeDot={{ r: 4, fill: currentMetricConfig.color, stroke: "#0c1220", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Two-column: Funnel + Placements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <FunnelChart data={funnelData || []} loading={funnelLoading} />
        </div>

        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
          <div className="glass-card rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Placement Performansı
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">En yüksek harcamalı yerleşimler</p>
              </div>
              <Link href="/analytics/breakdown" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5">
                Tümünü gör <ChevronRight className="h-2.5 w-2.5" />
              </Link>
            </div>

            {placementLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton-loader h-10 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {(placementData || []).slice(0, 6).map((p, i) => {
                  const maxSpend = Math.max(...(placementData || []).map(d => d.spend))
                  const barW = (p.spend / maxSpend) * 100
                  const colors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#f97316", "#8b5cf6"]

                  return (
                    <div key={p.key} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                          <span className="text-[11px] font-medium text-white">{p.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 tabular-nums">{formatCurrency(p.spend)}</span>
                          <span className={`text-[10px] font-semibold tabular-nums ${p.roas >= 4 ? "text-emerald-400" : p.roas >= 2 ? "text-amber-400" : "text-red-400"}`}>
                            {p.roas.toFixed(1)}x
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${barW}%`, backgroundColor: colors[i], opacity: 0.5 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <HeatmapChart
          data={heatmapData || []}
          metric={heatmapMetric}
          loading={heatmapLoading}
          onMetricChange={setHeatmapMetric}
        />
      </div>

      {/* Region chart */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "360ms", animationFillMode: "forwards" }}>
        <RegionChart data={regionData || []} loading={regionLoading} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "420ms", animationFillMode: "forwards" }}>
        <Link
          href="/analytics/breakdown"
          className="glass-card rounded-xl p-5 group hover:border-cyan-500/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Kırılım Analizi
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Yaş, cinsiyet, placement, cihaz ve bölge bazında detaylı kırılımlar
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
        </Link>

        <Link
          href="/analytics/compare"
          className="glass-card rounded-xl p-5 group hover:border-amber-500/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <GitCompare className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                Kampanya Karşılaştırma
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                İki kampanyayı yan yana karşılaştırın ve performans farkını görün
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
