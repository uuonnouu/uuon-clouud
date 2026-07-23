import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Share2, Heart, Star, Download, Upload, Users } from 'lucide-react';
import { SurfaceParameters } from '../types/math';

interface Creation {
  id: string;
  name: string;
  description: string;
  author: string;
  parameters: SurfaceParameters;
  thumbnail: string;
  likes: number;
  downloads: number;
  tags: string[];
  createdAt: string;
  rating: number;
}

interface CommunityFeaturesProps {
  currentParameters: SurfaceParameters;
  onLoadCreation: (parameters: SurfaceParameters) => void;
}

export default function CommunityFeatures({
  currentParameters,
  onLoadCreation
}: CommunityFeaturesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'share' | 'favorites'>('browse');
  const [creations, setCreations] = useState<Creation[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('popular');

  // Load community creations from localStorage (simulating API)
  useEffect(() => {
    const oldCreations = localStorage.getItem('dimensional-math-community');
    if (oldCreations) {
      localStorage.setItem('uuon-community-data', oldCreations);
      localStorage.removeItem('dimensional-math-community');
    }
    
    const oldFavorites = localStorage.getItem('dimensional-math-favorites');
    if (oldFavorites) {
      localStorage.setItem('uuon-community-favorites', oldFavorites);
      localStorage.removeItem('dimensional-math-favorites');
    }
    
    const savedCreations = localStorage.getItem('uuon-community-data');
    if (savedCreations) {
      setCreations(JSON.parse(savedCreations));
    }
    
    const savedFavorites = localStorage.getItem('uuon-community-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveCreation = (creation: Creation) => {
    const updatedCreations = [...creations, creation];
    setCreations(updatedCreations);
    localStorage.setItem('uuon-community-data', JSON.stringify(updatedCreations));
  };

  const generateThumbnail = (): string => {
    // Generate a simple representation of the current shape
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple geometric preview
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 100, 100);
      
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      
      // Draw shape representation based on type
      if (currentParameters.type.includes('cube')) {
        ctx.strokeRect(20, 20, 60, 60);
        ctx.strokeRect(30, 10, 60, 60);
      } else if (currentParameters.type.includes('sphere')) {
        ctx.arc(50, 50, 30, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Generic polygon
        const sides = parseInt(currentParameters.type.match(/\d+/)?.[0] || '6');
        drawPolygon(ctx, 50, 50, 30, sides);
      }
    }
    
    return canvas.toDataURL();
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number) => {
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };

  const shareCreation = (name: string, description: string, tags: string[]) => {
    const newCreation: Creation = {
      id: Date.now().toString(),
      name,
      description,
      author: 'Anonymous User',
      parameters: currentParameters,
      thumbnail: generateThumbnail(),
      likes: 0,
      downloads: 0,
      tags,
      createdAt: new Date().toISOString(),
      rating: 0
    };
    
    saveCreation(newCreation);
    setActiveTab('browse');
  };

  const toggleFavorite = (creationId: string) => {
    const newFavorites = favorites.includes(creationId)
      ? favorites.filter(id => id !== creationId)
      : [...favorites, creationId];
    
    setFavorites(newFavorites);
    localStorage.setItem('uuon-community-favorites', JSON.stringify(newFavorites));
  };

  const filteredCreations = creations
    .filter(creation => 
      creation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return (b.likes + b.downloads) - (a.likes + a.downloads);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const ShareForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim()) {
        shareCreation(name, description, tags.split(',').map(t => t.trim()).filter(Boolean));
        setName('');
        setDescription('');
        setTags('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="creation-name" className="text-sm text-purple-200">Creation Name</Label>
          <Input
            id="creation-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Amazing Mathematical Creation"
            className="bg-gray-800 border-gray-600 text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="creation-description" className="text-sm text-purple-200">Description</Label>
          <Textarea
            id="creation-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your mathematical visualization..."
            className="bg-gray-800 border-gray-600 text-white resize-none"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="creation-tags" className="text-sm text-purple-200">Tags (comma-separated)</Label>
          <Input
            id="creation-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="geometry, fractal, 3d, educational"
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>
        
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
          <Share2 className="w-4 h-4 mr-2" />
          Share Creation
        </Button>
      </form>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300"
        title="Community Features"
      >
        <Users className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 w-96 bg-black/95 backdrop-blur-sm rounded-lg border border-blue-500 text-white z-40 max-h-[70vh] overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-blue-300">Community</h3>
              <Button
                onClick={() => setIsOpen(false)}
                className="p-1 h-auto bg-transparent hover:bg-gray-700"
              >
                ×
              </Button>
            </div>
            
            <div className="flex space-x-1">
              <Button
                onClick={() => setActiveTab('browse')}
                className={`text-xs px-3 py-1 ${activeTab === 'browse' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Browse
              </Button>
              <Button
                onClick={() => setActiveTab('share')}
                className={`text-xs px-3 py-1 ${activeTab === 'share' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Share
              </Button>
              <Button
                onClick={() => setActiveTab('favorites')}
                className={`text-xs px-3 py-1 ${activeTab === 'favorites' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Favorites
              </Button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {activeTab === 'browse' && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search creations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white text-sm"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2"
                  >
                    <option value="popular">Popular</option>
                    <option value="recent">Recent</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {filteredCreations.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No creations found. Be the first to share!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredCreations.map((creation) => (
                      <Card key={creation.id} className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <img
                              src={creation.thumbnail}
                              alt={creation.name}
                              className="w-12 h-12 rounded border border-gray-600"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-white truncate">
                                {creation.name}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                by {creation.author}
                              </p>
                              <div className="flex items-center space-x-3 mt-1">
                                <Button
                                  onClick={() => toggleFavorite(creation.id)}
                                  className="p-1 h-auto bg-transparent hover:bg-gray-700"
                                >
                                  <Heart
                                    className={`w-3 h-3 ${
                                      favorites.includes(creation.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                    }`}
                                  />
                                </Button>
                                <Button
                                  onClick={() => onLoadCreation(creation.parameters)}
                                  className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700"
                                >
                                  Load
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'share' && <ShareForm />}

            {activeTab === 'favorites' && (
              <div className="space-y-3">
                {favorites.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No favorites yet. Like some creations to see them here!</p>
                  </div>
                ) : (
                  creations
                    .filter(creation => favorites.includes(creation.id))
                    .map((creation) => (
                      <Card key={creation.id} className="bg-gray-800 border-gray-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">{creation.name}</span>
                            <Button
                              onClick={() => onLoadCreation(creation.parameters)}
                              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Load
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}