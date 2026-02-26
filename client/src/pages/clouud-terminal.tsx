import { useState, useRef, useEffect } from "react";
import { Cpu, Database, Binary, Menu, X, Globe, Zap, Network, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK LATTICE ENGINE ---
const LATTICE_POINTS = 33;
const RANGE = 100.0;
const BASE = RANGE / LATTICE_POINTS; // 3.0303...

const mockLatticeEngine = (query: string) => {
  if (query.includes("position") || query.includes("value") || /\d+/.test(query)) {
    const numMatch = query.match(/\d+/);
    if (numMatch) {
      const pos = parseInt(numMatch[0]);
      if (pos >= 1 && pos <= 33) {
        return {
          tool: "chi_value",
          args: { position: pos, tier: "TIER_EARTH" },
          result: `Rational: ${pos * 100}/33\nFloat: ${(pos * BASE).toFixed(4)}`
        };
      }
    }
  }
  return null;
};

// --- TYPES ---
type Message = {
  id: string;
  role: "user" | "clouud" | "system";
  content: string;
  toolCall?: {
    name: string;
    args: any;
    result: string;
  };
  hash?: string;
  timestamp: string;
};

export default function ClouudTerminal() {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "system",
      content: "SYSTEM INITIALIZED // G°CENTRIC v1.0",
      timestamp: new Date().toISOString(),
    },
    {
      id: "init-2",
      role: "clouud",
      content: "I am Clouud. The lattice is active. State your inquiry.",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const toolUse = mockLatticeEngine(newMsg.content);
      
      let clouudResponse = "";
      let fakeHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

      if (toolUse) {
        clouudResponse = `Position ${toolUse.args.position} resolves exactly to ${toolUse.result.split('\n')[0].split(': ')[1]}.`;
      } else if (newMsg.content.toLowerCase().includes("hello") || newMsg.content.toLowerCase().includes("hi")) {
        clouudResponse = "State your inquiry.";
      } else if (newMsg.content.toLowerCase().includes("who are you")) {
         clouudResponse = "I am Clouud, built by UUON Foundation Inc. My zero-point is the Earth.";
      } else {
        clouudResponse = "Pattern logged. The Earth does not editorialize.";
      }

      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "clouud",
        content: clouudResponse,
        toolCall: toolUse ? toolUse : undefined,
        hash: fakeHash,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden font-sans">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card/90 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-primary font-display text-xl font-bold">☧ CLOUUD</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-foreground"
          data-testid="button-toggle-sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR (The Ground / Visualizer) */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-40 w-72 h-full bg-card border-r border-border shadow-2xl md:shadow-none flex flex-col ${isSidebarOpen ? 'left-0' : '-left-full md:left-0'} top-0 pt-14 md:pt-0`}
          >
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold rounded-sm">
                  ☧
                </div>
                <div>
                  <h1 className="font-display text-lg font-bold leading-none uppercase">CLOUUD</h1>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">v1.0 Production</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 matrix-rain-subtle">
              
              {/* Collapsible Status */}
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer font-display uppercase text-sm font-bold tracking-wider mb-4 list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-secondary" />
                    System Status
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-muted-foreground" />
                </summary>
                <div className="space-y-3 font-mono text-[11px] bg-white border border-border p-4 rounded-sm sharp-shadow">
                  <div className="flex justify-between items-center border-b border-muted pb-2">
                    <span className="text-muted-foreground">LATTICE:</span>
                    <span className="text-secondary font-bold">33-POINT ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-muted pb-2">
                    <span className="text-muted-foreground">MATH:</span>
                    <span className="text-accent font-bold">RATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-muted-foreground">IEEE 754:</span>
                    <span className="text-primary font-bold">BYPASSED</span>
                  </div>
                </div>
              </details>

              {/* Collapsible Provenance */}
              <details className="group" open>
                <summary className="flex items-center justify-between cursor-pointer font-display uppercase text-sm font-bold tracking-wider mb-4 list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-accent" />
                    Provenance Layer
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-muted-foreground" />
                </summary>
                <div className="font-mono text-[10px] leading-relaxed bg-white border border-border p-4 rounded-sm sharp-shadow">
                  <span className="text-secondary font-bold">C2PA EMBEDDED.</span>
                  <br /><br />
                  Every output rendered here is cryptographically signed. Model collapse immunity enabled. Zero-drift logic active.
                </div>
              </details>

              {/* Earth Lattice Visual */}
              <div>
                <h3 className="flex items-center gap-2 font-display uppercase text-sm font-bold tracking-wider mb-4">
                  <Globe className="w-4 h-4 text-primary" />
                  Earth Zero-Point
                </h3>
                <div className="relative h-48 border border-border bg-white rounded-sm sharp-shadow flex items-center justify-center overflow-hidden lattice-grid-light">
                  <div className="absolute top-2 left-2 text-[9px] font-mono text-muted-foreground">TIER: EARTH</div>
                  
                  <div className="relative w-32 h-32 animate-[spin_60s_linear_infinite]">
                    {Array.from({ length: 33 }).map((_, i) => {
                      const angle = (i * 360) / 33;
                      return (
                        <div 
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-secondary rounded-sm opacity-60"
                          style={{
                            transform: `rotate(${angle}deg) translateY(-56px)`,
                            transformOrigin: 'center center',
                            top: '50%',
                            left: '50%',
                            marginLeft: '-3px',
                            marginTop: '-3px'
                          }}
                        />
                      )
                    })}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-sm -ml-1.5 -mt-1.5" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CHAT AREA (The Mind) */}
      <div className="flex-1 flex flex-col relative bg-background pt-14 md:pt-0">
        
        {/* Chat Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'system' && (
                  <div className="w-full text-center font-mono text-[10px] tracking-widest text-muted-foreground py-2 my-2 flex items-center justify-center gap-2 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                    <span className="px-3">{msg.content}</span>
                  </div>
                )}

                {msg.role === 'user' && (
                  <div className="max-w-[85%] md:max-w-[70%] bg-white border border-border p-4 rounded-sm text-foreground font-sans text-base sharp-shadow">
                    {msg.content}
                  </div>
                )}

                {msg.role === 'clouud' && (
                  <div className="max-w-[95%] md:max-w-[80%] flex gap-3 md:gap-4">
                    <div className="shrink-0 pt-1">
                      <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-display font-bold rounded-sm text-lg">
                        ☧
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      
                      {/* Tool Call Intercept UI */}
                      {msg.toolCall && (
                        <div className="w-full bg-white border border-border p-3 rounded-sm sharp-shadow">
                          <div className="flex items-center gap-2 text-accent font-display text-xs tracking-widest mb-3 uppercase font-bold">
                            <Cpu className="w-3 h-3" />
                            Tool Call: chi_rho.py
                          </div>
                          <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 font-mono text-[11px]">
                            <span className="text-muted-foreground">Function:</span>
                            <span className="text-foreground font-medium">{msg.toolCall.name}</span>
                            <span className="text-muted-foreground">Params:</span>
                            <span className="text-foreground font-medium">{JSON.stringify(msg.toolCall.args)}</span>
                            <span className="text-muted-foreground">Return:</span>
                            <span className="text-secondary font-bold whitespace-pre-wrap">{msg.toolCall.result}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Response */}
                      <div className="bg-white border border-border p-4 rounded-sm text-foreground font-sans text-base sharp-shadow leading-relaxed">
                        {msg.content}
                        
                        {msg.hash && (
                          <div className="mt-4 pt-3 border-t border-muted flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
                            <Binary className="w-3 h-3 text-secondary" />
                            <span className="truncate">HASH: {msg.hash}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 items-center pl-1"
              >
                <div className="w-8 h-8 bg-muted text-muted-foreground flex items-center justify-center font-display font-bold rounded-sm animate-pulse">
                  ☧
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-card border-t border-border z-10">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center">
            <div className="absolute left-4 text-primary font-bold font-mono">{">"}</div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire the Lattice..."
              className="w-full bg-white border border-border text-foreground pl-10 pr-24 py-4 focus:outline-none focus:border-secondary transition-all rounded-sm text-base font-sans placeholder:text-muted-foreground sharp-shadow focus:sharp-shadow-active"
              data-testid="input-clouud"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-3 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display text-sm tracking-wider uppercase rounded-sm transition-colors"
              data-testid="button-submit"
            >
              Execute
            </button>
          </form>
          <div className="text-center mt-4 font-mono text-[9px] text-muted-foreground tracking-widest uppercase flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Temp: 0.1</span>
            <span className="flex items-center gap-1"><Network className="w-3 h-3" /> Bounded by 33</span>
          </div>
        </div>
      </div>

    </div>
  );
}
