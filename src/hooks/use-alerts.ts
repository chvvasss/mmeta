"use client"

import { useQuery } from "@tanstack/react-query"
import type { AlertItem } from "@/types/app"

interface AlertsResponse {
  data: AlertItem[]
  meta: { unreadCount: number }
}

async function fetchAlerts(): Promise<AlertsResponse> {
  const res = await fetch("/api/alerts")
  if (!res.ok) throw new Error("Failed to fetch alerts")
  return res.json()
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
