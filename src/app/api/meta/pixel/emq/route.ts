import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateEMQBreakdown } from "@/lib/mock-pixel"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const breakdown = generateEMQBreakdown()
    return NextResponse.json({ data: breakdown })
  } catch (error) {
    console.error("Error fetching EMQ data:", error)
    return NextResponse.json({ error: "Failed to fetch EMQ data" }, { status: 500 })
  }
}
