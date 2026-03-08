import { subDays, subHours, format } from "date-fns"

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ── Pixel Event Types ──
export interface PixelEvent {
  id: string
  eventName: string
  eventCategory: "standard" | "custom"
  source: "pixel" | "capi" | "both"
  totalEvents: number
  matchedEvents: number
  matchRate: number
  deduplicatedEvents: number
  trend: "up" | "down" | "flat"
  trendPercent: number
  lastReceived: string
  isActive: boolean
}

export interface PixelOverview {
  pixelId: string
  pixelName: string
  status: "active" | "inactive" | "error"
  lastActivity: string
  totalEventsToday: number
  totalEventsYesterday: number
  emqScore: number
  emqTrend: "up" | "down" | "flat"
  browserEvents: number
  serverEvents: number
  matchRate: number
  deduplicationRate: number
  domainVerified: boolean
  domain: string
}

export interface EMQParameter {
  name: string
  label: string
  coverage: number
  quality: "excellent" | "good" | "fair" | "poor"
  description: string
  recommendation: string | null
}

export interface PixelEventTrend {
  date: string
  browserEvents: number
  serverEvents: number
  matchedEvents: number
  totalEvents: number
}

export interface EMQBreakdown {
  eventName: string
  emqScore: number
  parameters: EMQParameter[]
  totalEvents: number
  matchRate: number
}

// ── Audience Types ──
export interface AudienceItem {
  id: string
  name: string
  type: "custom" | "lookalike" | "saved"
  subtype: string
  status: "ready" | "updating" | "too_small" | "expired"
  size: number
  sizeRange: string
  sourceAudienceId: string | null
  sourceAudienceName: string | null
  lookalikePercent: number | null
  country: string | null
  retentionDays: number | null
  createdAt: string
  updatedAt: string
  usedInCampaigns: number
  description: string
}

// ── Pixel Overview ──
export function generatePixelOverview(): PixelOverview {
  return {
    pixelId: "px_987654321",
    pixelName: "TechStore - Ana Pixel",
    status: "active",
    lastActivity: subHours(new Date(), 1).toISOString(),
    totalEventsToday: 48720,
    totalEventsYesterday: 42350,
    emqScore: 7.8,
    emqTrend: "up",
    browserEvents: 32480,
    serverEvents: 28640,
    matchRate: 72.4,
    deduplicationRate: 18.3,
    domainVerified: true,
    domain: "techstore.com.tr",
  }
}

