# Conformal Mapping Laboratory: https://uuonmind.my.canva.site/conformal-map-z-n-with-mathematical-grid  
# ▼  
#   
# ![Pasted Graphic.png](Attachments/D0732519-E739-41A4-A94E-11044A7C36BD.png)  
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset="utf-8">  
    <title>Conformal Mapping Laboratory - Complete Toolbox | UUON Foundation</title>  
    <style>  
        body {  
            margin: 0;  
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);  
            font-family: 'Courier New', monospace;  
            overflow: hidden;  
        }  
          
        .controls {  
            position: fixed;  
            top: 20px;  
            left: 20px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 20px;  
            border-radius: 12px;  
            border: 2px solid #00ffff;  
            color: #00ffff;  
            z-index: 100;  
            font-size: 12px;  
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);  
            backdrop-filter: blur(10px);  
            max-height: 85vh;  
            overflow-y: auto;  
            width: 280px;  
        }  
          
        .function-selector {  
            margin-bottom: 20px;  
        }  
          
        .function-selector select {  
            width: 100%;  
            padding: 8px;  
            background: rgba(0, 255, 255, 0.1);  
            border: 1px solid #00ffff;  
            color: #00ffff;  
            border-radius: 4px;  
            font-family: inherit;  
            font-size: 12px;  
        }  
          
        .control-group {  
            margin-bottom: 15px;  
            padding: 10px;  
            background: rgba(0, 255, 255, 0.05);  
            border-radius: 6px;  
        }  
          
        .control-group.hidden {  
            display: none;  
        }  
          
        label {  
            display: block;  
            margin-bottom: 5px;  
            font-size: 11px;  
            font-weight: bold;  
        }  
          
        input[type="range"] {  
            width: 140px;  
            margin-right: 8px;  
            accent-color: #00ffff;  
        }  
          
        input[type="checkbox"] {  
            accent-color: #00ffff;  
            margin-right: 8px;  
        }  
          
        .value-display {  
            color: #ffffff;  
            background: rgba(0, 255, 255, 0.3);  
            padding: 2px 6px;  
            border-radius: 3px;  
            display: inline-block;  
            min-width: 40px;  
            text-align: center;  
            font-weight: bold;  
            font-size: 10px;  
        }  
          
        .math-info {  
            position: fixed;  
            top: 20px;  
            right: 20px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 20px;  
            border-radius: 12px;  
            border: 2px solid #00ffff;  
            color: #00ffff;  
            font-size: 11px;  
            max-width: 350px;  
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);  
            backdrop-filter: blur(10px);  
            max-height: 85vh;  
            overflow-y: auto;  
        }  
          
        .point-info {  
            position: fixed;  
            bottom: 20px;  
            right: 20px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 15px;  
            border-radius: 12px;  
            border: 2px solid #ffff00;  
            color: #ffff00;  
            font-size: 10px;  
            min-width: 280px;  
            box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);  
            backdrop-filter: blur(10px);  
        }  
          
        .legend {  
            position: fixed;  
            bottom: 20px;  
            left: 20px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 15px;  
            border-radius: 12px;  
            border: 2px solid #00ffff;  
            color: #00ffff;  
            font-size: 10px;  
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);  
            backdrop-filter: blur(10px);  
            max-width: 300px;  
        }  
  
        .collapsible-header {  
            cursor: pointer;  
            display: flex;  
            justify-content: space-between;  
            align-items: center;  
            padding: 5px 0;  
            border-bottom: 1px solid rgba(0, 255, 255, 0.3);  
            margin-bottom: 10px;  
        }  
  
        .collapsible-content {  
            transition: max-height 0.3s ease;  
            overflow: hidden;  
            max-height: 0;  
            margin: 0;  
            padding: 0;  
        }  
  
        .collapsible-content.expanded {  
            max-height: 500px;  
            margin-bottom: 10px;  
            padding-top: 10px;  
        }  
  
        .toggle-icon {  
            font-size: 12px;  
            transition: transform 0.3s ease;  
        }  
  
        .toggle-icon.expanded {  
            transform: rotate(180deg);  
        }  
  
        .copyright {  
            position: fixed;  
            bottom: 5px;  
            right: 5px;  
            background: rgba(0, 0, 0, 0.8);  
            padding: 5px 10px;  
            border-radius: 6px;  
            color: rgba(255, 255, 255, 0.6);  
            font-size: 9px;  
            font-family: 'Courier New', monospace;  
            border: 1px solid rgba(255, 255, 255, 0.2);  
        }  
  
        .info-panel {  
            position: fixed;  
            top: 50%;  
            left: 50%;  
            transform: translate(-50%, -50%);  
            background: rgba(0, 0, 0, 0.98);  
            padding: 30px;  
            border-radius: 15px;  
            border: 2px solid #00ffff;  
            color: #00ffff;  
            font-size: 12px;  
            max-width: 600px;  
            max-height: 80vh;  
            overflow-y: auto;  
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);  
            backdrop-filter: blur(15px);  
            z-index: 1000;  
            display: none;  
        }  
  
        .info-close {  
            position: absolute;  
            top: 10px;  
            right: 15px;  
            background: none;  
            border: none;  
            color: #ff4444;  
            font-size: 20px;  
            cursor: pointer;  
            font-weight: bold;  
        }  
  
        .info-btn {  
            background: rgba(0, 255, 255, 0.2);  
            border: 1px solid #00ffff;  
            color: #00ffff;  
            padding: 6px 12px;  
            border-radius: 4px;  
            cursor: pointer;  
            font-family: inherit;  
            font-size: 10px;  
            margin: 2px;  
            transition: all 0.3s ease;  
        }  
  
        .info-btn:hover {  
            background: rgba(0, 255, 255, 0.4);  
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);  
        }  
  
        .reset-btn, .preset-btn {  
            background: rgba(255, 0, 255, 0.2);  
            border: 1px solid #ff00ff;  
            color: #ff00ff;  
            padding: 6px 10px;  
            border-radius: 4px;  
            cursor: pointer;  
            font-family: inherit;  
            font-size: 10px;  
            margin: 2px;  
            transition: all 0.3s ease;  
        }  
  
        .reset-btn:hover, .preset-btn:hover {  
            background: rgba(255, 0, 255, 0.4);  
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);  
        }  
  
        .preset-buttons {  
            display: flex;  
            flex-wrap: wrap;  
            gap: 4px;  
            margin-top: 8px;  
        }  
  
        .function-description {  
            font-size: 10px;  
            color: #aaffaa;  
            margin-top: 5px;  
            line-height: 1.3;  
        }  
    </style>  
