Terrain Fractal Art  
  
![DETAIL LEVE](Attachments/A66B855B-3976-47CC-B1CE-A41192EAA70A.heic)  
  
  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <meta name="author" content="Phillip A Ruiz III">  
  <meta name="email" content="phi1@uuonfoundation.com">  
  <meta name="website" content="www.UUONfoundation.com">  
  <meta name="description" content="Fractal Terrain Visualization - Algorithm and Art Style by Phillip A Ruiz III">  
  <title>Fractal Terrain Art by Phillip A Ruiz III</title>  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>  
  <style>  
    * {  
      margin: 0;  
      padding: 0;  
      box-sizing: border-box;  
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  
    }  
      
    body {  
      margin: 0;  
      overflow: hidden;  
      background: #000;  
      color: white;  
    }  
      
    #canvas-container {  
      position: relative;  
      width: 100vw;  
      height: 100vh;  
    }  
      
    canvas {  
      display: block;  
      position: absolute;  
      top: 0;  
      left: 0;  
    }  
      
    #controls {  
      position: absolute;  
      bottom: 0;  
      left: 0;  
      width: 100%;  
      background: rgba(0, 0, 0, 0.7);  
      backdrop-filter: blur(10px);  
      padding: 15px;  
      display: flex;  
      flex-wrap: wrap;  
      gap: 15px;  
      justify-content: center;  
      border-top: 1px solid rgba(255, 255, 255, 0.1);  
      transition: transform 0.3s ease;  
      z-index: 10;  
    }  
      
    .control-group {  
      display: flex;  
      flex-direction: column;  
      align-items: center;  
      gap: 8px;  
      min-width: 120px;  
    }  
      
    .control-label {  
      font-size: 0.9rem;  
      font-weight: 500;  
      color: rgba(255, 255, 255, 0.9);  
      text-transform: uppercase;  
      letter-spacing: 1px;  
    }  
      
    input[type="range"] {  
      -webkit-appearance: none;  
      width: 100%;  
      height: 6px;  
      background: rgba(255, 255, 255, 0.2);  
      border-radius: 3px;  
      outline: none;  
    }  
      
    input[type="range"]::-webkit-slider-thumb {  
      -webkit-appearance: none;  
      width: 16px;  
      height: 16px;  
      border-radius: 50%;  
      background: #4f46e5;  
      cursor: pointer;  
      border: 2px solid rgba(255, 255, 255, 0.8);  
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);  
    }  
      
    input[type="range"]::-moz-range-thumb {  
      width: 16px;  
      height: 16px;  
      border-radius: 50%;  
      background: #4f46e5;  
      cursor: pointer;  
      border: 2px solid rgba(255, 255, 255, 0.8);  
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);  
    }  
      
    .value-display {  
      font-size: 0.8rem;  
      color: rgba(255, 255, 255, 0.7);  
      min-width: 40px;  
      text-align: center;  
    }  
      
    .toggle-button {  
      background: #4f46e5;  
      color: white;  
      border: none;  
      padding: 8px 16px;  
      border-radius: 4px;  
      cursor: pointer;  
      font-weight: 500;  
      transition: all 0.2s ease;  
    }  
      
    .toggle-button:hover {  
      background: #6366f1;  
      transform: translateY(-2px);  
    }  
      
    .toggle-button.active {  
      background: #7c3aed;  
      box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);  
    }  
      
    .color-picker {  
      width: 30px;  
      height: 30px;  
      border: 2px solid white;  
      border-radius: 50%;  
      overflow: hidden;  
      cursor: pointer;  
    }  
      
    .color-picker input {  
      width: 150%;  
      height: 150%;  
      transform: translate(-25%, -25%);  
      cursor: pointer;  
    }  
      
    .hide-controls {  
      position: absolute;  
      bottom: 100%;  
      right: 20px;  
      background: rgba(0, 0, 0, 0.7);  
      color: white;  
      border: none;  
      border-radius: 4px 4px 0 0;  
      padding: 5px 10px;  
      cursor: pointer;  
      font-size: 0.8rem;  
      display: flex;  
      align-items: center;  
      gap: 5px;  
    }  
      
    .hide-controls svg {  
      width: 16px;  
      height: 16px;  
      transition: transform 0.3s ease;  
    }  
      
    .controls-hidden .hide-controls svg {  
      transform: rotate(180deg);  
    }  
      
    .controls-hidden #controls {  
      transform: translateY(100%);  
    }  
      
    @media (max-width: 768px) {  
      .control-group {  
        min-width: 100px;  
      }  
        
      .control-label {  
        font-size: 0.8rem;  
      }  
    }  
      
    .preset-button {  
      background: rgba(255, 255, 255, 0.1);  
      color: white;  
      border: 1px solid rgba(255, 255, 255, 0.2);  
      padding: 6px 12px;  
      border-radius: 4px;  
      cursor: pointer;  
      font-size: 0.8rem;  
      transition: all 0.2s ease;  
    }  
      
    .preset-button:hover {  
      background: rgba(255, 255, 255, 0.2);  
    }  
      
    .preset-button.active {  
      background: #4f46e5;  
      border-color: #4f46e5;  
    }  
      
    .presets {  
      display: flex;  
      gap: 8px;  
    }  
      
    .signature {  
      position: absolute;  
      top: 20px;  
      right: 20px;  
      font-size: 0.9rem;  
      color: rgba(255, 255, 255, 0.7);  
      text-align: right;  
      pointer-events: none;  
      z-index: 5;  
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);  
    }  
      
    .signature strong {  
      font-size: 1.1rem;  
      color: rgba(255, 255, 255, 0.9);  
      display: block;  
      margin-bottom: 3px;  
    }  
      
    .signature a {  
      color: #8b5cf6;  
      text-decoration: none;  
      pointer-events: auto;  
    }  
      
    .signature a:hover {  
      text-decoration: underline;  
    }  
  </style>  
