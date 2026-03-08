import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateMockAlerts } from "@/lib/mock-data"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const alerts = generateMockAlerts()
    return NextResponse.json({
      data: alerts,
      meta: { unreadCount: alerts.filter(a => !a.isRead).length },
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
