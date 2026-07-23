
/**
 * Lazy Loading System
 * Dynamically loads heavy dependencies only when needed
 */

class LazyLoader {
  private loadedModules = new Map<string, any>();

  async loadTransformers() {
    if (!this.loadedModules.has('transformers')) {
      try {
        // Only load in browser environment when actually needed
        if (typeof window !== 'undefined') {
          const transformers = await import('@xenova/transformers');
          this.loadedModules.set('transformers', transformers);
          return transformers;
        }
        return null;
      } catch (error) {
        console.warn('⚠️ Transformers not available in production:', error);
        return null;
      }
    }
    return this.loadedModules.get('transformers');
  }

  async loadOnnx() {
    if (!this.loadedModules.has('onnx')) {
      try {
        if (typeof window !== 'undefined') {
          const ort = await import('onnxruntime-web');
          this.loadedModules.set('onnx', ort);
          return ort;
        }
        return null;
      } catch (error) {
        console.warn('⚠️ ONNX not available in production:', error);
        return null;
      }
    }
    return this.loadedModules.get('onnx');
  }

  async loadThreeStdlib() {
    if (!this.loadedModules.has('three-stdlib')) {
      try {
        const stdlib = await import('three-stdlib');
        this.loadedModules.set('three-stdlib', stdlib);
        return stdlib;
      } catch (error) {
        console.warn('⚠️ Three-stdlib loading fallback mode');
        return this.createThreeStdlibFallback();
      }
    }
    return this.loadedModules.get('three-stdlib');
  }

  private createThreeStdlibFallback() {
    // Lightweight fallback for three-stdlib
    return {
      GLTFLoader: class MockGLTFLoader {
        load() { console.log('GLTF loading disabled in production'); }
      },
      OrbitControls: class MockOrbitControls {
        constructor() { console.log('OrbitControls fallback active'); }
      }
    };
  }
}

export const lazyLoader = new LazyLoader();
