SHANNON Æ ENTROPY VISUALIZER — Full Prototype Build Spec  
UUON Foundation · UUON-VWA-2025-002 · © 2026 Phillip A. Ruiz III  
  
Build a professional real-time Shannon entropy and information theory visualization system as a single-page web application. Stack: Vite + vanilla TypeScript + WebGL2 via raw GLSL shaders (no Three.js). No UI framework. Fonts: Share Tech Mono + Rajdhani from Google Fonts. Color palette: #04080f background, #00e5cc primary (teal), #8b5cf6 secondary (purple), #ff3355 alert (red), #f5a623 dual (amber). All values as CSS custom properties.  
  
ACCURACY CONSTRAINT — NON-NEGOTIABLE  
Every displayed metric must be mathematically real or explicitly labeled as an approximation. Nothing is faked. If a computation cannot be done accurately in-browser in real time, it is removed. No decorative metrics.  
  
SIGNAL GENERATOR — VWA Catalog (UUON-VWA-2025-002)  
Implement these waveforms exactly as specified. All use configurable amplitude A, wavenumber k, angular frequency ω, phase φ:  
	∙	F₁ Sine: A·sin(kx + ωt + φ)  
	∙	F₁₀ Composite: Σᵢ Aᵢ·sin(kᵢx + ωᵢt + φᵢ) — 4 harmonics, amplitudes 1, 0.5, 0.25, 0.125  
	∙	F₁₃ FM: A·sin(kx + ωt + β·sin(mx + νt)) — modulation index β user-controlled  
	∙	F₁₄ AM: A·(1 + m·cos(ωₘt))·sin(kx + ωt) — modulation depth m user-controlled  
	∙	F₁₈ Damped: A·e^(−αt)·sin(kx + ωt) — decay rate α user-controlled  
	∙	F₂₁ Soliton: A·sech(α·(x − vt))·sin(kx + ωt) — travels without deforming, velocity v user-controlled  
	∙	F₃₃ Chirp: A·sin((k + γt)·x + ωt) — linear frequency sweep rate γ user-controlled  
	∙	Square: A·sign(sin(kx + ωt))  
  
NOISE LAYER — VWA Catalog  
Implement these noise types. Noise is added to the signal sample-by-sample. Noise level 0–1 user-controlled:  
	∙	SN₁ White: uniform random per sample  
	∙	SN₂ Pink: Voss-McCartney 7-stage algorithm — power ∝ 1/f exactly  
	∙	SN₃ Brown: integrated white noise — power ∝ 1/f²  
	∙	N₁ Perlin: classical gradient noise with permutation table, 1D evaluated at sample index + time offset  
	∙	N₃ fBm: 6-octave fractional Brownian motion Σ (amplitude·Perlin(frequency·x)) with Hurst-controlled amplitude falloff per octave. Hurst H is a user parameter 0.1–0.9, not estimated  
  
REAL METRICS ONLY  
Shannon Entropy H(x): 16-bin histogram over a sliding window of 256 samples. H = −Σ p·log₂(p), normalized by log₂(16). This is the ground truth metric. Display to 4 decimal places.  
Kolmogorov Complexity K (proxy): Lempel-Ziv 76 complexity on a binarized (median-threshold) sequence of the window. This is the standard computable proxy used in neuroscience literature. Label it K_LZ in the UI, not K. Never call it Kolmogorov directly — call it LZ Complexity.  
Dual Layer H̄: The complement signal is the Hilbert transform quadrature component, computed via a 64-tap FIR Hilbert filter applied to the signal buffer. This gives the true analytic signal quadrature, not a sign flip. Run the same H(x) calculation on it.  
STFT: Short-time Fourier transform with 256-point DFT, Hann window w(n) = 0.5·(1 − cos(2πn/N)) applied before transform. Display as spectrogram in the bottom-right quadrant. Frequency axis 0 to Nyquist. No windowing = no STFT. This is non-negotiable.  
H≈K_LZ convergence: When |H − K_LZ| < 0.05 sustained for 2 seconds, fire the Information Death event. Visual: red overlay pulse, banner text.  
H≈H̄ equilibrium: When dual layer active and |H − H̄| < 0.04 sustained for 2 seconds, fire the Equilibrium event. Visual: gold overlay, banner text. This means neither channel carries more information than the other — the system is fully described by either half.  
Do not implement Lyapunov exponents, Hurst estimation, or vorticity. These require data volumes and computation not achievable honestly in this context.  
  
