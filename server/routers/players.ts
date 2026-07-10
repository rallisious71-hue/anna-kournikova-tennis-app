import { router, publicProcedure } from "@/server/_core/trpc";
import { z } from "zod";
import { getDb } from "@/server/db";
import { players } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const playersRouter = router({
  /**
   * Register a new player
   */
  register: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(1, "Full name is required"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // This app is limited to a fixed set of accounts (4 players + 1 admin).
      // Once they exist, self-registration is closed.
      const allPlayers = await db.select().from(players);
      if (allPlayers.length >= 5) {
        throw new Error("Registration is closed. Contact the admin to get an account.");
      }

      // Check if username already exists
      const existing = await db.select().from(players).where(eq(players.username, input.username)).limit(1);

      if (existing.length > 0) {
        throw new Error("Username already taken");
      }

      // Hash password
      const passwordHash = hashPassword(input.password);

      // Determine role: only the "admin" username gets admin rights, everyone else is a view-only user
      const role = input.username.toLowerCase() === "admin" ? "admin" : "user";

      // Create player
      await db.insert(players).values({
        name: input.fullName,
        username: input.username,
        passwordHash,
        role,
      });

      // Get the created player
      const created = await db.select().from(players).where(eq(players.username, input.username)).limit(1);
      
      return { success: true, id: created[0]?.id || 0, role: created[0]?.role || "user" };
    }),

  /**
   * Login player
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const player = await db.select().from(players).where(eq(players.username, input.username)).limit(1);

      if (player.length === 0) {
        throw new Error("Invalid credentials");
      }

      const passwordHash = hashPassword(input.password);
      if (player[0].passwordHash !== passwordHash) {
        throw new Error("Invalid credentials");
      }

      return {
        id: player[0].id,
        name: player[0].name,
        username: player[0].username,
        role: player[0].role,
      };
    }),

  /**
   * Change password for an existing player.
   * Requires the current username + current password to verify identity,
   * then updates to the new password.
   */
  changePassword: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(3, "New password must be at least 3 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const player = await db.select().from(players).where(eq(players.username, input.username)).limit(1);

      if (player.length === 0) {
        throw new Error("Invalid credentials");
      }

      const currentHash = hashPassword(input.currentPassword);
      if (player[0].passwordHash !== currentHash) {
        throw new Error("Current password is incorrect");
      }

      const newHash = hashPassword(input.newPassword);

      await db.update(players).set({ passwordHash: newHash }).where(eq(players.username, input.username));

      return { success: true };
    }),

  /**
   * Get all players
   */
  getAllPlayers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allPlayers = await db.select().from(players);
    return allPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      username: p.username,
    }));
  }),

  /**
   * Get player by ID
   */
  getPlayer: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const player = await db.select().from(players).where(eq(players.id, input.id)).limit(1);

      if (player.length === 0) {
        throw new Error("Player not found");
      }

      return {
        id: player[0].id,
        name: player[0].name,
        username: player[0].username,
      };
    }),
});
