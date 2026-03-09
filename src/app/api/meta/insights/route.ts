import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getKPIs, getDailyInsights, getAccountSummary } from "@/lib/services/insight-service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") || "kpi"
    const datePreset = searchParams.get("datePreset") || "last_7d"

    const daysMap: Record<string, number> = {
      today: 1, yesterday: 1, last_7d: 7, last_14d: 14,
      last_30d: 30, last_90d: 90,
      this_month: new Date().getDate(),
      last_month: new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
    }

    switch (type) {
      case "kpi": {
        const data = await getKPIs(session, datePreset)
        return NextResponse.json({ data })
      }
      case "daily": {
        const days = daysMap[datePreset] || 7
        const data = await getDailyInsights(session, days)
        return NextResponse.json({ data })
      }
      case "summary": {
        const data = await getAccountSummary(session)
        return NextResponse.json({ data })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}
