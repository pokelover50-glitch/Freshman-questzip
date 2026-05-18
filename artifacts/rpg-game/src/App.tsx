import { useGameEngine } from "./game/engine";
import { CHARACTER_CLASSES } from "./game/characters";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { GearItemInstance } from "./game/types";

const ZONE_NAMES = ["The Hallways", "The Cafeteria", "The Senior Lounge"];

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.2 } },
};

function HpBar({
  value,
  max,
  label,
  current,
  reverse = false,
}: {
  value: number;
  max: number;
  label: string;
  current: number;
  reverse?: boolean;
}) {
  const pct = (value / max) * 100;
  const color =
    pct > 50 ? "bg-accent" : pct > 25 ? "bg-yellow-500" : "bg-destructive";
  return (
    <div className={`space-y-1.5 ${reverse ? "text-right" : ""}`}>
      <div
        className={`flex justify-between text-sm font-serif ${reverse ? "flex-row-reverse" : ""}`}
      >
        <span className="text-muted-foreground truncate max-w-[120px]">
          {label}
        </span>
        <span className="font-bold text-foreground">
          {current} / {max}
        </span>
      </div>
      <Progress
        value={pct}
        className="h-3"
        indicatorClassName={color}
        style={reverse ? { transform: "rotateY(180deg)" } : undefined}
      />
    </div>
  );
}

function GearSlot({
  item,
  onUse,
  disabled,
}: {
  item: GearItemInstance;
  onUse: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onUse(item.instanceId)}
      disabled={disabled}
      data-testid={`gear-slot-${item.def.id}-${item.instanceId}`}
      title={`${item.def.name}: ${item.def.description}`}
      className="relative flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 border-primary/40 bg-card/80 hover:border-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-md hover:shadow-[0_0_12px_-2px_hsl(var(--primary))]"
    >
      <span className="text-2xl leading-none">{item.def.emoji}</span>
      <span className="text-[9px] text-muted-foreground font-serif mt-0.5 truncate max-w-[52px] text-center leading-tight">
        {item.def.name}
      </span>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-border rounded-md p-2 text-xs font-serif w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
        <div className="font-bold text-primary mb-0.5">{item.def.name}</div>
        <div className="text-muted-foreground">{item.def.description}</div>
      </div>
    </motion.button>
  );
}

