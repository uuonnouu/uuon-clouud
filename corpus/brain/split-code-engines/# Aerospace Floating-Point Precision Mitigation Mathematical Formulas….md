# Aerospace Floating-Point Precision Mitigation: Mathematical Formulas & Techniques  
  
## 1. Double Precision (IEEE 754-2008)  
  
### Basic Representation  
  
A double-precision (64-bit) floating-point number is represented as:  
  
```  
x = (−1)^s × c × 2^q  
```  
  
Where:  
  
- **s** = sign bit (0 or 1)  
- **c** = significand/mantissa (53 bits of precision)  
- **q** = biased exponent (11 bits, range: -1022 to +1023)  
  
### Machine Epsilon (Double Precision)  
  
```  
ε_mach = 2^(-53) ≈ 1.11 × 10^(-16)  
```  
  
This represents the upper bound on relative rounding error for a single operation.  
  
### Error Bound for Basic Operations  
  
For any basic operation (±, ×, ÷, √), the result satisfies:  
  
```  
|computed_value - true_value| ≤ 0.5 ULP  
```  
  
Where ULP = Unit in the Last Place (smallest representable difference at that magnitude).  
  
-----  
  
## 2. Regularized Coordinate Systems  
  
### Kustaanheimo-Stiefel (KS) Transformation  
  
The KS transformation converts the 3D two-body problem into a 4D harmonic oscillator, removing singularities.  
  
#### Coordinate Transformation  
  
Physical coordinates **r** = (x, y, z) → KS coordinates **u** = (u₁, u₂, u₃, u₄):  
  
```  
x = u₁² - u₂² - u₃² + u₄²  
y = 2(u₁u₂ - u₃u₄)  
z = 2(u₁u₃ + u₂u₄)  
```  
  
Or in matrix form:  
  
```  
r = L(u) · u  
```  
  
Where L(u) is the 3×4 Levi-Civita matrix:  
  
```  
L(u) = | u₁  -u₂  -u₃   u₄ |  
       | u₂   u₁  -u₄  -u₃ |  
       | u₃   u₄   u₁   u₂ |  
```  
  
#### Bilinear Constraint  
  
```  
u · u = r (the orbital radius)  
```  
  
#### Sundman Time Transformation  
  
Physical time **t** is replaced by fictitious time **s**:  
  
```  
dt/ds = r = |r|  
```  
  
This regularizes the equations by removing the 1/r² singularity in gravitational force.  
  
#### Regularized Equations of Motion  
  
The perturbed KS equations become:  
  
```  
d²u/ds² + (h/2)u = (r/2)F_pert  
```  
  
Where:  
  
- **h** = energy (constant for Keplerian motion)  
- **F_pert** = perturbing forces  
  
This is a **harmonic oscillator equation** with constant frequency, which is numerically stable and less sensitive to round-off errors.  
  
### DROMO (Draper-Optimal Modified Orbital Elements)  
  
Uses ideal anomaly **σ** from a second-order Sundman transformation:  
  
```  
dt/dσ = (r/p)²  
```  
  
Where **p** = semi-latus rectum.  
  
The DROMO elements remain constant in Keplerian motion and have smooth behavior even for high eccentricity orbits.  
  
-----  
  
## 3. Quaternion Representation for Attitude  
  
### Quaternion Definition  
  
A quaternion **q** consists of a scalar and a vector:  
  
```  
q = [q₀, q₁, q₂, q₃]ᵀ = [q₀, q⃗]ᵀ  
```  
  
Where q₀ is the scalar part and q⃗ = [q₁, q₂, q₃]ᵀ is the vector part.  
  
### Normalization Constraint  
  
```  
||q|| = √(q₀² + q₁² + q₂² + q₃²) = 1  
```  
  
### Axis-Angle Representation  
  
For a rotation by angle θ about axis n̂:  
  
```  
q₀ = cos(θ/2)  
q⃗ = sin(θ/2) · n̂  
```  
  
**Key advantage**: No singularities (unlike Euler angles which have gimbal lock).  
  
### Quaternion Kinematics  
  
Angular velocity **ω** relates to quaternion rate:  
  
```  
dq/dt = (1/2) Ω(ω) · q  
```  
  
Where Ω(ω) is the skew-symmetric matrix:  
  
```  
Ω(ω) = |  0    -ω₁  -ω₂  -ω₃ |  
       | ω₁     0    ω₃  -ω₂ |  
       | ω₂   -ω₃    0    ω₁ |  
       | ω₃    ω₂  -ω₁    0  |  
```  
  
### Quaternion Multiplication (Composition of Rotations)  
  
```  
q_AB ⊗ q_BC = q_AC  
```  
  
The ⊗ operator is:  
  
```  
p ⊗ q = [p₀q₀ - p⃗·q⃗, p₀q⃗ + q₀p⃗ + p⃗×q⃗]ᵀ  
```  
  
### Reduced Quaternion Model  
  
For control design, only the vector part is used:  
  
```  
q⃗_error = q_commanded ⊗ q_current*  
```  
  
