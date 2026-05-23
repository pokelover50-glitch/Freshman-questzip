import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  id: number;
  playerName: string;
  level: number;
  ngPlus: number;
  characterClass: string | null;
  submittedAt: string;
}

const CLASS_EMOJI: Record<string, string> = {
  warrior: "⚔️",
  mage: "🔮",
  rogue: "🗡️",
  paladin: "🛡️",
  ranger: "🏹",
};

function rankBadge(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function LeaderboardPanel({
  onClose,
  currentLevel,
  currentNgPlus,
  currentClass,
}: {
  onClose: () => void;
  currentLevel: number;
  currentNgPlus: number;
  currentClass: string | null;
}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitName, setSubmitName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);

  const apiBase = "/api";

  async function fetchLeaderboard() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/leaderboard`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      setError("Could not load leaderboard. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function handleSubmit() {
    if (!submitName.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch(`${apiBase}/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: submitName.trim().slice(0, 32),
          level: currentLevel,
          ngPlus: currentNgPlus,
          characterClass: currentClass,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitResult("success");
      setShowSubmit(false);
      await fetchLeaderboard();
    } catch {
      setSubmitResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-card border border-primary/30 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div>
            <h2 className="text-xl font-serif font-bold text-primary">🏆 Leaderboard</h2>
            <p className="text-xs font-serif text-muted-foreground/60 mt-0.5">Top 50 highest-level players</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground/50 hover:text-foreground transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Submit your score */}
        <div className="px-5 py-3 border-b border-border/40 bg-primary/5">
          <AnimatePresence mode="wait">
            {!showSubmit ? (
              <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-serif text-muted-foreground">
                    Your score: <span className="text-primary font-bold">Lvl {currentLevel}</span>
                    {currentNgPlus > 0 && <span className="ml-1 text-fuchsia-400 text-xs">NG+{currentNgPlus}</span>}
                  </div>
                  <Button
                    size="sm"
                    className="font-serif text-xs h-7 bg-primary/80 hover:bg-primary"
                    onClick={() => { setShowSubmit(true); setSubmitResult(null); }}
                  >
                    Submit Score
                  </Button>
                </div>
                {submitResult === "success" && (
                  <p className="text-xs text-green-400 font-serif mt-1">✓ Score submitted!</p>
                )}
                {submitResult === "error" && (
                  <p className="text-xs text-red-400 font-serif mt-1">Failed to submit. Try again.</p>
                )}
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 items-center">
                <input
                  autoFocus
                  type="text"
                  placeholder="Your name (max 32 chars)"
                  value={submitName}
                  onChange={(e) => setSubmitName(e.target.value.slice(0, 32))}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") setShowSubmit(false); }}
                  className="flex-1 text-sm font-serif bg-background border border-border/60 rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60"
                />
                <Button
                  size="sm"
                  className="font-serif text-xs h-8 shrink-0"
                  onClick={handleSubmit}
                  disabled={submitting || !submitName.trim()}
                >
                  {submitting ? "…" : "Go"}
                </Button>
                <button
                  onClick={() => setShowSubmit(false)}
                  className="text-muted-foreground/50 hover:text-foreground text-sm transition-colors shrink-0"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {loading && (
            <div className="text-center py-10 text-muted-foreground/50 font-serif text-sm">Loading…</div>
          )}
          {error && !loading && (
            <div className="text-center py-6">
              <p className="text-red-400/70 font-serif text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-3 font-serif text-xs" onClick={fetchLeaderboard}>
                Retry
              </Button>
            </div>
          )}
          {!loading && !error && entries.length === 0 && (
            <div className="text-center py-10 text-muted-foreground/40 font-serif text-sm italic">
              No entries yet. Be the first!
            </div>
          )}
          {!loading && !error && entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors ${
                i < 3
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/30 bg-card/60"
              }`}
            >
              <span className={`text-base w-8 text-center shrink-0 font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-muted-foreground/50 text-sm font-serif"}`}>
                {rankBadge(i + 1)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 truncate">
                  {entry.characterClass && (
                    <span className="text-sm shrink-0">{CLASS_EMOJI[entry.characterClass] ?? "🎮"}</span>
                  )}
                  <span className="font-serif font-semibold text-foreground text-sm truncate">{entry.playerName}</span>
                  {entry.ngPlus > 0 && (
                    <span className="text-xs text-fuchsia-400 font-serif shrink-0">NG+{entry.ngPlus}</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-primary font-bold font-serif text-sm">Lvl {entry.level}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/40">
          <button
            onClick={fetchLeaderboard}
            className="w-full text-xs font-serif text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
