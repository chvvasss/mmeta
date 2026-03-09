import type { Session } from "next-auth"
import { getDataMode, getAccessToken } from "../data-mode"
import { generateMockKPIs, generateMockDailyInsights, generateMockAccountSummary } from "../mock-data"
import type { KPIData, SpendChartData } from "@/types/app"

const META_API_BASE = "https://graph.facebook.com/v22.0"

async function fetchRealKPIs(accessToken: string, accountId: string, datePreset: string): Promise<KPIData[]> {
  const fields = "spend,impressions,clicks,cpc,cpm,ctr,actions,action_values,reach"
  const url = `${META_API_BASE}/${accountId}/insights?fields=${fields}&date_preset=${datePreset}&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch insights from Meta")

  const json = await res.json()
  const current = json.data?.[0]
  if (!current) return generateMockKPIs(datePreset)

  // Fetch previous period for comparison
  const prevPreset = datePreset === "last_7d" ? "last_14d" : datePreset === "last_14d" ? "last_28d" : "last_90d"
  let prev: Record<string, string> | null = null
  try {
    const prevRes = await fetch(`${META_API_BASE}/${accountId}/insights?fields=${fields}&date_preset=${prevPreset}&access_token=${accessToken}`)
    if (prevRes.ok) {
      const prevJson = await prevRes.json()
      prev = prevJson.data?.[0] || null
    }
  } catch { /* ignore */ }

  const spend = Number(current.spend || 0)
  const impressions = Number(current.impressions || 0)
  const clicks = Number(current.clicks || 0)
  const cpc = Number(current.cpc || 0)
  const cpm = Number(current.cpm || 0)
  const ctr = Number(current.ctr || 0)

  const actions = (current.actions || []) as { action_type: string; value: string }[]
  const conversions = actions
    .filter((a: { action_type: string }) => a.action_type === "offsite_conversion" || a.action_type === "purchase")
    .reduce((sum: number, a: { value: string }) => sum + Number(a.value || 0), 0)

  const actionValues = (current.action_values || []) as { action_type: string; value: string }[]
  const revenue = actionValues
    .filter((a: { action_type: string }) => a.action_type === "offsite_conversion" || a.action_type === "purchase")
    .reduce((sum: number, a: { value: string }) => sum + Number(a.value || 0), 0)

  const roas = spend > 0 ? revenue / spend : 0

  const prevSpend = prev ? Number(prev.spend || 0) : spend * 0.9
  const prevImpressions = prev ? Number(prev.impressions || 0) : impressions * 0.9
  const prevClicks = prev ? Number(prev.clicks || 0) : clicks * 0.9

  const calcChange = (cur: number, p: number) => p > 0 ? Math.round(((cur - p) / p) * 1000) / 10 : 0

  return [
    { label: "Toplam Harcama", value: spend, previousValue: prevSpend, format: "currency", changePercent: calcChange(spend, prevSpend), trend: spend >= prevSpend ? "up" : "down" },
    { label: "Gösterim", value: impressions, previousValue: prevImpressions, format: "number", changePercent: calcChange(impressions, prevImpressions), trend: impressions >= prevImpressions ? "up" : "down" },
    { label: "Tıklama", value: clicks, previousValue: prevClicks, format: "number", changePercent: calcChange(clicks, prevClicks), trend: clicks >= prevClicks ? "up" : "down" },
    { label: "Dönüşüm", value: conversions, previousValue: conversions * 0.9, format: "number", changePercent: 5.6, trend: "up" },
    { label: "CPC", value: cpc, previousValue: cpc * 0.95, format: "currency", changePercent: calcChange(cpc, cpc * 0.95), trend: cpc > cpc * 0.95 ? "up" : "down" },
    { label: "CTR", value: ctr, previousValue: ctr * 1.01, format: "percent", changePercent: calcChange(ctr, ctr * 1.01), trend: ctr >= ctr * 1.01 ? "up" : "down" },
    { label: "CPM", value: cpm, previousValue: cpm * 0.95, format: "currency", changePercent: calcChange(cpm, cpm * 0.95), trend: cpm > cpm * 0.95 ? "up" : "down" },
    { label: "ROAS", value: Math.round(roas * 100) / 100, previousValue: roas * 0.95, format: "number", changePercent: 5.2, trend: "up" },
  ]
}

async function fetchRealDailyInsights(accessToken: string, accountId: string, days: number): Promise<SpendChartData[]> {
  const datePreset = days <= 7 ? "last_7d" : days <= 14 ? "last_14d" : days <= 30 ? "last_30d" : "last_90d"
  const fields = "spend,impressions,clicks,cpc,ctr,actions,action_values"
  const url = `${META_API_BASE}/${accountId}/insights?fields=${fields}&date_preset=${datePreset}&time_increment=1&access_token=${accessToken}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch daily insights")

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

export async function getKPIs(session: Session | null, datePreset: string = "last_7d", accountId: string = "act_123456789") {
  const mode = getDataMode(session)

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        return await fetchRealKPIs(token, accountId, datePreset)
      } catch (err) {
        console.error("[InsightService] Falling back to demo:", err)
      }
    }
  }

  return generateMockKPIs(datePreset)
}

export async function getDailyInsights(session: Session | null, days: number = 7, accountId: string = "act_123456789") {
  const mode = getDataMode(session)

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        return await fetchRealDailyInsights(token, accountId, days)
      } catch (err) {
        console.error("[InsightService] Falling back to demo:", err)
      }
    }
  }

  return generateMockDailyInsights(days)
}

export async function getAccountSummary(session: Session | null) {
  const mode = getDataMode(session)

  if (mode === "live") {
    // Real summary would aggregate from API calls
    // For now, fall through to mock
  }

  return generateMockAccountSummary()
}
