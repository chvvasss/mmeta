export const META_API_VERSION = process.env.META_API_VERSION || "v22.0"

export const CAMPAIGN_OBJECTIVES = {
  OUTCOME_TRAFFIC: "Trafik",
  OUTCOME_ENGAGEMENT: "Etkileşim",
  OUTCOME_LEADS: "Potansiyel Müşteri",
  OUTCOME_SALES: "Satış",
  OUTCOME_AWARENESS: "Farkındalık",
  OUTCOME_APP_PROMOTION: "Uygulama Tanıtımı",
} as const

export const BID_STRATEGIES = {
  LOWEST_COST_WITHOUT_CAP: "En Düşük Maliyet",
  COST_CAP: "Maliyet Sınırı",
  BID_CAP: "Teklif Sınırı",
  MINIMUM_ROAS: "Minimum ROAS",
} as const

export const CTA_TYPES = {
  LEARN_MORE: "Daha Fazla Bilgi",
  SHOP_NOW: "Hemen Satın Al",
  SIGN_UP: "Kaydol",
  CONTACT_US: "Bize Ulaşın",
  BOOK_TRAVEL: "Rezervasyon Yap",
  DOWNLOAD: "İndir",
  GET_OFFER: "Teklif Al",
  GET_QUOTE: "Fiyat Teklifi Al",
  SUBSCRIBE: "Abone Ol",
  WATCH_MORE: "Daha Fazla İzle",
  APPLY_NOW: "Hemen Başvur",
  ORDER_NOW: "Şimdi Sipariş Ver",
} as const

export const CAMPAIGN_STATUS = {
  ACTIVE: "Aktif",
  PAUSED: "Duraklatıldı",
  DELETED: "Silindi",
  ARCHIVED: "Arşivlendi",
} as const

export const EFFECTIVE_STATUS = {
  ACTIVE: "Aktif",
  PAUSED: "Duraklatıldı",
  CAMPAIGN_PAUSED: "Kampanya Duraklatıldı",
  ADSET_PAUSED: "Reklam Seti Duraklatıldı",
  DELETED: "Silindi",
  ARCHIVED: "Arşivlendi",
  IN_PROCESS: "İşleniyor",
  WITH_ISSUES: "Sorunlu",
} as const

export const LEARNING_PHASE = {
  LEARNING: "Öğreniyor",
  SUCCESS: "Aktif",
  FAIL: "Öğrenme Sınırlı",
} as const

export const ALERT_SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
} as const

export const ALERT_TYPES = {
  BUDGET_ALERT: "Bütçe Uyarısı",
  CPC_SPIKE: "CPC Artışı",
  CTR_DROP: "CTR Düşüşü",
  EMQ_LOW: "Düşük EMQ",
  LEARNING_LIMITED: "Öğrenme Sınırlı",
  SPEND_ANOMALY: "Harcama Anomalisi",
  CREATIVE_FATIGUE: "Kreatif Yorgunluğu",
  DELIVERY_ISSUE: "Yayın Sorunu",
} as const

export const DATE_PRESETS = {
  today: "Bugün",
  yesterday: "Dün",
  last_7d: "Son 7 Gün",
  last_14d: "Son 14 Gün",
  last_30d: "Son 30 Gün",
  this_month: "Bu Ay",
  last_month: "Geçen Ay",
  last_90d: "Son 90 Gün",
} as const

export type DatePreset = keyof typeof DATE_PRESETS

export const QUALITY_RANKINGS = {
  ABOVE_AVERAGE_35: "Ortalamanın Üstünde",
  AVERAGE: "Ortalama",
  BELOW_AVERAGE_35: "Ortalamanın Altında",
  BELOW_AVERAGE_10: "Düşük",
} as const

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/campaigns", label: "Kampanyalar", icon: "Megaphone" },
  { href: "/adsets", label: "Reklam Setleri", icon: "Layers" },
  { href: "/ads", label: "Reklamlar", icon: "Image" },
  { href: "/audiences", label: "Kitleler", icon: "Users" },
  { href: "/pixel", label: "Pixel & CAPI", icon: "Activity" },
  { href: "/analytics", label: "Analitik", icon: "BarChart3" },
  { href: "/automation", label: "Otomasyon", icon: "Zap" },
  { href: "/competitors", label: "Rakip Analiz", icon: "Search" },
  { href: "/reports", label: "Raporlar", icon: "FileText" },
  { href: "/accounts", label: "Hesaplar", icon: "Building2" },
  { href: "/settings", label: "Ayarlar", icon: "Settings" },
] as const
