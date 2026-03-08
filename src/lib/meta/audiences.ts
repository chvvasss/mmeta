import type { MetaCustomAudience } from "./types"

export async function fetchAudiences(
  accountId: string
): Promise<MetaCustomAudience[]> {
  console.log("fetchAudiences stub", accountId)
  return []
}

export async function createCustomAudience(
  accountId: string,
  params: Record<string, unknown>
): Promise<MetaCustomAudience> {
  console.log("createCustomAudience stub", accountId, params)
  return {} as MetaCustomAudience
}

export async function createLookalikeAudience(
  accountId: string,
  params: {
    name: string
    originAudienceId: string
    country: string
    ratio: number
  }
): Promise<MetaCustomAudience> {
  console.log("createLookalikeAudience stub", accountId, params)
  return {} as MetaCustomAudience
}

export async function deleteAudience(audienceId: string): Promise<void> {
  console.log("deleteAudience stub", audienceId)
}
