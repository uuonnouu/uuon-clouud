import { useState, useRef, useEffect } from "react";
import { Cpu, Binary, Menu, X, Globe, Zap, Network, ChevronRight, Plus, Trash2, MessageCircle, Loader2, Activity, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClouudAvatar from "@/components/clouud-avatar";
import Tutorial from "@/components/tutorial";
import uuonLogo from "@assets/A7950814-2592-4E7D-858F-3AEB1D632F98_1772064571557.png";

type Message = {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  toolCall: string | null;
  hash: string | null;
  createdAt: string;
};

type Conversation = {
  id: number;
  title: string;
  createdAt: string;
};

const QUICK_ACTIONS = [
  "About Us",
  "Tell me about the founder",
  "What is waste, fraud, and abuse?",
  "What is Δmension?",
  "How does the lattice work?",
  "What is position 21?",
  "Show the full lattice",
  "What makes UUON different?",
  "How can I help improve Earth?",
  "Explain the 33-point system",
  "What problems are you solving?",
  "What is IEEE 754?",
  "Why does rounding matter?",
  "Tell me about the 3D models",
  "What does UUON mean?",
];

export default function ClouudTerminal() {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiState, setAiState] = useState<"idle" | "thinking" | "speaking">("idle");
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("clouud-tutorial-done");
    }
    return false;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function loadConversations() {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
      if (data.length > 0) {
        setActiveConvo(data[0].id);
        await loadMessages(data[0].id);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }

  async function loadMessages(convoId: number) {
    try {
      const res = await fetch(`/api/conversations/${convoId}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch {
      setMessages([]);
    }
  }

  async function createConversation() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Session" }),
      });
      const convo = await res.json();
      setConversations(prev => [convo, ...prev]);
      setActiveConvo(convo.id);
      setMessages([]);
      setIsSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }

  async function deleteConversation(id: number) {
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConvo === id) {
        const remaining = conversations.filter(c => c.id !== id);
        if (remaining.length > 0) {
          setActiveConvo(remaining[0].id);
          await loadMessages(remaining[0].id);
        } else {
          setActiveConvo(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  }

  async function selectConversation(id: number) {
    setActiveConvo(id);
    await loadMessages(id);
    setIsSidebarOpen(false);
  }

  function handleQuickAction(label: string) {
    setInput(label);
  }

  function completeTutorial() {
    localStorage.setItem("clouud-tutorial-done", "true");
    setShowTutorial(false);
  }

  function dismissTutorial() {
    setShowTutorial(false);
  }

  function handleTutorialSend(msg: string) {
    completeTutorial();
    setTimeout(() => sendMessage(msg), 100);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;

    let convoId = activeConvo;
    if (!convoId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: text.slice(0, 50) }),
        });
        const convo = await res.json();
        setConversations(prev => [convo, ...prev]);
        convoId = convo.id;
        setActiveConvo(convo.id);
      } catch {
        return;
      }
    }

    const tempUserMsg: Message = {
      id: Date.now(),
      conversationId: convoId!,
      role: "user",
      content: text,
      toolCall: null,
      hash: null,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setInput("");
    setIsTyping(true);
    setAiState("thinking");

    try {
      const res = await fetch(`/api/conversations/${convoId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }

      setAiState("speaking");
      const data = await res.json();
      
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [...withoutTemp, data.userMessage, data.assistantMessage];
      });

      setTimeout(() => setAiState("idle"), 2000);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          conversationId: convoId!,
          role: "assistant",
          content: `System error: ${err.message}`,
          toolCall: null,
          hash: null,
          createdAt: new Date().toISOString(),
        }
      ]);
      setAiState("idle");
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <ClouudAvatar state="thinking" size="lg" />
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden font-sans">
      
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card/90 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ClouudAvatar state={aiState} size="sm" />
          <span className="text-white font-display text-lg font-bold tracking-widest" data-testid="text-app-name">CLOUUD</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-foreground"
          data-testid="button-toggle-sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {(isSidebarOpen || typeof window !== 'undefined') && (
          <motion.div 
            initial={false}
            className={`${isSidebarOpen ? 'fixed z-40' : 'hidden md:flex relative'} w-72 h-full bg-card border-r border-border shadow-2xl md:shadow-none flex-col top-0 pt-14 md:pt-0`}
          >
            <div className="relative p-4 border-b border-border bg-gradient-to-b from-[#0a1a30] to-card overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <img src={uuonLogo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <img src={uuonLogo} alt="UUON" className="w-9 h-9 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(240,185,59,0.2)]" />
                <div>
                  <h1 className="font-display text-base text-white font-bold leading-none tracking-widest">UUON CLOUUD</h1>
                  <span className="font-mono text-[9px] text-primary uppercase tracking-widest">G°centric v1.0</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b border-border">
                <button 
                  onClick={createConversation}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-black font-display text-xs tracking-wider font-bold uppercase rounded-sm transition-colors"
                  data-testid="button-new-session"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Session
                </button>
              </div>

              <div className="p-3 space-y-0.5">
                <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-2 px-1">Sessions</div>
                {conversations.map(convo => (
                  <div 
                    key={convo.id}
                    className={`group flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-all border text-xs ${
                      activeConvo === convo.id 
                        ? 'bg-muted border-primary/30' 
                        : 'border-transparent hover:bg-muted/50 hover:border-border'
                    }`}
                    onClick={() => selectConversation(convo.id)}
                    data-testid={`card-conversation-${convo.id}`}
                  >
                    <MessageCircle className={`w-3.5 h-3.5 shrink-0 ${activeConvo === convo.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="flex-1 truncate">{convo.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(convo.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-primary transition-all"
                      data-testid={`button-delete-${convo.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-xs font-mono">
                    No sessions yet.
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-border">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer font-display uppercase text-[10px] font-bold tracking-wider text-white list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-secondary" />
                      System Status
                    </div>
                    <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90 text-muted-foreground" />
                  </summary>
                  <div className="space-y-1.5 font-mono text-[10px] bg-background border border-border p-2.5 rounded-sm mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">LATTICE:</span>
                      <span className="text-secondary font-bold">33-PT ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">MATH:</span>
                      <span className="text-primary font-bold">RATIONAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">IEEE 754:</span>
                      <span className="text-white font-bold">BYPASSED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">TEMP:</span>
                      <span className="text-secondary font-bold">0.1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">GUARD:</span>
                      <span className="text-primary font-bold">DRIFT CHECK ON</span>
                    </div>
                  </div>
                </details>
              </div>

              <div className="p-3 border-t border-border">
                <details className="group" open>
                  <summary className="flex items-center justify-between cursor-pointer font-display uppercase text-[10px] font-bold tracking-wider text-white list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-primary" />
                      Quick Actions
                    </div>
                    <ChevronRight className="w-3 h-3 transition-transform group-open:rotate-90 text-muted-foreground" />
                  </summary>
                  <div className="mt-2 max-h-60 overflow-y-auto space-y-1 pr-1">
                    {QUICK_ACTIONS.map((label, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(label)}
                        className="w-full text-left px-2 py-1.5 text-[11px] text-muted-foreground hover:text-white bg-background hover:bg-muted/60 border border-transparent hover:border-border rounded-sm transition-all leading-tight"
                        data-testid={`button-quick-${i}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </details>
              </div>

              <div className="p-3 border-t border-border space-y-1.5">
                <a
                  href="https://uuon-foundation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-2 text-[11px] text-primary hover:text-white bg-background hover:bg-muted/60 border border-border hover:border-primary/30 rounded-sm transition-all"
                  data-testid="link-dmension"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  Δmension — Mathematical Universe
                </a>
                <button
                  onClick={() => setShowTutorial(true)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-[11px] text-secondary hover:text-white bg-background hover:bg-muted/60 border border-border hover:border-secondary/30 rounded-sm transition-all"
                  data-testid="button-open-tutorial"
                >
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                  Interactive Tutorial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative bg-background pt-14 md:pt-0">
        
        {messages.length === 0 && !isTyping && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <ClouudAvatar state={aiState} size="hero" showLabel />
              <h2 className="font-display text-3xl md:text-4xl text-white tracking-widest mt-5 mb-2">
                CLOUUD
              </h2>
              <p className="text-muted-foreground/60 text-xs font-mono mb-6">There is only UUON Earth.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                {[
                  { label: "About Us", icon: <Globe className="w-3.5 h-3.5 text-primary shrink-0" /> },
                  { label: "Waste, fraud, and abuse", icon: <Zap className="w-3.5 h-3.5 text-secondary shrink-0" /> },
                  { label: "Build something for Earth", icon: <Network className="w-3.5 h-3.5 text-primary shrink-0" /> },
                ].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(prompt.label)}
                    className="flex items-center gap-2 px-2.5 py-2 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors text-xs text-muted-foreground hover:text-white"
                    data-testid={`button-prompt-${i}`}
                  >
                    {prompt.icon}
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' && (
                    <div className="max-w-[85%] md:max-w-[70%] bg-card border border-border p-3 rounded-sm text-foreground text-sm" style={{ boxShadow: '4px 4px 0px 0px var(--color-border)' }}>
                      {msg.content}
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="max-w-[95%] md:max-w-[80%] flex gap-3">
                      <div className="shrink-0 pt-1">
                        <ClouudAvatar state={msg.id === messages[messages.length - 1]?.id && aiState === "speaking" ? "speaking" : "idle"} size="sm" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="font-mono text-[9px] text-primary tracking-widest uppercase">Clouud</div>
                        
                        {msg.toolCall && (() => {
                          try {
                            const tc = JSON.parse(msg.toolCall);
                            return (
                              <div className="w-full bg-card border border-border p-2.5 rounded-sm" style={{ boxShadow: '4px 4px 0px 0px rgba(240,185,59,0.15)' }}>
                                <div className="flex items-center gap-1.5 text-primary font-display text-[10px] tracking-widest mb-2 uppercase font-bold">
                                  <Cpu className="w-3 h-3" />
                                  Tool: {tc.name}
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5 font-mono text-[10px]">
                                  <span className="text-muted-foreground">Input:</span>
                                  <span className="text-white">{JSON.stringify(tc.args)}</span>
                                  <span className="text-muted-foreground">Output:</span>
                                  <span className="text-secondary font-bold whitespace-pre-wrap">{typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result)}</span>
                                </div>
                              </div>
                            );
                          } catch { return null; }
                        })()}
                        
                        <div className="bg-card border border-border p-3 rounded-sm text-white text-sm leading-relaxed whitespace-pre-wrap" style={{ boxShadow: '4px 4px 0px 0px rgba(20,42,69,1)' }}>
                          {msg.content}
                          
                          {msg.hash && (
                            <div className="mt-3 pt-2 border-t border-muted flex items-center gap-1.5 font-mono text-[8px] text-muted-foreground">
                              <Binary className="w-2.5 h-2.5 text-secondary" />
                              <span className="truncate uppercase tracking-widest">{msg.hash}</span>
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
                  className="flex gap-3 items-center pl-1"
                >
                  <ClouudAvatar state="thinking" size="sm" />
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-primary tracking-widest uppercase">Clouud</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="p-3 md:p-4 bg-card border-t border-border z-10">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center">
            <div className="absolute left-3 text-primary font-bold font-mono text-sm">{">"}</div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Clouud..."
              disabled={isTyping}
              className="w-full bg-background border border-border text-white pl-8 pr-24 py-3 focus:outline-none focus:border-primary transition-all rounded-sm text-sm placeholder:text-muted-foreground disabled:opacity-50"
              style={{ boxShadow: '4px 4px 0px 0px var(--color-border)' }}
              data-testid="input-clouud"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 px-3 py-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-display text-xs tracking-wider font-bold uppercase rounded-sm transition-colors"
              data-testid="button-submit"
            >
              {isTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send"}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showTutorial && (
          <Tutorial onComplete={completeTutorial} onDismiss={dismissTutorial} onSendMessage={handleTutorialSend} />
        )}
      </AnimatePresence>

    </div>
  );
}
