## Fractal Terrain Art  
##   
## 1. Perlin Noise Algorithm  
  
  
javascript  
class PerlinNoise {  
    constructor(seed = 0) {  
        this.gradients = {};  
        this.memory = {};  
        this.seed = seed;  
    }  
      
    *// Generate random gradient vector*  
    randomGradient(ix, iy) {  
        const w = 32;  
        const s = w / 2;  
        let a = ix, b = iy;  
        a *= 3284157443; b ^= a << s | a >> (w - s);  
        b *= 1911520717; a ^= b << s | b >> (w - s);  
        a *= 2048419325;  
        const random = a * (Math.PI / ~(~0 >> 1));  
        return [Math.cos(random), Math.sin(random)];  
    }  
      
    *// Dot product of gradient and distance vectors*  
    dotGridGradient(ix, iy, x, y) {  
        const gradient = this.randomGradient(ix, iy);  
        const dx = x - ix;  
        const dy = y - iy;  
        return (dx * gradient[0] + dy * gradient[1]);  
    }  
      
    *// Smooth interpolation function*  
    smoothstep(t) {  
        return t * t * (3 - 2 * t);  
    }  
      
    *// Main noise function*  
    noise(x, y) {  
        const x0 = Math.floor(x);  
        const x1 = x0 + 1;  
        const y0 = Math.floor(y);  
        const y1 = y0 + 1;  
          
        const sx = this.smoothstep(x - x0);  
        const sy = this.smoothstep(y - y0);  
          
        const n0 = this.dotGridGradient(x0, y0, x, y);  
        const n1 = this.dotGridGradient(x1, y0, x, y);  
        const ix0 = n0 * (1 - sx) + n1 * sx;  
          
        const n2 = this.dotGridGradient(x0, y1, x, y);  
        const n3 = this.dotGridGradient(x1, y1, x, y);  
        const ix1 = n2 * (1 - sx) + n3 * sx;  
          
        return ix0 * (1 - sy) + ix1 * sy;  
    }  
}  
## 2. Fractal Brownian Motion (fBm)  
  
  
javascript  
function fractalBrownianMotion(x, y, octaves = 6, persistence = 0.5, scale = 0.01) {  
    const noise = new PerlinNoise();  
    let value = 0;  
    let amplitude = 1;  
    let frequency = scale;  
    let maxValue = 0;  
      
    for (let i = 0; i < octaves; i++) {  
        value += noise.noise(x * frequency, y * frequency) * amplitude;  
        maxValue += amplitude;  
        amplitude *= persistence;  
        frequency *= 2;  
    }  
      
    return value / maxValue;  
}  
## 3. Golden Ratio (Phi) Based Patterns  
  
  
javascript  
const PHI = (1 + Math.sqrt(5)) / 2; *// Golden ratio: 1.618...*  
const PHI_CONJUGATE = 1 / PHI;      *// 0.618...*  
  
function goldenSpiral(t, scale = 1) {  
    const r = scale * Math.pow(PHI, t / (Math.PI / 2));  
    return {  
        x: r * Math.cos(t),  
        y: r * Math.sin(t)  
    };  
}  
  
