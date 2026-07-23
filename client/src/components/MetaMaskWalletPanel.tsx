import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { sdkClient } from '../lib/unifiedSDKClient';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
  network: string | null;
  error: string | null;
}

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  collection: string;
  value: number;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const MetaMaskWalletPanel: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: null,
    network: null,
    error: null
  });
  
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setWallet(prev => ({ ...prev, error: 'MetaMask is not installed. Please install MetaMask extension.' }));
      return;
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        // Convert balance from wei to ETH
        const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
        
        // Get network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkName = getNetworkName(chainId);

        setWallet({
          connected: true,
          address,
          balance: ethBalance,
          network: networkName,
          error: null
        });

        // Load user's NFTs
        await loadUserNFTs(address);
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to connect to MetaMask' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      balance: null,
      network: null,
      error: null
    });
    setNfts([]);
  };

  // Get network name from chain ID
  const getNetworkName = (chainId: string): string => {
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon',
      '0x2105': 'Base',
      '0xa4b1': 'Arbitrum One',
      '0xa': 'Optimism',
      '0x5': 'Goerli Testnet',
      '0x13881': 'Polygon Mumbai'
    };
    return networks[chainId] || 'Unknown Network';
  };

  // Load user's NFTs from our platform
  const loadUserNFTs = async (address: string) => {
    try {
      const result = await sdkClient.legacyCall(`/api/nft-minting/user-nfts/${address}`, 'GET');
      if (result.success) {
        setNfts(result.data?.nfts || []);
      }
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    }
  };

  // Mint NFT to connected wallet
  const mintNFTToWallet = async (shapeData: any) => {
    if (!wallet.connected || !wallet.address) return;

    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/nft-minting/mint', 'POST', {
        ...shapeData,
        creatorWallet: wallet.address,
        targetNetwork: wallet.network
      });

      if (result.success) {
        console.log('NFT minted successfully:', result.data);
        await loadUserNFTs(wallet.address);
      }
    } catch (error) {
      console.error('NFT minting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (wallet.connected && accounts[0] !== wallet.address) {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        if (wallet.connected) {
          connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [wallet.connected, wallet.address]);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      {/* Floating Connect Button */}
      {!isExpanded ? (
        <Button 
          onClick={() => wallet.connected ? setIsExpanded(true) : connectWallet()}
          disabled={isLoading}
          className={`${wallet.connected ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-600 hover:bg-orange-500'} shadow-lg text-white font-bold px-4 py-2`}
        >
          {isLoading ? '🔄...' : wallet.connected ? `🦊 ${wallet.address?.substring(0, 6)}...` : '🦊 Connect Wallet'}
        </Button>
      ) : (
        <Card className="bg-slate-900/95 border-purple-500/50 w-80 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-purple-300 text-sm">
              <span className="flex items-center gap-2">
                🦊 MetaMask Wallet
                {wallet.connected && <Badge className="bg-green-600 text-xs">Connected</Badge>}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            
            {/* Connection Status */}
            {!isMetaMaskInstalled() ? (
              <Alert>
                <AlertDescription className="text-xs">
                  MetaMask is not installed. 
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 underline ml-2"
                  >
                    Install MetaMask
                  </a>
                </AlertDescription>
              </Alert>
            ) : !wallet.connected ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-300">
                  Connect your wallet to mint and manage mathematical shape NFTs
                </p>
                <Button 
                  onClick={connectWallet} 
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-sm"
                >
                  {isLoading ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Wallet Info */}
                <div className="bg-slate-800 p-2 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Address:</span>
                    <code className="text-xs font-mono text-blue-400">
                      {wallet.address?.substring(0, 6)}...{wallet.address?.slice(-4)}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Balance:</span>
                    <span className="text-xs text-green-400">{wallet.balance} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Network:</span>
                    <span className="text-xs text-yellow-400">{wallet.network}</span>
                  </div>
                </div>

                {/* NFT Collection */}
                {nfts.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-purple-300">Your Mathematical NFTs ({nfts.length})</h4>
                    <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
                      {nfts.map((nft) => (
                        <div key={nft.tokenId} className="bg-slate-800 p-1.5 rounded text-xs">
                          <div className="font-medium text-white truncate text-[10px]">{nft.name}</div>
                          <div className="text-gray-400 text-[10px]">${nft.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.open('https://opensea.io', '_blank')}
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    🎨 OpenSea
                  </Button>
                  <Button 
                    onClick={disconnectWallet}
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs"
                  >
                    🔌 Disconnect
                  </Button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {wallet.error && (
              <Alert>
                <AlertDescription className="text-red-400 text-xs">
                  {wallet.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const useMetaMaskWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    balance: null,
    network: null,
    error: null
  });

  return { wallet: walletState, setWallet: setWalletState };
};
