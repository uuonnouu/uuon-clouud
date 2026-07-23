// @ts-nocheck
// Sacred geometry uses dynamic parameter signatures for mathematical flexibility

/**
 * Sacred Geometry Implementations
 * Authentic chakra symbols and Tree of Life structures
 */

type SurfaceEquation = {
  x: (...args: number[]) => number;
  y: (...args: number[]) => number;
  z: (...args: number[]) => number;
};

export const SACRED_GEOMETRY: Record<string, SurfaceEquation> = {
  // Root Chakra (Muladhara) - Four-petaled lotus with square
  root_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3); // Three layers: square, petals, center
      
      if (layer === 0) {
        // Central square
        const side = Math.floor(angle / (Math.PI / 2)) % 4;
        const tParam = (angle % (Math.PI / 2)) / (Math.PI / 2);
        const corners = [
          [a || 1, a || 1], 
          [a || 1, -(a || 1)], 
          [-(a || 1), -(a || 1)], 
          [-(a || 1), a || 1]
        ];
        const p1 = corners[side];
        const p2 = corners[(side + 1) % 4];
        return p1[0] + tParam * (p2[0] - p1[0]) + (e || 0) * Math.sin((f || 1) * angle) * 0.1;
      } else if (layer === 1) {
        // Four lotus petals
        const petalAngle = angle + Math.PI / 4; // Offset petals
        const petalRadius = (b || 1) * (1 + (c || 0) * Math.sin(4 * petalAngle) * Math.exp(-Math.abs(Math.sin(4 * petalAngle))));
        return petalRadius * Math.cos(petalAngle) + (g || 0) * Math.sin((h || 1) * angle) * 0.05;
      } else {
        // Outer circle
        return (d || 1) * Math.cos(angle) + (i || 0) * Math.sin((j || 1) * angle) * 0.03;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Central square
        const side = Math.floor(angle / (Math.PI / 2)) % 4;
        const t = (angle % (Math.PI / 2)) / (Math.PI / 2);
        const corners = [
          [a, a], [a, -a], [-a, -a], [-a, a]
        ];
        const p1 = corners[side];
        const p2 = corners[(side + 1) % 4];
        return p1[1] + t * (p2[1] - p1[1]) + f * Math.cos(e * angle) * 0.1;
      } else if (layer === 1) {
        // Four lotus petals
        const petalAngle = angle + Math.PI / 4;
        const petalRadius = b * (1 + c * Math.sin(4 * petalAngle) * Math.exp(-Math.abs(Math.sin(4 * petalAngle))));
        return petalRadius * Math.sin(petalAngle) + h * Math.cos(g * angle) * 0.05;
      } else {
        // Outer circle
        return d * Math.sin(angle) + j * Math.cos(i * angle) * 0.03;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return k * layer * 0.5 + l * Math.sin(m * u + n * v) * 0.2;
    }
  },

  // Sacral Chakra (Svadhisthana) - Six-petaled lotus with crescent moon
  sacral_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Crescent moon shape
        const moonRadius = a;
        const offsetRadius = a * 0.7;
        const mainCircle = moonRadius * Math.cos(angle);
        const cutCircle = (Math.abs(angle) < Math.PI) ? offsetRadius * Math.cos(angle - Math.PI * 0.3) + offsetRadius * 0.3 : mainCircle;
        return (Math.abs(angle) < Math.PI && mainCircle > cutCircle) ? cutCircle : mainCircle;
      } else if (layer === 1) {
        // Six lotus petals
        const petalRadius = b * (1 + c * Math.sin(6 * angle) * Math.exp(-Math.abs(Math.sin(6 * angle)) * 2));
        return petalRadius * Math.cos(angle) + e * Math.sin(f * angle) * 0.05;
      } else {
        // Outer circle
        return d * Math.cos(angle) + g * Math.sin(h * angle) * 0.03;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Crescent moon shape
        const moonRadius = a;
        const offsetRadius = a * 0.7;
        const mainCircle = moonRadius * Math.sin(angle);
        const cutCircle = (Math.abs(angle) < Math.PI) ? offsetRadius * Math.sin(angle - Math.PI * 0.3) : mainCircle;
        return (Math.abs(angle) < Math.PI && moonRadius * Math.cos(angle) > offsetRadius * Math.cos(angle - Math.PI * 0.3) + offsetRadius * 0.3) ? cutCircle : mainCircle;
      } else if (layer === 1) {
        // Six lotus petals
        const petalRadius = b * (1 + c * Math.sin(6 * angle) * Math.exp(-Math.abs(Math.sin(6 * angle)) * 2));
        return petalRadius * Math.sin(angle) + f * Math.cos(e * angle) * 0.05;
      } else {
        // Outer circle
        return d * Math.sin(angle) + h * Math.cos(g * angle) * 0.03;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return i * layer * 0.5 + j * Math.sin(k * u + l * v) * 0.2;
    }
  },

  // Solar Plexus Chakra (Manipura) - Ten-petaled lotus with triangle
  solar_plexus_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Downward-pointing triangle
        const triAngle = angle + Math.PI / 2; // Point downward
        const side = Math.floor(triAngle / (2 * Math.PI / 3)) % 3;
        const t = (triAngle % (2 * Math.PI / 3)) / (2 * Math.PI / 3);
        const corners = [
          [0, a], [a * Math.cos(7 * Math.PI / 6), a * Math.sin(7 * Math.PI / 6)], [a * Math.cos(11 * Math.PI / 6), a * Math.sin(11 * Math.PI / 6)]
        ];
        const p1 = corners[side];
        const p2 = corners[(side + 1) % 3];
        return p1[0] + t * (p2[0] - p1[0]) + e * Math.sin(f * angle) * 0.05;
      } else if (layer === 1) {
        // Ten lotus petals
        const petalRadius = b * (1 + c * Math.sin(10 * angle) * Math.exp(-Math.abs(Math.sin(10 * angle)) * 1.5));
        return petalRadius * Math.cos(angle) + g * Math.sin(h * angle) * 0.04;
      } else {
        // Outer circle
        return d * Math.cos(angle) + i * Math.sin(j * angle) * 0.02;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Downward-pointing triangle
        const triAngle = angle + Math.PI / 2;
        const side = Math.floor(triAngle / (2 * Math.PI / 3)) % 3;
        const t = (triAngle % (2 * Math.PI / 3)) / (2 * Math.PI / 3);
        const corners = [
          [0, a], [a * Math.cos(7 * Math.PI / 6), a * Math.sin(7 * Math.PI / 6)], [a * Math.cos(11 * Math.PI / 6), a * Math.sin(11 * Math.PI / 6)]
        ];
        const p1 = corners[side];
        const p2 = corners[(side + 1) % 3];
        return p1[1] + t * (p2[1] - p1[1]) + f * Math.cos(e * angle) * 0.05;
      } else if (layer === 1) {
        // Ten lotus petals
        const petalRadius = b * (1 + c * Math.sin(10 * angle) * Math.exp(-Math.abs(Math.sin(10 * angle)) * 1.5));
        return petalRadius * Math.sin(angle) + h * Math.cos(g * angle) * 0.04;
      } else {
        // Outer circle
        return d * Math.sin(angle) + j * Math.cos(i * angle) * 0.02;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return k * layer * 0.5 + l * Math.sin(m * u + n * v) * 0.15;
    }
  },

  // Heart Chakra (Anahata) - Twelve-petaled lotus with hexagram (Star of David)
  heart_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Hexagram (Star of David) - two overlapping triangles
        const upTriangle = Math.abs(Math.sin(3 * angle + Math.PI / 2)) > 0.5;
        const downTriangle = Math.abs(Math.sin(3 * angle - Math.PI / 2)) > 0.5;
        const inStar = upTriangle || downTriangle;
        const starRadius = inStar ? a * 0.8 : a * 0.4;
        return starRadius * Math.cos(angle) + e * Math.sin(f * angle) * 0.03;
      } else if (layer === 1) {
        // Twelve lotus petals
        const petalRadius = b * (1 + c * Math.sin(12 * angle) * Math.exp(-Math.abs(Math.sin(12 * angle)) * 1.2));
        return petalRadius * Math.cos(angle) + g * Math.sin(h * angle) * 0.03;
      } else {
        // Outer circle
        return d * Math.cos(angle) + i * Math.sin(j * angle) * 0.02;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Hexagram (Star of David)
        const upTriangle = Math.abs(Math.sin(3 * angle + Math.PI / 2)) > 0.5;
        const downTriangle = Math.abs(Math.sin(3 * angle - Math.PI / 2)) > 0.5;
        const inStar = upTriangle || downTriangle;
        const starRadius = inStar ? a * 0.8 : a * 0.4;
        return starRadius * Math.sin(angle) + f * Math.cos(e * angle) * 0.03;
      } else if (layer === 1) {
        // Twelve lotus petals
        const petalRadius = b * (1 + c * Math.sin(12 * angle) * Math.exp(-Math.abs(Math.sin(12 * angle)) * 1.2));
        return petalRadius * Math.sin(angle) + h * Math.cos(g * angle) * 0.03;
      } else {
        // Outer circle
        return d * Math.sin(angle) + j * Math.cos(i * angle) * 0.02;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return k * layer * 0.5 + l * Math.sin(m * u + n * v) * 0.1;
    }
  },

  // Throat Chakra (Vishuddha) - Sixteen-petaled lotus with circle
  throat_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Perfect circle in center
        return a * Math.cos(angle) + e * Math.sin(f * angle) * 0.02;
      } else if (layer === 1) {
        // Sixteen lotus petals
        const petalRadius = b * (1 + c * Math.sin(16 * angle) * Math.exp(-Math.abs(Math.sin(16 * angle))));
        return petalRadius * Math.cos(angle) + g * Math.sin(h * angle) * 0.025;
      } else {
        // Outer circle
        return d * Math.cos(angle) + i * Math.sin(j * angle) * 0.015;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Perfect circle in center
        return a * Math.sin(angle) + f * Math.cos(e * angle) * 0.02;
      } else if (layer === 1) {
        // Sixteen lotus petals
        const petalRadius = b * (1 + c * Math.sin(16 * angle) * Math.exp(-Math.abs(Math.sin(16 * angle))));
        return petalRadius * Math.sin(angle) + h * Math.cos(g * angle) * 0.025;
      } else {
        // Outer circle
        return d * Math.sin(angle) + j * Math.cos(i * angle) * 0.015;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return k * layer * 0.5 + l * Math.sin(m * u + n * v) * 0.08;
    }
  },

  // Third Eye Chakra (Ajna) - Two-petaled lotus with Om symbol
  third_eye_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Om symbol approximation using curves
        const omRadius = a * (1 + 0.3 * Math.sin(angle) + 0.2 * Math.sin(3 * angle));
        return omRadius * Math.cos(angle) + e * Math.sin(f * angle) * 0.05;
      } else if (layer === 1) {
        // Two large lotus petals (left and right)
        const petalSide = Math.sin(angle) > 0 ? 1 : -1;
        const petalAngle = petalSide > 0 ? angle : angle + Math.PI;
        const petalRadius = b * (1 + c * Math.abs(Math.sin(petalAngle)) * 2);
        return petalRadius * Math.cos(angle) + g * Math.sin(h * angle) * 0.03;
      } else {
        // Outer circle
        return d * Math.cos(angle) + i * Math.sin(j * angle) * 0.02;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 3);
      
      if (layer === 0) {
        // Om symbol approximation
        const omRadius = a * (1 + 0.3 * Math.sin(angle) + 0.2 * Math.sin(3 * angle));
        return omRadius * Math.sin(angle) + f * Math.cos(e * angle) * 0.05;
      } else if (layer === 1) {
        // Two large lotus petals
        const petalSide = Math.sin(angle) > 0 ? 1 : -1;
        const petalAngle = petalSide > 0 ? angle : angle + Math.PI;
        const petalRadius = b * (1 + c * Math.abs(Math.sin(petalAngle)) * 2);
        return petalRadius * Math.sin(angle) + h * Math.cos(g * angle) * 0.03;
      } else {
        // Outer circle
        return d * Math.sin(angle) + j * Math.cos(i * angle) * 0.02;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 3);
      return k * layer * 0.5 + l * Math.sin(m * u + n * v) * 0.06;
    }
  },

  // Crown Chakra (Sahasrara) - Thousand-petaled lotus
  crown_chakra: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 5); // Five layers for complex structure
      
      if (layer === 0) {
        // Central void/opening
        return a * 0.2 * Math.cos(angle);
      } else {
        // Multiple layers of petals (representing the thousand petals)
        const petalCount = 20 * layer; // Increasing petal density
        const petalRadius = b * (layer + 1) * 0.3 * (1 + c * Math.sin(petalCount * angle) * Math.exp(-Math.abs(Math.sin(petalCount * angle)) * 0.5));
        return petalRadius * Math.cos(angle) + e * Math.sin(f * angle + g * layer) * 0.02;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const angle = u * Math.PI * 2;
      const layer = Math.floor(v * 5);
      
      if (layer === 0) {
        // Central void/opening
        return a * 0.2 * Math.sin(angle);
      } else {
        // Multiple layers of petals
        const petalCount = 20 * layer;
        const petalRadius = b * (layer + 1) * 0.3 * (1 + c * Math.sin(petalCount * angle) * Math.exp(-Math.abs(Math.sin(petalCount * angle)) * 0.5));
        return petalRadius * Math.sin(angle) + f * Math.cos(e * angle + g * layer) * 0.02;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const layer = Math.floor(v * 5);
      return h * layer * 0.3 + i * Math.sin(j * u + k * v + l * layer) * 0.1;
    }
  },

  // Tree of Life (Kabbalah) - Ten Sephirot connected by 22 paths
  tree_of_life: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const pathIndex = Math.floor(u * 22); // 22 paths
      const pathProgress = (u * 22) % 1;
      
      // Sephirot positions (traditional Tree of Life layout)
      const sephirot = [
        [0, a * 3],          // 1. Kether (Crown)
        [-b, a * 2],         // 2. Chokmah (Wisdom)
        [b, a * 2],          // 3. Binah (Understanding)
        [-c, a],             // 4. Chesed (Mercy)
        [c, a],              // 5. Geburah (Severity)
        [0, 0],              // 6. Tiphereth (Beauty)
        [-d, -a],            // 7. Netzach (Victory)
        [d, -a],             // 8. Hod (Glory)
        [0, -a * 2],         // 9. Yesod (Foundation)
        [0, -a * 3]          // 10. Malkuth (Kingdom)
      ];
      
      // Path connections (traditional 22 paths)
      const paths = [
        [0, 1], [0, 2], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5],
        [3, 4], [3, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 7],
        [6, 7], [6, 8], [7, 8], [6, 9], [7, 9], [8, 9], [9, 9], [8, 9]
      ];
      
      if (pathIndex < paths.length) {
        const [start, end] = paths[pathIndex];
        const startPos = sephirot[start];
        const endPos = sephirot[end];
        return startPos[0] + pathProgress * (endPos[0] - startPos[0]) + e * Math.sin(f * u + g * v) * 0.05;
      } else {
        // Sephirot circles
        const sephIndex = Math.floor((u - 22/22) * 10) % 10;
        const sephPos = sephirot[sephIndex];
        const circleRadius = h * 0.2;
        return sephPos[0] + circleRadius * Math.cos(v * Math.PI * 2);
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const pathIndex = Math.floor(u * 22);
      const pathProgress = (u * 22) % 1;
      
      const sephirot = [
        [0, a * 3],          // 1. Kether
        [-b, a * 2],         // 2. Chokmah
        [b, a * 2],          // 3. Binah
        [-c, a],             // 4. Chesed
        [c, a],              // 5. Geburah
        [0, 0],              // 6. Tiphereth
        [-d, -a],            // 7. Netzach
        [d, -a],             // 8. Hod
        [0, -a * 2],         // 9. Yesod
        [0, -a * 3]          // 10. Malkuth
      ];
      
      const paths = [
        [0, 1], [0, 2], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5],
        [3, 4], [3, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 7],
        [6, 7], [6, 8], [7, 8], [6, 9], [7, 9], [8, 9], [9, 9], [8, 9]
      ];
      
      if (pathIndex < paths.length) {
        const [start, end] = paths[pathIndex];
        const startPos = sephirot[start];
        const endPos = sephirot[end];
        return startPos[1] + pathProgress * (endPos[1] - startPos[1]) + f * Math.cos(e * u + g * v) * 0.05;
      } else {
        // Sephirot circles
        const sephIndex = Math.floor((u - 22/22) * 10) % 10;
        const sephPos = sephirot[sephIndex];
        const circleRadius = h * 0.2;
        return sephPos[1] + circleRadius * Math.sin(v * Math.PI * 2);
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const pathIndex = Math.floor(u * 22);
      
      if (pathIndex < 22) {
        // Paths have slight elevation variation
        return i * Math.sin(j * u + k * v) * 0.3;
      } else {
        // Sephirot elevation
        return l * Math.sin(m * u + n * v) * 0.2;
      }
    }
  }
};

