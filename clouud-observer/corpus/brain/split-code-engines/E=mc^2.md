* **==E=mc^2==**  
  
<!DOCTYPE html>  
  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Einstein Relativity Art Engine</title>  
    <style>  
        * {  
            margin: 0;  
            padding: 0;  
            box-sizing: border-box;  
        }  
  
```  
    body {  
        background: radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000000 100%);  
        font-family: 'Courier New', monospace;  
        color: #00ffff;  
        overflow: hidden;  
        height: 100vh;  
    }  
  
    .container {  
        position: relative;  
        width: 100vw;  
        height: 100vh;  
        display: flex;  
        flex-direction: column;  
    }  
  
    .header {  
        position: absolute;  
        top: 20px;  
        left: 20px;  
        z-index: 1000;  
        background: rgba(0, 0, 0, 0.8);  
        padding: 10px 20px;  
        border-radius: 10px;  
        backdrop-filter: blur(10px);  
        border: 1px solid rgba(0, 255, 255, 0.3);  
    }  
  
    .equation {  
        font-size: 24px;  
        font-weight: bold;  
        color: #00ffff;  
        text-shadow: 0 0 10px #00ffff;  
        margin-bottom: 10px;  
    }  
  
    .controls {  
        position: absolute;  
        top: 20px;  
        right: 20px;  
        z-index: 1000;  
        background: rgba(0, 0, 0, 0.8);  
        padding: 15px;  
        border-radius: 10px;  
        backdrop-filter: blur(10px);  
        border: 1px solid rgba(0, 255, 255, 0.3);  
    }  
  
    .control-group {  
        margin-bottom: 15px;  
    }  
  
    .control-group label {  
        display: block;  
        margin-bottom: 5px;  
        font-size: 12px;  
        color: #00ffff;  
    }  
  
    .control-group input, .control-group select {  
        width: 150px;  
        padding: 5px;  
        background: rgba(0, 0, 0, 0.7);  
        border: 1px solid #00ffff;  
        color: #00ffff;  
        border-radius: 5px;  
    }  
  
    .control-group button {  
        width: 100%;  
        padding: 8px;  
        background: linear-gradient(45deg, #001122, #003366);  
        border: 1px solid #00ffff;  
        color: #00ffff;  
        border-radius: 5px;  
        cursor: pointer;  
        transition: all 0.3s;  
    }  
  
    .control-group button:hover {  
        background: linear-gradient(45deg, #003366, #0066cc);  
        box-shadow: 0 0 10px #00ffff;  
    }  
  
    .canvas-container {  
        position: relative;  
        width: 100%;  
        height: 100%;  
    }  
  
    #mainCanvas {  
        position: absolute;  
        top: 0;  
        left: 0;  
        width: 100%;  
        height: 100%;  
        background: transparent;  
    }  
  
    .info-panel {  
        position: absolute;  
        bottom: 20px;  
        left: 20px;  
        z-index: 1000;  
        background: rgba(0, 0, 0, 0.8);  
        padding: 10px;  
        border-radius: 10px;  
        backdrop-filter: blur(10px);  
        border: 1px solid rgba(0, 255, 255, 0.3);  
        max-width: 300px;  
    }  
  
    .info-panel h3 {  
        color: #00ffff;  
        margin-bottom: 10px;  
        font-size: 16px;  
    }  
  
    .info-panel p {  
        color: #aaaaaa;  
        font-size: 12px;  
        line-height: 1.4;  
    }  
  
    .mode-indicator {  
        position: absolute;  
        top: 50%;  
        left: 50%;  
        transform: translate(-50%, -50%);  
        font-size: 48px;  
        font-weight: bold;  
        color: rgba(0, 255, 255, 0.1);  
        pointer-events: none;  
        z-index: 100;  
        text-shadow: 0 0 20px #00ffff;  
    }  
  
    @keyframes pulse {  
        0% { opacity: 0.3; }  
        50% { opacity: 1; }  
        100% { opacity: 0.3; }  
    }  
  
    .pulsing {  
        animation: pulse 2s infinite;  
    }  
</style>  
```  
  
</head>  
<body>  
    <div class="container">  
        <div class="header">  
            <div class="equation">E = mc²</div>  
            <div style="font-size: 12px;">Relativistic Art Engine</div>  
        </div>  
  
