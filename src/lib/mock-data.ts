import { subDays, format } from "date-fns"
import type { KPIData, SpendChartData, CampaignTableRow, AlertItem } from "@/types/app"

// Deterministic seed-based random for consistent server/client rendering
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateMockAccounts() {
  return [
    {
      id: "act_123456789",
      name: "TechStore E-Ticaret",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      status: 1,
      businessName: "TechStore A.Ş.",
    },
    {
      id: "act_987654321",
      name: "FashionBrand Türkiye",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      status: 1,
      businessName: "Fashion Group Ltd.",
    },
    {
      id: "act_456789123",
      name: "FoodDelivery App",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      status: 1,
      businessName: "Yemek Sepeti Digital",
    },
  ]
}

export function generateMockKPIs(datePreset: string = "last_7d"): KPIData[] {
  const multiplier = datePreset === "last_30d" ? 4.2 : datePreset === "last_14d" ? 2.1 : 1

  return [
    {
      label: "Toplam Harcama",
      value: 45230.5 * multiplier,
      previousValue: 38750.0 * multiplier,
      format: "currency",
      changePercent: 16.7,
      trend: "up",
    },
    {
      label: "Gösterim",
      value: Math.round(1245000 * multiplier),
      previousValue: Math.round(1120000 * multiplier),
      format: "number",
      changePercent: 11.2,
      trend: "up",
    },
    {
      label: "Tıklama",
      value: Math.round(34520 * multiplier),
      previousValue: Math.round(31200 * multiplier),
      format: "number",
      changePercent: 10.6,
      trend: "up",
    },
    {
      label: "Dönüşüm",
      value: Math.round(892 * multiplier),
      previousValue: Math.round(845 * multiplier),
      format: "number",
      changePercent: 5.6,
      trend: "up",
    },
    {
      label: "CPC",
      value: 1.31,
      previousValue: 1.24,
      format: "currency",
      changePercent: 5.6,
      trend: "up",
    },
    {
      label: "CTR",
      value: 2.77,
      previousValue: 2.79,
      format: "percent",
      changePercent: -0.7,
      trend: "down",
    },
    {
      label: "CPM",
      value: 36.32,
      previousValue: 34.6,
      format: "currency",
      changePercent: 5.0,
      trend: "up",
    },
    {
      label: "ROAS",
      value: 4.82,
      previousValue: 4.58,
      format: "number",
      changePercent: 5.2,
      trend: "up",
    },
  ]
}

export function generateMockDailyInsights(days: number = 7): SpendChartData[] {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const seed = date.getDate() * 31 + date.getMonth() * 12
    const dayOfWeek = date.getDay()

    // Weekend dips
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1
    // Slight upward trend
    const trendFactor = 1 + (i / days) * 0.15

    const baseSpend = 5800 + seededRandom(seed) * 2500
    const spend = baseSpend * weekendFactor * trendFactor

    const impressions = Math.round((150000 + seededRandom(seed + 1) * 80000) * weekendFactor * trendFactor)
    const clicks = Math.round(impressions * (0.022 + seededRandom(seed + 2) * 0.012))
    const conversions = Math.round(clicks * (0.025 + seededRandom(seed + 3) * 0.015))

    return {
      date: format(date, "dd.MM"),
      spend: Math.round(spend * 100) / 100,
      impressions,
      clicks,
      cpc: Math.round((spend / clicks) * 100) / 100,
      ctr: Math.round((clicks / impressions) * 10000) / 100,
      conversions,
      revenue: Math.round(conversions * (85 + seededRandom(seed + 4) * 60) * 100) / 100,
    }
  })
}

