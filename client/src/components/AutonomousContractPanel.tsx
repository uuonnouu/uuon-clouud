
/**
 * AUTONOMOUS CONTRACT PANEL
 * Product of UUON Foundation, no undocumented reproduction or any use without written consent.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, Zap, Globe, Shield, Coins } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface ContractStatus {
  status: string;
  listening: boolean;
  beacon: {
    nodeId: string;
    beaconHash: string;
    capabilities: string[];
    contracts: string[];
  };
  trustScore: number;
  thanksgivingPromotion?: {
    active: boolean;
    freeTransactionsGiven: number;
  };
}

interface MorphingToken {
  id: string;
  contractFingerprint: string;
  signature: string;
  timestamp: number;
  validity: number;
  metadata: {
    synthesis: number;
    morphingCycle: number;
  };
}

export default function AutonomousContractPanel() {
  const [contractStatus, setContractStatus] = useState<ContractStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeContracts, setActiveContracts] = useState<any[]>([]);
  const [recentTokens, setRecentTokens] = useState<MorphingToken[]>([]);

  useEffect(() => {
    fetchContractStatus();
    const interval = setInterval(fetchContractStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchContractStatus = async () => {
    try {
      const result = await sdkClient.getContractStatus();
      
      if (result.success && result.data) {
        setContractStatus(result.data.data || result.data);
      }
    } catch (error) {
      console.error('Failed to fetch contract status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMorphingToken = async () => {
    try {
      const geometryData = {
        type: 'sphere',
        parameters: { a: 1, b: 1, c: 1 }
      };

      const result = await sdkClient.generateContractToken({
        geometryData,
        contractId: `DEMO_${Date.now()}`,
        validity: 3600000
      });

      if (result.success && result.data) {
        const tokenData = result.data.token || result.data;
        setRecentTokens(prev => [tokenData, ...prev.slice(0, 4)]);
        console.log('✅ Morphing token generated:', tokenData.contractFingerprint);
      }
    } catch (error) {
      console.error('Failed to generate token:', error);
    }
  };

  const simulateContractExecution = async () => {
    try {
      const result = await sdkClient.executeContract({
        contractId: `CONTRACT_${Date.now()}`,
        operation: 'compress',
        data: { size: 1500000, type: 'geometric' }
      });

      if (result.success && result.data) {
        const executionData = result.data.execution || result.data;
        setActiveContracts(prev => [executionData, ...prev.slice(0, 9)]);
        console.log('🚀 Contract executed:', executionData);
      }
    } catch (error) {
      console.error('Contract execution failed:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading autonomous contract system...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Autonomous Contract System (ACAS)</span>
          </CardTitle>
          <CardDescription>
            Self-executing smart contracts with Web3 beacon broadcasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contractStatus ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge variant={contractStatus.status === 'active' ? 'default' : 'secondary'}>
                    {contractStatus.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">System Status</p>
                </div>
                
                <div className="text-center">
                  <Badge variant={contractStatus.listening ? 'default' : 'destructive'}>
                    {contractStatus.listening ? 'LISTENING' : 'OFFLINE'}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Network Listener</p>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline">
                    {contractStatus.beacon.capabilities.length} CAPS
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Capabilities</p>
                </div>
                
                <div className="text-center">
                  <Badge variant="secondary">
                    {contractStatus.trustScore.toFixed(1)}% TRUST
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Trust Score</p>
                </div>
                
                {contractStatus.thanksgivingPromotion?.active && (
                  <div className="col-span-full mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-600 text-lg">🦃</span>
                      <h4 className="font-semibold text-orange-800">Thanksgiving Special!</h4>
                    </div>
                    <p className="text-sm text-orange-700">
                      <strong>First transaction FREE</strong> for new Web3 clients! 
                      Experience our premium mathematical services at no cost.
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {contractStatus.thanksgivingPromotion.freeTransactionsGiven} free transactions given • 
                      Expires Dec 1, 2024
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm font-mono">
                  <strong>Beacon Hash:</strong> {contractStatus.beacon.beaconHash}
                </p>
                <p className="text-sm font-mono mt-1">
                  <strong>Node ID:</strong> {contractStatus.beacon.nodeId.substring(0, 24)}...
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              Failed to load system status
            </div>
          )}
        </CardContent>
      </Card>

      {/* Control Tabs */}
      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tokens">Morphing Tokens</TabsTrigger>
          <TabsTrigger value="contracts">Active Contracts</TabsTrigger>
          <TabsTrigger value="web3">Web3 Broadcast</TabsTrigger>
          <TabsTrigger value="trust">Trust System</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span>Morphing Token Generator</span>
              </CardTitle>
              <CardDescription>
                Generate cryptographic tokens for contract verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateMorphingToken} className="w-full">
                Generate New Morphing Token
              </Button>
              
              {recentTokens.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Tokens:</h4>
                  {recentTokens.map((token, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                      <p><strong>ID:</strong> {token.id}</p>
                      <p><strong>Fingerprint:</strong> {token.contractFingerprint}</p>
                      <p><strong>Cycle:</strong> {token.metadata.morphingCycle}</p>
                      <p><strong>Synthesis:</strong> {token.metadata.synthesis.toFixed(3)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Contract Execution</span>
              </CardTitle>
              <CardDescription>
                Test autonomous contract matching and execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={simulateContractExecution} variant="outline" className="w-full">
                Simulate Contract Execution
              </Button>
              
              {activeContracts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Executions:</h4>
                  {activeContracts.map((contract, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                      <p><strong>Contract:</strong> {contract.contractId}</p>
                      <p><strong>Operation:</strong> {contract.operation}</p>
                      <p><strong>Fee:</strong> {contract.fee} ETH</p>
                      <p><strong>Result:</strong> {contract.result}</p>
                      <p><strong>Time:</strong> {new Date(contract.timestamp).toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="web3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Web3 Broadcasting</span>
              </CardTitle>
              <CardDescription>
                Network beacon and capability broadcasting status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contractStatus && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Capabilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {contractStatus.beacon.capabilities.map((cap, index) => (
                        <Badge key={index} variant="outline">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Available Contracts:</h4>
                    <div className="flex flex-wrap gap-2">
                      {contractStatus.beacon.contracts.map((contract, index) => (
                        <Badge key={index} variant="secondary">
                          {contract}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Broadcasting beacon every 30 seconds to Web3 networks
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trust" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust & Reputation System</CardTitle>
              <CardDescription>
                Autonomous reputation building for contract reliability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contractStatus && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded">
                    <div>
                      <h3 className="font-semibold">Current Trust Score</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {contractStatus.trustScore.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Node Reputation</p>
                      <Badge variant={contractStatus.trustScore > 80 ? 'default' : 'secondary'}>
                        {contractStatus.trustScore > 80 ? 'TRUSTED' : 'BUILDING'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    Trust score automatically increases with successful contract executions
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
