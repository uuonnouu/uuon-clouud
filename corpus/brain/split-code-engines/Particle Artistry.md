# Particle Artistry  
![Image](Attachments/B147B46D-FEDF-4D44-809C-D883D705C9A1.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>φ³ Particle Artistry Engine</title>  
  <style>  
    body, html {   
      margin: 0;   
      padding: 0;  
      overflow: hidden;  
      background: #000;  
      font-family: 'Helvetica Neue', Arial, sans-serif;  
      height: 100%;  
    }  
    canvas {   
      display: block;   
      cursor: crosshair;  
      background: radial-gradient(circle at center, #0a0a14 0%, #000000 100%);  
      width: 100%;  
      height: 100%;  
    }  
    .control-panel {  
      position: fixed;  
      bottom: 10px;  
      left: 10px;  
      right: 10px;  
      color: #e0e0e0;  
      font-size: 11px;  
      background: rgba(10,10,20,0.85);  
      padding: 10px;  
      border-radius: 8px;  
      border: 1px solid #333;  
      display: flex;  
      gap: 15px;  
      align-items: center;  
      flex-wrap: wrap;  
      justify-content: center;  
      z-index: 1000;  
      box-shadow: 0 0 20px rgba(0,0,0,0.5);  
    }  
    .control-section {  
      display: flex;  
      flex-direction: column;  
      gap: 8px;  
      min-width: 120px;  
    }  
    .slider-group {  
      display: flex;  
      flex-direction: column;  
      gap: 3px;  
    }  
    .slider {  
      width: 100px;  
      accent-color: #666;  
      height: 4px;  
    }  
    .slider-label {  
      font-size: 10px;  
      color: #e0e0e0;  
      display: flex;  
      justify-content: space-between;  
    }  
    .cubic-button {  
      background: rgba(40,40,50,0.8);  
      color: #e0e0e0;  
      border: 1px solid #444;  
      padding: 8px 12px;  
      margin: 2px;  
      cursor: pointer;  
      border-radius: 4px;  
      transition: all 0.2s;  
      font-size: 10px;  
    }  
    .cubic-button:hover {  
      background: rgba(60,60,70,0.8);  
      box-shadow: 0 0 10px rgba(255,255,255,0.1);  
    }  
    .performance-info {  
      position: absolute;  
      top: 20px;  
      right: 20px;  
      color: #aaa;  
      font-size: 11px;  
      text-align: right;  
      background: rgba(10,10,20,0.7);  
      padding: 10px;  
      border-radius: 5px;  
      border: 1px solid #333;  
    }  
    .title {  
      position: absolute;  
      top: 20px;  
      left: 20px;  
      color: #e0e0e0;  
      font-size: 16px;  
      font-weight: 300;  
      letter-spacing: 1px;  
      background: rgba(10,10,20,0.7);  
      padding: 10px;  
      border-radius: 5px;  
      border: 1px solid #333;  
    }  
    .sacred-indicator {  
      position: absolute;  
      top: 80px;  
      left: 20px;  
      color: #aaa;  
      font-size: 14px;  
      background: rgba(10,10,20,0.7);  
      padding: 10px;  
      border-radius: 5px;  
      border: 1px solid #333;  
      opacity: 0;  
      transition: opacity 0.5s ease;  
    }  
    .toggle-switch {  
      display: flex;  
      align-items: center;  
      gap: 8px;  
    }  
    .toggle-label {  
      font-size: 10px;  
      color: #e0e0e0;  
    }  
    .switch {  
      position: relative;  
      display: inline-block;  
      width: 50px;  
      height: 24px;  
    }  
    .switch input {  
      opacity: 0;  
      width: 0;  
      height: 0;  
    }  
    .slider-toggle {  
      position: absolute;  
      cursor: pointer;  
      top: 0;  
      left: 0;  
      right: 0;  
      bottom: 0;  
      background-color: #222;  
      transition: .4s;  
      border-radius: 24px;  
      border: 1px solid #444;  
    }  
    .slider-toggle:before {  
      position: absolute;  
      content: "";  
      height: 16px;  
      width: 16px;  
      left: 4px;  
      bottom: 3px;  
      background-color: #888;  
      transition: .4s;  
      border-radius: 50%;  
    }  
    input:checked + .slider-toggle {  
      background-color: #444;  
    }  
    input:checked + .slider-toggle:before {  
      transform: translateX(26px);  
    }  
    .info-panel {  
      position: absolute;  
      top: 50%;  
      left: 50%;  
      transform: translate(-50%, -50%);  
      background: rgba(10,10,20,0.9);  
      border: 1px solid #333;  
      border-radius: 8px;  
      padding: 20px;  
      color: #e0e0e0;  
      max-width: 500px;  
      text-align: center;  
      z-index: 2000;  
      box-shadow: 0 0 30px rgba(0,0,0,0.5);  
      display: none;  
    }  
    .info-panel h2 {  
      margin-top: 0;  
      color: #fff;  
      font-weight: 300;  
      letter-spacing: 1px;  
    }  
    .info-panel p {  
      margin-bottom: 15px;  
      line-height: 1.5;  
      color: #ccc;  
    }  
    .close-btn {  
      background: rgba(40,40,50,0.8);  
      color: #e0e0e0;  
      border: 1px solid #444;  
      padding: 8px 16px;  
      cursor: pointer;  
      border-radius: 4px;  
      transition: all 0.2s;  
      margin-top: 10px;  
    }  
    .close-btn:hover {  
      background: rgba(60,60,70,0.8);  
      box-shadow: 0 0 10px rgba(255,255,255,0.1);  
    }  
    .info-button {  
      position: absolute;  
      top: 20px;  
      right: 140px;  
      background: rgba(10,10,20,0.7);  
      color: #e0e0e0;  
      border: 1px solid #333;  
      width: 24px;  
      height: 24px;  
      border-radius: 50%;  
      display: flex;  
      align-items: center;  
      justify-content: center;  
      cursor: pointer;  
      font-weight: bold;  
      transition: all 0.2s;  
    }  
    .info-button:hover {  
      background: rgba(40,40,50,0.8);  
      box-shadow: 0 0 10px rgba(255,255,255,0.1);  
    }  
    .view-controls {  
      position: absolute;  
      top: 20px;  
      left: 50%;  
      transform: translateX(-50%);  
      display: flex;  
      gap: 10px;  
      background: rgba(10,10,20,0.7);  
      padding: 10px;  
      border-radius: 8px;  
      border: 1px solid #333;  
    }  
    .view-button {  
      background: rgba(40,40,50,0.8);  
      color: #e0e0e0;  
      border: 1px solid #444;  
      padding: 8px 12px;  
      cursor: pointer;  
      border-radius: 4px;  
      transition: all 0.2s;  
      font-size: 10px;  
    }  
    .view-button.active {  
      background: rgba(60,60,70,0.8);  
      box-shadow: 0 0 10px rgba(255,255,255,0.1);  
    }  
    .source-indicator {  
      position: absolute;  
      top: 50%;  
      left: 50%;  
      width: 6px;  
      height: 6px;  
      border-radius: 50%;  
      background: rgba(255,255,255,0.5);  
      transform: translate(-50%, -50%);  
      pointer-events: none;  
      z-index: 100;  
    }  
    .pattern-controls {  
      position: absolute;  
      bottom: 80px;  
      right: 20px;  
      display: flex;  
      flex-direction: column;  
      gap: 5px;  
      background: rgba(10,10,20,0.7);  
      padding: 10px;  
      border-radius: 5px;  
      border: 1px solid #333;  
    }  
    .pattern-button {  
      background: rgba(40,40,50,0.8);  
      color: #e0e0e0;  
      border: 1px solid #444;  
      padding: 6px 10px;  
      cursor: pointer;  
      border-radius: 4px;  
      transition: all 0.2s;  
      font-size: 10px;  
      margin-bottom: 5px;  
    }  
    .pattern-button.active {  
      background: rgba(60,60,70,0.8);  
      box-shadow: 0 0 10px rgba(255,255,255,0.1);  
    }  
    @media (max-width: 768px) {  
      .control-panel {  
        flex-direction: column;  
        align-items: center;  
        padding: 5px;  
        gap: 5px;  
      }  
      .control-section {  
        flex-direction: row;  
        width: 100%;  
        justify-content: center;  
      }  
      .view-controls {  
        flex-direction: column;  
        top: 80px;  
        left: auto;  
        right: 20px;  
        transform: none;  
      }  
    }  
  </style>  
</head>  
<body>  
<canvas id="canvas"></canvas>  
  
<div class="title">φ³ PARTICLE ARTISTRY</div>  
  
<div class="sacred-indicator" id="sacredIndicator">  
  SACRED HARMONY: 1728 VERTICES (12³) ACHIEVED  
</div>  
  
<div class="performance-info">  
  <div>FPS: <span id="fps">0</span></div>  
  <div>Particles: <span id="particleCount">0</span></div>  
  <div>Resolution: <span id="resolution">0x0</span></div>  
</div>  
  
<div class="source-indicator" id="sourceIndicator"></div>  
  
<div class="view-controls">  
  <button class="view-button active" data-view="particles">PARTICLES</button>  
  <button class="view-button" data-view="waves">WAVES</button>  
  <button class="view-button" data-view="ripples">RIPPLES</button>  
  <button class="view-button" data-view="folding">FOLDING</button>  
</div>  
  
<div class="pattern-controls">  
  <div class="slider-group">  
    <div class="slider-label">  
      <span>Speed</span>  
      <span id="speedValue">1.0</span>  
    </div>  
    <input type="range" class="slider" id="speed" min="0.1" max="3" step="0.1" value="1.0">  
  </div>  
  <div class="slider-group">  
    <div class="slider-label">  
      <span>Smoothness</span>  
      <span id="smoothValue">0.8</span>  
    </div>  
    <input type="range" class="slider" id="smooth" min="0.1" max="1" step="0.1" value="0.8">  
  </div>  
  <div class="pattern-buttons">  
    <button class="pattern-button" data-pattern="spiral">SPIRAL</button>  
    <button class="pattern-button" data-pattern="mandala">MANDALA</button>  
    <button class="pattern-button" data-pattern="vortex">VORTEX</button>  
    <button class="pattern-button" data-pattern="symmetry">SYMMETRY</button>  
  </div>  
</div>  
  
<div class="info-button" id="infoButton">i</div>  
  
<div class="info-panel" id="infoPanel">  
  <h2>φ³ Particle Artistry Engine</h2>  
  <p>This visualization engine creates beautiful patterns based on sacred mathematical relationships and the golden ratio (φ), focusing on particle movement and depth rather than visual effects.</p>  
  <p>• Create sophisticated visual art with precise control<br>  
     • Explore different pattern types: waves, ripples, folding<br>  
     • Adjust smoothness for refined artistic expression<br>  
     • Control speed for perfect timing and flow</p>  
  <h3>View Modes:</h3>  
  <p><strong>Particles:</strong> Individual points with precise movement<br>  
  <strong>Waves:</strong> Flowing wave patterns with harmonic motion<br>  
  <strong>Ripples:</strong> Concentric expanding patterns<br>  
  <strong>Folding:</strong> Complex folding and unfolding geometric patterns</p>  
  <p><strong>Pattern Presets:</strong> Try the spiral, mandala, vortex and symmetry patterns for instant artistic results</p>  
  <button class="close-btn" id="closeInfoBtn">Close</button>  
</div>  
  
<div class="control-panel">  
  <div class="control-section">  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Depth</span>  
        <span id="depthValue">12</span>  
      </div>  
      <input type="range" class="slider" id="depth" min="3" max="20" value="12">  
    </div>  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Phi</span>  
        <span id="phiValue">1.618</span>  
      </div>  
      <input type="range" class="slider" id="phiRes" min="0.1" max="3" step="0.01" value="1.618">  
    </div>  
  </div>  
  
  <div class="control-section">  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Scale</span>  
        <span id="scaleValue">0.8</span>  
      </div>  
      <input type="range" class="slider" id="scale" min="0.1" max="2" step="0.1" value="0.8">  
    </div>  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Density</span>  
        <span id="densityValue">0.7</span>  
      </div>  
      <input type="range" class="slider" id="density" min="0.1" max="1" step="0.1" value="0.7">  
    </div>  
  </div>  
  
  <div class="control-section">  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Flow</span>  
        <span id="flowValue">0.5</span>  
      </div>  
      <input type="range" class="slider" id="flow" min="0" max="1" step="0.01" value="0.5">  
    </div>  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Harmony</span>  
        <span id="harmonyValue">0.6</span>  
      </div>  
      <input type="range" class="slider" id="harmony" min="0" max="1" step="0.01" value="0.6">  
    </div>  
  </div>  
  
  <div class="control-section">  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Contrast</span>  
        <span id="contrastValue">0.5</span>  
      </div>  
      <input type="range" class="slider" id="contrast" min="0" max="1" step="0.01" value="0.5">  
    </div>  
    <div class="slider-group">  
      <div class="slider-label">  
        <span>Rotation</span>  
        <span id="rotationValue">0.2</span>  
      </div>  
      <input type="range" class="slider" id="rotation" min="0" max="1" step="0.01" value="0.2">  
    </div>  
  </div>  
  
  <div class="control-section">  
    <button class="cubic-button" id="resetBtn">RESET</button>  
    <button class="cubic-button" id="randomizeBtn">RANDOMIZE</button>  
    <div class="preset-buttons">  
      <button class="cubic-button preset" data-preset="cosmic">COSMIC</button>  
      <button class="cubic-button preset" data-preset="neural">NEURAL</button>  
      <button class="cubic-button preset" data-preset="sacred">SACRED 1728</button>  
    </div>  
  </div>  
</div>  
  
<script>  
  // Canvas setup  
  const canvas = document.getElementById('canvas');  
  const ctx = canvas.getContext('2d');  
    
  // Performance tracking  
  let lastTime = performance.now();  
  let frameCount = 0;  
  let fps = 0;  
  let particleCount = 0;  
    
  // Color palette - more subtle, less neon  
  const colors = {  
    white: '#ffffff',  
    lightGray: '#cccccc',  
    mediumGray: '#999999',  
    darkGray: '#666666',  
    blue: '#4a6da7',  
    teal: '#4a8f9e',  
    green: '#4a9e6d',  
    purple: '#6d4a9e',  
    red: '#9e4a4a',  
    orange: '#9e6d4a',  
    yellow: '#9e9e4a',  
    cyan: '#4a9e9e'  
  };  
    
  // Resize handler  
  function resizeCanvas() {  
    canvas.width = window.innerWidth;  
    canvas.height = window.innerHeight;  
    document.getElementById('resolution').textContent = `${canvas.width}x${canvas.height}`;  
  }  
    
  window.addEventListener('resize', resizeCanvas);  
  resizeCanvas();  
    
  // Parameters  
  const params = {  
    depth: 12,  
    phiRes: 1.618,  
    scale: 0.8,  
    density: 0.7,  
    flow: 0.5,  
    harmony: 0.6,  
    contrast: 0.5,  
    rotation: 0.2,  
    speed: 1.0,  
    smooth: 0.8,  
    mouseX: 0.5, // Center by default  
    mouseY: 0.5, // Center by default  
    time: 0,  
    viewMode: 'particles', // 'particles', 'waves', 'ripples', 'folding'  
    pattern: 'none', // 'none', 'spiral', 'mandala', 'vortex', 'symmetry'  
    patternIntensity: 0.0, // Gradually increases when pattern is selected  
    patternTransition: 0.0 // For smooth transitions between patterns  
  };  
    
  // Mouse tracking  
  canvas.addEventListener('mousemove', (e) => {  
    params.mouseX = e.clientX / canvas.width;  
    params.mouseY = e.clientY / canvas.height;  
  });  
    
  // Touch tracking for mobile  
  canvas.addEventListener('touchmove', (e) => {  
    if (e.touches.length > 0) {  
      params.mouseX = e.touches[0].clientX / canvas.width;  
      params.mouseY = e.touches[0].clientY / canvas.height;  
      e.preventDefault();  
    }  
  });  
    
  // UI Controls  
  function setupControls() {  
    // Depth slider  
    const depthSlider = document.getElementById('depth');  
    const depthValue = document.getElementById('depthValue');  
    depthSlider.addEventListener('input', () => {  
      params.depth = parseInt(depthSlider.value);  
      depthValue.textContent = params.depth;  
      updateSacredIndicator();  
    });  
      
    // Phi Res slider  
    const phiResSlider = document.getElementById('phiRes');  
    const phiValue = document.getElementById('phiValue');  
    phiResSlider.addEventListener('input', () => {  
      params.phiRes = parseFloat(phiResSlider.value);  
      phiValue.textContent = params.phiRes.toFixed(3);  
    });  
      
    // Scale slider  
    const scaleSlider = document.getElementById('scale');  
    const scaleValue = document.getElementById('scaleValue');  
    scaleSlider.addEventListener('input', () => {  
      params.scale = parseFloat(scaleSlider.value);  
      scaleValue.textContent = params.scale.toFixed(1);  
    });  
      
    // Density slider  
    const densitySlider = document.getElementById('density');  
    const densityValue = document.getElementById('densityValue');  
    densitySlider.addEventListener('input', () => {  
      params.density = parseFloat(densitySlider.value);  
      densityValue.textContent = params.density.toFixed(1);  
    });  
      
    // Flow slider  
    const flowSlider = document.getElementById('flow');  
    const flowValue = document.getElementById('flowValue');  
    flowSlider.addEventListener('input', () => {  
      params.flow = parseFloat(flowSlider.value);  
      flowValue.textContent = params.flow.toFixed(2);  
    });  
      
    // Harmony slider  
    const harmonySlider = document.getElementById('harmony');  
    const harmonyValue = document.getElementById('harmonyValue');  
    harmonySlider.addEventListener('input', () => {  
      params.harmony = parseFloat(harmonySlider.value);  
      harmonyValue.textContent = params.harmony.toFixed(2);  
    });  
      
    // Contrast slider  
    const contrastSlider = document.getElementById('contrast');  
    const contrastValue = document.getElementById('contrastValue');  
    contrastSlider.addEventListener('input', () => {  
      params.contrast = parseFloat(contrastSlider.value);  
      contrastValue.textContent = params.contrast.toFixed(2);  
    });  
      
    // Rotation slider  
    const rotationSlider = document.getElementById('rotation');  
    const rotationValue = document.getElementById('rotationValue');  
    rotationSlider.addEventListener('input', () => {  
      params.rotation = parseFloat(rotationSlider.value);  
      rotationValue.textContent = params.rotation.toFixed(2);  
    });  
      
    // Speed slider  
    const speedSlider = document.getElementById('speed');  
    const speedValue = document.getElementById('speedValue');  
    speedSlider.addEventListener('input', () => {  
      params.speed = parseFloat(speedSlider.value);  
      speedValue.textContent = params.speed.toFixed(1);  
    });  
      
    // Smoothness slider  
    const smoothSlider = document.getElementById('smooth');  
    const smoothValue = document.getElementById('smoothValue');  
    smoothSlider.addEventListener('input', () => {  
      params.smooth = parseFloat(smoothSlider.value);  
      smoothValue.textContent = params.smooth.toFixed(1);  
    });  
      
    // View mode buttons  
    document.querySelectorAll('.view-button').forEach(button => {  
      button.addEventListener('click', () => {  
        // Remove active class from all buttons  
        document.querySelectorAll('.view-button').forEach(btn => {  
          btn.classList.remove('active');  
        });  
          
        // Add active class to clicked button  
        button.classList.add('active');  
          
        // Set view mode  
        params.viewMode = button.dataset.view;  
      });  
    });  
      
    // Pattern buttons  
    document.querySelectorAll('.pattern-button').forEach(button => {  
      button.addEventListener('click', () => {  
        // Toggle active class  
        if (button.classList.contains('active')) {  
          button.classList.remove('active');  
          params.pattern = 'none';  
          params.patternIntensity = 0;  
        } else {  
          // Remove active class from all buttons  
          document.querySelectorAll('.pattern-button').forEach(btn => {  
            btn.classList.remove('active');  
          });  
            
          // Add active class to clicked button  
          button.classList.add('active');  
            
          // Set pattern  
          params.pattern = button.dataset.pattern;  
          params.patternIntensity = 0; // Start transition  
        }  
      });  
    });  
      
    // Reset button  
    document.getElementById('resetBtn').addEventListener('click', resetParams);  
      
    // Randomize button  
    document.getElementById('randomizeBtn').addEventListener('click', randomizeParams);  
      
    // Preset buttons  
    document.querySelectorAll('.preset').forEach(button => {  
      button.addEventListener('click', () => {  
        applyPreset(button.dataset.preset);  
      });  
    });  
      
    // Info panel controls  
    document.getElementById('infoButton').addEventListener('click', () => {  
      document.getElementById('infoPanel').style.display = 'block';  
    });  
      
    document.getElementById('closeInfoBtn').addEventListener('click', () => {  
      document.getElementById('infoPanel').style.display = 'none';  
    });  
  }  
    
  // Update sacred indicator  
  function updateSacredIndicator() {  
    const sacredIndicator = document.getElementById('sacredIndicator');  
    if (params.depth === 12) {  
      sacredIndicator.style.opacity = '1';  
    } else {  
      sacredIndicator.style.opacity = '0';  
    }  
  }  
    
  // Reset parameters to default  
  function resetParams() {  
    params.depth = 12;  
    params.phiRes = 1.618;  
    params.scale = 0.8;  
    params.density = 0.7;  
    params.flow = 0.5;  
    params.harmony = 0.6;  
    params.contrast = 0.5;  
    params.rotation = 0.2;  
    params.speed = 1.0;  
    params.smooth = 0.8;  
      
    updateSliders();  
    updateSacredIndicator();  
      
    // Reset pattern  
    params.pattern = 'none';  
    params.patternIntensity = 0;  
    document.querySelectorAll('.pattern-button').forEach(btn => {  
      btn.classList.remove('active');  
    });  
  }  
    
  // Randomize parameters  
  function randomizeParams() {  
    params.depth = Math.floor(Math.random() * 15) + 5;  
    params.phiRes = Math.random() * 2.9 + 0.1;  
    params.scale = Math.random() * 1.9 + 0.1;  
    params.density = Math.random() * 0.9 + 0.1;  
    params.flow = Math.random();  
    params.harmony = Math.random();  
    params.contrast = Math.random();  
    params.rotation = Math.random();  
    params.speed = Math.random() * 2.9 + 0.1;  
    params.smooth = Math.random() * 0.9 + 0.1;  
      
    updateSliders();  
    updateSacredIndicator();  
      
    // Random pattern  
    const patterns = ['none', 'spiral', 'mandala', 'vortex', 'symmetry'];  
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];  
    params.pattern = randomPattern;  
    params.patternIntensity = randomPattern === 'none' ? 0 : 1;  
      
    document.querySelectorAll('.pattern-button').forEach(btn => {  
      btn.classList.remove('active');  
      if (btn.dataset.pattern === randomPattern) {  
        btn.classList.add('active');  
      }  
    });  
  }  
    
  // Apply preset configurations  
  function applyPreset(preset) {  
    switch(preset) {  
      case 'cosmic':  
        params.depth = 15;  
        params.phiRes = 1.618;  
        params.scale = 1.2;  
        params.density = 0.8;  
        params.flow = 0.7;  
        params.harmony = 0.8;  
        params.contrast = 0.3;  
        params.rotation = 0.15;  
        params.speed = 0.8;  
        params.smooth = 0.9;  
        params.pattern = 'spiral';  
        params.patternIntensity = 1;  
        break;  
      case 'neural':  
        params.depth = 18;  
        params.phiRes = 2.1;  
        params.scale = 0.6;  
        params.density = 0.9;  
        params.flow = 0.3;  
        params.harmony = 0.4;  
        params.contrast = 0.8;  
        params.rotation = 0.4;  
        params.speed = 1.5;  
        params.smooth = 0.6;  
        params.pattern = 'vortex';  
        params.patternIntensity = 1;  
        break;  
      case 'sacred':  
        params.depth = 12;  
        params.phiRes = 1.618;  
        params.scale = 1.0;  
        params.density = 0.7;  
        params.flow = 0.5;  
        params.harmony = 0.6;  
        params.contrast = 0.5;  
        params.rotation = 0.333;  
        params.speed = 1.0;  
        params.smooth = 0.8;  
        params.pattern = 'mandala';  
        params.patternIntensity = 1;  
        break;  
    }  
      
    updateSliders();  
    updateSacredIndicator();  
      
    // Update pattern buttons  
    document.querySelectorAll('.pattern-button').forEach(btn => {  
      btn.classList.remove('active');  
      if (btn.dataset.pattern === params.pattern) {  
        btn.classList.add('active');  
      }  
    });  
  }  
    
  // Update all sliders to match current parameters  
  function updateSliders() {  
    document.getElementById('depth').value = params.depth;  
    document.getElementById('depthValue').textContent = params.depth;  
      
    document.getElementById('phiRes').value = params.phiRes;  
    document.getElementById('phiValue').textContent = params.phiRes.toFixed(3);  
      
    document.getElementById('scale').value = params.scale;  
    document.getElementById('scaleValue').textContent = params.scale.toFixed(1);  
      
    document.getElementById('density').value = params.density;  
    document.getElementById('densityValue').textContent = params.density.toFixed(1);  
      
    document.getElementById('flow').value = params.flow;  
    document.getElementById('flowValue').textContent = params.flow.toFixed(2);  
      
    document.getElementById('harmony').value = params.harmony;  
    document.getElementById('harmonyValue').textContent = params.harmony.toFixed(2);  
      
    document.getElementById('contrast').value = params.contrast;  
    document.getElementById('contrastValue').textContent = params.contrast.toFixed(2);  
      
    document.getElementById('rotation').value = params.rotation;  
    document.getElementById('rotationValue').textContent = params.rotation.toFixed(2);  
      
    document.getElementById('speed').value = params.speed;  
    document.getElementById('speedValue').textContent = params.speed.toFixed(1);  
      
    document.getElementById('smooth').value = params.smooth;  
    document.getElementById('smoothValue').textContent = params.smooth.toFixed(1);  
  }  
    
  // Get color based on index or value  
  function getColor(index, alpha = 1) {  
    const colorsArray = [  
      colors.white,  
      colors.blue,  
      colors.green,  
      colors.purple,  
      colors.red,  
      colors.orange,  
      colors.yellow,  
      colors.cyan  
    ];  
      
    // Ensure index is within bounds  
    const safeIndex = Math.abs(Math.floor(index)) % colorsArray.length;  
    const hexColor = colorsArray[safeIndex];  
      
    // Convert hex to RGB with alpha  
    const r = parseInt(hexColor.slice(1, 3), 16);  
    const g = parseInt(hexColor.slice(3, 5), 16);  
    const b = parseInt(hexColor.slice(5, 7), 16);  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;  
  }  
    
  // Particle system  
  class Particle {  
    constructor() {  
      this.reset();  
    }  
      
    reset() {  
      // Position  
      this.x = Math.random() * canvas.width;  
      this.y = Math.random() * canvas.height;  
        
      // Target position (for smooth movement)  
      this.targetX = this.x;  
      this.targetY = this.y;  
        
      // Velocity  
      this.vx = 0;  
      this.vy = 0;  
        
      // Size and color  
      this.size = Math.random() * 2 + 1;  
      this.colorIndex = Math.floor(Math.random() * 8); // 8 colors  
      this.alpha = Math.random() * 0.5 + 0.5;  
        
      // Lifespan  
      this.life = Math.random() * 100 + 50;  
      this.maxLife = this.life;  
        
      // Phi-based properties  
      this.phiAngle = Math.random() * Math.PI * 2;  
      this.phiDistance = Math.random() * 100 + 50;  
      this.phiSpeed = (Math.random() * 0.02 - 0.01) * params.phiRes;  
        
      // Sacred geometry properties  
      this.sacredIndex = Math.floor(Math.random() * 1728);  
        
      // Calculate cubic position (x,y,z) in a 12x12x12 grid  
      this.cubicPosition = {  
        x: this.sacredIndex % 12,  
        y: Math.floor(this.sacredIndex / 12) % 12,  
        z: Math.floor(this.sacredIndex / 144)  
      };  
        
      // Wave properties  
      this.wavePhase = Math.random() * Math.PI * 2;  
      this.waveFrequency = Math.random() * 0.1 + 0.05;  
      this.waveAmplitude = Math.random() * 20 + 10;  
        
      // Ripple properties  
      this.rippleDistance = Math.random() * 200 + 50;  
      this.rippleSpeed = Math.random() * 0.02 + 0.01;  
      this.ripplePhase = Math.random() * Math.PI * 2;  
        
      // Folding properties  
      this.foldAxis = Math.floor(Math.random() * 3); // 0: x, 1: y, 2: diagonal  
      this.foldPhase = Math.random() * Math.PI * 2;  
      this.foldFrequency = Math.random() * 0.05 + 0.02;  
        
      // Pattern properties  
      this.patternAngle = Math.random() * Math.PI * 2;  
      this.patternRadius = Math.random() * 100 + 50;  
      this.patternIndex = Math.floor(Math.random() * 12);  
        
      // Source connection (distance from center)  
      this.sourceDistance = 0;  
      this.sourceAngle = 0;  
        
      // Trail (for smoother movement)  
      this.trail = [];  
      this.trailLength = Math.floor(Math.random() * 5) + 3;  
    }  
      
    update() {  
      // Decrease lifespan  
      this.life -= 0.5 * params.speed;  
        
      // Reset if dead  
      if (this.life <= 0) {  
        this.reset();  
        return;  
      }  
        
      // Calculate center (source of phenomenon)  
      const centerX = canvas.width / 2;  
      const centerY = canvas.height / 2;  
        
      // Calculate distance and angle from source  
      const dx = this.x - centerX;  
      const dy = this.y - centerY;  
      this.sourceDistance = Math.sqrt(dx * dx + dy * dy);  
      this.sourceAngle = Math.atan2(dy, dx);  
        
      // Calculate phi-based movement  
      this.phiAngle += this.phiSpeed * params.speed;  
        
      // Base movement (phi spiral)  
      let targetX = centerX + Math.cos(this.phiAngle) * this.phiDistance * params.scale;  
      let targetY = centerY + Math.sin(this.phiAngle) * this.phiDistance * params.scale;  
        
      // Apply harmony (creates more ordered patterns)  
      const harmonyFactor = params.harmony;  
      if (harmonyFactor > 0) {  
        const harmonicAngle = Math.floor(this.phiAngle / (Math.PI / 6)) * (Math.PI / 6);  
        targetX = centerX + Math.cos(harmonicAngle) * this.phiDistance * params.scale * harmonyFactor +   
                 Math.cos(this.phiAngle) * this.phiDistance * params.scale * (1 - harmonyFactor);  
        targetY = centerY + Math.sin(harmonicAngle) * this.phiDistance * params.scale * harmonyFactor +   
                 Math.sin(this.phiAngle) * this.phiDistance * params.scale * (1 - harmonyFactor);  
      }  
        
      // Apply flow (creates flowing motion)  
      const flowFactor = Math.sin(params.time * params.flow) * 0.5;  
      targetX += Math.cos(this.phiAngle * 2) * this.phiDistance * 0.2 * flowFactor;  
      targetY += Math.sin(this.phiAngle * 2) * this.phiDistance * 0.2 * flowFactor;  
        
      // Apply view mode specific behaviors  
      switch (params.viewMode) {  
        case 'waves':  
          // Wave motion  
          this.wavePhase += this.waveFrequency * params.speed;  
          const waveOffset = Math.sin(this.wavePhase) * this.waveAmplitude;  
            
          // Direction perpendicular to center  
          const perpAngle = this.sourceAngle + Math.PI / 2;  
          targetX += Math.cos(perpAngle) * waveOffset;  
          targetY += Math.sin(perpAngle) * waveOffset;  
          break;  
            
        case 'ripples':  
          // Ripple motion (expanding/contracting circles)  
          this.ripplePhase += this.rippleSpeed * params.speed;  
          const rippleFactor = Math.sin(this.ripplePhase);  
          const rippleDistance = this.rippleDistance * (1 + rippleFactor * 0.3);  
            
          targetX = centerX + Math.cos(this.sourceAngle) * rippleDistance;  
          targetY = centerY + Math.sin(this.sourceAngle) * rippleDistance;  
          break;  
            
        case 'folding':  
          // Folding motion (like paper folding)  
          this.foldPhase += this.foldFrequency * params.speed;  
          const foldFactor = Math.sin(this.foldPhase);  
            
          switch (this.foldAxis) {  
            case 0: // Fold along x-axis  
              if (targetY > centerY) {  
                targetY = centerY + (targetY - centerY) * (1 - foldFactor * 0.8);  
              } else {  
                targetY = centerY - (centerY - targetY) * (1 - foldFactor * 0.8);  
              }  
              break;  
            case 1: // Fold along y-axis  
              if (targetX > centerX) {  
                targetX = centerX + (targetX - centerX) * (1 - foldFactor * 0.8);  
              } else {  
                targetX = centerX - (centerX - targetX) * (1 - foldFactor * 0.8);  
              }  
              break;  
            case 2: // Fold along diagonal  
              const diagonalDist = (targetX - centerX + targetY - centerY) / 2;  
              if (diagonalDist > 0) {  
                targetX = centerX + (targetX - centerX) * (1 - foldFactor * 0.8);  
                targetY = centerY + (targetY - centerY) * (1 - foldFactor * 0.8);  
              } else {  
                targetX = centerX - (centerX - targetX) * (1 - foldFactor * 0.8);  
                targetY = centerY - (centerY - targetY) * (1 - foldFactor * 0.8);  
              }  
              break;  
          }  
          break;  
      }  
        
      // Apply pattern influence if active  
      if (params.pattern !== 'none' && params.patternIntensity > 0) {  
        let patternX = centerX;  
        let patternY = centerY;  
          
        switch (params.pattern) {  
          case 'spiral':  
            // Logarithmic spiral  
            const spiralGrowth = 0.1;  
            const spiralAngle = this.patternIndex * Math.PI / 6 + params.time * 0.1;  
            const spiralRadius = this.patternRadius * Math.exp(spiralGrowth * spiralAngle);  
            patternX = centerX + Math.cos(spiralAngle) * spiralRadius;  
            patternY = centerY + Math.sin(spiralAngle) * spiralRadius;  
            break;  
              
          case 'mandala':  
            // Mandala pattern (symmetric circular pattern)  
            const mandalaAngle = this.patternIndex * (Math.PI / 6) + params.time * 0.05;  
            const mandalaRadius = this.patternRadius * (0.8 + Math.sin(params.time * 0.2) * 0.2);  
            patternX = centerX + Math.cos(mandalaAngle) * mandalaRadius;  
            patternY = centerY + Math.sin(mandalaAngle) * mandalaRadius;  
            break;  
              
          case 'vortex':  
            // Vortex pattern (spiraling inward/outward)  
            const vortexPhase = params.time * 0.2;  
            const vortexRadius = this.patternRadius * (0.5 + Math.sin(vortexPhase) * 0.5);  
            const vortexAngle = this.patternAngle + vortexPhase;  
            patternX = centerX + Math.cos(vortexAngle) * vortexRadius;  
            patternY = centerY + Math.sin(vortexAngle) * vortexRadius;  
            break;  
              
          case 'symmetry':  
            // Symmetrical pattern  
            const symAngle = Math.floor(this.patternAngle * 12 / (Math.PI * 2)) * (Math.PI * 2 / 12);  
            const symRadius = this.patternRadius;  
            patternX = centerX + Math.cos(symAngle) * symRadius;  
            patternY = centerY + Math.sin(symAngle) * symRadius;  
            break;  
        }  
          
        // Blend pattern with base movement  
        targetX = targetX * (1 - params.patternIntensity) + patternX * params.patternIntensity;  
        targetY = targetY * (1 - params.patternIntensity) + patternY * params.patternIntensity;  
      }  
        
      // Apply mouse influence  
      const mouseInfluence = 0.3;  
      const mouseDx = params.mouseX * canvas.width - this.x;  
      const mouseDy = params.mouseY * canvas.height - this.y;  
      const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);  
      if (mouseDist < 200) {  
        const force = (200 - mouseDist) / 200 * mouseInfluence;  
        targetX += mouseDx * force;  
        targetY += mouseDy * force;  
      }  
        
      // Sacred cubic influence when depth is 12  
      if (params.depth === 12) {  
        // Add subtle cubic influence  
        const cubicFactor = 0.2;  
          
        // Map cubic position to screen space  
        const cubicX = centerX + (this.cubicPosition.x - 5.5) * 30;  
        const cubicY = centerY + (this.cubicPosition.y - 5.5) * 30;  
          
        // Apply cubic influence  
        targetX = targetX * (1 - cubicFactor) + cubicX * cubicFactor;  
        targetY = targetY * (1 - cubicFactor) + cubicY * cubicFactor;  
          
        // Special color for sacred number  
        if (params.depth === 12) {  
          // Use green for sacred number  
          this.colorIndex = 2; // Green index  
        }  
      }  
        
      // Set target position  
      this.targetX = targetX;  
      this.targetY = targetY;  
        
      // Smooth movement based on smoothness parameter  
      const smoothFactor = params.smooth;  
      this.x += (this.targetX - this.x) * (1 - smoothFactor) * params.speed;  
      this.y += (this.targetY - this.y) * (1 - smoothFactor) * params.speed;  
        
      // Update trail  
      this.trail.unshift({ x: this.x, y: this.y });  
      if (this.trail.length > this.trailLength) {  
        this.trail.pop();  
      }  
        
      // Update color  
      this.colorIndex = (this.colorIndex + params.contrast * 0.05 * params.speed) % 8;  
    }  
      
    draw() {  
      const lifeRatio = this.life / this.maxLife;  
      let size = this.size * lifeRatio * params.density;  
        
      // Special rendering for sacred number 1728  
      if (params.depth === 12) {  
        size *= 1.2; // Slightly larger particles for sacred mode  
      }  
        
      // Draw trail if smoothness is high  
      if (params.smooth > 0.5 && this.trail.length > 1) {  
        ctx.beginPath();  
        ctx.moveTo(this.trail[0].x, this.trail[0].y);  
          
        for (let i = 1; i < this.trail.length; i++) {  
          ctx.lineTo(this.trail[i].x, this.trail[i].y);  
        }  
          
        const trailColor = getColor(this.colorIndex, this.alpha * lifeRatio * 0.3);  
        ctx.strokeStyle = trailColor;  
        ctx.lineWidth = size * 0.5;  
        ctx.stroke();  
      }  
        
      // Draw particle  
      ctx.beginPath();  
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);  
        
      // Get color  
      let fillColor;  
      if (params.depth === 12) {  
        // Green for sacred number  
        fillColor = getColor(2, this.alpha * lifeRatio);  
      } else {  
        fillColor = getColor(this.colorIndex, this.alpha * lifeRatio);  
      }  
        
      ctx.fillStyle = fillColor;  
      ctx.fill();  
        
      // Draw connection to source for some particles  
      if (Math.random() < 0.05 * params.flow && this.sourceDistance < 300) {  
        ctx.beginPath();  
        ctx.moveTo(this.x, this.y);  
        ctx.lineTo(canvas.width / 2, canvas.height / 2);  
        ctx.strokeStyle = getColor(this.colorIndex, this.alpha * lifeRatio * 0.1);  
        ctx.lineWidth = 0.5;  
        ctx.stroke();  
      }  
    }  
  }  
    
  // Create particle system  
  const particles = [];  
    
  function initParticles() {  
    // Initialize with exactly 1728 particles for depth 12  
    const initialCount = 1728;  
    for (let i = 0; i < initialCount; i++) {  
      particles.push(new Particle());  
    }  
  }  
    
  // Draw sacred geometry patterns  
  function drawSacredGeometry() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;  
    const size = Math.min(canvas.width, canvas.height) * 0.4;  
      
    // Draw phi spiral  
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';  
    ctx.lineWidth = 1;  
    ctx.beginPath();  
      
    let radius = 10;  
    let angle = 0;  
      
    for (let i = 0; i < 144; i++) {  
      const x = centerX + Math.cos(angle) * radius;  
      const y = centerY + Math.sin(angle) * radius;  
        
      if (i === 0) {  
        ctx.moveTo(x, y);  
      } else {  
        ctx.lineTo(x, y);  
      }  
        
      angle += 0.1 * params.phiRes;  
      radius += 0.5 * params.scale;  
    }  
      
    ctx.stroke();  
      
    // Draw dodecahedron projection (12-sided figure)  
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';  
    ctx.lineWidth = 1;  
    ctx.beginPath();  
      
    for (let i = 0; i < 12; i++) {  
      const angle1 = (i / 12) * Math.PI * 2;  
      const angle2 = ((i + 1) / 12) * Math.PI * 2;  
        
      const x1 = centerX + Math.cos(angle1) * size;  
      const y1 = centerY + Math.sin(angle1) * size;  
      const x2 = centerX + Math.cos(angle2) * size;  
      const y2 = centerY + Math.sin(angle2) * size;  
        
      ctx.moveTo(x1, y1);  
      ctx.lineTo(x2, y2);  
        
      // Connect to center with phi ratio  
      const innerX = centerX + Math.cos(angle1) * size / 1.618;  
      const innerY = centerY + Math.sin(angle1) * size / 1.618;  
        
      ctx.moveTo(centerX, centerY);  
      ctx.lineTo(innerX, innerY);  
    }  
      
    ctx.stroke();  
  }  
    
  // Draw energy source (center of phenomenon)  
  function drawEnergySource() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;  
      
    // Draw subtle source  
    const sourceSize = 3 + Math.sin(params.time * 2) * 1;  
      
    // Draw core  
    ctx.beginPath();  
    ctx.arc(centerX, centerY, sourceSize, 0, Math.PI * 2);  
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';  
    ctx.fill();  
      
    // Draw subtle rays  
    const rayCount = 12;  
    for (let i = 0; i < rayCount; i++) {  
      const angle = (i / rayCount) * Math.PI * 2 + params.time * 0.2;  
      const length = 30 + Math.sin(params.time * 3 + i) * 10;  
        
      ctx.beginPath();  
      ctx.moveTo(centerX, centerY);  
      ctx.lineTo(  
        centerX + Math.cos(angle) * length,  
        centerY + Math.sin(angle) * length  
      );  
        
      const rayGradient = ctx.createLinearGradient(  
        centerX, centerY,  
        centerX + Math.cos(angle) * length,  
        centerY + Math.sin(angle) * length  
      );  
        
      if (params.depth === 12) {  
        rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');  
        rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  
      } else {  
        rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');  
        rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  
      }  
        
      ctx.strokeStyle = rayGradient;  
      ctx.lineWidth = 0.5;  
      ctx.stroke();  
    }  
  }  
    
  // Draw wave pattern overlay  
  function drawWavePattern() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;  
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;  
      
    // Draw concentric wave circles  
    for (let radius = 20; radius < maxRadius; radius += 20) {  
      const waveOffset = Math.sin(params.time * 0.5 + radius * 0.01) * 5;  
      const waveRadius = radius + waveOffset;  
        
      ctx.beginPath();  
      ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);  
        
      const waveColor = 'rgba(255, 255, 255, 0.05)';  
        
      ctx.strokeStyle = waveColor;  
      ctx.lineWidth = 0.5;  
      ctx.stroke();  
    }  
  }  
    
  // Draw ripple pattern overlay  
  function drawRipplePattern() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;  
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.8;  
      
    // Draw expanding ripples  
    for (let i = 0; i < 5; i++) {  
      const ripplePhase = (params.time * 0.3 + i * 0.2) % 1;  
      const rippleRadius = ripplePhase * maxRadius;  
        
      ctx.beginPath();  
      ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2);  
        
      const alpha = 0.1 * (1 - ripplePhase);  
      const rippleColor = `rgba(255, 255, 255, ${alpha})`;  
        
      ctx.strokeStyle = rippleColor;  
      ctx.lineWidth = 0.5;  
      ctx.stroke();  
    }  
  }  
    
  // Draw folding pattern overlay  
  function drawFoldingPattern() {  
    const centerX = canvas.width / 2;  
    const centerY = canvas.height / 2;  
    const size = Math.min(canvas.width, canvas.height) * 0.4;  
      
    // Draw folding grid  
    const gridSize = 10;  
    const cellSize = size / gridSize;  
      
    for (let i = -gridSize; i <= gridSize; i++) {  
      const foldOffset = Math.sin(params.time * 0.5 + Math.abs(i) * 0.2) * cellSize * 0.5;  
        
      // Horizontal fold line  
      ctx.beginPath();  
      ctx.moveTo(centerX - size, centerY + i * cellSize + foldOffset);  
      ctx.lineTo(centerX + size, centerY + i * cellSize - foldOffset);  
        
      const foldColor = 'rgba(255, 255, 255, 0.05)';  
        
      ctx.strokeStyle = foldColor;  
      ctx.lineWidth = 0.5;  
      ctx.stroke();  
        
      // Vertical fold line  
      ctx.beginPath();  
      ctx.moveTo(centerX + i * cellSize + foldOffset, centerY - size);  
      ctx.lineTo(centerX + i * cellSize - foldOffset, centerY + size);  
      ctx.stroke();  
    }  
  }  
    
  // Animation loop  
  function animate() {  
    const now = performance.now();  
    const elapsed = now - lastTime;  
      
    // Update FPS counter once per second  
    frameCount++;  
    if (elapsed > 1000) {  
      fps = Math.round(frameCount * 1000 / elapsed);  
      document.getElementById('fps').textContent = fps;  
      frameCount = 0;  
      lastTime = now;  
    }  
      
    // Clear canvas with fade effect  
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
      
    // Update time  
    params.time += 0.01 * params.speed;  
      
    // Update pattern intensity (smooth transition)  
    if (params.pattern !== 'none' && params.patternIntensity < 1) {  
      params.patternIntensity += 0.02;  
      if (params.patternIntensity > 1) params.patternIntensity = 1;  
    } else if (params.pattern === 'none' && params.patternIntensity > 0) {  
      params.patternIntensity -= 0.02;  
      if (params.patternIntensity < 0) params.patternIntensity = 0;  
    }  
      
    // Adjust particle count based on depth  
    let targetCount;  
    if (params.depth === 12) {  
      // Exactly 1728 particles for sacred number  
      targetCount = 1728;  
    } else {  
      targetCount = params.depth * 144;  
    }  
      
    while (particles.length < targetCount) {  
      particles.push(new Particle());  
    }  
    while (particles.length > targetCount) {  
      particles.pop();  
    }  
      
    // Update particle count display  
    document.getElementById('particleCount').textContent = particles.length;  
      
    // Update and draw particles  
    particles.forEach(particle => {  
      particle.update();  
      particle.draw();  
    });  
      
    // Draw view mode specific overlays  
    switch (params.viewMode) {  
      case 'waves':  
        drawWavePattern();  
        break;  
      case 'ripples':  
        drawRipplePattern();  
        break;  
      case 'folding':  
        drawFoldingPattern();  
        break;  
    }  
      
    // Draw sacred geometry overlay when depth is 12  
    if (params.depth === 12) {  
      drawSacredGeometry();  
    }  
      
    // Draw energy source  
    drawEnergySource();  
      
    requestAnimationFrame(animate);  
  }  
    
  // Initialize and start  
  setupControls();  
  initParticles();  
  updateSacredIndicator();  
  animate();  
</script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601ae33c6b3c95d',t:'MTc1MjY3MDgwNS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
