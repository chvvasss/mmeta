import { subDays, format } from "date-fns"
import { generateMockCampaigns } from "./mock-data"

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ── Breakdown Types ──
export interface BreakdownRow {
  label: string
  key: string
  spend: number
  impressions: number
  clicks: number
  cpc: number
  ctr: number
  conversions: number
  cpa: number
  roas: number
  sharePercent: number
}

export interface HourlyData {
  hour: number
  label: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
}

export interface FunnelStep {
  label: string
  value: number
  percent: number
  dropoff: number
  color: string
}

export interface ComparisonMetric {
  label: string
  key: string
  campaignA: number
  campaignB: number
  format: "currency" | "number" | "percent"
  better: "A" | "B" | "equal"
}

export interface TrendComparison {
  date: string
  campaignA: number
  campaignB: number
}

export interface RegionData {
  region: string
  code: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
}

// ── Age Breakdown ──
export function generateAgeBreakdown(): BreakdownRow[] {
  const totalSpend = 45230
  const ages = [
    { label: "13-17", key: "13-17", ratio: 0.03 },
    { label: "18-24", key: "18-24", ratio: 0.22 },
    { label: "25-34", key: "25-34", ratio: 0.35 },
    { label: "35-44", key: "35-44", ratio: 0.22 },
    { label: "45-54", key: "45-54", ratio: 0.11 },
    { label: "55-64", key: "55-64", ratio: 0.05 },
    { label: "65+", key: "65+", ratio: 0.02 },
  ]

  return ages.map((age, i) => {
    const spend = Math.round(totalSpend * age.ratio * 100) / 100
    const impressions = Math.round(1245000 * age.ratio * (0.8 + seededRandom(i * 7) * 0.4))
    const clicks = Math.round(impressions * (0.015 + seededRandom(i * 13) * 0.025))
    const conversions = Math.round(clicks * (0.02 + seededRandom(i * 19) * 0.03))
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0
    const cpa = conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0
    const revenue = conversions * (85 + seededRandom(i * 31) * 60)
    const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0

    return {
      label: age.label,
      key: age.key,
      spend,
      impressions,
      clicks,
      cpc,
      ctr,
      conversions,
      cpa,
      roas,
      sharePercent: Math.round(age.ratio * 100),
    }
  })
}

// ── Gender Breakdown ──
export function generateGenderBreakdown(): BreakdownRow[] {
  const totalSpend = 45230
  const genders = [
    { label: "Kadın", key: "female", ratio: 0.48 },
    { label: "Erkek", key: "male", ratio: 0.44 },
    { label: "Belirtilmemiş", key: "unknown", ratio: 0.08 },
  ]

  return genders.map((g, i) => {
    const spend = Math.round(totalSpend * g.ratio * 100) / 100
    const impressions = Math.round(1245000 * g.ratio * (0.85 + seededRandom(i * 11) * 0.3))
    const clicks = Math.round(impressions * (0.018 + seededRandom(i * 17) * 0.02))
    const conversions = Math.round(clicks * (0.022 + seededRandom(i * 23) * 0.025))
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0
    const cpa = conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0
    const revenue = conversions * (85 + seededRandom(i * 37) * 60)
    const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0

    return { label: g.label, key: g.key, spend, impressions, clicks, cpc, ctr, conversions, cpa, roas, sharePercent: Math.round(g.ratio * 100) }
  })
}

// ── Placement Breakdown ──
export function generatePlacementBreakdown(): BreakdownRow[] {
  const totalSpend = 45230
  const placements = [
    { label: "Facebook Feed", key: "facebook_feed", ratio: 0.28 },
    { label: "Instagram Feed", key: "instagram_feed", ratio: 0.24 },
    { label: "Instagram Stories", key: "instagram_stories", ratio: 0.18 },
    { label: "Instagram Reels", key: "instagram_reels", ratio: 0.12 },
    { label: "Facebook Stories", key: "facebook_stories", ratio: 0.06 },
    { label: "Facebook Reels", key: "facebook_reels", ratio: 0.04 },
    { label: "Audience Network", key: "audience_network", ratio: 0.04 },
    { label: "Messenger", key: "messenger", ratio: 0.02 },
    { label: "Sağ Sütun", key: "right_column", ratio: 0.02 },
  ]

  return placements.map((p, i) => {
    const spend = Math.round(totalSpend * p.ratio * 100) / 100
    const impressions = Math.round(1245000 * p.ratio * (0.7 + seededRandom(i * 9) * 0.6))
    const clicks = Math.round(impressions * (0.01 + seededRandom(i * 15) * 0.03))
    const conversions = Math.round(clicks * (0.015 + seededRandom(i * 21) * 0.035))
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0
    const cpa = conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0
    const revenue = conversions * (85 + seededRandom(i * 33) * 60)
    const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0

    return { label: p.label, key: p.key, spend, impressions, clicks, cpc, ctr, conversions, cpa, roas, sharePercent: Math.round(p.ratio * 100) }
  })
}

