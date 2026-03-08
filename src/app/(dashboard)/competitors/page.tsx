"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Image,
  Video,
  Layers,
  ExternalLink,
  Filter,
  BarChart3,
  Globe,
  Calendar,
  Sparkles,
  Activity,
  ArrowUpRight,
  Clock,
  SlidersHorizontal,
  Facebook,
  Instagram,
  Play,
  LayoutGrid,
  Package,
} from "lucide-react"
import { useCompetitors, useAdLibrary } from "@/hooks/use-advanced"
import { formatCurrency, formatNumber, formatDate } from "@/lib/formatting"

type MainTab = "competitors" | "adlibrary"
type AdTypeFilter = "all" | "image" | "video" | "carousel" | "collection"
type StatusFilter = "all" | "active" | "inactive"

const AD_TYPE_ICONS = {
  image: Image,
  video: Video,
  carousel: Layers,
  collection: Package,
}

const AD_TYPE_LABELS = {
  image: "Görsel",
  video: "Video",
  carousel: "Carousel",
  collection: "Koleksiyon",
}

const TREND_CONFIG = {
  increasing: { icon: TrendingUp, color: "text-emerald-400", label: "Artıyor", bg: "bg-emerald-500/10" },
  stable: { icon: Minus, color: "text-slate-400", label: "Sabit", bg: "bg-slate-500/10" },
  decreasing: { icon: TrendingDown, color: "text-red-400", label: "Azalıyor", bg: "bg-red-500/10" },
}

