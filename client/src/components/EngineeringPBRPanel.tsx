import React from 'react';
import { Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ENGINEERING_PBR_MATERIALS, ENGINEERING_MATERIAL_CATEGORIES, EngineeringPBRConfig } from '../lib/engineeringPBRMaterialSystem';

interface EngineeringPBRPanelProps {
  currentMaterial: string;
  onMaterialChange: (materialId: string) => void;
}

const categoryIcons: Record<string, string> = {
  'Printed Metals': '⚙️',
  'Technical Ceramics': '🏺',
  'Bio-Alloys': '🧬',
  'Structural Steel': '🏗️',
  'Carbon Composites': '⚫',
  'Titanium Lattice': '🔩'
};

const categoryDescriptions: Record<string, string> = {
  'Printed Metals': 'Additive manufacturing - titanium, steel, aluminum',
  'Technical Ceramics': 'High-precision ceramic composites',
  'Bio-Alloys': 'Organic-synthetic hybrid materials',
  'Structural Steel': 'Architectural-grade steel finishes',
  'Carbon Composites': 'High-performance carbon fiber',
  'Titanium Lattice': 'Aerospace-grade titanium structures'
};

export default function EngineeringPBRPanel({ currentMaterial, onMaterialChange }: EngineeringPBRPanelProps) {
  return (
    <div className="space-y-3 p-3 bg-gray-900/80 rounded-lg border border-amber-500/30">
      <div className="flex items-center gap-2">
        <Wrench className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Engineering PBR Materials</h3>
      </div>
      
      <p className="text-[10px] text-gray-400">
        Physically accurate materials for architectural, scientific, and engineering visualization
      </p>

      <div className="space-y-4">
        {Object.entries(ENGINEERING_MATERIAL_CATEGORIES).map(([category, materialIds]) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">{categoryIcons[category]}</span>
              <Label className="text-xs text-amber-300 font-medium">{category}</Label>
            </div>
            <p className="text-[9px] text-gray-500 ml-5">{categoryDescriptions[category]}</p>
            
            <div className="grid grid-cols-1 gap-1 ml-5">
              {materialIds.map((materialId) => {
                const material = ENGINEERING_PBR_MATERIALS[materialId];
                if (!material) return null;
                
                const isSelected = currentMaterial === materialId;
                
                return (
                  <Button
                    key={materialId}
                    variant="ghost"
                    size="sm"
                    className={`h-8 justify-start text-xs px-2 ${
                      isSelected 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => onMaterialChange(materialId)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-2 border border-gray-600"
                      style={{ 
                        backgroundColor: material.baseColor.primary,
                        boxShadow: isSelected ? '0 0 8px rgba(245, 158, 11, 0.5)' : 'none'
                      }}
                    />
                    <span className="truncate">{material.name}</span>
                    {material.category === 'metal' && (
                      <span className="ml-auto text-[8px] text-gray-500">M:{(material.metalness.value * 100).toFixed(0)}%</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center gap-2 text-[9px] text-gray-500">
          <span>📐 Curvature-responsive roughness</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-gray-500 mt-1">
          <span>🌀 Topology-aware ambient occlusion</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-gray-500 mt-1">
          <span>🔬 Suitable for scientific visualization</span>
        </div>
      </div>
    </div>
  );
}
