import type { CharacterClassDef } from "./types";

export const CHARACTER_CLASSES: CharacterClassDef[] = [
  {
    id: "freshie",
    name: "Freshie",
    description:
      "Wide-eyed and eager, you entered high school with a smile. Every experience, good or bad, makes you stronger.",
    maxHp: 150,
    bonus: "Heals +5 HP on every answer choice made (cannot exceed 150 HP)",
    emoji: "🌟",
    ability: "heal-per-choice",
  },
  {
    id: "bulking-freshman",
    name: "Bulking Freshman",
    description:
      "You started your gains program in 8th grade. You show up to every encounter jacked, caffeinated, and dangerous.",
    maxHp: 200,
    bonus: "Deals x1.5 damage on every answer choice. 10% chance to take double damage from an enemy.",
    emoji: "💪",
    ability: "double-damage",
  },
  {
    id: "girl-freshman",
    name: "Girl Freshman",
    description:
      "Underestimated. Unbothered. You have an uncanny ability to simply not get hurt when everyone expects you to.",
    maxHp: 100,
    bonus: "25% chance to negate ALL damage taken from any choice",
    emoji: "💅",
    ability: "negate-damage-chance",
  },
  {
    id: "barretts-type",
    name: "Barrett's Type",
    description:
      "Something about you catches Barrett Luke Hutchins completely off guard. He simply cannot win against you.",
    maxHp: 200,
    bonus: "Deals x1.75 damage to Barrett Luke Hutchins on any choice selected against him",
    emoji: "👑",
    ability: "barrett-damage-multiplier",
  },
  {
    id: "sixty-seven-freshman",
    name: "67 Freshman",
    description:
      "You operate on a completely different plane of existence. Occasionally, you simply end things immediately.",
    maxHp: 67,
    bonus: "6.7% chance to instantly defeat any enemy on any choice selected",
    emoji: "🎲",
    ability: "random-insta-kill",
  },
  {
    id: "doomscroller-freshman",
    name: "Doomscroller Freshman",
    description:
      "Phone in hand, eyes glazed, mind running at full speed. You've consumed enough content to bend reality slightly in your favor.",
    maxHp: 125,
    bonus: "Deals x1.1 damage on every choice. 15% chance to loot a chest after defeating any enemy.",
    emoji: "📲",
    ability: "doomscroller",
  },
  {
    id: "hidden",
    name: "???",
    description: "This class is locked.",
    maxHp: 0,
    bonus: "???",
    emoji: "🔒",
    ability: "hidden-ability",
  },
];
