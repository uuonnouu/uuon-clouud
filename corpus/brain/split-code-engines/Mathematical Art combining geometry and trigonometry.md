Mathematical Art combining geometry and trigonometry  
![Image](Attachments/972026F7-9E2C-43CE-B292-FC7ED2880DA3.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Mathematical Art Generator</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Inter:wght@300;400;500;700&display=swap');  
    body{margin:0;overflow:hidden;background:#0f172a;font-family:'Inter',sans-serif}canvas{display:block;position:absolute;top:0;left:0;z-index:1}.a1{position:relative;width:100%;height:100vh;overflow:hidden}.a2{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;mix-blend-mode:screen;opacity:0;transition:opacity .5s ease}.a2.a3{opacity:1}.a4{background:rgba(15,23,42,.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);transition:transform .3s ease-in-out;box-shadow:0 -5px 25px rgba(139,92,246,.15);z-index:20}.a4.a5{transform:translateY(calc(100% - 40px))}input[type=range]{-webkit-appearance:none;height:6px;background:#334155;border-radius:3px;outline:0}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#8b5cf6;cursor:pointer;transition:all .2s;box-shadow:0 0 8px rgba(139,92,246,.8)}input[type=range]::-webkit-slider-thumb:hover{background:#a78bfa;transform:scale(1.1);box-shadow:0 0 12px #8b5cf6}.a6{transition:all .2s;position:relative;overflow:hidden}.a6::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent,rgba(255,255,255,.1),transparent);transform:rotate(45deg);transition:all .3s}.a6:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(139,92,246,.3)}.a6:hover::after{left:100%}.a6:active{transform:translateY(0)}.a7{cursor:pointer;height:6px;width:40px;background:rgba(255,255,255,.2);border-radius:3px;margin:8px auto;transition:all .3s}.a7:hover{background:rgba(255,255,255,.4);box-shadow:0 0 8px rgba(255,255,255,.4)}.a8{display:none}.a8.a3{display:block}.a9{font-family:'Orbitron',sans-serif;text-shadow:0 0 5px rgba(139,92,246,.8),0 0 10px rgba(139,92,246,.5),0 0 15px rgba(139,92,246,.3);letter-spacing:1px}.a10{box-shadow:0 0 5px rgba(139,92,246,.8),inset 0 0 5px rgba(139,92,246,.5)}.a11{opacity:.7;transition:all .2s}.a11.a3{opacity:1;transform:scale(1.05);box-shadow:0 0 10px rgba(139,92,246,.8)}.a11:hover{opacity:.9}.a12{position:relative}.a12 .a13{visibility:hidden;background-color:rgba(15,23,42,.9);color:#fff;text-align:center;border-radius:6px;padding:5px 10px;position:absolute;z-index:1;bottom:125%;left:50%;transform:translateX(-50%);opacity:0;transition:opacity .3s;font-size:12px;white-space:nowrap}.a12:hover .a13{visibility:visible;opacity:1}.a14{background:radial-gradient(circle at center,transparent 30%,rgba(139,92,246,.05) 70%,rgba(139,92,246,.1) 100%);box-shadow:inset 0 0 150px rgba(139,92,246,.5)}.a15{background:linear-gradient(0deg,rgba(0,255,0,.05) 0%,transparent 100%);box-shadow:inset 0 0 150px rgba(0,255,0,.3)}.a16{background:radial-gradient(ellipse at center,rgba(100,100,255,.05) 0%,transparent 70%);box-shadow:inset 0 0 200px rgba(100,100,255,.3)}.a17{background:linear-gradient(180deg,rgba(255,100,255,.05) 0%,transparent 100%);box-shadow:inset 0 0 150px rgba(255,100,255,.3)}.a18{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;mix-blend-mode:overlay;opacity:0;transition:opacity .5s ease}.a18.a3{opacity:.7}.a19{background:radial-gradient(circle at center,rgba(255,255,255,.1) 0%,transparent 70%)}  
  </style>  
</head>  
<body class="text-white">  
  <div class="relative w-full h-screen">  
    <div class="a1">  
      <canvas id="b1"></canvas>  
      <div id="b2" class="a2"></div>  
      <div id="b3" class="a18"></div>  
    </div>  
      
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">  
      <h1 class="a9 text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">  
        Mathematical Art  
      </h1>  
      <div class="flex gap-2">  
        <button id="b4" class="a6 bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg text-sm font-medium a10 a12">  
          Save  
          <span class="a13">Download as PNG</span>  
        </button>  
        <button id="b5" class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-sm font-medium a10 a12">  
          Random  
          <span class="a13">Generate random pattern</span>  
        </button>  
      </div>  
    </div>  
      
    <div class="absolute top-16 left-4 flex flex-col gap-2 z-10">  
      <button class="a11 active p-2 rounded-full bg-indigo-900 a10 a12" data-filter="none">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <circle cx="12" cy="12" r="10" stroke-width="2"/>  
        </svg>  
        <span class="a13">Normal</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="neon">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />  
        </svg>  
        <span class="a13">Neon Glow</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="matrix">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />  
        </svg>  
        <span class="a13">Matrix</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="cosmic">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />  
        </svg>  
        <span class="a13">Cosmic</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="retro">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />  
        </svg>  
        <span class="a13">Retro</span>  
      </button>  
    </div>  
      
    <div class="absolute top-16 right-4 flex flex-col gap-2 z-10">  
      <button id="b6" class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-mode="rainbow">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />  
        </svg>  
        <span class="a13">Color: Rainbow</span>  
      </button>  
      <button id="b7" class="a11 p-2 rounded-full bg-indigo-900 a10 a12">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />  
        </svg>  
        <span class="a13">Bloom Effect: Off</span>  
      </button>  
      <button id="b8" class="a11 p-2 rounded-full bg-indigo-900 a10 a12">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />  
        </svg>  
        <span class="a13">Pause</span>  
      </button>  
    </div>  
      
    <div id="b9" class="a4 absolute bottom-0 left-0 right-0 p-2 rounded-t-xl z-20">  
      <div class="a7" id="b10"></div>  
        
      <div class="flex justify-center mb-2">  
        <div class="inline-flex rounded-md shadow-sm" role="group">  
          <button id="b11" class="px-4 py-1 text-xs font-medium bg-indigo-600 text-white rounded-l-lg a10">  
            Basic  
          </button>  
          <button id="b12" class="px-4 py-1 text-xs font-medium bg-indigo-800 text-gray-300 rounded-r-lg">  
            Advanced  
          </button>  
        </div>  
      </div>  
        
      <div id="b13" class="a8 a3">  
        <div class="grid grid-cols-2 gap-3">  
          <div>  
            <label class="block mb-1 text-xs font-medium">Wave: <span id="b14">3</span></label>  
            <input type="range" id="b15" min="1" max="10" step="0.1" value="3" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Radius: <span id="b16">200</span></label>  
            <input type="range" id="b17" min="50" max="350" value="200" class="w-full">  
          </div>  
        </div>  
          
        <div class="flex flex-wrap gap-2 mt-3">  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="setPreset('flower')">Flower</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="setPreset('spiral')">Spiral</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="setPreset('star')">Star</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="setPreset('wave')">Wave</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="setPreset('orbit')">Orbit</button>  
          <button class="a6 bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-xs a10" onclick="clearCanvas()">Clear</button>  
        </div>  
      </div>  
        
      <div id="b18" class="a8">  
        <div class="grid grid-cols-2 gap-3">  
          <div>  
            <label class="block mb-1 text-xs font-medium">Speed: <span id="b19">0.5</span></label>  
            <input type="range" id="b20" min="0.1" max="2" step="0.1" value="0.5" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Angle Step: <span id="b21">1</span>°</label>  
            <input type="range" id="b22" min="0.5" max="10" step="0.5" value="1" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Point Size: <span id="b23">1.2</span></label>  
            <input type="range" id="b24" min="0.5" max="5" step="0.1" value="1.2" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Color Speed: <span id="b25">1</span></label>  
            <input type="range" id="b26" min="0.1" max="5" step="0.1" value="1" class="w-full">  
          </div>  
          <div class="col-span-2">  
            <label class="block mb-1 text-xs font-medium">Fade: <span id="b27">0.05</span></label>  
            <input type="range" id="b28" min="0.01" max="0.2" step="0.01" value="0.05" class="w-full">  
          </div>  
        </div>  
      </div>  
    </div>  
  </div>  
  
  <script>  
    (function(){  
      const canvas = document.getElementById('b1');  
      const ctx = canvas.getContext('2d');  
      const controlPanel = document.getElementById('b9');  
      const panelHandle = document.getElementById('b10');  
      const filterOverlay = document.getElementById('b2');  
      const postProcessing = document.getElementById('b3');  
        
      // Settings and controls  
      const settings = {  
        t: 0,  
        waveFactor: 3,  
        radius: 200,  
        speed: 0.5,  
        angleStep: 1,  
        pointSize: 1.2,  
        colorSpeed: 1,  
        fade: 0.05,  
        paused: false,  
        colorMode: 'rainbow',  
        activeFilter: 'none',  
        bloomEffect: false  
      };  
        
      // Panel state  
      let isPanelCollapsed = false;  
        
      // Initialize canvas  
      function setupCanvas() {  
        canvas.width = window.innerWidth;  
        canvas.height = window.innerHeight;  
      }  
        
      // Apply visual filter  
      function applyFilter(filter) {  
        // Remove all classes first  
        filterOverlay.className = 'a2';  
          
        // Apply the selected filter  
        switch(filter) {  
          case 'none':  
            // No filter  
            break;  
          case 'neon':  
            filterOverlay.classList.add('a14', 'a3');  
            break;  
          case 'matrix':  
            filterOverlay.classList.add('a15', 'a3');  
            break;  
          case 'cosmic':  
            filterOverlay.classList.add('a16', 'a3');  
            break;  
          case 'retro':  
            filterOverlay.classList.add('a17', 'a3');  
            break;  
        }  
          
        settings.activeFilter = filter;  
          
        // Update active filter button  
        document.querySelectorAll('.a11[data-filter]').forEach(btn => {  
          if (btn.dataset.filter === filter) {  
            btn.classList.add('a3');  
          } else if (btn.dataset.filter) {  
            btn.classList.remove('a3');  
          }  
        });  
      }  
        
      // Toggle bloom effect  
      function toggleBloomEffect() {  
        settings.bloomEffect = !settings.bloomEffect;  
          
        if (settings.bloomEffect) {  
          postProcessing.classList.add('a19', 'a3');  
          document.getElementById('b7').querySelector('.a13').textContent = 'Bloom Effect: On';  
          document.getElementById('b7').classList.add('a3');  
        } else {  
          postProcessing.classList.remove('a3');  
          document.getElementById('b7').querySelector('.a13').textContent = 'Bloom Effect: Off';  
          document.getElementById('b7').classList.remove('a3');  
        }  
      }  
        
      // Get color based on current color mode  
      function getColor(angle) {  
        const hue = (angle + settings.t * settings.colorSpeed * 10) % 360;  
          
        switch(settings.colorMode) {  
          case 'rainbow':  
            return `hsl(${hue}, 100%, 60%)`;  
          case 'monochrome':  
            return `hsl(${settings.t * 5 % 360}, 70%, ${40 + 20 * Math.sin(angle / 30)}%)`;  
          case 'complementary':  
            return `hsl(${hue % 180 < 90 ? hue : (hue + 180) % 360}, 100%, 60%)`;  
          case 'analogous':  
            return `hsl(${(settings.t * 10 + angle / 2) % 60 + (settings.t * 2) % 300}, 100%, 60%)`;  
          case 'neon':  
            const brightness = 50 + 30 * Math.sin(settings.t / 2 + angle / 30);  
            return `hsl(${hue}, 100%, ${brightness}%)`;  
          default:  
            return `hsl(${hue}, 100%, 60%)`;  
        }  
      }  
        
      // Toggle color mode  
      function toggleColorMode() {  
        const modes = ['rainbow', 'monochrome', 'complementary', 'analogous', 'neon'];  
        const currentIndex = modes.indexOf(settings.colorMode);  
        settings.colorMode = modes[(currentIndex + 1) % modes.length];  
          
        // Update tooltip  
        const btn = document.getElementById('b6');  
        const tooltip = btn.querySelector('.a13');  
        tooltip.textContent = `Color: ${settings.colorMode.charAt(0).toUpperCase() + settings.colorMode.slice(1)}`;  
      }  
        
      // Main drawing function  
      function draw() {  
        // Apply fade effect  
        ctx.fillStyle = `rgba(15, 23, 42, ${settings.fade})`;  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
          
        const centerX = canvas.width / 2;  
        const centerY = canvas.height / 2;  
          
        // Apply special effects based on filter  
        if (settings.activeFilter === 'neon') {  
          ctx.shadowBlur = 15;  
          ctx.globalCompositeOperation = 'lighter';  
        } else if (settings.activeFilter === 'matrix') {  
          ctx.shadowBlur = 10;  
          ctx.globalCompositeOperation = 'screen';  
        } else if (settings.activeFilter === 'cosmic') {  
          ctx.shadowBlur = 12;  
          ctx.globalCompositeOperation = 'lighter';  
        } else if (settings.activeFilter === 'retro') {  
          ctx.shadowBlur = 8;  
          ctx.globalCompositeOperation = 'screen';  
        } else {  
          ctx.shadowBlur = 0;  
          ctx.globalCompositeOperation = 'source-over';  
        }  
          
        for (let a = 0; a < 360; a += settings.angleStep) {  
          // Convert to radians for Math functions  
          const aRad = a * Math.PI / 180;  
            
          // Calculate radius using wave factor  
          const r = settings.radius * Math.sin(settings.waveFactor * settings.t + a * 0.5);  
            
          // Convert to cartesian coordinates  
          const x = centerX + r * Math.cos(aRad);  
          const y = centerY + r * Math.sin(aRad);  
            
          // Get color based on current mode  
          const color = getColor(a);  
          ctx.strokeStyle = color;  
            
          // Set shadow color based on filter  
          if (settings.activeFilter === 'neon') {  
            ctx.shadowColor = color;  
          } else if (settings.activeFilter === 'matrix') {  
            ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';  
          } else if (settings.activeFilter === 'cosmic') {  
            ctx.shadowColor = 'rgba(100, 100, 255, 0.8)';  
          } else if (settings.activeFilter === 'retro') {  
            ctx.shadowColor = 'rgba(255, 100, 255, 0.8)';  
          }  
            
          // Draw point with enhanced glow for filters  
          ctx.lineWidth = settings.pointSize;  
          ctx.beginPath();  
            
          if (settings.activeFilter !== 'none') {  
            // Draw multiple points for enhanced glow effect  
            ctx.arc(x, y, settings.pointSize / 2, 0, Math.PI * 2);  
            ctx.stroke();  
              
            // Draw a smaller, brighter point on top  
            ctx.lineWidth = settings.pointSize / 2;  
            ctx.beginPath();  
            ctx.arc(x, y, settings.pointSize / 4, 0, Math.PI * 2);  
            ctx.stroke();  
          } else {  
            // Normal point  
            ctx.arc(x, y, settings.pointSize / 2, 0, Math.PI * 2);  
            ctx.stroke();  
          }  
        }  
          
        // Reset composite operation  
        ctx.globalCompositeOperation = 'source-over';  
          
        // Update time  
        if (!settings.paused) {  
          settings.t += settings.speed / 20;  
        }  
          
        requestAnimationFrame(draw);  
      }  
        
      // Initialize sliders and controls  
      function setupControls() {  
        // Wave Factor Slider  
        const waveFactorSlider = document.getElementById('b15');  
        const waveFactorDisplay = document.getElementById('b14');  
        waveFactorSlider.addEventListener('input', () => {  
          settings.waveFactor = parseFloat(waveFactorSlider.value);  
          waveFactorDisplay.textContent = settings.waveFactor.toFixed(1);  
        });  
          
        // Radius Slider  
        const radiusSlider = document.getElementById('b17');  
        const radiusDisplay = document.getElementById('b16');  
        radiusSlider.addEventListener('input', () => {  
          settings.radius = parseInt(radiusSlider.value);  
          radiusDisplay.textContent = settings.radius;  
        });  
          
        // Speed Slider  
        const speedSlider = document.getElementById('b20');  
        const speedDisplay = document.getElementById('b19');  
        speedSlider.addEventListener('input', () => {  
          settings.speed = parseFloat(speedSlider.value);  
          speedDisplay.textContent = settings.speed.toFixed(1);  
        });  
          
        // Angle Step Slider  
        const angleStepSlider = document.getElementById('b22');  
        const angleStepDisplay = document.getElementById('b21');  
        angleStepSlider.addEventListener('input', () => {  
          settings.angleStep = parseFloat(angleStepSlider.value);  
          angleStepDisplay.textContent = settings.angleStep.toFixed(1);  
        });  
          
        // Point Size Slider  
        const pointSizeSlider = document.getElementById('b24');  
        const pointSizeDisplay = document.getElementById('b23');  
        pointSizeSlider.addEventListener('input', () => {  
          settings.pointSize = parseFloat(pointSizeSlider.value);  
          pointSizeDisplay.textContent = settings.pointSize.toFixed(1);  
        });  
          
        // Color Speed Slider  
        const colorSpeedSlider = document.getElementById('b26');  
        const colorSpeedDisplay = document.getElementById('b25');  
        colorSpeedSlider.addEventListener('input', () => {  
          settings.colorSpeed = parseFloat(colorSpeedSlider.value);  
          colorSpeedDisplay.textContent = settings.colorSpeed.toFixed(1);  
        });  
          
        // Fade Slider  
        const fadeSlider = document.getElementById('b28');  
        const fadeDisplay = document.getElementById('b27');  
        fadeSlider.addEventListener('input', () => {  
          settings.fade = parseFloat(fadeSlider.value);  
          fadeDisplay.textContent = settings.fade.toFixed(2);  
        });  
          
        // Save Button  
        document.getElementById('b4').addEventListener('click', saveArtwork);  
          
        // Random Button  
        document.getElementById('b5').addEventListener('click', randomizeSettings);  
          
        // Panel handle for collapsing/expanding  
        panelHandle.addEventListener('click', togglePanel);  
          
        // Tab switching  
        document.getElementById('b11').addEventListener('click', () => switchTab('basic'));  
        document.getElementById('b12').addEventListener('click', () => switchTab('advanced'));  
          
        // Filter buttons  
        document.querySelectorAll('.a11[data-filter]').forEach(btn => {  
          btn.addEventListener('click', () => {  
            applyFilter(btn.dataset.filter);  
          });  
        });  
          
        // Color mode button  
        document.getElementById('b6').addEventListener('click', toggleColorMode);  
          
        // Bloom effect button  
        document.getElementById('b7').addEventListener('click', toggleBloomEffect);  
          
        // Pause button  
        document.getElementById('b8').addEventListener('click', () => {  
          settings.paused = !settings.paused;  
          updatePauseButton();  
        });  
          
        // Canvas click to pause/resume  
        canvas.addEventListener('click', (e) => {  
          // Ignore clicks near the control panel  
          const rect = controlPanel.getBoundingClientRect();  
          if (e.clientY < rect.top - 20) {  
            settings.paused = !settings.paused;  
            updatePauseButton();  
          }  
        });  
          
        // Double tap on mobile to toggle panel  
        let lastTap = 0;  
        canvas.addEventListener('touchend', (e) => {  
          const currentTime = new Date().getTime();  
          const tapLength = currentTime - lastTap;  
          if (tapLength < 300 && tapLength > 0) {  
            togglePanel();  
            e.preventDefault();  
          }  
          lastTap = currentTime;  
        });  
      }  
        
      function updatePauseButton() {  
        const pauseBtn = document.getElementById('b8');  
        if (settings.paused) {  
          pauseBtn.innerHTML = `  
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />  
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />  
            </svg>  
            <span class="a13">Play</span>  
          `;  
        } else {  
          pauseBtn.innerHTML = `  
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />  
            </svg>  
            <span class="a13">Pause</span>  
          `;  
        }  
      }  
        
      // Toggle panel collapsed state  
      function togglePanel() {  
        isPanelCollapsed = !isPanelCollapsed;  
        if (isPanelCollapsed) {  
          controlPanel.classList.add('a5');  
        } else {  
          controlPanel.classList.remove('a5');  
        }  
      }  
        
      // Switch between basic and advanced tabs  
      function switchTab(tab) {  
        const basicTab = document.getElementById('b11');  
        const advancedTab = document.getElementById('b12');  
        const basicContent = document.getElementById('b13');  
        const advancedContent = document.getElementById('b18');  
          
        if (tab === 'basic') {  
          basicTab.classList.remove('bg-indigo-800', 'text-gray-300');  
          basicTab.classList.add('bg-indigo-600', 'text-white', 'a10');  
          advancedTab.classList.remove('bg-indigo-600', 'text-white', 'a10');  
          advancedTab.classList.add('bg-indigo-800', 'text-gray-300');  
            
          basicContent.classList.add('a3');  
          advancedContent.classList.remove('a3');  
        } else {  
          advancedTab.classList.remove('bg-indigo-800', 'text-gray-300');  
          advancedTab.classList.add('bg-indigo-600', 'text-white', 'a10');  
          basicTab.classList.remove('bg-indigo-600', 'text-white', 'a10');  
          basicTab.classList.add('bg-indigo-800', 'text-gray-300');  
            
          advancedContent.classList.add('a3');  
          basicContent.classList.remove('a3');  
        }  
      }  
        
      // Preset configurations  
      window.setPreset = function(presetName) {  
        switch(presetName) {  
          case 'flower':  
            updateSettings(5, 200, 0.5, 1, 1.2, 1, 0.05);  
            break;  
          case 'spiral':  
            updateSettings(2, 250, 0.8, 0.5, 1, 2, 0.03);  
            break;  
          case 'star':  
            updateSettings(7, 180, 0.3, 2, 1.5, 0.5, 0.08);  
            break;  
          case 'wave':  
            updateSettings(1, 300, 0.6, 1, 2, 1.5, 0.04);  
            break;  
          case 'orbit':  
            updateSettings(4, 220, 0.4, 3, 1, 3, 0.02);  
            break;  
        }  
        updateSliders();  
      }  
        
      // Update all settings at once  
      function updateSettings(waveFactor, radius, speed, angleStep, pointSize, colorSpeed, fade) {  
        settings.waveFactor = waveFactor;  
        settings.radius = radius;  
        settings.speed = speed;  
        settings.angleStep = angleStep;  
        settings.pointSize = pointSize;  
        settings.colorSpeed = colorSpeed;  
        settings.fade = fade;  
      }  
        
      // Update all sliders to match settings  
      function updateSliders() {  
        document.getElementById('b15').value = settings.waveFactor;  
        document.getElementById('b14').textContent = settings.waveFactor.toFixed(1);  
          
        document.getElementById('b17').value = settings.radius;  
        document.getElementById('b16').textContent = settings.radius;  
          
        document.getElementById('b20').value = settings.speed;  
        document.getElementById('b19').textContent = settings.speed.toFixed(1);  
          
        document.getElementById('b22').value = settings.angleStep;  
        document.getElementById('b21').textContent = settings.angleStep.toFixed(1);  
          
        document.getElementById('b24').value = settings.pointSize;  
        document.getElementById('b23').textContent = settings.pointSize.toFixed(1);  
          
        document.getElementById('b26').value = settings.colorSpeed;  
        document.getElementById('b25').textContent = settings.colorSpeed.toFixed(1);  
          
        document.getElementById('b28').value = settings.fade;  
        document.getElementById('b27').textContent = settings.fade.toFixed(2);  
      }  
        
      // Randomize all settings  
      function randomizeSettings() {  
        updateSettings(  
          Math.random() * 9 + 1,                // waveFactor: 1-10  
          Math.random() * 300 + 50,             // radius: 50-350  
          Math.random() * 1.9 + 0.1,            // speed: 0.1-2  
          Math.random() * 9.5 + 0.5,            // angleStep: 0.5-10  
          Math.random() * 4.5 + 0.5,            // pointSize: 0.5-5  
          Math.random() * 4.9 + 0.1,            // colorSpeed: 0.1-5  
          Math.random() * 0.19 + 0.01           // fade: 0.01-0.2  
        );  
        updateSliders();  
          
        // Randomly select a filter  
        const filters = ['none', 'neon', 'matrix', 'cosmic', 'retro'];  
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];  
        applyFilter(randomFilter);  
          
        // Randomly select a color mode  
        const modes = ['rainbow', 'monochrome', 'complementary', 'analogous', 'neon'];  
        settings.colorMode = modes[Math.floor(Math.random() * modes.length)];  
          
        // Update color mode tooltip  
        const btn = document.getElementById('b6');  
        const tooltip = btn.querySelector('.a13');  
        tooltip.textContent = `Color: ${settings.colorMode.charAt(0).toUpperCase() + settings.colorMode.slice(1)}`;  
          
        // Random chance to enable bloom  
        if (Math.random() > 0.5) {  
          if (!settings.bloomEffect) toggleBloomEffect();  
        } else {  
          if (settings.bloomEffect) toggleBloomEffect();  
        }  
      }  
        
      // Clear the canvas  
      window.clearCanvas = function() {  
        ctx.fillStyle = 'rgb(15, 23, 42)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
      }  
        
      // Save artwork as PNG  
      function saveArtwork() {  
        // Create a temporary canvas to combine all layers  
        const tempCanvas = document.createElement('canvas');  
        tempCanvas.width = canvas.width;  
        tempCanvas.height = canvas.height;  
        const tempCtx = tempCanvas.getContext('2d');  
          
        // Draw the main canvas  
        tempCtx.drawImage(canvas, 0, 0);  
          
        // Add filter effects if active  
        if (settings.activeFilter !== 'none' || settings.bloomEffect) {  
          tempCtx.globalCompositeOperation = 'screen';  
            
          // Create a gradient based on the active filter  
          let gradient;  
            
          if (settings.activeFilter === 'neon') {  
            gradient = tempCtx.createRadialGradient(  
              canvas.width/2, canvas.height/2, 0,  
              canvas.width/2, canvas.height/2, canvas.width/2  
            );  
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');  
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');  
          } else if (settings.activeFilter === 'matrix') {  
            gradient = tempCtx.createLinearGradient(0, 0, 0, canvas.height);  
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.1)');  
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');  
          } else if (settings.activeFilter === 'cosmic') {  
            gradient = tempCtx.createRadialGradient(  
              canvas.width/2, canvas.height/2, 0,  
              canvas.width/2, canvas.height/2, canvas.width/2  
            );  
            gradient.addColorStop(0, 'rgba(100, 100, 255, 0.15)');  
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');  
          } else if (settings.activeFilter === 'retro') {  
            gradient = tempCtx.createLinearGradient(0, 0, 0, canvas.height);  
            gradient.addColorStop(0, 'rgba(255, 100, 255, 0.1)');  
            gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');  
          }  
            
          if (gradient) {  
            tempCtx.fillStyle = gradient;  
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);  
          }  
            
          // Add bloom effect if active  
          if (settings.bloomEffect) {  
            tempCtx.globalCompositeOperation = 'overlay';  
            const bloomGradient = tempCtx.createRadialGradient(  
              canvas.width/2, canvas.height/2, 0,  
              canvas.width/2, canvas.height/2, canvas.width/2  
            );  
            bloomGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');  
            bloomGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');  
            bloomGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');  
              
            tempCtx.fillStyle = bloomGradient;  
            tempCtx.fillRect(0, 0, canvas.width, canvas.height);  
          }  
        }  
          
        // Create download link  
        const link = document.createElement('a');  
        link.download = 'mathematical-art.png';  
        link.href = tempCanvas.toDataURL('image/png');  
        link.click();  
      }  
        
      // Handle window resize  
      window.addEventListener('resize', () => {  
        setupCanvas();  
      });  
        
      // Initialize everything  
      setupCanvas();  
      setupControls();  
      draw();  
        
      // Auto-collapse panel on mobile devices  
      if (window.innerWidth < 768) {  
        setTimeout(() => {  
          togglePanel();  
        }, 3000);  
      }  
    })();  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601971d15c1dbe8',t:'MTc1MjY2OTg1OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
  
  
  
 Version 2:  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Mathematical Art Generator</title>  
  <script src="https://cdn.tailwindcss.com"></script>  
  <style>  
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Inter:wght@300;400;500;700&display=swap');  
    body{margin:0;overflow:hidden;background:#0f172a;font-family:'Inter',sans-serif}canvas{display:block;position:absolute;top:0;left:0;z-index:1}.a1{position:relative;width:100%;height:100vh;overflow:hidden}.a2{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;mix-blend-mode:screen;opacity:0;transition:opacity .5s ease}.a2.a3{opacity:1}.a4{background:rgba(15,23,42,.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);transition:transform .3s ease-in-out;box-shadow:0 -5px 25px rgba(139,92,246,.15);z-index:20}.a4.a5{transform:translateY(calc(100% - 40px))}input[type=range]{-webkit-appearance:none;height:6px;background:#334155;border-radius:3px;outline:0}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#8b5cf6;cursor:pointer;transition:all .2s;box-shadow:0 0 8px rgba(139,92,246,.8)}input[type=range]::-webkit-slider-thumb:hover{background:#a78bfa;transform:scale(1.1);box-shadow:0 0 12px #8b5cf6}.a6{transition:all .2s;position:relative;overflow:hidden}.a6::after{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent,rgba(255,255,255,.1),transparent);transform:rotate(45deg);transition:all .3s}.a6:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(139,92,246,.3)}.a6:hover::after{left:100%}.a6:active{transform:translateY(0)}.a7{cursor:pointer;height:6px;width:40px;background:rgba(255,255,255,.2);border-radius:3px;margin:8px auto;transition:all .3s}.a7:hover{background:rgba(255,255,255,.4);box-shadow:0 0 8px rgba(255,255,255,.4)}.a8{display:none}.a8.a3{display:block}.a9{font-family:'Orbitron',sans-serif;text-shadow:0 0 5px rgba(139,92,246,.8),0 0 10px rgba(139,92,246,.5),0 0 15px rgba(139,92,246,.3);letter-spacing:1px}.a10{box-shadow:0 0 5px rgba(139,92,246,.8),inset 0 0 5px rgba(139,92,246,.5)}.a11{opacity:.7;transition:all .2s}.a11.a3{opacity:1;transform:scale(1.05);box-shadow:0 0 10px rgba(139,92,246,.8)}.a11:hover{opacity:.9}.a12{position:relative}.a12 .a13{visibility:hidden;background-color:rgba(15,23,42,.9);color:#fff;text-align:center;border-radius:6px;padding:5px 10px;position:absolute;z-index:1;bottom:125%;left:50%;transform:translateX(-50%);opacity:0;transition:opacity .3s;font-size:12px;white-space:nowrap}.a12:hover .a13{visibility:visible;opacity:1}.a14{background:radial-gradient(circle at center,transparent 30%,rgba(139,92,246,.05) 70%,rgba(139,92,246,.1) 100%);box-shadow:inset 0 0 150px rgba(139,92,246,.5)}.a15{background:linear-gradient(0deg,rgba(0,255,0,.05) 0%,transparent 100%);box-shadow:inset 0 0 150px rgba(0,255,0,.3)}.a16{background:radial-gradient(ellipse at center,rgba(100,100,255,.05) 0%,transparent 70%);box-shadow:inset 0 0 200px rgba(100,100,255,.3)}.a17{background:linear-gradient(180deg,rgba(255,100,255,.05) 0%,transparent 100%);box-shadow:inset 0 0 150px rgba(255,100,255,.3)}.a18{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;mix-blend-mode:overlay;opacity:0;transition:opacity .5s ease}.a18.a3{opacity:.7}.a19{background:radial-gradient(circle at center,rgba(255,255,255,.1) 0%,transparent 70%)}  
  </style>  
</head>  
<body class="text-white">  
  <div class="relative w-full h-screen">  
    <div class="a1">  
      <canvas id="b1"></canvas>  
      <div id="b2" class="a2"></div>  
      <div id="b3" class="a18"></div>  
    </div>  
      
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">  
      <h1 class="a9 text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">  
        Mathematical Art  
      </h1>  
      <div class="flex gap-2">  
        <button id="b4" class="a6 bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-lg text-sm font-medium a10 a12">  
          Save  
          <span class="a13">Download as PNG</span>  
        </button>  
        <button id="b5" class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-sm font-medium a10 a12">  
          Random  
          <span class="a13">Generate random pattern</span>  
        </button>  
      </div>  
    </div>  
      
    <div class="absolute top-16 left-4 flex flex-col gap-2 z-10">  
      <button class="a11 active p-2 rounded-full bg-indigo-900 a10 a12" data-filter="none">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <circle cx="12" cy="12" r="10" stroke-width="2"/>  
        </svg>  
        <span class="a13">Normal</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="neon">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />  
        </svg>  
        <span class="a13">Neon Glow</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="matrix">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />  
        </svg>  
        <span class="a13">Matrix</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="cosmic">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />  
        </svg>  
        <span class="a13">Cosmic</span>  
      </button>  
      <button class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-filter="retro">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />  
        </svg>  
        <span class="a13">Retro</span>  
      </button>  
    </div>  
      
    <div class="absolute top-16 right-4 flex flex-col gap-2 z-10">  
      <button id="b6" class="a11 p-2 rounded-full bg-indigo-900 a10 a12" data-mode="rainbow">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />  
        </svg>  
        <span class="a13">Color: Rainbow</span>  
      </button>  
      <button id="b7" class="a11 p-2 rounded-full bg-indigo-900 a10 a12">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />  
        </svg>  
        <span class="a13">Bloom Effect: Off</span>  
      </button>  
      <button id="b8" class="a11 p-2 rounded-full bg-indigo-900 a10 a12">  
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />  
        </svg>  
        <span class="a13">Pause</span>  
      </button>  
    </div>  
      
    <div id="b9" class="a4 absolute bottom-0 left-0 right-0 p-2 rounded-t-xl z-20">  
      <div class="a7" id="b10"></div>  
        
      <div class="flex justify-center mb-2">  
        <div class="inline-flex rounded-md shadow-sm" role="group">  
          <button id="b11" class="px-4 py-1 text-xs font-medium bg-indigo-600 text-white rounded-l-lg a10">  
            Basic  
          </button>  
          <button id="b12" class="px-4 py-1 text-xs font-medium bg-indigo-800 text-gray-300 rounded-r-lg">  
            Advanced  
          </button>  
        </div>  
      </div>  
        
      <div id="b13" class="a8 a3">  
        <div class="grid grid-cols-2 gap-3">  
          <div>  
            <label class="block mb-1 text-xs font-medium">Wave: <span id="b14">3</span></label>  
            <input type="range" id="b15" min="1" max="10" step="0.1" value="3" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Radius: <span id="b16">200</span></label>  
            <input type="range" id="b17" min="50" max="350" value="200" class="w-full">  
          </div>  
        </div>  
          
        <div class="flex flex-wrap gap-2 mt-3">  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="c1('flower')">Flower</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="c1('spiral')">Spiral</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="c1('star')">Star</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="c1('wave')">Wave</button>  
          <button class="a6 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg text-xs a10" onclick="c1('orbit')">Orbit</button>  
          <button class="a6 bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-xs a10" onclick="c2()">Clear</button>  
        </div>  
      </div>  
        
      <div id="b18" class="a8">  
        <div class="grid grid-cols-2 gap-3">  
          <div>  
            <label class="block mb-1 text-xs font-medium">Speed: <span id="b19">0.5</span></label>  
            <input type="range" id="b20" min="0.1" max="2" step="0.1" value="0.5" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Angle Step: <span id="b21">1</span>°</label>  
            <input type="range" id="b22" min="0.5" max="10" step="0.5" value="1" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Point Size: <span id="b23">1.2</span></label>  
            <input type="range" id="b24" min="0.5" max="5" step="0.1" value="1.2" class="w-full">  
          </div>  
          <div>  
            <label class="block mb-1 text-xs font-medium">Color Speed: <span id="b25">1</span></label>  
            <input type="range" id="b26" min="0.1" max="5" step="0.1" value="1" class="w-full">  
          </div>  
          <div class="col-span-2">  
            <label class="block mb-1 text-xs font-medium">Fade: <span id="b27">0.05</span></label>  
            <input type="range" id="b28" min="0.01" max="0.2" step="0.01" value="0.05" class="w-full">  
          </div>  
        </div>  
      </div>  
    </div>  
  </div>  
  
  <script>  
    (function(){const d1=document.getElementById('b1');const d2=d1.getContext('2d');const d3=document.getElementById('b9');const d4=document.getElementById('b10');const d5=document.getElementById('b2');const d6=document.getElementById('b3');const d7={t:0,a:3,b:200,c:0.5,d:1,e:1.2,f:1,g:0.05,h:!1,i:'rainbow',j:'none',k:!1};let d8=!1;function d9(){d1.width=window.innerWidth;d1.height=window.innerHeight}function e1(a){d5.className='a2';switch(a){case'none':break;case'neon':d5.classList.add('a14','a3');break;case'matrix':d5.classList.add('a15','a3');break;case'cosmic':d5.classList.add('a16','a3');break;case'retro':d5.classList.add('a17','a3');break}d7.j=a;document.querySelectorAll('.a11[data-filter]').forEach(b=>{if(b.dataset.filter===a){b.classList.add('a3')}else if(b.dataset.filter){b.classList.remove('a3')}})}function e2(){d7.k=!d7.k;if(d7.k){d6.classList.add('a19','a3');document.getElementById('b7').querySelector('.a13').textContent='Bloom Effect: On';document.getElementById('b7').classList.add('a3')}else{d6.classList.remove('a3');document.getElementById('b7').querySelector('.a13').textContent='Bloom Effect: Off';document.getElementById('b7').classList.remove('a3')}}function e3(a){const b=(a+d7.t*d7.f*10)%360;switch(d7.i){case'rainbow':return`hsl(${b}, 100%, 60%)`;case'monochrome':return`hsl(${d7.t*5%360}, 70%, ${40+20*Math.sin(a/30)}%)`;case'complementary':return`hsl(${b%180<90?b:(b+180)%360}, 100%, 60%)`;case'analogous':return`hsl(${(d7.t*10+a/2)%60+(d7.t*2)%300}, 100%, 60%)`;case'neon':const c=50+30*Math.sin(d7.t/2+a/30);return`hsl(${b}, 100%, ${c}%)`;default:return`hsl(${b}, 100%, 60%)`}}function e4(){const a=['rainbow','monochrome','complementary','analogous','neon'];const b=a.indexOf(d7.i);d7.i=a[(b+1)%a.length];const c=document.getElementById('b6');const d=c.querySelector('.a13');d.textContent=`Color: ${d7.i.charAt(0).toUpperCase()+d7.i.slice(1)}`}function e5(){d2.fillStyle=`rgba(15, 23, 42, ${d7.g})`;d2.fillRect(0,0,d1.width,d1.height);const a=d1.width/2;const b=d1.height/2;if(d7.j==='neon'){d2.shadowBlur=15;d2.globalCompositeOperation='lighter'}else if(d7.j==='matrix'){d2.shadowBlur=10;d2.globalCompositeOperation='screen'}else if(d7.j==='cosmic'){d2.shadowBlur=12;d2.globalCompositeOperation='lighter'}else if(d7.j==='retro'){d2.shadowBlur=8;d2.globalCompositeOperation='screen'}else{d2.shadowBlur=0;d2.globalCompositeOperation='source-over'}for(let c=0;c<360;c+=d7.d){const d=c*Math.PI/180;const e=d7.b*Math.sin(d7.a*d7.t+c*0.5);const f=a+e*Math.cos(d);const g=b+e*Math.sin(d);const h=e3(c);d2.strokeStyle=h;if(d7.j==='neon'){d2.shadowColor=h}else if(d7.j==='matrix'){d2.shadowColor='rgba(0, 255, 0, 0.8)'}else if(d7.j==='cosmic'){d2.shadowColor='rgba(100, 100, 255, 0.8)'}else if(d7.j==='retro'){d2.shadowColor='rgba(255, 100, 255, 0.8)'}d2.lineWidth=d7.e;d2.beginPath();if(d7.j!=='none'){d2.arc(f,g,d7.e/2,0,Math.PI*2);d2.stroke();d2.lineWidth=d7.e/2;d2.beginPath();d2.arc(f,g,d7.e/4,0,Math.PI*2);d2.stroke()}else{d2.arc(f,g,d7.e/2,0,Math.PI*2);d2.stroke()}}d2.globalCompositeOperation='source-over';if(!d7.h){d7.t+=d7.c/20}requestAnimationFrame(e5)}function e6(){const a=document.getElementById('b15');const b=document.getElementById('b14');a.addEventListener('input',()=>{d7.a=parseFloat(a.value);b.textContent=d7.a.toFixed(1)});const c=document.getElementById('b17');const d=document.getElementById('b16');c.addEventListener('input',()=>{d7.b=parseInt(c.value);d.textContent=d7.b});const e=document.getElementById('b20');const f=document.getElementById('b19');e.addEventListener('input',()=>{d7.c=parseFloat(e.value);f.textContent=d7.c.toFixed(1)});const g=document.getElementById('b22');const h=document.getElementById('b21');g.addEventListener('input',()=>{d7.d=parseFloat(g.value);h.textContent=d7.d.toFixed(1)});const i=document.getElementById('b24');const j=document.getElementById('b23');i.addEventListener('input',()=>{d7.e=parseFloat(i.value);j.textContent=d7.e.toFixed(1)});const k=document.getElementById('b26');const l=document.getElementById('b25');k.addEventListener('input',()=>{d7.f=parseFloat(k.value);l.textContent=d7.f.toFixed(1)});const m=document.getElementById('b28');const n=document.getElementById('b27');m.addEventListener('input',()=>{d7.g=parseFloat(m.value);n.textContent=d7.g.toFixed(2)});document.getElementById('b4').addEventListener('click',e7);document.getElementById('b5').addEventListener('click',e8);d4.addEventListener('click',e9);document.getElementById('b11').addEventListener('click',()=>f1('basic'));document.getElementById('b12').addEventListener('click',()=>f1('advanced'));document.querySelectorAll('.a11[data-filter]').forEach(a=>{a.addEventListener('click',()=>{e1(a.dataset.filter)})});document.getElementById('b6').addEventListener('click',e4);document.getElementById('b7').addEventListener('click',e2);document.getElementById('b8').addEventListener('click',()=>{d7.h=!d7.h;f2()});d1.addEventListener('click',(a)=>{const b=d3.getBoundingClientRect();if(a.clientY<b.top-20){d7.h=!d7.h;f2()}});let o=0;d1.addEventListener('touchend',(a)=>{const b=new Date().getTime();const c=b-o;if(c<300&&c>0){e9();a.preventDefault()}o=b})}function f2(){const a=document.getElementById('b8');if(d7.h){a.innerHTML=`  
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />  
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />  
          </svg>  
          <span class="a13">Play</span>  
        `}else{a.innerHTML=`  
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">  
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />  
          </svg>  
          <span class="a13">Pause</span>  
        `}}function e9(){d8=!d8;if(d8){d3.classList.add('a5')}else{d3.classList.remove('a5')}}function f1(a){const b=document.getElementById('b11');const c=document.getElementById('b12');const d=document.getElementById('b13');const e=document.getElementById('b18');if(a==='basic'){b.classList.remove('bg-indigo-800','text-gray-300');b.classList.add('bg-indigo-600','text-white','a10');c.classList.remove('bg-indigo-600','text-white','a10');c.classList.add('bg-indigo-800','text-gray-300');d.classList.add('a3');e.classList.remove('a3')}else{c.classList.remove('bg-indigo-800','text-gray-300');c.classList.add('bg-indigo-600','text-white','a10');b.classList.remove('bg-indigo-600','text-white','a10');b.classList.add('bg-indigo-800','text-gray-300');e.classList.add('a3');d.classList.remove('a3')}}function c1(a){switch(a){case'flower':f3(5,200,0.5,1,1.2,1,0.05);break;case'spiral':f3(2,250,0.8,0.5,1,2,0.03);break;case'star':f3(7,180,0.3,2,1.5,0.5,0.08);break;case'wave':f3(1,300,0.6,1,2,1.5,0.04);break;case'orbit':f3(4,220,0.4,3,1,3,0.02);break}f4()}function f3(a,b,c,d,e,f,g){d7.a=a;d7.b=b;d7.c=c;d7.d=d;d7.e=e;d7.f=f;d7.g=g}function f4(){document.getElementById('b15').value=d7.a;document.getElementById('b14').textContent=d7.a.toFixed(1);document.getElementById('b17').value=d7.b;document.getElementById('b16').textContent=d7.b;document.getElementById('b20').value=d7.c;document.getElementById('b19').textContent=d7.c.toFixed(1);document.getElementById('b22').value=d7.d;document.getElementById('b21').textContent=d7.d.toFixed(1);document.getElementById('b24').value=d7.e;document.getElementById('b23').textContent=d7.e.toFixed(1);document.getElementById('b26').value=d7.f;document.getElementById('b25').textContent=d7.f.toFixed(1);document.getElementById('b28').value=d7.g;document.getElementById('b27').textContent=d7.g.toFixed(2)}function e8(){f3(Math.random()*9+1,Math.random()*300+50,Math.random()*1.9+0.1,Math.random()*9.5+0.5,Math.random()*4.5+0.5,Math.random()*4.9+0.1,Math.random()*0.19+0.01);f4();const a=['none','neon','matrix','cosmic','retro'];const b=a[Math.floor(Math.random()*a.length)];e1(b);const c=['rainbow','monochrome','complementary','analogous','neon'];d7.i=c[Math.floor(Math.random()*c.length)];const d=document.getElementById('b6');const e=d.querySelector('.a13');e.textContent=`Color: ${d7.i.charAt(0).toUpperCase()+d7.i.slice(1)}`;if(Math.random()>0.5){if(!d7.k)e2()}else{if(d7.k)e2()}}function c2(){d2.fillStyle='rgb(15, 23, 42)';d2.fillRect(0,0,d1.width,d1.height)}function e7(){const a=document.createElement('canvas');a.width=d1.width;a.height=d1.height;const b=a.getContext('2d');b.drawImage(d1,0,0);if(d7.j!=='none'||d7.k){b.globalCompositeOperation='screen';let c;if(d7.j==='neon'){c=b.createRadialGradient(d1.width/2,d1.height/2,0,d1.width/2,d1.height/2,d1.width/2);c.addColorStop(0,'rgba(139, 92, 246, 0.2)');c.addColorStop(1,'rgba(15, 23, 42, 0)')}else if(d7.j==='matrix'){c=b.createLinearGradient(0,0,0,d1.height);c.addColorStop(0,'rgba(0, 255, 0, 0.1)');c.addColorStop(1,'rgba(15, 23, 42, 0)')}else if(d7.j==='cosmic'){c=b.createRadialGradient(d1.width/2,d1.height/2,0,d1.width/2,d1.height/2,d1.width/2);c.addColorStop(0,'rgba(100, 100, 255, 0.15)');c.addColorStop(1,'rgba(15, 23, 42, 0)')}else if(d7.j==='retro'){c=b.createLinearGradient(0,0,0,d1.height);c.addColorStop(0,'rgba(255, 100, 255, 0.1)');c.addColorStop(1,'rgba(15, 23, 42, 0)')}if(c){b.fillStyle=c;b.fillRect(0,0,d1.width,d1.height)}if(d7.k){b.globalCompositeOperation='overlay';const d=b.createRadialGradient(d1.width/2,d1.height/2,0,d1.width/2,d1.height/2,d1.width/2);d.addColorStop(0,'rgba(255, 255, 255, 0.15)');d.addColorStop(0.5,'rgba(255, 255, 255, 0.05)');d.addColorStop(1,'rgba(15, 23, 42, 0)');b.fillStyle=d;b.fillRect(0,0,d1.width,d1.height)}}const d=document.createElement('a');d.download='mathematical-art.png';d.href=a.toDataURL('image/png');d.click()}window.addEventListener('resize',()=>{d9()});d9();e6();e5();if(window.innerWidth<768){setTimeout(()=>{e9()},3000)}})();  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601991f3092d391',t:'MTc1MjY2OTk0MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
