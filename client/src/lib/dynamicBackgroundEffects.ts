/**
 * DYNAMIC BACKGROUND EFFECTS
 * Generates visual background effects based on mathematical properties of shapes
 * Changes colors, patterns, and animations based on equation characteristics
 */

import { SurfaceParameters } from '../types/math';

export interface BackgroundEffect {
  type: 'gradient' | 'particles' | 'waves' | 'cosmic' | 'fractal' | 'geometric' | 'holographic' | 'matrix' | 'neural' | 'crystalline';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  animation: 'pulse' | 'flow' | 'rotate' | 'breathe' | 'static' | 'glitch' | 'scan' | 'shimmer';
  intensity: number;
  pattern?: string;
}

export interface MathematicalProperties {
  complexity: 'simple' | 'moderate' | 'complex' | 'hyperdimensional';
  domain: 'algebraic' | 'transcendental' | 'differential' | 'topological' | 'quantum';
  symmetry: 'none' | 'bilateral' | 'radial' | 'spherical' | 'hyperbolic';
  periodicity: boolean;
  dimensionality: number;
  curvature: 'flat' | 'positive' | 'negative' | 'mixed';
}

export function analyzeMathematicalProperties(shapeType: string, params: SurfaceParameters): MathematicalProperties {
  const type = shapeType.toLowerCase();
  
  let complexity: MathematicalProperties['complexity'] = 'simple';
  let domain: MathematicalProperties['domain'] = 'algebraic';
  let symmetry: MathematicalProperties['symmetry'] = 'none';
  let periodicity = false;
  let dimensionality = 3;
  let curvature: MathematicalProperties['curvature'] = 'flat';
  
  if (type.includes('tesseract') || type.includes('cell_') || type.includes('4d') || type.includes('hypercube')) {
    complexity = 'hyperdimensional';
    dimensionality = 4;
    symmetry = 'spherical';
  } else if (type.includes('fractal') || type.includes('mandelbrot') || type.includes('julia') || type.includes('chaos')) {
    complexity = 'complex';
    domain = 'algebraic';
    curvature = 'mixed';
  } else if (type.includes('quantum') || type.includes('schrodinger') || type.includes('orbital') || type.includes('wave_function')) {
    complexity = 'complex';
    domain = 'quantum';
    periodicity = true;
  } else if (type.includes('torus') || type.includes('klein') || type.includes('mobius') || type.includes('knot')) {
    complexity = 'moderate';
    domain = 'topological';
    curvature = 'mixed';
  } else if (type.includes('wave') || type.includes('sin') || type.includes('harmonic') || type.includes('oscillat')) {
    complexity = 'moderate';
    domain = 'transcendental';
    periodicity = true;
    symmetry = 'bilateral';
  } else if (type.includes('sphere') || type.includes('ellipsoid')) {
    curvature = 'positive';
    symmetry = 'spherical';
  } else if (type.includes('hyperbolic') || type.includes('saddle') || type.includes('pseudosphere')) {
    curvature = 'negative';
    symmetry = 'radial';
  } else if (type.includes('riemann') || type.includes('einstein') || type.includes('relativity')) {
    complexity = 'complex';
    domain = 'differential';
    curvature = 'mixed';
  } else if (type.includes('crypto') || type.includes('hash') || type.includes('cipher')) {
    complexity = 'complex';
    domain = 'algebraic';
    symmetry = 'none';
  } else if (type.includes('dna') || type.includes('helix') || type.includes('spiral')) {
    complexity = 'moderate';
    periodicity = true;
    symmetry = 'radial';
  } else if (type.includes('atom') || type.includes('electron') || type.includes('proton')) {
    complexity = 'complex';
    domain = 'quantum';
    symmetry = 'spherical';
  }
  
  if (Math.abs(params.d ?? 0) > 10 || Math.abs(params.e ?? 0) > 10) {
    complexity = complexity === 'simple' ? 'moderate' : complexity === 'moderate' ? 'complex' : complexity;
  }
  
  return { complexity, domain, symmetry, periodicity, dimensionality, curvature };
}

