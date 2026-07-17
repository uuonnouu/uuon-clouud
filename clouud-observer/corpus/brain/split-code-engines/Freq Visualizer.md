# Freq Visualizer   
![847 Hz Healing](Attachments/021118AB-8938-4158-BAEA-584F95383284.heic)  
<!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>847 Hz Healing Frequency Visualizer</title>  
    <style>  
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');  
          
        * {  
            margin: 0;  
            padding: 0;  
            box-sizing: border-box;  
        }  
          
        body {  
            font-family: 'Montserrat', sans-serif;  
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);  
            color: #fff;  
            min-height: 100vh;  
            overflow-x: hidden;  
            line-height: 1.6;  
        }  
          
        .container {  
            max-width: 1200px;  
            margin: 0 auto;  
            padding: 2rem;  
        }  
          
        header {  
            text-align: center;  
            margin-bottom: 2rem;  
        }  
          
        h1 {  
            font-size: 2.5rem;  
            margin-bottom: 0.5rem;  
            background: linear-gradient(to right, #c9d6ff, #e2e2e2);  
            -webkit-background-clip: text;  
            background-clip: text;  
            color: transparent;  
            text-shadow: 0 0 15px rgba(201, 214, 255, 0.5);  
        }  
          
        .subtitle {  
            font-size: 1.2rem;  
            color: #c9d6ff;  
            margin-bottom: 1rem;  
        }  
          
        .frequency-display {  
            font-size: 3rem;  
            font-weight: 700;  
            color: #fff;  
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);  
            margin-bottom: 1rem;  
        }  
          
        .visualizer-container {  
            position: relative;  
            width: 100%;  
            margin: 0 auto 2rem;  
            border-radius: 15px;  
            overflow: hidden;  
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);  
        }  
          
        canvas {  
            display: block;  
            width: 100%;  
            background-color: rgba(0, 0, 0, 0.2);  
        }  
          
        .controls {  
            display: flex;  
            flex-wrap: wrap;  
            gap: 1rem;  
            justify-content: center;  
            margin-bottom: 2rem;  
        }  
          
        .control-btn {  
            padding: 0.8rem 1.5rem;  
            background: rgba(255, 255, 255, 0.1);  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            border-radius: 30px;  
            color: #fff;  
            font-size: 0.9rem;  
            font-weight: 500;  
            cursor: pointer;  
            transition: all 0.3s ease;  
            display: flex;  
            align-items: center;  
            gap: 0.5rem;  
        }  
          
        .control-btn:hover {  
            background: rgba(255, 255, 255, 0.2);  
            transform: translateY(-2px);  
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);  
        }  
          
        .control-btn.active {  
            background: linear-gradient(135deg, #c9d6ff, #e2e2e2);  
            color: #302b63;  
            font-weight: 600;  
            box-shadow: 0 5px 15px rgba(201, 214, 255, 0.4);  
        }  
          
        .tech-specs {  
            display: grid;  
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  
            gap: 1rem;  
            margin-bottom: 2rem;  
            background: rgba(0, 0, 0, 0.2);  
            border-radius: 15px;  
            padding: 1.5rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .spec-item {  
            text-align: center;  
            padding: 1rem;  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 10px;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            transition: all 0.3s ease;  
        }  
          
        .spec-item:hover {  
            background: rgba(255, 255, 255, 0.1);  
            transform: translateY(-3px);  
        }  
          
        .spec-label {  
            font-size: 0.8rem;  
            color: #c9d6ff;  
            margin-bottom: 0.5rem;  
        }  
          
        .spec-value {  
            font-size: 1.2rem;  
            font-weight: 600;  
            color: #fff;  
        }  
          
        .sliders {  
            display: grid;  
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));  
            gap: 1.5rem;  
            margin-bottom: 2rem;  
        }  
          
        .slider-container {  
            background: rgba(255, 255, 255, 0.1);  
            padding: 1.2rem;  
            border-radius: 10px;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .slider-label {  
            display: flex;  
            justify-content: space-between;  
            margin-bottom: 0.5rem;  
        }  
          
        .slider-name {  
            font-weight: 500;  
        }  
          
        .slider-value {  
            color: #c9d6ff;  
        }  
          
        input[type="range"] {  
            width: 100%;  
            height: 6px;  
            -webkit-appearance: none;  
            background: rgba(255, 255, 255, 0.2);  
            border-radius: 3px;  
            outline: none;  
        }  
          
        input[type="range"]::-webkit-slider-thumb {  
            -webkit-appearance: none;  
            width: 18px;  
            height: 18px;  
            border-radius: 50%;  
            background: #c9d6ff;  
            cursor: pointer;  
            box-shadow: 0 0 10px rgba(201, 214, 255, 0.7);  
        }  
          
        .info-panel {  
            background: rgba(255, 255, 255, 0.1);  
            border-radius: 15px;  
            padding: 2rem;  
            margin-bottom: 2rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .info-title {  
            font-size: 1.5rem;  
            margin-bottom: 1rem;  
            color: #c9d6ff;  
        }  
          
        .info-content {  
            font-size: 1rem;  
            line-height: 1.7;  
        }  
          
        .benefits {  
            display: grid;  
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));  
            gap: 1.5rem;  
            margin-top: 2rem;  
        }  
          
        .benefit-card {  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 10px;  
            padding: 1.5rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            transition: all 0.3s ease;  
        }  
          
        .benefit-card:hover {  
            transform: translateY(-5px);  
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);  
            background: rgba(255, 255, 255, 0.1);  
        }  
          
        .benefit-icon {  
            font-size: 2rem;  
            margin-bottom: 1rem;  
            color: #c9d6ff;  
        }  
          
        .benefit-title {  
            font-size: 1.2rem;  
            margin-bottom: 0.5rem;  
            color: #fff;  
        }  
          
        .benefit-description {  
            font-size: 0.9rem;  
            color: rgba(255, 255, 255, 0.8);  
        }  
          
        .energy-particle {  
            position: absolute;  
            border-radius: 50%;  
            pointer-events: none;  
            opacity: 0;  
            animation: fadeInOut 3s ease-in-out forwards;  
        }  
          
        @keyframes fadeInOut {  
            0% { transform: scale(0.5); opacity: 0; }  
            50% { opacity: 0.7; }  
            100% { transform: scale(1.5); opacity: 0; }  
        }  
          
        .ripple {  
            position: absolute;  
            border-radius: 50%;  
            transform: scale(0);  
            animation: ripple 2s linear;  
            pointer-events: none;  
        }  
          
        @keyframes ripple {  
            to {  
                transform: scale(4);  
                opacity: 0;  
            }  
        }  
          
        .frequency-analyzer {  
            background: rgba(0, 0, 0, 0.3);  
            border-radius: 10px;  
            padding: 1rem;  
            margin-bottom: 2rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            overflow: hidden;  
        }  
          
        .analyzer-title {  
            font-size: 1rem;  
            margin-bottom: 0.5rem;  
            color: #c9d6ff;  
            display: flex;  
            justify-content: space-between;  
            align-items: center;  
        }  
          
        .analyzer-canvas {  
            width: 100%;  
            height: 100px;  
            background: rgba(0, 0, 0, 0.2);  
            border-radius: 5px;  
        }  
          
        .modal {  
            display: none;  
            position: fixed;  
            top: 0;  
            left: 0;  
            width: 100%;  
            height: 100%;  
            background: rgba(0, 0, 0, 0.8);  
            z-index: 1000;  
            justify-content: center;  
            align-items: center;  
            padding: 1rem;  
        }  
          
        .modal-content {  
            background: linear-gradient(135deg, #302b63, #24243e);  
            border-radius: 15px;  
            padding: 2rem;  
            max-width: 800px;  
            width: 100%;  
            max-height: 90vh;  
            overflow-y: auto;  
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);  
            border: 1px solid rgba(255, 255, 255, 0.1);  
            position: relative;  
        }  
          
        .close-modal {  
            position: absolute;  
            top: 1rem;  
            right: 1rem;  
            font-size: 1.5rem;  
            color: #fff;  
            cursor: pointer;  
            background: none;  
            border: none;  
            transition: all 0.3s ease;  
        }  
          
        .close-modal:hover {  
            color: #c9d6ff;  
            transform: scale(1.1);  
        }  
          
        .modal-title {  
            font-size: 1.8rem;  
            margin-bottom: 1.5rem;  
            color: #c9d6ff;  
            text-align: center;  
        }  
          
        .modal-section {  
            margin-bottom: 2rem;  
        }  
          
        .modal-section-title {  
            font-size: 1.2rem;  
            margin-bottom: 1rem;  
            color: #fff;  
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);  
            padding-bottom: 0.5rem;  
        }  
          
        .modal-grid {  
            display: grid;  
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));  
            gap: 1rem;  
            margin-bottom: 1rem;  
        }  
          
        .modal-item {  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 8px;  
            padding: 1rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .modal-item-label {  
            font-size: 0.8rem;  
            color: #c9d6ff;  
            margin-bottom: 0.3rem;  
        }  
          
        .modal-item-value {  
            font-size: 1.1rem;  
            font-weight: 500;  
        }  
          
        .modal-text {  
            margin-bottom: 1rem;  
            line-height: 1.7;  
        }  
          
        .action-buttons {  
            display: flex;  
            justify-content: center;  
            gap: 1rem;  
            margin-top: 1rem;  
        }  
          
        .action-btn {  
            padding: 0.8rem 1.5rem;  
            background: rgba(255, 255, 255, 0.1);  
            border: 1px solid rgba(255, 255, 255, 0.2);  
            border-radius: 30px;  
            color: #fff;  
            font-size: 0.9rem;  
            font-weight: 500;  
            cursor: pointer;  
            transition: all 0.3s ease;  
            display: flex;  
            align-items: center;  
            gap: 0.5rem;  
        }  
          
        .action-btn:hover {  
            background: rgba(255, 255, 255, 0.2);  
            transform: translateY(-2px);  
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);  
        }  
          
        .action-btn.primary {  
            background: linear-gradient(135deg, #c9d6ff, #e2e2e2);  
            color: #302b63;  
        }  
          
        .waveform-indicator {  
            display: flex;  
            justify-content: space-between;  
            margin-top: 0.5rem;  
        }  
          
        .waveform-label {  
            font-size: 0.8rem;  
            color: rgba(255, 255, 255, 0.7);  
        }  
          
        .pulse-dot {  
            width: 10px;  
            height: 10px;  
            border-radius: 50%;  
            background: #c9d6ff;  
            margin-right: 0.5rem;  
            animation: pulse 2s infinite;  
        }  
          
        @keyframes pulse {  
            0% { transform: scale(0.8); opacity: 0.7; }  
            50% { transform: scale(1.2); opacity: 1; }  
            100% { transform: scale(0.8); opacity: 0.7; }  
        }  
          
        .live-indicator {  
            display: flex;  
            align-items: center;  
            font-size: 0.8rem;  
            color: #c9d6ff;  
        }  
          
        .community-section {  
            background: rgba(255, 255, 255, 0.05);  
            border-radius: 15px;  
            padding: 2rem;  
            margin-top: 2rem;  
            border: 1px solid rgba(255, 255, 255, 0.1);  
        }  
          
        .community-title {  
            font-size: 1.5rem;  
            margin-bottom: 1rem;  
            color: #c9d6ff;  
            text-align: center;  
        }  
          
        .community-grid {  
            display: grid;  
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));  
            gap: 1.5rem;  
        }  
          
        .community-card {  
            background: rgba(255, 255, 255, 0.1);  
            border-radius: 10px;  
            padding: 1.5rem;  
            text-align: center;  
            transition: all 0.3s ease;  
        }  
          
        .community-card:hover {  
            transform: translateY(-5px);  
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);  
        }  
          
        .community-icon {  
            font-size: 2.5rem;  
            margin-bottom: 1rem;  
            color: #c9d6ff;  
        }  
          
        .community-card-title {  
            font-size: 1.2rem;  
            margin-bottom: 0.5rem;  
        }  
          
        .community-description {  
            font-size: 0.9rem;  
            color: rgba(255, 255, 255, 0.8);  
        }  
          
        @media (max-width: 768px) {  
            .container {  
                padding: 1rem;  
            }  
              
            h1 {  
                font-size: 2rem;  
            }  
              
            .frequency-display {  
                font-size: 2.5rem;  
            }  
              
            .controls {  
                flex-direction: column;  
                align-items: center;  
            }  
              
            .control-btn {  
                width: 100%;  
                justify-content: center;  
            }  
              
            .tech-specs {  
                grid-template-columns: 1fr 1fr;  
            }  
        }  
    </style>  
