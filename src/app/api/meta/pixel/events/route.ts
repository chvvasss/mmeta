import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generatePixelEvents, generatePixelOverview, generateEventTrend } from "@/lib/mock-pixel"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") || "events"

    switch (type) {
      case "events": {
        const events = generatePixelEvents()
        return NextResponse.json({ data: events })
      }
      case "overview": {
        const overview = generatePixelOverview()
        return NextResponse.json({ data: overview })
      }
      case "trend": {
        const days = parseInt(searchParams.get("days") || "7", 10)
        const trend = generateEventTrend(days)
        return NextResponse.json({ data: trend })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching pixel events:", error)
    return NextResponse.json({ error: "Failed to fetch pixel events" }, { status: 500 })
  }
}
