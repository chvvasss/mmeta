import type { Session } from "next-auth"
import { getDataMode, getAccessToken } from "../data-mode"
import { generateMockCampaigns, generateMockCampaignDetail, generateCampaignDailyInsights } from "../mock-data"
import type { CampaignTableRow } from "@/types/app"

const META_API_BASE = "https://graph.facebook.com/v22.0"

interface CampaignFilters {
  status?: string
  search?: string
  sortBy?: string
  sortDir?: string
  accountId?: string
}

async function fetchRealCampaigns(accessToken: string, accountId: string, filters: CampaignFilters): Promise<CampaignTableRow[]> {
  const fields = "id,name,status,effective_status,objective,daily_budget,lifetime_budget,bid_strategy,start_time,stop_time,created_time,updated_time"
  const url = new URL(`${META_API_BASE}/${accountId}/campaigns`)
  url.searchParams.set("fields", fields)
  url.searchParams.set("access_token", accessToken)
  url.searchParams.set("limit", "100")

  if (filters.status && filters.status !== "ALL") {
    const filtering = [{ field: "effective_status", operator: "IN", value: filters.status.split(",") }]
    url.searchParams.set("filtering", JSON.stringify(filtering))
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error("[CampaignService] Meta API error:", err)
    throw new Error(err?.error?.message || "Failed to fetch campaigns from Meta")
  }

  const json = await res.json()
  const campaigns = json.data || []

  // Fetch insights for each campaign to get spend, clicks, etc.
  const insightPromises = campaigns.map(async (c: Record<string, string>) => {
    try {
      const insightUrl = `${META_API_BASE}/${c.id}/insights?fields=spend,impressions,clicks,cpc,ctr,actions,action_values&date_preset=last_30d&access_token=${accessToken}`
      const insightRes = await fetch(insightUrl)
      if (!insightRes.ok) return null
      const insightJson = await insightRes.json()
      return insightJson.data?.[0] || null
    } catch {
      return null
    }
  })

  const insights = await Promise.all(insightPromises)

  return campaigns.map((c: Record<string, string>, i: number) => {
    const insight = insights[i] as Record<string, string | Record<string, string>[]> | null
    const actions = (insight?.actions || []) as { action_type: string; value: string }[]
    const actionValues = (insight?.action_values || []) as { action_type: string; value: string }[]

    const conversions = actions
      .filter(a => a.action_type === "offsite_conversion" || a.action_type === "purchase")
      .reduce((sum, a) => sum + Number(a.value || 0), 0)

    const revenue = actionValues
      .filter(a => a.action_type === "offsite_conversion" || a.action_type === "purchase")
      .reduce((sum, a) => sum + Number(a.value || 0), 0)

    const spend = Number(insight?.spend || 0)
    const impressions = Number(insight?.impressions || 0)
    const clicks = Number(insight?.clicks || 0)

    return {
      id: c.id,
      name: c.name,
      status: c.status,
      effectiveStatus: c.effective_status,
      objective: c.objective,
      dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : null,
      lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
      spend,
      impressions,
      clicks,
      cpc: clicks > 0 ? Math.round((spend / clicks) * 100) / 100 : 0,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      conversions,
      roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
      learningPhase: null,
      opportunityScore: null,
    }
  })
}