function Hotbar({
  inventory,
  onUse,
  encounterPhase,
  showOutcome,
}: {
  inventory: GearItemInstance[];
  onUse: (id: string) => void;
  encounterPhase: boolean;
  showOutcome: boolean;
}) {
  if (!encounterPhase) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3 pt-2 bg-gradient-to-t from-background/95 to-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-card/70 backdrop-blur-md shadow-2xl">
        <span className="text-xs font-serif text-muted-foreground uppercase tracking-widest mr-2 shrink-0">
          Gear
        </span>
        {inventory.length === 0 ? (
          <span className="text-xs font-serif text-muted-foreground/50 italic px-4">
            No items yet
          </span>
        ) : (
          <div className="flex gap-2 flex-wrap max-w-[420px]">
            {inventory.map((item) => (
              <GearSlot
                key={item.instanceId}
                item={item}
                onUse={onUse}
                disabled={showOutcome}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DropNotification({
  drops,
  onDismiss,
}: {
  drops: GearItemInstance[];
  onDismiss: () => void;
}) {
  if (drops.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
    >
      <div className="rounded-xl border border-primary/50 bg-card/95 backdrop-blur-md shadow-[0_0_30px_-5px_hsl(var(--primary))] p-4 text-center space-y-3">
        <p className="font-serif text-primary font-bold text-sm uppercase tracking-widest">
          Item Drop!
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {drops.map((d) => (
            <div
              key={d.instanceId}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-3xl">{d.def.emoji}</span>
              <span className="text-xs font-serif text-foreground">
                {d.def.name}
              </span>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onDismiss}
          className="font-serif border-primary/40 hover:bg-primary/10 text-xs"
          data-testid="button-dismiss-drops"
        >
          Add to Gear
        </Button>
      </div>
    </motion.div>
  );
}

function GameContent() {
  const game = useGameEngine();
  const { state, currentEncounter, currentRound } = game;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div
        className={`relative z-10 w-full max-w-4xl p-4 sm:p-6 ${state.phase === "encounter" ? "pb-28" : ""}`}
      >
        <AnimatePresence mode="wait">
          {/* ── TITLE ── */}
          {state.phase === "title" && (
            <motion.div
              key="title"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center text-center space-y-8 py-20"
            >
              <div className="space-y-4">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight drop-shadow-lg">
                  FRESHMAN
                  <br />
                  QUEST
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground font-serif tracking-wide uppercase max-w-2xl mx-auto">
                  Survive the halls. Defeat the legends. Become the myth.
                </p>
              </div>
              <Button
                size="lg"
                className="text-lg px-12 py-8 bg-primary text-primary-foreground hover:bg-primary/90 font-serif shadow-[0_0_40px_-10px_hsl(var(--primary))]"
                onClick={game.goToCharacterSelect}
                data-testid="button-begin"
              >
                Begin Your Quest
              </Button>
            </motion.div>
          )}

          {/* ── CHARACTER SELECT ── */}
          {state.phase === "character-select" && (
            <motion.div
              key="character-select"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif font-bold text-primary">
                  Choose Your Class
                </h2>
                <p className="text-muted-foreground">
                  Your identity determines your survival strategy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHARACTER_CLASSES.map((cls) => (
                  <Card
                    key={cls.id}
                    className="cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] bg-card/50 backdrop-blur-sm border-border group"
                    onClick={() => game.selectCharacter(cls)}
                    data-testid={`card-class-${cls.id}`}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {cls.emoji}
                      </div>
                      <CardTitle className="font-serif text-2xl text-foreground">
                        {cls.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="mx-auto w-fit font-serif"
                      >
                        HP: {cls.maxHp}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        {cls.description}
                      </p>
                      <div className="text-xs font-semibold text-accent p-2 bg-accent/10 rounded-md border border-accent/20 font-serif">
                        {cls.bonus}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── INTRO ── */}
          {state.phase === "intro" && state.selectedClass && (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-2xl mx-auto space-y-8"
            >
              <Card className="bg-card border-primary/30 shadow-[0_0_30px_-10px_hsl(var(--primary))]">
                <CardHeader className="text-center border-b border-border/50 pb-6">
                  <div className="text-5xl mb-2">{state.selectedClass.emoji}</div>
                  <CardTitle className="font-serif text-3xl">
                    The First Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    The first day of high school. The halls are dangerous. Three
                    legendary enemies stand between you and legend:{" "}
                    <span className="text-foreground font-semibold">
                      "Senior" Bradley
                    </span>
                    ,{" "}
                    <span className="text-foreground font-semibold">
                      "Super Senior" Westen
                    </span>
                    , and the dreaded{" "}
                    <span className="text-foreground font-semibold text-destructive">
                      Barrett Luke Hutchins
                    </span>
                    .
                  </p>
                  <p>
                    Five mobs guard each boss. Your HP ({state.selectedClass.maxHp}) is your lifeline.
                    Defeat enemies to collect{" "}
                    <span className="text-primary font-semibold">gear</span>{" "}
                    — use it from the hotbar at the bottom. Choose wisely.
                  </p>

                  <div className="pt-4 space-y-2">
                    <h3 className="text-primary font-serif font-bold uppercase tracking-wider text-sm">
                      Zones of Conflict
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ZONE_NAMES.map((zone, i) => (
                        <Badge
                          key={zone}
                          variant="outline"
                          className="text-sm py-1 border-primary/30 bg-primary/5 font-serif"
                        >
                          Zone {i + 1}: {zone}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <Button
                      size="lg"
                      onClick={game.startGame}
                      className="font-serif text-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                      data-testid="button-enter-halls"
                    >
                      Enter the Halls
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── ENCOUNTER ── */}
          {state.phase === "encounter" &&
            currentEncounter &&
            currentRound && (
              <motion.div
                key="encounter"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 relative"
              >
                {/* Top bar */}
                <div className="grid grid-cols-2 gap-4 items-center bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg">
                  <HpBar
                    label={state.selectedClass?.name ?? "You"}
                    current={state.playerHp}
                    value={state.playerHp}
                    max={state.playerMaxHp}
                  />
                  <HpBar
                    label={currentEncounter.enemyName}
                    current={state.enemyHp}
                    value={state.enemyHp}
                    max={currentEncounter.enemyMaxHp}
                    reverse
                  />
                  <div className="col-span-2 text-center text-xs font-serif tracking-widest text-primary/70 uppercase">
                    {ZONE_NAMES[state.zoneIndex]} — Encounter{" "}
                    {state.encounterIndex + 1}
                  </div>
                </div>

                {/* Enemy card */}
                <Card className="border-border bg-card shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
                    <div className="relative">
                      <motion.div
                        animate={
                          state.showOutcome &&
                          state.lastOutcome &&
                          state.lastOutcome.enemyDamage > 0
                            ? {
                                x: [0, -10, 10, -6, 6, 0],
                                transition: { duration: 0.4 },
                              }
                            : {}
                        }
                        className="text-8xl drop-shadow-2xl z-10 relative leading-none"
                      >
                        {currentEncounter.enemyEmoji}
                      </motion.div>
                      {currentEncounter.isBoss && (
                        <Badge
                          variant="destructive"
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 font-serif font-bold uppercase tracking-widest shadow-lg"
                        >
                          BOSS
                        </Badge>
                      )}
                    </div>

                    <div className="max-w-2xl space-y-4 pt-4 w-full">
                      <div className="p-5 rounded-lg bg-black/40 border border-white/5 font-serif text-base sm:text-lg leading-relaxed text-left text-foreground/90 italic shadow-inner">
                        {currentRound.situation}
                      </div>
                      <h3 className="font-bold text-xl text-primary font-serif">
                        {currentRound.question}
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                {/* Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {!state.showOutcome &&
                      currentRound.choices.map((choice, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 text-left justify-start font-serif text-base whitespace-normal border-border hover:border-primary/50 hover:bg-primary/10 bg-card/80 backdrop-blur-sm transition-all shadow-sm hover:shadow-[0_0_12px_-4px_hsl(var(--primary))]"
                            onClick={() => game.chooseAnswer(choice)}
                            data-testid={`button-choice-${idx}`}
                          >
                            <span className="text-primary/60 font-bold mr-3 shrink-0">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {choice.text}
                          </Button>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                {/* Item error message */}
                <AnimatePresence>
                  {state.itemActionMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4"
                    >
                      <div
                        className="rounded-lg border border-destructive/50 bg-card/95 backdrop-blur-md px-5 py-3 text-destructive font-serif text-sm shadow-lg cursor-pointer"
                        onClick={game.dismissItemMessage}
                        data-testid="item-error-message"
                      >
                        {state.itemActionMessage} (click to dismiss)
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Outcome overlay */}
                <AnimatePresence>
                  {state.showOutcome && state.lastOutcome && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-x-0 bottom-0 z-30 p-2"
                    >
                      <Card className="border-primary/50 shadow-[0_0_40px_-10px_hsl(var(--primary))] bg-background/97 backdrop-blur-xl">
                        <CardContent className="pt-6 space-y-5">
                          <p className="text-lg font-serif leading-relaxed text-center">
                            {state.lastOutcome.narrative}
                          </p>

                          {/* Ability message */}
                          {state.abilityMessage && (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-center px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 font-serif text-sm text-primary font-semibold"
                            >
                              ✦ {state.abilityMessage}
                            </motion.div>
                          )}

                          <div className="flex justify-center gap-6 font-bold font-serif text-lg flex-wrap">
                            {state.lastOutcome.playerDamage > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-destructive"
                              >
                                -{state.lastOutcome.playerDamage} HP
                              </motion.span>
                            )}
                            {state.lastOutcome.enemyDamage > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.05 }}
                                className="text-primary"
                              >
                                {state.lastOutcome.enemyDamage} DMG dealt
                              </motion.span>
                            )}
                            {state.lastOutcome.healAmount > 0 && (
                              <motion.span
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-accent"
                              >
                                +{state.lastOutcome.healAmount} HP healed
                              </motion.span>
                            )}
                          </div>

                          <div className="flex justify-center pt-1">
                            <Button
                              size="lg"
                              className="font-serif px-10 bg-primary text-primary-foreground"
                              onClick={game.continueAfterOutcome}
                              data-testid="button-continue"
                            >
                              Continue
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          {/* ── VICTORY ── */}
          {state.phase === "victory" && (
            <motion.div
              key="victory"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-10 py-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl font-serif font-bold text-primary tracking-wider drop-shadow-[0_0_30px_hsl(var(--primary))]">
                  QUEST COMPLETE
                </h1>
                <p className="text-xl font-serif text-foreground max-w-2xl mx-auto italic bg-card/50 p-6 rounded-xl border border-border">
                  Barrett Luke Hutchins stares at you for a long, silent moment. Then — slowly — he begins to clap. You have defeated the final boss. You are no longer just a freshman. You are LEGEND.
                </p>
              </div>

              <div className="space-y-6 bg-card/50 p-8 rounded-2xl border border-border/50 backdrop-blur-sm w-full max-w-md">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                  Defeated Legends
                </h2>
                <div className="space-y-4">
                  {state.defeatedBosses.map((boss, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between font-serif text-lg border-b border-border/50 pb-2"
                    >
                      <span className="text-foreground">{boss}</span>
                      <span className="text-accent text-sm">DEFEATED</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 font-serif border-primary/50 hover:bg-primary/10"
                onClick={game.goToTitle}
                data-testid="button-play-again"
              >
                Return to the Title
              </Button>
            </motion.div>
          )}

          {/* ── GAME OVER ── */}
          {state.phase === "game-over" && (
            <motion.div
              key="game-over"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center text-center space-y-10 py-20"
            >
              <h1 className="text-6xl sm:text-8xl font-serif font-bold text-destructive tracking-widest drop-shadow-[0_0_30px_hsl(var(--destructive))]">
                GAME OVER
              </h1>

              <div className="space-y-4 max-w-lg">
                <p className="text-2xl font-serif text-foreground italic">
                  {currentEncounter?.defeatText ?? "Your journey ends here."}
                </p>
                <div className="inline-block mt-4 px-6 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-serif">
                  Fell in {ZONE_NAMES[state.zoneIndex]} to{" "}
                  {currentEncounter?.enemyName}
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 font-serif border-destructive/50 hover:bg-destructive hover:text-destructive-foreground text-destructive transition-colors"
                onClick={game.goToTitle}
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hotbar */}
      <Hotbar
        inventory={state.inventory}
        onUse={game.useItem}
        encounterPhase={state.phase === "encounter"}
        showOutcome={state.showOutcome}
      />

      {/* Drop notification */}
      <AnimatePresence>
        {state.pendingDrops.length > 0 && !state.showOutcome && (
          <DropNotification
            drops={state.pendingDrops}
            onDismiss={game.dismissDrops}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GameContent} />
    </Switch>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
