const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

let lastViewedShape = '';
let lastParameters: Record<string, any> = {};
let parameterDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let trackingBuffer: any[] = [];
let trackingFlushTimer: ReturnType<typeof setTimeout> | null = null;

// Batch tracking calls every 2 seconds to reduce network overhead
const flushTrackingBuffer = async () => {
  if (trackingBuffer.length === 0) return;
  
  const batch = [...trackingBuffer];
  trackingBuffer = [];
  
  try {
    await fetch('/api/tracking/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch })
    });
  } catch (error) {
    console.warn('Failed to flush tracking batch:', error);
  }
};

const scheduleFlush = () => {
  if (trackingFlushTimer) clearTimeout(trackingFlushTimer);
  trackingFlushTimer = setTimeout(flushTrackingBuffer, 2000);
};

export const trackingService = {
  trackShapeView: async (shapeType: string, parameters: Record<string, any>) => {
    if (shapeType === lastViewedShape) return;
    lastViewedShape = shapeType;
    
    trackingBuffer.push({
      type: 'view',
      shapeType,
      sessionId: SESSION_ID,
      timestamp: Date.now()
    });
    scheduleFlush();
  },

  trackParameterChange: async (
    shapeType: string, 
    parameterName: string, 
    oldValue: any, 
    newValue: any
  ) => {
    if (parameterDebounceTimer) {
      clearTimeout(parameterDebounceTimer);
    }
    
    parameterDebounceTimer = setTimeout(async () => {
      trackingBuffer.push({
        type: 'parameter_change',
        shapeType,
        parameterName,
        newValue,
        sessionId: SESSION_ID,
        timestamp: Date.now()
      });
      scheduleFlush();
    }, 1000);
  },

  trackExport: async (
    shapeId: string,
    exportType: string,
    parameters: Record<string, any>,
    options?: {
      dynamicsEmbedded?: any;
      materialSettings?: any;
      exportResolution?: string;
      fileSizeBytes?: number;
    }
  ) => {
    trackingBuffer.push({
      type: 'export',
      shapeId,
      exportType,
      sessionId: SESSION_ID,
      timestamp: Date.now()
    });
    // Flush exports immediately (important user action)
    await flushTrackingBuffer();
  },

  getStats: async () => {
    try {
      const response = await fetch('/api/tracking/stats');
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.warn('Failed to get tracking stats:', error);
      return null;
    }
  },

  updateLastParameters: (params: Record<string, any>) => {
    lastParameters = { ...params };
  },

  getSessionId: () => SESSION_ID
};

export default trackingService;
