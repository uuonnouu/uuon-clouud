/**
 * UUON FOUNDATION VERIFICATION PAGE
 * 
 * Allows users to verify authenticity of exported models by:
 * 1. Pasting a SHA-256 hash to verify
 * 2. Viewing the public registry of all registered shapes
 * 3. Downloading verification certificates
 * 
 * © 2025 UUON Foundation Inc.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  verificationRegistry, 
  VerificationResult, 
  ShapeRegistryEntry,
  generateVerificationBadge 
} from '@/lib/verificationRegistry';
import { generateStandaloneVerificationImage } from '@/lib/qrCodeGenerator';
import { Shield, Search, CheckCircle, XCircle, AlertCircle, Download, Copy, ExternalLink, Lock, FileKey } from 'lucide-react';
import { sdkClient } from '@/lib/unifiedSDKClient';

interface VerificationPageProps {
  onClose?: () => void;
  initialHash?: string;
}

export function VerificationPage({ onClose, initialHash }: VerificationPageProps) {
  const [hashInput, setHashInput] = useState(initialHash || '');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [registry, setRegistry] = useState<ShapeRegistryEntry[]>([]);
  const [registryStats, setRegistryStats] = useState<{
    totalShapes: number;
    categories: string[];
    registryVersion: string;
    lastUpdated: string;
  } | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [exportSignature, setExportSignature] = useState('');
  const [exportVerificationResult, setExportVerificationResult] = useState<{
    verified: boolean;
    securityLevel?: string;
    creatorId?: string;
    exportedAt?: string;
    encrypted?: boolean;
    message: string;
  } | null>(null);
  const [isVerifyingExport, setIsVerifyingExport] = useState(false);

  const handleVerifyExport = async () => {
    if (!exportSignature.trim()) return;
    setIsVerifyingExport(true);
    try {
      const result = await sdkClient.verifyContent({ signature: exportSignature.trim() });
      if (result.success) {
        setExportVerificationResult(result.data);
      } else {
        setExportVerificationResult({
          verified: false,
          message: '❌ Error verifying export. Please check your signature.'
        });
      }
    } catch (error) {
      setExportVerificationResult({
        verified: false,
        message: '❌ Error verifying export. Please check your signature.'
      });
    }
    setIsVerifyingExport(false);
  };

  useEffect(() => {
    verificationRegistry.initialize().then(() => {
      setRegistry(verificationRegistry.getPublicRegistry());
      setRegistryStats(verificationRegistry.getRegistryStats());
    });
  }, []);

  useEffect(() => {
    if (initialHash) {
      handleVerify();
    }
  }, [initialHash]);

  const handleVerify = async () => {
    if (!hashInput.trim()) return;
    
    setIsVerifying(true);
    try {
      const result = await verificationRegistry.verifyHash(hashInput.trim());
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        verified: false,
        message: '❌ Error during verification. Please try again.',
        confidence: 'not_found'
      });
    }
    setIsVerifying(false);
  };

  const handleCopyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownloadCertificate = (entry: ShapeRegistryEntry) => {
    const imageDataUrl = generateStandaloneVerificationImage(
      entry.shapeId,
      entry.shapeName,
      entry.geometryHash,
      entry.category
    );
    
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `UUON_Certificate_${entry.shapeId}.png`;
    link.click();
  };

  const getResultIcon = () => {
    if (!verificationResult) return null;
    
    switch (verificationResult.confidence) {
      case 'exact':
      case 'formula_match':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />;
      default:
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getResultColor = () => {
    if (!verificationResult) return 'border-gray-600';
    
    switch (verificationResult.confidence) {
      case 'exact':
      case 'formula_match':
        return 'border-green-500 bg-green-500/10';
      case 'partial':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-red-500 bg-red-500/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 overflow-hidden">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <CardTitle className="text-white text-xl">UUON Foundation Verification</CardTitle>
                <CardDescription className="text-gray-400">
                  Verify authenticity of mathematical models
                </CardDescription>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                ✕
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="verify" className="w-full">
            <TabsList className="w-full bg-gray-800 rounded-none border-b border-gray-700">
              <TabsTrigger value="verify" className="flex-1 data-[state=active]:bg-gray-700">
                <Search className="w-4 h-4 mr-2" />
                Verify Hash
              </TabsTrigger>
              <TabsTrigger value="exports" className="flex-1 data-[state=active]:bg-gray-700">
                <FileKey className="w-4 h-4 mr-2" />
                Verify Export
              </TabsTrigger>
              <TabsTrigger value="registry" className="flex-1 data-[state=active]:bg-gray-700">
                <Shield className="w-4 h-4 mr-2" />
                Public Registry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Enter SHA-256 Hash or Short Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={hashInput}
                      onChange={(e) => setHashInput(e.target.value)}
                      placeholder="Paste hash here (e.g., a3b7c9f2e8d4...)"
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    />
                    <Button 
                      onClick={handleVerify} 
                      disabled={isVerifying || !hashInput.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>

                {verificationResult && (
                  <Card className={`border-2 ${getResultColor()}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          {getResultIcon()}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <Badge 
                              variant={verificationResult.verified ? "default" : "destructive"}
                              className="mb-2"
                            >
                              {generateVerificationBadge(verificationResult.verified, verificationResult.confidence)}
                            </Badge>
                            <p className="text-white text-lg font-medium">
                              {verificationResult.message}
                            </p>
                          </div>

                          {verificationResult.verified && verificationResult.shapeId && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Shape:</span>
                                <p className="text-white font-medium">{verificationResult.shapeName}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Category:</span>
                                <p className="text-white">{verificationResult.category}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Author:</span>
                                <p className="text-white">{verificationResult.author}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Organization:</span>
                                <p className="text-white">{verificationResult.organization}</p>
                              </div>
                              {verificationResult.registrationDate && (
                                <div className="col-span-2">
                                  <span className="text-gray-400">Registration Date:</span>
                                  <p className="text-white">
                                    {new Date(verificationResult.registrationDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400">
                  <h4 className="text-white font-medium mb-2">How to find your model's hash:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open the exported GLB/GLTF file in a 3D viewer</li>
                    <li>Look in the model's metadata/extras section</li>
                    <li>Find the "geometryHash" or "verificationHash" field</li>
                    <li>Copy and paste that value above</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exports" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Enter Export Signature (DMENSION-SIG-...)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={exportSignature}
                      onChange={(e) => setExportSignature(e.target.value)}
                      placeholder="Paste signature (e.g., DMENSION-SIG-a3b7c9f2...)"
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyExport()}
                    />
                    <Button 
                      onClick={handleVerifyExport} 
                      disabled={isVerifyingExport || !exportSignature.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isVerifyingExport ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>

                {exportVerificationResult && (
                  <Card className={`border-2 ${exportVerificationResult.verified ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          {exportVerificationResult.verified ? (
                            <CheckCircle className="w-16 h-16 text-green-500" />
                          ) : (
                            <XCircle className="w-16 h-16 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <p className="text-white text-lg font-medium">
                            {exportVerificationResult.message}
                          </p>
                          {exportVerificationResult.verified && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Security Level:</span>
                                <p className="text-white font-medium flex items-center gap-2">
                                  {exportVerificationResult.securityLevel === 'encrypted' && <Lock className="w-4 h-4 text-red-400" />}
                                  {exportVerificationResult.securityLevel}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Creator:</span>
                                <p className="text-white">{exportVerificationResult.creatorId}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Exported:</span>
                                <p className="text-white">{exportVerificationResult.exportedAt}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Encrypted:</span>
                                <p className="text-white">{exportVerificationResult.encrypted ? '🔐 Yes' : '🔓 No'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400">
                  <h4 className="text-white font-medium mb-2">How to find your export signature:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open the .dmension-secure file in a text editor</li>
                    <li>Find the "signature" field in the JSON</li>
                    <li>Copy the DMENSION-SIG-... value</li>
                    <li>Paste it above to verify authenticity</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="registry" className="p-0">
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Public Shape Registry</h3>
                    <p className="text-sm text-gray-400">
                      {registryStats?.totalShapes || 0} verified shapes across {registryStats?.categories.length || 0} categories
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    v{registryStats?.registryVersion || '1.0.0'}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                {registry.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Registry is loading or empty.</p>
                    <p className="text-sm mt-2">Shapes are registered when they are exported.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {registry.map((entry, index) => (
                      <div key={index} className="p-4 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">{entry.shapeName}</span>
                              <Badge variant="secondary" className="text-xs">
                                {entry.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 font-mono">
                              ID: {entry.shapeId}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                              Hash: {entry.geometryHash}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyHash(entry.geometryHash)}
                              className="text-gray-400 hover:text-white"
                            >
                              {copiedHash === entry.geometryHash ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadCertificate(entry)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>© 2025 UUON Foundation Inc.</span>
                  <a 
                    href="https://uuonfoundation.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-green-500 transition-colors"
                  >
                    uuonfoundation.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export function VerificationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2 border-green-600 text-green-500 hover:bg-green-600/20"
    >
      <Shield className="w-4 h-4" />
      Verify Model
    </Button>
  );
}
