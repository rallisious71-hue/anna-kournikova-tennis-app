import { router, publicProcedure } from "@/server/_core/trpc";
import { z } from "zod";
import { getDb } from "@/server/db";
import { matches, playerStats } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const tennisRouter = router({
  /**
   * Save a completed match to the database
   */
  saveMatch: publicProcedure
    .input(
      z.object({
        team1Player1: z.string(),
        team1Player2: z.string(),
        team2Player1: z.string(),
        team2Player2: z.string(),
        team1Sets: z.number(),
        team2Sets: z.number(),
        team1Games: z.number(),
        team2Games: z.number(),
        winner: z.number().int(),
        durationSeconds: z.number().int().min(0).default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Insert match
      const result = await db.insert(matches).values({
        team1Player1: input.team1Player1,
        team1Player2: input.team1Player2,
        team2Player1: input.team2Player1,
        team2Player2: input.team2Player2,
        team1Sets: input.team1Sets,
        team2Sets: input.team2Sets,
        team1Games: input.team1Games,
        team2Games: input.team2Games,
        winner: input.winner,
        durationSeconds: input.durationSeconds,
      });

      // Update player statistics
      const winningTeam = input.winner === 1 ? [input.team1Player1, input.team1Player2] : [input.team2Player1, input.team2Player2];
      const losingTeam = input.winner === 1 ? [input.team2Player1, input.team2Player2] : [input.team1Player1, input.team1Player2];

      for (const player of winningTeam) {
        await updatePlayerStats(player, true, input.winner === 1 ? input.team1Sets : input.team2Sets, input.winner === 1 ? input.team1Games : input.team2Games);
      }

      for (const player of losingTeam) {
        await updatePlayerStats(player, false, input.winner === 1 ? input.team2Sets : input.team1Sets, input.winner === 1 ? input.team2Games : input.team1Games);
      }

      return result;
    }),

  /**
   * Get all player statistics
   */
  getPlayerStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(playerStats).orderBy(desc(playerStats.matchesWon));
  }),

  /**
   * Get match history
   */
  getMatchHistory: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(matches).orderBy(desc(matches.createdAt));
  }),

  /**
   * Update an existing match (admin only)
   */
  updateMatch: publicProcedure
    .input(
      z.object({
        matchId: z.number(),
        team1Sets: z.number(),
        team2Sets: z.number(),
        team1Games: z.number(),
        team2Games: z.number(),
        durationSeconds: z.number().int().min(0).optional(),
        adminUsername: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if user is admin
      if (input.adminUsername !== "SHERUDO") {
        throw new Error("Only admin can edit matches");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const match = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1);

      if (match.length === 0) {
        throw new Error("Match not found");
      }

      let winner = 0;
      if (input.team1Sets > input.team2Sets) winner = 1;
      else if (input.team2Sets > input.team1Sets) winner = 2;

      await db
        .update(matches)
        .set({
          team1Sets: input.team1Sets,
          team2Sets: input.team2Sets,
          team1Games: input.team1Games,
          team2Games: input.team2Games,
          winner,
          ...(input.durationSeconds !== undefined ? { durationSeconds: input.durationSeconds } : {}),
        })
        .where(eq(matches.id, input.matchId));

      return { success: true };
    }),

  /**
   * Delete a match and update player statistics (admin only)
   */
  deleteMatch: publicProcedure
    .input(z.object({ matchId: z.number(), adminUsername: z.string().optional() }))
    .mutation(async ({ input }) => {
      // Check if user is admin
      if (input.adminUsername !== "SHERUDO") {
        throw new Error("Only admin can delete matches");
      }
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const match = await db.select().from(matches).where(eq(matches.id, input.matchId)).limit(1);

      if (match.length === 0) {
        throw new Error("Match not found");
      }

      const m = match[0];

      // Delete the match
      await db.delete(matches).where(eq(matches.id, input.matchId));

      // TODO: Recalculate player statistics after deletion

      return { success: true };
    }),
});

/**
 * Helper function to update player statistics
 */
async function updatePlayerStats(playerName: string, won: boolean, setsWon: number, gamesWon: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(playerStats).where(eq(playerStats.playerName, playerName)).limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(playerStats)
      .set({
        matchesPlayed: existing[0].matchesPlayed + 1,
        matchesWon: existing[0].matchesWon + (won ? 1 : 0),
        setsWon: existing[0].setsWon + setsWon,
        gamesWon: existing[0].gamesWon + gamesWon,
      })
      .where(eq(playerStats.playerName, playerName));
  } else {
    // Create new record
    await db.insert(playerStats).values({
      playerName,
      matchesPlayed: 1,
      matchesWon: won ? 1 : 0,
      setsWon,
      gamesWon,
    });
  }
}
