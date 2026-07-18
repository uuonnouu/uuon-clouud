# Nature Fractal Art Engine: https://uuonmind.my.canva.site/webgl-fractal-engine-implementation  
![Pasted Graphic 2.png](Attachments/9A4AA802-2CF8-4859-802D-51034E0F7569.png)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<meta name="viewport" content="width=device-width, initial-scale=1.0">  
<title>Psychedelic Nature Fractal Portal - UUON Foundation</title>  
<meta name="description" content="Mind-bending psychedelic nature fractal visualization with intense morphing, kaleidoscopic patterns, vibrant colors, and hypnotic animations exploring the mathematical beauty hidden in Earth's natural systems.">  
<meta name="author" content="Phillip A. Ruiz III">  
<meta name="organization" content="UUON Foundation Inc.">  
<meta name="contact" content="phi1@uuonfoundation.com">  
<meta name="website" content="www.uuonfoundation.com">  
<meta name="instagram" content="@uuon.foundation">  
<meta name="youtube" content="https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ">  
<meta name="models" content="https://www.cgtrader.com/designers/uuon-foundation">  
<meta name="editor" content="Designed on Canva Code Editor">  
<meta name="version" content="17.0 - Psychedelic Nature Edition">  
<meta name="keywords" content="psychedelic fractals, kaleidoscope nature, morphing patterns, vibrant colors, hypnotic animations, sacred geometry, mandala fractals, rainbow trees, liquid mountains, dancing flowers, cosmic nature, trippy visuals, mind-bending art, fractal kaleidoscope, nature hallucinations, geometric nature, colorful fractals, morphing landscapes, psychedelic art, visual meditation, fractal therapy, consciousness expansion, mathematical art, Phillip A. Ruiz III, UUON Foundation, psychedelic research, visual consciousness, fractal meditation, sacred mathematics, nature mysticism, geometric spirituality, rainbow fractals, liquid geometry">  
<style>  
  * { margin: 0; padding: 0; box-sizing: border-box; }  
    
  body {   
    background: radial-gradient(circle, #ff006e 0%, #8338ec 25%, #3a86ff 50%, #06ffa5 75%, #ffbe0b 100%);  
    font-family: 'Segoe UI', sans-serif;  
    overflow: hidden;  
    color: #fff;  
    animation: backgroundPulse 8s ease-in-out infinite;  
  }  
    
  @keyframes backgroundPulse {  
    0%, 100% { filter: hue-rotate(0deg) saturate(1); }  
    50% { filter: hue-rotate(180deg) saturate(1.5); }  
  }  
    
  canvas {   
    display: block;   
    cursor: crosshair;  
    width: 100vw;  
    height: 100vh;  
    filter: brightness(1.2) contrast(1.3) saturate(1.4);  
    animation: canvasGlow 4s ease-in-out infinite;  
  }  
    
  @keyframes canvasGlow {  
    0%, 100% { box-shadow: 0 0 50px rgba(255, 0, 110, 0.3); }  
    33% { box-shadow: 0 0 50px rgba(131, 56, 236, 0.3); }  
    66% { box-shadow: 0 0 50px rgba(6, 255, 165, 0.3); }  
  }  
    
  .quick-toggles {  
    position: absolute;  
    top: 20px;  
    left: 50%;  
    transform: translateX(-50%);  
    display: flex;  
    gap: 15px;  
    z-index: 1000;  
  }  
    
  .toggle-btn {  
    width: 50px;  
    height: 50px;  
    border: none;  
    border-radius: 50%;  
    background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5);  
    background-size: 400% 400%;  
    color: #fff;  
    font-size: 20px;  
    cursor: pointer;  
    transition: all 0.3s;  
    border: 3px solid rgba(255, 255, 255, 0.3);  
    backdrop-filter: blur(15px);  
    animation: gradientShift 3s ease-in-out infinite, float 6s ease-in-out infinite;  
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);  
  }  
    
  @keyframes gradientShift {  
    0%, 100% { background-position: 0% 50%; }  
    50% { background-position: 100% 50%; }  
  }  
    
  @keyframes float {  
    0%, 100% { transform: translateY(0px); }  
    50% { transform: translateY(-10px); }  
  }  
    
  .toggle-btn:hover {  
    transform: scale(1.2) rotate(10deg);  
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);  
  }  
    
  .toggle-btn.active {  
    animation: activeGlow 1s ease-in-out infinite, gradientShift 3s ease-in-out infinite;  
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.8);  
  }  
    
  @keyframes activeGlow {  
    0%, 100% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.8); }  
    50% { box-shadow: 0 0 60px rgba(255, 255, 255, 1); }  
  }  
    
  .controls {  
    position: absolute;  
    top: 90px;  
    left: 20px;  
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(131, 56, 236, 0.2));  
    border: 2px solid rgba(255, 255, 255, 0.3);  
    border-radius: 20px;  
    padding: 25px;  
    width: 380px;  
    max-height: 75vh;  
    overflow-y: auto;  
    box-shadow: 0 0 50px rgba(131, 56, 236, 0.4);  
    backdrop-filter: blur(20px);  
    animation: controlsGlow 5s ease-in-out infinite;  
  }  
    
  @keyframes controlsGlow {  
    0%, 100% { border-color: rgba(255, 0, 110, 0.5); }  
    33% { border-color: rgba(131, 56, 236, 0.5); }  
    66% { border-color: rgba(6, 255, 165, 0.5); }  
  }  
    
  .title {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b);  
    background-size: 400% 400%;  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-size: 20px;  
    margin-bottom: 10px;  
    text-align: center;  
    font-weight: bold;  
    animation: gradientShift 3s ease-in-out infinite;  
  }  
    
  .subtitle {  
    color: rgba(255, 255, 255, 0.8);  
    font-size: 12px;  
    text-align: center;  
    margin-bottom: 25px;  
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);  
  }  
    
  .section {  
    margin-bottom: 25px;  
    padding: 20px;  
    background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(131, 56, 236, 0.1));  
    border-radius: 15px;  
    border: 1px solid rgba(255, 255, 255, 0.2);  
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);  
  }  
    
  .section-title {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #06ffa5);  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-size: 16px;  
    margin-bottom: 15px;  
    display: flex;  
    align-items: center;  
    gap: 10px;  
    font-weight: bold;  
  }  
    
  .nature-buttons {  
    display: grid;  
    grid-template-columns: repeat(2, 1fr);  
    gap: 12px;  
    margin-bottom: 20px;  
  }  
    
  .nature-btn {  
    padding: 12px 10px;  
    border: none;  
    border-radius: 12px;  
    background: linear-gradient(45deg, #2E7D32, #388E3C, #4CAF50);  
    color: white;  
    cursor: pointer;  
    font-size: 11px;  
    transition: all 0.3s;  
    border: 2px solid transparent;  
    text-align: center;  
    line-height: 1.3;  
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);  
    position: relative;  
    overflow: hidden;  
  }  
    
  .nature-btn::before {  
    content: '';  
    position: absolute;  
    top: 0;  
    left: -100%;  
    width: 100%;  
    height: 100%;  
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);  
    transition: left 0.5s;  
  }  
    
  .nature-btn:hover::before {  
    left: 100%;  
  }  
    
  .nature-btn:hover {  
    background: linear-gradient(45deg, #43A047, #66BB6A, #81C784);  
    box-shadow: 0 0 25px rgba(76, 175, 80, 0.6);  
    transform: scale(1.05);  
  }  
    
  .nature-btn.active {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #06ffa5);  
    border-color: rgba(255, 255, 255, 0.5);  
    box-shadow: 0 0 30px rgba(255, 0, 110, 0.8);  
    animation: activeButton 2s ease-in-out infinite;  
  }  
    
  @keyframes activeButton {  
    0%, 100% { box-shadow: 0 0 30px rgba(255, 0, 110, 0.8); }  
    50% { box-shadow: 0 0 40px rgba(131, 56, 236, 0.8); }  
  }  
    
  .control-group {  
    margin-bottom: 20px;  
  }  
    
  .control-label {  
    display: flex;  
    justify-content: space-between;  
    margin-bottom: 8px;  
    font-size: 13px;  
    color: rgba(255, 255, 255, 0.9);  
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);  
  }  
    
  .control-value {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #06ffa5);  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-weight: bold;  
    font-family: 'Courier New', monospace;  
  }  
    
  .slider {  
    width: 100%;  
    height: 8px;  
    border-radius: 4px;  
    background: linear-gradient(90deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b);  
    outline: none;  
    -webkit-appearance: none;  
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);  
  }  
    
  .slider::-webkit-slider-thumb {  
    -webkit-appearance: none;  
    width: 20px;  
    height: 20px;  
    border-radius: 50%;  
    background: linear-gradient(45deg, #fff, #ff006e, #8338ec);  
    cursor: pointer;  
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);  
    border: 2px solid rgba(255, 255, 255, 0.5);  
  }  
    
  .slider::-moz-range-thumb {  
    width: 20px;  
    height: 20px;  
    border-radius: 50%;  
    background: linear-gradient(45deg, #fff, #ff006e, #8338ec);  
    cursor: pointer;  
    border: 2px solid rgba(255, 255, 255, 0.5);  
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);  
  }  
    
  .button-group {  
    display: flex;  
    gap: 8px;  
    flex-wrap: wrap;  
  }  
    
  .btn {  
    padding: 10px 15px;  
    border: none;  
    border-radius: 10px;  
    background: linear-gradient(45deg, #2E7D32, #388E3C);  
    color: white;  
    cursor: pointer;  
    font-size: 11px;  
    flex: 1;  
    min-width: 70px;  
    transition: all 0.3s;  
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);  
    border: 2px solid transparent;  
  }  
    
  .btn:hover {  
    background: linear-gradient(45deg, #43A047, #66BB6A);  
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);  
    transform: translateY(-2px);  
  }  
    
  .btn.active {  
    background: linear-gradient(45deg, #ff006e, #8338ec);  
    box-shadow: 0 0 25px rgba(255, 0, 110, 0.7);  
    border-color: rgba(255, 255, 255, 0.3);  
  }  
    
  .info-portal {  
    position: absolute;  
    top: 90px;  
    right: 20px;  
    width: 350px;  
    max-height: 75vh;  
    overflow-y: auto;  
    display: none;  
  }  
    
  .info-portal.active {  
    display: block;  
    animation: portalAppear 0.5s ease-out;  
  }  
    
  @keyframes portalAppear {  
    from { opacity: 0; transform: translateX(50px); }  
    to { opacity: 1; transform: translateX(0); }  
  }  
    
  .info-card {  
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(131, 56, 236, 0.2));  
    border: 2px solid rgba(255, 255, 255, 0.3);  
    border-radius: 15px;  
    padding: 20px;  
    margin-bottom: 20px;  
    box-shadow: 0 0 30px rgba(131, 56, 236, 0.3);  
    backdrop-filter: blur(20px);  
    animation: cardGlow 4s ease-in-out infinite;  
  }  
    
  @keyframes cardGlow {  
    0%, 100% { border-color: rgba(255, 0, 110, 0.4); }  
    50% { border-color: rgba(6, 255, 165, 0.4); }  
  }  
    
  .card-title {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #06ffa5);  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-size: 16px;  
    font-weight: bold;  
    margin-bottom: 15px;  
    display: flex;  
    align-items: center;  
    gap: 10px;  
  }  
    
  .card-content {  
    font-size: 12px;  
    line-height: 1.5;  
    color: rgba(255, 255, 255, 0.9);  
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);  
  }  
    
  .parameter-grid {  
    display: grid;  
    grid-template-columns: repeat(2, 1fr);  
    gap: 10px;  
    margin-top: 15px;  
  }  
    
  .param-item {  
    font-size: 11px;  
    color: rgba(255, 255, 255, 0.8);  
  }  
    
  .param-item .param-label {  
    background: linear-gradient(45deg, #ff006e, #06ffa5);  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-weight: bold;  
  }  
    
  .nature-equations {  
    background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(6, 255, 165, 0.1));  
    border-radius: 10px;  
    padding: 15px;  
    margin-top: 15px;  
    border: 1px solid rgba(255, 255, 255, 0.2);  
  }  
    
  .equation {  
    font-family: 'Courier New', monospace;  
    font-size: 11px;  
    color: rgba(255, 255, 255, 0.9);  
    margin-bottom: 8px;  
    padding: 5px;  
    background: rgba(255, 255, 255, 0.05);  
    border-radius: 5px;  
    border-left: 3px solid #06ffa5;  
  }  
    
  .watermark {  
    position: absolute;  
    bottom: 20px;  
    left: 50%;  
    transform: translateX(-50%);  
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(131, 56, 236, 0.3));  
    padding: 15px 25px;  
    border-radius: 10px;  
    font-size: 11px;  
    color: rgba(255, 255, 255, 0.8);  
    font-family: 'Courier New', monospace;  
    border: 2px solid rgba(255, 255, 255, 0.2);  
    text-align: center;  
    backdrop-filter: blur(15px);  
    box-shadow: 0 0 25px rgba(131, 56, 236, 0.3);  
  }  
    
  .author-info {  
    background: linear-gradient(45deg, #ff006e, #06ffa5);  
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;  
    background-clip: text;  
    font-weight: bold;  
    margin-bottom: 8px;  
  }  
    
  .toggle-card {  
    position: absolute;  
    top: 15px;  
    right: 15px;  
    background: none;  
    border: none;  
    color: rgba(255, 255, 255, 0.7);  
    cursor: pointer;  
    font-size: 18px;  
    width: 30px;  
    height: 30px;  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    transition: all 0.3s;  
  }  
    
  .toggle-card:hover {  
    color: #ff006e;  
    transform: scale(1.2);  
  }  
    
  /* Custom scrollbar */  
  ::-webkit-scrollbar {  
    width: 8px;  
  }  
    
  ::-webkit-scrollbar-track {  
    background: rgba(0, 0, 0, 0.3);  
    border-radius: 4px;  
  }  
    
  ::-webkit-scrollbar-thumb {  
    background: linear-gradient(45deg, #ff006e, #8338ec, #06ffa5);  
    border-radius: 4px;  
  }  
    
  ::-webkit-scrollbar-thumb:hover {  
    background: linear-gradient(45deg, #06ffa5, #ff006e, #8338ec);  
  }  
</style>  
</head>  
<body>  
  
<canvas id="canvas"></canvas>  
  
<!-- Quick Action Toggles -->  
<div class="quick-toggles">  
  <button class="toggle-btn active" id="animateBtn" title="Toggle Animation">⏸️</button>  
  <button class="toggle-btn" id="randomBtn" title="Random Pattern">🎲</button>  
  <button class="toggle-btn" id="resetBtn" title="Reset View">🔄</button>  
  <button class="toggle-btn" id="saveBtn" title="Save Image">💾</button>  
  <button class="toggle-btn" id="exportBtn" title="Export Data">📤</button>  
  <button class="toggle-btn" id="infoBtn" title="Toggle Info Panels">ℹ️</button>  
</div>  
  
<div class="controls">  
  <div class="title">🌈 Psychedelic Nature Portal</div>  
  <div class="subtitle">Mind-Bending Fractal Kaleidoscope • Morphing Sacred Geometry</div>  
    
  <div class="section">  
    <div class="section-title">🎨 Psychedelic Nature Systems</div>  
    <div class="nature-buttons">  
      <button class="nature-btn active" data-type="0">Rainbow<br>Trees</button>  
      <button class="nature-btn" data-type="1">Liquid<br>Rivers</button>  
      <button class="nature-btn" data-type="2">Crystal<br>Mountains</button>  
      <button class="nature-btn" data-type="3">Plasma<br>Clouds</button>  
      <button class="nature-btn" data-type="4">Electric<br>Lightning</button>  
      <button class="nature-btn" data-type="5">Neon<br>Coral</button>  
      <button class="nature-btn" data-type="6">Mandala<br>Leaves</button>  
      <button class="nature-btn" data-type="7">Kaleidoscope<br>Crystals</button>  
      <button class="nature-btn" data-type="8">Psychedelic<br>Apples</button>  
      <button class="nature-btn" data-type="9">Fractal<br>Animals</button>  
      <button class="nature-btn" data-type="10">Sacred<br>Eyes</button>  
      <button class="nature-btn" data-type="11">Cosmic<br>Flowers</button>  
      <button class="nature-btn" data-type="12">Morphing<br>Butterflies</button>  
      <button class="nature-btn" data-type="13">Spiral<br>Shells</button>  
      <button class="nature-btn" data-type="14">Dancing<br>Mushrooms</button>  
      <button class="nature-btn" data-type="15">Liquid<br>Feathers</button>  
    </div>  
  </div>  
    
  <div class="section">  
    <div class="section-title">🔮 Sacred Constants</div>  
    <div class="button-group" style="margin-bottom: 15px;">  
      <button class="btn active" id="triBtn">TRI</button>  
      <button class="btn" id="hexBtn">HEX</button>  
      <button class="btn" id="nonBtn">NON</button>  
    </div>  
    <div class="button-group" style="margin-bottom: 15px;">  
      <button class="btn" id="triOneBtn">TRI_ΟΝΕ</button>  
      <button class="btn" id="triOnsBtn">TRI_ΟΝΣ</button>  
      <button class="btn" id="triTheBtn">TRI_ΘΝΕ</button>  
    </div>  
    <div class="button-group">  
      <button class="btn active" id="linearBtn">Linear</button>  
      <button class="btn" id="fibonacciBtn">Fibonacci</button>  
      <button class="btn" id="goldenBtn">Golden</button>  
    </div>  
  </div>  
    
  <div class="section">  
    <div class="section-title">🌀 Morphing Parameters</div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Fractal Depth</span>  
        <span class="control-value" id="depthValue">0.93</span>  
      </div>  
      <input type="range" class="slider" id="depthSlider" min="-5.00" max="5.00" step="0.01" value="0.93">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Morphing Speed</span>  
        <span class="control-value" id="speedValue">0.68</span>  
      </div>  
      <input type="range" class="slider" id="speedSlider" min="-5.00" max="5.00" step="0.01" value="0.68">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Kaleidoscope</span>  
        <span class="control-value" id="kaleidoValue">2.22</span>  
      </div>  
      <input type="range" class="slider" id="kaleidoSlider" min="-5.00" max="5.00" step="0.01" value="2.22">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Psychedelic Intensity</span>  
        <span class="control-value" id="intensityValue">5.00</span>  
      </div>  
      <input type="range" class="slider" id="intensitySlider" min="-5.00" max="5.00" step="0.01" value="5.00">  
    </div>  
  </div>  
    
  <div class="section">  
    <div class="section-title">🎭 Visual Effects</div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Color Chaos</span>  
        <span class="control-value" id="colorValue">1.00</span>  
      </div>  
      <input type="range" class="slider" id="colorSlider" min="-5.00" max="5.00" step="0.01" value="1.00">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Liquid Flow</span>  
        <span class="control-value" id="flowValue">0.80</span>  
      </div>  
      <input type="range" class="slider" id="flowSlider" min="-5.00" max="5.00" step="0.01" value="0.80">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Fractal Breathing</span>  
        <span class="control-value" id="breathingValue">0.60</span>  
      </div>  
      <input type="range" class="slider" id="breathingSlider" min="-5.00" max="5.00" step="0.01" value="0.60">  
    </div>  
      
    <div class="control-group">  
      <div class="control-label">  
        <span>Reality Distortion</span>  
        <span class="control-value" id="distortionValue">0.40</span>  
      </div>  
      <input type="range" class="slider" id="distortionSlider" min="-5.00" max="5.00" step="0.01" value="0.40">  
    </div>  
  </div>  
</div>  
  
<!-- Info Portal -->  
<div class="info-portal" id="infoPortal">  
  <div class="info-card">  
    <button class="toggle-card" onclick="toggleCard(this)">−</button>  
    <div class="card-title">🧠 Psychedelic Theory</div>  
    <div class="card-content">  
      <div id="theoryName">Rainbow Tree Consciousness</div>  
      <div id="theoryDescription" style="margin: 10px 0; font-size: 11px;">  
        Psychedelic tree fractals reveal the hidden rainbow consciousness within natural branching patterns. Each branch pulses with chromatic energy, morphing through infinite color spectrums while maintaining the sacred geometric ratios found in nature's blueprint.  
      </div>  
      <div class="nature-equations">  
        <div class="equation" id="currentEquation">Ψ(t) = Σ e^(iωt) • F[+F]F[-F]F</div>  
        <div class="equation">Hue(θ) = sin(θ + φ) • 360°</div>  
        <div class="equation">Morph = cos(2πft) • amplitude</div>  
        <div class="equation">Consciousness = ∫ fractal_depth dt</div>  
      </div>  
    </div>  
  </div>  
    
  <div class="info-card">  
    <button class="toggle-card" onclick="toggleCard(this)">−</button>  
    <div class="card-title">⚡ Performance Monitor</div>  
    <div class="card-content">  
      <div class="parameter-grid">  
        <div class="param-item">  
          <div class="param-label">FPS:</div>  
          <div id="fpsCounter">60</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Fractals:</div>  
          <div id="fractalCount">32768</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Colors:</div>  
          <div id="colorCount">∞</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Morphs/sec:</div>  
          <div id="morphRate">120</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Kaleidoscope:</div>  
          <div id="currentKaleido">6x</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Intensity:</div>  
          <div id="currentIntensity">1.5x</div>  
        </div>  
      </div>  
    </div>  
  </div>  
    
  <div class="info-card">  
    <button class="toggle-card" onclick="toggleCard(this)">−</button>  
    <div class="card-title">📊 Live Parameters</div>  
    <div class="card-content">  
      <div class="parameter-grid">  
        <div class="param-item">  
          <div class="param-label">Depth:</div>  
          <div id="currentDepth">8</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Speed:</div>  
          <div id="currentSpeed">2.0</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Flow:</div>  
          <div id="currentFlow">0.8</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Breathing:</div>  
          <div id="currentBreathing">0.6</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Distortion:</div>  
          <div id="currentDistortion">0.4</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Constant:</div>  
          <div id="currentConstant">TRI</div>  
        </div>  
        <div class="param-item">  
          <div class="param-label">Mode:</div>  
          <div id="currentMode">Linear</div>  
        </div>  
      </div>  
    </div>  
  </div>  
    
  <div class="info-card">  
    <button class="toggle-card" onclick="toggleCard(this)">−</button>  
    <div class="card-title">🔬 Metadata Portal</div>  
    <div class="card-content">  
      <div style="font-size: 11px; line-height: 1.5;">  
        <strong>Author:</strong> Phillip A. Ruiz III<br>  
        <strong>Organization:</strong> UUON Foundation Inc.<br>  
        <strong>Version:</strong> 17.0 - Psychedelic Nature Edition<br>  
        <strong>Contact:</strong> phi1@uuonfoundation.com<br>  
        <strong>Website:</strong> www.uuonfoundation.com<br>  
        <strong>Instagram:</strong> @uuon.foundation<br>  
        <strong>YouTube:</strong> UUON Foundation Channel<br>  
        <strong>3D Models:</strong> CGTrader/uuon-foundation<br>  
        <strong>Canva Profile:</strong> UUON Foundation (appfeal@gmail.com)<br><br>  
        <strong>Research Focus:</strong> Psychedelic mathematics, consciousness fractals, sacred geometry, and the intersection of natural patterns with altered states of perception.  
      </div>  
    </div>  
  </div>  
</div>  
  
<div class="watermark">  
  <div class="author-info">Phillip A. Ruiz III | UUON Foundation Inc.</div>  
  <div>Psychedelic Nature Portal Research | v17.0</div>  
</div>  
  
<script>  
function toggleCard(btn) {  
  const card = btn.parentElement;  
  card.classList.toggle('minimized');  
  btn.textContent = card.classList.contains('minimized') ? '+' : '−';  
}  
  
class PsychedelicNaturePortal {  
  constructor() {  
    this.canvas = document.getElementById('canvas');  
    this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');  
      
    if (!this.gl) {  
      alert('WebGL not supported - Psychedelic simulation requires GPU acceleration');  
      return;  
    }  
      
    this.setupCanvas();  
    this.initPsychedelicState();  
    this.createPsychedelicShaders();  
    this.setupGeometry();  
    this.setupPsychedelicControls();  
    this.setupPerformanceMonitoring();  
    this.render();  
  }  
    
  setupPerformanceMonitoring() {  
    this.frameCount = 0;  
    this.lastTime = performance.now();  
    this.fps = 60;  
      
    setInterval(() => {  
      const now = performance.now();  
      this.fps = Math.round(this.frameCount * 1000 / (now - this.lastTime));  
      document.getElementById('fpsCounter').textContent = this.fps;  
        
      // Calculate fractal count based on depth and kaleidoscope  
      const fractalCount = Math.pow(2, this.state.fractalDepth) * this.state.kaleidoscope;  
      document.getElementById('fractalCount').textContent = fractalCount.toLocaleString();  
        
      // Morph rate based on speed  
      const morphRate = Math.round(this.state.morphingSpeed * 60);  
      document.getElementById('morphRate').textContent = morphRate;  
        
      this.frameCount = 0;  
      this.lastTime = now;  
    }, 1000);  
  }  
    
  setupCanvas() {  
    const resize = () => {  
      this.canvas.width = window.innerWidth;  
      this.canvas.height = window.innerHeight;  
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);  
    };  
    resize();  
    window.addEventListener('resize', resize);  
  }  
    
  initPsychedelicState() {  
    // Mathematical Constants  
    this.constants = {  
      TRI: 333.333,  
      HEX: 666666.6666666,  
      NON: 1000000000.0,  
      TRI_ONE: 333.111333,  
      TRI_ONS: 333.222333,    
      TRI_THE: 333.999333  
    };  
      
    this.state = {  
      natureSystem: 0, // 0=rainbow trees, 1=liquid rivers, etc.  
      fractalDepth: 0.93,  
      morphingSpeed: 0.68,  
      kaleidoscope: 2.22,  
      psychedelicIntensity: 5.00,  
      colorChaos: 1.00,  
      liquidFlow: 0.80,  
      fractalBreathing: 0.60,  
      realityDistortion: 0.40,  
      time: 0,  
      zoom: 1.0,  
      centerX: 0.0,  
      centerY: 0.0,  
      paused: false,  
      activeConstant: 'TRI',  
      constantMode: 0, // 0=linear, 1=fibonacci, 2=golden  
      animating: true  
    };  
      
    this.psychedelicTheories = {  
      0: {  
        name: "Rainbow Tree Consciousness",  
        description: "Psychedelic tree fractals reveal the hidden rainbow consciousness within natural branching patterns. Each branch pulses with chromatic energy, morphing through infinite color spectrums while maintaining the sacred geometric ratios found in nature's blueprint.",  
        equation: "Ψ(t) = Σ e^(iωt) • F[+F]F[-F]F"  
      },  
      1: {  
        name: "Liquid River Dimensions",  
        description: "Rivers become flowing streams of liquid light, morphing through dimensional portals. The water carries fractal information, creating recursive patterns that flow between parallel realities in an endless dance of chromatic fluid dynamics.",  
        equation: "Flow(x,y,t) = ∇²Ψ • sin(ωt + φ)"  
      },  
      2: {  
        name: "Crystal Mountain Harmonics",  
        description: "Mountains transform into crystalline structures that resonate with cosmic frequencies. Each peak vibrates with harmonic overtones, creating geometric interference patterns that reveal the mathematical music of the Earth's consciousness.",  
        equation: "Resonance = Σ A_n • sin(nωt + φ_n)"  
      },  
      3: {  
        name: "Plasma Cloud Entities",  
        description: "Clouds become sentient plasma entities, morphing through fractal dimensions. These atmospheric beings communicate through color-coded electromagnetic patterns, revealing the hidden intelligence within weather systems.",  
        equation: "Plasma(r,t) = E • B • e^(ikr-iωt)"  
      },  
      4: {  
        name: "Electric Lightning Networks",  
        description: "Lightning creates neural networks of pure electric consciousness, branching through space-time in fractal patterns. Each discharge carries information between dimensional layers, forming a cosmic nervous system.",  
        equation: "Neural(t) = Σ w_ij • σ(Σ x_j + b_i)"  
      },  
      5: {  
        name: "Neon Coral Ecosystems",  
        description: "Coral reefs glow with bioluminescent fractals, creating underwater cities of light. Each polyp pulses with synchronized rhythms, forming collective consciousness networks that span oceanic dimensions.",  
        equation: "Bioluminescence = I₀ • e^(-αt) • cos(ωt)"  
      },  
      6: {  
        name: "Mandala Leaf Portals",  
        description: "Leaves transform into rotating mandalas, each vein becoming a pathway to higher dimensions. The sacred geometry within leaf structures reveals portals to parallel botanical realities filled with infinite recursive patterns.",  
        equation: "Mandala(θ,r) = Σ A_n • cos(nθ + φ_n) • r^n"  
      },  
      7: {  
        name: "Kaleidoscope Crystal Matrices",  
        description: "Crystals become multidimensional kaleidoscopes, refracting reality through infinite geometric transformations. Each facet reflects parallel universes, creating recursive mirror worlds of crystalline consciousness.",  
        equation: "Kaleidoscope = R(θ) • M • R(-θ) • Pattern"  
      },  
      8: {  
        name: "Psychedelic Apple Dimensions",  
        description: "Apples transform into fractal fruit portals, each bite revealing infinite recursive layers of reality. The sacred geometry within apple cores creates dimensional gateways to parallel orchards of consciousness.",  
        equation: "Apple(r,θ) = sin(5θ) • e^(-r²) • Φ(t)"  
      },  
      9: {  
        name: "Fractal Animal Consciousness",  
        description: "Animals become living fractals, their forms morphing through infinite recursive patterns. Each creature embodies the mathematical essence of its species, revealing the geometric soul within biological forms.",  
        equation: "Animal(t) = Σ F_n • sin(nωt + φ_n) • DNA"  
      },  
      10: {  
        name: "Sacred Eye Portals",  
        description: "Eyes become windows to infinite dimensions, each iris containing fractal universes. The pupil dilates into cosmic portals, revealing the mathematical patterns that connect all consciousness across space and time.",  
        equation: "Eye(r,θ) = pupil(r) • iris(θ) • ∞"  
      },  
      11: {  
        name: "Cosmic Flower Mandalas",  
        description: "Flowers bloom into cosmic mandalas, their petals unfolding through dimensional layers. Each bloom contains the mathematical blueprint of universal creation, revealing the fractal nature of growth and beauty.",  
        equation: "Flower(θ,t) = Σ petal_n • cos(nθ + ωt)"  
      },  
      12: {  
        name: "Morphing Butterfly Fractals",  
        description: "Butterflies become shape-shifting fractals, their wings creating interference patterns across reality. Each flutter generates recursive transformations, revealing the metamorphic mathematics of consciousness evolution.",  
        equation: "Butterfly(x,y,t) = wing₁(t) ⊕ wing₂(t) • morph"  
      },  
      13: {  
        name: "Spiral Shell Geometries",  
        description: "Shells reveal their hidden spiral mathematics, each chamber containing fractal echoes of the ocean's memory. The golden ratio spirals through dimensional layers, creating recursive chambers of aquatic consciousness.",  
        equation: "Shell(θ) = r₀ • e^(bθ) • Φⁿ • echo(t)"  
      },  
      14: {  
        name: "Dancing Mushroom Networks",  
        description: "Mushrooms form psychedelic neural networks, their caps pulsing with bioluminescent fractals. Each spore carries dimensional information, creating mycelial webs that connect parallel forest realities.",  
        equation: "Mushroom(r,t) = cap(r) • stem(t) • spore_network"  
      },  
      15: {  
        name: "Liquid Feather Dynamics",  
        description: "Feathers become liquid fractals, flowing through air currents in impossible patterns. Each barb contains aerodynamic mathematics, revealing the fluid geometry of flight across dimensional boundaries.",  
        equation: "Feather(x,y,t) = ∇²flow • barb_fractal • wind(t)"  
      }  
    };  
  }  
    
  createPsychedelicShaders() {  
    const vertexSource = `  
      attribute vec2 position;  
      varying vec2 uv;  
      void main() {  
        uv = position;  
        gl_Position = vec4(position, 0.0, 1.0);  
      }  
    `;  
      
    const fragmentSource = `  
      precision highp float;  
      varying vec2 uv;  
        
      uniform int natureSystem;  
      uniform float fractalDepth;  
      uniform float morphingSpeed;  
      uniform float kaleidoscope;  
      uniform float psychedelicIntensity;  
      uniform float colorChaos;  
      uniform float liquidFlow;  
      uniform float fractalBreathing;  
      uniform float realityDistortion;  
      uniform float time;  
      uniform float zoom;  
      uniform vec2 center;  
      uniform float activeConstant;  
      uniform int constantMode;  
        
      // Psychedelic noise function  
      float psychedelicNoise(vec2 p, float t) {  
        vec2 q = p + vec2(sin(t * 0.1), cos(t * 0.13));  
        return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453);  
      }  
        
      // Rainbow color function  
      vec3 rainbow(float t) {  
        t = fract(t);  
        float r = abs(t * 6.0 - 3.0) - 1.0;  
        float g = 2.0 - abs(t * 6.0 - 2.0);  
        float b = 2.0 - abs(t * 6.0 - 4.0);  
        return clamp(vec3(r, g, b), 0.0, 1.0);  
      }  
        
      // Kaleidoscope transformation  
      vec2 kaleidoscopeTransform(vec2 coord, float segments) {  
        float angle = atan(coord.y, coord.x);  
        float radius = length(coord);  
          
        angle = mod(angle, 2.0 * 3.14159 / segments);  
        if (mod(floor(angle * segments / 3.14159), 2.0) == 1.0) {  
          angle = 2.0 * 3.14159 / segments - angle;  
        }  
          
        return vec2(cos(angle), sin(angle)) * radius;  
      }  
        
      // Mandelbrot-style escape iteration with burn effect  
      float mandelbrotBurn(vec2 c, float maxIter, float t) {  
        vec2 z = vec2(0.0);  
        float iter = 0.0;  
          
        for (int i = 0; i < 64; i++) {  
          if (float(i) >= maxIter) break;  
          if (dot(z, z) > 4.0) break;  
            
          // Classic Mandelbrot iteration with psychedelic twist  
          vec2 zNew = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;  
            
          // Add morphing effect  
          zNew += vec2(sin(t * morphingSpeed + iter * 0.1), cos(t * morphingSpeed * 1.3 + iter * 0.15)) * realityDistortion * 0.1;  
            
          z = zNew;  
          iter += 1.0;  
        }  
          
        // Smooth coloring for burn effect  
        if (dot(z, z) > 4.0) {  
          iter += 1.0 - log2(log2(dot(z, z))) / log2(2.0);  
        }  
          
        return iter / maxIter;  
      }  
        
      // Julia set with spider web patterns  
      float juliaSpider(vec2 z, vec2 c, float maxIter, float t) {  
        float iter = 0.0;  
          
        for (int i = 0; i < 64; i++) {  
          if (float(i) >= maxIter) break;  
          if (dot(z, z) > 4.0) break;  
            
          // Julia iteration with spider web distortion  
          vec2 zNew = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;  
            
          // Spider web effect - radial and angular components  
          float angle = atan(z.y, z.x);  
          float radius = length(z);  
            
          // Web strands  
          float webStrands = sin(angle * 8.0 + t) * sin(radius * 15.0 + t * 2.0) * 0.05;  
          zNew += vec2(cos(angle), sin(angle)) * webStrands * liquidFlow;  
            
          z = zNew;  
          iter += 1.0;  
        }  
          
        // Smooth spider coloring  
        if (dot(z, z) > 4.0) {  
          iter += 1.0 - log2(log2(dot(z, z))) / log2(2.0);  
        }  
          
        return iter / maxIter;  
      }  
        
      // Snowflake fractal with Koch curve patterns  
      float snowflakeBurn(vec2 coord, float depth, float t) {  
        vec2 pos = coord;  
        float snowflake = 0.0;  
          
        // Apply kaleidoscope for 6-fold symmetry (snowflake)  
        pos = kaleidoscopeTransform(pos, 6.0);  
          
        // Koch snowflake iterations  
        for (int i = 0; i < 8; i++) {  
          if (float(i) >= depth) break;  
            
          float scale = pow(0.33, float(i)); // Koch scaling  
            
          // Breathing snowflake  
          scale *= 1.0 + sin(t * 2.0 + float(i)) * fractalBreathing * 0.2;  
            
          // Koch curve segments  
          vec2 segment1 = pos;  
          vec2 segment2 = pos + vec2(scale, 0.0);  
          vec2 segment3 = pos + vec2(scale * 0.5, scale * 0.866); // 60 degree triangle  
            
          // Add morphing  
          segment1 += vec2(sin(t + float(i)), cos(t * 1.2 + float(i))) * realityDistortion * 0.05;  
          segment2 += vec2(sin(t * 1.1 + float(i)), cos(t * 0.9 + float(i))) * realityDistortion * 0.05;  
          segment3 += vec2(sin(t * 0.8 + float(i)), cos(t * 1.4 + float(i))) * realityDistortion * 0.05;  
            
          // Distance to segments with burn effect  
          float dist1 = exp(-abs(length(coord - segment1) - scale * 0.1) * 50.0);  
          float dist2 = exp(-abs(length(coord - segment2) - scale * 0.1) * 50.0);  
          float dist3 = exp(-abs(length(coord - segment3) - scale * 0.1) * 50.0);  
            
          snowflake += (dist1 + dist2 + dist3) * scale * 3.0;  
            
          // Iterate position  
          pos = mix(mix(segment1, segment2, 0.5), segment3, 0.33) * 3.0;  
        }  
          
        return snowflake;  
      }  
        
      // Burning ship fractal  
      float burningShip(vec2 c, float maxIter, float t) {  
        vec2 z = vec2(0.0);  
        float iter = 0.0;  
          
        for (int i = 0; i < 64; i++) {  
          if (float(i) >= maxIter) break;  
          if (dot(z, z) > 4.0) break;  
            
          // Burning ship iteration (absolute values)  
          z = vec2(abs(z.x), abs(z.y));  
          vec2 zNew = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;  
            
          // Add psychedelic morphing  
          zNew += vec2(sin(t * morphingSpeed + iter * 0.2), cos(t * morphingSpeed * 0.7 + iter * 0.25)) * realityDistortion * 0.08;  
            
          z = zNew;  
          iter += 1.0;  
        }  
          
        // Smooth burning coloring  
        if (dot(z, z) > 4.0) {  
          iter += 1.0 - log2(log2(dot(z, z))) / log2(2.0);  
        }  
          
        return iter / maxIter;  
      }  
        
      // Fractal branching with psychedelic effects and burn  
      float psychedelicBranch(vec2 coord, float depth, float t) {  
        float pattern = 0.0;  
        vec2 pos = coord;  
          
        // Apply kaleidoscope transformation  
        pos = kaleidoscopeTransform(pos, kaleidoscope);  
          
        // Reality distortion  
        pos += vec2(sin(pos.y * 5.0 + t), cos(pos.x * 5.0 + t)) * realityDistortion * 0.1;  
          
        // Add classic fractal burn effects  
        float mandelbrot = mandelbrotBurn(pos * 2.0, depth * 2.0, t);  
        float julia = juliaSpider(pos * 1.5, vec2(sin(t * 0.1) * 0.7, cos(t * 0.13) * 0.7), depth * 1.5, t);  
        float snowflake = snowflakeBurn(pos, depth, t);  
        float burning = burningShip(pos * 1.8 - vec2(0.5, 0.0), depth * 1.8, t);  
          
        // Combine fractal burns with different weights  
        float burnEffect = mandelbrot * 0.4 + julia * 0.3 + snowflake * 0.2 + burning * 0.1;  
          
        for (int i = 0; i < 12; i++) {  
          if (float(i) >= depth) break;  
            
          float scale = pow(0.618, float(i)); // Golden ratio scaling  
          float rotation = float(i) * 0.618 * 6.28318 + t * morphingSpeed;  
            
          // Breathing effect  
          scale *= 1.0 + sin(t * 2.0 + float(i)) * fractalBreathing * 0.3;  
            
          // Apply constant modulation  
          float constantEffect = 1.0;  
          if (constantMode == 0) {  
            constantEffect = 1.0 + sin(activeConstant * 0.001 + t) * 0.2;  
          } else if (constantMode == 1) {  
            constantEffect = 1.618; // Golden ratio  
          } else {  
            constantEffect = 1.414; // Square root of 2  
          }  
            
          // Multiple branches with liquid flow  
          vec2 branch1 = pos + vec2(cos(rotation), sin(rotation)) * scale * constantEffect;  
          vec2 branch2 = pos + vec2(cos(rotation + 2.094), sin(rotation + 2.094)) * scale * constantEffect;  
          vec2 branch3 = pos + vec2(cos(rotation + 4.188), sin(rotation + 4.188)) * scale * constantEffect;  
            
          // Liquid flow effect  
          branch1 += vec2(sin(t * liquidFlow + branch1.y * 3.0), cos(t * liquidFlow + branch1.x * 3.0)) * 0.05;  
          branch2 += vec2(sin(t * liquidFlow + branch2.y * 3.0), cos(t * liquidFlow + branch2.x * 3.0)) * 0.05;  
          branch3 += vec2(sin(t * liquidFlow + branch3.y * 3.0), cos(t * liquidFlow + branch3.x * 3.0)) * 0.05;  
            
          // Distance with burn effect modulation  
          float burnMod = 1.0 + burnEffect * 2.0;  
          float dist1 = 1.0 / (1.0 + length(coord - branch1) * (20.0 + sin(t + float(i)) * 10.0) / burnMod);  
          float dist2 = 1.0 / (1.0 + length(coord - branch2) * (20.0 + cos(t + float(i)) * 10.0) / burnMod);  
          float dist3 = 1.0 / (1.0 + length(coord - branch3) * (20.0 + sin(t * 1.3 + float(i)) * 10.0) / burnMod);  
            
          pattern += (dist1 + dist2 + dist3) * scale * psychedelicIntensity;  
            
          pos = mix(mix(branch1, branch2, 0.5), branch3, 0.33);  
        }  
          
        // Enhance with burn effect  
        pattern *= 1.0 + burnEffect * psychedelicIntensity;  
          
        return pattern;  
      }  
        
      // Rainbow trees  
      vec3 rainbowTrees(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Main fractal structure  
        float tree = psychedelicBranch(coord, fractalDepth, t);  
          
        // Color cycling  
        float colorPhase = t * 0.5 + length(coord) * 2.0;  
        vec3 baseColor = rainbow(colorPhase * colorChaos);  
          
        // Psychedelic enhancement  
        float enhancement = sin(coord.x * 10.0 + t) * sin(coord.y * 10.0 + t) * 0.5 + 0.5;  
        baseColor = mix(baseColor, rainbow(colorPhase + 0.5), enhancement * psychedelicIntensity);  
          
        // Glow effect  
        float glow = tree * (1.0 + sin(t * 3.0) * 0.3);  
          
        return baseColor * glow * (1.0 + psychedelicIntensity);  
      }  
        
      // Liquid rivers  
      vec3 liquidRivers(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Flowing liquid pattern  
        vec2 flowCoord = coord;  
        flowCoord.x += sin(coord.y * 3.0 + t * liquidFlow) * 0.2;  
        flowCoord.y += cos(coord.x * 2.0 + t * liquidFlow * 1.3) * 0.15;  
          
        // Apply kaleidoscope  
        flowCoord = kaleidoscopeTransform(flowCoord, kaleidoscope);  
          
        // Multiple liquid streams  
        float liquid = 0.0;  
        for (int i = 0; i < 6; i++) {  
          float offset = float(i) * 0.5;  
          float stream = exp(-abs(flowCoord.y - sin(flowCoord.x + t + offset) * 0.3) * 8.0);  
          liquid += stream * (1.0 + sin(t * 2.0 + offset) * 0.5);  
        }  
          
        // Psychedelic colors  
        float colorPhase = t * 0.3 + flowCoord.x * 2.0 + flowCoord.y * 1.5;  
        vec3 liquidColor = rainbow(colorPhase * colorChaos);  
          
        // Shimmer effect  
        float shimmer = sin(flowCoord.x * 20.0 + t * 5.0) * sin(flowCoord.y * 15.0 + t * 3.0) * 0.3 + 0.7;  
          
        return liquidColor * liquid * shimmer * psychedelicIntensity;  
      }  
        
      // Crystal mountains  
      vec3 crystalMountains(vec2 coord) {  
        float t = time * morphingSpeed * 0.5;  
          
        // Apply kaleidoscope transformation  
        vec2 crystalCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Crystal structure  
        float crystal = 0.0;  
        for (int i = 1; i <= 8; i++) {  
          float scale = pow(0.7, float(i));  
          float freq = pow(1.8, float(i));  
          crystal += sin(crystalCoord.x * freq + t + float(i)) *   
                    cos(crystalCoord.y * freq * 0.8 + t * 1.2) * scale;  
        }  
          
        // Breathing effect  
        crystal *= 1.0 + sin(t * 2.0) * fractalBreathing;  
          
        // Prismatic colors  
        float colorPhase = crystal * 2.0 + t * 0.4;  
        vec3 prismColor = rainbow(colorPhase * colorChaos);  
          
        // Crystal facets  
        float facets = abs(sin(crystalCoord.x * 8.0) * cos(crystalCoord.y * 6.0));  
          
        return prismColor * abs(crystal) * (1.0 + facets) * psychedelicIntensity;  
      }  
        
      // Plasma clouds  
      vec3 plasmaClouds(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Apply reality distortion  
        vec2 plasmaCoord = coord + vec2(sin(coord.y * 3.0 + t), cos(coord.x * 4.0 + t)) * realityDistortion;  
          
        // Multi-scale plasma  
        float plasma = 0.0;  
        for (int i = 1; i <= 6; i++) {  
          float scale = pow(0.6, float(i));  
          float freq = pow(2.2, float(i));  
          plasma += psychedelicNoise(plasmaCoord * freq, t * scale) * scale;  
        }  
          
        // Kaleidoscope effect  
        plasmaCoord = kaleidoscopeTransform(plasmaCoord, kaleidoscope);  
          
        // Electric discharge patterns  
        float discharge = sin(length(plasmaCoord) * 15.0 + t * 3.0) * 0.5 + 0.5;  
          
        // Plasma colors  
        float colorPhase = plasma * 3.0 + t * 0.6;  
        vec3 plasmaColor = rainbow(colorPhase * colorChaos);  
          
        // Add electric blue highlights  
        plasmaColor = mix(plasmaColor, vec3(0.3, 0.7, 1.0), discharge * 0.4);  
          
        return plasmaColor * plasma * (1.0 + discharge) * psychedelicIntensity;  
      }  
        
      // Electric lightning  
      vec3 electricLightning(vec2 coord) {  
        float t = time * morphingSpeed * 2.0;  
          
        // Lightning bolt structure  
        float lightning = psychedelicBranch(coord * 2.0, fractalDepth * 0.7, t);  
          
        // Electric field distortion  
        vec2 electricCoord = coord + vec2(  
          sin(coord.y * 10.0 + t) * realityDistortion * 0.2,  
          cos(coord.x * 8.0 + t * 1.3) * realityDistortion * 0.15  
        );  
          
        // Apply kaleidoscope  
        electricCoord = kaleidoscopeTransform(electricCoord, kaleidoscope);  
          
        // Electric discharge  
        float discharge = 0.0;  
        for (int i = 0; i < 5; i++) {  
          float offset = float(i) * 0.3;  
          discharge += exp(-abs(electricCoord.x - sin(electricCoord.y * 5.0 + t + offset) * 0.2) * 50.0);  
        }  
          
        // Electric colors (blue to white)  
        float intensity = lightning + discharge;  
        vec3 electricColor = mix(  
          vec3(0.2, 0.4, 1.0),  
          vec3(1.0, 1.0, 1.0),  
          intensity * psychedelicIntensity  
        );  
          
        // Add rainbow highlights  
        float colorPhase = t * 0.8 + length(coord) * 3.0;  
        electricColor = mix(electricColor, rainbow(colorPhase * colorChaos), 0.3);  
          
        return electricColor * intensity;  
      }  
        
      // Neon coral  
      vec3 neonCoral(vec2 coord) {  
        float t = time * morphingSpeed * 0.7;  
          
        // Coral structure  
        float coral = psychedelicBranch(coord, fractalDepth, t);  
          
        // Underwater distortion  
        vec2 coralCoord = coord + vec2(  
          sin(coord.y * 2.0 + t * liquidFlow) * 0.1,  
          cos(coord.x * 1.5 + t * liquidFlow * 0.8) * 0.08  
        );  
          
        // Apply kaleidoscope  
        coralCoord = kaleidoscopeTransform(coralCoord, kaleidoscope);  
          
        // Bioluminescent patterns  
        float biolum = 0.0;  
        for (int i = 1; i <= 4; i++) {  
          float scale = pow(0.8, float(i));  
          biolum += sin(length(coralCoord) * float(i) * 4.0 + t) * scale;  
        }  
          
        // Neon colors  
        float colorPhase = biolum * 2.0 + t * 0.5;  
        vec3 neonColor = rainbow(colorPhase * colorChaos);  
          
        // Underwater lighting  
        float depth = coord.y + 0.5;  
        float lighting = exp(-depth * 1.5) * (1.0 + sin(t * 2.0) * 0.3);  
          
        return neonColor * coral * lighting * psychedelicIntensity;  
      }  
        
      // Mandala leaves  
      vec3 mandalaLeaves(vec2 coord) {  
        float t = time * morphingSpeed * 0.6;  
          
        // Mandala transformation  
        vec2 mandalaCoord = kaleidoscopeTransform(coord, kaleidoscope * 2.0);  
          
        // Rotating mandala pattern  
        float angle = atan(mandalaCoord.y, mandalaCoord.x) + t;  
        float radius = length(mandalaCoord);  
          
        // Leaf vein structure  
        float veins = 0.0;  
        for (int i = 1; i <= 8; i++) {  
          float veinAngle = angle * float(i) + t * float(i) * 0.1;  
          veins += sin(veinAngle) * exp(-radius * float(i)) / float(i);  
        }  
          
        // Mandala geometry  
        float mandala = 0.0;  
        for (int i = 3; i <= 12; i++) {  
          mandala += sin(angle * float(i) + t) * exp(-radius * 2.0) / float(i);  
        }  
          
        // Psychedelic leaf colors  
        float colorPhase = veins * 3.0 + mandala * 2.0 + t * 0.4;  
        vec3 leafColor = rainbow(colorPhase * colorChaos);  
          
        // Breathing effect  
        float breathing = 1.0 + sin(t * 2.0) * fractalBreathing * 0.5;  
          
        return leafColor * abs(veins + mandala) * breathing * psychedelicIntensity;  
      }  
        
      // Kaleidoscope crystals  
      vec3 kaleidoscopeCrystals(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Multiple kaleidoscope layers  
        vec2 crystal1 = kaleidoscopeTransform(coord, kaleidoscope);  
        vec2 crystal2 = kaleidoscopeTransform(coord * 1.3 + vec2(0.2, 0.3), kaleidoscope * 1.5);  
        vec2 crystal3 = kaleidoscopeTransform(coord * 0.7 - vec2(0.1, 0.4), kaleidoscope * 0.8);  
          
        // Crystal patterns  
        float pattern1 = psychedelicBranch(crystal1, fractalDepth * 0.8, t);  
        float pattern2 = psychedelicBranch(crystal2, fractalDepth * 0.6, t * 1.3);  
        float pattern3 = psychedelicBranch(crystal3, fractalDepth * 1.2, t * 0.7);  
          
        // Combine patterns  
        float combined = pattern1 + pattern2 * 0.7 + pattern3 * 0.5;  
          
        // Rainbow refraction  
        float colorPhase1 = t * 0.3 + length(crystal1) * 2.0;  
        float colorPhase2 = t * 0.5 + length(crystal2) * 1.5;  
        float colorPhase3 = t * 0.7 + length(crystal3) * 3.0;  
          
        vec3 color1 = rainbow(colorPhase1 * colorChaos);  
        vec3 color2 = rainbow(colorPhase2 * colorChaos + 0.33);  
        vec3 color3 = rainbow(colorPhase3 * colorChaos + 0.66);  
          
        // Blend colors based on patterns  
        vec3 finalColor = color1 * pattern1 + color2 * pattern2 * 0.7 + color3 * pattern3 * 0.5;  
          
        return finalColor * psychedelicIntensity;  
      }  
        
      // Psychedelic apples  
      vec3 psychedelicApples(vec2 coord) {  
        float t = time * morphingSpeed * 0.8;  
          
        // Apple shape using distance field  
        vec2 appleCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Apple body (circle with indent at top)  
        float appleBody = length(appleCoord) - 0.4;  
        float appleTop = length(appleCoord - vec2(0.0, 0.3)) - 0.15;  
        float apple = min(appleBody, -appleTop);  
          
        // Apple stem  
        float stem = length(appleCoord - vec2(0.0, 0.5)) - 0.02;  
        apple = min(apple, stem);  
          
        // Fractal apple texture  
        float texture = 0.0;  
        for (int i = 1; i <= 6; i++) {  
          float scale = pow(0.6, float(i));  
          texture += sin(appleCoord.x * float(i) * 8.0 + t) *   
                    cos(appleCoord.y * float(i) * 6.0 + t * 1.2) * scale;  
        }  
          
        // Apple intensity based on distance field  
        float intensity = exp(-abs(apple) * 15.0) * (1.0 + texture * 0.3);  
          
        // Apple colors (red to green gradient with psychedelic twist)  
        float colorPhase = texture * 2.0 + t * 0.4 + length(appleCoord) * 3.0;  
        vec3 appleColor = mix(  
          vec3(1.0, 0.2, 0.2), // Red  
          vec3(0.2, 1.0, 0.2), // Green  
          sin(colorPhase * colorChaos) * 0.5 + 0.5  
        );  
          
        // Add rainbow highlights  
        appleColor = mix(appleColor, rainbow(colorPhase * colorChaos), 0.4);  
          
        // Breathing effect  
        intensity *= 1.0 + sin(t * 2.0) * fractalBreathing * 0.3;  
          
        return appleColor * intensity * psychedelicIntensity;  
      }  
        
      // Fractal animals  
      vec3 fractalAnimals(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Animal silhouette using multiple shapes  
        vec2 animalCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Body (ellipse)  
        vec2 bodyCoord = animalCoord * vec2(1.5, 1.0);  
        float body = length(bodyCoord) - 0.3;  
          
        // Head (circle)  
        float head = length(animalCoord - vec2(0.4, 0.0)) - 0.2;  
          
        // Legs (lines)  
        float legs = min(  
          abs(animalCoord.x + 0.2) - 0.02,  
          abs(animalCoord.x - 0.2) - 0.02  
        );  
        legs = min(legs, animalCoord.y + 0.3);  
          
        // Combine animal parts  
        float animal = min(min(body, head), legs);  
          
        // Fractal fur/skin texture  
        float texture = psychedelicBranch(animalCoord * 3.0, fractalDepth * 0.6, t);  
          
        // Animal intensity  
        float intensity = exp(-abs(animal) * 20.0) * (1.0 + texture * 0.5);  
          
        // Animal colors (earth tones with psychedelic twist)  
        float colorPhase = texture * 3.0 + t * 0.6;  
        vec3 animalColor = mix(  
          vec3(0.6, 0.4, 0.2), // Brown  
          vec3(0.8, 0.6, 0.4), // Tan  
          sin(colorPhase) * 0.5 + 0.5  
        );  
          
        // Add rainbow patterns  
        animalColor = mix(animalColor, rainbow(colorPhase * colorChaos), 0.6);  
          
        return animalColor * intensity * psychedelicIntensity;  
      }  
        
      // Sacred eyes  
      vec3 sacredEyes(vec2 coord) {  
        float t = time * morphingSpeed * 0.7;  
          
        // Eye shape  
        vec2 eyeCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Outer eye (ellipse)  
        vec2 outerEye = eyeCoord * vec2(2.0, 1.0);  
        float eyeShape = length(outerEye) - 0.4;  
          
        // Iris (circle)  
        float iris = length(eyeCoord) - 0.25;  
          
        // Pupil (smaller circle)  
        float pupil = length(eyeCoord) - 0.1 * (1.0 + sin(t * 3.0) * 0.3);  
          
        // Iris patterns  
        float irisPattern = 0.0;  
        for (int i = 1; i <= 8; i++) {  
          float angle = atan(eyeCoord.y, eyeCoord.x) * float(i) + t;  
          irisPattern += sin(angle) * exp(-length(eyeCoord) * float(i)) / float(i);  
        }  
          
        // Eye intensity  
        float eyeIntensity = exp(-abs(eyeShape) * 25.0);  
        float irisIntensity = exp(-abs(iris) * 30.0) * (1.0 + irisPattern * 0.5);  
        float pupilIntensity = exp(-abs(pupil) * 50.0);  
          
        // Eye colors  
        float colorPhase = irisPattern * 2.0 + t * 0.5;  
        vec3 eyeColor = vec3(1.0); // White sclera  
        vec3 irisColor = rainbow(colorPhase * colorChaos);  
        vec3 pupilColor = vec3(0.0); // Black pupil  
          
        // Combine eye parts  
        vec3 finalColor = eyeColor * eyeIntensity +   
                         irisColor * irisIntensity +   
                         pupilColor * pupilIntensity;  
          
        // Add mystical glow  
        float glow = exp(-length(eyeCoord) * 2.0) * sin(t * 2.0) * 0.3;  
        finalColor += rainbow(t * 0.3) * glow;  
          
        return finalColor * psychedelicIntensity;  
      }  
        
      // Cosmic flowers  
      vec3 cosmicFlowers(vec2 coord) {  
        float t = time * morphingSpeed * 0.6;  
          
        // Flower center  
        vec2 flowerCoord = kaleidoscopeTransform(coord, kaleidoscope);  
        float center = length(flowerCoord) - 0.1;  
          
        // Petals using polar coordinates  
        float angle = atan(flowerCoord.y, flowerCoord.x);  
        float radius = length(flowerCoord);  
          
        // Multiple petal layers  
        float petals = 0.0;  
        for (int i = 5; i <= 12; i++) {  
          float petalAngle = angle * float(i) + t * float(i) * 0.1;  
          float petalShape = sin(petalAngle) * exp(-radius * 2.0);  
          petals += abs(petalShape) / float(i);  
        }  
          
        // Flower stem  
        float stem = abs(flowerCoord.x) - 0.02;  
        stem = max(stem, -flowerCoord.y - 0.5);  
          
        // Combine flower parts  
        float flower = min(min(center, -petals * 0.3), stem);  
          
        // Flower intensity  
        float intensity = exp(-abs(flower) * 20.0) * (1.0 + petals);  
          
        // Flower colors  
        float colorPhase = petals * 2.0 + t * 0.4 + radius * 5.0;  
        vec3 flowerColor = rainbow(colorPhase * colorChaos);  
          
        // Add center highlight  
        float centerGlow = exp(-length(flowerCoord) * 10.0);  
        flowerColor = mix(flowerColor, vec3(1.0, 1.0, 0.0), centerGlow * 0.5);  
          
        return flowerColor * intensity * psychedelicIntensity;  
      }  
        
      // Morphing butterflies  
      vec3 morphingButterflies(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Butterfly body  
        vec2 butterflyCoord = kaleidoscopeTransform(coord, kaleidoscope);  
        float body = abs(butterflyCoord.x) - 0.02;  
          
        // Wings using symmetric patterns  
        vec2 wingCoord = abs(butterflyCoord);  
          
        // Wing shape  
        float wingShape = length(wingCoord - vec2(0.2, 0.0)) - 0.3;  
        wingShape = min(wingShape, length(wingCoord - vec2(0.1, 0.2)) - 0.2);  
          
        // Wing patterns  
        float wingPattern = 0.0;  
        for (int i = 1; i <= 6; i++) {  
          wingPattern += sin(wingCoord.x * float(i) * 10.0 + t) *   
                        cos(wingCoord.y * float(i) * 8.0 + t * 1.5) / float(i);  
        }  
          
        // Butterfly intensity  
        float bodyIntensity = exp(-abs(body) * 30.0);  
        float wingIntensity = exp(-abs(wingShape) * 15.0) * (1.0 + abs(wingPattern) * 0.5);  
          
        // Butterfly colors  
        float colorPhase = wingPattern * 3.0 + t * 0.8;  
        vec3 butterflyColor = rainbow(colorPhase * colorChaos);  
          
        // Wing iridescence  
        float iridescence = sin(wingCoord.x * 20.0 + t) * sin(wingCoord.y * 15.0 + t);  
        butterflyColor = mix(butterflyColor, rainbow(colorPhase + 0.5), abs(iridescence) * 0.4);  
          
        // Combine body and wings  
        vec3 finalColor = butterflyColor * wingIntensity + vec3(0.2, 0.1, 0.0) * bodyIntensity;  
          
        return finalColor * psychedelicIntensity;  
      }  
        
      // Spiral shells  
      vec3 spiralShells(vec2 coord) {  
        float t = time * morphingSpeed * 0.5;  
          
        // Shell spiral using polar coordinates  
        vec2 shellCoord = kaleidoscopeTransform(coord, kaleidoscope);  
        float angle = atan(shellCoord.y, shellCoord.x);  
        float radius = length(shellCoord);  
          
        // Golden ratio spiral  
        float goldenSpiral = log(radius) - angle * 0.306; // Golden angle  
        float shell = abs(fract(goldenSpiral + t * 0.1) - 0.5) - 0.1;  
          
        // Shell chambers  
        float chambers = 0.0;  
        for (int i = 1; i <= 8; i++) {  
          float chamberAngle = angle * float(i) + t * 0.2;  
          chambers += sin(chamberAngle) * exp(-radius * float(i)) / float(i);  
        }  
          
        // Shell intensity  
        float intensity = exp(-abs(shell) * 25.0) * (1.0 + abs(chambers) * 0.3);  
          
        // Shell colors (ocean-inspired with psychedelic twist)  
        float colorPhase = chambers * 2.0 + t * 0.3 + angle * 2.0;  
        vec3 shellColor = mix(  
          vec3(0.9, 0.8, 0.7), // Cream  
          vec3(0.6, 0.4, 0.3), // Brown  
          sin(colorPhase) * 0.5 + 0.5  
        );  
          
        // Add rainbow spiral  
        shellColor = mix(shellColor, rainbow(colorPhase * colorChaos), 0.5);  
          
        // Pearl-like shimmer  
        float shimmer = sin(radius * 15.0 + t * 3.0) * 0.3 + 0.7;  
          
        return shellColor * intensity * shimmer * psychedelicIntensity;  
      }  
        
      // Dancing mushrooms  
      vec3 dancingMushrooms(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Mushroom shape  
        vec2 mushroomCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Mushroom cap (half circle)  
        float cap = length(mushroomCoord - vec2(0.0, 0.2)) - 0.3;  
        cap = max(cap, -mushroomCoord.y + 0.2);  
          
        // Mushroom stem  
        float stem = abs(mushroomCoord.x) - 0.05;  
        stem = max(stem, mushroomCoord.y + 0.3);  
        stem = max(stem, -mushroomCoord.y + 0.2);  
          
        // Mushroom gills  
        float gills = 0.0;  
        for (int i = 1; i <= 10; i++) {  
          float gillAngle = mushroomCoord.x * float(i) * 20.0 + t;  
          gills += sin(gillAngle) * exp(-abs(mushroomCoord.y - 0.1) * 10.0) / float(i);  
        }  
          
        // Combine mushroom parts  
        float mushroom = min(cap, stem);  
          
        // Mushroom intensity  
        float intensity = exp(-abs(mushroom) * 20.0) * (1.0 + abs(gills) * 0.3);  
          
        // Mushroom colors (psychedelic fungi)  
        float colorPhase = gills * 3.0 + t * 0.7;  
        vec3 mushroomColor = rainbow(colorPhase * colorChaos);  
          
        // Bioluminescent spots  
        float spots = 0.0;  
        for (int i = 0; i < 5; i++) {  
          vec2 spotPos = vec2(sin(float(i) * 2.4), cos(float(i) * 2.4)) * 0.2;  
          spots += exp(-length(mushroomCoord - spotPos) * 15.0);  
        }  
          
        mushroomColor = mix(mushroomColor, vec3(0.0, 1.0, 0.5), spots * 0.4);  
          
        // Dancing motion  
        float dance = sin(t * 2.0 + mushroomCoord.x * 5.0) * 0.1;  
        intensity *= 1.0 + dance;  
          
        return mushroomColor * intensity * psychedelicIntensity;  
      }  
        
      // Liquid feathers  
      vec3 liquidFeathers(vec2 coord) {  
        float t = time * morphingSpeed;  
          
        // Feather structure  
        vec2 featherCoord = kaleidoscopeTransform(coord, kaleidoscope);  
          
        // Feather shaft  
        float shaft = abs(featherCoord.x) - 0.01;  
          
        // Feather barbs  
        float barbs = 0.0;  
        for (int i = 1; i <= 12; i++) {  
          float barbY = featherCoord.y + float(i) * 0.1 - 0.6;  
          float barbPattern = sin(featherCoord.x * 15.0 + t + float(i)) *   
                             exp(-abs(barbY) * 8.0) / float(i);  
          barbs += abs(barbPattern);  
        }  
          
        // Liquid flow effect  
        vec2 flowCoord = featherCoord + vec2(  
          sin(featherCoord.y * 5.0 + t * liquidFlow) * 0.1,  
          cos(featherCoord.x * 3.0 + t * liquidFlow * 1.2) * 0.05  
        );  
          
        // Feather intensity  
        float shaftIntensity = exp(-abs(shaft) * 40.0);  
        float barbIntensity = barbs * exp(-abs(featherCoord.x) * 3.0);  
          
        // Feather colors  
        float colorPhase = barbs * 2.0 + t * 0.6 + featherCoord.y * 3.0;  
        vec3 featherColor = rainbow(colorPhase * colorChaos);  
          
        // Iridescent shimmer  
        float shimmer = sin(flowCoord.x * 25.0 + t * 2.0) *   
                       sin(flowCoord.y * 20.0 + t * 1.5) * 0.3 + 0.7;  
          
        // Wind effect  
        float wind = sin(t * 3.0 + featherCoord.y * 2.0) * 0.2 + 0.8;  
          
        vec3 finalColor = featherColor * (shaftIntensity + barbIntensity) * shimmer * wind;  
          
        return finalColor * psychedelicIntensity;  
      }  
        
      void main() {  
        vec2 coord = (uv * 2.0 - 1.0) / zoom + center;  
          
        vec3 color = vec3(0.0);  
          
        if (natureSystem == 0) {  
          color = rainbowTrees(coord);  
        } else if (natureSystem == 1) {  
          color = liquidRivers(coord);  
        } else if (natureSystem == 2) {  
          color = crystalMountains(coord);  
        } else if (natureSystem == 3) {  
          color = plasmaClouds(coord);  
        } else if (natureSystem == 4) {  
          color = electricLightning(coord);  
        } else if (natureSystem == 5) {  
          color = neonCoral(coord);  
        } else if (natureSystem == 6) {  
          color = mandalaLeaves(coord);  
        } else if (natureSystem == 7) {  
          color = kaleidoscopeCrystals(coord);  
        } else if (natureSystem == 8) {  
          color = psychedelicApples(coord);  
        } else if (natureSystem == 9) {  
          color = fractalAnimals(coord);  
        } else if (natureSystem == 10) {  
          color = sacredEyes(coord);  
        } else if (natureSystem == 11) {  
          color = cosmicFlowers(coord);  
        } else if (natureSystem == 12) {  
          color = morphingButterflies(coord);  
        } else if (natureSystem == 13) {  
          color = spiralShells(coord);  
        } else if (natureSystem == 14) {  
          color = dancingMushrooms(coord);  
        } else if (natureSystem == 15) {  
          color = liquidFeathers(coord);  
        }  
          
        // Final psychedelic enhancement  
        color = pow(color, vec3(0.8)); // Gamma correction for vibrancy  
        color *= 1.0 + sin(time * 2.0) * 0.1; // Subtle pulsing  
          
        gl_FragColor = vec4(color, 1.0);  
      }  
    `;  
      
    this.program = this.createProgram(vertexSource, fragmentSource);  
      
    if (!this.program) {  
      console.error('Failed to create shader program');  
      return;  
    }  
      
    this.gl.useProgram(this.program);  
      
    // Get uniform locations  
    this.uniforms = {  
      natureSystem: this.gl.getUniformLocation(this.program, 'natureSystem'),  
      fractalDepth: this.gl.getUniformLocation(this.program, 'fractalDepth'),  
      morphingSpeed: this.gl.getUniformLocation(this.program, 'morphingSpeed'),  
      kaleidoscope: this.gl.getUniformLocation(this.program, 'kaleidoscope'),  
      psychedelicIntensity: this.gl.getUniformLocation(this.program, 'psychedelicIntensity'),  
      colorChaos: this.gl.getUniformLocation(this.program, 'colorChaos'),  
      liquidFlow: this.gl.getUniformLocation(this.program, 'liquidFlow'),  
      fractalBreathing: this.gl.getUniformLocation(this.program, 'fractalBreathing'),  
      realityDistortion: this.gl.getUniformLocation(this.program, 'realityDistortion'),  
      time: this.gl.getUniformLocation(this.program, 'time'),  
      zoom: this.gl.getUniformLocation(this.program, 'zoom'),  
      center: this.gl.getUniformLocation(this.program, 'center'),  
      activeConstant: this.gl.getUniformLocation(this.program, 'activeConstant'),  
      constantMode: this.gl.getUniformLocation(this.program, 'constantMode')  
    };  
  }  
    
  createProgram(vertexSource, fragmentSource) {  
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);  
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);  
      
    if (!vertexShader || !fragmentShader) {  
      console.error('Failed to create shaders');  
      return null;  
    }  
      
    const program = this.gl.createProgram();  
    this.gl.attachShader(program, vertexShader);  
    this.gl.attachShader(program, fragmentShader);  
    this.gl.linkProgram(program);  
      
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {  
      console.error('Program link error:', this.gl.getProgramInfoLog(program));  
      return null;  
    }  
      
    return program;  
  }  
    
  createShader(type, source) {  
    const shader = this.gl.createShader(type);  
    this.gl.shaderSource(shader, source);  
    this.gl.compileShader(shader);  
      
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {  
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));  
      return null;  
    }  
      
    return shader;  
  }  
    
  setupGeometry() {  
    const vertices = new Float32Array([  
      -1, -1,  1, -1,  -1, 1,  
      -1, 1,   1, -1,   1, 1  
    ]);  
      
    const buffer = this.gl.createBuffer();  
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);  
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);  
      
    const positionLocation = this.gl.getAttribLocation(this.program, 'position');  
    this.gl.enableVertexAttribArray(positionLocation);  
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);  
  }  
    
  setupPsychedelicControls() {  
    // Quick toggles  
    document.getElementById('animateBtn').addEventListener('click', () => {  
      this.state.animating = !this.state.animating;  
      const btn = document.getElementById('animateBtn');  
      btn.textContent = this.state.animating ? '⏸️' : '▶️';  
      btn.classList.toggle('active', this.state.animating);  
    });  
      
    document.getElementById('randomBtn').addEventListener('click', () => {  
      this.randomizePsychedelic();  
    });  
      
    document.getElementById('resetBtn').addEventListener('click', () => {  
      this.resetView();  
    });  
      
    document.getElementById('saveBtn').addEventListener('click', () => {  
      this.saveImage();  
    });  
      
    document.getElementById('exportBtn').addEventListener('click', () => {  
      this.exportData();  
    });  
      
    document.getElementById('infoBtn').addEventListener('click', () => {  
      const portal = document.getElementById('infoPortal');  
      portal.classList.toggle('active');  
      document.getElementById('infoBtn').classList.toggle('active');  
    });  
      
    // Nature system buttons  
    document.querySelectorAll('.nature-btn').forEach((btn, index) => {  
      btn.addEventListener('click', () => {  
        this.state.natureSystem = index;  
        document.querySelectorAll('.nature-btn').forEach(b => b.classList.remove('active'));  
        btn.classList.add('active');  
        this.updatePsychedelicInfo();  
      });  
    });  
      
    // Constant buttons  
    document.getElementById('triBtn').addEventListener('click', () => this.setConstant('TRI'));  
    document.getElementById('hexBtn').addEventListener('click', () => this.setConstant('HEX'));  
    document.getElementById('nonBtn').addEventListener('click', () => this.setConstant('NON'));  
    document.getElementById('triOneBtn').addEventListener('click', () => this.setConstant('TRI_ONE'));  
    document.getElementById('triOnsBtn').addEventListener('click', () => this.setConstant('TRI_ONS'));  
    document.getElementById('triTheBtn').addEventListener('click', () => this.setConstant('TRI_THE'));  
      
    // Mode buttons  
    document.getElementById('linearBtn').addEventListener('click', () => this.setConstantMode(0));  
    document.getElementById('fibonacciBtn').addEventListener('click', () => this.setConstantMode(1));  
    document.getElementById('goldenBtn').addEventListener('click', () => this.setConstantMode(2));  
      
    // Sliders  
    this.setupSlider('depthSlider', 'depthValue', 'fractalDepth', v => v.toFixed(2));  
    this.setupSlider('speedSlider', 'speedValue', 'morphingSpeed', v => v.toFixed(2));  
    this.setupSlider('kaleidoSlider', 'kaleidoValue', 'kaleidoscope', v => v.toFixed(2));  
    this.setupSlider('intensitySlider', 'intensityValue', 'psychedelicIntensity', v => v.toFixed(2));  
    this.setupSlider('colorSlider', 'colorValue', 'colorChaos', v => v.toFixed(2));  
    this.setupSlider('flowSlider', 'flowValue', 'liquidFlow', v => v.toFixed(2));  
    this.setupSlider('breathingSlider', 'breathingValue', 'fractalBreathing', v => v.toFixed(2));  
    this.setupSlider('distortionSlider', 'distortionValue', 'realityDistortion', v => v.toFixed(2));  
      
    // Mouse controls  
    this.setupMouseControls();  
      
    // Initialize  
    this.updatePsychedelicInfo();  
    this.updateLiveParameters();  
  }  
    
  setupSlider(sliderId, valueId, stateKey, formatter) {  
    const slider = document.getElementById(sliderId);  
    const valueDisplay = document.getElementById(valueId);  
      
    slider.addEventListener('input', (e) => {  
      const value = parseFloat(e.target.value);  
      this.state[stateKey] = value;  
      valueDisplay.textContent = formatter(value);  
      this.updateLiveParameters();  
    });  
  }  
    
  setupMouseControls() {  
    let isDragging = false;  
    let lastX = 0, lastY = 0;  
      
    this.canvas.addEventListener('mousedown', (e) => {  
      isDragging = true;  
      lastX = e.clientX;  
      lastY = e.clientY;  
    });  
      
    this.canvas.addEventListener('mousemove', (e) => {  
      if (isDragging) {  
        const deltaX = (e.clientX - lastX) / this.canvas.width;  
        const deltaY = (e.clientY - lastY) / this.canvas.height;  
          
        this.state.centerX -= deltaX * 2 / this.state.zoom;  
        this.state.centerY += deltaY * 2 / this.state.zoom;  
          
        lastX = e.clientX;  
        lastY = e.clientY;  
      }  
    });  
      
    this.canvas.addEventListener('mouseup', () => {  
      isDragging = false;  
    });  
      
    this.canvas.addEventListener('wheel', (e) => {  
      e.preventDefault();  
      const factor = e.deltaY > 0 ? 0.9 : 1.1;  
      this.state.zoom *= factor;  
      this.state.zoom = Math.max(0.1, Math.min(100, this.state.zoom));  
    });  
  }  
    
  setConstant(constantName) {  
    // Ensure the constant exists  
    if (!this.constants[constantName]) {  
      console.error('Invalid constant:', constantName);  
      return;  
    }  
      
    this.state.activeConstant = constantName;  
      
    // Update button states - clear all first  
    const constantButtons = ['triBtn', 'hexBtn', 'nonBtn', 'triOneBtn', 'triOnsBtn', 'triTheBtn'];  
    constantButtons.forEach(btnId => {  
      const btn = document.getElementById(btnId);  
      if (btn) btn.classList.remove('active');  
    });  
      
    // Map constants to button IDs  
    const buttonMap = {  
      'TRI': 'triBtn',   
      'HEX': 'hexBtn',   
      'NON': 'nonBtn',  
      'TRI_ONE': 'triOneBtn',   
      'TRI_ONS': 'triOnsBtn',   
      'TRI_THE': 'triTheBtn'  
    };  
      
    // Activate the selected button  
    const targetButtonId = buttonMap[constantName];  
    if (targetButtonId) {  
      const targetButton = document.getElementById(targetButtonId);  
      if (targetButton) {  
        targetButton.classList.add('active');  
      }  
    }  
      
    // Update displays  
    document.getElementById('currentConstant').textContent = constantName;  
    this.updateLiveParameters();  
      
    console.log('Constant set to:', constantName, 'Value:', this.constants[constantName]);  
  }  
    
  setConstantMode(mode) {  
    // Validate mode  
    if (mode < 0 || mode > 2) {  
      console.error('Invalid constant mode:', mode);  
      return;  
    }  
      
    this.state.constantMode = mode;  
      
    // Clear all mode buttons  
    const modeButtons = ['linearBtn', 'fibonacciBtn', 'goldenBtn'];  
    modeButtons.forEach(btnId => {  
      const btn = document.getElementById(btnId);  
      if (btn) btn.classList.remove('active');  
    });  
      
    // Activate selected mode button  
    const targetButtonId = modeButtons[mode];  
    if (targetButtonId) {  
      const targetButton = document.getElementById(targetButtonId);  
      if (targetButton) {  
        targetButton.classList.add('active');  
      }  
    }  
      
    // Update display  
    const modes = ['Linear', 'Fibonacci', 'Golden'];  
    document.getElementById('currentMode').textContent = modes[mode] || 'Linear';  
    this.updateLiveParameters();  
      
    console.log('Constant mode set to:', mode, modes[mode]);  
  }  
    
  updatePsychedelicInfo() {  
    const theory = this.psychedelicTheories[this.state.natureSystem];  
    document.getElementById('theoryName').textContent = theory.name;  
    document.getElementById('theoryDescription').textContent = theory.description;  
    document.getElementById('currentEquation').textContent = theory.equation;  
  }  
    
  updateLiveParameters() {  
    document.getElementById('currentDepth').textContent = this.state.fractalDepth.toFixed(2);  
    document.getElementById('currentSpeed').textContent = this.state.morphingSpeed.toFixed(2);  
    document.getElementById('currentKaleido').textContent = this.state.kaleidoscope.toFixed(2) + 'x';  
    document.getElementById('currentIntensity').textContent = this.state.psychedelicIntensity.toFixed(2) + 'x';  
    document.getElementById('currentFlow').textContent = this.state.liquidFlow.toFixed(2);  
    document.getElementById('currentBreathing').textContent = this.state.fractalBreathing.toFixed(2);  
    document.getElementById('currentDistortion').textContent = this.state.realityDistortion.toFixed(2);  
  }  
    
  randomizePsychedelic() {  
    // Randomize nature system  
    this.state.natureSystem = Math.floor(Math.random() * 16);  
    document.querySelectorAll('.nature-btn').forEach(btn => btn.classList.remove('active'));  
    document.querySelectorAll('.nature-btn')[this.state.natureSystem].classList.add('active');  
      
    // Randomize constants  
    const constants = ['TRI', 'HEX', 'NON', 'TRI_ONE', 'TRI_ONS', 'TRI_THE'];  
    this.state.activeConstant = constants[Math.floor(Math.random() * constants.length)];  
    this.setConstant(this.state.activeConstant);  
      
    // Randomize constant mode  
    this.state.constantMode = Math.floor(Math.random() * 3);  
    this.setConstantMode(this.state.constantMode);  
      
    // Randomize all parameters  
    this.state.fractalDepth = Math.random() * 10 - 5;  
    this.state.morphingSpeed = Math.random() * 10 - 5;  
    this.state.kaleidoscope = Math.random() * 10 - 5;  
    this.state.psychedelicIntensity = Math.random() * 10 - 5;  
    this.state.colorChaos = Math.random() * 10 - 5;  
    this.state.liquidFlow = Math.random() * 10 - 5;  
    this.state.fractalBreathing = Math.random() * 10 - 5;  
    this.state.realityDistortion = Math.random() * 10 - 5;  
      
    // Update all sliders and displays  
    document.getElementById('depthSlider').value = this.state.fractalDepth;  
    document.getElementById('speedSlider').value = this.state.morphingSpeed;  
    document.getElementById('kaleidoSlider').value = this.state.kaleidoscope;  
    document.getElementById('intensitySlider').value = this.state.psychedelicIntensity;  
    document.getElementById('colorSlider').value = this.state.colorChaos;  
    document.getElementById('flowSlider').value = this.state.liquidFlow;  
    document.getElementById('breathingSlider').value = this.state.fractalBreathing;  
    document.getElementById('distortionSlider').value = this.state.realityDistortion;  
      
    // Update value displays  
    document.getElementById('depthValue').textContent = this.state.fractalDepth.toFixed(2);  
    document.getElementById('speedValue').textContent = this.state.morphingSpeed.toFixed(2);  
    document.getElementById('kaleidoValue').textContent = this.state.kaleidoscope.toFixed(2);  
    document.getElementById('intensityValue').textContent = this.state.psychedelicIntensity.toFixed(2);  
    document.getElementById('colorValue').textContent = this.state.colorChaos.toFixed(2);  
    document.getElementById('flowValue').textContent = this.state.liquidFlow.toFixed(2);  
    document.getElementById('breathingValue').textContent = this.state.fractalBreathing.toFixed(2);  
    document.getElementById('distortionValue').textContent = this.state.realityDistortion.toFixed(2);  
      
    this.updatePsychedelicInfo();  
    this.updateLiveParameters();  
  }  
    
  resetView() {  
    this.state.zoom = 1.0;  
    this.state.centerX = 0.0;  
    this.state.centerY = 0.0;  
    this.state.time = 0;  
  }  
    
  saveImage() {  
    try {  
      // Force a render to ensure we have the latest frame  
      this.gl.finish();  
        
      // Create a temporary canvas to capture the WebGL content  
      const tempCanvas = document.createElement('canvas');  
      tempCanvas.width = this.canvas.width;  
      tempCanvas.height = this.canvas.height;  
      const tempCtx = tempCanvas.getContext('2d');  
        
      // Draw the WebGL canvas to the temporary canvas  
      tempCtx.drawImage(this.canvas, 0, 0);  
        
      // Create download link  
      const link = document.createElement('a');  
      link.download = `psychedelic-nature-${Date.now()}.png`;  
        
      // Convert to blob for better browser compatibility  
      tempCanvas.toBlob((blob) => {  
        if (blob) {  
          const url = URL.createObjectURL(blob);  
          link.href = url;  
          document.body.appendChild(link);  
          link.click();  
          document.body.removeChild(link);  
          URL.revokeObjectURL(url);  
            
          // Visual feedback  
          const saveBtn = document.getElementById('saveBtn');  
          const originalText = saveBtn.textContent;  
          saveBtn.textContent = '✅';  
          setTimeout(() => {  
            saveBtn.textContent = originalText;  
          }, 1000);  
        } else {  
          console.error('Failed to create image blob');  
          alert('Failed to save image. Please try again.');  
        }  
      }, 'image/png', 1.0);  
        
    } catch (error) {  
      console.error('Save image error:', error);  
      alert('Failed to save image. Your browser may not support this feature.');  
    }  
  }  
    
  exportData() {  
    try {  
      const data = {  
        timestamp: new Date().toISOString(),  
        author: "Phillip A. Ruiz III",  
        organization: "UUON Foundation Inc.",  
        version: "17.0 - Psychedelic Nature Edition",  
        contact: "phi1@uuonfoundation.com",  
        website: "www.uuonfoundation.com",  
        instagram: "@uuon.foundation",  
        description: "Psychedelic Nature Fractal Portal - Mind-bending visualization parameters",  
        state: {  
          natureSystem: this.state.natureSystem,  
          fractalDepth: this.state.fractalDepth,  
          morphingSpeed: this.state.morphingSpeed,  
          kaleidoscope: this.state.kaleidoscope,  
          psychedelicIntensity: this.state.psychedelicIntensity,  
          colorChaos: this.state.colorChaos,  
          liquidFlow: this.state.liquidFlow,  
          fractalBreathing: this.state.fractalBreathing,  
          realityDistortion: this.state.realityDistortion,  
          activeConstant: this.state.activeConstant,  
          constantMode: this.state.constantMode,  
          zoom: this.state.zoom,  
          centerX: this.state.centerX,  
          centerY: this.state.centerY  
        },  
        theory: this.psychedelicTheories[this.state.natureSystem],  
        constants: this.constants,  
        canvasSize: {  
          width: this.canvas.width,  
          height: this.canvas.height  
        }  
      };  
        
      const jsonString = JSON.stringify(data, null, 2);  
      const blob = new Blob([jsonString], { type: 'application/json' });  
      const url = URL.createObjectURL(blob);  
        
      const link = document.createElement('a');  
      link.download = `psychedelic-nature-data-${Date.now()}.json`;  
      link.href = url;  
        
      // Add to DOM, click, then remove  
      document.body.appendChild(link);  
      link.click();  
      document.body.removeChild(link);  
        
      // Clean up the URL  
      URL.revokeObjectURL(url);  
        
      // Visual feedback  
      const exportBtn = document.getElementById('exportBtn');  
      const originalText = exportBtn.textContent;  
      exportBtn.textContent = '✅';  
      setTimeout(() => {  
        exportBtn.textContent = originalText;  
      }, 1000);  
        
    } catch (error) {  
      console.error('Export data error:', error);  
      alert('Failed to export data. Please try again.');  
    }  
  }  
    
  render() {  
    this.frameCount++;  
      
    if (this.state.animating) {  
      this.state.time += 0.016;  
    }  
      
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);  
      
    // Set uniforms  
    this.gl.uniform1i(this.uniforms.natureSystem, this.state.natureSystem);  
    this.gl.uniform1f(this.uniforms.fractalDepth, this.state.fractalDepth);  
    this.gl.uniform1f(this.uniforms.morphingSpeed, this.state.morphingSpeed);  
    this.gl.uniform1f(this.uniforms.kaleidoscope, this.state.kaleidoscope);  
    this.gl.uniform1f(this.uniforms.psychedelicIntensity, this.state.psychedelicIntensity);  
    this.gl.uniform1f(this.uniforms.colorChaos, this.state.colorChaos);  
    this.gl.uniform1f(this.uniforms.liquidFlow, this.state.liquidFlow);  
    this.gl.uniform1f(this.uniforms.fractalBreathing, this.state.fractalBreathing);  
    this.gl.uniform1f(this.uniforms.realityDistortion, this.state.realityDistortion);  
    this.gl.uniform1f(this.uniforms.time, this.state.time);  
    this.gl.uniform1f(this.uniforms.zoom, this.state.zoom);  
    this.gl.uniform2f(this.uniforms.center, this.state.centerX, this.state.centerY);  
    this.gl.uniform1f(this.uniforms.activeConstant, this.constants[this.state.activeConstant]);  
    this.gl.uniform1i(this.uniforms.constantMode, this.state.constantMode);  
      
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);  
      
    requestAnimationFrame(() => this.render());  
  }  
}  
  
