export interface TetrahedronHash {
  position: number;
  angle: number;
  culture: 'egyptian' | 'greek' | 'latin' | 'english';
  hash: string;
}

export interface D13MON4Result {
  circle_hash: string;
  tetrahedra: TetrahedronHash[];
  circle_properties: {
    tetrahedron_count: number;
    circle_frequency: number;
    circle_energy: number;
    cultural_cycles: number;
  };
  timestamp: number;
}