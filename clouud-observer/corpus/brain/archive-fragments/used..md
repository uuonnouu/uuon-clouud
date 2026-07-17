used.  
  
<!DOCTYPE html>  
  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Mathematical Algorithm Visualizer</title>  
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>  
    <style>  
        body {  
            margin: 0;  
            padding: 0;  
            background: #000;  
            color: #fff;  
            font-family: 'Courier New', monospace;  
            overflow: hidden;  
        }  
  
```  
    #container {  
        position: relative;  
        width: 100vw;  
        height: 100vh;  
    }  
      
    #controls {  
        position: absolute;  
        top: 10px;  
        left: 10px;  
        z-index: 1000;  
        background: rgba(0, 0, 0, 0.8);  
        padding: 20px;  
        border-radius: 10px;  
        border: 1px solid #333;  
        max-width: 300px;  
    }  
      
    .control-group {  
        margin-bottom: 15px;  
    }  
      
    label {  
        display: block;  
        margin-bottom: 5px;  
        font-size: 12px;  
        color: #aaa;  
    }  
      
    input[type="range"] {  
        width: 100%;  
        margin-bottom: 5px;  
    }  
      
    select {  
        width: 100%;  
        padding: 5px;  
        background: #333;  
        color: #fff;  
        border: 1px solid #555;  
        border-radius: 3px;  
    }  
      
    .value-display {  
        font-size: 10px;  
        color: #0ff;  
    }  
      
    #info {  
        position: absolute;  
        bottom: 10px;  
        right: 10px;  
        z-index: 1000;  
        background: rgba(0, 0, 0, 0.8);  
        padding: 10px;  
        border-radius: 5px;  
        font-size: 12px;  
    }  
      
    .glow {  
        text-shadow: 0 0 10px #0ff;  
    }  
      
    h3 {  
        margin: 0 0 10px 0;  
        color: #0ff;  
    }  
</style>  
```  
  
</head>  
<body>  
    <div id="container">  
        <div id="controls">  
            <h3>Algorithm Visualizer</h3>  
  
