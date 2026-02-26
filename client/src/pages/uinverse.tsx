import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, CheckCircle2, XCircle, Clock, ArrowLeft, Sparkles, FileJson, FileText, Filter, ChevronDown, Check, Loader2, AlertTriangle, Zap, Eye, Wrench, Lightbulb, Layers, Link2, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

type UinverseIdea = {
  id: number;
  importId: number;
  title: string;
  description: string;
  category: string;
  verdict: string;
  confidence: number;
  reasoning: string;
  sourceExcerpt: string;
  priority: string;
  implemented: boolean;
  createdAt: string;
};

type UinverseImport = {
  id: number;
  source: string;
  filename: string | null;
  messageCount: number;
  ideasExtracted: number;
  status: string;
  createdAt: string;
};

type Summary = {
  totalImports: number;
  totalIdeas: number;
  buildCount: number;
  considerCount: number;
  skipCount: number;
  implementedCount: number;
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TOOL: <Wrench className="w-3.5 h-3.5" />,
  FEATURE: <Zap className="w-3.5 h-3.5" />,
  CONCEPT: <Lightbulb className="w-3.5 h-3.5" />,
  ARCHITECTURE: <Layers className="w-3.5 h-3.5" />,
  INTEGRATION: <Link2 className="w-3.5 h-3.5" />,
  VISUALIZATION: <Eye className="w-3.5 h-3.5" />,
};

const VERDICT_COLORS: Record<string, string> = {
  BUILD: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  CONSIDER: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  SKIP: "text-zinc-400 bg-zinc-400/10 border-zinc-400/30",
};

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: "text-red-400",
  HIGH: "text-orange-400",
  MEDIUM: "text-[#f0b93b]",
  LOW: "text-zinc-500",
};

