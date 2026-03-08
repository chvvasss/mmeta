// Phase 7: Ad Library, Opportunity Score, Competitors mock data

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Types ────────────────────────────────────────────────────────

export type AdLibraryItem = {
  id: string
  advertiserName: string
  advertiserLogo: string
  pageId: string
  platform: ("facebook" | "instagram" | "audience_network" | "messenger")[]
  adType: "image" | "video" | "carousel" | "collection"
  status: "active" | "inactive"
  startDate: string
  endDate: string | null
  impressionRange: string
  spendRange: string
  creative: {
    headline: string
    body: string
    cta: string
    thumbnailUrl: string
    linkUrl: string
  }
  category: string
  country: string
  estimatedReach: number
}

export type CompetitorBrand = {
  id: string
  name: string
  logo: string
  industry: string
  activeAdCount: number
  estimatedMonthlySpend: number
  platforms: ("facebook" | "instagram")[]
  topCategories: string[]
  avgAdLifespan: number
  creativeMix: {
    image: number
    video: number
    carousel: number
  }
  recentTrend: "increasing" | "stable" | "decreasing"
  firstSeen: string
  lastSeen: string
  engagementScore: number
  weeklyAdCounts: number[]
}

export type OpportunityItem = {
  id: string
  category: "budget" | "targeting" | "creative" | "bidding" | "structure" | "tracking"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  estimatedGain: string
  effort: "easy" | "moderate" | "complex"
  status: "new" | "in_progress" | "dismissed" | "completed"
  affectedCampaigns: string[]
  metric: string
  currentValue: number
  potentialValue: number
  steps: string[]
}

export type OpportunityScore = {
  overall: number
  categories: {
    category: string
    score: number
    maxScore: number
    label: string
  }[]
  totalOpportunities: number
  highImpact: number
  estimatedSavings: number
  lastUpdated: string
}

export type AccountItem = {
  id: string
  name: string
  accountId: string
  status: "active" | "disabled" | "pending_review" | "unsettled"
  currency: string
  timezone: string
  dailyBudget: number
  totalSpent: number
  balance: number
  paymentMethod: string
  businessName: string
  createdAt: string
  lastActivity: string
  campaigns: number
  adSets: number
  ads: number
  pixelId: string | null
  role: "admin" | "advertiser" | "analyst"
}

// ─── Generators ───────────────────────────────────────────────────

