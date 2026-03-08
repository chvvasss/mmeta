import { NextRequest, NextResponse } from "next/server"
import { generateOpportunityScore, generateOpportunityItems } from "@/lib/mock-advanced"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const detail = searchParams.get("detail")
  const category = searchParams.get("category")
  const impact = searchParams.get("impact")

  if (detail === "opportunities") {
    let items = generateOpportunityItems()

    if (category && category !== "all") {
      items = items.filter((item) => item.category === category)
    }

    if (impact && impact !== "all") {
      items = items.filter((item) => item.impact === impact)
    }

    return NextResponse.json({ data: items })
  }

  const score = generateOpportunityScore()
  return NextResponse.json({ data: score })
}