```  
        <div class="control-group">  
            <label for="equation">Equation Type:</label>  
            <select id="equation">  
                <option value="newtons">Newton's F=ma</option>  
                <option value="kinematic">Kinematic v=u+at</option>  
                <option value="energy">Kinetic Energy</option>  
                <option value="ohms">Ohm's Law V=IR</option>  
                <option value="einstein">E=mc²</option>  
                <option value="quadratic">Quadratic Formula</option>  
                <option value="circle">Circle Area</option>  
                <option value="pythagorean">Pythagorean</option>  
                <option value="gas">Ideal Gas Law</option>  
                <option value="normal">Normal Distribution</option>  
            </select>  
        </div>  
          
        <div class="control-group">  
            <label for="chaos">Chaos Factor: <span class="value-display" id="chaosValue">0.5</span></label>  
            <input type="range" id="chaos" min="0" max="2" step="0.1" value="0.5">  
        </div>  
          
        <div class="control-group">  
            <label for="frequency">Frequency: <span class="value-display" id="freqValue">1.0</span></label>  
            <input type="range" id="frequency" min="0.1" max="3" step="0.1" value="1.0">  
        </div>  
          
        <div class="control-group">  
            <label for="amplitude">Amplitude: <span class="value-display" id="ampValue">1.0</span></label>  
            <input type="range" id="amplitude" min="0.1" max="3" step="0.1" value="1.0">  
        </div>  
          
        <div class="control-group">  
            <label for="speed">Animation Speed: <span class="value-display" id="speedValue">1.0</span></label>  
            <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1.0">  
        </div>  
          
        <div class="control-group">  
            <label for="glowIntensity">Glow Effect: <span class="value-display" id="glowValue">0.3</span></label>  
            <input type="range" id="glowIntensity" min="0" max="0.5" step="0.05" value="0.3">  
        </div>  
          
        <div class="control-group">  
            <label for="particleCount">Particles: <span class="value-display" id="particleValue">0.2</span></label>  
            <input type="range" id="particleCount" min="0" max="0.5" step="0.05" value="0.2">  
        </div>  
    </div>  
      
    <div id="info">  
        <div id="currentEquation" class="glow">Newton's Second Law: F = ma</div>  
        <div id="currentValues">F=6666.67%, m=14444.44%, a=1111.11%</div>  
    </div>  
</div>  
  
<script>  
    let scene, camera, renderer, time = 0;  
    let mainGeometry, particleSystem, glowMaterial;  
    let animationId;  
      
    // Equation data with percentage values  
    const equations = {  
        newtons: {  
            name: "Newton's Second Law: F = ma",  
            values: "F=6666.67%, m=14444.44%, a=1111.11%",  
            func: (x, y, t, params) => {  
                const F = 66.67 * params.amplitude;  
                const m = 144.44 * params.chaos;  
                const a = 11.11 * params.frequency;  
                return Math.sin(F * x + t) * Math.cos(m * y + t) * a;  
            }  
        },  
        kinematic: {  
            name: "Kinematic: v = u + at",  
            values: "v=24444.44%, u=23333.33%, a=1111.11%, t=22222.22%",  
            func: (x, y, t, params) => {  
                const v = 244.44 * params.amplitude;  
                const u = 233.33 * params.chaos;  
                const a = 11.11 * params.frequency;  
                return Math.sin(v * x + u * y + a * t) * Math.cos(t * 0.5);  
            }  
        },  
        energy: {  
            name: "Kinetic Energy: KE = ½mv²",  
            values: "KE=11111.11%, m=14444.44%, v=24444.44%",  
            func: (x, y, t, params) => {  
                const KE = 111.11 * params.amplitude;  
                const m = 144.44 * params.chaos;  
                const v = 244.44 * params.frequency;  
                return 0.5 * m * Math.pow(Math.sin(v * x + t), 2) * Math.cos(KE * y + t);  
            }  
        },  
        ohms: {  
            name: "Ohm's Law: V = IR",  
            values: "V=24444.44%, I=9999.99%, R=19999.99%",  
            func: (x, y, t, params) => {  
                const V = 244.44 * params.amplitude;  
                const I = 99.99 * params.chaos;  
                const R = 199.99 * params.frequency;  
                return Math.sin(V * x + t) * Math.sin(I * y + t) * Math.cos(R * (x + y) + t);  
            }  
        },  
        einstein: {  
            name: "E = mc²",  
            values: "E=5555.56%, m=14444.44%, c=3333.33%",  
            func: (x, y, t, params) => {  
                const E = 55.56 * params.amplitude;  
                const m = 144.44 * params.chaos;  
                const c = 33.33 * params.frequency;  
                return E * Math.sin(m * x + t) * Math.pow(Math.cos(c * y + t), 2);  
            }  
        },  
        quadratic: {  
            name: "Quadratic Formula",  
            values: "x=26666.67%, a=1111.11%, b=2222.22%, c=3333.33%",  
            func: (x, y, t, params) => {  
                const a = 11.11 * params.chaos;  
                const b = 22.22 * params.frequency;  
                const c = 33.33 * params.amplitude;  
                const discriminant = b * b - 4 * a * c;  
                return Math.sin(Math.sqrt(Math.abs(discriminant)) * x + t) * Math.cos(b * y + t);  
            }  
        },  
        circle: {  
            name: "Circle Area: A = πr²",  
            values: "A=1515.15%, r=19999.99%",  
            func: (x, y, t, params) => {  
                const A = 15.15 * params.amplitude;  
                const r = 199.99 * params.chaos;  
                return A * Math.PI * Math.pow(Math.sin(r * Math.sqrt(x*x + y*y) + t), 2) * params.frequency;  
            }  
        },  
        pythagorean: {  
            name: "Pythagorean: a² + b² = c²",  
            values: "a=1111.11%, b=2222.22%, c=3333.33%",  
            func: (x, y, t, params) => {  
                const a = 11.11 * params.chaos;  
                const b = 22.22 * params.frequency;  
                const c = 33.33 * params.amplitude;  
                return Math.sqrt(a*a * Math.sin(x + t) * Math.sin(x + t) + b*b * Math.cos(y + t) * Math.cos(y + t)) - c;  
            }  
        },  
        gas: {  
            name: "Ideal Gas Law: PV = nRT",  
            values: "P=17777.78%, V=24444.44%, n=15555.56%, R=19999.99%, T=22222.22%",  
            func: (x, y, t, params) => {  
                const P = 177.78 * params.amplitude;  
                const V = 244.44 * params.chaos;  
                const n = 155.56 * params.frequency;  
                return P * Math.sin(V * x + t) * Math.cos(n * y + t);  
            }  
        },  
        normal: {  
            name: "Normal Distribution",  
            values: "σ=19999.99%, μ=14444.44%, x=26666.67%",  
            func: (x, y, t, params) => {  
                const sigma = 199.99 * params.chaos;  
                const mu = 144.44 * params.frequency;  
                const variance = sigma * sigma;  
                return Math.exp(-0.5 * Math.pow((x - mu + Math.sin(t)), 2) / variance) * Math.cos(y * params.amplitude + t);  
            }  
        }  
    };  
      
    function init() {  
        scene = new THREE.Scene();  
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  
        renderer = new THREE.WebGLRenderer({ antialias: true });  
        renderer.setSize(window.innerWidth, window.innerHeight);  
        renderer.setClearColor(0x000000);  
        document.getElementById('container').appendChild(renderer.domElement);  
          
        camera.position.z = 5;  
          
        createVisualization();  
        setupControls();  
        animate();  
    }  
      
    function createVisualization() {  
        // Create main mesh  
        const geometry = new THREE.PlaneGeometry(8, 8, 100, 100);  
          
        // Create materials with limited glow  
        const material = new THREE.MeshBasicMaterial({  
            color: 0x00ffff,  
            wireframe: true,  
            transparent: true,  
            opacity: 0.8  
        });  
          
        const mesh = new THREE.Mesh(geometry, material);  
        scene.add(mesh);  
          
        // Create limited particle system  
        const particleGeometry = new THREE.BufferGeometry();  
        const particleCount = 200; // Limited to keep under 50%  
        const positions = new Float32Array(particleCount * 3);  
          
        for (let i = 0; i < particleCount * 3; i++) {  
            positions[i] = (Math.random() - 0.5) * 10;  
        }  
          
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));  
          
        const particleMaterial = new THREE.PointsMaterial({  
            color: 0xff6600,  
            size: 0.02,  
            transparent: true,  
            opacity: 0.6  
        });  
          
        particleSystem = new THREE.Points(particleGeometry, particleMaterial);  
        scene.add(particleSystem);  
          
        mainGeometry = geometry;  
    }  
      
    function updateVisualization() {  
        const equationType = document.getElementById('equation').value;  
        const chaos = parseFloat(document.getElementById('chaos').value);  
        const frequency = parseFloat(document.getElementById('frequency').value);  
        const amplitude = parseFloat(document.getElementById('amplitude').value);  
        const speed = parseFloat(document.getElementById('speed').value);  
        const glowIntensity = parseFloat(document.getElementById('glowIntensity').value);  
        const particleIntensity = parseFloat(document.getElementById('particleCount').value);  
          
        const equation = equations[equationType];  
        const positions = mainGeometry.attributes.position.array;  
          
        // Update equation info  
        document.getElementById('currentEquation').textContent = equation.name;  
        document.getElementById('currentValues').textContent = equation.values;  
          
        // Update main mesh  
        for (let i = 0; i < positions.length; i += 3) {  
            const x = positions[i];  
            const y = positions[i + 1];  
              
            const params = { chaos, frequency, amplitude };  
            const z = equation.func(x * 0.5, y * 0.5, time * speed, params) * 0.1;  
              
            positions[i + 2] = z;  
        }  
          
        mainGeometry.attributes.position.needsUpdate = true;  
          
        // Update particle system (limited effect)  
        if (particleSystem) {  
            const particlePositions = particleSystem.geometry.attributes.position.array;  
            for (let i = 0; i < particlePositions.length; i += 3) {  
                const x = particlePositions[i];  
                const y = particlePositions[i + 1];  
                  
                const params = { chaos: chaos * 0.3, frequency: frequency * 0.3, amplitude: amplitude * 0.3 };  
                const z = equation.func(x * 0.1, y * 0.1, time * speed * 0.5, params) * 0.05;  
                  
                particlePositions[i + 2] = z * particleIntensity;  
            }  
            particleSystem.geometry.attributes.position.needsUpdate = true;  
        }  
          
        // Update glow effect (limited)  
        scene.children.forEach(child => {  
            if (child.material) {  
                if (child.material.type === 'MeshBasicMaterial') {  
                    child.material.opacity = 0.8 + glowIntensity * 0.4;  
                } else if (child.material.type === 'PointsMaterial') {  
                    child.material.opacity = 0.6 + particleIntensity * 0.8;  
                }  
            }  
        });  
    }  
      
    function setupControls() {  
        const controls = ['chaos', 'frequency', 'amplitude', 'speed', 'glowIntensity', 'particleCount'];  
        controls.forEach(control => {  
            const slider = document.getElementById(control);  
            const display = document.getElementById(control + 'Value');  
              
            slider.addEventListener('input', (e) => {  
                display.textContent = e.target.value;  
            });  
        });  
          
        document.getElementById('equation').addEventListener('change', () => {  
            // Reset time for smooth transitions  
            time = 0;  
        });  
    }  
      
    function animate() {  
        time += 0.016;  
          
        updateVisualization();  
          
        // Rotate camera slightly  
        camera.position.x = Math.sin(time * 0.1) * 0.5;  
        camera.position.y = Math.cos(time * 0.1) * 0.3;  
        camera.lookAt(0, 0, 0);  
          
        renderer.render(scene, camera);  
        animationId = requestAnimationFrame(animate);  
    }  
      
    // Handle window resize  
    window.addEventListener('resize', () => {  
        camera.aspect = window.innerWidth / window.innerHeight;  
        camera.updateProjectionMatrix();  
        renderer.setSize(window.innerWidth, window.innerHeight);  
    });  
      
    // Initialize on load  
    init();  
</script>  
```  
  
</body>  
</html>  
