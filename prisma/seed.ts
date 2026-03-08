import bcrypt from "bcryptjs"

// Use dynamic import to handle the generated prisma client path
async function main() {
  const { PrismaClient } = await import("../src/generated/prisma")
  const prisma = new PrismaClient()

  try {
    const hashedPassword = await bcrypt.hash("Admin123!", 12)

    const admin = await prisma.user.upsert({
      where: { email: "admin@metaboost.com" },
      update: {},
      create: {
        email: "admin@metaboost.com",
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("Seed completed:")
    console.log(`  Admin user: ${admin.email} (${admin.id})`)
    console.log("  Password: Admin123!")
    console.log("")
    console.log("You can now login with these credentials.")
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
