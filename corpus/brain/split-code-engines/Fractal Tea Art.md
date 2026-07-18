# Fractal Tea Art   
![Image](Attachments/6CA09879-E949-4F27-91CC-84383248D320.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Phi Convergence Visualizer</title>  
    <style>  
        body {   
            margin: 0;   
            padding: 0;   
            background: #000000;   
            font-family: 'Courier New', monospace;   
            overflow: hidden;   
            color: #00ffff;  
        }  
        #canvas {   
            display: block;   
            background: #000000;   
        }  
        .controls {   
            position: absolute;   
            background: rgba(0,10,20,0.7);   
            padding: 10px;   
            border-radius: 8px;   
            color: #00ffff;   
            font-size: 11px;   
            border: 1px solid #00ffff;   
            box-shadow: 0 0 10px rgba(0,255,255,0.2);  
            backdrop-filter: blur(3px);  
            transition: all 0.3s ease;  
            max-height: 90vh;  
            overflow-y: auto;  
            scrollbar-width: thin;  
            scrollbar-color: #00ffff #001122;  
        }  
        .controls::-webkit-scrollbar {  
            width: 5px;  
        }  
        .controls::-webkit-scrollbar-track {  
            background: #001122;  
        }  
        .controls::-webkit-scrollbar-thumb {  
            background-color: #00ffff;  
            border-radius: 5px;  
        }  
        .top-left { top: 10px; left: 10px; max-width: 200px; }  
        .top-right { top: 10px; right: 10px; max-width: 200px; }  
        input, select {   
            background: #001122;   
            color: #00ffff;   
            border: 1px solid #00ffff;   
            padding: 4px;   
            margin: 2px 0;   
            border-radius: 3px;  
            width: 100%;  
            font-size: 10px;  
        }  
        input[type="color"] {  
            height: 20px;  
            width: 40px;  
            padding: 0;  
            border: 1px solid #00ffff;  
        }  
        button {   
            background: #003366;   
            color: #00ffff;   
            border: 1px solid #00ffff;   
            padding: 4px 8px;   
            margin: 3px 2px;   
            cursor: pointer;   
            border-radius: 3px;  
            transition: all 0.2s ease;  
            font-size: 10px;  
        }  
        button:hover {   
            background: #00ffff;   
            color: #000;   
        }  
        label {   
            display: block;   
            margin: 6px 0 2px;   
            font-size: 10px;  
            text-transform: uppercase;  
            letter-spacing: 1px;  
        }  
        .color-inputs {  
            display: flex;  
            gap: 5px;  
        }  
        .section-title {  
            font-size: 11px;  
            font-weight: bold;  
            margin-top: 10px;  
            margin-bottom: 5px;  
            text-align: center;  
            border-bottom: 1px solid #00ffff;  
            padding-bottom: 3px;  
            color: #00ffaa;  
        }  
        .tab-container {  
            display: flex;  
            margin-bottom: 8px;  
        }  
        .tab {  
            flex: 1;  
            text-align: center;  
            padding: 4px;  
            background: #001122;  
            border: 1px solid #00ffff;  
            cursor: pointer;  
            font-size: 9px;  
            text-transform: uppercase;  
        }  
        .tab.active {  
            background: #00ffff;  
            color: #001122;  
        }  
        .tab-content {  
            display: none;  
        }  
        .tab-content.active {  
            display: block;  
        }  
        .checkbox-container {  
            display: flex;  
            align-items: center;  
            margin: 4px 0;  
        }  
        .checkbox-container input {  
            width: auto;  
            margin-right: 6px;  
        }  
        .checkbox-container label {  
            margin: 0;  
            text-transform: none;  
            font-size: 10px;  
        }  
        .preset-buttons {  
            display: flex;  
            flex-wrap: wrap;  
            gap: 4px;  
            margin-top: 4px;  
        }  
        .preset-button {  
            flex: 1;  
            min-width: 45%;  
            padding: 3px;  
            font-size: 9px;  
        }  
        .formula {  
            font-family: 'Courier New', monospace;  
            font-size: 9px;  
            background: rgba(0,0,0,0.3);  
            padding: 3px;  
            border-radius: 3px;  
            margin: 3px 0;  
            text-align: center;  
        }  
    </style>  
