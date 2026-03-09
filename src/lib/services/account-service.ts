import type { Session } from "next-auth"
import { getDataMode, getAccessToken } from "../data-mode"
import { generateMockAccounts } from "../mock-data"

const META_API_BASE = "https://graph.facebook.com/v22.0"

interface MetaAdAccountRaw {
  id: string
  name: string
  currency: string
  timezone_name: string
  account_status: number
  business_name?: string
}

async function fetchRealAccounts(accessToken: string) {
  const fields = "id,name,currency,timezone_name,account_status,business_name"
  const url = `${META_API_BASE}/me/adaccounts?fields=${fields}&access_token=${accessToken}&limit=50`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch ad accounts from Meta")

  const json = await res.json()
  return (json.data || []).map((a: MetaAdAccountRaw) => ({
    id: a.id,
    name: a.name,
    currency: a.currency,
    timezone: a.timezone_name,
    status: a.account_status,
    businessName: a.business_name || "",
  }))
}

export async function getAccounts(session: Session | null) {
  const mode = getDataMode(session)

  if (mode === "live") {
    const token = getAccessToken(session)
    if (token) {
      try {
        const accounts = await fetchRealAccounts(token)
        if (accounts.length > 0) {
          return { data: accounts, meta: { mode: "live" } }
        }
      } catch (err) {
        console.error("[AccountService] Falling back to demo:", err)
      }
    }
  }

  return { data: generateMockAccounts(), meta: { mode: "demo" } }
}
