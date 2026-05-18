import type { GearItemDef, GearItemInstance } from "./types";

export const MOB_ITEMS: GearItemDef[] = [
  {
    id: "pencil",
    name: "Pencil",
    emoji: "✏️",
    description: "Deals 5 damage to the current enemy.",
    damage: 5,
    target: "any",
    isFromBoss: false,
    dropChance: 0.33,
  },
  {
    id: "book",
    name: "Book",
    emoji: "📖",
    description: "Deals 5 damage to the current enemy.",
    damage: 5,
    target: "any",
    isFromBoss: false,
    dropChance: 0.33,
  },
  {
    id: "eraser",
    name: "Eraser",
    emoji: "🧼",
    description: "Deals 5 damage to the current enemy.",
    damage: 5,
    target: "any",
    isFromBoss: false,
    dropChance: 0.33,
  },
];

export const BOSS_ITEMS: GearItemDef[] = [
  {
    id: "mega-knight",
    name: "Mega Knight",
    emoji: "⚔️",
    description: "Deals 50 damage to mob enemies. Cannot be used on bosses.",
    damage: 50,
    target: "mob-only",
    isFromBoss: true,
    dropChance: 0.65,
  },
  {
    id: "christian-vollstedt",
    name: "Christian Vollstedt",
    emoji: "🎓",
    description: "Deals 2000 damage to any enemy except Barrett Luke Hutchins.",
    damage: 2000,
    target: "non-barrett",
    isFromBoss: true,
    dropChance: 0.25,
  },
  {
    id: "mr-cronin",
    name: "Mr. Cronin",
    emoji: "📐",
    description: "One shots Barrett Luke Hutchins only.",
    damage: 9999,
    target: "barrett-only",
    isFromBoss: true,
    dropChance: 0.15,
  },
  {
    id: "dom",
    name: "Dom",
    emoji: "💀",
    description: "Instantly defeats ANY enemy in the game. No exceptions.",
    damage: 9999,
    target: "any",
    isFromBoss: true,
    dropChance: 0.05,
  },
];

function makeInstance(def: GearItemDef): GearItemInstance {
  return {
    instanceId: `${def.id}-${Math.random().toString(36).slice(2, 9)}`,
    def,
  };
}

export function rollMobDrops(): GearItemInstance[] {
  const drops: GearItemInstance[] = [];
  for (const item of MOB_ITEMS) {
    if (Math.random() < item.dropChance) {
      drops.push(makeInstance(item));
    }
  }
  return drops;
}

export function rollBossDrops(): GearItemInstance[] {
  const drops: GearItemInstance[] = [];
  for (const item of BOSS_ITEMS) {
    if (Math.random() < item.dropChance) {
      drops.push(makeInstance(item));
    }
  }
  return drops;
}
