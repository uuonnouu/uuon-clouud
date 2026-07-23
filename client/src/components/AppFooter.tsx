import { useState } from 'react';
import { Info } from 'lucide-react';

interface AppFooterProps {
  onLegalClick: () => void;
  onInfoClick: () => void;
}

export function AppFooter({ onLegalClick, onInfoClick }: AppFooterProps) {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900/50 to-gray-900 border-t border-purple-500/30 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <button
            onClick={onInfoClick}
            className="flex items-center gap-1 hover:text-purple-400 transition-colors"
            title="How the system works"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How It Works</span>
          </button>
          <span className="hidden sm:inline">|</span>
          <button
            onClick={onLegalClick}
            className="hover:text-purple-400 transition-colors"
            title="Terms of Service & Legal Notice"
          >
            Terms & Legal
          </button>
        </div>
        
        <div className="text-center flex items-center justify-center gap-3">
          <img 
            src="/dmension-logo-new.jpg" 
            alt="Δmension / Dmension Logo" 
            className="w-8 h-8 rounded-md opacity-90"
          />
          <div>
            <p className="text-xs text-gray-400 font-medium">
              © 2025 UUON Foundation Inc, Δmension / Dmension Mathematical Universe
            </p>
            <p className="text-[10px] text-gray-500">
              Pronounced "dimension" | Canonical Geometry System
            </p>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 hidden sm:block">
          2,546+ Shapes | 148 Categories
        </div>
      </div>
    </footer>
  );
}
