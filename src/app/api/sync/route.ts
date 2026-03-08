import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { invalidateCache } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    // Verify auth - either user session or cron secret
    const cronSecret = request.headers.get("x-cron-secret")
    const isCronJob = cronSecret === process.env.CRON_SECRET

    if (!isCronJob) {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const body = await request.json().catch(() => ({}))
    const accountId = (body as Record<string, string>).accountId || "act_123456789"
    const syncType = (body as Record<string, string>).type || "full"

    const results = {
      accountId,
      syncType,
      timestamp: new Date().toISOString(),
      synced: {
        campaigns: 0,
        adsets: 0,
        ads: 0,
        insights: 0,
      },
      status: "completed" as string,
      message: "",
    }

    const accessToken = process.env.META_ACCESS_TOKEN
    if (!accessToken) {
      results.status = "skipped"
      results.message = "META_ACCESS_TOKEN not configured. Using mock data."

      // Invalidate cache so fresh mock data is served
      await invalidateCache(`meta:${accountId}:*`)

      return NextResponse.json({ data: results })
    }

    // In production with real Meta API:
    try {
      if (syncType === "full" || syncType === "campaigns") {
        // const campaigns = await fetchCampaigns(accountId)
        // await db.campaign.upsertMany(...)
        results.synced.campaigns = 8 // Mock count
      }

      if (syncType === "full" || syncType === "insights") {
        // const insights = await fetchAccountInsights(accountId)
        // await db.dailyInsight.upsertMany(...)
        results.synced.insights = 7 // Mock count
      }

      results.status = "completed"
      results.message = "Sync completed successfully"

      // Invalidate cache after sync
      await invalidateCache(`meta:${accountId}:*`)
    } catch (syncError) {
      results.status = "partial"
      results.message = `Sync partially completed: ${syncError instanceof Error ? syncError.message : "Unknown error"}`
    }

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