export async function getCampaigns(session: Session | null, filters: CampaignFilters = {}): Promise<{ data: CampaignTableRow[]; meta: { total: number; accountId: string; mode: string } }> {
  const mode = getDataMode(session)
  const accountId = filters.accountId || "act_123456789"

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        let campaigns = await fetchRealCampaigns(token, accountId, filters)

        if (filters.search) {
          const q = filters.search.toLowerCase()
          campaigns = campaigns.filter(c => c.name.toLowerCase().includes(q))
        }

        if (filters.sortBy) {
          const key = filters.sortBy as keyof CampaignTableRow
          const dir = filters.sortDir || "desc"
          campaigns.sort((a, b) => {
            const aVal = a[key] ?? 0
            const bVal = b[key] ?? 0
            if (typeof aVal === "number" && typeof bVal === "number") {
              return dir === "desc" ? bVal - aVal : aVal - bVal
            }
            return dir === "desc" ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal))
          })
        }

        return { data: campaigns, meta: { total: campaigns.length, accountId, mode: "live" } }
      } catch (err) {
        console.error("[CampaignService] Falling back to demo:", err)
      }
    }
  }

  // Demo mode
  let campaigns = generateMockCampaigns()

  if (filters.status && filters.status !== "ALL") {
    const statuses = filters.status.split(",")
    campaigns = campaigns.filter(c => statuses.includes(c.effectiveStatus))
  }

  if (filters.search) {
    const q = filters.search.toLowerCase()
    campaigns = campaigns.filter(c => c.name.toLowerCase().includes(q))
  }

  if (filters.sortBy) {
    const key = filters.sortBy as keyof CampaignTableRow
    const dir = filters.sortDir || "desc"
    campaigns.sort((a, b) => {
      const aVal = a[key] ?? 0
      const bVal = b[key] ?? 0
      if (typeof aVal === "number" && typeof bVal === "number") {
        return dir === "desc" ? bVal - aVal : aVal - bVal
      }
      return dir === "desc" ? String(bVal).localeCompare(String(aVal)) : String(aVal).localeCompare(String(bVal))
    })
  }

  return { data: campaigns, meta: { total: campaigns.length, accountId, mode: "demo" } }
}

export async function getCampaignById(session: Session | null, id: string) {
  const mode = getDataMode(session)

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        const fields = "id,name,status,effective_status,objective,daily_budget,lifetime_budget,bid_strategy,special_ad_categories,start_time,stop_time,created_time,updated_time"
        const res = await fetch(`${META_API_BASE}/${id}?fields=${fields}&access_token=${token}`)
        if (res.ok) {
          const data = await res.json()
          return {
            id: data.id,
            name: data.name,
            status: data.status,
            effectiveStatus: data.effective_status,
            objective: data.objective,
            dailyBudget: data.daily_budget ? Number(data.daily_budget) / 100 : null,
            lifetimeBudget: data.lifetime_budget ? Number(data.lifetime_budget) / 100 : null,
            bidStrategy: data.bid_strategy || "LOWEST_COST_WITHOUT_CAP",
            budgetType: data.daily_budget ? "DAILY" : "LIFETIME",
            specialAdCategories: data.special_ad_categories || [],
            startTime: data.start_time,
            endTime: data.stop_time,
            createdTime: data.created_time,
            updatedTime: data.updated_time,
            spend: 0,
            impressions: 0,
            clicks: 0,
            cpc: 0,
            ctr: 0,
            conversions: 0,
            roas: 0,
            learningPhase: null,
            opportunityScore: null,
            adSetCount: 0,
            adCount: 0,
          }
        }
      } catch (err) {
        console.error("[CampaignService] getCampaignById error:", err)
      }
    }
  }

  return generateMockCampaignDetail(id)
}

export async function getCampaignInsights(session: Session | null, campaignId: string, days: number = 7) {
  const mode = getDataMode(session)

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        const datePreset = days <= 7 ? "last_7d" : days <= 14 ? "last_14d" : "last_30d"
        const url = `${META_API_BASE}/${campaignId}/insights?fields=spend,impressions,clicks,cpc,ctr,actions,action_values&date_preset=${datePreset}&time_increment=1&access_token=${token}`
        const res = await fetch(url)
        if (res.ok) {
          const json = await res.json()
          return (json.data || []).map((d: Record<string, string>) => ({
            date: d.date_start?.substring(5).replace("-", ".") || "",
            spend: Number(d.spend || 0),
            impressions: Number(d.impressions || 0),
            clicks: Number(d.clicks || 0),
            cpc: Number(d.cpc || 0),
            ctr: Number(d.ctr || 0),
            conversions: 0,
            revenue: 0,
          }))
        }
      } catch (err) {
        console.error("[CampaignService] getCampaignInsights error:", err)
      }
    }
  }

  return generateCampaignDailyInsights(campaignId, days)
}
