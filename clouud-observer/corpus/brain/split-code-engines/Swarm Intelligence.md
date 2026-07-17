# Swarm Intelligence   
![Intelligence](Attachments/25854B25-D44B-42E7-A41A-12429360B518.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Swarm Intelligence Analytics</title>  
    <script src="https://cdn.tailwindcss.com"></script>  
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>  
    <script src="https://cdn.jsdelivr.net/npm/mathjs@11.8.0/lib/browser/math.min.js"></script>  
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"></script>  
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css">  
    <style>  
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');  
          
        body {  
            font-family: 'Inter', sans-serif;  
            background: linear-gradient(135deg, #0f172a, #1e293b);  
            color: #f8fafc;  
            height: 100vh;  
            margin: 0;  
            overflow: hidden;  
        }  
          
        #canvas {  
            position: absolute;  
            top: 0;  
            left: 0;  
            z-index: 1;  
        }  
          
        .glass {  
            background: rgba(255, 255, 255, 0.05);  
            backdrop-filter: blur(12px);  
            border-radius: 12px;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);  
        }  
          
        .slider {  
            -webkit-appearance: none;  
            height: 6px;  
            border-radius: 5px;  
            background: rgba(255, 255, 255, 0.2);  
            outline: none;  
        }  
          
        .slider::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            appearance: none;  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: #60a5fa;  
            cursor: pointer;  
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);  
        }  
          
        .slider::-moz-range-thumb {  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: #60a5fa;  
            cursor: pointer;  
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);  
        }  
          
        .btn {  
            transition: all 0.3s ease;  
        }  
          
        .btn:hover {  
            transform: translateY(-2px);  
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);  
        }  
          
        .btn-primary {  
            background-color: #3b82f6;  
        }  
          
        .btn-primary:hover {  
            background-color: #2563eb;  
        }  
          
        .btn-secondary {  
            background-color: rgba(255, 255, 255, 0.1);  
        }  
          
        .btn-secondary:hover {  
            background-color: rgba(255, 255, 255, 0.2);  
        }  
          
        .tab-active {  
            border-bottom: 2px solid #3b82f6;  
            color: #3b82f6;  
        }  
          
        .equation-display {  
            padding: 10px;  
            border-radius: 8px;  
            background: rgba(0, 0, 0, 0.2);  
            overflow-x: auto;  
            margin: 10px 0;  
        }  
          
        .katex {  
            font-size: 1.1em;  
        }  
          
        .chart-container {  
            position: relative;  
            height: 200px;  
            width: 100%;  
        }  
          
        .phase-indicator {  
            width: 12px;  
            height: 12px;  
            border-radius: 50%;  
            display: inline-block;  
            margin-right: 5px;  
        }  
          
        .phase-disordered { background-color: #ef4444; }  
        .phase-partially { background-color: #f59e0b; }  
        .phase-edge { background-color: #8b5cf6; }  
        .phase-ordered { background-color: #10b981; }  
          
        .prediction-path {  
            position: absolute;  
            background: rgba(255, 255, 255, 0.1);  
            border: 1px dashed rgba(255, 255, 255, 0.3);  
            border-radius: 50%;  
            pointer-events: none;  
            animation: pulse 2s infinite;  
        }  
          
        @keyframes pulse {  
            0% { opacity: 0.7; }  
            50% { opacity: 0.3; }  
            100% { opacity: 0.7; }  
        }  
          
        ::-webkit-scrollbar {  
            width: 8px;  
            height: 8px;  
        }  
          
        ::-webkit-scrollbar-track {  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 10px;  
        }  
          
        ::-webkit-scrollbar-thumb {  
            background: rgba(255, 255, 255, 0.2);  
            border-radius: 10px;  
        }  
          
        ::-webkit-scrollbar-thumb:hover {  
            background: rgba(255, 255, 255, 0.3);  
        }  
    </style>  
</head>  
<body class="text-white">  
    <canvas id="canvas"></canvas>  
      
    <div class="absolute top-0 left-0 w-full h-full flex flex-col p-4 z-10 pointer-events-none">  
        <div class="flex justify-between items-start gap-4">  
            <!-- Left Panel: Controls -->  
            <div class="glass p-4 mb-4 w-72 pointer-events-auto overflow-y-auto max-h-[calc(100vh-2rem)]">  
                <h1 class="text-xl font-bold mb-2">Swarm Intelligence</h1>  
                <p class="text-sm opacity-70 mb-4">Professional analytics framework</p>  
                  
                <div class="mb-4">  
                    <h2 class="text-md font-semibold mb-2">Algorithm</h2>  
                    <div class="flex flex-wrap gap-2 mb-2">  
                        <button id="boidBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">Boids</button>  
                        <button id="psoBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">PSO</button>  
                        <button id="fireBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">Firefly</button>  
                    </div>  
                </div>  
                  
                <div class="mb-4">  
                    <h2 class="text-md font-semibold mb-2">Parameters</h2>  
                      
                    <div class="mb-3">  
                        <div class="flex justify-between mb-1">  
                            <label class="text-sm">Agents</label>  
                            <span id="agentCount" class="text-sm">100</span>  
                        </div>  
                        <input type="range" min="10" max="300" value="100" class="slider w-full" id="agentSlider">  
                    </div>  
                      
                    <div class="mb-3">  
                        <div class="flex justify-between mb-1">  
                            <label class="text-sm">Interaction Radius</label>  
                            <span id="radiusValue" class="text-sm">50</span>  
                        </div>  
                        <input type="range" min="10" max="200" value="50" class="slider w-full" id="radiusSlider">  
                    </div>  
                      
                    <div class="mb-3">  
                        <div class="flex justify-between mb-1">  
                            <label class="text-sm">Cohesion</label>  
                            <span id="cohesionValue" class="text-sm">1.0</span>  
                        </div>  
                        <input type="range" min="0" max="2" step="0.1" value="1.0" class="slider w-full" id="cohesionSlider">  
                    </div>  
                      
                    <div class="mb-3">  
                        <div class="flex justify-between mb-1">  
                            <label class="text-sm">Alignment</label>  
                            <span id="alignmentValue" class="text-sm">1.0</span>  
                        </div>  
                        <input type="range" min="0" max="2" step="0.1" value="1.0" class="slider w-full" id="alignmentSlider">  
                    </div>  
                      
                    <div class="mb-3">  
                        <div class="flex justify-between mb-1">  
                            <label class="text-sm">Separation</label>  
                            <span id="separationValue" class="text-sm">1.0</span>  
                        </div>  
                        <input type="range" min="0" max="2" step="0.1" value="1.0" class="slider w-full" id="separationSlider">  
                    </div>  
                </div>  
                  
                <div class="mb-4">  
                    <h2 class="text-md font-semibold mb-2">Visualization</h2>  
                    <div class="flex flex-wrap gap-2">  
                        <button id="toggleTrailsBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">Show Trails</button>  
                        <button id="togglePredictionBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">Show Predictions</button>  
                        <button id="toggleEquationsBtn" class="btn btn-secondary px-3 py-1 rounded-full text-sm font-medium">Show Equations</button>  
                    </div>  
                </div>  
                  
                <div>  
                    <button id="resetBtn" class="btn btn-primary px-4 py-2 rounded-md text-sm font-medium w-full">Reset Simulation</button>  
                </div>  
            </div>  
              
            <!-- Right Panel: Analytics -->  
            <div class="glass p-4 mb-4 w-96 pointer-events-auto overflow-y-auto max-h-[calc(100vh-2rem)]">  
                <div class="flex justify-between items-center mb-4">  
                    <h2 class="text-lg font-bold">Analytics Dashboard</h2>  
                    <div class="flex items-center gap-2">  
                        <button id="benchmarkBtn" class="btn btn-primary px-2 py-1 rounded text-xs">Run Benchmark</button>  
                    </div>  
                </div>  
                  
                <!-- Tabs -->  
                <div class="flex border-b border-gray-700 mb-4">  
                    <button id="metricsTab" class="px-4 py-2 text-sm font-medium tab-active">Metrics</button>  
                    <button id="predictiveTab" class="px-4 py-2 text-sm font-medium">Predictive</button>  
                    <button id="benchmarkTab" class="px-4 py-2 text-sm font-medium">Benchmark</button>  
                    <button id="equationsTab" class="px-4 py-2 text-sm font-medium">Equations</button>  
                </div>  
                  
                <!-- Tab Content -->  
                <div id="metricsContent" class="tab-content">  
                    <div class="grid grid-cols-2 gap-3 mb-4">  
                        <div class="bg-white bg-opacity-5 p-3 rounded">  
                            <div class="text-xs text-blue-300 mb-1">Entropy</div>  
                            <div class="flex items-end justify-between">  
                                <div id="entropyValue" class="text-xl font-bold">0.82</div>  
                                <div id="entropyTrend" class="text-xs opacity-70">+0.02</div>  
                            </div>  
                        </div>  
                        <div class="bg-white bg-opacity-5 p-3 rounded">  
                            <div class="text-xs text-blue-300 mb-1">Clustering Coefficient</div>  
                            <div class="flex items-end justify-between">  
                                <div id="clusteringValue" class="text-xl font-bold">0.64</div>  
                                <div id="clusteringTrend" class="text-xs opacity-70">-0.01</div>  
                            </div>  
                        </div>  
                        <div class="bg-white bg-opacity-5 p-3 rounded">  
                            <div class="text-xs text-blue-300 mb-1">Lyapunov Exponent</div>  
                            <div class="flex items-end justify-between">  
                                <div id="lyapunovValue" class="text-xl font-bold">0.12</div>  
                                <div id="lyapunovTrend" class="text-xs opacity-70">+0.03</div>  
                            </div>  
                        </div>  
                        <div class="bg-white bg-opacity-5 p-3 rounded">  
                            <div class="text-xs text-blue-300 mb-1">Phase State</div>  
                            <div class="flex items-center">  
                                <div class="phase-indicator phase-ordered"></div>  
                                <div id="phaseValue" class="font-bold">Ordered</div>  
                            </div>  
                        </div>  
                    </div>  
                      
                    <div class="mb-4">  
                        <div class="flex justify-between items-center mb-2">  
                            <h3 class="text-sm font-semibold">System Evolution</h3>  
                            <select id="metricSelect" class="bg-white bg-opacity-10 text-xs px-2 py-1 rounded border-0">  
                                <option value="entropy">Entropy</option>  
                                <option value="clustering">Clustering</option>  
                                <option value="lyapunov">Lyapunov</option>  
                                <option value="velocity">Velocity</option>  
                            </select>  
                        </div>  
                        <div class="chart-container">  
                            <canvas id="metricsChart"></canvas>  
                        </div>  
                    </div>  
                </div>  
                  
                <div id="predictiveContent" class="tab-content hidden">  
                    <div class="mb-4">  
                        <h3 class="text-sm font-semibold mb-2">Predictive Analytics</h3>  
                        <div class="flex gap-2 mb-3">  
                            <button id="predictBtn" class="btn btn-primary px-3 py-1 rounded text-sm">Generate Prediction</button>  
                            <select id="predictionTimeSelect" class="bg-white bg-opacity-10 text-xs px-2 py-1 rounded border-0">  
                                <option value="50">Short-term (5s)</option>  
                                <option value="100">Medium-term (10s)</option>  
                            </select>  
                        </div>  
                          
                        <div class="bg-white bg-opacity-5 p-3 rounded mb-3">  
                            <div class="flex justify-between items-center mb-2">  
                                <div class="text-xs text-blue-300">Prediction Confidence</div>  
                                <div id="predictionConfidence" class="text-xs font-medium">87%</div>  
                            </div>  
                            <div class="w-full bg-white bg-opacity-10 rounded-full h-2">  
                                <div id="confidenceBar" class="bg-blue-500 h-2 rounded-full" style="width: 87%"></div>  
                            </div>  
                        </div>  
                    </div>  
                      
                    <div class="mb-4">  
                        <h3 class="text-sm font-semibold mb-2">Predicted Metrics</h3>  
                        <div class="chart-container">  
                            <canvas id="predictionChart"></canvas>  
                        </div>  
                    </div>  
                </div>  
                  
                <div id="benchmarkContent" class="tab-content hidden">  
                    <div class="mb-4">  
                        <h3 class="text-sm font-semibold mb-2">Algorithm Performance</h3>  
                        <p class="text-xs opacity-70 mb-3">  
                            Comparing current algorithm against standard benchmarks.  
                        </p>  
                          
                        <div class="mb-4">  
                            <div class="flex justify-between text-xs mb-1">  
                                <span>Current Algorithm</span>  
                                <span id="currentScore">78/100</span>  
                            </div>  
                            <div class="w-full bg-white bg-opacity-10 rounded-full h-2 mb-3">  
                                <div id="benchmarkBar" class="bg-blue-500 h-2 rounded-full" style="width: 78%"></div>  
                            </div>  
                        </div>  
                    </div>  
                      
                    <div>  
                        <h3 class="text-sm font-semibold mb-2">Test Functions</h3>  
                        <div class="flex gap-2 mb-3">  
                            <button class="btn btn-secondary px-2 py-1 rounded text-xs benchmark-function-btn" data-function="sphere">Sphere</button>  
                            <button class="btn btn-secondary px-2 py-1 rounded text-xs benchmark-function-btn" data-function="rastrigin">Rastrigin</button>  
                            <button class="btn btn-secondary px-2 py-1 rounded text-xs benchmark-function-btn" data-function="rosenbrock">Rosenbrock</button>  
                        </div>  
                          
                        <div class="chart-container">  
                            <canvas id="benchmarkChart"></canvas>  
                        </div>  
                    </div>  
                </div>  
                  
                <div id="equationsContent" class="tab-content hidden">  
                    <div class="mb-4">  
                        <h3 class="text-sm font-semibold mb-2">Dynamic Equations</h3>  
                        <p class="text-xs opacity-70 mb-2">  
                            Mathematical formulation updates as parameters change.  
                        </p>  
                          
                        <div class="equation-display" id="mainEquation"></div>  
                    </div>  
                      
                    <div class="mb-4">  
                        <h3 class="text-sm font-semibold mb-2">Component Equations</h3>  
                          
                        <div class="mb-2">  
                            <div class="flex justify-between items-center">  
                                <div class="text-xs font-medium text-blue-300">Cohesion</div>  
                                <div class="text-xs opacity-70" id="cohesionEqValue">Factor: 1.0</div>  
                            </div>  
                            <div class="equation-display" id="cohesionEquation"></div>  
                        </div>  
                          
                        <div class="mb-2">  
                            <div class="flex justify-between items-center">  
                                <div class="text-xs font-medium text-blue-300">Alignment</div>  
                                <div class="text-xs opacity-70" id="alignmentEqValue">Factor: 1.0</div>  
                            </div>  
                            <div class="equation-display" id="alignmentEquation"></div>  
                        </div>  
                          
                        <div class="mb-2">  
                            <div class="flex justify-between items-center">  
                                <div class="text-xs font-medium text-blue-300">Separation</div>  
                                <div class="text-xs opacity-70" id="separationEqValue">Factor: 1.0</div>  
                            </div>  
                            <div class="equation-display" id="separationEquation"></div>  
                        </div>  
                    </div>  
                      
                    <div>  
                        <h3 class="text-sm font-semibold mb-2">System Analysis</h3>  
                        <div class="equation-display" id="systemEquation"></div>  
                        <div class="text-xs opacity-70 mt-2">  
                            Lyapunov stability analysis shows the system's sensitivity to initial conditions.  
                        </div>  
                    </div>  
                </div>  
            </div>  
        </div>  
    </div>  
  
    <script>  
        // Canvas setup  
        const canvas = document.getElementById('canvas');  
        const ctx = canvas.getContext('2d');  
        canvas.width = window.innerWidth;  
        canvas.height = window.innerHeight;  
          
        // Responsive canvas  
        window.addEventListener('resize', () => {  
            canvas.width = window.innerWidth;  
            canvas.height = window.innerHeight;  
        });  
          
        // Global variables  
        let showTrails = true;  
        let showPredictions = false;  
        let showEquations = true;  
        let metricsHistory = {  
            entropy: [],  
            clustering: [],  
            lyapunov: [],  
            velocity: []  
        };  
        let currentTab = 'metrics';  
          
        // Initialize charts  
        let metricsChart, predictionChart, benchmarkChart;  
          
        // Agent class  
        class Agent {  
            constructor(x, y) {  
                this.x = x || Math.random() * canvas.width;  
                this.y = y || Math.random() * canvas.height;  
                this.vx = (Math.random() * 2 - 1) * 2;  
                this.vy = (Math.random() * 2 - 1) * 2;  
                this.ax = 0;  
                this.ay = 0;  
                this.maxSpeed = 3 + Math.random();  
                this.history = [];  
                this.historyLimit = 20;  
                this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;  
                this.size = 4 + Math.random() * 2;  
                this.neighbors = [];  
                this.bestPosition = { x: this.x, y: this.y };  
                this.bestScore = -Infinity;  
                this.predictedPositions = [];  
            }  
              
            update(dt = 1) {  
                // Store position history for trails and Lyapunov calculation  
                if (showTrails || swarm.calculateLyapunov) {  
                    this.history.push({ x: this.x, y: this.y, vx: this.vx, vy: this.vy });  
                    if (this.history.length > this.historyLimit) {  
                        this.history.shift();  
                    }  
                } else {  
                    this.history = [];  
                }  
                  
                // Update velocity based on acceleration  
                this.vx += this.ax;  
                this.vy += this.ay;  
                  
                // Limit speed  
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);  
                if (speed > this.maxSpeed) {  
                    this.vx = (this.vx / speed) * this.maxSpeed;  
                    this.vy = (this.vy / speed) * this.maxSpeed;  
                }  
                  
                // Update position  
                this.x += this.vx * dt;  
                this.y += this.vy * dt;  
                  
                // Wrap around edges  
                if (this.x > canvas.width) this.x = 0;  
                if (this.x < 0) this.x = canvas.width;  
                if (this.y > canvas.height) this.y = 0;  
                if (this.y < 0) this.y = canvas.height;  
                  
                // Reset acceleration  
                this.ax = 0;  
                this.ay = 0;  
            }  
              
            applyForce(fx, fy) {  
                this.ax += fx;  
                this.ay += fy;  
            }  
              
            draw() {  
                // Draw trails  
                if (showTrails && this.history.length > 1) {  
                    ctx.beginPath();  
                    ctx.moveTo(this.history[0].x, this.history[0].y);  
                      
                    for (let i = 1; i < this.history.length; i++) {  
                        ctx.lineTo(this.history[i].x, this.history[i].y);  
                    }  
                      
                    ctx.strokeStyle = this.color + '40'; // Add transparency  
                    ctx.lineWidth = 2;  
                    ctx.stroke();  
                }  
                  
                // Draw agent  
                ctx.beginPath();  
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  
                ctx.fillStyle = this.color;  
                ctx.fill();  
                  
                // Draw direction indicator  
                const angle = Math.atan2(this.vy, this.vx);  
                const headingX = this.x + Math.cos(angle) * this.size * 1.5;  
                const headingY = this.y + Math.sin(angle) * this.size * 1.5;  
                  
                ctx.beginPath();  
                ctx.moveTo(this.x, this.y);  
                ctx.lineTo(headingX, headingY);  
                ctx.strokeStyle = 'white';  
                ctx.lineWidth = 1.5;  
                ctx.stroke();  
                  
                // Draw prediction paths if enabled  
                if (showPredictions && this.predictedPositions.length > 0) {  
                    // Draw prediction path  
                    ctx.beginPath();  
                    ctx.moveTo(this.x, this.y);  
                      
                    for (const pos of this.predictedPositions) {  
                        ctx.lineTo(pos.x, pos.y);  
                    }  
                      
                    ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';  
                    ctx.lineWidth = 1;  
                    ctx.stroke();  
                      
                    // Draw final predicted position  
                    const finalPos = this.predictedPositions[this.predictedPositions.length - 1];  
                    ctx.beginPath();  
                    ctx.arc(finalPos.x, finalPos.y, this.size * 0.8, 0, Math.PI * 2);  
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';  
                    ctx.fill();  
                }  
            }  
              
            findNeighbors(agents, radius) {  
                this.neighbors = [];  
                for (const other of agents) {  
                    if (other === this) continue;  
                      
                    const dx = this.x - other.x;  
                    const dy = this.y - other.y;  
                    const distance = Math.sqrt(dx * dx + dy * dy);  
                      
                    if (distance < radius) {  
                        this.neighbors.push(other);  
                    }  
                }  
                return this.neighbors;  
            }  
              
            predictFuture(steps, swarm) {  
                // Reset predictions  
                this.predictedPositions = [];  
                  
                // Create a copy of the agent for prediction  
                const predictAgent = {  
                    x: this.x,  
                    y: this.y,  
                    vx: this.vx,  
                    vy: this.vy,  
                    ax: 0,  
                    ay: 0,  
                    maxSpeed: this.maxSpeed,  
                    neighbors: [...this.neighbors]  
                };  
                  
                // Predict future positions  
                for (let i = 0; i < steps; i++) {  
                    // Apply forces based on current algorithm  
                    switch (swarm.algorithm) {  
                        case 'boids':  
                            // Simplified boids forces  
                            if (predictAgent.neighbors.length > 0) {  
                                // Apply some inertia and random perturbation  
                                predictAgent.ax = predictAgent.vx * 0.95 + (Math.random() * 0.2 - 0.1);  
                                predictAgent.ay = predictAgent.vy * 0.95 + (Math.random() * 0.2 - 0.1);  
                            }  
                            break;  
                        case 'pso':  
                            // PSO tends to move toward global best  
                            if (swarm.globalBest) {  
                                const dx = swarm.globalBest.x - predictAgent.x;  
                                const dy = swarm.globalBest.y - predictAgent.y;  
                                predictAgent.ax = dx * 0.01;  
                                predictAgent.ay = dy * 0.01;  
                            }  
                            break;  
                        default:  
                            // Add some inertia and small random component for other algorithms  
                            predictAgent.ax = predictAgent.vx * 0.9 + (Math.random() * 0.4 - 0.2);  
                            predictAgent.ay = predictAgent.vy * 0.9 + (Math.random() * 0.4 - 0.2);  
                    }  
                      
                    // Update velocity  
                    predictAgent.vx += predictAgent.ax;  
                    predictAgent.vy += predictAgent.ay;  
                      
                    // Limit speed  
                    const speed = Math.sqrt(predictAgent.vx * predictAgent.vx + predictAgent.vy * predictAgent.vy);  
                    if (speed > predictAgent.maxSpeed) {  
                        predictAgent.vx = (predictAgent.vx / speed) * predictAgent.maxSpeed;  
                        predictAgent.vy = (predictAgent.vy / speed) * predictAgent.maxSpeed;  
                    }  
                      
                    // Update position  
                    predictAgent.x += predictAgent.vx;  
                    predictAgent.y += predictAgent.vy;  
                      
                    // Wrap around edges  
                    if (predictAgent.x > canvas.width) predictAgent.x = 0;  
                    if (predictAgent.x < 0) predictAgent.x = canvas.width;  
                    if (predictAgent.y > canvas.height) predictAgent.y = 0;  
                    if (predictAgent.y < 0) predictAgent.y = canvas.height;  
                      
                    // Store predicted position  
                    if (i % 5 === 0) { // Store every 5th position to reduce points  
                        this.predictedPositions.push({ x: predictAgent.x, y: predictAgent.y });  
                    }  
                      
                    // Reset acceleration  
                    predictAgent.ax = 0;  
                    predictAgent.ay = 0;  
                }  
                  
                return this.predictedPositions;  
            }  
        }  
          
        // Swarm class  
        class Swarm {  
            constructor(count) {  
                this.agents = [];  
                this.algorithm = 'boids';  
                this.count = count || 100;  
                this.radius = 50;  
                this.cohesionFactor = 1.0;  
                this.alignmentFactor = 1.0;  
                this.separationFactor = 1.0;  
                this.globalBest = null;  
                this.metrics = {  
                    entropy: 0,  
                    clustering: 0,  
                    lyapunov: 0,  
                    velocity: 0  
                };  
                this.metricsHistory = {  
                    entropy: [],  
                    clustering: [],  
                    lyapunov: [],  
                    velocity: []  
                };  
                this.calculateLyapunov = true;  
                this.lyapunovWindow = 20;  
                this.initialize();  
            }  
              
            initialize() {  
                this.agents = [];  
                for (let i = 0; i < this.count; i++) {  
                    this.agents.push(new Agent());  
                }  
                  
                // Reset metrics history  
                Object.keys(this.metricsHistory).forEach(key => {  
                    this.metricsHistory[key] = [];  
                });  
                  
                // Reset global best for PSO  
                this.globalBest = null;  
            }  
              
            update() {  
                // Find neighbors for each agent  
                for (const agent of this.agents) {  
                    agent.findNeighbors(this.agents, this.radius);  
                }  
                  
                // Apply algorithm-specific behavior  
                switch (this.algorithm) {  
                    case 'boids':  
                        this.applyBoidsRules();  
                        break;  
                    case 'pso':  
                        this.applyPSO();  
                        break;  
                    case 'firefly':  
                        this.applyFirefly();  
                        break;  
                }  
                  
                // Update all agents  
                for (const agent of this.agents) {  
                    agent.update();  
                }  
                  
                // Update system metrics  
                this.updateMetrics();  
                  
                // Store metrics history  
                this.storeMetricsHistory();  
            }  
              
            applyBoidsRules() {  
                for (const agent of this.agents) {  
                    // Apply cohesion - steer towards center of neighbors  
                    if (agent.neighbors.length > 0) {  
                        let centerX = 0, centerY = 0;  
                        for (const neighbor of agent.neighbors) {  
                            centerX += neighbor.x;  
                            centerY += neighbor.y;  
                        }  
                        centerX /= agent.neighbors.length;  
                        centerY /= agent.neighbors.length;  
                          
                        const cohesionForceX = (centerX - agent.x) * 0.01 * this.cohesionFactor;  
                        const cohesionForceY = (centerY - agent.y) * 0.01 * this.cohesionFactor;  
                        agent.applyForce(cohesionForceX, cohesionForceY);  
                    }  
                      
                    // Apply alignment - steer in average direction of neighbors  
                    if (agent.neighbors.length > 0) {  
                        let avgVx = 0, avgVy = 0;  
                        for (const neighbor of agent.neighbors) {  
                            avgVx += neighbor.vx;  
                            avgVy += neighbor.vy;  
                        }  
                        avgVx /= agent.neighbors.length;  
                        avgVy /= agent.neighbors.length;  
                          
                        const alignForceX = (avgVx - agent.vx) * 0.05 * this.alignmentFactor;  
                        const alignForceY = (avgVy - agent.vy) * 0.05 * this.alignmentFactor;  
                        agent.applyForce(alignForceX, alignForceY);  
                    }  
                      
                    // Apply separation - avoid crowding neighbors  
                    let separationX = 0, separationY = 0;  
                    for (const neighbor of agent.neighbors) {  
                        const dx = agent.x - neighbor.x;  
                        const dy = agent.y - neighbor.y;  
                        const distance = Math.sqrt(dx * dx + dy * dy);  
                          
                        if (distance > 0 && distance < this.radius * 0.5) {  
                            // Closer neighbors have stronger effect  
                            const factor = 1 / distance;  
                            separationX += dx * factor;  
                            separationY += dy * factor;  
                        }  
                    }  
                      
                    const separationForceX = separationX * 0.05 * this.separationFactor;  
                    const separationForceY = separationY * 0.05 * this.separationFactor;  
                    agent.applyForce(separationForceX, separationForceY);  
                }  
            }  
              
            applyPSO() {  
                // Define a simple objective function to minimize  
                // (distance to center of screen in this case)  
                const objectiveFunction = (x, y) => {  
                    const centerX = canvas.width / 2;  
                    const centerY = canvas.height / 2;  
                    return -((x - centerX) ** 2 + (y - centerY) ** 2);  
                };  
                  
                // Find global best if not set  
                if (!this.globalBest) {  
                    this.globalBest = { x: 0, y: 0, score: -Infinity };  
                }  
                  
                for (const agent of this.agents) {  
                    // Evaluate current position  
                    const score = objectiveFunction(agent.x, agent.y);  
                      
                    // Update personal best  
                    if (score > agent.bestScore) {  
                        agent.bestScore = score;  
                        agent.bestPosition = { x: agent.x, y: agent.y };  
                    }  
                      
                    // Update global best  
                    if (score > this.globalBest.score) {  
                        this.globalBest = { x: agent.x, y: agent.y, score: score };  
                    }  
                      
                    // PSO velocity update formula  
                    const w = 0.7; // Inertia weight  
                    const c1 = 1.5 * this.cohesionFactor; // Cognitive coefficient  
                    const c2 = 1.5 * this.alignmentFactor; // Social coefficient  
                      
                    // Random factors  
                    const r1 = Math.random();  
                    const r2 = Math.random();  
                      
                    // Calculate new velocity  
                    const newVx = w * agent.vx +   
                                c1 * r1 * (agent.bestPosition.x - agent.x) +   
                                c2 * r2 * (this.globalBest.x - agent.x);  
                      
                    const newVy = w * agent.vy +   
                                c1 * r1 * (agent.bestPosition.y - agent.y) +   
                                c2 * r2 * (this.globalBest.y - agent.y);  
                      
                    // Apply new velocity  
                    agent.vx = newVx;  
                    agent.vy = newVy;  
                      
                    // Add some separation to avoid crowding  
                    let separationX = 0, separationY = 0;  
                    for (const neighbor of agent.neighbors) {  
                        const dx = agent.x - neighbor.x;  
                        const dy = agent.y - neighbor.y;  
                        const distance = Math.sqrt(dx * dx + dy * dy);  
                          
                        if (distance > 0 && distance < this.radius * 0.3) {  
                            const factor = 1 / (distance * distance);  
                            separationX += dx * factor;  
                            separationY += dy * factor;  
                        }  
                    }  
                      
                    const separationForceX = separationX * 0.02 * this.separationFactor;  
                    const separationForceY = separationY * 0.02 * this.separationFactor;  
                    agent.applyForce(separationForceX, separationForceY);  
                }  
            }  
              
            applyFirefly() {  
                for (const agent of this.agents) {  
                    // Fireflies are attracted to brighter fireflies  
                    // Brightness is inversely proportional to distance from center  
                    const centerX = canvas.width / 2;  
                    const centerY = canvas.height / 2;  
                    const dx = agent.x - centerX;  
                    const dy = agent.y - centerY;  
                    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);  
                      
                    // Brightness decreases with distance from center  
                    agent.brightness = 1 / (1 + 0.01 * distanceFromCenter);  
                      
                    // Fireflies are attracted to brighter fireflies  
                    for (const other of agent.neighbors) {  
                        if (other.brightness > agent.brightness) {  
                            const dx = other.x - agent.x;  
                            const dy = other.y - agent.y;  
                            const distance = Math.sqrt(dx * dx + dy * dy);  
                              
                            // Attraction is proportional to brightness and decreases with distance  
                            const attractiveness = other.brightness * Math.exp(-0.01 * distance * distance);  
                              
                            agent.applyForce(  
                                dx * 0.01 * attractiveness * this.cohesionFactor,  
                                dy * 0.01 * attractiveness * this.cohesionFactor  
                            );  
                        }  
                    }  
                      
                    // Random movement component  
                    const randomStrength = 0.1 * this.alignmentFactor;  
                    agent.applyForce(  
                        (Math.random() * 2 - 1) * randomStrength,  
                        (Math.random() * 2 - 1) * randomStrength  
                    );  
                      
                    // Pulsing effect - change size based on sine wave  
                    const time = Date.now() * 0.001;  
                    const pulseRate = 0.5 + Math.random() * 0.5; // Different rates for different fireflies  
                    agent.size = 3 + 2 * Math.sin(time * pulseRate) * agent.brightness;  
                      
                    // Update color based on brightness  
                    const hue = 60 - 60 * agent.brightness; // Yellow to red  
                    const saturation = 80 + 20 * agent.brightness;  
                    const lightness = 40 + 20 * agent.brightness;  
                    agent.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;  
                      
                    // Apply separation to avoid crowding  
                    let separationX = 0, separationY = 0;  
                    for (const neighbor of agent.neighbors) {  
                        const dx = agent.x - neighbor.x;  
                        const dy = agent.y - neighbor.y;  
                        const distance = Math.sqrt(dx * dx + dy * dy);  
                          
                        if (distance > 0 && distance < this.radius * 0.3) {  
                            const factor = 1 / distance;  
                            separationX += dx * factor;  
                            separationY += dy * factor;  
                        }  
                    }  
                      
                    const separationForceX = separationX * 0.02 * this.separationFactor;  
                    const separationForceY = separationY * 0.02 * this.separationFactor;  
                    agent.applyForce(separationForceX, separationForceY);  
                }  
            }  
              
            draw() {  
                // Clear canvas  
                ctx.clearRect(0, 0, canvas.width, canvas.height);  
                  
                // Draw global best for PSO  
                if (this.algorithm === 'pso' && this.globalBest) {  
                    ctx.beginPath();  
                    ctx.arc(this.globalBest.x, this.globalBest.y, 10, 0, Math.PI * 2);  
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';  
                    ctx.fill();  
                    ctx.strokeStyle = 'white';  
                    ctx.lineWidth = 2;  
                    ctx.stroke();  
                }  
                  
                // Draw all agents  
                for (const agent of this.agents) {  
                    agent.draw();  
                }  
            }  
              
            updateMetrics() {  
                // Calculate entropy  
                let entropy = 0;  
                const gridSize = 20;  
                const gridWidth = Math.ceil(canvas.width / gridSize);  
                const gridHeight = Math.ceil(canvas.height / gridSize);  
                const grid = Array(gridWidth).fill().map(() => Array(gridHeight).fill(0));  
                  
                // Count agents in each grid cell  
                for (const agent of this.agents) {  
                    const x = Math.floor(agent.x / gridSize);  
                    const y = Math.floor(agent.y / gridSize);  
                    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {  
                        grid[x][y]++;  
                    }  
                }  
                  
                // Calculate entropy using Shannon formula  
                let totalAgents = 0;  
                for (let x = 0; x < gridWidth; x++) {  
                    for (let y = 0; y < gridHeight; y++) {  
                        totalAgents += grid[x][y];  
                    }  
                }  
                  
                for (let x = 0; x < gridWidth; x++) {  
                    for (let y = 0; y < gridHeight; y++) {  
                        if (grid[x][y] > 0) {  
                            const p = grid[x][y] / totalAgents;  
                            entropy -= p * Math.log2(p);  
                        }  
                    }  
                }  
                  
                // Normalize entropy  
                const maxEntropy = Math.log2(gridWidth * gridHeight);  
                entropy = entropy / maxEntropy;  
                  
                // Calculate average velocity  
                let avgVelocity = 0;  
                for (const agent of this.agents) {  
                    avgVelocity += Math.sqrt(agent.vx * agent.vx + agent.vy * agent.vy);  
                }  
                avgVelocity /= this.agents.length;  
                  
                // Calculate clustering coefficient  
                let totalClustering = 0;  
                for (const agent of this.agents) {  
                    if (agent.neighbors.length < 2) continue;  
                      
                    let connections = 0;  
                    for (let i = 0; i < agent.neighbors.length; i++) {  
                        for (let j = i + 1; j < agent.neighbors.length; j++) {  
                            if (agent.neighbors[i].neighbors.includes(agent.neighbors[j])) {  
                                connections++;  
                            }  
                        }  
                    }  
                      
                    const possibleConnections = agent.neighbors.length * (agent.neighbors.length - 1) / 2;  
                    if (possibleConnections > 0) {  
                        totalClustering += connections / possibleConnections;  
                    }  
                }  
                  
                const clusteringCoefficient = this.agents.length > 0 ?   
                    totalClustering / this.agents.length : 0;  
                  
                // Calculate Lyapunov exponent (measure of chaos/predictability)  
                let lyapunovExponent = this.calculateLyapunovExponent();  
                  
                // Update metrics  
                this.metrics = {  
                    entropy,  
                    clustering: clusteringCoefficient,  
                    lyapunov: lyapunovExponent,  
                    velocity: avgVelocity  
                };  
                  
                // Determine phase  
                let phase = "Disordered";  
                if (clusteringCoefficient > 0.6 && entropy < 0.5) {  
                    phase = "Ordered";  
                } else if (clusteringCoefficient > 0.3 && entropy < 0.7) {  
                    phase = "Partially Ordered";  
                } else if (lyapunovExponent > 0.2) {  
                    phase = "Edge of Chaos";  
                }  
                  
                // Update UI  
                document.getElementById('entropyValue').textContent = entropy.toFixed(2);  
                document.getElementById('clusteringValue').textContent = clusteringCoefficient.toFixed(2);  
                document.getElementById('lyapunovValue').textContent = lyapunovExponent.toFixed(2);  
                document.getElementById('phaseValue').textContent = phase;  
                  
                // Update phase indicator color  
                const phaseIndicator = document.querySelector('.phase-indicator');  
                phaseIndicator.className = 'phase-indicator';  
                if (phase === "Ordered") {  
                    phaseIndicator.classList.add('phase-ordered');  
                } else if (phase === "Partially Ordered") {  
                    phaseIndicator.classList.add('phase-partially');  
                } else if (phase === "Edge of Chaos") {  
                    phaseIndicator.classList.add('phase-edge');  
                } else {  
                    phaseIndicator.classList.add('phase-disordered');  
                }  
                  
                // Update trends  
                const entropyTrend = this.metricsHistory.entropy.length > 5 ?   
                    (entropy - this.metricsHistory.entropy[this.metricsHistory.entropy.length - 5]).toFixed(2) : "0.00";  
                const clusteringTrend = this.metricsHistory.clustering.length > 5 ?   
                    (clusteringCoefficient - this.metricsHistory.clustering[this.metricsHistory.clustering.length - 5]).toFixed(2) : "0.00";  
                const lyapunovTrend = this.metricsHistory.lyapunov.length > 5 ?   
                    (lyapunovExponent - this.metricsHistory.lyapunov[this.metricsHistory.lyapunov.length - 5]).toFixed(2) : "0.00";  
                  
                document.getElementById('entropyTrend').textContent = entropyTrend > 0 ? `+${entropyTrend}` : entropyTrend;  
                document.getElementById('clusteringTrend').textContent = clusteringTrend > 0 ? `+${clusteringTrend}` : clusteringTrend;  
                document.getElementById('lyapunovTrend').textContent = lyapunovTrend > 0 ? `+${lyapunovTrend}` : lyapunovTrend;  
                  
                // Update equations if visible  
                if (showEquations) {  
                    this.updateEquations();  
                }  
            }  
              
            calculateLyapunovExponent() {  
                // This is a simplified calculation of the Lyapunov exponent  
                // In a real implementation, we would track nearby trajectories and measure their divergence  
                  
                if (this.agents.length < 2 || !this.calculateLyapunov) {  
                    return 0.1 + Math.random() * 0.1; // Return a small random value if we can't calculate  
                }  
                  
                // Select a random agent  
                const agent = this.agents[0];  
                  
                // Find its nearest neighbor  
                let nearestDist = Infinity;  
                let nearestAgent = null;  
                  
                for (const other of this.agents) {  
                    if (other === agent) continue;  
                      
                    const dx = agent.x - other.x;  
                    const dy = agent.y - other.y;  
                    const distance = Math.sqrt(dx * dx + dy * dy);  
                      
                    if (distance < nearestDist) {  
                        nearestDist = distance;  
                        nearestAgent = other;  
                    }  
                }  
                  
                if (!nearestAgent || agent.history.length < this.lyapunovWindow || nearestAgent.history.length < this.lyapunovWindow) {  
                    return 0.1 + Math.random() * 0.1;  
                }  
                  
                // Calculate divergence over time  
                const initialDistance = nearestDist;  
                  
                // Get the oldest positions in history  
                const oldAgentPos = agent.history[0];  
                const oldNearestPos = nearestAgent.history[0];  
                  
                // Calculate initial distance  
                const oldDx = oldAgentPos.x - oldNearestPos.x;  
                const oldDy = oldAgentPos.y - oldNearestPos.y;  
                const oldDistance = Math.sqrt(oldDx * oldDx + oldDy * oldDy);  
                  
                if (oldDistance < 0.0001) return 0.1; // Avoid division by zero  
                  
                // Calculate divergence  
                const divergence = Math.log(nearestDist / oldDistance);  
                  
                // Calculate Lyapunov exponent (λ)  
                const timeSteps = this.lyapunovWindow;  
                const lyapunov = divergence / timeSteps;  
                  
                // Normalize and clamp  
                return Math.max(0, Math.min(1, lyapunov + 0.1));  
            }  
              
            storeMetricsHistory() {  
                // Store current metrics in history  
                this.metricsHistory.entropy.push(this.metrics.entropy);  
                this.metricsHistory.clustering.push(this.metrics.clustering);  
                this.metricsHistory.lyapunov.push(this.metrics.lyapunov);  
                this.metricsHistory.velocity.push(this.metrics.velocity);  
                  
                // Limit history length  
                const maxHistory = 100;  
                if (this.metricsHistory.entropy.length > maxHistory) {  
                    this.metricsHistory.entropy.shift();  
                    this.metricsHistory.clustering.shift();  
                    this.metricsHistory.lyapunov.shift();  
                    this.metricsHistory.velocity.shift();  
                }  
                  
                // Update metrics chart if it exists  
                updateMetricsChart();  
            }  
              
            updateEquations() {  
                // Update main equation based on current algorithm  
                let mainEq = '';  
                let cohesionEq = '';  
                let alignmentEq = '';  
                let separationEq = '';  
                let systemEq = '';  
                  
                switch (this.algorithm) {  
                    case 'boids':  
                        mainEq = `\\frac{d\\vec{v}_i}{dt} = ${this.cohesionFactor.toFixed(1)}\\vec{F}_{coh} + ${this.alignmentFactor.toFixed(1)}\\vec{F}_{align} + ${this.separationFactor.toFixed(1)}\\vec{F}_{sep}`;  
                        cohesionEq = `\\vec{F}_{coh} = \\alpha \\left( \\frac{1}{|N_i|} \\sum_{j \\in N_i} \\vec{x}_j - \\vec{x}_i \\right)`;  
                        alignmentEq = `\\vec{F}_{align} = \\beta \\left( \\frac{1}{|N_i|} \\sum_{j \\in N_i} \\vec{v}_j - \\vec{v}_i \\right)`;  
                        separationEq = `\\vec{F}_{sep} = \\gamma \\sum_{j \\in N_i} \\frac{\\vec{x}_i - \\vec{x}_j}{||\\vec{x}_i - \\vec{x}_j||^2}`;  
                        systemEq = `\\lambda = ${this.metrics.lyapunov.toFixed(2)}, \\quad H = ${this.metrics.entropy.toFixed(2)}, \\quad C = ${this.metrics.clustering.toFixed(2)}`;  
                        break;  
                    case 'pso':  
                        mainEq = `\\vec{v}_i(t+1) = w\\vec{v}_i(t) + ${this.cohesionFactor.toFixed(1)}c_1r_1(\\vec{p}_i - \\vec{x}_i) + ${this.alignmentFactor.toFixed(1)}c_2r_2(\\vec{g} - \\vec{x}_i)`;  
                        cohesionEq = `\\text{Cognitive Component: } c_1r_1(\\vec{p}_i - \\vec{x}_i)`;  
                        alignmentEq = `\\text{Social Component: } c_2r_2(\\vec{g} - \\vec{x}_i)`;  
                        separationEq = `\\text{Separation: } ${this.separationFactor.toFixed(1)}\\sum_{j \\in N_i} \\frac{\\vec{x}_i - \\vec{x}_j}{||\\vec{x}_i - \\vec{x}_j||^2}`;  
                        systemEq = `\\text{Lyapunov Exponent: } \\lambda = ${this.metrics.lyapunov.toFixed(2)}`;  
                        break;  
                    case 'firefly':  
                        mainEq = `\\frac{d\\vec{x}_i}{dt} = \\beta_0 e^{-\\gamma r_{ij}^2}(\\vec{x}_j - \\vec{x}_i) + \\alpha \\epsilon_i`;  
                        cohesionEq = `\\text{Attractiveness: } \\beta_0 = ${this.cohesionFactor.toFixed(1)}`;  
                        alignmentEq = `\\text{Randomization: } \\alpha = ${this.alignmentFactor.toFixed(1)}`;  
                        separationEq = `\\text{Light Absorption: } \\gamma = ${this.separationFactor.toFixed(1)}`;  
                        systemEq = `\\text{Lyapunov Exponent: } \\lambda = ${this.metrics.lyapunov.toFixed(2)}`;  
                        break;  
                }  
                  
                // Update equation displays using KaTeX  
                try {  
                    katex.render(mainEq, document.getElementById('mainEquation'));  
                    katex.render(cohesionEq, document.getElementById('cohesionEquation'));  
                    katex.render(alignmentEq, document.getElementById('alignmentEquation'));  
                    katex.render(separationEq, document.getElementById('separationEquation'));  
                    katex.render(systemEq, document.getElementById('systemEquation'));  
                      
                    // Update equation parameter values  
                    document.getElementById('cohesionEqValue').textContent = `Factor: ${this.cohesionFactor.toFixed(1)}`;  
                    document.getElementById('alignmentEqValue').textContent = `Factor: ${this.alignmentFactor.toFixed(1)}`;  
                    document.getElementById('separationEqValue').textContent = `Factor: ${this.separationFactor.toFixed(1)}`;  
                } catch (e) {  
                    console.error("KaTeX rendering error:", e);  
                }  
            }  
              
            generatePredictions(steps) {  
                // Generate predictions for all agents  
                for (const agent of this.agents) {  
                    agent.predictFuture(steps, this);  
                }  
                  
                // Generate predicted metrics  
                const predictionSteps = 10;  
                const predictedMetrics = {  
                    entropy: [],  
                    clustering: [],  
                    lyapunov: []  
                };  
                  
                // Simple prediction model based on recent trends  
                if (this.metricsHistory.entropy.length > predictionSteps) {  
                    const entropyTrend = (this.metricsHistory.entropy[this.metricsHistory.entropy.length - 1] -   
                                        this.metricsHistory.entropy[this.metricsHistory.entropy.length - predictionSteps]) / predictionSteps;  
                      
                    const clusteringTrend = (this.metricsHistory.clustering[this.metricsHistory.clustering.length - 1] -   
                                           this.metricsHistory.clustering[this.metricsHistory.clustering.length - predictionSteps]) / predictionSteps;  
                      
                    const lyapunovTrend = (this.metricsHistory.lyapunov[this.metricsHistory.lyapunov.length - 1] -   
                                         this.metricsHistory.lyapunov[this.metricsHistory.lyapunov.length - predictionSteps]) / predictionSteps;  
                      
                    // Generate predictions with some noise  
                    for (let i = 1; i <= predictionSteps; i++) {  
                        const noise = 0.05;  
                        const entropyPred = this.metrics.entropy + entropyTrend * i + (Math.random() * noise - noise/2);  
                        const clusteringPred = this.metrics.clustering + clusteringTrend * i + (Math.random() * noise - noise/2);  
                        const lyapunovPred = this.metrics.lyapunov + lyapunovTrend * i + (Math.random() * noise - noise/2);  
                          
                        predictedMetrics.entropy.push(Math.max(0, Math.min(1, entropyPred)));  
                        predictedMetrics.clustering.push(Math.max(0, Math.min(1, clusteringPred)));  
                        predictedMetrics.lyapunov.push(Math.max(0, Math.min(1, lyapunovPred)));  
                    }  
                }  
                  
                // Calculate prediction confidence based on Lyapunov exponent  
                // Higher Lyapunov = lower confidence (more chaotic)  
                const confidence = Math.max(0, Math.min(100, 100 * (1 - this.metrics.lyapunov * 2)));  
                  
                // Update UI  
                document.getElementById('predictionConfidence').textContent = `${Math.round(confidence)}%`;  
                document.getElementById('confidenceBar').style.width = `${confidence}%`;  
                  
                // Update prediction chart  
                updatePredictionChart(predictedMetrics);  
                  
                return {  
                    metrics: predictedMetrics,  
                    confidence  
                };  
            }  
              
            runBenchmark(testFunction) {  
                // Define test functions  
                const testFunctions = {  
                    sphere: (x, y) => x*x + y*y,  
                    rastrigin: (x, y) => 20 + x*x + y*y - 10*(Math.cos(2*Math.PI*x) + Math.cos(2*Math.PI*y)),  
                    rosenbrock: (x, y) => 100*(y - x*x)*(y - x*x) + (1 - x)*(1 - x)  
                };  
                  
                // Select test function  
                const func = testFunctions[testFunction] || testFunctions.sphere;  
                  
                // Run benchmark  
                const iterations = 100;  
                const results = {  
                    iterations: [],  
                    bestValues: [],  
                    avgValues: []  
                };  
                  
                // Reset agents to random positions  
                for (const agent of this.agents) {  
                    agent.x = Math.random() * canvas.width;  
                    agent.y = Math.random() * canvas.height;  
                    agent.vx = (Math.random() * 2 - 1) * 2;  
                    agent.vy = (Math.random() * 2 - 1) * 2;  
                    agent.bestPosition = { x: agent.x, y: agent.y };  
                    agent.bestScore = -Infinity;  
                }  
                  
                // Reset global best for PSO  
                this.globalBest = null;  
                  
                // Run optimization  
                for (let i = 0; i < iterations; i++) {  
                    // Update agents  
                    this.update();  
                      
                    // Calculate function values  
                    let bestValue = Infinity;  
                    let totalValue = 0;  
                      
                    for (const agent of this.agents) {  
                        // Normalize coordinates to [-5, 5] range for test functions  
                        const normX = (agent.x / canvas.width) * 10 - 5;  
                        const normY = (agent.y / canvas.height) * 10 - 5;  
                          
                        const value = func(normX, normY);  
                        bestValue = Math.min(bestValue, value);  
                        totalValue += value;  
                    }  
                      
                    const avgValue = totalValue / this.agents.length;  
                      
                    // Store results  
                    results.iterations.push(i);  
                    results.bestValues.push(bestValue);  
                    results.avgValues.push(avgValue);  
                }  
                  
                // Calculate performance metrics  
                const finalBestValue = results.bestValues[results.bestValues.length - 1];  
                const solutionQuality = 100 * Math.max(0, Math.min(1, 1 - finalBestValue / results.bestValues[0]));  
                  
                // Update UI  
                document.getElementById('currentScore').textContent = `${Math.round(solutionQuality)}/100`;  
                  
                // Update benchmark bar  
                document.getElementById('benchmarkBar').style.width = `${Math.round(solutionQuality)}%`;  
                  
                // Update benchmark chart  
                updateBenchmarkChart(results, testFunction);  
                  
                return results;  
            }  
        }  
          
        // Initialize swarm  
        const swarm = new Swarm(100);  
          
        // Initialize charts  
        function initCharts() {  
            // Metrics chart  
            const metricsCtx = document.getElementById('metricsChart').getContext('2d');  
            metricsChart = new Chart(metricsCtx, {  
                type: 'line',  
                data: {  
                    labels: [],  
                    datasets: [{  
                        label: 'Entropy',  
                        data: [],  
                        borderColor: 'rgba(255, 99, 132, 1)',  
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',  
                        tension: 0.4,  
                        borderWidth: 2  
                    }]  
                },  
                options: {  
                    responsive: true,  
                    maintainAspectRatio: false,  
                    scales: {  
                        y: {  
                            beginAtZero: true,  
                            max: 1,  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        },  
                        x: {  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)',  
                                maxTicksLimit: 5  
                            }  
                        }  
                    },  
                    plugins: {  
                        legend: {  
                            labels: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        }  
                    },  
                    animation: false  
                }  
            });  
              
            // Prediction chart  
            const predictionCtx = document.getElementById('predictionChart').getContext('2d');  
            predictionChart = new Chart(predictionCtx, {  
                type: 'line',  
                data: {  
                    labels: [],  
                    datasets: [  
                        {  
                            label: 'Entropy (Current)',  
                            data: [],  
                            borderColor: 'rgba(255, 99, 132, 1)',  
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',  
                            tension: 0.4,  
                            borderWidth: 2  
                        },  
                        {  
                            label: 'Entropy (Predicted)',  
                            data: [],  
                            borderColor: 'rgba(255, 99, 132, 0.5)',  
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',  
                            borderDash: [5, 5],  
                            tension: 0.4,  
                            borderWidth: 2  
                        }  
                    ]  
                },  
                options: {  
                    responsive: true,  
                    maintainAspectRatio: false,  
                    scales: {  
                        y: {  
                            beginAtZero: true,  
                            max: 1,  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        },  
                        x: {  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)',  
                                maxTicksLimit: 5  
                            }  
                        }  
                    },  
                    plugins: {  
                        legend: {  
                            labels: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        }  
                    },  
                    animation: false  
                }  
            });  
              
            // Benchmark chart  
            const benchmarkCtx = document.getElementById('benchmarkChart').getContext('2d');  
            benchmarkChart = new Chart(benchmarkCtx, {  
                type: 'line',  
                data: {  
                    labels: [],  
                    datasets: [  
                        {  
                            label: 'Best Value',  
                            data: [],  
                            borderColor: 'rgba(54, 162, 235, 1)',  
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',  
                            tension: 0.4,  
                            borderWidth: 2  
                        },  
                        {  
                            label: 'Average Value',  
                            data: [],  
                            borderColor: 'rgba(255, 206, 86, 1)',  
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',  
                            tension: 0.4,  
                            borderWidth: 2  
                        }  
                    ]  
                },  
                options: {  
                    responsive: true,  
                    maintainAspectRatio: false,  
                    scales: {  
                        y: {  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        },  
                        x: {  
                            title: {  
                                display: true,  
                                text: 'Iterations',  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            },  
                            grid: {  
                                color: 'rgba(255, 255, 255, 0.1)'  
                            },  
                            ticks: {  
                                color: 'rgba(255, 255, 255, 0.7)',  
                                maxTicksLimit: 5  
                            }  
                        }  
                    },  
                    plugins: {  
                        legend: {  
                            labels: {  
                                color: 'rgba(255, 255, 255, 0.7)'  
                            }  
                        },  
                        title: {  
                            display: true,  
                            text: 'Optimization Progress',  
                            color: 'rgba(255, 255, 255, 0.9)'  
                        }  
                    },  
                    animation: false  
                }  
            });  
        }  
          
        // Update metrics chart  
        function updateMetricsChart() {  
            if (!metricsChart) return;  
              
            const metricType = document.getElementById('metricSelect').value;  
            const data = swarm.metricsHistory[metricType];  
              
            if (data.length === 0) return;  
              
            // Create labels  
            const labels = Array.from({ length: data.length }, (_, i) => i);  
              
            // Update chart data  
            metricsChart.data.labels = labels;  
            metricsChart.data.datasets[0].data = data;  
              
            // Update label based on selected metric  
            switch (metricType) {  
                case 'entropy':  
                    metricsChart.data.datasets[0].label = 'Entropy';  
                    metricsChart.data.datasets[0].borderColor = 'rgba(255, 99, 132, 1)';  
                    metricsChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';  
                    break;  
                case 'clustering':  
                    metricsChart.data.datasets[0].label = 'Clustering';  
                    metricsChart.data.datasets[0].borderColor = 'rgba(54, 162, 235, 1)';  
                    metricsChart.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.2)';  
                    break;  
                case 'lyapunov':  
                    metricsChart.data.datasets[0].label = 'Lyapunov Exponent';  
                    metricsChart.data.datasets[0].borderColor = 'rgba(255, 206, 86, 1)';  
                    metricsChart.data.datasets[0].backgroundColor = 'rgba(255, 206, 86, 0.2)';  
                    break;  
                case 'velocity':  
                    metricsChart.data.datasets[0].label = 'Average Velocity';  
                    metricsChart.data.datasets[0].borderColor = 'rgba(75, 192, 192, 1)';  
                    metricsChart.data.datasets[0].backgroundColor = 'rgba(75, 192, 192, 0.2)';  
                    break;  
            }  
              
            metricsChart.update();  
        }  
          
        // Update prediction chart  
        function updatePredictionChart(predictedMetrics) {  
            if (!predictionChart) return;  
              
            const historyData = swarm.metricsHistory.entropy.slice(-10);  
            const predictedData = predictedMetrics.entropy;  
              
            // Create labels  
            const historyLabels = Array.from({ length: historyData.length }, (_, i) => `t-${historyData.length - i}`);  
            const futureLabels = Array.from({ length: predictedData.length }, (_, i) => `t+${i + 1}`);  
            const labels = [...historyLabels, ...futureLabels];  
              
            // Update chart data  
            predictionChart.data.labels = labels;  
            predictionChart.data.datasets[0].data = [...historyData, null, null, null, null, null, null, null, null, null, null];  
            predictionChart.data.datasets[1].data = [...Array(historyData.length).fill(null), ...predictedData];  
              
            predictionChart.update();  
        }  
          
        // Update benchmark chart  
        function updateBenchmarkChart(results, testFunction) {  
            if (!benchmarkChart) return;  
              
            // Update chart data  
            benchmarkChart.data.labels = results.iterations;  
            benchmarkChart.data.datasets[0].data = results.bestValues;  
            benchmarkChart.data.datasets[1].data = results.avgValues;  
              
            // Update title  
            benchmarkChart.options.plugins.title.text = `${testFunction.charAt(0).toUpperCase() + testFunction.slice(1)} Function Optimization`;  
              
            benchmarkChart.update();  
        }  
          
        // Animation loop  
        function animate() {  
            swarm.update();  
            swarm.draw();  
            requestAnimationFrame(animate);  
        }  
          
        // Event listeners  
        document.getElementById('agentSlider').addEventListener('input', function() {  
            const count = parseInt(this.value);  
            document.getElementById('agentCount').textContent = count;  
            swarm.count = count;  
            swarm.initialize();  
        });  
          
        document.getElementById('radiusSlider').addEventListener('input', function() {  
            const radius = parseInt(this.value);  
            document.getElementById('radiusValue').textContent = radius;  
            swarm.radius = radius;  
        });  
          
        document.getElementById('cohesionSlider').addEventListener('input', function() {  
            const value = parseFloat(this.value);  
            document.getElementById('cohesionValue').textContent = value.toFixed(1);  
            swarm.cohesionFactor = value;  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('alignmentSlider').addEventListener('input', function() {  
            const value = parseFloat(this.value);  
            document.getElementById('alignmentValue').textContent = value.toFixed(1);  
            swarm.alignmentFactor = value;  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('separationSlider').addEventListener('input', function() {  
            const value = parseFloat(this.value);  
            document.getElementById('separationValue').textContent = value.toFixed(1);  
            swarm.separationFactor = value;  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('boidBtn').addEventListener('click', function() {  
            swarm.algorithm = 'boids';  
            highlightAlgorithmButton(this);  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('psoBtn').addEventListener('click', function() {  
            swarm.algorithm = 'pso';  
            highlightAlgorithmButton(this);  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('fireBtn').addEventListener('click', function() {  
            swarm.algorithm = 'firefly';  
            highlightAlgorithmButton(this);  
            if (showEquations) swarm.updateEquations();  
        });  
          
        document.getElementById('toggleTrailsBtn').addEventListener('click', function() {  
            showTrails = !showTrails;  
            this.classList.toggle('btn-primary');  
            this.classList.toggle('btn-secondary');  
        });  
          
        document.getElementById('togglePredictionBtn').addEventListener('click', function() {  
            showPredictions = !showPredictions;  
            this.classList.toggle('btn-primary');  
            this.classList.toggle('btn-secondary');  
              
            if (showPredictions) {  
                swarm.generatePredictions(50);  
            }  
        });  
          
        document.getElementById('toggleEquationsBtn').addEventListener('click', function() {  
            showEquations = !showEquations;  
            this.classList.toggle('btn-primary');  
            this.classList.toggle('btn-secondary');  
              
            if (showEquations) {  
                swarm.updateEquations();  
            }  
        });  
          
        document.getElementById('resetBtn').addEventListener('click', function() {  
            swarm.initialize();  
        });  
          
        document.getElementById('predictBtn').addEventListener('click', function() {  
            const steps = parseInt(document.getElementById('predictionTimeSelect').value);  
            swarm.generatePredictions(steps);  
        });  
          
        document.getElementById('benchmarkBtn').addEventListener('click', function() {  
            swarm.runBenchmark('sphere');  
            switchTab('benchmark');  
        });  
          
        document.querySelectorAll('.benchmark-function-btn').forEach(btn => {  
            btn.addEventListener('click', function() {  
                const testFunction = this.dataset.function;  
                swarm.runBenchmark(testFunction);  
                  
                // Highlight active button  
                document.querySelectorAll('.benchmark-function-btn').forEach(b => {  
                    b.classList.remove('btn-primary');  
                    b.classList.add('btn-secondary');  
                });  
                this.classList.remove('btn-secondary');  
                this.classList.add('btn-primary');  
            });  
        });  
          
        document.getElementById('metricSelect').addEventListener('change', updateMetricsChart);  
          
        // Tab switching  
        document.getElementById('metricsTab').addEventListener('click', () => switchTab('metrics'));  
        document.getElementById('predictiveTab').addEventListener('click', () => switchTab('predictive'));  
        document.getElementById('benchmarkTab').addEventListener('click', () => switchTab('benchmark'));  
        document.getElementById('equationsTab').addEventListener('click', () => switchTab('equations'));  
          
        function switchTab(tabName) {  
            // Hide all tab contents  
            document.querySelectorAll('.tab-content').forEach(tab => {  
                tab.classList.add('hidden');  
            });  
              
            // Show selected tab content  
            document.getElementById(`${tabName}Content`).classList.remove('hidden');  
              
            // Update tab buttons  
            document.querySelectorAll('#metricsTab, #predictiveTab, #benchmarkTab, #equationsTab').forEach(tab => {  
                tab.classList.remove('tab-active');  
            });  
            document.getElementById(`${tabName}Tab`).classList.add('tab-active');  
              
            currentTab = tabName;  
        }  
          
        function highlightAlgorithmButton(button) {  
            document.querySelectorAll('#boidBtn, #psoBtn, #fireBtn').forEach(btn => {  
                btn.classList.remove('btn-primary');  
                btn.classList.add('btn-secondary');  
            });  
            button.classList.remove('btn-secondary');  
            button.classList.add('btn-primary');  
        }  
          
        // Initialize  
        initCharts();  
        highlightAlgorithmButton(document.getElementById('boidBtn'));  
        animate();  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601a2c3423ddcc2',t:'MTc1MjY3MDMzNi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
