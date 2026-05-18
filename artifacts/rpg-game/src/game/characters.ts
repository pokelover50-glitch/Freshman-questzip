import type { CharacterClassDef } from "./types";

export const CHARACTER_CLASSES: CharacterClassDef[] = [
  {
    id: "bookworm",
    name: "The Bookworm",
    description:
      "Armed with knowledge and a fully-loaded backpack, you answer every question with academic precision.",
    maxHp: 110,
    bonus: "+15 enemy damage on trivia/academic answers",
    emoji: "📚",
  },
  {
    id: "jock",
    name: "The Jock",
    description:
      "Built different. You show up to every encounter with pure confidence and a varsity letter.",
    maxHp: 150,
    bonus: "Starts with the most HP of any class",
    emoji: "🏈",
  },
  {
    id: "artist",
    name: "The Artist",
    description:
      "Unpredictable and expressive — your weird energy confuses enemies and opens unique escape routes.",
    maxHp: 95,
    bonus: "Unique 'creative' answer options that sometimes dodge damage entirely",
    emoji: "🎨",
  },
  {
    id: "tech-nerd",
    name: "The Tech Nerd",
    description:
      "Logic is your weapon. You analyze every situation before choosing your move.",
    maxHp: 105,
    bonus: "Can see enemy's current HP during encounters",
    emoji: "💻",
  },
  {
    id: "social-butterfly",
    name: "The Social Butterfly",
    description:
      "You know everyone and everyone knows you. Charm, gossip, and social leverage are your specialties.",
    maxHp: 100,
    bonus: "+10 enemy damage on social/charm answers",
    emoji: "🦋",
  },
];
