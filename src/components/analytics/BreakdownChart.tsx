"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import type { BreakdownRow } from "@/lib/mock-analytics"

interface BreakdownChartProps {
  data: BreakdownRow[]
  metric: "spend" | "clicks" | "conversions" | "ctr" | "roas"
  chartType: "bar" | "pie"
  loading?: boolean
}

const CHART_COLORS = [
  "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#f97316",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
]

function formatMetricValue(value: number, metric: string): string {
  switch (metric) {
    case "spend": return formatCurrency(value)
    case "ctr": return formatPercent(value)
    case "roas": return `${value.toFixed(2)}x`
    default: return formatNumber(value)
  }
}

function BarTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  metric: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148, 163, 184, 0.12)" }}>
      <p className="text-xs font-medium text-white mb-1">{label}</p>
      <p className="text-sm font-bold text-blue-400">{formatMetricValue(payload[0].value, metric)}</p>
    </div>
  )
}

export function BreakdownChart({ data, metric, chartType, loading }: BreakdownChartProps) {
  if (loading) {
    return <div className="skeleton-loader h-72 rounded-xl" />
  }

  const chartData = data.map((row, i) => ({
    name: row.label,
    value: row[metric] as number,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))

  if (chartType === "pie") {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Dağılım
        </h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                strokeWidth={0}
                paddingAngle={2}
              >
                {chartData.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]
                  return (
                    <div className="glass-card rounded-lg px-3 py-2 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                      <p className="text-[11px] text-slate-400">{d.name}</p>
                      <p className="text-xs font-bold text-white">{formatMetricValue(d.value as number, metric)}</p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-[11px] text-slate-400 flex-1">{item.name}</span>
                <span className="text-[11px] text-white font-semibold tabular-nums">
                  {formatMetricValue(item.value, metric)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Karşılaştırma
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#475569"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#475569"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatMetricValue(v, metric)}
            width={65}
          />
          <Tooltip content={<BarTooltip metric={metric} />} cursor={{ fill: "rgba(148, 163, 184, 0.04)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={42}>
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={entry.fill} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
