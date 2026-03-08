"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useUpdateCampaign } from "@/hooks/use-campaign-detail"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay"
import { MiniSparkline } from "@/components/shared/MiniSparkline"
import { formatNumber, formatPercent } from "@/lib/formatting"
import { CAMPAIGN_OBJECTIVES } from "@/lib/constants"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutGrid, List, MoreHorizontal, Play, Pause, Copy,
  Archive, ExternalLink, Megaphone, Target, Eye, ShoppingCart,
  Users, Smartphone, TrendingUp, ChevronRight, Check, X,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import type { CampaignTableRow } from "@/types/app"

type SortKey = "name" | "spend" | "impressions" | "clicks" | "cpc" | "ctr" | "conversions" | "roas"
type SortDir = "asc" | "desc"
type ViewMode = "table" | "card"

const objectiveIcons: Record<string, React.ElementType> = {
  OUTCOME_TRAFFIC: TrendingUp,
  OUTCOME_ENGAGEMENT: Eye,
  OUTCOME_LEADS: Users,
  OUTCOME_SALES: ShoppingCart,
  OUTCOME_AWARENESS: Megaphone,
  OUTCOME_APP_PROMOTION: Smartphone,
}

function InlineBudgetEdit({
  campaign,
  onSave,
}: {
  campaign: CampaignTableRow
  onSave: (id: string, budget: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(campaign.dailyBudget || 0))

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group/edit inline-flex items-center gap-1 text-right"
        title="Bütçeyi düzenle"
      >
        <CurrencyDisplay amount={campaign.dailyBudget || 0} className="text-sm text-slate-300" />
        <span className="text-[9px] text-slate-600">/gün</span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-slate-500">₺</span>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const num = parseFloat(value)
            if (num > 0) { onSave(campaign.id, num); setEditing(false) }
          }
          if (e.key === "Escape") setEditing(false)
        }}
        autoFocus
        className="w-20 rounded border border-blue-500/30 bg-slate-900 px-2 py-0.5 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/20"
      />
      <button onClick={() => { const n = parseFloat(value); if (n > 0) { onSave(campaign.id, n); setEditing(false) } }} className="text-emerald-400 hover:text-emerald-300">
        <Check className="h-3 w-3" />
      </button>
      <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-slate-300">
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

