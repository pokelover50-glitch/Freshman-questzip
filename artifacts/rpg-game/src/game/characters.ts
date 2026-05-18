import type { CharacterClassDef } from "./types";

export const CHARACTER_CLASSES: CharacterClassDef[] = [
  {
    id: "freshie",
    name: "Freshie",
    description:
      "Wide-eyed and eager, you entered high school with a smile. Every experience, good or bad, makes you stronger.",
    maxHp: 150,
    bonus: "Heals +5 HP on every answer choice made",
    emoji: "🌟",
    ability: "heal-per-choice",
  },
  {
    id: "bulking-freshman",
    name: "Bulking Freshman",
    description:
      "You started your gains program in 8th grade. You show up to every encounter jacked, caffeinated, and dangerous.",
    maxHp: 250,
    bonus: "Deals x2 damage on every answer choice",
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
    maxHp: 300,
    bonus: "100% guaranteed to defeat Barrett Luke Hutchins on any choice selected against him",
    emoji: "👑",
    ability: "insta-kill-barrett",
  },
  {
    id: "sixty-seven-freshman",
    name: "67 Freshman",
    description:
      "You operate on a completely different plane of existence. 67% of the time, you simply end things immediately.",
    maxHp: 67,
    bonus: "67% chance to instantly defeat any enemy on any choice selected",
    emoji: "🎲",
    ability: "random-insta-kill",
  },
];
