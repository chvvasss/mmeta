import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMockAdSets } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const campaignId = searchParams.get("campaignId") || undefined
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    let adSets = generateMockAdSets(campaignId)

    if (status && status !== "ALL") {
      adSets = adSets.filter(a => a.effectiveStatus === status)
    }
    if (search) {
      const q = search.toLowerCase()
      adSets = adSets.filter(a => a.name.toLowerCase().includes(q))
    }

    return NextResponse.json({ data: adSets, meta: { total: adSets.length } })
  } catch (error) {
    console.error("Error fetching ad sets:", error)
    return NextResponse.json({ error: "Failed to fetch ad sets" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Ad Set creation — requires form implementation" }, { status: 501 })
}