export function generateAdLibraryItems(): AdLibraryItem[] {
  const rand = seededRandom(7001)

  const advertisers = [
    { name: "TrendyModa", industry: "Moda & Giyim", logo: "TM" },
    { name: "FitLife Supplements", industry: "Sağlık & Fitness", logo: "FL" },
    { name: "Dijital Akademi", industry: "Eğitim", logo: "DA" },
    { name: "GastroBox", industry: "Yiyecek & İçecek", logo: "GB" },
    { name: "TeknoPlus", industry: "Teknoloji", logo: "TP" },
    { name: "EcoHome", industry: "Ev & Yaşam", logo: "EH" },
    { name: "PetWorld", industry: "Evcil Hayvan", logo: "PW" },
    { name: "BeautyGlow", industry: "Güzellik & Bakım", logo: "BG" },
    { name: "SportZone", industry: "Spor", logo: "SZ" },
    { name: "KidVenture", industry: "Çocuk & Oyuncak", logo: "KV" },
    { name: "CloudSoft", industry: "Yazılım", logo: "CS" },
    { name: "UrbanBike", industry: "Ulaşım", logo: "UB" },
  ]

  const headlines = [
    "Yaz Koleksiyonu %50 İndirimle!",
    "Ücretsiz Kargo Fırsatı",
    "Sınırlı Süre! Hemen Al",
    "Yeni Sezon Ürünleri Geldi",
    "Premium Kalite, Uygun Fiyat",
    "İlk Siparişe Özel %30",
    "Hafta Sonu Kampanyası",
    "En Çok Satanlar Burada",
    "Bugüne Özel Fırsat",
    "Hayalindeki Ürün Seni Bekliyor",
    "Tüm Ürünlerde Geçerli",
    "Son 24 Saat!",
  ]

  const bodies = [
    "Binlerce üründe kaçırılmayacak indirimler. Hemen alışverişe başla ve fırsatları yakala!",
    "Kaliteli ürünleri en uygun fiyatlarla sunuyoruz. Müşteri memnuniyeti garantisi ile alışveriş yap.",
    "Sınırlı stok! En sevilen ürünlerimiz tükenmeden sepetine ekle.",
    "Yeni koleksiyonumuzu keşfet. Trendleri yakala, tarzını yansıt.",
    "Profesyonel çözümlerle işinizi büyütün. Ücretsiz deneme süresi ile başlayın.",
    "Doğal ve organik ürünlerle sağlıklı yaşamın kapılarını aralayın.",
  ]

  const ctas = ["Alışverişe Başla", "Hemen İncele", "Keşfet", "Daha Fazla", "Ücretsiz Dene", "Teklif Al"]
  const categories = ["E-Ticaret", "Uygulama", "Marka Bilinirliği", "Lead Toplama", "Trafik", "Dönüşüm"]
  const adTypes: AdLibraryItem["adType"][] = ["image", "video", "carousel", "collection"]
  const platformCombos = [
    ["facebook", "instagram"] as const,
    ["facebook"] as const,
    ["instagram"] as const,
    ["facebook", "instagram", "audience_network"] as const,
    ["facebook", "messenger"] as const,
  ]

  const impressionRanges = ["1K-5K", "5K-10K", "10K-50K", "50K-100K", "100K-500K", "500K-1M", "1M+"]
  const spendRanges = ["₺500-₺2K", "₺2K-₺5K", "₺5K-₺15K", "₺15K-₺50K", "₺50K-₺100K", "₺100K+"]

  return Array.from({ length: 12 }, (_, i) => {
    const adv = advertisers[i % advertisers.length]
    const r = () => rand()
    const isActive = r() > 0.3
    const startDay = Math.floor(r() * 60) + 1
    const startDate = new Date(2026, 1, 1)
    startDate.setDate(startDate.getDate() - startDay)

    return {
      id: `ad_lib_${String(i + 1).padStart(3, "0")}`,
      advertiserName: adv.name,
      advertiserLogo: adv.logo,
      pageId: `page_${100 + i}`,
      platform: [...platformCombos[Math.floor(r() * platformCombos.length)]],
      adType: adTypes[Math.floor(r() * adTypes.length)],
      status: isActive ? "active" : "inactive",
      startDate: startDate.toISOString().split("T")[0],
      endDate: isActive ? null : new Date(2026, 2, Math.floor(r() * 28) + 1).toISOString().split("T")[0],
      impressionRange: impressionRanges[Math.floor(r() * impressionRanges.length)],
      spendRange: spendRanges[Math.floor(r() * spendRanges.length)],
      creative: {
        headline: headlines[i % headlines.length],
        body: bodies[Math.floor(r() * bodies.length)],
        cta: ctas[Math.floor(r() * ctas.length)],
        thumbnailUrl: `/api/placeholder/${300 + i}`,
        linkUrl: `https://${adv.name.toLowerCase().replace(/\s/g, "")}.com`,
      },
      category: categories[Math.floor(r() * categories.length)],
      country: "TR",
      estimatedReach: Math.floor(r() * 500000) + 10000,
    }
  })
}

