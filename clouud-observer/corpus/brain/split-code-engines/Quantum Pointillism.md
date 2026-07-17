# Quantum Pointillism  
  
![CONTROLS](Attachments/A78C08AF-474F-462A-9CDD-73EE6E2E495B.heic)  
  
  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Quantum Pointillism Engine</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;600&display=swap');  
      
    :root {  
      --neon-green: #39ff14;  
      --neon-blue: #4deeea;  
      --neon-purple: #7e1fff;  
      --dark-bg: #0a0a0a;  
    }  
      
    body {  
      margin: 0;  
      background: var(--dark-bg);  
      color: #eee;  
      font-family: 'Space Grotesk', sans-serif;  
      overflow: hidden;  
    }  
      
    canvas {  
      display: block;  
      position: absolute;  
      top: 0;  
      left: 0;  
    }  
      
    .mono {  
      font-family: 'JetBrains Mono', monospace;  
    }  
      
    .neon-text {  
      text-shadow: 0 0 5px var(--neon-green), 0 0 10px var(--neon-green);  
      color: var(--neon-green);  
    }  
      
    .neon-border {  
      box-shadow: 0 0 5px var(--neon-green), inset 0 0 5px var(--neon-green);  
      border-color: var(--neon-green);  
    }  
      
    .panel {  
      background: rgba(10, 10, 10, 0.85);  
      border: 1px solid rgba(57, 255, 20, 0.3);  
      backdrop-filter: blur(10px);  
    }  
      
    .slider {  
      -webkit-appearance: none;  
      height: 2px;  
      background: rgba(57, 255, 20, 0.3);  
      outline: none;  
    }  
      
    .slider::-webkit-slider-thumb {  
      -webkit-appearance: none;  
      width: 12px;  
      height: 12px;  
      border-radius: 0;  
      transform: rotate(45deg);  
      background: var(--neon-green);  
      cursor: pointer;  
      transition: all 0.2s;  
    }  
      
    .slider::-webkit-slider-thumb:hover {  
      background: #fff;  
      box-shadow: 0 0 10px var(--neon-green);  
    }  
      
    .crypto-btn {  
      background: rgba(10, 10, 10, 0.8);  
      border: 1px solid var(--neon-green);  
      color: var(--neon-green);  
      font-family: 'JetBrains Mono', monospace;  
      transition: all 0.2s;  
    }  
      
    .crypto-btn:hover {  
      background: var(--neon-green);  
      color: #000;  
      box-shadow: 0 0 10px var(--neon-green);  
    }  
      
    .file-input {  
      display: none;  
    }  
      
    .file-label {  
      display: inline-block;  
      padding: 8px 16px;  
      cursor: pointer;  
      background: rgba(10, 10, 10, 0.8);  
      border: 1px dashed var(--neon-green);  
      color: var(--neon-green);  
      font-family: 'JetBrains Mono', monospace;  
      transition: all 0.2s;  
    }  
      
    .file-label:hover {  
      background: rgba(57, 255, 20, 0.2);  
      box-shadow: 0 0 10px var(--neon-green);  
    }  
      
    .matrix-bg {  
      position: fixed;  
      top: 0;  
      left: 0;  
      width: 100%;  
      height: 100%;  
      z-index: -1;  
      opacity: 0.15;  
    }  
      
    @keyframes glitch {  
      0% { transform: translate(0); }  
      20% { transform: translate(-2px, 2px); }  
      40% { transform: translate(-2px, -2px); }  
      60% { transform: translate(2px, 2px); }  
      80% { transform: translate(2px, -2px); }  
      100% { transform: translate(0); }  
    }  
      
    .glitch {  
      animation: glitch 0.5s infinite;  
      animation-timing-function: steps(1);  
    }  
      
    .tab {  
      cursor: pointer;  
      transition: all 0.2s;  
    }  
      
    .tab.active {  
      color: var(--neon-green);  
      border-bottom: 2px solid var(--neon-green);  
    }  
      
    .tab:hover:not(.active) {  
      color: #fff;  
    }  
      
    .hash-display {  
      font-size: 10px;  
      word-break: break-all;  
      max-height: 60px;  
      overflow-y: auto;  
      scrollbar-width: thin;  
      scrollbar-color: var(--neon-green) rgba(10, 10, 10, 0.5);  
    }  
      
    .hash-display::-webkit-scrollbar {  
      width: 4px;  
    }  
      
    .hash-display::-webkit-scrollbar-track {  
      background: rgba(10, 10, 10, 0.5);  
    }  
      
    .hash-display::-webkit-scrollbar-thumb {  
      background-color: var(--neon-green);  
    }  
      
    .grid-overlay {  
      position: absolute;  
      top: 0;  
      left: 0;  
      width: 100%;  
      height: 100%;  
      background-image:   
        linear-gradient(rgba(57, 255, 20, 0.05) 1px, transparent 1px),  
        linear-gradient(90deg, rgba(57, 255, 20, 0.05) 1px, transparent 1px);  
      background-size: 20px 20px;  
      pointer-events: none;  
    }  
      
    .noise {  
      position: fixed;  
      top: 0;  
      left: 0;  
      width: 100%;  
      height: 100%;  
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABBlJREFUaEPtmttx2zAQRQ+YTgKXYKcCKxVEqSB0BZYrsFyB5QosVWCmgsgVWK7ATgdSCUwqMHfIIYXhA+ADpGhnMpzxjCgQu3vvLhbL1eHh4WF1RJ/VEeGQCuS5vbQqkSqRZ0bAm9pqtVoul8tn5qEVd7vdbnV2dvbX9/BisZiS53w+X15eXk6e+/7r62vvGF9fX0eP7e/v/4iB8QJ5f3+fTKfTP+PxeEKwNkA+Pj4mZ2dnfwaDwXQ0Go0JlgCJ2OfnZ/Ixm81mBG3CJHg8Hs/6wDhBCIJgCWI6nU5JwARLYLPZbHZ+fj4ZDodTgrUB4gJCMNfX15Obm5sJQXXBfHt7m1xcXPwhWBcYgiVYgjWB+AJxgfHBdIHxBmKC+fr6mpBakiJdYLxKxAXTBtNWMt4l0gWGYOlDMKSWC4xXiZhgbm9vJ6RWFxhvIDYwt7e3k7u7O4IlMARMsARrgvEGYoIh6JubmwmVjA2MdyCmkrm/v58QDMGaYLyAmGBub28nBGMD4x2ICYZKhWBsYLwCMcEQDJVKFxjvQFwwBGsD4w3EBkOwBGsD4xWIDQzBEqwJxjsQFxgTjDcgNjCPj4+T8Xj8B4wNjFcgLjAEawPjHYgJhkqFYG1gvAKxgSFYgjXBeAdiA0OwBGuC8QbEBYZgbWC8ArGBIViCNcF4B+ICQ7A2MF6B2MAQLMGaYLwDcYEhWBsYr0BsYAiWYE0w3oG4wBCsDYxXIDYwBEuwJhjvQFxgCNYGxisQGxiCJVgTjHcgLjAEawPjFYgNDMESrAnGOxAXGIK1gfEKxAaGYAnWBOMdiAsMwdrAeAViA0OwBGuC8Q7EBYZgbWC8ArGBIViCNcF4B+ICQ7A2MF6B2MAQLMGaYLwDcYEhWBsYr0BsYAiWYE0w3oG4wBCsDYxXIDYwBEuwJhjvQFxgCNYGxisQGxiCJVgTjHcgLjAEawPjFYgNDMESrAnGOxAXGIK1gfEKxAaGYAnWBOMdiAsMwdrAeAViA0OwBGuC8Q7EBYZgbWC8ArGBIViCNcF4B+ICQ7A2MF6B2MAQLMGaYLwDcYEhWBsYr0BsYAiWYE0w3oG4wBCsDYxXIDYwBEuwJhjvQFxgCNYGxisQGxiCJVgTjHcgLjAEawPjFYgNDMESrAnGOxAXGIK1gfEKxAaGYAnWBOMdiAsMwdrAeAViA0OwBGuC8Q7EBYZgbWC8ArGBIViCNcF4B+ICQ7A2MF6B2MAQLMGaYLwDcYEhWBsYr0BsYAiWYE0w3oG4wBCsDYxXIDYwBEuwJhjvQFxgCNYGxisQGxiCJVgTjHcgLjAEawPjFYgNDMESrAnGOxAXGIK1gfEKxAaGYAnWBOMdiAsMwdrAeAViA0OwBGuC8Q7EBYZgbWC8ArGBIViCNcF4B+ICQ7A2MF6B2MAQLMGaYP4DwqVMI1f0wicAAAAASUVORK5CYII=');  
      opacity: 0.03;  
      pointer-events: none;  
      z-index: 1;  
    }  
  </style>  
