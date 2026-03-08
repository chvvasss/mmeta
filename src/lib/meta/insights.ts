import { getAdAccount, handleMetaError, withRetry } from "./client"
import { INSIGHT_FIELDS, type MetaInsight } from "./types"

export async function fetchAccountInsights(
  accountId: string,
  datePreset: string = "last_7d",
  timeIncrement: string = "1"
): Promise<MetaInsight[]> {
  return withRetry(async () => {
    try {
      const account = getAdAccount(accountId)
      const insights = await account.getInsights(
        INSIGHT_FIELDS.split(","),
        {
          date_preset: datePreset,
          time_increment: timeIncrement,
        }
      )
      return insights.map((i: Record<string, unknown>) => i._data as MetaInsight)
    } catch (error) {
      handleMetaError(error)
    }
  })
}

export async function fetchCampaignInsights(
  campaignId: string,
  datePreset: string = "last_7d",
  breakdowns?: string
): Promise<MetaInsight[]> {
  // Will be implemented
  console.log("fetchCampaignInsights stub", campaignId, datePreset, breakdowns)
  return []
}

export async function fetchAdSetInsights(
  adSetId: string,
  datePreset: string = "last_7d"
): Promise<MetaInsight[]> {
  console.log("fetchAdSetInsights stub", adSetId, datePreset)
  return []
}

export async function fetchAdInsights(
  adId: string,
  datePreset: string = "last_7d"
): Promise<MetaInsight[]> {
  console.log("fetchAdInsights stub", adId, datePreset)
  return []
}
