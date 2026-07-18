**PARAMETRIC EQUATION — DOUBLE HELIX**  
  
Let  
 t = parameter (in radians)  
 R = radius of the helix  
 P = pitch per full turn (axial distance for one 2π rotation)  
  
**Strand 1**  
x₁(t) = R * cos(t)  
y₁(t) = R * sin(t)  
z₁(t) = (P / (2π)) * t  
  
**Strand 2** (shifted 180° out of phase)  
x₂(t) = R * cos(t + π) = –R * cos(t)  
y₂(t) = R * sin(t + π) = –R * sin(t)  
z₂(t) = (P / (2π)) * t  
  
**Base-pair connectors** (points between strands)  
For s ∈ [0, 1]:  
B(s, t) = (1 – s)·(x₁, y₁, z₁) + s·(x₂, y₂, z₂)  
  
⸻  
  
**Typical DNA-like numbers**  
R ≈ 1.0 nm  
P ≈ 3.57 nm (10.5 base pairs per turn)  
Δt ≈ 2π / 10.5 ≈ 0.598 radians between base pairs  
  
⸻  
  
**Handedness note**  
B-DNA is right-handed.  
If your plot looks left-handed, just flip t → –t.  
  
⸻  
  
That’s the clean mathematical core — no formatting, no code.  
