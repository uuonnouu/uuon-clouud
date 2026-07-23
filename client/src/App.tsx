import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "@fontsource/inter";
import { preloadCriticalShapes } from './lib/lazyShapeLoader';
const MathVisualizer = lazy(() => import("./components/MathVisualizer"));
const SitemapTree = lazy(() => import("./components/SitemapTree"));
import SimpleMathEngine from "./components/SimpleMathEngine";
import { validateOnStartup } from "./lib/shapeRegistryValidator";
import { SystemMaintenance } from './lib/systemMaintenance';
import { publicReadinessMonitor } from './lib/publicReadinessMonitor';
import { frontendCleanup } from './lib/frontendCleanupSystem';
import { stabilityMonitor } from './lib/stabilityMonitor';
import './lib/equationVisualizationIntegration';
import { orchestrator } from './lib/systemIntegrationOrchestrator';
import { initializeShapeRegistry } from './lib/shapeRegistryInitializer';
import { interactionTokenGenerator } from './lib/interactionTokenGenerator';
import UUONTokenPanel from './components/UUONTokenPanel';
import { MetaMaskWalletPanel } from './components/MetaMaskWalletPanel';
import { useAuthStore } from './stores/authStore';

import './index.css';
import { Switch, Route, useLocation } from 'wouter';
import FormulaExplorer from './components/FormulaExplorer';
import OmniProofsPage from './pages/OmniProofsPage';
import FractalBiosystemVisualizer from './pages/FractalBiosystemVisualizer';
import ParameterLinkingPage from './pages/ParameterLinkingPage';
import BlockchainAlgorithmsPage from './pages/BlockchainAlgorithmsPage';
import NotFoundPage from './pages/not-found';
import FormulaBenefitsPage from './components/FormulaBenefitsPage';
import AboutPages from './components/AboutPages';
import LandingPage from './pages/LandingPage';
import MuseumPage from './pages/MuseumPage';
import ShapeDetailPage from './pages/ShapeDetailPage';
import ShapeContentPage from './pages/ShapeContentPage';
import ShowcasePortal from './pages/ShowcasePortal';
import ClouudTerminal from './pages/clouud-terminal';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

