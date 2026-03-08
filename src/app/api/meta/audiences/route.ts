import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateAudiences } from "@/lib/mock-pixel"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const type = searchParams.get("type") || "all"
    const search = searchParams.get("search") || ""

    let audiences = generateAudiences()

    if (type !== "all") {
      audiences = audiences.filter(a => a.type === type)
    }

    if (search) {
      const q = search.toLowerCase()
      audiences = audiences.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.subtype.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ data: audiences })
  } catch (error) {
    console.error("Error fetching audiences:", error)
    return NextResponse.json({ error: "Failed to fetch audiences" }, { status: 500 })
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
      data: { id: `aud_${Date.now()}`, ...body, status: "updating", size: 0, createdAt: new Date().toISOString() },
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating audience:", error)
    return NextResponse.json({ error: "Failed to create audience" }, { status: 500 })
  }
}
