"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay"
import { MiniSparkline } from "@/components/shared/MiniSparkline"
import { formatNumber, formatPercent } from "@/lib/formatting"
import { CAMPAIGN_OBJECTIVES } from "@/lib/constants"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, ExternalLink } from "lucide-react"
import type { CampaignTableRow } from "@/types/app"
import Link from "next/link"

type SortKey = "name" | "spend" | "impressions" | "clicks" | "cpc" | "ctr" | "conversions" | "roas"
type SortDirection = "asc" | "desc"

interface CampaignTableProps {
  data: CampaignTableRow[]
  loading?: boolean
}

const columnConfig: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "Kampanya", align: "left" },
  { key: "spend", label: "Harcama", align: "right" },
  { key: "impressions", label: "Gösterim", align: "right" },
  { key: "clicks", label: "Tıklama", align: "right" },
  { key: "cpc", label: "CPC", align: "right" },
  { key: "ctr", label: "CTR", align: "right" },
  { key: "conversions", label: "Dönüşüm", align: "right" },
  { key: "roas", label: "ROAS", align: "right" },
]

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
  return direction === "asc"
    ? <ArrowUp className="h-3 w-3 text-blue-400" />
    : <ArrowDown className="h-3 w-3 text-blue-400" />
}

function OpportunityBar({ score }: { score: number | null }) {
  if (score === null) return null
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

export function CampaignTable({ data, loading }: CampaignTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend")
  const [sortDir, setSortDir] = useState<SortDirection>("desc")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc")
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...data]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(q))
    }

    if (statusFilter !== "ALL") {
      result = result.filter((c) => c.effectiveStatus === statusFilter)
    }

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0
      const bVal = b[sortKey] ?? 0
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal
      }
      return sortDir === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal))
    })

    return result
  }, [data, search, statusFilter, sortKey, sortDir])

  if (loading) {
    return (
      <div className="glass-card rounded-xl opacity-0 animate-slide-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <div className="p-5">
          <div className="skeleton-loader h-5 w-28" />
        </div>
        <div className="px-5 pb-5 space-y-2">
          <div className="skeleton-loader h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-14 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const activeCount = data.filter((c) => c.effectiveStatus === "ACTIVE").length
  const pausedCount = data.filter((c) => c.effectiveStatus === "PAUSED").length

  return (
    <div
      className="glass-card rounded-xl opacity-0 animate-slide-up overflow-hidden"
      style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Kampanyalar
          </h3>
          <div className="flex gap-1.5">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {activeCount} aktif
            </span>
            {pausedCount > 0 && (
              <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                {pausedCount} duraklatıldı
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Kampanya ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-44 rounded-lg border border-slate-800 bg-slate-900/50 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 appearance-none rounded-lg border border-slate-800 bg-slate-900/50 pl-8 pr-8 text-xs text-white outline-none focus:border-blue-500/30 cursor-pointer"
            >
              <option value="ALL">Tümü</option>
              <option value="ACTIVE">Aktif</option>
              <option value="PAUSED">Duraklatıldı</option>
              <option value="WITH_ISSUES">Sorunlu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800/50 hover:bg-transparent">
              {columnConfig.map((col) => (
                <TableHead
                  key={col.key}
                  className={`group cursor-pointer select-none text-slate-500 hover:text-slate-300 transition-colors ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : ""}`}>
                    <span className="text-[11px] font-medium uppercase tracking-wider">{col.label}</span>
                    <SortIcon active={sortKey === col.key} direction={sortDir} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Skor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.map((campaign) => (
              <TableRow key={campaign.id} className="table-row-hover border-slate-800/30 group/row">
                <TableCell className="max-w-[240px]">
                  <div className="flex items-center gap-3">
                    <div>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-sm font-medium text-white hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        {campaign.name}
                      </Link>
                      <div className="mt-0.5 flex items-center gap-2">
                        <StatusBadge status={campaign.effectiveStatus} type="effective" />
                        <span className="text-[10px] text-slate-500">
                          {CAMPAIGN_OBJECTIVES[campaign.objective as keyof typeof CAMPAIGN_OBJECTIVES] || campaign.objective}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-slate-600 opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay amount={campaign.spend} className="text-sm font-medium text-white" />
                  {campaign.dailyBudget && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      <CurrencyDisplay amount={campaign.dailyBudget} className="text-[10px]" />/gün
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                  {formatNumber(campaign.impressions)}
                </TableCell>
                <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                  {formatNumber(campaign.clicks)}
                </TableCell>
                <TableCell className="text-right">
                  <CurrencyDisplay amount={campaign.cpc} className="text-sm text-slate-300" />
                </TableCell>
                <TableCell className="text-right text-sm text-slate-300 tabular-nums">
                  {formatPercent(campaign.ctr)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <MiniSparkline
                      data={[
                        campaign.conversions * 0.6,
                        campaign.conversions * 0.75,
                        campaign.conversions * 0.9,
                        campaign.conversions * 0.85,
                        campaign.conversions,
                      ]}
                      color={campaign.conversions > 0 ? "#10b981" : "#475569"}
                      width={40}
                      height={16}
                    />
                    <span className="text-sm font-medium text-white tabular-nums">
                      {formatNumber(campaign.conversions)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {campaign.roas > 0 ? (
                    <span className={`text-sm font-semibold tabular-nums ${
                      campaign.roas >= 4 ? "text-emerald-400" : campaign.roas >= 2 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {campaign.roas.toFixed(1)}x
                    </span>
                  ) : (
                    <span className="text-sm text-slate-600">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <OpportunityBar score={campaign.opportunityScore} />
                </TableCell>
              </TableRow>
            ))}
            {filteredAndSorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-sm text-slate-500">
                  {search || statusFilter !== "ALL"
                    ? "Filtrelere uygun kampanya bulunamadı"
                    : "Henüz kampanya verisi yok"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800/30 px-5 py-3">
        <span className="text-[11px] text-slate-500">
          {filteredAndSorted.length} / {data.length} kampanya
        </span>
        <Link href="/campaigns" className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Tümünü Görüntüle →
        </Link>
      </div>
    </div>
  )
}
