
import { useState, useEffect, useCallback } from 'react';
import { unifiedFormulaIntegration, FormulaMetadata } from '../lib/unifiedFormulaIntegration';
import { SurfaceParameters } from '../types/math';

interface UseFormulaIntegrationResult {
  formulas: FormulaMetadata[];
  categories: string[];
  stats: any;
  loading: boolean;
  error: string | null;
  searchFormulas: (query: string) => FormulaMetadata[];
  getFormulasByCategory: (category: string) => FormulaMetadata[];
  render3D: (formulaKey: string, parameters?: Partial<SurfaceParameters>) => Promise<any>;
  getFormulaByKey: (key: string) => FormulaMetadata | null;
}

export function useFormulaIntegration(): UseFormulaIntegrationResult {
  const [formulas, setFormulas] = useState<FormulaMetadata[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        await unifiedFormulaIntegration.initialize();
        
        const allFormulas = Array.from(unifiedFormulaIntegration.getAllFormulas().values());
        const formulaCategories = unifiedFormulaIntegration.getCategories();
        const formulaStats = unifiedFormulaIntegration.getFormulaStats();

        setFormulas(allFormulas);
        setCategories(formulaCategories);
        setStats(formulaStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize formulas');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const searchFormulas = useCallback((query: string) => {
    return unifiedFormulaIntegration.searchFormulas(query);
  }, []);

  const getFormulasByCategory = useCallback((category: string) => {
    return unifiedFormulaIntegration.getFormulasByCategory(category);
  }, []);

  const render3D = useCallback(async (formulaKey: string, parameters?: Partial<SurfaceParameters>) => {
    return unifiedFormulaIntegration.render3D(formulaKey, parameters);
  }, []);

  const getFormulaByKey = useCallback((key: string) => {
    return unifiedFormulaIntegration.getFormulaByKey(key);
  }, []);

  return {
    formulas,
    categories,
    stats,
    loading,
    error,
    searchFormulas,
    getFormulasByCategory,
    render3D,
    getFormulaByKey
  };
}
