import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get("x-cron-secret")
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Trigger sync for all active accounts
    const syncUrl = new URL("/api/sync", request.url)
    const syncResponse = await fetch(syncUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": cronSecret || "",
      },
      body: JSON.stringify({ type: "full" }),
    })

    const syncResult = await syncResponse.json()

    return NextResponse.json({
      data: {
        timestamp: new Date().toISOString(),
        syncResult,
      },
    })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { error: "Cron job failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const cronSecret = request.nextUrl.searchParams.get("secret")
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    status: "healthy",
    lastRun: new Date().toISOString(),
  })
}
