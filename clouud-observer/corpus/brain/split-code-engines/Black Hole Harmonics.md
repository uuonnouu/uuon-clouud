# Black Hole Harmonics   
![TON Black Hole Harmonics](Attachments/BDC62313-5CEE-45F0-8E02-294ED32BDBAA.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <meta name="author" content="Phillip Aguilar Ruiz">  
  <meta name="organization" content="UUON Foundation">  
  <meta name="description" content="TON Black Hole Harmonics - Interactive wave visualizer based on cosmic constants">  
  <meta name="keywords" content="TON 618, black hole, golden ratio, phi, cosmic harmonics, interactive art, wave visualizer, quantum physics, astronomy, mathematical beauty, generative art, cosmic visualization, harmonic convergence, UUON Foundation">  
  <title>TON Black Hole Harmonics - Interactive Wave Painter</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');  
      
    body {  
      font-family: 'Space Grotesk', sans-serif;  
      margin: 0;  
      padding: 0;  
      overflow: hidden;  
      background-color: #000;  
      color: #fff;  
    }  
      
    canvas {  
      display: block;  
      position: fixed;  
      top: 0;  
      left: 0;  
      z-index: 0;  
    }  
      
    .glassmorphism {  
      background: rgba(0, 0, 0, 0.6);  
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
      
    .color-dot {  
      width: 20px;  
      height: 20px;  
      border-radius: 50%;  
      display: inline-block;  
      margin-right: 8px;  
      cursor: pointer;  
      transition: transform 0.2s ease;  
    }  
      
    .color-dot:hover {  
      transform: scale(1.2);  
    }  
      
    .color-dot.active {  
      border: 2px solid white;  
      transform: scale(1.2);  
    }  
      
    .tooltip {  
      position: relative;  
      display: inline-block;  
      cursor: help;  
    }  
      
    .tooltip .tooltip-text {  
      visibility: hidden;  
      width: 200px;  
      background-color: rgba(0, 0, 0, 0.9);  
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
      
    .insight-card {  
      transition: all 0.3s ease;  
      opacity: 0;  
      transform: translateY(20px);  
    }  
      
    .insight-card.visible {  
      opacity: 1;  
      transform: translateY(0);  
    }  
      
    .btn {  
      transition: all 0.3s ease;  
    }  
      
    .btn:hover {  
      transform: translateY(-2px);  
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);  
    }  
      
    .btn:active {  
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
      
    .tab-button {  
      transition: all 0.3s ease;  
    }  
      
    .tab-button.active {  
      background: rgba(59, 130, 246, 0.2);  
      border-bottom: 2px solid #3b82f6;  
    }  
      
    .mode-btn {  
      transition: all 0.3s ease;  
    }  
      
    .mode-btn.active {  
      background: rgba(59, 130, 246, 0.3);  
      border: 1px solid rgba(59, 130, 246, 0.8);  
    }  
      
    .cosmic-badge {  
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 80, 255, 0.2) 100%);  
      border: 1px solid rgba(0, 255, 255, 0.3);  
    }  
      
    .cosmic-gradient {  
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);  
    }  
      
    .brush-preview {  
      width: 20px;  
      height: 20px;  
      border-radius: 50%;  
      display: inline-block;  
      background-color: white;  
      margin-left: 10px;  
    }  
  </style>  