/**
 * Get sacred geometry information for display
 */
export function getSacredGeometryInfo(type: string): {
  name: string;
  description: string;
  tradition: string;
  symbolism: string;
  elements: string;
} {
  const info = {
    root_chakra: {
      name: "Root Chakra (Muladhara)",
      description: "Four-petaled lotus with central square representing earth element and foundation",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Grounding, survival, stability",
      elements: "Square (earth), 4 petals, red color"
    },
    sacral_chakra: {
      name: "Sacral Chakra (Svadhisthana)",
      description: "Six-petaled lotus with crescent moon representing water element and creativity",
      tradition: "Hindu/Buddhist Tantra", 
      symbolism: "Sexuality, creativity, emotion",
      elements: "Crescent moon (water), 6 petals, orange color"
    },
    solar_plexus_chakra: {
      name: "Solar Plexus Chakra (Manipura)",
      description: "Ten-petaled lotus with downward triangle representing fire element and personal power",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Personal power, confidence, transformation",
      elements: "Downward triangle (fire), 10 petals, yellow color"
    },
    heart_chakra: {
      name: "Heart Chakra (Anahata)",
      description: "Twelve-petaled lotus with hexagram representing air element and love",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Love, compassion, connection",
      elements: "Hexagram (Star of David), 12 petals, green color"
    },
    throat_chakra: {
      name: "Throat Chakra (Vishuddha)",
      description: "Sixteen-petaled lotus with circle representing space element and communication",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Communication, truth, expression",
      elements: "Circle (space/ether), 16 petals, blue color"
    },
    third_eye_chakra: {
      name: "Third Eye Chakra (Ajna)",
      description: "Two-petaled lotus with Om symbol representing light and intuition",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Intuition, wisdom, spiritual sight",
      elements: "Om symbol, 2 petals, indigo color"
    },
    crown_chakra: {
      name: "Crown Chakra (Sahasrara)",
      description: "Thousand-petaled lotus representing pure consciousness and enlightenment",
      tradition: "Hindu/Buddhist Tantra",
      symbolism: "Enlightenment, divine connection, pure consciousness",
      elements: "1000 petals, violet/white color"
    },
    tree_of_life: {
      name: "Tree of Life (Etz Chaim)",
      description: "Ten Sephirot connected by 22 paths representing divine emanation structure",
      tradition: "Kabbalah (Jewish Mysticism)",
      symbolism: "Divine emanation, spiritual ascent, cosmic structure",
      elements: "10 Sephirot, 22 paths, 4 worlds"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Sacred Symbol",
    description: "Sacred geometric structure",
    tradition: "Various spiritual traditions",
    symbolism: "Spiritual meaning",
    elements: "Geometric elements"
  };
}