import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAds } from "@/lib/services/ad-service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const result = await getAds(session, {
      adSetId: searchParams.get("adSetId") || undefined,
      search: searchParams.get("search") || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "Ad creation - coming soon" }, { status: 501 })
}
