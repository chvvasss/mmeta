import { subDays, subHours, subMinutes, format } from "date-fns"

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ── Automation Rule Types ──
export type RuleStatus = "active" | "paused" | "draft" | "error"
export type RuleTriggerType = "metric_threshold" | "schedule" | "budget_limit" | "creative_fatigue" | "anomaly_detection"
export type RuleActionType = "pause_campaign" | "increase_budget" | "decrease_budget" | "send_alert" | "adjust_bid" | "duplicate_adset"

export interface AutomationCondition {
  metric: string
  operator: ">" | "<" | ">=" | "<=" | "=="
  value: number
  timeframe: string
}

export interface AutomationAction {
  type: RuleActionType
  label: string
  params: Record<string, string | number>
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  status: RuleStatus
  triggerType: RuleTriggerType
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  appliedTo: string
  appliedToType: "all_campaigns" | "specific_campaigns" | "specific_adsets"
  campaignCount: number
  executionCount: number
  lastExecuted: string | null
  nextCheck: string
  createdAt: string
  updatedAt: string
  createdBy: string
  successRate: number
}

export interface RuleExecution {
  id: string
  ruleId: string
  ruleName: string
  status: "success" | "failed" | "skipped"
  triggeredAt: string
  completedAt: string
  actionsTaken: string[]
  affectedEntities: string[]
  details: string
  metricsBefore: Record<string, number>
  metricsAfter: Record<string, number>
}

// ── Report Types ──
export type ReportStatus = "completed" | "generating" | "scheduled" | "failed"
export type ReportType = "performance" | "audience" | "creative" | "budget" | "custom"
export type ReportFrequency = "once" | "daily" | "weekly" | "monthly"

export interface ReportItem {
  id: string
  name: string
  description: string
  type: ReportType
  status: ReportStatus
  frequency: ReportFrequency
  dateRange: { from: string; to: string }
  metrics: string[]
  dimensions: string[]
  campaignIds: string[]
  createdAt: string
  completedAt: string | null
  fileSize: string | null
  pageCount: number | null
  createdBy: string
  lastSentTo: string[]
  scheduledAt: string | null
}

export interface ReportMetric {
  label: string
  value: number
  previousValue: number
  change: number
  format: "currency" | "number" | "percent"
}

export interface ReportDetail {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  dateRange: { from: string; to: string }
  summary: ReportMetric[]
  campaignBreakdown: Array<{
    name: string
    spend: number
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
    roas: number
  }>
  dailyTrend: Array<{
    date: string
    spend: number
    clicks: number
    conversions: number
    revenue: number
  }>
  topCreatives: Array<{
    name: string
    format: string
    spend: number
    ctr: number
    roas: number
    status: string
  }>
  insights: string[]
  generatedAt: string
}

// ── Generators ──

