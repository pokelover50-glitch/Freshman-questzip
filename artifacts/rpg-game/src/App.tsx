import { useGameEngine } from "./game/engine";
import { CHARACTER_CLASSES } from "./game/characters";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { GearItemDef, GearItemInstance } from "./game/types";
import { useState, useEffect, useMemo, useRef } from "react";
import { loadSave, hasSave, formatSaveDate } from "./game/saveLoad";
import { ZONE_NAMES_SHORT } from "./game/encounters";
import { CHEST_LOOT_POOLS, rollChestDrop } from "./game/gear";

const ACHIEVEMENTS = [
  {
    id: "defeat-10-mobs",
    title: "Hall Monitor's Nightmare",
    description: "Defeat 10 mobs (7th Grader, 8th Grader, Fellow Freshman, Sophomore, Junior).",
    goal: 10,
    reward: "🥪 Sandwich",
    secret: false,
  },
  {
    id: "defeat-barrett",
    title: "Uneasy Tension",
    description: 'Defeat Barrett Luke Hutchins for the first time. "Something felt off… like this wasn\'t the true threat."',
    goal: 1,
    reward: "🧰 Bronze Chest",
    secret: false,
  },
  {
    id: "free-hayes",
    title: "Free Mr. Hayes",
    description: "Defeat Captured Mr. Hayes in the Raid and free him from his captors.",
    goal: 1,
    reward: "🔮 Silver Chest",
    secret: false,
  },
  {
    id: "matteo-phone",
    title: "???",
    description: "Defeat a specific enemy while holding a specific item. The right combination unlocks something hidden.",
    goal: 1,
    reward: "🔓 Unlock: Doomscroller Freshman class",
    secret: true,
  },
];

