"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Layers,
  Users,
  Monitor,
  MapPin,
  Clock,
  BarChart3,
  ChevronLeft,
  PieChart,
} from "lucide-react"
import { useBreakdown, useHourlyBreakdown, useRegionBreakdown } from "@/hooks/use-analytics"
import { BreakdownTable } from "@/components/analytics/BreakdownTable"
import { BreakdownChart } from "@/components/analytics/BreakdownChart"
import { RegionChart } from "@/components/analytics/RegionChart"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"

type Dimension = "age" | "gender" | "placement" | "device" | "hourly" | "region"
type ChartMetric = "spend" | "clicks" | "conversions" | "ctr" | "roas"
type ChartType = "bar" | "pie"

const DIMENSIONS = [
  { key: "age" as const, label: "Yaş", icon: Users },
  { key: "gender" as const, label: "Cinsiyet", icon: Users },
  { key: "placement" as const, label: "Placement", icon: Layers },
  { key: "device" as const, label: "Cihaz", icon: Monitor },
  { key: "hourly" as const, label: "Saatlik", icon: Clock },
  { key: "region" as const, label: "Bölge", icon: MapPin },
]

const CHART_METRICS = [
  { key: "spend" as const, label: "Harcama" },
  { key: "clicks" as const, label: "Tıklama" },
  { key: "conversions" as const, label: "Dönüşüm" },
  { key: "ctr" as const, label: "CTR" },
  { key: "roas" as const, label: "ROAS" },
]

const HOUR_COLORS = Array.from({ length: 24 }, (_, h) => {
  const isPeak = h >= 9 && h <= 23
  return isPeak ? "#3b82f6" : "#1e40af"
})