export function generateAutomationRules(): AutomationRule[] {
  return [
    {
      id: "rule_001",
      name: "CPC Yüksekse Bütçe Düşür",
      description: "CPC ₺15 üzerine çıkarsa kampanya bütçesini %20 azalt",
      status: "active",
      triggerType: "metric_threshold",
      conditions: [{ metric: "cpc", operator: ">", value: 15, timeframe: "last_24h" }],
      actions: [{ type: "decrease_budget", label: "Bütçeyi %20 Azalt", params: { percentage: 20 } }],
      appliedTo: "Tüm Aktif Kampanyalar",
      appliedToType: "all_campaigns",
      campaignCount: 8,
      executionCount: 23,
      lastExecuted: subHours(new Date(), 3).toISOString(),
      nextCheck: subMinutes(new Date(), -45).toISOString(),
      createdAt: subDays(new Date(), 60).toISOString(),
      updatedAt: subDays(new Date(), 2).toISOString(),
      createdBy: "Ahmet Y.",
      successRate: 91,
    },
    {
      id: "rule_002",
      name: "ROAS Düşükse Uyarı Gönder",
      description: "ROAS 2x altına düşerse Slack ve e-posta ile uyarı gönder",
      status: "active",
      triggerType: "metric_threshold",
      conditions: [{ metric: "roas", operator: "<", value: 2, timeframe: "last_3d" }],
      actions: [{ type: "send_alert", label: "Slack + E-posta Uyarısı", params: { channels: "slack,email" } }],
      appliedTo: "Conversion Kampanyaları",
      appliedToType: "specific_campaigns",
      campaignCount: 5,
      executionCount: 12,
      lastExecuted: subHours(new Date(), 8).toISOString(),
      nextCheck: subMinutes(new Date(), -120).toISOString(),
      createdAt: subDays(new Date(), 45).toISOString(),
      updatedAt: subDays(new Date(), 5).toISOString(),
      createdBy: "Ahmet Y.",
      successRate: 100,
    },
    {
      id: "rule_003",
      name: "Günlük Bütçe Limiti Aşılırsa Durdur",
      description: "Günlük harcama ₺5.000 üzerine çıkarsa kampanyayı otomatik durdur",
      status: "active",
      triggerType: "budget_limit",
      conditions: [{ metric: "daily_spend", operator: ">", value: 5000, timeframe: "today" }],
      actions: [
        { type: "pause_campaign", label: "Kampanyayı Durdur", params: {} },
        { type: "send_alert", label: "Acil Uyarı Gönder", params: { channels: "slack" } },
      ],
      appliedTo: "Tüm Kampanyalar",
      appliedToType: "all_campaigns",
      campaignCount: 12,
      executionCount: 3,
      lastExecuted: subDays(new Date(), 5).toISOString(),
      nextCheck: subMinutes(new Date(), -15).toISOString(),
      createdAt: subDays(new Date(), 90).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      createdBy: "Mehmet K.",
      successRate: 100,
    },
    {
      id: "rule_004",
      name: "CTR Yüksekse Bütçe Artır",
      description: "CTR %3 üzerinde olursa bütçeyi %15 artır (max ₺10.000/gün)",
      status: "active",
      triggerType: "metric_threshold",
      conditions: [{ metric: "ctr", operator: ">", value: 3, timeframe: "last_7d" }],
      actions: [{ type: "increase_budget", label: "Bütçeyi %15 Artır", params: { percentage: 15, maxDaily: 10000 } }],
      appliedTo: "Traffic Kampanyaları",
      appliedToType: "specific_campaigns",
      campaignCount: 3,
      executionCount: 7,
      lastExecuted: subDays(new Date(), 1).toISOString(),
      nextCheck: subMinutes(new Date(), -360).toISOString(),
      createdAt: subDays(new Date(), 30).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      createdBy: "Ahmet Y.",
      successRate: 85,
    },
    {
      id: "rule_005",
      name: "Kreatif Yorgunluğu Algıla",
      description: "Frequency 3+ ve CTR düşüşü %30+ ise uyarı gönder",
      status: "active",
      triggerType: "creative_fatigue",
      conditions: [
        { metric: "frequency", operator: ">=", value: 3, timeframe: "last_7d" },
        { metric: "ctr_change", operator: "<", value: -30, timeframe: "last_7d" },
      ],
      actions: [{ type: "send_alert", label: "Kreatif Yenileme Uyarısı", params: { channels: "email" } }],
      appliedTo: "Tüm Reklam Setleri",
      appliedToType: "specific_adsets",
      campaignCount: 15,
      executionCount: 5,
      lastExecuted: subDays(new Date(), 2).toISOString(),
      nextCheck: subMinutes(new Date(), -60).toISOString(),
      createdAt: subDays(new Date(), 20).toISOString(),
      updatedAt: subDays(new Date(), 2).toISOString(),
      createdBy: "Zeynep A.",
      successRate: 80,
    },
    {
      id: "rule_006",
      name: "Harcama Anomalisi Tespiti",
      description: "Saatlik harcama ortalamadan %200+ sapma gösterirse durdur ve uyar",
      status: "paused",
      triggerType: "anomaly_detection",
      conditions: [{ metric: "hourly_spend_deviation", operator: ">", value: 200, timeframe: "last_1h" }],
      actions: [
        { type: "pause_campaign", label: "Kampanyayı Durdur", params: {} },
        { type: "send_alert", label: "Anomali Uyarısı", params: { channels: "slack,sms" } },
      ],
      appliedTo: "Tüm Kampanyalar",
      appliedToType: "all_campaigns",
      campaignCount: 12,
      executionCount: 1,
      lastExecuted: subDays(new Date(), 14).toISOString(),
      nextCheck: subMinutes(new Date(), -30).toISOString(),
      createdAt: subDays(new Date(), 15).toISOString(),
      updatedAt: subDays(new Date(), 14).toISOString(),
      createdBy: "Mehmet K.",
      successRate: 100,
    },
    {
      id: "rule_007",
      name: "Haftalık Performans Raporu",
      description: "Her pazartesi 09:00'da haftalık performans özetini e-posta ile gönder",
      status: "active",
      triggerType: "schedule",
      conditions: [{ metric: "schedule", operator: "==", value: 1, timeframe: "weekly_monday_0900" }],
      actions: [{ type: "send_alert", label: "Rapor E-postası Gönder", params: { channels: "email", template: "weekly_report" } }],
      appliedTo: "Tüm Aktif Kampanyalar",
      appliedToType: "all_campaigns",
      campaignCount: 8,
      executionCount: 8,
      lastExecuted: subDays(new Date(), 1).toISOString(),
      nextCheck: subDays(new Date(), -6).toISOString(),
      createdAt: subDays(new Date(), 56).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      createdBy: "Ahmet Y.",
      successRate: 100,
    },
    {
      id: "rule_008",
      name: "Learning Phase Başarısızlık Uyarısı",
      description: "Reklam seti learning limited durumuna geçerse bildirim gönder",
      status: "draft",
      triggerType: "metric_threshold",
      conditions: [{ metric: "learning_phase", operator: "==", value: 0, timeframe: "realtime" }],
      actions: [{ type: "send_alert", label: "Learning Limited Uyarısı", params: { channels: "slack" } }],
      appliedTo: "Yeni Reklam Setleri",
      appliedToType: "specific_adsets",
      campaignCount: 0,
      executionCount: 0,
      lastExecuted: null,
      nextCheck: subMinutes(new Date(), -60).toISOString(),
      createdAt: subDays(new Date(), 3).toISOString(),
      updatedAt: subDays(new Date(), 3).toISOString(),
      createdBy: "Zeynep A.",
      successRate: 0,
    },
  ]
}