The control law becomes:  
  
```  
u(t) = -K_p · q⃗_error - K_d · ω  
```  
  
This avoids the non-controllability issue of the full 4-element quaternion model.  
  
-----  
  
## 4. Error-Checking and Bounds Validation  
  
### Interval Arithmetic  
  
Instead of storing a single value **x**, store an interval [**x_lower**, **x_upper**]:  
  
```  
[a, b] + [c, d] = [a+c, b+d]  
[a, b] × [c, d] = [min(ac, ad, bc, bd), max(ac, ad, bc, bd)]  
```  
  
The true value is guaranteed to be within the interval.  
  
### Manifold Correction (Scaling Methods)  
  
#### Single Scaling Method  
  
At each integration step, scale the KS variables to maintain energy constraint:  
  
```  
u_corrected = λ · u  
```  
  
Where λ is chosen to satisfy:  
  
```  
2E = (du/ds)² - h/u²  
```  
  
This reduces error growth from quadratic to linear in time.  
  
#### Quadruple Scaling Method  
  
Adjusts all four amplitude and three phase differences to maintain:  
  
- Kepler energy relation  
- Angular momentum components  
- Full Laplace vector  
  
Reduces errors to machine epsilon level for all orbital elements except mean longitude.  
  
### Time Element Method  
  
Introduces an additional variable for physical time:  
  
```  
dt/ds = r  
τ(s) = ∫ r(s') ds'  
```  
  
This changes error growth from quadratic to linear with respect to physical time.  
  
-----  
  
## 5. Coordinate Transformations for Numerical Stability  
  
### Eccentric Anomaly vs. True Anomaly  
  
For high-eccentricity orbits, use eccentric anomaly **E**:  
  
```  
r = a(1 - e cos E)  
```  
  
Instead of true anomaly **f**, which has a singularity at e=1.  
  
### Mean Anomaly via Kepler’s Equation  
  
```  
M = E - e sin E  
```  
  
This is numerically well-behaved and can be solved iteratively with Newton’s method.  
  
### Angle Normalization with Modulo  
  
To keep angles in range [0, 2π):  
  
```  
θ_normalized = θ - 2π · floor(θ / 2π)  
```  
  
Or equivalently:  
  
```  
θ_normalized = θ mod 2π  
```  
  
But in practice, for continuous integration:  
  
```  
if θ > π:  
    θ = θ - 2π  
elif θ < -π:  
    θ = θ + 2π  
```  
  
-----  
  
## 6. NASA’s PRECiSA Tool - Formal Verification  
  
### Symbolic Error Bound  
  
PRECiSA computes a symbolic expression for round-off error:  
  
```  
err(f(x)) = f_float(x) - f_real(x)  
```  
  
Where:  
  
- **f_float** = floating-point implementation  
- **f_real** = mathematically exact function  
  
### Compositional Semantics  
  
For a sequence of operations:  
  
```  
err(f∘g) ≤ err(f) + |df/dx| · err(g) + rounding_err  
```  
  
This provides **provably correct bounds** on accumulated error.  
  
### Branch-and-Bound Algorithm  
  
Given input ranges, PRECiSA uses interval arithmetic to compute:  
  
```  
max|err(f(x))| for all x ∈ [x_min, x_max]  
```  
  
The bounds are formally verified using the PVS theorem prover.  
  
-----  
  
## 7. Practical Implementation Guidelines  
  
### Error Accumulation Formula  
  
For **n** sequential operations with round-off error ε per operation:  
  
```  
Total error ≈ √n · ε  (random walk)  
```  
  
Or worst case:  
  
```  
Total error ≤ n · ε  (systematic)  
```  
  
### Avoiding Catastrophic Cancellation  
  
Instead of:  
  
```  
x - y  (when x ≈ y)  
```  
  
Reformulate as:  
  
```  
(x² - y²)/(x + y)  or  x(1 - y/x)  
```  
  
### Guard Digits  
  
Use extended precision (80-bit) for intermediate calculations, then round to double (64-bit) for storage.  
  
### Kahan Summation Algorithm  
  
For summing many floating-point numbers:  
  
```  
sum = 0  
c = 0  // compensation  
for each value in values:  
    y = value - c  
    t = sum + y  
    c = (t - sum) - y  
    sum = t  
```  
  
This reduces accumulated round-off error from O(nε) to O(ε).  
  
-----  
  
## Summary  
  
The aerospace industry employs a multi-layered approach:  
  
1. **Hardware**: Use double precision (53 bits) instead of single (24 bits)  
1. **Mathematical transformations**: KS regularization, DROMO, quaternions  
1. **Time transformations**: Sundman transformations to remove singularities  
1. **Continuous monitoring**: Scaling methods to correct drift  
1. **Formal verification**: Tools like PRECiSA to prove error bounds  
1. **Algorithm design**: Kahan summation, avoiding cancellation, interval arithmetic  
  
These techniques don’t eliminate floating-point error, but they **bound and control it** to maintain accuracy over long mission durations.  
  
