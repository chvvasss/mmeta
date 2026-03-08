"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Users,
  Plus,
  Search,
  Copy,
  UserPlus,
  Globe,
  Heart,
  Video,
  Mail,
  FileText,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Megaphone,
} from "lucide-react"
import { useAudiences } from "@/hooks/use-audiences"
import { formatNumber, formatDate, formatRelativeTime } from "@/lib/formatting"

type AudienceFilter = "all" | "custom" | "lookalike" | "saved"

const FILTERS: Array<{ key: AudienceFilter; label: string }> = [
  { key: "all", label: "Tümü" },
  { key: "custom", label: "Custom" },
  { key: "lookalike", label: "Lookalike" },
]

const STATUS_CONFIG = {
  ready: { label: "Hazır", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  updating: { label: "Güncelleniyor", icon: RefreshCcw, color: "text-blue-400", bg: "bg-blue-500/10" },
  too_small: { label: "Çok Küçük", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
  expired: { label: "Süresi Dolmuş", icon: Clock, color: "text-red-400", bg: "bg-red-500/10" },
}

const SUBTYPE_ICONS: Record<string, typeof Users> = {
  "Website Visitors": Globe,
  "Purchase Events": Heart,
  "AddToCart without Purchase": Heart,
  "Customer List": FileText,
  "Value-Based": Copy,
  "Engagement-Based": UserPlus,
  "Video Engagement": Video,
  "Instagram Engagement": Heart,
  "Lead Form": Mail,
}

export default function AudiencesPage() {
  const [filter, setFilter] = useState<AudienceFilter>("all")
  const [search, setSearch] = useState("")

  const { data: audiences, isLoading } = useAudiences(filter !== "all" ? filter : undefined, search || undefined)

  const stats = useMemo(() => {
    if (!audiences) return null
    return {
      total: audiences.length,
      custom: audiences.filter(a => a.type === "custom").length,
      lookalike: audiences.filter(a => a.type === "lookalike").length,
      totalSize: audiences.reduce((s, a) => s + a.size, 0),
      ready: audiences.filter(a => a.status === "ready").length,
    }
  }, [audiences])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "10%", width: "260px", height: "260px", opacity: 0.12 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Users className="h-5 w-5 text-purple-400" />
            Kitleler
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Custom ve Lookalike kitlelerinizi yönetin</p>
        </div>
        <Link
          href="/audiences/create"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Yeni Kitle
        </Link>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          {[
            { label: "Toplam Kitle", value: stats.total, color: "#8b5cf6" },
            { label: "Custom", value: stats.custom, color: "#3b82f6" },
            { label: "Lookalike", value: stats.lookalike, color: "#06b6d4" },
            { label: "Toplam Boyut", value: formatNumber(stats.totalSize), color: "#10b981" },
            { label: "Hazır", value: stats.ready, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-bold text-white mt-1 tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitle ara..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Audience cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          {(audiences || []).map((aud) => {
            const statusConfig = STATUS_CONFIG[aud.status]
            const SubtypeIcon = SUBTYPE_ICONS[aud.subtype] || Users

            return (
              <div
                key={aud.id}
                className="glass-card rounded-xl p-5 group hover:border-[rgba(148,163,184,0.12)] transition-all"
              >
                {/* Type badge + Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    aud.type === "custom" ? "bg-blue-500/10 text-blue-400" :
                    aud.type === "lookalike" ? "bg-cyan-500/10 text-cyan-400" :
                    "bg-purple-500/10 text-purple-400"
                  }`}>
                    {aud.type === "custom" ? "Custom Audience" : aud.type === "lookalike" ? "Lookalike" : "Saved"}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color}`}>
                    <statusConfig.icon className="h-2.5 w-2.5" />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Name */}
                <div className="flex items-start gap-2.5 mb-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    aud.type === "custom" ? "bg-blue-500/10" : "bg-cyan-500/10"
                  }`}>
                    <SubtypeIcon className={`h-4 w-4 ${aud.type === "custom" ? "text-blue-400" : "text-cyan-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {aud.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{aud.subtype}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">{aud.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-[9px] text-slate-600 uppercase">Boyut</p>
                    <p className="text-xs font-bold text-white tabular-nums">{aud.sizeRange}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-600 uppercase">Kampanyalar</p>
                    <p className="text-xs font-bold text-white tabular-nums flex items-center gap-1">
                      <Megaphone className="h-2.5 w-2.5 text-slate-600" />
                      {aud.usedInCampaigns}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-600 uppercase">
                      {aud.retentionDays ? "Retention" : aud.lookalikePercent ? "LA %" : "Oluşturma"}
                    </p>
                    <p className="text-xs font-bold text-white tabular-nums">
                      {aud.retentionDays ? `${aud.retentionDays} gün` :
                       aud.lookalikePercent ? `%${aud.lookalikePercent}` :
                       formatDate(aud.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Source info for lookalike */}
                {aud.sourceAudienceName && (
                  <div className="mt-3 pt-3 border-t border-[rgba(148,163,184,0.06)]">
                    <p className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Copy className="h-2.5 w-2.5" />
                      Kaynak: <span className="text-slate-400">{aud.sourceAudienceName}</span>
                      {aud.country && <span className="text-slate-600">• {aud.country}</span>}
                    </p>
                  </div>
                )}

                {/* Last updated */}
                <div className="mt-2 pt-2 border-t border-[rgba(148,163,184,0.04)]">
                  <p className="text-[10px] text-slate-600">
                    Güncelleme: {formatRelativeTime(aud.updatedAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && audiences?.length === 0 && (
        <div className="glass-card rounded-xl p-16 text-center">
          <Users className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Kitle bulunamadı</p>
          <p className="text-xs text-slate-600">Arama kriterlerinizi değiştirin veya yeni bir kitle oluşturun.</p>
        </div>
      )}
    </div>
  )
}