// ── Pixel Events ──
export function generatePixelEvents(): PixelEvent[] {
  return [
    {
      id: "evt_001", eventName: "PageView", eventCategory: "standard",
      source: "both", totalEvents: 156420, matchedEvents: 118340, matchRate: 75.6,
      deduplicatedEvents: 28450, trend: "up", trendPercent: 8.2,
      lastReceived: subHours(new Date(), 0.1).toISOString(), isActive: true,
    },
    {
      id: "evt_002", eventName: "ViewContent", eventCategory: "standard",
      source: "both", totalEvents: 42380, matchedEvents: 31200, matchRate: 73.6,
      deduplicatedEvents: 8450, trend: "up", trendPercent: 5.4,
      lastReceived: subHours(new Date(), 0.2).toISOString(), isActive: true,
    },
    {
      id: "evt_003", eventName: "AddToCart", eventCategory: "standard",
      source: "both", totalEvents: 8920, matchedEvents: 7140, matchRate: 80.0,
      deduplicatedEvents: 1680, trend: "up", trendPercent: 12.1,
      lastReceived: subHours(new Date(), 0.5).toISOString(), isActive: true,
    },
    {
      id: "evt_004", eventName: "InitiateCheckout", eventCategory: "standard",
      source: "both", totalEvents: 3840, matchedEvents: 3260, matchRate: 84.9,
      deduplicatedEvents: 580, trend: "flat", trendPercent: 1.2,
      lastReceived: subHours(new Date(), 1).toISOString(), isActive: true,
    },
    {
      id: "evt_005", eventName: "Purchase", eventCategory: "standard",
      source: "both", totalEvents: 1845, matchedEvents: 1620, matchRate: 87.8,
      deduplicatedEvents: 225, trend: "up", trendPercent: 6.7,
      lastReceived: subHours(new Date(), 0.8).toISOString(), isActive: true,
    },
    {
      id: "evt_006", eventName: "Lead", eventCategory: "standard",
      source: "capi", totalEvents: 624, matchedEvents: 580, matchRate: 93.0,
      deduplicatedEvents: 44, trend: "up", trendPercent: 15.3,
      lastReceived: subHours(new Date(), 2).toISOString(), isActive: true,
    },
    {
      id: "evt_007", eventName: "CompleteRegistration", eventCategory: "standard",
      source: "both", totalEvents: 1256, matchedEvents: 940, matchRate: 74.8,
      deduplicatedEvents: 316, trend: "down", trendPercent: -3.2,
      lastReceived: subHours(new Date(), 3).toISOString(), isActive: true,
    },
    {
      id: "evt_008", eventName: "Search", eventCategory: "standard",
      source: "pixel", totalEvents: 12340, matchedEvents: 6780, matchRate: 54.9,
      deduplicatedEvents: 0, trend: "flat", trendPercent: 0.8,
      lastReceived: subHours(new Date(), 0.3).toISOString(), isActive: true,
    },
    {
      id: "evt_009", eventName: "AddPaymentInfo", eventCategory: "standard",
      source: "both", totalEvents: 2180, matchedEvents: 1890, matchRate: 86.7,
      deduplicatedEvents: 290, trend: "up", trendPercent: 4.5,
      lastReceived: subHours(new Date(), 1.5).toISOString(), isActive: true,
    },
    {
      id: "evt_010", eventName: "WishlistAdd", eventCategory: "custom",
      source: "pixel", totalEvents: 3420, matchedEvents: 1850, matchRate: 54.1,
      deduplicatedEvents: 0, trend: "down", trendPercent: -7.4,
      lastReceived: subHours(new Date(), 4).toISOString(), isActive: true,
    },
    {
      id: "evt_011", eventName: "NewsletterSignup", eventCategory: "custom",
      source: "capi", totalEvents: 890, matchedEvents: 834, matchRate: 93.7,
      deduplicatedEvents: 56, trend: "up", trendPercent: 22.1,
      lastReceived: subHours(new Date(), 6).toISOString(), isActive: true,
    },
  ]
}

// ── Event Trend Data (7 days) ──
export function generateEventTrend(days: number = 7): PixelEventTrend[] {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const seed = date.getDate() * 31 + 200
    const dayOfWeek = date.getDay()
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1
    const trendFactor = 1 + (i / days) * 0.12

    const browserEvents = Math.round((28000 + seededRandom(seed) * 12000) * weekendFactor * trendFactor)
    const serverEvents = Math.round((22000 + seededRandom(seed + 1) * 10000) * weekendFactor * trendFactor)
    const totalEvents = browserEvents + serverEvents
    const matchedEvents = Math.round(totalEvents * (0.68 + seededRandom(seed + 2) * 0.12))

    return {
      date: format(date, "dd.MM"),
      browserEvents,
      serverEvents,
      matchedEvents,
      totalEvents,
    }
  })
}

