"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Target,
  ShoppingCart,
  MousePointerClick,
  Zap,
  Users,
  Megaphone,
  CircleDot,
  DollarSign,
  Calendar,
  Shield,
  Rocket,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CAMPAIGN_OBJECTIVES, BID_STRATEGIES } from "@/lib/constants"
import { toast } from "sonner"

const OBJECTIVES = [
  { key: "OUTCOME_SALES", icon: ShoppingCart, color: "#10b981", desc: "Online satış, katalog satışları ve mağaza trafiği artışı" },
  { key: "OUTCOME_TRAFFIC", icon: MousePointerClick, color: "#3b82f6", desc: "Web sitenize, uygulamanıza veya Messenger'a trafik yönlendirin" },
  { key: "OUTCOME_ENGAGEMENT", icon: Zap, color: "#f59e0b", desc: "Beğeni, yorum, paylaşım ve video görüntüleme artışı" },
  { key: "OUTCOME_LEADS", icon: Users, color: "#8b5cf6", desc: "Potansiyel müşteri formu, arama veya mesaj ile lead topla" },
  { key: "OUTCOME_AWARENESS", icon: Megaphone, color: "#06b6d4", desc: "Marka bilinirliği ve erişim artışı sağlayın" },
  { key: "OUTCOME_APP_PROMOTION", icon: CircleDot, color: "#ec4899", desc: "Uygulama yüklemelerini ve uygulama içi olayları artırın" },
] as const

const BID_STRATEGY_OPTIONS = [
  { key: "LOWEST_COST_WITHOUT_CAP", desc: "Meta tüm bütçeyi kullanarak mümkün olan en düşük maliyetli sonuçları alır" },
  { key: "COST_CAP", desc: "Ortalama maliyet belirler, bu tutarın altında kalmaya çalışır" },
  { key: "BID_CAP", desc: "Her müzayedede maksimum teklif tutarını sınırlar" },
  { key: "MINIMUM_ROAS", desc: "Minimum getiri oranı belirleyerek bütçeyi optimize eder" },
] as const

const SPECIAL_CATEGORIES = [
  { key: "NONE", label: "Yok" },
  { key: "EMPLOYMENT", label: "İstihdam" },
  { key: "HOUSING", label: "Konut" },
  { key: "CREDIT", label: "Kredi" },
  { key: "ISSUES_ELECTIONS_POLITICS", label: "Siyaset/Seçim" },
] as const

type Step = 1 | 2 | 3

export default function CreateCampaignPage() {
  return (
    <Suspense fallback={<div className="p-6"><div className="skeleton-loader h-96 rounded-xl" /></div>}>
      <CreateCampaignContent />
    </Suspense>
  )
}

function CreateCampaignContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditing = !!editId

  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [objective, setObjective] = useState("")
  const [budgetType, setBudgetType] = useState<"DAILY" | "LIFETIME">("DAILY")
  const [dailyBudget, setDailyBudget] = useState("")
  const [lifetimeBudget, setLifetimeBudget] = useState("")
  const [bidStrategy, setBidStrategy] = useState("LOWEST_COST_WITHOUT_CAP")
  const [bidAmount, setBidAmount] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [specialCategory, setSpecialCategory] = useState("NONE")
  const [advantagePlus, setAdvantagePlus] = useState(false)
  const [status, setStatus] = useState<"ACTIVE" | "PAUSED">("PAUSED")

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (s: Step): boolean => {
    const newErrors: Record<string, string> = {}

    if (s === 1) {
      if (!objective) newErrors.objective = "Bir kampanya hedefi seçin"
      if (!name || name.length < 3) newErrors.name = "Kampanya adı en az 3 karakter olmalı"
    }
    if (s === 2) {
      if (budgetType === "DAILY" && (!dailyBudget || Number(dailyBudget) < 1)) {
        newErrors.dailyBudget = "Günlük bütçe en az ₺1 olmalı"
      }
      if (budgetType === "LIFETIME" && (!lifetimeBudget || Number(lifetimeBudget) < 10)) {
        newErrors.lifetimeBudget = "Toplam bütçe en az ₺10 olmalı"
      }
      if ((bidStrategy === "COST_CAP" || bidStrategy === "BID_CAP") && (!bidAmount || Number(bidAmount) <= 0)) {
        newErrors.bidAmount = "Teklif tutarı girin"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3) as Step)
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)

    toast.success(isEditing ? "Kampanya güncellendi" : "Kampanya oluşturuldu", {
      description: `"${name}" kampanyası ${isEditing ? "başarıyla güncellendi" : "başarıyla oluşturuldu"}.`,
    })
    router.push("/campaigns")
  }

  const steps = [
    { num: 1, label: "Hedef & İsim", icon: Target },
    { num: 2, label: "Bütçe & Teklif", icon: DollarSign },
    { num: 3, label: "Gözden Geçir", icon: Check },
  ]

  return (
    <div className="relative max-w-3xl mx-auto space-y-6 p-6">
      {/* Atmospheric */}
      <div className="orb orb-blue" style={{ top: "0%", right: "5%", width: "250px", height: "250px", opacity: 0.2 }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 opacity-0 animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/campaigns" className="hover:text-blue-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Kampanyalar
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="text-slate-300">{isEditing ? "Kampanya Düzenle" : "Yeni Kampanya"}</span>
      </nav>

      {/* Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          {isEditing ? "Kampanya Düzenle" : "Yeni Kampanya Oluştur"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Kampanyanızı 3 adımda yapılandırın</p>
      </div>

      {/* Step indicator */}
      <div className="glass-card rounded-xl px-6 py-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isCompleted = step > s.num
            const isCurrent = step === s.num
            return (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${isCompleted
                        ? "bg-green-500/20 text-green-400"
                        : isCurrent
                          ? "bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30"
                          : "bg-slate-800/50 text-slate-600"
                      }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${isCurrent ? "text-blue-400" : isCompleted ? "text-green-400" : "text-slate-600"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 transition-colors ${isCompleted ? "bg-green-500/30" : "bg-slate-800"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-white mb-3 block" style={{ fontFamily: "var(--font-heading)" }}>
                Kampanya Hedefi
              </Label>
              <p className="text-xs text-slate-500 mb-4">İşletme hedefinize en uygun seçeneği belirleyin</p>
              {errors.objective && (
                <p className="text-xs text-red-400 flex items-center gap-1 mb-3">
                  <AlertCircle className="h-3 w-3" /> {errors.objective}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OBJECTIVES.map((obj) => {
                  const Icon = obj.icon
                  const isSelected = objective === obj.key
                  return (
                    <button
                      key={obj.key}
                      onClick={() => { setObjective(obj.key); setErrors((prev) => ({ ...prev, objective: "" })) }}
                      className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${isSelected
                          ? "border-blue-500/40 bg-blue-500/5"
                          : "border-[rgba(148,163,184,0.08)] bg-[rgba(12,18,32,0.3)] hover:border-[rgba(148,163,184,0.15)] hover:bg-[rgba(12,18,32,0.5)]"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${obj.color}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: obj.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {CAMPAIGN_OBJECTIVES[obj.key as keyof typeof CAMPAIGN_OBJECTIVES]}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{obj.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="campaign-name" className="text-sm font-semibold text-white mb-2 block">
                Kampanya Adı
              </Label>
              {errors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: "" })) }}
                placeholder="Ör: Yaz İndirimi — Satış Kampanyası"
                className="bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.1)] text-white placeholder:text-slate-600 focus:border-blue-500/40 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-600 mt-1.5">{name.length}/100 karakter</p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-white mb-2 block">Özel Reklam Kategorisi</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSpecialCategory(cat.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${specialCategory === cat.key
                        ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                        : "border-[rgba(148,163,184,0.08)] text-slate-500 hover:text-slate-300 hover:border-[rgba(148,163,184,0.15)]"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Budget Type */}
            <div>
              <Label className="text-sm font-semibold text-white mb-3 block" style={{ fontFamily: "var(--font-heading)" }}>
                Bütçe Türü
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {(["DAILY", "LIFETIME"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBudgetType(type)}
                    className={`rounded-xl border p-4 text-left transition-all ${budgetType === type
                        ? "border-blue-500/40 bg-blue-500/5"
                        : "border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)]"
                      }`}
                  >
                    <p className="text-sm font-medium text-white">{type === "DAILY" ? "Günlük Bütçe" : "Ömür Boyu Bütçe"}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {type === "DAILY" ? "Her gün belirli bir tutar harcayın" : "Toplam bütçeyi kampanya süresine yayın"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget amount */}
            <div>
              <Label className="text-sm font-semibold text-white mb-2 block">
                {budgetType === "DAILY" ? "Günlük Bütçe" : "Toplam Bütçe"} (₺)
              </Label>
              {(errors.dailyBudget || errors.lifetimeBudget) && (
                <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
                  <AlertCircle className="h-3 w-3" /> {errors.dailyBudget || errors.lifetimeBudget}
                </p>
              )}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">₺</span>
                <Input
                  type="number"
                  value={budgetType === "DAILY" ? dailyBudget : lifetimeBudget}
                  onChange={(e) => {
                    if (budgetType === "DAILY") setDailyBudget(e.target.value)
                    else setLifetimeBudget(e.target.value)
                    setErrors((prev) => ({ ...prev, dailyBudget: "", lifetimeBudget: "" }))
                  }}
                  placeholder={budgetType === "DAILY" ? "100" : "3000"}
                  className="pl-8 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.1)] text-white placeholder:text-slate-600 focus:border-blue-500/40"
                />
              </div>
              {budgetType === "DAILY" && dailyBudget && (
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Haftalık tahmini: {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(dailyBudget) * 7)}
                </p>
              )}
            </div>

            {/* Bid Strategy */}
            <div>
              <Label className="text-sm font-semibold text-white mb-3 block" style={{ fontFamily: "var(--font-heading)" }}>
                Teklif Stratejisi
              </Label>
              <div className="space-y-2">
                {BID_STRATEGY_OPTIONS.map((bs) => (
                  <button
                    key={bs.key}
                    onClick={() => setBidStrategy(bs.key)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${bidStrategy === bs.key
                        ? "border-blue-500/40 bg-blue-500/5"
                        : "border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">
                        {BID_STRATEGIES[bs.key as keyof typeof BID_STRATEGIES]}
                      </p>
                      {bidStrategy === bs.key && <Check className="h-4 w-4 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{bs.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bid Amount (conditional) */}
            {(bidStrategy === "COST_CAP" || bidStrategy === "BID_CAP") && (
              <div>
                <Label className="text-sm font-semibold text-white mb-2 block">
                  {bidStrategy === "COST_CAP" ? "Maliyet Sınırı" : "Teklif Sınırı"} (₺)
                </Label>
                {errors.bidAmount && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
                    <AlertCircle className="h-3 w-3" /> {errors.bidAmount}
                  </p>
                )}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">₺</span>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => { setBidAmount(e.target.value); setErrors((prev) => ({ ...prev, bidAmount: "" })) }}
                    placeholder="5.00"
                    step="0.01"
                    className="pl-8 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.1)] text-white placeholder:text-slate-600 focus:border-blue-500/40"
                  />
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-white mb-2 block">Başlangıç Tarihi</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.1)] text-white focus:border-blue-500/40 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold text-white mb-2 block">Bitiş Tarihi</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-9 bg-[rgba(12,18,32,0.5)] border-[rgba(148,163,184,0.1)] text-white focus:border-blue-500/40 [color-scheme:dark]"
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Boş bırakılırsa kampanya süresiz devam eder</p>
              </div>
            </div>

            {/* Advantage+ */}
            <div className="flex items-center justify-between rounded-xl border border-[rgba(148,163,184,0.08)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Rocket className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Advantage+ Kampanya</p>
                  <p className="text-[11px] text-slate-500">Meta AI hedefleme ve bütçe optimizasyonu yapar</p>
                </div>
              </div>
              <Switch checked={advantagePlus} onCheckedChange={setAdvantagePlus} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Kampanya Özeti
            </h3>

            <div className="space-y-3">
              <SummaryRow label="Kampanya Adı" value={name} />
              <SummaryRow label="Hedef" value={CAMPAIGN_OBJECTIVES[objective as keyof typeof CAMPAIGN_OBJECTIVES] || objective} />
              <SummaryRow label="Bütçe Türü" value={budgetType === "DAILY" ? "Günlük" : "Ömür Boyu"} />
              <SummaryRow
                label={budgetType === "DAILY" ? "Günlük Bütçe" : "Toplam Bütçe"}
                value={`₺${budgetType === "DAILY" ? dailyBudget : lifetimeBudget}`}
              />
              <SummaryRow label="Teklif Stratejisi" value={BID_STRATEGIES[bidStrategy as keyof typeof BID_STRATEGIES]} />
              {bidAmount && <SummaryRow label="Teklif Tutarı" value={`₺${bidAmount}`} />}
              <SummaryRow label="Özel Kategori" value={SPECIAL_CATEGORIES.find(c => c.key === specialCategory)?.label || "Yok"} />
              {startDate && <SummaryRow label="Başlangıç" value={new Date(startDate).toLocaleString("tr-TR")} />}
              {endDate && <SummaryRow label="Bitiş" value={new Date(endDate).toLocaleString("tr-TR")} />}
              <SummaryRow label="Advantage+" value={advantagePlus ? "Aktif" : "Pasif"} />
            </div>

            {/* Initial status */}
            <div className="pt-3 border-t border-[rgba(148,163,184,0.06)]">
              <Label className="text-sm font-semibold text-white mb-3 block">Yayın Durumu</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStatus("PAUSED")}
                  className={`rounded-xl border p-3 text-left transition-all ${status === "PAUSED"
                      ? "border-yellow-500/40 bg-yellow-500/5"
                      : "border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)]"
                    }`}
                >
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-yellow-400" />
                    Duraklatılmış
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Önce kontrol edin, sonra aktifleştirin</p>
                </button>
                <button
                  onClick={() => setStatus("ACTIVE")}
                  className={`rounded-xl border p-3 text-left transition-all ${status === "ACTIVE"
                      ? "border-green-500/40 bg-green-500/5"
                      : "border-[rgba(148,163,184,0.08)] hover:border-[rgba(148,163,184,0.15)]"
                    }`}
                >
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    <Rocket className="h-3.5 w-3.5 text-green-400" />
                    Hemen Aktif
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kampanya hemen yayınlanmaya başlar</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
        <div>
          {step > 1 && (
            <Button
              variant="ghost"
              onClick={prevStep}
              className="gap-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Geri
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/campaigns">
            <Button variant="ghost" className="text-xs text-slate-500 hover:text-slate-300">
              İptal
            </Button>
          </Link>
          {step < 3 ? (
            <Button
              onClick={nextStep}
              className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              Sonraki
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {isEditing ? "Güncelle" : "Kampanyayı Oluştur"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(148,163,184,0.04)]">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-medium text-white">{value}</span>
    </div>
  )
}
