import type { MetaAd } from "./types"

export async function fetchAds(
  accountId: string,
  adSetId?: string
): Promise<MetaAd[]> {
  console.log("fetchAds stub", accountId, adSetId)
  return []
}

export async function createAd(
  accountId: string,
  params: Record<string, unknown>
): Promise<MetaAd> {
  console.log("createAd stub", accountId, params)
  return {} as MetaAd
}

export async function updateAd(
  adId: string,
  params: Record<string, unknown>
): Promise<void> {
  console.log("updateAd stub", adId, params)
}
