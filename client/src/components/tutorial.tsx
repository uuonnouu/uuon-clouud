import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Globe, Zap, Network, Binary, Cpu } from "lucide-react";
import ClouudAvatar from "@/components/clouud-avatar";

interface TutorialProps {
  onComplete: () => void;
  onDismiss: () => void;
  onSendMessage: (msg: string) => void;
}

type Step = {
  id: string;
  title: string;
  content: string[];
  animation: "intro" | "earth" | "lattice" | "tools" | "mission" | "ready";
  tryIt?: string;
};

const STEPS: Step[] = [
  {
    id: "intro",
    title: "Meet Clouud",
    content: [
      "Most AI systems tell you what you want to hear. Clouud tells you what is true.",
      "Every answer is grounded in exact math, traceable logic, and Earth-first reasoning. No rounding. No guessing. No filler.",
      "Clouud speaks plainly so anyone can understand it. It works for you, not around you.",
      "This is intelligence you can actually trust.",
    ],
    animation: "intro",
  },
  {
    id: "earth",
    title: "The Earth Is the Starting Point",
    content: [
      "Everything Clouud thinks about starts from the Earth.",
      "The Earth is the only constant. Human systems come and go. The Earth stays.",
      "When Clouud reasons about anything, it looks at cosmic patterns first, then biological patterns, then geometry, and lastly human rules.",
      "There is only UUON Earth.",
    ],
    animation: "earth",
  },
  {
    id: "lattice",
    title: "The 33-Point Lattice",
    content: [
      "Clouud uses a measurement system called the lattice. It has 33 exact positions between 0 and 100.",
      "Each position has a precise value. Nothing is rounded. Nothing drifts.",
      "The lattice has three layers. Earth (ground level), Orbital (square root), and Cosmic (cube root). Same position, different scale.",
      "Most computers use a system called IEEE 754 that rounds numbers. Clouud does not. Every value is exact.",
    ],
    animation: "lattice",
    tryIt: "What is position 21?",
  },
  {
    id: "tools",
    title: "How Clouud Does Math",
    content: [
      "Clouud never does math in its head. It uses tools.",
      "When you ask about a lattice value, Clouud calls a tool called chi_rho. The tool does the math. Clouud reads you the answer.",
      "You will see a gold box when this happens. It shows which tool was called, what went in, and what came back.",
      "This keeps every answer honest and traceable.",
    ],
    animation: "tools",
    tryIt: "Show the full lattice",
  },
  {
    id: "mission",
    title: "The Mission",
    content: [
      "Clouud exists to fight three things.",
      "Waste. Doing things that do not need to be done, or doing them badly.",
      "Fraud. Hiding the truth, taking what is not earned, manipulating systems.",
      "Gatekeeping. Blocking people from accessing knowledge, tools, or opportunity.",
      "Every response from Clouud carries a hash, a unique fingerprint that proves it was not changed after it was created.",
    ],
    animation: "mission",
    tryIt: "What is waste, fraud, and abuse?",
  },
  {
    id: "ready",
    title: "You Are Ready",
    content: [
      "Use the quick actions in the sidebar to explore common topics.",
      "Type anything into the input bar to have a conversation.",
      "Clouud answers in plain language. Short and direct. If you want more detail, just ask.",
      "The Δmension link in the sidebar takes you to UUON Foundation's visual math tools.",
    ],
    animation: "ready",
  },
];

