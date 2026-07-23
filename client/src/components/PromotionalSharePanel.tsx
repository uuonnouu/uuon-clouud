/**
 * PROMOTIONAL SHARE PANEL
 * Generate locked preview links for individual shapes
 * Perfect for Sketchfab promotions and marketing
 * © 2025 UUON Foundation Inc.
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Link, ExternalLink, Lock, Share2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SurfaceParameters } from '../types/math';
import { generatePromotionalLink } from '../lib/shareURLParser';
import { formatShapeName } from '../lib/shapeCategories';

interface PromotionalSharePanelProps {
  parameters: SurfaceParameters;
  shapeName?: string;
  onClose?: () => void;
}

export default function PromotionalSharePanel({
  parameters,
  shapeName,
  onClose
}: PromotionalSharePanelProps) {
  const [customName, setCustomName] = useState(shapeName || '');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const displayName = customName || formatShapeName(parameters.type);

  const handleGenerateLink = () => {
    const link = generatePromotionalLink(parameters, customName || undefined);
    setGeneratedLink(link);
    toast.success('Promotional link generated!');
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenInNewTab = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 rounded-xl border-2 border-purple-500/30 p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-purple-300">Promotional Share</h3>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full">
          <Share2 className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] text-purple-300 uppercase tracking-wide">Locked Preview</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-200 leading-relaxed">
            Generate a <strong className="text-purple-300">locked preview link</strong> that showcases only this specific shape. 
            Perfect for Sketchfab promotions, social media, and customer previews.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Current Shape</Label>
            <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
              <span className="text-sm font-medium text-white">{displayName}</span>
              <span className="text-xs text-gray-500 ml-2">({parameters.type})</span>
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-400 mb-1 block">Custom Display Name (Optional)</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g., Premium Torus Collection"
              className="h-8 text-sm bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-800/30 rounded">
              <span className="text-gray-500">Parameters:</span>
              <span className="text-cyan-300 ml-1">A={parameters.a}, B={parameters.b}, C={parameters.c}</span>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <span className="text-gray-500">UV Range:</span>
              <span className="text-green-300 ml-1">[{parameters.uMin?.toFixed(1)}, {parameters.uMax?.toFixed(1)}]</span>
            </div>
          </div>

          <Button
            onClick={handleGenerateLink}
            className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
          >
            <Link className="w-4 h-4 mr-2" />
            Generate Locked Preview Link
          </Button>

          {generatedLink && (
            <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-green-500/30">
              <Label className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Preview Link Ready
              </Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="flex-1 h-8 text-xs bg-gray-900/50 border-gray-700 text-gray-300 font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className={`h-8 px-3 ${copied ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-gray-600 text-gray-300'}`}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="h-8 px-3 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Recipients can only view and interact with this specific shape. They cannot access other models.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-yellow-300">How Locked Preview Works</h4>
              <ul className="mt-1 text-[10px] text-yellow-200/80 space-y-1">
                <li>• Visitors can rotate, zoom, and explore the 3D model</li>
                <li>• Shape selector is disabled - only this shape is accessible</li>
                <li>• Parameters are locked to your exact settings</li>
                <li>• Banner shows this is a promotional preview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