</head>  
<body>  
  <canvas id="tonCanvas"></canvas>  
  <canvas id="paintCanvas"></canvas>  
    
  <div class="relative z-10 flex flex-col h-screen">  
    <header class="p-4 glassmorphism">  
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">  
        <div>  
          <h1 class="text-2xl md:text-3xl font-bold cosmic-gradient bg-clip-text text-transparent">  
            TON Black Hole Harmonics  
          </h1>  
          <p class="text-sm text-blue-300">  
            By Phillip Aguilar Ruiz | UUON Foundation  
          </p>  
        </div>  
          
        <div class="flex space-x-2 mt-4 md:mt-0">  
          <button id="paintModeBtn" class="mode-btn active px-3 py-1 rounded-full text-sm bg-blue-500/20 border border-blue-500/50">  
            Paint Mode  
          </button>  
          <button id="observeModeBtn" class="mode-btn px-3 py-1 rounded-full text-sm bg-purple-500/20 border border-purple-500/50">  
            Observe Mode  
          </button>  
          <button id="clearBtn" class="btn px-3 py-1 rounded-full text-sm bg-red-500/20 border border-red-500/50">  
            Clear Canvas  
          </button>  
        </div>  
      </div>  
    </header>  
      
    <main class="flex-1 flex flex-col md:flex-row">  
      <!-- Left Panel -->  
      <div id="controlPanel" class="w-full md:w-80 glassmorphism p-4 overflow-y-auto">  
        <div class="space-y-6">  
          <div>  
            <h2 class="text-xl font-bold mb-4 text-blue-300">TON Constants</h2>  
            <div class="grid grid-cols-2 gap-4">  
              <div class="cosmic-badge px-3 py-2 rounded-lg text-sm">  
                <div class="flex items-center">  
                  <span class="w-3 h-3 rounded-full bg-cyan-400 mr-2"></span>  
                  <span>TON 202: 1.202</span>  
                </div>  
              </div>  
              <div class="cosmic-badge px-3 py-2 rounded-lg text-sm">  
                <div class="flex items-center">  
                  <span class="w-3 h-3 rounded-full bg-fuchsia-400 mr-2"></span>  
                  <span>TON 1480: 1.148</span>  
                </div>  
              </div>  
              <div class="cosmic-badge px-3 py-2 rounded-lg text-sm">  
                <div class="flex items-center">  
                  <span class="w-3 h-3 rounded-full bg-amber-400 mr-2"></span>  
                  <span>TON 256: 1.256</span>  
                </div>  
              </div>  
              <div class="cosmic-badge px-3 py-2 rounded-lg text-sm">  
                <div class="flex items-center">  
                  <span class="w-3 h-3 rounded-full bg-green-400 mr-2"></span>  
                  <span>TON 618: 1.618 (φ)</span>  
                </div>  
              </div>  
            </div>  
          </div>  
            
          <div>  
            <h2 class="text-xl font-bold mb-4 text-blue-300">Wave Controls</h2>  
              
            <div class="space-y-4">  
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Wave Speed</label>  
                  <span id="speedValue" class="text-white font-medium">1.0</span>  
                </div>  
                <input type="range" id="speedSlider" min="0.1" max="2" value="1" step="0.1"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Wave Amplitude</label>  
                  <span id="amplitudeValue" class="text-white font-medium">1.0</span>  
                </div>  
                <input type="range" id="amplitudeSlider" min="0.2" max="2" value="1" step="0.1"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Harmonic Complexity</label>  
                  <span id="complexityValue" class="text-white font-medium">1.0</span>  
                </div>  
                <input type="range" id="complexitySlider" min="0.5" max="2" value="1" step="0.1"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Fade Speed</label>  
                  <span id="fadeValue" class="text-white font-medium">0.08</span>  
                </div>  
                <input type="range" id="fadeSlider" min="0.01" max="0.2" value="0.08" step="0.01"   
                      class="w-full parameter-slider">  
              </div>  
            </div>  
          </div>  
            
          <div>  
            <h2 class="text-xl font-bold mb-4 text-blue-300">Brush Settings</h2>  
              
            <div class="space-y-4">  
              <div>  
                <div class="flex justify-between mb-2">  
                  <label class="text-blue-200">Brush Size</label>  
                  <span id="brushSizeValue" class="text-white font-medium">20</span>  
                </div>  
                <input type="range" id="brushSizeSlider" min="5" max="50" value="20" step="1"   
                      class="w-full parameter-slider">  
              </div>  
                
              <div>  
                <label class="text-blue-200 block mb-2">Brush Color</label>  
                <div class="flex flex-wrap gap-2">  
                  <div class="color-dot active" style="background-color: #ffffff;" data-color="#ffffff"></div>  
                  <div class="color-dot" style="background-color: #00ffff;" data-color="#00ffff"></div>  
                  <div class="color-dot" style="background-color: #ff50ff;" data-color="#ff50ff"></div>  
                  <div class="color-dot" style="background-color: #ffcc00;" data-color="#ffcc00"></div>  
                  <div class="color-dot" style="background-color: #00ff80;" data-color="#00ff80"></div>  
                  <div class="color-dot" style="background-color: #ff6060;" data-color="#ff6060"></div>  
                  <div class="color-dot" style="background-color: #60a0ff;" data-color="#60a0ff"></div>  
                </div>  
              </div>  
                
              <div>  
                <label class="text-blue-200 block mb-2">Brush Mode</label>  
                <div class="grid grid-cols-2 gap-2">  
                  <button id="normalBrushBtn" class="mode-btn active px-3 py-2 rounded-lg text-sm bg-blue-500/20 border border-blue-500/50">  
                    Normal  
                  </button>  
                  <button id="tonBrushBtn" class="mode-btn px-3 py-2 rounded-lg text-sm bg-purple-500/20 border border-purple-500/50">  
                    TON Wave  
                  </button>  
                  <button id="phiBrushBtn" class="mode-btn px-3 py-2 rounded-lg text-sm bg-amber-500/20 border border-amber-500/50">  
                    Phi Spiral  
                  </button>  
                  <button id="quantumBrushBtn" class="mode-btn px-3 py-2 rounded-lg text-sm bg-green-500/20 border border-green-500/50">  
                    Quantum  
                  </button>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
        
      <!-- Right Panel - Insights -->  
      <div id="insightsPanel" class="w-full md:w-80 glassmorphism p-4 overflow-y-auto hidden md:block">  
        <h2 class="text-xl font-bold mb-4 text-blue-300">Cosmic Insights</h2>  
          
        <div id="insightsContainer" class="space-y-4">  
          <!-- Insights will be dynamically added here -->  
        </div>  
      </div>  
    </main>  
      
    <footer class="glassmorphism p-4">  
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">  
        <div>  
          <p class="text-blue-300">  
            TON Black Hole Harmonics | Interactive Wave Painter  
          </p>  
        </div>  
        <div class="mt-2 md:mt-0">  
          <button id="toggleInsightsBtn" class="btn px-3 py-1 rounded-full text-xs bg-blue-500/20 border border-blue-500/50 md:hidden">  
            Toggle Insights  
          </button>  
          <button id="shareBtn" class="btn px-3 py-1 rounded-full text-xs bg-green-500/20 border border-green-500/50 ml-2">  
            Share Creation  
          </button>  
          <button id="infoBtn" class="btn px-3 py-1 rounded-full text-xs bg-purple-500/20 border border-purple-500/50 ml-2">  
            About  
          </button>  
        </div>  
      </div>  
    </footer>  
      
    <!-- Modal for About -->  
    <div id="infoModal" class="fixed inset-0 bg-black/80 z-50 hidden flex items-center justify-center p-4">  
      <div class="glassmorphism rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">  
        <div class="flex justify-between items-center mb-4">  
          <h2 class="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">About TON Black Hole Harmonics</h2>  
          <button id="closeInfoBtn" class="text-white text-xl">&times;</button>  
        </div>  
          
        <div class="space-y-4">  
          <p class="text-blue-200">  
            Created by Phillip Aguilar Ruiz for the UUON Foundation, this interactive wave visualizer explores the   
            mathematical constants derived from TON black holes and their relationship to the golden ratio (φ).  
          </p>  
            
          <div class="bg-black/30 p-4 rounded-lg">  
            <h3 class="font-bold text-blue-300 mb-2">🚀 Core Benefits of This TON Harmonic Engine</h3>  
              
            <div class="space-y-4">  
              <div>  
                <h4 class="font-bold text-white">1. Symbolic Encoding of Black Hole Constants</h4>  
                <p class="text-sm text-blue-200">  
                  By using 1.202, 1.1480, 1.256, and 1.618, you're embedding real astronomical data (TON black holes/quasars)   
                  into the engine. This grounds the visualization in actual cosmological phenomena and provides a symbolic   
                  layer of meaning.  
                </p>  
              </div>  
                
              <div>  
                <h4 class="font-bold text-white">2. Generative Harmonic Visuals</h4>  
                <p class="text-sm text-blue-200">  
                  The animated waves represent energy fields or gravitational harmonics, evolve over time, creating endless   
                  unique visuals that can be recorded or exported.  
                </p>  
              </div>  
                
              <div>  
                <h4 class="font-bold text-white">3. Golden Ratio + Average TON Field = Harmonic Convergence</h4>  
                <p class="text-sm text-blue-200">  
                  The system uses ϕ (phi) and the average of TON values (1.306) as oscillation controls, creating natural-looking,   
                  beautiful symmetry without manually designing patterns.  
                </p>  
              </div>  
                
              <div>  
                <h4 class="font-bold text-white">4. Interactive Art Creation</h4>  
                <p class="text-sm text-blue-200">  
                  This tool allows you to create unique cosmic art by painting with TON-influenced brushes, exploring the   
                  intersection of mathematics, physics, and artistic expression.  
                </p>  
              </div>  
            </div>  
          </div>  
            
          <p class="text-blue-200">  
            Explore the connection between black holes, the golden ratio, and cosmic harmony through this interactive   
            visualization tool. Paint with waves influenced by actual astronomical constants and create your own   
            cosmic masterpiece.  
          </p>  
        </div>  
      </div>  
    </div>  
      
    <!-- Modal for Share -->  
    <div id="shareModal" class="fixed inset-0 bg-black/80 z-50 hidden flex items-center justify-center p-4">  
      <div class="glassmorphism rounded-xl p-6 max-w-md w-full">  
        <div class="flex justify-between items-center mb-4">  
          <h2 class="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">Share Your Creation</h2>  
          <button id="closeShareBtn" class="text-white text-xl">&times;</button>  
        </div>  
          
        <div class="space-y-4">  
          <div id="sharePreview" class="w-full h-48 bg-black rounded-lg flex items-center justify-center">  
            <p class="text-blue-300">Generating preview...</p>  
          </div>  
            
          <div class="flex justify-center">  
            <button id="downloadBtn" class="btn px-4 py-2 rounded-lg text-sm bg-blue-500 text-white">  
              Download Creation  
            </button>  
          </div>  
        </div>  
      </div>  
    </div>  
  </div>  
  
  <script>  
    // Canvas setup  
    const tonCanvas = document.getElementById("tonCanvas");  
    const tonCtx = tonCanvas.getContext("2d");  
    const paintCanvas = document.getElementById("paintCanvas");  
    const paintCtx = paintCanvas.getContext("2d");  
      
    // Resize canvases  
    function resizeCanvases() {  
      tonCanvas.width = window.innerWidth;  
      tonCanvas.height = window.innerHeight;  
      paintCanvas.width = window.innerWidth;  
      paintCanvas.height = window.innerHeight;  
    }  
      
    resizeCanvases();  
    window.addEventListener('resize', resizeCanvases);  
      
    // TON constants  
    const TON = {  
      ton202: 1.202,  
      ton1480: 1.148,  
      ton256: 1.256,  
      ton618: 1.618,  
    };  
    const tonVals = Object.values(TON);  
    const total = tonVals.reduce((a, b) => a + b, 0); // 5.224  
    const average = total / tonVals.length; // 1.306  
    const ϕ = (1 + Math.sqrt(5)) / 2; // Golden Ratio ~1.618  
      
    // App state  
    const state = {  
      mode: "paint", // "paint" or "observe"  
      brushSize: 20,  
      brushColor: "#ffffff",  
      brushMode: "normal", // "normal", "ton", "phi", "quantum"  
      waveSpeed: 1.0,  
      waveAmplitude: 1.0,  
      complexity: 1.0,  
      fadeSpeed: 0.08,  
      isPainting: false,  
      lastX: 0,  
      lastY: 0,  
      insights: [  
        "The TON 618 value (1.618) exactly matches the Golden Ratio (φ), suggesting a cosmic connection between black holes and universal mathematical constants.",  
        "As you paint, the waves respond to the TON constants, creating harmonics that mirror gravitational waves from black holes.",  
        "The average of all TON values (1.306) creates a resonance field that influences the wave patterns in your artwork.",  
        "Quantum brush mode simulates the probabilistic nature of particles near a black hole's event horizon.",  
        "Phi spiral brush creates patterns based on the golden ratio, found throughout nature from galaxies to seashells.",  
        "TON black holes are among the most massive objects in the universe, with TON 618 being 66 billion times the mass of our Sun.",  
        "The harmonic patterns you're creating mirror the actual gravitational wave patterns detected by LIGO from black hole mergers.",  
        "The golden ratio (φ = 1.618) appears in the spiral arms of galaxies, suggesting a fundamental mathematical principle in cosmic structure.",  
        "The quantum uncertainty principle is visualized in the wave-particle duality of the quantum brush mode.",  
        "Black holes like TON 618 warp spacetime so severely that they create ripples that propagate throughout the universe."  
      ],  
      activeInsights: []  
    };  
      
    // DOM Elements  
    const speedSlider = document.getElementById('speedSlider');  
    const amplitudeSlider = document.getElementById('amplitudeSlider');  
    const complexitySlider = document.getElementById('complexitySlider');  
    const fadeSlider = document.getElementById('fadeSlider');  
    const brushSizeSlider = document.getElementById('brushSizeSlider');  
    const colorDots = document.querySelectorAll('.color-dot');  
    const paintModeBtn = document.getElementById('paintModeBtn');  
    const observeModeBtn = document.getElementById('observeModeBtn');  
    const clearBtn = document.getElementById('clearBtn');  
    const normalBrushBtn = document.getElementById('normalBrushBtn');  
    const tonBrushBtn = document.getElementById('tonBrushBtn');  
    const phiBrushBtn = document.getElementById('phiBrushBtn');  
    const quantumBrushBtn = document.getElementById('quantumBrushBtn');  
    const insightsContainer = document.getElementById('insightsContainer');  
    const toggleInsightsBtn = document.getElementById('toggleInsightsBtn');  
    const insightsPanel = document.getElementById('insightsPanel');  
    const infoBtn = document.getElementById('infoBtn');  
    const infoModal = document.getElementById('infoModal');  
    const closeInfoBtn = document.getElementById('closeInfoBtn');  
    const shareBtn = document.getElementById('shareBtn');  
    const shareModal = document.getElementById('shareModal');  
    const closeShareBtn = document.getElementById('closeShareBtn');  
    const downloadBtn = document.getElementById('downloadBtn');  
    const sharePreview = document.getElementById('sharePreview');  
      
    // Value displays  
    const speedValue = document.getElementById('speedValue');  
    const amplitudeValue = document.getElementById('amplitudeValue');  
    const complexityValue = document.getElementById('complexityValue');  
    const fadeValue = document.getElementById('fadeValue');  
    const brushSizeValue = document.getElementById('brushSizeValue');  
      
    // Drawing functions  
    function drawRing(ctx, x, y, radius, color, alpha = 1) {  
      ctx.beginPath();  
      ctx.arc(x, y, radius, 0, Math.PI * 2);  
      ctx.strokeStyle = `rgba(${color},${alpha})`;  
      ctx.lineWidth = 2;  
      ctx.stroke();  
    }  
      
    // Background animation  
    let time = 0;  
    function animateBackground() {  
      tonCtx.fillStyle = `rgba(0, 0, 0, ${state.fadeSpeed})`;  
      tonCtx.fillRect(0, 0, tonCanvas.width, tonCanvas.height);  
        
      const centerX = tonCanvas.width / 2;  
      const centerY = tonCanvas.height / 2;  
        
      tonVals.forEach((ton, i) => {  
        const radius = ton * 150 * state.waveAmplitude + Math.sin(time + i) * 40 * state.complexity;  
        const x = centerX + Math.cos(time * state.waveSpeed + i) * radius;  
        const y = centerY + Math.sin(time * state.waveSpeed + i) * radius;  
          
        // Main ring pulse  
        drawRing(tonCtx, x, y, ton * 25 + Math.sin(time + i) * 10, "0,255,255", 0.6);  
          
        // Connect lines to center  
        tonCtx.beginPath();  
        tonCtx.moveTo(centerX, centerY);  
        tonCtx.lineTo(x, y);  
        tonCtx.strokeStyle = `rgba(255, ${Math.floor(ton * 200)}, 150, 0.3)`;  
        tonCtx.stroke();  
      });  
        
      // Central TON 618 singularity glow  
      drawRing(tonCtx, centerX, centerY, average * 100 * state.waveAmplitude + Math.sin(time * 2) * 15 * state.complexity, "255, 80, 255", 0.4);  
      drawRing(tonCtx, centerX, centerY, ϕ * 55 * state.waveAmplitude + Math.cos(time * 3) * 12 * state.complexity, "255, 160, 0", 0.2);  
        
      time += 0.01 * state.waveSpeed;  
      requestAnimationFrame(animateBackground);  
    }  
      
    // Start background animation  
    animateBackground();  
      
    // Painting functions  
    function startPainting(e) {  
      if (state.mode !== "paint") return;  
        
      state.isPainting = true;  
      const rect = paintCanvas.getBoundingClientRect();  
      state.lastX = e.clientX - rect.left;  
      state.lastY = e.clientY - rect.top;  
        
      // Draw a single dot at the starting position  
      drawBrush(state.lastX, state.lastY);  
    }  
      
    function stopPainting() {  
      state.isPainting = false;  
    }  
      
    function paint(e) {  
      if (!state.isPainting || state.mode !== "paint") return;  
        
      const rect = paintCanvas.getBoundingClientRect();  
      const currentX = e.clientX - rect.left;  
      const currentY = e.clientY - rect.top;  
        
      // Draw line between last position and current position  
      drawBrushLine(state.lastX, state.lastY, currentX, currentY);  
        
      state.lastX = currentX;  
      state.lastY = currentY;  
        
      // Show a random insight occasionally  
      if (Math.random() < 0.01) {  
        showRandomInsight();  
      }  
    }  
      
    function drawBrush(x, y) {  
      const color = hexToRgb(state.brushColor);  
        
      switch (state.brushMode) {  
        case "normal":  
          paintCtx.beginPath();  
          paintCtx.arc(x, y, state.brushSize, 0, Math.PI * 2);  
          paintCtx.fillStyle = state.brushColor;  
          paintCtx.fill();  
          break;  
            
        case "ton":  
          // Draw TON-influenced waves  
          tonVals.forEach((ton, i) => {  
            const radius = ton * state.brushSize * 0.8;  
            paintCtx.beginPath();  
            paintCtx.arc(x, y, radius, 0, Math.PI * 2);  
            paintCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;  
            paintCtx.lineWidth = 2;  
            paintCtx.stroke();  
          });  
          break;  
            
        case "phi":  
          // Draw phi spiral  
          const maxTurns = 3;  
          const pointsPerTurn = 20;  
          const totalPoints = maxTurns * pointsPerTurn;  
            
          paintCtx.beginPath();  
          paintCtx.moveTo(x, y);  
            
          for (let i = 1; i <= totalPoints; i++) {  
            const angle = i * 0.1 * ϕ;  
            const radius = state.brushSize * 0.2 * Math.sqrt(i);  
            const newX = x + Math.cos(angle) * radius;  
            const newY = y + Math.sin(angle) * radius;  
              
            paintCtx.lineTo(newX, newY);  
          }  
            
          paintCtx.strokeStyle = state.brushColor;  
          paintCtx.lineWidth = 2;  
          paintCtx.stroke();  
          break;  
            
        case "quantum":  
          // Draw quantum particles  
          const particleCount = 20;  
            
          for (let i = 0; i < particleCount; i++) {  
            const angle = Math.random() * Math.PI * 2;  
            const distance = Math.random() * state.brushSize;  
            const particleX = x + Math.cos(angle) * distance;  
            const particleY = y + Math.sin(angle) * distance;  
            const particleSize = Math.random() * 4 + 1;  
              
            paintCtx.beginPath();  
            paintCtx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);  
            paintCtx.fillStyle = state.brushColor;  
            paintCtx.fill();  
          }  
          break;  
      }  
    }  
      
    function drawBrushLine(x1, y1, x2, y2) {  
      // Calculate distance between points  
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);  
      const steps = Math.max(5, Math.floor(distance / 5));  
        
      // Draw points along the line  
      for (let i = 0; i <= steps; i++) {  
        const t = i / steps;  
        const x = x1 + (x2 - x1) * t;  
        const y = y1 + (y2 - y1) * t;  
        drawBrush(x, y);  
      }  
    }  
      
    // Helper functions  
    function hexToRgb(hex) {  
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);  
      return result ? {  
        r: parseInt(result[1], 16),  
        g: parseInt(result[2], 16),  
        b: parseInt(result[3], 16)  
      } : { r: 255, g: 255, b: 255 };  
    }  
      
    function showRandomInsight() {  
      if (state.insights.length === 0) return;  
        
      // Get a random insight  
      const randomIndex = Math.floor(Math.random() * state.insights.length);  
      const insight = state.insights[randomIndex];  
        
      // Remove it from the pool to avoid repetition  
      state.insights.splice(randomIndex, 1);  
        
      // Add to active insights  
      state.activeInsights.push(insight);  
        
      // Update the UI  
      updateInsightsUI();  
        
      // If we've used all insights, refill the pool  
      if (state.insights.length === 0) {  
        state.insights = [...state.activeInsights];  
        state.activeInsights = [];  
      }  
    }  
      
    function updateInsightsUI() {  
      insightsContainer.innerHTML = '';  
        
      state.activeInsights.slice(-5).forEach((insight, index) => {  
        const card = document.createElement('div');  
        card.className = 'insight-card bg-black/30 p-4 rounded-lg border border-blue-900/30';  
        card.innerHTML = `<p class="text-sm text-blue-200">${insight}</p>`;  
          
        // Add with animation delay  
        setTimeout(() => {  
          card.classList.add('visible');  
        }, index * 100);  
          
        insightsContainer.appendChild(card);  
      });  
    }  
      
    // Event listeners  
    paintCanvas.addEventListener('mousedown', startPainting);  
    paintCanvas.addEventListener('mouseup', stopPainting);  
    paintCanvas.addEventListener('mousemove', paint);  
    paintCanvas.addEventListener('mouseleave', stopPainting);  
      
    // Touch support  
    paintCanvas.addEventListener('touchstart', (e) => {  
      e.preventDefault();  
      const touch = e.touches[0];  
      const mouseEvent = new MouseEvent('mousedown', {  
        clientX: touch.clientX,  
        clientY: touch.clientY  
      });  
      startPainting(mouseEvent);  
    });  
      
    paintCanvas.addEventListener('touchend', (e) => {  
      e.preventDefault();  
      stopPainting();  
    });  
      
    paintCanvas.addEventListener('touchmove', (e) => {  
      e.preventDefault();  
      const touch = e.touches[0];  
      const mouseEvent = new MouseEvent('mousemove', {  
        clientX: touch.clientX,  
        clientY: touch.clientY  
      });  
      paint(mouseEvent);  
    });  
      
    // Slider event listeners  
    speedSlider.addEventListener('input', (e) => {  
      state.waveSpeed = parseFloat(e.target.value);  
      speedValue.textContent = state.waveSpeed.toFixed(1);  
    });  
      
    amplitudeSlider.addEventListener('input', (e) => {  
      state.waveAmplitude = parseFloat(e.target.value);  
      amplitudeValue.textContent = state.waveAmplitude.toFixed(1);  
    });  
      
    complexitySlider.addEventListener('input', (e) => {  
      state.complexity = parseFloat(e.target.value);  
      complexityValue.textContent = state.complexity.toFixed(1);  
    });  
      
    fadeSlider.addEventListener('input', (e) => {  
      state.fadeSpeed = parseFloat(e.target.value);  
      fadeValue.textContent = state.fadeSpeed.toFixed(2);  
    });  
      
    brushSizeSlider.addEventListener('input', (e) => {  
      state.brushSize = parseInt(e.target.value);  
      brushSizeValue.textContent = state.brushSize;  
    });  
      
    // Color selection  
    colorDots.forEach(dot => {  
      dot.addEventListener('click', () => {  
        // Remove active class from all dots  
        colorDots.forEach(d => d.classList.remove('active'));  
          
        // Add active class to clicked dot  
        dot.classList.add('active');  
          
        // Update brush color  
        state.brushColor = dot.dataset.color;  
      });  
    });  
      
    // Mode buttons  
    paintModeBtn.addEventListener('click', () => {  
      state.mode = "paint";  
      paintModeBtn.classList.add('active');  
      observeModeBtn.classList.remove('active');  
    });  
      
    observeModeBtn.addEventListener('click', () => {  
      state.mode = "observe";  
      observeModeBtn.classList.add('active');  
      paintModeBtn.classList.remove('active');  
    });  
      
    // Clear button  
    clearBtn.addEventListener('click', () => {  
      paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);  
    });  
      
    // Brush mode buttons  
    normalBrushBtn.addEventListener('click', () => {  
      state.brushMode = "normal";  
      [normalBrushBtn, tonBrushBtn, phiBrushBtn, quantumBrushBtn].forEach(btn => btn.classList.remove('active'));  
      normalBrushBtn.classList.add('active');  
    });  
      
    tonBrushBtn.addEventListener('click', () => {  
      state.brushMode = "ton";  
      [normalBrushBtn, tonBrushBtn, phiBrushBtn, quantumBrushBtn].forEach(btn => btn.classList.remove('active'));  
      tonBrushBtn.classList.add('active');  
    });  
      
    phiBrushBtn.addEventListener('click', () => {  
      state.brushMode = "phi";  
      [normalBrushBtn, tonBrushBtn, phiBrushBtn, quantumBrushBtn].forEach(btn => btn.classList.remove('active'));  
      phiBrushBtn.classList.add('active');  
    });  
      
    quantumBrushBtn.addEventListener('click', () => {  
      state.brushMode = "quantum";  
      [normalBrushBtn, tonBrushBtn, phiBrushBtn, quantumBrushBtn].forEach(btn => btn.classList.remove('active'));  
      quantumBrushBtn.classList.add('active');  
    });  
      
    // Toggle insights panel on mobile  
    toggleInsightsBtn.addEventListener('click', () => {  
      insightsPanel.classList.toggle('hidden');  
    });  
      
    // Info modal  
    infoBtn.addEventListener('click', () => {  
      infoModal.style.display = 'flex';  
    });  
      
    closeInfoBtn.addEventListener('click', () => {  
      infoModal.style.display = 'none';  
    });  
      
    // Share modal  
    shareBtn.addEventListener('click', () => {  
      shareModal.style.display = 'flex';  
        
      // Create a merged canvas for the preview  
      const mergedCanvas = document.createElement('canvas');  
      mergedCanvas.width = paintCanvas.width;  
      mergedCanvas.height = paintCanvas.height;  
      const mergedCtx = mergedCanvas.getContext('2d');  
        
      // Draw background  
      mergedCtx.drawImage(tonCanvas, 0, 0);  
        
      // Draw painting  
      mergedCtx.drawImage(paintCanvas, 0, 0);  
        
      // Create a scaled version for the preview  
      const previewImg = document.createElement('img');  
      previewImg.src = mergedCanvas.toDataURL('image/png');  
      previewImg.style.maxWidth = '100%';  
      previewImg.style.maxHeight = '100%';  
      previewImg.style.borderRadius = '0.5rem';  
        
      // Clear and add to preview container  
      sharePreview.innerHTML = '';  
      sharePreview.appendChild(previewImg);  
        
      // Set up download button  
      downloadBtn.onclick = () => {  
        const link = document.createElement('a');  
        link.download = 'ton-black-hole-harmonics.png';  
        link.href = mergedCanvas.toDataURL('image/png');  
        link.click();  
      };  
    });  
      
    closeShareBtn.addEventListener('click', () => {  
      shareModal.style.display = 'none';  
    });  
      
    // Close modals when clicking outside  
    window.addEventListener('click', (e) => {  
      if (e.target === infoModal) {  
        infoModal.style.display = 'none';  
      }  
      if (e.target === shareModal) {  
        shareModal.style.display = 'none';  
      }  
    });  
      
    // Initialize with some insights  
    for (let i = 0; i < 3; i++) {  
      showRandomInsight();  
    }  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601a7baa6334d37',t:'MTc1MjY3MDU0MC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