function CampaignCard({ campaign, onStatusChange, onBudgetSave }: {
  campaign: CampaignTableRow
  onStatusChange: (id: string, status: string) => void
  onBudgetSave: (id: string, budget: number) => void
}) {
  const ObjIcon = objectiveIcons[campaign.objective] || Target

  return (
    <div className="glass-card group rounded-xl p-5 transition-all hover:border-blue-500/15">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <ObjIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <Link href={`/campaigns/${campaign.id}`} className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1">
              {campaign.name}
            </Link>
            <div className="mt-0.5 flex items-center gap-2">
              <StatusBadge status={campaign.effectiveStatus} type="effective" />
              <span className="text-[10px] text-slate-500">
                {CAMPAIGN_OBJECTIVES[campaign.objective as keyof typeof CAMPAIGN_OBJECTIVES]}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-800 hover:text-white transition-all">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
            {campaign.effectiveStatus === "ACTIVE" ? (
              <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "PAUSED")} className="text-xs text-slate-300 focus:bg-slate-800">
                <Pause className="mr-2 h-3 w-3" /> Duraklat
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "ACTIVE")} className="text-xs text-slate-300 focus:bg-slate-800">
                <Play className="mr-2 h-3 w-3" /> Aktifleştir
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-xs text-slate-300 focus:bg-slate-800">
              <Copy className="mr-2 h-3 w-3" /> Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
            <DropdownMenuItem onClick={() => onStatusChange(campaign.id, "ARCHIVED")} className="text-xs text-red-400 focus:bg-slate-800">
              <Archive className="mr-2 h-3 w-3" /> Arşivle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metrics grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Harcama</p>
          <CurrencyDisplay amount={campaign.spend} className="text-sm font-semibold text-white" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Bütçe</p>
          <InlineBudgetEdit campaign={campaign} onSave={onBudgetSave} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Tıklama</p>
          <p className="text-sm font-semibold text-white tabular-nums">{formatNumber(campaign.clicks)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Dönüşüm</p>
          <p className="text-sm font-semibold text-white tabular-nums">{formatNumber(campaign.conversions)}</p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/30 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">CPC</span>
            <CurrencyDisplay amount={campaign.cpc} className="text-xs text-slate-300" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">CTR</span>
            <span className="text-xs text-slate-300">{formatPercent(campaign.ctr)}</span>
          </div>
          {campaign.roas > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500">ROAS</span>
              <span className={`text-xs font-semibold ${campaign.roas >= 4 ? "text-emerald-400" : "text-amber-400"}`}>
                {campaign.roas.toFixed(1)}x
              </span>
            </div>
          )}
        </div>
        <Link href={`/campaigns/${campaign.id}`} className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
          Detay <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const campaignsQuery = useCampaigns({ sortBy: sortKey, sortDir })
  const updateMutation = useUpdateCampaign()

  const data = campaignsQuery.data || []

  const filteredData = useMemo(() => {
    let result = [...data]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q))
    }
    if (statusFilter !== "ALL") {
      result = result.filter(c => c.effectiveStatus === statusFilter)
    }
    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal
      }
      return sortDir === "desc" ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal))
    })
    return result
  }, [data, search, statusFilter, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate(
      { id, data: { status: status as "ACTIVE" | "PAUSED" | "ARCHIVED" } },
      {
        onSuccess: () => toast.success(`Kampanya ${status === "ACTIVE" ? "aktifleştirildi" : status === "PAUSED" ? "duraklatıldı" : "arşivlendi"}`),
        onError: () => toast.error("İşlem başarısız"),
      }
    )
  }

  const handleBudgetSave = (id: string, budget: number) => {
    updateMutation.mutate(
      { id, data: { dailyBudget: budget } },
      {
        onSuccess: () => toast.success("Bütçe güncellendi"),
        onError: () => toast.error("Bütçe güncellenemedi"),
      }
    )
  }

  const activeCount = data.filter(c => c.effectiveStatus === "ACTIVE").length
  const totalSpend = data.reduce((s, c) => s + c.spend, 0)

  function SortHeader({ col, label }: { col: SortKey; label: string }) {
    const active = sortKey === col
    return (
      <TableHead
        className="group cursor-pointer select-none text-slate-500 hover:text-slate-300 transition-colors text-right"
        onClick={() => handleSort(col)}
      >
        <div className="flex items-center justify-end gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
          {active
            ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-blue-400" /> : <ArrowDown className="h-3 w-3 text-blue-400" />)
            : <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          }
        </div>
      </TableHead>
    )
  }

  return (
    <div className="relative">
      <div className="orb orb-blue" />
      <div className="orb orb-purple" />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Kampanyalar
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {activeCount} aktif kampanya · Toplam <CurrencyDisplay amount={totalSpend} className="text-xs" /> harcama
            </p>
          </div>
          <Link
            href="/campaigns/create"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            Yeni Kampanya
          </Link>
        </div>

        {/* Filters */}
        <div className="glass-card flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text" placeholder="Kampanya ara..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-52 rounded-lg border border-slate-800 bg-slate-900/50 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 appearance-none rounded-lg border border-slate-800 bg-slate-900/50 pl-8 pr-8 text-xs text-white outline-none focus:border-blue-500/30 cursor-pointer"
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value="ACTIVE">Aktif</option>
                <option value="PAUSED">Duraklatıldı</option>
                <option value="WITH_ISSUES">Sorunlu</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/30 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "table" ? "bg-blue-500/15 text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "card" ? "bg-blue-500/15 text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {campaignsQuery.isLoading ? (
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-loader h-14 w-full" />
              ))}
            </div>
          </div>
        ) : viewMode === "table" ? (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800/50 hover:bg-transparent">
                    <TableHead className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Kampanya</TableHead>
                    <SortHeader col="spend" label="Harcama" />
                    <SortHeader col="impressions" label="Gösterim" />
                    <SortHeader col="clicks" label="Tıklama" />
                    <SortHeader col="cpc" label="CPC" />
                    <SortHeader col="ctr" label="CTR" />
                    <SortHeader col="conversions" label="Dönüşüm" />
                    <SortHeader col="roas" label="ROAS" />
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((campaign) => (
                    <TableRow key={campaign.id} className="table-row-hover border-slate-800/30 group/row">
                      <TableCell className="max-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div>
                            <Link href={`/campaigns/${campaign.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors line-clamp-1">
                              {campaign.name}
                            </Link>
                            <div className="mt-0.5 flex items-center gap-2">
                              <StatusBadge status={campaign.effectiveStatus} type="effective" />
                              <span className="text-[10px] text-slate-500">
                                {CAMPAIGN_OBJECTIVES[campaign.objective as keyof typeof CAMPAIGN_OBJECTIVES]}
                              </span>
                              {campaign.learningPhase && <StatusBadge status={campaign.learningPhase} type="learning" />}
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 text-slate-600 opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <CurrencyDisplay amount={campaign.spend} className="text-sm font-medium text-white" />
                        <div className="mt-0.5">
                          <InlineBudgetEdit campaign={campaign} onSave={handleBudgetSave} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-300 tabular-nums">{formatNumber(campaign.impressions)}</TableCell>
                      <TableCell className="text-right text-sm text-slate-300 tabular-nums">{formatNumber(campaign.clicks)}</TableCell>
                      <TableCell className="text-right"><CurrencyDisplay amount={campaign.cpc} className="text-sm text-slate-300" /></TableCell>
                      <TableCell className="text-right text-sm text-slate-300 tabular-nums">{formatPercent(campaign.ctr)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <MiniSparkline data={[campaign.conversions * 0.6, campaign.conversions * 0.75, campaign.conversions * 0.9, campaign.conversions * 0.85, campaign.conversions]} color={campaign.conversions > 0 ? "#10b981" : "#475569"} width={40} height={16} />
                          <span className="text-sm font-medium text-white tabular-nums">{formatNumber(campaign.conversions)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.roas > 0 ? (
                          <span className={`text-sm font-semibold tabular-nums ${campaign.roas >= 4 ? "text-emerald-400" : campaign.roas >= 2 ? "text-amber-400" : "text-red-400"}`}>
                            {campaign.roas.toFixed(1)}x
                          </span>
                        ) : <span className="text-sm text-slate-600">—</span>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 opacity-0 group-hover/row:opacity-100 hover:bg-slate-800 hover:text-white transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
                            <DropdownMenuItem onClick={() => window.location.href = `/campaigns/${campaign.id}`} className="text-xs text-slate-300 focus:bg-slate-800">
                              <ExternalLink className="mr-2 h-3 w-3" /> Detaylar
                            </DropdownMenuItem>
                            {campaign.effectiveStatus === "ACTIVE" ? (
                              <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "PAUSED")} className="text-xs text-slate-300 focus:bg-slate-800">
                                <Pause className="mr-2 h-3 w-3" /> Duraklat
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "ACTIVE")} className="text-xs text-slate-300 focus:bg-slate-800">
                                <Play className="mr-2 h-3 w-3" /> Aktifleştir
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-xs text-slate-300 focus:bg-slate-800">
                              <Copy className="mr-2 h-3 w-3" /> Kopyala
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
                            <DropdownMenuItem onClick={() => handleStatusChange(campaign.id, "ARCHIVED")} className="text-xs text-red-400 focus:bg-slate-800">
                              <Archive className="mr-2 h-3 w-3" /> Arşivle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredData.length === 0 && (
              <div className="py-16 text-center">
                <Megaphone className="mx-auto h-10 w-10 text-slate-700" />
                <p className="mt-3 text-sm text-slate-500">Filtrelere uygun kampanya bulunamadı</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredData.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onStatusChange={handleStatusChange}
                onBudgetSave={handleBudgetSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
