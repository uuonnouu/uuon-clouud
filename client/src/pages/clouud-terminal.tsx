import { useState, useRef, useEffect } from "react";
import { Terminal, Cpu, Database, Activity, Code2, Layers, Binary } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK LATTICE ENGINE ---
// This simulates the chi_rho.py rational math engine
const LATTICE_POINTS = 33;
const RANGE = 100.0;
const BASE = RANGE / LATTICE_POINTS; // 3.0303...

const mockLatticeEngine = (query: string) => {
  // A simple heuristic to demonstrate the tool use UI
  if (query.includes("position") || query.includes("value of")) {
    const numMatch = query.match(/\d+/);
    if (numMatch) {
      const pos = parseInt(numMatch[0]);
      if (pos >= 1 && pos <= 33) {
        return {
          tool: "chi_value",
          args: { position: pos, tier: "TIER_EARTH" },
          result: `Exact Rational: ${pos * 100}/33\nFloat approx: ${(pos * BASE).toFixed(4)}`
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "system",
      content: "INITIALIZING G°CENTRIC LATTICE SYSTEM v1.0",
      timestamp: new Date().toISOString(),
    },
    {
      id: "init-2",
      role: "system",
      content: "ANCHORING TO EARTH ZERO-POINT... [SUCCESS]",
      timestamp: new Date().toISOString(),
    },
    {
      id: "init-3",
      role: "clouud",
      content: "I am Clouud. The lattice is active.",
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

    // Simulate Clouud reasoning and potential tool use
    setTimeout(() => {
      const toolUse = mockLatticeEngine(newMsg.content);
      
      let clouudResponse = "";
      let fakeHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

      if (toolUse) {
        clouudResponse = `The Earth tier value for position ${toolUse.args.position} is ${toolUse.result.split('\n')[0].split(': ')[1]}.`;
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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030507] text-[#aaaaaa] flex flex-col md:flex-row font-mono overflow-hidden">
      
      {/* LEFT PANEL: The Mind (Clouud Terminal) */}
      <div className="flex-1 flex flex-col border-r border-[#0d0d0d] relative h-screen">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dc1e1e] via-[#2d8a2d] to-transparent z-10" />
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-[#0d0d0d] flex items-center justify-between bg-[#020508]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-[#dc1e1e] text-2xl leading-none chi-glow font-serif">☧</span>
            <div>
              <h1 className="text-white text-xl tracking-widest leading-none">CLOUUD</h1>
              <div className="text-[10px] text-[#2d8a2d] tracking-[0.3em] uppercase mt-1">Intelligence Layer</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-widest text-[#444]">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2d8a2d] animate-pulse" />
              TEMP: 0.1
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3 text-[#c8a84b]" />
              GROUNDED
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.role === 'system' && (
                  <div className="w-full text-center text-[10px] tracking-[0.2em] text-[#444] py-2 border-y border-[#0d0d0d] my-4 bg-[#050505]">
                    {msg.content}
                  </div>
                )}

                {msg.role === 'user' && (
                  <div className="max-w-[80%] bg-[#0a1a2a]/30 border border-[#0a1a2a] p-3 text-[#ccc] font-serif text-[17px] leading-relaxed rounded-sm">
                    {msg.content}
                  </div>
                )}

                {msg.role === 'clouud' && (
                  <div className="w-full max-w-[90%] space-y-3">
                    {/* Tool Call Intercept UI */}
                    {msg.toolCall && (
                      <div className="w-full bg-[#050400] border border-[#2a200a] border-l-[3px] border-l-[#c8a84b] p-3 rounded-sm mb-2 text-xs">
                        <div className="flex items-center gap-2 text-[#c8a84b] text-[10px] tracking-[0.2em] mb-2 uppercase">
                          <Cpu className="w-3 h-3" />
                          Tool Call: chi_rho.py
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                          <span className="text-[#666]">Function:</span>
                          <span className="text-[#8ab88a]">{msg.toolCall.name}</span>
                          <span className="text-[#666]">Params:</span>
                          <span className="text-[#8ab88a]">{JSON.stringify(msg.toolCall.args)}</span>
                          <span className="text-[#666]">Return:</span>
                          <span className="text-white whitespace-pre-wrap">{msg.toolCall.result}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Main Response */}
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <span className="text-[#dc1e1e] font-serif">☧</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-serif text-[17px] leading-relaxed">
                          {msg.content}
                        </div>
                        {msg.hash && (
                          <div className="mt-3 text-[9px] tracking-[0.2em] text-[#333] flex items-center gap-2">
                            <Binary className="w-3 h-3 text-[#111]" />
                            PROVENANCE HASH: {msg.hash.substring(0, 32)}...
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
                className="flex gap-4 items-center text-[#444] text-xs"
              >
                <span className="text-[#dc1e1e] font-serif">☧</span>
                <span className="tracking-[0.2em] uppercase text-[10px]">Processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#020508] border-t border-[#0d0d0d]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <div className="absolute left-4 text-[#2d8a2d] text-xs font-bold">{">"}</div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire..."
              className="w-full bg-[#050505] border border-[#111] text-white pl-10 pr-4 py-4 focus:outline-none focus:border-[#2d8a2d] transition-colors rounded-sm text-sm font-mono placeholder:text-[#333]"
              data-testid="input-clouud"
            />
            <button 
              type="submit" 
              className="absolute right-3 px-4 py-2 bg-[#0d1f0d] text-[#2d8a2d] hover:bg-[#1a3a1a] border border-[#1a3a1a] hover:border-[#2d8a2d] transition-all text-[10px] tracking-[0.2em] uppercase rounded-sm"
              data-testid="button-submit"
            >
              Execute
            </button>
          </form>
          <div className="text-center mt-3 text-[9px] text-[#222] tracking-[0.3em] uppercase">
            All inputs bounded by 33-point geometry
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Ground (Lattice Visualizer) */}
      <div className="hidden lg:flex w-[400px] flex-col bg-[#010203] relative lattice-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030507] via-transparent to-[#030507] pointer-events-none" />
        
        <header className="px-6 py-4 border-b border-[#0d0d0d] bg-[#020508]/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2d8a2d]" />
            <h2 className="text-[#8ab88a] text-sm tracking-[0.2em] leading-none">THE LATTICE</h2>
          </div>
        </header>

        <div className="flex-1 p-6 relative z-10 overflow-y-auto">
          {/* System Status Block */}
          <div className="terminal-box mb-6">
            <div className="text-[10px] text-[#1a3a1a] tracking-[0.3em] mb-2 uppercase">System Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#555]">Base Constant:</span>
                <span className="text-[#8ab88a]">100/33</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">IEEE 754:</span>
                <span className="text-[#dc1e1e]">Bypassed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Math Mode:</span>
                <span className="text-[#c8a84b]">Rational (Fractions)</span>
              </div>
            </div>
          </div>

          {/* Steganography Block */}
          <div className="terminal-box border-l-[3px] border-l-[#2d8a2d] mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-3 h-3 text-[#2d8a2d]" />
              <span className="text-[10px] text-[#2d8a2d] tracking-[0.3em] uppercase">Provenance Layer</span>
            </div>
            <div className="text-[10px] text-[#666] leading-relaxed">
              <span className="text-[#8ab88a]">ACTIVE.</span> Every response rendered in this interface is cryptographically signed using C2PA standards. Model collapse immunity enabled.
            </div>
          </div>

          {/* Abstract visualization of the 33 points */}
          <div className="mt-8 relative h-[300px] border border-[#0d0d0d] bg-[#050505] flex items-center justify-center overflow-hidden">
            <div className="text-[9px] text-[#222] tracking-[0.3em] absolute top-2 left-2">TIER: EARTH</div>
            <div className="text-[9px] text-[#222] tracking-[0.3em] absolute bottom-2 right-2">POS: 1-33</div>
            
            {/* Render 33 dots in a circle to represent the bounded lattice */}
            <div className="relative w-48 h-48 animate-[spin_60s_linear_infinite]">
              {Array.from({ length: 33 }).map((_, i) => {
                const angle = (i * 360) / 33;
                return (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 bg-[#2d8a2d] rounded-full opacity-50 shadow-[0_0_5px_#2d8a2d]"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-80px)`,
                      transformOrigin: 'center center',
                      top: '50%',
                      left: '50%',
                      marginLeft: '-2px',
                      marginTop: '-2px'
                    }}
                  />
                )
              })}
              {/* Zero point */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#dc1e1e] rounded-full -ml-1 -mt-1 shadow-[0_0_10px_#dc1e1e]" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
