"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import type { AutomationRule, RuleExecution } from "@/lib/mock-automation"

export function useAutomationRules(status?: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<AutomationRule[]>({
    queryKey: ["automation-rules", status, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams({ type: "rules" })
      if (status && status !== "all") params.set("status", status)

      const res = await fetch(`/api/automation/rules?${params}`)
      if (!res.ok) throw new Error("Failed to fetch automation rules")
      const json = await res.json()
      return json.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useRuleExecutions(ruleId?: string) {
  const { activeAccountId } = useAccountStore()

  return useQuery<RuleExecution[]>({
    queryKey: ["rule-executions", ruleId, activeAccountId],
    queryFn: async () => {
      const params = new URLSearchParams({ type: "executions" })
      if (ruleId) params.set("ruleId", ruleId)

      const res = await fetch(`/api/automation/rules?${params}`)
      if (!res.ok) throw new Error("Failed to fetch rule executions")
      const json = await res.json()
      return json.data
    },
    staleTime: 60 * 1000,
  })
}

export function useCreateRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/automation/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create rule")
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-rules"] })
    },
  })
}

export function useExecuteRule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ruleId: string) => {
      const res = await fetch("/api/automation/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      })
      if (!res.ok) throw new Error("Failed to execute rule")
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rule-executions"] })
    },
  })
}
