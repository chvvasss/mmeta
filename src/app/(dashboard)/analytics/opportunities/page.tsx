"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  Target,
  DollarSign,
  Palette,
  Crosshair,
  Layers,
  Activity,
  ArrowLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Shield,
} from "lucide-react"
import { useOpportunityScore, useOpportunityItems } from "@/hooks/use-advanced"
import { formatCurrency } from "@/lib/formatting"

type CategoryFilter = "all" | "budget" | "targeting" | "creative" | "bidding" | "structure" | "tracking"
type ImpactFilter = "all" | "high" | "medium" | "low"

const CATEGORY_CONFIG = {
  budget: { label: "Bütçe", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  targeting: { label: "Hedefleme", icon: Crosshair, color: "text-blue-400", bg: "bg-blue-500/10" },
  creative: { label: "Kreatif", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  bidding: { label: "Teklif", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
  structure: { label: "Yapı", icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10" },
  tracking: { label: "Takip", icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/10" },
}

const IMPACT_CONFIG = {
  high: { label: "Yüksek", color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-400" },
  medium: { label: "Orta", color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  low: { label: "Düşük", color: "text-slate-400", bg: "bg-slate-500/10", dot: "bg-slate-400" },
}

const EFFORT_CONFIG = {
  easy: { label: "Kolay", color: "text-emerald-400" },
  moderate: { label: "Orta", color: "text-amber-400" },
  complex: { label: "Karmaşık", color: "text-red-400" },
}

const STATUS_CONFIG = {
  new: { label: "Yeni", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10" },
  in_progress: { label: "Devam Ediyor", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  dismissed: { label: "Reddedildi", icon: XCircle, color: "text-slate-500", bg: "bg-slate-500/10" },
  completed: { label: "Tamamlandı", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
}

export default function OpportunitiesPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>("all")
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const { data: score, isLoading: scoreLoading } = useOpportunityScore()
  const { data: items, isLoading: itemsLoading } = useOpportunityItems(
    categoryFilter !== "all" ? categoryFilter : undefined,
    impactFilter !== "all" ? impactFilter : undefined
  )

  const activeItems = useMemo(() => {
    if (!items) return []
    return items.filter((i) => i.status !== "dismissed" && i.status !== "completed")
  }, [items])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-cyan" style={{ top: "5%", right: "8%", width: "260px", height: "260px", opacity: 0.08 }} />

      {/* Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/analytics" className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3 w-3" />
          Analitik
        </Link>
        <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <Sparkles className="h-5 w-5 text-cyan-400" />
          Opportunity Score
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Hesap optimizasyon fırsatlarını keşfedin</p>
      </div>

      {/* Score Overview */}
      {scoreLoading ? (
        <div className="skeleton-loader h-48 rounded-xl" />
      ) : score && (
        <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Main Score */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={score.overall >= 80 ? "#10b981" : score.overall >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score.overall / 100) * 264} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                    {score.overall}
                  </span>
                  <span className="text-[9px] text-slate-500">/100</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Genel Skor</p>
                <p className="text-[11px] text-slate-500 max-w-48">
                  {score.overall >= 80 ? "Hesabınız iyi durumda" : score.overall >= 60 ? "İyileştirme fırsatları mevcut" : "Acil optimizasyon gerekli"}
                </p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
              {score.categories.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat.category as keyof typeof CATEGORY_CONFIG]
                if (!cfg) return null
                const Icon = cfg.icon
                const pct = Math.round((cat.score / cat.maxScore) * 100)

                return (
                  <div key={cat.category} className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-400">{cat.label}</span>
                        <span className="text-[10px] text-white font-medium tabular-nums">{cat.score}</span>
                      </div>
                      <div className="h-1 rounded-full bg-[rgba(12,18,32,0.5)]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="flex md:flex-col gap-4 flex-shrink-0">
              <div className="text-center">
                <p className="text-lg font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>{score.highImpact}</p>
                <p className="text-[9px] text-red-400 uppercase">Yüksek Etki</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400 tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>{formatCurrency(score.estimatedSavings)}</p>
                <p className="text-[9px] text-slate-500 uppercase">Tahmini Tasarruf</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "budget", "targeting", "creative", "bidding", "structure", "tracking"] as CategoryFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all ${
                categoryFilter === f
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              {f === "all" ? "Tümü" : CATEGORY_CONFIG[f].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Target className="h-3 w-3 text-slate-600 mr-1" />
          {(["all", "high", "medium", "low"] as ImpactFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setImpactFilter(f)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all ${
                impactFilter === f
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              {f === "all" ? "Tümü" : IMPACT_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      {itemsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-28 rounded-xl" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <Sparkles className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Fırsat bulunamadı</p>
          <p className="text-xs text-slate-600">Filtrelerinizi değiştirin.</p>
        </div>
      ) : (
        <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
          {/* Active count */}
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400">{activeItems.length} aktif fırsat</span>
          </div>

          {items.map((item) => {
            const catCfg = CATEGORY_CONFIG[item.category]
            const impactCfg = IMPACT_CONFIG[item.impact]
            const effortCfg = EFFORT_CONFIG[item.effort]
            const statusCfg = STATUS_CONFIG[item.status]
            const CatIcon = catCfg.icon
            const StatusIcon = statusCfg.icon
            const isExpanded = expandedItem === item.id
            const isDismissed = item.status === "dismissed"

            return (
              <div
                key={item.id}
                className={`glass-card rounded-xl overflow-hidden transition-all ${isDismissed ? "opacity-50" : ""}`}
              >
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div className={`h-11 w-11 rounded-xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <CatIcon className={`h-5 w-5 ${catCfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                        {/* Impact */}
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${impactCfg.bg} ${impactCfg.color}`}>
                          <span className={`h-1 w-1 rounded-full ${impactCfg.dot}`} />
                          {impactCfg.label} Etki
                        </span>
                        {/* Status */}
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">{item.description}</p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <ArrowUpRight className="h-2.5 w-2.5" />
                          {item.estimatedGain}
                        </span>
                        <span className={`text-[10px] ${effortCfg.color} flex items-center gap-1`}>
                          <Activity className="h-2.5 w-2.5" />
                          Efor: {effortCfg.label}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {item.affectedCampaigns.length} kampanya
                        </span>
                      </div>
                    </div>

                    {/* Metric Preview */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">{item.metric}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 tabular-nums">{item.currentValue}</span>
                          <ChevronRight className="h-3 w-3 text-slate-600" />
                          <span className="text-xs text-emerald-400 font-medium tabular-nums">{item.potentialValue}</span>
                        </div>
                      </div>
                      <ArrowUpRight className={`h-4 w-4 text-slate-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-[rgba(148,163,184,0.04)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Steps */}
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase mb-2">Uygulama Adımları</p>
                        <div className="space-y-2">
                          {item.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="h-4 w-4 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[8px] text-cyan-400 font-bold">{i + 1}</span>
                              </div>
                              <p className="text-[10px] text-slate-400">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Affected Campaigns */}
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase mb-2">Etkilenen Kampanyalar</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.affectedCampaigns.map((camp) => (
                            <span key={camp} className="text-[9px] px-2 py-0.5 rounded bg-[rgba(12,18,32,0.5)] text-slate-400 border border-[rgba(148,163,184,0.04)]">
                              {camp}
                            </span>
                          ))}
                        </div>

                        {/* Metric Comparison */}
                        <div className="mt-4 p-3 rounded-lg bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.04)]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] text-slate-600 uppercase">{item.metric} Karşılaştırma</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-[9px] text-slate-600 mb-0.5">Mevcut</p>
                              <div className="h-2 rounded-full bg-[rgba(148,163,184,0.08)]">
                                <div
                                  className="h-full rounded-full bg-slate-500"
                                  style={{ width: `${Math.min((item.currentValue / item.potentialValue) * 100, 100)}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 tabular-nums">{item.currentValue}</p>
                            </div>
                            <div className="flex-1">
                              <p className="text-[9px] text-slate-600 mb-0.5">Potansiyel</p>
                              <div className="h-2 rounded-full bg-[rgba(148,163,184,0.08)]">
                                <div className="h-full rounded-full bg-emerald-400" style={{ width: "100%" }} />
                              </div>
                              <p className="text-[10px] text-emerald-400 mt-0.5 tabular-nums">{item.potentialValue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
