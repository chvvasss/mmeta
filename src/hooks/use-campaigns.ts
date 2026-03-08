"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import { useFilterStore } from "@/stores/filter-store"
import type { CampaignTableRow } from "@/types/app"

interface CampaignsResponse {
  data: CampaignTableRow[]
  meta: { total: number; accountId: string }
}

interface UseCampaignsOptions {
  sortBy?: string
  sortDir?: "asc" | "desc"
}

async function fetchCampaigns(
  accountId: string | null,
  status: string[],
  search: string,
  sortBy: string,
  sortDir: string
): Promise<CampaignsResponse> {
  const params = new URLSearchParams()
  if (accountId) params.set("accountId", accountId)
  if (status.length > 0) params.set("status", status.join(","))
  if (search) params.set("search", search)
  params.set("sortBy", sortBy)
  params.set("sortDir", sortDir)

  const res = await fetch(`/api/meta/campaigns?${params}`)
  if (!res.ok) throw new Error("Failed to fetch campaigns")
  return res.json()
}

export function useCampaigns(options: UseCampaignsOptions = {}) {
  const { sortBy = "spend", sortDir = "desc" } = options
  const { activeAccountId } = useAccountStore()
  const { statusFilter, searchQuery } = useFilterStore()

  return useQuery({
    queryKey: ["meta", "campaigns", activeAccountId, statusFilter, searchQuery, sortBy, sortDir],
    queryFn: () => fetchCampaigns(activeAccountId, statusFilter, searchQuery, sortBy, sortDir),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.data,
  })
}