export function generateMockCampaigns(): CampaignTableRow[] {
  return [
    {
      id: "camp_001",
      name: "E-Ticaret Satış — Geniş Hedefleme",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_SALES",
      dailyBudget: 850,
      lifetimeBudget: null,
      spend: 18450.0,
      impressions: 456000,
      clicks: 6720,
      cpc: 2.75,
      ctr: 1.47,
      conversions: 189,
      roas: 5.2,
      learningPhase: "SUCCESS",
      opportunityScore: 85,
    },
    {
      id: "camp_002",
      name: "Marka Bilinirliği — İstanbul & Ankara",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_AWARENESS",
      dailyBudget: 450,
      lifetimeBudget: null,
      spend: 12750.0,
      impressions: 1890000,
      clicks: 4200,
      cpc: 3.04,
      ctr: 0.22,
      conversions: 0,
      roas: 0,
      learningPhase: "LEARNING",
      opportunityScore: 62,
    },
    {
      id: "camp_003",
      name: "Lead Gen — B2B Yazılım Demo",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_LEADS",
      dailyBudget: 350,
      lifetimeBudget: null,
      spend: 9890.0,
      impressions: 234000,
      clicks: 5200,
      cpc: 1.90,
      ctr: 2.22,
      conversions: 78,
      roas: 0,
      learningPhase: "SUCCESS",
      opportunityScore: 88,
    },
    {
      id: "camp_004",
      name: "Retargeting — Sepet Terk Edenlere",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_SALES",
      dailyBudget: 250,
      lifetimeBudget: null,
      spend: 5420.0,
      impressions: 180000,
      clicks: 3800,
      cpc: 1.43,
      ctr: 2.11,
      conversions: 134,
      roas: 7.8,
      learningPhase: "SUCCESS",
      opportunityScore: 94,
    },
    {
      id: "camp_005",
      name: "Instagram Stories — Ürün Lansman",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_ENGAGEMENT",
      dailyBudget: 300,
      lifetimeBudget: null,
      spend: 7120.0,
      impressions: 756000,
      clicks: 8830,
      cpc: 0.81,
      ctr: 1.17,
      conversions: 45,
      roas: 2.1,
      learningPhase: "SUCCESS",
      opportunityScore: 71,
    },
    {
      id: "camp_006",
      name: "Lookalike — Satın Alan Müşteri %1",
      status: "PAUSED",
      effectiveStatus: "PAUSED",
      objective: "OUTCOME_SALES",
      dailyBudget: 200,
      lifetimeBudget: null,
      spend: 3420.0,
      impressions: 120000,
      clicks: 1800,
      cpc: 1.90,
      ctr: 1.50,
      conversions: 34,
      roas: 5.8,
      learningPhase: null,
      opportunityScore: 91,
    },
    {
      id: "camp_007",
      name: "Video Görüntüleme — Tanıtım Filmi",
      status: "ACTIVE",
      effectiveStatus: "ACTIVE",
      objective: "OUTCOME_AWARENESS",
      dailyBudget: 180,
      lifetimeBudget: null,
      spend: 4250.0,
      impressions: 890000,
      clicks: 2100,
      cpc: 2.02,
      ctr: 0.24,
      conversions: 0,
      roas: 0,
      learningPhase: "LEARNING",
      opportunityScore: 55,
    },
    {
      id: "camp_008",
      name: "DPA — Ürün Kataloğu Dinamik",
      status: "ACTIVE",
      effectiveStatus: "WITH_ISSUES",
      objective: "OUTCOME_SALES",
      dailyBudget: 400,
      lifetimeBudget: null,
      spend: 2180.0,
      impressions: 89000,
      clicks: 1200,
      cpc: 1.82,
      ctr: 1.35,
      conversions: 22,
      roas: 3.4,
      learningPhase: "FAIL",
      opportunityScore: 38,
    },
  ]
}

