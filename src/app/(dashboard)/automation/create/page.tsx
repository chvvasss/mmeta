"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Zap,
  ChevronLeft,
  Check,
  BarChart3,
  Calendar,
  DollarSign,
  Palette,
  Waves,
  Plus,
  Trash2,
  Sparkles,
  Target,
  Play,
  Pause,
  Bell,
  TrendingUp,
  TrendingDown,
  Copy,
  Info,
} from "lucide-react"
import { useCreateRule } from "@/hooks/use-automation"

type TriggerType = "metric_threshold" | "schedule" | "budget_limit" | "creative_fatigue" | "anomaly_detection"
type ActionType = "pause_campaign" | "increase_budget" | "decrease_budget" | "send_alert" | "adjust_bid" | "duplicate_adset"

interface Condition {
  metric: string
  operator: string
  value: string
  timeframe: string
}

interface Action {
  type: ActionType
  params: Record<string, string>
}

const TRIGGER_TYPES = [
  { key: "metric_threshold" as const, label: "Metrik Eşiği", description: "Belirli bir metrik eşiği aşıldığında tetiklenir", icon: BarChart3, color: "#3b82f6" },
  { key: "budget_limit" as const, label: "Bütçe Limiti", description: "Harcama limiti aşıldığında tetiklenir", icon: DollarSign, color: "#f59e0b" },
  { key: "creative_fatigue" as const, label: "Kreatif Yorgunluğu", description: "Frequency artışı ve CTR düşüşü algılanır", icon: Palette, color: "#ec4899" },
  { key: "anomaly_detection" as const, label: "Anomali Tespiti", description: "Normalden sapan harcama veya performans algılanır", icon: Waves, color: "#8b5cf6" },
  { key: "schedule" as const, label: "Zamanlanmış", description: "Belirlenen zamanda otomatik çalışır", icon: Calendar, color: "#06b6d4" },
]

const METRICS = [
  { key: "cpc", label: "CPC (Tıklama Başı Maliyet)" },
  { key: "ctr", label: "CTR (Tıklama Oranı)" },
  { key: "roas", label: "ROAS (Reklam Getirisi)" },
  { key: "cpa", label: "CPA (Dönüşüm Başı Maliyet)" },
  { key: "daily_spend", label: "Günlük Harcama" },
  { key: "frequency", label: "Frequency" },
  { key: "ctr_change", label: "CTR Değişimi (%)" },
  { key: "impressions", label: "Gösterim" },
  { key: "conversions", label: "Dönüşüm" },
]

const TIMEFRAMES = [
  { key: "last_1h", label: "Son 1 Saat" },
  { key: "last_6h", label: "Son 6 Saat" },
  { key: "last_24h", label: "Son 24 Saat" },
  { key: "last_3d", label: "Son 3 Gün" },
  { key: "last_7d", label: "Son 7 Gün" },
  { key: "today", label: "Bugün" },
]

const ACTIONS: Array<{ type: ActionType; label: string; description: string; icon: typeof Play; color: string }> = [
  { type: "pause_campaign", label: "Kampanyayı Durdur", description: "Kampanyayı otomatik duraklatır", icon: Pause, color: "#ef4444" },
  { type: "increase_budget", label: "Bütçe Artır", description: "Kampanya bütçesini yüzdesel artırır", icon: TrendingUp, color: "#10b981" },
  { type: "decrease_budget", label: "Bütçe Azalt", description: "Kampanya bütçesini yüzdesel azaltır", icon: TrendingDown, color: "#f59e0b" },
  { type: "send_alert", label: "Uyarı Gönder", description: "Slack, e-posta veya SMS bildirim gönderir", icon: Bell, color: "#3b82f6" },
  { type: "adjust_bid", label: "Teklif Ayarla", description: "Otomatik bid ayarlaması yapar", icon: Target, color: "#8b5cf6" },
  { type: "duplicate_adset", label: "AdSet Kopyala", description: "Başarılı reklam setini otomatik kopyalar", icon: Copy, color: "#06b6d4" },
]

const APPLY_OPTIONS = [
  { key: "all_campaigns", label: "Tüm Aktif Kampanyalar" },
  { key: "specific_campaigns", label: "Belirli Kampanyalar" },
  { key: "specific_adsets", label: "Belirli Reklam Setleri" },
]

