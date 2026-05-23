import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  level: integer("level").notNull(),
  ngPlus: integer("ng_plus").notNull().default(0),
  characterClass: text("character_class"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertLeaderboardSchema = createInsertSchema(leaderboardTable).omit({ id: true, submittedAt: true });
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboardTable.$inferSelect;
