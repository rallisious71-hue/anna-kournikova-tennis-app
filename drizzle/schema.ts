import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tennis Match table - stores completed matches
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  /** Team 1 Player 1 name */
  team1Player1: varchar("team1Player1", { length: 255 }).notNull(),
  /** Team 1 Player 2 name */
  team1Player2: varchar("team1Player2", { length: 255 }).notNull(),
  /** Team 2 Player 1 name */
  team2Player1: varchar("team2Player1", { length: 255 }).notNull(),
  /** Team 2 Player 2 name */
  team2Player2: varchar("team2Player2", { length: 255 }).notNull(),
  /** Sets won by Team 1 */
  team1Sets: int("team1Sets").notNull().default(0),
  /** Sets won by Team 2 */
  team2Sets: int("team2Sets").notNull().default(0),
  /** Games won by Team 1 in current set */
  team1Games: int("team1Games").notNull().default(0),
  /** Games won by Team 2 in current set */
  team2Games: int("team2Games").notNull().default(0),
  /** Winner: 1 for Team 1, 2 for Team 2 */
  winner: int("winner"),
  /** Match date */
  matchDate: timestamp("matchDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

/**
 * Player Statistics table - aggregated stats for each player
 */
export const playerStats = mysqlTable("playerStats", {
  id: int("id").autoincrement().primaryKey(),
  /** Player name */
  playerName: varchar("playerName", { length: 255 }).notNull().unique(),
  /** Total matches played */
  matchesPlayed: int("matchesPlayed").notNull().default(0),
  /** Total matches won */
  matchesWon: int("matchesWon").notNull().default(0),
  /** Total sets won */
  setsWon: int("setsWon").notNull().default(0),
  /** Total games won */
  gamesWon: int("gamesWon").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerStats = typeof playerStats.$inferInsert;