</head>  
<body>  
  <div id="canvas-container">  
    <div class="signature">  
      <strong>Phillip A Ruiz III</strong>  
      <div>phi1@uuonfoundation.com</div>  
      <div><a href="http://www.UUONfoundation.com" target="_blank">www.UUONfoundation.com</a></div>  
    </div>  
      
    <div id="controls">  
      <button class="hide-controls">  
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  
          <polyline points="18 15 12 9 6 15"></polyline>  
        </svg>  
        Hide Controls  
      </button>  
        
      <div class="control-group">  
        <span class="control-label">Terrain Height</span>  
        <input type="range" id="height-control" min="0.5" max="5" step="0.1" value="2.5">  
        <span class="value-display" id="height-value">2.5</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Wave Speed</span>  
        <input type="range" id="speed-control" min="0.001" max="0.05" step="0.001" value="0.01">  
        <span class="value-display" id="speed-value">0.01</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Detail Level</span>  
        <input type="range" id="detail-control" min="1" max="8" step="1" value="6">  
        <span class="value-display" id="detail-value">6</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Pattern Scale</span>  
        <input type="range" id="scale-control" min="0.05" max="0.5" step="0.01" value="0.1">  
        <span class="value-display" id="scale-value">0.10</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Phi Factor</span>  
        <input type="range" id="phi-control" min="0.1" max="3" step="0.1" value="1.618">  
        <span class="value-display" id="phi-value">1.62</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Rotation</span>  
        <input type="range" id="rotation-control" min="0" max="0.005" step="0.0001" value="0.0005">  
        <span class="value-display" id="rotation-value">0.0005</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Light Intensity</span>  
        <input type="range" id="light-control" min="0.2" max="2" step="0.1" value="1">  
        <span class="value-display" id="light-value">1.0</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Color Shift</span>  
        <input type="range" id="color-shift-control" min="0" max="10" step="0.1" value="1">  
        <span class="value-display" id="color-shift-value">1.0</span>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Color Mode</span>  
        <div class="presets">  
          <button class="preset-button active" data-mode="rainbow">Rainbow</button>  
          <button class="preset-button" data-mode="ocean">Ocean</button>  
          <button class="preset-button" data-mode="lava">Lava</button>  
          <button class="preset-button" data-mode="phi">Phi</button>  
        </div>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Particles</span>  
        <button class="toggle-button active" id="particles-toggle">ON</button>  
      </div>  
        
      <div class="control-group">  
        <span class="control-label">Wireframe</span>  
        <button class="toggle-button" id="wireframe-toggle">OFF</button>  
      </div>  
    </div>  
  </div>  
  
  <script>  
    let scene, camera, renderer, mesh, geometry, material, time = 0;  
    let particles, particlesVisible = true;  
    let wireframeMode = false;  
    let colorMode = 'rainbow';  
    let heightFactor = 2.5;  
    let speedFactor = 0.01;  
    let detailLevel = 6;  
    let patternScale = 0.1;  
    let phiFactor = 1.618; // Golden ratio  
    let rotationSpeed = 0.0005;  
    let lightIntensity = 1;  
    let colorShiftFactor = 1;  
    let directionalLight;  
      
    // Enhanced noise functions  
    const permutation = [];  
    for (let i = 0; i < 256; i++) {  
      permutation.push(Math.floor(Math.random() * 256));  
    }  
      
    const p = new Array(512);  
    for (let i = 0; i < 512; i++) {  
      p[i] = permutation[i & 255];  
    }  
      
    function fade(t) {  
      return t * t * t * (t * (t * 6 - 15) + 10);  
    }  
      
    function lerp(a, b, t) {  
      return a + t * (b - a);  
    }  
      
    function grad(hash, x, y, z) {  
      const h = hash & 15;  
      const u = h < 8 ? x : y;  
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;  
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);  
    }  
      
    function improvedNoise(x, y, z) {  
      const X = Math.floor(x) & 255;  
      const Y = Math.floor(y) & 255;  
      const Z = Math.floor(z) & 255;  
        
      x -= Math.floor(x);  
      y -= Math.floor(y);  
      z -= Math.floor(z);  
        
      const u = fade(x);  
      const v = fade(y);  
      const w = fade(z);  
        
      const A = p[X] + Y;  
      const AA = p[A] + Z;  
      const AB = p[A + 1] + Z;  
      const B = p[X + 1] + Y;  
      const BA = p[B] + Z;  
      const BB = p[B + 1] + Z;  
        
      return lerp(  
        lerp(  
          lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),  
          lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),  
          v  
        ),  
        lerp(  
          lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),  
          lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u),  
          v  
        ),  
        w  
      );  
    }  
      
    // Fractal Brownian Motion with enhanced detail  
    const fbm = (x, y, z) => {  
      let v = 0;  
      let a = 0.5;  
      let frequency = 1.0;  
      let lacunarity = 2.0;  
      let gain = 0.5;  
        
      // Apply phi factor to create more interesting patterns  
      x *= patternScale;  
      y *= patternScale;  
      z *= patternScale;  
        
      for (let i = 0; i < detailLevel; i++) {  
        // Use improved noise for better detail  
        v += a * improvedNoise(x * frequency, y * frequency, z * frequency);  
          
        // Apply phi factor for more organic patterns  
        frequency *= lacunarity * (1 + (phiFactor - 1) * 0.1);  
        a *= gain * (1 + (phiFactor - 1) * 0.05);  
      }  
        
      return v;  
    };  
      
    // Domain warping for more complex patterns  
    const warpedFbm = (x, y, z) => {  
      // First layer of fbm  
      const warpX = fbm(x, y, z);  
      const warpY = fbm(x + phiFactor, y + phiFactor, z);  
      const warpZ = fbm(x - phiFactor, y - phiFactor, z + phiFactor);  
        
      // Second layer with warping  
      return fbm(  
        x + warpX * phiFactor * 0.5,   
        y + warpY * phiFactor * 0.5,   
        z + warpZ * phiFactor * 0.5  
      );  
    };  
      
    function init() {  
      // Scene setup  
      scene = new THREE.Scene();  
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  
        
      renderer = new THREE.WebGLRenderer({ antialias: true });  
      renderer.setSize(window.innerWidth, window.innerHeight);  
      renderer.shadowMap.enabled = true;  
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;  
      document.getElementById('canvas-container').prepend(renderer.domElement);  
        
      // Create terrain  
      createTerrain();  
        
      // Lighting  
      directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);  
      directionalLight.position.set(5, 10, 5);  
      directionalLight.castShadow = true;  
      scene.add(directionalLight);  
        
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);  
      scene.add(ambientLight);  
        
      // Camera position  
      camera.position.set(0, 5, 10);  
        
      // Create particles  
      createParticles();  
        
      // Event listeners  
      window.addEventListener('resize', onWindowResize);  
      window.addEventListener('mousemove', onMouseMove);  
        
      // Setup UI controls  
      setupControls();  
    }  
      
    function createTerrain() {  
      // Create terrain geometry with higher resolution for more detail  
      geometry = new THREE.PlaneGeometry(20, 20, 250, 250);  
      updateTerrainGeometry();  
        
      // Create material  
      material = new THREE.MeshPhongMaterial({  
        vertexColors: true,  
        shininess: 100,  
        transparent: true,  
        opacity: 0.8,  
        wireframe: wireframeMode,  
        flatShading: true // Enable flat shading for more detailed look  
      });  
        
      // Create mesh  
      mesh = new THREE.Mesh(geometry, material);  
      scene.add(mesh);  
    }  
      
    function updateTerrainGeometry() {  
      const vertices = geometry.attributes.position.array;  
      const colors = new Float32Array(vertices.length);  
        
      for (let i = 0; i < vertices.length; i += 3) {  
        const x = vertices[i];  
        const y = vertices[i + 1];  
          
        // Use the enhanced noise function for more detailed terrain  
        const z = warpedFbm(x, y, time) * heightFactor;  
        vertices[i + 2] = z;  
          
        // Set colors based on mode with color shifting  
        if (colorMode === 'rainbow') {  
          colors[i] = Math.sin(x * 0.1 + time * colorShiftFactor) * 0.5 + 0.5;  
          colors[i + 1] = Math.sin(y * 0.1 + time * colorShiftFactor * 1.1) * 0.5 + 0.5;  
          colors[i + 2] = Math.sin(z * 0.1 + time * colorShiftFactor * 1.3) * 0.5 + 0.5;  
        } else if (colorMode === 'ocean') {  
          const height = (z / heightFactor + 1) / 2; // Normalize to 0-1  
          colors[i] = 0.1;  
          colors[i + 1] = 0.3 + height * 0.5;  
          colors[i + 2] = 0.5 + height * 0.5;  
        } else if (colorMode === 'lava') {  
          const height = (z / heightFactor + 1) / 2; // Normalize to 0-1  
          colors[i] = 0.5 + height * 0.5;  
          colors[i + 1] = 0.2 + height * 0.3;  
          colors[i + 2] = 0.1;  
        } else if (colorMode === 'phi') {  
          // Special phi-based coloring  
          const phi = 1.618033988749895;  
          const height = (z / heightFactor + 1) / 2; // Normalize to 0-1  
            
          // Use golden ratio to create harmonious color shifts  
          colors[i] = (Math.sin(height * phi * Math.PI * 2 + time * colorShiftFactor) * 0.5 + 0.5);  
          colors[i + 1] = (Math.sin(height * phi * Math.PI * 2 + Math.PI/3 + time * colorShiftFactor) * 0.5 + 0.5);  
          colors[i + 2] = (Math.sin(height * phi * Math.PI * 2 + 2*Math.PI/3 + time * colorShiftFactor) * 0.5 + 0.5);  
        }  
      }  
        
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));  
      geometry.attributes.position.needsUpdate = true;  
      geometry.attributes.color.needsUpdate = true;  
        
      // Compute normals for better lighting  
      geometry.computeVertexNormals();  
    }  
      
    function createParticles() {  
      particles = new THREE.Group();  
        
      // Create phi-based particle distribution  
      const phi = 1.618033988749895;  
      const particleCount = 150;  
        
      for (let i = 0; i < particleCount; i++) {  
        // Use phi to distribute particles more interestingly  
        const angle = i * phi * Math.PI * 2;  
        const radius = 10 * Math.sqrt(i / particleCount);  
          
        const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);  
        const particleMaterial = new THREE.MeshBasicMaterial({  
          color: new THREE.Color().setHSL(i / particleCount, 0.8, 0.6)  
        });  
          
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);  
          
        // Position particles in a spiral pattern  
        particle.position.set(  
          Math.cos(angle) * radius,  
          Math.sin(angle) * radius,  
          (Math.random() - 0.5) * 10  
        );  
          
        // Add velocity for animation with phi-based variations  
        particle.userData.velocity = {  
          x: (Math.sin(i * phi) * 0.01),  
          y: (Math.cos(i * phi) * 0.01),  
          z: (Math.sin(i * phi + Math.cos(i)) * 0.01)  
        };  
          
        particles.add(particle);  
      }  
        
      scene.add(particles);  
    }  
      
    function updateParticles() {  
      if (!particles) return;  
        
      particles.children.forEach((particle, i) => {  
        // Update position based on velocity  
        particle.position.x += particle.userData.velocity.x;  
        particle.position.y += particle.userData.velocity.y;  
        particle.position.z += particle.userData.velocity.z;  
          
        // Apply subtle phi-based oscillation  
        const phi = 1.618033988749895;  
        particle.position.x += Math.sin(time * 0.2 + i * phi) * 0.005;  
        particle.position.y += Math.cos(time * 0.3 + i * phi) * 0.005;  
          
        // Wrap around if out of bounds  
        const bound = 10;  
        if (Math.abs(particle.position.x) > bound) {  
          particle.position.x = -Math.sign(particle.position.x) * bound;  
        }  
        if (Math.abs(particle.position.y) > bound) {  
          particle.position.y = -Math.sign(particle.position.y) * bound;  
        }  
        if (Math.abs(particle.position.z) > bound) {  
          particle.position.z = -Math.sign(particle.position.z) * bound;  
        }  
          
        // Update particle color based on position and time  
        if (particle.material) {  
          particle.material.color.setHSL(  
            (particle.position.z / 20 + time * 0.05) % 1,  
            0.8,  
            0.6  
          );  
        }  
      });  
    }  
      
    function onWindowResize() {  
      camera.aspect = window.innerWidth / window.innerHeight;  
      camera.updateProjectionMatrix();  
      renderer.setSize(window.innerWidth, window.innerHeight);  
    }  
      
    function onMouseMove(event) {  
      const x = (event.clientX / window.innerWidth) * 2 - 1;  
      const y = -(event.clientY / window.innerHeight) * 2 + 1;  
        
      // Smooth camera movement  
      camera.position.x += (x * 5 - camera.position.x) * 0.05;  
      camera.position.y += (y * 5 - camera.position.y) * 0.05;  
      camera.lookAt(0, 0, 0);  
    }  
      
    function animate() {  
      requestAnimationFrame(animate);  
        
      time += speedFactor;  
        
      updateTerrainGeometry();  
        
      if (particlesVisible) {  
        updateParticles();  
      }  
        
      mesh.rotation.z += rotationSpeed;  
        
      renderer.render(scene, camera);  
    }  
      
    function setupControls() {  
      // Height control  
      const heightControl = document.getElementById('height-control');  
      const heightValue = document.getElementById('height-value');  
        
      heightControl.addEventListener('input', () => {  
        heightFactor = parseFloat(heightControl.value);  
        heightValue.textContent = heightFactor.toFixed(1);  
      });  
        
      // Speed control  
      const speedControl = document.getElementById('speed-control');  
      const speedValue = document.getElementById('speed-value');  
        
      speedControl.addEventListener('input', () => {  
        speedFactor = parseFloat(speedControl.value);  
        speedValue.textContent = speedFactor.toFixed(3);  
      });  
        
      // Detail level control  
      const detailControl = document.getElementById('detail-control');  
      const detailValue = document.getElementById('detail-value');  
        
      detailControl.addEventListener('input', () => {  
        detailLevel = parseInt(detailControl.value);  
        detailValue.textContent = detailLevel;  
      });  
        
      // Pattern scale control  
      const scaleControl = document.getElementById('scale-control');  
      const scaleValue = document.getElementById('scale-value');  
        
      scaleControl.addEventListener('input', () => {  
        patternScale = parseFloat(scaleControl.value);  
        scaleValue.textContent = patternScale.toFixed(2);  
      });  
        
      // Phi factor control  
      const phiControl = document.getElementById('phi-control');  
      const phiValue = document.getElementById('phi-value');  
        
      phiControl.addEventListener('input', () => {  
        phiFactor = parseFloat(phiControl.value);  
        phiValue.textContent = phiFactor.toFixed(2);  
      });  
        
      // Rotation control  
      const rotationControl = document.getElementById('rotation-control');  
      const rotationValue = document.getElementById('rotation-value');  
        
      rotationControl.addEventListener('input', () => {  
        rotationSpeed = parseFloat(rotationControl.value);  
        rotationValue.textContent = rotationSpeed.toFixed(4);  
      });  
        
      // Light intensity control  
      const lightControl = document.getElementById('light-control');  
      const lightValue = document.getElementById('light-value');  
        
      lightControl.addEventListener('input', () => {  
        lightIntensity = parseFloat(lightControl.value);  
        lightValue.textContent = lightIntensity.toFixed(1);  
        directionalLight.intensity = lightIntensity;  
      });  
        
      // Color shift control  
      const colorShiftControl = document.getElementById('color-shift-control');  
      const colorShiftValue = document.getElementById('color-shift-value');  
        
      colorShiftControl.addEventListener('input', () => {  
        colorShiftFactor = parseFloat(colorShiftControl.value);  
        colorShiftValue.textContent = colorShiftFactor.toFixed(1);  
      });  
        
      // Particles toggle  
      const particlesToggle = document.getElementById('particles-toggle');  
        
      particlesToggle.addEventListener('click', () => {  
        particlesVisible = !particlesVisible;  
        particles.visible = particlesVisible;  
        particlesToggle.textContent = particlesVisible ? 'ON' : 'OFF';  
        particlesToggle.classList.toggle('active', particlesVisible);  
      });  
        
      // Wireframe toggle  
      const wireframeToggle = document.getElementById('wireframe-toggle');  
        
      wireframeToggle.addEventListener('click', () => {  
        wireframeMode = !wireframeMode;  
        material.wireframe = wireframeMode;  
        wireframeToggle.textContent = wireframeMode ? 'ON' : 'OFF';  
        wireframeToggle.classList.toggle('active', wireframeMode);  
      });  
        
      // Color mode buttons  
      const presetButtons = document.querySelectorAll('.preset-button');  
        
      presetButtons.forEach(button => {  
        button.addEventListener('click', () => {  
          colorMode = button.dataset.mode;  
            
          // Update active state  
          presetButtons.forEach(btn => btn.classList.remove('active'));  
          button.classList.add('active');  
        });  
      });  
        
      // Hide/show controls  
      const hideButton = document.querySelector('.hide-controls');  
      const controlsContainer = document.getElementById('canvas-container');  
        
      hideButton.addEventListener('click', () => {  
        controlsContainer.classList.toggle('controls-hidden');  
        hideButton.innerHTML = controlsContainer.classList.contains('controls-hidden')   
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> Show Controls'  
          : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Controls';  
      });  
    }  
      
    init();  
    animate();  
  </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'960167d6239e9f34',t:'MTc1MjY2NzkyMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