function AchievementsPanel({
  achievements,
  unclaimedAchievements,
  mobsDefeated,
  onClose,
  onClaim,
}: {
  achievements: string[];
  unclaimedAchievements: string[];
  mobsDefeated: number;
  onClose: () => void;
  onClaim: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-16 left-4 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <h3 className="font-serif font-bold text-primary tracking-wide text-lg">Achievements</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
          data-testid="button-achievements-close"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3">
        {ACHIEVEMENTS.map((ach) => {
          const claimed = achievements.includes(ach.id);
          const unclaimed = unclaimedAchievements.includes(ach.id);
          const completed = claimed || unclaimed;
          const isSecret = ach.secret && !completed;
          const progress = ach.id === "defeat-10-mobs" ? Math.min(mobsDefeated, ach.goal) : completed ? ach.goal : 0;
          return (
            <div
              key={ach.id}
              className={`rounded-lg border p-3 transition-all ${
                claimed
                  ? "border-primary/40 bg-primary/5"
                  : unclaimed
                  ? "border-yellow-500/60 bg-yellow-500/10 shadow-[0_0_12px_-4px_rgba(234,179,8,0.4)]"
                  : isSecret
                  ? "border-border/30 bg-background/20"
                  : "border-border bg-background/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 text-xl flex-shrink-0 ${completed ? "opacity-100" : "opacity-30"}`}>
                  {claimed ? "✅" : unclaimed ? "🎁" : isSecret ? "🔮" : "🏆"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-serif font-bold text-sm ${claimed ? "text-primary" : unclaimed ? "text-yellow-400" : isSecret ? "text-muted-foreground/50" : "text-foreground"}`}>
                    {isSecret ? "???" : ach.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {isSecret ? "Secret achievement — discover the hidden combination." : ach.description}
                  </p>
                  {!completed && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground/70 font-serif">
                        <span>Progress</span>
                        <span>{progress} / {ach.goal}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(progress / ach.goal) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {unclaimed && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-xs text-yellow-400/80 font-serif italic">
                        Reward: {ach.reward} — click to claim!
                      </p>
                      <button
                        onClick={() => onClaim(ach.id)}
                        className="w-full py-1.5 rounded-md text-xs font-serif font-bold border border-yellow-500/60 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors"
                        data-testid={`button-claim-${ach.id}`}
                      >
                        ✓ Claim Reward
                      </button>
                    </div>
                  )}
                  {claimed && (
                    <p className="text-xs text-primary/70 font-serif mt-1 italic">Claimed!</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

const ZONE_NAMES = ["The Hallways", "The Cafeteria", "The Senior Lounge"];

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.2 } },
};

function HpBar({
  value,
  max,
  label,
  current,
  reverse = false,
}: {
  value: number;
  max: number;
  label: string;
  current: number;
  reverse?: boolean;
}) {
  const pct = (value / max) * 100;
  const color =
    pct > 50 ? "bg-accent" : pct > 25 ? "bg-yellow-500" : "bg-destructive";
  return (
    <div className={`space-y-1.5 ${reverse ? "text-right" : ""}`}>
      <div
        className={`flex justify-between text-sm font-serif ${reverse ? "flex-row-reverse" : ""}`}
      >
        <span className="text-muted-foreground truncate max-w-[120px]">
          {label}
        </span>
        <span className="font-bold text-foreground">
          {current} / {max}
        </span>
      </div>
      <Progress
        value={pct}
        className="h-3"
        indicatorClassName={color}
        style={reverse ? { transform: "rotateY(180deg)" } : undefined}
      />
    </div>
  );
}

function ChestSpinner({
  chest,
  onClaim,
  onClose,
}: {
  chest: GearItemInstance;
  onClaim: (instanceId: string, wonItem: GearItemDef) => void;
  onClose: () => void;
}) {
  const pool = CHEST_LOOT_POOLS[chest.def.id] ?? [];
  const wonItemRef = useRef<GearItemDef | null>(null);
  if (!wonItemRef.current) wonItemRef.current = rollChestDrop(chest.def.id);
  const wonItem = wonItemRef.current;

  const [displayIdx, setDisplayIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let count = 0;
    const maxCount = 32;
    const tick = () => {
      count++;
      setDisplayIdx((i) => (i + 1) % pool.length);
      const delay = count < 16 ? 70 : count < 26 ? 140 : 240;
      if (count >= maxCount) {
        setTimeout(() => setShowResult(true), 350);
      } else {
        tickRef.current = setTimeout(tick, delay);
      }
    };
    tickRef.current = setTimeout(tick, 70);
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentItem = pool[displayIdx];
  const totalWeight = pool.reduce((s, e) => s + e.weight, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="relative z-10 bg-card border border-primary/50 rounded-2xl shadow-2xl w-full max-w-xl mx-auto"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-border">
          <h3 className="font-serif font-bold text-xl text-primary">{chest.def.emoji} Opening {chest.def.name}</h3>
          <p className="text-xs text-muted-foreground font-serif mt-0.5">
            {showResult ? "You received…" : "Spinning the contents…"}
          </p>
        </div>

        {/* Body: spinner + odds side by side */}
        <div className="flex gap-0 divide-x divide-border">
          {/* Spinner column */}
          <div className="flex-1 p-5 flex flex-col items-center gap-4">
            <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-xl border border-border bg-background/40">
              <AnimatePresence mode="popLayout">
                {!showResult ? (
                  <motion.div
                    key={displayIdx}
                    initial={{ y: -32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 32, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                  >
                    <span className="text-6xl">{currentItem?.item.emoji ?? "✨"}</span>
                    <p className="font-serif text-sm text-muted-foreground" style={currentItem?.item.rarityColor ? { color: currentItem.item.rarityColor } : undefined}>{currentItem?.item.name ?? "…"}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3"
                  >
                    <motion.span
                      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="text-6xl"
                    >
                      {wonItem?.emoji ?? "✨"}
                    </motion.span>
                    <p className="font-serif font-bold text-base leading-tight" style={wonItem?.rarityColor ? { color: wonItem.rarityColor } : undefined}>{wonItem?.name ?? "Unknown Item"}</p>
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed">{wonItem?.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showResult && wonItem ? (
              <Button
                onClick={() => onClaim(chest.instanceId, wonItem)}
                className="w-full font-serif font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                ✨ Claim!
              </Button>
            ) : (
              <div className="h-9 flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                    transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Odds column */}
          <div className="w-44 shrink-0 p-4 flex flex-col gap-1">
            <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">
              Drop Chances
            </p>
            {pool.map((entry, i) => {
              const pct = Math.round((entry.weight / totalWeight) * 100);
              const isSpinning = !showResult && i === displayIdx;
              const isWon = showResult && wonItem?.id === entry.item.id;
              return (
                <motion.div
                  key={entry.item.id}
                  animate={isSpinning ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ duration: 0.1 }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-left ${
                    isWon
                      ? "bg-yellow-500/20 border border-yellow-500/50"
                      : isSpinning
                      ? "bg-primary/15 border border-primary/40"
                      : "border border-transparent"
                  }`}
                >
                  <span className="text-base shrink-0">{entry.item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[11px] font-serif leading-tight truncate ${isWon ? "text-yellow-300 font-bold" : isSpinning ? "text-primary font-semibold" : "font-semibold"}`}
                      style={!isWon && !isSpinning && entry.item.rarityColor ? { color: entry.item.rarityColor } : undefined}
                    >
                      {entry.item.name}
                    </p>
                    <p className={`text-[10px] font-mono ${isWon ? "text-yellow-400" : isSpinning ? "text-primary/80" : "text-muted-foreground/60"}`}>
                      {pct}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InventoryPanel({
  inventory,
  equippedItemId,
  onUse,
  onEquip,
  onUnequip,
  onOpen,
  canUseItems,
  onClose,
}: {
  inventory: GearItemInstance[];
  equippedItemId: string | null;
  onUse: (id: string) => void;
  onEquip: (itemId: string) => void;
  onUnequip: () => void;
  onOpen: (item: GearItemInstance) => void;
  canUseItems: boolean;
  onClose: () => void;
}) {
  const chests = inventory.filter((i) => i.def.isChest);
  const weapons = inventory.filter((i) => i.def.isWeapon);
  const usables = inventory.filter((i) => !i.def.isChest && !i.def.isWeapon);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <h3 className="font-serif font-bold text-primary tracking-wide text-lg">Backpack</h3>
            <span className="text-xs text-muted-foreground font-serif">({inventory.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
          {inventory.length === 0 && (
            <p className="text-center text-muted-foreground font-serif italic text-sm py-8">
              Your backpack is empty. Defeat enemies to collect items!
            </p>
          )}

          {weapons.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60">
                Weapons <span className="normal-case text-muted-foreground/40">(equip one at a time)</span>
              </p>
              <div className="grid grid-cols-1 gap-2">
                {weapons.map((item) => {
                  const isEquipped = equippedItemId === item.def.id;
                  return (
                    <div
                      key={item.instanceId}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isEquipped
                          ? "border-yellow-500/70 bg-yellow-500/10 shadow-[0_0_10px_-4px_rgba(234,179,8,0.5)]"
                          : "border-border bg-background/40 hover:border-primary/40"
                      }`}
                    >
                      <span className="text-3xl shrink-0">{item.def.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-serif font-bold text-sm ${isEquipped ? "text-yellow-300" : ""}`}
                          style={!isEquipped && item.def.rarityColor ? { color: item.def.rarityColor } : undefined}
                        >
                          {item.def.name}
                          {isEquipped && <span className="ml-2 text-[10px] text-yellow-400/80 uppercase tracking-wide font-sans">Equipped</span>}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.def.description}</p>
                      </div>
                      <button
                        onClick={() => isEquipped ? onUnequip() : onEquip(item.def.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-serif font-bold border transition-colors ${
                          isEquipped
                            ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                            : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {isEquipped ? "Unequip" : "Equip"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {usables.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60">
                Items
              </p>
              <div className="grid grid-cols-1 gap-2">
                {usables.map((item) => (
                  <div
                    key={item.instanceId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/40 hover:border-primary/40 transition-colors"
                  >
                    <span className="text-3xl shrink-0">{item.def.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-sm text-foreground">{item.def.name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.def.description}</p>
                    </div>
                    <button
                      onClick={() => { onUse(item.instanceId); onClose(); }}
                      disabled={!canUseItems}
                      className="shrink-0 px-3 py-1.5 rounded-md text-xs font-serif font-bold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chests.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-serif font-bold uppercase tracking-widest text-muted-foreground/60">
                Chests
              </p>
              <div className="grid grid-cols-1 gap-2">
                {chests.map((item) => (
                  <div
                    key={item.instanceId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5"
                  >
                    <span className="text-3xl shrink-0">{item.def.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-sm text-primary">{item.def.name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.def.id === "wooden-chest" && "Common chest. Spin for a weapon!"}
                        {item.def.id === "bronze-chest" && "Uncommon chest. Better odds for rare weapons!"}
                        {item.def.id === "silver-chest" && "Rare chest. High chance of powerful weapons!"}
                      </p>
                    </div>
                    <button
                      onClick={() => { onOpen(item); onClose(); }}
                      className="shrink-0 px-3 py-1.5 rounded-md text-xs font-serif font-bold border border-primary/60 bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function BackpackButton({
  inventory,
  onClick,
}: {
  inventory: GearItemInstance[];
  onClick: () => void;
}) {
  if (inventory.length === 0) return null;
  return (
    <button
      onClick={onClick}
      data-testid="button-backpack"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/60 hover:bg-primary/10 transition-all duration-200 font-serif text-sm text-foreground shadow-lg"
    >
      <span className="text-base">🎒</span>
      <span>Backpack</span>
      <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {inventory.length}
      </span>
    </button>
  );
}

function DropNotification({
  drops,
  onDismiss,
}: {
  drops: GearItemInstance[];
  onDismiss: () => void;
}) {
  if (drops.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
    >
      <div className="rounded-xl border border-primary/50 bg-card/95 backdrop-blur-md shadow-[0_0_30px_-5px_hsl(var(--primary))] p-4 text-center space-y-3">
        <p className="font-serif text-primary font-bold text-sm uppercase tracking-widest">
          Item Drop!
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {drops.map((d) => (
            <div
              key={d.instanceId}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-3xl">{d.def.emoji}</span>
              <span className="text-xs font-serif" style={d.def.rarityColor ? { color: d.def.rarityColor } : undefined}>
                {d.def.name}
              </span>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onDismiss}
          className="font-serif border-primary/40 hover:bg-primary/10 text-xs"
          data-testid="button-dismiss-drops"
        >
          Add to Gear
        </Button>
      </div>
    </motion.div>
  );
}

function GameContent() {
  const game = useGameEngine();
  const { state, currentEncounter, currentRound } = game;
  const [showAchievements, setShowAchievements] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [spinnerChest, setSpinnerChest] = useState<GearItemInstance | null>(null);
  const [saveExists, setSaveExists] = useState(() => hasSave());
  const [saveInfo, setSaveInfo] = useState(() => loadSave());
  const [showSavedBadge, setShowSavedBadge] = useState(false);

  // Pick 4 random choices from the pool each round — cycles through all options over time
  const shuffledChoices = useMemo(() => {
    if (!currentRound) return [];
    const arr = [...currentRound.choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 4);
  // currentRound is a new reference each time the round changes — safe dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound]);

  // Refresh save existence when game state changes
  useEffect(() => {
    setSaveExists(hasSave());
    setSaveInfo(loadSave());
  }, [game.lastSavedAt]);

  // Flash "saved" badge briefly after each auto-save
  useEffect(() => {
    if (!game.lastSavedAt) return;
    setShowSavedBadge(true);
    const t = setTimeout(() => setShowSavedBadge(false), 2500);
    return () => clearTimeout(t);
  }, [game.lastSavedAt]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div
        className="relative z-10 w-full max-w-4xl p-4 sm:p-6"
      >
        <AnimatePresence mode="wait">
          {/* ── TITLE ── */}
          {state.phase === "title" && (
            <motion.div
              key="title"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center text-center space-y-8 py-20"
            >
              <div className="space-y-4">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight drop-shadow-lg">
                  FRESHMAN
                  <br />
                  QUEST
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground font-serif tracking-wide uppercase max-w-2xl mx-auto">
                  Survive the halls. Defeat the legends. Become the myth.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                {saveExists && saveInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full text-lg px-12 py-8 bg-primary text-primary-foreground hover:bg-primary/90 font-serif shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                      onClick={() => game.loadSavedGame()}
                      data-testid="button-continue"
                    >
                      Continue Quest
                    </Button>
                    <p className="mt-1.5 text-xs text-muted-foreground/60 font-serif text-center">
                      {ZONE_NAMES_SHORT[saveInfo.zoneIndex] ?? "Zone " + (saveInfo.zoneIndex + 1)}
                      {" · "}Encounter {saveInfo.encounterIndex + 1}
                      {" · "}Saved {formatSaveDate(saveInfo.savedAt)}
                    </p>
                  </motion.div>
                )}
                <Button
                  size="lg"
                  variant={saveExists ? "outline" : "default"}
                  className={`w-full font-serif shadow-[0_0_40px_-10px_hsl(var(--primary))] ${saveExists ? "text-base px-10 py-6 border-primary/40 hover:bg-primary/10" : "text-lg px-12 py-8 bg-primary text-primary-foreground hover:bg-primary/90"}`}
                  onClick={saveExists ? game.startNewGame : game.goToMainMenu}
                  data-testid="button-begin"
                >
                  {saveExists ? "New Game" : "Begin Your Quest"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── MAIN MENU ── */}
          {state.phase === "main-menu" && (
            <motion.div
              key="main-menu"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center text-center space-y-10 py-20"
            >
              <div className="space-y-3">
                <h2 className="text-5xl font-serif font-bold text-primary tracking-tight">
                  What will you do?
                </h2>
                <p className="text-muted-foreground font-serif text-lg">
                  Choose your path, freshman.
                </p>
              </div>

              <div className="flex flex-col gap-5 w-full max-w-sm">
                <Button
                  size="lg"
                  className="py-8 text-xl font-serif bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-8px_hsl(var(--primary))]"
                  onClick={game.goToCharacterSelect}
                  data-testid="button-begin-journey"
                >
                  Begin Your Journey
                </Button>

                <div className="relative">
                  <Button
                    size="lg"
                    disabled={!state.barrettDefeated}
                    className="w-full py-8 text-xl font-serif bg-card border border-border hover:border-primary/50 hover:bg-primary/10 text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={state.barrettDefeated ? game.goToRaidSelect : undefined}
                    data-testid="button-start-raid"
                  >
                    Start a Raid
                  </Button>
                  {!state.barrettDefeated && (
                    <p className="mt-2 text-xs font-serif text-muted-foreground/60 italic">
                      Defeat Barrett Luke Hutchins to unlock raids
                    </p>
                  )}
                </div>
              </div>

              <button
                className="text-sm font-serif text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                onClick={game.goToTitle}
                data-testid="button-back-title"
              >
                Back to Title
              </button>
            </motion.div>
          )}

          {/* ── RAID SELECT ── */}
          {state.phase === "raid-select" && (
            <motion.div
              key="raid-select"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center space-y-10 py-12"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif font-bold text-primary">
                  Select a Raid
                </h2>
                <p className="text-muted-foreground font-serif">
                  You have earned the right to enter. Choose your battlefield.
                </p>
              </div>

              <div className="flex flex-col gap-5 w-full max-w-lg">
                {[
                  {
                    id: "hayes",
                    name: "Mr. Hayes's Room",
                    subtitle: "Raid I",
                    unlocked: true,
                  },
                  {
                    id: "cronin",
                    name: "Mr. Cronin's Room",
                    subtitle: "Raid II",
                    unlocked: state.completedRaids.includes("hayes"),
                  },
                  {
                    id: "bryant",
                    name: "Mr. Bryant's Room",
                    subtitle: "Raid III",
                    unlocked: state.completedRaids.includes("cronin"),
                  },
                ].map((raid) => (
                  <div key={raid.id} className="relative">
                    <button
                      disabled={!raid.unlocked}
                      data-testid={`button-raid-${raid.id}`}
                      onClick={raid.unlocked ? () => game.beginRaid(raid.id) : undefined}
                      className={`w-full text-left p-6 rounded-xl border transition-all duration-300 font-serif
                        ${raid.unlocked
                          ? "border-border bg-card/60 hover:border-primary hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] hover:bg-primary/5 cursor-pointer"
                          : "border-border/30 bg-card/20 cursor-not-allowed opacity-40"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold tracking-widest text-primary/60 uppercase mb-1">
                            {raid.subtitle}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {raid.name}
                          </p>
                        </div>
                        <div className="text-3xl">
                          {raid.unlocked ? "⚔️" : "🔒"}
                        </div>
                      </div>
                      {!raid.unlocked && (
                        <p className="mt-2 text-sm text-muted-foreground/50 italic">
                          Complete the previous raid to unlock
                        </p>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="text-sm font-serif text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                onClick={game.goToMainMenu}
                data-testid="button-back-menu"
              >
                Back to Menu
              </button>
            </motion.div>
          )}

          {/* ── CHARACTER SELECT ── */}
          {state.phase === "character-select" && (
            <motion.div
              key="character-select"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif font-bold text-primary">
                  Choose Your Class
                </h2>
                <p className="text-muted-foreground">
                  Your identity determines your survival strategy.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  className="text-sm font-serif text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  onClick={game.goToMainMenu}
                >
                  ← Back to Menu
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHARACTER_CLASSES.map((cls) => {
                  const isLocked =
                    cls.id === "hidden" ||
                    (cls.id === "doomscroller-freshman" && !state.doomscrollerUnlocked);
                  return (
                    <Card
                      key={cls.id}
                      className={`transition-all duration-300 bg-card/50 backdrop-blur-sm border-border group
                        ${isLocked
                          ? "opacity-40 cursor-not-allowed select-none"
                          : "cursor-pointer hover:border-primary hover:shadow-[0_0_20px_-5px_hsl(var(--primary))]"
                        }`}
                      onClick={isLocked ? undefined : () => game.selectCharacter(cls)}
                      data-testid={`card-class-${cls.id}`}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className={`text-6xl mb-4 transition-transform duration-300 ${!isLocked ? "group-hover:scale-110" : ""}`}>
                          {cls.emoji}
                        </div>
                        <CardTitle className="font-serif text-2xl text-foreground">
                          {cls.name}
                        </CardTitle>
                        {!isLocked && (
                          <Badge
                            variant="secondary"
                            className="mx-auto w-fit font-serif"
                          >
                            HP: {cls.maxHp}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          {cls.description}
                        </p>
                        <div className="text-xs font-semibold text-accent p-2 bg-accent/10 rounded-md border border-accent/20 font-serif">
                          {cls.bonus}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── INTRO ── */}
          {state.phase === "intro" && state.selectedClass && (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl mx-auto space-y-8"
            >
              <Card className="bg-card border-primary/30 shadow-[0_0_30px_-10px_hsl(var(--primary))]">
                <CardHeader className="text-center border-b border-border/50 pb-6">
                  <div className="text-5xl mb-2">{state.selectedClass.emoji}</div>
                  <CardTitle className="font-serif text-3xl">
                    {state.activeRaidId
                      ? state.activeRaidId === "hayes" ? "Mr. Hayes's Room"
                        : state.activeRaidId === "cronin" ? "Mr. Cronin's Room"
                        : "Mr. Bryant's Room"
                      : "The First Day"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
                  {state.activeRaidId ? (
                    <>
                      <p>
                        You enter{" "}
                        <span className="text-foreground font-semibold">
                          {state.activeRaidId === "hayes" ? "Mr. Hayes's" : state.activeRaidId === "cronin" ? "Mr. Cronin's" : "Mr. Bryant's"} Room
                        </span>
                        . Someone has taken over. The students are hostile. A captured teacher waits at the end.
                        {state.activeRaidId === "bryant" && (
                          <> Rumor has it <span className="text-destructive font-semibold">CK3 Barrett</span> is lurking behind the scenes.</>
                        )}
                      </p>
                      <p>
                        Your HP ({state.selectedClass.maxHp}) is your lifeline. Defeat enemies to collect{" "}
                        <span className="text-primary font-semibold">gear</span> — use it wisely. Raid bosses drop{" "}
                        <span className="text-blue-400 font-semibold">Silver</span> and{" "}
                        <span className="text-yellow-500 font-semibold">Bronze</span> chests only.
                      </p>
                      <div className="pt-4 space-y-2">
                        <h3 className="text-primary font-serif font-bold uppercase tracking-wider text-sm">
                          Raid Details
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {state.activeRaidId === "hayes" && (
                            <>
                              <Badge variant="outline" className="text-sm py-1 border-primary/30 bg-primary/5 font-serif">14 mobs</Badge>
                              <Badge variant="outline" className="text-sm py-1 border-destructive/30 bg-destructive/5 font-serif">Boss: Captured Mr. Hayes</Badge>
                            </>
                          )}
                          {state.activeRaidId === "cronin" && (
                            <>
                              <Badge variant="outline" className="text-sm py-1 border-primary/30 bg-primary/5 font-serif">14 mobs</Badge>
                              <Badge variant="outline" className="text-sm py-1 border-destructive/30 bg-destructive/5 font-serif">Boss: Captured Mr. Cronin</Badge>
                            </>
                          )}
                          {state.activeRaidId === "bryant" && (
                            <>
                              <Badge variant="outline" className="text-sm py-1 border-primary/30 bg-primary/5 font-serif">9 mobs</Badge>
                              <Badge variant="outline" className="text-sm py-1 border-destructive/30 bg-destructive/5 font-serif">Boss: Captured Mr. Bryant</Badge>
                              <Badge variant="outline" className="text-sm py-1 border-red-500/30 bg-red-500/5 text-red-400 font-serif">Secret: CK3 Barrett 👑</Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="pt-6 flex justify-center">
                        <Button
                          size="lg"
                          onClick={game.startRaid}
                          className="font-serif text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                          data-testid="button-enter-raid"
                        >
                          Enter the Room
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        The first day of high school. The halls are dangerous. Three
                        legendary enemies stand between you and legend:{" "}
                        <span className="text-foreground font-semibold">
                          "Senior" Bradley
                        </span>
                        ,{" "}
                        <span className="text-foreground font-semibold">
                          "Super Senior" Westen
                        </span>
                        , and the dreaded{" "}
                        <span className="text-foreground font-semibold text-destructive">
                          Barrett Luke Hutchins
                        </span>
                        .
                      </p>
                      <p>
                        Five mobs guard each boss. Your HP ({state.selectedClass.maxHp}) is your lifeline.
                        Defeat enemies to collect{" "}
                        <span className="text-primary font-semibold">gear</span>{" "}
                        — use it from the hotbar at the bottom. Choose wisely.
                      </p>

                      <div className="pt-4 space-y-2">
                        <h3 className="text-primary font-serif font-bold uppercase tracking-wider text-sm">
                          Zones of Conflict
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {ZONE_NAMES.map((zone, i) => (
                            <Badge
                              key={zone}
                              variant="outline"
                              className="text-sm py-1 border-primary/30 bg-primary/5 font-serif"
                            >
                              Zone {i + 1}: {zone}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 flex justify-center">
                        <Button
                          size="lg"
                          onClick={game.startGame}
                          className="font-serif text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                          data-testid="button-enter-halls"
                        >
                          Enter the Halls
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── ENCOUNTER ── */}
          {state.phase === "encounter" &&
            currentEncounter &&
            currentRound && (
              <motion.div
                key="encounter"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 relative"
              >
                {/* Top bar */}
                <div className="grid grid-cols-2 gap-4 items-center bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg">
                  <HpBar
                    label={state.selectedClass?.name ?? "You"}
                    current={state.playerHp}
                    value={state.playerHp}
                    max={state.playerMaxHp}
                  />
                  <HpBar
                    label={currentEncounter.enemyName}
                    current={state.enemyHp}
                    value={state.enemyHp}
                    max={currentEncounter.enemyMaxHp}
                    reverse
                  />
                  {state.equippedItemId && (() => {
                    const eq = state.inventory.find((i) => i.def.id === state.equippedItemId && i.def.isWeapon);
                    return eq ? (
                      <div className="col-span-2 flex items-center justify-center gap-1.5">
                        <span className="text-base">{eq.def.emoji}</span>
                        <span className="text-xs font-serif font-bold" style={eq.def.rarityColor ? { color: eq.def.rarityColor } : { color: "rgba(250,204,21,0.9)" }}>{eq.def.name}</span>
                        <span className="text-[10px] text-muted-foreground/60 font-serif">equipped</span>
                      </div>
                    ) : null;
                  })()}
                  <div className="col-span-2 flex items-center justify-center gap-3">
                    <span className="text-xs font-serif tracking-widest text-primary/70 uppercase">
                      {ZONE_NAMES[state.zoneIndex]} — Encounter{" "}
                      {state.encounterIndex + 1}
                    </span>
                    <AnimatePresence>
                      {showSavedBadge && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-[10px] font-serif text-accent/80 border border-accent/30 rounded px-1.5 py-0.5 bg-accent/10"
                        >
                          ✓ Saved
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Enemy card */}
                <Card className="border-border bg-card shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
                    <div className="relative">
                      <motion.div
                        animate={
                          state.showOutcome &&
                          state.lastOutcome &&
                          state.lastOutcome.enemyDamage > 0
                            ? {
                                x: [0, -10, 10, -6, 6, 0],
                                transition: { duration: 0.4 },
                              }
                            : {}
                        }
                        className="text-8xl drop-shadow-2xl z-10 relative leading-none"
                      >
                        {currentEncounter.enemyEmoji}
                      </motion.div>
                      {currentEncounter.isBoss && (
                        <Badge
                          variant="destructive"
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 font-serif font-bold uppercase tracking-widest shadow-lg"
                        >
                          BOSS
                        </Badge>
                      )}
                    </div>

                    <div className="max-w-2xl space-y-4 pt-4 w-full">
                      <div className="p-5 rounded-lg bg-black/40 border border-white/5 font-serif text-base sm:text-lg leading-relaxed text-left text-foreground/90 italic shadow-inner">
                        {currentRound.situation}
                      </div>
                      <h3 className="font-bold text-xl text-primary font-serif">
                        {currentRound.question}
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                {/* Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {!state.showOutcome &&
                      shuffledChoices.map((choice, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start font-serif text-base whitespace-normal border-border hover:border-primary/50 hover:bg-primary/10 bg-card/80 backdrop-blur-sm transition-all shadow-sm hover:shadow-[0_0_12px_-4px_hsl(var(--primary))]"
                            onClick={() => game.chooseAnswer(choice)}
                            data-testid={`button-choice-${idx}`}
                          >
                            <span className="text-primary/60 font-bold mr-3 shrink-0">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {choice.text}
                          </Button>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                {/* Item error message */}
                <AnimatePresence>
                  {state.itemActionMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4"
                    >
                      <div
                        className="rounded-lg border border-destructive/50 bg-card/95 backdrop-blur-md px-5 py-3 text-destructive font-serif text-sm shadow-lg cursor-pointer"
                        onClick={game.dismissItemMessage}
                        data-testid="item-error-message"
                      >
                        {state.itemActionMessage} (click to dismiss)
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Outcome overlay */}
                <AnimatePresence>
                  {state.showOutcome && state.lastOutcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-x-0 bottom-0 z-30 p-2"
                    >
                      <Card className="border-primary/50 shadow-[0_0_40px_-10px_hsl(var(--primary))] bg-background/97 backdrop-blur-xl">
                        <CardContent className="pt-6 space-y-5">
                          <p className="text-lg font-serif leading-relaxed text-center">
                            {state.lastOutcome.narrative}
                          </p>

                          {/* Ability message */}
                          {state.abilityMessage && (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 font-serif text-sm text-primary font-semibold"
                            >
                              ✦ {state.abilityMessage}
                            </motion.div>
                          )}

                          <div className="flex justify-center gap-6 font-bold font-serif text-lg flex-wrap">
                            {state.lastOutcome.playerDamage > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-destructive"
                              >
                                -{state.lastOutcome.playerDamage} HP
                              </motion.span>
                            )}
                            {state.lastOutcome.enemyDamage > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.05 }}
                                className="text-primary"
                              >
                                {state.lastOutcome.enemyDamage} DMG dealt
                              </motion.span>
                            )}
                            {state.lastOutcome.healAmount > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-accent"
                              >
                                +{state.lastOutcome.healAmount} HP healed
                              </motion.span>
                            )}
                          </div>

                          <div className="flex justify-center pt-1">
                            <Button
                              size="lg"
                              className="font-serif px-10 bg-primary text-primary-foreground"
                              onClick={game.continueAfterOutcome}
                              data-testid="button-continue"
                            >
                              Continue
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          {/* ── VICTORY ── */}
          {state.phase === "victory" && (
            <motion.div
              key="victory"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-10 py-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-wider drop-shadow-[0_0_30px_hsl(var(--primary))]">
                  QUEST COMPLETE
                </h1>
                <p className="text-xl font-serif text-foreground max-w-2xl mx-auto italic bg-card/50 p-6 rounded-xl border border-border">
                  Barrett Luke Hutchins stares at you for a long, silent moment. Then — slowly — he begins to clap. You have defeated the final boss. You are no longer just a freshman. You are LEGEND.
                </p>
              </div>

              <div className="space-y-6 bg-card/50 p-8 rounded-2xl border border-border/50 backdrop-blur-sm w-full max-w-md">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Defeated Legends
                </h2>
                <div className="space-y-4">
                  {state.defeatedBosses.map((boss, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between font-serif text-lg border-b border-border/50 pb-2"
                    >
                      <span className="text-foreground">{boss}</span>
                      <span className="text-accent text-sm">DEFEATED</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 font-serif border-primary/50 hover:bg-primary/10"
                onClick={game.goToTitle}
                data-testid="button-play-again"
              >
                Return to the Title
              </Button>
            </motion.div>
          )}

          {/* ── RAID COMPLETE ── */}
          {state.phase === "raid-complete" && (
            <motion.div
              key="raid-complete"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-10 py-12"
            >
              <div className="space-y-4">
                <div className="text-6xl mb-2">⚔️</div>
                <h1 className="text-5xl sm:text-6xl font-serif font-bold text-primary tracking-wider drop-shadow-[0_0_30px_hsl(var(--primary))]">
                  RAID COMPLETE
                </h1>
                <p className="text-xl font-serif text-foreground max-w-2xl mx-auto italic bg-card/50 p-6 rounded-xl border border-border">
                  {state.activeRaidId === "hayes"
                    ? "Mr. Hayes is free. The room is yours. The students scatter. Hayes nods once — respect earned."
                    : state.activeRaidId === "cronin"
                    ? "Mr. Cronin adjusts his tie, takes a breath, and writes your name on the board. Not as a detention. As an example."
                    : "The King has fallen. CK3 Barrett's grip on Bryant's room — and this school — is broken. This will be remembered."}
                </p>
              </div>

              {state.pendingDrops.length > 0 && (
                <div className="space-y-3 w-full max-w-sm">
                  <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Raid Loot</h2>
                  {state.pendingDrops.map((drop) => (
                    <div key={drop.instanceId} className="flex items-center gap-3 bg-card/60 border border-border rounded-lg px-4 py-2">
                      <span className="text-2xl">{drop.def.emoji}</span>
                      <span className="font-serif text-foreground">{drop.def.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 w-full max-w-sm">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Enemies Defeated</h2>
                {state.defeatedBosses.map((boss, i) => (
                  <div key={i} className="flex items-center justify-between font-serif text-base border-b border-border/50 pb-2">
                    <span className="text-foreground">{boss}</span>
                    <span className="text-accent text-sm">FREED</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 font-serif bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={game.goToRaidSelect}
                  data-testid="button-back-raid-select"
                >
                  Back to Raids
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-serif border-border hover:bg-card/80"
                  onClick={game.goToTitle}
                >
                  Return to Title
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── GAME OVER ── */}
          {state.phase === "game-over" && (
            <motion.div
              key="game-over"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-10 py-20"
            >
              <h1 className="text-6xl sm:text-8xl font-serif font-bold text-destructive tracking-widest drop-shadow-[0_0_30px_hsl(var(--destructive))]">
                GAME OVER
              </h1>

              <div className="space-y-4 max-w-lg">
                <p className="text-2xl font-serif text-foreground italic">
                  {currentEncounter?.defeatText ?? "Your journey ends here."}
                </p>
                <div className="inline-block mt-4 px-6 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-serif">
                  Fell in {ZONE_NAMES[state.zoneIndex]} to{" "}
                  {state.defeatedByName ?? "an unknown enemy"}
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 font-serif border-destructive/50 hover:bg-destructive hover:text-destructive-foreground text-destructive transition-colors"
                onClick={game.goToTitle}
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drop notification */}
      <AnimatePresence>
        {state.pendingDrops.length > 0 && !state.showOutcome && (
          <DropNotification
            drops={state.pendingDrops}
            onDismiss={game.dismissDrops}
          />
        )}
      </AnimatePresence>

      {/* Backpack button */}
      <BackpackButton
        inventory={state.inventory}
        onClick={() => setShowBackpack(true)}
      />

      {/* Backpack / Inventory panel */}
      <AnimatePresence>
        {showBackpack && (
          <InventoryPanel
            inventory={state.inventory}
            equippedItemId={state.equippedItemId}
            onUse={game.useItem}
            onEquip={game.equipItem}
            onUnequip={game.unequipItem}
            onOpen={(item) => setSpinnerChest(item)}
            canUseItems={state.phase === "encounter" && !state.showOutcome}
            onClose={() => setShowBackpack(false)}
          />
        )}
      </AnimatePresence>

      {/* Chest spinner */}
      <AnimatePresence>
        {spinnerChest && (
          <ChestSpinner
            chest={spinnerChest}
            onClaim={(instanceId, wonItem) => {
              game.openChest(instanceId, wonItem);
              setSpinnerChest(null);
            }}
            onClose={() => setSpinnerChest(null)}
          />
        )}
      </AnimatePresence>

      {/* Achievements floating button */}
      <button
        onClick={() => setShowAchievements((v) => !v)}
        data-testid="button-achievements-toggle"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/60 hover:bg-primary/10 transition-all duration-200 font-serif text-sm text-foreground shadow-lg"
      >
        <span className="text-base">🏆</span>
        <span>Achievements</span>
        {(state.unclaimedAchievements ?? []).length > 0 ? (
          <span className="ml-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {state.unclaimedAchievements.length}
          </span>
        ) : state.achievements.length > 0 ? (
          <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {state.achievements.length}
          </span>
        ) : null}
      </button>

      {/* Achievements panel */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel
            achievements={state.achievements}
            unclaimedAchievements={state.unclaimedAchievements}
            mobsDefeated={state.mobsDefeated}
            onClose={() => setShowAchievements(false)}
            onClaim={game.claimAchievement}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GameContent} />
    </Switch>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
