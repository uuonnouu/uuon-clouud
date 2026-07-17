# Geometric Easy Art   
![Image](Attachments/1A54D86B-EF55-4567-844E-468DB019C120.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Neomorphic Vector Fabric Designer</title>  
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">  
    <style>  
        :root {  
            --neon-blue: #00f3ff;  
            --neon-purple: #9d4edd;  
            --dark-bg: #0a0118;  
            --panel-bg: #14082a;  
            --highlight: #6a00ff;  
        }  
          
        body {  
            margin: 0;  
            padding: 0;  
            background: radial-gradient(ellipse at top, #1a0033, #000),  
                        radial-gradient(ellipse at bottom, #000, #0a0020);  
            font-family: 'Rajdhani', 'Orbitron', sans-serif;  
            color: #fff;  
            overflow: hidden;  
            height: 100vh;  
            user-select: none;  
        }  
  
        .neo-panel {  
            background: var(--panel-bg);  
            border-radius: 16px;  
            box-shadow:   
                5px 5px 15px rgba(0, 0, 0, 0.7),  
                -5px -5px 15px rgba(74, 0, 128, 0.15),  
                inset 0 0 0 1px rgba(138, 43, 226, 0.1);  
            backdrop-filter: blur(10px);  
        }  
          
        .neo-button {  
            background: linear-gradient(145deg, #14082a, #1c0c3a);  
            box-shadow:   
                3px 3px 6px rgba(0, 0, 0, 0.5),  
                -2px -2px 5px rgba(74, 0, 128, 0.15),  
                inset 0 0 0 1px rgba(138, 43, 226, 0.2);  
            transition: all 0.2s ease;  
            position: relative;  
            overflow: hidden;  
        }  
          
        .neo-button:hover {  
            background: linear-gradient(145deg, #1c0c3a, #14082a);  
            box-shadow:   
                2px 2px 4px rgba(0, 0, 0, 0.5),  
                -1px -1px 3px rgba(74, 0, 128, 0.15),  
                inset 0 0 0 1px rgba(138, 43, 226, 0.3);  
            transform: translateY(-1px);  
        }  
          
        .neo-button:active {  
            background: linear-gradient(145deg, #14082a, #1c0c3a);  
            box-shadow:   
                inset 2px 2px 4px rgba(0, 0, 0, 0.5),  
                inset -1px -1px 3px rgba(74, 0, 128, 0.15);  
            transform: translateY(1px);  
        }  
          
        .neo-button::after {  
            content: '';  
            position: absolute;  
            top: -50%;  
            left: -50%;  
            width: 200%;  
            height: 200%;  
            background: linear-gradient(  
                rgba(255, 255, 255, 0),  
                rgba(255, 255, 255, 0),  
                rgba(255, 255, 255, 0.1),  
                rgba(255, 255, 255, 0)  
            );  
            transform: rotate(45deg);  
            transition: all 0.3s ease;  
            opacity: 0;  
        }  
          
        .neo-button:hover::after {  
            animation: shine 1.5s ease;  
        }  
          
        @keyframes shine {  
            0% { left: -50%; opacity: 0; }  
            50% { opacity: 0.3; }  
            100% { left: 150%; opacity: 0; }  
        }  
          
        .neo-slider {  
            -webkit-appearance: none;  
            height: 6px;  
            background: linear-gradient(90deg, #2a0040, #8a2be2);  
            border-radius: 10px;  
            box-shadow:   
                inset 1px 1px 2px rgba(0, 0, 0, 0.7),  
                inset -1px -1px 2px rgba(74, 0, 128, 0.2);  
            outline: none;  
        }  
          
        .neo-slider::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: linear-gradient(145deg, #d9a9ff, #9d4edd);  
            cursor: pointer;  
            box-shadow:   
                2px 2px 4px rgba(0, 0, 0, 0.5),  
                -1px -1px 3px rgba(255, 255, 255, 0.1);  
            border: 1px solid rgba(138, 43, 226, 0.5);  
        }  
          
        .neo-slider::-webkit-slider-thumb:hover {  
            background: linear-gradient(145deg, #e5c3ff, #b76aff);  
        }  
          
        .neo-select {  
            background: linear-gradient(145deg, #14082a, #1c0c3a);  
            box-shadow:   
                inset 1px 1px 2px rgba(0, 0, 0, 0.7),  
                inset -1px -1px 2px rgba(74, 0, 128, 0.2);  
            border: 1px solid rgba(138, 43, 226, 0.3);  
        }  
          
        .grid-texture {  
            background-image:   
                linear-gradient(rgba(138, 43, 226, 0.1) 1px, transparent 1px),  
                linear-gradient(90deg, rgba(138, 43, 226, 0.1) 1px, transparent 1px);  
            background-size: 20px 20px;  
            background-position: center center;  
        }  
          
        .canvas-container {  
            position: relative;  
        }  
          
        .canvas-container::before {  
            content: '';  
            position: absolute;  
            top: -5px;  
            left: -5px;  
            right: -5px;  
            bottom: -5px;  
            border-radius: 5px;  
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-blue), var(--neon-purple), var(--neon-blue));  
            background-size: 400% 400%;  
            z-index: -1;  
            filter: blur(5px);  
            animation: glowingBorder 10s ease infinite;  
        }  
          
        @keyframes glowingBorder {  
            0% { background-position: 0% 50%; }  
            50% { background-position: 100% 50%; }  
            100% { background-position: 0% 50%; }  
        }  
          
        .futuristic-text {  
            text-shadow: 0 0 5px var(--neon-blue), 0 0 10px var(--neon-blue);  
            letter-spacing: 1px;  
        }  
          
        .control-value {  
            font-family: 'Courier New', monospace;  
            font-size: 11px;  
            color: var(--neon-blue);  
            text-shadow: 0 0 5px var(--neon-blue);  
        }  
          
        .tooltip {  
            position: absolute;  
            background: rgba(10, 1, 24, 0.9);  
            border: 1px solid var(--neon-purple);  
            border-radius: 4px;  
            padding: 4px 8px;  
            font-size: 11px;  
            color: #fff;  
            z-index: 1000;  
            pointer-events: none;  
            opacity: 0;  
            transition: opacity 0.2s;  
            box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);  
        }  
          
        .has-tooltip:hover + .tooltip {  
            opacity: 1;  
        }  
          
        .intense-mode {  
            box-shadow: 0 0 80px rgba(255, 0, 255, 0.7),   
                        0 0 120px rgba(255, 0, 128, 0.5),  
                        0 0 200px rgba(128, 0, 255, 0.4);  
        }  
          
        .control-panel-toggle {  
            position: fixed;  
            top: 10px;  
            left: 10px;  
            z-index: 1000;  
            width: 40px;  
            height: 40px;  
            border-radius: 50%;  
            display: none;  
        }  
          
        @media (max-width: 768px) {  
            .control-panel-toggle {  
                display: flex;  
            }  
              
            .controls {  
                transform: translateX(-100%);  
                transition: transform 0.3s ease;  
            }  
              
            .controls.show {  
                transform: translateX(0);  
            }  
        }  
          
        /* Circuit board pattern */  
        .circuit-pattern {  
            background-image:   
                radial-gradient(circle at 25px 25px, rgba(138, 43, 226, 0.15) 2px, transparent 0),  
                linear-gradient(to right, rgba(138, 43, 226, 0.1) 1px, transparent 1px),  
                linear-gradient(to bottom, rgba(138, 43, 226, 0.1) 1px, transparent 1px);  
            background-size: 50px 50px, 25px 25px, 25px 25px;  
        }  
          
        /* Hexagon pattern */  
        .hex-pattern {  
            background-color: transparent;  
            background-image:   
                linear-gradient(to right, rgba(138, 43, 226, 0.07) 1px, transparent 1px),  
                linear-gradient(to bottom, rgba(138, 43, 226, 0.07) 1px, transparent 1px),  
                linear-gradient(to right, rgba(138, 43, 226, 0.05) 1px, transparent 1px),  
                linear-gradient(to bottom, rgba(138, 43, 226, 0.05) 1px, transparent 1px);  
            background-size: 20px 20px, 20px 20px, 5px 5px, 5px 5px;  
        }  
    </style>  
</head>  
<body class="circuit-pattern">  
    <div class="container relative w-full h-full flex justify-center items-center">  
        <!-- Mobile toggle button -->  
        <button class="control-panel-toggle neo-button flex justify-center items-center" id="controlToggle">  
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  
                <line x1="3" y1="12" x2="21" y2="12"></line>  
                <line x1="3" y1="6" x2="21" y2="6"></line>  
                <line x1="3" y1="18" x2="21" y2="18"></line>  
            </svg>  
        </button>  
          
        <!-- Controls Panel -->  
        <div class="controls neo-panel fixed top-4 left-4 p-4 z-50 max-w-xs" id="controlPanel">  
            <div class="flex justify-between items-center mb-4">  
                <h2 class="text-sm font-bold futuristic-text text-purple-300">FABRIC DESIGNER</h2>  
                <div class="flex space-x-1">  
                    <button class="neo-button px-2 py-1 rounded-md text-xs has-tooltip" id="helpBtn">?</button>  
                    <div class="tooltip">Show help and shortcuts</div>  
                    <button class="neo-button px-2 py-1 rounded-md text-xs has-tooltip" id="minimizeBtn">_</button>  
                    <div class="tooltip">Minimize panel</div>  
                </div>  
            </div>  
              
            <div class="space-y-4">  
                <!-- Symmetry Controls -->  
                <div class="control-group">  
                    <div class="control-title text-xs uppercase tracking-wider mb-2 futuristic-text">Symmetry</div>  
                    <div class="flex flex-col space-y-2">  
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Type</label>  
                            <select id="symmetryType" class="neo-select text-xs rounded-md px-2 py-1 w-32 text-purple-200">  
                                <option value="radial">Radial</option>  
                                <option value="mirror">Mirror</option>  
                                <option value="kaleidoscope">Kaleidoscope</option>  
                                <option value="mandala">Mandala</option>  
                            </select>  
                        </div>  
                          
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Segments</label>  
                            <div class="flex items-center">  
                                <input type="range" id="segments" min="2" max="24" value="6" class="neo-slider w-24">  
                                <span id="segmentsValue" class="control-value ml-2">6</span>  
                            </div>  
                        </div>  
                    </div>  
                </div>  
                  
                <!-- Drawing Controls -->  
                <div class="control-group">  
                    <div class="control-title text-xs uppercase tracking-wider mb-2 futuristic-text">Drawing</div>  
                    <div class="flex flex-col space-y-2">  
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Brush Size</label>  
                            <div class="flex items-center">  
                                <input type="range" id="brushSize" min="1" max="50" value="5" class="neo-slider w-24">  
                                <span id="brushSizeValue" class="control-value ml-2">5</span>  
                            </div>  
                        </div>  
                          
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Color</label>  
                            <div class="flex items-center space-x-2">  
                                <input type="color" id="brushColor" value="#9d4edd" class="w-6 h-6 rounded-full overflow-hidden cursor-pointer">  
                                <button id="randomColor" class="neo-button px-2 py-1 rounded-md text-xs has-tooltip">Random</button>  
                                <div class="tooltip">Generate random color</div>  
                            </div>  
                        </div>  
                          
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Opacity</label>  
                            <div class="flex items-center">  
                                <input type="range" id="opacity" min="0.1" max="1" step="0.1" value="1" class="neo-slider w-24">  
                                <span id="opacityValue" class="control-value ml-2">100%</span>  
                            </div>  
                        </div>  
                          
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Mode</label>  
                            <select id="drawingMode" class="neo-select text-xs rounded-md px-2 py-1 w-32 text-purple-200">  
                                <option value="line">Line</option>  
                                <option value="curve">Curve</option>  
                                <option value="particle">Particle</option>  
                                <option value="pattern">Pattern</option>  
                            </select>  
                        </div>  
                    </div>  
                </div>  
                  
                <!-- Effects Controls -->  
                <div class="control-group">  
                    <div class="control-title text-xs uppercase tracking-wider mb-2 futuristic-text">Effects</div>  
                    <div class="flex flex-col space-y-2">  
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Glow</label>  
                            <div class="flex items-center">  
                                <input type="range" id="glowIntensity" min="0" max="20" value="0" class="neo-slider w-24">  
                                <span id="glowValue" class="control-value ml-2">0</span>  
                            </div>  
                        </div>  
                          
                        <div class="flex items-center justify-between">  
                            <label class="text-xs">Intensity</label>  
                            <div class="flex items-center">  
                                <input type="checkbox" id="intenseModeToggle" class="mr-2">  
                                <span class="text-xs">Intense Mode</span>  
                            </div>  
                        </div>  
                    </div>  
                </div>  
                  
                <!-- Action Buttons -->  
                <div class="flex flex-wrap gap-2 justify-between">  
                    <button id="clearBtn" class="neo-button px-3 py-2 rounded-md text-xs">Clear</button>  
                    <button id="undoBtn" class="neo-button px-3 py-2 rounded-md text-xs">Undo</button>  
                    <button id="saveBtn" class="neo-button px-3 py-2 rounded-md text-xs">Save</button>  
                    <button id="exportBtn" class="neo-button px-3 py-2 rounded-md text-xs">Export</button>  
                </div>  
            </div>  
        </div>  
          
        <!-- Canvas Container -->  
        <div class="canvas-container">  
            <canvas id="fabricCanvas" width="1200" height="800" class="hex-pattern"></canvas>  
        </div>  
          
        <!-- Help Modal -->  
        <div id="helpModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 hidden">  
            <div class="neo-panel p-6 max-w-md mx-4">  
                <div class="flex justify-between items-center mb-4">  
                    <h3 class="text-lg font-bold futuristic-text text-purple-300">HELP & SHORTCUTS</h3>  
                    <button id="closeHelp" class="neo-button px-2 py-1 rounded-md">×</button>  
                </div>  
                <div class="space-y-3 text-sm">  
                    <p><span class="text-purple-300">Mouse Drag</span> - Draw on canvas</p>  
                    <p><span class="text-purple-300">Shift + Drag</span> - Draw straight lines</p>  
                    <p><span class="text-purple-300">Ctrl + Z</span> - Undo last action</p>  
                    <p><span class="text-purple-300">Spacebar</span> - Toggle control panel</p>  
                    <p><span class="text-purple-300">[ / ]</span> - Decrease/Increase brush size</p>  
                    <p><span class="text-purple-300">R</span> - Random color</p>  
                    <p><span class="text-purple-300">C</span> - Clear canvas</p>  
                    <p><span class="text-purple-300">S</span> - Save design</p>  
                </div>  
            </div>  
        </div>  
    </div>  
  
    <script>  
        document.addEventListener('DOMContentLoaded', function() {  
            // Canvas setup  
            const canvas = document.getElementById('fabricCanvas');  
            const ctx = canvas.getContext('2d');  
              
            // Make canvas responsive  
            function resizeCanvas() {  
                const container = document.querySelector('.canvas-container');  
                const maxWidth = Math.min(window.innerWidth - 40, 1200);  
                const maxHeight = Math.min(window.innerHeight - 40, 800);  
                  
                // Maintain aspect ratio  
                const aspectRatio = 1200 / 800;  
                let newWidth, newHeight;  
                  
                if (maxWidth / maxHeight > aspectRatio) {  
                    newHeight = maxHeight;  
                    newWidth = newHeight * aspectRatio;  
                } else {  
                    newWidth = maxWidth;  
                    newHeight = newWidth / aspectRatio;  
                }  
                  
                canvas.style.width = `${newWidth}px`;  
                canvas.style.height = `${newHeight}px`;  
            }  
              
            // Initial resize  
            resizeCanvas();  
            window.addEventListener('resize', resizeCanvas);  
              
            // Drawing state  
            let isDrawing = false;  
            let lastX = 0;  
            let lastY = 0;  
            let brushSize = 5;  
            let brushColor = '#9d4edd';  
            let opacity = 1;  
            let segments = 6;  
            let symmetryType = 'radial';  
            let drawingMode = 'line';  
            let glowIntensity = 0;  
            let intenseMode = false;  
              
            // History for undo  
            const history = [];  
            const maxHistory = 20;  
              
            // Save current state to history  
            function saveState() {  
                if (history.length >= maxHistory) {  
                    history.shift(); // Remove oldest state  
                }  
                history.push(canvas.toDataURL());  
            }  
              
            // Clear canvas with animation  
            function clearCanvas() {  
                saveState();  
                  
                const fadeOut = setInterval(() => {  
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                      
                    // Check if canvas is mostly cleared  
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);  
                    let sum = 0;  
                    for (let i = 0; i < imageData.data.length; i += 4) {  
                        sum += imageData.data[i] + imageData.data[i+1] + imageData.data[i+2];  
                    }  
                      
                    if (sum < 1000) {  
                        clearInterval(fadeOut);  
                        ctx.clearRect(0, 0, canvas.width, canvas.height);  
                    }  
                }, 30);  
            }  
              
            // Draw at the given position with symmetry  
            function draw(x, y, lastX, lastY) {  
                const centerX = canvas.width / 2;  
                const centerY = canvas.height / 2;  
                  
                ctx.lineWidth = brushSize;  
                ctx.lineCap = 'round';  
                ctx.lineJoin = 'round';  
                  
                // Apply glow effect if enabled  
                if (glowIntensity > 0) {  
                    ctx.shadowBlur = glowIntensity;  
                    ctx.shadowColor = brushColor;  
                }  
                  
                const rgba = hexToRgba(brushColor, opacity);  
                ctx.strokeStyle = rgba;  
                  
                if (symmetryType === 'radial') {  
                    // Radial symmetry  
                    const angle = (2 * Math.PI) / segments;  
                      
                    for (let i = 0; i < segments; i++) {  
                        ctx.save();  
                        ctx.translate(centerX, centerY);  
                        ctx.rotate(angle * i);  
                          
                        const relativeX = x - centerX;  
                        const relativeY = y - centerY;  
                        const relativeLastX = lastX - centerX;  
                        const relativeLastY = lastY - centerY;  
                          
                        ctx.beginPath();  
                          
                        if (drawingMode === 'line') {  
                            ctx.moveTo(relativeLastX, relativeLastY);  
                            ctx.lineTo(relativeX, relativeY);  
                        } else if (drawingMode === 'curve') {  
                            // Create a curved line  
                            const controlX = (relativeLastX + relativeX) / 2;  
                            const controlY = (relativeLastY + relativeY) / 2 - 50;  
                              
                            ctx.moveTo(relativeLastX, relativeLastY);  
                            ctx.quadraticCurveTo(controlX, controlY, relativeX, relativeY);  
                        } else if (drawingMode === 'particle') {  
                            // Draw particles along the path  
                            const steps = Math.max(5, Math.floor(distance(relativeLastX, relativeLastY, relativeX, relativeY) / 5));  
                              
                            for (let j = 0; j < steps; j++) {  
                                const t = j / steps;  
                                const particleX = relativeLastX + (relativeX - relativeLastX) * t;  
                                const particleY = relativeLastY + (relativeY - relativeLastY) * t;  
                                  
                                ctx.beginPath();  
                                ctx.arc(particleX, particleY, brushSize * Math.random(), 0, Math.PI * 2);  
                                ctx.fill();  
                            }  
                        } else if (drawingMode === 'pattern') {  
                            // Draw pattern elements along the path  
                            const steps = Math.max(3, Math.floor(distance(relativeLastX, relativeLastY, relativeX, relativeY) / 15));  
                              
                            for (let j = 0; j < steps; j++) {  
                                const t = j / steps;  
                                const patternX = relativeLastX + (relativeX - relativeLastX) * t;  
                                const patternY = relativeLastY + (relativeY - relativeLastY) * t;  
                                  
                                // Draw a small geometric pattern  
                                const patternSize = brushSize * 0.8;  
                                  
                                ctx.beginPath();  
                                ctx.moveTo(patternX, patternY - patternSize);  
                                ctx.lineTo(patternX + patternSize, patternY);  
                                ctx.lineTo(patternX, patternY + patternSize);  
                                ctx.lineTo(patternX - patternSize, patternY);  
                                ctx.closePath();  
                                ctx.stroke();  
                            }  
                        }  
                          
                        if (drawingMode === 'line' || drawingMode === 'curve') {  
                            ctx.stroke();  
                        }  
                          
                        ctx.restore();  
                    }  
                } else if (symmetryType === 'mirror') {  
                    // Mirror symmetry  
                    ctx.beginPath();  
                    ctx.moveTo(lastX, lastY);  
                    ctx.lineTo(x, y);  
                    ctx.stroke();  
                      
                    // Mirror horizontally  
                    ctx.beginPath();  
                    ctx.moveTo(canvas.width - lastX, lastY);  
                    ctx.lineTo(canvas.width - x, y);  
                    ctx.stroke();  
                      
                    // Mirror vertically  
                    ctx.beginPath();  
                    ctx.moveTo(lastX, canvas.height - lastY);  
                    ctx.lineTo(x, canvas.height - y);  
                    ctx.stroke();  
                      
                    // Mirror both  
                    ctx.beginPath();  
                    ctx.moveTo(canvas.width - lastX, canvas.height - lastY);  
                    ctx.lineTo(canvas.width - x, canvas.height - y);  
                    ctx.stroke();  
                } else if (symmetryType === 'kaleidoscope') {  
                    // Kaleidoscope effect  
                    const angle = (2 * Math.PI) / segments;  
                      
                    for (let i = 0; i < segments; i++) {  
                        ctx.save();  
                        ctx.translate(centerX, centerY);  
                        ctx.rotate(angle * i);  
                          
                        const relativeX = x - centerX;  
                        const relativeY = y - centerY;  
                        const relativeLastX = lastX - centerX;  
                        const relativeLastY = lastY - centerY;  
                          
                        // Original  
                        ctx.beginPath();  
                        ctx.moveTo(relativeLastX, relativeLastY);  
                        ctx.lineTo(relativeX, relativeY);  
                        ctx.stroke();  
                          
                        // Mirrored  
                        ctx.beginPath();  
                        ctx.moveTo(-relativeLastX, relativeLastY);  
                        ctx.lineTo(-relativeX, relativeY);  
                        ctx.stroke();  
                          
                        ctx.restore();  
                    }  
                } else if (symmetryType === 'mandala') {  
                    // Mandala effect  
                    const angle = (2 * Math.PI) / segments;  
                    const radius = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));  
                    const theta = Math.atan2(y - centerY, x - centerX);  
                    const lastTheta = Math.atan2(lastY - centerY, lastX - centerX);  
                    const lastRadius = Math.sqrt(Math.pow(lastX - centerX, 2) + Math.pow(lastY - centerY, 2));  
                      
                    for (let i = 0; i < segments; i++) {  
                        const currentAngle = angle * i;  
                          
                        const x1 = centerX + lastRadius * Math.cos(lastTheta + currentAngle);  
                        const y1 = centerY + lastRadius * Math.sin(lastTheta + currentAngle);  
                        const x2 = centerX + radius * Math.cos(theta + currentAngle);  
                        const y2 = centerY + radius * Math.sin(theta + currentAngle);  
                          
                        ctx.beginPath();  
                        ctx.moveTo(x1, y1);  
                        ctx.lineTo(x2, y2);  
                        ctx.stroke();  
                          
                        // Mirror  
                        const x1m = centerX + lastRadius * Math.cos(-lastTheta + currentAngle);  
                        const y1m = centerY + lastRadius * Math.sin(-lastTheta + currentAngle);  
                        const x2m = centerX + radius * Math.cos(-theta + currentAngle);  
                        const y2m = centerY + radius * Math.sin(-theta + currentAngle);  
                          
                        ctx.beginPath();  
                        ctx.moveTo(x1m, y1m);  
                        ctx.lineTo(x2m, y2m);  
                        ctx.stroke();  
                    }  
                }  
                  
                // Reset shadow  
                ctx.shadowBlur = 0;  
            }  
              
            // Helper function to calculate distance  
            function distance(x1, y1, x2, y2) {  
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));  
            }  
              
            // Convert hex color to rgba  
            function hexToRgba(hex, opacity) {  
                const r = parseInt(hex.slice(1, 3), 16);  
                const g = parseInt(hex.slice(3, 5), 16);  
                const b = parseInt(hex.slice(5, 7), 16);  
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;  
            }  
              
            // Generate random color  
            function getRandomColor() {  
                const letters = '0123456789ABCDEF';  
                let color = '#';  
                for (let i = 0; i < 6; i++) {  
                    color += letters[Math.floor(Math.random() * 16)];  
                }  
                return color;  
            }  
              
            // Mouse events  
            canvas.addEventListener('mousedown', (e) => {  
                isDrawing = true;  
                  
                // Get mouse position relative to canvas  
                const rect = canvas.getBoundingClientRect();  
                const scaleX = canvas.width / rect.width;  
                const scaleY = canvas.height / rect.height;  
                  
                lastX = (e.clientX - rect.left) * scaleX;  
                lastY = (e.clientY - rect.top) * scaleY;  
                  
                // Save state before starting new drawing  
                saveState();  
            });  
              
            canvas.addEventListener('mousemove', (e) => {  
                if (!isDrawing) return;  
                  
                // Get mouse position relative to canvas  
                const rect = canvas.getBoundingClientRect();  
                const scaleX = canvas.width / rect.width;  
                const scaleY = canvas.height / rect.height;  
                  
                const x = (e.clientX - rect.left) * scaleX;  
                const y = (e.clientY - rect.top) * scaleY;  
                  
                // Draw with symmetry  
                draw(x, y, lastX, lastY);  
                  
                lastX = x;  
                lastY = y;  
            });  
              
            canvas.addEventListener('mouseup', () => {  
                isDrawing = false;  
            });  
              
            canvas.addEventListener('mouseout', () => {  
                isDrawing = false;  
            });  
              
            // Touch events for mobile  
            canvas.addEventListener('touchstart', (e) => {  
                e.preventDefault();  
                isDrawing = true;  
                  
                const rect = canvas.getBoundingClientRect();  
                const scaleX = canvas.width / rect.width;  
                const scaleY = canvas.height / rect.height;  
                  
                const touch = e.touches[0];  
                lastX = (touch.clientX - rect.left) * scaleX;  
                lastY = (touch.clientY - rect.top) * scaleY;  
                  
                saveState();  
            });  
              
            canvas.addEventListener('touchmove', (e) => {  
                e.preventDefault();  
                if (!isDrawing) return;  
                  
                const rect = canvas.getBoundingClientRect();  
                const scaleX = canvas.width / rect.width;  
                const scaleY = canvas.height / rect.height;  
                  
                const touch = e.touches[0];  
                const x = (touch.clientX - rect.left) * scaleX;  
                const y = (touch.clientY - rect.top) * scaleY;  
                  
                draw(x, y, lastX, lastY);  
                  
                lastX = x;  
                lastY = y;  
            });  
              
            canvas.addEventListener('touchend', () => {  
                isDrawing = false;  
            });  
              
            // UI Controls  
            document.getElementById('brushSize').addEventListener('input', (e) => {  
                brushSize = parseInt(e.target.value);  
                document.getElementById('brushSizeValue').textContent = brushSize;  
            });  
              
            document.getElementById('brushColor').addEventListener('input', (e) => {  
                brushColor = e.target.value;  
            });  
              
            document.getElementById('opacity').addEventListener('input', (e) => {  
                opacity = parseFloat(e.target.value);  
                document.getElementById('opacityValue').textContent = `${Math.round(opacity * 100)}%`;  
            });  
              
            document.getElementById('segments').addEventListener('input', (e) => {  
                segments = parseInt(e.target.value);  
                document.getElementById('segmentsValue').textContent = segments;  
            });  
              
            document.getElementById('symmetryType').addEventListener('change', (e) => {  
                symmetryType = e.target.value;  
            });  
              
            document.getElementById('drawingMode').addEventListener('change', (e) => {  
                drawingMode = e.target.value;  
            });  
              
            document.getElementById('glowIntensity').addEventListener('input', (e) => {  
                glowIntensity = parseInt(e.target.value);  
                document.getElementById('glowValue').textContent = glowIntensity;  
            });  
              
            document.getElementById('intenseModeToggle').addEventListener('change', (e) => {  
                intenseMode = e.target.checked;  
                if (intenseMode) {  
                    canvas.classList.add('intense-mode');  
                } else {  
                    canvas.classList.remove('intense-mode');  
                }  
            });  
              
            document.getElementById('clearBtn').addEventListener('click', clearCanvas);  
              
            document.getElementById('undoBtn').addEventListener('click', () => {  
                if (history.length > 0) {  
                    const img = new Image();  
                    img.onload = () => {  
                        ctx.clearRect(0, 0, canvas.width, canvas.height);  
                        ctx.drawImage(img, 0, 0);  
                    };  
                    img.src = history.pop();  
                }  
            });  
              
            document.getElementById('randomColor').addEventListener('click', () => {  
                brushColor = getRandomColor();  
                document.getElementById('brushColor').value = brushColor;  
            });  
              
            document.getElementById('saveBtn').addEventListener('click', () => {  
                const dataURL = canvas.toDataURL('image/png');  
                const link = document.createElement('a');  
                link.download = 'fabric-design.png';  
                link.href = dataURL;  
                link.click();  
            });  
              
            document.getElementById('exportBtn').addEventListener('click', () => {  
                // Create a modal to show export options  
                const modal = document.createElement('div');  
                modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70';  
                modal.innerHTML = `  
                    <div class="neo-panel p-6 max-w-md mx-4">  
                        <div class="flex justify-between items-center mb-4">  
                            <h3 class="text-lg font-bold futuristic-text text-purple-300">EXPORT OPTIONS</h3>  
                            <button id="closeExport" class="neo-button px-2 py-1 rounded-md">×</button>  
                        </div>  
                        <div class="space-y-4">  
                            <div class="flex justify-between items-center">  
                                <span class="text-sm">Format</span>  
                                <select id="exportFormat" class="neo-select text-xs rounded-md px-2 py-1 w-32 text-purple-200">  
                                    <option value="png">PNG Image</option>  
                                    <option value="jpg">JPG Image</option>  
                                    <option value="svg">SVG Vector</option>  
                                </select>  
                            </div>  
                            <div class="flex justify-between items-center">  
                                <span class="text-sm">Resolution</span>  
                                <select id="exportResolution" class="neo-select text-xs rounded-md px-2 py-1 w-32 text-purple-200">  
                                    <option value="1">Standard (1x)</option>  
                                    <option value="2">High (2x)</option>  
                                    <option value="4">Ultra (4x)</option>  
                                </select>  
                            </div>  
                            <button id="downloadExport" class="neo-button w-full px-3 py-2 rounded-md text-sm">Download</button>  
                        </div>  
                    </div>  
                `;  
                  
                document.body.appendChild(modal);  
                  
                document.getElementById('closeExport').addEventListener('click', () => {  
                    document.body.removeChild(modal);  
                });  
                  
                document.getElementById('downloadExport').addEventListener('click', () => {  
                    const format = document.getElementById('exportFormat').value;  
                    const resolution = parseFloat(document.getElementById('exportResolution').value);  
                      
                    if (format === 'svg') {  
                        alert('SVG export is not available in this demo version.');  
                        return;  
                    }  
                      
                    // Create a temporary canvas for high-resolution export  
                    const tempCanvas = document.createElement('canvas');  
                    tempCanvas.width = canvas.width * resolution;  
                    tempCanvas.height = canvas.height * resolution;  
                      
                    const tempCtx = tempCanvas.getContext('2d');  
                    tempCtx.scale(resolution, resolution);  
                    tempCtx.drawImage(canvas, 0, 0);  
                      
                    const dataURL = tempCanvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`);  
                    const link = document.createElement('a');  
                    link.download = `fabric-design.${format}`;  
                    link.href = dataURL;  
                    link.click();  
                      
                    document.body.removeChild(modal);  
                });  
            });  
              
            // Help modal  
            document.getElementById('helpBtn').addEventListener('click', () => {  
                document.getElementById('helpModal').classList.remove('hidden');  
            });  
              
            document.getElementById('closeHelp').addEventListener('click', () => {  
                document.getElementById('helpModal').classList.add('hidden');  
            });  
              
            // Mobile panel toggle  
            document.getElementById('controlToggle').addEventListener('click', () => {  
                document.getElementById('controlPanel').classList.toggle('show');  
            });  
              
            document.getElementById('minimizeBtn').addEventListener('click', () => {  
                const controls = document.getElementById('controlPanel');  
                controls.classList.toggle('minimized');  
                  
                if (controls.classList.contains('minimized')) {  
                    controls.style.transform = 'translateX(-90%)';  
                    document.getElementById('minimizeBtn').textContent = '>';  
                } else {  
                    controls.style.transform = 'translateX(0)';  
                    document.getElementById('minimizeBtn').textContent = '_';  
                }  
            });  
              
            // Keyboard shortcuts  
            document.addEventListener('keydown', (e) => {  
                if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {  
                    // Undo  
                    document.getElementById('undoBtn').click();  
                } else if (e.key === 'c') {  
                    // Clear canvas  
                    clearCanvas();  
                } else if (e.key === 'r') {  
                    // Random color  
                    document.getElementById('randomColor').click();  
                } else if (e.key === 's') {  
                    // Save  
                    e.preventDefault();  
                    document.getElementById('saveBtn').click();  
                } else if (e.key === '[') {  
                    // Decrease brush size  
                    brushSize = Math.max(1, brushSize - 1);  
                    document.getElementById('brushSize').value = brushSize;  
                    document.getElementById('brushSizeValue').textContent = brushSize;  
                } else if (e.key === ']') {  
                    // Increase brush size  
                    brushSize = Math.min(50, brushSize + 1);  
                    document.getElementById('brushSize').value = brushSize;  
                    document.getElementById('brushSizeValue').textContent = brushSize;  
                } else if (e.key === ' ') {  
                    // Toggle control panel  
                    e.preventDefault();  
                    document.getElementById('controlPanel').classList.toggle('show');  
                }  
            });  
              
            // Initialize with a welcome animation  
            function initAnimation() {  
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';  
                ctx.fillRect(0, 0, canvas.width, canvas.height);  
                  
                const centerX = canvas.width / 2;  
                const centerY = canvas.height / 2;  
                  
                // Draw welcome pattern  
                const welcomeAnimation = setInterval(() => {  
                    const angle = Math.random() * Math.PI * 2;  
                    const distance = Math.random() * 300;  
                      
                    const x = centerX + Math.cos(angle) * distance;  
                    const y = centerY + Math.sin(angle) * distance;  
                      
                    brushColor = `hsl(${Math.random() * 270 + 240}, 70%, 60%)`;  
                    brushSize = Math.random() * 8 + 2;  
                    opacity = Math.random() * 0.5 + 0.5;  
                      
                    draw(x, y, centerX, centerY);  
                      
                    // Stop after a few seconds  
                    setTimeout(() => {  
                        clearInterval(welcomeAnimation);  
                    }, 2000);  
                }, 50);  
            }  
              
            // Start with welcome animation  
            initAnimation();  
        });  
    </script>  
</head>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'96019baa33633731',t:'MTc1MjY3MDA0Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></html>  
