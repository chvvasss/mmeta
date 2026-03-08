"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CampaignDetail } from "@/lib/mock-data"
import type { SpendChartData } from "@/types/app"
import type { UpdateCampaignInput } from "@/lib/validations/campaign"

interface CampaignDetailResponse {
  data: {
    campaign: CampaignDetail
    dailyInsights: SpendChartData[]
  }
}

async function fetchCampaignDetail(id: string): Promise<CampaignDetailResponse> {
  const res = await fetch(`/api/meta/campaigns/${id}`)
  if (!res.ok) throw new Error("Failed to fetch campaign")
  return res.json()
}

export function useCampaignDetail(id: string) {
  return useQuery({
    queryKey: ["meta", "campaign", id],
    queryFn: () => fetchCampaignDetail(id),
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
    enabled: !!id,
  })
}

async function updateCampaign(id: string, data: UpdateCampaignInput) {
  const res = await fetch(`/api/meta/campaigns/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update campaign")
  return res.json()
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignInput }) =>
      updateCampaign(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meta", "campaign", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["meta", "campaigns"] })
    },
  })
}

async function deleteCampaign(id: string) {
  const res = await fetch(`/api/meta/campaigns/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete campaign")
  return res.json()
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta", "campaigns"] })
    },
  })
}