export function generateCompetitorBrands(): CompetitorBrand[] {
  const rand = seededRandom(7002)

  const brands: Omit<CompetitorBrand, "activeAdCount" | "estimatedMonthlySpend" | "avgAdLifespan" | "creativeMix" | "recentTrend" | "firstSeen" | "lastSeen" | "engagementScore" | "weeklyAdCounts">[] = [
    {
      id: "comp_001",
      name: "TrendyModa",
      logo: "TM",
      industry: "Moda & Giyim",
      platforms: ["facebook", "instagram"],
      topCategories: ["Kadın Giyim", "Aksesuar", "Ayakkabı"],
    },
    {
      id: "comp_002",
      name: "FitLife Supplements",
      logo: "FL",
      industry: "Sağlık & Fitness",
      platforms: ["facebook", "instagram"],
      topCategories: ["Protein", "Vitamin", "Spor Ekipmanı"],
    },
    {
      id: "comp_003",
      name: "Dijital Akademi",
      logo: "DA",
      industry: "Eğitim",
      platforms: ["facebook", "instagram"],
      topCategories: ["Online Kurs", "Sertifika", "Bootcamp"],
    },
    {
      id: "comp_004",
      name: "GastroBox",
      logo: "GB",
      industry: "Yiyecek & İçecek",
      platforms: ["facebook", "instagram"],
      topCategories: ["Abonelik Kutusu", "Gurme", "Organik"],
    },
    {
      id: "comp_005",
      name: "TeknoPlus",
      logo: "TP",
      industry: "Teknoloji",
      platforms: ["facebook", "instagram"],
      topCategories: ["Elektronik", "Aksesuar", "Yazılım"],
    },
    {
      id: "comp_006",
      name: "BeautyGlow",
      logo: "BG",
      industry: "Güzellik & Bakım",
      platforms: ["facebook", "instagram"],
      topCategories: ["Cilt Bakımı", "Makyaj", "Parfüm"],
    },
  ]

  return brands.map((b) => {
    const r = () => rand()
    const imgPct = Math.floor(r() * 40) + 20
    const vidPct = Math.floor(r() * 30) + 10
    const carPct = 100 - imgPct - vidPct
    const trends: CompetitorBrand["recentTrend"][] = ["increasing", "stable", "decreasing"]

    return {
      ...b,
      activeAdCount: Math.floor(r() * 80) + 5,
      estimatedMonthlySpend: Math.floor(r() * 200000) + 15000,
      avgAdLifespan: Math.floor(r() * 21) + 3,
      creativeMix: { image: imgPct, video: vidPct, carousel: carPct },
      recentTrend: trends[Math.floor(r() * trends.length)],
      firstSeen: "2025-06-15",
      lastSeen: "2026-03-08",
      engagementScore: Math.floor(r() * 40) + 55,
      weeklyAdCounts: Array.from({ length: 8 }, () => Math.floor(r() * 30) + 5),
    }
  })
}

