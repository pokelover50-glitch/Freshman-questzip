import type { Encounter } from "./types";

const MOB_ENCOUNTERS: Encounter[] = [
  {
    id: "seventh-grader",
    enemyName: "7th Grader",
    enemyMaxHp: 25,
    enemyEmoji: "😤",
    isBoss: false,
    victoryText: "They shuffle off muttering 'whatever' under their breath. Victory!",
    defeatText: "A 7th grader just body-slammed your confidence into the floor.",
    rounds: [
      {
        situation:
          'A confident 7th grader struts up, trying to act like they own the hallway. "You think you\'re so cool just because you\'re in HIGH SCHOOL?" they sneer, crossing their arms.',
        question: "How do you respond?",
        choices: [
          {
            text: '"Actually, yes. Now go find your bus."',
            playerDamage: 3, enemyDamage: 15, healAmount: 0,
            narrative: "The burn is so savage they actually take a step backward. Their confidence crumbles.",
          },
          {
            text: "Show them your class schedule",
            playerDamage: 3, enemyDamage: 10, healAmount: 0,
            narrative: "Proof is proof. They stare at AP Biology on your schedule and go quiet.",
          },
          {
            text: "Try to be nice and make friends",
            playerDamage: 8, enemyDamage: 0, healAmount: 0,
            narrative: "They take your friendliness as weakness and step on your shoe. Hard.",
          },
          {
            text: "Pretend you don't hear them and walk away",
            playerDamage: 12, enemyDamage: 0, healAmount: 0,
            narrative: "They run after you and trip you in front of everyone. Embarrassing.",
          },
          {
            text: '"Do you need directions back to middle school?"',
            playerDamage: 3, enemyDamage: 12, healAmount: 0,
            narrative: "Perfectly condescending. They sputter and can't form a comeback.",
          },
          {
            text: "Challenge them to a staring contest",
            playerDamage: 5, enemyDamage: 8, healAmount: 0,
            narrative: "Weird but effective. They blink first. You win on a technicality.",
          },
          {
            text: "Show them your locker combination like a flex",
            playerDamage: 3, enemyDamage: 11, healAmount: 0,
            narrative: "Somehow having a locker intimidates them. Middle schoolers are easy.",
          },
          {
            text: "Start talking loudly about your homework",
            playerDamage: 10, enemyDamage: 0, healAmount: 0,
            narrative: "They think you're weird and somehow win by default.",
          },
        ],
      },
    ],
  },
  {
    id: "eighth-grader",
    enemyName: "8th Grader",
    enemyMaxHp: 30,
    enemyEmoji: "🙄",
    isBoss: false,
    victoryText: "They slink back to middle school where they belong. Nice.",
    defeatText: "An 8th grader made you look foolish. You'll never live this down.",
    rounds: [
      {
        situation:
          'An 8th grader on a field trip blocks your path and challenges you: "I heard freshmen can\'t even do basic algebra. Prove me wrong — what\'s 2x + 5 = 15?"',
        question: "What's your move?",
        choices: [
          {
            text: '"x = 5. Obviously."',
            playerDamage: 3, enemyDamage: 18, healAmount: 0,
            narrative: "You answer instantly without breaking stride. Intellectual domination achieved.",
          },
          {
            text: "Pull out your graphing calculator",
            playerDamage: 3, enemyDamage: 10, healAmount: 0,
            narrative: "You get the right answer — they just weren't expecting the TI-84.",
          },
          {
            text: "Make up a random number confidently",
            playerDamage: 12, enemyDamage: 0, healAmount: 0,
            narrative: "Wrong. They laugh so hard it physically hurts your ego.",
          },
          {
            text: '"Math is for nerds anyway"',
            playerDamage: 6, enemyDamage: 6, healAmount: 0,
            narrative: "Mutual embarrassment. Neither of you comes out of this looking good.",
          },
          {
            text: "Walk away mid-question",
            playerDamage: 3, enemyDamage: 14, healAmount: 0,
            narrative: "Your complete indifference destroys them more than any answer could.",
          },
          {
            text: '"I learned this in 6th grade, come back when you\'re ready."',
            playerDamage: 3, enemyDamage: 16, healAmount: 0,
            narrative: "The condescension is immaculate. They have no rebuttal.",
          },
          {
            text: "Pretend to have a phone call and walk away",
            playerDamage: 9, enemyDamage: 0, healAmount: 0,
            narrative: "They know your phone didn't ring. Everyone knows. You lose credibility.",
          },
          {
            text: "Ask them why they're in a high school",
            playerDamage: 3, enemyDamage: 13, healAmount: 0,
            narrative: "Turning it back on them causes immediate existential dread on their end.",
          },
        ],
      },
    ],
  },
  {
    id: "fellow-freshman",
    enemyName: "Fellow Freshman",
    enemyMaxHp: 30,
    enemyEmoji: "😠",
    isBoss: false,
    victoryText: "They back off and you establish yourself as the alpha freshman. Respect.",
    defeatText: "Losing to a fellow freshman hurts differently. Your schedule falls out of your binder.",
    rounds: [
      {
        situation:
          'Another freshman squares up in front of your locker, eyes burning with rage. "I HEARD you talked to my crush. In the LIBRARY. This means WAR."',
        question: "How do you handle this?",
        choices: [
          {
            text: '"I was asking them where the fiction section was."',
            playerDamage: 3, enemyDamage: 12, healAmount: 0,
            narrative: "Completely reasonable. They deflate immediately. Hard to argue with that.",
          },
          {
            text: '"They came to talk to ME first, actually."',
            playerDamage: 3, enemyDamage: 22, healAmount: 0,
            narrative: "POWER MOVE. They reel backward like they've been slapped by the truth.",
          },
          {
            text: "Apologize profusely",
            playerDamage: 14, enemyDamage: 0, healAmount: 0,
            narrative: "They see the apology as guilt. You lose all social credibility.",
          },
          {
            text: "Challenge them to a dance-off",
            playerDamage: 7, enemyDamage: 7, healAmount: 0,
            narrative: "It gets extremely weird. Everyone watches. Nobody wins emotionally.",
          },
          {
            text: '"Your crush and I are just study partners."',
            playerDamage: 3, enemyDamage: 15, healAmount: 0,
            narrative: "Diplomatic and plausible. They can't argue with the study angle.",
          },
          {
            text: "Point out they spelled 'library' wrong in their angry note",
            playerDamage: 3, enemyDamage: 18, healAmount: 0,
            narrative: "Devastating grammar check. They're too embarrassed to continue.",
          },
          {
            text: "Offer them a peace sandwich",
            playerDamage: 3, enemyDamage: 10, healAmount: 0,
            narrative: "Somehow the food works. Anger is hard to maintain when someone's being nice and weird simultaneously.",
          },
          {
            text: "Pretend you have no idea who they're talking about",
            playerDamage: 11, enemyDamage: 0, healAmount: 0,
            narrative: "Too obvious a lie. They see straight through it and double their fury.",
          },
        ],
      },
    ],
  },
  {
    id: "sophomore",
    enemyName: "Sophomore",
    enemyMaxHp: 35,
    enemyEmoji: "😏",
    isBoss: false,
    victoryText: "The Sophomore clears the hall. You walk through like you own the place.",
    defeatText: "The Sophomore's hallway dominance crushes your freshman spirit.",
    rounds: [
      {
        situation:
          'A Sophomore plants both feet in the middle of the hallway. "Freshmen use the SIDE entrance. These are OUR halls. Always have been."',
        question: "Do you comply or fight back?",
        choices: [
          {
            text: '"Actually, the school handbook says all students share hallways equally."',
            playerDamage: 3, enemyDamage: 18, healAmount: 0,
            narrative: "You cite a real rule. They have absolutely no comeback. The handbook wins.",
          },
          {
            text: "Push past them confidently",
            playerDamage: 8, enemyDamage: 12, healAmount: 0,
            narrative: "Risky move. You get through but they clip your shoulder on the way.",
          },
          {
            text: "Turn around and use the other door",
            playerDamage: 18, enemyDamage: 0, healAmount: 0,
            narrative: "Complete submission. They announce it to the hallway.",
          },
          {
            text: "Fake an intense coughing fit",
            playerDamage: 3, enemyDamage: 8, healAmount: 0,
            narrative: "They back away from you like you have the plague. Corridor cleared.",
          },
          {
            text: "Pull out a campus map and point to this hallway",
            playerDamage: 3, enemyDamage: 14, healAmount: 0,
            narrative: "Cartographic evidence is hard to dispute. They begrudgingly move.",
          },
          {
            text: "Walk slowly and deliberately through anyway",
            playerDamage: 3, enemyDamage: 16, healAmount: 0,
            narrative: "Quiet confidence. They expected you to flinch. You didn't. Power shift.",
          },
          {
            text: "Ask them which way the principal's office is",
            playerDamage: 3, enemyDamage: 12, healAmount: 0,
            narrative: "The implied threat of administration sends them scattering instantly.",
          },
          {
            text: "Stand your ground and say nothing",
            playerDamage: 13, enemyDamage: 0, healAmount: 0,
            narrative: "A staring contest you weren't prepared for. They win on sheer experience.",
          },
        ],
      },
    ],
  },
  {
    id: "junior",
    enemyName: "Junior",
    enemyMaxHp: 40,
    enemyEmoji: "😒",
    isBoss: false,
    victoryText: "The Junior mumbles 'not bad for a freshman' and walks off. You'll take it.",
    defeatText: "The Junior absolutely dismantled your freshman confidence. Rough day.",
    rounds: [
      {
        situation:
          'A Junior spots your AP schedule and scoffs. "AP classes? As a FRESHMAN? Let me guess — you think you\'re better than everyone?"',
        question: "What do you say?",
        choices: [
          {
            text: '"I\'m just doing my best."',
            playerDamage: 3, enemyDamage: 12, healAmount: 0,
            narrative: "Humble but confident. They weren't expecting that combo and it disarms them.",
          },
          {
            text: '"My GPA says yes."',
            playerDamage: 3, enemyDamage: 25, healAmount: 0,
            narrative: "LEGENDARY confidence. They stare at you for a full 3 seconds before walking away.",
          },
          {
            text: '"Maybe I was wrong to sign up for them..."',
            playerDamage: 18, enemyDamage: 0, healAmount: 0,
            narrative: "You spiral into self-doubt RIGHT IN THE HALLWAY. Painful to watch.",
          },
          {
            text: "Ask them for advice about AP classes",
            playerDamage: 3, enemyDamage: 5, healAmount: 8,
            narrative: "Unexpected play. They actually share some useful tips. You gain unexpected wisdom.",
          },
          {
            text: '"Didn\'t you take AP Bio three times?"',
            playerDamage: 3, enemyDamage: 20, healAmount: 0,
            narrative: "The rumor was true and they know it. Complete meltdown on their end.",
          },
          {
            text: "Show them your test grade",
            playerDamage: 3, enemyDamage: 18, healAmount: 0,
            narrative: "The A+ does the talking. They walk away without another word.",
          },
          {
            text: "Shrug and say nothing",
            playerDamage: 10, enemyDamage: 0, healAmount: 0,
            narrative: "They take the silence as weakness and press harder. Bad call.",
          },
          {
            text: '"I heard YOU dropped out of AP last semester."',
            playerDamage: 3, enemyDamage: 22, healAmount: 0,
            narrative: "The receipts are out. They have no defense. Critical information hit.",
          },
        ],
      },
    ],
  },
];

