import { NextResponse } from "next/server"

// Facebook Data Deletion Callback
// https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userId = body?.signed_request ? "pending" : "unknown"

    // Generate a confirmation code
    const confirmationCode = `DEL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    return NextResponse.json({
      url: `https://mmeta.vercel.app/privacy?deletion=${confirmationCode}`,
      confirmation_code: confirmationCode,
    })
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