export default function UInVerse() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSource, setSelectedSource] = useState<"chatgpt" | "claude" | "text">("chatgpt");
  const [textInput, setTextInput] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const [activeImportId, setActiveImportId] = useState<number | null>(null);

  const { data: summary } = useQuery<Summary>({
    queryKey: ["/api/uinverse/summary"],
    refetchInterval: 5000,
  });

  const { data: imports } = useQuery<UinverseImport[]>({
    queryKey: ["/api/uinverse/imports"],
    refetchInterval: 5000,
  });

  const ideasQuery = activeImportId
    ? `/api/uinverse/ideas?importId=${activeImportId}`
    : "/api/uinverse/ideas";

  const { data: ideas } = useQuery<UinverseIdea[]>({
    queryKey: [ideasQuery],
    refetchInterval: 5000,
  });

  const ingestMutation = useMutation({
    mutationFn: async (data: { content: string; source: string; filename?: string }) => {
      const res = await apiRequest("POST", "/api/uinverse/ingest", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/uinverse/imports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/uinverse/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/uinverse/ideas"] });
      setTextInput("");
    },
  });

  const toggleImplemented = useMutation({
    mutationFn: async ({ id, implemented }: { id: number; implemented: boolean }) => {
      await apiRequest("PATCH", `/api/uinverse/ideas/${id}`, { implemented });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/uinverse/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/uinverse/summary"] });
    },
  });

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    ingestMutation.mutate({
      content: text,
      source: selectedSource,
      filename: file.name,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedSource, ingestMutation]);

  const handleTextSubmit = useCallback(() => {
    if (!textInput.trim()) return;
    ingestMutation.mutate({
      content: textInput,
      source: selectedSource,
    });
  }, [textInput, selectedSource, ingestMutation]);

  const filteredIdeas = (ideas || []).filter(idea => {
    if (filterVerdict && idea.verdict !== filterVerdict) return false;
    if (filterCategory && idea.category !== filterCategory) return false;
    return true;
  });

  const analyzing = (imports || []).some(i => i.status === "pending" || i.status === "analyzing");

  return (
    <div className="min-h-screen bg-[#030811] text-white" data-testid="uinverse-page">
      <div className="border-b border-border/30 bg-[#020810]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#f0b93b]" />
              <h1 className="text-lg font-semibold tracking-wide" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <span className="text-[#f0b93b]">UIn</span>Verse
              </h1>
            </div>
            <span className="text-xs text-zinc-600 hidden sm:inline">Idea Extraction Engine</span>
          </div>
          {summary && (
            <div className="flex items-center gap-4 text-xs" data-testid="uinverse-stats">
              <span className="text-zinc-500">{summary.totalImports} imports</span>
              <span className="text-emerald-400">{summary.buildCount} BUILD</span>
              <span className="text-amber-400">{summary.considerCount} CONSIDER</span>
              <span className="text-zinc-500">{summary.skipCount} SKIP</span>
              {summary.implementedCount > 0 && (
                <span className="text-[#f0b93b]">{summary.implementedCount} shipped</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="border border-border/30 rounded-lg bg-[#060e1a] p-5" data-testid="ingest-panel">
          <h2 className="text-sm font-medium text-[#f0b93b] mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Ingest Chat History
          </h2>

          <div className="flex gap-2 mb-4">
            {(["chatgpt", "claude", "text"] as const).map(src => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  selectedSource === src
                    ? "bg-[#f0b93b]/20 text-[#f0b93b] border border-[#f0b93b]/40"
                    : "bg-white/5 text-zinc-400 border border-transparent hover:border-zinc-700"
                }`}
                data-testid={`btn-source-${src}`}
              >
                {src === "chatgpt" ? "ChatGPT" : src === "claude" ? "Claude" : "Plain Text"}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.md,.csv"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={ingestMutation.isPending}
                className="w-full border border-dashed border-zinc-700 rounded-lg py-8 flex flex-col items-center gap-2 hover:border-[#f0b93b]/50 hover:bg-[#f0b93b]/5 transition-all cursor-pointer disabled:opacity-50"
                data-testid="btn-upload-file"
              >
                {selectedSource === "chatgpt" ? (
                  <FileJson className="w-8 h-8 text-zinc-500" />
                ) : (
                  <FileText className="w-8 h-8 text-zinc-500" />
                )}
                <span className="text-sm text-zinc-400">
                  {ingestMutation.isPending ? "Analyzing..." : "Drop or click to upload"}
                </span>
                <span className="text-xs text-zinc-600">
                  {selectedSource === "chatgpt"
                    ? "conversations.json from ChatGPT export"
                    : selectedSource === "claude"
                    ? "JSON export or pasted conversation"
                    : "Any text with your ideas"}
                </span>
              </button>
            </div>

            <div className="w-px bg-zinc-800" />

            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Or paste conversation text directly..."
                className="flex-1 bg-[#030811] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-[#f0b93b]/40 min-h-[120px]"
                data-testid="input-text-paste"
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || ingestMutation.isPending}
                className="px-4 py-2 bg-[#f0b93b]/20 text-[#f0b93b] border border-[#f0b93b]/30 rounded text-sm font-medium hover:bg-[#f0b93b]/30 transition-all disabled:opacity-30"
                data-testid="btn-submit-text"
              >
                {ingestMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Analyze Ideas
                  </span>
                )}
              </button>
            </div>
          </div>

          {ingestMutation.isError && (
            <div className="mt-3 text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Failed to ingest. Check format and try again.
            </div>
          )}

          {ingestMutation.isSuccess && (
            <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Import received. Analysis running in background.
            </div>
          )}
        </div>

        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#f0b93b]/30 rounded-lg bg-[#f0b93b]/5 p-4 flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-[#f0b93b] animate-spin" />
            <div>
              <div className="text-sm text-[#f0b93b] font-medium">UInVerse is analyzing...</div>
              <div className="text-xs text-zinc-400">Clouud is reading your chat history and extracting actionable ideas.</div>
            </div>
          </motion.div>
        )}

        {imports && imports.length > 0 && (
          <div className="border border-border/30 rounded-lg bg-[#060e1a] p-4" data-testid="imports-panel">
            <h3 className="text-xs font-medium text-zinc-500 mb-3 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Import History
            </h3>
            <div className="space-y-2">
              {imports.map(imp => (
                <button
                  key={imp.id}
                  onClick={() => setActiveImportId(activeImportId === imp.id ? null : imp.id)}
                  className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between transition-all ${
                    activeImportId === imp.id
                      ? "bg-[#f0b93b]/10 border border-[#f0b93b]/30"
                      : "bg-white/5 border border-transparent hover:border-zinc-700"
                  }`}
                  data-testid={`btn-import-${imp.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                      imp.source === "chatgpt" ? "bg-emerald-400/10 text-emerald-400" : imp.source === "claude" ? "bg-orange-400/10 text-orange-400" : "bg-zinc-400/10 text-zinc-400"
                    }`}>
                      {imp.source}
                    </span>
                    <span className="text-zinc-400">{imp.filename || "pasted text"}</span>
                    <span className="text-zinc-600">{imp.messageCount} msgs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {imp.status === "complete" ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {imp.ideasExtracted} ideas
                      </span>
                    ) : imp.status === "error" ? (
                      <span className="text-red-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Error
                      </span>
                    ) : (
                      <span className="text-[#f0b93b] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Analyzing
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(ideas && ideas.length > 0) && (
          <div data-testid="ideas-panel">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f0b93b]" />
                Extracted Ideas
                <span className="text-zinc-500 font-normal">({filteredIdeas.length})</span>
              </h2>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  {["BUILD", "CONSIDER", "SKIP"].map(v => (
                    <button
                      key={v}
                      onClick={() => setFilterVerdict(filterVerdict === v ? null : v)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all border ${
                        filterVerdict === v
                          ? VERDICT_COLORS[v]
                          : "text-zinc-500 bg-transparent border-transparent hover:border-zinc-700"
                      }`}
                      data-testid={`btn-filter-${v.toLowerCase()}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="w-px bg-zinc-800" />
                <div className="flex gap-1">
                  {["TOOL", "FEATURE", "CONCEPT", "ARCHITECTURE"].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterCategory(filterCategory === c ? null : c)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all border flex items-center gap-1 ${
                        filterCategory === c
                          ? "text-[#4a8cd4] bg-[#4a8cd4]/10 border-[#4a8cd4]/30"
                          : "text-zinc-500 bg-transparent border-transparent hover:border-zinc-700"
                      }`}
                      data-testid={`btn-filter-cat-${c.toLowerCase()}`}
                    >
                      {CATEGORY_ICONS[c]}
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {filteredIdeas.map(idea => (
                  <motion.div
                    key={idea.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-border/30 rounded-lg bg-[#060e1a] overflow-hidden"
                    data-testid={`idea-card-${idea.id}`}
                  >
                    <button
                      onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3"
                    >
                      <div className={`flex-shrink-0 ${PRIORITY_COLORS[idea.priority]}`}>
                        {CATEGORY_ICONS[idea.category] || <Lightbulb className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{idea.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${VERDICT_COLORS[idea.verdict]}`}>
                            {idea.verdict}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">{idea.category}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate">{idea.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-mono text-zinc-400">{idea.confidence}%</div>
                          <div className={`text-[10px] ${PRIORITY_COLORS[idea.priority]}`}>{idea.priority}</div>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleImplemented.mutate({ id: idea.id, implemented: !idea.implemented });
                          }}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            idea.implemented
                              ? "bg-emerald-400/20 text-emerald-400"
                              : "bg-white/5 text-zinc-600 hover:text-zinc-400"
                          }`}
                          title={idea.implemented ? "Mark as not implemented" : "Mark as implemented"}
                          data-testid={`btn-toggle-implemented-${idea.id}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${expandedIdea === idea.id ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedIdea === idea.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-border/20 pt-3 space-y-3">
                            <div>
                              <h4 className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Reasoning</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed">{idea.reasoning}</p>
                            </div>
                            {idea.sourceExcerpt && (
                              <div>
                                <h4 className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Source Excerpt</h4>
                                <div className="text-xs text-zinc-500 bg-[#030811] rounded p-2 font-mono leading-relaxed max-h-32 overflow-y-auto">
                                  {idea.sourceExcerpt}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {(!ideas || ideas.length === 0) && !analyzing && (
          <div className="text-center py-16">
            <Brain className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-sm text-zinc-500 mb-1">No ideas extracted yet</h3>
            <p className="text-xs text-zinc-700">Upload your ChatGPT or Claude chat history above to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
