import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateAutomationRules, generateRuleExecutions } from "@/lib/mock-automation"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") || "rules"

    switch (type) {
      case "rules": {
        const status = searchParams.get("status")
        let rules = generateAutomationRules()
        if (status && status !== "all") {
          rules = rules.filter(r => r.status === status)
        }
        return NextResponse.json({ data: rules })
      }
      case "executions": {
        const ruleId = searchParams.get("ruleId")
        let executions = generateRuleExecutions()
        if (ruleId) {
          executions = executions.filter(e => e.ruleId === ruleId)
        }
        return NextResponse.json({ data: executions })
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching automation rules:", error)
    return NextResponse.json({ error: "Failed to fetch automation rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    return NextResponse.json({
      data: { id: `rule_${Date.now()}`, ...body, status: "draft", createdAt: new Date().toISOString() },
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating automation rule:", error)
    return NextResponse.json({ error: "Failed to create automation rule" }, { status: 500 })
  }
}
