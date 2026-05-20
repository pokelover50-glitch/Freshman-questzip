import { useState, useCallback, useEffect } from "react";
import type { GameState, ChoiceOutcome, CharacterClassDef, GearItemInstance } from "./types";
import { ZONES, ACHIEVEMENT_MOB_IDS } from "./encounters";
import { rollMobDrops, rollBossDrops, FOOD_ITEMS } from "./gear";
import { saveGame, loadSave, deleteSave, type SaveData } from "./saveLoad";

function getInitialState(
  preserve?: Pick<GameState, "barrettDefeated" | "completedRaids" | "mobsDefeated" | "achievements" | "unclaimedAchievements">
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

    case "hidden-ability":
      break;
  }

  return { enemyDamage, playerDamage, healAmount, abilityMessage };
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>(getInitialState());
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

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
    }));
  }, []);

  // Auto-save when a fresh encounter begins or on victory
  useEffect(() => {
    if (state.phase === "encounter" && !state.showOutcome) {
      const clean: GameState = { ...state, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
      saveGame(clean);
      setLastSavedAt(Date.now());
    } else if (state.phase === "victory") {
      const clean: GameState = { ...state, pendingDrops: [], showOutcome: false, lastOutcome: null, abilityMessage: null, itemActionMessage: null };
      saveGame(clean);
      setLastSavedAt(Date.now());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.zoneIndex, state.encounterIndex, state.phase]);

  const loadSavedGame = useCallback((): SaveData | null => {
    const saveData = loadSave();
    if (!saveData) return null;
    let loadedState: GameState = {
      ...saveData.state,
      // Normalize fields that may be missing in older saves
      unclaimedAchievements: saveData.state.unclaimedAchievements ?? [],
      achievements: saveData.state.achievements ?? [],
      completedRaids: saveData.state.completedRaids ?? [],
      inventory: saveData.state.inventory ?? [],
      pendingDrops: saveData.state.pendingDrops ?? [],
      defeatedBosses: saveData.state.defeatedBosses ?? [],
    };
    if (loadedState.phase === "victory" || loadedState.phase === "title" || loadedState.phase === "game-over") {
      loadedState = { ...loadedState, phase: "main-menu" };
    }
    setState(loadedState);
    return saveData;
  }, []);

  const startNewGame = useCallback(() => {
    deleteSave();
    setState({ ...getInitialState(), phase: "main-menu" });
  }, []);

  const clearSave = useCallback(() => {
    deleteSave();
  }, []);

  const currentEncounter =
    state.phase === "encounter"
      ? ZONES[state.zoneIndex]?.[state.encounterIndex] ?? null
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
    }));
  }, []);

  const goToMainMenu = useCallback(() => {
    setState((s) => ({ ...s, phase: "main-menu" }));
  }, []);

  const goToRaidSelect = useCallback(() => {
    setState((s) => ({ ...s, phase: "raid-select" }));
  }, []);

  const goToCharacterSelect = useCallback(() => {
    setState((s) => ({ ...s, phase: "character-select" }));
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
      };
    });
  }, []);

  const chooseAnswer = useCallback((choice: ChoiceOutcome) => {
    setState((s) => {
      if (!currentEncounter || !s.selectedClass) return s;

      const { enemyDamage, playerDamage, healAmount, abilityMessage } =
        applyClassAbility(
          s.selectedClass,
          choice.enemyDamage,
          choice.playerDamage,
          choice.healAmount,
          currentEncounter.enemyMaxHp,
          currentEncounter.id,
        );

      const newPlayerHpRaw = Math.max(0, s.playerHp - playerDamage + healAmount);
      const newPlayerHp = Math.min(newPlayerHpRaw, s.playerMaxHp);
      const newEnemyHp = Math.max(0, s.enemyHp - enemyDamage);

      const modifiedOutcome: ChoiceOutcome = {
        ...choice,
        playerDamage,
        enemyDamage: Math.min(enemyDamage, s.enemyHp),
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
          itemActionMessage: null,
        };
      }

      const damageDealt = Math.min(def.damage, s.enemyHp);
      const newEnemyHp = Math.max(0, s.enemyHp - def.damage);

      const fakeOutcome: ChoiceOutcome = {
        text: `Used ${def.name}`,
        playerDamage: 0,
        enemyDamage: damageDealt,
        healAmount: 0,
        narrative: `You unleashed ${def.name}! ${def.description}`,
      };

      return {
        ...s,
        enemyHp: newEnemyHp,
        inventory: newInventory,
        lastOutcome: fakeOutcome,
        showOutcome: true,
        abilityMessage: null,
        itemActionMessage: null,
      };
    });
  }, [currentEncounter]);

  const continueAfterOutcome = useCallback(() => {
    setState((s) => {
      if (!currentEncounter) return s;

      const playerDied = s.playerHp <= 0;
      const enemyDied = s.enemyHp <= 0;

      if (playerDied) {
        return { ...s, phase: "game-over", showOutcome: false, pendingDrops: [] };
      }

      if (enemyDied) {
        const rawDrops: GearItemInstance[] = currentEncounter.isBoss
          ? rollBossDrops()
          : rollMobDrops(currentEncounter.id);
        const existingNonStackableIds = new Set(
          s.inventory.filter((i) => !i.def.stackable).map((i) => i.def.id)
        );
        const drops = rawDrops.filter(
          (d) => d.def.stackable || !existingNonStackableIds.has(d.def.id)
        );

        const isLastInZone = s.encounterIndex >= ZONES[s.zoneIndex].length - 1;
        const isLastZone = s.zoneIndex >= ZONES.length - 1;

        const newDefeatedBosses = currentEncounter.isBoss
          ? [...s.defeatedBosses, currentEncounter.enemyName]
          : s.defeatedBosses;

        const isMobKill = !currentEncounter.isBoss && ACHIEVEMENT_MOB_IDS.has(currentEncounter.id);
        const newMobsDefeated = isMobKill ? s.mobsDefeated + 1 : s.mobsDefeated;
        const alreadyEarned10Mobs =
          s.achievements.includes("defeat-10-mobs") ||
          s.unclaimedAchievements.includes("defeat-10-mobs");
        const achievementJustEarned = !alreadyEarned10Mobs && newMobsDefeated >= 10;
        const newUnclaimedAchievements = achievementJustEarned
          ? [...s.unclaimedAchievements, "defeat-10-mobs"]
          : s.unclaimedAchievements;

        const allDrops = drops;
        const newInventory = [...s.inventory, ...allDrops];

        if (isLastZone && isLastInZone) {
          return {
            ...s,
            phase: "victory",
            showOutcome: false,
            inventory: newInventory,
            pendingDrops: allDrops,
            defeatedBosses: newDefeatedBosses,
            barrettDefeated: true,
            mobsDefeated: newMobsDefeated,
            unclaimedAchievements: newUnclaimedAchievements,
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
            pendingDrops: allDrops,
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
          pendingDrops: allDrops,
          abilityMessage: null,
          mobsDefeated: newMobsDefeated,
          unclaimedAchievements: newUnclaimedAchievements,
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

  const claimAchievement = useCallback((id: string) => {
    setState((s) => {
      if (!s.unclaimedAchievements.includes(id)) return s;
      const sandwichDef = FOOD_ITEMS.find((f) => f.id === "sandwich")!;
      const sandwichInstance: GearItemInstance = {
        instanceId: `sandwich-claim-${Math.random().toString(36).slice(2, 9)}`,
        def: sandwichDef,
      };
      return {
        ...s,
        achievements: [...s.achievements, id],
        unclaimedAchievements: s.unclaimedAchievements.filter((a) => a !== id),
        inventory: [...s.inventory, sandwichInstance],
      };
    });
  }, []);

  return {
    state,
    currentEncounter,
    currentRound,
    goToTitle,
    goToMainMenu,
    goToRaidSelect,
    goToCharacterSelect,
    selectCharacter,
    startGame,
    startNewGame,
    chooseAnswer,
    useItem,
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
