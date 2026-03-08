"use client"

import { useState, useMemo } from "react"
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  CreditCard,
  Globe,
  Calendar,
  Activity,
  BarChart3,
  Layers,
  Eye,
  Settings,
  ExternalLink,
  Wallet,
  Shield,
  ArrowUpRight,
  Megaphone,
} from "lucide-react"
import { formatCurrency, formatDate, formatRelativeTime, formatNumber } from "@/lib/formatting"
import { generateAccountItems } from "@/lib/mock-advanced"

const STATUS_CONFIG = {
  active: { label: "Aktif", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  disabled: { label: "Devre Dışı", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-400" },
  pending_review: { label: "İnceleniyor", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  unsettled: { label: "Ödeme Bekliyor", icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10", dot: "bg-orange-400" },
}

const ROLE_CONFIG = {
  admin: { label: "Yönetici", color: "text-purple-400", bg: "bg-purple-500/10" },
  advertiser: { label: "Reklamveren", color: "text-blue-400", bg: "bg-blue-500/10" },
  analyst: { label: "Analist", color: "text-cyan-400", bg: "bg-cyan-500/10" },
}

type StatusFilter = "all" | "active" | "disabled" | "pending_review"

export default function AccountsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null)

  const accounts = useMemo(() => generateAccountItems(), [])

  const filteredAccounts = useMemo(() => {
    let result = accounts
    if (search) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.accountId.toLowerCase().includes(search.toLowerCase()) ||
          a.businessName.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter)
    }
    return result
  }, [accounts, search, statusFilter])

  const stats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter((a) => a.status === "active").length,
      totalSpent: accounts.reduce((s, a) => s + a.totalSpent, 0),
      totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
    }
  }, [accounts])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-blue" style={{ top: "5%", right: "8%", width: "280px", height: "280px", opacity: 0.08 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Building2 className="h-5 w-5 text-blue-400" />
            Hesap Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Meta reklam hesaplarınızı yönetin ve izleyin</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
          <Plus className="h-3.5 w-3.5" />
          Hesap Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
        {[
          { label: "Toplam Hesap", value: stats.total, icon: Building2, color: "#3b82f6" },
          { label: "Aktif Hesap", value: stats.active, icon: CheckCircle2, color: "#10b981" },
          { label: "Toplam Harcama", value: formatCurrency(stats.totalSpent), icon: BarChart3, color: "#f59e0b" },
          { label: "Toplam Bakiye", value: formatCurrency(stats.totalBalance), icon: Wallet, color: "#8b5cf6" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-bold text-white mt-0.5 tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {s.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-1">
          {(["all", "active", "disabled", "pending_review"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === f
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-white border border-transparent"
              }`}
            >
              {f === "all" ? "Tümü" : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hesap ara..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Account Cards */}
      {filteredAccounts.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center opacity-0 animate-slide-up" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
          <Building2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Hesap bulunamadı</p>
          <p className="text-xs text-slate-600">Filtrelerinizi değiştirin veya yeni bir hesap ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
          {filteredAccounts.map((account) => {
            const statusCfg = STATUS_CONFIG[account.status]
            const roleCfg = ROLE_CONFIG[account.role]
            const StatusIcon = statusCfg.icon
            const isExpanded = expandedAccount === account.id
            const isDisabled = account.status === "disabled"

            return (
              <div key={account.id} className={`glass-card rounded-xl overflow-hidden transition-all ${isDisabled ? "opacity-60" : ""}`}>
                {/* Main Row */}
                <button
                  onClick={() => setExpandedAccount(isExpanded ? null : account.id)}
                  className="w-full p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/10">
                      <Building2 className="h-5 w-5 text-blue-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">{account.name}</p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusCfg.bg} ${statusCfg.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusCfg.label}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${roleCfg.bg} ${roleCfg.color}`}>
                          {roleCfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">
                        {account.businessName} · <span className="text-slate-600 font-mono">{account.accountId}</span>
                      </p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Megaphone className="h-2.5 w-2.5" />
                          {account.campaigns} kampanya
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Layers className="h-2.5 w-2.5" />
                          {account.adSets} reklam seti
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Activity className="h-2.5 w-2.5" />
                          {formatRelativeTime(account.lastActivity)}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-5 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Toplam Harcama</p>
                        <p className="text-xs font-medium text-white tabular-nums">{formatCurrency(account.totalSpent)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Bakiye</p>
                        <p className={`text-xs font-medium tabular-nums ${account.balance > 5000 ? "text-emerald-400" : account.balance > 0 ? "text-amber-400" : "text-red-400"}`}>
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Günlük Limit</p>
                        <p className="text-xs font-medium text-white tabular-nums">{formatCurrency(account.dailyBudget)}</p>
                      </div>
                      <ArrowUpRight className={`h-4 w-4 text-slate-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-[rgba(148,163,184,0.04)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {/* Account Details */}
                      <div className="space-y-2.5">
                        <p className="text-[9px] text-slate-600 uppercase mb-1.5">Hesap Detayları</p>
                        {[
                          { icon: Globe, label: "Zaman Dilimi", value: account.timezone },
                          { icon: CreditCard, label: "Ödeme Yöntemi", value: account.paymentMethod },
                          { icon: Calendar, label: "Oluşturulma", value: formatDate(account.createdAt) },
                          { icon: Shield, label: "Pixel ID", value: account.pixelId || "Yok" },
                        ].map((detail) => {
                          const Icon = detail.icon
                          return (
                            <div key={detail.label} className="flex items-center gap-2.5">
                              <Icon className="h-3 w-3 text-slate-600" />
                              <span className="text-[10px] text-slate-500 w-24">{detail.label}</span>
                              <span className="text-[10px] text-white">{detail.value}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Resource Counts */}
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase mb-2">Kaynaklar</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Kampanya", value: account.campaigns, color: "#3b82f6" },
                            { label: "Reklam Seti", value: account.adSets, color: "#8b5cf6" },
                            { label: "Reklam", value: account.ads, color: "#10b981" },
                          ].map((res) => (
                            <div key={res.label} className="p-2.5 rounded-lg bg-[rgba(12,18,32,0.3)] border border-[rgba(148,163,184,0.04)] text-center">
                              <p className="text-sm font-bold tabular-nums" style={{ color: res.color, fontFamily: "var(--font-heading)" }}>{res.value}</p>
                              <p className="text-[8px] text-slate-600 uppercase mt-0.5">{res.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase mb-2">Hızlı İşlemler</p>
                        <div className="space-y-1.5">
                          {[
                            { label: "Kampanyaları Görüntüle", icon: Eye, color: "text-blue-400" },
                            { label: "Hesap Ayarları", icon: Settings, color: "text-slate-400" },
                            { label: "Meta Business Suite", icon: ExternalLink, color: "text-cyan-400" },
                          ].map((action) => {
                            const Icon = action.icon
                            return (
                              <button key={action.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(12,18,32,0.3)] border border-[rgba(148,163,184,0.04)] hover:border-[rgba(148,163,184,0.08)] transition-colors text-left">
                                <Icon className={`h-3 w-3 ${action.color}`} />
                                <span className="text-[10px] text-slate-400">{action.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
