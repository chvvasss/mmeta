"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronRight,
  Pause,
  Play,
  Copy,
  Archive,
  Pencil,
  ExternalLink,
  MoreHorizontal,
  Layers,
  Target,
  MapPin,
  Users,
  Radio,
  Eye,
  MousePointerClick,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  CheckCircle2,
  Loader2 as Loader2Icon,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { useAdSets } from "@/hooks/use-adsets"
import { useAds } from "@/hooks/use-ads"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AnimatedCounter } from "@/components/shared/AnimatedCounter"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QUALITY_RANKINGS } from "@/lib/constants"
import { toast } from "sonner"

const FORMAT_ICONS: Record<string, typeof ImageIcon> = {
  CAROUSEL: Layers,
  SINGLE_IMAGE: ImageIcon,
  SINGLE_VIDEO: Radio,
}

export default function AdSetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: allAdSets, isLoading } = useAdSets()
  const adSet = useMemo(() => allAdSets?.find((a) => a.id === id), [allAdSets, id])
  const { data: ads, isLoading: adsLoading } = useAds(id)

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="skeleton-loader h-5 w-48" />
        <div className="skeleton-loader h-28 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-loader h-20 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!adSet) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Reklam Seti Bulunamadı</h2>
        <p className="text-sm text-slate-400 mb-6">Bu reklam seti silinmiş olabilir.</p>
        <Button variant="outline" onClick={() => router.push("/adsets")} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Reklam Setlerine Dön
        </Button>
      </div>
    )
  }

  const isActive = adSet.effectiveStatus === "ACTIVE"

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-cyan" style={{ top: "5%", right: "8%", width: "250px", height: "250px", opacity: 0.2 }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/campaigns" className="hover:text-blue-400 transition-colors">Kampanyalar</Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <Link href={`/campaigns/${adSet.campaignId}`} className="hover:text-blue-400 transition-colors truncate max-w-[160px]">
          {adSet.campaignName}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="text-slate-300 truncate max-w-[200px]">{adSet.name}</span>
      </nav>

      {/* Header */}
      <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
              <Layers className="h-6 w-6 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white truncate" style={{ fontFamily: "var(--font-heading)" }}>
                  {adSet.name}
                </h1>
                <StatusBadge status={adSet.effectiveStatus} type="effective" />
                {adSet.learningPhase && <StatusBadge status={adSet.learningPhase} type="learning" />}
              </div>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-purple-400" />
                  {adSet.optimizationGoal.replace(/_/g, " ")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  {adSet.targetingSummary}
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="h-3 w-3 text-amber-400" />
                  {adSet.placements}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.success(isActive ? "Reklam seti duraklatıldı" : "Reklam seti aktifleştirildi")}
              className={`gap-1.5 text-xs ${isActive
                ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20"
                : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                }`}
            >
              {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isActive ? "Duraklat" : "Aktifleştir"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
                  <Pencil className="h-3.5 w-3.5" /> Düzenle
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
                  <Copy className="h-3.5 w-3.5" /> Kopyala
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> Meta&apos;da Aç
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
                <DropdownMenuItem className="text-red-400 focus:bg-slate-800 focus:text-red-300 text-xs gap-2">
                  <Archive className="h-3.5 w-3.5" /> Arşivle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricTile label="Harcama" value={adSet.spend} formatter={formatCurrency} icon={DollarSign} color="#3b82f6" delay={120} />
        <MetricTile label="Gösterim" value={adSet.impressions} formatter={formatNumber} icon={Eye} color="#06b6d4" delay={160} />
        <MetricTile label="Tıklama" value={adSet.clicks} formatter={formatNumber} icon={MousePointerClick} color="#10b981" delay={200} />
        <MetricTile label="Dönüşüm" value={adSet.conversions} formatter={formatNumber} icon={ShoppingCart} color="#f59e0b" delay={240} />
        <MetricTile label="CPC" value={adSet.cpc} formatter={formatCurrency} icon={DollarSign} color="#8b5cf6" delay={280} />
        <MetricTile label="CTR" value={adSet.ctr} formatter={(v) => formatPercent(v)} icon={TrendingUp} color="#ec4899" delay={320} />
        <MetricTile label="Erişim" value={adSet.reach} formatter={formatNumber} icon={Users} color="#06b6d4" delay={360} />
        <MetricTile label="Frekans" value={adSet.frequency} formatter={(v) => v.toFixed(2)} icon={BarChart3} color="#f97316" delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ads section */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl opacity-0 animate-slide-up" style={{ animationDelay: "440ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <ImageIcon className="h-4 w-4 text-blue-400" />
                Reklamlar ({ads?.length || 0})
              </h3>
            </div>

            {adsLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-loader h-20 rounded-lg" />)}
              </div>
            ) : ads && ads.length > 0 ? (
              <div>
                {ads.map((ad) => {
                  const FormatIcon = FORMAT_ICONS[ad.creativeFormat] || ImageIcon
                  return (
                    <div key={ad.id} className="table-row-hover flex items-center gap-4 px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
                      {/* Creative format icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800/60">
                        <FormatIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/ads/${ad.id}`} className="text-sm font-medium text-white hover:text-blue-400 transition-colors truncate block">
                          {ad.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{ad.primaryText.slice(0, 60)}...</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={ad.effectiveStatus} type="effective" />
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-xs">
                        <div className="text-right w-16">
                          <p className="text-slate-500">Harcama</p>
                          <p className="font-semibold text-white">{formatCurrency(ad.spend)}</p>
                        </div>
                        <div className="text-right w-14">
                          <p className="text-slate-500">CTR</p>
                          <p className="font-semibold text-white">{formatPercent(ad.ctr)}</p>
                        </div>
                        <div className="text-right w-14">
                          <p className="text-slate-500">Dönüşüm</p>
                          <p className="font-semibold text-white">{ad.conversions}</p>
                        </div>
                      </div>
                      <Link href={`/ads/${ad.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <ImageIcon className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Bu reklam setinde reklam yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Targeting info */}
          <div className="glass-card rounded-xl p-5 space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hedefleme</h3>
            <div className="space-y-3">
              <DetailRow icon={MapPin} label="Hedefleme" value={adSet.targetingSummary} color="#06b6d4" />
              <DetailRow icon={Radio} label="Yerleşimler" value={adSet.placements} color="#f59e0b" />
              <DetailRow icon={Target} label="Optimizasyon" value={adSet.optimizationGoal.replace(/_/g, " ")} color="#8b5cf6" />
              <DetailRow icon={DollarSign} label="Faturalandırma" value={adSet.billingEvent} color="#10b981" />
              {adSet.dailyBudget && (
                <DetailRow icon={DollarSign} label="Günlük Bütçe" value={formatCurrency(adSet.dailyBudget)} color="#3b82f6" />
              )}
            </div>
          </div>

          {/* Learning Phase */}
          {adSet.learningPhase && (
            <div className="glass-card rounded-xl p-4 opacity-0 animate-slide-up" style={{ animationDelay: "520ms", animationFillMode: "forwards" }}>
              <LearningIndicator phase={adSet.learningPhase} />
            </div>
          )}

          {/* Ad Quality summary */}
          {ads && ads.length > 0 && (
            <div className="glass-card rounded-xl p-5 space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "560ms", animationFillMode: "forwards" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reklam Kalitesi</h3>
              {ads.map((ad) => (
                <div key={ad.id} className="space-y-1">
                  <p className="text-[11px] font-medium text-slate-300 truncate">{ad.name}</p>
                  <div className="flex items-center gap-2">
                    <QualityDot ranking={ad.qualityRanking} label="Kalite" />
                    <QualityDot ranking={ad.engagementRanking} label="Etkileşim" />
                    <QualityDot ranking={ad.conversionRanking} label="Dönüşüm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricTile({ label, value, formatter, icon: Icon, color, delay }: {
  label: string; value: number; formatter: (v: number) => string; icon: typeof DollarSign; color: string; delay: number
}) {
  return (
    <div className="glass-card rounded-xl p-4 opacity-0 animate-slide-up" style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-3 w-3" style={{ color }} />
        </div>
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
      <AnimatedCounter value={value} formatter={formatter} className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }} />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3 w-3 mt-0.5 shrink-0" style={{ color }} />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-600">{label}</p>
        <p className="text-[11px] font-medium text-slate-300 break-words">{value}</p>
      </div>
    </div>
  )
}

function LearningIndicator({ phase }: { phase: string }) {
  const cfg = {
    LEARNING: { icon: Loader2Icon, color: "#3b82f6", label: "Öğreniyor", spin: true },
    SUCCESS: { icon: CheckCircle2, color: "#10b981", label: "Tamamlandı", spin: false },
    FAIL: { icon: AlertTriangle, color: "#f97316", label: "Sınırlı", spin: false },
  }[phase]
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${cfg.spin ? "animate-spin" : ""}`} style={{ color: cfg.color }} />
      <div>
        <p className="text-xs font-semibold text-white">Öğrenme: {cfg.label}</p>
        <p className="text-[10px] text-slate-500">Performans optimizasyonu durumu</p>
      </div>
    </div>
  )
}

function QualityDot({ ranking, label }: { ranking: string; label: string }) {
  const color = ranking.includes("ABOVE") ? "#10b981" : ranking === "AVERAGE" ? "#f59e0b" : "#ef4444"
  const text = QUALITY_RANKINGS[ranking as keyof typeof QUALITY_RANKINGS] || ranking
  return (
    <div className="flex items-center gap-1">
      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  )
}
