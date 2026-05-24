import { Router, type IRouter } from "express";
import { db, leaderboardTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res) => {
  try {
    // DISTINCT ON deduplicates by player name, keeping only the highest-level entry per player
    const rows = await db.execute(sql`
      SELECT * FROM (
        SELECT DISTINCT ON (LOWER(player_name))
          id, player_name, level, ng_plus, character_class, submitted_at
        FROM leaderboard
        ORDER BY LOWER(player_name), level DESC, ng_plus DESC
      ) ranked
      ORDER BY level DESC, ng_plus DESC
      LIMIT 50
    `);
    const entries = rows.rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      playerName: r.player_name,
      level: r.level,
      ngPlus: r.ng_plus,
      characterClass: r.character_class,
      submittedAt: r.submitted_at,
    }));
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/leaderboard", async (req, res) => {
  const { playerName, level, ngPlus, characterClass } = req.body ?? {};

  if (
    typeof playerName !== "string" || playerName.trim().length < 1 || playerName.length > 32 ||
    typeof level !== "number" || !Number.isInteger(level) || level < 1 || level > 9999 ||
    typeof ngPlus !== "number" || !Number.isInteger(ngPlus) || ngPlus < 0 || ngPlus > 10
  ) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  const name = playerName.trim();
  const cls = typeof characterClass === "string" ? characterClass.slice(0, 32) : null;

  try {
    const existing = await db
      .select()
      .from(leaderboardTable)
      .where(sql`LOWER(player_name) = LOWER(${name})`)
      .limit(1);

    if (existing.length > 0) {
      const row = existing[0];
      if (level > row.level || (level === row.level && ngPlus > row.ngPlus)) {
        await db
          .update(leaderboardTable)
          .set({ level, ngPlus, characterClass: cls, submittedAt: new Date() })
          .where(sql`id = ${row.id}`);
      }
      res.json({ success: true });
      return;
    }

    await db
      .insert(leaderboardTable)
      .values({ playerName: name, level, ngPlus, characterClass: cls });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default router;
