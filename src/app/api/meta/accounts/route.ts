import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMockAccounts } from "@/lib/mock-data"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = (session as unknown as Record<string, unknown>).accessToken as string | undefined

    if (accessToken && process.env.META_ACCESS_TOKEN) {
      try {
        const { getMetaApi } = await import("@/lib/meta/client")
        getMetaApi()
        // Real Meta API call would go here in Phase 3+
      } catch {
        // Meta API not configured
      }
    }

    const accounts = generateMockAccounts()
    return NextResponse.json({ data: accounts })
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}
