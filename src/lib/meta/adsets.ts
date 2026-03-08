import type { MetaAdSet } from "./types"

export async function fetchAdSets(
  accountId: string,
  campaignId?: string
): Promise<MetaAdSet[]> {
  console.log("fetchAdSets stub", accountId, campaignId)
  return []
}

export async function createAdSet(
  accountId: string,
  params: Record<string, unknown>
): Promise<MetaAdSet> {
  console.log("createAdSet stub", accountId, params)
  return {} as MetaAdSet
}

export async function updateAdSet(
  adSetId: string,
  params: Record<string, unknown>
): Promise<void> {
  console.log("updateAdSet stub", adSetId, params)
}
