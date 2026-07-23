
import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import UniversalSymbolRenderer from './UniversalSymbolRenderer';
import { sdkClient } from '../lib/unifiedSDKClient';

interface SymbolBrowserProps {
  onSymbolSelect?: (symbolName: string) => void;
  renderMode?: '2d' | '3d' | 'both';
}

export default function SymbolBrowser({ 
  onSymbolSelect, 
  renderMode = 'both' 
}: SymbolBrowserProps) {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [symbolsResult, categoriesResult] = await Promise.all([
          sdkClient.getSymbols(),
          sdkClient.getSymbolCategories()
        ]);

        if (symbolsResult.success && symbolsResult.data) {
          setSymbols(symbolsResult.data.symbols);
        }

        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data.categories);
        }
      } catch (error) {
        console.error('Failed to load symbols:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter symbols based on search and category
  const filteredSymbols = symbols.filter(symbol => {
    const matchesSearch = searchTerm === '' || 
      symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.aliases.some((alias: string) => alias.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || symbol.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSymbolClick = (symbolName: string) => {
    setSelectedSymbol(symbolName);
    onSymbolSelect?.(symbolName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-cyan-400">Loading symbols...</span>
      </div>
    );
  }

  return (
    <div className="symbol-browser h-full flex flex-col bg-black/40">
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>
                {category.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
          
          <div className="flex border border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {filteredSymbols.length} symbols found
        </div>
      </div>

      {/* Symbol Grid/List */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredSymbols.map((symbol, index) => {
              const symbolKey = Object.keys(symbol)[0] || `symbol-${index}`;
              return (
                <button
                  key={symbolKey}
                  onClick={() => handleSymbolClick(symbolKey)}
                  className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-500 rounded-lg p-3 transition-colors text-center"
                >
                  <div 
                    className="text-3xl mb-2"
                    dangerouslySetInnerHTML={{ __html: symbol.html }}
                  />
                  <div className="text-xs text-gray-300 truncate">{symbol.symbol}</div>
                  <div className="text-[10px] text-gray-500 truncate">{symbol.category}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSymbols.map((symbol, index) => {
              const symbolKey = Object.keys(symbol)[0] || `symbol-${index}`;
              return (
                <button
                  key={symbolKey}
                  onClick={() => handleSymbolClick(symbolKey)}
                  className="w-full bg-gray-800/30 hover:bg-gray-700/30 border border-gray-600 hover:border-cyan-500 rounded-lg p-4 transition-colors text-left flex items-center gap-4"
                >
                  <div 
                    className="text-2xl"
                    dangerouslySetInnerHTML={{ __html: symbol.html }}
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{symbol.symbol}</div>
                    <div className="text-sm text-gray-300">{symbol.description}</div>
                    <div className="text-xs text-gray-500">
                      {symbol.category} • {symbol["3d"].method}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Symbol Detail */}
      {selectedSymbol && (
        <div className="border-t border-gray-700 p-4">
          <UniversalSymbolRenderer
            symbolName={selectedSymbol}
            renderMode={renderMode}
            size={0.8}
            interactive={true}
          />
        </div>
      )}
    </div>
  );
}
