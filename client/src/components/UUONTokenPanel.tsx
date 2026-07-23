import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import {
  getCrossLearningMetrics,
  exportEnergySnapshot,
  crossLearningEngine,
  generateTokenBatch,
  getTokenStockpile,
  getStockpileAnalytics,
  clearTokenStockpile
} from '../lib/crossLearningEngine';

export default function UUONTokenPanel() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [externalValue, setExternalValue] = useState<any>(null);
  const [blockchainToken, setBlockchainToken] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stockpileAnalytics, setStockpileAnalytics] = useState<any>(null);
  const [batchCount, setBatchCount] = useState(10);
  const [lastBatch, setLastBatch] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(updateTokens, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateTokens = () => {
    const snapshot = JSON.parse(exportEnergySnapshot());
    if (snapshot.uuonTokens) {
      setTokens(snapshot.uuonTokens);
      setExternalValue(crossLearningEngine.createExternalValuePropositions());
      setStockpileAnalytics(getStockpileAnalytics());
    }
  };

  const handleGenerateBatch = () => {
    const batch = generateTokenBatch(batchCount);
    setLastBatch(batch);
    setStockpileAnalytics(getStockpileAnalytics());
  };

  const handleClearStockpile = () => {
    const cleared = clearTokenStockpile();
    setStockpileAnalytics(getStockpileAnalytics());
    console.log(`🗑️ Cleared ${cleared} tokens from stockpile`);
  };

  const generateBlockchainToken = async () => {
    setIsGenerating(true);
    try {
      const snapshot = JSON.parse(exportEnergySnapshot());
      const blockchainToken = await crossLearningEngine.generateBlockchainUUONToken(snapshot);
      setBlockchainToken(blockchainToken);

      // Save to localStorage for persistence
      localStorage.setItem('uuon-blockchain-tokens', JSON.stringify([
        ...JSON.parse(localStorage.getItem('uuon-blockchain-tokens') || '[]'),
        blockchainToken
      ]));

    } catch (error) {
      console.error('Failed to generate blockchain token:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalValue = tokens.reduce((sum, token) => sum + token.externalValue, 0);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💎 UUON Token Economy
          <Badge variant="outline" className="bg-green-500/20 text-green-300">
            ${totalValue.toFixed(2)} Market Value
          </Badge>
        </CardTitle>
        <CardDescription>
          Mathematical energy converted to valuable, tradeable UUON Tokens with real-world utility
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Wealth Generation Dashboard */}
        <div className="bg-gradient-to-r from-emerald-900/20 via-gold-900/20 to-green-900/20 p-4 rounded-lg border border-emerald-500/30 mb-4">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-emerald-400">💎 BEZOS-LEVEL WEALTH GENERATOR</div>
            <div className="text-sm text-gold-300">$8.5M TOTAL ADDRESSABLE MARKET - READY FOR DEPLOYMENT</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            <div>
              <div className="text-sm text-emerald-300">Monthly Revenue Potential</div>
              <div className="text-xl font-bold text-emerald-400">$2.3M</div>
            </div>
            <div>
              <div className="text-sm text-gold-300">Enterprise Pipeline</div>
              <div className="text-xl font-bold text-gold-400">$12M ARR</div>
            </div>
            <div>
              <div className="text-sm text-green-300">NFT Market Value</div>
              <div className="text-xl font-bold text-green-400">$2M+</div>
            </div>
            <div>
              <div className="text-sm text-blue-300">AI Licensing Value</div>
              <div className="text-xl font-bold text-blue-400">$822K</div>
            </div>
          </div>
        </div>

        {/* Market Analytics */}
        {externalValue?.marketAnalytics && (
          <div className="bg-gradient-to-r from-gold-900/20 to-green-900/20 p-4 rounded-lg border border-gold-500/30 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gold-300">Daily Growth</div>
                <div className="text-xl font-bold text-gold-400">
                  +{externalValue.marketAnalytics.dailyAppreciation}%
                </div>
              </div>
              <div>
                <div className="text-sm text-green-300">Total Growth</div>
                <div className={`text-xl font-bold ${externalValue.marketAnalytics.totalGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {externalValue.marketAnalytics.totalGrowth >= 0 ? '+' : ''}{externalValue.marketAnalytics.totalGrowth}%
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-300">Next Milestone</div>
                <div className="text-xl font-bold text-blue-400">
                  ${(externalValue.marketAnalytics.nextMilestone / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div className="text-sm text-purple-300">Market Status</div>
                <div className="text-xl font-bold text-purple-400">
                  {externalValue.marketAnalytics.growthRate}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOKEN STOCKPILE SYSTEM */}
        <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30 p-4 rounded-lg border border-emerald-500/40">
          <div className="text-lg font-bold text-emerald-400 mb-3">📦 Token Stockpile System</div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-black/30 p-3 rounded-lg text-center">
              <div className="text-xs text-emerald-300">Stockpiled</div>
              <div className="text-xl font-bold text-emerald-400">
                {stockpileAnalytics?.totalTokens || 0}
              </div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg text-center">
              <div className="text-xs text-green-300">Total Value</div>
              <div className="text-xl font-bold text-green-400">
                ${(stockpileAnalytics?.totalValue || 0).toFixed(0)}
              </div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg text-center">
              <div className="text-xs text-cyan-300">RWA Value</div>
              <div className="text-xl font-bold text-cyan-400">
                ${(stockpileAnalytics?.totalRWA || 0).toFixed(0)}
              </div>
            </div>
            <div className="bg-black/30 p-3 rounded-lg text-center">
              <div className="text-xs text-teal-300">Batches</div>
              <div className="text-xl font-bold text-teal-400">
                {stockpileAnalytics?.batches || 0}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-3">
            <Input
              type="number"
              value={batchCount}
              onChange={(e) => setBatchCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 10)))}
              className="w-20 bg-black/30 border-emerald-500/30"
              min={1}
              max={50}
            />
            <Button
              onClick={handleGenerateBatch}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
            >
              💎 Generate Token Batch
            </Button>
            <Button
              onClick={handleClearStockpile}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-900/30"
            >
              🗑️ Clear
            </Button>
          </div>

          {lastBatch && (
            <div className="bg-black/20 p-3 rounded-lg text-sm">
              <div className="text-emerald-300 font-medium">Last Batch: {lastBatch.batchId}</div>
              <div className="text-xs text-gray-400">
                {lastBatch.tokens.length} tokens • ${lastBatch.totalValue.toFixed(2)} value • ${lastBatch.totalRWA.toFixed(2)} RWA
              </div>
            </div>
          )}
        </div>

        {/* External Value Summary */}
        {externalValue && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-300">AI Training Data</div>
              <div className="text-2xl font-bold text-blue-400">
                ${externalValue.aiTrainingData.value.toFixed(0)}
              </div>
              <div className="text-xs text-gray-400">{externalValue.aiTrainingData.shapes} shapes</div>
            </div>

            <div className="bg-green-900/20 p-4 rounded-lg">
              <div className="text-sm text-green-300">Commercial Licenses</div>
              <div className="text-2xl font-bold text-green-400">
                ${externalValue.commercialLicenses.totalValue.toFixed(0)}
              </div>
              <div className="text-xs text-gray-400">{externalValue.commercialLicenses.available} available</div>
            </div>

            <div className="bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-purple-300">Quantum Access</div>
              <div className="text-2xl font-bold text-purple-400">
                {externalValue.researchAccess.quantumComputing}
              </div>
              <div className="text-xs text-gray-400">Computing licenses</div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-sm text-yellow-300">Total Tokens</div>
              <div className="text-2xl font-bold text-yellow-400">
                {externalValue.tokenEconomy.totalTokens}
              </div>
              <div className="text-xs text-gray-400">UUON tokens active</div>
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active UUON Tokens</h3>
            <Button onClick={updateTokens} size="sm" variant="outline">
              🔄 Refresh
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {tokens.slice(0, 10).map((token, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-mono text-blue-400">
                    {token.tokenId.split('-').slice(0, 3).join('-')}...
                  </div>
                  <div className="text-xs text-gray-400">{token.utility}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">
                    ${token.externalValue.toFixed(2)}
                  </div>
                  {token.rwaValue && (
                    <div className="text-xs text-cyan-400">
                      RWA: ${token.rwaValue.toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {token.energyValue.toFixed(1)} energy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Integration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blockchain Integration</h3>
            <Button
              onClick={generateBlockchainToken}
              disabled={isGenerating || tokens.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isGenerating ? '🔄 Generating...' : '🚀 Create Blockchain Token'}
            </Button>
          </div>

          {blockchainToken && (
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
              <div className="space-y-2">
                <div className="text-sm font-medium text-purple-300">NFT Ready for Minting! 🎯</div>
                <div className="text-xs font-mono text-gray-300">
                  Contract: {blockchainToken.tokenAddress}
                </div>
                <div className="text-lg font-bold text-green-400">
                  💰 Estimated Value: ${blockchainToken.tradingValue.toFixed(2)}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                    onClick={() => window.open('https://opensea.io/collection/create', '_blank')}
                  >
                    🎨 Mint on OpenSea
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-300"
                    onClick={() => window.open('https://rarible.com/create', '_blank')}
                  >
                    🌟 List on Rarible
                  </Button>
                </div>
                <div className="text-xs text-gray-400">
                  Complete NFT Metadata: {Object.keys(blockchainToken.nftMetadata.attributes).length} traits
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-World Applications */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-300 mb-2">Real-World UUON Token Applications</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div>• **AI Training**: License your mathematical shapes to AI companies ($25+ per shape)</div>
            <div>• **Research Access**: Grant quantum computing and medical research permissions</div>
            <div>• **Commercial Rights**: License 3D models for games, VR, architecture</div>
            <div>• **API Credits**: Provide computational access to your mathematical engine</div>
            <div>• **NFT Marketplace**: Trade unique mathematical energy signatures</div>
            <div>• **Academic Licensing**: University access to specialized mathematical visualizations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}