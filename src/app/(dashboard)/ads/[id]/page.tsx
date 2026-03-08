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
  Image as ImageIcon,
  Layers,
  Radio,
  Eye,
  MousePointerClick,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Target,
  Link2,
  Type,
  Sparkles,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
} from "lucide-react"
import { useAds } from "@/hooks/use-ads"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { AnimatedCounter } from "@/components/shared/AnimatedCounter"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatting"
import { QUALITY_RANKINGS, CTA_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

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
}

const RANKING_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  ABOVE_AVERAGE_35: { label: "Ortalamanın Üstünde", color: "#10b981", icon: CheckCircle2 },
  AVERAGE: { label: "Ortalama", color: "#f59e0b", icon: MinusCircle },
  BELOW_AVERAGE_35: { label: "Ortalamanın Altında", color: "#ef4444", icon: AlertTriangle },
  BELOW_AVERAGE_10: { label: "Düşük", color: "#ef4444", icon: XCircle },
}

export default function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: allAds, isLoading } = useAds()
  const ad = useMemo(() => allAds?.find((a) => a.id === id), [allAds, id])

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="skeleton-loader h-5 w-48" />
        <div className="skeleton-loader h-32 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-loader h-20 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Reklam Bulunamadı</h2>
        <p className="text-sm text-slate-400 mb-6">Bu reklam silinmiş olabilir.</p>
        <Button variant="outline" onClick={() => router.push("/ads")} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Reklamlara Dön
        </Button>
      </div>
    )
  }

  const FormatIcon = FORMAT_ICONS[ad.creativeFormat] || ImageIcon
  const formatColor = FORMAT_COLORS[ad.creativeFormat] || "#64748b"
  const ctaLabel = CTA_TYPES[ad.ctaType as keyof typeof CTA_TYPES] || ad.ctaType
  const isActive = ad.effectiveStatus === "ACTIVE"

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "8%", width: "250px", height: "250px", opacity: 0.2 }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/campaigns" className="hover:text-blue-400 transition-colors">Kampanyalar</Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <Link href={`/campaigns/${ad.campaignId}`} className="hover:text-blue-400 transition-colors">Kampanya</Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <Link href={`/adsets/${ad.adSetId}`} className="hover:text-blue-400 transition-colors truncate max-w-[120px]">
          {ad.adSetName}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="text-slate-300 truncate max-w-[180px]">{ad.name}</span>
      </nav>

      {/* Header */}
      <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${formatColor}15` }}>
              <FormatIcon className="h-6 w-6" style={{ color: formatColor }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white truncate" style={{ fontFamily: "var(--font-heading)" }}>
                  {ad.name}
                </h1>
                <StatusBadge status={ad.effectiveStatus} type="effective" />
                <span className="text-[10px] rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: `${formatColor}15`, color: formatColor }}>
                  {FORMAT_LABELS[ad.creativeFormat]}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <Link href={`/adsets/${ad.adSetId}`} className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Layers className="h-3 w-3 text-purple-400" />
                  {ad.adSetName}
                </Link>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-cyan-400" />
                  CTA: {ctaLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.success(isActive ? "Reklam duraklatıldı" : "Reklam aktifleştirildi")}
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
        <MetricTile label="Harcama" value={ad.spend} formatter={formatCurrency} icon={DollarSign} color="#3b82f6" delay={120} />
        <MetricTile label="Gösterim" value={ad.impressions} formatter={formatNumber} icon={Eye} color="#06b6d4" delay={160} />
        <MetricTile label="Tıklama" value={ad.clicks} formatter={formatNumber} icon={MousePointerClick} color="#10b981" delay={200} />
        <MetricTile label="Dönüşüm" value={ad.conversions} formatter={formatNumber} icon={ShoppingCart} color="#f59e0b" delay={240} />
        <MetricTile label="CPC" value={ad.cpc} formatter={formatCurrency} icon={DollarSign} color="#8b5cf6" delay={280} />
        <MetricTile label="CTR" value={ad.ctr} formatter={(v) => formatPercent(v)} icon={TrendingUp} color="#ec4899" delay={320} />
        <MetricTile label="CPM" value={ad.impressions > 0 ? (ad.spend / ad.impressions) * 1000 : 0} formatter={formatCurrency} icon={BarChart3} color="#f97316" delay={360} />
        <MetricTile label="CPA" value={ad.conversions > 0 ? ad.spend / ad.conversions : 0} formatter={formatCurrency} icon={Target} color="#06b6d4" delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creative Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-xl overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: "440ms", animationFillMode: "forwards" }}>
            <div className="px-4 py-3 border-b border-[rgba(148,163,184,0.06)]">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <Sparkles className="h-4 w-4 text-amber-400" />
                Kreatif Önizleme
              </h3>
            </div>

            {/* Mock creative preview */}
            <div className="p-4">
              <div className="rounded-xl border border-[rgba(148,163,184,0.08)] overflow-hidden">
                {/* Creative preview placeholder */}
                <div className="h-56 bg-gradient-to-br from-slate-800/60 to-slate-900/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <FormatIcon className="h-12 w-12 text-slate-700" />
                    <span className="text-xs text-slate-600 font-medium">
                      {FORMAT_LABELS[ad.creativeFormat]} Önizleme
                    </span>
                  </div>
                </div>

                {/* Ad content */}
                <div className="p-4 space-y-3 bg-[rgba(12,18,32,0.4)]">
                  <p className="text-sm text-slate-300 leading-relaxed">{ad.primaryText}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(148,163,184,0.06)]">
                    <div>
                      <p className="text-xs font-semibold text-white">{ad.headline}</p>
                      <p className="text-[10px] text-slate-600">example.com</p>
                    </div>
                    <span className="rounded-md bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
                      {ctaLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UTM & Tracking */}
          <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              <Link2 className="h-4 w-4 text-cyan-400" />
              UTM & Tracking
            </h3>
            <div className="space-y-2">
              <UTMRow label="utm_source" value="facebook" />
              <UTMRow label="utm_medium" value="paid_social" />
              <UTMRow label="utm_campaign" value={ad.name.toLowerCase().replace(/\s+/g, "_").replace(/[—]/g, "-")} />
              <UTMRow label="utm_content" value={ad.id} />
            </div>
            <div className="mt-3 pt-3 border-t border-[rgba(148,163,184,0.06)]">
              <p className="text-[10px] text-slate-600 break-all">
                https://example.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign={ad.name.toLowerCase().replace(/\s+/g, "_").slice(0, 30)}&utm_content={ad.id}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quality Rankings */}
          <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "480ms", animationFillMode: "forwards" }}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Kalite Diagnostik</h3>
            <div className="space-y-4">
              <RankingRow label="Kalite Sıralaması" ranking={ad.qualityRanking} />
              <RankingRow label="Etkileşim Sıralaması" ranking={ad.engagementRanking} />
              <RankingRow label="Dönüşüm Sıralaması" ranking={ad.conversionRanking} />
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(148,163,184,0.06)]">
              <OverallScore quality={ad.qualityRanking} engagement={ad.engagementRanking} conversion={ad.conversionRanking} />
            </div>
          </div>

          {/* Ad Details */}
          <div className="glass-card rounded-xl p-5 space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "520ms", animationFillMode: "forwards" }}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reklam Bilgileri</h3>
            <InfoRow icon={FormatIcon} label="Kreatif Format" value={FORMAT_LABELS[ad.creativeFormat]} color={formatColor} />
            <InfoRow icon={Type} label="Başlık" value={ad.headline} color="#3b82f6" />
            <InfoRow icon={Target} label="CTA" value={ctaLabel} color="#10b981" />
            <InfoRow icon={Layers} label="Reklam Seti" value={ad.adSetName} color="#8b5cf6" />
          </div>

          {/* Recommendations */}
          <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: "560ms", animationFillMode: "forwards" }}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Öneriler</h3>
            <div className="space-y-2">
              {ad.conversionRanking.includes("BELOW") && (
                <Recommendation text="Dönüşüm oranını artırmak için farklı CTA ve landing page deneyin." type="warning" />
              )}
              {ad.ctr < 1.0 && (
                <Recommendation text="CTR düşük. Kreatif ve hedeflemeyi gözden geçirin." type="warning" />
              )}
              {ad.qualityRanking.includes("ABOVE") && (
                <Recommendation text="Kalite skoru yüksek! Bu kreatifi ölçeklendirmeyi düşünün." type="success" />
              )}
              {ad.cpc > 3 && (
                <Recommendation text="CPC ortalamanın üstünde. Hedef kitleyi daraltmayı deneyin." type="info" />
              )}
            </div>
          </div>
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

function InfoRow({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
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

function UTMRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[rgba(148,163,184,0.04)]">
      <code className="text-[11px] text-cyan-400 font-mono">{label}</code>
      <code className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">{value}</code>
    </div>
  )
}

function RankingRow({ label, ranking }: { label: string; ranking: string }) {
  const cfg = RANKING_CONFIG[ranking] || { label: ranking, color: "#64748b", icon: MinusCircle }
  const Icon = cfg.icon

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
        <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
      </div>
    </div>
  )
}

function OverallScore({ quality, engagement, conversion }: { quality: string; engagement: string; conversion: string }) {
  const scoreMap: Record<string, number> = { ABOVE_AVERAGE_35: 3, AVERAGE: 2, BELOW_AVERAGE_35: 1, BELOW_AVERAGE_10: 0 }
  const total = (scoreMap[quality] || 0) + (scoreMap[engagement] || 0) + (scoreMap[conversion] || 0)
  const maxScore = 9
  const pct = (total / maxScore) * 100

  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444"
  const label = pct >= 70 ? "İyi" : pct >= 40 ? "Orta" : "Düşük"

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">Genel Skor</span>
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function Recommendation({ text, type }: { text: string; type: "success" | "warning" | "info" }) {
  const colors = {
    success: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)", text: "#10b981" },
    warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)", text: "#f59e0b" },
    info: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.15)", text: "#3b82f6" },
  }[type]

  return (
    <div
      className="rounded-lg px-3 py-2 text-[11px] leading-relaxed border"
      style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
    >
      {text}
    </div>
  )
}
