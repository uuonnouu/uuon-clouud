import { useState, useEffect } from 'react';
import { X, Sparkles, ImageIcon, Wrench, Loader2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ShapeAIEnhancerProps {
  isOpen: boolean;
  onClose: () => void;
  shapeType: string;
  shapeName?: string;
  shapeDescription?: string;
}

interface FixResult {
  whatItShouldLookLike?: string;
  geometricProperties?: string;
  equationApproach?: string;
  recommendedParams?: { a: number; b: number; c: number };
  visualTip?: string;
}

const KNOWN_BROKEN_SHAPES: Record<string, { issue: string; label: string }> = {
  sphinx_giza: { issue: 'Renders as a curved pipe instead of a recumbent lion with human head', label: '🦁 Sphinx Giza' },
  eye_of_ra: { issue: 'Renders as a flat sun disc instead of the iconic Egyptian almond eye with kohl tail', label: '☀️ Eye of Ra' },
  scarab_beetle: { issue: 'Does not resemble a scarab beetle shape', label: '🪲 Scarab Beetle' },
  ankh_cross: { issue: 'Loop and cross proportions may be off', label: '☥ Ankh Cross' },
  cartouche: { issue: 'Oval cartouche frame shape may be inaccurate', label: '📜 Cartouche' },
};

export default function ShapeAIEnhancer({ isOpen, onClose, shapeType, shapeName, shapeDescription }: ShapeAIEnhancerProps) {
  const [activeTab, setActiveTab] = useState<'reference' | 'fix' | 'analyze'>('reference');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [fixLoading, setFixLoading] = useState(false);
  const [fixError, setFixError] = useState<string | null>(null);
  const [showBrokenList, setShowBrokenList] = useState(false);
  const [needsOpenAI, setNeedsOpenAI] = useState(false);
  const [needsClaude, setNeedsClaude] = useState(false);

  const knownIssue = KNOWN_BROKEN_SHAPES[shapeType];
  const displayName = shapeName || shapeType.replace(/_/g, ' ');

  useEffect(() => {
    if (!isOpen) {
      setReferenceImage(null);
      setFixResult(null);
      setImageError(null);
      setFixError(null);
      setNeedsOpenAI(false);
      setNeedsClaude(false);
    }
  }, [isOpen, shapeType]);

  const generateReferenceImage = async () => {
    setImageLoading(true);
    setImageError(null);
    setReferenceImage(null);
    try {
      const res = await fetch('/api/ai-analysis/reference-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shapeType,
          shapeName: displayName,
          description: shapeDescription || knownIssue?.issue || ''
        })
      });
      const data = await res.json();
      if (data.status === 'needs_api_key') {
        setNeedsOpenAI(true);
        setImageError('OPENAI_API_KEY required — add it in Secrets to generate reference images');
      } else if (data.status === 'success' && data.imageUrl) {
        setReferenceImage(data.imageUrl);
      } else {
        setImageError(data.error || 'Image generation failed');
      }
    } catch (e: any) {
      setImageError(e.message || 'Network error');
    } finally {
      setImageLoading(false);
    }
  };

  const fixWithAI = async () => {
    setFixLoading(true);
    setFixError(null);
    setFixResult(null);
    try {
      const res = await fetch('/api/ai-analysis/fix-shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shapeType,
          shapeName: displayName,
          currentIssue: knownIssue?.issue || 'Shape does not visually match its name'
        })
      });
      const data = await res.json();
      if (data.status === 'needs_api_key') {
        setNeedsClaude(true);
        setFixError('ANTHROPIC_API_KEY required — add it in Secrets for Claude-powered shape analysis');
      } else if (data.status === 'success') {
        setFixResult(data);
      } else {
        setFixError(data.error || 'Fix analysis failed');
      }
    } catch (e: any) {
      setFixError(e.message || 'Network error');
    } finally {
      setFixLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-950 border border-purple-500/30 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">AI Shape Enhancer</h2>
              <p className="text-gray-400 text-xs">{displayName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Known Issue Banner */}
        {knownIssue && (
          <div className="mx-4 mt-3 px-3 py-2 bg-orange-950/50 border border-orange-500/30 rounded-lg text-xs text-orange-300 flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">⚠</span>
            <span><strong>Known rendering issue:</strong> {knownIssue.issue}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mt-3">
          {([
            { key: 'reference', icon: ImageIcon, label: 'Reference Image' },
            { key: 'fix', icon: Wrench, label: 'AI Analysis' },
            { key: 'analyze', icon: Sparkles, label: 'More Shapes' },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? 'text-purple-300 border-purple-500'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Reference Image Tab */}
          {activeTab === 'reference' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-xs leading-relaxed">
                Generate a DALL-E reference image showing what <strong className="text-white">{displayName}</strong> should actually look like. 
                Use this as a visual guide to understand the correct shape.
              </p>

              {!referenceImage && !imageLoading && (
                <button
                  onClick={generateReferenceImage}
                  disabled={imageLoading}
                  className="w-full py-3 bg-purple-700/30 hover:bg-purple-700/50 border border-purple-500/40 rounded-lg text-purple-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Generate Reference Image with DALL-E
                </button>
              )}

              {imageLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-gray-400 text-sm">DALL-E is generating your reference image...</p>
                  <p className="text-gray-600 text-xs">This takes about 15-30 seconds</p>
                </div>
              )}

              {imageError && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-3 text-xs text-red-300">
                  {imageError}
                  {needsOpenAI && (
                    <p className="mt-2 text-gray-400">To enable: go to Secrets and add <code className="bg-gray-800 px-1 rounded">OPENAI_API_KEY</code></p>
                  )}
                </div>
              )}

              {referenceImage && (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-gray-700">
                    <img src={referenceImage} alt={`${displayName} reference`} className="w-full object-cover" />
                    <div className="absolute bottom-2 right-2">
                      <a href={referenceImage} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md hover:bg-black/80 transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        Full size
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">Generated by DALL-E 3 · Use as a visual reference for what this shape should look like</p>
                  <button
                    onClick={generateReferenceImage}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Regenerate →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AI Fix Tab */}
          {activeTab === 'fix' && (
            <div className="space-y-4">
              <p className="text-gray-400 text-xs leading-relaxed">
                Claude will analyze <strong className="text-white">{displayName}</strong> and explain what the correct geometry should be, 
                what properties define it, and how to improve the parametric equation.
              </p>

              {!fixResult && !fixLoading && (
                <button
                  onClick={fixWithAI}
                  className="w-full py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-500/40 rounded-lg text-cyan-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Analyze with Claude
                </button>
              )}

              {fixLoading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                  <p className="text-gray-400 text-sm">Claude is analyzing the shape geometry...</p>
                </div>
              )}

              {fixError && (
                <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-3 text-xs text-red-300">
                  {fixError}
                  {needsClaude && (
                    <p className="mt-2 text-gray-400">To enable: go to Secrets and add <code className="bg-gray-800 px-1 rounded">ANTHROPIC_API_KEY</code></p>
                  )}
                </div>
              )}

              {fixResult && (
                <div className="space-y-3">
                  {fixResult.whatItShouldLookLike && (
                    <div className="bg-gray-900/60 rounded-lg p-3">
                      <p className="text-cyan-400 text-xs font-semibold mb-1">What it should look like</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{fixResult.whatItShouldLookLike}</p>
                    </div>
                  )}
                  {fixResult.geometricProperties && (
                    <div className="bg-gray-900/60 rounded-lg p-3">
                      <p className="text-purple-400 text-xs font-semibold mb-1">Geometric properties</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{fixResult.geometricProperties}</p>
                    </div>
                  )}
                  {fixResult.equationApproach && (
                    <div className="bg-gray-900/60 rounded-lg p-3">
                      <p className="text-green-400 text-xs font-semibold mb-1">Recommended approach</p>
                      <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono">{fixResult.equationApproach}</pre>
                    </div>
                  )}
                  {fixResult.visualTip && (
                    <div className="bg-yellow-950/30 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs font-semibold mb-1">Visual tip</p>
                      <p className="text-gray-300 text-xs leading-relaxed">{fixResult.visualTip}</p>
                    </div>
                  )}
                  {fixResult.recommendedParams && (
                    <div className="bg-gray-900/60 rounded-lg p-3">
                      <p className="text-orange-400 text-xs font-semibold mb-1">Recommended parameters</p>
                      <div className="flex gap-3 text-xs">
                        {Object.entries(fixResult.recommendedParams).map(([k, v]) => (
                          <span key={k} className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono">{k} = {v}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={fixWithAI} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Re-analyze →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* More Shapes Tab */}
          {activeTab === 'analyze' && (
            <div className="space-y-3">
              <p className="text-gray-400 text-xs leading-relaxed">
                These archetypal shapes have known rendering issues where the parametric formula doesn't match the visual archetype.
                The AI-generated 3D models (GLB files) are now the primary display for sphinx_giza and eye_of_ra.
              </p>

              <button
                onClick={() => setShowBrokenList(!showBrokenList)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {showBrokenList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showBrokenList ? 'Hide' : 'Show'} shapes with known issues ({Object.keys(KNOWN_BROKEN_SHAPES).length})
              </button>

              {showBrokenList && (
                <div className="space-y-2">
                  {Object.entries(KNOWN_BROKEN_SHAPES).map(([key, { issue, label }]) => (
                    <div key={key} className={`flex items-start gap-3 p-3 rounded-lg border text-xs ${
                      key === shapeType
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                        : 'bg-gray-900/50 border-gray-700 text-gray-400'
                    }`}>
                      <span className="font-medium whitespace-nowrap">{label}</span>
                      <span className="text-gray-500">{issue}</span>
                      {(key === 'sphinx_giza' || key === 'eye_of_ra') && (
                        <span className="ml-auto whitespace-nowrap text-green-400">✓ AI model</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 space-y-2">
                <p className="text-white font-medium text-xs">How AI shape enhancement works</p>
                <p>1. <strong className="text-gray-300">AI 3D Models</strong> — Meshy.ai generates accurate GLB files for iconic shapes like the Sphinx and Eye of Ra</p>
                <p>2. <strong className="text-gray-300">DALL-E Reference Images</strong> — Visual references showing what each shape should look like (requires OPENAI_API_KEY)</p>
                <p>3. <strong className="text-gray-300">Claude Analysis</strong> — Geometric analysis and formula improvement suggestions (requires ANTHROPIC_API_KEY)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
