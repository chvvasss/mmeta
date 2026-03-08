"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  ChevronLeft,
  Globe,
  Heart,
  FileText,
  Video,
  Mail,
  UserPlus,
  Copy,
  Search,
  ChevronDown,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  Zap,
} from "lucide-react"
import { useAudiences, useCreateAudience } from "@/hooks/use-audiences"

// ── Audience source types ──
type AudienceType = "custom" | "lookalike"

interface CustomSource {
  key: string
  label: string
  description: string
  icon: typeof Globe
  color: string
}

const CUSTOM_SOURCES: CustomSource[] = [
  { key: "website", label: "Website Ziyaretçileri", description: "Web sitenizi ziyaret eden kullanıcıları hedefleyin", icon: Globe, color: "#3b82f6" },
  { key: "customer_list", label: "Müşteri Listesi", description: "CRM veya e-posta listenizi yükleyin", icon: FileText, color: "#8b5cf6" },
  { key: "engagement", label: "Facebook Etkileşim", description: "Facebook içerikleriyle etkileşime giren kullanıcılar", icon: UserPlus, color: "#06b6d4" },
  { key: "video", label: "Video İzleyenler", description: "Videolarınızı izleyen kullanıcıları hedefleyin", icon: Video, color: "#f59e0b" },
  { key: "instagram", label: "Instagram Etkileşim", description: "Instagram profilinizle etkileşime giren kullanıcılar", icon: Heart, color: "#ec4899" },
  { key: "lead_form", label: "Lead Form", description: "Lead generation formunu dolduran kullanıcılar", icon: Mail, color: "#10b981" },
]

const RETENTION_OPTIONS = [7, 14, 30, 60, 90, 180, 365]

const WEBSITE_RULES = [
  { key: "all_visitors", label: "Tüm Ziyaretçiler" },
  { key: "specific_pages", label: "Belirli Sayfaları Ziyaret Edenler" },
  { key: "time_spent", label: "Belirli Süre Harcayanlar" },
  { key: "frequency", label: "Belirli Sıklıkta Ziyaret Edenler" },
]

const VIDEO_RULES = [
  { key: "3s", label: "En az 3 saniye izleyenler" },
  { key: "10s", label: "En az 10 saniye izleyenler" },
  { key: "25p", label: "%25 ve üzerini izleyenler" },
  { key: "50p", label: "%50 ve üzerini izleyenler" },
  { key: "75p", label: "%75 ve üzerini izleyenler" },
  { key: "95p", label: "%95 ve üzerini izleyenler" },
]

const ENGAGEMENT_RULES = [
  { key: "page_engaged", label: "Sayfayla herhangi bir etkileşim" },
  { key: "post_engaged", label: "Bir gönderiyle etkileşim" },
  { key: "ad_engaged", label: "Bir reklama tıklama" },
  { key: "cta_click", label: "CTA butonuna tıklama" },
  { key: "page_messaged", label: "Sayfaya mesaj gönderme" },
]

const COUNTRIES = [
  { code: "TR", name: "Türkiye" },
  { code: "US", name: "Amerika Birleşik Devletleri" },
  { code: "GB", name: "Birleşik Krallık" },
  { code: "DE", name: "Almanya" },
  { code: "FR", name: "Fransa" },
  { code: "NL", name: "Hollanda" },
  { code: "AE", name: "Birleşik Arap Emirlikleri" },
  { code: "SA", name: "Suudi Arabistan" },
]

