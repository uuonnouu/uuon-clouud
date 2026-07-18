Create an interactive WebGL/HTML5 canvas visualization titled "Brainwave Circular Dispersion".  
  
Requirements:  
- Use a single circular (polar) coordinate system as the main canvas.  
- Plot five distinct brainwave frequency bands as radial waveforms:  
  • Delta: 0.5–4 Hz  
  • Theta: 4–8 Hz  
  • Alpha: 8–13 Hz  
  • Beta: 13–32 Hz  
  • Gamma: 25–140 Hz  
- Each band is a concentric ring around the center. The ring radius is proportional to its median frequency.  
- Animate each band with a sinusoidal waveform based on the equation:  
    r(θ,t) = R + A * sin(2π * f * t + θ)  
  where  
    R = base radius for the band  
    A = amplitude slider (user-controlled)  
    f = frequency (user-controlled within band range)  
    θ = angular position (0–2π)  
    t = time (for animation)  
- Provide variables/sliders to adjust:  
    amplitude A (0–50 px)  
    frequency f (within each band’s Hz range)  
    phase offset φ (0–2π)  
    color per band (RGBA)  
    global rotation speed  
- Use smooth interpolation so that drastic parameter changes create visually dramatic but fluid transitions.  
- Include a legend labeling each ring with its band name and current frequency.  
  
Implementation Notes:  
- Use JavaScript (ES6) with a canvas library like p5.js or pure WebGL.  
- Optimize for 60 FPS animation.  
- Include comments explaining the math for r(θ,t).  
