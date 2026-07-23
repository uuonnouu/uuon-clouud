import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import AssetStorageManager from '../lib/assetStorage';
import { SurfaceParameters } from '../types/math';

interface AssetManagementPanelProps {
  parameters: SurfaceParameters;
  currentGeometry?: THREE.BufferGeometry;
}

export default function AssetManagementPanel({ parameters, currentGeometry }: AssetManagementPanelProps) {
  const [assetManager] = useState(new AssetStorageManager());
  const [energyBalance, setEnergyBalance] = useState(0);
  const [plantStatus, setPlantStatus] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAssets, setSavedAssets] = useState<string[]>([]);

  useEffect(() => {
    const updateStatus = async () => {
      setEnergyBalance(assetManager.getEnergyBalance());
      const status = await assetManager.getProcessingPlantStatus();
      setPlantStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, [assetManager]);

  const handleSaveAsGLB = async () => {
    if (!currentGeometry) return;
    
    setIsProcessing(true);
    try {
      const assetId = await assetManager.saveGeometryAsGLB(currentGeometry, {
        surfaceType: parameters.type,
        parameters: parameters,
        timestamp: new Date().toISOString(),
        creator: 'Δmension User'
      });
      
      setSavedAssets(prev => [...prev, assetId]);
    } catch (error) {
      console.error('Failed to save GLB:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecycleAsset = async (assetId: string) => {
    setIsProcessing(true);
    try {
      const energyGenerated = await assetManager.compressAndRecycle(assetId);
    } catch (error) {
      console.error('Failed to recycle asset:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportAsset = async (assetId: string) => {
    try {
      const blob = await assetManager.exportAsset(assetId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${assetId}.glb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export asset:', error);
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Asset Management</h3>
        <div className="text-sm text-green-400">
          ⚡ {energyBalance.toFixed(2)} Energy Units
        </div>
      </div>

      {/* Save Current Geometry */}
      <div className="space-y-2">
        <h4 className="text-white font-semibold">Save Current Shape</h4>
        <button
          onClick={handleSaveAsGLB}
          disabled={!currentGeometry || isProcessing}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     text-white rounded transition-colors"
        >
          {isProcessing ? '⏳ Saving...' : '💾 Save as GLB'}
        </button>
        <div className="text-xs text-gray-400">
          Current: {parameters.type} with {Object.keys(parameters).length} parameters
        </div>
      </div>

      {/* Virtual Processing Plant Status */}
      <div className="bg-green-900/30 border border-green-700 rounded p-3 space-y-2">
        <h4 className="text-green-400 font-semibold flex items-center">
          🏭 Virtual Processing Plant
          <span className={`ml-2 text-xs px-2 py-1 rounded ${
            plantStatus.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            {plantStatus.status || 'IDLE'}
          </span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-gray-300">
            <div>Processed: {(plantStatus.totalProcessed / 1024).toFixed(1)}KB</div>
            <div>Generated: {plantStatus.energyGenerated?.toFixed(2)} units</div>
          </div>
          <div className="text-gray-300">
            <div>Efficiency: {((plantStatus.efficiency || 0) * 100).toFixed(1)}%</div>
            <div>Active: {plantStatus.activeProcesses || 0} processes</div>
          </div>
        </div>
      </div>

      {/* Saved Assets */}
      <div className="space-y-2">
        <h4 className="text-white font-semibold">Saved Assets ({savedAssets.length})</h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {savedAssets.map((assetId, index) => (
            <div key={assetId} className="bg-gray-800 rounded p-2 flex justify-between items-center">
              <div className="text-xs text-gray-300 truncate flex-1">
                {assetId}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleExportAsset(assetId)}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
                  title="Export GLB"
                >
                  📱
                </button>
                <button
                  onClick={() => handleRecycleAsset(assetId)}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                  title="Recycle for Energy"
                >
                  ♻️
                </button>
              </div>
            </div>
          ))}
          {savedAssets.length === 0 && (
            <div className="text-gray-500 text-xs text-center py-4">
              No assets saved yet. Save your first geometry as GLB!
            </div>
          )}
        </div>
      </div>

      {/* Data Compression Stats */}
      <div className="bg-blue-900/30 border border-blue-700 rounded p-3">
        <h4 className="text-blue-400 font-semibold">♻️ Renewable Processing</h4>
        <div className="text-xs text-gray-300 mt-2">
          <div>• Assets compressed with multi-layer algorithms</div>
          <div>• Energy generated from compression efficiency</div>
          <div>• Virtual electricity powers processing plant</div>
          <div>• Sustainable computational resource cycle</div>
        </div>
      </div>
    </div>
  );
}
