import type { GameState } from "./types";

const SAVE_KEY = "freshman-quest-save";

export interface SaveData {
  state: GameState;
  savedAt: number;
  zoneIndex: number;
  encounterIndex: number;
}

export function saveGame(state: GameState): void {
  try {
    const saveData: SaveData = {
      state,
      savedAt: Date.now(),
      zoneIndex: state.zoneIndex,
      encounterIndex: state.encounterIndex,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch {
    // Storage unavailable or quota exceeded — silently skip
  }
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed.state || !parsed.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function formatSaveDate(timestamp: number): string {
  const d = new Date(timestamp);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " at " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  );
}
