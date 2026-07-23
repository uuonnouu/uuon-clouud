
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { mathValidator } from '../lib/mathematicalValidator';

interface Props {
  children: ReactNode;
  fallbackShape?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryAttempts: number;
  lastErrorTime: number;
}

export class MathematicalErrorBoundary extends Component<Props, State> {
  private maxRecoveryAttempts = 3;
  private recoveryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Mathematical computation error:', error);
    console.error('📍 Error details:', errorInfo);
    
    const newRecoveryAttempts = this.state.recoveryAttempts + 1;
    
    this.setState({
      error,
      errorInfo,
      recoveryAttempts: newRecoveryAttempts
    });

    // Attempt automatic recovery for mathematical errors
    if (this.shouldAttemptRecovery(error) && newRecoveryAttempts <= this.maxRecoveryAttempts) {
      this.attemptRecovery();
    }

    // Log error for analysis
    this.logError(error, errorInfo);
  }

  private shouldAttemptRecovery(error: Error): boolean {
    const { recoveryAttempts, lastErrorTime } = this.state;
    const now = Date.now();
    
    // Don't recover if too many attempts
    if (recoveryAttempts >= this.maxRecoveryAttempts) {
      return false;
    }
    
    // Don't recover if errors happening too frequently
    if (now - lastErrorTime < 5000) {
      return false;
    }
    
    // Only recover from specific mathematical errors
    const recoverableErrors = [
      'Surface equation error',
      'Parameter validation failed',
      'WebGL context lost',
      'Memory allocation failed'
    ];
    
    return recoverableErrors.some(pattern => 
      error.message.includes(pattern) || error.name.includes(pattern)
    );
  }

  private attemptRecovery = () => {
    console.log(`🔄 Attempting mathematical error recovery (attempt ${this.state.recoveryAttempts}/${this.maxRecoveryAttempts})`);
    
    this.recoveryTimeout = setTimeout(() => {
      // Clear error state and attempt to continue
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
      
      console.log('✅ Mathematical error recovery completed');
    }, 2000);
  };

  private logError(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging for mathematical operations
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      component: errorInfo.componentStack,
      recoveryAttempts: this.state.recoveryAttempts,
      userAgent: navigator.userAgent,
      webglSupport: this.checkWebGLSupport()
    };
    
    console.error('📊 Detailed error report:', errorReport);
    
    // Could send to analytics service here
    // analytics.track('mathematical_error', errorReport);
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return false;
      
      // Test for context loss recovery
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) {
        console.log('✅ WebGL context loss recovery available');
      }
      
      return true;
    } catch (e) {
      console.error('❌ WebGL support check failed:', e);
      return false;
    }
  }

  private handleManualRecovery = () => {
    console.log('🔧 Manual recovery initiated');
    
    // Reset state completely
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
      lastErrorTime: 0
    });
  };

  private handleFallbackShape = () => {
    if (this.props.fallbackShape) {
      console.log(`🛡️ Loading fallback shape: ${this.props.fallbackShape}`);
      // Trigger fallback shape load
      window.dispatchEvent(new CustomEvent('loadFallbackShape', {
        detail: { shapeId: this.props.fallbackShape }
      }));
    }
    
    this.handleManualRecovery();
  };

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertDescription>
              <div className="space-y-3">
                <h3 className="font-semibold">Mathematical Computation Error</h3>
                <p className="text-sm">{this.state.error?.message}</p>
                {this.state.recoveryAttempts > 0 && (
                  <p className="text-xs opacity-75">
                    Recovery attempts: {this.state.recoveryAttempts}/{this.maxRecoveryAttempts}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-3">
            <Button onClick={this.handleManualRecovery} variant="outline">
              🔄 Retry
            </Button>
            
            {this.props.fallbackShape && (
              <Button onClick={this.handleFallbackShape}>
                🛡️ Load Safe Shape
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.reload()} 
              variant="secondary"
            >
              ♻️ Reload App
            </Button>
          </div>
          
          <details className="mt-4 text-xs opacity-60 max-w-lg">
            <summary className="cursor-pointer">Technical Details</summary>
            <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto max-h-32">
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
