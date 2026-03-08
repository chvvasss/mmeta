"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Image as ImageIcon,
  Search,
  Filter,
  ChevronRight,
  Pause,
  Play,
  MoreHorizontal,
  Copy,
  Archive,
  ExternalLink,
  Layers,
  Radio,
  ArrowUpDown,
  BarChart3,
} from "lucide-react"
import { useAds } from "@/hooks/use-ads"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import { QUALITY_RANKINGS, CTA_TYPES } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { MockAd } from "@/lib/mock-data"

const FORMAT_LABELS: Record<string, string> = {
  CAROUSEL: "Carousel",
  SINGLE_IMAGE: "Tekli Görsel",
  SINGLE_VIDEO: "Tekli Video",
  COLLECTION: "Koleksiyon",
}

const FORMAT_ICONS: Record<string, typeof ImageIcon> = {
  CAROUSEL: Layers,
  SINGLE_IMAGE: ImageIcon,
  SINGLE_VIDEO: Radio,
}

const FORMAT_COLORS: Record<string, string> = {
  CAROUSEL: "#3b82f6",
  SINGLE_IMAGE: "#10b981",
  SINGLE_VIDEO: "#f59e0b",
  COLLECTION: "#8b5cf6",
}

type SortKey = "name" | "spend" | "clicks" | "cpc" | "ctr" | "conversions"

export default function AdsPage() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [formatFilter, setFormatFilter] = useState("ALL")

  const { data: ads, isLoading } = useAds()

  const filtered = useMemo(() => {
    if (!ads) return []
    let result = ads

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.adSetName.toLowerCase().includes(q) ||
          a.headline.toLowerCase().includes(q)
      )
    }

    if (formatFilter !== "ALL") {
      result = result.filter((a) => a.creativeFormat === formatFilter)
    }

    result.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return result
  }, [ads, search, sortKey, sortDir, formatFilter])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  const formats = ["ALL", "CAROUSEL", "SINGLE_IMAGE", "SINGLE_VIDEO"]

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "10%", width: "280px", height: "280px", opacity: 0.2 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <ImageIcon className="h-5 w-5 text-blue-400" />
            Reklamlar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Tüm reklam kreatiflerinizi yönetin ve performanslarını takip edin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reklam adı, başlık veya reklam seti ara..."
            className="pl-9 h-8 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.08)] text-white text-xs placeholder:text-slate-600"
          />
        </div>

        {/* Format filter pills */}
        <div className="flex items-center gap-1">
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setFormatFilter(f)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1.5 ${formatFilter === f
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
            >
              {f !== "ALL" && (
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: FORMAT_COLORS[f] || "#64748b" }} />
              )}
              {f === "ALL" ? "Tümü" : FORMAT_LABELS[f] || f}
            </button>
          ))}
        </div>
      </div>

      {/* Ads Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-64 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <ImageIcon className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Reklam bulunamadı</p>
          <p className="text-xs text-slate-600">Filtrelerinizi değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ad, idx) => (
            <AdCard key={ad.id} ad={ad} delay={120 + idx * 60} />
          ))}
        </div>
      )}
    </div>
  )
}

function AdCard({ ad, delay }: { ad: MockAd; delay: number }) {
  const FormatIcon = FORMAT_ICONS[ad.creativeFormat] || ImageIcon
  const formatColor = FORMAT_COLORS[ad.creativeFormat] || "#64748b"
  const ctaLabel = CTA_TYPES[ad.ctaType as keyof typeof CTA_TYPES] || ad.ctaType

  return (
    <div
      className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Creative preview placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <FormatIcon className="h-8 w-8 text-slate-600" />
          <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">
            {FORMAT_LABELS[ad.creativeFormat] || ad.creativeFormat}
          </span>
        </div>

        {/* Format badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${formatColor}20`, color: formatColor }}
        >
          <FormatIcon className="h-2.5 w-2.5" />
          {FORMAT_LABELS[ad.creativeFormat]}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={ad.effectiveStatus} type="effective" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/ads/${ad.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors line-clamp-1 block">
          {ad.name}
        </Link>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ad.primaryText}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-600">
            {ad.headline} • {ctaLabel}
          </span>
          <Link href={`/adsets/${ad.adSetId}`} className="text-[10px] text-slate-600 hover:text-blue-400 transition-colors">
            {ad.adSetName.slice(0, 20)}...
          </Link>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[rgba(148,163,184,0.06)]">
          <div>
            <p className="text-[10px] text-slate-600">Harcama</p>
            <p className="text-xs font-semibold text-white">{formatCurrency(ad.spend)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-600">Tıklama</p>
            <p className="text-xs font-semibold text-white">{formatNumber(ad.clicks)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-600">CTR</p>
            <p className="text-xs font-semibold text-white">{formatPercent(ad.ctr)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-600">Dönüşüm</p>
            <p className="text-xs font-semibold text-white">{ad.conversions}</p>
          </div>
        </div>

        {/* Quality rankings */}
        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-[rgba(148,163,184,0.04)]">
          <QualityIndicator label="Kalite" ranking={ad.qualityRanking} />
          <QualityIndicator label="Etkileşim" ranking={ad.engagementRanking} />
          <QualityIndicator label="Dönüşüm" ranking={ad.conversionRanking} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[rgba(148,163,184,0.06)]">
        <Link
          href={`/ads/${ad.id}`}
          className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          Detaylar <ChevronRight className="h-3 w-3" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 hover:text-white hover:bg-slate-800 transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
              {ad.effectiveStatus === "ACTIVE" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {ad.effectiveStatus === "ACTIVE" ? "Duraklat" : "Aktifleştir"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
              <Copy className="h-3.5 w-3.5" /> Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
            <DropdownMenuItem
              onClick={() => toast.success("Reklam arşivlendi")}
              className="text-red-400 focus:bg-slate-800 focus:text-red-300 text-xs gap-2"
            >
              <Archive className="h-3.5 w-3.5" /> Arşivle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function QualityIndicator({ label, ranking }: { label: string; ranking: string }) {
  const color = ranking.includes("ABOVE") ? "#10b981" : ranking === "AVERAGE" ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex items-center gap-1">
      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-slate-600">{label}</span>
    </div>
  )
}
