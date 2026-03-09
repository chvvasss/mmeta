import type { Session } from "next-auth"
import { getDataMode, getAccessToken } from "../data-mode"
import { generateMockAds, type MockAd } from "../mock-data"

const META_API_BASE = "https://graph.facebook.com/v22.0"

interface AdFilters {
  adSetId?: string
  search?: string
  accountId?: string
}

async function fetchRealAds(accessToken: string, accountId: string, filters: AdFilters): Promise<MockAd[]> {
  const fields = "id,adset_id,name,status,effective_status,creative{id,effective_object_story_id,title,body,call_to_action_type,image_url,thumbnail_url}"

  let url: string
  if (filters.adSetId) {
    url = `${META_API_BASE}/${filters.adSetId}/ads?fields=${fields}&access_token=${accessToken}&limit=100`
  } else {
    url = `${META_API_BASE}/${accountId}/ads?fields=${fields}&access_token=${accessToken}&limit=100`
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch ads from Meta")

  const json = await res.json()
  return (json.data || []).map((a: Record<string, unknown>) => {
    const creative = a.creative as Record<string, string> | undefined
    return {
      id: a.id as string,
      adSetId: a.adset_id as string || "",
      adSetName: "",
      campaignId: "",
      name: a.name as string,
      status: a.status as string,
      effectiveStatus: a.effective_status as string,
      creativeFormat: "SINGLE_IMAGE",
      primaryText: creative?.body || "",
      headline: creative?.title || "",
      ctaType: creative?.call_to_action_type || "",
      spend: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      ctr: 0,
      conversions: 0,
      qualityRanking: "AVERAGE",
      engagementRanking: "AVERAGE",
      conversionRanking: "AVERAGE",
      thumbnailUrl: creative?.thumbnail_url || creative?.image_url || null,
    }
  })
}

export async function getAds(session: Session | null, filters: AdFilters = {}) {
  const mode = getDataMode(session)
  const accountId = filters.accountId || "act_123456789"

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        let ads = await fetchRealAds(token, accountId, filters)

        if (filters.search) {
          const q = filters.search.toLowerCase()
          ads = ads.filter(a => a.name.toLowerCase().includes(q))
        }

        return { data: ads, meta: { total: ads.length, mode: "live" } }
      } catch (err) {
        console.error("[AdService] Falling back to demo:", err)
      }
    }
  }

  let ads = generateMockAds(filters.adSetId)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    ads = ads.filter(a => a.name.toLowerCase().includes(q))
  }

  return { data: ads, meta: { total: ads.length, mode: "demo" } }
}
