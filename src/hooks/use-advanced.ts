"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import type {
  AdLibraryItem,
  CompetitorBrand,
  OpportunityItem,
  OpportunityScore,
  AccountItem,
} from "@/lib/mock-advanced"

export function useAdLibrary(filters?: {
  query?: string
  adType?: string
  status?: string
  platform?: string
}) {
  const { activeAccountId } = useAccountStore()

  return useQuery<AdLibraryItem[]>({
    queryKey: ["ad-library", filters, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.query) params.set("query", filters.query)
      if (filters?.adType) params.set("adType", filters.adType)
      if (filters?.status) params.set("status", filters.status)
      if (filters?.platform) params.set("platform", filters.platform)

      const res = await fetch(`/api/meta/adlibrary?${params}`)
      if (!res.ok) throw new Error("Failed to fetch ad library")
      const json = await res.json()
      return json.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCompetitors() {
  const { activeAccountId } = useAccountStore()

  return useQuery<CompetitorBrand[]>({
    queryKey: ["competitors", activeAccountId],
    queryFn: async () => {
      const res = await fetch("/api/meta/competitors")
      if (!res.ok) throw new Error("Failed to fetch competitors")
      const json = await res.json()
      return json.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useOpportunityScore() {
  const { activeAccountId } = useAccountStore()

  return useQuery<OpportunityScore>({
    queryKey: ["opportunity-score", activeAccountId],
    queryFn: async () => {
      const res = await fetch("/api/meta/opportunity-score")
      if (!res.ok) throw new Error("Failed to fetch opportunity score")
      const json = await res.json()
      return json.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useOpportunityItems(category?: string, impact?: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<OpportunityItem[]>({
    queryKey: ["opportunity-items", category, impact, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams({ detail: "opportunities" })
      if (category && category !== "all") params.set("category", category)
      if (impact && impact !== "all") params.set("impact", impact)

      const res = await fetch(`/api/meta/opportunity-score?${params}`)
      if (!res.ok) throw new Error("Failed to fetch opportunities")
      const json = await res.json()
      return json.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useAccounts() {
  return useQuery<AccountItem[]>({
    queryKey: ["managed-accounts"],
    queryFn: async () => {
      const res = await fetch("/api/meta/accounts")
      if (!res.ok) throw new Error("Failed to fetch accounts")
      const json = await res.json()
      // Merge with advanced account data
      const advRes = await fetch("/api/meta/competitors").catch(() => null)
      void advRes
      return json.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