export function generateBackgroundEffect(properties: MathematicalProperties): BackgroundEffect {
  const { complexity, domain, symmetry, periodicity, dimensionality, curvature } = properties;
  
  const colorSchemes: Record<string, { primary: string; secondary: string; accent: string }> = {
    quantum: { primary: '#0a0a2e', secondary: '#1a0a3a', accent: '#00ffff' },
    topological: { primary: '#0a1a2a', secondary: '#0a2a3a', accent: '#00ff88' },
    algebraic: { primary: '#1a0a1a', secondary: '#2a0a2a', accent: '#ff00ff' },
    transcendental: { primary: '#0a1a0a', secondary: '#0a2a1a', accent: '#88ff00' },
    differential: { primary: '#1a1a0a', secondary: '#2a2a0a', accent: '#ffaa00' }
  };
  
  const scheme = colorSchemes[domain] || colorSchemes.algebraic;
  
  let type: BackgroundEffect['type'] = 'gradient';
  let animation: BackgroundEffect['animation'] = 'static';
  
  switch (complexity) {
    case 'hyperdimensional':
      type = 'cosmic';
      animation = 'rotate';
      break;
    case 'complex':
      type = curvature === 'mixed' ? 'fractal' : 'waves';
      animation = periodicity ? 'flow' : 'breathe';
      break;
    case 'moderate':
      type = periodicity ? 'waves' : 'geometric';
      animation = 'pulse';
      break;
    case 'simple':
      type = 'gradient';
      animation = 'static';
      break;
  }
  
  if (dimensionality > 3) {
    type = 'cosmic';
    scheme.accent = '#ffffff';
  }
  
  let pattern: string | undefined;
  switch (symmetry) {
    case 'spherical':
      pattern = 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)';
      break;
    case 'radial':
      pattern = 'conic-gradient(from 0deg at center, var(--primary), var(--secondary), var(--primary))';
      break;
    case 'bilateral':
      pattern = 'linear-gradient(90deg, var(--primary), var(--secondary), var(--primary))';
      break;
    case 'hyperbolic':
      pattern = 'repeating-radial-gradient(circle at center, var(--accent) 0px, transparent 30px)';
      break;
  }
  
  const intensity = complexity === 'hyperdimensional' ? 1.0 : 
                   complexity === 'complex' ? 0.8 :
                   complexity === 'moderate' ? 0.6 : 0.4;
  
  return {
    type,
    primaryColor: scheme.primary,
    secondaryColor: scheme.secondary,
    accentColor: scheme.accent,
    animation,
    intensity,
    pattern
  };
}

