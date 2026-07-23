
import React, { useState } from 'react';
import { Sigma, Eye, EyeOff, Search } from 'lucide-react';
import SymbolBrowser from './SymbolBrowser';
import UniversalSymbolRenderer from './UniversalSymbolRenderer';

interface MathSymbolPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MathSymbolPanel({ isOpen, onToggle }: MathSymbolPanelProps) {
  const [activeSymbol, setActiveSymbol] = useState<string>('nabla');
  const [renderMode, setRenderMode] = useState<'2d' | '3d' | 'both'>('both');

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-50 bg-purple-500/90 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-colors"
        title="Universal Math Symbols"
      >
        <Sigma className="w-6 h-6" />
      </button>

      {/* Symbol Panel */}
      {isOpen && (
        <div className="fixed left-2 sm:left-4 bottom-20 z-40 w-[calc(100vw-1rem)] sm:w-80 md:w-96 h-[70vh] sm:h-96 bg-black/90 backdrop-blur-sm border border-purple-500/50 rounded-lg shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <h3 className="text-purple-400 font-bold flex items-center gap-2">
                <Sigma className="w-5 h-5" />
                Universal Math Symbols
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRenderMode(renderMode === '2d' ? '3d' : renderMode === '3d' ? 'both' : '2d')}
                  className="text-gray-400 hover:text-white transition-colors"
                  title={`Current: ${renderMode.toUpperCase()}`}
                >
                  {renderMode === '3d' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={onToggle}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <SymbolBrowser
                renderMode={renderMode}
                onSymbolSelect={setActiveSymbol}
              />
            </div>

            {/* Status Bar */}
            <div className="border-t border-gray-700 px-3 py-2 text-xs text-gray-400">
              Back-end: ✅ Connected • 3D Engine: ✅ Active • Mode: {renderMode.toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