export function generateRuleExecutions(): RuleExecution[] {
  return [
    {
      id: "exec_001", ruleId: "rule_001", ruleName: "CPC Yüksekse Bütçe Düşür",
      status: "success", triggeredAt: subHours(new Date(), 3).toISOString(),
      completedAt: subHours(new Date(), 3).toISOString(),
      actionsTaken: ["Bütçe %20 azaltıldı: ₺5.000 → ₺4.000"],
      affectedEntities: ["Summer Sale 2026"],
      details: "CPC ₺17.40 ile eşik değerini aştı. Bütçe otomatik olarak düşürüldü.",
      metricsBefore: { cpc: 17.4, daily_budget: 5000 },
      metricsAfter: { cpc: 17.4, daily_budget: 4000 },
    },
    {
      id: "exec_002", ruleId: "rule_002", ruleName: "ROAS Düşükse Uyarı Gönder",
      status: "success", triggeredAt: subHours(new Date(), 8).toISOString(),
      completedAt: subHours(new Date(), 8).toISOString(),
      actionsTaken: ["Slack bildirim gönderildi", "E-posta uyarısı gönderildi"],
      affectedEntities: ["Instagram Story — Retarget", "Facebook Feed — Conversion"],
      details: "ROAS 1.6x ile eşik altına düştü. Ekip bilgilendirildi.",
      metricsBefore: { roas: 1.6 },
      metricsAfter: { roas: 1.6 },
    },
    {
      id: "exec_003", ruleId: "rule_004", ruleName: "CTR Yüksekse Bütçe Artır",
      status: "success", triggeredAt: subDays(new Date(), 1).toISOString(),
      completedAt: subDays(new Date(), 1).toISOString(),
      actionsTaken: ["Bütçe %15 artırıldı: ₺3.000 → ₺3.450"],
      affectedEntities: ["Brand Awareness — Q1"],
      details: "CTR %4.2 ile hedefi aştı. Bütçe otomatik artırıldı.",
      metricsBefore: { ctr: 4.2, daily_budget: 3000 },
      metricsAfter: { ctr: 4.2, daily_budget: 3450 },
    },
    {
      id: "exec_004", ruleId: "rule_005", ruleName: "Kreatif Yorgunluğu Algıla",
      status: "success", triggeredAt: subDays(new Date(), 2).toISOString(),
      completedAt: subDays(new Date(), 2).toISOString(),
      actionsTaken: ["Kreatif yenileme uyarısı gönderildi"],
      affectedEntities: ["Retarget — AddToCart", "Retarget — ViewContent"],
      details: "Frequency 4.1, CTR %38 düştü. Kreatif yorgunluğu tespit edildi.",
      metricsBefore: { frequency: 4.1, ctr_change: -38 },
      metricsAfter: { frequency: 4.1, ctr_change: -38 },
    },
    {
      id: "exec_005", ruleId: "rule_003", ruleName: "Günlük Bütçe Limiti Aşılırsa Durdur",
      status: "success", triggeredAt: subDays(new Date(), 5).toISOString(),
      completedAt: subDays(new Date(), 5).toISOString(),
      actionsTaken: ["Kampanya duraklatıldı", "Acil uyarı gönderildi"],
      affectedEntities: ["Mega Sale Weekend"],
      details: "Günlük harcama ₺5.320 ile limiti aştı. Kampanya otomatik durduruldu.",
      metricsBefore: { daily_spend: 5320 },
      metricsAfter: { daily_spend: 5320 },
    },
    {
      id: "exec_006", ruleId: "rule_001", ruleName: "CPC Yüksekse Bütçe Düşür",
      status: "skipped", triggeredAt: subDays(new Date(), 1).toISOString(),
      completedAt: subDays(new Date(), 1).toISOString(),
      actionsTaken: [],
      affectedEntities: ["Winter Collection"],
      details: "CPC ₺14.80 — eşik altında, aksiyon alınmadı.",
      metricsBefore: { cpc: 14.8 },
      metricsAfter: { cpc: 14.8 },
    },
    {
      id: "exec_007", ruleId: "rule_006", ruleName: "Harcama Anomalisi Tespiti",
      status: "failed", triggeredAt: subDays(new Date(), 14).toISOString(),
      completedAt: subDays(new Date(), 14).toISOString(),
      actionsTaken: ["Kampanya durdurma başarısız — API hatası"],
      affectedEntities: ["Flash Sale — Friday"],
      details: "Meta API rate limit nedeniyle kampanya durdurulamadı. Manuel müdahale gerekli.",
      metricsBefore: { hourly_spend_deviation: 245 },
      metricsAfter: { hourly_spend_deviation: 245 },
    },
  ]
}

