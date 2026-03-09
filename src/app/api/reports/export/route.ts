import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCampaigns } from "@/lib/services/campaign-service"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const format = searchParams.get("format") || "csv"

    if (format !== "csv") {
      return NextResponse.json({ error: "Only CSV format is supported" }, { status: 400 })
    }

    const result = await getCampaigns(session)
    const campaigns = result.data

    // Build CSV
    const headers = ["ID", "Kampanya Adi", "Durum", "Hedef", "Gunluk Butce", "Harcama", "Gosterim", "Tiklama", "CPC", "CTR", "Donusum", "ROAS"]
    const rows = campaigns.map(c => [
      c.id,
      `"${c.name}"`,
      c.effectiveStatus,
      c.objective,
      c.dailyBudget || "",
      c.spend,
      c.impressions,
      c.clicks,
      c.cpc,
      c.ctr,
      c.conversions,
      c.roas,
    ].join(","))

    const csv = [headers.join(","), ...rows].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="meta-campaigns-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting:", error)
    return NextResponse.json({ error: "Failed to export" }, { status: 500 })
  }
}

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
        format: exportFormat || "csv",
        downloadUrl: `/api/reports/export?format=${exportFormat || "csv"}`,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    })
  } catch (error) {
    console.error("Error exporting report:", error)
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 })
  }
}