function App() {
  const [initialized, setInitialized] = useState(false);
  const [useSimpleEngine, setUseSimpleEngine] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [lastChange, setLastChange] = useState(Date.now());
  const [showSitemapTree, setShowSitemapTree] = useState(false);

  const { isAuthenticated, isAdmin, user, logout, checkAuth } = useAuthStore();

  // Check auth status on mount (for admin features, not required for entry)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Keyboard shortcut for sitemap tree toggle (Ctrl+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowSitemapTree(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Force frontend updates when changes occur - with throttling
  useEffect(() => {
    let updateTimeout: NodeJS.Timeout | null = null;

    const handleForceUpdate = () => {
      if (updateTimeout) return;

      console.log('🔄 Forcing frontend refresh');
      setForceRefresh(prev => prev + 1);
      setLastChange(Date.now());

      updateTimeout = setTimeout(() => {
        updateTimeout = null;
      }, 1000);
    };

    const handleParameterChange = () => {
      // Parameter changes must NOT remount MathVisualizer — only update lastChange
      // so consumers that read it as a prop get a re-render without unmounting.
      // forceRefresh (and therefore the key) must only change for full resets.
      setLastChange(Date.now());
    };

    const handleWebGLContextLoss = () => {
      console.warn('⚠️ WebGL context lost - attempting recovery');
      // Don't immediately force refresh - let the context recovery system handle it
      setLastChange(Date.now());
    };

    // Listen for frontend synchronization events
    window.addEventListener('forceUpdate', handleForceUpdate);
    window.addEventListener('parameterChange', handleParameterChange);
    window.addEventListener('webglcontextlost', handleWebGLContextLoss);
    window.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click issues

    // Listen for system sync updates from backend
    window.addEventListener('systemSyncUpdate', ((e: CustomEvent) => {
      console.log('🔄 System sync update received from backend');
      handleForceUpdate();
    }) as EventListener);

    return () => {
      window.removeEventListener('forceUpdate', handleForceUpdate);
      window.removeEventListener('parameterChange', handleParameterChange);
      window.removeEventListener('webglcontextlost', handleWebGLContextLoss);
    };
  }, []);

  // Initialize production readiness monitoring and cleanup system
  useEffect(() => {
    // Initialize systems that require DOM
    if (typeof window !== 'undefined') {
      // Lazy load heavy systems
      setTimeout(() => {
        import('./lib/uuon-gmod6-engine').then(({ integrateGMod6WithUUON }) => {
          integrateGMod6WithUUON();
        }).catch(console.warn);
      }, 3000);
    }

    // Add emergency cleanup trigger for severe performance issues
    const handleEmergencyCleanup = () => {
      console.log('🚨 Manual emergency cleanup triggered');
      frontendCleanup.emergencyCleanup();
    };

    window.addEventListener('emergencyCleanup', handleEmergencyCleanup);

    return () => {
      SystemMaintenance.stopMaintenanceSchedule();
      publicReadinessMonitor.stopMonitoring();
      window.removeEventListener('emergencyCleanup', handleEmergencyCleanup);
    };
  }, []);


  useEffect(() => {
    // Initialize shape registry first
    initializeShapeRegistry();

    if (!initialized) {
      // Preload critical shapes for MathVisualizer
      preloadCriticalShapes();
      validateOnStartup();
      setInitialized(true);

      // Track app initialization as an interaction
      interactionTokenGenerator.trackInteraction('shape_view', 'app_init');
    }
  }, [initialized]);

  // Track all meaningful user interactions for token generation
  useEffect(() => {
    const trackInteraction = (type: string, shapeId?: string) => {
      interactionTokenGenerator.trackInteraction(type, shapeId);
    };

    // Track mouse movements as canvas interactions (throttled)
    let lastCanvasTrack = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastCanvasTrack > 5000) { // Max once per 5 seconds
        trackInteraction('camera_movement');
        lastCanvasTrack = now;
      }
    };

    // Track clicks as interactions
    const handleClick = () => {
      trackInteraction('shape_view');
    };

    // Track keyboard as parameter changes
    const handleKeyPress = () => {
      trackInteraction('parameter_change');
    };

    // Track scroll as navigation
    const handleScroll = () => {
      trackInteraction('camera_movement');
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('keydown', handleKeyPress, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen bg-background text-foreground relative">
        {showSitemapTree ? (
          <SitemapErrorBoundary onClose={() => setShowSitemapTree(false)}>
            <Suspense fallback={<div className="flex items-center justify-center h-full bg-gray-900 text-white">Loading Sitemap Tree...</div>}>
              <div className="h-full relative">
                <button
                  onClick={() => setShowSitemapTree(false)}
                  className="absolute top-3 right-3 z-10 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Back to Visualizer
                </button>
                <SitemapTree />
              </div>
            </Suspense>
          </SitemapErrorBoundary>
        ) : (
          <>
            {/* User controls - top right corner */}
            <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
              {isAuthenticated && isAdmin && (
                <span className="px-2 py-1 bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white text-[10px] font-bold rounded-lg border border-amber-400/30 shadow-lg backdrop-blur-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  ADMIN
                </span>
              )}
              {isAuthenticated ? (
                <>
                  <span className="text-gray-400 text-[10px] bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {user?.username || 'Guest'}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="px-2 py-1 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-500 hover:to-red-600 text-white text-[10px] font-medium rounded-lg border border-red-400/30 shadow-lg backdrop-blur-sm flex items-center gap-1 transition-all"
                    title="Logout"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : null}
              <button
                onClick={() => setShowSitemapTree(true)}
                className="px-2 py-1 bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-500 hover:to-cyan-500 text-white text-[10px] font-medium rounded-lg border border-blue-400/30 shadow-lg backdrop-blur-sm flex items-center gap-1 transition-all"
                title="View Sitemap Hierarchy (Ctrl+Shift+S)"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Sitemap
              </button>
            </div>
            <ErrorBoundary key={`error-boundary-${forceRefresh}`}>
              <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-full bg-black text-white">
                <img 
                  src="/dmension-logo.png" 
                  alt="Δmension Loading" 
                  className="w-16 h-16 mb-4 animate-pulse opacity-80"
                />
                <div className="text-cyan-300">Loading Mathematical Universe...</div>
              </div>
            }>
                <MathVisualizer key={`math-visualizer-${forceRefresh}`} />
              </Suspense>
            </ErrorBoundary>
            {isAuthenticated && isAdmin && (
              <>
                <UUONTokenPanel />
                <MetaMaskWalletPanel />
              </>
            )}
          </>
        )}
      </div>
      <Switch>
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route path="/clouud" element={<ClouudTerminal />} />
          <Route path="/dmension-mathematical-universe" element={<iframe src="https://distinguished-rebirth-production.up.railway.app" style={{width:'100%',height:'100vh',border:'none'}} title="Dmension" />} />
          <Route path="/museum" element={<MuseumPage />} />
          <Route path="/shape/:shapeId" element={<ShapeDetailPage />} />
          <Route path="/shapes/:shapeId" element={<ShapeContentPage />} />
          <Route path="/showcase" element={<ShowcasePortal />} />
          <Route path="/formulas" element={<FormulaExplorer />} />
          <Route path="/omni-proofs" element={<OmniProofsPage />} />
          <Route path="/fractal-biosystem" element={<FractalBiosystemVisualizer />} />
          <Route path="/parameter-linking" element={<ParameterLinkingPage />} />
          <Route path="/blockchain-algorithms" element={<BlockchainAlgorithmsPage />} />
          <Route path="/formula-benefits" element={<FormulaBenefitsPage />} />
          <Route path="/sdk-portal" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">SDK Portal</h1><p>Developer SDK documentation and tools — coming soon.</p></div>} />
          <Route path="/about" element={<AboutPages />} />
          <Route path="/about/*" element={<AboutPages />} />
          <Route path="/api-docs" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">API Documentation</h1><p>Full API reference — coming soon.</p></div>} />
          <Route path="/documentation" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Documentation</h1><p>Platform documentation — coming soon.</p></div>} />
          <Route path="/tutorials" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Tutorials</h1><p>Step-by-step tutorials for using the platform.</p></div>} />
          <Route path="/gallery" element={<MuseumPage />} />
          <Route path="/community" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Community</h1><p>Connect with other users and researchers.</p></div>} />
          <Route path="/research" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Research</h1><p>Latest research and publications from the platform.</p></div>} />
          <Route path="/enterprise" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Enterprise</h1><p>Enterprise licensing and support — contact phillip@uuon.world.</p></div>} />
          <Route path="/categories" element={<MuseumPage />} />
          <Route path="/export" element={<div className="p-8 text-white bg-gray-900 min-h-screen"><h1 className="text-3xl font-bold mb-4">Export Options</h1><p>Export your mathematical visualizations in various formats.</p></div>} />
          <Route path="/explore" element={<MuseumPage />} />
          <Route path="*" element={<NotFoundPage />} />
      </Switch>
    </QueryClientProvider>
  );
}

