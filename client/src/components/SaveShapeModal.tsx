import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SurfaceParameters } from '../types/math';
import { Save, X } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';
import { formatShapeName } from '../lib/shapeCategories';

interface SaveShapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParameters: SurfaceParameters;
  currentShapeType: string;
}

export default function SaveShapeModal({ 
  isOpen, 
  onClose, 
  currentParameters,
  currentShapeType 
}: SaveShapeModalProps) {
  const [shapeName, setShapeName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    if (!shapeName.trim()) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    setSaving(true);
    try {
      const shapeId = `custom_${currentShapeType}_${Date.now()}`;
      
      const result = await sdkClient.saveFusedShape({
        shapeName: shapeName.trim(),
        shapeId: shapeId,
        parentShape1: currentShapeType,
        parentShape2: currentShapeType,
        fusionRatio: 1.0,
        fusedParameters: currentParameters,
        description: `Custom ${currentShapeType} configuration`,
        isAnimated: false,
        animationKeyframes: null,
        isPublic: true
      });

      if (result.success && result.data?.success) {
        setSaveStatus('success');
        setTimeout(() => {
          setSaveStatus('idle');
          setShapeName('');
          onClose();
        }, 1500);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Failed to save shape:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-cyan-500/30 text-cyan-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Current Shape
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Give your custom shape a name to save it to your library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shapeName" className="text-cyan-300 text-sm">
              Shape Name
            </Label>
            <Input
              id="shapeName"
              type="text"
              placeholder="e.g., My Custom Sphere"
              value={shapeName}
              onChange={(e) => setShapeName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-800 border-cyan-500/30 text-cyan-100 placeholder:text-gray-500 focus:border-cyan-400"
              autoFocus
              disabled={saving}
            />
          </div>

          <div className="bg-gray-800 p-3 rounded border border-cyan-500/20">
            <p className="text-xs text-gray-400 mb-1">Current Shape:</p>
            <p className="text-sm text-cyan-300 font-medium">
              {formatShapeName(currentShapeType)}
            </p>
          </div>

          {saveStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
              <p className="text-red-400 text-sm">
                {shapeName.trim() ? 'Failed to save shape. Please try again.' : 'Please enter a shape name'}
              </p>
            </div>
          )}

          {saveStatus === 'success' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
              <p className="text-green-400 text-sm">
                ✓ Shape saved successfully!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !shapeName.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? 'Saving...' : 'Save Shape'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