const BOSS_1: Encounter = {
  id: "boss-bradley",
  enemyName: '"Senior" Bradley',
  enemyMaxHp: 150,
  enemyEmoji: "👨‍🎓",
  isBoss: true,
  victoryText:
    "Bradley stares at you in disbelief, his varsity jacket doing nothing for him now. \"Not bad... freshman.\" He walks away. You stand victorious in the hallway.",
  defeatText:
    "Bradley shakes his head. 'Come back when you've actually lived, rookie.' You've been defeated by a Senior.",
  rounds: [
    {
      situation:
        "Bradley leans against the locker with the energy of someone who's done this three times before. His varsity jacket has THREE years' worth of patches on it. He looks you up and down like you're a lost tourist. \"Oh look. Another baby fresh out of middle school. You lost, little one?\"",
      question: "Bradley demands: 'So what are your big plans, little freshman?'",
      choices: [
        {
          text: '"I\'m still figuring it out."',
          playerDamage: 20, enemyDamage: 0, healAmount: 0,
          narrative: "Bradley laughs so hard his patches jingle. Wrong answer in front of a Senior.",
        },
        {
          text: '"I\'m applying to Harvard, MIT, and Stanford — haven\'t decided yet."',
          playerDamage: 7, enemyDamage: 30, healAmount: 0,
          narrative: "The sheer audacity of this answer rocks Bradley to his core. He loses 30 HP of confidence.",
        },
        {
          text: '"I want to be just like you in 3 years."',
          playerDamage: 15, enemyDamage: 0, healAmount: 0,
          narrative: "Bradley is flattered and uses it as an opportunity to lecture you for 10 minutes.",
        },
        {
          text: '"None of your business, old man."',
          playerDamage: 12, enemyDamage: 20, healAmount: 0,
          narrative: "Risky. He's shocked enough to take damage, but he retaliates hard.",
        },
        {
          text: '"Bigger things than this hallway."',
          playerDamage: 7, enemyDamage: 25, healAmount: 0,
          narrative: "Vague but devastating. Bradley can't argue with pure ambition.",
        },
        {
          text: '"Ask me again at graduation."',
          playerDamage: 7, enemyDamage: 28, healAmount: 0,
          narrative: "The confidence of scheduling a callback floors him. He takes the hit.",
        },
      ],
    },
    {
      situation:
        "Bradley cracks his knuckles. 'Round 2, rookie. Let's see how much you actually know about this school.'",
      question: "Bradley quizzes you: 'What year did our school's football team last win State?'",
      choices: [
        {
          text: '"I don\'t follow football."',
          playerDamage: 22, enemyDamage: 0, healAmount: 0,
          narrative: "Unacceptable answer in this hallway. Bradley is personally offended.",
        },
        {
          text: "Name a year with total confidence",
          playerDamage: 7, enemyDamage: 25, healAmount: 0,
          narrative: "Right or wrong doesn't matter — confidence is everything. Bradley blinks.",
        },
        {
          text: "Pull out your phone to look it up",
          playerDamage: 18, enemyDamage: 0, healAmount: 0,
          narrative: "Bradley reports you for phone use. A teacher confiscates it. Double loss.",
        },
        {
          text: '"Same year you peaked at everything — which was never, apparently."',
          playerDamage: 15, enemyDamage: 35, healAmount: 0,
          narrative: "DEVASTATING. Bradley physically staggers. The hallway goes quiet. This might be the greatest burn in school history.",
        },
        {
          text: '"Does it matter? They\'ll win again someday."',
          playerDamage: 7, enemyDamage: 20, healAmount: 0,
          narrative: "Pivoting to optimism catches Bradley off guard. He respects it slightly.",
        },
        {
          text: "Challenge HIM to name the starting lineup instead",
          playerDamage: 7, enemyDamage: 22, healAmount: 0,
          narrative: "Turning the quiz back on him exposes that he doesn't actually know either.",
        },
      ],
    },
    {
      situation:
        "Bradley narrows his eyes. You've survived this long. He's going for the kill.",
      question: "Bradley announces to everyone in the hall that you're a lost 8th grader. How do you respond?",
      choices: [
        {
          text: "Pull out your student ID",
          playerDamage: 7, enemyDamage: 25, healAmount: 0,
          narrative: "Evidence is irrefutable. Bradley's lie collapses in real time. People laugh at HIM now.",
        },
        {
          text: "Ignore him completely",
          playerDamage: 7, enemyDamage: 30, healAmount: 0,
          narrative: "Being completely unbothered is the ultimate power move. Bradley can't handle it.",
        },
        {
          text: "Cry a little bit",
          playerDamage: 35, enemyDamage: 0, healAmount: 0,
          narrative: "This seals your fate as a freshman legend. Tragically.",
        },
        {
          text: "Tell a teacher",
          playerDamage: 8, enemyDamage: 18, healAmount: 0,
          narrative: "Technically effective. Socially costly. Bradley gets a warning, you get a reputation.",
        },
        {
          text: "Start talking to everyone around YOU like Bradley doesn't exist",
          playerDamage: 7, enemyDamage: 28, healAmount: 0,
          narrative: "Total social erasure. Bradley is left monologuing to no one. Crowd shifts to your side.",
        },
        {
          text: '"Cool story. Anyway..."',
          playerDamage: 7, enemyDamage: 22, healAmount: 0,
          narrative: "The dismissal is surgical. Bradley sputters. He's used to reactions, not indifference.",
        },
      ],
    },
  ],
};

const BOSS_2: Encounter = {
  id: "boss-westen",
  enemyName: '"Super Senior" Westen',
  enemyMaxHp: 250,
  enemyEmoji: "🧔",
  isBoss: true,
  victoryText:
    "Westen slow-claps in genuine disbelief. 'Five years I've been at this school and a FRESHMAN just beat me.' He disappears into the cafeteria. You're halfway there.",
  defeatText:
    "Westen has been here 5 years. He's seen it all. You never stood a chance.",
  rounds: [
    {
      situation:
        "Westen sits at the corner cafeteria table — a table he's claimed for five years. He has a meal plan that technically expired last semester, but nobody's told him that. He watches you carry your tray with the energy of a man who owns this cafeteria. \"New blood. Sit down. We need to talk.\"",
      question: "Westen leans forward: 'I've been watching you, kid. What makes you think you belong here?'",
      choices: [
        {
          text: '"I\'m enrolled. That\'s literally all it takes."',
          playerDamage: 10, enemyDamage: 28, healAmount: 0,
          narrative: "Inarguably correct. Westen has no legal counter. He takes a sip of his soda in defeat.",
        },
        {
          text: '"I\'ve already survived three hallway encounters."',
          playerDamage: 10, enemyDamage: 20, healAmount: 0,
          narrative: "Battle-tested credibility. Westen squints. He respects this. Sort of.",
        },
        {
          text: '"I... don\'t know. Do I?"',
          playerDamage: 25, enemyDamage: 0, healAmount: 0,
          narrative: "Existential crisis triggered. Westen smiles smugly. He loves breaking down freshmen.",
        },
        {
          text: "Sit down uninvited and steal a fry",
          playerDamage: 10, enemyDamage: 15, healAmount: 0,
          narrative: "BOLD. He's offended, but he genuinely respects the audacity. Mixed results.",
        },
        {
          text: '"Because I beat Bradley. Ask him."',
          playerDamage: 10, enemyDamage: 22, healAmount: 0,
          narrative: "Name-dropping the defeat of his predecessor shakes Westen's confidence visibly.",
        },
        {
          text: '"Same reason you did. I just got here faster."',
          playerDamage: 10, enemyDamage: 25, healAmount: 0,
          narrative: "Implied superiority without the ego. Westen doesn't know how to process this.",
        },
      ],
    },
    {
      situation:
        "Westen stands up. He's taller than you expected. 'Round 2. Let's see what you've got.'",
      question: "Westen challenges you to identify which lunch item is secretly the worst choice in the cafeteria.",
      choices: [
        {
          text: '"The mystery meat. Always the mystery meat."',
          playerDamage: 10, enemyDamage: 30, healAmount: 0,
          narrative: "Institutional knowledge. Westen nods slowly. 'Five years have taught you well,' he says, and takes damage.",
        },
        {
          text: '"The salad. It\'s always wilted."',
          playerDamage: 10, enemyDamage: 20, healAmount: 0,
          narrative: "Also correct. Westen accepts this as a reasonable answer. Solid hit.",
        },
        {
          text: '"The pizza looks fine to me."',
          playerDamage: 28, enemyDamage: 0, healAmount: 0,
          narrative: "Rookie mistake. The pizza here has been wrong since 2019. Westen pities you.",
        },
        {
          text: "Flip your tray over dramatically",
          playerDamage: 10, enemyDamage: 25, healAmount: 0,
          narrative: "Chaotic answer. Westen genuinely didn't see it coming. Points for originality.",
        },
        {
          text: '"The chocolate milk. It expired two weeks ago."',
          playerDamage: 10, enemyDamage: 22, healAmount: 0,
          narrative: "Inside knowledge from a reliable source. Westen is genuinely unsettled you know this.",
        },
        {
          text: "Order everything and rate it all live",
          playerDamage: 15, enemyDamage: 10, healAmount: 0,
          narrative: "Takes too long. Westen gets bored and irritated waiting. But the reviews were thorough.",
        },
      ],
    },
    {
      situation:
        "Westen cracks his neck. He's been here long enough to know every weakness.",
      question: "Westen reveals he knows your home address from the school directory. 'How does THAT feel?'",
      choices: [
        {
          text: '"That information is two years old, I moved."',
          playerDamage: 10, enemyDamage: 35, healAmount: 0,
          narrative: "The counter-intel destroys him. He had nothing to work with and now he knows it.",
        },
        {
          text: '"Cool. Why do you know that?"',
          playerDamage: 10, enemyDamage: 28, healAmount: 0,
          narrative: "Turning it back on him makes HIM look weird. Brilliant defensive move.",
        },
        {
          text: "Panic visibly",
          playerDamage: 32, enemyDamage: 0, healAmount: 0,
          narrative: "He feeds on this. Westen spent 5 years learning how to do exactly this.",
        },
        {
          text: "Tell him your address has always been the school building",
          playerDamage: 10, enemyDamage: 22, healAmount: 5,
          narrative: "A joke so absurd it confuses and delights everyone at the table. Even Westen smiles.",
        },
        {
          text: '"You stalked me. I\'m calling the counselor."',
          playerDamage: 10, enemyDamage: 30, healAmount: 0,
          narrative: "The legal threat causes immediate panic. Westen did NOT think this through.",
        },
        {
          text: '"That\'s cute. I know YOUR schedule by heart."',
          playerDamage: 10, enemyDamage: 26, healAmount: 0,
          narrative: "Flipping the surveillance back on him is unsettling at a deep level. He falters.",
        },
      ],
    },
  ],
};

