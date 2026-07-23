
import { useEffect, useState } from 'react';
import { ShapeRegistryGuard, ShapeRegistryStatus } from '../lib/shapeRegistryGuard';

export function useShapeRegistryValidation() {
  const [registryStatus, setRegistryStatus] = useState<ShapeRegistryStatus | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateRegistry = () => {
      try {
        const guard = ShapeRegistryGuard.getInstance();
        const status = guard.validateRegistry();
        setRegistryStatus(status);
        
        // Log summary for developers
        if (!status.isHealthy) {
          console.group('🚨 Shape Registry Issues Detected');
          console.warn(`Missing implementations: ${status.missingCount}`);
          console.warn('Affected shapes:', status.missingShapes.slice(0, 10).join(', '));
          console.warn('These shapes will render as sphere placeholders');
          console.warn('Run "npm run fix-missing-shapes" to generate implementations');
          console.groupEnd();
        }
        
      } catch (error) {
        console.error('Shape registry validation failed:', error);
        setRegistryStatus({
          isHealthy: false,
          totalRegistered: 0,
          totalImplemented: 0,
          missingCount: -1,
          missingShapes: [],
          duplicates: []
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateRegistry();
  }, []);

  return {
    registryStatus,
    isValidating,
    isHealthy: registryStatus?.isHealthy ?? false,
    missingCount: registryStatus?.missingCount ?? 0
  };
}
