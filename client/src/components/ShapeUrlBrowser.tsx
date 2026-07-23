
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ExternalLink, Search, Globe, Database, Link } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface ShapeUrl {
  url: string;
  name: string;
  category: string;
  lastModified: string;
}

export default function ShapeUrlBrowser() {
  const [shapeUrls, setShapeUrls] = useState<ShapeUrl[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<ShapeUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadShapeUrls();
  }, []);

  useEffect(() => {
    filterUrls();
  }, [searchTerm, selectedCategory, shapeUrls]);

  const loadShapeUrls = async () => {
    try {
      const result = await sdkClient.getShapeUrls();
      
      if (result.success && result.data?.success) {
        setShapeUrls(result.data.shapes);
        setFilteredUrls(result.data.shapes);
      }
    } catch (error) {
      console.error('Failed to load shape URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUrls = () => {
    let filtered = shapeUrls;

    if (searchTerm) {
      filtered = filtered.filter(shape =>
        shape.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shape.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(shape => shape.category === selectedCategory);
    }

    setFilteredUrls(filtered);
  };

  const categories = [...new Set(shapeUrls.map(shape => shape.category))].sort();

  const openShapePage = (url: string) => {
    window.open(url, '_blank');
  };

  const copyUrl = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-cyan-500/30">
        <CardContent className="p-8 text-center">
          <div className="text-cyan-300">Loading shape URLs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Shape URL Browser
          </CardTitle>
          <div className="text-gray-400 text-sm">
            {shapeUrls.length} individual shape pages available
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search shapes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-cyan-500/30 text-cyan-100"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-cyan-500/30 text-cyan-100 px-3 py-2 rounded"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-400">
            Showing {filteredUrls.length} of {shapeUrls.length} shapes
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredUrls.map((shape, index) => (
          <Card key={index} className="bg-gray-800 border-gray-600 hover:border-cyan-500/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-cyan-100">{shape.name}</h3>
                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                      {shape.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Link className="w-3 h-3" />
                    {shape.url}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(shape.url)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openShapePage(shape.url)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUrls.length === 0 && searchTerm && (
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-8 text-center text-gray-400">
            No shapes found matching "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}
