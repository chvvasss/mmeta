"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import { useDateRangeStore } from "@/stores/date-range-store"
import type {
  BreakdownRow,
  HourlyData,
  FunnelStep,
  ComparisonMetric,
  TrendComparison,
  RegionData,
  HeatmapCell,
} from "@/lib/mock-analytics"
import type { SpendChartData } from "@/types/app"

async function fetchAnalytics<T>(params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams(params)
  const res = await fetch(`/api/meta/analytics?${query}`)
  if (!res.ok) throw new Error("Failed to fetch analytics")
  const json = await res.json()
  return json.data
}

export function useBreakdown(dimension: string) {
  const { activeAccountId } = useAccountStore()
  const { preset } = useDateRangeStore()

  return useQuery<BreakdownRow[]>({
    queryKey: ["analytics", "breakdown", dimension, activeAccountId, preset],
    queryFn: () => fetchAnalytics<BreakdownRow[]>({ type: "breakdown", dimension }),
    staleTime: 3 * 60 * 1000,
  })
}

export function useHourlyBreakdown() {
  const { activeAccountId } = useAccountStore()

  return useQuery<HourlyData[]>({
    queryKey: ["analytics", "hourly", activeAccountId],
    queryFn: () => fetchAnalytics<HourlyData[]>({ type: "breakdown", dimension: "hourly" }),
    staleTime: 3 * 60 * 1000,
  })
}

export function useRegionBreakdown() {
  const { activeAccountId } = useAccountStore()

  return useQuery<RegionData[]>({
    queryKey: ["analytics", "region", activeAccountId],
    queryFn: () => fetchAnalytics<RegionData[]>({ type: "breakdown", dimension: "region" }),
    staleTime: 3 * 60 * 1000,
  })
}

export function useFunnel() {
  const { activeAccountId } = useAccountStore()
  const { preset } = useDateRangeStore()

  return useQuery<FunnelStep[]>({
    queryKey: ["analytics", "funnel", activeAccountId, preset],
    queryFn: () => fetchAnalytics<FunnelStep[]>({ type: "funnel" }),
    staleTime: 3 * 60 * 1000,
  })
}

export function useComparison(campaignA: string, campaignB: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<{ metrics: ComparisonMetric[]; trend: TrendComparison[] }>({
    queryKey: ["analytics", "comparison", campaignA, campaignB, activeAccountId],
    queryFn: () =>
      fetchAnalytics<{ metrics: ComparisonMetric[]; trend: TrendComparison[] }>({
        type: "comparison",
        campaignA,
        campaignB,
      }),
    enabled: !!campaignA && !!campaignB,
    staleTime: 3 * 60 * 1000,
  })
}

export function usePerformanceTrend(days: number = 30) {
  const { activeAccountId } = useAccountStore()

  return useQuery<SpendChartData[]>({
    queryKey: ["analytics", "trend", days, activeAccountId],
    queryFn: () => fetchAnalytics<SpendChartData[]>({ type: "trend", days: String(days) }),
    staleTime: 3 * 60 * 1000,
  })
}

export function useHeatmap(metric: "clicks" | "conversions" | "spend" | "ctr" = "clicks") {
  const { activeAccountId } = useAccountStore()

  return useQuery<HeatmapCell[]>({
    queryKey: ["analytics", "heatmap", metric, activeAccountId],
    queryFn: () => fetchAnalytics<HeatmapCell[]>({ type: "heatmap", metric }),
    staleTime: 3 * 60 * 1000,
  })
}
