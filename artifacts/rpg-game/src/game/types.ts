export type CharacterClass =
  | "freshie"
  | "bulking-freshman"
  | "girl-freshman"
  | "barretts-type"
  | "sixty-seven-freshman"
  | "doomscroller-freshman";

export type CharacterAbility =
  | "heal-per-choice"
  | "double-damage"
  | "negate-damage-chance"
  | "barrett-damage-multiplier"
  | "random-insta-kill"
  | "doomscroller";

export interface CharacterClassDef {
  id: CharacterClass;
  name: string;
  description: string;
  maxHp: number;
  bonus: string;
  emoji: string;
  ability: CharacterAbility;
}

export type ChoiceOutcome = {
  text: string;
  playerDamage: number;
  enemyDamage: number;
  healAmount: number;
  narrative: string;
};

export type ItemTarget = "any" | "mob-only" | "non-barrett" | "barrett-only";

export interface GearItemDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  damage: number;
  healAmount?: number;
  target: ItemTarget;
  isFromBoss: boolean;
  dropChance: number;
  stackable?: boolean;
  isChest?: boolean;
  isWeapon?: boolean;
  isArmor?: boolean;
  hpBonus?: number;
  scalesWithZone?: boolean;
  barrettMultiplier?: number;
  rarityColor?: string;
}

export interface GearItemInstance {
  instanceId: string;
  def: GearItemDef;
}

export interface Encounter {
  id: string;
  enemyName: string;
  enemyMaxHp: number;
  enemyEmoji: string;
  isBoss: boolean;
  rounds: EncounterRound[];
  victoryText: string;
  defeatText: string;
}

export interface EncounterRound {
  question: string;
  situation: string;
  choices: ChoiceOutcome[];
}

export type GamePhase =
  | "title"
  | "main-menu"
  | "raid-select"
  | "character-select"
  | "intro"
  | "encounter"
  | "victory"
  | "raid-complete"
  | "game-over";

export interface GameState {
  phase: GamePhase;
  selectedClass: CharacterClassDef | null;
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  zoneIndex: number;
  encounterIndex: number;
  roundIndex: number;
  lastOutcome: ChoiceOutcome | null;
  showOutcome: boolean;
  defeatedBosses: string[];
  inventory: GearItemInstance[];
  pendingDrops: GearItemInstance[];
  abilityMessage: string | null;
  itemActionMessage: string | null;
  barrettDefeated: boolean;
  completedRaids: string[];
  mobsDefeated: number;
  achievements: string[];
  unclaimedAchievements: string[];
  equippedItemId: string | null;
  equippedArmorId: string | null;
  defeatedByName: string | null;
  activeRaidId: string | null;
  doomscrollerUnlocked: boolean;
}
