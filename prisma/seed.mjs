import bcrypt from "bcryptjs"
import pg from "pg"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URL })

async function main() {
  await client.connect()

  const hashedPassword = await bcrypt.hash("Admin123!", 12)

  // Upsert admin user
  const result = await client.query(
    `INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email`,
    ["admin@metaboost.com", "Admin", hashedPassword, "ADMIN"]
  )

  if (result.rows.length > 0) {
    console.log("Seed completed:")
    console.log(`  Admin user: ${result.rows[0].email} (${result.rows[0].id})`)
  } else {
    console.log("Admin user already exists, skipping.")
  }
  console.log("  Login: admin@metaboost.com / Admin123!")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await client.end()
  })
