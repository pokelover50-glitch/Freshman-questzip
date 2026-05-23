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
  // ── NG+ exclusive weapons ────────────────────────────────────────────────
  {
    id: "saber-of-iowa",
    name: "Saber of Iowa",
    emoji: "⚡",
    description: "+315 damage on any choice. NG+ exclusive.",
    damage: 315,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#e879f9",
    rarityTier: "mythic",
  },
  {
    id: "cmilk-katana",
    name: "CMilk Katana",
    emoji: "🥛",
    description: "+699 damage on any choice. NG+ exclusive.",
    damage: 699,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#f472b6",
    rarityTier: "mythic",
  },
  {
    id: "divine-daggers",
    name: "Divine Daggers",
    emoji: "🗡️",
    description: "+1000 damage on any choice. NG+ exclusive.",
    damage: 1000,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#38bdf8",
    rarityTier: "exotic",
  },
  {
    id: "void-rapier",
    name: "Void Rapier",
    emoji: "🌀",
    description: "+3333 damage on any choice. NG+ exclusive.",
    damage: 3333,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#f43f5e",
    rarityTier: "eternal",
  },
  {
    id: "wand-67",
    name: "67 Wand",
    emoji: "🪄",
    description: "+670 damage. Secret: Doomscroller one-shot rises to 41%.",
    damage: 670,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isWeapon: true,
    scalesWithZone: false,
    rarityColor: "#6366f1",
    rarityTier: "eternal",
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

export const ARMOR_ITEMS: GearItemDef[] = [
  {
    id: "bronze-armor",
    name: "Bronze Armor",
    emoji: "🛡️",
    description: "+45 Max HP while equipped.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 45,
    rarityColor: "#cd7f32",
  },
  {
    id: "silver-armor",
    name: "Silver Armor",
    emoji: "🛡️",
    description: "+95 Max HP while equipped.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 95,
    rarityColor: "#9ca3af",
  },
  {
    id: "gold-armor",
    name: "Gold Armor",
    emoji: "🛡️",
    description: "+150 Max HP while equipped.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 150,
    rarityColor: "#fbbf24",
  },
  {
    id: "doms-armor",
    name: "Dom's Armor",
    emoji: "🛡️",
    description: "+250 Max HP while equipped.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 250,
    rarityColor: "#fb923c",
  },
  // ── NG+ exclusive armors ─────────────────────────────────────────────────
  {
    id: "vollys-chestplate",
    name: "Volly's Chestplate",
    emoji: "🪬",
    description: "+500 Max HP while equipped. NG+ exclusive.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 500,
    rarityColor: "#e879f9",
    rarityTier: "mythic",
  },
  {
    id: "divine-armor",
    name: "Divine Armor",
    emoji: "✨",
    description: "+1000 Max HP while equipped. NG+ exclusive.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    isArmor: true,
    hpBonus: 1000,
    rarityColor: "#38bdf8",
    rarityTier: "exotic",
  },
];

const ARMOR_POOL: ChestLootEntry[] = [
  { item: ARMOR_ITEMS[0], weight: 50 },
  { item: ARMOR_ITEMS[1], weight: 35 },
  { item: ARMOR_ITEMS[2], weight: 12.5 },
  { item: ARMOR_ITEMS[3], weight: 2.5 },
];

export const CHEST_LOOT_POOLS: Record<string, ChestLootEntry[]> = {
  "wooden-chest": WOODEN_POOL,
  "bronze-chest": BRONZE_POOL,
  "silver-chest": SILVER_POOL,
  "armor-chest": ARMOR_POOL,
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

export const GREASE_ITEMS: GearItemDef[] = [
  {
    id: "fire-grease",
    name: "Fire Grease",
    emoji: "🔥",
    description: "Apply to equipped weapon. Adds +15% weapon damage for 5 choices.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    stackable: true,
    isGrease: true,
    greaseType: "fire",
    greaseChoices: 5,
    rarityColor: "#f97316",
  },
  {
    id: "lightning-grease",
    name: "Lightning Grease",
    emoji: "⚡",
    description: "Apply to equipped weapon. Stuns enemy (negates all incoming damage) for 3 choices.",
    damage: 0,
    target: "any",
    isFromBoss: false,
    dropChance: 0,
    stackable: true,
    isGrease: true,
    greaseType: "lightning",
    greaseChoices: 3,
    rarityColor: "#a78bfa",
  },
];

export const MOB_ITEMS: GearItemDef[] = [];

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
  {
    id: "armor-chest",
    name: "Armor Chest",
    emoji: "🪖",
    description: "Contains a piece of armor that grants bonus Max HP.",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0,
    isChest: true,
    stackable: true,
  },
];

export const NG_CHEST_ITEMS: GearItemDef[] = [
  {
    id: "gold-chest",
    name: "Gold Chest",
    emoji: "🏆",
    description: "An NG+ chest. Contains powerful exclusive gear.",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0.95,
    isChest: true,
    stackable: true,
    rarityColor: "#fbbf24",
  },
  {
    id: "obsidian-chest",
    name: "Obsidian Chest",
    emoji: "🖤",
    description: "An ultra-rare NG+ chest. Contains god-tier gear.",
    damage: 0,
    target: "any",
    isFromBoss: true,
    dropChance: 0.05,
    isChest: true,
    stackable: true,
    rarityColor: "#6366f1",
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

export function rollMobDrops(encounterId?: string, alwaysDropFood = false): GearItemInstance[] {
  const drops: GearItemInstance[] = [];

  if (MOB_ITEMS.length > 0 && Math.random() < 0.99) {
    const item = weightedPick(MOB_ITEMS);
    if (item) drops.push(makeInstance(item));
  }

  if (alwaysDropFood || (encounterId && FOOD_DROP_MOB_IDS.has(encounterId))) {
    const food = weightedPick(FOOD_ITEMS);
    if (food) drops.push(makeInstance(food));
  }

  return drops;
}

const ARMOR_CHEST = CHEST_ITEMS[3];

export function rollBossDrops(): GearItemInstance[] {
  const roll = Math.random() * 100;
  let chest: GearItemDef;
  if (roll < 55) chest = CHEST_ITEMS[0];
  else if (roll < 90) chest = CHEST_ITEMS[1];
  else chest = CHEST_ITEMS[2];
  const drops = [makeInstance(chest)];
  if (Math.random() < 0.5) drops.push(makeInstance(ARMOR_CHEST));
  return drops;
}

export function rollRaidBossDrops(): GearItemInstance[] {
  const chest = Math.random() < 0.65 ? CHEST_ITEMS[1] : CHEST_ITEMS[2];
  const drops = [makeInstance(chest)];
  if (Math.random() < 0.5) drops.push(makeInstance(ARMOR_CHEST));
  return drops;
}

export function rollDoomscrollerChest(): GearItemInstance {
  const chest = Math.random() < 0.7 ? CHEST_ITEMS[1] : CHEST_ITEMS[2];
  return makeInstance(chest);
}

export function rollTowerBossDrops(): GearItemInstance[] {
  const chest = Math.random() < 0.5 ? CHEST_ITEMS[1] : CHEST_ITEMS[2];
  const drops = [makeInstance(chest)];
  if (Math.random() < 0.5) drops.push(makeInstance(ARMOR_CHEST));
  return drops;
}

// ── NG+ chest loot pools ─────────────────────────────────────────────────────
function ngwById(id: string): GearItemDef {
  return CHEST_WEAPON_ITEMS.find((w) => w.id === id)!;
}
function ngaById(id: string): GearItemDef {
  return ARMOR_ITEMS.find((a) => a.id === id)!;
}

export const NG_GOLD_POOL: ChestLootEntry[] = [
  { item: ngaById("vollys-chestplate"), weight: 80 },
  { item: ngwById("saber-of-iowa"), weight: 15 },
  { item: ngwById("cmilk-katana"), weight: 5 },
];

export const NG_OBSIDIAN_POOL: ChestLootEntry[] = [
  { item: ngaById("divine-armor"), weight: 70 },
  { item: ngwById("divine-daggers"), weight: 27 },
  { item: ngwById("void-rapier"), weight: 2.75 },
  { item: ngwById("wand-67"), weight: 0.25 },
];

export function rollNgPlusChestDrop(chestId: string): GearItemDef | null {
  const pool = chestId === "gold-chest" ? NG_GOLD_POOL : chestId === "obsidian-chest" ? NG_OBSIDIAN_POOL : null;
  if (!pool) return null;
  const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return pool[pool.length - 1].item;
}

export function rollNgPlusBossChest(): GearItemInstance {
  const chest = Math.random() < 0.95 ? NG_CHEST_ITEMS[0] : NG_CHEST_ITEMS[1];
  return makeInstance(chest);
}
