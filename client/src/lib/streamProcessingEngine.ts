
/**
 * STREAM PROCESSING ENGINE
 * Enables free-flow merger processing without blocking UI
 */

interface ProcessingStream {
  id: string;
  priority: number;
  processor: () => Promise<any>;
  onComplete?: (result: any) => void;
}

export class StreamProcessingEngine {
  private streams: ProcessingStream[] = [];
  private isProcessing = false;
  private maxConcurrent = 3;
  private activeStreams = 0;

  // Add shape processing to stream
  addToStream(id: string, processor: () => Promise<any>, priority = 1) {
    this.streams.push({
      id,
      priority,
      processor,
      onComplete: (result) => console.log(`✅ Processed: ${id}`)
    });

    // Sort by priority
    this.streams.sort((a, b) => b.priority - a.priority);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  private async startProcessing() {
    this.isProcessing = true;
    
    while (this.streams.length > 0) {
      // Process streams concurrently but limited
      while (this.activeStreams < this.maxConcurrent && this.streams.length > 0) {
        const stream = this.streams.shift();
        if (stream) {
          this.processStream(stream);
        }
      }
      
      // Wait for at least one stream to complete
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.isProcessing = false;
  }

  private async processStream(stream: ProcessingStream) {
    this.activeStreams++;
    
    try {
      const result = await stream.processor();
      stream.onComplete?.(result);
    } catch (error) {
      console.warn(`Stream ${stream.id} failed:`, error);
    } finally {
      this.activeStreams--;
    }
  }

  // Free flow methodology - process shapes as they come
  enableFreeFlow() {
    // Adaptive concurrent processing based on device capabilities
    const deviceCores = navigator.hardwareConcurrency || 4;
    this.maxConcurrent = Math.min(Math.max(deviceCores - 1, 2), 8);
    
    // Priority-based processing with idle frame optimization
    const scheduleProcessing = () => {
      if (this.streams.length > 0 && !this.isProcessing) {
        // Use different scheduling based on priority
        const hasHighPriority = this.streams.some(s => s.priority > 5);
        
        if (hasHighPriority) {
          // Immediate processing for high priority
          requestAnimationFrame(() => {
            this.startProcessing();
            scheduleProcessing();
          });
        } else {
          // Idle processing for normal priority
          requestIdleCallback((deadline) => {
            const startTime = performance.now();
            this.startProcessing();
            
            // Continue if we have time remaining
            if (deadline.timeRemaining() > 0 && performance.now() - startTime < 5) {
              scheduleProcessing();
            } else {
              setTimeout(scheduleProcessing, 16); // Next frame
            }
          }, { timeout: 100 });
        }
      }
    };
    
    scheduleProcessing();
    console.log(`🌊 Free flow processing enabled (${this.maxConcurrent} concurrent)`);
  }
}

export const streamProcessor = new StreamProcessingEngine();

// Enable free flow on load
streamProcessor.enableFreeFlow();
