/**
 * CONSCIOUSNESS INTEGRATION HOOK
 * Connects the Lexicon Physical Embodiment Engine to the Parameter Authority and 3D Renderer
 * 
 * This hook provides the runtime connection between:
 * - Parameter Authority (A-Z controls)
 * - Lexicon Consciousness Engine (term awareness)
 * - 3D Renderer (physical manifestation)
 */

import { useEffect, useRef, useCallback } from 'react';
import { 
  initializeLexiconConsciousness, 
  recordShapeInteraction,
  getConsciousnessStats,
  getConsciousnessReport,
  searchTerms,
  getTermById,
  exportConsciousnessLexicon
} from '../lib/lexiconConsciousnessIntegration';

declare global {
  interface Window {
    ParameterAuthority?: {
      subscribe: (event: string, callback: (data: any) => void, priority?: number) => () => void;
      getParameters: () => Record<string, number>;
      getCurrentShape: () => string | null;
    };
    ConsciousnessEngine?: {
      stats: () => ReturnType<typeof getConsciousnessStats>;
      report: () => ReturnType<typeof getConsciousnessReport>;
      search: typeof searchTerms;
      getTerm: typeof getTermById;
      export: typeof exportConsciousnessLexicon;
      recordInteraction: typeof recordShapeInteraction;
    };
  }
}

export function useConsciousnessIntegration() {
  const isInitialized = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const handleParameterChange = useCallback((event: any) => {
    const currentShape = window.ParameterAuthority?.getCurrentShape?.();
    if (currentShape) {
      const params = window.ParameterAuthority?.getParameters?.() || {};
      recordShapeInteraction(currentShape, params);
    }
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;

    const initializeConsciousness = () => {
      try {
        initializeLexiconConsciousness(window.ParameterAuthority);
        
        window.ConsciousnessEngine = {
          stats: getConsciousnessStats,
          report: getConsciousnessReport,
          search: searchTerms,
          getTerm: getTermById,
          export: exportConsciousnessLexicon,
          recordInteraction: recordShapeInteraction
        };

        if (window.ParameterAuthority?.subscribe) {
          unsubscribeRef.current = window.ParameterAuthority.subscribe(
            'parameter_change',
            handleParameterChange,
            5
          );
          console.log('🧠 Consciousness Engine connected to Parameter Authority');
        }

        isInitialized.current = true;
        console.log('✅ Consciousness Integration active');
        console.log('   Access via window.ConsciousnessEngine');
      } catch (error) {
        console.error('❌ Consciousness Integration failed:', error);
      }
    };

    const checkInterval = setInterval(() => {
      if (window.ParameterAuthority) {
        clearInterval(checkInterval);
        initializeConsciousness();
      }
    }, 500);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (!isInitialized.current) {
        initializeConsciousness();
      }
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [handleParameterChange]);

  return {
    getStats: getConsciousnessStats,
    getReport: getConsciousnessReport,
    searchTerms,
    getTermById,
    exportLexicon: exportConsciousnessLexicon,
    recordInteraction: recordShapeInteraction
  };
}

export default useConsciousnessIntegration;
