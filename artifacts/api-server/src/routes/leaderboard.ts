import { Router, type IRouter } from "express";
import { db, leaderboardTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(leaderboardTable)
      .orderBy(desc(leaderboardTable.level), desc(leaderboardTable.ngPlus))
      .limit(50);
    res.json({ entries: rows });
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
