import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Ad set insights endpoint - placeholder",
    data: [],
  })
}
