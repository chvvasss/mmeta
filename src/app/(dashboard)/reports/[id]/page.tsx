"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import {
  FileText,
  ChevronLeft,
  Download,
  Send,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Lightbulb,
  Printer,
  Share2,
  Image as ImageIcon,
  Video,
} from "lucide-react"
import { useReportDetail } from "@/hooks/use-reports"
import { formatCurrency, formatNumber, formatPercent, formatDate } from "@/lib/formatting"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts"

const CAMPAIGN_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"]

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: report, isLoading } = useReportDetail(id)

  const maxSpend = useMemo(() => {
    if (!report) return 0
    return Math.max(...report.campaignBreakdown.map(c => c.spend))
  }, [report])

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="skeleton-loader h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-24 rounded-xl" />
          ))}
        </div>
        <div className="skeleton-loader h-72 rounded-xl" />
        <div className="skeleton-loader h-64 rounded-xl" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="p-6">
        <div className="glass-card rounded-xl p-16 text-center">
          <FileText className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Rapor bulunamadı</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-blue" style={{ top: "5%", right: "10%", width: "260px", height: "260px", opacity: 0.1 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/reports" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Raporlar
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              <FileText className="h-5 w-5 text-blue-400" />
              {report.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(report.dateRange.from)} — {formatDate(report.dateRange.to)}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                Tamamlandı
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white border border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)] transition-all">
              <Share2 className="h-3 w-3" />
              Paylaş
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white border border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)] transition-all">
              <Printer className="h-3 w-3" />
              Yazdır
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
              <Download className="h-3 w-3" />
              PDF İndir
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {report.summary.map((metric) => {
          const isUp = metric.change > 0
          const isFlat = metric.change === 0
          return (
            <div key={metric.label} className="glass-card rounded-xl p-4">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">{metric.label}</p>
              <p className="text-base font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {metric.format === "currency"
                  ? formatCurrency(metric.value)
                  : metric.format === "percent"
                    ? formatPercent(metric.value)
                    : formatNumber(metric.value)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isFlat ? (
                  <Minus className="h-2.5 w-2.5 text-slate-500" />
                ) : isUp ? (
                  <TrendingUp className="h-2.5 w-2.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5 text-red-400" />
                )}
                <span className={`text-[10px] font-medium tabular-nums ${isFlat ? "text-slate-500" : isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isUp ? "+" : ""}{metric.change.toFixed(1)}%
                </span>
                <span className="text-[9px] text-slate-700">vs önceki dönem</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Daily Trend Chart */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Günlük Performans Trendi
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Harcama ve gelir karşılaştırması</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={report.dailyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`} width={55} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    {payload.map((p, i) => (
                      <div key={String(p.dataKey ?? i)} className="flex items-center gap-2 py-0.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[11px] text-slate-400">{p.dataKey === "spend" ? "Harcama" : "Gelir"}:</span>
                        <span className="text-xs font-bold text-white">{formatCurrency(p.value as number)}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
              cursor={{ stroke: "rgba(148, 163, 184, 0.1)" }}
            />
            <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} fill="url(#spendGrad)" />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-4 mt-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: "#3b82f6" }} />
            <span className="text-slate-400">Harcama</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: "#10b981" }} />
            <span className="text-slate-400">Gelir</span>
          </div>
        </div>
      </div>

      {/* Campaign Breakdown Table */}
      <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
        <div className="p-5 pb-0">
          <h3 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Kampanya Bazlı Performans
          </h3>
          <p className="text-[11px] text-slate-500">Raporlama dönemindeki kampanya karşılaştırması</p>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(148,163,184,0.06)]">
                <th className="px-5 py-3 text-left text-[10px] text-slate-600 uppercase tracking-wider font-medium">Kampanya</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">Harcama</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">Gösterim</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">Tıklama</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">CTR</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">CPC</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">Dönüşüm</th>
                <th className="px-3 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">ROAS</th>
                <th className="px-5 py-3 text-right text-[10px] text-slate-600 uppercase tracking-wider font-medium">Pay</th>
              </tr>
            </thead>
            <tbody>
              {report.campaignBreakdown.map((camp, i) => {
                const spendPercent = maxSpend > 0 ? (camp.spend / maxSpend) * 100 : 0
                return (
                  <tr key={i} className="table-row-hover border-b border-[rgba(148,163,184,0.04)]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length] }} />
                        <span className="text-xs text-white font-medium truncate max-w-[200px]">{camp.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-white font-medium tabular-nums">{formatCurrency(camp.spend)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-400 tabular-nums">{formatNumber(camp.impressions)}</td>
                    <td className="px-3 py-3 text-right text-xs text-slate-400 tabular-nums">{formatNumber(camp.clicks)}</td>
                    <td className="px-3 py-3 text-right text-xs tabular-nums">
                      <span className={camp.ctr >= 3 ? "text-emerald-400" : camp.ctr >= 2 ? "text-white" : "text-amber-400"}>
                        %{camp.ctr.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-slate-400 tabular-nums">{formatCurrency(camp.cpc)}</td>
                    <td className="px-3 py-3 text-right text-xs text-white font-medium tabular-nums">{formatNumber(camp.conversions)}</td>
                    <td className="px-3 py-3 text-right text-xs font-bold tabular-nums">
                      <span className={camp.roas >= 3 ? "text-emerald-400" : camp.roas >= 2 ? "text-blue-400" : "text-amber-400"}>
                        {camp.roas.toFixed(1)}x
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="h-1.5 w-16 rounded-full bg-slate-800/60 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${spendPercent}%`,
                              backgroundColor: CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length],
                              opacity: 0.6,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Creatives + Insights side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
        {/* Top Creatives */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <BarChart3 className="h-4 w-4 text-purple-400" />
            En İyi Kreatifler
          </h3>
          <div className="space-y-3">
            {report.topCreatives.map((creative, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(148,163,184,0.04)] last:border-0">
                <div className="h-9 w-9 rounded-lg bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.06)] flex items-center justify-center flex-shrink-0">
                  {creative.format === "Video" ? (
                    <Video className="h-3.5 w-3.5 text-purple-400" />
                  ) : creative.format === "Story" ? (
                    <ImageIcon className="h-3.5 w-3.5 text-pink-400" />
                  ) : (
                    <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white font-medium truncate">{creative.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-slate-500">{creative.format}</span>
                    <span className="text-[9px] text-slate-600">•</span>
                    <span className="text-[9px] text-slate-500">{formatCurrency(creative.spend)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600">CTR</p>
                    <p className="text-[11px] font-bold text-white tabular-nums">%{creative.ctr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600">ROAS</p>
                    <p className={`text-[11px] font-bold tabular-nums ${creative.roas >= 4 ? "text-emerald-400" : creative.roas >= 2.5 ? "text-blue-400" : "text-amber-400"}`}>
                      {creative.roas}x
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Lightbulb className="h-4 w-4 text-amber-400" />
            Rapor İçgörüleri
          </h3>
          <div className="space-y-3">
            {report.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(148,163,184,0.04)] last:border-0">
                <div className={`h-5 w-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  i === 0 ? "bg-emerald-500/10" : i === report.insights.length - 1 ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}>
                  <span className={`text-[9px] font-bold ${
                    i === 0 ? "text-emerald-400" : i === report.insights.length - 1 ? "text-amber-400" : "text-blue-400"
                  }`}>
                    {i + 1}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export options */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Dışa Aktar
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { format: "PDF", icon: FileText, color: "#ef4444", desc: "Görsel rapor formatı" },
            { format: "XLSX", icon: BarChart3, color: "#10b981", desc: "Excel tablosu" },
            { format: "CSV", icon: FileText, color: "#f59e0b", desc: "Ham veri formatı" },
          ].map((exp) => {
            const Icon = exp.icon
            return (
              <button
                key={exp.format}
                className="flex items-center gap-3 rounded-xl bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.06)] px-4 py-3 hover:border-[rgba(148,163,184,0.15)] transition-all group"
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${exp.color}15` }}>
                  <Icon className="h-4 w-4" style={{ color: exp.color }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">{exp.format}</p>
                  <p className="text-[10px] text-slate-500">{exp.desc}</p>
                </div>
                <Download className="h-3.5 w-3.5 text-slate-600 ml-2" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
