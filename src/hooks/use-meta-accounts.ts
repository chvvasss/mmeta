"use client"

import { useQuery } from "@tanstack/react-query"
import { useAccountStore } from "@/stores/account-store"
import { useEffect } from "react"

interface AdAccountInfo {
  id: string
  name: string
  currency: string
  timezone: string
  status: number
  businessName?: string
}

async function fetchAccounts(): Promise<AdAccountInfo[]> {
  const res = await fetch("/api/meta/accounts")
  if (!res.ok) throw new Error("Failed to fetch accounts")
  const json = await res.json()
  return json.data
}

export function useMetaAccounts() {
  const { setAccounts, activeAccountId } = useAccountStore()

  const query = useQuery({
    queryKey: ["meta", "accounts"],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setAccounts(query.data)
    }
  }, [query.data, setAccounts])

  return {
    ...query,
    activeAccountId,
  }
}
