/**
 * AUTHORSHIP VERIFICATION PANEL
 * UI for verifying 3D model authorship fingerprints
 */

import React, { useState } from 'react';
import * as THREE from 'three';
import { verifyAuthorship, VerificationResult, AuthorshipSignature } from '../lib/authorshipFingerprint';

interface Props {
  geometry: THREE.BufferGeometry | null;
  shapeName: string;
}

export function AuthorshipVerificationPanel({ geometry, shapeName }: Props) {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!geometry) {
      alert('No geometry loaded');
      return;
    }

    setIsVerifying(true);
    try {
      // For demonstration, create a mock signature (in production, this would come from file metadata)
      const mockSignature: AuthorshipSignature = {
        hash: '',
        timestamp: new Date().toISOString(),
        shapeId: shapeName,
        author: 'Phillip Aguilar Ruiz III',
        organization: 'UUON Foundation Inc.',
        copyright: '© 2024 UUON Foundation Inc. All Rights Reserved.',
        verificationCode: '',
        version: '1.0'
      };

      const result = await verifyAuthorship(geometry, mockSignature);
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-cyan-500/30 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔐</span>
        <h3 className="text-white font-bold text-lg">Authorship Verification</h3>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <p className="text-gray-300">
          Multi-layered protection system:
        </p>
        <ul className="text-gray-400 space-y-1 pl-4">
          <li>• Cryptographic Hash (SHA-256)</li>
          <li>• Hidden Geometry Watermark</li>
          <li>• Digital Signature</li>
          <li>• Blockchain-ready Fingerprint</li>
        </ul>
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || !geometry}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {isVerifying ? 'Verifying...' : 'Verify Authorship'}
      </button>

      {verificationResult && (
        <div className={`mt-4 p-3 rounded-lg border ${
          verificationResult.verified 
            ? 'bg-green-900/30 border-green-500/50' 
            : 'bg-red-900/30 border-red-500/50'
        }`}>
          <p className={`font-bold mb-2 ${
            verificationResult.verified ? 'text-green-400' : 'text-red-400'
          }`}>
            {verificationResult.message}
          </p>
          
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <span>{verificationResult.hashMatch ? '✅' : '❌'}</span>
              <span>Hash Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{verificationResult.watermarkMatch ? '✅' : '❌'}</span>
              <span>Watermark Intact</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-gray-500">Author: {verificationResult.signature.author}</p>
              <p className="text-gray-500 text-[10px] break-all mt-1">
                Hash: {verificationResult.currentHash.substring(0, 16)}...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          © 2024 UUON Foundation Inc.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          All biological and mathematical models are protected by multi-layered authorship fingerprints.
        </p>
      </div>
    </div>
  );
}
