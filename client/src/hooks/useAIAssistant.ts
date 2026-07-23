import { useState, useCallback } from 'react';
import { localAI, LocalAIResponse } from '../lib/localAI';

interface AIAnalysis {
  recommended_shape: string;
  mathematical_reasoning: string;
  suggested_parameters: Record<string, number>;
  confidence_score: number;
  learning_notes: string;
  source?: 'server' | 'local';
}

interface AIResponse {
  success: boolean;
  analysis?: AIAnalysis;
  patterns?: any;
  recommendations?: string[];
  response?: string;
  error?: string;
  source?: 'server' | 'local';
}

export function useAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);

  const analyzeShape = useCallback(async (
    description: string,
    parameters?: Record<string, number>,
    currentShape?: string,
    userIntent?: string
  ): Promise<AIAnalysis | null> => {
    console.log('🤖 AI features disabled until professional setup');
    return null;
    try {
      // Try server-based AI first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          parameters,
          current_shape: currentShape,
          user_intent: userIntent
        }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));

      const data: AIResponse = await response.json();
      setLastResponse({ ...data, source: 'server' });

      if (data.success && data.analysis) {
        return { ...data.analysis, source: 'server' };
      }
      return null;
    } catch (error) {
      console.error('Server AI analysis failed, trying local AI:', error);

      // Fallback to local AI
      try {
        const localResponse: LocalAIResponse = await localAI.analyzeShapeIntent(description)
          .catch(error => {
            console.error('Local AI shape analysis failed:', error);
            return {
              text: 'Local AI analysis unavailable',
              confidence: 0.1,
              processing_time: 0
            };
          });
        
        const recommendations = await localAI.generateShapeRecommendations(description)
          .catch(error => {
            console.error('Local AI recommendations failed:', error);
            return ['sphere', 'cube', 'torus'];
          });

        const localAnalysis: AIAnalysis = {
          recommended_shape: recommendations[0] || currentShape || 'sphere',
          mathematical_reasoning: `🤖 **Local AI Analysis** (Offline)\n\n${localResponse.text}\n\n**Processing time**: ${localResponse.processing_time.toFixed(0)}ms\n**Confidence**: ${(localResponse.confidence * 100).toFixed(0)}%`,
          suggested_parameters: parameters || {
            a: 2.0, b: 1.5, c: 1.0, d: 1.0, e: 0, f: 1,
            g: 0, h: 1, i: 0, j: 0.5
          },
          confidence_score: localResponse.confidence,
          learning_notes: `Local AI processed offline. Recommendations: ${recommendations.join(', ')}`,
          source: 'local'
        };

        setLastResponse({ 
          success: true, 
          analysis: localAnalysis,
          source: 'local'
        });

        return localAnalysis;
      } catch (localError) {
        console.error('Local AI also failed:', localError);
        setLastResponse({ success: false, error: 'Both server and local AI failed', source: 'local' });
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMathematicalPatterns = useCallback(async (shape: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/patterns/${shape}`);
      const data: AIResponse = await response.json();
      setLastResponse(data);
      return data.patterns;
    } catch (error) {
      console.error('Pattern analysis failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (currentShape: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/recommendations/${currentShape}`);
      const data: AIResponse = await response.json();
      setLastResponse(data);
      return data.recommendations || [];
    } catch (error) {
      console.error('Recommendations failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (
    query: string,
    shape: string,
    rating: number
  ) => {
    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, shape, rating })
      });
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  }, []);

  const chatWithAI = useCallback(async (
    message: string,
    context?: any
  ): Promise<string> => {
    setIsLoading(true);
    try {
      // Try server-based AI first
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });

      const data: AIResponse = await response.json();
      setLastResponse({ ...data, source: 'server' });
      return data.response || 'AI response unavailable';
    } catch (error) {
      console.error('Server AI chat failed, trying local AI:', error);

      // Fallback to local AI
      try {
        const currentShape = context?.current_shape || 'unknown';

        // Try to answer as a question first
        if (message.includes('?') || message.toLowerCase().includes('what') || 
            message.toLowerCase().includes('how') || message.toLowerCase().includes('why')) {

          const answerResponse: LocalAIResponse = await localAI.answerMathQuestion(message, currentShape);

          setLastResponse({
            success: true,
            response: `🤖 **Local AI** (Offline)\n\n${answerResponse.text}\n\n*Processing time: ${answerResponse.processing_time.toFixed(0)}ms*`,
            source: 'local'
          });

          return `🤖 **Local AI** (Offline)\n\n${answerResponse.text}\n\n*Processing time: ${answerResponse.processing_time.toFixed(0)}ms*`;
        } else {
          // Treat as shape intent analysis
          const intentResponse: LocalAIResponse = await localAI.analyzeShapeIntent(message);
          const recommendations = await localAI.generateShapeRecommendations(message);

          const response = `🤖 **Local AI** (Offline)\n\n${intentResponse.text}\n\n**Recommendations**: ${recommendations.join(', ')}\n\n*Processing time: ${intentResponse.processing_time.toFixed(0)}ms*`;

          setLastResponse({
            success: true,
            response,
            source: 'local'
          });

          return response;
        }
      } catch (localError) {
        console.error('Local AI chat also failed:', localError);
        return '🤖 **Offline AI unavailable**\n\nBoth server and local AI are currently unavailable. Please check your connection or try again later.';
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    lastResponse,
    analyzeShape,
    getMathematicalPatterns,
    getRecommendations,
    submitFeedback,
    chatWithAI
  };
}