export function generateOpportunityItems(): OpportunityItem[] {
  const rand = seededRandom(7003)

  const items: OpportunityItem[] = [
    {
      id: "opp_001",
      category: "budget",
      title: "Düşük Performanslı Kampanya Bütçe Optimizasyonu",
      description: "3 kampanya ROAS hedefinin altında kalıyor. Bütçe yeniden dağıtımı ile tasarruf sağlanabilir.",
      impact: "high",
      estimatedGain: "₺12.500/ay tasarruf",
      effort: "easy",
      status: "new",
      affectedCampaigns: ["Yaz Kampanyası", "Retargeting Q1", "Marka Bilinirliği"],
      metric: "ROAS",
      currentValue: 1.8,
      potentialValue: 3.2,
      steps: [
        "Düşük ROAS kampanyalarını belirle",
        "Bütçeyi yüksek performanslı kampanyalara yönlendir",
        "Hedef ROAS stratejisi uygula",
      ],
    },
    {
      id: "opp_002",
      category: "targeting",
      title: "Kitle Örtüşme Sorunu",
      description: "4 reklam seti arasında %35 kitle örtüşmesi tespit edildi. Frekans artışı ve maliyet yükselişine neden oluyor.",
      impact: "high",
      estimatedGain: "CPC'de %18 düşüş",
      effort: "moderate",
      status: "new",
      affectedCampaigns: ["Kadın 25-34", "İstanbul Hedefleme", "Benzer Kitle v2", "Retargeting"],
      metric: "CPC",
      currentValue: 4.85,
      potentialValue: 3.98,
      steps: [
        "Örtüşen kitleleri analiz et",
        "Exclusion kuralları oluştur",
        "Kitle yapısını yeniden organize et",
      ],
    },
    {
      id: "opp_003",
      category: "creative",
      title: "Kreatif Yorgunluk Tespiti",
      description: "5 reklamda frekans 4'ün üzerine çıkmış. CTR son 7 günde %22 düşüş gösteriyor.",
      impact: "medium",
      estimatedGain: "CTR'de %25 artış",
      effort: "moderate",
      status: "in_progress",
      affectedCampaigns: ["Ana Video Reklam", "Carousel Ürün", "Story Format"],
      metric: "CTR",
      currentValue: 1.2,
      potentialValue: 1.5,
      steps: [
        "Yorgun kreatifler belirle (frekans > 3)",
        "Yeni kreatif varyasyonları oluştur",
        "A/B test başlat",
        "Performans takibi yap",
      ],
    },
    {
      id: "opp_004",
      category: "bidding",
      title: "Teklif Stratejisi İyileştirmesi",
      description: "Manuel teklif kullanan 3 kampanya var. Otomatik stratejiye geçiş ile performans artırılabilir.",
      impact: "medium",
      estimatedGain: "Dönüşümlerde %15 artış",
      effort: "easy",
      status: "new",
      affectedCampaigns: ["Dönüşüm Kampanyası", "Lead Gen", "Satış Odaklı"],
      metric: "CPA",
      currentValue: 48.5,
      potentialValue: 41.2,
      steps: [
        "Manuel teklif kampanyalarını listele",
        "Cost Cap veya Target ROAS uygula",
        "1 hafta gözlemle",
      ],
    },
    {
      id: "opp_005",
      category: "structure",
      title: "Kampanya Konsolidasyonu",
      description: "Benzer hedeflere sahip 6 mikro kampanya tespit edildi. Birleştirme ile öğrenme fazı hızlandırılabilir.",
      impact: "medium",
      estimatedGain: "Öğrenme süresinde %40 kısalma",
      effort: "complex",
      status: "new",
      affectedCampaigns: ["Ürün A", "Ürün B", "Ürün C", "Ürün A-v2", "Ürün B-v2", "Ürün C-v2"],
      metric: "Learning Phase",
      currentValue: 14,
      potentialValue: 5,
      steps: [
        "Benzer hedefli kampanyaları grupla",
        "Yeni kampanya yapısı oluştur",
        "Mevcut verileri koru",
        "Kademeli geçiş planla",
      ],
    },
    {
      id: "opp_006",
      category: "tracking",
      title: "Pixel Event Kalite İyileştirmesi",
      description: "Pixel Event Match Quality skoru 5.2/10. Server-side event gönderimi ile kalite artırılabilir.",
      impact: "high",
      estimatedGain: "Attribution doğruluğunda %30 artış",
      effort: "complex",
      status: "new",
      affectedCampaigns: ["Tüm Kampanyalar"],
      metric: "EMQ",
      currentValue: 5.2,
      potentialValue: 8.5,
      steps: [
        "CAPI entegrasyonunu kontrol et",
        "Eksik parametreleri belirle (email, phone, ip)",
        "Server-side event gönderimini aktifleştir",
        "Deduplication kuralları ekle",
        "Kalite skorunu izle",
      ],
    },
    {
      id: "opp_007",
      category: "budget",
      title: "Harcama Zamanlaması Optimizasyonu",
      description: "Gece saatlerinde (00:00-06:00) harcama devam ediyor ancak dönüşüm oranı %80 daha düşük.",
      impact: "low",
      estimatedGain: "₺3.200/ay tasarruf",
      effort: "easy",
      status: "dismissed",
      affectedCampaigns: ["7/24 Aktif Kampanya", "Always-On Retargeting"],
      metric: "Conv. Rate",
      currentValue: 0.8,
      potentialValue: 1.6,
      steps: [
        "Saat dilimi performans analizi yap",
        "Dayparting kuralı oluştur",
        "Düşük performanslı saatleri hariç tut",
      ],
    },
    {
      id: "opp_008",
      category: "creative",
      title: "Video Reklam Format Eksikliği",
      description: "Aktif reklamların %85'i statik görsel. Video içerik, ortalama %40 daha yüksek engagement sağlıyor.",
      impact: "medium",
      estimatedGain: "Engagement'ta %35 artış",
      effort: "moderate",
      status: "new",
      affectedCampaigns: ["Tüm Kampanyalar"],
      metric: "Engagement Rate",
      currentValue: 2.1,
      potentialValue: 2.84,
      steps: [
        "En iyi performanslı görselleri seç",
        "Kısa video varyasyonları oluştur (6-15sn)",
        "Video vs görsel A/B test başlat",
      ],
    },
  ]

  // Randomize some values for variety
  return items.map((item) => {
    const r = rand()
    return { ...item, currentValue: Number((item.currentValue * (0.9 + r * 0.2)).toFixed(2)) }
  })
}

