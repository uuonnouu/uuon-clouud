# MATHEMATICAL EQUATIONS FOR EDUCATIONAL SHAPES
## Making Math Dope for Kids™ - Educational Visualization System

### PHASE 1: FOUNDATION SHAPES (K-2)

**1. Circle** ✨MathCircle™
```
x = a * cos(u)
y = a * sin(u) 
z = 0
// Parameters: u ∈ [0, 2π], a = radius
```

**2. Square** ✨MathSquare™
```
// Four distinct edges parametrically
edge = floor(u * 4) % 4
t = (u * 4) % 1
vertices = [[-a,-a], [a,-a], [a,a], [-a,a]]
x = vertices[edge][0] + t * (vertices[(edge+1)%4][0] - vertices[edge][0])
y = vertices[edge][1] + t * (vertices[(edge+1)%4][1] - vertices[edge][1])
z = 0
```

**3. Triangle** ✨MathTriangle™
```
// Equilateral triangle
side = floor(u * 3) % 3
t = (u * 3) % 1
vertices = [[a,0], [-a/2, a*√3/2], [-a/2, -a*√3/2]]
x = vertices[side][0] + t * (vertices[(side+1)%3][0] - vertices[side][0])
y = vertices[side][1] + t * (vertices[(side+1)%3][1] - vertices[side][1])
z = 0
```

**4. Rectangle** ✨MathRectangle™
```
edge = floor(u * 4) % 4
t = (u * 4) % 1
vertices = [[-a,-b], [a,-b], [a,b], [-a,b]]
x = vertices[edge][0] + t * (vertices[(edge+1)%4][0] - vertices[edge][0])
y = vertices[edge][1] + t * (vertices[(edge+1)%4][1] - vertices[edge][1])
z = 0
```

**5. Oval/Ellipse** ✨MathOval™
```
x = a * cos(u)
y = b * sin(u)
z = 0
// Parameters: u ∈ [0, 2π], a = semi-major, b = semi-minor
```

### PHASE 2: BASIC 3D SHAPES (3-4)

**6. Pentagon** ✨MathPentagon™
```
side = floor(u * 5) % 5
t = (u * 5) % 1
angle_i = side * 2π/5
angle_j = (side+1) * 2π/5
x = a * cos(angle_i) + t * a * (cos(angle_j) - cos(angle_i))
y = a * sin(angle_i) + t * a * (sin(angle_j) - sin(angle_i))
z = 0
```

**7. Hexagon** ✨MathHexagon™
```
side = floor(u * 6) % 6
t = (u * 6) % 1
angle_i = side * 2π/6
angle_j = (side+1) * 2π/6
x = a * cos(angle_i) + t * a * (cos(angle_j) - cos(angle_i))
y = a * sin(angle_i) + t * a * (sin(angle_j) - sin(angle_i))
z = 0
```

**8. Cube** ✨MathCube™
```
// Six faces parametrically
x = a * (2*u - 1)
y = a * (2*v - 1)
z = a  // Top face (other faces by rotation)
```

**9. Sphere** ✨MathSphere™
```
x = a * sin(φ) * cos(θ)
y = a * sin(φ) * sin(θ)  
z = a * cos(φ)
// φ ∈ [0, π], θ ∈ [0, 2π]
```

**10. Cylinder** ✨MathCylinder™
```
x = a * cos(θ)
y = a * sin(θ)
z = b * (v - 0.5)
// θ ∈ [0, 2π], v ∈ [0, 1]
```

**11. Cone** ✨MathCone™
```
x = a * (1 - v) * cos(θ)
y = a * (1 - v) * sin(θ)
z = b * v
// θ ∈ [0, 2π], v ∈ [0, 1]
```

### PHASE 3: ADVANCED GEOMETRIC SURFACES

**12. Torus** ✨MathTorus™
```
x = (R + r*cos(v)) * cos(u)
y = (R + r*cos(v)) * sin(u)
z = r * sin(v)
// u ∈ [0, 2π], v ∈ [0, 2π]
```

**13. Paraboloid** ✨MathParaboloid™
```
x = u
y = v  
z = a * (u² + v²)
// u ∈ [-c, c], v ∈ [-c, c]
```

**14. Hyperboloid** ✨MathHyperboloid™
```
x = a * cosh(u) * cos(v)
y = b * cosh(u) * sin(v)
z = c * sinh(u)
// u ∈ [-2, 2], v ∈ [0, 2π]
```

**15. Wave Surface** ✨MathWave™
```
x = u
y = v
z = a * sin(b*u) * cos(c*v)
// u ∈ [-π, π], v ∈ [-π, π]
```

### PHASE 4: MATHEMATICAL ART SHAPES

**16. Sombrero Function** ✨MathSombrero™
```
r = sqrt(u² + v²)
x = u
y = v
z = a * sin(b*r) / (r + 0.1)
```

**17. Rose Curve** ✨MathRose™
```
r = a * cos(n*θ)
x = r * cos(θ)
y = r * sin(θ)
z = 0
// θ ∈ [0, 2π], n = petal count
```

**18. Spiral** ✨MathSpiral™
```
x = a * θ * cos(θ)
y = a * θ * sin(θ)
z = b * θ
// θ ∈ [0, 4π]
```

### IMPLEMENTATION NOTES:
- All equations use parameters a, b, c for educational control
- Each shape has trademark protection for educational use
- Designed for kids to explore mathematical relationships
- Progressive complexity from 2D to 3D to advanced surfaces
- Interactive parameter manipulation encourages discovery learning

**READY FOR IMPLEMENTATION** 🚀