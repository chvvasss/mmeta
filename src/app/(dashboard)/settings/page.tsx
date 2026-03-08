"use client"

import { useState } from "react"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Database,
  Clock,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Zap,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react"

type SettingsTab = "general" | "notifications" | "api" | "security" | "display"

const TABS: Array<{ key: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: "general", label: "Genel", icon: Settings },
  { key: "notifications", label: "Bildirimler", icon: Bell },
  { key: "api", label: "API & Entegrasyon", icon: Key },
  { key: "security", label: "Güvenlik", icon: Shield },
  { key: "display", label: "Görünüm", icon: Palette },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general")

  // Form states
  const [timezone, setTimezone] = useState("Europe/Istanbul")
  const [currency, setCurrency] = useState("TRY")
  const [language, setLanguage] = useState("tr")
  const [dateFormat, setDateFormat] = useState("dd.MM.yyyy")
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [alertNotifs, setAlertNotifs] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [budgetAlert, setBudgetAlert] = useState(true)
  const [anomalyAlert, setAnomalyAlert] = useState(false)
  const [theme, setTheme] = useState<"dark" | "system">("dark")
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-slate-700"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  )

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-blue" style={{ top: "10%", right: "5%", width: "240px", height: "240px", opacity: 0.06 }} />

      {/* Header */}
      <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <Settings className="h-5 w-5 text-blue-400" />
          Ayarlar
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform tercihlerini ve entegrasyonları yapılandırın</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {/* Sidebar Tabs */}
        <div className="md:w-56 flex-shrink-0">
          <div className="glass-card rounded-xl p-2 space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-500 hover:text-white hover:bg-[rgba(148,163,184,0.04)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  <ChevronRight className={`h-3 w-3 ml-auto transition-transform ${activeTab === tab.key ? "rotate-90" : ""}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* ─── General ─── */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  Bölge & Dil
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">Zaman Dilimi</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-blue-500/30"
                      >
                        <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                        <option value="Europe/London">Europe/London (UTC+0)</option>
                        <option value="America/New_York">America/New_York (UTC-5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">Para Birimi</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-blue-500/30"
                      >
                        <option value="TRY">TRY - Türk Lirası (₺)</option>
                        <option value="USD">USD - Amerikan Doları ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">Dil</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-blue-500/30"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">Tarih Formatı</label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none focus:border-blue-500/30"
                      >
                        <option value="dd.MM.yyyy">08.03.2026</option>
                        <option value="MM/dd/yyyy">03/08/2026</option>
                        <option value="yyyy-MM-dd">2026-03-08</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" />
                  Veri & Senkronizasyon
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs text-white">Otomatik Veri Senkronizasyonu</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Meta API verilerini otomatik çek</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)]">
                    <div>
                      <p className="text-xs text-white">Senkronizasyon Aralığı</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Veriler ne sıklıkla güncellensin</p>
                    </div>
                    <select className="px-3 py-1.5 text-[10px] bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none">
                      <option>Her 15 dakika</option>
                      <option>Her 30 dakika</option>
                      <option>Her 1 saat</option>
                      <option>Her 6 saat</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)]">
                    <div>
                      <p className="text-xs text-white">Veri Saklama Süresi</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Insight verilerinin saklanma süresi</p>
                    </div>
                    <select className="px-3 py-1.5 text-[10px] bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none">
                      <option>90 gün</option>
                      <option>180 gün</option>
                      <option>1 yıl</option>
                      <option>Sınırsız</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Notifications ─── */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Bildirim Kanalları
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "E-posta Bildirimleri", desc: "Önemli güncellemeleri e-posta ile al", icon: Mail, checked: emailNotifs, onChange: setEmailNotifs },
                    { label: "Push Bildirimleri", desc: "Tarayıcı push bildirimleri al", icon: Smartphone, checked: pushNotifs, onChange: setPushNotifs },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-white">{item.label}</p>
                            <p className="text-[10px] text-slate-600 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <Toggle checked={item.checked} onChange={item.onChange} />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Uyarı Tercihleri
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Performans Uyarıları", desc: "CPC, CTR ve ROAS değişikliklerinde bildir", checked: alertNotifs, onChange: setAlertNotifs },
                    { label: "Bütçe Uyarıları", desc: "Bütçe limitlerine yaklaşıldığında bildir", checked: budgetAlert, onChange: setBudgetAlert },
                    { label: "Anomali Tespiti", desc: "Olağandışı metrik değişikliklerinde bildir", checked: anomalyAlert, onChange: setAnomalyAlert },
                    { label: "Haftalık Rapor", desc: "Her Pazartesi performans özeti gönder", checked: weeklyReport, onChange: setWeeklyReport },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)] first:border-0">
                      <div>
                        <p className="text-xs text-white">{item.label}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle checked={item.checked} onChange={item.onChange} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── API & Integrations ─── */}
          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-400" />
                  Meta API Bağlantısı
                </h3>

                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-medium">Bağlantı aktif</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 ml-5.5">Son doğrulama: 08.03.2026 14:30</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">App ID</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value="•••••••••••••••"
                        readOnly
                        className="flex-1 px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white"
                      />
                      <button className="px-3 py-2 text-[10px] bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                        Göster
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase mb-1.5 block">Access Token</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value="•••••••••••••••"
                        readOnly
                        className="flex-1 px-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white"
                      />
                      <button className="px-3 py-2 text-[10px] bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                        Yenile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  Webhooks & CAPI
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs text-white">Conversions API (CAPI)</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Server-side event gönderimi</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Aktif
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)]">
                    <div>
                      <p className="text-xs text-white">Webhook URL</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Gerçek zamanlı bildirimler için</p>
                    </div>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      Yapılandır
                      <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Rate Limit Info */}
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  API Rate Limit
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Günlük Kullanım", value: "2.847 / 5.000", pct: 57 },
                    { label: "Saatlik", value: "312 / 500", pct: 62 },
                    { label: "Dakika", value: "8 / 200", pct: 4 },
                  ].map((limit) => (
                    <div key={limit.label}>
                      <p className="text-[9px] text-slate-600 uppercase mb-1">{limit.label}</p>
                      <div className="h-1.5 rounded-full bg-[rgba(12,18,32,0.5)] mb-1">
                        <div
                          className={`h-full rounded-full ${limit.pct > 80 ? "bg-red-400" : limit.pct > 60 ? "bg-amber-400" : "bg-cyan-400"}`}
                          style={{ width: `${limit.pct}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 tabular-nums">{limit.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Security ─── */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Hesap Güvenliği
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Key className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white">İki Faktörlü Doğrulama (2FA)</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">Google Authenticator ile güvenliği artırın</p>
                      </div>
                    </div>
                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)]">
                    <div>
                      <p className="text-xs text-white">Oturum Zaman Aşımı</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">İnaktif oturumları sonlandır</p>
                    </div>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="px-3 py-1.5 text-[10px] bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white focus:outline-none"
                    >
                      <option value="15">15 dakika</option>
                      <option value="30">30 dakika</option>
                      <option value="60">1 saat</option>
                      <option value="480">8 saat</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-blue-400" />
                  Aktif Oturumlar
                </h3>
                <div className="space-y-2.5">
                  {[
                    { device: "Chrome — Windows 10", location: "İstanbul, TR", time: "Şu an aktif", current: true },
                    { device: "Safari — macOS", location: "Ankara, TR", time: "2 saat önce", current: false },
                    { device: "Mobile Chrome — Android", location: "İstanbul, TR", time: "1 gün önce", current: false },
                  ].map((session) => (
                    <div key={session.device} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(12,18,32,0.3)] border border-[rgba(148,163,184,0.04)]">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-3.5 w-3.5 text-slate-500" />
                        <div>
                          <p className="text-[11px] text-white flex items-center gap-1.5">
                            {session.device}
                            {session.current && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Bu cihaz</span>
                            )}
                          </p>
                          <p className="text-[9px] text-slate-600">{session.location} · {session.time}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-[9px] text-red-400 hover:text-red-300 transition-colors">
                          Sonlandır
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Log hint */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-blue-400 font-medium">Denetim Günlüğü</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Tüm API çağrıları ve kullanıcı aksiyonları kayıt altına alınır. Detaylı denetim günlüğü yakında aktif olacak.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Display ─── */}
          {activeTab === "display" && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-pink-400" />
                  Tema
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "dark" as const, label: "Koyu", icon: Moon, desc: "Koyu tema (varsayılan)" },
                    { key: "system" as const, label: "Sistem", icon: Monitor, desc: "Sistem tercihine uy" },
                  ].map((t) => {
                    const Icon = t.icon
                    return (
                      <button
                        key={t.key}
                        onClick={() => setTheme(t.key)}
                        className={`p-4 rounded-xl text-left transition-all ${
                          theme === t.key
                            ? "bg-blue-500/10 border border-blue-500/20"
                            : "bg-[rgba(12,18,32,0.3)] border border-[rgba(148,163,184,0.04)] hover:border-[rgba(148,163,184,0.08)]"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-2 ${theme === t.key ? "text-blue-400" : "text-slate-500"}`} />
                        <p className="text-xs text-white font-medium">{t.label}</p>
                        <p className="text-[9px] text-slate-600 mt-0.5">{t.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  Arayüz Tercihleri
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs text-white">Kompakt Mod</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Daha sıkışık görünüm ile daha fazla veri</p>
                    </div>
                    <Toggle checked={compactMode} onChange={setCompactMode} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(148,163,184,0.04)]">
                    <div>
                      <p className="text-xs text-white">Animasyonlar</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Geçiş efektleri ve animasyonlar</p>
                    </div>
                    <Toggle checked={animations} onChange={setAnimations} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
