import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // Return a PrismaClient that will fail on first use but won't crash on import
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: "postgresql://localhost:5432/metaads" }),
    })
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> }

export const db = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
