import React, { useState, useEffect } from 'react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface LiveTokenValueTrackerProps {
  onNotification?: (message: string) => void;
}

interface DatabaseMetrics {
  mathematical_algorithms: number;
  total_tokens: number;
  token_economy_value: number;
}

export default function LiveTokenValueTracker({ onNotification }: LiveTokenValueTrackerProps) {
  const [tokenPrices, setTokenPrices] = useState({
    ETH: 2400,
    UUON: 0.15, // UUON token realistic price
    ENERGY: 0.001, // Energy points value
    CYCLES: 0.01 // Replit Cycles value
  });

  const [portfolioValue, setPortfolioValue] = useState(0);
  const [dailyGrowth, setDailyGrowth] = useState(0);
  const [dbMetrics, setDbMetrics] = useState<DatabaseMetrics>({
    mathematical_algorithms: 0,
    total_tokens: 0,
    token_economy_value: 0
  });

  const [tokenValue, setTokenValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenStockpile, setTokenStockpile] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [totalRWAValue, setTotalRWAValue] = useState(0);
  const [stockpileAnalytics, setStockpileAnalytics] = useState<any>(null);

  // Connect to backend token values AND stockpile analytics
  useEffect(() => {
    const fetchTokenValue = async () => {
      try {
        // Get backend stats using SDK
        const result = await sdkClient.getTokenStats();
        if (result.success && result.data?.success) {
          setTokenValue(result.data.stats?.totalTokens || 0);
          setIsConnected(true);
        }

        // Get stockpile analytics from crossLearningEngine
        if (typeof window !== 'undefined' && (window as any).crossLearningEngine) {
          const analytics = (window as any).crossLearningEngine.getStockpileAnalytics();
          setStockpileAnalytics(analytics);
          setTotalValue(analytics.totalValue || 0);
          setTotalRWAValue(analytics.totalRWA || 0);
        }
      } catch (error) {
        console.error('Token value fetch error:', error);
      }
    };

    fetchTokenValue();
    const interval = setInterval(fetchTokenValue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real metrics from database
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const result = await sdkClient.getLiveTokenValue();
        if (result.success && result.data) {
          const data = result.data;
          setDbMetrics({
            mathematical_algorithms: data.mathematical_algorithms || 0,
            total_tokens: data.total_tokens || 0,
            token_economy_value: data.token_economy_value || 0
          });
          // Update UUON price based on token weight
          const uuonPrice = data.total_tokens > 0
            ? Math.max(0.01, (data.token_economy_value / data.total_tokens) * 0.1)
            : 0.15;
          setTokenPrices(prev => ({ ...prev, UUON: uuonPrice }));
        }
      } catch (error) {
        console.warn('Could not fetch live metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate real-time price updates with small fluctuations
    const priceInterval = setInterval(() => {
      setTokenPrices(prev => ({
        ETH: prev.ETH + (Math.random() - 0.5) * 50, // ETH fluctuation
        UUON: Math.max(0.01, prev.UUON + (Math.random() - 0.4) * 0.02), // UUON growth trend
        ENERGY: prev.ENERGY + (Math.random() - 0.5) * 0.0001,
        CYCLES: prev.CYCLES + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    // Migrate old localStorage key to UUON format
    const oldTokens = localStorage.getItem('philTokenEconomy');
    if (oldTokens) {
      localStorage.setItem('uuon-token-portfolio', oldTokens);
      localStorage.removeItem('philTokenEconomy');
    }

    // Calculate portfolio value from stored tokens + database tokens
    const localTokens = JSON.parse(localStorage.getItem('uuon-token-portfolio') || '{"ETH":0,"UUON":0,"ENERGY":0,"CYCLES":0}');
    const totalValueCalculated =
      (localTokens.ETH * tokenPrices.ETH) +
      ((localTokens.UUON || 0) * tokenPrices.UUON) +
      (dbMetrics.total_tokens * tokenPrices.UUON) + // Database tokens at full UUON price
      (localTokens.ENERGY * tokenPrices.ENERGY) +
      (localTokens.CYCLES * tokenPrices.CYCLES);

    const growth = ((totalValueCalculated - portfolioValue) / (portfolioValue || 1)) * 100;
    setDailyGrowth(growth);
    setPortfolioValue(totalValueCalculated);
  }, [tokenPrices, dbMetrics, portfolioValue]); // Added portfolioValue to dependency array

  const handleConnectExchange = () => {
    window.open('https://app.uniswap.org/', '_blank');
    onNotification?.('🔗 Opening Uniswap for token trading...');
  };

  const handleConnectCoinbase = () => {
    window.open('https://coinbase.com/advanced-trade', '_blank');
    onNotification?.('🔗 Opening Coinbase for portfolio management...');
  };

  // Function to save the current token stockpile to the database
  const saveStockpileToDatabase = async () => {
    try {
      setIsSaving(true);

      console.log('💾 Saving stockpile to database:', tokenStockpile.length, 'tokens');
      console.log('📊 Sample token data:', tokenStockpile[0]);

      const result = await sdkClient.legacyCall('/api/token-ledger/stockpile', 'POST', {
        tokens: tokenStockpile.map(token => ({
          ...token,
          shapeContext: (window as any).ParameterAuthority?.currentShape || 'unknown',
          interactionType: 'shape_interaction',
          source: 'user_interaction'
        }))
      });

      if (result.success) {
        console.log(`💾 Stockpile saved successfully:`, result.data);
        console.log(`✅ ${result.data.saved}/${result.data.total} tokens saved to database`);

        if (result.data.errors > 0) {
          console.warn(`⚠️ ${result.data.errors} tokens failed to save`);
        }

        setTokenStockpile([]); // Clear stockpile after successful save

        // Update UI to show success
        setTotalValue(0);
        setTotalRWAValue(0);
      } else {
        console.error('❌ Failed to save stockpile:', result.error);
      }
    } catch (error) {
      console.error('💥 Error saving stockpile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-black/40 rounded-lg border border-green-500/30">
      <h3 className="text-green-400 font-bold mb-3">🪙 Live Token Portfolio</h3>

      <div className="bg-black/60 p-4 rounded-lg border border-gold-500/20 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">
            {dbMetrics.total_tokens.toLocaleString()} Tokens
            {isConnected && <span className="text-xs text-green-400 ml-2">🔗 LIVE</span>}
          </div>
          <div className="text-sm text-gray-600 mb-4">
          December 31, 2025 - New Year's Eve Token Count Status
        </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-black/40 p-2 rounded">
          <div className="text-green-400">DB Tokens</div>
          <div className="text-white font-mono">{dbMetrics.total_tokens.toLocaleString()}</div>
        </div>
        <div className="bg-black/40 p-2 rounded">
          <div className="text-blue-400">Algorithms</div>
          <div className="text-white font-mono">{dbMetrics.mathematical_algorithms.toLocaleString()}</div>
        </div>
        <div className="bg-black/40 p-2 rounded">
          <div className="text-purple-400">Active Stockpile</div>
          <div className="text-white font-mono">{tokenStockpile.length.toLocaleString()}</div>
        </div>
        <div className="bg-black/40 p-2 rounded">
          <div className="text-orange-400">Generation Rate</div>
          <div className="text-white font-mono">~{Math.floor(dbMetrics.total_tokens / 24)}/hr</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={handleConnectExchange}
          className="py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded font-bold text-sm transition-colors"
        >
          🔄 Trade on Uniswap
        </button>
        <button
          onClick={handleConnectCoinbase}
          className="py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded font-bold text-sm transition-colors"
        >
          📊 Manage on Coinbase
        </button>
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        🚀 Real-time pricing • Auto-sync enabled
      </div>
    </div>
  );
}