// ── EMQ Breakdown ──
export function generateEMQBreakdown(): EMQBreakdown[] {
  const events = generatePixelEvents().filter(e => e.source !== "pixel")

  return events.map((evt, i) => {
    const seed = i * 17 + 300
    const baseScore = 5.5 + seededRandom(seed) * 4.5

    const params: EMQParameter[] = [
      {
        name: "em", label: "E-posta (em)",
        coverage: 85 + Math.round(seededRandom(seed + 1) * 14),
        quality: baseScore > 8 ? "excellent" : baseScore > 6 ? "good" : "fair",
        description: "Kullanıcı e-posta adresi hash",
        recommendation: baseScore < 7 ? "Server-side e-posta hash gönderimini aktifleştirin" : null,
      },
      {
        name: "ph", label: "Telefon (ph)",
        coverage: 40 + Math.round(seededRandom(seed + 2) * 45),
        quality: seededRandom(seed + 3) > 0.5 ? "good" : "fair",
        description: "Kullanıcı telefon numarası hash",
        recommendation: "Checkout formuna telefon alanı ekleyin",
      },
      {
        name: "fn", label: "Ad (fn)",
        coverage: 60 + Math.round(seededRandom(seed + 4) * 30),
        quality: seededRandom(seed + 5) > 0.4 ? "good" : "fair",
        description: "Kullanıcı adı hash",
        recommendation: null,
      },
      {
        name: "ln", label: "Soyad (ln)",
        coverage: 58 + Math.round(seededRandom(seed + 6) * 30),
        quality: seededRandom(seed + 7) > 0.4 ? "good" : "fair",
        description: "Kullanıcı soyadı hash",
        recommendation: null,
      },
      {
        name: "ct", label: "Şehir (ct)",
        coverage: 30 + Math.round(seededRandom(seed + 8) * 40),
        quality: seededRandom(seed + 9) > 0.6 ? "fair" : "poor",
        description: "Kullanıcı şehir bilgisi hash",
        recommendation: "Adres bilgilerini CAPI ile gönderin",
      },
      {
        name: "fbp", label: "FB Click ID (fbp)",
        coverage: 92 + Math.round(seededRandom(seed + 10) * 7),
        quality: "excellent",
        description: "Facebook browser click ID",
        recommendation: null,
      },
      {
        name: "fbc", label: "FB Cookie (fbc)",
        coverage: 65 + Math.round(seededRandom(seed + 11) * 25),
        quality: seededRandom(seed + 12) > 0.5 ? "good" : "fair",
        description: "Facebook cookie parameter",
        recommendation: "URL parametrelerinden fbclid yakalayın",
      },
      {
        name: "external_id", label: "External ID",
        coverage: 70 + Math.round(seededRandom(seed + 13) * 25),
        quality: seededRandom(seed + 14) > 0.4 ? "good" : "fair",
        description: "Kendi kullanıcı ID sisteminiz",
        recommendation: null,
      },
    ]

    return {
      eventName: evt.eventName,
      emqScore: Math.round(baseScore * 10) / 10,
      parameters: params,
      totalEvents: evt.totalEvents,
      matchRate: evt.matchRate,
    }
  })
}