export function generateReports(): ReportItem[] {
  return [
    {
      id: "rpt_001", name: "Haftalık Performans Özeti",
      description: "Tüm aktif kampanyaların haftalık performans metrikleri ve trend analizi",
      type: "performance", status: "completed", frequency: "weekly",
      dateRange: { from: subDays(new Date(), 7).toISOString(), to: new Date().toISOString() },
      metrics: ["spend", "impressions", "clicks", "conversions", "ctr", "cpc", "roas"],
      dimensions: ["campaign", "date"],
      campaignIds: ["camp_001", "camp_002", "camp_003", "camp_004"],
      createdAt: subDays(new Date(), 1).toISOString(),
      completedAt: subDays(new Date(), 1).toISOString(),
      fileSize: "2.4 MB", pageCount: 12, createdBy: "Ahmet Y.",
      lastSentTo: ["ahmet@agency.com", "manager@agency.com"],
      scheduledAt: null,
    },
    {
      id: "rpt_002", name: "Aylık Kitle Analizi",
      description: "Kitle segmentlerinin performans karşılaştırması ve yeni kitle önerileri",
      type: "audience", status: "completed", frequency: "monthly",
      dateRange: { from: subDays(new Date(), 30).toISOString(), to: new Date().toISOString() },
      metrics: ["reach", "frequency", "conversions", "cost_per_result"],
      dimensions: ["audience", "age", "gender"],
      campaignIds: ["camp_001", "camp_002"],
      createdAt: subDays(new Date(), 2).toISOString(),
      completedAt: subDays(new Date(), 2).toISOString(),
      fileSize: "4.1 MB", pageCount: 18, createdBy: "Zeynep A.",
      lastSentTo: ["zeynep@agency.com"],
      scheduledAt: null,
    },
    {
      id: "rpt_003", name: "Kreatif Performans Raporu",
      description: "Reklam kreatiflerinin A/B test sonuçları ve öneriler",
      type: "creative", status: "completed", frequency: "weekly",
      dateRange: { from: subDays(new Date(), 14).toISOString(), to: new Date().toISOString() },
      metrics: ["ctr", "video_views", "thumb_stop_ratio", "hook_rate", "hold_rate"],
      dimensions: ["ad", "placement"],
      campaignIds: ["camp_003", "camp_005"],
      createdAt: subDays(new Date(), 3).toISOString(),
      completedAt: subDays(new Date(), 3).toISOString(),
      fileSize: "3.2 MB", pageCount: 15, createdBy: "Mehmet K.",
      lastSentTo: ["creative@agency.com"],
      scheduledAt: null,
    },
    {
      id: "rpt_004", name: "Bütçe Kullanım Raporu",
      description: "Kampanya bazında bütçe tüketimi, pacing ve optimizasyon önerileri",
      type: "budget", status: "completed", frequency: "daily",
      dateRange: { from: subDays(new Date(), 1).toISOString(), to: new Date().toISOString() },
      metrics: ["spend", "budget_remaining", "pacing", "estimated_end_date"],
      dimensions: ["campaign", "adset"],
      campaignIds: [],
      createdAt: subHours(new Date(), 6).toISOString(),
      completedAt: subHours(new Date(), 6).toISOString(),
      fileSize: "1.8 MB", pageCount: 8, createdBy: "Sistem",
      lastSentTo: ["ahmet@agency.com"],
      scheduledAt: null,
    },
    {
      id: "rpt_005", name: "Q1 2026 Genel Değerlendirme",
      description: "İlk çeyrek kapsamlı performans analizi ve Q2 strateji önerileri",
      type: "custom", status: "completed", frequency: "once",
      dateRange: { from: subDays(new Date(), 90).toISOString(), to: new Date().toISOString() },
      metrics: ["spend", "revenue", "roas", "cpa", "ltv"],
      dimensions: ["campaign", "month", "audience"],
      campaignIds: [],
      createdAt: subDays(new Date(), 5).toISOString(),
      completedAt: subDays(new Date(), 5).toISOString(),
      fileSize: "8.7 MB", pageCount: 32, createdBy: "Ahmet Y.",
      lastSentTo: ["ceo@agency.com", "marketing@agency.com"],
      scheduledAt: null,
    },
    {
      id: "rpt_006", name: "Yeni Haftalık Trend Raporu",
      description: "Haftanın performans trendleri ve anomali tespitleri",
      type: "performance", status: "generating", frequency: "weekly",
      dateRange: { from: subDays(new Date(), 7).toISOString(), to: new Date().toISOString() },
      metrics: ["spend", "clicks", "conversions", "roas"],
      dimensions: ["campaign", "date"],
      campaignIds: [],
      createdAt: subMinutes(new Date(), 15).toISOString(),
      completedAt: null,
      fileSize: null, pageCount: null, createdBy: "Sistem",
      lastSentTo: [],
      scheduledAt: null,
    },
    {
      id: "rpt_007", name: "Pazartesi Otorapor",
      description: "Her pazartesi 08:00'de otomatik oluşturulan haftalık özet",
      type: "performance", status: "scheduled", frequency: "weekly",
      dateRange: { from: subDays(new Date(), 7).toISOString(), to: new Date().toISOString() },
      metrics: ["spend", "impressions", "clicks", "conversions"],
      dimensions: ["campaign"],
      campaignIds: [],
      createdAt: subDays(new Date(), 14).toISOString(),
      completedAt: null,
      fileSize: null, pageCount: null, createdBy: "Ahmet Y.",
      lastSentTo: ["team@agency.com"],
      scheduledAt: subDays(new Date(), -2).toISOString(),
    },
  ]
}

