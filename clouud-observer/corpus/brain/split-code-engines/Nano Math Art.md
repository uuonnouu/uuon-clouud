# Nano Math Art   
![MATHEMATICAL](Attachments/B961F2B1-66EE-4FA6-B60A-F6970896029B.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <meta name="description" content="Nano-Mathematical Art Engine - Exploring the intersection of mathematics, biology, and visual art in 3D space">  
    <meta name="author" content="Phillip A. Ruiz">  
    <meta name="instagram" content="uuon.foundation">  
    <meta name="email" content="phi1@uuonfoundation.com">  
    <meta property="og:title" content="Nano-Mathematical Art Engine">  
    <meta property="og:description" content="Interactive 3D mathematical art generator by Phillip A. Ruiz">  
    <meta property="og:type" content="website">  
    <title>Nano-Mathematical Art Engine | Phillip A. Ruiz</title>  
    <script src="https://cdn.tailwindcss.com"></script>  
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>  
    <style>  
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;500;700&display=swap');  
          
        :root {  
            --primary: #00ffff;  
            --secondary: #4ecdc4;  
            --accent: #ff6b6b;  
            --dark: #0c0c0c;  
            --darker: #050505;  
            --light: rgba(255, 255, 255, 0.9);  
        }  
          
        body {  
            margin: 0;  
            padding: 0;  
            background: linear-gradient(135deg, #0c0c0c, #1a1a2e, #16213e);  
            font-family: 'Space Mono', monospace;  
            color: var(--primary);  
            overflow-x: hidden;  
            min-height: 100vh;  
        }  
          
        .grid-bg {  
            position: fixed;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
            background-image:   
                linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),  
                linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);  
            background-size: 50px 50px;  
            z-index: -1;  
        }  
          
        .canvas-container {  
            position: relative;  
            width: 100%;  
            height: 500px;  
            overflow: hidden;  
            border-radius: 1rem;  
            box-shadow:   
                0 5px 15px rgba(0, 0, 0, 0.2) inset,  
                0 0 30px rgba(0, 255, 255, 0.1);  
            border: 2px solid rgba(0, 255, 255, 0.1);  
            background: rgba(0, 0, 0, 0.3);  
        }  
          
        .control-panel {  
            background: rgba(10, 15, 30, 0.7);  
            border-radius: 1rem;  
            padding: 1.5rem;  
            border: 1px solid rgba(0, 255, 255, 0.15);  
            backdrop-filter: blur(10px);  
            box-shadow:   
                0 8px 32px rgba(0, 0, 0, 0.3),  
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,  
                0 0 15px rgba(0, 255, 255, 0.1) inset;  
        }  
          
        .btn {  
            padding: 0.75rem 1.5rem;  
            background: linear-gradient(45deg, var(--accent), var(--secondary));  
            border: none;  
            border-radius: 2rem;  
            color: white;  
            cursor: pointer;  
            font-family: 'Space Mono', monospace;  
            font-weight: bold;  
            transition: all 0.3s ease;  
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);  
            position: relative;  
            overflow: hidden;  
            display: flex;  
            align-items: center;  
            gap: 0.5rem;  
        }  
          
        .btn::before {  
            content: "";  
            position: absolute;  
            top: 0;  
            left: -100%;  
            width: 100%;  
            height: 100%;  
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);  
            transition: all 0.6s ease;  
        }  
          
        .btn:hover {  
            transform: translateY(-3px);  
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);  
        }  
          
        .btn:hover::before {  
            left: 100%;  
        }  
          
        .slider-container {  
            width: 100%;  
            display: flex;  
            align-items: center;  
            gap: 1rem;  
        }  
          
        .slider {  
            -webkit-appearance: none;  
            width: 100%;  
            height: 6px;  
            border-radius: 5px;  
            background: rgba(0, 0, 0, 0.3);  
            outline: none;  
        }  
          
        .slider::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            appearance: none;  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: var(--secondary);  
            cursor: pointer;  
            box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);  
        }  
          
        .slider::-moz-range-thumb {  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: var(--secondary);  
            cursor: pointer;  
            box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);  
        }  
          
        .parameter-card {  
            background: rgba(0, 0, 0, 0.2);  
            padding: 0.75rem;  
            border-radius: 0.5rem;  
            text-align: center;  
            border: 1px solid rgba(255, 255, 255, 0.05);  
        }  
          
        .parameter-name {  
            font-size: 0.8rem;  
            color: rgba(255, 255, 255, 0.7);  
            margin-bottom: 0.25rem;  
        }  
          
        .parameter-value {  
            font-size: 1.2rem;  
            font-weight: bold;  
            color: var(--primary);  
        }  
          
        .math-formula {  
            font-family: 'Times New Roman', serif;  
            font-style: italic;  
            color: #45b7d1;  
            background: rgba(69, 183, 209, 0.1);  
            padding: 0.5rem 1rem;  
            border-radius: 0.5rem;  
            display: inline-block;  
            margin: 0.5rem 0;  
            border: 1px solid rgba(69, 183, 209, 0.2);  
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
        }  
          
        .particle {  
            position: absolute;  
            width: 3px;  
            height: 3px;  
            background: var(--primary);  
            border-radius: 50%;  
            box-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);  
            opacity: 0.6;  
            pointer-events: none;  
        }  
          
        .dropdown {  
            position: relative;  
            display: inline-block;  
            width: 100%;  
        }  
          
        .dropdown-btn {  
            width: 100%;  
            padding: 0.75rem 1.5rem;  
            background: rgba(0, 0, 0, 0.3);  
            border: 1px solid rgba(0, 255, 255, 0.2);  
            color: var(--light);  
            border-radius: 0.5rem;  
            cursor: pointer;  
            display: flex;  
            justify-content: space-between;  
            align-items: center;  
            font-weight: bold;  
            transition: all 0.3s ease;  
        }  
          
        .dropdown-btn:hover {  
            background: rgba(0, 255, 255, 0.1);  
        }  
          
        .dropdown-content {  
            display: none;  
            position: absolute;  
            width: 100%;  
            background: rgba(10, 15, 30, 0.95);  
            border: 1px solid rgba(0, 255, 255, 0.2);  
            border-radius: 0.5rem;  
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  
            z-index: 10;  
            backdrop-filter: blur(10px);  
            margin-top: 0.5rem;  
            max-height: 300px;  
            overflow-y: auto;  
        }  
          
        .dropdown-content.show {  
            display: block;  
        }  
          
        .dropdown-item {  
            padding: 0.75rem 1.5rem;  
            cursor: pointer;  
            transition: all 0.2s ease;  
            display: flex;  
            align-items: center;  
            gap: 0.75rem;  
        }  
          
        .dropdown-item:hover {  
            background: rgba(0, 255, 255, 0.1);  
        }  
          
        .dropdown-item.active {  
            background: rgba(0, 255, 255, 0.2);  
            color: var(--primary);  
        }  
          
        .dropdown-item-icon {  
            width: 24px;  
            height: 24px;  
            display: flex;  
            align-items: center;  
            justify-content: center;  
        }  
          
        .footer {  
            text-align: center;  
            padding: 2rem 0;  
            color: rgba(255, 255, 255, 0.5);  
            font-size: 0.9rem;  
        }  
          
        .footer a {  
            color: var(--secondary);  
            text-decoration: none;  
            transition: color 0.3s ease;  
        }  
          
        .footer a:hover {  
            color: var(--accent);  
        }  
          
        .glow {  
            box-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);  
        }  
          
        .color-scheme-btn {  
            width: 36px;  
            height: 36px;  
            border-radius: 50%;  
            cursor: pointer;  
            transition: all 0.3s ease;  
            border: 2px solid transparent;  
        }  
          
        .color-scheme-btn:hover {  
            transform: scale(1.1);  
        }  
          
        .color-scheme-btn.active {  
            border: 2px solid white;  
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);  
        }  
          
        .tooltip {  
            position: relative;  
        }  
          
        .tooltip:hover::after {  
            content: attr(data-tooltip);  
            position: absolute;  
            bottom: 100%;  
            left: 50%;  
            transform: translateX(-50%);  
            background: rgba(0, 0, 0, 0.8);  
            color: white;  
            padding: 0.5rem;  
            border-radius: 0.25rem;  
            font-size: 0.75rem;  
            white-space: nowrap;  
            z-index: 10;  
            margin-bottom: 0.5rem;  
        }  
          
        @keyframes float {  
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }  
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.9; }  
        }  
          
        @keyframes pulse {  
            0%, 100% { opacity: 0.6; }  
            50% { opacity: 1; }  
        }  
          
        .loading-overlay {  
            position: absolute;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
            background: rgba(0, 0, 0, 0.7);  
            display: flex;  
            justify-content: center;  
            align-items: center;  
            z-index: 100;  
            border-radius: 1rem;  
            backdrop-filter: blur(5px);  
        }  
          
        .loading-spinner {  
            width: 60px;  
            height: 60px;  
            border: 5px solid rgba(0, 255, 255, 0.3);  
            border-radius: 50%;  
            border-top-color: var(--primary);  
            animation: spin 1s linear infinite;  
        }  
          
        @keyframes spin {  
            0% { transform: rotate(0deg); }  
            100% { transform: rotate(360deg); }  
        }  
    </style>  