export default function CompetitorsPage() {
  const [mainTab, setMainTab] = useState<MainTab>("competitors")
  const [search, setSearch] = useState("")
  const [adTypeFilter, setAdTypeFilter] = useState<AdTypeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null)

  const { data: competitors, isLoading: competitorsLoading } = useCompetitors()
  const { data: adLibrary, isLoading: adLibraryLoading } = useAdLibrary({
    query: search || undefined,
    adType: adTypeFilter !== "all" ? adTypeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  const filteredCompetitors = useMemo(() => {
    if (!competitors) return []
    if (!search) return competitors
    return competitors.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [competitors, search])

  const competitorStats = useMemo(() => {
    if (!competitors) return null
    return {
      total: competitors.length,
      totalAds: competitors.reduce((s, c) => s + c.activeAdCount, 0),
      totalSpend: competitors.reduce((s, c) => s + c.estimatedMonthlySpend, 0),
      avgEngagement: Math.round(competitors.reduce((s, c) => s + c.engagementScore, 0) / competitors.length),
    }
  }, [competitors])

  const isLoading = mainTab === "competitors" ? competitorsLoading : adLibraryLoading

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "8%", right: "5%", width: "300px", height: "300px", opacity: 0.08 }} />
      <div className="orb orb-cyan" style={{ bottom: "15%", left: "5%", width: "220px", height: "220px", opacity: 0.06 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Search className="h-5 w-5 text-purple-400" />
            Rakip Analiz & Ad Library
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Rakip reklamlarını keşfedin, stratejileri analiz edin</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1 opacity-0 animate-slide-up" style={{ animationDelay: "40ms", animationFillMode: "forwards" }}>
        <button
          onClick={() => setMainTab("competitors")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
            mainTab === "competitors"
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
              : "text-slate-500 hover:text-white border border-transparent"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          Rakip Markalar
        </button>
        <button
          onClick={() => setMainTab("adlibrary")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
            mainTab === "adlibrary"
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
              : "text-slate-500 hover:text-white border border-transparent"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Ad Library
        </button>
      </div>

      {/* ─── Competitors Tab ─── */}
      {mainTab === "competitors" && (
        <>
          {/* Stats */}
          {competitorStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "80ms", animationFillMode: "forwards" }}>
              {[
                { label: "Takip Edilen", value: competitorStats.total, icon: Activity, color: "#a855f7" },
                { label: "Aktif Reklam", value: formatNumber(competitorStats.totalAds), icon: LayoutGrid, color: "#3b82f6" },
                { label: "Tahmini Harcama", value: formatCurrency(competitorStats.totalSpend), icon: BarChart3, color: "#10b981" },
                { label: "Ort. Engagement", value: `${competitorStats.avgEngagement}/100`, icon: Sparkles, color: "#f59e0b" },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">{s.label}</p>
                    <p className="text-lg font-bold text-white mt-0.5 tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                      {s.value}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Search */}
          <div className="opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Marka ara..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Competitor Cards */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-loader h-32 rounded-xl" />
              ))}
            </div>
          ) : filteredCompetitors.length === 0 ? (
            <div className="glass-card rounded-xl p-16 text-center">
              <Activity className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">Rakip bulunamadı</p>
              <p className="text-xs text-slate-600">Arama kriterlerinizi değiştirin.</p>
            </div>
          ) : (
            <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
              {filteredCompetitors.map((comp) => {
                const trend = TREND_CONFIG[comp.recentTrend]
                const TrendIcon = trend.icon
                const isExpanded = expandedCompetitor === comp.id

                return (
                  <div key={comp.id} className="glass-card rounded-xl overflow-hidden transition-all">
                    {/* Main Row */}
                    <button
                      onClick={() => setExpandedCompetitor(isExpanded ? null : comp.id)}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/10">
                          <span className="text-sm font-bold text-purple-300">{comp.logo}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-white truncate">{comp.name}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${trend.bg} ${trend.color}`}>
                              <TrendIcon className="h-2.5 w-2.5" />
                              {trend.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-2">{comp.industry}</p>

                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <LayoutGrid className="h-2.5 w-2.5" />
                              {comp.activeAdCount} reklam
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <BarChart3 className="h-2.5 w-2.5" />
                              {formatCurrency(comp.estimatedMonthlySpend)}/ay
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              Ort. {comp.avgAdLifespan} gün
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" />
                              {comp.engagementScore}/100
                            </span>
                          </div>
                        </div>

                        {/* Right: Platforms + Creative Mix */}
                        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            {comp.platforms.includes("facebook") && (
                              <div className="h-6 w-6 rounded bg-blue-500/10 flex items-center justify-center">
                                <Facebook className="h-3 w-3 text-blue-400" />
                              </div>
                            )}
                            {comp.platforms.includes("instagram") && (
                              <div className="h-6 w-6 rounded bg-pink-500/10 flex items-center justify-center">
                                <Instagram className="h-3 w-3 text-pink-400" />
                              </div>
                            )}
                          </div>

                          {/* Creative Mix Mini Bar */}
                          <div className="w-24">
                            <div className="flex items-center gap-0.5 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400 rounded-l" style={{ width: `${comp.creativeMix.image}%` }} />
                              <div className="h-full bg-purple-400" style={{ width: `${comp.creativeMix.video}%` }} />
                              <div className="h-full bg-amber-400 rounded-r" style={{ width: `${comp.creativeMix.carousel}%` }} />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[8px] text-blue-400">Img</span>
                              <span className="text-[8px] text-purple-400">Vid</span>
                              <span className="text-[8px] text-amber-400">Car</span>
                            </div>
                          </div>

                          <ArrowUpRight className={`h-4 w-4 text-slate-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-0 border-t border-[rgba(148,163,184,0.04)]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          {/* Categories */}
                          <div>
                            <p className="text-[9px] text-slate-600 uppercase mb-2">Top Kategoriler</p>
                            <div className="flex flex-wrap gap-1.5">
                              {comp.topCategories.map((cat) => (
                                <span key={cat} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/10">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Creative Mix Detail */}
                          <div>
                            <p className="text-[9px] text-slate-600 uppercase mb-2">Kreatif Dağılımı</p>
                            <div className="space-y-1.5">
                              {[
                                { label: "Görsel", value: comp.creativeMix.image, color: "bg-blue-400" },
                                { label: "Video", value: comp.creativeMix.video, color: "bg-purple-400" },
                                { label: "Carousel", value: comp.creativeMix.carousel, color: "bg-amber-400" },
                              ].map((mix) => (
                                <div key={mix.label} className="flex items-center gap-2">
                                  <span className="text-[9px] text-slate-500 w-14">{mix.label}</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-[rgba(12,18,32,0.5)]">
                                    <div className={`h-full rounded-full ${mix.color}`} style={{ width: `${mix.value}%` }} />
                                  </div>
                                  <span className="text-[9px] text-slate-400 tabular-nums w-8 text-right">%{mix.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Weekly Ad Count Trend */}
                          <div>
                            <p className="text-[9px] text-slate-600 uppercase mb-2">Haftalık Reklam Sayısı</p>
                            <div className="flex items-end gap-1 h-10">
                              {comp.weeklyAdCounts.map((count, i) => {
                                const maxCount = Math.max(...comp.weeklyAdCounts)
                                const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                                return (
                                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                    <div
                                      className="w-full rounded-sm bg-purple-500/30 hover:bg-purple-500/50 transition-colors"
                                      style={{ height: `${height}%`, minHeight: "2px" }}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[8px] text-slate-600">8h önce</span>
                              <span className="text-[8px] text-slate-600">Bu hafta</span>
                            </div>
                          </div>
                        </div>

                        {/* Activity Period */}
                        <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.04)] flex items-center gap-4">
                          <span className="text-[9px] text-slate-600">
                            <Calendar className="h-2.5 w-2.5 inline mr-1" />
                            İlk görülme: {formatDate(comp.firstSeen)}
                          </span>
                          <span className="text-[9px] text-slate-600">
                            <Clock className="h-2.5 w-2.5 inline mr-1" />
                            Son aktivite: {formatDate(comp.lastSeen)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ─── Ad Library Tab ─── */}
      {mainTab === "adlibrary" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "80ms", animationFillMode: "forwards" }}>
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
              {/* Ad Type Filter */}
              {(["all", "image", "video", "carousel", "collection"] as AdTypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setAdTypeFilter(t)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all ${
                    adTypeFilter === t
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                      : "text-slate-500 hover:text-white border border-transparent"
                  }`}
                >
                  {t === "all" ? "Tümü" : AD_TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-600" />
              {(["all", "active", "inactive"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-all ${
                    statusFilter === s
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                      : "text-slate-500 hover:text-white border border-transparent"
                  }`}
                >
                  {s === "all" ? "Tümü" : s === "active" ? "Aktif" : "Pasif"}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Reklam veya marka ara..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Ad Library Grid */}
          {adLibraryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-loader h-64 rounded-xl" />
              ))}
            </div>
          ) : !adLibrary || adLibrary.length === 0 ? (
            <div className="glass-card rounded-xl p-16 text-center">
              <Eye className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">Reklam bulunamadı</p>
              <p className="text-xs text-slate-600">Filtrelerinizi değiştirin veya farklı bir arama yapın.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
              {adLibrary.map((ad) => {
                const TypeIcon = AD_TYPE_ICONS[ad.adType]

                return (
                  <div key={ad.id} className="glass-card rounded-xl overflow-hidden group hover:border-[rgba(148,163,184,0.12)] transition-all">
                    {/* Creative Preview Area */}
                    <div className="relative h-36 bg-gradient-to-br from-[rgba(12,18,32,0.8)] to-[rgba(30,40,65,0.4)] flex items-center justify-center">
                      <div className="h-14 w-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        {ad.adType === "video" ? (
                          <Play className="h-6 w-6 text-purple-400" />
                        ) : (
                          <TypeIcon className="h-6 w-6 text-purple-400" />
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className={`absolute top-2.5 right-2.5 text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                        ad.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-slate-500/15 text-slate-400"
                      }`}>
                        {ad.status === "active" ? "Aktif" : "Pasif"}
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-2.5 left-2.5 text-[8px] px-1.5 py-0.5 rounded-full font-medium bg-[rgba(12,18,32,0.7)] text-slate-300 flex items-center gap-1">
                        <TypeIcon className="h-2.5 w-2.5" />
                        {AD_TYPE_LABELS[ad.adType]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Advertiser */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/10">
                          <span className="text-[8px] font-bold text-purple-300">{ad.advertiserLogo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-white truncate">{ad.advertiserName}</p>
                          <p className="text-[9px] text-slate-600">{ad.category}</p>
                        </div>
                      </div>

                      {/* Headline & Body */}
                      <p className="text-xs font-medium text-white mb-1 line-clamp-1">{ad.creative.headline}</p>
                      <p className="text-[10px] text-slate-500 mb-3 line-clamp-2">{ad.creative.body}</p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <span className="text-[9px] text-slate-500 flex items-center gap-1">
                          <Globe className="h-2.5 w-2.5" />
                          {ad.platform.map((p) => p === "facebook" ? "FB" : p === "instagram" ? "IG" : p === "messenger" ? "MSG" : "AN").join(", ")}
                        </span>
                        <span className="text-[9px] text-slate-500 flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          {formatDate(ad.startDate)}
                        </span>
                        <span className="text-[9px] text-slate-500 flex items-center gap-1">
                          <Eye className="h-2.5 w-2.5" />
                          {ad.impressionRange}
                        </span>
                      </div>

                      {/* Spend Range + CTA */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(148,163,184,0.04)]">
                        <span className="text-[9px] text-purple-400 font-medium">{ad.spendRange}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium flex items-center gap-1">
                          <ExternalLink className="h-2.5 w-2.5" />
                          {ad.creative.cta}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
