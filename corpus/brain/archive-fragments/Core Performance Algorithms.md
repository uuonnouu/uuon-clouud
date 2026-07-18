**Core Performance Algorithms:**  
**1. RequestAnimationFrame Optimization**  
  
  
javascript  
animationId = requestAnimationFrame(animate);  
* **Browser-native 60fps sync** - no manual timing calculations  
* **Automatic throttling** when tab isn't visible (saves CPU)  
* **GPU acceleration** for canvas operations when available  
**2. Mathematical Pre-computation**  
  
  
javascript  
const angle = (time / planet.period) * 2 * Math.PI;  
*// Single calculation, reused for all coordinate systems*  
* **Trigonometric values calculated once** per planet per frame  
* **Shared angle calculations** across different pattern modes  
* **Eliminates redundant Math.cos/sin calls**  
**3. Trail Memory Management**  
  
  
javascript  
if (planet.trail.length > planet.maxTrail) {  
    planet.trail.shift(); *// O(n) but controlled size*  
}  
* **Fixed-size circular buffers** prevent memory bloat  
* **Staggered trail lengths** (Mercury: 300pts, Neptune: 1400pts)  
* **Memory stays constant** regardless of simulation time  
**4. Selective Update Algorithm**  
  
  
javascript  
if (Math.floor(time * 100) % 5 === 0) {  
    updateLiveData(); *// Only every 5th frame*  
}  
* **UI updates at 12fps** while animation runs at 60fps  
* **DOM manipulation separated** from canvas operations  
* **Prevents layout thrashing** in the browser  
**5. Canvas State Optimization**  
  
  
javascript  
ctx.globalAlpha = alpha;  
*// Batch operations, minimal state changes*  
ctx.globalAlpha = 1;  
* **Minimized context state changes** (expensive operations)  
* **Batched drawing operations** by type  
* **Single-pass rendering** - no multi-layer compositing  
