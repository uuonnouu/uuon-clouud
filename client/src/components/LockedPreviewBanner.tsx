/**
 * LOCKED PREVIEW BANNER
 * Displays when user is viewing a locked promotional preview
 * © 2025 UUON Foundation Inc.
 */

import React from 'react';
import { Button } from './ui/button';
import { Lock, Sparkles, ExternalLink } from 'lucide-react';
import { formatShapeName } from '../lib/shapeCategories';

interface LockedPreviewBannerProps {
  shapeName?: string;
  shapeType: string;
  onUnlock?: () => void;
}

export default function LockedPreviewBanner({
  shapeName,
  shapeType,
  onUnlock
}: LockedPreviewBannerProps) {
  const displayName = shapeName || formatShapeName(shapeType);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-sm border-b-2 border-purple-500/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-400/30">
              <Lock className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-semibold text-purple-200">Preview Mode</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium">{displayName}</span>
              <span className="text-gray-400 text-sm">- Interactive 3D Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-xs text-purple-300/80">
              Rotate & zoom to explore this shape
            </div>
            
            <Button
              onClick={onUnlock}
              className="h-8 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white text-sm font-semibold shadow-lg"
            >
              <ExternalLink className="w-3 h-3 mr-1.5" />
              Explore Full Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
