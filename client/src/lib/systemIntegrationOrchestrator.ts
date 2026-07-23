
/**
 * DMENSION SYSTEM INTEGRATION ORCHESTRATOR
 * Coordinates all mathematical libraries and ensures proper functionality
 * Non-destructive enhancement to existing system
 */

import { COMPREHENSIVE_SHAPE_LIBRARY } from './shapeRegistryIntegration';
import { SHAPE_CATEGORIES } from './shapeCategories';

interface SystemState {
  backend: {
    connected: boolean;
    availableShapes: number;
    loadedFormulas: string[];
    responseTime: number;
  };
  frontend: {
    activeShape: string | null;
    renderingState: 'idle' | 'rendering' | 'error';
    fps: number;
    memoryUsage: number;
  };
  integration: {
    shapesImplemented: number;
    shapesRegistered: number;
    mismatches: string[];
    librariesConnected: number;
  };
}

class SystemIntegrationOrchestrator {
  private state: SystemState = {
    backend: {
      connected: false,
      availableShapes: 0,
      loadedFormulas: [],
      responseTime: 0
    },
    frontend: {
      activeShape: null,
      renderingState: 'idle',
      fps: 60,
      memoryUsage: 0
    },
    integration: {
      shapesImplemented: 0,
      shapesRegistered: 0,
      mismatches: [],
      librariesConnected: 0
    }
  };

  private listeners: Array<(state: SystemState) => void> = [];

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Dmension System Integration...');

    // Check backend connection
    await this.checkBackendConnection();

    // Validate shape libraries
    this.validateShapeLibraries();

    // Initialize performance monitoring
    this.initializePerformanceMonitoring();

    // Start health monitoring
    this.startHealthMonitoring();

    console.log('✅ System Integration Orchestrator Ready');
  }

  private async checkBackendConnection(): Promise<void> {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/health');
      const endTime = performance.now();

      if (response.ok) {
        const data = await response.json();
        this.state.backend.connected = true;
        this.state.backend.responseTime = endTime - startTime;
        this.state.backend.availableShapes = data.shapeCount || 0;
        this.state.backend.loadedFormulas = data.formulas || [];
        console.log('✅ Backend connected');
      }
    } catch (error) {
      console.log('⚠️ Backend not available, using frontend-only mode');
      this.state.backend.connected = false;
    }
  }

  private validateShapeLibraries(): void {
    const implementedShapes = Object.keys(COMPREHENSIVE_SHAPE_LIBRARY);
    const registeredShapes = SHAPE_CATEGORIES.flatMap(cat => cat.shapes);

    this.state.integration.shapesImplemented = implementedShapes.length;
    this.state.integration.shapesRegistered = registeredShapes.length;

    // Find mismatches
    const missingFromRegistry = implementedShapes.filter(shape => !registeredShapes.includes(shape));
    const missingImplementations = registeredShapes.filter(shape => !implementedShapes.includes(shape));

    this.state.integration.mismatches = [
      ...missingFromRegistry.map(s => `Missing from registry: ${s}`),
      ...missingImplementations.map(s => `Missing implementation: ${s}`)
    ];

    console.log(`📊 Shape Libraries: ${implementedShapes.length} implemented, ${registeredShapes.length} registered`);
    
    if (this.state.integration.mismatches.length > 0) {
      console.log(`⚠️ Found ${this.state.integration.mismatches.length} mismatches`);
      if (missingImplementations.length > 0 && missingImplementations.length <= 50) {
        console.log(`🔴 Missing implementations (${missingImplementations.length}):`, missingImplementations);
      }
    } else {
      console.log('✅ All shapes properly connected');
    }
  }

  private initializePerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        this.state.frontend.fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory monitoring
    setInterval(() => {
      if ('memory' in performance) {
        this.state.frontend.memoryUsage = Math.round(
          (performance as any).memory.usedJSHeapSize / 1024 / 1024
        );
      }
    }, 2000);
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      this.notifyListeners();
    }, 1000);
  }

  public trackActiveShape(shapeType: string): void {
    this.state.frontend.activeShape = shapeType;
    this.state.frontend.renderingState = 'rendering';
    
    // Verify shape exists
    if (!COMPREHENSIVE_SHAPE_LIBRARY[shapeType]) {
      console.warn(`⚠️ Shape not found: ${shapeType}`);
      this.state.frontend.renderingState = 'error';
    } else {
      setTimeout(() => {
        this.state.frontend.renderingState = 'idle';
      }, 100);
    }
  }

  public trackParameterChange(params: any): void {
    // Track parameter usage for optimization
    if (this.state.frontend.fps < 30) {
      console.log('⚠️ Low FPS detected - consider reducing mesh resolution');
    }
  }

  public getSystemReport(): string {
    const { backend, frontend, integration } = this.state;
    
    return `
=== DMENSION SYSTEM INTEGRATION REPORT ===

📡 BACKEND STATUS:
   Connected: ${backend.connected ? '✅' : '❌'}
   Response Time: ${backend.responseTime.toFixed(1)}ms
   Shapes Available: ${backend.availableShapes}
   Formulas Loaded: ${backend.loadedFormulas.length}

🎨 FRONTEND STATUS:
   Active Shape: ${frontend.activeShape || 'none'}
   Rendering: ${frontend.renderingState}
   FPS: ${frontend.fps}
   Memory: ${frontend.memoryUsage} MB

🔗 INTEGRATION STATUS:
   Shapes Implemented: ${integration.shapesImplemented}
   Shapes Registered: ${integration.shapesRegistered}
   Libraries Connected: ${Object.keys(COMPREHENSIVE_SHAPE_LIBRARY).length > 100 ? '✅' : '⚠️'}
   Mismatches: ${integration.mismatches.length}

${integration.mismatches.length > 0 ? `
⚠️ ISSUES FOUND:
${integration.mismatches.slice(0, 5).map(m => `   ${m}`).join('\n')}
${integration.mismatches.length > 5 ? `   ... and ${integration.mismatches.length - 5} more` : ''}
` : '✅ ALL SYSTEMS OPERATIONAL'}

Generated: ${new Date().toLocaleTimeString()}
    `.trim();
  }

  public subscribe(listener: (state: SystemState) => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public getState(): SystemState {
    return { ...this.state };
  }

  public async runSystemCheck(): Promise<void> {
    console.log('🔄 Running comprehensive system check...');
    
    await this.checkBackendConnection();
    this.validateShapeLibraries();
    
    const report = this.getSystemReport();
    console.log(report);
    
    // Performance recommendations
    if (this.state.frontend.fps < 30) {
      console.log('💡 Recommendation: Enable lazy loading for better performance');
    }
    
    if (this.state.integration.mismatches.length > 0) {
      console.log('💡 Recommendation: Run auto-registration to fix shape mismatches');
    }
    
    if (this.state.frontend.memoryUsage > 150) {
      console.log('💡 Recommendation: Implement geometry cleanup for memory optimization');
    }
  }
}

export const orchestrator = new SystemIntegrationOrchestrator();

// Auto-initialize when imported
orchestrator.initialize();

// Export for debugging
(window as any).orchestrator = orchestrator;
