
// macOS-specific optimizations for Metal rendering and performance
class MacOptimizations {
  private isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  private hasMetalSupport = false;
  private retinaDPI = window.devicePixelRatio || 1;

  constructor() {
    this.detectHardware();
  }

  private detectHardware() {
    // Detect Metal support (WebGPU fallback)
    this.hasMetalSupport = 'gpu' in navigator;
    
    console.log(`🖥️ Platform: ${this.isMac ? 'macOS' : 'Other'}`);
    console.log(`⚡ Metal/WebGPU: ${this.hasMetalSupport ? 'Available' : 'Not available'}`);
    console.log(`📱 Retina DPI: ${this.retinaDPI}x`);
  }

  getOptimizedRenderSettings() {
    if (!this.isMac) {
      return {
        antialias: true,
        alpha: true,
        powerPreference: 'default'
      };
    }

    return {
      // macOS-specific optimizations
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance', // Use discrete GPU if available
      stencil: true,
      depth: true,
      logarithmicDepthBuffer: this.retinaDPI > 1, // Better depth on Retina
      // Enable hardware acceleration
      preserveDrawingBuffer: false, // Better performance
      failIfMajorPerformanceCaveat: false
    };
  }

  getOptimizedSegments() {
    if (!this.isMac) {
      return { uSegments: 32, vSegments: 16 };
    }

    // macOS can handle higher detail due to Metal acceleration
    const baseSegments = this.hasMetalSupport ? 64 : 48;
    const retinaMultiplier = this.retinaDPI > 1 ? 1.2 : 1;
    
    return {
      uSegments: Math.round(baseSegments * retinaMultiplier),
      vSegments: Math.round((baseSegments / 2) * retinaMultiplier)
    };
  }

  // Optimize for macOS memory management
  enableMemoryOptimizations() {
    if (!this.isMac) return;

    // Garbage collection hints for V8 on macOS
    if ('gc' in window) {
      // Suggest garbage collection during idle time
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting === false) {
          // Component not visible, safe to clean up
          requestIdleCallback(() => {
            // @ts-ignore
            if (typeof window.gc === 'function') window.gc();
          });
        }
      });

      const canvas = document.querySelector('canvas');
      if (canvas) observer.observe(canvas);
    }
  }

  // macOS-specific shader optimizations
  getOptimizedShaderSettings() {
    if (!this.isMac) {
      return { precision: 'mediump' };
    }

    return {
      precision: 'highp', // macOS GPUs can handle high precision
      extensions: [
        'OES_standard_derivatives',
        'EXT_shader_texture_lod',
        'WEBGL_depth_texture'
      ]
    };
  }

  // Optimize for macOS trackpad gestures
  setupMacGestures(controls: any) {
    if (!this.isMac) return;

    // Enhanced trackpad support
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    
    // macOS-specific gesture sensitivity
    controls.panSpeed = 1.5;
    controls.rotateSpeed = 1.2;
    controls.zoomSpeed = 2.0;
    
    // Smooth momentum for trackpad
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }
}

export const macOptimizations = new MacOptimizations();