</head>  
<body>  
    <canvas id="canvas"></canvas>  
      
    <div class="controls">  
        <div class="function-selector">  
            <label>Conformal Map Type:</label>  
            <select id="functionType">  
                <option value="power">Power Maps: z^n</option>  
                <option value="mobius">Möbius: (az+b)/(cz+d)</option>  
                <option value="exponential">Exponential: e^z</option>  
                <option value="logarithm">Logarithm: log(z)</option>  
                <option value="sine">Sine: sin(z)</option>  
                <option value="cosine">Cosine: cos(z)</option>  
                <option value="tangent">Tangent: tan(z)</option>  
                <option value="inversion">Inversion: 1/z</option>  
                <option value="sqrt">Square Root: √z</option>  
                <option value="custom">Custom Composite</option>  
            </select>  
            <div class="function-description" id="functionDescription"></div>  
        </div>  
  
        <!-- Power Map Controls -->  
        <div class="control-group" id="powerControls">  
            <label>Power n:</label>  
            <input id="powerSlider" type="range" min="-3" max="5" step="0.1" value="2">  
            <span class="value-display" id="powerValue">2.0</span>  
        </div>  
  
        <!-- Möbius Transform Controls -->  
        <div class="control-group hidden" id="mobiusControls">  
            <label>Parameter a (real):</label>  
            <input id="mobiusA" type="range" min="-2" max="2" step="0.1" value="1">  
            <span class="value-display" id="mobiusAValue">1.0</span>  
              
            <label>Parameter b (real):</label>  
            <input id="mobiusB" type="range" min="-2" max="2" step="0.1" value="0">  
            <span class="value-display" id="mobiusBValue">0.0</span>  
              
            <label>Parameter c (real):</label>  
            <input id="mobiusC" type="range" min="-2" max="2" step="0.1" value="0">  
            <span class="value-display" id="mobiusCValue">0.0</span>  
              
            <label>Parameter d (real):</label>  
            <input id="mobiusD" type="range" min="-2" max="2" step="0.1" value="1">  
            <span class="value-display" id="mobiusDValue">1.0</span>  
  
            <div class="preset-buttons">  
                <button class="preset-btn" onclick="setMobiusPreset('identity')">Identity</button>  
                <button class="preset-btn" onclick="setMobiusPreset('inversion')">Inversion</button>  
                <button class="preset-btn" onclick="setMobiusPreset('rotation')">Rotation</button>  
                <button class="preset-btn" onclick="setMobiusPreset('translation')">Translation</button>  
            </div>  
        </div>  
  
        <!-- Exponential Controls -->  
        <div class="control-group hidden" id="exponentialControls">  
            <label>Scale Factor:</label>  
            <input id="expScale" type="range" min="0.1" max="2" step="0.1" value="1">  
            <span class="value-display" id="expScaleValue">1.0</span>  
              
            <label>Rotation (radians):</label>  
            <input id="expRotation" type="range" min="0" max="6.28" step="0.1" value="0">  
            <span class="value-display" id="expRotationValue">0.0</span>  
        </div>  
  
        <!-- Logarithm Controls -->  
        <div class="control-group hidden" id="logarithmControls">  
            <label>Branch Cut Angle:</label>  
            <input id="logBranch" type="range" min="-3.14" max="3.14" step="0.1" value="0">  
            <span class="value-display" id="logBranchValue">0.0</span>  
        </div>  
  
        <!-- Trigonometric Controls -->  
        <div class="control-group hidden" id="trigControls">  
            <label>Frequency:</label>  
            <input id="trigFreq" type="range" min="-10" max="10" step="0.1" value="1">  
            <span class="value-display" id="trigFreqValue">1.0</span>  
              
            <label>Phase Shift:</label>  
            <input id="trigPhase" type="range" min="-10" max="10" step="0.1" value="0">  
            <span class="value-display" id="trigPhaseValue">0.0</span>  
        </div>  
  
        <!-- Custom Composite Controls -->  
        <div class="control-group hidden" id="customControls">  
            <label>First Function:</label>  
            <select id="customFirst">  
                <option value="power">z^n</option>  
                <option value="exp">e^z</option>  
                <option value="log">log(z)</option>  
                <option value="sin">sin(z)</option>  
                <option value="inv">1/z</option>  
            </select>  
              
            <label>Second Function:</label>  
            <select id="customSecond">  
                <option value="none">None</option>  
                <option value="power">z^n</option>  
                <option value="exp">e^z</option>  
                <option value="log">log(z)</option>  
                <option value="sin">sin(z)</option>  
                <option value="inv">1/z</option>  
            </select>  
              
            <label>Composition Parameter:</label>  
            <input id="customParam" type="range" min="0.5" max="3" step="0.1" value="2">  
            <span class="value-display" id="customParamValue">2.0</span>  
        </div>  
  
        <!-- Universal Controls -->  
        <div class="control-group">  
            <label>Grid Density:</label>  
            <input id="scaleSlider" type="range" min="20" max="100" step="5" value="50">  
            <span class="value-display" id="scaleValue">50</span>  
              
            <label>Animation Speed:</label>  
            <input id="speedSlider" type="range" min="0" max="2" step="0.1" value="0">  
            <span class="value-display" id="speedValue">0.0</span>  
        </div>  
  
        <div class="control-group">  
            <label>  
                <input id="showLabels" type="checkbox" checked>  
                Coordinate Labels  
            </label>  
            <label>  
                <input id="showCircles" type="checkbox" checked>  
                Reference Circles  
            </label>  
            <label>  
                <input id="showPoles" type="checkbox" checked>  
                Singularities/Poles  
            </label>  
        </div>  
  
        <button class="reset-btn" onclick="resetView()">Reset All</button>  
        <button class="preset-btn" onclick="randomizeMapping()">🎲 Random Map</button>  
        <button class="info-btn" onclick="showInfoPanel()">ℹ️ About This Lab</button>  
    </div>  
      
    <div class="math-info">  
        <div class="collapsible-header" onclick="toggleCollapse('mathInfo')">  
            <strong>Conformal Mapping Laboratory</strong>  
            <span class="toggle-icon" id="mathInfoIcon">▲</span>  
        </div>  
        <div class="collapsible-content" id="mathInfoContent">  
            <span id="currentFunction">f(z) = z²</span><br><br>  
              
            <strong>Mathematical Form:</strong><br>  
            <span id="mathFormula">f(z) = z²</span><br><br>  
              
            <strong>Properties:</strong><br>  
            <span id="properties">• Conformal (angle-preserving)<br>• Maps circles through origin to cardioids</span><br><br>  
              
            <strong>Applications:</strong><br>  
            <span id="applications">• Fluid dynamics<br>• Electrostatics<br>• Signal processing</span><br><br>  
              
            <strong>Grid Legend:</strong><br>  
            <span style="color: #00ffff">━ Vertical: Re(z) = const</span><br>  
            <span style="color: #ffff00">━ Horizontal: Im(z) = const</span><br>  
            <span style="color: #ff00ff">━ Unit Circle: |z| = 1</span><br>  
            <span style="color: #ff8800">━ Reference Circles</span><br>  
            <span style="color: #ff4444">● Poles/Singularities</span>  
        </div>  
    </div>  
      
    <div class="point-info">  
        <div class="collapsible-header" onclick="toggleCollapse('pointInfo')">  
            <strong>Point Mapping Analysis</strong>  
            <span class="toggle-icon" id="pointInfoIcon">▲</span>  
        </div>  
        <div class="collapsible-content" id="pointInfoContent">  
            <div id="pointInfo">Move mouse over canvas to see transformations</div>  
        </div>  
    </div>  
      
    <div class="legend">  
        <div class="collapsible-header" onclick="toggleCollapse('legend')">  
            <strong>Complex Plane Visualization</strong>  
            <span class="toggle-icon" id="legendIcon">▲</span>  
        </div>  
        <div class="collapsible-content" id="legendContent">  
            • Origin at screen center<br>  
            • Real axis → horizontal<br>  
            • Imaginary axis ↑ vertical<br>  
            • Grid spacing = 0.5 units<br><br>  
              
            <strong>Current Mode:</strong><br>  
            <span id="currentMode">Power Mapping</span><br><br>  
              
            <strong>Key Features:</strong><br>  
            <span id="keyFeatures">• Angle preservation<br>• Holomorphic mapping<br>• Conformal at non-critical points</span>  
        </div>  
    </div>  
  
    <div class="copyright">  
        © 2025 UUON Foundation. All Rights Reserved.  
    </div>  
  
    <div class="info-panel" id="infoPanel">  
        <button class="info-close" onclick="hideInfoPanel()">×</button>  
        <h2 style="color: #00ffff; margin-top: 0;">🧮 Conformal Mapping Laboratory</h2>  
        <p><strong>UUON Foundation Research Initiative</strong></p>  
          
        <h3 style="color: #ffff00;">🔬 What This Application Represents</h3>  
        <p>This laboratory is a comprehensive visualization tool for <strong>conformal mappings</strong> - mathematical transformations that preserve angles locally. These mappings are fundamental to complex analysis and have profound applications across science, engineering, and emerging technologies.</p>  
          
        <h3 style="color: #ffff00;">🎯 Current Technology Applications</h3>  
        <ul>  
            <li><strong>Signal Processing:</strong> Möbius transforms in digital filters and communication systems</li>  
            <li><strong>Computer Graphics:</strong> Stereographic projections for 360° imaging and VR</li>  
            <li><strong>Fluid Dynamics:</strong> Modeling flow around obstacles using conformal maps</li>  
            <li><strong>Electromagnetism:</strong> Solving field problems through domain transformations</li>  
            <li><strong>Medical Imaging:</strong> Flattening curved surfaces (brain cortex, retinal mapping)</li>  
            <li><strong>Navigation Systems:</strong> Map projections and coordinate transformations</li>  
        </ul>  
          
        <h3 style="color: #ffff00;">🚀 Future Technology Implications</h3>  
        <ul>  
            <li><strong>Quantum Computing:</strong> Bloch sphere projections and quantum state visualization</li>  
            <li><strong>AI/Machine Learning:</strong> High-dimensional data embeddings and manifold learning</li>  
            <li><strong>Augmented Reality:</strong> Real-time geometric corrections and perspective warping</li>  
            <li><strong>Metamaterials:</strong> Designing materials with exotic electromagnetic properties</li>  
            <li><strong>Computational Biology:</strong> Protein folding analysis and molecular surface mapping</li>  
            <li><strong>Financial Modeling:</strong> Risk analysis through complex variable techniques</li>  
            <li><strong>Cryptography:</strong> Elliptic curve operations and secure transformations</li>  
        </ul>  
          
        <h3 style="color: #ffff00;">🧠 Educational Value</h3>  
        <p>This tool bridges the gap between abstract mathematical concepts and practical applications by:</p>  
        <ul>  
            <li>Visualizing how complex functions transform geometric shapes</li>  
            <li>Demonstrating angle preservation and conformal properties</li>  
            <li>Showing singularities, branch cuts, and multi-valued behavior</li>  
            <li>Connecting pure mathematics to real-world engineering problems</li>  
        </ul>  
          
        <h3 style="color: #ffff00;">⚡ Technical Innovation</h3>  
        <p>The laboratory implements:</p>  
        <ul>  
            <li><strong>Real-time computation</strong> of complex transformations</li>  
            <li><strong>Interactive parameter control</strong> with immediate visual feedback</li>  
            <li><strong>Comprehensive function library</strong> covering major conformal map families</li>  
            <li><strong>Jacobian analysis</strong> for understanding local scaling properties</li>  
            <li><strong>Singularity detection</strong> and branch cut visualization</li>  
        </ul>  
          
        <h3 style="color: #ffff00;">🌐 Research Applications</h3>  
        <p>This tool supports research in:</p>  
        <ul>  
            <li>Complex analysis and Riemann surface theory</li>  
            <li>Computational mathematics and numerical methods</li>  
            <li>Applied physics and engineering simulations</li>  
            <li>Data science and topological data analysis</li>  
            <li>Geometric deep learning and neural network architectures</li>  
        </ul>  
          
        <h3 style="color: #ffff00;">💻 Engine Code Snippet</h3>  
        <div style="background: rgba(0,0,0,0.8); padding: 15px; border-radius: 8px; border: 1px solid rgba(0,255,255,0.3); font-family: 'Courier New', monospace; font-size: 10px; color: #00ff00; overflow-x: auto;">  
