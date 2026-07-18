# SINE WAVE ALGORITHM  
```
z = A × sin(k × r + ω × t + φ)


```
## LOGARITHMIC SPIRAL PATTERN  
```
r = a × e^(b×θ), z = A × sin(k×ln(r+1) + ω×t + φ)

```
## COSINE WAVE ALGORITHM  
```
z = A × cos(k × r + ω × t + φ)

```
## COMPOSITE WAVE ALGORITHM  
```
z = A × [sin(k×r + ω×t + φ) + 0.5×sin(2k×r + 1.5ω×t + φ)]

```
## ROSE CURVE PATTERN  
```
r = a × sin(n×θ), z = A × sin(n×θ + ω×t + φ) × sin(k×r + φ)

```
## CARDIOID PATTERN  
```
r = a(1 + cos θ), z = A × (1 + cos(θ + ω×t)) × sin(k×r + φ)

```
## FIBONACCI SPIRAL PATTERN  
```
θ = n × 137.5°, z = A × sin(k×r + θ×2.39996)

```
## JULIA SET FRACTAL PATTERN  
```
z_{n+1} = z_n² + c, c = -0.7269 + 0.1889i

```
## MANDELBROT FRACTAL PATTERN  
```
z_{n+1} = z_n² + c, iterations → wave height

```
## DRAGON CURVE PATTERN  
```
z = A × sin(k×(|x|+|y|)×0.5 + ω×t + φ) × cos(k×(x-y)×0.5 +

```
## KOCH SNOWFLAKE PATTERN  
```
z = A × [sin(3k×x) + sin(3k×(x×0.5+y×0.866)) + sin(3k×(x×0.5-y×0.866))] / 3

```
## SIERPINSKI TRIANGLE PATTERN  
```
z = A × sin(k×(sx+sy) + ω×t + φ) × sin(k×|sx-sy| + φ)

```
## PERLIN NOISE ALGORITHM  
```
P(x) = fade(f) × lerp + gradient interpolation

```
## SIMPLEX NOISE ALGORITHM  
```
S(x) = skewed grid sampling with gradient vectors

```
## FRACTIONAL BROWNIAN MOTION  
```
fBm(x) = Σ (1/2^i) noise(2^i × x)

```
 **EXPORT HIGH RESOLUTION** **EXPORT DEPTH MAP**  
  
**RIDGED NOISE ALGORITHM**  
```
R(x) = 1 - |fBm(x)|

```
## TURBULENCE ALGORITHM  
```
T(x) = Σ |noise(2^i × x)|/2^i

```
## VORONOI NOISE PATTERN  
```
min distance to random cell points

```
  
**4D Hypersphere**: x = cos(u)cos(v), y = cos(u)sin(v), z = sin(u)cos(w), w = sin(u)sin(w). Traces a 4-dimensional sphere; project to 3D by rotating through the w-axis.  
**Clifford Torus (4D)**: x = cos(u), y = sin(u), z = cos(v), w = sin(v). Creates a donut in 4D space; stereographic projection reveals intricate knot-like structures.  
**Hopf Fibration**: Maps 3D rotations onto a circle using quaternions; each fiber is a great circle in 4D, visualized through 3D projection as linked circles.  
**Klein Bottle (4D)**: u ∈ [0,2π], v ∈ [0,2π]. Non-orientable surface requiring 4D to avoid self-intersection; 3D embedding creates the classic self-intersecting bottle.  
**5D Simplex Noise Curves**: x = sin(t), y = cos(t), z = Perlin(t, a), w = Perlin(t, b), v = Perlin(t, c). Blends periodic and fractal dimensions.  
**Lissajous in nD**: x_i = sin(a_i × t + φ_i) for each dimension i. Simple but reveals complex patterns across many dimensions simultaneously.  
**Stereographic Projection Bridge**: Map nD → 3D: divide all coordinates by (1 - x_n) to compress higher dimensions into viewable space while preserving topological properties.  
