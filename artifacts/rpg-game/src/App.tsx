import { useGameEngine } from "./game/engine";
import { CHARACTER_CLASSES } from "./game/characters";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const ZONE_NAMES = ["The Hallways", "The Cafeteria", "The Senior Lounge"];

function GameContent() {
  const game = useGameEngine();
  const { state, currentEncounter, currentRound } = game;

  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="relative z-10 w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
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
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight drop-shadow-lg filter">
                  FRESHMAN<br/>QUEST
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
                <h2 className="text-4xl font-serif font-bold text-primary">Choose Your Class</h2>
                <p className="text-muted-foreground">Your identity determines your survival strategy.</p>
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
                      <CardTitle className="font-serif text-2xl text-foreground">{cls.name}</CardTitle>
                      <Badge variant="secondary" className="mx-auto w-fit">HP: {cls.maxHp}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <p className="text-sm text-muted-foreground">{cls.description}</p>
                      <div className="text-xs font-semibold text-accent p-2 bg-accent/10 rounded-md border border-accent/20">
                        {cls.bonus}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

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
                  <CardTitle className="font-serif text-3xl">The First Day</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    The first day of high school. The halls are dangerous. Three legendary enemies stand between you and legend: <span className="text-foreground font-semibold">"Senior" Bradley</span>, <span className="text-foreground font-semibold">"Super Senior" Westen</span>, and the dreaded <span className="text-foreground font-semibold text-destructive drop-shadow-sm">Barrett Luke Hutchins</span>.
                  </p>
                  <p>
                    Five mobs guard each boss. Your HP ({state.selectedClass.maxHp}) is your lifeline. Choose wisely.
                  </p>
                  
                  <div className="pt-4 space-y-2">
                    <h3 className="text-primary font-serif font-bold uppercase tracking-wider text-sm">Zones of Conflict</h3>
                    <div className="flex flex-wrap gap-2">
                      {ZONE_NAMES.map((zone, i) => (
                        <Badge key={zone} variant="outline" className="text-sm py-1 border-primary/30 bg-primary/5">
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

          {state.phase === "encounter" && currentEncounter && currentRound && (
            <motion.div
              key="encounter"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              {/* Top Bar */}
              <div className="grid grid-cols-2 gap-4 items-center bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-serif">
                    <span className="text-muted-foreground">{state.selectedClass?.name}</span>
                    <span className="font-bold text-foreground">{state.playerHp} / {state.playerMaxHp}</span>
                  </div>
                  <Progress 
                    value={(state.playerHp / state.playerMaxHp) * 100} 
                    className="h-3" 
                    indicatorClassName={
                      (state.playerHp / state.playerMaxHp) > 0.5 ? "bg-accent" : 
                      (state.playerHp / state.playerMaxHp) > 0.25 ? "bg-yellow-500" : "bg-destructive"
                    }
                  />
                </div>
                
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-sm font-serif flex-row-reverse">
                    <span className="text-muted-foreground">{currentEncounter.enemyName}</span>
                    <span className="font-bold text-foreground">{state.enemyHp} / {currentEncounter.enemyMaxHp}</span>
                  </div>
                  <Progress 
                    value={(state.enemyHp / currentEncounter.enemyMaxHp) * 100} 
                    className="h-3 bg-secondary/50" 
                    indicatorClassName="bg-destructive"
                    style={{ transform: "rotateY(180deg)" }}
                  />
                </div>
                
                <div className="col-span-2 text-center text-xs font-serif tracking-widest text-primary/70 uppercase">
                  {ZONE_NAMES[state.zoneIndex]} — Encounter {state.encounterIndex + 1}
                </div>
              </div>

              {/* Middle: Enemy Info & Situation */}
              <Card className="border-border bg-card shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="text-8xl drop-shadow-2xl z-10 relative">
                      {currentEncounter.enemyEmoji}
                    </div>
                    {currentEncounter.isBoss && (
                      <Badge variant="destructive" className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 font-serif font-bold uppercase tracking-widest shadow-lg">
                        BOSS
                      </Badge>
                    )}
                  </div>
                  
                  <div className="max-w-2xl space-y-4 pt-4">
                    <div className="p-5 rounded-lg bg-black/40 border border-white/5 font-serif text-lg leading-relaxed text-left text-foreground/90 italic shadow-inner">
                      {currentRound.situation}
                    </div>
                    <h3 className="font-bold text-xl text-primary font-serif">
                      {currentRound.question}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              {/* Choices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {!state.showOutcome && currentRound.choices.map((choice, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 px-6 text-left justify-start items-center font-serif text-lg whitespace-normal border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary-foreground bg-card/80 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                        onClick={() => game.chooseAnswer(choice)}
                        data-testid={`button-choice-${idx}`}
                      >
                        {choice.text}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Outcome Overlay */}
              <AnimatePresence>
                {state.showOutcome && state.lastOutcome && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-6 z-50"
                  >
                    <Card className="border-primary/50 shadow-[0_0_40px_-10px_hsl(var(--primary))] bg-background/95 backdrop-blur-xl">
                      <CardContent className="pt-6 space-y-6">
                        <p className="text-xl font-serif leading-relaxed text-center">
                          {state.lastOutcome.narrative}
                        </p>
                        
                        <div className="flex justify-center gap-6 font-bold font-serif text-lg">
                          {state.lastOutcome.playerDamage > 0 && (
                            <span className="text-destructive flex items-center gap-2">
                              Took {state.lastOutcome.playerDamage} DMG
                            </span>
                          )}
                          {state.lastOutcome.enemyDamage > 0 && (
                            <span className="text-primary flex items-center gap-2">
                              Dealt {state.lastOutcome.enemyDamage} DMG
                            </span>
                          )}
                          {state.lastOutcome.healAmount > 0 && (
                            <span className="text-accent flex items-center gap-2">
                              Healed {state.lastOutcome.healAmount} HP
                            </span>
                          )}
                        </div>

                        <div className="flex justify-center pt-2">
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
                <p className="text-2xl font-serif text-foreground max-w-2xl mx-auto italic bg-card/50 p-6 rounded-xl border border-border">
                  {currentEncounter?.victoryText || "You have survived the halls."}
                </p>
              </div>

              <div className="space-y-6 bg-card/50 p-8 rounded-2xl border border-border/50 backdrop-blur-sm w-full max-w-md">
                <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Defeated Legends</h2>
                <div className="space-y-4">
                  {state.defeatedBosses.map((boss, i) => (
                    <div key={i} className="flex items-center justify-between font-serif text-xl border-b border-border/50 pb-2">
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
                  {currentEncounter?.defeatText || "Your journey ends here."}
                </p>
                <div className="inline-block mt-4 px-6 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-serif">
                  Fell in {ZONE_NAMES[state.zoneIndex]} to {currentEncounter?.enemyName}
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
