"use client"

import { use, useState } from "react"
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Target,
  Zap,
  Calendar,
  Clock,
  BarChart3,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreHorizontal,
  Megaphone,
  Users,
  CircleDot,
  GaugeCircle,
} from "lucide-react"
import { useCampaignDetail } from "@/hooks/use-campaign-detail"
import { useAdSets } from "@/hooks/use-adsets"
import { SpendChart } from "@/components/dashboard/SpendChart"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AnimatedCounter } from "@/components/shared/AnimatedCounter"
import { formatCurrency, formatNumber, formatPercent, formatDate, formatRelativeTime } from "@/lib/formatting"
import { CAMPAIGN_OBJECTIVES, BID_STRATEGIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const OBJECTIVE_ICONS: Record<string, typeof Target> = {
  OUTCOME_SALES: ShoppingCart,
  OUTCOME_TRAFFIC: MousePointerClick,
  OUTCOME_ENGAGEMENT: Zap,
  OUTCOME_LEADS: Users,
  OUTCOME_AWARENESS: Megaphone,
  OUTCOME_APP_PROMOTION: CircleDot,
}

const OBJECTIVE_COLORS: Record<string, string> = {
  OUTCOME_SALES: "#10b981",
  OUTCOME_TRAFFIC: "#3b82f6",
  OUTCOME_ENGAGEMENT: "#f59e0b",
  OUTCOME_LEADS: "#8b5cf6",
  OUTCOME_AWARENESS: "#06b6d4",
  OUTCOME_APP_PROMOTION: "#ec4899",
}

function OpportunityGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r="36" fill="none"
          stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{score}</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">skor</span>
      </div>
    </div>
  )
}

function LearningPhaseIndicator({ phase }: { phase: string | null }) {
  if (!phase) return null

  const config = {
    LEARNING: { icon: Loader2, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "Öğrenme Aşamasında", desc: "Sistem optimizasyon yapıyor. ~50 dönüşüm sonrası tamamlanır.", spin: true },
    SUCCESS: { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Öğrenme Tamamlandı", desc: "Yayın optimizasyonu başarılı. Performans stabil.", spin: false },
    FAIL: { icon: AlertTriangle, color: "#f97316", bg: "rgba(249,115,22,0.1)", label: "Öğrenme Sınırlı", desc: "Yeterli dönüşüm alınamadı. Bütçe veya hedeflemeyi gözden geçirin.", spin: false },
  }[phase] || null

  if (!config) return null
  const Icon = config.icon

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: config.bg }}>
          <Icon className={`h-4 w-4 ${config.spin ? "animate-spin" : ""}`} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white">{config.label}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{config.desc}</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, formatter, icon: Icon, color, delay }: {
  label: string
  value: number
  formatter: (v: number) => string
  icon: typeof DollarSign
  color: string
  delay: number
}) {
  return (
    <div
      className="glass-card rounded-xl p-4 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-3 w-3" style={{ color }} />
        </div>
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
      </div>
      <AnimatedCounter
        value={value}
        formatter={formatter}
        className="text-lg font-bold text-white"
        style={{ fontFamily: "var(--font-heading)" }}
      />
    </div>
  )
}

