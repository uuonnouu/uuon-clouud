
export class WebGLContextRecovery {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private contextLostListener: ((event: Event) => void) | null = null;
  private contextRestoredListener: ((event: Event) => void) | null = null;

  public setupContextRecovery(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    this.contextLostListener = (event: Event) => {
      console.warn('🚨 WebGL context lost, preventing default behavior');
      event.preventDefault();
      
      // Notify user of context loss
      const event_custom = new CustomEvent('webgl-context-lost');
      window.dispatchEvent(event_custom);
    };

    this.contextRestoredListener = (event: Event) => {
      console.log('✅ WebGL context restored, reinitializing');
      
      // Trigger reinitialization
      const event_custom = new CustomEvent('webgl-context-restored');
      window.dispatchEvent(event_custom);
    };

    canvas.addEventListener('webglcontextlost', this.contextLostListener);
    canvas.addEventListener('webglcontextrestored', this.contextRestoredListener);
  }

  public cleanup(): void {
    if (this.canvas && this.contextLostListener && this.contextRestoredListener) {
      this.canvas.removeEventListener('webglcontextlost', this.contextLostListener);
      this.canvas.removeEventListener('webglcontextrestored', this.contextRestoredListener);
    }
  }
}

export const webglRecovery = new WebGLContextRecovery();