export function generateOpportunityScore(): OpportunityScore {
  return {
    overall: 68,
    categories: [
      { category: "budget", score: 72, maxScore: 100, label: "Bütçe Yönetimi" },
      { category: "targeting", score: 58, maxScore: 100, label: "Hedefleme" },
      { category: "creative", score: 65, maxScore: 100, label: "Kreatif Kalite" },
      { category: "bidding", score: 80, maxScore: 100, label: "Teklif Stratejisi" },
      { category: "structure", score: 55, maxScore: 100, label: "Hesap Yapısı" },
      { category: "tracking", score: 78, maxScore: 100, label: "Takip & Ölçüm" },
    ],
    totalOpportunities: 8,
    highImpact: 3,
    estimatedSavings: 15700,
    lastUpdated: new Date().toISOString(),
  }
}

export function generateAccountItems(): AccountItem[] {
  return [
    {
      id: "acc_001",
      name: "MetaBoost Ana Hesap",
      accountId: "act_1234567890",
      status: "active",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      dailyBudget: 5000,
      totalSpent: 284350,
      balance: 12500,
      paymentMethod: "Kredi Kartı •••• 4242",
      businessName: "MetaBoost Dijital Ajans",
      createdAt: "2024-03-15T10:00:00Z",
      lastActivity: "2026-03-08T14:30:00Z",
      campaigns: 12,
      adSets: 34,
      ads: 67,
      pixelId: "px_001",
      role: "admin",
    },
    {
      id: "acc_002",
      name: "E-Ticaret Kampanyaları",
      accountId: "act_9876543210",
      status: "active",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      dailyBudget: 8000,
      totalSpent: 456780,
      balance: 25000,
      paymentMethod: "Banka Havalesi",
      businessName: "ShopMax Ltd.",
      createdAt: "2024-06-20T09:00:00Z",
      lastActivity: "2026-03-08T16:00:00Z",
      campaigns: 8,
      adSets: 22,
      ads: 45,
      pixelId: "px_002",
      role: "advertiser",
    },
    {
      id: "acc_003",
      name: "Marka Bilinirliği",
      accountId: "act_5555666677",
      status: "active",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      dailyBudget: 3000,
      totalSpent: 128900,
      balance: 8200,
      paymentMethod: "Kredi Kartı •••• 8888",
      businessName: "BrandUp Agency",
      createdAt: "2025-01-10T11:00:00Z",
      lastActivity: "2026-03-07T19:45:00Z",
      campaigns: 5,
      adSets: 15,
      ads: 28,
      pixelId: "px_003",
      role: "admin",
    },
    {
      id: "acc_004",
      name: "Test Hesabı",
      accountId: "act_1111222233",
      status: "pending_review",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      dailyBudget: 500,
      totalSpent: 3200,
      balance: 1500,
      paymentMethod: "Kredi Kartı •••• 1234",
      businessName: "MetaBoost Dijital Ajans",
      createdAt: "2026-01-05T08:00:00Z",
      lastActivity: "2026-03-01T10:00:00Z",
      campaigns: 2,
      adSets: 4,
      ads: 8,
      pixelId: null,
      role: "analyst",
    },
    {
      id: "acc_005",
      name: "Eski Kampanya Hesabı",
      accountId: "act_9999000011",
      status: "disabled",
      currency: "TRY",
      timezone: "Europe/Istanbul",
      dailyBudget: 0,
      totalSpent: 95400,
      balance: 0,
      paymentMethod: "—",
      businessName: "ArchivedCorp",
      createdAt: "2023-09-01T12:00:00Z",
      lastActivity: "2025-08-15T23:59:00Z",
      campaigns: 0,
      adSets: 0,
      ads: 0,
      pixelId: null,
      role: "admin",
    },
  ]
}
