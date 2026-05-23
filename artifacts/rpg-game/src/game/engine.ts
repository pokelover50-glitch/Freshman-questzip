import { useState, useCallback, useEffect } from "react";
import type { GameState, ChoiceOutcome, CharacterClassDef, GearItemDef, GearItemInstance } from "./types";
import { ZONES, RAID_ENCOUNTERS, ACHIEVEMENT_MOB_IDS, GOLD_REWARDS, XP_REWARDS, xpForLevel } from "./encounters";
import { rollMobDrops, rollBossDrops, rollRaidBossDrops, rollTowerBossDrops, rollDoomscrollerChest, FOOD_ITEMS, CHEST_ITEMS, CHEST_WEAPON_ITEMS, rollChestDrop, ARMOR_ITEMS, GREASE_ITEMS, NG_CHEST_ITEMS, rollNgPlusBossChest, rollNgPlusChestDrop } from "./gear";

import { saveGameToSlot, loadSaveFromSlot, deleteSlotSave, migrateLegacySave, getGlobalDoomscrollerUnlocked, setGlobalDoomscrollerUnlocked, type SaveData, type SaveSlot } from "./saveLoad";

// ── Upgrade cost helpers ─────────────────────────────────────────────────────
export function getUpgradeBaseCost(rarityColor: string | undefined): number {
  switch (rarityColor) {
    case "#4ade80": return 250;   // uncommon (weapons)
    case "#60a5fa": return 500;   // rare (weapons)
    case "#c084fc": return 1000;  // epic (weapons)
    case "#fb923c": return 2500;  // legendary (weapons + Dom's Armor)
    case "#cd7f32": return 100;   // bronze armor
    case "#9ca3af": return 250;   // silver armor
    case "#fbbf24": return 1000;  // gold armor
    case "#e879f9": return 5000;  // NG+ fuchsia
    case "#f472b6": return 5000;  // NG+ pink
    case "#38bdf8": return 8000;  // NG+ sky/divine
    case "#f43f5e": return 15000; // NG+ void/rose
    case "#6366f1": return 10000; // NG+ indigo/67wand
    default: return 50;           // common
  }
}

export function getUpgradeCost(rarityColor: string | undefined, currentUpgradeLevel: number): number {
  return Math.floor(getUpgradeBaseCost(rarityColor) * Math.pow(2.25, currentUpgradeLevel));
}

const CHEST_SELL_PRICES: Record<string, number> = {
  "wooden-chest": 50,
  "bronze-chest": 100,
  "silver-chest": 500,
  "gold-chest": 1750,
  "obsidian-chest": 12250,
};

export function getSellValue(rarityColor: string | undefined, upgradeLevel: number, itemId?: string): number {
  if (itemId && CHEST_SELL_PRICES[itemId] !== undefined) {
    return CHEST_SELL_PRICES[itemId];
  }
  const base = Math.floor(getUpgradeBaseCost(rarityColor) * 0.35);
  let upgradeGold = 0;
  for (let i = 0; i < (upgradeLevel ?? 0); i++) {
    upgradeGold += Math.floor(getUpgradeCost(rarityColor, i) * 0.25);
  }
  return base + upgradeGold;
}

// ── NG+ helpers ──────────────────────────────────────────────────────────────
export function getNgPlusMultiplier(ng: number): number {
  if (ng <= 0) return 1;
  let mult = 1;
  for (let i = 1; i <= ng; i++) {
    if (i <= 3) mult *= 1.3;
    else if (i <= 6) mult *= 1.45;
    else mult *= 2.5;
  }
  return mult;
}

export function getNgPlusGoldReq(currentNg: number): number {
  return Math.round(10000 * Math.pow(2.5, currentNg));
}

export function canEnterNgPlus(state: GameState): boolean {
  const ng = state.ngPlus ?? 0;
  if (ng >= 10) return false;
  return (state.crownTaken ?? false) && (state.corruptedFreshmanDefeated ?? false) && state.gold >= getNgPlusGoldReq(ng);
}

export const SHOP_ITEMS = [
  {
    id: "sandwich",
    name: "Sandwich",
    emoji: "🥪",
    price: 100,
    description: "Restores HP during battle.",
    make: (): GearItemInstance => ({
      instanceId: `shop-sandwich-${Math.random().toString(36).slice(2, 9)}`,
      def: FOOD_ITEMS.find((f) => f.id === "sandwich")!,
    }),
  },
  {
    id: "bronze-chest",
    name: "Bronze Chest",
    emoji: "📦",
    price: 150,
    description: "Contains random gear.",
    make: (): GearItemInstance => ({
      instanceId: `shop-bronze-${Math.random().toString(36).slice(2, 9)}`,
      def: CHEST_ITEMS.find((c) => c.id === "bronze-chest")!,
    }),
  },
  {
    id: "silver-chest",
    name: "Silver Chest",
    emoji: "🎁",
    price: 500,
    description: "Contains rare gear.",
    make: (): GearItemInstance => ({
      instanceId: `shop-silver-${Math.random().toString(36).slice(2, 9)}`,
      def: CHEST_ITEMS.find((c) => c.id === "silver-chest")!,
    }),
  },
];

export const NG_SHOP_ITEMS = [
  {
    id: "gold-chest",
    name: "Gold Chest",
    emoji: "🏆",
    price: 5000,
    description: "NG+ exclusive. Contains Volly's Chestplate, Saber of Iowa, or CMilk Katana.",
    make: (): GearItemInstance => ({
      instanceId: `ng-gold-chest-${Math.random().toString(36).slice(2, 9)}`,
      def: NG_CHEST_ITEMS[0],
    }),
  },
  {
    id: "obsidian-chest",
    name: "Obsidian Chest",
    emoji: "🖤",
    price: 35000,
    description: "NG+ exclusive. Contains Divine Armor, Divine Daggers, Void Rapier, or 67 Wand.",
    make: (): GearItemInstance => ({
      instanceId: `ng-obsidian-chest-${Math.random().toString(36).slice(2, 9)}`,
      def: NG_CHEST_ITEMS[1],
    }),
  },
];

const ACHIEVEMENT_REWARDS: Record<string, () => GearItemInstance> = {
  "defeat-10-mobs": () => ({
    instanceId: `sandwich-claim-${Math.random().toString(36).slice(2, 9)}`,
    def: FOOD_ITEMS.find((f) => f.id === "sandwich")!,
  }),
  "defeat-barrett": () => ({
    instanceId: `bronze-chest-claim-${Math.random().toString(36).slice(2, 9)}`,
    def: CHEST_ITEMS.find((c) => c.id === "bronze-chest")!,
  }),
  "free-hayes": () => ({
    instanceId: `silver-chest-claim-${Math.random().toString(36).slice(2, 9)}`,
    def: CHEST_ITEMS.find((c) => c.id === "silver-chest")!,
  }),
  "free-cronin": () => ({
    instanceId: `silver-chest-cronin-${Math.random().toString(36).slice(2, 9)}`,
    def: CHEST_ITEMS.find((c) => c.id === "silver-chest")!,
  }),
  "free-bryant": () => ({
    instanceId: `silver-chest-bryant-${Math.random().toString(36).slice(2, 9)}`,
    def: CHEST_ITEMS.find((c) => c.id === "silver-chest")!,
  }),
};