function AdSetRow({ adSet }: { adSet: { id: string; name: string; status: string; effectiveStatus: string; dailyBudget: number | null; spend: number; impressions: number; clicks: number; cpc: number; ctr: number; conversions: number; reach: number; frequency: number; learningPhase: string | null; targetingSummary: string; placements: string } }) {
  return (
    <div className="table-row-hover flex items-center gap-4 px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
      <div className="flex-1 min-w-0">
        <Link
          href={`/adsets/${adSet.id}`}
          className="text-sm font-medium text-white hover:text-blue-400 transition-colors truncate block"
        >
          {adSet.name}
        </Link>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{adSet.targetingSummary}</p>
      </div>
      <div className="flex items-center gap-1">
        <StatusBadge status={adSet.effectiveStatus} type="effective" />
        {adSet.learningPhase && (
          <StatusBadge status={adSet.learningPhase} type="learning" />
        )}
      </div>
      <div className="hidden lg:flex items-center gap-6 text-xs">
        <div className="text-right w-20">
          <p className="text-slate-500">Harcama</p>
          <p className="font-semibold text-white">{formatCurrency(adSet.spend)}</p>
        </div>
        <div className="text-right w-16">
          <p className="text-slate-500">Tıklama</p>
          <p className="font-semibold text-white">{formatNumber(adSet.clicks)}</p>
        </div>
        <div className="text-right w-14">
          <p className="text-slate-500">CPC</p>
          <p className="font-semibold text-white">{formatCurrency(adSet.cpc)}</p>
        </div>
        <div className="text-right w-14">
          <p className="text-slate-500">CTR</p>
          <p className="font-semibold text-white">{formatPercent(adSet.ctr)}</p>
        </div>
        <div className="text-right w-16">
          <p className="text-slate-500">Dönüşüm</p>
          <p className="font-semibold text-white">{formatNumber(adSet.conversions)}</p>
        </div>
      </div>
      <div className="text-right w-14 hidden md:block">
        <p className="text-[11px] text-slate-500">Frekans</p>
        <p className="text-xs font-semibold text-white">{adSet.frequency.toFixed(2)}</p>
      </div>
      <Link
        href={`/adsets/${adSet.id}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading, error } = useCampaignDetail(id)
  const { data: adSets, isLoading: adSetsLoading } = useAdSets(id)
  const [activeTab, setActiveTab] = useState<"overview" | "adsets">("overview")

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="skeleton-loader h-8 w-8 rounded-lg" />
          <div className="skeleton-loader h-5 w-64" />
        </div>
        <div className="skeleton-loader h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-loader h-24 rounded-xl" />
          ))}
        </div>
        <div className="skeleton-loader h-80 rounded-xl" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Kampanya Bulunamadı</h2>
        <p className="text-sm text-slate-400 mb-6">Bu kampanya silinmiş veya erişim izniniz olmayabilir.</p>
        <Button variant="outline" onClick={() => router.push("/campaigns")} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Kampanyalara Dön
        </Button>
      </div>
    )
  }

  const { campaign, dailyInsights } = data
  const ObjectiveIcon = OBJECTIVE_ICONS[campaign.objective] || Target
  const objectiveColor = OBJECTIVE_COLORS[campaign.objective] || "#3b82f6"
  const objectiveLabel = CAMPAIGN_OBJECTIVES[campaign.objective as keyof typeof CAMPAIGN_OBJECTIVES] || campaign.objective
  const bidStrategyLabel = BID_STRATEGIES[campaign.bidStrategy as keyof typeof BID_STRATEGIES] || campaign.bidStrategy
  const isActive = campaign.effectiveStatus === "ACTIVE"

  const handleStatusToggle = () => {
    toast.success(isActive ? "Kampanya duraklatıldı" : "Kampanya aktifleştirildi")
  }

  const handleDuplicate = () => {
    toast.success("Kampanya kopyalandı")
  }

  const handleArchive = () => {
    toast.success("Kampanya arşivlendi")
    router.push("/campaigns")
  }

  return (
    <div className="relative space-y-6 p-6">
      {/* Atmospheric orbs */}
      <div className="orb orb-blue" style={{ top: "5%", right: "10%", width: "300px", height: "300px", opacity: 0.25 }} />
      <div className="orb orb-cyan" style={{ bottom: "15%", left: "5%", width: "200px", height: "200px", opacity: 0.15 }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/campaigns" className="hover:text-blue-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Kampanyalar
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="text-slate-300 truncate max-w-[300px]">{campaign.name}</span>
      </nav>

      {/* Campaign Header */}
      <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            {/* Objective icon */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${objectiveColor}15` }}
            >
              <ObjectiveIcon className="h-6 w-6" style={{ color: objectiveColor }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white truncate" style={{ fontFamily: "var(--font-heading)" }}>
                  {campaign.name}
                </h1>
                <StatusBadge status={campaign.effectiveStatus} type="effective" />
                {campaign.learningPhase && (
                  <StatusBadge status={campaign.learningPhase} type="learning" />
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" style={{ color: objectiveColor }} />
                  {objectiveLabel}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-500" />
                  {campaign.budgetType === "DAILY" ? "Günlük" : "Ömür Boyu"}: {formatCurrency(campaign.dailyBudget || 0)}
                </span>
                <span className="flex items-center gap-1">
                  <GaugeCircle className="h-3 w-3 text-amber-500" />
                  {bidStrategyLabel}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-600" />
                  {formatDate(campaign.startTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleStatusToggle}
              className={`gap-1.5 text-xs ${isActive
                ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20"
                : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                }`}
              variant="ghost"
            >
              {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isActive ? "Duraklat" : "Aktifleştir"}
            </Button>

            <Link href={`/campaigns/create?edit=${id}`}>
              <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800">
                <Pencil className="h-3.5 w-3.5" />
                Düzenle
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-[rgba(148,163,184,0.08)] bg-[#0c1220]">
                <DropdownMenuItem onClick={handleDuplicate} className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
                  <Copy className="h-3.5 w-3.5" /> Kopyala
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> Meta&apos;da Aç
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
                <DropdownMenuItem onClick={handleArchive} className="text-red-400 focus:bg-slate-800 focus:text-red-300 text-xs gap-2">
                  <Archive className="h-3.5 w-3.5" /> Arşivle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Harcama" value={campaign.spend} formatter={formatCurrency} icon={DollarSign} color="#3b82f6" delay={120} />
        <MetricCard label="Gösterim" value={campaign.impressions} formatter={formatNumber} icon={Eye} color="#06b6d4" delay={160} />
        <MetricCard label="Tıklama" value={campaign.clicks} formatter={formatNumber} icon={MousePointerClick} color="#10b981" delay={200} />
        <MetricCard label="Dönüşüm" value={campaign.conversions} formatter={formatNumber} icon={ShoppingCart} color="#f59e0b" delay={240} />
        <MetricCard label="CPC" value={campaign.cpc} formatter={formatCurrency} icon={DollarSign} color="#8b5cf6" delay={280} />
        <MetricCard label="CTR" value={campaign.ctr} formatter={(v) => formatPercent(v)} icon={TrendingUp} color="#ec4899" delay={320} />
        <MetricCard label="ROAS" value={campaign.roas} formatter={(v) => v.toFixed(2) + "x"} icon={BarChart3} color="#10b981" delay={360} />
        <MetricCard
          label="Bütçe Kullanım"
          value={campaign.dailyBudget ? Math.min((campaign.spend / (campaign.dailyBudget * 7)) * 100, 100) : 0}
          formatter={(v) => `%${v.toFixed(0)}`}
          icon={GaugeCircle}
          color="#f97316"
          delay={400}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(148,163,184,0.06)] opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <button
          onClick={() => setActiveTab("overview")}
          className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${activeTab === "overview" ? "text-blue-400 tab-active" : "text-slate-500 hover:text-slate-300"
            }`}
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Genel Bakış
          </span>
        </button>
        <button
          onClick={() => setActiveTab("adsets")}
          className={`relative px-4 py-2.5 text-xs font-medium transition-colors ${activeTab === "adsets" ? "text-blue-400 tab-active" : "text-slate-500 hover:text-slate-300"
            }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Reklam Setleri
            {adSets && (
              <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-800 px-1.5 text-[10px] font-bold text-slate-400">
                {adSets.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main chart area */}
          <div className="lg:col-span-2 space-y-6">
            <SpendChart data={dailyInsights} />

            {/* Ad Sets preview */}
            <div className="glass-card rounded-xl opacity-0 animate-slide-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <Layers className="h-4 w-4 text-blue-400" />
                  Reklam Setleri
                </h3>
                <button
                  onClick={() => setActiveTab("adsets")}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  Tümünü Gör <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {adSetsLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton-loader h-16 rounded-lg" />
                  ))}
                </div>
              ) : adSets && adSets.length > 0 ? (
                <div>
                  {adSets.slice(0, 3).map((adSet) => (
                    <AdSetRow key={adSet.id} adSet={adSet} />
                  ))}
                  {adSets.length > 3 && (
                    <div className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => setActiveTab("adsets")}
                        className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        +{adSets.length - 3} reklam seti daha
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Layers className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Bu kampanyada reklam seti yok</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            {/* Opportunity Score */}
            {campaign.opportunityScore !== null && (
              <div className="glass-card rounded-xl p-5 text-center opacity-0 animate-slide-up" style={{ animationDelay: "440ms", animationFillMode: "forwards" }}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Fırsat Skoru</h3>
                <div className="flex justify-center">
                  <OpportunityGauge score={campaign.opportunityScore} />
                </div>
                <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                  {campaign.opportunityScore >= 80
                    ? "Mükemmel performans. Ölçekleme fırsatını değerlendirin."
                    : campaign.opportunityScore >= 60
                      ? "İyi performans. Küçük optimizasyonlarla iyileştirilebilir."
                      : "Dikkat gerekli. Hedefleme ve kreatiflerinizi gözden geçirin."}
                </p>
              </div>
            )}

            {/* Learning Phase */}
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
              <LearningPhaseIndicator phase={campaign.learningPhase} />
            </div>

            {/* Campaign Details */}
            <div className="glass-card rounded-xl p-5 space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "520ms", animationFillMode: "forwards" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kampanya Bilgileri</h3>

              <div className="space-y-3">
                <InfoRow icon={Target} label="Hedef" value={objectiveLabel} color={objectiveColor} />
                <InfoRow icon={DollarSign} label="Bütçe Tipi" value={campaign.budgetType === "DAILY" ? "Günlük" : "Ömür Boyu"} color="#10b981" />
                <InfoRow icon={DollarSign} label="Günlük Bütçe" value={formatCurrency(campaign.dailyBudget || 0)} color="#10b981" />
                <InfoRow icon={GaugeCircle} label="Teklif Stratejisi" value={bidStrategyLabel} color="#f59e0b" />
                <InfoRow icon={Calendar} label="Başlangıç" value={formatDate(campaign.startTime)} color="#3b82f6" />
                <InfoRow icon={Calendar} label="Bitiş" value={campaign.endTime ? formatDate(campaign.endTime) : "Belirsiz"} color="#3b82f6" />
                <InfoRow icon={Clock} label="Son Güncelleme" value={formatRelativeTime(campaign.updatedTime)} color="#64748b" />
                <InfoRow icon={Layers} label="Reklam Setleri" value={String(campaign.adSetCount)} color="#8b5cf6" />
                <InfoRow icon={Megaphone} label="Reklamlar" value={String(campaign.adCount)} color="#ec4899" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="glass-card rounded-xl p-4 opacity-0 animate-slide-up" style={{ animationDelay: "560ms", animationFillMode: "forwards" }}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Hızlı İşlemler</h3>
              <div className="space-y-1.5">
                <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                  Bütçeyi %20 Artır
                </button>
                <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
                  <Copy className="h-3.5 w-3.5 text-cyan-400" />
                  A/B Test Kopyası Oluştur
                </button>
                <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all">
                  <TrendingDown className="h-3.5 w-3.5 text-amber-400" />
                  Düşük Performanslıları Duraklat
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Ad Sets Tab */
        <div className="glass-card rounded-xl opacity-0 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <Layers className="h-4 w-4 text-blue-400" />
                Reklam Setleri ({adSets?.length || 0})
              </h3>
              <Link href="/adsets/create">
                <Button size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white">
                  + Yeni Reklam Seti
                </Button>
              </Link>
            </div>
          </div>

          {adSetsLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton-loader h-16 rounded-lg" />
              ))}
            </div>
          ) : adSets && adSets.length > 0 ? (
            <div>
              {/* Column headers */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-2 border-b border-[rgba(148,163,184,0.04)] text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                <div className="flex-1">Reklam Seti</div>
                <div className="w-32">Durum</div>
                <div className="w-20 text-right">Harcama</div>
                <div className="w-16 text-right">Tıklama</div>
                <div className="w-14 text-right">CPC</div>
                <div className="w-14 text-right">CTR</div>
                <div className="w-16 text-right">Dönüşüm</div>
                <div className="w-14 text-right">Frekans</div>
                <div className="w-7" />
              </div>
              {adSets.map((adSet) => (
                <AdSetRow key={adSet.id} adSet={adSet} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Layers className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">Reklam seti bulunamadı</p>
              <p className="text-xs text-slate-600">Bu kampanya için henüz reklam seti oluşturulmamış.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-3 w-3" style={{ color }} />
        <span className="text-[11px] text-slate-500">{label}</span>
      </div>
      <span className="text-[11px] font-medium text-slate-300">{value}</span>
    </div>
  )
}
