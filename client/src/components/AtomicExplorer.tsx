import React, { useState } from 'react';
import AtomicVisualization from './AtomicVisualization';
import AtomicSelector from './AtomicSelector';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function AtomicExplorer() {
  const [selectedStructure, setSelectedStructure] = useState('bohr');
  const [showInternals, setShowInternals] = useState(false);

  return (
    <div className="relative w-full h-screen">
      <AtomicVisualization 
        selectedStructure={selectedStructure} 
        showInternals={showInternals}
      />
      
      <AtomicSelector 
        onSelect={setSelectedStructure} 
        selected={selectedStructure}
      />
      
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          onClick={() => setShowInternals(!showInternals)}
          className="bg-black/90 border border-gray-700 hover:bg-gray-900"
        >
          {showInternals ? (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Hide Internals
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Show Internals
            </>
          )}
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 z-10 bg-black/90 border border-gray-700 rounded-lg p-4 text-white max-w-sm">
        <h3 className="font-bold mb-2">Controls</h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• Rotate: Left Click + Drag</li>
          <li>• Zoom: Scroll / Pinch</li>
          <li>• Pan: Right Click + Drag</li>
        </ul>
      </div>
    </div>
  );
}
