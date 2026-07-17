# ![Pasted Graphic.png](Attachments/940A4ED0-FC18-468D-9C9A-F5E4149D5E37.png)  
various indeterminate forms and mathematical concepts that are often considered problematic or "undefined" in standard mathematics - hence the humorous title "The Seven Deadly Sins":  
1. **0/0** - An indeterminate form that appears in calculus when evaluating limits  
2. **∞/∞** - Another indeterminate form involving infinities  
3. **0·∞** - The indeterminate form of zero times infinity  
4. **0⁰** - Zero raised to the zero power, which is undefined/indeterminate  
5. **∞⁰** - Infinity raised to the zero power, also indeterminate  
6. **1^∞** - One raised to an infinite power, an indeterminate form  
7. **∞ - ∞** - Infinity minus infinity, which is indeterminate  
These are called "indeterminate forms" because their values cannot be determined without additional context or analysis. In calculus, when these forms appear in limits, techniques like L'Hôpital's rule are often used to evaluate them. The image playfully presents them as mathematical "sins" because they represent situations where our usual arithmetic rules break down and require special treatment.  
  
  
  
  
  
Retry  
  
PR  
What if we add square root 3 or O(n) or III/UUON  
Edit  
  
Adding those would break the mathematical theme and coherence of the "Seven Deadly Sins" concept:  
**√3** is just a well-defined irrational number (approximately 1.732). There's nothing "sinful" or problematic about it mathematically.  
**O(n)** is Big O notation from computer science describing linear time complexity. It's a perfectly valid and useful concept for analyzing algorithms.  
**III/UUON** appears to be Roman numerals over... something unclear (UUON isn't standard notation), but regardless, it wouldn't fit the pattern.  
The original seven work because they're all **indeterminate forms** - mathematical expressions that cannot be evaluated using standard arithmetic rules and require special analysis. They represent fundamental breakdowns in our usual mathematical operations.  
If you wanted to expand the list while maintaining the theme, you'd need other indeterminate forms like:  
* **0^∞** (zero to an infinite power)  
* **∞^0** (infinity to the zero power - though this overlaps with ∞⁰ shown)  
But the current seven capture the main categories of indeterminate forms that students encounter in calculus, making it a complete and elegant mathematical joke.  
  
  
Html: <!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <meta name="author" content="Phillip A. Ruiz III/UUON Foundation">  
    <meta name="description" content="Interactive Visual Engine for Mathematical Indeterminate Forms - The Seven Deadly Sins of Mathematics">  
    <meta name="keywords" content="mathematics, indeterminate forms, visual engine, interactive, UUON Foundation">  
    <meta name="creator" content="Phillip A. Ruiz III">  
    <meta name="publisher" content="UUON Foundation">  
    <meta name="version" content="1.0">  
    <meta name="creation-date" content="2025-07-25">  
    <title>The Seven Deadly Sins - Mathematical Visual Engine | UUON Foundation</title>  
      
    <!-- Canva-specific metadata -->  
    <meta property="canva:title" content="Mathematical Indeterminate Forms Visual Engine">  
    <meta property="canva:creator" content="Phillip A. Ruiz III/UUON Foundation">  
    <meta property="canva:category" content="Interactive Mathematics">  
      
    <style>  
        /* Reset and base styles for Canva compatibility */  
        * {  
            margin: 0;  
            padding: 0;  
            box-sizing: border-box;  
        }  
          
        html, body {  
            width: 100%;  
            height: 100%;  
            overflow: hidden;  
        }  
          
        body {  
            margin: 0;  
            padding: 0;  
            background: radial-gradient(circle at center, #1a1a2e, #16213e, #0f3460);  
            font-family: 'Courier New', monospace;  
            color: #fff;  
            position: relative;  
        }  
          
        /* Watermark for attribution */  
        .attribution {  
            position: absolute;  
            bottom: 10px;  
            right: 15px;  
            font-size: 10px;  
            color: rgba(255, 255, 255, 0.4);  
            z-index: 1000;  
            pointer-events: none;  
            font-family: Arial, sans-serif;  
        }  
          
        .container {  
            display: flex;  
            height: 100vh;  
            width: 100vw;  
            position: relative;  
        }  
          
        .controls {  
            width: 300px;  
            min-width: 300px;  
            background: rgba(0, 0, 0, 0.8);  
            padding: 20px;  
            backdrop-filter: blur(10px);  
            border-right: 1px solid rgba(255, 255, 255, 0.1);  
            overflow-y: auto;  
            z-index: 10;  
        }  
          
        .canvas-container {  
            flex: 1;  
            position: relative;  
            width: calc(100vw - 300px);  
            height: 100vh;  
        }  
          
        canvas {  
            display: block;  
            background: transparent;  
            position: absolute;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
        }  
          
        .control-group {  
            margin-bottom: 20px;  
            padding: 15px;  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 8px;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .control-group h3 {  
            margin: 0 0 10px 0;  
            color: #ffd700;  
            font-size: 14px;  
            text-transform: uppercase;  
            letter-spacing: 1px;  
        }  
          
        input[type="range"] {  
            width: 100%;  
            margin: 5px 0;  
            background: transparent;  
            height: 20px;  
            -webkit-appearance: none;  
            appearance: none;  
        }  
          
        input[type="range"]::-webkit-slider-track {  
            background: rgba(255, 255, 255, 0.2);  
            height: 4px;  
            border-radius: 2px;  
        }  
          
        input[type="range"]::-webkit-slider-thumb {  
            background: #ffd700;  
            height: 16px;  
            width: 16px;  
            border-radius: 50%;  
            cursor: pointer;  
            -webkit-appearance: none;  
            appearance: none;  
            border: none;  
        }  
          
        input[type="range"]::-moz-range-track {  
            background: rgba(255, 255, 255, 0.2);  
            height: 4px;  
            border-radius: 2px;  
            border: none;  
        }  
          
        input[type="range"]::-moz-range-thumb {  
            background: #ffd700;  
            height: 16px;  
            width: 16px;  
            border-radius: 50%;  
            cursor: pointer;  
            border: none;  
        }  
          
        select {  
            width: 100%;  
            padding: 8px;  
            background: rgba(255, 255, 255, 0.1);  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            color: white;  
            border-radius: 4px;  
            font-family: 'Courier New', monospace;  
        }  
          
        select option {  
            background: #1a1a2e;  
            color: white;  
        }  
          
        label {  
            display: block;  
            margin: 5px 0;  
            font-size: 12px;  
            color: #ccc;  
        }  
          
        .value-display {  
            color: #ffd700;  
            font-weight: bold;  
        }  
          
        .info-panel {  
            position: absolute;  
            top: 20px;  
            right: 20px;  
            background: rgba(0, 0, 0, 0.8);  
            padding: 15px;  
            border-radius: 8px;  
            backdrop-filter: blur(10px);  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            max-width: 300px;  
            z-index: 5;  
        }  
          
        .sin-formula {  
            font-family: 'Times New Roman', serif;  
            font-size: 18px;  
            color: #ffd700;  
            text-align: center;  
            margin: 10px 0;  
            font-weight: bold;  
        }  
          
        .title-header {  
            text-align: center;  
            margin-bottom: 20px;  
            padding-bottom: 15px;  
            border-bottom: 1px solid rgba(255, 215, 0, 0.3);  
        }  
          
        .title-header h2 {  
            color: #ffd700;  
            margin: 0;  
            font-size: 16px;  
            text-transform: uppercase;  
            letter-spacing: 2px;  
        }  
          
        .title-header .subtitle {  
            color: rgba(255, 255, 255, 0.6);  
            font-size: 10px;  
            margin-top: 5px;  
        }  
          
        /* Canva-specific adjustments */  
        @media (max-width: 1024px) {  
            .controls {  
                width: 250px;  
                min-width: 250px;  
            }  
              
            .canvas-container {  
                width: calc(100vw - 250px);  
            }  
        }  
          
        @media (max-width: 768px) {  
            .controls {  
                width: 200px;  
                min-width: 200px;  
                padding: 15px;  
            }  
              
            .canvas-container {  
                width: calc(100vw - 200px);  
            }  
              
            .control-group {  
                padding: 10px;  
                margin-bottom: 15px;  
            }  
        }  
    </style>  
</head>  
<body>  
    <!-- Attribution watermark -->  
    <div class="attribution">© Phillip A. Ruiz III / UUON Foundation</div>  
      
    <div class="container">  
        <div class="controls">  
            <div class="title-header">  
                <h2>The Seven Deadly Sins</h2>  
                <div class="subtitle">Mathematical Indeterminate Forms</div>  
                <div class="subtitle">UUON Foundation</div>  
            </div>  
              
            <div class="control-group">  
                <h3>Active Sin</h3>  
                <select id="sinType">  
                    <option value="0/0">0/0 - Zero Division</option>  
                    <option value="∞/∞">∞/∞ - Infinite Division</option>  
                    <option value="0·∞">0·∞ - Zero Times Infinity</option>  
                    <option value="0^0">0^0 - Zero Power</option>  
                    <option value="∞^0">∞^0 - Infinite Power</option>  
                    <option value="1^∞">1^∞ - Unity Infinite</option>  
                    <option value="∞-∞">∞-∞ - Infinite Difference</option>  
                </select>  
            </div>  
              
            <div class="control-group">  
                <h3>Transform Parameters</h3>  
                <label>Approach Rate: <span class="value-display" id="approachValue">0.01</span></label>  
                <input type="range" id="approachRate" min="0.001" max="0.1" step="0.001" value="0.01">  
                  
                <label>Oscillation: <span class="value-display" id="oscillationValue">1.0</span></label>  
                <input type="range" id="oscillation" min="0" max="5" step="0.1" value="1.0">  
                  
                <label>Complexity: <span class="value-display" id="complexityValue">1</span></label>  
                <input type="range" id="complexity" min="1" max="10" step="1" value="1">  
            </div>  
              
            <div class="control-group">  
                <h3>Visual Parameters</h3>  
                <label>Particle Count: <span class="value-display" id="particleCountValue">200</span></label>  
                <input type="range" id="particleCount" min="50" max="1000" step="50" value="200">  
                  
                <label>Field Strength: <span class="value-display" id="fieldStrengthValue">2.0</span></label>  
                <input type="range" id="fieldStrength" min="0.1" max="10" step="0.1" value="2.0">  
                  
                <label>Time Scale: <span class="value-display" id="timeScaleValue">1.0</span></label>  
                <input type="range" id="timeScale" min="0.1" max="5" step="0.1" value="1.0">  
            </div>  
              
            <div class="control-group">  
                <h3>Rendering Mode</h3>  
                <select id="renderMode">  
                    <option value="particles">Particle Field</option>  
                    <option value="waves">Wave Function</option>  
                    <option value="fractal">Fractal Emergence</option>  
                    <option value="topology">Topological Mapping</option>  
                </select>  
            </div>  
        </div>  
          
        <div class="canvas-container">  
            <canvas id="visualCanvas"></canvas>  
            <div class="info-panel">  
                <div class="sin-formula" id="currentFormula">0/0</div>  
                <div id="mathInfo">  
                    <strong>Current State:</strong><br>  
                    Approaching indeterminate form<br>  
                    <strong>Behavior:</strong> <span id="behaviorText">Oscillating convergence</span><br>  
                    <strong>Complexity:</strong> <span id="complexityText">O(n)</span><br>  
                    <small style="color: rgba(255,255,255,0.5); margin-top: 10px; display: block;">  
                        Interactive Mathematical Visualization<br>  
                        Phillip A. Ruiz III / UUON Foundation  
                    </small>  
                </div>  
            </div>  
        </div>  
    </div>  
  
    <script>  
        // Mathematical Indeterminate Forms Visual Engine  
        // Created by Phillip A. Ruiz III for UUON Foundation  
        // Interactive visualization of the Seven Deadly Sins of mathematics  
          
        class IndeterminateVisualEngine {  
            constructor() {  
                this.canvas = document.getElementById('visualCanvas');  
                this.ctx = this.canvas.getContext('2d');  
                this.time = 0;  
                this.particles = [];  
                  
                // Core parameters for mathematical transformations  
                this.params = {  
                    sinType: '0/0',  
                    approachRate: 0.01,  
                    oscillation: 1.0,  
                    complexity: 1,  
                    particleCount: 200,  
                    fieldStrength: 2.0,  
                    timeScale: 1.0,  
                    renderMode: 'particles'  
                };  
                  
                this.initialize();  
            }  
              
            initialize() {  
                this.setupCanvas();  
                this.initializeParticles();  
                this.setupControls();  
                this.animate();  
                  
                // Add metadata logging for Canva  
                console.log('Mathematical Visual Engine initialized');  
                console.log('Creator: Phillip A. Ruiz III / UUON Foundation');  
                console.log('Version: 1.0 - Canva Compatible');  
            }  
              
            setupCanvas() {  
                const resizeCanvas = () => {  
                    const container = this.canvas.parentElement;  
                    const rect = container.getBoundingClientRect();  
                      
                    // Set actual canvas dimensions  
                    this.canvas.width = rect.width;  
                    this.canvas.height = rect.height;  
                      
                    // Ensure pixel-perfect rendering  
                    this.canvas.style.width = rect.width + 'px';  
                    this.canvas.style.height = rect.height + 'px';  
                      
                    // Handle high DPI displays  
                    const dpr = window.devicePixelRatio || 1;  
                    this.canvas.width = rect.width * dpr;  
                    this.canvas.height = rect.height * dpr;  
                    this.ctx.scale(dpr, dpr);  
                    this.canvas.style.width = rect.width + 'px';  
                    this.canvas.style.height = rect.height + 'px';  
                };  
                  
                resizeCanvas();  
                window.addEventListener('resize', resizeCanvas);  
                  
                // Additional canvas setup for Canva compatibility  
                this.ctx.imageSmoothingEnabled = true;  
                this.ctx.imageSmoothingQuality = 'high';  
            }  
              
            initializeParticles() {  
                this.particles = [];  
                const canvasRect = this.canvas.getBoundingClientRect();  
                  
                for (let i = 0; i < this.params.particleCount; i++) {  
                    this.particles.push({  
                        x: Math.random() * canvasRect.width,  
                        y: Math.random() * canvasRect.height,  
                        vx: (Math.random() - 0.5) * 2,  
                        vy: (Math.random() - 0.5) * 2,  
                        phase: Math.random() * Math.PI * 2,  
                        amplitude: Math.random() * 50 + 10,  
                        hue: Math.random() * 60 + 30 // Gold to orange range  
                    });  
                }  
            }  
              
            setupControls() {  
                const controls = {  
                    sinType: document.getElementById('sinType'),  
                    approachRate: document.getElementById('approachRate'),  
                    oscillation: document.getElementById('oscillation'),  
                    complexity: document.getElementById('complexity'),  
                    particleCount: document.getElementById('particleCount'),  
                    fieldStrength: document.getElementById('fieldStrength'),  
                    timeScale: document.getElementById('timeScale'),  
                    renderMode: document.getElementById('renderMode')  
                };  
                  
                const valueDisplays = {  
                    approachValue: document.getElementById('approachValue'),  
                    oscillationValue: document.getElementById('oscillationValue'),  
                    complexityValue: document.getElementById('complexityValue'),  
                    particleCountValue: document.getElementById('particleCountValue'),  
                    fieldStrengthValue: document.getElementById('fieldStrengthValue'),  
                    timeScaleValue: document.getElementById('timeScaleValue')  
                };  
                  
                Object.keys(controls).forEach(key => {  
                    controls[key].addEventListener('input', (e) => {  
                        this.params[key] = key === 'sinType' || key === 'renderMode' ?   
                            e.target.value : parseFloat(e.target.value);  
                          
                        if (key === 'particleCount') {  
                            this.initializeParticles();  
                        }  
                          
                        // Update value displays  
                        const displayKey = key + 'Value';  
                        if (valueDisplays[displayKey]) {  
                            valueDisplays[displayKey].textContent = e.target.value;  
                        }  
                          
                        this.updateInfo();  
                    });  
                });  
                  
                this.updateInfo();  
            }  
              
            updateInfo() {  
                document.getElementById('currentFormula').textContent = this.params.sinType;  
                  
                const behaviors = {  
                    '0/0': 'L\'Hôpital convergence',  
                    '∞/∞': 'Asymptotic analysis',  
                    '0·∞': 'Product indeterminacy',  
                    '0^0': 'Exponential singularity',  
                    '∞^0': 'Power law breakdown',  
                    '1^∞': 'Unity transcendence',  
                    '∞-∞': 'Infinite cancellation'  
                };  
                  
                document.getElementById('behaviorText').textContent = behaviors[this.params.sinType];  
                document.getElementById('complexityText').textContent = `O(n^${this.params.complexity})`;  
            }  
              
            calculateField(x, y, t) {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                const centerX = canvasRect.width / 2;  
                const centerY = canvasRect.height / 2;  
                const dx = x - centerX;  
                const dy = y - centerY;  
                const distance = Math.sqrt(dx * dx + dy * dy);  
                const angle = Math.atan2(dy, dx);  
                  
                let fieldX = 0, fieldY = 0;  
                  
                // Mathematical field calculations based on indeterminate form  
                switch (this.params.sinType) {  
                    case '0/0':  
                        const approach = Math.sin(distance * 0.01 + t) * this.params.approachRate;  
                        fieldX = Math.cos(angle) * approach / (distance + 1);  
                        fieldY = Math.sin(angle) * approach / (distance + 1);  
                        break;  
                          
                    case '∞/∞':  
                        fieldX = Math.sin(x * 0.005 + t) * this.params.fieldStrength;  
                        fieldY = Math.cos(y * 0.005 + t) * this.params.fieldStrength;  
                        break;  
                          
                    case '0·∞':  
                        const magnitude = Math.sin(t * 0.5) * distance * 0.001;  
                        fieldX = Math.cos(angle + t) * magnitude;  
                        fieldY = Math.sin(angle + t) * magnitude;  
                        break;  
                          
                    case '0^0':  
                        const spiral = Math.log(distance + 1) * 0.1;  
                        fieldX = Math.cos(angle + spiral + t) * this.params.fieldStrength;  
                        fieldY = Math.sin(angle + spiral + t) * this.params.fieldStrength;  
                        break;  
                          
                    case '∞^0':  
                        const wave = Math.sin(distance * 0.02 - t * 2) * this.params.fieldStrength;  
                        fieldX = (dx / distance) * wave;  
                        fieldY = (dy / distance) * wave;  
                        break;  
                          
                    case '1^∞':  
                        const convergence = Math.exp(-distance * 0.001);  
                        fieldX = Math.cos(angle * this.params.complexity + t) * convergence * this.params.fieldStrength;  
                        fieldY = Math.sin(angle * this.params.complexity + t) * convergence * this.params.fieldStrength;  
                        break;  
                          
                    case '∞-∞':  
                        fieldX = (Math.sin(x * 0.01 + t) - Math.cos(y * 0.01 + t)) * this.params.fieldStrength;  
                        fieldY = (Math.cos(x * 0.01 + t) - Math.sin(y * 0.01 + t)) * this.params.fieldStrength;  
                        break;  
                }  
                  
                // Apply oscillation modulation  
                fieldX *= (1 + Math.sin(t * this.params.oscillation) * 0.5);  
                fieldY *= (1 + Math.cos(t * this.params.oscillation) * 0.5);  
                  
                return { x: fieldX, y: fieldY };  
            }  
              
            updateParticles() {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                  
                this.particles.forEach(particle => {  
                    const field = this.calculateField(particle.x, particle.y, this.time);  
                      
                    particle.vx += field.x * 0.1;  
                    particle.vy += field.y * 0.1;  
                      
                    // Apply damping for stability  
                    particle.vx *= 0.95;  
                    particle.vy *= 0.95;  
                      
                    particle.x += particle.vx;  
                    particle.y += particle.vy;  
                      
                    // Boundary wrapping  
                    if (particle.x < 0) particle.x = canvasRect.width;  
                    if (particle.x > canvasRect.width) particle.x = 0;  
                    if (particle.y < 0) particle.y = canvasRect.height;  
                    if (particle.y > canvasRect.height) particle.y = 0;  
                      
                    particle.phase += 0.02;  
                });  
            }  
              
            render() {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                  
                // Clear with fade effect  
                this.ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';  
                this.ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);  
                  
                // Render based on selected mode  
                switch (this.params.renderMode) {  
                    case 'particles':  
                        this.renderParticles();  
                        break;  
                    case 'waves':  
                        this.renderWaves();  
                        break;  
                    case 'fractal':  
                        this.renderFractal();  
                        break;  
                    case 'topology':  
                        this.renderTopology();  
                        break;  
                }  
            }  
              
            renderParticles() {  
                this.particles.forEach(particle => {  
                    const intensity = Math.sin(particle.phase) * 0.5 + 0.5;  
                    const hue = particle.hue + Math.sin(this.time * 0.1) * 30;  
                      
                    this.ctx.fillStyle = `hsla(${hue}, 80%, ${50 + intensity * 30}%, ${intensity * 0.8})`;  
                    this.ctx.beginPath();  
                    this.ctx.arc(particle.x, particle.y, 2 + intensity * 3, 0, Math.PI * 2);  
                    this.ctx.fill();  
                      
                    // Trailing effect  
                    this.ctx.strokeStyle = `hsla(${hue}, 60%, 40%, ${intensity * 0.3})`;  
                    this.ctx.lineWidth = 1;  
                    this.ctx.beginPath();  
                    this.ctx.moveTo(particle.x, particle.y);  
                    this.ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);  
                    this.ctx.stroke();  
                });  
            }  
              
            renderWaves() {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                  
                for (let x = 0; x < canvasRect.width; x += 8) {  
                    for (let y = 0; y < canvasRect.height; y += 8) {  
                        const field = this.calculateField(x, y, this.time);  
                        const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);  
                        const intensity = Math.min(1, magnitude * 0.5);  
                          
                        if (intensity > 0.1) {  
                            this.ctx.fillStyle = `hsla(45, 80%, 60%, ${intensity * 0.6})`;  
                            this.ctx.fillRect(x, y, 4, 4);  
                        }  
                    }  
                }  
            }  
              
            renderFractal() {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';  
                this.ctx.lineWidth = 1;  
                  
                const steps = 100;  
                for (let i = 0; i < steps; i++) {  
                    const t = i / steps;  
                    const x = canvasRect.width * 0.5 + Math.cos(t * Math.PI * 2 * this.params.complexity + this.time) * 100;  
                    const y = canvasRect.height * 0.5 + Math.sin(t * Math.PI * 2 * this.params.complexity + this.time) * 100;  
                      
                    const field = this.calculateField(x, y, this.time);  
                    const nextX = x + field.x * 10;  
                    const nextY = y + field.y * 10;  
                      
                    this.ctx.beginPath();  
                    this.ctx.moveTo(x, y);  
                    this.ctx.lineTo(nextX, nextY);  
                    this.ctx.stroke();  
                }  
            }  
              
            renderTopology() {  
                const canvasRect = this.canvas.getBoundingClientRect();  
                const gridSize = 20;  
                this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';  
                this.ctx.lineWidth = 1;  
                  
                for (let x = 0; x < canvasRect.width; x += gridSize) {  
                    for (let y = 0; y < canvasRect.height; y += gridSize) {  
                        const field = this.calculateField(x, y, this.time);  
                          
                        this.ctx.beginPath();  
                        this.ctx.moveTo(x, y);  
                        this.ctx.lineTo(x + field.x * 5, y + field.y * 5);  
                        this.ctx.stroke();  
                    }  
                }  
            }  
              
            animate() {  
                this.time += 0.016 * this.params.timeScale;  
                this.updateParticles();  
                this.render();  
                requestAnimationFrame(() => this.animate());  
            }  
        }  
          
        // Initialize when DOM is loaded - Canva compatible  
        if (document.readyState === 'loading') {  
            document.addEventListener('DOMContentLoaded', () => {  
                new IndeterminateVisualEngine();  
            });  
        } else {  
            new IndeterminateVisualEngine();  
        }  
          
        // Canva metadata for proper attribution  
        window.CanvaMetadata = {  
            title: "Mathematical Indeterminate Forms Visual Engine",  
            creator: "Phillip A. Ruiz III",  
            organization: "UUON Foundation",  
            version: "1.0",  
            type: "Interactive Mathematics Visualization",  
            created: "2025-07-25"  
        };  
    </script>  
</body>  
</html>  