ENTROPY FIELD — Right Panel (WebGL2)  
This is a real 2D Shannon entropy map, not a noise-diff proxy.  
Divide the panel into a 64×48 grid of cells. For each cell, collect the signal samples that fall within its x-time window. Compute H(x) via histogram for each cell independently. Color map: H=0 → #04080f (black), H=0.5 → #0f2040 (dark blue), H=0.75 → #8b5cf6 (purple), H=1.0 → #ff3355 (red). Interpolate in HSL space. Render via WebGL2 fragment shader — pass the 64×48 entropy values as a uniform texture, sample and interpolate in the shader.  
Shannon capacity line: horizontal line at y-position corresponding to current bandwidth setting. Rendered as a teal line with 8px glow via additive blending in the shader. Jitter the line by ±4px using a sine function of x and time to show the stochastic boundary.  
  
LAYOUT  
Header: title left, status pill + event counter + Dual Layer toggle + Info button right.  
Mode bar: General / Malware Analysis / Network-DDoS / Data Compression / Physical Systems / EEG-Signal. Each mode rewires all label text, status messages, collapse event text, and the mode-specific readout metric.  
Waveform bar: 8 waveform buttons + 5 noise type buttons in one row.  
Main grid: 2×2. Top-left: signal waveform canvas. Top-right: 2D entropy field (WebGL2). Bottom full-width: curves panel (H, K_LZ, H̄ when dual active) left portion + STFT spectrogram right portion (28% of width).  
Controls row: Noise Level slider, Channel Bandwidth slider, ω slider, waveform-specific parameter slider (updates label and range based on active waveform), mode readout right-aligned.  
  
APPLICATION MODES  
Each mode changes: signal panel label, field panel label, noise slider label, status messages (clean/warn/overload), collapse event text, anomaly flag text, mode-specific readout formula.  
	∙	General: readout = H × 8 bits/byte  
	∙	Malware: readout = bits/byte, collapse text = “HIGH ENTROPY PAYLOAD — PACKER DETECTED”, clean = “PLAINTEXT”, overload = “POSSIBLE MALWARE”  
	∙	Network/DDoS: readout = estimated anomalous packets/sec proportional to H, collapse = “DDoS PATTERN — TRAFFIC COLLAPSE”  
	∙	Compression: readout = (1−H)×100 percent reducible, convergence label = “COMPRESSION LIMIT”  
	∙	Physical: readout = entropy production proxy dH (change in H per frame), collapse = “CHAOTIC TRANSITION”  
	∙	EEG: readout = spectral entropy label, collapse = “SEIZURE-LEVEL ENTROPY”  
  
INFO MODAL  
Triggered by ⓘ INFO button. Contains:  
	∙	Definition paragraph  
	∙	Core formula block: H(X), H̄(X), Equilibrium condition, LZ complexity note  
	∙	VWA algorithm cards: one card per implemented algorithm with VWA code, formula, positive function, dual function  
	∙	Accuracy statement: explicitly lists what is real computation vs labeled approximation  
	∙	Panel reading guide: L / R / B panel descriptions  
	∙	Footer: copyright, publication code, URL  
  
EVENTS  
Channel Collapse: fires when H > bandwidth. Full-screen red tint (15% opacity), banner text from current mode, resets history arrays after 2.8 seconds.  
Information Death: fires when |H − K_LZ| < 0.05 sustained 2 seconds. Red curve overlay, label in curve panel.  
Information Equilibrium: fires when dual active and |H − H̄| < 0.04 sustained 2 seconds. Gold tint, gold banner, gold status pill.  
  
METADATA  
Title: Shannon Æ Entropy Visualizer v3.0 — UUON Foundation  
All standard meta tags, OG tags, author, copyright, application-name, VWA publication code in meta.  
Footer: © 2026 Phillip A. Ruiz III · UUON Foundation Inc · uuon-foundation.com · VWA-2025-002  
  
WHAT NOT TO BUILD  
Do not implement: Lyapunov exponents, Hurst estimation from signal data, vorticity overlay, any metric labeled as real that is computed from a shortcut. If a feature cannot be done accurately, omit it entirely. No decorative science.​​​​​​​​​​​​​​​​  