const BOSS_FINAL: Encounter = {
  id: "boss-barrett",
  enemyName: "Barrett Luke Hutchins",
  enemyMaxHp: 500,
  enemyEmoji: "👑",
  isBoss: true,
  victoryText:
    "Barrett Luke Hutchins stares at you for a long, silent moment. Then — slowly — he begins to clap. One clap. Two claps. The cafeteria erupts. You have defeated the final boss. You are no longer just a freshman. You are LEGEND.",
  defeatText:
    "Barrett Luke Hutchins shakes his head. 'You weren't ready.' He walks away. The legend lives on — but not because of you.",
  rounds: [
    {
      situation:
        "The hall falls silent. Barrett Luke Hutchins stands at the far end of the Senior Lounge — a room that technically isn't supposed to exist, yet here it is. He's wearing a custom jacket with his name embroidered on it. He's been the undisputed ruler of this school for four years. He doesn't move. He just waits for you to approach.",
      question: "Barrett Luke Hutchins speaks first: 'Why are you here, freshman?'",
      choices: [
        {
          text: '"Because someone had to be."',
          playerDamage: 12, enemyDamage: 35, healAmount: 0,
          narrative: "The quiet confidence of this answer reverberates through the room. Barrett raises an eyebrow. He feels this one.",
        },
        {
          text: '"I\'ve defeated Bradley. I\'ve defeated Westen. You\'re next."',
          playerDamage: 12, enemyDamage: 25, healAmount: 5,
          narrative: "Listing your victories gives you strength. Barrett shifts his weight — for the first time in four years.",
        },
        {
          text: '"I got lost trying to find the gym."',
          playerDamage: 30, enemyDamage: 0, healAmount: 0,
          narrative: "He laughs for exactly 3 seconds, then demolishes you for wasting his time.",
        },
        {
          text: "Stare back in silence",
          playerDamage: 12, enemyDamage: 30, healAmount: 0,
          narrative: "A silent standoff. You both lose something, but Barrett loses more — he expected fear.",
        },
        {
          text: '"To end the reign."',
          playerDamage: 12, enemyDamage: 32, healAmount: 0,
          narrative: "Clinical. Final. Barrett's expression flickers for a half-second. That's new.",
        },
        {
          text: '"I was sent by everyone you ever made feel small."',
          playerDamage: 12, enemyDamage: 38, healAmount: 0,
          narrative: "The weight of this answer lands like a boulder. Barrett goes very still.",
        },
      ],
    },
    {
      situation:
        "Barrett circles you slowly. He's been watching you since Zone 1. He knows everything.",
      question: "Barrett says: 'I heard what you did to Bradley. Tell me — was it worth it?'",
      choices: [
        {
          text: '"Every single second."',
          playerDamage: 12, enemyDamage: 40, healAmount: 0,
          narrative: "NO HESITATION. Barrett absorbs this like a punch to the chest. He respects it, and it destroys him.",
        },
        {
          text: '"Bradley needed a reality check."',
          playerDamage: 12, enemyDamage: 30, healAmount: 0,
          narrative: "Measured and confident. Barrett nods slowly. He agrees, though he'd never say it.",
        },
        {
          text: '"I\'m not sure I should have..."',
          playerDamage: 35, enemyDamage: 0, healAmount: 0,
          narrative: "Doubt is a weapon Barrett knows how to use. He twists it in deep.",
        },
        {
          text: '"I feel like YOU sent Bradley after me."',
          playerDamage: 12, enemyDamage: 38, healAmount: 0,
          narrative: "THE CONSPIRACY THEORY. Barrett freezes. Because you're right, and he can't believe you figured it out.",
        },
        {
          text: '"It was warm-up. This is the real fight."',
          playerDamage: 12, enemyDamage: 35, healAmount: 0,
          narrative: "Framing Bradley as a warm-up act makes Barrett genuinely reassess you. A beat of silence.",
        },
        {
          text: '"Ask Westen. He saw the whole thing."',
          playerDamage: 12, enemyDamage: 28, healAmount: 0,
          narrative: "Invoking your other victory stacks the evidence. Barrett can't dismiss two defeats in a row.",
        },
      ],
    },
    {
      situation:
        "Barrett stands before you, for the first time in four years, genuinely challenged. This is the final moment.",
      question: "Barrett's last move: 'Tell me, freshman — what are you going to do when high school is over?'",
      choices: [
        {
          text: '"Exactly what I want."',
          playerDamage: 12, enemyDamage: 45, healAmount: 0,
          narrative: "Simple. Certain. Devastating. This answer breaks through every wall Barrett has built. He has no response.",
        },
        {
          text: '"Leave this school behind and never look back."',
          playerDamage: 12, enemyDamage: 40, healAmount: 5,
          narrative: "The forward momentum of this hits Barrett like a freight train. He built his identity here. You're already past it.",
        },
        {
          text: '"I don\'t know... what did YOU do?"',
          playerDamage: 40, enemyDamage: 0, healAmount: 0,
          narrative: "Risky question with a devastating answer. Barrett smiles slowly. He's still here. That's the answer.",
        },
        {
          text: '"Rule this school. Starting today."',
          playerDamage: 15, enemyDamage: 45, healAmount: 0,
          narrative: "The audacity is unparalleled. Barrett takes the hit and stares. 'Maybe you will,' he says quietly. And that costs him everything.",
        },
        {
          text: '"Whatever it takes. Same as I did here."',
          playerDamage: 12, enemyDamage: 42, healAmount: 0,
          narrative: "Using his own framework against him is poetic. Barrett blinks slowly. The student has surpassed the teacher.",
        },
        {
          text: '"Better things than you ever imagined for yourself."',
          playerDamage: 12, enemyDamage: 50, healAmount: 0,
          narrative: "The cruelest compliment possible. Barrett's whole identity wavers. Maximum damage dealt.",
        },
      ],
    },
  ],
};

const ZONE_1_HP = [25, 30, 30, 35, 40];
const ZONE_2_HP = [45, 55, 65, 75, 90];
const ZONE_3_HP = [60, 75, 90, 110, 125];

function scaleMobs(hpValues: number[], exactPlayerDamage: number): Encounter[] {
  return MOB_ENCOUNTERS.map((enc, i) => ({
    ...enc,
    enemyMaxHp: hpValues[i] ?? enc.enemyMaxHp,
    rounds: enc.rounds.map((round) => ({
      ...round,
      choices: round.choices.map((choice) => ({
        ...choice,
        playerDamage: exactPlayerDamage,
      })),
    })),
  }));
}

function scaleBoss(boss: Encounter, exactPlayerDamage: number): Encounter {
  return {
    ...boss,
    rounds: boss.rounds.map((round) => ({
      ...round,
      choices: round.choices.map((choice) => ({
        ...choice,
        playerDamage: exactPlayerDamage,
      })),
    })),
  };
}

export const ZONES: Encounter[][] = [
  [...scaleMobs(ZONE_1_HP, 2), scaleBoss(BOSS_1, 5)],
  [...scaleMobs(ZONE_2_HP, 4), scaleBoss(BOSS_2, 7)],
  [...scaleMobs(ZONE_3_HP, 8), scaleBoss(BOSS_FINAL, 10)],
];

export const ZONE_NAMES = [
  "The Hallways",
  "The Cafeteria",
  "The Senior Lounge",
];

export const ZONE_NAMES_SHORT = [
  "Hallways",
  "Cafeteria",
  "Senior Lounge",
];

export const ACHIEVEMENT_MOB_IDS = new Set([
  "seventh-grader",
  "eighth-grader",
  "fellow-freshman",
  "sophomore",
  "junior",
]);

// ─── RAID ENCOUNTERS ──────────────────────────────────────────────────────────

function raidMob(
  id: string, enemyName: string, enemyEmoji: string, enemyMaxHp: number, mobDmg: number,
  situation: string, question: string,
  choices: { text: string; enemyDamage: number; narrative: string; badChoice?: boolean }[]
): Encounter {
  return {
    id, enemyName, enemyEmoji, enemyMaxHp, isBoss: false,
    victoryText: "They back down. One less obstacle.",
    defeatText: `${enemyName} got the better of you.`,
    rounds: [{
      situation, question,
      choices: choices.map((c) => ({
        text: c.text,
        playerDamage: c.badChoice ? mobDmg * 2 : mobDmg,
        enemyDamage: c.enemyDamage,
        healAmount: 0,
        narrative: c.narrative,
      })),
    }],
  };
}

// ── Hayes Room Mobs ──────────────────────────────────────────────────────────

const RAID_INDIAN_FRESHMAN: Encounter = raidMob(
  "raid-indian-freshman", "Indian Freshman", "🧑‍🎓", 100, 7,
  "An Indian freshman plants themselves in front of the classroom door, arms crossed.",
  "How do you handle this?",
  [
    { text: "Mention your GPA unprompted.", enemyDamage: 18, narrative: "Academic dominance established in three words. They shrink." },
    { text: "Ask which AP classes they're taking.", enemyDamage: 12, narrative: "Puts you on their tier immediately. They're slightly rattled." },
    { text: "Say nothing and walk through.", enemyDamage: 15, narrative: "Silence hits different. They move." },
    { text: "Try to make friends.", enemyDamage: 0, narrative: "They take the warmth as weakness and use it.", badChoice: true },
    { text: "Ask about the homework assignment.", enemyDamage: 10, narrative: "Neutral opener. Subtly puts you on equal footing." },
  ]
);

