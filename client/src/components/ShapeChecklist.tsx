import React, { useState } from 'react';
import { CheckCircle, Circle, X } from 'lucide-react';

interface ShapeChecklistProps {
  isVisible: boolean;
  onClose: () => void;
}

const SHAPES_LIST = [
  // BASIC SHAPES (1-18)
  { id: 1, name: "Sphere", status: "unknown" },
  { id: 2, name: "Cube", status: "unknown" },
  { id: 3, name: "Square", status: "unknown" },
  { id: 4, name: "Triangular Prism", status: "unknown" },
  { id: 5, name: "Cylinder", status: "unknown" },
  { id: 6, name: "Torus", status: "unknown" },
  { id: 7, name: "Tetrahedron", status: "unknown" },
  { id: 8, name: "Cone", status: "unknown" },
  { id: 9, name: "Square Pyramid", status: "unknown" },
  { id: 10, name: "Icosahedron", status: "unknown" },
  { id: 11, name: "Dodecahedron", status: "unknown" },
  { id: 12, name: "Octahedron", status: "unknown" },
  { id: 13, name: "Pentagonal Prism", status: "unknown" },
  { id: 14, name: "Hexagonal Prism", status: "unknown" },
  { id: 15, name: "Pentagonal Pyramid", status: "unknown" },
  { id: 16, name: "Octagonal Prism", status: "unknown" },
  { id: 17, name: "Decagonal Prism", status: "unknown" },
  { id: 18, name: "Dodecagonal Prism", status: "unknown" },
];

export default function ShapeChecklist({ isVisible, onClose }: ShapeChecklistProps) {
  const [shapes, setShapes] = useState(SHAPES_LIST);
  
  const updateShapeStatus = (id: number, status: 'works' | 'broken' | 'unknown') => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, status } : shape
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'works': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'broken': return <X className="w-4 h-4 text-red-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'works': return 'text-green-400';
      case 'broken': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Shape Verification Checklist</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {shapes.map(shape => (
            <div 
              key={shape.id}
              className={`flex items-center gap-2 p-2 rounded hover:bg-gray-800 ${getStatusColor(shape.status)}`}
            >
              {getStatusIcon(shape.status)}
              <span className="flex-1">{shape.id}. {shape.name}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => updateShapeStatus(shape.id, 'works')}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✓
                </button>
                <button 
                  onClick={() => updateShapeStatus(shape.id, 'broken')}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  ✗
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Click ✓ for working shapes, ✗ for broken/missing shapes</p>
          <p>Status: {shapes.filter(s => s.status === 'works').length} working, {shapes.filter(s => s.status === 'broken').length} broken, {shapes.filter(s => s.status === 'unknown').length} untested</p>
        </div>
      </div>
    </div>
  );
}