// ── Device Breakdown ──
export function generateDeviceBreakdown(): BreakdownRow[] {
  const totalSpend = 45230
  const devices = [
    { label: "Mobil", key: "mobile", ratio: 0.72 },
    { label: "Masaüstü", key: "desktop", ratio: 0.22 },
    { label: "Tablet", key: "tablet", ratio: 0.06 },
  ]

  return devices.map((d, i) => {
    const spend = Math.round(totalSpend * d.ratio * 100) / 100
    const impressions = Math.round(1245000 * d.ratio * (0.85 + seededRandom(i * 8) * 0.3))
    const clicks = Math.round(impressions * (0.016 + seededRandom(i * 14) * 0.022))
    const conversions = Math.round(clicks * (0.02 + seededRandom(i * 20) * 0.028))
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0
    const cpa = conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0
    const revenue = conversions * (85 + seededRandom(i * 35) * 60)
    const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0

    return { label: d.label, key: d.key, spend, impressions, clicks, cpc, ctr, conversions, cpa, roas, sharePercent: Math.round(d.ratio * 100) }
  })
}

// ── Hourly Breakdown ──
export function generateHourlyBreakdown(): HourlyData[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const seed = hour * 17 + 42
    const isPeak = hour >= 9 && hour <= 23
    const isLate = hour >= 20 && hour <= 23
    const baseFactor = isPeak ? (isLate ? 1.3 : 1.0) : 0.3

    const spend = Math.round((baseFactor * 1800 + seededRandom(seed) * 800) * 100) / 100
    const impressions = Math.round((baseFactor * 48000 + seededRandom(seed + 1) * 20000))
    const clicks = Math.round(impressions * (0.02 + seededRandom(seed + 2) * 0.015))
    const conversions = Math.round(clicks * (0.02 + seededRandom(seed + 3) * 0.02))
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0

    return {
      hour,
      label: `${hour.toString().padStart(2, "0")}:00`,
      spend,
      impressions,
      clicks,
      conversions,
      ctr,
    }
  })
}

// ── Region Breakdown ──
export function generateRegionBreakdown(): RegionData[] {
  const regions = [
    { region: "İstanbul", code: "IST", base: 0.32 },
    { region: "Ankara", code: "ANK", base: 0.14 },
    { region: "İzmir", code: "IZM", base: 0.10 },
    { region: "Bursa", code: "BRS", base: 0.06 },
    { region: "Antalya", code: "ANT", base: 0.06 },
    { region: "Adana", code: "ADA", base: 0.04 },
    { region: "Konya", code: "KNY", base: 0.04 },
    { region: "Gaziantep", code: "GAZ", base: 0.04 },
    { region: "Mersin", code: "MER", base: 0.03 },
    { region: "Kocaeli", code: "KOC", base: 0.03 },
    { region: "Eskişehir", code: "ESK", base: 0.02 },
    { region: "Samsun", code: "SAM", base: 0.02 },
    { region: "Trabzon", code: "TRB", base: 0.02 },
    { region: "Diyarbakır", code: "DYR", base: 0.02 },
    { region: "Diğer", code: "OTH", base: 0.06 },
  ]

  const totalSpend = 45230

  return regions.map((r, i) => {
    const spend = Math.round(totalSpend * r.base * 100) / 100
    const impressions = Math.round(1245000 * r.base * (0.8 + seededRandom(i * 11) * 0.4))
    const clicks = Math.round(impressions * (0.018 + seededRandom(i * 17) * 0.02))
    const conversions = Math.round(clicks * (0.02 + seededRandom(i * 23) * 0.025))
    const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0
    const cpc = clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0

    return { region: r.region, code: r.code, spend, impressions, clicks, conversions, ctr, cpc }
  })
}

// ── Funnel Data ──
export function generateFunnelData(): FunnelStep[] {
  const steps = [
    { label: "Gösterimler", value: 1245000, color: "#3b82f6" },
    { label: "Tıklamalar", value: 34520, color: "#06b6d4" },
    { label: "Sayfa Görüntüleme", value: 28340, color: "#10b981" },
    { label: "Sepete Ekleme", value: 4280, color: "#f59e0b" },
    { label: "Ödeme Başlatma", value: 1850, color: "#f97316" },
    { label: "Satın Alma", value: 892, color: "#ef4444" },
  ]

  return steps.map((step, i) => ({
    ...step,
    percent: i === 0 ? 100 : Math.round((step.value / steps[0].value) * 10000) / 100,
    dropoff: i === 0 ? 0 : Math.round((1 - step.value / steps[i - 1].value) * 100),
  }))
}