export function generateMockAlerts(): AlertItem[] {
  return [
    {
      id: "alert_001",
      type: "CPC_SPIKE",
      severity: "warning",
      title: "CPC Artışı Tespit Edildi",
      message: "\"Marka Bilinirliği\" kampanyasında CPC son 24 saatte %23 arttı. Hedefleme ayarlarını kontrol edin.",
      entityType: "campaign",
      entityId: "camp_002",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "alert_002",
      type: "BUDGET_ALERT",
      severity: "critical",
      title: "Bütçe Limiti Yaklaşıyor",
      message: "\"E-Ticaret Satış\" kampanyası günlük bütçesinin %92'sini harcadı. Bütçe artışı değerlendirin.",
      entityType: "campaign",
      entityId: "camp_001",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "alert_003",
      type: "LEARNING_LIMITED",
      severity: "warning",
      title: "Öğrenme Sınırlı",
      message: "\"DPA — Ürün Kataloğu\" kampanyası öğrenme sürecini tamamlayamadı. Haftalık 50+ dönüşüm hedefleyin.",
      entityType: "campaign",
      entityId: "camp_008",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "alert_004",
      type: "SPEND_ANOMALY",
      severity: "info",
      title: "Harcama Trendi Pozitif",
      message: "Genel hesap harcaması bu hafta %16.7 arttı. ROAS stabil — ölçekleme fırsatı.",
      entityType: "account",
      entityId: "act_123456789",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "alert_005",
      type: "CREATIVE_FATIGUE",
      severity: "warning",
      title: "Kreatif Yorgunluğu",
      message: "\"Instagram Stories\" kampanyasında frekans 4.2'ye ulaştı. Yeni kreatifler eklenmeli.",
      entityType: "campaign",
      entityId: "camp_005",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ]
}

export interface CampaignDetail extends CampaignTableRow {
  bidStrategy: string
  budgetType: "DAILY" | "LIFETIME"
  specialAdCategories: string[]
  startTime: string
  endTime: string | null
  createdTime: string
  updatedTime: string
  adSetCount: number
  adCount: number
}

export function generateMockCampaignDetail(id: string): CampaignDetail | null {
  const campaigns = generateMockCampaigns()
  const campaign = campaigns.find(c => c.id === id)
  if (!campaign) return null

  return {
    ...campaign,
    bidStrategy: campaign.objective === "OUTCOME_SALES" ? "COST_CAP" : "LOWEST_COST_WITHOUT_CAP",
    budgetType: "DAILY",
    specialAdCategories: ["NONE"],
    startTime: subDays(new Date(), 30).toISOString(),
    endTime: null,
    createdTime: subDays(new Date(), 45).toISOString(),
    updatedTime: subDays(new Date(), 2).toISOString(),
    adSetCount: Math.floor(Math.random() * 4) + 1,
    adCount: Math.floor(Math.random() * 8) + 2,
  }
}

export interface MockAdSet {
  id: string
  campaignId: string
  campaignName: string
  name: string
  status: string
  effectiveStatus: string
  optimizationGoal: string
  billingEvent: string
  dailyBudget: number | null
  spend: number
  impressions: number
  clicks: number
  cpc: number
  ctr: number
  conversions: number
  reach: number
  frequency: number
  learningPhase: string | null
  targetingSummary: string
  placements: string
}

export function generateMockAdSets(campaignId?: string): MockAdSet[] {
  const allAdSets: MockAdSet[] = [
    {
      id: "adset_001", campaignId: "camp_001", campaignName: "E-Ticaret Satış — Geniş Hedefleme",
      name: "Geniş Hedefleme — 25-45 Kadın", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "OFFSITE_CONVERSIONS", billingEvent: "IMPRESSIONS",
      dailyBudget: 350, spend: 8420, impressions: 234000, clicks: 3450,
      cpc: 2.44, ctr: 1.47, conversions: 98, reach: 189000, frequency: 1.24,
      learningPhase: "SUCCESS", targetingSummary: "Kadın, 25-45, İstanbul, Online Alışveriş İlgileri",
      placements: "Advantage+ Placements",
    },
    {
      id: "adset_002", campaignId: "camp_001", campaignName: "E-Ticaret Satış — Geniş Hedefleme",
      name: "Retargeting — Site Ziyaretçileri", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "OFFSITE_CONVERSIONS", billingEvent: "IMPRESSIONS",
      dailyBudget: 250, spend: 5430, impressions: 145000, clicks: 2870,
      cpc: 1.89, ctr: 1.98, conversions: 67, reach: 45000, frequency: 3.22,
      learningPhase: "SUCCESS", targetingSummary: "Custom Audience: Site Ziyaretçileri (30 gün)",
      placements: "Facebook Feed, Instagram Feed",
    },
    {
      id: "adset_003", campaignId: "camp_001", campaignName: "E-Ticaret Satış — Geniş Hedefleme",
      name: "Lookalike — Satın Alanlar %1", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "OFFSITE_CONVERSIONS", billingEvent: "IMPRESSIONS",
      dailyBudget: 250, spend: 4600, impressions: 77000, clicks: 400,
      cpc: 11.5, ctr: 0.52, conversions: 24, reach: 65000, frequency: 1.18,
      learningPhase: "LEARNING", targetingSummary: "Lookalike %1, Türkiye, 25-55",
      placements: "Advantage+ Placements",
    },
    {
      id: "adset_004", campaignId: "camp_002", campaignName: "Marka Bilinirliği — İstanbul & Ankara",
      name: "İstanbul — 18-35 Genel", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "REACH", billingEvent: "IMPRESSIONS",
      dailyBudget: 250, spend: 7200, impressions: 1200000, clicks: 2800,
      cpc: 2.57, ctr: 0.23, conversions: 0, reach: 890000, frequency: 1.35,
      learningPhase: "SUCCESS", targetingSummary: "18-35, İstanbul, Tüm Cinsiyetler",
      placements: "Advantage+ Placements",
    },
    {
      id: "adset_005", campaignId: "camp_002", campaignName: "Marka Bilinirliği — İstanbul & Ankara",
      name: "Ankara — 18-35 Genel", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "REACH", billingEvent: "IMPRESSIONS",
      dailyBudget: 200, spend: 5550, impressions: 690000, clicks: 1400,
      cpc: 3.96, ctr: 0.20, conversions: 0, reach: 520000, frequency: 1.33,
      learningPhase: "SUCCESS", targetingSummary: "18-35, Ankara, Tüm Cinsiyetler",
      placements: "Facebook Feed, Instagram Feed, Stories",
    },
    {
      id: "adset_006", campaignId: "camp_003", campaignName: "Lead Gen — B2B Yazılım Demo",
      name: "IT Yöneticileri — Kurumsal", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "LEAD_GENERATION", billingEvent: "IMPRESSIONS",
      dailyBudget: 350, spend: 9890, impressions: 234000, clicks: 5200,
      cpc: 1.90, ctr: 2.22, conversions: 78, reach: 156000, frequency: 1.50,
      learningPhase: "SUCCESS", targetingSummary: "IT Yöneticileri, İş İlgileri, 28-55",
      placements: "Facebook Feed, Instagram Feed",
    },
    {
      id: "adset_007", campaignId: "camp_004", campaignName: "Retargeting — Sepet Terk Edenlere",
      name: "Sepet Terk — Son 7 Gün", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "OFFSITE_CONVERSIONS", billingEvent: "IMPRESSIONS",
      dailyBudget: 250, spend: 5420, impressions: 180000, clicks: 3800,
      cpc: 1.43, ctr: 2.11, conversions: 134, reach: 32000, frequency: 5.63,
      learningPhase: "SUCCESS", targetingSummary: "Custom Audience: Sepet Terk (7 gün)",
      placements: "Facebook Feed, Instagram Feed, Stories",
    },
    {
      id: "adset_008", campaignId: "camp_005", campaignName: "Instagram Stories — Ürün Lansman",
      name: "Genç Kitle — Stories Only", status: "ACTIVE", effectiveStatus: "ACTIVE",
      optimizationGoal: "THRUPLAY", billingEvent: "IMPRESSIONS",
      dailyBudget: 300, spend: 7120, impressions: 756000, clicks: 8830,
      cpc: 0.81, ctr: 1.17, conversions: 45, reach: 420000, frequency: 1.80,
      learningPhase: "SUCCESS", targetingSummary: "18-28, Türkiye, Moda & Teknoloji İlgileri",
      placements: "Instagram Stories, Instagram Reels",
    },
  ]

  if (campaignId) {
    return allAdSets.filter(a => a.campaignId === campaignId)
  }
  return allAdSets
}

export interface MockAd {
  id: string
  adSetId: string
  adSetName: string
  campaignId: string
  name: string
  status: string
  effectiveStatus: string
  creativeFormat: string
  primaryText: string
  headline: string
  ctaType: string
  spend: number
  impressions: number
  clicks: number
  cpc: number
  ctr: number
  conversions: number
  qualityRanking: string
  engagementRanking: string
  conversionRanking: string
  thumbnailUrl: string | null
}

export function generateMockAds(adSetId?: string): MockAd[] {
  const allAds: MockAd[] = [
    {
      id: "ad_001", adSetId: "adset_001", campaignId: "camp_001",
      adSetName: "Geniş Hedefleme — 25-45 Kadın",
      name: "Kış Koleksiyonu — Carousel", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "CAROUSEL", primaryText: "Yeni sezon ürünleri ile tarzınızı yansıtın! 🎉",
      headline: "Kış Koleksiyonu Geldi", ctaType: "SHOP_NOW",
      spend: 4210, impressions: 117000, clicks: 1840, cpc: 2.29, ctr: 1.57,
      conversions: 52, qualityRanking: "ABOVE_AVERAGE_35", engagementRanking: "ABOVE_AVERAGE_35",
      conversionRanking: "AVERAGE", thumbnailUrl: null,
    },
    {
      id: "ad_002", adSetId: "adset_001", campaignId: "camp_001",
      adSetName: "Geniş Hedefleme — 25-45 Kadın",
      name: "Fırsat Ürünleri — Single Image", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "SINGLE_IMAGE", primaryText: "%50'ye varan indirimlerle alışverişin keyfini çıkarın.",
      headline: "Fırsatlar Sizi Bekliyor", ctaType: "SHOP_NOW",
      spend: 4210, impressions: 117000, clicks: 1610, cpc: 2.61, ctr: 1.38,
      conversions: 46, qualityRanking: "AVERAGE", engagementRanking: "AVERAGE",
      conversionRanking: "ABOVE_AVERAGE_35", thumbnailUrl: null,
    },
    {
      id: "ad_003", adSetId: "adset_002", campaignId: "camp_001",
      adSetName: "Retargeting — Site Ziyaretçileri",
      name: "DPA — Dinamik Ürün", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "CAROUSEL", primaryText: "Beğendiğiniz ürünler hâlâ sizi bekliyor!",
      headline: "Sepetinize Dönün", ctaType: "SHOP_NOW",
      spend: 5430, impressions: 145000, clicks: 2870, cpc: 1.89, ctr: 1.98,
      conversions: 67, qualityRanking: "ABOVE_AVERAGE_35", engagementRanking: "ABOVE_AVERAGE_35",
      conversionRanking: "ABOVE_AVERAGE_35", thumbnailUrl: null,
    },
    {
      id: "ad_004", adSetId: "adset_006", campaignId: "camp_003",
      adSetName: "IT Yöneticileri — Kurumsal",
      name: "Demo Video — CRM Çözümü", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "SINGLE_VIDEO", primaryText: "İş süreçlerinizi %40 hızlandıran CRM çözümü. Ücretsiz demo talep edin.",
      headline: "Ücretsiz Demo Alın", ctaType: "SIGN_UP",
      spend: 5340, impressions: 128000, clicks: 3100, cpc: 1.72, ctr: 2.42,
      conversions: 45, qualityRanking: "ABOVE_AVERAGE_35", engagementRanking: "ABOVE_AVERAGE_35",
      conversionRanking: "ABOVE_AVERAGE_35", thumbnailUrl: null,
    },
    {
      id: "ad_005", adSetId: "adset_006", campaignId: "camp_003",
      adSetName: "IT Yöneticileri — Kurumsal",
      name: "Testimonial — Müşteri Hikayesi", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "SINGLE_IMAGE", primaryText: "\"Bu çözüm ile ekibimiz %60 daha verimli çalışıyor\" — Ahmet B., CTO",
      headline: "Başarı Hikayesi", ctaType: "LEARN_MORE",
      spend: 4550, impressions: 106000, clicks: 2100, cpc: 2.17, ctr: 1.98,
      conversions: 33, qualityRanking: "AVERAGE", engagementRanking: "ABOVE_AVERAGE_35",
      conversionRanking: "AVERAGE", thumbnailUrl: null,
    },
    {
      id: "ad_006", adSetId: "adset_008", campaignId: "camp_005",
      adSetName: "Genç Kitle — Stories Only",
      name: "Stories — Ürün Unboxing", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "SINGLE_VIDEO", primaryText: "Yeni ürünümüzü keşfedin! 📦✨",
      headline: "Şimdi Keşfet", ctaType: "SHOP_NOW",
      spend: 3560, impressions: 378000, clicks: 4800, cpc: 0.74, ctr: 1.27,
      conversions: 28, qualityRanking: "ABOVE_AVERAGE_35", engagementRanking: "ABOVE_AVERAGE_35",
      conversionRanking: "AVERAGE", thumbnailUrl: null,
    },
    {
      id: "ad_007", adSetId: "adset_008", campaignId: "camp_005",
      adSetName: "Genç Kitle — Stories Only",
      name: "Reels — Ürün Tanıtım", status: "ACTIVE", effectiveStatus: "ACTIVE",
      creativeFormat: "SINGLE_VIDEO", primaryText: "Trend olan ürünü kaçırmayın! 🔥",
      headline: "Hemen Al", ctaType: "SHOP_NOW",
      spend: 3560, impressions: 378000, clicks: 4030, cpc: 0.88, ctr: 1.07,
      conversions: 17, qualityRanking: "AVERAGE", engagementRanking: "AVERAGE",
      conversionRanking: "BELOW_AVERAGE_35", thumbnailUrl: null,
    },
  ]

  if (adSetId) {
    return allAds.filter(a => a.adSetId === adSetId)
  }
  return allAds
}

export function generateCampaignDailyInsights(campaignId: string, days: number = 7): SpendChartData[] {
  const campaign = generateMockCampaigns().find(c => c.id === campaignId)
  if (!campaign) return []

  const baseDailySpend = campaign.spend / days

  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const seed = date.getDate() * 31 + campaignId.charCodeAt(campaignId.length - 1)
    const factor = 0.7 + seededRandom(seed + i) * 0.6

    const spend = Math.round(baseDailySpend * factor * 100) / 100
    const impressions = Math.round((campaign.impressions / days) * factor)
    const clicks = Math.round((campaign.clicks / days) * factor)
    const conversions = Math.round((campaign.conversions / days) * factor)

    return {
      date: format(date, "dd.MM"),
      spend,
      impressions,
      clicks,
      cpc: clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      conversions,
      revenue: Math.round(conversions * (85 + seededRandom(seed + 10) * 60) * 100) / 100,
    }
  })
}

export interface AccountSummary {
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  avgCpc: number
  avgCtr: number
  avgCpm: number
  roas: number
  activeCampaigns: number
  pausedCampaigns: number
  totalCampaigns: number
}

export function generateMockAccountSummary(): AccountSummary {
  const campaigns = generateMockCampaigns()
  const active = campaigns.filter(c => c.effectiveStatus === "ACTIVE")
  const paused = campaigns.filter(c => c.effectiveStatus === "PAUSED")

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCpc: totalSpend / totalClicks,
    avgCtr: (totalClicks / totalImpressions) * 100,
    avgCpm: (totalSpend / totalImpressions) * 1000,
    roas: 4.82,
    activeCampaigns: active.length,
    pausedCampaigns: paused.length,
    totalCampaigns: campaigns.length,
  }
}