export function getBackgroundCSS(effect: BackgroundEffect): string {
  const { type, primaryColor, secondaryColor, accentColor, animation, intensity, pattern } = effect;
  
  let backgroundStyle = '';
  let animationStyle = '';
  
  switch (type) {
    case 'cosmic':
      backgroundStyle = `
        background: radial-gradient(ellipse at 20% 30%, ${accentColor}20 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 70%, ${secondaryColor} 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, ${primaryColor} 0%, #000000 100%);
      `;
      break;
    case 'fractal':
      backgroundStyle = `
        background: repeating-conic-gradient(from 0deg at 50% 50%, 
          ${primaryColor} 0deg, ${secondaryColor} 60deg, ${accentColor}30 120deg,
          ${secondaryColor} 180deg, ${primaryColor} 240deg, ${accentColor}30 300deg, ${primaryColor} 360deg);
        background-size: 200% 200%;
      `;
      break;
    case 'waves':
      backgroundStyle = `
        background: 
          repeating-linear-gradient(45deg, ${accentColor}10 0px, transparent 40px),
          repeating-linear-gradient(-45deg, ${accentColor}10 0px, transparent 40px),
          linear-gradient(180deg, ${primaryColor}, ${secondaryColor});
      `;
      break;
    case 'geometric':
      backgroundStyle = `
        background: 
          linear-gradient(60deg, ${accentColor}15 25%, transparent 25%),
          linear-gradient(-60deg, ${accentColor}15 25%, transparent 25%),
          linear-gradient(180deg, ${primaryColor}, ${secondaryColor});
      `;
      break;
    case 'particles':
      backgroundStyle = `
        background: radial-gradient(2px 2px at 20px 30px, ${accentColor}, transparent),
                    radial-gradient(2px 2px at 40px 70px, ${accentColor}80, transparent),
                    radial-gradient(1px 1px at 90px 40px, ${accentColor}60, transparent),
                    linear-gradient(180deg, ${primaryColor}, ${secondaryColor});
        background-size: 100px 100px, 100px 100px, 100px 100px, 100% 100%;
      `;
      break;
    case 'holographic':
      backgroundStyle = `
        background: 
          linear-gradient(135deg, ${accentColor}40 0%, transparent 50%, ${secondaryColor}40 100%),
          linear-gradient(225deg, #ff00ff30 0%, transparent 50%, #00ffff30 100%),
          linear-gradient(315deg, #ffff0020 0%, transparent 50%, #ff00ff20 100%),
          radial-gradient(ellipse at 50% 50%, ${primaryColor} 0%, #000000 100%);
        background-blend-mode: screen, overlay, color-dodge, normal;
      `;
      break;
    case 'matrix':
      backgroundStyle = `
        background: 
          repeating-linear-gradient(0deg, transparent 0px, transparent 2px, ${accentColor}15 2px, ${accentColor}15 4px),
          repeating-linear-gradient(90deg, transparent 0px, transparent 20px, ${accentColor}08 20px, ${accentColor}08 21px),
          linear-gradient(180deg, #000000 0%, ${primaryColor} 50%, #000000 100%);
      `;
      break;
    case 'neural':
      backgroundStyle = `
        background: 
          radial-gradient(circle at 10% 20%, ${accentColor}30 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, ${accentColor}30 0%, transparent 20%),
          radial-gradient(circle at 50% 50%, ${accentColor}20 0%, transparent 30%),
          radial-gradient(circle at 30% 70%, ${secondaryColor}40 0%, transparent 25%),
          radial-gradient(circle at 70% 30%, ${secondaryColor}40 0%, transparent 25%),
          linear-gradient(180deg, ${primaryColor} 0%, #0a0a15 100%);
      `;
      break;
    case 'crystalline':
      backgroundStyle = `
        background: 
          conic-gradient(from 0deg at 25% 25%, transparent 0deg, ${accentColor}20 60deg, transparent 120deg),
          conic-gradient(from 180deg at 75% 75%, transparent 0deg, ${accentColor}20 60deg, transparent 120deg),
          conic-gradient(from 90deg at 50% 50%, ${secondaryColor}10 0deg, transparent 30deg, ${secondaryColor}10 60deg, transparent 90deg),
          linear-gradient(135deg, ${primaryColor} 0%, #0a0a1a 50%, ${primaryColor} 100%);
      `;
      break;
    default:
      backgroundStyle = `background: linear-gradient(180deg, ${primaryColor}, ${secondaryColor});`;
  }
  
  switch (animation) {
    case 'pulse':
      animationStyle = `animation: bgPulse ${4 / intensity}s ease-in-out infinite;`;
      break;
    case 'flow':
      animationStyle = `animation: bgFlow ${10 / intensity}s linear infinite;`;
      break;
    case 'rotate':
      animationStyle = `animation: bgRotate ${20 / intensity}s linear infinite;`;
      break;
    case 'breathe':
      animationStyle = `animation: bgBreathe ${6 / intensity}s ease-in-out infinite;`;
      break;
    case 'glitch':
      animationStyle = `animation: bgGlitch ${2 / intensity}s steps(10) infinite;`;
      break;
    case 'scan':
      animationStyle = `animation: bgScan ${3 / intensity}s linear infinite;`;
      break;
    case 'shimmer':
      animationStyle = `animation: bgShimmer ${5 / intensity}s ease-in-out infinite;`;
      break;
  }
  
  return `${backgroundStyle} ${animationStyle} opacity: ${intensity};`;
}

export function getDynamicBackgroundForShape(shapeType: string, params: SurfaceParameters): BackgroundEffect {
  const properties = analyzeMathematicalProperties(shapeType, params);
  return generateBackgroundEffect(properties);
}

export const BACKGROUND_KEYFRAMES = `
@keyframes bgPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

@keyframes bgFlow {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

@keyframes bgRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bgBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes bgGlitch {
  0%, 100% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
  10% { filter: hue-rotate(90deg) brightness(1.1); transform: translate(-2px, 1px); }
  20% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
  30% { filter: hue-rotate(-90deg) brightness(0.9); transform: translate(2px, -1px); }
  40% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
  50% { filter: hue-rotate(180deg) brightness(1.2); transform: translate(-1px, 2px); }
  60% { filter: hue-rotate(0deg) brightness(1); transform: translate(0); }
}

@keyframes bgScan {
  0% { background-position: 0% -100%; }
  100% { background-position: 0% 200%; }
}

@keyframes bgShimmer {
  0%, 100% { filter: brightness(1) contrast(1); }
  25% { filter: brightness(1.1) contrast(1.05); }
  50% { filter: brightness(1.2) contrast(1.1); }
  75% { filter: brightness(1.1) contrast(1.05); }
}
`;

export const SHAPE_CATEGORY_COLORS: Record<string, string> = {
  'basic': '#1a1a2e',
  'parametric': '#16213e',
  'topological': '#0f3460',
  'quantum': '#0a0a2e',
  'fractal': '#1a0a2e',
  'biological': '#0a1a0a',
  'cryptographic': '#2a0a0a',
  'astronomical': '#0a0a1a',
  '4d': '#1a1a3a',
  'sacred': '#2a1a2a'
};
