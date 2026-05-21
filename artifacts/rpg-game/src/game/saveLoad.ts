import type { GameState } from "./types";

const SLOT_KEYS = [
  "freshman-quest-save-1",
  "freshman-quest-save-2",
  "freshman-quest-save-3",
] as const;

const LEGACY_KEY = "freshman-quest-save";

export interface SaveData {
  state: GameState;
  savedAt: number;
  zoneIndex: number;
  encounterIndex: number;
}

export type SaveSlot = 1 | 2 | 3;

function slotKey(slot: SaveSlot): string {
  return SLOT_KEYS[slot - 1];
}

export function migrateLegacySave(): void {
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy && !localStorage.getItem(SLOT_KEYS[0])) {
      localStorage.setItem(SLOT_KEYS[0], legacy);
      localStorage.removeItem(LEGACY_KEY);
    }
  } catch {
    // ignore
  }
}

export function saveGameToSlot(slot: SaveSlot, state: GameState): void {
  try {
    const saveData: SaveData = {
      state,
      savedAt: Date.now(),
      zoneIndex: state.zoneIndex,
      encounterIndex: state.encounterIndex,
    };
    localStorage.setItem(slotKey(slot), JSON.stringify(saveData));
  } catch {
    // Storage unavailable or quota exceeded — silently skip
  }
}

export function loadSaveFromSlot(slot: SaveSlot): SaveData | null {
  try {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed.state || !parsed.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSlotSave(slot: SaveSlot): boolean {
  try {
    return localStorage.getItem(slotKey(slot)) !== null;
  } catch {
    return false;
  }
}

export function deleteSlotSave(slot: SaveSlot): void {
  try {
    localStorage.removeItem(slotKey(slot));
  } catch {
    // ignore
  }
}

export function getAllSlotSaves(): (SaveData | null)[] {
  return ([1, 2, 3] as SaveSlot[]).map((s) => loadSaveFromSlot(s));
}

export function formatSaveDate(timestamp: number): string {
  const d = new Date(timestamp);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " at " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  );
}

// Legacy shims so old callers don't break during transition
export function saveGame(state: GameState): void {
  saveGameToSlot(1, state);
}
export function loadSave(): SaveData | null {
  return loadSaveFromSlot(1);
}
export function hasSave(): boolean {
  return hasSlotSave(1);
}
export function deleteSave(): void {
  deleteSlotSave(1);
}