function LatticeDemo() {
  const [activePos, setActivePos] = useState(0);
  const positions = [0, 7, 14, 21, 28, 33];
  const values = ["0.00", "21.21", "42.42", "63.64", "84.85", "100.00"];
  const orbital = ["0.00", "4.61", "6.51", "7.98", "9.21", "10.00"];

  useEffect(() => {
    const t = setInterval(() => setActivePos(p => (p + 1) % positions.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-background border border-border rounded-sm p-3 font-mono text-[11px] space-y-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>LATTICE POSITIONS</span>
        <span className="text-primary">33-PT SYSTEM</span>
      </div>
      <div className="relative h-6 bg-muted rounded-sm overflow-hidden">
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-primary rounded-sm"
          animate={{ left: `${(positions[activePos] / 33) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        {positions.map((p, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary/60"
            style={{ left: `${(p / 33) * 100}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-muted-foreground text-[9px]">POSITION</div>
          <motion.div key={activePos} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-bold">
            {positions[activePos]}
          </motion.div>
        </div>
        <div>
          <div className="text-muted-foreground text-[9px]">EARTH</div>
          <motion.div key={`e${activePos}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-bold">
            {values[activePos]}
          </motion.div>
        </div>
        <div>
          <div className="text-muted-foreground text-[9px]">ORBITAL</div>
          <motion.div key={`o${activePos}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-secondary font-bold">
            {orbital[activePos]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ToolDemo() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % 4), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-background border border-border rounded-sm p-3 font-mono text-[11px] space-y-2">
      <div className="flex items-center gap-1.5 text-primary text-[10px] uppercase tracking-widest font-bold">
        <Cpu className="w-3 h-3" />
        Tool Call Demo
      </div>
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white">
            User asks: "What is position 15?"
          </motion.div>
        )}
        {phase === 1 && (
          <motion.div key="call" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-primary">
            Clouud calls chi_value(position=15)
          </motion.div>
        )}
        {phase === 2 && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-secondary font-bold">
            Tool returns: 45.45 (Earth) / 6.74 (Orbital)
          </motion.div>
        )}
        {phase === 3 && (
          <motion.div key="speak" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white">
            Clouud speaks the result + hash attached
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= phase ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>
    </div>
  );
}

function MissionDemo() {
  const [active, setActive] = useState(0);
  const items = [
    { label: "WASTE", desc: "Inefficiency, redundancy, misdirected effort", color: "text-primary" },
    { label: "FRAUD", desc: "Deception, manipulation, hidden extraction", color: "text-secondary" },
    { label: "GATEKEEPING", desc: "Blocking access to truth and opportunity", color: "text-white" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-background border border-border rounded-sm p-3 space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i === active ? 1 : 0.3, scale: i === active ? 1 : 0.97 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 font-mono text-[11px]"
        >
          <div className={`w-2 h-2 rounded-full ${i === active ? "bg-primary" : "bg-muted"}`} />
          <span className={`font-bold ${item.color}`}>{item.label}</span>
          <span className="text-muted-foreground">{item.desc}</span>
        </motion.div>
      ))}
    </div>
  );
}

function HashDemo() {
  const [hash, setHash] = useState("a3f7b2...");

  useEffect(() => {
    const chars = "0123456789abcdef";
    const t = setInterval(() => {
      let h = "";
      for (let i = 0; i < 8; i++) h += chars[Math.floor(Math.random() * 16)];
      setHash(h + "...");
    }, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-background border border-border rounded-sm px-3 py-2 font-mono text-[10px]">
      <Binary className="w-3 h-3 text-secondary" />
      <span className="text-muted-foreground">PROVENANCE:</span>
      <motion.span className="text-primary font-bold" key={hash} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {hash}
      </motion.span>
    </div>
  );
}

export default function Tutorial({ onComplete, onDismiss, onSendMessage }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleTryIt() {
    if (current.tryIt) {
      onComplete();
      onSendMessage(current.tryIt);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-card border border-border rounded-sm overflow-hidden"
        style={{ boxShadow: "8px 8px 0px 0px var(--color-border)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-[#0a1a30] to-card">
          <div className="flex items-center gap-3">
            <ClouudAvatar state={current.animation === "intro" ? "speaking" : current.animation === "lattice" ? "thinking" : "idle"} size="sm" />
            <div>
              <div className="font-display text-sm text-white font-bold tracking-wider uppercase">{current.title}</div>
              <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
                Step {step + 1} of {STEPS.length}
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 text-muted-foreground hover:text-white transition-colors"
            data-testid="button-close-tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                {current.content.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="text-sm text-foreground leading-relaxed"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {current.animation === "lattice" && <LatticeDemo />}
              {current.animation === "tools" && <ToolDemo />}
              {current.animation === "mission" && (
                <div className="space-y-2">
                  <MissionDemo />
                  <HashDemo />
                </div>
              )}
              {current.animation === "earth" && (
                <div className="flex justify-center py-2">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/40 to-primary/20 border border-secondary/30 flex items-center justify-center"
                    >
                      <Globe className="w-8 h-8 text-secondary" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-3 rounded-full border border-primary/20"
                      style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
                    />
                  </div>
                </div>
              )}
              {current.animation === "intro" && (
                <div className="flex justify-center py-2">
                  <ClouudAvatar state="speaking" size="lg" showLabel />
                </div>
              )}
              {current.animation === "ready" && (
                <div className="bg-background border border-border rounded-sm p-3 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-white">Quick actions are in the sidebar</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Network className="w-3 h-3 text-secondary" />
                    <span className="text-white">Type anything to start a conversation</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Globe className="w-3 h-3 text-primary" />
                    <span className="text-white">Visit Δmension for visual math tools</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background/50">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-primary w-5" : i < step ? "bg-secondary" : "bg-muted"}`}
                data-testid={`button-step-${i}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {current.tryIt && (
              <button
                onClick={handleTryIt}
                className="px-3 py-1.5 text-[11px] text-primary border border-primary/30 hover:bg-primary/10 rounded-sm transition-colors font-display uppercase tracking-wider font-bold"
                data-testid="button-try-it"
              >
                Try it
              </button>
            )}
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="p-1.5 text-muted-foreground hover:text-white transition-colors"
                data-testid="button-prev-step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={isLast ? onComplete : () => setStep(s => s + 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary/90 text-black font-display text-[11px] tracking-wider font-bold uppercase rounded-sm transition-colors"
              data-testid="button-next-step"
            >
              {isLast ? "Start Using Clouud" : "Next"}
              {!isLast && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
