import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Map, GitMerge, Zap, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

interface DiscoveredShape {
  shapeId: string;
  shapeType: string;
  category: string;
  bridge: string;
  whyThisWillSurprise: string;
  exploreFirst?: boolean;
}

interface DiscoveryResult {
  hook: string;
  insight: string;
  shapes: DiscoveredShape[];
  journey: string;
  nextDepth: string;
}

interface SparkResult {
  shapeId: string;
  shapeType: string;
  category: string;
  hook: string;
  story: string;
  visual: string;
  realWorldAppearances: string[];
  mindShift: string;
  relatedSparks: { shapeId: string; shapeType: string; teaser: string }[];
}

interface JourneyStep {
  stepNumber: number;
  shapeId: string;
  shapeType: string;
  category: string;
  narrative: string;
  whatToNotice: string;
  question: string;
  transitionTo: string;
}

interface JourneyResult {
  journeyTitle: string;
  premise: string;
  totalTime: string;
  steps: JourneyStep[];
  revelation: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShapeSelect: (shapeType: string) => void;
  currentShape?: string;
}

type Tab = 'discover' | 'spark' | 'journey';

export default function ClaudeDiscoveryPanel({ isOpen, onClose, onShapeSelect, currentShape }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('spark');
  const [interestInput, setInterestInput] = useState('');
  const [journeyTheme, setJourneyTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [discovery, setDiscovery] = useState<DiscoveryResult | null>(null);
  const [spark, setSpark] = useState<SparkResult | null>(null);
  const [journey, setJourney] = useState<JourneyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousShapes, setPreviousShapes] = useState<string[]>([]);
  const [apiReady, setApiReady] = useState<boolean | null>(null);

  // Check if Claude is configured
  useEffect(() => {
    fetch('/api/ai-analysis/health')
      .then(r => r.json())
      .then(d => setApiReady(d.keyConfigured))
      .catch(() => setApiReady(false));
  }, []);

  // Load daily spark on open
  useEffect(() => {
    if (isOpen && activeTab === 'spark' && !spark && apiReady) {
      loadSpark();
    }
  }, [isOpen, activeTab, apiReady]);

  const loadSpark = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-analysis/spark');
      const data = await res.json();
      if (data.success) setSpark(data.spark);
      else setError(data.error || 'Failed to load spark');
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const discover = useCallback(async () => {
    if (!interestInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-analysis/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest: interestInput.trim(), previousShapes })
      });
      const data = await res.json();
      if (data.success) setDiscovery(data.discovery);
      else setError(data.error || 'Discovery failed');
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }, [interestInput, previousShapes]);

  const generateJourney = useCallback(async () => {
    if (!journeyTheme.trim() && !currentShape) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai-analysis/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: journeyTheme.trim() || undefined,
          startShape: !journeyTheme.trim() ? currentShape : undefined,
          experienceLevel: 'curious'
        })
      });
      const data = await res.json();
      if (data.success) setJourney(data.journey);
      else setError(data.error || 'Journey generation failed');
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  }, [journeyTheme, currentShape]);

  const handleShapeClick = (shapeType: string) => {
    onShapeSelect(shapeType);
    setPreviousShapes(prev => [...new Set([...prev, shapeType])]);
  };

  if (!isOpen) return null;

  const needsKey = apiReady === false;

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-gray-950/98 border-l border-cyan-500/40 z-50 flex flex-col shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 to-purple-950/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 font-semibold text-sm tracking-wide">Discovery Intelligence</span>
          <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">Claude</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* API Key Warning */}
      {needsKey && (
        <div className="mx-4 mt-3 p-3 bg-amber-950/60 border border-amber-500/40 rounded-lg text-xs text-amber-300">
          Add your <code className="bg-amber-900/40 px-1 rounded">ANTHROPIC_API_KEY</code> secret to activate Claude discovery. Get one at <span className="text-amber-200 underline">console.anthropic.com</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-cyan-500/20">
        {([
          { id: 'spark', icon: Zap, label: 'Spark' },
          { id: 'discover', icon: Sparkles, label: 'Discover' },
          { id: 'journey', icon: Map, label: 'Journey' }
        ] as { id: Tab; icon: React.ElementType; label: string }[]).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              if (id === 'spark' && !spark && apiReady) loadSpark();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === id
                ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── SPARK TAB ── */}
        {activeTab === 'spark' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              One shape. One story. Something that changes how you see the world.
            </p>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            )}

            {error && <div className="text-red-400 text-xs p-3 bg-red-950/30 rounded-lg border border-red-500/30">{error}</div>}

            {spark && !loading && (
              <div className="space-y-3">
                {/* Hook */}
                <div className="p-3 bg-gradient-to-br from-cyan-950/50 to-purple-950/50 rounded-xl border border-cyan-500/30">
                  <p className="text-cyan-200 text-sm font-medium leading-snug">{spark.hook}</p>
                </div>

                {/* Shape Card */}
                <button
                  onClick={() => handleShapeClick(spark.shapeType)}
                  className="w-full text-left p-3 bg-gray-900/60 rounded-xl border border-gray-700/60 hover:border-cyan-500/50 hover:bg-gray-900/80 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{spark.shapeType}</span>
                    <div className="flex items-center gap-1 text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400 uppercase tracking-wide">{spark.category}</span>
                  <p className="text-gray-300 text-xs mt-2 leading-relaxed">{spark.story}</p>
                  <p className="text-gray-400 text-xs mt-1.5 italic">{spark.visual}</p>
                </button>

                {/* Where it appears */}
                {spark.realWorldAppearances?.length > 0 && (
                  <div className="p-2.5 bg-gray-900/40 rounded-lg border border-gray-700/40">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1.5">Found in the real world</p>
                    <div className="flex flex-wrap gap-1">
                      {spark.realWorldAppearances.map((app, i) => (
                        <span key={i} className="text-[10px] bg-gray-800/80 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700/50">{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mind shift */}
                <div className="p-2.5 bg-purple-950/30 rounded-lg border border-purple-500/20">
                  <p className="text-[10px] text-purple-400 uppercase tracking-wide mb-1">What you'll understand after exploring this</p>
                  <p className="text-purple-200 text-xs leading-relaxed">{spark.mindShift}</p>
                </div>

                {/* Related sparks */}
                {spark.relatedSparks?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Then explore these</p>
                    {spark.relatedSparks.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleShapeClick(s.shapeType)}
                        className="w-full text-left p-2.5 bg-gray-900/40 rounded-lg border border-gray-700/40 hover:border-cyan-500/40 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs font-medium">{s.shapeType}</span>
                          <ArrowRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-gray-400 text-[11px] mt-0.5">{s.teaser}</p>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={loadSpark}
                  disabled={loading || !apiReady}
                  className="w-full py-2 text-xs text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-950/30 transition-colors disabled:opacity-40"
                >
                  New spark
                </button>
              </div>
            )}

            {!spark && !loading && !error && apiReady && (
              <button
                onClick={loadSpark}
                className="w-full py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-300 text-sm hover:bg-cyan-950/60 transition-colors"
              >
                Generate today's discovery
              </button>
            )}
          </div>
        )}

        {/* ── DISCOVER TAB ── */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              Tell Claude what you love — anything. Music, architecture, space, cooking, sports. It will find the mathematical shapes hidden inside your passion.
            </p>

            <div className="space-y-2">
              <textarea
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                placeholder="What fascinates you? e.g. 'the way ocean waves curl' or 'jazz improvisation' or 'how cities grow'..."
                className="w-full h-24 bg-gray-900/60 border border-gray-700/60 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/60"
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) discover(); }}
              />
              <button
                onClick={discover}
                disabled={loading || !interestInput.trim() || !apiReady}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-700/60 to-purple-700/60 border border-cyan-500/40 rounded-xl text-white text-sm font-medium hover:from-cyan-700/80 hover:to-purple-700/80 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Finding your shapes...' : 'Discover my mathematical universe'}
              </button>
            </div>

            {error && <div className="text-red-400 text-xs p-3 bg-red-950/30 rounded-lg border border-red-500/30">{error}</div>}

            {discovery && !loading && (
              <div className="space-y-3">
                {/* Hook */}
                <div className="p-3 bg-gradient-to-br from-cyan-950/50 to-purple-950/50 rounded-xl border border-cyan-500/30">
                  <p className="text-cyan-200 text-sm font-medium leading-snug">{discovery.hook}</p>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">{discovery.insight}</p>

                {/* Shape cards */}
                <div className="space-y-2">
                  {discovery.shapes?.map((shape, i) => (
                    <button
                      key={i}
                      onClick={() => handleShapeClick(shape.shapeType)}
                      className={`w-full text-left p-3 rounded-xl border transition-all group ${
                        shape.exploreFirst
                          ? 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400/60'
                          : 'bg-gray-900/50 border-gray-700/40 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {shape.exploreFirst && (
                              <span className="text-[9px] bg-cyan-700/40 text-cyan-300 px-1.5 py-0.5 rounded uppercase tracking-wide border border-cyan-500/30">Start here</span>
                            )}
                            <span className="text-white text-sm font-medium truncate">{shape.shapeType}</span>
                          </div>
                          <span className="text-[10px] text-purple-400 uppercase tracking-wide">{shape.category}</span>
                          <p className="text-gray-300 text-[11px] mt-1.5 leading-relaxed">{shape.bridge}</p>
                          <p className="text-cyan-400/80 text-[11px] mt-1 italic">{shape.whyThisWillSurprise}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-gray-900/40 rounded-lg border border-gray-700/30">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">The journey together</p>
                  <p className="text-gray-300 text-xs">{discovery.journey}</p>
                </div>

                <div className="p-2.5 bg-purple-950/30 rounded-lg border border-purple-500/20">
                  <p className="text-[10px] text-purple-400 uppercase tracking-wide mb-1">Where this leads</p>
                  <p className="text-purple-200 text-xs">{discovery.nextDepth}</p>
                </div>

                <button
                  onClick={() => { setDiscovery(null); setInterestInput(''); }}
                  className="w-full py-2 text-xs text-gray-400 border border-gray-700/40 rounded-lg hover:bg-gray-900/40 transition-colors"
                >
                  Discover something else
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── JOURNEY TAB ── */}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              Generate a curated path through shapes that tells a coherent intellectual story — each step builds on the last toward a profound insight.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={journeyTheme}
                onChange={e => setJourneyTheme(e.target.value)}
                placeholder={currentShape ? `Journey from "${currentShape}" or enter a theme...` : 'Enter a theme e.g. "infinity", "symmetry breaking", "life"'}
                className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/60"
                onKeyDown={e => { if (e.key === 'Enter') generateJourney(); }}
              />
              <button
                onClick={generateJourney}
                disabled={loading || (!journeyTheme.trim() && !currentShape) || !apiReady}
                className="w-full py-2.5 bg-gradient-to-r from-purple-700/60 to-cyan-700/60 border border-purple-500/40 rounded-xl text-white text-sm font-medium hover:from-purple-700/80 hover:to-cyan-700/80 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                {loading ? 'Charting your journey...' : 'Generate discovery journey'}
              </button>
            </div>

            {error && <div className="text-red-400 text-xs p-3 bg-red-950/30 rounded-lg border border-red-500/30">{error}</div>}

            {journey && !loading && (
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-purple-950/50 to-cyan-950/50 rounded-xl border border-purple-500/30">
                  <p className="text-purple-200 text-sm font-semibold mb-1">{journey.journeyTitle}</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{journey.premise}</p>
                  {journey.totalTime && <p className="text-purple-400 text-[10px] mt-1.5">~ {journey.totalTime} exploration time</p>}
                </div>

                <div className="space-y-2">
                  {journey.steps?.map((step, i) => (
                    <div key={i} className="relative">
                      {i < (journey.steps.length - 1) && (
                        <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 to-transparent" />
                      )}
                      <button
                        onClick={() => handleShapeClick(step.shapeType)}
                        className="w-full text-left p-3 bg-gray-900/50 rounded-xl border border-gray-700/40 hover:border-cyan-500/40 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold flex-shrink-0">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-xs font-medium">{step.shapeType}</span>
                              <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-gray-300 text-[11px] mt-1 leading-relaxed">{step.narrative}</p>
                            {step.whatToNotice && (
                              <p className="text-cyan-400/70 text-[10px] mt-1 italic">Notice: {step.whatToNotice}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-gradient-to-br from-cyan-950/40 to-purple-950/40 rounded-xl border border-cyan-500/25">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-wide mb-1.5">The revelation</p>
                  <p className="text-cyan-100 text-xs leading-relaxed">{journey.revelation}</p>
                </div>

                <button
                  onClick={() => { setJourney(null); setJourneyTheme(''); }}
                  className="w-full py-2 text-xs text-gray-400 border border-gray-700/40 rounded-lg hover:bg-gray-900/40 transition-colors"
                >
                  Create a different journey
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer attribution */}
      <div className="px-4 py-2 border-t border-gray-800/60 text-[10px] text-gray-600 text-center">
        Powered by Claude · Δmension Discovery Intelligence
      </div>
    </div>
  );
}
