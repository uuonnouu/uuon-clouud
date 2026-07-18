# Fabric Designer Prototype  
![Image](Attachments/29F229C9-F712-4FF9-8ADE-BDC1AE2267D1.heic)  
#   
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Vector Symmetrical Fabric Designer</title>  
    <style>  
        body {  
            margin: 0;  
            padding: 0;  
            background: radial-gradient(circle at center, #1a0033, #000);  
            font-family: 'Courier New', monospace;  
            color: #fff;  
            overflow: hidden;  
            height: 100vh;  
        }  
  
        .container {  
            position: relative;  
            width: 100vw;  
            height: 100vh;  
            display: flex;  
            justify-content: center;  
            align-items: center;  
        }  
          
        canvas {  
            border: 2px solid #4a0080;  
            box-shadow: 0 0 50px rgba(138, 43, 226, 0.5),   
                        0 0 100px rgba(138, 43, 226, 0.3),  
                        0 0 150px rgba(0, 255, 255, 0.2);  
        }  
          
        .controls {  
            position: absolute;  
            top: 20px;  
            left: 20px;  
            background: rgba(10, 0, 20, 0.85);  
            padding: 20px;  
            border-radius: 15px;  
            border: 1px solid #4a0080;  
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.4), inset 0 0 10px rgba(138, 43, 226, 0.2);  
            backdrop-filter: blur(10px);  
            z-index: 100;  
            max-width: 220px;  
        }  
          
        .control-group {  
            margin-bottom: 15px;  
            position: relative;  
        }  
          
        .control-title {  
            font-size: 14px;  
            font-weight: bold;  
            margin-bottom: 10px;  
            color: #d9a9ff;  
            text-shadow: 0 0 5px #bb88ff;  
            letter-spacing: 1px;  
        }  
          
        label {  
            display: block;  
            margin-bottom: 5px;  
            color: #bb88ff;  
            font-size: 12px;  
        }  
          
        input[type="range"] {  
            width: 150px;  
            margin-right: 10px;  
            -webkit-appearance: none;  
            height: 5px;  
            background: linear-gradient(90deg, #2a0040, #8a2be2);  
            border-radius: 5px;  
            outline: none;  
        }  
          
        input[type="range"]::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            width: 15px;  
            height: 15px;  
            background: #d9a9ff;  
            border-radius: 50%;  
            cursor: pointer;  
            box-shadow: 0 0 5px rgba(138, 43, 226, 0.8);  
        }  
          
        select {  
            width: 150px;  
            background: #2a0040;  
            color: #fff;  
            border: 1px solid #4a0080;  
            padding: 5px;  
            border-radius: 5px;  
            outline: none;  
            cursor: pointer;  
        }  
          
        button {  
            background: linear-gradient(45deg, #4a0080, #8a2be2);  
            color: white;  
            border: none;  
            padding: 8px 12px;  
            margin: 3px;  
            border-radius: 8px;  
            cursor: pointer;  
            font-size: 11px;  
            transition: all 0.3s ease;  
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);  
            position: relative;  
            overflow: hidden;  
        }  
          
        button:hover {  
            background: linear-gradient(45deg, #6a00a0, #aa4bc2);  
            transform: translateY(-2px) scale(1.05);  
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);  
        }  
          
        button:active {  
            transform: translateY(1px);  
        }  
          
        button::after {  
            content: '';  
            position: absolute;  
            top: -50%;  
            left: -50%;  
            width: 200%;  
            height: 200%;  
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);  
            transform: rotate(45deg);  
            transition: all 0.3s ease;  
            opacity: 0;  
        }  
          
        button:hover::after {  
            animation: shine 1.5s ease;  
        }  
          
        @keyframes shine {  
            0% { opacity: 0; transform: translateX(-100%) rotate(45deg); }  
            50% { opacity: 1; }  
            100% { opacity: 0; transform: translateX(100%) rotate(45deg); }  
        }  
          
        .particles {  
            position: fixed;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
            pointer-events: none;  
            z-index: -1;  
        }  
          
        .particle {  
            position: absolute;  
            background: radial-gradient(circle, rgba(138, 43, 226, 0.8) 0%, rgba(138, 43, 226, 0) 70%);  
            border-radius: 50%;  
            opacity: 0;  
            animation: float 15s infinite ease-in-out;  
        }  
          
        @keyframes float {  
            0% { transform: translateY(0) translateX(0); opacity: 0; }  
            10% { opacity: 0.8; }  
            90% { opacity: 0.4; }  
            100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }  
        }  
          
        .glow-effect {  
            position: absolute;  
            width: 300px;  
            height: 300px;  
            border-radius: 50%;  
            background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, rgba(0, 0, 0, 0) 70%);  
            pointer-events: none;  
            z-index: -1;  
            animation: pulse 8s infinite alternate;  
        }  
          
        @keyframes pulse {  
            0% { transform: scale(1); opacity: 0.3; }  
            50% { transform: scale(1.5); opacity: 0.5; }  
            100% { transform: scale(1); opacity: 0.3; }  
        }  
          
        .fabric-patterns {  
            position: absolute;  
            top: 20px;  
            left: 250px;  
            background: rgba(10, 0, 20, 0.85);  
            padding: 15px;  
            border-radius: 15px;  
            border: 1px solid #4a0080;  
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.4), inset 0 0 10px rgba(138, 43, 226, 0.2);  
            backdrop-filter: blur(10px);  
            z-index: 100;  
        }  
          
        .fabric-grid {  
            display: grid;  
            grid-template-columns: repeat(3, 1fr);  
            gap: 10px;  
        }  
          
        .fabric-preview {  
            width: 50px;  
            height: 50px;  
            border-radius: 5px;  
            cursor: pointer;  
            transition: transform 0.3s ease;  
            border: 1px solid #4a0080;  
            overflow: hidden;  
            position: relative;  
        }  
          
        .fabric-preview:hover {  
            transform: scale(1.1);  
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.6);  
        }  
          
        .fabric-preview svg {  
            width: 100%;  
            height: 100%;  
        }  
          
        .fabric-preview.selected {  
            border: 2px solid #ff00ff;  
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.6);  
        }  
          
        .color-palette {  
            display: flex;  
            flex-wrap: wrap;  
            gap: 5px;  
            margin-top: 10px;  
        }  
          
        .color-swatch {  
            width: 25px;  
            height: 25px;  
            border-radius: 50%;  
            cursor: pointer;  
            transition: transform 0.2s ease;  
            border: 1px solid rgba(255, 255, 255, 0.3);  
        }  
          
        .color-swatch:hover {  
            transform: scale(1.2);  
        }  
          
        .color-swatch.selected {  
            border: 2px solid white;  
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);  
        }  
          
        .info {  
            position: absolute;  
            bottom: 20px;  
            right: 20px;  
            background: rgba(10, 0, 20, 0.85);  
            padding: 15px;  
            border-radius: 15px;  
            border: 1px solid #4a0080;  
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.4), inset 0 0 10px rgba(138, 43, 226, 0.2);  
            backdrop-filter: blur(10px);  
            font-size: 12px;  
            color: #bb88ff;  
            max-width: 250px;  
        }  
    </style>  
