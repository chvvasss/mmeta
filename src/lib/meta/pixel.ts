export interface PixelEventData {
  eventName: string
  eventSource: string
  eventCount24h: number
  eventCount7d: number
  emqScore: number | null
  emqRating: string | null
  dedupPercentage: number | null
  matchKeys: Record<string, boolean>
}

export async function fetchPixelEvents(
  accountId: string
): Promise<PixelEventData[]> {
  console.log("fetchPixelEvents stub", accountId)
  return []
}

export async function fetchEMQScore(
  accountId: string,
  pixelId: string
): Promise<{ score: number; rating: string } | null> {
  console.log("fetchEMQScore stub", accountId, pixelId)
  return null
}