// ── Campaign Comparison ──
export function generateComparisonData(campaignAId: string, campaignBId: string): {
  metrics: ComparisonMetric[]
  trend: TrendComparison[]
} {
  const campaigns = generateMockCampaigns()
  const a = campaigns.find(c => c.id === campaignAId)
  const b = campaigns.find(c => c.id === campaignBId)

  if (!a || !b) return { metrics: [], trend: [] }

  const determineBetter = (valA: number, valB: number, lowerIsBetter = false): "A" | "B" | "equal" => {
    if (Math.abs(valA - valB) / Math.max(valA, valB) < 0.01) return "equal"
    if (lowerIsBetter) return valA < valB ? "A" : "B"
    return valA > valB ? "A" : "B"
  }

  const metrics: ComparisonMetric[] = [
    { label: "Harcama", key: "spend", campaignA: a.spend, campaignB: b.spend, format: "currency", better: determineBetter(a.spend, b.spend, true) },
    { label: "Gösterim", key: "impressions", campaignA: a.impressions, campaignB: b.impressions, format: "number", better: determineBetter(a.impressions, b.impressions) },
    { label: "Tıklama", key: "clicks", campaignA: a.clicks, campaignB: b.clicks, format: "number", better: determineBetter(a.clicks, b.clicks) },
    { label: "CPC", key: "cpc", campaignA: a.cpc, campaignB: b.cpc, format: "currency", better: determineBetter(a.cpc, b.cpc, true) },
    { label: "CTR", key: "ctr", campaignA: a.ctr, campaignB: b.ctr, format: "percent", better: determineBetter(a.ctr, b.ctr) },
    { label: "Dönüşüm", key: "conversions", campaignA: a.conversions, campaignB: b.conversions, format: "number", better: determineBetter(a.conversions, b.conversions) },
    { label: "ROAS", key: "roas", campaignA: a.roas, campaignB: b.roas, format: "number", better: determineBetter(a.roas, b.roas) },
  ]

  const trend: TrendComparison[] = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const seedA = date.getDate() * 31 + campaignAId.charCodeAt(campaignAId.length - 1)
    const seedB = date.getDate() * 31 + campaignBId.charCodeAt(campaignBId.length - 1)
    const factorA = 0.7 + seededRandom(seedA + i) * 0.6
    const factorB = 0.7 + seededRandom(seedB + i * 2) * 0.6

    return {
      date: format(date, "dd.MM"),
      campaignA: Math.round((a.spend / 7) * factorA * 100) / 100,
      campaignB: Math.round((b.spend / 7) * factorB * 100) / 100,
    }
  })

  return { metrics, trend }
}

// ── Performance Over Time (30 days) ──
export function generatePerformanceTrend(days: number = 30): Array<{
  date: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  cpc: number
  ctr: number
  roas: number
  revenue: number
}> {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const seed = date.getDate() * 31 + date.getMonth() * 12 + 100
    const dayOfWeek = date.getDay()
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1
    const trendFactor = 1 + (i / days) * 0.2

    const spend = Math.round((1500 + seededRandom(seed) * 800) * weekendFactor * trendFactor * 100) / 100
    const impressions = Math.round((38000 + seededRandom(seed + 1) * 22000) * weekendFactor * trendFactor)
    const clicks = Math.round(impressions * (0.02 + seededRandom(seed + 2) * 0.015))
    const conversions = Math.round(clicks * (0.022 + seededRandom(seed + 3) * 0.018))
    const revenue = Math.round(conversions * (85 + seededRandom(seed + 4) * 60) * 100) / 100

    return {
      date: format(date, "dd.MM"),
      spend,
      impressions,
      clicks,
      conversions,
      cpc: clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
      revenue,
    }
  })
}

// ── Heatmap Data (day x hour) ──
export interface HeatmapCell {
  day: number
  dayLabel: string
  hour: number
  hourLabel: string
  value: number
  normalizedValue: number
}

export function generateHeatmapData(metric: "clicks" | "conversions" | "spend" | "ctr" = "clicks"): HeatmapCell[] {
  const dayLabels = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]
  const cells: HeatmapCell[] = []
  let maxVal = 0

  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const seed = day * 24 + hour + 500
      const isPeak = hour >= 9 && hour <= 23
      const isWeekend = day === 0 || day === 6
      const baseFactor = isPeak ? (isWeekend ? 0.8 : 1.2) : 0.3

      let value: number
      switch (metric) {
        case "spend": value = Math.round(baseFactor * (50 + seededRandom(seed) * 40) * 100) / 100; break
        case "clicks": value = Math.round(baseFactor * (120 + seededRandom(seed) * 100)); break
        case "conversions": value = Math.round(baseFactor * (8 + seededRandom(seed) * 6)); break
        case "ctr": value = Math.round((0.8 + baseFactor * (1.5 + seededRandom(seed) * 1.2)) * 100) / 100; break
      }

      maxVal = Math.max(maxVal, value)
      cells.push({ day, dayLabel: dayLabels[day], hour, hourLabel: `${hour.toString().padStart(2, "0")}:00`, value, normalizedValue: 0 })
    }
  }

  return cells.map(c => ({ ...c, normalizedValue: maxVal > 0 ? c.value / maxVal : 0 }))
}