const RAID_INDIAN_SOPHOMORE: Encounter = raidMob(
  "raid-indian-sophomore", "Indian Sophomore", "🧑‍💻", 110, 7,
  "An Indian sophomore lectures you about how freshmen don't belong in this hall.",
  "Your response?",
  [
    { text: "\"And yet, here I am.\"", enemyDamage: 20, narrative: "Clean and irrefutable. They stammer." },
    { text: "Reference a topic from the class.", enemyDamage: 16, narrative: "Showing you know the material kills their argument instantly." },
    { text: "\"Interesting. Cool story.\"", enemyDamage: 14, narrative: "Weaponized disinterest. They hate it." },
    { text: "Wait for them to finish.", enemyDamage: 10, narrative: "Patience as a weapon. They run out of steam." },
    { text: "Laugh awkwardly.", enemyDamage: 0, narrative: "They take it as confirmation. Bad move.", badChoice: true },
  ]
);

const RAID_INDIAN_JUNIOR: Encounter = raidMob(
  "raid-indian-junior", "Indian Junior", "📚", 120, 7,
  "An Indian junior quizzes you with a question from the syllabus.",
  "What do you do?",
  [
    { text: "Answer correctly without hesitation.", enemyDamage: 22, narrative: "A freshman matching a junior academically is devastating." },
    { text: "Ask a sharper follow-up question.", enemyDamage: 18, narrative: "Flipping the challenge shows you're operating above them." },
    { text: "Quote Mr. Hayes from last class.", enemyDamage: 20, narrative: "You've been paying attention. They clearly haven't. Game over." },
    { text: "Admit you don't know.", enemyDamage: 6, narrative: "Honest but costs you the exchange.", badChoice: true },
  ]
);

const RAID_INDIAN_SENIOR: Encounter = raidMob(
  "raid-indian-senior", "Indian Senior", "🎓", 130, 9,
  "An Indian senior looks down at you like you don't belong anywhere near this classroom.",
  "What do you say?",
  [
    { text: "\"I'm in this class too.\"", enemyDamage: 18, narrative: "Simple and unshakeable. They have no rebuttal." },
    { text: "Stare them down silently.", enemyDamage: 22, narrative: "A freshman staring down a senior breaks their brain." },
    { text: "\"Nice college essay, by the way.\"", enemyDamage: 28, narrative: "The implication that you've read it sends them spiraling." },
    { text: "Drop a precise fact about the curriculum.", enemyDamage: 20, narrative: "Knowledge nullifies their seniority advantage." },
    { text: "Laugh nervously.", enemyDamage: 0, narrative: "Weakness detected. They loom larger.", badChoice: true },
  ]
);

const RAID_JAYDEN: Encounter = raidMob(
  "raid-jayden", "Jayden", "😤", 150, 9,
  "Jayden squares up right outside Mr. Hayes's door like he owns the place.",
  "What do you do?",
  [
    { text: "\"Jayden. Sit down.\"", enemyDamage: 28, narrative: "Teacher-voice. From a freshman. Jayden's soul leaves his body." },
    { text: "Ignore him and walk straight in.", enemyDamage: 22, narrative: "Jayden shouts at your back and looks ridiculous." },
    { text: "Remind him of his last test score.", enemyDamage: 32, narrative: "The receipts are devastating. He goes silent, then red." },
    { text: "Ask if he needs help with the material.", enemyDamage: 18, narrative: "Condescending kindness hits harder than any insult." },
    { text: "Throw your hands up and walk away.", enemyDamage: 0, narrative: "He counts that as a win. Don't do this.", badChoice: true },
  ]
);

const RAID_BOSS_HAYES: Encounter = {
  id: "raid-boss-hayes",
  enemyName: "Captured Mr. Hayes",
  enemyEmoji: "😰",
  enemyMaxHp: 500,
  isBoss: true,
  victoryText: "The real Mr. Hayes is freed. He nods at you with quiet gratitude. You've done it.",
  defeatText: "Mr. Hayes's captor prevails this round. Regroup.",
  rounds: [
    {
      situation: "Mr. Hayes stands bound but composed, testing whether you deserve his trust.",
      question: "\"You — freshman. Prove to me you belong here. What's the first thing you'd change about this school?\"",
      choices: [
        { text: "\"The way teachers get silenced.\"", playerDamage: 12, enemyDamage: 80, healAmount: 0, narrative: "It hits exactly where it should. Mr. Hayes's eyes sharpen with recognition." },
        { text: "\"Nothing — I'd protect what makes it worth fighting for.\"", playerDamage: 12, enemyDamage: 100, healAmount: 0, narrative: "The strongest answer. Mr. Hayes visibly relaxes. The bindings weaken." },
        { text: "\"The people who think they own it.\"", playerDamage: 12, enemyDamage: 90, healAmount: 0, narrative: "Pointed and accurate. Mr. Hayes gives a small nod of approval." },
        { text: "\"More hall passes.\"", playerDamage: 30, enemyDamage: 0, healAmount: 0, narrative: "He expected more. The bindings tighten." },
      ],
    },
    {
      situation: "Mr. Hayes is starting to trust you. But his captor's influence is still strong.",
      question: "\"Tell me — who sent you in here?\"",
      choices: [
        { text: "\"Nobody. I came on my own.\"", playerDamage: 12, enemyDamage: 130, healAmount: 0, narrative: "Autonomous initiative impresses him deeply. The chains loosen." },
        { text: "\"The other students.\"", playerDamage: 12, enemyDamage: 110, healAmount: 0, narrative: "Representing others is noble. He nods, grateful." },
        { text: "\"Mr. Cronin told me about this place.\"", playerDamage: 12, enemyDamage: 120, healAmount: 0, narrative: "A credible reference. Mr. Hayes trusts Cronin. The hold weakens." },
        { text: "\"I was just passing through.\"", playerDamage: 30, enemyDamage: 0, healAmount: 0, narrative: "He doesn't believe you, and neither does anyone watching." },
      ],
    },
    {
      situation: "The final test. One answer will free him completely.",
      question: "\"Last question. What does it mean to be a good student?\"",
      choices: [
        { text: "\"Show up. Ask questions. Give a damn.\"", playerDamage: 12, enemyDamage: 160, healAmount: 0, narrative: "Three words that say everything. The bindings snap. Mr. Hayes is free." },
        { text: "\"Be curious even when it's inconvenient.\"", playerDamage: 12, enemyDamage: 150, healAmount: 0, narrative: "Philosophical and precise. Mr. Hayes breaks free with a determined expression." },
        { text: "\"I don't know, but I'm trying to find out.\"", playerDamage: 12, enemyDamage: 140, healAmount: 5, narrative: "Humble honesty is its own kind of strength. He smiles. The room brightens." },
        { text: "\"Get good grades.\"", playerDamage: 25, enemyDamage: 40, healAmount: 0, narrative: "Surface-level. He expected depth. The captors tighten their grip." },
      ],
    },
  ],
};

// ── Cronin Room Mobs ─────────────────────────────────────────────────────────

const RAID_AP_FRESHMAN: Encounter = raidMob(
  "raid-ap-freshman", "AP Freshman", "📋", 130, 7,
  "An AP freshman shoves a practice exam in your face, daring you to compare scores.",
  "What's your move?",
  [
    { text: "Scan it and point out an error.", enemyDamage: 22, narrative: "Identifying their mistake on sight establishes instant dominance." },
    { text: "\"I already finished mine.\"", enemyDamage: 18, narrative: "Casual academic confidence. They wince." },
    { text: "Compare answer choices methodically.", enemyDamage: 16, narrative: "Your analytical approach subtly exposes their gaps." },
    { text: "Pretend you haven't started.", enemyDamage: 0, narrative: "They feel superior. A catastrophic error.", badChoice: true },
  ]
);

const RAID_AP_SOPHOMORE: Encounter = raidMob(
  "raid-ap-sophomore", "AP Sophomore", "📝", 130, 7,
  "An AP sophomore claims their GPA is higher and won't stop talking about it.",
  "How do you respond?",
  [
    { text: "\"Cool. Mine's higher.\"", enemyDamage: 22, narrative: "Calm certainty. They immediately start recalculating." },
    { text: "\"GPAs are just one metric.\"", enemyDamage: 18, narrative: "Philosophically sound. They can't argue it." },
    { text: "Produce your transcript.", enemyDamage: 28, narrative: "Evidence-based rebuttal. They go quiet." },
    { text: "\"That's great for you!\"", enemyDamage: 0, narrative: "Too kind. They take the point and run.", badChoice: true },
  ]
);

const RAID_AP_JUNIOR: Encounter = raidMob(
  "raid-ap-junior", "AP Junior", "🔬", 150, 11,
  "An AP junior lectures you about how brutal junior year is, implying you couldn't handle it.",
  "Your response?",
  [
    { text: "\"Can't wait.\"", enemyDamage: 22, narrative: "Fearlessness unnerves them. They were trying to scare you." },
    { text: "\"My schedule's already harder.\"", enemyDamage: 30, narrative: "Checking the receipts publicly. They seethe." },
    { text: "\"Didn't seniors say the same thing about 10th grade?\"", enemyDamage: 26, narrative: "Exposing the cycle of overblown difficulty claims. They have no defense." },
    { text: "Nod sympathetically.", enemyDamage: 0, narrative: "You just validated their whole bit. They grow bolder.", badChoice: true },
  ]
);

const RAID_AP_SENIOR: Encounter = raidMob(
  "raid-ap-senior", "AP Senior", "🏫", 175, 11,
  "An AP senior tells you freshmen shouldn't be in AP classes. Everyone's watching.",
  "What do you say?",
  [
    { text: "\"And yet, here I am.\"", enemyDamage: 32, narrative: "The most powerful answer. They can't dispute it." },
    { text: "Show them your 5 on last year's AP exam.", enemyDamage: 38, narrative: "Cold hard evidence silences the room." },
    { text: "\"Mr. Cronin invited me personally.\"", enemyDamage: 30, narrative: "Name-dropping the teacher they answer to. Smart." },
    { text: "\"That used to be the rule. I changed it.\"", enemyDamage: 28, narrative: "Audacious. They look around for confirmation. Nobody contradicts you." },
    { text: "Agree with them.", enemyDamage: 0, narrative: "You've just made their case for them.", badChoice: true },
  ]
);

const RAID_BASEBALL_JOCK: Encounter = raidMob(
  "raid-baseball-jock", "Baseball Jock", "⚾", 200, 13,
  "A baseball jock knocks your notes out of your hands in the middle of the hallway.",
  "What do you do?",
  [
    { text: "Pick them up slowly and stare him down.", enemyDamage: 28, narrative: "Unblinking composure vs raw aggression. You win." },
    { text: "\"Those were organized.\"", enemyDamage: 32, narrative: "The disappointment in your voice makes him actually apologize." },
    { text: "\"Enjoy summer school.\"", enemyDamage: 38, narrative: "One sentence. It's completely over." },
    { text: "Report it to Mr. Cronin.", enemyDamage: 22, narrative: "Institutional power move. Slow but effective." },
    { text: "Yell at him immediately.", enemyDamage: 0, narrative: "He's twice your size. This was a mistake.", badChoice: true },
  ]
);