// Error boundary for lazy-loaded SitemapTree chunk
class SitemapErrorBoundary extends React.Component<{children: React.ReactNode; onClose: () => void}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) {
    console.warn('SitemapTree failed to load:', error?.message || error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white gap-4">
          <p className="text-yellow-400 text-sm">Sitemap view failed to load.</p>
          <button
            onClick={this.props.onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Back to Visualizer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main application error boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean; errorMessage: string}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App Error:', error, errorInfo);

    // Force reload if WebGL context issues
    if (error?.message?.includes('WebGL') || error?.message?.includes('scene')) {
      console.log('🔄 WebGL error detected - forcing recovery in 5s');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }

  render() {
    if (this.state.hasError) {
      const isWebGL = this.state.errorMessage.includes('WebGL') || this.state.errorMessage.includes('scene');
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-950 text-white gap-4 p-8">
          <div className="text-2xl">⚠️</div>
          <p className="text-white font-semibold">{isWebGL ? 'Graphics context lost' : 'Something went wrong'}</p>
          <p className="text-gray-400 text-sm text-center max-w-md">
            {isWebGL
              ? 'The 3D renderer crashed. The page will reload automatically in 5 seconds.'
              : 'An unexpected error occurred in the visualizer.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm mt-2"
          >
            Reload now
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;