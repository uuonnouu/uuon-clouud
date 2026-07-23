import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { X, Twitter, Facebook, Linkedin, Link2, Download, Check, Share2 } from 'lucide-react';
import { SurfaceParameters } from '../types/math';
import { formatShapeName } from '../lib/shapeCategories';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: SurfaceParameters;
  shapeName: string;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function SocialShareModal({
  isOpen,
  onClose,
  parameters,
  shapeName,
  canvasRef,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    params.set('shape', parameters.type);
    
    const azKeys = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    azKeys.forEach(key => {
      const value = (parameters as any)[key];
      if (value !== undefined) {
        const precision = Math.abs(value) < 0.01 ? 6 : 4;
        params.set(key, value.toFixed(precision));
      }
    });

    if (parameters.uMin !== undefined) params.set('uMin', String(parameters.uMin));
    if (parameters.uMax !== undefined) params.set('uMax', String(parameters.uMax));
    if (parameters.vMin !== undefined) params.set('vMin', String(parameters.vMin));
    if (parameters.vMax !== undefined) params.set('vMax', String(parameters.vMax));
    if (parameters.uSegments !== undefined) params.set('uSeg', String(parameters.uSegments));
    if (parameters.vSegments !== undefined) params.set('vSeg', String(parameters.vSegments));

    return `${baseUrl}/?${params.toString()}`;
  };

  const shareUrl = generateShareUrl();
  const shareText = `Check out this ${formatShapeName(shapeName)} shape I created in Δmension Mathematical Universe!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const threeCanvas = canvasRef?.current || document.querySelector('.three-canvas canvas') || document.querySelector('canvas[data-engine]') || document.querySelector('canvas');
      if (threeCanvas) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const dataUrl = threeCanvas.toDataURL('image/png', 1.0);
        setScreenshotUrl(dataUrl);
        console.log('📸 Screenshot captured successfully');
      } else {
        console.warn('No canvas found for screenshot');
      }
    } catch (err) {
      console.error('Failed to capture screenshot:', err);
    }
    setIsCapturing(false);
  };

  const downloadScreenshot = () => {
    if (screenshotUrl) {
      const link = document.createElement('a');
      link.download = `dimension-${shapeName}-${Date.now()}.png`;
      link.href = screenshotUrl;
      link.click();
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Share Your Creation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3">Share this {formatShapeName(shapeName)} on social media:</p>
          
          <div className="flex gap-3 mb-6">
            <Button
              onClick={shareToTwitter}
              className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter/X
            </Button>
            <Button
              onClick={shareToFacebook}
              className="flex-1 bg-[#4267B2] hover:bg-[#365899] text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={shareToLinkedIn}
              className="flex-1 bg-[#0077B5] hover:bg-[#006097] text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Share Link:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </Button>
          </div>
          {copied && (
            <p className="text-green-400 text-xs mt-1">Link copied to clipboard!</p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <label className="text-gray-400 text-sm mb-3 block">Capture Screenshot:</label>
          <div className="flex gap-3">
            <Button
              onClick={captureScreenshot}
              disabled={isCapturing}
              variant="outline"
              className="flex-1 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              {isCapturing ? 'Capturing...' : 'Capture Image'}
            </Button>
            {screenshotUrl && (
              <Button
                onClick={downloadScreenshot}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          {screenshotUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-700">
              <img src={screenshotUrl} alt="Screenshot preview" className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialShareModal;
