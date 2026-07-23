
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Download, File, Image, FileText } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface AttachedAsset {
  name: string;
  type: string;
  originalName: string;
  size: number;
  compressedSize: number;
  compressionRatio: string;
  migrationDate: string;
  loadUrl: string;
}

export function AttachedAssetsBrowser() {
  const [assets, setAssets] = useState<AttachedAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AttachedAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, totalSize: 0, totalCompressed: 0 });

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = assets.filter(asset =>
        asset.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  }, [searchQuery, assets]);

  const loadAssets = async () => {
    try {
      const result = await sdkClient.getAttachedAssets();
      
      if (result.success && result.data?.success) {
        const data = result.data;
        setAssets(data.assets);
        setFilteredAssets(data.assets);
        
        const totalSize = data.assets.reduce((sum: number, asset: AttachedAsset) => sum + asset.size, 0);
        const totalCompressed = data.assets.reduce((sum: number, asset: AttachedAsset) => sum + asset.compressedSize, 0);
        
        setStats({
          count: data.count,
          totalSize,
          totalCompressed
        });
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsset = async (asset: AttachedAsset) => {
    try {
      const response = await fetch(asset.loadUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download asset:', error);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading attached assets...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Attached Assets Browser</span>
            <Badge variant="secondary">{stats.count} files</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.count}</div>
              <div className="text-sm text-gray-500">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{formatFileSize(stats.totalSize)}</div>
              <div className="text-sm text-gray-500">Original Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{formatFileSize(stats.totalCompressed)}</div>
              <div className="text-sm text-gray-500">Compressed Size</div>
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2 max-h-96 overflow-y-auto">
        {filteredAssets.map((asset, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getAssetIcon(asset.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{asset.originalName}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                    <span>{formatFileSize(asset.size)}</span>
                    <span>→ {formatFileSize(asset.compressedSize)}</span>
                    <span className="text-green-400">{asset.compressionRatio}x</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadAsset(asset)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredAssets.length === 0 && searchQuery && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">No assets found matching "{searchQuery}"</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
