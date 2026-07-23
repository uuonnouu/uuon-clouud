import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Box, Grid3X3, Sparkles, Atom, Zap } from 'lucide-react';

export type AnimationType = 'sketchfab' | 'transform-anim' | 'physics-anim';
export type GeometryStyle = 'solid' | 'wireframe' | 'points' | 'holographic' | 'ultra-hd';

interface AnimationExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (geometryStyle: GeometryStyle) => void;
  animationType: AnimationType;
}

const animationLabels: Record<AnimationType, { title: string; icon: string; description: string }> = {
  'sketchfab': {
    title: 'Sketchfab Export',
    icon: '🎬',
    description: 'Smooth 360° rotation animation (4 second loop)'
  },
  'transform-anim': {
    title: 'Transform Animation',
    icon: '🔄',
    description: 'Gentle pulsing animation (3 second loop)'
  },
  'physics-anim': {
    title: 'Physics Animation',
    icon: '⚛️',
    description: 'Category-specific physics simulation (4 second loop)'
  }
};

const geometryOptions: { value: GeometryStyle; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'solid',
    label: 'Surface (Solid)',
    icon: <Box className="w-5 h-5" />,
    description: 'Full mesh with PBR materials'
  },
  {
    value: 'wireframe',
    label: 'Wireframe',
    icon: <Grid3X3 className="w-5 h-5" />,
    description: 'Edge-only with glowing core'
  },
  {
    value: 'points',
    label: 'Point Cloud',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Vertex positions as spheres'
  },
  {
    value: 'holographic',
    label: 'Holographic',
    icon: <Zap className="w-5 h-5" />,
    description: 'Sci-fi hologram with interference, flicker & Fresnel glow'
  }
];

export function AnimationExportModal({ isOpen, onClose, onConfirm, animationType }: AnimationExportModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<GeometryStyle>('solid');
  const animationInfo = animationLabels[animationType];

  const handleConfirm = () => {
    onConfirm(selectedStyle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900/95 border border-purple-500/40 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">{animationInfo.icon}</span>
            {animationInfo.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {animationInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-sm font-medium text-gray-300 mb-3 block">
            Choose Geometry Style:
          </Label>
          
          <RadioGroup 
            value={selectedStyle} 
            onValueChange={(value) => setSelectedStyle(value as GeometryStyle)}
            className="space-y-3"
          >
            {geometryOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedStyle === option.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                }`}
                onClick={() => setSelectedStyle(option.value)}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value}
                  className="border-purple-500 text-purple-500"
                />
                <div className="flex-shrink-0 text-purple-400">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <Label 
                    htmlFor={option.value} 
                    className="text-white font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold"
          >
            <Atom className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
