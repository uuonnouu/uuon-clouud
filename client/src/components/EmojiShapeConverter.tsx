
/**
 * EMOJI SHAPE CONVERTER COMPONENT
 * Easy emoji input with instant 3D shape conversion
 * © 2025 UUON Foundation Inc.
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Upload, FileImage, Film } from 'lucide-react';
import { EMOJI_TO_SHAPE_MAPPINGS, convertTextToShapes, StickerToShapeConverter, GifToShapeConverter } from '../lib/emojiToShapeConverter';
import { SurfaceParameters } from '../types/math';

interface EmojiShapeConverterProps {
  onShapeSelect: (params: Partial<SurfaceParameters>) => void;
  className?: string;
}

export default function EmojiShapeConverter({ onShapeSelect, className = '' }: EmojiShapeConverterProps) {
  const [emojiInput, setEmojiInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionResult, setConversionResult] = useState<any[]>([]);

  // Popular emoji quick buttons
  const popularEmojis = ['😂', '❤️', '🔥', '✨', '🌊', '⭐', '🚀', '💎', '🌈', '👍'];

  const handleEmojiInput = (input: string) => {
    setEmojiInput(input);
    const shapes = convertTextToShapes(input);
    setConversionResult(shapes);
  };

  const handleEmojiClick = (emoji: string) => {
    const newInput = emojiInput + emoji;
    handleEmojiInput(newInput);
  };

  const handleShapeSelect = (conversion: any) => {
    onShapeSelect({
      type: conversion.shapeType,
      ...conversion.parameters
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Check file type and convert accordingly
    if (file.type.includes('gif')) {
      const gifShape = GifToShapeConverter.convertGifToAnimatedMesh(file);
      setConversionResult([gifShape]);
    } else if (file.type.includes('image')) {
      const stickerShape = StickerToShapeConverter.convertStickerToMesh(file);
      setConversionResult([stickerShape]);
    }
  };

  return (
    <Card className={`bg-black/40 border border-purple-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Emoji & Visual Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* Emoji Input */}
        <div className="space-y-2">
          <Input
            value={emojiInput}
            onChange={(e) => handleEmojiInput(e.target.value)}
            placeholder="Type or paste emojis here... 😀✨🔥"
            className="bg-black/60 border-purple-500/50 text-white placeholder-gray-400 text-lg"
          />
          
          {/* Popular Emoji Quick Buttons */}
          <div className="flex flex-wrap gap-1">
            {popularEmojis.map(emoji => (
              <Button
                key={emoji}
                variant="outline"
                size="sm"
                onClick={() => handleEmojiClick(emoji)}
                className="border-purple-500/30 hover:border-purple-400 text-lg p-1 h-8 w-8"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>

        {/* File Upload for Stickers/GIFs */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*,.gif,.webp"
                onChange={handleFileUpload}
                className="bg-black/60 border-purple-500/50 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded"
              />
            </div>
          </div>
          <div className="flex gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <FileImage className="w-3 h-3" />
              <span>Stickers</span>
            </div>
            <div className="flex items-center gap-1">
              <Film className="w-3 h-3" />
              <span>GIFs</span>
            </div>
          </div>
        </div>

        {/* Conversion Results */}
        {conversionResult.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-purple-300">Detected Shapes:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {conversionResult.map((conversion, index) => (
                <div key={index} className="flex items-center justify-between bg-black/40 p-2 rounded border border-purple-500/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{conversion.emoji || '📁'}</span>
                      <div>
                        <div className="text-white text-xs font-medium">{conversion.description}</div>
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {conversion.shapeType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleShapeSelect(conversion)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Use
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Text */}
        <div className="text-xs text-gray-400">
          <div>✨ Emojis convert to mathematical shapes</div>
          <div>🖼️ Stickers become extruded meshes</div>
          <div>🎬 GIFs create animated surfaces</div>
        </div>

      </CardContent>
    </Card>
  );
}