</head>  
<body>  
    <div class="container">  
        <header>  
            <h1>847 Hz Healing Frequency Visualizer</h1>  
            <div class="subtitle">Experience the transformative power of sound frequency</div>  
            <div class="frequency-display">847 Hz</div>  
        </header>  
          
        <div class="tech-specs">  
            <div class="spec-item">  
                <div class="spec-label">Base Frequency</div>  
                <div class="spec-value">852.000 Hz</div>  
            </div>  
            <div class="spec-item">  
                <div class="spec-label">Harmonic Ratio</div>  
                <div class="spec-value">1.718000</div>  
            </div>  
            <div class="spec-item">  
                <div class="spec-label">Quantum Resonance</div>  
                <div class="spec-value">4.141592</div>  
            </div>  
            <div class="spec-item">  
                <div class="spec-label">Cosmic Alignment</div>  
                <div class="spec-value">82.5%</div>  
            </div>  
        </div>  
          
        <div class="frequency-analyzer">  
            <div class="analyzer-title">  
                <span>Real-time Frequency Analysis</span>  
                <div class="live-indicator">  
                    <div class="pulse-dot"></div>  
                    LIVE  
                </div>  
            </div>  
            <canvas id="analyzer" class="analyzer-canvas"></canvas>  
            <div class="waveform-indicator">  
                <span class="waveform-label">0 Hz</span>  
                <span class="waveform-label">847 Hz</span>  
                <span class="waveform-label">1694 Hz</span>  
            </div>  
        </div>  
          
        <div class="visualizer-container">  
            <canvas id="visualizer" height="400"></canvas>  
        </div>  
          
        <div class="controls">  
            <button class="control-btn active" data-mode="physical">  
                <span>✨</span> Physical Healing  
            </button>  
            <button class="control-btn" data-mode="emotional">  
                <span>💖</span> Emotional Healing  
            </button>  
            <button class="control-btn" data-mode="meditation">  
                <span>🧘</span> Meditation  
            </button>  
            <button class="control-btn" data-mode="spiritual">  
                <span>🌌</span> Spiritual Growth  
            </button>  
            <button class="control-btn" data-mode="cognitive">  
                <span>🧠</span> Cognitive Benefits  
            </button>  
            <button class="control-btn" data-mode="stress">  
                <span>🌿</span> Stress Reduction  
            </button>  
            <button class="control-btn" data-mode="sound">  
                <span>🔊</span> Sound Therapy  
            </button>  
            <button class="control-btn" data-mode="community">  
                <span>👥</span> Community  
            </button>  
        </div>  
          
        <div class="sliders">  
            <div class="slider-container">  
                <div class="slider-label">  
                    <span class="slider-name">Intensity</span>  
                    <span class="slider-value" id="intensity-value">50</span>  
                </div>  
                <input type="range" id="intensity" min="10" max="100" value="50">  
            </div>  
              
            <div class="slider-container">  
                <div class="slider-label">  
                    <span class="slider-name">Resonance</span>  
                    <span class="slider-value" id="resonance-value">60</span>  
                </div>  
                <input type="range" id="resonance" min="10" max="100" value="60">  
            </div>  
              
            <div class="slider-container">  
                <div class="slider-label">  
                    <span class="slider-name">Flow</span>  
                    <span class="slider-value" id="flow-value">40</span>  
                </div>  
                <input type="range" id="flow" min="10" max="100" value="40">  
            </div>  
        </div>  
          
        <div class="action-buttons">  
            <button class="action-btn primary" id="frequency-details-btn">  
                <span>📊</span> Frequency Details  
            </button>  
        </div>  
          
        <div class="info-panel">  
            <h2 class="info-title" id="info-title">Physical Healing Properties</h2>  
            <div class="info-content" id="info-content">  
                Frequencies like 847 Hz are believed to promote physical healing by resonating with the body's natural frequencies. This can potentially aid in pain relief, reduce inflammation, and enhance overall well-being. The vibrations work at a cellular level, helping to restore balance and harmony within the physical body.  
            </div>  
              
            <div class="benefits">  
                <div class="benefit-card">  
                    <div class="benefit-icon">🌟</div>  
                    <h3 class="benefit-title">Cellular Regeneration</h3>  
                    <p class="benefit-description">May support the body's natural healing processes at the cellular level, promoting regeneration and repair.</p>  
                </div>  
                  
                <div class="benefit-card">  
                    <div class="benefit-icon">🔄</div>  
                    <h3 class="benefit-title">Energy Balance</h3>  
                    <p class="benefit-description">Helps restore energetic balance within the body's systems, supporting overall physical wellness.</p>  
                </div>  
                  
                <div class="benefit-card">  
                    <div class="benefit-icon">💫</div>  
                    <h3 class="benefit-title">Vibrational Harmony</h3>  
                    <p class="benefit-description">Creates resonance that may help align the body's natural frequencies to their optimal state.</p>  
                </div>  
            </div>  
        </div>  
    </div>  
      
    <!-- Frequency Details Modal -->  
    <div class="modal" id="frequency-modal">  
        <div class="modal-content">  
            <button class="close-modal" id="close-modal">×</button>  
            <h2 class="modal-title">847 Hz Frequency Technical Details</h2>  
              
            <div class="modal-section">  
                <h3 class="modal-section-title">Core Specifications</h3>  
                <div class="modal-grid">  
                    <div class="modal-item">  
                        <div class="modal-item-label">Base Frequency</div>  
                        <div class="modal-item-value">852.000 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Harmonic Ratio</div>  
                        <div class="modal-item-value">1.718000</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Quantum Resonance</div>  
                        <div class="modal-item-value">4.141592</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Cosmic Alignment</div>  
                        <div class="modal-item-value">82.5%</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Frequency Type</div>  
                        <div class="modal-item-value">Healing / Therapeutic</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Waveform</div>  
                        <div class="modal-item-value">Sine / Composite</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Resonance Field</div>  
                        <div class="modal-item-value">Multi-dimensional</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Entrainment Level</div>  
                        <div class="modal-item-value">High (7.8/10)</div>  
                    </div>  
                </div>  
            </div>  
              
            <div class="modal-section">  
                <h3 class="modal-section-title">Healing Applications</h3>  
                <p class="modal-text">  
                    The 847 Hz frequency operates within the therapeutic spectrum that influences both physical and energetic systems. Its unique vibrational pattern creates resonance with specific cellular structures and energy centers within the human body. This frequency is particularly effective for:  
                </p>  
                <ul class="modal-text">  
                    <li>Physical healing and cellular regeneration</li>  
                    <li>Emotional balancing and trauma release</li>  
                    <li>Enhanced meditation and mindfulness practices</li>  
                    <li>Spiritual awakening and intuitive development</li>  
                    <li>Cognitive enhancement and creative stimulation</li>  
                    <li>Stress reduction and relaxation response activation</li>  
                    <li>Complementary sound therapy applications</li>  
                </ul>  
            </div>  
              
            <div class="modal-section">  
                <h3 class="modal-section-title">Scientific Research</h3>  
                <p class="modal-text">  
                    While research on specific frequencies is still evolving, studies in the fields of psychoacoustics, neuroscience, and vibrational medicine have shown promising results regarding the effects of specific sound frequencies on human physiology and consciousness. The 847 Hz frequency falls within a range that has demonstrated potential for:  
                </p>  
                <ul class="modal-text">  
                    <li>Influencing brainwave patterns toward alpha and theta states</li>  
                    <li>Promoting parasympathetic nervous system activation</li>  
                    <li>Supporting cellular coherence and communication</li>  
                    <li>Enhancing meditative states and focused awareness</li>  
                </ul>  
                <p class="modal-text">  
                    Note: As with any holistic approach, it's essential to combine these practices with professional medical advice and treatment when necessary.  
                </p>  
            </div>  
              
            <div class="modal-section">  
                <h3 class="modal-section-title">Harmonic Relationships</h3>  
                <div class="modal-grid">  
                    <div class="modal-item">  
                        <div class="modal-item-label">Fundamental</div>  
                        <div class="modal-item-value">847 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">First Harmonic</div>  
                        <div class="modal-item-value">1694 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Second Harmonic</div>  
                        <div class="modal-item-value">2541 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Third Harmonic</div>  
                        <div class="modal-item-value">3388 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Sub-harmonic</div>  
                        <div class="modal-item-value">423.5 Hz</div>  
                    </div>  
                    <div class="modal-item">  
                        <div class="modal-item-label">Golden Ratio</div>  
                        <div class="modal-item-value">1370.14 Hz</div>  
                    </div>  
                </div>  
            </div>  
        </div>  
    </div>  
  
    <script>  
        // Canvas setup  
        const canvas = document.getElementById('visualizer');  
        const ctx = canvas.getContext('2d');  
        canvas.width = canvas.offsetWidth;  
        canvas.height = 400;  
          
        // Analyzer canvas setup  
        const analyzerCanvas = document.getElementById('analyzer');  
        const analyzerCtx = analyzerCanvas.getContext('2d');  
        analyzerCanvas.width = analyzerCanvas.offsetWidth;  
        analyzerCanvas.height = 100;  
          
        // Visualization parameters  
        let params = {  
            mode: 'physical',  
            intensity: 50,  
            resonance: 60,  
            flow: 40  
        };  
          
        // Colors for different modes  
        const modeColors = {  
            physical: {  
                primary: '#ff7b25',  
                secondary: '#ffd700',  
                tertiary: '#ff4500',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            emotional: {  
                primary: '#ff69b4',  
                secondary: '#da70d6',  
                tertiary: '#ff1493',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            meditation: {  
                primary: '#4b0082',  
                secondary: '#9370db',  
                tertiary: '#8a2be2',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            spiritual: {  
                primary: '#00bfff',  
                secondary: '#1e90ff',  
                tertiary: '#87cefa',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            cognitive: {  
                primary: '#32cd32',  
                secondary: '#7cfc00',  
                tertiary: '#00fa9a',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            stress: {  
                primary: '#48d1cc',  
                secondary: '#20b2aa',  
                tertiary: '#40e0d0',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            sound: {  
                primary: '#ba55d3',  
                secondary: '#9932cc',  
                tertiary: '#dda0dd',  
                background: 'rgba(15, 12, 41, 0.2)'  
            },  
            community: {  
                primary: '#ffa500',  
                secondary: '#ff8c00',  
                tertiary: '#ffd700',  
                background: 'rgba(15, 12, 41, 0.2)'  
            }  
        };  
          
        // Information content for different modes  
        const modeInfo = {  
            physical: {  
                title: "Physical Healing Properties",  
                content: "Frequencies like 847 Hz are believed to promote physical healing by resonating with the body's natural frequencies. This can potentially aid in pain relief, reduce inflammation, and enhance overall well-being. The vibrations work at a cellular level, helping to restore balance and harmony within the physical body.",  
                benefits: [  
                    {  
                        icon: "🌟",  
                        title: "Cellular Regeneration",  
                        description: "May support the body's natural healing processes at the cellular level, promoting regeneration and repair."  
                    },  
                    {  
                        icon: "🔄",  
                        title: "Energy Balance",  
                        description: "Helps restore energetic balance within the body's systems, supporting overall physical wellness."  
                    },  
                    {  
                        icon: "💫",  
                        title: "Vibrational Harmony",  
                        description: "Creates resonance that may help align the body's natural frequencies to their optimal state."  
                    }  
                ]  
            },  
            emotional: {  
                title: "Emotional Healing Properties",  
                content: "The 847 Hz frequency is thought to help release emotional blockages, reduce stress, and promote feelings of peace and tranquility. It may assist individuals in processing emotions and achieving emotional balance. By creating harmonic resonance, this frequency can help soothe the nervous system and support emotional well-being.",  
                benefits: [  
                    {  
                        icon: "💖",  
                        title: "Emotional Release",  
                        description: "Facilitates the release of stored emotional tension and trauma, creating space for healing."  
                    },  
                    {  
                        icon: "🌈",  
                        title: "Emotional Balance",  
                        description: "Helps restore equilibrium between different emotional states, promoting overall emotional stability."  
                    },  
                    {  
                        icon: "✨",  
                        title: "Inner Peace",  
                        description: "Cultivates a sense of inner calm and tranquility that supports emotional processing."  
                    }  
                ]  
            },  
            meditation: {  
                title: "Meditation and Mindfulness",  
                content: "The 847 Hz frequency can enhance meditation practices by helping individuals reach deeper states of relaxation and focus. It may facilitate a stronger connection to one's inner self and the universe. Regular practice with this frequency can help develop mindfulness, allowing individuals to be present in the moment and cultivate a sense of awareness and clarity.",  
                benefits: [  
                    {  
                        icon: "🧘",  
                        title: "Deeper Meditation",  
                        description: "Facilitates access to profound meditative states and heightened awareness."  
                    },  
                    {  
                        icon: "🌱",  
                        title: "Present Moment Awareness",  
                        description: "Enhances the ability to remain fully present and engaged with the current experience."  
                    },  
                    {  
                        icon: "🌊",  
                        title: "Mental Clarity",  
                        description: "Helps clear mental fog and promotes lucid, focused thinking during meditation."  
                    }  
                ]  
            },  
            spiritual: {  
                title: "Spiritual Growth",  
                content: "Many practitioners believe that 847 Hz can help awaken intuition and enhance spiritual awareness. It may assist individuals in connecting with their higher selves and exploring their spiritual paths. This frequency is often associated with cosmic energies, promoting a sense of unity with the universe and a deeper understanding of one's place within it.",  
                benefits: [  
                    {  
                        icon: "🌌",  
                        title: "Intuitive Awakening",  
                        description: "Stimulates the development of intuitive abilities and inner knowing."  
                    },  
                    {  
                        icon: "🔮",  
                        title: "Higher Consciousness",  
                        description: "Facilitates connection with higher states of consciousness and spiritual dimensions."  
                    },  
                    {  
                        icon: "🌠",  
                        title: "Universal Connection",  
                        description: "Fosters a sense of oneness with all creation and cosmic awareness."  
                    }  
                ]  
            },  
            cognitive: {  
                title: "Cognitive Benefits",  
                content: "Listening to 847 Hz may improve cognitive functions such as focus, concentration, and memory. This can be particularly beneficial during study or work sessions. The frequency may stimulate creative thinking and problem-solving abilities, making it a useful tool for artists, writers, and anyone engaged in creative endeavors.",  
                benefits: [  
                    {  
                        icon: "🧠",  
                        title: "Enhanced Focus",  
                        description: "Improves concentration and the ability to maintain attention on tasks for longer periods."  
                    },  
                    {  
                        icon: "💡",  
                        title: "Creative Inspiration",  
                        description: "Stimulates the flow of creative ideas and innovative thinking processes."  
                    },  
                    {  
                        icon: "📚",  
                        title: "Memory Enhancement",  
                        description: "Supports better information retention and recall during learning activities."  
                    }  
                ]  
            },  
            stress: {  
                title: "Stress Reduction",  
                content: "The soothing nature of the 847 Hz frequency can trigger the body's relaxation response, reducing stress and anxiety levels. This can lead to improved mental health and overall well-being. Incorporating this frequency into a bedtime routine may promote better sleep quality by calming the mind and body, making it easier to fall asleep and stay asleep.",  
                benefits: [  
                    {  
                        icon: "🌿",  
                        title: "Nervous System Regulation",  
                        description: "Helps shift from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest) nervous system activity."  
                    },  
                    {  
                        icon: "😌",  
                        title: "Anxiety Relief",  
                        description: "Reduces feelings of worry and tension, promoting a calmer mental state."  
                    },  
                    {  
                        icon: "💤",  
                        title: "Sleep Improvement",  
                        description: "Facilitates deeper, more restorative sleep patterns and easier transition into sleep."  
                    }  
                ]  
            },  
            sound: {  
                title: "Sound Therapy Applications",  
                content: "The 847 Hz frequency is often used in sound therapy sessions, where it can complement other healing modalities such as Reiki, acupuncture, or aromatherapy. Practitioners may use this frequency as part of a holistic approach to health, addressing physical, emotional, and spiritual aspects of well-being. Group healing sessions with this frequency can foster a sense of community and shared experience.",  
                benefits: [  
                    {  
                        icon: "🔊",  
                        title: "Complementary Healing",  
                        description: "Works synergistically with other therapeutic modalities to enhance overall treatment effects."  
                    },  
                    {  
                        icon: "🧬",  
                        title: "Holistic Integration",  
                        description: "Addresses multiple dimensions of health simultaneously for comprehensive healing."  
                    },  
                    {  
                        icon: "👥",  
                        title: "Collective Resonance",  
                        description: "Creates powerful healing environments when experienced in group settings through shared resonance."  
                    }  
                ]  
            },  
            community: {  
                title: "Community and Connection",  
                content: "Engaging with the 847 Hz frequency in group settings can foster a sense of community and shared experience, enhancing the healing effects through collective energy. Many wellness retreats and workshops incorporate sound frequencies, including 847 Hz, to create immersive experiences that promote healing and personal growth. The shared vibrational field can amplify the benefits and create profound group experiences.",  
                benefits: [  
                    {  
                        icon: "👥",  
                        title: "Group Healing Sessions",  
                        description: "Amplifies healing effects through the power of collective intention and shared energetic fields."  
                    },  
                    {  
                        icon: "🌐",  
                        title: "Global Community",  
                        description: "Connects practitioners worldwide through shared frequency experiences and healing intentions."  
                    },  
                    {  
                        icon: "🧩",  
                        title: "Collective Consciousness",  
                        description: "Contributes to the evolution of group awareness and the expansion of shared healing potential."  
                    }  
                ]  
            }  
        };  
          
        // Animation variables  
        let time = 0;  
        let animationId;  
        let particles = [];  
        let analyzerAnimationId;  
          
        // Initialize visualization  
        function init() {  
            // Set up event listeners  
            setupEventListeners();  
              
            // Start animation  
            animate();  
            animateAnalyzer();  
              
            // Create initial particles  
            createParticles();  
        }  
          
        // Set up event listeners  
        function setupEventListeners() {  
            // Mode buttons  
            document.querySelectorAll('.control-btn').forEach(button => {  
                button.addEventListener('click', () => {  
                    // Remove active class from all buttons  
                    document.querySelectorAll('.control-btn').forEach(btn => {  
                        btn.classList.remove('active');  
                    });  
                      
                    // Add active class to clicked button  
                    button.classList.add('active');  
                      
                    // Update mode  
                    params.mode = button.getAttribute('data-mode');  
                      
                    // Update info panel  
                    updateInfoPanel();  
                      
                    // Create new particles for the new mode  
                    particles = [];  
                    createParticles();  
                });  
            });  
              
            // Sliders  
            document.getElementById('intensity').addEventListener('input', (e) => {  
                params.intensity = parseInt(e.target.value);  
                document.getElementById('intensity-value').textContent = params.intensity;  
            });  
              
            document.getElementById('resonance').addEventListener('input', (e) => {  
                params.resonance = parseInt(e.target.value);  
                document.getElementById('resonance-value').textContent = params.resonance;  
            });  
              
            document.getElementById('flow').addEventListener('input', (e) => {  
                params.flow = parseInt(e.target.value);  
                document.getElementById('flow-value').textContent = params.flow;  
            });  
              
            // Canvas click event  
            canvas.addEventListener('click', createRippleEffect);  
              
            // Window resize event  
            window.addEventListener('resize', () => {  
                canvas.width = canvas.offsetWidth;  
                analyzerCanvas.width = analyzerCanvas.offsetWidth;  
                particles = [];  
                createParticles();  
            });  
              
            // Modal events  
            document.getElementById('frequency-details-btn').addEventListener('click', () => {  
                document.getElementById('frequency-modal').style.display = 'flex';  
            });  
              
            document.getElementById('close-modal').addEventListener('click', () => {  
                document.getElementById('frequency-modal').style.display = 'none';  
            });  
              
            // Close modal when clicking outside  
            window.addEventListener('click', (e) => {  
                const modal = document.getElementById('frequency-modal');  
                if (e.target === modal) {  
                    modal.style.display = 'none';  
                }  
            });  
        }  
          
        // Update info panel based on current mode  
        function updateInfoPanel() {  
            const info = modeInfo[params.mode];  
            document.getElementById('info-title').textContent = info.title;  
            document.getElementById('info-content').textContent = info.content;  
              
            // Update benefits  
            const benefitsContainer = document.querySelector('.benefits');  
            benefitsContainer.innerHTML = '';  
              
            info.benefits.forEach(benefit => {  
                const card = document.createElement('div');  
                card.className = 'benefit-card';  
                card.innerHTML = `  
                    <div class="benefit-icon">${benefit.icon}</div>  
                    <h3 class="benefit-title">${benefit.title}</h3>  
                    <p class="benefit-description">${benefit.description}</p>  
                `;  
                benefitsContainer.appendChild(card);  
            });  
              
            // Add community section if in community mode  
            if (params.mode === 'community') {  
                const communitySection = document.createElement('div');  
                communitySection.className = 'community-section';  
                communitySection.innerHTML = `  
                    <h2 class="community-title">Connect with the 847 Hz Community</h2>  
                    <div class="community-grid">  
                        <div class="community-card">  
                            <div class="community-icon">👥</div>  
                            <h3 class="community-card-title">Group Sessions</h3>  
                            <p class="community-description">Join collective healing experiences where the power of 847 Hz is amplified through group intention.</p>  
                        </div>  
                        <div class="community-card">  
                            <div class="community-icon">🧘‍♀️</div>  
                            <h3 class="community-card-title">Retreats & Workshops</h3>  
                            <p class="community-description">Immerse yourself in transformative experiences guided by sound healing practitioners.</p>  
                        </div>  
                        <div class="community-card">  
                            <div class="community-icon">🌐</div>  
                            <h3 class="community-card-title">Global Network</h3>  
                            <p class="community-description">Connect with practitioners and enthusiasts worldwide sharing the healing journey.</p>  
                        </div>  
                    </div>  
                `;  
                  
                document.querySelector('.info-panel').appendChild(communitySection);  
            }  
        }  
          
        // Create particles for visualization  
        function createParticles() {  
            const particleCount = 100;  
            const colors = modeColors[params.mode];  
              
            for (let i = 0; i < particleCount; i++) {  
                const x = Math.random() * canvas.width;  
                const y = Math.random() * canvas.height;  
                const size = Math.random() * 5 + 1;  
                const color = i % 3 === 0 ? colors.primary : (i % 3 === 1 ? colors.secondary : colors.tertiary);  
                const speed = Math.random() * 1 + 0.5;  
                const angle = Math.random() * Math.PI * 2;  
                  
                particles.push({  
                    x,  
                    y,  
                    size,  
                    color,  
                    speed,  
                    angle,  
                    amplitude: Math.random() * 20 + 10,  
                    frequency: Math.random() * 0.02 + 0.01,  
                    phase: Math.random() * Math.PI * 2  
                });  
            }  
        }  
          
        // Create ripple effect on canvas click  
        function createRippleEffect(event) {  
            const rect = canvas.getBoundingClientRect();  
            const x = event.clientX - rect.left;  
            const y = event.clientY - rect.top;  
              
            // Create ripple element  
            const ripple = document.createElement('div');  
            ripple.className = 'ripple';  
            ripple.style.left = `${event.clientX}px`;  
            ripple.style.top = `${event.clientY}px`;  
            ripple.style.borderColor = modeColors[params.mode].primary;  
            document.body.appendChild(ripple);  
              
            // Remove ripple after animation completes  
            setTimeout(() => {  
                ripple.remove();  
            }, 2000);  
              
            // Create energy particles  
            for (let i = 0; i < 8; i++) {  
                const angle = (i / 8) * Math.PI * 2;  
                const distance = 50 + Math.random() * 50;  
                  
                const particle = document.createElement('div');  
                particle.className = 'energy-particle';  
                particle.style.left = `${event.clientX}px`;  
                particle.style.top = `${event.clientY}px`;  
                particle.style.width = `${10 + Math.random() * 10}px`;  
                particle.style.height = `${10 + Math.random() * 10}px`;  
                particle.style.backgroundColor = modeColors[params.mode].secondary;  
                document.body.appendChild(particle);  
                  
                // Animate particle  
                setTimeout(() => {  
                    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`;  
                    particle.style.opacity = '0.7';  
                }, 10);  
                  
                // Remove particle after animation  
                setTimeout(() => {  
                    particle.remove();  
                }, 3000);  
            }  
              
            // Add new particles at click position  
            const colors = modeColors[params.mode];  
            for (let i = 0; i < 20; i++) {  
                const angle = Math.random() * Math.PI * 2;  
                const speed = Math.random() * 2 + 1;  
                  
                particles.push({  
                    x,  
                    y,  
                    size: Math.random() * 5 + 2,  
                    color: i % 3 === 0 ? colors.primary : (i % 3 === 1 ? colors.secondary : colors.tertiary),  
                    speed,  
                    angle,  
                    amplitude: Math.random() * 30 + 15,  
                    frequency: Math.random() * 0.02 + 0.01,  
                    phase: Math.random() * Math.PI * 2  
                });  
            }  
        }  
          
        // Animation loop  
        function animate() {  
            // Clear canvas with slight fade effect  
            ctx.fillStyle = modeColors[params.mode].background;  
            ctx.fillRect(0, 0, canvas.width, canvas.height);  
              
            // Update time  
            time += 0.01 * (params.flow / 40);  
              
            // Draw frequency wave  
            drawFrequencyWave();  
              
            // Update and draw particles  
            updateParticles();  
              
            // Draw energy field  
            drawEnergyField();  
              
            // Continue animation  
            animationId = requestAnimationFrame(animate);  
        }  
          
        // Animate frequency analyzer  
        function animateAnalyzer() {  
            // Clear canvas  
            analyzerCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';  
            analyzerCtx.fillRect(0, 0, analyzerCanvas.width, analyzerCanvas.height);  
              
            // Draw frequency spectrum  
            drawFrequencySpectrum();  
              
            // Continue animation  
            analyzerAnimationId = requestAnimationFrame(animateAnalyzer);  
        }  
          
        // Draw frequency spectrum  
        function drawFrequencySpectrum() {  
            const height = analyzerCanvas.height;  
            const width = analyzerCanvas.width;  
            const colors = modeColors[params.mode];  
              
            // Create gradient  
            const gradient = analyzerCtx.createLinearGradient(0, 0, 0, height);  
            gradient.addColorStop(0, colors.primary);  
            gradient.addColorStop(0.5, colors.secondary);  
            gradient.addColorStop(1, colors.tertiary);  
              
            // Draw frequency bars  
            const barCount = 100;  
            const barWidth = width / barCount;  
              
            for (let i = 0; i < barCount; i++) {  
                // Simulate frequency data  
                let barHeight;  
                  
                // Create a peak around 847 Hz  
                const distance = Math.abs(i - barCount * 0.5);  
                const peakFactor = Math.exp(-distance * distance / (2 * 100));  
                  
                // Add some noise and time-based variation  
                const noise = Math.sin(time * 5 + i * 0.3) * 0.2 + 0.8;  
                barHeight = height * 0.8 * peakFactor * noise * (params.intensity / 50);  
                  
                // Add secondary peaks for harmonics  
                if (i > barCount * 0.75) {  
                    const harmonicDistance = Math.abs(i - barCount * 0.85);  
                    const harmonicPeak = Math.exp(-harmonicDistance * harmonicDistance / (2 * 50));  
                    barHeight = Math.max(barHeight, height * 0.5 * harmonicPeak * noise * (params.intensity / 50));  
                }  
                  
                // Add low frequency content  
                if (i < barCount * 0.25) {  
                    const lowFreqFactor = (barCount * 0.25 - i) / (barCount * 0.25);  
                    barHeight = Math.max(barHeight, height * 0.3 * lowFreqFactor * noise * (params.intensity / 50));  
                }  
                  
                // Draw bar  
                analyzerCtx.fillStyle = gradient;  
                analyzerCtx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);  
                  
                // Draw peak line  
                analyzerCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';  
                analyzerCtx.fillRect(i * barWidth, height - barHeight - 2, barWidth - 1, 2);  
            }  
              
            // Draw 847 Hz marker  
            const markerX = width * 0.5;  
            analyzerCtx.beginPath();  
            analyzerCtx.moveTo(markerX, 0);  
            analyzerCtx.lineTo(markerX, height);  
            analyzerCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';  
            analyzerCtx.lineWidth = 1;  
            analyzerCtx.setLineDash([5, 5]);  
            analyzerCtx.stroke();  
            analyzerCtx.setLineDash([]);  
              
            // Draw frequency label  
            analyzerCtx.fillStyle = '#fff';  
            analyzerCtx.font = '10px Montserrat';  
            analyzerCtx.textAlign = 'center';  
            analyzerCtx.fillText('847 Hz', markerX, 15);  
        }  
          
        // Draw main frequency wave  
        function drawFrequencyWave() {  
            const colors = modeColors[params.mode];  
            const waveHeight = params.intensity * 1.5;  
            const waveCount = Math.max(1, Math.floor(params.resonance / 20));  
              
            for (let w = 0; w < waveCount; w++) {  
                const baseY = canvas.height / 2;  
                const amplitude = waveHeight * (1 - w * 0.2);  
                const frequency = 0.01 * (1 + w * 0.1) * (847 / 500); // Scale to 847 Hz  
                const phase = time * (1 + w * 0.2);  
                const opacity = 1 - w * 0.2;  
                  
                ctx.beginPath();  
                ctx.moveTo(0, baseY);  
                  
                for (let x = 0; x < canvas.width; x++) {  
                    const y = baseY + Math.sin(x * frequency + phase) * amplitude;  
                    ctx.lineTo(x, y);  
                }  
                  
                ctx.strokeStyle = w === 0 ? colors.primary : (w % 2 === 1 ? colors.secondary : colors.tertiary);  
                ctx.lineWidth = 3 - w * 0.5;  
                ctx.globalAlpha = opacity;  
                ctx.stroke();  
                ctx.globalAlpha = 1;  
            }  
        }  
          
        // Update and draw particles  
        function updateParticles() {  
            for (let i = 0; i < particles.length; i++) {  
                const p = particles[i];  
                  
                // Update position based on flow and resonance  
                const flowFactor = params.flow / 40;  
                const resonanceFactor = params.resonance / 60;  
                  
                // Different movement patterns based on mode  
                switch(params.mode) {  
                    case 'physical':  
                        // Circular motion with pulsing  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor;  
                        p.y += Math.sin(p.angle) * p.speed * flowFactor;  
                        p.size = p.size * 0.99 + Math.sin(time * 2 + p.phase) * 0.5;  
                        break;  
                          
                    case 'emotional':  
                        // Heart-like pattern  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor;  
                        p.y += Math.sin(p.angle * 2) * p.speed * flowFactor * 0.5;  
                        p.size = p.size * 0.99 + Math.sin(time * 3 + p.phase) * 0.7;  
                        break;  
                          
                    case 'meditation':  
                        // Slow, gentle waves  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor * 0.7;  
                        p.y += Math.sin(time * 0.5 + p.phase) * 0.5;  
                        break;  
                          
                    case 'spiritual':  
                        // Spiral upward motion  
                        p.angle += 0.01 * flowFactor;  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor;  
                        p.y -= 0.2 * flowFactor;  
                        p.size = p.size * 0.99 + Math.sin(time + p.phase) * 0.3;  
                        break;  
                          
                    case 'cognitive':  
                        // Network-like connections  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor;  
                        p.y += Math.sin(p.angle) * p.speed * flowFactor;  
                        if (Math.random() < 0.01) p.angle = Math.random() * Math.PI * 2;  
                        break;  
                          
                    case 'stress':  
                        // Calming downward flow  
                        p.x += Math.sin(time * 0.5 + p.phase) * 0.5;  
                        p.y += 0.5 * flowFactor;  
                        p.size = p.size * 0.99 + Math.sin(time * 0.5 + p.phase) * 0.2;  
                        break;  
                          
                    case 'sound':  
                        // Sound wave-like pattern  
                        p.x += p.speed * flowFactor;  
                        p.y = canvas.height/2 + Math.sin(p.x * 0.02 + time) * p.amplitude * resonanceFactor;  
                        break;  
                          
                    case 'community':  
                        // Group clustering behavior  
                        const centerX = canvas.width/2 + Math.sin(time * 0.5) * 100;  
                        const centerY = canvas.height/2 + Math.cos(time * 0.3) * 50;  
                          
                        // Move toward center with some randomness  
                        const dx = centerX - p.x;  
                        const dy = centerY - p.y;  
                        const dist = Math.sqrt(dx * dx + dy * dy);  
                          
                        if (dist > 50) {  
                            p.x += (dx / dist) * p.speed * flowFactor;  
                            p.y += (dy / dist) * p.speed * flowFactor;  
                        } else {  
                            p.angle += 0.02 * flowFactor;  
                            p.x += Math.cos(p.angle) * p.speed * flowFactor * 0.5;  
                            p.y += Math.sin(p.angle) * p.speed * flowFactor * 0.5;  
                        }  
                        break;  
                          
                    default:  
                        // Default movement  
                        p.x += Math.cos(p.angle) * p.speed * flowFactor;  
                        p.y += Math.sin(p.angle) * p.speed * flowFactor;  
                }  
                  
                // Wrap around edges  
                if (p.x < 0) p.x = canvas.width;  
                if (p.x > canvas.width) p.x = 0;  
                if (p.y < 0) p.y = canvas.height;  
                if (p.y > canvas.height) p.y = 0;  
                  
                // Draw particle  
                ctx.beginPath();  
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);  
                ctx.fillStyle = p.color;  
                ctx.fill();  
                  
                // Draw connecting lines between nearby particles  
                if (params.resonance > 30) {  
                    for (let j = i + 1; j < particles.length; j++) {  
                        const p2 = particles[j];  
                        const dx = p.x - p2.x;  
                        const dy = p.y - p2.y;  
                        const distance = Math.sqrt(dx * dx + dy * dy);  
                          
                        if (distance < 50 * (params.resonance / 60)) {  
                            ctx.beginPath();  
                            ctx.moveTo(p.x, p.y);  
                            ctx.lineTo(p2.x, p2.y);  
                            ctx.strokeStyle = p.color;  
                            ctx.globalAlpha = (1 - distance / (50 * (params.resonance / 60))) * 0.2;  
                            ctx.lineWidth = 0.5;  
                            ctx.stroke();  
                            ctx.globalAlpha = 1;  
                        }  
                    }  
                }  
            }  
        }  
          
        // Draw energy field effect  
        function drawEnergyField() {  
            const colors = modeColors[params.mode];  
            const intensity = params.intensity / 100;  
              
            // Draw based on current mode  
            switch(params.mode) {  
                case 'physical':  
                    // Draw healing aura  
                    const gradient = ctx.createRadialGradient(  
                        canvas.width/2, canvas.height/2, 0,  
                        canvas.width/2, canvas.height/2, canvas.width/2  
                    );  
                    gradient.addColorStop(0, `rgba(255, 123, 37, ${0.05 * intensity})`);  
                    gradient.addColorStop(0.5, `rgba(255, 215, 0, ${0.03 * intensity})`);  
                    gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');  
                      
                    ctx.fillStyle = gradient;  
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    break;  
                      
                case 'emotional':  
                    // Draw heart-centered energy  
                    const heartX = canvas.width/2;  
                    const heartY = canvas.height/2;  
                    const heartSize = 100 + Math.sin(time) * 10;  
                      
                    const heartGradient = ctx.createRadialGradient(  
                        heartX, heartY, 0,  
                        heartX, heartY, heartSize  
                    );  
                    heartGradient.addColorStop(0, `rgba(255, 105, 180, ${0.1 * intensity})`);  
                    heartGradient.addColorStop(0.7, `rgba(218, 112, 214, ${0.05 * intensity})`);  
                    heartGradient.addColorStop(1, 'rgba(255, 20, 147, 0)');  
                      
                    ctx.fillStyle = heartGradient;  
                    ctx.beginPath();  
                    ctx.arc(heartX, heartY, heartSize, 0, Math.PI * 2);  
                    ctx.fill();  
                    break;  
                      
                case 'meditation':  
                    // Draw calm energy waves  
                    for (let i = 0; i < 3; i++) {  
                        const y = canvas.height * (i + 1) / 4;  
                          
                        ctx.beginPath();  
                        ctx.moveTo(0, y);  
                          
                        for (let x = 0; x < canvas.width; x++) {  
                            const waveHeight = 10 * intensity;  
                            const waveY = y + Math.sin(x * 0.01 + time * (0.5 - i * 0.1)) * waveHeight;  
                            ctx.lineTo(x, waveY);  
                        }  
                          
                        ctx.strokeStyle = i === 0 ? colors.primary : (i === 1 ? colors.secondary : colors.tertiary);  
                        ctx.globalAlpha = 0.2 - i * 0.05;  
                        ctx.lineWidth = 3 - i;  
                        ctx.stroke();  
                        ctx.globalAlpha = 1;  
                    }  
                    break;  
                      
                case 'spiritual':  
                    // Draw cosmic connection lines  
                    const centerX = canvas.width/2;  
                    const centerY = canvas.height/2;  
                    const lineCount = 12;  
                      
                    for (let i = 0; i < lineCount; i++) {  
                        const angle = (i / lineCount) * Math.PI * 2 + time * 0.2;  
                        const length = 150 + Math.sin(time + i) * 30;  
                          
                        ctx.beginPath();  
                        ctx.moveTo(centerX, centerY);  
                        ctx.lineTo(  
                            centerX + Math.cos(angle) * length,  
                            centerY + Math.sin(angle) * length  
                        );  
                          
                        const gradient = ctx.createLinearGradient(  
                            centerX, centerY,  
                            centerX + Math.cos(angle) * length,  
                            centerY + Math.sin(angle) * length  
                        );  
                        gradient.addColorStop(0, `rgba(0, 191, 255, ${0.7 * intensity})`);  
                        gradient.addColorStop(1, `rgba(30, 144, 255, ${0.1 * intensity})`);  
                          
                        ctx.strokeStyle = gradient;  
                        ctx.lineWidth = 2;  
                        ctx.stroke();  
                    }  
                    break;  
                      
                case 'cognitive':  
                    // Draw neural network pattern  
                    const nodeCount = 7;  
                    const nodes = [];  
                      
                    // Create nodes  
                    for (let i = 0; i < nodeCount; i++) {  
                        const x = canvas.width * (i + 1) / (nodeCount + 1);  
                        const y = canvas.height/2 + Math.sin(time + i) * 50;  
                        nodes.push({ x, y });  
                          
                        ctx.beginPath();  
                        ctx.arc(x, y, 8, 0, Math.PI * 2);  
                        ctx.fillStyle = colors.primary;  
                        ctx.fill();  
                    }  
                      
                    // Connect nodes  
                    for (let i = 0; i < nodes.length; i++) {  
                        for (let j = i + 1; j < nodes.length; j++) {  
                            const n1 = nodes[i];  
                            const n2 = nodes[j];  
                              
                            ctx.beginPath();  
                            ctx.moveTo(n1.x, n1.y);  
                            ctx.lineTo(n2.x, n2.y);  
                              
                            const pulseOffset = (time + i + j) % 1;  
                            const pulsePosition = pulseOffset;  
                              
                            const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);  
                            gradient.addColorStop(Math.max(0, pulsePosition - 0.1), 'rgba(50, 205, 50, 0.1)');  
                            gradient.addColorStop(pulsePosition, `rgba(124, 252, 0, ${0.5 * intensity})`);  
                            gradient.addColorStop(Math.min(1, pulsePosition + 0.1), 'rgba(0, 250, 154, 0.1)');  
                              
                            ctx.strokeStyle = gradient;  
                            ctx.lineWidth = 2;  
                            ctx.stroke();  
                        }  
                    }  
                    break;  
                      
                case 'stress':  
                    // Draw calming water ripples  
                    const rippleCount = 3;  
                    const centerRippleX = canvas.width/2;  
                    const centerRippleY = canvas.height/2;  
                      
                    for (let i = 0; i < rippleCount; i++) {  
                        const radius = (time * 20 + i * 50) % (Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height));  
                          
                        ctx.beginPath();  
                        ctx.arc(centerRippleX, centerRippleY, radius, 0, Math.PI * 2);  
                        ctx.strokeStyle = `rgba(72, 209, 204, ${(1 - radius / (Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height))) * 0.3 * intensity})`;  
                        ctx.lineWidth = 2;  
                        ctx.stroke();  
                    }  
                    break;  
                      
                case 'sound':  
                    // Draw sound resonance patterns  
                    const patternCount = 5;  
                      
                    for (let i = 0; i < patternCount; i++) {  
                        const baseY = canvas.height * (i + 1) / (patternCount + 1);  
                        const amplitude = 20 * intensity * (1 - i * 0.15);  
                        const frequency = 0.02 * (1 + i * 0.2);  
                          
                        ctx.beginPath();  
                        ctx.moveTo(0, baseY);  
                          
                        for (let x = 0; x < canvas.width; x++) {  
                            const y = baseY + Math.sin(x * frequency + time * (1 + i * 0.1)) * amplitude;  
                            ctx.lineTo(x, y);  
                        }  
                          
                        ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;  
                        ctx.lineWidth = 2;  
                        ctx.globalAlpha = 0.3 - i * 0.05;  
                        ctx.stroke();  
                        ctx.globalAlpha = 1;  
                    }  
                    break;  
                      
                case 'community':  
                    // Draw community connection web  
                    const centerWebX = canvas.width/2;  
                    const centerWebY = canvas.height/2;  
                    const nodeRadius = 80 + Math.sin(time) * 10;  
                    const nodeCount = 8;  
                    const communityNodes = [];  
                      
                    // Create community nodes in a circle  
                    for (let i = 0; i < nodeCount; i++) {  
                        const angle = (i / nodeCount) * Math.PI * 2 + time * 0.1;  
                        const x = centerWebX + Math.cos(angle) * nodeRadius;  
                        const y = centerWebY + Math.sin(angle) * nodeRadius;  
                        communityNodes.push({ x, y });  
                          
                        // Draw node  
                        ctx.beginPath();  
                        ctx.arc(x, y, 8, 0, Math.PI * 2);  
                        ctx.fillStyle = colors.primary;  
                        ctx.fill();  
                          
                        // Draw connection to center  
                        ctx.beginPath();  
                        ctx.moveTo(centerWebX, centerWebY);  
                        ctx.lineTo(x, y);  
                        ctx.strokeStyle = `rgba(255, 165, 0, ${0.3 * intensity})`;  
                        ctx.lineWidth = 1;  
                        ctx.stroke();  
                    }  
                      
                    // Draw center node  
                    ctx.beginPath();  
                    ctx.arc(centerWebX, centerWebY, 12, 0, Math.PI * 2);  
                    ctx.fillStyle = colors.tertiary;  
                    ctx.fill();  
                      
                    // Draw connections between nodes  
                    for (let i = 0; i < communityNodes.length; i++) {  
                        const n1 = communityNodes[i];  
                        const n2 = communityNodes[(i + 1) % communityNodes.length];  
                        const n3 = communityNodes[(i + 2) % communityNodes.length];  
                          
                        // Connect to adjacent nodes  
                        ctx.beginPath();  
                        ctx.moveTo(n1.x, n1.y);  
                        ctx.lineTo(n2.x, n2.y);  
                        ctx.strokeStyle = `rgba(255, 140, 0, ${0.2 * intensity})`;  
                        ctx.lineWidth = 1;  
                        ctx.stroke();  
                          
                        // Connect to nodes further away with lower opacity  
                        ctx.beginPath();  
                        ctx.moveTo(n1.x, n1.y);  
                        ctx.lineTo(n3.x, n3.y);  
                        ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 * intensity})`;  
                        ctx.lineWidth = 0.5;  
                        ctx.stroke();  
                    }  
                      
                    // Draw energy field  
                    const communityGradient = ctx.createRadialGradient(  
                        centerWebX, centerWebY, 0,  
                        centerWebX, centerWebY, nodeRadius * 1.5  
                    );  
                    communityGradient.addColorStop(0, `rgba(255, 165, 0, ${0.05 * intensity})`);  
                    communityGradient.addColorStop(0.7, `rgba(255, 215, 0, ${0.03 * intensity})`);  
                    communityGradient.addColorStop(1, 'rgba(255, 140, 0, 0)');  
                      
                    ctx.fillStyle = communityGradient;  
                    ctx.beginPath();  
                    ctx.arc(centerWebX, centerWebY, nodeRadius * 1.5, 0, Math.PI * 2);  
                    ctx.fill();  
                    break;  
            }  
        }  
          
        // Initialize on page load  
        window.onload = init;  
    </script>  
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9601b77dc510d358',t:'MTc1MjY3MTE4NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>  
</html>  
