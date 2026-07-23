import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, QrCode } from 'lucide-react';
import { SurfaceParameters } from '../types/math';

interface ShareButtonProps {
  parameters: SurfaceParameters;
  shapeName: string;
}

function generateShareableURL(parameters: SurfaceParameters): string {
  const baseURL = window.location.origin + window.location.pathname;
  
  const shareParams = new URLSearchParams();
  shareParams.set('shape', parameters.type);
  shareParams.set('a', String(parameters.a || 2));
  shareParams.set('b', String(parameters.b || 2));
  shareParams.set('c', String(parameters.c || 2));
  
  if (parameters.d) shareParams.set('d', String(parameters.d));
  if (parameters.e) shareParams.set('e', String(parameters.e));
  if (parameters.f) shareParams.set('f', String(parameters.f));
  if (parameters.g) shareParams.set('g', String(parameters.g));
  
  if (parameters.uMin !== undefined) shareParams.set('uMin', String(parameters.uMin));
  if (parameters.uMax !== undefined) shareParams.set('uMax', String(parameters.uMax));
  if (parameters.vMin !== undefined) shareParams.set('vMin', String(parameters.vMin));
  if (parameters.vMax !== undefined) shareParams.set('vMax', String(parameters.vMax));
  
  if (parameters.uSegments) shareParams.set('uSeg', String(parameters.uSegments));
  if (parameters.vSegments) shareParams.set('vSeg', String(parameters.vSegments));
  
  return `${baseURL}?${shareParams.toString()}`;
}

function formatShapeName(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ShareButton({ parameters, shapeName }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareURL = generateShareableURL(parameters);
  const displayName = formatShapeName(shapeName || parameters.type);
  const shareTitle = `Check out this ${displayName} - Δmension Mathematical Universe`;
  const shareText = `I created a beautiful ${displayName} mathematical structure using Δmension Mathematical Universe!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      const textArea = document.createElement('textarea');
      textArea.value = shareURL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\nView it here: ${shareURL}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareURL,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareURL)}`;
  };

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        className="bg-pink-400/20 hover:bg-pink-400/40 text-pink-300 border border-pink-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(244,114,182,0.4)] flex items-center gap-1"
        title="Share this shape"
      >
        <Share2 size={10} />
        <span>⧉</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-1">Share {displayName}</h3>
            <p className="text-gray-400 text-sm">Share this mathematical structure</p>
          </div>

          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
              <input
                type="text"
                value={shareURL}
                readOnly
                className="flex-1 bg-transparent text-gray-300 text-xs outline-none truncate"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-1 text-center">Link copied!</p>
            )}
          </div>

          <div className="p-3 border-b border-gray-700">
            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">Share to</p>
            <div className="flex gap-2">
              <button
                onClick={shareToTwitter}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] rounded-lg transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={18} className="text-white" />
              </button>
              <button
                onClick={shareToFacebook}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#4267B2] hover:bg-[#365899] rounded-lg transition-colors"
                title="Share on Facebook"
              >
                <Facebook size={18} className="text-white" />
              </button>
              <button
                onClick={shareToLinkedIn}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-[#0077B5] hover:bg-[#006097] rounded-lg transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={18} className="text-white" />
              </button>
              <button
                onClick={shareByEmail}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                title="Share via Email"
              >
                <Mail size={18} className="text-white" />
              </button>
            </div>
          </div>

          <div className="p-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              <QrCode size={18} />
              <span className="text-sm">{showQR ? 'Hide' : 'Show'} QR Code</span>
            </button>
            {showQR && (
              <div className="mt-3 flex justify-center">
                <img
                  src={generateQRCode()}
                  alt="QR Code"
                  className="w-32 h-32 rounded-lg bg-white p-2"
                />
              </div>
            )}
          </div>

          <div className="p-2 bg-gray-800/50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full p-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export { generateShareableURL };
