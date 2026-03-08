"use client"

import { useQuery } from "@tanstack/react-query"
import type { MockAd } from "@/lib/mock-data"

interface AdsResponse {
  data: MockAd[]
  meta: { total: number }
}

async function fetchAds(adSetId?: string, search?: string): Promise<AdsResponse> {
  const params = new URLSearchParams()
  if (adSetId) params.set("adSetId", adSetId)
  if (search) params.set("search", search)

  const res = await fetch(`/api/meta/ads?${params}`)
  if (!res.ok) throw new Error("Failed to fetch ads")
  return res.json()
}

export function useAds(adSetId?: string, search?: string) {
  return useQuery({
    queryKey: ["meta", "ads", adSetId, search],
    queryFn: () => fetchAds(adSetId, search),
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  })
}
