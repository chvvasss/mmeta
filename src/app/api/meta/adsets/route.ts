import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAdSets } from "@/lib/services/adset-service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const result = await getAdSets(session, {
      campaignId: searchParams.get("campaignId") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching ad sets:", error)
    return NextResponse.json({ error: "Failed to fetch ad sets" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Ad Set creation - coming soon" }, { status: 501 })
}
