export type CharacterClass =
  | "bookworm"
  | "jock"
  | "artist"
  | "tech-nerd"
  | "social-butterfly";

export interface CharacterClassDef {
  id: CharacterClass;
  name: string;
  description: string;
  maxHp: number;
  bonus: string;
  emoji: string;
}

export type ChoiceOutcome = {
  text: string;
  playerDamage: number;
  enemyDamage: number;
  healAmount: number;
  narrative: string;
};

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
  | "character-select"
  | "intro"
  | "encounter"
  | "victory"
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
}
