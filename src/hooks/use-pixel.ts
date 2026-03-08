"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import type { PixelEvent, PixelOverview, PixelEventTrend, EMQBreakdown } from "@/lib/mock-pixel"

async function fetchPixel<T>(params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams(params)
  const res = await fetch(`/api/meta/pixel/events?${query}`)
  if (!res.ok) throw new Error("Failed to fetch pixel data")
  const json = await res.json()
  return json.data
}

export function usePixelOverview() {
  const { activeAccountId } = useAccountStore()

  return useQuery<PixelOverview>({
    queryKey: ["pixel", "overview", activeAccountId],
    queryFn: () => fetchPixel<PixelOverview>({ type: "overview" }),
    staleTime: 2 * 60 * 1000,
  })
}

export function usePixelEvents() {
  const { activeAccountId } = useAccountStore()

  return useQuery<PixelEvent[]>({
    queryKey: ["pixel", "events", activeAccountId],
    queryFn: () => fetchPixel<PixelEvent[]>({ type: "events" }),
    staleTime: 2 * 60 * 1000,
  })
}

export function useEventTrend(days: number = 7) {
  const { activeAccountId } = useAccountStore()

  return useQuery<PixelEventTrend[]>({
    queryKey: ["pixel", "trend", days, activeAccountId],
    queryFn: () => fetchPixel<PixelEventTrend[]>({ type: "trend", days: String(days) }),
    staleTime: 2 * 60 * 1000,
  })
}

export function useEMQBreakdown() {
  const { activeAccountId } = useAccountStore()

  return useQuery<EMQBreakdown[]>({
    queryKey: ["pixel", "emq", activeAccountId],
    queryFn: async () => {
      const res = await fetch("/api/meta/pixel/emq")
      if (!res.ok) throw new Error("Failed to fetch EMQ data")
      const json = await res.json()
      return json.data
    },
    staleTime: 3 * 60 * 1000,
  })
}
