import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { ruleId } = body

    return NextResponse.json({
      data: {
        executionId: `exec_${Date.now()}`,
        ruleId,
        status: "success",
        triggeredAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error("Error executing rule:", error)
    return NextResponse.json({ error: "Failed to execute rule" }, { status: 500 })
  }
}
