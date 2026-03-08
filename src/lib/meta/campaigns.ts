import { getAdAccount, handleMetaError, withRetry } from "./client"
import { CAMPAIGN_FIELDS, type MetaCampaign } from "./types"

export async function fetchCampaigns(
  accountId: string,
  statusFilter?: string[]
): Promise<MetaCampaign[]> {
  return withRetry(async () => {
    try {
      const account = getAdAccount(accountId)
      const filtering = statusFilter
        ? [{ field: "effective_status", operator: "IN", value: statusFilter }]
        : undefined

      const campaigns = await account.getCampaigns(
        CAMPAIGN_FIELDS.split(","),
        { filtering: filtering ? JSON.stringify(filtering) : undefined }
      )

      return campaigns.map((c: Record<string, unknown>) => c._data as MetaCampaign)
    } catch (error) {
      handleMetaError(error)
    }
  })
}

export async function createCampaign(
  accountId: string,
  params: {
    name: string
    objective: string
    status: string
    daily_budget?: number
    lifetime_budget?: number
    bid_strategy?: string
    special_ad_categories?: string[]
    start_time?: string
    stop_time?: string
  }
): Promise<MetaCampaign> {
  return withRetry(async () => {
    try {
      const account = getAdAccount(accountId)
      const result = await account.createCampaign([], params)
      return result._data as MetaCampaign
    } catch (error) {
      handleMetaError(error)
    }
  })
}

export async function updateCampaign(
  campaignId: string,
  params: Record<string, unknown>
): Promise<void> {
  // Will be implemented with Meta SDK Campaign class
  console.log("updateCampaign stub", campaignId, params)
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  // Will be implemented with Meta SDK Campaign class
  console.log("deleteCampaign stub", campaignId)
}
