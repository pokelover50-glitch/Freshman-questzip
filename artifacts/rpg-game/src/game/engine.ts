import { useState, useCallback } from "react";
import type { GameState, ChoiceOutcome, CharacterClassDef, GearItemInstance } from "./types";
import { ZONES } from "./encounters";
import { rollMobDrops, rollBossDrops } from "./gear";

function getInitialState(preserve?: Pick<GameState, "barrettDefeated" | "completedRaids">): GameState {
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

    case "double-damage":
      enemyDamage = baseEnemyDamage * 2;
      if (baseEnemyDamage > 0) abilityMessage = `Bulking power: damage doubled to ${enemyDamage}!`;
      break;

    case "negate-damage-chance":
      if (basePlayerDamage > 0 && Math.random() < 0.25) {
        playerDamage = 0;
        abilityMessage = "Unbothered energy: all incoming damage negated!";
      }
      break;

    case "insta-kill-barrett":
      if (encounterId === "boss-barrett") {
        enemyDamage = enemyMaxHp + 9999;
        abilityMessage = "You are Barrett's type — he simply cannot beat you. Instant defeat!";
      }
      break;

    case "random-insta-kill":
      if (Math.random() < 0.67) {
        enemyDamage = enemyMaxHp + 9999;
        abilityMessage = "67 Freshman energy activated — instant annihilation!";
      }
      break;
  }

  return { enemyDamage, playerDamage, healAmount, abilityMessage };
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>(getInitialState());

  const currentEncounter =
    state.phase === "encounter"
      ? ZONES[state.zoneIndex]?.[state.encounterIndex] ?? null
      : null;

  const currentRound =
    currentEncounter?.rounds[state.roundIndex] ?? null;

  const goToTitle = useCallback(() => {
    setState((s) => getInitialState({ barrettDefeated: s.barrettDefeated, completedRaids: s.completedRaids }));
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

      const newPlayerHp = Math.max(0, s.playerHp - playerDamage + healAmount);
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

      const damageDealt = Math.min(def.damage, s.enemyHp);
      const newEnemyHp = Math.max(0, s.enemyHp - def.damage);
      const newInventory = [...s.inventory];
      newInventory.splice(itemIdx, 1);

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
          : rollMobDrops();
        const existingIds = new Set(s.inventory.map((i) => i.def.id));
        const drops = rawDrops.filter((d) => !existingIds.has(d.def.id));

        const isLastInZone = s.encounterIndex >= ZONES[s.zoneIndex].length - 1;
        const isLastZone = s.zoneIndex >= ZONES.length - 1;

        const newInventory = [...s.inventory, ...drops];
        const newDefeatedBosses = currentEncounter.isBoss
          ? [...s.defeatedBosses, currentEncounter.enemyName]
          : s.defeatedBosses;

        if (isLastZone && isLastInZone) {
          return {
            ...s,
            phase: "victory",
            showOutcome: false,
            inventory: newInventory,
            pendingDrops: drops,
            defeatedBosses: newDefeatedBosses,
            barrettDefeated: true,
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
    chooseAnswer,
    useItem,
    continueAfterOutcome,
    dismissDrops,
    dismissItemMessage,
    ZONES,
  };
}
