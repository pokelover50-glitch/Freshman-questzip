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

const ZONE_2_HP = [45, 55, 65, 75, 90];
const ZONE_3_HP = [60, 75, 90, 110, 125];

const ZONE_2_MIN_DMG = 5;
const ZONE_3_MIN_DMG = 6;

function scaleMobs(hpValues: number[], minPlayerDamage: number): Encounter[] {
  return MOB_ENCOUNTERS.map((enc, i) => ({
    ...enc,
    enemyMaxHp: hpValues[i] ?? enc.enemyMaxHp,
    rounds: enc.rounds.map((round) => ({
      ...round,
      choices: round.choices.map((choice) => ({
        ...choice,
        playerDamage: Math.max(choice.playerDamage, minPlayerDamage),
      })),
    })),
  }));
}

export const ZONES: Encounter[][] = [
  [...MOB_ENCOUNTERS, BOSS_1],
  [...scaleMobs(ZONE_2_HP, ZONE_2_MIN_DMG), BOSS_2],
  [...scaleMobs(ZONE_3_HP, ZONE_3_MIN_DMG), BOSS_FINAL],
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
