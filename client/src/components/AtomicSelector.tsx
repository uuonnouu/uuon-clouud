import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface AtomicSelectorProps {
  onSelect: (structure: string) => void;
  selected: string;
}

const structures = [
  { id: 'thomson', name: 'Thomson Model', category: 'Atomic Models', description: 'Plum Pudding Model' },
  { id: 'rutherford', name: 'Rutherford Model', category: 'Atomic Models', description: 'Nuclear Model' },
  { id: 'bohr', name: 'Bohr Model', category: 'Atomic Models', description: 'Planetary Model' },
  { id: 'electron-cloud', name: 'Electron Cloud', category: 'Atomic Models', description: 'Quantum Model' },
  { id: 'nucleus', name: 'Nucleus', category: 'Particles', description: 'Atomic Nucleus' },
  { id: 'proton', name: 'Proton', category: 'Particles', description: 'With Quarks' },
  { id: 'neutron', name: 'Neutron', category: 'Particles', description: 'With Quarks' },
  { id: 'electron', name: 'Electron', category: 'Particles', description: 'Elementary Particle' },
  { id: 'photon', name: 'Photon', category: 'Particles', description: 'Light Particle' },
  { id: 'higgs', name: 'Higgs Boson', category: 'Particles', description: 'God Particle' },
  { id: 'antimatter', name: 'Antimatter', category: 'Particles', description: 'Particle-Antiparticle' },
  { id: 'alpha', name: 'Alpha', category: 'Radiation', description: 'α Particles' },
  { id: 'beta', name: 'Beta', category: 'Radiation', description: 'β Radiation' },
  { id: 'gamma', name: 'Gamma', category: 'Radiation', description: 'γ Radiation' },
  { id: 'neutron-radiation', name: 'Neutron', category: 'Radiation', description: 'Neutron Radiation' },
  { id: 'electromagnetic', name: 'Electromagnetic', category: 'Radiation', description: 'EM Waves' },
  { id: 'cosmic', name: 'Cosmic', category: 'Radiation', description: 'Cosmic Radiation' },
  { id: 'blackhole', name: 'Black Hole', category: 'Cosmic Phenomena', description: 'Accretion Disk' },
  { id: 'blackhole-edge', name: 'Black Hole Edge', category: 'Cosmic Phenomena', description: 'Edge-On View' },
  { id: 'blackhole-jets', name: 'Black Hole Jets', category: 'Cosmic Phenomena', description: 'With Polar Jets' },
  { id: 'whitehole', name: 'White Hole', category: 'Cosmic Phenomena', description: 'Theoretical' },
  { id: 'wormhole', name: 'Wormhole', category: 'Cosmic Phenomena', description: 'Einstein-Rosen Bridge' },
  { id: 'gravitational-lens', name: 'Gravitational Lensing', category: 'Relativity', description: 'Light Bending' },
  { id: 'gravitational-waves', name: 'Gravitational Waves', category: 'Relativity', description: 'Spacetime Ripples' },
  { id: 'time-dilation', name: 'Time Dilation', category: 'Relativity', description: 'Spacetime Curvature' },
  { id: 'singularity', name: 'Singularity', category: 'Quantum Physics', description: 'Point Mass' },
  { id: 'quantum-strings', name: 'Quantum Strings', category: 'Quantum Physics', description: 'String Theory' },
  { id: 'spacetime-grain', name: 'Spacetime Grain', category: 'Quantum Physics', description: 'Quantum Foam' },
  { id: 'heart', name: 'Heart', category: 'Human Anatomy', description: 'Cardiovascular System' },
  { id: 'brain', name: 'Brain', category: 'Human Anatomy', description: 'Central Nervous System' },
  { id: 'lungs', name: 'Lungs', category: 'Human Anatomy', description: 'Respiratory System' },
  { id: 'liver', name: 'Liver', category: 'Human Anatomy', description: 'Digestive System' },
  { id: 'stomach', name: 'Stomach', category: 'Human Anatomy', description: 'Digestive System' },
  { id: 'kidneys', name: 'Kidneys', category: 'Human Anatomy', description: 'Urinary System' },
  { id: 'spine', name: 'Spine', category: 'Human Anatomy', description: 'Skeletal System' },
  { id: 'eye', name: 'Eye', category: 'Human Anatomy', description: 'Visual System' },
];

const categories = ['Atomic Models', 'Particles', 'Radiation', 'Cosmic Phenomena', 'Relativity', 'Quantum Physics', 'Human Anatomy'];

export default function AtomicSelector({ onSelect, selected }: AtomicSelectorProps) {
  return (
    <Card className="absolute top-4 left-4 w-80 bg-black/90 border-gray-700 text-white z-10">
      <ScrollArea className="h-[calc(100vh-2rem)] p-4">
        <h2 className="text-xl font-bold mb-4">Atomic Structures</h2>
        
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
            <div className="space-y-1">
              {structures
                .filter(s => s.category === category)
                .map(structure => (
                  <Button
                    key={structure.id}
                    onClick={() => onSelect(structure.id)}
                    variant={selected === structure.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      selected === structure.id
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{structure.name}</div>
                      <div className="text-xs text-gray-400">{structure.description}</div>
                    </div>
                  </Button>
                ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
