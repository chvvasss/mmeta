import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCampaigns } from "@/lib/services/campaign-service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const result = await getCampaigns(session, {
      accountId: searchParams.get("accountId") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "spend",
      sortDir: searchParams.get("sortDir") || "desc",
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Campaign creation - coming soon" }, { status: 501 })
}
