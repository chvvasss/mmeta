import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAccounts } from "@/lib/services/account-service"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getAccounts(session)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}
