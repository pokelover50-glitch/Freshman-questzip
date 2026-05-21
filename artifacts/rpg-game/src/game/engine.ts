import { useState, useCallback, useEffect } from "react";
import type { GameState, ChoiceOutcome, CharacterClassDef, GearItemDef, GearItemInstance } from "./types";
import { ZONES, RAID_ENCOUNTERS, ACHIEVEMENT_MOB_IDS } from "./encounters";
import { rollMobDrops, rollBossDrops, rollRaidBossDrops, rollDoomscrollerChest, FOOD_ITEMS, CHEST_ITEMS, CHEST_WEAPON_ITEMS, rollChestDrop, ARMOR_ITEMS } from "./gear";

import { saveGameToSlot, loadSaveFromSlot, deleteSlotSave, migrateLegacySave, type SaveData, type SaveSlot } from "./saveLoad";

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
};

function getInitialState(
  preserve?: Pick<GameState, "barrettDefeated" | "completedRaids" | "mobsDefeated" | "achievements" | "unclaimedAchievements" | "doomscrollerUnlocked">
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
    completedRaids: preserve?.completedRaids ?? [],
    mobsDefeated: preserve?.mobsDefeated ?? 0,
    achievements: preserve?.achievements ?? [],
    unclaimedAchievements: preserve?.unclaimedAchievements ?? [],
    equippedItemId: null,
    equippedArmorId: null,
    defeatedByName: null,
    activeRaidId: null,
    doomscrollerUnlocked: preserve?.doomscrollerUnlocked ?? false,
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
      doomscrollerUnlocked: s.doomscrollerUnlocked ?? false,
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
      doomscrollerUnlocked: saveData.state.doomscrollerUnlocked ?? false,
    };
    if (loadedState.phase === "victory" || loadedState.phase === "title" || loadedState.phase === "game-over" || loadedState.phase === "raid-complete") {
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

  const currentEncounter =
    state.phase === "encounter"
      ? (state.activeRaidId
          ? RAID_ENCOUNTERS[state.activeRaidId]?.[state.encounterIndex] ?? null
          : ZONES[state.zoneIndex]?.[state.encounterIndex] ?? null)
      : null;

  const currentRound =
    currentEncounter?.rounds[state.roundIndex] ?? null;

  const goToTitle = useCallback(() => {
    setState((s) => getInitialState({
      barrettDefeated: s.barrettDefeated,
      completedRaids: s.completedRaids,
      mobsDefeated: s.mobsDefeated,
      achievements: s.achievements,
      unclaimedAchievements: s.unclaimedAchievements,
      doomscrollerUnlocked: s.doomscrollerUnlocked,
    }));
  }, []);

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
      return {
        ...s,
        phase: "encounter",
        zoneIndex: 0,
        encounterIndex: 0,
        roundIndex: 0,
        enemyHp: firstEncounter.enemyMaxHp,
        lastOutcome: null,
        showOutcome: false,
        inventory: [],
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
      return {
        ...s,
        phase: "encounter",
        encounterIndex: 0,
        roundIndex: 0,
        playerHp: s.playerMaxHp,
        enemyHp: encounters[0].enemyMaxHp,
        lastOutcome: null,
        showOutcome: false,
        pendingDrops: [],
        defeatedBosses: [],
        abilityMessage: null,
        itemActionMessage: null,
      };
    });
  }, []);

  const chooseAnswer = useCallback((choice: ChoiceOutcome) => {
    setState((s) => {
      if (!currentEncounter || !s.selectedClass) return s;

      // Scale player's attack damage by zone (1.1x per zone, base at zone 0) — raids use zone 0 scale
      const zoneMultiplier = s.activeRaidId ? 1 : Math.pow(1.1, s.zoneIndex);
      const scaledEnemyDamage = Math.round(choice.enemyDamage * zoneMultiplier);

      const { enemyDamage, playerDamage, healAmount, abilityMessage } =
        applyClassAbility(
          s.selectedClass,
          scaledEnemyDamage,
          choice.playerDamage,
          choice.healAmount,
          currentEncounter.enemyMaxHp,
          currentEncounter.id,
        );

      // Add equipped weapon bonus — not multiplied by class abilities
      const equippedWeapon = CHEST_WEAPON_ITEMS.find((w) => w.id === s.equippedItemId);
      let weaponBonus = 0;
      if (equippedWeapon) {
        weaponBonus = equippedWeapon.scalesWithZone
          ? Math.round(equippedWeapon.damage * zoneMultiplier)
          : equippedWeapon.damage;
        if (equippedWeapon.barrettMultiplier && currentEncounter.id === "boss-barrett") {
          weaponBonus *= equippedWeapon.barrettMultiplier;
        }
      }

      const totalEnemyDamage = enemyDamage + weaponBonus;

      const newPlayerHpRaw = Math.max(0, s.playerHp - playerDamage + healAmount);
      const newPlayerHp = Math.min(newPlayerHpRaw, s.playerMaxHp);
      const newEnemyHp = Math.max(0, s.enemyHp - totalEnemyDamage);

      const modifiedOutcome: ChoiceOutcome = {
        ...choice,
        playerDamage,
        enemyDamage: Math.min(totalEnemyDamage, s.enemyHp),
        healAmount,
      };

      return {
        ...s,
        playerHp: newPlayerHp,
        enemyHp: newEnemyHp,
        lastOutcome: modifiedOutcome,
        showOutcome: true,
        abilityMessage,
        itemActionMessage: null,
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
        return { ...s, phase: "game-over", showOutcome: false, pendingDrops: [], defeatedByName: currentEncounter.enemyName };
      }

      if (enemyDied) {
        // Calculate drops
        let rawDrops: GearItemInstance[];
        if (currentEncounter.isBoss) {
          rawDrops = isRaid ? rollRaidBossDrops() : rollBossDrops();
        } else {
          rawDrops = rollMobDrops(currentEncounter.id, isRaid);
        }

        // Doomscroller 15% chest bonus on any kill
        if (s.selectedClass?.ability === "doomscroller" && Math.random() < 0.15) {
          rawDrops = [...rawDrops, rollDoomscrollerChest()];
        }

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

        // ── RAID path ───────────────────────────────────────────────────────
        if (isRaid && raidEncounters) {
          const isLastInRaid = s.encounterIndex >= raidEncounters.length - 1;

          if (isLastInRaid) {
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
            };
          }

          const newEncounterIndex = s.encounterIndex + 1;
          const newEncounter = raidEncounters[newEncounterIndex];
          return {
            ...s,
            phase: "encounter",
            encounterIndex: newEncounterIndex,
            roundIndex: 0,
            enemyHp: newEncounter.enemyMaxHp,
            showOutcome: false,
            lastOutcome: null,
            inventory: newInventory,
            pendingDrops: drops,
            abilityMessage: null,
            defeatedBosses: newDefeatedBosses,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: newUnclaimedAchievements,
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
          };
        }

        if (isLastInZone) {
          const newZoneIndex = s.zoneIndex + 1;
          const newEncounter = ZONES[newZoneIndex][0];
          return {
            ...s,
            phase: "encounter",
            zoneIndex: newZoneIndex,
            encounterIndex: 0,
            roundIndex: 0,
            enemyHp: newEncounter.enemyMaxHp,
            defeatedBosses: newDefeatedBosses,
            showOutcome: false,
            lastOutcome: null,
            inventory: newInventory,
            pendingDrops: drops,
            abilityMessage: null,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: newUnclaimedAchievements,
          };
        }

        const newEncounterIndex = s.encounterIndex + 1;
        const newEncounter = ZONES[s.zoneIndex][newEncounterIndex];
        return {
          ...s,
          phase: "encounter",
          encounterIndex: newEncounterIndex,
          roundIndex: 0,
          enemyHp: newEncounter.enemyMaxHp,
          showOutcome: false,
          lastOutcome: null,
          inventory: newInventory,
          pendingDrops: drops,
          abilityMessage: null,
          mobsDefeated: newMobsDefeated,
          unclaimedAchievements: newUnclaimedAchievements,
        };
      }

      // ── Bryant → Barrett mid-fight: Barrett spawns when Bryant hits ≤50% HP ──
      if (
        s.activeRaidId === "bryant" &&
        currentEncounter.id === "raid-boss-bryant" &&
        s.enemyHp <= currentEncounter.enemyMaxHp / 2 &&
        raidEncounters
      ) {
        const barrettIdx = raidEncounters.findIndex((e) => e.id === "raid-boss-ck3-barrett");
        const barrett = raidEncounters[barrettIdx];
        return {
          ...s,
          encounterIndex: barrettIdx,
          roundIndex: 0,
          enemyHp: barrett.enemyMaxHp,
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

      const alreadyHas = s.inventory.some((i) => i.def.id === wonItemDef.id && i.def.isWeapon);
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
      const armorItem = ARMOR_ITEMS.find((a) => a.id === itemId);
      if (!armorItem || !armorItem.hpBonus) return s;
      let newMaxHp = s.playerMaxHp;
      let newHp = s.playerHp;
      if (s.equippedArmorId) {
        const oldArmor = ARMOR_ITEMS.find((a) => a.id === s.equippedArmorId);
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
      const armorItem = ARMOR_ITEMS.find((a) => a.id === s.equippedArmorId);
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
      // matteo-phone unlocks the Doomscroller class (no item reward)
      if (id === "matteo-phone") {
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

  return {
    state,
    currentEncounter,
    currentRound,
    activeSlot,
    goToTitle,
    goToMainMenu,
    goToRaidSelect,
    goToCharacterSelect,
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
    lastSavedAt,
    ZONES,
  };
}