```  
    <div class="controls">  
        <div class="control-group">  
            <label>Visualization Mode:</label>  
            <select id="modeSelect">  
                <option value="quantum">Quantum Fields</option>  
                <option value="spacetime">Spacetime Curvature</option>  
                <option value="entropy">Entropy Gradients</option>  
                <option value="fractal">Fractal Self-Similarity</option>  
                <option value="phase">Phase Transitions</option>  
            </select>  
        </div>  
  
        <div class="control-group">  
            <label>Energy Level:</label>  
            <input type="range" id="energySlider" min="1" max="100" value="50">  
        </div>  
  
        <div class="control-group">  
            <label>Mass Factor:</label>  
            <input type="range" id="massSlider" min="1" max="100" value="25">  
        </div>  
  
        <div class="control-group">  
            <label>Speed of Light (c):</label>  
            <input type="range" id="speedSlider" min="1" max="100" value="75">  
        </div>  
  
        <div class="control-group">  
            <label>Time Scale:</label>  
            <input type="range" id="timeSlider" min="1" max="100" value="50">  
        </div>  
  
        <div class="control-group">  
            <button id="resetBtn">Reset Parameters</button>  
        </div>  
    </div>  
  
    <div class="canvas-container">  
        <canvas id="mainCanvas"></canvas>  
        <div class="mode-indicator" id="modeIndicator">QUANTUM FIELDS</div>  
    </div>  
  
    <div class="info-panel">  
        <h3 id="infoTitle">Quantum Field Fluctuations</h3>  
        <p id="infoText">Virtual particles emerge from vacuum energy fluctuations, following Heisenberg's uncertainty principle. Energy condenses into matter when field amplitude exceeds critical threshold.</p>  
    </div>  
</div>  
  
<script>  
    const canvas = document.getElementById('mainCanvas');  
    const ctx = canvas.getContext('2d');  
    const modeSelect = document.getElementById('modeSelect');  
    const energySlider = document.getElementById('energySlider');  
    const massSlider = document.getElementById('massSlider');  
    const speedSlider = document.getElementById('speedSlider');  
    const timeSlider = document.getElementById('timeSlider');  
    const resetBtn = document.getElementById('resetBtn');  
    const modeIndicator = document.getElementById('modeIndicator');  
    const infoTitle = document.getElementById('infoTitle');  
    const infoText = document.getElementById('infoText');  
  
    let animationId;  
    let time = 0;  
    let particles = [];  
    let fieldData = [];  
  
    // Resize canvas  
    function resizeCanvas() {  
        canvas.width = window.innerWidth;  
        canvas.height = window.innerHeight;  
    }  
    resizeCanvas();  
    window.addEventListener('resize', resizeCanvas);  
  
    // Physics constants and parameters  
    const PHI = 1.618033988749895;  
    const PI = Math.PI;  
    const PLANCK = 6.626e-34;  
    const C = 299792458;  
  
    // Utility functions  
    function random(min, max) {  
        return Math.random() * (max - min) + min;  
    }  
  
    function noise(x, y, z) {  
        return Math.sin(x * 0.1 + z) * Math.cos(y * 0.1 + z) * 0.5 + 0.5;  
    }  
  
    function hslToRgb(h, s, l) {  
        const c = (1 - Math.abs(2 * l - 1)) * s;  
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));  
        const m = l - c / 2;  
        let r, g, b;  
          
        if (0 <= h && h < 60) [r, g, b] = [c, x, 0];  
        else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];  
        else if (120 <= h && h < 180) [r, g, b] = [0, c, x];  
        else if (180 <= h && h < 240) [r, g, b] = [0, x, c];  
        else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];  
        else [r, g, b] = [c, 0, x];  
          
        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];  
    }  
  
    // Quantum Field Fluctuations  
    function drawQuantumFields() {  
        const energy = energySlider.value / 100;  
        const mass = massSlider.value / 100;  
        const speed = speedSlider.value / 100;  
        const timeScale = timeSlider.value / 100;  
  
        // Clear with fade effect  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
        // Generate quantum fluctuations  
        const gridSize = 4;  
        for (let x = 0; x < canvas.width; x += gridSize) {  
            for (let y = 0; y < canvas.height; y += gridSize) {  
                const fluctuation = noise(x, y, time * timeScale * 10) * energy;  
                const threshold = mass * 0.5;  
                  
                if (fluctuation > threshold) {  
                    // Particle formation  
                    const intensity = Math.min(1, (fluctuation - threshold) / threshold);  
                    const [r, g, b] = hslToRgb(200 + intensity * 100, 0.8, 0.4 + intensity * 0.4);  
                      
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;  
                    ctx.fillRect(x, y, gridSize * 2, gridSize * 2);  
                      
                    // Energy wave propagation  
                    const radius = intensity * 20 * speed;  
                    ctx.beginPath();  
                    ctx.arc(x + gridSize, y + gridSize, radius, 0, PI * 2);  
                    ctx.strokeStyle = `rgba(0, 255, 255, ${intensity * 0.3})`;  
                    ctx.lineWidth = 1;  
                    ctx.stroke();  
                } else {  
                    // Vacuum fluctuations  
                    const alpha = fluctuation * 0.1;  
                    ctx.fillStyle = `rgba(0, 100, 200, ${alpha})`;  
                    ctx.fillRect(x, y, gridSize, gridSize);  
                }  
            }  
        }  
    }  
  
    // Spacetime Curvature  
    function drawSpacetimeCurvature() {  
        const energy = energySlider.value / 100;  
        const mass = massSlider.value / 100;  
        const speed = speedSlider.value / 100;  
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
        // Central mass  
        const centerX = canvas.width / 2;  
        const centerY = canvas.height / 2;  
        const massRadius = mass * 50;  
  
        // Draw grid distortion  
        const gridSpacing = 40;  
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';  
        ctx.lineWidth = 1;  
  
        for (let x = 0; x <= canvas.width; x += gridSpacing) {  
            ctx.beginPath();  
            for (let y = 0; y <= canvas.height; y += 2) {  
                const dx = x - centerX;  
                const dy = y - centerY;  
                const distance = Math.sqrt(dx * dx + dy * dy);  
                const curvature = (mass * 1000) / (distance + 1);  
                const bendX = x + (dx / distance) * curvature * Math.sin(time * speed * 0.1);  
                const bendY = y + (dy / distance) * curvature * Math.sin(time * speed * 0.1);  
                  
                if (y === 0) ctx.moveTo(bendX, bendY);  
                else ctx.lineTo(bendX, bendY);  
            }  
            ctx.stroke();  
        }  
  
        for (let y = 0; y <= canvas.height; y += gridSpacing) {  
            ctx.beginPath();  
            for (let x = 0; x <= canvas.width; x += 2) {  
                const dx = x - centerX;  
                const dy = y - centerY;  
                const distance = Math.sqrt(dx * dx + dy * dy);  
                const curvature = (mass * 1000) / (distance + 1);  
                const bendX = x + (dx / distance) * curvature * Math.sin(time * speed * 0.1);  
                const bendY = y + (dy / distance) * curvature * Math.sin(time * speed * 0.1);  
                  
                if (x === 0) ctx.moveTo(bendX, bendY);  
                else ctx.lineTo(bendX, bendY);  
            }  
            ctx.stroke();  
        }  
  
        // Central mass visualization  
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, massRadius);  
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');  
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');  
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  
          
        ctx.fillStyle = gradient;  
        ctx.beginPath();  
        ctx.arc(centerX, centerY, massRadius, 0, PI * 2);  
        ctx.fill();  
    }  
  
    // Entropy Gradients  
    function drawEntropyGradients() {  
        const energy = energySlider.value / 100;  
        const mass = massSlider.value / 100;  
        const timeScale = timeSlider.value / 100;  
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
        // Create entropy field  
        const imageData = ctx.createImageData(canvas.width, canvas.height);  
        const data = imageData.data;  
  
        for (let x = 0; x < canvas.width; x++) {  
            for (let y = 0; y < canvas.height; y++) {  
                const i = (y * canvas.width + x) * 4;  
                  
                // Calculate entropy based on position and time  
                const entropy = noise(x * 0.01, y * 0.01, time * timeScale * 0.1) * energy;  
                const temperature = noise(x * 0.005, y * 0.005, time * timeScale * 0.05) * mass;  
                  
                // Order-disorder transition  
                const order = Math.exp(-entropy * 5);  
                const disorder = 1 - order;  
                  
                // Color mapping  
                const hue = (temperature * 240 + entropy * 120) % 360;  
                const [r, g, b] = hslToRgb(hue, 0.7, 0.3 + disorder * 0.4);  
                  
                data[i] = r;     // R  
                data[i + 1] = g; // G  
                data[i + 2] = b; // B  
                data[i + 3] = (order * 100 + disorder * 50); // A  
            }  
        }  
  
        ctx.putImageData(imageData, 0, 0);  
  
        // Draw phase boundaries  
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';  
        ctx.lineWidth = 2;  
        for (let i = 0; i < 10; i++) {  
            ctx.beginPath();  
            const phase = (time * timeScale * 0.1 + i * 0.5) % (PI * 2);  
            for (let x = 0; x < canvas.width; x += 5) {  
                const y = canvas.height * 0.5 + Math.sin(x * 0.01 + phase) * 100 * energy;  
                if (x === 0) ctx.moveTo(x, y);  
                else ctx.lineTo(x, y);  
            }  
            ctx.stroke();  
        }  
    }  
  
    // Fractal Self-Similarity  
    function drawFractalSimilarity() {  
        const energy = energySlider.value / 100;  
        const mass = massSlider.value / 100;  
        const speed = speedSlider.value / 100;  
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
        const centerX = canvas.width / 2;  
        const centerY = canvas.height / 2;  
        const maxDepth = 6;  
  
        function drawFractalLevel(x, y, size, depth, rotation) {  
            if (depth > maxDepth || size < 1) return;  
  
            const scaleFactor = 1 / PHI;  
            const energyDensity = energy * Math.pow(mass, depth / maxDepth);  
            const alpha = Math.min(1, energyDensity);  
  
            // Draw energy pattern  
            ctx.save();  
            ctx.translate(x, y);  
            ctx.rotate(rotation + time * speed * 0.01);  
  
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);  
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);  
            gradient.addColorStop(0.5, `rgba(0, 255, 255, ${alpha * 0.7})`);  
            gradient.addColorStop(1, `rgba(0, 0, 255, ${alpha * 0.3})`);  
  
            ctx.fillStyle = gradient;  
            ctx.beginPath();  
            ctx.arc(0, 0, size, 0, PI * 2);  
            ctx.fill();  
  
            // Draw spiral arms  
            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;  
            ctx.lineWidth = 2;  
            ctx.beginPath();  
            for (let angle = 0; angle < PI * 8; angle += 0.1) {  
                const r = size * Math.exp(-angle / (PI * 2)) * scaleFactor;  
                const px = r * Math.cos(angle);  
                const py = r * Math.sin(angle);  
                if (angle === 0) ctx.moveTo(px, py);  
                else ctx.lineTo(px, py);  
            }  
            ctx.stroke();  
  
            ctx.restore();  
  
            // Recursive self-similar structures  
            const newSize = size * scaleFactor;  
            const branches = 5;  
            for (let i = 0; i < branches; i++) {  
                const angle = (i / branches) * PI * 2;  
                const distance = size * 0.6;  
                const newX = x + Math.cos(angle) * distance;  
                const newY = y + Math.sin(angle) * distance;  
                drawFractalLevel(newX, newY, newSize, depth + 1, rotation + angle);  
            }  
        }  
  
        drawFractalLevel(centerX, centerY, 100 * energy, 0, time * speed * 0.005);  
    }  
  
    // Phase Transitions  
    function drawPhaseTransitions() {  
        const energy = energySlider.value / 100;  
        const mass = massSlider.value / 100;  
        const speed = speedSlider.value / 100;  
        const timeScale = timeSlider.value / 100;  
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  
  
        // Temperature field  
        const temperature = Math.sin(time * timeScale * 0.1) * 0.5 + 0.5;  
        const criticalTemp = mass;  
  
        // Phase field visualization  
        for (let x = 0; x < canvas.width; x += 8) {  
            for (let y = 0; y < canvas.height; y += 8) {  
                const localTemp = temperature + noise(x * 0.01, y * 0.01, time * timeScale * 0.05) * 0.3;  
                const orderParameter = Math.tanh((criticalTemp - localTemp) * 10);  
                  
                if (orderParameter > 0) {  
                    // Ordered phase (matter)  
                    const intensity = orderParameter * energy;  
                    const [r, g, b] = hslToRgb(240, 0.8, 0.5);  
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;  
                    ctx.fillRect(x, y, 8, 8);  
                } else {  
                    // Disordered phase (energy)  
                    const intensity = -orderParameter * energy;  
                    const [r, g, b] = hslToRgb(60, 0.8, 0.5);  
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;  
                    ctx.fillRect(x, y, 8, 8);  
                }  
            }  
        }  
  
        // Draw phase boundary  
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';  
        ctx.lineWidth = 3;  
        ctx.beginPath();  
        for (let x = 0; x < canvas.width; x += 2) {  
            const localTemp = temperature + noise(x * 0.01, 0, time * timeScale * 0.05) * 0.3;  
            const y = canvas.height * (localTemp / (criticalTemp * 2));  
            if (x === 0) ctx.moveTo(x, y);  
            else ctx.lineTo(x, y);  
        }  
        ctx.stroke();  
  
        // Interface dynamics  
        const interfaceWidth = 20;  
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);  
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');  
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');  
        gradient.addColorStop(1, 'rgba(0, 0, 255, 0.3)');  
          
        ctx.fillStyle = gradient;  
        ctx.fillRect(0, canvas.height * temperature - interfaceWidth/2, canvas.width, interfaceWidth);  
    }  
  
    // Main render loop  
    function render() {  
        time += 0.1;  
          
        const mode = modeSelect.value;  
          
        switch (mode) {  
            case 'quantum':  
                drawQuantumFields();  
                break;  
            case 'spacetime':  
                drawSpacetimeCurvature();  
                break;  
            case 'entropy':  
                drawEntropyGradients();  
                break;  
            case 'fractal':  
                drawFractalSimilarity();  
                break;  
            case 'phase':  
                drawPhaseTransitions();  
                break;  
        }  
          
        animationId = requestAnimationFrame(render);  
    }  
  
    // Mode info data  
    const modeInfo = {  
        quantum: {  
            title: "Quantum Field Fluctuations",  
            text: "Virtual particles emerge from vacuum energy fluctuations, following Heisenberg's uncertainty principle. Energy condenses into matter when field amplitude exceeds critical threshold.",  
            indicator: "QUANTUM FIELDS"  
        },  
        spacetime: {  
            title: "Spacetime Curvature",  
            text: "Mass-energy curves spacetime geometry according to Einstein's field equations. Grid distortions show how matter affects the fabric of space and time.",  
            indicator: "SPACETIME CURVATURE"  
        },  
        entropy: {  
            title: "Entropy Gradients",  
            text: "Thermodynamic order-disorder transitions visualized through temperature and entropy fields. Phase boundaries separate organized matter from chaotic energy.",  
            indicator: "ENTROPY GRADIENTS"  
        },  
        fractal: {  
            title: "Fractal Self-Similarity",  
            text: "Energy-matter patterns repeat at different scales following golden ratio proportions. Self-similar structures emerge from recursive energy transformations.",  
            indicator: "FRACTAL SIMILARITY"  
        },  
        phase: {  
            title: "Phase Transitions",  
            text: "Sharp transitions between matter and energy phases occur at critical temperatures. Interface dynamics show how phase boundaries evolve over time.",  
            indicator: "PHASE TRANSITIONS"  
        }  
    };  
  
    // Event listeners  
    modeSelect.addEventListener('change', () => {  
        const mode = modeSelect.value;  
        const info = modeInfo[mode];  
        infoTitle.textContent = info.title;  
        infoText.textContent = info.text;  
        modeIndicator.textContent = info.indicator;  
    });  
  
    resetBtn.addEventListener('click', () => {  
        energySlider.value = 50;  
        massSlider.value = 25;  
        speedSlider.value = 75;  
        timeSlider.value = 50;  
    });  
  
    // Start the engine  
    render();  
</script>  
```  
  
</body>  
</html>  
