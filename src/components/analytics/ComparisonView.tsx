"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { ComparisonMetric, TrendComparison } from "@/lib/mock-analytics"

interface ComparisonViewProps {
  metrics: ComparisonMetric[]
  trend: TrendComparison[]
  campaignAName: string
  campaignBName: string
  loading?: boolean
}

function formatMetricValue(value: number, format: "currency" | "number" | "percent"): string {
  switch (format) {
    case "currency": return formatCurrency(value)
    case "percent": return formatPercent(value)
    default: return formatNumber(value)
  }
}

export function ComparisonView({ metrics, trend, campaignAName, campaignBName, loading }: ComparisonViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton-loader h-64 rounded-xl" />
        <div className="skeleton-loader h-72 rounded-xl" />
      </div>
    )
  }

  const aWins = metrics.filter(m => m.better === "A").length
  const bWins = metrics.filter(m => m.better === "B").length
  const winner = aWins > bWins ? "A" : aWins < bWins ? "B" : "equal"

  return (
    <div className="space-y-6">
      {/* Score header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${winner === "A" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/40"}`}>
              {winner === "A" && <Trophy className="h-4 w-4 text-emerald-400" />}
              <div>
                <p className={`text-xs font-bold ${winner === "A" ? "text-emerald-400" : "text-white"}`}>
                  {campaignAName.length > 30 ? campaignAName.slice(0, 30) + "..." : campaignAName}
                </p>
                <p className="text-[10px] text-slate-500">{aWins} metrikte önde</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 px-6">
            <div className="text-2xl font-bold text-slate-600" style={{ fontFamily: "var(--font-heading)" }}>VS</div>
          </div>

          <div className="flex-1 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${winner === "B" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/40"}`}>
              {winner === "B" && <Trophy className="h-4 w-4 text-emerald-400" />}
              <div>
                <p className={`text-xs font-bold ${winner === "B" ? "text-emerald-400" : "text-white"}`}>
                  {campaignBName.length > 30 ? campaignBName.slice(0, 30) + "..." : campaignBName}
                </p>
                <p className="text-[10px] text-slate-500">{bWins} metrikte önde</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric comparison rows */}
        <div className="space-y-2">
          {metrics.map((m) => {
            const diff = m.campaignA !== 0
              ? ((m.campaignB - m.campaignA) / m.campaignA) * 100
              : 0

            return (
              <div key={m.key} className="grid grid-cols-[1fr_80px_1fr] items-center gap-4 py-2.5 border-b border-[rgba(148,163,184,0.04)] last:border-0">
                {/* Campaign A value */}
                <div className="text-right">
                  <span className={`text-sm font-bold tabular-nums ${m.better === "A" ? "text-emerald-400" : "text-white"}`}>
                    {formatMetricValue(m.campaignA, m.format)}
                  </span>
                  {m.better === "A" && <TrendingUp className="inline-block ml-1.5 h-3 w-3 text-emerald-400" />}
                </div>

                {/* Label */}
                <div className="text-center">
                  <span className="text-[11px] text-slate-500 font-medium">{m.label}</span>
                </div>

                {/* Campaign B value */}
                <div>
                  <span className={`text-sm font-bold tabular-nums ${m.better === "B" ? "text-emerald-400" : "text-white"}`}>
                    {formatMetricValue(m.campaignB, m.format)}
                  </span>
                  {m.better === "B" && <TrendingUp className="inline-block ml-1.5 h-3 w-3 text-emerald-400" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trend comparison chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Günlük Harcama Karşılaştırması
        </h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#475569"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₺${(v / 1000).toFixed(1)}k`}
              width={55}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="text-[11px] text-slate-400">Kampanya A:</span>
                        <span className="text-xs font-bold text-white">{formatCurrency(payload[0]?.value as number)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                        <span className="text-[11px] text-slate-400">Kampanya B:</span>
                        <span className="text-xs font-bold text-white">{formatCurrency(payload[1]?.value as number)}</span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Line type="monotone" dataKey="campaignA" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name={campaignAName} />
            <Line type="monotone" dataKey="campaignB" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name={campaignBName} />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-6 rounded-full bg-blue-400" />
            <span className="text-[11px] text-slate-400">
              {campaignAName.length > 25 ? campaignAName.slice(0, 25) + "..." : campaignAName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-6 rounded-full bg-amber-400" />
            <span className="text-[11px] text-slate-400">
              {campaignBName.length > 25 ? campaignBName.slice(0, 25) + "..." : campaignBName}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
