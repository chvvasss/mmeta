import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMockAds } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const adSetId = searchParams.get("adSetId") || undefined
    const search = searchParams.get("search")

    let ads = generateMockAds(adSetId)

    if (search) {
      const q = search.toLowerCase()
      ads = ads.filter(a => a.name.toLowerCase().includes(q))
    }

    return NextResponse.json({ data: ads, meta: { total: ads.length } })
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Ad creation — requires form implementation" }, { status: 501 })
}