<pre>// UUON Foundation Conformal Mapping Engine Core  
class ConformalMappingEngine {  
    constructor() {  
        this.transformationCache = new Map();  
        this.jacobianCache = new Map();  
    }  
      
    // Complex number arithmetic with high precision  
    complexMult(a, b) {  
        return {  
            x: a.x * b.x - a.y * b.y,  
            y: a.x * b.y + a.y * b.x  
        };  
    }  
      
    // Conformal transformation with singularity detection  
    applyTransformation(z, type, params) {  
        const key = `${z.x},${z.y},${type}`;  
        if (this.transformationCache.has(key)) {  
            return this.transformationCache.get(key);  
        }  
          
        let result = this.computeTransformation(z, type, params);  
        this.transformationCache.set(key, result);  
        return result;  
    }  
      
    // Real-time Jacobian computation for conformal analysis  
    calculateJacobian(x, y, transformFunc) {  
        const h = 1e-6; // High precision differential  
        const f0 = transformFunc(x, y);  
        const fx = transformFunc(x + h, y);  
        const fy = transformFunc(x, y + h);  
          
        return Math.abs((fx.x - f0.x) * (fy.y - f0.y) -   
                       (fx.y - f0.y) * (fy.x - f0.x)) / (h * h);  
    }  
}</pre>  
        </div>  
          
        <h3 style="color: #ff6666;">⚖️ Licensing & Usage Terms</h3>  
        <div style="background: rgba(255,100,100,0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,100,100,0.5); margin: 15px 0;">  
            <p><strong>🎓 EDUCATIONAL USE:</strong> This conformal mapping laboratory and its underlying engine are <strong>FREE</strong> for educational, academic, and personal learning purposes.</p>  
              
            <p><strong>🏢 COMMERCIAL USE:</strong> Commercial applications, products, or services utilizing this engine require a proper license. Unauthorized commercial use is prohibited.</p>  
              
            <p><strong>📧 LICENSING CONTACT:</strong><br>  
            • Primary: <a href="mailto:phi1@uuonfoundation.com" style="color: #00ffff;">phi1@uuonfoundation.com</a><br>  
            • Secondary: <a href="mailto:philruziii@icloud.com" style="color: #00ffff;">philruziii@icloud.com</a></p>  
              
            <p style="font-size: 10px; color: #ffaaaa; margin-top: 10px;">  
                <strong>Note:</strong> Educational institutions, students, researchers, and hobbyists are encouraged to use this tool freely for learning and non-commercial research. Commercial entities seeking to integrate this technology should contact us for licensing terms.  
            </p>  
        </div>  
          
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0,255,255,0.3); color: #aaffaa;">  
            <strong>About UUON Foundation:</strong><br>  
            The UUON Foundation is dedicated to advancing mathematical education and research through innovative visualization tools and interactive learning platforms. Our mission is to make complex mathematical concepts accessible and applicable to real-world challenges while supporting both educational freedom and sustainable development through appropriate licensing.  
        </p>  
    </div>  
  
    <script>  
        class ConformalMappingLab {  
            constructor() {  
                this.canvas = document.getElementById('canvas');  
                this.ctx = this.canvas.getContext('2d');  
                this.setupCanvas();  
                  
                // Current function parameters  
                this.functionType = 'power';  
                this.power = 2.0;  
                this.mobiusParams = { a: 1, b: 0, c: 0, d: 1 };  
                this.expParams = { scale: 1, rotation: 0 };  
                this.logParams = { branch: 0 };  
                this.trigParams = { freq: 1, phase: 0 };  
                this.customParams = { first: 'power', second: 'none', param: 2 };  
                  
                this.scale = 50;  
                this.animationSpeed = 0;  
                this.showLabels = true;  
                this.showCircles = true;  
                this.showPoles = true;  
                this.time = 0;  
                  
                this.setupEventListeners();  
                this.updateDisplay();  
                this.animate();  
            }  
              
            setupCanvas() {  
                this.canvas.width = window.innerWidth;  
                this.canvas.height = window.innerHeight;  
                this.centerX = this.canvas.width / 2;  
                this.centerY = this.canvas.height / 2;  
            }  
              
            setupEventListeners() {  
                // Function type selector  
                document.getElementById('functionType').addEventListener('change', (e) => {  
                    this.functionType = e.target.value;  
                    this.showRelevantControls();  
                    this.updateDisplay();  
                });  
                  
                // Power controls  
                document.getElementById('powerSlider').addEventListener('input', (e) => {  
                    this.power = parseFloat(e.target.value);  
                    document.getElementById('powerValue').textContent = this.power.toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                // Möbius controls  
                ['A', 'B', 'C', 'D'].forEach(param => {  
                    document.getElementById(`mobius${param}`).addEventListener('input', (e) => {  
                        this.mobiusParams[param.toLowerCase()] = parseFloat(e.target.value);  
                        document.getElementById(`mobius${param}Value`).textContent = parseFloat(e.target.value).toFixed(1);  
                        this.updateDisplay();  
                    });  
                });  
                  
                // Exponential controls  
                document.getElementById('expScale').addEventListener('input', (e) => {  
                    this.expParams.scale = parseFloat(e.target.value);  
                    document.getElementById('expScaleValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                document.getElementById('expRotation').addEventListener('input', (e) => {  
                    this.expParams.rotation = parseFloat(e.target.value);  
                    document.getElementById('expRotationValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                // Logarithm controls  
                document.getElementById('logBranch').addEventListener('input', (e) => {  
                    this.logParams.branch = parseFloat(e.target.value);  
                    document.getElementById('logBranchValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                // Trigonometric controls  
                document.getElementById('trigFreq').addEventListener('input', (e) => {  
                    this.trigParams.freq = parseFloat(e.target.value);  
                    document.getElementById('trigFreqValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                document.getElementById('trigPhase').addEventListener('input', (e) => {  
                    this.trigParams.phase = parseFloat(e.target.value);  
                    document.getElementById('trigPhaseValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                // Custom controls  
                document.getElementById('customFirst').addEventListener('change', (e) => {  
                    this.customParams.first = e.target.value;  
                    this.updateDisplay();  
                });  
                  
                document.getElementById('customSecond').addEventListener('change', (e) => {  
                    this.customParams.second = e.target.value;  
                    this.updateDisplay();  
                });  
                  
                document.getElementById('customParam').addEventListener('input', (e) => {  
                    this.customParams.param = parseFloat(e.target.value);  
                    document.getElementById('customParamValue').textContent = parseFloat(e.target.value).toFixed(1);  
                    this.updateDisplay();  
                });  
                  
                // Universal controls  
                document.getElementById('scaleSlider').addEventListener('input', (e) => {  
                    this.scale = parseInt(e.target.value);  
                    document.getElementById('scaleValue').textContent = this.scale;  
                });  
                  
                document.getElementById('speedSlider').addEventListener('input', (e) => {  
                    this.animationSpeed = parseFloat(e.target.value);  
                    document.getElementById('speedValue').textContent = this.animationSpeed.toFixed(1);  
                });  
                  
                document.getElementById('showLabels').addEventListener('change', (e) => {  
                    this.showLabels = e.target.checked;  
                });  
                  
                document.getElementById('showCircles').addEventListener('change', (e) => {  
                    this.showCircles = e.target.checked;  
                });  
                  
                document.getElementById('showPoles').addEventListener('change', (e) => {  
                    this.showPoles = e.target.checked;  
                });  
                  
                // Mouse tracking  
                this.canvas.addEventListener('mousemove', (e) => {  
                    this.updatePointInfo(e.clientX, e.clientY);  
                });  
                  
                // Window resize  
                window.addEventListener('resize', () => {  
                    this.setupCanvas();  
                });  
                  
                this.showRelevantControls();  
            }  
              
            showRelevantControls() {  
                // Hide all specific controls  
                ['powerControls', 'mobiusControls', 'exponentialControls', 'logarithmControls', 'trigControls', 'customControls'].forEach(id => {  
                    document.getElementById(id).classList.add('hidden');  
                });  
                  
                // Show relevant controls  
                switch(this.functionType) {  
                    case 'power':  
                    case 'sqrt':  
                        document.getElementById('powerControls').classList.remove('hidden');  
                        if (this.functionType === 'sqrt') {  
                            document.getElementById('powerSlider').value = 0.5;  
                            this.power = 0.5;  
                            document.getElementById('powerValue').textContent = '0.5';  
                        }  
                        break;  
                    case 'mobius':  
                        document.getElementById('mobiusControls').classList.remove('hidden');  
                        break;  
                    case 'exponential':  
                        document.getElementById('exponentialControls').classList.remove('hidden');  
                        break;  
                    case 'logarithm':  
                        document.getElementById('logarithmControls').classList.remove('hidden');  
                        break;  
                    case 'sine':  
                    case 'cosine':  
                    case 'tangent':  
                        document.getElementById('trigControls').classList.remove('hidden');  
                        break;  
                    case 'custom':  
                        document.getElementById('customControls').classList.remove('hidden');  
                        break;  
                }  
            }  
              
            // Complex number operations  
            complexAdd(a, b) {  
                return { x: a.x + b.x, y: a.y + b.y };  
            }  
              
            complexMult(a, b) {  
                return {  
                    x: a.x * b.x - a.y * b.y,  
                    y: a.x * b.y + a.y * b.x  
                };  
            }  
              
            complexDiv(a, b) {  
                const denom = b.x * b.x + b.y * b.y;  
                if (denom === 0) return { x: Infinity, y: Infinity };  
                return {  
                    x: (a.x * b.x + a.y * b.y) / denom,  
                    y: (a.y * b.x - a.x * b.y) / denom  
                };  
            }  
              
            complexPower(z, n) {  
                if (z.x === 0 && z.y === 0) return { x: 0, y: 0 };  
                  
                const r = Math.sqrt(z.x * z.x + z.y * z.y);  
                const theta = Math.atan2(z.y, z.x);  
                  
                const newR = Math.pow(r, n);  
                const newTheta = n * theta;  
                  
                return {  
                    x: newR * Math.cos(newTheta),  
                    y: newR * Math.sin(newTheta)  
                };  
            }  
              
            complexExp(z) {  
                const r = Math.exp(z.x);  
                return {  
                    x: r * Math.cos(z.y),  
                    y: r * Math.sin(z.y)  
                };  
            }  
              
            complexLog(z) {  
                if (z.x === 0 && z.y === 0) return { x: -Infinity, y: 0 };  
                  
                const r = Math.sqrt(z.x * z.x + z.y * z.y);  
                let theta = Math.atan2(z.y, z.x) + this.logParams.branch;  
                  
                return {  
                    x: Math.log(r),  
                    y: theta  
                };  
            }  
              
            complexSin(z) {  
                // sin(z) = (e^(iz) - e^(-iz)) / (2i)  
                const iz = { x: -z.y, y: z.x };  
                const minusIz = { x: z.y, y: -z.x };  
                  
                const exp1 = this.complexExp(iz);  
                const exp2 = this.complexExp(minusIz);  
                  
                const diff = { x: exp1.x - exp2.x, y: exp1.y - exp2.y };  
                return { x: diff.y / 2, y: -diff.x / 2 };  
            }  
              
            complexCos(z) {  
                // cos(z) = (e^(iz) + e^(-iz)) / 2  
                const iz = { x: -z.y, y: z.x };  
                const minusIz = { x: z.y, y: -z.x };  
                  
                const exp1 = this.complexExp(iz);  
                const exp2 = this.complexExp(minusIz);  
                  
                return { x: (exp1.x + exp2.x) / 2, y: (exp1.y + exp2.y) / 2 };  
            }  
              
            complexTan(z) {  
                const sinZ = this.complexSin(z);  
                const cosZ = this.complexCos(z);  
                return this.complexDiv(sinZ, cosZ);  
            }  
              
            applyTransformation(x, y) {  
                let z = { x, y };  
                  
                // Apply frequency and phase for trigonometric functions  
                if (['sine', 'cosine', 'tangent'].includes(this.functionType)) {  
                    z = {  
                        x: this.trigParams.freq * z.x,  
                        y: this.trigParams.freq * z.y  
                    };  
                    z = this.complexAdd(z, { x: this.trigParams.phase, y: 0 });  
                }  
                  
                switch(this.functionType) {  
                    case 'power':  
                        return this.complexPower(z, this.power);  
                          
                    case 'sqrt':  
                        return this.complexPower(z, 0.5);  
                          
                    case 'mobius':  
                        const { a, b, c, d } = this.mobiusParams;  
                        const num = this.complexAdd(  
                            this.complexMult({ x: a, y: 0 }, z),  
                            { x: b, y: 0 }  
                        );  
                        const den = this.complexAdd(  
                            this.complexMult({ x: c, y: 0 }, z),  
                            { x: d, y: 0 }  
                        );  
                        return this.complexDiv(num, den);  
                          
                    case 'exponential':  
                        const scaledZ = {  
                            x: this.expParams.scale * z.x,  
                            y: this.expParams.scale * z.y + this.expParams.rotation  
                        };  
                        return this.complexExp(scaledZ);  
                          
                    case 'logarithm':  
                        return this.complexLog(z);  
                          
                    case 'sine':  
                        return this.complexSin(z);  
                          
                    case 'cosine':  
                        return this.complexCos(z);  
                          
                    case 'tangent':  
                        return this.complexTan(z);  
                          
                    case 'inversion':  
                        return this.complexDiv({ x: 1, y: 0 }, z);  
                          
                    case 'custom':  
                        let result = z;  
                          
                        // Apply first function  
                        switch(this.customParams.first) {  
                            case 'power':  
                                result = this.complexPower(result, this.customParams.param);  
                                break;  
                            case 'exp':  
                                result = this.complexExp(result);  
                                break;  
                            case 'log':  
                                result = this.complexLog(result);  
                                break;  
                            case 'sin':  
                                result = this.complexSin(result);  
                                break;  
                            case 'inv':  
                                result = this.complexDiv({ x: 1, y: 0 }, result);  
                                break;  
                        }  
                          
                        // Apply second function if specified  
                        if (this.customParams.second !== 'none') {  
                            switch(this.customParams.second) {  
                                case 'power':  
                                    result = this.complexPower(result, 2);  
                                    break;  
                                case 'exp':  
                                    result = this.complexExp(result);  
                                    break;  
                                case 'log':  
                                    result = this.complexLog(result);  
                                    break;  
                                case 'sin':  
                                    result = this.complexSin(result);  
                                    break;  
                                case 'inv':  
                                    result = this.complexDiv({ x: 1, y: 0 }, result);  
                                    break;  
                            }  
                        }  
                          
                        return result;  
                          
                    default:  
                        return z;  
                }  
            }  
              
            screenToComplex(screenX, screenY) {  
                return {  
                    x: (screenX - this.centerX) / this.scale,  
                    y: (this.centerY - screenY) / this.scale  
                };  
            }  
              
            complexToScreen(x, y) {  
                return {  
                    x: this.centerX + x * this.scale,  
                    y: this.centerY - y * this.scale  
                };  
            }  
              
            drawGrid() {  
                const gridSpacing = 0.5;  
                const maxRange = Math.max(this.canvas.width, this.canvas.height) / this.scale;  
                  
                // Vertical lines (constant real part)  
                for (let re = -maxRange; re <= maxRange; re += gridSpacing) {  
                    this.ctx.beginPath();  
                    this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';  
                    this.ctx.lineWidth = 1;  
                      
                    let firstPoint = true;  
                    for (let im = -maxRange; im <= maxRange; im += 0.05) {  
                        const transformed = this.applyTransformation(re, im);  
                          
                        if (!isFinite(transformed.x) || !isFinite(transformed.y)) continue;  
                          
                        const screen = this.complexToScreen(transformed.x, transformed.y);  
                          
                        if (screen.x >= -200 && screen.x <= this.canvas.width + 200 &&  
                            screen.y >= -200 && screen.y <= this.canvas.height + 200) {  
                            if (firstPoint) {  
                                this.ctx.moveTo(screen.x, screen.y);  
                                firstPoint = false;  
                            } else {  
                                this.ctx.lineTo(screen.x, screen.y);  
                            }  
                        } else {  
                            firstPoint = true;  
                        }  
                    }  
                    this.ctx.stroke();  
                }  
                  
                // Horizontal lines (constant imaginary part)  
                for (let im = -maxRange; im <= maxRange; im += gridSpacing) {  
                    this.ctx.beginPath();  
                    this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';  
                    this.ctx.lineWidth = 1;  
                      
                    let firstPoint = true;  
                    for (let re = -maxRange; re <= maxRange; re += 0.05) {  
                        const transformed = this.applyTransformation(re, im);  
                          
                        if (!isFinite(transformed.x) || !isFinite(transformed.y)) continue;  
                          
                        const screen = this.complexToScreen(transformed.x, transformed.y);  
                          
                        if (screen.x >= -200 && screen.x <= this.canvas.width + 200 &&  
                            screen.y >= -200 && screen.y <= this.canvas.height + 200) {  
                            if (firstPoint) {  
                                this.ctx.moveTo(screen.x, screen.y);  
                                firstPoint = false;  
                            } else {  
                                this.ctx.lineTo(screen.x, screen.y);  
                            }  
                        } else {  
                            firstPoint = true;  
                        }  
                    }  
                    this.ctx.stroke();  
                }  
            }  
              
            drawCircles() {  
                if (!this.showCircles) return;  
                  
                const radii = [0.5, 1.0, 1.5, 2.0, 2.5];  
                  
                radii.forEach((radius, index) => {  
                    this.ctx.beginPath();  
                    this.ctx.strokeStyle = index === 1 ? 'rgba(255, 0, 255, 0.8)' : 'rgba(255, 136, 0, 0.5)';  
                    this.ctx.lineWidth = index === 1 ? 2 : 1;  
                      
                    let firstPoint = true;  
                    for (let theta = 0; theta <= 2 * Math.PI + 0.1; theta += 0.05) {  
                        const x = radius * Math.cos(theta);  
                        const y = radius * Math.sin(theta);  
                        const transformed = this.applyTransformation(x, y);  
                          
                        if (!isFinite(transformed.x) || !isFinite(transformed.y)) continue;  
                          
                        const screen = this.complexToScreen(transformed.x, transformed.y);  
                          
                        if (firstPoint) {  
                            this.ctx.moveTo(screen.x, screen.y);  
                            firstPoint = false;  
                        } else {  
                            this.ctx.lineTo(screen.x, screen.y);  
                        }  
                    }  
                    this.ctx.stroke();  
                });  
            }  
              
            drawPoles() {  
                if (!this.showPoles) return;  
                  
                let poles = [];  
                  
                switch(this.functionType) {  
                    case 'inversion':  
                        poles = [{ x: 0, y: 0 }];  
                        break;  
                    case 'logarithm':  
                        poles = [{ x: 0, y: 0 }];  
                        break;  
                    case 'tangent':  
                        // tan has poles at (2n+1)π/2  
                        for (let n = -2; n <= 2; n++) {  
                            poles.push({ x: (2*n + 1) * Math.PI / (2 * this.trigParams.freq), y: 0 });  
                        }  
                        break;  
                    case 'mobius':  
                        const { c, d } = this.mobiusParams;  
                        if (c !== 0) {  
                            poles = [{ x: -d/c, y: 0 }];  
                        }  
                        break;  
                }  
                  
                poles.forEach(pole => {  
                    const screen = this.complexToScreen(pole.x, pole.y);  
                    if (screen.x >= 0 && screen.x <= this.canvas.width &&  
                        screen.y >= 0 && screen.y <= this.canvas.height) {  
                        this.ctx.fillStyle = 'rgba(255, 68, 68, 0.8)';  
                        this.ctx.beginPath();  
                        this.ctx.arc(screen.x, screen.y, 6, 0, 2 * Math.PI);  
                        this.ctx.fill();  
                          
                        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';  
                        this.ctx.lineWidth = 2;  
                        this.ctx.stroke();  
                    }  
                });  
            }  
              
            drawAxes() {  
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';  
                this.ctx.lineWidth = 2;  
                  
                // Real axis  
                this.ctx.beginPath();  
                this.ctx.moveTo(0, this.centerY);  
                this.ctx.lineTo(this.canvas.width, this.centerY);  
                this.ctx.stroke();  
                  
                // Imaginary axis  
                this.ctx.beginPath();  
                this.ctx.moveTo(this.centerX, 0);  
                this.ctx.lineTo(this.centerX, this.canvas.height);  
                this.ctx.stroke();  
                  
                // Origin marker  
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';  
                this.ctx.beginPath();  
                this.ctx.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);  
                this.ctx.fill();  
            }  
              
            drawLabels() {  
                if (!this.showLabels) return;  
                  
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';  
                this.ctx.font = '11px Courier New';  
                this.ctx.textAlign = 'center';  
                  
                // Real axis labels  
                for (let i = -5; i <= 5; i++) {  
                    if (i === 0) continue;  
                    const x = this.centerX + i * this.scale;  
                    if (x > 0 && x < this.canvas.width) {  
                        this.ctx.fillText(i.toString(), x, this.centerY + 18);  
                    }  
                }  
                  
                // Imaginary axis labels  
                this.ctx.textAlign = 'left';  
                for (let i = -5; i <= 5; i++) {  
                    if (i === 0) continue;  
                    const y = this.centerY - i * this.scale;  
                    if (y > 0 && y < this.canvas.height) {  
                        this.ctx.fillText(i + 'i', this.centerX + 8, y + 4);  
                    }  
                }  
            }  
              
            updatePointInfo(mouseX, mouseY) {  
                const complex = this.screenToComplex(mouseX, mouseY);  
                const transformed = this.applyTransformation(complex.x, complex.y);  
                  
                const pointInfo = document.getElementById('pointInfo');  
                  
                if (!isFinite(transformed.x) || !isFinite(transformed.y)) {  
                    pointInfo.innerHTML = `  
                        <strong>Point Mapping Analysis:</strong><br>  
                        Input: z = ${complex.x.toFixed(2)} + ${complex.y.toFixed(2)}i<br>  
                        Output: <span style="color: #ff4444">Singularity/Pole</span><br>  
                        The function is undefined at this point.  
                    `;  
                    return;  
                }  
                  
                pointInfo.innerHTML = `  
                    <strong>Point Mapping Analysis:</strong><br>  
                    Input: z = ${complex.x.toFixed(2)} + ${complex.y.toFixed(2)}i<br>  
                    |z| = ${Math.sqrt(complex.x * complex.x + complex.y * complex.y).toFixed(2)}<br>  
                    arg(z) = ${(Math.atan2(complex.y, complex.x) * 180 / Math.PI).toFixed(1)}°<br><br>  
                      
                    Output: f(z) = ${transformed.x.toFixed(2)} + ${transformed.y.toFixed(2)}i<br>  
                    |f(z)| = ${Math.sqrt(transformed.x * transformed.x + transformed.y * transformed.y).toFixed(2)}<br>  
                    arg(f(z)) = ${(Math.atan2(transformed.y, transformed.x) * 180 / Math.PI).toFixed(1)}°<br><br>  
                      
                    <strong>Jacobian:</strong> ${this.calculateJacobian(complex.x, complex.y).toFixed(3)}  
                `;  
            }  
              
            calculateJacobian(x, y) {  
                // Approximate Jacobian determinant for conformal factor  
                const h = 0.001;  
                const f0 = this.applyTransformation(x, y);  
                const fx = this.applyTransformation(x + h, y);  
                const fy = this.applyTransformation(x, y + h);  
                  
                if (!isFinite(fx.x) || !isFinite(fx.y) || !isFinite(fy.x) || !isFinite(fy.y)) {  
                    return 0;  
                }  
                  
                const dudx = (fx.x - f0.x) / h;  
                const dudy = (fy.x - f0.x) / h;  
                const dvdx = (fx.y - f0.y) / h;  
                const dvdy = (fy.y - f0.y) / h;  
                  
                return Math.abs(dudx * dvdy - dudy * dvdx);  
            }  
              
            updateDisplay() {  
                const descriptions = {  
                    power: "Power maps z^n create rotational symmetry and radial scaling. Used in fluid dynamics and electrostatics.",  
                    mobius: "Möbius transformations map circles/lines to circles/lines. Essential in projective geometry and signal processing.",  
                    exponential: "Exponential map e^z converts strips to sectors. Key in wave equations and quantum mechanics.",  
                    logarithm: "Logarithm unwraps angles and converts multiplication to addition. Used in audio processing.",  
                    sine: "Sine function creates periodic folding. Important in wave mechanics and Fourier analysis.",  
                    cosine: "Cosine function with different phase behavior. Used in oscillatory systems.",  
                    tangent: "Tangent function with poles creating infinite stretching. Models periodic phenomena with singularities.",  
                    inversion: "Inversion 1/z swaps inside/outside of unit circle. Used in electrostatics and fluid flow.",  
                    sqrt: "Square root creates branch cuts and double-valued behavior. Models Riemann surfaces.",  
                    custom: "Composite functions combining multiple transformations. Useful for complex modeling scenarios."  
                };  
                  
                const applications = {  
                    power: "• Fluid flow around obstacles<br>• Electrostatic field mapping<br>• Antenna radiation patterns",  
                    mobius: "• Stereographic projection<br>• Signal processing filters<br>• Computer vision transforms",  
                    exponential: "• Wave propagation<br>• Quantum state evolution<br>• Growth/decay processes",  
                    logarithm: "• Audio frequency analysis<br>• Spiral unwrapping<br>• Branch cut visualization",  
                    sine: "• Wave interference patterns<br>• Periodic boundary conditions<br>• Fourier series analysis",  
                    cosine: "• Standing wave patterns<br>• Harmonic oscillators<br>• AC circuit analysis",  
                    tangent: "• Optical ray tracing<br>• Periodic structures<br>• Resonance phenomena",  
                    inversion: "• Circle inversion geometry<br>• Electrostatic imaging<br>• Hyperbolic geometry",  
                    sqrt: "• Riemann surface theory<br>• Branch cut analysis<br>• Multi-valued functions",  
                    custom: "• Advanced modeling<br>• Research applications<br>• Educational exploration"  
                };  
                  
                const properties = {  
                    power: `• Conformal except at z=0<br>• n-fold rotational symmetry<br>• Maps |z|=r to |w|=r^${this.power.toFixed(1)}`,  
                    mobius: "• Maps circles to circles<br>• Preserves angles<br>• Three degrees of freedom",  
                    exponential: "• Maps strips to sectors<br>• Periodic in imaginary direction<br>• Exponential growth in real direction",  
                    logarithm: "• Multi-valued function<br>• Branch cuts required<br>• Inverse of exponential",  
                    sine: "• Periodic with period 2π<br>• Maps strips to plane<br>• Even function symmetry",  
                    cosine: "• Periodic with period 2π<br>• Phase-shifted sine<br>• Odd function symmetry",  
                    tangent: "• Periodic with period π<br>• Poles at odd multiples of π/2<br>• Unbounded behavior",  
                    inversion: "• Maps unit circle to itself<br>• Swaps interior/exterior<br>• Preserves angles",  
                    sqrt: "• Two-valued function<br>• Branch cut along negative real axis<br>• Maps plane to half-plane",  
                    custom: "• Composition of functions<br>• Complex behavior patterns<br>• Research-level mathematics"  
                };  
                  
                document.getElementById('functionDescription').textContent = descriptions[this.functionType];  
                document.getElementById('applications').innerHTML = applications[this.functionType];  
                document.getElementById('properties').innerHTML = properties[this.functionType];  
                  
                // Update mathematical formula  
                let formula = '';  
                switch(this.functionType) {  
                    case 'power':  
                        formula = `f(z) = z^${this.power.toFixed(1)}`;  
                        break;  
                    case 'mobius':  
                        const { a, b, c, d } = this.mobiusParams;  
                        formula = `f(z) = (${a.toFixed(1)}z + ${b.toFixed(1)}) / (${c.toFixed(1)}z + ${d.toFixed(1)})`;  
                        break;  
                    case 'exponential':  
                        formula = `f(z) = e^(${this.expParams.scale.toFixed(1)}z + ${this.expParams.rotation.toFixed(1)}i)`;  
                        break;  
                    case 'logarithm':  
                        formula = `f(z) = log(z) + ${this.logParams.branch.toFixed(1)}i`;  
                        break;  
                    case 'sine':  
                        formula = `f(z) = sin(${this.trigParams.freq.toFixed(1)}z + ${this.trigParams.phase.toFixed(1)})`;  
                        break;  
                    case 'cosine':  
                        formula = `f(z) = cos(${this.trigParams.freq.toFixed(1)}z + ${this.trigParams.phase.toFixed(1)})`;  
                        break;  
                    case 'tangent':  
                        formula = `f(z) = tan(${this.trigParams.freq.toFixed(1)}z + ${this.trigParams.phase.toFixed(1)})`;  
                        break;  
                    case 'inversion':  
                        formula = 'f(z) = 1/z';  
                        break;  
                    case 'sqrt':  
                        formula = 'f(z) = √z';  
                        break;  
                    case 'custom':  
                        formula = `f(z) = ${this.customParams.second !== 'none' ? this.customParams.second + '(' : ''}${this.customParams.first}(z)${this.customParams.second !== 'none' ? ')' : ''}`;  
                        break;  
                }  
                  
                document.getElementById('currentFunction').textContent = formula;  
                document.getElementById('mathFormula').textContent = formula;  
                  
                // Update mode description  
                const modeNames = {  
                    power: 'Power Mapping',  
                    mobius: 'Möbius Transformation',  
                    exponential: 'Exponential Mapping',  
                    logarithm: 'Logarithmic Mapping',  
                    sine: 'Sine Transformation',  
                    cosine: 'Cosine Transformation',  
                    tangent: 'Tangent Transformation',  
                    inversion: 'Inversion Mapping',  
                    sqrt: 'Square Root Mapping',  
                    custom: 'Custom Composite'  
                };  
                  
                document.getElementById('currentMode').textContent = modeNames[this.functionType];  
            }  
              
            animate() {  
                if (this.animationSpeed > 0) {  
                    this.time += this.animationSpeed * 0.02;  
                      
                    // Apply time-based parameter changes for animation  
                    if (this.functionType === 'power') {  
                        this.power = 2 + Math.sin(this.time) * 0.5;  
                        document.getElementById('powerValue').textContent = this.power.toFixed(1);  
                    } else if (this.functionType === 'exponential') {  
                        this.expParams.rotation = this.time * 0.5;  
                        document.getElementById('expRotationValue').textContent = this.expParams.rotation.toFixed(1);  
                    }  
                }  
                  
                // Clear canvas with gradient background  
                const gradient = this.ctx.createRadialGradient(  
                    this.centerX, this.centerY, 0,  
                    this.centerX, this.centerY, Math.max(this.canvas.width, this.canvas.height)  
                );  
                gradient.addColorStop(0, '#0a0a0a');  
                gradient.addColorStop(1, '#1a1a2e');  
                this.ctx.fillStyle = gradient;  
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  
                  
                this.drawAxes();  
                this.drawGrid();  
                this.drawCircles();  
                this.drawPoles();  
                this.drawLabels();  
                  
                requestAnimationFrame(() => this.animate());  
            }  
        }  
          
        function setMobiusPreset(type) {  
            const sliders = {  
                a: document.getElementById('mobiusA'),  
                b: document.getElementById('mobiusB'),  
                c: document.getElementById('mobiusC'),  
                d: document.getElementById('mobiusD')  
            };  
              
            const values = {  
                a: document.getElementById('mobiusAValue'),  
                b: document.getElementById('mobiusBValue'),  
                c: document.getElementById('mobiusCValue'),  
                d: document.getElementById('mobiusDValue')  
            };  
              
            let preset = {};  
            switch(type) {  
                case 'identity':  
                    preset = { a: 1, b: 0, c: 0, d: 1 };  
                    break;  
                case 'inversion':  
                    preset = { a: 0, b: 1, c: 1, d: 0 };  
                    break;  
                case 'rotation':  
                    preset = { a: 0.7, b: 0.7, c: -0.7, d: 0.7 };  
                    break;  
                case 'translation':  
                    preset = { a: 1, b: 1, c: 0, d: 1 };  
                    break;  
            }  
              
            Object.keys(preset).forEach(key => {  
                sliders[key].value = preset[key];  
                values[key].textContent = preset[key].toFixed(1);  
                sliders[key].dispatchEvent(new Event('input'));  
            });  
        }  
          
        function toggleCollapse(panelId) {  
            const content = document.getElementById(panelId + 'Content');  
            const icon = document.getElementById(panelId + 'Icon');  
              
            if (content.classList.contains('expanded')) {  
                content.classList.remove('expanded');  
                icon.classList.remove('expanded');  
                icon.textContent = '▲';  
            } else {  
                content.classList.add('expanded');  
                icon.classList.add('expanded');  
                icon.textContent = '▼';  
            }  
        }  
          
        function showInfoPanel() {  
            document.getElementById('infoPanel').style.display = 'block';  
        }  
          
        function hideInfoPanel() {  
            document.getElementById('infoPanel').style.display = 'none';  
        }  
          
        function randomizeMapping() {  
            const functionTypes = ['power', 'mobius', 'exponential', 'logarithm', 'sine', 'cosine', 'tangent', 'inversion', 'sqrt', 'custom'];  
            const randomType = functionTypes[Math.floor(Math.random() * functionTypes.length)];  
              
            // Set random function type  
            document.getElementById('functionType').value = randomType;  
            document.getElementById('functionType').dispatchEvent(new Event('change'));  
              
            // Set random parameters based on function type  
            switch(randomType) {  
                case 'power':  
                case 'sqrt':  
                    const randomPower = (Math.random() * 4 - 1).toFixed(1); // -1 to 3  
                    document.getElementById('powerSlider').value = randomPower;  
                    document.getElementById('powerSlider').dispatchEvent(new Event('input'));  
                    break;  
                      
                case 'mobius':  
                    ['A', 'B', 'C', 'D'].forEach(param => {  
                        const randomValue = (Math.random() * 4 - 2).toFixed(1); // -2 to 2  
                        document.getElementById(`mobius${param}`).value = randomValue;  
                        document.getElementById(`mobius${param}`).dispatchEvent(new Event('input'));  
                    });  
                    break;  
                      
                case 'exponential':  
                    document.getElementById('expScale').value = (Math.random() * 1.9 + 0.1).toFixed(1);  
                    document.getElementById('expRotation').value = (Math.random() * 6.28).toFixed(1);  
                    document.getElementById('expScale').dispatchEvent(new Event('input'));  
                    document.getElementById('expRotation').dispatchEvent(new Event('input'));  
                    break;  
                      
                case 'logarithm':  
                    document.getElementById('logBranch').value = (Math.random() * 6.28 - 3.14).toFixed(1);  
                    document.getElementById('logBranch').dispatchEvent(new Event('input'));  
                    break;  
                      
                case 'sine':  
                case 'cosine':  
                case 'tangent':  
                    document.getElementById('trigFreq').value = (Math.random() * 4 + 0.5).toFixed(1);  
                    document.getElementById('trigPhase').value = (Math.random() * 6.28 - 3.14).toFixed(1);  
                    document.getElementById('trigFreq').dispatchEvent(new Event('input'));  
                    document.getElementById('trigPhase').dispatchEvent(new Event('input'));  
                    break;  
                      
                case 'custom':  
                    const functions = ['power', 'exp', 'log', 'sin', 'inv'];  
                    document.getElementById('customFirst').value = functions[Math.floor(Math.random() * functions.length)];  
                    document.getElementById('customSecond').value = Math.random() > 0.5 ? 'none' : functions[Math.floor(Math.random() * functions.length)];  
                    document.getElementById('customParam').value = (Math.random() * 2.5 + 0.5).toFixed(1);  
                    document.getElementById('customFirst').dispatchEvent(new Event('change'));  
                    document.getElementById('customSecond').dispatchEvent(new Event('change'));  
                    document.getElementById('customParam').dispatchEvent(new Event('input'));  
                    break;  
            }  
              
            // Randomize animation speed occasionally  
            if (Math.random() > 0.7) {  
                document.getElementById('speedSlider').value = (Math.random() * 1.5).toFixed(1);  
                document.getElementById('speedSlider').dispatchEvent(new Event('input'));  
            }  
        }  
          
        function resetView() {  
            // Reset all controls to defaults  
            document.getElementById('functionType').value = 'power';  
            document.getElementById('powerSlider').value = 2;  
            document.getElementById('scaleSlider').value = 50;  
            document.getElementById('speedSlider').value = 0;  
            document.getElementById('showLabels').checked = true;  
            document.getElementById('showCircles').checked = true;  
            document.getElementById('showPoles').checked = true;  
              
            // Trigger change events  
            document.getElementById('functionType').dispatchEvent(new Event('change'));  
            document.getElementById('powerSlider').dispatchEvent(new Event('input'));  
            document.getElementById('scaleSlider').dispatchEvent(new Event('input'));  
            document.getElementById('speedSlider').dispatchEvent(new Event('input'));  
        }  
          
        // Initialize the laboratory  
        const lab = new ConformalMappingLab();  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9782cef657ebfa24',t:'MTc1NjcwOTE2NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
  
———————————————————————————————————————  
##   
**CONFORMAL MAPPING LAB: The Math Behind Your Digital World**  
  
##   
Ever wondered what mathematical wizardry powers your favorite tech? This interactive laboratory reveals the 10 core complex functions running invisibly in your devices RIGHT NOW:  
  
##   
**🔥 THE FUNCTION LINEUP:**  
  
##   
**z² (Power Maps)**  
→ Your smartphone camera's distortion correction  
**Möbius Transforms**  
→ Google Maps projections & VR headset optics  
  
**e^z (Exponential)**  
→ WiFi signal processing & quantum state evolution  
**log(z) (Logarithm)**  
→ Spotify's audio compression & spiral galaxy modeling  
**sin(z)/cos(z) (Trig Functions)**  
→ 5G wave interference & AC power grids  
**tan(z) (Tangent)**  
→ Fiber optic ray tracing & resonance engineering  
**1/z (Inversion)**  
→ Tesla's electrostatic field mapping  
**√z (Square Root)**  
→ GPS satellite orbit calculations & Riemann surfaces  
**Custom Composites**  
→ AI neural network architectures & metamaterial design  
  
##   
**🚀 TECH EVOLUTION CONVERGENCE:**  
These aren't just math equations - they're the DNA of: •  
**Quantum Computing**  
(Bloch sphere rotations) •  
**AR/VR**  
(Real-time perspective warping)  
  
•  
**Medical Imaging**  
(Brain surface flattening) •  
**Cryptocurrency**  
(Elliptic curve security) •  
**AI Vision**  
(High-dimensional data embedding) •  
**Space Tech**  
(Orbital mechanics & navigation)  
  
##   
**✨ VISUAL MAGIC:**  
Watch mathematical grids transform into flowing art as you explore each function. Hit "🎲 Random Map" to discover mind-bending transformations that reveal the hidden geometry of our digital universe.  
  
##   
**The future is mathematical - and it's beautiful.**  
  
##   
**Experience the math powering tomorrow's technology today.**  
  
##   
#Mathematics #TechInnovation #ComplexAnalysis #QuantumComputing #AR #VR #AI #Engineering #VisualizationTech #FutureTech #STEM #Innovation  
  
