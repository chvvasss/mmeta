import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  generateAgeBreakdown,
  generateGenderBreakdown,
  generatePlacementBreakdown,
  generateDeviceBreakdown,
  generateHourlyBreakdown,
  generateRegionBreakdown,
  generateFunnelData,
  generateComparisonData,
  generatePerformanceTrend,
  generateHeatmapData,
} from "@/lib/mock-analytics"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") || "breakdown"
    const dimension = searchParams.get("dimension") || "age"
    const days = parseInt(searchParams.get("days") || "30", 10)
    const campaignA = searchParams.get("campaignA") || ""
    const campaignB = searchParams.get("campaignB") || ""
    const metric = searchParams.get("metric") || "clicks"

    switch (type) {
      case "breakdown": {
        let data
        switch (dimension) {
          case "age": data = generateAgeBreakdown(); break
          case "gender": data = generateGenderBreakdown(); break
          case "placement": data = generatePlacementBreakdown(); break
          case "device": data = generateDeviceBreakdown(); break
          case "hourly": data = generateHourlyBreakdown(); break
          case "region": data = generateRegionBreakdown(); break
          default: data = generateAgeBreakdown()
        }
        return NextResponse.json({ data })
      }
      case "funnel": {
        const data = generateFunnelData()
        return NextResponse.json({ data })
      }
      case "comparison": {
        if (!campaignA || !campaignB) {
          return NextResponse.json({ error: "campaignA and campaignB required" }, { status: 400 })
        }
        const data = generateComparisonData(campaignA, campaignB)
        return NextResponse.json({ data })
      }
      case "trend": {
        const data = generatePerformanceTrend(days)
        return NextResponse.json({ data })
      }
      case "heatmap": {
        const validMetric = ["clicks", "conversions", "spend", "ctr"].includes(metric)
          ? (metric as "clicks" | "conversions" | "spend" | "ctr")
          : "clicks"
        const data = generateHeatmapData(validMetric)
        return NextResponse.json({ data })
      }
      default:
        return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
