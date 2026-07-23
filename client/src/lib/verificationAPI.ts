import { apiRequest } from './queryClient';

export interface VerificationRequest {
  algorithmId: string;
  parameters: Record<string, number>;
  uDomain?: [number, number];
  vDomain?: [number, number];
  metadata?: { projectName?: string; requestedBy?: string; purpose?: string };
}

export interface VerificationResponse {
  algorithmId?: string;
  isValid: boolean;
  validation: {
    hasNaN: boolean;
    hasInfinity: boolean;
    hasSingularities: boolean;
    singularityCount: number;
    parameterRangeValid: boolean;
    geometryGenerated: boolean;
  };
  properties?: {
    vertexCount: number;
    boundingBox: { min: [number, number, number]; max: [number, number, number] };
    surfaceArea?: number;
  };
  warnings: string[];
  errors: string[];
  timestamp: string;
}

export interface BatchVerificationRequest {
  shapes: VerificationRequest[];
}

export interface BatchVerificationResponse {
  results: VerificationResponse[];
  summary: { total: number; valid: number; invalid: number };
  timestamp: string;
}

export async function verifySurface(
  request: VerificationRequest,
  apiKey: string = 'internal-frontend-key'
): Promise<VerificationResponse> {
  const response = await apiRequest('POST', '/api/verify-surface', { ...request, _apiKey: apiKey });
  return response.json();
}

export async function verifyBatch(
  request: BatchVerificationRequest,
  apiKey: string = 'internal-frontend-key'
): Promise<BatchVerificationResponse> {
  const response = await apiRequest('POST', '/api/verify-batch', { ...request, _apiKey: apiKey });
  return response.json();
}

export async function quickValidate(algorithmId: string, parameters: Record<string, number>): Promise<boolean> {
  try {
    const result = await verifySurface({ algorithmId, parameters });
    return result.isValid;
  } catch {
    return false;
  }
}

export async function getVerificationCapabilities(): Promise<{
  algorithms: string[];
  total: number;
  categories: { quantum: number; biological: number; minimal: number; topological: number; total: number };
  timestamp: string;
}> {
  const response = await apiRequest('GET', '/api/verification-capabilities');
  return response.json();
}