const RAID_TEACHERS_PET: Encounter = raidMob(
  "raid-teachers-pet", "Teacher's Pet", "🍎", 200, 13,
  "The teacher's pet reports you to Mr. Cronin for talking in class — even though it was them.",
  "Your counter?",
  [
    { text: "\"I was answering his question.\"", enemyDamage: 32, narrative: "Mr. Cronin nods. The pet looks mortified." },
    { text: "\"Thank you for your concern.\"", enemyDamage: 28, narrative: "Weaponized politeness. They short-circuit." },
    { text: "\"You know everyone hates this, right?\"", enemyDamage: 38, narrative: "Blunt social reality check. They crumble." },
    { text: "Produce evidence that it was them talking.", enemyDamage: 42, narrative: "Reversal of evidence. Mr. Cronin turns to the pet." },
    { text: "Accept the reprimand silently.", enemyDamage: 0, narrative: "You lose the exchange entirely.", badChoice: true },
  ]
);

const RAID_MATTEO: Encounter = {
  id: "raid-mob-matteo",
  enemyName: "Matteo",
  enemyEmoji: "📱",
  enemyMaxHp: 250,
  isBoss: false,
  victoryText: "Matteo's phone goes dark. The crowd disperses. You've beaten him on his own turf.",
  defeatText: "Matteo films the whole thing and posts it. You've lost this one.",
  rounds: [
    {
      situation: "Matteo blocks the hallway, phone raised, filming. Everyone's watching.",
      question: "Matteo says: \"You really think you can beat me HERE? In Cronin's room?\"",
      choices: [
        { text: "\"Your phone's at 4%. Sit down.\"", playerDamage: 15, enemyDamage: 50, healAmount: 0, narrative: "The battery observation silences everyone. Matteo checks instinctively. You strike." },
        { text: "\"I already beat you once. This is a formality.\"", playerDamage: 15, enemyDamage: 45, healAmount: 0, narrative: "Treating this as routine deflates his confidence completely." },
        { text: "\"Mr. Cronin's watching.\"", playerDamage: 15, enemyDamage: 38, healAmount: 0, narrative: "Matteo spins around. Cronin isn't there yet, but the paranoia is real." },
        { text: "Freeze up.", playerDamage: 30, enemyDamage: 0, healAmount: 0, narrative: "Matteo films the entire freeze. This one goes viral." },
      ],
    },
    {
      situation: "Matteo's getting serious. He opens three apps and types at blinding speed.",
      question: "\"You've got one chance to convince everyone I'm wrong. Go.\"",
      choices: [
        { text: "\"Put the phone down and fight fair.\"", playerDamage: 15, enemyDamage: 55, healAmount: 0, narrative: "Matteo pauses. Without the phone, he's just a guy." },
        { text: "\"You're not wrong. You're just irrelevant.\"", playerDamage: 15, enemyDamage: 65, healAmount: 0, narrative: "Transcendent burn. The crowd reacts loudly." },
        { text: "Name every class he's failed.", playerDamage: 15, enemyDamage: 60, healAmount: 0, narrative: "The receipts are devastating. People start backing away from Matteo." },
        { text: "Say nothing and walk away.", playerDamage: 35, enemyDamage: 0, healAmount: 0, narrative: "Matteo narrates your retreat in real time. It's bad." },
      ],
    },
  ],
};

const RAID_BOSS_CRONIN: Encounter = {
  id: "raid-boss-cronin",
  enemyName: "Captured Mr. Cronin",
  enemyEmoji: "😤",
  enemyMaxHp: 800,
  isBoss: true,
  victoryText: "Mr. Cronin is free. He straightens his tie, nods once, and says: 'Good work.'",
  defeatText: "Even captured, Cronin outmaneuvers you. Regroup and try again.",
  rounds: [
    {
      situation: "Mr. Cronin, still sharp even in captivity, stares you down from across the room.",
      question: "\"You want to free me? First — what is the derivative of x³?\"",
      choices: [
        { text: "\"3x².\"", playerDamage: 20, enemyDamage: 130, healAmount: 0, narrative: "Immediate and correct. Cronin's posture shifts. You pass." },
        { text: "\"That depends on whether we're using implicit differentiation.\"", playerDamage: 20, enemyDamage: 160, healAmount: 0, narrative: "Deeper knowledge than required. Cronin looks genuinely impressed — high praise from him." },
        { text: "\"I'll need a whiteboard.\"", playerDamage: 20, enemyDamage: 90, healAmount: 0, narrative: "Showing your work instinct impresses him. Partial credit." },
        { text: "\"The answer is x to the third.\"", playerDamage: 45, enemyDamage: 0, healAmount: 0, narrative: "Dead wrong. Cronin sighs deeply. The captors tighten their grip." },
      ],
    },
    {
      situation: "Cronin tests your understanding of the bigger picture.",
      question: "\"Why does any of this math matter?\"",
      choices: [
        { text: "\"It trains your brain to think precisely under pressure.\"", playerDamage: 20, enemyDamage: 200, healAmount: 0, narrative: "Exactly what he believes. The captors loosen their hold." },
        { text: "\"It makes everything else make sense.\"", playerDamage: 20, enemyDamage: 185, healAmount: 0, narrative: "A beautiful answer. Cronin nods once, slowly." },
        { text: "\"It doesn't. But you love it, so I'll learn it.\"", playerDamage: 20, enemyDamage: 170, healAmount: 0, narrative: "Honest and respectful. Cronin almost smiles." },
        { text: "\"For the test.\"", playerDamage: 45, enemyDamage: 20, healAmount: 0, narrative: "Cronin closes his eyes. You've said the worst possible thing." },
      ],
    },
    {
      situation: "Final test. Cronin's captors are weakening. One more exchange and he's free.",
      question: "\"Prove you're ready. What's 1000 divided by 8, in your head, right now.\"",
      choices: [
        { text: "\"125.\"", playerDamage: 20, enemyDamage: 260, healAmount: 0, narrative: "Instant. No hesitation. Cronin breaks free." },
        { text: "Take 3 seconds and get it right.", playerDamage: 20, enemyDamage: 230, healAmount: 0, narrative: "Not instant, but correct. Cronin approves." },
        { text: "\"About 120-ish?\"", playerDamage: 35, enemyDamage: 60, healAmount: 0, narrative: "Close but sloppy. Cronin grimaces." },
        { text: "Ask for a calculator.", playerDamage: 55, enemyDamage: 0, healAmount: 0, narrative: "An unforgivable request in this context. The captors laugh." },
      ],
    },
  ],
};

// ── Bryant Room Mobs ─────────────────────────────────────────────────────────

const RAID_YN_FRESHMAN: Encounter = raidMob(
  "raid-yn-freshman", "YN Freshman", "😮", 100, 5,
  "A YN freshman stares you down from across the hallway outside Bryant's room.",
  "What do you do?",
  [
    { text: "Stare right back, don't blink.", enemyDamage: 16, narrative: "Unflinching. They look away first." },
    { text: "Nod once and walk past.", enemyDamage: 13, narrative: "Confidence without confrontation. Respect earned." },
    { text: "\"You good?\"", enemyDamage: 11, narrative: "Casual neutralization. They're not sure if you're friendly or threatening. Perfect." },
    { text: "Wave awkwardly.", enemyDamage: 0, narrative: "They laugh. This was a mistake.", badChoice: true },
  ]
);

const RAID_YN_SOPHOMORE: Encounter = raidMob(
  "raid-yn-sophomore", "YN Sophomore", "🕶️", 100, 5,
  "A YN sophomore blocks the doorway and crosses their arms.",
  "What's your play?",
  [
    { text: "\"Move.\"", enemyDamage: 16, narrative: "One word, delivered calmly. They move." },
    { text: "Walk straight at them.", enemyDamage: 13, narrative: "They step aside instinctively." },
    { text: "\"Bryant know you're blocking his door?\"", enemyDamage: 20, narrative: "Name-dropping the boss. They step aside fast." },
    { text: "Wait and see if they move.", enemyDamage: 0, narrative: "They don't. This standoff ends badly for you.", badChoice: true },
  ]
);

const RAID_YN_JUNIOR: Encounter = raidMob(
  "raid-yn-junior", "YN Junior", "💢", 130, 8,
  "A YN junior challenges you for being in Bryant's territory.",
  "What do you say?",
  [
    { text: "\"I go where I want.\"", enemyDamage: 22, narrative: "Territorial confidence. They weren't ready for that." },
    { text: "\"Bryant invited me.\"", enemyDamage: 24, narrative: "Bluff or truth — either way it works." },
    { text: "Walk past them without responding.", enemyDamage: 20, narrative: "The silence is deafening. They can't catch up." },
    { text: "Apologize and back off.", enemyDamage: 0, narrative: "You retreat. They spread the word.", badChoice: true },
  ]
);

const RAID_YN_SENIOR: Encounter = raidMob(
  "raid-yn-senior", "YN Senior", "😠", 130, 8,
  "A YN senior steps forward and says this is your last warning.",
  "What do you do?",
  [
    { text: "\"Appreciate the heads up.\"", enemyDamage: 24, narrative: "Casual absorption of a threat. It drives them crazy." },
    { text: "\"Already past my last warning.\"", enemyDamage: 30, narrative: "Implying this isn't your first rodeo. They hesitate." },
    { text: "\"I'm shaking.\"", enemyDamage: 32, narrative: "Dripping with sarcasm. They have no response." },
    { text: "Run.", enemyDamage: 0, narrative: "They don't even chase. They don't need to.", badChoice: true },
  ]
);

const RAID_YN_LEADER: Encounter = raidMob(
  "raid-yn-leader", "YN Leader", "👊", 150, 8,
  "The YN Leader steps forward, arms crossed. This one runs things.",
  "How do you respond?",
  [
    { text: "\"I know about the arrangement with Bryant.\"", enemyDamage: 32, narrative: "You know something. They don't know what. Now they're nervous." },
    { text: "\"Step aside. I'm not here for you.\"", enemyDamage: 28, narrative: "Controlled dismissal from a freshman. They're stunned." },
    { text: "\"Nice crew. Pity about the loyalty.\"", enemyDamage: 36, narrative: "Seeds of internal doubt planted instantly. They lose focus." },
    { text: "Back away slowly.", enemyDamage: 0, narrative: "You've given them everything they need.", badChoice: true },
  ]
);

