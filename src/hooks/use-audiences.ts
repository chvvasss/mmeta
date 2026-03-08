"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import type { AudienceItem } from "@/lib/mock-pixel"

export function useAudiences(type?: string, search?: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<AudienceItem[]>({
    queryKey: ["audiences", type, search, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (type && type !== "all") params.set("type", type)
      if (search) params.set("search", search)

      const res = await fetch(`/api/meta/audiences?${params}`)
      if (!res.ok) throw new Error("Failed to fetch audiences")
      const json = await res.json()
      return json.data
    },
    staleTime: 3 * 60 * 1000,
  })
}

export function useCreateAudience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/meta/audiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create audience")
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audiences"] })
    },
  })
}
