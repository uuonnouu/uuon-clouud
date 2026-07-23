import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Shuffle, Zap, Download, Layers } from 'lucide-react';
import { useIFSStore, FOLD_DESC, FSC_SAFE_CAP, IFSParams } from '../stores/ifsStore';

const FOLD_NAMES = ['NONE', 'BOX', 'KLEINIAN', 'LATTICE', 'TETRA', 'ICOSA', 'OCTA', 'DODECA'];
const SHADING_NAMES = ['IRID', 'TRAP/PAL', 'NORMAL', 'DEPTH'];
const CONTAINER_NAMES = ['OPEN', 'SPHERE', 'CUBE'];
const TRAP_NAMES = ['CYL', 'SPHERE', 'CROSS', 'POINT'];
const VARIANT_NAMES = ['STD', 'SPIKEY', 'SLICEY', 'HILLY', 'SMOOTH'];
const PALETTE_NAMES = ['UUON', 'EMBER', 'ICE', 'VOID'];
const SECTION_NAMES = ['NONE', 'CUT-X', 'CUT-Y', 'CUT-Z'];
const MB_POW_PRESETS = [2, 3, 4, 8, 12, 16];

// Weave-specific labels
const WEAVE_NAMES  = ['PLAIN', 'TWILL', 'SATEEN', 'HONEYCOMB', 'LENO', 'JACQUARD'];
const WEAVE_SHADING = ['FIBER', 'DEPTH', 'TENSION', 'NORMAL'];
const WEAVE_SECTION_NAMES = ['OFF', 'WARP', 'WEFT', 'FILL', 'BIAS'];

// L-System labels
const LSYS_NAMES   = ['VASCULAR', 'NEURAL', 'MYCELIUM', 'CRYSTAL'];
const LSYS_SHADING = ['BIOFILM', 'DEPTH', 'STRESS', 'IRIDESCENT'];

// RD labels
const RD_SHADING = ['CHEMICAL', 'IRIDESCENT', 'HEAT', 'VOID'];

function SliderRow({
  label, value, min, max, step, decimals = 2,
  onChange, accent = 'cyan',
}: {
  label: string; value: number; min: number; max: number; step: number;
  decimals?: number; onChange: (v: number) => void; accent?: string;
}) {
  const accentColor: Record<string, string> = {
    cyan: 'text-cyan-400', gold: 'text-yellow-400', violet: 'text-violet-400',
    green: 'text-green-400', orange: 'text-orange-400',
  };
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={accentColor[accent] ?? 'text-cyan-400'}>{value.toFixed(decimals)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[2px] cursor-pointer accent-cyan-400"
        style={{ accentColor: accent === 'gold' ? '#facc15' : accent === 'violet' ? '#a78bfa' : accent === 'green' ? '#4ade80' : accent === 'orange' ? '#fb923c' : '#22d3ee' }}
      />
    </div>
  );
}