</head>  
<body>  
    <canvas id="canvas"></canvas>  
      
    <div class="controls top-left">  
        <div class="tab-container">  
            <div class="tab active" data-tab="patterns">Patterns</div>  
            <div class="tab" data-tab="fractal">Fractal</div>  
        </div>  
          
        <div class="tab-content active" id="patterns-tab">  
            <div class="section-title">Pattern Controls</div>  
            <label>Visualization</label>  
            <select id="pattern">  
                <option value="ripples">Phi Ripples</option>  
                <option value="spiral">Phi Spiral</option>  
                <option value="cosmic">Cosmic Web</option>  
                <option value="wave">Wave Interference</option>  
                <option value="vortex">Phi Vortex</option>  
                <option value="fractal">Fractal Tree</option>  
                <option value="cosine">Cosine Field</option>  
            </select>  
              
            <label>Speed</label>  
            <input type="range" id="speed" min="0.1" max="5" value="1" step="0.1">  
              
            <label>Depth</label>  
            <input type="range" id="depth" min="1" max="20" value="5" step="1">  
              
            <label>Density</label>  
            <input type="range" id="density" min="10" max="300" value="100" step="10">  
              
            <div class="checkbox-container">  
                <input type="checkbox" id="autoRotate" checked>  
                <label for="autoRotate">Auto-Rotate</label>  
            </div>  
              
            <div class="checkbox-container">  
                <input type="checkbox" id="showReflections" checked>  
                <label for="showReflections">Show Reflections</label>  
            </div>  
              
            <div class="preset-buttons">  
                <button class="preset-button" data-preset="cosmic">Cosmic</button>  
                <button class="preset-button" data-preset="vortex">Vortex</button>  
                <button class="preset-button" data-preset="fractal">Fractal</button>  
                <button class="preset-button" data-preset="wave">Wave</button>  
            </div>  
        </div>  
          
        <div class="tab-content" id="fractal-tab">  
            <div class="section-title">Fractal Controls</div>  
            <label>Fractal Type</label>  
            <select id="fractalType">  
                <option value="tree">Phi Tree</option>  
                <option value="pythagoras">Pythagoras Tree</option>  
                <option value="fern">Barnsley Fern</option>  
                <option value="spiral">Golden Spiral</option>  
            </select>  
              
            <label>Iterations</label>  
            <input type="range" id="iterations" min="1" max="12" value="8" step="1">  
              
            <label>Branch Angle</label>  
            <input type="range" id="branchAngle" min="0" max="90" value="45" step="1">  
              
            <label>Length Ratio</label>  
            <input type="range" id="lengthRatio" min="0.1" max="0.9" value="0.618" step="0.01">  
              
            <div class="checkbox-container">  
                <input type="checkbox" id="animateFractal" checked>  
                <label for="animateFractal">Animate Fractal</label>  
            </div>  
              
            <div class="formula">  
                φ = (1 + √5) / 2 ≈ 1.618033988749895  
            </div>  
        </div>  
    </div>  
      
    <div class="controls top-right">  
        <div class="tab-container">  
            <div class="tab active" data-tab="math">Math</div>  
            <div class="tab" data-tab="perception">3D</div>  
        </div>  
          
        <div class="tab-content active" id="math-tab">  
            <div class="section-title">Mathematical Controls</div>  
            <label>Phi Mode</label>  
            <select id="phiMode">  
                <option value="basic">Basic φ</option>  
                <option value="fibonacci">Fibonacci</option>  
                <option value="conjugate">Conjugate</option>  
                <option value="nested">Nested</option>  
                <option value="continued">Continued Fraction</option>  
            </select>  
              
            <label>Wave Function</label>  
            <select id="waveFunction">  
                <option value="sine">Sine</option>  
                <option value="cosine">Cosine</option>  
                <option value="tangent">Tangent</option>  
                <option value="combined">Combined</option>  
            </select>  
              
            <label>Frequency</label>  
            <input type="range" id="frequency" min="0.1" max="5" value="1" step="0.1">  
              
            <label>Amplitude</label>  
            <input type="range" id="amplitude" min="10" max="200" value="80" step="1">  
              
            <label>Colors</label>  
            <div class="color-inputs">  
                <input type="color" id="color1" value="#00ffff">  
                <input type="color" id="color2" value="#ff00ff">  
                <input type="color" id="color3" value="#00ff00">  
            </div>  
              
            <div class="checkbox-container">  
                <input type="checkbox" id="showTrails" checked>  
                <label for="showTrails">Show Trails</label>  
            </div>  
              
            <div class="checkbox-container">  
                <input type="checkbox" id="showConnections" checked>  
                <label for="showConnections">Show Connections</label>  
            </div>  
        </div>  
          
        <div class="tab-content" id="perception-tab">  
            <div class="section-title">3D Perception Controls</div>  
            <label>Perspective</label>  
            <select id="perspective">  
                <option value="2d">2D</option>  
                <option value="3d">Pseudo 3D</option>  
                <option value="4d">4D Projection</option>  
            </select>  
              
            <label>Camera Distance</label>  
            <input type="range" id="cameraDistance" min="100" max="1000" value="500" step="10">  
              
            <label>Rotation X</label>  
            <input type="range" id="rotationX" min="0" max="360" value="0" step="1">  
              
            <label>Rotation Y</label>  
            <input type="range" id="rotationY" min="0" max="360" value="0" step="1">  
              
            <label>Rotation Z</label>  
            <input type="range" id="rotationZ" min="0" max="360" value="0" step="1">  
              
            <label>Parallax Shift</label>  
            <input type="range" id="parallaxShift" min="0" max="100" value="20" step="1">  
              
            <label>Line Width</label>  
            <input type="range" id="lineWidth" min="0.1" max="3" value="0.5" step="0.1">  
              
            <label>Glow Intensity</label>  
            <input type="range" id="glowIntensity" min="0" max="5" value="0" step="0.1">  
        </div>  
    </div>  
  
    <script>  
        const canvas = document.getElementById('canvas');  
        const ctx = canvas.getContext('2d');  
        const PHI = (1 + Math.sqrt(5)) / 2;  
          
        // State variables  
        let time = 0;  
        let paused = false;  
        let particles = [];  
        let convergenceValue = 0;  
        let iterationCount = 0;  
        let currentRatio = 0;  
        let errorRate = 0;  
        let lastFrameTime = 0;  
        let fps = 60;  
        let frameCount = 0;  
        let lastFpsUpdate = 0;  
        let cameraRotation = { x: 0, y: 0, z: 0 };  
        let fractalTree = [];  
        let fernPoints = [];  
        let fernGrowth = 0;  
          
        // Tab system  
        document.querySelectorAll('.tab').forEach(tab => {  
            tab.addEventListener('click', () => {  
                const tabName = tab.getAttribute('data-tab');  
                const tabContainer = tab.parentElement;  
                  
                // Set active tab  
                tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));  
                tab.classList.add('active');  
                  
                // Show active content  
                const tabContentId = tabName + '-tab';  
                const parentControls = tabContainer.parentElement;  
                parentControls.querySelectorAll('.tab-content').forEach(content => {  
                    content.classList.remove('active');  
                });  
                parentControls.querySelector('#' + tabContentId).classList.add('active');  
            });  
        });  
          
        // UI elements  
        const patternSelect = document.getElementById('pattern');  
        const phiModeSelect = document.getElementById('phiMode');  
        const perspectiveSelect = document.getElementById('perspective');  
        const waveFunctionSelect = document.getElementById('waveFunction');  
        const fractalTypeSelect = document.getElementById('fractalType');  
        const speedInput = document.getElementById('speed');  
        const depthInput = document.getElementById('depth');  
        const densityInput = document.getElementById('density');  
        const frequencyInput = document.getElementById('frequency');  
        const amplitudeInput = document.getElementById('amplitude');  
        const iterationsInput = document.getElementById('iterations');  
        const branchAngleInput = document.getElementById('branchAngle');  
        const lengthRatioInput = document.getElementById('lengthRatio');  
        const cameraDistanceInput = document.getElementById('cameraDistance');  
        const rotationXInput = document.getElementById('rotationX');  
        const rotationYInput = document.getElementById('rotationY');  
        const rotationZInput = document.getElementById('rotationZ');  
        const parallaxShiftInput = document.getElementById('parallaxShift');  
        const glowIntensityInput = document.getElementById('glowIntensity');  
        const lineWidthInput = document.getElementById('lineWidth');  
        const color1Input = document.getElementById('color1');  
        const color2Input = document.getElementById('color2');  
        const color3Input = document.getElementById('color3');  
        const autoRotateCheckbox = document.getElementById('autoRotate');  
        const animateFractalCheckbox = document.getElementById('animateFractal');  
        const showTrailsCheckbox = document.getElementById('showTrails');  
        const showConnectionsCheckbox = document.getElementById('showConnections');  
        const showReflectionsCheckbox = document.getElementById('showReflections');  
          
        // Initialize  
        function init() {  
            resize();  
            createParticles();  
            window.addEventListener('resize', resize);  
              
            // Add event listeners for preset buttons  
            document.querySelectorAll('.preset-button').forEach(button => {  
                button.addEventListener('click', () => {  
                    applyPreset(button.getAttribute('data-preset'));  
                });  
            });  
              
            // Add event listeners for all controls  
            patternSelect.addEventListener('change', handlePatternChange);  
            phiModeSelect.addEventListener('change', updatePhiMode);  
            perspectiveSelect.addEventListener('change', createParticles);  
            waveFunctionSelect.addEventListener('change', () => {});  
            fractalTypeSelect.addEventListener('change', handleFractalTypeChange);  
            speedInput.addEventListener('input', () => {});  
            depthInput.addEventListener('input', createParticles);  
            densityInput.addEventListener('input', createParticles);  
            frequencyInput.addEventListener('input', () => {});  
            amplitudeInput.addEventListener('input', () => {});  
            iterationsInput.addEventListener('input', generateFractalTree);  
            branchAngleInput.addEventListener('input', generateFractalTree);  
            lengthRatioInput.addEventListener('input', generateFractalTree);  
            cameraDistanceInput.addEventListener('input', () => {});  
            rotationXInput.addEventListener('input', updateRotation);  
            rotationYInput.addEventListener('input', updateRotation);  
            rotationZInput.addEventListener('input', updateRotation);  
              
            // Generate initial fractal tree  
            generateFractalTree();  
              
            // Start animation  
            animate();  
        }  
          
        function resize() {  
            canvas.width = window.innerWidth;  
            canvas.height = window.innerHeight;  
        }  
          
        function getPhiValue(mode, n) {  
            switch(mode) {  
                case 'basic': return PHI;  
                case 'fibonacci': return n > 1 ? fibonacci(n+1) / fibonacci(n) : PHI;  
                case 'conjugate': return 1 / (PHI - 1);  
                case 'nested': return 1 + 1/(1 + 1/(1 + 1/(1 + n/10)));  
                case 'continued': {  
                    let result = 1;  
                    for (let i = 0; i < n % 10 + 1; i++) {  
                        result = 1 + 1/result;  
                    }  
                    return result;  
                }  
                default: return PHI;  
            }  
        }  
          
        function fibonacci(n) {  
            if (n <= 1) return n;  
            let a = 0, b = 1;  
            for (let i = 2; i <= n; i++) {  
                [a, b] = [b, a + b];  
            }  
            return b;  
        }  
          
        function handlePatternChange() {  
            const pattern = patternSelect.value;  
            if (pattern === 'fractal') {  
                document.querySelector('.tab[data-tab="fractal"]').click();  
                generateFractalTree();  
            } else {  
                createParticles();  
            }  
        }  
          
        function handleFractalTypeChange() {  
            const fractalType = fractalTypeSelect.value;  
            if (fractalType === 'fern') {  
                // Reset fern growth for animation  
                fernGrowth = 0;  
                generateFernPoints();  
            }  
            generateFractalTree();  
        }  
          
        function createParticles() {  
            const density = parseInt(densityInput.value);  
            const depth = parseInt(depthInput.value);  
            const pattern = patternSelect.value;  
              
            particles = [];  
              
            for (let i = 0; i < density; i++) {  
                const particle = {  
                    x: Math.random() * canvas.width,  
                    y: Math.random() * canvas.height,  
                    z: Math.random() * depth * 10,  
                    size: Math.random() * 3 + 0.5, // Smaller particles for sharper look  
                    speed: Math.random() * 2 + 0.5,  
                    angle: Math.random() * Math.PI * 2,  
                    phiOffset: i * (PHI - 1),  
                    opacity: Math.random() * 0.8 + 0.2,  
                    trail: [],  
                    maxTrail: Math.floor(Math.random() * 10) + 5  
                };  
                  
                if (pattern === 'spiral') {  
                    const angle = i * PHI * Math.PI * 2;  
                    const radius = Math.sqrt(i) * 10;  
                    particle.x = canvas.width / 2 + Math.cos(angle) * radius;  
                    particle.y = canvas.height / 2 + Math.sin(angle) * radius;  
                } else if (pattern === 'vortex') {  
                    const angle = i * 0.1;  
                    const radius = i * 0.5;  
                    particle.x = canvas.width / 2 + Math.cos(angle) * radius;  
                    particle.y = canvas.height / 2 + Math.sin(angle) * radius;  
                }  
                  
                particles.push(particle);  
            }  
        }  
          
        function generateFernPoints() {  
            fernPoints = [];  
            const iterations = 5000; // Generate a pool of points  
              
            let x = 0, y = 0;  
            for (let i = 0; i < iterations; i++) {  
                const r = Math.random();  
                let nextX, nextY;  
                  
                if (r < 0.01) {  
                    // Stem  
                    nextX = 0;  
                    nextY = 0.16 * y;  
                } else if (r < 0.86) {  
                    // Successively smaller leaflets  
                    nextX = 0.85 * x + 0.04 * y;  
                    nextY = -0.04 * x + 0.85 * y + 1.6;  
                } else if (r < 0.93) {  
                    // Largest left leaflet  
                    nextX = 0.2 * x - 0.26 * y;  
                    nextY = 0.23 * x + 0.22 * y + 1.6;  
                } else {  
                    // Largest right leaflet  
                    nextX = -0.15 * x + 0.28 * y;  
                    nextY = 0.26 * x + 0.24 * y + 0.44;  
                }  
                  
                x = nextX;  
                y = nextY;  
                  
                // Scale and position the fern  
                const scale = 50;  
                const displayX = canvas.width / 2 + x * scale;  
                const displayY = canvas.height - 100 - y * scale;  
                  
                // Store points with their y-position for growth animation  
                fernPoints.push({  
                    x: displayX,  
                    y: displayY,  
                    originalY: displayY,  
                    size: 1,  
                    depth: y // Use y as depth indicator  
                });  
            }  
              
            // Sort points by y-position (bottom to top) for growth animation  
            fernPoints.sort((a, b) => b.originalY - a.originalY);  
        }  
          
        function generateFractalTree() {  
            fractalTree = [];  
            const iterations = parseInt(iterationsInput.value);  
            const branchAngle = parseInt(branchAngleInput.value) * Math.PI / 180;  
            const lengthRatio = parseFloat(lengthRatioInput.value);  
            const fractalType = fractalTypeSelect.value;  
              
            if (fractalType === 'tree') {  
                generatePhiTree(canvas.width / 2, canvas.height, -Math.PI / 2, 120, iterations);  
            } else if (fractalType === 'pythagoras') {  
                generatePythagorasTree(canvas.width / 2 - 50, canvas.height - 100, 100, iterations);  
            } else if (fractalType === 'fern') {  
                if (fernPoints.length === 0) {  
                    generateFernPoints();  
                }  
                // The fern is drawn from fernPoints in the draw function  
            } else if (fractalType === 'spiral') {  
                generateGoldenSpiral(iterations);  
            }  
              
            function generatePhiTree(x, y, angle, length, depth) {  
                if (depth <= 0) return;  
                  
                const endX = x + Math.cos(angle) * length;  
                const endY = y + Math.sin(angle) * length;  
                  
                fractalTree.push({  
                    x1: x,  
                    y1: y,  
                    x2: endX,  
                    y2: endY,  
                    depth: depth,  
                    length: length  
                });  
                  
                const newLength = length * lengthRatio;  
                generatePhiTree(endX, endY, angle - branchAngle, newLength, depth - 1);  
                generatePhiTree(endX, endY, angle + branchAngle, newLength * (1/PHI), depth - 1);  
            }  
              
            function generatePythagorasTree(x, y, size, depth) {  
                if (depth <= 0) return;  
                  
                fractalTree.push({  
                    type: 'square',  
                    x: x,  
                    y: y - size,  
                    size: size,  
                    depth: depth  
                });  
                  
                const newSize = size * lengthRatio;  
                const angle = branchAngle;  
                  
                // Left branch  
                const leftX = x - size/2;  
                const leftY = y - size - newSize * Math.sin(angle);  
                generatePythagorasTree(leftX, leftY, newSize, depth - 1);  
                  
                // Right branch  
                const rightX = x + size/2;  
                const rightY = y - size - newSize * Math.sin(angle);  
                generatePythagorasTree(rightX, rightY, newSize * (1/PHI), depth - 1);  
            }  
              
            function generateGoldenSpiral(iterations) {  
                const centerX = canvas.width / 2;  
                const centerY = canvas.height / 2;  
                const scale = 5;  
                  
                for (let i = 0; i < iterations * 100; i++) {  
                    const theta = i * 0.02;  
                    const radius = scale * Math.pow(PHI, theta / (2 * Math.PI));  
                    const x = centerX + radius * Math.cos(theta);  
                    const y = centerY + radius * Math.sin(theta);  
                      
                    if (i > 0) {  
                        const prevTheta = (i - 1) * 0.02;  
                        const prevRadius = scale * Math.pow(PHI, prevTheta / (2 * Math.PI));  
                        const prevX = centerX + prevRadius * Math.cos(prevTheta);  
                        const prevY = centerY + prevRadius * Math.sin(prevTheta);  
                          
                        fractalTree.push({  
                            x1: prevX,  
                            y1: prevY,  
                            x2: x,  
                            y2: y,  
                            depth: 10,  
                            length: Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2))  
                        });  
                    }  
                }  
                  
                // Add golden rectangles  
                let size = 5;  
                for (let i = 0; i < iterations; i++) {  
                    fractalTree.push({  
                        type: 'rectangle',  
                        x: centerX,  
                        y: centerY,  
                        width: size,  
                        height: size / PHI,  
                        rotation: i * Math.PI / 2,  
                        depth: iterations - i  
                    });  
                    size *= PHI;  
                }  
            }  
        }  
          
        function updatePhiMode() {  
            createParticles();  
        }  
          
        function updateRotation() {  
            cameraRotation.x = parseInt(rotationXInput.value) * Math.PI / 180;  
            cameraRotation.y = parseInt(rotationYInput.value) * Math.PI / 180;  
            cameraRotation.z = parseInt(rotationZInput.value) * Math.PI / 180;  
        }  
          
        function applyPreset(preset) {  
            switch(preset) {  
                case 'cosmic':  
                    patternSelect.value = 'cosmic';  
                    perspectiveSelect.value = '3d';  
                    waveFunctionSelect.value = 'combined';  
                    color1Input.value = '#00ffff';  
                    color2Input.value = '#ff00ff';  
                    color3Input.value = '#ffff00';  
                    showConnectionsCheckbox.checked = true;  
                    showTrailsCheckbox.checked = true;  
                    autoRotateCheckbox.checked = true;  
                    break;  
                case 'vortex':  
                    patternSelect.value = 'vortex';  
                    perspectiveSelect.value = '3d';  
                    waveFunctionSelect.value = 'sine';  
                    color1Input.value = '#00ff00';  
                    color2Input.value = '#0000ff';  
                    color3Input.value = '#ff0000';  
                    showConnectionsCheckbox.checked = true;  
                    showTrailsCheckbox.checked = false;  
                    autoRotateCheckbox.checked = true;  
                    break;  
                case 'fractal':  
                    patternSelect.value = 'fractal';  
                    fractalTypeSelect.value = 'tree';  
                    iterationsInput.value = '9';  
                    branchAngleInput.value = '25';  
                    lengthRatioInput.value = '0.618';  
                    perspectiveSelect.value = '2d';  
                    color1Input.value = '#00ffaa';  
                    color2Input.value = '#ffaa00';  
                    color3Input.value = '#aa00ff';  
                    animateFractalCheckbox.checked = true;  
                    break;  
                case 'wave':  
                    patternSelect.value = 'wave';  
                    perspectiveSelect.value = '3d';  
                    waveFunctionSelect.value = 'cosine';  
                    color1Input.value = '#ff0000';  
                    color2Input.value = '#0000ff';  
                    color3Input.value = '#00ff00';  
                    showConnectionsCheckbox.checked = false;  
                    showTrailsCheckbox.checked = true;  
                    autoRotateCheckbox.checked = false;  
                    break;  
            }  
              
            createParticles();  
            generateFractalTree();  
            handlePatternChange();  
        }  
          
        function rotatePoint3D(point, rotation) {  
            let { x, y, z } = point;  
              
            // Rotate around X axis  
            let y1 = y * Math.cos(rotation.x) - z * Math.sin(rotation.x);  
            let z1 = y * Math.sin(rotation.x) + z * Math.cos(rotation.x);  
              
            // Rotate around Y axis  
            let x2 = x * Math.cos(rotation.y) + z1 * Math.sin(rotation.y);  
            let z2 = -x * Math.sin(rotation.y) + z1 * Math.cos(rotation.y);  
              
            // Rotate around Z axis  
            let x3 = x2 * Math.cos(rotation.z) - y1 * Math.sin(rotation.z);  
            let y3 = x2 * Math.sin(rotation.z) + y1 * Math.cos(rotation.z);  
              
            return { x: x3, y: y3, z: z2 };  
        }  
          
        function project3Dto2D(point, cameraDistance) {  
            const scale = cameraDistance / (cameraDistance + point.z);  
            return {  
                x: point.x * scale + canvas.width / 2,  
                y: point.y * scale + canvas.height / 2,  
                scale: scale  
            };  
        }  
          
        function drawParticles() {  
            const pattern = patternSelect.value;  
            if (pattern === 'fractal') return;  
              
            const speed = parseFloat(speedInput.value);  
            const amplitude = parseInt(amplitudeInput.value);  
            const perspective = perspectiveSelect.value;  
            const phiMode = phiModeSelect.value;  
            const waveFunction = waveFunctionSelect.value;  
            const color1 = color1Input.value;  
            const color2 = color2Input.value;  
            const color3 = color3Input.value;  
            const frequency = parseFloat(frequencyInput.value);  
            const cameraDistance = parseInt(cameraDistanceInput.value);  
            const parallaxShift = parseInt(parallaxShiftInput.value);  
            const glowIntensity = parseFloat(glowIntensityInput.value);  
            const lineWidth = parseFloat(lineWidthInput.value);  
            const showTrails = showTrailsCheckbox.checked;  
            const showConnections = showConnectionsCheckbox.checked;  
            const showReflections = showReflectionsCheckbox.checked;  
              
            // Update camera rotation if auto-rotate is enabled  
            if (autoRotateCheckbox.checked) {  
                cameraRotation.x = (time * 0.1) % (Math.PI * 2);  
                cameraRotation.y = (time * 0.15) % (Math.PI * 2);  
                cameraRotation.z = (time * 0.05) % (Math.PI * 2);  
                  
                rotationXInput.value = (cameraRotation.x * 180 / Math.PI) % 360;  
                rotationYInput.value = (cameraRotation.y * 180 / Math.PI) % 360;  
                rotationZInput.value = (cameraRotation.z * 180 / Math.PI) % 360;  
            }  
              
            // Update and draw particles  
            particles.forEach((p, i) => {  
                const phiVal = getPhiValue(phiMode, i);  
                  
                // Calculate wave function  
                let waveFactor = 0;  
                if (waveFunction === 'sine') {  
                    waveFactor = Math.sin(time * frequency + i * 0.1);  
                } else if (waveFunction === 'cosine') {  
                    waveFactor = Math.cos(time * frequency + i * 0.1);  
                } else if (waveFunction === 'tangent') {  
                    waveFactor = Math.tan(time * frequency + i * 0.1) * 0.2;  
                } else if (waveFunction === 'combined') {  
                    waveFactor = Math.sin(time * frequency) * Math.cos(i * 0.1);  
                }  
                  
                // Calculate position based on pattern  
                let x = p.x, y = p.y, z = p.z;  
                  
                if (pattern === 'ripples') {  
                    const angle = time * p.speed + p.phiOffset;  
                    const radius = amplitude * Math.sin(angle / phiVal);  
                    x = canvas.width / 2 + Math.cos(angle) * radius;  
                    y = canvas.height / 2 + Math.sin(angle) * radius;  
                    z = 100 + Math.cos(angle * phiVal) * 50;  
                } else if (pattern === 'spiral') {  
                    const angle = time * p.speed + i * phiVal;  
                    const radius = i * 0.5 + amplitude * Math.sin(time / phiVal);  
                    x += Math.cos(angle) * p.speed;  
                    y += Math.sin(angle) * p.speed;  
                    z = 100 + Math.sin(angle * phiVal) * 50;  
                      
                    // Wrap around screen  
                    if (x < 0) x = canvas.width;  
                    if (x > canvas.width) x = 0;  
                    if (y < 0) y = canvas.height;  
                    if (y > canvas.height) y = 0;  
                } else if (pattern === 'cosmic') {  
                    const angle = time * 0.1 + i * 0.01;  
                    x = canvas.width / 2 + Math.cos(angle * phiVal) * (amplitude + Math.sin(time * 0.2) * 50);  
                    y = canvas.height / 2 + Math.sin(angle * phiVal) * (amplitude + Math.cos(time * 0.2) * 50);  
                    z = 100 + Math.cos(angle * 2) * 100;  
                } else if (pattern === 'wave') {  
                    // Cosine wave field  
                    const waveX = Math.cos(time * 0.5 + p.x * 0.01) * amplitude * 0.1;  
                    const waveY = Math.sin(time * 0.5 + p.y * 0.01) * amplitude * 0.1;  
                    x += waveX;  
                    y += waveY;  
                    z = 100 + Math.cos(p.x * 0.01 + p.y * 0.01 + time) * 100;  
                      
                    // Wrap around screen  
                    if (x < 0) x = canvas.width;  
                    if (x > canvas.width) x = 0;  
                    if (y < 0) y = canvas.height;  
                    if (y > canvas.height) y = 0;  
                } else if (pattern === 'vortex') {  
                    const angle = time * 0.2 + i * 0.02;  
                    const radius = i * 0.5 + Math.sin(time * 0.1) * 20;  
                    x = canvas.width / 2 + Math.cos(angle * phiVal) * radius;  
                    y = canvas.height / 2 + Math.sin(angle * phiVal) * radius;  
                    z = 100 + Math.sin(angle) * 100;  
                } else if (pattern === 'cosine') {  
                    // Complex cosine field  
                    const gridSize = 20;  
                    const xGrid = Math.floor(i / gridSize);  
                    const yGrid = i % gridSize;  
                      
                    const baseX = xGrid * (canvas.width / gridSize);  
                    const baseY = yGrid * (canvas.height / gridSize);  
                      
                    const waveX = Math.cos(time * frequency + xGrid * 0.2) * amplitude * 0.2;  
                    const waveY = Math.sin(time * frequency + yGrid * 0.2) * amplitude * 0.2;  
                      
                    x = baseX + waveX;  
                    y = baseY + waveY;  
                    z = 100 + Math.cos(xGrid * 0.1 + yGrid * 0.1 + time) * 100;  
                }  
                  
                // Update particle position  
                p.x = x;  
                p.y = y;  
                p.z = z;  
                  
                // Apply 3D rotation and perspective  
                let displayX = x - canvas.width / 2;  
                let displayY = y - canvas.height / 2;  
                let displayZ = z;  
                let size = p.size;  
                let opacity = p.opacity;  
                  
                if (perspective === '3d' || perspective === '4d') {  
                    // Apply 3D rotation  
                    const rotated = rotatePoint3D(  
                        { x: displayX, y: displayY, z: displayZ },   
                        cameraRotation  
                    );  
                      
                    displayX = rotated.x;  
                    displayY = rotated.y;  
                    displayZ = rotated.z;  
                      
                    // Apply perspective projection  
                    const projected = project3Dto2D(  
                        { x: displayX, y: displayY, z: displayZ },   
                        cameraDistance  
                    );  
                      
                    displayX = projected.x;  
                    displayY = projected.y;  
                    size *= projected.scale;  
                    opacity *= projected.scale;  
                } else {  
                    displayX += canvas.width / 2;  
                    displayY += canvas.height / 2;  
                }  
                  
                // Apply parallax shift  
                if (perspective === '3d' || perspective === '4d') {  
                    const parallaxFactor = parallaxShift * (displayZ / 1000);  
                    displayX += Math.sin(time * 0.2) * parallaxFactor;  
                    displayY += Math.cos(time * 0.2) * parallaxFactor;  
                }  
                  
                // Store position for trail  
                if (showTrails) {  
                    p.trail.push({ x: displayX, y: displayY, opacity });  
                    if (p.trail.length > p.maxTrail) {  
                        p.trail.shift();  
                    }  
                } else {  
                    p.trail = [];  
                }  
                  
                // Color interpolation based on position and phi  
                const t = (Math.sin(time + i * phiVal) + 1) / 2;  
                const t2 = (Math.cos(time * 0.5 + i * 0.1) + 1) / 2;  
                  
                // Interpolate between three colors  
                let r, g, b;  
                if (t2 < 0.5) {  
                    // Interpolate between color1 and color2  
                    const factor = t2 * 2;  
                    const r1 = parseInt(color1.slice(1, 3), 16);  
                    const g1 = parseInt(color1.slice(3, 5), 16);  
                    const b1 = parseInt(color1.slice(5, 7), 16);  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                      
                    r = Math.floor(r1 + (r2 - r1) * factor);  
                    g = Math.floor(g1 + (g2 - g1) * factor);  
                    b = Math.floor(b1 + (b2 - b1) * factor);  
                } else {  
                    // Interpolate between color2 and color3  
                    const factor = (t2 - 0.5) * 2;  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                    const r3 = parseInt(color3.slice(1, 3), 16);  
                    const g3 = parseInt(color3.slice(3, 5), 16);  
                    const b3 = parseInt(color3.slice(5, 7), 16);  
                      
                    r = Math.floor(r2 + (r3 - r2) * factor);  
                    g = Math.floor(g2 + (g3 - g2) * factor);  
                    b = Math.floor(b2 + (b3 - b2) * factor);  
                }  
                  
                // Draw reflections  
                if (showReflections) {  
                    // Mirror reflection on bottom  
                    const reflectionY = canvas.height - (displayY - canvas.height / 2);  
                    const reflectionOpacity = opacity * 0.3;  
                      
                    // Draw reflection trail  
                    if (showTrails && p.trail.length > 1) {  
                        ctx.beginPath();  
                        ctx.moveTo(p.trail[0].x, canvas.height - (p.trail[0].y - canvas.height / 2));  
                          
                        for (let j = 1; j < p.trail.length; j++) {  
                            ctx.lineTo(p.trail[j].x, canvas.height - (p.trail[j].y - canvas.height / 2));  
                        }  
                          
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${reflectionOpacity * 0.3})`;  
                        ctx.lineWidth = lineWidth * size * 0.3;  
                        ctx.stroke();  
                    }  
                      
                    // Draw reflection particle  
                    ctx.beginPath();  
                    ctx.arc(displayX, reflectionY, size * 0.7, 0, Math.PI * 2);  
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${reflectionOpacity})`;  
                    ctx.fill();  
                }  
                  
                // Draw particle trail  
                if (showTrails && p.trail.length > 1) {  
                    ctx.beginPath();  
                    ctx.moveTo(p.trail[0].x, p.trail[0].y);  
                      
                    for (let j = 1; j < p.trail.length; j++) {  
                        ctx.lineTo(p.trail[j].x, p.trail[j].y);  
                    }  
                      
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;  
                    ctx.lineWidth = lineWidth * size * 0.5;  
                    ctx.stroke();  
                }  
                  
                // Draw particle  
                ctx.beginPath();  
                ctx.arc(displayX, displayY, size, 0, Math.PI * 2);  
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;  
                ctx.fill();  
                  
                // Add minimal glow effect if enabled  
                if (glowIntensity > 0) {  
                    const glow = ctx.createRadialGradient(  
                        displayX, displayY, size,  
                        displayX, displayY, size * (1 + glowIntensity)  
                    );  
                    glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`);  
                    glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);  
                      
                    ctx.beginPath();  
                    ctx.arc(displayX, displayY, size * (1 + glowIntensity), 0, Math.PI * 2);  
                    ctx.fillStyle = glow;  
                    ctx.fill();  
                }  
                  
                // Connect nearby particles with lines  
                if (showConnections) {  
                    particles.forEach((p2, j) => {  
                        if (i !== j && i < j) { // Only process each pair once  
                            // Apply same 3D transformations to p2 for consistent connections  
                            let p2DisplayX = p2.x - canvas.width / 2;  
                            let p2DisplayY = p2.y - canvas.height / 2;  
                            let p2DisplayZ = p2.z;  
                              
                            if (perspective === '3d' || perspective === '4d') {  
                                const rotated = rotatePoint3D(  
                                    { x: p2DisplayX, y: p2DisplayY, z: p2DisplayZ },   
                                    cameraRotation  
                                );  
                                  
                                p2DisplayX = rotated.x;  
                                p2DisplayY = rotated.y;  
                                p2DisplayZ = rotated.z;  
                                  
                                const projected = project3Dto2D(  
                                    { x: p2DisplayX, y: p2DisplayY, z: p2DisplayZ },   
                                    cameraDistance  
                                );  
                                  
                                p2DisplayX = projected.x;  
                                p2DisplayY = projected.y;  
                            } else {  
                                p2DisplayX += canvas.width / 2;  
                                p2DisplayY += canvas.height / 2;  
                            }  
                              
                            const dx = displayX - p2DisplayX;  
                            const dy = displayY - p2DisplayY;  
                            const distance = Math.sqrt(dx * dx + dy * dy);  
                              
                            if (distance < 50) {  
                                ctx.beginPath();  
                                ctx.moveTo(displayX, displayY);  
                                ctx.lineTo(p2DisplayX, p2DisplayY);  
                                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - distance / 50) * 0.3 * opacity})`;  
                                ctx.lineWidth = lineWidth * (1 - distance / 50);  
                                ctx.stroke();  
                                  
                                // Draw connection reflections  
                                if (showReflections) {  
                                    const reflectionY1 = canvas.height - (displayY - canvas.height / 2);  
                                    const reflectionY2 = canvas.height - (p2DisplayY - canvas.height / 2);  
                                      
                                    ctx.beginPath();  
                                    ctx.moveTo(displayX, reflectionY1);  
                                    ctx.lineTo(p2DisplayX, reflectionY2);  
                                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - distance / 50) * 0.1 * opacity})`;  
                                    ctx.lineWidth = lineWidth * (1 - distance / 50) * 0.5;  
                                    ctx.stroke();  
                                }  
                            }  
                        }  
                    });  
                }  
            });  
        }  
          
        function drawFractalTree() {  
            const pattern = patternSelect.value;  
            if (pattern !== 'fractal') return;  
              
            const color1 = color1Input.value;  
            const color2 = color2Input.value;  
            const color3 = color3Input.value;  
            const animate = animateFractalCheckbox.checked;  
            const lineWidth = parseFloat(lineWidthInput.value);  
            const glowIntensity = parseFloat(glowIntensityInput.value);  
            const fractalType = fractalTypeSelect.value;  
            const showReflections = showReflectionsCheckbox.checked;  
              
            if (fractalType === 'fern') {  
                drawFern();  
                return;  
            }  
              
            fractalTree.forEach((branch, i) => {  
                // Color interpolation based on depth  
                const maxDepth = parseInt(iterationsInput.value);  
                const depthRatio = branch.depth / maxDepth;  
                  
                let r, g, b;  
                if (depthRatio > 0.5) {  
                    // Interpolate between color1 and color2  
                    const factor = (depthRatio - 0.5) * 2;  
                    const r1 = parseInt(color1.slice(1, 3), 16);  
                    const g1 = parseInt(color1.slice(3, 5), 16);  
                    const b1 = parseInt(color1.slice(5, 7), 16);  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                      
                    r = Math.floor(r1 + (r2 - r1) * factor);  
                    g = Math.floor(g1 + (g2 - g1) * factor);  
                    b = Math.floor(b1 + (b2 - b1) * factor);  
                } else {  
                    // Interpolate between color2 and color3  
                    const factor = depthRatio * 2;  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                    const r3 = parseInt(color3.slice(1, 3), 16);  
                    const g3 = parseInt(color3.slice(3, 5), 16);  
                    const b3 = parseInt(color3.slice(5, 7), 16);  
                      
                    r = Math.floor(r2 + (r3 - r2) * factor);  
                    g = Math.floor(g2 + (g3 - g2) * factor);  
                    b = Math.floor(b2 + (b3 - b2) * factor);  
                }  
                  
                // Animation factor  
                let animFactor = 1;  
                if (animate) {  
                    animFactor = Math.sin(time * 0.5 + branch.depth * 0.2) * 0.1 + 0.9;  
                }  
                  
                if (branch.type === 'square' || branch.type === 'rectangle') {  
                    // Draw square or rectangle  
                    ctx.save();  
                      
                    if (branch.type === 'rectangle') {  
                        // For golden rectangles in spiral  
                        ctx.translate(branch.x, branch.y);  
                        ctx.rotate(branch.rotation);  
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;  
                        ctx.lineWidth = lineWidth * 1.5;  
                        ctx.strokeRect(-branch.width/2, -branch.height/2, branch.width, branch.height);  
                          
                        // Draw reflection  
                        if (showReflections) {  
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;  
                            ctx.lineWidth = lineWidth * 0.8;  
                            ctx.scale(1, -1); // Flip vertically  
                            ctx.strokeRect(-branch.width/2, -branch.height/2, branch.width, branch.height);  
                        }  
                    } else {  
                        // For Pythagoras tree  
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;  
                        ctx.fillRect(branch.x, branch.y, branch.size, branch.size);  
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;  
                        ctx.lineWidth = lineWidth;  
                        ctx.strokeRect(branch.x, branch.y, branch.size, branch.size);  
                          
                        // Draw reflection  
                        if (showReflections) {  
                            const reflectionY = canvas.height * 2 - branch.y - branch.size;  
                            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;  
                            ctx.fillRect(branch.x, reflectionY, branch.size, branch.size);  
                            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;  
                            ctx.lineWidth = lineWidth * 0.5;  
                            ctx.strokeRect(branch.x, reflectionY, branch.size, branch.size);  
                        }  
                    }  
                      
                    ctx.restore();  
                } else {  
                    // Draw branch line  
                    let x1 = branch.x1;  
                    let y1 = branch.y1;  
                    let x2 = branch.x2;  
                    let y2 = branch.y2;  
                      
                    // Apply animation  
                    if (animate) {  
                        const midX = (x1 + x2) / 2;  
                        const midY = (y1 + y2) / 2;  
                        const dx = x2 - x1;  
                        const dy = y2 - y1;  
                        const angle = Math.atan2(dy, dx);  
                          
                        // Add some wave motion  
                        const waveOffset = Math.sin(time + branch.depth * 0.5) * (5 / branch.depth);  
                        x2 = x1 + Math.cos(angle) * branch.length * animFactor;  
                        y2 = y1 + Math.sin(angle) * branch.length * animFactor + waveOffset;  
                    }  
                      
                    // Draw the branch  
                    ctx.beginPath();  
                    ctx.moveTo(x1, y1);  
                    ctx.lineTo(x2, y2);  
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;  
                    ctx.lineWidth = lineWidth * (branch.depth / 2);  
                    ctx.stroke();  
                      
                    // Draw reflection  
                    if (showReflections) {  
                        const reflectionY1 = canvas.height * 2 - y1;  
                        const reflectionY2 = canvas.height * 2 - y2;  
                          
                        ctx.beginPath();  
                        ctx.moveTo(x1, reflectionY1);  
                        ctx.lineTo(x2, reflectionY2);  
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;  
                        ctx.lineWidth = lineWidth * (branch.depth / 2) * 0.5;  
                        ctx.stroke();  
                    }  
                      
                    // Add minimal glow effect if enabled  
                    if (glowIntensity > 0) {  
                        ctx.beginPath();  
                        ctx.moveTo(x1, y1);  
                        ctx.lineTo(x2, y2);  
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;  
                        ctx.lineWidth = lineWidth * (branch.depth / 2) * (1 + glowIntensity);  
                        ctx.stroke();  
                    }  
                }  
            });  
        }  
          
        function drawFern() {  
            const color1 = color1Input.value;  
            const color2 = color2Input.value;  
            const color3 = color3Input.value;  
            const animate = animateFractalCheckbox.checked;  
            const showReflections = showReflectionsCheckbox.checked;  
              
            // Increase fern growth if animating  
            if (animate) {  
                fernGrowth += 0.01;  
                if (fernGrowth > 1) fernGrowth = 1;  
            } else {  
                fernGrowth = 1; // Show full fern if not animating  
            }  
              
            // Calculate how many points to show based on growth  
            const pointsToShow = Math.floor(fernPoints.length * fernGrowth);  
              
            // Draw fern points  
            for (let i = 0; i < pointsToShow; i++) {  
                const point = fernPoints[i];  
                  
                // Color based on depth (y-position)  
                const maxDepth = Math.max(...fernPoints.map(p => p.depth));  
                const depthRatio = point.depth / maxDepth;  
                  
                let r, g, b;  
                if (depthRatio < 0.5) {  
                    // Interpolate between color3 and color2  
                    const factor = depthRatio * 2;  
                    const r3 = parseInt(color3.slice(1, 3), 16);  
                    const g3 = parseInt(color3.slice(3, 5), 16);  
                    const b3 = parseInt(color3.slice(5, 7), 16);  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                      
                    r = Math.floor(r3 + (r2 - r3) * factor);  
                    g = Math.floor(g3 + (g2 - g3) * factor);  
                    b = Math.floor(b3 + (b2 - b3) * factor);  
                } else {  
                    // Interpolate between color2 and color1  
                    const factor = (depthRatio - 0.5) * 2;  
                    const r2 = parseInt(color2.slice(1, 3), 16);  
                    const g2 = parseInt(color2.slice(3, 5), 16);  
                    const b2 = parseInt(color2.slice(5, 7), 16);  
                    const r1 = parseInt(color1.slice(1, 3), 16);  
                    const g1 = parseInt(color1.slice(3, 5), 16);  
                    const b1 = parseInt(color1.slice(5, 7), 16);  
                      
                    r = Math.floor(r2 + (r1 - r2) * factor);  
                    g = Math.floor(g2 + (g1 - g2) * factor);  
                    b = Math.floor(b2 + (b1 - b2) * factor);  
                }  
                  
                // Animation - make points grow from bottom to top  
                let displayY = point.y;  
                if (animate) {  
                    // Calculate growth factor for this specific point  
                    const growthFactor = Math.min(1, fernGrowth * 1.2 - (1 - depthRatio) * 0.8);  
                    if (growthFactor <= 0) continue;  
                      
                    // Animate from bottom  
                    const baseY = canvas.height - 50;  
                    displayY = baseY - (baseY - point.y) * growthFactor;  
                }  
                  
                // Draw point  
                ctx.beginPath();  
                ctx.arc(point.x, displayY, point.size * 1.5, 0, Math.PI * 2);  
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;  
                ctx.fill();  
                  
                // Draw reflection  
                if (showReflections) {  
                    const reflectionY = canvas.height + (canvas.height - displayY) * 0.3;  
                    ctx.beginPath();  
                    ctx.arc(point.x, reflectionY, point.size, 0, Math.PI * 2);  
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;  
                    ctx.fill();  
                }  
            }  
        }  
          
        function animate(timestamp) {  
            requestAnimationFrame(animate);  
              
            // Clear canvas  
            ctx.fillStyle = 'rgba(0,0,0,0.1)';  
            ctx.fillRect(0, 0, canvas.width, canvas.height);  
              
            const speed = parseFloat(speedInput.value);  
            time += 0.01 * speed;  
            iterationCount++;  
              
            // Draw particles or fractal tree  
            drawParticles();  
            drawFractalTree();  
        }  
          
        // Start the visualization  
        init();  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601867f52829f2a',t:'MTc1MjY2OTE3OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