const RAID_DEVON: Encounter = {
  id: "raid-mob-devon",
  enemyName: "Devon",
  enemyEmoji: "🎯",
  enemyMaxHp: 175,
  isBoss: false,
  victoryText: "Devon backs off, jaw tight. \"We'll finish this later.\" You both know you won.",
  defeatText: "Devon grinds you down. Come back stronger.",
  rounds: [
    {
      situation: "Devon materializes from the crowd like he's been waiting specifically for you.",
      question: "\"You've been stirring things up. Why?\"",
      choices: [
        { text: "\"Because someone had to.\"", playerDamage: 10, enemyDamage: 42, healAmount: 0, narrative: "Clean, honest, unavoidable. Devon has no comeback." },
        { text: "\"Because I can.\"", playerDamage: 10, enemyDamage: 48, healAmount: 0, narrative: "Pure confidence. Devon's expression darkens." },
        { text: "\"Ask Bryant.\"", playerDamage: 10, enemyDamage: 38, healAmount: 0, narrative: "Redirecting to the boss is a power move. Devon clams up." },
        { text: "\"I'm just passing through.\"", playerDamage: 25, enemyDamage: 0, healAmount: 0, narrative: "Devon doesn't buy it and neither does anyone watching." },
      ],
    },
  ],
};

const RAID_BRYCE: Encounter = raidMob(
  "raid-mob-bryce", "Bryce", "🏋️", 200, 15,
  "Bryce cracks his knuckles and squares up. He's been designated to stop you.",
  "What's your move?",
  [
    { text: "\"That's a lot of muscle for someone who failed PE.\"", enemyDamage: 40, narrative: "One needle precisely placed. Bryce goes purple." },
    { text: "Walk through him like he's furniture.", enemyDamage: 30, narrative: "Pure audacity. He's too stunned to react." },
    { text: "\"Bryant sent his BEST?\"", enemyDamage: 35, narrative: "The poisoned flattery. Bryce doesn't know whether to be proud or offended." },
    { text: "\"I've been waiting for a real fight.\"", enemyDamage: 32, narrative: "You relish the challenge. Bryce hesitates — he expected fear." },
    { text: "Challenge him to an arm wrestle.", enemyDamage: 0, narrative: "You lose immediately. He's Bryce.", badChoice: true },
  ]
);

const RAID_BOSS_BRYANT: Encounter = {
  id: "raid-boss-bryant",
  enemyName: "Captured Mr. Bryant",
  enemyEmoji: "😤",
  enemyMaxHp: 500,
  isBoss: true,
  victoryText: "Mr. Bryant is shaken free — but something shifts in the room.",
  defeatText: "Mr. Bryant's captor prevails. Fall back.",
  rounds: [
    {
      situation: "Mr. Bryant stands cornered but defiant, still holding some of his captor's influence.",
      question: "\"You really came in here? What do you want, freshman?\"",
      choices: [
        { text: "\"Your freedom. We're taking this room back.\"", playerDamage: 15, enemyDamage: 110, healAmount: 0, narrative: "Purpose-driven. Bryant's resistance flickers." },
        { text: "\"To settle this once and for all.\"", playerDamage: 15, enemyDamage: 95, healAmount: 0, narrative: "Finality in your voice. Bryant straightens slightly." },
        { text: "\"Someone told me you needed help.\"", playerDamage: 15, enemyDamage: 80, healAmount: 0, narrative: "Empathy catches Bryant off guard. His guard drops." },
        { text: "\"To pass this class actually.\"", playerDamage: 35, enemyDamage: 10, healAmount: 0, narrative: "Wrong room, wrong time, wrong answer." },
      ],
    },
    {
      situation: "Bryant is weakening. His captor's grip is loosening. Push harder.",
      question: "\"They told me you'd never get past Devon. How did you?\"",
      choices: [
        { text: "\"Devon made the mistake of underestimating me.\"", playerDamage: 15, enemyDamage: 130, healAmount: 0, narrative: "Said plainly. Bryant almost smiles." },
        { text: "\"I had help from everyone they pushed around.\"", playerDamage: 15, enemyDamage: 120, healAmount: 0, narrative: "Invoking the collective. Bryant's eyes widen." },
        { text: "\"Devon slipped. It happens.\"", playerDamage: 15, enemyDamage: 110, healAmount: 0, narrative: "Calm and dismissive. Bryant respects the composure." },
        { text: "Shrug and say nothing.", playerDamage: 35, enemyDamage: 0, healAmount: 0, narrative: "Bryant needs more than silence right now." },
      ],
    },
  ],
};

const RAID_CK3_BARRETT: Encounter = {
  id: "raid-boss-ck3-barrett",
  enemyName: "Ck3 \"King\" Barrett",
  enemyEmoji: "👑",
  enemyMaxHp: 2000,
  isBoss: true,
  victoryText: "The King falls. Barrett's reign over Bryant's room — and this whole school — is over. You stand in the silence of something unprecedented.",
  defeatText: "Barrett laughs softly. \"I expected more.\" The room goes cold.",
  rounds: [
    {
      situation: "CK3 Barrett steps in as Bryant reaches half HP. He doesn't rush. He never rushes.",
      question: "Barrett: \"I heard you've been busy. Impressive — for a freshman.\"",
      choices: [
        { text: "\"I'm just getting started.\"", playerDamage: 45, enemyDamage: 200, healAmount: 0, narrative: "The confidence is real and Barrett can tell. His eyes narrow." },
        { text: "\"King Barrett. Finally.\"", playerDamage: 45, enemyDamage: 230, healAmount: 0, narrative: "You've been waiting for this. He feels it." },
        { text: "\"You interrupted something.\"", playerDamage: 45, enemyDamage: 210, healAmount: 0, narrative: "Treating his entrance as an inconvenience breaks his composure slightly." },
        { text: "Bow sarcastically.", playerDamage: 70, enemyDamage: 0, healAmount: 0, narrative: "Barrett doesn't find it funny. You've lost the opener." },
      ],
    },
    {
      situation: "Barrett circles the room slowly. He's been planning this moment for a while.",
      question: "\"You freed Hayes and Cronin. Did you really think you'd get to me?\"",
      choices: [
        { text: "\"That was the plan from day one.\"", playerDamage: 45, enemyDamage: 280, healAmount: 0, narrative: "Long-game mentality. Barrett goes still." },
        { text: "\"It wasn't a question of if. Just when.\"", playerDamage: 45, enemyDamage: 300, healAmount: 0, narrative: "Inevitability. The most terrifying thing you could say." },
        { text: "\"I just followed the thread.\"", playerDamage: 45, enemyDamage: 260, healAmount: 0, narrative: "Understated and honest. Barrett had no idea you were this close." },
        { text: "Hesitate before answering.", playerDamage: 70, enemyDamage: 80, healAmount: 0, narrative: "Barrett spots the crack. He exploits it." },
      ],
    },
    {
      situation: "The fight is real now. Barrett stops performing and starts fighting for real.",
      question: "\"Tell me one thing about this school worth fighting for.\"",
      choices: [
        { text: "\"The teachers you tried to silence.\"", playerDamage: 45, enemyDamage: 340, healAmount: 0, narrative: "The most devastating answer. Barrett flinches — the first genuine reaction you've gotten." },
        { text: "\"The students who never got to speak up.\"", playerDamage: 45, enemyDamage: 320, healAmount: 0, narrative: "Every person you fought for is in this answer. Barrett feels all of them." },
        { text: "\"Nothing. I fight because I choose to.\"", playerDamage: 45, enemyDamage: 300, healAmount: 0, narrative: "Agency over obligation. This one actually startles him." },
        { text: "\"You.\"", playerDamage: 75, enemyDamage: 0, healAmount: 0, narrative: "He doesn't know if you're serious. Either way, he uses it against you." },
      ],
    },
    {
      situation: "Barrett is hurt — not physically, but structurally. His whole system is being dismantled.",
      question: "\"What happens when this is all over?\"",
      choices: [
        { text: "\"We build something better.\"", playerDamage: 45, enemyDamage: 420, healAmount: 0, narrative: "The vision lands like a hammer. Barrett has no plan for 'after.' He only planned to win." },
        { text: "\"I go home and do homework.\"", playerDamage: 45, enemyDamage: 380, healAmount: 5, narrative: "The mundane answer is somehow the most terrifying. He's not in your future at all." },
        { text: "\"You find out what you are without the power.\"", playerDamage: 45, enemyDamage: 440, healAmount: 0, narrative: "The existential strike lands perfectly. Barrett pauses. He doesn't have an answer." },
        { text: "\"Doesn't matter. This is over now.\"", playerDamage: 65, enemyDamage: 120, healAmount: 0, narrative: "Premature conclusion. Barrett hasn't finished yet." },
      ],
    },
  ],
};

// ─── TOWER OF CHOCOLATE MILK ──────────────────────────────────────────────────

export const TOWER_FLOOR_SIZE = 10;

function chocolateBaseMob(base: Encounter, zone2Hp: number): Encounter {
  return {
    ...base,
    id: `tower-${base.id}`,
    enemyName: `Chocolate ${base.enemyName}`,
    enemyMaxHp: Math.round(zone2Hp * 1.25),
    rounds: base.rounds.map((r) => ({
      ...r,
      choices: r.choices.map((c) => ({ ...c, playerDamage: 5 })),
    })),
  };
}

function chocolateRaidMob(base: Encounter): Encounter {
  return {
    ...base,
    id: `tower-${base.id}`,
    enemyName: `Chocolate ${base.enemyName}`,
    enemyMaxHp: Math.round(base.enemyMaxHp * 1.25),
    rounds: base.rounds.map((r) => ({
      ...r,
      choices: r.choices.map((c) => ({
        ...c,
        playerDamage: Math.round(c.playerDamage * 1.25),
      })),
    })),
  };
}

const CHOC_MOB_LIST: Encounter[] = [
  chocolateBaseMob(MOB_ENCOUNTERS[0], ZONE_2_HP[0]),
  chocolateBaseMob(MOB_ENCOUNTERS[1], ZONE_2_HP[1]),
  chocolateBaseMob(MOB_ENCOUNTERS[2], ZONE_2_HP[2]),
  chocolateBaseMob(MOB_ENCOUNTERS[3], ZONE_2_HP[3]),
  chocolateBaseMob(MOB_ENCOUNTERS[4], ZONE_2_HP[4]),
  chocolateRaidMob(RAID_INDIAN_FRESHMAN),
  chocolateRaidMob(RAID_INDIAN_SOPHOMORE),
  chocolateRaidMob(RAID_INDIAN_JUNIOR),
  chocolateRaidMob(RAID_INDIAN_SENIOR),
  chocolateRaidMob(RAID_AP_FRESHMAN),
  chocolateRaidMob(RAID_AP_SOPHOMORE),
  chocolateRaidMob(RAID_AP_JUNIOR),
  chocolateRaidMob(RAID_AP_SENIOR),
  chocolateRaidMob(RAID_BASEBALL_JOCK),
  chocolateRaidMob(RAID_TEACHERS_PET),
  chocolateRaidMob(RAID_YN_FRESHMAN),
  chocolateRaidMob(RAID_YN_SOPHOMORE),
  chocolateRaidMob(RAID_YN_JUNIOR),
  chocolateRaidMob(RAID_YN_SENIOR),
  chocolateRaidMob(RAID_YN_LEADER),
];

