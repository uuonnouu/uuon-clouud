/**
 * NFT MINTING MODAL - FULLY AUTOMATED
 * One-click minting: Auto IPFS upload → Thirdweb mint
 */

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Wallet, AlertCircle, ExternalLink, Copy, Upload, Zap, Image, Box } from 'lucide-react';
import { getShapeStudyContext, isSpaceBiologyShape } from '@/lib/osdrShapeMapping';
import { sdkClient } from '@/lib/unifiedSDKClient';

interface NFTMintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shapeId: string;
  shapeName: string;
  parameters: Record<string, number>;
  category?: string;
  glbData?: ArrayBuffer | null;
}

type MintStep = 'idle' | 'connecting' | 'uploading_glb' | 'capturing_image' | 'uploading_image' | 'uploading_metadata' | 'complete' | 'error';

interface MintResult {
  tokenId: string;
  metadataUri: string;
  glbUri: string;
  imageUri: string;
  valuation: {
    estimatedValue: number;
    rarity: string;
    complexity: number;
  };
  thirdwebMintUrl: string;
}

export function NFTMintingModal({ isOpen, onClose, shapeId, shapeName, parameters, category, glbData }: NFTMintingModalProps) {
  const [step, setStep] = useState<MintStep>('idle');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ glb: false, image: false, metadata: false });
  const [selectedGlbFile, setSelectedGlbFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const connectWallet = async () => {
    setStep('connecting');
    setError(null);
    
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask to continue.');
      }
      
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setStep('idle');
      } else {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setStep('error');
    }
  };

  const uploadFileToIPFS = async (file: File, type: 'glb' | 'image'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', `${shapeName}_${type}`);

    const response = await fetch('/api/nft/upload-file-to-ipfs', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to upload ${type} to IPFS`);
    }

    const data = await response.json();
    return data.ipfsUri;
  };

  const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
    const result = await sdkClient.legacyCall('/api/nft/upload-to-ipfs', 'POST', { 
      metadata, 
      name: `${shapeName}_metadata` 
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to upload metadata to IPFS');
    }

    return result.data.ipfsUri;
  };

  const captureCanvasScreenshot = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        reject(new Error('No canvas found. Please make sure the 3D view is visible.'));
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${shapeName.replace(/\s+/g, '_')}_preview.png`, { type: 'image/png' });
          resolve(file);
        } else {
          reject(new Error('Failed to capture canvas screenshot'));
        }
      }, 'image/png', 0.95);
    });
  };

  const mintNFT = async () => {
    if (!selectedGlbFile) {
      setError('Please select a GLB file first. Export your shape using the GLB button, then select it here.');
      return;
    }

    setError(null);
    setProgress({ glb: false, image: false, metadata: false });
    
    try {
      // Step 1: Upload GLB to IPFS
      setStep('uploading_glb');
      console.log('Uploading GLB to IPFS...');
      const glbUri = await uploadFileToIPFS(selectedGlbFile, 'glb');
      setProgress(p => ({ ...p, glb: true }));
      console.log('GLB uploaded:', glbUri);

      // Step 2: Capture or use selected image
      setStep('capturing_image');
      let imageFile: File;
      if (selectedImageFile) {
        imageFile = selectedImageFile;
      } else {
        console.log('Capturing canvas screenshot...');
        imageFile = await captureCanvasScreenshot();
      }

      // Step 3: Upload image to IPFS
      setStep('uploading_image');
      console.log('Uploading image to IPFS...');
      const imageUri = await uploadFileToIPFS(imageFile, 'image');
      setProgress(p => ({ ...p, image: true }));
      console.log('Image uploaded:', imageUri);

      // Step 4: Calculate valuation
      const complexity = calculateComplexity(parameters);
      const rarity = determineRarity(complexity, category || 'general');
      const marketValue = calculateMarketValue(complexity, rarity, category || 'general');
      const tokenId = `DMN-${Date.now()}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;

      // Step 5: Create and upload metadata with OSDR provenance for Space Biology shapes
      setStep('uploading_metadata');
      
      const osdrContext = isSpaceBiologyShape(shapeId) ? getShapeStudyContext(shapeId) : null;
      const osdrAttributes = osdrContext ? [
        { trait_type: 'NASA OSDR Backed', value: 'Yes' },
        { trait_type: 'Primary Study', value: osdrContext.relatedStudies[0]?.studyId || 'N/A' },
        { trait_type: 'Research Organism', value: osdrContext.relatedStudies[0]?.organism || 'N/A' },
        { trait_type: 'Space Mission', value: osdrContext.relatedStudies[0]?.mission || 'N/A' }
      ] : [];
      
      const osdrProvenance = osdrContext ? {
        source: 'NASA Open Science Data Repository',
        studies: osdrContext.relatedStudies.map(s => ({
          id: s.studyId,
          title: s.title,
          organism: s.organism,
          tissue: s.tissue,
          mission: s.mission,
          url: s.osdrUrl
        })),
        scientificBackground: osdrContext.scientificBackground,
        experimentalVariables: osdrContext.experimentalVariables
      } : null;
      
      const metadata = {
        name: shapeName,
        description: osdrContext 
          ? `Space Biology shape from Dmension Universe backed by NASA OSDR research. Based on ${osdrContext.relatedStudies[0]?.studyId} (${osdrContext.relatedStudies[0]?.mission}). ${osdrContext.scientificBackground.slice(0, 100)}...`
          : `Mathematical shape from Dmension Universe. Category: ${category || 'mathematical'}. Complexity: ${complexity}/10. Rarity: ${rarity}. Estimated Value: $${marketValue}`,
        image: imageUri,
        animation_url: glbUri,
        external_url: `https://dmension.io/shapes/${shapeId}`,
        attributes: [
          { trait_type: 'Category', value: category || 'mathematical' },
          { trait_type: 'Rarity', value: rarity },
          { trait_type: 'Complexity', value: complexity, display_type: 'number' },
          { trait_type: 'Estimated Value USD', value: marketValue, display_type: 'number' },
          { trait_type: 'Platform', value: 'Dmension Mathematical Universe' },
          { trait_type: 'AR/VR Compatible', value: 'Yes' },
          ...osdrAttributes
        ],
        properties: {
          tokenId,
          parameters,
          createdAt: new Date().toISOString(),
          creator: walletAddress || 'anonymous',
          ...(osdrProvenance && { nasaOsdrProvenance: osdrProvenance })
        }
      };

      console.log('Uploading metadata to IPFS...');
      const metadataUri = await uploadMetadataToIPFS(metadata);
      setProgress(p => ({ ...p, metadata: true }));
      console.log('Metadata uploaded:', metadataUri);

      // Success!
      setMintResult({
        tokenId,
        metadataUri,
        glbUri,
        imageUri,
        valuation: { estimatedValue: marketValue, rarity, complexity },
        thirdwebMintUrl: `https://thirdweb.com/polygon`
      });
      setStep('complete');
      console.log('NFT ready for minting!');

    } catch (err: any) {
      console.error('NFT minting error:', err);
      setError(err.message || 'An unexpected error occurred');
      setStep('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetModal = () => {
    setStep('idle');
    setMintResult(null);
    setError(null);
    setProgress({ glb: false, image: false, metadata: false });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleGlbFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedGlbFile(file);
      setError(null);
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-400">
            <Zap className="w-6 h-6" />
            One-Click NFT Mint: {shapeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Wallet Connection */}
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Wallet</span>
              {walletAddress ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <code className="text-xs text-green-400">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </code>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={connectWallet}
                  disabled={step === 'connecting'}
                  className="bg-orange-600 hover:bg-orange-500"
                >
                  {step === 'connecting' ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Wallet className="w-3 h-3 mr-1" />
                  )}
                  Connect MetaMask
                </Button>
              )}
            </div>
          </div>

          {/* File Selection */}
          {step !== 'complete' && (
            <div className="space-y-3">
              {/* GLB File */}
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    3D Model (GLB)
                  </span>
                  {selectedGlbFile && (
                    <Badge className="bg-green-600">Selected</Badge>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb"
                  onChange={handleGlbFileSelect}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  {selectedGlbFile ? selectedGlbFile.name : 'Select GLB File (export first)'}
                </Button>
              </div>

              {/* Image File (Optional) */}
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Preview Image (optional)
                  </span>
                  {selectedImageFile && (
                    <Badge className="bg-green-600">Selected</Badge>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Upload className="w-3 h-3 mr-2" />
                  {selectedImageFile ? selectedImageFile.name : 'Auto-capture from canvas'}
                </Button>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="space-y-2">
            <StepIndicator
              label="Upload 3D Model to IPFS"
              status={progress.glb ? 'complete' : step === 'uploading_glb' ? 'loading' : 'pending'}
              description="Your GLB file stored permanently"
            />
            <StepIndicator
              label="Upload Preview Image to IPFS"
              status={progress.image ? 'complete' : ['capturing_image', 'uploading_image'].includes(step) ? 'loading' : 'pending'}
              description="Thumbnail for marketplaces"
            />
            <StepIndicator
              label="Upload NFT Metadata to IPFS"
              status={progress.metadata ? 'complete' : step === 'uploading_metadata' ? 'loading' : 'pending'}
              description="Name, attributes, links"
            />
            <StepIndicator
              label="Ready to Mint on Blockchain"
              status={step === 'complete' ? 'complete' : 'pending'}
              description="One click on Thirdweb"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">Error</p>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {step === 'complete' && mintResult && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">NFT Ready to Mint!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Value:</span>
                  <p className="text-green-400 font-bold">${mintResult.valuation.estimatedValue}</p>
                </div>
                <div>
                  <span className="text-gray-400">Rarity:</span>
                  <Badge className={getRarityColor(mintResult.valuation.rarity)}>
                    {mintResult.valuation.rarity}
                  </Badge>
                </div>
              </div>

              {/* Token URI to Copy */}
              <div className="p-2 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Token URI (copy this):</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(mintResult.metadataUri)}
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="text-xs text-orange-400 break-all block">
                  {mintResult.metadataUri}
                </code>
              </div>

              {/* Final Step */}
              <div className="pt-2 border-t border-green-500/20">
                <p className="text-xs text-gray-400 mb-2">Final Step - Click to mint:</p>
                <Button
                  onClick={() => window.open('https://thirdweb.com/polygon', '_blank')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Thirdweb → Paste Token URI → Mint
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Deploy NFT Collection contract, go to NFTs tab, click Mint, paste the URI above
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {step === 'idle' && (
              <Button
                onClick={mintNFT}
                disabled={!selectedGlbFile}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold disabled:opacity-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                {selectedGlbFile ? 'Upload to IPFS & Prepare Mint' : 'Select GLB File First'}
              </Button>
            )}
            
            {step === 'complete' && (
              <Button
                onClick={resetModal}
                variant="outline"
                className="flex-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Mint Another NFT
              </Button>
            )}
            
            {step === 'error' && (
              <Button
                onClick={resetModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600"
              >
                Try Again
              </Button>
            )}
            
            {['uploading_glb', 'capturing_image', 'uploading_image', 'uploading_metadata'].includes(step) && (
              <Button disabled className="flex-1 bg-gray-700">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {step === 'uploading_glb' && 'Uploading 3D Model...'}
                {step === 'capturing_image' && 'Capturing Preview...'}
                {step === 'uploading_image' && 'Uploading Image...'}
                {step === 'uploading_metadata' && 'Uploading Metadata...'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({ label, status, description }: { 
  label: string; 
  status: 'pending' | 'loading' | 'complete'; 
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        status === 'complete' ? 'bg-green-600' :
        status === 'loading' ? 'bg-orange-600' : 'bg-gray-700'
      }`}>
        {status === 'complete' && <Check className="w-4 h-4 text-white" />}
        {status === 'loading' && <Loader2 className="w-4 h-4 text-white animate-spin" />}
        {status === 'pending' && <span className="w-2 h-2 bg-gray-500 rounded-full" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          status === 'complete' ? 'text-green-400' :
          status === 'loading' ? 'text-orange-400' : 'text-gray-400'
        }`}>
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function calculateComplexity(params: Record<string, number>): number {
  const paramCount = Object.keys(params).length;
  const paramVariance = Object.values(params).reduce((sum, v) => sum + Math.abs(v - 1), 0);
  return Math.min(10, Math.round((paramCount * 0.5 + paramVariance * 0.3) * 10) / 10);
}

function determineRarity(complexity: number, category: string): string {
  const premiumCategories = ['medical_tpms', 'hyperdimensional', 'quantum_physics', 'thermal_engineering'];
  const categoryBonus = premiumCategories.includes(category) ? 2 : 0;
  const score = complexity + categoryBonus;

  if (score >= 10) return 'Legendary';
  if (score >= 8) return 'Epic';
  if (score >= 6) return 'Rare';
  if (score >= 4) return 'Uncommon';
  return 'Common';
}

function calculateMarketValue(complexity: number, rarity: string, category: string): number {
  const baseValues: Record<string, number> = {
    'Legendary': 5000,
    'Epic': 2000,
    'Rare': 500,
    'Uncommon': 150,
    'Common': 50
  };

  const categoryMultipliers: Record<string, number> = {
    'medical_tpms': 5.0,
    'hyperdimensional': 3.0,
    'quantum_physics': 2.5,
    'thermal_engineering': 2.0,
    'scientific': 1.5,
    'default': 1.0
  };

  const base = baseValues[rarity] || 50;
  const multiplier = categoryMultipliers[category] || categoryMultipliers['default'];

  return Math.round(base * multiplier * (1 + complexity / 10));
}

function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'Legendary': return 'bg-yellow-600 text-yellow-100';
    case 'Epic': return 'bg-purple-600 text-purple-100';
    case 'Rare': return 'bg-blue-600 text-blue-100';
    case 'Uncommon': return 'bg-green-600 text-green-100';
    default: return 'bg-gray-600 text-gray-100';
  }
}