function phiBasedNoise(x, y) {  
    const angle = Math.atan2(y, x);  
    const distance = Math.sqrt(x * x + y * y);  
      
    *// Use phi in frequency calculations*  
    const freq1 = PHI * 0.1;  
    const freq2 = PH  
  
  
  
  
Retry  
Claude does not have the ability to run the code it generates yet.  
PR  
in times new roman, plain text. for me to copy and paste  
Edit  
  
**Procedural Fractal Art Algorithms**  
**1. Perlin Noise Algorithm**  
  
  
class PerlinNoise {  
    constructor(seed = 0) {  
        this.gradients = {};  
        this.memory = {};  
        this.seed = seed;  
    }  
      
    randomGradient(ix, iy) {  
        const w = 32;  
        const s = w / 2;  
        let a = ix, b = iy;  
        a *= 3284157443;   
        b ^= a << s | a >> (w - s);  
        b *= 1911520717;   
        a ^= b << s | b >> (w - s);  
        a *= 2048419325;  
        const random = a * (Math.PI / ~(~0 >> 1));  
        return [Math.cos(random), Math.sin(random)];  
    }  
      
    dotGridGradient(ix, iy, x, y) {  
        const gradient = this.randomGradient(ix, iy);  
        const dx = x - ix;  
        const dy = y - iy;  
        return (dx * gradient[0] + dy * gradient[1]);  
    }  
      
    smoothstep(t) {  
        return t * t * (3 - 2 * t);  
    }  
      
    noise(x, y) {  
        const x0 = Math.floor(x);  
        const x1 = x0 + 1;  
        const y0 = Math.floor(y);  
        const y1 = y0 + 1;  
          
        const sx = this.smoothstep(x - x0);  
        const sy = this.smoothstep(y - y0);  
          
        const n0 = this.dotGridGradient(x0, y0, x, y);  
        const n1 = this.dotGridGradient(x1, y0, x, y);  
        const ix0 = n0 * (1 - sx) + n1 * sx;  
          
        const n2 = this.dotGridGradient(x0, y1, x, y);  
        const n3 = this.dotGridGradient(x1, y1, x, y);  
        const ix1 = n2 * (1 - sx) + n3 * sx;  
          
        return ix0 * (1 - sy) + ix1 * sy;  
    }  
}  
**2. Fractal Brownian Motion (fBm)**  
  
  
function fractalBrownianMotion(x, y, octaves = 6, persistence = 0.5, scale = 0.01) {  
    const noise = new PerlinNoise();  
    let value = 0;  
    let amplitude = 1;  
    let frequency = scale;  
    let maxValue = 0;  
      
    for (let i = 0; i < octaves; i++) {  
        value += noise.noise(x * frequency, y * frequency) * amplitude;  
        maxValue += amplitude;  
        amplitude *= persistence;  
        frequency *= 2;  
    }  
      
    return value / maxValue;  
}  
**3. Golden Ratio (Phi) Based Patterns**  
  
  
const PHI = (1 + Math.sqrt(5)) / 2;  
const PHI_CONJUGATE = 1 / PHI;  
  
function goldenSpiral(t, scale = 1) {  
    const r = scale * Math.pow(PHI, t / (Math.PI / 2));  
    return {  
        x: r * Math.cos(t),  
        y: r * Math.sin(t)  
    };  
}  
  
function phiBasedNoise(x, y) {  
    const angle = Math.atan2(y, x);  
    const distance = Math.sqrt(x * x + y * y);  
      
    const freq1 = PHI * 0.1;  
    const freq2 = PHI_CONJUGATE * 0.05;  
      
    const noise1 = fractalBrownianMotion(x, y, 4, 0.5, freq1);  
    const noise2 = fractalBrownianMotion(x * PHI, y * PHI, 3, 0.6, freq2);  
      
    return (noise1 + noise2) * 0.5;  
}  
**4. Fractal Terrain Generation**  
  
  
function generateTerrain(width, height, scale = 0.01) {  
    const heightmap = [];  
      
    for (let y = 0; y < height; y++) {  
        heightmap[y] = [];  
        for (let x = 0; x < width; x++) {  
            let elevation = 0;  
              
            elevation += fractalBrownianMotion(x, y, 6, 0.5, scale) * 0.5;  
            elevation += fractalBrownianMotion(x, y, 4, 0.6, scale * 2) * 0.3;  
            elevation += fractalBrownianMotion(x, y, 2, 0.7, scale * 4) * 0.2;  
              
            heightmap[y][x] = Math.max(0, Math.min(1, elevation));  
        }  
    }  
      
    return heightmap;  
}  
**5. Procedural Color Mapping**  
  
  
function mapHeightToColor(height, colorScheme = 'terrain') {  
    const schemes = {  
        terrain: [  
            {height: 0.0, color: [0, 0, 139]},      // Deep blue  
            {height: 0.2, color: [0, 191, 255]},    // Light blue  
            {height: 0.4, color: [255, 255, 0]},    // Yellow  
            {height: 0.6, color: [0, 128, 0]},      // Green  
            {height: 0.8, color: [139, 69, 19]},    // Brown  
            {height: 1.0, color: [255, 255, 255]}   // White  
        ],  
          
        fire: [  
            {height: 0.0, color: [0, 0, 0]},        // Black  
            {height: 0.3, color: [139, 0, 0]},      // Dark red  
            {height: 0.6, color: [255, 140, 0]},    // Orange  
            {height: 0.9, color: [255, 255, 0]},    // Yellow  
            {height: 1.0, color: [255, 255, 255]}   // White  
        ]  
    };  
      
    const palette = schemes[colorScheme];  
      
    for (let i = 0; i < palette.length - 1; i++) {  
        const current = palette[i];  
        const next = palette[i + 1];  
          
        if (height >= current.height && height <= next.height) {  
            const t = (height - current.height) / (next.height - current.height);  
              
            const r = Math.round(current.color[0] + t * (next.color[0] - current.color[0]));  
            const g = Math.round(current.color[1] + t * (next.color[1] - current.color[1]));  
            const b = Math.round(current.color[2] + t * (next.color[2] - current.color[2]));  
              
            return [r, g, b];  
        }  
    }  
      
    return palette[palette.length - 1].color;  
}  
**6. Simplex Noise (Alternative to Perlin)**  
  
  
function simplexNoise(x, y) {  
    const F2 = 0.5 * (Math.sqrt(3) - 1);  
    const G2 = (3 - Math.sqrt(3)) / 6;  
      
    const s = (x + y) * F2;  
    const i = Math.floor(x + s);  
    const j = Math.floor(y + s);  
      
    const t = (i + j) * G2;  
    const X0 = i - t;  
    const Y0 = j - t;  
    const x0 = x - X0;  
    const y0 = y - Y0;  
      
    let i1, j1;  
    if (x0 > y0) {  
        i1 = 1; j1 = 0;  
    } else {  
        i1 = 0; j1 = 1;  
    }  
      
    const x1 = x0 - i1 + G2;  
    const y1 = y0 - j1 + G2;  
    const x2 = x0 - 1 + 2 * G2;  
    const y2 = y0 - 1 + 2 * G2;  
      
    const n0 = gradient(i, j, x0, y0);  
    const n1 = gradient(i + i1, j + j1, x1, y1);  
    const n2 = gradient(i + 1, j + 1, x2, y2);  
      
    return 70 * (n0 + n1 + n2);  
}  
  
function gradient(i, j, x, y) {  
    const t = 0.5 - x * x - y * y;  
    if (t < 0) return 0;  
      
    const grad = pseudoRandom(i, j);  
    return t * t * t * t * (grad[0] * x + grad[1] * y);  
}  
**7. Mandelbrot Set Algorithm**  
  
  
function mandelbrot(cx, cy, maxIterations = 100) {  
    let x = 0, y = 0;  
    let iteration = 0;  
      
    while (x * x + y * y <= 4 && iteration < maxIterations) {  
        const xtemp = x * x - y * y + cx;  
        y = 2 * x * y + cy;  
        x = xtemp;  
        iteration++;  
    }  
      
    return iteration;  
}  
  
function mandelbrotSet(width, height, zoom = 1, offsetX = 0, offsetY = 0) {  
    const result = [];  
      
    for (let py = 0; py < height; py++) {  
        result[py] = [];  
        for (let px = 0; px < width; px++) {  
            const cx = (px - width / 2) / (width / 4) / zoom + offsetX;  
            const cy = (py - height / 2) / (height / 4) / zoom + offsetY;  
              
            const iterations = mandelbrot(cx, cy, 80);  
            result[py][px] = iterations / 80;  
        }  
    }  
      
    return result;  
}  
**8. Voronoi Diagram Algorithm**  
  
  
function voronoiDiagram(width, height, points) {  
    const diagram = [];  
      
    for (let y = 0; y < height; y++) {  
        diagram[y] = [];  
        for (let x = 0; x < width; x++) {  
            let minDistance = Infinity;  
            let closestPoint = 0;  
              
            for (let i = 0; i < points.length; i++) {  
                const dx = x - points[i].x;  
                const dy = y - points[i].y;  
                const distance = Math.sqrt(dx * dx + dy * dy);  
                  
                if (distance < minDistance) {  
                    minDistance = distance;  
                    closestPoint = i;  
                }  
            }  
              
            diagram[y][x] = {  
                region: closestPoint,  
                distance: minDistance  
            };  
        }  
    }  
      
    return diagram;  
}  
**9. Cellular Automata for Organic Patterns**  
  
  
function cellularAutomata(width, height, iterations = 5, fillProbability = 0.45) {  
    let grid = initializeGrid(width, height, fillProbability);  
      
    for (let i = 0; i < iterations; i++) {  
        grid = smoothGrid(grid, width, height);  
    }  
      
    return grid;  
}  
  
function initializeGrid(width, height, fillProbability) {  
    const grid = [];  
    for (let y = 0; y < height; y++) {  
        grid[y] = [];  
        for (let x = 0; x < width; x++) {  
            grid[y][x] = Math.random() < fillProbability ? 1 : 0;  
        }  
    }  
    return grid;  
}  
  
function smoothGrid(grid, width, height) {  
    const newGrid = [];  
      
    for (let y = 0; y < height; y++) {  
        newGrid[y] = [];  
        for (let x = 0; x < width; x++) {  
            const neighbors = countNeighbors(grid, x, y, width, height);  
            newGrid[y][x] = neighbors >= 4 ? 1 : 0;  
        }  
    }  
      
    return newGrid;  
}  
  
function countNeighbors(grid, x, y, width, height) {  
    let count = 0;  
      
    for (let dy = -1; dy <= 1; dy++) {  
        for (let dx = -1; dx <= 1; dx++) {  
            if (dx === 0 && dy === 0) continue;  
              
            const nx = x + dx;  
            const ny = y + dy;  
              
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {  
                count += grid[ny][nx];  
            } else {  
                count += 1;  
            }  
        }  
    }  
      
    return count;  
}  
**10. Domain Warping for Enhanced Detail**  
  
  
function domainWarp(x, y, strength = 0.1) {  
    const warpX = fractalBrownianMotion(x * 0.1, y * 0.1, 4, 0.5, 0.02);  
    const warpY = fractalBrownianMotion(x * 0.1 + 100, y * 0.1 + 100, 4, 0.5, 0.02);  
      
    return {  
        x: x + warpX * strength,  
        y: y + warpY * strength  
    };  
}  
  
function warpedNoise(x, y, strength = 0.1) {  
    const warped = domainWarp(x, y, strength);  
    return fractalBrownianMotion(warped.x, warped.y, 6, 0.5, 0.01);  
}  
