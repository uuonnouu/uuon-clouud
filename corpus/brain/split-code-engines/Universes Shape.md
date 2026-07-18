# Universes Shape   
![Cosmic Geometry](Attachments/9E567A94-C50B-402A-9FE9-9CBA2DD89B33.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Cosmic Geometry Explorer</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');  
      
    body {  
      font-family: 'Space Grotesk', sans-serif;  
      margin: 0;  
      overflow-x: hidden;  
      background-color: #0f172a;  
      color: #f8fafc;  
    }  
      
    .cosmic-gradient {  
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);  
    }  
      
    .glassmorphism {  
      background: rgba(15, 23, 42, 0.7);  
      backdrop-filter: blur(10px);  
      border: 1px solid rgba(255, 255, 255, 0.1);  
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);  
    }  
      
    .parameter-slider {  
      -webkit-appearance: none;  
      height: 8px;  
      border-radius: 4px;  
      background: #334155;  
      outline: none;  
    }  
      
    .parameter-slider::-webkit-slider-thumb {  
      -webkit-appearance: none;  
      width: 20px;  
      height: 20px;  
      border-radius: 50%;  
      background: #60a5fa;  
      cursor: pointer;  
      border: 2px solid #f8fafc;  
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);  
    }  
      
    .parameter-slider::-moz-range-thumb {  
      width: 20px;  
      height: 20px;  
      border-radius: 50%;  
      background: #60a5fa;  
      cursor: pointer;  
      border: 2px solid #f8fafc;  
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);  
    }  
      
    .universe-card {  
      transition: all 0.3s ease;  
    }  
      
    .universe-card:hover {  
      transform: translateY(-5px);  
    }  
      
    .probability-bar {  
      height: 8px;  
      border-radius: 4px;  
      transition: width 1s ease;  
    }  
      
    .calculate-btn {  
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);  
      transition: all 0.3s ease;  
    }  
      
    .calculate-btn:hover {  
      transform: translateY(-2px);  
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);  
    }  
      
    .calculate-btn:active {  
      transform: translateY(0);  
    }  
      
    @keyframes pulse {  
      0% { transform: scale(1); opacity: 0.8; }  
      50% { transform: scale(1.05); opacity: 1; }  
      100% { transform: scale(1); opacity: 0.8; }  
    }  
      
    .pulse {  
      animation: pulse 2s infinite ease-in-out;  
    }  
      
    canvas {  
      display: block;  
      position: fixed;  
      top: 0;  
      left: 0;  
      z-index: -1;  
    }  
      
    .algorithm-card {  
      transition: all 0.3s ease;  
    }  
      
    .algorithm-card:hover {  
      transform: translateY(-5px);  
      box-shadow: 0 15px 30px -10px rgba(59, 130, 246, 0.3);  
    }  
      
    .tooltip {  
      position: relative;  
      display: inline-block;  
      cursor: help;  
    }  
      
    .tooltip .tooltip-text {  
      visibility: hidden;  
      width: 200px;  
      background-color: rgba(15, 23, 42, 0.95);  
      color: #f8fafc;  
      text-align: center;  
      border-radius: 6px;  
      padding: 8px;  
      position: absolute;  
      z-index: 1;  
      bottom: 125%;  
      left: 50%;  
      margin-left: -100px;  
      opacity: 0;  
      transition: opacity 0.3s;  
      font-size: 0.875rem;  
      border: 1px solid rgba(96, 165, 250, 0.3);  
    }  
      
    .tooltip:hover .tooltip-text {  
      visibility: visible;  
      opacity: 1;  
    }  
  </style>  
