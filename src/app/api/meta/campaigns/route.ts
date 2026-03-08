import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMockCampaigns } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const accountId = searchParams.get("accountId")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "spend"
    const sortDir = searchParams.get("sortDir") || "desc"

    let campaigns = generateMockCampaigns()

    // Filter by status
    if (status && status !== "ALL") {
      const statuses = status.split(",")
      campaigns = campaigns.filter(c => statuses.includes(c.effectiveStatus))
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase()
      campaigns = campaigns.filter(c => c.name.toLowerCase().includes(q))
    }

    // Sort
    campaigns.sort((a, b) => {
      const key = sortBy as keyof typeof a
      const aVal = a[key] ?? 0
      const bVal = b[key] ?? 0
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal
      }
      return sortDir === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal))
    })

    return NextResponse.json({
      data: campaigns,
      meta: {
        total: campaigns.length,
        accountId: accountId || "act_123456789",
      },
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Campaign creation - Phase 3" }, { status: 501 })
}
