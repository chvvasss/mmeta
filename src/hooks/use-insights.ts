"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import { useDateRangeStore } from "@/stores/date-range-store"
import type { KPIData, SpendChartData } from "@/types/app"
import type { AccountSummary } from "@/lib/mock-data"

async function fetchInsights<T>(type: string, datePreset: string, accountId: string | null): Promise<T> {
  const params = new URLSearchParams({ type, datePreset })
  if (accountId) params.set("accountId", accountId)

  const res = await fetch(`/api/meta/insights?${params}`)
  if (!res.ok) throw new Error("Failed to fetch insights")
  const json = await res.json()
  return json.data
}

export function useKPIInsights() {
  const { activeAccountId } = useAccountStore()
  const { preset } = useDateRangeStore()

  return useQuery<KPIData[]>({
    queryKey: ["meta", "insights", "kpi", activeAccountId, preset],
    queryFn: () => fetchInsights<KPIData[]>("kpi", preset, activeAccountId),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useDailyInsights() {
  const { activeAccountId } = useAccountStore()
  const { preset } = useDateRangeStore()

  return useQuery<SpendChartData[]>({
    queryKey: ["meta", "insights", "daily", activeAccountId, preset],
    queryFn: () => fetchInsights<SpendChartData[]>("daily", preset, activeAccountId),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useAccountSummary() {
  const { activeAccountId } = useAccountStore()
  const { preset } = useDateRangeStore()

  return useQuery<AccountSummary>({
    queryKey: ["meta", "insights", "summary", activeAccountId, preset],
    queryFn: () => fetchInsights<AccountSummary>("summary", preset, activeAccountId),
    staleTime: 5 * 60 * 1000,
  })
}
