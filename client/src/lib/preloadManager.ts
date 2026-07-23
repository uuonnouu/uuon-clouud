/**
 * Preload Manager - Priority-based shape preloading using requestIdleCallback
 * Intelligently preloads shapes during browser idle time
 */

type PreloadPriority = 'high' | 'medium' | 'low';

interface PreloadTask {
  id: string;
  shapeType: string;
  priority: PreloadPriority;
  callback: () => Promise<void>;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

export class PreloadManager {
  private static instance: PreloadManager;
  private queue: PreloadTask[] = [];
  private isProcessing = false;
  private completedTasks = new Set<string>();
  private maxConcurrent = 2;
  private activeCount = 0;
  
  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager();
    }
    return PreloadManager.instance;
  }
  
  /**
   * Add a shape to the preload queue
   */
  addToQueue(shapeType: string, priority: PreloadPriority, callback: () => Promise<void>): void {
    const id = `preload_${shapeType}_${Date.now()}`;
    
    if (this.completedTasks.has(shapeType)) {
      return; // Already preloaded
    }
    
    // Check if already in queue
    if (this.queue.some(task => task.shapeType === shapeType && task.status === 'pending')) {
      return;
    }
    
    const task: PreloadTask = {
      id,
      shapeType,
      priority,
      callback,
      status: 'pending'
    };
    
    // Insert by priority
    const insertIndex = this.queue.findIndex(t => this.getPriorityValue(t.priority) < this.getPriorityValue(priority));
    if (insertIndex === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(insertIndex, 0, task);
    }
    
    this.scheduleProcessing();
  }
  
  /**
   * Preload common shapes that users frequently access
   */
  preloadCommonShapes(): void {
    const commonShapes = [
      'sphere', 'torus', 'klein_bottle', 'mobius_strip',
      'trefoil_knot', 'seashell', 'dini_surface', 'gyroid'
    ];
    
    commonShapes.forEach((shape, index) => {
      const priority: PreloadPriority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
      this.addToQueue(shape, priority, async () => {
        // Placeholder - actual preload would generate geometry
        await new Promise(resolve => setTimeout(resolve, 10));
      });
    });
  }
  
  /**
   * Schedule processing using requestIdleCallback
   */
  private scheduleProcessing(): void {
    if (this.isProcessing || this.queue.length === 0) return;
    
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(
        (deadline: { timeRemaining: () => number }) => this.processQueue(deadline),
        { timeout: 2000 }
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => this.processQueue({ timeRemaining: () => 16 }), 100);
    }
  }
  
  /**
   * Process queue during idle time
   */
  private async processQueue(deadline: { timeRemaining: () => number }): Promise<void> {
    this.isProcessing = true;
    
    while (deadline.timeRemaining() > 5 && this.activeCount < this.maxConcurrent) {
      const nextTask = this.queue.find(t => t.status === 'pending');
      if (!nextTask) break;
      
      nextTask.status = 'loading';
      this.activeCount++;
      
      try {
        await nextTask.callback();
        nextTask.status = 'complete';
        this.completedTasks.add(nextTask.shapeType);
      } catch (error) {
        nextTask.status = 'error';
        console.warn(`Preload failed for ${nextTask.shapeType}:`, error);
      } finally {
        this.activeCount--;
      }
    }
    
    // Remove completed/error tasks
    this.queue = this.queue.filter(t => t.status === 'pending' || t.status === 'loading');
    
    this.isProcessing = false;
    
    // Continue processing if more tasks remain
    if (this.queue.some(t => t.status === 'pending')) {
      this.scheduleProcessing();
    }
  }
  
  /**
   * Get priority numeric value for sorting
   */
  private getPriorityValue(priority: PreloadPriority): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }
  
  /**
   * Get queue status
   */
  getStatus(): { pending: number; loading: number; completed: number } {
    return {
      pending: this.queue.filter(t => t.status === 'pending').length,
      loading: this.queue.filter(t => t.status === 'loading').length,
      completed: this.completedTasks.size
    };
  }
  
  /**
   * Clear the queue
   */
  clear(): void {
    this.queue = [];
    this.completedTasks.clear();
  }
}

export const preloadManager = PreloadManager.getInstance();
