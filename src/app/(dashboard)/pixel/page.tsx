"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  Zap,
  Globe,
  Server,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Radio,
  ArrowUpDown,
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
import { usePixelOverview, usePixelEvents, useEventTrend } from "@/hooks/use-pixel"
import { formatNumber, formatPercent, formatRelativeTime } from "@/lib/formatting"

type SortKey = "eventName" | "totalEvents" | "matchRate" | "trendPercent"

export default function PixelPage() {
  const [sortKey, setSortKey] = useState<SortKey>("totalEvents")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const { data: overview, isLoading: overviewLoading } = usePixelOverview()
  const { data: events, isLoading: eventsLoading } = usePixelEvents()
  const { data: trendData, isLoading: trendLoading } = useEventTrend(7)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const sortedEvents = events ? [...events].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === "string") return sortDir === "asc" ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string)
    return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
  }) : []

  const todayChange = overview
    ? ((overview.totalEventsToday - overview.totalEventsYesterday) / overview.totalEventsYesterday * 100)
    : 0

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-green" style={{ top: "3%", right: "12%", width: "280px", height: "280px", opacity: 0.12 }} />
      <div className="orb orb-blue" style={{ bottom: "15%", left: "5%", width: "200px", height: "200px", opacity: 0.08 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Activity className="h-5 w-5 text-emerald-400" />
            Pixel & Conversions API
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Pixel eventlarını ve veri kalitesini izleyin</p>
        </div>
        <Link
          href="/pixel/emq"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          EMQ Dashboard
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Pixel status card */}
      {overviewLoading ? (
        <div className="skeleton-loader h-28 rounded-xl" />
      ) : overview && (
        <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Pixel status indicator */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Radio className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{overview.pixelName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Aktif
                  </span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] text-slate-500">ID: {overview.pixelId}</span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                    {overview.domainVerified && <ShieldCheck className="h-2.5 w-2.5 text-blue-400" />}
                    {overview.domain}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 md:ml-8">
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Bugün Events</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-lg font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                    {formatNumber(overview.totalEventsToday)}
                  </p>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${todayChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {todayChange >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {Math.abs(todayChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">EMQ Skoru</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-lg font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                    {overview.emqScore}/10
                  </p>
                  <span className={`text-[10px] font-semibold ${overview.emqScore >= 7 ? "text-emerald-400" : overview.emqScore >= 5 ? "text-amber-400" : "text-red-400"}`}>
                    {overview.emqScore >= 7 ? "İyi" : overview.emqScore >= 5 ? "Orta" : "Düşük"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Match Rate</p>
                <p className="text-lg font-bold text-white tabular-nums mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatPercent(overview.matchRate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider">Dedup Oranı</p>
                <p className="text-lg font-bold text-white tabular-nums mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatPercent(overview.deduplicationRate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data source split + Event trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browser vs Server split */}
        <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white mb-5" style={{ fontFamily: "var(--font-heading)" }}>
            Veri Kaynakları
          </h3>
          {overview && (
            <div className="space-y-5">
              {/* Browser events */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[11px] text-slate-300 font-medium">Browser Pixel</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">{formatNumber(overview.browserEvents)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                    style={{ width: `${(overview.browserEvents / (overview.browserEvents + overview.serverEvents)) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">{((overview.browserEvents / (overview.browserEvents + overview.serverEvents)) * 100).toFixed(1)}% toplam</p>
              </div>
              {/* Server events */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] text-slate-300 font-medium">Conversions API</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">{formatNumber(overview.serverEvents)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${(overview.serverEvents / (overview.browserEvents + overview.serverEvents)) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">{((overview.serverEvents / (overview.browserEvents + overview.serverEvents)) * 100).toFixed(1)}% toplam</p>
              </div>

              {/* Recommendation */}
              <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex items-start gap-2">
                  <Zap className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-amber-400/80 leading-relaxed">
                    Server event oranını artırmak EMQ skorunuzu yükseltir. Hedef: %60+ CAPI coverage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event trend chart */}
        <div className="lg:col-span-2 glass-card chart-glow rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Event Trendi (7 Gün)
              </h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Browser vs Server event dağılımı</p>
            </div>
          </div>

          {trendLoading ? (
            <div className="skeleton-loader h-56 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="browserGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="serverGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={45} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="glass-card rounded-lg px-4 py-3 shadow-xl" style={{ border: "1px solid rgba(148,163,184,0.12)" }}>
                        <p className="text-xs text-slate-400 mb-2">{label}</p>
                        {payload.map((p, i) => (
                          <div key={String(p.dataKey ?? i)} className="flex items-center gap-2 py-0.5">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-[11px] text-slate-400">{p.dataKey === "browserEvents" ? "Browser" : p.dataKey === "serverEvents" ? "Server" : "Matched"}:</span>
                            <span className="text-xs font-bold text-white">{formatNumber(p.value as number)}</span>
                          </div>
                        ))}
                      </div>
                    )
                  }}
                />
                <Area type="monotone" dataKey="browserEvents" stroke="#3b82f6" strokeWidth={2} fill="url(#browserGrad)" dot={false} activeDot={{ r: 3 }} />
                <Area type="monotone" dataKey="serverEvents" stroke="#10b981" strokeWidth={2} fill="url(#serverGrad)" dot={false} activeDot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-5 rounded-full bg-blue-400" />
              <span className="text-[10px] text-slate-500">Browser Pixel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-500">Conversions API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events table */}
      <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
        <div className="p-5 border-b border-[rgba(148,163,184,0.06)]">
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Event Takibi
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">Tüm pixel eventlarının durumu ve performansı</p>
        </div>

        {eventsLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-12 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[1fr_80px_90px_90px_80px_80px_70px_90px] gap-2 px-5 py-2.5 border-b border-[rgba(148,163,184,0.06)] text-[10px] font-medium text-slate-600 uppercase tracking-wider">
              <SortCol label="Event" sortKey="eventName" currentKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <span>Kaynak</span>
              <SortCol label="Toplam" sortKey="totalEvents" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
              <span className="text-right">Eşleşen</span>
              <SortCol label="Match %" sortKey="matchRate" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
              <span className="text-right">Dedup</span>
              <SortCol label="Trend" sortKey="trendPercent" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
              <span className="text-right">Son Alım</span>
            </div>

            {sortedEvents.map((evt) => (
              <div
                key={evt.id}
                className="table-row-hover grid grid-cols-1 lg:grid-cols-[1fr_80px_90px_90px_80px_80px_70px_90px] gap-2 px-5 py-3 border-b border-[rgba(148,163,184,0.06)] items-center"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${evt.isActive ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <div>
                    <span className="text-xs font-medium text-white">{evt.eventName}</span>
                    <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded font-medium ${
                      evt.eventCategory === "standard" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                    }`}>
                      {evt.eventCategory === "standard" ? "Standart" : "Özel"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    evt.source === "both" ? "bg-emerald-500/10 text-emerald-400" :
                    evt.source === "capi" ? "bg-cyan-500/10 text-cyan-400" :
                    "bg-amber-500/10 text-amber-400"
                  }`}>
                    {evt.source === "both" ? "Pixel+CAPI" : evt.source === "capi" ? "CAPI" : "Pixel"}
                  </span>
                </div>

                <div className="text-right text-xs font-semibold text-white tabular-nums">{formatNumber(evt.totalEvents)}</div>
                <div className="text-right text-xs text-slate-300 tabular-nums">{formatNumber(evt.matchedEvents)}</div>
                <div className="text-right">
                  <span className={`text-xs font-semibold tabular-nums ${
                    evt.matchRate >= 80 ? "text-emerald-400" : evt.matchRate >= 60 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {formatPercent(evt.matchRate)}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-400 tabular-nums">{formatNumber(evt.deduplicatedEvents)}</div>
                <div className="text-right">
                  <span className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-0.5 ${
                    evt.trendPercent > 0 ? "text-emerald-400" : evt.trendPercent < 0 ? "text-red-400" : "text-slate-500"
                  }`}>
                    {evt.trendPercent > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : evt.trendPercent < 0 ? <TrendingDown className="h-2.5 w-2.5" /> : null}
                    {evt.trendPercent > 0 ? "+" : ""}{evt.trendPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right text-[10px] text-slate-500">{formatRelativeTime(evt.lastReceived)}</div>
              </div>
            ))}
          </>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-[rgba(12,18,32,0.3)] flex items-center justify-between">
          <span className="text-[11px] text-slate-600">{events?.length || 0} event takip ediliyor</span>
          <Link href="/pixel/emq" className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
            EMQ detaylarını gör <ChevronRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        {[
          { icon: Server, color: "#10b981", title: "CAPI Entegrasyonu", desc: "Server-side event gönderimi ile iOS 14+ kısıtlamalarını aşın." },
          { icon: ShieldCheck, color: "#3b82f6", title: "EMQ Optimizasyonu", desc: "E-posta, telefon ve fbp/fbc parametrelerini göndererek eşleşme oranını artırın." },
          { icon: Zap, color: "#f59e0b", title: "Deduplikasyon", desc: "Browser ve Server eventlarını event_id ile eşleştirerek duplikasyonu önleyin." },
        ].map((tip) => (
          <div key={tip.title} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <tip.icon className="h-3.5 w-3.5" style={{ color: tip.color }} />
              <span className="text-[11px] font-semibold text-white">{tip.title}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SortCol({ label, sortKey, currentKey, dir, onSort, className = "" }: {
  label: string; sortKey: SortKey; currentKey: SortKey; dir: "asc" | "desc"; onSort: (k: SortKey) => void; className?: string
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 hover:text-slate-300 transition-colors ${className} ${currentKey === sortKey ? "text-blue-400" : ""}`}
    >
      {label}
      <ArrowUpDown className="h-2.5 w-2.5" />
    </button>
  )
}
