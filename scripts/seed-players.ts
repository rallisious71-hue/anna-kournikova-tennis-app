/**
 * Seeds the fixed set of accounts for this private tennis app:
 * 4 view-only players + 1 admin.
 *
 * Usage:
 *   pnpm tsx scripts/seed-players.ts
 *
 * Requires DATABASE_URL to be set (same as the rest of the app).
 * Safe to re-run: existing usernames are updated in place instead of
 * being duplicated.
 */
import "dotenv/config";
import crypto from "crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { players } from "../drizzle/schema";

// Must match the hashing used in server/routers/players.ts
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Password is intentionally set equal to the username for every account,
// per project requirements. Change this if you need real security.
const ACCOUNTS: { name: string; username: string; password: string; role: "admin" | "user" }[] = [
  { name: "ΣΤΕΦΑΝΟΣ", username: "stefanos", password: "stefanos", role: "user" },
  { name: "ΑΝΔΡΕΑΣ", username: "andreas", password: "andreas", role: "user" },
  { name: "ΝΟΤΗΣ", username: "notis", password: "notis", role: "user" },
  { name: "ΜΑΝΟΣ", username: "manos", password: "manos", role: "user" },
  { name: "Admin", username: "admin", password: "admin", role: "admin" },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to run this script");
  }

  const db = drizzle(connectionString);

  for (const account of ACCOUNTS) {
    const passwordHash = hashPassword(account.password);
    const existing = await db.select().from(players).where(eq(players.username, account.username)).limit(1);

    if (existing.length > 0) {
      await db
        .update(players)
        .set({ name: account.name, passwordHash, role: account.role })
        .where(eq(players.username, account.username));
      console.log(`Updated: ${account.username} (${account.role})`);
    } else {
      await db.insert(players).values({
        name: account.name,
        username: account.username,
        passwordHash,
        role: account.role,
      });
      console.log(`Created: ${account.username} (${account.role})`);
    }
  }

  console.log("\nDone. Accounts are ready to log in with.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