function getInitialState(
  preserve?: Pick<GameState, "barrettDefeated" | "crownTaken" | "completedRaids" | "mobsDefeated" | "achievements" | "unclaimedAchievements" | "doomscrollerUnlocked" | "towerCrushed" | "gold" | "level" | "xp" | "ngPlus" | "corruptedFreshmanDefeated">
): GameState {
  return {
    phase: "title",
    selectedClass: null,
    playerHp: 100,
    playerMaxHp: 100,
    enemyHp: 0,
    zoneIndex: 0,
    encounterIndex: 0,
    roundIndex: 0,
    lastOutcome: null,
    showOutcome: false,
    defeatedBosses: [],
    inventory: [],
    pendingDrops: [],
    abilityMessage: null,
    itemActionMessage: null,
    barrettDefeated: preserve?.barrettDefeated ?? false,
    crownTaken: preserve?.crownTaken ?? false,
    completedRaids: preserve?.completedRaids ?? [],
    mobsDefeated: preserve?.mobsDefeated ?? 0,
    achievements: preserve?.achievements ?? [],
    unclaimedAchievements: preserve?.unclaimedAchievements ?? [],
    equippedItemId: null,
    equippedArmorId: null,
    defeatedByName: null,
    activeRaidId: null,
    doomscrollerUnlocked: preserve?.doomscrollerUnlocked ?? getGlobalDoomscrollerUnlocked(),
    towerCrushed: preserve?.towerCrushed ?? false,
    gold: preserve?.gold ?? 0,
    level: preserve?.level ?? 1,
    xp: preserve?.xp ?? 0,
    lastXpEarned: 0,
    micahSmallPotionsBought: 0,
    micahBigPotionsBought: 0,
    micahFireGreaseBought: 0,
    micahLightningGreaseBought: 0,
    micahVisitedRun: false,
    micahVisitedFloors: [],
    activeGreaseId: null,
    greaseChoicesLeft: 0,
    ngPlus: preserve?.ngPlus ?? 0,
    corruptedFreshmanDefeated: preserve?.corruptedFreshmanDefeated ?? false,
  };
}