export default function CreateAudiencePage() {
  const router = useRouter()
  const createAudience = useCreateAudience()

  // Step management
  const [step, setStep] = useState(1)
  const [audienceType, setAudienceType] = useState<AudienceType | null>(null)

  // Custom audience state
  const [customSource, setCustomSource] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [retentionDays, setRetentionDays] = useState(30)
  const [websiteRule, setWebsiteRule] = useState("all_visitors")
  const [urlContains, setUrlContains] = useState("")
  const [videoRule, setVideoRule] = useState("75p")
  const [engagementRule, setEngagementRule] = useState("page_engaged")

  // Lookalike state
  const [sourceAudienceId, setSourceAudienceId] = useState("")
  const [lookalikePercent, setLookalikePercent] = useState(1)
  const [country, setCountry] = useState("TR")
  const [audienceSearch, setAudienceSearch] = useState("")

  // Fetch existing audiences for lookalike source selection
  const { data: existingAudiences } = useAudiences("custom")

  const filteredAudiences = useMemo(() => {
    if (!existingAudiences) return []
    if (!audienceSearch) return existingAudiences
    return existingAudiences.filter(a => a.name.toLowerCase().includes(audienceSearch.toLowerCase()))
  }, [existingAudiences, audienceSearch])

  const selectedSourceAudience = useMemo(
    () => existingAudiences?.find(a => a.id === sourceAudienceId),
    [existingAudiences, sourceAudienceId]
  )

  const canProceedStep2 = audienceType !== null
  const canProceedStep3 = audienceType === "custom" ? customSource !== null : sourceAudienceId !== ""
  const canSubmit = name.trim() !== ""

  const handleSubmit = async () => {
    const payload: Record<string, unknown> = {
      name,
      description,
      type: audienceType,
    }

    if (audienceType === "custom") {
      payload.source = customSource
      payload.retentionDays = retentionDays
      if (customSource === "website") {
        payload.rule = websiteRule
        if (websiteRule === "specific_pages") payload.urlContains = urlContains
      } else if (customSource === "video") {
        payload.rule = videoRule
      } else if (customSource === "engagement") {
        payload.rule = engagementRule
      }
    } else {
      payload.sourceAudienceId = sourceAudienceId
      payload.lookalikePercent = lookalikePercent
      payload.country = country
    }

    try {
      await createAudience.mutateAsync(payload)
      router.push("/audiences")
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "15%", width: "280px", height: "280px", opacity: 0.1 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/audiences" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-purple-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Kitleler
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Users className="h-5 w-5 text-purple-400" />
            Yeni Kitle Oluştur
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Hedef kitlenizi tanımlayın ve kampanyalarınızda kullanın</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {[
          { n: 1, label: "Kitle Tipi" },
          { n: 2, label: audienceType === "custom" ? "Kaynak Seçimi" : "Kaynak Kitle" },
          { n: 3, label: "Detaylar" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-8 ${step > s.n - 1 ? "bg-purple-500/40" : "bg-slate-800"} transition-colors`} />}
            <button
              onClick={() => { if (s.n < step) setStep(s.n) }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                step === s.n
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                  : step > s.n
                    ? "text-emerald-400 border border-emerald-500/15 bg-emerald-500/5"
                    : "text-slate-600 border border-transparent"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s.n ? "bg-purple-500/20 text-purple-400" :
                step > s.n ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600"
              }`}>
                {step > s.n ? <Check className="h-3 w-3" /> : s.n}
              </span>
              {s.label}
            </button>
          </div>
        ))}
      </div>

      {/* Step 1: Choose type */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          {/* Custom Audience */}
          <button
            onClick={() => { setAudienceType("custom"); setStep(2) }}
            className={`glass-card rounded-xl p-6 text-left group hover:border-[rgba(148,163,184,0.12)] transition-all ${
              audienceType === "custom" ? "border-blue-500/20 bg-blue-500/[0.03]" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/15 transition-colors">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Custom Audience
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Mevcut müşterilerinizi veya belirli eylemleri gerçekleştiren kullanıcıları hedefleyin.
                  Website ziyaretçileri, müşteri listeleri, video izleyenler ve daha fazlası.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["Website", "CRM", "Video", "Instagram", "Lead Form"].map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Lookalike Audience */}
          <button
            onClick={() => { setAudienceType("lookalike"); setStep(2) }}
            className={`glass-card rounded-xl p-6 text-left group hover:border-[rgba(148,163,184,0.12)] transition-all ${
              audienceType === "lookalike" ? "border-cyan-500/20 bg-cyan-500/[0.03]" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/15 transition-colors">
                <Copy className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Lookalike Audience
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Mevcut kitlenize benzer yeni kullanıcılar bulun.
                  Kaynak kitlenizin özelliklerine benzer profilleri otomatik hedefleyin.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["%1 Benzer", "%3 Geniş", "Value-Based", "Ülke Bazlı"].map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Custom — Source selection */}
      {step === 2 && audienceType === "custom" && (
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Kaynak Seçin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {CUSTOM_SOURCES.map((src) => {
              const Icon = src.icon
              const isSelected = customSource === src.key
              return (
                <button
                  key={src.key}
                  onClick={() => { setCustomSource(src.key); setStep(3) }}
                  className={`glass-card rounded-xl p-4 text-left group hover:border-[rgba(148,163,184,0.12)] transition-all ${
                    isSelected ? "border-purple-500/20 bg-purple-500/[0.03]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ backgroundColor: `${src.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: src.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {src.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                        {src.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Lookalike — Source audience selection */}
      {step === 2 && audienceType === "lookalike" && (
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Kaynak Kitle Seçin
          </h3>
          <p className="text-[11px] text-slate-500">
            Lookalike kitlenizin temelini oluşturacak mevcut custom audience&apos;ınızı seçin.
          </p>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
            <input
              value={audienceSearch}
              onChange={(e) => setAudienceSearch(e.target.value)}
              placeholder="Kitle ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors"
            />
          </div>

          {/* Source audience list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filteredAudiences.map((aud) => {
              const isSelected = sourceAudienceId === aud.id
              return (
                <button
                  key={aud.id}
                  onClick={() => { setSourceAudienceId(aud.id); setStep(3) }}
                  className={`glass-card rounded-xl p-4 text-left group transition-all ${
                    isSelected
                      ? "border-cyan-500/25 bg-cyan-500/[0.03]"
                      : "hover:border-[rgba(148,163,184,0.12)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400">
                      {aud.subtype}
                    </span>
                    {isSelected && (
                      <span className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {aud.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500">Boyut: {aud.sizeRange}</span>
                    <span className={`text-[10px] ${aud.status === "ready" ? "text-emerald-400" : "text-amber-400"}`}>
                      {aud.status === "ready" ? "Hazır" : "Güncelleniyor"}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredAudiences.length === 0 && (
            <div className="glass-card rounded-xl p-10 text-center">
              <Users className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Custom audience bulunamadı</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Details form */}
      {step === 3 && (
        <div className="space-y-6 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Main form */}
            <div className="space-y-5">
              {/* Name */}
              <div className="glass-card rounded-xl p-5">
                <label className="block text-xs font-semibold text-white mb-2">Kitle Adı</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    audienceType === "custom"
                      ? "ör. Site Ziyaretçileri — Son 30 Gün"
                      : "ör. Lookalike — Satın Alanlar %1"
                  }
                  className="w-full px-3 py-2.5 text-sm bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors"
                />

                <label className="block text-xs font-semibold text-white mt-4 mb-2">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu kitlenin amacını kısaca açıklayın..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-colors resize-none"
                />
              </div>

              {/* Custom source-specific options */}
              {audienceType === "custom" && (
                <div className="glass-card rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-purple-400" />
                    Kaynak Ayarları
                  </h3>

                  {/* Website rules */}
                  {customSource === "website" && (
                    <div className="space-y-3">
                      <label className="block text-[11px] text-slate-400">Ziyaretçi Kuralı</label>
                      <div className="space-y-2">
                        {WEBSITE_RULES.map((rule) => (
                          <button
                            key={rule.key}
                            onClick={() => setWebsiteRule(rule.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
                              websiteRule === rule.key
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "text-slate-400 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)]"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              websiteRule === rule.key ? "border-blue-400 bg-blue-500/20" : "border-slate-600"
                            }`}>
                              {websiteRule === rule.key && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                            </span>
                            {rule.label}
                          </button>
                        ))}
                      </div>

                      {websiteRule === "specific_pages" && (
                        <div className="mt-3">
                          <label className="block text-[11px] text-slate-400 mb-1.5">URL İçeriği</label>
                          <input
                            value={urlContains}
                            onChange={(e) => setUrlContains(e.target.value)}
                            placeholder="ör. /products, /checkout"
                            className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video rules */}
                  {customSource === "video" && (
                    <div className="space-y-3">
                      <label className="block text-[11px] text-slate-400">İzleme Eşiği</label>
                      <div className="space-y-2">
                        {VIDEO_RULES.map((rule) => (
                          <button
                            key={rule.key}
                            onClick={() => setVideoRule(rule.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
                              videoRule === rule.key
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "text-slate-400 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)]"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              videoRule === rule.key ? "border-amber-400 bg-amber-500/20" : "border-slate-600"
                            }`}>
                              {videoRule === rule.key && <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                            </span>
                            {rule.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engagement rules */}
                  {(customSource === "engagement" || customSource === "instagram") && (
                    <div className="space-y-3">
                      <label className="block text-[11px] text-slate-400">Etkileşim Tipi</label>
                      <div className="space-y-2">
                        {ENGAGEMENT_RULES.map((rule) => (
                          <button
                            key={rule.key}
                            onClick={() => setEngagementRule(rule.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
                              engagementRule === rule.key
                                ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                : "text-slate-400 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)]"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              engagementRule === rule.key ? "border-pink-400 bg-pink-500/20" : "border-slate-600"
                            }`}>
                              {engagementRule === rule.key && <div className="h-1.5 w-1.5 rounded-full bg-pink-400" />}
                            </span>
                            {rule.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer List info */}
                  {customSource === "customer_list" && (
                    <div className="rounded-lg bg-[rgba(12,18,32,0.5)] p-4 border border-[rgba(148,163,184,0.04)]">
                      <div className="flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            CSV veya TXT dosyanızı yükleyin. E-posta, telefon numarası, ad, soyad alanları desteklenir.
                            Veriler hash&apos;lenerek güvenli şekilde Meta&apos;ya gönderilir.
                          </p>
                          <button className="mt-2 text-[10px] text-purple-400 hover:text-purple-300 transition-colors">
                            Şablon İndir →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lead Form info */}
                  {customSource === "lead_form" && (
                    <div className="rounded-lg bg-[rgba(12,18,32,0.5)] p-4 border border-[rgba(148,163,184,0.04)]">
                      <div className="flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Facebook/Instagram lead generation formunu dolduran kullanıcılar otomatik olarak kitleye eklenir.
                          Formu henüz oluşturmadıysanız, önce Lead Ads kampanyası başlatın.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Retention Days */}
                  <div className="pt-2 border-t border-[rgba(148,163,184,0.06)]">
                    <label className="block text-[11px] text-slate-400 mb-2">Retention Süresi</label>
                    <div className="flex flex-wrap gap-2">
                      {RETENTION_OPTIONS.map((days) => (
                        <button
                          key={days}
                          onClick={() => setRetentionDays(days)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            retentionDays === days
                              ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                              : "text-slate-500 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)] hover:text-slate-300"
                          }`}
                        >
                          {days} gün
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lookalike-specific options */}
              {audienceType === "lookalike" && (
                <div className="glass-card rounded-xl p-5 space-y-5">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    Lookalike Ayarları
                  </h3>

                  {/* Country */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-2">Hedef Ülke</label>
                    <div className="flex flex-wrap gap-2">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCountry(c.code)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            country === c.code
                              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                              : "text-slate-500 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)] hover:text-slate-300"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lookalike Percentage slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] text-slate-400">Benzerlik Oranı</label>
                      <span className="text-sm font-bold text-cyan-400 tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                        %{lookalikePercent}
                      </span>
                    </div>

                    {/* Custom slider */}
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={lookalikePercent}
                        onChange={(e) => setLookalikePercent(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800"
                        style={{
                          background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(lookalikePercent - 1) / 9 * 100}%, rgba(30,41,59,0.5) ${(lookalikePercent - 1) / 9 * 100}%, rgba(30,41,59,0.5) 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                          <span
                            key={v}
                            className={`text-[8px] ${v === lookalikePercent ? "text-cyan-400" : "text-slate-700"}`}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-[rgba(12,18,32,0.5)] p-3 border border-[rgba(148,163,184,0.04)]">
                      <Info className="h-3 w-3 text-slate-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        {lookalikePercent <= 2
                          ? "Düşük yüzde = Daha dar ama kaynak kitleye daha benzer. Dönüşüm odaklı kampanyalar için idealdir."
                          : lookalikePercent <= 5
                            ? "Orta yüzde = Boyut ve benzerlik arasında denge. Çoğu kampanya için uygun seçim."
                            : "Yüksek yüzde = Daha geniş reach ama düşük benzerlik. Farkındalık kampanyaları için kullanın."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5 sticky top-6">
                <h3 className="text-xs font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Özet
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Kitle Tipi</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      audienceType === "custom" ? "bg-blue-500/10 text-blue-400" : "bg-cyan-500/10 text-cyan-400"
                    }`}>
                      {audienceType === "custom" ? "Custom Audience" : "Lookalike"}
                    </span>
                  </div>

                  {audienceType === "custom" && customSource && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Kaynak</span>
                      <span className="text-[10px] text-white font-medium">
                        {CUSTOM_SOURCES.find(s => s.key === customSource)?.label}
                      </span>
                    </div>
                  )}

                  {audienceType === "lookalike" && selectedSourceAudience && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Kaynak Kitle</span>
                        <span className="text-[10px] text-white font-medium truncate max-w-[160px]">
                          {selectedSourceAudience.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Ülke</span>
                        <span className="text-[10px] text-white font-medium">
                          {COUNTRIES.find(c => c.code === country)?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Benzerlik</span>
                        <span className="text-[10px] text-cyan-400 font-bold">%{lookalikePercent}</span>
                      </div>
                    </>
                  )}

                  {audienceType === "custom" && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Retention</span>
                      <span className="text-[10px] text-white font-medium">{retentionDays} gün</span>
                    </div>
                  )}

                  {name && (
                    <div className="pt-2 border-t border-[rgba(148,163,184,0.06)]">
                      <span className="text-[10px] text-slate-500">İsim</span>
                      <p className="text-xs text-white font-medium mt-0.5 break-words">{name}</p>
                    </div>
                  )}
                </div>

                {/* Estimated size */}
                <div className="mt-4 pt-4 border-t border-[rgba(148,163,184,0.06)]">
                  <div className="rounded-lg bg-[rgba(12,18,32,0.5)] p-3 border border-[rgba(148,163,184,0.04)]">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Tahmini Boyut</p>
                    <p className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                      {audienceType === "custom" ? "~50K – 500K" : lookalikePercent <= 2 ? "~500K – 1.5M" : lookalikePercent <= 5 ? "~1.5M – 4M" : "~4M – 8M"}
                    </p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Gerçek boyut, kitle oluşturulduktan sonra belli olacaktır.</p>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || createAudience.isPending}
                  className={`w-full mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                    canSubmit && !createAudience.isPending
                      ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {createAudience.isPending ? (
                    <>
                      <RefreshIcon className="h-3.5 w-3.5 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Kitle Oluştur
                    </>
                  )}
                </button>

                {createAudience.isError && (
                  <p className="text-[10px] text-red-400 mt-2 text-center">
                    Bir hata oluştu. Lütfen tekrar deneyin.
                  </p>
                )}
              </div>

              {/* Tips */}
              <div className="glass-card rounded-xl p-5">
                <h4 className="text-[11px] font-semibold text-white mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  İpuçları
                </h4>
                <div className="space-y-2">
                  {audienceType === "custom" ? (
                    <>
                      <Tip text="Retention süresini hedeflerinize göre ayarlayın — retargeting için kısa (7-30 gün), prospecting için uzun (90-180 gün) süreler tercih edin." />
                      <Tip text="Website ziyaretçileri + satın alma hariç kombinasyonu güçlü bir retargeting kitlesi oluşturur." />
                      <Tip text="En az 1.000 kişilik kitle boyutu hedefleyin — çok küçük kitleler yetersiz yayın alabilir." />
                    </>
                  ) : (
                    <>
                      <Tip text="%1 lookalike en benzer kitleyi verir — dönüşüm kampanyaları için idealdir." />
                      <Tip text="Value-based kaynak kitleler (satın alanlar) genellikle en iyi lookalike performansını verir." />
                      <Tip text="Farklı yüzdelerde A/B testi yaparak optimum kitle boyutunu bulun." />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      {step > 1 && step < 3 && (
        <div className="flex items-center justify-between opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Geri
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          <button
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Geri
          </button>
        </div>
      )}
    </div>
  )
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-1 w-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
      <p className="text-[10px] text-slate-500 leading-relaxed">{text}</p>
    </div>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