export default function CreateAutomationPage() {
  const router = useRouter()
  const createRule = useCreateRule()

  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null)
  const [conditions, setConditions] = useState<Condition[]>([
    { metric: "cpc", operator: ">", value: "", timeframe: "last_24h" },
  ])
  const [actions, setActions] = useState<Action[]>([])
  const [applyTo, setApplyTo] = useState("all_campaigns")

  const addCondition = () => {
    setConditions([...conditions, { metric: "cpc", operator: ">", value: "", timeframe: "last_24h" }])
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    const updated = [...conditions]
    updated[index] = { ...updated[index], [field]: value }
    setConditions(updated)
  }

  const toggleAction = (type: ActionType) => {
    const exists = actions.find(a => a.type === type)
    if (exists) {
      setActions(actions.filter(a => a.type !== type))
    } else {
      setActions([...actions, { type, params: {} }])
    }
  }

  const canSubmit = name.trim() !== "" && triggerType !== null && conditions.every(c => c.value) && actions.length > 0

  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      triggerType,
      conditions: conditions.map(c => ({ ...c, value: parseFloat(c.value) })),
      actions: actions.map(a => ({
        type: a.type,
        label: ACTIONS.find(ac => ac.type === a.type)?.label || "",
        params: a.params,
      })),
      appliedTo: APPLY_OPTIONS.find(o => o.key === applyTo)?.label || "",
      appliedToType: applyTo,
    }

    try {
      await createRule.mutateAsync(payload)
      router.push("/automation")
    } catch {
      // handled by mutation
    }
  }

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "15%", width: "260px", height: "260px", opacity: 0.1 }} />

      {/* Breadcrumb + Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <Link href="/automation" className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-amber-400 transition-colors mb-3">
          <ChevronLeft className="h-3 w-3" />
          Otomasyon
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Zap className="h-5 w-5 text-amber-400" />
            Yeni Otomasyon Kuralı
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Koşul ve aksiyonları belirleyerek otomatik optimizasyon kuralı tanımlayın</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {[
          { n: 1, label: "Tetikleyici" },
          { n: 2, label: "Koşullar" },
          { n: 3, label: "Aksiyonlar" },
          { n: 4, label: "Kural Detayları" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-6 ${step > s.n - 1 ? "bg-amber-500/40" : "bg-slate-800"} transition-colors`} />}
            <button
              onClick={() => { if (s.n < step) setStep(s.n) }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                step === s.n
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : step > s.n
                    ? "text-emerald-400 border border-emerald-500/15 bg-emerald-500/5"
                    : "text-slate-600 border border-transparent"
              }`}
            >
              <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                step === s.n ? "bg-amber-500/20 text-amber-400" :
                step > s.n ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-600"
              }`}>
                {step > s.n ? <Check className="h-2.5 w-2.5" /> : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Step 1: Trigger type */}
      {step === 1 && (
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Tetikleyici Tipi Seçin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {TRIGGER_TYPES.map((t) => {
              const Icon = t.icon
              const isSelected = triggerType === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => { setTriggerType(t.key); setStep(2) }}
                  className={`glass-card rounded-xl p-5 text-left group hover:border-[rgba(148,163,184,0.12)] transition-all ${
                    isSelected ? "border-amber-500/20 bg-amber-500/[0.03]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-amber-400 transition-colors">{t.label}</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Conditions */}
      {step === 2 && (
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Koşulları Tanımlayın
            </h3>
            <button
              onClick={addCondition}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="h-3 w-3" />
              Koşul Ekle
            </button>
          </div>

          <div className="space-y-3">
            {conditions.map((cond, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                    {i === 0 ? "EĞER" : "VE"}
                  </span>
                  {conditions.length > 1 && (
                    <button onClick={() => removeCondition(i)} className="ml-auto text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <select
                    value={cond.metric}
                    onChange={(e) => updateCondition(i, "metric", e.target.value)}
                    className="px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-amber-500/30 transition-colors"
                  >
                    {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                  </select>

                  <select
                    value={cond.operator}
                    onChange={(e) => updateCondition(i, "operator", e.target.value)}
                    className="px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-amber-500/30 transition-colors"
                  >
                    <option value=">">Büyüktür (&gt;)</option>
                    <option value="<">Küçüktür (&lt;)</option>
                    <option value=">=">Büyük Eşit (&gt;=)</option>
                    <option value="<=">Küçük Eşit (&lt;=)</option>
                    <option value="==">Eşittir (==)</option>
                  </select>

                  <input
                    type="number"
                    value={cond.value}
                    onChange={(e) => updateCondition(i, "value", e.target.value)}
                    placeholder="Değer"
                    className="px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
                  />

                  <select
                    value={cond.timeframe}
                    onChange={(e) => updateCondition(i, "timeframe", e.target.value)}
                    className="px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-amber-500/30 transition-colors"
                  >
                    {TIMEFRAMES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" /> Geri
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!conditions.every(c => c.value)}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                conditions.every(c => c.value)
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              Devam <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Actions */}
      {step === 3 && (
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Aksiyonları Seçin
          </h3>
          <p className="text-[11px] text-slate-500">Koşullar sağlandığında hangi aksiyonlar alınsın?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {ACTIONS.map((action) => {
              const Icon = action.icon
              const isSelected = actions.some(a => a.type === action.type)
              return (
                <button
                  key={action.type}
                  onClick={() => toggleAction(action.type)}
                  className={`glass-card rounded-xl p-4 text-left group transition-all ${
                    isSelected
                      ? "border-amber-500/20 bg-amber-500/[0.03]"
                      : "hover:border-[rgba(148,163,184,0.12)]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                        <Icon className="h-4 w-4" style={{ color: action.color }} />
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{action.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Action parameters (for budget actions) */}
          {actions.some(a => a.type === "increase_budget" || a.type === "decrease_budget") && (
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-[11px] text-slate-400 mb-3 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Bütçe Değişim Parametreleri
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Değişim Yüzdesi (%)</label>
                  <input
                    type="number"
                    placeholder="ör. 20"
                    className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Maks. Günlük Bütçe (₺)</label>
                  <input
                    type="number"
                    placeholder="ör. 10000"
                    className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" /> Geri
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={actions.length === 0}
              className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                actions.length > 0
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              Devam <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Rule details + submit */}
      {step === 4 && (
        <div className="space-y-5 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* Form */}
            <div className="space-y-5">
              <div className="glass-card rounded-xl p-5">
                <label className="block text-xs font-semibold text-white mb-2">Kural Adı</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ör. CPC Yüksekse Bütçe Düşür"
                  className="w-full px-3 py-2.5 text-sm bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
                />

                <label className="block text-xs font-semibold text-white mt-4 mb-2">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu kuralın ne yaptığını açıklayın..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors resize-none"
                />
              </div>

              <div className="glass-card rounded-xl p-5">
                <label className="block text-xs font-semibold text-white mb-3">Uygulama Kapsamı</label>
                <div className="space-y-2">
                  {APPLY_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setApplyTo(opt.key)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
                        applyTo === opt.key
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "text-slate-400 border border-[rgba(148,163,184,0.06)] hover:border-[rgba(148,163,184,0.12)]"
                      }`}
                    >
                      <span className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        applyTo === opt.key ? "border-amber-400 bg-amber-500/20" : "border-slate-600"
                      }`}>
                        {applyTo === opt.key && <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-xl p-5 h-fit sticky top-6">
              <h3 className="text-xs font-semibold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Kural Özeti
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500">Tetikleyici</span>
                  <p className="text-[11px] text-white font-medium mt-0.5">
                    {TRIGGER_TYPES.find(t => t.key === triggerType)?.label}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500">Koşullar</span>
                  {conditions.map((c, i) => (
                    <p key={i} className="text-[11px] text-white mt-0.5">
                      {i > 0 && <span className="text-amber-400">VE </span>}
                      {METRICS.find(m => m.key === c.metric)?.label} {c.operator} {c.value}
                    </p>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] text-slate-500">Aksiyonlar</span>
                  {actions.map((a, i) => (
                    <p key={i} className="text-[11px] text-white mt-0.5">
                      {ACTIONS.find(ac => ac.type === a.type)?.label}
                    </p>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] text-slate-500">Kapsam</span>
                  <p className="text-[11px] text-white mt-0.5">
                    {APPLY_OPTIONS.find(o => o.key === applyTo)?.label}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || createRule.isPending}
                className={`w-full mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                  canSubmit && !createRule.isPending
                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {createRule.isPending ? "Oluşturuluyor..." : "Kuralı Oluştur"}
              </button>
            </div>
          </div>

          <button onClick={() => setStep(3)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Geri
          </button>
        </div>
      )}
    </div>
  )
}
