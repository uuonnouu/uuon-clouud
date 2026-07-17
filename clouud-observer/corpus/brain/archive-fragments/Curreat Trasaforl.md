![Curreat Trasaforl](Attachments/938BCEC4-635F-4663-B255-5188AC7C5795.jpeg)  
Summary:   
  
<!--  
    Advanced Nonlinear Transform Engine  
    © 2025 UUON Foundation. All Rights Reserved.  
      
    PROPRIETARY AND CONFIDENTIAL  
      
    This software contains proprietary and confidential information of UUON Foundation.  
    All rights reserved. No part of this software may be reproduced, distributed, or   
    transmitted in any form or by any means, including photocopying, recording, or other   
    electronic or mechanical methods, without the prior written permission of UUON Foundation,  
    except in the case of brief quotations embodied in critical reviews and certain other   
    noncommercial uses permitted by copyright law.  
      
    For licensing and permission requests, contact: uuonuuord@gmail.com, philruiziii@icloud.com  
      
    UNAUTHORIZED USE, COPYING, MODIFICATION, OR DISTRIBUTION IS STRICTLY PROHIBITED  
    AND MAY RESULT IN SEVERE CIVIL AND CRIMINAL PENALTIES.  
--><!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Advanced Nonlinear Transform Engine - UUON Foundation</title>  
    <meta name="description" content="Interactive visualization of complex mathematical transformations">  
    <meta name="author" content="UUON Foundation">  
    <meta name="copyright" content="© 2025 UUON Foundation. All rights reserved.">  
    <meta name="rights" content="All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of UUON Foundation.">  
    <meta name="license" content="Proprietary - Commercial use prohibited without written consent">  
    <meta name="usage-restrictions" content="This software is protected by copyright law. Unauthorized copying, modification, distribution, or commercial use is strictly prohibited.">  
    <meta name="contact" content="For licensing inquiries, contact: uuonuuord@gmail.com, philruiziii@icloud.com">  
    <meta name="dcterms.rights" content="© 2025 UUON Foundation. All rights reserved.">  
    <meta name="dcterms.rightsHolder" content="UUON Foundation">  
    <meta name="robots" content="noarchive, nosnippet">  
    <meta property="og:copyright" content="© 2025 UUON Foundation">  
    <meta name="twitter:copyright" content="© 2025 UUON Foundation">  
    <style>  
        * {  
            margin: 0;  
            padding: 0;  
            box-sizing: border-box;  
        }  
  
        body {  
            background: #000;  
            font-family: 'Courier New', monospace;  
            overflow: hidden;  
            color: #fff;  
            touch-action: none;  
        }  
          
        #canvas {  
            display: block;  
            width: 100vw;  
            height: 100vh;  
            touch-action: none;  
        }  
          
        .ui-overlay {  
            position: fixed;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
            pointer-events: none;  
            z-index: 100;  
        }  
          
        .controls-toggle {  
            position: absolute;  
            top: 15px;  
            left: 15px;  
            background: rgba(0, 0, 0, 0.9);  
            border: 1px solid rgba(255, 107, 157, 0.5);  
            border-radius: 50%;  
            width: 50px;  
            height: 50px;  
            display: flex;  
            align-items: center;  
            justify-content: center;  
            cursor: pointer;  
            pointer-events: all;  
            transition: all 0.3s ease;  
            color: #ff6b9d;  
            font-size: 18px;  
        }  
          
        .controls-toggle:hover {  
            background: rgba(255, 107, 157, 0.2);  
            transform: scale(1.1);  
        }  
          
        .info-toggle {  
            position: absolute;  
            top: 15px;  
            right: 15px;  
            background: rgba(0, 0, 0, 0.9);  
            border: 1px solid rgba(199, 173, 167, 0.5);  
            border-radius: 50%;  
            width: 50px;  
            height: 50px;  
            display: flex;  
            align-items: center;  
            justify-content: center;  
            cursor: pointer;  
            pointer-events: all;  
            transition: all 0.3s ease;  
            color: #c9ada7;  
            font-size: 18px;  
        }  
          
        .info-toggle:hover {  
            background: rgba(199, 173, 167, 0.2);  
            transform: scale(1.1);  
        }  
          
        .controls-panel {  
            position: absolute;  
            top: 80px;  
            left: 15px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 20px;  
            border-radius: 12px;  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            backdrop-filter: blur(15px);  
            min-width: 320px;  
            max-width: 90vw;  
            max-height: calc(100vh - 100px);  
            overflow-y: auto;  
            overflow-x: hidden;  
            pointer-events: all;  
            transform: translateX(-110%);  
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);  
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);  
            z-index: 1000;  
            scrollbar-width: thin;  
            scrollbar-color: rgba(255, 107, 157, 0.5) rgba(0, 0, 0, 0.3);  
        }  
          
        .controls-panel::-webkit-scrollbar {  
            width: 8px;  
        }  
          
        .controls-panel::-webkit-scrollbar-track {  
            background: rgba(0, 0, 0, 0.3);  
            border-radius: 4px;  
        }  
          
        .controls-panel::-webkit-scrollbar-thumb {  
            background: rgba(255, 107, 157, 0.5);  
            border-radius: 4px;  
        }  
          
        .controls-panel::-webkit-scrollbar-thumb:hover {  
            background: rgba(255, 107, 157, 0.7);  
        }  
          
        .controls-panel.open {  
            transform: translateX(0);  
        }  
          
        .info-panel {  
            position: absolute;  
            top: 80px;  
            right: 15px;  
            background: rgba(0, 0, 0, 0.95);  
            padding: 25px;  
            border-radius: 12px;  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            backdrop-filter: blur(15px);  
            max-width: 90vw;  
            width: 400px;  
            max-height: calc(100vh - 100px);  
            overflow-y: auto;  
            overflow-x: hidden;  
            pointer-events: all;  
            transform: translateX(120%);  
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);  
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);  
            scrollbar-width: thin;  
            scrollbar-color: rgba(199, 173, 167, 0.5) rgba(0, 0, 0, 0.3);  
        }  
          
        .info-panel::-webkit-scrollbar {  
            width: 8px;  
        }  
          
        .info-panel::-webkit-scrollbar-track {  
            background: rgba(0, 0, 0, 0.3);  
            border-radius: 4px;  
        }  
          
        .info-panel::-webkit-scrollbar-thumb {  
            background: rgba(199, 173, 167, 0.5);  
            border-radius: 4px;  
        }  
          
        .info-panel::-webkit-scrollbar-thumb:hover {  
            background: rgba(199, 173, 167, 0.7);  
        }  
          
        .info-panel.open {  
            transform: translateX(0);  
        }  
          
        @media (max-width: 768px) {  
            .controls-panel {  
                width: calc(100vw - 30px);  
                left: 15px;  
                right: 15px;  
            }  
              
            .info-panel {  
                width: calc(100vw - 30px);  
                left: 15px;  
                right: 15px;  
                transform: translateY(-120%);  
                top: 80px;  
            }  
              
            .info-panel.open {  
                transform: translateY(0);  
            }  
        }  
          
        .panel-title {  
            color: #ff6b9d;  
            font-size: 16px;  
            margin-bottom: 20px;  
            font-weight: bold;  
            text-align: center;  
        }  
          
        .control-group {  
            margin-bottom: 15px;  
        }  
          
        .control-label {  
            color: #c9ada7;  
            font-size: 12px;  
            margin-bottom: 8px;  
            display: block;  
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
            background: #ff6b9d;  
            cursor: pointer;  
            border: 2px solid #000;  
        }  
          
        .slider::-moz-range-thumb {  
            width: 16px;  
            height: 16px;  
            border-radius: 50%;  
            background: #ff6b9d;  
            cursor: pointer;  
            border: 2px solid #000;  
        }  
          
        .button {  
            background: rgba(255, 107, 157, 0.2);  
            border: 1px solid #ff6b9d;  
            color: #ff6b9d;  
            padding: 8px 16px;  
            border-radius: 6px;  
            cursor: pointer;  
            font-family: inherit;  
            font-size: 12px;  
            transition: all 0.3s ease;  
            margin: 2px;  
            width: calc(50% - 4px);  
        }  
          
        .button:hover {  
            background: rgba(255, 107, 157, 0.4);  
            transform: translateY(-1px);  
        }  
          
        .button.active {  
            background: rgba(255, 107, 157, 0.6);  
            border-color: #ff6b9d;  
        }  
          
        .value-display {  
            color: #fff;  
            font-size: 11px;  
            margin-left: 8px;  
        }  
          
        .info-section {  
            margin-bottom: 20px;  
        }  
          
        .info-section h3 {  
            color: #c9ada7;  
            font-size: 14px;  
            margin-bottom: 10px;  
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);  
            padding-bottom: 5px;  
        }  
          
        .info-section p {  
            color: #fff;  
            font-size: 12px;  
            line-height: 1.5;  
            margin-bottom: 8px;  
        }  
          
        .math-formula {  
            background: rgba(255, 107, 157, 0.1);  
            padding: 10px;  
            border-radius: 6px;  
            font-family: 'Times New Roman', serif;  
            text-align: center;  
            color: #ff6b9d;  
            margin: 10px 0;  
            font-size: 14px;  
        }  
          
        .status-bar {  
            position: absolute;  
            bottom: 15px;  
            left: 15px;  
            background: rgba(0, 0, 0, 0.8);  
            padding: 8px 12px;  
            border-radius: 6px;  
            font-size: 11px;  
            color: #c9ada7;  
            pointer-events: none;  
        }  
          
        .function-selector {  
            display: grid;  
            grid-template-columns: 1fr 1fr;  
            gap: 5px;  
            margin-bottom: 15px;  
        }  
          
        .function-btn {  
            background: rgba(255, 107, 157, 0.1);  
            border: 1px solid rgba(255, 107, 157, 0.3);  
            color: #ff6b9d;  
            padding: 6px 8px;  
            border-radius: 4px;  
            cursor: pointer;  
            font-family: inherit;  
            font-size: 10px;  
            transition: all 0.3s ease;  
            text-align: center;  
        }  
          
        .function-btn:hover {  
            background: rgba(255, 107, 157, 0.3);  
        }  
          
        .function-btn.active {  
            background: rgba(255, 107, 157, 0.5);  
            border-color: #ff6b9d;  
        }  
          
        .pattern-selector {  
            display: grid;  
            grid-template-columns: 1fr 1fr 1fr;  
            gap: 5px;  
            margin-bottom: 15px;  
        }  
          
        .pattern-btn {  
            background: rgba(78, 205, 196, 0.1);  
            border: 1px solid rgba(78, 205, 196, 0.3);  
            color: #4ecdc4;  
            padding: 6px 4px;  
            border-radius: 4px;  
            cursor: pointer;  
            font-family: inherit;  
            font-size: 10px;  
            transition: all 0.3s ease;  
            text-align: center;  
        }  
          
        .pattern-btn:hover {  
            background: rgba(78, 205, 196, 0.3);  
        }  
          
        .pattern-btn.active {  
            background: rgba(78, 205, 196, 0.5);  
            border-color: #4ecdc4;  
        }  
          
        .math-display {  
            position: absolute;  
            top: 15px;  
            left: 50%;  
            transform: translateX(-50%);  
            background: rgba(0, 0, 0, 0.9);  
            padding: 15px 20px;  
            border-radius: 8px;  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            backdrop-filter: blur(10px);  
            pointer-events: none;  
            font-family: 'Courier New', monospace;  
            min-width: 300px;  
            text-align: center;  
        }  
          
        .math-title {  
            color: #ff6b9d;  
            font-size: 12px;  
            margin-bottom: 8px;  
            font-weight: bold;  
        }  
          
        .math-equation {  
            color: #fff;  
            font-size: 18px;  
            font-family: 'Times New Roman', serif;  
            margin-bottom: 10px;  
            padding: 8px;  
            background: rgba(255, 107, 157, 0.1);  
            border-radius: 4px;  
        }  
          
        .math-params {  
            display: flex;  
            justify-content: space-around;  
            margin-bottom: 8px;  
            font-size: 10px;  
            color: #c9ada7;  
        }  
          
        .math-coords {  
            font-size: 11px;  
            color: #4ecdc4;  
        }  
          
        .math-coords div {  
            margin: 2px 0;  
        }  
          
        @media (max-width: 768px) {  
            .math-display {  
                top: 80px;  
                left: 15px;  
                right: 15px;  
                transform: none;  
                min-width: auto;  
                width: calc(100vw - 30px);  
            }  
        }  
    </style>  
