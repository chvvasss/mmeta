"use client"

import { useQuery } from "@tanstack/react-query"
import type { MockAdSet } from "@/lib/mock-data"

interface AdSetsResponse {
  data: MockAdSet[]
  meta: { total: number }
}

async function fetchAdSets(campaignId?: string, search?: string, status?: string): Promise<AdSetsResponse> {
  const params = new URLSearchParams()
  if (campaignId) params.set("campaignId", campaignId)
  if (search) params.set("search", search)
  if (status) params.set("status", status)

  const res = await fetch(`/api/meta/adsets?${params}`)
  if (!res.ok) throw new Error("Failed to fetch ad sets")
  return res.json()
}

export function useAdSets(campaignId?: string, search?: string, status?: string) {
  return useQuery({
    queryKey: ["meta", "adsets", campaignId, search, status],
    queryFn: () => fetchAdSets(campaignId, search, status),
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  })
}
