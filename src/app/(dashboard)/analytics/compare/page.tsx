"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  GitCompare,
  ChevronLeft,
  ChevronDown,
  Search,
  Megaphone,
} from "lucide-react"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useComparison } from "@/hooks/use-analytics"
import { ComparisonView } from "@/components/analytics/ComparisonView"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatCurrency } from "@/lib/formatting"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ComparePage() {
  const [campaignAId, setCampaignAId] = useState("camp_001")
  const [campaignBId, setCampaignBId] = useState("camp_004")
  const [searchA, setSearchA] = useState("")
  const [searchB, setSearchB] = useState("")

  const { data: campaigns } = useCampaigns()
  const { data: comparisonData, isLoading } = useComparison(campaignAId, campaignBId)

  const campaignA = useMemo(() => campaigns?.find(c => c.id === campaignAId), [campaigns, campaignAId])
  const campaignB = useMemo(() => campaigns?.find(c => c.id === campaignBId), [campaigns, campaignBId])

  const filteredCampaignsA = useMemo(() => {
    if (!campaigns) return []
    if (!searchA) return campaigns.filter(c => c.id !== campaignBId)
    return campaigns.filter(c => c.id !== campaignBId && c.name.toLowerCase().includes(searchA.toLowerCase()))
  }, [campaigns, searchA, campaignBId])

  const filteredCampaignsB = useMemo(() => {
    if (!campaigns) return []
    if (!searchB) return campaigns.filter(c => c.id !== campaignAId)
    return campaigns.filter(c => c.id !== campaignAId && c.name.toLowerCase().includes(searchB.toLowerCase()))
  }, [campaigns, searchB, campaignAId])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-amber" style={{ top: "5%", right: "10%", width: "260px", height: "260px", opacity: 0.12 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/analytics" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Analytics
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <GitCompare className="h-5 w-5 text-amber-400" />
            Kampanya Karşılaştırma
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">İki kampanyayı yan yana karşılaştırın ve performans farkını analiz edin</p>
        </div>
      </div>

      {/* Campaign selectors */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {/* Campaign A selector */}
        <CampaignSelector
          label="Kampanya A"
          color="#3b82f6"
          selectedCampaign={campaignA}
          campaigns={filteredCampaignsA}
          search={searchA}
          onSearchChange={setSearchA}
          onSelect={setCampaignAId}
        />

        <div className="hidden md:flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-slate-800/60 border border-[rgba(148,163,184,0.08)] flex items-center justify-center">
            <GitCompare className="h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Campaign B selector */}
        <CampaignSelector
          label="Kampanya B"
          color="#f59e0b"
          selectedCampaign={campaignB}
          campaigns={filteredCampaignsB}
          search={searchB}
          onSearchChange={setSearchB}
          onSelect={setCampaignBId}
        />
      </div>

      {/* Comparison results */}
      {comparisonData && campaignA && campaignB ? (
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <ComparisonView
            metrics={comparisonData.metrics}
            trend={comparisonData.trend}
            campaignAName={campaignA.name}
            campaignBName={campaignB.name}
            loading={isLoading}
          />
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="skeleton-loader h-64 rounded-xl" />
          <div className="skeleton-loader h-72 rounded-xl" />
        </div>
      ) : (
        <div className="glass-card rounded-xl p-16 text-center opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <GitCompare className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Karşılaştırma için iki kampanya seçin</p>
          <p className="text-xs text-slate-600">Yukarıdaki seçicileri kullanarak karşılaştırmak istediğiniz kampanyaları belirleyin.</p>
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          📊 Karşılaştırma İpuçları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Aynı objective&apos;e sahip kampanyaları karşılaştırmak daha anlamlı sonuçlar verir.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-amber-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CPC ve CTR farkları hedefleme kalitesini, ROAS farkları ise landing page performansını gösterir.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Düşük performanslı kampanyada yüksek performanslının stratejisini uygulamayı değerlendirin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CampaignSelector({
  label,
  color,
  selectedCampaign,
  campaigns,
  search,
  onSearchChange,
  onSelect,
}: {
  label: string
  color: string
  selectedCampaign: { id: string; name: string; status: string; effectiveStatus: string; spend: number; objective: string } | undefined
  campaigns: Array<{ id: string; name: string; status: string; effectiveStatus: string; spend: number; objective: string }>
  search: string
  onSearchChange: (v: string) => void
  onSelect: (id: string) => void
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)] transition-colors">
          {selectedCampaign ? (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{selectedCampaign.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={selectedCampaign.effectiveStatus} type="effective" />
                <span className="text-[10px] text-slate-500">{formatCurrency(selectedCampaign.spend)}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Kampanya seçin...</span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[320px] border-[rgba(148,163,184,0.08)] bg-[#0c1220] p-2">
          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Kampanya ara..."
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-800/50 border border-[rgba(148,163,184,0.08)] rounded-md text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30"
            />
          </div>

          <div className="max-h-[240px] overflow-y-auto space-y-0.5">
            {campaigns.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => { onSelect(c.id); onSearchChange("") }}
                className="flex items-center gap-2 text-xs text-slate-300 focus:bg-slate-800 focus:text-white rounded-md px-2 py-2 cursor-pointer"
              >
                <Megaphone className="h-3 w-3 text-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{c.name}</p>
                  <p className="text-[10px] text-slate-600">{formatCurrency(c.spend)}</p>
                </div>
                <StatusBadge status={c.effectiveStatus} type="effective" />
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
