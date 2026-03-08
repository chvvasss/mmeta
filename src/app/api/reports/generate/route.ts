import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateReports, generateReportDetail } from "@/lib/mock-automation"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const id = searchParams.get("id")
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    if (id) {
      const detail = generateReportDetail(id)
      return NextResponse.json({ data: detail })
    }

    let reports = generateReports()
    if (type && type !== "all") {
      reports = reports.filter(r => r.type === type)
    }
    if (status && status !== "all") {
      reports = reports.filter(r => r.status === status)
    }

    return NextResponse.json({ data: reports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
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
      data: { id: `rpt_${Date.now()}`, ...body, status: "generating", createdAt: new Date().toISOString() },
    }, { status: 201 })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
