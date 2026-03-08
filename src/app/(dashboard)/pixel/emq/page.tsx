"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
} from "lucide-react"
import { useEMQBreakdown, usePixelOverview } from "@/hooks/use-pixel"
import { formatNumber, formatPercent } from "@/lib/formatting"

const QUALITY_COLORS = {
  excellent: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Mükemmel" },
  good: { bg: "bg-blue-500/10", text: "text-blue-400", label: "İyi" },
  fair: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Orta" },
  poor: { bg: "bg-red-500/10", text: "text-red-400", label: "Düşük" },
}

export default function EmqDashboardPage() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const { data: overview } = usePixelOverview()
  const { data: emqData, isLoading } = useEMQBreakdown()

  const overallScore = overview?.emqScore || 0
  const scoreColor = overallScore >= 8 ? "text-emerald-400" : overallScore >= 6 ? "text-blue-400" : overallScore >= 4 ? "text-amber-400" : "text-red-400"
  const scoreBg = overallScore >= 8 ? "from-emerald-500/20" : overallScore >= 6 ? "from-blue-500/20" : overallScore >= 4 ? "from-amber-500/20" : "from-red-500/20"

  const allRecommendations = emqData?.flatMap(e =>
    e.parameters.filter(p => p.recommendation).map(p => ({
      event: e.eventName,
      param: p.label,
      recommendation: p.recommendation!,
      quality: p.quality,
    }))
  ) || []

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-green" style={{ top: "5%", right: "15%", width: "250px", height: "250px", opacity: 0.1 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/pixel" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Pixel & CAPI
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Event Match Quality (EMQ)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Event bazında veri kalitesi ve parametre kapsama analizi</p>
        </div>
      </div>

      {/* Overall EMQ Score */}
      <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className={`h-1 bg-gradient-to-r ${scoreBg} to-transparent`} />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Score gauge */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${overallScore * 26.4} 264`}
                    className={scoreColor}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${scoreColor}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {overallScore}
                  </span>
                  <span className="text-[9px] text-slate-600">/10</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Genel EMQ Skoru</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {overallScore >= 8 ? "Mükemmel veri kalitesi" :
                   overallScore >= 6 ? "İyi veri kalitesi, iyileştirme fırsatları var" :
                   overallScore >= 4 ? "Orta kalite — parametre eklenmeli" :
                   "Düşük kalite — acil iyileştirme gerekli"}
                </p>
              </div>
            </div>

            {/* Score breakdown hints */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              {[
                { label: "E-posta Coverage", value: "85%", quality: "good" as const },
                { label: "Telefon Coverage", value: "62%", quality: "fair" as const },
                { label: "FB Click ID", value: "95%", quality: "excellent" as const },
                { label: "External ID", value: "73%", quality: "good" as const },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-[rgba(12,18,32,0.5)] p-3 border border-[rgba(148,163,184,0.04)]">
                  <p className="text-[9px] text-slate-600 uppercase tracking-wider">{item.label}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-bold text-white">{item.value}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${QUALITY_COLORS[item.quality].bg} ${QUALITY_COLORS[item.quality].text}`}>
                      {QUALITY_COLORS[item.quality].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event-by-event breakdown */}
      <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Event Bazlı EMQ Analizi
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          emqData?.map((evt) => {
            const isExpanded = expandedEvent === evt.eventName
            const evtScoreColor = evt.emqScore >= 8 ? "text-emerald-400" : evt.emqScore >= 6 ? "text-blue-400" : evt.emqScore >= 4 ? "text-amber-400" : "text-red-400"
            const evtScoreBg = evt.emqScore >= 8 ? "bg-emerald-500/10" : evt.emqScore >= 6 ? "bg-blue-500/10" : evt.emqScore >= 4 ? "bg-amber-500/10" : "bg-red-500/10"

            return (
              <div key={evt.eventName} className="glass-card rounded-xl overflow-hidden">
                {/* Event header */}
                <button
                  onClick={() => setExpandedEvent(isExpanded ? null : evt.eventName)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[rgba(148,163,184,0.02)] transition-colors"
                >
                  <div className={`h-10 w-10 rounded-lg ${evtScoreBg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-bold ${evtScoreColor}`}>{evt.emqScore}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold text-white">{evt.eventName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-500">{formatNumber(evt.totalEvents)} events</span>
                      <span className={`text-[10px] font-semibold ${evt.matchRate >= 80 ? "text-emerald-400" : evt.matchRate >= 60 ? "text-amber-400" : "text-red-400"}`}>
                        {formatPercent(evt.matchRate)} match
                      </span>
                    </div>
                  </div>

                  {/* Mini parameter bars */}
                  <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                    {evt.parameters.slice(0, 6).map((p) => (
                      <div key={p.name} className="relative group">
                        <div className="h-6 w-2 rounded-full bg-slate-800/50 overflow-hidden">
                          <div
                            className="w-full rounded-full transition-all"
                            style={{
                              height: `${p.coverage}%`,
                              position: "absolute",
                              bottom: 0,
                              backgroundColor: p.quality === "excellent" ? "#10b981" : p.quality === "good" ? "#3b82f6" : p.quality === "fair" ? "#f59e0b" : "#ef4444",
                              opacity: 0.6,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </button>

                {/* Expanded parameters */}
                {isExpanded && (
                  <div className="border-t border-[rgba(148,163,184,0.06)] px-5 py-4 bg-[rgba(6,9,15,0.3)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evt.parameters.map((p) => {
                        const qc = QUALITY_COLORS[p.quality]
                        return (
                          <div key={p.name} className="rounded-lg bg-[rgba(12,18,32,0.5)] p-3 border border-[rgba(148,163,184,0.04)]">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-white">{p.label}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${qc.bg} ${qc.text}`}>{qc.label}</span>
                              </div>
                              <span className="text-xs font-bold text-white tabular-nums">{p.coverage}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-800/60 overflow-hidden mb-2">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${p.coverage}%`,
                                  backgroundColor: p.quality === "excellent" ? "#10b981" : p.quality === "good" ? "#3b82f6" : p.quality === "fair" ? "#f59e0b" : "#ef4444",
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-600">{p.description}</p>
                            {p.recommendation && (
                              <div className="mt-2 flex items-start gap-1.5 text-[10px] text-amber-400/80">
                                <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {p.recommendation}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Global recommendations */}
      {allRecommendations.length > 0 && (
        <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Lightbulb className="h-4 w-4 text-amber-400" />
            İyileştirme Önerileri
          </h3>
          <div className="space-y-2.5">
            {allRecommendations.slice(0, 8).map((rec, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[rgba(148,163,184,0.04)] last:border-0">
                <div className={`h-5 w-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${QUALITY_COLORS[rec.quality].bg}`}>
                  {rec.quality === "poor" ? (
                    <AlertTriangle className={`h-2.5 w-2.5 ${QUALITY_COLORS[rec.quality].text}`} />
                  ) : rec.quality === "fair" ? (
                    <Info className={`h-2.5 w-2.5 ${QUALITY_COLORS[rec.quality].text}`} />
                  ) : (
                    <CheckCircle2 className={`h-2.5 w-2.5 ${QUALITY_COLORS[rec.quality].text}`} />
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-white">
                    <span className="text-slate-500">{rec.event} → {rec.param}:</span>{" "}
                    {rec.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
