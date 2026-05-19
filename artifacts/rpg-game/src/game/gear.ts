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

export const FOOD_ITEMS: GearItemDef[] = [
  {
    id: "grapes",
    name: "Grapes",
    emoji: "🍇",
    description: "Restores 5 HP.",
    damage: 0,
    healAmount: 5,
    target: "any",
    isFromBoss: false,
    dropChance: 0.70,
    stackable: true,
  },
  {
    id: "cherry",
    name: "Cherry",
    emoji: "🍒",
    description: "Restores 7 HP.",
    damage: 0,
    healAmount: 7,
    target: "any",
    isFromBoss: false,
    dropChance: 0.15,
    stackable: true,
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    description: "Restores 9 HP.",
    damage: 0,
    healAmount: 9,
    target: "any",
    isFromBoss: false,
    dropChance: 0.10,
    stackable: true,
  },
  {
    id: "sandwich",
    name: "Sandwich",
    emoji: "🥪",
    description: "Restores 15 HP.",
    damage: 0,
    healAmount: 15,
    target: "any",
    isFromBoss: false,
    dropChance: 0.05,
    stackable: true,
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

const FOOD_DROP_MOB_IDS = new Set([
  "seventh-grader",
  "eighth-grader",
  "fellow-freshman",
  "sophomore",
  "junior",
]);

function makeInstance(def: GearItemDef): GearItemInstance {
  return {
    instanceId: `${def.id}-${Math.random().toString(36).slice(2, 9)}`,
    def,
  };
}

function weightedPick(items: GearItemDef[]): GearItemDef | null {
  const totalWeight = items.reduce((sum, i) => sum + i.dropChance * 100, 0);
  let roll = Math.random() * totalWeight;
  for (const item of items) {
    roll -= item.dropChance * 100;
    if (roll <= 0) return item;
  }
  return null;
}

export function rollMobDrops(encounterId?: string): GearItemInstance[] {
  const drops: GearItemInstance[] = [];

  const roll = Math.random() * 100;
  if (roll < 33) drops.push(makeInstance(MOB_ITEMS[0]));
  else if (roll < 66) drops.push(makeInstance(MOB_ITEMS[1]));
  else if (roll < 99) drops.push(makeInstance(MOB_ITEMS[2]));

  if (encounterId && FOOD_DROP_MOB_IDS.has(encounterId)) {
    const food = weightedPick(FOOD_ITEMS);
    if (food) drops.push(makeInstance(food));
  }

  return drops;
}

export function rollBossDrops(): GearItemInstance[] {
  const picked = weightedPick(BOSS_ITEMS);
  return picked ? [makeInstance(picked)] : [];
}