</head>  
<body>  
  <div class="noise"></div>  
  <canvas id="matrixCanvas" class="matrix-bg"></canvas>  
  <canvas id="canvas"></canvas>  
  <div class="grid-overlay"></div>  
    
  <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-10">  
    <div class="absolute top-2 left-2 text-xs text-green-400 mono">  
      <span id="fps-counter">60 FPS</span>  
    </div>  
  </div>  
  
  <div id="control-panel" class="panel fixed top-4 right-4 w-80 p-4 rounded z-20">  
    <div class="flex justify-between items-center mb-4">  
      <h2 class="text-lg font-bold neon-text">QUANTUM POINTILLISM</h2>  
      <div class="flex space-x-1">  
        <div class="h-2 w-2 rounded-full bg-red-500"></div>  
        <div class="h-2 w-2 rounded-full bg-yellow-500"></div>  
        <div class="h-2 w-2 rounded-full bg-green-500"></div>  
      </div>  
    </div>  
      
    <div class="flex mb-4">  
      <div class="tab active px-3 py-1" data-tab="controls">CONTROLS</div>  
      <div class="tab px-3 py-1" data-tab="data">DATA</div>  
      <div class="tab px-3 py-1" data-tab="hash">HASH</div>  
    </div>  
      
    <div id="tab-controls" class="tab-content">  
      <div class="mb-4">  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">ENTROPY</label>  
          <span id="entropy" class="text-xs mono neon-text">0.00</span>  
        </div>  
          
        <div class="mb-4">  
          <div class="flex justify-between items-center mb-1">  
            <label class="text-xs text-gray-400">DOT SPACING</label>  
            <span id="spacing-value" class="text-xs mono neon-text">6</span>  
          </div>  
          <input type="range" id="spacing" min="2" max="20" value="6" class="slider w-full">  
        </div>  
          
        <div class="mb-4">  
          <div class="flex justify-between items-center mb-1">  
            <label class="text-xs text-gray-400">DOT SIZE</label>  
            <span id="size-value" class="text-xs mono neon-text">2</span>  
          </div>  
          <input type="range" id="size" min="1" max="10" value="2" class="slider w-full">  
        </div>  
          
        <div class="mb-4">  
          <div class="flex justify-between items-center mb-1">  
            <label class="text-xs text-gray-400">QUANTUM NOISE</label>  
            <span id="noise-value" class="text-xs mono neon-text">0</span>  
          </div>  
          <input type="range" id="noise" min="0" max="100" value="0" class="slider w-full">  
        </div>  
          
        <div class="mb-4">  
          <div class="flex justify-between items-center mb-1">  
            <label class="text-xs text-gray-400">ALGORITHM</label>  
          </div>  
          <select id="algorithm" class="w-full bg-black border border-green-500 text-green-500 p-1 text-xs mono">  
            <option value="circle">CIRCLE</option>  
            <option value="square">SQUARE</option>  
            <option value="diamond">DIAMOND</option>  
            <option value="quantum">QUANTUM</option>  
          </select>  
        </div>  
      </div>  
        
      <div class="flex space-x-2 mb-4">  
        <label class="file-label text-xs flex-1 text-center">  
          <input type="file" id="imgLoader" accept="image/*" class="file-input">  
          UPLOAD IMAGE  
        </label>  
        <button id="random-btn" class="crypto-btn text-xs px-3 py-1 flex-1">RANDOM</button>  
      </div>  
        
      <div class="flex space-x-2">  
        <button id="invert-btn" class="crypto-btn text-xs px-3 py-1 flex-1">INVERT</button>  
        <button id="glitch-btn" class="crypto-btn text-xs px-3 py-1 flex-1">GLITCH</button>  
        <button id="export-btn" class="crypto-btn text-xs px-3 py-1 flex-1">EXPORT</button>  
      </div>  
    </div>  
      
    <div id="tab-data" class="tab-content hidden">  
      <div class="mb-4">  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">DIMENSIONS</label>  
          <span id="dimensions" class="text-xs mono neon-text">0 x 0</span>  
        </div>  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">POINTS</label>  
          <span id="points" class="text-xs mono neon-text">0</span>  
        </div>  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">SHANNON ENTROPY</label>  
          <span id="shannon-entropy" class="text-xs mono neon-text">0.00</span>  
        </div>  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">COLOR VARIANCE</label>  
          <span id="color-variance" class="text-xs mono neon-text">0.00</span>  
        </div>  
        <div class="flex justify-between items-center mb-1">  
          <label class="text-xs text-gray-400">QUANTUM STATE</label>  
          <span id="quantum-state" class="text-xs mono neon-text">STABLE</span>  
        </div>  
      </div>  
        
      <div class="border border-green-900 p-2 mb-4">  
        <div class="text-xs text-gray-400 mb-1">COLOR DISTRIBUTION</div>  
        <canvas id="histogram" class="w-full h-24"></canvas>  
      </div>  
        
      <div class="text-xs text-gray-500 mono">  
        <div class="mb-1">LAST PROCESSED: <span id="timestamp" class="text-green-500">--</span></div>  
        <div>BLOCKCHAIN HEIGHT: <span id="block-height" class="text-green-500">21,908,452</span></div>  
      </div>  
    </div>  
      
    <div id="tab-hash" class="tab-content hidden">  
      <div class="mb-2">  
        <div class="text-xs text-gray-400 mb-1">SHA-256 HASH</div>  
        <div id="sha256-hash" class="hash-display p-2 bg-black border border-green-900 text-green-500 mono">  
          Waiting for image processing...  
        </div>  
      </div>  
        
      <div class="mb-4">  
        <div class="text-xs text-gray-400 mb-1">MERKLE ROOT</div>  
        <div id="merkle-root" class="hash-display p-2 bg-black border border-green-900 text-green-500 mono">  
          Waiting for image processing...  
        </div>  
      </div>  
        
      <div class="mb-4">  
        <div class="text-xs text-gray-400 mb-1">QUANTUM SIGNATURE</div>  
        <div class="relative">  
          <canvas id="signature-canvas" class="w-full h-16 bg-black border border-green-900"></canvas>  
          <div id="signature-overlay" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-green-500 mono">  
            No image loaded  
          </div>  
        </div>  
      </div>  
        
      <div class="flex space-x-2">  
        <button id="verify-btn" class="crypto-btn text-xs px-3 py-1 flex-1">VERIFY</button>  
        <button id="mint-btn" class="crypto-btn text-xs px-3 py-1 flex-1">MINT NFT</button>  
      </div>  
    </div>  
  </div>  
  
  <script>  
    // Canvas setup  
    const canvas = document.getElementById('canvas');  
    const ctx = canvas.getContext('2d');  
    const histCanvas = document.getElementById('histogram');  
    const histCtx = histCanvas.getContext('2d');  
    const signatureCanvas = document.getElementById('signature-canvas');  
    const signatureCtx = signatureCanvas.getContext('2d');  
    const matrixCanvas = document.getElementById('matrixCanvas');  
    const matrixCtx = matrixCanvas.getContext('2d');  
      
    // UI elements  
    const entropyDisplay = document.getElementById('entropy');  
    const spacingSlider = document.getElementById('spacing');  
    const spacingValue = document.getElementById('spacing-value');  
    const sizeSlider = document.getElementById('size');  
    const sizeValue = document.getElementById('size-value');  
    const noiseSlider = document.getElementById('noise');  
    const noiseValue = document.getElementById('noise-value');  
    const algorithmSelect = document.getElementById('algorithm');  
    const dimensionsDisplay = document.getElementById('dimensions');  
    const pointsDisplay = document.getElementById('points');  
    const shannonEntropyDisplay = document.getElementById('shannon-entropy');  
    const colorVarianceDisplay = document.getElementById('color-variance');  
    const quantumStateDisplay = document.getElementById('quantum-state');  
    const sha256HashDisplay = document.getElementById('sha256-hash');  
    const merkleRootDisplay = document.getElementById('merkle-root');  
    const signatureOverlay = document.getElementById('signature-overlay');  
    const timestampDisplay = document.getElementById('timestamp');  
    const fpsCounter = document.getElementById('fps-counter');  
      
    // Tab navigation  
    const tabs = document.querySelectorAll('.tab');  
    const tabContents = document.querySelectorAll('.tab-content');  
      
    tabs.forEach(tab => {  
      tab.addEventListener('click', () => {  
        tabs.forEach(t => t.classList.remove('active'));  
        tabContents.forEach(c => c.classList.add('hidden'));  
        tab.classList.add('active');  
        document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');  
      });  
    });  
      
    // Variables  
    let img = new Image();  
    let originalImageData = null;  
    let spacing = parseInt(spacingSlider.value);  
    let dotSize = parseInt(sizeSlider.value);  
    let noiseLevel = parseInt(noiseSlider.value);  
    let algorithm = algorithmSelect.value;  
    let isInverted = false;  
    let isGlitching = false;  
    let glitchInterval = null;  
    let lastFrameTime = 0;  
    let frameCount = 0;  
      
    // Matrix rain effect  
    const fontSize = 14;  
    const columns = Math.floor(window.innerWidth / fontSize);  
    const drops = [];  
      
    // Initialize matrix effect  
    function initMatrix() {  
      matrixCanvas.width = window.innerWidth;  
      matrixCanvas.height = window.innerHeight;  
      matrixCtx.font = `${fontSize}px 'JetBrains Mono'`;  
        
      for (let i = 0; i < columns; i++) {  
        drops[i] = 1;  
      }  
        
      drawMatrix();  
    }  
      
    // Draw matrix rain  
    function drawMatrix() {  
      matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';  
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);  
        
      matrixCtx.fillStyle = '#39ff14';  
        
      for (let i = 0; i < drops.length; i++) {  
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);  
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);  
          
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {  
          drops[i] = 0;  
        }  
          
        drops[i]++;  
      }  
        
      requestAnimationFrame(drawMatrix);  
    }  
      
    // Compute Shannon entropy  
    function computeEntropy(data) {  
      let hist = new Array(256).fill(0);  
      let total = 0;  
        
      for (let i = 0; i < data.length; i += 4) {  
        hist[data[i]]++;  
        total++;  
      }  
        
      return -hist.reduce((acc, p) => {  
        if (p === 0) return acc;  
        p = p / total;  
        return acc + p * Math.log2(p);  
      }, 0).toFixed(2);  
    }  
      
    // Compute color variance  
    function computeColorVariance(data) {  
      let r = 0, g = 0, b = 0;  
      let rSq = 0, gSq = 0, bSq = 0;  
      let count = 0;  
        
      for (let i = 0; i < data.length; i += 4) {  
        r += data[i];  
        g += data[i + 1];  
        b += data[i + 2];  
          
        rSq += data[i] * data[i];  
        gSq += data[i + 1] * data[i + 1];  
        bSq += data[i + 2] * data[i + 2];  
          
        count++;  
      }  
        
      r /= count;  
      g /= count;  
      b /= count;  
        
      rSq /= count;  
      gSq /= count;  
      bSq /= count;  
        
      const rVar = rSq - r * r;  
      const gVar = gSq - g * g;  
      const bVar = bSq - b * b;  
        
      return ((rVar + gVar + bVar) / 3).toFixed(2);  
    }  
      
    // Draw color histogram  
    function drawHistogram(data) {  
      const histR = new Array(256).fill(0);  
      const histG = new Array(256).fill(0);  
      const histB = new Array(256).fill(0);  
        
      for (let i = 0; i < data.length; i += 4) {  
        histR[data[i]]++;  
        histG[data[i + 1]]++;  
        histB[data[i + 2]]++;  
      }  
        
      const max = Math.max(  
        ...histR,  
        ...histG,  
        ...histB  
      );  
        
      histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);  
        
      const barWidth = histCanvas.width / 256;  
        
      // Draw red histogram  
      histCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';  
      for (let i = 0; i < 256; i++) {  
        const h = (histR[i] / max) * histCanvas.height;  
        histCtx.fillRect(i * barWidth, histCanvas.height - h, barWidth, h);  
      }  
        
      // Draw green histogram  
      histCtx.fillStyle = 'rgba(0, 255, 0, 0.5)';  
      for (let i = 0; i < 256; i++) {  
        const h = (histG[i] / max) * histCanvas.height;  
        histCtx.fillRect(i * barWidth, histCanvas.height - h, barWidth, h);  
      }  
        
      // Draw blue histogram  
      histCtx.fillStyle = 'rgba(0, 0, 255, 0.5)';  
      for (let i = 0; i < 256; i++) {  
        const h = (histB[i] / max) * histCanvas.height;  
        histCtx.fillRect(i * barWidth, histCanvas.height - h, barWidth, h);  
      }  
    }  
      
    // Generate SHA-256 hash (simplified simulation)  
    function generateSHA256(data) {  
      let hash = '';  
      const chars = '0123456789abcdef';  
        
      // Simple hash simulation based on image data  
      let seed = 0;  
      for (let i = 0; i < Math.min(1000, data.length); i += 4) {  
        seed += data[i] + data[i + 1] + data[i + 2];  
      }  
        
      // Generate 64 hex characters  
      for (let i = 0; i < 64; i++) {  
        const index = Math.floor((Math.sin(seed + i) * 10000) % 16);  
        hash += chars[Math.abs(index)];  
      }  
        
      return hash;  
    }  
      
    // Generate Merkle root (simplified simulation)  
    function generateMerkleRoot(hash) {  
      let merkle = '';  
        
      // Simple merkle root simulation  
      for (let i = 0; i < 64; i++) {  
        const charCode = hash.charCodeAt(i % hash.length);  
        merkle += hash[(charCode + i) % hash.length];  
      }  
        
      return merkle;  
    }  
      
    // Draw quantum signature visualization  
    function drawSignature(data) {  
      signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);  
        
      const width = signatureCanvas.width;  
      const height = signatureCanvas.height;  
        
      // Create a simplified visualization based on image data  
      const step = Math.floor(data.length / 1000);  
        
      signatureCtx.strokeStyle = '#39ff14';  
      signatureCtx.lineWidth = 1;  
      signatureCtx.beginPath();  
        
      for (let i = 0; i < width; i++) {  
        const dataIndex = (i * step) % data.length;  
        const y = height / 2 + (data[dataIndex] - 128) / 128 * (height / 2 - 5);  
          
        if (i === 0) {  
          signatureCtx.moveTo(i, y);  
        } else {  
          signatureCtx.lineTo(i, y);  
        }  
      }  
        
      signatureCtx.stroke();  
        
      // Add some quantum noise  
      for (let i = 0; i < 50; i++) {  
        const x = Math.random() * width;  
        const y = Math.random() * height;  
        const size = Math.random() * 2 + 1;  
          
        signatureCtx.fillStyle = 'rgba(57, 255, 20, 0.5)';  
        signatureCtx.fillRect(x, y, size, size);  
      }  
        
      signatureOverlay.style.display = 'none';  
    }  
      
    // Draw dots based on image data  
    function drawDots(imageData) {  
      ctx.clearRect(0, 0, canvas.width, canvas.height);  
        
      const width = imageData.width;  
      const height = imageData.height;  
      let pointCount = 0;  
        
      for (let y = 0; y < height; y += spacing) {  
        for (let x = 0; x < width; x += spacing) {  
          const i = (y * width + x) * 4;  
          let r = imageData.data[i];  
          let g = imageData.data[i + 1];  
          let b = imageData.data[i + 2];  
            
          // Apply inversion if enabled  
          if (isInverted) {  
            r = 255 - r;  
            g = 255 - g;  
            b = 255 - b;  
          }  
            
          // Apply quantum noise  
          if (noiseLevel > 0) {  
            const noise = noiseLevel / 100;  
            r = Math.min(255, Math.max(0, r + (Math.random() * 2 - 1) * noise * 255));  
            g = Math.min(255, Math.max(0, g + (Math.random() * 2 - 1) * noise * 255));  
            b = Math.min(255, Math.max(0, b + (Math.random() * 2 - 1) * noise * 255));  
          }  
            
          ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;  
            
          // Random position jitter  
          const jitterX = x + (Math.random() * 2 - 1) * (spacing / 4);  
          const jitterY = y + (Math.random() * 2 - 1) * (spacing / 4);  
            
          // Random size variation  
          const sizeVariation = dotSize + (Math.random() * dotSize / 2);  
            
          // Draw based on selected algorithm  
          switch (algorithm) {  
            case 'circle':  
              ctx.beginPath();  
              ctx.arc(jitterX, jitterY, sizeVariation, 0, Math.PI * 2);  
              ctx.fill();  
              break;  
                
            case 'square':  
              ctx.fillRect(  
                jitterX - sizeVariation / 2,  
                jitterY - sizeVariation / 2,  
                sizeVariation,  
                sizeVariation  
              );  
              break;  
                
            case 'diamond':  
              ctx.beginPath();  
              ctx.moveTo(jitterX, jitterY - sizeVariation);  
              ctx.lineTo(jitterX + sizeVariation, jitterY);  
              ctx.lineTo(jitterX, jitterY + sizeVariation);  
              ctx.lineTo(jitterX - sizeVariation, jitterY);  
              ctx.closePath();  
              ctx.fill();  
              break;  
                
            case 'quantum':  
              // Quantum shape - randomly choose between shapes  
              const shapeType = Math.floor(Math.random() * 3);  
                
              if (shapeType === 0) {  
                ctx.beginPath();  
                ctx.arc(jitterX, jitterY, sizeVariation, 0, Math.PI * 2);  
                ctx.fill();  
              } else if (shapeType === 1) {  
                ctx.fillRect(  
                  jitterX - sizeVariation / 2,  
                  jitterY - sizeVariation / 2,  
                  sizeVariation,  
                  sizeVariation  
                );  
              } else {  
                ctx.beginPath();  
                ctx.moveTo(jitterX, jitterY - sizeVariation);  
                ctx.lineTo(jitterX + sizeVariation, jitterY);  
                ctx.lineTo(jitterX, jitterY + sizeVariation);  
                ctx.lineTo(jitterX - sizeVariation, jitterY);  
                ctx.closePath();  
                ctx.fill();  
              }  
              break;  
          }  
            
          pointCount++;  
        }  
      }  
        
      // Update points count  
      pointsDisplay.textContent = pointCount.toLocaleString();  
    }  
      
    // Process image  
    function processImage(img) {  
      // Resize canvas to fit image  
      canvas.width = img.width;  
      canvas.height = img.height;  
        
      // Draw original image to get data  
      ctx.drawImage(img, 0, 0, img.width, img.height);  
      originalImageData = ctx.getImageData(0, 0, img.width, img.height);  
        
      // Calculate entropy  
      const entropy = computeEntropy(originalImageData.data);  
      entropyDisplay.textContent = entropy;  
      shannonEntropyDisplay.textContent = entropy;  
        
      // Calculate color variance  
      const colorVariance = computeColorVariance(originalImageData.data);  
      colorVarianceDisplay.textContent = colorVariance;  
        
      // Update dimensions  
      dimensionsDisplay.textContent = `${img.width} x ${img.height}`;  
        
      // Draw histogram  
      drawHistogram(originalImageData.data);  
        
      // Generate hash  
      const hash = generateSHA256(originalImageData.data);  
      sha256HashDisplay.textContent = hash;  
        
      // Generate merkle root  
      const merkleRoot = generateMerkleRoot(hash);  
      merkleRootDisplay.textContent = merkleRoot;  
        
      // Draw signature  
      drawSignature(originalImageData.data);  
        
      // Update quantum state  
      const entropyNum = parseFloat(entropy);  
      if (entropyNum < 4) {  
        quantumStateDisplay.textContent = 'LOW ENTROPY';  
        quantumStateDisplay.className = 'text-xs mono text-red-500';  
      } else if (entropyNum < 7) {  
        quantumStateDisplay.textContent = 'STABLE';  
        quantumStateDisplay.className = 'text-xs mono text-yellow-500';  
      } else {  
        quantumStateDisplay.textContent = 'QUANTUM';  
        quantumStateDisplay.className = 'text-xs mono text-green-500';  
      }  
        
      // Update timestamp  
      const now = new Date();  
      timestampDisplay.textContent = now.toLocaleTimeString();  
        
      // Draw dots  
      drawDots(originalImageData);  
    }  
      
    // Create random image  
    function createRandomImage() {  
      const width = 400;  
      const height = 300;  
        
      canvas.width = width;  
      canvas.height = height;  
        
      const imageData = ctx.createImageData(width, height);  
        
      // Generate random pixel data  
      for (let i = 0; i < imageData.data.length; i += 4) {  
        imageData.data[i] = Math.floor(Math.random() * 256);  
        imageData.data[i + 1] = Math.floor(Math.random() * 256);  
        imageData.data[i + 2] = Math.floor(Math.random() * 256);  
        imageData.data[i + 3] = 255;  
      }  
        
      ctx.putImageData(imageData, 0, 0);  
        
      // Create an image from the canvas  
      const dataURL = canvas.toDataURL();  
      img = new Image();  
      img.onload = () => processImage(img);  
      img.src = dataURL;  
    }  
      
    // Apply glitch effect  
    function applyGlitch() {  
      if (!originalImageData) return;  
        
      const glitchedData = new Uint8ClampedArray(originalImageData.data);  
        
      // Random glitch parameters  
      const sliceCount = Math.floor(Math.random() * 10) + 5;  
      const channelOffset = Math.floor(Math.random() * 20) - 10;  
        
      // Create slices  
      for (let i = 0; i < sliceCount; i++) {  
        const y = Math.floor(Math.random() * originalImageData.height);  
        const height = Math.floor(Math.random() * 20) + 5;  
        const offset = Math.floor(Math.random() * 30) - 15;  
          
        for (let j = y; j < y + height && j < originalImageData.height; j++) {  
          for (let k = 0; k < originalImageData.width; k++) {  
            const sourceX = k + offset;  
              
            if (sourceX >= 0 && sourceX < originalImageData.width) {  
              const targetIndex = (j * originalImageData.width + k) * 4;  
              const sourceIndex = (j * originalImageData.width + sourceX) * 4;  
                
              glitchedData[targetIndex] = originalImageData.data[sourceIndex];  
              glitchedData[targetIndex + 1] = originalImageData.data[sourceIndex + 1];  
              glitchedData[targetIndex + 2] = originalImageData.data[sourceIndex + 2];  
            }  
          }  
        }  
      }  
        
      // Channel offset  
      if (channelOffset !== 0) {  
        for (let i = 0; i < glitchedData.length; i += 4) {  
          const offsetIndex = i + channelOffset * 4;  
            
          if (offsetIndex >= 0 && offsetIndex < glitchedData.length) {  
            glitchedData[i] = originalImageData.data[offsetIndex];  
          }  
        }  
      }  
        
      // Create temporary ImageData  
      const tempImageData = new ImageData(glitchedData, originalImageData.width, originalImageData.height);  
        
      // Draw glitched image  
      drawDots(tempImageData);  
    }  
      
    // Export image  
    function exportImage() {  
      const link = document.createElement('a');  
      link.download = 'quantum-pointillism.png';  
      link.href = canvas.toDataURL('image/png');  
      link.click();  
    }  
      
    // Event listeners  
    document.getElementById('imgLoader').addEventListener('change', e => {  
      const reader = new FileReader();  
      reader.onload = function(evt) {  
        img.onload = () => processImage(img);  
        img.src = evt.target.result;  
      };  
      reader.readAsDataURL(e.target.files[0]);  
    });  
      
    spacingSlider.addEventListener('input', e => {  
      spacing = parseInt(e.target.value);  
      spacingValue.textContent = spacing;  
      if (originalImageData) {  
        drawDots(originalImageData);  
      }  
    });  
      
    sizeSlider.addEventListener('input', e => {  
      dotSize = parseInt(e.target.value);  
      sizeValue.textContent = dotSize;  
      if (originalImageData) {  
        drawDots(originalImageData);  
      }  
    });  
      
    noiseSlider.addEventListener('input', e => {  
      noiseLevel = parseInt(e.target.value);  
      noiseValue.textContent = noiseLevel;  
      if (originalImageData) {  
        drawDots(originalImageData);  
      }  
    });  
      
    algorithmSelect.addEventListener('change', e => {  
      algorithm = e.target.value;  
      if (originalImageData) {  
        drawDots(originalImageData);  
      }  
    });  
      
    document.getElementById('random-btn').addEventListener('click', createRandomImage);  
      
    document.getElementById('invert-btn').addEventListener('click', () => {  
      isInverted = !isInverted;  
      if (originalImageData) {  
        drawDots(originalImageData);  
      }  
    });  
      
    document.getElementById('glitch-btn').addEventListener('click', () => {  
      isGlitching = !isGlitching;  
        
      if (isGlitching) {  
        glitchInterval = setInterval(applyGlitch, 200);  
        document.getElementById('glitch-btn').classList.add('bg-green-900');  
      } else {  
        clearInterval(glitchInterval);  
        document.getElementById('glitch-btn').classList.remove('bg-green-900');  
        if (originalImageData) {  
          drawDots(originalImageData);  
        }  
      }  
    });  
      
    document.getElementById('export-btn').addEventListener('click', exportImage);  
      
    document.getElementById('verify-btn').addEventListener('click', () => {  
      if (!originalImageData) return;  
        
      // Simulate verification  
      const verifyBtn = document.getElementById('verify-btn');  
      verifyBtn.textContent = 'VERIFYING...';  
      verifyBtn.disabled = true;  
        
      setTimeout(() => {  
        verifyBtn.textContent = 'VERIFIED ✓';  
        verifyBtn.classList.add('bg-green-900');  
          
        setTimeout(() => {  
          verifyBtn.textContent = 'VERIFY';  
          verifyBtn.classList.remove('bg-green-900');  
          verifyBtn.disabled = false;  
        }, 2000);  
      }, 1500);  
    });  
      
    document.getElementById('mint-btn').addEventListener('click', () => {  
      if (!originalImageData) return;  
        
      // Simulate minting  
      const mintBtn = document.getElementById('mint-btn');  
      mintBtn.textContent = 'MINTING...';  
      mintBtn.disabled = true;  
        
      setTimeout(() => {  
        mintBtn.textContent = 'MINTED ✓';  
        mintBtn.classList.add('bg-green-900');  
          
        setTimeout(() => {  
          mintBtn.textContent = 'MINT NFT';  
          mintBtn.classList.remove('bg-green-900');  
          mintBtn.disabled = false;  
        }, 2000);  
      }, 2000);  
    });  
      
    // FPS counter  
    function updateFPS(time) {  
      if (!lastFrameTime) {  
        lastFrameTime = time;  
        frameCount = 0;  
        requestAnimationFrame(updateFPS);  
        return;  
      }  
        
      frameCount++;  
        
      if (time - lastFrameTime >= 1000) {  
        const fps = Math.round((frameCount * 1000) / (time - lastFrameTime));  
        fpsCounter.textContent = `${fps} FPS`;  
        frameCount = 0;  
        lastFrameTime = time;  
      }  
        
      requestAnimationFrame(updateFPS);  
    }  
      
    // Resize handler  
    function handleResize() {  
      matrixCanvas.width = window.innerWidth;  
      matrixCanvas.height = window.innerHeight;  
      histCanvas.width = histCanvas.offsetWidth;  
      histCanvas.height = histCanvas.offsetHeight;  
      signatureCanvas.width = signatureCanvas.offsetWidth;  
      signatureCanvas.height = signatureCanvas.offsetHeight;  
        
      if (originalImageData) {  
        drawHistogram(originalImageData.data);  
        drawSignature(originalImageData.data);  
      }  
    }  
      
    window.addEventListener('resize', handleResize);  
      
    // Initialize  
    handleResize();  
    initMatrix();  
    updateFPS(0);  
    createRandomImage();  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'960180d7810f9f21',t:'MTc1MjY2ODk0Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
