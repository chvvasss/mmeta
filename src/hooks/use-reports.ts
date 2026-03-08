"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import type { ReportItem, ReportDetail } from "@/lib/mock-automation"

export function useReports(type?: string, status?: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<ReportItem[]>({
    queryKey: ["reports", type, status, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (type && type !== "all") params.set("type", type)
      if (status && status !== "all") params.set("status", status)

      const res = await fetch(`/api/reports/generate?${params}`)
      if (!res.ok) throw new Error("Failed to fetch reports")
      const json = await res.json()
      return json.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useReportDetail(reportId: string) {
  return useQuery<ReportDetail>({
    queryKey: ["report-detail", reportId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/generate?id=${reportId}`)
      if (!res.ok) throw new Error("Failed to fetch report detail")
      const json = await res.json()
      return json.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!reportId,
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create report")
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
  })
}

export function useExportReport() {
  return useMutation({
    mutationFn: async ({ reportId, format }: { reportId: string; format: string }) => {
      const res = await fetch("/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, format }),
      })
      if (!res.ok) throw new Error("Failed to export report")
      const json = await res.json()
      return json.data
    },
  })
}