function buildTowerFloor(start: number): Encounter[] {
  const list: Encounter[] = [];
  for (let i = 0; i < 9; i++) {
    list.push(CHOC_MOB_LIST[(start + i) % CHOC_MOB_LIST.length]);
  }
  return list;
}

const TOWER_BOSS_1: Encounter = {
  id: "tower-boss-sterlin",
  enemyName: "Sterlin Stover",
  enemyEmoji: "🏛️",
  enemyMaxHp: 500,
  isBoss: true,
  victoryText: "Sterlin staggers back. 'Fifteen years... and you're the first.' He steps aside. Floor 1 is clear.",
  defeatText: "Sterlin doesn't even flinch. 'The tower claims another.' You retreat.",
  rounds: [
    {
      situation: "Sterlin Stover blocks the tower entrance, arms crossed. He's been here for fifteen years and no one has passed.",
      question: "Sterlin: \"The tower is closed. Turn around, freshman.\"",
      choices: [
        { text: "\"Make me.\"", playerDamage: 15, enemyDamage: 120, healAmount: 0, narrative: "Two words. Sterlin expected fear. He didn't get it." },
        { text: "\"Fifteen years at the same door. Don't you want to know what's up there?\"", playerDamage: 15, enemyDamage: 150, healAmount: 0, narrative: "The existential jab lands harder than any fist. Sterlin flinches." },
        { text: "\"I know what's up there. I'm going through.\"", playerDamage: 15, enemyDamage: 130, healAmount: 0, narrative: "Pure certainty. He wasn't prepared for someone who already knows." },
        { text: "Back down respectfully.", playerDamage: 40, enemyDamage: 0, healAmount: 0, narrative: "He expected this. The tower expects more.", badChoice: true },
      ],
    },
    {
      situation: "Sterlin is breathing harder. He didn't expect this.",
      question: "\"You don't know what the milk does to people. Last warning.\"",
      choices: [
        { text: "\"Then I'll find out.\"", playerDamage: 15, enemyDamage: 170, healAmount: 0, narrative: "No hesitation. Sterlin realizes nothing he says will stop you." },
        { text: "\"I've already changed. The milk can't touch me.\"", playerDamage: 15, enemyDamage: 180, healAmount: 0, narrative: "The admission of growth breaks through his last defense." },
        { text: "\"Stand aside, Sterlin.\"", playerDamage: 15, enemyDamage: 200, healAmount: 0, narrative: "Using his name quietly is the most powerful thing you could do." },
        { text: "Ask him what the milk actually does.", playerDamage: 35, enemyDamage: 20, healAmount: 0, narrative: "You hesitate. He uses it. The tower demands conviction.", badChoice: true },
      ],
    },
  ],
};

const TOWER_BOSS_2: Encounter = {
  id: "tower-boss-corrupted-freshman",
  enemyName: "Corrupted Freshman",
  enemyEmoji: "🥛",
  enemyMaxHp: 1000,
  isBoss: true,
  victoryText: "The Corrupted Freshman collapses. A single tear runs down a chocolate-stained cheek. Floor 2 is yours.",
  defeatText: "The milk calls to you. The Corrupted Freshman smiles. 'You'll join us soon.'",
  rounds: [
    {
      situation: "The Corrupted Freshman was like you once. Now their eyes are brown and glazed. They smell of chocolate.",
      question: "\"Join us. Drink the milk. You'll finally belong here.\"",
      choices: [
        { text: "\"I already belong here. I don't need it.\"", playerDamage: 25, enemyDamage: 280, healAmount: 0, narrative: "The self-possession cracks their conditioning. They stagger." },
        { text: "Charge without a word.", playerDamage: 25, enemyDamage: 250, healAmount: 0, narrative: "Action over argument. The Freshman didn't expect a fighter, only a drinker." },
        { text: "\"What did you give up to get here?\"", playerDamage: 25, enemyDamage: 310, healAmount: 0, narrative: "The question pierces through the milk-haze. Grief flickers in their eyes." },
        { text: "\"Maybe just a sip...\"", playerDamage: 60, enemyDamage: 0, healAmount: 0, narrative: "You hesitate. The milk calls louder. This is how it starts.", badChoice: true },
      ],
    },
    {
      situation: "The Corrupted Freshman is slowing down. The milk is fighting you through them.",
      question: "\"Why resist? Everyone on this floor gave in. It's easier.\"",
      choices: [
        { text: "\"Easy isn't the point.\"", playerDamage: 25, enemyDamage: 350, healAmount: 0, narrative: "Simple and devastating. The Freshman has no answer for that." },
        { text: "\"Easier for who — you or the milk?\"", playerDamage: 25, enemyDamage: 380, healAmount: 0, narrative: "The distinction hits. They blink like they're waking up." },
        { text: "\"I'm here to end this. For you too.\"", playerDamage: 25, enemyDamage: 400, healAmount: 5, narrative: "Fighting FOR them breaks the milk's grip just enough." },
        { text: "Hesitate and apologize.", playerDamage: 50, enemyDamage: 50, healAmount: 0, narrative: "Compassion without resolve. The milk rushes back in.", badChoice: true },
      ],
    },
  ],
};

const TOWER_BOSS_3: Encounter = {
  id: "tower-boss-marcello",
  enemyName: "Marcello",
  enemyEmoji: "🌀",
  enemyMaxHp: 2500,
  isBoss: true,
  victoryText: "Marcello dissolves into chocolate vapor. 'Impressive,' the vapor whispers. 'But the Creator remains.' Floor 3 is cleared.",
  defeatText: "Marcello smiles. 'The tower always wins.' You are forced back.",
  rounds: [
    {
      situation: "Marcello materializes from swirling chocolate mist. He moves like the tower itself.",
      question: "Marcello: \"Three floors. You've done well. Not well enough.\"",
      choices: [
        { text: "\"Two more floors says otherwise.\"", playerDamage: 30, enemyDamage: 620, healAmount: 0, narrative: "The mathematical confidence shuts Marcello up. He recalculates." },
        { text: "\"I'm not done.\"", playerDamage: 30, enemyDamage: 580, healAmount: 0, narrative: "Three words, absolute. Marcello has never fought someone who's just not done." },
        { text: "\"Who sent you?\"", playerDamage: 30, enemyDamage: 700, healAmount: 0, narrative: "The question implies you know things you don't. Marcello freezes." },
        { text: "Act intimidated.", playerDamage: 65, enemyDamage: 100, healAmount: 0, narrative: "He expected this. He's disappointed. So is the tower.", badChoice: true },
      ],
    },
    {
      situation: "Marcello shifts form. The chocolate mist thickens around him.",
      question: "\"You fight for nothing. The Creator made this place. You can't unmake it.\"",
      choices: [
        { text: "\"Watch me.\"", playerDamage: 30, enemyDamage: 750, healAmount: 0, narrative: "Not a threat. A fact. Marcello's form flickers." },
        { text: "\"The Creator made it. I'm going to break it.\"", playerDamage: 30, enemyDamage: 800, healAmount: 0, narrative: "The directness paralyzes him. He hadn't considered someone who just says it plainly." },
        { text: "\"Whatever this place is, it ends today.\"", playerDamage: 30, enemyDamage: 780, healAmount: 0, narrative: "The finality in your voice reverberates through the tower walls." },
        { text: "\"The Creator sounds scared if they need all this.\"", playerDamage: 30, enemyDamage: 820, healAmount: 5, narrative: "The implication is devastating. Marcello can't defend the Creator's fear." },
      ],
    },
    {
      situation: "Marcello is nearly gone. The chocolate mist is fading.",
      question: "\"At the top... it will consume you. I'm the last mercy you'll receive.\"",
      choices: [
        { text: "\"I don't need mercy. I need a clear path.\"", playerDamage: 30, enemyDamage: 900, healAmount: 0, narrative: "The refusal is clean and final. Marcello dissolves." },
        { text: "\"Then thank you, and step aside.\"", playerDamage: 30, enemyDamage: 850, healAmount: 5, narrative: "Taking his mercy and using it against him. Perfect." },
        { text: "\"You're not mercy. You're just another obstacle.\"", playerDamage: 30, enemyDamage: 950, healAmount: 0, narrative: "Maximum damage. Marcello's form shatters completely." },
        { text: "Consider turning back.", playerDamage: 65, enemyDamage: 100, healAmount: 0, narrative: "One moment of doubt costs everything. The tower feeds on hesitation.", badChoice: true },
      ],
    },
  ],
};

const TOWER_BOSS_4: Encounter = {
  id: "tower-boss-lunch-lady",
  enemyName: "The Lunch Lady",
  enemyEmoji: "🍫",
  enemyMaxHp: 4000,
  isBoss: true,
  victoryText: "The Lunch Lady drops her ladle. 'I've been serving this for thirty years,' she whispers. 'Maybe it's time to stop.' Floor 4 is clear.",
  defeatText: "The Lunch Lady sighs. 'Drink your milk, dear.' You are overwhelmed.",
  rounds: [
    {
      situation: "The Lunch Lady stands before a massive vat of chocolate milk. She's been here longer than the tower itself.",
      question: "\"Sweetie, this isn't for you. Go back to class.\"",
      choices: [
        { text: "\"This ends with you, doesn't it?\"", playerDamage: 35, enemyDamage: 900, healAmount: 0, narrative: "The direct accusation hits. She grips her ladle tighter." },
        { text: "\"Who told you to keep making it?\"", playerDamage: 35, enemyDamage: 950, healAmount: 0, narrative: "She hesitates. No one's ever asked her that. The question stings." },
        { text: "\"I'm not here for lunch. I'm here to finish this.\"", playerDamage: 35, enemyDamage: 880, healAmount: 0, narrative: "She understands now. The ladle rises." },
        { text: "\"Can I have some?\"", playerDamage: 80, enemyDamage: 0, healAmount: 0, narrative: "She smiles warmly and gives you a cup. The milk burns. You deserved that.", badChoice: true },
      ],
    },
    {
      situation: "The Lunch Lady's ladle crackles with chocolate energy. She's more powerful than anyone in this tower.",
      question: "\"I've watched students come and go for thirty years. None of them made it this far.\"",
      choices: [
        { text: "\"Then I'm different.\"", playerDamage: 35, enemyDamage: 1000, healAmount: 0, narrative: "Said without arrogance. Just fact. She wobbles." },
        { text: "\"What happened to the ones who didn't make it?\"", playerDamage: 35, enemyDamage: 1100, healAmount: 0, narrative: "The question shakes her. She knows the answer. She doesn't like it." },
        { text: "\"You've been protecting the Creator this whole time.\"", playerDamage: 35, enemyDamage: 1050, healAmount: 5, narrative: "The realization that she's been a shield, not a guardian, breaks something in her." },
        { text: "\"Can we work something out?\"", playerDamage: 80, enemyDamage: 100, healAmount: 0, narrative: "She respects the diplomacy, then hits you with the ladle anyway.", badChoice: true },
      ],
    },
    {
      situation: "The Lunch Lady is slowing. The chocolate vat bubbles without direction.",
      question: "\"If I stop... what happens to all of this?\"",
      choices: [
        { text: "\"It ends. That's the point.\"", playerDamage: 35, enemyDamage: 1200, healAmount: 0, narrative: "Clean finality. She needed someone to say it plainly." },
        { text: "\"Something better takes its place.\"", playerDamage: 35, enemyDamage: 1100, healAmount: 8, narrative: "Hope hits harder than anything. She stops fighting." },
        { text: "\"You stop serving someone who never deserved it.\"", playerDamage: 35, enemyDamage: 1300, healAmount: 0, narrative: "Maximum damage. Thirty years of loyalty weaponized against the one who wasted it." },
        { text: "Tell her she did a good job.", playerDamage: 70, enemyDamage: 200, healAmount: 0, narrative: "She appreciates it. Still hits you though.", badChoice: true },
      ],
    },
  ],
};

