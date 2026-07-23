import React, { useState } from 'react';
import { Eye, Compass, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';

interface WelcomeGateProps {
  onEnter: () => void;
}

export default function WelcomeGate({ onEnter }: WelcomeGateProps) {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (isAtBottom) {
      setScrolledToBottom(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 pt-14 sm:pt-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          
          {/* Header - Compact on mobile */}
          <div className="text-center p-4 sm:p-6 md:p-8 border-b border-gray-700/50">
            <div className="flex justify-center mb-2 sm:mb-4">
              <img 
                src="/dmension-logo.png" 
                alt="Δmension Logo" 
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl shadow-2xl shadow-purple-500/30"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Δmension
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Mathematical Universe</p>
          </div>

          {/* Content - Scrollable with better mobile sizing */}
          <div 
            className="p-3 sm:p-4 md:p-6 max-h-[55vh] sm:max-h-[50vh] overflow-y-auto space-y-3 sm:space-y-4"
            onScroll={handleScroll}
          >
            
            {/* What This Is */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                <h2 className="text-cyan-300 font-semibold text-sm sm:text-base">What This Application Is</h2>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0">•</span>
                  <span>A <strong className="text-white">visual exploration tool</strong> for mathematical concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0">•</span>
                  <span>An <strong className="text-white">intuitive learning space</strong> for geometry and patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0">•</span>
                  <span>A <strong className="text-white">demonstration platform</strong> for conceptual thinking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5 flex-shrink-0">•</span>
                  <span>An <strong className="text-white">educational experience</strong> for visual understanding</span>
                </li>
              </ul>
            </div>

            {/* What This Is NOT */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                <h2 className="text-amber-300 font-semibold text-sm sm:text-base">What This Application Is NOT</h2>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">✕</span>
                  <span>Not a production system or commercial product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">✕</span>
                  <span>Not an export or output generation platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">✕</span>
                  <span>Not a system requiring wallets or tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">✕</span>
                  <span>Not a platform making official claims</span>
                </li>
              </ul>
            </div>

            {/* Access Conditions */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                <h2 className="text-purple-300 font-semibold text-sm sm:text-base">Access & Usage</h2>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                  <span>Access is <strong className="text-white">limited and controlled</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                  <span>Features are for <strong className="text-white">viewing and demonstration</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                  <span>Advanced features are <strong className="text-white">not publicly available</strong></span>
                </li>
              </ul>
            </div>

            {/* Data Disclaimer */}
            <div className="bg-gray-700/30 border border-gray-600/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <h2 className="text-gray-300 font-semibold text-sm sm:text-base">Data & Content</h2>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                All data presented is <strong className="text-gray-200">illustrative, experimental, and non-binding</strong>. 
                It does not represent official scientific results, operational data, or real-world decisions.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border border-gray-600/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed">
                "This application is an intuitive exploration and visualization tool designed to clarify ideas and patterns — 
                not a production, execution, or export system."
              </p>
            </div>

          </div>

          {/* Footer - Entry - Compact on mobile */}
          <div className="p-3 sm:p-4 md:p-6 border-t border-gray-700/50 bg-gray-900/50">
            <label className="flex items-start sm:items-center gap-2 sm:gap-3 cursor-pointer mb-3 sm:mb-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 mt-0.5 sm:mt-0 flex-shrink-0"
              />
              <span className="text-gray-300 text-xs sm:text-sm leading-tight">
                I understand this is an exploration and demonstration tool
              </span>
            </label>
            
            <button
              onClick={onEnter}
              disabled={!accepted}
              className={`w-full py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                accepted
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 shadow-lg'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Enter Application
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