</head>  
<body>  
    <div class="particles" id="particles"></div>  
    <div class="glow-effect"></div>  
      
    <div class="container">  
        <canvas id="canvas"></canvas>  
  
        <div class="controls">  
            <div class="control-title">FABRIC DESIGNER</div>  
              
            <div class="control-group">  
                <label>Pattern Scale: <span id="scaleValue">1.0</span></label>  
                <input type="range" id="scale" min="0.5" max="3.0" step="0.1" value="1.0">  
            </div>  
              
            <div class="control-group">  
                <label>Pattern Density: <span id="densityValue">1.0</span></label>  
                <input type="range" id="density" min="0.5" max="2.0" step="0.1" value="1.0">  
            </div>  
              
            <div class="control-group">  
                <label>Line Weight: <span id="lineWeightValue">1.5</span></label>  
                <input type="range" id="lineWeight" min="0.5" max="5.0" step="0.5" value="1.5">  
            </div>  
              
            <div class="control-group">  
                <label>Symmetry</label>  
                <select id="symmetryMode">  
                    <option value="none">None</option>  
                    <option value="horizontal">Horizontal</option>  
                    <option value="vertical">Vertical</option>  
                    <option value="quad">Quadrant</option>  
                    <option value="radial">Radial</option>  
                    <option value="kaleidoscope" selected>Kaleidoscope</option>  
                </select>  
            </div>  
              
            <div class="control-group">  
                <label>Background</label>  
                <select id="backgroundStyle">  
                    <option value="solid">Solid Color</option>  
                    <option value="gradient">Gradient</option>  
                    <option value="radial">Radial Gradient</option>  
                </select>  
            </div>  
              
            <div class="control-group">  
                <button onclick="randomizeColors()">Randomize Colors</button>  
                <button onclick="saveImage()">Save Image</button>  
            </div>  
        </div>  
  
        <div class="fabric-patterns">  
            <div class="control-title">PATTERN STYLES</div>  
            <div class="fabric-grid" id="fabricGrid"></div>  
              
            <div class="control-title" style="margin-top: 15px;">COLOR PALETTE</div>  
            <div class="color-palette" id="colorPalette"></div>  
              
            <div class="control-group" style="margin-top: 10px;">  
                <label>Background Color</label>  
                <div class="color-palette" id="bgColorPalette"></div>  
            </div>  
        </div>  
  
        <div class="info">  
            <p>Vector Symmetrical Fabric Designer creates beautiful textile-inspired patterns with perfect symmetry.</p>  
            <p>Select a pattern style, adjust the symmetry, and customize colors to create your unique fabric design.</p>  
        </div>  
    </div>  
  
    <script>  
        // Canvas setup  
        const canvas = document.getElementById('canvas');  
        const ctx = canvas.getContext('2d');  
          
        // UI elements  
        const scaleSlider = document.getElementById('scale');  
        const scaleValue = document.getElementById('scaleValue');  
        const densitySlider = document.getElementById('density');  
        const densityValue = document.getElementById('densityValue');  
        const lineWeightSlider = document.getElementById('lineWeight');  
        const lineWeightValue = document.getElementById('lineWeightValue');  
        const symmetryModeSelect = document.getElementById('symmetryMode');  
        const backgroundStyleSelect = document.getElementById('backgroundStyle');  
        const fabricGrid = document.getElementById('fabricGrid');  
        const colorPalette = document.getElementById('colorPalette');  
        const bgColorPalette = document.getElementById('bgColorPalette');  
          
        // Configuration  
        let config = {  
            scale: parseFloat(scaleSlider.value),  
            density: parseFloat(densitySlider.value),  
            lineWeight: parseFloat(lineWeightSlider.value),  
            symmetryMode: symmetryModeSelect.value,  
            backgroundStyle: backgroundStyleSelect.value,  
            selectedPattern: 0,  
            colors: [  
                '#ff3366', '#ff6633', '#ffcc33', '#33cc99', '#3399ff', '#9966ff', '#ff66cc'  
            ],  
            selectedColor: 0,  
            bgColors: [  
                '#1a0033', '#000033', '#330033', '#003333', '#333300', '#330000'  
            ],  
            selectedBgColor: 0  
        };  
          
        // Fabric patterns  
        const fabricPatterns = [  
            {  
                name: "Geometric",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const spacing = 20 / density * scale;  
                      
                    // Draw grid  
                    for (let i = 0; i < width; i += spacing) {  
                        ctx.beginPath();  
                        ctx.moveTo(i, 0);  
                        ctx.lineTo(i, height);  
                        ctx.stroke();  
                    }  
                      
                    for (let i = 0; i < height; i += spacing) {  
                        ctx.beginPath();  
                        ctx.moveTo(0, i);  
                        ctx.lineTo(width, i);  
                        ctx.stroke();  
                    }  
                      
                    // Add diagonal lines  
                    ctx.beginPath();  
                    for (let i = 0; i < width + height; i += spacing * 2) {  
                        ctx.moveTo(0, i);  
                        ctx.lineTo(i, 0);  
                    }  
                    ctx.stroke();  
                }  
            },  
            {  
                name: "Floral",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.fillStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const spacing = 60 / density * scale;  
                    const size = 15 * scale;  
                      
                    const drawFlower = (x, y, size) => {  
                        const petalCount = 6;  
                        const petalLength = size * 0.8;  
                        const petalWidth = size * 0.3;  
                          
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw petals  
                        for (let i = 0; i < petalCount; i++) {  
                            ctx.beginPath();  
                            ctx.ellipse(petalLength/2, 0, petalLength/2, petalWidth/2, 0, 0, Math.PI * 2);  
                            ctx.fill();  
                            ctx.rotate(Math.PI * 2 / petalCount);  
                        }  
                          
                        // Draw center  
                        ctx.beginPath();  
                        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);  
                        ctx.fill();  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw flowers in a grid pattern  
                    for (let x = spacing/2; x < width; x += spacing) {  
                        for (let y = spacing/2; y < height; y += spacing) {  
                            drawFlower(x, y, size);  
                        }  
                    }  
                      
                    // Offset grid for more flowers  
                    for (let x = spacing; x < width; x += spacing) {  
                        for (let y = spacing; y < height; y += spacing) {  
                            drawFlower(x, y, size * 0.7);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Paisley",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.fillStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const spacing = 70 / density * scale;  
                    const size = 15 * scale;  
                      
                    const drawPaisley = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw the teardrop shape  
                        ctx.beginPath();  
                        ctx.moveTo(0, 0);  
                        ctx.quadraticCurveTo(size, -size, 0, -size * 2);  
                        ctx.quadraticCurveTo(-size, -size, 0, 0);  
                        ctx.fill();  
                          
                        // Draw the swirl  
                        ctx.beginPath();  
                        ctx.moveTo(0, -size * 1.5);  
                        ctx.quadraticCurveTo(size * 0.5, -size * 1.7, 0, -size * 1.9);  
                        ctx.quadraticCurveTo(-size * 0.5, -size * 1.7, 0, -size * 1.5);  
                        ctx.stroke();  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw paisley pattern  
                    for (let x = spacing/2; x < width; x += spacing) {  
                        for (let y = spacing/2; y < height; y += spacing) {  
                            drawPaisley(x, y, size);  
                        }  
                    }  
                      
                    for (let x = spacing; x < width; x += spacing) {  
                        for (let y = spacing; y < height; y += spacing) {  
                            drawPaisley(x, y, size * 0.7);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Chevron",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const chevronHeight = 20 * scale;  
                    const chevronWidth = 20 * scale / density;  
                      
                    for (let y = -chevronHeight; y < height + chevronHeight; y += chevronHeight) {  
                        ctx.beginPath();  
                        for (let x = -chevronWidth; x < width + chevronWidth; x += chevronWidth) {  
                            ctx.lineTo(x, y + (x % (chevronWidth * 2) === 0 ? 0 : chevronHeight));  
                        }  
                        ctx.stroke();  
                    }  
                }  
            },  
            {  
                name: "Polka Dots",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.fillStyle = color;  
                      
                    const spacing = 40 / density * scale;  
                    const largeSize = 8 * scale;  
                    const smallSize = 4 * scale;  
                      
                    // Draw large dots  
                    for (let x = spacing/2; x < width; x += spacing) {  
                        for (let y = spacing/2; y < height; y += spacing) {  
                            ctx.beginPath();  
                            ctx.arc(x, y, largeSize, 0, Math.PI * 2);  
                            ctx.fill();  
                        }  
                    }  
                      
                    // Draw small dots  
                    for (let x = spacing; x < width; x += spacing) {  
                        for (let y = spacing; y < height; y += spacing) {  
                            ctx.beginPath();  
                            ctx.arc(x, y, smallSize, 0, Math.PI * 2);  
                            ctx.fill();  
                        }  
                    }  
                }  
            },  
            {  
                name: "Herringbone",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const size = 10 * scale / density;  
                      
                    for (let y = -size * 2; y < height + size * 2; y += size * 2) {  
                        for (let x = -size * 4; x < width + size * 4; x += size * 4) {  
                            // Draw forward slashes  
                            ctx.beginPath();  
                            ctx.moveTo(x, y);  
                            ctx.lineTo(x + size * 2, y + size * 2);  
                            ctx.stroke();  
                              
                            ctx.beginPath();  
                            ctx.moveTo(x + size * 2, y);  
                            ctx.lineTo(x + size * 4, y + size * 2);  
                            ctx.stroke();  
                              
                            // Draw backward slashes  
                            ctx.beginPath();  
                            ctx.moveTo(x + size * 2, y);  
                            ctx.lineTo(x, y + size * 2);  
                            ctx.stroke();  
                              
                            ctx.beginPath();  
                            ctx.moveTo(x + size * 4, y);  
                            ctx.lineTo(x + size * 2, y + size * 2);  
                            ctx.stroke();  
                        }  
                    }  
                }  
            },  
            {  
                name: "Arabesque",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 50 * scale / density;  
                      
                    const drawArc = (x, y, radius, startAngle, endAngle) => {  
                        ctx.beginPath();  
                        ctx.arc(x, y, radius, startAngle, endAngle);  
                        ctx.stroke();  
                    };  
                      
                    for (let x = -tileSize; x < width + tileSize; x += tileSize) {  
                        for (let y = -tileSize; y < height + tileSize; y += tileSize) {  
                            // Draw interlocking circles  
                            drawArc(x, y, tileSize/2, 0, Math.PI/2);  
                            drawArc(x + tileSize, y, tileSize/2, Math.PI/2, Math.PI);  
                            drawArc(x + tileSize, y + tileSize, tileSize/2, Math.PI, Math.PI*3/2);  
                            drawArc(x, y + tileSize, tileSize/2, Math.PI*3/2, Math.PI*2);  
                              
                            // Draw inner details  
                            drawArc(x + tileSize/2, y + tileSize/2, tileSize/4, 0, Math.PI*2);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Lattice",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const gridSize = 30 * scale / density;  
                      
                    // Draw vertical lines  
                    for (let x = gridSize; x < width; x += gridSize) {  
                        ctx.beginPath();  
                        for (let y = 0; y < height; y += 10 * scale) {  
                            if (y % (20 * scale) === 0) {  
                                ctx.moveTo(x - 5 * scale, y);  
                                ctx.lineTo(x + 5 * scale, y);  
                            } else {  
                                ctx.moveTo(x + 5 * scale, y);  
                                ctx.lineTo(x - 5 * scale, y);  
                            }  
                        }  
                        ctx.stroke();  
                    }  
                      
                    // Draw horizontal lines  
                    for (let y = gridSize; y < height; y += gridSize) {  
                        ctx.beginPath();  
                        for (let x = 0; x < width; x += 10 * scale) {  
                            if (x % (20 * scale) === 0) {  
                                ctx.moveTo(x, y - 5 * scale);  
                                ctx.lineTo(x, y + 5 * scale);  
                            } else {  
                                ctx.moveTo(x, y + 5 * scale);  
                                ctx.lineTo(x, y - 5 * scale);  
                            }  
                        }  
                        ctx.stroke();  
                    }  
                }  
            },  
            {  
                name: "Damask",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.fillStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 60 * scale / density;  
                      
                    const drawDamaskTile = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw central floral motif  
                        ctx.beginPath();  
                        ctx.moveTo(size/2, 0);  
                        ctx.bezierCurveTo(size*0.7, size*0.3, size*0.3, size*0.7, size/2, size);  
                        ctx.bezierCurveTo(size*0.7, size*0.7, size*0.3, size*0.3, size/2, 0);  
                        ctx.stroke();  
                          
                        // Draw side flourishes  
                        ctx.beginPath();  
                        ctx.moveTo(0, size/2);  
                        ctx.bezierCurveTo(size*0.3, size*0.3, size*0.7, size*0.3, size, size/2);  
                        ctx.stroke();  
                          
                        // Draw corner details  
                        ctx.beginPath();  
                        ctx.arc(size*0.2, size*0.2, size*0.1, 0, Math.PI*2);  
                        ctx.arc(size*0.8, size*0.2, size*0.1, 0, Math.PI*2);  
                        ctx.arc(size*0.2, size*0.8, size*0.1, 0, Math.PI*2);  
                        ctx.arc(size*0.8, size*0.8, size*0.1, 0, Math.PI*2);  
                        ctx.fill();  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw damask pattern  
                    for (let x = 0; x < width; x += tileSize) {  
                        for (let y = 0; y < height; y += tileSize) {  
                            drawDamaskTile(x, y, tileSize);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Medallion",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 80 * scale / density;  
                    const medallionSize = tileSize * 0.8;  
                      
                    const drawMedallion = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw outer circle  
                        ctx.beginPath();  
                        ctx.arc(0, 0, size, 0, Math.PI * 2);  
                        ctx.stroke();  
                          
                        // Draw inner circle  
                        ctx.beginPath();  
                        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);  
                        ctx.stroke();  
                          
                        // Draw spokes  
                        const spokeCount = 12;  
                        for (let i = 0; i < spokeCount; i++) {  
                            const angle = (i / spokeCount) * Math.PI * 2;  
                            ctx.beginPath();  
                            ctx.moveTo(0, 0);  
                            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);  
                            ctx.stroke();  
                        }  
                          
                        // Draw decorative arcs  
                        for (let i = 0; i < spokeCount; i++) {  
                            const angle = (i / spokeCount) * Math.PI * 2;  
                            const nextAngle = ((i + 1) / spokeCount) * Math.PI * 2;  
                              
                            ctx.beginPath();  
                            ctx.arc(0, 0, size * 0.85, angle, nextAngle);  
                            ctx.stroke();  
                        }  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw medallions in a grid  
                    for (let x = tileSize/2; x < width; x += tileSize) {  
                        for (let y = tileSize/2; y < height; y += tileSize) {  
                            drawMedallion(x, y, medallionSize/2);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Moroccan",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 50 * scale / density;  
                      
                    const drawMoroccanTile = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw outer square  
                        ctx.strokeRect(-size/2, -size/2, size, size);  
                          
                        // Draw diagonal lines  
                        ctx.beginPath();  
                        ctx.moveTo(-size/2, -size/2);  
                        ctx.lineTo(size/2, size/2);  
                        ctx.moveTo(size/2, -size/2);  
                        ctx.lineTo(-size/2, size/2);  
                        ctx.stroke();  
                          
                        // Draw inner square  
                        ctx.strokeRect(-size/4, -size/4, size/2, size/2);  
                          
                        // Draw arcs in corners  
                        ctx.beginPath();  
                        ctx.arc(-size/2, -size/2, size/4, 0, Math.PI/2);  
                        ctx.arc(size/2, -size/2, size/4, Math.PI/2, Math.PI);  
                        ctx.arc(size/2, size/2, size/4, Math.PI, Math.PI*3/2);  
                        ctx.arc(-size/2, size/2, size/4, Math.PI*3/2, Math.PI*2);  
                        ctx.stroke();  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw tiles in a grid  
                    for (let x = tileSize/2; x < width; x += tileSize) {  
                        for (let y = tileSize/2; y < height; y += tileSize) {  
                            drawMoroccanTile(x, y, tileSize);  
                        }  
                    }  
                }  
            },  
            {  
                name: "Art Deco",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 60 * scale / density;  
                      
                    const drawArtDecoTile = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw fan shape  
                        ctx.beginPath();  
                        ctx.arc(0, 0, size/2, 0, Math.PI, true);  
                        ctx.stroke();  
                          
                        // Draw rays  
                        const rayCount = 7;  
                        for (let i = 0; i <= rayCount; i++) {  
                            const angle = (i / rayCount) * Math.PI;  
                            ctx.beginPath();  
                            ctx.moveTo(0, 0);  
                            ctx.lineTo(Math.cos(angle) * size/2, Math.sin(angle) * size/2);  
                            ctx.stroke();  
                        }  
                          
                        // Draw concentric arcs  
                        for (let r = size/6; r <= size/2; r += size/6) {  
                            ctx.beginPath();  
                            ctx.arc(0, 0, r, 0, Math.PI, true);  
                            ctx.stroke();  
                        }  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw tiles in a grid  
                    for (let x = tileSize/2; x < width; x += tileSize) {  
                        for (let y = tileSize/2; y < height; y += tileSize) {  
                            drawArtDecoTile(x, y, tileSize);  
                        }  
                    }  
                      
                    // Draw connecting lines  
                    ctx.beginPath();  
                    for (let x = tileSize/2; x < width; x += tileSize) {  
                        ctx.moveTo(x, 0);  
                        ctx.lineTo(x, height);  
                    }  
                    for (let y = tileSize/2; y < height; y += tileSize) {  
                        ctx.moveTo(0, y);  
                        ctx.lineTo(width, y);  
                    }  
                    ctx.stroke();  
                }  
            },  
            {  
                name: "Celtic",  
                render: (ctx, width, height, color, scale, density, lineWeight) => {  
                    ctx.strokeStyle = color;  
                    ctx.lineWidth = lineWeight;  
                      
                    const tileSize = 70 * scale / density;  
                      
                    const drawCelticKnot = (x, y, size) => {  
                        ctx.save();  
                        ctx.translate(x, y);  
                          
                        // Draw outer square  
                        ctx.strokeRect(-size/2, -size/2, size, size);  
                          
                        // Draw knot pattern  
                        const gap = size * 0.1;  
                          
                        // Top left to bottom right  
                        ctx.beginPath();  
                        ctx.moveTo(-size/2, -size/2 + gap);  
                        ctx.lineTo(-size/2 + gap, -size/2);  
                        ctx.lineTo(size/2 - gap, size/2);  
                        ctx.lineTo(size/2, size/2 - gap);  
                        ctx.stroke();  
                          
                        // Bottom left to top right  
                        ctx.beginPath();  
                        ctx.moveTo(-size/2, size/2 - gap);  
                        ctx.lineTo(-size/2 + gap, size/2);  
                        ctx.lineTo(size/2 - gap, -size/2);  
                        ctx.lineTo(size/2, -size/2 + gap);  
                        ctx.stroke();  
                          
                        // Draw center knot  
                        ctx.beginPath();  
                        ctx.arc(0, 0, size/4, 0, Math.PI * 2);  
                        ctx.moveTo(size/4, 0);  
                        ctx.arc(0, 0, size/4, 0, Math.PI * 2, true);  
                        ctx.stroke();  
                          
                        ctx.restore();  
                    };  
                      
                    // Draw knots in a grid  
                    for (let x = tileSize/2; x < width; x += tileSize) {  
                        for (let y = tileSize/2; y < height; y += tileSize) {  
                            drawCelticKnot(x, y, tileSize);  
                        }  
                    }  
                }  
            }  
        ];  
          
        // Initialize  
        function init() {  
            // Set canvas size  
            resizeCanvas();  
              
            // Create particles  
            createParticles();  
              
            // Create fabric pattern previews  
            createFabricPreviews();  
              
            // Create color palette  
            createColorPalette();  
              
            // Draw initial pattern  
            drawPattern();  
              
            // Add event listeners  
            window.addEventListener('resize', resizeCanvas);  
            scaleSlider.addEventListener('input', updateScale);  
            densitySlider.addEventListener('input', updateDensity);  
            lineWeightSlider.addEventListener('input', updateLineWeight);  
            symmetryModeSelect.addEventListener('change', updateSymmetryMode);  
            backgroundStyleSelect.addEventListener('change', updateBackgroundStyle);  
        }  
          
        function resizeCanvas() {  
            // Make canvas fill most of the screen  
            const maxWidth = window.innerWidth * 0.9;  
            const maxHeight = window.innerHeight * 0.9;  
              
            canvas.width = maxWidth;  
            canvas.height = maxHeight;  
              
            // Redraw pattern  
            drawPattern();  
        }  
          
        function createParticles() {  
            const particlesContainer = document.getElementById('particles');  
            particlesContainer.innerHTML = '';  
              
            for (let i = 0; i < 20; i++) {  
                const particle = document.createElement('div');  
                particle.classList.add('particle');  
                  
                // Random size between 5px and 20px  
                const size = Math.random() * 15 + 5;  
                particle.style.width = `${size}px`;  
                particle.style.height = `${size}px`;  
                  
                // Random position  
                particle.style.left = `${Math.random() * 100}%`;  
                particle.style.bottom = `-${size}px`;  
                  
                // Random animation duration and delay  
                const duration = Math.random() * 10 + 10;  
                const delay = Math.random() * 15;  
                particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;  
                  
                particlesContainer.appendChild(particle);  
            }  
              
            // Add multiple glow effects  
            for (let i = 0; i < 3; i++) {  
                const glow = document.createElement('div');  
                glow.classList.add('glow-effect');  
                glow.style.left = `${Math.random() * 80 + 10}%`;  
                glow.style.top = `${Math.random() * 80 + 10}%`;  
                glow.style.animationDelay = `${i * 2}s`;  
                document.body.appendChild(glow);  
            }  
        }  
          
        function createFabricPreviews() {  
            fabricGrid.innerHTML = '';  
              
            // Create a small canvas for each fabric pattern preview  
            fabricPatterns.forEach((pattern, index) => {  
                const previewContainer = document.createElement('div');  
                previewContainer.classList.add('fabric-preview');  
                previewContainer.dataset.index = index;  
                  
                if (index === config.selectedPattern) {  
                    previewContainer.classList.add('selected');  
                }  
                  
                const previewCanvas = document.createElement('canvas');  
                previewCanvas.width = 50;  
                previewCanvas.height = 50;  
                  
                const previewCtx = previewCanvas.getContext('2d');  
                  
                // Draw the pattern with a color based on the index  
                const hue = (index * 40) % 360;  
                const color = `hsl(${hue}, 100%, 70%)`;  
                pattern.render(previewCtx, 50, 50, color, 1, 1, 1);  
                  
                previewContainer.appendChild(previewCanvas);  
                fabricGrid.appendChild(previewContainer);  
                  
                // Add click event to select this pattern  
                previewContainer.addEventListener('click', () => {  
                    selectFabricPattern(index);  
                });  
            });  
        }  
          
        function createColorPalette() {  
            colorPalette.innerHTML = '';  
            bgColorPalette.innerHTML = '';  
              
            // Create color swatches for pattern colors  
            config.colors.forEach((color, index) => {  
                const swatch = document.createElement('div');  
                swatch.classList.add('color-swatch');  
                swatch.style.backgroundColor = color;  
                swatch.dataset.index = index;  
                  
                if (index === config.selectedColor) {  
                    swatch.classList.add('selected');  
                }  
                  
                swatch.addEventListener('click', () => {  
                    selectColor(index);  
                });  
                  
                colorPalette.appendChild(swatch);  
            });  
              
            // Create color swatches for background colors  
            config.bgColors.forEach((color, index) => {  
                const swatch = document.createElement('div');  
                swatch.classList.add('color-swatch');  
                swatch.style.backgroundColor = color;  
                swatch.dataset.index = index;  
                  
                if (index === config.selectedBgColor) {  
                    swatch.classList.add('selected');  
                }  
                  
                swatch.addEventListener('click', () => {  
                    selectBgColor(index);  
                });  
                  
                bgColorPalette.appendChild(swatch);  
            });  
        }  
          
        function selectFabricPattern(index) {  
            // Remove selected class from all previews  
            document.querySelectorAll('.fabric-preview').forEach(el => {  
                el.classList.remove('selected');  
            });  
              
            // Add selected class to the clicked preview  
            document.querySelector(`.fabric-preview[data-index="${index}"]`).classList.add('selected');  
            config.selectedPattern = index;  
              
            // Redraw pattern  
            drawPattern();  
        }  
          
        function selectColor(index) {  
            // Remove selected class from all color swatches  
            document.querySelectorAll('#colorPalette .color-swatch').forEach(el => {  
                el.classList.remove('selected');  
            });  
              
            // Add selected class to the clicked swatch  
            document.querySelector(`#colorPalette .color-swatch[data-index="${index}"]`).classList.add('selected');  
            config.selectedColor = index;  
              
            // Redraw pattern  
            drawPattern();  
        }  
          
        function selectBgColor(index) {  
            // Remove selected class from all bg color swatches  
            document.querySelectorAll('#bgColorPalette .color-swatch').forEach(el => {  
                el.classList.remove('selected');  
            });  
              
            // Add selected class to the clicked swatch  
            document.querySelector(`#bgColorPalette .color-swatch[data-index="${index}"]`).classList.add('selected');  
            config.selectedBgColor = index;  
              
            // Redraw pattern  
            drawPattern();  
        }  
          
        function drawPattern() {  
            // Clear canvas  
            ctx.clearRect(0, 0, canvas.width, canvas.height);  
              
            // Draw background  
            drawBackground();  
              
            // Create an offscreen canvas for the pattern  
            const patternCanvas = document.createElement('canvas');  
            patternCanvas.width = canvas.width;  
            patternCanvas.height = canvas.height;  
            const patternCtx = patternCanvas.getContext('2d');  
              
            // Get the selected pattern  
            const pattern = fabricPatterns[config.selectedPattern];  
              
            // Get the selected color  
            const color = config.colors[config.selectedColor];  
              
            // Render the pattern  
            pattern.render(patternCtx, canvas.width, canvas.height, color, config.scale, config.density, config.lineWeight);  
              
            // Apply symmetry  
            applySymmetry(patternCanvas);  
              
            // Draw the pattern onto the main canvas  
            ctx.drawImage(patternCanvas, 0, 0);  
        }  
          
        function drawBackground() {  
            const bgColor = config.bgColors[config.selectedBgColor];  
              
            switch (config.backgroundStyle) {  
                case 'solid':  
                    ctx.fillStyle = bgColor;  
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    break;  
                      
                case 'gradient':  
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);  
                    gradient.addColorStop(0, bgColor);  
                    gradient.addColorStop(1, shiftColor(bgColor, 30));  
                    ctx.fillStyle = gradient;  
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    break;  
                      
                case 'radial':  
                    const radialGradient = ctx.createRadialGradient(  
                        canvas.width / 2, canvas.height / 2, 0,  
                        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2  
                    );  
                    radialGradient.addColorStop(0, shiftColor(bgColor, 20));  
                    radialGradient.addColorStop(1, bgColor);  
                    ctx.fillStyle = radialGradient;  
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    break;  
            }  
        }  
          
        function applySymmetry(patternCanvas) {  
            const patternCtx = patternCanvas.getContext('2d');  
            const width = patternCanvas.width;  
            const height = patternCanvas.height;  
              
            // Create a copy of the original pattern  
            const originalPattern = patternCtx.getImageData(0, 0, width, height);  
              
            switch (config.symmetryMode) {  
                case 'horizontal':  
                    // Mirror horizontally  
                    patternCtx.save();  
                    patternCtx.translate(width, 0);  
                    patternCtx.scale(-1, 1);  
                    patternCtx.drawImage(patternCanvas, 0, 0);  
                    patternCtx.restore();  
                    break;  
                      
                case 'vertical':  
                    // Mirror vertically  
                    patternCtx.save();  
                    patternCtx.translate(0, height);  
                    patternCtx.scale(1, -1);  
                    patternCtx.drawImage(patternCanvas, 0, 0);  
                    patternCtx.restore();  
                    break;  
                      
                case 'quad':  
                    // Mirror in all four quadrants  
                    const halfWidth = Math.floor(width / 2);  
                    const halfHeight = Math.floor(height / 2);  
                      
                    // Get the top-left quadrant  
                    const quadrant = patternCtx.getImageData(0, 0, halfWidth, halfHeight);  
                      
                    // Clear canvas  
                    patternCtx.clearRect(0, 0, width, height);  
                      
                    // Draw top-left quadrant  
                    patternCtx.putImageData(quadrant, 0, 0);  
                      
                    // Draw top-right quadrant (mirrored horizontally)  
                    patternCtx.save();  
                    patternCtx.translate(width, 0);  
                    patternCtx.scale(-1, 1);  
                    patternCtx.drawImage(patternCanvas, 0, 0, halfWidth, halfHeight, width - halfWidth, 0, halfWidth, halfHeight);  
                    patternCtx.restore();  
                      
                    // Draw bottom-left quadrant (mirrored vertically)  
                    patternCtx.save();  
                    patternCtx.translate(0, height);  
                    patternCtx.scale(1, -1);  
                    patternCtx.drawImage(patternCanvas, 0, 0, halfWidth, halfHeight, 0, height - halfHeight, halfWidth, halfHeight);  
                    patternCtx.restore();  
                      
                    // Draw bottom-right quadrant (mirrored both ways)  
                    patternCtx.save();  
                    patternCtx.translate(width, height);  
                    patternCtx.scale(-1, -1);  
                    patternCtx.drawImage(patternCanvas, 0, 0, halfWidth, halfHeight, width - halfWidth, height - halfHeight, halfWidth, halfHeight);  
                    patternCtx.restore();  
                    break;  
                      
                case 'radial':  
                    // Create radial symmetry  
                    const centerX = width / 2;  
                    const centerY = height / 2;  
                    const segments = 8;  
                      
                    // Save the original pattern  
                    const segmentCanvas = document.createElement('canvas');  
                    segmentCanvas.width = width;  
                    segmentCanvas.height = height;  
                    const segmentCtx = segmentCanvas.getContext('2d');  
                    segmentCtx.putImageData(originalPattern, 0, 0);  
                      
                    // Clear the pattern canvas  
                    patternCtx.clearRect(0, 0, width, height);  
                      
                    // Draw the pattern in a radial arrangement  
                    for (let i = 0; i < segments; i++) {  
                        const angle = (i / segments) * Math.PI * 2;  
                          
                        patternCtx.save();  
                        patternCtx.translate(centerX, centerY);  
                        patternCtx.rotate(angle);  
                        patternCtx.drawImage(segmentCanvas, -centerX, -centerY);  
                        patternCtx.restore();  
                    }  
                    break;  
                      
                case 'kaleidoscope':  
                    // Create kaleidoscope effect  
                    const kCenterX = width / 2;  
                    const kCenterY = height / 2;  
                    const kSegments = 12;  
                      
                    // Save the original pattern  
                    const kSegmentCanvas = document.createElement('canvas');  
                    kSegmentCanvas.width = width;  
                    kSegmentCanvas.height = height;  
                    const kSegmentCtx = kSegmentCanvas.getContext('2d');  
                    kSegmentCtx.putImageData(originalPattern, 0, 0);  
                      
                    // Clear the pattern canvas  
                    patternCtx.clearRect(0, 0, width, height);  
                      
                    // Create a triangular segment  
                    const triangleCanvas = document.createElement('canvas');  
                    triangleCanvas.width = width;  
                    triangleCanvas.height = height;  
                    const triangleCtx = triangleCanvas.getContext('2d');  
                      
                    // Draw a triangular segment from the original pattern  
                    triangleCtx.save();  
                    triangleCtx.beginPath();  
                    triangleCtx.moveTo(kCenterX, kCenterY);  
                    triangleCtx.lineTo(width, 0);  
                    triangleCtx.lineTo(width, height / 2);  
                    triangleCtx.closePath();  
                    triangleCtx.clip();  
                    triangleCtx.drawImage(kSegmentCanvas, 0, 0);  
                    triangleCtx.restore();  
                      
                    // Draw the triangular segment in a kaleidoscope arrangement  
                    for (let i = 0; i < kSegments; i++) {  
                        const angle = (i / kSegments) * Math.PI * 2;  
                          
                        patternCtx.save();  
                        patternCtx.translate(kCenterX, kCenterY);  
                        patternCtx.rotate(angle);  
                        patternCtx.drawImage(triangleCanvas, -kCenterX, -kCenterY);  
                          
                        // Draw mirrored segment  
                        patternCtx.scale(1, -1);  
                        patternCtx.drawImage(triangleCanvas, -kCenterX, -kCenterY);  
                        patternCtx.restore();  
                    }  
                    break;  
            }  
        }  
          
        function updateScale() {  
            config.scale = parseFloat(scaleSlider.value);  
            scaleValue.textContent = config.scale.toFixed(1);  
            drawPattern();  
        }  
          
        function updateDensity() {  
            config.density = parseFloat(densitySlider.value);  
            densityValue.textContent = config.density.toFixed(1);  
            drawPattern();  
        }  
          
        function updateLineWeight() {  
            config.lineWeight = parseFloat(lineWeightSlider.value);  
            lineWeightValue.textContent = config.lineWeight.toFixed(1);  
            drawPattern();  
        }  
          
        function updateSymmetryMode() {  
            config.symmetryMode = symmetryModeSelect.value;  
            drawPattern();  
        }  
          
        function updateBackgroundStyle() {  
            config.backgroundStyle = backgroundStyleSelect.value;  
            drawPattern();  
        }  
          
        function randomizeColors() {  
            // Generate random colors  
            config.colors = [];  
            for (let i = 0; i < 7; i++) {  
                const hue = Math.floor(Math.random() * 360);  
                const saturation = 70 + Math.floor(Math.random() * 30);  
                const lightness = 50 + Math.floor(Math.random() * 30);  
                config.colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);  
            }  
              
            // Generate random background colors  
            config.bgColors = [];  
            for (let i = 0; i < 6; i++) {  
                const hue = Math.floor(Math.random() * 360);  
                const saturation = 70 + Math.floor(Math.random() * 30);  
                const lightness = 10 + Math.floor(Math.random() * 20);  
                config.bgColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);  
            }  
              
            // Recreate color palette  
            createColorPalette();  
              
            // Redraw pattern  
            drawPattern();  
        }  
          
        function saveImage() {  
            // Create a temporary link  
            const link = document.createElement('a');  
            link.download = `fabric-pattern-${Date.now()}.png`;  
            link.href = canvas.toDataURL('image/png');  
            link.click();  
        }  
          
        function shiftColor(color, amount) {  
            // Parse the color  
            let r, g, b;  
              
            if (color.startsWith('#')) {  
                // Hex color  
                r = parseInt(color.slice(1, 3), 16);  
                g = parseInt(color.slice(3, 5), 16);  
                b = parseInt(color.slice(5, 7), 16);  
            } else if (color.startsWith('rgb')) {  
                // RGB color  
                const match = color.match(/\d+/g);  
                r = parseInt(match[0]);  
                g = parseInt(match[1]);  
                b = parseInt(match[2]);  
            } else if (color.startsWith('hsl')) {  
                // HSL color - convert to RGB  
                const match = color.match(/\d+/g);  
                const h = parseInt(match[0]) / 360;  
                const s = parseInt(match[1]) / 100;  
                const l = parseInt(match[2]) / 100;  
                  
                // Convert HSL to RGB  
                if (s === 0) {  
                    r = g = b = l;  
                } else {  
                    const hue2rgb = (p, q, t) => {  
                        if (t < 0) t += 1;  
                        if (t > 1) t -= 1;  
                        if (t < 1/6) return p + (q - p) * 6 * t;  
                        if (t < 1/2) return q;  
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;  
                        return p;  
                    };  
                      
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;  
                    const p = 2 * l - q;  
                      
                    r = hue2rgb(p, q, h + 1/3) * 255;  
                    g = hue2rgb(p, q, h) * 255;  
                    b = hue2rgb(p, q, h - 1/3) * 255;  
                }  
            }  
              
            // Shift the color  
            r = Math.min(255, Math.max(0, r + amount));  
            g = Math.min(255, Math.max(0, g + amount));  
            b = Math.min(255, Math.max(0, b + amount));  
              
            // Convert back to hex  
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;  
        }  
          
        // Start the application  
        init();  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601951b93ec91d5',t:'MTc1MjY2OTc3Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
