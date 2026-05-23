const BAD_WORDS = [
  "fuck","shit","ass","bitch","cunt","dick","cock","pussy","nigger","nigga","faggot","fag",
  "retard","whore","slut","bastard","piss","crap","damn","hell","twat","wank","bollocks",
  "arse","bugger","shag","bloke","tosser","prick","spastic","dyke","tranny","kike","spic",
  "chink","gook","wetback","cracker","honky","nazi","hitler","rape","rapist","pedophile",
  "pedo","molest","murder","kill","suicide","terror","isis","jihad","porn","sex","penis",
  "vagina","boob","breast","nude","naked","masturbat","jerkoff","cumshot","blowjob","handjob",
  "deepthroat","anal","dildo","vibrator","orgasm","ejaculat","erect","boner","hardon",
];

const LEET: Record<string, string> = {
  "4": "a", "@": "a", "3": "e", "1": "i", "!": "i", "0": "o", "5": "s", "$": "s", "7": "t",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .split("")
    .map((c) => LEET[c] ?? c)
    .join("")
    .replace(/[^a-z]/g, "");
}

export function containsProfanity(input: string): boolean {
  const norm = normalize(input);
  return BAD_WORDS.some((word) => norm.includes(word));
}

export function validateUsername(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 24) return "Name must be 24 characters or fewer.";
  if (!/^[a-zA-Z0-9 _\-\.]+$/.test(trimmed)) return "Only letters, numbers, spaces, _ - . allowed.";
  if (containsProfanity(trimmed)) return "That name isn't allowed. Please choose another.";
  return null;
}
