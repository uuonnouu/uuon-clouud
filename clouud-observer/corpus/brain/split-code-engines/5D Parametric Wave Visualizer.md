## 5D Parametric Wave Visualizer  
## Interactive visualization with W and U parameters creating multidimensional phase coupling  
  
<!doctype html>  
<html lang="en">  
 <head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>3D Wave Pattern Visualizer</title>  
  <script src="/_sdk/element_sdk.js"></script>  
  <style>  
        body {  
            box-sizing: border-box;  
            margin: 0;  
            padding: 0;  
            height: 100%;  
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;  
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);  
            color: #ffffff;  
            overflow: hidden;  
        }  
  
        html {  
            height: 100%;  
        }  
  
        .container {  
            height: 100%;  
            display: flex;  
            flex-direction: column;  
            position: relative;  
        }  
  
        .header {  
            padding: 20px;  
            text-align: center;  
            background: rgba(255, 255, 255, 0.05);  
            backdrop-filter: blur(10px);  
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);  
            z-index: 10;  
        }  
  
        .title {  
            font-size: 28px;  
            font-weight: 700;  
            margin: 0 0 8px 0;  
            background: linear-gradient(45deg, #64ffda, #00bcd4, #3f51b5);  
            -webkit-background-clip: text;  
            -webkit-text-fill-color: transparent;  
            background-clip: text;  
        }  
  
        .description {  
            font-size: 14px;  
            opacity: 0.8;  
            margin: 0;  
        }  
  
        .main-content {  
            flex: 1;  
            display: flex;  
            position: relative;  
            overflow: hidden;  
        }  
  
        .canvas-container {  
            flex: 1;  
            position: relative;  
            background: radial-gradient(circle at center, rgba(100, 255, 218, 0.1) 0%, transparent 70%);  
        }  
  
        .canvas {  
            width: 100%;  
            height: 100%;  
            display: block;  
            cursor: grab;  
        }  
  
        .canvas:active {  
            cursor: grabbing;  
        }  
  
        .controls {  
            position: absolute;  
            top: 20px;  
            right: 20px;  
            background: rgba(0, 0, 0, 0.7);  
            backdrop-filter: blur(10px);  
            border-radius: 12px;  
            padding: 20px;  
            min-width: 280px;  
            max-height: 80%;  
            overflow-y: auto;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            z-index: 5;  
        }  
  
        .control-group {  
            margin-bottom: 20px;  
        }  
  
        .control-group:last-child {  
            margin-bottom: 0;  
        }  
  
        .control-label {  
            display: block;  
            font-size: 12px;  
            font-weight: 600;  
            margin-bottom: 8px;  
            color: #64ffda;  
            text-transform: uppercase;  
            letter-spacing: 0.5px;  
        }  
  
        .pattern-selector {  
            display: grid;  
            grid-template-columns: 1fr 1fr;  
            gap: 8px;  
            margin-bottom: 15px;  
        }  
  
        .pattern-btn {  
            padding: 8px 12px;  
            background: rgba(255, 255, 255, 0.1);  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            border-radius: 6px;  
            color: #ffffff;  
            font-size: 11px;  
            cursor: pointer;  
            transition: all 0.3s ease;  
            text-align: center;  
        }  
  
        .pattern-btn:hover {  
            background: rgba(100, 255, 218, 0.2);  
            border-color: #64ffda;  
        }  
  
        .pattern-btn.active {  
            background: #64ffda;  
            color: #0f0f23;  
            border-color: #64ffda;  
        }  
  
        .slider-container {  
            margin-bottom: 12px;  
        }  
  
        .slider {  
            width: 100%;  
            height: 4px;  
            border-radius: 2px;  
            background: rgba(255, 255, 255, 0.2);  
            outline: none;  
            -webkit-appearance: none;  
            appearance: none;  
        }  
  
        .slider::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            appearance: none;  
            width: 16px;  
            height: 16px;  
            border-radius: 50%;  
            background: #64ffda;  
            cursor: pointer;  
            border: 2px solid #0f0f23;  
        }  
  
        .slider::-moz-range-thumb {  
            width: 16px;  
            height: 16px;  
            border-radius: 50%;  
            background: #64ffda;  
            cursor: pointer;  
            border: 2px solid #0f0f23;  
        }  
  
        .slider-value {  
            font-size: 11px;  
            color: #ffffff;  
            opacity: 0.7;  
            margin-top: 4px;  
        }  
  
        .info-panel {  
            position: absolute;  
            bottom: 20px;  
            left: 20px;  
            background: rgba(0, 0, 0, 0.7);  
            backdrop-filter: blur(10px);  
            border-radius: 12px;  
            padding: 15px;  
            max-width: 350px;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            z-index: 5;  
        }  
  
        .info-title {  
            font-size: 14px;  
            font-weight: 600;  
            color: #64ffda;  
            margin-bottom: 8px;  
        }  
  
        .info-formula {  
            font-family: 'Courier New', monospace;  
            font-size: 12px;  
            background: rgba(255, 255, 255, 0.1);  
            padding: 8px;  
            border-radius: 4px;  
            margin-bottom: 8px;  
            color: #ffffff;  
        }  
  
        .info-description {  
            font-size: 11px;  
            line-height: 1.4;  
            opacity: 0.8;  
        }  
  
        .loading {  
            position: absolute;  
            top: 50%;  
            left: 50%;  
            transform: translate(-50%, -50%);  
            color: #64ffda;  
            font-size: 14px;  
        }  
  
        @media (max-width: 768px) {  
            .controls {  
                position: static;  
                margin: 10px;  
                min-width: auto;  
                max-height: none;  
            }  
  
            .main-content {  
                flex-direction: column;  
            }  
  
            .canvas-container {  
                height: 60%;  
            }  
  
            .info-panel {  
                position: static;  
                margin: 10px;  
                max-width: none;  
            }  
        }  
    </style>  
  <style>@view-transition { navigation: auto; }</style>  
  <script src="/_sdk/data_sdk.js" type="text/javascript"></script>  
  <script src="https://cdn.tailwindcss.com" type="text/javascript"></script>  
 </head>  
 <body>  
  <div class="container">  
   <header class="header">  
    <h1 class="title" id="main-title">5D Parametric Wave Visualizer</h1>  
    <p class="description" id="description-text">Interactive visualization with W and U parameters creating multidimensional phase coupling</p>  
   </header>  
   <main class="main-content">  
    <div class="canvas-container">  
     <canvas class="canvas" id="canvas"></canvas>  
     <div class="loading" id="loading">  
      Initializing 5D renderer...  
     </div>  
    </div>  
    <div class="controls">  
     <div class="control-group"><label class="control-label">Wave Patterns</label>  
      <div class="pattern-selector"><button class="pattern-btn active" data-pattern="sine">Sine Wave</button> <button class="pattern-btn" data-pattern="cosine">Cosine Wave</button> <button class="pattern-btn" data-pattern="composite">Composite</button> <button class="pattern-btn" data-pattern="spiral">Log Spiral</button> <button class="pattern-btn" data-pattern="rose">Rose Curve</button> <button class="pattern-btn" data-pattern="cardioid">Cardioid</button>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">Amplitude</label>  
      <div class="slider-container"><input type="range" class="slider" id="amplitude" min="0.1" max="3" step="0.1" value="1">  
       <div class="slider-value" id="amplitude-value">  
        1.0  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">Frequency</label>  
      <div class="slider-container"><input type="range" class="slider" id="frequency" min="0.1" max="5" step="0.1" value="1">  
       <div class="slider-value" id="frequency-value">  
        1.0  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">Animation Speed</label>  
      <div class="slider-container"><input type="range" class="slider" id="speed" min="0" max="3" step="0.1" value="1">  
       <div class="slider-value" id="speed-value">  
        1.0  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">W Parameter (Temporal Coupling)</label>  
      <div class="slider-container"><input type="range" class="slider" id="w-param" min="0" max="3" step="0.1" value="0.5">  
       <div class="slider-value" id="w-param-value">  
        0.5  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">U Parameter (Phase Coupling)</label>  
      <div class="slider-container"><input type="range" class="slider" id="u-param" min="0" max="2" step="0.1" value="0.3">  
       <div class="slider-value" id="u-param-value">  
        0.3  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">Resolution</label>  
      <div class="slider-container"><input type="range" class="slider" id="resolution" min="20" max="100" step="5" value="50">  
       <div class="slider-value" id="resolution-value">  
        50  
       </div>  
      </div>  
     </div>  
     <div class="control-group"><label class="control-label">Zoom</label>  
      <div class="slider-container"><input type="range" class="slider" id="zoom" min="0.2" max="5" step="0.1" value="1">  
       <div class="slider-value" id="zoom-value">  
        1.0  
       </div>  
      </div>  
     </div>  
    </div>  
    <div class="info-panel">  
     <div class="info-title" id="pattern-name">  
      5D Sine Wave Algorithm  
     </div>  
     <div class="info-formula" id="pattern-formula">  
      z = A × sin(k×r + ω×t + W×sin(U×θ + t²))  
     </div>  
     <div class="info-description" id="pattern-description">  
      Creates complex multidimensional motion by coupling temporal (W) and phase (U) parameters. The W parameter introduces time-varying frequency modulation, while U creates angular phase coupling that allows the surface to shift through impossible angles and find dynamic equilibrium within apparent chaos.  
     </div>  
    </div>  
   </main>  
  </div>  
  <script>  
        // Default configuration  
        const defaultConfig = {  
            main_title: "5D Parametric Wave Visualizer",  
            description_text: "Interactive visualization with W and U parameters creating multidimensional phase coupling"  
        };  
  
        // 3D Renderer Class with W and U parameters  
        class Wave3DRenderer {  
            constructor(canvas) {  
                this.canvas = canvas;  
                this.ctx = canvas.getContext('2d');  
                this.width = 0;  
                this.height = 0;  
                this.time = 0;  
                this.mouseX = 0;  
                this.mouseY = 0;  
                this.rotationX = -0.5;  
                this.rotationY = 0;  
                this.isDragging = false;  
                this.zoom = 1;  
                this.minZoom = 0.2;  
                this.maxZoom = 5;  
                  
                this.params = {  
                    pattern: 'sine',  
                    amplitude: 1,  
                    frequency: 1,  
                    speed: 1,  
                    resolution: 50,  
                    wParam: 0.5,  // Temporal coupling parameter  
                    uParam: 0.3   // Phase coupling parameter  
                };  
  
                this.patterns = {  
                    sine: {  
                        name: '5D Sine Wave Algorithm',  
                        formula: 'z = A × sin(k×r + ω×t + W×sin(U×θ + t²))',  
                        description: 'Creates complex multidimensional motion by coupling temporal (W) and phase (U) parameters. The W parameter introduces time-varying frequency modulation, while U creates angular phase coupling that allows the surface to shift through impossible angles and find dynamic equilibrium within apparent chaos.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const temporalCoupling = w * Math.sin(u * theta + t * t * 0.1);  
                            return Math.sin(this.params.frequency * r + t + temporalCoupling);  
                        }  
                    },  
                    cosine: {  
                        name: '5D Cosine Wave Algorithm',  
                        formula: 'z = A × cos(k×r + ω×t + W×cos(U×θ×t))',  
                        description: 'Phase-shifted wave with W creating temporal-angular coupling and U modulating the phase relationship between space and time dimensions.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const phaseCoupling = w * Math.cos(u * theta * t * 0.5);  
                            return Math.cos(this.params.frequency * r + t + phaseCoupling);  
                        }  
                    },  
                    composite: {  
                        name: '5D Composite Wave Algorithm',  
                        formula: 'z = A × [sin(k×r + ω×t + W×U×θ) + 0.5×sin(2k×r + W×t²)]',  
                        description: 'Multiple wave interference with W-U coupling creating complex standing wave patterns that morph through multiple dimensional states.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const coupling = w * u * theta;  
                            const wave1 = Math.sin(this.params.frequency * r + t + coupling);  
                            const wave2 = 0.5 * Math.sin(2 * this.params.frequency * r + w * t * t * 0.1);  
                            return wave1 + wave2;  
                        }  
                    },  
                    spiral: {  
                        name: '5D Logarithmic Spiral Pattern',  
                        formula: 'z = A × sin(k×ln(r+1) + ω×t + W×e^(U×θ))',  
                        description: 'Logarithmic spiral with exponential W-U coupling that creates self-similar patterns across multiple scales and temporal phases.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const exponentialCoupling = w * Math.exp(u * theta * 0.1) * 0.5;  
                            return Math.sin(this.params.frequency * Math.log(r + 1) + t + exponentialCoupling);  
                        }  
                    },  
                    rose: {  
                        name: '5D Rose Curve Pattern',  
                        formula: 'z = A × sin(n×θ + W×t) × sin(k×r + U×sin(θ×t))',  
                        description: 'Rose petals that dynamically reshape through W temporal modulation and U phase-space coupling, creating morphing floral geometries.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const temporalRose = Math.sin(3 * theta + w * t);  
                            const phaseCoupling = u * Math.sin(theta * t * 0.5);  
                            return temporalRose * Math.sin(this.params.frequency * r + phaseCoupling);  
                        }  
                    },  
                    cardioid: {  
                        name: '5D Cardioid Pattern',  
                        formula: 'z = A × (1 + cos(θ + W×t)) × sin(k×r + U×θ²)',  
                        description: 'Heart-shaped curves with W creating pulsing temporal dynamics and U introducing quadratic angular coupling for complex morphological transitions.',  
                        func: (x, y, t, w, u) => {  
                            const r = Math.sqrt(x*x + y*y);  
                            const theta = Math.atan2(y, x);  
                            const heartShape = (1 + Math.cos(theta + w * t));  
                            const quadraticCoupling = u * theta * theta * 0.1;  
                            return heartShape * Math.sin(this.params.frequency * r + quadraticCoupling) * 0.5;  
                        }  
                    }  
                };  
  
                this.setupEventListeners();  
                this.resize();  
                this.animate();  
            }  
  
            setupEventListeners() {  
                window.addEventListener('resize', () => this.resize());  
                  
                this.canvas.addEventListener('mousedown', (e) => {  
                    this.isDragging = true;  
                    this.mouseX = e.clientX;  
                    this.mouseY = e.clientY;  
                });  
  
                this.canvas.addEventListener('mousemove', (e) => {  
                    if (this.isDragging) {  
                        const deltaX = e.clientX - this.mouseX;  
                        const deltaY = e.clientY - this.mouseY;  
                          
                        this.rotationY += deltaX * 0.01;  
                        this.rotationX += deltaY * 0.01;  
                          
                        this.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.rotationX));  
                          
                        this.mouseX = e.clientX;  
                        this.mouseY = e.clientY;  
                    }  
                });  
  
                this.canvas.addEventListener('mouseup', () => {  
                    this.isDragging = false;  
                });  
  
                this.canvas.addEventListener('mouseleave', () => {  
                    this.isDragging = false;  
                });  
  
                // Touch events for mobile  
                this.canvas.addEventListener('touchstart', (e) => {  
                    e.preventDefault();  
                    const touch = e.touches[0];  
                    this.isDragging = true;  
                    this.mouseX = touch.clientX;  
                    this.mouseY = touch.clientY;  
                });  
  
                this.canvas.addEventListener('touchmove', (e) => {  
                    e.preventDefault();  
                    if (this.isDragging && e.touches.length === 1) {  
                        const touch = e.touches[0];  
                        const deltaX = touch.clientX - this.mouseX;  
                        const deltaY = touch.clientY - this.mouseY;  
                          
                        this.rotationY += deltaX * 0.01;  
                        this.rotationX += deltaY * 0.01;  
                          
                        this.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.rotationX));  
                          
                        this.mouseX = touch.clientX;  
                        this.mouseY = touch.clientY;  
                    }  
                });  
  
                this.canvas.addEventListener('touchend', (e) => {  
                    e.preventDefault();  
                    this.isDragging = false;  
                });  
  
                // Mouse wheel zoom  
                this.canvas.addEventListener('wheel', (e) => {  
                    e.preventDefault();  
                    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;  
                    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));  
                });  
  
                // Touch pinch zoom  
                let lastTouchDistance = 0;  
                this.canvas.addEventListener('touchstart', (e) => {  
                    if (e.touches.length === 2) {  
                        e.preventDefault();  
                        const touch1 = e.touches[0];  
                        const touch2 = e.touches[1];  
                        lastTouchDistance = Math.sqrt(  
                            Math.pow(touch2.clientX - touch1.clientX, 2) +  
                            Math.pow(touch2.clientY - touch1.clientY, 2)  
                        );  
                    }  
                });  
  
                this.canvas.addEventListener('touchmove', (e) => {  
                    if (e.touches.length === 2) {  
                        e.preventDefault();  
                        const touch1 = e.touches[0];  
                        const touch2 = e.touches[1];  
                        const currentDistance = Math.sqrt(  
                            Math.pow(touch2.clientX - touch1.clientX, 2) +  
                            Math.pow(touch2.clientY - touch1.clientY, 2)  
                        );  
                          
                        if (lastTouchDistance > 0) {  
                            const zoomFactor = currentDistance / lastTouchDistance;  
                            this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));  
                        }  
                        lastTouchDistance = currentDistance;  
                    }  
                });  
            }  
  
            resize() {  
                const rect = this.canvas.getBoundingClientRect();  
                this.width = rect.width;  
                this.height = rect.height;  
                this.canvas.width = this.width * window.devicePixelRatio;  
                this.canvas.height = this.height * window.devicePixelRatio;  
                this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);  
            }  
  
            project3D(x, y, z) {  
                // Apply rotations  
                const cosX = Math.cos(this.rotationX);  
                const sinX = Math.sin(this.rotationX);  
                const cosY = Math.cos(this.rotationY);  
                const sinY = Math.sin(this.rotationY);  
  
                // Rotate around X axis  
                const y1 = y * cosX - z * sinX;  
                const z1 = y * sinX + z * cosX;  
  
                // Rotate around Y axis  
                const x2 = x * cosY + z1 * sinY;  
                const z2 = -x * sinY + z1 * cosY;  
  
                // Perspective projection with zoom  
                const distance = 5;  
                const scale = distance / (distance + z2) * this.zoom;  
                  
                return {  
                    x: x2 * scale * 100 + this.width / 2,  
                    y: y1 * scale * 100 + this.height / 2,  
                    z: z2  
                };  
            }  
  
            render() {  
                this.ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';  
                this.ctx.fillRect(0, 0, this.width, this.height);  
  
                const pattern = this.patterns[this.params.pattern];  
                const resolution = this.params.resolution;  
                const size = 3;  
                const step = size * 2 / resolution;  
  
                // Generate vertices with W and U parameters  
                const vertices = [];  
                for (let i = 0; i <= resolution; i++) {  
                    vertices[i] = [];  
                    for (let j = 0; j <= resolution; j++) {  
                        const x = -size + i * step;  
                        const y = -size + j * step;  
                        const z = this.params.amplitude * pattern.func(  
                            x, y,   
                            this.time * this.params.speed,   
                            this.params.wParam,   
                            this.params.uParam  
                        );  
                          
                        vertices[i][j] = this.project3D(x, y, z);  
                    }  
                }  
  
                // Draw wireframe with dynamic coloring based on W and U coupling  
                const wIntensity = Math.abs(Math.sin(this.time * this.params.wParam));  
                const uIntensity = Math.abs(Math.cos(this.time * this.params.uParam));  
                  
                this.ctx.strokeStyle = `rgba(${100 + wIntensity * 155}, ${255 - uIntensity * 100}, ${218 + uIntensity * 37}, 0.6)`;  
                this.ctx.lineWidth = 0.5;  
  
                // Horizontal lines  
                for (let i = 0; i <= resolution; i += 2) {  
                    this.ctx.beginPath();  
                    for (let j = 0; j <= resolution; j++) {  
                        const vertex = vertices[i][j];  
                        if (j === 0) {  
                            this.ctx.moveTo(vertex.x, vertex.y);  
                        } else {  
                            this.ctx.lineTo(vertex.x, vertex.y);  
                        }  
                    }  
                    this.ctx.stroke();  
                }  
  
                // Vertical lines  
                for (let j = 0; j <= resolution; j += 2) {  
                    this.ctx.beginPath();  
                    for (let i = 0; i <= resolution; i++) {  
                        const vertex = vertices[i][j];  
                        if (i === 0) {  
                            this.ctx.moveTo(vertex.x, vertex.y);  
                        } else {  
                            this.ctx.lineTo(vertex.x, vertex.y);  
                        }  
                    }  
                    this.ctx.stroke();  
                }  
  
                // Draw surface with triangles (enhanced with W-U coupling effects)  
                for (let i = 0; i < resolution; i += 4) {  
                    for (let j = 0; j < resolution; j += 4) {  
                        const v1 = vertices[i][j];  
                        const v2 = vertices[i + 4] ? vertices[i + 4][j] : null;  
                        const v3 = vertices[i][j + 4] ? vertices[i][j + 4] : null;  
  
                        if (v2 && v3) {  
                            const avgZ = (v1.z + v2.z + v3.z) / 3;  
                            const baseAlpha = Math.max(0.1, Math.min(0.3, (avgZ + 2) / 4));  
                            const couplingAlpha = baseAlpha * (1 + wIntensity * uIntensity * 0.5);  
                              
                            this.ctx.fillStyle = `rgba(${100 + wIntensity * 155}, ${255 - uIntensity * 100}, ${218 + uIntensity * 37}, ${couplingAlpha})`;  
                            this.ctx.beginPath();  
                            this.ctx.moveTo(v1.x, v1.y);  
                            this.ctx.lineTo(v2.x, v2.y);  
                            this.ctx.lineTo(v3.x, v3.y);  
                            this.ctx.closePath();  
                            this.ctx.fill();  
                        }  
                    }  
                }  
            }  
  
            animate() {  
                this.time += 0.02;  
                this.render();  
                requestAnimationFrame(() => this.animate());  
            }  
  
            updatePattern(pattern) {  
                this.params.pattern = pattern;  
                this.updateInfo();  
            }  
  
            updateParams(params) {  
                Object.assign(this.params, params);  
            }  
  
            updateInfo() {  
                const pattern = this.patterns[this.params.pattern];  
                document.getElementById('pattern-name').textContent = pattern.name;  
                document.getElementById('pattern-formula').textContent = pattern.formula;  
                document.getElementById('pattern-description').textContent = pattern.description;  
            }  
        }  
  
        // Initialize application  
        let renderer;  
  
        function initializeApp() {  
            const canvas = document.getElementById('canvas');  
            const loading = document.getElementById('loading');  
              
            renderer = new Wave3DRenderer(canvas);  
            loading.style.display = 'none';  
  
            // Setup controls  
            setupControls();  
            renderer.updateInfo();  
        }  
  
        function setupControls() {  
            // Pattern buttons  
            document.querySelectorAll('.pattern-btn').forEach(btn => {  
                btn.addEventListener('click', () => {  
                    document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));  
                    btn.classList.add('active');  
                    renderer.updatePattern(btn.dataset.pattern);  
                });  
            });  
  
            // Sliders  
            const sliders = ['amplitude', 'frequency', 'speed', 'resolution', 'w-param', 'u-param'];  
            sliders.forEach(param => {  
                const slider = document.getElementById(param);  
                const valueDisplay = document.getElementById(param + '-value');  
                  
                slider.addEventListener('input', () => {  
                    const value = parseFloat(slider.value);  
                    valueDisplay.textContent = param === 'resolution' ? value.toString() : value.toFixed(1);  
                      
                    // Map slider IDs to parameter names  
                    const paramMap = {  
                        'w-param': 'wParam',  
                        'u-param': 'uParam'  
                    };  
                    const paramName = paramMap[param] || param;  
                      
                    renderer.updateParams({ [paramName]: value });  
                });  
            });  
  
            // Zoom slider  
            const zoomSlider = document.getElementById('zoom');  
            const zoomValueDisplay = document.getElementById('zoom-value');  
              
            zoomSlider.addEventListener('input', () => {  
                const value = parseFloat(zoomSlider.value);  
                zoomValueDisplay.textContent = value.toFixed(1);  
                renderer.zoom = value;  
            });  
        }  
  
        // Element SDK integration  
        async function onConfigChange(config) {  
            const titleElement = document.getElementById('main-title');  
            const descriptionElement = document.getElementById('description-text');  
              
            if (titleElement) {  
                titleElement.textContent = config.main_title || defaultConfig.main_title;  
            }  
            if (descriptionElement) {  
                descriptionElement.textContent = config.description_text || defaultConfig.description_text;  
            }  
        }  
  
        function mapToCapabilities(config) {  
            return {  
                recolorables: [],  
                borderables: [],  
                fontEditable: undefined,  
                fontSizeable: undefined  
            };  
        }  
  
        function mapToEditPanelValues(config) {  
            return new Map([  
                ["main_title", config.main_title || defaultConfig.main_title],  
                ["description_text", config.description_text || defaultConfig.description_text]  
            ]);  
        }  
  
        // Initialize when page loads  
        document.addEventListener('DOMContentLoaded', () => {  
            initializeApp();  
              
            // Initialize Element SDK  
            if (window.elementSdk) {  
                window.elementSdk.init({  
                    defaultConfig,  
                    onConfigChange,  
                    mapToCapabilities,  
                    mapToEditPanelValues  
                });  
            }  
        });  
    </script>  
 <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9955d6ce749bc7c3',t:'MTc2MTYwNjMzNS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