</head>  
<body>  
    <div class="grid-bg"></div>  
      
    <div class="container mx-auto px-4 py-8">  
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-2 font-['Orbitron'] bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-clip-text text-transparent">  
            NANO-MATHEMATICAL ART ENGINE  
        </h1>  
        <p class="text-center text-white/70 mb-2">Exploring the intersection of mathematics, biology, and visual art</p>  
        <p class="text-center text-white/50 mb-8">Created by Phillip A. Ruiz</p>  
          
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">  
            <!-- Main Canvas Area -->  
            <div class="lg:col-span-2">  
                <div class="canvas-container" id="mainCanvas">  
                    <!-- Canvas will be rendered here -->  
                    <div class="loading-overlay" id="loadingOverlay">  
                        <div class="loading-spinner"></div>  
                    </div>  
                </div>  
                  
                <div class="mt-4 flex flex-wrap gap-4">  
                    <button class="btn" id="generateBtn">  
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>  
                        </svg>  
                        Generate  
                    </button>  
                    <button class="btn" id="animateBtn">  
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>  
                        </svg>  
                        Animate  
                    </button>  
                    <button class="btn" id="downloadBtn">  
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>  
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>  
                        </svg>  
                        Download  
                    </button>  
                </div>  
            </div>  
              
            <!-- Control Panel -->  
            <div class="control-panel">  
                <h2 class="text-xl font-bold mb-4 font-['Orbitron'] text-[#4ecdc4]">Control Panel</h2>  
                  
                <div class="mb-6">  
                    <h3 class="text-lg mb-2 text-white/80">Visualization Type</h3>  
                    <div class="dropdown">  
                        <button class="dropdown-btn" id="visualizationDropdownBtn">  
                            <span id="currentVisualization">Fractal Generator</span>  
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>  
                            </svg>  
                        </button>  
                        <div class="dropdown-content" id="visualizationDropdown">  
                            <div class="dropdown-item active" data-value="fractal">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>  
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>  
                                    </svg>  
                                </div>  
                                Fractal Generator  
                            </div>  
                            <div class="dropdown-item" data-value="dna">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M.5 0a.5.5 0 0 1 .5.5v15a.5.5 0 0 1-1 0V.5A.5.5 0 0 1 .5 0zM2 1.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-1zm2 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"/>  
                                    </svg>  
                                </div>  
                                DNA Visualizer  
                            </div>  
                            <div class="dropdown-item" data-value="cellular">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4v-1H1V1h9v9h1V1a1 1 0 0 0-1-1H1zm11 15a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3v1h9v1H2v1a1 1 0 0 0 1 1h9zm0-5v1H2v-1h10z"/>  
                                    </svg>  
                                </div>  
                                Cellular Automata  
                            </div>  
                            <div class="dropdown-item" data-value="cube">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>  
                                    </svg>  
                                </div>  
                                3D Cube  
                            </div>  
                            <div class="dropdown-item" data-value="sphere">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>  
                                    </svg>  
                                </div>  
                                3D Sphere  
                            </div>  
                            <div class="dropdown-item" data-value="torus">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>  
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>  
                                    </svg>  
                                </div>  
                                3D Torus  
                            </div>  
                            <div class="dropdown-item" data-value="knot">  
                                <div class="dropdown-item-icon">  
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                        <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zm-1.4.7a.495.495 0 0 1 .7 0l6.516 6.515a.495.495 0 0 1 0 .7L8.35 14.866a.495.495 0 0 1-.7 0L1.134 8.35a.495.495 0 0 1 0-.7L7.65 1.134z"/>  
                                    </svg>  
                                </div>  
                                3D Knot  
                            </div>  
                        </div>  
                    </div>  
                </div>  
                  
                <div class="mb-6">  
                    <h3 class="text-lg mb-2 text-white/80">Parameters</h3>  
                      
                    <div class="grid grid-cols-2 gap-4 mb-4">  
                        <div class="parameter-card">  
                            <div class="parameter-name">Iterations</div>  
                            <div class="parameter-value" id="iterationsValue">100</div>  
                        </div>  
                        <div class="parameter-card">  
                            <div class="parameter-name">Complexity</div>  
                            <div class="parameter-value" id="complexityValue">0.75</div>  
                        </div>  
                        <div class="parameter-card">  
                            <div class="parameter-name">Dimension</div>  
                            <div class="parameter-value" id="dimensionValue">2.8</div>  
                        </div>  
                        <div class="parameter-card">  
                            <div class="parameter-name">Rotation</div>  
                            <div class="parameter-value" id="rotationValue">45°</div>  
                        </div>  
                    </div>  
                      
                    <div class="space-y-4">  
                        <div>  
                            <label class="block text-white/70 text-sm mb-1">Iterations</label>  
                            <div class="slider-container">  
                                <input type="range" min="10" max="500" value="100" class="slider" id="iterationsSlider">  
                                <span class="text-sm">100</span>  
                            </div>  
                        </div>  
                          
                        <div>  
                            <label class="block text-white/70 text-sm mb-1">Complexity</label>  
                            <div class="slider-container">  
                                <input type="range" min="0" max="100" value="75" class="slider" id="complexitySlider">  
                                <span class="text-sm">0.75</span>  
                            </div>  
                        </div>  
                          
                        <div>  
                            <label class="block text-white/70 text-sm mb-1">Dimension</label>  
                            <div class="slider-container">  
                                <input type="range" min="10" max="40" value="28" class="slider" id="dimensionSlider">  
                                <span class="text-sm">2.8</span>  
                            </div>  
                        </div>  
                          
                        <div>  
                            <label class="block text-white/70 text-sm mb-1">Rotation</label>  
                            <div class="slider-container">  
                                <input type="range" min="0" max="360" value="45" class="slider" id="rotationSlider">  
                                <span class="text-sm">45°</span>  
                            </div>  
                        </div>  
                    </div>  
                </div>  
                  
                <div class="mb-6">  
                    <h3 class="text-lg mb-2 text-white/80">Color Scheme</h3>  
                    <div class="flex justify-between">  
                        <div class="color-scheme-btn active tooltip" data-tooltip="Cyan" data-color="cyan" style="background: linear-gradient(45deg, #00ffff, #4ecdc4);"></div>  
                        <div class="color-scheme-btn tooltip" data-tooltip="Red" data-color="red" style="background: linear-gradient(45deg, #ff6b6b, #ff9f1c);"></div>  
                        <div class="color-scheme-btn tooltip" data-tooltip="Teal" data-color="teal" style="background: linear-gradient(45deg, #4ecdc4, #45b7d1);"></div>  
                        <div class="color-scheme-btn tooltip" data-tooltip="Orange" data-color="orange" style="background: linear-gradient(45deg, #ff9f1c, #ff6b6b);"></div>  
                        <div class="color-scheme-btn tooltip" data-tooltip="Purple" data-color="purple" style="background: linear-gradient(45deg, #9b5de5, #f15bb5);"></div>  
                        <div class="color-scheme-btn tooltip" data-tooltip="Green" data-color="green" style="background: linear-gradient(45deg, #00f5d4, #00bbf9);"></div>  
                    </div>  
                </div>  
                  
                <div class="mb-6">  
                    <h3 class="text-lg mb-2 text-white/80">Mathematical Foundation</h3>  
                    <div class="bg-[#0a142a]/40 rounded-lg p-4 border-l-4 border-[#4ecdc4]">  
                        <p class="text-sm text-white/70 mb-2">Current algorithm based on:</p>  
                        <div class="math-formula" id="currentFormula">z_{n+1} = z_n^2 + c</div>  
                        <p class="text-xs text-white/50 mt-2">Mandelbrot Set Equation</p>  
                    </div>  
                </div>  
                  
                <div>  
                    <h3 class="text-lg mb-2 text-white/80">Export Options</h3>  
                    <div class="flex flex-col gap-2">  
                        <button class="btn" id="exportSVG">  
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>  
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>  
                            </svg>  
                            Export as SVG  
                        </button>  
                        <button class="btn" id="exportPNG">  
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">  
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>  
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>  
                            </svg>  
                            Export as PNG  
                        </button>  
                    </div>  
                </div>  
            </div>  
        </div>  
          
        <div class="footer">  
            <p>Created by <a href="mailto:phi1@uuonfoundation.com">Phillip A. Ruiz</a> | <a href="https://instagram.com/uuon.foundation" target="_blank">@uuon.foundation</a></p>  
            <p class="mt-2 text-xs">Nano-Mathematical Art Engine &copy; 2023 | All Rights Reserved</p>  
        </div>  
    </div>  
  
    <script>  
        // Global variables  
        let currentVisualization = 'fractal';  
        let currentColorScheme = 'cyan';  
        let isAnimating = false;  
        let animationId;  
          
        // Canvas and rendering contexts  
        let canvas, ctx;  
        let threeScene, threeCamera, threeRenderer, threeObject;  
          
        // Initialize the application  
        document.addEventListener('DOMContentLoaded', function() {  
            // Initialize the main canvas  
            initMainCanvas();  
              
            // Initialize sliders  
            initSliders();  
              
            // Initialize dropdown  
            initDropdown();  
              
            // Initialize color scheme selection  
            initColorSchemes();  
              
            // Initialize buttons  
            initButtons();  
              
            // Create floating particles  
            createParticles();  
              
            // Hide loading overlay after initialization  
            setTimeout(() => {  
                document.getElementById('loadingOverlay').style.display = 'none';  
            }, 1000);  
        });  
          
        // Initialize the main canvas  
        function initMainCanvas() {  
            const container = document.getElementById('mainCanvas');  
              
            // Create canvas element  
            canvas = document.createElement('canvas');  
            canvas.width = container.offsetWidth;  
            canvas.height = container.offsetHeight;  
            container.appendChild(canvas);  
              
            // Get 2D context  
            ctx = canvas.getContext('2d');  
              
            // Handle window resize  
            window.addEventListener('resize', function() {  
                canvas.width = container.offsetWidth;  
                canvas.height = container.offsetHeight;  
                  
                // Redraw current visualization  
                updateVisualization();  
            });  
              
            // Initialize with fractal visualization  
            drawFractal();  
        }  
          
        // Initialize sliders  
        function initSliders() {  
            const iterationsSlider = document.getElementById('iterationsSlider');  
            const complexitySlider = document.getElementById('complexitySlider');  
            const dimensionSlider = document.getElementById('dimensionSlider');  
            const rotationSlider = document.getElementById('rotationSlider');  
              
            iterationsSlider.addEventListener('input', function() {  
                document.getElementById('iterationsValue').textContent = this.value;  
                this.nextElementSibling.textContent = this.value;  
                updateVisualization();  
            });  
              
            complexitySlider.addEventListener('input', function() {  
                const value = (this.value / 100).toFixed(2);  
                document.getElementById('complexityValue').textContent = value;  
                this.nextElementSibling.textContent = value;  
                updateVisualization();  
            });  
              
            dimensionSlider.addEventListener('input', function() {  
                const value = (this.value / 10).toFixed(1);  
                document.getElementById('dimensionValue').textContent = value;  
                this.nextElementSibling.textContent = value;  
                updateVisualization();  
            });  
              
            rotationSlider.addEventListener('input', function() {  
                document.getElementById('rotationValue').textContent = `${this.value}°`;  
                this.nextElementSibling.textContent = `${this.value}°`;  
                updateVisualization();  
            });  
        }  
          
        // Initialize dropdown  
        function initDropdown() {  
            const dropdownBtn = document.getElementById('visualizationDropdownBtn');  
            const dropdown = document.getElementById('visualizationDropdown');  
            const dropdownItems = document.querySelectorAll('.dropdown-item');  
              
            // Toggle dropdown  
            dropdownBtn.addEventListener('click', function() {  
                dropdown.classList.toggle('show');  
            });  
              
            // Close dropdown when clicking outside  
            window.addEventListener('click', function(event) {  
                if (!event.target.matches('.dropdown-btn') && !event.target.parentNode.matches('.dropdown-btn')) {  
                    dropdown.classList.remove('show');  
                }  
            });  
              
            // Handle dropdown item selection  
            dropdownItems.forEach(item => {  
                item.addEventListener('click', function() {  
                    // Update active state  
                    dropdownItems.forEach(i => i.classList.remove('active'));  
                    this.classList.add('active');  
                      
                    // Update current visualization  
                    currentVisualization = this.getAttribute('data-value');  
                    document.getElementById('currentVisualization').textContent = this.textContent.trim();  
                      
                    // Close dropdown  
                    dropdown.classList.remove('show');  
                      
                    // Show loading overlay  
                    document.getElementById('loadingOverlay').style.display = 'flex';  
                      
                    // Update visualization after a short delay  
                    setTimeout(() => {  
                        // Stop any ongoing animation  
                        if (isAnimating) {  
                            stopAnimation();  
                            document.getElementById('animateBtn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg> Animate';  
                        }  
                          
                        // Clean up Three.js if it was being used  
                        if (threeRenderer && ['cube', 'sphere', 'torus', 'knot'].indexOf(currentVisualization) === -1) {  
                            cleanupThreeJS();  
                        }  
                          
                        // Update visualization  
                        updateVisualization();  
                          
                        // Hide loading overlay  
                        document.getElementById('loadingOverlay').style.display = 'none';  
                    }, 500);  
                });  
            });  
        }  
          
        // Initialize color schemes  
        function initColorSchemes() {  
            const colorSchemes = document.querySelectorAll('.color-scheme-btn');  
              
            colorSchemes.forEach(scheme => {  
                scheme.addEventListener('click', function() {  
                    // Update active state  
                    colorSchemes.forEach(s => s.classList.remove('active'));  
                    this.classList.add('active');  
                      
                    // Update current color scheme  
                    currentColorScheme = this.getAttribute('data-color');  
                      
                    // Update visualization  
                    updateVisualization();  
                });  
            });  
        }  
          
        // Initialize buttons  
        function initButtons() {  
            // Generate button  
            document.getElementById('generateBtn').addEventListener('click', function() {  
                updateVisualization();  
            });  
              
            // Animate button  
            document.getElementById('animateBtn').addEventListener('click', function() {  
                if (isAnimating) {  
                    stopAnimation();  
                    this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg> Animate';  
                } else {  
                    startAnimation();  
                    this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg> Pause';  
                }  
            });  
              
            // Download button  
            document.getElementById('downloadBtn').addEventListener('click', function() {  
                downloadVisualization();  
            });  
              
            // Export buttons  
            document.getElementById('exportSVG').addEventListener('click', function() {  
                exportAsSVG();  
            });  
              
            document.getElementById('exportPNG').addEventListener('click', function() {  
                downloadVisualization();  
            });  
        }  
          
        // Create floating particles  
        function createParticles() {  
            const container = document.querySelector('.container');  
            for (let i = 0; i < 20; i++) {  
                const particle = document.createElement('div');  
                particle.classList.add('particle');  
                particle.style.left = `${Math.random() * 100}%`;  
                particle.style.top = `${Math.random() * 100}%`;  
                particle.style.opacity = Math.random() * 0.5 + 0.1;  
                  
                // Add animation  
                particle.style.animation = `float ${3 + Math.random() * 7}s infinite ease-in-out`;  
                particle.style.animationDelay = `${Math.random() * 5}s`;  
                  
                container.appendChild(particle);  
            }  
        }  
          
        // Update the current visualization  
        function updateVisualization() {  
            switch (currentVisualization) {  
                case 'fractal':  
                    drawFractal();  
                    break;  
                case 'dna':  
                    drawDNA();  
                    break;  
                case 'cellular':  
                    drawCellular();  
                    break;  
                case 'cube':  
                    draw3DShape('cube');  
                    break;  
                case 'sphere':  
                    draw3DShape('sphere');  
                    break;  
                case 'torus':  
                    draw3DShape('torus');  
                    break;  
                case 'knot':  
                    draw3DShape('knot');  
                    break;  
            }  
        }  
          
        // Start animation  
        function startAnimation() {  
            isAnimating = true;  
              
            switch (currentVisualization) {  
                case 'fractal':  
                    animateFractal();  
                    break;  
                case 'dna':  
                    animateDNA();  
                    break;  
                case 'cellular':  
                    animateCellular();  
                    break;  
                case 'cube':  
                case 'sphere':  
                case 'torus':  
                case 'knot':  
                    animate3D();  
                    break;  
            }  
        }  
          
        // Stop animation  
        function stopAnimation() {  
            isAnimating = false;  
            cancelAnimationFrame(animationId);  
        }  
          
        // Download the current visualization  
        function downloadVisualization() {  
            let filename;  
              
            switch (currentVisualization) {  
                case 'fractal':  
                    filename = 'fractal-art.png';  
                    break;  
                case 'dna':  
                    filename = 'dna-visualization.png';  
                    break;  
                case 'cellular':  
                    filename = 'cellular-automata.png';  
                    break;  
                default:  
                    filename = '3d-shape.png';  
                    break;  
            }  
              
            const link = document.createElement('a');  
            link.download = filename;  
              
            if (['cube', 'sphere', 'torus', 'knot'].includes(currentVisualization)) {  
                // For Three.js visualizations  
                threeRenderer.render(threeScene, threeCamera);  
                link.href = threeRenderer.domElement.toDataURL('image/png');  
            } else {  
                // For canvas visualizations  
                link.href = canvas.toDataURL('image/png');  
            }  
              
            link.click();  
        }  
          
        // Export as SVG  
        function exportAsSVG() {  
            // Create SVG representation based on current visualization  
            let svgContent;  
            const width = canvas.width;  
            const height = canvas.height;  
              
            switch (currentVisualization) {  
                case 'fractal':  
                    svgContent = createFractalSVG(width, height);  
                    break;  
                case 'dna':  
                    svgContent = createDNASVG(width, height);  
                    break;  
                case 'cellular':  
                    svgContent = createCellularSVG(width, height);  
                    break;  
                default:  
                    // For 3D shapes, just use a screenshot  
                    downloadVisualization();  
                    return;  
            }  
              
            // Create SVG blob and download  
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });  
            const url = URL.createObjectURL(blob);  
            const link = document.createElement('a');  
            link.download = `${currentVisualization}-visualization.svg`;  
            link.href = url;  
            link.click();  
            URL.revokeObjectURL(url);  
        }  
          
        // Create SVG representation of fractal  
        function createFractalSVG(width, height) {  
            // Create a simplified SVG representation of the fractal  
            const iterations = parseInt(document.getElementById('iterationsSlider').value);  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
              
            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">  
                <rect width="${width}" height="${height}" fill="#000" opacity="0.3" />`;  
              
            // Add a simplified representation of the fractal  
            const points = [];  
            const numPoints = Math.min(iterations * 2, 1000); // Limit number of points for SVG size  
              
            for (let i = 0; i < numPoints; i++) {  
                const t = i / numPoints;  
                const angle = t * Math.PI * 2 * complexity * 10;  
                const radius = width / 4 * (1 - t * 0.5);  
                const x = width / 2 + Math.cos(angle) * radius;  
                const y = height / 2 + Math.sin(angle) * radius;  
                points.push(`${x},${y}`);  
            }  
              
            // Get color based on scheme  
            let color;  
            switch (currentColorScheme) {  
                case 'cyan': color = '#00ffff'; break;  
                case 'red': color = '#ff6b6b'; break;  
                case 'teal': color = '#4ecdc4'; break;  
                case 'orange': color = '#ff9f1c'; break;  
                case 'purple': color = '#9b5de5'; break;  
                case 'green': color = '#00f5d4'; break;  
                default: color = '#00ffff';  
            }  
              
            svgContent += `<polygon points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="1" />`;  
              
            // Add grid lines  
            svgContent += `<g stroke="${color}" stroke-width="0.5" opacity="0.1">`;  
            for (let x = 0; x < width; x += 20) {  
                svgContent += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" />`;  
            }  
            for (let y = 0; y < height; y += 20) {  
                svgContent += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`;  
            }  
            svgContent += `</g>`;  
              
            svgContent += `</svg>`;  
            return svgContent;  
        }  
          
        // Create SVG representation of DNA  
        function createDNASVG(width, height) {  
            // Create a simplified SVG representation of the DNA  
            const iterations = parseInt(document.getElementById('iterationsSlider').value);  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
              
            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">  
                <rect width="${width}" height="${height}" fill="#000" opacity="0.3" />`;  
              
            // Get colors based on scheme  
            let colors;  
            switch (currentColorScheme) {  
                case 'cyan': colors = ['#00ffff', '#4ecdc4', '#45b7d1', '#2c7873']; break;  
                case 'red': colors = ['#ff6b6b', '#ff9f1c', '#f9c80e', '#ff4365']; break;  
                case 'teal': colors = ['#4ecdc4', '#45b7d1', '#33658a', '#2a9d8f']; break;  
                case 'orange': colors = ['#ff9f1c', '#ff6b6b', '#f9c80e', '#ff8c42']; break;  
                case 'purple': colors = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9']; break;  
                case 'green': colors = ['#00f5d4', '#00bbf9', '#3a86ff', '#8338ec']; break;  
                default: colors = ['#00ffff', '#4ecdc4', '#45b7d1', '#2c7873'];  
            }  
              
            // Draw DNA helix  
            const strands = 2;  
            const basePairs = Math.min(20, Math.floor(iterations / 10)); // Limit for SVG size  
            const radius = 40 + complexity * 30;  
              
            // Draw strands  
            for (let strand = 0; strand < strands; strand++) {  
                const points = [];  
                  
                for (let i = 0; i <= basePairs * 10; i++) {  
                    const t = i / (basePairs * 10);  
                    const angle = t * Math.PI * 10 + strand * Math.PI;  
                    const x = width / 2 + Math.cos(angle) * radius;  
                    const y = height * (0.1 + t * 0.8);  
                    points.push(`${x},${y}`);  
                }  
                  
                svgContent += `<polyline points="${points.join(' ')}" fill="none" stroke="${colors[strand]}" stroke-width="3" />`;  
            }  
              
            // Draw base pairs  
            for (let i = 0; i <= basePairs; i++) {  
                const t = i / basePairs;  
                const angle1 = t * Math.PI * 10;  
                const angle2 = t * Math.PI * 10 + Math.PI;  
                const x1 = width / 2 + Math.cos(angle1) * radius;  
                const y1 = height * (0.1 + t * 0.8);  
                const x2 = width / 2 + Math.cos(angle2) * radius;  
                const y2 = height * (0.1 + t * 0.8);  
                  
                svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors[i % 2 + 2]}" stroke-width="2" />`;  
                  
                // Draw nucleotides  
                svgContent += `<circle cx="${x1}" cy="${y1}" r="5" fill="${colors[0]}" />`;  
                svgContent += `<circle cx="${x2}" cy="${y2}" r="5" fill="${colors[1]}" />`;  
            }  
              
            svgContent += `</svg>`;  
            return svgContent;  
        }  
          
        // Create SVG representation of cellular automata  
        function createCellularSVG(width, height) {  
            // Create a simplified SVG representation of cellular automata  
            const cellSize = 10;  
            const cols = Math.floor(width / cellSize);  
            const rows = Math.floor(height / cellSize);  
              
            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">  
                <rect width="${width}" height="${height}" fill="#000" opacity="0.3" />`;  
              
            // Get color based on scheme  
            let color;  
            switch (currentColorScheme) {  
                case 'cyan': color = '#00ffff'; break;  
                case 'red': color = '#ff6b6b'; break;  
                case 'teal': color = '#4ecdc4'; break;  
                case 'orange': color = '#ff9f1c'; break;  
                case 'purple': color = '#9b5de5'; break;  
                case 'green': color = '#00f5d4'; break;  
                default: color = '#00ffff';  
            }  
              
            // Create random cells  
            for (let i = 0; i < cols; i++) {  
                for (let j = 0; j < rows; j++) {  
                    if (Math.random() > 0.8) {  
                        const x = i * cellSize;  
                        const y = j * cellSize;  
                        svgContent += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" opacity="0.8" />`;  
                    }  
                }  
            }  
              
            // Add grid lines  
            svgContent += `<g stroke="${color}" stroke-width="0.5" opacity="0.1">`;  
            for (let i = 0; i <= cols; i++) {  
                svgContent += `<line x1="${i * cellSize}" y1="0" x2="${i * cellSize}" y2="${height}" />`;  
            }  
            for (let j = 0; j <= rows; j++) {  
                svgContent += `<line x1="0" y1="${j * cellSize}" x2="${width}" y2="${j * cellSize}" />`;  
            }  
            svgContent += `</g>`;  
              
            svgContent += `</svg>`;  
            return svgContent;  
        }  
          
        // Draw fractal visualization  
        function drawFractal() {  
            const iterations = parseInt(document.getElementById('iterationsSlider').value);  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
            const dimension = parseFloat(document.getElementById('dimensionSlider').value) / 10;  
            const rotation = parseInt(document.getElementById('rotationSlider').value) * Math.PI / 180;  
              
            const width = canvas.width;  
            const height = canvas.height;  
              
            ctx.clearRect(0, 0, width, height);  
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';  
            ctx.fillRect(0, 0, width, height);  
              
            // Update formula display  
            document.getElementById('currentFormula').textContent = 'z_{n+1} = z_n^2 + c';  
              
            // Draw Mandelbrot set  
            const imageData = ctx.createImageData(width, height);  
            const data = imageData.data;  
              
            const xMin = -2.5;  
            const xMax = 1;  
            const yMin = -1.25;  
            const yMax = 1.25;  
              
            // Apply rotation  
            const centerX = (xMin + xMax) / 2;  
            const centerY = (yMin + yMax) / 2;  
              
            // Get color scheme  
            let colors;  
            switch (currentColorScheme) {  
                case 'cyan':  
                    colors = { r: [0, 64, 0], g: [128, 255, 128], b: [192, 255, 192] };  
                    break;  
                case 'red':  
                    colors = { r: [192, 255, 192], g: [64, 128, 64], b: [0, 64, 0] };  
                    break;  
                case 'teal':  
                    colors = { r: [32, 64, 32], g: [128, 255, 128], b: [128, 255, 128] };  
                    break;  
                case 'orange':  
                    colors = { r: [192, 255, 192], g: [128, 255, 128], b: [32, 64, 32] };  
                    break;  
                case 'purple':  
                    colors = { r: [155, 255, 155], g: [94, 128, 94], b: [229, 255, 229] };  
                    break;  
                case 'green':  
                    colors = { r: [0, 64, 0], g: [245, 255, 245], b: [212, 255, 212] };  
                    break;  
                default:  
                    colors = { r: [0, 64, 0], g: [128, 255, 128], b: [192, 255, 192] };  
            }  
              
            for (let x = 0; x < width; x++) {  
                for (let y = 0; y < height; y++) {  
                    // Map pixel coordinates to complex plane  
                    let zx = xMin + (xMax - xMin) * x / width;  
                    let zy = yMin + (yMax - yMin) * y / height;  
                      
                    // Apply rotation around center  
                    const dx = zx - centerX;  
                    const dy = zy - centerY;  
                    zx = centerX + dx * Math.cos(rotation) - dy * Math.sin(rotation);  
                    zy = centerY + dx * Math.sin(rotation) + dy * Math.cos(rotation);  
                      
                    // Apply complexity factor  
                    const cx = zx * complexity;  
                    const cy = zy * complexity;  
                      
                    // Initialize z = 0  
                    let zx0 = 0;  
                    let zy0 = 0;  
                      
                    let iter = 0;  
                    const maxIter = iterations;  
                      
                    // Iterate z = z^2 + c  
                    while (zx0 * zx0 + zy0 * zy0 < 4 && iter < maxIter) {  
                        const tmp = zx0 * zx0 - zy0 * zy0 + cx;  
                        zy0 = dimension * zx0 * zy0 + cy;  
                        zx0 = tmp;  
                        iter++;  
                    }  
                      
                    // Color based on iteration count  
                    const idx = (y * width + x) * 4;  
                      
                    if (iter === maxIter) {  
                        // Point is in the set - black  
                        data[idx] = 0;  
                        data[idx + 1] = 0;  
                        data[idx + 2] = 0;  
                        data[idx + 3] = 255;  
                    } else {  
                        // Point is outside the set - color based on iteration count and scheme  
                        // Smooth coloring  
                        const smoothed = iter + 1 - Math.log(Math.log(Math.sqrt(zx0 * zx0 + zy0 * zy0))) / Math.log(2);  
                        const normalized = smoothed / maxIter;  
                          
                        const r = colors.r[0] + Math.sin(normalized * Math.PI) * (colors.r[1] - colors.r[0]) + Math.sin(normalized * Math.PI * 2) * (colors.r[2] - colors.r[0]);  
                        const g = colors.g[0] + Math.sin(normalized * Math.PI) * (colors.g[1] - colors.g[0]) + Math.sin(normalized * Math.PI * 2) * (colors.g[2] - colors.g[0]);  
                        const b = colors.b[0] + Math.sin(normalized * Math.PI) * (colors.b[1] - colors.b[0]) + Math.sin(normalized * Math.PI * 2) * (colors.b[2] - colors.b[0]);  
                          
                        data[idx] = Math.floor(r);  
                        data[idx + 1] = Math.floor(g);  
                        data[idx + 2] = Math.floor(b);  
                        data[idx + 3] = 255;  
                    }  
                }  
            }  
              
            ctx.putImageData(imageData, 0, 0);  
              
            // Draw grid overlay  
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';  
            ctx.lineWidth = 1;  
              
            // Horizontal lines  
            for (let y = 0; y < height; y += 20) {  
                ctx.beginPath();  
                ctx.moveTo(0, y);  
                ctx.lineTo(width, y);  
                ctx.stroke();  
            }  
              
            // Vertical lines  
            for (let x = 0; x < width; x += 20) {  
                ctx.beginPath();  
                ctx.moveTo(x, 0);  
                ctx.lineTo(x, height);  
                ctx.stroke();  
            }  
        }  
          
        // Animate fractal  
        function animateFractal() {  
            if (!isAnimating) return;  
              
            // Update rotation for animation  
            const rotationSlider = document.getElementById('rotationSlider');  
            let currentRotation = parseInt(rotationSlider.value);  
            currentRotation = (currentRotation + 1) % 360;  
            rotationSlider.value = currentRotation;  
            document.getElementById('rotationValue').textContent = `${currentRotation}°`;  
            rotationSlider.nextElementSibling.textContent = `${currentRotation}°`;  
              
            // Redraw fractal  
            drawFractal();  
              
            animationId = requestAnimationFrame(animateFractal);  
        }  
          
        // Draw DNA visualization  
        function drawDNA() {  
            const iterations = parseInt(document.getElementById('iterationsSlider').value);  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
            const dimension = parseFloat(document.getElementById('dimensionSlider').value) / 10;  
            const rotation = parseInt(document.getElementById('rotationSlider').value) * Math.PI / 180;  
              
            const width = canvas.width;  
            const height = canvas.height;  
              
            ctx.clearRect(0, 0, width, height);  
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';  
            ctx.fillRect(0, 0, width, height);  
              
            // Update formula display  
            document.getElementById('currentFormula').textContent = 'DNA(t) = A · sin(ωt) + B · cos(ωt)';  
              
            // Get color scheme  
            let colors;  
            switch (currentColorScheme) {  
                case 'cyan':  
                    colors = ['#00ffff', '#4ecdc4', '#45b7d1', '#2c7873'];  
                    break;  
                case 'red':  
                    colors = ['#ff6b6b', '#ff9f1c', '#f9c80e', '#ff4365'];  
                    break;  
                case 'teal':  
                    colors = ['#4ecdc4', '#45b7d1', '#33658a', '#2a9d8f'];  
                    break;  
                case 'orange':  
                    colors = ['#ff9f1c', '#ff6b6b', '#f9c80e', '#ff8c42'];  
                    break;  
                case 'purple':  
                    colors = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9'];  
                    break;  
                case 'green':  
                    colors = ['#00f5d4', '#00bbf9', '#3a86ff', '#8338ec'];  
                    break;  
                default:  
                    colors = ['#00ffff', '#4ecdc4', '#45b7d1', '#2c7873'];  
            }  
              
            // Draw DNA helix  
            const time = Date.now() * 0.001;  
            const strands = 2;  
            const basePairs = Math.max(5, Math.floor(iterations / 10));  
            const radius = 40 + complexity * 30;  
            const twistFactor = dimension;  
              
            // Create 3D points for DNA  
            const points = [];  
            const connections = [];  
              
            // Generate points for strands  
            for (let strand = 0; strand < strands; strand++) {  
                const strandPoints = [];  
                  
                for (let i = 0; i <= basePairs; i++) {  
                    const t = i / basePairs;  
                    const angle = t * Math.PI * 10 * twistFactor + time * 2 + rotation;  
                      
                    // 3D coordinates  
                    const x = Math.cos(angle + strand * Math.PI) * radius;  
                    const y = height * (0.1 + t * 0.8) - height / 2;  
                    const z = Math.sin(angle + strand * Math.PI) * radius;  
                      
                    strandPoints.push({ x, y, z });  
                }  
                  
                points.push(strandPoints);  
            }  
              
            // Create base pair connections  
            for (let i = 0; i <= basePairs; i++) {  
                connections.push([  
                    points[0][i],  
                    points[1][i]  
                ]);  
            }  
              
            // Apply 3D perspective  
            const centerX = width / 2;  
            const centerY = height / 2;  
            const perspective = 800;  
              
            // Draw connections (back to front)  
            const allPoints = [];  
              
            // Collect all points with their metadata  
            for (let strand = 0; strand < strands; strand++) {  
                for (let i = 0; i <= basePairs; i++) {  
                    allPoints.push({  
                        point: points[strand][i],  
                        strand: strand,  
                        index: i  
                    });  
                }  
            }  
              
            // Sort points by Z for proper depth rendering  
            allPoints.sort((a, b) => a.point.z - b.point.z);  
              
            // Draw strand connections  
            for (let strand = 0; strand < strands; strand++) {  
                for (let i = 0; i < basePairs; i++) {  
                    const p1 = points[strand][i];  
                    const p2 = points[strand][i + 1];  
                      
                    // Project to 2D  
                    const scale1 = perspective / (perspective + p1.z);  
                    const scale2 = perspective / (perspective + p2.z);  
                      
                    const x1 = centerX + p1.x * scale1;  
                    const y1 = centerY + p1.y * scale1;  
                    const x2 = centerX + p2.x * scale2;  
                    const y2 = centerY + p2.y * scale2;  
                      
                    ctx.beginPath();  
                    ctx.strokeStyle = strand === 0 ? colors[0] : colors[1];  
                    ctx.lineWidth = 3 * Math.min(scale1, scale2);  
                    ctx.moveTo(x1, y1);  
                    ctx.lineTo(x2, y2);  
                    ctx.stroke();  
                }  
            }  
              
            // Draw base pair connections and nucleotides  
            for (const item of allPoints) {  
                const { point, strand, index } = item;  
                  
                // Project to 2D  
                const scale = perspective / (perspective + point.z);  
                const x = centerX + point.x * scale;  
                const y = centerY + point.y * scale;  
                  
                // Draw base pair connections  
                if (index < basePairs && strand === 0) {  
                    const p1 = points[0][index];  
                    const p2 = points[1][index];  
                      
                    // Project to 2D  
                    const scale1 = perspective / (perspective + p1.z);  
                    const scale2 = perspective / (perspective + p2.z);  
                      
                    const x1 = centerX + p1.x * scale1;  
                    const y1 = centerY + p1.y * scale1;  
                    const x2 = centerX + p2.x * scale2;  
                    const y2 = centerY + p2.y * scale2;  
                      
                    ctx.beginPath();  
                    ctx.strokeStyle = index % 2 === 0 ? colors[2] : colors[3];  
                    ctx.lineWidth = 2 * Math.min(scale1, scale2);  
                    ctx.moveTo(x1, y1);  
                    ctx.lineTo(x2, y2);  
                    ctx.stroke();  
                }  
                  
                // Draw nucleotides  
                ctx.beginPath();  
                ctx.fillStyle = colors[(strand * 2 + index) % 4];  
                ctx.arc(x, y, 5 * scale, 0, Math.PI * 2);  
                ctx.fill();  
                  
                // Add glow effect  
                ctx.beginPath();  
                ctx.fillStyle = `${colors[(strand * 2 + index) % 4]}40`;  
                ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);  
                ctx.fill();  
            }  
        }  
          
        // Animate DNA  
        function animateDNA() {  
            if (!isAnimating) return;  
              
            drawDNA();  
              
            animationId = requestAnimationFrame(animateDNA);  
        }  
          
        // Draw cellular automata  
        function drawCellular() {  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
            const rotation = parseInt(document.getElementById('rotationSlider').value) * Math.PI / 180;  
              
            const width = canvas.width;  
            const height = canvas.height;  
              
            ctx.clearRect(0, 0, width, height);  
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';  
            ctx.fillRect(0, 0, width, height);  
              
            // Update formula display  
            document.getElementById('currentFormula').textContent = 'S(t+1) = R(S(t), N(S(t)))';  
              
            // Initialize grid if not exists  
            if (!window.cellGrid) {  
                initCellGrid();  
            }  
              
            // Draw cell grid  
            drawCellGrid();  
        }  
          
        // Initialize cell grid for cellular automata  
        function initCellGrid() {  
            const cellSize = 10;  
            const width = canvas.width;  
            const height = canvas.height;  
              
            const cols = Math.floor(width / cellSize);  
            const rows = Math.floor(height / cellSize);  
              
            window.cellSize = cellSize;  
            window.cellGrid = new Array(cols);  
            window.nextGrid = new Array(cols);  
              
            for (let i = 0; i < cols; i++) {  
                window.cellGrid[i] = new Array(rows);  
                window.nextGrid[i] = new Array(rows);  
                  
                for (let j = 0; j < rows; j++) {  
                    window.cellGrid[i][j] = Math.random() > 0.8 ? 1 : 0;  
                    window.nextGrid[i][j] = 0;  
                }  
            }  
              
            window.generation = 0;  
        }  
          
        // Draw cell grid for cellular automata  
        function drawCellGrid() {  
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
            const rotation = parseInt(document.getElementById('rotationSlider').value) * Math.PI / 180;  
              
            const width = canvas.width;  
            const height = canvas.height;  
            const cellSize = window.cellSize;  
            const cols = Math.floor(width / cellSize);  
            const rows = Math.floor(height / cellSize);  
              
            // Get color scheme  
            let baseHue;  
            switch (currentColorScheme) {  
                case 'cyan': baseHue = 180; break;  
                case 'red': baseHue = 0; break;  
                case 'teal': baseHue = 170; break;  
                case 'orange': baseHue = 30; break;  
                case 'purple': baseHue = 280; break;  
                case 'green': baseHue = 150; break;  
                default: baseHue = 180;  
            }  
              
            // Create 3D effect with cell heights  
            const perspective = 800;  
            const centerX = width / 2;  
            const centerY = height / 2;  
              
            // Create 3D points from grid  
            const points = [];  
              
            for (let i = 0; i < cols; i++) {  
                for (let j = 0; j < rows; j++) {  
                    if (window.cellGrid[i][j] === 1) {  
                        const x = (i - cols / 2) * cellSize;  
                        const y = (j - rows / 2) * cellSize;  
                        const z = 0;  
                          
                        // Apply rotation  
                        const rotX = x * Math.cos(rotation) - z * Math.sin(rotation);  
                        const rotZ = x * Math.sin(rotation) + z * Math.cos(rotation);  
                          
                        points.push({   
                            x: rotX,   
                            y: y,   
                            z: rotZ,  
                            i: i,  
                            j: j  
                        });  
                    }  
                }  
            }  
              
            // Sort points by Z for proper depth rendering  
            points.sort((a, b) => a.z - b.z);  
              
            // Draw cells with 3D perspective  
            for (const point of points) {  
                const { x, y, z, i, j } = point;  
                  
                // Project to 2D  
                const scale = perspective / (perspective + z);  
                const projX = centerX + x * scale;  
                const projY = centerY + y * scale;  
                  
                // Color based on position and complexity  
                const hue = (baseHue + (i / cols * 60 + j / rows * 60)) % 360;  
                const saturation = 80 + complexity * 20;  
                const lightness = 50 + complexity * 10;  
                  
                // Draw cell with 3D effect  
                ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;  
                  
                // Draw as 3D cube  
                const size = cellSize * scale;  
                const height = cellSize * (0.5 + complexity);  
                  
                // Top face  
                ctx.beginPath();  
                ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;  
                ctx.fillRect(projX - size/2, projY - size/2, size, size);  
                  
                // Add glow effect  
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;  
                ctx.fillRect(projX - size/2 - 1, projY - size/2 - 1, size + 2, size + 2);  
            }  
              
            // Draw grid lines  
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';  
            ctx.lineWidth = 0.5;  
              
            for (let i = 0; i <= cols; i++) {  
                ctx.beginPath();  
                ctx.moveTo(i * cellSize, 0);  
                ctx.lineTo(i * cellSize, height);  
                ctx.stroke();  
            }  
              
            for (let j = 0; j <= rows; j++) {  
                ctx.beginPath();  
                ctx.moveTo(0, j * cellSize);  
                ctx.lineTo(width, j * cellSize);  
                ctx.stroke();  
            }  
        }  
          
        // Update cell grid for cellular automata  
        function updateCellGrid() {  
            const cols = window.cellGrid.length;  
            const rows = window.cellGrid[0].length;  
              
            // Conway's Game of Life rules  
            for (let i = 0; i < cols; i++) {  
                for (let j = 0; j < rows; j++) {  
                    // Count neighbors  
                    let neighbors = 0;  
                    for (let di = -1; di <= 1; di++) {  
                        for (let dj = -1; dj <= 1; dj++) {  
                            if (di === 0 && dj === 0) continue;  
                              
                            const ni = (i + di + cols) % cols;  
                            const nj = (j + dj + rows) % rows;  
                              
                            neighbors += window.cellGrid[ni][nj];  
                        }  
                    }  
                      
                    // Apply rules  
                    if (window.cellGrid[i][j] === 1) {  
                        // Live cell  
                        window.nextGrid[i][j] = (neighbors === 2 || neighbors === 3) ? 1 : 0;  
                    } else {  
                        // Dead cell  
                        window.nextGrid[i][j] = (neighbors === 3) ? 1 : 0;  
                    }  
                }  
            }  
              
            // Swap grids  
            [window.cellGrid, window.nextGrid] = [window.nextGrid, window.cellGrid];  
            window.generation++;  
        }  
          
        // Animate cellular automata  
        function animateCellular() {  
            if (!isAnimating) return;  
              
            updateCellGrid();  
            drawCellGrid();  
              
            animationId = requestAnimationFrame(animateCellular);  
        }  
          
        // Draw 3D shape  
        function draw3DShape(shape) {  
            // Clean up previous Three.js instance if exists  
            cleanupThreeJS();  
              
            // Get container dimensions  
            const container = document.getElementById('mainCanvas');  
            const width = container.offsetWidth;  
            const height = container.offsetHeight;  
              
            // Create Three.js scene  
            threeScene = new THREE.Scene();  
              
            // Create camera  
            threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);  
            threeCamera.position.z = 5;  
              
            // Create renderer  
            threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });  
            threeRenderer.setSize(width, height);  
            threeRenderer.setClearColor(0x000000, 0);  
            container.appendChild(threeRenderer.domElement);  
              
            // Add lights  
            const ambientLight = new THREE.AmbientLight(0x404040);  
            threeScene.add(ambientLight);  
              
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  
            directionalLight.position.set(1, 1, 1);  
            threeScene.add(directionalLight);  
              
            // Create shape  
            createShape(shape);  
              
            // Start animation loop  
            animate3D();  
              
            // Update formula display based on shape  
            switch (shape) {  
                case 'cube':  
                    document.getElementById('currentFormula').textContent = 'V = a^3';  
                    break;  
                case 'sphere':  
                    document.getElementById('currentFormula').textContent = 'V = \\frac{4}{3}\\pi r^3';  
                    break;  
                case 'torus':  
                    document.getElementById('currentFormula').textContent = 'V = 2\\pi^2 R r^2';  
                    break;  
                case 'knot':  
                    document.getElementById('currentFormula').textContent = 'K(p,q) = \\{(x,y,z) | x = r \\cdot cos(qt)\\}';  
                    break;  
            }  
        }  
          
        // Create 3D shape  
        function createShape(shape) {  
            // Remove current object if exists  
            if (threeObject) {  
                threeScene.remove(threeObject);  
            }  
              
            const complexity = parseFloat(document.getElementById('complexitySlider').value) / 100;  
            const dimension = parseFloat(document.getElementById('dimensionSlider').value) / 10;  
              
            // Get color scheme  
            let color;  
            switch (currentColorScheme) {  
                case 'cyan': color = 0x00ffff; break;  
                case 'red': color = 0xff6b6b; break;  
                case 'teal': color = 0x4ecdc4; break;  
                case 'orange': color = 0xff9f1c; break;  
                case 'purple': color = 0x9b5de5; break;  
                case 'green': color = 0x00f5d4; break;  
                default: color = 0x00ffff;  
            }  
              
            let geometry;  
              
            // Create geometry based on shape  
            switch (shape) {  
                case 'cube':  
                    const size = 1 + dimension * 0.5;  
                    geometry = new THREE.BoxGeometry(size, size, size);  
                    break;  
                case 'sphere':  
                    const radius = 1 + dimension * 0.5;  
                    const segments = Math.floor(8 + complexity * 24);  
                    geometry = new THREE.SphereGeometry(radius, segments, segments);  
                    break;  
                case 'torus':  
                    const torusRadius = 1 + dimension * 0.3;  
                    const tube = 0.3 + complexity * 0.2;  
                    const radialSegments = Math.floor(8 + complexity * 24);  
                    const tubularSegments = Math.floor(24 + complexity * 100);  
                    geometry = new THREE.TorusGeometry(torusRadius, tube, radialSegments, tubularSegments);  
                    break;  
                case 'knot':  
                    const knotRadius = 1 + dimension * 0.3;  
                    const knotTube = 0.2 + complexity * 0.2;  
                    const knotTubularSegments = Math.floor(64 + complexity * 100);  
                    const knotRadialSegments = Math.floor(8 + complexity * 12);  
                    const p = Math.floor(2 + complexity * 5);  
                    const q = Math.floor(3 + complexity * 5);  
                    geometry = new THREE.TorusKnotGeometry(knotRadius, knotTube, knotTubularSegments, knotRadialSegments, p, q);  
                    break;  
            }  
              
            // Create material  
            const material = new THREE.MeshPhongMaterial({  
                color: color,  
                transparent: true,  
                opacity: 0.8,  
                wireframe: complexity > 0.7,  
                specular: 0xffffff,  
                shininess: 100  
            });  
              
            // Create mesh  
            const mesh = new THREE.Mesh(geometry, material);  
              
            // Add wireframe if not already wireframe  
            if (!material.wireframe) {  
                const wireframe = new THREE.LineSegments(  
                    new THREE.EdgesGeometry(geometry),  
                    new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })  
                );  
                mesh.add(wireframe);  
            }  
              
            threeScene.add(mesh);  
            threeObject = mesh;  
        }  
          
        // Animate 3D shape  
        function animate3D() {  
            if (!threeRenderer) return;  
              
            if (threeObject) {  
                const rotation = parseInt(document.getElementById('rotationSlider').value) * 0.01;  
                threeObject.rotation.x += 0.01;  
                threeObject.rotation.y += 0.01;  
            }  
              
            threeRenderer.render(threeScene, threeCamera);  
              
            if (isAnimating) {  
                animationId = requestAnimationFrame(animate3D);  
            } else {  
                // Render one more frame  
                threeRenderer.render(threeScene, threeCamera);  
            }  
        }  
          
        // Clean up Three.js  
        function cleanupThreeJS() {  
            if (threeRenderer) {  
                // Remove renderer from DOM  
                const container = document.getElementById('mainCanvas');  
                const rendererElement = threeRenderer.domElement;  
                if (container.contains(rendererElement)) {  
                    container.removeChild(rendererElement);  
                }  
                  
                // Dispose resources  
                if (threeObject) {  
                    if (threeObject.geometry) threeObject.geometry.dispose();  
                    if (threeObject.material) {  
                        if (Array.isArray(threeObject.material)) {  
                            threeObject.material.forEach(material => material.dispose());  
                        } else {  
                            threeObject.material.dispose();  
                        }  
                    }  
                    threeScene.remove(threeObject);  
                }  
                  
                threeRenderer.dispose();  
                threeRenderer = null;  
                threeScene = null;  
                threeCamera = null;  
                threeObject = null;  
            }  
        }  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601b0b80471c95d',t:'MTc1MjY3MDkwOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
