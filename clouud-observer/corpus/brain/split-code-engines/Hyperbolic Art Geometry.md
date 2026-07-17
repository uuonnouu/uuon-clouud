# Hyperbolic Art Geometry  
![8](Attachments/FE564E4A-029F-4EDE-9E0A-238DE5003E5C.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>HyperViz - Hyperbolic Geometry Art Generator</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');  
      
    body {  
      font-family: 'Space Grotesk', sans-serif;  
      margin: 0;  
      padding: 0;  
      overflow-x: hidden;  
      background-color: #000;  
      color: #fff;  
    }  
      
    #canvas {  
      display: block;  
      width: 100%;  
      height: 100%;  
      touch-action: none;  
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
      
    .cosmic-badge {  
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 80, 255, 0.2) 100%);  
      border: 1px solid rgba(0, 255, 255, 0.3);  
    }  
      
    .cosmic-gradient {  
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);  
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
      
    .pattern-btn {  
      transition: all 0.3s ease;  
    }  
      
    .pattern-btn.active {  
      transform: translateY(-2px);  
      box-shadow: 0 5px 15px -3px rgba(59, 130, 246, 0.5);  
    }  
      
    .color-preset {  
      width: 24px;  
      height: 24px;  
      border-radius: 50%;  
      cursor: pointer;  
      transition: transform 0.2s ease;  
    }  
      
    .color-preset:hover {  
      transform: scale(1.2);  
    }  
      
    .color-preset.active {  
      transform: scale(1.2);  
      box-shadow: 0 0 0 2px white;  
    }  
      
    .canvas-container {  
      position: relative;  
      width: 100%;  
      height: 0;  
      padding-bottom: 100%;  
      overflow: hidden;  
      border-radius: 0.75rem;  
    }  
      
    @media (min-width: 768px) {  
      .canvas-container {  
        padding-bottom: 75%;  
      }  
    }  
      
    @media (min-width: 1024px) {  
      .canvas-container {  
        padding-bottom: 56.25%;  
      }  
    }  
      
    #canvas {  
      position: absolute;  
      top: 0;  
      left: 0;  
      width: 100%;  
      height: 100%;  
    }  
      
    .glow {  
      box-shadow: 0 0 15px rgba(96, 165, 250, 0.5);  
    }  
      
    .pattern-thumbnail {  
      width: 60px;  
      height: 60px;  
      border-radius: 8px;  
      overflow: hidden;  
      transition: all 0.3s ease;  
    }  
      
    .pattern-thumbnail:hover {  
      transform: scale(1.1);  
    }  
      
    .pattern-thumbnail.active {  
      transform: scale(1.1);  
      box-shadow: 0 0 0 2px white;  
    }  
      
    .control-panel {  
      transition: transform 0.3s ease;  
    }  
      
    .control-panel.collapsed {  
      transform: translateX(calc(100% - 40px));  
    }  
      
    .toggle-panel {  
      position: absolute;  
      left: 10px;  
      top: 50%;  
      transform: translateY(-50%);  
      width: 30px;  
      height: 30px;  
      display: flex;  
      align-items: center;  
      justify-content: center;  
      background: rgba(59, 130, 246, 0.3);  
      border-radius: 50%;  
      cursor: pointer;  
      z-index: 10;  
    }  
      
    .toggle-panel:hover {  
      background: rgba(59, 130, 246, 0.5);  
    }  
      
    .info-panel {  
      position: absolute;  
      bottom: 20px;  
      left: 20px;  
      max-width: 300px;  
      transition: opacity 0.3s ease;  
    }  
      
    .info-panel.hidden {  
      opacity: 0;  
      pointer-events: none;  
    }  
      
    .info-toggle {  
      position: absolute;  
      bottom: 20px;  
      left: 20px;  
      width: 40px;  
      height: 40px;  
      border-radius: 50%;  
      background: rgba(59, 130, 246, 0.3);  
      display: flex;  
      align-items: center;  
      justify-content: center;  
      cursor: pointer;  
      z-index: 10;  
    }  
      
    .info-toggle:hover {  
      background: rgba(59, 130, 246, 0.5);  
    }  
      
    .download-btn {  
      position: absolute;  
      bottom: 20px;  
      right: 20px;  
      z-index: 10;  
    }  
      
    .fullscreen-btn {  
      position: absolute;  
      bottom: 20px;  
      right: 80px;  
      z-index: 10;  
    }  
  </style>  
