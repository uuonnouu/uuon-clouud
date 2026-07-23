import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { activateMaximumViralPotential } from './lib/instantViralActivation'

// Polyfill for requestIdleCallback (Safari/iOS compatibility)
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  (window as any).requestIdleCallback = function(callback: IdleRequestCallback, options?: IdleRequestOptions) {
    const start = Date.now();
    return setTimeout(function() {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, options?.timeout || 1) as unknown as number;
  };
  (window as any).cancelIdleCallback = function(id: number) {
    clearTimeout(id);
  };
}

// 🚀 ACTIVATE INSTANT VIRAL DISCOVERY - NO LICENSING BARRIERS
setTimeout(() => {
  const viralMetrics = activateMaximumViralPotential();
  console.log('🌟 VIRAL SYSTEM ACTIVATED:', viralMetrics);
}, 1000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);