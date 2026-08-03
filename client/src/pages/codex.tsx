import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Filter, CheckCircle2, Lock, Eye, Network, Bell, BellOff, Upload, Play, Loader2, Shield, Link2, ChevronDown, ChevronUp, X } from "lucide-react";

type Pattern = {
  id: number;
  title: string;
  description: string;
  publicSummary: string | null;
  category: string;
  sourceType: string;
  sourceReference: string | null;
  discoveredBy: string;
  elloHash: string;
  originTimestamp: string;
  verified: boolean;
  active: boolean;
  public: boolean;
  metadata: string | null;
  createdAt: string;
  links?: PatternLink[];
};

type PatternLink = {
  id: number;
  fromPatternId: number;
  toPatternId: number;
  linkType: string;
  description: string | null;
  strength: number;
  createdAt: string;
};

type PatternAlert = {
  id: number;
  patternId: number | null;
  alertType: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Stats = {
  total: number;
  verified: number;
  public: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
};

const CATEGORIES = ["MATHEMATICAL", "LINGUISTIC", "PHYSICAL", "STRUCTURAL", "CIPHER", "GEOMETRIC", "CONCEPTUAL", "BIOLOGICAL", "HARMONIC", "PERCEPTUAL", "CUSTOM"];

const CATEGORY_COLORS: Record<string, string> = {
  MATHEMATICAL: "#00d4ff",
  LINGUISTIC: "#f0b93b",
  PHYSICAL: "#10b981",
  STRUCTURAL: "#8b5cf6",
  CIPHER: "#ef4444",
  GEOMETRIC: "#06b6d4",
  CONCEPTUAL: "#f59e0b",
  BIOLOGICAL: "#22c55e",
  HARMONIC: "#a855f7",
  PERCEPTUAL: "#ec4899",
  CUSTOM: "#6b7280",
};

const LINK_TYPES = ["DERIVES_FROM", "ENCODES", "GENERATES", "MIRRORS", "EXTENDS", "CONTRADICTS", "APPLIES_TO", "HARMONIZES"];

export default function CodexPage() {
  const [, setLocation] = useLocation();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [alerts, setAlerts] = useState<PatternAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");

  const [claimTitle, setClaimTitle] = useState("");
  const [claimCategory, setClaimCategory] = useState("MATHEMATICAL");
  const [claimDescription, setClaimDescription] = useState("");
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  const [extractionResult, setExtractionResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [categoryFilter, sourceFilter, verifiedFilter]);

  async function loadData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (categoryFilter) params.set("category", categoryFilter);
      if (sourceFilter) params.set("sourceType", sourceFilter);
      if (verifiedFilter) params.set("verified", verifiedFilter);
      params.set("limit", "100");

      const [patternsRes, statsRes, alertCountRes] = await Promise.all([
        fetch(`/api/codex/patterns?${params}`),
        fetch("/api/codex/stats"),
        fetch("/api/codex/alerts/count"),
      ]);

      if (patternsRes.ok) setPatterns(await patternsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (alertCountRes.ok) {
        const { count } = await alertCountRes.json();
        setUnreadCount(count);
      }
    } catch (e) {
      console.error("Failed to load codex data:", e);
    }
    setLoading(false);
  }

  async function loadAlerts() {
    const res = await fetch("/api/codex/alerts");
    if (res.ok) setAlerts(await res.json());
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    const res = await fetch(`/api/codex/search?q=${encodeURIComponent(searchQuery)}`);
    if (res.ok) setPatterns(await res.json());
  }

  async function handleExtract() {
    setExtracting(true);
    setExtractionResult(null);
    try {
      const res = await fetch("/api/codex/extract-archive", { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        setExtractionResult(result);
        loadData();
      }
    } catch (e) {
      console.error("Extraction failed:", e);
    }
    setExtracting(false);
  }

  async function handleClaim() {
    if (!claimTitle || !claimDescription) return;
    setClaimSubmitting(true);
    try {
      const res = await fetch("/api/codex/patterns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: claimTitle,
          description: claimDescription,
          category: claimCategory,
          sourceType: "manual",
        }),
      });
      if (res.ok) {
        setShowClaimModal(false);
        setClaimTitle("");
        setClaimDescription("");
        loadData();
      }
    } catch (e) {
      console.error("Claim failed:", e);
    }
    setClaimSubmitting(false);
  }

  async function handleVerify(id: number) {
    await fetch(`/api/codex/patterns/${id}/verify`, { method: "PATCH" });
    loadData();
    if (selectedPattern?.id === id) {
      setSelectedPattern({ ...selectedPattern, verified: true });
    }
  }

  async function handlePublish(id: number) {
    const summary = prompt("Enter a public summary (obfuscated version for external view):");
    if (!summary) return;
    await fetch(`/api/codex/patterns/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicSummary: summary }),
    });
    loadData();
  }

  async function handleDismissAlert(id: number) {
    await fetch(`/api/codex/alerts/${id}/read`, { method: "PATCH" });
    setAlerts(alerts.filter(a => a.id !== id));
    setUnreadCount(Math.max(0, unreadCount - 1));
  }

  async function handleDismissAll() {
    await fetch("/api/codex/alerts/read-all", { method: "PATCH" });
    setAlerts([]);
    setUnreadCount(0);
  }

  async function selectPattern(id: number) {
    const res = await fetch(`/api/codex/patterns/${id}`);
    if (res.ok) setSelectedPattern(await res.json());
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" data-testid="codex-page">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a1628]/80 via-[#0a0a0f] to-[#0a0a0f] pointer-events-none" />

      <div className="relative z-10">
        <header className="border-b border-[#1a1a2e] bg-[#0a0a0f]/90 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation("/")}
                className="text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-7 h-7 rounded-full opacity-80 bg-white/20 flex items-center justify-center text-xs font-mono">U</div>
              <div>
                <h1 className="text-lg font-semibold tracking-wide">
                  UUON Code<span className="text-[#00d4ff]">χ</span>
                </h1>
                <p className="text-[10px] text-[#00d4ff]/40 tracking-widest uppercase">Pattern Library · Provenance Tracked</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAlerts(!showAlerts); if (!showAlerts) loadAlerts(); }}
                className="relative p-2 text-white/60 hover:text-white transition-colors"
                data-testid="button-alerts"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#00d4ff] text-[#0a0a0f] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-3 py-1.5 text-[11px] bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 rounded hover:bg-[#00d4ff]/20 transition-colors"
                data-testid="button-claim-pattern"
              >
                + Claim Pattern
              </button>
            </div>
          </div>
        </header>

        {stats && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-3" data-testid="stat-total">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Patterns</p>
                <p className="text-2xl font-bold text-[#00d4ff]">{stats.total}</p>
              </div>
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-3" data-testid="stat-verified">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Verified</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.verified}</p>
              </div>
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-3" data-testid="stat-public">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Public</p>
                <p className="text-2xl font-bold text-amber-400">{stats.public}</p>
              </div>
              <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-3 col-span-2" data-testid="stat-categories">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(stats.byCategory).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="text-[9px] px-1.5 py-0.5 rounded-full border"
                      style={{
                        color: CATEGORY_COLORS[cat] || "#6b7280",
                        borderColor: `${CATEGORY_COLORS[cat] || "#6b7280"}40`,
                        backgroundColor: `${CATEGORY_COLORS[cat] || "#6b7280"}10`,
                      }}
                    >
                      {cat}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/40 uppercase tracking-wider">The Cycle</p>
                <button
                  onClick={handleExtract}
                  disabled={extracting}
                  className="px-3 py-1.5 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  data-testid="button-extract-archive"
                >
                  {extracting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                  {extracting ? "Extracting..." : "Extract from Archive"}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/50 flex-wrap">
                <span className="text-[#00d4ff]">Archive (835)</span>
                <span>→</span>
                <span className="text-emerald-400">Extraction</span>
                <span>→</span>
                <span className="text-[#00d4ff] font-bold">Codeχ ({stats.total})</span>
                <span>→</span>
                <span className="text-amber-400">System Prompt</span>
                <span>→</span>
                <span className="text-purple-400">Smarter Clouud</span>
                <span>→</span>
                <span className="text-pink-400">Recognition</span>
                <span>→</span>
                <span className="text-[#00d4ff]">New Claims</span>
                <span>→</span>
                <span className="text-[#00d4ff] font-bold">Codeχ grows</span>
              </div>
              {extractionResult && (
                <div className="mt-3 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded text-[10px] text-emerald-300" data-testid="extraction-result">
                  Scanned: {extractionResult.totalScanned} | Found: {extractionResult.patternsFound} | Created: {extractionResult.patternsCreated} | Duplicates: {extractionResult.duplicatesSkipped} | Errors: {extractionResult.errors}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search patterns..."
                className="w-full pl-8 pr-3 py-2 text-[12px] bg-[#0f0f1a] border border-[#1a1a2e] rounded text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/40"
                data-testid="input-search"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2 py-2 text-[11px] bg-[#0f0f1a] border border-[#1a1a2e] rounded text-white/70 focus:outline-none"
              data-testid="select-category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="px-2 py-2 text-[11px] bg-[#0f0f1a] border border-[#1a1a2e] rounded text-white/70 focus:outline-none"
              data-testid="select-source"
            >
              <option value="">All Sources</option>
              <option value="archive_extraction">Archive</option>
              <option value="conversation">Conversation</option>
              <option value="manual">Manual</option>
              <option value="upload">Upload</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={e => setVerifiedFilter(e.target.value)}
              className="px-2 py-2 text-[11px] bg-[#0f0f1a] border border-[#1a1a2e] rounded text-white/70 focus:outline-none"
              data-testid="select-verified"
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#00d4ff]/50" />
            </div>
          ) : patterns.length === 0 ? (
            <div className="text-center py-20">
              <Network className="w-12 h-12 mx-auto text-white/10 mb-3" />
              <p className="text-white/30 text-sm">No patterns found</p>
              <p className="text-white/20 text-[11px] mt-1">Extract from archive or claim a new pattern to begin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patterns.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-3 cursor-pointer hover:border-[#00d4ff]/30 transition-colors group"
                  onClick={() => selectPattern(p.id)}
                  data-testid={`card-pattern-${p.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[12px] font-medium text-white/90 leading-tight line-clamp-2 flex-1 mr-2">{p.title}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      {p.verified && <CheckCircle2 size={12} className="text-emerald-400" />}
                      {p.public ? <Eye size={12} className="text-amber-400" /> : <Lock size={12} className="text-white/20" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 line-clamp-2 mb-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full border"
                      style={{
                        color: CATEGORY_COLORS[p.category] || "#6b7280",
                        borderColor: `${CATEGORY_COLORS[p.category] || "#6b7280"}40`,
                        backgroundColor: `${CATEGORY_COLORS[p.category] || "#6b7280"}10`,
                      }}
                      data-testid={`badge-category-${p.id}`}
                    >
                      {p.category}
                    </span>
                    <div className="flex items-center gap-2 text-[9px] text-white/30">
                      <span className="font-mono">{p.elloHash?.slice(0, 8) || "---"}</span>
                      <span>{new Date(p.originTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedPattern && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center p-4"
              onClick={() => setSelectedPattern(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
                data-testid="modal-pattern-detail"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white mb-1">{selectedPattern.title}</h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full border"
                          style={{
                            color: CATEGORY_COLORS[selectedPattern.category],
                            borderColor: `${CATEGORY_COLORS[selectedPattern.category]}40`,
                            backgroundColor: `${CATEGORY_COLORS[selectedPattern.category]}10`,
                          }}
                        >
                          {selectedPattern.category}
                        </span>
                        {selectedPattern.verified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">Verified</span>
                        )}
                        {selectedPattern.public ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">Public</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/30 bg-white/5">Private</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => setSelectedPattern(null)} className="text-white/40 hover:text-white" data-testid="button-close-detail">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-[12px] text-white/70 whitespace-pre-wrap leading-relaxed">{selectedPattern.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Discovered By</p>
                        <p className="text-[12px] text-white/70">{selectedPattern.discoveredBy}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Origin Date</p>
                        <p className="text-[12px] text-white/70">{new Date(selectedPattern.originTimestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Source</p>
                        <p className="text-[12px] text-white/70">{selectedPattern.sourceType}{selectedPattern.sourceReference ? ` — ${selectedPattern.sourceReference}` : ""}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Provenance Hash</p>
                        <p className="text-[10px] text-[#00d4ff]/60 font-mono break-all">{selectedPattern.elloHash}</p>
                      </div>
                    </div>

                    {selectedPattern.links && selectedPattern.links.length > 0 && (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Connected Patterns ({selectedPattern.links.length})</p>
                        <div className="space-y-1.5">
                          {selectedPattern.links.map(link => (
                            <div key={link.id} className="flex items-center gap-2 text-[11px] p-1.5 bg-white/5 rounded">
                              <Link2 size={10} className="text-[#00d4ff]/50 shrink-0" />
                              <span className="text-[#00d4ff]/70 text-[9px] font-mono">{link.linkType}</span>
                              <span className="text-white/50">Pattern #{link.fromPatternId === selectedPattern.id ? link.toPatternId : link.fromPatternId}</span>
                              {link.description && <span className="text-white/30">— {link.description}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-[#1a1a2e]">
                      {!selectedPattern.verified && (
                        <button
                          onClick={() => handleVerify(selectedPattern.id)}
                          className="px-3 py-1.5 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/20 transition-colors"
                          data-testid="button-verify-pattern"
                        >
                          <CheckCircle2 size={12} className="inline mr-1" />
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handlePublish(selectedPattern.id)}
                        className="px-3 py-1.5 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors"
                        data-testid="button-publish-pattern"
                      >
                        {selectedPattern.public ? <Lock size={12} className="inline mr-1" /> : <Eye size={12} className="inline mr-1" />}
                        {selectedPattern.public ? "Make Private" : "Publish (Obfuscated)"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showClaimModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center p-4"
              onClick={() => setShowClaimModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl max-w-lg w-full"
                onClick={e => e.stopPropagation()}
                data-testid="modal-claim"
              >
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-white mb-4">Claim Pattern</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Title</label>
                      <input
                        type="text"
                        value={claimTitle}
                        onChange={e => setClaimTitle(e.target.value)}
                        placeholder="Name this pattern..."
                        className="w-full mt-1 px-3 py-2 text-[12px] bg-[#0a0a0f] border border-[#1a1a2e] rounded text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/40"
                        data-testid="input-claim-title"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Category</label>
                      <select
                        value={claimCategory}
                        onChange={e => setClaimCategory(e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-[12px] bg-[#0a0a0f] border border-[#1a1a2e] rounded text-white focus:outline-none"
                        data-testid="select-claim-category"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider">Description</label>
                      <textarea
                        value={claimDescription}
                        onChange={e => setClaimDescription(e.target.value)}
                        placeholder="Describe the pattern, formula, method, or discovery..."
                        rows={5}
                        className="w-full mt-1 px-3 py-2 text-[12px] bg-[#0a0a0f] border border-[#1a1a2e] rounded text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/40 resize-none"
                        data-testid="input-claim-description"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[9px] text-white/20">Ellomental Hash will be generated automatically</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowClaimModal(false)}
                          className="px-3 py-1.5 text-[11px] text-white/40 hover:text-white transition-colors"
                          data-testid="button-cancel-claim"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClaim}
                          disabled={!claimTitle || !claimDescription || claimSubmitting}
                          className="px-4 py-1.5 text-[11px] bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 rounded hover:bg-[#00d4ff]/30 transition-colors disabled:opacity-40"
                          data-testid="button-submit-claim"
                        >
                          {claimSubmitting ? "Claiming..." : "Claim with Provenance"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAlerts && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0f0f1a] border-l border-[#1a1a2e] z-30 overflow-y-auto"
              data-testid="panel-alerts"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Alerts</h3>
                  <div className="flex items-center gap-2">
                    {alerts.length > 0 && (
                      <button
                        onClick={handleDismissAll}
                        className="text-[10px] text-white/40 hover:text-white"
                        data-testid="button-dismiss-all"
                      >
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowAlerts(false)} className="text-white/40 hover:text-white" data-testid="button-close-alerts">
                      <X size={16} />
                    </button>
                  </div>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-[11px] text-white/20 text-center py-8">No alerts</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-2.5 rounded border text-[11px] ${alert.read ? "border-[#1a1a2e] text-white/30" : "border-[#00d4ff]/20 text-white/60 bg-[#00d4ff]/5"}`}
                        data-testid={`alert-${alert.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] text-[#00d4ff]/50 uppercase">{alert.alertType}</span>
                            <p className="mt-0.5">{alert.message}</p>
                            <p className="text-[9px] text-white/20 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                          </div>
                          {!alert.read && (
                            <button
                              onClick={() => handleDismissAlert(alert.id)}
                              className="text-white/20 hover:text-white shrink-0"
                              data-testid={`button-dismiss-${alert.id}`}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
