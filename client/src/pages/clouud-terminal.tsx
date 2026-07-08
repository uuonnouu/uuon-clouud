import { useState, useRef, useEffect } from "react";
import { Cpu, Binary, Menu, X, Globe, Zap, Network, ChevronRight, Plus, Trash2, MessageCircle, Loader2, Activity, HelpCircle, Undo2, Scale, Paperclip, Link2, Mic, MicOff, Brain, Volume2, VolumeX, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import ClouudAvatar from "@/components/clouud-avatar";
import Tutorial from "@/components/tutorial";
import MetricsPanel from "@/components/metrics-panel";
import ExplorationEngine from "@/components/exploration-engine";
import DynamicBackground from "@/components/dynamic-background";
import { encodeZWC } from "@/lib/zwc-fingerprint";
import { crystalGet, crystalSet, crystalGetSync, crystalSetSync, crystalIncrement } from "@/lib/crystal";
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
  "Who is Clouud?",
  "What is Clouud?",
  "Teach me about your interests",
  "How can we enhance Earth?",
  "What is waste, fraud, and abuse?",
  "What is Δmension?",
  "How does the lattice work?",
  "How can I help the Earth today?",
  "What patterns connect everything?",
  "Enhance my project",
  "What problems are you solving?",
  "Show me something surprising",
  "How do rivers and networks relate?",
  "Tell me about the 3D models",
  "What does UUON mean?",
  "Who built this?",
];

