import type { GearItemDef, GearItemInstance } from "./types";

export const CHEST_WEAPON_ITEMS: GearItemDef[] = [
  {
    id: "matteos-phone",
    name: "Matteo's Phone",
    emoji: "📱",
    description: "+3 damage on any choice selected.",
    damage: 3,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#9ca3af",
  },
  {
    id: "joses-bat",
    name: "Jose's Bat",
    emoji: "🏏",
    description: "+8 damage on any choice selected.",
    damage: 8,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#4ade80",
  },
  {
    id: "trevons-flower",
    name: "Trevon's Flower",
    emoji: "🌸",
    description: "+17 damage on any choice selected.",
    damage: 17,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#4ade80",
  },
  {
    id: "cronins-twinblade",
    name: "Cronin's Twinblade",
    emoji: "⚔️",
    description: "+25 damage on any choice selected.",
    damage: 25,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#60a5fa",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    emoji: "🤖",
    description: "+33 damage on any choice. Scales with zone.",
    damage: 33,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: true,
    rarityColor: "#60a5fa",
  },
  {
    id: "christians-greatsword",
    name: "Christian's Greatsword",
    emoji: "🗡️",
    description: "+79 damage on any choice. Scales with zone.",
    damage: 79,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: true,
    rarityColor: "#c084fc",
  },
  {
    id: "doms-waraxe",
    name: "Dom's Waraxe",
    emoji: "🪓",
    description: "+150 damage on any choice. Scales with zone. x2 damage vs Barrett Luke Hutchins.",
    damage: 150,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: true,
    barrettMultiplier: 2,
    rarityColor: "#fb923c",
  },
];

type ChestLootEntry = { item: GearItemDef; weight: number };

function cwById(id: string): GearItemDef {
  return CHEST_WEAPON_ITEMS.find((w) => w.id === id)!;
}

const WOODEN_POOL: ChestLootEntry[] = [
  { item: cwById("matteos-phone"), weight: 55 },
  { item: cwById("cronins-twinblade"), weight: 10 },
  { item: cwById("joses-bat"), weight: 20 },
  { item: cwById("trevons-flower"), weight: 15 },
];

const BRONZE_POOL: ChestLootEntry[] = [
  { item: cwById("christians-greatsword"), weight: 7 },
  { item: cwById("doms-waraxe"), weight: 3 },
  { item: cwById("cronins-twinblade"), weight: 20 },
  { item: cwById("chatgpt"), weight: 10 },
  { item: cwById("joses-bat"), weight: 35 },
  { item: cwById("trevons-flower"), weight: 25 },
];

const SILVER_POOL: ChestLootEntry[] = [
  { item: cwById("christians-greatsword"), weight: 15 },
  { item: cwById("doms-waraxe"), weight: 10 },
  { item: cwById("cronins-twinblade"), weight: 25 },
  { item: cwById("chatgpt"), weight: 25 },
  { item: cwById("trevons-flower"), weight: 25 },
];

export const CHEST_LOOT_POOLS: Record<string, ChestLootEntry[]> = {
  "wooden-chest": WOODEN_POOL,
  "bronze-chest": BRONZE_POOL,
  "silver-chest": SILVER_POOL,
};

export function rollChestDrop(chestId: string): GearItemDef | null {
  const pool = CHEST_LOOT_POOLS[chestId];
  if (!pool) return null;
  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return pool[pool.length - 1].item;
}

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
  },
];

export const CHEST_ITEMS: GearItemDef[] = [
  {
    id: "wooden-chest",
    name: "Wooden Chest",
    emoji: "📦",
    description: "A common chest. Contains unknown rewards. (Coming Soon)",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0.55,
    isChest: true,
    stackable: true,
  },
  {
    id: "bronze-chest",
    name: "Bronze Chest",
    emoji: "🧰",
    description: "An uncommon chest. Contains better rewards. (Coming Soon)",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0.35,
    isChest: true,
    stackable: true,
  },
  {
    id: "silver-chest",
    name: "Silver Chest",
    emoji: "🔮",
    description: "A rare chest. Contains powerful rewards. (Coming Soon)",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0.10,
    isChest: true,
    stackable: true,
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
  const roll = Math.random() * 100;
  let chest: GearItemDef;
  if (roll < 55) chest = CHEST_ITEMS[0];
  else if (roll < 90) chest = CHEST_ITEMS[1];
  else chest = CHEST_ITEMS[2];
  return [makeInstance(chest)];
}
