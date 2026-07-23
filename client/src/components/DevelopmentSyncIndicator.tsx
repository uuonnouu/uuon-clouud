
import React, { useState, useEffect } from 'react';
import { frontendSync } from '../lib/frontendSynchronization';

export function DevelopmentSyncIndicator() {
  const [syncStats, setSyncStats] = useState(frontendSync.getStats());
  const [lastUpdate, setLastUpdate] = useState('');
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');

  useEffect(() => {
    if (!isVisible) return;

    const handleSyncUpdate = (event: CustomEvent) => {
      const { reason, timestamp, count } = event.detail;
      setSyncStats(frontendSync.getStats());
      setLastUpdate(`${reason} at ${new Date(timestamp).toLocaleTimeString()}`);
    };

    window.addEventListener('frontendSyncUpdate', handleSyncUpdate as EventListener);

    // Update stats periodically
    const interval = setInterval(() => {
      setSyncStats(frontendSync.getStats());
    }, 1000);

    return () => {
      window.removeEventListener('frontendSyncUpdate', handleSyncUpdate as EventListener);
      clearInterval(interval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-green-500/30 text-xs font-mono text-green-400 z-50 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-green-300 font-bold">🔄 FRONTEND SYNC</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1 text-[10px]">
        <div>Updates: {syncStats.forcedUpdateCount}</div>
        <div>Callbacks: {syncStats.updateCallbacks}</div>
        <div>Last: {lastUpdate}</div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-green-500/20 space-y-1 text-[9px]">
        <div className="text-yellow-400">DEV HOTKEYS:</div>
        <div>Ctrl+Shift+R: Force refresh</div>
        <div>F12 → frontendSync.forceUpdate()</div>
      </div>
    </div>
  );
}
