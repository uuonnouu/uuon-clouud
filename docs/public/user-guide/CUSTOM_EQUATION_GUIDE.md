# Custom Equation Renderer - Universal Format Support
## Paste Any Mathematical Formula and Render Instantly

### ✅ **SYSTEM STATUS: FULLY OPERATIONAL**

The custom equation renderer now understands **ALL** mathematical formats:
- ✅ JavaScript syntax
- ✅ Mathematical notation (x^2, √x, π)
- ✅ Python-style syntax
- ✅ LaTeX-like notation
- ✅ Coordinate assignments (x=..., y=..., z=...)
- ✅ Array notation ([x, y, z])
- ✅ Comma-separated values
- ✅ Multi-line equations

---

## 📝 **Supported Input Formats**

### Format 1: JavaScript with Return Statement
```javascript
return [
  a * Math.cos(u) * Math.sin(v),
  b * Math.sin(u) * Math.sin(v),
  c * Math.cos(v)
];
```

### Format 2: Coordinate Assignments
```javascript
x = a * cos(u) * sin(v)
y = b * sin(u) * sin(v)
z = c * cos(v)
```

### Format 3: Array Notation (No Return)
```javascript
[
  a * cos(u) * sin(v),
  b * sin(u) * sin(v),
  c * cos(v)
]
```

### Format 4: Comma-Separated Values
```javascript
a*cos(u)*sin(v), b*sin(u)*sin(v), c*cos(v)
```

### Format 5: Mathematical Notation (Auto-Converted)
```
x = a*cos(u)*sin(v)
y = b*sin(u)*sin(v)  
z = c*cos^2(v) + d*√(u)
```

### Format 6: Python-Style
```python
x: a * cos(u) * sin(v)
y: b * sin(u) * sin(v)
z: c * cos(v)
```

---

## 🧮 **Automatic Mathematical Conversions**

The parser automatically converts common mathematical notation:

| Input | Converted To |
|-------|--------------|
| `sin(x)` | `Math.sin(x)` |
| `cos(x)` | `Math.cos(x)` |
| `tan(x)` | `Math.tan(x)` |
| `sqrt(x)` or `√x` | `Math.sqrt(x)` |
| `exp(x)` | `Math.exp(x)` |
| `log(x)` or `ln(x)` | `Math.log(x)` |
| `abs(x)` | `Math.abs(x)` |
| `x^2` | `Math.pow(x, 2)` |
| `2x` | `2*x` (implicit multiplication) |
| `pi` or `π` | `Math.PI` |
| `e` | `Math.E` |

---

## 🔤 **Available Parameters (a-z)**

All 26 alphabet parameters are available in your equations:

| Parameter | Default | Purpose |
|-----------|---------|---------|
| **a, b, c** | 1, 1, 1 | Primary scaling (X, Y, Z) |
| **d-m** | 0 | Transformations (Twist, Wave, Ripple, etc.) |
| **n-z** | 0 | Advanced modulation |

### Special UV Variables
- **u**: First parametric variable (typically 0 → 2π)
- **v**: Second parametric variable (typically 0 → π)

---

## 📐 **Example Equations**

### Basic Sphere
```javascript
a * sin(v) * cos(u),
b * sin(v) * sin(u),
c * cos(v)
```

### Torus
```javascript
x = (a + b*cos(v)) * cos(u)
y = (a + b*cos(v)) * sin(u)
z = b * sin(v)
```

### Wave Surface
```javascript
return [
  u * a,
  v * b,
  c * sin(d * u) * cos(e * v)
];
```

### Helix
```
a*cos(u), a*sin(u), b*u
```

### Möbius Strip
```javascript
return [
  (1 + v/2 * cos(u/2)) * cos(u),
  (1 + v/2 * cos(u/2)) * sin(u),
  v/2 * sin(u/2)
];
```

### Klein Bottle
```javascript
x = (a + b*cos(v/2)*sin(u) - b*sin(v/2)*sin(2*u)) * cos(v)
y = (a + b*cos(v/2)*sin(u) - b*sin(v/2)*sin(2*u)) * sin(v)
z = b*sin(v/2)*sin(u) + b*cos(v/2)*sin(2*u)
```

### Trefoil Knot
```
x: sin(u) + 2*sin(2*u)
y: cos(u) - 2*cos(2*u)
z: -sin(3*u)
```

### Parametric Heart
```
[
  16 * sin(u)^3,
  13*cos(u) - 5*cos(2*u) - 2*cos(3*u) - cos(4*u),
  0
]
```

---

## ⚙️ **How It Works**

1. **Paste your equation** into the purple paste box
2. **Click "Render Now"** - instant validation and parsing
3. **Automatic format detection** - works with any syntax
4. **Real-time preview** - see your shape immediately
5. **Full parameter control** - adjust a-z sliders
6. **Export ready** - GLB/GLTF with all shading modes

---

## 🎨 **Advanced Features**

### Use Parameters for Dynamic Control
```javascript
// Create a parametric flower with 'm' controlling petal count
return [
  a * cos(m * u) * sin(v),
  b * sin(m * u) * sin(v),
  c * cos(v)
];
```
Now slider **m** controls how many petals!

### Combine Multiple Effects
```javascript
// Wave + Twist + Taper
x = a * (1 + l*(v-0.5)) * cos(u + d*v)
y = b * (1 + l*(v-0.5)) * sin(u + d*v)
z = c * v + h * sin(g*u)
```

### Complex Mathematical Forms
```javascript
return [
  a * sinh(u) * cos(v),
  b * sinh(u) * sin(v),  
  c * cosh(u)
];
```

---

## ✅ **Validation & Error Handling**

The parser checks:
- ✅ Return type must be `[number, number, number]`
- ✅ All values must be finite numbers
- ✅ Syntax must be valid JavaScript
- ✅ Test evaluation at (u=0, v=0)

**Error messages are instant and helpful:**
- "Must define x, y, and z coordinates"
- "Expected 3 coordinates, got 2"
- "Equation must return an array [x, y, z]"
- "Parse error: unexpected token"

---

## 🚀 **Pro Tips**

1. **Start simple** - test with basic shapes first
2. **Use Math functions** - all JavaScript Math.* available
3. **Parameter sliders** - a-m give real-time control
4. **UV domains** - adjust uMin/uMax/vMin/vMax for different ranges
5. **Mesh density** - increase uSegments/vSegments for smoother curves
6. **Copy examples** - use the example equations as templates

---

## 📊 **Supported Functions**

### Trigonometric
`sin, cos, tan, asin, acos, atan, sinh, cosh, tanh`

### Algebraic
`sqrt, pow, abs, exp, log, ln`

### Rounding
`floor, ceil, round`

### Constants
`PI, E, π`

---

## 🔐 **Export Your Custom Shapes**

Once rendered, your custom equation becomes a full shape:
- ✅ **7 shading modes** (Flat, Gouraud, Phong, PBR, Normal, Displacement, Parallax)
- ✅ **All export formats** (GLB, GLTF, USDZ, OBJ, STL, PLY)
- ✅ **Password protected** (sonOF2025!)
- ✅ **Production ready** with metadata

---

## 💡 **Quick Start Examples**

### Copy-Paste Ready Shapes

**Sphere:**
```
a*sin(v)*cos(u), b*sin(v)*sin(u), c*cos(v)
```

**Cylinder:**
```
a*cos(u), b*sin(u), c*v
```

**Cone:**
```
a*v*cos(u), b*v*sin(u), c*v
```

**Saddle:**
```
a*u, b*v, c*(u^2 - v^2)
```

---

*© 2025 UUON Foundation Inc. - Custom Equation Renderer*