</head>  
<body>  
  <canvas id="cosmicCanvas"></canvas>  
    
  <div class="relative z-10">  
    <header class="py-12">  
      <div class="max-w-7xl mx-auto px-6">  
        <div class="glassmorphism rounded-2xl p-8 text-center">  
          <h1 class="text-4xl md:text-5xl font-bold mb-4 cosmic-gradient bg-clip-text text-transparent">  
            Cosmic Geometry Explorer  
          </h1>  
          <p class="text-lg text-blue-200 max-w-3xl mx-auto">  
            Visualizing universe geometry predictions using Euler's probability algorithm and the golden ratio (φ)  
          </p>  
        </div>  
      </div>  
    </header>  
  
    <main class="max-w-7xl mx-auto px-6 py-8 space-y-12">  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">  
        <!-- Parameters Panel -->  
        <div class="lg:col-span-1">  
          <div class="glassmorphism rounded-xl p-6 shadow-xl">  
            <h2 class="text-2xl font-bold mb-6 text-blue-300">Cosmic Parameters</h2>  
              
            <div class="space-y-6">  
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Hubble Constant (km/s/Mpc)</label>  
                  <span id="hubbleValue" class="text-white font-medium">70</span>  
                </div>  
                <input type="range" id="hubbleConstant" min="50" max="90" value="70" step="0.1"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Matter Density (Ω<sub>m</sub>)</label>  
                  <span id="matterValue" class="text-white font-medium">0.31</span>  
                </div>  
                <input type="range" id="matterDensity" min="0.1" max="0.5" value="0.31" step="0.01"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Dark Energy Density (Ω<sub>Λ</sub>)</label>  
                  <span id="darkEnergyValue" class="text-white font-medium">0.69</span>  
                </div>  
                <input type="range" id="darkEnergyDensity" min="0.5" max="0.9" value="0.69" step="0.01"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Radiation Density (Ω<sub>r</sub>)</label>  
                  <span id="radiationValue" class="text-white font-medium">0.0001</span>  
                </div>  
                <input type="range" id="radiationDensity" min="0.0001" max="0.01" value="0.0001" step="0.0001"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Observational Error (σ)</label>  
                  <span id="errorValue" class="text-white font-medium">0.05</span>  
                </div>  
                <input type="range" id="observationalError" min="0.01" max="0.1" value="0.05" step="0.01"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div class="pt-4">  
                <div class="flex justify-between mb-2">  
                  <span class="text-blue-200">Total Density (Ω<sub>total</sub>)</span>  
                  <span id="totalDensity" class="text-white font-medium">1.0001</span>  
                </div>  
                <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">  
                  <div id="densityIndicator" class="h-full bg-gradient-to-r from-green-400 to-blue-500" style="width: 50%"></div>  
                </div>  
                <div class="flex justify-between text-xs mt-1">  
                  <span class="text-green-400">Open (Ω < 1)</span>  
                  <span class="text-blue-400">Flat (Ω = 1)</span>  
                  <span class="text-pink-400">Closed (Ω > 1)</span>  
                </div>  
              </div>  
                
              <button id="calculateBtn" class="calculate-btn w-full py-3 px-6 rounded-lg text-white font-bold shadow-lg mt-4">  
                Calculate Universe Shape  
              </button>  
            </div>  
          </div>  
            
          <!-- Algorithm Explanation -->  
          <div class="glassmorphism rounded-xl p-6 shadow-xl mt-8">  
            <h2 class="text-2xl font-bold mb-4 text-blue-300">Algorithm Insights</h2>  
              
            <div class="space-y-4">  
              <div class="algorithm-card bg-slate-800/50 p-4 rounded-lg border border-blue-900/30">  
                <h3 class="font-bold text-blue-200">Bayesian Probability</h3>  
                <p class="text-sm text-blue-100">Uses Gaussian distributions (Euler's normal approximation) to calculate probability based on deviation from target values.</p>  
              </div>  
                
              <div class="algorithm-card bg-slate-800/50 p-4 rounded-lg border border-blue-900/30">  
                <h3 class="font-bold text-blue-200">Euler's Correction Factor</h3>  
                <p class="text-sm text-blue-100">Applies Euler's number (e ≈ 2.718) as a geometric bias correction factor in probability calculations.</p>  
              </div>  
                
              <div class="algorithm-card bg-slate-800/50 p-4 rounded-lg border border-blue-900/30">  
                <h3 class="font-bold text-blue-200">Golden Ratio Integration</h3>  
                <p class="text-sm text-blue-100">Incorporates the golden ratio (φ ≈ 1.618) in the visualization pattern, reflecting natural cosmic structures.</p>  
              </div>  
            </div>  
          </div>  
        </div>  
          
        <!-- Results and Visualization -->  
        <div class="lg:col-span-2 space-y-6">  
          <!-- Visualization -->  
          <div class="glassmorphism rounded-xl p-6 shadow-xl">  
            <div class="flex justify-between items-center mb-4">  
              <h2 class="text-2xl font-bold text-blue-300">Universe Visualization</h2>  
              <div class="flex items-center">  
                <span class="text-blue-200 mr-2">TON 618</span>  
                <div class="tooltip">  
                  <i class="fas fa-info-circle text-blue-400"></i>  
                  <span class="tooltip-text">One of the largest known black holes, with mass ~66 billion times that of our Sun</span>  
                </div>  
              </div>  
            </div>  
              
            <div id="universeVisualization" class="relative bg-slate-900/80 rounded-xl overflow-hidden" style="height: 400px;">  
              <canvas id="geometryCanvas" class="absolute inset-0"></canvas>  
              <div id="geometryOverlay" class="absolute inset-0 flex items-center justify-center">  
                <div id="geometryInfo" class="text-center p-4 rounded-lg bg-slate-900/80 backdrop-blur-sm">  
                  <h3 id="selectedGeometryName" class="text-xl font-bold text-white mb-2">Calculating...</h3>  
                  <p id="selectedGeometryDescription" class="text-blue-200">Analyzing cosmic parameters...</p>  
                </div>  
              </div>  
            </div>  
          </div>  
            
          <!-- Probability Results -->  
          <div class="glassmorphism rounded-xl p-6 shadow-xl">  
            <h2 class="text-2xl font-bold mb-6 text-blue-300">Probability Distribution</h2>  
              
            <div id="geometriesContainer" class="space-y-4">  
              <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
              <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
              <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
            </div>  
          </div>  
            
          <!-- Scientific Explanation -->  
          <div class="glassmorphism rounded-xl p-6 shadow-xl">  
            <h2 class="text-2xl font-bold mb-4 text-blue-300">Scientific Explanation</h2>  
              
            <div class="space-y-4">  
              <p class="text-blue-100">  
                The shape of our universe is determined by its total energy density (Ω). When Ω = 1, space is flat (Euclidean). When Ω > 1, space curves back on itself like a sphere. When Ω < 1, space curves outward like a saddle.  
              </p>  
                
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">  
                <div class="bg-slate-800/50 p-4 rounded-lg border border-blue-500/30">  
                  <h3 class="font-bold text-blue-300 mb-2">Flat Universe</h3>  
                  <p class="text-sm text-blue-100">Parallel lines remain parallel forever. Space extends infinitely and follows Euclidean geometry.</p>  
                </div>  
                  
                <div class="bg-slate-800/50 p-4 rounded-lg border border-pink-500/30">  
                  <h3 class="font-bold text-pink-300 mb-2">Closed Universe</h3>  
                  <p class="text-sm text-blue-100">Parallel lines eventually converge. Space is finite but unbounded, like the surface of a sphere.</p>  
                </div>  
                  
                <div class="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">  
                  <h3 class="font-bold text-green-300 mb-2">Open Universe</h3>  
                  <p class="text-sm text-blue-100">Parallel lines diverge. Space has negative curvature and expands at an accelerating rate forever.</p>  
                </div>  
              </div>  
                
              <p class="text-blue-100">  
                Current observations suggest our universe is remarkably close to flat (Ω ≈ 1), but the exact value remains one of cosmology's greatest questions.  
              </p>  
            </div>  
          </div>  
        </div>  
      </div>  
    </main>  
  
    <footer class="mt-16 glassmorphism mx-6 rounded-t-xl p-6">  
      <div class="max-w-7xl mx-auto text-center">  
        <p class="text-blue-300 mb-2">  
          Cosmic Geometry Explorer  
        </p>  
        <p class="text-sm text-blue-400">  
          Combining Euler's probability algorithm with golden ratio (φ) visualization for universe shape prediction  
        </p>  
      </div>  
    </footer>  
  </div>  
  
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>  
  <script>  
    // Background Canvas  
    const canvas = document.getElementById("cosmicCanvas");  
    const ctx = canvas.getContext("2d");  
  
    let w = canvas.width = window.innerWidth;  
    let h = canvas.height = window.innerHeight;  
  
    window.addEventListener('resize', () => {  
      w = canvas.width = window.innerWidth;  
      h = canvas.height = window.innerHeight;  
      center = { x: w / 2, y: h / 2 };  
        
      // Reset particles when window resizes  
      particles.forEach((p, i) => {  
        p.angle = i * 137.5 * (Math.PI / 180);  
        p.reset();  
      });  
    });  
  
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio  
    let center = { x: w / 2, y: h / 2 };  
    const particles = [];  
  
    class Particle {  
      constructor(i) {  
        this.angle = i * 137.5 * (Math.PI / 180); // Approx Golden Angle in radians  
        this.radius = i * 2;  
        this.size = 1 + (i % 3);  
        this.color = `hsl(${i * 3 % 360}, 100%, 70%)`;  
        this.reset();  
      }  
  
      reset() {  
        this.x = center.x + this.radius * Math.cos(this.angle);  
        this.y = center.y + this.radius * Math.sin(this.angle);  
        this.life = 1;  
        this.direction = 1; // 1 = expand, -1 = collapse  
      }  
  
      update() {  
        this.radius += this.direction * 0.5;  
        if (this.radius > Math.min(w, h) / 2 || this.radius < 2) {  
          this.direction *= -1; // Reverse direction at limits  
        }  
        this.x = center.x + this.radius * Math.cos(this.angle);  
        this.y = center.y + this.radius * Math.sin(this.angle);  
      }  
  
      draw() {  
        ctx.beginPath();  
        ctx.fillStyle = this.color;  
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  
        ctx.fill();  
      }  
    }  
  
    // Generate spiral particles  
    for (let i = 0; i < 500; i++) {  
      particles.push(new Particle(i));  
    }  
  
    function animateBackground() {  
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)";  
      ctx.fillRect(0, 0, w, h);  
  
      // Draw singularity core (TON 618)  
      ctx.beginPath();  
      ctx.fillStyle = "white";  
      ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);  
      ctx.fill();  
  
      // Update & draw particles  
      particles.forEach(p => {  
        p.update();  
        p.draw();  
      });  
  
      requestAnimationFrame(animateBackground);  
    }  
  
    animateBackground();  
      
    // Geometry Canvas  
    const geometryCanvas = document.getElementById("geometryCanvas");  
    const gctx = geometryCanvas.getContext("2d");  
      
    function resizeGeometryCanvas() {  
      const container = document.getElementById("universeVisualization");  
      geometryCanvas.width = container.offsetWidth;  
      geometryCanvas.height = container.offsetHeight;  
    }  
      
    window.addEventListener('resize', resizeGeometryCanvas);  
    resizeGeometryCanvas();  
      
    // State management  
    const state = {  
      parameters: {  
        hubbleConstant: 70,  
        matterDensity: 0.31,  
        darkEnergyDensity: 0.69,  
        radiationDensity: 0.0001,  
        observationalError: 0.05  
      },  
      geometries: [],  
      isCalculating: false,  
      selectedGeometry: null,  
      animationFrame: null  
    };  
      
    // DOM Elements  
    const hubbleSlider = document.getElementById('hubbleConstant');  
    const matterSlider = document.getElementById('matterDensity');  
    const darkEnergySlider = document.getElementById('darkEnergyDensity');  
    const radiationSlider = document.getElementById('radiationDensity');  
    const errorSlider = document.getElementById('observationalError');  
    const calculateBtn = document.getElementById('calculateBtn');  
    const geometriesContainer = document.getElementById('geometriesContainer');  
    const selectedGeometryName = document.getElementById('selectedGeometryName');  
    const selectedGeometryDescription = document.getElementById('selectedGeometryDescription');  
    const totalDensityDisplay = document.getElementById('totalDensity');  
    const densityIndicator = document.getElementById('densityIndicator');  
      
    // Value displays  
    const hubbleValue = document.getElementById('hubbleValue');  
    const matterValue = document.getElementById('matterValue');  
    const darkEnergyValue = document.getElementById('darkEnergyValue');  
    const radiationValue = document.getElementById('radiationValue');  
    const errorValue = document.getElementById('errorValue');  
      
    // Euler's probability-inspired algorithm for universe geometry prediction  
    const eulerProbabilityAlgorithm = (params) => {  
      const { matterDensity, darkEnergyDensity, radiationDensity, observationalError } = params;  
        
      // Calculate critical density parameter Omega_total  
      const omegaTotal = matterDensity + darkEnergyDensity + radiationDensity;  
        
      // Define universe geometries  
      const baseGeometries = [  
        {  
          name: "Flat Universe (Euclidean)",  
          curvature: 0,  
          omega: 1.0,  
          description: "Infinite, flat geometry where parallel lines never meet. Space extends forever and follows the rules of Euclidean geometry.",  
          color: "#64b5f6"  
        },  
        {  
          name: "Closed Universe (Spherical)",   
          curvature: 1,  
          omega: 1.1,  
          description: "Finite, curved like a sphere, may eventually collapse. In this geometry, parallel lines eventually converge.",  
          color: "#f06292"  
        },  
        {  
          name: "Open Universe (Hyperbolic)",  
          curvature: -1,  
          omega: 0.9,  
          description: "Infinite, saddle-shaped, expands forever. In this geometry, parallel lines diverge and space has negative curvature.",  
          color: "#81c784"  
        }  
      ];  
  
      // Euler's probability calculation using Bayesian approach  
      const calculateEulerProbability = (targetOmega, actualOmega, error) => {  
        // Euler's exponential probability function modified for cosmology  
        const deviation = Math.abs(targetOmega - actualOmega);  
        const sigma = error;  
          
        // Gaussian probability distribution (Euler's normal approximation)  
        const probability = Math.exp(-0.5 * Math.pow(deviation / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));  
          
        // Normalize and apply Euler's correction factor  
        const eulerCorrection = 1 + (deviation * Math.E / 10); // Euler's number influence  
        return probability / eulerCorrection;  
      };  
  
      // Calculate probabilities for each geometry  
      const calculatedGeometries = baseGeometries.map(geometry => {  
        const probability = calculateEulerProbability(geometry.omega, omegaTotal, observationalError);  
          
        return {  
          ...geometry,  
          probability: probability  
        };  
      });  
  
      // Normalize probabilities to sum to 1 (Euler's normalization principle)  
      const totalProbability = calculatedGeometries.reduce((sum, geo) => sum + geo.probability, 0);  
      const normalizedGeometries = calculatedGeometries.map(geo => ({  
        ...geo,  
        probability: geo.probability / totalProbability  
      }));  
  
      // Sort by probability (highest first)  
      return normalizedGeometries.sort((a, b) => b.probability - a.probability);  
    };  
      
    // Update total density display  
    const updateTotalDensity = () => {  
      const { matterDensity, darkEnergyDensity, radiationDensity } = state.parameters;  
      const total = matterDensity + darkEnergyDensity + radiationDensity;  
      totalDensityDisplay.textContent = total.toFixed(4);  
        
      // Update density indicator  
      // Map total from 0.9-1.1 range to 0-100% width  
      const percentage = ((total - 0.9) / 0.2) * 100;  
      const clampedPercentage = Math.max(0, Math.min(100, percentage));  
      densityIndicator.style.width = `${clampedPercentage}%`;  
        
      // Update color based on value  
      if (total < 0.98) {  
        densityIndicator.className = "h-full bg-green-500";  
      } else if (total > 1.02) {  
        densityIndicator.className = "h-full bg-pink-500";  
      } else {  
        densityIndicator.className = "h-full bg-blue-500";  
      }  
    };  
      
    // Draw flat universe geometry  
    const drawFlatUniverse = (ctx, width, height, color) => {  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const gridSize = Math.min(width, height) * 0.8;  
      const cellSize = gridSize / 8;  
        
      ctx.strokeStyle = color;  
      ctx.lineWidth = 1.5;  
        
      // Draw grid  
      for (let i = -4; i <= 4; i++) {  
        // Horizontal lines  
        ctx.beginPath();  
        ctx.moveTo(centerX - gridSize/2, centerY + i * cellSize);  
        ctx.lineTo(centerX + gridSize/2, centerY + i * cellSize);  
        ctx.stroke();  
          
        // Vertical lines  
        ctx.beginPath();  
        ctx.moveTo(centerX + i * cellSize, centerY - gridSize/2);  
        ctx.lineTo(centerX + i * cellSize, centerY + gridSize/2);  
        ctx.stroke();  
      }  
        
      // Draw parallel lines to demonstrate flatness  
      ctx.strokeStyle = `${color}`;  
      ctx.lineWidth = 3;  
        
      ctx.beginPath();  
      ctx.moveTo(centerX - gridSize/3, centerY - gridSize/4);  
      ctx.lineTo(centerX + gridSize/3, centerY - gridSize/4);  
      ctx.stroke();  
        
      ctx.beginPath();  
      ctx.moveTo(centerX - gridSize/3, centerY + gridSize/4);  
      ctx.lineTo(centerX + gridSize/3, centerY + gridSize/4);  
      ctx.stroke();  
    };  
      
    // Draw closed universe geometry  
    const drawClosedUniverse = (ctx, width, height, color) => {  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const radius = Math.min(width, height) * 0.35;  
        
      // Draw sphere  
      const gradient = ctx.createRadialGradient(  
        centerX - radius/3, centerY - radius/3, 0,  
        centerX, centerY, radius  
      );  
      gradient.addColorStop(0, "#ffffff");  
      gradient.addColorStop(1, `${color}80`);  
        
      ctx.fillStyle = gradient;  
      ctx.beginPath();  
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);  
      ctx.fill();  
        
      // Draw longitude lines  
      ctx.strokeStyle = `${color}`;  
      ctx.lineWidth = 1.5;  
        
      for (let i = 0; i < 8; i++) {  
        const angle = (i / 8) * Math.PI;  
        ctx.beginPath();  
        ctx.ellipse(centerX, centerY, radius * Math.cos(angle), radius, 0, 0, Math.PI * 2);  
        ctx.stroke();  
      }  
        
      // Draw latitude lines  
      for (let i = 1; i < 4; i++) {  
        const latRadius = radius * (i / 4);  
        ctx.beginPath();  
        ctx.arc(centerX, centerY, latRadius, 0, Math.PI * 2);  
        ctx.stroke();  
      }  
        
      // Draw converging lines to demonstrate closed geometry  
      ctx.strokeStyle = `${color}`;  
      ctx.lineWidth = 3;  
        
      // First line (left to top)  
      ctx.beginPath();  
      ctx.moveTo(centerX - radius * 0.7, centerY);  
      ctx.quadraticCurveTo(centerX - radius * 0.3, centerY - radius * 0.5, centerX, centerY - radius * 0.7);  
      ctx.stroke();  
        
      // Second line (right to top)  
      ctx.beginPath();  
      ctx.moveTo(centerX + radius * 0.7, centerY);  
      ctx.quadraticCurveTo(centerX + radius * 0.3, centerY - radius * 0.5, centerX, centerY - radius * 0.7);  
      ctx.stroke();  
    };  
      
    // Draw open universe geometry  
    const drawOpenUniverse = (ctx, width, height, color) => {  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.8;  
        
      // Draw hyperbolic surface  
      ctx.strokeStyle = `${color}`;  
      ctx.lineWidth = 1.5;  
        
      // Draw saddle shape  
      for (let i = -10; i <= 10; i++) {  
        const xOffset = (i / 10) * size/2;  
          
        // Horizontal curves  
        ctx.beginPath();  
        ctx.moveTo(centerX - size/2, centerY + xOffset);  
          
        for (let x = -size/2; x <= size/2; x += 10) {  
          const normalizedX = x / (size/2);  
          const y = xOffset * (1 - normalizedX * normalizedX) * 0.5;  
          ctx.lineTo(centerX + x, centerY + y);  
        }  
        ctx.stroke();  
          
        // Vertical curves  
        ctx.beginPath();  
        ctx.moveTo(centerX + xOffset, centerY - size/2);  
          
        for (let y = -size/2; y <= size/2; y += 10) {  
          const normalizedY = y / (size/2);  
          const x = xOffset * (1 - normalizedY * normalizedY) * 0.5;  
          ctx.lineTo(centerX + x, centerY + y);  
        }  
        ctx.stroke();  
      }  
        
      // Draw diverging lines to demonstrate open geometry  
      ctx.strokeStyle = `${color}`;  
      ctx.lineWidth = 3;  
        
      // First line  
      ctx.beginPath();  
      ctx.moveTo(centerX, centerY - size/6);  
      ctx.quadraticCurveTo(centerX - size/6, centerY, centerX - size/3, centerY + size/6);  
      ctx.stroke();  
        
      // Second line  
      ctx.beginPath();  
      ctx.moveTo(centerX, centerY - size/6);  
      ctx.quadraticCurveTo(centerX + size/6, centerY, centerX + size/3, centerY + size/6);  
      ctx.stroke();  
    };  
      
    // Update geometry visualization  
    const updateVisualization = (geometry) => {  
      if (!geometry) return;  
        
      // Clear canvas  
      const width = geometryCanvas.width;  
      const height = geometryCanvas.height;  
      gctx.clearRect(0, 0, width, height);  
        
      // Cancel any existing animation  
      if (state.animationFrame) {  
        cancelAnimationFrame(state.animationFrame);  
      }  
        
      // Draw based on geometry type  
      if (geometry.curvature === 0) {  
        // Flat universe  
        drawFlatUniverse(gctx, width, height, geometry.color);  
      } else if (geometry.curvature === 1) {  
        // Closed universe  
        drawClosedUniverse(gctx, width, height, geometry.color);  
      } else {  
        // Open universe  
        drawOpenUniverse(gctx, width, height, geometry.color);  
      }  
        
      // Add phi-based particles  
      const phiParticles = [];  
      const particleCount = 100;  
      const centerX = width / 2;  
      const centerY = height / 2;  
        
      for (let i = 0; i < particleCount; i++) {  
        const angle = i * phi * Math.PI;  
        const radius = Math.sqrt(i) * 3;  
        phiParticles.push({  
          x: centerX + Math.cos(angle) * radius,  
          y: centerY + Math.sin(angle) * radius,  
          size: Math.random() * 2 + 1,  
          color: geometry.color,  
          speed: 0.1 + Math.random() * 0.2  
        });  
      }  
        
      // Animate phi particles  
      function animatePhiParticles() {  
        // Fade existing content slightly  
        gctx.fillStyle = "rgba(15, 23, 42, 0.1)";  
        gctx.fillRect(0, 0, width, height);  
          
        // Redraw base geometry  
        if (geometry.curvature === 0) {  
          drawFlatUniverse(gctx, width, height, geometry.color);  
        } else if (geometry.curvature === 1) {  
          drawClosedUniverse(gctx, width, height, geometry.color);  
        } else {  
          drawOpenUniverse(gctx, width, height, geometry.color);  
        }  
          
        // Draw and update particles  
        phiParticles.forEach(particle => {  
          // Draw particle  
          gctx.beginPath();  
          gctx.fillStyle = particle.color + "80";  
          gctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);  
          gctx.fill();  
            
          // Update position - move outward in spiral  
          const dx = particle.x - centerX;  
          const dy = particle.y - centerY;  
          const distance = Math.sqrt(dx * dx + dy * dy);  
          const angle = Math.atan2(dy, dx);  
            
          // Move outward and rotate slightly  
          const newDistance = distance + particle.speed;  
          const newAngle = angle + 0.01;  
            
          particle.x = centerX + Math.cos(newAngle) * newDistance;  
          particle.y = centerY + Math.sin(newAngle) * newDistance;  
            
          // Reset if out of bounds  
          if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height) {  
            const resetAngle = Math.random() * Math.PI * 2;  
            const resetRadius = Math.random() * 10;  
            particle.x = centerX + Math.cos(resetAngle) * resetRadius;  
            particle.y = centerY + Math.sin(resetAngle) * resetRadius;  
          }  
        });  
          
        state.animationFrame = requestAnimationFrame(animatePhiParticles);  
      }  
        
      // Start animation  
      animatePhiParticles();  
    };  
      
    // Update geometry cards  
    const updateGeometryCards = (geometries) => {  
      geometriesContainer.innerHTML = '';  
        
      geometries.forEach(geometry => {  
        const card = document.createElement('div');  
        card.className = 'universe-card flex items-center p-4 rounded-lg cursor-pointer';  
        card.style.backgroundColor = `${geometry.color}20`; // Using hex with alpha  
        card.style.borderLeft = `4px solid ${geometry.color}`;  
          
        // Format probability as percentage  
        const probabilityPercent = (geometry.probability * 100).toFixed(1);  
          
        card.innerHTML = `  
          <div class="flex-1">  
            <h3 class="font-bold text-white">${geometry.name}</h3>  
            <div class="mt-2 w-full bg-slate-700 rounded-full h-2 overflow-hidden">  
              <div class="probability-bar" style="width: ${probabilityPercent}%; background-color: ${geometry.color}"></div>  
            </div>  
          </div>  
          <div class="ml-4 text-right">  
            <span class="text-xl font-bold text-white">${probabilityPercent}%</span>  
          </div>  
        `;  
          
        card.addEventListener('click', () => {  
          state.selectedGeometry = geometry;  
          updateSelectedGeometry();  
            
          // Highlight selected card  
          document.querySelectorAll('.universe-card').forEach(c => {  
            c.classList.remove('ring-2', 'ring-white');  
          });  
          card.classList.add('ring-2', 'ring-white');  
        });  
          
        geometriesContainer.appendChild(card);  
      });  
    };  
      
    // Update selected geometry display  
    const updateSelectedGeometry = () => {  
      if (!state.selectedGeometry) return;  
        
      selectedGeometryName.textContent = state.selectedGeometry.name;  
      selectedGeometryDescription.textContent = state.selectedGeometry.description;  
      updateVisualization(state.selectedGeometry);  
    };  
      
    // Run prediction  
    const runPrediction = async () => {  
      state.isCalculating = true;  
      calculateBtn.disabled = true;  
      calculateBtn.textContent = 'Calculating...';  
        
      // Show loading state  
      geometriesContainer.innerHTML = `  
        <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
        <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
        <div class="animate-pulse bg-slate-700 h-16 rounded-lg"></div>  
      `;  
        
      selectedGeometryName.textContent = 'Calculating...';  
      selectedGeometryDescription.textContent = 'Analyzing cosmic parameters...';  
        
      // Simulate calculation time for dramatic effect  
      await new Promise(resolve => setTimeout(resolve, 1500));  
        
      const results = eulerProbabilityAlgorithm(state.parameters);  
      state.geometries = results;  
      state.selectedGeometry = results[0]; // Select most probable  
        
      updateGeometryCards(results);  
      updateSelectedGeometry();  
        
      state.isCalculating = false;  
      calculateBtn.disabled = false;  
      calculateBtn.textContent = 'Calculate Universe Shape';  
    };  
      
    // Initialize  
    const init = () => {  
      updateTotalDensity();  
        
      // Set up event listeners for sliders  
      hubbleSlider.addEventListener('input', (e) => {  
        state.parameters.hubbleConstant = parseFloat(e.target.value);  
        hubbleValue.textContent = state.parameters.hubbleConstant;  
      });  
        
      matterSlider.addEventListener('input', (e) => {  
        state.parameters.matterDensity = parseFloat(e.target.value);  
        matterValue.textContent = state.parameters.matterDensity;  
        updateTotalDensity();  
      });  
        
      darkEnergySlider.addEventListener('input', (e) => {  
        state.parameters.darkEnergyDensity = parseFloat(e.target.value);  
        darkEnergyValue.textContent = state.parameters.darkEnergyDensity;  
        updateTotalDensity();  
      });  
        
      radiationSlider.addEventListener('input', (e) => {  
        state.parameters.radiationDensity = parseFloat(e.target.value);  
        radiationValue.textContent = state.parameters.radiationDensity;  
        updateTotalDensity();  
      });  
        
      errorSlider.addEventListener('input', (e) => {  
        state.parameters.observationalError = parseFloat(e.target.value);  
        errorValue.textContent = state.parameters.observationalError;  
      });  
        
      calculateBtn.addEventListener('click', runPrediction);  
        
      // Initial prediction  
      runPrediction();  
    };  
      
    // Start the app  
    init();  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601a6b7b2294d37',t:'MTc1MjY3MDQ5OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