export function generateReportDetail(reportId: string): ReportDetail {
  const seed = reportId.charCodeAt(4) * 37

  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const s = seed + i * 11
    const spend = 3000 + seededRandom(s) * 5000
    const clicks = 400 + Math.round(seededRandom(s + 1) * 800)
    const conversions = 15 + Math.round(seededRandom(s + 2) * 45)
    const revenue = conversions * (80 + seededRandom(s + 3) * 120)
    return {
      date: format(subDays(new Date(), 7 - i), "dd MMM"),
      spend: Math.round(spend),
      clicks,
      conversions,
      revenue: Math.round(revenue),
    }
  })

  const totalSpend = dailyTrend.reduce((s, d) => s + d.spend, 0)
  const totalClicks = dailyTrend.reduce((s, d) => s + d.clicks, 0)
  const totalConversions = dailyTrend.reduce((s, d) => s + d.conversions, 0)
  const totalRevenue = dailyTrend.reduce((s, d) => s + d.revenue, 0)

  return {
    id: reportId,
    name: "Haftalık Performans Özeti",
    type: "performance",
    status: "completed",
    dateRange: { from: subDays(new Date(), 7).toISOString(), to: new Date().toISOString() },
    summary: [
      { label: "Toplam Harcama", value: totalSpend, previousValue: totalSpend * 0.88, change: 13.6, format: "currency" },
      { label: "Toplam Tıklama", value: totalClicks, previousValue: Math.round(totalClicks * 0.92), change: 8.7, format: "number" },
      { label: "Dönüşüm", value: totalConversions, previousValue: Math.round(totalConversions * 0.85), change: 17.6, format: "number" },
      { label: "ROAS", value: Math.round((totalRevenue / totalSpend) * 100) / 100, previousValue: 2.1, change: 14.3, format: "number" },
      { label: "CPC", value: Math.round((totalSpend / totalClicks) * 100) / 100, previousValue: 6.8, change: -4.4, format: "currency" },
      { label: "CTR", value: Math.round((totalClicks / (totalClicks * 180)) * 10000) / 100, previousValue: 2.8, change: 7.1, format: "percent" },
    ],
    campaignBreakdown: [
      { name: "Summer Sale 2026", spend: Math.round(totalSpend * 0.35), impressions: 485000, clicks: Math.round(totalClicks * 0.32), conversions: Math.round(totalConversions * 0.4), ctr: 3.2, cpc: 5.4, roas: 3.8 },
      { name: "Retarget — AddToCart", spend: Math.round(totalSpend * 0.25), impressions: 124000, clicks: Math.round(totalClicks * 0.28), conversions: Math.round(totalConversions * 0.35), ctr: 4.8, cpc: 4.1, roas: 5.2 },
      { name: "Brand Awareness — Q1", spend: Math.round(totalSpend * 0.2), impressions: 820000, clicks: Math.round(totalClicks * 0.22), conversions: Math.round(totalConversions * 0.1), ctr: 1.8, cpc: 3.2, roas: 1.4 },
      { name: "Instagram Story — Promo", spend: Math.round(totalSpend * 0.12), impressions: 310000, clicks: Math.round(totalClicks * 0.12), conversions: Math.round(totalConversions * 0.1), ctr: 2.4, cpc: 6.8, roas: 2.6 },
      { name: "Lookalike — Buyers 1%", spend: Math.round(totalSpend * 0.08), impressions: 195000, clicks: Math.round(totalClicks * 0.06), conversions: Math.round(totalConversions * 0.05), ctr: 2.1, cpc: 8.2, roas: 2.1 },
    ],
    dailyTrend,
    topCreatives: [
      { name: "Video — Ürün Tanıtımı 15s", format: "Video", spend: 4200, ctr: 4.8, roas: 5.1, status: "active" },
      { name: "Carousel — Bestseller", format: "Carousel", spend: 3800, ctr: 3.9, roas: 4.2, status: "active" },
      { name: "Static — %50 İndirim", format: "Image", spend: 2900, ctr: 3.2, roas: 3.6, status: "active" },
      { name: "Story — Flash Sale", format: "Story", spend: 1800, ctr: 2.8, roas: 2.9, status: "paused" },
    ],
    insights: [
      "Retarget kampanyaları en yüksek ROAS (5.2x) performansını gösteriyor — bütçe artışı değerlendirilebilir.",
      "Video kreatifler statik görsellere göre %50 daha yüksek CTR sağlıyor.",
      "Hafta sonu harcama artışı %18, ancak dönüşüm oranı hafta içine göre %12 düşük.",
      "Instagram Story placement'ta CPC düşük ancak conversion rate iyileştirilmeli.",
      "Lookalike %1 kitlesi beklentilerin altında — kaynak kitle güncellemesi önerilir.",
    ],
    generatedAt: subDays(new Date(), 1).toISOString(),
  }
}
