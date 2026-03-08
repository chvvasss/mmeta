"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  FileText,
  Plus,
  Search,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BarChart3,
  Users,
  Palette,
  DollarSign,
  Settings2,
  Send,
  Eye,
  FileDown,
  Repeat,
} from "lucide-react"
import { useReports } from "@/hooks/use-reports"
import { formatRelativeTime, formatDate } from "@/lib/formatting"

type ReportFilter = "all" | "performance" | "audience" | "creative" | "budget" | "custom"

const REPORT_FILTERS: Array<{ key: ReportFilter; label: string }> = [
  { key: "all", label: "Tümü" },
  { key: "performance", label: "Performans" },
  { key: "audience", label: "Kitle" },
  { key: "creative", label: "Kreatif" },
  { key: "budget", label: "Bütçe" },
  { key: "custom", label: "Özel" },
]

const TYPE_CONFIG = {
  performance: { label: "Performans", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10" },
  audience: { label: "Kitle", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
  creative: { label: "Kreatif", icon: Palette, color: "text-pink-400", bg: "bg-pink-500/10" },
  budget: { label: "Bütçe", icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
  custom: { label: "Özel", icon: Settings2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
}

const STATUS_CONFIG = {
  completed: { label: "Tamamlandı", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  generating: { label: "Oluşturuluyor", icon: Loader2, color: "text-blue-400", bg: "bg-blue-500/10", animated: true },
  scheduled: { label: "Zamanlanmış", icon: Calendar, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  failed: { label: "Başarısız", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
}

const FREQUENCY_LABELS = {
  once: "Tek Seferlik",
  daily: "Günlük",
  weekly: "Haftalık",
  monthly: "Aylık",
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<ReportFilter>("all")
  const [search, setSearch] = useState("")

  const { data: reports, isLoading } = useReports(filter !== "all" ? filter : undefined)

  const filteredReports = useMemo(() => {
    if (!reports) return []
    if (!search) return reports
    return reports.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  }, [reports, search])

  const stats = useMemo(() => {
    if (!reports) return null
    return {
      total: reports.length,
      completed: reports.filter(r => r.status === "completed").length,
      scheduled: reports.filter(r => r.frequency !== "once").length,
      totalPages: reports.reduce((s, r) => s + (r.pageCount || 0), 0),
    }
  }, [reports])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-blue" style={{ top: "5%", right: "10%", width: "280px", height: "280px", opacity: 0.1 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <FileText className="h-5 w-5 text-blue-400" />
            Raporlar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Performans raporlarını oluşturun, zamanlayın ve paylaşın</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
          <Plus className="h-3.5 w-3.5" />
          Yeni Rapor
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          {[
            { label: "Toplam Rapor", value: stats.total, icon: FileText, color: "#3b82f6" },
            { label: "Tamamlanmış", value: stats.completed, icon: CheckCircle2, color: "#10b981" },
            { label: "Zamanlanmış", value: stats.scheduled, icon: Repeat, color: "#06b6d4" },
            { label: "Toplam Sayfa", value: stats.totalPages, icon: FileDown, color: "#8b5cf6" },
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

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-1 flex-wrap">
          {REPORT_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
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
            placeholder="Rapor ara..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-24 rounded-xl" />
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <FileText className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Rapor bulunamadı</p>
          <p className="text-xs text-slate-600">Filtrelerinizi değiştirin veya yeni bir rapor oluşturun.</p>
        </div>
      ) : (
        <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          {filteredReports.map((report) => {
            const typeCfg = TYPE_CONFIG[report.type]
            const statusCfg = STATUS_CONFIG[report.status]
            const TypeIcon = typeCfg.icon
            const StatusIcon = statusCfg.icon

            return (
              <Link
                key={report.id}
                href={report.status === "completed" ? `/reports/${report.id}` : "#"}
                className={`glass-card rounded-xl p-5 block group ${
                  report.status === "completed" ? "hover:border-[rgba(148,163,184,0.12)]" : ""
                } transition-all`}
              >
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className={`h-11 w-11 rounded-xl ${typeCfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`h-5 w-5 ${typeCfg.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                        {report.name}
                      </p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon className={`h-2.5 w-2.5 ${"animated" in statusCfg ? "animate-spin" : ""}`} />
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2 truncate">{report.description}</p>

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Type badge */}
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${typeCfg.bg} ${typeCfg.color} font-semibold`}>
                        {typeCfg.label}
                      </span>

                      {/* Frequency */}
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Repeat className="h-2.5 w-2.5" />
                        {FREQUENCY_LABELS[report.frequency]}
                      </span>

                      {/* Date range */}
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(report.dateRange.from)} — {formatDate(report.dateRange.to)}
                      </span>

                      {/* Created */}
                      <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatRelativeTime(report.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right side info */}
                  <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                    {report.fileSize && (
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Boyut</p>
                        <p className="text-xs font-medium text-white">{report.fileSize}</p>
                      </div>
                    )}
                    {report.pageCount && (
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Sayfa</p>
                        <p className="text-xs font-medium text-white tabular-nums">{report.pageCount}</p>
                      </div>
                    )}
                    {report.lastSentTo.length > 0 && (
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Gönderildi</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Send className="h-2.5 w-2.5" />
                          {report.lastSentTo.length} kişi
                        </p>
                      </div>
                    )}

                    {report.status === "completed" && (
                      <div className="flex items-center gap-1.5">
                        <button className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                          <Eye className="h-3.5 w-3.5 text-blue-400" />
                        </button>
                        <button className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                          <Download className="h-3.5 w-3.5 text-emerald-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics preview */}
                {report.status === "completed" && report.metrics.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[rgba(148,163,184,0.04)] flex items-center gap-4">
                    <span className="text-[9px] text-slate-600 uppercase">Metrikler:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.metrics.slice(0, 6).map((m) => (
                        <span key={m} className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(12,18,32,0.5)] text-slate-400 border border-[rgba(148,163,184,0.04)]">
                          {m}
                        </span>
                      ))}
                      {report.metrics.length > 6 && (
                        <span className="text-[9px] text-slate-600">+{report.metrics.length - 6}</span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
