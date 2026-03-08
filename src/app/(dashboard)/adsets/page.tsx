"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Layers,
  Search,
  Filter,
  ChevronRight,
  Pause,
  Play,
  MoreHorizontal,
  Copy,
  Archive,
  ExternalLink,
  Target,
  Users as UsersIcon,
  MapPin,
  Radio,
  ArrowUpDown,
} from "lucide-react"
import { useAdSets } from "@/hooks/use-adsets"
import { useCampaigns } from "@/hooks/use-campaigns"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { MockAdSet } from "@/lib/mock-data"

type SortKey = "name" | "spend" | "clicks" | "cpc" | "ctr" | "conversions" | "frequency"
type SortDir = "asc" | "desc"

export default function AdSetsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [campaignFilter, setCampaignFilter] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const { data: adSets, isLoading } = useAdSets(campaignFilter || undefined, undefined, statusFilter !== "ALL" ? statusFilter : undefined)
  const { data: campaigns } = useCampaigns()

  const filtered = useMemo(() => {
    if (!adSets) return []
    let result = adSets

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.campaignName.toLowerCase().includes(q) ||
          a.targetingSummary.toLowerCase().includes(q)
      )
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
  }, [adSets, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  const statuses = ["ALL", "ACTIVE", "PAUSED"]

  const uniqueCampaigns = useMemo(() => {
    if (!campaigns) return []
    return campaigns.map((c) => ({ id: c.id, name: c.name }))
  }, [campaigns])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-blue" style={{ top: "5%", right: "10%", width: "280px", height: "280px", opacity: 0.2 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Layers className="h-5 w-5 text-blue-400" />
            Reklam Setleri
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tüm kampanyalardaki reklam setlerini yönetin
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Reklam seti, kampanya veya hedefleme ara..."
            className="pl-9 h-8 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.08)] text-white text-xs placeholder:text-slate-600"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${statusFilter === s
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
            >
              {s === "ALL" ? "Tümü" : s === "ACTIVE" ? "Aktif" : "Duraklatılmış"}
            </button>
          ))}
        </div>

        {/* Campaign filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 border border-[rgba(148,163,184,0.08)] transition-colors">
            <Filter className="h-3 w-3" />
            {campaignFilter ? uniqueCampaigns.find(c => c.id === campaignFilter)?.name?.slice(0, 20) + "..." : "Tüm Kampanyalar"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220] max-h-64 overflow-y-auto">
            <DropdownMenuItem
              onClick={() => setCampaignFilter("")}
              className={`text-xs ${!campaignFilter ? "bg-blue-500/10 text-blue-400" : "text-slate-400 focus:bg-slate-800 focus:text-white"}`}
            >
              Tüm Kampanyalar
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
            {uniqueCampaigns.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => setCampaignFilter(c.id)}
                className={`text-xs ${campaignFilter === c.id ? "bg-blue-500/10 text-blue-400" : "text-slate-400 focus:bg-slate-800 focus:text-white"}`}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        {/* Header row */}
        <div className="hidden lg:grid grid-cols-[1fr_120px_80px_80px_70px_70px_80px_70px_40px] items-center gap-2 px-4 py-2.5 border-b border-[rgba(148,163,184,0.06)] text-[10px] font-medium text-slate-600 uppercase tracking-wider">
          <SortHeader label="Reklam Seti" sortKey="name" currentKey={sortKey} dir={sortDir} onSort={toggleSort} />
          <div>Durum</div>
          <SortHeader label="Harcama" sortKey="spend" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <SortHeader label="Tıklama" sortKey="clicks" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <SortHeader label="CPC" sortKey="cpc" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <SortHeader label="CTR" sortKey="ctr" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <SortHeader label="Dönüşüm" sortKey="conversions" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <SortHeader label="Frekans" sortKey="frequency" currentKey={sortKey} dir={sortDir} onSort={toggleSort} className="text-right" />
          <div />
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-16 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Layers className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-1">Reklam seti bulunamadı</p>
            <p className="text-xs text-slate-600">Filtrelerinizi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div>
            {filtered.map((adSet) => (
              <AdSetTableRow key={adSet.id} adSet={adSet} />
            ))}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(148,163,184,0.06)] text-xs text-slate-500">
            <span>{filtered.length} reklam seti</span>
            <span>Toplam Harcama: {formatCurrency(filtered.reduce((s, a) => s + a.spend, 0))}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SortHeader({ label, sortKey, currentKey, dir, onSort, className = "" }: {
  label: string; sortKey: SortKey; currentKey: SortKey; dir: SortDir; onSort: (k: SortKey) => void; className?: string
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

function AdSetTableRow({ adSet }: { adSet: MockAdSet }) {
  return (
    <div className="table-row-hover grid grid-cols-1 lg:grid-cols-[1fr_120px_80px_80px_70px_70px_80px_70px_40px] items-center gap-2 px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
      {/* Name & campaign */}
      <div className="min-w-0">
        <Link href={`/adsets/${adSet.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors truncate block">
          {adSet.name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <Link href={`/campaigns/${adSet.campaignId}`} className="text-[11px] text-slate-600 hover:text-blue-400 transition-colors truncate">
            {adSet.campaignName}
          </Link>
          <span className="text-[9px] text-slate-700">•</span>
          <span className="text-[11px] text-slate-600 flex items-center gap-0.5 truncate">
            <MapPin className="h-2.5 w-2.5" />
            {adSet.targetingSummary.slice(0, 40)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1 flex-wrap">
        <StatusBadge status={adSet.effectiveStatus} type="effective" />
        {adSet.learningPhase && (
          <StatusBadge status={adSet.learningPhase} type="learning" className="hidden xl:inline-flex" />
        )}
      </div>

      {/* Metrics */}
      <div className="text-right text-xs font-semibold text-white">{formatCurrency(adSet.spend)}</div>
      <div className="text-right text-xs font-semibold text-white">{formatNumber(adSet.clicks)}</div>
      <div className="text-right text-xs font-semibold text-white">{formatCurrency(adSet.cpc)}</div>
      <div className="text-right text-xs font-semibold text-white">{formatPercent(adSet.ctr)}</div>
      <div className="text-right text-xs font-semibold text-white">{formatNumber(adSet.conversions)}</div>
      <div className="text-right text-xs text-slate-400">{adSet.frequency.toFixed(2)}</div>

      {/* Actions */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:text-white hover:bg-slate-800 transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
              {adSet.effectiveStatus === "ACTIVE" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {adSet.effectiveStatus === "ACTIVE" ? "Duraklat" : "Aktifleştir"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
              <Copy className="h-3.5 w-3.5" /> Kopyala
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
              <ExternalLink className="h-3.5 w-3.5" /> Meta&apos;da Aç
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
            <DropdownMenuItem
              onClick={() => toast.success("Reklam seti arşivlendi")}
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
