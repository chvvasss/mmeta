import { NextResponse } from "next/server"
import { generateCompetitorBrands } from "@/lib/mock-advanced"

export async function GET() {
  const brands = generateCompetitorBrands()
  return NextResponse.json({ data: brands })
}