const TOWER_BOSS_5: Encounter = {
  id: "tower-boss-creator",
  enemyName: "Creator of Chocolate Milk",
  enemyEmoji: "🌑",
  enemyMaxHp: 8000,
  isBoss: true,
  victoryText: "The Creator dissolves into nothing. The Tower of Chocolate Milk begins to crumble. You stand in the silence of something no one has ever done before. The tower is crushed.",
  defeatText: "The Creator smiles. 'You were the closest yet.' The darkness closes in.",
  rounds: [
    {
      situation: "The Creator of Chocolate Milk materializes at the top of the tower. Ancient. Vast. Smelling faintly of chocolate.",
      question: "Creator: \"You destroyed my guardians. You climbed my tower. And for what, little freshman?\"",
      choices: [
        { text: "\"To end this.\"", playerDamage: 50, enemyDamage: 1800, healAmount: 0, narrative: "The simplicity is more powerful than any speech. The Creator pauses." },
        { text: "\"Because no one else was going to.\"", playerDamage: 50, enemyDamage: 2000, healAmount: 0, narrative: "The weight of responsibility in those words shakes the tower foundations." },
        { text: "\"You'll know when it's over.\"", playerDamage: 50, enemyDamage: 1900, healAmount: 0, narrative: "Refusal to explain yourself. The Creator finds this deeply unsettling." },
        { text: "Ask why they created the chocolate milk.", playerDamage: 100, enemyDamage: 200, healAmount: 0, narrative: "They launch into a monologue. You regret asking.", badChoice: true },
      ],
    },
    {
      situation: "The Creator expands, filling the room with darkness and the scent of cocoa.",
      question: "\"I have existed since the first cafeteria. You are a freshman. Do you understand the difference?\"",
      choices: [
        { text: "\"All I understand is that you lose today.\"", playerDamage: 50, enemyDamage: 2100, healAmount: 0, narrative: "Ignoring the scale of what they are. Nothing could insult them more." },
        { text: "\"Freshman means beginning. You're an ending.\"", playerDamage: 50, enemyDamage: 2300, healAmount: 0, narrative: "The poetic reversal strikes deep. The Creator recoils." },
        { text: "\"The difference is I'm here and you're about to not be.\"", playerDamage: 50, enemyDamage: 2200, healAmount: 0, narrative: "Cold logic. The Creator has no counter." },
        { text: "\"...Yes?\"", playerDamage: 100, enemyDamage: 0, healAmount: 0, narrative: "Wrong answer. The Creator gains confidence.", badChoice: true },
      ],
    },
    {
      situation: "The Creator is weakening. The chocolate milk falls still. The tower trembles.",
      question: "\"I corrupted hundreds. Broke thousands. What makes you think you can stop something that vast?\"",
      choices: [
        { text: "\"I already have.\"", playerDamage: 50, enemyDamage: 2400, healAmount: 0, narrative: "Past tense. As if it's already done. The Creator's form cracks." },
        { text: "\"The ones you broke sent me.\"", playerDamage: 50, enemyDamage: 2600, healAmount: 0, narrative: "Every person the milk took speaks through you. The Creator cannot withstand that weight." },
        { text: "\"One person at a time. Starting with you.\"", playerDamage: 50, enemyDamage: 2500, healAmount: 5, narrative: "The scope reduced to the personal. The Creator has never been treated as just one problem." },
        { text: "Doubt yourself for a moment.", playerDamage: 100, enemyDamage: 500, healAmount: 0, narrative: "One crack is all it needs. The darkness floods in.", badChoice: true },
      ],
    },
    {
      situation: "The Creator is nearly gone. The tower shakes around you. This is the final moment.",
      question: "\"If you destroy me... you destroy everything I made. All of it. Are you prepared for that?\"",
      choices: [
        { text: "\"Yes.\"", playerDamage: 50, enemyDamage: 3000, healAmount: 0, narrative: "One word. The most powerful answer to the most important question. The Creator shatters." },
        { text: "\"Everything you made was already broken.\"", playerDamage: 50, enemyDamage: 2800, healAmount: 5, narrative: "The truth delivered gently. It lands like a mountain." },
        { text: "\"I was prepared the moment I walked into this tower.\"", playerDamage: 50, enemyDamage: 2900, healAmount: 0, narrative: "The preparation was the answer. The Creator finally understands who you are." },
        { text: "Hesitate.", playerDamage: 100, enemyDamage: 800, healAmount: 0, narrative: "One second of doubt. The Creator drinks it in. You almost lost everything.", badChoice: true },
      ],
    },
  ],
};

const TOWER_ENCOUNTERS: Encounter[] = [
  ...buildTowerFloor(0),  TOWER_BOSS_1,
  ...buildTowerFloor(9),  TOWER_BOSS_2,
  ...buildTowerFloor(18), TOWER_BOSS_3,
  ...buildTowerFloor(7),  TOWER_BOSS_4,
  ...buildTowerFloor(16), TOWER_BOSS_5,
];

// ─── RAID ENCOUNTER ARRAYS ────────────────────────────────────────────────────

export const RAID_ENCOUNTERS: Record<string, Encounter[]> = {
  "hayes": [
    RAID_INDIAN_FRESHMAN,   // 1
    RAID_INDIAN_SOPHOMORE,  // 2
    RAID_INDIAN_JUNIOR,     // 3
    RAID_INDIAN_SENIOR,     // 4
    RAID_INDIAN_FRESHMAN,   // 5
    RAID_INDIAN_SOPHOMORE,  // 6
    RAID_JAYDEN,            // 7 (only Jayden)
    RAID_INDIAN_JUNIOR,     // 8
    RAID_INDIAN_SENIOR,     // 9
    RAID_INDIAN_FRESHMAN,   // 10
    RAID_INDIAN_SOPHOMORE,  // 11
    RAID_INDIAN_JUNIOR,     // 12
    RAID_INDIAN_SENIOR,     // 13
    RAID_INDIAN_FRESHMAN,   // 14
    RAID_BOSS_HAYES,        // Boss
  ],
  "cronin": [
    RAID_AP_FRESHMAN,       // 1
    RAID_AP_SOPHOMORE,      // 2
    RAID_AP_JUNIOR,         // 3
    RAID_AP_SENIOR,         // 4
    RAID_BASEBALL_JOCK,     // 5
    RAID_TEACHERS_PET,      // 6
    RAID_AP_FRESHMAN,       // 7
    RAID_AP_SOPHOMORE,      // 8
    RAID_AP_JUNIOR,         // 9
    RAID_AP_SENIOR,         // 10
    RAID_MATTEO,            // 11 (only Matteo)
    RAID_BASEBALL_JOCK,     // 12
    RAID_TEACHERS_PET,      // 13
    RAID_AP_FRESHMAN,       // 14
    RAID_BOSS_CRONIN,       // Boss
  ],
  "bryant": [
    RAID_YN_FRESHMAN,       // 1
    RAID_YN_SOPHOMORE,      // 2
    RAID_YN_JUNIOR,         // 3
    RAID_YN_SENIOR,         // 4
    RAID_YN_LEADER,         // 5
    RAID_DEVON,             // 6 (only Devon)
    RAID_BRYCE,             // 7
    RAID_YN_FRESHMAN,       // 8
    RAID_YN_SOPHOMORE,      // 9
    RAID_BOSS_BRYANT,       // Boss 1 (transitions to Barrett at 50% HP)
    RAID_CK3_BARRETT,       // Boss 2
  ],
  "tower": TOWER_ENCOUNTERS,
};

export const GOLD_REWARDS: Record<string, number> = {
  // ── Zone mobs ──
  "seventh-grader": 2,
  "eighth-grader": 3,
  "fellow-freshman": 3,
  "sophomore": 4,
  "junior": 4,
  // ── Zone bosses ──
  "boss-bradley": 8,
  "boss-westen": 12,
  "boss-barrett": 20,
  // ── Raid 1 — Hayes ──
  "raid-indian-freshman": 10,
  "raid-indian-sophomore": 10,
  "raid-indian-junior": 20,
  "raid-indian-senior": 20,
  "raid-jayden": 30,
  "raid-boss-hayes": 50,
  // ── Raid 2 — Cronin ──
  "raid-ap-freshman": 35,
  "raid-ap-sophomore": 35,
  "raid-ap-junior": 40,
  "raid-ap-senior": 40,
  "raid-baseball-jock": 60,
  "raid-teachers-pet": 60,
  "raid-mob-matteo": 75,
  "raid-boss-cronin": 125,
  // ── Raid 3 — Bryant ──
  "raid-yn-freshman": 50,
  "raid-yn-sophomore": 50,
  "raid-yn-junior": 70,
  "raid-yn-senior": 70,
  "raid-yn-leader": 85,
  "raid-mob-devon": 100,
  "raid-mob-bryce": 115,
  "raid-boss-bryant": 125,
  "raid-boss-ck3-barrett": 300,
  // ── Tower bosses (regular tower mobs use base id × 3 in engine) ──
  "tower-boss-sterlin": 150,
  "tower-boss-corrupted-freshman": 500,
  "tower-boss-marcello": 2000,
  "tower-boss-lunch-lady": 7500,
  "tower-boss-creator": 20000,
};