export default function BreakdownPage() {
  const [dimension, setDimension] = useState<Dimension>("age")
  const [chartMetric, setChartMetric] = useState<ChartMetric>("spend")
  const [chartType, setChartType] = useState<ChartType>("bar")

  const { data: breakdownData, isLoading: breakdownLoading } = useBreakdown(dimension)
  const { data: hourlyData, isLoading: hourlyLoading } = useHourlyBreakdown()
  const { data: regionData, isLoading: regionLoading } = useRegionBreakdown()

  const isHourly = dimension === "hourly"
  const isRegion = dimension === "region"

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-cyan" style={{ top: "8%", right: "10%", width: "260px", height: "260px", opacity: 0.12 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/analytics" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Analytics
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <Layers className="h-5 w-5 text-cyan-400" />
              Kırılım Analizi
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Demografik, placement ve cihaz bazında performans kırılımları</p>
          </div>
        </div>
      </div>

      {/* Dimension tabs */}
      <div className="flex flex-wrap items-center gap-2 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {DIMENSIONS.map((dim) => {
          const Icon = dim.icon
          return (
            <button
              key={dim.key}
              onClick={() => setDimension(dim.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                dimension === dim.key
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-sm"
                  : "text-slate-500 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {dim.label}
            </button>
          )
        })}
      </div>

      {/* Hourly View */}
      {isHourly && (
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Saatlik Performans Dağılımı
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">24 saat boyunca metrik dağılımı</p>
              </div>
              <div className="flex items-center gap-1">
                {CHART_METRICS.slice(0, 3).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setChartMetric(m.key)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                      chartMetric === m.key
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-500 hover:text-slate-300 border border-transparent"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {hourlyLoading ? (
              <div className="skeleton-loader h-72 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => chartMetric === "spend" ? `₺${v}` : String(v)}
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                          <p className="text-xs text-slate-400 mb-1">{label}</p>
                          <p className="text-sm font-bold text-cyan-400">
                            {chartMetric === "spend" ? formatCurrency(payload[0].value as number) : formatNumber(payload[0].value as number)}
                          </p>
                        </div>
                      )
                    }}
                    cursor={{ fill: "rgba(148, 163, 184, 0.04)" }}
                  />
                  <Bar dataKey={chartMetric} radius={[3, 3, 0, 0]} maxBarSize={20}>
                    {(hourlyData || []).map((entry, i) => {
                      const isPeak = entry.hour >= 9 && entry.hour <= 23
                      return <Cell key={`cell-${i}`} fill={isPeak ? "#06b6d4" : "#1e3a5f"} fillOpacity={isPeak ? 0.7 : 0.3} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Peak hours info */}
            <div className="mt-4 flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: "#06b6d4", opacity: 0.7 }} />
                <span className="text-slate-400">Pik saatler (09:00–23:00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: "#1e3a5f", opacity: 0.3 }} />
                <span className="text-slate-400">Düşük saatler</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region View */}
      {isRegion && (
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <RegionChart data={regionData || []} loading={regionLoading} />
        </div>
      )}

      {/* Standard breakdown (age, gender, placement, device) */}
      {!isHourly && !isRegion && (
        <>
          {/* Chart controls */}
          <div className="flex items-center justify-between opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
            <div className="flex items-center gap-1">
              {CHART_METRICS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setChartMetric(m.key)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                    chartMetric === m.key
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-500 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setChartType("bar")}
                className={`rounded-md p-1.5 transition-all ${chartType === "bar" ? "bg-cyan-500/15 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`rounded-md p-1.5 transition-all ${chartType === "pie" ? "bg-cyan-500/15 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
              >
                <PieChart className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
            <BreakdownChart
              data={breakdownData || []}
              metric={chartMetric}
              chartType={chartType}
              loading={breakdownLoading}
            />
          </div>

          {/* Data table */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
            <BreakdownTable
              data={breakdownData || []}
              loading={breakdownLoading}
              highlightMetric={chartMetric}
            />
          </div>
        </>
      )}

      {/* Insights card */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          💡 Öneriler
        </h3>
        <div className="space-y-2.5">
          {getInsights(dimension).map((insight, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${insight.type === "positive" ? "bg-emerald-400" : insight.type === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
              <p className="text-[11px] text-slate-400 leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getInsights(dimension: Dimension) {
  const insights: Record<Dimension, Array<{ text: string; type: "positive" | "warning" | "info" }>> = {
    age: [
      { text: "25-34 yaş grubu en yüksek harcama payına sahip (%35). Bu grup aynı zamanda en iyi ROAS performansını gösteriyor.", type: "positive" },
      { text: "13-17 yaş grubunda düşük dönüşüm oranı tespit edildi. Bu grubu hedeflemeden çıkarmayı değerlendirin.", type: "warning" },
      { text: "45+ yaş grubunda CPC ortalamanın altında — bu kitlede ölçekleme fırsatı olabilir.", type: "info" },
    ],
    gender: [
      { text: "Kadın kullanıcılar daha yüksek CTR ve dönüşüm oranı gösteriyor.", type: "positive" },
      { text: "Erkek kullanıcılarda CPC kadınlara göre %12 daha düşük.", type: "info" },
      { text: "Cinsiyet belirtilmeyen kullanıcılarda düşük performans — bu segmenti hariç tutmayı değerlendirin.", type: "warning" },
    ],
    placement: [
      { text: "Instagram Feed en yüksek ROAS'a sahip placement — bütçe payını artırmayı değerlendirin.", type: "positive" },
      { text: "Audience Network düşük CTR gösteriyor — kalite kontrol yapın.", type: "warning" },
      { text: "Instagram Reels'de engagement oranı yüksek ancak dönüşüm düşük — awareness kampanyaları için ideal.", type: "info" },
    ],
    device: [
      { text: "Mobil cihazlar toplam trafiğin %72'sini oluşturuyor — mobil optimizasyon kritik.", type: "positive" },
      { text: "Masaüstü kullanıcılarda dönüşüm oranı mobil'e göre %30 daha yüksek.", type: "info" },
      { text: "Tablet segmentinde düşük hacim — ayrı bid ayarı yapmayı değerlendirin.", type: "warning" },
    ],
    hourly: [
      { text: "20:00–23:00 arası pik performans saatleri — bid artırımı değerlendirin.", type: "positive" },
      { text: "03:00–07:00 arası düşük performans — bu saatlerde harcama kısıtlamayı değerlendirin.", type: "warning" },
      { text: "Öğlen saatlerinde (12:00-14:00) ikinci bir pik noktası gözlemleniyor.", type: "info" },
    ],
    region: [
      { text: "İstanbul toplam harcamanın %32'sini oluşturuyor ve en iyi dönüşüm oranına sahip.", type: "positive" },
      { text: "Ankara ve İzmir'de CPC ortalamanın altında — ölçekleme fırsatı.", type: "info" },
      { text: "Küçük şehirlerde reach maliyeti düşük — awareness kampanyaları için değerlendirin.", type: "info" },
    ],
  }

  return insights[dimension] || []
}