function applyClassAbility(
  cls: CharacterClassDef,
  baseEnemyDamage: number,
  basePlayerDamage: number,
  baseHeal: number,
  enemyMaxHp: number,
  encounterId: string,
): {
  enemyDamage: number;
  playerDamage: number;
  healAmount: number;
  abilityMessage: string | null;
} {
  let enemyDamage = baseEnemyDamage;
  let playerDamage = basePlayerDamage;
  let healAmount = baseHeal;
  let abilityMessage: string | null = null;

  switch (cls.ability) {
    case "heal-per-choice":
      healAmount += 5;
      abilityMessage = "Freshie resilience: +5 HP restored!";
      break;

    case "double-damage": {
      enemyDamage = Math.round(baseEnemyDamage * 1.5);
      if (baseEnemyDamage > 0) abilityMessage = `Bulking power: damage x1.5 (${enemyDamage})!`;
      if (basePlayerDamage > 0 && Math.random() < 0.10) {
        playerDamage = basePlayerDamage * 2;
        abilityMessage = (abilityMessage ? abilityMessage + " " : "") + "Rookie mistake: you took double damage!";
      }
      break;
    }

    case "negate-damage-chance":
      if (basePlayerDamage > 0 && Math.random() < 0.25) {
        playerDamage = 0;
        abilityMessage = "Unbothered energy: all incoming damage negated!";
      }
      break;

    case "barrett-damage-multiplier":
      if (encounterId === "boss-barrett" && baseEnemyDamage > 0) {
        enemyDamage = Math.round(baseEnemyDamage * 1.75);
        abilityMessage = `Barrett's weakness: damage multiplied x1.75 (${enemyDamage})!`;
      }
      break;

    case "random-insta-kill":
      if (Math.random() < 0.067) {
        enemyDamage = enemyMaxHp + 9999;
        abilityMessage = "67 Freshman energy activated — instant annihilation!";
      }
      break;

    case "doomscroller": {
      enemyDamage = Math.round(baseEnemyDamage * 1.1);
      if (baseEnemyDamage > 0) abilityMessage = `Doomscroller focus: damage x1.1 (${enemyDamage})!`;
      break;
    }

  }

  return { enemyDamage, playerDamage, healAmount, abilityMessage };
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>(getInitialState());
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<SaveSlot>(1);

  // Migrate any legacy single-save data to slot 1 on first load
  useEffect(() => {
    migrateLegacySave();
  }, []);

  // Normalize any fields that may be missing from stale/pre-migration state
  useEffect(() => {
    setState((s) => ({
      ...s,
      unclaimedAchievements: s.unclaimedAchievements ?? [],
      achievements: s.achievements ?? [],
      inventory: s.inventory ?? [],
      pendingDrops: s.pendingDrops ?? [],
      defeatedBosses: s.defeatedBosses ?? [],
      completedRaids: s.completedRaids ?? [],
      equippedItemId: s.equippedItemId ?? null,
      defeatedByName: s.defeatedByName ?? null,
      activeRaidId: s.activeRaidId ?? null,
      doomscrollerUnlocked: s.doomscrollerUnlocked || getGlobalDoomscrollerUnlocked(),
      crownTaken: s.crownTaken ?? false,
      towerCrushed: s.towerCrushed ?? false,
      gold: s.gold ?? 0,
      level: s.level ?? 1,
      xp: s.xp ?? 0,
      lastXpEarned: s.lastXpEarned ?? 0,
      micahSmallPotionsBought: s.micahSmallPotionsBought ?? 0,
      micahBigPotionsBought: s.micahBigPotionsBought ?? 0,
      micahFireGreaseBought: s.micahFireGreaseBought ?? 0,
      micahLightningGreaseBought: s.micahLightningGreaseBought ?? 0,
      micahVisitedRun: s.micahVisitedRun ?? false,
      micahVisitedFloors: s.micahVisitedFloors ?? [],
      activeGreaseId: s.activeGreaseId ?? null,
      greaseChoicesLeft: s.greaseChoicesLeft ?? 0,
      ngPlus: s.ngPlus ?? 0,
      corruptedFreshmanDefeated: s.corruptedFreshmanDefeated ?? false,
    }));
  }, []);

  // Auto-save when a fresh encounter begins or on victory/raid-complete
  useEffect(() => {
    if (state.phase === "encounter" && !state.showOutcome) {
      const clean: GameState = { ...state, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
      saveGameToSlot(activeSlot, clean);
      setLastSavedAt(Date.now());
    } else if (state.phase === "victory" || state.phase === "raid-complete") {
      const clean: GameState = { ...state, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
      saveGameToSlot(activeSlot, clean);
      setLastSavedAt(Date.now());
    } else if (state.phase === "game-over" && state.activeRaidId) {
      // Died in a raid — save with raid cleared so they restart from encounter 1
      const clean: GameState = { ...state, activeRaidId: null, encounterIndex: 0, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
      saveGameToSlot(activeSlot, clean);
      setLastSavedAt(Date.now());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.zoneIndex, state.encounterIndex, state.phase, activeSlot]);

  const loadSavedGame = useCallback((slot: SaveSlot): SaveData | null => {
    const saveData = loadSaveFromSlot(slot);
    if (!saveData) return null;
    let loadedState: GameState = {
      ...saveData.state,
      unclaimedAchievements: saveData.state.unclaimedAchievements ?? [],
      achievements: saveData.state.achievements ?? [],
      completedRaids: saveData.state.completedRaids ?? [],
      inventory: saveData.state.inventory ?? [],
      pendingDrops: saveData.state.pendingDrops ?? [],
      defeatedBosses: saveData.state.defeatedBosses ?? [],
      equippedItemId: saveData.state.equippedItemId ?? null,
      equippedArmorId: saveData.state.equippedArmorId ?? null,
      defeatedByName: saveData.state.defeatedByName ?? null,
      activeRaidId: saveData.state.activeRaidId ?? null,
      doomscrollerUnlocked: saveData.state.doomscrollerUnlocked || getGlobalDoomscrollerUnlocked(),
      crownTaken: saveData.state.crownTaken ?? false,
      towerCrushed: saveData.state.towerCrushed ?? false,
      gold: saveData.state.gold ?? 0,
      level: saveData.state.level ?? 1,
      xp: saveData.state.xp ?? 0,
      lastXpEarned: 0,
      micahSmallPotionsBought: saveData.state.micahSmallPotionsBought ?? 0,
      micahBigPotionsBought: saveData.state.micahBigPotionsBought ?? 0,
      micahFireGreaseBought: saveData.state.micahFireGreaseBought ?? 0,
      micahLightningGreaseBought: saveData.state.micahLightningGreaseBought ?? 0,
      micahVisitedRun: saveData.state.micahVisitedRun ?? false,
      micahVisitedFloors: saveData.state.micahVisitedFloors ?? [],
      activeGreaseId: saveData.state.activeGreaseId ?? null,
      greaseChoicesLeft: saveData.state.greaseChoicesLeft ?? 0,
      ngPlus: saveData.state.ngPlus ?? 0,
      corruptedFreshmanDefeated: saveData.state.corruptedFreshmanDefeated ?? false,
    };
    if (getGlobalDoomscrollerUnlocked() && !loadedState.achievements.includes("matteo-phone") && !loadedState.unclaimedAchievements.includes("matteo-phone")) {
      loadedState = { ...loadedState, achievements: [...loadedState.achievements, "matteo-phone"] };
    }
    if (loadedState.phase === "victory" || loadedState.phase === "title" || loadedState.phase === "game-over" || loadedState.phase === "raid-complete" || loadedState.phase === "ck3-cutscene") {
      loadedState = { ...loadedState, phase: "main-menu" };
    }
    setActiveSlot(slot);
    setState(loadedState);
    return saveData;
  }, []);

  const startNewGame = useCallback((slot: SaveSlot) => {
    deleteSlotSave(slot);
    setActiveSlot(slot);
    setState({ ...getInitialState(), phase: "main-menu" });
  }, []);

  const clearSave = useCallback(() => {
    deleteSlotSave(activeSlot);
  }, [activeSlot]);

  const dismissCK3Cutscene = useCallback(() => {
    setState((s) => {
      const raidEncs = RAID_ENCOUNTERS[s.activeRaidId ?? ""] ?? null;
      if (!raidEncs) return s;
      const barrettIdx = raidEncs.findIndex((e) => e.id === "raid-boss-ck3-barrett");
      const barrett = raidEncs[barrettIdx];
      return {
        ...s,
        phase: "encounter",
        encounterIndex: barrettIdx,
        roundIndex: 0,
        enemyHp: barrett.enemyMaxHp,
        showOutcome: false,
        lastOutcome: null,
        abilityMessage: null,
        pendingDrops: [],
      };
    });
  }, []);

  const currentEncounter =
    state.phase === "encounter"
      ? (state.activeRaidId
          ? RAID_ENCOUNTERS[state.activeRaidId]?.[state.encounterIndex] ?? null
          : ZONES[state.zoneIndex]?.[state.encounterIndex] ?? null)
      : null;

  const currentRound =
    currentEncounter?.rounds[state.roundIndex] ?? null;

  const goToTitle = useCallback(() => {
    const clean: GameState = { ...state, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
    saveGameToSlot(activeSlot, clean);
    setLastSavedAt(Date.now());
    setState(getInitialState({
      barrettDefeated: state.barrettDefeated,
      crownTaken: state.crownTaken,
      completedRaids: state.completedRaids,
      mobsDefeated: state.mobsDefeated,
      achievements: state.achievements,
      unclaimedAchievements: state.unclaimedAchievements,
      doomscrollerUnlocked: state.doomscrollerUnlocked,
      towerCrushed: state.towerCrushed,
      gold: state.gold,
      level: state.level,
      xp: state.xp,
      ngPlus: state.ngPlus ?? 0,
      corruptedFreshmanDefeated: state.corruptedFreshmanDefeated ?? false,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, activeSlot]);

  const goToMainMenu = useCallback(() => {
    setState((s) => ({ ...s, phase: "main-menu", activeRaidId: null }));
  }, []);

  const goToRaidSelect = useCallback(() => {
    setState((s) => ({ ...s, phase: "raid-select", activeRaidId: null }));
  }, []);

  const goToCharacterSelect = useCallback(() => {
    setState((s) => ({ ...s, phase: "character-select" }));
  }, []);

  const beginRaid = useCallback((raidId: string) => {
    setState((s) => ({
      ...s,
      activeRaidId: raidId,
      phase: s.selectedClass ? "intro" : "character-select",
    }));
  }, []);

  const selectCharacter = useCallback((cls: CharacterClassDef) => {
    setState((s) => ({
      ...s,
      selectedClass: cls,
      playerHp: cls.maxHp,
      playerMaxHp: cls.maxHp,
      phase: "intro",
    }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => {
      const firstEncounter = ZONES[0][0];
      const ngMult = getNgPlusMultiplier(s.ngPlus ?? 0);
      return {
        ...s,
        phase: "encounter",
        zoneIndex: 0,
        encounterIndex: 0,
        roundIndex: 0,
        enemyHp: Math.round(firstEncounter.enemyMaxHp * ngMult),
        lastOutcome: null,
        showOutcome: false,
        pendingDrops: [],
        defeatedBosses: [],
        abilityMessage: null,
        itemActionMessage: null,
        activeRaidId: null,
      };
    });
  }, []);

  const startRaid = useCallback(() => {
    setState((s) => {
      if (!s.activeRaidId) return s;
      const encounters = RAID_ENCOUNTERS[s.activeRaidId];
      if (!encounters || encounters.length === 0) return s;
      const ngMult = getNgPlusMultiplier(s.ngPlus ?? 0);
      return {
        ...s,
        phase: "encounter",
        encounterIndex: 0,
        roundIndex: 0,
        playerHp: s.playerMaxHp,
        enemyHp: Math.round(encounters[0].enemyMaxHp * ngMult),
        lastOutcome: null,
        showOutcome: false,
        pendingDrops: [],
        defeatedBosses: [],
        abilityMessage: null,
        itemActionMessage: null,
        micahSmallPotionsBought: 0,
        micahBigPotionsBought: 0,
        micahFireGreaseBought: 0,
        micahLightningGreaseBought: 0,
        micahVisitedRun: false,
        micahVisitedFloors: [],
      };
    });
  }, []);

  const chooseAnswer = useCallback((choice: ChoiceOutcome) => {
    setState((s) => {
      if (!currentEncounter || !s.selectedClass) return s;

      // Scale player's attack damage by zone (1.1x per zone, base at zone 0) — raids use zone 0 scale
      const zoneMultiplier = s.activeRaidId ? 1 : Math.pow(1.1, s.zoneIndex);
      const ngMult = getNgPlusMultiplier(s.ngPlus ?? 0);
      // NG+ scales enemy damage (player takes more)
      const scaledEnemyDamage = Math.round(choice.enemyDamage * zoneMultiplier * ngMult);

      let { enemyDamage, playerDamage: rawPlayerDamage, healAmount, abilityMessage } =
        applyClassAbility(
          s.selectedClass,
          scaledEnemyDamage,
          choice.playerDamage,
          choice.healAmount,
          currentEncounter.enemyMaxHp,
          currentEncounter.id,
        );

      // ── 67 Wand: boost one-shot from 6.7% → 41% when equipped ─────────────
      if (s.selectedClass.ability === "random-insta-kill" && s.equippedItemId === "wand-67") {
        const alreadyOneShot = enemyDamage > currentEncounter.enemyMaxHp;
        if (!alreadyOneShot && Math.random() < 0.367) {
          enemyDamage = currentEncounter.enemyMaxHp + 9999;
          abilityMessage = "67 Wand × 67 Freshman — total annihilation!";
        }
      }

      // ── Lightning grease: stun — negate all incoming player damage ─────────
      const lightningActive = s.activeGreaseId === "lightning-grease" && s.greaseChoicesLeft > 0;
      let playerDamage = lightningActive ? 0 : rawPlayerDamage;

      // ── Add equipped weapon bonus — not multiplied by class abilities ───────
      const equippedWeapon = CHEST_WEAPON_ITEMS.find((w) => w.id === s.equippedItemId);
      const equippedWeaponInstance = s.inventory.find((i) => i.def.id === s.equippedItemId && i.def.isWeapon);
      const weaponUpgradeLevel = equippedWeaponInstance?.upgradeLevel ?? 0;
      let weaponBonus = 0;
      if (equippedWeapon) {
        weaponBonus = equippedWeapon.scalesWithZone
          ? Math.round(equippedWeapon.damage * zoneMultiplier)
          : equippedWeapon.damage;
        if (equippedWeapon.barrettMultiplier && currentEncounter.id === "boss-barrett") {
          weaponBonus *= equippedWeapon.barrettMultiplier;
        }
        if (weaponUpgradeLevel > 0) {
          weaponBonus = Math.floor(weaponBonus * Math.pow(1.2, weaponUpgradeLevel));
        }
      }

      // ── Fire grease: +15% weapon damage ───────────────────────────────────
      const fireActive = s.activeGreaseId === "fire-grease" && s.greaseChoicesLeft > 0;
      if (fireActive && weaponBonus > 0) {
        weaponBonus = Math.round(weaponBonus * 1.15);
      }

      const totalEnemyDamage = enemyDamage + weaponBonus;

      // ── Tick down active grease ────────────────────────────────────────────
      const newGreaseChoicesLeft = s.greaseChoicesLeft > 0 ? s.greaseChoicesLeft - 1 : 0;
      const newActiveGreaseId = newGreaseChoicesLeft > 0 ? s.activeGreaseId : null;

      const newPlayerHpRaw = Math.max(0, s.playerHp - playerDamage + healAmount);
      const newPlayerHp = Math.min(newPlayerHpRaw, s.playerMaxHp);
      const newEnemyHp = Math.max(0, s.enemyHp - totalEnemyDamage);

      let greaseMsgSuffix = "";
      if (lightningActive) greaseMsgSuffix = " ⚡ Lightning Grease: stunned — no damage taken!";
      else if (fireActive) greaseMsgSuffix = ` 🔥 Fire Grease: +15% weapon bonus (${newGreaseChoicesLeft} left)!`;

      const modifiedOutcome: ChoiceOutcome = {
        ...choice,
        playerDamage,
        enemyDamage: Math.min(totalEnemyDamage, s.enemyHp),
        healAmount,
        narrative: choice.narrative + (greaseMsgSuffix ? " " + greaseMsgSuffix : ""),
      };

      return {
        ...s,
        playerHp: newPlayerHp,
        enemyHp: newEnemyHp,
        lastOutcome: modifiedOutcome,
        showOutcome: true,
        abilityMessage,
        itemActionMessage: null,
        activeGreaseId: newActiveGreaseId,
        greaseChoicesLeft: newGreaseChoicesLeft,
      };
    });
  }, [currentEncounter]);

  const useItem = useCallback((instanceId: string) => {
    setState((s) => {
      if (!currentEncounter) return s;

      const itemIdx = s.inventory.findIndex((i) => i.instanceId === instanceId);
      if (itemIdx === -1) return s;

      const item = s.inventory[itemIdx];
      const def = item.def;

      const isBarrett = currentEncounter.id === "boss-barrett";
      const isBoss = currentEncounter.isBoss;

      let canUse = false;
      switch (def.target) {
        case "any":
          canUse = true;
          break;
        case "mob-only":
          canUse = !isBoss;
          break;
        case "non-barrett":
          canUse = !isBarrett;
          break;
        case "barrett-only":
          canUse = isBarrett;
          break;
      }

      if (!canUse) {
        let reason = "";
        if (def.target === "mob-only") reason = `${def.name} cannot be used on bosses!`;
        else if (def.target === "non-barrett") reason = `${def.name} has no effect on Barrett Luke Hutchins!`;
        else if (def.target === "barrett-only") reason = `${def.name} can only be used on Barrett Luke Hutchins!`;
        return { ...s, itemActionMessage: reason };
      }

      const newInventory = [...s.inventory];
      newInventory.splice(itemIdx, 1);

      if (def.healAmount && def.healAmount > 0) {
        const healGiven = Math.min(def.healAmount, s.playerMaxHp - s.playerHp);
        const newPlayerHp = Math.min(s.playerHp + def.healAmount, s.playerMaxHp);
        const fakeOutcome: ChoiceOutcome = {
          text: `Used ${def.name}`,
          playerDamage: 0,
          enemyDamage: 0,
          healAmount: healGiven,
          narrative: `You ate the ${def.name} and restored ${healGiven} HP!`,
        };
        return {
          ...s,
          playerHp: newPlayerHp,
          inventory: newInventory,
          lastOutcome: fakeOutcome,
          showOutcome: true,
          abilityMessage: null,
        };
      }

      if (def.damage > 0) {
        const dmgDealt = Math.min(def.damage, s.enemyHp);
        const newEnemyHp = Math.max(0, s.enemyHp - def.damage);
        const fakeOutcome: ChoiceOutcome = {
          text: `Used ${def.name}`,
          playerDamage: 0,
          enemyDamage: dmgDealt,
          healAmount: 0,
          narrative: `You threw the ${def.name} at the enemy, dealing ${dmgDealt} damage!`,
        };
        return {
          ...s,
          enemyHp: newEnemyHp,
          inventory: newInventory,
          lastOutcome: fakeOutcome,
          showOutcome: true,
          abilityMessage: null,
        };
      }

      return { ...s, inventory: newInventory, itemActionMessage: `Used ${def.name}.` };
    });
  }, [currentEncounter]);

  const continueAfterOutcome = useCallback(() => {
    setState((s) => {
      if (!currentEncounter) return s;

      const playerDied = s.playerHp <= 0;
      const enemyDied = s.enemyHp <= 0;
      const isRaid = !!s.activeRaidId;
      const raidEncounters = isRaid ? RAID_ENCOUNTERS[s.activeRaidId!] : null;

      if (playerDied) {
        const ngLabel = (s.ngPlus ?? 0) > 0 ? `NG+${s.ngPlus} ` : "";
        return { ...s, phase: "game-over", showOutcome: false, pendingDrops: [], defeatedByName: `${ngLabel}${currentEncounter.enemyName}` };
      }

      if (enemyDied) {
        // Calculate drops
        let rawDrops: GearItemInstance[];
        if (currentEncounter.isBoss) {
          if (s.activeRaidId === "tower") {
            rawDrops = rollTowerBossDrops();
          } else {
            rawDrops = isRaid ? rollRaidBossDrops() : rollBossDrops();
          }
        } else {
          rawDrops = rollMobDrops(currentEncounter.id, isRaid);
        }

        // Doomscroller 15% chest bonus on any kill
        if (s.selectedClass?.ability === "doomscroller" && Math.random() < 0.15) {
          rawDrops = [...rawDrops, rollDoomscrollerChest()];
        }

        // NG+1+: boss kills drop an extra NG+ chest (95% gold / 5% obsidian)
        if ((s.ngPlus ?? 0) >= 1 && currentEncounter.isBoss) {
          rawDrops = [...rawDrops, rollNgPlusBossChest()];
        }

        // Track Corrupted Freshman defeat for NG+ unlock condition
        const isCorruptedFreshman = currentEncounter.id === "tower-boss-corrupted-freshman";

        const existingNonStackableIds = new Set(
          s.inventory.filter((i) => !i.def.stackable).map((i) => i.def.id)
        );
        const drops = rawDrops.filter(
          (d) => d.def.stackable || !existingNonStackableIds.has(d.def.id)
        );

        // Achievement tracking
        let newUnclaimedAchievements = [...s.unclaimedAchievements];

        // free-hayes achievement
        if (currentEncounter.id === "raid-boss-hayes") {
          const alreadyEarned = s.achievements.includes("free-hayes") || s.unclaimedAchievements.includes("free-hayes");
          if (!alreadyEarned) newUnclaimedAchievements = [...newUnclaimedAchievements, "free-hayes"];
        }

        // free-cronin achievement
        if (currentEncounter.id === "raid-boss-cronin") {
          const alreadyEarned = s.achievements.includes("free-cronin") || s.unclaimedAchievements.includes("free-cronin");
          if (!alreadyEarned) newUnclaimedAchievements = [...newUnclaimedAchievements, "free-cronin"];
        }

        // free-bryant achievement — unlocked only when CK3 Barrett is fully defeated
        if (currentEncounter.id === "raid-boss-ck3-barrett") {
          const alreadyEarned = s.achievements.includes("free-bryant") || s.unclaimedAchievements.includes("free-bryant");
          if (!alreadyEarned) newUnclaimedAchievements = [...newUnclaimedAchievements, "free-bryant"];
        }

        // matteo-phone secret achievement
        if (currentEncounter.id === "raid-mob-matteo" && s.equippedItemId === "matteos-phone") {
          const alreadyEarned = s.achievements.includes("matteo-phone") || s.unclaimedAchievements.includes("matteo-phone");
          if (!alreadyEarned) newUnclaimedAchievements = [...newUnclaimedAchievements, "matteo-phone"];
        }

        const isMobKill = !currentEncounter.isBoss && ACHIEVEMENT_MOB_IDS.has(currentEncounter.id);
        const newMobsDefeated = isMobKill ? s.mobsDefeated + 1 : s.mobsDefeated;
        const alreadyEarned10Mobs = s.achievements.includes("defeat-10-mobs") || s.unclaimedAchievements.includes("defeat-10-mobs");
        if (!alreadyEarned10Mobs && newMobsDefeated >= 10) {
          newUnclaimedAchievements = [...newUnclaimedAchievements, "defeat-10-mobs"];
        }

        const newDefeatedBosses = currentEncounter.isBoss
          ? [...s.defeatedBosses, currentEncounter.enemyName]
          : s.defeatedBosses;

        const newInventory = [...s.inventory, ...drops];

        // ── Gold reward ──────────────────────────────────────────────────────
        const rawId = currentEncounter.id;
        let goldEarned = 0;
        if (rawId.startsWith("tower-") && !currentEncounter.isBoss) {
          const baseId = rawId.slice(6);
          goldEarned = (GOLD_REWARDS[baseId] ?? 0) * 3;
        } else {
          goldEarned = GOLD_REWARDS[rawId] ?? 0;
        }
        const newGold = s.gold + goldEarned;

        // ── XP reward ────────────────────────────────────────────────────────
        // Level-based difficulty scaling for XP earned:
        // Levels 1-40: easy (2.0-1.0x), 40-50: harder (1.0-0.65x),
        // 50-70: hard (0.65-0.4x), 70+: super hard (0.4x)
        const lvl = s.level;
        let levelDiffMult: number;
        if (lvl <= 40) {
          levelDiffMult = 2.0 - 1.0 * ((lvl - 1) / 39);
        } else if (lvl <= 50) {
          levelDiffMult = 1.0 - 0.35 * ((lvl - 40) / 10);
        } else if (lvl <= 70) {
          levelDiffMult = 0.65 - 0.25 * ((lvl - 50) / 20);
        } else {
          levelDiffMult = 0.4;
        }

        let xpEarned = 0;
        if (rawId.startsWith("tower-") && !currentEncounter.isBoss) {
          const baseId = rawId.slice(6);
          xpEarned = Math.round((XP_REWARDS[baseId] ?? 0) * 3 * levelDiffMult);
        } else {
          xpEarned = Math.round((XP_REWARDS[rawId] ?? 0) * levelDiffMult);
        }
        let newLevel = s.level;
        let newXp = s.xp + xpEarned;
        while (newXp >= xpForLevel(newLevel)) {
          newXp -= xpForLevel(newLevel);
          newLevel++;
        }

        // ── RAID path ───────────────────────────────────────────────────────
        if (isRaid && raidEncounters) {
          const isLastInRaid = s.encounterIndex >= raidEncounters.length - 1;

          // Tower floor complete: offer exit after floors 1-4 (indices 9,19,29,39)
          if (s.activeRaidId === "tower" && currentEncounter.isBoss && !isLastInRaid && s.encounterIndex % 10 === 9) {
            return {
              ...s,
              phase: "tower-floor-complete",
              showOutcome: false,
              inventory: newInventory,
              pendingDrops: drops,
              defeatedBosses: newDefeatedBosses,
              mobsDefeated: newMobsDefeated,
              unclaimedAchievements: newUnclaimedAchievements,
              gold: newGold,
              level: newLevel,
              xp: newXp,
              lastXpEarned: xpEarned,
            };
          }

          if (isLastInRaid) {
            const isCK3Barrett = s.activeRaidId === "bryant";
            const isTower = s.activeRaidId === "tower";
            return {
              ...s,
              phase: "raid-complete",
              showOutcome: false,
              inventory: newInventory,
              pendingDrops: drops,
              defeatedBosses: newDefeatedBosses,
              completedRaids: [...s.completedRaids, s.activeRaidId!],
              mobsDefeated: newMobsDefeated,
              unclaimedAchievements: newUnclaimedAchievements,
              crownTaken: isCK3Barrett ? true : s.crownTaken,
              towerCrushed: isTower ? true : s.towerCrushed,
              corruptedFreshmanDefeated: isCorruptedFreshman ? true : s.corruptedFreshmanDefeated,
              gold: newGold,
              level: newLevel,
              xp: newXp,
              lastXpEarned: xpEarned,
            };
          }

          const newEncounterIndex = s.encounterIndex + 1;
          const newEncounter = raidEncounters[newEncounterIndex];

          // ── Micah vendor trigger ─────────────────────────────────────────
          let showVendor = false;
          let newMicahVisitedRun = s.micahVisitedRun;
          let newMicahVisitedFloors = s.micahVisitedFloors;
          if (!currentEncounter.isBoss) {
            if (s.activeRaidId === "tower") {
              const currentFloor = Math.floor(s.encounterIndex / 10);
              const positionInFloor = s.encounterIndex % 10;
              // 9 non-boss mobs per floor (positions 0–8); probability rises so last mob is 100%
              const remainingMobs = 9 - positionInFloor;
              const triggerChance = 1 / remainingMobs;
              if (!s.micahVisitedFloors.includes(currentFloor) && Math.random() < triggerChance) {
                showVendor = true;
                newMicahVisitedFloors = [...s.micahVisitedFloors, currentFloor];
              }
            } else if (!s.micahVisitedRun && Math.random() < 0.35) {
              showVendor = true;
              newMicahVisitedRun = true;
            }
          }

          const ngMultR = getNgPlusMultiplier(s.ngPlus ?? 0);
          return {
            ...s,
            phase: showVendor ? "vendor" : "encounter",
            encounterIndex: newEncounterIndex,
            roundIndex: 0,
            enemyHp: Math.round(newEncounter.enemyMaxHp * ngMultR),
            showOutcome: false,
            lastOutcome: null,
            inventory: newInventory,
            pendingDrops: drops,
            abilityMessage: null,
            defeatedBosses: newDefeatedBosses,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: newUnclaimedAchievements,
            corruptedFreshmanDefeated: isCorruptedFreshman ? true : s.corruptedFreshmanDefeated,
            gold: newGold,
            level: newLevel,
            xp: newXp,
            lastXpEarned: xpEarned,
            micahVisitedRun: newMicahVisitedRun,
            micahVisitedFloors: newMicahVisitedFloors,
          };
        }

        // ── Normal campaign path ─────────────────────────────────────────────
        const isLastInZone = s.encounterIndex >= ZONES[s.zoneIndex].length - 1;
        const isLastZone = s.zoneIndex >= ZONES.length - 1;

        if (isLastZone && isLastInZone) {
          const alreadyEarnedBarrett =
            s.achievements.includes("defeat-barrett") ||
            s.unclaimedAchievements.includes("defeat-barrett");
          const finalUnclaimedAchievements = alreadyEarnedBarrett
            ? newUnclaimedAchievements
            : [...newUnclaimedAchievements, "defeat-barrett"];
          return {
            ...s,
            phase: "victory",
            showOutcome: false,
            inventory: newInventory,
            pendingDrops: drops,
            defeatedBosses: newDefeatedBosses,
            barrettDefeated: true,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: finalUnclaimedAchievements,
            gold: newGold,
            level: newLevel,
            xp: newXp,
            lastXpEarned: xpEarned,
          };
        }

        if (isLastInZone) {
          const newZoneIndex = s.zoneIndex + 1;
          const newEncounter = ZONES[newZoneIndex][0];
          const ngMultC = getNgPlusMultiplier(s.ngPlus ?? 0);
          return {
            ...s,
            phase: "encounter",
            zoneIndex: newZoneIndex,
            encounterIndex: 0,
            roundIndex: 0,
            enemyHp: Math.round(newEncounter.enemyMaxHp * ngMultC),
            defeatedBosses: newDefeatedBosses,
            showOutcome: false,
            lastOutcome: null,
            inventory: newInventory,
            pendingDrops: drops,
            abilityMessage: null,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: newUnclaimedAchievements,
            gold: newGold,
            level: newLevel,
            xp: newXp,
            lastXpEarned: xpEarned,
          };
        }

        const newEncounterIndex = s.encounterIndex + 1;
        const newEncounter = ZONES[s.zoneIndex][newEncounterIndex];
        const ngMultN = getNgPlusMultiplier(s.ngPlus ?? 0);
        return {
          ...s,
          phase: "encounter",
          encounterIndex: newEncounterIndex,
          roundIndex: 0,
          enemyHp: Math.round(newEncounter.enemyMaxHp * ngMultN),
          showOutcome: false,
          lastOutcome: null,
          inventory: newInventory,
          pendingDrops: drops,
          abilityMessage: null,
          mobsDefeated: newMobsDefeated,
          unclaimedAchievements: newUnclaimedAchievements,
          gold: newGold,
          level: newLevel,
          xp: newXp,
          lastXpEarned: xpEarned,
        };
      }

      // ── Bryant → CK3 Barrett mid-fight: show cutscene first when Bryant hits ≤50% HP ──
      if (
        s.activeRaidId === "bryant" &&
        currentEncounter.id === "raid-boss-bryant" &&
        s.enemyHp <= currentEncounter.enemyMaxHp / 2 &&
        raidEncounters
      ) {
        return {
          ...s,
          phase: "ck3-cutscene",
          showOutcome: false,
          lastOutcome: null,
          abilityMessage: null,
          pendingDrops: [],
        };
      }

      const isLastRound = s.roundIndex >= currentEncounter.rounds.length - 1;
      if (isLastRound) {
        return {
          ...s,
          roundIndex: 0,
          showOutcome: false,
          lastOutcome: null,
          pendingDrops: [],
          abilityMessage: null,
        };
      }

      return {
        ...s,
        roundIndex: s.roundIndex + 1,
        showOutcome: false,
        lastOutcome: null,
        pendingDrops: [],
        abilityMessage: null,
      };
    });
  }, [currentEncounter]);

  const dismissDrops = useCallback(() => {
    setState((s) => ({ ...s, pendingDrops: [] }));
  }, []);

  const dismissItemMessage = useCallback(() => {
    setState((s) => ({ ...s, itemActionMessage: null }));
  }, []);

  const openChest = useCallback((instanceId: string, wonItemDef: GearItemDef) => {
    setState((s) => {
      const chestIdx = s.inventory.findIndex((i) => i.instanceId === instanceId);
      if (chestIdx === -1) return s;

      const alreadyHas = s.inventory.some((i) => i.def.id === wonItemDef.id && (i.def.isWeapon || i.def.isArmor));
      const newItem: GearItemInstance = {
        instanceId: `${wonItemDef.id}-${Math.random().toString(36).slice(2, 9)}`,
        def: wonItemDef,
      };
      const withoutChest = s.inventory.filter((_, i) => i !== chestIdx);
      return {
        ...s,
        inventory: alreadyHas ? withoutChest : [...withoutChest, newItem],
        itemActionMessage: alreadyHas
          ? `You already own ${wonItemDef.name} — chest consumed.`
          : null,
      };
    });
  }, []);

  const equipItem = useCallback((itemId: string) => {
    setState((s) => ({ ...s, equippedItemId: itemId }));
  }, []);

  const unequipItem = useCallback(() => {
    setState((s) => ({ ...s, equippedItemId: null }));
  }, []);

  const equipArmor = useCallback((itemId: string) => {
    setState((s) => {
      // Look up armor from inventory (supports NG+ armors not in ARMOR_ITEMS base list)
      const armorInst = s.inventory.find((i) => i.def.id === itemId && i.def.isArmor);
      const armorItem = armorInst?.def;
      if (!armorItem || !armorItem.hpBonus) return s;
      let newMaxHp = s.playerMaxHp;
      let newHp = s.playerHp;
      if (s.equippedArmorId) {
        const oldArmorInst = s.inventory.find((i) => i.def.id === s.equippedArmorId && i.def.isArmor);
        const oldArmor = oldArmorInst?.def ?? ARMOR_ITEMS.find((a) => a.id === s.equippedArmorId);
        if (oldArmor?.hpBonus) {
          newMaxHp -= oldArmor.hpBonus;
          newHp = Math.min(newHp, newMaxHp);
        }
      }
      newMaxHp += armorItem.hpBonus;
      newHp += armorItem.hpBonus;
      return { ...s, equippedArmorId: itemId, playerMaxHp: newMaxHp, playerHp: newHp };
    });
  }, []);

  const unequipArmor = useCallback(() => {
    setState((s) => {
      if (!s.equippedArmorId) return s;
      const armorInst = s.inventory.find((i) => i.def.id === s.equippedArmorId && i.def.isArmor);
      const armorItem = armorInst?.def ?? ARMOR_ITEMS.find((a) => a.id === s.equippedArmorId);
      if (!armorItem?.hpBonus) return { ...s, equippedArmorId: null };
      const newMaxHp = s.playerMaxHp - armorItem.hpBonus;
      const newHp = Math.min(s.playerHp, newMaxHp);
      return { ...s, equippedArmorId: null, playerMaxHp: newMaxHp, playerHp: newHp };
    });
  }, []);

  const claimAchievement = useCallback((id: string) => {
    setState((s) => {
      if (!s.unclaimedAchievements.includes(id)) return s;
      const newBase = {
        ...s,
        achievements: [...s.achievements, id],
        unclaimedAchievements: s.unclaimedAchievements.filter((a) => a !== id),
      };
      // matteo-phone unlocks the Doomscroller class globally across all slots (no item reward)
      if (id === "matteo-phone") {
        setGlobalDoomscrollerUnlocked();
        return { ...newBase, doomscrollerUnlocked: true };
      }
      const rewardFn = ACHIEVEMENT_REWARDS[id];
      if (rewardFn) {
        const rewardItem = rewardFn();
        return { ...newBase, inventory: [...s.inventory, rewardItem] };
      }
      return newBase;
    });
  }, []);

  const goToShop = useCallback(() => {
    setState((s) => ({ ...s, phase: "shop" }));
  }, []);

  const continueTowerFloor = useCallback(() => {
    setState((s) => {
      const raidEncounters = RAID_ENCOUNTERS["tower"];
      if (!raidEncounters) return s;
      const newEncounterIndex = s.encounterIndex + 1;
      const newEncounter = raidEncounters[newEncounterIndex];
      if (!newEncounter) return s;
      const ngMult = getNgPlusMultiplier(s.ngPlus ?? 0);
      return {
        ...s,
        phase: "encounter",
        encounterIndex: newEncounterIndex,
        roundIndex: 0,
        enemyHp: Math.round(newEncounter.enemyMaxHp * ngMult),
        showOutcome: false,
        lastOutcome: null,
        pendingDrops: [],
        abilityMessage: null,
        micahVisitedFloors: s.micahVisitedFloors,
      };
    });
  }, []);

  const enterNewGamePlus = useCallback(() => {
    setState((s) => {
      if (!canEnterNgPlus(s)) return s;
      const ng = s.ngPlus ?? 0;
      const cost = getNgPlusGoldReq(ng);
      const newState: GameState = {
        ...getInitialState({
          barrettDefeated: s.barrettDefeated,
          crownTaken: s.crownTaken,
          completedRaids: s.completedRaids,
          mobsDefeated: s.mobsDefeated,
          achievements: s.achievements,
          unclaimedAchievements: s.unclaimedAchievements,
          doomscrollerUnlocked: s.doomscrollerUnlocked,
          towerCrushed: s.towerCrushed,
          gold: s.gold - cost,
          level: s.level,
          xp: s.xp,
          ngPlus: ng + 1,
          corruptedFreshmanDefeated: false,
        }),
        phase: "main-menu",
        // Preserve class and inventory across NG+
        selectedClass: s.selectedClass,
        inventory: s.inventory,
        equippedItemId: s.equippedItemId,
        equippedArmorId: s.equippedArmorId,
        playerHp: s.selectedClass?.maxHp ?? 100,
        playerMaxHp: s.selectedClass?.maxHp ?? 100,
      };
      // Persist immediately so the slot reflects the NG+ state right away
      saveGameToSlot(activeSlot, newState);
      return newState;
    });
  }, [activeSlot]);

  const buyShopItem = useCallback((itemId: string) => {
    setState((s) => {
      const shopItem = SHOP_ITEMS.find((i) => i.id === itemId) ?? NG_SHOP_ITEMS.find((i) => i.id === itemId);
      if (!shopItem || s.gold < shopItem.price) return s;
      const newItem = shopItem.make();
      return {
        ...s,
        gold: s.gold - shopItem.price,
        inventory: [...s.inventory, newItem],
      };
    });
  }, []);

  const leaveVendor = useCallback(() => {
    setState((s) => ({ ...s, phase: "encounter", lastOutcome: null, abilityMessage: null, pendingDrops: [] }));
  }, []);

  const buySmallPotion = useCallback(() => {
    setState((s) => {
      if (s.gold < 500 || s.micahSmallPotionsBought >= 3) return s;
      const healed = Math.min(50, s.playerMaxHp - s.playerHp);
      return {
        ...s,
        gold: s.gold - 500,
        playerHp: Math.min(s.playerHp + 50, s.playerMaxHp),
        micahSmallPotionsBought: s.micahSmallPotionsBought + 1,
        itemActionMessage: healed > 0 ? `Micah's potion restored ${healed} HP.` : null,
      };
    });
  }, []);

  const buyBigPotion = useCallback(() => {
    setState((s) => {
      if (s.gold < 1500 || s.micahBigPotionsBought >= 3) return s;
      const healed = Math.min(150, s.playerMaxHp - s.playerHp);
      return {
        ...s,
        gold: s.gold - 1500,
        playerHp: Math.min(s.playerHp + 150, s.playerMaxHp),
        micahBigPotionsBought: s.micahBigPotionsBought + 1,
        itemActionMessage: healed > 0 ? `Micah's potion restored ${healed} HP.` : null,
      };
    });
  }, []);

  const buyFireGrease = useCallback(() => {
    setState((s) => {
      if (s.gold < 5000 || s.micahFireGreaseBought >= 3) return s;
      const greaseDef = GREASE_ITEMS.find((g) => g.id === "fire-grease")!;
      const newItem: GearItemInstance = {
        instanceId: `fire-grease-${Math.random().toString(36).slice(2, 9)}`,
        def: greaseDef,
      };
      return {
        ...s,
        gold: s.gold - 5000,
        inventory: [...s.inventory, newItem],
        micahFireGreaseBought: s.micahFireGreaseBought + 1,
      };
    });
  }, []);

  const buyLightningGrease = useCallback(() => {
    setState((s) => {
      if (s.gold < 15000 || s.micahLightningGreaseBought >= 2) return s;
      const greaseDef = GREASE_ITEMS.find((g) => g.id === "lightning-grease")!;
      const newItem: GearItemInstance = {
        instanceId: `lightning-grease-${Math.random().toString(36).slice(2, 9)}`,
        def: greaseDef,
      };
      return {
        ...s,
        gold: s.gold - 15000,
        inventory: [...s.inventory, newItem],
        micahLightningGreaseBought: s.micahLightningGreaseBought + 1,
      };
    });
  }, []);

  const applyGrease = useCallback((instanceId: string) => {
    setState((s) => {
      if (!s.equippedItemId) {
        return { ...s, itemActionMessage: "You must equip a weapon before applying grease!" };
      }
      const idx = s.inventory.findIndex((i) => i.instanceId === instanceId);
      if (idx === -1) return s;
      const item = s.inventory[idx];
      if (!item.def.isGrease || !item.def.greaseChoices) return s;
      const newInventory = [...s.inventory];
      newInventory.splice(idx, 1);
      return {
        ...s,
        inventory: newInventory,
        activeGreaseId: item.def.id,
        greaseChoicesLeft: item.def.greaseChoices,
        itemActionMessage: `${item.def.emoji} ${item.def.name} applied to your weapon for ${item.def.greaseChoices} choices!`,
      };
    });
  }, []);

  const sellItem = useCallback((instanceId: string) => {
    setState((s) => {
      const idx = s.inventory.findIndex((i) => i.instanceId === instanceId);
      if (idx === -1) return s;
      const item = s.inventory[idx];
      const sellValue = getSellValue(item.def.rarityColor, item.upgradeLevel ?? 0);
      const newInventory = s.inventory.filter((_, i) => i !== idx);

      let newEquippedItemId = s.equippedItemId;
      let newEquippedArmorId = s.equippedArmorId;
      let newMaxHp = s.playerMaxHp;
      let newHp = s.playerHp;

      if (item.def.isWeapon && s.equippedItemId === item.def.id) {
        newEquippedItemId = null;
      }
      if (item.def.isArmor && s.equippedArmorId === item.def.id && item.def.hpBonus) {
        const currentHpBonus = Math.floor(item.def.hpBonus * Math.pow(1.1, item.upgradeLevel ?? 0));
        newMaxHp = s.playerMaxHp - currentHpBonus;
        newHp = Math.min(s.playerHp, newMaxHp);
        newEquippedArmorId = null;
      }

      return {
        ...s,
        inventory: newInventory,
        gold: s.gold + sellValue,
        equippedItemId: newEquippedItemId,
        equippedArmorId: newEquippedArmorId,
        playerMaxHp: newMaxHp,
        playerHp: newHp,
        itemActionMessage: `Sold ${item.def.name} for 🪙 ${sellValue.toLocaleString()}`,
      };
    });
  }, []);

  const upgradeItem = useCallback((instanceId: string) => {
    setState((s) => {
      const idx = s.inventory.findIndex((i) => i.instanceId === instanceId);
      if (idx === -1) return s;
      const item = s.inventory[idx];
      const currentLevel = item.upgradeLevel ?? 0;
      if (currentLevel >= 5) return s;
      const cost = getUpgradeCost(item.def.rarityColor, currentLevel);
      if (s.gold < cost) return s;

      const newInventory = [...s.inventory];
      newInventory[idx] = { ...item, upgradeLevel: currentLevel + 1 };

      let newMaxHp = s.playerMaxHp;
      let newHp = s.playerHp;
      if (item.def.isArmor && item.def.id === s.equippedArmorId && item.def.hpBonus) {
        const oldBonus = Math.floor(item.def.hpBonus * Math.pow(1.1, currentLevel));
        const newBonus = Math.floor(item.def.hpBonus * Math.pow(1.1, currentLevel + 1));
        const delta = newBonus - oldBonus;
        newMaxHp = s.playerMaxHp + delta;
        newHp = Math.min(s.playerHp + delta, newMaxHp);
      }

      return { ...s, gold: s.gold - cost, inventory: newInventory, playerMaxHp: newMaxHp, playerHp: newHp };
    });
  }, []);

  return {
    state,
    currentEncounter,
    currentRound,
    activeSlot,
    goToTitle,
    goToMainMenu,
    goToRaidSelect,
    goToCharacterSelect,
    goToShop,
    beginRaid,
    selectCharacter,
    startGame,
    startRaid,
    startNewGame,
    chooseAnswer,
    useItem,
    openChest,
    equipItem,
    unequipItem,
    equipArmor,
    unequipArmor,
    continueAfterOutcome,
    dismissDrops,
    dismissItemMessage,
    claimAchievement,
    loadSavedGame,
    clearSave,
    dismissCK3Cutscene,
    buyShopItem,
    leaveVendor,
    buySmallPotion,
    buyBigPotion,
    buyFireGrease,
    buyLightningGrease,
    applyGrease,
    sellItem,
    upgradeItem,
    lastSavedAt,
    ZONES,
    enterNewGamePlus,
    continueTowerFloor,
  };
}
