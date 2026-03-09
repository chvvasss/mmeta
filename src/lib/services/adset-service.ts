import type { Session } from "next-auth"
import { getDataMode, getAccessToken } from "../data-mode"
import { generateMockAdSets, type MockAdSet } from "../mock-data"

const META_API_BASE = "https://graph.facebook.com/v22.0"

interface AdSetFilters {
  campaignId?: string
  status?: string
  search?: string
  accountId?: string
}

async function fetchRealAdSets(accessToken: string, accountId: string, filters: AdSetFilters): Promise<MockAdSet[]> {
  const fields = "id,campaign_id,name,status,effective_status,optimization_goal,billing_event,daily_budget,targeting,start_time,learning_phase_info"

  let url: string
  if (filters.campaignId) {
    url = `${META_API_BASE}/${filters.campaignId}/adsets?fields=${fields}&access_token=${accessToken}&limit=100`
  } else {
    url = `${META_API_BASE}/${accountId}/adsets?fields=${fields}&access_token=${accessToken}&limit=100`
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch ad sets from Meta")

  const json = await res.json()
  return (json.data || []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    campaignId: a.campaign_id as string || "",
    campaignName: "",
    name: a.name as string,
    status: a.status as string,
    effectiveStatus: a.effective_status as string,
    optimizationGoal: a.optimization_goal as string || "",
    billingEvent: a.billing_event as string || "",
    dailyBudget: a.daily_budget ? Number(a.daily_budget) / 100 : null,
    spend: 0,
    impressions: 0,
    clicks: 0,
    cpc: 0,
    ctr: 0,
    conversions: 0,
    reach: 0,
    frequency: 0,
    learningPhase: (a.learning_phase_info as string) || null,
    targetingSummary: "",
    placements: "",
  }))
}

export async function getAdSets(session: Session | null, filters: AdSetFilters = {}) {
  const mode = getDataMode(session)
  const accountId = filters.accountId || "act_123456789"

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        let adSets = await fetchRealAdSets(token, accountId, filters)

        if (filters.status && filters.status !== "ALL") {
          adSets = adSets.filter(a => a.effectiveStatus === filters.status)
        }
        if (filters.search) {
          const q = filters.search.toLowerCase()
          adSets = adSets.filter(a => a.name.toLowerCase().includes(q))
        }

        return { data: adSets, meta: { total: adSets.length, mode: "live" } }
      } catch (err) {
        console.error("[AdSetService] Falling back to demo:", err)
      }
    }
  }

  let adSets = generateMockAdSets(filters.campaignId)

  if (filters.status && filters.status !== "ALL") {
    adSets = adSets.filter(a => a.effectiveStatus === filters.status)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    adSets = adSets.filter(a => a.name.toLowerCase().includes(q))
  }

  return { data: adSets, meta: { total: adSets.length, mode: "demo" } }
}
