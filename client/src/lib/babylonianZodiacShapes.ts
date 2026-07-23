import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const BABYLONIAN_ZODIAC_SHAPES: Record<string, ParametricSurface> = {
  
  babylonian_aries_hired_man: {
    name: "Aries - The Hired Man (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const t = (u - 0.5) * Math.PI;
      const hornLeft = a * Math.cos(t);
      const hornRight = -a * Math.cos(t);
      const blend = Math.sin(phi);
      const hornShape = blend > 0.5 ? hornLeft : hornRight;
      const bodyLine = -b * Math.abs(Math.sin(theta));
      const r = a * (1 + 0.3 * Math.cos(2 * theta)) * Math.sin(phi);
      return [
        r * Math.cos(theta) + 0.2 * hornShape,
        r * Math.sin(theta),
        c * (r * Math.cos(phi) + 0.3 * bodyLine)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  babylonian_taurus_bull_of_heaven: {
    name: "Taurus - Bull of Heaven (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const R = a;
      const d = 0.3 * R;
      const upperHorn = phi < Math.PI / 2 ? Math.sqrt(Math.max(0, R * R - d * d * Math.sin(phi) * Math.sin(phi))) : 0;
      const lowerHorn = phi > Math.PI / 2 ? Math.sqrt(Math.max(0, R * R - d * d * Math.cos(phi) * Math.cos(phi))) : 0;
      const crescent = 1 + 0.4 * Math.cos(theta) * (upperHorn + lowerHorn) / R;
      const r = a * crescent * b * Math.sin(phi);
      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        c * a * Math.cos(phi) * (1 + 0.2 * Math.cos(2 * theta))
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  babylonian_gemini_great_twins: {
    name: "Gemini - The Great Twins (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 2, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * b * 2;
      const twin = Math.floor(theta / Math.PI) % 2;
      const xOffset = twin === 0 ? -a : a;
      const connection = Math.abs(t) < 0.1 ? 1 : 0;
      const columnWidth = 0.3;
      const x = xOffset + columnWidth * Math.cos(theta * 4);
      const y = t;
      const z = c * (columnWidth * Math.sin(theta * 4) + connection * (a - Math.abs(xOffset)));
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 2, c: 0.5 })
  },

  babylonian_cancer_crayfish: {
    name: "Cancer - The Crayfish (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 0.3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const spiralK = b;
      const spiralC = a * 0.5;
      const clawAngle = theta < Math.PI ? theta : theta - Math.PI;
      const r_spiral = spiralC + spiralK * clawAngle;
      const mirror = theta < Math.PI ? 1 : -1;
      const clawShape = r_spiral * Math.sin(phi);
      return [
        mirror * clawShape * Math.cos(clawAngle),
        clawShape * Math.sin(clawAngle),
        c * r_spiral * Math.cos(phi) * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.3, c: 1 })
  },

  babylonian_leo_lion: {
    name: "Leo - The Lion (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 8, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const maneCorona = a * (1 + 0.15 * Math.sin(b * theta));
      const bodyLine = -0.3 * Math.abs(Math.sin(theta));
      const r = maneCorona * Math.sin(phi);
      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        c * (maneCorona * Math.cos(phi) + bodyLine * (1 - Math.sin(phi)))
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 8, c: 1 })
  },

  babylonian_virgo_furrow: {
    name: "Virgo - The Furrow/Grain (Babylonian)",
    equation: (u, v, params) => {
      const { a = 0.3, b = 0.5, c = 3 } = params;
      const theta = u * Math.PI * 2;
      const h = c;
      const t = (v - 0.5) * h * 2;
      const N = 5;
      const delta = h / N;
      let grainEffect = 0;
      for (let n = -N; n <= N; n++) {
        const grainY = n * delta * 0.4;
        const dist = Math.abs(t - grainY);
        if (dist < b) {
          grainEffect += (1 - dist / b) * 0.5;
        }
      }
      const stemRadius = a * 0.3;
      const grainRadius = a * (1 + grainEffect);
      const r = grainRadius;
      return [
        r * Math.cos(theta),
        t,
        r * Math.sin(theta) * c * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ a: 0.5, b: 0.5, c: 2 })
  },

  babylonian_libra_scales: {
    name: "Libra - The Scales (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 2;
      const L = a;
      const alpha = b * 0.5;
      const H = c;
      const beamY = 0;
      const isLeftBowl = theta < Math.PI;
      const bowlX = isLeftBowl ? -L : L;
      const localTheta = isLeftBowl ? theta : theta - Math.PI;
      const bowlRadius = 0.6;
      const bowlDepth = alpha * Math.pow(localTheta / Math.PI - 0.5, 2) * 4 - H * 0.5;
      const x = bowlX + bowlRadius * Math.cos(localTheta * 2) * t;
      const y = bowlRadius * Math.sin(localTheta * 2) * t;
      const z = bowlDepth * t * t;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  babylonian_scorpio_scorpion: {
    name: "Scorpio - The Scorpion (Babylonian)",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      const k = b;
      const tailR = a * Math.exp(k * theta);
      const stingerX = tailR * Math.cos(theta);
      const stingerY = tailR * Math.sin(theta);
      const tubeRadius = 0.15 * a;
      const x = stingerX + tubeRadius * Math.cos(phi);
      const y = stingerY + tubeRadius * Math.sin(phi) * Math.cos(theta);
      const z = c * tubeRadius * Math.sin(phi) * Math.sin(theta);
      const stingerTip = theta > 0.9 * Math.PI ? 0.3 * a : 0;
      return [x, y + stingerTip * Math.sin(phi), z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.3, c: 1 })
  },

  babylonian_sagittarius_pabilsag: {
    name: "Sagittarius - Pabilsag (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = v;
      const R = a;
      const theta1 = -Math.PI / 3;
      const theta2 = Math.PI / 3;
      const bowTheta = theta1 + (theta2 - theta1) * u;
      const bowX = R * Math.cos(bowTheta);
      const bowY = R * Math.sin(bowTheta);
      const stringX = R * Math.cos(theta1) + (R * Math.cos(theta2) - R * Math.cos(theta1)) * t;
      const stringY = R * Math.sin(theta1) + (R * Math.sin(theta2) - R * Math.sin(theta1)) * t;
      const arrowX = -a * 2 + t * a * 4;
      const arrowY = 0;
      const blend = Math.sin(theta);
      const x = bowX * (1 - t) + stringX * t * 0.3 + arrowX * t * 0.3;
      const y = bowY * (1 - t) + stringY * t * 0.3 + arrowY * t * 0.3;
      const tubeR = 0.1 * b;
      return [
        x + tubeR * Math.cos(theta),
        y + tubeR * Math.sin(theta),
        c * tubeR * Math.sin(theta * 2)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 0.5 })
  },

  babylonian_capricorn_goat_fish: {
    name: "Capricorn - Goat-Fish (Babylonian)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = v;
      const isGoatPart = t < 0.4;
      if (isGoatPart) {
        const triT = t / 0.4;
        const h = a;
        const baseB = b;
        const triX = baseB * (1 - triT) * Math.cos(theta);
        const triY = baseB * (1 - triT) * Math.sin(theta);
        const triZ = h * triT;
        return [triX, triY, c * triZ];
      } else {
        const fishT = (t - 0.4) / 0.6;
        const L = a * 2;
        const A = b * 0.5;
        const k = 3;
        const fishX = b + fishT * L;
        const fishY = A * Math.sin(k * fishT * Math.PI) * Math.cos(theta);
        const fishZ = A * Math.sin(k * fishT * Math.PI) * Math.sin(theta) * 0.3;
        return [fishX - a, fishY, c * fishZ];
      }
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 1 })
  },

  babylonian_aquarius_water_bearer: {
    name: "Aquarius - Water Bearer (Babylonian)",
    equation: (u, v, params) => {
      const { a = 1.5, b = 1, c = 2 } = params;
      const theta = u * Math.PI * 2;
      const t = v;
      const isVessel = t < 0.4;
      if (isVessel) {
        const vesselT = t / 0.4;
        const A = a;
        const B = b;
        const phi = Math.PI / 6;
        const ellipseX = A * Math.cos(theta);
        const ellipseY = B * Math.sin(theta);
        const rotX = ellipseX * Math.cos(phi) - ellipseY * Math.sin(phi);
        const rotY = ellipseX * Math.sin(phi) + ellipseY * Math.cos(phi);
        return [rotX * vesselT, rotY * vesselT, c * (1 - vesselT) * 0.5];
      } else {
        const waterT = (t - 0.4) / 0.6;
        const waveA = 0.3 * a;
        const omega = 4;
        const waterX = waveA * Math.sin(omega * waterT * Math.PI) * Math.cos(theta);
        const waterY = -c * waterT * 2;
        const waterZ = waveA * Math.sin(omega * waterT * Math.PI) * Math.sin(theta) * 0.5;
        return [waterX, waterY, waterZ];
      }
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 2 })
  },

  babylonian_pisces_fish_string: {
    name: "Pisces - The Fish-String (Babylonian)",
    equation: (u, v, params) => {
      const { a = 1, b = 0.6, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = v;
      const L = a * 1.5;
      const fishA = a * 0.8;
      const fishB = b;
      const isLeftFish = t < 0.3;
      const isRightFish = t > 0.7;
      const isCord = !isLeftFish && !isRightFish;
      if (isLeftFish) {
        const fishT = t / 0.3;
        const ellipseScale = Math.sin(fishT * Math.PI);
        const x = -L + fishA * Math.cos(theta) * ellipseScale;
        const y = fishB * Math.sin(theta) * ellipseScale;
        const z = c * 0.3 * ellipseScale * Math.sin(theta * 2);
        return [x, y, z];
      } else if (isRightFish) {
        const fishT = (t - 0.7) / 0.3;
        const ellipseScale = Math.sin(fishT * Math.PI);
        const x = L + fishA * Math.cos(theta) * ellipseScale;
        const y = fishB * Math.sin(theta) * ellipseScale;
        const z = c * 0.3 * ellipseScale * Math.sin(theta * 2);
        return [x, y, z];
      } else {
        const cordT = (t - 0.3) / 0.4;
        const k = 0.3;
        const cordX = -L + cordT * 2 * L;
        const cordY = k * Math.sin(cordX / L * Math.PI) + 0.1 * Math.cos(theta);
        const cordZ = c * 0.1 * Math.sin(theta);
        return [cordX, cordY, cordZ];
      }
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.6, c: 0.5 })
  }
};

export const BABYLONIAN_ZODIAC_CATEGORY = {
  id: 'babylonian-zodiac',
  name: '𒀭 Babylonian Zodiac (2000 BCE)',
  description: 'The 12 original zodiac constellations from ancient Babylon, mathematically reconstructed from cuneiform astronomical tablets',
  shapes: Object.keys(BABYLONIAN_ZODIAC_SHAPES)
};

console.log(`𒀭 Loaded 12 Babylonian Zodiac shapes from ancient Mesopotamian astronomy 🌟`);
