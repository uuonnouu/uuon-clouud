import { useState } from 'react';

// Define parameters expected by your new Vercel backend
interface MintShapeParams {
  shapeType: string;
  tokenName: string;
  ownerWalletAddress: string;
  parameters: Record<string, number>;
}

interface MintResult {
  success: boolean;
  tokenId: string;
  transactionId: string;
  stateHash: string;
}

export function useShapeMint() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintResult | null>(null);

  const mintShapeToken = async (data: MintShapeParams) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Your live production Vercel gateway URL
    const VERCEL_API_ENDPOINT = 'https://vercel.app';

    try {
      console.log(`📡 Sending shape payload to production gateway: ${data.tokenName}`);

      const response = await fetch(VERCEL_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shapeType: data.shapeType,
          tokenName: data.tokenName,
          ownerWalletAddress: data.ownerWalletAddress,
          parameters: data.parameters,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to initialize shape token minting pipeline.');
      }

      console.log('✅ Pipeline acknowledged request:', json);
      setResult({
        success: true,
        tokenId: json.tokenId,
        transactionId: json.transactionId,
        stateHash: json.stateHash
      });
      return json;

    } catch (err: any) {
      console.error('❌ Frontend Minting Hook Failure:', err.message);
      setError(err.message || 'Unknown network gateway error');
    } finally {
      setLoading(false);
    }
  };

  return { mintShapeToken, loading, error, result };
}