</head>  
<body>  
    <canvas id="canvas"></canvas>  
      
    <div class="ui-overlay">  
        <div class="controls-toggle" onclick="toggleControls()" title="Toggle Controls Panel">⚙</div>  
        <div class="info-toggle" onclick="toggleInfo()">ℹ</div>  
          
        <div class="controls-panel open" id="controlsPanel">  
            <div class="panel-title">Advanced Transform Engine</div>  
              
            <div class="control-group">  
                <label class="control-label">Transform Function</label>  
                <div class="function-selector">  
                    <button class="function-btn active" onclick="setFunction(0)">1/z</button>  
                    <button class="function-btn" onclick="setFunction(1)">z²</button>  
                    <button class="function-btn" onclick="setFunction(2)">z³</button>  
                    <button class="function-btn" onclick="setFunction(3)">√z</button>  
                    <button class="function-btn" onclick="setFunction(4)">e^z</button>  
                    <button class="function-btn" onclick="setFunction(5)">sin(z)</button>  
                    <button class="function-btn" onclick="setFunction(6)">cos(z)</button>  
                    <button class="function-btn" onclick="setFunction(7)">tan(z)</button>  
                    <button class="function-btn" onclick="setFunction(8)">log(z)</button>  
                    <button class="function-btn" onclick="setFunction(9)">z^n</button>  
                </div>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Pattern Type</label>  
                <div class="pattern-selector">  
                    <button class="pattern-btn active" onclick="setPattern(0)">Grid</button>  
                    <button class="pattern-btn" onclick="setPattern(1)">Circles</button>  
                    <button class="pattern-btn" onclick="setPattern(2)">Spirals</button>  
                    <button class="pattern-btn" onclick="setPattern(3)">Rays</button>  
                    <button class="pattern-btn" onclick="setPattern(4)">Flowers</button>  
                    <button class="pattern-btn" onclick="setPattern(5)">Waves</button>  
                </div>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Power/Exponent (for z^n)</label>  
                <input type="range" class="slider" id="powerParam" min="0.1" max="5" step="0.1" value="2" oninput="updateVisualization()">  
                <span class="value-display" id="powerParamValue">2.0</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Intensity</label>  
                <input type="range" class="slider" id="intensity" min="0.1" max="3" step="0.1" value="1" oninput="updateVisualization()">  
                <span class="value-display" id="intensityValue">1.0</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Pattern Density</label>  
                <input type="range" class="slider" id="gridDensity" min="5" max="100" value="20" oninput="updateVisualization()">  
                <span class="value-display" id="gridDensityValue">20</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Animation Speed</label>  
                <input type="range" class="slider" id="animSpeed" min="0" max="3" step="0.1" value="1" oninput="updateVisualization()">  
                <span class="value-display" id="animSpeedValue">1.0</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Zoom Level</label>  
                <input type="range" class="slider" id="zoomLevel" min="0.1" max="10" step="0.1" value="2" oninput="updateVisualization()">  
                <span class="value-display" id="zoomLevelValue">2.0</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label">Distortion Factor</label>  
                <input type="range" class="slider" id="distortion" min="0" max="2" step="0.1" value="0" oninput="updateVisualization()">  
                <span class="value-display" id="distortionValue">0.0</span>  
            </div>  
              
            <div class="control-group">  
                <label class="control-label" style="color: #4ecdc4; border-bottom: 1px solid rgba(78, 205, 196, 0.3); padding-bottom: 5px; margin-bottom: 10px;">Particle Controls</label>  
                  
                <label class="control-label">Number of Particles</label>  
                <input type="range" class="slider" id="particleCount" min="4" max="32" value="16" oninput="updateVisualization()">  
                <span class="value-display" id="particleCountValue">16</span>  
                  
                <label class="control-label">Particle Size</label>  
                <input type="range" class="slider" id="particleSize" min="1" max="10" value="5" oninput="updateVisualization()">  
                <span class="value-display" id="particleSizeValue">5</span>  
                  
                <label class="control-label">Orbit Radius</label>  
                <input type="range" class="slider" id="orbitRadius" min="0.5" max="4" step="0.1" value="1.5" oninput="updateVisualization()">  
                <span class="value-display" id="orbitRadiusValue">1.5</span>  
                  
                <label class="control-label">Orbit Variation</label>  
                <input type="range" class="slider" id="orbitVariation" min="0" max="2" step="0.1" value="0.8" oninput="updateVisualization()">  
                <span class="value-display" id="orbitVariationValue">0.8</span>  
                  
                <button class="button" onclick="toggleParticles()" style="width: 100%; margin-top: 10px;">Toggle Particles</button>  
            </div>  
              
            <div class="control-group">  
                <button class="button" onclick="resetTransform()">Reset</button>  
                <button class="button" onclick="toggleAnimation()">Pause/Play</button>  
                <button class="button" onclick="changeColorScheme()">Colors</button>  
                <button class="button" onclick="toggleGrid()">Grid</button>  
            </div>  
        </div>  
          
        <div class="info-panel" id="infoPanel">  
            <div class="panel-title">Complex Transform Functions</div>  
              
            <div class="info-section">  
                <h3>Available Functions</h3>  
                <div class="math-formula">f(z) = 1/z</div>  
                <p><strong>Inversion:</strong> Maps unit circle to itself, swaps interior/exterior</p>  
                  
                <div class="math-formula">f(z) = z²</div>  
                <p><strong>Squaring:</strong> Doubles angles, squares magnitudes</p>  
                  
                <div class="math-formula">f(z) = z³</div>  
                <p><strong>Cubing:</strong> Triples angles, creates threefold symmetry</p>  
                  
                <div class="math-formula">f(z) = √z</div>  
                <p><strong>Square Root:</strong> Halves angles, creates branch cuts</p>  
                  
                <div class="math-formula">f(z) = e^z</div>  
                <p><strong>Exponential:</strong> Maps strips to sectors, periodic in imaginary direction</p>  
                  
                <div class="math-formula">f(z) = sin(z), cos(z), tan(z)</div>  
                <p><strong>Trigonometric:</strong> Complex extensions with hyperbolic behavior</p>  
                  
                <div class="math-formula">f(z) = log(z)</div>  
                <p><strong>Logarithm:</strong> Inverse of exponential, maps sectors to strips</p>  
            </div>  
              
            <div class="info-section">  
                <h3>Pattern Types</h3>  
                <p><strong>Grid:</strong> Rectangular coordinate lines</p>  
                <p><strong>Circles:</strong> Concentric circles and radial lines</p>  
                <p><strong>Spirals:</strong> Logarithmic and Archimedean spirals</p>  
                <p><strong>Rays:</strong> Radial lines from origin</p>  
                <p><strong>Flowers:</strong> Rose curve patterns</p>  
                <p><strong>Waves:</strong> Sinusoidal wave patterns</p>  
            </div>  
              
            <div class="info-section">  
                <h3>Advanced Parameters</h3>  
                <p><strong>Intensity:</strong> Controls the strength of the transformation</p>  
                <p><strong>Power:</strong> Exponent for z^n transformations</p>  
                <p><strong>Distortion:</strong> Adds nonlinear warping effects</p>  
                <p><strong>Pattern Density:</strong> Number of pattern elements</p>  
            </div>  
              
            <div class="info-section">  
                <h3>Interactive Controls</h3>  
                <p>• Click and drag to pan around the complex plane</p>  
                <p>• Use mouse wheel or pinch to zoom</p>  
                <p>• Experiment with different function combinations</p>  
                <p>• Adjust parameters to see real-time changes</p>  
            </div>  
              
            <div class="info-section">  
                <h3>UUON Foundation</h3>  
                <p>Advanced mathematical visualization tools for education and research in complex analysis.</p>  
            </div>  
              
            <div class="info-section">  
                <h3>Copyright Notice</h3>  
                <p style="font-size: 10px; color: #ff6b9d;"><strong>© 2025 UUON Foundation. All Rights Reserved.</strong></p>  
                <p style="font-size: 10px;">This software is proprietary and confidential. No part of this application may be reproduced, distributed, or transmitted without prior written consent from UUON Foundation.</p>  
                <p style="font-size: 10px;">For licensing: uuonuuord@gmail.com, philruiziii@icloud.com</p>  
            </div>  
        </div>  
          
        <div class="status-bar" id="statusBar">  
            Function: 1/z | Pattern: Grid | Animation: RUNNING  
        </div>  
          
        <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0, 0, 0, 0.8); padding: 6px 10px; border-radius: 4px; font-size: 9px; color: #c9ada7; pointer-events: none; border: 1px solid rgba(255, 255, 255, 0.1);">  
            © 2025 UUON Foundation - All Rights Reserved  
        </div>  
          
        <div class="math-display" id="mathDisplay">  
            <div class="math-title">Current Transform</div>  
            <div class="math-equation" id="mathEquation">f(z) = 1/z</div>  
            <div class="math-params" id="mathParams">  
                <div>Intensity: 1.0</div>  
                <div>Power: 2.0</div>  
                <div>Distortion: 0.0</div>  
            </div>  
            <div class="math-coords" id="mathCoords">  
                <div>z = 0.00 + 0.00i</div>  
                <div>f(z) = 0.00 + 0.00i</div>  
            </div>  
        </div>  
    </div>  
  
    <script>  
        const canvas = document.getElementById('canvas');  
        const ctx = canvas.getContext('2d');  
          
        let animationId;  
        let time = 0;  
        let isAnimating = true;  
        let showGrid = true;  
        let colorScheme = 0;  
        let currentFunction = 0;  
        let currentPattern = 0;  
          
        // Visualization parameters  
        let gridDensity = 20;  
        let animSpeed = 1;  
        let zoomLevel = 2;  
        let offsetX = 0;  
        let offsetY = 0;  
        let intensity = 1;  
        let powerParam = 2;  
        let distortion = 0;  
          
        // Particle parameters  
        let particleCount = 16;  
        let particleSize = 5;  
        let orbitRadius = 1.5;  
        let orbitVariation = 0.8;  
        let showParticles = true;  
          
        // Mouse tracking for math display  
        let mouseComplexPos = { x: 0, y: 0 };  
        let mouseTransformed = { x: 0, y: 0 };  
          
        // Mouse interaction  
        let isDragging = false;  
        let lastMouseX = 0;  
        let lastMouseY = 0;  
          
        // Color schemes  
        const colorSchemes = [  
            { primary: '#ff6b9d', secondary: '#c9ada7', accent: '#4ecdc4' },  
            { primary: '#00d4ff', secondary: '#ff9500', accent: '#ff3366' },  
            { primary: '#39ff14', secondary: '#ff1493', accent: '#ffd700' },  
            { primary: '#8a2be2', secondary: '#00ced1', accent: '#ff4500' },  
            { primary: '#ff1493', secondary: '#00ff7f', accent: '#1e90ff' }  
        ];  
          
        // Transform functions  
        const transformFunctions = [  
            'Inversion (1/z)', 'Square (z²)', 'Cube (z³)', 'Square Root (√z)',  
            'Exponential (e^z)', 'Sine (sin z)', 'Cosine (cos z)', 'Tangent (tan z)',  
            'Logarithm (log z)', 'Power (z^n)'  
        ];  
          
        const mathEquations = [  
            'f(z) = 1/z',  
            'f(z) = z²',   
            'f(z) = z³',  
            'f(z) = √z',  
            'f(z) = e^z',  
            'f(z) = sin(z)',  
            'f(z) = cos(z)',  
            'f(z) = tan(z)',  
            'f(z) = log(z)',  
            'f(z) = z^n'  
        ];  
          
        const patternTypes = ['Grid', 'Circles', 'Spirals', 'Rays', 'Flowers', 'Waves'];  
          
        function resizeCanvas() {  
            canvas.width = window.innerWidth;  
            canvas.height = window.innerHeight;  
        }  
          
        function complexTransform(x, y, funcType, power, intensity, time) {  
            let result = { x: x, y: y };  
              
            // Apply distortion  
            if (distortion > 0) {  
                const dist = Math.sqrt(x*x + y*y);  
                const angle = Math.atan2(y, x);  
                const warp = distortion * Math.sin(dist * 3 + time);  
                result.x = x + warp * Math.cos(angle + Math.PI/2);  
                result.y = y + warp * Math.sin(angle + Math.PI/2);  
            }  
              
            x = result.x * intensity;  
            y = result.y * intensity;  
              
            switch(funcType) {  
                case 0: // 1/z (inversion)  
                    const mag = x*x + y*y;  
                    if (mag === 0) return { x: Infinity, y: Infinity };  
                    return { x: x/mag, y: -y/mag };  
                      
                case 1: // z²  
                    return { x: x*x - y*y, y: 2*x*y };  
                      
                case 2: // z³  
                    return {   
                        x: x*x*x - 3*x*y*y,   
                        y: 3*x*x*y - y*y*y   
                    };  
                      
                case 3: // √z  
                    const r = Math.sqrt(Math.sqrt(x*x + y*y));  
                    const theta = Math.atan2(y, x) / 2;  
                    return { x: r * Math.cos(theta), y: r * Math.sin(theta) };  
                      
                case 4: // e^z  
                    const exp_x = Math.exp(x);  
                    return {   
                        x: exp_x * Math.cos(y),   
                        y: exp_x * Math.sin(y)   
                    };  
                      
                case 5: // sin(z)  
                    return {  
                        x: Math.sin(x) * Math.cosh(y),  
                        y: Math.cos(x) * Math.sinh(y)  
                    };  
                      
                case 6: // cos(z)  
                    return {  
                        x: Math.cos(x) * Math.cosh(y),  
                        y: -Math.sin(x) * Math.sinh(y)  
                    };  
                      
                case 7: // tan(z)  
                    const denom = Math.cos(2*x) + Math.cosh(2*y);  
                    return {  
                        x: Math.sin(2*x) / denom,  
                        y: Math.sinh(2*y) / denom  
                    };  
                      
                case 8: // log(z)  
                    const logR = 0.5 * Math.log(x*x + y*y);  
                    const logTheta = Math.atan2(y, x);  
                    return { x: logR, y: logTheta };  
                      
                case 9: // z^n  
                    const rPow = Math.pow(Math.sqrt(x*x + y*y), power);  
                    const thetaPow = Math.atan2(y, x) * power;  
                    return {   
                        x: rPow * Math.cos(thetaPow),   
                        y: rPow * Math.sin(thetaPow)   
                    };  
                      
                default:  
                    return { x: x, y: y };  
            }  
        }  
          
        function screenToComplex(screenX, screenY) {  
            const centerX = canvas.width / 2;  
            const centerY = canvas.height / 2;  
            return {  
                x: (screenX - centerX + offsetX) / (100 * zoomLevel),  
                y: (centerY - screenY + offsetY) / (100 * zoomLevel)  
            };  
        }  
          
        function complexToScreen(x, y) {  
            const centerX = canvas.width / 2;  
            const centerY = canvas.height / 2;  
            return {  
                x: x * 100 * zoomLevel + centerX - offsetX,  
                y: centerY - y * 100 * zoomLevel - offsetY  
            };  
        }  
          
        function drawGrid() {  
            if (!showGrid) return;  
              
            const colors = colorSchemes[colorScheme];  
            ctx.strokeStyle = colors.secondary + '40';  
            ctx.lineWidth = 1;  
              
            const step = Math.max(0.5, Math.floor(50 / zoomLevel));  
            const range = Math.max(canvas.width, canvas.height) / (50 * zoomLevel);  
              
            // Vertical lines  
            for (let i = -range; i <= range; i += step) {  
                const screen = complexToScreen(i, 0);  
                if (screen.x >= 0 && screen.x <= canvas.width) {  
                    ctx.beginPath();  
                    ctx.moveTo(screen.x, 0);  
                    ctx.lineTo(screen.x, canvas.height);  
                    ctx.stroke();  
                }  
            }  
              
            // Horizontal lines  
            for (let i = -range; i <= range; i += step) {  
                const screen = complexToScreen(0, i);  
                if (screen.y >= 0 && screen.y <= canvas.height) {  
                    ctx.beginPath();  
                    ctx.moveTo(0, screen.y);  
                    ctx.lineTo(canvas.width, screen.y);  
                    ctx.stroke();  
                }  
            }  
              
            // Axes  
            ctx.strokeStyle = colors.secondary + '80';  
            ctx.lineWidth = 2;  
              
            const xAxis = complexToScreen(0, 0);  
            ctx.beginPath();  
            ctx.moveTo(0, xAxis.y);  
            ctx.lineTo(canvas.width, xAxis.y);  
            ctx.stroke();  
              
            ctx.beginPath();  
            ctx.moveTo(xAxis.x, 0);  
            ctx.lineTo(xAxis.x, canvas.height);  
            ctx.stroke();  
        }  
          
        function generatePattern(patternType, density, range) {  
            const points = [];  
              
            switch(patternType) {  
                case 0: // Grid  
                    for (let i = -range; i <= range; i += range/density) {  
                        for (let j = -range; j <= range; j += 0.1) {  
                            if (Math.abs(i) > 0.01) points.push({x: i, y: j, type: 'vertical'});  
                            if (Math.abs(j) > 0.01) points.push({x: j, y: i, type: 'horizontal'});  
                        }  
                    }  
                    break;  
                      
                case 1: // Circles  
                    for (let r = 0.2; r <= range; r += range/density) {  
                        for (let theta = 0; theta < 2*Math.PI; theta += 0.1) {  
                            points.push({  
                                x: r * Math.cos(theta),  
                                y: r * Math.sin(theta),  
                                type: 'circle'  
                            });  
                        }  
                    }  
                    // Add radial lines  
                    for (let theta = 0; theta < 2*Math.PI; theta += Math.PI/density) {  
                        for (let r = 0; r <= range; r += 0.1) {  
                            points.push({  
                                x: r * Math.cos(theta),  
                                y: r * Math.sin(theta),  
                                type: 'ray'  
                            });  
                        }  
                    }  
                    break;  
                      
                case 2: // Spirals  
                    for (let i = 0; i < density; i++) {  
                        for (let t = 0; t < 4*Math.PI; t += 0.1) {  
                            const r = t * 0.3;  
                            const offset = i * 2*Math.PI/density;  
                            points.push({  
                                x: r * Math.cos(t + offset),  
                                y: r * Math.sin(t + offset),  
                                type: 'spiral'  
                            });  
                        }  
                    }  
                    break;  
                      
                case 3: // Rays  
                    for (let theta = 0; theta < 2*Math.PI; theta += 2*Math.PI/density) {  
                        for (let r = 0; r <= range; r += 0.1) {  
                            points.push({  
                                x: r * Math.cos(theta),  
                                y: r * Math.sin(theta),  
                                type: 'ray'  
                            });  
                        }  
                    }  
                    break;  
                      
                case 4: // Flowers (rose curves)  
                    const k = Math.floor(density/4) + 3;  
                    for (let theta = 0; theta < 2*Math.PI; theta += 0.05) {  
                        const r = Math.cos(k * theta) * 2;  
                        if (r > 0) {  
                            points.push({  
                                x: r * Math.cos(theta),  
                                y: r * Math.sin(theta),  
                                type: 'flower'  
                            });  
                        }  
                    }  
                    break;  
                      
                case 5: // Waves  
                    for (let x = -range; x <= range; x += 0.1) {  
                        for (let i = 0; i < density/5; i++) {  
                            const freq = (i + 1) * 2;  
                            const y = Math.sin(freq * x) * (range/3);  
                            points.push({x: x, y: y, type: 'wave'});  
                        }  
                    }  
                    break;  
            }  
              
            return points;  
        }  
          
        function drawTransformedPattern() {  
            const colors = colorSchemes[colorScheme];  
            const range = 4;  
            const points = generatePattern(currentPattern, gridDensity, range);  
              
            // Group points by type for efficient drawing  
            const pointsByType = {};  
            points.forEach(point => {  
                if (!pointsByType[point.type]) pointsByType[point.type] = [];  
                pointsByType[point.type].push(point);  
            });  
              
            Object.keys(pointsByType).forEach((type, index) => {  
                const typePoints = pointsByType[type];  
                const colorIndex = index % 3;  
                const color = colorIndex === 0 ? colors.primary :   
                             colorIndex === 1 ? colors.accent : colors.secondary;  
                  
                ctx.strokeStyle = color + '60';  
                ctx.lineWidth = 1;  
                ctx.beginPath();  
                  
                let pathStarted = false;  
                  
                typePoints.forEach(point => {  
                    const transformed = complexTransform(  
                        point.x, point.y, currentFunction, powerParam, intensity, time  
                    );  
                      
                    if (Math.abs(transformed.x) < 50 && Math.abs(transformed.y) < 50) {  
                        const screen = complexToScreen(transformed.x, transformed.y);  
                          
                        if (screen.x >= -100 && screen.x <= canvas.width + 100 &&   
                            screen.y >= -100 && screen.y <= canvas.height + 100) {  
                            if (!pathStarted) {  
                                ctx.moveTo(screen.x, screen.y);  
                                pathStarted = true;  
                            } else {  
                                ctx.lineTo(screen.x, screen.y);  
                            }  
                        }  
                    }  
                });  
                  
                ctx.stroke();  
            });  
        }  
          
        function drawAnimatedPoints() {  
            if (!showParticles) return;  
              
            const colors = colorSchemes[colorScheme];  
              
            for (let i = 0; i < particleCount; i++) {  
                const angle = (i / particleCount) * 2 * Math.PI + time * animSpeed;  
                const radiusBase = orbitRadius + orbitVariation * Math.sin(time * animSpeed * 1.5 + i);  
                  
                const original = {  
                    x: radiusBase * Math.cos(angle),  
                    y: radiusBase * Math.sin(angle)  
                };  
                  
                const transformed = complexTransform(  
                    original.x, original.y, currentFunction, powerParam, intensity, time  
                );  
                  
                // Draw original point  
                const originalScreen = complexToScreen(original.x, original.y);  
                if (originalScreen.x >= -50 && originalScreen.x <= canvas.width + 50 &&  
                    originalScreen.y >= -50 && originalScreen.y <= canvas.height + 50) {  
                    ctx.fillStyle = colors.primary;  
                    ctx.beginPath();  
                    ctx.arc(originalScreen.x, originalScreen.y, particleSize * 0.6, 0, 2 * Math.PI);  
                    ctx.fill();  
                      
                    // Add glow effect  
                    ctx.shadowColor = colors.primary;  
                    ctx.shadowBlur = particleSize * 2;  
                    ctx.beginPath();  
                    ctx.arc(originalScreen.x, originalScreen.y, particleSize * 0.3, 0, 2 * Math.PI);  
                    ctx.fill();  
                    ctx.shadowBlur = 0;  
                }  
                  
                // Draw transformed point  
                if (Math.abs(transformed.x) < 100 && Math.abs(transformed.y) < 100) {  
                    const transformedScreen = complexToScreen(transformed.x, transformed.y);  
                    if (transformedScreen.x >= -50 && transformedScreen.x <= canvas.width + 50 &&  
                        transformedScreen.y >= -50 && transformedScreen.y <= canvas.height + 50) {  
                        ctx.fillStyle = colors.accent;  
                        ctx.beginPath();  
                        ctx.arc(transformedScreen.x, transformedScreen.y, particleSize, 0, 2 * Math.PI);  
                        ctx.fill();  
                          
                        // Add glow effect  
                        ctx.shadowColor = colors.accent;  
                        ctx.shadowBlur = particleSize * 2;  
                        ctx.beginPath();  
                        ctx.arc(transformedScreen.x, transformedScreen.y, particleSize * 0.5, 0, 2 * Math.PI);  
                        ctx.fill();  
                        ctx.shadowBlur = 0;  
                          
                        // Draw connection line  
                        if (originalScreen.x >= -50 && originalScreen.x <= canvas.width + 50 &&  
                            originalScreen.y >= -50 && originalScreen.y <= canvas.height + 50) {  
                            ctx.strokeStyle = colors.secondary + '60';  
                            ctx.lineWidth = 1;  
                            ctx.beginPath();  
                            ctx.moveTo(originalScreen.x, originalScreen.y);  
                            ctx.lineTo(transformedScreen.x, transformedScreen.y);  
                            ctx.stroke();  
                        }  
                    }  
                }  
            }  
        }  
          
        function render() {  
            ctx.fillStyle = '#000';  
            ctx.fillRect(0, 0, canvas.width, canvas.height);  
              
            drawGrid();  
            drawTransformedPattern();  
            drawAnimatedPoints();  
              
            if (isAnimating) {  
                time += 0.016 * animSpeed;  
            }  
              
            animationId = requestAnimationFrame(render);  
        }  
          
        function updateVisualization() {  
            gridDensity = parseInt(document.getElementById('gridDensity').value);  
            animSpeed = parseFloat(document.getElementById('animSpeed').value);  
            zoomLevel = parseFloat(document.getElementById('zoomLevel').value);  
            intensity = parseFloat(document.getElementById('intensity').value);  
            powerParam = parseFloat(document.getElementById('powerParam').value);  
            distortion = parseFloat(document.getElementById('distortion').value);  
              
            // Update particle parameters  
            particleCount = parseInt(document.getElementById('particleCount').value);  
            particleSize = parseFloat(document.getElementById('particleSize').value);  
            orbitRadius = parseFloat(document.getElementById('orbitRadius').value);  
            orbitVariation = parseFloat(document.getElementById('orbitVariation').value);  
              
            document.getElementById('gridDensityValue').textContent = gridDensity;  
            document.getElementById('animSpeedValue').textContent = animSpeed.toFixed(1);  
            document.getElementById('zoomLevelValue').textContent = zoomLevel.toFixed(1);  
            document.getElementById('intensityValue').textContent = intensity.toFixed(1);  
            document.getElementById('powerParamValue').textContent = powerParam.toFixed(1);  
            document.getElementById('distortionValue').textContent = distortion.toFixed(1);  
              
            // Update particle value displays  
            document.getElementById('particleCountValue').textContent = particleCount;  
            document.getElementById('particleSizeValue').textContent = particleSize;  
            document.getElementById('orbitRadiusValue').textContent = orbitRadius.toFixed(1);  
            document.getElementById('orbitVariationValue').textContent = orbitVariation.toFixed(1);  
              
            updateMathDisplay();  
        }  
          
        function updateMathDisplay() {  
            const equation = mathEquations[currentFunction];  
            const adjustedEquation = currentFunction === 9 ? `f(z) = z^${powerParam.toFixed(1)}` : equation;  
              
            document.getElementById('mathEquation').textContent = adjustedEquation;  
            document.getElementById('mathParams').innerHTML = `  
                <div>I: ${intensity.toFixed(1)}</div>  
                <div>P: ${powerParam.toFixed(1)}</div>  
                <div>D: ${distortion.toFixed(1)}</div>  
            `;  
              
            // Format complex numbers  
            const formatComplex = (x, y) => {  
                const real = x.toFixed(2);  
                const imag = Math.abs(y).toFixed(2);  
                const sign = y >= 0 ? '+' : '-';  
                return `${real} ${sign} ${imag}i`;  
            };  
              
            document.getElementById('mathCoords').innerHTML = `  
                <div>z = ${formatComplex(mouseComplexPos.x, mouseComplexPos.y)}</div>  
                <div>f(z) = ${formatComplex(mouseTransformed.x, mouseTransformed.y)}</div>  
            `;  
        }  
          
        function setFunction(index) {  
            currentFunction = index;  
            document.querySelectorAll('.function-btn').forEach((btn, i) => {  
                btn.classList.toggle('active', i === index);  
            });  
            updateStatusBar();  
            updateMathDisplay();  
        }  
          
        function toggleParticles() {  
            showParticles = !showParticles;  
            updateStatusBar();  
        }  
          
        function setPattern(index) {  
            currentPattern = index;  
            document.querySelectorAll('.pattern-btn').forEach((btn, i) => {  
                btn.classList.toggle('active', i === index);  
            });  
            updateStatusBar();  
        }  
          
        function toggleControls() {  
            const panel = document.getElementById('controlsPanel');  
            panel.classList.toggle('open');  
        }  
          
        function toggleInfo() {  
            const panel = document.getElementById('infoPanel');  
            panel.classList.toggle('open');  
        }  
          
        function resetTransform() {  
            offsetX = 0;  
            offsetY = 0;  
            zoomLevel = 2;  
            document.getElementById('zoomLevel').value = 2;  
            updateVisualization();  
        }  
          
        function toggleAnimation() {  
            isAnimating = !isAnimating;  
            updateStatusBar();  
        }  
          
        function changeColorScheme() {  
            colorScheme = (colorScheme + 1) % colorSchemes.length;  
        }  
          
        function toggleGrid() {  
            showGrid = !showGrid;  
            updateStatusBar();  
        }  
          
        function updateStatusBar() {  
            const statusBar = document.getElementById('statusBar');  
            const animStatus = isAnimating ? 'RUNNING' : 'PAUSED';  
            const particleStatus = showParticles ? 'ON' : 'OFF';  
            const funcName = transformFunctions[currentFunction];  
            const patternName = patternTypes[currentPattern];  
            statusBar.textContent = `Function: ${funcName} | Pattern: ${patternName} | Particles: ${particleStatus} | Animation: ${animStatus}`;  
        }  
          
        // Mouse interaction  
        canvas.addEventListener('mousedown', (e) => {  
            isDragging = true;  
            lastMouseX = e.clientX;  
            lastMouseY = e.clientY;  
        });  
          
        canvas.addEventListener('mousemove', (e) => {  
            // Update mouse position for math display  
            const rect = canvas.getBoundingClientRect();  
            const mouseX = e.clientX - rect.left;  
            const mouseY = e.clientY - rect.top;  
              
            mouseComplexPos = screenToComplex(mouseX, mouseY);  
            mouseTransformed = complexTransform(  
                mouseComplexPos.x, mouseComplexPos.y, currentFunction, powerParam, intensity, time  
            );  
              
            if (isDragging) {  
                const deltaX = e.clientX - lastMouseX;  
                const deltaY = e.clientY - lastMouseY;  
                  
                offsetX -= deltaX;  
                offsetY -= deltaY;  
                  
                lastMouseX = e.clientX;  
                lastMouseY = e.clientY;  
            }  
        });  
          
        canvas.addEventListener('mouseup', () => {  
            isDragging = false;  
        });  
          
        canvas.addEventListener('wheel', (e) => {  
            e.preventDefault();  
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;  
            zoomLevel *= zoomFactor;  
            zoomLevel = Math.max(0.1, Math.min(20, zoomLevel));  
              
            document.getElementById('zoomLevel').value = zoomLevel;  
            updateVisualization();  
        });  
          
        // Touch support  
        canvas.addEventListener('touchstart', (e) => {  
            e.preventDefault();  
            if (e.touches.length === 1) {  
                isDragging = true;  
                lastMouseX = e.touches[0].clientX;  
                lastMouseY = e.touches[0].clientY;  
            }  
        });  
          
        canvas.addEventListener('touchmove', (e) => {  
            e.preventDefault();  
            if (isDragging && e.touches.length === 1) {  
                const deltaX = e.touches[0].clientX - lastMouseX;  
                const deltaY = e.touches[0].clientY - lastMouseY;  
                  
                offsetX -= deltaX;  
                offsetY -= deltaY;  
                  
                lastMouseX = e.touches[0].clientX;  
                lastMouseY = e.touches[0].clientY;  
            }  
        });  
          
        canvas.addEventListener('touchend', (e) => {  
            e.preventDefault();  
            isDragging = false;  
        });  
          
        // Initialize  
        window.addEventListener('resize', resizeCanvas);  
        resizeCanvas();  
        updateVisualization();  
        updateStatusBar();  
        render();  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9744b13d27b3db9f',t:'MTc1NjA1NzgzMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
