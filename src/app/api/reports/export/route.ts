import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { reportId, format: exportFormat } = body

    return NextResponse.json({
      data: {
        reportId,
        format: exportFormat || "pdf",
        downloadUrl: `/api/reports/download/${reportId}.${exportFormat || "pdf"}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    })
  } catch (error) {
    console.error("Error exporting report:", error)
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 })
  }
}
