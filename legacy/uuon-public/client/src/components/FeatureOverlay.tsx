import React from 'react';
import { X, Maximize2 } from 'lucide-react';

interface FeatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  color?: string;
  children: React.ReactNode;
}

export default function FeatureOverlay({
  isOpen,
  onClose,
  title,
  subtitle,
  color = 'cyan',
  children,
}: FeatureOverlayProps) {
  if (!isOpen) return null;

  const colorMap: Record<string, { border: string; text: string; glow: string; bg: string; btn: string }> = {
    blue:    { border: 'border-blue-500/60',   text: 'text-blue-300',   glow: 'shadow-blue-500/20',   bg: 'from-blue-950/95 to-black/95',   btn: 'hover:bg-blue-500/20 text-blue-300' },
    purple:  { border: 'border-purple-500/60', text: 'text-purple-300', glow: 'shadow-purple-500/20', bg: 'from-purple-950/95 to-black/95', btn: 'hover:bg-purple-500/20 text-purple-300' },
    sky:     { border: 'border-sky-500/60',    text: 'text-sky-300',    glow: 'shadow-sky-500/20',    bg: 'from-sky-950/95 to-black/95',    btn: 'hover:bg-sky-500/20 text-sky-300' },
    emerald: { border: 'border-emerald-500/60',text: 'text-emerald-300',glow: 'shadow-emerald-500/20',bg: 'from-emerald-950/95 to-black/95',btn: 'hover:bg-emerald-500/20 text-emerald-300' },
    rose:    { border: 'border-rose-500/60',   text: 'text-rose-300',   glow: 'shadow-rose-500/20',   bg: 'from-rose-950/95 to-black/95',   btn: 'hover:bg-rose-500/20 text-rose-300' },
    teal:    { border: 'border-teal-500/60',   text: 'text-teal-300',   glow: 'shadow-teal-500/20',   bg: 'from-teal-950/95 to-black/95',   btn: 'hover:bg-teal-500/20 text-teal-300' },
    cyan:    { border: 'border-cyan-500/60',   text: 'text-cyan-300',   glow: 'shadow-cyan-500/20',   bg: 'from-cyan-950/95 to-black/95',   btn: 'hover:bg-cyan-500/20 text-cyan-300' },
    violet:  { border: 'border-violet-500/60', text: 'text-violet-300', glow: 'shadow-violet-500/20', bg: 'from-violet-950/95 to-black/95', btn: 'hover:bg-violet-500/20 text-violet-300' },
    amber:   { border: 'border-amber-500/60',  text: 'text-amber-300',  glow: 'shadow-amber-500/20',  bg: 'from-amber-950/95 to-black/95',  btn: 'hover:bg-amber-500/20 text-amber-300' },
    green:   { border: 'border-green-500/60',  text: 'text-green-300',  glow: 'shadow-green-500/20',  bg: 'from-green-950/95 to-black/95',  btn: 'hover:bg-green-500/20 text-green-300' },
    yellow:  { border: 'border-yellow-500/60', text: 'text-yellow-300', glow: 'shadow-yellow-500/20', bg: 'from-yellow-950/95 to-black/95', btn: 'hover:bg-yellow-500/20 text-yellow-300' },
    pink:    { border: 'border-pink-500/60',   text: 'text-pink-300',   glow: 'shadow-pink-500/20',   bg: 'from-pink-950/95 to-black/95',   btn: 'hover:bg-pink-500/20 text-pink-300' },
  };

  const c = colorMap[color] ?? colorMap['cyan'];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative z-10 w-full h-full max-w-4xl max-h-[90vh] mx-auto my-auto
                    flex flex-col rounded-xl border-2 ${c.border} bg-gradient-to-b ${c.bg}
                    shadow-2xl ${c.glow} overflow-hidden`}
        style={{ margin: '5vh 20px' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b ${c.border} flex-shrink-0 bg-black/40`}>
          <div className="flex items-center gap-3">
            <Maximize2 className={`w-4 h-4 ${c.text}`} />
            <div>
              <h2 className={`text-sm font-bold ${c.text}`}>{title}</h2>
              {subtitle && <p className="text-[10px] text-white/40 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${c.btn} border border-white/10`}
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
