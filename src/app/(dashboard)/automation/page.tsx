"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Zap,
  Plus,
  Search,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Target,
  Bell,
  DollarSign,
  Palette,
  Waves,
  Calendar,
} from "lucide-react"
import { useAutomationRules, useRuleExecutions } from "@/hooks/use-automation"
import { formatRelativeTime, formatNumber } from "@/lib/formatting"

type RuleFilter = "all" | "active" | "paused" | "draft"
type ViewTab = "rules" | "history"

const RULE_FILTERS: Array<{ key: RuleFilter; label: string }> = [
  { key: "all", label: "Tümü" },
  { key: "active", label: "Aktif" },
  { key: "paused", label: "Duraklatılmış" },
  { key: "draft", label: "Taslak" },
]

const STATUS_CONFIG = {
  active: { label: "Aktif", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  paused: { label: "Duraklatılmış", icon: Pause, color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  draft: { label: "Taslak", icon: FileEdit, color: "text-slate-400", bg: "bg-slate-500/10", dot: "bg-slate-400" },
  error: { label: "Hata", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", dot: "bg-red-400" },
}

const TRIGGER_CONFIG = {
  metric_threshold: { label: "Metrik Eşiği", icon: BarChart3, color: "text-blue-400" },
  schedule: { label: "Zamanlanmış", icon: Calendar, color: "text-cyan-400" },
  budget_limit: { label: "Bütçe Limiti", icon: DollarSign, color: "text-amber-400" },
  creative_fatigue: { label: "Kreatif Yorgunluğu", icon: Palette, color: "text-pink-400" },
  anomaly_detection: { label: "Anomali Tespiti", icon: Waves, color: "text-purple-400" },
}

const EXEC_STATUS = {
  success: { label: "Başarılı", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  failed: { label: "Başarısız", color: "text-red-400", bg: "bg-red-500/10", icon: AlertTriangle },
  skipped: { label: "Atlandı", color: "text-slate-400", bg: "bg-slate-500/10", icon: Clock },
}

export default function AutomationPage() {
  const [filter, setFilter] = useState<RuleFilter>("all")
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<ViewTab>("rules")
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  const { data: rules, isLoading: rulesLoading } = useAutomationRules(filter !== "all" ? filter : undefined)
  const { data: executions, isLoading: execLoading } = useRuleExecutions()

  const filteredRules = useMemo(() => {
    if (!rules) return []
    if (!search) return rules
    return rules.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  }, [rules, search])

  const stats = useMemo(() => {
    if (!rules) return null
    return {
      total: rules.length,
      active: rules.filter(r => r.status === "active").length,
      totalExecutions: rules.reduce((s, r) => s + r.executionCount, 0),
      avgSuccess: Math.round(rules.filter(r => r.executionCount > 0).reduce((s, r) => s + r.successRate, 0) / Math.max(rules.filter(r => r.executionCount > 0).length, 1)),
    }
  }, [rules])

  return (
    <div className="relative space-y-6 p-6">
      <div className="orb orb-purple" style={{ top: "5%", right: "10%", width: "280px", height: "280px", opacity: 0.1 }} />
      <div className="orb orb-cyan" style={{ bottom: "20%", left: "5%", width: "200px", height: "200px", opacity: 0.06 }} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-slide-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Zap className="h-5 w-5 text-amber-400" />
            Otomasyon Kuralları
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Kampanyalarınızı otomatik optimize edin ve anomalilere anında müdahale edin</p>
        </div>
        <Link
          href="/automation/create"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Yeni Kural
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "60ms", animationFillMode: "forwards" }}>
          {[
            { label: "Toplam Kural", value: stats.total, icon: Zap, color: "#f59e0b" },
            { label: "Aktif Kural", value: stats.active, icon: Activity, color: "#10b981" },
            { label: "Toplam Çalışma", value: stats.totalExecutions, icon: Play, color: "#3b82f6" },
            { label: "Başarı Oranı", value: `%${stats.avgSuccess}`, icon: Shield, color: "#8b5cf6" },
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
      )}

      {/* Tabs + Filter + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-4">
          {/* View tabs */}
          <div className="flex items-center gap-1 border-b border-[rgba(148,163,184,0.06)]">
            <button
              onClick={() => setTab("rules")}
              className={`px-3 py-2 text-xs font-medium transition-all relative ${
                tab === "rules" ? "text-amber-400" : "text-slate-500 hover:text-white"
              }`}
            >
              Kurallar
              {tab === "rules" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />}
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-3 py-2 text-xs font-medium transition-all relative ${
                tab === "history" ? "text-amber-400" : "text-slate-500 hover:text-white"
              }`}
            >
              Çalışma Geçmişi
              {tab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />}
            </button>
          </div>

          {/* Status filters */}
          {tab === "rules" && (
            <div className="flex items-center gap-1">
              {RULE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    filter === f.key
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "text-slate-500 hover:text-white border border-transparent"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {tab === "rules" && (
          <div className="relative max-w-xs w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kural ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.08)] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/30 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Rules list */}
      {tab === "rules" && (
        <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          {rulesLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-24 rounded-xl" />
            ))
          ) : filteredRules.length === 0 ? (
            <div className="glass-card rounded-xl p-16 text-center">
              <Zap className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">Kural bulunamadı</p>
              <p className="text-xs text-slate-600">Filtrelerinizi değiştirin veya yeni bir kural oluşturun.</p>
            </div>
          ) : (
            filteredRules.map((rule) => {
              const statusCfg = STATUS_CONFIG[rule.status]
              const triggerCfg = TRIGGER_CONFIG[rule.triggerType]
              const StatusIcon = statusCfg.icon
              const TriggerIcon = triggerCfg.icon
              const isExpanded = expandedRule === rule.id

              return (
                <div key={rule.id} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[rgba(148,163,184,0.02)] transition-colors"
                  >
                    {/* Status dot */}
                    <div className="relative flex-shrink-0">
                      <div className={`h-2.5 w-2.5 rounded-full ${statusCfg.dot}`} />
                      {rule.status === "active" && (
                        <div className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${statusCfg.dot} animate-ping opacity-30`} />
                      )}
                    </div>

                    {/* Rule info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-white truncate">{rule.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{rule.description}</p>
                    </div>

                    {/* Trigger type badge */}
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      <TriggerIcon className={`h-3 w-3 ${triggerCfg.color}`} />
                      <span className="text-[10px] text-slate-500">{triggerCfg.label}</span>
                    </div>

                    {/* Stats */}
                    <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Çalışma</p>
                        <p className="text-xs font-bold text-white tabular-nums">{rule.executionCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Başarı</p>
                        <p className={`text-xs font-bold tabular-nums ${rule.successRate >= 90 ? "text-emerald-400" : rule.successRate >= 70 ? "text-amber-400" : "text-red-400"}`}>
                          {rule.successRate > 0 ? `%${rule.successRate}` : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-600 uppercase">Kampanya</p>
                        <p className="text-xs font-bold text-white tabular-nums">{rule.campaignCount}</p>
                      </div>
                    </div>

                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-[rgba(148,163,184,0.06)] px-5 py-4 bg-[rgba(6,9,15,0.3)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Conditions */}
                        <div>
                          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Koşullar
                          </h4>
                          <div className="space-y-1.5">
                            {rule.conditions.map((cond, i) => (
                              <div key={i} className="rounded-lg bg-[rgba(12,18,32,0.5)] px-3 py-2 border border-[rgba(148,163,184,0.04)]">
                                <p className="text-[11px] text-white">
                                  <span className="text-amber-400 font-medium">{cond.metric}</span>
                                  {" "}{cond.operator}{" "}
                                  <span className="text-amber-400 font-medium">{cond.value}</span>
                                </p>
                                <p className="text-[9px] text-slate-600">{cond.timeframe}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Aksiyonlar
                          </h4>
                          <div className="space-y-1.5">
                            {rule.actions.map((action, i) => (
                              <div key={i} className="rounded-lg bg-[rgba(12,18,32,0.5)] px-3 py-2 border border-[rgba(148,163,184,0.04)]">
                                <p className="text-[11px] text-white">{action.label}</p>
                                {Object.entries(action.params).length > 0 && (
                                  <p className="text-[9px] text-slate-600">
                                    {Object.entries(action.params).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Detaylar
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Kapsam</span>
                              <span className="text-white">{rule.appliedTo}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Son Çalışma</span>
                              <span className="text-white">{rule.lastExecuted ? formatRelativeTime(rule.lastExecuted) : "—"}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Oluşturan</span>
                              <span className="text-white">{rule.createdBy}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500">Oluşturma</span>
                              <span className="text-white">{formatRelativeTime(rule.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Execution history */}
      {tab === "history" && (
        <div className="space-y-3 opacity-0 animate-slide-up" style={{ animationDelay: "180ms", animationFillMode: "forwards" }}>
          {execLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-loader h-20 rounded-xl" />
            ))
          ) : !executions?.length ? (
            <div className="glass-card rounded-xl p-16 text-center">
              <Clock className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Henüz çalışma geçmişi yok</p>
            </div>
          ) : (
            executions.map((exec) => {
              const execStatus = EXEC_STATUS[exec.status]
              const ExecIcon = execStatus.icon

              return (
                <div key={exec.id} className="glass-card rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className={`h-9 w-9 rounded-lg ${execStatus.bg} flex items-center justify-center flex-shrink-0`}>
                      <ExecIcon className={`h-4 w-4 ${execStatus.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-white">{exec.ruleName}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${execStatus.bg} ${execStatus.color}`}>
                          {execStatus.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">{exec.details}</p>

                      {/* Actions taken */}
                      {exec.actionsTaken.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {exec.actionsTaken.map((action, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(12,18,32,0.5)] border border-[rgba(148,163,184,0.06)] text-slate-400">
                              {action}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Affected entities */}
                      <div className="flex items-center gap-3 text-[10px] text-slate-600">
                        <span>{formatRelativeTime(exec.triggeredAt)}</span>
                        {exec.affectedEntities.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{exec.affectedEntities.join(", ")}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Metrics diff */}
                    {Object.keys(exec.metricsAfter).length > 0 && exec.status === "success" && (
                      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {Object.entries(exec.metricsBefore).slice(0, 2).map(([key, before]) => {
                          const after = exec.metricsAfter[key]
                          if (after === undefined || after === before) return null
                          const isUp = after > before
                          return (
                            <div key={key} className="text-right">
                              <p className="text-[9px] text-slate-600 uppercase">{key}</p>
                              <div className="flex items-center gap-1">
                                {isUp ? <TrendingUp className="h-2.5 w-2.5 text-emerald-400" /> : <TrendingDown className="h-2.5 w-2.5 text-red-400" />}
                                <span className="text-[10px] text-slate-400">
                                  {typeof before === "number" && before > 100 ? `₺${formatNumber(before)}` : before}
                                </span>
                                <span className="text-[10px] text-slate-600">→</span>
                                <span className={`text-[10px] font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                                  {typeof after === "number" && after > 100 ? `₺${formatNumber(after)}` : after}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Tips */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-slide-up" style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
          <Zap className="h-4 w-4 text-amber-400" />
          Otomasyon İpuçları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CPC ve ROAS eşikleri belirlerken son 7 günlük ortalamanızı baz alın, ani dalgalanmalar yanlış tetiklemeye neden olabilir.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-amber-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bütçe otomasyonlarında maksimum limit belirleyin — kontrolsüz artış veya azalışlar kampanya performansını olumsuz etkileyebilir.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 bg-blue-400" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Anomali tespiti kurallarını her zaman &quot;Durdur + Uyar&quot; olarak yapılandırın — sadece uyarı yeterli olmayabilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
