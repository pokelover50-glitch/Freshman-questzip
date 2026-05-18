import { useState, useCallback } from "react";
import type { GameState, ChoiceOutcome, CharacterClassDef } from "./types";
import { ZONES } from "./encounters";

const ROUNDS_PER_BOSS = 3;

function getInitialState(): GameState {
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
  };
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
    setState(getInitialState());
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
      };
    });
  }, []);

  const chooseAnswer = useCallback((choice: ChoiceOutcome) => {
    setState((s) => {
      if (!currentEncounter) return s;

      const newPlayerHp = Math.max(0, s.playerHp - choice.playerDamage + choice.healAmount);
      const newEnemyHp = Math.max(0, s.enemyHp - choice.enemyDamage);

      return {
        ...s,
        playerHp: newPlayerHp,
        enemyHp: newEnemyHp,
        lastOutcome: choice,
        showOutcome: true,
      };
    });
  }, [currentEncounter]);

  const continueAfterOutcome = useCallback(() => {
    setState((s) => {
      if (!currentEncounter) return s;

      const playerDied = s.playerHp <= 0;
      const enemyDied = s.enemyHp <= 0;

      if (playerDied) {
        return { ...s, phase: "game-over", showOutcome: false };
      }

      if (enemyDied) {
        const isLastInZone = s.encounterIndex >= ZONES[s.zoneIndex].length - 1;
        const isLastZone = s.zoneIndex >= ZONES.length - 1;

        if (isLastZone && isLastInZone) {
          return { ...s, phase: "victory", showOutcome: false };
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
            defeatedBosses: currentEncounter.isBoss
              ? [...s.defeatedBosses, currentEncounter.enemyName]
              : s.defeatedBosses,
            showOutcome: false,
            lastOutcome: null,
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
        };
      }

      const isLastRound = s.roundIndex >= currentEncounter.rounds.length - 1;
      if (isLastRound) {
        return {
          ...s,
          roundIndex: 0,
          showOutcome: false,
          lastOutcome: null,
        };
      }

      return {
        ...s,
        roundIndex: s.roundIndex + 1,
        showOutcome: false,
        lastOutcome: null,
      };
    });
  }, [currentEncounter]);

  return {
    state,
    currentEncounter,
    currentRound,
    goToTitle,
    goToCharacterSelect,
    selectCharacter,
    startGame,
    chooseAnswer,
    continueAfterOutcome,
    ZONES,
  };
}