function ButtonGroup({
  options, value, onChange, small = false,
}: {
  options: string[]; value: number; onChange: (v: number) => void; small?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {options.map((label, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`px-2 py-0.5 ${small ? 'text-[8px]' : 'text-[9px]'} border rounded transition-all ${
            value === i
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
              : 'border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-2 hover:bg-cyan-500/5 transition-colors"
        onClick={onToggle}
      >
        <span className="text-cyan-400/80 text-[10px] tracking-widest uppercase">{title}</span>
        {open ? <ChevronUp className="w-3 h-3 text-cyan-400/50" /> : <ChevronDown className="w-3 h-3 text-cyan-400/50" />}
      </button>
      {open && <div className="px-2 pb-2">{children}</div>}
    </div>
  );
}

type MeshQuality = 'draft' | 'standard' | 'high';

const QUALITY_META: Record<MeshQuality, { label: string; tris: string; res: number }> = {
  draft:    { label: 'Draft',    tris: '~5k–20k tris',   res: 22 },
  standard: { label: 'Standard', tris: '~20k–80k tris',  res: 34 },
  high:     { label: 'High',     tris: '~80k–300k tris', res: 46 },
};

function ExportGLBPanel({
  onExportGLB,
  exportState,
}: {
  onExportGLB?: (mode: 'texture' | 'mesh', quality?: MeshQuality) => void;
  exportState?: { exporting: boolean; progress: string; pct: number };
}) {
  const [quality, setQuality] = React.useState<MeshQuality>('standard');
  if (!onExportGLB) return null;
  const qm = QUALITY_META[quality];
  return (
    <div className="mt-2 bg-black/40 border border-cyan-500/20 rounded p-2">
      <div className="text-[9px] text-cyan-400/80 tracking-widest uppercase mb-2 flex items-center gap-1">
        <Download className="w-3 h-3" /> Export GLB
      </div>
      {exportState?.exporting ? (
        <div className="text-[9px] text-cyan-400/70">
          <div className="mb-1 truncate">{exportState.progress}</div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-200"
              style={{ width: `${exportState.pct}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <button
            onClick={() => onExportGLB('texture')}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[9px] border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 rounded hover:bg-cyan-500/20 transition-colors"
          >
            <Download className="w-3 h-3" /> Frame GLB
            <span className="text-[8px] text-cyan-400/50 ml-1">(instant)</span>
          </button>

          <div className="border border-violet-500/20 rounded p-1.5 space-y-1">
            <div className="text-[8px] text-violet-400/70 uppercase tracking-wider">Mesh quality</div>
            <div className="flex gap-1">
              {(Object.keys(QUALITY_META) as MeshQuality[]).map(q => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex-1 text-[8px] py-1 rounded border transition-colors ${
                    quality === q
                      ? 'border-violet-400 bg-violet-500/30 text-violet-200'
                      : 'border-violet-500/20 bg-black/30 text-violet-400/60 hover:bg-violet-500/10'
                  }`}
                >
                  {QUALITY_META[q].label}
                </button>
              ))}
            </div>
            <div className="text-[8px] text-violet-400/50 text-center">{qm.tris} · res {qm.res}³</div>
            <button
              onClick={() => onExportGLB('mesh', quality)}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[9px] border border-violet-500/40 bg-violet-500/10 text-violet-300 rounded hover:bg-violet-500/20 transition-colors"
            >
              <Layers className="w-3 h-3" /> Mesh GLB
              <span className="text-[8px] text-violet-400/50 ml-1">(real 3D)</span>
            </button>
          </div>

          <div className="text-[8px] text-gray-600 leading-relaxed">
            Frame: texture-plane of current render ·
            Mesh: CPU isosurface (Weave / L-System / Mandelbulb / IFS)
          </div>
        </div>
      )}
    </div>
  );
}

interface IFSControlPanelProps {
  shapeType: string;
  onExportGLB?: (mode: 'texture' | 'mesh', quality?: MeshQuality) => void;
  exportState?: { exporting: boolean; progress: string; pct: number };
}

const IFSControlPanel: React.FC<IFSControlPanelProps> = ({ shapeType, onExportGLB, exportState }) => {
  const { params, setParam, randomExplore, chaosBoundary, getDNA } = useIFSStore();
  const [copied, setCopied] = useState(false);
  const [sec1Open, setSec1Open] = useState(true);
  const [sec2Open, setSec2Open] = useState(true);
  const [sec3Open, setSec3Open] = useState(false);
  const [modeOpen, setModeOpen] = useState(true);
  const [mbOpen, setMbOpen] = useState(true);
  const [foldOpen, setFoldOpen] = useState(true);
  const [mengerOpen, setMengerOpen] = useState(true);
  const [foldPreOpen, setFoldPreOpen] = useState(true);
  const [containerOpen, setContainerOpen] = useState(false);
  const [shadingOpen, setShadingOpen] = useState(false);

  const isMandelbulb = params.mode === 1;
  const isIcosa = params.ft === 5;
  const isOcta = params.ft === 6;
  const isDodeca = params.ft === 7;
  const isPlatonic = isIcosa || isOcta || isDodeca;

  const dna = getDNA();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(dna).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [dna]);

  const sp = <T extends keyof IFSParams>(k: T) => (v: IFSParams[T]) => setParam(k, v);

  const setFt = useCallback((v: number) => {
    setParam('ft', v);
    const cap = FSC_SAFE_CAP[v] ?? 2.0;
    if (params.fsc > cap) setParam('fsc', cap);
  }, [params.fsc, setParam]);

  const setFsc = useCallback((v: number) => {
    const cap = FSC_SAFE_CAP[params.ft] ?? 4.0;
    setParam('fsc', Math.min(v, cap));
  }, [params.ft, setParam]);

  // ── FRACTAL WEAVE controls ─────────────────────────────────────────────────
  if (shapeType === 'fractal_weave') {
    return (
      <div className="space-y-2 text-[11px]">
        <div className="bg-black/50 border border-cyan-500/20 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500 text-[9px] tracking-widest uppercase">Weave DNA</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-[9px] text-cyan-400/60 hover:text-cyan-400 transition-colors">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-[8px] text-cyan-300/70 break-all">{dna.replace(/\|/g, ' | ')}</div>
        </div>

        <Section title="Weave Structure" open={sec1Open} onToggle={() => setSec1Open(o => !o)}>
          <p className="text-[8px] text-gray-500 mb-2">ft parameter selects weave type</p>
          <ButtonGroup options={WEAVE_NAMES} value={params.ft} onChange={setFt} small />
        </Section>

        <Section title="Thread Parameters" open={sec2Open} onToggle={() => setSec2Open(o => !o)}>
          <SliderRow label="Warp density (ox)" value={params.ox} min={0.2} max={2.5} step={0.05}
            onChange={sp('ox')} accent="cyan" />
          <SliderRow label="Weft density (oy)" value={params.oy} min={0.2} max={2.5} step={0.05}
            onChange={sp('oy')} accent="gold" />
          <SliderRow label="Thread radius (mr)" value={params.mr} min={0.05} max={0.8} step={0.01}
            onChange={sp('mr')} accent="violet" />
          <SliderRow label="Float length (fs)" value={params.fs} min={0.5} max={8.0} step={0.5} decimals={1}
            onChange={sp('fs')} accent="cyan" />
          <SliderRow label="Twist (fsc→twist)" value={Math.max(0, (params.fsc - 1) / 3)} min={0} max={1} step={0.02} decimals={2}
            onChange={v => setFsc(v * 3 + 1)} accent="gold" />
        </Section>

        <Section title="Fractal Depth" open={sec3Open} onToggle={() => setSec3Open(o => !o)}>
          <SliderRow label="Weave depth (mi)" value={params.mi} min={1} max={6} step={1} decimals={0}
            onChange={sp('mi')} />
          <SliderRow label="Scale ratio (sc)" value={params.sc} min={2.0} max={5.0} step={0.05}
            onChange={sp('sc')} />
          <SliderRow label="Blend (bl)" value={params.bl} min={0} max={1} step={0.01} decimals={2} accent="violet"
            onChange={sp('bl')} />
          <div className="mb-2">
            <p className="text-[9px] text-gray-400 mb-1">Section cut (fi→axis)</p>
            <ButtonGroup options={WEAVE_SECTION_NAMES} value={Math.min(4, Math.max(0, params.fi - 1))} onChange={v => setParam('fi', v + 1)} small />
          </div>
          <div className="mb-2">
            <p className="text-[9px] text-gray-400 mb-1">Container (con)</p>
            <ButtonGroup options={CONTAINER_NAMES} value={params.con} onChange={sp('con')} small />
          </div>
        </Section>

        <Section title="Shading" open={shadingOpen} onToggle={() => setShadingOpen(o => !o)}>
          <ButtonGroup options={WEAVE_SHADING} value={params.cm} onChange={sp('cm')} small />
          <SliderRow label="Brightness" value={params.bright} min={0.5} max={3.0} step={0.05} onChange={sp('bright')} />
          <SliderRow label="Specular" value={params.sp} min={0} max={2.0} step={0.05} onChange={sp('sp')} />
          <SliderRow label="Light azimuth (la)" value={params.la} min={0} max={360} step={1} decimals={0} onChange={sp('la')} />
          <SliderRow label="March steps (rs)" value={params.rs} min={64} max={220} step={4} decimals={0} onChange={sp('rs')} />
          <SliderRow label="Camera dist (dv)" value={params.dv} min={1.0} max={10.0} step={0.1} onChange={sp('dv')} />
        </Section>

        <div className="bg-black/30 border border-gray-700/40 rounded p-2 text-[8px] text-gray-600 leading-relaxed">
          <span className="text-yellow-400/60">Weave Engine —</span> 6 textile fold types drive a thread-cylinder IFS.
          Warp/weft asymmetry (ox≠oy) creates anisotropic attractor geometry.
        </div>
        <ExportGLBPanel onExportGLB={onExportGLB} exportState={exportState} />
      </div>
    );
  }

  // ── L-SYSTEM IFS controls ──────────────────────────────────────────────────
  if (shapeType === 'lsystem_ifs') {
    return (
      <div className="space-y-2 text-[11px]">
        <div className="bg-black/50 border border-green-500/20 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500 text-[9px] tracking-widest uppercase">Growth DNA</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-[9px] text-green-400/60 hover:text-green-400 transition-colors">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-[8px] text-green-300/70 break-all">{dna.replace(/\|/g, ' | ')}</div>
        </div>

        <Section title="Growth Mode" open={sec1Open} onToggle={() => setSec1Open(o => !o)}>
          <ButtonGroup options={LSYS_NAMES} value={params.ls} onChange={sp('ls')} small />
          <div className="text-[8px] text-gray-500 mt-1 leading-relaxed">
            {['Murray\'s law binary branching — minimises transport work in vascular networks.',
              'Phi-ratio dendrite spreading — cortical neuron arborization pattern.',
              'Ternary hyphal network — space-filling mycelial growth with anastomosis.',
              'Cubic axis growth — mineral crystal branching along crystallographic planes.'
            ][params.ls]}
          </div>
        </Section>

        <Section title="Branch Parameters" open={sec2Open} onToggle={() => setSec2Open(o => !o)}>
          <SliderRow label="Tree depth (mi)" value={params.mi} min={1} max={3} step={1} decimals={0}
            onChange={sp('mi')} />
          <SliderRow label="Branch radius (mr)" value={params.mr} min={0.02} max={0.3} step={0.005} decimals={3}
            onChange={sp('mr')} accent="green" />
          <SliderRow label="Branch angle (fs → rad)" value={params.fs} min={0.1} max={2.0} step={0.05} decimals={2}
            onChange={sp('fs')} accent="gold" />
          <SliderRow label="Growth scale (lg)" value={params.lg} min={0.5} max={1.2} step={0.02} decimals={2}
            onChange={sp('lg')} accent="cyan" />
          <SliderRow label="Tropism (lt)" value={params.lt} min={0.0} max={1.0} step={0.02} decimals={2}
            onChange={sp('lt')} accent="violet" />
        </Section>

        <Section title="IFS Background" open={sec3Open} onToggle={() => setSec3Open(o => !o)}>
          <SliderRow label="IFS/L-system blend (bl)" value={params.bl} min={0} max={1} step={0.01} decimals={2} accent="violet"
            onChange={sp('bl')} />
          <p className="text-[8px] text-gray-500 mb-1">IFS fold type (background attractor)</p>
          <ButtonGroup options={FOLD_NAMES} value={params.ft} onChange={setFt} small />
          <SliderRow label="IFS iterations (mi)" value={params.mi} min={1} max={4} step={1} decimals={0}
            onChange={sp('mi')} />
          <SliderRow label="IFS scale (sc)" value={params.sc} min={2.0} max={4.0} step={0.05}
            onChange={sp('sc')} />
          <SliderRow label="IFS fold scale (fsc)" value={params.fsc} min={1.0} max={FSC_SAFE_CAP[params.ft] ?? 2.0} step={0.02}
            onChange={setFsc} accent="gold" />
        </Section>

        <Section title="Shading" open={shadingOpen} onToggle={() => setShadingOpen(o => !o)}>
          <ButtonGroup options={LSYS_SHADING} value={params.cm} onChange={sp('cm')} small />
          <SliderRow label="Brightness" value={params.bright} min={0.5} max={3.0} step={0.05} onChange={sp('bright')} />
          <SliderRow label="Specular" value={params.sp} min={0} max={2.0} step={0.05} onChange={sp('sp')} />
          <SliderRow label="Light azimuth (la)" value={params.la} min={0} max={360} step={1} decimals={0} onChange={sp('la')} />
          <SliderRow label="March steps (rs)" value={params.rs} min={64} max={220} step={4} decimals={0} onChange={sp('rs')} />
          <SliderRow label="Camera dist (dv)" value={params.dv} min={1.0} max={12.0} step={0.1} onChange={sp('dv')} />
        </Section>

        <div className="bg-black/30 border border-gray-700/40 rounded p-2 text-[8px] text-gray-600 leading-relaxed">
          <span className="text-green-400/60">L-System Engine —</span> Capsule-SDF branching tree combined with IFS
          via smooth-min(). Blend (bl) controls whether the IFS surface or branches dominate.
        </div>
        <ExportGLBPanel onExportGLB={onExportGLB} exportState={exportState} />
      </div>
    );
  }

  // ── REACTION-DIFFUSION IFS controls ────────────────────────────────────────
  if (shapeType === 'reaction_diffusion_ifs') {
    return (
      <div className="space-y-2 text-[11px]">
        <div className="bg-black/50 border border-orange-500/20 rounded p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500 text-[9px] tracking-widest uppercase">RD–IFS DNA</span>
            <button onClick={handleCopy} className="flex items-center gap-1 text-[9px] text-orange-400/60 hover:text-orange-400 transition-colors">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-[8px] text-orange-300/70 break-all">{dna.replace(/\|/g, ' | ')}</div>
        </div>

        <Section title="Gray-Scott Chemistry" open={sec1Open} onToggle={() => setSec1Open(o => !o)}>
          <p className="text-[8px] text-gray-500 mb-2 leading-relaxed">
            dA/dt = Da·∇²A − A·B² + F(1−A)<br />
            dB/dt = Db·∇²B + A·B² − (F+K)·B
          </p>
          {/* Chemical pattern presets */}
          <p className="text-[9px] text-gray-400 mb-1">Pattern presets</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {([
              { label: 'Spots',     rdF: 0.037, rdK: 0.061 },
              { label: 'Stripes',   rdF: 0.060, rdK: 0.062 },
              { label: 'Labyrinth', rdF: 0.052, rdK: 0.065 },
              { label: 'Worms',     rdF: 0.025, rdK: 0.055 },
              { label: 'Holes',     rdF: 0.039, rdK: 0.058 },
            ] as { label: string; rdF: number; rdK: number }[]).map(preset => {
              const active = Math.abs(params.rdF - preset.rdF) < 0.0005 && Math.abs(params.rdK - preset.rdK) < 0.0005;
              return (
                <button
                  key={preset.label}
                  onClick={() => { setParam('rdF', preset.rdF); setParam('rdK', preset.rdK); }}
                  className={`px-2 py-0.5 text-[9px] border rounded transition-all ${
                    active
                      ? 'border-orange-400 bg-orange-400/15 text-orange-300'
                      : 'border-gray-600 text-gray-500 hover:border-orange-400/50 hover:text-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <SliderRow label="Feed rate F (rdF)" value={params.rdF} min={0.01} max={0.09} step={0.001} decimals={3}
            onChange={sp('rdF')} accent="orange" />
          <SliderRow label="Kill rate K (rdK)" value={params.rdK} min={0.04} max={0.07} step={0.001} decimals={3}
            onChange={sp('rdK')} accent="gold" />
        </Section>

        <Section title="IFS Seed (Topology)" open={sec2Open} onToggle={() => setSec2Open(o => !o)}>
          <p className="text-[8px] text-gray-500 mb-2">IFS orbit trap seeds the RD field</p>
          <ButtonGroup options={FOLD_NAMES} value={params.ft} onChange={setFt} small />
          <SliderRow label="IFS iterations (mi)" value={params.mi} min={1} max={5} step={1} decimals={0}
            onChange={sp('mi')} />
          <SliderRow label="IFS scale (sc)" value={params.sc} min={2.0} max={4.0} step={0.05}
            onChange={sp('sc')} />
          <SliderRow label="IFS fold scale (fsc)" value={params.fsc} min={1.0} max={FSC_SAFE_CAP[params.ft] ?? 2.0} step={0.02}
            onChange={setFsc} accent="gold" />
          <SliderRow label="Blend (bl)" value={params.bl} min={0} max={1} step={0.01} decimals={2} accent="violet"
            onChange={sp('bl')} />
        </Section>

        <Section title="Shading" open={shadingOpen} onToggle={() => setShadingOpen(o => !o)}>
          <ButtonGroup options={RD_SHADING} value={params.cm} onChange={sp('cm')} small />
          <SliderRow label="Brightness / Contrast" value={params.bright} min={0.5} max={3.0} step={0.05}
            onChange={sp('bright')} />
          <SliderRow label="March steps (rs)" value={params.rs} min={64} max={200} step={4} decimals={0}
            onChange={sp('rs')} />
          <SliderRow label="Camera dist (dv)" value={params.dv} min={1.0} max={12.0} step={0.1}
            onChange={sp('dv')} />
        </Section>

        <div className="bg-black/30 border border-gray-700/40 rounded p-2 text-[8px] text-gray-600 leading-relaxed">
          <span className="text-orange-400/60">RD Engine —</span> Gray-Scott reaction-diffusion (256×256 ping-pong)
          seeded from IFS orbit trap. Surface hit points sample the evolved RD texture via triplanar projection.
        </div>
        <ExportGLBPanel onExportGLB={onExportGLB} exportState={exportState} />
      </div>
    );
  }

  // ── STANDARD IFS controls (all other shapes) ───────────────────────────────
  return (
    <div className="space-y-2 text-[11px]">

      {/* Shape DNA */}
      <div className="bg-black/50 border border-cyan-500/20 rounded p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-500 text-[9px] tracking-widest uppercase">Shape DNA</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[9px] text-cyan-400/60 hover:text-cyan-400 transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="font-mono text-[8px] text-cyan-300/70 break-all leading-relaxed">
          {dna.replace(/\|/g, ' | ')}
        </div>
      </div>

      {/* Discovery */}
      <div className="flex gap-2">
        <button
          onClick={randomExplore}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[9px] border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400 rounded transition-all"
        >
          <Shuffle className="w-3 h-3" /> Random Explore
        </button>
        <button
          onClick={chaosBoundary}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[9px] border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 rounded transition-all"
        >
          <Zap className="w-3 h-3" /> Chaos Boundary
        </button>
      </div>

      {/* Engine Mode */}
      <Section title="Engine Mode" open={modeOpen} onToggle={() => setModeOpen(o => !o)}>
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setParam('mode', 0)}
            className={`flex-1 py-1 text-[9px] border rounded transition-all ${
              !isMandelbulb ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300' : 'border-gray-600 text-gray-500 hover:border-gray-400'
            }`}
          >
            IFS / Menger
          </button>
          <button
            onClick={() => setParam('mode', 1)}
            className={`flex-1 py-1 text-[9px] border rounded transition-all ${
              isMandelbulb ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300' : 'border-gray-600 text-gray-500 hover:border-gray-400'
            }`}
          >
            Mandelbulb
          </button>
        </div>
        <p className="text-[8px] text-gray-600 leading-relaxed">
          {isMandelbulb
            ? 'Mandelbulb triplex power raymarcher. Skytopia/Nylander formula. 5 variants.'
            : 'Menger IFS attractor with optional fold pretransform and 4D lift.'}
        </p>
      </Section>

      {/* Mandelbulb Controls — shown when mode=1 */}
      {isMandelbulb && (
        <Section title="Mandelbulb" open={mbOpen} onToggle={() => setMbOpen(o => !o)}>
          {/* Animate toggle */}
          <div className="mb-3">
            <button
              onClick={() => setParam('animate', !params.animate)}
              className={`w-full flex items-center justify-center gap-2 py-1.5 text-[9px] border rounded transition-all ${
                params.animate
                  ? 'border-yellow-400 bg-yellow-400/15 text-yellow-300'
                  : 'border-gray-600 text-gray-500 hover:border-yellow-500/50 hover:text-gray-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${params.animate ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`} />
              {params.animate ? 'Animate ON — orbit · pulse · palette' : 'Animate OFF'}
            </button>
            {params.animate && (
              <p className="text-[8px] text-yellow-400/50 mt-1 leading-relaxed text-center">
                Y-orbit 0.18 rad/s · pow ±0.5·sin(t) · palette phase shift
              </p>
            )}
          </div>
          <div className="mb-2">
            <div className="text-[9px] text-gray-500 mb-1">Power Presets</div>
            <div className="flex gap-1 flex-wrap">
              {MB_POW_PRESETS.map(pw => (
                <button
                  key={pw}
                  onClick={() => setParam('pow', pw)}
                  className={`px-2 py-0.5 text-[9px] border rounded transition-all ${
                    params.pow === pw ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300' : 'border-gray-600 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  P{pw}
                </button>
              ))}
            </div>
          </div>
          <SliderRow label="Power" value={params.pow ?? 8} min={2} max={16} step={0.1} decimals={1} accent="gold"
            onChange={v => setParam('pow', v)} />
          <SliderRow label="Iterations" value={params.mbIter ?? 7} min={1} max={14} step={1} decimals={0}
            onChange={v => setParam('mbIter', v)} />
          <SliderRow label="March Steps" value={params.rs} min={48} max={220} step={4} decimals={0}
            onChange={v => setParam('rs', v)} />
          <SliderRow label="Bailout" value={params.bail ?? 2.0} min={1.2} max={4.0} step={0.05} decimals={2}
            onChange={v => setParam('bail', v)} />
          <div className="mb-2">
            <div className="text-[9px] text-gray-500 mb-1">Variant</div>
            <ButtonGroup options={VARIANT_NAMES} value={params.variant ?? 0} onChange={v => setParam('variant', v)} small />
          </div>
          <div className="mb-2">
            <div className="text-[9px] text-gray-500 mb-1">Palette</div>
            <ButtonGroup options={PALETTE_NAMES} value={params.pal ?? 0} onChange={v => setParam('pal', v)} small />
          </div>
          <SliderRow label="Glow Halo" value={params.glow ?? 0.3} min={0} max={1.0} step={0.02} decimals={2} accent="violet"
            onChange={v => setParam('glow', v)} />
          <SliderRow label="Light Elevation" value={params.le} min={-80} max={80} step={1} decimals={0}
            onChange={v => setParam('le', v)} />
          <div className="mb-2">
            <div className="text-[9px] text-gray-500 mb-1">Cross-Section</div>
            <ButtonGroup options={SECTION_NAMES} value={params.cutAxis ?? 0} onChange={v => setParam('cutAxis', v)} small />
            {(params.cutAxis ?? 0) > 0 && (
              <SliderRow label="Cut Position" value={params.cutPos ?? 0} min={-1} max={1} step={0.01} decimals={2} accent="orange"
                onChange={v => setParam('cutPos', v)} />
            )}
          </div>
          <div className="bg-black/30 rounded p-1.5 text-[8px] text-gray-600 leading-relaxed">
            <span className="text-yellow-400/60">Nylander/White DE:</span> z → zⁿ + c (triplex spherical coords)<br />
            <span className="text-yellow-400/60">Variant {params.variant ?? 0}:</span> {VARIANT_NAMES[params.variant ?? 0]}
          </div>
        </Section>
      )}

      {/* IFS Controls — shown when mode=0 */}
      {!isMandelbulb && (
        <>
          {/* Fold Type */}
          <Section title="Fold Type" open={foldOpen} onToggle={() => setFoldOpen(o => !o)}>
            <ButtonGroup options={FOLD_NAMES} value={params.ft} onChange={setFt} small />
            <p className="text-[8px] text-gray-600 leading-relaxed mt-1">{FOLD_DESC[params.ft]}</p>
          </Section>

          {isPlatonic && (
            <div className="bg-black/40 border border-yellow-500/20 rounded p-2 text-[8px] text-gray-500 leading-relaxed">
              <span className="text-yellow-400/60">Platonic fold active:</span>{' '}
              {isIcosa && 'Ih group (120 ops) — 5-fold quasicrystalline axes. phi-scaled offset.'}
              {isOcta && 'Oh group (48 ops) — abs+sort to octahedral fundamental domain.'}
              {isDodeca && 'Ih group (120 ops) — cubic+icosahedral mirror planes. Pentagonal compound.'}
            </div>
          )}

          {/* Menger IFS */}
          <Section title="Menger IFS" open={mengerOpen} onToggle={() => setMengerOpen(o => !o)}>
            <SliderRow label="Iterations (mi)" value={params.mi} min={1} max={6} step={1} decimals={0}
              onChange={v => setParam('mi', v)} />
            <SliderRow label="Scale (sc)" value={params.sc} min={2.0} max={5.0} step={0.02}
              onChange={v => setParam('sc', v)} />
            <SliderRow label="Offset X (ox)" value={params.ox} min={0.2} max={2.5} step={0.01}
              onChange={v => setParam('ox', v)} />
            <SliderRow label="Offset Y (oy)" value={params.oy} min={0.2} max={2.5} step={0.01}
              onChange={v => setParam('oy', v)} />
            <SliderRow label="Offset Z (oz)" value={params.oz ?? 1.0} min={0.2} max={2.5} step={0.01} accent="gold"
              onChange={v => setParam('oz', v)} />
            <SliderRow label="Twist (XY torsion)" value={params.twist ?? 0} min={0} max={Math.PI} step={0.005} decimals={3} accent="violet"
              onChange={v => setParam('twist', v)} />
            <div className="mb-2">
              <div className="text-[9px] text-gray-500 mb-1">Orbit Trap</div>
              <ButtonGroup options={TRAP_NAMES} value={params.trap ?? 0} onChange={v => setParam('trap', v)} small />
            </div>
            <div className="bg-black/30 rounded p-1.5 text-[8px] text-gray-600 leading-relaxed">
              <span className="text-cyan-400/50">Menger (Knighty):</span> abs → sort desc → s·p − o·(s−1)<br />
              <span className="text-cyan-400/50">OZ</span> = independent Z offset ·{' '}
              <span className="text-violet-400/50">Twist</span> = XY torsion per iter
            </div>
          </Section>

          {/* Fold Pretransform */}
          <Section title="Fold Pretransform" open={foldPreOpen} onToggle={() => setFoldPreOpen(o => !o)}>
            <SliderRow label="Fold Iterations (fi)" value={params.fi} min={1} max={8} step={1} decimals={0}
              onChange={v => setParam('fi', v)} />
            <SliderRow label="Fold Size (fs)" value={params.fs} min={0.1} max={3.0} step={0.01} accent="gold"
              onChange={v => setParam('fs', v)} />
            <div className="mb-1">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-gray-400">
                  Fold Scale (fsc)
                  <span className="text-orange-400/60 ml-1">≤{FSC_SAFE_CAP[params.ft]?.toFixed(2)} safe</span>
                </span>
                <span className="text-cyan-400">{params.fsc.toFixed(2)}</span>
              </div>
              <input
                type="range" min={1.0} max={FSC_SAFE_CAP[params.ft] ?? 4.0} step={0.02}
                value={Math.min(params.fsc, FSC_SAFE_CAP[params.ft] ?? 4.0)}
                onChange={e => setFsc(parseFloat(e.target.value))}
                className="w-full h-[2px] cursor-pointer"
                style={{ accentColor: '#22d3ee' }}
              />
            </div>
            <SliderRow label="Min Radius (mr)" value={params.mr} min={0.01} max={2.0} step={0.01}
              onChange={v => setParam('mr', v)} />
            <SliderRow label="Blend (bl)" value={params.bl} min={0.0} max={1.0} step={0.005} decimals={3} accent="violet"
              onChange={v => setParam('bl', v)} />
          </Section>

          {/* Container */}
          <Section title="Container" open={containerOpen} onToggle={() => setContainerOpen(o => !o)}>
            <ButtonGroup options={CONTAINER_NAMES} value={params.con} onChange={v => setParam('con', v)} />
            <SliderRow label="Container Size (cs)" value={params.cs} min={0.5} max={6.0} step={0.05}
              onChange={v => setParam('cs', v)} />
          </Section>
        </>
      )}

      {/* Shading — both modes */}
      <Section title="Shading" open={shadingOpen} onToggle={() => setShadingOpen(o => !o)}>
        <ButtonGroup options={SHADING_NAMES} value={params.cm} onChange={v => setParam('cm', v)} />
        {!isMandelbulb && (
          <div className="mb-2">
            <div className="text-[9px] text-gray-500 mb-1">Palette</div>
            <ButtonGroup options={PALETTE_NAMES} value={params.pal ?? 0} onChange={v => setParam('pal', v)} small />
          </div>
        )}
        <SliderRow label="Brightness" value={params.bright} min={0.5} max={3.0} step={0.05}
          onChange={v => setParam('bright', v)} />
        <SliderRow label="Specular" value={params.sp} min={0} max={2.0} step={0.05}
          onChange={v => setParam('sp', v)} />
        <SliderRow label="Light Azimuth" value={params.la} min={0} max={360} step={1} decimals={0}
          onChange={v => setParam('la', v)} />
        <SliderRow label="Light Elevation" value={params.le} min={-80} max={80} step={1} decimals={0}
          onChange={v => setParam('le', v)} />
        {!isMandelbulb && (
          <SliderRow label="March Steps" value={params.rs} min={48} max={220} step={4} decimals={0}
            onChange={v => setParam('rs', v)} />
        )}
      </Section>

      <div className="bg-black/30 border border-gray-700/40 rounded p-2 text-[8px] text-gray-600 leading-relaxed">
        <span className="text-cyan-400/50">A-Z bridge:</span>{' '}
        <span className="text-cyan-300/60">A</span> = Camera distance ·{' '}
        <span className="text-cyan-300/60">B</span> = Field of view ·{' '}
        <span className="text-cyan-300/60">C</span> = Brightness
      </div>

      <ExportGLBPanel onExportGLB={onExportGLB} exportState={exportState} />

    </div>
  );
};

export default IFSControlPanel;
