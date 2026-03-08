import { NextRequest, NextResponse } from "next/server"
import { generateAdLibraryItems } from "@/lib/mock-advanced"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.toLowerCase()
  const adType = searchParams.get("adType")
  const status = searchParams.get("status")
  const platform = searchParams.get("platform")

  let items = generateAdLibraryItems()

  if (query) {
    items = items.filter(
      (item) =>
        item.advertiserName.toLowerCase().includes(query) ||
        item.creative.headline.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
  }

  if (adType && adType !== "all") {
    items = items.filter((item) => item.adType === adType)
  }

  if (status && status !== "all") {
    items = items.filter((item) => item.status === status)
  }

  if (platform && platform !== "all") {
    items = items.filter((item) => item.platform.includes(platform as "facebook" | "instagram"))
  }

  return NextResponse.json({ data: items })
}