// ── Audiences ──
export function generateAudiences(): AudienceItem[] {
  return [
    {
      id: "aud_001", name: "Site Ziyaretçileri — Son 30 Gün",
      type: "custom", subtype: "Website Visitors", status: "ready",
      size: 245000, sizeRange: "200K-300K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 30,
      createdAt: subDays(new Date(), 90).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      usedInCampaigns: 4,
      description: "Son 30 günde web sitesini ziyaret eden tüm kullanıcılar",
    },
    {
      id: "aud_002", name: "Satın Alanlar — Son 180 Gün",
      type: "custom", subtype: "Purchase Events", status: "ready",
      size: 18500, sizeRange: "15K-22K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 180,
      createdAt: subDays(new Date(), 120).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      usedInCampaigns: 6,
      description: "Son 180 günde en az 1 satın alma yapan kullanıcılar",
    },
    {
      id: "aud_003", name: "Sepet Terk Edenler — Son 14 Gün",
      type: "custom", subtype: "AddToCart without Purchase", status: "ready",
      size: 32400, sizeRange: "28K-38K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 14,
      createdAt: subDays(new Date(), 60).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      usedInCampaigns: 2,
      description: "Sepete ürün ekleyip satın alma yapmayan kullanıcılar",
    },
    {
      id: "aud_004", name: "Lookalike — Satın Alanlar %1",
      type: "lookalike", subtype: "Value-Based", status: "ready",
      size: 820000, sizeRange: "750K-900K",
      sourceAudienceId: "aud_002", sourceAudienceName: "Satın Alanlar — Son 180 Gün",
      lookalikePercent: 1, country: "TR", retentionDays: null,
      createdAt: subDays(new Date(), 45).toISOString(),
      updatedAt: subDays(new Date(), 7).toISOString(),
      usedInCampaigns: 3,
      description: "Satın alan müşterilere en benzer %1 kitle",
    },
    {
      id: "aud_005", name: "Lookalike — Satın Alanlar %3",
      type: "lookalike", subtype: "Value-Based", status: "ready",
      size: 2450000, sizeRange: "2.2M-2.7M",
      sourceAudienceId: "aud_002", sourceAudienceName: "Satın Alanlar — Son 180 Gün",
      lookalikePercent: 3, country: "TR", retentionDays: null,
      createdAt: subDays(new Date(), 45).toISOString(),
      updatedAt: subDays(new Date(), 7).toISOString(),
      usedInCampaigns: 1,
      description: "Satın alan müşterilere en benzer %3 kitle",
    },
    {
      id: "aud_006", name: "Lookalike — Site Ziyaretçileri %2",
      type: "lookalike", subtype: "Engagement-Based", status: "ready",
      size: 1640000, sizeRange: "1.5M-1.8M",
      sourceAudienceId: "aud_001", sourceAudienceName: "Site Ziyaretçileri — Son 30 Gün",
      lookalikePercent: 2, country: "TR", retentionDays: null,
      createdAt: subDays(new Date(), 30).toISOString(),
      updatedAt: subDays(new Date(), 5).toISOString(),
      usedInCampaigns: 2,
      description: "Site ziyaretçilerine benzer %2 kitle",
    },
    {
      id: "aud_007", name: "Yüksek Değerli Müşteriler",
      type: "custom", subtype: "Customer List", status: "ready",
      size: 4200, sizeRange: "3.5K-5K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: null,
      createdAt: subDays(new Date(), 150).toISOString(),
      updatedAt: subDays(new Date(), 14).toISOString(),
      usedInCampaigns: 2,
      description: "CLV > ₺5.000 olan müşteriler (CRM entegrasyonu)",
    },
    {
      id: "aud_008", name: "E-posta Aboneleri",
      type: "custom", subtype: "Customer List", status: "updating",
      size: 67800, sizeRange: "60K-75K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: null,
      createdAt: subDays(new Date(), 200).toISOString(),
      updatedAt: subDays(new Date(), 0).toISOString(),
      usedInCampaigns: 1,
      description: "Newsletter abone listesi (son güncelleme devam ediyor)",
    },
    {
      id: "aud_009", name: "Video İzleyenler — %75+",
      type: "custom", subtype: "Video Engagement", status: "ready",
      size: 128000, sizeRange: "110K-145K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 60,
      createdAt: subDays(new Date(), 25).toISOString(),
      updatedAt: subDays(new Date(), 2).toISOString(),
      usedInCampaigns: 1,
      description: "Videoların %75 ve üzerini izleyen kullanıcılar",
    },
    {
      id: "aud_010", name: "Instagram Etkileşim — Son 90 Gün",
      type: "custom", subtype: "Instagram Engagement", status: "ready",
      size: 185000, sizeRange: "170K-200K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 90,
      createdAt: subDays(new Date(), 40).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      usedInCampaigns: 3,
      description: "Instagram profilinizle etkileşime giren kullanıcılar",
    },
    {
      id: "aud_011", name: "Lead Form Dolduranlar",
      type: "custom", subtype: "Lead Form", status: "too_small",
      size: 340, sizeRange: "<1K",
      sourceAudienceId: null, sourceAudienceName: null, lookalikePercent: null,
      country: null, retentionDays: 90,
      createdAt: subDays(new Date(), 10).toISOString(),
      updatedAt: subDays(new Date(), 1).toISOString(),
      usedInCampaigns: 0,
      description: "Lead formunu tamamlayan kullanıcılar (kitle çok küçük)",
    },
  ]
}