export default function ClouudTerminal() {
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiState, setAiState] = useState<"idle" | "thinking" | "speaking">("idle");
  const [showTutorial, setShowTutorial] = useState(() => {
    return !crystalGetSync("clouud-tutorial-done", false);
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return crystalGetSync("clouud-auto-speak", false);
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showDmension, setShowDmension] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [msgAssessments, setMsgAssessments] = useState<Record<number, { score: number; flags: string[]; wordCount: number }>>({});
  const [generatedImages, setGeneratedImages] = useState<Record<string, { url: string; concept: string; status: string }>>({});
  const [visualSummary, setVisualSummary] = useState<{ concept: string; shapeType: string; parameters: any } | null>(null);
  const [hashingIntensity, setHashingIntensity] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<number, string>>({});
  const [copiedMsgId, setCopiedMsgId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeakingRef = useRef(false);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imagePollingRefs = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  useEffect(() => {
    loadConversations();
    crystalIncrement("session-count").catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      imagePollingRefs.current.forEach(id => clearInterval(id));
      imagePollingRefs.current.clear();
    };
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
      
      for (const msg of data) {
        if (msg.role === 'assistant' && msg.toolCall) {
          try {
            const tc = typeof msg.toolCall === 'string' ? JSON.parse(msg.toolCall) : msg.toolCall;
            if (tc?.name === 'generate_image' && tc?.result?.imageId) {
              const imageId = tc.result.imageId;
              const statusRes = await fetch(`/api/images/status/${imageId}`);
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.status === "complete" && statusData.url) {
                  setGeneratedImages(prev => ({
                    ...prev,
                    [imageId]: { url: statusData.url, concept: statusData.concept || tc.args?.concept || imageId, status: "complete" }
                  }));
                }
              }
            }
          } catch {}
        }
      }
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
      const remaining = conversations.filter(c => c.id !== id);
      setConversations(remaining);
      if (activeConvo === id) {
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
    sendMessage(label);
    setIsSidebarOpen(false);
  }

  function completeTutorial() {
    crystalSetSync("clouud-tutorial-done", true);
    crystalSet("clouud-tutorial-done", "true");
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
      
      if (convoId !== activeConvo && activeConvo !== null) {
        return;
      }

      for (let i = 1; i <= 12; i++) {
        setTimeout(() => setHashingIntensity(i / 12), i * 100);
      }
      setTimeout(() => setHashingIntensity(0), 4000);
      
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMsg.id);
        return [...withoutTemp, data.userMessage, data.assistantMessage];
      });

      if (data.selfAssessment) {
        setMsgAssessments(prev => ({
          ...prev,
          [data.assistantMessage.id]: {
            score: data.selfAssessment.score,
            flags: data.selfAssessment.flags,
            wordCount: data.selfAssessment.wordCount,
          }
        }));
      }

      if (data.pendingImages && data.pendingImages.length > 0) {
        for (const img of data.pendingImages) {
          setGeneratedImages(prev => ({
            ...prev,
            [img.id]: { url: "", concept: img.concept, status: "generating" }
          }));
          triggerImageGeneration(img.id, img.concept);
        }
      }

      if (autoSpeak && data.assistantMessage?.content) {
        setTimeout(() => speakMessage(data.assistantMessage.id, data.assistantMessage.content), 300);
      }
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

  async function handleUndo() {
    if (!activeConvo || isTyping || messages.length < 2) return;
    try {
      const res = await fetch(`/api/conversations/${activeConvo}/messages/last`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.slice(0, -2));
        setInput(data.lastUserContent || "");
      }
    } catch {}
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (activeConvo) formData.append("conversationId", String(activeConvo));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const contextMsg = `[Uploaded file: ${data.originalName} (${(data.size / 1024).toFixed(1)}KB)]\n\n${data.extractedText}`;
      setInput(prev => prev ? `${prev}\n\n${contextMsg}` : contextMsg);
    } catch (err: any) {
      setInput(prev => prev + `\n[Upload failed: ${err.message}]`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleScrapeLink() {
    if (!linkUrl.trim()) return;
    setIsScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl.trim() }),
      });
      if (!res.ok) throw new Error("Scrape failed");
      const data = await res.json();
      const title = data.title ? ` — ${data.title}` : "";
      const contextMsg = `[Scraped: ${linkUrl}${title}]\n\n${data.extractedText}`;
      setInput(prev => prev ? `${prev}\n\n${contextMsg}` : contextMsg);
      setShowLinkInput(false);
      setLinkUrl("");
    } catch (err: any) {
      setInput(prev => prev + `\n[Scrape failed: ${err.message}]`);
    } finally {
      setIsScraping(false);
    }
  }

  function toggleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput(prev => prev + "[Voice input not supported in this browser]");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    const MIN_CONFIDENCE = 0.6;

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          if (result[0].confidence >= MIN_CONFIDENCE) {
            finalTranscript += result[0].transcript + " ";
          }
        } else {
          if (result[0].confidence >= MIN_CONFIDENCE || result[0].confidence === 0) {
            interim += result[0].transcript;
          }
        }
      }
      setInput(prev => {
        const base = prev.replace(/\[listening\.\.\.\][\s\S]*$/, "").trimEnd();
        const voiceText = (finalTranscript + interim).trim();
        return base ? `${base} ${voiceText}` : voiceText;
      });
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  async function triggerImageGeneration(imageId: string, concept: string) {
    try {
      await fetch(`/api/images/generate/${imageId}`, { method: "POST" });
      
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/images/status/${imageId}`);
          const data = await res.json();
          
          if (data.status === "complete" && data.url) {
            clearInterval(pollInterval);
            imagePollingRefs.current.delete(pollInterval);
            setGeneratedImages(prev => ({
              ...prev,
              [imageId]: { url: data.url, concept, status: "complete" }
            }));
          } else if (data.status === "failed") {
            clearInterval(pollInterval);
            imagePollingRefs.current.delete(pollInterval);
            setGeneratedImages(prev => ({
              ...prev,
              [imageId]: { url: "", concept, status: "failed" }
            }));
          }
        } catch {
          clearInterval(pollInterval);
          imagePollingRefs.current.delete(pollInterval);
        }
      }, 2000);
      
      imagePollingRefs.current.add(pollInterval);
      setTimeout(() => { clearInterval(pollInterval); imagePollingRefs.current.delete(pollInterval); }, 120000);
    } catch (err) {
      console.error("Image generation trigger failed:", err);
    }
  }

  function stopSpeaking() {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    window.speechSynthesis.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  }

  async function submitFeedback(msgId: number, response: "helped" | "partial" | "missed") {
    if (feedbackSubmitted[msgId]) return;
    try {
      const msg = messages.find(m => m.id === msgId);
      const assessment = msgAssessments[msgId];
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: msgId,
          conversationId: msg?.conversationId || activeConvo,
          response,
          saScore: assessment?.score ?? null,
          hash: msg?.hash ?? null,
        }),
      });
      setFeedbackSubmitted(prev => ({ ...prev, [msgId]: response }));
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  }

  async function copyWithFingerprint(msgId: number, content: string) {
    const zwcPayload = encodeZWC(activeConvo || 0, msgId, Date.now());
    const fingerprintedText = content + zwcPayload;
    try {
      await navigator.clipboard.writeText(fingerprintedText);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = fingerprintedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  }

  function speakMessage(msgId: number, text: string) {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not available in this browser");
      return;
    }

    if (isSpeakingRef.current && speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const startSpeaking = () => {
      const cleanText = text
        .replace(/[*_~`#]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (!cleanText) return;

      const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
      const chunks: string[] = [];
      let current = "";
      for (const s of sentences) {
        if ((current + s).length > 200) {
          if (current) chunks.push(current.trim());
          current = s;
        } else {
          current += s;
        }
      }
      if (current.trim()) chunks.push(current.trim());

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.name.includes("Google") && v.name.includes("US") && v.lang === "en-US"
      ) || voices.find(v =>
        v.lang === "en-US" && !v.localService
      ) || voices.find(v => v.lang === "en-US") || voices.find(v =>
        v.lang.startsWith("en")
      ) || voices[0];

      isSpeakingRef.current = true;
      setIsSpeaking(true);
      setSpeakingMsgId(msgId);

      keepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      chunks.forEach((chunk, i) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        utterance.volume = 1;
        if (preferred) utterance.voice = preferred;

        if (i === chunks.length - 1) {
          utterance.onend = () => {
            stopSpeaking();
          };
        }

        utterance.onerror = (e) => {
          if (e.error !== "interrupted" && e.error !== "canceled") {
            console.error("Speech synthesis error:", e.error);
          }
          stopSpeaking();
        };

        window.speechSynthesis.speak(utterance);
      });
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        startSpeaking();
        window.speechSynthesis.onvoiceschanged = null;
      };
      setTimeout(() => {
        if (!isSpeakingRef.current) startSpeaking();
      }, 500);
    } else {
      startSpeaking();
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      <DynamicBackground aiState={aiState} hashingIntensity={hashingIntensity} isTyping={isTyping} />
      
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card/90 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ClouudAvatar state={aiState} size="sm" />
            <AnimatePresence>
              {hashingIntensity > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: hashingIntensity * 0.5 }}
                  exit={{ scale: 2.2, opacity: 0 }}
                  className="absolute inset-0 bg-primary rounded-full blur-lg"
                />
              )}
            </AnimatePresence>
          </div>
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
                <div className="relative">
                  <img src={uuonLogo} alt="UUON" className="w-9 h-9 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(240,185,59,0.2)] relative z-10" />
                  <AnimatePresence>
                    {hashingIntensity > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2, opacity: hashingIntensity * 0.7 }}
                        exit={{ scale: 2.5, opacity: 0 }}
                        className="absolute inset-0 bg-primary rounded-full blur-2xl providence-orb-glow"
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-display text-base text-white font-bold leading-none tracking-widest">UUON CLOUUD</h1>
                    {hashingIntensity > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-mono text-[7px] text-primary border border-primary/20 px-1 rounded-xs"
                      >
                        VERIFYING: {Math.round(hashingIntensity * 100)}%
                      </motion.div>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-primary uppercase tracking-widest">G°centric v1.0</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto lattice-grid-deep relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
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
                    className={`group flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-all border text-xs glass-card ${
                      activeConvo === convo.id 
                        ? 'bg-muted/80 border-primary/40 shadow-[0_0_15px_rgba(240,185,59,0.1)]' 
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
                <button
                  onClick={() => setShowDmension(true)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-[11px] text-primary hover:text-white bg-background hover:bg-muted/60 border border-border hover:border-primary/30 rounded-sm transition-all"
                  data-testid="button-open-dmension"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Open Δmension Native
                </button>
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
                        className="w-full text-left px-2 py-1.5 text-[11px] text-muted-foreground hover:text-white bg-background hover:bg-muted/60 border border-transparent hover:border-border glass-card rounded-sm transition-all leading-tight"
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
                  href="https://uuon.world/app"
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
                <button
                  onClick={() => setLocation("/codex")}
                  className="w-full flex items-center gap-2 px-2 py-2 text-[11px] text-[#00d4ff] hover:text-white bg-[#00d4ff]/5 hover:bg-[#00d4ff]/15 border border-[#00d4ff]/20 hover:border-[#00d4ff]/40 rounded-sm transition-all"
                  data-testid="button-codex"
                >
                  <Network className="w-3.5 h-3.5 shrink-0" />
                  UUON Codeχ · Pattern Library
                </button>
                <button
                  onClick={() => setLocation("/uinverse")}
                  className="w-full flex items-center gap-2 px-2 py-2 text-[11px] text-[#f0b93b] hover:text-white bg-[#f0b93b]/5 hover:bg-[#f0b93b]/15 border border-[#f0b93b]/20 hover:border-[#f0b93b]/40 rounded-sm transition-all"
                  data-testid="button-uinverse"
                >
                  <Brain className="w-3.5 h-3.5 shrink-0" />
                  UInVerse · Idea Engine
                </button>
                <button
                  onClick={() => setLocation("/legal")}
                  className="w-full flex items-center gap-2 px-2 py-2 text-[11px] text-muted-foreground hover:text-white bg-background hover:bg-muted/60 border border-border hover:border-border/60 rounded-sm transition-all"
                  data-testid="button-legal"
                >
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  Legal · Terms · Privacy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative bg-background pt-14 md:pt-0 overflow-x-hidden min-w-0">
        
        {messages.length === 0 && !isTyping && (
          <ExplorationEngine onExplore={(prompt) => sendMessage(prompt)} />
        )}

        <AnimatePresence>
          {showDmension && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-30 bg-background flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-white tracking-widest uppercase">Δmension Native Interface</h2>
                </div>
                <button 
                  onClick={() => setShowDmension(false)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 relative bg-black overflow-hidden group">
                <iframe 
                  key={showDmension ? 'active' : 'inactive'}
                  src="https://uuon.world/app" 
                  className="w-full h-full border-none"
                  title="Dmension"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe) iframe.src = iframe.src;
                    }}
                    className="p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm text-white hover:bg-primary hover:text-black transition-all"
                    title="Reload Bridge"
                  >
                    <Undo2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length > 0 && (
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, msgIndex) => {
                const isNewest = msgIndex >= messages.length - 2;
                const isLastMsg = msgIndex === messages.length - 1;
                const holoActive = isNewest && msg.id > 0;

                return (
                <motion.div 
                  key={`${msg.id}-${msg.role}-${msgIndex}`}
                  initial={holoActive ? {
                    opacity: 0,
                    y: 30,
                    rotateX: 15,
                    scale: 0.92,
                    filter: "blur(6px) brightness(1.8)",
                  } : { opacity: 0, y: 12 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    filter: "blur(0px) brightness(1)",
                  }}
                  transition={holoActive ? {
                    duration: 1.0,
                    ease: [0.16, 1, 0.3, 1],
                    delay: isLastMsg ? 0.15 : 0,
                    opacity: { duration: 0.4 },
                    rotateX: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                    scale: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
                    filter: { duration: 1.2 },
                  } : { duration: 0.4 }}
                  style={holoActive ? { perspective: "1200px", transformStyle: "preserve-3d" } : {}}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' && (
                    <motion.div
                      initial={holoActive ? { opacity: 0, x: 20, scale: 0.95 } : { opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: holoActive ? 0.7 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`max-w-[85%] md:max-w-[70%] bg-card border border-border p-3 rounded-sm text-foreground text-sm relative overflow-hidden break-words ${holoActive ? 'holo-materialize' : ''}`}
                      style={{ boxShadow: '4px 4px 0px 0px var(--color-border)' }}
                    >
                      {holoActive && <div className="holo-scanline-overlay" style={{ animationDuration: '0.8s', animationIterationCount: 3 }} />}
                      <span className={holoActive ? 'holo-text relative z-10' : ''}>{msg.content}</span>
                    </motion.div>
                  )}

                  {msg.role === 'assistant' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-[95%] md:max-w-[80%] flex gap-3 min-w-0"
                    >
                      <motion.div
                        initial={holoActive ? { opacity: 0, scale: 0.5, rotate: -10 } : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: holoActive ? 0.8 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="shrink-0 pt-1"
                      >
                        <ClouudAvatar state={isLastMsg && aiState === "speaking" ? "speaking" : "idle"} size="sm" />
                      </motion.div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <motion.div
                          initial={holoActive ? { opacity: 0, x: -16, scaleX: 1.5 } : { opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0, scaleX: 1 }}
                          transition={{ duration: holoActive ? 0.6 : 0.4, delay: 0.1 }}
                          className={`font-mono text-[9px] tracking-widest uppercase ${holoActive ? 'text-secondary' : 'text-primary'}`}
                          style={holoActive ? { textShadow: '0 0 8px rgba(74,140,212,0.6)' } : {}}
                        >
                          Clouud
                        </motion.div>
                        
                        {msg.toolCall && (() => {
                          try {
                            const tc = JSON.parse(msg.toolCall);
                            if (tc.name === "visualize_concept") {
                              return (
                                <motion.div
                                  initial={holoActive ? { opacity: 0, y: 16, rotateX: 8, scale: 0.96 } : { opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                  transition={{ duration: holoActive ? 0.7 : 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                  className={`w-full bg-card border p-4 rounded-sm relative overflow-hidden ${holoActive ? 'border-secondary/40 holo-border-glow' : 'border-border'}`}
                                  style={{ boxShadow: holoActive ? undefined : '4px 4px 0px 0px rgba(240,185,59,0.15)' }}
                                >
                                  {holoActive && <div className="holo-beam-line" />}
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Δmension Visualization Active</span>
                                  </div>
                                  <div className="aspect-video w-full bg-black/80 rounded-sm overflow-hidden border border-primary/40 relative group shadow-[0_0_40px_rgba(240,185,59,0.15)] ring-1 ring-primary/20">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,185,59,0.2)_0%,transparent_75%)] animate-pulse" />
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                                    
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                      <motion.div 
                                        animate={{ 
                                          rotateY: [0, 360],
                                          filter: ["drop-shadow(0 0 12px rgba(240,185,59,0.4))", "drop-shadow(0 0 25px rgba(240,185,59,0.8))", "drop-shadow(0 0 12px rgba(240,185,59,0.4))"],
                                          scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                        className="w-24 h-24 mb-4 text-primary group-hover:text-white transition-all duration-700 cursor-pointer relative"
                                      >
                                        <Brain className="w-full h-full relative z-10" />
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                      </motion.div>
                                      <h4 className="text-sm font-display text-white font-bold mb-1 uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{tc.args.concept}</h4>
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/40" />
                                        <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Lattice-Phase: {tc.args.shapeType}</p>
                                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/40" />
                                      </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                      <a 
                                        href={`https://uuon.world/app?concept=${encodeURIComponent(tc.args.concept)}&shape=${tc.args.shapeType}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-2 py-1 bg-primary text-black text-[9px] font-bold uppercase rounded-xs hover:bg-white transition-colors"
                                      >
                                        <Globe size={10} />
                                        Interact in Δmension
                                      </a>
                                    </div>
                                  </div>
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    {tc.args.parameters && Object.entries(tc.args.parameters).slice(0, 4).map(([k, v]: [string, any]) => (
                                      <div key={k} className="flex justify-between items-center px-2 py-1 bg-black/20 rounded-xs border border-border/30">
                                        <span className="text-[8px] font-mono text-muted-foreground uppercase">{k}:</span>
                                        <span className="text-[8px] font-mono text-secondary">{typeof v === 'number' ? v.toFixed(4) : String(v)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              );
                            }
                            return (
                              <motion.div
                                initial={holoActive ? { opacity: 0, y: 16, rotateX: 8, scale: 0.96 } : { opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                transition={{ duration: holoActive ? 0.7 : 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                className={`w-full bg-card border p-2.5 rounded-sm relative overflow-hidden ${holoActive ? 'border-secondary/40 holo-border-glow' : 'border-border'}`}
                                style={{ boxShadow: holoActive ? undefined : '4px 4px 0px 0px rgba(240,185,59,0.15)' }}
                              >
                                {holoActive && <div className="holo-beam-line" />}
                                <div className="flex items-center gap-1.5 text-primary font-display text-[10px] tracking-widest mb-2 uppercase font-bold relative z-10">
                                  <Cpu className="w-3 h-3" />
                                  Tool: {tc.name}
                                </div>
                                <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-0.5 font-mono text-[10px] relative z-10 min-w-0">
                                  <span className="text-muted-foreground">Input:</span>
                                  <span className="text-white break-all overflow-hidden">{JSON.stringify(tc.args)}</span>
                                  <span className="text-muted-foreground">Output:</span>
                                  <span className="text-secondary font-bold whitespace-pre-wrap break-all overflow-hidden">{typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result)}</span>
                                </div>
                              </motion.div>
                            );
                          } catch { return null; }
                        })()}
                        
                        <motion.div
                          initial={holoActive ? {
                            opacity: 0,
                            y: 20,
                            rotateX: 10,
                            scale: 0.94,
                          } : { opacity: 0, y: 12 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            scale: 1,
                          }}
                          transition={{
                            duration: holoActive ? 0.9 : 0.6,
                            delay: msg.toolCall ? 0.4 : 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`bg-card border p-3 rounded-sm text-white text-sm leading-relaxed whitespace-pre-wrap break-words relative overflow-hidden ${holoActive ? 'border-secondary/30 holo-materialize' : 'border-border'}`}
                          style={holoActive ? {
                            boxShadow: '0 0 20px rgba(74,140,212,0.15), 4px 4px 0px 0px rgba(20,42,69,1)',
                          } : {
                            boxShadow: '4px 4px 0px 0px rgba(20,42,69,1)',
                          }}
                        >
                          {holoActive && <div className="holo-scanline-overlay" style={{ animationDuration: '1s', animationIterationCount: 5 }} />}
                          {holoActive && <div className="holo-beam-line" style={{ animationDelay: '0.3s' }} />}
                          {(() => {
                            const quickLinkRegex = /\[>>(.*?)>>\]/g;
                            const quickLinks: string[] = [];
                            let match;
                            while ((match = quickLinkRegex.exec(msg.content)) !== null) {
                              quickLinks.push(match[1]);
                            }
                            const cleanContent = msg.content.replace(/\[>>.*?>>\]/g, '').trimEnd();
                            
                            return (
                              <>
                                {cleanContent.split('\n\n').map((paragraph, i) => (
                                  <motion.span
                                    key={i}
                                    initial={holoActive ? { opacity: 0, y: 6, filter: "blur(2px)" } : { opacity: 0 }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                      duration: holoActive ? 0.6 : 0.5,
                                      delay: (msg.toolCall ? 0.5 : 0.3) + i * (holoActive ? 0.06 : 0.08),
                                      ease: "easeOut",
                                    }}
                                    className={`inline relative z-10 ${holoActive ? 'holo-text' : ''}`}
                                  >
                                    {i > 0 && <><br /><br /></>}
                                    {paragraph}
                                  </motion.span>
                                ))}
                                
                                {msg.role === 'assistant' && msg.toolCall && (() => {
                                  try {
                                    const tc = typeof msg.toolCall === 'string' ? JSON.parse(msg.toolCall) : msg.toolCall;
                                    if (tc?.name === 'generate_image' && tc?.result?.imageId) {
                                      const imgData = generatedImages[tc.result.imageId];
                                      return (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: 0.5, duration: 0.6 }}
                                          className="mt-3 rounded-sm overflow-hidden border border-primary/20"
                                          data-testid={`generated-image-${tc.result.imageId}`}
                                        >
                                          {imgData?.status === "complete" && imgData.url ? (
                                            <div className="relative group">
                                              <img
                                                src={imgData.url}
                                                alt={imgData.concept}
                                                className="w-full max-w-md rounded-sm"
                                                loading="lazy"
                                              />
                                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                                <span className="font-mono text-[9px] text-white/80 tracking-wider uppercase">{imgData.concept}</span>
                                              </div>
                                            </div>
                                          ) : imgData?.status === "failed" ? (
                                            <div className="p-3 bg-red-500/10 text-red-400 text-xs font-mono">
                                              Image generation failed for "{tc.result.imageId}"
                                            </div>
                                          ) : (
                                            <div className="p-4 flex items-center gap-2 bg-primary/5">
                                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                              <span className="font-mono text-[10px] text-primary/70 tracking-wider">Generating: {tc.args?.concept || "image"}...</span>
                                            </div>
                                          )}
                                        </motion.div>
                                      );
                                    }
                                  } catch {}
                                  return null;
                                })()}

                                {quickLinks.length > 0 && msg.role === 'assistant' && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                    className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-border/30"
                                  >
                                    {quickLinks.map((link, li) => (
                                      <button
                                        key={li}
                                        onClick={() => sendMessage(link)}
                                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono tracking-wider text-primary/80 hover:text-white bg-primary/5 hover:bg-primary/15 border border-primary/15 hover:border-primary/40 rounded-sm transition-all"
                                        data-testid={`quick-link-${msg.id}-${li}`}
                                      >
                                        <ChevronRight className="w-2.5 h-2.5" />
                                        {link}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </>
                            );
                          })()}
                          
                          {msg.role === 'assistant' && (
                            <div className="mt-2 flex items-center gap-1">
                              <button
                                onClick={() => copyWithFingerprint(msg.id, msg.content)}
                                className={`p-1 rounded-sm transition-colors ${
                                  copiedMsgId === msg.id
                                    ? "text-[#4CAF50] bg-[#4CAF50]/10"
                                    : "text-muted-foreground/50 hover:text-[#f0b93b]"
                                }`}
                                title={copiedMsgId === msg.id ? "Copied" : "Copy response"}
                                data-testid={`btn-copy-${msg.id}`}
                              >
                                {copiedMsgId === msg.id
                                  ? <Check className="w-3.5 h-3.5" />
                                  : <Copy className="w-3.5 h-3.5" />
                                }
                              </button>
                              <button
                                onClick={() => speakMessage(msg.id, msg.content)}
                                className={`p-1 rounded-sm transition-colors ${
                                  isSpeaking && speakingMsgId === msg.id
                                    ? "text-[#f0b93b] bg-[#f0b93b]/10"
                                    : "text-muted-foreground/50 hover:text-[#f0b93b]"
                                }`}
                                title={isSpeaking && speakingMsgId === msg.id ? "Stop speaking" : "Read aloud"}
                                data-testid={`btn-speak-${msg.id}`}
                              >
                                {isSpeaking && speakingMsgId === msg.id
                                  ? <VolumeX className="w-3.5 h-3.5" />
                                  : <Volume2 className="w-3.5 h-3.5" />
                                }
                              </button>
                              <div className="ml-2 flex items-center gap-1">
                                {feedbackSubmitted[msg.id] ? (
                                  <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                    {feedbackSubmitted[msg.id] === "helped" ? "✓" : feedbackSubmitted[msg.id] === "partial" ? "◐" : "○"}
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => submitFeedback(msg.id, "helped")}
                                      className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono transition-colors bg-transparent hover:bg-[#4CAF50]/10"
                                      style={{ border: "1px solid #4CAF50", color: "#4CAF50" }}
                                      title="This response helped"
                                      data-testid="feedback-helped"
                                    >
                                      Helped
                                    </button>
                                    <button
                                      onClick={() => submitFeedback(msg.id, "partial")}
                                      className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono transition-colors bg-transparent hover:bg-[#C9A84C]/10"
                                      style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}
                                      title="Partially helpful"
                                      data-testid="feedback-partial"
                                    >
                                      Partial
                                    </button>
                                    <button
                                      onClick={() => submitFeedback(msg.id, "missed")}
                                      className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono transition-colors bg-transparent hover:bg-[#EF5350]/10"
                                      style={{ border: "1px solid #EF5350", color: "#EF5350" }}
                                      title="Missed the mark"
                                      data-testid="feedback-missed"
                                    >
                                      Missed
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {msg.hash && (
                            <div className="mt-1 pt-2 border-t border-muted space-y-1">
                              <div className="flex items-center gap-1.5 font-mono text-[8px] text-muted-foreground">
                                <Binary className="w-2.5 h-2.5 text-secondary" />
                                <span className="text-secondary/70 mr-1">UUON·TOKEN</span>
                                <span className="truncate uppercase tracking-widest">{msg.hash}</span>
                              </div>
                              {msgAssessments[msg.id] && (
                                <div className="flex items-center gap-1.5 font-mono text-[8px]">
                                  <Scale className="w-2.5 h-2.5" style={{ color: msgAssessments[msg.id].score >= 90 ? '#22c55e' : msgAssessments[msg.id].score >= 70 ? '#f0b93b' : '#ef4444' }} />
                                  <span style={{ color: msgAssessments[msg.id].score >= 90 ? '#22c55e' : msgAssessments[msg.id].score >= 70 ? '#f0b93b' : '#ef4444' }}>
                                    SA:{msgAssessments[msg.id].score}/100
                                  </span>
                                  <span className="text-muted-foreground">{msgAssessments[msg.id].wordCount}w</span>
                                  {msgAssessments[msg.id].flags.length > 0 && (
                                    <span className="text-yellow-500/70 truncate">{msgAssessments[msg.id].flags[0]}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
              })}
              
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
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.csv,.json,.md,.html,.docx,.xlsx"
            className="hidden"
            data-testid="input-file-hidden"
          />

          {showLinkInput && (
            <div className="max-w-4xl mx-auto mb-2 flex items-center gap-2 min-w-0">
              <div className="flex-1 min-w-0 flex items-center gap-2 bg-background border border-border rounded-sm px-3 py-2">
                <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleScrapeLink(); } }}
                  placeholder="Paste URL to scrape..."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-muted-foreground"
                  autoFocus
                  data-testid="input-link-url"
                />
              </div>
              <button
                type="button"
                onClick={handleScrapeLink}
                disabled={!linkUrl.trim() || isScraping}
                className="px-3 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-black font-display text-xs tracking-wider font-bold uppercase rounded-sm transition-colors"
                data-testid="button-scrape"
              >
                {isScraping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Scrape"}
              </button>
              <button
                type="button"
                onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}
                className="p-2 text-muted-foreground hover:text-white transition-colors"
                data-testid="button-cancel-link"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-3 top-3 text-primary font-bold font-mono text-sm">{">"}</div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isTyping) {
                      handleSubmit(e as unknown as React.FormEvent);
                    }
                  }
                }}
                placeholder="Ask Clouud..."
                disabled={isTyping}
                rows={1}
                className="w-full bg-background border border-border text-white pl-8 pr-16 md:pr-24 py-3 focus:outline-none focus:border-primary transition-all rounded-sm text-sm placeholder:text-muted-foreground disabled:opacity-50 resize-none overflow-y-auto leading-relaxed"
                style={{ boxShadow: '4px 4px 0px 0px var(--color-border)', minHeight: '44px', maxHeight: '160px' }}
                data-testid="input-clouud"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 bottom-2 px-3 py-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-display text-xs tracking-wider font-bold uppercase rounded-sm transition-colors"
                data-testid="button-submit"
              >
                {isTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send"}
              </button>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-sm"
                title="Upload file or image"
                data-testid="button-upload"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-sm"
                title="Scrape a URL"
                data-testid="button-link"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-1.5 rounded-sm transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground hover:text-primary"}`}
                title={isListening ? "Stop listening" : "Voice input"}
                data-testid="button-voice"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = !autoSpeak;
                  setAutoSpeak(next);
                  crystalSetSync("clouud-auto-speak", next);
                  crystalSet("clouud-auto-speak", String(next));
                }}
                className={`p-1.5 rounded-sm transition-colors ${autoSpeak ? "text-[#f0b93b]" : "text-muted-foreground hover:text-primary"}`}
                title={autoSpeak ? "Auto-speak ON (click to disable)" : "Auto-speak OFF (click to enable)"}
                data-testid="button-auto-speak"
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={() => stopSpeaking()}
                  className="p-1.5 rounded-sm text-red-500 animate-pulse transition-colors"
                  title="Stop speaking"
                  data-testid="button-stop-speak"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="h-3 w-px bg-border/50 mx-1" />
              {messages.length >= 2 && !isTyping && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-sm"
                  title="Undo last exchange"
                  data-testid="button-undo"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="ml-auto text-[8px] font-mono text-muted-foreground/40 tracking-wider hidden sm:inline">ENTER send · SHIFT+ENTER newline</span>
            </div>
          </form>
        </div>
        <MetricsPanel />
      </div>

      <AnimatePresence>
        {showTutorial && (
          <Tutorial onComplete={completeTutorial} onDismiss={dismissTutorial} onSendMessage={handleTutorialSend} />
        )}
      </AnimatePresence>

    </div>
  );
}