</head>  
<body>  
  <div class="relative min-h-screen">  
    <!-- Main Canvas -->  
    <div class="canvas-container">  
      <canvas id="canvas"></canvas>  
        
      <!-- Info Toggle Button -->  
      <button class="info-toggle" id="infoToggle">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />  
        </svg>  
      </button>  
        
      <!-- Info Panel -->  
      <div class="info-panel glassmorphism p-4 rounded-lg hidden" id="infoPanel">  
        <h3 class="text-lg font-bold text-blue-300 mb-2">Hyperbolic Geometry</h3>  
        <p class="text-sm text-blue-100 mb-2">  
          Explore non-Euclidean space where parallel lines diverge and the sum of angles in a triangle is less than 180°.  
        </p>  
        <p class="text-sm text-blue-100">  
          Drag to rotate, scroll to zoom, and use the controls to transform the patterns.  
        </p>  
      </div>  
        
      <!-- Download Button -->  
      <button class="download-btn btn px-3 py-2 rounded-lg text-sm bg-blue-500/30 border border-blue-500/50 hover:bg-blue-500/40" id="downloadBtn">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />  
        </svg>  
      </button>  
        
      <!-- Fullscreen Button -->  
      <button class="fullscreen-btn btn px-3 py-2 rounded-lg text-sm bg-blue-500/30 border border-blue-500/50 hover:bg-blue-500/40" id="fullscreenBtn">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />  
        </svg>  
      </button>  
    </div>  
      
    <!-- Control Panel -->  
    <div class="control-panel fixed top-0 right-0 h-full glassmorphism w-80 p-6 overflow-y-auto z-20" id="controlPanel">  
      <!-- Toggle Panel Button -->  
      <div class="toggle-panel" id="togglePanel">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" id="toggleIcon">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />  
        </svg>  
      </div>  
        
      <h1 class="text-3xl font-bold mb-2 cosmic-gradient bg-clip-text text-transparent">HyperViz</h1>  
      <p class="text-sm text-blue-200 mb-6">Hyperbolic Geometry Art Generator</p>  
        
      <!-- Pattern Selection -->  
      <div class="mb-6">  
        <h2 class="text-lg font-bold text-blue-300 mb-3">Pattern Type</h2>  
        <div class="grid grid-cols-3 gap-2">  
          <div class="pattern-thumbnail active" data-pattern="tessellation">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTMwIDVMMTAgMjBMMzAgMzVMNTAgMjBMMzAgNVoiIHN0cm9rZT0iIzYwYTVmYSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTMwIDM1TDEwIDUwTDMwIDY1TDUwIDUwTDMwIDM1WiIgc3Ryb2tlPSIjNjBhNWZhIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTAgMjBMMTAgNTAiIHN0cm9rZT0iIzYwYTVmYSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTUwIDIwTDUwIDUwIiBzdHJva2U9IiM2MGE1ZmEiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==" alt="Tessellation" class="w-full h-full object-cover">  
          </div>  
          <div class="pattern-thumbnail" data-pattern="spiral">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTMwIDMwQzMwIDI1IDMyIDIwIDM1IDE3QzM4IDE0IDQzIDEyIDQ4IDEyQzUzIDEyIDU4IDE0IDU4IDE5QzU4IDI0IDU0IDI4IDQ5IDMwQzQ0IDMyIDM5IDMyIDM0IDM0QzI5IDM2IDI1IDQwIDI1IDQ1QzI1IDUwIDI5IDU0IDM0IDU2QzM5IDU4IDQ0IDU4IDQ5IDU2QzU0IDU0IDU4IDUwIDU4IDQ1IiBzdHJva2U9IiNhNzhiZmEiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==" alt="Spiral" class="w-full h-full object-cover">  
          </div>  
          <div class="pattern-thumbnail" data-pattern="poincare">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjgiIHN0cm9rZT0iI2Y0NzJiNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTMwIDJMMzAgNTgiIHN0cm9rZT0iI2Y0NzJiNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIgMzBMNTggMzAiIHN0cm9rZT0iI2Y0NzJiNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTEwIDEwTDUwIDUwIiBzdHJva2U9IiNmNDcyYjYiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik01MCAxMEwxMCA1MCIgc3Ryb2tlPSIjZjQ3MmI2IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=" alt="Poincaré" class="w-full h-full object-cover">  
          </div>  
          <div class="pattern-thumbnail" data-pattern="klein">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PGVsbGlwc2UgY3g9IjMwIiBjeT0iMzAiIHJ4PSIyOCIgcnk9IjIwIiBzdHJva2U9IiMyMmM1NWUiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMCAyMEw1MCA0MCIgc3Ryb2tlPSIjMjJjNTVlIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNTAgMjBMMTAgNDAiIHN0cm9rZT0iIzIyYzU1ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTMwIDEwTDMwIDUwIiBzdHJva2U9IiMyMmM1NWUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==" alt="Klein" class="w-full h-full object-cover">  
          </div>  
          <div class="pattern-thumbnail" data-pattern="mobius">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTIwIDIwQzIwIDEwIDQwIDEwIDQwIDIwQzQwIDMwIDIwIDMwIDIwIDQwQzIwIDUwIDQwIDUwIDQwIDQwQzQwIDMwIDIwIDMwIDIwIDIwWiIgc3Ryb2tlPSIjZWY0NDQ0IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=" alt="Möbius" class="w-full h-full object-cover">  
          </div>  
          <div class="pattern-thumbnail" data-pattern="fractal">  
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTMwIDVMMTAgMzBMNTAgMzBMMzAgNVoiIHN0cm9rZT0iI2ZiYmYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTMwIDE1TDIwIDMwTDQwIDMwTDMwIDE1WiIgc3Ryb2tlPSIjZmJiZjI0IiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMzAgMjVMMjUgMzBMMzUgMzBMMzAgMjVaIiBzdHJva2U9IiNmYmJmMjQiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xMCAzMEwzMCA1NUw1MCAzMEwxMCAzMFoiIHN0cm9rZT0iI2ZiYmYyNCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIwIDMwTDMwIDQ1TDQwIDMwTDIwIDMwWiIgc3Ryb2tlPSIjZmJiZjI0IiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjUgMzBMMzAgMzVMMzUgMzBMMjUgMzBaIiBzdHJva2U9IiNmYmJmMjQiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==" alt="Fractal" class="w-full h-full object-cover">  
          </div>  
        </div>  
      </div>  
        
      <!-- Transformation Controls -->  
      <div class="mb-6">  
        <h2 class="text-lg font-bold text-blue-300 mb-3">Transformations</h2>  
          
        <div class="space-y-4">  
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Curvature</label>  
              <span id="curvatureValue" class="text-white text-sm font-medium">-1.0</span>  
            </div>  
            <input type="range" id="curvatureSlider" min="-2" max="0" value="-1" step="0.1"   
                  class="w-full parameter-slider">  
          </div>  
            
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Rotation Speed</label>  
              <span id="rotationValue" class="text-white text-sm font-medium">1.0</span>  
            </div>  
            <input type="range" id="rotationSlider" min="0" max="2" value="1" step="0.1"   
                  class="w-full parameter-slider">  
          </div>  
            
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Scale</label>  
              <span id="scaleValue" class="text-white text-sm font-medium">1.0</span>  
            </div>  
            <input type="range" id="scaleSlider" min="0.5" max="2" value="1" step="0.1"   
                  class="w-full parameter-slider">  
          </div>  
            
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Complexity</label>  
              <span id="complexityValue" class="text-white text-sm font-medium">5</span>  
            </div>  
            <input type="range" id="complexitySlider" min="3" max="10" value="5" step="1"   
                  class="w-full parameter-slider">  
          </div>  
            
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Twist</label>  
              <span id="twistValue" class="text-white text-sm font-medium">0.5</span>  
            </div>  
            <input type="range" id="twistSlider" min="0" max="1" value="0.5" step="0.1"   
                  class="w-full parameter-slider">  
          </div>  
        </div>  
      </div>  
        
      <!-- Color Controls -->  
      <div class="mb-6">  
        <h2 class="text-lg font-bold text-blue-300 mb-3">Colors</h2>  
          
        <div class="mb-4">  
          <label class="text-blue-200 text-sm block mb-2">Color Presets</label>  
          <div class="flex flex-wrap gap-2">  
            <div class="color-preset active" style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);" data-preset="cosmic"></div>  
            <div class="color-preset" style="background: linear-gradient(135deg, #22c55e, #16a34a, #15803d);" data-preset="emerald"></div>  
            <div class="color-preset" style="background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);" data-preset="ruby"></div>  
            <div class="color-preset" style="background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);" data-preset="amber"></div>  
            <div class="color-preset" style="background: linear-gradient(135deg, #ffffff, #e5e5e5, #737373);" data-preset="monochrome"></div>  
            <div class="color-preset" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af);" data-preset="sapphire"></div>  
          </div>  
        </div>  
          
        <div>  
          <div class="flex justify-between mb-1">  
            <label class="text-blue-200 text-sm">Color Intensity</label>  
            <span id="intensityValue" class="text-white text-sm font-medium">0.8</span>  
          </div>  
          <input type="range" id="intensitySlider" min="0.2" max="1" value="0.8" step="0.1"   
                class="w-full parameter-slider">  
        </div>  
      </div>  
        
      <!-- Animation Controls -->  
      <div class="mb-6">  
        <h2 class="text-lg font-bold text-blue-300 mb-3">Animation</h2>  
          
        <div class="space-y-4">  
          <div>  
            <div class="flex justify-between mb-1">  
              <label class="text-blue-200 text-sm">Animation Speed</label>  
              <span id="speedValue" class="text-white text-sm font-medium">1.0</span>  
            </div>  
            <input type="range" id="speedSlider" min="0" max="2" value="1" step="0.1"   
                  class="w-full parameter-slider">  
          </div>  
            
          <div class="flex items-center justify-between">  
            <label class="text-blue-200 text-sm">Auto-Rotate</label>  
            <label class="inline-flex items-center cursor-pointer">  
              <input type="checkbox" id="autoRotateToggle" class="sr-only peer">  
              <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>  
            </label>  
          </div>  
            
          <div class="flex items-center justify-between">  
            <label class="text-blue-200 text-sm">Pulse Effect</label>  
            <label class="inline-flex items-center cursor-pointer">  
              <input type="checkbox" id="pulseToggle" class="sr-only peer">  
              <div class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>  
            </label>  
          </div>  
        </div>  
      </div>  
        
      <!-- Randomize Button -->  
      <button id="randomizeBtn" class="btn w-full py-2 rounded-lg text-white bg-blue-500/30 border border-blue-500/50 hover:bg-blue-500/40">  
        Randomize  
      </button>  
    </div>  
      
    <!-- Header -->  
    <header class="fixed top-0 left-0 right-0 z-10 p-4">  
      <div class="max-w-7xl mx-auto">  
        <div class="glassmorphism rounded-xl p-4 text-center">  
          <h1 class="text-2xl md:text-3xl font-bold cosmic-gradient bg-clip-text text-transparent">  
            HyperViz: Hyperbolic Geometry Art Generator  
          </h1>  
          <p class="text-sm text-blue-200">  
            Explore the mesmerizing patterns of non-Euclidean space  
          </p>  
        </div>  
      </div>  
    </header>  
  </div>  
  
  <script>  
    // Canvas setup  
    const canvas = document.getElementById('canvas');  
    const ctx = canvas.getContext('2d');  
      
    // Resize canvas  
    function resizeCanvas() {  
      const container = canvas.parentElement;  
      canvas.width = container.offsetWidth;  
      canvas.height = container.offsetHeight;  
    }  
      
    resizeCanvas();  
    window.addEventListener('resize', resizeCanvas);  
      
    // Constants  
    const ϕ = (1 + Math.sqrt(5)) / 2; // Golden Ratio ~1.618  
    const e = Math.E; // Euler's number ~2.718  
    const π = Math.PI;  
      
    // App state  
    const state = {  
      pattern: "tessellation",  
      parameters: {  
        curvature: -1.0,  
        rotation: 1.0,  
        scale: 1.0,  
        complexity: 5,  
        twist: 0.5,  
        colorIntensity: 0.8,  
        animationSpeed: 1.0  
      },  
      colorPreset: "cosmic",  
      autoRotate: true,  
      pulseEffect: false,  
      mouse: {  
        x: 0,  
        y: 0,  
        down: false,  
        lastX: 0,  
        lastY: 0  
      },  
      camera: {  
        rotation: {  
          x: 0,  
          y: 0,  
          z: 0  
        },  
        zoom: 1.0  
      },  
      time: 0,  
      animationFrame: null  
    };  
      
    // Color presets  
    const colorPresets = {  
      cosmic: [  
        [96, 165, 250],  // #60a5fa  
        [167, 139, 250], // #a78bfa  
        [244, 114, 182]  // #f472b6  
      ],  
      emerald: [  
        [34, 197, 94],   // #22c55e  
        [22, 163, 74],   // #16a34a  
        [21, 128, 61]    // #15803d  
      ],  
      ruby: [  
        [239, 68, 68],   // #ef4444  
        [220, 38, 38],   // #dc2626  
        [185, 28, 28]    // #b91c1c  
      ],  
      amber: [  
        [251, 191, 36],  // #fbbf24  
        [245, 158, 11],  // #f59e0b  
        [217, 119, 6]    // #d97706  
      ],  
      monochrome: [  
        [255, 255, 255], // #ffffff  
        [229, 229, 229], // #e5e5e5  
        [115, 115, 115]  // #737373  
      ],  
      sapphire: [  
        [59, 130, 246],  // #3b82f6  
        [29, 78, 216],   // #1d4ed8  
        [30, 64, 175]    // #1e40af  
      ]  
    };  
      
    // DOM Elements  
    const controlPanel = document.getElementById('controlPanel');  
    const togglePanel = document.getElementById('togglePanel');  
    const toggleIcon = document.getElementById('toggleIcon');  
    const infoToggle = document.getElementById('infoToggle');  
    const infoPanel = document.getElementById('infoPanel');  
    const downloadBtn = document.getElementById('downloadBtn');  
    const fullscreenBtn = document.getElementById('fullscreenBtn');  
    const randomizeBtn = document.getElementById('randomizeBtn');  
    const patternThumbnails = document.querySelectorAll('.pattern-thumbnail');  
    const colorPresetElements = document.querySelectorAll('.color-preset');  
    const autoRotateToggle = document.getElementById('autoRotateToggle');  
    const pulseToggle = document.getElementById('pulseToggle');  
      
    // Sliders  
    const curvatureSlider = document.getElementById('curvatureSlider');  
    const rotationSlider = document.getElementById('rotationSlider');  
    const scaleSlider = document.getElementById('scaleSlider');  
    const complexitySlider = document.getElementById('complexitySlider');  
    const twistSlider = document.getElementById('twistSlider');  
    const intensitySlider = document.getElementById('intensitySlider');  
    const speedSlider = document.getElementById('speedSlider');  
      
    // Value displays  
    const curvatureValue = document.getElementById('curvatureValue');  
    const rotationValue = document.getElementById('rotationValue');  
    const scaleValue = document.getElementById('scaleValue');  
    const complexityValue = document.getElementById('complexityValue');  
    const twistValue = document.getElementById('twistValue');  
    const intensityValue = document.getElementById('intensityValue');  
    const speedValue = document.getElementById('speedValue');  
      
    // Drawing functions  
    function getColor(index, time) {  
      const colors = colorPresets[state.colorPreset];  
      const intensity = state.parameters.colorIntensity;  
        
      // Cycle through colors based on index and time  
      const colorIndex1 = index % colors.length;  
      const colorIndex2 = (index + 1) % colors.length;  
        
      const mixFactor = (Math.sin(time * state.parameters.animationSpeed * 0.5 + index * 0.1) + 1) * 0.5;  
        
      const r = Math.floor((colors[colorIndex1][0] * (1 - mixFactor) + colors[colorIndex2][0] * mixFactor) * intensity);  
      const g = Math.floor((colors[colorIndex1][1] * (1 - mixFactor) + colors[colorIndex2][1] * mixFactor) * intensity);  
      const b = Math.floor((colors[colorIndex1][2] * (1 - mixFactor) + colors[colorIndex2][2] * mixFactor) * intensity);  
        
      return `rgb(${r}, ${g}, ${b})`;  
    }  
      
    // Hyperbolic functions  
    function hyperbolicDistance(x1, y1, x2, y2) {  
      const curvature = state.parameters.curvature;  
        
      // Euclidean distance  
      const dx = x2 - x1;  
      const dy = y2 - y1;  
      const euclideanDist = Math.sqrt(dx * dx + dy * dy);  
        
      // Apply hyperbolic transformation  
      return Math.log((1 + Math.sqrt(1 - curvature * euclideanDist * euclideanDist)) / (1 - Math.sqrt(1 - curvature * euclideanDist * euclideanDist)));  
    }  
      
    function hyperbolicPoint(x, y, scale) {  
      const curvature = state.parameters.curvature;  
      const r = Math.sqrt(x * x + y * y);  
        
      if (r === 0) return { x: 0, y: 0 };  
        
      // Apply Poincaré disk model transformation  
      const factor = scale / (1 + Math.sqrt(1 - curvature * r * r));  
        
      return {  
        x: x * factor,  
        y: y * factor  
      };  
    }  
      
    // Pattern drawing functions  
    function drawTessellation() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw tessellation pattern  
      for (let i = 0; i < complexity; i++) {  
        for (let j = 0; j < complexity; j++) {  
          const x = (i - complexity / 2 + 0.5) * size / (complexity / 2);  
          const y = (j - complexity / 2 + 0.5) * size / (complexity / 2);  
            
          // Apply hyperbolic transformation  
          const point = hyperbolicPoint(x, y, size);  
            
          // Apply twist  
          const angle = Math.atan2(point.y, point.x);  
          const distance = Math.sqrt(point.x * point.x + point.y * point.y);  
          const twistedAngle = angle + distance * state.parameters.twist * 0.01;  
            
          const twistedX = Math.cos(twistedAngle) * distance;  
          const twistedY = Math.sin(twistedAngle) * distance;  
            
          // Draw polygon  
          const sides = 4 + (i % 3);  
          const radius = size / complexity * 0.8;  
            
          ctx.beginPath();  
          for (let k = 0; k < sides; k++) {  
            const angle = k * 2 * π / sides + state.time * state.parameters.rotation * 0.1;  
            const vertexX = twistedX + Math.cos(angle) * radius;  
            const vertexY = twistedY + Math.sin(angle) * radius;  
              
            if (k === 0) {  
              ctx.moveTo(vertexX, vertexY);  
            } else {  
              ctx.lineTo(vertexX, vertexY);  
            }  
          }  
          ctx.closePath();  
            
          // Apply pulse effect  
          let pulseScale = 1;  
          if (state.pulseEffect) {  
            pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + i * j * 0.1) * 0.1;  
          }  
            
          // Fill and stroke  
          const colorIndex = i * complexity + j;  
          ctx.fillStyle = getColor(colorIndex, state.time);  
          ctx.strokeStyle = getColor(colorIndex + complexity, state.time);  
          ctx.lineWidth = 2 * pulseScale;  
          ctx.fill();  
          ctx.stroke();  
        }  
      }  
        
      ctx.restore();  
    }  
      
    function drawSpiral() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity * 5;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw spiral pattern  
      for (let i = 0; i < complexity; i++) {  
        const t = i / complexity;  
        const angle = t * 2 * π * 5 + state.time * state.parameters.rotation * 0.5;  
        const radius = t * size;  
          
        // Apply hyperbolic transformation  
        const x = Math.cos(angle) * radius;  
        const y = Math.sin(angle) * radius;  
        const point = hyperbolicPoint(x, y, size);  
          
        // Apply twist  
        const twistedAngle = angle + radius * state.parameters.twist * 0.005;  
        const twistedRadius = radius * (1 + Math.sin(angle * 3) * 0.1);  
          
        const twistedX = Math.cos(twistedAngle) * twistedRadius;  
        const twistedY = Math.sin(twistedAngle) * twistedRadius;  
          
        // Draw circle  
        const circleRadius = size / complexity * 3 * (1 - t * 0.5);  
          
        // Apply pulse effect  
        let pulseScale = 1;  
        if (state.pulseEffect) {  
          pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + i * 0.2) * 0.2;  
        }  
          
        ctx.beginPath();  
        ctx.arc(twistedX, twistedY, circleRadius * pulseScale, 0, 2 * π);  
        ctx.fillStyle = getColor(i, state.time);  
        ctx.fill();  
          
        // Connect to previous point  
        if (i > 0) {  
          const prevT = (i - 1) / complexity;  
          const prevAngle = prevT * 2 * π * 5 + state.time * state.parameters.rotation * 0.5;  
          const prevRadius = prevT * size;  
            
          const prevX = Math.cos(prevAngle) * prevRadius;  
          const prevY = Math.sin(prevAngle) * prevRadius;  
          const prevPoint = hyperbolicPoint(prevX, prevY, size);  
            
          const prevTwistedAngle = prevAngle + prevRadius * state.parameters.twist * 0.005;  
          const prevTwistedRadius = prevRadius * (1 + Math.sin(prevAngle * 3) * 0.1);  
            
          const prevTwistedX = Math.cos(prevTwistedAngle) * prevTwistedRadius;  
          const prevTwistedY = Math.sin(prevTwistedAngle) * prevTwistedRadius;  
            
          ctx.beginPath();  
          ctx.moveTo(twistedX, twistedY);  
          ctx.lineTo(prevTwistedX, prevTwistedY);  
          ctx.strokeStyle = getColor(i + complexity, state.time);  
          ctx.lineWidth = 2 * pulseScale;  
          ctx.stroke();  
        }  
      }  
        
      ctx.restore();  
    }  
      
    function drawPoincare() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw Poincaré disk boundary  
      ctx.beginPath();  
      ctx.arc(0, 0, size, 0, 2 * π);  
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';  
      ctx.lineWidth = 2;  
      ctx.stroke();  
        
      // Draw hyperbolic lines (geodesics)  
      for (let i = 0; i < complexity * 3; i++) {  
        const angle = (i / (complexity * 3)) * 2 * π;  
        const startX = Math.cos(angle) * size * 0.1;  
        const startY = Math.sin(angle) * size * 0.1;  
        const endX = Math.cos(angle) * size * 0.95;  
        const endY = Math.sin(angle) * size * 0.95;  
          
        // Apply twist  
        const twistedStartAngle = angle + size * 0.1 * state.parameters.twist * 0.01;  
        const twistedEndAngle = angle + size * 0.95 * state.parameters.twist * 0.01;  
          
        const twistedStartX = Math.cos(twistedStartAngle) * size * 0.1;  
        const twistedStartY = Math.sin(twistedStartAngle) * size * 0.1;  
        const twistedEndX = Math.cos(twistedEndAngle) * size * 0.95;  
        const twistedEndY = Math.sin(twistedEndAngle) * size * 0.95;  
          
        // Draw geodesic  
        ctx.beginPath();  
        ctx.moveTo(twistedStartX, twistedStartY);  
          
        // Create curved path to simulate hyperbolic geodesic  
        const controlX = Math.cos(angle + π/2) * size * state.parameters.curvature * -0.2;  
        const controlY = Math.sin(angle + π/2) * size * state.parameters.curvature * -0.2;  
          
        ctx.quadraticCurveTo(controlX, controlY, twistedEndX, twistedEndY);  
          
        // Apply pulse effect  
        let pulseScale = 1;  
        if (state.pulseEffect) {  
          pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + i * 0.2) * 0.2;  
        }  
          
        ctx.strokeStyle = getColor(i, state.time);  
        ctx.lineWidth = 2 * pulseScale;  
        ctx.stroke();  
      }  
        
      // Draw concentric circles  
      for (let i = 1; i <= complexity; i++) {  
        const radius = (i / complexity) * size * 0.95;  
          
        ctx.beginPath();  
        ctx.arc(0, 0, radius, 0, 2 * π);  
        ctx.strokeStyle = getColor(i + complexity * 3, state.time);  
        ctx.lineWidth = 2;  
        ctx.stroke();  
      }  
        
      ctx.restore();  
    }  
      
    function drawKlein() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw Klein bottle projection  
      const kleinPoints = [];  
      const steps = complexity * 10;  
        
      for (let i = 0; i <= steps; i++) {  
        const u = (i / steps) * 2 * π;  
          
        for (let j = 0; j <= steps / 2; j++) {  
          const v = (j / (steps / 2)) * 2 * π;  
            
          // Klein bottle parametric equations (simplified projection)  
          let x, y;  
            
          if (u < π) {  
            x = Math.cos(u) * (1 + Math.cos(v) * 0.5);  
            y = Math.sin(u) * (1 + Math.cos(v) * 0.5);  
          } else {  
            x = Math.cos(u) * (1 + Math.cos(v + π) * 0.5);  
            y = Math.sin(u) * (1 + Math.cos(v + π) * 0.5);  
          }  
            
          // Apply twist  
          const angle = Math.atan2(y, x);  
          const distance = Math.sqrt(x * x + y * y);  
          const twistedAngle = angle + distance * state.parameters.twist * 0.5 + state.time * state.parameters.rotation * 0.1;  
            
          const twistedX = Math.cos(twistedAngle) * distance * size * 0.5;  
          const twistedY = Math.sin(twistedAngle) * distance * size * 0.5;  
            
          kleinPoints.push({ x: twistedX, y: twistedY, u, v });  
        }  
      }  
        
      // Draw connections  
      for (let i = 0; i < kleinPoints.length - 1; i++) {  
        const point = kleinPoints[i];  
        const nextPoint = kleinPoints[i + 1];  
          
        // Only connect points that are adjacent in parameter space  
        if (Math.abs(point.u - nextPoint.u) < 0.1 || Math.abs(point.v - nextPoint.v) < 0.1) {  
          ctx.beginPath();  
          ctx.moveTo(point.x, point.y);  
          ctx.lineTo(nextPoint.x, nextPoint.y);  
            
          // Apply pulse effect  
          let pulseScale = 1;  
          if (state.pulseEffect) {  
            pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + i * 0.01) * 0.2;  
          }  
            
          ctx.strokeStyle = getColor(i % (complexity * 3), state.time);  
          ctx.lineWidth = 1 * pulseScale;  
          ctx.stroke();  
        }  
      }  
        
      ctx.restore();  
    }  
      
    function drawMobius() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw Möbius strip  
      const mobiusPoints = [];  
      const steps = complexity * 10;  
        
      for (let i = 0; i <= steps; i++) {  
        const u = (i / steps) * 2 * π;  
          
        for (let j = -5; j <= 5; j++) {  
          const v = (j / 5) * size * 0.2;  
            
          // Möbius strip parametric equations (simplified projection)  
          const x = (1 + v * Math.cos(u / 2)) * Math.cos(u);  
          const y = (1 + v * Math.cos(u / 2)) * Math.sin(u);  
            
          // Apply twist  
          const angle = Math.atan2(y, x) + state.parameters.twist * u;  
          const distance = Math.sqrt(x * x + y * y);  
          const twistedX = Math.cos(angle) * distance * size * 0.5;  
          const twistedY = Math.sin(angle) * distance * size * 0.5;  
            
          mobiusPoints.push({ x: twistedX, y: twistedY, u, v });  
        }  
      }  
        
      // Draw connections  
      for (let i = 0; i < mobiusPoints.length - 1; i++) {  
        const point = mobiusPoints[i];  
        const nextPoint = mobiusPoints[i + 1];  
          
        // Only connect points that are adjacent in parameter space  
        if (Math.abs(point.u - nextPoint.u) < 0.1 || Math.abs(point.v - nextPoint.v) < 0.1) {  
          ctx.beginPath();  
          ctx.moveTo(point.x, point.y);  
          ctx.lineTo(nextPoint.x, nextPoint.y);  
            
          // Apply pulse effect  
          let pulseScale = 1;  
          if (state.pulseEffect) {  
            pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + i * 0.01) * 0.2;  
          }  
            
          ctx.strokeStyle = getColor(i % (complexity * 3), state.time);  
          ctx.lineWidth = 1 * pulseScale;  
          ctx.stroke();  
        }  
      }  
        
      ctx.restore();  
    }  
      
    function drawFractal() {  
      const width = canvas.width;  
      const height = canvas.height;  
      const centerX = width / 2;  
      const centerY = height / 2;  
      const size = Math.min(width, height) * 0.4 * state.parameters.scale;  
      const complexity = state.parameters.complexity;  
        
      ctx.save();  
      ctx.translate(centerX, centerY);  
      ctx.rotate(state.camera.rotation.z);  
        
      // Draw fractal pattern using recursive function  
      function drawFractalShape(x, y, size, depth) {  
        if (depth <= 0) return;  
          
        // Apply hyperbolic transformation  
        const point = hyperbolicPoint(x, y, size * 2);  
          
        // Apply twist  
        const angle = Math.atan2(point.y, point.x);  
        const distance = Math.sqrt(point.x * point.x + point.y * point.y);  
        const twistedAngle = angle + distance * state.parameters.twist * 0.01;  
          
        const twistedX = Math.cos(twistedAngle) * distance;  
        const twistedY = Math.sin(twistedAngle) * distance;  
          
        // Draw shape  
        const sides = 3 + depth;  
        const shapeSize = size * (0.8 - depth * 0.1);  
          
        ctx.beginPath();  
        for (let i = 0; i < sides; i++) {  
          const angle = i * 2 * π / sides + state.time * state.parameters.rotation * 0.1;  
          const vertexX = twistedX + Math.cos(angle) * shapeSize;  
          const vertexY = twistedY + Math.sin(angle) * shapeSize;  
            
          if (i === 0) {  
            ctx.moveTo(vertexX, vertexY);  
          } else {  
            ctx.lineTo(vertexX, vertexY);  
          }  
        }  
        ctx.closePath();  
          
        // Apply pulse effect  
        let pulseScale = 1;  
        if (state.pulseEffect) {  
          pulseScale = 1 + Math.sin(state.time * state.parameters.animationSpeed + depth * 0.5) * 0.1;  
        }  
          
        // Fill and stroke  
        ctx.fillStyle = getColor(depth, state.time);  
        ctx.strokeStyle = getColor(depth + 5, state.time);  
        ctx.lineWidth = 2 * pulseScale;  
        ctx.fill();  
        ctx.stroke();  
          
        // Recursive calls  
        const newSize = size * 0.5;  
        const angleStep = 2 * π / sides;  
          
        for (let i = 0; i < sides; i++) {  
          const angle = i * angleStep + state.time * state.parameters.rotation * 0.05;  
          const newX = x + Math.cos(angle) * size * 0.8;  
          const newY = y + Math.sin(angle) * size * 0.8;  
            
          drawFractalShape(newX, newY, newSize, depth - 1);  
        }  
      }  
        
      // Start recursive drawing  
      drawFractalShape(0, 0, size * 0.3, complexity / 2);  
        
      ctx.restore();  
    }  
      
    // Main drawing function  
    function draw() {  
      // Clear canvas  
      ctx.clearRect(0, 0, canvas.width, canvas.height);  
        
      // Draw pattern based on selected type  
      switch (state.pattern) {  
        case "tessellation":  
          drawTessellation();  
          break;  
        case "spiral":  
          drawSpiral();  
          break;  
        case "poincare":  
          drawPoincare();  
          break;  
        case "klein":  
          drawKlein();  
          break;  
        case "mobius":  
          drawMobius();  
          break;  
        case "fractal":  
          drawFractal();  
          break;  
      }  
        
      // Update time  
      state.time += 0.01 * state.parameters.animationSpeed;  
        
      // Auto-rotate if enabled  
      if (state.autoRotate) {  
        state.camera.rotation.z += 0.005 * state.parameters.rotation;  
      }  
        
      // Request next frame  
      state.animationFrame = requestAnimationFrame(draw);  
    }  
      
    // Start animation  
    draw();  
      
    // Event handlers  
    function handleMouseDown(e) {  
      state.mouse.down = true;  
      state.mouse.lastX = e.clientX;  
      state.mouse.lastY = e.clientY;  
    }  
      
    function handleMouseMove(e) {  
      if (state.mouse.down) {  
        const deltaX = e.clientX - state.mouse.lastX;  
        const deltaY = e.clientY - state.mouse.lastY;  
          
        state.camera.rotation.z += deltaX * 0.01;  
          
        state.mouse.lastX = e.clientX;  
        state.mouse.lastY = e.clientY;  
      }  
    }  
      
    function handleMouseUp() {  
      state.mouse.down = false;  
    }  
      
    function handleWheel(e) {  
      e.preventDefault();  
        
      // Adjust scale based on wheel direction  
      const delta = e.deltaY > 0 ? -0.1 : 0.1;  
      state.parameters.scale = Math.max(0.5, Math.min(2, state.parameters.scale + delta));  
        
      // Update scale slider  
      scaleSlider.value = state.parameters.scale;  
      scaleValue.textContent = state.parameters.scale.toFixed(1);  
    }  
      
    function handleTouchStart(e) {  
      if (e.touches.length === 1) {  
        state.mouse.down = true;  
        state.mouse.lastX = e.touches[0].clientX;  
        state.mouse.lastY = e.touches[0].clientY;  
      }  
    }  
      
    function handleTouchMove(e) {  
      if (state.mouse.down && e.touches.length === 1) {  
        const deltaX = e.touches[0].clientX - state.mouse.lastX;  
        const deltaY = e.touches[0].clientY - state.mouse.lastY;  
          
        state.camera.rotation.z += deltaX * 0.01;  
          
        state.mouse.lastX = e.touches[0].clientX;  
        state.mouse.lastY = e.touches[0].clientY;  
      }  
    }  
      
    function handleTouchEnd() {  
      state.mouse.down = false;  
    }  
      
    // Add event listeners  
    canvas.addEventListener('mousedown', handleMouseDown);  
    canvas.addEventListener('mousemove', handleMouseMove);  
    window.addEventListener('mouseup', handleMouseUp);  
    canvas.addEventListener('wheel', handleWheel);  
    canvas.addEventListener('touchstart', handleTouchStart);  
    canvas.addEventListener('touchmove', handleTouchMove);  
    canvas.addEventListener('touchend', handleTouchEnd);  
      
    // Toggle control panel  
    togglePanel.addEventListener('click', () => {  
      controlPanel.classList.toggle('collapsed');  
        
      if (controlPanel.classList.contains('collapsed')) {  
        toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />';  
      } else {  
        toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />';  
      }  
    });  
      
    // Toggle info panel  
    infoToggle.addEventListener('click', () => {  
      infoPanel.classList.toggle('hidden');  
    });  
      
    // Download canvas as image  
    downloadBtn.addEventListener('click', () => {  
      const link = document.createElement('a');  
      link.download = `hyperviz-${state.pattern}-${Date.now()}.png`;  
      link.href = canvas.toDataURL('image/png');  
      link.click();  
    });  
      
    // Toggle fullscreen  
    fullscreenBtn.addEventListener('click', () => {  
      const container = canvas.parentElement;  
        
      if (!document.fullscreenElement) {  
        container.requestFullscreen().catch(err => {  
          console.error(`Error attempting to enable fullscreen: ${err.message}`);  
        });  
      } else {  
        document.exitFullscreen();  
      }  
    });  
      
    // Pattern selection  
    patternThumbnails.forEach(thumbnail => {  
      thumbnail.addEventListener('click', () => {  
        // Remove active class from all thumbnails  
        patternThumbnails.forEach(t => t.classList.remove('active'));  
          
        // Add active class to clicked thumbnail  
        thumbnail.classList.add('active');  
          
        // Update state  
        state.pattern = thumbnail.dataset.pattern;  
      });  
    });  
      
    // Color preset selection  
    colorPresetElements.forEach(preset => {  
      preset.addEventListener('click', () => {  
        // Remove active class from all presets  
        colorPresetElements.forEach(p => p.classList.remove('active'));  
          
        // Add active class to clicked preset  
        preset.classList.add('active');  
          
        // Update state  
        state.colorPreset = preset.dataset.preset;  
      });  
    });  
      
    // Slider event listeners  
    curvatureSlider.addEventListener('input', (e) => {  
      state.parameters.curvature = parseFloat(e.target.value);  
      curvatureValue.textContent = state.parameters.curvature.toFixed(1);  
    });  
      
    rotationSlider.addEventListener('input', (e) => {  
      state.parameters.rotation = parseFloat(e.target.value);  
      rotationValue.textContent = state.parameters.rotation.toFixed(1);  
    });  
      
    scaleSlider.addEventListener('input', (e) => {  
      state.parameters.scale = parseFloat(e.target.value);  
      scaleValue.textContent = state.parameters.scale.toFixed(1);  
    });  
      
    complexitySlider.addEventListener('input', (e) => {  
      state.parameters.complexity = parseInt(e.target.value);  
      complexityValue.textContent = state.parameters.complexity;  
    });  
      
    twistSlider.addEventListener('input', (e) => {  
      state.parameters.twist = parseFloat(e.target.value);  
      twistValue.textContent = state.parameters.twist.toFixed(1);  
    });  
      
    intensitySlider.addEventListener('input', (e) => {  
      state.parameters.colorIntensity = parseFloat(e.target.value);  
      intensityValue.textContent = state.parameters.colorIntensity.toFixed(1);  
    });  
      
    speedSlider.addEventListener('input', (e) => {  
      state.parameters.animationSpeed = parseFloat(e.target.value);  
      speedValue.textContent = state.parameters.animationSpeed.toFixed(1);  
    });  
      
    // Toggle switches  
    autoRotateToggle.addEventListener('change', (e) => {  
      state.autoRotate = e.target.checked;  
    });  
      
    pulseToggle.addEventListener('change', (e) => {  
      state.pulseEffect = e.target.checked;  
    });  
      
    // Randomize button  
    randomizeBtn.addEventListener('click', () => {  
      // Randomize parameters  
      state.parameters.curvature = -Math.random() * 2;  
      state.parameters.rotation = Math.random() * 2;  
      state.parameters.scale = 0.5 + Math.random() * 1.5;  
      state.parameters.complexity = 3 + Math.floor(Math.random() * 8);  
      state.parameters.twist = Math.random();  
      state.parameters.colorIntensity = 0.2 + Math.random() * 0.8;  
      state.parameters.animationSpeed = Math.random() * 2;  
        
      // Update UI  
      curvatureSlider.value = state.parameters.curvature;  
      rotationSlider.value = state.parameters.rotation;  
      scaleSlider.value = state.parameters.scale;  
      complexitySlider.value = state.parameters.complexity;  
      twistSlider.value = state.parameters.twist;  
      intensitySlider.value = state.parameters.colorIntensity;  
      speedSlider.value = state.parameters.animationSpeed;  
        
      curvatureValue.textContent = state.parameters.curvature.toFixed(1);  
      rotationValue.textContent = state.parameters.rotation.toFixed(1);  
      scaleValue.textContent = state.parameters.scale.toFixed(1);  
      complexityValue.textContent = state.parameters.complexity;  
      twistValue.textContent = state.parameters.twist.toFixed(1);  
      intensityValue.textContent = state.parameters.colorIntensity.toFixed(1);  
      speedValue.textContent = state.parameters.animationSpeed.toFixed(1);  
        
      // Randomize pattern  
      const patterns = ["tessellation", "spiral", "poincare", "klein", "mobius", "fractal"];  
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];  
      state.pattern = randomPattern;  
        
      // Update pattern selection UI  
      patternThumbnails.forEach(thumbnail => {  
        thumbnail.classList.remove('active');  
        if (thumbnail.dataset.pattern === randomPattern) {  
          thumbnail.classList.add('active');  
        }  
      });  
        
      // Randomize color preset  
      const presets = ["cosmic", "emerald", "ruby", "amber", "monochrome", "sapphire"];  
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];  
      state.colorPreset = randomPreset;  
        
      // Update color preset selection UI  
      colorPresetElements.forEach(preset => {  
        preset.classList.remove('active');  
        if (preset.dataset.preset === randomPreset) {  
          preset.classList.add('active');  
        }  
      });  
        
      // Randomize toggles  
      state.autoRotate = Math.random() > 0.5;  
      state.pulseEffect = Math.random() > 0.5;  
        
      autoRotateToggle.checked = state.autoRotate;  
      pulseToggle.checked = state.pulseEffect;  
    });  
      
    // Initialize info panel  
    infoPanel.classList.remove('hidden');  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601a5e091b3613b',t:'MTc1MjY3MDQ2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