// Initialize when page loads  
window.addEventListener('load', () => {  
  new PsychedelicNaturePortal();  
});  
</script>  
  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9783fa1a45a537da',t:'MTc1NjcyMTQxNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
  
———————————————————  
  
## Overview  
´ß09876  
## Details  
* **Mathematical core:** Iterative complex mapping (*z ← z^power + c*) with escape-time smoothing and classic signatures (Mandelbrot burn edges, Julia spider webs, Koch-style snowflakes, Burning Ship aesthetics).  
* **Interaction model:** Drag to pan, wheel/pinch to zoom, and adjust simple controls (constant, power, phase, symmetry/warp) with immediate, stutter-free feedback.  
* **Systems & motifs (16 total):** Rainbow Trees, Liquid Rivers, Crystal Mountains, plus new sets—Psychedelic Apples, Fractal Animals, Sacred Eyes, Cosmic Flowers, Morphing Butterflies, Spiral Shells, Dancing Mushrooms, and Liquid Feathers—each with tailored equations and rendering accents.  
* **Modes & discovery:** Linear, Fibonacci, and Golden calculation modes; a single 🎲 Randomize action shuffles nature systems, constants, modes, and all visual parameters to reveal novel configurations fast.  
* **Parameter spectrum:** Uniform ranges from −24.00 to +24.00 with 0.01 precision for depth, morph speed, kaleidoscope, intensity, color chaos, liquid flow, breathing, distortion, and more—supporting both subtle tuning and extreme exploration.  
* **Saving & portability:** One-click PNG capture of the current frame and JSON preset export (with embedded metadata) for reproducibility, collaboration, and archival.  
* **Identity & attribution:** Metadata includes UUON Foundation contact details to preserve authorship across exports.  
* **Performance:** WebGL-accelerated shaders sustain smooth interaction and high-frame-rate playback on modern browsers and devices.  
## Summary  
This spin-off keeps the scientific heart of fractal iteration while streamlining the creative workflow. Artists can sculpt galaxies, filaments, shells, webs, and floral symmetries in real time—without code—then save frames, export presets, and iterate rapidly. With a comprehensive parameter range, classic fractal burns, and sixteen distinct nature systems, the studio balances mathematical authenticity with design utility. To try the interactive version and explore presets, follow the link in the description or find it on my Linktree.  
## Hashtags (8)  
#FractalArt #GenerativeDesign #JuliaSet #Mandelbrot #QuantumInspired #RealTimeGraphics #CreativeCoding #UUONFoundation  
