"use client"

import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useMemo } from "react"

interface Insight {
  id: string
  type: "opportunity" | "warning" | "positive"
  title: string
  description: string
  action: string
  href: string
}

export function SmartInsights() {
  const { data: campaigns } = useCampaigns()

  const insights = useMemo<Insight[]>(() => {
    if (!campaigns || campaigns.length === 0) return []

    const results: Insight[] = []

    // Find best performing campaign
    const bestRoas = campaigns.reduce((best, c) =>
      (c.roas || 0) > (best.roas || 0) ? c : best, campaigns[0])

    if (bestRoas && (bestRoas.roas || 0) > 4) {
      results.push({
        id: "scale-up",
        type: "opportunity",
        title: "Olcekleme Firsati",
        description: `"${bestRoas.name}" kampanyasi ${bestRoas.roas}x ROAS ile en iyi performansi gosteriyor. Butce artisi degerlendirebilirsiniz.`,
        action: "Kampanyayi Gor",
        href: `/campaigns/${bestRoas.id}`,
      })
    }

    // Find underperforming campaigns
    const withIssues = campaigns.filter(c => c.effectiveStatus === "WITH_ISSUES")
    if (withIssues.length > 0) {
      results.push({
        id: "issues",
        type: "warning",
        title: `${withIssues.length} Kampanyada Sorun`,
        description: `${withIssues.map(c => `"${c.name}"`).join(", ")} kampanyalarinda sorunlar tespit edildi.`,
        action: "Incele",
        href: "/campaigns",
      })
    }

    // High CPC warning
    const highCpc = campaigns.filter(c => c.cpc > 3 && c.effectiveStatus === "ACTIVE")
    if (highCpc.length > 0) {
      results.push({
        id: "high-cpc",
        type: "warning",
        title: "Yuksek CPC Uyarisi",
        description: `${highCpc.length} aktif kampanyada CPC 3 TL'nin uzerinde. Hedefleme optimizasyonu onerilir.`,
        action: "Kampanyalari Gor",
        href: "/campaigns",
      })
    }

    // Positive trend
    const activeCampaigns = campaigns.filter(c => c.effectiveStatus === "ACTIVE")
    if (activeCampaigns.length >= 5) {
      results.push({
        id: "active-count",
        type: "positive",
        title: "Aktif Performans",
        description: `${activeCampaigns.length} kampanya aktif olarak calisiyor. Genel performans stabil.`,
        action: "Dashboard",
        href: "/",
      })
    }

    // Learning phase warning
    const learning = campaigns.filter(c => c.learningPhase === "FAIL")
    if (learning.length > 0) {
      results.push({
        id: "learning-fail",
        type: "warning",
        title: "Ogrenme Sinirli",
        description: `${learning.length} kampanya ogrenme surecini tamamlayamadi. Haftalik 50+ donusum hedefleyin.`,
        action: "Detay",
        href: "/campaigns",
      })
    }

    return results.slice(0, 4)
  }, [campaigns])

  if (insights.length === 0) return null

  const iconMap = {
    opportunity: { Icon: Lightbulb, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    warning: { Icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    positive: { Icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Akilli Oneriler
        </h3>
        <Link href="/analytics" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
          Tumu
        </Link>
      </div>
      <div className="space-y-2">
        {insights.map((insight) => {
          const { Icon, color } = iconMap[insight.type]
          return (
            <Link
              key={insight.id}
              href={insight.href}
              className="group flex items-start gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.04]"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white">{insight.title}</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 line-clamp-2">{insight.description}</p>
              </div>
              <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
